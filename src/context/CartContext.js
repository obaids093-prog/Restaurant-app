import React, { createContext, useContext, useReducer, useEffect } from 'react';
import safeStorage from '../utils/safeStorage';
import { cartReducer, initialCartState } from '../reducers/cartReducer';

export const CartContext = createContext(null);

const CART_STORAGE_KEY = '@aura_cart_state';

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Restore cart on app launch
  useEffect(() => {
    const restoreCart = async () => {
      try {
        const saved = await safeStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.items)) {
            // Restore items
            parsed.items.forEach((item) => {
              dispatch({ type: 'ADD_ITEM', payload: { item } });
            });
            if (parsed.promoCode) {
              try {
                dispatch({ type: 'APPLY_PROMO', payload: { code: parsed.promoCode } });
              } catch (_) {}
            }
          }
        }
      } catch (e) {
        console.warn('Failed to load cart from storage', e);
      }
    };

    restoreCart();
  }, []);

  // Save cart changes to storage
  useEffect(() => {
    (async () => {
      try {
        await safeStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
      } catch (e) {
        console.warn('Failed to persist cart', e);
      }
    })();
  }, [cartState]);

  // Derived live count of all items (e.g. 2 steaks + 1 drink = 3)
  const totalItemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  // Helper action methods
  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: { item } });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const increment = (id) => dispatch({ type: 'INCREMENT', payload: { id } });
  const decrement = (id) => dispatch({ type: 'DECREMENT', payload: { id } });
  const updateNote = (id, note) => dispatch({ type: 'UPDATE_NOTE', payload: { id, note } });
  const applyPromo = (code) => dispatch({ type: 'APPLY_PROMO', payload: { code } });
  const removePromo = () => dispatch({ type: 'REMOVE_PROMO' });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider
      value={{
        cartState,
        dispatch,
        totalItemCount,
        addItem,
        removeItem,
        increment,
        decrement,
        updateNote,
        applyPromo,
        removePromo,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
