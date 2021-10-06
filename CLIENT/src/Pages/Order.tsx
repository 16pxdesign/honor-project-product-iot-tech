import React, {useEffect, useState} from 'react'
import Axios, {AxiosResponse} from "axios";
import {REST_URL} from "../config";
import {Container, Row} from "react-bootstrap";
import {IProduct, IReader, ITransaction} from "../Interfaces/Interfaces";


export default function Order(props: any) {

    const [data, setData] = useState<ITransaction>();
    const [inter, setInter] = useState<any>(false);

    //fetch orders from API
    const fetchOrder = async () => {

        const resp = await Axios.get(REST_URL + "/order/id/" + props.match.params.id, {withCredentials: true});
        let transactionResp: ITransaction = resp.data[0]

        for (const product of transactionResp.products) {
            const resp2 = await Axios.get(REST_URL + "/info/" + product?.product_id, {withCredentials: true});
            const info = resp2.data[0]
            console.log(info)
            Object.assign(product, info);

        }
        console.log('ello', transactionResp)


        setData(transactionResp)
    }


    useEffect(() => {
        fetchOrder()
        let interval: any;
        console.log(data?.approved)
        if (!inter) {
            console.log(false)
            interval = setInterval(() => fetchOrder(), 15_000);
        }
        return () => {
            clearInterval(interval);
        };

    }, [inter]);

    //Render products using data
    const renderProducts = (data: any) => {
        return data.map((item: any) => {
            return (
                <div className="d-flex justify-content-between">
                    <span className="font-weight-bold">{item.product_id}</span>
                    <span className="text-muted">{item.product_name}</span>
                    <span className="text-muted">{item.product_id_type}</span>
                    <span className="text-muted">{item.price}</span>
                </div>
            )
        })
    }
    //render reasons
    const renderReasons = (data: any) => {
        return data.map((item: any) => {
            return (
                <Row>
                    <span className="font-weight-bold">{item}</span>
                </Row>
            )
        })
    }

    return (
        <Container className=" justify-content-center">

            <Row><span>Order id: {props.match.params.id}</span></Row>

            <Row><span>Order status: {data?.approved == true ? 'Approved' : 'Non approved'}</span></Row>

            {data?.reason ? renderReasons(data?.reason) : ''}

            <div className="mb-3"></div>

            <span className="theme-color">Products</span>
            <div className="mb-3">
                <hr className="new1"/>
            </div>
            {data?.products ? renderProducts(data?.products) : ''}


        </Container>


    )
}
