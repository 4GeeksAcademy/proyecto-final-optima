import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ModalDetails } from "./modalDetails";

export const CardDetails = (props) => {
    const [showBalance, setShowBalance] = useState(true)
    const path = useLocation()

    const toggleBalance = () => {
        let toggle = !showBalance
        setShowBalance(toggle);
    }
    return (
        <>
            <div className="card flex-row mb-3 " key={props.id} >
                <div className="card-body d-flex justify-content-around col-4 align-items-center " >
                    <div className="justify-content-center">
                        <h5 className="card-title ">Detalle Movimiento</h5>
                        <div className="">
                            <p>{props.accountName}</p>
                            <p>{props.detail}</p>
                        </div>
                    </div>
                </div>
                <div className="card-body d-flex justify-content-around col-4 align-items-center">
                    <div className="justify-content-center">
                        <p>{props.amount}</p>
                        <p>{props.coin}</p>
                    </div>
                </div>
                <div className="card-body d-flex justify-content-around col-4 align-items-center ">
                    <p>{props.date}</p>
                    <p>{props.time}</p>
                    <p>{props.type}</p>
                    <p>{props.operation}</p>
                </div>
                <div className="btn-group-vertical p-3" role="group" aria-label="Vertical button group">
                    <button type="button" class="btn btn-secondary"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-secondary"><i class="bi bi-trash-fill"></i></button>
                </div>
            </div>
        </>
    )
}
