import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { role } = await loginUser(email, password);

      if (role === "admin") navigate("/admin");
      else if (role === "staff") navigate("/staff");
      else navigate("/customer");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      {/* Brand Header */}
      <div className="w-full bg-blue-600 p-4 shadow-md mb-8 fixed top-0 left-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold tracking-tight">SuryaMobiles <span className="text-yellow-300 text-sm font-normal">Explore Plus</span></h1>
          <Link to="/register" className="text-sm hover:underline">New Customer? Register</Link>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg border border-slate-200 mt-16">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Welcome Back</h2>
        
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
             <input
              type="email"
              placeholder="e.g. admin@gmail.com"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-md text-white font-semibold transition-colors 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}
            `}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
                Don't have an account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Register here</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;