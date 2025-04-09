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

  async function getExchangeRates(baseCurrency = "EUR") {
    try {
      const response = await fetch(
        `https://api.currencyapi.com/v3/latest?apikey=cur_live_UGFJrhpZsUWSixKQP4o4x1hGJjbz34egWS2dihK4&base_currency=${baseCurrency}`
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

  useEffect(() => {
    if (path.pathname.startsWith("/cuentas/")) {
      const account = store.accounts.find((acc) => acc.id == params.id);
      if (account) {
        setCurrency(account.coin);
        getExchangeRates(account.coin);
      }
    } else {
      setCurrency("EUR");
      getExchangeRates("EUR");
    }
  }, [path.pathname, store.accounts, params.id, store.detailAccounts, store.detailUser]);

  const totalBalance = useMemo(() => {
    if (path.pathname.startsWith("/cuentas/")) {
      const account = store.accounts.find((acc) => acc.id == params.id);
      if (!account) return "0.00";
      
      const rateFromEUR = currency === "EUR" ? 1 : exchangeRates[currency] || 1;
      const rateToEUR = account.coin === "EUR" ? 1 : 1 / (exchangeRates[account.coin] || 1);
      const balance = account.balance * rateToEUR * rateFromEUR;

      return new Intl.NumberFormat("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(balance);
    } else {
      const balance = store.accounts.reduce((acc, item) => {
        const rateToEUR = item.coin === "EUR" ? 1 : 1 / (exchangeRates[item.coin] || 1);
        const rateFromEUR = currency === "EUR" ? 1 : exchangeRates[currency] || 1;
        return acc + item.balance * rateToEUR * rateFromEUR;
      }, 0);

      return new Intl.NumberFormat("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(balance);
    }
  }, [store.accounts, exchangeRates, currency, path.pathname, params.id, store.detailAccounts, store.detailUser]);

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div className="balance-box d-flex align-items-center justify-content-between p-3 shadow rounded">
      <h2 className="balance-title m-0">Balance general</h2>
      <div className="d-flex align-items-center">
        <h4 className="total-balance m-0 fw-bold me-3">{showBalance ? totalBalance : "****"}</h4>
        <i
        className={`eye-hide ${showBalance ? "bi-eye-fill" : "bi-eye-slash-fill"} fs-4 cursor-pointer`}
        onClick={toggleBalance}
      ></i>
        <div className="currency-size ms-2">
          <select
            className="form-select"
            aria-label="Seleccionar moneda"
            name="account"
            required
            value={currency}
            onChange={handleChange}
          >
            {Object.keys(exchangeRates).map((currencyCode) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyCode}
              </option>
            ))}
          </select>
        </div>
      </div>
      
    </div>
  );
};
