import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Define the order of about pages
const aboutPages = [
  { path: '/about/how-to-book', title: 'How to Book' },
  { path: '/about/facility', title: 'Our Facility' },
  { path: '/about/driver-training', title: 'Driver Training' },
  { path: '/about/our-story', title: 'Our Story' },
  { path: '/about/faqs', title: 'FAQs' },
];

export default function AboutPageNavigation() {
  const router = useRouter();
  const currentPath = router.pathname;
  
  // Find the index of the current page
  const currentIndex = aboutPages.findIndex(page => page.path === currentPath);
  
  // If current page is not found or is the last page, return to first page
  const nextIndex = currentIndex === -1 || currentIndex === aboutPages.length - 1 
    ? 0 
    : currentIndex + 1;
  
  const nextPage = aboutPages[nextIndex];
  
  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      <div className="bg-gray-50 p-8 rounded-lg border border-simstudio-yellow">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <p className="text-gray-500 mb-2">Continue exploring</p>
            <h3 className="text-2xl font-bold mb-2">{nextPage.title}</h3>
            <p className="text-gray-700">Discover more about Sim Studio and what we offer</p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <Link 
              href={nextPage.path} 
              className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-3 px-8 rounded-lg transition duration-300 flex items-center"
            >
              READ NEXT
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
