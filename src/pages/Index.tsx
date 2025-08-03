import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { WorkerDashboard } from "@/components/dashboard/WorkerDashboard";

const Index = () => {
  const [user, setUser] = useState<{ email: string; role: 'owner' | 'worker' } | null>(null);

  const handleLogin = (email: string, role: 'owner' | 'worker') => {
    setUser({ email, role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.role === 'owner') {
    return <OwnerDashboard userEmail={user.email} onLogout={handleLogout} />;
  }

  return <WorkerDashboard userEmail={user.email} onLogout={handleLogout} />;
};

export default Index;
