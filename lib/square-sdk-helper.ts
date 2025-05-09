// Global variable to track if we're already loading the SDK
let isLoadingSquareSdk = false;
let squarePaymentsInstance: any = null;

/**
 * Helper function to load the Square Web Payments SDK
 * @param appId The Square application ID
 * @returns A promise that resolves to the Square Payments object
 */
export async function loadSquareSdk(appId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // If we already have an instance, return it
    if (squarePaymentsInstance) {
      console.log('Using existing Square Payments instance');
      resolve(squarePaymentsInstance);
      return;
    }
    
    // Check if the SDK is already loaded
    if ((window as any).Square) {
      try {
        console.log('Square SDK already loaded, initializing payments');
        squarePaymentsInstance = (window as any).Square.payments(appId);
        resolve(squarePaymentsInstance);
      } catch (err: any) {
        console.error('Failed to initialize Square with existing SDK:', err);
        reject(new Error(`Failed to initialize Square: ${err.message}`));
      }
      return;
    }

    // If we're already loading the SDK, wait a bit and try again
    if (isLoadingSquareSdk) {
      console.log('Square SDK is already loading, waiting...');
      setTimeout(() => {
        loadSquareSdk(appId).then(resolve).catch(reject);
      }, 500);
      return;
    }

    try {
      // Mark that we're loading the SDK
      isLoadingSquareSdk = true;
      
      // Create script element
      const script = document.createElement('script');
      // Check if we're using the sandbox app ID (which contains 'sandbox' in it)
      const isProduction = !appId.includes('sandbox');
      console.log('Square environment:', isProduction ? 'production' : 'sandbox');
      script.src = getSquareSdkUrl(isProduction);
      script.async = true;
      script.onload = () => {
        // Initialize Square
        try {
          console.log('Square SDK loaded successfully, initializing payments');
          const Square = (window as any).Square;
          squarePaymentsInstance = Square.payments(appId);
          isLoadingSquareSdk = false;
          resolve(squarePaymentsInstance);
        } catch (err: any) {
          console.error('Failed to initialize Square after loading SDK:', err);
          isLoadingSquareSdk = false;
          reject(new Error(`Failed to initialize Square: ${err.message}`));
        }
      };
      script.onerror = () => {
        console.error('Failed to load Square SDK script');
        isLoadingSquareSdk = false;
        reject(new Error('Failed to load Square SDK'));
      };

      // Append script to document
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error during Square SDK loading:', error);
      isLoadingSquareSdk = false;
      reject(error);
    }
  });
}

/**
 * Helper function to determine the correct Square Web Payments SDK URL based on environment
 * @param isProduction Whether to use the production environment
 * @returns The URL for the Square Web Payments SDK
 */
export function getSquareSdkUrl(isProduction: boolean): string {
  return isProduction
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';
}
