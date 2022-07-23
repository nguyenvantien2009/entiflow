
import 'dotenv/config'
import { Flow, Task } from '../src/process'
import { RestfulSource } from '../src/sources/RestfulSource'
import { HazelcastDestination } from '../src/destinations'

console.log(process.env)

const userFetchHandler: RestfulSource = new RestfulSource({
    baseUrl: 'https://reqres.in',
    url: '/api/users?page=2'
})

class TestFlowLoading extends HazelcastDestination {
    async perform(flow: Flow, task: Task): Promise<void> {
        const data = flow.getPreviousTask(task)?.output;
        (await this.client.getMap('learn-etl-1')).put(1, data);
    }

    async after(flow: Flow): Promise<void> {
        (await (await this.client.getMap('learn-etl-1')).entrySet()).forEach(it => {
            console.log(it)
        })
    }
}

let f = new Flow('test_flow')
    .addTask({ name: 'Connect to Restful', handler: userFetchHandler })
    .addTaskHandler('transform', async (flow: Flow, task: Task) => {
        let json = flow.getPreviousTask(task)?.output
        task.output = json
    })
    .addTaskHandler('Loading', new TestFlowLoading())
    .run();

setTimeout(async () => (await f).close(), 30 * 1000)