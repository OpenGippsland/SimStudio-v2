# SimStudio-v2

A booking system for simulators and coaching sessions.

## Project Structure

The project follows a modular component architecture for better maintainability:

### Components Organization
- `components/ui/` - Reusable UI components
  - `PillSelector.tsx` - Pill selection component
  - `SessionCard.tsx` - Session card component
  - `UnavailableDateCard.tsx` - Unavailable date card component
- `components/booking/` - Booking-specific components
  - `BookingFormStep1.tsx` - Initial booking options
  - `BookingFormStep2.tsx` - Session selection
  - `BookingFormStep3.tsx` - Booking confirmation
- `components/BookingForm.tsx` - Main orchestrator component

### Utility Files
- `lib/booking/types.ts` - Shared TypeScript interfaces
- `lib/booking/utils.ts` - Helper functions for booking logic

## Database Migration to Supabase

This project has been updated to use Supabase as the database backend instead of SQLite. This change was made to ensure compatibility with Vercel's serverless deployment environment, as SQLite requires a writable filesystem which is not available in serverless functions.

### Setup Instructions

1. **Environment Variables**

   Copy the `.env.example` file to `.env.local` and update with your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. **Database Configuration**

   The project now uses Supabase for database operations. The database schema has been migrated to Supabase and is compatible with the previous SQLite schema.

3. **Migrating Data**

   To migrate your existing SQLite data to Supabase, run:

   ```
   npm run migrate
   ```

   This will transfer all data from your local SQLite database to Supabase.

## Development

```
npm run dev
```

## Production Build

```
npm run build
npm start
```

## Deployment on Vercel

This project is configured for automatic deployment from GitHub to Vercel. When you push changes to your GitHub repository, Vercel will automatically deploy the updated application.

The project includes a `vercel.json` configuration file that specifies the correct build settings for Next.js deployment on Vercel:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Setting Up Vercel Environment Variables

For the Supabase integration to work in production, you need to set up environment variables in your Vercel project. We've included a helper script to make this process easier:

```bash
npm run setup-vercel
```

This script will:
1. Read your local Supabase credentials from `.env.local`
2. Guide you through setting these variables in your Vercel project
3. Provide instructions for redeploying your project

Alternatively, you can manually set these environment variables in the Vercel dashboard:
1. Go to your Vercel project
2. Navigate to Settings > Environment Variables
3. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous API key
4. Redeploy your project

### Important Notes

- The SQLite database file (`bookings.db`) is still included in the repository for local development and testing purposes.
- For production, the application will use Supabase as the database backend.
- Make sure to set the Supabase environment variables in your Vercel project settings.
