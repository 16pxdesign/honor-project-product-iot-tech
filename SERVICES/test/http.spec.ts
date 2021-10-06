import {app} from '../src/server';
import chai from 'chai';
import chaiHttp from 'chai-http';
const { assert } = require('chai');
var should = chai.should();

chai.use(chaiHttp);
chai.use(require('chai-passport-strategy'));

const expect = chai.expect;

// Allows the middleware to think we're already authenticated.
app.request.isAuthenticated = function() {
    return true;
}
describe('Testing info API', () => {

    const product = {price: "10",
        product_id: "123",
        product_id_type: "TEST",
        product_name: "TEST"}

    it('add data for info', () => {
        return chai.request(app).post('/info/add').send(product)
            .then(res => {
                expect(res).to.have.status(200);

            })
    })

    it('Show list of infos', () => {
        return chai.request(app).get('/info/list')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                console.log(res.text)
            })
    })

    it('Check product by id', () => {
        return chai.request(app).get('/info/123')
            .then(res => {
                expect(res).to.have.status(200);
            })
    })



})