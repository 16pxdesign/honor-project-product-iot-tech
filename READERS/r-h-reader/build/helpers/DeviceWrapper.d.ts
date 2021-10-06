declare var HID: any;
export declare const dev: any;
export default class HIDES extends HID.HID {
    path: any;
    constructor(vid: number, pid: number);
    static open(callback: Function): HIDES | undefined;
}
export {};
