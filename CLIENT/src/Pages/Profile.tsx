import React, {useContext} from 'react'
import {mContext} from './Context';

export default function Profile() {
    const ctx = useContext(mContext);
    return (
        <div className="row justify-content-center">
            <h1>Current Logged In User: {ctx.email}</h1>
            <h1>Current Logged In Id: {ctx._id}</h1>
        </div>
    )
}
