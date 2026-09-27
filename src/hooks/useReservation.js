import { useState, useEffect, useCallback, useMemo } from 'react';
import safeStorage from '../utils/safeStorage';
import { mockTables } from '../data/tables';
import { mockReservations } from '../data/reservations';

const RESERVATIONS_STORAGE_KEY = '@aura_reservations_data';

export const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

/**
 * Task 7: useReservation hook
 * Encapsulates all business logic for dining table reservations, slot checks,
 * Pakistani phone validation, and persistence. Contains NO JSX.
 */
export function useReservation(currentUser) {
  // Get today's date formatted as YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Form & Selection States
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('19:00');
  const [partySize, setPartySize] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);
  const [contactName, setContactName] = useState(currentUser?.name || 'Zainab Malik');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '0302-8877665');
  const [specialRequests, setSpecialRequests] = useState('');
  const [reservationsList, setReservationsList] = useState(mockReservations);
  const [validationErrors, setValidationErrors] = useState({});

  // Restore reservations from AsyncStorage on initial mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await safeStorage.getItem(RESERVATIONS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReservationsList(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to load reservations:', e);
      }
    })();
  }, []);

  // Persist reservations whenever updated
  const persistReservations = async (updatedList) => {
    try {
      await safeStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to persist reservations:', e);
    }
  };

  /**
   * Helper: Check which tables are free for a given date & time slot
   */
  const getAvailableTablesForSlot = useCallback(
    (date, slot, size) => {
      // Find occupied table IDs at that exact date and time
      const bookedTableIds = reservationsList
        .filter(
          (r) =>
            r.date === date &&
            r.timeSlot === slot &&
            r.status !== 'Cancelled' &&
            r.status !== 'Declined'
        )
        .map((r) => r.tableId);

      // Return tables that have enough capacity AND are not booked
      return mockTables.filter(
        (table) => table.seats >= size && !bookedTableIds.includes(table.id)
      );
    },
    [reservationsList]
  );

  /**
   * Helper: Determine if an hourly slot has any available tables for partySize
   */
  const isSlotAvailable = useCallback(
    (slot) => {
      const freeTables = getAvailableTablesForSlot(selectedDate, slot, partySize);
      return freeTables.length > 0;
    },
    [getAvailableTablesForSlot, selectedDate, partySize]
  );

  /**
   * Automatically select best-fitting table when slot, date, or partySize changes
   */
  useEffect(() => {
    const availableTables = getAvailableTablesForSlot(selectedDate, selectedTimeSlot, partySize);
    if (availableTables.length > 0) {
      // Pick the closest matching capacity to minimize waste
      const sortedByFit = [...availableTables].sort((a, b) => a.seats - b.seats);
      setSelectedTable(sortedByFit[0]);
    } else {
      setSelectedTable(null);
    }
  }, [selectedDate, selectedTimeSlot, partySize, getAvailableTablesForSlot]);

  /**
   * Comprehensive Form Validation (Task 7 Specs)
   */
  const validateReservation = useCallback(() => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(0, 0, 0, 0);

    // 1. Date not in the past
    if (bookingDate < today) {
      errors.date = 'Reservation date cannot be in the past.';
    }

    // 2. Booking at least 1 hour ahead if today
    if (bookingDate.getTime() === today.getTime()) {
      const [slotHours] = selectedTimeSlot.split(':').map(Number);
      const currentHour = new Date().getHours();
      if (slotHours <= currentHour) {
        errors.timeSlot = 'Bookings must be scheduled at least 1 hour in advance.';
      }
    }

    // 3. Party size between 1 and 12
    if (!partySize || partySize < 1 || partySize > 12) {
      errors.partySize = 'Party size must be between 1 and 12 guests.';
    }

    // 4. Pakistani phone format: 03XX-XXXXXXX
    const pakPhoneRegex = /^03\d{2}-\d{7}$/;
    if (!contactPhone.trim()) {
      errors.phone = 'Contact phone number is required.';
    } else if (!pakPhoneRegex.test(contactPhone.trim())) {
      errors.phone = 'Phone must match Pakistani mobile format (03XX-XXXXXXX).';
    }

    // 5. Contact Name
    if (!contactName.trim()) {
      errors.name = 'Contact guest name is required.';
    }

    // 6. Table availability check
    if (!selectedTable) {
      errors.table = `No table available for ${partySize} guests at ${selectedTimeSlot}. Please choose another time.`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [selectedDate, selectedTimeSlot, partySize, contactPhone, contactName, selectedTable]);

  /**
   * Create Reservation action
   */
  const createReservation = useCallback(() => {
    if (!validateReservation()) {
      throw new Error('Please correct the highlighted validation errors.');
    }

    const newReservation = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      customerId: currentUser?.id || 'guest',
      customerName: contactName.trim(),
      phone: contactPhone.trim(),
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      partySize: Number(partySize),
      tableId: selectedTable.id,
      tableName: `${selectedTable.tableNumber} (${selectedTable.location})`,
      specialRequests: specialRequests.trim(),
      status: 'Confirmed',
      createdAt: Date.now(),
    };

    const updatedList = [newReservation, ...reservationsList];
    setReservationsList(updatedList);
    persistReservations(updatedList);
    return newReservation;
  }, [
    validateReservation,
    currentUser,
    contactName,
    contactPhone,
    selectedDate,
    selectedTimeSlot,
    partySize,
    selectedTable,
    specialRequests,
    reservationsList,
  ]);

  /**
   * Cancel Reservation action
   */
  const cancelReservation = useCallback(
    (reservationId) => {
      const updatedList = reservationsList.map((res) => {
        if (res.id === reservationId) {
          return { ...res, status: 'Cancelled' };
        }
        return res;
      });
      setReservationsList(updatedList);
      persistReservations(updatedList);
    },
    [reservationsList]
  );

  return {
    // States
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    partySize,
    setPartySize,
    selectedTable,
    setSelectedTable,
    contactName,
    setContactName,
    contactPhone,
    setContactPhone,
    specialRequests,
    setSpecialRequests,
    reservationsList,
    validationErrors,
    availableTablesCount: getAvailableTablesForSlot(selectedDate, selectedTimeSlot, partySize).length,

    // Actions & Helpers
    isSlotAvailable,
    getAvailableTablesForSlot,
    validateReservation,
    createReservation,
    cancelReservation,
  };
}

export default useReservation;
