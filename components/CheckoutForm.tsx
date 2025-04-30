import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface CheckoutFormProps {
  totalPrice: number;
  totalHours: number;
  userId: string;
  isLoggedIn: boolean;
  onSuccess?: (userId: string) => void;
  fromBooking?: boolean;
}

export default function CheckoutForm({ 
  totalPrice, 
  totalHours, 
  userId, 
  isLoggedIn,
  onSuccess,
  fromBooking
}: CheckoutFormProps) {
  const { user, authUser, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Refresh auth state when component mounts
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  
  // If not logged in, show login/register prompt
  if (!isLoggedIn) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Required</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to complete your purchase. Please log in or create an account to continue.
        </p>
        <div className="flex flex-col space-y-3">
          <Link 
            href={`/auth/login?redirect=${encodeURIComponent(router.asPath)}`}
            className="w-full py-2 px-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
          >
            Log In
          </Link>
          <Link 
            href={`/auth/register?redirect=${encodeURIComponent(router.asPath)}`}
            className="w-full py-2 px-4 bg-green-600 text-white text-center rounded-lg hover:bg-green-700"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Create checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: totalPrice,
          userId: userId,
          isAuthenticated: true, // Always true now since we require login
          description: `SimStudio Booking - ${totalHours} hours`,
          fromBooking: fromBooking, // Pass the fromBooking parameter
          totalHours: totalHours // Pass the actual hours to be credited
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout');
      }
      
      const data = await response.json();
      
      // Redirect to Square Checkout
      window.location.href = data.checkoutUrl;
      
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setLoading(false);
    }
  };

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
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          You'll be redirected to Square's secure checkout page to complete your payment.
        </p>
        
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : `Proceed to Checkout • $${totalPrice.toFixed(2)}`}
        </button>
        
        {fromBooking && (
          <button
            onClick={() => router.push('/booking')}
            className="w-full mt-3 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Return to Booking
          </button>
        )}
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Your payment will be processed securely by Square.</p>
        </div>
      </div>
    </div>
  );
}
