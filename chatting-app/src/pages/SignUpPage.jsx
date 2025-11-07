import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🔵 SIGNUP FORM SUBMITTED!");
    console.log("👤 Full Name:", formData.fullName);
    console.log("📧 Email:", formData.email);
    console.log("🔑 Password:", formData.password ? "***" : "(empty)");

    const success = validateForm();
    console.log("✅ Validation result:", success);

    if (success === true) {
      console.log("🚀 Calling signup function...");
      signup(formData);
    } else {
      console.log("❌ Validation failed, signup not called");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm">
        <div className="w-full max-w-md space-y-8 bg-white/90 dark:bg-gray-800/90 p-8 rounded-3xl shadow-2xl backdrop-blur-md border border-white/20">
          {/* LOGO */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center 
              group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-purple-500/50"
              >
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Create Account</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base text-gray-700 dark:text-gray-200">Full Name</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-purple-500/60 group-focus-within:text-purple-600 transition-colors" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base text-gray-700 dark:text-gray-200">Email</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-purple-500/60 group-focus-within:text-purple-600 transition-colors" />
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
                  <Lock className="size-5 text-purple-500/60 group-focus-within:text-purple-600 transition-colors" />
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
                    <EyeOff className="size-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="size-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn w-full text-base font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-xl" 
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center animate-in fade-in slide-in-from-bottom duration-1000">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default SignUpPage;