import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CheckoutForm from './CheckoutForm'

interface Package {
  id: number;
  name: string;
  hours: number;
  price: number;
  description: string;
}

interface BookingDetails {
  hours: number;
  userId: string;
  date: string;
  time: string;
  coach: string;
}

interface CartProps {
  bookingDetails: BookingDetails;
}

export default function Cart({ bookingDetails }: CartProps) {
  const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userCredits, setUserCredits] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)
  const [creditsNeeded, setCreditsNeeded] = useState(0)

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages')
        if (!response.ok) {
          throw new Error('Failed to fetch packages')
        }
        const data = await response.json()
        setPackages(data)
        
        // If hours are specified in booking details, find the closest package
        if (bookingDetails.hours) {
          // Find single hour package or default to first package
          const hourlyPackage = data.find((pkg: Package) => pkg.hours === 1) || data[0]
          setSelectedPackage(hourlyPackage)
          setQuantity(bookingDetails.hours)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching packages:', error)
        setError('Failed to load packages')
        setLoading(false)
      }
    }

    const checkUserStatus = async () => {
      // Check if user ID is provided (user is logged in)
      if (bookingDetails.userId) {
        setIsLoggedIn(true)
        
        try {
          // Fetch user credits
          const response = await fetch(`/api/user-credits?userId=${bookingDetails.userId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch user credits')
          }
          const data = await response.json()
          setUserCredits(data.simulator_hours || 0)
          
          // Calculate credits needed
          const neededCredits = bookingDetails.hours - (data.simulator_hours || 0)
          setCreditsNeeded(neededCredits > 0 ? neededCredits : 0)
        } catch (error) {
          console.error('Error fetching user credits:', error)
        }
      } else {
        setIsLoggedIn(false)
      }
    }

    fetchPackages()
    checkUserStatus()
  }, [bookingDetails])

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const handleProceedToCheckout = () => {
    setShowCheckout(true)
  }

  const handleCheckoutSuccess = (userId: string) => {
    // Redirect back to booking form with user ID if we came from there
    if (bookingDetails.date && bookingDetails.time) {
      router.push({
        pathname: '/',
        query: {
          userId,
          date: bookingDetails.date,
          time: bookingDetails.time,
          hours: bookingDetails.hours,
          coach: bookingDetails.coach,
          fromCheckout: true
        }
      })
    } else {
      // Otherwise go to packages page
      router.push('/packages')
    }
  }

  const totalPrice = selectedPackage ? (selectedPackage.price * quantity) : 0
  const totalHours = selectedPackage ? (selectedPackage.hours * quantity) : 0

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <p className="text-gray-600">Loading packages...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      {!showCheckout ? (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Package</h2>
          
          {isLoggedIn && (
            <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-blue-800 font-medium">
                Current Credits: {userCredits} hours
              </p>
              {creditsNeeded > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  You need {creditsNeeded} more hours for your booking
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {packages.map(pkg => (
              <div 
                key={pkg.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPackage?.id === pkg.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handlePackageSelect(pkg)}
              >
                <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-2">{pkg.description}</p>
                <div className="flex justify-between">
                  <span className="font-bold text-blue-600">${pkg.price.toFixed(2)}</span>
                  <span>{pkg.hours} hours</span>
                </div>
              </div>
            ))}
          </div>
          
          {selectedPackage && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Selected Package: {selectedPackage.name}</h3>
              
              <div className="flex items-center mb-4">
                <span className="mr-4">Quantity:</span>
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-l"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="bg-gray-100 py-1 px-4">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-r"
                >
                  +
                </button>
              </div>
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Hours:</span>
                <span>{totalHours} hours</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold mt-2">
                <span>Total Price:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </>
      ) : (
        <CheckoutForm 
          totalPrice={totalPrice} 
          totalHours={totalHours} 
          userId={bookingDetails.userId}
          isLoggedIn={isLoggedIn}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  )
}
