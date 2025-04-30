import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'

interface Package {
  id: number;
  name: string;
  hours: number;
  price: number;
  description: string;
}

export default function PackagesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [redirectMessage, setRedirectMessage] = useState('')

  // Handle redirect message from booking page
  useEffect(() => {
    if (router.query.message) {
      setRedirectMessage(router.query.message as string);
    }
  }, [router.query]);

  // Fetch packages on component mount
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
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load packages')
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

    // If no user is logged in, redirect to cart page
    if (!user) {
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
          userId: user.id.toString(),
          packageId: packageId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to purchase package');
      }

      const data = await response.json();

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

      {/* Display redirect message from booking page */}
      {redirectMessage && (
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <p className="font-medium">{redirectMessage}</p>
          </div>
          {router.query.requiredHours && router.query.availableHours && (
            <p className="mt-2 text-sm">
              You need {router.query.requiredHours} hours for your booking, but you only have {router.query.availableHours} hours available.
              Please purchase additional credits below to continue with your booking.
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <Link href="/booking" className="px-4 py-2 bg-simstudio-yellow text-black rounded-lg hover:bg-yellow-500 transition-colors">
              Return to Booking
            </Link>
          </div>
        </div>
      )}

      {/* Authentication Status */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        {authLoading ? (
          <p className="text-center">Loading user information...</p>
        ) : user ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Logged in as</h2>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-gray-700 mt-2">Account ID: {user.id}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Not Logged In</h2>
            <p className="text-gray-700 mb-4">
              Please log in to purchase packages directly. Alternatively, you can proceed to checkout as a guest.
            </p>
            <Link href="/auth/login" className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
              Log In
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          <div className="flex justify-between items-center">
            <p>{success}</p>
            {redirectMessage && (
              <Link href="/booking" className="px-4 py-2 bg-simstudio-yellow text-black rounded-lg hover:bg-yellow-500 transition-colors">
                Return to Booking
              </Link>
            )}
          </div>
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
                     !user ? 'Purchase and Checkout' : 'Purchase'}
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
