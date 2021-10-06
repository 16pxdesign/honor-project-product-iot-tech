import React, {useEffect, useState, useContext} from 'react'
import Axios, {AxiosResponse} from 'axios'
import {mContext} from './Context';
import {IProduct, IReader, IUser} from '../Interfaces/Interfaces';
import {REST_URL} from "../config";
import {InputGroup} from "react-bootstrap";

export default function Products() {
    const context = useContext(mContext);
    const header = ["ID", "Type", "Name", 'price', 'Action']
    const [data, setData] = useState<IProduct[]>();


    const [p_id, setp_id] = useState<string>();
    const [p_type, setp_type] = useState<string>();
    const [p_name, setp_name] = useState<string>();
    const [p_price, setp_price] = useState<string>();

    //fetch products from API
    const fetchProducts = () => {
        Axios.get(REST_URL + "/info/list", {
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

    //Delete product using API
    const deleteProduct = (id: string | undefined) => {
        Axios.post(REST_URL + "/info/delete", {
            id: id,
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            fetchProducts()
        })

    }
    //Add product using API
    const addProduct = () => {
        Axios.post(REST_URL + "/info/add", {
            price: p_price,
            product_id: p_id,
            product_id_type: p_type,
            product_name: p_name

        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            fetchProducts()
        })
    }
    //render table with data
    const renderTable = (data: any) => {
        return data.map((item: IProduct) => {
            return (
                <tr key={item._id}>
                    <td>{item.product_id}</td>
                    <td>{item.product_id_type}</td>
                    <td>{item.product_name}</td>
                    <td>{item.price}</td>
                    <td>
                        <button onClick={() => deleteProduct(item._id)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="row justify-content-center">

            <h1 id='title'>Product info</h1>
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
            <div className="mb-1"></div>

            <input onChange={e => setp_id(e.target.value)} placeholder="id"/>
            <input onChange={e => setp_type(e.target.value)} placeholder="type"/>
            <input onChange={e => setp_name(e.target.value)} placeholder="name"/>
            <input onChange={e => setp_price(e.target.value)} placeholder="price"/>
            <button onClick={() => addProduct()}>Add</button>
        </div>
    )
}
