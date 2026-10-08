// Custom Curriculum & Resource Request Modal for Schools and Parents
// Handles bespoke orders (workbooks, assessments, lesson plans, teaching guides)
// with dynamic cost and fulfillment turnaround estimates.
import { sounds } from './audio.js';
import { resourceStore } from './resourceStore.js';

export class CustomRequestModal {
  constructor(options = {}) {
    this.modalEl = null;
    this.onMascotCheer = options.onMascotCheer || (() => {});
    this.currentQuote = null;

    this.pricingMatrix = {
      'Workbook': { basePrice: 220, standardDays: '5–7 business days', priorityDays: '2–3 business days' },
      'Assessment': { basePrice: 260, standardDays: '4–6 business days', priorityDays: '2–3 business days' },
      'Lesson Plan': { basePrice: 190, standardDays: '3–5 business days', priorityDays: '2 business days' },
      'Teaching Guide': { basePrice: 240, standardDays: '5–7 business days', priorityDays: '3 business days' },
      'Complete Bundle': { basePrice: 550, standardDays: '7–10 business days', priorityDays: '4–5 business days' }
    };

    this.init();
  }

  init() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'custom-request-backdrop';
    this.modalEl.id = 'customRequestModalBackdrop';
    this.modalEl.innerHTML = `
      <div class="custom-request-window">
        <!-- Header -->
        <div class="custom-request-header">
          <div class="header-title-box">
            <span class="custom-sparkle-icon">✨</span>
            <div>
              <h3>Bespoke Curriculum Customization</h3>
              <p>Tailored educational resources for schools, educators and parents</p>
            </div>
          </div>
          <button class="custom-close-btn" id="closeCustomModalBtn" aria-label="Close modal">✕</button>
        </div>

        <!-- Body -->
        <div class="custom-request-body">
          
          <!-- Transparency Banner on Cost & Turnaround -->
          <div class="custom-notice-banner">
            <div class="notice-icon-box">⏱️ 💡</div>
            <div class="notice-content">
              <strong>Custom Craftsmanship Notice:</strong>
              <p>
                Custom resources require dedicated curriculum planning, alignment to your specific ATP schedule, and high-res layout design.
                <strong>Customization involves an adjusted investment and takes 3 to 7 business days to fulfill.</strong>
              </p>
            </div>
          </div>

          <!-- Interactive Request & Quote Form -->
          <form class="custom-form" id="customOrderForm" onsubmit="event.preventDefault();">
            
            <!-- Requester Segment Selector -->
            <div class="form-segment-row">
              <label class="segment-label">I am requesting for:</label>
              <div class="segment-pills-group">
                <button type="button" class="segment-pill active" data-type="school">
                  🏫 School / Educator
                </button>
                <button type="button" class="segment-pill" data-type="parent">
                  🏡 Parent / Homeschooler
                </button>
              </div>
            </div>

            <!-- Contact Fields -->
            <div class="form-row-2">
              <div class="form-field">
                <label for="custReqName">Your Name & Surname: *</label>
                <input type="text" id="custReqName" placeholder="e.g. Mrs. Mariette Smith" required />
              </div>
              <div class="form-field" id="custSchoolFieldWrap">
                <label for="custReqSchool">School / Organization Name: <span class="opt-tag">(Optional)</span></label>
                <input type="text" id="custReqSchool" placeholder="e.g. Sunnyridge Primary School" />
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-field">
                <label for="custReqPhone">WhatsApp / Mobile Number: *</label>
                <input type="tel" id="custReqPhone" placeholder="e.g. 082 123 4567" required />
              </div>
              <div class="form-field">
                <label for="custReqEmail">Email Address: *</label>
                <input type="email" id="custReqEmail" placeholder="e.g. mariette@school.co.za" required />
              </div>
            </div>

            <!-- Resource Type & Curriculum Selection -->
            <div class="form-row-2">
              <div class="form-field">
                <label for="custReqType">Resource Type Needed: *</label>
                <select id="custReqType" class="custom-select">
                  <option value="Workbook">📚 Custom Workbook (Full Term / Practice Mats)</option>
                  <option value="Assessment">📝 Formal Assessment Task (FAT) & Marking Memo</option>
                  <option value="Lesson Plan">📋 Lesson Plan Series (Weekly ATP Breakdown)</option>
                  <option value="Teaching Guide">📖 Educator Facilitation Guide & Remedial Strategies</option>
                  <option value="Complete Bundle">🎒 Complete Grade Package (All 4 Core Resources)</option>
                </select>
              </div>
              <div class="form-field">
                <label for="custReqCurriculum">Curriculum Framework: *</label>
                <select id="custReqCurriculum" class="custom-select">
                  <option value="CAPS">CAPS (DBE ATP-Aligned 🇿🇦)</option>
                  <option value="Cambridge Primary">Cambridge Primary Stage 1-3 🦁</option>
                  <option value="IEB">IEB Independent Curriculum 🎓</option>
                  <option value="Custom Syllabus">Custom School / Homeschool Syllabus 🎨</option>
                </select>
              </div>
            </div>

            <!-- Grade & Subject -->
            <div class="form-row-2">
              <div class="form-field">
                <label for="custReqGrade">Grade Level: *</label>
                <select id="custReqGrade" class="custom-select">
                  <option value="Grade R">Grade R (Foundation Readiness / Pre-K)</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Grade 1" selected>Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Multi-Grade">Multi-Grade / Foundation Phase</option>
                </select>
              </div>
              <div class="form-field">
                <label for="custReqSubject">Subject / Learning Area: *</label>
                <select id="custReqSubject" class="custom-select">
                  <option value="English (HL)">English Home Language (Phonics & Reading)</option>
                  <option value="Mathematics">Mathematics & Numeracy</option>
                  <option value="Life Skills">Life Skills (Beginning Knowledge & Arts)</option>
                  <option value="Afrikaans (FAL)">Afrikaans Eerste Addisionele Taal</option>
                  <option value="Integrated All Subjects">Integrated (All Foundation Subjects)</option>
                </select>
              </div>
            </div>

            <!-- Turnaround Urgency -->
            <div class="form-field">
              <label>Turnaround & Fulfillment Window: *</label>
              <div class="turnaround-options-grid">
                <label class="turnaround-radio active">
                  <input type="radio" name="custUrgency" value="standard" checked />
                  <div class="radio-card-content">
                    <span class="radio-title">🌿 Standard Delivery</span>
                    <span class="radio-desc" id="standardDaysLabel">5–7 business days</span>
                    <span class="radio-badge">Standard Rate</span>
                  </div>
                </label>
                <label class="turnaround-radio">
                  <input type="radio" name="custUrgency" value="priority" />
                  <div class="radio-card-content">
                    <span class="radio-title">⚡ Priority Expedited</span>
                    <span class="radio-desc" id="priorityDaysLabel">2–3 business days</span>
                    <span class="radio-badge priority">+25% Urgency</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Specific Requirements & ATP Customization Notes -->
            <div class="form-field">
              <label for="custReqNotes">Customization Instructions & ATP Guidelines: *</label>
              <textarea 
                id="custReqNotes" 
                rows="3" 
                placeholder="Describe your requirements: e.g. 'We need Term 2 Math assessment paper with 35 marks weighting, including school crest, and aligned to Week 4-6 DBE ATP topics. Include memorandum in PDF and editable format.'" 
                required
              ></textarea>
            </div>

            <!-- Live Quote Calculation Bar -->
            <div class="custom-quote-summary-card">
              <div class="quote-header-row">
                <div class="quote-ref-badge">
                  <span>Reference:</span>
                  <strong id="custQuoteRefCode">TM-CUST-2026-XXXX</strong>
                </div>
                <div class="quote-turnaround-badge">
                  <span>Fulfillment Time:</span>
                  <strong id="custQuoteTimeframe">5–7 business days</strong>
                </div>
              </div>

              <div class="quote-price-row">
                <div class="quote-price-detail">
                  <span class="price-label">Estimated Custom Investment:</span>
                  <span class="price-hint">Includes design, pedagogical alignment & proof review</span>
                </div>
                <div class="quote-amount-display" id="custQuoteAmount">
                  R220.00
                </div>
              </div>
            </div>

            <!-- Channel Submission Buttons -->
            <div class="custom-actions-grid">
              <button type="button" class="channel-action-btn btn-whatsapp" id="custSubmitWhatsAppBtn">
                <span class="channel-icon">💬</span>
                <div class="channel-text-wrap">
                  <strong>Send Custom Request via WhatsApp</strong>
                  <span>Instant consultation with Roxy</span>
                </div>
                <span class="arrow-indicator">➜</span>
              </button>

              <button type="button" class="channel-action-btn btn-email" id="custSubmitEmailBtn">
                <span class="channel-icon">✉️</span>
                <div class="channel-text-wrap">
                  <strong>Submit Request via Email</strong>
                  <span>Direct quote confirmation to your inbox</span>
                </div>
                <span class="arrow-indicator">➜</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    this.wireEvents();
  }

  wireEvents() {
    this.modalEl.querySelector('#closeCustomModalBtn').addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // Segment pills (School vs Parent)
    const pills = this.modalEl.querySelectorAll('.segment-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        sounds.pop(550);
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const isSchool = pill.dataset.type === 'school';
        const schoolWrap = this.modalEl.querySelector('#custSchoolFieldWrap');
        if (schoolWrap) {
          schoolWrap.style.display = isSchool ? 'block' : 'none';
        }
        this.recalculateQuote();
      });
    });

    // Selects and Radio changes
    const typeSelect = this.modalEl.querySelector('#custReqType');
    const urgencyRadios = this.modalEl.querySelectorAll('input[name="custUrgency"]');

    if (typeSelect) {
      typeSelect.addEventListener('change', () => {
        sounds.pop(600);
        this.updateTimeLabels();
        this.recalculateQuote();
      });
    }

    urgencyRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        sounds.pop(650);
        this.modalEl.querySelectorAll('.turnaround-radio').forEach(lbl => lbl.classList.remove('active'));
        radio.closest('.turnaround-radio').classList.add('active');
        this.recalculateQuote();
      });
    });

    // Submit actions
    this.modalEl.querySelector('#custSubmitWhatsAppBtn').addEventListener('click', () => this.dispatch('whatsapp'));
    this.modalEl.querySelector('#custSubmitEmailBtn').addEventListener('click', () => this.dispatch('email'));
  }

  updateTimeLabels() {
    const type = this.modalEl.querySelector('#custReqType').value;
    const config = this.pricingMatrix[type] || this.pricingMatrix['Workbook'];
    const stdLbl = this.modalEl.querySelector('#standardDaysLabel');
    const priLbl = this.modalEl.querySelector('#priorityDaysLabel');
    if (stdLbl) stdLbl.textContent = config.standardDays;
    if (priLbl) priLbl.textContent = config.priorityDays;
  }

  recalculateQuote() {
    const type = this.modalEl.querySelector('#custReqType').value;
    const urgency = this.modalEl.querySelector('input[name="custUrgency"]:checked')?.value || 'standard';
    const config = this.pricingMatrix[type] || this.pricingMatrix['Workbook'];

    let base = config.basePrice;
    let timeframe = config.standardDays;

    if (urgency === 'priority') {
      base = Math.round(base * 1.25);
      timeframe = config.priorityDays;
    }

    const amountEl = this.modalEl.querySelector('#custQuoteAmount');
    const timeEl = this.modalEl.querySelector('#custQuoteTimeframe');

    if (amountEl) amountEl.textContent = `R${base.toFixed(2)}`;
    if (timeEl) timeEl.textContent = timeframe;

    this.currentQuote = {
      price: base,
      timeframe: timeframe,
      urgency: urgency
    };
  }

  open(prefill = null) {
    sounds.boing();
    const refCode = `TM-CUST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    this.modalEl.querySelector('#custQuoteRefCode').textContent = refCode;

