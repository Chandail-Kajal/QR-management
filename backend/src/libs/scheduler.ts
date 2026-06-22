import cron, { type ScheduledTask } from "node-cron";
import {
  JobConfig,
  JobStatus,
  ScheduleConfig,
  TaskSchedulerFactoryConfig,
  JobDefinition,
  JobStore,
} from "@/types";
import deepEqual from "fast-deep-equal";
const cronSchedule = cron.schedule;

type InternalJob = {
  name: string;
  schedule: string | null;
  runAt?: Date;
  handler: () => Promise<void>;
  status: JobStatus;
  runOnStart: boolean;
  preventOverlap: boolean;
  isRunning: boolean;
  task?: ScheduledTask;
  lateToleranceMs?: number;
};

class TaskScheduler {
  private jobs = new Map<string, InternalJob>();

  register(config: JobConfig) {
    const { schedule, runAt, lateToleranceMs } = this.buildSchedule(
      config.schedule,
    );

    this.jobs.set(config.name, {
      name: config.name,
      schedule,
      runAt,
      lateToleranceMs,

      handler: config.handler,
      status: "stopped",
      runOnStart: config.runOnStart ?? false,
      preventOverlap: config.preventOverlap ?? true,
      isRunning: false,
    });

    return this;
  }

  updateSchedule(name: string, schedule: ScheduleConfig) {
    const job = this.jobs.get(name);

    if (!job) return;

    const built = this.buildSchedule(schedule);
    job.schedule = built.schedule;
    job.runAt = built.runAt;
  }

  get(name: string) {
    return this.jobs.get(name);
  }

  start() {
    for (const job of this.jobs.values()) {
      this.startJob(job.name);
    }
  }

  reloadJob(name: string, schedule: ScheduleConfig) {
    const job = this.jobs.get(name);
    if (!job) return console.error(`Job not found: ${name}`);

    if (job.status === "active") {
      job.task?.stop();
      job.task = undefined;
    }

    const { schedule: cron, runAt } = this.buildSchedule(schedule);

    job.schedule = cron;
    job.runAt = runAt;

    if (job.status === "active") {
      if (!job.schedule && job.runAt) {
        this.startOneTimeJob(job);
      } else {
        job.task = cron
          ? cronSchedule(cron, () => {
              void this.execute(job);
            })
          : undefined;
      }
    }
  }

  reloadJobForce(name: string, schedule: ScheduleConfig) {
    const job = this.jobs.get(name);
    if (!job) return;

    const wasActive = job.status === "active";
    this.stop(name);

    this.reloadJob(name, schedule);

    if (wasActive) {
      this.startJob(name);
    }
  }

  startJob(name: string) {
    const job = this.jobs.get(name);
    if (!job || job.status === "active") return;

    if (!job.schedule && job.runAt) {
      this.startOneTimeJob(job);
      return;
    }

    if (job.runOnStart) {
      void this.execute(job);
    }

    job.task = cron.schedule(job.schedule!, () => {
      void this.execute(job);
    });

    job.status = "active";
  }

  pause(name: string) {
    const job = this.jobs.get(name);
    if (!job || job.status !== "active") return;
    job.task?.stop();
    job.status = "paused";
  }

  stop(name: string) {
    const job = this.jobs.get(name);
    if (!job) return;
    job.task?.stop();
    job.task = undefined;
    job.status = "stopped";
  }

  async run(name: string) {
    const job = this.jobs.get(name);
    if (!job) throw new Error(`Job not found: ${name}`);
    return this.execute(job, true);
  }

  list() {
    return [...this.jobs.values()].map((j) => ({
      name: j.name,
      status: j.status,
      running: j.isRunning,
      schedule: j.schedule,
      runAt: j.runAt,
    }));
  }

  private startOneTimeJob(job: InternalJob) {
    const tolerance = job.lateToleranceMs ?? 10_000; // default 10s
    const delay = job.runAt!.getTime() - Date.now();

    if (delay < -tolerance) {
      console.warn(
        `[Scheduler] Skipping missed job ${job.name} (late by ${-delay}ms)`,
      );
      job.status = "stopped";
      return;
    }

    job.status = "active";

    if (delay <= 0) {
      void this.execute(job, true);
      job.status = "stopped";
      return;
    }

    setTimeout(async () => {
      await this.execute(job, true);
      this.stop(job.name);
    }, delay);
  }

  private async execute(job: InternalJob, force = false) {
    if (!force && job.preventOverlap && job.isRunning) return;

    job.isRunning = true;
    try {
      await job.handler();
    } catch (err) {
      console.error(`[${job.name}] failed`, err);
    } finally {
      job.isRunning = false;
    }
  }

  private buildSchedule(cfg: ScheduleConfig): {
    schedule: string | null;
    runAt?: Date;
    lateToleranceMs?: number;
  } {
    if ("runAt" in cfg) {
      return {
        schedule: null,
        runAt: cfg.runAt,
        lateToleranceMs: cfg.lateToleranceMs,
      };
    }

    if ("cron" in cfg) {
      return { schedule: cfg.cron };
    }

    if ("everySeconds" in cfg) {
      return { schedule: `*/${cfg.everySeconds} * * * * *` };
    }

    if ("everyMinutes" in cfg) {
      return { schedule: `*/${cfg.everyMinutes} * * * *` };
    }

    if ("yearly" in cfg) {
      const { month, day, hour = 0, minute = 0, lateToleranceMs } = cfg.yearly;

      const now = new Date();
      const runAt = new Date(
        now.getFullYear(),
        month - 1,
        day,
        hour,
        minute,
        0,
        0,
      );

      return {
        schedule: `${minute} ${hour} ${day} ${month} *`,
        runAt,
        lateToleranceMs,
      };
    }

    throw new Error("No schedule provided");
  }
}

