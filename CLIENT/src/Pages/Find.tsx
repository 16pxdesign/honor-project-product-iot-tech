import React, {useEffect, useState, useContext} from 'react'
import Axios, {AxiosResponse} from 'axios'
import {mContext} from './Context';
import {IProduct, IReader, IUser} from '../Interfaces/Interfaces';
import {REST_URL} from "../config";
import {Container, InputGroup, Row} from "react-bootstrap";

export default function Find() {
    const context = useContext(mContext);
    const header = ["ID"]
    const [data, setData] = useState<IProduct[]>();
    const [id, setId] = useState('');


    //finding product in API by id
    const findProduct = () => {

        Axios.get(REST_URL + "/inventory/find/" + id, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            console.log(res.data)
            setData(res.data.filter((item: IProduct) => {
                return item
            }))
        });
    }

    useEffect(() => {

    }, [context]);


    const renderTable = (data: any) => {
        return data.map((item: any) => {
            return (
                <tr key={item._id}>
                    <td>{item.product_id}</td>
                    <td>{item.reader_id}</td>
                    <td>{item.date}</td>

                </tr>
            )
        })
    }

    return (
        <div className="row justify-content-center">

            <h1 id='title'>Find</h1>
            <Container>
                <Row>
                    <input onChange={e => setId(e.target.value)} placeholder="id"/>
                    <button onClick={findProduct}>FIND</button>
                </Row>
                <Row>
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
                        {data ? renderTable(data) : ''}


                        </tbody>
                    </table>

                </Row>
            </Container>


        </div>
    )
}
