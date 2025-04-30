import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function VerifyEmail() {
  const router = useRouter();
  const { redirect } = router.query;
  
  // Determine if the user was in the checkout process
  const isFromCheckout = redirect && String(redirect).includes('/cart');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Verify Email - SimStudio</title>
      </Head>
      
      <div className="max-w-md w-full space-y-8 text-center">
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
        
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-blue-800">
            We've sent you an email with a link to verify your account. Please check your inbox and click the link to complete your registration.
          </p>
          
          {isFromCheckout && (
            <p className="text-blue-800 mt-4 font-medium">
              After verifying your email, you'll be able to continue with your checkout process.
            </p>
          )}
        </div>
        
        <div className="mt-6">
          <p className="text-gray-600 mb-4">
            Didn't receive an email? Check your spam folder or try again.
          </p>
          
          <div className="space-y-3">
            <div>
              <Link href="/auth/login" className="text-yellow-500 hover:underline">
                Return to login
              </Link>
            </div>
            
            {isFromCheckout && (
              <div>
                <Link 
                  href={String(redirect)} 
                  className="text-blue-500 hover:underline"
                >
                  Return to checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
