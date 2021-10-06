import {Reader} from "./helpers/Reader";


(async () => {
    console.log('Reader ID: ', process.env.ID)
    console.log('Reader TYPE: ', process.env.TYPE)
    console.log('Reader Kafka Host: ', process.env.KAFKA_HOST)
    console.log('Reader Kafka Group: ', process.env.KAFKA_GR)
    let reader = Reader.getInstance();
    await reader.init();
    await reader.setListeners();
    await reader.subscribeKafkaTopics()
    await reader.consumeKafkaMessages();

})();


