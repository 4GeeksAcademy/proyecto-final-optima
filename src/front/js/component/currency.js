import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

export const Currency = () => {
    const { store, actions } = useContext(Context);

    const uniqueCoins = [...new Set(store.accounts.map((i) => i.coin))];

    const [currency, setCurrency] = useState(uniqueCoins[0] || "EUR");

    // async function getExchangeRate(coin) {
    //     const requestOptions = {
    //         method: "GET",
    //         redirect: "follow"
    //     };
    //     try {
    //         const response = await fetch(`https://api.appnexus.com/currency?code=${coin}&show_rate=true`, requestOptions);
    //         const result = await response.json();
    //         console.log("Tasa de cambio:", result);
    //     } catch (error) {
    //         console.error("Error obteniendo tasa de cambio:", error);
    //     }
    // };
    async function getExchangeRate(coin) {

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        try {
            const response = await fetch(`https://api.appnexus.com/currency?code=${coin}&show_rate=true`, requestOptions);
            const result = await response.json();
            console.log(result)
        } catch (error) {
            console.error(error);
        }
    };
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