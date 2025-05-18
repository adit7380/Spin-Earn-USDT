import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Ad, User, Withdrawal } from "@shared/schema";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<"withdrawals" | "ads" | "broadcast">("withdrawals");
  
  // New ad form state
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    url: "",
    watchTime: 15,
    reward: 10,
    active: true
  });
  
  // Broadcast message state
  const [broadcastMessage, setBroadcastMessage] = useState("");
  
  // Fetch data when panel is open
  const { data: withdrawals = [], isLoading: loadingWithdrawals } = useQuery({
    queryKey: ["/api/admin/withdrawals/pending"],
    enabled: isOpen && tab === "withdrawals",
  });
  
  const { data: ads = [], isLoading: loadingAds } = useQuery({
    queryKey: ["/api/ads"],
    enabled: isOpen && tab === "ads",
  });
  
  const { data: userStats, isLoading: loadingUserStats } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isOpen,
  });
  
  // Handle withdrawal approval/rejection
  const updateWithdrawal = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/withdrawals/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals/pending"] });
      toast({
        title: "Success",
        description: "Withdrawal updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update withdrawal",
        variant: "destructive",
      });
    },
  });
  
  // Add new ad
  const addAd = useMutation({
    mutationFn: async (ad: Omit<Ad, "id" | "createdAt">) => {
      const response = await apiRequest("POST", "/api/admin/ads", ad);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ads"] });
      toast({
        title: "Success",
        description: "Ad added successfully",
      });
      
      // Reset form
      setNewAd({
        title: "",
        description: "",
        url: "",
        watchTime: 15,
        reward: 10,
        active: true
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add ad",
        variant: "destructive",
      });
    },
  });
  
  // Delete ad
  const deleteAd = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/ads/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ads"] });
      toast({
        title: "Success",
        description: "Ad deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete ad",
        variant: "destructive",
      });
    },
  });
  
  // Broadcast message
  const sendBroadcast = () => {
    toast({
      title: "Broadcast Sent",
      description: "Message sent to all users",
    });
    setBroadcastMessage("");
  };
  
  // Handle form input changes
  const handleAdInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAd((prev) => ({
      ...prev,
      [name]: name === "watchTime" || name === "reward" ? parseInt(value) : value,
    }));
  };
  
  // Handle form submission
  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    addAd.mutate(newAd);
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-4xl w-full h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 py-3 bg-primary text-white flex items-center justify-between sticky top-0 z-10">
          <DialogTitle className="text-lg font-bold">Admin Dashboard</DialogTitle>
          <button onClick={onClose} className="p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </DialogHeader>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-sm text-gray-500 mb-1">Total Users</h3>
              <p className="text-2xl font-bold">{userStats?.count || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-sm text-gray-500 mb-1">Pending Withdrawals</h3>
              <p className="text-2xl font-bold">{withdrawals.length}</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setTab("withdrawals")}
              className={`px-4 py-2 ${
                tab === "withdrawals"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600"
              }`}
            >
              Withdrawals
            </button>
            <button
              onClick={() => setTab("ads")}
              className={`px-4 py-2 ${
                tab === "ads"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600"
              }`}
            >
              Manage Ads
            </button>
            <button
              onClick={() => setTab("broadcast")}
              className={`px-4 py-2 ${
                tab === "broadcast"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600"
              }`}
            >
              Broadcast
            </button>
          </div>
          
          {/* Withdrawals Tab */}
          {tab === "withdrawals" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Pending Withdrawals</h3>
              
              {loadingWithdrawals ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : withdrawals.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <p className="text-gray-500">No pending withdrawals</p>
                </div>
              ) : (
                withdrawals.map((withdrawal: Withdrawal) => (
                  <div key={withdrawal.id} className="bg-white p-4 rounded-xl shadow mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">User ID: {withdrawal.userId}</h4>
                      </div>
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">{withdrawal.amount.toString()} USDT</p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Wallet (TRC20)</p>
                      <p className="text-sm font-mono bg-gray-50 p-2 rounded break-all">
                        {withdrawal.usdtWallet}
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Requested</p>
                      <p className="text-sm">{formatDate(withdrawal.createdAt)}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateWithdrawal.mutate({ id: withdrawal.id, status: "approved" })}
                        disabled={updateWithdrawal.isPending}
                        className="bg-secondary text-white px-4 py-2 rounded text-sm font-medium flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => updateWithdrawal.mutate({ id: withdrawal.id, status: "rejected" })}
                        disabled={updateWithdrawal.isPending}
                        className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* Ads Tab */}
          {tab === "ads" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Manage Ad Links</h3>
              
              <div className="bg-white p-4 rounded-xl shadow mb-4">
                <h4 className="font-medium mb-3">Add New Ad</h4>
                <form onSubmit={handleAddAd} className="space-y-3 mb-3">
                  <div>
                    <Label className="block text-sm text-gray-500 mb-1">Title</Label>
                    <Input
                      name="title"
                      value={newAd.title}
                      onChange={handleAdInputChange}
                      placeholder="Ad title"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-500 mb-1">Description</Label>
                    <Input
                      name="description"
                      value={newAd.description}
                      onChange={handleAdInputChange}
                      placeholder="Short description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-500 mb-1">URL</Label>
                    <Input
                      name="url"
                      type="url"
                      value={newAd.url}
                      onChange={handleAdInputChange}
                      placeholder="https://"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-500 mb-1">Watch Time (seconds)</Label>
                    <Input
                      name="watchTime"
                      type="number"
                      min="1"
                      value={newAd.watchTime}
                      onChange={handleAdInputChange}
                      placeholder="15"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-500 mb-1">Reward (coins)</Label>
                    <Input
                      name="reward"
                      type="number"
                      min="1"
                      value={newAd.reward}
                      onChange={handleAdInputChange}
                      placeholder="10"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={addAd.isPending}
                    className="bg-primary text-white px-4 py-2 rounded text-sm font-medium w-full"
                  >
                    {addAd.isPending ? "Adding..." : "Add Ad"}
                  </Button>
                </form>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow">
                <h4 className="font-medium mb-3">Existing Ads</h4>
                
                {loadingAds ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : ads.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No ads available</p>
                  </div>
                ) : (
                  ads.map((ad: Ad) => (
                    <div key={ad.id} className="border-b border-gray-100 py-3 flex justify-between items-center">
                      <div>
                        <h5 className="font-medium">{ad.title}</h5>
                        <p className="text-xs text-gray-500">{ad.url}</p>
                        <p className="text-xs text-gray-500">
                          <span>{ad.watchTime}</span>s | 
                          <span className="text-accent"> +<span>{ad.reward}</span></span>
                        </p>
                      </div>
                      <Button 
                        onClick={() => deleteAd.mutate(ad.id)}
                        disabled={deleteAd.isPending}
                        variant="ghost"
                        className="text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Broadcast Tab */}
          {tab === "broadcast" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Broadcast Message</h3>
              <div className="bg-white p-4 rounded-xl shadow">
                <Textarea 
                  placeholder="Write a message to send to all users..." 
                  rows={4} 
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
                />
                <Button 
                  onClick={sendBroadcast}
                  disabled={!broadcastMessage.trim()}
                  className="bg-primary text-white px-4 py-2 rounded text-sm font-medium w-full"
                >
                  Send to All Users
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
