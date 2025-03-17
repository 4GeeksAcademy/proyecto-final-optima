import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Swal from 'sweetalert2'
import "../../styles/modal.css";
import TextField from '@material-ui/core/TextField';
import { useLocation, useParams } from "react-router-dom";

export const ModalEditDetail = (props) => {
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [accountName, setAccountName] = useState("SE RELLENA DE MANERA AUTOMÁTICA")
    const [accountId, setAccountId] = useState("")
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const { store, actions } = useContext(Context)
    const [operationType, setOperationType] = useState("egreso");
    const path = useLocation()
    const params = useParams()
    const [specificAccount, setSpecificAccount] = useState("SE RELLENA DE MANERA AUTOMÁTICA")

    const handleOperationChange = (operation) => {
        setOperationType(operation);
    };

    const [inputValue, setInputValue] = useState({
        detail: "",
        amount: "",
        type: "",
        date: "",
        time: "",
        account: "",
        accountId: "",
        operation: operationType
    });
    const putAccountDetail = async (body) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZsKEREV4kMOBRo-CxzQ6kntelwR0-qb1Egr2gDlYPIUZ0RE_w2u_TxY48lNU-Rqhe7MT4jjdYtY4tulhHFY-V086Yn1yYxcg8B-gUJym1qhW3LTozPej70PbW-JginHqEEU-i-rJkzRnJL6iYwGByN5k4D6Qhj75eRVaEaRPpphQnF4mGfLeGTM7fXhagHj-C6GrTUXDh3RilRIHuoP68ay_zzV3oPaGpRHU4FU3IZi4FqFMQXrehEL_GwdRikomjhOUgNfmMYWgGWTm7wHHn0HDFYBNWmBcHUzlsANo-zDMYFu_CK-7RGSYtUA_j84_MfhKsxTncWmoBIvJB1TvPlV7naCMqtJeArlxSdsdW1VNOaLT925K6VtZqCsyuN_-rZ7hJNEG3h8eps9zujsmy79UJ_oFIKhtdzL9zuPyc94g6euTIQ95UaAjNLZjkUlclkW9xYgkNie-d2ebgpIUfSMmVpix2p3liUKcj9DK0iZkOW4sgjSRSZzMoaJR75caHs8BVIneW-9B_Olzb3_T0GaFnGiBr5mgKuweTvJ8Y7M_H2TBYqfrGrhbX48vUf3wnqoKrA9cI9MrP75Ebipe0_toljBXGdi_cCiYRhB3qubIfC7xnLSwFbOhCqh5xeJznnjgL0nkI1ZM1QTQafROkv9VMR5NMoFLLG8uK6GUZU7uPYBfUosCUzN_KsubjSKFUa_jIMYtO-zd_OLG-neRA7inMhc85IRVACYNtgVfQBuxo2fVhMo4q3wMNQYY6sgm1LHgXX1ykG1R9MjIJsblPV8Pka1NL2pzCeW02RZjUKnM1Msec_SWJofOXqOn8XmU9gWwQJRS1y-qjjW8-4VZeqVkD0bkYiBDPTwLmH9fnb0Vts6cIqowBWgR4sGQfwyEzE1FTMJVCu28W_djxElvCyloiT2HKgB3hgncMeAAzOMkQJe4vYc7JrW1W-oJWa_k3JWncMvt3wUBEWbSxs7cuu1");

        const raw = JSON.stringify({
            "detail": body.detail,
            "amount": parseInt(body.amount),
            "coin": body.coin,
            "type": body.type,
            "date": body.date,
            "time": body.time,
            "operation": body.operation
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/account-detail/${props.cardId}`, requestOptions);
            const result = await response.json();
            if (response.status == 200) {
                if (path.pathname === "/movimientos") {
                    localStorage.removeItem("userAccounts")
                    await actions.getAccountsUser()
                    await actions.getDetailsUser()
                } else {
                    localStorage.removeItem("userAccounts")
                    await actions.getAccountsUser()
                    await actions.getAccountsDetail(body.accountId)
                }
            }
        } catch (error) {
            console.error(error);
        };
    }
    const editAccountDetail = () => {
        if (inputValue.detail.length != 0 && inputValue.type != "" && inputValue.amount != 0) {
            putAccountDetail(inputValue)
            setInputValue({
                detail: "",
                amount: "",
                coin: "",
                type: "",
                date: currentDate,
                time: currentTime,
                account: "",
                accountId: "",
                operation: operationType
            });

            setSpecificAccount("SE RELLENA DE MANERA AUTOMÁTICA")
            setSelectedCurrency("Moneda")
            setAccountName("");
            setAccountId("");
            setSelectedCurrency("")
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
        if (path.pathname === "/movimientos") {
            const account = store.accounts.find((acc) => acc.id == props.accountId.accounts_id)
            setSpecificAccount(account.name)
            setAccountName(account.name);
            setAccountId(account.id);
            setSelectedCurrency(account.coin)
            if (account) {
                setInputValue((prev) => ({
                    ...prev, accountId: accountId, operation: operationType, coin: selectedCurrency, date: currentDate, time: currentTime
                }));
            }
        } else {
            const account = store.accounts.find((acc) => acc.id == params.id);
            if (account) {
                setAccountName(account.name);
                setAccountId(account.id);
                setSelectedCurrency(account.coin)
            }
            setInputValue((prev) => ({
                ...prev, accountId: params.id, operation: operationType, coin: selectedCurrency, date: currentDate, time: currentTime
            }));
        }
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
    }, [store.detailUser]);
    return (
        <>
            <div className="modal fade" id="editModalDetail" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: props.show ? "block" : "none" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editModalDetail">
                                Editar movimiento
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => props.onClose()}></button>
                        </div>
                        <div className="toggle-container mt-2">
                            <input
                                type="radio"
                                id="editbtnradio1"
                                name="btnradio"
                                checked={operationType === "egreso" || false}
                                onChange={() => handleOperationChange("egreso")}
                                className="hidden"
                            />
                            <label htmlFor="editbtnradio1" className={`toggle-option ${operationType === "egreso" ? "active" : ""}`}>
                                Egreso
                            </label>

                            <input
                                type="radio"
                                id="editbtnradio2"
                                name="btnradio"
                                checked={operationType === "ingreso" || false}
                                onChange={() => handleOperationChange("ingreso")}
                                className="hidden"
                            />
                            <label htmlFor="editbtnradio2" className={`toggle-option ${operationType === "ingreso" ? "active" : ""}`}>
                                Ingreso
                            </label>
                        </div>
                        {path.pathname === "/movimientos" ?
                            <div className="modal-body d-flex flex-column gap-3 px-4">
                                <input
                                    className="form-input"
                                    aria-label="Default select example"
                                    name="account"
                                    required
                                    value={specificAccount}
                                    onChange={handleChange}
                                    disabled
                                />
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
                        {operationType === "egreso" ?
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
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={editAccountDetail}>
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