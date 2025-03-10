import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

export const Currency = () => {
    const { store, actions } = useContext(Context)
    const [currency, setCurrency] = useState("")

    useEffect(()=>{
        
    },[])
    return (
        <div className="modal-body d-flex flex-column gap-3 px-4">
            <select
                className="form-select"
                aria-label="Default select example"
                name="account"
                required
                value=""
            // onChange={handleChange}
            >
                <option value="EUR">EUR</option>
                {store.userAccounts.map((i) => {
                    return (
                        <option value={i.coin}>{i.coin}</option>
                    )
                })}
            </select>
        </div>
    );
}