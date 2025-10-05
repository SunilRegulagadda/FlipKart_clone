// Cart utility functions using localStorage

export const getCartKey = (userEmail) => `cart_${userEmail}`;

export const getCart = (userEmail) => {
  const cartKey = getCartKey(userEmail);
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  return cart;
};

export const addToCart = (userEmail, product) => {
  const cart = getCart(userEmail);
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  const cartKey = getCartKey(userEmail);
  localStorage.setItem(cartKey, JSON.stringify(cart));
};

export const removeFromCart = (userEmail, productId) => {
  const cart = getCart(userEmail);
  const updatedCart = cart.filter(item => item.id !== productId);
  const cartKey = getCartKey(userEmail);
  localStorage.setItem(cartKey, JSON.stringify(updatedCart));
};

export const updateQuantity = (userEmail, productId, quantity) => {
  const cart = getCart(userEmail);
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    if (quantity <= 0) {
      removeFromCart(userEmail, productId);
      return;
    }
  }
  const cartKey = getCartKey(userEmail);
  localStorage.setItem(cartKey, JSON.stringify(cart));
};

export const getCartTotal = (userEmail) => {
  const cart = getCart(userEmail);
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = (userEmail) => {
  const cart = getCart(userEmail);
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Order utility functions using localStorage

export const getOrdersKey = (userEmail) => `orders_${userEmail}`;

export const getOrders = (userEmail) => {
  const ordersKey = getOrdersKey(userEmail);
  const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
  return orders;
};

export const addOrder = (userEmail, orderItems) => {
  const orders = getOrders(userEmail);
  const newOrder = {
    id: Date.now(),
    items: orderItems,
    orderDate: new Date().toISOString(),
    status: 'Placed'
  };
  orders.push(newOrder);
  const ordersKey = getOrdersKey(userEmail);
  localStorage.setItem(ordersKey, JSON.stringify(orders));
};

export const hasOrders = (userEmail) => {
  const orders = getOrders(userEmail);
  return orders.length > 0;
};

export const cancelOrder = (userEmail, orderId) => {
  let orders = getOrders(userEmail);
  orders = orders.filter(order => order.id !== orderId);
  const ordersKey = getOrdersKey(userEmail);
  localStorage.setItem(ordersKey, JSON.stringify(orders));
};
