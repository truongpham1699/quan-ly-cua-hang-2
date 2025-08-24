// src/Pages/Home/HomePage.js
import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct, updateProduct, createOrder } from "../../Service/Service";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            try {
                await deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error("Lỗi xóa sản phẩm:", error);
            }
        }
    };

    const handleBuy = async (product) => {
        if (!user) {
            alert("Bạn cần đăng nhập để mua hàng");
            navigate('/login')
            return;
        }

        if (product.stock <= 0) {
            alert("Sản phẩm đã hết hàng");
            return;
        }

        try {
            // 1. Tạo order mới cho user
            await createOrder(user.id, [
                { id: product.id, name: product.name, price: product.price, quantity: 1 }
            ]);

            // 2. Giảm tồn kho sản phẩm
            const updatedProduct = {
                ...product,
                stock: product.stock - 1
            };
            await updateProduct(product.id, updatedProduct);

            // 3. Refresh lại danh sách
            fetchProducts();
            alert("Đặt hàng thành công!");
        } catch (error) {
            console.error("Lỗi mua sản phẩm:", error);
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4">Danh sách sản phẩm</h2>
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4 mb-4" key={product.id}>
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p><strong>Giá:</strong> {product.price.toLocaleString()} VND</p>
                                <p><strong>Tồn kho:</strong> {product.stock}</p>

                                <div className="mt-auto">
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        Xem chi tiết
                                    </button>

                                    {user?.role === "admin" ? (
                                        <>
                                            <button className="btn btn-warning btn-sm me-2"
                                                    onClick={() => navigate(`/product/${product.id}`)}
                                            >
                                                Sửa
                                            </button>
                                            <button className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(product.id)}
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    ) : (
                                        <button className="btn btn-success btn-sm"
                                                onClick={() => handleBuy(product)}
                                        >
                                            Mua ngay
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
