import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Camera, 
  Mail, 
  Info, 
  Calendar,
  Check,
  ChevronRight
} from "lucide-react";

const SettingsPage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedImg, setSelectedImg] = useState(null);

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

   const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];


  return (
    <div className="min-h-screen futuristic-bg flex flex-col font-['Outfit']">
      <div className="h-24 shrink-0" />
      <div className="flex-1 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            
            {/* Sidebar Navigation */}
            <div className="space-y-3">
              <h1 className="text-4xl font-black text-base-content tracking-tighter px-4 mb-8">Settings</h1>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black transition-all ${
                    activeTab === tab.id 
                    ? "glass text-primary shadow-xl shadow-primary/10 border border-primary/20 scale-[1.05]" 
                    : "text-base-content/40 hover:bg-base-content/5 hover:text-base-content"
                  }`}
                >
                  <tab.icon className="size-5" />
                  <span className="text-[15px] tracking-tight uppercase">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="glass rounded-[3rem] neo-shadow border border-white/10 overflow-hidden flex flex-col min-h-[600px] animate-scale-in">
              
              {/* Header */}
              <div className="p-10 border-b border-white/5">
                 <h2 className="text-2xl font-black text-base-content tracking-tighter capitalize">{activeTab}</h2>
                 <p className="text-md text-base-content/40 font-medium tracking-tight">Manage your account {activeTab} settings.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                 
                 {/* Profile Tab */}
                 {activeTab === "profile" && (
                   <div className="space-y-12 animate-fade-in">
                      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-10">
                        <div className="relative group">
                          {selectedImg || authUser?.profilePic ? (
                            <img
                              src={selectedImg || authUser.profilePic}
                              alt="Profile"
                              className="size-40 rounded-[2.5rem] object-cover border-4 border-primary/20 shadow-2xl transition-all group-hover:scale-105"
                            />
                          ) : (
                            <div className="size-40 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-black text-5xl shadow-2xl transition-all group-hover:scale-105">
                              {getInitials(authUser?.fullName)}
                            </div>
                          )}
                          <label
                            htmlFor="avatar-upload"
                            className={`
                              absolute -bottom-3 -right-3 
                              bg-primary hover:bg-primary-focus
                              p-4 rounded-[1.2rem] cursor-pointer 
                              transition-all shadow-xl shadow-primary/40
                              ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                            `}
                          >
                            <Camera className="w-6 h-6 text-white" />
                            <input
                              type="file"
                              id="avatar-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={isUpdatingProfile}
                            />
                          </label>
                        </div>

                        <div className="flex-1 space-y-4 text-center sm:text-left pt-2">
                          <h3 className="text-3xl font-black text-base-content tracking-tighter">{authUser?.fullName}</h3>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                             <div className="px-4 py-1.5 glass rounded-full border border-primary/10 flex items-center gap-2">
                                <div className="size-2 bg-success rounded-full animate-ping" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-success/80">Active</span>
                             </div>
                             <div className="px-4 py-1.5 glass rounded-full border border-base-content/5 flex items-center gap-2">
                                <Mail className="size-3.5 text-base-content/40" />
                                <span className="text-[11px] font-bold text-base-content/60">{authUser?.email}</span>
                             </div>
                          </div>
                        </div>
                      </div>

                      {/* Language Preference */}
                       <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-3">
                          <label className="text-md font-bold text-base-content/60">Preferred Language</label>
                          <select 
                            className="select select-bordered w-full rounded-xl bg-base-200/50"
                            value={authUser?.preferredLanguage || "en"}
                            onChange={(e) => updateProfile({ preferredLanguage: e.target.value })}
                            disabled={isUpdatingProfile}
                          >
                            <option value="en">English (Default)</option>
                            <option value="hi">Hindi (हिंदी)</option>
                            <option value="ta">Tamil (தமிழ்)</option>
                            <option value="es">Spanish (Español)</option>
                            <option value="fr">French (Français)</option>
                            <option value="de">German (Deutsch)</option>
                            <option value="it">Italian (Italiano)</option>
                            <option value="pt">Portuguese (Português)</option>
                            <option value="ru">Russian (Русский)</option>
                            <option value="ja">Japanese (日本語)</option>
                            <option value="ko">Korean (한국어)</option>
                            <option value="zh">Chinese (中文)</option>
                          </select>
                          <p className="text-xs text-base-content/40">Incoming messages will be translated to this language.</p>
                       </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-1.5">
                           <div className="flex items-center gap-3 text-base-content/40 mb-2">
                              <Calendar className="size-4" />
                              <span className="text-[11px] font-black uppercase tracking-widest">Member Since</span>
                           </div>
                           <p className="text-xl font-black text-base-content tracking-tight">{authUser?.createdAt?.split("T")[0]}</p>
                        </div>
                        <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-1.5">
                           <div className="flex items-center gap-3 text-base-content/40 mb-2">
                              <Shield className="size-4" />
                              <span className="text-[11px] font-black uppercase tracking-widest">Security Level</span>
                           </div>
                           <p className="text-xl font-black text-primary tracking-tight">Verified Account</p>
                        </div>
                      </div>
                   </div>
                 )}

                 {/* Appearance Tab */}
                 {activeTab === "appearance" && (
                   <div className="space-y-10 animate-fade-in">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {THEMES.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`
                              group flex flex-col items-center gap-4 transition-all
                              ${theme === t ? "scale-105" : "hover:scale-102 opacity-60 hover:opacity-100"}
                            `}
                          >
                            <div 
                              className="w-full aspect-square rounded-[2rem] p-3 shadow-2xl transition-all border-4"
                              style={{ 
                                borderColor: theme === t ? 'var(--color-primary)' : 'transparent',
                                backgroundColor: t === 'dark' ? '#0f172a' : '#f8fafc' 
                              }}
                            >
                               <div className="w-full h-full glass rounded-[1.2rem] flex flex-col p-2 gap-1.5">
                                  <div className="h-3 w-3/4 bg-primary/20 rounded-full" />
                                  <div className="h-3 w-1/2 bg-primary/40 rounded-full" />
                               </div>
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${theme === t ? "text-primary" : "text-base-content/40"}`}>
                              {t}
                            </span>
                          </button>
                        ))}
                      </div>
                   </div>
                 )}

              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;