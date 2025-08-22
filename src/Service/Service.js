// src/Service/Service.js
import axios from "axios";

const API_URL = "http://localhost:3000"; // json-server chạy ở đây

// ==================== AUTH ====================
export async function registerUser(userData) {
    const newUser = {
        ...userData,
        role: "user", // mặc định user
    };
    const res = await axios.post(`${API_URL}/users`, newUser);
    return res.data;
}

export async function login(username, password) {
    const res = await axios.get(`${API_URL}/users`, {
        params: { username, password }
    });
    if (res.data.length > 0) {
        const user = res.data[0];
        localStorage.setItem("user", JSON.stringify(user));
        return user;
    }
    throw new Error("Sai tài khoản hoặc mật khẩu");
}

export function logout() {
    localStorage.removeItem("user");
}

export function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export async function updateProfile(userId, newData) {
    const res = await axios.patch(`${API_URL}/users/${userId}`, newData);
    if (getCurrentUser()?.id === userId) {
        localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res.data;
}

// ==================== PRODUCT ====================
export async function getProducts() {
    const res = await axios.get(`${API_URL}/products`);
    return res.data;
}

export async function getProductById(id) {
    const res = await axios.get(`${API_URL}/products/${id}`);
    return res.data;
}

export async function updateProduct(id, newData) {
    const res = await axios.patch(`${API_URL}/products/${id}`, newData);
    return res.data;
}

export async function addProduct(productData) {
    const res = await axios.post(`${API_URL}/products`, productData);
    return res.data;
}

export async function deleteProduct(id) {
    return await axios.delete(`${API_URL}/products/${id}`);
}

// ==================== ORDER ====================
export async function getOrders(user) {
    if (user.role === "admin") {
        const res = await axios.get(`${API_URL}/orders`);
        return res.data;
    } else {
        const res = await axios.get(`${API_URL}/orders`, {
            params: { userId: user.id }
        });
        return res.data;
    }
}

export async function createOrder(userId, items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("items phải là mảng có ít nhất 1 sản phẩm");
    }

    const formattedItems = items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1
    }));

    const newOrder = {
        userId,
        items: formattedItems,
        status: "pending", // mặc định đang chờ
        createdAt: new Date().toISOString()
    };

    const res = await axios.post(`${API_URL}/orders`, newOrder);
    return res.data;
}

export async function updateOrderStatus(orderId, status) {
    const res = await axios.patch(`${API_URL}/orders/${orderId}`, { status });

    // Nếu giao hàng thành công thì trừ stock sản phẩm
    if (status === "delivered") {
        const order = res.data;
        for (const item of order.items) {
            const product = await getProductById(item.productId);
            await updateProduct(item.productId, {
                stock: product.stock - item.quantity
            });
        }
    }

    return res.data;
}

export async function cancelOrder(orderId) {
    const res = await axios.patch(`${API_URL}/orders/${orderId}`, {
        status: "cancelled"
    });
    return res.data;
}
