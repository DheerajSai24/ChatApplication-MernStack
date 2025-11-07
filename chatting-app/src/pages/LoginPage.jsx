import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔵 LOGIN FORM SUBMITTED!");
    console.log("📧 Email:", formData.email);
    console.log("🔑 Password:", formData.password ? "***" : "(empty)");
    console.log("🚀 Calling login function...");
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm">
        <div className="w-full max-w-md space-y-8 bg-white/90 dark:bg-gray-800/90 p-8 rounded-3xl shadow-2xl backdrop-blur-md border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center 
                group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-purple-500/50"
              >
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base text-gray-700 dark:text-gray-200">Email</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-purple-500/60 group-focus-within:text-purple-600 transition-colors" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base text-gray-700 dark:text-gray-200">Password</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-500/60 group-focus-within:text-purple-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn w-full text-base font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-xl" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center animate-in fade-in slide-in-from-bottom duration-1000">
            <p className="text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};
export default LoginPage;