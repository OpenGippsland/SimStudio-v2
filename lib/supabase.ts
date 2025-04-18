import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zwgjpeowdflfsdkchyce.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3Z2pwZW93ZGZsZnNka2NoeWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTgyNTYsImV4cCI6MjA2MDU5NDI1Nn0.VBL5BnBlsgUW_S_vDZ89U36Jf1pKM2DBTnL04oXuXdA';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
