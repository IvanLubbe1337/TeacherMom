// Resource Store & LocalStorage Manager for TeacherMom
// Supports dynamic uploads, metadata filtering (curriculum, subject, term, year),
// ratings, reviews moderation (admin pick featured review), dynamic stats & bestsellers.

const STORAGE_KEY = 'teachermom_catalog_v3';
const REVIEWS_KEY = 'teachermom_reviews_v2';
const SETTINGS_KEY = 'teachermom_admin_settings_v2';
const AUTH_KEY = 'teachermom_admin_auth_v2';
const USERS_KEY = 'teachermom_users_v2';
const USER_SESSION_KEY = 'teachermom_user_session_v2';
const MAILING_LIST_KEY = 'teachermom_mailing_list_v2';
const CUSTOM_REQUESTS_KEY = 'teachermom_custom_requests_v2';

export const AUTHORIZED_ADMIN_EMAIL = 'teachermomroxy3@gmail.com';

export const INITIAL_RESOURCES = [
  {
    id: 'caps-gr1-phonics-wb-t1',
    title: 'Grade 1 Phonics & Handwriting Workbook 🎒',
    subtitle: 'Sound Families, CVC Blends & Letter Paths',
    resourceType: 'Workbook',
    audience: 'Schools & Parents',
    subject: 'English (HL)',
    grade: 'Grade 1',
    gradeTag: '1st',
    curriculum: 'CAPS',
    atpAligned: true,
    atpReference: 'DBE 2026 Term 1 ATP Week 1-10',
    term: 'Term 1',
    year: '2026',
    price: 95.00,
    currency: 'R',
    locked: true,
    rating: 5.0,
    reviews: 320,
    colorTheme: '#FFE5EC',
    badgeColor: '#FF80AB',
    tag: '#1 Bestseller Workbook ⭐',
    faceType: 'backpack',
    description: 'Comprehensive 52-page workbook covering single sounds, blending flashcards, handwriting paths, and vowel family workbooks aligned to DBE ATP week-by-week pacing.',
    sampleImages: [
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'caps-gr1-math-assess-t1',
    title: 'Grade 1 Term 1 Formal Math Assessment & Memo 📝',
    subtitle: 'Summative FAT 1 Task, Moderation Grid & Rubrics',
    resourceType: 'Assessment',
    audience: 'Schools & Teachers',
    subject: 'Mathematics',
    grade: 'Grade 1',
    gradeTag: '1st',
    curriculum: 'CAPS',
    atpAligned: true,
    atpReference: 'DBE Formal Assessment Task (FAT 1)',
    term: 'Term 1',
    year: '2026',
    price: 110.00,
    currency: 'R',
    locked: true,
    rating: 5.0,
    reviews: 215,
    colorTheme: '#FFF0F5',
    badgeColor: '#FF5E7E',
    tag: 'Includes Full Memo 🔥',
    faceType: 'happy-eyes',
    description: 'DBE-compliant Term 1 Formal Assessment Task with printable learner papers, step-by-step marking memorandum, weighting grid, and school moderation checklist.',
    sampleImages: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'caps-gr2-english-lp-t1',
    title: 'Grade 2 English HL 10-Week Lesson Plan Pack 📋',
    subtitle: 'Daily ATP Milestones, Phonics & Resource Links',
    resourceType: 'Lesson Plan',
    audience: 'Schools & Teachers',
    subject: 'English (HL)',
    grade: 'Grade 2',
    gradeTag: '2nd',
    curriculum: 'CAPS',
    atpAligned: true,
    atpReference: '2026 Annual Teaching Plan (ATP)',
    term: 'Term 1',
    year: '2026',
    price: 135.00,
    currency: 'R',
    locked: true,
    rating: 4.9,
    reviews: 178,
    colorTheme: '#E8F5E9',
    badgeColor: '#66BB6A',
    tag: '10-Week Plan Pack 🌿',
    faceType: 'sticky-smile',
    description: 'Complete 10-week lesson plan series broken down week-by-week and day-by-day according to DBE CAPS ATP milestones with practical differentiation tips.',
    sampleImages: []
  },
  {
    id: 'caps-fp-teaching-guide-t1',
    title: 'Foundation Phase Comprehensive Teaching Guide 📖',
    subtitle: 'Pedagogy Facilitation, Remedial Strategies & ATP Pacing',
    resourceType: 'Teaching Guide',
    audience: 'Schools & Parents',
    subject: 'Methodology & Literacy',
    grade: 'Grade R - 3',
    gradeTag: 'all',
    curriculum: 'CAPS',
    atpAligned: true,
    atpReference: 'CAPS Curriculum & Remedial Framework',
    term: 'Term 1 - 4',
    year: '2026',
    price: 140.00,
    currency: 'R',
    locked: true,
    rating: 5.0,
    reviews: 240,
    colorTheme: '#FFF9C4',
    badgeColor: '#FBC02D',
    tag: 'Master Guide 📚',
    faceType: 'happy-eyes',
    description: 'Step-by-step facilitation guide for teachers and parents: teaching tricky phonics blends, concrete-to-abstract math transitions, and mastering ATP deadlines.',
    sampleImages: []
  },
  {
    id: 'caps-gr1-math-wb-t1',
    title: 'Grade 1 Math Mania Workbook ✏️',
    subtitle: 'Numbers, Operations & Relationships',
    resourceType: 'Workbook',
    audience: 'Schools & Parents',
    subject: 'Mathematics',
    grade: 'Grade 1',
    gradeTag: '1st',
    curriculum: 'CAPS',
    atpAligned: true,
    atpReference: 'DBE 2026 Term 1 ATP Week 1-10',
    term: 'Term 1',
    year: '2026',
    price: 85.00,
    currency: 'R',
    locked: true,
    rating: 5.0,
    reviews: 280,
    colorTheme: '#E0F7FA',
    badgeColor: '#4DD0E1',
    tag: 'Math Favorite 💛',
    faceType: 'happy-eyes',
    description: '40 pages of CAPS-aligned number sense, ten-frames, counting in 1s & 2s, and playful math story mats.',
    sampleImages: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'caps-gr3-math-assess-t1',
    title: 'Grade 3 Baseline & Term 1 Math Assessment 🔢',
    subtitle: 'Diagnostic Baseline, FAT 1 Test & Marking Memo',
    resourceType: 'Assessment',
    audience: 'Schools & Teachers',
    subject: 'Mathematics',
    grade: 'Grade 3',
    gradeTag: '3rd',
    curriculum: 'CAPS',
    atpAligned: true,
    atpReference: 'DBE FAT 1 & Diagnostic Baseline',
    term: 'Term 1',
    year: '2026',
    price: 120.00,
    currency: 'R',
    locked: true,
    rating: 4.9,
    reviews: 164,
    colorTheme: '#FFF3E0',
    badgeColor: '#FFA726',
    tag: 'Memo Included ⭐',
    faceType: 'sticky-smile',
    description: 'Diagnostic baseline assessment to identify Grade 3 foundational gaps followed by official Term 1 summative tests, scoring matrices, and remedial action sheets.',
    sampleImages: []
  },
  {
    id: 'cambridge-early-reading-guide',
    title: 'Cambridge Early Reader Facilitation Guide 🦁',
    subtitle: 'Guided Reading Stages & Parent Prompts',
    resourceType: 'Teaching Guide',
    audience: 'Schools & Parents',
    subject: 'Reading & Literacy',
    grade: 'Grade 1',
    gradeTag: '1st',
    curriculum: 'Cambridge Primary',
    atpAligned: false,
    atpReference: 'Cambridge Primary Stage 1 Framework',
    term: 'Stage 1',
    year: '2026',
    price: 125.00,
    currency: 'R',
    locked: true,
    rating: 4.8,
    reviews: 88,
    colorTheme: '#F3E5F5',
    badgeColor: '#BA68C8',
    tag: 'Cambridge Primary 🦁',
    faceType: 'hero-wink',
    description: 'Illustrated short stories with multiple choice questions, draw-your-answer prompts, running records, and vocabulary flashcards.',
    sampleImages: []
  },
  {
    id: 'caps-grr-lifeskills-wb-t1',
    title: 'Grade R Early Learning Readiness Workbook 🍼',
    subtitle: 'Fine Motor & Visual Perception',
    resourceType: 'Workbook',
    audience: 'Schools & Parents',
    subject: 'Life Skills',
    grade: 'Grade R',
    gradeTag: 'pre-k',
    curriculum: 'CAPS',
    atpAligned: true,
    atpReference: 'Grade R CAPS ATP Term 1',
    term: 'Term 1',
    year: '2026',
    price: 75.00,
    currency: 'R',
    locked: true,
    rating: 4.9,
    reviews: 110,
    colorTheme: '#F3E5F5',
    badgeColor: '#BA68C8',
    tag: 'Foundation Phase ✨',
    faceType: 'wink-eyes',
    description: 'Gross and fine motor cutting exercises, color sorting, pattern matching, and healthy habits posters.',
    sampleImages: []
  },
  {
    id: 'caps-gr2-lifeskills-lp-t1',
    title: 'Grade 2 Life Skills 10-Week Lesson Plans 🎨',
    subtitle: 'Beginning Knowledge, Arts & Physical Education',
    resourceType: 'Lesson Plan',
    audience: 'Schools & Teachers',
    subject: 'Life Skills',
    grade: 'Grade 2',
    gradeTag: '2nd',
    curriculum: 'CAPS',
    atpAligned: true,
    atpReference: 'DBE 2026 Term 1 CAPS ATP',
    term: 'Term 1',
    year: '2026',
    price: 115.00,
    currency: 'R',
    locked: true,
    rating: 4.9,
    reviews: 92,
    colorTheme: '#E0F2F1',
    badgeColor: '#26A69A',
    tag: 'Ready-to-Teach 🌸',
    faceType: 'happy-eyes',
    description: 'Organized weekly life skills lesson plans aligned with DBE Term 1 themes: Healthy Living, My Senses, Safety Rules, and guided creative arts activities.',
    sampleImages: []
  }
];

export const INITIAL_CUSTOM_REQUESTS = [
  {
    id: 'req-cust-01',
    refNumber: 'TM-CUST-2026-1042',
    name: 'Mrs. Mariette Smith',
    role: 'School Head of Department (Foundation Phase)',
    school: 'Waterkloof Primary School, Pretoria',
    email: 'm.smith@waterkloofpri.co.za',
    phone: '083 456 7890',
    curriculum: 'CAPS',
    resourceType: 'Assessment',
    grade: 'Grade 2',
    subject: 'Mathematics',
    turnaround: 'Standard (5-7 business days)',
    estimatedCost: 320.00,
    status: 'In Progress',
    notes: 'Need 40-mark Term 2 Formal Assessment Task adjusted to our school weighting table with school crest and moderation checklist.',
    date: '2026-04-06'
  },
  {
    id: 'req-cust-02',
    refNumber: 'TM-CUST-2026-1088',
    name: 'David & Lisa Coetzee',
    role: 'Homeschooling Parents',
    school: 'Independent Homeschool',
    email: 'david.coetzee@homeed.co.za',
    phone: '082 987 6543',
    curriculum: 'CAPS & Cambridge Blend',
    resourceType: 'Workbook',
    grade: 'Grade 1',
    subject: 'English (HL)',
    turnaround: 'Priority (2-3 business days)',
    estimatedCost: 260.00,
    status: 'Completed',
    notes: 'Custom phonics workbook with larger fonts and tactile coloring borders for our learner with mild visual tracking needs.',
    date: '2026-04-02'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-prinsloo',
    resourceId: 'caps-gr1-phonics-t1',
    resourceTitle: 'Grade 1 Phonics Fun Pack 🎒',
    author: 'Mrs. Rachel Prinsloo',
    role: 'Grade 1 Teacher, Bloemfontein',
    avatar: '👩‍🏫',
    rating: 5,
    text: "TeacherMom's Educational resources are amazing!! Not only do they follow the ATP's to a T, the pictures are vibrant and my learners absolutely love the activities! The teachers guides also make my life so much easier",
    date: '2026-03-15',
    featured: true
  },
  {
    id: 'rev-lerato',
    resourceId: 'caps-gr1-math-t1',
    resourceTitle: 'Grade 1 Math Mania Workbook ✏️',
    author: 'Mrs. Lerato Molefe',
    role: 'Foundation Phase Teacher, Johannesburg',
    avatar: '🌸',
    rating: 5,
    text: "The CAPS alignment is spot on! The learners enjoy the playful characters and my planning time on Sunday evenings has been cut in half. Highly recommended!",
    date: '2026-03-22',
    featured: false
  },
  {
    id: 'rev-chantelle',
    resourceId: 'caps-grr-lifeskills-t1',
    resourceTitle: 'Grade R Early Learning Bundle 🍼',
    author: 'Chantelle van der Merwe',
    role: 'Homeschooling Mom, Pretoria',
    avatar: '💖',
    rating: 5,
    text: "Tactile, engaging, and no tears at the work table. The sample preview gave me total confidence before purchasing via WhatsApp. Quick delivery and lovely support!",
    date: '2026-04-02',
    featured: false
  },
  {
    id: 'rev-anneri',
    resourceId: 'caps-gr2-spelling-t1',
    resourceTitle: 'Grade 2 Spelling Stars & Phonics ⭐',
    author: 'Anneri Botha',
    role: 'Grade 2 Educator, Durbanville',
    avatar: '⭐',
    rating: 5,
    text: "My second graders are obsessed with the sticky note phoneme maps. Thank you Roxy for such creative, high quality workbooks!",
    date: '2026-04-05',
    featured: false
  }
];

export const INITIAL_USERS = [
  {
    id: 'user-prinsloo',
    name: 'Mrs. Rachel Prinsloo',
    email: 'rachel.prinsloo@bloemschool.co.za',
    role: 'Grade 1 Teacher, Bloemfontein',
    avatar: '👩‍🏫',
    provider: 'google',
    mailingList: true,
    createdAt: '2026-03-01'
  },
  {
    id: 'user-lerato',
    name: 'Mrs. Lerato Molefe',
    email: 'lerato.molefe@jhbschool.co.za',
    role: 'Foundation Phase Teacher, Johannesburg',
    avatar: '🌸',
    provider: 'custom',
    mailingList: true,
    createdAt: '2026-03-10'
  }
];

export const INITIAL_MAILING_LIST = [
  {
    email: 'rachel.prinsloo@bloemschool.co.za',
    name: 'Mrs. Rachel Prinsloo',
    role: 'Grade 1 Teacher, Bloemfontein',
    optedIn: true,
    date: '2026-03-01'
  },
  {
    email: 'lerato.molefe@jhbschool.co.za',
    name: 'Mrs. Lerato Molefe',
    role: 'Foundation Phase Teacher, Johannesburg',
    optedIn: true,
    date: '2026-03-10'
  },
  {
    email: 'chantelle.vdm@gmail.com',
    name: 'Chantelle van der Merwe',
    role: 'Homeschooling Mom, Pretoria',
    optedIn: true,
    date: '2026-04-02'
  }
];

export class ResourceStore {
  constructor() {
    this.listeners = [];
  }

  // --- Resources ---
  getResources() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].resourceType) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    this.saveResources(INITIAL_RESOURCES);
    return INITIAL_RESOURCES;
  }

  saveResources(resources) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save resources', e);
      if (e.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota reached. Pruning non-critical caches.');
      }
    }
  }

  addResource(newResource) {
    const list = this.getResources();
    const item = {
      ...newResource,
      id: newResource.id || `res-${Date.now()}`,
      resourceType: newResource.resourceType || 'Workbook',
      audience: newResource.audience || 'Schools & Parents',
      atpAligned: newResource.atpAligned !== false,
      atpReference: newResource.atpReference || (newResource.atpAligned ? 'CAPS ATP Aligned' : ''),
      locked: true,
      currency: newResource.currency || 'R',
      rating: parseFloat(newResource.rating) || 5.0,
      reviews: parseInt(newResource.reviews, 10) || 1,
      colorTheme: newResource.colorTheme || '#FFE5EC',
      badgeColor: newResource.badgeColor || '#FF80AB',
      tag: newResource.tag || `${newResource.resourceType || 'New Resource'} ✨`,
      faceType: newResource.faceType || 'happy-eyes',
      sampleImages: newResource.sampleImages || []
    };
    list.unshift(item);
    this.saveResources(list);
    return item;
  }

  updateResource(id, updates) {
    const list = this.getResources();
    const index = list.findIndex(r => r.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      this.saveResources(list);
      return list[index];
    }
    return null;
  }

  deleteResource(id) {
    const list = this.getResources().filter(r => r.id !== id);
    this.saveResources(list);
  }

  // --- Custom Resource Requests (for Schools & Parents) ---
  getCustomRequests() {
    try {
      const stored = localStorage.getItem(CUSTOM_REQUESTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveCustomRequests(INITIAL_CUSTOM_REQUESTS);
    return INITIAL_CUSTOM_REQUESTS;
  }

  saveCustomRequests(requests) {
    try {
      localStorage.setItem(CUSTOM_REQUESTS_KEY, JSON.stringify(requests));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save custom requests', e);
    }
  }

  addCustomRequest(data) {
    const requests = this.getCustomRequests();
    const newReq = {
      id: data.id || `req-cust-${Date.now()}`,
      refNumber: data.refNumber || `TM-CUST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name || 'Anonymous Educator',
      role: data.role || 'School Teacher / Parent',
      school: data.school || 'Independent School / Home',
      email: data.email || '',
      phone: data.phone || '',
      curriculum: data.curriculum || 'CAPS',
      resourceType: data.resourceType || 'Workbook',
      grade: data.grade || 'Grade 1',
      subject: data.subject || 'All Subjects',
      turnaround: data.turnaround || 'Standard (5-7 business days)',
      estimatedCost: parseFloat(data.estimatedCost) || 250.00,
      status: 'Pending Review',
      notes: data.notes || '',
      date: new Date().toISOString().split('T')[0]
    };
    requests.unshift(newReq);
    this.saveCustomRequests(requests);
    return newReq;
  }

  updateCustomRequestStatus(id, newStatus) {
    const requests = this.getCustomRequests();
    const target = requests.find(r => r.id === id);
    if (target) {
      target.status = newStatus;
      this.saveCustomRequests(requests);
    }
    return target;
  }

  deleteCustomRequest(id) {
    const requests = this.getCustomRequests().filter(r => r.id !== id);
    this.saveCustomRequests(requests);
  }

  // --- Dynamic Ratings on Resources ---
  rateResource(resourceId, newRatingStars, optionalReview = null) {
    const list = this.getResources();
    const target = list.find(r => r.id === resourceId);
    if (!target) return null;

    const currentRating = parseFloat(target.rating) || 5.0;
    const currentReviews = parseInt(target.reviews, 10) || 1;

    const totalStars = (currentRating * currentReviews) + newRatingStars;
    const updatedReviews = currentReviews + 1;
    const updatedRating = Math.round((totalStars / updatedReviews) * 10) / 10;

    target.rating = updatedRating;
    target.reviews = updatedReviews;

    this.saveResources(list);

    if (optionalReview) {
      const currentUser = this.getCurrentUser();
      this.addReview({
        resourceId,
        resourceTitle: target.title,
        rating: newRatingStars,
        author: optionalReview.author || currentUser?.name || 'Verified Educator',
        role: optionalReview.role || currentUser?.role || 'Teacher / Parent',
        userId: currentUser?.id || '',
        userEmail: currentUser?.email || '',
        provider: currentUser?.provider || 'custom',
        verified: true,
        ...optionalReview
      });
    }

    return target;
  }

  // --- Dynamic Bestsellers (ranked by best ratings and review volume) ---
  getBestsellers(limit = 3) {
    const list = this.getResources();
    // Bayesian-weighted scoring: rating multiplied by log volume
    return [...list]
      .sort((a, b) => {
        const scoreB = (parseFloat(b.rating) || 0) * Math.log10((parseInt(b.reviews, 10) || 1) + 9);
        const scoreA = (parseFloat(a.rating) || 0) * Math.log10((parseInt(a.reviews, 10) || 1) + 9);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  // --- Reviews & Testimonials Moderation ---
  getReviews() {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    this.saveReviews(INITIAL_REVIEWS);
    return INITIAL_REVIEWS;
  }

  saveReviews(reviews) {
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save reviews', e);
    }
  }

  addReview(reviewData) {
    const reviews = this.getReviews();
    const newRev = {
      id: reviewData.id || `rev-${Date.now()}`,
      resourceId: reviewData.resourceId || '',
      resourceTitle: reviewData.resourceTitle || 'Educational Resource',
      author: reviewData.author || 'Super Educator',
      role: reviewData.role || 'Teacher',
      avatar: reviewData.avatar || '👩‍🏫',
      rating: parseInt(reviewData.rating, 10) || 5,
      text: reviewData.text || '',
      date: reviewData.date || new Date().toISOString().split('T')[0],
      userId: reviewData.userId || '',
      userEmail: reviewData.userEmail || '',
      provider: reviewData.provider || 'custom',
      verified: reviewData.verified !== false,
      featured: false
    };
    reviews.unshift(newRev);
    this.saveReviews(reviews);
    return newRev;
  }

  setFeaturedReview(reviewId) {
    const reviews = this.getReviews();
    reviews.forEach(r => {
      r.featured = (r.id === reviewId);
    });
    this.saveReviews(reviews);
  }

  getFeaturedReview() {
    const reviews = this.getReviews();
    const featured = reviews.find(r => r.featured === true);
    return featured || reviews[0] || INITIAL_REVIEWS[0];
  }

  deleteReview(reviewId) {
    const reviews = this.getReviews().filter(r => r.id !== reviewId);
    if (reviews.length > 0 && !reviews.some(r => r.featured)) {
      reviews[0].featured = true;
    }
    this.saveReviews(reviews);
  }

  // --- Dynamic Stats (Happy Teachers, Resources Count, Average Rating) ---
  getStats() {
    const resources = this.getResources();
    const reviews = this.getReviews();

    // Average rating across all resources
    const totalRating = resources.reduce((acc, r) => acc + (parseFloat(r.rating) || 5.0), 0);
    const avgRating = resources.length > 0 ? (totalRating / resources.length).toFixed(1) : '5.0';

    // Resources count dynamically accounts for uploaded items with base 200+
    const totalCount = resources.length;
    const resourcesDisplay = totalCount >= 6 ? `${200 + (totalCount - 6)}+` : `${totalCount}+`;

    // Dynamic happy teachers calculation based on review/community activity
    const teacherBase = 16000 + (reviews.length * 45);
    const teachersDisplay = `${(teacherBase / 1000).toFixed(0)}k+`;

    return {
      happyTeachers: teachersDisplay,
      resourcesCount: resourcesDisplay,
      rawResourcesCount: totalCount,
      averageRating: `${avgRating}★`,
      rawAverageRating: parseFloat(avgRating)
    };
  }

  // --- Event Subscription for Reactivity ---
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb());
  }

  // --- Settings ---
  getSettings() {
    const defaults = {
      whatsappNumber: '0608316086',
      emailAddress: AUTHORIZED_ADMIN_EMAIL,
      currencySymbol: 'R',
      bankingDetails: 'TeacherMom Resources\nBank: First National Bank (FNB)\nAccount: 62000000000\nBranch: 250655'
    };
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.whatsappNumber || parsed.whatsappNumber === '+27821234567') {
          parsed.whatsappNumber = '0608316086';
          this.saveSettings(parsed);
        }
        return { ...defaults, ...parsed };
      }
    } catch (e) {}
    return defaults;
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  // --- Auth Session ---
  isAdminLoggedIn() {
    try {
      const session = localStorage.getItem(AUTH_KEY);
      if (!session) return false;
      const data = JSON.parse(session);
      return data.email === AUTHORIZED_ADMIN_EMAIL && data.loggedIn === true;
    } catch (e) {
      return false;
    }
  }

  loginAdmin(email, password) {
    if (email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        email: AUTHORIZED_ADMIN_EMAIL,
        loggedIn: true,
        loginTime: Date.now()
      }));
      return { success: true };
    }
    return { 
      success: false, 
      error: `Access Denied: Only ${AUTHORIZED_ADMIN_EMAIL} is authorized to access this administration panel.` 
    };
  }

  logoutAdmin() {
    localStorage.removeItem(AUTH_KEY);
  }

  // --- Invoice Number Generator ---
  generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `TM-${year}-${rand}`;
  }

  // --- User Authentication & Session (Google & Custom) ---
  getUsers() {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  }

  saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      this.notifyListeners();
    } catch (e) {}
  }

  getCurrentUser() {
    try {
      const session = localStorage.getItem(USER_SESSION_KEY);
      if (session) return JSON.parse(session);
    } catch (e) {}
    return null;
  }

  loginWithGoogle(customProfile = null) {
    const users = this.getUsers();
    const email = customProfile?.email?.toLowerCase().trim() || 'teacher.mom.guest@gmail.com';
    let user = users.find(u => u.email.toLowerCase() === email);

    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        name: customProfile?.name || 'Verified Google Educator',
        email: email,
        role: customProfile?.role || 'Foundation Phase Teacher',
        avatar: customProfile?.avatar || '👩‍🏫',
        provider: 'google',
        mailingList: customProfile?.mailingList !== false,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      this.saveUsers(users);
    } else {
      user.provider = 'google';
      if (customProfile?.name) user.name = customProfile.name;
      if (customProfile?.role) user.role = customProfile.role;
      if (customProfile?.mailingList !== undefined) user.mailingList = customProfile.mailingList;
      this.saveUsers(users);
    }

    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));

    // Sync mailing list preference
    if (user.mailingList) {
      this.setMailingListStatus(user.email, true, { name: user.name, role: user.role });
    }

    this.notifyListeners();
    return { success: true, user };
  }

  registerCustomUser({ name, email, password, role, city, mailingList = true }) {
    const users = this.getUsers();
    const cleanEmail = email.toLowerCase().trim();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists. Please sign in instead!' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role ? `${role}${city ? ', ' + city : ''}` : (city || 'Educator / Parent'),
      avatar: '👩‍🏫',
      provider: 'custom',
      mailingList: !!mailingList,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));

    // Sync mailing list
    if (newUser.mailingList) {
      this.setMailingListStatus(newUser.email, true, { name: newUser.name, role: newUser.role });
    } else {
      this.setMailingListStatus(newUser.email, false, { name: newUser.name, role: newUser.role });
    }

    this.notifyListeners();
    return { success: true, user: newUser };
  }

  loginCustomUser(email, password) {
    const users = this.getUsers();
    const cleanEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email. Please register first!' };
    }

    if (user.password && user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    this.notifyListeners();
    return { success: true, user };
  }

  logoutUser() {
    localStorage.removeItem(USER_SESSION_KEY);
    this.notifyListeners();
  }

  // --- Mailing List Management (Opt-In & Opt-Out) ---
  getMailingList() {
    try {
      const stored = localStorage.getItem(MAILING_LIST_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveMailingList(INITIAL_MAILING_LIST);
    return INITIAL_MAILING_LIST;
  }

  saveMailingList(list) {
    try {
      localStorage.setItem(MAILING_LIST_KEY, JSON.stringify(list));
      this.notifyListeners();
    } catch (e) {}
  }

  setMailingListStatus(email, optedIn, extra = {}) {
    const list = this.getMailingList();
    const cleanEmail = email.toLowerCase().trim();
    const existing = list.find(item => item.email.toLowerCase() === cleanEmail);

    if (existing) {
      existing.optedIn = !!optedIn;
      existing.date = new Date().toISOString().split('T')[0];
      if (extra.name) existing.name = extra.name;
      if (extra.role) existing.role = extra.role;
    } else {
      list.push({
        email: cleanEmail,
        name: extra.name || 'TeacherMom VIP',
        role: extra.role || 'Educator / Parent',
        optedIn: !!optedIn,
        date: new Date().toISOString().split('T')[0]
      });
    }

    this.saveMailingList(list);

    // Sync with active user if logged in with this email
    const current = this.getCurrentUser();
    if (current && current.email.toLowerCase() === cleanEmail) {
      current.mailingList = !!optedIn;
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(current));
    }

    this.notifyListeners();
    return { email: cleanEmail, optedIn: !!optedIn };
  }

  isSubscribed(email) {
    if (!email) return false;
    const cleanEmail = email.toLowerCase().trim();
    const list = this.getMailingList();
    const entry = list.find(item => item.email.toLowerCase() === cleanEmail);
    return entry ? entry.optedIn === true : false;
  }
}

export const resourceStore = new ResourceStore();
