import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "/src/front/styles/sidebar.css";

export const Sidebar = () => {
    const { store, actions } = useContext(Context);

    const handleClick = () => {
        actions.logout();
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <span className="title-sidebar fs-1">Optima</span>
                <p className="sidebar-slogan">Tu dinero, siempre en su mejor versión</p>
            </div>
            <div className="d-flex align-items-center user-info">
                <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${store.user.first_name}`}
                    width="50"
                    height="50"
                    className="avatar"
                />
                <p className="name p-2">{store.user.first_name} {store.user.last_name}</p>
            </div>
            {/* menu */}
            <ul className="nav nav-pills flex-column mb-auto nav-links">
                <li className="nav-item">
                    <Link to="/cuentas" className="nav-link">
                        <i className="icons-sidebar bi bi-envelope"></i> <span className="icon-name">Cuentas</span>
                    </Link>
                </li>
                <li>
                    <Link to="/movimientos" className="nav-link">
                        <i className="icons-sidebar bi bi-graph-up"></i> <span className="icon-name">Movimientos</span>
                    </Link>
                </li>
                <li>
                    <Link to="/faqs" className="nav-link">
                        <i className="icons-sidebar bi bi-question-circle"></i> <span className="icon-name">FAQs</span>
                    </Link>
                </li>
            </ul>
            {/* boton modo oscuro */}
            <div className="theme-toggle-container">
                <button className="toggle-theme d-flex" onClick={actions.toggleTheme}>
                {store.theme === "light" ?  <><p className="icon-theme">🌙</p><p className="dark-mode">Modo Oscuro </p></> :<> <p className="icon-theme">☀️ </p><p className="dark-mode">Modo Claro</p></>}
                </button>
            </div>
            {/* boton cerrar sesion */}
            <div className="logout-container">
                <button className="logout-btn" onClick={handleClick}>
                    <i className="icons-sidebar bi bi-box-arrow-left"></i> <span className="icon-name" >Cerrar sesion</span>
                </button>
            </div>
        </div>
    );
};
