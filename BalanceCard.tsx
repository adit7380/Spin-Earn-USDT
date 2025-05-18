import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { coinsToUsdt } from "@/lib/telegram";
import { Wallet, Share2 } from "lucide-react";

interface BalanceCardProps {
  user: User;
  onWithdraw: () => void;
  onRefer: () => void;
}

export default function BalanceCard({ user, onWithdraw, onRefer }: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-purple-700 rounded-2xl p-5 text-white shadow-lg mb-5 relative overflow-hidden">
      <div className="absolute right-0 top-0 opacity-10">
        {/* A cryptocurrency coin illustration */}
        <svg className="w-32 h-32" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-.5-13.236c-.312 0-.56-.089-.746-.265-.187-.176-.28-.418-.28-.725 0-.311.093-.557.28-.736.185-.179.434-.268.746-.268.312 0 .56.09.747.268.186.179.28.425.28.736 0 .307-.094.549-.28.725-.187.176-.435.265-.747.265zm-2.624 8.236h6.248v-1.15h-2.446v-6.354h-3.802v1.15h2.184v5.204h-2.184v1.15z" />
        </svg>
      </div>
      <h2 className="text-sm font-medium opacity-80">Your Balance</h2>
      <div className="flex items-baseline mt-1">
        <span className="text-3xl font-bold">{user.coins.toLocaleString()}</span>
        <span className="ml-1 text-sm opacity-80">coins</span>
      </div>
      <div className="mt-2 text-sm">
        <span className="opacity-80">≈ </span>
        <span className="font-medium">{coinsToUsdt(user.coins)}</span>
        <span className="opacity-80"> USDT</span>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          onClick={onWithdraw}
          className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center flex-1 hover:bg-white/90"
        >
          <Wallet className="h-4 w-4 mr-1" />
          Withdraw
        </Button>
        <Button
          onClick={onRefer}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center flex-1 hover:bg-white/30"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Refer
        </Button>
      </div>
    </div>
  );
}
