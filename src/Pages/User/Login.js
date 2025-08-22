// src/User/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../Service/Service";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await login(username, password); // ✅ service trả về user
            setError("");
            if (user.role === "admin") {
                navigate("/admin/products"); // Quản lý sản phẩm
            } else {
                navigate("/"); // Người dùng
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3 className="text-center mb-4">Đăng nhập</h3>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input type="text"
                           className="form-control"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input type="password"
                           className="form-control"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary w-100">
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}
