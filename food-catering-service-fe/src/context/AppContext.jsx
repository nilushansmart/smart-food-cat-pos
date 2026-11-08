import { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  CATERING_SETTINGS_DEFAULT,
  INITIAL_CATEGORIES,
} from '../data/mockData';
import { sound } from '../utils/audio';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('stitch_theme_dark');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Current active user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('stitch_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Admin by default
  });

  // Current screen
  const [currentScreen, setCurrentScreen] = useState(() => {
    const role = currentUser?.role || 'Admin';
    if (role === 'Staff') return 'pos';
    if (role === 'Kitchen') return 'kitchen-display';
    if (role === 'Customer') return 'customer-menu';
    return 'dashboard';
  });

  // Persistent data state
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('stitch_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('stitch_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('stitch_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [cateringSettings, setCateringSettings] = useState(() => {
    const saved = localStorage.getItem('stitch_catering_settings');
    return saved ? JSON.parse(saved) : CATERING_SETTINGS_DEFAULT;
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('stitch_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Receipt Modal State
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Audio / notification toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Toast / feedback state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'info' | 'warning' | 'error'
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('stitch_theme_dark', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('stitch_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('stitch_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('stitch_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('stitch_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('stitch_catering_settings', JSON.stringify(cateringSettings));
  }, [cateringSettings]);

  useEffect(() => {
    localStorage.setItem('stitch_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast helper
  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Switch role and navigate to appropriate default view
  const switchRole = (roleName) => {
    const targetUser = users.find((u) => u.role === roleName) || {
      id: `u-${Date.now()}`,
      name: `${roleName} User`,
      role: roleName,
      status: 'Active',
    };
    setCurrentUser(targetUser);

    if (roleName === 'Admin') setCurrentScreen('dashboard');
    else if (roleName === 'Staff') setCurrentScreen('pos');
    else if (roleName === 'Kitchen') setCurrentScreen('kitchen-display');
    else if (roleName === 'Customer') setCurrentScreen('customer-menu');

    showToast(`Switched view to ${roleName}`, 'info');
  };

  // Cart operations
  const addToCart = (item, quantity = 1, specialNote = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.id === item.id && ci.specialNote === specialNote
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [...prev, { ...item, quantity, specialNote }];
    });
    showToast(`Added ${item.name} to cart`, 'success');
  };

  const updateCartQuantity = (itemId, specialNote, delta) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.id === itemId && ci.specialNote === specialNote) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId, specialNote) => {
    setCart((prev) => prev.filter((ci) => !(ci.id === itemId && ci.specialNote === specialNote)));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Confetti helper
  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F97316', '#16A34A', '#FACC15', '#EA580C'],
      });
    } catch {
      // ignore
    }
  };

  // Create & Place Catering Booking / Order
  const createOrder = ({
    customerPhone = '',
    customerName = '',
    orderType = 'Online Delivery',
    eventDate = '',
    eventTime = '',
    eventType = 'Catering Event',
    guestCount = '10-15 Guests',
    deliveryAddress = '',
    notes = '',
    items = null,
  }) => {
    const orderItems = items || cart;
    if (!orderItems || orderItems.length === 0) {
      showToast('Cart is empty. Add catering dishes to place booking.', 'warning');
      return null;
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * (cateringSettings.taxRate || 0.05);
    const total = subtotal + tax;

    // Generate Booking / Order ID (e.g. ORD-1083)
    const nextNum = 1083 + orders.length;
    const newOrder = {
      id: `ORD-${nextNum}`,
      customerName: customerName || (currentUser?.role === 'Customer' ? currentUser.name : 'Online Customer'),
      customerPhone: customerPhone || '+1 (555) 000-0000',
      orderType: orderType || 'Online Delivery',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      eventTime: eventTime || '12:30 PM (Lunch)',
      eventType: eventType || 'Catering Gathering',
      guestCount: guestCount || '10-15 Guests',
      deliveryAddress: deliveryAddress || 'Delivery Address Provided',
      notes: notes || '',
      items: orderItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        specialNote: i.specialNote || '',
      })),
      subtotal,
      tax,
      total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      creatorRole: currentUser.role,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Celebration & Audio
    fireConfetti();
    if (soundEnabled) {
      sound.playSuccessChime();
    }

    // Open receipt preview modal
    setActiveReceiptOrder(newOrder);
    setIsReceiptOpen(true);
    showToast(`Catering Booking #${newOrder.id} placed successfully!`, 'success');

    return newOrder;
  };

  // Update order status (Kanban & List)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
          if (newStatus === 'Completed') {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return ord;
      })
    );

    if (soundEnabled && (newStatus === 'Ready' || newStatus === 'Preparing')) {
      sound.playKitchenChime();
    }
    showToast(`Order #${orderId} moved to ${newStatus}`, 'info');
  };

  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'Cancelled');
  };

  // Menu item operations
  const addMenuItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `m-${Date.now()}`,
      available: true,
      price: parseFloat(itemData.price) || 0,
    };
    setMenuItems((prev) => [newItem, ...prev]);
    showToast(`Added ${newItem.name} to menu`, 'success');
  };

  const updateMenuItem = (updatedItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? { ...updatedItem, price: parseFloat(updatedItem.price) } : item))
    );
    showToast(`Updated ${updatedItem.name}`, 'success');
  };

  const toggleItemAvailability = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  const deleteMenuItem = (itemId) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Menu item removed', 'info');
  };

  // User management
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: `u-${Date.now()}`,
      status: 'Active',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Created user account for ${newUser.name}`, 'success');
  };

  const updateUser = (userData) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userData.id ? { ...u, ...userData } : u))
    );
    showToast(`Updated user ${userData.name}`, 'success');
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
    );
  };

  // Settings
  const updateSettings = (newSettings) => {
    setCateringSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully', 'success');
  };

  // Reset to default mock data
  const resetToMockData = () => {
    localStorage.clear();
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setUsers(INITIAL_USERS);
    setCateringSettings(CATERING_SETTINGS_DEFAULT);
    setCart([]);
    showToast('System data reset to default demo records', 'info');
  };

  const openReceiptModal = (order) => {
    setActiveReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  const closeReceiptModal = () => {
    setIsReceiptOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        currentUser,
        setCurrentUser,
        currentScreen,
        setCurrentScreen,
        switchRole,
        menuItems,
        categories: INITIAL_CATEGORIES,
        orders,
        users,
        cateringSettings,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        addMenuItem,
        updateMenuItem,
        toggleItemAvailability,
        deleteMenuItem,
        addUser,
        updateUser,
        toggleUserStatus,
        updateSettings,
        resetToMockData,
        activeReceiptOrder,
        isReceiptOpen,
        openReceiptModal,
        closeReceiptModal,
        soundEnabled,
        setSoundEnabled,
        toast,
        showToast,
        closeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
