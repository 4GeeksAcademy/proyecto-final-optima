import React, { useContext } from "react";
import Swal from "sweetalert2";
import "../../styles/card.css";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";


export const CardMovimientos = (props) => {
    const params = useParams()
    const path = useLocation()
    const { store, actions } = useContext(Context)
    async function deleteMovement(movementId) {
        const myHeaders = new Headers();
        myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZvgMRXwa2X-9-ozv0O4hEdRO9-FBx5HLMSf9sjKBJxhQVudR_zYviNSXQFhEbiwbCufyM3Eqp_ijD_1eSFd_0f_FtgYfWQMIfeBrsWEaazTHWa81w7hWgAeiX2VF-jEfy_v-1RuKxSuT6FhLjgxOQMv01l_dpMY74s2GaDLDYGUnV3RzgUUCivjn5AIxOZpg1q_-2YRpEbWaE9piRRs6prJA2Nkrkw2XQnSpFUq1WxaiwXBuGFvcjiwZ52o5b8eYkFo6wCnQsmQqGwZiAB-Uwq-K-3o9xdVzqGaIR2pQ3uBx7jen5iISs6X5iIAik3DiTHPUSrzMoN8wMEa5UfxdOoIoJv4JC0ILVHUYrq6HEO59Tml_5-U59kDOfYE1VaoglgZ8mjyWPCfGPQVxfuO6mD_Mi54MXFo0B934EYZ6ZltMm-uLhHJdwo0qT9UaWxaIz2Qff4lwH_gnV-EVRcCOzJNu5_V0jRKKGCLHs3RRFia1QLC9nXB7A7gQQGPVx6evqfFtWGpIg7ucdQtvk9JYlmJeBvzh0oJD-9r7Gqo0nuFf4HySa2qd3yuHQr9lB1XL0VeIRjsxtDygjWzve_M1Wc71SO67YmPQohQcVTRPnZBd3GTsifRREbJ7v3E8-q2B_lQB8c6Fb3Bfn7IQudIawLXqISm9k5M7hWfZx-_Y9p0QjvG3zJADjOW5kn6NXn0-9O4_8TblVsE12g7uRrvTNquVRBGhyZoO891r4aPmFYQaH0psOXPA-uvXb5jv0t04OD6f7ii7zc3I5MMvzMLtycpQOHRJcYJDz1qrScJ38s_Q1mKL14cMaBvRi6hS9vnNKOCefPnyzmvyyxMA-KnkV7k4FogOkwlO2LrGnpH3HYodBSW0Em3ywoAsrX6Feiq-si_zaHFo9Dy0oB9hDcrgqjOMgvUG3JwtzH-OvA2yxiTyqVLjW0fmSdbDL0J7tg8W6bUwiv9M5-sAZbqJu0nBulm");

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/account-detail/${movementId}`, requestOptions);
            const result = await response.json();
            if (response.status === 200) {
                localStorage.removeItem("userAccounts")
                await actions.getAccountsUser();
                if (path.pathname === "/movimientos") {
                    await actions.getDetailsUser();
                } else {
                    await actions.getAccountsDetail(params.id);
                }
            }
        } catch (error) {
            console.error(error);
        };
    }
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
                console.log(params);
                deleteMovement(props.id);
            }
        });
    };

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
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleDelete}
                    >
                        <i className="bi bi-trash-fill"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};