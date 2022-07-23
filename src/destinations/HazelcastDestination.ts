import { TaskHandler, Flow } from "../process";
import { HazelcastClient } from "hazelcast-client/lib/HazelcastClient";
import { Hazelcast } from "../datasource";

export abstract class HazelcastDestination extends TaskHandler {

    client: HazelcastClient;

    async before(flow: Flow): Promise<void> {
        this.client = await Hazelcast.getConnection()
    }

    async after(flow: Flow): Promise<void> {
        // throw new Error("Method not implemented.");
    }

    async destroy(flow: Flow): Promise<void> {
        this.client.shutdown();
    }

}