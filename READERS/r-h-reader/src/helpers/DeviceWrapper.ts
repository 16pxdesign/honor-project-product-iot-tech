var HID = require('node-hid');
var devices = HID.devices();

export const dev = new HID.HID(6790,57360)

export default class HIDES extends HID.HID {

    public path: any = 'hid/device';

    constructor(vid: number, pid: number) {
        super(vid, pid);
    }

    static open(callback:Function) {

        try {
            return new this(6790,57360)
        }catch (e) {
            callback(e);
        }

        return undefined;
    }



}
