import React from "react";
import "../../styles/emptyComponet.css";
import billetera from "../../img/billetera.png";


export const EmptyComponet = () =>{
    return (
        <div className="no-accounts-container">
          <img
            src={billetera}
            alt="Wallet vacío"
            className="no-accounts-image"
          />
          <h2>No hay cuentas creadas</h2>
          <p>
            Por favor, añade una cuenta para comenzar a explorar las ventajas de{" "}
            <strong>OPTIMA</strong>.
          </p>
        </div>
      );
}