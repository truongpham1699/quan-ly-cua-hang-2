import React, { useState } from "react";
import { getCurrentUser, updateProfile, logout } from "../../Service/Service";
import { useNavigate } from "react-router-dom";

export default function ProfileManager() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState(user?.password || "");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpdate = async () => {
        try {
            await updateProfile(user.id, { name, password });
            setMessage("✅ Cập nhật thành công!");
        } catch (err) {
            setMessage("❌ Có lỗi xảy ra: " + err.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return <p className="text-center mt-4">⚠️ Vui lòng đăng nhập!</p>;

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <div className="card shadow">
                <div className="card-header bg-primary text-white text-center">
                    <h4>Thông tin cá nhân</h4>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Tên</label>
                        <input
                            className="form-control"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-success" onClick={handleUpdate}>
                            💾 Cập nhật
                        </button>
                        <button className="btn btn-danger" onClick={handleLogout}>
                            🚪 Đăng xuất
                        </button>
                    </div>
                    {message && <p className="mt-3 text-center fw-bold">{message}</p>}
                </div>
            </div>
        </div>
    );
}
