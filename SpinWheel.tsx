import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import SpinResultModal from './SpinResultModal';
import { apiRequest } from '@/lib/queryClient';
import { User } from '@shared/schema';
import { formatTimeRemaining } from '@/lib/telegram';

interface SpinWheelProps {
  user: User;
  onSpinComplete: (updatedUser: User) => void;
}

export default function SpinWheel({ user, onSpinComplete }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [spinResult, setSpinResult] = useState<{ reward: number } | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [spinCooldown, setSpinCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Check if user can spin
  useEffect(() => {
    if (user.spinsLeft <= 0) {
      setCanSpin(false);
      return;
    }
    
    // Check cooldown - if last spin was within the last hour
    if (user.lastSpin) {
      const now = new Date();
      const lastSpin = new Date(user.lastSpin);
      const cooldownMs = 60 * 60 * 1000; // 1 hour cooldown
      const timePassedMs = now.getTime() - lastSpin.getTime();
      
      if (timePassedMs < cooldownMs) {
        setCanSpin(false);
        
        // Set the cooldown timer
        const remainingMs = cooldownMs - timePassedMs;
        setSpinCooldown(Math.ceil(remainingMs / 1000));
        
        // Start the countdown timer
        const timer = setInterval(() => {
          setSpinCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setCanSpin(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      }
    }
    
    setCanSpin(true);
  }, [user.lastSpin, user.spinsLeft]);
  
  const handleSpin = async () => {
    if (!canSpin || spinning) return;
    
    setError(null);
    setSpinning(true);
    
    try {
      // Animate the wheel - random between 720 and 1080 degrees (2-3 full spins)
      const randomDegrees = 720 + Math.floor(Math.random() * 360);
      
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${randomDegrees}deg)`;
      }
      
      // Call the API to get the actual result
      const response = await apiRequest('POST', '/api/spin', { userId: user.id });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to spin');
      }
      
      // Wait for the animation to complete
      setTimeout(() => {
        setSpinResult({ reward: data.result.reward });
        setShowResult(true);
        setSpinning(false);
        
        // Update the user with the new coin amount
        onSpinComplete({
          ...user,
          coins: user.coins + data.result.reward,
          lastSpin: new Date(),
          spinsLeft: user.spinsLeft - 1
        });
      }, 3000);
    } catch (err) {
      console.error('Spin error:', err);
      setSpinning(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Reset the wheel
      if (wheelRef.current) {
        wheelRef.current.style.transform = 'rotate(0deg)';
      }
    }
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const closeResultModal = () => {
    setShowResult(false);
    setSpinResult(null);
    
    // Reset the wheel
    if (wheelRef.current) {
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };
  
  return (
    <div className="bg-white rounded-2xl p-5 shadow mb-5 text-center">
      <h2 className="text-lg font-semibold mb-4">Spin & Win</h2>
      
      {/* Spin wheel */}
      <div className="relative mx-auto w-64 h-64 mb-4">
        <div 
          ref={wheelRef}
          className="w-full h-full rounded-full spin-wheel overflow-hidden"
          style={{
            background: 'conic-gradient(#6D28D9 0deg, #9333EA 72deg, #10B981 72deg, #34D399 144deg, #F59E0B 144deg, #FBBF24 216deg, #EF4444 216deg, #F87171 288deg, #6D28D9 288deg)'
          }}
        >
          {/* Segments and values */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg flex flex-col items-center justify-center z-10 w-full h-full">
            <div className="absolute top-[15%] text-white">2</div>
            <div className="absolute top-[15%] right-[15%] text-white">4</div>
            <div className="absolute right-[15%] text-white">6</div>
            <div className="absolute bottom-[15%] right-[15%] text-white">8</div>
            <div className="absolute bottom-[15%] text-white">10</div>
            <div className="absolute bottom-[15%] left-[15%] text-white">15</div>
            <div className="absolute left-[15%] text-white">20</div>
            <div className="absolute top-[15%] left-[15%] text-white">6</div>
            
            {/* Center circle */}
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-primary font-bold">
              SPIN
            </div>
          </div>
        </div>
        
        {/* Arrow pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-12 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EF4444" className="w-8 h-12">
            <path d="M12 2L4 14h16L12 2z" />
          </svg>
        </div>
      </div>
      
      {/* Spin button (enabled) */}
      {canSpin ? (
        <div>
          <Button
            onClick={handleSpin}
            disabled={spinning}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors"
          >
            {spinning ? 'Spinning...' : 'Spin Now'}
          </Button>
          <p className="text-sm text-gray-500 mt-2">Spins left today: {user.spinsLeft}</p>
        </div>
      ) : (
        // Spin cooldown (disabled)
        <div>
          <div className="bg-gray-100 rounded-full h-4 w-full max-w-xs mx-auto mb-2 overflow-hidden">
            <div 
              className="bg-primary h-full countdown-timer" 
              style={{ width: `${(spinCooldown / 3600) * 100}%` }} 
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            Next spin available in {formatTime(spinCooldown)}
          </p>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
      
      {/* Result modal */}
      {showResult && spinResult && (
        <SpinResultModal 
          isOpen={showResult} 
          onClose={closeResultModal} 
          reward={spinResult.reward} 
        />
      )}
    </div>
  );
}
