import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useData } from '../../contexts/DataContext';
import { Purchase } from '../../types';
import { Calendar, DollarSign, Filter } from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { getAllPurchases, plans, locations } = useData();
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  const allPurchases = getAllPurchases();
  
  const filteredPurchases = allPurchases.filter(purchase => {
    const locationMatch = !filterLocation || purchase.locationId === filterLocation;
    const dateMatch = !filterDate || purchase.purchaseDate.startsWith(filterDate);
    return locationMatch && dateMatch;
  });

  const totalRevenue = filteredPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Transactions & Analytics</h2>
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <span className="text-sm text-gray-600">
            {filteredPurchases.length} transactions
          </span>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-green-700">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">₦{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-blue-700">Transactions</p>
                <p className="text-2xl font-bold text-blue-900">{filteredPurchases.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <DollarSign className="text-purple-600" size={24} />
              <div>
                <p className="text-sm text-purple-700">Average Order</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₦{filteredPurchases.length > 0 ? (totalRevenue / filteredPurchases.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Location
            </label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Filter by Date"
            type="date"
            value={filterDate}
            onChange={setFilterDate}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">User</th>
                <th className="text-left py-3">Plan</th>
                <th className="text-left py-3">Location</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => {
                const plan = plans.find(p => p.id === purchase.planId);
                const location = locations.find(l => l.id === purchase.locationId);
                
                return (
                  <tr key={purchase.id} className="border-b">
                    <td className="py-3">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="py-3">{purchase.userId.slice(0, 8)}...</td>
                    <td className="py-3">{plan?.name || 'Unknown'}</td>
                    <td className="py-3">{location?.name || 'Unknown'}</td>
                    <td className="py-3 font-semibold">₦{purchase.amount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        purchase.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : purchase.status === 'expired'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredPurchases.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found for the selected filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};