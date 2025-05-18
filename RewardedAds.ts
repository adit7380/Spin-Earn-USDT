// Function to trigger the rewarded interstitial ad
export function showRewardedInterstitial(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore - The show_9346819 function is defined by the included script in index.html
      window.show_9346819().then(() => {
        resolve();
      }).catch((error: any) => {
        console.error('Error showing rewarded interstitial ad:', error);
        reject(error);
      });
    } catch (error) {
      console.error('Failed to show rewarded interstitial ad:', error);
      reject(error);
    }
  });
}

// Function to trigger the rewarded popup ad
export function showRewardedPopup(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore - The show_9346819 function is defined by the included script in index.html
      window.show_9346819('pop').then(() => {
        resolve();
      }).catch((error: any) => {
        console.error('Error during playing ad:', error);
        // Still resolve even if there's an error, as this is non-critical
        resolve();
      });
    } catch (error) {
      console.error('Failed to show rewarded popup ad:', error);
      // Still resolve even if there's an error, as this is non-critical
      resolve();
    }
  });
}

// Function to initialize and configure the in-app interstitial ad
export function initInAppInterstitial(): void {
  try {
    // @ts-ignore - The show_9346819 function is defined by the included script in index.html
    window.show_9346819({
      type: 'inApp',
      inAppSettings: {
        frequency: 2,
        capping: 0.1,
        interval: 30,
        timeout: 5,
        everyPage: false
      }
    });
  } catch (error) {
    console.error('Failed to initialize in-app interstitial ad:', error);
  }
}

// Add the function to the global window object for TypeScript
declare global {
  interface Window {
    show_9346819: any;
  }
}