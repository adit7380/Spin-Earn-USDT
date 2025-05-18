import { useEffect } from 'react';

// This component loads the popunder ad script
export default function PopunderAd() {
  useEffect(() => {
    // Create and add the popunder script to the document head
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl26673528.profitableratecpm.com/9d/ca/53/9dca53e0c04a6f4601ec7a3ea75c4fd5.js';
    
    // Append to document head
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  return null; // This component doesn't render anything visible
}