import React, { useState } from 'react'

interface CheckoutFormProps {
  totalPrice: number;
  totalHours: number;
  userId: string;
  isLoggedIn: boolean;
  onSuccess: (userId: string) => void;
}

export default function CheckoutForm({ 
  totalPrice, 
  totalHours, 
  userId, 
  isLoggedIn, 
  onSuccess 
}: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    cardNumber: '4242 4242 4242 4242', // Fake card number
    expiryDate: '12/25',
    cvv: '123'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate form
      if (!isLoggedIn && (!formData.firstName || !formData.email)) {
        throw new Error('Please provide your name and email')
      }

      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        throw new Error('Please complete payment information')
      }

      let finalUserId = userId

      // If not logged in, create or find user
      if (!isLoggedIn) {
        const userResponse = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName
          })
        })

        if (!userResponse.ok) {
          const errorData = await userResponse.json()
          throw new Error(errorData.error || 'Failed to create user')
        }

        const userData = await userResponse.json()
        finalUserId = userData.id.toString()
      }

      // Process fake payment (in a real app, this would call a payment API)
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Add credits to user
      const creditsResponse = await fetch('/api/user-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: finalUserId,
          hours: totalHours
        })
      })

      if (!creditsResponse.ok) {
        const errorData = await creditsResponse.json()
        throw new Error(errorData.error || 'Failed to add credits')
      }

      setSuccess(true)
      
      // After a short delay, call the success callback
      setTimeout(() => {
        onSuccess(finalUserId)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
          <p>{totalHours} hours have been added to your account.</p>
          <p className="mt-2">Redirecting to booking page...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Checkout</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <div className="flex justify-between text-lg">
          <span>Total Hours:</span>
          <span>{totalHours} hours</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2">
          <span>Total Price:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {!isLoggedIn && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="123"
                required
              />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}
