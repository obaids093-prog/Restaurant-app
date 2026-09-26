import React from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/SafeLinearGradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme, shadows } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out Confirmation',
      'Are you sure you want to end your current session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Reset navigation stack to Login screen
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
        {/* Profile Header Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
            shadows.deep3D,
          ]}
        >
          <View style={styles.avatarRow}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.avatarFallback}
              >
                <Text style={styles.avatarInitial}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </LinearGradient>
            )}

            <View style={styles.profileTextWrapper}>
              <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
                {user?.name || 'Verified Guest'}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]} numberOfLines={1}>
                {user?.email || 'guest@restauranthaven.com'}
              </Text>

              {/* Role Badge */}
              <View
                style={[
                  styles.roleBadge,
                  {
                    backgroundColor: isManager ? colors.secondary + '25' : colors.badge,
                    borderColor: isManager ? colors.secondary : colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name={isManager ? 'shield-checkmark' : 'fast-food'}
                  size={12}
                  color={isManager ? colors.primaryDark : colors.primary}
                />
                <Text
                  style={[
                    styles.roleBadgeText,
                    { color: isManager ? colors.primaryDark : colors.badgeText },
                  ]}
                >
                  ROLE: {user?.role ? user.role.toUpperCase() : 'CUSTOMER'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* APPEARANCE / THEME TOGGLE CARD */}
        <View
          style={[
            styles.settingsCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
            shadows.soft,
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            APPLICATION THEME
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrapper,
                  { backgroundColor: isDark ? '#261F1A' : '#FFF3E0' },
                ]}
              >
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={20}
                  color={isDark ? '#FFCA28' : '#E65100'}
                />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Text style={[styles.settingSubLabel, { color: colors.textMuted }]}>
                  {isDark ? 'Obsidian luxury palette' : 'Warm ivory aesthetic'}
                </Text>
              </View>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1C4B8', true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
            />
          </View>
        </View>

        {/* ACCOUNT CREDENTIALS & SECURITY CARD */}
        <View
          style={[
            styles.settingsCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
            shadows.soft,
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            SECURITY & ACCOUNT SPECIFICATIONS
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Account ID</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {user?.id || 'SEC-USR-9321'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Registered Phone</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {user?.phone || '0300-1234567'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Session Type</Text>
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={[styles.verifiedText, { color: colors.success }]}>
                Encrypted Mock Session
              </Text>
            </View>
          </View>

          {/* Quick link to Manager Dashboard if user is Manager */}
          {isManager && (
            <TouchableOpacity
              onPress={() => navigation.navigate('ManagerDashboard')}
              style={[
                styles.managerNavBtn,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.surfaceBorder },
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.managerNavBtnLeft}>
                <Ionicons name="construct-outline" size={18} color={colors.secondary} />
                <Text style={[styles.managerNavBtnText, { color: colors.textPrimary }]}>
                  Open Kitchen & Orders Console
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutButton,
            { backgroundColor: colors.surface, borderColor: colors.error + '40' },
            shadows.soft,
          ]}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out of Haven</Text>
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
    maxWidth: 580,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: 'rgba(230, 81, 0, 0.4)',
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  profileTextWrapper: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  settingsCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingSubLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  managerNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
  },
  managerNavBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  managerNavBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1.5,
    marginTop: 10,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
