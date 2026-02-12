import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Shield, Info, Calendar } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

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

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Cover bar */}
          <div className="h-32 bg-purple-600"></div>

          <div className="px-8 pb-12">
            {/* Avatar Section */}
            <div className="flex flex-col items-center -mt-16 mb-8 text-center">
              <div className="relative group">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-3xl object-cover border-4 border-white shadow-lg shadow-slate-200"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-purple-600 text-white
                    p-2.5 rounded-2xl cursor-pointer 
                    shadow-xl shadow-purple-200 hover:scale-110 active:scale-95
                    transition-all duration-200 border-2 border-white
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-5 h-5" />
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
              <h1 className="mt-4 text-3xl font-black text-slate-900 tracking-tight">{authUser?.fullName}</h1>
              <p className="text-slate-500 font-medium">{authUser?.email}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Info className="size-3.5" /> Personal Information
                   </h3>
                   <div className="space-y-4">
                     <div className="space-y-1.5">
                       <label className="text-[13px] font-bold text-slate-700 ml-1">Full Name</label>
                       <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium">
                         {authUser?.fullName}
                       </div>
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[13px] font-bold text-slate-700 ml-1">Email Address</label>
                       <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium">
                         {authUser?.email}
                       </div>
                     </div>
                   </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Shield className="size-3.5" /> Account Statistics
                    </h3>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Calendar className="size-4 text-purple-600" />
                           <span className="text-sm font-bold text-slate-600">Joined</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{authUser.createdAt?.split("T")[0]}</span>
                      </div>
                      
                      <div className="h-px bg-slate-200"></div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="size-2.5 bg-green-500 rounded-full"></div>
                           <span className="text-sm font-bold text-slate-600">Status</span>
                        </div>
                        <span className="text-[11px] font-black px-3 py-1 bg-green-100 text-green-700 rounded-full tracking-wider">ACTIVE</span>
                      </div>
                    </div>
                 </div>

                 <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-3">
                    <Info className="size-5 text-purple-600 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-purple-700 font-medium leading-relaxed">
                      Your profile information is public to your contacts. You can update your image anytime.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;