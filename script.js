'use strict';
/* =====================================================================
   HandMade Hub — frontend-only prototype (mock data, simulated flows)
   ===================================================================== */

/* ---------- helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Number(n).toLocaleString('en-US');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- mock data ---------- */
const SELLER = 'ورشة الأمل';

const CATS = [
  { id: 'embroidery',  icon: '🧶', label: 'تطريز',         voice: 'التطريز',          g: ['#f6d1c1', '#e9a58f'] },
  { id: 'candles',     icon: '🕯️', label: 'شموع',          voice: 'الشموع',           g: ['#fde7b0', '#f3b97a'] },
  { id: 'natural',     icon: '🧼', label: 'منتجات طبيعية', voice: 'المنتجات الطبيعية', g: ['#d6e8cc', '#9fc29a'] },
  { id: 'decor',       icon: '🎨', label: 'ديكور',         voice: 'الديكور',          g: ['#cfe0ea', '#9fbdd0'] },
  { id: 'accessories', icon: '💍', label: 'إكسسوارات',     voice: 'الإكسسوارات',      g: ['#ecd3e8', '#cfa0c8'] },
  { id: 'gifts',       icon: '🎁', label: 'هدايا',         voice: 'الهدايا',          g: ['#f7d0d4', '#ee9ba6'] },
];
const catOf = id => CATS.find(c => c.id === id) || CATS[0];

// P(id, name, owner, price, cat, emoji, rating, sales, stock, desc)
const P = (id, name, owner, price, cat, emoji, rating, sales, stock, desc) =>
  ({ id, name, owner, price, cat, emoji, rating, sales, stock, desc, img: null });

let products = [
  P(1,  'شمعة يدوية',            SELLER,          250, 'candles',     '🕯️', 4.9, 10, 18, 'شمعة صويا مصبوبة يدويًا برائحة دافئة تدوم طويلًا، في برطمان زجاجي أنيق يناسب أي ركن في البيت.'),
  P(2,  'شنطة هاند ميد',         SELLER,          450, 'embroidery',  '👜', 4.8, 9,  7,  'شنطة قماش مطرزة باليد بتفاصيل ملونة، متينة وخفيفة وتناسب الخروجات اليومية.'),
  P(3,  'إكسسوار يدوي',          SELLER,          180, 'accessories', '📿', 4.7, 7,  25, 'إكسسوار مصنوع من الخرز الملون بتصميم فريد، قطعة واحدة تضيف لمسة مميزة لإطلالتك.'),
  P(4,  'شمعة لافندر معطرة',     'نور للشموع',    220, 'candles',     '🪻', 4.8, 21, 30, 'رائحة لافندر هادئة تساعد على الاسترخاء، مصنوعة من شمع طبيعي وفتيل قطني.'),
  P(5,  'شمعة جيل البحر',        'نور للشموع',    195, 'candles',     '🐚', 4.6, 12, 14, 'شمعة جيل شفافة بتصميم الأصداف والرمل، ديكور صيفي منعش.'),
  P(6,  'شمعة القهوة',           'ركن الدفء',     175, 'candles',     '☕', 4.7, 16, 22, 'رائحة قهوة محمصة تملأ المكان بالدفء، في كوب خزفي يُعاد استخدامه.'),
  P(7,  'شمعة الورد',            'ركن الدفء',     260, 'candles',     '🌹', 4.9, 19, 9,  'شمعة بتلات ورد حقيقية مجففة، هدية رومانسية لا تُنسى.'),
  P(8,  'شمعة فانيليا مصبوبة',   SELLER,          210, 'candles',     '🍦', 4.5, 4,  3,  'شمعة فانيليا كريمية بملمس ناعم، مثالية لليالي الشتاء.'),
  P(19, 'شمعة الصندل',           'نور للشموع',    240, 'candles',     '🪵', 4.6, 8,  12, 'رائحة خشبية عميقة من الصندل، تضفي أجواء هادئة وفاخرة.'),
  P(20, 'شمعة الحمضيات',         'ركن الدفء',     185, 'candles',     '🍋', 4.4, 6,  0,  'انتعاش الليمون والبرتقال في شمعة صغيرة تنشّط الصباح.'),
  P(9,  'مفرش تطريز يدوي',       'إيدين مصر',     380, 'embroidery',  '🧵', 4.9, 14, 8,  'مفرش طاولة بتطريز فلاحي تقليدي بخيوط قطنية ملونة، يستغرق صنعه أيامًا.'),
  P(10, 'وسادة مطرزة',           'إيدين مصر',     320, 'embroidery',  '🪡', 4.7, 11, 15, 'وسادة بغطاء مطرز بنقوش زهور، تضيف دفئًا للكنبة أو السرير.'),
  P(11, 'صابون الزيتون الطبيعي', 'طبيعتي',         90, 'natural',     '🧼', 4.8, 40, 60, 'صابون بزيت الزيتون البكر بدون مواد حافظة، لطيف على البشرة الحساسة.'),
  P(12, 'كريم شيا طبيعي',        'طبيعتي',        140, 'natural',     '🌿', 4.6, 18, 20, 'زبدة الشيا مع زيوت طبيعية لترطيب عميق، مصنوع على دفعات صغيرة.'),
  P(13, 'مزهرية خزف ملونة',      'لمسة فن',       520, 'decor',       '🏺', 4.8, 6,  5,  'مزهرية خزف مرسومة يدويًا بألوان دافئة، قطعة ديكور تتحدث عن نفسها.'),
  P(14, 'إطار مرآة مزخرف',       'لمسة فن',       410, 'decor',       '🪞', 4.5, 5,  6,  'مرآة بإطار خشبي منقوش يدويًا، تناسب المدخل أو غرفة النوم.'),
  P(15, 'سلسلة خرز ملونة',       SELLER,          150, 'accessories', '📿', 4.6, 3,  17, 'سلسلة خرز مشغولة بدقة بألوان مبهجة، تناسب الصيف.'),
  P(16, 'أقراط فضة يدوية',       'ورشة نجمة',     230, 'accessories', '💍', 4.9, 15, 11, 'أقراط من الفضة بتصميم هلال ونجمة، خفيفة ومريحة.'),
  P(17, 'بوكس هدية متكامل',      'هدايا بحب',     600, 'gifts',       '🎁', 4.9, 22, 10, 'بوكس هدية يضم شمعة وصابون وكارت مكتوب بخط اليد، جاهز للإهداء.'),
  P(18, 'كروت مرسومة بخط اليد',  'هدايا بحب',      60, 'gifts',       '💌', 4.7, 30, 80, 'مجموعة كروت معايدة مرسومة بالألوان المائية بعبارات دافئة.'),
];
let nextId = 100;

