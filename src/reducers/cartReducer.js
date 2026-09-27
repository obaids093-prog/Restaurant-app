/**
 * Pure Cart Reducer
 * Handles state transitions for culinary orders, promos, notes, and item steppers.
 * Guarantees zero mutations by returning new immutable state copies.
 */

export const PROMO_CODES = {
  WELCOME10: 10,  // 10% Off (Assignment required)
  FEAST20: 20,    // 20% Off (Assignment required)
  AURA30: 30,     // 30% Off AURA VIP
  CHEF15: 15,     // 15% Chef Special
  GOURMET30: 30,  // 30% Off VIP
};

export const initialCartState = {
  items: [],
  promoCode: null,
  discountPercent: 0,
};

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action.payload;
      const existingIndex = state.items.findIndex((i) => i.id === item.id);

      if (existingIndex > -1) {
        // Increment quantity of existing item immutably
        const updatedItems = state.items.map((cartItem, index) => {
          if (index === existingIndex) {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          }
          return cartItem;
        });
        return { ...state, items: updatedItems };
      }

      // Add fresh item with quantity 1 and empty special note
      const newItem = {
        ...item,
        quantity: 1,
        note: '',
      };
      return { ...state, items: [...state.items, newItem] };
    }

    case 'REMOVE_ITEM': {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== id),
      };
    }

    case 'INCREMENT': {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        }),
      };
    }

    case 'DECREMENT': {
      const { id } = action.payload;
      const target = state.items.find((item) => item.id === id);

      if (!target) return state;

      // Specification: If quantity reaches 0, remove item from items
      if (target.quantity <= 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        }),
      };
    }

    case 'UPDATE_NOTE': {
      const { id, note } = action.payload;
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === id) {
            return { ...item, note };
          }
          return item;
        }),
      };
    }

    case 'APPLY_PROMO': {
      const { code } = action.payload;
      const cleanCode = code ? code.trim().toUpperCase() : '';

      if (!PROMO_CODES[cleanCode]) {
        throw new Error(`Promo code "${code}" is invalid or expired.`);
      }

      return {
        ...state,
        promoCode: cleanCode,
        discountPercent: PROMO_CODES[cleanCode],
      };
    }

    case 'REMOVE_PROMO': {
      return {
        ...state,
        promoCode: null,
        discountPercent: 0,
      };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        promoCode: null,
        discountPercent: 0,
      };
    }

    default:
      return state;
  }
}
