import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

export const Currency = () => {
    const { store, actions } = useContext(Context);

    const uniqueCoins = [...new Set(store.accounts.map((i) => i.coin))];

    const [currency, setCurrency] = useState(uniqueCoins[0] || "EUR");

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
}, [currency]);

return (
    <div className="modal-body d-flex flex-column gap-3 px-4">
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
);
};