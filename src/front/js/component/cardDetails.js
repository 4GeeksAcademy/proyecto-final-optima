import React, {useContext} from "react";
import Swal from "sweetalert2";
import "../../styles/card.css";
import { Context } from "../store/appContext";

export const CardDetails = (props) => {
    const {store, actions} = useContext(Context)

    const handleDelete = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará el movimiento permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("ID del movimiento a eliminar:", props.id);
                actions.deleteMovement(props.id);
            }
        });
    };

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
                <div className="btn-group-vertical col-md-2 d-flex flex-column col-lg-2" role="group" aria-label="Vertical button group">                    <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#editModalDetail"
                    id={props.id}
                    onClick={props.onUpdate}
                >
                    <i className="bi bi-pencil-square"></i> Editar
                </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        id={props.id}
                        onClick={handleDelete}
                    >
                        <i className="bi bi-trash-fill"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};
