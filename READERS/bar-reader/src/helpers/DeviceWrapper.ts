import SerialPort from "serialport";

/**
 * Simple wrapper for instance of working reader to use across application
 */
export default new SerialPort('/dev/ttyACM0', {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    autoOpen: false
}, () => {
});