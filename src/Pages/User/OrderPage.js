import React, { useEffect, useState, useRef } from "react";
import {
    getOrders,
    updateOrderStatus,
    getCurrentUser,
} from "../../Service/Service";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; //Phải có cái này thì mới chạy được modal
import { Modal } from "bootstrap";

export default function OrderPage() {
    const user = getCurrentUser();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [nextStatus, setNextStatus] = useState("");
    const [filterUser, setFilterUser] = useState("");
    const modalRef = useRef(null);
    const bsModalRef = useRef(null);

    useEffect(() => {
        if (user) loadOrders();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [orders, filterUser]);

    const loadOrders = async () => {
        const data = await getOrders(user);
        setOrders(data);
    };

    const applyFilter = () => {
        let temp = [...orders];
        if (filterUser.trim()) {
            const filterLower = filterUser.trim().toLowerCase();
            temp = temp.filter((o) =>
                o.userName?.toLowerCase().includes(filterLower) ||// Lọc người mua
                o.userId.toString() === filterLower ||
                o.id.toString() === filterLower ||
                o.items.some(item => item.name.toLowerCase().includes(filterLower)) // Lọc sản phẩm
            );
        }

        const statusOrder = ["pending", "delivered", "completed", "cancelled"];
        temp.sort((a, b) => {
            const statusCompare = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
            if (statusCompare !== 0) return statusCompare;
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        setFilteredOrders(temp);
        console.log("filterUser:", filterUser, "orders:", orders);
    };

    const confirmChange = (order, status) => {
        setSelectedOrder(order);
        setNextStatus(status);

        if (!bsModalRef.current && modalRef.current) {
            bsModalRef.current = new Modal(modalRef.current, { backdrop: "static" });
        }
        bsModalRef.current?.show();
    };

    const handleConfirm = async () => {
        if (selectedOrder && nextStatus) {
            const extraData = nextStatus === "completed"
                ? { receivedAt: new Date().toISOString() }
                : {};
            await updateOrderStatus(selectedOrder.id, nextStatus, extraData);
            loadOrders();
            bsModalRef.current?.hide();
        }
    };

    const handleCancel = async (orderId) => {
        await updateOrderStatus(orderId, "cancelled", { cancelledBy: "user" });
        loadOrders();
    };

    const handleReceived = async (orderId) => {
        await updateOrderStatus(orderId, "completed", {
            receivedAt: new Date().toISOString(),
        });
        loadOrders();
    };

    if (!user) return <p>Vui lòng đăng nhập!</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Quản lý đơn hàng</h2>

                <div className="mb-3 d-flex align-items-center">
                    <input type="text"
                           placeholder="Lọc theo mã đơn, ID hoặc tên khách"
                           value={filterUser}
                           onChange={(e) => setFilterUser(e.target.value)}
                           className="form-control me-3"
                           style={{ maxWidth: "300px" }}
                    />
                    {user.role === "admin" && (
                        <span className="badge bg-warning">
                             Tổng số đơn pending: {orders.filter(o => o.status === "pending").length}
                        </span>
                    )}
                </div>

            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Ngày nhận</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {filteredOrders.map((order) => {
                    const isOldPending = order.status === "pending" &&
                        (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24) > 2;

                    const userOverride = order.cancelledBy || order.receivedAt;

                    return (
                        <tr key={order.id} style={{ backgroundColor: isOldPending ? "#fff3cd" : "inherit" }}>
                            <td>{order.id}</td>
                            <td>{order.userName || `ID: ${order.userId}`}</td>
                            <td>
                                {order.items.map((item, i) => (
                                    <div key={i}>
                                        {item.name} x {item.quantity}
                                    </div>
                                ))}
                            </td>
                            <td>
                                <span className={`badge ${
                                    order.status === "pending" ? "bg-warning" :
                                        order.status === "delivered" ? "bg-info" :
                                            order.status === "completed" ? "bg-success" :
                                                order.status === "cancelled" ? "bg-danger" : "bg-secondary"
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>{order.receivedAt ? new Date(order.receivedAt).toLocaleString() : "-"}</td>
                            <td>
                                {user.role === "admin" ? (
                                    <>
                                        {!userOverride && (
                                            <>
                                                {order.status !== "pending" && (
                                                    <button className="btn btn-sm btn-outline-primary me-2"
                                                            onClick={() => confirmChange(order, "pending")}
                                                    >Pending</button>
                                                )}
                                                {order.status !== "delivered" && (
                                                    <button className="btn btn-sm btn-outline-info me-2"
                                                            onClick={() => confirmChange(order, "delivered")}
                                                    >Delivered</button>
                                                )}
                                                {order.status !== "completed" && (
                                                    <button className="btn btn-sm btn-outline-success me-2"
                                                            onClick={() => confirmChange(order, "completed")}
                                                    >Completed</button>
                                                )}
                                                {order.status !== "cancelled" && (
                                                    <button className="btn btn-sm btn-outline-danger"
                                                            onClick={() => confirmChange(order, "cancelled")}
                                                    >Cancelled</button>
                                                )}
                                            </>
                                        )}
                                        {userOverride && (
                                            <span className="text-muted">
                                                {order.cancelledBy ? "Người dùng đã hủy" : "Người dùng đã nhận"}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {order.status === "pending" && !order.cancelledBy && (
                                            <button className="btn btn-sm btn-danger"
                                                    onClick={() => handleCancel(order.id)}
                                            >Hủy đơn</button>
                                        )}
                                        {order.status === "delivered" && !order.receivedAt && (
                                            <button className="btn btn-sm btn-success"
                                                    onClick={() => handleReceived(order.id)}
                                            >Đã nhận hàng</button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Modal confirm */}
            <div ref={modalRef} className="modal fade" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xác nhận</h5>
                            <button type="button" className="btn-close" onClick={() => bsModalRef.current?.hide()}></button>
                        </div>
                        <div className="modal-body">
                            Bạn có chắc muốn chuyển đơn hàng <strong>{selectedOrder?.id}</strong> sang trạng thái <strong>{nextStatus}</strong> không?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => bsModalRef.current?.hide()}>Hủy</button>
                            <button type="button" className="btn btn-primary" onClick={handleConfirm}>Đồng ý</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
