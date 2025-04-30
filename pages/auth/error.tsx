import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;
  
  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string | string[] | undefined) => {
    if (!errorCode) return 'An unknown error occurred';
    
    const code = Array.isArray(errorCode) ? errorCode[0] : errorCode;
    
    switch (code) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification link is invalid or has expired.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
        return 'There was a problem with the authentication service. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account. Please sign in using the original provider.';
      case 'EmailSignin':
        return 'The email could not be sent. Please try again later.';
      case 'CredentialsSignin':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'SessionRequired':
        return 'You must be signed in to access this page.';
      default:
        return `An error occurred: ${code}. Please try again.`;
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Authentication Error - SimStudio</title>
      </Head>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <img 
            src="/assets/SimStudio Logo Main - Black Bg.png" 
            alt="SimStudio Logo" 
            className="h-12 mx-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
        </div>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">
            {getErrorMessage(error)}
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Link 
            href="/auth/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Return to Sign In
          </Link>
          
          <Link 
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
