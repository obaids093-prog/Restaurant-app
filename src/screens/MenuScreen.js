import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';
import { mockMenuItems } from '../data/menu';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];
const SORT_OPTIONS = [
  { id: 'default', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'name-asc', label: 'Name: A to Z' },
];

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHITECTURAL COMMENTARY: WHEN useMemo / useCallback SHOULD NOT BE USED
 * ─────────────────────────────────────────────────────────────────────────────
 * useMemo and useCallback introduce overhead: JavaScript must allocate dependency
 * arrays, retain previous values in memory, and execute shallow comparison checks
 * on every render.
 *
 * DO NOT use them for:
 * 1. Cheap primitives or trivial computations (e.g., simple string concatenation,
 *    basic arithmetic, filtering arrays with fewer than ~50 items). The overhead
 *    of cache lookup exceeds the cost of recalculation.
 * 2. Unstable dependencies: If dependencies change on every render, the memoization
 *    cache will miss every time, rendering the caching effort purely wasteful.
 * 3. Components not wrapped in React.memo: Passing a useCallback handler to a
 *    standard component provides zero performance gain because standard components
 *    re-render whenever their parent renders regardless of prop equality.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default function MenuScreen({ navigation }) {
  const { colors, isDark, shadows } = useTheme();
  const { user } = useAuth();
  const { addItem, totalItemCount } = useCart();

  // Task 3: Render count tracker using useRef
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // Base state
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Task 6: Single state array of favourite item IDs
  const [favouriteIds, setFavouriteIds] = useState(['m1', 'm5', 'm10']);

  // Search states & refs
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Wagyu', 'Truffle', 'Tiramisu', 'Latte']);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const searchInputRef = useRef(null);
  const flatListRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const prevQueryRef = useRef('');
  const loadTimerRef = useRef(null);
  const backToTopAnim = useRef(new Animated.Value(0)).current;

  // Initial Menu Fetch (1.5s simulated Promise with unmount cleanup)
  const loadMenuData = (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
    }

    const fetchPromise = new Promise((resolve) => {
      loadTimerRef.current = setTimeout(() => {
        resolve(mockMenuItems);
      }, 1500);
    });

    fetchPromise
      .then((data) => {
        setMenuItems(data);
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch menu items.');
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadMenuData();
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Debounced search input handler (400ms delay)
  const handleSearchTextChange = (text) => {
    setSearchQuery(text);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      const trimmed = text.trim();
      if (prevQueryRef.current !== trimmed) {
        prevQueryRef.current = trimmed;
        setDebouncedQuery(trimmed);

        if (trimmed.length > 1) {
          setRecentSearches((prev) => {
            const exists = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
            return [trimmed, ...exists].slice(0, 5);
          });
        }
      }
    }, 400);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    prevQueryRef.current = '';
    searchInputRef.current?.focus();
  };

  const handleSelectRecentSearch = (term) => {
    setSearchQuery(term);
    setDebouncedQuery(term);
    prevQueryRef.current = term;
    setIsSearchFocused(false);
  };

  /**
   * ───────────────────────────────────────────────────────────────────────────
   * WHY DERIVED DATA SHOULD NOT BE STORED IN STATE (Task 6 requirement):
   *
   * Storing filtered/sorted items in separate state creates redundant state
   * synchronization bugs: any change to source data (menuItems) requires manual
   * state updates in multiple places. If a developer forgets to sync, data drifts.
   * Furthermore, calling setState inside an effect causes an extra cascading render
   * cycle (render with old filtered data -> effect runs -> setState -> second render).
   *
   * Computing derived data synchronously with useMemo guarantees immediate
   * mathematical consistency in a single render pass without state drift.
   * ───────────────────────────────────────────────────────────────────────────
   */
  const displayedItems = useMemo(() => {
    let result = [...menuItems];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 2. Search Query Filter
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // 3. Sorting Options
    switch (selectedSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep default curated order
        break;
    }

    return result;
  }, [menuItems, selectedCategory, debouncedQuery, selectedSort]);

  // Stable handlers passed to MenuItemCard via useCallback
  const handleAddToCart = useCallback(
    (item) => {
      if (!item.isAvailable) {
        Alert.alert('Item Sold Out', `${item.name} is currently out of stock.`);
        return;
      }
      addItem(item);
      Alert.alert('Added to Cart', `${item.name} (Rs. ${item.price.toLocaleString()}) added to your tray.`);
    },
    [addItem]
  );

  const handleToggleFavourite = useCallback((id) => {
    setFavouriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Update Navigation Header Title with dynamic count
  useEffect(() => {
    navigation.setOptions({
      title: `Gourmet Menu (${displayedItems.length})`,
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {/* Debug Render Count Label */}
          <View style={[styles.renderBadge, { backgroundColor: colors.surfaceSubtle, borderColor: colors.surfaceBorder }]}>
            <Text style={[styles.renderBadgeText, { color: colors.textMuted }]}>
              r:{renderCountRef.current}
            </Text>
          </View>

          {/* Role Pill */}
          <View style={[styles.customerRolePill, { backgroundColor: colors.badge }]}>
            <Ionicons name="sparkles" size={12} color={colors.primary} />
            <Text style={[styles.customerRoleText, { color: colors.badgeText }]}>
              {user?.role === 'manager' ? 'MANAGER' : 'GUEST'}
            </Text>
          </View>
        </View>
      ),
    });
  }, [displayedItems.length, navigation, colors, user]);

  // Scroll Handler for Back-to-Top Button
  const handleScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const shouldShow = scrollOffset > 300;

    if (shouldShow !== showBackToTop) {
      setShowBackToTop(shouldShow);
      Animated.spring(backToTopAnim, {
        toValue: shouldShow ? 1 : 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Category Chip Component
  const renderCategoryChip = (cat) => {
    const isSelected = selectedCategory === cat;
    const count =
      cat === 'All'
        ? menuItems.length
        : menuItems.filter((m) => m.category === cat).length;

    return (
      <TouchableOpacity
        key={cat}
        onPress={() => setSelectedCategory(cat)}
        style={[
          styles.categoryChip,
          {
            backgroundColor: isSelected ? colors.primary : colors.surface,
            borderColor: isSelected ? colors.primary : colors.surfaceBorder,
          },
          isSelected && shadows.button3D,
        ]}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.categoryChipText,
            { color: isSelected ? '#FFFFFF' : colors.textSecondary },
          ]}
        >
          {cat}
        </Text>
        <View
          style={[
            styles.chipBadge,
            {
              backgroundColor: isSelected
                ? 'rgba(255, 255, 255, 0.25)'
                : colors.surfaceSubtle,
            },
          ]}
        >
          <Text
            style={[
              styles.chipBadgeText,
              { color: isSelected ? '#FFFFFF' : colors.textMuted },
            ]}
          >
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // FlatList Render Item
  const renderItem = ({ item }) => {
    const isFavourite = favouriteIds.includes(item.id);
    return (
      <MenuItemCard
        item={item}
        isFavourite={isFavourite}
        onAddToCart={handleAddToCart}
        onToggleFavourite={handleToggleFavourite}
        colors={colors}
        shadows={shadows}
      />
    );
  };

  // ─── LOADING STATE ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={[styles.stateContainer, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={[styles.loadingBox, { backgroundColor: colors.card }, shadows.deep3D]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.stateHeading, { color: colors.textPrimary }]}>
            Preparing The Menu
          </Text>
          <Text style={[styles.stateSubheading, { color: colors.textSecondary }]}>
            Fetching artisan specials and kitchen inventory...
          </Text>
        </View>
      </View>
    );
  }

  // ─── ERROR STATE WITH RETRY ───────────────────────────────────────────────
  if (error) {
    return (
      <View style={[styles.stateContainer, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={[styles.loadingBox, { backgroundColor: colors.card }, shadows.deep3D]}>
          <Ionicons name="cloud-offline-outline" size={54} color={colors.error} />
          <Text style={[styles.stateHeading, { color: colors.textPrimary }]}>
            Connection Interrupted
          </Text>
          <Text style={[styles.stateSubheading, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity
            onPress={() => loadMenuData()}
            style={[styles.retryBtn, { backgroundColor: colors.primary }, shadows.button3D]}
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.retryBtnText}>Retry Fetch</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── MAIN CONTENT ─────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <FlatList
        ref={flatListRef}
        data={displayedItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadMenuData(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.listHeaderWrapper}>
            {/* Header Title */}
            <View style={styles.bannerRow}>
              <Text style={[styles.welcomeGreeting, { color: colors.textPrimary }]}>
                Culinary Showcase
              </Text>
              <Text style={[styles.welcomeSubtext, { color: colors.textSecondary }]}>
                Explore artisan appetizers, prime steaks, desserts, and craft drinks.
              </Text>
            </View>

            {/* SEARCH BAR (Task 3) */}
            <View
              style={[
                styles.searchBarWrapper,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: isSearchFocused ? colors.primary : colors.inputBorder,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => searchInputRef.current?.focus()}
                activeOpacity={0.7}
                style={styles.searchIconBtn}
              >
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={isSearchFocused ? colors.primary : colors.textMuted}
                />
              </TouchableOpacity>

              <TextInput
                ref={searchInputRef}
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search wagyu, truffle, tiramisu, latte..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={handleSearchTextChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                returnKeyType="search"
              />

              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearSearch}
                  style={styles.clearBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* RECENT SEARCH SUGGESTIONS */}
            {isSearchFocused && !searchQuery && recentSearches.length > 0 && (
              <View style={styles.recentSearchesBox}>
                <Text style={[styles.recentTitle, { color: colors.textMuted }]}>
                  RECENT CULINARY SEARCHES
                </Text>
                <View style={styles.recentChipsRow}>
                  {recentSearches.map((term, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSelectRecentSearch(term)}
                      style={[
                        styles.recentChip,
                        { backgroundColor: colors.surfaceSubtle, borderColor: colors.surfaceBorder },
                      ]}
                    >
                      <Ionicons name="time-outline" size={12} color={colors.primary} />
                      <Text style={[styles.recentChipText, { color: colors.textPrimary }]}>
                        {term}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* HORIZONTAL CATEGORY CHIPS */}
            <View style={styles.chipsContainer}>
              <FlatList
                horizontal
                data={CATEGORIES}
                keyExtractor={(cat) => cat}
                renderItem={({ item }) => renderCategoryChip(item)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsList}
              />
            </View>

            {/* SORTING CONTROLS BAR (Task 6) */}
            <View style={styles.sortBar}>
              <Text style={[styles.sortLabel, { color: colors.textMuted }]}>
                Showing {displayedItems.length} delicacies
              </Text>

              <TouchableOpacity
                onPress={() => setShowSortDropdown(!showSortDropdown)}
                style={[
                  styles.sortButton,
                  { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                ]}
                activeOpacity={0.8}
              >
                <Ionicons name="swap-vertical" size={14} color={colors.primary} />
                <Text style={[styles.sortButtonText, { color: colors.textPrimary }]}>
                  {SORT_OPTIONS.find((s) => s.id === selectedSort)?.label}
                </Text>
                <Ionicons
                  name={showSortDropdown ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* SORT SELECTION DROPDOWN */}
            {showSortDropdown && (
              <View
                style={[
                  styles.sortDropdown,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  shadows.medium3D,
                ]}
              >
                {SORT_OPTIONS.map((opt) => {
                  const isOptSelected = selectedSort === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => {
                        setSelectedSort(opt.id);
                        setShowSortDropdown(false);
                      }}
                      style={[
                        styles.sortDropdownItem,
                        isOptSelected && { backgroundColor: colors.surfaceSubtle },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sortItemText,
                          {
                            color: isOptSelected ? colors.primary : colors.textPrimary,
                            fontWeight: isOptSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {isOptSelected && (
                        <Ionicons name="checkmark" size={16} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: colors.card }, shadows.soft]}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No Matches Found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              No items match "{debouncedQuery || searchQuery}" in {selectedCategory}.
            </Text>
            <TouchableOpacity
              onPress={() => {
                handleClearSearch();
                setSelectedCategory('All');
                setSelectedSort('default');
              }}
              style={[styles.resetSearchBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.surfaceBorder }]}
            >
              <Text style={[styles.resetSearchText, { color: colors.primary }]}>
                Reset Filter & Search
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* FLOATING "BACK TO TOP" BUTTON */}
      <Animated.View
        style={[
          styles.floatingBackToTop,
          {
            transform: [
              { scale: backToTopAnim },
              {
                translateY: backToTopAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0],
                }),
              },
            ],
          },
          shadows.button3D,
        ]}
      >
        <TouchableOpacity
          onPress={scrollToTop}
          style={[styles.backToTopButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-up" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingBox: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(230, 81, 0, 0.15)',
  },
  stateHeading: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
    letterSpacing: -0.3,
  },
  stateSubheading: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 20,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    gap: 8,
  },
  renderBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  renderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  customerRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  customerRoleText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.6,
  },
  listContent: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  listHeaderWrapper: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  bannerRow: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  welcomeGreeting: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  welcomeSubtext: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  searchIconBtn: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  recentSearchesBox: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  recentTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  recentChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  recentChipText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  chipsContainer: {
    marginBottom: 12,
  },
  chipsList: {
    paddingVertical: 4,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  chipBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sortDropdown: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 6,
    marginBottom: 12,
  },
  sortDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sortItemText: {
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 20,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetSearchBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  resetSearchText: {
    fontSize: 13,
    fontWeight: '700',
  },
  floatingBackToTop: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  backToTopButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
