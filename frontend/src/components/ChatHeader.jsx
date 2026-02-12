import { X, Search, MoreVertical, Trash2, Image, Wallpaper } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState, useRef, useEffect } from "react";

const ChatHeader = () => {
  const { 
    selectedUser, 
    setSelectedUser, 
    isSearchOpen, 
    toggleSearch, 
    searchQuery, 
    setSearchQuery,
    clearChat,
    setSharedMediaOpen,
    setChatWallpaper
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  const handleWallpaperChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatWallpaper(selectedUser._id, reader.result);
      };
      reader.readAsDataURL(file);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="relative z-20">
      <div className="px-6 py-4 h-20 bg-transparent border-b border-base-content/5 flex items-center justify-between transition-all font-['Outfit']">
        <div className="flex items-center gap-4">
          {/* Mobile Back Button */}
          <button 
            onClick={() => setSelectedUser(null)}
            className="lg:hidden p-2 -ml-2 glass rounded-xl hover:bg-primary/10 transition-colors"
          >
            <X className="size-5 text-base-content/50" />
          </button>

          <div className="relative group">
            {selectedUser.profilePic ? (
              <img 
                src={selectedUser.profilePic} 
                alt={selectedUser.fullName} 
                className="size-11 rounded-2xl object-cover border border-base-content/10 shadow-lg group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="size-11 rounded-2xl bg-primary flex items-center justify-center text-primary-content font-black text-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                {getInitials(selectedUser.fullName)}
              </div>
            )}
            {isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-green-400 rounded-full border-2 border-base-100 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg font-black text-base-content tracking-tighter leading-tight">
              {selectedUser.fullName}
            </h3>
            <div className="flex items-center gap-1.5">
              {isOnline && <div className="size-1.5 bg-success rounded-full animate-pulse" />}
              <span className={`text-[11px] font-black uppercase tracking-widest ${isOnline ? "text-success/80" : "text-base-content/30"}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSearch}
            className={`p-3 rounded-2xl transition-all ${isSearchOpen ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "text-base-content/30 hover:text-primary hover:bg-primary/5"}`}
          >
             <Search size={20} />
          </button>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-3 rounded-2xl transition-all ${isMenuOpen ? "bg-base-content/10 text-base-content" : "text-base-content/30 hover:text-primary hover:bg-primary/5"}`}
            >
               <MoreVertical size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 glass neo-shadow border border-white/10 rounded-3xl p-2 animate-scale-in">
                 <button 
                  onClick={() => { setSharedMediaOpen(true); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-content/5 rounded-2xl text-[14px] font-bold text-base-content transition-colors"
                 >
                    <Image size={18} className="text-primary" />
                    Shared Media
                 </button>
                 <label className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-content/5 rounded-2xl text-[14px] font-bold text-base-content transition-colors cursor-pointer">
                    <Wallpaper size={18} className="text-secondary" />
                    Change Wallpaper
                    <input type="file" className="hidden" accept="image/*" onChange={handleWallpaperChange} />
                 </label>
                 <div className="h-px bg-base-content/5 my-2 mx-2" />
                 <button 
                  onClick={() => { clearChat(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error/10 rounded-2xl text-[14px] font-bold text-error transition-colors"
                 >
                    <Trash2 size={18} />
                    Clear Chat
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar Animation */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full px-6 py-3 glass border-b border-base-content/5 animate-fade-in">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
              <input 
                autoFocus
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-2.5 bg-base-content/5 border border-transparent rounded-2xl outline-none focus:border-primary/20 text-sm font-medium transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content">
                  <X size={16} />
                </button>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;