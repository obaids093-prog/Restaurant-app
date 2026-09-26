/**
 * Initial Mock Table Reservations
 */

export const mockReservations = [
  {
    id: 'RES-101',
    customerId: 'u1',
    customerName: 'Ayesha Khan',
    phone: '0300-1234567',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '19:00',
    partySize: 4,
    tableId: 't3',
    tableName: 'T-03 (Indoor Main Dining)',
    specialRequests: 'Window preference for anniversary celebration',
    status: 'Confirmed', // 'Confirmed' | 'Cancelled' | 'Declined'
  },
  {
    id: 'RES-102',
    customerId: 'u3',
    customerName: 'Hamza Ali',
    phone: '0333-9876543',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '20:00',
    partySize: 6,
    tableId: 't6',
    tableName: 'T-06 (Rooftop VIP Terrace)',
    specialRequests: 'Quiet area',
    status: 'Confirmed',
  },
];

export default mockReservations;
