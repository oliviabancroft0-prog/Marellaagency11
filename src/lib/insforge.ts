import { createClient } from '@insforge/sdk';

const insforgeUrl = import.meta.env.VITE_INSFORGE_URL;
const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!insforgeUrl || !insforgeAnonKey) {
  console.error('InsForge credentials missing! Ensure VITE_INSFORGE_URL and VITE_INSFORGE_ANON_KEY are set in your environment variables.');
}

export const insforge = createClient({
  baseUrl: insforgeUrl || '',
  anonKey: insforgeAnonKey || ''
});
