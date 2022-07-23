import { Client, HazelcastInstanceNotActiveError } from "hazelcast-client"

export class Hazelcast {

    private static client: Promise<Client>;

    public static async getConnection(): Promise<Client> {
        const { HZ_NODES, HZ_CLUSTER } = process.env
        if (!this.client) {
            this.client = Client.newHazelcastClient({
                clusterName: HZ_CLUSTER || 'dev',
                network: {
                    clusterMembers: HZ_NODES.split(',')
                },
                lifecycleListeners: [
                    (state) => {
                        console.log('Lifecycle Event >>> ' + state);
                    }
                ]
            })
        }
        return this.client;
    }

    public static async shutdown() {
        if (!this.client) {
            throw new HazelcastInstanceNotActiveError('Hazelcast nerver connect or inactive.')
        }
        (await this.client).shutdown()

    }
}