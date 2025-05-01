import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: number;
  email: string;
  name?: string;
  is_coach?: boolean;
  is_admin?: boolean;
  simulator_hours: number;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [needsMigration, setNeedsMigration] = useState(false)
  const [runningMigration, setRunningMigration] = useState(false)

  // Form state for editing user
  const [formData, setFormData] = useState({
    name: '',
    is_coach: false,
    is_admin: false
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
      setNeedsMigration(false)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(term) || 
        (user.name && user.name.toLowerCase().includes(term)) ||
        user.id.toString().includes(term)
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleEditClick = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      is_coach: user.is_coach || false,
      is_admin: user.is_admin || false
    })
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'User deleted successfully' })
        fetchUsers() // Refresh the user list
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to delete user' })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      setMessage({ type: 'error', text: 'An error occurred while deleting the user' })
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const response = await fetch(`/api/users?id=${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setMessage({ type: 'success', text: 'User updated successfully' })
        setEditingUser(null)
        fetchUsers() // Refresh the user list
      } else {
        const error = await response.json()
        
        // Check if we need to run the migration
        if (error.needsMigration) {
          setNeedsMigration(true)
          setMessage({ type: 'error', text: 'User columns not set up. Please run the migration first.' })
        } else {
          setMessage({ type: 'error', text: error.error || 'Failed to update user' })
        }
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setMessage({ type: 'error', text: 'An error occurred while updating the user' })
    }
  }

  const handleCancel = () => {
    setEditingUser(null)
    setMessage(null)
  }

  const runMigration = async () => {
    setRunningMigration(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/migrations/run-user-roles-migration', {
        method: 'POST'
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Migration completed successfully. User roles are now available.' })
        setNeedsMigration(false)
        fetchUsers() // Refresh the user list
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to run migration' })
      }
    } catch (error) {
      console.error('Error running migration:', error)
      setMessage({ type: 'error', text: 'An error occurred while running the migration' })
    } finally {
      setRunningMigration(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        <div className="flex space-x-2">
          {needsMigration && (
            <button 
              onClick={runMigration}
              disabled={runningMigration}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mr-2"
            >
              {runningMigration ? 'Running Migration...' : 'Run Migration'}
            </button>
          )}
          <button 
            onClick={fetchUsers}
            className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg"
          >
            {loading ? 'Refreshing...' : 'Refresh Users'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name, email or ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
          />
          <div className="absolute left-3 top-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Edit User: {editingUser.email}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="flex flex-col justify-end">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="is_coach"
                    checked={formData.is_coach}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label className="text-gray-700">Coach</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_admin"
                    checked={formData.is_admin}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label className="text-gray-700">Admin</label>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg"
              >
                Save Changes
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Users Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Admin</th>
                <th className="p-2 text-left">Coach</th>
                <th className="p-2 text-left">Credits</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.name || '-'}</td>
                  <td className="p-2">
                    {user.is_admin ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {user.is_coach ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-2">{user.simulator_hours} hours</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-simstudio-yellow hover:text-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No users found matching your search.</p>
        </div>
      )}
    </div>
  )
}
