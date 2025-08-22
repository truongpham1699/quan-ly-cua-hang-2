import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Pages/Home/component/Nav";
import Footer from "./Pages/Home/component/Footer";
import HomePage from "./Pages/Home/HomePage";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import ProductManager from "./Pages/Admin/ProductManager";
import ProductDetail from "./Pages/User/ProductDetail";
import OrderPage from "./Pages/User/OrderPage";
import ProfileManager from "./Pages/User/ProfileManager";

export default function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Router>
                <Navbar />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin/products" element={<ProductManager />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/orders" element={<OrderPage />} />
                        <Route path="/profile" element={<ProfileManager />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </div>
    );
}
