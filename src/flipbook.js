// Virtual "Live Preview" Flipbook Simulator
// Shows sample pages, metadata (curriculum, grade, subject, term, year, price), and Buy / Order button
import { sounds } from './audio.js';

export class FlipbookModal {
  constructor(options = {}) {
    this.onBuyResource = options.onBuyResource || (() => {});
    this.onRateResource = options.onRateResource || (() => {});
    this.currentResource = null;
    this.currentPageIndex = 0;
    this.modalEl = null;

    this.init();
  }

  init() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'flipbook-modal-backdrop';
    this.modalEl.id = 'flipbookModal';
    this.modalEl.innerHTML = `
      <div class="flipbook-window">
        <!-- Window Top Bar -->
        <div class="flipbook-window-header">
          <div class="flipbook-title-tag">
            <span class="preview-badge">🔒 Sample Preview Only</span>
            <span class="book-resource-name" id="flipbookResourceName">Phonics Fun Pack</span>
          </div>
          <button class="flipbook-close-btn" id="closeFlipbookBtn" aria-label="Close preview">✕</button>
        </div>

        <!-- Metadata Sub-bar -->
        <div class="flipbook-meta-subbar">
          <span class="f-meta-pill" id="fbCurriculum">CAPS</span>
          <span class="f-meta-pill" id="fbGrade">Grade 1</span>
          <span class="f-meta-pill" id="fbSubject">Mathematics</span>
          <span class="f-meta-pill" id="fbTermYear">Term 1 • 2026</span>
          <span class="f-locked-pill">🔒 Full PDF Locked</span>
        </div>

        <!-- Physical Cartoon Binder / Flipbook Stage -->
        <div class="flipbook-stage">
          <!-- Left Flip Arrow -->
          <button class="flip-edge-trigger edge-left" id="flipEdgeLeft" aria-label="Flip page back">
            <span class="edge-arrow">◀</span>
            <span class="edge-label">Prev Page</span>
          </button>

          <!-- 3D Book Container -->
          <div class="flipbook-book" id="flipbookBook">
            <!-- Center Spiral Binder Rings -->
            <div class="book-spine-rings">
              <span class="ring"></span><span class="ring"></span><span class="ring"></span>
              <span class="ring"></span><span class="ring"></span><span class="ring"></span>
              <span class="ring"></span><span class="ring"></span>
            </div>

            <!-- Left Page Container -->
            <div class="book-page book-page-left" id="pageLeft">
              <!-- Rendered via JS -->
            </div>

            <!-- Right Page Container -->
            <div class="book-page book-page-right" id="pageRight">
              <!-- Rendered via JS -->
            </div>
          </div>

          <!-- Right Flip Arrow -->
          <button class="flip-edge-trigger edge-right" id="flipEdgeRight" aria-label="Flip page forward">
            <span class="edge-label">Next Page</span>
            <span class="edge-arrow">▶</span>
          </button>
        </div>

        <!-- Flipbook Footer Controls -->
        <div class="flipbook-footer">
          <div class="page-counter-badge" id="flipbookPageCounter">
            Sample Pages 1 - 2 of 4
          </div>
          <div class="flipbook-actions">
            <button class="sample-download-btn" id="rateFromPreviewBtn">
              ⭐ Rate Resource
            </button>
            <button class="sample-download-btn" id="downloadSampleBtn">
              📥 Sample Sheet
            </button>
            <button class="bubble-pill-btn btn-mint order-from-preview-btn" id="orderFromPreviewBtn">
              🛒 Buy Resource (<span id="previewCurrencyVal">R</span><span id="previewPriceVal">85.00</span>)
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    // Event listeners
    this.modalEl.querySelector('#closeFlipbookBtn').addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    this.modalEl.querySelector('#flipEdgeLeft').addEventListener('click', () => this.prevPage());
    this.modalEl.querySelector('#flipEdgeRight').addEventListener('click', () => this.nextPage());

    this.modalEl.querySelector('#rateFromPreviewBtn').addEventListener('click', () => {
      if (this.currentResource) {
        sounds.pop(650);
        this.onRateResource(this.currentResource);
      }
    });

    this.modalEl.querySelector('#downloadSampleBtn').addEventListener('click', () => {
      sounds.win();
      alert('📄 Downloaded watermarked sample page! For full unwatermarked PDF, click Buy Resource to order via WhatsApp/Email.');
    });

    this.modalEl.querySelector('#orderFromPreviewBtn').addEventListener('click', () => {
      if (this.currentResource) {
        this.close();
        this.onBuyResource(this.currentResource);
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.modalEl.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') this.prevPage();
      if (e.key === 'ArrowRight') this.nextPage();
      if (e.key === 'Escape') this.close();
    });
  }

  open(resource) {
    this.currentResource = resource;
    this.currentPageIndex = 0;

    const titleEl = this.modalEl.querySelector('#flipbookResourceName');
    const priceEl = this.modalEl.querySelector('#previewPriceVal');
    const currEl = this.modalEl.querySelector('#previewCurrencyVal');

    if (titleEl) titleEl.textContent = resource.title;
    if (priceEl) priceEl.textContent = parseFloat(resource.price).toFixed(2);
    if (currEl) currEl.textContent = resource.currency || 'R';

    // Metadata bar
    this.modalEl.querySelector('#fbCurriculum').textContent = resource.curriculum || 'CAPS';
    this.modalEl.querySelector('#fbGrade').textContent = resource.grade || 'Grade 1';
    this.modalEl.querySelector('#fbSubject').textContent = resource.subject || 'All Subjects';
    this.modalEl.querySelector('#fbTermYear').textContent = `${resource.term || 'Term 1'} • ${resource.year || '2026'}`;

    this.renderPages();
    this.modalEl.classList.add('active');
    sounds.pageTurn();
  }

  close() {
    this.modalEl.classList.remove('active');
  }

  nextPage() {
    if (this.currentPageIndex < 2) {
      sounds.pageTurn();
      this.animateFlip('forward');
      this.currentPageIndex += 2;
      this.renderPages();
    } else {
      sounds.pop(400);
    }
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      sounds.pageTurn();
      this.animateFlip('backward');
      this.currentPageIndex -= 2;
      this.renderPages();
    } else {
      sounds.pop(400);
    }
  }

  animateFlip(direction) {
    const book = this.modalEl.querySelector('#flipbookBook');
    if (!book) return;
    book.classList.add(direction === 'forward' ? 'flipping-next' : 'flipping-prev');
    setTimeout(() => {
      book.classList.remove('flipping-next', 'flipping-prev');
    }, 450);
  }

  renderPages() {
    const leftEl = this.modalEl.querySelector('#pageLeft');
    const rightEl = this.modalEl.querySelector('#pageRight');
    const counterEl = this.modalEl.querySelector('#flipbookPageCounter');

    // If resource has uploaded sample images from Admin
    if (this.currentResource.sampleImages && this.currentResource.sampleImages.length > 0) {
      const img1 = this.currentResource.sampleImages[0];
      const img2 = this.currentResource.sampleImages[1] || img1;

      leftEl.innerHTML = `
        <div class="worksheet-sheet sample-image-sheet">
          <div class="watermark-tag">SAMPLE PREVIEW • LOCKED</div>
          <img src="${img1}" alt="Sample page 1" class="fb-sample-img" />
          <div class="page-footer-num">Sample Page 1</div>
        </div>
      `;

      rightEl.innerHTML = `
        <div class="worksheet-sheet sample-image-sheet">
          <div class="watermark-tag">SAMPLE PREVIEW • LOCKED</div>
          <img src="${img2}" alt="Sample page 2" class="fb-sample-img" />
          <div class="page-footer-num">Sample Page 2</div>
        </div>
      `;
      counterEl.textContent = 'Sample Images 1 - 2';
      return;
    }

    if (this.currentPageIndex === 0) {
      leftEl.innerHTML = this.getPageContentCover(this.currentResource);
      rightEl.innerHTML = this.getPageContentWorksheet1(this.currentResource);
      counterEl.textContent = 'Sample Pages 1 - 2 of 4';
    } else {
      leftEl.innerHTML = this.getPageContentWorksheet2(this.currentResource);
      rightEl.innerHTML = this.getPageContentTeacherGuide(this.currentResource);
      counterEl.textContent = 'Sample Pages 3 - 4 of 4';
    }

    this.attachInteractiveWorksheetLogic();
  }

  getPageContentCover(resource) {
    return `
      <div class="worksheet-sheet cover-sheet" style="--cover-tint: ${resource.colorTheme || '#FFE5EC'}">
        <div class="cover-doodle-border">
          <div class="sheet-grade-tag">${resource.curriculum || 'CAPS'} • ${resource.grade} • ${resource.term || 'Term 1'} (${resource.year || '2026'})</div>
          <h2 class="cover-big-title">${resource.title}</h2>
          <p class="cover-sub">${resource.subject || 'All Subjects'} • ${resource.subtitle || ''}</p>
          <div class="cover-hero-illustration">
            <span class="cover-emoji-large">🎒✏️🌟</span>
          </div>
          <div class="locked-watermark-stamp">
            🔒 DIGITAL RESOURCE LOCKED<br/>
            <small>Sample preview only • Order via WhatsApp/Email</small>
          </div>
          <div class="student-name-box">
            <span class="lbl">Super Student:</span>
            <span class="line-fill">__________________________</span>
          </div>
        </div>
      </div>
    `;
  }

  getPageContentWorksheet1(resource) {
    return `
      <div class="worksheet-sheet practice-sheet">
        <div class="watermark-diag">SAMPLE ONLY • TEACHERMOM</div>
        <div class="sheet-header-row">
          <span class="sheet-exercise-title">${resource.subject}: Activity 1 🔍</span>
          <span class="sheet-score">${resource.term} (${resource.year})</span>
        </div>
        <p class="sheet-instructions">Sample Preview: Interactive exercises included in the complete printable PDF pack:</p>

