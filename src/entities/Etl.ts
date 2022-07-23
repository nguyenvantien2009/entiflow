export namespace Etl {

    export enum StepStatus {

    }

    export class Step {
        func: Function;
        results: any;
    }

    export enum TaskStatus {
        START = 0,
        RUNNING = 1,
        DONE = 2,
        ERROR_LABEL = 3,
        EXCEPTION = 4
    }

    export class Task<T> {
        id?: string;
        name?: string;
        status?: TaskStatus;
        results?: T | T[]
    }

    export enum WorkflowStatus {
        OPEN = 0,
        RUNNING = 1,
        DONE = 2
    }
    export class Workflow {
        id?: string;
        name?: string;
        status?: WorkflowStatus;
    }
}