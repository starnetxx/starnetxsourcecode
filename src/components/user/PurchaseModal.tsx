import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plan, Location } from '../../types';

interface PurchaseModalProps {
  plan: Plan;
  onClose: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ plan, onClose }) => {
  const { locations, purchasePlan } = useData();
  const { user, updateWalletBalance } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [purchase, setPurchase] = useState<any>(null);

  const handlePurchase = () => {
    if (!selectedLocation || !user) return;

    if (user.walletBalance < plan.price) {
      alert('Insufficient balance. Please top up your wallet.');
      return;
    }

    const newPurchase = purchasePlan(plan.id, selectedLocation.id, user.id);
    if (!newPurchase) {
      alert('Sorry, this plan is currently out of login slots. Please try again later or choose another plan/location.');
      return;
    }
    
    if (newPurchase) {
      updateWalletBalance(-plan.price);
      setPurchase(newPurchase);
      setShowReceipt(true);
    }
  };

  if (showReceipt && purchase) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
            <p className="text-gray-600">Your plan is now active</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Plan Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span>{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data:</span>
                  <span>{plan.dataAmount} GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{plan.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>₦{plan.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-900">WiFi Connection</h3>
              <p className="text-sm text-blue-800 mb-2">
                Make sure you're connected to the WiFi: <span className="font-medium">{selectedLocation?.wifiName}</span>
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Username:</span>
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    {purchase.mikrotikCredentials.username}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Password:</span>
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    {purchase.mikrotikCredentials.password}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Continue
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Purchase Plan</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{plan.name}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Data: {plan.dataAmount} GB</p>
              <p>Duration: {plan.duration}</p>
              <p className="text-lg font-bold text-gray-900">Price: ₦{plan.price.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Select Location</h3>
            <div className="space-y-2">
              {locations.filter(loc => loc.isActive).map((location) => (
                <label
                  key={location.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    selectedLocation?.id === location.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="location"
                    value={location.id}
                    checked={selectedLocation?.id === location.id}
                    onChange={() => setSelectedLocation(location)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-gray-600">WiFi: {location.wifiName}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {selectedLocation && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Make sure you're connected to the WiFi: "{selectedLocation.wifiName}" 
                before using your credentials.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={!selectedLocation || (user?.walletBalance || 0) < plan.price}
            className="flex-1"
          >
            Purchase
          </Button>
        </div>

        {user && user.walletBalance < plan.price && (
          <p className="text-red-600 text-sm text-center mt-2">
            Insufficient balance. Current: ₦{user.walletBalance.toFixed(2)}
          </p>
        )}
      </Card>
    </div>
  );
};