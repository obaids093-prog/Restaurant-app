import React, { createContext, useContext, useState, useEffect } from 'react';
import safeStorage from '../utils/safeStorage';
import { mockMenuItems } from '../data/menu';

export const MenuContext = createContext(null);

const MENU_STORAGE_KEY = '@aura_menu_inventory';

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [isMenuLoaded, setIsMenuLoaded] = useState(false);

  // Restore modified menu from storage
  useEffect(() => {
    (async () => {
      try {
        const stored = await safeStorage.getItem(MENU_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMenuItems(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to load menu edits:', e);
      } finally {
        setIsMenuLoaded(true);
      }
    })();
  }, []);

  // Persist menu edits
  const saveMenu = async (newItems) => {
    setMenuItems(newItems);
    try {
      await safeStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.warn('Failed to save menu edits:', e);
    }
  };

  // 1. Toggle Item Availability (Manager operation)
  const toggleAvailability = (itemId) => {
    const updated = menuItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, isAvailable: !item.isAvailable };
      }
      return item;
    });
    saveMenu(updated);
  };

  // 2. Edit Item Price (Manager operation)
  const updatePrice = (itemId, newPrice) => {
    const updated = menuItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, price: Number(newPrice) };
      }
      return item;
    });
    saveMenu(updated);
  };

  // 3. Add New Item (Manager operation)
  const addMenuItem = (itemData) => {
    const newItem = {
      id: `m_${Date.now()}`,
      ...itemData,
      isSpecial: itemData.isSpecial || false,
      isAvailable: true,
      rating: 5.0,
      prepTime: itemData.prepTime || '15 min',
      image:
        itemData.image ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
    };
    const updated = [newItem, ...menuItems];
    saveMenu(updated);
    return newItem;
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        isMenuLoaded,
        toggleAvailability,
        updatePrice,
        addMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
