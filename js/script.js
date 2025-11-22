// ====================================
//  GLOBAL CART LOGIC
// ====================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartUI() {
  localStorage.setItem("cart", JSON.stringify(cart)); 
  const cartItemsEl = document.getElementById("cart-items");
  const cartCountEl = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");

  if (!cartItemsEl || !cartCountEl || !cartTotalEl) return;

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    const li = document.createElement("li");
    li.className = "cart-empty";
    li.textContent = "ยังไม่มีสินค้าในตะกร้า";
    cartItemsEl.appendChild(li);
  } else {
    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "cart-item-row";

      const nameSpan = document.createElement("span");
      const priceSpan = document.createElement("span");
      const removeBtn = document.createElement("button");

      nameSpan.textContent = item.name;
      priceSpan.textContent =
        "฿" + item.price.toLocaleString("th-TH", { maximumFractionDigits: 0 });

      removeBtn.textContent = "✕";
      removeBtn.className = "cart-remove-btn";
      removeBtn.setAttribute("data-index", index);

      li.appendChild(nameSpan);
      li.appendChild(priceSpan);
      li.appendChild(removeBtn);
      cartItemsEl.appendChild(li);
    });
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent =
    "฿" + total.toLocaleString("th-TH", { maximumFractionDigits: 0 });

  cartCountEl.textContent = String(cart.length);
}

function addToCart(name, price) {
  cart.push({ name, price: Number(price) });
  updateCartUI();
}

function removeItemFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// ====================================
//  MAIN EVENT BINDINGS
// ====================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  // ---------------- Navbar Mobile ----------------
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("is-open");
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
      });
    });
  }
  
  // ---------------- Cart Panel ----------------
  const cartToggle = document.getElementById("cart-toggle");
  const cartPanel = document.getElementById("cart-panel");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartClose = document.getElementById("cart-close");

  function openCart() {
    cartPanel.classList.add("is-open");
    cartOverlay.classList.add("is-active");
  }

  function closeCart() {
    cartPanel.classList.remove("is-open");
    cartOverlay.classList.remove("is-active");
  }

  if (cartToggle) cartToggle.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  document.getElementById("cart-items").addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-remove-btn")) {
      const index = e.target.dataset.index;
      removeItemFromCart(Number(index));
    }
  });

  // ---------------- Add to Cart (จาก Card) ----------------
  document.body.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("add-to-cart") &&
        target.id !== "modal-addcart") {
      const name = target.dataset.name;
      const price = target.dataset.price;
      addToCart(name, price);
      openCart();
    }
  });

// ---------------- Search & Filters ----------------
const categorySelect = document.getElementById("filter-category");
const genderChips = document.querySelectorAll(".chip");
const searchInput = document.getElementById("search-input");
const productCards = document.querySelectorAll(".product-card");

let activeGender = "all";

function applyFilters() {
  const categoryValue = categorySelect ? categorySelect.value.toLowerCase() : "all";
  const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";

  productCards.forEach((card) => {
    const cardCategory = (card.dataset.category || "").toLowerCase();
    const cardGenderRaw = (card.dataset.gender || "").toLowerCase();

    // แปลงเป็น array เช่น "man,woman" → ["man","woman"]
    const cardGenders = cardGenderRaw.split(",").map(g => g.trim());

    const titleText = (card.querySelector(".product-title")?.textContent || "").toLowerCase();

    const matchCategory = categoryValue === "all" || categoryValue === cardCategory;

    // รองรับสินค้า unisex (มีทั้ง man และ woman)
    const matchGender =
      activeGender === "all" || cardGenders.includes(activeGender);

    const matchSearch = !searchValue || titleText.includes(searchValue);

    card.style.display = matchCategory && matchGender && matchSearch ? "" : "none";
  });
}

if (categorySelect) categorySelect.addEventListener("change", applyFilters);

genderChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    genderChips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    activeGender = chip.dataset.gender || "all";
    applyFilters();
  });
});

if (searchInput) searchInput.addEventListener("input", applyFilters); 
});

// ====================================
//  PRODUCT MODAL
// ====================================
function openProductModal(card) {
  document.getElementById("productModal").style.display = "flex";

  const name = card.dataset.name;
  const price = card.dataset.price;
  const category = card.dataset.category;
  const description = card.dataset.description;
  const img = card.dataset.img;

  document.getElementById("modal-title").innerText = name;
  document.getElementById("modal-description").innerText = description;
  document.getElementById("modal-category").innerText = category;
  document.getElementById("modal-price").innerText = "฿" + price;
  document.getElementById("modal-img").src = img;

  document.getElementById("qty-input").value = 1;

  const addBtn = document.getElementById("modal-addcart");
  addBtn.dataset.name = name;
  addBtn.dataset.price = price;
}

document.getElementById("modal-close").onclick = function () {
  document.getElementById("productModal").style.display = "none";
};

window.onclick = function (event) {
  if (event.target.id === "productModal") {
    document.getElementById("productModal").style.display = "none";
  }
};

// ====================================
//  QTY BUTTONS
// ====================================
document.getElementById("qty-increase").onclick = () => {
  const qty = document.getElementById("qty-input");
  qty.value = Number(qty.value) + 1;
};

document.getElementById("qty-decrease").onclick = () => {
  const qty = document.getElementById("qty-input");
  if (qty.value > 1) qty.value = Number(qty.value) - 1;
};

// ====================================
//  ADD CART FROM MODAL (เวอร์ชันแก้)
// ====================================
document.getElementById("modal-addcart").onclick = function () {
  const name = this.dataset.name;
  const price = this.dataset.price;
  const qty = Number(document.getElementById("qty-input").value);

  for (let i = 0; i < qty; i++) {
    addToCart(name, price);
  }

  document.getElementById("productModal").style.display = "none";

  document.getElementById("cart-toggle").click();
};

// เมื่อเลื่อนหน้า
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});