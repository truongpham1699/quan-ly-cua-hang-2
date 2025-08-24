// src/User/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../Service/Service";

export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ name, username, password });
            setSuccess("Đăng ký thành công! Hãy đăng nhập.");
            setError("");

            setTimeout(() => {
                navigate("/login");
            }, 1000); // chờ 1s rồi chuyển sang trang login
        } catch (err) {
            console.error(err);
            setError("Đăng ký thất bại!");
            setSuccess("");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3 className="text-center mb-4">Đăng ký</h3>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Họ và tên</label>
                    <input type="text"
                           className="form-control"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           required
                    />
                </div>

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
                {success && <div className="alert alert-success">{success}</div>}

                <button type="submit" className="btn btn-primary w-100">
                    Đăng ký
                </button>
            </form>
        </div>
    );
}
