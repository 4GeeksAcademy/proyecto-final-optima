import React, { useContext, useEffect, useState } from "react";
import { Sidebar } from "../component/sidebar";
import { Card } from "../component/card";
import { GeneralBalance } from "../component/balanceGeneral";
import "../../styles/container.css";
import { Context } from "../store/appContext";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { Modal } from "../component/modal";
import { ModalDetails } from "../component/modalDetails";
import { CardMovimientos } from "../component/cardMovimiento";


export const PrincipalPage = () => {
    const { store, actions } = useContext(Context)
    const params = useParams()
    const totalBalance = store.userAccounts.reduce((acc, item) => acc + item.balance, 0);
    // const totalBalanceMovements = store.detailAccounts.reduce((acc, detail) => {
    //     return detail.operation === "ingreso"
    //         ? acc + detail.amount
    //         : acc - detail.amount;
    // }, 0);

    const path = useLocation()
    let navigate = useNavigate();
    console.log(params);


    useEffect(() => {
        actions.verifyToken();
        actions.initializeStore();
        if (!store.auth) {
            navigate("/");
        }
        if (path.pathname != "/cuentas") {
            actions.getAccountsDetail(params.id)
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
                        {path.pathname === "/cuentas" ?
                            <GeneralBalance balance={totalBalance} /> : <GeneralBalance  />}
                    </div>
                    <div className="scrollmenu">
                        {path.pathname === "/cuentas" ? (
                            store.userAccounts.length > 0 ? (
                                store.userAccounts.map((item) => (
                                    <Card
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        balance={item.balance}
                                        coin={item.coin}
                                        type={item.type}
                                    />
                                ))
                            ) : (
                                <p>No hay cuentas disponibles.</p>
                            )
                        ) : store.detailAccounts.length > 0 ? (
                            store.detailAccounts.map((details) => (
                                <CardMovimientos
                                    key={details.id}
                                    amount={details.amount}
                                    coin={details.coin}
                                    date={details.date}
                                    time={details.time}
                                    detail={details.detail}
                                    type={details.type}
                                    operation={details.operation}
                                />
                            ))
                        ) : (
                            <p>No hay detalles disponibles.</p>
                        )}                        
                        {store.detailUser && store.detailUser.length > 0 ? (
                            store.detailUser.map((movement) => (
                                <CardMovimientos
                                    key={movement.id}
                                    amount={movement.amount}
                                    coin={movement.coin}
                                    date={movement.date}
                                    time={movement.time}
                                    detailuser={movement.detail}
                                    type={movement.type}
                                    operation={movement.operation}
                                />
                            ))
                        ) : (
                            <p>No hay movimientos disponibles.</p>
                        )}
                    </div>


                </div>
                {path.pathname === "/cuentas" ? <Modal /> : <ModalDetails />}
            </div>
        </div>
    );
}