const LESSON_TITLES = ['مقدمة', 'الأدوات والخامات', 'صناعة المنتج', 'تصوير المنتج', 'التسويق', 'التسعير والبيع'];
const LESSON_MIN    = [4, 8, 12, 7, 9, 6];

const courses = [
  { id: 'c1', icon: '🧶', title: 'صناعة المنتجات اليدوية', desc: 'تعلم أساسيات صناعة المنتجات اليدوية.', long: 'كورس عملي بيبدأ معاك من الصفر: هتتعرف على الخامات والأدوات، وتصنع أول منتج بإيدك خطوة بخطوة، وتجهزه للعرض والبيع.', instructor: 'أ. منى عبد الله', color: '#fde9c7', done: [0, 1] },
  { id: 'c2', icon: '📱', title: 'التسويق على السوشيال ميديا', desc: 'كيف تعرض منتجك وتصل للعملاء.', long: 'اعرف إزاي تبني صفحة لمتجرك، تكتب محتوى بيجذب الناس، وتتعامل مع الطلبات والتعليقات وتحوّل المتابعين لعملاء.', instructor: 'أ. كريم السيد', color: '#d6e8f2', done: [] },
  { id: 'c3', icon: '📸', title: 'تصوير المنتجات', desc: 'تصوير منتجاتك بطريقة احترافية.', long: 'بالموبايل بس! هتتعلم الإضاءة والخلفيات وزوايا التصوير اللي بتخلي منتجك يبان أجمل ويتباع أسرع.', instructor: 'أ. ياسمين فؤاد', color: '#f6d5cb', done: [0] },
  { id: 'c4', icon: '💰', title: 'تسعير المنتجات', desc: 'كيف تحدد سعر منتجك وتحسب التكلفة والربح.', long: 'احسب تكلفة الخامات والوقت والمصاريف، وحدّد سعر عادل بيحقق لك ربح ويرضي العميل.', instructor: 'أ. هشام رمزي', color: '#d9e8d4', done: [] },
].map(c => ({ ...c, done: new Set(c.done) }));
const courseById = id => courses.find(c => c.id === id);
const courseProgress = c => Math.round(c.done.size / LESSON_TITLES.length * 100);

const SALES = [
  { n: '#1042', p: 'شمعة يدوية', q: 2, t: 500, d: 'اليوم' },
  { n: '#1041', p: 'شنطة هاند ميد', q: 1, t: 450, d: 'اليوم' },
  { n: '#1037', p: 'إكسسوار يدوي', q: 3, t: 540, d: 'أمس' },
  { n: '#1033', p: 'شمعة فانيليا مصبوبة', q: 1, t: 210, d: 'أمس' },
  { n: '#1029', p: 'سلسلة خرز ملونة', q: 2, t: 300, d: 'منذ 3 أيام' },
];
const WEEK = [['س', 3], ['ح', 5], ['ن', 4], ['ث', 7], ['ر', 6], ['خ', 9], ['ج', 8]];

/* ---------- state ---------- */
const state = {
  role: null,            // null | 'buyer' | 'seller'
  view: 'home', arg: undefined,
  cat: 'all', q: '',
  cart: [],              // [{id, qty}]
  favs: new Set(),
  ar: { id: 1, on: false, x: 50, y: 62, s: 1 },
  lesson: 0,
  editing: null, draftImg: null,
  statDelta: 0,          // product-count delta for dashboard mock stat
  after: null,           // action to run after login
  orderDone: false,
  speak: false,
};
const getP = id => products.find(p => p.id === id);

/* ---------- small UI helpers ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function imgBox(p, cls = 'pimg') {
  const g = catOf(p.cat).g;
  const inner = p.img ? `<img src="${p.img}" alt="${esc(p.name)}">` : `<span class="emoji">${p.emoji}</span>`;
  return { cls, style: `--g1:${g[0]};--g2:${g[1]}`, inner };
}

function productCard(p) {
  const b = imgBox(p), c = catOf(p.cat), fav = state.favs.has(p.id);
  return `<article class="card product-card">
    <div class="${b.cls}" style="${b.style}" data-act="view" data-id="${p.id}" role="button" tabindex="0">
      ${b.inner}<span class="tag">${c.icon} ${c.label}</span>
    </div>
    <div class="pbody">
      <h3>${esc(p.name)}</h3>
      <p class="owner">🧑‍🎨 ${esc(p.owner)}</p>
      <div class="prow"><span class="price">${fmt(p.price)} جنيه</span><span class="rate">${p.rating ? '⭐ ' + p.rating : '⭐ جديد'}</span></div>
      <div class="btns">
        <button class="btn btn-primary btn-sm" data-act="view" data-id="${p.id}">عرض المنتج</button>
        <button class="btn btn-ghost btn-sm ${fav ? 'on' : ''}" data-act="fav" data-id="${p.id}" aria-pressed="${fav}">❤️ المفضلة</button>
      </div>
    </div>
  </article>`;
}

function statusOf(p) {
  if (p.stock <= 0) return ['نفد', 'st-out'];
  if (p.stock <= 5) return ['كمية قليلة', 'st-low'];
  return ['متاح', 'st-ok'];
}

/* =====================================================================
   NAVIGATION / ACCESS CONTROL
   ===================================================================== */
const NEED = { cart: 'buyer', favs: 'buyer', dashboard: 'seller', add: 'seller' };

