import { Flow } from "./Flow";

export type FunctionHandler = (flow: Flow, task: Task) => Promise<void>;

export class Task {
    id?: string;
    name?: string;
    flowId?: string;

    handler?: TaskHandler | FunctionHandler;

    input?: any;
    output?: any;

    failedCount?: number;
    retryCount?: number;
    error?: number;
    status?: string;
}

export abstract class TaskHandler {

    async create(flow: Flow): Promise<void> { };
    async init(flow: Flow): Promise<void> { };
    async before(flow: Flow): Promise<void> { };
    async after(flow: Flow): Promise<void> { };
    async destroy(flow: Flow): Promise<void> { };

    abstract perform(flow: Flow, task: Task): Promise<void>;

}

export class TaskHandlerDefault extends TaskHandler {

    performFnc: Function;

    constructor(peformFnc: Function) {
        super()
        this.performFnc = peformFnc;
    }

    async before(flow: Flow): Promise<void> { }
    async after(flow: Flow): Promise<void> { }
    async perform(flow: Flow, task: Task): Promise<void> {
        return this.performFnc(flow, task)
    }

}