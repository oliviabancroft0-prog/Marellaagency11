import { KIT_PRODUCTS } from './kitProducts';

export interface MoodKit {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bestFor: string;
  buttonText: string;
  keyProducts: string[];
  image: string;
  originalPrice: number;
  discountedPrice: number;
}

export const MOOD_KITS: MoodKit[] = [
  {
    id: 'date-night',
    title: 'Date Night',
    tagline: 'Sultry. Magnetic. After Dark.',
    description: 'Sultry reds, glossy lips and dewy skin that looks expensive even in dim lighting.',
    bestFor: 'Evening reels, teasing videos, paid PPV',
    buttonText: 'Shop Date Night Kit →',
    keyProducts: ['Liquid lipsticks', 'body shimmer oils', 'lace lingerie', 'scent layering perfumes', 'nipple covers', 'lighting-friendly highlighters'],
    image: 'https://cdn.jsdelivr.net/gh/oliviabancroft0-prog/10-5-26@main/logan-weaver-lgnwvr-9rEDN5Ilthc-unsplash.jpg'
  },
  {
    id: 'city-chic',
    title: 'City Chic',
    tagline: 'Sharp. Expensive. Boss Energy.',
    description: 'Polished looks for the city girl who means business.',
    bestFor: 'Luxury branding, high-ticket content, city aesthetics',
    buttonText: 'Shop City Chic Kit →',
    keyProducts: ['Matte liquid liners', 'tailored outfits', 'statement jewelry', 'sleek hairstyling tools', 'premium skincare'],
    image: 'https://cdn.jsdelivr.net/gh/oliviabancroft0-prog/10-5-26@main/timur-m-atqKVJgSllU-unsplash.jpg'
  },
  {
    id: 'coastal-ease',
    title: 'Coastal Ease',
    tagline: 'Dreamy. Soft. Sun-Kissed.',
    description: 'Natural glow, breezy outfits and that innocent-but-dangerous softness.',
    bestFor: 'Morning content, beach shoots, soft girl era',
    buttonText: 'Shop Coastal Kit →',
    keyProducts: ['Dewy skin tints', 'body butters', 'wavy hair tools', 'pastel lingerie', 'vanilla scents', 'self-tanners'],
    image: 'https://cdn.jsdelivr.net/gh/oliviabancroft0-prog/10-5-26@main/daniela-araya-dth2uJGiECw-unsplash.jpg'
  },
  {
    id: 'office-siren',
    title: 'Office Siren',
    tagline: 'Professional by Day. Dangerous by Night.',
    description: 'Sleek corporate pieces that secretly scream power and seduction.',
    bestFor: 'Office siren content, roleplay & power play',
    buttonText: 'Shop Office Siren Kit →',
    keyProducts: ['Long-wear foundations', 'power brow kits', 'sophisticated fragrances', 'seamless shapewear', 'elegant heels'],
    image: 'https://cdn.jsdelivr.net/gh/oliviabancroft0-prog/10-5-26@main/ramin-turne-Bgmb0DB2Fwo-unsplash.jpg'
  },
  {
    id: 'weekend-escape',
    title: 'Weekend Escape',
    tagline: 'Wild. Free. Unforgettable.',
    description: 'Festival-ready, travel content and “getaway with me” vibes.',
    bestFor: 'Vacation shoots, bikini content, festival looks',
    buttonText: 'Shop Weekend Escape Kit →',
    keyProducts: ['Waterproof makeup', 'tanning mousse', 'hair repair masks', 'festival glitter', 'sexy sets'],
    image: 'https://cdn.jsdelivr.net/gh/oliviabancroft0-prog/10-5-26@main/richmond-fajardo-8wuuoW5XgiU-unsplash.jpg'
  }
].map(kit => {
  const total = KIT_PRODUCTS.filter(p => p.kitId === kit.id).reduce((sum, p) => sum + p.price, 0);
  return {
    ...kit,
    originalPrice: total,
    discountedPrice: Math.floor(total * 0.85)
  };
});
