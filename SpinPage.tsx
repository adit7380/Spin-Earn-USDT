import { useState } from "react";
import { User } from "@shared/schema";
import UserHeader from "@/components/UserHeader";
import Navigation from "@/components/Navigation";
import SpinWheel from "@/components/SpinWheel";
import { useQuery } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";

interface SpinPageProps {
  user: User;
  setUser: (user: User) => void;
}

export default function SpinPage({ user, setUser }: SpinPageProps) {
  // Fetch previous spin results
  const { data: spinResults = [], isLoading } = useQuery({
    queryKey: [`/api/user/${user.id}/spins`],
  });

  const handleSpinComplete = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <>
      <UserHeader user={user} />

      <main className="flex-1 overflow-auto p-4 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Spin & Win</h1>
          <p className="text-gray-600 text-sm mb-4">
            Spin the wheel to win coins! You can spin once every hour, and you have {user.spinsLeft} spins left today.
          </p>
        </div>

        {/* Spin Wheel Section */}
        <SpinWheel user={user} onSpinComplete={handleSpinComplete} />

        {/* Previous Spins */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold px-1 mb-3">Recent Spins</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <LoaderPinwheel className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : spinResults.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow text-center">
              <p className="text-gray-500">No spin history yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="space-y-3">
                {spinResults.map((spin: any) => (
                  <div key={spin.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(spin.createdAt).toLocaleDateString()} {new Date(spin.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium flex items-center">
                        +{spin.reward}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Navigation activeTab="spin" />
    </>
  );
}
