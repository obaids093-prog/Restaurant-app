/**
 * Gourmet Haven Menu Catalog
 * Realistic high-end restaurant menu items across 4 culinary categories.
 * Each item includes pricing, availability, chef specials, and allergen/timing info.
 */

export const mockMenuItems = [
  // ─── STARTERS ─────────────────────────────────────────────────────────────
  {
    id: 'm1',
    name: 'Truffle Mushroom Bruschetta',
    description: 'Charred artisan sourdough topped with sautéed wild mushrooms, black truffle oil, and shaved aged parmesan.',
    price: 850,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '12 min',
    rating: 4.9,
  },
  {
    id: 'm2',
    name: 'Crispy Calamari Fritti',
    description: 'Tender golden squid rings dusted with smoked paprika, served with homemade garlic lemon aioli.',
    price: 1150,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '15 min',
    rating: 4.8,
  },
  {
    id: 'm3',
    name: 'Burrata Caprese Salad',
    description: 'Creamy Italian burrata cheese, heirloom vine tomatoes, fresh basil pesto, and 12-year aged balsamic glaze.',
    price: 1250,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '10 min',
    rating: 4.7,
  },
  {
    id: 'm4',
    name: 'Spicy Dynamite Prawns',
    description: 'Crispy batter-fried gulf prawns tossed in a fiery sriracha-mayo glaze with scallions and sesame seeds.',
    price: 1350,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: false, // Tested as unavailable
    prepTime: '18 min',
    rating: 4.9,
  },

  // ─── MAINS ────────────────────────────────────────────────────────────────
  {
    id: 'm5',
    name: 'Dry-Aged Wagyu Ribeye Steak',
    description: '300g prime cut beef grilled to perfection, rosemary truffle butter, roasted garlic bulbs, and peppercorn jus.',
    price: 3450,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '25 min',
    rating: 5.0,
  },
  {
    id: 'm6',
    name: 'Pan-Seared Chilean Sea Bass',
    description: 'Flaky sea bass fillet resting on saffron risotto, sautéed baby asparagus, and lemon-caper emulsion.',
    price: 2850,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '22 min',
    rating: 4.8,
  },
  {
    id: 'm7',
    name: 'Smoked Truffle Fettuccine Alfredo',
    description: 'Fresh handmade egg pasta ribbons swirled in rich heavy cream, roasted garlic, portobello, and Grana Padano.',
    price: 1650,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '18 min',
    rating: 4.7,
  },
  {
    id: 'm8',
    name: 'Grilled Rosemary Lamb Chops',
    description: 'New Zealand grass-fed lamb cutlets marinated in fresh mint, thyme, crushed garlic, and charred asparagus.',
    price: 3100,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '25 min',
    rating: 4.9,
  },
  {
    id: 'm9',
    name: 'Wood-Fired Pizza Margherita D.O.P',
    description: 'San Marzano tomato base, fresh buffalo mozzarella, hand-picked sweet basil, and extra virgin olive oil.',
    price: 1450,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: false, // Tested as unavailable
    prepTime: '15 min',
    rating: 4.6,
  },

  // ─── DESSERTS ─────────────────────────────────────────────────────────────
  {
    id: 'm10',
    name: 'Belgian Molten Lava Cake',
    description: 'Warm dark chocolate souffle with a decadent flowing center, served with Tahitian Madagascar vanilla gelato.',
    price: 950,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '15 min',
    rating: 4.9,
  },
  {
    id: 'm11',
    name: 'Classic Venetian Tiramisu',
    description: 'Espresso-soaked Savoiardi ladyfingers layered with velvety mascarpone zabaglione and Dutch cocoa powder.',
    price: 850,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '10 min',
    rating: 4.8,
  },
  {
    id: 'm12',
    name: 'Pistachio Kunafa Cheesecake',
    description: 'Fusion baked cheesecake topped with golden crispy roasted vermicelli, rose syrup, and crushed Iranian pistachios.',
    price: 1050,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '12 min',
    rating: 4.9,
  },

  // ─── DRINKS ───────────────────────────────────────────────────────────────
  {
    id: 'm13',
    name: 'Smoked Rosemary Citrus Mocktail',
    description: 'Fresh blood orange, grapefruit juice, sparkling tonic, agitated with charred rosemary sprig smoke.',
    price: 650,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '8 min',
    rating: 4.8,
  },
  {
    id: 'm14',
    name: 'Iced Vanilla Bean Cold Brew',
    description: 'Single-origin Ethiopian beans steeped for 24 hours, infused with pure Madagascar vanilla extract and oat milk.',
    price: 550,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '5 min',
    rating: 4.7,
  },
  {
    id: 'm15',
    name: 'Wild Berry Passion Refresher',
    description: 'Muddled fresh blueberries, raspberries, mint, passion fruit puree, and crushed mountain ice.',
    price: 600,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '6 min',
    rating: 4.7,
  },
  {
    id: 'm16',
    name: 'Spanish Saffron & Cardamom Latte',
    description: 'Steamed whole milk steeped with Kashmiri saffron threads and green cardamom, poured over a double espresso shot.',
    price: 700,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '7 min',
    rating: 4.8,
  },
];

/**
 * Simulated Async Menu Fetch API
 * Resolves after 1500ms to mirror realistic cloud catalog retrieval.
 */
export const fetchMenuItemsApi = (shouldFail = false) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network connection interrupted. Please try again.'));
      } else {
        resolve(mockMenuItems);
      }
    }, 1500);

    return timer;
  });
};

export default mockMenuItems;
