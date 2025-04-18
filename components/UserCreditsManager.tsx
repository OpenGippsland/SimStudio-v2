import React, { useState, useEffect } from 'react'

interface User {
  id: number;
  email: string;
  simulator_hours: number;
}

export default function UserCreditsManager() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [creditAmount, setCreditAmount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!selectedUserId) {
      setMessage('Error: Please select a user')
      return
    }

    try {
      const response = await fetch(`/api/user-credits?userId=${selectedUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          simulator_hours: creditAmount
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update credits')
      }

      const data = await response.json()
      
      // Update the user in the users array with the new credit amount
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id.toString() === selectedUserId 
            ? { ...user, simulator_hours: data.credits.simulator_hours } 
            : user
        )
      )

      setMessage('Credits updated successfully')
      setSelectedUserId('')
      setCreditAmount(1)
    } catch (err) {
      setMessage(err instanceof Error ? `Error: ${err.message}` : 'An unknown error occurred')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">User Credits Management</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Current User Credits</h3>
        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Simulator Hours</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.simulator_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No users available</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-medium mb-2">Update User Credits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.email} (Current: {user.simulator_hours} hours)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Simulator Hours</label>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(parseInt(e.target.value))}
              min="0"
              step="1"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              This will set the user's total hours to this value (not add to existing)
            </p>
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Update Credits
        </button>
        
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
