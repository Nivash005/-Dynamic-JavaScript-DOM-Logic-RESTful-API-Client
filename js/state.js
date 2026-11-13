const STORAGE_KEY = "product-explorer-state-v1";

const defaultState = {
  search: "",
  category: "all",
  sort: "default",
  cart: []
};

function normalizeState(value) {
  return {
    search: typeof value?.search === "string" ? value.search : "",
    category: typeof value?.category === "string" ? value.category : "all",
    sort: typeof value?.sort === "string" ? value.sort : "default",
    cart: Array.isArray(value?.cart) ? value.cart : []
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in privacy-restricted environments.
  }
}

export function addToCart(state, product) {
  const existing = state.cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  return state;
}

export function removeFromCart(state, productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  return state;
}

export function cartTotal(state) {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(state) {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}