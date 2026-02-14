// ==================== DATA ====================
const products = [
  {
    id: 'dress1',
    name: 'فستان أنوثة ناعمة',
    desc: 'فستان بناتي أنيق بتصميم ناعم يناسب المناسبات الخاصة والخروجات الراقية',
    details: 'خامة مريحة وخفيفة • متوفر بعدة ألوان',
    price: 420,
    category: 'dresses',
    emoji: '👗',
    gradient: 'linear-gradient(135deg, #FADADD, #E8A0BF)',
    colors: ['وردي', 'بيج', 'أبيض']
  },
  {
    id: 'dress2',
    name: 'فستان وردي فاخر',
    desc: 'تصميم أنثوي راقٍ بلمسة فخامة مثالي للسهرات والمناسبات',
    details: 'قماش عالي الجودة • تصميم حصري',
    price: 550,
    category: 'dresses',
    emoji: '✨',
    gradient: 'linear-gradient(135deg, #F8C8DC, #E8A0BF)',
    colors: ['وردي فاخر', 'ذهبي']
  },
  {
    id: 'dress3',
    name: 'فستان يومي أنيق',
    desc: 'فستان عملي وأنيق للاستخدام اليومي بتصميم بسيط ومريح',
    details: 'مريح للغاية • مناسب لكل يوم',
    price: 280,
    category: 'dresses',
    emoji: '🌸',
    gradient: 'linear-gradient(135deg, #FFF0F5, #FADADD)',
    colors: ['أبيض', 'سماوي', 'وردي']
  },
  {
    id: 'acc1',
    name: 'عقد بناتي ناعم',
    desc: 'عقد أنيق بتصميم بسيط يناسب جميع الإطلالات',
    details: 'تصميم عصري • خامة عالية الجودة',
    price: 120,
    category: 'accessories',
    emoji: '📿',
    gradient: 'linear-gradient(135deg, #FFF8DC, #F5D76E)',
    colors: ['ذهبي', 'فضي']
  },
  {
    id: 'acc2',
    name: 'حقيبة يد أنثوية',
    desc: 'حقيبة صغيرة بتصميم فخم عملية وأنيقة',
    details: 'جلد فاخر • حجم مثالي',
    price: 350,
    category: 'accessories',
    emoji: '👜',
    gradient: 'linear-gradient(135deg, #FDE8EF, #E8A0BF)',
    colors: ['وردي', 'بيج', 'أسود']
  },
  {
    id: 'acc3',
    name: 'أقراط راقية',
    desc: 'أقراط بناتية خفيفة تضيف لمسة جمال لأي إطلالة',
    details: 'خفيفة الوزن • مقاومة للحساسية',
    price: 95,
    category: 'accessories',
    emoji: '✨',
    gradient: 'linear-gradient(135deg, #FFF0E6, #F5D76E)',
    colors: ['ذهبي', 'وردي']
  }
];

let cart = [];
let orders = [];
let loggedInUser = null;
let liked = {};
let currentPage = 'home';

// ==================== CONFIG ====================
const defaultConfig = {
  background_color: '#FFF5F7',
  surface_color: '#FFFFFF',
  text_color: '#4A3040',
  primary_action: '#E8A0BF',
  secondary_action: '#D4AF37',
  font_family: 'Tajawal',
  welcome_text: 'لأن الأناقة تبدأ من اختيارك',
  hero_subtitle: 'اكتشفي أجمل الفساتين والإكسسوارات بأسلوب يليق بك',
  footer_text: 'متجر أنثوي فاخر متخصص في الفساتين والإكسسوارات الراقية'
};

function applyConfig(config) {
  const root = document.documentElement;

  root.style.setProperty('--bg-color', config.background_color);
  root.style.setProperty('--surface-color', config.surface_color);
  root.style.setProperty('--text-color', config.text_color);
  root.style.setProperty('--primary-action', config.primary_action);
  root.style.setProperty('--secondary-action', config.secondary_action);

  document.body.style.fontFamily = `${config.font_family}, Tajawal, sans-serif`;

  const welcomeEl = document.getElementById('welcome-text-el');
  if (welcomeEl) welcomeEl.textContent = config.welcome_text;

  const subtitleEl = document.getElementById('hero-subtitle-el');
  if (subtitleEl) subtitleEl.textContent = config.hero_subtitle;

  const footerEl = document.getElementById('footer-text-el');
  if (footerEl) footerEl.textContent = config.footer_text;
}

