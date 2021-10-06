import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {mContext} from '../Pages/Context'
import Axios, {AxiosResponse} from 'axios';
import {REST_URL} from "../config";

export default function Header() {
    const ctx = useContext(mContext);

    //request to API to logout user.
    const logout = () => {
        Axios.get(REST_URL+ "/user/logout", {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data === "success") {
                window.location.href = "/";
            }
        })
    }
    return (
        <div>
            <nav className="navbar navbar-light bg-light p-2">
                <div
                    className="d-flex col-12 col-md-3 col-lg-2 mb-2 mb-lg-0 flex-wrap flex-md-nowrap justify-content-between">
                    <Link to="/" className="navbar-brand" href="#">
                        IoT Management System
                    </Link>
                </div>

                <div className="col-12 col-md-5 col-lg-8 d-flex align-items-center justify-content-md-end mt-3 mt-md-0">

                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-expanded="false">
                            {ctx ? (<>{ctx.email}</>):(<>User management</>)}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                            {ctx ? (
                                <>
                                    {ctx.role === 2 ? (<li><Link to="/admin">Admin</Link></li>) : null}
                                    <li><Link to="/profile">Profile</Link></li>
                                    <li><Link onClick={logout} to="/logout">Logout</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/register">Register</Link></li>
                                </>
                            )
                            }

                        </ul>
                    </div>
                </div>
            </nav>
        </div>

    )
}
