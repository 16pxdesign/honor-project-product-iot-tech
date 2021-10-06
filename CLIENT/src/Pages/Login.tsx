import React, {useState} from 'react'
import axios, {AxiosResponse} from 'axios';
import {REST_URL} from "../config";

export default function Login() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")

    //login validation
    const validate = () => {
        const errors = []
        if (!email) {
            errors.push('Email field empty')
        }
        if (!password)
            errors.push('Password field empty')
        if (!email.includes("@"))
            errors.push('Email wrong format')
        if (password.length < 8)
            errors.push('Passoword too short')
        var reg = /\S+@\S+\.\S+/;
        if (!reg.test(email))
            errors.push('Email format wrong');
        setError(errors.length > 0 ? errors[0] : "");
        if (errors.length > 0)
            return false
        return true
    }
    //login user with API
    const login = () => {
        console.log(REST_URL + "/user/login")
        if (!validate())
            return
        axios.post(REST_URL + "/user/login", {
            email,
            password
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data === "success") {
                window.location.href = "/"
            }
        }, (res: AxiosResponse) => {
            setError('User not exist or your credentials are wrong')
            console.log("Failure [AxiosResponse fail]", res);
        })
        return
    }


    return (
        <div className="row justify-content-center">

            <form className="col-lg-4 col-md-6 col-sm">
                <h1>Login</h1>
                <div>{
                    error ? (<div style={{color: "red"}}>{error}</div>) : null
                }</div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" name="email"
                           aria-describedby="email"
                           placeholder="email" onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password"
                           placeholder="password" onChange={e => setPassword(e.target.value)}/>
                </div>
                <br/>


                <button type="button" onClick={login}>Login</button>
            </form>
        </div>
    )
}
