import React, {useContext, useEffect, useState} from 'react'
import Axios, {AxiosResponse} from 'axios'
import {mContext} from './Context';
import {IReader, ITransaction} from '../Interfaces/Interfaces';
import {REST_URL} from "../config";

export default function Transactions() {
    const context = useContext(mContext);
    const header = ["ID", "Date", 'State', 'Action']
    const [data, setData] = useState<IReader[]>();

    const fetchTransactions = () => {
        Axios.get(REST_URL + "/order/transactions", {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setData(res.data.filter((item: ITransaction) => {
                return item
            }))
        });
    }

    useEffect(() => {
        fetchTransactions()
    }, [context]);

    if (!data) {
        return null;
    }


    const renderTable = (data: any) => {
        return data.map((item: ITransaction) => {
            return (
                <tr key={item._id}>
                    <td>{item.transaction_id}</td>
                    <td>{item.date}</td>
                    <td>{item.approved == true ? 'Approved' : 'Not approved'}</td>
                    <td>
                        <button onClick={event => window.location.href = '/order/' + item.transaction_id}>Details
                        </button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="row justify-content-center">

            <h1 id='title'>User Transactions</h1>
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