        <div class="interactive-word-bubbles">
          <button class="word-bubble-interactive correct">Item A ⭐</button>
          <button class="word-bubble-interactive">Item B 🎈</button>
          <button class="word-bubble-interactive correct">Item C ✏️</button>
          <button class="word-bubble-interactive correct">Item D 🎒</button>
          <button class="word-bubble-interactive">Item E 📚</button>
          <button class="word-bubble-interactive correct">Item F 🎨</button>
        </div>

        <div class="coloring-prompt-box">
          <span class="prompt-icon">🔒</span>
          <span>Full high-res PDF sent immediately upon proof of payment!</span>
        </div>
        <div class="page-footer-num">Sample Page 2</div>
      </div>
    `;
  }

  getPageContentWorksheet2(resource) {
    return `
      <div class="worksheet-sheet practice-sheet">
        <div class="watermark-diag">SAMPLE ONLY • TEACHERMOM</div>
        <div class="sheet-header-row">
          <span class="sheet-exercise-title">${resource.subject}: Hands-On Practice ✏️</span>
          <span class="sheet-date">${resource.curriculum} Standards</span>
        </div>
        <p class="sheet-instructions">Sample trace, calculate and matching exercises:</p>

        <div class="connect-pairs-grid">
          <div class="pair-row">
            <span class="number-tag">A</span>
            <span class="dotted-trace-line">- - - - - - - - - - - - -</span>
            <span class="object-tag">🍎🍎🍎🍎🍎</span>
          </div>
          <div class="pair-row">
            <span class="number-tag">B</span>
            <span class="dotted-trace-line">- - - - - - - - - - - - -</span>
            <span class="object-tag">⭐⭐⭐</span>
          </div>
        </div>

