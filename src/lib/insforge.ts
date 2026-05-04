import { createClient } from '@insforge/sdk';

const insforgeUrl = (import.meta as any).env.VITE_INSFORGE_URL || 'https://6gmbidsz.us-east.insforge.app/';
const insforgeAnonKey = (import.meta as any).env.VITE_INSFORGE_ANON_KEY || 'ik_b63e7efbf203aeac12f8a0f263f9d893';

if (!(import.meta as any).env.VITE_INSFORGE_URL || !(import.meta as any).env.VITE_INSFORGE_ANON_KEY) {
  console.warn('InsForge credentials missing from environment! Using default fallback values from configuration.');
}

export const insforge = createClient({
  baseUrl: insforgeUrl.endsWith('/') ? insforgeUrl.slice(0, -1) : insforgeUrl,
  anonKey: insforgeAnonKey
});
