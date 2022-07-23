
import { after, keys } from 'lodash';
import Flow from '../src/process/Flow'
import { Task, TaskHandler, TaskHandlerDefault } from '../src/process/Task'
import RestfulSource from '../src/sources/RestfulSource'

new Flow('test_flow')
    .addTask({
        name: 'Connect to Restful',
        handler: new RestfulSource({
            url: 'https://reqres.in/api/users?page=2'
        })
    })
    .addTask({
        name: 'Transform',
        handler: async (flow: Flow, task: Task) => {
            console.log(JSON.stringify(flow.getPreviousTask(task)))
            let json = flow.getPreviousTask(task)?.output
            task.output = json
        }
    })
    .addTask({
        name: 'Load Process',
        handler: async (flow: Flow, task: Task) => {
            let json = flow.getPreviousTask(task)?.output
            console.log(`json need push to hazelcast ${json}`)
        }
    })
    .run()
    .then(flow => flow.print())
