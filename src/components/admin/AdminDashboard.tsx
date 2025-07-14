import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LocationManager } from './LocationManager';
import { TransactionsView } from './TransactionsView';
import { ReferralTracking } from './ReferralTracking';
import { CredentialManager } from './CredentialManager';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MapPin, DollarSign, Users, Wifi, Key } from 'lucide-react';

type AdminPage = 'overview' | 'locations' | 'credentials' | 'transactions' | 'referrals';

export const AdminDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<AdminPage>('overview');
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activePage) {
      case 'overview':
        return <AdminOverview />;
      case 'locations':
        return <LocationManager />;
      case 'credentials':
        return <CredentialManager />;
      case 'transactions':
        return <TransactionsView />;
      case 'referrals':
        return <ReferralTracking />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">StarNetX Admin</h1>
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            <Card className="p-4">
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: DollarSign },
                  { id: 'locations', label: 'Locations', icon: MapPin },
                  { id: 'credentials', label: 'Credentials', icon: Key },
                  { id: 'transactions', label: 'Transactions', icon: Wifi },
                  { id: 'referrals', label: 'Referrals', icon: Users },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id as AdminPage)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activePage === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOverview: React.FC = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    totalRevenue: 2450.00,
    totalUsers: 156,
    activeConnections: 23,
    totalLocations: 5,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Wifi className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Connections</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeConnections}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLocations}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New user registration', time: '2 minutes ago' },
              { action: 'Plan purchased - StarNetX 1', time: '15 minutes ago' },
              { action: 'Location added - StarNetX 5', time: '1 hour ago' },
              { action: 'Referral completed', time: '2 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="text-gray-900">{activity.action}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Plans</h3>
          <div className="space-y-3">
            {[
              { plan: 'Daily Essential', purchases: 45, percentage: 65 },
              { plan: 'Weekly Standard', purchases: 23, percentage: 33 },
              { plan: 'Monthly Premium', purchases: 12, percentage: 17 },
              { plan: 'Quick Browse', purchases: 8, percentage: 12 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-900">{item.plan}</span>
                  <span className="text-sm text-gray-600">{item.purchases} purchases</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};