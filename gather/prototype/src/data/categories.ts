export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: 'c1',
    name: 'Produce',
    slug: 'produce',
    description: 'Fresh fruits, vegetables, and mushrooms',
    icon: 'Leaf',
    color: 'bg-green-100',
    productCount: 24,
  },
  {
    id: 'c2',
    name: 'Meat & Poultry',
    slug: 'meat',
    description: 'Pasture-raised meats and poultry',
    icon: 'Beef',
    color: 'bg-red-100',
    productCount: 12,
  },
  {
    id: 'c3',
    name: 'Dairy & Eggs',
    slug: 'dairy',
    description: 'Fresh milk, cheese, and eggs',
    icon: 'Egg',
    color: 'bg-yellow-100',
    productCount: 15,
  },
  {
    id: 'c4',
    name: 'Baked Goods',
    slug: 'baked',
    description: 'Breads, pastries, and sweets',
    icon: 'Croissant',
    color: 'bg-amber-100',
    productCount: 18,
  },
  {
    id: 'c5',
    name: 'Prepared Foods',
    slug: 'prepared',
    description: 'Ready-to-eat meals and sides',
    icon: 'UtensilsCrossed',
    color: 'bg-orange-100',
    productCount: 16,
  },
  {
    id: 'c6',
    name: 'Pantry',
    slug: 'pantry',
    description: 'Honey, jams, oils, and preserves',
    icon: 'Jar',
    color: 'bg-amber-50',
    productCount: 14,
  },
  {
    id: 'c7',
    name: 'Seafood',
    slug: 'seafood',
    description: 'Fresh and frozen seafood',
    icon: 'Fish',
    color: 'bg-blue-100',
    productCount: 6,
  },
  {
    id: 'c8',
    name: 'Beverages',
    slug: 'beverages',
    description: 'Coffee, tea, and drinks',
    icon: 'Coffee',
    color: 'bg-stone-100',
    productCount: 8,
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find(c => c.slug === slug);

export const getCategoryById = (id: string): Category | undefined =>
  categories.find(c => c.id === id);