class DBScheduler {
  private bootstrapped = false;

  constructor(
    private readonly scheduler: TaskScheduler,
    private readonly store: JobStore,
    private readonly definitions: ReadonlyMap<string, JobDefinition>,
  ) {}

  async bootstrap() {
    if (this.bootstrapped) return;
    this.bootstrapped = true;

    const jobs = await this.store.list();

    for (const job of jobs) {
      const def = this.definitions.get(job.name);
      if (!def) {
        console.warn(`[DBScheduler] No job definition for ${job.name}`);
        continue;
      }

      this.scheduler.register({
        name: job.name,
        schedule: job.schedule,
        runOnStart: job.runOnStart,
        preventOverlap: job.preventOverlap,
        handler: async () => {
          await def.handler();
          await this.store.updateRunInfo(job.id, {
            lastRunAt: new Date(),
          });
        },
      });

      if (job.status === "active") {
        this.scheduler.startJob(job.name);
      }
    }
  }

  async sync() {
    const dbJobs = await this.store.list();

    for (const job of dbJobs) {
      const def = this.definitions.get(job.name);
      if (!def) continue;

      const runtime = this.scheduler.get(job.name);

      // Not registered yet → register
      if (!runtime) {
        this.scheduler.register({
          name: job.name,
          schedule: job.schedule,
          runOnStart: job.runOnStart,
          preventOverlap: job.preventOverlap,
          handler: async () => {
            await def.handler();
            await this.store.updateRunInfo(job.id, {
              lastRunAt: new Date(),
            });
          },
        });
      }

      // Status reconciliation
      if (job.status === "active") {
        this.scheduler.startJob(job.name);
      } else if (job.status === "paused") {
        this.scheduler.pause(job.name);
      } else if (job.status === "stopped") {
        this.scheduler.stop(job.name);
      }

      if (runtime && !deepEqual(runtime.schedule, job.schedule)) {
        this.scheduler.reloadJob(job.name, job.schedule);
      }

      // Schedule change detection
      if (runtime?.schedule !== job.schedule) {
        this.scheduler.stop(job.name);
        this.scheduler.updateSchedule(job.name, job.schedule);
        this.scheduler.startJob(job.name);
      }
    }
  }

  async pauseJob(id: string) {
    const job = await this.store.getById(id);
    if (!job) return console.error(`Job not found: ${id}`);

    await this.store.updateStatus(id, "paused");
    this.scheduler.pause(job.name);
  }

  async stopJob(id: string) {
    const job = await this.store.getById(id);
    if (!job) return console.error(`Job not found: ${id}`);
    await this.store.updateStatus(id, "stopped");
    this.scheduler.stop(job.name);
  }

  async activateJob(id: string) {
    const job = await this.store.getById(id);
    if (!job) return console.error(`Job not found: ${id}`);
    await this.store.updateStatus(id, "active");
    this.scheduler.startJob(job.name);
  }

  async runJobNow(id: string) {
    const job = await this.store.getById(id);
    if (!job) return console.error(`Job not found: ${id}`);
    await this.scheduler.run(job.name);
  }

  async resumeAllJobs() {
    const jobs = await this.store.list();
    for (const job of jobs) {
      if (job.status != "active") {
        await this.activateJob(job.id);
      }
    }
  }

  async stopAllJobs() {
    const jobs = await this.store.list();
    for (const job of jobs) {
      if (job.status !== "stopped") {
        await this.stopJob(job.id);
      }
    }
  }

  async pauseAllJobs() {
    const jobs = await this.store.list();
    for (const job of jobs) {
      if (job.status !== "paused") {
        await this.pauseJob(job.id);
      }
    }
  }
}

export function createDbScheduler(config: {
  scheduler: TaskScheduler;
  store: JobStore;
  definitions: ReadonlyMap<string, JobDefinition>;
}) {
  const dbScheduler = new DBScheduler(
    config.scheduler,
    config.store,
    config.definitions,
  );
  return dbScheduler;
}

export function createTaskScheduler(config: TaskSchedulerFactoryConfig = {}) {
  const scheduler = new TaskScheduler();

  if (config.hooks) {
    const originalRun = scheduler.run.bind(scheduler);
    scheduler.run = async (name: string) => {
      config.hooks?.beforeRun?.(name);
      try {
        return await originalRun(name);
      } finally {
        config.hooks?.afterRun?.(name);
      }
    };
  }

  if (config.jobs) {
    for (const job of config.jobs) {
      config.hooks?.beforeRegister?.(job);
      scheduler.register(job);
      config.hooks?.afterRegister?.(job);
    }
  }

  if (config.autoStart) {
    scheduler.start();
  }

  return scheduler;
}

/**
 *
 * @description this funciton is used to creat a job registery which can be later used in DBScheduler
 */
export const createJobRegistry = () => {
  const map = new Map<string, JobDefinition>();

  return {
    register(job: JobDefinition) {
      if (map.has(job.name)) {
        return console.error(`Duplicate job definition: ${job.name}`);
      }
      map.set(job.name, job);
      return this;
    },
    build(): ReadonlyMap<string, JobDefinition> {
      return new Map(map);
    },
  };
};
