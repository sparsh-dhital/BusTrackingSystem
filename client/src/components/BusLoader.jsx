// client/src/components/BusLoader.jsx
export default function BusLoader({ message = "Loading Vignan TMS..." }) {
  return (
    <div
      // The depth effect: Fixed full screen, semi-transparent black overlay, and heavy backdrop blur
      className="fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black/50 backdrop-blur-xl text-white transition-colors duration-500"
      aria-busy="true"
      aria-label={message}
    >
      {/* Ambient Glow behind the card to make it pop further */}
      <div className="absolute -left-10 -top-10 h-80 w-80 rounded-full bg-blue-600/20 blur-[120px]"></div>
      <div className="absolute -right-10 -bottom-10 h-80 w-80 rounded-full bg-amber-500/15 blur-[120px]"></div>

      {/* GPU-Accelerated Animations (Slowed down for a premium feel) */}
      <style>{`
        @keyframes smooth-road {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes bus-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-smooth-road {
          animation: smooth-road 1.5s linear infinite; /* Slowed down from 0.8s */
        }
        .animate-bus-bounce {
          animation: bus-bounce 0.5s ease-in-out infinite; /* Slowed down from 0.3s */
        }
      `}</style>

      {/* Medium-sized, Sleek Glassmorphic Loader Card */}
      <div className="relative z-10 flex flex-col items-center rounded-2xl border border-white/10 bg-zinc-900/80 px-10 py-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
        {/* Brand Header */}
        <div className="mb-5 text-center">
          <span className="text-2xl font-black tracking-tighter text-white">
            VIGNAN
          </span>
          <span className="ml-1.5 text-sm font-semibold tracking-widest text-[#FFCC00]">
            TMS
          </span>
        </div>

        {/* Medium Road Track Container */}
        <div className="relative h-20 w-64 overflow-hidden rounded-xl border border-white/5 bg-black/50">
          {/* Road Surface */}
          <div className="absolute bottom-2 left-0 right-0 h-10 border-y border-zinc-800 bg-zinc-900/90"></div>

          {/* Scrolling Dashes */}
          <div className="absolute bottom-5.5 left-0 flex w-[200%] animate-smooth-road">
            <div className="flex w-full justify-around">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 w-8 rounded-full bg-[#FFCC00]"
                ></div>
              ))}
            </div>
            <div className="flex w-full justify-around">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 w-8 rounded-full bg-[#FFCC00]"
                ></div>
              ))}
            </div>
          </div>

          {/* Centered Modern Bus with Bounce */}
          <div className="absolute inset-0 flex items-center justify-center animate-bus-bounce">
            <svg
              viewBox="0 0 120 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-11 w-24 drop-shadow-[0_4px_10px_rgba(255,204,0,0.4)]"
            >
              {/* Wheels */}
              <circle
                cx="30"
                cy="40"
                r="5.5"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="1.5"
              />
              <circle cx="30" cy="40" r="2" fill="#FFCC00" />
              <circle
                cx="90"
                cy="40"
                r="5.5"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="1.5"
              />
              <circle cx="90" cy="40" r="2" fill="#FFCC00" />

              {/* Main Body */}
              <rect
                x="10"
                y="10"
                width="100"
                height="26"
                rx="5"
                fill="#FFCC00"
              />

              {/* Front Mask */}
              <path
                d="M90 10H102C104.761 10 107 12.2386 107 15V31C107 33.7614 104.761 36 102 36H90V10Z"
                fill="#eab308"
              />

              {/* Windows Strip */}
              <rect
                x="18"
                y="14"
                width="15"
                height="11"
                rx="2"
                fill="#09090b"
              />
              <rect
                x="37"
                y="14"
                width="15"
                height="11"
                rx="2"
                fill="#09090b"
              />
              <rect
                x="56"
                y="14"
                width="15"
                height="11"
                rx="2"
                fill="#09090b"
              />
              <rect
                x="75"
                y="14"
                width="17"
                height="11"
                rx="2"
                fill="#09090b"
              />

              {/* Front Windshield */}
              <path
                d="M94 14H102C103.105 14 104 14.8954 104 16V24C104 25.1046 103.105 26 102 26H94V14Z"
                fill="#18181b"
              />

              {/* Lights */}
              <rect x="105" y="21" width="2" height="3" rx="1" fill="#FFFFFF" />
              <rect x="105" y="26" width="2" height="3" rx="1" fill="#EF4444" />
              <rect x="10" y="21" width="2" height="3" rx="1" fill="#EF4444" />
            </svg>
          </div>
        </div>

        {/* Status Message */}
        <p className="mt-5 text-[11px] font-medium tracking-[0.15em] uppercase text-zinc-400 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}