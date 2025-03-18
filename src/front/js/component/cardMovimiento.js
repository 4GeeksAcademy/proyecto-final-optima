import React, { useState } from "react";
import "../../styles/card.css";

export const CardMovimientos = (props) => {

    return (
        <div className="card mb-3 p-3" key={props.id}>
            <div className="row g-0 align-items-center text-center w-100">
                <div className="col-md-4 col-lg-4">
                    <h4 className="mb-1"><strong>{props.accountName}</strong></h4>
                    <h5 className="card-title">Detalle Movimiento</h5>
                    <p className="mb-1">{props.detail}</p>
                </div>
                <div className="col-md-3 col-lg-3">
                    <p className="mb-1 fw-bold">{props.amount}</p>
                    <p className="mb-1">{props.coin}</p>
                </div>
                <div className="col-md-3 col-lg-3">
                    <p className="mb-1">{props.date} - {props.time}</p>
                    <p className="mb-1">{props.type}</p>
                    <p className="mb-1">{props.operation}</p>
                </div>
                <div className="btn-group-vertical col-md-2 d-flex flex-column col-lg-2" role="group" aria-label="Vertical button group">
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        data-bs-toggle="modal" 
                        data-bs-target="#editModalDetail" 
                        onClick={props.onUpdate}
                    >
                        <i className="bi bi-pencil-square"></i> Editar
                    </button>
                    {/* <button type="button" className="btn btn-secondary">
                        <i className="bi bi-trash-fill"></i> Eliminar
                    </button> */}
                </div>
            </div>
        </div>
    );
};