        <div class="bonus-challenge-box">
          <strong>Teacher Tip:</strong> Includes full memo and print-friendly black & white versions.
        </div>
        <div class="page-footer-num">Sample Page 3</div>
      </div>
    `;
  }

  getPageContentTeacherGuide(resource) {
    return `
      <div class="worksheet-sheet guide-sheet">
        <div class="sheet-header-row">
          <span class="sheet-exercise-title">Curriculum Overview & Specs 📋</span>
        </div>
        <div class="guide-content-blocks">
          <div class="guide-block">
            <h4>🎯 Subject & Curriculum</h4>
            <p><strong>${resource.curriculum || 'CAPS'}</strong> aligned for <strong>${resource.grade}</strong>, <strong>${resource.term || 'Term 1'}</strong>.</p>
          </div>
          <div class="guide-block">
            <h4>📱 How to Receive Full PDF:</h4>
            <p>Click "Buy Resource" below to generate your unique reference number and send to WhatsApp or Email. File is emailed instantly upon receipt of payment proof!</p>
          </div>
          <div class="print-specs-box">
            <span>🖨️ Format: High-Res A4 / Letter PDF</span>
            <span>🔒 Locked: Price ${resource.currency || 'R'}${parseFloat(resource.price).toFixed(2)}</span>
          </div>
        </div>
        <div class="page-footer-num">Sample Page 4</div>
      </div>
    `;
  }

  attachInteractiveWorksheetLogic() {
    const bubbles = this.modalEl.querySelectorAll('.word-bubble-interactive');
    bubbles.forEach(b => {
      b.addEventListener('click', (e) => {
        sounds.pop(700);
        e.currentTarget.classList.toggle('selected-bubble');
      });
    });
  }
}
