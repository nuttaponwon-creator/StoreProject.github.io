// ====================================
//  GLOBAL CART LOGIC
// ====================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// แก้ไข 1: อัปเดต UI ตะกร้าให้แสดงรูปภาพ + ชื่อ + ไซส์
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
      
      // ปรับแต่ง CSS แบบ Inline ให้เลย (จะได้ไม่ต้องไปแก้ CSS เพิ่ม)
      li.style.borderBottom = "1px solid #eee";
      li.style.padding = "10px 0";

      li.innerHTML = `
        <div style="display: flex; align-items: center; width: 100%;">
          <img src="${item.img || 'https://via.placeholder.com/50'}" alt="${item.name}" 
               style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px; border: 1px solid #ddd;">
          
          <div style="display: flex; flex-direction: column; flex: 1;">
            <span style="font-weight: 600; font-size: 14px;">${item.name}</span>
            <span style="font-size: 0.85rem; color: #666;">ไซส์: ${item.size || '-'}</span>
          </div>

          <div style="text-align: right;">
             <div style="font-weight: bold; font-size: 14px;">฿${item.price.toLocaleString("th-TH", { maximumFractionDigits: 0 })}</div>
             <button class="cart-remove-btn" data-index="${index}" style="border: none; background: none; color: #ff4d4d; font-size: 12px; cursor: pointer; margin-top: 5px;">ลบสินค้า</button>
          </div>
        </div>
      `;

      cartItemsEl.appendChild(li);
    });
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent = "฿" + total.toLocaleString("th-TH", {
    maximumFractionDigits: 0
  });

  cartCountEl.textContent = String(cart.length);
}

// แก้ไข 2: รับค่า img เข้ามาบันทึกด้วย
function addToCart(name, price, img, size = '-') {
  cart.push({
    name,
    price: Number(price),
    img, // บันทึกรูป
    size
  });
  updateCartUI();

  // เปิดตะกร้าอัตโนมัติเมื่อกดเพิ่มสินค้า
  const cartPanel = document.getElementById("cart-panel");
  const cartOverlay = document.getElementById("cart-overlay");
  if (cartPanel && cartOverlay) {
    cartPanel.classList.add("is-open");
    cartOverlay.classList.add("is-active");
  }
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

  // ---------------- Add to Cart (จาก Card หน้าแรก - ไม่ผ่าน Modal) ----------------
  document.body.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("add-to-cart") && target.id !== "modal-addcart") {
       // ถ้าจะเปิดใช้ ต้องแก้ให้ส่ง img ด้วย (แต่ตอนนี้ปิดไว้ตามโค้ดเดิม)
    }
  });

  // ---------------- Search & Filters ----------------
  const searchInput = document.getElementById("search-input");
  let activeCategory = "all";
  let activeGender = "all";

  function applyFilters() {
    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const productCards = document.querySelectorAll("#product-list .product-card");

    productCards.forEach((card) => {
      const cardCategory = (card.dataset.category || "").toLowerCase();
      const cardGenderRaw = (card.dataset.gender || "").toLowerCase();
      const cardGenders = cardGenderRaw.includes(",") ? cardGenderRaw.split(",") : [cardGenderRaw];
      const titleText = (card.dataset.name || "").toLowerCase();

      const matchCategory = activeCategory === "all" || cardCategory === activeCategory;
      const matchGender = activeGender === "all" || cardGenders.includes(activeGender);
      const matchSearch = !searchValue || titleText.includes(searchValue);

      if (matchCategory && matchGender && matchSearch) {
        card.style.display = ""; 
        card.classList.add("fade-in");
      } else {
        card.style.display = "none"; 
        card.classList.remove("fade-in");
      }
    });
  }

  const categoryLinks = document.querySelectorAll(".dropdown-item[data-category]");
  const categoryButtonLabel = document.getElementById("filterCategory");

  categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      activeCategory = link.dataset.category;
      if (categoryButtonLabel) {
        categoryButtonLabel.textContent = `หมวดหมู่: ${link.textContent}`;
      }
      applyFilters();
    });
  });

  const genderChips = document.querySelectorAll(".chip");
  genderChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      genderChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeGender = chip.dataset.gender || "all";
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
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
  const img = card.dataset.img; // รับค่ารูป
  const sizesRaw = card.dataset.sizes || "";
  const sizes = sizesRaw ? sizesRaw.split(",") : [];

  document.getElementById("modal-title").innerText = name;
  document.getElementById("modal-description").innerText = description;
  document.getElementById("modal-category").innerText = category;
  document.getElementById("modal-price").innerText = "฿" + Number(price).toLocaleString();
  document.getElementById("modal-img").src = img;
  document.getElementById("qty-input").value = 1;

  const sizeSelect = document.getElementById("modal-size-select");
  if (sizeSelect) {
    sizeSelect.innerHTML = "";
    if (sizes.length > 0 && sizes[0] !== "") {
      sizes.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.text = size;
        sizeSelect.appendChild(option);
      });
    } else {
      const option = document.createElement("option");
      option.value = "Free Size";
      option.text = "Free Size";
      sizeSelect.appendChild(option);
    }
  }

  const addBtn = document.getElementById("modal-addcart");
  addBtn.dataset.name = name;
  addBtn.dataset.price = price;
  addBtn.dataset.img = img; // แก้ไข 3: ฝากรูปไว้ที่ปุ่มเพิ่มลงตะกร้า
}

document.getElementById("modal-close").onclick = function() {
  document.getElementById("productModal").style.display = "none";
};

window.onclick = function(event) {
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
//  ADD CART FROM MODAL (MAIN LOGIC)
// ====================================
document.getElementById("modal-addcart").onclick = function() {
  const name = this.dataset.name;
  const price = this.dataset.price;
  const img = this.dataset.img; // แก้ไข 4: ดึงรูปจากปุ่ม
  const qty = Number(document.getElementById("qty-input").value);

  const sizeSelect = document.getElementById("modal-size-select");
  const selectedSize = sizeSelect ? sizeSelect.value : "Free Size";

  for (let i = 0; i < qty; i++) {
    // ส่ง img เข้าไปในฟังก์ชัน addToCart
    addToCart(name, price, img, selectedSize); 
  }

  document.getElementById("productModal").style.display = "none";
};

// เมื่อเลื่อนหน้า
window.addEventListener("scroll", function() {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// back-to-top
const btn = document.getElementById("btn-back-to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
});

btn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});