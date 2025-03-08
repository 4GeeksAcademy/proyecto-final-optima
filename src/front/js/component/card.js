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
            {path.pathname === "/cuentas" ?
                <div className="card flex-row mb-3 " key={props.id} >
                    <div className="card-body d-flex justify-content-around col-4 align-items-center " >
                        <div className="justify-content-center">
                            <h5 className="card-title ">{props.name}</h5>
                            <div className="">
                                <p>Ultimo movimiento</p>
                                <p>Detalle ultimo movimiento</p>
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
                        </Link>
                    </div>
                </div>
                : <div className="card flex-row mb-3 "  >
                    <div className="card-body d-flex justify-content-around col-4 align-items-center " >
                        <div className="justify-content-center">
                            <h5 className="card-title ">Detalle Ultimo movimiento</h5>
                            <div className="">
                                <p>detalle</p>
                                <p>Egreso o ingreso</p>
                                <p>monto</p>
                                <p>fecha</p>
                                <p>hora</p>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}
