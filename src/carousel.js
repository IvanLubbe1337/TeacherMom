// Resource Catalog Data & Interactive Bouncy Carousel
// Integrated with ResourceStore (live admin updates, curriculum, subject, term, year, locked status)
import { sounds } from './audio.js';
import { resourceStore } from './resourceStore.js';

export class ResourceCarousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.resources = resourceStore.getResources();
    this.filteredResources = [...this.resources];
    this.currentIndex = 0;
    this.itemsPerPage = 4;
    this.onAddToCart = options.onAddToCart || (() => {});
    this.onOpenFlipbook = options.onOpenFlipbook || (() => {});
    this.onBuyResource = options.onBuyResource || (() => {});
    this.onRateResource = options.onRateResource || (() => {});
    this.onOpenCustomRequest = options.onOpenCustomRequest || (() => {});

    this.currentGradeFilter = 'all';
    this.currentTypeFilter = 'all';
    this.currentCurriculumFilter = 'all';
    this.currentQuery = '';

    // Subscribe to store updates (e.g. when Roxy uploads a new resource in Admin or ratings change)
    this.unsubscribe = resourceStore.subscribe(() => {
      this.resources = resourceStore.getResources();
      this.applyFilters();
    });

    this.checkItemsPerPage();
    window.addEventListener('resize', () => {
      this.checkItemsPerPage();
      this.render();
    });

    this.render();
  }

  checkItemsPerPage() {
    if (window.innerWidth < 640) {
      this.itemsPerPage = 1;
    } else if (window.innerWidth < 960) {
      this.itemsPerPage = 2;
    } else if (window.innerWidth < 1280) {
      this.itemsPerPage = 3;
    } else {
      this.itemsPerPage = 4;
    }
  }

  applyFilters() {
    this.filteredResources = this.resources.filter(r => {
      // 1. Grade filter
      if (this.currentGradeFilter && this.currentGradeFilter !== 'all') {
        const matchesGrade = r.gradeTag === this.currentGradeFilter || r.gradeTag === 'all';
        if (!matchesGrade) return false;
      }

      // 2. Resource Type filter (Workbook, Assessment, Lesson Plan, Teaching Guide)
      if (this.currentTypeFilter && this.currentTypeFilter !== 'all') {
        const itemType = (r.resourceType || '').toLowerCase();
        const targetType = this.currentTypeFilter.toLowerCase();
        if (!itemType.includes(targetType)) return false;
      }

      // 3. Curriculum / ATP filter
      if (this.currentCurriculumFilter && this.currentCurriculumFilter !== 'all') {
        if (this.currentCurriculumFilter === 'atp') {
          if (!r.atpAligned) return false;
        } else {
          const itemCur = (r.curriculum || '').toLowerCase();
          const targetCur = this.currentCurriculumFilter.toLowerCase();
          if (!itemCur.includes(targetCur)) return false;
        }
      }

      // 4. Query text filter
      if (this.currentQuery) {
        const q = this.currentQuery.toLowerCase();
        const matches = (
          r.title.toLowerCase().includes(q) ||
          (r.subtitle && r.subtitle.toLowerCase().includes(q)) ||
          (r.resourceType && r.resourceType.toLowerCase().includes(q)) ||
          (r.audience && r.audience.toLowerCase().includes(q)) ||
          (r.grade && r.grade.toLowerCase().includes(q)) ||
          (r.subject && r.subject.toLowerCase().includes(q)) ||
          (r.curriculum && r.curriculum.toLowerCase().includes(q)) ||
          (r.atpReference && r.atpReference.toLowerCase().includes(q)) ||
          (r.term && r.term.toLowerCase().includes(q)) ||
          (r.year && r.year.toLowerCase().includes(q)) ||
          (r.description && r.description.toLowerCase().includes(q))
        );
        if (!matches) return false;
      }

      return true;
    });

    this.currentIndex = 0;
    this.render();
  }

  filterByGrade(gradeTag) {
    this.currentGradeFilter = gradeTag || 'all';
    this.applyFilters();
  }

  filterByType(type) {
    this.currentTypeFilter = type || 'all';
    this.applyFilters();
  }

  filterByCurriculum(curriculum) {
    this.currentCurriculumFilter = curriculum || 'all';
    this.applyFilters();
  }

  filterByQuery(query) {
    this.currentQuery = query.trim();
    this.applyFilters();
  }

  next() {
    sounds.pop(600);
    const maxIndex = Math.max(0, this.filteredResources.length - this.itemsPerPage);
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // loop back
    }
    this.updatePosition();
  }

  prev() {
    sounds.pop(500);
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      const maxIndex = Math.max(0, this.filteredResources.length - this.itemsPerPage);
      this.currentIndex = maxIndex;
    }
    this.updatePosition();
  }

  updatePosition() {
    const track = this.container.querySelector('.carousel-track');
    const dots = this.container.querySelectorAll('.dot-indicator');
    if (!track) return;

    const cardWidth = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 280;
    track.style.transform = `translateX(-${this.currentIndex * cardWidth}px)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });
  }

  render() {
    if (!this.container) return;

    if (this.filteredResources.length === 0) {
      this.container.innerHTML = `
        <div class="empty-resources-state">
          <div class="empty-doodle">🎨 ✏️</div>
          <h3>No resources found matching filter</h3>
          <p>Try searching for "CAPS", "Mathematics", "Grade 1", or choose "All Grades"!</p>
          <button class="bubble-pill-btn btn-mint reset-filter-btn">Show All Resources</button>
        </div>
      `;
      const btn = this.container.querySelector('.reset-filter-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          this.filterByGrade('all');
          document.querySelectorAll('.grade-sticker-pill').forEach(s => s.classList.remove('active'));
          const allBadge = document.querySelector('.grade-sticker-pill[data-grade="all"]');
          if (allBadge) allBadge.classList.add('active');
        });
      }
      return;
    }

    const cardsHtml = this.filteredResources.map(item => this.createCardHtml(item)).join('');
    const totalPages = Math.max(1, this.filteredResources.length - this.itemsPerPage + 1);

    const dotsHtml = Array.from({ length: totalPages }).map((_, i) => `
      <button class="dot-indicator ${i === this.currentIndex ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i+1}"></button>
    `).join('');

    this.container.innerHTML = `
      <div class="carousel-wrapper">
        <button class="carousel-nav-btn prev-btn" aria-label="Previous resources">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="carousel-viewport">
          <div class="carousel-track">
            ${cardsHtml}
          </div>
        </div>

        <button class="carousel-nav-btn next-btn" aria-label="Next resources">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div class="carousel-dots-container">
        ${dotsHtml}
      </div>
    `;

    this.attachCardEvents();
  }

  createCardHtml(item) {
    const currency = item.currency || 'R';
    const priceFormatted = `${currency}${parseFloat(item.price).toFixed(2)}`;
    const hasSampleUploads = item.sampleImages && item.sampleImages.length > 0;

    const typeIcons = {
      'Workbook': '📚',
      'Assessment': '📝',
      'Lesson Plan': '📋',
      'Teaching Guide': '📖'
    };
    const typeIcon = typeIcons[item.resourceType] || '✨';
    const typeLabel = item.resourceType || 'Resource';

    return `
      <div class="resource-card" data-id="${item.id}" style="--theme-color: ${item.colorTheme || '#FFE5EC'}; --badge-color: ${item.badgeColor || '#FF80AB'}">
        
        <!-- Top Tags: Resource Type, Curriculum, Grade, ATP Badge & Locked -->
        <div class="card-top-bar">
          <div class="card-badges-group">
            <span class="card-type-badge">${typeIcon} ${typeLabel}</span>
            <span class="card-curriculum-badge">${item.curriculum || 'CAPS'}</span>
            <span class="card-grade-badge">${item.grade}</span>
            ${item.atpAligned ? `<span class="card-atp-badge" title="${item.atpReference || 'DBE ATP Aligned'}">🇿🇦 ATP Aligned ✓</span>` : ''}
          </div>
          <span class="card-locked-badge" title="Digital files unlocked upon verified payment">🔒 Locked</span>
        </div>

        <!-- Kawaii Animated Mascot or Sample Preview Centerpiece -->
        <div class="card-mascot-box">
          ${hasSampleUploads ? `
            <div class="card-uploaded-preview">
              <img src="${item.sampleImages[0]}" alt="${item.title} sample" class="card-sample-img" />
              <div class="sample-watermark-overlay">SAMPLE PREVIEW</div>
            </div>
          ` : this.getFaceSvg(item)}
        </div>

        <!-- Resource Information -->
        <div class="card-content">
          <h4 class="card-title">${item.title}</h4>
          
          <!-- Metadata Pill Row: Subject, Term & Year, Audience -->
          <div class="card-meta-tags-row">
            <span class="meta-pill subject-pill">📚 ${item.subject || 'All Subjects'}</span>
            <span class="meta-pill term-pill">📅 ${item.term || 'Term 1'} (${item.year || '2026'})</span>
            <span class="meta-pill audience-pill">👥 ${item.audience || 'Schools & Parents'}</span>
          </div>

          ${item.atpReference ? `
            <div class="card-atp-reference-pill">
              <span class="atp-icon">🎯</span>
              <span><strong>ATP Focus:</strong> ${item.atpReference}</span>
            </div>
          ` : ''}

          <p class="card-subtitle">${item.subtitle || item.description || ''}</p>

          <div class="card-rating">
            <span class="star-icons">★★★★★</span>
            <span class="rating-val">${item.rating || 5.0} (${item.reviews || 42})</span>
            <button class="rate-trigger-pill" data-id="${item.id}" title="Rate & review this resource">⭐ Rate</button>
          </div>

          <div class="card-price-row">
            <div class="price-wrap">
              <span class="card-price">${priceFormatted}</span>
              <span class="price-sub">EFT / WhatsApp</span>
            </div>
            <button class="card-customize-trigger-link" data-id="${item.id}" title="Request custom school/parent adaptation (turnaround 3–7 days)">
              <span>🎨 Customize</span>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="card-actions">
          <button class="preview-flip-btn" data-id="${item.id}" title="View sample pages in the interactive flipbook">
            <span class="flip-icon">📖</span> Samples
          </button>
          <button class="buy-now-btn" data-id="${item.id}" title="Get unique reference number and order via WhatsApp/Email">
            <span class="cart-icon">🛒</span> Buy Now
          </button>
        </div>
      </div>
    `;
  }

  getFaceSvg(item) {
    if (item.faceType === 'backpack') {
      return `
        <svg class="kawaii-face-svg" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="10" width="45" height="55" rx="8" fill="#FFCCD5" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(-12 20 10)"/>
          <text x="35" y="42" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="14" fill="#3D2C2E" transform="rotate(-12 20 10)">aa</text>
          
          <rect x="58" y="8" width="45" height="55" rx="8" fill="#FFF275" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(2 58 8)"/>
          <text x="74" y="38" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="14" fill="#3D2C2E">ab</text>

          <rect x="98" y="14" width="45" height="55" rx="8" fill="#A8DADC" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(14 98 14)"/>
          <text x="110" y="44" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="14" fill="#3D2C2E" transform="rotate(14 98 14)">ac</text>

          <rect x="42" y="38" width="76" height="74" rx="18" fill="#FF8DA1" stroke="#3D2C2E" stroke-width="3"/>
          <path d="M60 38 Q 80 20 100 38" stroke="#3D2C2E" stroke-width="3" fill="none"/>
          <rect x="52" y="74" width="56" height="30" rx="8" fill="#FFA6B7" stroke="#3D2C2E" stroke-width="2.5"/>
          <circle class="card-eye eye-l" cx="66" cy="56" r="4.5" fill="#3D2C2E"/>
          <circle class="card-eye eye-r" cx="94" cy="56" r="4.5" fill="#3D2C2E"/>
          <circle cx="67.5" cy="54.5" r="1.5" fill="#FFFFFF"/>
          <circle cx="95.5" cy="54.5" r="1.5" fill="#FFFFFF"/>
          <ellipse cx="58" cy="62" rx="4" ry="2.5" fill="#FF4081" opacity="0.6"/>
          <ellipse cx="102" cy="62" rx="4" ry="2.5" fill="#FF4081" opacity="0.6"/>
          <path class="card-mouth" d="M75 62 Q 80 68 85 62" stroke="#3D2C2E" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        </svg>
      `;
    }

    if (item.faceType === 'sticky-smile') {
      return `
        <svg class="kawaii-face-svg" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 18 H118 L138 38 V102 H22 Z" fill="#FFE082" stroke="#3D2C2E" stroke-width="3.5"/>
          <path d="M118 18 V38 H138 Z" fill="#FFD54F" stroke="#3D2C2E" stroke-width="3"/>
          <ellipse class="card-eye eye-l" cx="60" cy="56" rx="8" ry="10" fill="#3D2C2E"/>
          <ellipse class="card-eye eye-r" cx="100" cy="56" rx="8" ry="10" fill="#3D2C2E"/>
          <circle cx="58" cy="52" r="3" fill="#FFFFFF"/>
          <circle cx="98" cy="52" r="3" fill="#FFFFFF"/>
          <ellipse cx="46" cy="66" rx="6" ry="3.5" fill="#FF7043" opacity="0.6"/>
          <ellipse cx="114" cy="66" rx="6" ry="3.5" fill="#FF7043" opacity="0.6"/>
          <path class="card-mouth" d="M72 64 Q 80 76 88 64" stroke="#3D2C2E" stroke-width="2.8" stroke-linecap="round" fill="none"/>
          <path d="M77 69 Q 80 75 83 69 Z" fill="#FF5252"/>
        </svg>
      `;
    }

    // Default cute card face
    return `
      <svg class="kawaii-face-svg" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="12" width="124" height="96" rx="20" fill="#B2EBF2" stroke="#3D2C2E" stroke-width="3.5"/>
        <g transform="translate(112, 18) rotate(35)">
          <rect x="0" y="0" width="8" height="24" rx="2" fill="#FFE082" stroke="#3D2C2E" stroke-width="2"/>
          <polygon points="0,0 8,0 4,-8" fill="#FFAB91" stroke="#3D2C2E" stroke-width="1.5"/>
        </g>
        <ellipse class="card-eye eye-l" cx="58" cy="52" rx="10" ry="14" fill="#3D2C2E"/>
        <ellipse class="card-eye eye-r" cx="102" cy="52" rx="10" ry="14" fill="#3D2C2E"/>
        <circle cx="56" cy="46" r="4" fill="#FFFFFF"/>
        <circle cx="61" cy="56" r="2" fill="#FFFFFF"/>
        <circle cx="100" cy="46" r="4" fill="#FFFFFF"/>
        <circle cx="105" cy="56" r="2" fill="#FFFFFF"/>
        <ellipse cx="44" cy="64" rx="7" ry="4" fill="#FF80AB" opacity="0.7"/>
        <ellipse cx="116" cy="64" rx="7" ry="4" fill="#FF80AB" opacity="0.7"/>
        <path class="card-mouth" d="M72 64 Q 80 78 88 64 Z" fill="#E91E63" stroke="#3D2C2E" stroke-width="2.5"/>
      </svg>
    `;
  }

  attachCardEvents() {
    const prevBtn = this.container.querySelector('.prev-btn');
    const nextBtn = this.container.querySelector('.next-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    const dots = this.container.querySelectorAll('.dot-indicator');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        sounds.pop(550);
        this.currentIndex = parseInt(e.target.dataset.index, 10);
        this.updatePosition();
      });
    });

    // Buy Now / Order Reference Buttons
    const buyBtns = this.container.querySelectorAll('.buy-now-btn');
    buyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.resources.find(r => r.id === id);
        if (item) {
          this.onBuyResource(item);
        }
      });
    });

    // Sample Preview Flipbook Buttons
    const previewBtns = this.container.querySelectorAll('.preview-flip-btn');
    previewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.resources.find(r => r.id === id);
        if (item) {
          sounds.pageTurn();
          this.onOpenFlipbook(item);
        }
      });
    });

    // Rate Resource Buttons
    const rateBtns = this.container.querySelectorAll('.rate-trigger-pill');
    rateBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        const item = this.resources.find(r => r.id === id);
        if (item) {
          sounds.pop(650);
          this.onRateResource(item);
        }
      });
    });

    // Customize for School / Parent button
    const customBtns = this.container.querySelectorAll('.card-customize-trigger-link');
    customBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        const item = this.resources.find(r => r.id === id);
        if (item) {
          sounds.pop(650);
          this.onOpenCustomRequest(item);
        }
      });
    });

    // Hover wink micro-interaction
    const cards = this.container.querySelectorAll('.resource-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('card-winking');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('card-winking');
      });
    });
  }
}
