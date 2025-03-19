import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/filter.css";
import { Context } from "../store/appContext";

export const Filter = () => {
	const { store, actions } = useContext(Context);
	const location = useLocation();
	const [type, setType] = useState("") 

	async function filter(accountId, type) {
		const myHeaders = new Headers();
		myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZv1kjk8FuRQWFfLdthB-p1fwyIm0NeUc9BxX7LGiagCNq82IitNL6sIpzJTk-lhqs0vnecfIy4FmDZD8rceDZ8J9qCh0Q4AwxqGzkDM4WmxS4wIeQTGV7EGulhfijFiGcvzOLGFgvvtzDUogm_8mSWTyWrQmRKXUHV_w-4LtuP7lFLHxcHT3qNWAMUWwUtqbaQnssg18M9Eythn7A4nLrXH0t-xPyA0rsC1-z5lX_hZore8MWZXOJ5STdbqJY7UHP9toXgiYPRH-WnaoLzUoHGvFpa7B9lccnhG1bBV0FD32tduJgTr_S0CMNrC2n7AS5SKGYkskg_Zxw2sN5Huxu5BhlRTz_3S8vF5bGTlhBHbHIqz9XJLjJsBrAu1foVAasU0KcYbuNAGz1GmNgjmThVr2DV33XbyTzeN6is7af5RO9y2dfddcRZzf_mgP0VmxX-r7SNufEq5BdOcbAliTz__iiSwyDmoFR7dkmwefv8hd7WuWiUwr3uQLh_Bi413XumgYoh2iINyB_XDXMkva2Ra5Wy9yEB1xty4feUYnzTuK5cHX18YPt-Rxzq3Ws7aq88Qzxv-MaArxbWFgqephvlXBOHBiJUR31WXFugY_JlWHnCh-3sFC2wRnSiKW0TSM_RDItU2I4oIMH6ASqxIpWSeCxgAi9jchCFXLzUihanQ7JVzP0Ej-g2f2rREKo5J4NpR0LvWBZ-EgcLCY31jOZ97B9C4RRlnY_BEfuiaeVH7GpCWSNdWdedBOVWzJHtTSeRjQq3tOOsZhwIDkpwn9KJa8eNWP0vN9wqXeSN90PgGWtNKQhzr5NDl6k5MWQcjgD5oebmYp2BP5v5WIaHYwWRLj5vCLhtfWXN9dbzkNjHfzcYNh9Qhko6j2qgRcuyugbT7JTsbnT5JS-UPU2uNHvlI6oopX4eEUJ1YEMi-7TUvwDXT-zj1Y-5pFFbCEEd6gB4Y9bBKQSM1SBwVJpOI_0c8");
		
		const requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow"
		};
		
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/api/account-detail/${accountId}/filter?type=${type}`, requestOptions);
			const result = await response.json();
	  console.log(result)
	} catch (error) {
		console.error(error);
	};
}
	
	useEffect(() => {
		if (!store.selectedCategory) {
			actions.setSelectedCategory("MOSTRAR TODO");
		}
	}, [type]);

	const handleFilterClick = (e, category) => {
		e.preventDefault();
		setType(category);
	};

	return (
		<div className="dropdown">
			<button className="btn btn-secondary dropdown-toggle btn-modal" type="button" data-bs-toggle="dropdown" aria-expanded="false">
				<i className="bi bi-funnel"></i>
			</button>
			<ul className="dropdown-menu">
				{[
					"MOSTRAR TODO",
					"Gastos Hormiga",
					"Servicios",
					"Alquiler",
					"Transporte",
					"Ocio",
					"Ropa y Complementos",
					"Mascota",
					"Alimentacion",
					"Otros",
					"Sueldos y salarios",
					"Inversiones",
					"Transferencia"
				].map((category) => (
					<li key={category}>
						<a className="dropdown-item" href="#" onClick={(e) => handleFilterClick(e, category)}>
							{category}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};
