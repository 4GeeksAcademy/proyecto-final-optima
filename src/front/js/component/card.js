import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";


export const Card = (props) => {
    const [showBalance, setShowBalance] = useState(true)
    const { store, actions } = useContext(Context)

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };


    const handleDelete = () => {               
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará la cuenta y todos sus movimientos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                actions.DeleteAccount(props.id);
            }
        });
    };

    return (
        <div className="card flex-row mb-3">
            <div className="card-body d-flex justify-content-around col-4 align-items-center">
                <div className="justify-content-center">
                    <h4 className="card-title">{props.name}</h4>
                    <div>
                        <p className="last-movement">Último movimiento</p>
                        <p>{props.detail}</p>
                        <p>{props.amount}</p>
                        <p>{props.date}</p>
                    </div>
                </div>
            </div>
            <div className="card-body d-flex justify-content-around col-4 align-items-center">
                <div className="justify-content-center">
                    <div className="balance">
                        <p className="card-text">{showBalance ? props.balance : "****"}</p>
                        <i
                            className={`bi ${showBalance ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                            onClick={toggleBalance}
                        ></i>
                        <p className="card-text">{props.coin}</p>
                    </div>
                </div>
            </div>
            <div className="card-buttons d-flex justify-content-around col-4 align-items-center">
                <Link to={`/cuentas/${props.id}`}>
                    <p className="button-more-info btn btn-primary">Ver Más</p>
                </Link>
                <div className="buttons-edit-delete btn-group-vertical p-3" role="group">
                    <button type="button" className="button-edit btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editModal" id={props.id} onClick={() => props.onUpdate()}>
                        <i className="bi bi-pencil-square"></i>
                    </button>
                    <button type="button" className="button-delete btn btn-secondary" onClick={handleDelete}>
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
