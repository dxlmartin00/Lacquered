import React from 'react';

interface LaqueredLogoProps {
  className?: string;
  size?: number;
}

export const LaqueredLogo: React.FC<LaqueredLogoProps> = ({ className = 'w-8 h-8', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      aria-label="Laquered Logo"
    >
      <defs>
        {/* Soft blush background matching UI pill cards */}
        <linearGradient id="lqBgSoftPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF0F4" />
          <stop offset="100%" stopColor="#FFE4EC" />
        </linearGradient>

        {/* Vibrant Strawberry Rose Gradient matching the Live Chair Card */}
        <linearGradient id="lqPrimaryVibrantPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4B72" />
          <stop offset="100%" stopColor="#FF6B8B" />
        </linearGradient>

        {/* High-Gloss Specular Highlight */}
        <linearGradient id="lqWhiteGlint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Squircle Base (Matches UI radius) */}
      <rect width="120" height="120" rx="36" fill="url(#lqBgSoftPink)" stroke="#FFD2DE" strokeWidth="2" />

      {/* Core Emblem: Sculpted Almond + Monogram 'L' */}
      <g transform="translate(6, 6)">
        {/* Outer Almond / Nail Arc */}
        <path
          d="M54 20
             C64 36 82 56 82 74
             C82 90 68 100 50 100
             C34 100 24 88 24 74
             C24 62 32 46 44 28
             C48 22 51 17 54 20 Z"
          fill="url(#lqPrimaryVibrantPink)"
        />

        {/* Inner Cutout carving out the fluid 'L' contour */}
        <path
          d="M52 38
             C58 48 70 62 70 74
             C70 82 62 88 50 88
             C40 88 34 80 34 72
             C34 64 42 50 52 38 Z"
          fill="url(#lqBgSoftPink)"
        />

        {/* Apex Gel Bead (Builder Droplet) */}
        <circle cx="52" cy="64" r="6" fill="url(#lqPrimaryVibrantPink)" />

        {/* Gel Sheen Highlight Curve */}
        <path
          d="M38 60 
             C36 68 38 78 44 82 
             C40 78 38 70 40 64 Z"
          fill="url(#lqWhiteGlint)"
        />

        {/* Cured Top-Coat Gleam Starburst */}
        <path
          d="M74 24 
             Q74 32 82 32 
             Q74 32 74 40 
             Q74 32 66 32 
             Q74 32 74 24 Z"
          fill="#FF4B72"
        />
        <circle cx="74" cy="32" r="1.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
