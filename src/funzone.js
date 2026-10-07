// "The Freebie Sandbox" / Fun Zone Minigames
// 1. Spin the Prize Wheel
// 2. Build-a-Bundle Backpack Packing Game
import { sounds } from './audio.js';

export class FunZone {
  constructor(options = {}) {
    this.onAddBundleToCart = options.onAddBundleToCart || (() => {});
    this.onApplyCoupon = options.onApplyCoupon || (() => {});
    this.onMascotCheer = options.onMascotCheer || (() => {});

    this.wheelSpinning = false;
    this.wheelRotation = 0;
    this.wheelSegments = [
      { text: '15% OFF Code: MAGIC15', color: '#FFB7B2', type: 'discount', code: 'MAGIC15' },
      { text: 'FREE Alphabet Stickers 🎁', color: '#B5EAD7', type: 'freebie', code: 'FREE-STICKERS' },
      { text: '20% OFF Code: SUPERMOM', color: '#FFEAA7', type: 'discount', code: 'SUPERMOM' },
      { text: 'FREE Math Maze PDF ✏️', color: '#E2F0D9', type: 'freebie', code: 'FREE-MAZE' },
      { text: 'Teacher Hug! Spin Again 💖', color: '#E8D7F1', type: 'reroll' },
      { text: 'R50 OFF Any Order: MOMLOVE', color: '#BEE1E6', type: 'discount', code: 'MOMLOVE' }
    ];

    this.bundleItems = [
      { id: 'b1', name: 'Phonics Fun Pack', price: 95.00, icon: '🎒', color: '#FFCCD5' },
      { id: 'b2', name: 'Math Mania Mats', price: 85.00, icon: '✏️', color: '#B2EBF2' },
      { id: 'b3', name: 'Spelling Stars Cards', price: 90.00, icon: '⭐', color: '#FFE082' },
      { id: 'b4', name: 'Science Sparks STEM', price: 110.00, icon: '🧪', color: '#C8E6C9' },
      { id: 'b5', name: 'Handwriting Heroes', price: 65.00, icon: '🦸', color: '#FFF9C4' },
      { id: 'b6', name: 'Calm Breathing Wheel', price: 80.00, icon: '💖', color: '#FCE4EC' }
    ];

    this.packedItems = [];

    this.init();
  }

  init() {
    this.setupWheel();
    this.setupBundleGame();
    this.setupTabs();
  }

  setupTabs() {
    const tabBtns = document.querySelectorAll('.fun-tab-btn');
    const tabPanels = document.querySelectorAll('.fun-tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.pop(500);
        const target = e.currentTarget.dataset.tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        e.currentTarget.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // --- 1. SPIN THE PRIZE WHEEL ---
  setupWheel() {
    const canvas = document.getElementById('prizeWheelCanvas');
    const spinBtn = document.getElementById('spinWheelBtn');
    if (!canvas || !spinBtn) return;

    this.drawWheel(canvas);

    spinBtn.addEventListener('click', () => {
      if (this.wheelSpinning) return;
      this.spinWheel(canvas);
    });
  }

  drawWheel(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 12;
    const cx = width / 2;
    const cy = height / 2;
    const numSegs = this.wheelSegments.length;
    const arc = (Math.PI * 2) / numSegs;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.wheelRotation * (Math.PI / 180));

    // Outer cartoon border
    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#3D2C2E';
    ctx.fill();

    // Slices
    for (let i = 0; i < numSegs; i++) {
      const angle = i * arc;
      const seg = this.wheelSegments[i];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arc);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Comic borders between slices
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#3D2C2E';
      ctx.stroke();

      // Slice Text
      ctx.save();
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#2B1E20';
      ctx.font = 'bold 13px "Fredoka", sans-serif';
      ctx.fillText(seg.text, radius - 20, 5);
      ctx.restore();
    }

    // Outer decorative dots
    for (let i = 0; i < numSegs * 3; i++) {
      const dotAngle = (i * Math.PI * 2) / (numSegs * 3);
      const dx = Math.cos(dotAngle) * (radius + 4);
      const dy = Math.sin(dotAngle) * (radius + 4);
      ctx.beginPath();
      ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#3D2C2E';
      ctx.stroke();
    }

    // Center Hub
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#FF5E7E';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#3D2C2E';
    ctx.stroke();

    ctx.font = '20px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('⭐', 0, 0);

    ctx.restore();
  }

