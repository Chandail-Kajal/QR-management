import { Queue, QueueOptions, Worker } from "bullmq";

type TaskHandler<I, O> = (input: I) => Promise<O>;

export class NWorker<I, O> {
  private queue: Queue<I, O, "task">;
  private worker?: Worker<I, O, "task">;
  private handler?: TaskHandler<I, O>;

  constructor(
    public readonly name: string,
    private readonly queueOptions?: QueueOptions,
  ) {
    this.queue = new Queue(name, queueOptions);
  }

  register(handler: TaskHandler<I, O>) {
    this.handler = handler;
    return this;
  }

  start(workerOptions?: WorkerOptions) {
    if (!this.handler) throw new Error("No handler registered");

    this.worker = new Worker(
      this.name,
      async (job) => this.handler!(job.data),
      { ...workerOptions } as any,
    );

    return this;
  }

  async add<T>(data: I, opts?: any) {
    return this.queue.add("task" as any, data as any, opts);
  }

  async runSync(data: I): Promise<O> {
    if (!this.handler) throw new Error("No handler registered");
    return this.handler(data);
  }
}
