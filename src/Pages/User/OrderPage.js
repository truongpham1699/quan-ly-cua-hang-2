import React, { useEffect, useState } from "react";
import {
    getOrders,
    updateOrderStatus,
    cancelOrder,
    getCurrentUser
} from "../../Service/Service";

export default function OrderPage() {
    const user = getCurrentUser();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) loadOrders();
    }, [user]);

    const loadOrders = async () => {
        const data = await getOrders(user);
        setOrders(data);
    };

    const handleStatusChange = async (orderId, status) => {
        await updateOrderStatus(orderId, status);
        loadOrders();
    };

    const handleCancel = async (orderId) => {
        await cancelOrder(orderId);
        loadOrders();
    };

    if (!user) return <p>Vui lòng đăng nhập!</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Quản lý đơn hàng</h2>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Mã đơn</th>
                    <th>Sản phẩm</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>
                            {order.items.map((item, i) => (
                                <div key={i}>
                                    {item.name} x {item.quantity}
                                </div>
                            ))}
                        </td>
                        <td>
                            <span
                            className={`badge ${
                                order.status === "pending"
                                    ? "bg-warning"
                                    : order.status === "delivered"
                                        ? "bg-success"
                                        : "bg-danger"
                            }`}
                            >
                                {order.status}
                            </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                        <td>
                            {user.role === "admin" ? (
                                <>
                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() =>
                                            handleStatusChange(order.id, "delivered")
                                        }
                                        disabled={order.status !== "pending"}
                                    >
                                        Giao hàng
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                            handleStatusChange(order.id, "cancelled")
                                        }
                                        disabled={order.status !== "pending"}
                                    >
                                        Hủy
                                    </button>
                                </>
                            ) : (
                                <>
                                    {order.status === "pending" && (
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleCancel(order.id)}
                                        >
                                            Hủy đơn
                                        </button>
                                    )}
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
