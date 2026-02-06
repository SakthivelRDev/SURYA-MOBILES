import React, { useState } from "react";
import { registerUser } from "../../services/authService"; // Fixed import name
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Calls the corrected function name from authService
      await registerUser(formData.email, formData.password, formData.name);

      // Redirect to login or customer home after successful registration
      navigate("/customer");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. Try again.");
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
          <Link to="/login" className="text-sm hover:underline">Already a member? Login</Link>
        </div>
      </div>

      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg border border-slate-200 mt-16">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Create Account</h2>
        
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.password}
              onChange={handleChange}
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
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;