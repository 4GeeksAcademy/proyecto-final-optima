import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2"; // Importar SweetAlert

export const Card = (props) => {
    const [showBalance, setShowBalance] = useState(true);
    const path = useLocation();

    // Función para alternar la visibilidad del saldo
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
                props.onDelete(props.id);
            }
        });
    };

    return (
        <div className="card flex-row mb-3">
            <div className="card-body d-flex justify-content-around col-4 align-items-center">
                <div className="justify-content-center">
                    <h4 className="card-title">{props.name}</h4>
                    <div>
                        <p>Último movimiento</p>
                        <p>{props.detail}</p>
                        <p>{props.amount}</p>
                        <p>{props.date}</p>
                    </div>
                </div>
            </div>
            <div className="card-body d-flex justify-content-around col-4 align-items-center">
                <div className="justify-content-center">
                    <div className="d-flex">
                        <p className="card-text">{showBalance ? props.balance : "****"}</p>
                        <i
                            className={`bi ${showBalance ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                            onClick={toggleBalance}
                        ></i>
                        <p className="card-text">{props.coin}</p>
                    </div>
                </div>
            </div>
            <div className="card-body d-flex justify-content-around col-4 align-items-center">
                <Link to={`/cuentas/${props.id}`}>
                    <p className="btn btn-primary">Ver Más</p>
                </Link>
                <div className="btn-group-vertical p-3" role="group">
                    <button type="button" className="btn btn-secondary">
                        <i className="bi bi-pencil-square"></i>
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleDelete}>
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
