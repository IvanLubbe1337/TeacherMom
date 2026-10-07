// Teacher Mom Interactive Mascot & Confetti Controller
import { sounds } from './audio.js';

export class MascotController {
  constructor(containerEl) {
    this.container = containerEl;
    this.speechEl = null;
    this.svgEl = null;
    this.pupils = [];
    this.quotes = [
      "Welcome, Super Teacher! Let's make learning magical! ✨",
      "Peek inside the Flipbooks to see real worksheet pages! 📖",
      "Spin the Prize Wheel in the Fun Zone for sweet discounts! 🎡",
      "Drag and pack a bundle to save 25% today! 🎒",
      "Teachers & Moms are real-life superheroes! 💕",
      "Bloop! Click me anytime for a smile! 🖍️"
    ];
    this.quoteIndex = 0;

    this.render();
    this.initInteractions();
  }

  render() {
    this.container.innerHTML = `
      <div class="mascot-wrapper">
        <!-- Speech Bubble -->
        <div class="mascot-speech-bubble" id="mascotBubble">
          <span class="speech-text">Welcome, Super Teacher! Let's make learning magical! ✨</span>
          <div class="bubble-arrow"></div>
        </div>

        <!-- SVG Animated Teacher Mom -->
        <div class="mascot-svg-wrap" id="mascotArt">
          <svg class="teacher-mom-svg" viewBox="0 0 460 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Floaty Educational Bubbles from Tablet -->
            <g class="floaty-letters">
              <g class="float-item float-item-1">
                <circle cx="340" cy="140" r="18" fill="#FFE5EC" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="340" y="146" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="16" fill="#FF5E7E">1</text>
              </g>
              <g class="float-item float-item-2">
                <circle cx="380" cy="110" r="20" fill="#E8F8F5" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="380" y="117" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="18" fill="#3AAFA9">A</text>
              </g>
              <g class="float-item float-item-3">
                <circle cx="410" cy="155" r="17" fill="#FEF9E7" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="410" y="161" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="16" fill="#F39C12">2</text>
              </g>
              <g class="float-item float-item-4">
                <circle cx="365" cy="190" r="19" fill="#EBF5FB" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="365" y="196" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="16" fill="#3498DB">B</text>
              </g>
              <g class="float-item float-item-5">
                <circle cx="430" cy="205" r="16" fill="#F4ECF7" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="430" y="211" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="15" fill="#8E44AD">3</text>
              </g>
              <g class="float-item float-item-6">
                <circle cx="320" cy="180" r="15" fill="#FDEDEC" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="320" y="185" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="14" fill="#E74C3C">C</text>
              </g>
            </g>

            <!-- Hair Back Bun -->
            <circle cx="210" cy="130" r="52" fill="#5A3828" stroke="#3D2C2E" stroke-width="4"/>
            <!-- Hair Scrunchie -->
            <circle cx="210" cy="140" r="28" fill="#FF80AB" stroke="#3D2C2E" stroke-width="3"/>
            <!-- Loose Wisps / Bun Doodles -->
            <path d="M185 100 Q 210 80 235 105" stroke="#3D2C2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>

            <!-- Torso / Teal Shirt -->
            <path d="M125 380 Q 140 330 220 330 Q 300 330 315 380 L 325 510 L 115 510 Z" fill="#64DFDF" stroke="#3D2C2E" stroke-width="4"/>
            
            <!-- Apron (Soft Salmon Pink) -->
            <path d="M150 360 C 170 350 270 350 290 360 L 305 510 L 135 510 Z" fill="#FFB7B2" stroke="#3D2C2E" stroke-width="4"/>
            <path d="M170 345 L 165 370" stroke="#3D2C2E" stroke-width="3" stroke-linecap="round"/>
            <path d="M270 345 L 275 370" stroke="#3D2C2E" stroke-width="3" stroke-linecap="round"/>

            <!-- Apron Pocket -->
            <rect x="180" y="420" width="80" height="65" rx="10" fill="#FF8A80" stroke="#3D2C2E" stroke-width="3.5"/>
            <!-- Cute Ruler & Pencil in Pocket -->
            <rect x="195" y="395" width="12" height="35" rx="2" fill="#FFE082" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(-10 195 395)"/>
            <rect x="235" y="390" width="10" height="40" rx="2" fill="#80D8FF" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(12 235 390)"/>

            <!-- Neck -->
            <rect x="200" y="300" width="40" height="40" rx="10" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3.5"/>

            <!-- Head / Face -->
            <ellipse cx="220" cy="245" rx="66" ry="72" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="4"/>

            <!-- Ears -->
            <ellipse cx="152" cy="248" rx="12" ry="16" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3.5"/>
            <ellipse cx="288" cy="248" rx="12" ry="16" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3.5"/>
            <!-- Heart Earrings -->
            <path d="M150 262 C148 259 144 260 144 263 C144 266 150 271 150 271 C150 271 156 266 156 263 C156 260 152 259 150 262 Z" fill="#FF4081"/>
            <path d="M290 262 C288 259 284 260 284 263 C284 266 290 271 290 271 C290 271 296 266 296 263 C296 260 292 259 290 262 Z" fill="#FF4081"/>

            <!-- Hair Front & Bangs -->
            <path d="M152 220 C 160 170 280 170 288 220 C 270 195 240 195 220 205 C 200 195 170 195 152 220 Z" fill="#5A3828" stroke="#3D2C2E" stroke-width="4"/>
            <!-- Left Side Hair Lock -->
            <path d="M155 210 Q 148 270 162 290" fill="none" stroke="#5A3828" stroke-width="8" stroke-linecap="round"/>
            <path d="M155 210 Q 148 270 162 290" fill="none" stroke="#3D2C2E" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Right Side Hair Lock -->
            <path d="M285 210 Q 292 270 278 290" fill="none" stroke="#5A3828" stroke-width="8" stroke-linecap="round"/>
            <path d="M285 210 Q 292 270 278 290" fill="none" stroke="#3D2C2E" stroke-width="3.5" stroke-linecap="round"/>

            <!-- Eyebrows -->
            <path d="M180 208 Q 195 200 208 208" stroke="#3D2C2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            <path d="M232 208 Q 245 200 260 208" stroke="#3D2C2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>

            <!-- Glasses Frame -->
            <g class="mascot-glasses">
              <!-- Left Rim -->
              <circle cx="194" cy="235" r="23" fill="#FFFFFF" fill-opacity="0.3" stroke="#3D2C2E" stroke-width="4.5"/>
              <!-- Right Rim -->
              <circle cx="246" cy="235" r="23" fill="#FFFFFF" fill-opacity="0.3" stroke="#3D2C2E" stroke-width="4.5"/>
              <!-- Bridge -->
              <path d="M217 232 Q 220 228 223 232" stroke="#3D2C2E" stroke-width="4.5" fill="none" stroke-linecap="round"/>
            </g>

            <!-- Eyes & Pupils (Pupils react to mouse) -->
            <g class="mascot-eyes">
              <!-- Left Eye -->
              <ellipse cx="194" cy="235" rx="9" ry="12" fill="#FFFFFF"/>
              <ellipse class="pupil-left" cx="194" cy="235" rx="6.5" ry="8.5" fill="#3D2C2E"/>
              <circle cx="192" cy="231" r="2.5" fill="#FFFFFF"/>
              <circle cx="196" cy="238" r="1.2" fill="#FFFFFF"/>

              <!-- Right Eye -->
              <ellipse cx="246" cy="235" rx="9" ry="12" fill="#FFFFFF"/>
              <ellipse class="pupil-right" cx="246" cy="235" rx="6.5" ry="8.5" fill="#3D2C2E"/>
              <circle cx="244" cy="231" r="2.5" fill="#FFFFFF"/>
              <circle cx="248" cy="238" r="1.2" fill="#FFFFFF"/>
            </g>

            <!-- Rosy Cheeks Blush -->
            <ellipse cx="170" cy="256" rx="10" ry="6" fill="#FF8A80" fill-opacity="0.6"/>
            <ellipse cx="270" cy="256" rx="10" ry="6" fill="#FF8A80" fill-opacity="0.6"/>

            <!-- Nose -->
            <path d="M220 244 Q 223 249 219 251" stroke="#3D2C2E" stroke-width="2.5" fill="none" stroke-linecap="round"/>

            <!-- Smile Mouth -->
            <g class="mascot-mouth">
              <path d="M208 262 Q 220 274 232 262" stroke="#3D2C2E" stroke-width="3.5" fill="#FF5252" stroke-linecap="round"/>
            </g>

            <!-- Left Arm holding Tablet -->
            <g class="arm-tablet">
              <path d="M140 370 Q 165 425 210 425" stroke="#FDD9B5" stroke-width="22" stroke-linecap="round" fill="none"/>
              <path d="M140 370 Q 165 425 210 425" stroke="#3D2C2E" stroke-width="28" stroke-linecap="round" fill="none" style="z-index:-1"/>
              
              <!-- Tablet Device (Silver / Lilac with Cute Apple/Heart) -->
              <g class="tablet-group" transform="rotate(-14 240 400)">
                <rect x="200" y="340" width="85" height="120" rx="12" fill="#E0E6ED" stroke="#3D2C2E" stroke-width="4"/>
                <rect x="206" y="346" width="73" height="108" rx="8" fill="#FFFFFF"/>
                <!-- Tablet Screen Graphic -->
                <circle cx="242" cy="400" r="14" fill="#FFE5EC"/>
                <path d="M242 393 C239 390 234 391 234 395 C234 399 242 405 242 405 C242 405 250 399 250 395 C250 391 245 390 242 393 Z" fill="#FF4081"/>
                <line x1="216" y1="365" x2="268" y2="365" stroke="#B0BEC5" stroke-width="3" stroke-linecap="round"/>
                <line x1="216" y1="375" x2="250" y2="375" stroke="#CFD8DC" stroke-width="3" stroke-linecap="round"/>
              </g>

              <!-- Hand Fingers gripping tablet -->
              <ellipse cx="230" cy="410" rx="9" ry="7" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3"/>
              <ellipse cx="236" cy="415" rx="8" ry="6" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3"/>
            </g>

            <!-- Right Arm / Hand (Gesturing & Waving towards Explore Button) -->
            <g class="arm-waving" id="mascotWavingArm">
              <path d="M295 370 Q 340 340 380 320" stroke="#FDD9B5" stroke-width="22" stroke-linecap="round" fill="none"/>
              <!-- Cute Open Hand with fingers gesturing -->
              <g transform="translate(375, 305)">
                <circle cx="16" cy="16" r="13" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3.5"/>
                <!-- Fingers -->
                <ellipse cx="14" cy="4" rx="4.5" ry="7" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="2.5"/>
                <ellipse cx="23" cy="6" rx="4.5" ry="7.5" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="2.5"/>
                <ellipse cx="30" cy="12" rx="4" ry="7" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="2.5"/>
                <ellipse cx="5" cy="14" rx="4.5" ry="6" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="2.5"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
    `;

    this.speechEl = this.container.querySelector('.speech-text');
    this.pupils = [
      this.container.querySelector('.pupil-left'),
      this.container.querySelector('.pupil-right')
    ];
  }

