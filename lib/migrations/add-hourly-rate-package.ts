import { supabase } from '../supabase';

export async function addHourlyRatePackage() {
  try {
    console.log('Checking if hourly_rate package exists...');
    
    // Check if the hourly_rate package already exists
    const { data: existingPackage, error: checkError } = await supabase
      .from('packages')
      .select('*')
      .eq('name', 'hourly_rate')
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingPackage) {
      console.log('Hourly rate package already exists, updating to default value of $120');
      
      // Update the existing package to ensure it has the correct values
      const { data, error } = await supabase
        .from('packages')
        .update({
          price: 120,
          hours: 1,
          description: 'Base hourly rate for simulator',
          is_active: false // Hide from shop page
        })
        .eq('name', 'hourly_rate')
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Hourly rate package updated successfully:', data);
    } else {
      console.log('Creating hourly rate package with default value of $120');
      
      // Create the hourly_rate package
      const { data, error } = await supabase
        .from('packages')
        .insert({
          name: 'hourly_rate',
          hours: 1,
          price: 120,
          description: 'Base hourly rate for simulator',
          is_active: false // Hide from shop page
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Hourly rate package created successfully:', data);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error setting up hourly rate package:', error);
    return { success: false, error };
  }
}

// Execute the migration if this file is run directly
if (require.main === module) {
  addHourlyRatePackage()
    .then((result) => {
      console.log('Migration result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
