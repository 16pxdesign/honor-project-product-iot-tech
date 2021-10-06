const Reset: string = "\x1b[0m"
const Bright: string = "\x1b[1m"
const Dim: string ="\x1b[2m"
const Underscore:string = "\x1b[4m"
const Blink: string ="\x1b[5m"
const Reverse:string = "\x1b[7m"
const Hidden: string ="\x1b[8m"

const FgBlack:string = "\x1b[30m"
const FgRed: string ="\x1b[31m"
const FgGreen: string ="\x1b[32m"
const FgYellow:string = "\x1b[33m"
const FgBlue:string = "\x1b[34m"
const FgMagenta:string = "\x1b[35m"
const FgCyan: string ="\x1b[36m"
const FgWhite: string ="\x1b[37m"

const BgBlack:string = "\x1b[40m"
const BgRed:string = "\x1b[41m"
const BgGreen:string = "\x1b[42m"
const BgYellow:string = "\x1b[43m"
const BgBlue: string ="\x1b[44m"
const BgMagenta: string ="\x1b[45m"
const BgCyan: string ="\x1b[46m"
const BgWhite: string ="\x1b[47m"


const getTimeStamp = (): string => {
    return new Date().toISOString();
};

const info = (namespace: string, massage: string, object?: any) => {
    if (object) {
        console.log(FgMagenta,`[${getTimeStamp()}] [INFO] [${namespace}] ${massage}`, object, Reset);
    } else {
        console.log(FgMagenta,`[${getTimeStamp()}] [INFO] [${namespace}] ${massage}`, Reset);
    }
}

const warn = (namespace: string, massage: string, object?: any) => {
    if (object) {
        console.log(BgYellow,Blink,`[${getTimeStamp()}] [WARN] [${namespace}] ${massage}`, object,Reset);
    } else {
        console.log(BgYellow,Blink,`[${getTimeStamp()}] [WARN] [${namespace}] ${massage}`,Reset);
    }
}

const error = (namespace: string, massage: string, object?: any) => {
    if (object) {
        console.log(FgRed,`[${getTimeStamp()}] [ERR] [${namespace}] ${massage}`, object,Reset);
    } else {
        console.log(FgRed,`[${getTimeStamp()}] [ERR] [${namespace}] ${massage}`,Reset);
    }
}

const debug = (namespace: string, massage: string, object?: any) => {
    if (object) {
        console.log(FgYellow,`[${getTimeStamp()}] [DEBUG] [${namespace}] ${massage}`, object,Reset);
    } else {
        console.log(FgYellow, `[${getTimeStamp()}] [DEBUG] [${namespace}] ${massage}`,Reset);
    }
}

export default {
    info,
    warn,
    error,
    debug
}