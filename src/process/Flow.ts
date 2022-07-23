import _ from 'lodash'
import { FunctionHandler, Task, TaskHandler } from './Task'
import shortid from 'shortid'

export default class Flow {
    id: string;
    error: boolean;
    status: string;

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

    getPreviousTask(task: Task): Task | null {
        let i = _.findIndex(this.tasks, (it) => it.id === task.id)
        return i > 0 ? this.tasks[i - 1] : null;
    }

    getNextTask(task: Task) {

    }

    async runWithTask(task: Task): Promise<void> {
        let handler: TaskHandler | FunctionHandler = task.handler;
        if (handler instanceof Function) {
            await handler(this, task)
        } else if (handler instanceof TaskHandler) {
            await handler.before(this)
            await handler.perform(this, task)
            await handler.after(this)
        } else {
            throw new Error(`Handler in task ${task.id} 
                ${task.name ? 'name: ' + task.name : ''} is not instance of TaskHandler or FunctionHandler`)
        }
    }

    async run(): Promise<Flow> {
        for await (const task of this.tasks) {
            await this.runWithTask(task)
        }
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
}