import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/SafeLinearGradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useReservation, TIME_SLOTS } from '../hooks/useReservation';

/**
 * Task 7: ReservationScreen
 * Contains NO business logic — purely presentation UI interacting through useReservation hook.
 */
export default function ReservationScreen() {
  const { user } = useAuth();
  const { colors, isDark, shadows } = useTheme();

  // Use the reservation hook
  const {
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    partySize,
    setPartySize,
    selectedTable,
    contactName,
    setContactName,
    contactPhone,
    setContactPhone,
    specialRequests,
    setSpecialRequests,
    reservationsList,
    validationErrors,
    availableTablesCount,
    isSlotAvailable,
    validateReservation,
    createReservation,
    cancelReservation,
  } = useReservation(user);

  // Local UI-only state: Confirmation Modal visibility
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'history'

  // User presses "Review Booking"
  const handleOpenReview = () => {
    if (validateReservation()) {
      setShowConfirmModal(true);
    } else {
      Alert.alert('Validation Error', 'Please check the highlighted fields below.');
    }
  };

  // Final confirm in modal
  const handleConfirmBooking = () => {
    try {
      const res = createReservation();
      setShowConfirmModal(false);
      Alert.alert(
        'Reservation Confirmed!',
        `Your table has been reserved under booking ID: ${res.id}. A confirmation SMS has been dispatched to ${res.phone}.`
      );
      setActiveTab('history');
    } catch (err) {
      Alert.alert('Booking Error', err.message);
    }
  };

  // Cancel reservation with Alert confirmation
  const handleCancelPress = (booking) => {
    Alert.alert(
      'Cancel Table Reservation',
      `Are you sure you wish to cancel reservation ${booking.id} for ${booking.partySize} guests at ${booking.timeSlot}?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelReservation(booking.id);
            Alert.alert('Cancelled', 'Your reservation has been cancelled.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Mode Switcher: Book a Table vs My Reservations */}
      <View
        style={[
          styles.tabSwitcher,
          { backgroundColor: colors.surfaceSubtle, borderColor: colors.surfaceBorder },
        ]}
      >
        <TouchableOpacity
          onPress={() => setActiveTab('book')}
          style={[
            styles.tabItem,
            activeTab === 'book' && [
              styles.activeTabItem,
              { backgroundColor: colors.surface },
              shadows.soft,
            ],
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={activeTab === 'book' ? colors.primary : colors.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'book' ? colors.primary : colors.textMuted },
            ]}
          >
            Reserve Table
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          style={[
            styles.tabItem,
            activeTab === 'history' && [
              styles.activeTabItem,
              { backgroundColor: colors.surface },
              shadows.soft,
            ],
          ]}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={activeTab === 'history' ? colors.primary : colors.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'history' ? colors.primary : colors.textMuted },
            ]}
          >
            My Bookings ({reservationsList.filter((r) => r.status === 'Confirmed').length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'book' ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
              shadows.soft,
            ]}
          >
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
              Table Seating Details
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Reserve an exclusive table in our Glasshouse Atrium, Botanica Garden, or Penthouse Lounge.
            </Text>

            {/* DATE INPUT */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Reservation Date (YYYY-MM-DD)
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: validationErrors.date ? colors.error : colors.inputBorder,
                  },
                ]}
              >
                <Ionicons name="calendar-clear-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              {validationErrors.date && (
                <Text style={[styles.errorMsg, { color: colors.error }]}>
                  {validationErrors.date}
                </Text>
              )}
            </View>

            {/* PARTY SIZE STEPPER (1 - 12 guests) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithCounterRow}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Party Size (Guests)
                </Text>
                <Text style={[styles.counterNumber, { color: colors.primary }]}>
                  {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
                </Text>
              </View>

              <View
                style={[
                  styles.stepperContainer,
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.surfaceBorder },
                ]}
              >
                <TouchableOpacity
                  onPress={() => setPartySize((p) => Math.max(1, p - 1))}
                  style={styles.stepperBtn}
                  disabled={partySize <= 1}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={partySize <= 1 ? colors.textMuted : colors.primary}
                  />
                </TouchableOpacity>

                <Text style={[styles.stepperDisplay, { color: colors.textPrimary }]}>
                  {partySize}
                </Text>

                <TouchableOpacity
                  onPress={() => setPartySize((p) => Math.min(12, p + 1))}
                  style={styles.stepperBtn}
                  disabled={partySize >= 12}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={partySize >= 12 ? colors.textMuted : colors.primary}
                  />
                </TouchableOpacity>
              </View>
              {validationErrors.partySize && (
                <Text style={[styles.errorMsg, { color: colors.error }]}>
                  {validationErrors.partySize}
                </Text>
              )}
            </View>

            {/* HOURLY TIME SLOTS (12:00 - 22:00) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Select Hourly Dining Slot (12:00 to 22:00)
              </Text>
              <View style={styles.slotsGrid}>
                {TIME_SLOTS.map((slot) => {
                  const isAvailable = isSlotAvailable(slot);
                  const isSelected = selectedTimeSlot === slot;

                  return (
                    <TouchableOpacity
                      key={slot}
                      onPress={() => setSelectedTimeSlot(slot)}
                      disabled={!isAvailable}
                      style={[
                        styles.slotChip,
                        {
                          backgroundColor: isSelected
                            ? colors.primary
                            : isAvailable
                            ? colors.surfaceSubtle
                            : colors.inputBackground,
                          borderColor: isSelected
                            ? colors.primary
                            : isAvailable
                            ? colors.surfaceBorder
                            : 'transparent',
                          opacity: isAvailable ? 1 : 0.4,
                        },
                        isSelected && shadows.button3D,
                      ]}
                    >
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color={isSelected ? '#FFFFFF' : colors.textMuted}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.slotChipText,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : isAvailable
                              ? colors.textPrimary
                              : colors.textMuted,
                          },
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {validationErrors.timeSlot && (
                <Text style={[styles.errorMsg, { color: colors.error }]}>
                  {validationErrors.timeSlot}
                </Text>
              )}
            </View>

            {/* ASSIGNED TABLE PREVIEW CARD */}
            <View
              style={[
                styles.tableAssignCard,
                {
                  backgroundColor: selectedTable
                    ? colors.primary + '12'
                    : colors.errorBackground,
                  borderColor: selectedTable ? colors.primary : colors.error,
                },
              ]}
            >
              <Ionicons
                name={selectedTable ? 'restaurant' : 'alert-circle'}
                size={22}
                color={selectedTable ? colors.primary : colors.error}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text
                  style={[
                    styles.tableAssignTitle,
                    { color: selectedTable ? colors.primary : colors.error },
                  ]}
                >
                  {selectedTable
                    ? `Assigned: ${selectedTable.tableNumber} • Capacity: ${selectedTable.seats} Seats`
                    : 'No Table Available'}
                </Text>
                <Text style={[styles.tableAssignSub, { color: colors.textSecondary }]}>
                  {selectedTable
                    ? `Location: ${selectedTable.location} (${availableTablesCount} table(s) free)`
                    : 'Please select a different hour or decrease party size.'}
                </Text>
              </View>
            </View>
            {validationErrors.table && (
              <Text style={[styles.errorMsg, { color: colors.error }]}>
                {validationErrors.table}
              </Text>
            )}
          </View>

          {/* CONTACT INFO CARD */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
              shadows.soft,
            ]}
          >
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
              Guest Verification Contact
            </Text>

            {/* FULL NAME */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Full Name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: validationErrors.name ? colors.error : colors.inputBorder,
                  },
                ]}
              >
                <Ionicons name="person-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={contactName}
                  onChangeText={setContactName}
                  placeholder="e.g. Zainab Malik"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              {validationErrors.name && (
                <Text style={[styles.errorMsg, { color: colors.error }]}>
                  {validationErrors.name}
                </Text>
              )}
            </View>

            {/* PAKISTANI PHONE (03XX-XXXXXXX) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Pakistani Mobile Number (03XX-XXXXXXX)
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: validationErrors.phone ? colors.error : colors.inputBorder,
                  },
                ]}
              >
                <Ionicons name="call-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  placeholder="0300-1234567"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>
              {validationErrors.phone && (
                <Text style={[styles.errorMsg, { color: colors.error }]}>
                  {validationErrors.phone}
                </Text>
              )}
            </View>

            {/* SPECIAL REQUESTS */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Special Dining Requests (Optional)
              </Text>
              <View
                style={[
                  styles.textAreaWrapper,
                  { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder },
                ]}
              >
                <TextInput
                  style={[styles.textArea, { color: colors.textPrimary }]}
                  value={specialRequests}
                  onChangeText={setSpecialRequests}
                  placeholder="e.g. Window side, birthday celebration, high chair required..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* REVIEW RESERVATION BUTTON */}
            <TouchableOpacity
              onPress={handleOpenReview}
              style={[styles.reviewBtn, shadows.button3D]}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.reviewGradient}
              >
                <Text style={styles.reviewBtnText}>Review & Confirm Reservation</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* MY RESERVATIONS HISTORY TAB */
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {reservationsList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No Reservations Found
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                You have no active or previous dining table bookings.
              </Text>
            </View>
          ) : (
            reservationsList.map((booking) => {
              const isCancelled = booking.status === 'Cancelled' || booking.status === 'Declined';

              return (
                <View
                  key={booking.id}
                  style={[
                    styles.bookingCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.cardBorder,
                      opacity: isCancelled ? 0.6 : 1,
                    },
                    shadows.soft,
                  ]}
                >
                  <View style={styles.bookingHeader}>
                    <View>
                      <Text style={[styles.bookingId, { color: colors.primary }]}>
                        {booking.id}
                      </Text>
                      <Text style={[styles.bookingGuest, { color: colors.textPrimary }]}>
                        {booking.customerName}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isCancelled
                            ? colors.errorBackground
                            : colors.successBackground,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: isCancelled ? colors.error : colors.success },
                        ]}
                      >
                        {booking.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar" size={14} color={colors.textMuted} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {booking.date}
                      </Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={14} color={colors.textMuted} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {booking.timeSlot}
                      </Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Ionicons name="people" size={14} color={colors.textMuted} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {booking.partySize} Guests
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingTableRow}>
                    <Ionicons name="location" size={14} color={colors.primary} />
                    <Text style={[styles.bookingTableText, { color: colors.textPrimary }]}>
                      {booking.tableName}
                    </Text>
                  </View>

                  {booking.specialRequests ? (
                    <Text style={[styles.specialNoteText, { color: colors.textMuted }]}>
                      Request: "{booking.specialRequests}"
                    </Text>
                  ) : null}

                  {!isCancelled && (
                    <TouchableOpacity
                      onPress={() => handleCancelPress(booking)}
                      style={[
                        styles.cancelBtn,
                        { backgroundColor: colors.surfaceSubtle, borderColor: colors.error + '40' },
                      ]}
                    >
                      <Ionicons name="close-circle-outline" size={16} color={colors.error} />
                      <Text style={[styles.cancelBtnText, { color: colors.error }]}>
                        Cancel Reservation
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* CONFIRMATION MODAL (Task 7 Specs) */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
              shadows.deep3D,
            ]}
          >
            <View style={styles.modalHeader}>
              <View
                style={[styles.modalIconCircle, { backgroundColor: colors.primary + '18' }]}
              >
                <Ionicons name="calendar-sharp" size={26} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Confirm Reservation
              </Text>
              <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                Please verify your dining itinerary before finalizing.
              </Text>
            </View>

            <View style={[styles.modalDetailsBox, { backgroundColor: colors.surfaceSubtle }]}>
              <View style={styles.modalRow}>
                <Text style={[styles.modalRowLabel, { color: colors.textMuted }]}>Date & Time:</Text>
                <Text style={[styles.modalRowVal, { color: colors.textPrimary }]}>
                  {selectedDate} at {selectedTimeSlot}
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Text style={[styles.modalRowLabel, { color: colors.textMuted }]}>Party Size:</Text>
                <Text style={[styles.modalRowVal, { color: colors.textPrimary }]}>
                  {partySize} Guests
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Text style={[styles.modalRowLabel, { color: colors.textMuted }]}>Seating:</Text>
                <Text style={[styles.modalRowVal, { color: colors.textPrimary }]}>
                  {selectedTable?.tableNumber} ({selectedTable?.location})
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Text style={[styles.modalRowLabel, { color: colors.textMuted }]}>Guest Name:</Text>
                <Text style={[styles.modalRowVal, { color: colors.textPrimary }]}>
                  {contactName}
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Text style={[styles.modalRowLabel, { color: colors.textMuted }]}>SMS Confirmation:</Text>
                <Text style={[styles.modalRowVal, { color: colors.textPrimary }]}>
                  {contactPhone}
                </Text>
              </View>
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                style={[
                  styles.modalCancelBtn,
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.surfaceBorder },
                ]}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>
                  Edit Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmBooking}
                style={[styles.modalSubmitBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.modalSubmitText}>Confirm & Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 40,
  },
  tabSwitcher: {
    flexDirection: 'row',
    maxWidth: 580,
    width: '92%',
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginVertical: 12,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTabItem: {},
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  textAreaWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textArea: {
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  errorMsg: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    marginLeft: 4,
  },
  labelWithCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  counterNumber: {
    fontSize: 13,
    fontWeight: '800',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 8,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDisplay: {
    fontSize: 18,
    fontWeight: '800',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  slotChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tableAssignCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 6,
  },
  tableAssignTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  tableAssignSub: {
    fontSize: 12,
    marginTop: 2,
  },
  reviewBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
  },
  reviewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  reviewBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  bookingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bookingId: {
    fontSize: 12,
    fontWeight: '800',
  },
  bookingGuest: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  bookingMetaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  bookingTableText: {
    fontSize: 13,
    fontWeight: '700',
  },
  specialNoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
    gap: 6,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  modalDetailsBox: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    gap: 8,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalRowLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalRowVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
