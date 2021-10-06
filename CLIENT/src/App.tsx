import React, { useContext } from 'react';
import Header from './Components/Header';
import { BrowserRouter, Switch, Route , Redirect} from 'react-router-dom';
import Homepage from './Pages/Homepage';
import AdminPage from './Pages/AdminPage';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import "./main.css";
import { mContext } from './Pages/Context';
import Register from './Pages/Register';
import Sidebar from "./Components/Sidebar";
import NotFoundPage from "./Pages/NotFoundPage";
import Checkout from "./Pages/Checkout";
import {Test} from "./Pages/Test";
import Readers from "./Pages/Readers";
import Order from "./Pages/Order";
import Transactions from "./Pages/Transactions";
import Find from "./Pages/Find";
import Products from "./Pages/Products";
import Stock from "./Pages/Stock";
import Inventory from "./Pages/Inventory";

function App() {
  const ctx = useContext(mContext);
  return (
    <BrowserRouter>
    <Header />


      {ctx ? <Sidebar /> : null}

      <main className= {ctx ? "col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4" : "col px-md-4 py-4" } >

      <Switch>
        <Route path='/' exact component={Homepage}></Route>
        <Route path='/test' exact component={Test}></Route>


        {
            ctx ? (
              <>
                {ctx.role === 2 ? <Route path='/admin' component={AdminPage}></Route> : null}
                <Route path='/profile' component={Profile}></Route>
                <Route path='/inventory/:id' component={Inventory}></Route>
                <Route path='/stock' component={Stock}></Route>
                <Route path='/products' component={Products}></Route>
                <Route path='/find' component={Find}></Route>
                <Route path='/checkout' component={Checkout}></Route>
                <Route path='/manage' component={Readers}></Route>
                <Route path='/order/:id' component={Order}></Route>
                <Route path='/transactions' component={Transactions}></Route>

              </>
            ) : (
              <>
                <Route path='/login' component={Login}></Route>  
                <Route path='/register' component={Register}></Route>

              </>  
            )


        }
        <Route path='/404' component={NotFoundPage} ></Route>
        <Redirect to="/404" />




      </Switch>
      </main>
    </BrowserRouter>
  );
}
export default App;
