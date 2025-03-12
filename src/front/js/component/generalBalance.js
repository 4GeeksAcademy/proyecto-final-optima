import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import "../../styles/general-balance.css";

export const GeneralBalance = () => {
  const path = useLocation();
  const params = useParams();
  const [showBalance, setShowBalance] = useState(true);
  const { store } = useContext(Context);
  const uniqueCoins = [...new Set(store.accounts.map((i) => i.coin))];
  const [currency, setCurrency] = useState(uniqueCoins[0] || "EUR");
  const [exchangeRates, setExchangeRates] = useState({ EUR: 1 });
  const [accountBalance, setAccountBalance] = useState("");

  async function getExchangeRates() {
    try {
      const response = await fetch(
        "https://api.currencyapi.com/v3/latest?apikey=cur_live_SoRvnM1p18PwNQdUYppAQX8SqMPxeYZMsYWDDIDe&base_currency=EUR"
      );
      const data = await response.json();
      
      if (data && data.data) {
        const rates = Object.fromEntries(
          Object.entries(data.data).map(([currency, info]) => [currency, info.value])
        );
        setExchangeRates({ ...rates, EUR: 1 }); // Asegurar que EUR siempre sea 1
      }
    } catch (error) {
      console.error("Error obteniendo tasas de cambio:", error);
    }
  }

  useEffect(() => {
    getExchangeRates();
  }, []);

  const totalBalance = useMemo(() => {
    return store.accounts
      .reduce((acc, item) => {
        const rateToEUR = item.coin === "EUR" ? 1 : 1 / (exchangeRates[item.coin] || 1); // Convertir a EUR
        const rateFromEUR = currency === "EUR" ? 1 : exchangeRates[currency] || 1; // Convertir de EUR a la moneda seleccionada
        return acc + item.balance * rateToEUR * rateFromEUR;
      }, 0)
      .toFixed(2);
  }, [store.accounts, exchangeRates, currency]);

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  useEffect(() => {
    if (path.pathname !== "/cuentas" && path.pathname !== "/movimientos") {
      const account = store.accounts.find((acc) => acc.id == params.id);
      if (account) {
        setAccountBalance(account.balance);
      }
    }
  }, [store.accounts]);

  return (
    <div className="balance-box d-flex align-items-center justify-content-between p-3 shadow rounded">
      <h2 className="m-0">Balance general</h2>
      <div className="d-flex align-items-center">
        {path.pathname.startsWith("/cuentas/") ? (
          <h4 className="m-0 fw-bold me-3">
            {showBalance ? accountBalance : "****"} {currency}
          </h4>
        ) : (
          <h4 className="m-0 fw-bold me-3">
            {showBalance ? totalBalance : "****"} {currency}
          </h4>
        )}
        <div className="currency-size ms-2">
          <select
            className="form-select"
            aria-label="Seleccionar moneda"
            name="account"
            required
            value={currency}
            onChange={handleChange}
          >
            {Object.keys(exchangeRates).map((coin) => (
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