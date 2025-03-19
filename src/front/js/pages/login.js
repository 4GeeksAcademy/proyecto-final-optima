import React, { useEffect, useContext } from "react";
import { LoginForm } from "../component/login-form";
import "../../styles/login.css";
import { Context } from "../store/appContext";

export const Login = () => {
    const { store, actions } = useContext(Context)

    useEffect(() => {
        if(store.theme === "dark"){
            actions.toggleTheme()
        }
    }, [])
    return (
        <div className="container-login">
            <div className="login w-75">
                <div className="w-50 login-left">
                    <h1 className="optima-title" >OPTIMA</h1>
                    <p>"Tu dinero bajo tu control, de la mejor manera posible"</p>
                </div>
                <div className="login-right w-50 ">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};
