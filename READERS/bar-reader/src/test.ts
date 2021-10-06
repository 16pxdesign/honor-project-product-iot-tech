import HID from "node-hid";
/** Testing file for test reader connection */
try {
    //display devices
    var devices = HID.devices();
    console.log('devices:', devices);

    //connect and listen for device
    var device = new HID.HID(10473, 643);
    device.on('data', function (data: any) {
        if (data[0] === 0) {
            //no data
        } else {
            //proccess data
            console.log(data);
        }

    });

} catch (e) {
    console.log('catch');
    console.log(e);
}