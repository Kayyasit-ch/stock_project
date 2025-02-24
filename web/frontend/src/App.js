import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AppNavbar from './components/Navbar';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import LoginAdmin from './pages/LoginAdmin';
import Register from './pages/Register';
import Home from './pages/Home';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  return (
    <Router>
      <AppNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} /> {/* แก้ไขจาก Welcome to Inventory System เป็น Home */}
          <Route path="/login_admin" element={<LoginAdmin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register_admin" element={<Register  />} />
          <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/edit-product/:codeproduct" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
