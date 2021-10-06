/*
import {ProductInfo} from "../src/models/ProductInfo";
import mongoose from "mongoose";


require('dotenv')


before((done) => {
    const host: string = process.env.MONGOOSE_HOST_TEST || 'mongodb://root:example@localhost:27017/';
    mongoose.connect(host, {useNewUrlParser: true})
        .then(() => {
            console.log('Mongo ready.')
            done()
        })
        .catch(done);

})
afterEach((done) => {
    // Dump.db.dropDatabase(done)
    done()
})

after((done) => {
    mongoose.disconnect(done)


});


describe('seed', () => {

    it('example products', async () => {
        new ProductInfo({
            product_id: "075815112095",
            product_id_type: "BARCODE",
            product_name: "Coca cola",
            price: "20.00"
        }).save();
        new ProductInfo({
            product_id: "6297000189437",
            product_id_type: "BARCODE",
            product_name: "Parkside",
            price: "1.00"
        }).save();
        new ProductInfo({
            product_id: "4019641064384",
            product_id_type: "BARCODE",
            product_name: "Gouda cheese",
            price: "5.00"
        }).save();
        new ProductInfo({
            product_id: "5449000025173",
            product_id_type: "BARCODE",
            product_name: "TicTak",
            price: "15.00"
        }).save();
        new ProductInfo({
            product_id: "5449000601971",
            product_id_type: "BARCODE",
            product_name: "Lacosta Shoes",
            price: "50.00"
        }).save();
        new ProductInfo({
            product_id: "10263099",
            product_id_type: "BARCODE",
            product_name: "Axe shower gel",
            price: "13.00"
        }).save();
        new ProductInfo({
            product_id: "5012334005458",
            product_id_type: "BARCODE",
            product_name: "Tooth brush",
            price: "75.00"
        }).save();
        new ProductInfo({
            product_id: "5026686007107",
            product_id_type: "BARCODE",
            product_name: "Dell laptop",
            price: "500.00"
        }).save();
        new ProductInfo({
            product_id: "5029551809301",
            product_id_type: "BARCODE",
            product_name: "German Ham",
            price: "11.00"
        }).save();
        new ProductInfo({
            product_id: "20019525",
            product_id_type: "BARCODE",
            product_name: "Ibuprofen",
            price: "2.00"
        }).save();

        return

    })

})*/
