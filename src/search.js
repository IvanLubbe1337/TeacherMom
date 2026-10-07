// Cartoon Search Buddy (Filt-o-Magic) with Kawaii Magnifying Glass
import { sounds } from './audio.js';

export class SearchController {
  constructor(options = {}) {
    this.onSearch = options.onSearch || (() => {});
    this.onGradeSelect = options.onGradeSelect || (() => {});
    this.searchInput = document.getElementById('searchGradeInput');
    this.searchBuddy = document.getElementById('searchBuddySvg');
    this.searchWrap = document.querySelector('.search-bar-wrap');
    this.gradePills = document.querySelectorAll('.grade-sticker-pill');

    this.init();
  }

  init() {
    if (this.searchInput) {
      // Focus squash and stretch
      this.searchInput.addEventListener('focus', () => {
        sounds.pop(650);
        if (this.searchWrap) {
          this.searchWrap.classList.add('search-active-squash');
        }
        this.animateBuddy('excited');
      });

      this.searchInput.addEventListener('blur', () => {
        if (this.searchWrap) {
          this.searchWrap.classList.remove('search-active-squash');
        }
        this.animateBuddy('idle');
      });

      // Typing reaction
      this.searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        this.animateBuddy(query.length > 0 ? 'searching' : 'idle');
        this.onSearch(query);
      });
    }

    // Grade Sticker Pills
    this.gradePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const grade = pill.dataset.grade;
        sounds.pop(580);
        
        this.gradePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        // Bouncy sticker pop effect
        pill.classList.add('pill-popped');
        setTimeout(() => pill.classList.remove('pill-popped'), 300);

        this.onGradeSelect(grade);
      });
    });

    // Idle blinking for search buddy
    setInterval(() => {
      if (document.activeElement !== this.searchInput) {
        this.blinkBuddy();
      }
    }, 4500);
  }

  animateBuddy(state) {
    if (!this.searchBuddy) return;
    const pupilL = this.searchBuddy.querySelector('.buddy-pupil-l');
    const pupilR = this.searchBuddy.querySelector('.buddy-pupil-r');
    const mouth = this.searchBuddy.querySelector('.buddy-mouth');

    if (state === 'searching') {
      if (pupilL && pupilR) {
        pupilL.setAttribute('cx', '24');
        pupilR.setAttribute('cx', '36');
      }
      if (mouth) {
        mouth.setAttribute('d', 'M 26 28 Q 30 32 34 28'); // open grin
      }
    } else if (state === 'excited') {
      if (pupilL && pupilR) {
        pupilL.setAttribute('cy', '18');
        pupilR.setAttribute('cy', '18');
      }
      if (mouth) {
        mouth.setAttribute('d', 'M 27 27 Q 30 34 33 27');
      }
    } else {
      if (pupilL && pupilR) {
        pupilL.setAttribute('cx', '22');
        pupilR.setAttribute('cx', '34');
        pupilL.setAttribute('cy', '20');
        pupilR.setAttribute('cy', '20');
      }
      if (mouth) {
        mouth.setAttribute('d', 'M 27 28 Q 30 31 33 28');
      }
    }
  }

  blinkBuddy() {
    if (!this.searchBuddy) return;
    this.searchBuddy.classList.add('buddy-blinking');
    setTimeout(() => {
      this.searchBuddy.classList.remove('buddy-blinking');
    }, 180);
  }
}
