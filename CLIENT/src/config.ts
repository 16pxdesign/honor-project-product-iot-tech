import dotenv from 'dotenv';
dotenv.config()

const REST_HOST  = process.env.REST_HOST || '';
const REST_PORT = process.env.REST_PORT || '4000';
export let REST_URL = 'http://' + '127.0.0.1' + ':'+ '4000';