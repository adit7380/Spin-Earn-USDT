import { useEffect } from 'react';

// Direct link ad component that opens a monetized ad link
export default function DirectLinkAd() {
  useEffect(() => {
    try {
      // Open the direct link ad in a new tab
      const adWindow = window.open('https://www.profitableratecpm.com/d8z3hap7?key=bfa38a61c4ae17e7fd685c77e08aad98', '_blank');
      
      // Focus the window to ensure the ad is seen (required by some ad networks)
      if (adWindow) {
        adWindow.focus();
      }
    } catch (error) {
      console.error("Failed to open ad:", error);
      // Silent failure - don't disturb user experience
    }
  }, []);
  
  return null; // This component doesn't render anything visible
}