function go(view, arg, opts = {}) {
  const need = NEED[view];
  if (need && state.role !== need) {
    openAuth(need, () => go(view, arg, opts));
    return false;
  }
  if (view === 'ar' && state.role === 'seller') {
    toast('تجربة AR متاحة للمشترين 🛍️ — بدّل الحساب لتجربتها');
    return false;
  }
  stopVideo();
  state.view = view; state.arg = arg;
  render(view, arg, opts);
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  closeMenu();
  renderHeader();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return true;
}

function render(view, arg, opts = {}) {
  ({
    home: renderHome, products: () => renderProducts(arg), product: () => renderProduct(arg),
    ar: () => renderAR(arg), courses: () => renderCourses(arg), course: () => renderCourse(arg),
    dashboard: renderDashboard, add: () => renderAdd(arg), cart: renderCart, favs: renderFavs,
  }[view] || renderHome)();
}
const refresh = () => { render(state.view, state.arg); renderHeader(); };

/* ---------- header ---------- */
function renderHeader() {
  const v = state.view, r = state.role;
  const link = (view, label) =>
    `<button class="nav-link ${v === view || (view === 'products' && v === 'product') || (view === 'courses' && v === 'course') ? 'active' : ''}" data-act="nav" data-view="${view}">${label}</button>`;
  let nav = link('home', '🏠 الرئيسية') + link('products', '🛍️ المنتجات') + link('courses', '📚 الكورسات');
  if (r !== 'seller') nav += link('ar', '✨ AR');
  if (r === 'seller') nav += link('dashboard', '📊 لوحة المتجر') + link('add', '➕ إضافة منتج');
  nav += `<button class="nav-link" data-act="voice">🎤 المساعد الصوتي</button>`;
  $('#mainNav').innerHTML = nav;

  let act = '';
  if (r === 'buyer') {
    act += `<button class="icon-btn cnt-btn" data-act="nav" data-view="favs" aria-label="المفضلة">❤️${state.favs.size ? `<span class="cnt">${state.favs.size}</span>` : ''}</button>`;
    act += `<button class="icon-btn cnt-btn" data-act="nav" data-view="cart" aria-label="السلة">🛒${cartCount() ? `<span class="cnt">${cartCount()}</span>` : ''}</button>`;
  }
  if (r) {
    act += `<span class="role-pill">${r === 'buyer' ? '🛍️ مشتري' : '🧑‍🎨 صاحب منتج'}</span>
            <button class="btn btn-ghost btn-sm" data-act="logout">خروج</button>`;
  } else {
    act += `<button class="btn btn-outline btn-sm" data-act="openauth" data-mode="login">تسجيل الدخول</button>
            <button class="btn btn-primary btn-sm" data-act="openauth" data-mode="signup">إنشاء حساب</button>`;
  }
  $('#headerActions').innerHTML = act;
}
function closeMenu() { $('#mainNav').classList.remove('open'); $('#headerActions').classList.remove('open'); }

/* ---------- auth ---------- */
function openAuth(need, after, mode = 'login') {
  state.after = after || null;
  $('#authTitle').textContent = mode === 'signup' ? 'إنشاء حساب' : 'تسجيل الدخول';
  const cur = state.role;
  $('#authHint').textContent = need
    ? (need === 'seller' ? 'هذه الصفحة لأصحاب المنتجات 🧑‍🎨 — ادخل كصاحب منتج للمتابعة.' : 'هذه الميزة للمشترين 🛍️ — ادخل كمشتري للمتابعة.')
    : 'اختار نوع الحساب للدخول (محاكاة بدون تسجيل حقيقي).';
  if (cur && !need) $('#authHint').textContent = 'اختار الحساب اللي تريد التبديل إليه.';
  $('#authModal').hidden = false;
}
function closeAuth() { $('#authModal').hidden = true; state.after = null; }
function login(role) {
  const fn = state.after;
  state.role = role; state.after = null;
  $('#authModal').hidden = true;
  state.orderDone = false;
  toast(role === 'buyer' ? '👋 أهلًا بك كمشتري!' : '👋 أهلًا بك يا صاحب المتجر!');
  if (fn) { fn(); renderHeader(); }
  else if (role === 'seller') go('dashboard');
  else if (['dashboard', 'add'].includes(state.view)) go('home');
  else refresh();
}
function logout() {
  state.role = null; state.orderDone = false;
  toast('تم تسجيل الخروج');
  if (['dashboard', 'add', 'cart', 'favs'].includes(state.view)) go('home'); else { refresh(); }
}

/* =====================================================================
   HOME
   ===================================================================== */
function renderHome() {
  $('#heroCards').innerHTML = [1, 2, 3].map(id => {
    const p = getP(id); if (!p) return '';
    const b = imgBox(p);
    return `<div class="hcard" data-act="view" data-id="${id}" role="button" tabindex="0">
      <div class="${b.cls}" style="${b.style}">${b.inner}</div>
      <h4>${esc(p.name)}</h4><span class="p">${fmt(p.price)} جنيه</span></div>`;
  }).join('');
  $('#homeCats').innerHTML = CATS.map(c =>
    `<button class="cat-tile" data-act="cat" data-cat="${c.id}"><span>${c.icon}</span>${c.label}</button>`).join('');
  const top = [...products].filter(p => p.rating).sort((a, b) => b.rating - a.rating || b.sales - a.sales).slice(0, 4);
  $('#homeFeatured').innerHTML = top.map(productCard).join('');
}

/* =====================================================================
   PRODUCTS
   ===================================================================== */
function renderProducts(arg) {
  if (arg && typeof arg === 'object') {
    if (arg.cat !== undefined) state.cat = arg.cat;
    if (arg.q !== undefined) state.q = arg.q;
  }
  $('#searchBox').value = state.q;
  $('#catChips').innerHTML =
    `<button class="chip ${state.cat === 'all' ? 'active' : ''}" data-act="cat" data-cat="all">🛍️ الكل</button>` +
    CATS.map(c => `<button class="chip ${state.cat === c.id ? 'active' : ''}" data-act="cat" data-cat="${c.id}">${c.icon} ${c.label}</button>`).join('');
  drawProductGrid();
}
function filtered() {
  const q = state.q.trim().toLowerCase();
  return products.filter(p => (state.cat === 'all' || p.cat === state.cat) &&
    (!q || p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q)));
}
function drawProductGrid() {
  const list = filtered();
  $('#resultCount').textContent = `${list.length} منتج`;
  $('#productGrid').innerHTML = list.length ? list.map(productCard).join('')
    : `<div class="empty"><div class="big">🔍</div><p>مفيش منتجات مطابقة... جرّب تصنيف تاني.</p></div>`;
}

