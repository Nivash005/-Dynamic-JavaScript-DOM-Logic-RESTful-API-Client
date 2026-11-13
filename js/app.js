import { fetchProducts } from "./api.js";
import {
  loadState, saveState, addToCart, removeFromCart, cartTotal, cartCount
} from "./state.js";
import {
  elements, renderCategories, renderProducts, renderCart,
  setLoading, setError, setEmpty, openCart, closeCart
} from "./dom.js";

let products = [];
let state = loadState();
let requestController;

function getCategories() {
  return [...new Set(products.map(product => product.category))].sort();
}

function getVisibleProducts() {
  const query = state.search.trim().toLowerCase();

  let result = products.filter(product => {
    const matchesSearch =
      !query ||
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    const matchesCategory =
      state.category === "all" || product.category === state.category;

    return matchesSearch && matchesCategory;
  });

  switch (state.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      result.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
      break;
    case "title-asc":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return result;
}

function render() {
  renderCategories(getCategories(), state.category);
  renderProducts(getVisibleProducts(), handleAddToCart);
  renderCart(state, cartTotal(state), cartCount(state), handleRemoveFromCart);
  setEmpty(getVisibleProducts().length === 0);
  elements.search.value = state.search;
  elements.sort.value = state.sort;
  saveState(state);
}

function handleAddToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  state = addToCart(state, product);
  renderCart(state, cartTotal(state), cartCount(state), handleRemoveFromCart);
  saveState(state);
}

function handleRemoveFromCart(productId) {
  state = removeFromCart(state, productId);
  renderCart(state, cartTotal(state), cartCount(state), handleRemoveFromCart);
  saveState(state);
}

async function loadProducts() {
  requestController?.abort();
  requestController = new AbortController();

  setLoading(true);
  setError("");

  try {
    products = await fetchProducts(requestController.signal);
    render();
  } catch (error) {
    if (error.name === "AbortError") return;
    setError("We couldn't load the products. Check your connection and try again.");
    setEmpty(false);
  } finally {
    setLoading(false);
  }
}

elements.search.addEventListener("input", event => {
  state.search = event.target.value;
  render();
});

elements.sort.addEventListener("change", event => {
  state.sort = event.target.value;
  render();
});

elements.categoryTabs.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  render();
});

elements.cartButton.addEventListener("click", openCart);
elements.closeCart.addEventListener("click", closeCart);
elements.cartBackdrop.addEventListener("click", closeCart);

elements.clearCart.addEventListener("click", () => {
  state.cart = [];
  renderCart(state, cartTotal(state), cartCount(state), handleRemoveFromCart);
  saveState(state);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

loadProducts();