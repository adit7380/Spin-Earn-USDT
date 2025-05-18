import { User } from "@shared/schema";

// Set up the Telegram WebApp button if it exists
export const setupTelegramMainButton = (
  text: string, 
  callback: () => void
): (() => void) => {
  if (window.Telegram?.WebApp) {
    const { MainButton } = window.Telegram.WebApp;
    
    MainButton.text = text;
    MainButton.onClick(callback);
    MainButton.show();
    
    return () => {
      MainButton.offClick(callback);
      MainButton.hide();
    };
  }
  
  return () => {};
};

// Get the Telegram user data if available
export const getTelegramUser = (): { 
  id: number, 
  first_name: string, 
  last_name?: string, 
  username?: string 
} | null => {
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  
  return null;
};

// Format coins to USDT value
export const coinsToUsdt = (coins: number): string => {
  const CONVERSION_RATE = 50000; // 50,000 coins = 1 USDT
  return (coins / CONVERSION_RATE).toFixed(4);
};

// Format time remaining (e.g., for spin cooldown)
export const formatTimeRemaining = (date: Date | null): string => {
  if (!date) return "Now";
  
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Now";
  
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (diffHrs > 0) {
    return `${diffHrs}h ${diffMins}m`;
  } else if (diffMins > 0) {
    return `${diffMins}m ${diffSecs}s`;
  } else {
    return `${diffSecs}s`;
  }
};

// Create a share URL for the referral system
export const createShareUrl = (user: User): string => {
  return `https://t.me/SpinEarnUSDTBot?start=${user.referralCode}`;
};

// Share referral link via Telegram
export const shareReferralViaApp = (user: User): void => {
  if (window.Telegram?.WebApp) {
    // This would work in a real Telegram Bot environment
    // But for now we'll just copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(createShareUrl(user));
    }
  }
};

// Copy text to clipboard with fallback
export const copyToClipboard = (text: string): boolean => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return true;
  }
  
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (e) {
    console.error('Failed to copy text:', e);
    return false;
  }
};
