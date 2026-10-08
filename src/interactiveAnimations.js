// Interactive Fun Animations & Whimsical Playgrounds
// 1. Hero Doodles (Sun, Cloud, Flying Pencil, Books Stack) with interactive click physics & particles
// 2. Mascot Tablet Bubble-Popping Minigame (Click to pop floating bubbles & respawn new icons)
// 3. Floating Joy / Cheer Station with balloon launchers that can be popped mid-air
// 4. Resource Card 3D Magnetic Tilt & Rubber Stamp Slam
// 5. Brand Logo Heartbeat & Pencil Arc Interaction
// 6. Grade Pill Elastic Jelly Squish

import { sounds } from './audio.js';

export class InteractiveAnimations {
  constructor(options = {}) {
    this.onMascotCheer = options.onMascotCheer || (() => {});
    this.bubblePopStreak = 0;
    this.lastBubblePopTime = 0;
    this.cheerCombo = 0;
    this.cheerComboTimer = null;

    this.init();
  }

  init() {
    this.setupHeroDoodles();
    this.setupMascotBubblePopping();
    this.setupCheerStation();
    this.setupBrandLogoInteraction();
    this.setupCardStampsAndTilt();
    this.setupFilterPillJelly();
  }

  /* ==========================================================================
     1. HERO DOODLES: Sun, Cloud, Flying Pencil & Book Stack
     ========================================================================== */
  setupHeroDoodles() {
    // 1.1 Cartoon Sun
    const sun = document.querySelector('.doodle-sun');
    if (sun) {
      this.attachTooltip(sun, '☀️ Tickle my rays!');
      sun.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sun.classList.contains('sun-celebrating')) return;

        sun.classList.add('sun-celebrating');
        sounds.sparkle();

        // Spawn radiant golden sparks
        const rect = sun.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        this.spawnSparkleBurst(cx, cy, [
          '#FFD166', '#FFB703', '#FB8500', '#FFE6A7', '#FFFFFF'
        ], ['★', '✦', '☀️', '✨', '💛'], 20);

        this.showDoodleBubble(sun, 'Yay! Warm sunshine for your classroom! ☀️✨', 'top-left');

        setTimeout(() => {
          sun.classList.remove('sun-celebrating');
        }, 1100);
      });
    }

    // 1.2 Smiling Fluffy Cloud
    const cloud = document.querySelector('.doodle-cloud');
    if (cloud) {
      this.attachTooltip(cloud, '🌧️ Squeeze for rainbow rain!');
      cloud.addEventListener('click', (e) => {
        e.stopPropagation();
        if (cloud.classList.contains('cloud-squishing')) return;

        cloud.classList.add('cloud-squishing');
        sounds.pop(480);
        setTimeout(() => sounds.pop(680), 120);

        // Spawn colorful rain shower
        const rect = cloud.getBoundingClientRect();
        this.spawnRainShower(rect.left + rect.width * 0.1, rect.left + rect.width * 0.9, rect.bottom, 22);

        this.showDoodleBubble(cloud, 'Pitter-patter! Rainbow sprinkle shower! 🌧️🌈', 'top-right');

        setTimeout(() => {
          cloud.classList.remove('cloud-squishing');
        }, 850);
      });
    }

    // 1.3 Flying Pencil with Wings
    const pencil = document.querySelector('.doodle-pencil-fly');
    if (pencil) {
      this.attachTooltip(pencil, '✏️ Loop-de-loop flight!');
      pencil.addEventListener('click', (e) => {
        e.stopPropagation();
        if (pencil.classList.contains('pencil-looping')) return;

        pencil.classList.add('pencil-looping');
        sounds.pop(320);
        setTimeout(() => sounds.pop(540), 150);
        setTimeout(() => sounds.sparkle(), 320);

        // Flight dust
        const rect = pencil.getBoundingClientRect();
        this.spawnFlightTrail(rect.left, rect.top, 14);

        this.showDoodleBubble(pencil, 'Zoom! Ready to write lesson plans! ✏️💨', 'bottom-right');

        setTimeout(() => {
          pencil.classList.remove('pencil-looping');
        }, 1000);
      });
    }

    // 1.4 Stack of 3 Books
    const books = document.querySelector('.doodle-books-stack');
    if (books) {
      this.attachTooltip(books, '📚 Boing the books!');
      books.addEventListener('click', (e) => {
        e.stopPropagation();
        if (books.classList.contains('books-accordion-boing')) return;

        books.classList.add('books-accordion-boing');
        sounds.boing();

        const rect = books.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 3;
        this.spawnSparkleBurst(cx, cy, [
          '#FF8DA1', '#A8DADC', '#80DEEA', '#FFE082', '#E1BEE7'
        ], ['📖', 'A', 'B', 'C', '1', '2', '3', '⭐'], 16);

        this.showDoodleBubble(books, 'Knowledge unlocked! 100% Curriculum Magic! 📚🌟', 'bottom-left');

        setTimeout(() => {
          books.classList.remove('books-accordion-boing');
        }, 900);
      });
    }
  }

  // Tooltip pill generator on hover
  attachTooltip(el, text) {
    el.setAttribute('title', text);
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');

    const hint = document.createElement('div');
    hint.className = 'doodle-hover-hint';
    hint.textContent = text;
    el.appendChild(hint);
  }

  // Pop-up comic bubble near doodles
  showDoodleBubble(targetEl, text, position = 'top') {
    const existing = targetEl.querySelector('.doodle-comic-pop');
    if (existing) existing.remove();

    const bubble = document.createElement('div');
    bubble.className = `doodle-comic-pop bubble-${position}`;
    bubble.innerHTML = `<span>${text}</span>`;
    targetEl.appendChild(bubble);

    setTimeout(() => {
      bubble.classList.add('bubble-fade-out');
      setTimeout(() => bubble.remove(), 400);
    }, 2400);
  }

  // Particle bursts
  spawnSparkleBurst(x, y, colors, symbols, count = 18) {
    const container = document.body;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'interactive-spark-particle';

      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.textContent = symbol;
      p.style.color = color;

      const size = Math.random() * 12 + 14;
      p.style.fontSize = `${size}px`;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      const angle = (Math.random() * 360) * (Math.PI / 180);
      const dist = Math.random() * 120 + 40;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const rot = Math.random() * 720 - 360;

      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.setProperty('--rot', `${rot}deg`);

      container.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  }

  spawnRainShower(minX, maxX, startY, count = 20) {
    const container = document.body;
    const drops = ['💧', '🌈', '✨', '•', '🌸', '💧'];
    const colors = ['#4DD0E1', '#80DEEA', '#FF80AB', '#B388FF', '#FFD54F', '#A7FFEB'];

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const drop = document.createElement('div');
        drop.className = 'interactive-raindrop-particle';

        const rx = minX + Math.random() * (maxX - minX);
        const ry = startY + (Math.random() * 10 - 5);
        drop.style.left = `${rx}px`;
        drop.style.top = `${ry}px`;

        const isEmoji = Math.random() > 0.4;
        if (isEmoji) {
          drop.textContent = drops[Math.floor(Math.random() * drops.length)];
          drop.style.fontSize = `${Math.random() * 8 + 14}px`;
        } else {
          drop.className += ' drop-droplet';
          drop.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          drop.style.width = '6px';
          drop.style.height = '14px';
        }

        const fallDist = Math.random() * 200 + 150;
        const drift = Math.random() * 40 - 20;

        drop.style.setProperty('--fall-dist', `${fallDist}px`);
        drop.style.setProperty('--drift', `${drift}px`);

        container.appendChild(drop);
        setTimeout(() => drop.remove(), 1100);
      }, i * 35);
    }
  }

  spawnFlightTrail(x, y, count = 12) {
    const container = document.body;
    const trailColors = ['#FF80AB', '#FFD166', '#4DD0E1', '#B388FF'];

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const t = document.createElement('div');
        t.className = 'interactive-pencil-trail-particle';
        t.style.left = `${x + (Math.random() * 60 - 30)}px`;
        t.style.top = `${y + (Math.random() * 60 - 30)}px`;
        t.style.backgroundColor = trailColors[Math.floor(Math.random() * trailColors.length)];

        container.appendChild(t);
        setTimeout(() => t.remove(), 800);
      }, i * 40);
    }
  }

  /* ==========================================================================
     2. MASCOT TABLET BUBBLE POPPING MINIGAME
     ========================================================================== */
  setupMascotBubblePopping() {
    const checkAndBind = () => {
      const floatItems = document.querySelectorAll('.float-item');
      if (!floatItems || floatItems.length === 0) {
        setTimeout(checkAndBind, 500);
        return;
      }

      const surpriseSymbols = [
        '⭐', '🍎', '💯', '🎨', '🚀', '💡', '💖', '🌈', '🦄', '📐', 'A', 'B', 'C', '1', '2', '3'
      ];
      const colors = ['#FFE5EC', '#E8F8F5', '#FEF9E7', '#EBF5FB', '#F4ECF7', '#FDEDEC'];
      const textColors = ['#FF5E7E', '#3AAFA9', '#F39C12', '#3498DB', '#8E44AD', '#E74C3C'];

      floatItems.forEach((item, idx) => {
        item.style.cursor = 'pointer';
        item.setAttribute('role', 'button');
        item.setAttribute('title', 'Pop me for a surprise! ✨');

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          if (item.classList.contains('bubble-popped')) return;

          // Sound effect with pitch based on index
          sounds.pop(500 + idx * 60);

          // Pop burst animation
          item.classList.add('bubble-popped');

          // Get coordinates for micro-confetti
          const rect = item.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          this.spawnSparkleBurst(cx, cy, textColors, ['✨', '●', '✦', '★'], 8);

          // Track bubble streak
          const now = Date.now();
          if (now - this.lastBubblePopTime < 3200) {
            this.bubblePopStreak++;
          } else {
            this.bubblePopStreak = 1;
          }
          this.lastBubblePopTime = now;

          if (this.bubblePopStreak >= 3) {
            sounds.win();
            this.onMascotCheer("Pop-tastic! You're a Bubble Master! 🌟🎉");
            this.bubblePopStreak = 0;
          }

          // Respawn bubble after 1.3s with random surprise symbol
          setTimeout(() => {
            const textEl = item.querySelector('text');
            const circleEl = item.querySelector('circle');
            if (textEl && circleEl) {
              const randSym = surpriseSymbols[Math.floor(Math.random() * surpriseSymbols.length)];
              const randBg = colors[Math.floor(Math.random() * colors.length)];
              const randTextCol = textColors[Math.floor(Math.random() * textColors.length)];

              textEl.textContent = randSym;
              textEl.setAttribute('fill', randTextCol);
              circleEl.setAttribute('fill', randBg);
            }

            item.classList.remove('bubble-popped');
            item.classList.add('bubble-respawning');
            setTimeout(() => item.classList.remove('bubble-respawning'), 600);
          }, 1300);
        });
      });
    };

    checkAndBind();
  }

  /* ==========================================================================
     3. FLOATING JOY / CHEER STATION WITH CLICKABLE RISING BALLOONS
     ========================================================================== */
  setupCheerStation() {
    const cheerStation = document.createElement('div');
    cheerStation.className = 'floating-cheer-station';
    cheerStation.id = 'floatingCheerStation';
    cheerStation.innerHTML = `
      <div class="cheer-station-wrapper">
        <!-- Floating Reactions Panel -->
        <div class="cheer-reactions-panel" id="cheerReactionsPanel" aria-hidden="true">
          <div class="reactions-title-tag">Send Joy! 💕</div>
          <div class="reaction-buttons-row">
            <button class="cheer-pill-btn" data-type="heart" title="Teacher Hug!">
              <span class="btn-emoji">💖</span>
              <span class="btn-lbl">Love</span>
            </button>
            <button class="cheer-pill-btn" data-type="star" title="Stardust Cheer!">
              <span class="btn-emoji">⭐</span>
              <span class="btn-lbl">Star</span>
            </button>
            <button class="cheer-pill-btn" data-type="apple" title="Apple for Teacher!">
              <span class="btn-emoji">🍎</span>
              <span class="btn-lbl">Apple</span>
            </button>
            <button class="cheer-pill-btn" data-type="pencil" title="Creative Magic!">
              <span class="btn-emoji">✏️</span>
              <span class="btn-lbl">Doodle</span>
            </button>
            <button class="cheer-pill-btn" data-type="balloon" title="Party Balloon!">
              <span class="btn-emoji">🎈</span>
              <span class="btn-lbl">Party</span>
            </button>
          </div>
        </div>

        <!-- Master Joy Toggle Pill -->
        <button class="cheer-main-toggle" id="cheerMainToggle" title="Interactive Joy Station - Launch Cheer Balloons!">
          <span class="cheer-main-icon">🎈</span>
          <span class="cheer-main-text">Joy Station</span>
          <span class="cheer-hint-sparkle">✨</span>
        </button>
      </div>
    `;

    document.body.appendChild(cheerStation);

    const mainBtn = document.getElementById('cheerMainToggle');
    const panel = document.getElementById('cheerReactionsPanel');

    let isOpen = false;
    const togglePanel = () => {
      isOpen = !isOpen;
      sounds.pop(isOpen ? 620 : 420);
      cheerStation.classList.toggle('station-open', isOpen);
      panel.setAttribute('aria-hidden', (!isOpen).toString());
    };

    mainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !cheerStation.contains(e.target)) {
        togglePanel();
      }
    });

    // Reaction click events
    const reactionBtns = cheerStation.querySelectorAll('.cheer-pill-btn');
    reactionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.dataset.type;
        this.launchCheerReaction(type, btn);
      });
    });
  }

  launchCheerReaction(type, triggerBtn) {
    const config = {
      heart: { emoji: '💖', color: '#FF4D6D', sound: () => sounds.sparkle() },
      star: { emoji: '⭐', color: '#FFD166', sound: () => sounds.sparkle() },
      apple: { emoji: '🍎', color: '#E63946', sound: () => sounds.pop(720) },
      pencil: { emoji: '✏️', color: '#457B9D', sound: () => sounds.pop(580) },
      balloon: { emoji: '🎈', color: '#9B5DE5', sound: () => sounds.boing() }
    };

    const sel = config[type] || config.heart;
    sel.sound();

    // Squish button
    triggerBtn.classList.add('cheer-btn-squish');
    setTimeout(() => triggerBtn.classList.remove('cheer-btn-squish'), 350);

    // Increment combo
    this.cheerCombo++;
    clearTimeout(this.cheerComboTimer);
    this.cheerComboTimer = setTimeout(() => {
      this.cheerCombo = 0;
    }, 2800);

    // Show combo badge if combo > 1
    if (this.cheerCombo >= 2) {
      this.showComboBadge(triggerBtn, this.cheerCombo);
    }

    // Launch 3 rising balloons from bottom right
    const rect = triggerBtn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top;

    const balloonCount = Math.min(5, 2 + Math.floor(this.cheerCombo / 2));
    for (let i = 0; i < balloonCount; i++) {
      setTimeout(() => {
        this.createFloatingBalloon(originX + (Math.random() * 60 - 30), originY, sel.emoji, sel.color);
      }, i * 90);
    }

    if (this.cheerCombo === 5) {
      this.onMascotCheer("Mega Joy Shower! You're making everyone smile! 🎉💖");
    }
  }

  createFloatingBalloon(startX, startY, emoji, color) {
    const balloon = document.createElement('div');
    balloon.className = 'interactive-floating-balloon';
    balloon.title = 'Click to pop mid-air! 🎈';
    balloon.innerHTML = `
      <div class="balloon-body" style="--balloon-color: ${color}">
        <span class="balloon-emoji">${emoji}</span>
        <div class="balloon-string"></div>
      </div>
    `;

    balloon.style.left = `${startX}px`;
    balloon.style.top = `${startY}px`;

    // Drift physics
    const duration = Math.random() * 3.5 + 4.5; // 4.5 to 8s
    const swayAmp = Math.random() * 70 + 40;
    const driftDir = Math.random() > 0.5 ? 1 : -1;

    balloon.style.setProperty('--duration', `${duration}s`);
    balloon.style.setProperty('--sway', `${swayAmp * driftDir}px`);

    document.body.appendChild(balloon);

    // Click to pop mid-air!
    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.pop(750 + Math.random() * 200);

      const bRect = balloon.getBoundingClientRect();
      this.spawnSparkleBurst(
        bRect.left + bRect.width / 2,
        bRect.top + bRect.height / 2,
        [color, '#FFD166', '#FFFFFF', '#FF80AB'],
        ['✦', '★', '●', emoji],
        12
      );

      balloon.classList.add('balloon-burst');
      setTimeout(() => balloon.remove(), 250);
    });

    // Remove when floated off-screen
    setTimeout(() => {
      if (balloon.parentNode) {
        balloon.remove();
      }
    }, duration * 1000);
  }

  showComboBadge(btn, count) {
    const existing = document.querySelector('.cheer-combo-badge');
    if (existing) existing.remove();

    const badge = document.createElement('div');
    badge.className = 'cheer-combo-badge';
    badge.textContent = `Combo x${count}! 🔥`;

    const rect = btn.getBoundingClientRect();
    badge.style.left = `${rect.left + rect.width / 2}px`;
    badge.style.top = `${rect.top - 24}px`;

    document.body.appendChild(badge);
    setTimeout(() => badge.remove(), 1100);
  }

  /* ==========================================================================
     4. RESOURCE CARD 3D TILT & RUBBER-STAMP SLAM
     ========================================================================== */
  setupCardStampsAndTilt() {
    const bindCards = () => {
      const cards = document.querySelectorAll('.resource-card');
      cards.forEach(card => {
        if (card.dataset.tiltBound) return;
        card.dataset.tiltBound = 'true';

        // 4.1 3D Magnetic Tilt on hover
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;

          const rotX = -((y - cy) / cy) * 7;
          const rotY = ((x - cx) / cx) * 7;

          card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

          // Specular light sheen
          let sheen = card.querySelector('.card-sheen-overlay');
          if (!sheen) {
            sheen = document.createElement('div');
            sheen.className = 'card-sheen-overlay';
            card.appendChild(sheen);
          }
          const px = (x / rect.width) * 100;
          const py = (y / rect.height) * 100;
          sheen.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 65%)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          const sheen = card.querySelector('.card-sheen-overlay');
          if (sheen) sheen.style.background = 'none';
        });

        // 4.2 Interactive Rubber Stamp on ATP Badge click
        const atpBadge = card.querySelector('.card-atp-badge');
        if (atpBadge) {
          atpBadge.style.cursor = 'pointer';
          atpBadge.setAttribute('title', 'Click to Stamp Approved! 🇿🇦');

          atpBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            this.slamRubberStamp(card, '🇿🇦 ATP APPROVED ✓');
          });
        }

        // Card Type badge also stamps
        const typeBadge = card.querySelector('.card-type-badge');
        if (typeBadge) {
          typeBadge.style.cursor = 'pointer';
          typeBadge.setAttribute('title', 'Click for Teacher Stamp! ⭐');
          typeBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            this.slamRubberStamp(card, '⭐ TEACHER MOM CERTIFIED ⭐');
          });
        }
      });
    };

    bindCards();
    // Re-bind when carousel pages or filters change
    const track = document.querySelector('.carousel-track');
    if (track) {
      const observer = new MutationObserver(() => bindCards());
      observer.observe(track, { childList: true });
    }
  }

  slamRubberStamp(card, text) {
    const existing = card.querySelector('.interactive-rubber-stamp');
    if (existing) existing.remove();

    sounds.pop(260);
    setTimeout(() => sounds.sparkle(), 140);

    const stamp = document.createElement('div');
    stamp.className = 'interactive-rubber-stamp';
    stamp.innerHTML = `
      <div class="stamp-border">
        <span class="stamp-text">${text}</span>
      </div>
    `;

    // Slight random rotation angle between -18 and 18 deg
    const randRot = (Math.random() * 24 - 12).toFixed(1);
    stamp.style.setProperty('--stamp-rot', `${randRot}deg`);

    card.appendChild(stamp);

    // Sparkle burst around stamp
    const rect = card.getBoundingClientRect();
    this.spawnSparkleBurst(
      rect.left + rect.width / 2,
      rect.top + rect.height * 0.45,
      ['#2E7D32', '#4CAF50', '#FFD54F', '#FF80AB'],
      ['✓', '★', '✦', '✨'],
      10
    );

    // Dissolve after 3.2 seconds
    setTimeout(() => {
      stamp.classList.add('stamp-fade-out');
      setTimeout(() => stamp.remove(), 400);
    }, 3200);
  }

  /* ==========================================================================
     5. BRAND LOGO INTERACTION: Heartbeat & Pencil Arc
     ========================================================================== */
  setupBrandLogoInteraction() {
    const brandLogo = document.querySelector('.brand-logo');
    if (!brandLogo) return;

    brandLogo.addEventListener('click', (e) => {
      // Allow navigation, but trigger joyful micro-interactions
      sounds.sparkle();

      const heart = brandLogo.querySelector('.brand-heart-icon');
      const pencil = brandLogo.querySelector('.brand-pencil-icon');

      if (heart) {
        heart.classList.add('heart-pumping');
        setTimeout(() => heart.classList.remove('heart-pumping'), 800);
      }

      if (pencil) {
        pencil.classList.add('pencil-scribbling');
        setTimeout(() => pencil.classList.remove('pencil-scribbling'), 800);
      }

      // Sparkle burst from logo
      const rect = brandLogo.getBoundingClientRect();
      this.spawnSparkleBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        ['#FF4D6D', '#FFE066', '#4DD0E1', '#FF80AB'],
        ['💖', '✏️', '✨', '✦'],
        12
      );
    });
  }

  /* ==========================================================================
     6. FILTER PILLS: Elastic Jelly Squish & Musical Tone
     ========================================================================== */
  setupFilterPillJelly() {
    const allPills = document.querySelectorAll(
      '.grade-sticker-pill, .type-sticker-pill, .curriculum-sticker-pill'
    );

    allPills.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        pill.classList.add('jelly-squish-anim');
        setTimeout(() => pill.classList.remove('jelly-squish-anim'), 400);

        // Micro sparkle from pill center
        const rect = pill.getBoundingClientRect();
        this.spawnSparkleBurst(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          ['#FF80AB', '#FFD166', '#80DEEA'],
          ['✦', '★'],
          4
        );
      });
    });
  }
}
