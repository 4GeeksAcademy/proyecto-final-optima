import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Swal from 'sweetalert2'
import "../../styles/modal.css";
import TextField from '@material-ui/core/TextField';
import { useLocation, useParams } from "react-router-dom";

export const ModalDetails = () => {
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [accountName, setAccountName] = useState("")
    const [accountId, setAccountId] = useState("")
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const { store, actions } = useContext(Context)
    const [balanceType, setBalanceType] = useState("egreso");
    const path = useLocation()
    const params = useParams()

    const handleBalanceChange = (type) => {
        setBalanceType(type);
    };

    const [inputValue, setInputValue] = useState({
        detail: "",
        amount: "",
        type: "",
        date: "",
        time: "",
        account: "",
        accountId: "",
        operation: balanceType
    });

    async function createAccount(body) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "detail": body.detail,
            "amount": body.amount,
            "coin": body.coin,
            "type": body.type,
            "date": body.date,
            "time": body.time,
            "operation": body.operation
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/new-account-detail/${body.accountId}`, requestOptions);
            const result = await response.json();
            console.log(result);
            
            if (response.status === 200) {
                if (balanceType === "egreso") {
                    actions.debit(parseInt(result.amount), body.accountId)
                } else if ((balanceType === "ingreso")) {
                    actions.deposit(parseInt(result.amount), body.accountId)
                }
                if (path.pathname === "/movimientos") {
                    localStorage.removeItem("userAccounts")
                    await actions.getDetailsUser()
                    await actions.getAccountsUser()
                } else{
                    localStorage.removeItem("userAccounts")
                    await actions.getAccountsDetail(body.accountId)
                    await actions.getAccountsUser()

                }
            }
        } catch (error) {
            console.error(error);
        };

    }
    const addAccountDetail = () => {
        if (inputValue.detail.length != 0 && inputValue.type != "" && inputValue.amount != 0) {
            createAccount(inputValue)
            setInputValue({
                detail: "",
                amount: "",
                coin: "",
                type: "",
                date: currentDate,
                time: currentTime,
                account: "",
                accountId: "",
                operation: balanceType
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
                confirmButtonText: 'Volver',
                confirmButtonColor: "#010D87"
            })
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value });
        if (name === "date") setCurrentDate(value);
        if (name === "time") setCurrentTime(value);
        if (name === "account") {
            const accountIdFilter = store.accounts.find((account) => account.name === value);
            setSelectedCurrency(accountIdFilter.coin)
            if (accountIdFilter) {
                setInputValue((prev) => ({
                    ...prev,
                    accountId: accountIdFilter.id,
                    operation: balanceType, coin: accountIdFilter.coin
                }));
            }
        } else if (path.pathname != "/movimientos") {
            setInputValue((prev) => ({
                ...prev, accountId: accountId, operation: balanceType, coin: selectedCurrency
            }));
        }
    };
    const handleClick = () => {
        setInputValue({
            detail: "",
            amount: "",
            type: "",
            date: currentDate,
            time: currentTime,
            account: "",
            accountId: "",
            operation: balanceType
        })
        if (path.pathname != "/movimientos") {
            const account = store.accounts.find((acc) => acc.id == params.id);
            if (account) {
                setAccountName(account.name);
                setAccountId(account.id);
                setSelectedCurrency(account.coin)
            }
        }
    }
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
            <button type="button" className="add-item btn btn-secondary btn-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleClick}>
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
                        <div className="toggle-container mt-2">
                            <input
                                type="radio"
                                id="btnradio1"
                                name="btnradio"
                                checked={balanceType === "egreso" || false}
                                onChange={() => handleBalanceChange("egreso")}
                                className="hidden"
                            />
                            <label htmlFor="btnradio1" className={`toggle-option ${balanceType === "egreso" ? "active" : ""}`}>
                                Egreso
                            </label>

                            <input
                                type="radio"
                                id="btnradio2"
                                name="btnradio"
                                checked={balanceType === "ingreso" || false}
                                onChange={() => handleBalanceChange("ingreso")}
                                className="hidden"
                            />
                            <label htmlFor="btnradio2" className={`toggle-option ${balanceType === "ingreso" ? "active" : ""}`}>
                                Ingreso
                            </label>
                        </div>
                        {path.pathname === "/movimientos" ?
                            <div className="modal-body d-flex flex-column gap-3 px-4">
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    name="account"
                                    required
                                    value={inputValue.account}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona una cuenta</option>
                                    {store.accounts.map((i) => {
                                        return (
                                            <option key={i.id} value={i.name}>{i.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            : <div className="modal-body d-flex flex-column gap-3 px-4">
                                <input
                                    className="form-input"
                                    aria-label="Default select example"
                                    name="account"
                                    required
                                    value={accountName}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        }
                        {balanceType === "egreso" ?
                            <>
                                <div className="modal-body d-flex flex-column gap-3 px-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Detalle"
                                        value={inputValue.detail}
                                        aria-label="Detalle"
                                        name="detail"
                                        required
                                        onChange={handleChange}
                                    />

                                    <div className="d-flex gap-3">
                                        <input
                                            type="number"
                                            className="form-control flex-grow-1 input-balance"
                                            placeholder="Monto"
                                            value={inputValue.amount}
                                            aria-label="Amount"
                                            name="amount"
                                            required
                                            onChange={handleChange}
                                        />
                                        <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            name="coin"
                                            required
                                            value={selectedCurrency} disabled
                                            onChange={handleChange}
                                            style={{ width: "30%" }}
                                        >
                                            <option value="">{selectedCurrency || "Moneda"}</option>
                                        </select>
                                    </div>

                                    <select
                                        className="form-select"
                                        aria-label="Default select example"
                                        name="type"
                                        required
                                        value={inputValue.type}
                                        onChange={handleChange}
                                    >
                                        <option value="">Tipo de Gasto</option>
                                        <option value="gastos hormiga">Gastos Hormiga</option>
                                        <option value="servicios">Servicios</option>
                                        <option value="alquiler">Alquiler</option>
                                        <option value="transporte">Transporte</option>
                                        <option value="ocio">Ocio</option>
                                        <option value="ropa y complementos">Ropa y Complementos</option>
                                        <option value="alimentacion">Alimentación</option>
                                        <option value="mascota">Mascota</option>
                                        <option value="otros">Otros</option>
                                    </select>

                                    <form className="d-flex gap-3" noValidate>
                                        <TextField
                                            id="date"
                                            name="date"
                                            label="Fecha"
                                            type="date"
                                            value={currentDate}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                            className="flex-grow-1"
                                        />
                                        <TextField
                                            id="time"
                                            name="time"
                                            label="Hora"
                                            type="time"
                                            value={currentTime}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                            className="flex-grow-1"
                                        />
                                    </form>
                                </div>
                            </>
                            :
                            <>
                                <div className="modal-body d-flex flex-column gap-3 px-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Detalle"
                                        value={inputValue.detail}
                                        name="detail"
                                        required
                                        onChange={handleChange}
                                    />

                                    <div className="d-flex gap-3">
                                        <input
                                            type="number"
                                            className="form-control flex-grow-1 input-balance"
                                            placeholder="Monto"
                                            value={inputValue.amount}
                                            aria-label="Amount"
                                            name="amount"
                                            required
                                            onChange={handleChange}
                                        />
                                        <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            name="coin"
                                            required
                                            value={selectedCurrency} disabled
                                            onChange={handleChange}
                                            style={{ width: "30%" }}
                                        >
                                            <option value="">{selectedCurrency || "Moneda"}</option>
                                        </select>
                                    </div>

                                    <select
                                        className="form-select"
                                        aria-label="Default select example"
                                        name="type"
                                        required
                                        value={inputValue.type}
                                        onChange={handleChange}
                                    >
                                        <option value="">Tipo de Ingreso</option>
                                        <option value="sueldos y salarios">Sueldos y Salarios</option>
                                        <option value="inversiones">Inversiones</option>
                                        <option value="transferencia">Transferencia</option>
                                        <option value="otros">Otros</option>
                                    </select>

                                    <form className="d-flex gap-3" noValidate>
                                        <TextField
                                            id="date"
                                            name="date"
                                            label="Fecha"
                                            type="date"
                                            value={currentDate}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                            className="flex-grow-1"
                                        />
                                        <TextField
                                            id="time"
                                            name="time"
                                            label="Hora"
                                            type="time"
                                            value={currentTime}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                            className="flex-grow-1"
                                        />
                                    </form>
                                </div>
                            </>}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addAccountDetail}>
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