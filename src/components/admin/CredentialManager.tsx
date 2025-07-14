import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useData } from '../../contexts/DataContext';
import { Credential } from '../../types';
import { Key, Plus, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';

export const CredentialManager: React.FC = () => {
  const { 
    locations, 
    plans, 
    credentials, 
    addCredential, 
    updateCredentialStatus, 
    deleteCredential, 
    getCredentialsByLocation 
  } = useData();
  
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [bulkCredentials, setBulkCredentials] = useState('');

  const filteredCredentials = selectedLocation 
    ? getCredentialsByLocation(selectedLocation, selectedPlanType || undefined)
    : credentials;

  const availableCount = filteredCredentials.filter(c => c.status === 'available').length;
  const usedCount = filteredCredentials.filter(c => c.status === 'used').length;

  const handleAddCredentials = () => {
    if (!selectedLocation || !selectedPlanType) {
      alert('Please select both location and plan type');
      return;
    }

    const lines = bulkCredentials.trim().split('\n');
    let addedCount = 0;

    lines.forEach(line => {
      const [username, password] = line.trim().split(/\s+/);
      if (username && password) {
        // Check if credential already exists
        const exists = credentials.some(c => 
          c.username === username && c.locationId === selectedLocation
        );
        
        if (!exists) {
          addCredential({
            username,
            password,
            locationId: selectedLocation,
            planType: selectedPlanType as any,
            status: 'available',
          });
          addedCount++;
        }
      }
    });

    setBulkCredentials('');
    setShowAddForm(false);
    alert(`Added ${addedCount} new credentials`);
  };

  const getLocationName = (locationId: string) => {
    return locations.find(l => l.id === locationId)?.name || 'Unknown Location';
  };

  const getPlanTypeName = (planType: string) => {
    const plan = plans.find(p => p.type === planType);
    return plan ? plan.name : planType;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Credential Pool Manager</h2>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center gap-2"
          disabled={!selectedLocation || !selectedPlanType}
        >
          <Plus size={16} />
          Add Credentials
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Filter Credentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Type
            </label>
            <select
              value={selectedPlanType}
              onChange={(e) => setSelectedPlanType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Plan Types</option>
              <option value="3-hour">3-Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Credentials</p>
              <p className="text-2xl font-bold text-gray-900">{filteredCredentials.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Use</p>
              <p className="text-2xl font-bold text-gray-900">{usedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Credentials Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Credentials 
          {selectedLocation && (
            <span className="text-sm font-normal text-gray-600">
              - {getLocationName(selectedLocation)}
              {selectedPlanType && ` (${getPlanTypeName(selectedPlanType)})`}
            </span>
          )}
        </h3>
        
        {filteredCredentials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No credentials found. Add some credentials to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Username</th>
                  <th className="text-left py-3">Password</th>
                  <th className="text-left py-3">Location</th>
                  <th className="text-left py-3">Plan Type</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Assigned User</th>
                  <th className="text-left py-3">Assigned Date</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCredentials.map((credential) => (
                  <tr key={credential.id} className="border-b">
                    <td className="py-3 font-mono">{credential.username}</td>
                    <td className="py-3 font-mono">{credential.password}</td>
                    <td className="py-3">{getLocationName(credential.locationId)}</td>
                    <td className="py-3">{getPlanTypeName(credential.planType)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                        credential.status === 'available' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {credential.status === 'available' ? (
                          <CheckCircle size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {credential.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {credential.assignedUserId ? (
                        <span className="text-sm text-gray-600">
                          {credential.assignedUserId.slice(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3">
                      {credential.assignedDate ? (
                        <span className="text-sm text-gray-600">
                          {new Date(credential.assignedDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {credential.status === 'used' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCredentialStatus(credential.id, 'available')}
                          >
                            Release
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteCredential(credential.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Credentials Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Add Credentials</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location: {getLocationName(selectedLocation)}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Type: {getPlanTypeName(selectedPlanType)}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credentials (one per line: username password)
                </label>
                <textarea
                  value={bulkCredentials}
                  onChange={(e) => setBulkCredentials(e.target.value)}
                  placeholder={`user001 pass001
user002 pass002
user003 pass003`}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: username password (separated by space)
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddCredentials} className="flex-1">
                Add Credentials
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};