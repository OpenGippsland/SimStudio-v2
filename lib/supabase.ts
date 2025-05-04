import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a standard supabase client for client-side and read operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      'x-refresh-schema-cache': 'true',
    },
  },
})

// Only create admin client on the server side
// This prevents the "supabaseKey is required" error in the browser
export const supabaseAdmin = typeof window === 'undefined' 
  ? createClient<Database>(
      supabaseUrl, 
      process.env.SUPABASE_SERVICE_ROLE_KEY || '', 
      { auth: { persistSession: false } }
    )
  : null;
