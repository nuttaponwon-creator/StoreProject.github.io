// js/renderProducts.js
document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");

  if (!productList || !products) return;

  productList.innerHTML = products.map(product => `
    <article class="product-card" onclick="openProductModal(this)" data-name="${product.name}" data-price="${product.price}"
            data-img="${product.img}" data-description="${product.description}" data-category="${product.category}" data-gender="${product.gender}">
            <div class="product-image">
              <img src="${product.img}" alt="${product.name}">
              <span class="badge badge-new">${product.badge}</span>
            </div>
            <div class="product-body">
              <h3 class="product-title">${product.name}</h3>
              <p class="product-category">หมวด: ${product.category}</p>
              <p class="product-price">฿${product.price}</p>
              <div class="product-sizes">
                <span>Size: ${product.sizes.join(" / ")}</span>
              </div>
              <button class="btn-primary" data-name="${product.name}" data-price="${product.price}">
                เพิ่มลงตะกร้า
              </button>
            </div>
          </article>
  `).join("");
});

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-recommend");

  // ✅ ใส่หลาย ID ที่ต้องการแสดงใน array
  const targetIds = [2, 1, 3];

  if (!productList || !products) return;

  // กรองสินค้าที่ id ตรงกับ targetIds
  const filteredProducts = products.filter(p => targetIds.includes(p.id));

  if (filteredProducts.length === 0) {
    productList.innerHTML = "<p>ไม่มีสินค้าแนะนำ</p>";
    return;
  }

  // สร้าง HTML จากสินค้าที่กรองได้
  productList.innerHTML = filteredProducts.map(product => `
          <article class="product-card" onclick="openProductModal(this)" data-name="${product.name}" data-price="${product.price}"
            data-img="${product.img}" data-description="${product.description}" data-category="${product.category}" data-gender="${product.gender}">
            <div class="product-image">
              <img src="${product.img}" alt="${product.name}" />
              <span class="badge badge-new">${product.badge}</span>
            </div>
            <div class="product-body">
              <h3 class="product-title">${product.name}</h3>
              <p class="product-category">หมวด: ${product.category}</p>
              <p class="product-price">฿${product.price}</p>
              <div class="product-sizes">
                <span>Size: ${product.sizes.join(" / ")}</span>
              </div>
              <button class="btn-primary" data-name="${product.name}" data-price="${product.price}">
                เพิ่มลงตะกร้า
              </button>
            </div>
          </article>
  `).join("");
});

// ใน renderProducts.js ก่อน render จริง
productGrid.innerHTML = Array(6).fill('').map(() => `
  <div class="col-md-4 mb-4">
    <div class="card h-100">
      <div class="skeleton skeleton-img"></div>
      <div class="card-body">
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width:60%"></div>
        <div class="skeleton skeleton-price"></div>
      </div>
    </div>
  </div>
`).join('');

// แล้วค่อย render จริงหลังจากนั้น 1 วินาที (หรือเมื่อรูปโหลดเสร็จ)
setTimeout(() => renderProducts(products), 800);