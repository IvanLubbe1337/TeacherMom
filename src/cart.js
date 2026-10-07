// Cart Basket State, Drawer & Checkout Simulation
import { sounds } from './audio.js';

export class CartManager {
  constructor(options = {}) {
    this.onCartChange = options.onCartChange || (() => {});
    this.onMascotCheer = options.onMascotCheer || (() => {});
    this.onProceedToOrder = options.onProceedToOrder || (() => {});
    this.items = []; // array of { resource, quantity }
    this.couponCode = '';
    this.discountPercent = 0;
    this.flatDiscount = 0;
    this.drawerEl = null;

    this.init();
  }

  init() {
    this.createDrawerDom();
    this.setupEvents();
    this.updateUi();
  }

  createDrawerDom() {
    this.drawerEl = document.createElement('div');
    this.drawerEl.className = 'cart-drawer-backdrop';
    this.drawerEl.id = 'cartDrawerBackdrop';
    this.drawerEl.innerHTML = `
      <div class="cart-drawer-panel">
        <div class="drawer-header">
          <div class="drawer-header-title">
            <span class="basket-emoji">🎒</span>
            <h3>Teacher's Goodie Basket</h3>
          </div>
          <button class="drawer-close-btn" id="closeCartDrawerBtn" aria-label="Close basket">✕</button>
        </div>

        <div class="drawer-body" id="cartDrawerItems">
          <!-- Populated by JS -->
        </div>

        <div class="drawer-footer">
          <!-- Coupon Box -->
          <div class="cart-coupon-box">
            <input type="text" id="cartCouponInput" placeholder="Discount Code (e.g. SUPERMOM)" />
            <button class="bubble-pill-btn btn-peach" id="applyCouponBtn">Apply</button>
          </div>
          <div class="coupon-msg" id="couponMsg"></div>

          <!-- Price Summary -->
          <div class="price-summary-breakdown">
            <div class="summary-line">
              <span>Subtotal:</span>
              <span id="cartSubtotalVal">$0.00</span>
            </div>
            <div class="summary-line discount-line" id="discountRow" style="display: none;">
              <span>Teacher Savings:</span>
              <span id="cartDiscountVal">-$0.00</span>
            </div>
            <div class="summary-line total-line">
              <span>Total:</span>
              <span id="cartTotalVal">$0.00</span>
            </div>
          </div>

          <button class="bubble-pill-btn btn-mint checkout-btn" id="proceedCheckoutBtn">
            🧾 Generate Invoice & Order (<span id="checkoutPriceVal">R0.00</span>)
          </button>
          <p class="safe-download-note">🔒 Sales handled via WhatsApp & Email • Invoice Reference Generated</p>
        </div>
      </div>
    `;

    document.body.appendChild(this.drawerEl);
  }

  setupEvents() {
    const basketBtn = document.getElementById('cartBasketBtn');
    if (basketBtn) {
      basketBtn.addEventListener('click', () => this.openDrawer());
    }

    const closeBtn = this.drawerEl.querySelector('#closeCartDrawerBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    this.drawerEl.addEventListener('click', (e) => {
      if (e.target === this.drawerEl) this.closeDrawer();
    });