/* ---------- product details ---------- */
function renderProduct(id) {
  const p = getP(id);
  if (!p) return go('products');
  const b = imgBox(p), c = catOf(p.cat), fav = state.favs.has(p.id);
  const related = products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  $('#productDetail').innerHTML = `
    <div class="crumbs"><button data-act="nav" data-view="products">المنتجات</button> › ${c.label} › ${esc(p.name)}</div>
    <div class="detail">
      <div class="${b.cls}" style="${b.style}">${b.inner}</div>
      <div>
        <h1>${esc(p.name)}</h1>
        <div class="dprice">${fmt(p.price)} جنيه</div>
        <div class="stars">${p.rating ? '⭐'.repeat(Math.round(p.rating)) + ' ' + p.rating : '⭐ منتج جديد'} <small style="color:var(--ink-2)">· ${p.sales} عملية بيع</small></div>
        <div class="badges"><span class="badge">🤲 صنع يدويًا</span><span class="badge b2">📍 منتج محلي</span></div>
        <p class="desc">${esc(p.desc || 'منتج يدوي مميز.')}</p>
        <div class="seller-box"><div class="avatar">🧑‍🎨</div><div><small>صاحب المنتج</small><b>${esc(p.owner)}</b></div></div>
        <p class="owner" style="margin-bottom:12px">${p.stock > 0 ? `✅ متوفر (${p.stock} قطعة)` : '❌ غير متوفر حاليًا'}</p>
        <div class="dbtns">
          <button class="btn btn-primary btn-lg" data-act="addcart" data-id="${p.id}" ${p.stock <= 0 ? 'disabled style="opacity:.5"' : ''}>🛒 إضافة للسلة</button>
          <button class="btn btn-ghost btn-lg ${fav ? 'on' : ''}" data-act="fav" data-id="${p.id}">❤️ ${fav ? 'في المفضلة' : 'إضافة للمفضلة'}</button>
          <button class="btn btn-sage btn-lg" data-act="ar" data-id="${p.id}">✨ جرّب AR</button>
        </div>
      </div>
    </div>
    ${related.length ? `<h2 class="related-title">منتجات مشابهة</h2><div class="grid" style="margin-bottom:40px">${related.map(productCard).join('')}</div>` : ''}`;
}

/* ---------- favorites ---------- */
function renderFavs() {
  const list = products.filter(p => state.favs.has(p.id));
  $('#favGrid').innerHTML = list.length ? list.map(productCard).join('')
    : `<div class="empty"><div class="big">💔</div><p>لسه مفيش منتجات في المفضلة.</p><br><button class="btn btn-primary" data-act="nav" data-view="products">استكشف المنتجات</button></div>`;
}

/* ---------- cart ---------- */
const cartCount = () => state.cart.reduce((s, i) => s + i.qty, 0);
const cartTotal = () => state.cart.reduce((s, i) => s + (getP(i.id)?.price || 0) * i.qty, 0);

function renderCart() {
  const w = $('#cartWrap');
  if (state.orderDone) {
    w.innerHTML = `<div class="page-head"><h1>🛒 السلة</h1></div>
      <div class="success"><div style="font-size:3rem">🎉</div>✓ تم إنشاء الطلب بنجاح
      <small style="font-weight:600">شكرًا لدعمك للصنّاع المحليين (طلب تجريبي)</small>
      <div class="btns"><button class="btn btn-primary" data-act="nav" data-view="products">كمّل تسوق</button>
      <button class="btn btn-ghost" data-act="nav" data-view="courses">📚 تعلّم صنعة</button></div></div>`;
    return;
  }
  if (!state.cart.length) {
    w.innerHTML = `<div class="page-head"><h1>🛒 السلة</h1></div>
      <div class="empty"><div class="big">🧺</div><p>سلتك فاضية.</p><br><button class="btn btn-primary" data-act="nav" data-view="products">ابدأ التسوق</button></div>`;
    return;
  }
  w.innerHTML = `<div class="page-head"><h1>🛒 السلة</h1></div>
    <div class="panel">
      ${state.cart.map(i => {
        const p = getP(i.id), b = imgBox(p);
        return `<div class="cart-item">
          <div class="thumb" style="${b.style}">${b.inner}</div>
          <div><b>${esc(p.name)}</b><div class="owner">🧑‍🎨 ${esc(p.owner)}</div></div>
          <div class="line">
            <div class="qty"><button data-act="qty" data-id="${p.id}" data-d="-1" aria-label="أقل">−</button><b>${i.qty}</b><button data-act="qty" data-id="${p.id}" data-d="1" aria-label="أكثر">+</button></div>
            <span>${fmt(p.price)} جنيه × ${i.qty}</span>
            <b class="price">${fmt(p.price * i.qty)} جنيه</b>
            <button class="btn btn-danger btn-sm" data-act="rm" data-id="${p.id}">🗑️</button>
          </div></div>`;
      }).join('')}
      <div class="total-box"><span>الإجمالي</span><span>${fmt(cartTotal())} جنيه</span></div>
    </div>
    <button class="btn btn-primary btn-lg btn-block" data-act="checkout">إتمام الطلب</button>
    <p class="owner" style="text-align:center;margin-top:8px">محاكاة فقط — لا يوجد دفع حقيقي.</p>`;
}

function addToCart(id) {
  const run = () => {
    const p = getP(id); if (!p || p.stock <= 0) return toast('المنتج غير متوفر');
    const it = state.cart.find(i => i.id === id);
    it ? it.qty++ : state.cart.push({ id, qty: 1 });
    state.orderDone = false;
    toast('🛒 تمت الإضافة للسلة'); renderHeader();
  };
  requireBuyer(run);
}
function toggleFav(id) {
  requireBuyer(() => {
    state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
    toast(state.favs.has(id) ? '❤️ أضفناه للمفضلة' : 'تمت الإزالة من المفضلة');
    refresh();
  });
}
function requireBuyer(fn) {
  if (state.role === 'buyer') return fn();
  openAuth('buyer', fn);
}

