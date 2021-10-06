import io from "socket.io-client";

/**
 * Global socket io configuration
 */
const options : any = {
    withCredentials: true,
 //   autoConnect: false
};
export const socket = io("127.0.0.1:4000", options)
