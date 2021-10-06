import {Reader} from "./helpers/Reader";


(async () => {

    let reader = Reader.getInstance();
    await reader.init();
    await reader.setListeners();
    await reader.subscribeKafkaTopics()
    await reader.consumeKafkaMessages();

})();


