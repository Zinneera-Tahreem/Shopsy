// Storage & Supabase Data Layer

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    Company_name: 'Apple',
    name: 'AirPods Max Space Gray',
    img_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    Description: 'High-fidelity audio, Active Noise Cancellation with Transparency mode, personalized spatial audio with dynamic head tracking, and acoustically engineered memory foam ear cushions.',
    Sales: 'Bestseller',
    Discount_amount: 70,
    Amount: 549.00,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 2,
    Company_name: 'Sony',
    name: 'WH-1000XM5 Wireless Headphones',
    img_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    Description: 'Industry-leading noise cancellation optimized automatically based on your wearing conditions and environment. Crystal clear hands-free calling with 4 beamforming microphones.',
    Sales: 'Trending',
    Discount_amount: 50,
    Amount: 399.99,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString()
  },
  {
    id: 3,
    Company_name: 'Apple',
    name: 'MacBook Air 15" M3 Chip',
    img_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    Description: 'Strikingly thin design with up to 18 hours of battery life. Liquid Retina display supports 1 billion colors. 1080p FaceTime HD camera with studio-quality three-mic array.',
    Sales: 'Hot Deal',
    Discount_amount: 150,
    Amount: 1299.00,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 4,
    Company_name: 'Nike',
    name: 'Air Zoom Pegasus 40 Running Shoes',
    img_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    Description: 'A springy ride for any run with responsive Nike React technology and dual Zoom Air units for bouncy energy return from road to trail.',
    Sales: 'New Arrival',
    Discount_amount: 30,
    Amount: 140.00,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 5,
    Company_name: 'Dyson',
    name: 'V15 Detect Cordless Vacuum',
    img_url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    Description: 'Laser reveals invisible dust on hard floors. Piezo sensor counts and measures the size of dust particles and intelligently adapts suction power.',
    Sales: 'Flash Sale',
    Discount_amount: 100,
    Amount: 749.99,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 6,
    Company_name: 'Samsung',
    name: 'Galaxy Watch 6 Classic 47mm',
    img_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    Description: 'Rotating bezel design with sapphire crystal glass, advanced sleep coaching, body composition analysis, and comprehensive ECG heart monitoring.',
    Sales: 'Bestseller',
    Discount_amount: 60,
    Amount: 369.99,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 7,
    Company_name: 'Sony',
    name: 'PlayStation 5 Slim Digital Edition',
    img_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    Description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
    Sales: 'Popular',
    Discount_amount: 50,
    Amount: 499.99,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 8,
    Company_name: 'Apple',
    name: 'iPad Air 11-inch M2 Liquid Retina',
    img_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    Description: 'Powered by the astonishing Apple M2 chip. Features gorgeous Liquid Retina display with P3 wide color, True Tone, and ultralow reflectivity.',
    Sales: 'Trending',
    Discount_amount: 50,
    Amount: 599.00,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 9,
    Company_name: 'Nike',
    name: 'Sportswear Tech Fleece Windrunner',
    img_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    Description: 'Smooth on both sides, Tech Fleece offers premium lightweight warmth without added bulk. Signature chevron lines on the chest honor heritage Windrunner jacket.',
    Sales: 'Hot Deal',
    Discount_amount: 25,
    Amount: 130.00,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 10,
    Company_name: 'Logitech',
    name: 'MX Master 3S Ergonomic Mouse',
    img_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    Description: 'Quiet Clicks deliver satisfying, soft tactile feel with 90% less click noise. 8K DPI any-surface tracking and MagSpeed electromagnetic scrolling.',
    Sales: 'Top Rated',
    Discount_amount: 15,
    Amount: 99.99,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 11,
    Company_name: 'Bose',
    name: 'QuietComfort Ultra Earbuds',
    img_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    Description: 'Breakthrough spatialized audio for more immersive listening. World-class noise cancellation custom-tuned to the unique geometry of your ear canals.',
    Sales: 'Special Deal',
    Discount_amount: 40,
    Amount: 299.00,
    is_available: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 12,
    Company_name: 'Samsung',
    name: '34" Odyssey OLED G8 Gaming Monitor',
    img_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    Description: 'Neo Quantum Processor with 0.03ms response time and 175Hz refresh rate on a curved QD-OLED display with electrifying CoreSync ambient lighting.',
    Sales: 'Mega Discount',
    Discount_amount: 200,
    Amount: 1199.99,
    is_available: false,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const DEFAULT_USERS = [
  {
    id: 101,
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 234-8901',
    address: '422 Lexington Ave, Apt 14B, New York, NY 10017',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    total_orders: 4,
    total_spent: 1840,
    created_at: '2025-11-14T10:15:00Z',
    status: 'Verified'
  },
  {
    id: 102,
    name: 'Marcus Vance',
    email: 'm.vance@techcorp.io',
    phone: '+1 (555) 789-3412',
    address: '880 Silicon Blvd, Suite 200, San Jose, CA 95113',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    total_orders: 3,
    total_spent: 1520,
    created_at: '2025-12-02T14:30:00Z',
    status: 'Verified'
  },
  {
    id: 103,
    name: 'Elena Rostova',
    email: 'elena.rostova@outlook.com',
    phone: '+1 (555) 456-9023',
    address: '1504 Pinecrest Drive, Austin, TX 78704',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    total_orders: 2,
    total_spent: 759,
    created_at: '2026-01-18T09:20:00Z',
    status: 'Verified'
  },
  {
    id: 104,
    name: 'David Kim',
    email: 'david.kim@gmail.com',
    phone: '+1 (555) 671-8890',
    address: '310 Ocean View Blvd, Santa Monica, CA 90401',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    total_orders: 5,
    total_spent: 2430,
    created_at: '2026-02-05T18:00:00Z',
    status: 'Verified'
  },
  {
    id: 105,
    name: 'Zinneera Tahreem',
    email: 'zinneera.t@example.com',
    phone: '+1 (555) 912-4433',
    address: '77 Heritage Way, Boston, MA 02116',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    total_orders: 1,
    total_spent: 479,
    created_at: '2026-03-10T11:45:00Z',
    status: 'Verified'
  }
];

const DEFAULT_ORDERS = [
  {
    Product_id: 1001,
    order_code: 'ORD-894120',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    Customer_name: 'Sarah Jenkins',
    customer_phone: '+1 (555) 234-8901',
    customer_email: 'sarah.jenkins@example.com',
    Address: '422 Lexington Ave, Apt 14B, New York, NY 10017',
    Delivery_details: 'Pending',
    delivery_type: 'Express Courier (1-2 Days)',
    Price_details: 479,
    Payment_details: 'Credit Card (Visa ending 8812)',
    items: [
      {
        id: 1,
        name: 'AirPods Max Space Gray',
        Company_name: 'Apple',
        price: 479.00,
        quantity: 1,
        img_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
      }
    ],
    timeline: [
      { status: 'Pending', time: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Order placed by customer' }
    ]
  },
  {
    Product_id: 1002,
    order_code: 'ORD-762904',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    Customer_name: 'Marcus Vance',
    customer_phone: '+1 (555) 789-3412',
    customer_email: 'm.vance@techcorp.io',
    Address: '880 Silicon Blvd, Suite 200, San Jose, CA 95113',
    Delivery_details: 'Confirmed',
    delivery_type: 'Standard Priority',
    Price_details: 1149,
    Payment_details: 'UPI / Direct Bank Transfer',
    items: [
      {
        id: 3,
        name: 'MacBook Air 15" M3 Chip',
        Company_name: 'Apple',
        price: 1149.00,
        quantity: 1,
        img_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
      }
    ],
    timeline: [
      { status: 'Pending', time: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Order placed by customer' },
      { status: 'Confirmed', time: new Date(Date.now() - 86400000 * 1 + 1800000).toISOString(), note: 'Payment verified and inventory allocated' }
    ]
  },
  {
    Product_id: 1003,
    order_code: 'ORD-541289',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    Customer_name: 'Elena Rostova',
    customer_phone: '+1 (555) 456-9023',
    customer_email: 'elena.rostova@outlook.com',
    Address: '1504 Pinecrest Drive, Austin, TX 78704',
    Delivery_details: 'Shipped',
    delivery_type: 'FedEx Express (Tracking: #FX-8891244)',
    Price_details: 349,
    Payment_details: 'Cash on Delivery (COD)',
    items: [
      {
        id: 2,
        name: 'WH-1000XM5 Wireless Headphones',
        Company_name: 'Sony',
        price: 349.99,
        quantity: 1,
        img_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    timeline: [
      { status: 'Pending', time: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Order placed' },
      { status: 'Confirmed', time: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(), note: 'Order approved' },
      { status: 'Shipped', time: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Dispatched via FedEx facility' }
    ]
  },
  {
    Product_id: 1004,
    order_code: 'ORD-329104',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    Customer_name: 'David Kim',
    customer_phone: '+1 (555) 671-8890',
    customer_email: 'david.kim@gmail.com',
    Address: '310 Ocean View Blvd, Santa Monica, CA 90401',
    Delivery_details: 'Delivered',
    delivery_type: 'Standard Ground Delivery',
    Price_details: 449,
    Payment_details: 'Credit Card (Mastercard ending 4490)',
    items: [
      {
        id: 7,
        name: 'PlayStation 5 Slim Digital Edition',
        Company_name: 'Sony',
        price: 449.99,
        quantity: 1,
        img_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'
      }
    ],
    timeline: [
      { status: 'Pending', time: new Date(Date.now() - 86400000 * 4).toISOString(), note: 'Order placed' },
      { status: 'Confirmed', time: new Date(Date.now() - 86400000 * 4 + 7200000).toISOString(), note: 'Confirmed' },
      { status: 'Shipped', time: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'In transit' },
      { status: 'Delivered', time: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Delivered at front porch and signed' }
    ]
  }
];

class StorageManager {
  constructor() {
    this.initLocalStorage();
  }

  initLocalStorage() {
    if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USERS)) {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CART)) {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CART, JSON.stringify([]));
    }
  }

  // --- PRODUCTS ---
  async getProducts() {
    // 1. Try fetching from Supabase Product table
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('Product').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          console.log('[Storage] Loaded products from Supabase:', data.length);
          localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
          return data;
        } else if (error) {
          console.warn('[Storage] Supabase products query notice:', error.message);
        }
      } catch (err) {
        console.warn('[Storage] Supabase query failed, falling back to local cache:', err);
      }
    }

    // 2. Fallback to LocalStorage
    try {
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }

    return DEFAULT_PRODUCTS;
  }

  async addProduct(product) {
    const localProducts = await this.getProducts();
    const newId = Date.now();
    const newProduct = {
      id: newId,
      created_at: new Date().toISOString(),
      Company_name: product.Company_name || 'Brand',
      name: product.name,
      img_url: product.img_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      Description: product.Description || '',
      Sales: product.Sales || 'New Arrival',
      Discount_amount: Number(product.Discount_amount) || 0,
      Amount: parseFloat(product.Amount) || 0,
      is_available: Boolean(product.is_available)
    };

    // Save locally first
    localProducts.unshift(newProduct);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(localProducts));

    // Try Supabase insert
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('Product').insert([
          {
            Company_name: newProduct.Company_name,
            name: newProduct.name,
            img_url: newProduct.img_url,
            Description: newProduct.Description,
            Sales: newProduct.Sales,
            Discount_amount: newProduct.Discount_amount,
            Amount: newProduct.Amount,
            is_available: newProduct.is_available
          }
        ]).select();

        if (error) {
          console.warn('[Storage] Supabase insert product failed (RLS or error):', error.message);
        } else if (data && data[0]) {
          console.log('[Storage] Supabase insert succeeded:', data[0]);
          newProduct.id = data[0].id;
        }
      } catch (err) {
        console.warn('[Storage] Supabase product insert caught:', err);
      }
    }

    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

      if (supabaseClient) {
        try {
          await supabaseClient.from('Product').update(updates).eq('id', id);
        } catch (err) {
          console.warn('[Storage] Supabase product update failed:', err);
        }
      }
      return products[index];
    }
    return null;
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    products = products.filter(p => String(p.id) !== String(id));
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    if (supabaseClient) {
      try {
        await supabaseClient.from('Product').delete().eq('id', id);
      } catch (err) {
        console.warn('[Storage] Supabase product delete failed:', err);
      }
    }
    return true;
  }

  // --- ORDERS ---
  async getOrders() {
    let supabaseOrders = [];
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('Order')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          supabaseOrders = data.map(item => this.normalizeSupabaseOrder(item));
        }
      } catch (err) {
        console.warn('[Storage] Supabase orders fetch error:', err);
      }
    }

    // Merge with LocalStorage orders (ensuring no duplicates)
    let localOrders = [];
    try {
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.ORDERS);
      if (stored) {
        localOrders = JSON.parse(stored);
      }
    } catch (e) {
      localOrders = DEFAULT_ORDERS;
    }

    // Map by order_code or Product_id
    const orderMap = new Map();
    // Add local orders first
    localOrders.forEach(o => {
      const key = o.order_code || String(o.Product_id);
      orderMap.set(key, o);
    });
    // Overlay Supabase orders
    supabaseOrders.forEach(o => {
      const key = o.order_code || String(o.Product_id);
      if (orderMap.has(key)) {
        orderMap.set(key, { ...orderMap.get(key), ...o });
      } else {
        orderMap.set(key, o);
      }
    });

    const merged = Array.from(orderMap.values());
    merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return merged;
  }

  normalizeSupabaseOrder(row) {
    let parsedDelivery = row.Delivery_details || 'Pending';
    let items = [];
    let deliveryType = 'Standard Delivery';
    let customerPhone = '';
    let customerEmail = '';
    let orderCode = `ORD-${row.Product_id || Math.floor(100000 + Math.random() * 900000)}`;

    // Try parsing Delivery_details if it was stored as JSON or composite string
    if (parsedDelivery.startsWith('{')) {
      try {
        const meta = JSON.parse(parsedDelivery);
        parsedDelivery = meta.status || 'Pending';
        items = meta.items || [];
        deliveryType = meta.delivery_type || deliveryType;
        customerPhone = meta.phone || '';
        customerEmail = meta.email || '';
        if (meta.order_code) orderCode = meta.order_code;
      } catch (e) {
        // keep string
      }
    } else if (parsedDelivery.includes('|')) {
      const parts = parsedDelivery.split('|').map(s => s.trim());
      parsedDelivery = parts[0] || 'Pending';
      deliveryType = parts[1] || deliveryType;
    }

    return {
      Product_id: row.Product_id,
      order_code: orderCode,
      created_at: row.created_at,
      Customer_name: row.Customer_name || 'Customer',
      customer_phone: customerPhone,
      customer_email: customerEmail,
      Address: row.Address || 'Not specified',
      Delivery_details: parsedDelivery,
      delivery_type: deliveryType,
      Price_details: Number(row.Price_details) || 0,
      Payment_details: row.Payment_details || 'Cash on Delivery',
      items: items.length ? items : [
        {
          id: row.Product_id,
          name: 'Ordered Product',
          price: Number(row.Price_details) || 0,
          quantity: 1,
          Company_name: 'Store'
        }
      ],
      timeline: [
        { status: parsedDelivery, time: row.created_at, note: 'Order registered' }
      ]
    };
  }

  async createOrder(orderPayload) {
    const orders = await this.getOrders();
    const orderCode = Utils.generateOrderId();
    const newId = Date.now();
    const now = new Date().toISOString();

    const newOrder = {
      Product_id: newId,
      order_code: orderCode,
      created_at: now,
      Customer_name: orderPayload.customer_name,
      customer_phone: orderPayload.customer_phone || '',
      customer_email: orderPayload.customer_email || '',
      Address: orderPayload.address,
      Delivery_details: APP_CONFIG.ORDER_STATUSES.PENDING,
      delivery_type: orderPayload.delivery_type || 'Standard Ground (2-4 Days)',
      Price_details: Math.round(orderPayload.total_amount),
      Payment_details: orderPayload.payment_method,
      items: orderPayload.items || [],
      timeline: [
        { status: APP_CONFIG.ORDER_STATUSES.PENDING, time: now, note: 'Order placed by customer' }
      ]
    };

    // Save to LocalStorage immediately
    orders.unshift(newOrder);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Supabase PostgREST payload matching table schema:
    // "Customer_name", "Address", "Delivery_details", "Price_details", "Payment_details"
    const compositeDelivery = JSON.stringify({
      status: APP_CONFIG.ORDER_STATUSES.PENDING,
      order_code: orderCode,
      phone: orderPayload.customer_phone || '',
      email: orderPayload.customer_email || '',
      delivery_type: newOrder.delivery_type,
      items: newOrder.items
    });

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('Order').insert([
          {
            Customer_name: orderPayload.customer_name,
            Address: orderPayload.address,
            Delivery_details: compositeDelivery,
            Price_details: Math.round(orderPayload.total_amount),
            Payment_details: orderPayload.payment_method
          }
        ]).select();

        if (error) {
          console.warn('[Storage] Supabase Order insert notice (RLS policy may be active):', error.message);
        } else if (data && data[0]) {
          console.log('[Storage] Supabase order inserted with ID:', data[0].Product_id);
          newOrder.Product_id = data[0].Product_id;
        }
      } catch (err) {
        console.warn('[Storage] Supabase order insert caught:', err);
      }
    }

    // Clear cart on successful order placement
    this.clearCart();

    return newOrder;
  }

  async updateOrderStatus(orderIdentifier, newStatus, adminNote = '') {
    const orders = await this.getOrders();
    const order = orders.find(o => 
      String(o.Product_id) === String(orderIdentifier) || 
      String(o.order_code) === String(orderIdentifier)
    );

    if (!order) return null;

    order.Delivery_details = newStatus;
    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      status: newStatus,
      time: new Date().toISOString(),
      note: adminNote || `Status changed to ${newStatus}`
    });

    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    if (supabaseClient) {
      try {
        // Build composite delivery string to preserve item metadata
        const composite = JSON.stringify({
          status: newStatus,
          order_code: order.order_code,
          phone: order.customer_phone,
          email: order.customer_email,
          delivery_type: order.delivery_type,
          items: order.items
        });

        await supabaseClient.from('Order')
          .update({ Delivery_details: composite })
          .eq('Product_id', order.Product_id);
      } catch (err) {
        console.warn('[Storage] Supabase update status failed:', err);
      }
    }

    return order;
  }

  async cancelOrder(orderIdentifier, reason = 'Cancelled by user') {
    const orders = await this.getOrders();
    const order = orders.find(o => 
      String(o.Product_id) === String(orderIdentifier) || 
      String(o.order_code) === String(orderIdentifier)
    );

    if (!order) return { success: false, message: 'Order not found' };

    // Check cancellation permission: only Pending or Confirmed
    if (order.Delivery_details === APP_CONFIG.ORDER_STATUSES.SHIPPED || order.Delivery_details === APP_CONFIG.ORDER_STATUSES.DELIVERED) {
      return { success: false, message: 'This order has already been shipped or delivered and cannot be cancelled directly.' };
    }

    if (order.Delivery_details === APP_CONFIG.ORDER_STATUSES.CANCELLED) {
      return { success: false, message: 'This order is already cancelled.' };
    }

    const updated = await this.updateOrderStatus(orderIdentifier, APP_CONFIG.ORDER_STATUSES.CANCELLED, reason);
    return { success: true, order: updated };
  }

  // --- CART MANAGEMENT ---
  getCart() {
    try {
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveCart(cart) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('lumina:cart_updated', { detail: { count: this.getCartCount(), cart } }));
  }

  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => String(item.id) === String(product.id));

    // Calculate effective discounted price
    const unitPrice = Math.max(0, (product.Amount || 0) - (product.Discount_amount || 0));

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        Company_name: product.Company_name,
        img_url: product.img_url,
        price: unitPrice,
        original_price: product.Amount,
        discount: product.Discount_amount,
        quantity: quantity
      });
    }

    this.saveCart(cart);
    return cart;
  }

  updateCartQuantity(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => String(item.id) !== String(productId));
    } else {
      const item = cart.find(item => String(item.id) === String(productId));
      if (item) {
        item.quantity = quantity;
      }
    }
    this.saveCart(cart);
    return cart;
  }

  removeFromCart(productId) {
    return this.updateCartQuantity(productId, 0);
  }

  clearCart() {
    this.saveCart([]);
  }

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  }

  // --- USERS ---
  getUsers() {
    try {
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  }

  addUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      address: userData.address || '',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80`,
      total_orders: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
      status: 'Active'
    };
    users.unshift(newUser);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  }

  // --- SEED SUPABASE CATALOG HELPER ---
  async seedSupabaseProducts() {
    if (!supabaseClient) {
      return { success: false, message: 'Supabase client is not available.' };
    }

    const payload = DEFAULT_PRODUCTS.map(p => ({
      Company_name: p.Company_name,
      name: p.name,
      img_url: p.img_url,
      Description: p.Description,
      Sales: p.Sales,
      Discount_amount: p.Discount_amount,
      Amount: p.Amount,
      is_available: p.is_available
    }));

    try {
      const { data, error } = await supabaseClient.from('Product').insert(payload).select();
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, count: data ? data.length : payload.length };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

// Global storage singleton
window.Storage = new StorageManager();
