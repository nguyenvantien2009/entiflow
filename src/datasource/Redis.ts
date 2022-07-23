import { createClient, RedisClientOptions } from 'redis'

export class RedisConnect {

    private client;

    constructor() { }

    init(connectOptions: RedisClientOptions) {
        this.client = createClient(connectOptions);
    }

    getClient() {
        return this.client;
    }

    connect() {
        this.client.connect()
    }

    close() {
        this.client.close()
    }
}

export default new RedisConnect()