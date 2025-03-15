import React from "react";
import "../../styles/emptyComponet.css";
import billetera from "../../img/billetera.png";
import { useLocation } from "react-router-dom";


export const EmptyComponet = () => {
  const path = useLocation()
  return (
    <div className="no-accounts-container">
      <img
        src={billetera}
        alt="Wallet vacío"
        className="no-accounts-image"
      />
      {path.pathname === "/cuentas" ? <>
        <h2>No hay espacios creados</h2>
        <p>
          Por favor, añade un espacio para comenzar a explorar las ventajas de{" "}
          <strong>OPTIMA</strong>.
        </p> </> : <> <h2>Asegurate de tener un espacio creado</h2> <p>Si ya lo tienes espera a que terminemos de cargar tus movimiento.</p> </>}
    </div>
  );
}