    // Apply prefill if triggered from a specific resource card
    if (prefill) {
      if (prefill.resourceType) {
        const typeSelect = this.modalEl.querySelector('#custReqType');
        if (typeSelect) {
          const match = Array.from(typeSelect.options).find(opt => opt.value.toLowerCase() === prefill.resourceType.toLowerCase());
          if (match) typeSelect.value = match.value;
        }
      }
      if (prefill.curriculum) {
        const curSelect = this.modalEl.querySelector('#custReqCurriculum');
        if (curSelect) {
          const match = Array.from(curSelect.options).find(opt => opt.value.toLowerCase().includes(prefill.curriculum.toLowerCase()));
          if (match) curSelect.value = match.value;
        }
      }
      if (prefill.grade) {
        const grSelect = this.modalEl.querySelector('#custReqGrade');
        if (grSelect) {
          const match = Array.from(grSelect.options).find(opt => opt.value.toLowerCase() === prefill.grade.toLowerCase());
          if (match) grSelect.value = match.value;
        }
      }
      if (prefill.subject) {
        const subSelect = this.modalEl.querySelector('#custReqSubject');
        if (subSelect) {
          const match = Array.from(subSelect.options).find(opt => opt.value.toLowerCase().includes(prefill.subject.toLowerCase()));
          if (match) subSelect.value = match.value;
        }
      }
      if (prefill.title) {
        const notes = this.modalEl.querySelector('#custReqNotes');
        if (notes && !notes.value) {
          notes.value = `Custom adaptation based on: "${prefill.title}". We would like this modified to align with our school's specific term pace and learner requirements.`;
        }
      }
    }

