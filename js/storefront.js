// Storefront Application Logic (User Side)

document.addEventListener('DOMContentLoaded', async () => {
  // State
  let allProducts = [];
  let filteredProducts = [];
  let currentCategory = 'all';
  let currentSaleTag = 'all';
  let searchQuery = '';
  let maxPrice = 2000;
  let onlyInStock = false;
  let sortBy = 'featured';

  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const brandPillsContainer = document.getElementById('brand-pills');
  const saleTagChips = document.querySelectorAll('.sale-chip');
  const priceSlider = document.getElementById('price-slider');
  const priceIndicator = document.getElementById('price-indicator');
  const inStockCheckbox = document.getElementById('in-stock-only');
  const sortSelect = document.getElementById('sort-select');
  const resultsCount = document.getElementById('results-count');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  // Cart DOM Elements
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartBadge = document.getElementById('cart-badge');
  const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDiscountEl = document.getElementById('cart-discount');
  const cartGrandTotalEl = document.getElementById('cart-grand-total');
  const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');

  // Modals
  const productModal = document.getElementById('product-detail-modal');
  const checkoutModal = document.getElementById('checkout-modal');
  const orderSuccessModal = document.getElementById('order-success-modal');
  const orderTrackerModal = document.getElementById('order-tracker-modal');
  const myOrdersModal = document.getElementById('my-orders-modal');

  // Load Initial Products
  async function loadProducts() {
    productsGrid.innerHTML = `
      <div class="empty-catalog-state">
        <div style="font-size: 1.5rem; margin-bottom: 8px;">⏳</div>
        <h3>Loading marketplace catalog...</h3>
        <p>Connecting to database</p>
      </div>
    `;

    allProducts = await window.Storage.getProducts();
    populateBrandFilters();
    applyFilters();
    updateCartUI();
  }

  // Populate Brand category filter chips dynamically
  function populateBrandFilters() {
    if (!brandPillsContainer) return;
    const brands = Array.from(new Set(allProducts.map(p => p.Company_name).filter(Boolean)));
    
    brandPillsContainer.innerHTML = `
      <button class="cat-chip active" data-category="all">All Brands</button>
      ${brands.map(b => `<button class="cat-chip" data-category="${b}">${b}</button>`).join('')}
    `;

    brandPillsContainer.querySelectorAll('.cat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        brandPillsContainer.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        applyFilters();
      });
    });
  }

  // Filter and Sort Logic
  function applyFilters() {
    filteredProducts = allProducts.filter(p => {
      // 1. Category / Brand Filter
      if (currentCategory !== 'all' && p.Company_name !== currentCategory) {
        return false;
      }

      // 2. Sale Tag Filter
      if (currentSaleTag !== 'all' && (!p.Sales || !p.Sales.toLowerCase().includes(currentSaleTag.toLowerCase()))) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name && p.name.toLowerCase().includes(q);
        const matchBrand = p.Company_name && p.Company_name.toLowerCase().includes(q);
        const matchDesc = p.Description && p.Description.toLowerCase().includes(q);
        const matchSales = p.Sales && p.Sales.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchDesc && !matchSales) return false;
      }

      // 4. Max Price Filter
      const effectivePrice = Math.max(0, (p.Amount || 0) - (p.Discount_amount || 0));
      if (effectivePrice > maxPrice) {
        return false;
      }

      // 5. In Stock Only
      if (onlyInStock && !p.is_available) {
        return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-low') {
      filteredProducts.sort((a, b) => {
        const priceA = (a.Amount || 0) - (a.Discount_amount || 0);
        const priceB = (b.Amount || 0) - (b.Discount_amount || 0);
        return priceA - priceB;
      });
    } else if (sortBy === 'price-high') {
      filteredProducts.sort((a, b) => {
        const priceA = (a.Amount || 0) - (a.Discount_amount || 0);
        const priceB = (b.Amount || 0) - (b.Discount_amount || 0);
        return priceB - priceA;
      });
    } else if (sortBy === 'discount') {
      filteredProducts.sort((a, b) => (b.Discount_amount || 0) - (a.Discount_amount || 0));
    } else {
      // Featured / default: available first, then id
      filteredProducts.sort((a, b) => (b.is_available === true ? 1 : 0) - (a.is_available === true ? 1 : 0));
    }

    renderProducts();
  }

  // Render Product Grid
  function renderProducts() {
    if (resultsCount) {
      resultsCount.innerHTML = `Showing <strong>${filteredProducts.length}</strong> of <strong>${allProducts.length}</strong> products`;
    }

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-catalog-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <h3>No products match your search or filter</h3>
          <p>Try clearing filters or adjusting your price range.</p>
          <button id="clear-all-filters-btn" class="btn btn-secondary btn-sm">Clear All Filters</button>
        </div>
      `;
      const clrBtn = document.getElementById('clear-all-filters-btn');
      if (clrBtn) clrBtn.addEventListener('click', resetAllFilters);
      return;
    }

    productsGrid.innerHTML = filteredProducts.map(p => {
      const finalPrice = Math.max(0, (p.Amount || 0) - (p.Discount_amount || 0));
      const hasDiscount = (p.Discount_amount || 0) > 0;
      const isAvailable = p.is_available !== false;

      return `
        <div class="product-card animate-fade-in" data-id="${p.id}">
          <div class="product-card-media">
            <img class="product-card-img" src="${p.img_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}" alt="${p.name}" loading="lazy">
            <div class="product-card-badges">
              ${p.Sales ? `<span class="badge badge-brand">${p.Sales}</span>` : ''}
              ${hasDiscount ? `<span class="badge badge-success">Save ${Utils.formatCurrency(p.Discount_amount)}</span>` : ''}
            </div>
            <button class="product-quick-view-btn" onclick="openProductDetail(${p.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Quick View
            </button>
          </div>
          
          <div class="product-card-body">
            <div class="product-brand-line">
              <span class="product-company">${p.Company_name || 'Brand'}</span>
              <span class="product-availability ${isAvailable ? 'in-stock' : 'out-of-stock'}">
                <span class="availability-dot"></span>
                ${isAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h3 class="product-card-title" title="${p.name}">${p.name}</h3>
            <p class="product-card-desc">${p.Description || 'Premium modern product from verified brand.'}</p>

            <div class="product-pricing-box">
              <span class="current-price">${Utils.formatCurrency(finalPrice)}</span>
              ${hasDiscount ? `<span class="original-price">${Utils.formatCurrency(p.Amount)}</span>` : ''}
              ${hasDiscount ? `<span class="discount-pill">-${Math.round((p.Discount_amount / p.Amount) * 100)}%</span>` : ''}
            </div>

            <div class="product-card-actions">
              <button class="btn-add-cart" ${!isAvailable ? 'disabled' : ''} onclick="handleAddToCart(${p.id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                ${isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function resetAllFilters() {
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.classList.remove('visible');
    currentCategory = 'all';
    currentSaleTag = 'all';
    maxPrice = 2000;
    if (priceSlider) priceSlider.value = 2000;
    if (priceIndicator) priceIndicator.textContent = '$2000';
    onlyInStock = false;
    if (inStockCheckbox) inStockCheckbox.checked = false;
    sortBy = 'featured';
    if (sortSelect) sortSelect.value = 'featured';

    if (brandPillsContainer) {
      brandPillsContainer.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      const allBtn = brandPillsContainer.querySelector('[data-category="all"]');
      if (allBtn) allBtn.classList.add('active');
    }

    saleTagChips.forEach(c => c.classList.remove('active'));
    const allSale = document.querySelector('.sale-chip[data-sale="all"]');
    if (allSale) allSale.classList.add('active');

    applyFilters();
  }

  // Global actions attached to window
  window.handleAddToCart = (productId) => {
    const product = allProducts.find(p => String(p.id) === String(productId));
    if (!product) return;
    if (!product.is_available) {
      Utils.showToast('Sorry, this product is currently out of stock.', 'error', 'Stock Alert');
      return;
    }

    window.Storage.addToCart(product, 1);
    Utils.showToast(`"${product.name}" added to shopping cart!`, 'success', 'Cart Updated');
    openCartDrawer();
  };

  window.openProductDetail = (productId) => {
    const p = allProducts.find(item => String(item.id) === String(productId));
    if (!p) return;

    const finalPrice = Math.max(0, (p.Amount || 0) - (p.Discount_amount || 0));
    const hasDiscount = (p.Discount_amount || 0) > 0;
    const isAvailable = p.is_available !== false;

    const modalBody = document.getElementById('product-detail-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="product-detail-grid">
        <div class="detail-img-box">
          <img src="${p.img_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}" alt="${p.name}">
        </div>
        <div class="detail-info-box">
          <div class="detail-brand-badge">
            <span class="badge badge-brand">${p.Company_name || 'Brand'}</span>
            ${p.Sales ? `<span class="badge badge-warning">${p.Sales}</span>` : ''}
            <span class="badge ${isAvailable ? 'badge-success' : 'badge-danger'}">
              ${isAvailable ? 'In Stock & Ready to Ship' : 'Out of Stock'}
            </span>
          </div>

          <h2 class="detail-title">${p.name}</h2>
          <p class="detail-desc">${p.Description || 'Experience outstanding quality crafted with premium materials.'}</p>

          <div class="detail-price-breakdown">
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
              <span style="font-size: 0.875rem; color: var(--text-secondary);">Discounted Price:</span>
              <span style="font-size: 1.6rem; font-weight: 800; color: var(--brand-primary);">${Utils.formatCurrency(finalPrice)}</span>
            </div>
            ${hasDiscount ? `
              <div style="display:flex; justify-content:space-between; font-size: 0.8125rem; color: var(--text-muted);">
                <span>Original Price:</span>
                <span style="text-decoration: line-through;">${Utils.formatCurrency(p.Amount)}</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size: 0.8125rem; color: var(--accent-emerald); font-weight: 700;">
                <span>Total Instant Savings:</span>
                <span>Save ${Utils.formatCurrency(p.Discount_amount)}</span>
              </div>
            ` : ''}
          </div>

          <div style="display: flex; align-items: center; gap: 14px; margin-top: 10px;">
            <div class="quantity-stepper" style="border-radius: var(--radius-md);">
              <button id="modal-qty-minus" style="width:36px; height:36px;">-</button>
              <span id="modal-qty-val" style="width:40px; font-weight:700;">1</span>
              <button id="modal-qty-plus" style="width:36px; height:36px;">+</button>
            </div>
            <button id="modal-add-cart-btn" class="btn btn-primary btn-lg" style="flex:1;" ${!isAvailable ? 'disabled' : ''}>
              ${isAvailable ? 'Add to Shopping Cart' : 'Sold Out'}
            </button>
          </div>

          <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-subtle); font-size: 0.8125rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px;">
            <div>✓ 30-Day Money Back Guarantee</div>
            <div>✓ Official Manufacturer Warranty</div>
            <div>✓ Instant Order Confirmation & Live Tracking</div>
          </div>
        </div>
      </div>
    `;

    // Quantity Stepper in Modal
    let modalQty = 1;
    const qtyVal = document.getElementById('modal-qty-val');
    document.getElementById('modal-qty-minus').addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty--;
        qtyVal.textContent = modalQty;
      }
    });
    document.getElementById('modal-qty-plus').addEventListener('click', () => {
      modalQty++;
      qtyVal.textContent = modalQty;
    });

    document.getElementById('modal-add-cart-btn').addEventListener('click', () => {
      window.Storage.addToCart(p, modalQty);
      Utils.showToast(`${modalQty}x "${p.name}" added to cart!`, 'success');
      closeModal(productModal);
      openCartDrawer();
    });

    openModal(productModal);
  };

  // Cart Drawer UI Management
  function updateCartUI() {
    const cart = window.Storage.getCart();
    const count = window.Storage.getCartCount();
    const total = window.Storage.getCartTotal();

    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.classList.add('bump');
      setTimeout(() => cartBadge.classList.remove('bump'), 400);
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-view">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h4>Your cart is empty</h4>
          <p>Explore our premium catalog to add products.</p>
          <button class="btn btn-secondary btn-sm" onclick="closeCartDrawer()">Start Browsing</button>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
      if (cartDiscountEl) cartDiscountEl.textContent = '$0.00';
      if (cartGrandTotalEl) cartGrandTotalEl.textContent = '$0.00';
      if (proceedCheckoutBtn) proceedCheckoutBtn.disabled = true;
      return;
    }

    if (proceedCheckoutBtn) proceedCheckoutBtn.disabled = false;

    // Calculate total original vs discounted
    const originalTotal = cart.reduce((sum, item) => sum + ((item.original_price || item.price) * item.quantity), 0);
    const totalDiscount = Math.max(0, originalTotal - total);

    cartItemsList.innerHTML = cart.map(item => `
      <div class="cart-item-row animate-fade-in" data-id="${item.id}">
        <img class="cart-item-thumb" src="${item.img_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}" alt="${item.name}">
        <div class="cart-item-meta">
          <span style="font-size:0.72rem; font-weight:700; color:var(--brand-primary); text-transform:uppercase;">${item.Company_name || ''}</span>
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-price">${Utils.formatCurrency(item.price)} each</span>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-stepper">
            <button onclick="changeCartItemQty(${item.id}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeCartItemQty(${item.id}, ${item.quantity + 1})">+</button>
          </div>
          <button class="btn-remove-item" onclick="removeCartItem(${item.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            Remove
          </button>
        </div>
      </div>
    `).join('');

    if (cartSubtotalEl) cartSubtotalEl.textContent = Utils.formatCurrency(originalTotal);
    if (cartDiscountEl) cartDiscountEl.textContent = `-${Utils.formatCurrency(totalDiscount)}`;
    if (cartGrandTotalEl) cartGrandTotalEl.textContent = Utils.formatCurrency(total);
  }

  window.changeCartItemQty = (productId, newQty) => {
    window.Storage.updateCartQuantity(productId, newQty);
    updateCartUI();
  };

  window.removeCartItem = (productId) => {
    window.Storage.removeFromCart(productId);
    Utils.showToast('Item removed from cart', 'info');
    updateCartUI();
  };

  function openCartDrawer() {
    updateCartUI();
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.add('active');
    if (cartDrawer) cartDrawer.classList.add('active');
  }

  window.closeCartDrawer = () => {
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.remove('active');
    if (cartDrawer) cartDrawer.classList.remove('active');
  };

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', window.closeCartDrawer);
  if (cartDrawerBackdrop) cartDrawerBackdrop.addEventListener('click', window.closeCartDrawer);

  window.addEventListener('lumina:cart_updated', updateCartUI);

  // Modal helpers
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
  }

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  // Search and Filter Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        if (searchQuery.length > 0) searchClearBtn.classList.add('visible');
        else searchClearBtn.classList.remove('visible');
      }
      applyFilters();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchQuery = '';
      searchInput.value = '';
      searchClearBtn.classList.remove('visible');
      applyFilters();
    });
  }

  saleTagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      saleTagChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentSaleTag = chip.dataset.sale;
      applyFilters();
    });
  });

  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      maxPrice = Number(e.target.value);
      if (priceIndicator) priceIndicator.textContent = `$${maxPrice}`;
      applyFilters();
    });
  }

  if (inStockCheckbox) {
    inStockCheckbox.addEventListener('change', (e) => {
      onlyInStock = e.target.checked;
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      applyFilters();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  // --- CHECKOUT FLOW ---
  if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', () => {
      window.closeCartDrawer();
      openCheckoutModal();
    });
  }

  function openCheckoutModal() {
    const cart = window.Storage.getCart();
    if (cart.length === 0) {
      Utils.showToast('Your cart is empty', 'error');
      return;
    }

    const total = window.Storage.getCartTotal();
    const orderItemsSummary = document.getElementById('checkout-items-summary');
    const checkoutTotalEl = document.getElementById('checkout-total-amount');

    if (orderItemsSummary) {
      orderItemsSummary.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; font-size:0.875rem; padding: 6px 0; border-bottom: 1px dashed var(--border-subtle);">
          <span>${item.name} <strong>x${item.quantity}</strong></span>
          <span style="font-weight:700;">${Utils.formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join('');
    }

    if (checkoutTotalEl) checkoutTotalEl.textContent = Utils.formatCurrency(total);

    openModal(checkoutModal);
  }

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('checkout-name').value.trim();
      const phone = document.getElementById('checkout-phone').value.trim();
      const email = document.getElementById('checkout-email').value.trim();
      const address = document.getElementById('checkout-address').value.trim();
      const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked')?.value || 'Standard Courier';
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'Cash on Delivery';

      if (!name || !phone || !address) {
        Utils.showToast('Please fill out all required shipping fields.', 'error');
        return;
      }

      const cart = window.Storage.getCart();
      const totalAmount = window.Storage.getCartTotal();

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Placing Order & Syncing...</span>`;

      try {
        const newOrder = await window.Storage.createOrder({
          customer_name: name,
          customer_phone: phone,
          customer_email: email,
          address: address,
          delivery_type: deliveryMethod,
          payment_method: paymentMethod,
          total_amount: totalAmount,
          items: cart
        });

        closeModal(checkoutModal);
        checkoutForm.reset();
        showOrderConfirmation(newOrder);
        updateCartUI();
      } catch (err) {
        console.error('Order creation error:', err);
        Utils.showToast('Error placing order: ' + err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  function showOrderConfirmation(order) {
    const codeEl = document.getElementById('success-order-code');
    const customerEl = document.getElementById('success-customer-name');
    const addressEl = document.getElementById('success-shipping-address');
    const amountEl = document.getElementById('success-order-amount');
    const trackBtn = document.getElementById('success-track-btn');

    if (codeEl) codeEl.textContent = order.order_code;
    if (customerEl) customerEl.textContent = order.Customer_name;
    if (addressEl) addressEl.textContent = order.Address;
    if (amountEl) amountEl.textContent = Utils.formatCurrency(order.Price_details);

    if (trackBtn) {
      trackBtn.onclick = () => {
        closeModal(orderSuccessModal);
        openOrderTracker(order.order_code);
      };
    }

    openModal(orderSuccessModal);
  }

  // --- ORDER TRACKER ---
  window.openOrderTracker = async (prefillCode = '') => {
    const trackerInput = document.getElementById('tracker-code-input');
    if (trackerInput && prefillCode) {
      trackerInput.value = prefillCode;
    }
    openModal(orderTrackerModal);
    if (prefillCode) {
      performOrderSearch(prefillCode);
    }
  };

  const trackerSearchBtn = document.getElementById('tracker-search-btn');
  if (trackerSearchBtn) {
    trackerSearchBtn.addEventListener('click', () => {
      const code = document.getElementById('tracker-code-input').value.trim();
      if (!code) {
        Utils.showToast('Please enter an Order ID', 'info');
        return;
      }
      performOrderSearch(code);
    });
  }

  async function performOrderSearch(code) {
    const orders = await window.Storage.getOrders();
    const order = orders.find(o => 
      String(o.order_code).toLowerCase() === code.toLowerCase() || 
      String(o.Product_id) === code
    );

    const resultBox = document.getElementById('tracker-result-box');
    if (!resultBox) return;

    if (!order) {
      resultBox.innerHTML = `
        <div style="text-align:center; padding: 24px; color: var(--text-secondary);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <h4>Order Not Found</h4>
          <p style="font-size:0.875rem;">No order matches ID "<strong>${code}</strong>". Please verify your Order ID and try again.</p>
        </div>
      `;
      return;
    }

    const status = order.Delivery_details || 'Pending';
    const isCancelled = status === APP_CONFIG.ORDER_STATUSES.CANCELLED;
    const canCancel = (status === APP_CONFIG.ORDER_STATUSES.PENDING || status === APP_CONFIG.ORDER_STATUSES.CONFIRMED);

    const steps = [
      { key: 'Pending', label: 'Order Placed' },
      { key: 'Confirmed', label: 'Confirmed & Packed' },
      { key: 'Shipped', label: 'Shipped & En Route' },
      { key: 'Delivered', label: 'Delivered' }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === status);

    resultBox.innerHTML = `
      <div class="animate-fade-in" style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: 20px; border: 1px solid var(--border-subtle);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight:600;">ORDER REFERENCE</span>
            <h3 style="font-size: 1.15rem; font-weight:800;">${order.order_code}</h3>
            <span style="font-size: 0.8125rem; color: var(--text-secondary);">Placed on ${Utils.formatDate(order.created_at)}</span>
          </div>
          <span class="status-pill status-${status.toLowerCase()}">${status}</span>
        </div>

        ${isCancelled ? `
          <div style="background:#fff1f2; border:1px solid #fda4af; border-radius:var(--radius-md); padding:14px; margin-bottom:16px; color:#9f1239; font-size:0.875rem;">
            <strong>Order Cancelled</strong>
            <p style="margin-top:4px;">This order has been cancelled and will not be delivered.</p>
          </div>
        ` : `
          <!-- Stepper -->
          <div class="tracker-stepper">
            ${steps.map((step, idx) => {
              let stateClass = '';
              if (idx < currentStepIndex) stateClass = 'completed';
              else if (idx === currentStepIndex) stateClass = 'active';

              return `
                <div class="tracker-step ${stateClass}">
                  <div class="step-circle">
                    ${idx < currentStepIndex ? '✓' : idx + 1}
                  </div>
                  <span class="step-label">${step.label}</span>
                </div>
              `;
            }).join('')}
          </div>
        `}

        <!-- Order Summary Details -->
        <div style="margin-top: 20px; font-size: 0.875rem;">
          <h4 style="font-weight:700; margin-bottom:8px;">Recipient & Shipping Details</h4>
          <div style="background:#fff; border-radius:var(--radius-md); padding:12px; border:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:4px; margin-bottom:16px;">
            <div><strong>Recipient:</strong> ${order.Customer_name}</div>
            <div><strong>Delivery Address:</strong> ${order.Address}</div>
            <div><strong>Shipping Method:</strong> ${order.delivery_type || 'Standard Ground'}</div>
            <div><strong>Payment Method:</strong> ${order.Payment_details}</div>
          </div>

          <h4 style="font-weight:700; margin-bottom:8px;">Ordered Items (${order.items ? order.items.length : 1})</h4>
          <div style="background:#fff; border-radius:var(--radius-md); padding:12px; border:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:8px;">
            ${(order.items || []).map(i => `
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span>${i.name} (x${i.quantity || 1})</span>
                <span style="font-weight:700;">${Utils.formatCurrency((i.price || 0) * (i.quantity || 1))}</span>
              </div>
            `).join('')}
            <div style="border-top:1px dashed var(--border-subtle); padding-top:8px; display:flex; justify-content:space-between; font-weight:800; font-size:0.95rem;">
              <span>Total Paid:</span>
              <span>${Utils.formatCurrency(order.Price_details)}</span>
            </div>
          </div>
        </div>

        ${canCancel ? `
          <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end;">
            <button class="btn btn-danger btn-sm" onclick="cancelOrderPrompt('${order.order_code}')">
              Cancel Order
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  window.cancelOrderPrompt = async (orderCode) => {
    if (!confirm(`Are you sure you want to cancel order ${orderCode}?`)) {
      return;
    }

    const reason = prompt('Please share a reason for cancellation (optional):') || 'Customer request';
    const res = await window.Storage.cancelOrder(orderCode, reason);

    if (res.success) {
      Utils.showToast(`Order ${orderCode} was cancelled successfully.`, 'info', 'Order Cancelled');
      performOrderSearch(orderCode);
      renderMyOrders();
    } else {
      Utils.showToast(res.message, 'error');
    }
  };

  // --- MY ORDERS (ORDER HISTORY) ---
  const myOrdersNavBtn = document.getElementById('my-orders-nav-btn');
  if (myOrdersNavBtn) {
    myOrdersNavBtn.addEventListener('click', () => {
      openModal(myOrdersModal);
      renderMyOrders();
    });
  }

  async function renderMyOrders() {
    const container = document.getElementById('my-orders-list-body');
    if (!container) return;

    container.innerHTML = `<div style="text-align:center; padding: 24px;">Loading your orders...</div>`;
    const orders = await window.Storage.getOrders();

    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 40px 16px;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">📦</div>
          <h4>No orders placed yet</h4>
          <p style="color:var(--text-secondary); font-size:0.875rem;">Your placed orders will show up here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(o => {
      const status = o.Delivery_details || 'Pending';
      const canCancel = (status === APP_CONFIG.ORDER_STATUSES.PENDING || status === APP_CONFIG.ORDER_STATUSES.CONFIRMED);

      return `
        <div class="order-history-card animate-fade-in">
          <div class="order-history-header">
            <div>
              <div class="order-history-code">${o.order_code}</div>
              <div class="order-history-date">Placed ${Utils.formatDate(o.created_at)}</div>
            </div>
            <span class="status-pill status-${status.toLowerCase()}">${status}</span>
          </div>

          <div class="order-items-preview-list">
            ${(o.items || []).map(i => `
              <div class="order-item-mini-row">
                <span>• ${i.name} <strong>x${i.quantity || 1}</strong></span>
                <span>${Utils.formatCurrency((i.price || 0) * (i.quantity || 1))}</span>
              </div>
            `).join('')}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px;">
            <div style="font-size:0.875rem;">
              <span style="color:var(--text-secondary);">Total:</span>
              <strong style="font-size:1.05rem; color:var(--text-primary); margin-left:4px;">${Utils.formatCurrency(o.Price_details)}</strong>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-outline btn-sm" onclick="closeModal(myOrdersModal); openOrderTracker('${o.order_code}')">
                Track Status
              </button>
              ${canCancel ? `
                <button class="btn btn-danger btn-sm" onclick="cancelOrderPrompt('${o.order_code}')">
                  Cancel
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Header "Track Order" link
  const trackOrderNavBtn = document.getElementById('track-order-nav-btn');
  if (trackOrderNavBtn) {
    trackOrderNavBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(orderTrackerModal);
    });
  }

  // Initialize
  await loadProducts();
});
