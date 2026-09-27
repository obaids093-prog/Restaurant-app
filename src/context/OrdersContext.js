import React, { createContext, useContext, useReducer, useEffect } from 'react';
import safeStorage from '../utils/safeStorage';

export const OrdersContext = createContext(null);

const ORDERS_STORAGE_KEY = '@aura_orders_registry';

// Initial sample orders for immediate manager and tracking demonstration
const initialOrders = [
  {
    id: 'ORD-8419',
    customerId: 'usr_c1',
    customerName: 'Zainab Malik',
    type: 'Dine-in',
    tableNumber: 'Table A-01 (Atrium Glasshouse Window)',
    pickupTime: '',
    items: [
      { id: 'art_m1', name: 'Prime Black Angus Tenderloin', price: 3650, quantity: 1, note: 'Medium Rare' },
      { id: 'art_b1', name: 'Botanical Yuzu & Elderflower Spritz', price: 680, quantity: 2, note: 'Extra ice' },
    ],
    total: 5010,
    status: 'Preparing', // 'Pending' | 'Preparing' | 'Ready' | 'Served'
    timestamp: '7:45 PM',
    createdAt: Date.now() - 15000,
  },
  {
    id: 'ORD-9104',
    customerId: 'usr_c2',
    customerName: 'Zayn Ahmed',
    type: 'Takeaway',
    tableNumber: '',
    pickupTime: 'In 20 minutes',
    items: [
      { id: 'art_d1', name: 'Valrhona Grand Cru Fondant', price: 1100, quantity: 2, note: 'Warm gelato separate' },
    ],
    total: 2530,
    status: 'Pending',
    timestamp: '7:58 PM',
    createdAt: Date.now() - 5000,
  }
];

function ordersReducer(state, action) {
  switch (action.type) {
    case 'SET_ORDERS':
      return action.payload;

    case 'CREATE_ORDER': {
      const newOrder = action.payload;
      return [newOrder, ...state];
    }

    case 'UPDATE_STATUS': {
      const { orderId, nextStatus } = action.payload;
      return state.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: nextStatus };
        }
        return order;
      });
    }

    case 'CANCEL_ORDER': {
      const { orderId } = action.payload;
      return state.filter((order) => order.id !== orderId);
    }

    default:
      return state;
  }
}

export const OrdersProvider = ({ children }) => {
  const [orders, dispatch] = useReducer(ordersReducer, initialOrders);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Restore orders from storage on launch
  useEffect(() => {
    (async () => {
      try {
        const stored = await safeStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) {
          dispatch({ type: 'SET_ORDERS', payload: JSON.parse(stored) });
        }
      } catch (e) {
        console.warn('Failed to load orders', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // Persist orders on state change
  useEffect(() => {
    if (isLoaded) {
      safeStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders)).catch((e) =>
        console.warn('Failed to persist orders', e)
      );
    }
  }, [orders, isLoaded]);

  const createOrder = (orderData) => {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id,
      ...orderData,
      status: 'Pending',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };
    dispatch({ type: 'CREATE_ORDER', payload: newOrder });
    return newOrder;
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { orderId, nextStatus } });
  };

  const cancelOrder = (orderId) => {
    dispatch({ type: 'CANCEL_ORDER', payload: { orderId } });
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
