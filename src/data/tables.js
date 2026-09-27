/**
 * AURA — Seating Directory & Floor Model
 * Tables spanning Botanical Garden, Glasshouse Atrium, and Private Sommelier Suites.
 */

export const mockTables = [
  { id: 'tbl_01', tableNumber: 'A-01', name: 'Atrium Glasshouse Window', seats: 2, location: 'Glasshouse Atrium', isWindow: true },
  { id: 'tbl_02', tableNumber: 'B-02', name: 'Botanica Garden Terrace', seats: 2, location: 'Outdoor Botanica', isWindow: false },
  { id: 'tbl_03', tableNumber: 'C-03', name: "Chef's Counter Booth", seats: 4, location: 'Main Open Kitchen', isWindow: false },
  { id: 'tbl_04', tableNumber: 'S-04', name: 'Skylight Pergola Table', seats: 4, location: 'Botanica Conservatory', isWindow: true },
  { id: 'tbl_05', tableNumber: 'M-05', name: 'Mezzanine Velvet Booth', seats: 6, location: 'Upper Mezzanine', isWindow: false },
  { id: 'tbl_06', tableNumber: 'P-06', name: 'Penthouse Skyline Lounge', seats: 6, location: 'Rooftop Terrace', isWindow: true },
  { id: 'tbl_07', tableNumber: 'V-07', name: 'Sommelier Reserve Room', seats: 8, location: 'Wine Cellar Salon', isWindow: false },
  { id: 'tbl_08', tableNumber: 'E-08', name: 'The Grand Presidential Suite', seats: 12, location: 'Private Penthouse Suite', isWindow: true },
];

export default mockTables;
