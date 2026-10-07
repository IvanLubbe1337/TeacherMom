// Customer Rating & Review Modal
import { sounds } from './audio.js';
import { resourceStore } from './resourceStore.js';

export class RateModal {
  constructor(options = {}) {
    this.onMascotCheer = options.onMascotCheer || (() => {});
    this.authModal = options.authModal || null;
    this.modalEl = null;
    this.currentResource = null;
    this.selectedStars = 5;

    this.init();
  }

  init() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'rate-modal-backdrop';
    this.modalEl.id = 'rateModalBackdrop';
    this.modalEl.innerHTML = `
      <div class="rate-window">
        <div class="rate-window-header">
          <div class="rate-header-badge">
            <span class="badge-icon">⭐</span>
            <h3>Teacher & Parent Review</h3>
          </div>
          <button class="rate-close-btn" id="closeRateModalBtn" aria-label="Close review modal">✕</button>
        </div>

        <div class="rate-window-body">
          <!-- Verified Account Header Slot -->
          <div class="rate-auth-user-bar" id="rateAuthUserBar"></div>

          <div class="rate-target-info">
            <span class="rate-label">You are rating:</span>
            <h4 id="rateResourceTitle">Educational Resource</h4>
          </div>

          <!-- Interactive Star Selector -->
          <div class="star-rating-selector" id="starRatingSelector">
            <button type="button" class="star-select-btn active" data-stars="1">★</button>
            <button type="button" class="star-select-btn active" data-stars="2">★</button>
            <button type="button" class="star-select-btn active" data-stars="3">★</button>
            <button type="button" class="star-select-btn active" data-stars="4">★</button>
            <button type="button" class="star-select-btn active" data-stars="5">★</button>
          </div>
          <div class="stars-caption-text" id="starsCaption">5.0 - Super Fantastic! 🌟</div>

          <!-- Form Fields -->
          <form class="rate-review-form" id="rateReviewForm" onsubmit="event.preventDefault();">
            <div class="form-row-2">
              <div class="form-field">
                <label for="revAuthor">Your Name & Title: *</label>
                <input type="text" id="revAuthor" placeholder="e.g. Mrs. Lerato Khumalo" required />
              </div>
              <div class="form-field">
                <label for="revRole">Your Role & City: *</label>
                <input type="text" id="revRole" placeholder="e.g. Grade 1 Teacher, Pretoria" required />
              </div>
            </div>

            <div class="form-field">
              <label for="revText">Your Review & Classroom Experience: *</label>
              <textarea id="revText" rows="3" placeholder="How did your learners respond to this resource? What did you love most?" required></textarea>
            </div>

            <!-- Mailing List Opt-In / Opt-Out for Reviewer -->
            <div class="rate-mailing-opt-box">
              <label class="checkbox-container">
                <input type="checkbox" id="revMailingOpt" checked />
                <span class="checkbox-text">
                  💌 <strong>TeacherMom VIP Mailing List:</strong> Send me free weekly printables, coupons & CAPS teaching tips.
                </span>
              </label>
            </div>

            <button type="submit" class="bubble-pill-btn btn-mint full-width-btn submit-review-btn">
              🌟 Submit Verified Review
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    // Wire close
    this.modalEl.querySelector('#closeRateModalBtn').addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // Wire star selection
    const starBtns = this.modalEl.querySelectorAll('.star-select-btn');
    starBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.pop(650);
        this.selectedStars = parseInt(e.currentTarget.dataset.stars, 10);
        this.updateStarsDisplay();
      });
    });

    // Wire form submission
    this.modalEl.querySelector('#rateReviewForm').addEventListener('submit', () => this.handleSubmit());
  }

  updateStarsDisplay() {
    const starBtns = this.modalEl.querySelectorAll('.star-select-btn');
    const caption = this.modalEl.querySelector('#starsCaption');
    
    starBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx < this.selectedStars);
    });

    const captions = [
      '',
      '1.0 - Needs Improvement 🤔',
      '2.0 - Fair ✏️',
      '3.0 - Good Resource 👍',
      '4.0 - Really Great! 🎒',
      '5.0 - Super Fantastic! 🌟'
    ];
    caption.textContent = captions[this.selectedStars] || '5.0 - Super Fantastic! 🌟';
  }

  open(resource) {
    // 1. Enforce Authentication (Google or Custom Registration)
    const currentUser = resourceStore.getCurrentUser();
    if (!currentUser) {
      sounds.pop(500);
      if (this.authModal) {
        this.authModal.open({
          promptMessage: '🌸 Please sign in with Google or create an account to leave a verified review!',
          onLoginSuccess: (user) => {
            this.open(resource);
          }
        });
      } else {
        alert('Please sign in or register before leaving a review.');
      }
      return;
    }

    this.currentResource = resource;
    this.selectedStars = 5;
    this.updateStarsDisplay();

    const titleEl = this.modalEl.querySelector('#rateResourceTitle');
    if (titleEl) titleEl.textContent = resource.title;

    // Render Authenticated Reviewer Badge
    const userBar = this.modalEl.querySelector('#rateAuthUserBar');
    if (userBar) {
      userBar.innerHTML = `
        <div class="verified-reviewer-pill">
          <span class="v-avatar">${currentUser.avatar || '👩‍🏫'}</span>
          <span class="v-info">Logged in as: <strong>${currentUser.name}</strong></span>
          <span class="v-tag">✓ Verified ${currentUser.provider === 'google' ? 'Google' : 'Member'}</span>
        </div>
      `;
    }

    // Pre-fill user data
    this.modalEl.querySelector('#revAuthor').value = currentUser.name || '';
    this.modalEl.querySelector('#revRole').value = currentUser.role || '';
    this.modalEl.querySelector('#revText').value = '';

    // Pre-set mailing list preference
    const mailOpt = this.modalEl.querySelector('#revMailingOpt');
    if (mailOpt) {
      mailOpt.checked = currentUser.mailingList !== false;
    }

    sounds.boing();
    this.modalEl.classList.add('active');
  }

  close() {
    sounds.pop(400);
    this.modalEl.classList.remove('active');
  }

  handleSubmit() {
    const currentUser = resourceStore.getCurrentUser();
    if (!currentUser) {
      alert('⚠️ Session expired. Please sign in again.');
      this.close();
      return;
    }

    const author = this.modalEl.querySelector('#revAuthor').value.trim();
    const role = this.modalEl.querySelector('#revRole').value.trim();
    const text = this.modalEl.querySelector('#revText').value.trim();
    const mailOpt = this.modalEl.querySelector('#revMailingOpt').checked;

    if (!author || !role || !text) {
      alert('⚠️ Please fill in your name, role and review text.');
      return;
    }

    sounds.win();

    // Update mailing list preference based on review submission checkbox
    resourceStore.setMailingListStatus(currentUser.email, mailOpt, {
      name: author,
      role: role
    });

    // Rate resource and add review
    resourceStore.rateResource(this.currentResource.id, this.selectedStars, {
      author,
      role,
      text,
      avatar: currentUser.avatar || '👩‍🏫',
      userId: currentUser.id,
      userEmail: currentUser.email,
      provider: currentUser.provider || 'custom',
      verified: true,
      date: new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
    });

    this.onMascotCheer(`Thank you ${author}! Your verified ${this.selectedStars}★ review has been recorded! 💖`);
    this.close();
    alert('🎉 Thank you for supporting TeacherMom! Your verified review has been published.');
  }
}
