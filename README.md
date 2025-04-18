# SimStudio-v2

A booking system for simulators and coaching sessions.

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

### Important Notes

- The SQLite database file (`bookings.db`) is still included in the repository for local development and testing purposes.
- For production, the application will use Supabase as the database backend.
- Make sure to set the Supabase environment variables in your Vercel project settings.
