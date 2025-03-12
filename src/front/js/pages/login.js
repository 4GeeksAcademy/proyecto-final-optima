import React from "react";
import { LoginForm } from "../component/login-form";
import "../../styles/login.css";

export const Login = () => {

    return (
        <div className="container-login">
            <div className="login w-75">
                <div className="w-50 login-left">
                    <h1>OPTIMA</h1>
                    <p>"Tu dinero bajo tu control, de la mejor manera posible"</p>
                </div>
                <div className="w-50 login-right">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};
