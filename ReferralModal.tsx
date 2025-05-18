import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@shared/schema";
import { copyToClipboard, createShareUrl } from "@/lib/telegram";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ReferralModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralModal({ user, isOpen, onClose }: ReferralModalProps) {
  const { toast } = useToast();
  const referralUrl = createShareUrl(user);
  
  // Get referrals data
  const { data: referrals = [] } = useQuery({
    queryKey: [`/api/user/${user.id}/referrals`],
    enabled: isOpen,
  });
  
  const handleCopyLink = () => {
    if (copyToClipboard(referralUrl)) {
      toast({
        title: "Link Copied",
        description: "Referral link copied to clipboard",
      });
    }
  };
  
  const handleShareToTelegram = () => {
    // If in Telegram WebApp, we'd use the share API
    // For now just copy to clipboard
    handleCopyLink();
    
    // In a real Telegram Bot implementation:
    // window.Telegram.WebApp.switchInlineQuery(user.referralCode);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invite Friends</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 bg-primary/5 rounded-xl mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Your referral code</p>
          <div className="flex">
            <Input
              type="text"
              value={referralUrl}
              readOnly
              className="w-full px-4 py-3 rounded-l-lg border border-gray-300 bg-white focus:outline-none text-sm"
            />
            <Button
              onClick={handleCopyLink}
              className="bg-primary text-white px-4 rounded-r-lg"
              title="Copy referral link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">How it works:</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Share your link with friends</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>When they join, you get 50 coins</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You earn 5% of their earnings for life!</span>
            </li>
          </ul>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Your referrals</p>
          <p className="text-3xl font-bold">{referrals.length}</p>
          <p className="text-sm text-gray-500">
            Total earned: <span>{user.referralEarnings}</span> coins
          </p>
        </div>
        
        <DialogFooter className="mt-6">
          <Button
            onClick={handleShareToTelegram}
            className="bg-[#0088cc] text-white font-bold py-3 px-6 rounded-lg w-full flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2a10 10 0 110 20 10 10 0 010-20zm3.224 6.62l-5.446 2.58c-.035.016-.065.045-.078.08l-.899 3.36c-.05.187.1.358.287.311l1.83-.463a.23.23 0 01.206.046l2.104 1.846c.096.085.239.085.335 0l4.43-3.882c.257-.225.257-.619 0-.844l-2.609-2.28c-.029-.026-.066-.04-.104-.04-.023 0-.047.005-.068.014z"/>
            </svg>
            Share via Telegram
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
