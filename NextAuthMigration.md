# Migration from Supabase Auth to NextAuth

This document outlines the changes made to migrate the authentication system from Supabase Auth to NextAuth.js.

## Why NextAuth?

- **Cost Savings**: Supabase Auth requires a Pro plan for SSO features, while NextAuth provides these features for free.
- **Flexibility**: NextAuth offers more authentication providers and customization options.
- **Integration**: Better integration with Next.js and the React ecosystem.

## Key Changes

### 1. NextAuth Configuration

- Created a NextAuth API route at `pages/api/auth/[...nextauth].ts`
- Configured both Credentials and Email providers
- Set up JWT-based session management
- Created a custom adapter for Supabase database integration

### 2. Authentication Context

- Updated `contexts/AuthContext.tsx` to use NextAuth's session management
- Maintained the same interface for backward compatibility with existing components
- Added synchronization between NextAuth sessions and our database user records

### 3. Authentication Pages

- Updated login and register pages to use NextAuth's signIn function
- Created additional pages for NextAuth's authentication flow:
  - `pages/auth/verify-request.tsx`: Shown when a magic link is sent
  - `pages/auth/error.tsx`: Shown when an authentication error occurs
  - `pages/auth/logout.tsx`: Shown after signing out

### 4. Protected Routes

- Updated `components/auth/AuthGuard.tsx` to use NextAuth's useSession hook
- Maintained the same protection behavior for authenticated routes

### 5. Environment Variables

- Added NextAuth-specific environment variables to `.env.local` and `.env.example`

## Testing

- Created debug pages to help troubleshoot authentication issues:
  - `pages/auth-test.tsx`: Simple test page for NextAuth integration
  - `pages/auth-debug.tsx`: Detailed debugging page with session information

## Known Issues

- The transition between authentication states may require a page reload in some cases
- Email provider requires proper SMTP configuration for production use

## Future Improvements

- Add more authentication providers (Google, GitHub, etc.)
- Implement role-based access control
- Enhance user profile management
