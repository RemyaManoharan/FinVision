import React from 'react';

const ChartSVG = () => {
  return (
    <svg className="w-full h-full p-4" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      {/* X and Y axis */}
      <line x1="40" y1="20" x2="40" y2="180" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" />
      <line x1="40" y1="180" x2="380" y2="180" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" />
      
      {/* Income line */}
      <path 
        d="M40,120 L100,100 L160,90 L220,70 L280,60 L340,40" 
        stroke="rgb(59, 130, 246)" 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Expense line */}
      <path 
        d="M40,140 L100,160 L160,130 L220,150 L280,120 L340,110" 
        stroke="rgb(139, 92, 246)" 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Data points */}
      <circle cx="40" cy="120" r="4" fill="rgb(59, 130, 246)" />
      <circle cx="100" cy="100" r="4" fill="rgb(59, 130, 246)" />
      <circle cx="160" cy="90" r="4" fill="rgb(59, 130, 246)" />
      <circle cx="220" cy="70" r="4" fill="rgb(59, 130, 246)" />
      <circle cx="280" cy="60" r="4" fill="rgb(59, 130, 246)" />
      <circle cx="340" cy="40" r="4" fill="rgb(59, 130, 246)" />
      
      <circle cx="40" cy="140" r="4" fill="rgb(139, 92, 246)" />
      <circle cx="100" cy="160" r="4" fill="rgb(139, 92, 246)" />
      <circle cx="160" cy="130" r="4" fill="rgb(139, 92, 246)" />
      <circle cx="220" cy="150" r="4" fill="rgb(139, 92, 246)" />
      <circle cx="280" cy="120" r="4" fill="rgb(139, 92, 246)" />
      <circle cx="340" cy="110" r="4" fill="rgb(139, 92, 246)" />
      
      {/* Legend */}
      <circle cx="290" cy="20" r="4" fill="rgb(59, 130, 246)" />
      <text x="300" y="24" fill="rgb(248, 250, 252)" fontSize="12">Income</text>
      
      <circle cx="290" cy="40" r="4" fill="rgb(139, 92, 246)" />
      <text x="300" y="44" fill="rgb(248, 250, 252)" fontSize="12">Expenses</text>
    </svg>
  );
};

export default ChartSVG;