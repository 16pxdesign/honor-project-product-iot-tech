import passportSocketIo from "passport.socketio";

//check is user is authorised
export function socketAuth(store: any) {
    return async (socket: any, next: any) => {
        return passportSocketIo.authorize({
            // cookieParser: cookieParser(),       // the same middleware you registrer in express
            key: 'connect.sid',       // the name of the cookie where express/connect stores its session_id
            secret: 'secret',    // the session_secret to parse the cookie
            store: store,        // we NEED to use a sessionstore. no memorystore please
            success: onAuthorizeSuccess,  // *optional* callback on success - read more below
            fail: onAuthorizeFail,     // *optional* callback on fail/error - read more below
        })(socket, next);
    };
}

function onAuthorizeSuccess(data: any, accept: any) {
    console.log('Successful connection to socket.io by: ', data.user._id);
    accept();
}


function onAuthorizeFail(data: any, message: any, error: any, accept: any) {
    if (error)
        //throw new Error(message);
    console.log('Failed connection to socket.io :', message);
}