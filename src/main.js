// TeacherMom Master Entry Point
// Connects UI, SoundFX, Mascot, Cart, Carousel, Order Reference Modal & Admin Panel
import { sounds } from './audio.js';
import { MagicWandCursor } from './cursor.js';
import { MascotController } from './mascot.js';
import { ResourceCarousel } from './carousel.js';
import { SearchController } from './search.js';
import { FlipbookModal } from './flipbook.js';
import { FunZone } from './funzone.js';
import { CartManager } from './cart.js';
import { OrderModal } from './orderModal.js';
import { RateModal } from './rateModal.js';
import { AuthModal } from './authModal.js';
import { CustomRequestModal } from './customRequestModal.js';
import { AdminController } from './admin.js';
import { resourceStore } from './resourceStore.js';
import { InteractiveAnimations } from './interactiveAnimations.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Magic Wand Cursor & Stardust
  const wand = new MagicWandCursor();

  // 2. Sound Toggle Controller
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundText = soundBtn ? soundBtn.querySelector('.btn-text') : null;

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isEnabled = sounds.toggle();
      if (soundIcon) soundIcon.textContent = isEnabled ? '🔊' : '🔇';
      if (soundText) soundText.textContent = isEnabled ? 'Sound ON' : 'Sound OFF';
      if (isEnabled) sounds.pop(700);
    });
  }

  // Wand Toggle Controller
  const wandBtn = document.getElementById('wandToggleBtn');
  if (wandBtn) {
    wandBtn.addEventListener('click', () => {
      const isWandOn = wand.toggle();
      sounds.pop(500);
      const text = wandBtn.querySelector('.btn-text');
      if (text) text.textContent = isWandOn ? 'Wand Trail' : 'Default Cursor';
    });
  }

  // 3. Initialize Teacher Mom Mascot
  const mascotContainer = document.getElementById('mascotContainer');
  let mascot = null;
  if (mascotContainer) {
    mascot = new MascotController(mascotContainer);
  }

  const triggerMascotCheer = (msg) => {
    if (mascot) {
      mascot.cheer(msg);
      if (mascotContainer) {
        const rect = mascotContainer.getBoundingClientRect();
        mascot.showerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 3);
      }
    }
  };

  // 4. Initialize Order Reference & Invoice Modal (for WhatsApp & Email orders)
  const orderModal = new OrderModal({
    onMascotCheer: triggerMascotCheer
  });

  // 5. Initialize Bespoke Custom Curriculum Request Modal (for Schools & Parents)
  const customModal = new CustomRequestModal({
    onMascotCheer: triggerMascotCheer
  });

  // 6. Initialize Teacher & Parent Authentication Modal (Google & Custom Registration)
  const authModal = new AuthModal({
    onMascotCheer: triggerMascotCheer
  });

  // 7. Initialize Customer Rate & Review Modal (Requires Authentication)
  const rateModal = new RateModal({
    onMascotCheer: triggerMascotCheer,
    authModal: authModal
  });

  // 8. Initialize Cart Manager (Dispatches to Order Reference modal upon order)
  const cart = new CartManager({
    onMascotCheer: triggerMascotCheer,
    onProceedToOrder: (items) => {
      orderModal.open(items);
    }
  });

  // 9. Initialize Live Preview Flipbook
  const flipbook = new FlipbookModal({
    onBuyResource: (resource) => {
      orderModal.open(resource);
    },
    onRateResource: (resource) => {
      rateModal.open(resource);
    }
  });

  // 10. Initialize Resource Carousel ("Shop by Grade")
  const carousel = new ResourceCarousel('gradeCarouselContainer', {
    onBuyResource: (resource) => {
      orderModal.open(resource);
    },
    onAddToCart: (resource) => {
      cart.addItem(resource);
      triggerMascotCheer(`Added "${resource.title}" to basket! 🎒`);
    },
    onOpenFlipbook: (resource) => {
      flipbook.open(resource);
    },
    onRateResource: (resource) => {
      rateModal.open(resource);
    },
    onOpenCustomRequest: (resource) => {
      customModal.open(resource);
    }
  });

  // 11. Initialize Search Controller & Sticker Pills (Grade, Resource Type, Curriculum)
  new SearchController({
    onSearch: (query) => {
      carousel.filterByQuery(query);
    },
    onGradeSelect: (grade) => {
      carousel.filterByGrade(grade);
    },
    onTypeSelect: (type) => {
      carousel.filterByType(type);
    },
    onCurriculumSelect: (curriculum) => {
      carousel.filterByCurriculum(curriculum);
    }
  });

  // 12. Wire Custom Order Triggers across page
  document.querySelectorAll('.open-custom-order-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      customModal.open();
    });
  });

  // 10. Initialize The Freebie Sandbox & Fun Zone Minigames
  new FunZone({
    onAddBundleToCart: (bundle) => {
      cart.addItem(bundle);
      triggerMascotCheer(`Custom bundle packed! You saved ${bundle.discountPercent}%! 🎉`);
    },
    onApplyCoupon: (code) => {
      cart.applyCoupon(code);
      cart.openDrawer();
    },
    onMascotCheer: triggerMascotCheer
  });

  // 11. Initialize Admin HQ (teachermomroxy3@gmail.com)
  new AdminController({
    onResourceAdded: (newRes) => {
      triggerMascotCheer(`Yay! New resource "${newRes.title}" is published! 🚀`);
    },
    onOpenFlipbook: (res) => {
      flipbook.open(res);
    }
  });

  // 12. Dynamic Stats Rendering (Happy Teachers, Resources Count, Average Rating)
  const renderDynamicStats = () => {
    const stats = resourceStore.getStats();
    const statTeachersEl = document.getElementById('statHappyTeachers');
    const statResEl = document.getElementById('statResourcesCount');
    const statRatingEl = document.getElementById('statAverageRating');

    if (statTeachersEl) statTeachersEl.textContent = stats.happyTeachers;
    if (statResEl) statResEl.textContent = stats.resourcesCount;
    if (statRatingEl) statRatingEl.textContent = stats.averageRating;
  };

  // 13. Dynamic Featured Quote Rendering (Admin Controlled)
  const renderDynamicFeaturedQuote = () => {
    const featured = resourceStore.getFeaturedReview();
    if (!featured) return;

    const starsEl = document.getElementById('featuredQuoteStars');
    const textEl = document.getElementById('featuredQuoteText');
    const authorEl = document.getElementById('featuredQuoteAuthor');
    const roleEl = document.getElementById('featuredQuoteRole');
    const avatarEl = document.getElementById('featuredQuoteAvatar');

    if (starsEl) starsEl.textContent = '★'.repeat(featured.rating || 5);
    if (textEl) textEl.textContent = `"${featured.text}"`;
    if (authorEl) authorEl.textContent = featured.author;
    if (roleEl) roleEl.textContent = featured.role;
    if (avatarEl) avatarEl.textContent = featured.avatar || '👩‍🏫';
  };

  // 14. Dynamic Bestsellers Rendering (Ranked by ratings & review count)
  const renderDynamicBestsellers = () => {
    const bestsellersContainer = document.getElementById('dynamicBestsellersRow');
    if (!bestsellersContainer) return;

    const bestsellers = resourceStore.getBestsellers(3);
    const badges = ['#1 Best Pick ⭐', 'Math Winner 🔥', 'Classroom Hit 💛'];

    bestsellersContainer.innerHTML = bestsellers.map((item, idx) => {
      const currency = item.currency || 'R';
      const priceFormatted = `${currency}${parseFloat(item.price).toFixed(2)}`;
      const badgeText = badges[idx] || 'Bestseller ✨';
      const hasSampleUploads = item.sampleImages && item.sampleImages.length > 0;

      return `
        <div class="bestseller-highlight-card" data-id="${item.id}">
          <div class="bs-badge">${badgeText}</div>
          <div class="bs-icon-box" style="background:${item.colorTheme || '#FFE5EC'}">
            ${hasSampleUploads ? `
              <img src="${item.sampleImages[0]}" alt="${item.title}" class="bs-thumb-img" />
            ` : `
              <span class="bs-emoji">${item.faceType === 'backpack' ? '🎒' : item.faceType === 'sticky-smile' ? '⭐' : '✏️'}</span>
            `}
          </div>
          <div class="bs-meta-badges">
            <span class="c-badge cur">${item.curriculum || 'CAPS'}</span>
            <span class="c-badge gr">${item.grade}</span>
            <span class="c-badge sub">${item.subject || 'All Subjects'}</span>
            <span class="c-badge term">${item.term || 'Term 1'} (${item.year || '2026'})</span>
            <span class="c-badge locked">🔒 Locked</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.subtitle || item.description || ''}</p>
          <div class="bs-stars-row">
            <div class="bs-stars">★★★★★ <span>(${item.rating} • ${item.reviews} reviews)</span></div>
            <button class="rate-trigger-pill bs-rate-pill" data-id="${item.id}" title="Rate this bestseller">⭐ Rate</button>
          </div>
          <div class="bs-price-row">
            <span class="price-val">${priceFormatted}</span>
            <span class="sample-only-pill">Samples Only 👁️</span>
          </div>
          <div class="bs-actions">
            <button class="quick-flip-bestseller-btn" data-id="${item.id}">📖 Samples</button>
            <button class="bubble-pill-btn btn-mint quick-add-bestseller-btn" data-id="${item.id}">🛒 Buy Now</button>
          </div>
        </div>
      `;
    }).join('');

    // Wire events on dynamic bestsellers
    bestsellersContainer.querySelectorAll('.quick-flip-bestseller-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const res = resourceStore.getResources().find(r => r.id === id);
        if (res) {
          sounds.pageTurn();
          flipbook.open(res);
        }
      });
    });

    bestsellersContainer.querySelectorAll('.quick-add-bestseller-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const res = resourceStore.getResources().find(r => r.id === id);
        if (res) {
          orderModal.open(res);
        }
      });
    });

    bestsellersContainer.querySelectorAll('.bs-rate-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const res = resourceStore.getResources().find(r => r.id === id);
        if (res) {
          sounds.pop(650);
          rateModal.open(res);
        }
      });
    });
  };

  // 15. User Authentication Header Pill Badge
  const renderUserAuthBadge = () => {
    const userAuthBtn = document.getElementById('userAuthBtn');
    const userAuthIcon = document.getElementById('userAuthIcon');
    const userAuthLabel = document.getElementById('userAuthLabel');
    if (!userAuthBtn) return;

    const currentUser = resourceStore.getCurrentUser();
    if (currentUser) {
      userAuthBtn.classList.add('logged-in');
      if (userAuthIcon) userAuthIcon.textContent = currentUser.avatar || '👩‍🏫';
      const firstName = currentUser.name.split(' ')[0] || 'My Account';
      if (userAuthLabel) userAuthLabel.textContent = firstName;
      userAuthBtn.title = `Signed in as ${currentUser.name} (${currentUser.email}) - Click to manage account`;
    } else {
      userAuthBtn.classList.remove('logged-in');
      if (userAuthIcon) userAuthIcon.textContent = '👤';
      if (userAuthLabel) userAuthLabel.textContent = 'Sign In';
      userAuthBtn.title = 'Sign In or Register with Google/Email';
    }
  };

  const userAuthBtn = document.getElementById('userAuthBtn');
  if (userAuthBtn) {
    userAuthBtn.addEventListener('click', () => {
      sounds.pop(500);
      authModal.open();
    });
  }

  // 16. Footer Newsletter Mailing List Subscription & Opt-In/Opt-Out
  const footerForm = document.getElementById('footerNewsletterForm');
  const footerEmailInput = document.getElementById('footerNewsletterEmail');
  const statusPill = document.getElementById('newsletterStatusPill');

  const renderNewsletterStatus = () => {
    if (!statusPill) return;
    const currentUser = resourceStore.getCurrentUser();
    if (currentUser && currentUser.email) {
      const isSubscribed = resourceStore.isSubscribed(currentUser.email);
      statusPill.style.display = 'flex';
      statusPill.innerHTML = `
        <span class="status-indicator-text">
          ${isSubscribed ? '💌 VIP Club: <strong>Subscribed</strong>' : '🔕 VIP Club: <strong>Opted Out</strong>'}
          (${currentUser.email})
        </span>
        <button type="button" class="opt-toggle-link-btn" id="footerOptToggleBtn">
          ${isSubscribed ? 'Opt Out' : 'Opt In'}
        </button>
      `;

      const toggleBtn = statusPill.querySelector('#footerOptToggleBtn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          sounds.sparkle();
          const newStatus = !isSubscribed;
          resourceStore.setMailingListStatus(currentUser.email, newStatus, {
            name: currentUser.name,
            role: currentUser.role
          });
          if (newStatus) {
            triggerMascotCheer(`Subscribed to the Morning Club! 💌`);
            alert(`🎉 You're opted into the TeacherMom VIP Mailing List!`);
          } else {
            alert(`👋 You have opted out of the mailing list.`);
          }
          renderNewsletterStatus();
        });
      }
    } else {
      statusPill.style.display = 'none';
    }
  };

  if (footerForm && footerEmailInput) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = footerEmailInput.value.trim();
      if (!email) return;

      sounds.win();
      resourceStore.setMailingListStatus(email, true);
      triggerMascotCheer(`Welcome to the Morning Club! 💌`);
      footerEmailInput.value = '';

      alert(`🎉 Hooray! ${email} has been added to the TeacherMom VIP Mailing List! Check your inbox for your free starter printable!`);
      renderNewsletterStatus();
    });
  }

  // 17. Initial Render of Dynamic Components
  renderDynamicStats();
  renderDynamicFeaturedQuote();
  renderDynamicBestsellers();
  renderUserAuthBadge();
  renderNewsletterStatus();

  // 18. Subscribe to store updates for real-time reactivity
  resourceStore.subscribe(() => {
    renderDynamicStats();
    renderDynamicFeaturedQuote();
    renderDynamicBestsellers();
    renderUserAuthBadge();
    renderNewsletterStatus();
  });

  // 19. Smooth Scroll for Explore Resources Button with Bloop
  const exploreBtn = document.getElementById('exploreResourcesBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      sounds.pop(680);
    });
  }

  // Sound feedback on nav links
  document.querySelectorAll('.nav-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      sounds.pop(540);
      document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // 20. Initialize Interactive Fun Animations (Hero Doodles, Mascot Tablet Bubble Pop, Floating Joy Station, 3D Tilt & Stamps)
  new InteractiveAnimations({
    onMascotCheer: triggerMascotCheer
  });
});
