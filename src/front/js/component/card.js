import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const Card = (props) => {
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
                        <h4 className="card-title ">{props.name}</h4>
                        <div className="">
                            <p>Ultimo movimiento</p>
                            <p>{props.detail}</p>
                            <p>{props.amount}</p>
                            <p>{props.date}</p>

                        </div>
                    </div>
                </div>
                <div className="card-body d-flex justify-content-around col-4 align-items-center">
                    <div className="justify-content-center">
                        <div className="d-flex ">
                            <p className="card-text justify-content-around" >{showBalance ? props.balance : "****"}</p>
                            {showBalance ? <i className="bi bi-eye-fill" onClick={toggleBalance}></i> : <i className="bi bi-eye-slash-fill" onClick={toggleBalance}></i>}
                            <p className="card-text ">{props.coin}</p>
                        </div>
                    </div>
                </div>
                <div className="card-body d-flex justify-content-around col-4 align-items-center ">
                    <Link to={`/cuentas/${props.id}`}>
                        <p href="#" className="btn btn-primary  ">Ver Mas</p>
                        <div className="btn-group-vertical p-3" role="group" aria-label="Vertical button group">                          
                                <button type="button" class="btn btn-secondary"><i class="bi bi-pencil-square"></i></button>
                                <button type="button" class="btn btn-secondary"><i class="bi bi-trash-fill"></i></button>                            
                        </div>
                    </Link>
                </div>
            </div>

        </>
    )
}
