import React, {useEffect, useState, useContext, useCallback, useRef} from 'react'
import Axios, {AxiosResponse} from 'axios'
import {mContext} from './Context';
import {IProduct, IReader, IUser} from '../Interfaces/Interfaces';
import {REST_URL} from "../config";
import {Button, Col, Container, Row} from "react-bootstrap";
import io from "socket.io-client";
import {socket} from '../Components/socket'

const options: any = {
    withCredentials: true,
    autoConnect: false
};
//const socket = io("127.0.0.1:4000", options)

export default function Checkout() {


    const context = useContext(mContext);
    const header = ["Offset", "Product Id", "RSSI", 'TX', 'Name', 'Price']
    const [button, setButton] = useState(false);
    const [button2, setButton2] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [data, setData] = useState<IReader[]>();
    const [selectedReader, setselectedReader] = useState<string>();
    const [trans, setTrans] = useState<string>();
    const [timeout, setTimeout] = useState<number>(10_000);
    const [distance, setDistance] = useState<number>();

    //Get reader list from API
    const fetchReaders = () => {
        Axios.get(REST_URL + "/readers/active", {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setData(res.data.filter((item: IReader) => {
                return item
            }))
        })
    }
    //Start selected reader from list
    const start = () => {
        if (selectedReader) {
            clean()
            console.log('sent timeout', timeout)
            socket.emit('start_reader', selectedReader, timeout);
        }
    }
    //Clean page
    const clean = () => {
        setTableData([]);
        setButton2(true)
        setTrans(undefined)
    }
    //Stop reader for current transaction id
    const stop = () => {
        if (trans) {
            socket.emit('stop_reader', trans);
            setButton2(false)
        }

    }
    //Checkout scanned product using API request and redirect to order page
    const checkout = () => {
        console.log(tableData)
        Axios.post(REST_URL + "/checkout/", {
            user: context._id,
            transaction: trans,
            products: tableData
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            console.log('checkout respondd', res.data)
            if (res.data === "success") {
                setButton2(true)
                window.location.href = "/order/" + trans
            }
        })
    }
    //Add scanned product into API and redirect to stock page
    const addStock = () => {

        tableData.map((item: any) => {
            Axios.post(REST_URL + "/stock/add", {
                product_id: item.product_id,
            }, {
                withCredentials: true
            }).then((res: AxiosResponse) => {
                console.log('checkout respondd', res.data)
                if (res.data === "success") {
                    window.location.href = "/stock/"
                }
            })

        })

    }
    //simple beacon distance calculation based on tag signal
    const calculateAccuracy = (txPower: number, rssi: number): number => {
        if (rssi === 0) {
            return -1; // if we cannot determine accuracy, return -1.
        }
        if (txPower === 0) {
            return -1; // if we cannot determine accuracy, return -1.
        }

        var ratio = rssi * 1 / txPower;
        if (ratio < 1.0) {
            return Math.pow(ratio, 10);
        } else {
            return ((0.89976) * Math.pow(ratio, 7.7095) + 0.111);
        }
    }
    //filter data for distance
    const dist = () => {
        if (distance) {
            // @ts-ignore
            setTableData(current => current.filter(x => Number(x?.distance) < distance))
        }

    }
    //filter data for beacon type
    const beacon = () => {
        // @ts-ignore
        setTableData(current => current.filter(x => x.reader_type == "BLUETOOTH" ? (x.product_id.startsWith("4c000215") ? x : false) : false))
    }

    useEffect(() => {

        fetchReaders()

        socket.on('connect', () => {
                console.log('Socket connected')
                setButton(false)
            }
        );
        socket.on('reader_started', (id: string) => {
            setButton(true);
            console.log(id);
            setTrans(id)
        })
        socket.on('scanned', (dataSocket: any) => {

            /** Order info add */
            const resp2 = Axios.get(REST_URL + "/info/" + dataSocket?.product_id, {withCredentials: true}).then((r) => {
                const info = r.data[0]
                console.log(info)
                Object.assign(dataSocket, info);
                let accuracy = -1
                if (dataSocket.product_tx && dataSocket.product_rssi)
                    accuracy = calculateAccuracy(dataSocket.product_tx, dataSocket.product_rssi);
                if (accuracy > -1) {
                    const c = {distance: accuracy.toFixed(2)}
                    Object.assign(dataSocket, c);
                    console.log('dataSocket with distance', dataSocket)
                }

                console.log('tableData before', tableData)
                console.log(tableData.find((i: IProduct) => i.product_id == dataSocket.product_id))


                if (!(tableData.find((i: IProduct) => i.product_id.toString().trim() === dataSocket.product_id.toString().trim()))) {
                    console.log('addd', dataSocket)
                    // @ts-ignore
                    setTableData(currentData => currentData.find((i: IProduct) => i.product_id === dataSocket.product_id) ? currentData : [...currentData, dataSocket])
                } else if (dataSocket.reader_type == 'BARCODE') {
                    console.log('BARCODE');
                    // @ts-ignore
                    setTableData(currentData => [...currentData, dataSocket])
                } else {
                    console.log('skip')
                }


                console.log('tableData', tableData)
            });

        })

        socket.on('reader_stopped', (transaction: string, id: string) => {
            if (transaction == trans) {
                console.log('Stopped ', transaction)
                //setTrans(current => current == transaction ? undefined : current)
                setButton(false)
                setButton2(false)
            }
        })
        socket.on('disconnect', () => {
            setButton(true)
        })


        return () => {
            socket.off('connect');
            socket.off('reader_started')
            socket.off('reader_stopped')
            socket.off('scanned')
            socket.off('disconnect')
        }


    }, [trans, tableData]);

    if (!data) {
        return null;
    }

    const renderTable = (data: any) => {
        return data.map((item: any) => {
            return (
                <tr key={item.offset}>
                    <td>{item.offset}</td>
                    <td>{item.product_id}</td>
                    <td>{item.product_rssi}</td>
                    <td>{item.product_tx}</td>
                    <td>{item.product_name}</td>
                    <td>{item.price}</td>
                    <td>{item.device_name}</td>
                    <td>{item.device_mac}</td>
                    <td>{item.distance}</td>
                    <td>{item.product_extra}</td>
                    <td>
                        {/*  <button onClick={() => removeData(item._id)}>Delete</button>*/}
                    </td>
                </tr>
            )
        })
    }

    const border = {
        "border": "1px solid red"
    }

    return (

        <Container className="justify-content-center">
            <select onChange={e => setselectedReader(e.target.value)} name="selectReader" id="selectReader">
                <option id="Select reader">Select reader</option>
                {
                    data.map((item: IReader) => {
                        return (
                            <option key={item.reader_id} id={item.reader_id}>{item.reader_id}</option>
                        )
                    })
                }
            </select>

            <input onChange={e => setTimeout(Number(e.target.value))} value={timeout}/>


            <Button disabled={button} onClick={start}>Start</Button>
            <Button onClick={clean}>Clean</Button>
            <Button onClick={stop}>Stop</Button>
            <Button disabled={button2} onClick={checkout}>Checkout</Button>
            <Button className="btn-danger" disabled={button2} onClick={addStock}>Stock it(cheat)</Button>
            <Row>
                <h1 id='title'>Scanned products {trans ? ' for transaction:' : ''} {trans}</h1>
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
                    {renderTable(tableData)}


                    </tbody>
                </table>


            </Row>
            <Row>
                <input onChange={e => setDistance(Number(e.target.value))} placeholder="distance"/>
                <button onClick={dist}>Filter</button>
                <button onClick={beacon}>Filter Beacons</button>
            </Row>
        </Container>
    )
}
