import React, { useContext, useEffect, useState } from "react";
import { Sidebar } from "../component/sidebar";
import { Card } from "../component/card";
import { GeneralBalance } from "../component/balanceGeneral";
import "../../styles/container.css";
import { Context } from "../store/appContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Modal } from "../component/modal";
import { ModalDetails } from "../component/modalDetails";
import { CardMovimientos } from "../component/cardMovimiento";

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
                        {path.pathname === "/cuentas" ? (
                            store.userAccounts.length > 0 ? (
                                store.userAccounts.map((item) => (
                                    <Card key={item.id} id={item.id} name={item.name} balance={item.balance} coin={item.coin} type={item.type}  />
                                ))
                            ) : (
                                <p>No hay cuentas disponibles.</p>
                            )
                        ) : (
                            store.detailAccounts.length > 0 ? (
                                store.detailAccounts.map((details) => (
                                    <CardMovimientos key={details.id} amount={details.amount} coin={details.coin} date={details.date} time={details.time} detail={details.detail} type={details.type} operation={details.operation} id={details.id} />
                                ))
                            ) : (
                                <p>No hay cuentas disponibles.</p>
                            )
                        )}
                    </div>

                </div>
                {path.pathname === "/cuentas" ? <Modal /> : <ModalDetails />}
            </div>
        </div>
    );
}