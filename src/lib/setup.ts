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
 */

import { insforge } from './insforge';

export const syncUserProfile = async () => {
  const { data: { user } } = await insforge.auth.getCurrentUser();
  if (!user) return;

  // Attempt to upsert profile
  const { error } = await insforge.database
    .from('users')
    .upsert({
      id: user.id,
      full_name: (user as any).name || user.email,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error syncing user profile:', error.message);
  }
};
