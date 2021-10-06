# Event-sourcing
A framework was designed to define the structure of the basic event sourcing architecture. This module contains the generic set of components shown in Figure 8 and defines an abstract sequence of operations associated with the event flow and state processing. The framework required services to define specific actions related to command handling, event logging through the message bus, and optionally updating the domain state in response to the generated event. 
The task of the command handler was to create an event based on the data provided by the command. 

![image](https://user-images.githubusercontent.com/28375942/136288974-bfc6a979-f7f0-4fee-84ae-5d3d17432305.png)
The framework allows for optional data projection using a projector handler that modifies the current state stored by the application. The event is transferred to the event store by the store handler, who’s responsible for publishing the event to the selected store. 
In addition, data read operations were wrapped into query handler according to the pattern. 
