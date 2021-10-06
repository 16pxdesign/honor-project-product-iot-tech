# React client application
>The React application has been developed as a front-end client application to process and visualise an API data. Application delivered on each web application page a system features to the user.

![image](https://user-images.githubusercontent.com/28375942/136287861-9db4f56f-85cb-437e-8875-4fef8521e898.png)
 
![image](https://user-images.githubusercontent.com/28375942/136287585-9eeeef49-aaf6-4d76-b381-090bf570764b.png)

The user interface provided functionality to the user by processing raw data from the microservices.  Each application functionality can utilise several microservices simultaneously through an API or WebSocket protocol. Features provided complex tools to manage products and system resources. The application consisted of individual pages such as scanning products with a scanner, ordering, inventory, and tracking product location.
![image](https://user-images.githubusercontent.com/28375942/136287595-05f47c04-391c-4b47-99c1-c7fce082eaef.png)
The application provides a login and registration mechanism on top of server-side interface. To verify the user, the website requires a password and an email address. The application performs simple data validation on the client-side to prevent sending requests with an incompatible format and notify the user of any errors.
![image](https://user-images.githubusercontent.com/28375942/136287632-fd527f64-65e7-4215-aed3-509a353db6ed.png)
![image](https://user-images.githubusercontent.com/28375942/136287638-d1b84dd2-a31e-4c82-a3f8-938584e3f5bb.png)

The user is able to view the list of readers in a table format. This information included data on the ID, time of last attendance and the operating status of the reader. The application allowed the user to change the reader status by pressing the button, that switched the reader on or off. A deactivated reader was excluded from the list of available readers in the system. The functionality has been used as a tool to debug readers and detect any reader has been out of the system for an extensive period, indicating a fault.


The user was able to scan products with a selection from a list of active readers that had reported a presence in the last two minutes. The functionality required connection to a server using WebSocket in order to consume incoming data in real-time. The user can start a scan with a time interval and stop it at any time. Scanned products were displayed in the form of a table containing data describing each product provided by the reader. The information had been joined with an additional set of information to describe the product in more detail. The user can use the products list to place an order or register products in the stock. The application sent data from the table to the API based on the selected option. In the final phase, some additional options were added to process table data, such as searching for beacons and calculating distances.
![image](https://user-images.githubusercontent.com/28375942/136287710-1a1bea42-58fb-478f-93c5-a72e35145550.png)

This feature allowed the user to view a list of orders placed and check the status order. The user is redirect to a page displaying the order details for selected transaction. The order information included a list of products placed in order and order status. Order process required to be handled by multiple microservice, delays may occur if one of them was busy or unavailable. For rejected orders, information contained a list of unavailable products 
![image](https://user-images.githubusercontent.com/28375942/136287743-db18bb7e-e3ea-4908-bb05-83a7d9772bbb.png)
![image](https://user-images.githubusercontent.com/28375942/136287747-795dc32c-71d4-40f9-8240-501d99db95de.png)
Stocktaking is a functionality which compared the inventory data with the stock. The differences between the selected data sets were represented in tables such as products missing from stock, products out of stock and those which matched
![image](https://user-images.githubusercontent.com/28375942/136287767-ed80e37a-5aa5-4075-9e6f-47b44fc2f07f.png)
A simple application search mechanism  on top of inventory service provided reliable information about the potential location of a product. 
![image](https://user-images.githubusercontent.com/28375942/136287811-fb17384f-4d44-4696-8319-1339774cc23d.png)
