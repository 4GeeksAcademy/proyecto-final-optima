import React from "react";
import { Link } from "react-router-dom";
import "/src/front/styles/sidebar.css";


export const Sidebar = () => {
    return (
        <div className="sidebar">
            <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">Sidebar</span>
            </Link>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/" className="nav-link active">
                        🏠 <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard" className="nav-link">
                        📊 <span>Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/orders" className="nav-link">
                        📦 <span>Orders</span>
                    </Link>
                </li>
                <li>
                    <Link to="/products" className="nav-link">
                        🛒 <span>Products</span>
                    </Link>
                </li>
                <li>
                    <Link to="/customers" className="nav-link">
                        👥 <span>Customers</span>
                    </Link>
                </li>
            </ul>
            <hr />
            <div className="dropdown">
                <Link to="#" className="dropdown-toggle" data-bs-toggle="dropdown">
                    <img src="https://github.com/mdo.png" alt="User" width="32" height="32" />
                    <strong className="ms-2">mdo</strong>
                </Link>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                    <li><Link className="dropdown-item" to="/new-project">New project...</Link></li>
                    <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/logout">Sign out</Link></li>
                </ul>
            </div>
        </div>
    );
};
