import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/SafeLinearGradient';

/**
 * Task 6: MenuItemCard wrapped in React.memo
 * Optimization check: Only re-renders when its own props (item, isFavourite, handlers) change.
 */
const MenuItemCard = React.memo(function MenuItemCard({
  item,
  isFavourite,
  onAddToCart,
  onToggleFavourite,
  colors,
  shadows,
}) {
  // Demonstration console.log as required by Task 6:
  console.log(`[PERF - React.memo] Rendered MenuItemCard ID: ${item.id} - ${item.name}`);

  const isAvailable = item.isAvailable;

  return (
    <View
      style={[
        styles.cardWrapper,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          opacity: isAvailable ? 1 : 0.65,
        },
        shadows.medium3D,
      ]}
    >
      {/* Food Imagery */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.foodImage} resizeMode="cover" />

        {/* Daily Special 3D Badge */}
        {item.isSpecial && (
          <LinearGradient
            colors={['#FF6B6B', '#D84315']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.specialBadge, shadows.soft]}
          >
            <Ionicons name="flame" size={13} color="#FFFFFF" />
            <Text style={styles.specialBadgeText}>Daily Special</Text>
          </LinearGradient>
        )}

        {/* Unavailable Overlay */}
        {!isAvailable && (
          <View style={styles.unavailableOverlay}>
            <View style={styles.soldOutBadge}>
              <Ionicons name="close-circle" size={14} color="#FFFFFF" />
              <Text style={styles.soldOutText}>Sold Out Today</Text>
            </View>
          </View>
        )}

        {/* Heart / Favourite Toggle Button */}
        <TouchableOpacity
          onPress={() => onToggleFavourite(item.id)}
          style={[
            styles.favouriteBtn,
            { backgroundColor: isFavourite ? 'rgba(211, 47, 47, 0.95)' : 'rgba(0,0,0,0.6)' },
            shadows.soft,
          ]}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFavourite ? 'heart' : 'heart-outline'}
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Category & Rating Floating Badges */}
        <View style={styles.imageFloatingMeta}>
          <View style={[styles.categoryTag, { backgroundColor: 'rgba(18, 15, 13, 0.8)' }]}>
            <Text style={styles.categoryTagText}>{item.category}</Text>
          </View>
          <View style={[styles.ratingTag, { backgroundColor: 'rgba(18, 15, 13, 0.8)' }]}>
            <Ionicons name="star" size={12} color="#FFCA28" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>

      {/* Card Content Details */}
      <View style={styles.cardContent}>
        <Text
          style={[styles.foodTitle, { color: isAvailable ? colors.textPrimary : colors.textMuted }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <Text style={[styles.foodDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View>
            <Text style={[styles.priceCurrency, { color: colors.primary }]}>
              Rs. <Text style={styles.priceAmount}>{item.price.toLocaleString()}</Text>
            </Text>
            <View style={styles.prepTimeRow}>
              <Ionicons name="time-outline" size={12} color={colors.textMuted} />
              <Text style={[styles.prepTimeText, { color: colors.textMuted }]}>
                {item.prepTime}
              </Text>
            </View>
          </View>

          {/* Add to Order Button */}
          <TouchableOpacity
            onPress={() => onAddToCart(item)}
            disabled={!isAvailable}
            style={[
              styles.addButton,
              { backgroundColor: isAvailable ? colors.primary : colors.inputBorder },
              isAvailable && shadows.button3D,
            ]}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isAvailable ? 'add' : 'ban'}
              size={18}
              color={isAvailable ? '#FFFFFF' : colors.textMuted}
            />
            <Text
              style={[
                styles.addButtonText,
                { color: isAvailable ? '#FFFFFF' : colors.textMuted },
              ]}
            >
              {isAvailable ? 'Add to Cart' : 'Sold Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default MenuItemCard;

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#201A16',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  specialBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  specialBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  favouriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.92)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  soldOutText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
  imageFloatingMeta: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  categoryTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  cardContent: {
    padding: 16,
  },
  foodTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  foodDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.12)',
  },
  priceCurrency: {
    fontSize: 13,
    fontWeight: '700',
  },
  priceAmount: {
    fontSize: 19,
    fontWeight: '900',
  },
  prepTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  prepTimeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 4,
  },
});
