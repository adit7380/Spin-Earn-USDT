import { useState, useEffect } from "react";
import { useLocation, useHistory } from "wouter";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    // Check local storage for admin token
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken === "admin_authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin authentication for demo purposes
    // In a real app, this would make an API call
    if (password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_token", "admin_authenticated");
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleOpenPanel = () => {
    setShowAdminPanel(true);
  };

  const handleBackToMain = () => {
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Enter your admin password to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToMain}
                  className="flex items-center gap-1"
                >
                  Back to App
                </Button>
                <Button type="submit" className="bg-primary text-white">
                  Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>
            Manage withdrawals, ads, and broadcast messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Welcome to the admin dashboard. From here, you can approve or reject withdrawal requests,
              manage ad links, and send broadcast messages to all users.
            </p>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBackToMain}
                className="flex items-center gap-1"
              >
                Back to App
              </Button>
              <Button
                onClick={handleOpenPanel}
                className="bg-primary text-white"
              >
                Open Admin Panel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </div>
  );
}
