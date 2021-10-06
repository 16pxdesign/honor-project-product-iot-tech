
## Result

For the purposes of this project, reader services have been developed to interact with a given device. The software was designed to collect raw data about discovered items by the device .

![image](https://user-images.githubusercontent.com/28375942/136288761-c28c506d-b341-4f29-8c41-326d0854f05c.png)

The information collected has been pre-processed and transmitted in the form of an event to the event bus. Multiple readers can generate several readings per second, resulting in a redundant data transmission problem, especially when the reader is expected to remain inactive. To address the flooding data problem, a mechanism has been designed to send reader data only when requested by another service. 

![image](https://user-images.githubusercontent.com/28375942/136288803-50b7eb46-0d23-424d-87cd-f38638a651de.png)

The service consumes three types of events related to request to change the status of a reader or report a presence. The request events contained the recipient, the operational transaction identifier and the planned transaction time when the zero value indicates an infinite reading time. The service processes only requests addressed directly to it or to all reader services on the network.

![image](https://user-images.githubusercontent.com/28375942/136288646-18959730-57b6-46ff-9f18-f917e494de01.png)

# Readers in general

Please look on bar-code or Bluetooth project as its wily commented. All projects comes from the same core project and can differ between each other in details related to readers specification or returning data by each reader. Bellow its a readme.md from BARCODE SCANNER project.

Projects has been lighted by removing node_modules folders. To install own instance of libs simply can be done be `npm i` from console. Projects use node in v 8, 10 or 12 depending on hardware they are running on.

# Reader software v3.1

This project contains source code designed to work with a **BARCODE SCANNER**. The reader is operated by the program through the serial port interface, and the data read in the form of a data buffer are converted to a decimal value. For this purpose, the project required modifications involving only a part of the software strictly related to the specifics of the selected reader. 

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



