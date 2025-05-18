import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { LoaderPinwheel } from "lucide-react";
import UserHeader from "@/components/UserHeader";
import Navigation from "@/components/Navigation";
import BalanceCard from "@/components/BalanceCard";
import SpinWheel from "@/components/SpinWheel";
import AdCard from "@/components/AdCard";
import WatchAdModal from "@/components/WatchAdModal";
import WithdrawModal from "@/components/WithdrawModal";
import ReferralModal from "@/components/ReferralModal";
import AdBanner from "@/components/ads/AdBanner";
import { useIsMobile } from "@/hooks/use-mobile";

interface HomeProps {
  user: User;
  setUser: (user: User) => void;
}

export default function Home({ user, setUser }: HomeProps) {
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const isMobile = useIsMobile();

  // Fetch ads
  const { data: ads = [], isLoading: loadingAds } = useQuery({
    queryKey: ["/api/ads"],
  });

  const handleWatchAd = (ad: any) => {
    setSelectedAd(ad);
    setShowAdModal(true);
  };

  const handleAdWatched = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleWithdraw = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleSpinComplete = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <>
      <UserHeader user={user} />

      <main className="flex-1 overflow-auto p-4 pb-20">
        {/* Top Banner Ad */}
        <div className="mb-4 flex justify-center">
          {isMobile ? (
            <AdBanner adType="banner320x50" />
          ) : (
            <AdBanner adType="banner728x90" />
          )}
        </div>

        {/* Balance Card */}
        <BalanceCard 
          user={user} 
          onWithdraw={() => setShowWithdrawModal(true)} 
          onRefer={() => setShowReferralModal(true)} 
        />

        {/* Spin Wheel Section */}
        <SpinWheel user={user} onSpinComplete={handleSpinComplete} />

        {/* Mid-page Banner Ad */}
        <div className="my-4 flex justify-center">
          <AdBanner adType="banner300x250" />
        </div>

        {/* Watch Ads Section */}
        <h2 className="text-lg font-semibold px-1 mb-3">Watch & Earn</h2>
        
        {loadingAds ? (
          <div className="flex justify-center py-4">
            <LoaderPinwheel className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-gray-500">No ads available at the moment.</p>
          </div>
        ) : (
          <>
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} onWatch={handleWatchAd} />
            ))}
            
            {/* Native Banner Ad */}
            <div className="mt-6">
              <AdBanner adType="nativeBanner" />
            </div>
          </>
        )}
      </main>

      <Navigation activeTab="home" />

      {/* Watch Ad Modal */}
      <WatchAdModal
        ad={selectedAd}
        user={user}
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onAdWatched={handleAdWatched}
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        user={user}
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
      />

      {/* Referral Modal */}
      <ReferralModal
        user={user}
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />
    </>
  );
}
