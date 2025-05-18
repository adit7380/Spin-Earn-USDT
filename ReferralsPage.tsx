import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import UserHeader from "@/components/UserHeader";
import Navigation from "@/components/Navigation";
import ReferralModal from "@/components/ReferralModal";
import { Button } from "@/components/ui/button";
import { createShareUrl } from "@/lib/telegram";
import { LoaderPinwheel } from "lucide-react";

interface ReferralsPageProps {
  user: User;
  setUser: (user: User) => void;
}

export default function ReferralsPage({ user, setUser }: ReferralsPageProps) {
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Fetch referrals
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: [`/api/user/${user.id}/referrals`],
  });

  return (
    <>
      <UserHeader user={user} />

      <main className="flex-1 overflow-auto p-4 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Refer & Earn</h1>
          <p className="text-gray-600 text-sm">
            Invite friends and earn extra coins every time they earn!
          </p>
        </div>

        {/* Referral Stats Card */}
        <div className="bg-gradient-to-r from-secondary to-emerald-500 rounded-2xl p-5 text-white shadow-lg mb-5">
          <h2 className="text-lg font-semibold mb-2">Your Referral Earnings</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-sm opacity-80">Total Referrals</p>
              <p className="text-2xl font-bold">{referrals.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-sm opacity-80">Earnings</p>
              <p className="text-2xl font-bold">{user.referralEarnings}</p>
              <p className="text-xs opacity-80">coins</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowReferralModal(true)}
            className="bg-white text-secondary px-4 py-2 rounded-lg font-medium w-full hover:bg-white/90"
          >
            Share Your Referral Link
          </Button>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-5 shadow mb-5">
          <h2 className="text-lg font-semibold mb-4">How It Works</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 mr-3">
                1
              </div>
              <div>
                <h3 className="font-medium">Invite Friends</h3>
                <p className="text-sm text-gray-600">Share your unique referral link with friends</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 mr-3">
                2
              </div>
              <div>
                <h3 className="font-medium">They Join</h3>
                <p className="text-sm text-gray-600">When they join using your link, you get 50 coins</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 mr-3">
                3
              </div>
              <div>
                <h3 className="font-medium">Earn Forever</h3>
                <p className="text-sm text-gray-600">Earn 5% of all your referrals' earnings for life!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referred Users */}
        <h2 className="text-lg font-semibold px-1 mb-3">Your Referred Users</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoaderPinwheel className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : referrals.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-gray-500">You haven't referred anyone yet.</p>
            <Button 
              onClick={() => setShowReferralModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium mt-4"
            >
              Share Your Referral Link
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-4">
            <div className="space-y-4">
              {referrals.map((referral: User) => (
                <div key={referral.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold mr-3">
                      {referral.firstName.charAt(0)}
                      {referral.lastName ? referral.lastName.charAt(0) : ''}
                    </div>
                    <div>
                      <p className="font-medium">
                        {referral.firstName} {referral.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Joined {new Date(referral.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Navigation activeTab="referrals" />

      {/* Referral Modal */}
      <ReferralModal
        user={user}
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />
    </>
  );
}