    const applyCouponBtn = this.drawerEl.querySelector('#applyCouponBtn');
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener('click', () => {
        const input = this.drawerEl.querySelector('#cartCouponInput');
        if (input) this.applyCoupon(input.value.trim());
      });
    }

    const checkoutBtn = this.drawerEl.querySelector('#proceedCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.handleCheckout());
    }
  }

  addItem(resource) {
    const existing = this.items.find(i => i.resource.id === resource.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ resource, quantity: 1 });
    }

    this.updateUi();
    this.onCartChange(this.items);
  }

  removeItem(resourceId) {
    sounds.pop(350);
    this.items = this.items.filter(i => i.resource.id !== resourceId);
    this.updateUi();
    this.onCartChange(this.items);
  }

  updateQuantity(resourceId, delta) {
    const item = this.items.find(i => i.resource.id === resourceId);
    if (!item) return;

    sounds.pop(500);
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(resourceId);
    } else {
      this.updateUi();
      this.onCartChange(this.items);
    }
  }

  applyCoupon(code) {
    sounds.pop(600);
    const msgEl = this.drawerEl.querySelector('#couponMsg');
    const cleanCode = code.toUpperCase();

    if (cleanCode === 'SUPERMOM') {
      this.couponCode = cleanCode;
      this.discountPercent = 0.20;
      this.flatDiscount = 0;
      msgEl.textContent = '🎉 20% SuperMom discount applied!';
      msgEl.className = 'coupon-msg success';
      sounds.win();
    } else if (cleanCode === 'MAGIC15') {
      this.couponCode = cleanCode;
      this.discountPercent = 0.15;
      this.flatDiscount = 0;
      msgEl.textContent = '✨ 15% Magic discount applied!';
      msgEl.className = 'coupon-msg success';
      sounds.sparkle();
    } else if (cleanCode === 'MOMLOVE') {
      this.couponCode = cleanCode;
      this.discountPercent = 0;
      this.flatDiscount = 50.00;
      msgEl.textContent = '💖 R50 Off Mom Love applied!';
      msgEl.className = 'coupon-msg success';
      sounds.sparkle();
    } else if (cleanCode === 'FREE-STICKERS' || cleanCode === 'FREE-MAZE') {
      this.couponCode = cleanCode;
      this.discountPercent = 0.10;
      this.flatDiscount = 0;
      msgEl.textContent = '🎁 Freebie bonus pack + 10% discount applied!';
      msgEl.className = 'coupon-msg success';
      sounds.sparkle();
    } else {
      msgEl.textContent = '❌ Invalid coupon. Try SUPERMOM or spin the wheel!';
      msgEl.className = 'coupon-msg error';
      return;
    }

    const input = this.drawerEl.querySelector('#cartCouponInput');
    if (input) input.value = cleanCode;

    this.updateUi();
  }

  openDrawer() {
    sounds.pop(620);
    this.drawerEl.classList.add('active');
  }

  closeDrawer() {
    sounds.pop(400);
    this.drawerEl.classList.remove('active');
  }

  updateUi() {
    const totalCount = this.items.reduce((acc, i) => acc + i.quantity, 0);

    // Navbar badge
    const badgeEl = document.getElementById('cartBadgeCount');
    if (badgeEl) {
      badgeEl.textContent = totalCount;
      badgeEl.style.transform = 'scale(1.35)';
      setTimeout(() => badgeEl.style.transform = 'scale(1)', 250);
    }

    // Drawer items container
    const itemsContainer = this.drawerEl.querySelector('#cartDrawerItems');
    if (!itemsContainer) return;

    if (this.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-emoji">🎒</div>
          <h4>Your Goodie Basket is Empty!</h4>
          <p>Explore our cute printables or build a custom bundle in the Fun Zone!</p>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = this.items.map(({ resource, quantity }) => `
        <div class="cart-drawer-item-card">
          <div class="cart-thumb-box" style="background: ${resource.colorTheme || '#FFE5EC'}">
            <span>🎒</span>
          </div>
          <div class="cart-item-details">
            <h5 class="cart-item-title">${resource.title}</h5>
            <span class="cart-item-grade">${resource.grade}</span>
            <div class="cart-item-price-unit">R${resource.price.toFixed(2)} each</div>
          </div>
          <div class="cart-qty-controls">
            <button class="qty-btn" data-id="${resource.id}" data-action="dec">-</button>
            <span class="qty-num">${quantity}</span>
            <button class="qty-btn" data-id="${resource.id}" data-action="inc">+</button>
          </div>
          <div class="cart-item-subtotal">
            R${(resource.price * quantity).toFixed(2)}
          </div>
          <button class="remove-cart-item-btn" data-id="${resource.id}" title="Remove item">✕</button>
        </div>
      `).join('');

      // Wire item quantity and remove clicks
      itemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          const action = e.currentTarget.dataset.action;
          this.updateQuantity(id, action === 'inc' ? 1 : -1);
        });
      });

      itemsContainer.querySelectorAll('.remove-cart-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          this.removeItem(id);
        });
      });
    }

    // Calculations
    const subtotal = this.items.reduce((acc, i) => acc + i.resource.price * i.quantity, 0);
    let discountAmount = subtotal * this.discountPercent + this.flatDiscount;
    if (discountAmount > subtotal) discountAmount = subtotal;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const subtotalEl = this.drawerEl.querySelector('#cartSubtotalVal');
    const discountRow = this.drawerEl.querySelector('#discountRow');
    const discountVal = this.drawerEl.querySelector('#cartDiscountVal');
    const totalEl = this.drawerEl.querySelector('#cartTotalVal');
    const checkoutPriceVal = this.drawerEl.querySelector('#checkoutPriceVal');
    const checkoutBtn = this.drawerEl.querySelector('#proceedCheckoutBtn');

    const curr = (this.items[0] && this.items[0].resource.currency) || 'R';
    if (subtotalEl) subtotalEl.textContent = `${curr}${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${curr}${finalTotal.toFixed(2)}`;
    if (checkoutPriceVal) checkoutPriceVal.textContent = `${curr}${finalTotal.toFixed(2)}`;

    if (discountAmount > 0) {
      if (discountRow) discountRow.style.display = 'flex';
      if (discountVal) discountVal.textContent = `-${curr}${discountAmount.toFixed(2)}`;
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = this.items.length === 0;
    }
  }

  handleCheckout() {
    if (this.items.length === 0) return;
    sounds.boing();
    this.closeDrawer();
    this.onProceedToOrder(this.items);
  }
}
