import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/SafeLinearGradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useForm } from '../hooks/useForm';
import { mockUsers } from '../data/users';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  // Theme & Auth Context
  const { colors, isDark, toggleTheme, shadows } = useTheme();
  const { login, signup } = useAuth();

  // Mode state variable: 'login' or 'signup'
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  // Question 9 requirement: Custom useForm hook integration
  const validateForm = useCallback(
    (vals) => {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const hasDigitRegex = /\d/;

      // Email validation
      if (!vals.email || !vals.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!emailRegex.test(vals.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }

      // Password validation (min 8 chars, at least 1 digit)
      if (!vals.password) {
        newErrors.password = 'Password is required.';
      } else if (vals.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long.';
      } else if (!hasDigitRegex.test(vals.password)) {
        newErrors.password = 'Password must include at least one numeric digit (0-9).';
      }

      // Signup-only validations
      if (mode === 'signup') {
        if (!vals.name || !vals.name.trim()) {
          newErrors.name = 'Full name is required.';
        }

        if (!vals.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password.';
        } else if (vals.password !== vals.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match.';
        }
      }

      return newErrors;
    },
    [mode]
  );

  const {
    values,
    errors,
    handleChange,
    handleSubmit: handleFormSubmit,
    reset,
    setValues,
  } = useForm(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
    },
    validateForm
  );

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  // 3D Animation refs
  const flipAnim = useRef(new Animated.Value(0)).current; // 0 for login, 1 for signup
  const buttonScale = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(0.96)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance spring
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Floating 3D ambient effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: -8,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle breathing pulse for gold accents
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Mode toggle with 3D Flip animation
  const handleToggleMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    reset({
      name: '',
      email: values.email || '',
      password: '',
      confirmPassword: '',
      role: 'customer',
    });

    Animated.spring(flipAnim, {
      toValue: newMode === 'signup' ? 1 : 0,
      friction: 8,
      tension: 45,
      useNativeDriver: true,
    }).start();
  };

  // Interpolated 3D transforms
  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const cardTranslateY = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -12, 0],
  });

  // Quick autofill for VIP profiles
  const autofillUser = (presetUser, passKey) => {
    setSelectedPass(passKey);
    setMode('login');
    setValues({
      name: '',
      email: presetUser.email,
      password: presetUser.password,
      confirmPassword: '',
      role: presetUser.role || 'customer',
    });
  };

  // Submit Handler executing via useForm's handleSubmit
  const onFormValid = async (formValues) => {
    setIsSubmitting(true);

    // Button press 3D bounce
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.94, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    try {
      if (mode === 'login') {
        const loggedUser = await login(formValues.email, formValues.password);
        if (loggedUser.role === 'manager') {
          navigation.navigate('ManagerDashboard');
        } else {
          navigation.navigate('CustomerApp', { screen: 'Menu' });
        }
      } else {
        const newUser = await signup({
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
          role: formValues.role,
        });
        Alert.alert('Patron Account Created', `Welcome to AURA, ${newUser.name}! Your table is ready.`);
        if (newUser.role === 'manager') {
          navigation.navigate('ManagerDashboard');
        } else {
          navigation.navigate('CustomerApp', { screen: 'Menu' });
        }
      }
    } catch (err) {
      Alert.alert(
        'Authentication Error',
        err.message || 'Unable to authenticate credentials with the AURA registry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    handleFormSubmit(onFormValid);
  };

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Atmospheric 3D lighting orbs */}
      <View
        style={[
          styles.ambientOrb1,
          { backgroundColor: isDark ? 'rgba(13, 148, 136, 0.16)' : 'rgba(20, 184, 166, 0.10)' },
        ]}
      />
      <View
        style={[
          styles.ambientOrb2,
          { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.12)' : 'rgba(251, 191, 36, 0.08)' },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── BESPOKE ARCHITECTURAL HEADER ─── */}
          <View style={styles.heroHeader}>
            <View style={styles.heroTopRow}>
              {/* Grand Brand Medallion */}
              <View style={styles.medallionWrapper}>
                <LinearGradient
                  colors={['#D97706', '#0D9488']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.crestOuterRing, shadows.button3D]}
                >
                  <View style={[styles.crestInnerCore, { backgroundColor: colors.card }]}>
                    <Text style={[styles.crestLetter, { color: colors.primary }]}>A</Text>
                  </View>
                </LinearGradient>
                <View style={styles.brandTextGroup}>
                  <Text style={[styles.brandTitleText, { color: colors.textPrimary }]}>A U R A</Text>
                  <Text style={[styles.brandSubtitleText, { color: colors.secondary }]}>
                    ARTISAN KITCHEN & BOTANICA
                  </Text>
                </View>
              </View>

              {/* Theme Toggle Button */}
              <TouchableOpacity
                onPress={toggleTheme}
                style={[
                  styles.themeJewelBtn,
                  { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                  shadows.soft,
                ]}
                accessibilityLabel="Toggle Theme"
              >
                <Ionicons
                  name={isDark ? 'sunny-outline' : 'moon-outline'}
                  size={20}
                  color={isDark ? '#F59E0B' : '#0D9488'}
                />
              </TouchableOpacity>
            </View>

            {/* Live Service Ribbon */}
            <Animated.View
              style={[
                styles.serviceRibbon,
                {
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                  borderColor: colors.cardBorder,
                  transform: [{ translateY: floatingAnim }],
                },
                shadows.soft,
              ]}
            >
              <View style={styles.livePulseDot} />
              <Text style={[styles.serviceRibbonText, { color: colors.textSecondary }]}>
                Executive Evening Service • Live Reservations Open
              </Text>
            </Animated.View>
          </View>

          {/* ─── SLIDING SEGMENTED FLOOR SWITCHER ─── */}
          <View
            style={[
              styles.segmentTrack,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.surfaceBorder },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleToggleMode('login')}
              style={[
                styles.segmentItem,
                mode === 'login' && [
                  styles.activeSegmentItem,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  shadows.medium3D,
                ],
              ]}
              activeOpacity={0.8}
            >
              <Ionicons
                name="key-outline"
                size={17}
                color={mode === 'login' ? colors.primary : colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.segmentLabel,
                  { color: mode === 'login' ? colors.textPrimary : colors.textMuted },
                ]}
              >
                Patron Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleToggleMode('signup')}
              style={[
                styles.segmentItem,
                mode === 'signup' && [
                  styles.activeSegmentItem,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  shadows.medium3D,
                ],
              ]}
              activeOpacity={0.8}
            >
              <Ionicons
                name="ribbon-outline"
                size={17}
                color={mode === 'signup' ? colors.primary : colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.segmentLabel,
                  { color: mode === 'signup' ? colors.textPrimary : colors.textMuted },
                ]}
              >
                New Registration
              </Text>
            </TouchableOpacity>
          </View>

          {/* ─── 3D ELEVATED ISOMETRIC CARD ─── */}
          <Animated.View
            style={[
              styles.chassisCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
                transform: [
                  { scale: cardScale },
                  { translateY: cardTranslateY },
                  { rotateY: rotateY },
                ],
              },
              shadows.deep3D,
            ]}
          >
            {/* Card Header Line */}
            <View style={styles.cardHeaderArea}>
              <View style={styles.goldPillarAccent} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  {mode === 'login' ? 'Patron Authentication' : 'Create Dining Membership'}
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  {mode === 'login'
                    ? 'Access table bookings, artisan menu tray & kitchen status.'
                    : 'Register as an esteemed Dining Patron or Operations Manager.'}
                </Text>
              </View>
            </View>

            {/* FULL NAME (Signup only) */}
            {mode === 'signup' && (
              <View style={styles.capsuleField}>
                <Text style={[styles.capsuleTag, { color: colors.textMuted }]}>PATRON FULL NAME</Text>
                <View
                  style={[
                    styles.capsuleInputBox,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: errors.name ? colors.error : colors.inputBorder,
                    },
                  ]}
                >
                  <View style={[styles.capsuleIconPocket, { backgroundColor: colors.surfaceSubtle }]}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={errors.name ? colors.error : colors.primary}
                    />
                  </View>
                  <TextInput
                    style={[styles.capsuleTextInput, { color: colors.textPrimary }]}
                    placeholder="e.g. Zainab Malik"
                    placeholderTextColor={colors.textMuted}
                    value={values.name}
                    onChangeText={(val) => handleChange('name', val)}
                    autoCapitalize="words"
                    editable={!isSubmitting}
                  />
                </View>
                {errors.name && (
                  <View style={styles.inlineErrorRow}>
                    <Ionicons name="alert-circle" size={13} color={colors.error} />
                    <Text style={[styles.inlineErrorText, { color: colors.error }]}>
                      {errors.name}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* EMAIL ADDRESS */}
            <View style={styles.capsuleField}>
              <Text style={[styles.capsuleTag, { color: colors.textMuted }]}>
                REGISTERED EMAIL IDENTIFIER
              </Text>
              <View
                style={[
                  styles.capsuleInputBox,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: errors.email ? colors.error : colors.inputBorder,
                  },
                ]}
              >
                <View style={[styles.capsuleIconPocket, { backgroundColor: colors.surfaceSubtle }]}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={errors.email ? colors.error : colors.primary}
                  />
                </View>
                <TextInput
                  style={[styles.capsuleTextInput, { color: colors.textPrimary }]}
                  placeholder="e.g. zainab.malik@aurabistro.pk"
                  placeholderTextColor={colors.textMuted}
                  value={values.email}
                  onChangeText={(val) => handleChange('email', val)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                />
              </View>
              {errors.email && (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle" size={13} color={colors.error} />
                  <Text style={[styles.inlineErrorText, { color: colors.error }]}>
                    {errors.email}
                  </Text>
                </View>
              )}
            </View>

            {/* PASSWORD */}
            <View style={styles.capsuleField}>
              <Text style={[styles.capsuleTag, { color: colors.textMuted }]}>
                SECURITY CIPHER (MIN. 8 CHARS & 1 DIGIT)
              </Text>
              <View
                style={[
                  styles.capsuleInputBox,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: errors.password ? colors.error : colors.inputBorder,
                  },
                ]}
              >
                <View style={[styles.capsuleIconPocket, { backgroundColor: colors.surfaceSubtle }]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={errors.password ? colors.error : colors.primary}
                  />
                </View>
                <TextInput
                  style={[styles.capsuleTextInput, { color: colors.textPrimary }]}
                  placeholder="Enter your security cipher"
                  placeholderTextColor={colors.textMuted}
                  value={values.password}
                  onChangeText={(val) => handleChange('password', val)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeToggleBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <View style={styles.inlineErrorRow}>
                  <Ionicons name="alert-circle" size={13} color={colors.error} />
                  <Text style={[styles.inlineErrorText, { color: colors.error }]}>
                    {errors.password}
                  </Text>
                </View>
              )}
            </View>

            {/* CONFIRM PASSWORD (Signup only) */}
            {mode === 'signup' && (
              <View style={styles.capsuleField}>
                <Text style={[styles.capsuleTag, { color: colors.textMuted }]}>
                  RE-ENTER CIPHER TO VERIFY
                </Text>
                <View
                  style={[
                    styles.capsuleInputBox,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: errors.confirmPassword ? colors.error : colors.inputBorder,
                    },
                  ]}
                >
                  <View style={[styles.capsuleIconPocket, { backgroundColor: colors.surfaceSubtle }]}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={18}
                      color={errors.confirmPassword ? colors.error : colors.primary}
                    />
                  </View>
                  <TextInput
                    style={[styles.capsuleTextInput, { color: colors.textPrimary }]}
                    placeholder="Verify password"
                    placeholderTextColor={colors.textMuted}
                    value={values.confirmPassword}
                    onChangeText={(val) => handleChange('confirmPassword', val)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!isSubmitting}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeToggleBtn}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <View style={styles.inlineErrorRow}>
                    <Ionicons name="alert-circle" size={13} color={colors.error} />
                    <Text style={[styles.inlineErrorText, { color: colors.error }]}>
                      {errors.confirmPassword}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* ROLE SELECTOR (Signup only) */}
            {mode === 'signup' && (
              <View style={styles.capsuleField}>
                <Text style={[styles.capsuleTag, { color: colors.textMuted }]}>
                  SELECT CREDENTIAL LEVEL
                </Text>
                <View style={styles.roleChoiceDeck}>
                  {/* Customer Role */}
                  <TouchableOpacity
                    onPress={() => handleChange('role', 'customer')}
                    style={[
                      styles.roleChoiceCard,
                      {
                        backgroundColor:
                          values.role === 'customer' ? colors.primary + '18' : colors.inputBackground,
                        borderColor:
                          values.role === 'customer' ? colors.primary : colors.inputBorder,
                      },
                      values.role === 'customer' && shadows.soft,
                    ]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.roleChoiceHeader}>
                      <Ionicons
                        name="restaurant-outline"
                        size={22}
                        color={values.role === 'customer' ? colors.primary : colors.textMuted}
                      />
                      {values.role === 'customer' && (
                        <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.roleChoiceTitle,
                        { color: values.role === 'customer' ? colors.primary : colors.textPrimary },
                      ]}
                    >
                      Dining Patron
                    </Text>
                    <Text style={[styles.roleChoiceDesc, { color: colors.textMuted }]}>
                      Reserve tables & order
                    </Text>
                  </TouchableOpacity>

                  {/* Manager Role */}
                  <TouchableOpacity
                    onPress={() => handleChange('role', 'manager')}
                    style={[
                      styles.roleChoiceCard,
                      {
                        backgroundColor:
                          values.role === 'manager' ? colors.secondary + '20' : colors.inputBackground,
                        borderColor:
                          values.role === 'manager' ? colors.secondary : colors.inputBorder,
                      },
                      values.role === 'manager' && shadows.soft,
                    ]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.roleChoiceHeader}>
                      <Ionicons
                        name="shield-half-outline"
                        size={22}
                        color={values.role === 'manager' ? colors.primaryDark : colors.textMuted}
                      />
                      {values.role === 'manager' && (
                        <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.roleChoiceTitle,
                        { color: values.role === 'manager' ? colors.primaryDark : colors.textPrimary },
                      ]}
                    >
                      General Manager
                    </Text>
                    <Text style={[styles.roleChoiceDesc, { color: colors.textMuted }]}>
                      Kitchen floor & menus
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 3D ACTION BUTTON */}
            <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 6 }}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.88}
                style={[styles.primaryActionBtn, shadows.button3D]}
              >
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0.8 }}
                  style={styles.actionBtnGradient}
                >
                  {isSubmitting ? (
                    <View style={styles.btnLoadingRow}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.btnLoadingText}>
                        {mode === 'login' ? 'Authenticating with AURA...' : 'Issuing VIP Card...'}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.btnContentRow}>
                      <Text style={styles.actionBtnText}>
                        {mode === 'login' ? 'Authorize & Enter Dining' : 'Complete Registration'}
                      </Text>
                      <View style={styles.btnArrowDisc}>
                        <Ionicons name="arrow-forward" size={16} color="#0D9488" />
                      </View>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* ─── VIP FAST-PASS CREDENTIALS DECK ─── */}
            <View style={styles.vipPassSection}>
              <View style={styles.vipPassHeaderRow}>
                <Ionicons name="flash" size={14} color={colors.secondary} />
                <Text style={[styles.vipPassSectionTitle, { color: colors.textMuted }]}>
                  ONE-TOUCH VIP ACCESS KEYCARDS
                </Text>
              </View>

              <View style={styles.vipPassGrid}>
                {/* Patron Card (Zainab Malik) */}
                <TouchableOpacity
                  onPress={() => autofillUser(mockUsers[0], 'diner')}
                  style={[
                    styles.vipPhysicalCard,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: selectedPass === 'diner' ? colors.primary : colors.surfaceBorder,
                    },
                    selectedPass === 'diner' && shadows.soft,
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.vipCardTopRow}>
                    <View style={[styles.chipGraphic, { backgroundColor: colors.secondary }]} />
                    <Text style={[styles.vipBadgeLabel, { color: colors.primary }]}>PATRON VIP</Text>
                  </View>
                  <Text style={[styles.vipCardHolder, { color: colors.textPrimary }]} numberOfLines={1}>
                    Zainab Malik
                  </Text>
                  <Text style={[styles.vipCardRole, { color: colors.textMuted }]}>
                    Diner Pass • Tap to Fill
                  </Text>
                </TouchableOpacity>

                {/* Executive Card (Chef Farhan) */}
                <TouchableOpacity
                  onPress={() => autofillUser(mockUsers[1], 'manager')}
                  style={[
                    styles.vipPhysicalCard,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: selectedPass === 'manager' ? colors.secondary : colors.surfaceBorder,
                    },
                    selectedPass === 'manager' && shadows.soft,
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.vipCardTopRow}>
                    <View style={[styles.chipGraphic, { backgroundColor: '#F59E0B' }]} />
                    <Text style={[styles.vipBadgeLabel, { color: colors.secondary }]}>EXECUTIVE GM</Text>
                  </View>
                  <Text style={[styles.vipCardHolder, { color: colors.textPrimary }]} numberOfLines={1}>
                    Chef Farhan
                  </Text>
                  <Text style={[styles.vipCardRole, { color: colors.textMuted }]}>
                    Manager Key • Tap to Fill
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContent: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 40,
  },
  ambientOrb1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  ambientOrb2: {
    position: 'absolute',
    top: 340,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
  },

  // ─── HERO HEADER ───
  heroHeader: {
    marginBottom: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medallionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crestOuterRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2.5,
    marginRight: 12,
  },
  crestInnerCore: {
    flex: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestLetter: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -1,
  },
  brandTextGroup: {
    justifyContent: 'center',
  },
  brandTitleText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
  },
  brandSubtitleText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  themeJewelBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  serviceRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  serviceRibbonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // ─── SEGMENT TRACK ───
  segmentTrack: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    marginBottom: 18,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
  },
  activeSegmentItem: {
    borderWidth: 1,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // ─── CHASSIS CARD ───
  chassisCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  cardHeaderArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  goldPillarAccent: {
    width: 4,
    height: 38,
    borderRadius: 2,
    backgroundColor: '#D97706',
    marginRight: 12,
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },

  // ─── CAPSULE INPUTS ───
  capsuleField: {
    marginBottom: 16,
  },
  capsuleTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingLeft: 2,
  },
  capsuleInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 8,
    height: 52,
  },
  capsuleIconPocket: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  capsuleTextInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  eyeToggleBtn: {
    padding: 8,
  },
  inlineErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingLeft: 4,
  },
  inlineErrorText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },

  // ─── ROLE SELECTOR ───
  roleChoiceDeck: {
    flexDirection: 'row',
    gap: 10,
  },
  roleChoiceCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
  },
  roleChoiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roleChoiceTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  roleChoiceDesc: {
    fontSize: 11,
    marginTop: 2,
  },

  // ─── 3D ACTION BUTTON ───
  primaryActionBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionBtnGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginRight: 12,
  },
  btnArrowDisc: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnLoadingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },

  // ─── VIP PASS DECK ───
  vipPassSection: {
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  vipPassHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 6,
  },
  vipPassSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  vipPassGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  vipPhysicalCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
  },
  vipCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chipGraphic: {
    width: 22,
    height: 16,
    borderRadius: 3,
    opacity: 0.9,
  },
  vipBadgeLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  vipCardHolder: {
    fontSize: 13,
    fontWeight: '800',
  },
  vipCardRole: {
    fontSize: 10,
    marginTop: 2,
  },
});
