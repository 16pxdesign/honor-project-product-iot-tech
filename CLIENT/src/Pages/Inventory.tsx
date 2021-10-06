import React, {useEffect, useState, useContext} from 'react'
import Axios, {AxiosResponse} from 'axios'
import {mContext} from './Context';
import {IProduct, IReader, IUser} from '../Interfaces/Interfaces';
import {REST_URL} from "../config";
import {Button, InputGroup} from "react-bootstrap";

export default function Inventory(props: any) {
    const header = ["ID"]
    const [stock, setStock] = useState<IProduct[]>();
    const [invent, setInvent] = useState<IProduct[]>();
    const [noInInvent, setnoInInvent] = useState<IProduct[]>();
    const [noInStock, setnoInStock] = useState<IProduct[]>();
    const [both, setBoth] = useState<IProduct[]>();

    const sub = (a: any, b: any) => {
        const tempArray: any = [...a];
        const ids = b.map((x: any) => x.product_id);
        for (let i of ids) {
            const find = tempArray.find((x: any) => x.product_id == i);
            let index = tempArray.indexOf(find);
            if (index != -1) {
                tempArray.splice([index], 1)
            }
        }

        return tempArray

    }

    useEffect(() => {
        let time = props.match.params.id || 60;
        console.log(time)
        Axios.all([
            Axios.get(REST_URL + "/stock/all", {withCredentials: true}),
            Axios.get(REST_URL + "/inventory/" + time, {withCredentials: true})
        ]).then(Axios.spread((s, i) => {

            const stock_res = s.data.filter((item: IProduct) => {
                return item
            })
            const inv_res = i.data.filter((item: IProduct) => {
                return item
            })
            const miss = sub(stock_res, inv_res);
            const extra = sub(inv_res, stock_res);
            const match = sub(inv_res, extra);

            setnoInInvent(miss);
            setBoth(match);
            setnoInStock(extra);
        }))


    }, []);

    if (!both) {
        return null;
    }

    //Render table with data
    const renderTable = (data: any) => {
        return data.map((item: IProduct) => {
            return (
                <tr key={item._id}>
                    <td>{item.product_id}</td>

                </tr>
            )
        })
    }

    return (
        <div className="row justify-content-center">
            <h1 id='title'>Inventory</h1>
            <table id='records'>
                <thead>

                {
                    header.map((item: string) => {
                        return (
                            <th>{item}</th>
                        )
                    })
                }

                </thead>
                <tbody>
                <tr>
                    <td style={{backgroundColor: "green"}}>Matching stock</td>
                </tr>
                {both ? renderTable(both) : ''}
                <tr>
                    <th style={{backgroundColor: "red"}}>Missing stock</th>
                </tr>
                {noInInvent ? renderTable(noInInvent) : ''}
                <tr>
                    <th style={{backgroundColor: "orange"}}>Over stock</th>
                </tr>
                {noInStock ? renderTable(noInStock) : ''}

                </tbody>
            </table>

        </div>
    )
}
