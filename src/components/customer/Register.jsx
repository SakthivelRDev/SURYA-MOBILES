import React, { useState } from 'react';
import { registerCustomer } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerCustomer(email, password, name);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h2 className="login-title">Looks like you're new here!</h2>
          <p className="login-subtitle">Sign up with your mobile number to get started</p>
          {/* Decorative graphic placeholder */}
          <div className="auth-graphic">📱</div>
        </div>
        
        <div className="auth-right">
            <h2 className="text-xl font-bold mb-4 text-blue-600 md:hidden">Sign Up</h2>
            
            {error && <p className="error-msg">{error}</p>}
            
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="input-group">
                    <input 
                        type="text" 
                        required
                        className="material-input"
                        placeholder="Enter Full Name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input 
                        type="email" 
                        required
                        className="material-input"
                        placeholder="Enter Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input 
                        type="password" 
                        required
                        className="material-input"
                        placeholder="Set Password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <p className="text-xs text-gray-500 my-2">
                    By continuing, you agree to Surya Mobile's <span className="text-blue">Terms of Use</span> and <span className="text-blue">Privacy Policy</span>.
                </p>

                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? 'Registering...' : 'CONTINUE'}
                </button>
                
                <Link to="/login" className="secondary-btn text-center mt-3">
                    Existing User? Log in
                </Link>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Register;