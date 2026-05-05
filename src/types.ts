export interface Product {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  instagram: string;
  onlyfans: string;
  bio: string;
  price: string;
  image: string;
  gallery: string[];
}

export interface KitProduct {
  id: string;
  kitId: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: 'talent' | 'product';
}