/* =====================================================================
   AR SIMULATION
   ===================================================================== */
function renderAR(id) {
  if (id) { state.ar.id = id; state.ar.on = false; state.ar.x = 50; state.ar.y = 62; state.ar.s = 1; }
  const a = state.ar, p = getP(a.id) || products[0];
  $('#arWrap').innerHTML = `
    <div class="ar-top"><h1>✨ جرّب المنتج في مكانك</h1>
      <p class="owner">شوف شكل المنتج في بيتك قبل ما تشتريه.</p></div>
    <div class="ar-layout">
      <div class="stage" id="stage">
        <div class="scene"><div class="window"></div><div class="shelf"></div><span class="plant">🪴</span></div>
        <i class="vf a"></i><i class="vf b"></i><i class="vf c"></i><i class="vf d"></i>
        <span class="rec">مباشر</span>
        ${a.on ? `<div class="ar-item" id="arItem">${itemInner(p)}</div>` : `
        <div class="ar-hint"><div class="big">📷</div>
          <p>ضع الكاميرا أمام المكان الذي تريد رؤية المنتج فيه.</p>
          <button class="btn btn-primary btn-lg" data-act="arstart">تشغيل AR</button></div>`}
        <span class="ar-badge">تجربة AR تجريبية</span>
      </div>
      <div class="ar-panel">
        <div class="field"><label for="arSel">المنتج</label>
          <select id="arSel" class="input">${products.map(x => `<option value="${x.id}" ${x.id === p.id ? 'selected' : ''}>${x.emoji} ${esc(x.name)}</option>`).join('')}</select></div>
        <div class="scale-read" id="scaleRead">الحجم: ${Math.round(a.s * 100)}%</div>
        <div class="ar-ctrls">
          <button class="btn btn-ghost" data-act="zoom" data-d="0.15" ${a.on ? '' : 'disabled'}>➕ تكبير</button>
          <button class="btn btn-ghost" data-act="zoom" data-d="-0.15" ${a.on ? '' : 'disabled'}>➖ تصغير</button>
          <button class="btn btn-ghost full" data-act="arreset" ${a.on ? '' : 'disabled'}>↺ إعادة الوضع</button>
          <button class="btn btn-primary full" data-act="addcart" data-id="${p.id}">🛒 إضافة للسلة</button>
          <button class="btn btn-outline full" data-act="view" data-id="${p.id}">عرض المنتج</button>
        </div>
        <div class="ar-note">☝️ اسحب المنتج لتحريكه، أو استخدم الأزرار / عجلة الماوس للتكبير والتصغير. هذه محاكاة بصرية فقط بدون تتبع حقيقي.</div>
      </div>
    </div>`;
  $('#arSel').addEventListener('change', e => { state.ar.id = +e.target.value; renderAR(); });
  if (a.on) { applyAR(); bindARDrag(); }
}
const itemInner = p => `<div class="bob">${p.img ? `<img src="${p.img}" alt="">` : `<span class="emoji">${p.emoji}</span>`}</div>`;
function applyAR() {
  const el = $('#arItem'); if (!el) return;
  const a = state.ar;
  el.style.left = a.x + '%'; el.style.top = a.y + '%';
  el.style.transform = `translate(-50%,-50%) scale(${a.s})`;
  const r = $('#scaleRead'); if (r) r.textContent = `الحجم: ${Math.round(a.s * 100)}%`;
}
function bindARDrag() {
  const el = $('#arItem'), stage = $('#stage'); let d = null;
  el.addEventListener('pointerdown', e => {
    d = { sx: e.clientX, sy: e.clientY, ox: state.ar.x, oy: state.ar.y };
    el.setPointerCapture(e.pointerId); el.style.transition = 'none'; e.preventDefault();
  });
  el.addEventListener('pointermove', e => {
    if (!d) return;
    const r = stage.getBoundingClientRect();
    state.ar.x = clamp(d.ox + (e.clientX - d.sx) / r.width * 100, 6, 94);
    state.ar.y = clamp(d.oy + (e.clientY - d.sy) / r.height * 100, 10, 92);
    applyAR();
  });
  const end = () => { d = null; el.style.transition = ''; };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  stage.addEventListener('wheel', e => { e.preventDefault(); zoomAR(e.deltaY < 0 ? .08 : -.08); }, { passive: false });
}
function zoomAR(d) { state.ar.s = clamp(+(state.ar.s + d).toFixed(2), .4, 2.6); applyAR(); }

/* =====================================================================
   COURSES
   ===================================================================== */
