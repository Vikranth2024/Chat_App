import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl glass neo-shadow rounded-[1.5rem] border border-base-content/10 h-16 animate-fade-in"
    >
      <div className="container mx-auto px-6 h-full font-['Outfit']">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group transition-all">
              <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-primary-content shadow-lg shadow-primary/30 animate-float">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-base-content tracking-tighter">
                Chatify<span className="text-primary italic">.</span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <Link
                  to={"/settings"}
                  className="p-3 text-base-content/50 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Link>


                <div className="w-px h-6 bg-base-content/10 mx-2"></div>

                <div className="flex items-center gap-2">
                   <Link 
                    to={"/settings"} 
                    className="flex items-center gap-2.5 px-1.5 py-1.5 rounded-2xl hover:bg-base-content/5 transition-all"
                  >
                    <img 
                      src={authUser.profilePic || "/avatar.png"} 
                      alt="Profile" 
                      className="size-9 rounded-xl object-cover border border-base-content/10 shadow-sm"
                    />
                    <div className="hidden sm:flex flex-col items-start leading-none pr-2">
                       <span className="font-black text-base-content text-[13px]">{authUser.fullName.split(' ')[0]}</span>
                       <span className="text-[10px] font-bold text-success/70 uppercase">Online</span>
                    </div>
                  </Link>

                  <button 
                    className="p-3 text-base-content/30 hover:text-error hover:bg-error/5 rounded-2xl transition-all" 
                    onClick={logout}
                  >
                    <LogOut className="size-5" />
                  </button>
                </div>
              </>
            )}

            {!authUser && (
               <div className="flex gap-3">
                  <Link to="/login" className="px-6 py-2.5 text-sm font-black text-base-content hover:bg-base-content/5 rounded-2xl transition-all">SIGN IN</Link>
                  <Link to="/signup" className="px-6 py-2.5 text-sm font-black bg-primary text-primary-content hover:bg-primary/90 rounded-2xl transition-all shadow-xl shadow-primary/20">GET STARTED</Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </header>


  );
};

export default Navbar;