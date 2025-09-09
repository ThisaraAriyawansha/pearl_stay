import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, User, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css'; // We'll create this CSS file for animations

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    role: 'customer',
    nic: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen register-container">
      {/* Account for existing navbar height with padding-top */}
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#747293] to-[#908ea9] relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-32 h-32 bg-white rounded-full top-20 left-20 animate-float-1"></div>
          <div className="absolute w-24 h-24 bg-white rounded-full top-60 right-20 animate-float-2"></div>
          <div className="absolute w-16 h-16 bg-white rounded-full bottom-40 left-40 animate-float-3"></div>
          <div className="absolute w-20 h-20 bg-white rounded-full bottom-20 right-40 animate-float-4"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-8">
            <div className="flex items-center mb-6 space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl animate-pulse-slow">
                <img 
                  src="/plogo-Picsart-AiImageEnhancer.png" 
                  alt="PearlStay Logo" 
                  className="object-contain w-8 h-8"
                />
              </div>
              <span className="text-3xl font-light text-white animate-slide-in">PearlStay</span>
            </div>
            
            <h1 className="mb-4 text-4xl font-light leading-tight text-white">
              <span className="animate-fade-in-delay-1">Join thousands of</span>
              <br />
              <span className="font-medium animate-fade-in-delay-2">happy travelers</span>
            </h1>
            
            <p className="text-xl font-light leading-relaxed text-white/80 animate-fade-in-delay-3">
              Create your account today and unlock exclusive deals, 
              personalized recommendations, and seamless booking experiences.
            </p>
          </div>
          
          <div className="space-y-4 text-white/60">
            <div className="flex items-center space-x-3 animate-fade-in-delay-4">
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <span className="text-sm">Instant booking confirmation</span>
            </div>
            <div className="flex items-center space-x-3 animate-fade-in-delay-5">
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <span className="text-sm">Exclusive member discounts</span>
            </div>
            <div className="flex items-center space-x-3 animate-fade-in-delay-6">
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <span className="text-sm">Free cancellation on most bookings</span>
            </div>
            <div className="flex items-center space-x-3 animate-fade-in-delay-7">
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <span className="text-sm">Personalized travel recommendations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-[#e3e3e9]">
        <div className="w-full max-w-md mt-16 animate-scale-in">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="inline-flex items-center mb-4 space-x-2">
              <img 
                src="/plogo-Picsart-AiImageEnhancer.png" 
                alt="PearlStay Logo" 
                className="object-contain w-8 h-8"
              />
              <span className="text-2xl font-light text-[#747293]">PearlStay</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-light text-[#747293] mb-2 animate-slide-in-right">Create account</h2>
            <p className="text-[#908ea9] font-light animate-fade-in">Join PearlStay today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-4 border-l-4 border-red-400 rounded-r-lg bg-red-50 animate-shake">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="animate-fade-in-up-1">
                <label htmlFor="name" className="block text-sm font-semibold text-[#747293] mb-3">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-5 bg-white/60 border-2 border-[#c7c7d4]/40 rounded-2xl 
                             text-[#747293] placeholder-[#acaabe]/80 font-medium
                             focus:outline-none focus:ring-0 focus:border-[#908ea9]/60 focus:bg-white/90
                             transition-all duration-300 group-hover:border-[#908ea9]/40"
                    placeholder="John Doe"
                  />
                  <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#acaabe]/60 
                                 group-focus-within:text-[#908ea9] transition-colors duration-300" />
                </div>
              </div>

              <div className="animate-fade-in-up-2">
                <label htmlFor="email" className="block text-sm font-semibold text-[#747293] mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-5 bg-white/60 border-2 border-[#c7c7d4]/40 rounded-2xl 
                             text-[#747293] placeholder-[#acaabe]/80 font-medium
                             focus:outline-none focus:ring-0 focus:border-[#908ea9]/60 focus:bg-white/90
                             transition-all duration-300 group-hover:border-[#908ea9]/40"
                    placeholder="john@example.com"
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#acaabe]/60 
                                 group-focus-within:text-[#908ea9] transition-colors duration-300" />
                </div>
              </div>
            </div>

            {/* Mobile & NIC Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="animate-fade-in-up-3">
                <label htmlFor="mobile" className="block text-sm font-semibold text-[#747293] mb-3">
                  Mobile Number
                </label>
                <div className="relative group">
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full h-14 px-5 bg-white/60 border-2 border-[#c7c7d4]/40 rounded-2xl 
                             text-[#747293] placeholder-[#acaabe]/80 font-medium
                             focus:outline-none focus:ring-0 focus:border-[#908ea9]/60 focus:bg-white/90
                             transition-all duration-300 group-hover:border-[#908ea9]/40"
                    placeholder="+1 (555) 123-4567"
                  />
                  <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#acaabe]/60 
                                  group-focus-within:text-[#908ea9] transition-colors duration-300" />
                </div>
              </div>

              <div className="animate-fade-in-up-4">
                <label htmlFor="nic" className="block text-sm font-semibold text-[#747293] mb-3">
                  ID / Passport
                </label>
                <div className="relative group">
                  <input
                    id="nic"
                    name="nic"
                    type="text"
                    value={formData.nic}
                    onChange={handleChange}
                    className="w-full h-14 px-5 bg-white/60 border-2 border-[#c7c7d4]/40 rounded-2xl 
                             text-[#747293] placeholder-[#acaabe]/80 font-medium
                             focus:outline-none focus:ring-0 focus:border-[#908ea9]/60 focus:bg-white/90
                             transition-all duration-300 group-hover:border-[#908ea9]/40"
                    placeholder="ID Number"
                  />
                  <CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#acaabe]/60 
                                      group-focus-within:text-[#908ea9] transition-colors duration-300" />
                </div>
              </div>
            </div>

            {/* Account Type */}
            <div className="animate-fade-in-up-5">
              <label htmlFor="role" className="block text-sm font-semibold text-[#747293] mb-3">
                Account Type
              </label>
              <div className="relative group">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full h-14 px-5 bg-white/60 border-2 border-[#c7c7d4]/40 rounded-2xl 
                           text-[#747293] font-medium appearance-none cursor-pointer
                           focus:outline-none focus:ring-0 focus:border-[#908ea9]/60 focus:bg-white/90
                           transition-all duration-300 group-hover:border-[#908ea9]/40"
                >
                  <option value="customer">Customer - Book & Stay</option>
                  <option value="owner">Property Owner - List & Manage</option>
                </select>
                <Building2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#acaabe]/60 
                                   group-focus-within:text-[#908ea9] transition-colors duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Password Fields Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="animate-fade-in-up-6">
                <label htmlFor="password" className="block text-sm font-semibold text-[#747293] mb-3">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-5 pr-12 bg-white/60 border-2 border-[#c7c7d4]/40 rounded-2xl 
                             text-[#747293] placeholder-[#acaabe]/80 font-medium
                             focus:outline-none focus:ring-0 focus:border-[#908ea9]/60 focus:bg-white/90
                             transition-all duration-300 group-hover:border-[#908ea9]/40"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#acaabe]/60 
                             hover:text-[#747293] focus:text-[#908ea9] transition-colors duration-300 p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="animate-fade-in-up-7">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#747293] mb-3">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-5 pr-12 bg-white/60 border-2 border-[#c7c7d4]/40 rounded-2xl 
                             text-[#747293] placeholder-[#acaabe]/80 font-medium
                             focus:outline-none focus:ring-0 focus:border-[#908ea9]/60 focus:bg-white/90
                             transition-all duration-300 group-hover:border-[#908ea9]/40"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#acaabe]/60 
                             hover:text-[#747293] focus:text-[#908ea9] transition-colors duration-300 p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate-fade-in-up-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 mt-8 bg-gradient-to-r from-[#747293] to-[#908ea9] text-white 
                         font-semibold text-lg rounded-2xl shadow-xl
                         hover:from-[#908ea9] hover:to-[#acaabe] hover:shadow-2xl
                         focus:outline-none focus:ring-4 focus:ring-[#908ea9]/30
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="loading-spinner"></div>
                    <span>Creating your account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8 animate-fade-in-up-9">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#c7c7d4]/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 text-[#908ea9] bg-white/80 rounded-full font-medium">Already a member?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center animate-fade-in-up-10">
            <Link
              to="/login"
              className="inline-block w-full h-14 leading-14 text-center border-2 border-[#c7c7d4]/50 p-3
                       text-[#747293] font-semibold rounded-2xl bg-white/40 backdrop-blur-sm
                       hover:bg-white/80 hover:border-[#908ea9]/60 hover:text-[#908ea9]
                       transition-all duration-300 transform hover:scale-[1.02]"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;