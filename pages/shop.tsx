import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/layout/PageHeader';

interface Package {
  id: number;
  name: string;
  hours: number;
  price: number;
  description: string;
  is_active: number;
}

export default function ShopPage() {
  const router = useRouter();
  const { user, authUser } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState<number | null>(null);
  const isLoggedIn = !!authUser;

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const data = await response.json();
        setPackages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError('Failed to load packages. Please try again later.');
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle direct checkout
  const handlePurchase = async (pkg: Package) => {
    if (!isLoggedIn) {
      // Redirect to login page with return URL to shop
      router.push({
        pathname: '/auth/login',
        query: { redirect: '/shop' }
      });
      return;
    }

    try {
      setCheckoutLoading(pkg.id);
      
      // Get user information from auth context
      const userInfo = {
        email: user?.email || authUser?.email || '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        phoneNumber: user?.mobile_number || ''
      };
      
      // Create checkout session directly
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: pkg.price,
          userId: user?.id || authUser?.id,
          isAuthenticated: true,
          description: `${pkg.name} - ${pkg.hours} hours`,
          totalHours: pkg.hours,
          userInfo: userInfo
        })
      });
      
      let errorMessage = 'Failed to create checkout';
      
      try {
        const data = await response.json();
        
        if (!response.ok) {
          errorMessage = data.error || errorMessage;
          throw new Error(errorMessage);
        }
        
        // Redirect to Square Checkout
        window.location.href = data.checkoutUrl;
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(errorMessage);
      }
      
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout. Please try again.');
      setCheckoutLoading(null);
    }
  };

  return (
    <>
      {/* Page Header */}
      <PageHeader 
        title="SHOP"
        subtitle="Browse our packages and services to find the perfect option for your driving goals."
        useCarbonBg={false}
      />

      {/* Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 text-center mb-6">
                <p>{error}</p>
                <button 
                  onClick={() => {
                    setError('');
                    setCheckoutLoading(null);
                  }}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                >
                  Dismiss
                </button>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-simstudio-yellow"></div>
              </div>
            ) : packages.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <h2 className="text-xl font-bold mb-4">No Packages Available</h2>
                <p>
                  There are currently no packages available. Please check back later or contact us for custom options.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map(pkg => (
                  <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-simstudio-yellow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/assets/SimStudioBanner.jpg" 
                        alt={pkg.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-xl font-bold">{pkg.name}</h2>
                        <p className="text-simstudio-yellow font-bold">${pkg.price.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600 font-medium">{pkg.hours} {pkg.hours === 1 ? 'hour' : 'hours'}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{pkg.description || 'No description available.'}</p>
                      {isLoggedIn ? (
                        <button 
                          onClick={() => handlePurchase(pkg)}
                          disabled={checkoutLoading === pkg.id}
                          className={`block w-full border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black text-center font-bold py-2 px-4 rounded-lg transition duration-300 ${
                            checkoutLoading === pkg.id ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                        >
                          {checkoutLoading === pkg.id ? 'Processing...' : 'Purchase Now'}
                        </button>
                      ) : (
                        <Link 
                          href={`/auth/login?redirect=${encodeURIComponent('/shop')}`}
                          className="block w-full border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black text-center font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                          Login to Purchase
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center heading-font">FREQUENTLY ASKED QUESTIONS</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-simstudio-yellow">
                <h3 className="text-xl font-bold mb-3">How do I redeem my purchased package?</h3>
                <p className="text-gray-700">
                  After purchasing a package, you'll receive a confirmation email with a unique code. 
                  You can use this code when booking a session through our booking system.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-simstudio-yellow">
                <h3 className="text-xl font-bold mb-3">Do packages expire?</h3>
                <p className="text-gray-700">
                  Yes, packages are valid for 12 months from the date of purchase. Gift cards are valid for 36 months.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-simstudio-yellow">
                <h3 className="text-xl font-bold mb-3">Can I share my package with someone else?</h3>
                <p className="text-gray-700">
                  Packages are linked to individual accounts and cannot be shared. However, you can purchase a gift card 
                  that can be redeemed by anyone.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-simstudio-yellow">
                <h3 className="text-xl font-bold mb-3">What's your refund policy?</h3>
                <p className="text-gray-700">
                  We offer full refunds for packages within 14 days of purchase, provided no sessions have been booked. 
                  After 14 days or if sessions have been booked, packages are non-refundable but may be transferred to another person.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/contact" className="inline-block border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                CONTACT US WITH QUESTIONS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
