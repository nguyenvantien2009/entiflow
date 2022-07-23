import _ from 'lodash'
import shortid from 'shortid'
import schedule, {
    Job,
    RecurrenceRule,
    RecurrenceSpecDateRange,
    RecurrenceSpecObjLit
} from 'node-schedule'
import { FunctionHandler, Task, TaskHandler } from './Task'
export class Flow {
    id: string;
    error?: boolean;
    status?: string;

    scheduleRule?: RecurrenceRule | string | number;
    scheduleJob?: Job;

    tasks: Task[] = [];

    constructor(id: string) {
        this.id = id;
    }

    addTask(task: Task): Flow {
        task.flowId = this.id;
        task.id = shortid.generate()

        this.tasks.push(task);
        return this;
    }

    addTaskHandler(name: string, handler: TaskHandler | FunctionHandler): Flow {
        this.tasks.push(<Task>{ flowId: this.id, name, handler });
        return this;
    }

    getPreviousTask(task: Task): Task | null {
        let i = _.findIndex(this.tasks, (it) => it.id === task.id)
        return i > 0 ? this.tasks[i - 1] : null;
    }

    getNextTask(task: Task) { }

    async runWithTask(task: Task): Promise<void> {
        let handler: TaskHandler | FunctionHandler = task.handler;
        if (handler instanceof Function) {
            await handler(this, task)
        } else if (handler instanceof TaskHandler) {
            await handler.before(this);
            await handler.perform(this, task)
            await handler.after(this)
        } else {
            throw new Error(`Handler in task ${task.id} 
                ${task.name ? 'name: ' + task.name : ''} is not instance of TaskHandler or FunctionHandler`)
        }
    }

    async run(rule?: RecurrenceRule | string | number): Promise<Flow> {
        if (rule) {
            this.scheduleRule = rule;
            this.runWithSchedule(rule);
        } else if (this.scheduleJob && this.scheduleRule) {
            console.log(`Re-scheduler for flow ${this.id}.`)
            this.scheduleJob.reschedule(this.scheduleRule)
        } else {
            await this.runWithoutSchedule();
        }
        return this;
    }

    async schedule(rule: RecurrenceRule | string | number): Promise<Flow> {
        this.scheduleRule = rule;
        return this;
    }

    async close(): Promise<Flow> {
        this.scheduleJob?.cancel();
        this.destroyAllTasks();
        return this;
    }


    async print(): Promise<Flow> {
        _.forEach(this.tasks, task => {
            const { id, name, status, error, failedCount, retryCount } = task,
                flowId = this.id;

            console.log(`${flowId}.${id} - ${name}: [${status || '-'}] error:${error || 0}/retry:${retryCount || 0}/failed:${failedCount || 0}`)
        })
        return this;
    }

    private async runWithoutSchedule(): Promise<Flow> {
        for await (const task of this.tasks) {
            await this.runWithTask(task)
        }
        return this;
    }

    private async runWithSchedule(rule: RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string | number): Promise<Flow> {
        this.scheduleJob = schedule.scheduleJob(
            rule, () => {
                this.runWithoutSchedule()
            }
        )
        return this;
    }

    private async destroyAllTasks() {
        console.log('Destroy all tasks...')
        this.tasks.forEach(task => {
            if (task.handler instanceof TaskHandler) {
                task.handler.destroy(this)
            }
        })
    }
}