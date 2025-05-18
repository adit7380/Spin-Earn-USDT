import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adType: 
    | 'banner300x250'
    | 'banner468x60' 
    | 'banner160x300' 
    | 'banner320x50' 
    | 'banner160x600' 
    | 'banner728x90'
    | 'nativeBanner';
  className?: string;
}

export default function AdBanner({ adType, className = '' }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adScriptLoaded = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current || adScriptLoaded.current) return;
    
    // Set flag to prevent duplicate loading
    adScriptLoaded.current = true;
    
    // Create container for native banner if needed
    if (adType === 'nativeBanner') {
      const containerId = "container-832bec0e0c2940a0219b54e5a7dd079f";
      const container = document.createElement('div');
      container.id = containerId;
      containerRef.current.appendChild(container);
    }
    
    // Create and inject the script based on ad type
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    switch (adType) {
      case 'banner300x250':
        script.innerHTML = `
          atOptions = {
            'key' : 'd6f6585b4c2596fd0e8732e239518d29',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        `;
        script.src = "//www.highperformanceformat.com/d6f6585b4c2596fd0e8732e239518d29/invoke.js";
        break;
        
      case 'banner468x60':
        script.innerHTML = `
          atOptions = {
            'key' : '0ad0f05a9560f63390da830e31edcdfd',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
          };
        `;
        script.src = "//www.highperformanceformat.com/0ad0f05a9560f63390da830e31edcdfd/invoke.js";
        break;
        
      case 'banner160x300':
        script.innerHTML = `
          atOptions = {
            'key' : 'd583b363eaf59ab05166f27897a22c03',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        `;
        script.src = "//www.highperformanceformat.com/d583b363eaf59ab05166f27897a22c03/invoke.js";
        break;
        
      case 'banner320x50':
        script.innerHTML = `
          atOptions = {
            'key' : '78d9766c36337e9f612a67af56949d3b',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        `;
        script.src = "//www.highperformanceformat.com/78d9766c36337e9f612a67af56949d3b/invoke.js";
        break;
        
      case 'banner160x600':
        script.innerHTML = `
          atOptions = {
            'key' : 'eeaa0f3cc483198053905c795e2f40eb',
            'format' : 'iframe',
            'height' : 600,
            'width' : 160,
            'params' : {}
          };
        `;
        script.src = "//www.highperformanceformat.com/eeaa0f3cc483198053905c795e2f40eb/invoke.js";
        break;
        
      case 'banner728x90':
        script.innerHTML = `
          atOptions = {
            'key' : '7c88c9131f8c61918dfc2bd4b7d2d50f',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `;
        script.src = "//www.highperformanceformat.com/7c88c9131f8c61918dfc2bd4b7d2d50f/invoke.js";
        break;
        
      case 'nativeBanner':
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = "//pl26673578.profitableratecpm.com/832bec0e0c2940a0219b54e5a7dd079f/invoke.js";
        break;
    }
    
    // Append the script to the container
    containerRef.current.appendChild(script);
    
    // Cleanup function
    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
        adScriptLoaded.current = false;
      }
    };
  }, [adType]);
  
  // Calculate dimensions based on ad type for proper spacing
  let dimensions = '';
  switch (adType) {
    case 'banner300x250':
      dimensions = 'w-[300px] h-[250px]';
      break;
    case 'banner468x60':
      dimensions = 'w-[468px] h-[60px]';
      break;
    case 'banner160x300':
      dimensions = 'w-[160px] h-[300px]';
      break;
    case 'banner320x50':
      dimensions = 'w-[320px] h-[50px]';
      break;
    case 'banner160x600':
      dimensions = 'w-[160px] h-[600px]';
      break;
    case 'banner728x90':
      dimensions = 'w-[728px] h-[90px]';
      break;
    case 'nativeBanner':
      dimensions = 'w-full'; // Native banner is responsive
      break;
  }

  return (
    <div 
      ref={containerRef} 
      className={`ad-container ${dimensions} mx-auto overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}
    >
      <div className="text-xs text-gray-400">Advertisement</div>
    </div>
  );
}