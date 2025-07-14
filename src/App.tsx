import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { AuthForm } from './components/auth/AuthForm';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

function AppContent() {
  const { user, isAdmin } = useAuth();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (user) {
    return <UserDashboard />;
  }

  // Check if we're trying to access admin
  const isAdminRoute = window.location.pathname.includes('/admin');
  
  return <AuthForm isAdmin={isAdminRoute} />;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;