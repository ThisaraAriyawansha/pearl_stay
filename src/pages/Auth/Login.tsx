import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#747293] to-[#908ea9] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-32 h-32 bg-white rounded-full top-20 left-20"></div>
          <div className="absolute w-24 h-24 bg-white rounded-full top-60 right-20"></div>
          <div className="absolute w-16 h-16 bg-white rounded-full bottom-40 left-40"></div>
          <div className="absolute w-20 h-20 bg-white rounded-full bottom-20 right-40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 mt-8">
          <div className="mb-8">
            <div className="flex items-center mb-6 space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl">
                <img 
                  src="/plogo-Picsart-AiImageEnhancer.png" 
                  alt="PearlStay Logo" 
                  className="object-contain w-8 h-8"
                />
              </div>
              <span className="text-3xl font-light text-white">PearlStay</span>
            </div>
            
            <h1 className="mb-4 text-4xl font-light leading-tight text-white">
              Welcome to your
              <br />
              <span className="font-medium">perfect stay</span>
            </h1>
            
            <p className="text-xl font-light leading-relaxed text-white/80">
              Discover extraordinary places to stay around the world. 
              Your journey begins here.
            </p>
          </div>
          
          <div className="space-y-4 text-white/60">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <span className="text-sm">Premium accommodations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <span className="text-sm">Verified hosts & properties</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <span className="text-sm">24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-[#e3e3e9]">
        <div className="w-full max-w-md mt-16">
          {/* Mobile Logo */}
          <div className="mb-10 text-center lg:hidden">
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
          <div className="mb-8">
            <h2 className="text-3xl font-light text-[#747293] mb-2">Sign in</h2>
            <p className="text-[#908ea9] font-light">Welcome back to PearlStay</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-6 border-l-4 border-red-400 rounded-r-lg bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#747293] mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 bg-white border border-[#c7c7d4] rounded-lg 
                           text-[#747293] placeholder-[#acaabe] 
                           focus:outline-none focus:ring-2 focus:ring-[#908ea9] focus:border-transparent
                           transition-all duration-200"
                  placeholder="Enter your email"
                />
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#acaabe]" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#747293] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 px-4 pr-12 bg-white border border-[#c7c7d4] rounded-lg 
                           text-[#747293] placeholder-[#acaabe] 
                           focus:outline-none focus:ring-2 focus:ring-[#908ea9] focus:border-transparent
                           transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#acaabe] 
                           hover:text-[#747293] transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#747293] hover:bg-[#908ea9] text-white font-medium rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#908ea9] focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c7c7d4]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-[#908ea9] bg-[#e3e3e9]">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-[#908ea9] mb-4">Don't have an account?</p>
            <Link
              to="/register"
              className="inline-block w-full h-12 leading-12 text-center border border-[#c7c7d4] p-2
                       text-[#747293] font-medium rounded-lg hover:bg-white hover:border-[#908ea9]
                       transition-all duration-200"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;