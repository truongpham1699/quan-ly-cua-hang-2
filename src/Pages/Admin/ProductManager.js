// src/Admin/ProductManager.js
import React, { useEffect, useState } from "react";
import {getProducts, addProduct, updateProduct, deleteProduct, getCurrentUser,} from "../../Service/Service";

export default function ProductManager() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
            setError("Không tải được danh sách sản phẩm!");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await addProduct({
                name: newProduct.name,
                description: newProduct.description,
                price: parseInt(newProduct.price),
                stock: parseInt(newProduct.stock),
            });
            setNewProduct({ name: "", description: "", price: "", stock: "" });
            fetchProducts();
        } catch (err) {
            console.error(err);
            setError("Không thêm được sản phẩm!");
        }
    };

    const handleUpdateProduct = async () => {
        try {
            await updateProduct(editingProduct.id, {
                name: editingProduct.name,
                description: editingProduct.description,
                price: parseInt(editingProduct.price),
                stock: parseInt(editingProduct.stock),
            });
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
            setError("Không sửa được sản phẩm!");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            try {
                await deleteProduct(id);
                fetchProducts();
            } catch (err) {
                console.error(err);
                setError("Không xóa được sản phẩm!");
            }
        }
    };

    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
        return <div className="container mt-5">Bạn không có quyền truy cập.</div>;
    }

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Quản lý sản phẩm</h3>

            {/* Form thêm sản phẩm */}
            <form onSubmit={handleAddProduct} className="mb-4">
                <div className="row g-2">
                    <div className="col-md-3">
                        <input type="text"
                               className="form-control"
                               placeholder="Tên sản phẩm"
                               value={newProduct.name}
                               onChange={(e) =>
                                   setNewProduct({ ...newProduct, name: e.target.value })}
                               required
                        />
                    </div>
                    <div className="col-md-3">
                        <input type="text"
                               className="form-control"
                               placeholder="Mô tả"
                               value={newProduct.description}
                               onChange={(e) =>
                                   setNewProduct({ ...newProduct, description: e.target.value })}
                               required
                        />
                    </div>
                    <div className="col-md-2">
                        <input type="number"
                               className="form-control"
                               placeholder="Giá"
                               value={newProduct.price}
                               onChange={(e) =>
                                   setNewProduct({ ...newProduct, price: e.target.value })}
                               required
                        />
                    </div>
                    <div className="col-md-2">
                        <input type="number"
                               className="form-control"
                               placeholder="Tồn kho"
                               value={newProduct.stock}
                               onChange={(e) =>
                                   setNewProduct({ ...newProduct, stock: e.target.value })}
                               required
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-success w-100">
                            Thêm
                        </button>
                    </div>
                </div>
            </form>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Danh sách sản phẩm */}
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Tên</th>
                    <th>Mô tả</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {products.map((p) => (
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.description}</td>
                        <td>{p.price.toLocaleString()}</td>
                        <td>{p.stock}</td>
                        <td>
                            <button className="btn btn-warning btn-sm me-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editModal"
                                    onClick={() => setEditingProduct(p)}
                            >
                                Sửa
                            </button>
                            <button className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteProduct(p.id)}
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal sửa sản phẩm */}
            <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {editingProduct && (
                            <>
                                <div className="modal-header">
                                    <h5 className="modal-title">Sửa sản phẩm</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal">
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <input className="form-control mb-2"
                                           value={editingProduct.name}
                                           onChange={(e) =>
                                               setEditingProduct({...editingProduct, name: e.target.value,})}
                                    />
                                    <input className="form-control mb-2" value={editingProduct.description}
                                           onChange={(e) =>
                                               setEditingProduct({...editingProduct, description: e.target.value,})}
                                    />
                                    <input type="number"
                                           className="form-control mb-2"
                                           value={editingProduct.price}
                                           onChange={(e) =>
                                               setEditingProduct({...editingProduct, price: e.target.value,})}
                                    />
                                    <input type="number" className="form-control mb-2"
                                           value={editingProduct.stock}
                                           onChange={(e) =>
                                               setEditingProduct({...editingProduct, stock: e.target.value,})}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                    >
                                        Đóng
                                    </button>
                                    <button className="btn btn-primary"
                                            data-bs-dismiss="modal"
                                            onClick={handleUpdateProduct}
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