// ==================== NAVIGATION ====================
function navigateTo(page) {
  currentPage = page;

  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll(`.nav-link[data-page="${page}"]`).forEach(l => l.classList.add('active'));

  const wrapper = document.getElementById('app-wrapper');
  if (wrapper) wrapper.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'cart') renderCart();
  if (page === 'shop') renderShopProducts(currentShopFilter);
  if (page === 'orders') renderOrders();
  if (page === 'checkout') renderCheckout();
  if (page === 'account') renderAccount();
}

function toggleMobileMenu() {
  const nav = document.getElementById('mobile-nav');
  if (!nav) return;

  if (nav.style.maxHeight === '0px' || nav.style.maxHeight === '') {
    nav.style.maxHeight = '200px';
  } else {
    nav.style.maxHeight = '0px';
  }
}

// ==================== TOAST ====================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<div class="flex items-center gap-3"><span>${icon}</span><span class="text-sm font-medium">${message}</span></div>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ==================== PRODUCT RENDERING ====================
function createProductCard(product, index) {
  const isLiked = liked[product.id];

  const card = document.createElement('div');
  card.className = `product-card rounded-2xl overflow-hidden anim-fade-up delay-${(index % 3) + 1}`;
  card.style.cssText = `background: var(--surface-color); box-shadow: 0 4px 20px rgba(232,160,191,0.08);`;
  card.dataset.productId = product.id;

  card.innerHTML = `
    <div class="relative cursor-pointer" onclick="showProductDetail('${product.id}')">
      <div class="h-52 sm:h-60 flex items-center justify-center relative" style="background: ${product.gradient};">
        <span class="text-7xl">${product.emoji}</span>
        <div class="product-img-overlay absolute inset-0 flex items-center justify-center opacity-0 transition-opacity" style="background: rgba(74,48,64,0.2);">
          <span class="text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">عرض التفاصيل</span>
        </div>
      </div>

      <button class="heart-btn ${isLiked ? 'liked' : ''} absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all"
              style="background: white;"
              onclick="event.stopPropagation(); toggleLike('${product.id}', this);">
        ${isLiked ? '❤️' : '🤍'}
      </button>

      <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium"
           style="background: ${product.category === 'dresses' ? 'rgba(232,160,191,0.9)' : 'rgba(212,175,55,0.9)'}; color: white;">
        ${product.category === 'dresses' ? '👗 فساتين' : '💍 إكسسوارات'}
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-bold text-sm mb-1">${product.name}</h3>
      <p class="text-xs opacity-60 mb-3">${product.desc}</p>
      <div class="flex items-center justify-between">
        <span class="font-display font-bold text-lg" style="color: var(--primary-action);">${product.price} ريال</span>
        <button onclick="event.stopPropagation(); addToCart('${product.id}')" class="btn-pink text-white px-4 py-2 rounded-full text-xs font-medium shadow-md">
          + السلة
        </button>
      </div>
    </div>
  `;
  return card;
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  container.innerHTML = '';
  products.slice(0, 3).forEach((p, i) => container.appendChild(createProductCard(p, i)));
}

let currentShopFilter = 'all';

function renderShopProducts(filter = 'all') {
  currentShopFilter = filter;

  const container = document.getElementById('shop-products');
  if (!container) return;

  container.innerHTML = '';
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  filtered.forEach((p, i) => container.appendChild(createProductCard(p, i)));
}

// ✅ إصلاح: ما عاد نعتمد على event
function filterCategory(cat, btnEl = null) {
  document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));

  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    // لو ناديناها برمجياً
    document.querySelectorAll('.category-pill').forEach(p => {
      if (cat === 'all' && p.textContent.includes('الكل')) p.classList.add('active');
      if (cat === 'dresses' && p.textContent.includes('الفساتين')) p.classList.add('active');
      if (cat === 'accessories' && p.textContent.includes('الإكسسوارات')) p.classList.add('active');
    });
  }

  renderShopProducts(cat);
}

