// Application Configuration & Supabase Setup
const APP_CONFIG = {
  SUPABASE_URL: 'https://weybxuluglpwdwrtdwsg.supabase.co',
  SUPABASE_KEY: 'sb_publishable_zdv86Sa-egV9IgNEuBTnhA_VF3fO5Rk',
  APP_NAME: 'Lumina Market',
  CURRENCY_SYMBOL: '$',
  STORAGE_KEYS: {
    CART: 'lumina_cart_items',
    ORDERS: 'lumina_orders_v1',
    PRODUCTS: 'lumina_products_v1',
    USERS: 'lumina_registered_users',
    CURRENT_USER: 'lumina_active_session'
  },
  ORDER_STATUSES: {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
  }
};

// Initialize Supabase Client if library is loaded
let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    supabaseClient = supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_KEY);
    console.log('[Supabase] Initialized client successfully');
  } else {
    console.warn('[Supabase] Library not found in window, using offline/local storage fallback');
  }
} catch (err) {
  console.error('[Supabase] Initialization error:', err);
}

// Utilities
const Utils = {
  formatCurrency(amount) {
    const num = Number(amount) || 0;
    return APP_CONFIG.CURRENCY_SYMBOL + num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  },

  generateOrderId() {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${random}`;
  },

  showToast(message, type = 'info', title = '') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>';
    } else {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-content">
        ${title ? `<strong class="toast-title">${title}</strong>` : ''}
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};
