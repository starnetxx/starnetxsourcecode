export interface User {
  id: string;
  email: string;
  phone?: string;
  walletBalance: number;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  duration: string;
  price: number;
  dataAmount: string;
  type: '3-hour' | 'daily' | 'weekly' | 'monthly';
  popular?: boolean;
}

export interface Location {
  id: string;
  name: string;
  wifiName: string;
  username: string;
  password: string;
  isActive: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  planId: string;
  locationId: string;
  amount: number;
  purchaseDate: string;
  expiryDate: string;
  mikrotikCredentials: {
    username: string;
    password: string;
  };
  status: 'active' | 'expired' | 'used';
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  date: string;
  earnings: number;
}

export interface Credential {
  id: string;
  username: string;
  password: string;
  locationId: string;
  planType: '3-hour' | 'daily' | 'weekly' | 'monthly';
  status: 'available' | 'used';
  assignedUserId?: string;
  assignedPurchaseId?: string;
  assignedDate?: string;
  createdAt: string;
}