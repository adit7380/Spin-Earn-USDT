import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import UserHeader from "@/components/UserHeader";
import Navigation from "@/components/Navigation";
import BalanceCard from "@/components/BalanceCard";
import WithdrawModal from "@/components/WithdrawModal";
import { LoaderPinwheel } from "lucide-react";
import { coinsToUsdt } from "@/lib/telegram";
import { COIN_TO_USDT_RATE } from "@/lib/constants";

interface WalletPageProps {
  user: User;
  setUser: (user: User) => void;
}

export default function WalletPage({ user, setUser }: WalletPageProps) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Fetch transactions history
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: [`/api/user/${user.id}/transactions`],
  });

  // Fetch withdrawal history
  const { data: withdrawals = [], isLoading: loadingWithdrawals } = useQuery({
    queryKey: [`/api/user/${user.id}/withdrawals`],
  });

  const handleWithdraw = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'spin':
        return (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
      case 'ad':
        return (
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'referral':
        return (
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        );
      case 'withdrawal':
      case 'withdrawal_rejected':
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getTransactionTitle = (transaction: any) => {
    switch (transaction.type) {
      case 'spin':
        return 'Spin Reward';
      case 'ad':
        return 'Ad Reward';
      case 'referral':
        return 'Referral Bonus';
      case 'withdrawal':
        return 'USDT Withdrawal';
      case 'withdrawal_rejected':
        return 'Withdrawal Rejected';
      default:
        return 'Transaction';
    }
  };

  const getWithdrawalStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">Pending</span>;
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <UserHeader user={user} />

      <main className="flex-1 overflow-auto p-4 pb-20">
        {/* Balance Card */}
        <BalanceCard 
          user={user} 
          onWithdraw={() => setShowWithdrawModal(true)} 
          onRefer={() => {}} 
        />

        {/* Conversion Rate Info */}
        <div className="bg-white rounded-xl p-4 shadow mb-5">
          <h2 className="text-sm font-medium mb-2">USDT Conversion Rate</h2>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Coins to USDT:</span>
              <span className="font-medium">{COIN_TO_USDT_RATE.toLocaleString()} coins = 1 USDT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Minimum withdrawal:</span>
              <span className="font-medium">10 USDT</span>
            </div>
          </div>
        </div>

        {/* Withdrawals */}
        <h2 className="text-lg font-semibold px-1 mb-3">Withdrawal History</h2>
        
        {loadingWithdrawals ? (
          <div className="flex justify-center py-4">
            <LoaderPinwheel className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-center mb-5">
            <p className="text-gray-500">No withdrawal history yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-4 mb-5">
            <div className="space-y-4">
              {withdrawals.map((withdrawal: any) => (
                <div key={withdrawal.id} className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{withdrawal.amount.toString()} USDT</p>
                      <p className="text-xs text-gray-500">{new Date(withdrawal.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    {getWithdrawalStatusBadge(withdrawal.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions */}
        <h2 className="text-lg font-semibold px-1 mb-3">Recent Transactions</h2>
        
        {loadingTransactions ? (
          <div className="flex justify-center py-4">
            <LoaderPinwheel className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-gray-500">No transaction history yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-4">
            <div className="space-y-4">
              {transactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    {getTransactionIcon(transaction.type)}
                    <div className="ml-3">
                      <p className="font-medium">{getTransactionTitle(transaction)}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`font-medium ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Navigation activeTab="wallet" />

      {/* Withdraw Modal */}
      <WithdrawModal
        user={user}
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
      />
    </>
  );
}
