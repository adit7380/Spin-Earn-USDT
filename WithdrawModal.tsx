import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@shared/schema";
import { coinsToUsdt } from "@/lib/telegram";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WithdrawModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (updatedUser: User) => void;
}

export default function WithdrawModal({ user, isOpen, onClose, onWithdraw }: WithdrawModalProps) {
  const [wallet, setWallet] = useState(user.usdtWallet || "");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Clear errors when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);
  
  const availableUsdt = parseFloat(coinsToUsdt(user.coins));
  const minWithdrawal = 10; // 10 USDT minimum
  
  const handleWithdraw = async () => {
    setError(null);
    
    // Validate wallet address
    if (!wallet.trim()) {
      setError("Please enter a valid USDT wallet address");
      return;
    }
    
    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < minWithdrawal) {
      setError(`Minimum withdrawal is ${minWithdrawal} USDT`);
      return;
    }
    
    if (amountValue > availableUsdt) {
      setError("Insufficient balance");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call API to create withdrawal request
      const response = await apiRequest("POST", "/api/withdrawals", {
        userId: user.id,
        amount: amountValue,
        usdtWallet: wallet
      });
      
      const data = await response.json();
      
      // Update user object (reduce coins)
      const coinsToDeduct = amountValue * 50000; // 50,000 coins = 1 USDT
      const updatedUser = {
        ...user,
        coins: user.coins - coinsToDeduct,
        usdtWallet: wallet
      };
      
      onWithdraw(updatedUser);
      
      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for ${amountValue} USDT has been submitted and is pending approval.`,
      });
      
      onClose();
    } catch (err) {
      console.error("Withdrawal error:", err);
      setError(err instanceof Error ? err.message : "Failed to process withdrawal");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Withdraw USDT</DialogTitle>
        </DialogHeader>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Your balance</p>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold mr-2">{coinsToUsdt(user.coins)}</span>
            <span className="text-sm text-gray-500">USDT</span>
          </div>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="wallet" className="block text-sm font-medium text-gray-700 mb-2">
            USDT Wallet Address (TRC20)
          </Label>
          <Input
            id="wallet"
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Enter your USDT TRC20 address"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum withdrawal: {minWithdrawal} USDT</p>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Amount
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              min={minWithdrawal}
              max={availableUsdt}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              USDT
            </span>
          </div>
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <DialogFooter>
          <Button
            onClick={handleWithdraw}
            disabled={loading}
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg w-full mb-2"
          >
            {loading ? "Processing..." : "Request Withdrawal"}
          </Button>
        </DialogFooter>
        
        <p className="text-xs text-gray-500 text-center">
          Withdrawals are processed manually within 24-48 hours
        </p>
      </DialogContent>
    </Dialog>
  );
}
