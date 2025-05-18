import { User } from "@shared/schema";
import { useState } from "react";
import { AlertCircle, HelpCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UserHeaderProps {
  user: User;
}

export default function UserHeader({ user }: UserHeaderProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefreshBalance = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    
    try {
      // This would normally make an API call to refresh the user data
      // For now, we'll just show a toast
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Balance Updated",
        description: "Your balance is up to date.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh balance.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleOpenHelp = () => {
    // Open help info
    toast({
      title: "How to Earn",
      description: "Spin the wheel, watch ads, and refer friends to earn coins!",
    });
  };

  return (
    <header className="bg-primary text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        {/* User avatar */}
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold mr-3">
          {user.firstName.charAt(0)}
          {user.lastName ? user.lastName.charAt(0) : ''}
        </div>
        <div>
          <h1 className="font-semibold">
            {user.firstName} {user.lastName || ''}
          </h1>
          <p className="text-xs opacity-80">ID: {user.telegramId}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleRefreshBalance} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Refresh balance"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
        <button 
          onClick={handleOpenHelp} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Help information"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
