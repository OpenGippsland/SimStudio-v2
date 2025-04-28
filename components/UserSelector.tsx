import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  simulator_hours: number;
  is_admin?: boolean;
}

interface UserSelectorProps {
  selectedUserId: string | undefined;
  onUserSelect: (userId: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ selectedUserId, onUserSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminSelected, setIsAdminSelected] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        let usersData = await response.json();
        
        // Add admin user if not present
        if (!usersData.some((user: User) => user.is_admin)) {
          usersData = [
            ...usersData,
            {
              id: 'admin',
              name: 'Admin User',
              email: 'admin@simstudio.com.au',
              simulator_hours: 999,
              is_admin: true
            }
          ];
        }
        
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Check if selected user is admin
  useEffect(() => {
    if (selectedUserId) {
      const selectedUser = users.find(user => user.id === selectedUserId);
      setIsAdminSelected(!!selectedUser?.is_admin);
    } else {
      setIsAdminSelected(false);
    }
  }, [selectedUserId, users]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    onUserSelect(userId);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-grow">
          <label htmlFor="user-select" className="block text-gray-700 font-medium mb-2">
            Select User:
          </label>
          <select
            id="user-select"
            value={selectedUserId || ''}
            onChange={handleUserChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-simstudio-yellow focus:border-simstudio-yellow"
            disabled={loading}
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} {user.is_admin ? '(Admin)' : `(${user.simulator_hours} hours)`}
              </option>
            ))}
          </select>
        </div>
        
        {isAdminSelected && (
          <div className="flex-shrink-0 md:self-end">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold mb-3 text-simstudio-yellow">Admin Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin/bookings" className="text-gray-700 hover:text-simstudio-yellow transition-colors">
                    Manage Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/admin/users" className="text-gray-700 hover:text-simstudio-yellow transition-colors">
                    Manage Users
                  </Link>
                </li>
                <li>
                  <Link href="/admin/coaches" className="text-gray-700 hover:text-simstudio-yellow transition-colors">
                    Manage Coaches
                  </Link>
                </li>
                <li>
                  <Link href="/admin/settings" className="text-gray-700 hover:text-simstudio-yellow transition-colors">
                    System Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelector;
