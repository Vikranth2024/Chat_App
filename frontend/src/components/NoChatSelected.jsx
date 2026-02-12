import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-16 bg-transparent text-center animate-fade-in">
      <div className="max-w-md space-y-8">
        {/* Futuristic Floating Icon */}
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="w-24 h-24 rounded-[2rem] glass neo-shadow flex items-center justify-center border border-white/20 animate-float relative z-10">
            <MessageSquare className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-base-content tracking-tighter sm:text-5xl">
            Welcome to <span className="text-primary italic">Chatify!</span>
          </h2>
          <p className="text-lg text-base-content/60 font-medium leading-relaxed">
            Select a conversation from the sidebar to start chatting.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="pt-10 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 px-6 py-2 glass rounded-full border border-base-content/5">
              <div className="size-2 bg-success rounded-full animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest text-base-content/50">Ready to chat</span>
           </div>
        </div>

      </div>
    </div>
  );
};



export default NoChatSelected;