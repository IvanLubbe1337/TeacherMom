// Teacher & Parent Authentication Modal (Google & Custom Registration)
// With VIP Mailing List Opt-In / Opt-Out management
import { sounds } from './audio.js';
import { resourceStore } from './resourceStore.js';

export class AuthModal {
  constructor(options = {}) {
    this.onMascotCheer = options.onMascotCheer || (() => {});
    this.modalEl = null;
    this.pendingSuccessCallback = null;
    this.activeTab = 'register'; // 'register' or 'login'

    this.init();
  }

  init() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'auth-modal-backdrop';
    this.modalEl.id = 'authModalBackdrop';
    this.modalEl.innerHTML = `
      <div class="auth-window">
        <!-- Window Top Bar -->
        <div class="auth-window-header">
          <div class="auth-header-title">
            <span class="auth-icon-badge">🌸</span>
            <div>
              <h3>Teacher & Parent Access</h3>
              <p class="auth-header-sub" id="authHeaderSub">Sign in to leave verified reviews & unlock educator perks</p>
            </div>
          </div>
          <button class="auth-close-btn" id="closeAuthModalBtn" aria-label="Close sign in dialog">✕</button>
        </div>

        <!-- Notification Banner / Prompt -->
        <div class="auth-prompt-alert" id="authPromptAlert" style="display: none;"></div>

        <!-- Window Body -->
        <div class="auth-window-body" id="authWindowBody">
          <!-- Dynamically filled: either Auth Forms or Active Profile -->
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    // Event listeners
    this.modalEl.querySelector('#closeAuthModalBtn').addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // Listen to store updates
    resourceStore.subscribe(() => {
      if (this.modalEl.classList.contains('active')) {
        this.renderBody();
      }
    });
  }

  open(options = {}) {
    this.pendingSuccessCallback = options.onLoginSuccess || null;
    const promptMsg = options.promptMessage || null;

    const alertEl = this.modalEl.querySelector('#authPromptAlert');
    if (promptMsg) {
      alertEl.textContent = promptMsg;
      alertEl.style.display = 'block';
    } else {
      alertEl.style.display = 'none';
    }

    this.renderBody();
    sounds.boing();
    this.modalEl.classList.add('active');
  }

  close() {
    sounds.pop(400);
    this.modalEl.classList.remove('active');
    this.pendingSuccessCallback = null;
  }

  renderBody() {
    const container = this.modalEl.querySelector('#authWindowBody');
    const currentUser = resourceStore.getCurrentUser();

    if (currentUser) {
      this.renderProfileView(container, currentUser);
    } else {
      this.renderAuthForms(container);
    }
  }

  // --- Profile View (When already logged in) ---
  renderProfileView(container, user) {
    const isSubscribed = user.mailingList !== false;

    container.innerHTML = `
      <div class="user-profile-card">
        <div class="profile-header-row">
          <div class="profile-avatar-large">${user.avatar || '👩‍🏫'}</div>
          <div class="profile-meta">
            <h4>${user.name}</h4>
            <span class="profile-email">${user.email}</span>
            <span class="profile-role">🏫 ${user.role || 'Educator / Parent'}</span>
            <span class="verified-provider-badge">
              ✓ Verified via ${user.provider === 'google' ? 'Google' : 'TeacherMom Member'}
            </span>
          </div>
        </div>

        <!-- Mailing List Subscription Card -->
        <div class="mailing-list-status-card ${isSubscribed ? 'subscribed' : 'opted-out'}">
          <div class="m-card-info">
            <div class="m-badge-row">
              <span class="m-icon">${isSubscribed ? '💌' : '🔕'}</span>
              <strong>TeacherMom VIP Mailing List</strong>
            </div>
            <p class="m-status-text">
              Status: <strong>${isSubscribed ? 'Subscribed (Opted In)' : 'Opted Out / Inactive'}</strong>
            </p>
            <p class="m-hint-text">
              ${isSubscribed 
                ? 'You receive freebie printables, Sunday morning worksheets & secret discount codes!' 
                : 'You are currently not receiving free weekly printables or update emails.'}
            </p>
          </div>
          <button class="bubble-pill-btn ${isSubscribed ? 'btn-opt-out' : 'btn-mint'}" id="toggleMailingListBtn">
            ${isSubscribed ? 'Opt Out / Unsubscribe' : 'Opt In / Join Free List'}
          </button>
        </div>

