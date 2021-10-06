import React, {createContext, PropsWithChildren, useEffect, useState} from 'react'
import Axios, {AxiosResponse} from 'axios'
import {IUser} from '../Interfaces/Interfaces'
import {REST_URL} from "../config";

export const mContext = createContext<Partial<IUser>>({})
export default function Context(props: PropsWithChildren<any>) {
    const [user, setUser] = useState<IUser>()
    useEffect(() => {
        Axios.get(REST_URL + "/user", {withCredentials: true}).then((res: AxiosResponse) => {
            setUser(res.data);
            console.log('ctx', res.data);
        }, (res: AxiosResponse) => {
            console.log("Failure in context [AxiosResponse fail]", res.data, REST_URL);
        })
    }, []);

    return (
        <mContext.Provider value={user!}>{props.children}</mContext.Provider>
    )
}
