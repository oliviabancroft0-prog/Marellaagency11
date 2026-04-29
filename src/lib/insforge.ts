import { createClient } from '@insforge/sdk';

const insforgeUrl = (import.meta as any).env.VITE_INSFORGE_URL;
const insforgeAnonKey = (import.meta as any).env.VITE_INSFORGE_ANON_KEY;

if (!insforgeUrl || !insforgeAnonKey) {
  console.warn('InsForge credentials missing. Please set VITE_INSFORGE_URL and VITE_INSFORGE_ANON_KEY in your .env');
}

export const insforge = createClient({
  baseUrl: (import.meta as any).env.VITE_INSFORGE_URL || '',
  anonKey: (import.meta as any).env.VITE_INSFORGE_ANON_KEY || ''
});
