export const elements = {
  search: document.querySelector("#search-input"),
  categoryTabs: document.querySelector("#category-tabs"),
  sort: document.querySelector("#sort-select"),
  productGrid: document.querySelector("#product-grid"),
  loading: document.querySelector("#loading"),
  errorBanner: document.querySelector("#error-banner"),
  emptyState: document.querySelector("#empty-state"),
  cartButton: document.querySelector("#cart-button"),
  cartCount: document.querySelector("#cart-count"),
  cartPanel: document.querySelector("#cart-panel"),
  cartBackdrop: document.querySelector("#cart-backdrop"),
  closeCart: document.querySelector("#close-cart"),
  cartItems: document.querySelector("#cart-items"),
  cartTotal: document.querySelector("#cart-total"),
  clearCart: document.querySelector("#clear-cart")
};

export function renderCategories(categories, active) {
  elements.categoryTabs.innerHTML = [
    `<button class="tab ${active === "all" ? "active" : ""}" data-category="all" role="tab" aria-selected="${active === "all"}">All</button>`,
    ...categories.map(category =>
      `<button class="tab ${active === category ? "active" : ""}" data-category="${escapeHtml(category)}" role="tab" aria-selected="${active === category}">${escapeHtml(category)}</button>`
    )
  ].join("");
}

export function renderProducts(products, onAdd) {
  elements.productGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.title)}" loading="lazy">
      <div class="product-content">
        <span class="category">${escapeHtml(product.category)}</span>
        <h2>${escapeHtml(product.title)}</h2>
        <div class="rating">★ ${Number(product.rating?.rate ?? 0).toFixed(1)} (${product.rating?.count ?? 0})</div>
        <div class="price-row">
          <strong>$${Number(product.price).toFixed(2)}</strong>
          <button class="add-button" data-product-id="${product.id}" type="button">Add to cart</button>
        </div>
      </div>
    </article>
  `).join("");

  elements.productGrid.querySelectorAll(".add-button").forEach(button => {
    button.addEventListener("click", () => onAdd(Number(button.dataset.productId)));
  });
}

export function renderCart(state, total, count, onRemove) {
  elements.cartCount.textContent = count;
  elements.cartTotal.textContent = total.toFixed(2);

  elements.cartItems.innerHTML = state.cart.length
    ? state.cart.map(item => `
      <div class="cart-item">
        <img src="${escapeAttribute(item.image)}" alt="">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${item.quantity} × $${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-button" type="button" data-remove-id="${item.id}" aria-label="Remove ${escapeAttribute(item.title)}">Remove</button>
      </div>
    `).join("")
    : `<p class="empty-cart">Your cart is empty.</p>`;

  elements.cartItems.querySelectorAll("[data-remove-id]").forEach(button => {
    button.addEventListener("click", () => onRemove(Number(button.dataset.removeId)));
  });
}

export function setLoading(isLoading) {
  elements.loading.classList.toggle("hidden", !isLoading);
  if (isLoading) elements.productGrid.innerHTML = "";
}

export function setError(message) {
  elements.errorBanner.textContent = message;
  elements.errorBanner.classList.toggle("hidden", !message);
}

export function setEmpty(isEmpty) {
  elements.emptyState.classList.toggle("hidden", !isEmpty);
}

export function openCart() {
  elements.cartPanel.classList.add("open");
  elements.cartBackdrop.classList.remove("hidden");
  elements.cartPanel.setAttribute("aria-hidden", "false");
}

export function closeCart() {
  elements.cartPanel.classList.remove("open");
  elements.cartBackdrop.classList.add("hidden");
  elements.cartPanel.setAttribute("aria-hidden", "true");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value);
}