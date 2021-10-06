import EventEmitter from "events";

const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");

export default class Device extends EventEmitter {
    public path: any = 'nfc/device'; //dump device path
    public spi = new SoftSPI({    clock: 23,    mosi: 19,    miso: 21,    client: 24});
    public dv: any = new Mfrc522(this.spi).setResetPin(22).setBuzzerPin(18);
    private interval : any = undefined


    constructor() {
        super();
    }

    toHex(d: any) {
        return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
    }

    async open(err: any){
        if(this.interval)
            clearInterval(this.interval);

        this.interval = setInterval(async () => {
            this.dv.reset();
            let data : any = {}
            //# Scan for cards
            let response = this.dv.findCard();
            if (!response.status) {
                //console.log("No Card");
                return;
            }
            //console.log("Card detected, CardType: " + response.bitSize);

            //# Get the UID of the card
            response = this.dv.getUid();
            if (!response.status) {
                //console.log("UID Scan Error");
                return;
            }
            //# If we have the UID, continue
            const uid = response.data;
            data.id = this.toHex(uid[0])
            data.id = data.id.concat(this.toHex(uid[1]))
            data.id = data.id.concat(this.toHex(uid[2]))
            data.id = data.id.concat(this.toHex(uid[3]))

            //# Select the scanned card
            const memoryCapacity = this.dv.selectCard(uid);

            //# This is the default key for authentication
            const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

            var sec = ""
            var secarr = [];
            for (let i = 8; i < 64; i++) {

                if((i+1)%4 == 0){
                    //console.log("SEC ", (i - 7 - 4) / 4, sec);
                    secarr.push(sec)
                    sec = ""
                }else{
                    if (await this.dv.authenticate(i, key, uid)) {
                        //console.log("Block: " + i + " Data: " + this.dv.getDataForBlock(i).toString('hex'));
                        for(let bit of this.dv.getDataForBlock(i)){
                            sec = sec.concat(this.toHex(bit));
                        }
                    } else {
                        console.log("Authentication Error");
                        break;
                    }
                }


            }
            if(secarr.length == 14)
                data.blocks = secarr

            this.emit('data',data);

            this.dv.stopCrypto();
        }, 500 );

    }

}