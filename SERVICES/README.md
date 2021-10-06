# API Microservices
The implementation of microservices started with implementing user authentication and product scanning services. Work within a single project allowed to avoid code duplication across multiple services and develop services simultaneously. The core microservice software required implementation of application middleware and event sourcing framework.

![image](https://user-images.githubusercontent.com/28375942/136288230-81374b7b-26f0-4979-96dd-9602cc81e7fa.png)

Microservices were implemented incrementally with the next phases of development client application features. Figure 19 shows how microservices has been reused by different user interface functions indicating a many-to-many relationship.

The development of all services involved the implementation of the designed event sourcing framework and connectivity to the Kafka broker. Services subscribe selected topics and consume events in order to perform specific actions. If the application requires upkeep application state up to date, the initiation process may involve consuming all outstanding events. 

![image](https://user-images.githubusercontent.com/28375942/136288397-19e64c48-fb2b-4efe-be0a-5ddd54769d09.png)
![image](https://user-images.githubusercontent.com/28375942/136288410-7c95cd05-cae3-4d33-a028-fb1ac518fc64.png)


## User service
The service was designed to manage, log in and register users on the system. User verification was required to protect the system from unauthorized access to data. An implemented strategy describes the authentication process and allowed to create a user session using the passport.js module. The application saves the user session in a session store and allow other services to authenticate user requests.
## Checkout service
The service through WebSocket protocol provides real-time interaction with selected reader service. In response to user requests, the microservice sends action events to the broker and listens for the scanned product data. The microservice filters incoming messages using the transaction number provided at the start of the reader to determine which products apply to a particular client connection. 
## Order service
The service handles the data processing related to placed orders. The API provides information about the order status and allowed the user to place orders in the system. Orders must be verified for product availability, which requires involvement of the Stock service. The Stock service is notified by an event when an order is placed. The Order microservice waits for confirmation from the Stock service and decides whether the order is accepted or not. 
## Stock service
The Stock is a microservice that manages information about the number of products in stock. The service has its own interface for adding and removing products. The microservice provided mechanism allowing to interact with other services to verify that given products are available.
## Info service
The purpose of the service is to provide additional information about products that cannot be obtained during the scanning process. The information about product may include details such as the name of the product or its price . This approach is commonly used in applications that use barcodes to determine which product is described by a given number.
## Present
The service invokes reader services to report their presence in the system. The application processes presence events to update the readers status stored in the database. Client applications can obtain a list of the available readers or mark the selected readers as inactive.
## Inventory service
The service constantly listens for new product events to update the information in database. Inventory works as a scheduled task to use all reader services to collect the latest product location data. The time and duration of the scanning process can be set through environment variables, allowing several independent tasks to be created and meet the business requirements. The client applications could receive a list of scanned products for a specific time period.

# Security
## Encryption
To ensure data security and prevent unauthorised access, the use of encryption for sensitive data may be required by GDPR (General Data Protection Regulation). The application encrypts passwords, which are the most sensitive type of data in the project. The development of a future system can also help determine which system data should be encrypted.
## Origin control
In order to ensure the security of the data transmitted between the client and the server, a CORS mechanism is used, which protects users against the execution of malicious scripts from another origin and allows to specify the list of domains accepted by the service. 
## Containers
The fact that microservices are placed in a container significantly increased the level of security. Virtualisation has made it possible to isolate applications between virtual machines and achieve a certain level of security. The information gained during an attack on one application does not impact other applications, and the affected application is simple to restore.
## Certificates
An SSL certificate could be used in all places where the user provides data. An SSL Certificate provides encryption of data transmitted over the Internet and enables authentication between servers. With an SSL Certificate, HTTP/2 can be used and will positively affect the speed of web services. SSL allows to avoid phishing attacks and comply with GRPR by protecting the data transmitted between users of a website.

