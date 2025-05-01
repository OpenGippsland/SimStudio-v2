import React, { useState, useEffect } from 'react'

interface Package {
  id: number;
  name: string;
  hours: number;
  price: number;
  description: string;
  is_active: number;
}

export default function PackageManager() {
  const [packages, setPackages] = useState<Package[]>([])
  const [formData, setFormData] = useState({
    name: '',
    hours: 1,
    price: 99.99,
    description: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (!response.ok) {
        throw new Error('Failed to fetch packages')
      }
      const data = await response.json()
      setPackages(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching packages:', error)
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hours' || name === 'price' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const url = editingId ? `/api/packages?id=${editingId}` : '/api/packages'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save package')
      }

      setMessage(editingId ? 'Package updated successfully' : 'Package created successfully')
      setFormData({
        name: '',
        hours: 1,
        price: 99.99,
        description: ''
      })
      setEditingId(null)
      fetchPackages()
    } catch (err) {
      setMessage(err instanceof Error ? `Error: ${err.message}` : 'An unknown error occurred')
    }
  }

  const handleEdit = (pkg: Package) => {
    setFormData({
      name: pkg.name,
      hours: pkg.hours,
      price: pkg.price,
      description: pkg.description || ''
    })
    setEditingId(pkg.id)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/packages?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete package')
      }

      setMessage('Package deactivated successfully')
      fetchPackages()
    } catch (err) {
      setMessage(err instanceof Error ? `Error: ${err.message}` : 'An unknown error occurred')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      hours: 1,
      price: 99.99,
      description: ''
    })
    setEditingId(null)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Package Management</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Current Packages</h3>
        {loading ? (
          <p className="text-gray-500">Loading packages...</p>
        ) : packages.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Hours</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} className="border-b">
                  <td className="p-2">{pkg.name}</td>
                  <td className="p-2">{pkg.hours}</td>
                  <td className="p-2">${pkg.price.toFixed(2)}</td>
                  <td className="p-2">{pkg.description || '-'}</td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="text-simstudio-yellow hover:text-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No packages available</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-medium mb-2">
          {editingId ? 'Edit Package' : 'Add New Package'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Hours</label>
            <input
              type="number"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              min="1"
              step="1"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg"
          >
            {editingId ? 'Update Package' : 'Add Package'}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
        
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
