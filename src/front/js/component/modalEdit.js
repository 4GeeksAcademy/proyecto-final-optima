import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Swal from 'sweetalert2'
import "../../styles/modal.css";

export const ModalEdit = (props) => {
    const { store } = useContext(Context)
    const [cardId, setCardId] = useState(props.cardId)
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
            console.log(cardId)
            const response = await fetch(`${process.env.BACKEND_URL}/api/accounts/${cardId}`, requestOptions);
            const result = await response.json();
            console.log(result);
            console.log(props.cardId);
            console.log(cardId);


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
                    console.log(data);

                } catch (error) {
                    console.error(error);
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Campos incompletos, asegúrate de escribir toda la información',
                    icon: 'error',
                    confirmButtonText: 'Volver'
                })
            }
        } catch (error) {
            console.error(error);
        };
    }
    const editAccount = () => {
        if (inputValue.name.length != 0 && inputValue.type != "") {
            console.log(inputValue);
            putAccount(inputValue)
            setInputValue({
                name: "",
                balance: "",
                coin: "",
                type: ""
            });
            Swal.fire({
                title: "Movimiento registrado con éxito",
                icon: "success"
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Campos incompletos, asegúrate de escribir toda la información',
                icon: 'error',
                confirmButtonText: 'Volver'
            })
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value });
        console.log(e.target.value);
        
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
useEffect(() => {
    console.log("ModalEdit actualizado, cardId:", props.cardId);
    console.log(cardId);
}, [props.cardId]);
    return (
        <>
            <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bi bi-pencil-square"></i></button>
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Editar Espacio
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex gap-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                value={inputValue.name}
                                aria-label="Nombre"
                                name="name"
                                required
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                className="form-control w-25"
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
                                className="form-select mr-5 "
                                aria-label="Default select example"
                                name="coin"
                                required
                                value={inputValue.coin}
                                onChange={handleChange}
                            >
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
                                className="form-select mr-5 "
                                aria-label="Default select example"
                                name="type"
                                required
                                value={inputValue.type}
                                onChange={handleChange}
                            >
                                <option value="">Tipo de Espacio</option>
                                <option value="Cuenta Ahorros">Cuenta Ahorros</option>
                                <option value="Cuenta Corriente">Cuenta Corriente</option>
                                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={editAccount}>
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