import React from 'react';

export default function TwilstaLogo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center space-x-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {/* Background gradient (optional) */}
        <rect width="64" height="64" rx="16" fill="currentColor" />

        {/* Letter T */}
        <path
          d="M24 20h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5v16a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V28h-5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"
          fill="white"
        />

        {/* Stars */}
        <g fill="white">
          <path d="M50 15l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
          <path d="M42 12l0.5 1.5L44 14l-1.5 0.5L42 16l-0.5-1.5L40 14l1.5-0.5L42 12z" />
        </g>

        {/* Dots */}
        <circle cx="20" cy="44" r="2" fill="white" />
        <circle cx="44" cy="44" r="2" fill="white" />
        <circle cx="32" cy="50" r="2" fill="white" />

        {/* Infinity path animation */}
        <path
          d="M20 44 Q32 60, 44 44"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          className="animate-infinity"
        />

        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text */}
      <span className="text-xl text-primary font-bold select-none">Twilsta</span>

      {/* CSS for custom animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes infinity {
            0% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(100%);
            }
          }

          .animate-infinity {
            animation: infinity 1s ease-in-out infinite;
          }
        `,
        }}
      />
    </div>
  );
}
