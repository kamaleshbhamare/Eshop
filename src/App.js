import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { NavigationBar } from './common/navigation-bar/NavigationBar';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Products from './components/products/Products';
import SignUp from './components/signup/SignUp';
import { useState } from 'react';

function App() {
  const [role, setRole] = useState(''); // State to manage user role
  const token = localStorage.getItem('token');


  return (
    <div className="App">
      <Router>
        <NavigationBar token={token} />
        <Routes>
          <Route path="/" element={token ? <Navigate to="/products" token={token} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
          <Route path="/products" element={token ? <Products token={token} /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
