// src/User/ProductDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getProductById, createOrder, getCurrentUser, updateProduct } from "../../Service/Service";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [editData, setEditData] = useState({});
    const [isEditing, setIsEditing] = useState(false); // State chỉnh sửa
    const user = getCurrentUser();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
                setEditData(data);
            } catch (err) {
                console.error("Lỗi lấy sản phẩm:", err);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <p className="text-center mt-4">Đang tải...</p>;

    const handleBuy = async () => {
        if (!user) {
            // Nếu chưa login → chuyển sang login, login xong về lại chỗ mua
            navigate(`/login?redirect=${location.pathname}`);
            return;
        }

        try {
            const items = [
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                }
            ];
            await createOrder(user.id, items);

            const updatedProduct = {
                ...product,
                stock: product.stock - quantity
            };
            await updateProduct(product.id, updatedProduct);

            alert("Mua thành công!");
            navigate("/orders");
        } catch (err) {
            console.error("Lỗi mua hàng:", err);
        }
    };

    const handleUpdate = async () => {
        try {
            const updated = await updateProduct(product.id, editData);
            setProduct(updated);
            setIsEditing(false); // Thoát sau khi sửa
            alert("Cập nhật sản phẩm thành công!");
        } catch (err) {
            console.error("Lỗi cập nhật sản phẩm:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Giá:</strong> {product.price.toLocaleString()} VND</p>
            <p><strong>Tồn kho:</strong> {product.stock}</p>

            {user?.role === "admin" ? (
                isEditing ? (
                    <div className="mt-4 border p-3">
                        <h4>Chỉnh sửa sản phẩm</h4>
                        <input type="text"
                               value={editData.name}
                               onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                               className="form-control mb-2"
                               placeholder="Tên sản phẩm"
                        />
                        <textarea value={editData.description}
                                  onChange={(e) =>
                                      setEditData({ ...editData, description: e.target.value })}
                                  className="form-control mb-2"
                                  placeholder="Mô tả"
                        />
                        <input type="number"
                               value={editData.price}
                               onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                               className="form-control mb-2"
                               placeholder="Giá"
                        />
                        <input type="number"
                               value={editData.stock}
                               onChange={(e) => setEditData({ ...editData, stock: Number(e.target.value) })}
                               className="form-control mb-2"
                               placeholder="Tồn kho"
                        />
                        <button className="btn btn-success me-2" onClick={handleUpdate}>
                            Lưu thay đổi
                        </button>
                        <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                            Hủy
                        </button>
                    </div>
                ) : (
                    <div>
                        <button className="btn btn-warning mt-3" onClick={() => setIsEditing(true)}>
                            Sửa sản phẩm
                        </button>
                    </div>
                )
            ) : (
                <div>
                    <div className="mb-3">
                        <label className="form-label">Số lượng:</label>
                        <input type="number"
                               min="1"
                               max={product.stock}
                               value={quantity}
                               onChange={(e) => setQuantity(Number(e.target.value))}
                               className="form-control"
                               style={{ width: "150px" }}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleBuy}>
                        Mua ngay
                    </button>
                </div>
            )}
        </div>
    );
}