// ==================== PRODUCT DETAIL MODAL ====================
function showProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML = `
    <div class="modal-content">
      <div class="relative">
        <div class="h-52 sm:h-64 flex items-center justify-center rounded-t-2xl" style="background: ${product.gradient};">
          <span class="text-8xl">${product.emoji}</span>
        </div>
        <button onclick="this.closest('.modal-overlay').remove()"
                class="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                style="background: white;">✕</button>
      </div>

      <div class="p-6">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-bold text-lg">${product.name}</h3>
            <span class="text-xs px-2 py-0.5 rounded-full" style="background: rgba(232,160,191,0.15); color: var(--primary-action);">
              ${product.category === 'dresses' ? '👗 فساتين' : '💍 إكسسوارات'}
            </span>
          </div>
          <span class="font-display text-xl font-bold" style="color: var(--primary-action);">${product.price} ريال</span>
        </div>

        <p class="text-sm opacity-70 mb-3">${product.desc}</p>
        <p class="text-xs opacity-50 mb-4">${product.details}</p>

        ${product.colors ? `
          <div class="mb-4">
            <span class="text-xs font-medium opacity-60 mb-2 block">الألوان المتوفرة:</span>
            <div class="flex gap-2 flex-wrap">
              ${product.colors.map(c => `<span class="px-3 py-1 rounded-full text-xs border" style="border-color: rgba(232,160,191,0.3);">${c}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <button onclick="addToCart('${product.id}'); this.closest('.modal-overlay').remove();"
                class="btn-pink text-white w-full py-3.5 rounded-full font-medium shadow-lg text-sm">
          أضيفي إلى السلة 🧺
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ==================== LIKE ====================
function toggleLike(productId, btn) {
  liked[productId] = !liked[productId];
  btn.innerHTML = liked[productId] ? '❤️' : '🤍';
  btn.classList.toggle('liked', liked[productId]);
  if (liked[productId]) showToast('تمت الإضافة للمفضلة 💕');
}

// ==================== CART ====================
function addToCart(productId) {
  const existing = cart.find(c => c.productId === productId);
  if (existing) existing.qty++;
  else cart.push({ productId, qty: 1 });

  updateCartBadge();
  showToast('تمت الإضافة للسلة ✨');
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const total = cart.reduce((sum, c) => sum + c.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');

  if (!container || !emptyEl || !summaryEl) return;

  if (cart.length === 0) {
    container.innerHTML = '';
    emptyEl.classList.remove('hidden');
    summaryEl.classList.add('hidden');
    return;
  }

  emptyEl.classList.add('hidden');
  summaryEl.classList.remove('hidden');
  container.innerHTML = '';

  let total = 0;
  cart.forEach((item, idx) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    const itemTotal = product.price * item.qty;
    total += itemTotal;

    const el = document.createElement('div');
    el.className = 'flex items-center gap-4 p-4 rounded-2xl mb-3 anim-fade-up';
    el.style.cssText = `background: var(--surface-color); box-shadow: 0 2px 12px rgba(232,160,191,0.08); animation-delay: ${idx * 0.1}s;`;

    el.innerHTML = `
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center flex-shrink-0" style="background: ${product.gradient};">
        <span class="text-3xl">${product.emoji}</span>
      </div>

      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-sm truncate">${product.name}</h4>
        <p class="text-xs opacity-60">${product.price} ريال</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="updateCartQty('${product.id}', -1)" class="quantity-btn w-7 h-7 rounded-full border flex items-center justify-center text-sm" style="border-color: var(--primary-action);">−</button>
          <span class="text-sm font-bold w-6 text-center">${item.qty}</span>
          <button onclick="updateCartQty('${product.id}', 1)" class="quantity-btn w-7 h-7 rounded-full border flex items-center justify-center text-sm" style="border-color: var(--primary-action);">+</button>
        </div>
      </div>

      <div class="text-left flex-shrink-0">
        <div class="font-bold text-sm" style="color: var(--primary-action);">${itemTotal} ريال</div>
        <button onclick="removeFromCart('${product.id}')" class="text-xs text-red-400 mt-1 hover:text-red-500 transition-colors">حذف</button>
      </div>
    `;
    container.appendChild(el);
  });

  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = total + ' ريال';
}

function updateCartQty(productId, delta) {
  const item = cart.find(c => c.productId === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.productId !== productId);

  updateCartBadge();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.productId !== productId);
  updateCartBadge();
  renderCart();
  showToast('تم حذف المنتج من السلة');
}

// ==================== CHECKOUT ====================
function renderCheckout() {
  const step1 = document.getElementById('checkout-step1');
  const step2 = document.getElementById('checkout-step2');
  const success = document.getElementById('checkout-success');
  const formSection = document.getElementById('checkout-form-section');

  if (!step1 || !step2 || !success || !formSection) return;

  step1.classList.remove('hidden');
  step2.classList.add('hidden');
  success.classList.add('hidden');
  formSection.classList.remove('hidden');

  const total = cart.reduce((sum, c) => {
    const p = products.find(pr => pr.id === c.productId);
    return sum + (p ? p.price * c.qty : 0);
  }, 0);

  const subEl = document.getElementById('checkout-subtotal');
  const totEl = document.getElementById('checkout-total');
  if (subEl) subEl.textContent = total + ' ريال';
  if (totEl) totEl.textContent = total + ' ريال';
}

function goToStep2() {
  const fname = document.getElementById('fname')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const city = document.getElementById('city')?.value;

  if (!fname || !phone || !city) {
    showToast('يرجى تعبئة جميع الحقول المطلوبة', 'error');
    return;
  }

  document.getElementById('checkout-step1')?.classList.add('hidden');
  document.getElementById('checkout-step2')?.classList.remove('hidden');

  const step1 = document.getElementById('step1-indicator');
  const step2 = document.getElementById('step2-indicator');
  if (step1) step1.style.opacity = '0.4';
  if (step2) step2.style.opacity = '1';

  const step2Circle = step2?.querySelector('div');
  if (step2Circle) {
    step2Circle.style.background = 'var(--primary-action)';
    step2Circle.style.color = 'white';
    step2Circle.style.borderColor = 'var(--primary-action)';
  }
}

function goToStep1() {
  document.getElementById('checkout-step1')?.classList.remove('hidden');
  document.getElementById('checkout-step2')?.classList.add('hidden');

  const step1 = document.getElementById('step1-indicator');
  const step2 = document.getElementById('step2-indicator');
  if (step1) step1.style.opacity = '1';
  if (step2) step2.style.opacity = '0.4';
}

function placeOrder() {
  if (cart.length === 0) {
    showToast('سلتك فارغة', 'error');
    return;
  }

  const orderNum = 'FER-' + String(orders.length + 1).padStart(4, '0');
  const total = cart.reduce((sum, c) => {
    const p = products.find(pr => pr.id === c.productId);
    return sum + (p ? p.price * c.qty : 0);
  }, 0);

  orders.push({
    id: orderNum,
    items: [...cart],
    total,
    date: new Date().toLocaleDateString('ar-SA'),
    status: 'قيد التجهيز'
  });

  const orderEl = document.getElementById('order-number');
  if (orderEl) orderEl.textContent = '#' + orderNum;

  document.getElementById('checkout-form-section')?.classList.add('hidden');
  document.getElementById('checkout-success')?.classList.remove('hidden');

  cart = [];
  updateCartBadge();
  showToast('تم تأكيد الطلب بنجاح! 🎉');
}

document.addEventListener('change', (e) => {
  if (e.target && e.target.name === 'payment') {
    document.querySelectorAll('#payment-methods label').forEach(l => {
      l.style.borderColor = 'rgba(232,160,191,0.3)';
    });
    e.target.closest('label').style.borderColor = 'var(--primary-action)';
  }
});

// ==================== ACCOUNT ====================
function renderAccount() {
  const authForms = document.getElementById('auth-forms');
  const loggedBox = document.getElementById('account-logged');

  if (!authForms || !loggedBox) return;

  if (loggedInUser) {
    authForms.classList.add('hidden');
    loggedBox.classList.remove('hidden');

    const nameEl = document.getElementById('account-name');
    const emailEl = document.getElementById('account-email');

    if (nameEl) nameEl.textContent = 'مرحباً، ' + loggedInUser.name + ' 💕';
    if (emailEl) emailEl.textContent = loggedInUser.email;
  } else {
    authForms.classList.remove('hidden');
    loggedBox.classList.add('hidden');
  }
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  if (!loginForm || !registerForm || !tabLogin || !tabRegister) return;

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.style.background = 'var(--primary-action)';
    tabLogin.style.color = 'white';
    tabRegister.style.background = 'transparent';
    tabRegister.style.color = 'var(--text-color)';
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabRegister.style.background = 'var(--primary-action)';
    tabRegister.style.color = 'white';
    tabLogin.style.background = 'transparent';
    tabLogin.style.color = 'var(--text-color)';
  }
}

function handleLogin() {
  const email = document.getElementById('login-email')?.value.trim();
  if (!email) {
    showToast('يرجى إدخال البريد الإلكتروني', 'error');
    return;
  }
  loggedInUser = { name: 'عزيزتي', email };
  showToast('تم تسجيل الدخول بنجاح! 💕');
  renderAccount();
}

function handleRegister() {
  const name = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();

  if (!name || !email) {
    showToast('يرجى تعبئة جميع الحقول', 'error');
    return;
  }
  loggedInUser = { name, email };
  showToast('تم إنشاء حسابك بنجاح! 🎉');
  renderAccount();
}

function handleLogout() {
  loggedInUser = null;
  showToast('تم تسجيل الخروج');
  renderAccount();
}

// ==================== ORDERS ====================
function renderOrders() {
  const container = document.getElementById('orders-list');
  const emptyEl = document.getElementById('orders-empty');
  if (!container || !emptyEl) return;

  if (orders.length === 0) {
    container.innerHTML = '';
    emptyEl.classList.remove('hidden');
    return;
  }

  emptyEl.classList.add('hidden');
  container.innerHTML = '';

  orders.slice().reverse().forEach((order, idx) => {
    const el = document.createElement('div');
    el.className = 'p-5 rounded-2xl mb-4 anim-fade-up';
    el.style.cssText = `background: var(--surface-color); box-shadow: 0 4px 20px rgba(232,160,191,0.08); animation-delay: ${idx * 0.1}s;`;

    const statusColor = order.status === 'قيد التجهيز' ? '#F59E0B' : order.status === 'تم التوصيل' ? '#4CAF50' : 'var(--primary-action)';

    let itemsHtml = '';
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;
      itemsHtml += `
        <div class="flex items-center gap-3 mt-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: ${product.gradient};">
            <span class="text-lg">${product.emoji}</span>
          </div>
          <div class="flex-1">
            <span class="text-sm font-medium">${product.name}</span>
            <span class="text-xs opacity-50 mr-2">× ${item.qty}</span>
          </div>
          <span class="text-sm font-bold" style="color: var(--primary-action);">${product.price * item.qty} ريال</span>
        </div>
      `;
    });

    el.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="font-bold text-sm">${order.id}</span>
          <span class="text-xs opacity-50 mr-3">${order.date}</span>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-medium" style="background: ${statusColor}20; color: ${statusColor};">
          ${order.status}
        </span>
      </div>

      ${itemsHtml}

      <div class="border-t mt-4 pt-3 flex justify-between items-center" style="border-color: rgba(232,160,191,0.15);">
        <span class="text-sm opacity-60">الإجمالي:</span>
        <span class="font-display font-bold text-lg" style="color: var(--primary-action);">${order.total} ريال</span>
      </div>
    `;

    container.appendChild(el);
  });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  applyConfig(defaultConfig);
  renderFeaturedProducts();
  renderShopProducts('all');
  updateCartBadge();
  renderAccount();
});
