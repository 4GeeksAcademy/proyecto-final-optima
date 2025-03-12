import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import "../../styles/general-balance.css";

export const GeneralBalance = () => {
  const path = useLocation();
  const params = useParams()
  const [showBalance, setShowBalance] = useState(true);
  const { store, actions } = useContext(Context);
  const uniqueCoins = [...new Set(store.accounts.map((i) => i.coin))];
  const [currency, setCurrency] = useState(uniqueCoins[0] || "EUR");
  const [accountBalance, setAccountBalance] = useState("")

  const totalBalance = useMemo(() => {
    return store.accounts.reduce((acc, item) => acc + item.balance, 0).toFixed(2);
  }, [store.accounts]);

  const toggleBalance = () => {
    setShowBalance(prev => !prev);
  };


  async function getExchangeRate(coin) {

    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch(`https://exchange-rates.abstractapi.com/v1/convert?api_key=5831c21c88c145ecbef4a7cc0f2a4142&base=EUR&target=${coin}`, requestOptions);
      const result = await response.json();
      console.log("Tasa de cambio:", result);
      console.log("Tasa de cambio:", result.exchange_rate);
    } catch (error) {
      console.error("Error obteniendo tasa de cambio:", error);
    }
  }
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  useEffect(() => {
    if (currency) {
      getExchangeRate(currency);
    }
    if (path.pathname != "/cuentas" || path.pathname != "/movimientos") {
      const account = store.accounts.find((acc) => acc.id == params.id);
      if (account) {
        setAccountBalance(account.balance);
      }
    }
  }, [currency, store.accounts]);
  return (
    <div className="balance-box d-flex align-items-center justify-content-between p-3 shadow rounded">
      <h2 className="m-0">Balance general</h2>

      <div className="d-flex align-items-center">
        {path.pathname.startsWith("/cuentas/") ? <h4 className="m-0 fw-bold me-3">{showBalance ? accountBalance : "****"}</h4>:<h4 className="m-0 fw-bold me-3">{showBalance ? totalBalance : "****"}</h4>}
        <div className="currency-size ms-2">
          <select
            className="form-select"
            aria-label="Seleccionar moneda"
            name="account"
            required
            value={currency}
            onChange={handleChange}
          >
            {uniqueCoins.map((coin) => (
              <option key={coin} value={coin}>{coin}</option>
            ))}
          </select>
        </div>
      </div>
      <i
        className={`bi ${showBalance ? "bi-eye-fill" : "bi-eye-slash-fill"} fs-4 cursor-pointer`}
        onClick={toggleBalance}
      ></i>
    </div>
  );
};