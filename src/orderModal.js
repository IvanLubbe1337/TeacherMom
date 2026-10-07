// Order Reference & Invoice Modal for WhatsApp and Email Sales
import { sounds } from './audio.js';
import { resourceStore } from './resourceStore.js';

export class OrderModal {
  constructor(options = {}) {
    this.modalEl = null;
    this.currentOrder = null;
    this.onMascotCheer = options.onMascotCheer || (() => {});

    this.init();
  }

  init() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'order-modal-backdrop';
    this.modalEl.id = 'orderModalBackdrop';
    this.modalEl.innerHTML = `
      <div class="order-window">
        <!-- Window Top Header -->
        <div class="order-window-header">
          <div class="order-header-badge">
            <span class="badge-icon">🧾</span>
            <h3>Order & Invoice Reference</h3>
          </div>
          <button class="order-close-btn" id="closeOrderModalBtn" aria-label="Close order modal">✕</button>
        </div>

        <!-- Window Body -->
        <div class="order-window-body">
          
          <!-- Reference / Invoice Number Hero Banner -->
          <div class="invoice-hero-card">
            <div class="invoice-tag">Your Unique Payment Reference:</div>
            <div class="invoice-number-display">
              <span id="orderInvoiceNum">TM-2026-XXXX</span>
              <button class="copy-ref-btn" id="copyRefBtn" title="Copy reference to clipboard">
                📋 Copy Ref
              </button>
            </div>
            <p class="invoice-instruction">
              🔒 <strong>Resource Locked:</strong> Digital downloads are manually unlocked and sent immediately upon payment verification using this reference.
            </p>
          </div>

          <!-- Order Summary Details Grid -->
          <div class="order-resource-summary-card">
            <div class="res-summary-top">
              <h4 id="orderResourceTitle">Grade 1 Math Mania Workbook</h4>
              <span class="order-price-chip" id="orderResourcePrice">R85.00</span>
            </div>

            <div class="resource-metadata-pill-grid">
              <div class="meta-tag"><strong>Curriculum:</strong> <span id="orderMetaCurriculum">CAPS</span></div>
              <div class="meta-tag"><strong>Grade:</strong> <span id="orderMetaGrade">Grade 1</span></div>
              <div class="meta-tag"><strong>Subject:</strong> <span id="orderMetaSubject">Mathematics</span></div>
              <div class="meta-tag"><strong>Term:</strong> <span id="orderMetaTerm">Term 1</span></div>
              <div class="meta-tag"><strong>Year:</strong> <span id="orderMetaYear">2026</span></div>
              <div class="meta-tag locked-tag">🔒 Status: <span>Locked PDF</span></div>
            </div>
          </div>

          <!-- Customer Contact Details Form -->
          <form class="order-customer-form" id="orderCustomerForm" onsubmit="event.preventDefault();">
            <h5 class="form-title">Enter Your Contact Details:</h5>
            
            <div class="form-row-2">
              <div class="form-field">
                <label for="custName">Your Name & Surname: *</label>
                <input type="text" id="custName" placeholder="e.g. Rachel Jenkins" required />
              </div>
              <div class="form-field">
                <label for="custWhatsApp">WhatsApp / Cell Number: *</label>
                <input type="tel" id="custWhatsApp" placeholder="e.g. 082 123 4567" required />
              </div>
            </div>

            <div class="form-field">
              <label for="custEmail">Email Address (to receive digital files): *</label>
              <input type="email" id="custEmail" placeholder="e.g. rachel@school.co.za" required />
            </div>

            <div class="form-field">
              <label for="custNotes">Special Requests / School Notes (Optional):</label>
              <input type="text" id="custNotes" placeholder="e.g. Please include invoice with school vat number..." />
            </div>
          </form>

          <!-- Channel Selection Action Buttons -->
          <div class="order-channel-selection">
            <h5 class="channel-heading">Choose How to Send Your Order:</h5>
            <p class="channel-subtext">No card payments on website. Orders are verified and dispatched directly via WhatsApp or Email.</p>

            <div class="channel-buttons-grid">
              <button class="channel-action-btn btn-whatsapp" id="sendWhatsAppOrderBtn">
                <span class="channel-icon">💬</span>
                <div class="channel-text-wrap">
                  <strong>Send via WhatsApp Business</strong>
                  <span>Instant chat with Teacher Mom Roxy</span>
                </div>
                <span class="arrow-indicator">➜</span>
              </button>

              <button class="channel-action-btn btn-email" id="sendEmailOrderBtn">
                <span class="channel-icon">✉️</span>
                <div class="channel-text-wrap">
                  <strong>Send via Email</strong>
                  <span>Email directly to teachermomroxy3@gmail.com</span>
                </div>
                <span class="arrow-indicator">➜</span>
              </button>
            </div>
          </div>

          <div class="banking-notice-box">
            <strong>🏦 Payment Instructions:</strong>
            <p>EFT / Bank transfer or instant payment is required. Once you send your order, you will receive our banking details to make payment using your reference number above!</p>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    // Wire close & copy events
    this.modalEl.querySelector('#closeOrderModalBtn').addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    this.modalEl.querySelector('#copyRefBtn').addEventListener('click', () => {
      if (!this.currentOrder) return;
      navigator.clipboard.writeText(this.currentOrder.invoiceNum);
      sounds.sparkle();
      alert(`📋 Reference Number "${this.currentOrder.invoiceNum}" copied to clipboard!`);
    });

    this.modalEl.querySelector('#sendWhatsAppOrderBtn').addEventListener('click', () => this.dispatchWhatsApp());
    this.modalEl.querySelector('#sendEmailOrderBtn').addEventListener('click', () => this.dispatchEmail());
  }

  open(resourceOrCartItems) {
    sounds.boing();

    // Determine if it's a single resource or bundle/cart
    let isSingle = true;
    let resource = resourceOrCartItems;
    let itemsTitle = '';
    let totalPrice = 0;
    let currency = 'R';

    if (Array.isArray(resourceOrCartItems)) {
      isSingle = false;
      const count = resourceOrCartItems.reduce((acc, i) => acc + i.quantity, 0);
      itemsTitle = `${count} Resources Basket Pack`;
      totalPrice = resourceOrCartItems.reduce((acc, i) => acc + (i.resource.price * i.quantity), 0);
      resource = resourceOrCartItems[0].resource; // primary reference
    } else {
      itemsTitle = resource.title;
      totalPrice = resource.price;
      currency = resource.currency || 'R';
    }

    const invoiceNum = resourceStore.generateInvoiceNumber();

    this.currentOrder = {
      invoiceNum,
      resource,
      isSingle,
      rawItems: resourceOrCartItems,
      itemsTitle,
      totalPrice,
      currency
    };

    // Update DOM
    this.modalEl.querySelector('#orderInvoiceNum').textContent = invoiceNum;
    this.modalEl.querySelector('#orderResourceTitle').textContent = itemsTitle;
    this.modalEl.querySelector('#orderResourcePrice').textContent = `${currency}${totalPrice.toFixed(2)}`;

    this.modalEl.querySelector('#orderMetaCurriculum').textContent = resource.curriculum || 'CAPS';
    this.modalEl.querySelector('#orderMetaGrade').textContent = resource.grade || 'Grade 1';
    this.modalEl.querySelector('#orderMetaSubject').textContent = resource.subject || 'All Subjects';
    this.modalEl.querySelector('#orderMetaTerm').textContent = resource.term || 'Term 1';
    this.modalEl.querySelector('#orderMetaYear').textContent = resource.year || '2026';

    this.modalEl.classList.add('active');
  }

  close() {
    sounds.pop(400);
    this.modalEl.classList.remove('active');
  }

  validateForm() {
    const name = this.modalEl.querySelector('#custName').value.trim();
    const phone = this.modalEl.querySelector('#custWhatsApp').value.trim();
    const email = this.modalEl.querySelector('#custEmail').value.trim();

    if (!name || !phone || !email) {
      sounds.pop(300);
      alert('⚠️ Please fill in your Name, WhatsApp/Cell number, and Email address before proceeding.');
      return null;
    }

    const notes = this.modalEl.querySelector('#custNotes').value.trim();
    return { name, phone, email, notes };
  }

  formatMessageText(customer) {
    const { invoiceNum, itemsTitle, totalPrice, currency, resource } = this.currentOrder;
    
    return [
      `🌸 *NEW TEACHERMOM ORDER* 🌸`,
      `*Invoice / Payment Reference:* ${invoiceNum}`,
      `--------------------------------`,
      `*Resource:* ${itemsTitle}`,
      `*Curriculum:* ${resource.curriculum || 'CAPS'}`,
      `*Grade:* ${resource.grade || 'General'}`,
      `*Subject:* ${resource.subject || 'General'}`,
      `*Term & Year:* ${resource.term || 'Term 1'} (${resource.year || '2026'})`,
      `*Total Amount Due:* ${currency}${totalPrice.toFixed(2)}`,
      `*Status:* 🔒 Locked Digital Download`,
      `--------------------------------`,
      `*Customer Details:*`,
      `• Name: ${customer.name}`,
      `• WhatsApp: ${customer.phone}`,
      `• Email: ${customer.email}`,
      customer.notes ? `• Note: ${customer.notes}` : '',
      `--------------------------------`,
      `Hi Roxy! I would like to order this resource. Please provide the banking / payment details so I can transfer with reference *${invoiceNum}*. Thank you! ✨`
    ].filter(Boolean).join('\n');
  }

  dispatchWhatsApp() {
    const customer = this.validateForm();
    if (!customer) return;

    sounds.win();
    const settings = resourceStore.getSettings();
    let rawNumber = (settings.whatsappNumber || '0608316086').replace(/[^0-9]/g, '');
    if (rawNumber.startsWith('0')) {
      rawNumber = '27' + rawNumber.substring(1);
    }
    const message = this.formatMessageText(customer);
    const encoded = encodeURIComponent(message);

    const waUrl = `https://wa.me/${rawNumber}?text=${encoded}`;
    window.open(waUrl, '_blank');

    this.onMascotCheer(`Thank you ${customer.name}! Order #${this.currentOrder.invoiceNum} created for WhatsApp! 💖`);
    this.close();
  }

  dispatchEmail() {
    const customer = this.validateForm();
    if (!customer) return;

    sounds.win();
    const settings = resourceStore.getSettings();
    const adminEmail = settings.emailAddress || 'teachermomroxy3@gmail.com';
    const message = this.formatMessageText(customer);

    const subject = encodeURIComponent(`TeacherMom Order: ${this.currentOrder.invoiceNum} - ${this.currentOrder.itemsTitle}`);
    const body = encodeURIComponent(message);

    const mailtoUrl = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    // Copy to clipboard for convenience
    navigator.clipboard.writeText(message);
    alert(`✉️ Order email opened for ${adminEmail}! Your invoice text has also been copied to your clipboard.`);

    this.onMascotCheer(`Thank you ${customer.name}! Order #${this.currentOrder.invoiceNum} created for Email! 💌`);
    this.close();
  }
}
