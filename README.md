# honor-project-product-iot-tech
Development and evaluation of a product management system using IoT technology to replace traditional barcodes

- [Client readme](./CLIENT/README.md)
- [Module readme](./escore/README.md)
- [Microservices readme](./SERVICES/README.md)
- [Readers readme](./READERS/README.md)

The project aimed to answer the questions whether IoT technology can be used to replace barcodes and what benefits it can bring for both retail industry and this sector’s customers. Research had showed that best suited technology for this project is Beacon. Compared to other technologies, Beacon has the best data storage capabilities, uniqueness of the identifier, and even without its own standard for product management, it is still the most attractive technology. However, beacon technology is not ready to replace barcodes at the moment, as tags attached to products would require an external power supply. However, this technology is being continually developed and such a solution could soon be available. The potential to replace barcodes is shown by RFID technology, which significantly extends the capabilities of barcodes, although it is less competitive to Bluetooth-based technology.

The system prototype developed for the research demonstrates the ability of IoT technology readers to collect real-time data without human interaction and how it helped to automate processes to manage products. The project demonstrates achieving the objective of process automation by developing an automated inventory service to compare stocked products with data collected from readers that scan existing products in real time. The research has shown that the data collected in this way also allows the development of further system functionalities such as product finding. The research has shown the data collected in this way also allows further system functionalities such as product discovery to be developed, indicating the high potential for data reusability to solve further business problems.


# Architecture patterns
In order to achieve the intended effects, several architectural solutions were used that allow for scaling of the system, easier implementation of individual elements, increasing tolerance for errors and the ability to implement additional functionalities.
## Microservices
Microservice architecture is a method of developing an application composed of a set of loosely coupled and cooperating services. A single service is a relatively small isolated unit of an application focused on specific processes and communicating typically over the lightweight HTTP protocol. The use of this solution benefits includes isolation, resistance, scalability and component independence

![image](https://user-images.githubusercontent.com/28375942/136289298-9341e989-9d4e-41a8-93da-be652b34b3e3.png)

The project involves implementing a microservices architecture to separate individual system components by functionality and purpose. The small size of each service and its single responsibility significantly improves the development and testability of individual modules. The architectural separation of application logic and data allows for the adaptation of the relevant database type to the service. This feature can help to manage problems with optimising individual services performance, which under the influence of excessive queries may require the implementation of a read-only database. Due to resource limitations, database partitioning within the prototype system has been replaced by simulating the same principle using different collections within a single instance of database. The services logic and data remain isolated, removing the responsibility to maintain database consistency between services, leaving to each individual service the responsibility for modelling, processing, and maintaining the data. The development of a microservices-based system allows for the continuous development of services and the constant delivery of new functionalities. Microservices can be implemented independently during each implementation phase without affecting other system components. 

![image](https://user-images.githubusercontent.com/28375942/136289367-ef053fce-695e-401c-ad7f-ff606c7dbef0.png)
![image](https://user-images.githubusercontent.com/28375942/136289373-7eb03028-17b1-45a7-b92f-c3f8471ff122.png)

## Event sourcing
Event sourcing pattern is an event-centric approach that involves events to update states between services. Event sourcing provides consistent and persistent data exchange across services. The architecture pattern was designed to update the state by a sequence of events stored as an append-only transaction in the event store. An event is a general concept that describes performed actions and their origin as a fact of the past. The processing of the event history by the application allowed to restore and upkeep the "current" application states. 

![image](https://user-images.githubusercontent.com/28375942/136289419-a2d5e58e-18df-4c6a-b7a6-2fdaebef8df7.png)

## Communication
The system was developed based on three types of communication between its components. The aim of this project was to find methods of communication that would preserve the integrity of the system and allow components to remain independent. 
### Application Programming Interface (API)
The REST (Representational State Transfer) API is a universal HTTP interface for communication between client and server software through the web. With an API-based approach, the client application can be completely independent from the server application and developed separately (Codecademy, 2018). A microservice infrastructure in which each microservice provides its own API causes communication issues and service conflicts. 

![image](https://user-images.githubusercontent.com/28375942/136289444-b7cc3f7b-c34c-4536-a8ec-37d7aa381715.png)

In order to avoid direct client-microservice communication, a gateway was used as a single-entry point for interaction with various services without understanding the internal system configuration. However, this solution still places the responsibility for authentication on selected microservices. It can be replaced at a later stage of development by a single gateway microservice applying the API gateway pattern.
### WebSocket
WebSocket is a communication protocol between client and server that allows two-way communication during a single connection. Continuous communication with the server allows the client as well as the server to transmit data in real-time, allowing to display scanned products without having to refresh the browser window and avoiding flooding the services with pulling requests to repeatedly fetch the data.
### Message bus
The message bus is based on publish/subscribe pattern in which selected applications act as message publishers and others act as message subscribers. The approach offers asynchronous communication between distributed services where the subscribers can process data at different speeds. Its implementation reduced the number of connections and dependencies between different services. The messaging bus is a central point in the system architecture and allows for new components to be added independently without notifying other clients.


