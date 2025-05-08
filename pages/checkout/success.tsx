import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { Session } from '../../lib/booking/types';
import { supabase } from '../../lib/supabase';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { ref, directBooking, bookingId } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [hours, setHours] = useState(0);
  const { user, refreshUser } = useAuth();
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'attempted' | 'completed' | 'failed'>('pending');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const isDirectBooking = directBooking === 'true';
  
  // Use a ref to track if verification has been attempted
  const hasAttemptedVerification = React.useRef(false);
  const verificationInProgress = React.useRef(false);
  
  // Generate a unique page instance ID to help with debugging
  const pageInstanceId = React.useRef(`page_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  
  // Store refreshUser in a ref to avoid dependency issues
  const refreshUserRef = React.useRef(refreshUser);
  React.useEffect(() => {
    refreshUserRef.current = refreshUser;
  }, [refreshUser]);
  
  // Refresh auth state when component mounts
  useEffect(() => {
    console.log(`[${pageInstanceId.current}] Checkout success page mounted for reference ID:`, ref);
    
    // Call refreshUser once on mount
    refreshUserRef.current();
    
    // Set a timeout to prevent endless loading
    const timeoutId = setTimeout(() => {
      if (loading && verificationStatus === 'pending') {
        console.log(`[${pageInstanceId.current}] Verification timeout occurred`);
        setTimeoutOccurred(true);
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout
    
    return () => {
      console.log(`[${pageInstanceId.current}] Checkout success page unmounting`);
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array to run only once on mount
  
  // Check if this is a page refresh by looking at the navigation type
  const [isPageRefresh, setIsPageRefresh] = useState(false);
  
  useEffect(() => {
    // Check if this is a page refresh
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation && navigation.type === 'reload') {
        console.log(`[${pageInstanceId.current}] Page refresh detected`);
        setIsPageRefresh(true);
      }
    }
    
    // Add beforeunload event listener to detect page refreshes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log(`[${pageInstanceId.current}] Page is being unloaded/refreshed`);
      // No need to prevent the unload, just logging it
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Check localStorage for verification status as soon as the component mounts
  useEffect(() => {
    if (!ref) return;
    
    // Use localStorage instead of sessionStorage to persist across tabs/windows
    const verificationKey = `payment_verified_${ref}`;
    const verificationAttemptKey = `payment_verification_attempted_${ref}`;
    
    if (typeof window !== 'undefined') {
      // If we've already verified this payment, don't do anything
      if (localStorage.getItem(verificationKey)) {
        console.log(`[${pageInstanceId.current}] Payment already verified according to localStorage`);
        setMessage("This payment has already been processed. Your credits have been added to your account.");
        setVerificationStatus('completed');
        setLoading(false);
        return;
      }
      
      // If we've already attempted to verify this payment, don't try again on refresh
      if (localStorage.getItem(verificationAttemptKey) && isPageRefresh) {
        console.log(`[${pageInstanceId.current}] Verification already attempted and this is a refresh`);
        setMessage("Verification already attempted. Please do not refresh this page.");
        setVerificationStatus('attempted');
        setLoading(false);
        return;
      }
      
      // Mark that we've attempted to verify this payment
      localStorage.setItem(verificationAttemptKey, 'true');
      console.log(`[${pageInstanceId.current}] Marked verification as attempted in localStorage`);
    }
  }, [ref, isPageRefresh]);
  
  // The actual payment verification function
  const verifyPayment = useCallback(async (referenceId: string) => {
    // Prevent concurrent verification attempts
    if (verificationInProgress.current) {
      console.log(`[${pageInstanceId.current}] Verification already in progress, skipping`);
      return;
    }
    
    // Prevent multiple verification attempts
    if (hasAttemptedVerification.current) {
      console.log(`[${pageInstanceId.current}] Verification already attempted, skipping`);
      return;
    }
    
    hasAttemptedVerification.current = true;
    verificationInProgress.current = true;
    
    try {
      console.log(`[${pageInstanceId.current}] Starting payment verification for reference ID:`, referenceId);
      
      // If this is a page refresh and we've already attempted verification, show a message instead of verifying again
      if (isPageRefresh && localStorage.getItem(`payment_verification_attempted_${referenceId}`)) {
        console.log(`[${pageInstanceId.current}] Skipping verification on refresh`);
        setMessage("This payment has already been processed. Please do not refresh this page.");
        setVerificationStatus('attempted');
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          referenceId,
          pageInstanceId: pageInstanceId.current // Include the page instance ID for server-side logging
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }
      
      const data = await response.json();
      console.log(`[${pageInstanceId.current}] Verification response:`, data);
      
      setHours(data.hours);
      
      // Check if there's a message from the server
      if (data.message) {
        setMessage(data.message);
      }
      
      // Check if payment was already processed
      if (data.alreadyProcessed) {
        console.log(`[${pageInstanceId.current}] Payment was already processed according to server`);
        setMessage("This payment has already been processed. Your credits have been added to your account.");
      }
      
      // Refresh user data to get updated credits
      await refreshUserRef.current();
      
      // Fetch booking details if payment was successful
      try {
        // First check if there's a booking with this payment reference
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            id, 
            start_time, 
            end_time, 
            simulator_id, 
            coach, 
            coach_hours,
            payment_status,
            users (
              name,
              email
            )
          `)
          .eq('payment_ref', referenceId)
          .single();
          
        if (bookingError) {
          console.error(`[${pageInstanceId.current}] Error fetching booking:`, bookingError);
          
          // If no booking found with this payment reference, check if there's a booking ID in the order metadata
          // This handles the case where the booking was created but the payment_ref wasn't updated
          console.log(`[${pageInstanceId.current}] No booking found with payment_ref, checking order metadata for booking_id`);
          
          // Get order details from Square to find booking ID
          const orderResponse = await fetch('/api/bookings/find-by-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              referenceId
            })
          });
          
          if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            if (orderData.bookingId) {
              console.log(`[${pageInstanceId.current}] Found booking ID in order metadata:`, orderData.bookingId);
              
              // Update the booking with the payment reference
              const updateResponse = await fetch('/api/bookings/update-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                  bookingId: orderData.bookingId,
                  paymentRef: referenceId,
                  status: 'confirmed'
                })
              });
              
              if (updateResponse.ok) {
                console.log(`[${pageInstanceId.current}] Successfully updated booking with payment reference`);
                
                // Fetch the updated booking
                const { data: updatedBooking, error: updatedError } = await supabase
                  .from('bookings')
                  .select(`
                    id, 
                    start_time, 
                    end_time, 
                    simulator_id, 
                    coach, 
                    coach_hours,
                    payment_status,
                    users (
                      name,
                      email
                    )
                  `)
                  .eq('id', orderData.bookingId)
                  .single();
                  
                if (!updatedError && updatedBooking) {
                  setBookingDetails(updatedBooking);
                  // Update message to include booking confirmation
                  setMessage(`Your booking has been confirmed. The ${hours} simulator hours have been automatically applied to this booking.`);
                }
              } else {
                console.error(`[${pageInstanceId.current}] Error updating booking:`, await updateResponse.text());
              }
            }
          }
        } else if (bookingData) {
          console.log(`[${pageInstanceId.current}] Found booking:`, bookingData);
          setBookingDetails(bookingData);
          
          // Update message to include booking confirmation
          setMessage(`Your booking has been confirmed and ${hours} simulator hours have been added to your account.`);
        }
      } catch (err) {
        console.error(`[${pageInstanceId.current}] Error fetching booking details:`, err);
        // Continue anyway - we'll still show the payment confirmation
      }
      
      // Store in localStorage that this payment has been verified
      if (typeof window !== 'undefined') {
        localStorage.setItem(`payment_verified_${referenceId}`, 'true');
        console.log(`[${pageInstanceId.current}] Marked payment as verified in localStorage`);
      }
      
      setVerificationStatus('completed');
      
    } catch (err: any) {
      console.error(`[${pageInstanceId.current}] Error verifying payment:`, err);
      setError(err.message);
      setVerificationStatus('failed');
    } finally {
      setLoading(false);
      verificationInProgress.current = false;
    }
  }, [isPageRefresh]); // Only depend on isPageRefresh to prevent infinite loops
  
  // Handle direct bookings (no payment needed)
  useEffect(() => {
    if (isDirectBooking && bookingId) {
      console.log(`[${pageInstanceId.current}] Direct booking detected, fetching booking details for ID:`, bookingId);
      
      // For direct bookings, we'll show success immediately and try to fetch details in the background
      setVerificationStatus('completed');
      setMessage('Your booking has been confirmed successfully!');
      
      const timeoutId = setTimeout(() => {
        const fetchDirectBooking = async () => {
          try {
            // Convert bookingId to string to ensure it's a single value, then to number
            const bookingIdStr = Array.isArray(bookingId) ? bookingId[0] : bookingId;
            const bookingIdNum = parseInt(bookingIdStr, 10);
            
            console.log(`[${pageInstanceId.current}] Converted booking ID:`, bookingIdNum);
            console.log(`[${pageInstanceId.current}] Attempting to fetch booking with ID ${bookingIdNum} from Supabase`);
            
            // First try with the exact ID
            let { data: bookingData, error: bookingError } = await supabase
              .from('bookings')
              .select(`
                id, 
                start_time, 
                end_time, 
                simulator_id, 
                coach, 
                coach_hours,
                payment_status,
                users (
                  name,
                  email
                )
              `)
              .eq('id', bookingIdNum)
              .single();
              
            if (bookingError) {
              console.error(`[${pageInstanceId.current}] Error fetching direct booking with exact ID:`, bookingError);
              
              // If that fails, try to get the most recent booking
              console.log(`[${pageInstanceId.current}] Trying to fetch most recent booking instead`);
              
              const { data: recentBookings, error: recentError } = await supabase
                .from('bookings')
                .select(`
                  id, 
                  start_time, 
                  end_time, 
                  simulator_id, 
                  coach, 
                  coach_hours,
                  payment_status,
                  users (
                    name,
                    email
                  )
                `)
                .order('created_at', { ascending: false })
                .limit(1);
                
              if (!recentError && recentBookings && recentBookings.length > 0) {
                bookingData = recentBookings[0];
                console.log(`[${pageInstanceId.current}] Found most recent booking:`, bookingData);
                setBookingDetails(bookingData);
              } else {
                // Don't set an error since we already showed success
                console.error(`[${pageInstanceId.current}] Error fetching recent booking:`, recentError);
              }
            } else if (bookingData) {
              console.log(`[${pageInstanceId.current}] Found direct booking:`, bookingData);
              setBookingDetails(bookingData);
            }
          } catch (err) {
            console.error(`[${pageInstanceId.current}] Error fetching direct booking details:`, err);
            // Don't set an error since we already showed success
          } finally {
            setLoading(false);
          }
        };
        
        fetchDirectBooking();
      }, 2000); // 2 seconds timeout
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isDirectBooking, bookingId]);

  // Verify payment when we have the reference ID (only for payment-based bookings)
  useEffect(() => {
    // Skip verification for direct bookings
    if (isDirectBooking) {
      return;
    }
    
    if (!ref || typeof ref !== 'string') {
      console.log(`[${pageInstanceId.current}] No reference ID available yet`);
      return;
    }
    
    // If we've already verified or attempted verification based on localStorage, don't proceed
    if (verificationStatus !== 'pending') {
      console.log(`[${pageInstanceId.current}] Verification status is ${verificationStatus}, not proceeding`);
      return;
    }
    
    // If this is a page refresh, check localStorage again
    if (isPageRefresh) {
      const verificationKey = `payment_verified_${ref}`;
      if (localStorage.getItem(verificationKey)) {
        console.log(`[${pageInstanceId.current}] Payment already verified according to localStorage (refresh check)`);
        setMessage("This payment has already been processed. Your credits have been added to your account.");
        setVerificationStatus('completed');
        setLoading(false);
        return;
      }
    }
    
    // Proceed with verification
    verifyPayment(ref);
    
  }, [ref, verifyPayment, isPageRefresh, verificationStatus, isDirectBooking]);
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>
        
        {loading && verificationStatus === 'pending' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p>Verifying your payment...</p>
          </div>
        ) : error && verificationStatus === 'failed' ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            {!isDirectBooking && ref && (
              <p className="mt-4">
                Please contact support with your reference ID: {ref}
              </p>
            )}
            {isDirectBooking && bookingId && (
              <p className="mt-4">
                Please contact support with your booking ID: {bookingId}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-lg shadow-md overflow-hidden mb-4 border-2 border-simstudio-yellow">
            {/* Success header with checkmark icon */}
            <div className="p-6 flex items-center">
              <svg className="w-8 h-8 text-simstudio-yellow mr-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {isDirectBooking ? 'Booking Confirmed!' : 'Payment Confirmed!'}
                </h3>
                <p className="text-gray-600">
                  {isDirectBooking ? 'Your session is booked' : 'Thank you for your purchase'}
                </p>
              </div>
            </div>
            
            {/* Success content */}
            <div className="p-6 bg-white">
              {isDirectBooking ? (
                <p className="text-gray-700 mb-4">
                  Your booking has been confirmed successfully. Your simulator session is now reserved.
                </p>
              ) : (
                <>
                  <p className="text-gray-700 mb-4">
                    Your payment has been received and your booking has been confirmed. Your credits have been applied to your booking.
                  </p>
                  <p className="text-gray-700 mb-6">
                    Your reference ID is: <span className="font-medium">{ref}</span>
                  </p>
                </>
              )}
              
              {/* Display booking details if available */}
              {bookingDetails && (
                <div className="mt-4 mb-4 pt-4 border-t border-gray-200">
                  <h3 className="font-bold text-lg mb-3">Booking Confirmation</h3>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2">
                          <span className="font-medium">Date:</span> {new Date(bookingDetails.start_time).toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
                        </p>
                        <p className="mb-2">
                          <span className="font-medium">Time:</span> {new Date(bookingDetails.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(bookingDetails.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="mb-2">
                          <span className="font-medium">Duration:</span> {Math.round((new Date(bookingDetails.end_time).getTime() - new Date(bookingDetails.start_time).getTime()) / (1000 * 60 * 60))} hours
                        </p>
                        <p className="mb-2">
                          <span className="font-medium">Simulator:</span> #{bookingDetails.simulator_id}
                        </p>
                      </div>
                      <div>
                        {bookingDetails.coach && bookingDetails.coach !== 'none' && (
                          <p className="mb-2">
                            <span className="font-medium">Coach:</span> {bookingDetails.coach} ({bookingDetails.coach_hours || 1} {(bookingDetails.coach_hours || 1) === 1 ? 'hour' : 'hours'})
                          </p>
                        )}
                        <p className="mb-2">
                          <span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Confirmed</span>
                        </p>
                        <p className="mb-2">
                          <span className="font-medium">Booking ID:</span> {bookingDetails.id}
                        </p>
                        <p className="mb-2">
                          <span className="font-medium">Payment Reference:</span> {bookingDetails.payment_ref || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!bookingDetails && isDirectBooking && (
                <div className="mt-4 mb-4 pt-4 border-t border-gray-200">
                  <h3 className="font-bold text-lg mb-3">Booking Information</h3>
                  <p className="text-gray-700">
                    Your booking (ID: {bookingId}) has been confirmed. You can view all details in your account.
                  </p>
                </div>
              )}
              
              <p className="mt-4">Please use the buttons below to continue.</p>
            </div>
          </div>
        )}
        
        <div className="mt-6 space-y-3">
          <Link
            href={{
              pathname: "/booking",
              query: {
                fromCheckout: true,
                paidCoachingFee: true,
                paymentRef: ref
              }
            }}
            className="flex items-center justify-between w-full py-3 px-5 border-2 border-simstudio-yellow text-black font-medium rounded-lg hover:bg-yellow-50 transition-all group"
          >
            <span>Make a new booking</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
          
          <Link
            href="/my-account"
            className="flex items-center justify-between w-full py-3 px-5 border-2 border-gray-800 text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-all group"
          >
            <span>Manage my bookings</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
          
          <Link
            href="/"
            className="flex items-center justify-between w-full py-3 px-5 border-2 border-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-all group"
          >
            <span>Return to Home</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
