import React, { useContext, useEffect, useState } from "react";
import { Sidebar } from "../component/sidebar";
import { Card } from "../component/card";
import { GeneralBalance } from "../component/balanceGeneral";
import "../../styles/container.css";
import { Context } from "../store/appContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Modal } from "../component/modal";
import { ModalDetails } from "../component/modalDetails";

export const PrincipalPage = () => {
    const { store, actions } = useContext(Context)
    const totalBalance = store.userAccounts.reduce((acc, item) => acc + item.balance, 0);
    const path = useLocation()
    let navigate = useNavigate();

    useEffect(() => {
        actions.verifyToken();
        actions.initializeStore();
        if (!store.auth) {
            navigate("/");
        }
    }, []);

    if (!store.auth) {
        actions.logout()
        navigate("/");
    }

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <h2>Balance general</h2>
                    <div className="scrollmenu">
                        <GeneralBalance balance={totalBalance} />
                    </div>
                    <div className="scrollmenu">
                        {store.userAccounts.map((item) => {
                            return (
                                <Card id={item.id} name={item.name} balance={item.balance} coin={item.coin} type={item.type} />
                            )
                        })}
                    </div>
                </div>
                {path.pathname === "/cuentas" ? <Modal /> : <ModalDetails />}
            </div>
        </div>
    );
}