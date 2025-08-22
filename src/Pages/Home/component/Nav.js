// src/Components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../../../Service/Service";

export default function Navbar() {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate("/"); // quay về homepage sau logout
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Shop</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">

                        {/* Menu theo role */}
                        {user?.role === "admin" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/products">Quản lý sản phẩm</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">Quản lý đơn hàng</Link>
                                </li>
                            </>
                        )}
                        {user?.role === "user" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/orders">Đơn hàng của tôi</Link>
                            </li>
                        )}

                        {/* Profile + Logout */}
                        {user ? (
                            <li className="nav-item dropdown">
                                <span
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    style={{ cursor: "pointer" }}
                                >
                                    {user.name}
                                </span>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link>
                                    </li>
                                    <li>
                                        <span className="dropdown-item" onClick={handleLogout}>Đăng xuất</span>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/login">Đăng nhập</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/register">Đăng ký</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
