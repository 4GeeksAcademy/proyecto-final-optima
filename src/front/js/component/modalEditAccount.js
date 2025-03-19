import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Swal from 'sweetalert2'
import "../../styles/modal.css";

export const ModalEditAccount = (props) => {
    const { actions } = useContext(Context)
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [inputValue, setInputValue] = useState({
        name: "",
        balance: "",
        coin: "",
        type: ""
    })

    async function putAccount(body) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "name": body.name,
            "balance": body.balance,
            "coin": body.coin,
            "type": body.type
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/accounts/${props.cardId}`, requestOptions);
            const result = await response.json();
            if (response.status === 200) {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const raw = JSON.stringify({
                    "detail": "CUENTA EDITADA",
                    "amount": result.balance,
                    "coin": result.coin,
                    "type": "Nuevo saldo",
                    "date": currentDate,
                    "time": currentTime,
                    "operation": "ingreso"
                });

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/new-account-detail/${result.id}`, requestOptions);
                    const data = await response.json();
                    if (response.status === 200) {
                        localStorage.removeItem("userAccounts")
                        await actions.getAccountsUser();
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Campos incompletos, asegúrate de escribir toda la información',
                    icon: 'error',
                    confirmButtonText: 'Volver',
                    confirmButtonColor: "#010D87",
                    customClass: {
                        confirmButton: "swal-confirm-btn"
                    }
                })
            }
        } catch (error) {
            console.error(error);
        };
    }
    const editAccount = () => {
        if (inputValue.name.length !== 0 && inputValue.type !== "") {
            putAccount(inputValue)
            Swal.fire({
                title: "Movimiento registrado con éxito",
                icon: "success",
                customClass: {
                    confirmButton: "swal-confirm-btn"
                }
            });

            setInputValue({
                name: "",
                balance: "",
                coin: "",
                type: ""
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Campos incompletos, asegúrate de escribir toda la información',
                icon: 'error',
                confirmButtonText: 'Volver',
                customClass: {
                    confirmButton: "swal-confirm-btn"
                }
            });
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value });
    };

    useEffect(() => {
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];
        const formattedTime = now.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        setCurrentDate(formattedDate);
        setCurrentTime(formattedTime);
    }, []);

    return (
        <>
            <div className="modal" id="editModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: props.show ? "block" : "none" }} >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Editar Espacio
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => props.onClose()}></button>
                        </div>
                        <div className="modal-body d-flex gap-2">
                            <input
                                type="text"
                                className="form-control input-name"
                                placeholder="Nombre"
                                value={inputValue.name}
                                aria-label="Nombre"
                                name="name"
                                required
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                className="form-control input-balance"
                                placeholder="Balance"
                                value={inputValue.balance}
                                aria-label="Balance"
                                name="balance"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="px-5 pb-3">
                            <select
                                className="form-select"
                                aria-label="Moneda"
                                name="coin"
                                required
                                value={inputValue.coin}
                                onChange={handleChange}>
                                <option value="">Moneda</option>
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                                <option value="BTC">BTC</option>
                                <option value="COP">COP</option>
                                <option value="ARS">ARS</option>
                                <option value="KRW">KRW</option>
                                <option value="JPY">JPY</option>
                            </select>
                        </div>
                        <div className="px-5 pb-3">
                            <select
                                className="form-select"
                                aria-label="Tipo de Espacio"
                                name="type"
                                required
                                value={inputValue.type}
                                onChange={handleChange}>
                                <option value="">Tipo de Espacio</option>
                                <option value="Cuenta Ahorros">Cuenta Ahorros</option>
                                <option value="Cuenta Corriente">Cuenta Corriente</option>
                                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={editAccount} >
                                Agregar
                            </button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}