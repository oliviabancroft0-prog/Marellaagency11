/**
 * Setup Instructions for InsForge
 * 
 * To fully enable the users metadata table, run the following SQL in your InsForge Dashboard SQL Editor:
 * 
 * CREATE TABLE IF NOT EXISTS public.users (
 *   id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
 *   full_name TEXT,
 *   avatar_url TEXT,
 *   role TEXT DEFAULT 'talent',
 *   onboarding_completed BOOLEAN DEFAULT FALSE,
 *   creator_profile JSONB,
 *   fan_profile JSONB,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Enable Row Level Security
 * ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create Policies
 * CREATE POLICY "Users can view their own profile" ON public.users
 *   FOR SELECT USING (auth.uid() = id);
 * 
 * CREATE POLICY "Users can insert their own profile" ON public.users
 *   FOR INSERT WITH CHECK (auth.uid() = id);
 * 
 * CREATE POLICY "Users can update their own profile" ON public.users
 *   FOR UPDATE USING (auth.uid() = id);
 * 
 * CREATE POLICY "Users can delete their own profile" ON public.users
 *   FOR DELETE USING (auth.uid() = id);
 * 
 * -- Admin Policy (for Olivia)
 * CREATE POLICY "Admins can view all profiles" ON public.users
 *   FOR SELECT USING (auth.jwt() ->> 'email' = 'oliviabancroft0@gmail.com');
 */

import { insforge } from './insforge';

export const syncUserProfile = async () => {
  try {
    const { data: { user } } = await insforge.auth.getCurrentUser();
    if (!user) return;

    // Check if profile exists first
    const { data: existingProfile } = await insforge.database
      .from('users')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (!existingProfile) {
      // First time sync - we use a prefix in full_name to track onboarding status 
      // without requiring a new database column that might be missing
      let { error } = await insforge.database
        .from('users')
        .insert({
          id: user.id,
          full_name: `ROLE_PENDING:ONBOARDING_PENDING:${(user as any).name || user.email}`,
          role: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      // Handle race condition: if another process created the profile in the meantime, 
      // we'll get a duplicate key error which we can safely ignore
      if (error && (error.message.includes('duplicate key') || (error as any).code === '23505')) {
        console.log('Profile already exists (concurrent creation), ignoring duplicate key error.');
        error = null;
      }

      if (error && (error.message.includes('column') || error.message.includes('role'))) {
        console.warn('Column "role" or others missing, attempting minimal profile creation');
        // Try minimal insert
        const { error: minimalError } = await insforge.database
          .from('users')
          .insert({
            id: user.id,
            full_name: `ROLE_PENDING:ONBOARDING_PENDING:${(user as any).name || user.email}`
          });
        error = minimalError;
      }

      if (error) {
        console.error('Error creating initial user profile:', error.message);
      }
    } else {
      // Update last login / sync
      await insforge.database
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', user.id);
    }
  } catch (err) {
    console.error('Network error syncing profile:', err);
  }
};
