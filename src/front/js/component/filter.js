import React from "react";
import "../../styles/filter.css";

export const Filter = () => {
	return (
		<div className="dropdown">
			<button className="btn btn-secondary dropdown-toggle btn-modal" type="button" data-bs-toggle="dropdown" aria-expanded="false">
				<i className="bi bi-funnel "></i>
			</button>
			<ul className="dropdown-menu">
				<li>
					<a className="dropdown-item" href="#">
						MOSTRAR TODO
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Gastos Hormiga
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Servicios
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Alquiler
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Transporte
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Ocio
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Ropa y Complementos
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Mascota
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Alimentación
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Otros
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Sueldos y salarios
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Inversiones
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Transferencia
					</a>
				</li>
				<li>
					<a className="dropdown-item" href="#">
						Otros
					</a>
				</li>
			</ul>
		</div>
	);
}