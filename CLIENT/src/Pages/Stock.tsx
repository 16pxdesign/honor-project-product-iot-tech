import React, {useEffect, useState, useContext} from 'react'
import Axios, {AxiosResponse} from 'axios'
import {mContext} from './Context';
import {IProduct, IReader, IUser} from '../Interfaces/Interfaces';
import {REST_URL} from "../config";
import {Container, InputGroup, Row} from "react-bootstrap";

export default function Stock() {
    const context = useContext(mContext);
    const header = ["ID"]
    const [data, setData] = useState<IProduct[]>();

    //fetch products form API
    const fetchProducts = () => {
        Axios.get(REST_URL + "/stock/all", {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setData(res.data.filter((item: IProduct) => {
                return item
            }))
        });
    }


    useEffect(() => {
        fetchProducts()
    }, [context]);

    if (!data) {
        return null;
    }

    //render table
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

            <h1 id='title'>Stock</h1>
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
                {renderTable(data)}


                </tbody>
            </table>


        </div>
    )
}