function renderCourses(highlight) {
  $('#courseGrid').innerHTML = courses.map(c => {
    const pr = courseProgress(c);
    return `<article class="card course-card ${highlight === c.id ? 'pulse' : ''}" id="card-${c.id}">
      <div class="course-ico" style="--c:${c.color}">${c.icon}</div>
      <h3>${c.title}</h3><p>${c.desc}</p>
      <div class="meta"><span>👩‍🏫 ${c.instructor}</span><span>📖 ${LESSON_TITLES.length} دروس</span></div>
      <div class="progress" aria-label="التقدم"><i style="width:${pr}%"></i></div>
      <div class="pct">التقدم: ${pr}%</div>
      <button class="btn btn-primary" data-act="course" data-id="${c.id}">${pr ? 'كمّل الكورس' : 'ابدأ الكورس'}</button>
    </article>`;
  }).join('');
  if (highlight) setTimeout(() => $('#card-' + highlight)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
}

let video = { timer: null, pct: 0, playing: false };
function stopVideo() { clearInterval(video.timer); video = { timer: null, pct: 0, playing: false }; }

function renderCourse(id) {
  const c = courseById(id); if (!c) return go('courses');
  const pr = courseProgress(c), L = state.lesson;
  $('#courseDetail').innerHTML = `
    <div class="crumbs"><button data-act="nav" data-view="courses">الكورسات</button> › ${c.title}</div>
    <div class="course-hero" style="--c:${c.color}">
      <div class="course-ico">${c.icon}</div>
      <div><h1>${c.title}</h1><div class="meta" style="gap:14px;justify-content:flex-start"><span>👩‍🏫 ${c.instructor}</span><span>📖 ${LESSON_TITLES.length} دروس</span><span>✅ ${pr}%</span></div></div>
    </div>
    <div class="course-layout">
      <div>
        <div class="player" id="player">
          <div class="screen"><div><div class="emoji">${c.icon}</div><h4>الدرس ${L + 1}: ${LESSON_TITLES[L]}</h4></div>
            <button class="play" data-act="play" aria-label="تشغيل">▶</button></div>
          <div class="vbar"><div class="vtrack"><i id="vfill"></i></div>
            <div class="vmeta"><span id="vtime">0:00 / ${LESSON_MIN[L]}:00</span><span>فيديو تجريبي</span></div></div>
        </div>
        <p class="cdesc">${c.long}</p>
        <button class="btn btn-primary btn-lg" data-act="startlesson">▶ ابدأ الدرس</button>
      </div>
      <aside class="lessons"><h3>محتوى الكورس</h3>
        ${LESSON_TITLES.map((t, i) => `<button class="lesson ${i === L ? 'active' : ''} ${c.done.has(i) ? 'done' : ''}" data-act="lesson" data-i="${i}">
          <span class="n">${c.done.has(i) ? '✓' : i + 1}</span><span class="t">${t}</span><small>${LESSON_MIN[i]} د</small></button>`).join('')}
      </aside>
    </div>`;
}
function togglePlay() {
  const player = $('#player'); if (!player) return;
  const c = courseById(state.arg);
  if (video.playing) { clearInterval(video.timer); video.playing = false; player.classList.remove('playing'); return; }
  if (video.pct >= 100) video.pct = 0;
  video.playing = true; player.classList.add('playing');
  const mins = LESSON_MIN[state.lesson];
  video.timer = setInterval(() => {
    video.pct = Math.min(100, video.pct + 1.6);   // ~8 seconds for a whole "lesson"
    $('#vfill').style.width = video.pct + '%';
    const s = Math.round(video.pct / 100 * mins * 60);
    $('#vtime').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} / ${mins}:00`;
    if (video.pct >= 100) {
      clearInterval(video.timer); video.playing = false; player.classList.remove('playing');
      const newly = !c.done.has(state.lesson); c.done.add(state.lesson);
      toast(newly ? '✓ تم إكمال الدرس! 🎉' : 'انتهى الدرس');
      if (newly) setTimeout(() => { if (state.view === 'course') { const keep = state.lesson; renderCourse(state.arg); state.lesson = keep; } }, 900);
    }
  }, 130);
}

/* =====================================================================
   SELLER DASHBOARD
   ===================================================================== */
function renderDashboard() {
  const mine = products.filter(p => p.owner === SELLER);
  const sold = mine.reduce((s, p) => s + p.sales, 0);
  const max = Math.max(...WEEK.map(w => w[1]));
  $('#dashWrap').innerHTML = `
    <div class="dash-head"><h1>لوحة صاحب المتجر</h1>
      <button class="btn btn-primary" data-act="addnew">➕ إضافة منتج</button></div>
    <div class="stats">
      <div class="stat" data-ico="📦"><small>المنتجات</small><b>${12 + state.statDelta}</b></div>
      <div class="stat" data-ico="🧾"><small>المبيعات</small><b>34</b></div>
      <div class="stat" data-ico="💰"><small>إجمالي الأرباح</small><b>8,450 جنيه</b></div>
      <div class="stat" data-ico="⭐"><small>التقييم</small><b>4.8 ⭐</b></div>
    </div>
    <div class="panel"><div class="panel-head"><h2>📦 منتجاتي (${mine.length})</h2></div>
      ${mine.length ? mine.map(p => {
        const b = imgBox(p), [st, cls] = statusOf(p);
        return `<div class="trow">
          <div class="thumb" style="${b.style}">${b.inner}</div>
          <div class="info"><b>${esc(p.name)}</b><small>${fmt(p.price)} جنيه</small></div>
          <div class="facts"><span>🧾 ${p.sales} مبيعات</span><span><span class="status ${cls}">${st}</span></span></div>
          <div class="acts"><button class="btn btn-ghost btn-sm" data-act="edit" data-id="${p.id}">✏️ تعديل</button>
            <button class="btn btn-danger btn-sm" data-act="del" data-id="${p.id}">🗑️ حذف</button></div>
        </div>`;
      }).join('') : `<div class="empty"><p>لسه ما نشرتش منتجات.</p></div>`}
    </div>
    <div class="panel"><h2>📈 المبيعات هذا الأسبوع</h2>
      <div class="bars">${WEEK.map(([d, v]) => `<div><span>${v}</span><i style="height:${v / max * 100}%"></i>${d}</div>`).join('')}</div></div>
    <div class="panel"><h2>🧾 آخر الطلبات</h2>
      ${SALES.map(s => `<div class="sale-row"><div><b style="color:var(--ink)">${s.p}</b> × ${s.q}<small>${s.n} · ${s.d}</small></div><b>${fmt(s.t)} جنيه</b></div>`).join('')}
    </div>
    <p class="owner" style="text-align:center;margin-bottom:30px">أرقام تجريبية لأغراض العرض فقط.</p>`;
}

/* ---------- add / edit product ---------- */
function renderAdd(editId) {
  state.editing = editId || null; state.draftImg = null;
  const p = editId ? getP(editId) : null;
  if (p) state.draftImg = p.img;
  $('#addWrap').innerHTML = `
    <div class="page-head"><h1>${p ? '✏️ تعديل المنتج' : '➕ إضافة منتج'}</h1><p>املأ البيانات وانشر منتجك في السوق.</p></div>
    <form class="panel form" id="addForm" novalidate>
      <div class="field"><label for="fName">اسم المنتج</label><input id="fName" class="input" required value="${esc(p?.name || '')}" placeholder="مثال: شمعة لافندر"></div>
      <div class="row2">
        <div class="field"><label for="fPrice">السعر (جنيه)</label><input id="fPrice" type="number" min="1" class="input" required value="${p?.price ?? ''}" placeholder="250"></div>
        <div class="field"><label for="fStock">الكمية المتاحة</label><input id="fStock" type="number" min="0" class="input" value="${p?.stock ?? 10}"></div>
      </div>
      <div class="field"><label for="fCat">التصنيف</label>
        <select id="fCat" class="input">${CATS.map(c => `<option value="${c.id}" ${p?.cat === c.id ? 'selected' : ''}>${c.icon} ${c.label}</option>`).join('')}</select></div>
      <div class="field"><label for="fDesc">الوصف</label><textarea id="fDesc" class="input" placeholder="احكي عن منتجك وخاماته...">${esc(p?.desc || '')}</textarea></div>
      <div class="field"><label>رفع صورة المنتج</label>
        <label class="upload"><input type="file" id="fImg" accept="image/*">
          <span class="preview" id="fPrev">${state.draftImg ? `<img src="${state.draftImg}" alt="">` : '📷'}</span>
          <span class="t">اضغط لاختيار صورة</span></label></div>
      <button class="btn btn-primary btn-lg" type="submit">${p ? 'حفظ التعديلات' : 'نشر المنتج'}</button>
      <div id="addMsg"></div>
    </form>`;
  $('#fImg').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { state.draftImg = rd.result; $('#fPrev').innerHTML = `<img src="${rd.result}" alt="">`; };
    rd.readAsDataURL(f);
  });
  $('#addForm').addEventListener('submit', submitProduct);
}
function submitProduct(e) {
  e.preventDefault();
  const name = $('#fName').value.trim(), price = +$('#fPrice').value;
  if (!name || !(price > 0)) return toast('من فضلك اكتب اسم المنتج وسعره');
  const data = {
    name, price, cat: $('#fCat').value, stock: Math.max(0, +$('#fStock').value || 0),
    desc: $('#fDesc').value.trim() || 'منتج يدوي مميز.', img: state.draftImg,
  };
  const edit = state.editing && getP(state.editing);
  if (edit) Object.assign(edit, data);
  else { products.unshift({ id: nextId++, owner: SELLER, rating: null, sales: 0, emoji: catOf(data.cat).icon, ...data }); state.statDelta++; }
  $('#addMsg').innerHTML = `<div class="success">${edit ? '✓ تم حفظ التعديلات' : '✓ تم نشر المنتج بنجاح'}
    <div class="btns"><button type="button" class="btn btn-primary" data-act="nav" data-view="products">🛍️ شوفه في السوق</button>
    <button type="button" class="btn btn-ghost" data-act="nav" data-view="dashboard">📊 لوحة المتجر</button></div></div>`;
  toast(edit ? '✓ تم حفظ التعديلات' : '✓ تم نشر المنتج بنجاح');
  if (!edit) { $('#addForm').reset(); state.draftImg = null; $('#fPrev').textContent = '📷'; }
  $('#addMsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function deleteProduct(id) {
  const p = getP(id); if (!p) return;
  if (!confirm(`حذف "${p.name}"؟`)) return;
  products = products.filter(x => x.id !== id);
  state.cart = state.cart.filter(i => i.id !== id); state.favs.delete(id);
  state.statDelta--; toast('🗑️ تم حذف المنتج'); refresh();
}

/* =====================================================================
   VOICE ASSISTANT (simulated)
   ===================================================================== */
const EXAMPLES = ['دورلي على شموع', 'عايز كورس تسويق', 'افتح المنتجات', 'وريني الإكسسوارات', 'افتح لوحة المتجر'];
let voiceInit = false, exIdx = 0, busy = false;

function toggleVoice(force) {
  const panel = $('#vpanel');
  const open = force ?? panel.hidden;
  panel.hidden = !open;
  closeMenu();
  if (open && !voiceInit) {
    voiceInit = true;
    $('#vchips').innerHTML = EXAMPLES.map(t => `<button type="button" data-act="cmd" data-t="${t}">🎤 "${t}"</button>`).join('');
    say('أهلًا بك! كيف يمكنني مساعدتك؟');
  }
  if (open) setTimeout(() => $('#vinput').focus({ preventScroll: true }), 50);
}
function bubble(text, who, cls = '') {
  const log = $('#vlog'), b = document.createElement('div');
  b.className = `bubble ${who} ${cls}`; b.textContent = text;
  log.appendChild(b); log.scrollTop = log.scrollHeight; return b;
}
function say(text) {
  bubble(text, 'bot');
  if (state.speak && 'speechSynthesis' in window) {
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'ar'; speechSynthesis.speak(u); } catch (_) {}
  }
}
async function runCommand(text) {
  text = text.trim(); if (!text || busy) return;
  busy = true;
  bubble(text, 'me');
  const t = bubble('...', 'bot', 'typing');
  await sleep(550);
  t.remove();
  const reply = handleCommand(text);
  say(reply);
  busy = false;
}
const norm = s => s.toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');

function handleCommand(raw) {
  const t = norm(raw);
  const has = re => re.test(t);

  if (has(/لوحه|متجر|داشبورد|dashboard/)) {
    if (state.role === 'seller') { go('dashboard'); return 'تمام، فتحت لك لوحة صاحب المتجر.'; }
    openAuth('seller', () => go('dashboard'));
    return 'لوحة المتجر لأصحاب المنتجات. ادخل كصاحب منتج وأفتحها لك فورًا.';
  }
  if (has(/سله|عربه|اطلب|اتمام/)) {
    if (state.role === 'buyer') { go('cart'); return `دي سلتك، فيها ${cartCount()} قطعة.`; }
    if (state.role === 'seller') return 'السلة متاحة للمشترين فقط. بدّل الحساب لو عايز تشتري.';
    openAuth('buyer', () => go('cart')); return 'سجّل دخولك كمشتري الأول وأفتح لك السلة.';
  }
  if (has(/مفضل/)) {
    if (state.role === 'buyer') { go('favs'); return `عندك ${state.favs.size} منتج في المفضلة.`; }
    if (state.role === 'seller') return 'المفضلة متاحة للمشترين فقط.';
    openAuth('buyer', () => go('favs')); return 'سجّل دخولك كمشتري الأول وأفتح لك المفضلة.';
  }
  if (has(/كورس|دوره|تعلم|تعليم|تسويق|تصوير|تسعير|صناعه|درس/)) {
    let id = null, what = 'الكورسات';
    if (has(/تسويق|سوشيال/)) { id = 'c2'; what = 'كورس التسويق على السوشيال ميديا'; }
    else if (has(/تصوير|صور/)) { id = 'c3'; what = 'كورس تصوير المنتجات'; }
    else if (has(/تسعير|سعر/)) { id = 'c4'; what = 'كورس تسعير المنتجات'; }
    else if (has(/صناعه|صنع/)) { id = 'c1'; what = 'كورس صناعة المنتجات اليدوية'; }
    go('courses', id || undefined);
    return id ? `لقيتلك ${what}. اضغط "ابدأ الكورس" وكمّل.` : 'دي كل الكورسات المتاحة. اختار اللي يناسبك.';
  }
  const cat = [
    [/شمع|شموع/, 'candles'], [/تطريز|مطرز|شنط/, 'embroidery'], [/طبيع|صابون/, 'natural'],
    [/ديكور|مزهري/, 'decor'], [/اكسسوار|خرز|اقراط|سلسل/, 'accessories'], [/هدي|هدايا|بوكس/, 'gifts'],
  ].find(([re]) => has(re));
  if (cat) {
    const id = cat[1], n = products.filter(p => p.cat === id).length;
    go('products', { cat: id, q: '' });
    const noun = n >= 3 && n <= 10 ? 'منتجات' : 'منتج';
    return n ? `لقيتلك ${n} ${noun} من ${catOf(id).voice}.` : `مفيش منتجات في ${catOf(id).voice} حاليًا.`;
  }
  if (has(/\bar\b|واقع|جرب|كاميرا/)) {
    if (state.role === 'seller') return 'تجربة AR متاحة للمشترين. بدّل الحساب لتجربتها.';
    go('ar'); return 'فتحت لك تجربة AR. اضغط "تشغيل AR" وجرّب المنتج في مكانك.';
  }
  if (has(/منتج|افتح|ابحث|دور|سوق|وريني|اعرض/)) {
    go('products', { cat: 'all', q: '' }); return `دي المنتجات المتاحة، ${products.length} منتج يدوي.`;
  }
  if (has(/رئيس|home|البدايه/)) { go('home'); return 'رجعتك للصفحة الرئيسية.'; }
  return 'معلش مفهمتش طلبك 🙈 جرّب مثلًا: "دورلي على شموع" أو "عايز كورس تسويق".';
}
function micPress() {
  if (busy) return;
  const input = $('#vinput'), mic = $('#vmic'), fab = $('#fab');
  const typed = input.value.trim();
  mic.classList.add('on'); fab.classList.add('listening'); $('#vstatus').hidden = false;
  setTimeout(() => {
    mic.classList.remove('on'); fab.classList.remove('listening'); $('#vstatus').hidden = true;
    const phrase = typed || EXAMPLES[exIdx++ % EXAMPLES.length];   // simulated recognition
    input.value = '';
    runCommand(phrase);
  }, 1400);
}

/* =====================================================================
   EVENTS
   ===================================================================== */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const d = el.dataset, id = d.id ? +d.id : null;
  switch (d.act) {
    case 'nav':   e.preventDefault(); go(d.view); break;
    case 'menu':  $('#mainNav').classList.toggle('open'); $('#headerActions').classList.toggle('open'); break;
    case 'view':  go('product', id); break;
    case 'fav':   toggleFav(id); break;
    case 'addcart': addToCart(id); break;
    case 'cat':   go('products', { cat: d.cat, q: '' }); break;
    case 'ar':    go('ar', id); break;
    case 'arstart': state.ar.on = true; renderAR(); toast('✨ تم تشغيل AR التجريبي'); break;
    case 'zoom':  zoomAR(+d.d); break;
    case 'arreset': Object.assign(state.ar, { x: 50, y: 62, s: 1 }); applyAR(); break;
    case 'course': state.lesson = 0; go('course', d.id); break;
    case 'lesson': stopVideo(); state.lesson = +d.i; renderCourse(state.arg); break;
    case 'play':  togglePlay(); break;
    case 'startlesson': if (!video.playing) { togglePlay(); $('#player')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); } break;
    case 'qty': {
      const it = state.cart.find(i => i.id === id); if (!it) break;
      it.qty += +d.d; if (it.qty <= 0) state.cart = state.cart.filter(i => i !== it);
      refresh(); break;
    }
    case 'rm': state.cart = state.cart.filter(i => i.id !== id); refresh(); break;
    case 'checkout': state.cart = []; state.orderDone = true; toast('✓ تم إنشاء الطلب بنجاح'); refresh(); break;
    case 'addnew': go('add'); break;
    case 'edit': go('add', id); break;
    case 'del': deleteProduct(id); break;
    case 'login': login(d.role); break;
    case 'logout': logout(); break;
    case 'openauth': openAuth(null, null, d.mode); break;
    case 'closeauth': closeAuth(); break;
    case 'voice': toggleVoice(); break;
    case 'speak': {
      state.speak = !state.speak; el.textContent = state.speak ? '🔊' : '🔇'; el.setAttribute('aria-pressed', state.speak);
      if (!state.speak && 'speechSynthesis' in window) speechSynthesis.cancel(); break;
    }
    case 'cmd': runCommand(d.t); break;
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (!$('#authModal').hidden) closeAuth(); else if (!$('#vpanel').hidden) toggleVoice(false); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button][data-act]')) { e.preventDefault(); e.target.click(); }
});
$('#authModal').addEventListener('click', e => { if (e.target.id === 'authModal') closeAuth(); });
$('#searchBox').addEventListener('input', e => { state.q = e.target.value; drawProductGrid(); });
$('#vform').addEventListener('submit', e => { e.preventDefault(); const i = $('#vinput'); const v = i.value; i.value = ''; runCommand(v); });
$('#vmic').addEventListener('click', micPress);

/* ---------- boot ---------- */
go('home');
