import React, {useEffect, useState, useContext} from 'react'
import Axios, {AxiosResponse} from 'axios'
import {mContext} from './Context';
import {IReader, IUser} from '../Interfaces/Interfaces';
import {REST_URL} from "../config";

export default function Readers() {
    const context = useContext(mContext);
    const header = ["ID", "Reader id", "Last seen", 'State', 'Action']
    const [data, setData] = useState<IReader[]>();

    const fetchReaders = () => {
        Axios.get(REST_URL + "/readers", {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setData(res.data.filter((item: IReader) => {
                return item
            }))
        });
    }

    useEffect(() => {
        fetchReaders()
    }, [context]);

    if (!data) {
        return null;
    }
    //Save ne state of reader in service API
    const changeReaderState = (id: string, active: boolean) => {
        Axios.post(REST_URL + "/readers/state", {
            id: id,
            active: !active
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            fetchReaders()
        })

    }
    //render table
    const renderTable = (data: any) => {
        return data.map((item: IReader) => {
            return (
                <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.reader_id}</td>
                    <td>{item.date}</td>
                    <td>{item.active == true ? 'enable' : 'disable'}</td>
                    <td>
                        <button
                            onClick={() => changeReaderState(item._id, item.active)}>{item.active == false ? 'enable' : 'disable'}</button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="row justify-content-center">

            <h1 id='title'>Readers</h1>
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