        <div class="profile-actions-row">
          <button class="bubble-pill-btn btn-peach full-width-btn" id="profileSignOutBtn">
            🚪 Sign Out of Account
          </button>
        </div>
      </div>
    `;

    // Toggle Mailing List
    container.querySelector('#toggleMailingListBtn').addEventListener('click', () => {
      sounds.sparkle();
      const newStatus = !isSubscribed;
      resourceStore.setMailingListStatus(user.email, newStatus, { name: user.name, role: user.role });
      if (newStatus) {
        this.onMascotCheer(`Yay! You're subscribed to the TeacherMom Mailing List! 💌`);
        alert('🎉 Hooray! You have opted into the TeacherMom VIP Mailing List. Keep an eye on your inbox!');
      } else {
        sounds.pop(350);
        alert('👋 You have opted out of the mailing list. You can opt back in anytime!');
      }
      this.renderBody();
    });

    // Sign Out
    container.querySelector('#profileSignOutBtn').addEventListener('click', () => {
      sounds.pop(400);
      resourceStore.logoutUser();
      alert('You have been signed out.');
      this.renderBody();
    });
  }

  // --- Auth Forms (Google + Custom Registration & Login) ---
  renderAuthForms(container) {
    container.innerHTML = `
      <div class="auth-forms-wrapper">
        
        <!-- Google One-Click Sign In -->
        <div class="google-auth-box">
          <button type="button" class="google-auth-btn" id="googleSignInBtn">
            <svg class="google-logo" viewBox="0 0 24 24" width="22" height="22">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <label class="google-mailing-opt-label">
            <input type="checkbox" id="googleMailingOptCheckbox" checked />
            <span>Join the TeacherMom VIP Mailing List (free weekly printables)</span>
          </label>
        </div>

        <div class="auth-divider-row">
          <span>OR CONTINUE WITH EMAIL</span>
        </div>

        <!-- Auth Tabs: Register vs Sign In -->
        <div class="auth-tab-switch">
          <button type="button" class="auth-tab-btn ${this.activeTab === 'register' ? 'active' : ''}" data-tab="register">
            ✨ Register New Account
          </button>
          <button type="button" class="auth-tab-btn ${this.activeTab === 'login' ? 'active' : ''}" data-tab="login">
            🔑 Sign In
          </button>
        </div>

        <!-- TAB 1: Custom Registration Form -->
        <form class="auth-form-panel ${this.activeTab === 'register' ? 'active' : ''}" id="customRegisterForm">
          <div class="form-row-2">
            <div class="form-field">
              <label for="regName">Your Full Name & Title: *</label>
              <input type="text" id="regName" placeholder="e.g. Mrs. Lerato Khumalo" required />
            </div>
            <div class="form-field">
              <label for="regRole">Role & School / City: *</label>
              <input type="text" id="regRole" placeholder="e.g. Grade 1 Teacher, Pretoria" required />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-field">
              <label for="regEmail">Email Address: *</label>
              <input type="email" id="regEmail" placeholder="lerato@myschool.co.za" required />
            </div>
            <div class="form-field">
              <label for="regPassword">Create Password: *</label>
              <input type="password" id="regPassword" placeholder="••••••••" required />
            </div>
          </div>

          <!-- Mailing List Opt-In / Opt-Out Checkbox -->
          <div class="mailing-list-opt-field">
            <label class="checkbox-container">
              <input type="checkbox" id="regMailingOpt" checked />
              <span class="checkbox-text">
                💌 <strong>Join the TeacherMom VIP Mailing List:</strong> Receive free Sunday printables, CAPS lesson ideas & secret discounts (You can opt out anytime).
              </span>
            </label>
          </div>

          <button type="submit" class="bubble-pill-btn btn-mint full-width-btn submit-auth-btn">
            🌟 Register & Continue
          </button>
        </form>

        <!-- TAB 2: Custom Login Form -->
        <form class="auth-form-panel ${this.activeTab === 'login' ? 'active' : ''}" id="customLoginForm">
          <div class="form-field">
            <label for="loginEmail">Email Address: *</label>
            <input type="email" id="loginEmail" placeholder="your.name@school.co.za" required />
          </div>

          <div class="form-field">
            <label for="loginPassword">Password: *</label>
            <input type="password" id="loginPassword" placeholder="••••••••" required />
          </div>

          <button type="submit" class="bubble-pill-btn btn-mint full-width-btn submit-auth-btn">
            🚀 Sign In
          </button>
        </form>

      </div>
    `;

    // Google Sign In Button
    container.querySelector('#googleSignInBtn').addEventListener('click', () => {
      const mailingOpt = container.querySelector('#googleMailingOptCheckbox').checked;
      sounds.sparkle();
      
      // Prompt for email / name or use Google one-click guest
      const promptEmail = prompt('Enter your Google Account email (or press OK for instant Google Demo login):', 'teacher.mom.guest@gmail.com');
      if (promptEmail === null) return;

      const email = promptEmail.trim() || 'teacher.mom.guest@gmail.com';
      const nameGuess = email.split('@')[0].replace('.', ' ');
      const formattedName = nameGuess.charAt(0).toUpperCase() + nameGuess.slice(1);

      const result = resourceStore.loginWithGoogle({
        email: email,
        name: formattedName.includes('guest') ? 'Mrs. Sarah van Zyl' : formattedName,
        role: 'Foundation Phase Teacher, Cape Town',
        avatar: '👩‍🏫',
        mailingList: mailingOpt
      });

      this.handleAuthSuccess(result.user, 'Signed in with Google');
    });

    // Tab Switch Buttons
    container.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.pop(500);
        this.activeTab = e.currentTarget.dataset.tab;
        this.renderAuthForms(container);
      });
    });

    // Register Form Submit
    const regForm = container.querySelector('#customRegisterForm');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sounds.sparkle();

        const name = container.querySelector('#regName').value.trim();
        const role = container.querySelector('#regRole').value.trim();
        const email = container.querySelector('#regEmail').value.trim();
        const password = container.querySelector('#regPassword').value;
        const mailingOpt = container.querySelector('#regMailingOpt').checked;

        const res = resourceStore.registerCustomUser({
          name,
          role,
          email,
          password,
          mailingList: mailingOpt
        });

        if (!res.success) {
          sounds.pop(300);
          alert(`⚠️ ${res.error}`);
          return;
        }

        this.handleAuthSuccess(res.user, 'Account created successfully');
      });
    }

    // Login Form Submit
    const loginForm = container.querySelector('#customLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sounds.win();

        const email = container.querySelector('#loginEmail').value.trim();
        const password = container.querySelector('#loginPassword').value;

        const res = resourceStore.loginCustomUser(email, password);
        if (!res.success) {
          sounds.pop(300);
          alert(`⚠️ ${res.error}`);
          return;
        }

        this.handleAuthSuccess(res.user, 'Welcome back');
      });
    }
  }

  handleAuthSuccess(user, messagePrefix) {
    sounds.win();
    this.onMascotCheer(`Welcome ${user.name}! 🌸`);
    
    alert(`🎉 ${messagePrefix}! You are logged in as ${user.name} (${user.email}).`);

    const cb = this.pendingSuccessCallback;
    this.close();

    if (cb && typeof cb === 'function') {
      cb(user);
    }
  }
}
