// Import the Square client
import { SquareClient } from 'square';

// Initialize the Square client
export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? 'production' 
    : 'sandbox'
});

export default squareClient;
