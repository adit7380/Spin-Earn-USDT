import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SpinPage from "@/pages/SpinPage";
import WalletPage from "@/pages/WalletPage";
import ReferralsPage from "@/pages/ReferralsPage";
import AdminPage from "@/pages/AdminPage";
import PopunderAd from "@/components/ads/PopunderAd";
import { initInAppInterstitial } from "@/components/ads/RewardedAds";
import { useState, useEffect } from "react";
import { User } from "@shared/schema";

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would validate the Telegram WebApp data
    // and fetch the user from the API
    const fetchUser = async () => {
      try {
        // For demo purposes, just check if we're running in Telegram WebApp
        const isInTelegram = !!window.Telegram?.WebApp;
        
        if (isInTelegram) {
          const { id, first_name, last_name, username } = window.Telegram.WebApp.initDataUnsafe.user || {};
          
          if (id) {
            // Try to authenticate with the backend
            const response = await fetch('/api/auth/telegram', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                initData: window.Telegram.WebApp.initData,
                referralCode: new URLSearchParams(window.location.search).get('start')
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
            }
          }
        } else {
          // For development, create a mock user
          setUser({
            id: 1,
            telegramId: '15492563',
            username: 'john_doe',
            firstName: 'John',
            lastName: 'Doe',
            coins: 24516,
            usdtWallet: null,
            referralCode: 'r15492563',
            referrerId: null,
            lastSpin: new Date(),
            spinsLeft: 10,
            referralEarnings: 145,
            totalEarned: "0.4903",
            banned: false,
            createdAt: new Date()
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Spin & Earn USDT</h1>
          <p className="mb-6 text-gray-600">This application works inside Telegram. Please open it via the Telegram Bot.</p>
          <a 
            href="https://t.me/SpinEarnUSDTBot"
            className="bg-[#0088cc] text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2a10 10 0 110 20 10 10 0 010-20zm3.224 6.62l-5.446 2.58c-.035.016-.065.045-.078.08l-.899 3.36c-.05.187.1.358.287.311l1.83-.463a.23.23 0 01.206.046l2.104 1.846c.096.085.239.085.335 0l4.43-3.882c.257-.225.257-.619 0-.844l-2.609-2.28c-.029-.026-.066-.04-.104-.04-.023 0-.047.005-.068.014z"/>
            </svg>
            Open in Telegram
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container bg-white">
      <Switch>
        <Route path="/" component={() => <Home user={user} setUser={setUser} />} />
        <Route path="/spin" component={() => <SpinPage user={user} setUser={setUser} />} />
        <Route path="/wallet" component={() => <WalletPage user={user} setUser={setUser} />} />
        <Route path="/referrals" component={() => <ReferralsPage user={user} setUser={setUser} />} />
        <Route path="/admin" component={() => <AdminPage />} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  // Initialize the in-app interstitial ad on component mount
  useEffect(() => {
    try {
      // Initialize the in-app interstitial that will show automatically
      // based on the configured frequency and other settings
      initInAppInterstitial();
      console.log('In-app interstitial ads initialized');
    } catch (error) {
      console.error('Failed to initialize in-app interstitial ads:', error);
      // Silently handle errors - don't disrupt the application
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <PopunderAd />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
