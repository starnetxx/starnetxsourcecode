import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Copy, Users, DollarSign } from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralUrl = `https://starnetx.com/signup?ref=${user?.referralCode}`;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock referral data - in real app, this would come from API
  const referralStats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 48.00,
    pendingEarnings: 16.00,
  };

  const recentReferrals = [
    { id: 1, email: 'john@example.com', date: '2024-01-15', status: 'active', earnings: 4.00 },
    { id: 2, email: 'sarah@example.com', date: '2024-01-14', status: 'pending', earnings: 4.00 },
    { id: 3, email: 'mike@example.com', date: '2024-01-13', status: 'active', earnings: 4.00 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite Friends</h1>
        <p className="text-gray-600">
          Earn ₦4 for every friend who signs up and makes their first purchase
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Your Referral Code</h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Referral Code</p>
              <p className="text-xl font-mono font-bold text-blue-600">
                {user?.referralCode}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferralCode}
              className="flex items-center gap-2"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Share this link:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferralCode}
            >
              Copy
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{referralStats.totalReferrals}</p>
              <p className="text-sm text-gray-600">Total Referrals</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₦{referralStats.totalEarnings.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Referrals</h2>
        <div className="space-y-3">
          {recentReferrals.map((referral) => (
            <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{referral.email}</p>
                <p className="text-sm text-gray-600">{referral.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₦{referral.earnings.toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  referral.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {referral.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">How it Works</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Share your referral code</p>
              <p className="text-sm text-gray-600">Send your unique link to friends and family</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium">They sign up and purchase</p>
              <p className="text-sm text-gray-600">Your friend creates an account and buys their first plan</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium">You both earn rewards</p>
              <p className="text-sm text-gray-600">Get ₦4 credited to your wallet automatically</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};