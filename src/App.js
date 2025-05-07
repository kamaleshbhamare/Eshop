import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useState } from 'react';

import NavigationBar from './common/navigation-bar/NavigationBar';
import Login from './components/login/Login';
import Products from './components/products/Products';
import SignUp from './components/signup/SignUp';
import ProductDetails from './components/productdetails/ProductDetails';
import CreateOrder from './components/createorder/CreateOrder';
import { useAuth } from './context/AuthContext';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategoryRoot] = useState('');
  const { isLoggedIn } = useAuth();

  return (
    <div className="App">
      <Router>
        <NavigationBar setSearchTerm={setSearchTerm} />
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/products" /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/products" element={<Products searchTerm={searchTerm} setSelectedCategoryRoot={setSelectedCategoryRoot} />} />
          <Route path='/products/:id' element={<ProductDetails selectedCategory={selectedCategory} />} />
          <Route path='/createorder' element={<CreateOrder />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
