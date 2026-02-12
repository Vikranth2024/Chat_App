import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
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
    login(formData);
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
          Sign <span className="text-primary italic text-6xl">In</span>
        </h2>
        <p className="mt-4 text-center text-lg text-base-content/60 font-medium">
          Welcome back! Please enter your details.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md animate-scale-in relative z-10">
        <div className="glass py-12 px-8 border border-white/10 rounded-[3rem] sm:px-12 neo-shadow">
          <form className="space-y-8" onSubmit={handleSubmit}>
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
                  className="block w-full pl-14 pr-4 py-4.5 bg-base-content/5 border border-transparent rounded-[1.8rem] focus:bg-transparent focus:border-primary/30 outline-none placeholder-base-content/20 text-md font-medium transition-all"
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
                  className="block w-full pl-14 pr-14 py-4.5 bg-base-content/5 border border-transparent rounded-[1.8rem] focus:bg-transparent focus:border-primary/30 outline-none placeholder-base-content/20 text-md font-medium transition-all"
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

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-primary rounded border-none focus:ring-0 checked:bg-primary cursor-pointer text-primary-content"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-base-content/60 font-bold cursor-pointer hover:text-base-content/80 transition-colors">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-black text-primary hover:text-primary/80 uppercase tracking-widest text-[11px] transition-colors">
                  Forgot Password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex justify-center py-5 px-4 rounded-[1.8rem] shadow-2xl shadow-primary/30 text-md font-black text-primary-content bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 animate-glow"
              >
                {isLoggingIn ? (
                   <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Signing in...
                   </div>
                ) : "SIGN IN"}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-white/5">
            <p className="text-sm text-base-content/40 font-bold">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-black uppercase tracking-widest ml-1 hover:underline transition-all">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;