  spinWheel(canvas) {
    this.wheelSpinning = true;
    sounds.boing();

    const spinBtn = document.getElementById('spinWheelBtn');
    if (spinBtn) spinBtn.disabled = true;

    // Pick random target angle (between 4 and 7 full spins + offset)
    const extraSpins = 360 * (4 + Math.floor(Math.random() * 3));
    const randomOffset = Math.random() * 360;
    const targetRotation = this.wheelRotation + extraSpins + randomOffset;

    const startRotation = this.wheelRotation;
    const startTime = performance.now();
    const duration = 4000; // 4 seconds

    let lastTickAngle = startRotation;

    const animateWheel = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic / quartic
      const ease = 1 - Math.pow(1 - progress, 3.8);
      this.wheelRotation = startRotation + (targetRotation - startRotation) * ease;

      // Tick sound every slice crossed
      if (Math.abs(this.wheelRotation - lastTickAngle) >= (360 / this.wheelSegments.length)) {
        sounds.tick();
        lastTickAngle = this.wheelRotation;
      }

      this.drawWheel(canvas);

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        this.wheelSpinning = false;
        if (spinBtn) spinBtn.disabled = false;
        this.onWheelFinished();
      }
    };

    requestAnimationFrame(animateWheel);
  }

  onWheelFinished() {
    // Determine winner segment: 
    // Pointer is at TOP (270 degrees in standard math or -90 deg from center)
    const normalizedAngle = (360 - (this.wheelRotation % 360) + 270) % 360;
    const segAngle = 360 / this.wheelSegments.length;
    const winIndex = Math.floor(normalizedAngle / segAngle) % this.wheelSegments.length;
    const winner = this.wheelSegments[winIndex];

    sounds.win();
    this.onMascotCheer(`Woohoo! You won: ${winner.text}! 🎉`);

    const resultBox = document.getElementById('wheelResultAnnouncement');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="prize-card-winner">
          <h4>🎉 You Won!</h4>
          <p class="prize-text">${winner.text}</p>
          ${winner.code ? `
            <div class="coupon-won-box">
              <span class="code-copy-tag">Code: <strong>${winner.code}</strong></span>
              <button class="bubble-pill-btn btn-peach apply-wheel-coupon-btn" data-code="${winner.code}">
                📋 Copy & Apply to Basket
              </button>
            </div>
          ` : `
            <button class="bubble-pill-btn btn-mint play-again-btn">Spin Again! 🎈</button>
          `}
        </div>
      `;

      const applyBtn = resultBox.querySelector('.apply-wheel-coupon-btn');
      if (applyBtn) {
        applyBtn.addEventListener('click', (e) => {
          sounds.sparkle();
          const code = e.currentTarget.dataset.code;
          this.onApplyCoupon(code);
          alert(`✨ Coupon "${code}" copied and applied to your basket!`);
        });
      }

      const retryBtn = resultBox.querySelector('.play-again-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          sounds.pop(500);
          resultBox.innerHTML = '';
        });
      }
    }
  }

  // --- 2. BUILD-A-BUNDLE BACKPACK GAME ---
  setupBundleGame() {
    this.renderShelfItems();
    this.updateBackpackUi();

    const addBundleBtn = document.getElementById('addBundleToCartBtn');
    if (addBundleBtn) {
      addBundleBtn.addEventListener('click', () => {
        if (this.packedItems.length === 0) {
          sounds.pop(300);
          alert('🎒 Please pack at least 1 resource into the backpack first!');
          return;
        }

        sounds.win();
        const discountRate = this.getDiscountRate();
        const rawTotal = this.packedItems.reduce((acc, i) => acc + i.price, 0);
        const finalPrice = rawTotal * (1 - discountRate);

        const bundlePackage = {
          id: `custom-bundle-${Date.now()}`,
          title: `Custom Bundle (${this.packedItems.length} items) 🎒`,
          subtitle: this.packedItems.map(i => i.name).join(', '),
          grade: 'Multi-Grade Bundle',
          colorTheme: '#FFF3E0',
          price: parseFloat(finalPrice.toFixed(2)),
          packedCount: this.packedItems.length,
          discountPercent: Math.round(discountRate * 100)
        };

        this.onAddBundleToCart(bundlePackage);
        this.onMascotCheer(`Awesome bundle created! You saved ${Math.round(discountRate * 100)}%! 🎉`);

        // Empty backpack with celebration
        this.packedItems = [];
        this.updateBackpackUi();
      });
    }

    const resetBundleBtn = document.getElementById('emptyBackpackBtn');
    if (resetBundleBtn) {
      resetBundleBtn.addEventListener('click', () => {
        sounds.pop(400);
        this.packedItems = [];
        this.updateBackpackUi();
      });
    }
  }

  renderShelfItems() {
    const shelfEl = document.getElementById('bundleShelfContainer');
    if (!shelfEl) return;

    shelfEl.innerHTML = this.bundleItems.map(item => `
      <div class="bundle-item-tile" data-id="${item.id}" style="background: ${item.color}">
        <span class="item-tile-icon">${item.icon}</span>
        <span class="item-tile-name">${item.name}</span>
        <span class="item-tile-price">R${item.price.toFixed(2)}</span>
        <button class="pack-item-btn" title="Pack into backpack!">
          + Pack In
        </button>
      </div>
    `).join('');

    shelfEl.querySelectorAll('.bundle-item-tile').forEach(tile => {
      tile.addEventListener('click', (e) => {
        const id = tile.dataset.id;
        const item = this.bundleItems.find(b => b.id === id);
        if (item) {
          this.packItem(item, tile);
        }
      });
    });
  }

  packItem(item, tileEl) {
    sounds.boing();
    this.packedItems.push(item);
    
    // Animate item popping
    tileEl.classList.add('item-packed-bounce');
    setTimeout(() => tileEl.classList.remove('item-packed-bounce'), 350);

    // Animate backpack reaction
    const backpackArt = document.getElementById('kawaiiBackpackSvg');
    if (backpackArt) {
      backpackArt.classList.add('backpack-chewing');
      setTimeout(() => backpackArt.classList.remove('backpack-chewing'), 500);
    }

    this.updateBackpackUi();
  }

  getDiscountRate() {
    const count = this.packedItems.length;
    if (count >= 3) return 0.25; // 25% off
    if (count === 2) return 0.10; // 10% off
    return 0;
  }

  updateBackpackUi() {
    const listEl = document.getElementById('packedItemsList');
    const subtotalEl = document.getElementById('bundleSubtotal');
    const discountEl = document.getElementById('bundleDiscount');
    const totalEl = document.getElementById('bundleFinalTotal');
    const countBadge = document.getElementById('backpackItemsBadge');
    const meterFill = document.getElementById('bundleSavingsMeterFill');
    const meterText = document.getElementById('bundleSavingsMeterText');

    if (countBadge) countBadge.textContent = this.packedItems.length;

    const rawTotal = this.packedItems.reduce((acc, i) => acc + i.price, 0);
    const discountRate = this.getDiscountRate();
    const discountSavings = rawTotal * discountRate;
    const finalTotal = rawTotal - discountSavings;

    if (subtotalEl) subtotalEl.textContent = `R${rawTotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-R${discountSavings.toFixed(2)} (${Math.round(discountRate * 100)}% off)`;
    if (totalEl) totalEl.textContent = `R${finalTotal.toFixed(2)}`;

    // Savings Tier Meter
    if (meterFill && meterText) {
      if (this.packedItems.length === 0) {
        meterFill.style.width = '0%';
        meterText.textContent = 'Pack items to unlock up to 25% OFF!';
      } else if (this.packedItems.length === 1) {
        meterFill.style.width = '35%';
        meterText.textContent = 'Pack 1 more item to unlock 10% OFF!';
      } else if (this.packedItems.length === 2) {
        meterFill.style.width = '65%';
        meterText.textContent = 'Awesome! 10% unlocked. Pack 1 more for 25% SUPER SAVINGS!';
      } else {
        meterFill.style.width = '100%';
        meterText.textContent = '🎉 MAXIMUM 25% SUPER TEACHER SAVINGS UNLOCKED!';
      }
    }

    if (listEl) {
      if (this.packedItems.length === 0) {
        listEl.innerHTML = `<p class="empty-backpack-note">Your backpack is hungry! Click items on the shelf above to pack them inside! 🎒✨</p>`;
      } else {
        listEl.innerHTML = this.packedItems.map((item, index) => `
          <div class="packed-mini-item">
            <span>${item.icon} ${item.name}</span>
            <span class="packed-p">R${item.price.toFixed(2)}</span>
            <button class="remove-packed-btn" data-index="${index}" title="Remove item">✕</button>
          </div>
        `).join('');

        listEl.querySelectorAll('.remove-packed-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            sounds.pop(380);
            const idx = parseInt(e.currentTarget.dataset.index, 10);
            this.packedItems.splice(idx, 1);
            this.updateBackpackUi();
          });
        });
      }
    }
  }
}
