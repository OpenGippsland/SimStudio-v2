import { supabase } from '../supabase';

/**
 * Creates the coach_profiles table in the database
 */
export async function createCoachProfilesTable() {
  try {
    // Get all users with coach role
    const { data: coaches, error: coachError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('is_coach', true);
    
    if (coachError) {
      console.error('Error fetching coaches:', coachError);
      throw coachError;
    }
    
    // Create initial coach profiles for existing coaches
    const profilePromises = coaches.map(async (coach) => {
      const { data, error } = await supabase
        .from('coach_profiles')
        .upsert({
          user_id: coach.id,
          hourly_rate: 75, // Default hourly rate
          description: `Professional coach profile for ${coach.name}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error(`Error creating profile for coach ${coach.id}:`, error);
        return { coach_id: coach.id, success: false, error: error.message };
      }
      
      return { coach_id: coach.id, success: true };
    });
    
    const results = await Promise.all(profilePromises);
    
    return {
      table_created: true,
      profiles_created: results
    };
  } catch (error) {
    console.error('Error in createCoachProfilesTable:', error);
    throw error;
  }
}

/**
 * Creates the RPC function to create the coach_profiles table
 */
export async function createCoachProfilesRpcFunction() {
  try {
    // SQL to create the RPC function
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_coach_profiles_table()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        -- Check if the table already exists
        IF NOT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'coach_profiles'
        ) THEN
          -- Create the coach_profiles table
          CREATE TABLE public.coach_profiles (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 75.00,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id)
          );
          
          -- Add RLS policies
          ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
          
          -- Policy for admins (full access)
          CREATE POLICY admin_all ON public.coach_profiles
            FOR ALL
            TO authenticated
            USING (EXISTS (
              SELECT 1 FROM public.users
              WHERE users.id = auth.uid() AND users.is_admin = true
            ));
          
          -- Policy for coaches to view their own profile
          CREATE POLICY coach_select ON public.coach_profiles
            FOR SELECT
            TO authenticated
            USING (
              user_id = auth.uid() OR
              EXISTS (
                SELECT 1 FROM public.users
                WHERE users.id = auth.uid() AND users.is_coach = true
              )
            );
          
          -- Policy for coaches to update their own profile
          CREATE POLICY coach_update ON public.coach_profiles
            FOR UPDATE
            TO authenticated
            USING (user_id = auth.uid());
          
          -- Policy for public to view coach profiles
          CREATE POLICY public_select ON public.coach_profiles
            FOR SELECT
            TO anon, authenticated
            USING (true);
          
          -- Add a trigger to update the updated_at timestamp
          CREATE TRIGGER set_updated_at
          BEFORE UPDATE ON public.coach_profiles
          FOR EACH ROW
          EXECUTE FUNCTION public.set_updated_at();
          
          -- Add a column to the bookings table for coaching fee
          ALTER TABLE public.bookings
          ADD COLUMN IF NOT EXISTS coaching_fee DECIMAL(10, 2) DEFAULT 0.00;
        END IF;
      END;
      $$;
    `;
    
    return createFunctionSQL;
  } catch (error) {
    console.error('Error in createCoachProfilesRpcFunction:', error);
    throw error;
  }
}
