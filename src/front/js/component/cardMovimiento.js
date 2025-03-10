import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ModalDetails } from "./modalDetails";

export const CardMovimientos = (props) => {
    const [showBalance, setShowBalance] = useState(true)
    const path = useLocation()

    const toggleBalance = () => {
        let toggle = !showBalance
        setShowBalance(toggle);
    }
    return (                   
                <div className="card flex-row mb-3 " key={props.id} >
                    <div className="card-body d-flex justify-content-around col-4 align-items-center " >
                        <div className="justify-content-center">
                            <h5 className="card-title ">Detalle Movimiento</h5>
                            <div className="">
                                <p>{props.details}</p>
                                <p>{props.amount}</p>
                                <p>{props.id}</p>
                                <p>{props.coin}</p>
                                <p>{props.date}</p>
                                <p>{props.time}</p>
                                <p>{props.type}</p>
                                <p>{props.operation}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
    )
}
