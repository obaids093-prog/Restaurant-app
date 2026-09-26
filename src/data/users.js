/**
 * Mock Users Database
 * Supports authentication for Customer and Manager roles.
 */
export const mockUsers = [
  {
    id: 'u1',
    name: 'Ayesha Khan',
    email: 'customer@restaurant.com',
    password: 'Password123',
    role: 'customer',
    phone: '0300-1234567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'u2',
    name: 'Chef Tariq',
    email: 'manager@restaurant.com',
    password: 'Admin1234',
    role: 'manager',
    phone: '0321-7654321',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
  },
  {
    id: 'u3',
    name: 'Hamza Ali',
    email: 'user@test.com',
    password: 'Password1',
    role: 'customer',
    phone: '0333-9876543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  }
];

export default mockUsers;
