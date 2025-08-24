// src/component/Nav.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../../../Service/Service";

export default function Navbar() {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                {/* Logo */}
                <Link className="navbar-brand"
                      to="/"
                      style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: "700",
                          fontSize: "1.6rem",
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          color: "#fff"
                    }}>
                    <span style={{color: "#FFD700"}}>Shop</span> Thập Cẩm
                </Link>

                {/* Nút menu thu gọn trên mobile */}
                <button className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {/* Menu admin */}
                        {user?.role === "admin" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/products">
                                        <i className="bi bi-box-seam me-1"></i> Quản lý sản phẩm
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">
                                        <i className="bi bi-receipt me-1"></i> Quản lý đơn hàng
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Menu user */}
                        {user?.role === "user" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/orders">
                                    <i className="bi bi-bag-check me-1"></i> Đơn hàng của tôi
                                </Link>
                            </li>
                        )}

                        {/* Nếu đã login */}
                        {user ? (
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle d-flex align-items-center"
                                      role="button"
                                      data-bs-toggle="dropdown"
                                      style={{ cursor: "pointer" }}
                                >
                                    <i className="bi bi-person-circle me-2 fs-5"></i>
                                    {user.name}
                                </span>
                                <ul className="dropdown-menu dropdown-menu-end shadow">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            <i className="bi bi-person-lines-fill me-2"></i> Thông tin cá nhân
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="dropdown-item text-danger"
                                              onClick={handleLogout}
                                        >
                                            <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                                        </span>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            // Nếu chưa login
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/login">
                                        <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/register">
                                        <i className="bi bi-person-plus me-1"></i> Đăng ký
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
