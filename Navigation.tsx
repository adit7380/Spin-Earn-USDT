import { useLocation, Link } from "wouter";
import { Home, RefreshCw, Wallet2, Users } from "lucide-react";

interface NavigationProps {
  activeTab: "home" | "spin" | "wallet" | "referrals";
}

export function Navigation({ activeTab }: NavigationProps) {
  const [, navigate] = useLocation();
  
  const tabs = [
    {
      name: "Home",
      icon: Home,
      path: "/",
      key: "home"
    },
    {
      name: "Spin",
      icon: RefreshCw,
      path: "/spin",
      key: "spin"
    },
    {
      name: "Wallet",
      icon: Wallet2,
      path: "/wallet",
      key: "wallet"
    },
    {
      name: "Referrals",
      icon: Users,
      path: "/referrals",
      key: "referrals"
    }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 z-10 max-w-md mx-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.path}
          className={`flex flex-col items-center justify-center w-16 py-1 ${
            activeTab === tab.key ? "text-primary" : "text-gray-500"
          }`}
        >
          <tab.icon className="h-6 w-6" />
          <span className="text-xs mt-1">{tab.name}</span>
        </Link>
      ))}
    </nav>
  );
}

export default Navigation;
