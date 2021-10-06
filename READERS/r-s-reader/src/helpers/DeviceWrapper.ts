import SerialPort from "serialport";


//export default new SerialPort('/dev/ttyACM0', {
export default new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    autoOpen: false
}, () => {
});