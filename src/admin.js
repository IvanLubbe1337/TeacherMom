// Admin Panel for teachermomroxy3@gmail.com
// Provides secure login, new resource upload with sample previews, settings, and reviews moderation
import { sounds } from './audio.js';
import { resourceStore, AUTHORIZED_ADMIN_EMAIL } from './resourceStore.js';

export class AdminController {
  constructor(options = {}) {
    this.onResourceAdded = options.onResourceAdded || (() => {});
    this.modalEl = null;
    this.sampleImagesBase64 = [];

    this.init();
  }

  init() {
    this.createModalDom();
    this.wireTriggerButtons();
  }

  wireTriggerButtons() {
    const adminTrigger = document.getElementById('adminPortalBtn');
    if (adminTrigger) {
      adminTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    const adminNavBtn = document.getElementById('adminNavPill');
    if (adminNavBtn) {
      adminNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    const footerAdmin = document.getElementById('footerAdminLink');
    if (footerAdmin) {
      footerAdmin.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }
  }

  createModalDom() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'admin-modal-backdrop';
    this.modalEl.id = 'adminModalBackdrop';
    this.modalEl.innerHTML = `
      <div class="admin-window">
        <!-- Window Header -->
        <div class="admin-window-header">
          <div class="admin-header-title">
            <span class="admin-shield">🔐</span>
            <h3>TeacherMom Administration HQ</h3>
          </div>
          <button class="admin-close-btn" id="closeAdminModalBtn" aria-label="Close admin modal">✕</button>
        </div>

        <!-- Dynamic Container (Switches between Login & Dashboard) -->
        <div class="admin-window-body" id="adminDynamicContent">
          <!-- Populated by JS -->
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    this.modalEl.querySelector('#closeAdminModalBtn').addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });
  }

  open() {
    sounds.pop(600);
    this.render();
    this.modalEl.classList.add('active');
  }

  close() {
    sounds.pop(400);
    this.modalEl.classList.remove('active');
  }

  render() {
    const container = this.modalEl.querySelector('#adminDynamicContent');
    if (!container) return;

    if (!resourceStore.isAdminLoggedIn()) {
      this.renderLoginForm(container);
    } else {
      this.renderDashboard(container);
    }
  }

  // --- 1. LOGIN SCREEN ---
  renderLoginForm(container) {
    container.innerHTML = `
      <div class="admin-login-card">
        <div class="lock-avatar">👩‍🏫</div>
        <h4>Admin Access Portal</h4>
        <p class="login-sub">Authorized credentials required to manage resource catalog and orders.</p>

        <form class="admin-login-form" id="adminLoginForm">
          <div class="form-field">
            <label for="adminEmailInput">Administrator Email: *</label>
            <input 
              type="email" 
              id="adminEmailInput" 
              value="${AUTHORIZED_ADMIN_EMAIL}" 
              placeholder="teachermomroxy3@gmail.com" 
              required 
            />
            <small class="field-hint">Note: Restricted to <strong>${AUTHORIZED_ADMIN_EMAIL}</strong></small>
          </div>

          <div class="form-field">
            <label for="adminPasswordInput">Password / Passcode: *</label>
            <input 
              type="password" 
              id="adminPasswordInput" 
              placeholder="Enter your admin password" 
              value="teachermom2026"
              required 
            />
          </div>

          <div id="loginErrorMsg" class="login-error-alert" style="display: none;"></div>

          <button type="submit" class="bubble-pill-btn btn-mint full-width-btn">
            🔓 Log in to TeacherMom HQ
          </button>
        </form>
      </div>
    `;

    const form = container.querySelector('#adminLoginForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = container.querySelector('#adminEmailInput').value.trim();
      const pass = container.querySelector('#adminPasswordInput').value.trim();
      const errorBox = container.querySelector('#loginErrorMsg');

      const result = resourceStore.loginAdmin(email, pass);
      if (result.success) {
        sounds.win();
        this.renderDashboard(container);
      } else {
        sounds.pop(300);
        errorBox.textContent = result.error;
        errorBox.style.display = 'block';
      }
    });
  }

  // --- 2. DASHBOARD ---
  renderDashboard(container) {
    const settings = resourceStore.getSettings();
    const resources = resourceStore.getResources();
    const reviews = resourceStore.getReviews();
    const stats = resourceStore.getStats();
    const mailingList = resourceStore.getMailingList();
    const users = resourceStore.getUsers();
    this.sampleImagesBase64 = [];

    container.innerHTML = `
      <div class="admin-dashboard-layout">
        
        <!-- Top Bar info & Stats -->
        <div class="admin-dash-topbar">
          <div class="admin-user-badge">
            <span>🌸 Logged in: <strong>${AUTHORIZED_ADMIN_EMAIL}</strong></span>
          </div>
          <div class="admin-mini-stats-badges">
            <span class="m-stat" title="Total resources in store">📚 ${stats.resourcesCount} Resources</span>
            <span class="m-stat" title="Estimated happy educators">👩‍🏫 ${stats.happyTeachers} Teachers</span>
            <span class="m-stat" title="Average store rating">⭐ ${stats.averageRating} Rating</span>
            <span class="m-stat" title="VIP Subscribers">💌 ${mailingList.filter(m => m.optedIn).length} VIPs</span>
          </div>
          <button class="text-link-btn" id="adminLogoutBtn">Logout 🚪</button>
        </div>

        <!-- WhatsApp Business Configuration Card -->
        <div class="admin-settings-card">
          <div class="settings-title-row">
            <h5>📱 WhatsApp Business Dispatch Number</h5>
            <span class="settings-hint">Where orders & invoices are sent</span>
          </div>
          <div class="settings-inline-form">
            <input type="text" id="adminWaInput" value="${settings.whatsappNumber}" placeholder="0608316086" />
            <button class="bubble-pill-btn btn-peach" id="saveWaBtn">Save Number</button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="admin-tab-nav">
          <button class="admin-tab-btn active" data-tab="uploadTab">✨ Upload Resource</button>
          <button class="admin-tab-btn" data-tab="catalogTab">📚 Manage Catalog (${resources.length})</button>
          <button class="admin-tab-btn" data-tab="customTab">🎨 Custom School Requests (${resourceStore.getCustomRequests().length})</button>
          <button class="admin-tab-btn" data-tab="reviewsTab">💬 Reviews & Featured Quote (${reviews.length})</button>
          <button class="admin-tab-btn" data-tab="usersTab">👥 Users & Mailing List (${mailingList.length})</button>
        </div>

        <!-- Tab 1: Upload Form -->
        <div class="admin-tab-content active" id="uploadTab">
          <form class="resource-upload-form" id="newResourceForm">
            
            <div class="form-row-2">
              <div class="form-field">
                <label>Resource Title: *</label>
                <input type="text" id="resTitle" placeholder="e.g. Grade 1 Life Skills Workbook 🎨" required />
              </div>
              <div class="form-field">
                <label>Subtitle / Focus: *</label>
                <input type="text" id="resSubtitle" placeholder="e.g. Healthy Habits & Visual Perception" required />
              </div>
            </div>

            <!-- Resource Type, Audience & ATP Focus -->
            <div class="form-row-3">
              <div class="form-field">
                <label>Resource Type: *</label>
                <select id="resType" required>
                  <option value="Workbook" selected>📚 Workbook</option>
                  <option value="Assessment">📝 Assessment (FAT / Exam & Memo)</option>
                  <option value="Lesson Plan">📋 Lesson Plan (Weekly ATP Series)</option>
                  <option value="Teaching Guide">📖 Teaching Guide & Methodology</option>
                </select>
              </div>
              <div class="form-field">
                <label>Audience: *</label>
                <select id="resAudience" required>
                  <option value="Schools & Parents" selected>Schools & Parents</option>
                  <option value="Schools & Teachers">Schools & Teachers</option>
                  <option value="Parents & Homeschoolers">Parents & Homeschoolers</option>
                </select>
              </div>
              <div class="form-field">
                <label>DBE ATP Alignment / Reference: *</label>
                <input type="text" id="resAtpReference" placeholder="e.g. 2026 Term 1 CAPS ATP Week 1-10" value="DBE 2026 CAPS ATP Aligned" required />
              </div>
            </div>

            <div class="form-row-3">
              <div class="form-field">
                <label>Curriculum: *</label>
                <select id="resCurriculum" required>
                  <option value="CAPS" selected>CAPS (South Africa)</option>
                  <option value="Cambridge">Cambridge</option>
                  <option value="IEB">IEB</option>
                  <option value="Homeschool">Homeschool / General</option>
                </select>
              </div>

              <div class="form-field">
                <label>Subject: *</label>
                <select id="resSubject" required>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English (HL)" selected>English (Home Language)</option>
                  <option value="English (FAL)">English (First Additional)</option>
                  <option value="Afrikaans">Afrikaans</option>
                  <option value="Life Skills">Life Skills</option>
                  <option value="Natural Sciences">Natural Sciences & Tech</option>
                  <option value="Phonics & Spelling">Phonics & Spelling</option>
                  <option value="Creative Arts">Creative Arts</option>
                </select>
              </div>

              <div class="form-field">
                <label>Grade: *</label>
                <select id="resGrade" required>
                  <option value="Grade R">Grade R / Pre-K</option>
                  <option value="Grade 1" selected>Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Multi-Grade">Multi-Grade Bundle</option>
                </select>
              </div>
            </div>

            <div class="form-row-3">
              <div class="form-field">
                <label>Term: *</label>
                <select id="resTerm" required>
                  <option value="Term 1" selected>Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                  <option value="Term 4">Term 4</option>
                  <option value="Full Year">Full Year</option>
                </select>
              </div>

              <div class="form-field">
                <label>Year: *</label>
                <input type="text" id="resYear" value="2026" required />
              </div>

              <div class="form-field">
                <label>Price (ZAR / R): *</label>
                <input type="number" id="resPrice" step="0.50" min="0" value="85.00" required />
              </div>
            </div>

            <!-- Locked State Enforcement -->
            <div class="locked-status-banner">
              <label class="locked-checkbox-label">
                <input type="checkbox" id="resLocked" checked disabled />
                <span>🔒 <strong>Resource Locked:</strong> Customers can only preview sample images until payment is verified via WhatsApp/Email.</span>
              </label>
            </div>

            <!-- Upload Sample Images -->
            <div class="form-field">
              <label>Upload Sample Preview Images: *</label>
              <input type="file" id="sampleImagesInput" multiple accept="image/*" />
              <small class="field-hint">Upload 1 or more sample worksheet pages to display to buyers.</small>
              <div class="sample-images-preview-row" id="sampleImagesPreviewContainer"></div>
            </div>

            <div class="form-field">
              <label>Resource Description & What's Included:</label>
              <textarea id="resDesc" rows="3" placeholder="List activities, pages, format (PDF), and answers included..."></textarea>
            </div>

            <button type="submit" class="bubble-pill-btn btn-mint full-width-btn publish-btn">
              🚀 Publish Resource to TeacherMom Website
            </button>
          </form>
        </div>

        <!-- Tab 2: Current Catalog -->
        <div class="admin-tab-content" id="catalogTab">
          <div class="admin-catalog-list" id="adminCatalogList"></div>
        </div>

        <!-- Tab 3: Custom School & Parent Orders -->
        <div class="admin-tab-content" id="customTab">
          <div class="admin-custom-header">
            <h4>Bespoke Curriculum Customization Inquiries</h4>
            <p>School and parent requests with calculated turnaround times, pricing, and custom ATP specifications.</p>
          </div>
          <div class="admin-custom-requests-list" id="adminCustomRequestsList"></div>
        </div>

        <!-- Tab 4: Reviews & Featured Testimonial Quote Picker -->
        <div class="admin-tab-content" id="reviewsTab">
          
          <div class="featured-quote-preview-banner">
            <span class="preview-tag">⭐ CURRENTLY FEATURED QUOTE ON HOMEPAGE:</span>
            <div id="adminFeaturedQuoteBox"></div>
          </div>

          <!-- Add Manual Review Form -->
          <details class="add-manual-review-details">
            <summary class="add-review-summary">+ Add a New Teacher Review Manually</summary>
            <form class="manual-review-form" id="manualReviewForm">
              <div class="form-row-2">
                <div class="form-field">
                  <label>Teacher / Mom Name: *</label>
                  <input type="text" id="manRevAuthor" placeholder="e.g. Mrs. Susan Botes" required />
                </div>
                <div class="form-field">
                  <label>Role & City / School: *</label>
                  <input type="text" id="manRevRole" placeholder="e.g. Grade 1 Educator, Durban" required />
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-field">
                  <label>Resource Reviewed:</label>
                  <select id="manRevRes">
                    ${resources.map(r => `<option value="${r.id}">${r.title}</option>`).join('')}
                  </select>
                </div>
                <div class="form-field">
                  <label>Star Rating: *</label>
                  <select id="manRevStars">
                    <option value="5" selected>★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                  </select>
                </div>
              </div>

              <div class="form-field">
                <label>Review Quote: *</label>
                <textarea id="manRevText" rows="2" placeholder="Paste the feedback received on WhatsApp or email..." required></textarea>
              </div>

              <button type="submit" class="bubble-pill-btn btn-mint">Save Review & Add to List</button>
            </form>
          </details>

          <!-- List of Reviews -->
          <h5 class="all-reviews-heading">All Teacher Reviews (Pick which one appears on the site):</h5>
          <div class="admin-reviews-list" id="adminReviewsList"></div>

        </div>

        <!-- Tab 4: Users & VIP Mailing List -->
        <div class="admin-tab-content" id="usersTab">
          <div class="mailing-list-admin-top">
            <div class="mailing-stats-summary">
              <span class="m-stat-pill">👥 <strong>${users.length}</strong> Registered Accounts</span>
              <span class="m-stat-pill subscribed-pill">💌 <strong>${mailingList.filter(m => m.optedIn).length}</strong> Active Subscribers (Opted In)</span>
              <span class="m-stat-pill optedout-pill">🔕 <strong>${mailingList.filter(m => !m.optedIn).length}</strong> Opted Out</span>
            </div>
            <button class="bubble-pill-btn btn-mint copy-emails-btn" id="copySubscribersEmailsBtn">
              📋 Copy Active Emails
            </button>
          </div>

          <h5 class="all-reviews-heading">TeacherMom VIP Mailing List & Registered Accounts Directory:</h5>
          <div class="admin-users-list" id="adminUsersList"></div>
        </div>

      </div>
    `;

    // Logout
    container.querySelector('#adminLogoutBtn').addEventListener('click', () => {
      sounds.pop(400);
      resourceStore.logoutAdmin();
      this.renderLoginForm(container);
    });

    // Save WhatsApp number
    container.querySelector('#saveWaBtn').addEventListener('click', () => {
      const val = container.querySelector('#adminWaInput').value.trim();
      const current = resourceStore.getSettings();
      resourceStore.saveSettings({ ...current, whatsappNumber: val });
      sounds.sparkle();
      alert(`✅ WhatsApp Business number updated to: ${val}`);
    });

    // Tab Switching
    const tabs = container.querySelectorAll('.admin-tab-btn');
    const tabPanels = container.querySelectorAll('.admin-tab-content');
    tabs.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.pop(500);
        const target = e.currentTarget.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const activePanel = container.querySelector(`#${target}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });

    // Sample Images File Reader
    const fileInput = container.querySelector('#sampleImagesInput');
    const previewContainer = container.querySelector('#sampleImagesPreviewContainer');
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      this.sampleImagesBase64 = [];
      previewContainer.innerHTML = '';

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const base64 = ev.target.result;
          this.sampleImagesBase64.push(base64);

          const thumb = document.createElement('div');
          thumb.className = 'sample-thumb-item';
          thumb.innerHTML = `<img src="${base64}" alt="Sample preview" />`;
          previewContainer.appendChild(thumb);
        };
        reader.readAsDataURL(file);
      });
    });

    // Submit New Resource
    const newForm = container.querySelector('#newResourceForm');
    newForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sounds.win();

      const gradeVal = container.querySelector('#resGrade').value;
      let gradeTag = '1st';
      if (gradeVal.includes('R')) gradeTag = 'pre-k';
      else if (gradeVal.includes('2')) gradeTag = '2nd';
      else if (gradeVal.includes('3')) gradeTag = '3rd';

      const newResource = {
        title: container.querySelector('#resTitle').value.trim(),
        subtitle: container.querySelector('#resSubtitle').value.trim(),
        resourceType: container.querySelector('#resType').value,
        audience: container.querySelector('#resAudience').value,
        curriculum: container.querySelector('#resCurriculum').value,
        subject: container.querySelector('#resSubject').value,
        grade: gradeVal,
        gradeTag: gradeTag,
        atpAligned: true,
        atpReference: container.querySelector('#resAtpReference').value.trim() || 'DBE 2026 CAPS ATP Aligned',
        term: container.querySelector('#resTerm').value,
        year: container.querySelector('#resYear').value.trim() || '2026',
        price: parseFloat(container.querySelector('#resPrice').value) || 85.00,
        currency: 'R',
        locked: true,
        rating: 5.0,
        reviews: 1,
        description: container.querySelector('#resDesc').value.trim() || 'Printable classroom and homeschool resource pack.',
        sampleImages: this.sampleImagesBase64.length > 0 ? this.sampleImagesBase64 : [
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'
        ]
      };

      resourceStore.addResource(newResource);
      this.onResourceAdded(newResource);

      alert(`🎉 Woohoo! "${newResource.title}" has been published to the TeacherMom website!`);
      this.renderDashboard(container);
    });

    // Manual Review Form
    const manRevForm = container.querySelector('#manualReviewForm');
    if (manRevForm) {
      manRevForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sounds.sparkle();
        const author = container.querySelector('#manRevAuthor').value.trim();
        const role = container.querySelector('#manRevRole').value.trim();
        const resId = container.querySelector('#manRevRes').value;
        const resObj = resources.find(r => r.id === resId);
        const stars = parseInt(container.querySelector('#manRevStars').value, 10);
        const text = container.querySelector('#manRevText').value.trim();

        resourceStore.addReview({
          resourceId: resId,
          resourceTitle: resObj ? resObj.title : 'Educational Resource',
          author,
          role,
          rating: stars,
          text,
          date: new Date().toISOString().split('T')[0]
        });

        alert(`✅ Review from "${author}" added! You can now feature it on the website anytime.`);
        this.renderDashboard(container);
      });
    }

    // Render Current Catalog Tab
    this.renderCatalogList(container.querySelector('#adminCatalogList'));

    // Render Custom Requests Tab
    this.renderCustomRequestsList(container);

    // Render Reviews Tab
    this.renderReviewsList(container);

    // Render Users & Mailing List Tab
    this.renderUsersList(container);
  }

  renderCatalogList(listContainer) {
    if (!listContainer) return;
    const resources = resourceStore.getResources();

    listContainer.innerHTML = resources.map(res => `
      <div class="admin-catalog-row">
        <div class="cat-details">
          <span class="cat-title">${res.title}</span>
          <div class="cat-badges">
            <span class="c-badge cur">${res.curriculum || 'CAPS'}</span>
            <span class="c-badge gr">${res.grade}</span>
            <span class="c-badge sub">${res.subject || 'Subject'}</span>
            <span class="c-badge term">${res.term || 'Term 1'} (${res.year || '2026'})</span>
            <span class="c-badge locked">🔒 Locked</span>
            <span class="c-badge rating">⭐ ${res.rating} (${res.reviews} ratings)</span>
            <strong class="c-price">${res.currency || 'R'}${parseFloat(res.price).toFixed(2)}</strong>
          </div>
        </div>
        <button class="delete-res-btn" data-id="${res.id}" title="Remove resource">🗑️ Delete</button>
      </div>
    `).join('');

    listContainer.querySelectorAll('.delete-res-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Are you sure you want to remove this resource from the catalog?')) {
          sounds.pop(350);
          resourceStore.deleteResource(id);
          this.renderCatalogList(listContainer);
        }
      });
    });
  }

  renderCustomRequestsList(container) {
    const listContainer = container.querySelector('#adminCustomRequestsList');
    if (!listContainer) return;

    const requests = resourceStore.getCustomRequests();
    if (requests.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-admin-list">
          <p>No custom inquiries yet. Requests from schools and parents will appear here automatically!</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = requests.map(req => {
      const statusColors = {
        'Pending Review': '#FFA726',
        'In Progress': '#42A5F5',
        'Ready for Review': '#AB47BC',
        'Completed': '#66BB6A'
      };
      const currentColor = statusColors[req.status] || '#78909C';

      return `
        <div class="admin-custom-req-card" data-id="${req.id}">
          <div class="req-top-row">
            <div class="req-ref-box">
              <span class="req-ref-tag">${req.refNumber}</span>
              <span class="req-date-tag">📅 ${req.date || '2026'}</span>
            </div>
            <div class="req-status-box">
              <select class="req-status-select" data-id="${req.id}" style="border-color: ${currentColor}; color: ${currentColor}">
                <option value="Pending Review" ${req.status === 'Pending Review' ? 'selected' : ''}>⏳ Pending Review</option>
                <option value="In Progress" ${req.status === 'In Progress' ? 'selected' : ''}>🛠️ In Progress</option>
                <option value="Ready for Review" ${req.status === 'Ready for Review' ? 'selected' : ''}>📋 Ready for Review</option>
                <option value="Completed" ${req.status === 'Completed' ? 'selected' : ''}>✅ Completed</option>
              </select>
            </div>
          </div>

          <div class="req-customer-details">
            <h5 class="req-cust-name">${req.name} <span class="req-cust-role">(${req.role || 'Educator'})</span></h5>
            <div class="req-school-tag">🏫 ${req.school || 'Private Inquiry'}</div>
            <div class="req-contact-row">
              <span>📱 <strong>${req.phone}</strong></span>
              <span>✉️ <strong>${req.email}</strong></span>
            </div>
          </div>

          <div class="req-resource-specs-grid">
            <div class="spec-pill"><strong>Type:</strong> ${req.resourceType || 'Workbook'}</div>
            <div class="spec-pill"><strong>Curriculum:</strong> ${req.curriculum || 'CAPS'}</div>
            <div class="spec-pill"><strong>Grade:</strong> ${req.grade || 'Grade 1'}</div>
            <div class="spec-pill"><strong>Subject:</strong> ${req.subject || 'All Subjects'}</div>
            <div class="spec-pill urgency-pill"><strong>Turnaround:</strong> ${req.turnaround || '5-7 days'}</div>
            <div class="spec-pill price-pill"><strong>Est. Quote:</strong> R${parseFloat(req.estimatedCost || 220).toFixed(2)}</div>
          </div>

          <div class="req-notes-quote-box">
            <span class="notes-lbl">Customization Brief / ATP Requirements:</span>
            <p class="notes-text">"${req.notes || 'No specific notes provided.'}"</p>
          </div>

          <div class="req-actions-bar">
            <a href="https://wa.me/${(req.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${req.name}! Roxy here from TeacherMom regarding your custom resource request (${req.refNumber}).`)}" target="_blank" class="bubble-pill-btn btn-sm btn-whatsapp-direct">
              💬 WhatsApp Customer
            </a>
            <a href="mailto:${req.email}?subject=${encodeURIComponent(`TeacherMom Custom Quote: ${req.refNumber}`)}" class="bubble-pill-btn btn-sm btn-email-direct">
              ✉️ Email Customer
            </a>
            <button class="delete-req-btn text-link-btn" data-id="${req.id}">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Wire status changer
    listContainer.querySelectorAll('.req-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        sounds.pop(600);
        const id = e.currentTarget.dataset.id;
        const newStatus = e.currentTarget.value;
        resourceStore.updateCustomRequestStatus(id, newStatus);
        this.renderCustomRequestsList(container);
      });
    });

    // Wire delete
    listContainer.querySelectorAll('.delete-req-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Delete this custom inquiry?')) {
          sounds.pop(350);
          resourceStore.deleteCustomRequest(id);
          this.renderCustomRequestsList(container);
        }
      });
    });
  }

  renderReviewsList(container) {
    const listContainer = container.querySelector('#adminReviewsList');
    const featuredBox = container.querySelector('#adminFeaturedQuoteBox');
    if (!listContainer || !featuredBox) return;

    const reviews = resourceStore.getReviews();
    const featured = resourceStore.getFeaturedReview();

    if (featured) {
      featuredBox.innerHTML = `
        <div class="active-featured-quote-card">
          <div class="f-stars">★★★★★</div>
          <blockquote class="f-text">"${featured.text}"</blockquote>
          <div class="f-author-row">
            <strong>${featured.author}</strong> - <span>${featured.role}</span>
          </div>
        </div>
      `;
    }

    listContainer.innerHTML = reviews.map(rev => {
      const isFeatured = rev.featured === true;
      return `
        <div class="admin-review-item ${isFeatured ? 'is-featured-border' : ''}">
          <div class="rev-item-top">
            <div class="rev-author-details">
              <strong>${rev.author}</strong> (${rev.role})
              <span class="rev-res-tag">Resource: ${rev.resourceTitle || 'Printable Pack'}</span>
              ${rev.provider ? `<span class="auth-provider-chip">✓ ${rev.provider === 'google' ? 'Google' : 'Member'}</span>` : ''}
            </div>
            <div class="rev-stars-date">
              <span class="gold-stars">★`.repeat(rev.rating) + `</span>
              <span class="rev-date">${rev.date}</span>
            </div>
          </div>
          <p class="rev-item-text">"${rev.text}"</p>
          <div class="rev-actions-bar">
            ${isFeatured ? `
              <span class="featured-badge-live">✨ CURRENTLY DISPLAYED ON WEBSITE</span>
            ` : `
              <button class="bubble-pill-btn btn-mint make-featured-btn" data-id="${rev.id}">
                ⭐ Feature as Main Website Quote
              </button>
            `}
            <button class="delete-review-link" data-id="${rev.id}">Delete</button>
          </div>
        </div>
      `;
    }).join('');

    listContainer.querySelectorAll('.make-featured-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.win();
        const id = e.currentTarget.dataset.id;
        resourceStore.setFeaturedReview(id);
        this.renderReviewsList(container);
        alert('🎉 Featured website quote updated! Check the About Us section to see it live.');
      });
    });

    listContainer.querySelectorAll('.delete-review-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Delete this review?')) {
          sounds.pop(350);
          resourceStore.deleteReview(id);
          this.renderReviewsList(container);
        }
      });
    });
  }

  renderUsersList(container) {
    const listContainer = container.querySelector('#adminUsersList');
    const copyBtn = container.querySelector('#copySubscribersEmailsBtn');
    if (!listContainer) return;

    const mailingList = resourceStore.getMailingList();
    const users = resourceStore.getUsers();

    // Wire Copy Emails Button
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const activeEmails = mailingList.filter(m => m.optedIn).map(m => m.email);
        if (activeEmails.length === 0) {
          alert('No active subscribers to copy.');
          return;
        }
        navigator.clipboard.writeText(activeEmails.join(', ')).then(() => {
          sounds.win();
          alert(`📋 Copied ${activeEmails.length} subscriber email(s) to clipboard!`);
        }).catch(() => {
          prompt('Active Subscriber Emails:', activeEmails.join(', '));
        });
      });
    }

    // Merge users & mailing list entries
    const directoryMap = new Map();
    users.forEach(u => {
      directoryMap.set(u.email.toLowerCase(), {
        name: u.name,
        email: u.email,
        role: u.role,
        provider: u.provider,
        optedIn: u.mailingList !== false,
        date: u.createdAt ? u.createdAt.split('T')[0] : '2026-03-01'
      });
    });

    mailingList.forEach(m => {
      const key = m.email.toLowerCase();
      if (directoryMap.has(key)) {
        const existing = directoryMap.get(key);
        existing.optedIn = m.optedIn === true;
      } else {
        directoryMap.set(key, {
          name: m.name || 'Newsletter Subscriber',
          email: m.email,
          role: m.role || 'Educator / Parent',
          provider: 'newsletter',
          optedIn: m.optedIn === true,
          date: m.date || '2026-04-01'
        });
      }
    });

    const directory = Array.from(directoryMap.values());

    listContainer.innerHTML = directory.map(item => `
      <div class="admin-user-row ${item.optedIn ? 'is-subscribed' : 'is-opted-out'}">
        <div class="user-row-meta">
          <div class="user-row-name-bar">
            <strong>${item.name}</strong>
            <span class="user-row-provider-tag">${item.provider === 'google' ? 'Google Auth' : item.provider === 'custom' ? 'Custom Account' : 'Newsletter Signup'}</span>
          </div>
          <span class="user-row-email">${item.email}</span>
          <span class="user-row-role">🏫 ${item.role}</span>
        </div>
        <div class="user-row-status-box">
          <span class="mailing-badge ${item.optedIn ? 'badge-in' : 'badge-out'}">
            ${item.optedIn ? '💌 Subscribed (Opted In)' : '🔕 Opted Out'}
          </span>
          <button class="bubble-pill-btn btn-sm-toggle toggle-user-mail-btn" data-email="${item.email}" data-status="${item.optedIn}">
            ${item.optedIn ? 'Opt Out' : 'Opt In'}
          </button>
        </div>
      </div>
    `).join('');

    listContainer.querySelectorAll('.toggle-user-mail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.pop(500);
        const email = e.currentTarget.dataset.email;
        const currentOptedIn = e.currentTarget.dataset.status === 'true';
        const newStatus = !currentOptedIn;
        resourceStore.setMailingListStatus(email, newStatus);
        this.renderUsersList(container);
      });
    });
  }
}
