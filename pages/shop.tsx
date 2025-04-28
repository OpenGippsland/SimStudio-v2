import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ShopPage() {
  // This is a placeholder for products that will eventually come from Shopify
  const products = [
    {
      id: 1,
      name: '10-Hour Simulator Package',
      price: '$499',
      description: 'Get 10 hours of simulator time at a discounted rate. Perfect for those looking to build skills over multiple sessions.',
      image: '/assets/SimStudioBanner.jpg',
      slug: '10-hour-simulator-package'
    },
    {
      id: 2,
      name: '5-Hour Coaching Package',
      price: '$399',
      description: 'Five hours of professional coaching with one of our experienced instructors to help you improve your driving skills.',
      image: '/assets/SimStudioBanner.jpg',
      slug: '5-hour-coaching-package'
    },
    {
      id: 3,
      name: 'Road Confidence Program',
      price: '$299',
      description: 'A structured program designed to build confidence for new drivers or those looking to improve their road skills.',
      image: '/assets/SimStudioBanner.jpg',
      slug: 'road-confidence-program'
    },
    {
      id: 4,
      name: 'Race Track Mastery Course',
      price: '$599',
      description: 'Learn advanced racing techniques and strategies to improve your lap times and racing performance.',
      image: '/assets/SimStudioBanner.jpg',
      slug: 'race-track-mastery-course'
    },
    {
      id: 5,
      name: 'Gift Card',
      price: 'From $50',
      description: 'Give the gift of driving skills. Our gift cards can be used for any of our services and packages.',
      image: '/assets/SimStudioBanner.jpg',
      slug: 'gift-card'
    },
    {
      id: 6,
      name: 'Corporate Team Building',
      price: 'Contact for pricing',
      description: 'Custom packages for corporate events and team building activities. Make your next team event memorable and educational.',
      image: '/assets/SimStudioBanner.jpg',
      slug: 'corporate-team-building'
    }
  ];

  return (
    <>
      {/* Page Header */}
      <div className="carbon-bg text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 heading-font">SHOP</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Browse our packages and services to find the perfect option for your driving goals.
          </p>
        </div>
      </div>

      {/* Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold">{product.name}</h2>
                      <p className="text-simstudio-yellow font-bold">{product.price}</p>
                    </div>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <Link href={`/shop/${product.slug}`} className="block w-full bg-simstudio-yellow hover:bg-yellow-500 text-black text-center font-bold py-2 px-4 rounded-lg transition duration-300">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Shopify Integration Note */}
            <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Coming Soon: Enhanced Shopping Experience</h2>
              <p>
                This page will be integrated with our Shopify backend to provide a seamless shopping experience.
                You'll be able to purchase packages, book sessions, and manage your account all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center heading-font">FREQUENTLY ASKED QUESTIONS</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">How do I redeem my purchased package?</h3>
                <p className="text-gray-700">
                  After purchasing a package, you'll receive a confirmation email with a unique code. 
                  You can use this code when booking a session through our booking system.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Do packages expire?</h3>
                <p className="text-gray-700">
                  Yes, packages are valid for 12 months from the date of purchase. Gift cards are valid for 36 months.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Can I share my package with someone else?</h3>
                <p className="text-gray-700">
                  Packages are linked to individual accounts and cannot be shared. However, you can purchase a gift card 
                  that can be redeemed by anyone.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">What's your refund policy?</h3>
                <p className="text-gray-700">
                  We offer full refunds for packages within 14 days of purchase, provided no sessions have been booked. 
                  After 14 days or if sessions have been booked, packages are non-refundable but may be transferred to another person.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/contact" className="inline-block bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                CONTACT US WITH QUESTIONS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
