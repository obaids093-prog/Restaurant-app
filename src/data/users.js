/**
 * AURA — Mock User Registry
 * Secured accounts for Dining Patrons and Head Chef / General Management.
 * Aliased to support both branded emails and legacy assignment evaluation credentials.
 */

export const mockUsers = [
  {
    id: 'usr_c1',
    name: 'Zainab Malik',
    email: 'zainab.malik@aurabistro.pk',
    alternateEmail: 'customer@restaurant.com',
    password: 'Password123',
    role: 'customer',
    phone: '0302-8877665',
    membership: 'VIP Emerald Patron • Gulberg',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
  },
  {
    id: 'usr_m1',
    name: 'Chef Farhan Siddiqui',
    email: 'farhan.chef@aurabistro.pk',
    alternateEmail: 'manager@restaurant.com',
    password: 'Admin1234',
    role: 'manager',
    phone: '0321-5544332',
    membership: 'Executive Head Chef & Operations GM',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop',
  },
  {
    id: 'usr_c2',
    name: 'Hamza Abbasi',
    email: 'hamza.abbasi@aurabistro.pk',
    alternateEmail: 'user@test.com',
    password: 'Password1',
    role: 'customer',
    phone: '0333-4455667',
    membership: 'Gold Dining Patron',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  },
];

export default mockUsers;
