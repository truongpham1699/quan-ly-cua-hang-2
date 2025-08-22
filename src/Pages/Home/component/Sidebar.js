// src/Components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../../Service/Service";

export default function Sidebar() {
    const user = getCurrentUser();

    if (!user) return null; // không hiển thị nếu chưa đăng nhập

    return (
        <div className="bg-light border-end vh-100 p-3" style={{ width: "200px" }}>
            <h5>Menu</h5>
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/">Trang chủ</Link>
                </li>
                {user.role === "admin" && (
                    <>
                        <li className="nav-item mb-2">
                            <Link className="nav-link" to="/add-product">Thêm sản phẩm</Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link className="nav-link" to="/orders">Quản lý đơn hàng</Link>
                        </li>
                    </>
                )}
                {user.role === "user" && (
                    <>
                        <li className="nav-item mb-2">
                            <Link className="nav-link" to="/my-orders">Đơn hàng của tôi</Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link className="nav-link" to="/profile">Thông tin cá nhân</Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}
