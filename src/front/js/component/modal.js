import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Swal from 'sweetalert2'
import "../../styles/modal.css";

export const Modal = () => {
	const { store, actions } = useContext(Context)
	const [currentDate, setCurrentDate] = useState("");
	const [currentTime, setCurrentTime] = useState("");
	const [inputValue, setInputValue] = useState({
		name: "",
		balance: "",
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
			const result = await response.json();
			if (response.status === 200) {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				const raw = JSON.stringify({
					"detail": "PRIMER INGRESO",
					"amount": result.balance,
					"coin": result.coin,
					"type": "Saldo inicial",
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
						actions.getAccountsUser();
						actions.getDetailsUser()
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
					customClass: {
						confirmButton: "swal-confirm-btn"
					}
				})
			}
		} catch (error) {
			console.error(error);
		};
	}
	const addAccount = () => {
		if (inputValue.name.length != 0 && inputValue.type != "") {
			createAccount(inputValue)
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
				confirmButtonText: 'Volver',
				confirmButtonColor: "#010D87"
			})
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
			<button type="button" className="add-item btn btn-secondary btn-modal" data-bs-toggle="modal" data-bs-target="#createModal">
				<i className="bi bi-plus-lg"></i>
			</button>
			<div className="modal fade" id="createModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalLabel">
								Crear Nuevo Espacio
							</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addAccount}>
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
	);
}