import {Kafka} from "kafkajs";
import {Transaction} from "../src/models/Transaction";


require('dotenv')


describe('test', () => {

    it('test kafka events', async () => {
        await (async () => {
            const kafka = new Kafka({clientId: 'test1234', brokers: ["localhost:9093"], retry: {retries: 100}});
            const consumer = kafka.consumer({groupId: 'group_test1234' || 'test_1234'});
            await consumer.connect();
            console.log('connected')
            await consumer.subscribe({topic: 'events', fromBeginning: true})
            console.log('subscribe')
            await consumer.run({
                autoCommit: false,
                eachMessage: async ({topic, partition, message}: any) => {
                    console.log('kafka mesege %s', message.value.toString())
                },
            })
            console.log('consumer.run')
        })()

    }).timeout(60_000);

    it('test mongo db', async () => {
        const p = await Transaction.find({}).exec();
        console.log(p)
        return

    })

    it('test compare mechanism', async () => {


        const inv = [{
            "_id": "606feec7ce9f744e2e6c6e9f",
            "product_id": "123",
            "date": "2021-04-09T06:28:00.679Z",
            "__v": 0
        }, {
            "_id": "606feeccce9f744e2e6c6ea0",
            "product_id": "e000016fca6d3468",
            "date": "2021-04-09T06:23:30.424Z",
            "__v": 0
        }, {
            "_id": "606ff0baa9f7754f8435a58c",
            "product_id": "4c000215fda50693a4e24fb1afcfc6eb0764782500010002d8",
            "date": "2021-04-09T06:14:18.397Z",
            "__v": 0
        }]
        const st = [{
            "_id": "606fd1f7b5995823a7a92563",
            "product_id": "123",
            "__v": 0
        }, {
            "_id": "606fd260c5a8f1249712039a",
            "product_id": "5449000025173",
            "__v": 0
        }, {
            "_id": "606fd260c5a8f1249712039b",
            "product_id": "5449000025173",
            "__v": 0
        }, {
            "_id": "606fd260c5a8f1249712039c",
            "product_id": "5449000025173",
            "__v": 0
        }, {
            "_id": "606fd2986cfebd259b01849e",
            "product_id": "5449000025173",
            "__v": 0
        }, {
            "_id": "606fd2986cfebd259b01849f",
            "product_id": "5449000025173",
            "__v": 0
        }, {
            "_id": "606fd2986cfebd259b0184a0",
            "product_id": "5449000025173",
            "__v": 0
        }, {
            "_id": "606fd2b8fba4bb2627b44874",
            "product_id": "5449000025173",
            "__v": 0
        }, {
            "_id": "606fd2b8fba4bb2627b44875",
            "product_id": "5449000025173",
            "__v": 0
        }, {
            "_id": "606fd2b8fba4bb2627b44876",
            "product_id": "5449000025173",
            "__v": 0
        }, {
            "_id": "606fe63426daf6440a7db942",
            "product_id": "e000016fca6d3468",
            "__v": 0
        }, {"_id": "606fe63426daf6440a7db943", "product_id": "e0000139ca5a1664", "__v": 0}]


        let sub = function (a: any, b: any) {
            const tempArray: any = [...a];
            const ids = b.map((x: any) => x.product_id);
            for (let i of ids) {
                const find = tempArray.find((x: any) => x.product_id == i);
                let index = tempArray.indexOf(find);
                if (index != -1) {
                    tempArray.splice([index], 1)
                }
            }

            return tempArray

        }

        const extra = sub(inv, st);
        const miss = sub(st, inv);
        const match = sub(inv, extra);
        const diff = [...extra, ...miss];

        console.log(match)
        console.log(extra)
        console.log(miss)
    })
})