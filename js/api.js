const API_URL = "https://fakestoreapi.com/products";

export async function fetchProducts(signal) {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal
  });

  if (!response.ok) {
    throw new Error(`Product service returned ${response.status}.`);
  }

  const products = await response.json();

  if (!Array.isArray(products)) {
    throw new Error("The product service returned an invalid response.");
  }

  return products;
}