import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BlogPage() {
  // This is a placeholder for blog posts that will eventually come from Shopify
  const blogPosts = [
    {
      id: 1,
      title: 'The Benefits of Simulator Training for New Drivers',
      excerpt: 'Learn how simulator training can help new drivers build confidence and skills in a safe environment before hitting the road.',
      date: 'April 15, 2025',
      image: '/assets/SimStudioBanner.jpg',
      slug: 'benefits-simulator-training-new-drivers'
    },
    {
      id: 2,
      title: 'Racing Line Techniques: Mastering the Perfect Line',
      excerpt: 'Discover the secrets to finding and maintaining the optimal racing line to improve your lap times and driving efficiency.',
      date: 'April 10, 2025',
      image: '/assets/SimStudioBanner.jpg',
      slug: 'racing-line-techniques'
    },
    {
      id: 3,
      title: 'How Simulation Helps Professional Drivers Stay Sharp',
      excerpt: 'Professional drivers use simulation to maintain their skills and prepare for races. Learn how you can apply the same techniques.',
      date: 'April 5, 2025',
      image: '/assets/SimStudioBanner.jpg',
      slug: 'simulation-professional-drivers'
    },
    {
      id: 4,
      title: 'Defensive Driving: Skills That Could Save Your Life',
      excerpt: 'Defensive driving is one of the most important skills any driver can learn. Find out how simulator training can help you master it.',
      date: 'March 28, 2025',
      image: '/assets/SimStudioBanner.jpg',
      slug: 'defensive-driving-skills'
    }
  ];

  return (
    <>
      {/* Page Header */}
      <div className="carbon-bg text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 heading-font">BLOG</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Tips, insights, and news from the world of driving simulation and training.
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                    <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="text-simstudio-yellow hover:text-yellow-600 font-medium">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Shopify Integration Note */}
            <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Coming Soon: Enhanced Blog Experience</h2>
              <p>
                This page will be integrated with our Shopify backend to provide a richer content experience.
                Check back regularly for new articles, tips, and insights from our driving experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 heading-font">STAY UPDATED</h2>
            <p className="text-lg mb-8">
              Subscribe to our newsletter to receive the latest articles, tips, and news from SimStudio.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-simstudio-yellow focus:border-simstudio-yellow"
                required
              />
              <button
                type="submit"
                className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
