// client/src/components/BusLoader.jsx
export default function BusLoader({ message = "Loading..." }) {
  return (
    <div
      className="flex h-screen w-full flex-col items-center justify-center bg-[#F5F5F7] transition-colors duration-500 dark:bg-black"
      aria-busy="true"
      aria-label={message}
    >
      <div className="relative h-1 w-64 overflow-hidden rounded-full bg-[#E3E3E8] dark:bg-[#1C1C1E]">
        {/* The moving "bus" indicator */}
        <div className="absolute top-0 h-full w-1/3 animate-drive rounded-full bg-[#007AFF] shadow-[0_0_10px_rgba(0,122,255,0.5)] dark:bg-[#0A84FF]"></div>
      </div>
      <p className="mt-6 text-sm font-medium tracking-wide text-[#86868B] animate-pulse">
        {message}
      </p>
    </div>
  );
}