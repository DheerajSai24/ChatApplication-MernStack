const AuthImagePattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-md text-center relative z-10">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg
                  ${i % 2 === 0 ? "animate-pulse" : ""} 
                  ${i % 3 === 0 ? "bg-pink-300/20" : ""}
                  hover:scale-110 hover:bg-white/30 transition-all duration-300`}
              />
            ))}
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">{title}</h2>
          <p className="text-white/90 text-lg leading-relaxed drop-shadow">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;