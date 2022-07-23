import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Flow } from "../process/Flow";
import { Task, TaskHandler } from "../process/Task";

export class Config {

    baseUrl?: string;
    authEnable?: boolean;
    authToken?: string;

    method?: string;
    url?: string;
    body?: object;

    static default(): Config {
        return <Config>{}
    }
}

export class RestfulSource extends TaskHandler {
    config: Config;
    axiosInstance: AxiosInstance;

    constructor(config?: Config) {
        super()
        this.config = { ...Config.default(), ...config || {}, }
    }

    setupAxios() {
        const defaultOptions: AxiosRequestConfig = {
            baseURL: this.config.baseUrl,
            headers: { 'Content-Type': 'application/json' },
        }
        if (this.config.authEnable) {
            defaultOptions.headers.Authorization = this.config.authToken;
        }
        this.axiosInstance = axios.create(defaultOptions);

    }

    async before(flow: Flow): Promise<void> {
        this.setupAxios()
        console.log('Connect to HTTP Restful API...')
    }
    async perform(flow: Flow, task: Task): Promise<void> {
        const { url, method, body } = this.config
        const http = this.axiosInstance
        task.output = await (await http({ method, url, data: body })).data
    }
    async after(flow: Flow): Promise<void> {
        console.log('Connect finished.')
    }

}