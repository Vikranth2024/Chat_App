const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center futuristic-bg p-12">
      <div className="max-w-md text-center glass p-10 rounded-[3rem] neo-shadow animate-scale-in">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
              className={`aspect-square rounded-[1.5rem] bg-gradient-to-br from-primary/30 to-primary/5 border border-white/10 transition-all duration-700 hover:scale-110 hover:rotate-3 animate-float ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-4xl font-black mb-4 text-base-content tracking-tighter uppercase">{title}</h2>
        <p className="text-base-content/60 font-medium leading-relaxed">{subtitle}</p>
        
        {/* Subtle high-tech accent */}
        <div className="mt-8 flex justify-center gap-1.5">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="h-1 w-8 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-[pulseGlow_2s_infinite]" style={{ animationDelay: `${i * 0.5}s` }} />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};


export default AuthImagePattern;