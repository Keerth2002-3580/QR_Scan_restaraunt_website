import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, createSocketConnection } from '../services/api';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

// Valid table range: Tables 1 to 20
const VALID_TABLES = Array.from({ length: 20 }, (_, i) => i + 1);

export const OrderProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [tableNumber, setTableNumber] = useState(null);
  const [isTableValid, setIsTableValid] = useState(true);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  // 0. Splash screen — shows once per session
  const [splashDone, setSplashDoneState] = useState(() => {
    return sessionStorage.getItem('qr_splash_done') === 'true';
  });
  const setSplashDone = () => {
    sessionStorage.setItem('qr_splash_done', 'true');
    setSplashDoneState(true);
  };

  // 1. Current Page Routing State
  const [currentPage, setCurrentPage] = useState(() => {
    return sessionStorage.getItem('qr_current_page') || 'home';
  });

  // Sync currentPage to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('qr_current_page', currentPage);
  }, [currentPage]);

  // 2. Persisted Cart State
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('qr_restaurant_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // 3. Persisted Active Order State
  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const savedOrder = localStorage.getItem('qr_restaurant_active_order');
      return savedOrder ? JSON.parse(savedOrder) : null;
    } catch (e) {
      console.error('Failed to parse active order from localStorage:', e);
      return null;
    }
  });

  // Route to tracking on page load if activeOrder exists
  useEffect(() => {
    if (activeOrder && activeOrder.status !== 'Completed') {
      setCurrentPage('tracking');
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('qr_restaurant_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync activeOrder to localStorage
  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('qr_restaurant_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('qr_restaurant_active_order');
    }
  }, [activeOrder]);

  // 3. Load Menu on mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        const data = await apiService.getMenuItems();
        setMenu(data);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, []);

  // 4. Validate Table from URL query parameter (?table=X)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');

    if (tableParam) {
      const parsedTable = parseInt(tableParam, 10);
      if (VALID_TABLES.includes(parsedTable)) {
        setTableNumber(parsedTable);
        setIsTableValid(true);
      } else {
        setIsTableValid(false);
      }
    } else {
      // If table is already set (e.g. from state session) don't trigger error immediately.
      // But if there's absolutely no table number, we invalidate to protect operations.
      if (tableNumber === null) {
        setIsTableValid(false);
      }
    }
  }, [tableNumber]);

  // 5. Socket.IO status synchronization hook for activeOrder
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'Completed') return;

    // Connect to mock WebSocket status manager
    const tracker = createSocketConnection(activeOrder.orderId, (newStatus) => {
      setActiveOrder((prevOrder) => {
        if (!prevOrder) return null;
        
        // Update payment state automatically if status completes
        let paymentStatus = prevOrder.paymentStatus;
        let paymentMethod = prevOrder.paymentMethod;
        if (newStatus === 'Completed') {
          paymentStatus = 'Paid';
          paymentMethod = paymentMethod || 'Cashier'; // defaults to cashier payment
        }

        return {
          ...prevOrder,
          status: newStatus,
          paymentStatus,
          paymentMethod
        };
      });
    });

    return () => {
      tracker.disconnect();
    };
  }, [activeOrder?.orderId, activeOrder?.status === 'Completed']);

  // Cart operations
  const addToCart = (item, quantity, customizations) => {
    // Generate a unique ID based on item ID and customizations to group identical orders
    const customizationsHash = JSON.stringify(customizations);
    const cartItemId = `${item.id}-${customizationsHash}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prevCart,
        {
          cartItemId,
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity,
          customizations,
        },
      ];
    });
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((i) => {
          if (i.cartItemId === cartItemId) {
            const newQty = i.quantity + delta;
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Subtotal & Calculations
  const calculateTotal = () => {
    const subtotal = cart.reduce((acc, item) => {
      // Calculate extras cost
      const extrasCost = item.customizations.extras.reduce((sum, extra) => sum + extra.price, 0);
      return acc + (item.price + extrasCost) * item.quantity;
    }, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  // Submit Order flow
  const placeOrder = async (notes = '') => {
    if (cart.length === 0) return { success: false, error: 'Cart is empty' };
    
    const { total } = calculateTotal();
    const orderData = {
      tableNumber,
      items: cart,
      notes,
      totalAmount: total,
    };

    try {
      const result = await apiService.placeOrder(orderData);
      if (result.success) {
        setActiveOrder(result);
        clearCart();
        return { success: true, order: result };
      }
    } catch (e) {
      console.error('Failed to submit order:', e);
      return { success: false, error: 'Failed to place order' };
    }
  };

  // Call waiter wrapper
  const triggerCallWaiter = async (requestType) => {
    try {
      const res = await apiService.callWaiter(tableNumber, requestType);
      return res;
    } catch (err) {
      console.error('Waiter call failed:', err);
      return { success: false };
    }
  };

  // Trigger cashier alert for bill request
  const requestBill = async () => {
    try {
      const res = await apiService.requestBill(tableNumber);
      setActiveOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          paymentMethod: 'Waiter' // waiter is called with bill
        };
      });
      return res;
    } catch (err) {
      console.error('Bill request failed:', err);
      return { success: false };
    }
  };

  const submitFeedback = async (rating, comment) => {
    try {
      const feedbackData = { tableNumber, rating, comment };
      const res = await apiService.submitFeedback(feedbackData);
      return res;
    } catch (err) {
      console.error('Feedback submit failed:', err);
      return { success: false };
    }
  };

  const cancelActiveOrder = () => {
    setActiveOrder(null);
  };

  return (
    <OrderContext.Provider
      value={{
        menu,
        loadingMenu,
        tableNumber,
        isTableValid,
        cart,
        activeOrder,
        currentPage,
        setCurrentPage,
        isWaiterModalOpen,
        isFeedbackModalOpen,
        setIsWaiterModalOpen,
        setIsFeedbackModalOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        calculateTotal,
        placeOrder,
        triggerCallWaiter,
        requestBill,
        submitFeedback,
        cancelActiveOrder,
        splashDone,
        setSplashDone,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
