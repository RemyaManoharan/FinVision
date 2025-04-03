import React from 'react';

const BackgroundSVG = () => {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(37, 99, 235, 0.2)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="rgb(10, 15, 30)" />
      <path d="M0,80 Q300,20 600,120 T1200,80" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" fill="none" />
      <path d="M0,100 Q300,40 600,140 T1200,100" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" fill="none" />
      <path d="M0,120 Q300,60 600,160 T1200,120" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1" fill="none" />
      <path d="M0,140 Q300,80 600,180 T1200,140" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" fill="none" />
      <path d="M0,160 Q300,100 600,200 T1200,160" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="1" fill="none" />
      
      <path d="M0,300 Q300,250 600,320 T1200,300" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="1" fill="none" />
      <path d="M0,320 Q300,270 600,340 T1200,320" stroke="rgba(139, 92, 246, 0.07)" strokeWidth="1" fill="none" />
      <path d="M0,340 Q300,290 600,360 T1200,340" stroke="rgba(139, 92, 246, 0.05)" strokeWidth="1" fill="none" />
      
      <path d="M-100,500 L1300,200" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1" fill="none" />
      <path d="M-100,530 L1300,230" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" fill="none" />
      <path d="M-100,560 L1300,260" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="1" fill="none" />
    </svg>
  );
};

export default BackgroundSVG;