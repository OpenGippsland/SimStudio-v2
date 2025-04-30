import Head from 'next/head';
import Link from 'next/link';

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Check Your Email - SimStudio</title>
      </Head>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <img 
            src="/assets/SimStudio Logo Main - Black Bg.png" 
            alt="SimStudio Logo" 
            className="h-12 mx-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
        </div>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-medium">Magic link sent!</p>
          <p className="text-sm mt-1">
            We've sent a login link to your email address. Please check your inbox to continue.
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive an email?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-yellow-500 hover:text-yellow-400"
            >
              Try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
