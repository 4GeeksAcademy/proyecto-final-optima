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
import { Currency } from "../component/currency";
import { CardDetails } from "../component/cardDetails";


export const PrincipalPage = () => {
    const { store, actions } = useContext(Context)
    const totalBalance = store.accounts.reduce((acc, item) => acc + item.balance, 0);
    const totalBalanceMovements = store.detailAccounts.reduce((acc, detail) => {
        return detail.operation === "ingreso"
            ? acc + detail.amount
            : acc - detail.amount;
    }, 0);
    const params = useParams()


    const path = useLocation()
    let navigate = useNavigate();

    useEffect(() => {
        actions.verifyToken();
        actions.initializeStore();
        if (!store.auth) {
            navigate("/");
        }
        if (path.pathname != "/cuentas") {
            actions.getAccountsDetail(params.id),
            actions.getDetailsUser()
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
                    <Currency />
                    <div className="scrollmenu">
                        {path.pathname === "/cuentas" ?
                            <GeneralBalance balance={totalBalance} /> : <GeneralBalance balance={totalBalanceMovements} />}
                    </div>
                    <div className="scrollmenu">
                        {path.pathname === "/cuentas" ? (
                            store.accounts.length > 0 ? (
                                store.accounts.map((item) => (
                                    <Card key={item.id} id={item.id} name={item.name} balance={item.balance} coin={item.coin} type={item.type} />
                                ))
                            ) : (
                                <p>No hay cuentas disponibles.</p>
                            )
                        ) : path.pathname.startsWith("/cuentas/") ? (
                            store.detailAccounts.length > 0 ? (
                                store.detailAccounts.map((details) => (
                                    <CardMovimientos key={details.id} amount={details.amount} coin={details.coin} date={details.date} time={details.time} detail={details.detail} type={details.type} operation={details.operation} />
                                ))
                            ) : (
                                <p>No hay movimientos en esta cuenta.</p>
                            )
                        ) : path.pathname === "/movimientos" ? (
                            <>
                                {console.log("Contenido de store.detailUser:", store.detailUser)}
                                {store.detailUser.length > 0 ? (
                                    store.detailUser.map((movents) => {
                                        console.log("Movimientos de todas las cuentas:", movents);
                                        return (
                                            <CardDetails key={movents.id} amount={movents.amount} coin={movents.coin} date={movents.date} time={movents.time} detail={movents.detail} type={movents.type} operation={movents.operation} />
                                        );
                                    })
                                ) : (
                                    <p>No hay movimientos en ninguna cuenta.</p>
                                )}
                            </>
                        ) : null}
                    </div>



                </div>
                {path.pathname === "/cuentas" ? <Modal /> : <ModalDetails />}
            </div>
        </div>
    );
}