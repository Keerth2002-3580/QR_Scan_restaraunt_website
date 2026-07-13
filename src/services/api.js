// Mock Menu Items Data
const MOCK_MENU = [
  {
    id: "b1",
    name: "Classic Beef Burger",
    price: 8.99,
    description: "Juicy beef patty, melted cheddar cheese, lettuce, tomato, house sauce.",
    category: "Burgers",
    isVeg: false,
    isNonVeg: true,
    isSpicy: false,
    spicyLevel: 0,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: ["Beef Patty", "Cheddar Cheese", "Lettuce", "Tomato", "Wheat Bun", "House Sauce"]
  },
  {
    id: "b2",
    name: "Spicy Crispy Chicken Burger",
    price: 9.49,
    description: "Crispy fried chicken breast, spicy mayo, pickles, shredded lettuce on a toasted brioche bun.",
    category: "Burgers",
    isVeg: false,
    isNonVeg: true,
    isSpicy: true,
    spicyLevel: 2,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: ["Crispy Chicken", "Spicy Mayo", "Pickles", "Lettuce", "Brioche Bun"]
  },
  {
    id: "r1",
    name: "Signature Fried Rice",
    price: 10.99,
    description: "Wok-fried jasmine rice with seasoned vegetables, egg, and green onions.",
    category: "Rice",
    isVeg: true,
    isNonVeg: false,
    isSpicy: false,
    spicyLevel: 0,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1603133872878-685f208b8480?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: ["Jasmine Rice", "Egg", "Carrot", "Peas", "Green Onion", "Soy Sauce"]
  },
  {
    id: "r2",
    name: "Teriyaki Chicken Bowl",
    price: 12.49,
    description: "Grilled chicken breast glazed with savory teriyaki sauce over steamed jasmine rice.",
    category: "Rice",
    isVeg: false,
    isNonVeg: true,
    isSpicy: false,
    spicyLevel: 0,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: ["Grilled Chicken", "Teriyaki Sauce", "Jasmine Rice", "Broccoli", "Sesame Seeds"]
  },
  {
    id: "d1",
    name: "Fresh Strawberry Lemonade",
    price: 3.99,
    description: "Real strawberries blended with fresh squeezed lemon juice and sweet cane sugar.",
    category: "Drinks",
    isVeg: true,
    isNonVeg: false,
    isSpicy: false,
    spicyLevel: 0,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: ["Strawberries", "Lemon Juice", "Cane Sugar", "Water", "Ice"]
  },
  {
    id: "d2",
    name: "Iced Vanilla Latte",
    price: 4.49,
    description: "Double shot of espresso, creamy milk, sweet vanilla syrup, served over ice.",
    category: "Drinks",
    isVeg: true,
    isNonVeg: false,
    isSpicy: false,
    spicyLevel: 0,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: ["Espresso", "Whole Milk", "Vanilla Syrup", "Ice"]
  },
  {
    id: "de1",
    name: "Molten Lava Cake",
    price: 6.99,
    description: "Rich chocolate cake with a warm, gooey molten chocolate center, served with vanilla ice cream.",
    category: "Desserts",
    isVeg: true,
    isNonVeg: false,
    isSpicy: false,
    spicyLevel: 0,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: ["Chocolate", "Flour", "Butter", "Eggs", "Sugar", "Vanilla Ice Cream"]
  },
  {
    id: "de2",
    name: "Matcha Tiramisu",
    price: 7.49,
    description: "Delicate layers of premium matcha-soaked ladyfingers and velvety mascarpone cream.",
    category: "Desserts",
    isVeg: true,
    isNonVeg: false,
    isSpicy: false,
    spicyLevel: 0,
    isAvailable: false, // marked unavailable to show Sold Out UI
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: ["Matcha Powder", "Mascarpone", "Ladyfingers", "Egg Yolks", "Sugar"]
  }
];

// Helper delay to mimic HTTP API requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // 1. Fetch Menu Items
  async getMenuItems() {
    await delay(600); // simulate network delay
    return [...MOCK_MENU];
  },

  // 2. Place Order (Send order to Node.js backend)
  async placeOrder(orderData) {
    await delay(1000); // simulate processing
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    
    // In production, you would make a POST request to your backend:
    // const res = await fetch(`${API_BASE_URL}/api/orders`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // });
    // return await res.json();

    return {
      success: true,
      orderId,
      tableNumber: orderData.tableNumber,
      items: orderData.items,
      notes: orderData.notes,
      totalAmount: orderData.totalAmount,
      status: "Received", // initial status
      paymentStatus: "Unpaid", // starts as unpaid
      paymentMethod: null,
      createdAt: new Date().toISOString()
    };
  },

  // 3. Call Waiter (Inform Staff)
  async callWaiter(tableNumber, requestType) {
    await delay(500);
    // Real API POST mapping:
    // fetch(`${API_BASE_URL}/api/waiter-calls`, { ... })
    return {
      success: true,
      message: `Waiter called for Table ${tableNumber} (Request: ${requestType})`
    };
  },

  // 4. Request Bill (Cashier alerted)
  async requestBill(tableNumber) {
    await delay(500);
    // Real API POST mapping:
    // fetch(`${API_BASE_URL}/api/bill-requests`, { ... })
    return {
      success: true,
      message: `Bill requested for Table ${tableNumber}. Cashier has been notified.`
    };
  },

  // 5. Submit Feedback and Ratings
  async submitFeedback(feedbackData) {
    await delay(800);
    // Real API POST mapping:
    // fetch(`${API_BASE_URL}/api/feedback`, { ... })
    return {
      success: true,
      message: "Feedback submitted successfully. Thank you!"
    };
  }
};

/**
 * Socket.IO Real-time Kitchen Tracking client skeleton setup.
 * Ready to connect to backend for live state synchronizations.
 */
export const createSocketConnection = (orderId, onStatusChange) => {
  console.log(`[Socket.IO Stub] Initializing client connection for order tracking: ${orderId}`);
  
  // Real socket.io-client initialization in production:
  // import io from 'socket.io-client';
  // const socket = io(BACKEND_API_URL);
  // socket.emit('join-order-room', orderId);
  // socket.on('order-status-update', (newStatus) => onStatusChange(newStatus));
  // return socket;

  // Let's create a mock listener that advances the status step-by-step
  let currentStepIndex = 0;
  const statuses = ["Received", "Preparing", "Ready", "Served", "Completed"];
  
  // Transitions: Received -> Preparing (8s) -> Ready (15s) -> Served (10s) -> Completed (10s)
  const statusTimers = [8000, 15000, 10000, 10000]; 
  let timeoutId = null;

  const runMockTransition = () => {
    if (currentStepIndex < statuses.length - 1) {
      timeoutId = setTimeout(() => {
        currentStepIndex++;
        const nextStatus = statuses[currentStepIndex];
        console.log(`[Socket.IO Stub] Order status updated to: ${nextStatus}`);
        onStatusChange(nextStatus);
        runMockTransition();
      }, statusTimers[currentStepIndex]);
    }
  };

  runMockTransition();

  // Return a cleanup object matching standard socket clients
  return {
    disconnect: () => {
      console.log(`[Socket.IO Stub] Disconnecting tracker for order ${orderId}`);
      if (timeoutId) clearTimeout(timeoutId);
    }
  };
};
