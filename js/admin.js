// Admin Panel Application Logic

document.addEventListener('DOMContentLoaded', async () => {
  // Navigation State
  let activeTab = 'dashboard';
  let allOrders = [];
  let allUsers = [];
  let allProducts = [];

  // Filter States
  let orderFilterStatus = 'all';
  let orderSearchQuery = '';
  let userSearchQuery = '';
  let productSearchQuery = '';

  // DOM Elements
  const tabButtons = document.querySelectorAll('.admin-nav-item button');
  const viewSections = {
    dashboard: document.getElementById('view-dashboard'),
    orders: document.getElementById('view-orders'),
    products: document.getElementById('view-products'),
    users: document.getElementById('view-users'),
    supabase: document.getElementById('view-supabase')
  };

  // KPI Elements
  const kpiTotalUsers = document.getElementById('kpi-total-users');
  const kpiTotalOrders = document.getElementById('kpi-total-orders');
  const kpiPendingOrders = document.getElementById('kpi-pending-orders');
  const kpiTotalRevenue = document.getElementById('kpi-total-revenue');
  const recentOrdersTbody = document.getElementById('recent-orders-tbody');

  // Orders Tab Elements
  const ordersTbody = document.getElementById('orders-table-tbody');
  const orderSearchInput = document.getElementById('order-search-input');
  const orderStatusTabs = document.querySelectorAll('.order-status-tab');
  const ordersCountBadge = document.getElementById('orders-count-badge');

  // Users Tab Elements
  const usersTbody = document.getElementById('users-table-tbody');
  const userSearchInput = document.getElementById('user-search-input');

  // Products Tab Elements
  const productsTbody = document.getElementById('products-table-tbody');
  const productSearchInput = document.getElementById('product-search-input');
  const btnOpenAddProduct = document.getElementById('btn-open-add-product');
  const btnSeedSupabase = document.getElementById('btn-seed-supabase');

  // Modals
  const orderDetailModal = document.getElementById('admin-order-modal');
  const productFormModal = document.getElementById('admin-product-modal');
  const addUserModal = document.getElementById('admin-user-modal');

  // Tab Switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  function switchTab(tabName) {
    activeTab = tabName;
    tabButtons.forEach(b => {
      const parent = b.closest('.admin-nav-item');
      if (b.dataset.tab === tabName) parent.classList.add('active');
      else parent.classList.remove('active');
    });

    Object.keys(viewSections).forEach(key => {
      if (viewSections[key]) {
        viewSections[key].style.display = key === tabName ? 'block' : 'none';
      }
    });

    const pageTitle = document.getElementById('admin-page-title');
    if (pageTitle) {
      const titles = {
        dashboard: 'Dashboard Overview',
        orders: 'Customer Orders Management',
        products: 'Products & Inventory Catalog',
        users: 'Registered Users Directory',
        supabase: 'Supabase Cloud Database Settings'
      };
      pageTitle.textContent = titles[tabName] || 'Admin Portal';
    }

    if (tabName === 'dashboard') loadDashboard();
    if (tabName === 'orders') renderOrdersTable();
    if (tabName === 'products') renderProductsTable();
    if (tabName === 'users') renderUsersTable();
  }

  // Load and refresh all admin data
  async function reloadAllData() {
    allOrders = await window.Storage.getOrders();
    allUsers = window.Storage.getUsers();
    allProducts = await window.Storage.getProducts();

    loadDashboard();
    renderOrdersTable();
    renderProductsTable();
    renderUsersTable();
  }

  // --- DASHBOARD OVERVIEW ---
  function loadDashboard() {
    const totalUsers = allUsers.length;
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.Delivery_details === APP_CONFIG.ORDER_STATUSES.PENDING).length;
    const totalRevenue = allOrders
      .filter(o => o.Delivery_details !== APP_CONFIG.ORDER_STATUSES.CANCELLED)
      .reduce((sum, o) => sum + (Number(o.Price_details) || 0), 0);

    if (kpiTotalUsers) kpiTotalUsers.textContent = totalUsers.toLocaleString();
    if (kpiTotalOrders) kpiTotalOrders.textContent = totalOrders.toLocaleString();
    if (kpiPendingOrders) kpiPendingOrders.textContent = pendingOrders.toLocaleString();
    if (kpiTotalRevenue) kpiTotalRevenue.textContent = Utils.formatCurrency(totalRevenue);

    // Update pending badge in sidebar
    const pendingNavBadge = document.getElementById('sidebar-pending-badge');
    if (pendingNavBadge) {
      pendingNavBadge.textContent = pendingOrders;
      pendingNavBadge.style.display = pendingOrders > 0 ? 'inline-block' : 'none';
    }

    // Render Recent 5 Orders on Dashboard
    if (recentOrdersTbody) {
      const recent = allOrders.slice(0, 5);
      if (recent.length === 0) {
        recentOrdersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color:var(--text-muted);">No orders recorded yet.</td></tr>`;
      } else {
        recentOrdersTbody.innerHTML = recent.map(o => createOrderTableRow(o)).join('');
      }
    }
  }

  // Helper to generate an order table row
  function createOrderTableRow(order) {
    const status = order.Delivery_details || 'Pending';
    const itemsCount = (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0);
    const dateFormatted = Utils.formatDate(order.created_at);

    return `
      <tr data-order-id="${order.order_code}">
        <td>
          <strong style="color:var(--brand-primary); font-weight:700;">${order.order_code}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${dateFormatted}</div>
        </td>
        <td>
          <div class="customer-name">${order.Customer_name || 'Anonymous'}</div>
          <div class="customer-subtext">${order.customer_phone || order.customer_email || 'No contact'}</div>
        </td>
        <td>
          <div>${itemsCount} item${itemsCount > 1 ? 's' : ''}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary); max-width: 180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${(order.items || []).map(i => i.name).join(', ')}
          </div>
        </td>
        <td>
          <strong style="font-size:0.95rem;">${Utils.formatCurrency(order.Price_details)}</strong>
          <div style="font-size:0.72rem; color:var(--text-muted);">${order.Payment_details || 'COD'}</div>
        </td>
        <td>
          <select class="status-select-dropdown" onchange="handleAdminStatusChange('${order.order_code}', this.value)">
            ${Object.values(APP_CONFIG.ORDER_STATUSES).map(st => `
              <option value="${st}" ${st === status ? 'selected' : ''}>${st}</option>
            `).join('')}
          </select>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openAdminOrderDetail('${order.order_code}')">
            View Details
          </button>
        </td>
      </tr>
    `;
  }

  // --- ORDERS TAB ---
  function renderOrdersTable() {
    if (!ordersTbody) return;

    let filtered = allOrders.filter(order => {
      // Status filter
      if (orderFilterStatus !== 'all' && order.Delivery_details !== orderFilterStatus) {
        return false;
      }
      // Search query
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const codeMatch = order.order_code && order.order_code.toLowerCase().includes(q);
        const nameMatch = order.Customer_name && order.Customer_name.toLowerCase().includes(q);
        const phoneMatch = order.customer_phone && order.customer_phone.includes(q);
        const addrMatch = order.Address && order.Address.toLowerCase().includes(q);
        if (!codeMatch && !nameMatch && !phoneMatch && !addrMatch) return false;
      }
      return true;
    });

    if (ordersCountBadge) {
      ordersCountBadge.textContent = `${filtered.length} Orders`;
    }

    if (filtered.length === 0) {
      ordersTbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 48px; color:var(--text-secondary);">
            <div style="font-size: 2rem; margin-bottom: 8px;">📋</div>
            <h4>No customer orders found</h4>
            <p style="font-size: 0.875rem;">Try adjusting your search criteria or status filter.</p>
          </td>
        </tr>
      `;
      return;
    }

    ordersTbody.innerHTML = filtered.map(o => createOrderTableRow(o)).join('');
  }

  // Filter Listeners for Orders
  if (orderSearchInput) {
    orderSearchInput.addEventListener('input', (e) => {
      orderSearchQuery = e.target.value;
      renderOrdersTable();
    });
  }

  orderStatusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      orderStatusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      orderFilterStatus = tab.dataset.status;
      renderOrdersTable();
    });
  });

  window.handleAdminStatusChange = async (orderCode, newStatus) => {
    const updated = await window.Storage.updateOrderStatus(orderCode, newStatus, `Updated via Admin Portal`);
    if (updated) {
      Utils.showToast(`Order ${orderCode} status updated to ${newStatus}`, 'success', 'Status Updated');
      await reloadAllData();
    } else {
      Utils.showToast('Failed to update status', 'error');
    }
  };

  // Order Details Modal View
  window.openAdminOrderDetail = (orderCode) => {
    const order = allOrders.find(o => String(o.order_code) === String(orderCode));
    if (!order) return;

    const modalBody = document.getElementById('admin-order-modal-body');
    if (!modalBody) return;

    const status = order.Delivery_details || 'Pending';

    modalBody.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid var(--border-subtle);">
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">ORDER DETAILS</span>
          <h2 style="font-size:1.5rem; font-weight:800; color:var(--brand-primary);">${order.order_code}</h2>
          <div style="font-size:0.8125rem; color:var(--text-secondary);">Placed: ${Utils.formatDate(order.created_at)}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; font-weight:700;">CURRENT STATUS</div>
          <select class="status-select-dropdown" style="font-size:0.875rem; font-weight:700;" onchange="handleAdminStatusChange('${order.order_code}', this.value); setTimeout(() => openAdminOrderDetail('${order.order_code}'), 300);">
            ${Object.values(APP_CONFIG.ORDER_STATUSES).map(st => `
              <option value="${st}" ${st === status ? 'selected' : ''}>${st}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:24px;">
        <div style="background:var(--bg-subtle); border-radius:var(--radius-md); padding:16px; border:1px solid var(--border-subtle);">
          <h4 style="font-size:0.875rem; font-weight:700; margin-bottom:8px; color:var(--text-secondary); text-transform:uppercase;">Customer Profile</h4>
          <div style="font-weight:700; font-size:1rem; margin-bottom:4px;">${order.Customer_name}</div>
          <div style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:2px;">Phone: ${order.customer_phone || 'N/A'}</div>
          <div style="font-size:0.875rem; color:var(--text-secondary);">Email: ${order.customer_email || 'N/A'}</div>
        </div>

        <div style="background:var(--bg-subtle); border-radius:var(--radius-md); padding:16px; border:1px solid var(--border-subtle);">
          <h4 style="font-size:0.875rem; font-weight:700; margin-bottom:8px; color:var(--text-secondary); text-transform:uppercase;">Delivery & Logistics</h4>
          <div style="font-size:0.875rem; margin-bottom:6px;"><strong>Address:</strong> ${order.Address}</div>
          <div style="font-size:0.875rem; margin-bottom:2px;"><strong>Method:</strong> ${order.delivery_type || 'Standard Courier'}</div>
          <div style="font-size:0.875rem;"><strong>Payment:</strong> ${order.Payment_details}</div>
        </div>
      </div>

      <h4 style="font-size:0.9375rem; font-weight:700; margin-bottom:12px;">Order Line Items (${(order.items || []).length})</h4>
      <div style="border:1px solid var(--border-subtle); border-radius:var(--radius-md); overflow:hidden; margin-bottom:20px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th style="text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.img_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}" style="width:40px; height:40px; border-radius:var(--radius-xs); object-fit:cover;">
                    <div>
                      <div style="font-weight:700;">${item.name}</div>
                      <div style="font-size:0.75rem; color:var(--text-muted);">${item.Company_name || ''}</div>
                    </div>
                  </div>
                </td>
                <td>${Utils.formatCurrency(item.price)}</td>
                <td>${item.quantity || 1}</td>
                <td style="text-align:right; font-weight:700;">${Utils.formatCurrency((item.price || 0) * (item.quantity || 1))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="padding:16px 20px; background:var(--bg-subtle); border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; font-size:1rem;">Grand Total Amount:</span>
          <span style="font-weight:800; font-size:1.35rem; color:var(--brand-primary);">${Utils.formatCurrency(order.Price_details)}</span>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px;">
        <button class="btn btn-outline btn-sm" onclick="window.print()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
          Print Invoice
        </button>
      </div>
    `;

    openModal(orderDetailModal);
  };

  // --- USERS DIRECTORY TAB ---
  function renderUsersTable() {
    if (!usersTbody) return;

    let filtered = allUsers.filter(u => {
      if (userSearchQuery.trim()) {
        const q = userSearchQuery.toLowerCase();
        return (
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.phone && u.phone.includes(q))
        );
      }
      return true;
    });

    const userCountBadge = document.getElementById('users-count-badge');
    if (userCountBadge) userCountBadge.textContent = `${filtered.length} Users`;

    if (filtered.length === 0) {
      usersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 36px; color:var(--text-muted);">No users found.</td></tr>`;
      return;
    }

    usersTbody.innerHTML = filtered.map(u => `
      <tr>
        <td>
          <div class="customer-cell">
            <img class="customer-avatar" src="${u.avatar}" alt="${u.name}">
            <div class="customer-info-col">
              <span class="customer-name">${u.name}</span>
              <span class="customer-subtext">ID: #${u.id}</span>
            </div>
          </div>
        </td>
        <td>${u.email}</td>
        <td>${u.phone || 'N/A'}</td>
        <td>
          <strong>${u.total_orders || 0}</strong> orders
        </td>
        <td>
          <strong>${Utils.formatCurrency(u.total_spent || 0)}</strong>
        </td>
        <td>
          <span class="badge badge-success">${u.status || 'Verified'}</span>
        </td>
      </tr>
    `).join('');
  }

  if (userSearchInput) {
    userSearchInput.addEventListener('input', (e) => {
      userSearchQuery = e.target.value;
      renderUsersTable();
    });
  }

  // --- PRODUCTS MANAGEMENT TAB ---
  function renderProductsTable() {
    if (!productsTbody) return;

    let filtered = allProducts.filter(p => {
      if (productSearchQuery.trim()) {
        const q = productSearchQuery.toLowerCase();
        return (
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.Company_name && p.Company_name.toLowerCase().includes(q)) ||
          (p.Sales && p.Sales.toLowerCase().includes(q))
        );
      }
      return true;
    });

    const prodCountBadge = document.getElementById('products-count-badge');
    if (prodCountBadge) prodCountBadge.textContent = `${filtered.length} Products`;

    if (filtered.length === 0) {
      productsTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 36px; color:var(--text-muted);">No products found in catalog.</td></tr>`;
      return;
    }

    productsTbody.innerHTML = filtered.map(p => {
      const finalPrice = Math.max(0, (p.Amount || 0) - (p.Discount_amount || 0));
      const isAvailable = p.is_available !== false;

      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="${p.img_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}" style="width:48px; height:48px; border-radius:var(--radius-sm); object-fit:cover;">
              <div>
                <strong style="color:var(--text-primary); font-size:0.9375rem;">${p.name}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">ID: ${p.id}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge badge-brand">${p.Company_name || 'N/A'}</span>
          </td>
          <td>
            <span class="badge badge-warning">${p.Sales || 'Standard'}</span>
          </td>
          <td>
            <strong>${Utils.formatCurrency(finalPrice)}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted); text-decoration:line-through;">${Utils.formatCurrency(p.Amount)}</div>
          </td>
          <td>
            <span class="badge badge-success">Save ${Utils.formatCurrency(p.Discount_amount)}</span>
          </td>
          <td>
            <button class="badge ${isAvailable ? 'badge-success' : 'badge-danger'}" style="cursor:pointer;" onclick="toggleProductAvailability(${p.id})">
              ${isAvailable ? '✓ In Stock' : '✗ Out of Stock'}
            </button>
          </td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProductPrompt(${p.id})">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (productSearchInput) {
    productSearchInput.addEventListener('input', (e) => {
      productSearchQuery = e.target.value;
      renderProductsTable();
    });
  }

  window.toggleProductAvailability = async (productId) => {
    const product = allProducts.find(p => String(p.id) === String(productId));
    if (!product) return;
    const newStatus = !product.is_available;
    await window.Storage.updateProduct(productId, { is_available: newStatus });
    Utils.showToast(`Product is now ${newStatus ? 'In Stock' : 'Out of Stock'}`, 'info');
    await reloadAllData();
  };

  window.deleteProductPrompt = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await window.Storage.deleteProduct(productId);
    Utils.showToast('Product removed from catalog', 'info');
    await reloadAllData();
  };

  // Add / Edit Product Modal
  if (btnOpenAddProduct) {
    btnOpenAddProduct.addEventListener('click', () => {
      document.getElementById('admin-product-modal-title').textContent = 'Add New Product';
      document.getElementById('product-form').reset();
      document.getElementById('prod-form-id').value = '';
      openModal(productFormModal);
    });
  }

  window.editProduct = (productId) => {
    const p = allProducts.find(item => String(item.id) === String(productId));
    if (!p) return;

    document.getElementById('admin-product-modal-title').textContent = 'Edit Product';
    document.getElementById('prod-form-id').value = p.id;
    document.getElementById('prod-form-name').value = p.name || '';
    document.getElementById('prod-form-company').value = p.Company_name || '';
    document.getElementById('prod-form-img').value = p.img_url || '';
    document.getElementById('prod-form-desc').value = p.Description || '';
    document.getElementById('prod-form-sales').value = p.Sales || '';
    document.getElementById('prod-form-amount').value = p.Amount || '';
    document.getElementById('prod-form-discount').value = p.Discount_amount || 0;
    document.getElementById('prod-form-available').checked = p.is_available !== false;

    openModal(productFormModal);
  };

  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('prod-form-id').value;
      const payload = {
        name: document.getElementById('prod-form-name').value.trim(),
        Company_name: document.getElementById('prod-form-company').value.trim(),
        img_url: document.getElementById('prod-form-img').value.trim(),
        Description: document.getElementById('prod-form-desc').value.trim(),
        Sales: document.getElementById('prod-form-sales').value.trim(),
        Amount: parseFloat(document.getElementById('prod-form-amount').value) || 0,
        Discount_amount: parseInt(document.getElementById('prod-form-discount').value, 10) || 0,
        is_available: document.getElementById('prod-form-available').checked
      };

      if (!payload.name || !payload.Company_name) {
        Utils.showToast('Please specify Product Name and Company Name', 'error');
        return;
      }

      if (id) {
        await window.Storage.updateProduct(id, payload);
        Utils.showToast(`Updated "${payload.name}" successfully`, 'success');
      } else {
        await window.Storage.addProduct(payload);
        Utils.showToast(`Added "${payload.name}" to catalog`, 'success');
      }

      closeModal(productFormModal);
      await reloadAllData();
    });
  }

  // Seed Supabase Button
  if (btnSeedSupabase) {
    btnSeedSupabase.addEventListener('click', async () => {
      btnSeedSupabase.disabled = true;
      btnSeedSupabase.textContent = 'Pushing to Supabase...';
      const res = await window.Storage.seedSupabaseProducts();
      btnSeedSupabase.disabled = false;
      btnSeedSupabase.textContent = 'Seed Supabase Products';

      if (res.success) {
        Utils.showToast(`Successfully seeded ${res.count} products into Supabase!`, 'success', 'Cloud Synced');
      } else {
        Utils.showToast(`Supabase Notice: ${res.message}. (Make sure RLS insert policy is enabled).`, 'warning', 'RLS Policy Needed');
      }
      await reloadAllData();
    });
  }

  // Open Add User
  const btnOpenAddUser = document.getElementById('btn-open-add-user');
  if (btnOpenAddUser) {
    btnOpenAddUser.addEventListener('click', () => {
      openModal(addUserModal);
    });
  }

  const userForm = document.getElementById('user-form');
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('user-form-name').value.trim();
      const email = document.getElementById('user-form-email').value.trim();
      const phone = document.getElementById('user-form-phone').value.trim();

      if (!name || !email) {
        Utils.showToast('Name and Email are required', 'error');
        return;
      }

      window.Storage.addUser({ name, email, phone });
      Utils.showToast(`User ${name} added successfully`, 'success');
      userForm.reset();
      closeModal(addUserModal);
      reloadAllData();
    });
  }

  // Copy SQL helper function
  window.copySqlSnippet = () => {
    const sql = `-- Enable RLS & Allow public read/write access for Product & Order
alter table public."Product" enable row level security;
drop policy if exists "Allow public all on Product" on public."Product";
create policy "Allow public all on Product" on public."Product" for all using (true) with check (true);

alter table public."Order" enable row level security;
drop policy if exists "Allow public all on Order" on public."Order";
create policy "Allow public all on Order" on public."Order" for all using (true) with check (true);`;

    navigator.clipboard.writeText(sql).then(() => {
      Utils.showToast('SQL script copied to clipboard! Paste in Supabase SQL Editor.', 'success');
    }).catch(() => {
      Utils.showToast('Please copy the SQL text manually.', 'info');
    });
  };

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

  // Initial load
  await reloadAllData();
});
