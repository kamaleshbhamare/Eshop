import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { NavigationBar } from './common/navigation-bar/NavigationBar';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Products from './components/products/Products';
import SignUp from './components/signup/SignUp';
import { useAuth } from './context/AuthContext';

function App() {
  // State to manage user role 
  // const [role, setRole] = useState('');
  // const [token, setToken] = useState(localStorage.getItem('token') || ''); // Initialize token from localStorage

  const { user, token, isLoggedIn } = useAuth();

  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={token ? <Navigate to="/products" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          {/* <Route path="/products" element={token ? <Products /> : <Navigate to="/login" />} /> */}
          <Route path="/products" element={<Products />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
