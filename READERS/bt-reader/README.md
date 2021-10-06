# Reader software v3.1
This project contains source code designed to work with a **BLUETOOTH SCANNER**. The reader is operated by the program through the NOBLE framework, and the data read in the form of a data buffer are converted to object containing any useful information for applications. For this purpose, the project required modifications involving only a part of the software strictly related to the specifics of the selected reader. 

## General description 
Most of the program was written in such a way that it could work with various readers with little changes to the source code. The project has been optimized twice during development:
1. to register and further manage listeners coming from different users.
2. to make the code more generic and suitable for more applications.

The software listens to the Kafka servers and responds to subscribed topics. If the message is related to a change in the state of the current reader (addressed to that reader id), then the readers performs the specified actions assigned to the event type.

If a reader has active listeners, it produces events about scanned products to the 'products' topic, describing each event with the same transaction ID as given when activating the listener.

## Known issues and recommendations for further development
- Encapsulation a change in reader state into a projector class, requires additional refactoring of the source code
- Identify the standard for data captured and design a meaningful product domain model
- Typescript interfaces limitation to check its type implicitly (partly solved by defining the type of event)
- Bulk processing of Kafka messages to speed up the process or create a mechanism to skip repeating or overwriting events
- Some unit tests can be deprecated, test not cover all application.

## Example env variables
``` 
TYPE=BARCODE
ID=BAR_1
MAX_LISTENERS=30
KAFKA_HOST=kafka:9092
KAFKA_GR=BAR_1 
```
or usage of .env file for dev proposes.

## Useful commands
`tsc -d -p .` or `npm run build` - to build JS project

`mocha --require ts-node/register --watch-extensions ts 'src/test/**/*.spec.ts'` or `npm run test` - run unit tests

`nodemon src/index.ts` or `npm run dev` - run TS project

`node build/index.js` or `npm run start` - run JS project



