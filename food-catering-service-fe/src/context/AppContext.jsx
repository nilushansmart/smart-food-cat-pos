import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  CATERING_SETTINGS_DEFAULT,
  INITIAL_CATEGORIES,
  INITIAL_INGREDIENTS,
  INITIAL_DRIVERS,
  TOP_CUSTOMER_REVIEWS,
} from '../data/mockData';
import { sound } from '../utils/audio';
import {
  authApi,
  categoriesApi,
  menuItemsApi,
  ordersApi,
  usersApi,
} from '../api';

const AppContext = createContext();

// Helper to normalize backend status (e.g., 'PREPARING' -> 'Preparing')
const formatStatus = (status) => {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// Helper to normalize backend order to frontend UI model
const normalizeOrder = (backendOrder) => {
  if (!backendOrder) return null;
  return {
    id: backendOrder.orderNumber || backendOrder.id,
    numericId: backendOrder.id,
    customerName: backendOrder.customerName || 'Online Customer',
    customerPhone: backendOrder.customerPhone || '',
    orderType: backendOrder.orderType === 'SCHEDULED_PICKUP' ? 'Scheduled Pickup' : 'Online Delivery',
    eventDate: backendOrder.eventDate || '',
    eventTime: backendOrder.eventTime || '',
    eventType: backendOrder.eventType || 'Catering Gathering',
    guestCount: backendOrder.guestCount || '10-15 Guests',
    deliveryAddress: backendOrder.deliveryAddress || '',
    deliveryDistanceKm: backendOrder.deliveryDistanceKm || null,
    estimatedDeliveryTime: backendOrder.estimatedDeliveryTime || '',
    notes: backendOrder.notes || '',
    subtotal: Number(backendOrder.subtotal) || 0,
    tax: Number(backendOrder.taxAmount) || 0,
    total: Number(backendOrder.totalAmount) || 0,
    status: formatStatus(backendOrder.status),
    paymentStatus: formatStatus(backendOrder.paymentStatus),
    createdAt: backendOrder.createdAt || new Date().toISOString(),
    completedAt: backendOrder.completedAt || null,
    items: (backendOrder.items || []).map((i) => ({
      id: i.menuItemId || i.id,
      name: i.itemName || i.name,
      price: Number(i.unitPrice || i.price) || 0,
      quantity: i.quantity,
      specialNote: i.specialNote || '',
    })),
  };
};

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

  // Data states
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [cateringSettings, setCateringSettings] = useState(CATERING_SETTINGS_DEFAULT);
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [reviews, setReviews] = useState(TOP_CUSTOMER_REVIEWS);

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

  // Loading indicator for API calls
  const [loading, setLoading] = useState(false);

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

  // Sync data from Backend APIs
  const refreshBackendData = useCallback(async () => {
    try {
      const catRes = await categoriesApi.getAll();
      if (catRes?.data && Array.isArray(catRes.data) && catRes.data.length > 0) {
        setCategories(catRes.data);
      }

      const menuRes = await menuItemsApi.getAll();
      if (menuRes?.data && Array.isArray(menuRes.data) && menuRes.data.length > 0) {
        setMenuItems(
          menuRes.data.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.categoryName || 'Catering Trays',
            categoryId: item.categoryId,
            price: Number(item.price),
            description: item.description,
            imageUrl: item.imageUrl,
            image: item.imageUrl,
            prepTimeMinutes: item.prepTimeMinutes || 15,
            pax: item.pax || 'Group Tray',
            available: item.available,
          }))
        );
      }

      const ordersRes = await ordersApi.getAll();
      const rawOrders = ordersRes?.data?.content || ordersRes?.data;
      if (rawOrders && Array.isArray(rawOrders) && rawOrders.length > 0) {
        setOrders(rawOrders.map(normalizeOrder));
      }

      const token = localStorage.getItem('stitch_token');
      if (token) {
        try {
          const userRes = await usersApi.getAll();
          if (userRes?.data && Array.isArray(userRes.data)) {
            setUsers(
              userRes.data.map((u) => ({
                id: u.id,
                name: u.fullName,
                username: u.username,
                email: u.email,
                phone: u.phone,
                role: formatStatus(u.role?.replace('ROLE_', '')),
                status: u.active ? 'Active' : 'Inactive',
                avatar: `https://images.unsplash.com/photo-${1535713875002 + u.id}?w=120&auto=format&fit=crop&q=80`,
              }))
            );
          }
        } catch {
          // ignore
        }
      }
    } catch {
      // Fallback to initial mock data if backend not reachable
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        const catRes = await categoriesApi.getAll();
        if (active && catRes?.data && Array.isArray(catRes.data) && catRes.data.length > 0) {
          setCategories(catRes.data);
        }

        const menuRes = await menuItemsApi.getAll();
        if (active && menuRes?.data && Array.isArray(menuRes.data) && menuRes.data.length > 0) {
          setMenuItems(
            menuRes.data.map((item) => ({
              id: item.id,
              name: item.name,
              category: item.categoryName || 'Catering Trays',
              categoryId: item.categoryId,
              price: Number(item.price),
              description: item.description,
              imageUrl: item.imageUrl,
              image: item.imageUrl,
              prepTimeMinutes: item.prepTimeMinutes || 15,
              pax: item.pax || 'Group Tray',
              available: item.available,
            }))
          );
        }

        const ordersRes = await ordersApi.getAll();
        const rawOrders = ordersRes?.data?.content || ordersRes?.data;
        if (active && rawOrders && Array.isArray(rawOrders) && rawOrders.length > 0) {
          setOrders(rawOrders.map(normalizeOrder));
        }
      } catch {
        // Fallback
      }
    };

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  // Login via Backend API
  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      if (res?.data) {
        const authData = res.data;
        const token = authData.accessToken || authData.token;
        localStorage.setItem('stitch_token', token);

        const role = formatStatus((authData.role || authData.user?.role)?.replace('ROLE_', ''));
        const userObj = {
          id: authData.userId || authData.user?.id,
          username: authData.username || authData.user?.username,
          name: authData.fullName || authData.user?.fullName,
          email: authData.email || authData.user?.email,
          phone: authData.phone || authData.user?.phone,
          role,
          token,
        };

        setCurrentUser(userObj);
        localStorage.setItem('stitch_current_user', JSON.stringify(userObj));

        // Navigate based on role
        if (role === 'Admin') setCurrentScreen('dashboard');
        else if (role === 'Staff') setCurrentScreen('pos');
        else if (role === 'Kitchen') setCurrentScreen('kitchen-display');
        else if (role === 'Customer') setCurrentScreen('customer-menu');

        showToast(`Welcome back, ${userObj.name}!`, 'success');
        refreshBackendData();
        return { success: true, user: userObj };
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Switch role locally (quick demo switcher)
  const switchRole = async (roleName) => {
    // Try logging in with the predefined accounts on the backend first
    const roleUsernames = {
      Admin: 'admin',
      Staff: 'staff',
      Kitchen: 'kitchen',
      Customer: 'customer',
    };

    const username = roleUsernames[roleName] || roleName.toLowerCase();
    try {
      const res = await authApi.login({ username, password: 'password123' });
      if (res?.data) {
        const token = res.data.accessToken || res.data.token;
        localStorage.setItem('stitch_token', token);
        const userObj = {
          id: res.data.userId || res.data.user?.id,
          username: res.data.username,
          name: res.data.fullName || res.data.user?.fullName,
          role: roleName,
          token,
        };
        setCurrentUser(userObj);
      }
    } catch {
      // Local fallback
      const targetUser = users.find((u) => u.role === roleName) || {
        id: `u-${Date.now()}`,
        name: `${roleName} User`,
        role: roleName,
        status: 'Active',
      };
      setCurrentUser(targetUser);
    }

    if (roleName === 'Admin') setCurrentScreen('dashboard');
    else if (roleName === 'Staff') setCurrentScreen('pos');
    else if (roleName === 'Kitchen') setCurrentScreen('kitchen-display');
    else if (roleName === 'Customer') setCurrentScreen('customer-menu');

    showToast(`Switched active view to ${roleName}`, 'info');
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

  // Create & Place Catering Booking / Order with Backend Integration
  const createOrder = async ({
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

    const payload = {
      customerName: customerName || (currentUser?.role === 'Customer' ? currentUser.name : 'Valued Customer'),
      customerPhone: customerPhone || '+1 (555) 000-0000',
      orderType: orderType === 'Scheduled Pickup' ? 'SCHEDULED_PICKUP' : 'ONLINE_DELIVERY',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      eventTime: eventTime || '12:30 PM (Lunch)',
      eventType: eventType || 'Catering Gathering',
      guestCount: guestCount || '10-15 Guests',
      deliveryAddress: deliveryAddress || 'Address on file',
      paymentMethod: 'CASH_ON_DELIVERY',
      notes: notes || '',
      items: orderItems.map((item) => ({
        menuItemId: Number(item.id) || 1,
        quantity: item.quantity,
        specialNote: item.specialNote || '',
      })),
    };

    let createdOrder = null;

    try {
      const res = await ordersApi.create(payload);
      if (res?.data) {
        createdOrder = normalizeOrder(res.data);
      }
    } catch {
      // Local fallback calculation if backend unavailable
      const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * (cateringSettings.taxRate || 0.05);
      const total = subtotal + tax;
      createdOrder = {
        id: `ORD-${1083 + orders.length}`,
        ...payload,
        items: orderItems,
        subtotal,
        tax,
        total,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
    }

    if (createdOrder) {
      setOrders((prev) => [createdOrder, ...prev]);
      clearCart();
      fireConfetti();
      if (soundEnabled) {
        sound.playSuccessChime();
      }
      setActiveReceiptOrder(createdOrder);
      setIsReceiptOpen(true);
      showToast(`Catering Booking #${createdOrder.id} placed successfully!`, 'success');
    }

    return createdOrder;
  };

  // Update order status (Syncs with /api/orders/{id}/status)
  const updateOrderStatus = async (orderId, newStatus) => {
    const statusUpper = newStatus.toUpperCase();

    // Find numeric ID if available
    const existing = orders.find((o) => o.id === orderId);
    const targetId = existing?.numericId || orderId;

    try {
      await ordersApi.updateStatus(targetId, statusUpper);
    } catch {
      // Proceed locally
    }

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

  // Change priority (Urgent / Normal)
  const updateOrderPriority = (orderId, newPriority) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, priority: newPriority } : o))
    );
    showToast(`Order ${orderId} priority set to ${newPriority}`, 'info');
  };

  // Set or clear order alert
  const updateOrderAlert = (orderId, alertText, hasAlert = true) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, alert: alertText, hasAlert } : o))
    );
    showToast(`Order ${orderId} alert updated`, 'info');
  };

  // Assign delivery driver to order
  const assignDriverToOrder = (orderId, driverName, driverPhone) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              assignedDriver: driverName,
              driverPhone: driverPhone || o.driverPhone,
              status: o.status === 'Ready' ? 'En Route' : o.status,
            }
          : o
      )
    );
    showToast(`Assigned ${driverName} to order ${orderId}`, 'success');
  };

  // Kitchen ingredient stock adjustments
  const updateIngredientStock = (ingredientId, deltaAmount) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === ingredientId) {
          const nextStock = Math.max(0, ing.currentStock + deltaAmount);
          const status = nextStock <= ing.minThreshold ? 'Low Stock' : 'Good';
          return { ...ing, currentStock: nextStock, status };
        }
        return ing;
      })
    );
    showToast('Inventory stock updated', 'info');
  };

  // Add customer review
  const addReview = (reviewData) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      date: 'Just now',
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you for your review!', 'success');
  };

  // Menu item operations with Backend API
  const addMenuItem = async (itemData) => {
    const payload = {
      name: itemData.name,
      categoryId: Number(itemData.categoryId) || 1,
      price: parseFloat(itemData.price) || 10.0,
      description: itemData.description || '',
      imageUrl: itemData.image || itemData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
      prepTimeMinutes: Number(itemData.prepTimeMinutes) || 15,
      pax: itemData.pax || 'Group Portion',
      available: true,
      branchId: 'MAIN',
    };

    try {
      const res = await menuItemsApi.create(payload);
      if (res?.data) {
        const newItem = {
          id: res.data.id,
          name: res.data.name,
          category: res.data.categoryName || 'Catering Trays',
          categoryId: res.data.categoryId,
          price: Number(res.data.price),
          description: res.data.description,
          imageUrl: res.data.imageUrl,
          image: res.data.imageUrl,
          prepTimeMinutes: res.data.prepTimeMinutes,
          pax: res.data.pax,
          available: res.data.available,
        };
        setMenuItems((prev) => [newItem, ...prev]);
        showToast(`Added ${newItem.name} to menu`, 'success');
        return;
      }
    } catch {
      // Local fallback
    }

    const fallbackItem = {
      ...itemData,
      id: Date.now(),
      available: true,
      price: parseFloat(itemData.price) || 0,
    };
    setMenuItems((prev) => [fallbackItem, ...prev]);
    showToast(`Added ${fallbackItem.name} to menu`, 'success');
  };

  const updateMenuItem = async (updatedItem) => {
    const payload = {
      name: updatedItem.name,
      categoryId: Number(updatedItem.categoryId) || 1,
      price: parseFloat(updatedItem.price) || 10.0,
      description: updatedItem.description || '',
      imageUrl: updatedItem.image || updatedItem.imageUrl || '',
      prepTimeMinutes: Number(updatedItem.prepTimeMinutes) || 15,
      pax: updatedItem.pax || 'Group Portion',
      available: updatedItem.available !== undefined ? updatedItem.available : true,
      branchId: 'MAIN',
    };

    try {
      if (typeof updatedItem.id === 'number') {
        await menuItemsApi.update(updatedItem.id, payload);
      }
    } catch {
      // Local fallback
    }

    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? { ...updatedItem, price: parseFloat(updatedItem.price) } : item))
    );
    showToast(`Updated ${updatedItem.name}`, 'success');
  };

  const toggleItemAvailability = async (itemId) => {
    try {
      if (typeof itemId === 'number') {
        await menuItemsApi.toggleAvailability(itemId);
      }
    } catch {
      // Local fallback
    }

    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item))
    );
  };

  const deleteMenuItem = async (itemId) => {
    try {
      if (typeof itemId === 'number') {
        await menuItemsApi.delete(itemId);
      }
    } catch {
      // Local fallback
    }

    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Menu item removed', 'info');
  };

  // User management with Backend API
  const addUser = async (userData) => {
    const payload = {
      username: userData.username || `user_${Date.now()}`,
      email: userData.email || `${userData.username || 'user'}@stitchcatering.com`,
      password: userData.password || 'password123',
      fullName: userData.name || userData.fullName,
      phone: userData.phone || '+1555000000',
      role: `ROLE_${(userData.role || 'Staff').toUpperCase()}`,
      branchId: 'MAIN',
    };

    try {
      const res = await usersApi.create(payload);
      if (res?.data) {
        const u = res.data;
        const newUser = {
          id: u.id,
          name: u.fullName,
          username: u.username,
          email: u.email,
          phone: u.phone,
          role: formatStatus(u.role?.replace('ROLE_', '')),
          status: u.active ? 'Active' : 'Inactive',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        };
        setUsers((prev) => [...prev, newUser]);
        showToast(`Created user account for ${newUser.name}`, 'success');
        return;
      }
    } catch (err) {
      showToast(err.message || 'Error creating user on server', 'error');
    }

    // Fallback
    const fallbackUser = {
      ...userData,
      id: Date.now(),
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [...prev, fallbackUser]);
    showToast(`Created user account for ${fallbackUser.name}`, 'success');
  };

  const updateUser = async (userData) => {
    const payload = {
      email: userData.email || `${userData.username}@stitchcatering.com`,
      fullName: userData.name || userData.fullName,
      phone: userData.phone || '',
      role: `ROLE_${(userData.role || 'Staff').toUpperCase()}`,
      active: userData.status === 'Active',
      branchId: 'MAIN',
    };

    try {
      if (typeof userData.id === 'number') {
        await usersApi.update(userData.id, payload);
      }
    } catch {
      // Local fallback
    }

    setUsers((prev) => prev.map((u) => (u.id === userData.id ? { ...u, ...userData } : u)));
    showToast(`Updated user ${userData.name}`, 'success');
  };

  const toggleUserStatus = async (userId) => {
    try {
      if (typeof userId === 'number') {
        await usersApi.toggleActive(userId);
      }
    } catch {
      // Local fallback
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
    );
  };

  // WhatsApp receipt sharing using Backend Signed Token URL
  const prepareWhatsAppShare = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    const numericId = order?.numericId || orderId;

    try {
      if (typeof numericId === 'number') {
        const res = await ordersApi.sendReceipt(numericId);
        if (res?.data?.shareUrl) {
          return res.data.shareUrl;
        }
      }
    } catch {
      // Fallback to local formatter
    }
    return null;
  };

  // Settings
  const updateSettings = (newSettings) => {
    setCateringSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully', 'success');
  };

  // Reset demo records
  const resetToMockData = () => {
    localStorage.removeItem('stitch_cart');
    setCart([]);
    refreshBackendData();
    showToast('Refreshed data from backend database', 'info');
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
        login,
        switchRole,
        menuItems,
        categories,
        orders,
        users,
        cateringSettings,
        ingredients,
        drivers,
        reviews,
        updateOrderPriority,
        updateOrderAlert,
        assignDriverToOrder,
        updateIngredientStock,
        addReview,
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
        refreshBackendData,
        activeReceiptOrder,
        isReceiptOpen,
        openReceiptModal,
        closeReceiptModal,
        prepareWhatsAppShare,
        soundEnabled,
        setSoundEnabled,
        loading,
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