  initInteractions() {
    const mascotWrap = this.container.querySelector('.mascot-svg-wrap');
    if (!mascotWrap) return;

    // Click on mascot -> celebrate, wave, new speech
    mascotWrap.addEventListener('click', () => {
      sounds.sparkle();
      this.cheer();
      this.nextQuote();
      const rect = mascotWrap.getBoundingClientRect();
      this.showerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 3);
    });

    // Eye tracking mouse movement
    window.addEventListener('mousemove', (e) => {
      if (!this.pupils[0] || !this.pupils[1]) return;
      const rect = mascotWrap.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width * 0.48;
      const mascotCenterY = rect.top + rect.height * 0.45;

      const deltaX = (e.clientX - mascotCenterX) / window.innerWidth;
      const deltaY = (e.clientY - mascotCenterY) / window.innerHeight;

      const offsetX = Math.max(-3.5, Math.min(3.5, deltaX * 10));
      const offsetY = Math.max(-3.5, Math.min(3.5, deltaY * 10));

      this.pupils[0].style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      this.pupils[1].style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    // Random quote rotation every 10 seconds
    setInterval(() => {
      this.nextQuote();
    }, 12000);
  }

  nextQuote() {
    this.quoteIndex = (this.quoteIndex + 1) % this.quotes.length;
    this.say(this.quotes[this.quoteIndex]);
  }

  say(text) {
    if (!this.speechEl) return;
    const bubble = this.container.querySelector('#mascotBubble');
    if (bubble) {
      bubble.classList.add('pop-change');
      setTimeout(() => {
        this.speechEl.textContent = text;
        bubble.classList.remove('pop-change');
      }, 150);
    }
  }

  cheer(customText) {
    sounds.boing();
    const mascotWrap = this.container.querySelector('.mascot-svg-wrap');
    if (mascotWrap) {
      mascotWrap.classList.add('mascot-cheering');
      setTimeout(() => mascotWrap.classList.remove('mascot-cheering'), 800);
    }
    if (customText) {
      this.say(customText);
    }
  }

  showerConfetti(originX, originY, count = 40) {
    const colors = ['#FF4081', '#FFD54F', '#4DD0E1', '#7C4DFF', '#69F0AE', '#FF6E40'];
    const container = document.body;

    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.className = 'digital-confetti-piece';

      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 9 + 6;
      const isCircle = Math.random() > 0.5;

      conf.style.left = `${originX}px`;
      conf.style.top = `${originY}px`;
      conf.style.width = `${size}px`;
      conf.style.height = `${isCircle ? size : size * 1.5}px`;
      conf.style.backgroundColor = color;
      conf.style.borderRadius = isCircle ? '50%' : '3px';

      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = Math.random() * 260 + 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 120; // upward bias
      const rot = Math.random() * 720 - 360;

      conf.style.setProperty('--tx', `${tx}px`);
      conf.style.setProperty('--ty', `${ty}px`);
      conf.style.setProperty('--rot', `${rot}deg`);

      container.appendChild(conf);

      setTimeout(() => {
        conf.remove();
      }, 1100);
    }
  }
}
