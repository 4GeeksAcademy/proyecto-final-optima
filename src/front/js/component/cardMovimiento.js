import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const CardMovimientos = (props) => {
    const [showBalance, setShowBalance] = useState(true)
    const path = useLocation()

    const toggleBalance = () => {
        let toggle = !showBalance
        setShowBalance(toggle);
    }
    return (                   
                <div className="card flex-row mb-3 "  >
                    <div className="card-body d-flex justify-content-around col-4 align-items-center " >
                        <div className="justify-content-center">
                            <h5 className="card-title ">{props.name}</h5>
                            <div className="">
                                <p>detalle</p>
                                <p>Egreso o ingreso</p>
                                <p>monto</p>
                                <p>fecha</p>
                                <p>hora</p>
                            </div>
                        </div>
                    </div>
                </div>
    )
}
