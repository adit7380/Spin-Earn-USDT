import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ad, User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import DirectLinkAd from '@/components/ads/DirectLinkAd';
import { showRewardedInterstitial, showRewardedPopup } from '@/components/ads/RewardedAds';

interface WatchAdModalProps {
  ad: Ad | null;
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onAdWatched: (updatedUser: User) => void;
}

export default function WatchAdModal({ 
  ad, 
  user, 
  isOpen, 
  onClose, 
  onAdWatched 
}: WatchAdModalProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // State to track if we should show the direct link ad
  const [showDirectLinkAd, setShowDirectLinkAd] = useState(false);
  
  // Set up timer when modal opens
  useEffect(() => {
    if (isOpen && ad) {
      setTimeLeft(ad.watchTime);
      setError(null);
      setShowDirectLinkAd(true);
      
      const timerId = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      timerRef.current = timerId;
      
      // Also open the actual ad URL in a background tab
      window.open(ad.url, '_blank');
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setShowDirectLinkAd(false);
      };
    }
  }, [isOpen, ad]);
  
  const handleClaimReward = async () => {
    if (!ad || timeLeft > 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First, show the rewarded interstitial ad
      try {
        await showRewardedInterstitial();
        // You could add additional rewards here for watching the interstitial
        console.log('User watched the rewarded interstitial ad');
      } catch (adError) {
        console.log('User either skipped or had an error with the rewarded interstitial');
        // Continue even if ad fails - this is non-critical
      }
      
      // Make the API call to record the ad view
      const response = await apiRequest('POST', '/api/ads/view', {
        userId: user.id,
        adId: ad.id
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to claim reward');
      }
      
      // Update user with new coins
      const updatedUser = {
        ...user,
        coins: user.coins + ad.reward
      };
      
      // Try to show a rewarded popup as a non-blocking additional monetization
      showRewardedPopup().catch(popupError => {
        // Silently handle popup errors - don't block the main flow
        console.log('Popup ad error or user closed it:', popupError);
      });
      
      toast({
        title: 'Reward Claimed!',
        description: `You earned ${ad.reward} coins.`,
      });
      
      onAdWatched(updatedUser);
      onClose();
    } catch (err) {
      console.error('Ad claim error:', err);
      setError(err instanceof Error ? err.message : 'Failed to claim reward');
    } finally {
      setLoading(false);
    }
  };
  
  // Render DirectLinkAd for monetization
  useEffect(() => {
    if (showDirectLinkAd) {
      // The DirectLinkAd component will be triggered when this state is true
      // But we don't need to render it directly
    }
  }, [showDirectLinkAd]);
  
  if (!ad) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black bg-opacity-90 p-0 max-w-md w-full h-[80vh] flex flex-col text-white">
        <DialogHeader className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium flex items-center">
              +{ad.reward}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <DialogTitle className="sr-only">Watch Ad: {ad.title}</DialogTitle>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </DialogHeader>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-gray-800 w-full max-w-lg aspect-video mx-auto flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white/70 text-sm">Watching: {ad.title}</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <div className="bg-gray-700 rounded-full h-2 w-full overflow-hidden">
              <div
                className="bg-primary h-full countdown-timer"
                style={{ width: `${(ad.watchTime - timeLeft) / ad.watchTime * 100}%` }}
              ></div>
            </div>
            <p className="text-white/70 text-xs text-center mt-1">
              {timeLeft > 0
                ? `Watch for ${timeLeft}s to earn reward`
                : 'You can now claim your reward!'}
            </p>
          </div>
          
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          
          <Button
            onClick={handleClaimReward}
            disabled={timeLeft > 0 || loading}
            className={`bg-primary text-white font-bold py-3 px-6 rounded-lg w-full ${
              timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : 'Claim Reward'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
