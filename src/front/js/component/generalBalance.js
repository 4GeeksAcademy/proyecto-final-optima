import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import "../../styles/general-balance.css";

export const GeneralBalance = () => {
  const path = useLocation();
  const params = useParams();
  const { store } = useContext(Context);
  const [showBalance, setShowBalance] = useState(true);
  const [currency, setCurrency] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState({ EUR: 1 });
  const [accountBalance, setAccountBalance] = useState(0);
  const [coin, setCoin] = useState("");

  async function getExchangeRates(baseCurrency = "EUR") {
    try {
      const response = await fetch(
        `https://api.currencyapi.com/v3/latest?apikey=cur_live_SoRvnM1p18PwNQdUYppAQX8SqMPxeYZMsYWDDIDe&base_currency=${baseCurrency}`
      );
      const data = await response.json();

      if (data && data.data) {
        const rates = Object.fromEntries(
          Object.entries(data.data).map(([currency, info]) => [currency, info.value])
        );
        setExchangeRates({ ...rates, EUR: 1 });
      }
    } catch (error) {
      console.error("Error obteniendo tasas de cambio:", error);
    }
  }

  const totalBalance = useMemo(() => {
    const balance = store.accounts.reduce((acc, item) => {
      const rateToEUR = item.coin === "EUR" ? 1 : 1 / (exchangeRates[item.coin] || 1);
      const rateFromEUR = currency === "EUR" ? 1 : exchangeRates[currency] || 1;
      return acc + item.balance * rateToEUR * rateFromEUR;
    }, 0);

    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance);
  }, [store.accounts, exchangeRates, currency]);

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  useEffect(() => {
    if (path.pathname.startsWith("/cuentas/")) {
      const account = store.accounts.find((acc) => acc.id == params.id);
      if (account) {
        setAccountBalance(Number(account.balance))
        setCoin(account.coin);
        setCurrency(account.coin);
        getExchangeRates(account.coin);
      }
    } else {
      setCurrency("EUR");
      getExchangeRates("EUR");
    }
  }, [path.pathname, store.accounts]);

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div className="balance-box d-flex align-items-center justify-content-between p-3 shadow rounded">
      <h2 className="m-0">Balance general</h2>
      <div className="d-flex align-items-center">
        {path.pathname.startsWith("/cuentas/") ? (
          <h4 className="m-0 fw-bold me-3">
            {showBalance
              ? new Intl.NumberFormat("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(accountBalance)
              : "****"}
          </h4>
        ) : (
          <h4 className="m-0 fw-bold me-3">{showBalance ? totalBalance : "****"}</h4>
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
            {path.pathname.startsWith("/cuentas/") ? (
              <>
                {coin && <option key={coin} value={coin}>{coin}</option>}
                {Object.keys(exchangeRates)
                  .filter((currencyCode) => currencyCode !== coin)
                  .map((currencyCode) => (
                    <option key={currencyCode} value={currencyCode}>
                      {currencyCode}
                    </option>
                  ))}
              </>
            ) : (
              Object.keys(exchangeRates).map((currencyCode) => (
                <option key={currencyCode} value={currencyCode}>
                  {currencyCode}
                </option>
              ))
            )}
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