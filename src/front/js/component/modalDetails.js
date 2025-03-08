import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

import "../../styles/modal.css";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({

    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

export const ModalDetails = () => {
    const [currentDateTime, setCurrentDateTime] = useState("");
    const { store, actions } = useContext(Context)
    const [showBalance, setShowBalance] = useState(true)
    const classes = useStyles();

    const toggleBalance = () => {
        console.log("prueba en consola");

        let toggle = !showBalance
        setShowBalance(toggle);
    }

    const [inputValue, setInputValue] = useState({
        name: "",
        balance: 0,
        coin: "",
        type: ""
    });
    async function createAccount(body) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "name": body.name,
            "balance": body.balance,
            "coin": body.coin,
            "type": body.type
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/${store.user.id}/new-account`, requestOptions);
            const result = await response.text();
        } catch (error) {
            console.error(error);
        };

    }
    const addItem = () => {
        if (inputValue.name.length != 0 && inputValue.type != "") {
            createAccount(inputValue)
            setInputValue({
                name: "",
                balance: 0,
                coin: "",
                type: ""
            });
            alert("Se ingresó todo correctamente")
        } else {
            alert(
                "------------------------INFORMACIÓN INCOMPLETA-------------------- RECUERDA ESCRIBIR UN NOMBRE, ESCOGER UN TIPO E INTRODUCIR UNA CANTIDAD DE MAXIMO 10 UNIDADES"
            );
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value });
    };
    useEffect(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Ajusta la zona horaria
        const formattedDateTime = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
        setCurrentDateTime(formattedDateTime);
    }, []);
    return (
        <>
            <button type="button" className="add-item btn btn-secondary btn-modal" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i className="bi bi-plus-lg"></i>
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Añadir Movimiento
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked />
                            <label className="btn btn-outline-primary" htmlFor="btnradio1" onClick={toggleBalance}>Egreso</label>
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autocomplete="off" />
                            <label className="btn btn-outline-primary" htmlFor="btnradio2" onClick={toggleBalance}>Ingreso</label>
                        </div>
                        {showBalance ?
                            <>
                                <div className="modal-body d-flex gap-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Detalle"
                                        value={inputValue.name}
                                        aria-label="Detalle"
                                        name="detail"
                                        required
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="text"
                                        className="form-control w-25"
                                        placeholder="Monto"
                                        value={inputValue.balance}
                                        aria-label="Amount"
                                        name="amount"
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
                                        onChange={handleChange}>
                                        <option value="">Moneda</option>
                                        <option value="EUR">EUR</option>
                                        <option value="USD">USD</option>
                                        <option value="COP">COP</option>
                                        <option value="PER">PER</option>
                                    </select>
                                </div>
                                <div className="px-5 pb-3">
                                    <select
                                        className="form-select mr-5 "
                                        aria-label="Default select example"
                                        name="type"
                                        required
                                        value={inputValue.type}
                                        onChange={handleChange}>
                                        <option value="">Tipo de Gasto</option>
                                        <option value="gastos hormiga">Gastos Horgima</option>
                                        <option value="servicios">Servicios</option>
                                        <option value="alquiler">Alquiler</option>
                                        <option value="transporte">Transporte</option>
                                        <option value="ocio">Ocio</option>
                                        <option value="ropa y complementos">Ropa y Complementos</option>
                                        <option value="alimentacion">Alimentación</option>
                                        <option value="mascota">Mascota</option>
                                        <option value="otros">Otros</option>
                                    </select>
                                </div>
                            </>
                            :
                            <>
                                <div className="modal-body d-flex gap-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Detalle"
                                        value={inputValue.name}
                                        aria-label="Detalle"
                                        name="detail"
                                        required
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="text"
                                        className="form-control w-25"
                                        placeholder="Monto"
                                        value={inputValue.balance}
                                        aria-label="Amount"
                                        name="amount"
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
                                        onChange={handleChange}>
                                        <option value="">Moneda</option>
                                        <option value="EUR">EUR</option>
                                        <option value="USD">USD</option>
                                        <option value="COP">COP</option>
                                        <option value="PER">PER</option>
                                    </select>
                                </div>
                                <div className="px-5 pb-3">
                                    <select
                                        className="form-select mr-5 "
                                        aria-label="Default select example"
                                        name="type"
                                        required
                                        value={inputValue.type}
                                        onChange={handleChange}>
                                        <option value="">Tipo de Ingreso</option>
                                        <option value="sueldos y salarios">Sueldos y Salarios</option>
                                        <option value="inversiones">Inversiones</option>
                                        <option value="transferencia">Transferencia</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                </div>
                                <div className="px-5 pb-3">
                                    <form className={classes.container} noValidate>
                                        <TextField
                                            id="datetime-local"
                                            label="Next appointment"
                                            type="datetime-local"
                                            value={currentDateTime} // Se establece la fecha y hora actual
                                            onChange={(e) => setCurrentDateTime(e.target.value)} // Permite edición
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </form>
                                </div>
                            </>}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addItem}>
                                Agregar
                            </button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}