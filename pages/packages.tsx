import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Package {
  id: number;
  name: string;
  hours: number;
  price: number;
  description: string;
}

interface User {
  id: number;
  email: string;
  simulator_hours: number;
}

export default function PackagesPage() {
  const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch packages and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages
        const packagesResponse = await fetch('/api/packages')
        if (!packagesResponse.ok) {
          throw new Error('Failed to fetch packages')
        }
        const packagesData = await packagesResponse.json()
        setPackages(packagesData)

        // Fetch users
        const usersResponse = await fetch('/api/users')
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users')
        }
        const usersData = await usersResponse.json()
        setUsers(usersData)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load packages or users')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePurchase = async (packageId: number) => {
    // Find the selected package
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      setError('Package not found');
      return;
    }

    // If no user is selected (not logged in), redirect to cart page
    if (!selectedUserId) {
      router.push({
        pathname: '/cart',
        query: {
          packageId: packageId,
          hours: selectedPackage.hours
        }
      });
      return;
    }

    setPurchasing(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: selectedUserId,
          packageId: packageId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to purchase package');
      }

      const data = await response.json();
      
      // Update the user in the users array with the new credit amount
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id.toString() === selectedUserId 
            ? { ...user, simulator_hours: data.credits.simulator_hours } 
            : user
        )
      );

      // Show success message
      setSuccess(`Successfully purchased ${selectedPackage.name} for ${selectedPackage.hours} hours!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>SimStudio - Packages</title>
      </Head>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Simulator Packages</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Back to Bookings
        </Link>
      </div>

      {/* User Selection */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select User</h2>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">No account / not logged in</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.email} (Current Credits: {user.simulator_hours} hours)
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading packages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">${pkg.price.toFixed(2)}</span>
                  <span className="text-gray-700">{pkg.hours} hours</span>
                </div>
                {!success ? (
                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasing}
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                      purchasing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {purchasing ? 'Processing...' : 
                     !selectedUserId ? 'Purchase and Checkout' : 'Purchase'}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
