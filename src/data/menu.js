/**
 * AURA — Artisan Culinary Catalog
 * 16 handcrafted dishes across 4 culinary sections (Starters, Mains, Desserts, Drinks).
 * Features rich imagery, detailed gastronomy descriptions, chef badges, and allergen flags.
 */

export const mockMenuItems = [
  // ─── STARTERS ─────────────────────────────────────────────────────────────
  {
    id: 'art_s1',
    name: 'Saffron Infused Lobster Bisque',
    description: 'Velvety slow-simmered Maine lobster velouté infused with Spanish saffron, cognac crème fraîche, and tarragon brioche croutons.',
    price: 1450,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '12 min',
    rating: 4.9,
    tag: "Chef's Signature",
  },
  {
    id: 'art_s2',
    name: 'Pan-Seared Hokkaido Scallops',
    description: 'Golden caramelized deep-sea diver scallops rested on silky cauliflower puree, crispy pancetta chips, and micro chervil.',
    price: 1650,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '14 min',
    rating: 4.8,
    tag: 'Wild Caught',
  },
  {
    id: 'art_s3',
    name: 'Smoked Duck Breast Carpaccio',
    description: 'Cured Hudson Valley duck breast thinly sliced with macerated blackberries, shaved pecorino toscano, and cold-pressed walnut oil.',
    price: 1250,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '10 min',
    rating: 4.7,
    tag: 'Artisan Cured',
  },
  {
    id: 'art_s4',
    name: 'Charred Fig & Goat Cheese Tartine',
    description: 'Mission figs blistered over almond wood fire, whipped chèvre cheese, clover honey drizzle, and fresh thyme on grilled focaccia.',
    price: 950,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: false, // Tested as unavailable / greyed out
    prepTime: '15 min',
    rating: 4.9,
    tag: 'Seasonal Harvest',
  },

  // ─── MAINS ────────────────────────────────────────────────────────────────
  {
    id: 'art_m1',
    name: 'Prime Black Angus Tenderloin',
    description: 'Charcoal-grilled center-cut beef tenderloin, roasted bone marrow jus, wild maitake mushrooms, and truffled potato mousseline.',
    price: 3650,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '24 min',
    rating: 5.0,
    tag: 'Prime Cut',
  },
  {
    id: 'art_m2',
    name: 'Wild Atlantic Halibut en Papillote',
    description: 'Parchment-baked ocean halibut fillet with baby fennel bulbs, preserved Meyer lemon, caper berries, and extra virgin olive emulsion.',
    price: 2950,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '20 min',
    rating: 4.8,
    tag: 'Sustainable Catch',
  },
  {
    id: 'art_m3',
    name: 'Handmade Morel & Truffle Agnolotti',
    description: 'Piedmontese filled pasta pillows stuffed with braised leeks and ricotta, glazed in cultured brown butter, sage, and shaved summer truffles.',
    price: 1850,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '18 min',
    rating: 4.9,
    tag: 'Fresh Handmade',
  },
  {
    id: 'art_m4',
    name: 'Slow-Braised Lamb Shank Tagine',
    description: '12-hour braised pasture-raised lamb shank in Moroccan spices, Medjool dates, toasted almonds, and fluffy saffron couscous.',
    price: 3200,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '22 min',
    rating: 4.8,
    tag: 'Slow Braised',
  },
  {
    id: 'art_m5',
    name: 'Woodfired Neapolitan Burrata Tart',
    description: '24-hour fermented sourdough crust, San Marzano D.O.P. reduction, creamy pugliese burrata, and garden basil pesto.',
    price: 1550,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: false, // Tested as unavailable
    prepTime: '16 min',
    rating: 4.7,
    tag: 'Woodfired',
  },

  // ─── DESSERTS ─────────────────────────────────────────────────────────────
  {
    id: 'art_d1',
    name: 'Valrhona Grand Cru Fondant',
    description: 'Warm Guanaja 70% dark chocolate molten cake with smoked sea salt crystals, paired with house-churned Tahitian bean gelato.',
    price: 1100,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '15 min',
    rating: 4.9,
    tag: 'Signature Dessert',
  },
  {
    id: 'art_d2',
    name: 'Caramelized Pear & Frangipane Tart',
    description: 'Poached Bosc pears baked into rich almond cream frangipane pastry with spiced cider caramel and clotted Jersey cream.',
    price: 950,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '12 min',
    rating: 4.7,
    tag: 'French Classic',
  },
  {
    id: 'art_d3',
    name: 'Saffron & Pistachio Mille-Feuille',
    description: 'Crisp caramelized puff pastry sheets layered with Kashmiri saffron diplomat cream and crushed candied emerald pistachios.',
    price: 1200,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '10 min',
    rating: 5.0,
    tag: 'Artisan Pastry',
  },

  // ─── DRINKS ───────────────────────────────────────────────────────────────
  {
    id: 'art_b1',
    name: 'Botanical Yuzu & Elderflower Spritz',
    description: 'Sparkling Japanese yuzu citrus nectar, St. Germain elderflower infusion, cucumber ribbons, and crushed mountain ice.',
    price: 680,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop',
    isSpecial: true,
    isAvailable: true,
    prepTime: '6 min',
    rating: 4.9,
    tag: 'House Elixir',
  },
  {
    id: 'art_b2',
    name: 'Kyoto Ceremonial Matcha Silk Latte',
    description: 'First-harvest Uji ceremonial matcha whisked with warm oat milk, Madagascar vanilla blossom, and gold leaf dust.',
    price: 620,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '5 min',
    rating: 4.8,
    tag: 'Single Origin',
  },
  {
    id: 'art_b3',
    name: 'Smoked Cascara Espresso Tonic',
    description: 'Double shot of anaerobic Ethiopian espresso poured over botanical Mediterranean tonic and charred grapefruit rind.',
    price: 580,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '5 min',
    rating: 4.7,
    tag: 'Craft Brew',
  },
  {
    id: 'art_b4',
    name: 'Wild Crimson Hibiscus & Berry Quencher',
    description: 'Cold-steeped Egyptian hibiscus flowers, muddled wild blackberries, crushed mint leaves, and effervescent sparkling water.',
    price: 550,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop',
    isSpecial: false,
    isAvailable: true,
    prepTime: '4 min',
    rating: 4.6,
    tag: 'Organic Zero-Proof',
  },
];

/**
 * Simulated Async Menu Fetch API
 * Resolves after 1500ms to simulate cloud catalog retrieval.
 */
export const fetchMenuItemsApi = (shouldFail = false) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Botanica Kitchen catalog unreachable. Please retry.'));
      } else {
        resolve(mockMenuItems);
      }
    }, 1500);

    return timer;
  });
};

export default mockMenuItems;
