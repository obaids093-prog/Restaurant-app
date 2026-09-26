import React, { createContext, useContext, useReducer, useEffect } from 'react';
import safeStorage from '../utils/safeStorage';

export const OrdersContext = createContext(null);

const ORDERS_STORAGE_KEY = '@gourmet_haven_orders_registry';

// Initial sample orders for immediate manager and tracking demonstration
const initialOrders = [
  {
    id: 'ORD-8419',
    customerId: 'u1',
    customerName: 'Ayesha Khan',
    type: 'Dine-in',
    tableNumber: 'Table 4 (Patio Garden)',
    pickupTime: '',
    items: [
      { id: 'm5', name: 'Dry-Aged Wagyu Ribeye Steak', price: 3450, quantity: 1, note: 'Medium Rare' },
      { id: 'm13', name: 'Smoked Rosemary Citrus Mocktail', price: 650, quantity: 2, note: 'Extra ice' },
    ],
    total: 4895,
    status: 'Preparing', // 'Pending' | 'Preparing' | 'Ready' | 'Served'
    timestamp: '7:45 PM',
    createdAt: Date.now() - 15000,
  },
  {
    id: 'ORD-9104',
    customerId: 'u3',
    customerName: 'Hamza Ali',
    type: 'Takeaway',
    tableNumber: '',
    pickupTime: 'In 20 minutes',
    items: [
      { id: 'm10', name: 'Belgian Molten Lava Cake', price: 950, quantity: 2, note: 'Warm gelato separate' },
    ],
    total: 2185,
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
