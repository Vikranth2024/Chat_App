import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Menu, Check } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadCounts } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const onlineSignals = users.filter((u) => onlineUsers.includes(u._id));

  const filteredUsers = users
    .filter((user) => user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // 1. Prioritize online users
      const isOnlineA = onlineUsers.includes(a._id);
      const isOnlineB = onlineUsers.includes(b._id);
      if (isOnlineA && !isOnlineB) return -1;
      if (!isOnlineA && isOnlineB) return 1;

      // 2. Then sort by last message time
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    });

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full lg:w-[380px] flex flex-col bg-transparent transition-all duration-300 font-['Outfit']">
      {/* Search Header */}
      <div className="p-6 pb-2 space-y-4">
        <div className="flex items-center justify-between lg:hidden mb-4">
           <h1 className="text-2xl font-black tracking-tighter text-base-content">Chats</h1>
           <button className="p-2 glass rounded-full text-base-content/60"><Menu size={20} /></button>
        </div>
        
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 glass rounded-2xl outline-none text-[14px] border border-base-content/5 focus:border-primary/30 transition-all font-medium text-base-content placeholder:text-base-content/20 shadow-inner"
          />
        </div>
      </div>

      {/* Online Now - Horizontal Scroll */}
      {onlineSignals.length > 0 && (
        <div className="px-6 py-4 animate-fade-in shrink-0">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/70">Online Users</h2>
              <span className="flex items-center gap-1.5 px-2 py-0.5 glass rounded-full text-[10px] font-black text-success">
                 <div className="size-1 bg-success rounded-full animate-pulse" /> {onlineSignals.length} ONLINE
              </span>
           </div>
           <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar scroll-smooth">
              {onlineSignals.map((user) => (
                <button 
                  key={`online-${user._id}`}
                  onClick={() => setSelectedUser(user)}
                  className="flex flex-col items-center gap-2 group shrink-0"
                >
                   <div className="relative">
                      {user.profilePic ? (
                        <img src={user.profilePic} className="size-14 rounded-2xl object-cover border-2 border-primary/20 shadow-lg group-hover:scale-105 transition-all" />
                      ) : (
                        <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-primary-content font-black text-lg shadow-lg group-hover:scale-105 transition-all">
                           {getInitials(user.fullName)}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 size-4 bg-green-400 rounded-full border-2 border-base-100 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                   </div>
                   <span className="text-[10px] font-bold text-base-content/60 truncate w-14 text-center">{user.fullName.split(' ')[0]}</span>
                </button>
              ))}
           </div>
        </div>
      )}

      {/* User List Header */}
      <div className="px-6 py-2 shrink-0">
         <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-base-content/20">Direct Messages</h2>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-3 mt-2 pb-6">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);
          const unreadCount = unreadCounts[user._id] || 0;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-4 flex items-center gap-4 rounded-[1.5rem] transition-all duration-300 relative group
                ${isSelected 
                  ? "glass border border-primary/20 neo-shadow ring-1 ring-primary/10" 
                  : "hover:bg-base-content/5 border border-transparent"}
              `}
            >
              <div className="relative shrink-0">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className="size-14 object-cover rounded-2xl shadow-lg border border-white/10"
                  />
                ) : (
                  <div className={`size-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border border-white/10 ${isSelected ? "bg-primary text-primary-content" : "bg-gradient-to-br from-base-300 to-base-200 text-base-content/40"}`}>
                    {getInitials(user.fullName)}
                  </div>
                )}
                {isOnline && (
                  <span className={`absolute -bottom-0.5 -right-0.5 size-4 bg-green-400 rounded-full border-2 ${isSelected ? "border-primary" : "border-base-100"} shadow-[0_0_10px_rgba(74,222,128,0.5)]`} />
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center w-full mb-1">
                  <span className={`font-black truncate text-[16px] tracking-tight ${isSelected ? "text-primary" : "text-base-content"}`}>
                    {user.fullName}
                  </span>
                  {user.lastMessageAt && (
                    <span className={`text-[11px] font-bold opacity-40 ${isSelected ? "text-primary/70" : "text-base-content"}`}>
                      {new Date(user.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className={`text-[14px] truncate flex-1 font-medium ${isSelected ? "text-base-content/80" : "text-base-content/40"}`}>
                    {isOnline ? (
                      <span className="text-primary/80 font-bold flex items-center gap-1.5 animte-pulse">
                        <span className="size-1.5 bg-primary rounded-full" /> Online
                      </span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                  <div className="flex items-center gap-2 ml-2">
                    {unreadCount > 0 && !isSelected && (
                       <div className="min-w-[22px] h-5.5 bg-primary rounded-full flex items-center justify-center text-[10px] text-primary-content font-black px-2 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)] animate-glow">
                         {unreadCount}
                       </div>
                    )}
                    {isSelected && <Check className="size-4 text-primary animate-scale-in" />}
                  </div>
                </div>
              </div>
              
              {/* Futuristic floating accent for selected state */}
              {isSelected && (
                <div className="absolute left-[-4px] top-1/4 bottom-1/4 w-1 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary)]" />
              )}
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center py-20 opacity-20 flex flex-col items-center gap-4">
            <Search size={40} className="animate-float" />
            <p className="text-sm font-black tracking-widest uppercase">No users found</p>
          </div>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
