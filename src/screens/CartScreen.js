import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/SafeLinearGradient';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { PROMO_CODES } from '../reducers/cartReducer';

// Task 6: Named Financial Constants
export const SERVICE_CHARGE_RATE = 0.05; // 5%
export const SALES_TAX_RATE = 0.15;      // 15%

export default function CartScreen({ navigation }) {
  const { colors, isDark, shadows } = useTheme();
  const {
    cartState,
    increment,
    decrement,
    removeItem,
    updateNote,
    applyPromo,
    removePromo,
    clearCart,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Dining preference state (Task 8 requirement)
  const [orderType, setOrderType] = useState('Dine-in'); // 'Dine-in' | 'Takeaway'
  const [tableNumber, setTableNumber] = useState('Table A-01 (Atrium Glasshouse)');
  const [pickupTime, setPickupTime] = useState('In 25 minutes');

  /**
   * Task 6: Financial Calculations computed with useMemo
   * Depends strictly on [cartState.items, cartState.discountPercent]
   */
  const calculations = useMemo(() => {
    const subtotal = cartState.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discountAmount = subtotal * (cartState.discountPercent / 100);
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    const serviceCharge = discountedSubtotal * SERVICE_CHARGE_RATE;
    const salesTax = discountedSubtotal * SALES_TAX_RATE;
    const grandTotal = discountedSubtotal + serviceCharge + salesTax;

    return {
      subtotal,
      discountAmount,
      discountedSubtotal,
      serviceCharge,
      salesTax,
      grandTotal,
    };
  }, [cartState.items, cartState.discountPercent]);

  // Handle promo code submission
  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoInput.trim()) {
      setPromoError('Please enter a voucher code.');
      return;
    }

    try {
      applyPromo(promoInput);
      setPromoInput('');
      Alert.alert(
        'Promo Applied!',
        `Voucher ${promoInput.toUpperCase()} successfully applied. You saved ${
          PROMO_CODES[promoInput.trim().toUpperCase()]
        }%!`
      );
    } catch (err) {
      setPromoError(err.message);
      Alert.alert('Invalid Code', err.message);
    }
  };

  // Navigate to Order Summary / Checkout
  const handleProceedToSummary = () => {
    if (cartState.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items from the menu before ordering.');
      return;
    }

    navigation.navigate('OrderSummary', {
      orderType,
      tableNumber,
      pickupTime,
      calculations,
    });
  };

  // Cart item card renderer
  const renderCartItem = ({ item }) => (
    <View
      style={[
        styles.cartCard,
        { backgroundColor: colors.card, borderColor: colors.cardBorder },
        shadows.soft,
      ]}
    >
      <View style={styles.cartCardHeader}>
        <Image source={{ uri: item.image }} style={styles.itemThumb} />
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.itemUnitPrice, { color: colors.textSecondary }]}>
            Rs. {item.price.toLocaleString()} each
          </Text>
          <Text style={[styles.itemSubtotal, { color: colors.primary }]}>
            Line Total: Rs. {(item.price * item.quantity).toLocaleString()}
          </Text>
        </View>

        {/* Delete Item Button */}
        <TouchableOpacity
          onPress={() => removeItem(item.id)}
          style={styles.deleteBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Special Instructions Field (Task 5: per-item notes) */}
      <View style={styles.noteInputWrapper}>
        <Ionicons name="chatbubble-ellipses-outline" size={15} color={colors.textMuted} />
        <TextInput
          style={[styles.noteInput, { color: colors.textPrimary }]}
          placeholder="Special notes (e.g. no onions, extra sauce)..."
          placeholderTextColor={colors.textMuted}
          value={item.note || ''}
          onChangeText={(text) => updateNote(item.id, text)}
        />
      </View>

      {/* Quantity Stepper */}
      <View style={styles.stepperRow}>
        <Text style={[styles.stepperLabel, { color: colors.textSecondary }]}>Quantity</Text>
        <View
          style={[
            styles.stepperBox,
            { backgroundColor: colors.surfaceSubtle, borderColor: colors.surfaceBorder },
          ]}
        >
          <TouchableOpacity
            onPress={() => decrement(item.id)}
            style={styles.stepBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={16} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.quantityValue, { color: colors.textPrimary }]}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            onPress={() => increment(item.id)}
            style={styles.stepBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {cartState.items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={72} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            Your Tray is Empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Explore our curated menu and add signature delicacies to begin your order.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Menu')}
            style={[styles.browseBtn, { backgroundColor: colors.primary }, shadows.button3D]}
          >
            <Ionicons name="restaurant" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.browseBtnText}>Explore Gourmet Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar */}
          <View style={styles.cartHeaderBar}>
            <Text style={[styles.cartHeading, { color: colors.textPrimary }]}>
              Culinary Tray ({cartState.items.length} dishes)
            </Text>
            <TouchableOpacity onPress={clearCart}>
              <Text style={[styles.clearCartText, { color: colors.error }]}>Clear Tray</Text>
            </TouchableOpacity>
          </View>

          {/* Cart Item Cards */}
          <FlatList
            data={cartState.items}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            scrollEnabled={false}
          />

          {/* DINING TYPE SELECTION (Dine-in vs Takeaway) */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
              shadows.soft,
            ]}
          >
            <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
              DINING EXPERIENCE TYPE
            </Text>

            <View style={styles.diningTypeRow}>
              <TouchableOpacity
                onPress={() => setOrderType('Dine-in')}
                style={[
                  styles.diningTypeBtn,
                  {
                    backgroundColor:
                      orderType === 'Dine-in' ? colors.primary + '18' : colors.surfaceSubtle,
                    borderColor: orderType === 'Dine-in' ? colors.primary : colors.surfaceBorder,
                  },
                ]}
              >
                <Ionicons
                  name="restaurant"
                  size={18}
                  color={orderType === 'Dine-in' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.diningTypeText,
                    { color: orderType === 'Dine-in' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  Dine-In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setOrderType('Takeaway')}
                style={[
                  styles.diningTypeBtn,
                  {
                    backgroundColor:
                      orderType === 'Takeaway' ? colors.primary + '18' : colors.surfaceSubtle,
                    borderColor: orderType === 'Takeaway' ? colors.primary : colors.surfaceBorder,
                  },
                ]}
              >
                <Ionicons
                  name="bag-handle"
                  size={18}
                  color={orderType === 'Takeaway' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.diningTypeText,
                    { color: orderType === 'Takeaway' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  Takeaway
                </Text>
              </TouchableOpacity>
            </View>

            {orderType === 'Dine-in' ? (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.textPrimary }]}>
                  Serving at: <Text style={{ fontWeight: '700' }}>{tableNumber}</Text>
                </Text>
              </View>
            ) : (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color={colors.secondary} />
                <Text style={[styles.detailText, { color: colors.textPrimary }]}>
                  Estimated pickup: <Text style={{ fontWeight: '700' }}>{pickupTime}</Text>
                </Text>
              </View>
            )}
          </View>

          {/* VOUCHER / PROMO CODE SECTION */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
              shadows.soft,
            ]}
          >
            <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
              PROMOTIONAL VOUCHER
            </Text>

            {cartState.promoCode ? (
              <View
                style={[
                  styles.activePromoBadge,
                  { backgroundColor: colors.successBackground, borderColor: colors.success },
                ]}
              >
                <View style={styles.activePromoLeft}>
                  <Ionicons name="pricetag" size={16} color={colors.success} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={[styles.activePromoText, { color: colors.success }]}>
                      {cartState.promoCode} ({cartState.discountPercent}% OFF)
                    </Text>
                    <Text style={[styles.activePromoSub, { color: colors.success }]}>
                      Applied to current order
                    </Text>
                  </View>
                </View>

                <TouchableOpacity onPress={removePromo} style={styles.removePromoBtn}>
                  <Text style={[styles.removePromoText, { color: colors.error }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={styles.promoInputRow}>
                  <TextInput
                    style={[
                      styles.promoTextInput,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: promoError ? colors.error : colors.inputBorder,
                        color: colors.textPrimary,
                      },
                    ]}
                    placeholder="Enter voucher: WELCOME10, FEAST20, AURA30"
                    placeholderTextColor={colors.textMuted}
                    value={promoInput}
                    onChangeText={(val) => {
                      setPromoInput(val);
                      if (promoError) setPromoError('');
                    }}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    onPress={handleApplyPromo}
                    style={[styles.applyPromoBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={styles.applyPromoText}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {promoError ? (
                  <Text style={[styles.promoErrorText, { color: colors.error }]}>
                    {promoError}
                  </Text>
                ) : null}

                {/* Quick Hint Chips */}
                <View style={styles.promoHintsRow}>
                  <TouchableOpacity
                    onPress={() => setPromoInput('WELCOME10')}
                    style={[styles.hintChip, { backgroundColor: colors.surfaceSubtle }]}
                  >
                    <Text style={[styles.hintText, { color: colors.textMuted }]}>WELCOME10 (10%)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPromoInput('FEAST20')}
                    style={[styles.hintChip, { backgroundColor: colors.surfaceSubtle }]}
                  >
                    <Text style={[styles.hintText, { color: colors.textMuted }]}>FEAST20 (20%)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPromoInput('AURA30')}
                    style={[styles.hintChip, { backgroundColor: colors.surfaceSubtle }]}
                  >
                    <Text style={[styles.hintText, { color: colors.primary }]}>AURA30 (30% VIP)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* BILL SUMMARY & CALCULATIONS */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
              shadows.medium3D,
            ]}
          >
            <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
              ORDER FINANCIAL BREAKDOWN
            </Text>

            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.billValue, { color: colors.textPrimary }]}>
                Rs. {calculations.subtotal.toLocaleString()}
              </Text>
            </View>

            {cartState.discountPercent > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: colors.success }]}>
                  Promo Discount ({cartState.discountPercent}%)
                </Text>
                <Text style={[styles.billValue, { color: colors.success }]}>
                  - Rs. {calculations.discountAmount.toFixed(0)}
                </Text>
              </View>
            )}

            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.textSecondary }]}>
                Service Charge (5%)
              </Text>
              <Text style={[styles.billValue, { color: colors.textPrimary }]}>
                Rs. {calculations.serviceCharge.toFixed(0)}
              </Text>
            </View>

            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.textSecondary }]}>
                Sales Tax (15%)
              </Text>
              <Text style={[styles.billValue, { color: colors.textPrimary }]}>
                Rs. {calculations.salesTax.toFixed(0)}
              </Text>
            </View>

            <View style={[styles.totalDivider, { borderTopColor: colors.surfaceBorder }]} />

            <View style={styles.grandTotalRow}>
              <View>
                <Text style={[styles.grandTotalLabel, { color: colors.textPrimary }]}>
                  Grand Total
                </Text>
                <Text style={[styles.grandTotalSub, { color: colors.textMuted }]}>
                  All duties & taxes included
                </Text>
              </View>
              <Text style={[styles.grandTotalAmount, { color: colors.primary }]}>
                Rs. {calculations.grandTotal.toFixed(0)}
              </Text>
            </View>

            {/* CHECKOUT BUTTON */}
            <TouchableOpacity
              onPress={handleProceedToSummary}
              style={[styles.checkoutBtn, shadows.button3D]}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkoutGradient}
              >
                <Text style={styles.checkoutBtnText}>Proceed to Order Summary</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
    paddingBottom: 50,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 320,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    marginTop: 24,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cartHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cartHeading: {
    fontSize: 18,
    fontWeight: '800',
  },
  clearCartText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cartCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  cartCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemUnitPrice: {
    fontSize: 12,
    marginTop: 2,
  },
  itemSubtotal: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  noteInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    marginTop: 10,
  },
  noteInput: {
    flex: 1,
    fontSize: 12,
    marginLeft: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  stepperLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  diningTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  diningTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  diningTypeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  detailText: {
    fontSize: 13,
  },
  activePromoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  activePromoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activePromoText: {
    fontSize: 13,
    fontWeight: '800',
  },
  activePromoSub: {
    fontSize: 11,
    marginTop: 1,
  },
  removePromoBtn: {
    padding: 4,
  },
  removePromoText: {
    fontSize: 12,
    fontWeight: '700',
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoTextInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  applyPromoBtn: {
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyPromoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  promoErrorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  promoHintsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  hintChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  hintText: {
    fontSize: 11,
    fontWeight: '600',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: 13,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalDivider: {
    borderTopWidth: 1,
    marginVertical: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  grandTotalSub: {
    fontSize: 11,
  },
  grandTotalAmount: {
    fontSize: 22,
    fontWeight: '900',
  },
  checkoutBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
