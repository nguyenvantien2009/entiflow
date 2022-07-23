import Flow from "./Flow";

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

    abstract before(flow: Flow): Promise<void>;
    abstract after(flow: Flow): Promise<void>;

    abstract perform(flow: Flow, task: Task): Promise<void>;

}

export class TaskHandlerDefault implements TaskHandler {

    performFnc: Function;

    constructor(peformFnc: Function) {
        this.performFnc = peformFnc;
    }

    async before(flow: Flow): Promise<void> { }
    async after(flow: Flow): Promise<void> { }
    async perform(flow: Flow, task: Task): Promise<void> {
        return this.performFnc(flow, task)
    }

}