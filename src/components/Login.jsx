import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { role } = await login(email, password);
      // Redirect based on role
      if (role === 'admin') navigate('/admin');
      else if (role === 'staff') navigate('/staff');
      else navigate('/shop');
    } catch (err) {
      setError('Failed to login: ' + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center" style={{marginTop: '50px'}}>
      <div className="card" style={{maxWidth: '400px', width: '100%'}}>
        <h2 className="text-center font-bold text-xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
                type="email" 
                placeholder="Email" 
                value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
        </form>
        <p className="mt-4 text-center">
            New Customer? <Link to="/register" className="text-orange-600">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;