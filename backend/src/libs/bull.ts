import { logger } from "@/config/logger";
import { Queue, QueueOptions, Worker, WorkerOptions, Processor } from "bullmq";

type ResourceKey = { key: string; mode: "read" | "write" };

type JobContext = {
  acquire: (resourceKey: ResourceKey) => void;
  release: (resourceKey: ResourceKey) => void;
  waitFor: (resourceKey: ResourceKey) => Promise<void>;
  using: <T>(resourceKey: ResourceKey, fn: () => Promise<T>) => Promise<T>;
};

type LockState = {
  readers: number;
  writer: boolean;
};

export class QueueManager<T extends Record<string, any>> {
  private queue: Queue<T[keyof T], any, Extract<keyof T, string>>;
  private workers: Worker<T[keyof T], any, Extract<keyof T, string>>[] = [];
  private processors: Partial<{
    [K in keyof T]: Processor<
      T[K] & { __jobCtx?: JobContext },
      any,
      Extract<K, string>
    >;
  }> = {};

  private resourceLocks = new Map<string, LockState>();

  constructor(
    public readonly name: string,
    queueOptions?: QueueOptions,
  ) {
    this.queue = new Queue(name, queueOptions);
  }

  /**
   * Type-safe processor registration
   */
  public registerProcessor<K extends Extract<keyof T, string>>(
    jobName: K,
    handler: Processor<T[K] & { __jobCtx?: JobContext }, any, K>,
  ): this {
    this.processors[jobName] = async (job) => {
      const resources: ResourceKey[] = (job.data as any)?.resourceKeys ?? [];

      const ctx: JobContext = {
        acquire: (r) => this.acquireResource(r),
        release: (r) => this.releaseResource(r),
        waitFor: (r) => this.waitForResource(r),
        using: (r, fn) => this.using(r, fn),
      };

      (job.data as any).__jobCtx = ctx;

      for (const r of resources) {
        await this.acquireResource(r);
      }

      try {
        return await handler(job);
      } catch (err) {
        logger.error(`[QueueManager]: Error occured in processor ${handler.name}`, { err })
      } finally {
        resources.forEach((r) => this.releaseResource(r));
      }
    };

    return this;
  }

  public async using<T>(r: ResourceKey, fn: () => Promise<T>) {
    await this.acquireResource(r);
    try {
      return await fn();
    } finally {
      this.releaseResource(r);
    }
  }

  public run(workerOptions?: WorkerOptions, count: number = 1): this {
    const mainProcessor: Processor<any, any, any> = async (job) => {
      const handler = this.processors[job.name];
      if (!handler) throw new Error(`No handler for job: ${job.name}`);
      return handler(job);
    };

    for (let i = 0; i < count; i++) {
      const worker = new Worker(this.name, mainProcessor, workerOptions);
      this.setupWorkerListeners(worker);
      this.workers.push(worker);
    }
    return this;
  }

  private setupWorkerListeners(worker: Worker) {
    worker.on("completed", (job) =>
      logger.info(`[${this.name}] ${job.name} done`),
    );
    worker.on("failed", (job, err) =>
      logger.error(`[${this.name}] ${job?.name} failed`, err),
    );
  }

  /**
   * Type-safe job adding
   */
  public async addJob<K extends Extract<keyof T, string>>(
    jobName: K,
    data: T[K] & { resourceKeys: ResourceKey[] },
    opts?: any,
  ) {
    return this.queue.add(jobName as any, data, opts);
  }

  private async acquireResource(r: ResourceKey) {
    await this.waitForResource(r);
    const state = this.resourceLocks.get(r.key) ?? {
      readers: 0,
      writer: false,
    };
    if (r.mode === "read") {
      state.readers += 1;
    } else {
      state.writer = true;
    }
    this.resourceLocks.set(r.key, state);
  }

  private releaseResource({ key, mode }: ResourceKey) {
    const state = this.resourceLocks.get(key);
    if (!state) return;
    if (mode === "read") {
      state.readers -= 1;
    } else {
      state.writer = false;
    }
    if (state.readers <= 0 && !state.writer) {
      this.resourceLocks.delete(key);
    } else {
      this.resourceLocks.set(key, state);
    }
  }

  private async waitForResource({
    interval = 200,
    key,
    mode,
  }: ResourceKey & { interval?: number }) {
    while (true) {
      const state = this.resourceLocks.get(key);
      if (!state) break;
      if (mode === "read" && !state.writer) break;
      if (mode === "write" && state.readers === 0 && !state.writer) break;
      await new Promise((r) => setTimeout(r, interval));
    }
  }
}
