/**
 * Mock Restaurant Tables Catalog
 * Details seating capacities, unique locations (Indoor, Patio, Rooftop VIP), and IDs.
 */

export const mockTables = [
  { id: 't1', tableNumber: 'T-01', seats: 2, location: 'Indoor Window', isWindow: true },
  { id: 't2', tableNumber: 'T-02', seats: 2, location: 'Patio Garden', isWindow: false },
  { id: 't3', tableNumber: 'T-03', seats: 4, location: 'Indoor Main Dining', isWindow: false },
  { id: 't4', tableNumber: 'T-04', seats: 4, location: 'Patio Garden', isWindow: false },
  { id: 't5', tableNumber: 'T-05', seats: 6, location: 'Indoor Center Booth', isWindow: false },
  { id: 't6', tableNumber: 'T-06', seats: 6, location: 'Rooftop VIP Terrace', isWindow: true },
  { id: 't7', tableNumber: 'T-07', seats: 8, location: 'Rooftop VIP Terrace', isWindow: true },
  { id: 't8', tableNumber: 'T-08', seats: 12, location: 'Private Executive Suite', isWindow: true },
];

export default mockTables;
