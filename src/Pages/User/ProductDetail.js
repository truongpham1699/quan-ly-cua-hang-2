import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, createOrder, getCurrentUser } from "../../Service/Service";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Lỗi lấy sản phẩm:", err);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <p className="text-center mt-4">Đang tải...</p>;

    const handleBuy = async () => {
        try {
            const user = getCurrentUser();
            const items = [
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                }
            ];
            await createOrder(user.id, items);
            alert("Mua thành công!");
            navigate("/orders");
        } catch (err) {
            console.error("Lỗi mua hàng:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Giá:</strong> {product.price.toLocaleString()} VND</p>
            <p><strong>Tồn kho:</strong> {product.stock}</p>

            <div className="mb-3">
                <label className="form-label">Số lượng:</label>
                <input
                    type="number"
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
    );
}
