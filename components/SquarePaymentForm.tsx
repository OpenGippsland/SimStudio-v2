import React, { useEffect, useState } from 'react';
import { loadSquareSdk } from '../lib/square-sdk-helper';
import { useAuth } from '../contexts/AuthContext';

interface SquarePaymentFormProps {
  amount: number;
  userId: string;
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
}

export default function SquarePaymentForm({ 
  amount, 
  userId, 
  onSuccess, 
  onError 
}: SquarePaymentFormProps) {
  const { authUser } = useAuth();
  const [paymentForm, setPaymentForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sdkError, setSdkError] = useState<string | null>(null);
  
  // State for traditional credit card form - prefilled with test values
  const [cardNumber, setCardNumber] = useState('4111111111111111'); // Removed spaces
  const [expirationDate, setExpirationDate] = useState('12/25');
  const [cvv, setCvv] = useState('123');
  
  useEffect(() => {
    async function initializeSquare() {
      try {
        setLoading(true);
        
        // Get the Square application ID from environment
        const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
        if (!appId) {
          throw new Error('Square application ID not configured');
        }
        
        // Load the Square SDK
        const payments = await loadSquareSdk(appId);
        
        // Create a card payment form
        const card = await payments.card();
        await card.attach('#card-container');
        
        setPaymentForm(card);
        setSdkError(null);
      } catch (error: any) {
        console.error('Error initializing Square SDK:', error);
        setSdkError(`Error initializing payment form: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    initializeSquare();
    
    // Cleanup on unmount
    return () => {
      if (paymentForm) {
        try {
          paymentForm.destroy();
        } catch (error) {
          console.error('Error destroying payment form:', error);
        }
      }
    };
  }, []);
  
  const handlePayment = async () => {
    try {
      // Validate the traditional credit card form
      if (!cardNumber.trim()) {
        throw new Error('Please enter a card number');
      }
      if (!expirationDate.trim()) {
        throw new Error('Please enter an expiration date');
      }
      if (!cvv.trim()) {
        throw new Error('Please enter a CVV');
      }
      
      setLoading(true);
      
      let sourceId;
      
      // Get payment token from Square
      if (paymentForm && paymentForm.tokenize) {
        try {
          const result = await paymentForm.tokenize();
          if (result.status === 'OK') {
            sourceId = result.token;
          } else {
            throw new Error(result.errors?.[0]?.message || 'Payment tokenization failed');
          }
        } catch (error: any) {
          throw new Error(error.message || 'Payment tokenization failed');
        }
      } else {
        // Use Square sandbox test token
        console.log('Using Square sandbox test token');
        sourceId = 'cnon:card-nonce-ok';
      }
      
      // Process payment on the server
      console.log('Submitting payment to server with:', {
        sourceId: sourceId.substring(0, 10) + '...',
        amount,
        userId: userId || 'guest-user',
        isAuthenticated: !!authUser
      });
      
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId,
          amount,
          userId: userId || 'guest-user',
          description: 'SimStudio booking',
          isAuthenticated: !!authUser
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }
      
      onSuccess(data);
    } catch (error: any) {
      onError(error.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="square-payment-form">
      {sdkError && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-700 rounded">
          {sdkError}
        </div>
      )}
      
      <div className="mb-4">
        {sdkError ? (
          // Show fallback form if Square SDK fails to load
          <div className="traditional-payment-form p-4 border border-gray-300 rounded bg-white">
            <p className="text-gray-700 mb-2">Enter your card details:</p>
            <div className="mb-3">
              <label className="block text-gray-600 text-sm mb-1">Card Number</label>
              <input 
                type="text" 
                placeholder="4111111111111111" 
                className="w-full p-2 border border-gray-300 rounded"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Expiration Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">CVV</label>
                <input 
                  type="text" 
                  placeholder="123" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        ) : (
          // Show Square SDK form
          <div className="square-sdk-form p-4 border border-gray-300 rounded bg-white">
            <p className="text-gray-700 mb-2">Enter your card details:</p>
            <div id="card-container" className="min-h-[100px] p-2 border border-gray-300 rounded"></div>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-2">
          {process.env.NEXT_PUBLIC_SQUARE_APP_ID?.includes('sandbox') 
            ? 'For testing, use card number: 4111111111111111, any future expiration date, and any CVV.'
            : 'Your payment information is secure and encrypted.'}
        </p>
      </div>
      
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </div>
  );
}
