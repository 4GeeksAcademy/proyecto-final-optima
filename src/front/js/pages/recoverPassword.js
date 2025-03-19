import React, { useState } from "react";
import "../../styles/recover-password.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate()

  async function recoverPassword(email) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8Cs4yarcs6pKkdu0hlKHsZvAAapSK3aJABBalR-Lci0TLJ4mPdx6AC75WL9aJ3g0XWyc_xYUK9tdHAWC3yjLKugRK09aqJhyN6uSnMdoOkMVa6GYF6MHRm3FpqR_SBsMcoNaFYdP0ccoZAwp1fxVLLgtI1XiTipNcoznGMS9tDy5Ixbj5r2h3qhzR40-3zV-Hm933q7uG9iaeBRsSWtJf6Wp7lARAOoq6rKGYLOavgkO1EhBzC_HA2-kr3tyjaQ_BXbILwO0HVqfjTci3AlYda-CLyv7RC-j2xIkvnUzNFLOOJ5-VEmaaMUgFwKIcU4Q7im8F_E6hV-cI65oa59nY6nTjgSkWVQFWzU-cIQgQ51YBFAizdwlidWqJ9-ZHfk0FAp7RmsIlnbqmUSH5TN_d9TVQfsObgp3dqu-QhD8zA2goZw111fcpZG3M1fbuKxM25PwzBRw2E6nLo13gugCfvCVPvKVu84CAl7ax-WPuEp2gjk_zT52pLHtStlgbeic1U0opxpXPockj3bTOCatQq7KRl_K4NJmm4o0Y83AJDSjXtcndj1Qr-9-BbSZFJOhaxEBEXAfm21buz_t78KIuiyLVVwpZua09YFk1zb-YVK9PtaUSFKCY3ktGi6vPhUWouYPGReGrWemxGRVcXpwPw_dbfmtd2Ugcw2zWpkBhXiNeUF7x6GclfXhFbY46uwcLamUTB5IdaBw15NLmZvoHJgASLkek69zF6KxnnJJm9RHohb7mYPF95LmYLKmdyiSmH3SrRLaX0bY_dtN68aR_zKIOUb_nwT08hA2ACaw8HXxp5DvtAGxTBdguyW7RFiqiNoM82Uz732XWlrByd5l7uwHrqNlrxp4lniqDNZQmgLdwhxW1aTzUX0t00RememwcdwF1d7flRm3bhitupmnU_IPaUNZQat5GeZItk-X1SYb-PLSzmbo5VEzrNXiDLXcM5V9UqEC6R6udi_oTVUPduALx5dO2dWEJk8Xo7tVKURo");

    const raw = JSON.stringify({
      "email": email
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/recover-password`, requestOptions);
      const result = await response.json();
      if (response.status === 404 || response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Correo no existe",
          text: "Por favor escribe correctamente el correo electrónico",
          confirmButtonColor: "#010D87",
        });
      } else if (response.status === 200) {
        Swal.fire({
          title: "Correo enviado",
          text: "La nueva contraseña se ha enviado a tu correo electrónico, por favor revisa tu bandeja de entrada",
          icon: "success",
          draggable: true,
          confirmButtonColor: "#010D87",
          confirmButtonText: "Volver al inicio",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });

      }
    } catch (error) {
      console.error(error);
    };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    recoverPassword(email)
    setEmail("")
  };

  return (
    <div className="recover-container">
      <h1 className="app-title">OPTIMA</h1>
      <div className="recover-box">
        <h2 className="recover-title">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit} className="recover-form">
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="recover-input"
            required
          />
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-secondary"
          >
            Volver Atrás
          </button>
        </form>
      </div>
    </div>
  );
};
