// Magic Wand Cursor & Sparkle Particle System
import { sounds } from './audio.js';

export class MagicWandCursor {
  constructor() {
    this.enabled = true;
    this.cursorEl = null;
    this.particles = [];
    this.lastX = 0;
    this.lastY = 0;
    this.throttleTime = 0;
    this.colors = ['#FF80AB', '#FFD54F', '#4DD0E1', '#81C784', '#BA68C8', '#FFAB91'];
    this.shapes = ['★', '✦', '♥', '●', '✿'];

    this.init();
  }

  init() {
    // Wand cursor DOM element
    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'custom-wand-cursor';
    this.cursorEl.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 27L22 12" stroke="#4A3B32" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M7 27L22 12" stroke="#FFD166" stroke-width="3" stroke-linecap="round"/>
        <!-- Star Tip -->
        <polygon points="24,4 26.5,10 32,10.5 27.5,14.5 29,20 24,16.5 19,20 20.5,14.5 16,10.5 21.5,10" fill="#FF5E7E" stroke="#3D2C2E" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="24" cy="12.5" r="2" fill="#FFE5EC"/>
      </svg>
    `;
    document.body.appendChild(this.cursorEl);

    // Particle container
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'magic-particles-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Event listeners
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));

    // Hide custom cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
      this.cursorEl.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      this.cursorEl.style.opacity = '1';
    });

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  onMouseMove(e) {
    if (!this.enabled) return;

    this.cursorEl.style.transform = `translate3d(${e.clientX - 6}px, ${e.clientY - 6}px, 0)`;

    const now = performance.now();
    const dist = Math.hypot(e.clientX - this.lastX, e.clientY - this.lastY);

    if (now - this.throttleTime > 25 && dist > 6) {
      this.throttleTime = now;
      this.spawnStardust(e.clientX, e.clientY, 1 + Math.min(dist / 25, 2));
    }

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  onMouseDown(e) {
    if (!this.enabled) return;

    // Burst stars on click
    this.burstSparkles(e.clientX, e.clientY, 10);
    this.cursorEl.classList.add('wand-cast');
    setTimeout(() => this.cursorEl.classList.remove('wand-cast'), 180);
  }

  spawnStardust(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 12 - 6),
        y: y + (Math.random() * 12 - 6),
        vx: (Math.random() * 2 - 1) * 0.8,
        vy: (Math.random() * 2 - 0.5) * 0.8 + 0.4,
        size: Math.random() * 10 + 7,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        shape: this.shapes[Math.floor(Math.random() * this.shapes.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() * 0.2 - 0.1),
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  burstSparkles(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = Math.random() * 4 + 2.5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 12 + 10,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        shape: this.shapes[Math.floor(Math.random() * this.shapes.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() * 0.3 - 0.15),
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.025 + 0.02
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.life -= p.decay;
      p.alpha = Math.max(0, p.life);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.font = `${p.size}px 'Comic Neue', cursive, sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(p.shape, 0, 0);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }

  toggle() {
    this.enabled = !this.enabled;
    this.cursorEl.style.display = this.enabled ? 'block' : 'none';
    this.canvas.style.display = this.enabled ? 'block' : 'none';
    document.body.classList.toggle('default-cursor', !this.enabled);
    return this.enabled;
  }
}
