import React, { useContext } from "react";
import "../../styles/filter.css";
import { Context } from "../store/appContext";

export const Filter = () => {
	const { store, actions } = useContext(Context);

	const handleFilterClick = (category) => {
		actions.setSelectedCategory(category);
	};

	return (
		<div className="dropdown">
			<button className="btn btn-secondary dropdown-toggle btn-modal" type="button" data-bs-toggle="dropdown" aria-expanded="false">
				<i className="bi bi-funnel "></i>
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
						<a className="dropdown-item" href="#" onClick={() => handleFilterClick(category)}>
							{category}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};
