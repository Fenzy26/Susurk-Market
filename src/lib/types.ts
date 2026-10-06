export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  badge: string | null;
  rating: number;
  reviewCount: number;
  prepTime: number;
  isBestseller: boolean;
  dietary: string[];
  ingredients: string[];
};

export type Review = {
  id: string;
  productId: string;
  customerName: string;
  neighborhood: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Date;
};

export type CartLine = {
  product: Product;
  quantity: number;
};
