import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'gta6-official-ebook-demo',
    title: 'Grand Theft Auto VI: Official Vice City Master Walkthrough E-Book',
    description: 'The definitive full-color digital strategy e-book detailing Vice City & Leonida district maps, underground heist tactics, vehicle tuning, Lucia & Jason mechanics, and secret weapon locations.',
    category: 'ebook',
    price: 19.99,
    original_price: 39.99,
    image_url: '/images/gta6-cover1.jpeg',
    gumroad_url: 'https://gumroad.com',
    badge: 'EXCLUSIVE E-BOOK',
    features: [
      '180+ Full-Color HD Illustrated Pages (PDF & ePub)',
      'Complete Leonida State Heist Blueprints & Satellite Maps',
      'Lucia & Jason Skill Tree, Combat & Weapon Guides',
      'Instant Download & Lifetime Free DLC Updates'
    ],
    is_featured: true,
    is_active: true,
    rating: 5.0,
    sales_count: 1240,
    created_at: new Date().toISOString(),
  }
];
