import React, {useEffect, useState, useContext} from 'react'
import Axios, {AxiosResponse} from 'axios'
import {mContext} from './Context';
import {IUser} from '../Interfaces/Interfaces';
import {REST_URL} from "../config";

export default function AdminPage() {
    const context = useContext(mContext);
    const header = ["ID", "Email", "Role", 'Action']
    const [data, setData] = useState<IUser[]>();

    //get users from API
    const fetchUsers = () => {
        Axios.get(REST_URL + "/user/list", {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setData(res.data.filter((item: IUser) => {
                return item.email !== context.email
            }))
        });
    }

    useEffect(() => {
        fetchUsers()
    }, [context]);

    if (!data) {
        return null;
    }

    //Remove selected data using API
    const removeData = (id: string) => {
        Axios.post(REST_URL + "/user/delete", {
            id: id
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            fetchUsers()
        })

    }
    // Use to render table
    const renderTable = (data: any) => {
        return data.map((item: IUser) => {
            return (
                <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>
                        <button onClick={() => removeData(item._id)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="row justify-content-center">

            <h1 id='title'>Users</h1>
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
