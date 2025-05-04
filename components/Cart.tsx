import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
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
  message?: string;
  coachingFee?: number;
  bookingId?: number;
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
  const { user, authUser, refreshUser } = useAuth()
  const [userCredits, setUserCredits] = useState(0)
  const isLoggedIn = !!authUser
  const [showCheckout, setShowCheckout] = useState(false)
  const [creditsNeeded, setCreditsNeeded] = useState(0)
  const [message, setMessage] = useState('')
  const [coachingFee, setCoachingFee] = useState<number | undefined>(undefined)
  const [bookingId, setBookingId] = useState<number | undefined>(undefined)
  
  // Refresh auth state when component mounts
  useEffect(() => {
    refreshUser();
    
    // Set message if provided in booking details
    if (bookingDetails.message) {
      setMessage(bookingDetails.message);
    } else if (router.query.message) {
      setMessage(router.query.message as string);
    }
    
    // Set coaching fee if provided in booking details or query params
    if (bookingDetails.coachingFee) {
      setCoachingFee(bookingDetails.coachingFee);
    } else if (router.query.coachingFee) {
      setCoachingFee(parseFloat(router.query.coachingFee as string));
    }
    
    // Set booking ID if provided in booking details or query params
    if (bookingDetails.bookingId) {
      setBookingId(bookingDetails.bookingId);
    } else if (router.query.bookingId) {
      setBookingId(parseInt(router.query.bookingId as string, 10));
    }
  }, [refreshUser, bookingDetails, router.query]);

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
      // Check if user is logged in
      if (isLoggedIn && user) {
        try {
          // Fetch user credits
          const response = await fetch(`/api/user-credits?userId=${user.id}`)
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
      const query: any = {
        userId,
        date: bookingDetails.date,
        time: bookingDetails.time,
        hours: bookingDetails.hours,
        coach: bookingDetails.coach
      };
      
      // Add fromBooking flag if we came from the booking form
      if (router.query.fromBooking) {
        query.fromBooking = true;
      } else {
        query.fromCheckout = true;
      }
      
      router.push({
        pathname: '/',
        query
      });
    } else {
      // Otherwise go to packages page
      router.push('/packages');
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
          
          {/* Display message from booking form if available */}
          {message && (
            <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                <p className="font-medium">{message}</p>
              </div>
              <div className="mt-2 text-sm">
                <p>Your booking will be automatically confirmed once payment is complete.</p>
                {creditsNeeded > 0 && (
                  <p className="mt-1">You are purchasing <strong>{creditsNeeded} credit hours</strong> needed for your booking.</p>
                )}
                {coachingFee && coachingFee > 0 && (
                  <p className="mt-1">You are also paying the <strong>coaching fee of ${coachingFee.toFixed(2)}</strong> for your booking.</p>
                )}
              </div>
              {router.query.fromBooking && (
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => router.push('/booking')}
                    className="px-4 py-2 bg-simstudio-yellow text-black rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Return to Booking
                  </button>
                </div>
              )}
            </div>
          )}
          
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
          
          {/* Only show packages grid if we need to purchase hours or there's no coaching fee */}
          {(bookingDetails.hours > 0 || !coachingFee) && (
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
          )}
          
          {/* Show checkout section if a package is selected OR if there's a coaching fee to pay */}
          {(selectedPackage || (coachingFee && coachingFee > 0)) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              {selectedPackage ? (
                <>
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
                    <span>Simulator Price:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <h3 className="text-lg font-semibold mb-2">Coaching Fee Only</h3>
              )}
              
              {coachingFee && coachingFee > 0 && (
                <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t border-gray-200">
                  <span>Coaching Fee:</span>
                  <span>${coachingFee.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                <span>Total Price:</span>
                <span>${(totalPrice + (coachingFee || 0)).toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Proceed to Checkout {coachingFee && coachingFee > 0 ? '(Simulator + Coaching)' : ''}
              </button>
            </div>
          )}
        </>
      ) : (
        <CheckoutForm 
          totalPrice={totalPrice} 
          totalHours={totalHours} 
          userId={user ? user.id.toString() : bookingDetails.userId}
          isLoggedIn={isLoggedIn}
          onSuccess={handleCheckoutSuccess}
          fromBooking={router.query.fromBooking === 'true'}
          coachingFee={coachingFee}
          bookingDetails={bookingDetails}
        />
      )}
    </div>
  )
}
