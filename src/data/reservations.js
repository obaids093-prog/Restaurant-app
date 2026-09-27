/**
 * AURA — Mock Table Reservations
 * Initial reservations utilizing updated patron and table identifiers.
 */

export const mockReservations = [
  {
    id: 'RES-801',
    customerId: 'usr_c1',
    customerName: 'Zainab Malik',
    phone: '0302-8877665',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '19:00',
    partySize: 4,
    tableId: 'tbl_03',
    tableName: "C-03 (Chef's Counter Booth)",
    specialRequests: "Anniversary celebration, chef's tasting menu requested",
    status: 'Confirmed', // 'Confirmed' | 'Cancelled' | 'Declined'
  },
  {
    id: 'RES-802',
    customerId: 'usr_c2',
    customerName: 'Hamza Abbasi',
    phone: '0333-4455667',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '20:00',
    partySize: 6,
    tableId: 'tbl_06',
    tableName: 'P-06 (Penthouse Skyline Lounge)',
    specialRequests: 'Quiet VIP corner seating',
    status: 'Confirmed',
  },
];

export default mockReservations;
