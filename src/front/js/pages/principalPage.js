import React, { useContext, useEffect, useState } from "react";
import { Sidebar } from "../component/sidebar";
import { Card } from "../component/card";
import { GeneralBalance } from "../component/generalBalance";
import "../../styles/container.css";
import { Context } from "../store/appContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Modal } from "../component/modal";
import { ModalDetails } from "../component/modalDetails";
import { CardMovimientos } from "../component/cardMovimiento";
import { CardDetails } from "../component/cardDetails";
import { ModalEditAccount } from "../component/modalEditAccount";
import { Filter } from "../component/filter";
import { EmptyComponet } from "../component/emptyComponet";


export const PrincipalPage = () => {
    const { store, actions } = useContext(Context)
    const path = useLocation()
    let navigate = useNavigate();
    const params = useParams();
    const [cardId, setCardId] = useState(null)
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        actions.verifyToken();
        actions.initializeStore();


        if (!store.auth) {
            navigate("/");
        }
        if (path.pathname !== "/cuentas" && params.id) {
            (async () => {
                await actions.getAccountsDetail(params.id)
            })();
        }
        if (path.pathname === "/cuentas") {
            (async () => {
                await actions.getDetailsUser();
            })()
        }
    }, [params.id, path.pathname, store.account]);

    if (!store.auth) {
        actions.logout()
        navigate("/");
    }

    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <div className="container-fluid p-4">
                <div className="row d-flex justify-content-center gap-3">
                    <div className="col-12 col-md-10 col-lg-8">
                        {/* <GeneralBalance /> */}
                    </div>
                    <div className="scrollmenu">
                        {path.pathname.startsWith("/cuentas/") ? (
                            store.detailAccounts.length > 0 ? (
                                store.detailAccounts.map((details) => {
                                    const account = store.accounts.find(account => account.id === details.accounts_id);
                                    return (
                                        <CardMovimientos
                                            id={details.id}
                                            amount={details.amount}
                                            coin={details.coin}
                                            date={details.date}
                                            time={details.time}
                                            detail={details.detail}
                                            type={details.type}
                                            operation={details.operation}
                                            accountName={account ? account.name : "Cuenta desconocida"}
                                        />
                                    );
                                })
                            ) : (
                                <p>No hay movimientos en esta cuenta.</p>
                            )
                        ) : path.pathname === "/movimientos" ? (
                            store.detailUser.length > 0 ? (
                                store.detailUser.map((movents) => {
                                    const account = store.accounts.find(account => account.id === movents.accounts_id);
                                    return (
                                        <CardDetails
                                            id={movents.id}
                                            amount={movents.amount}
                                            coin={movents.coin}
                                            date={movents.date}
                                            time={movents.time}
                                            detail={movents.detail}
                                            type={movents.type}
                                            operation={movents.operation}
                                            accountName={account ? account.name : "Cuenta desconocida"}
                                        />
                                    );
                                })
                            ) : (
                                <EmptyComponet/>
                            )
                        ) : (
                            store.accounts.length > 0 ? (
                                store.accounts.map((item) => (
                                    <Card
                                        id={item.id}
                                        name={item.name}
                                        balance={item.balance}
                                        coin={item.coin}
                                        type={item.type}
                                        onUpdate={() => {
                                            setCardId(item.id)
                                            setShowModal(true)
                                        }}
                                    />
                                ))
                            ) : (
                                <EmptyComponet/>
                            )
                        )}
                    </div>
                </div>
                {path.pathname === "/cuentas" ? <Modal /> : <ModalDetails />}
                {path.pathname === "/cuentas" ? null : <Filter />}
                <ModalEditAccount cardId={cardId} show={showModal} onClose={() => setShowModal(false)} />
            </div>
        </div>
    );
}