import Noble from '@abandonware/noble'

/**
 * Simple wrapper for instance of working reader to use across application
 */

/** wrapper for Noble to add needed functions */

let path: any = 'bt/device'; //dump device path //TODO: put to env

const device = {
    foo: function () { /* some new stuff*/ },
    path,
};

//merge objects
export default Object.assign(Noble, device);