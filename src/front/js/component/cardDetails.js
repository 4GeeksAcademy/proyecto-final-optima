import React from "react";
import "../../styles/card.css";

export const CardDetails = (props) => {
    return (
        <div className="card-details card mb-3 p-3" key={props.id}>
            <div className="card-details-2 row g-0 align-items-center w-100">
                <div className="col-md-4 text-center">
                <h4 className="mb-1"><strong>{props.accountName}</strong></h4>
                    <h5 className="card-title-detail">Detalle Movimiento</h5>
                    <p className="mb-1">{props.detail}</p>
                </div>
                <div className="col-md-3 text-center">
                    <p className="mb-1 fw-bold">{props.amount}</p>
                    <p className="mb-1">{props.coin}</p>
                </div>
                <div className="col-md-3 text-center">
                    <p className="mb-1">{props.date}</p>
                    <p className="mb-1">{props.time}</p>
                    <p className="mb-1">{props.type}</p>
                    <p className="mb-1">{props.operation}</p>
                </div>
                <div className="col-md-2 d-flex flex-column gap-2">
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        data-bs-toggle="modal" 
                        data-bs-target="#editModalDetail" 
                        id={props.id} 
                        onClick={props.onUpdate}
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>
                    {/* <button 
                        type="button" 
                        className="btn btn-danger" 
                        id={props.id}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </button> */}
                </div>
            </div>
        </div>
    );
};
