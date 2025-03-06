import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface RoastButtonProps {
  roastResume: () => void;
  isRoasting: boolean;
}

const RoastButton: React.FC<RoastButtonProps> = ({ roastResume, isRoasting }) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  const handleClick = (): void => {
    setIsAnimating(true);
    roastResume();
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000); // Match this to your animation duration
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={isRoasting}
      className={`
        relative overflow-hidden flex items-center gap-2 
        ${isRoasting ? 'bg-red-800' : 'bg-red-500 hover:bg-red-600'} 
        text-white px-6 py-3 rounded-lg font-bold transition-colors
        ${isAnimating ? 'animate-pulse' : ''}
      `}
    >
      {/* Flame animation overlay */}
      {isAnimating && (
        <div className="absolute inset-0 flex justify-center items-end overflow-hidden">
          <div className="w-full h-16 flex justify-center">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`
                  absolute bottom-0 w-8 h-16 bg-yellow-500 rounded-t-full 
                  animate-flame opacity-90 transform scale-y-100 origin-bottom
                `}
                style={{
                  left: `${30 + i * 10}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.7 + Math.random() * 0.4}s`
                }}
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`
                  absolute bottom-0 w-6 h-12 bg-orange-500 rounded-t-full 
                  animate-flame opacity-90 transform scale-y-100 origin-bottom
                `}
                style={{
                  left: `${35 + i * 8}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: `${0.5 + Math.random() * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <MessageSquare className="w-5 h-5 relative z-10" />
      <span className="relative z-10">
        {isRoasting ? "COOKING UP FEEDBACK..." : "ROAST IT!"}
      </span>
    </button>
  );
};

export default RoastButton;