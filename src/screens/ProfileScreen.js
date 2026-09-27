import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/SafeLinearGradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme, shadows } = useTheme();

  const [dietaryPrefs, setDietaryPrefs] = useState(['Chef Counter', 'Halal Artisan', 'Botanical Teas']);

  const togglePref = (pref) => {
    setDietaryPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Conclude Patron Session',
      'Are you sure you wish to securely sign out of your AURA dining suite?',
      [
        { text: 'Remain Signed In', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const isManager = user?.role === 'manager';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── VIP BLACK-TIE PATRON PASSPORT CARD ─── */}
        <View style={[styles.passportCardOuter, shadows.deep3D]}>
          <LinearGradient
            colors={isDark ? ['#132A26', '#0B1715', '#08100E'] : ['#064E3B', '#0D9488', '#042F2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.passportCardInner, { borderColor: '#D97706' }]}
          >
            {/* Card Watermark & Chip */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.chipRow}>
                <View style={styles.goldSmartChip}>
                  <View style={styles.chipWire1} />
                  <View style={styles.chipWire2} />
                </View>
                <Ionicons name="wifi-outline" size={18} color="#D97706" style={{ marginLeft: 8 }} />
              </View>
              <View style={styles.vipTagPill}>
                <Ionicons name="sparkles" size={12} color="#FBBF24" />
                <Text style={styles.vipTagPillText}>
                  {isManager ? 'OPERATIONS GM' : 'EMERALD PATRON'}
                </Text>
              </View>
            </View>

            {/* Patron Credentials */}
            <View style={styles.patronCredentialsArea}>
              <Text style={styles.patronNumber}>
                {isManager ? 'AUR-MGR-2026-001' : 'AUR-PK-2026-9041'}
              </Text>
              <Text style={styles.patronDisplayName} numberOfLines={1}>
                {user?.name || 'Zainab Malik'}
              </Text>
              <Text style={styles.patronEmailText} numberOfLines={1}>
                {user?.email || 'zainab.malik@aurabistro.pk'}
              </Text>
            </View>

            {/* Card Footer Details */}
            <View style={styles.cardFooterRow}>
              <View>
                <Text style={styles.footerFieldTitle}>RESIDENCE & REGION</Text>
                <Text style={styles.footerFieldValue}>Lahore & Islamabad Lounge</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.footerFieldTitle}>ROLE CLEARANCE</Text>
                <Text style={[styles.footerFieldValue, { color: '#FBBF24' }]}>
                  {user?.role ? user.role.toUpperCase() : 'CUSTOMER'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ─── PATRON DINING METRICS ─── */}
        <View style={styles.metricsMatrix}>
          <View
            style={[
              styles.metricPod,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
              shadows.soft,
            ]}
          >
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={[styles.metricNumber, { color: colors.textPrimary }]}>14</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Visits</Text>
          </View>

          <View
            style={[
              styles.metricPod,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
              shadows.soft,
            ]}
          >
            <Ionicons name="wallet-outline" size={18} color={colors.secondary} />
            <Text style={[styles.metricNumber, { color: colors.textPrimary }]}>48.5k</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Spent (Rs)</Text>
          </View>

          <View
            style={[
              styles.metricPod,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
              shadows.soft,
            ]}
          >
            <Ionicons name="trophy-outline" size={18} color="#10B981" />
            <Text style={[styles.metricNumber, { color: colors.textPrimary }]}>2,450</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Points</Text>
          </View>
        </View>

        {/* ─── ATMOSPHERIC THEME SWITCHER (Question 6 requirement) ─── */}
        <View
          style={[
            styles.loungeCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
            shadows.soft,
          ]}
        >
          <View style={styles.loungeCardHeader}>
            <View style={[styles.sectionIconBadge, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={18}
                color={isDark ? '#F59E0B' : '#0D9488'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.loungeCardTitle, { color: colors.textPrimary }]}>
                Visual Ambiance & Lighting
              </Text>
              <Text style={[styles.loungeCardSubtitle, { color: colors.textSecondary }]}>
                {isDark ? 'Obsidian Midnight Mood' : 'Sunlit Botanical Alabaster'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
            />
          </View>
        </View>

        {/* ─── CONCIERGE DINING PREFERENCES ─── */}
        <View
          style={[
            styles.loungeCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
            shadows.soft,
          ]}
        >
          <Text style={[styles.sectionSmallHeading, { color: colors.textMuted }]}>
            CONCIERGE DINING PREFERENCES
          </Text>
          <View style={styles.prefsChipRow}>
            {['Chef Counter', 'Halal Artisan', 'Botanical Teas', 'Window Atrium', 'Medium Rare', 'Sparkling Water'].map(
              (pref) => {
                const active = dietaryPrefs.includes(pref);
                return (
                  <TouchableOpacity
                    key={pref}
                    onPress={() => togglePref(pref)}
                    style={[
                      styles.prefChip,
                      {
                        backgroundColor: active ? colors.primary + '18' : colors.surfaceSubtle,
                        borderColor: active ? colors.primary : colors.surfaceBorder,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={active ? 'checkmark-circle' : 'add-circle-outline'}
                      size={14}
                      color={active ? colors.primary : colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.prefChipText,
                        { color: active ? colors.primary : colors.textSecondary },
                      ]}
                    >
                      {pref}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>

        {/* ─── MANAGER OPERATIONS DIRECT LAUNCH (If Manager) ─── */}
        {isManager && (
          <TouchableOpacity
            onPress={() => navigation.navigate('ManagerDashboard')}
            style={[styles.managerLaunchBtn, shadows.button3D]}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#1E293B', '#0F172A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.managerLaunchGradient}
            >
              <View style={styles.managerLaunchLeft}>
                <View style={styles.chefHatIcon}>
                  <Ionicons name="restaurant" size={20} color="#F59E0B" />
                </View>
                <View>
                  <Text style={styles.managerLaunchTitle}>Kitchen Command & Floor Operations</Text>
                  <Text style={styles.managerLaunchSubtitle}>Live orders, reservations & menu controls</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#F59E0B" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* ─── SECURITY & LOGOUT TERMINAL ─── */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.signOutDeck,
            { backgroundColor: colors.surfaceSubtle, borderColor: colors.error + '40' },
            shadows.soft,
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.signOutLeft}>
            <View style={[styles.signOutIconDisc, { backgroundColor: colors.error + '18' }]}>
              <Ionicons name="shield-outline" size={18} color={colors.error} />
            </View>
            <View>
              <Text style={[styles.signOutText, { color: colors.error }]}>Conclude Patron Session</Text>
              <Text style={[styles.signOutSubtext, { color: colors.textMuted }]}>
                Safely wipe session tokens & return to gate
              </Text>
            </View>
          </View>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // ─── VIP BLACK-TIE PATRON PASSPORT CARD ───
  passportCardOuter: {
    borderRadius: 22,
    marginBottom: 18,
  },
  passportCardInner: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 20,
    minHeight: 185,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldSmartChip: {
    width: 32,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    padding: 3,
    justifyContent: 'space-between',
  },
  chipWire1: {
    height: 1.5,
    backgroundColor: '#B45309',
    borderRadius: 1,
  },
  chipWire2: {
    height: 1.5,
    backgroundColor: '#B45309',
    borderRadius: 1,
  },
  vipTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.25)',
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
  },
  vipTagPillText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  patronCredentialsArea: {
    marginVertical: 12,
  },
  patronNumber: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  patronDisplayName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  patronEmailText: {
    color: '#2DD4BF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
  },
  footerFieldTitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  footerFieldValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },

  // ─── METRIC PODS ───
  metricsMatrix: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricPod: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },

  // ─── LOUNGE CARDS ───
  loungeCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
  },
  loungeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  loungeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  loungeCardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionSmallHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  prefsChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prefChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  prefChipText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // ─── MANAGER LAUNCH ───
  managerLaunchBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D97706',
  },
  managerLaunchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  managerLaunchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chefHatIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  managerLaunchTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  managerLaunchSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },

  // ─── SIGN OUT ───
  signOutDeck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginTop: 6,
  },
  signOutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutIconDisc: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '800',
  },
  signOutSubtext: {
    fontSize: 11,
    marginTop: 2,
  },
});
