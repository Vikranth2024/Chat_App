import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
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
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen futuristic-bg flex flex-col justify-center py-12 px-6 lg:px-8 font-['Outfit']">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in relative z-10">
        <div className="flex justify-center mb-8">
            <div className="size-16 rounded-[2rem] bg-primary flex items-center justify-center text-primary-content shadow-2xl shadow-primary/40 animate-float">
                <MessageSquare className="size-10" />
            </div>
        </div>
        <h2 className="text-center text-5xl font-black text-base-content tracking-tighter">
          Create <span className="text-primary italic text-6xl">Account</span>
        </h2>
        <p className="mt-4 text-center text-lg text-base-content/60 font-medium">
          Join Chatify and connect with friends instantly.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md animate-scale-in relative z-10">
        <div className="glass py-12 px-8 border border-white/10 rounded-[3rem] sm:px-12 neo-shadow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-black text-base-content/60 uppercase tracking-widest ml-2 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <User className="h-5 w-5 text-base-content/20" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-14 pr-4 py-4 bg-base-content/5 border border-transparent rounded-[1.8rem] focus:bg-transparent focus:border-primary/30 outline-none placeholder-base-content/20 text-md font-medium transition-all"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-base-content/60 uppercase tracking-widest ml-2 mb-2">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <Mail className="h-5 w-5 text-base-content/20" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-14 pr-4 py-4 bg-base-content/5 border border-transparent rounded-[1.8rem] focus:bg-transparent focus:border-primary/30 outline-none placeholder-base-content/20 text-md font-medium transition-all"
                  placeholder="your-email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-base-content/60 uppercase tracking-widest ml-2 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <Lock className="h-5 w-5 text-base-content/20" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-14 pr-14 py-4 bg-base-content/5 border border-transparent rounded-[1.8rem] focus:bg-transparent focus:border-primary/30 outline-none placeholder-base-content/20 text-md font-medium transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-base-content/20 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full flex justify-center py-5 px-4 rounded-[1.8rem] shadow-2xl shadow-primary/30 text-md font-black text-primary-content bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 animate-glow"
              >
                {isSigningUp ? (
                   <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Creating account...
                   </div>
                ) : "SIGN UP"}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-white/5">
            <p className="text-sm text-base-content/40 font-bold">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-black uppercase tracking-widest ml-1 hover:underline transition-all">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUpPage;