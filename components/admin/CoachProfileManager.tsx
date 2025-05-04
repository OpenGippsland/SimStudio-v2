import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface CoachProfile {
  id: number;
  user_id: string;
  hourly_rate: number;
  description: string;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  is_coach: boolean;
}

const CoachProfileManager: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<CoachProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state for editing
  const [editingProfile, setEditingProfile] = useState<CoachProfile | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number>(75);
  const [description, setDescription] = useState<string>('');
  
  // Form state for adding new profile
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newHourlyRate, setNewHourlyRate] = useState<number>(75);
  const [newDescription, setNewDescription] = useState<string>('');
  
  // Fetch coach profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/coach-profiles');
      
      if (!response.ok) {
        setError('Failed to fetch coach profiles');
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setProfiles(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching profiles');
      console.error('Error fetching coach profiles:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch users who can be coaches
  const fetchUsers = async () => {
    try {
      // Get all users
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        console.error('Failed to fetch users');
        return;
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
    }
  };
  
  // Load profiles and users on component mount
  useEffect(() => {
    fetchProfiles();
    fetchUsers();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProfile) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/coach-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: editingProfile.user_id,
          hourly_rate: hourlyRate,
          description: description,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update coach profile');
        setLoading(false);
        return;
      }
      
      setSuccess('Coach profile updated successfully');
      fetchProfiles();
      setEditingProfile(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the profile');
      console.error('Error updating coach profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Start editing a profile
  const handleEdit = (profile: CoachProfile) => {
    setEditingProfile(profile);
    setHourlyRate(profile.hourly_rate);
    setDescription(profile.description || '');
    setError(null);
    setSuccess(null);
  };
  
  // Cancel editing
  const handleCancel = () => {
    setEditingProfile(null);
    setError(null);
    setSuccess(null);
  };
  
  // Handle adding a new coach profile
  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/coach-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedUserId,
          hourly_rate: newHourlyRate,
          description: newDescription,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create coach profile');
        setLoading(false);
        return;
      }
      
      setSuccess('Coach profile created successfully');
      fetchProfiles();
      
      // Reset form
      setShowAddForm(false);
      setSelectedUserId('');
      setNewHourlyRate(75);
      setNewDescription('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the profile');
      console.error('Error creating coach profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle add form
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setError(null);
    setSuccess(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Coach Profiles</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleAddForm}
            className="px-4 py-2 bg-simstudio-yellow text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Coach'}
          </button>
          <button
            onClick={fetchProfiles}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          {success}
        </div>
      )}
      
      {/* Add Coach Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Coach Profile</h3>
          
          <form onSubmit={handleAddProfile} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Select User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                <option value="">-- Select a user --</option>
                {users
                  .filter(u => !profiles.some(p => p.user_id === u.id)) // Filter out users who already have profiles
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newHourlyRate}
                onChange={(e) => setNewHourlyRate(parseFloat(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={toggleAddForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-simstudio-yellow text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Coach'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Warning for users with is_coach=true but no profile */}
      {users.filter(u => u.is_coach && !profiles.some(p => p.user_id === u.id)).length > 0 && (
        <div className="p-4 mb-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
          <h3 className="font-bold mb-2">Users marked as coaches without profiles</h3>
          <p className="mb-3">The following users are marked as coaches but don't have coach profiles yet:</p>
          <ul className="list-disc pl-5 space-y-1">
            {users
              .filter(u => u.is_coach && !profiles.some(p => p.user_id === u.id))
              .map(user => (
                <li key={user.id}>
                  {user.name || 'Unnamed'} ({user.email}) - ID: {user.id}
                  <button
                    onClick={() => {
                      setSelectedUserId(user.id);
                      setShowAddForm(true);
                      setNewHourlyRate(75);
                      setNewDescription('');
                    }}
                    className="ml-3 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Create Profile
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
      
      {loading && !editingProfile && !showAddForm ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <>
          {/* Edit Form */}
          {editingProfile && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
              <h3 className="text-xl font-bold mb-4">
                Edit Coach Profile: {editingProfile.users.name}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-simstudio-yellow text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Profiles List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coach
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hourly Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No coach profiles found
                    </td>
                  </tr>
                ) : (
                  profiles.map((profile) => (
                    <tr key={profile.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {profile.users?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {profile.users?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${profile.hourly_rate.toFixed(2)}/hour
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {profile.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(profile)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CoachProfileManager;