    // Pre-fill user details if logged in
    const currentUser = resourceStore.getCurrentUser();
    if (currentUser) {
      const nameInput = this.modalEl.querySelector('#custReqName');
      const emailInput = this.modalEl.querySelector('#custReqEmail');
      if (nameInput && !nameInput.value) nameInput.value = currentUser.name || '';
      if (emailInput && !emailInput.value) emailInput.value = currentUser.email || '';
    }

    this.updateTimeLabels();
    this.recalculateQuote();
    this.modalEl.classList.add('active');
  }

  close() {
    sounds.pop(400);
    this.modalEl.classList.remove('active');
  }

  validate() {
    const name = this.modalEl.querySelector('#custReqName').value.trim();
    const phone = this.modalEl.querySelector('#custReqPhone').value.trim();
    const email = this.modalEl.querySelector('#custReqEmail').value.trim();
    const notes = this.modalEl.querySelector('#custReqNotes').value.trim();

    if (!name || !phone || !email || !notes) {
      sounds.pop(300);
      alert('⚠️ Please provide your Name, WhatsApp/Phone, Email, and specific Customization Instructions to submit your request.');
      return null;
    }

    const activePill = this.modalEl.querySelector('.segment-pill.active');
    const segment = activePill ? activePill.dataset.type : 'school';
    const school = this.modalEl.querySelector('#custReqSchool')?.value.trim() || (segment === 'school' ? 'Local School' : 'Independent Homeschool');
    const type = this.modalEl.querySelector('#custReqType').value;
    const curriculum = this.modalEl.querySelector('#custReqCurriculum').value;
    const grade = this.modalEl.querySelector('#custReqGrade').value;
    const subject = this.modalEl.querySelector('#custReqSubject').value;
    const refCode = this.modalEl.querySelector('#custQuoteRefCode').textContent;

    return {
      name,
      phone,
      email,
      segment,
      school,
      type,
      curriculum,
      grade,
      subject,
      notes,
      refCode,
      quote: this.currentQuote || { price: 220, timeframe: '5–7 business days', urgency: 'standard' }
    };
  }

  formatBriefMessage(data) {
    return [
      `🌟 *TEACHERMOM BESPOKE RESOURCE REQUEST* 🌟`,
      `*Custom Inquiry Ref:* ${data.refCode}`,
      `--------------------------------`,
      `*Requester Category:* ${data.segment === 'school' ? '🏫 School / Educator' : '🏡 Parent / Homeschooler'}`,
      `*Name:* ${data.name}`,
      `*School / Family:* ${data.school}`,
      `*WhatsApp:* ${data.phone}`,
      `*Email:* ${data.email}`,
      `--------------------------------`,
      `*Resource Specifications:*`,
      `• Type: ${data.type}`,
      `• Curriculum: ${data.curriculum}`,
      `• Grade: ${data.grade}`,
      `• Subject: ${data.subject}`,
      `• Turnaround Urgency: ${data.quote.urgency.toUpperCase()} (${data.quote.timeframe})`,
      `• Estimated Investment: R${data.quote.price.toFixed(2)}`,
      `--------------------------------`,
      `*Custom Requirements & ATP Notes:*`,
      `"${data.notes}"`,
      `--------------------------------`,
      `Hi Roxy! I would like a tailored quote and consultation for this bespoke educational resource. Please let me know the confirmation details under ref *${data.refCode}*. Thank you! ✨`
    ].join('\n');
  }

  dispatch(channel) {
    const data = this.validate();
    if (!data) return;

    sounds.win();

    // 1. Record custom request in store
    resourceStore.addCustomRequest({
      refNumber: data.refCode,
      name: data.name,
      role: data.segment === 'school' ? 'School Educator / Administrator' : 'Homeschooling Parent',
      school: data.school,
      email: data.email,
      phone: data.phone,
      curriculum: data.curriculum,
      resourceType: data.type,
      grade: data.grade,
      subject: data.subject,
      turnaround: `${data.quote.urgency} (${data.quote.timeframe})`,
      estimatedCost: data.quote.price,
      notes: data.notes
    });

    const briefText = this.formatBriefMessage(data);

    if (channel === 'whatsapp') {
      const settings = resourceStore.getSettings();
      let rawNumber = (settings.whatsappNumber || '0608316086').replace(/[^0-9]/g, '');
      if (rawNumber.startsWith('0')) {
        rawNumber = '27' + rawNumber.substring(1);
      }
      const waUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(briefText)}`;
      window.open(waUrl, '_blank');
      this.onMascotCheer(`Custom request #${data.refCode} sent to Roxy on WhatsApp! 💖`);
    } else {
      const settings = resourceStore.getSettings();
      const adminEmail = settings.emailAddress || 'teachermomroxy3@gmail.com';
      const subject = encodeURIComponent(`TeacherMom Custom Resource Request: ${data.refCode} (${data.type})`);
      const body = encodeURIComponent(briefText);
      const mailtoUrl = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;

      navigator.clipboard.writeText(briefText);
      alert(`✉️ Custom request email opened! Your brief has also been copied to your clipboard.`);
      this.onMascotCheer(`Custom request #${data.refCode} sent via Email! 💌`);
    }

    this.close();
  }
}
