import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize Telegram WebApp if running within Telegram
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        MainButton: {
          text: string;
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        close: () => void;
      };
    };
  }
}

// Check if running in Telegram WebApp
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
}

createRoot(document.getElementById("root")!).render(<App />);
