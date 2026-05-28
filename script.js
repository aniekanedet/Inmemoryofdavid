
  
  // ─── HAMBURGER MENU ───
  // ─── HAMBURGER MENU ───
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const backdrop   = document.getElementById('nav-backdrop');

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  if (backdrop) backdrop.addEventListener('click', closeMenu);
  // Close on nav link click
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu(); });

  // ─── COUNTDOWN TIMER ───
  const funeralDate = new Date('2026-06-12T10:00:00');
  function updateCountdown() {
    const now = new Date();
    const diff = funeralDate - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '0';
      document.getElementById('cd-hours').textContent = '0';
      document.getElementById('cd-mins').textContent = '0';
      document.getElementById('cd-secs').textContent = '0';
      return;
    }
    const days  = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const mins  = Math.floor((diff % (1000*60*60)) / (1000*60));
    const secs  = Math.floor((diff % (1000*60)) / 1000);
    document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ─── TRIBUTE CAROUSEL ───
  const track = document.getElementById('tributes-track');
  document.getElementById('tribute-prev').addEventListener('click', () => {
    track.scrollBy({ left: -340, behavior: 'smooth' });
  });
  document.getElementById('tribute-next').addEventListener('click', () => {
    track.scrollBy({ left: 340, behavior: 'smooth' });
  });

  // ─── CANDLE LIGHTING ───
  let candleCount = 127;
  const heroEl = document.querySelector('.hero');
  function triggerHeroGlow(duration = 4000) {
    if (!heroEl) return;
    heroEl.classList.add('hero--glow');
    if (heroEl._glowTimeout) clearTimeout(heroEl._glowTimeout);
    heroEl._glowTimeout = setTimeout(() => heroEl.classList.remove('hero--glow'), duration);
  }

  document.getElementById('light-candle-btn').addEventListener('click', function() {
    candleCount++;
    document.getElementById('candle-count').textContent = candleCount;
    this.textContent = 'Candle lit ✦';
    this.style.color = 'var(--gold-accent)';
    this.disabled = true;
    // Add a new candle visually (particle)
    spawnCandleParticle();
    // Trigger hero glow briefly
    triggerHeroGlow(4000);
  });

  function spawnCandleParticle() {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; pointer-events:none;
      width:8px; height:14px;
      background: linear-gradient(to top, #ff9500, #ffcc00);
      border-radius: 50% 50% 35% 35%;
      left: ${40 + Math.random()*30}px;
      bottom: ${80 + Math.random()*40}px;
      z-index: 9999;
      animation: float-up 1.5s ease forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  // ─── SCROLL REVEAL ───
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  // ─── FILE UPLOAD LABELS ───
  document.querySelectorAll('.upload-zone input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
      const label = this.closest('.upload-zone').querySelector('.upload-zone__text');
      if (this.files.length > 0) {
        label.innerHTML = `<strong style="color:var(--primary)">${this.files[0].name}</strong>`;
      }
    });
  });

  // Shared photo preview (upload-sec)
  const sharedInput = document.getElementById('shared-photo');
  const sharedPreview = document.getElementById('prev-shared');
  const rmShared = document.getElementById('rm-shared');
  if (sharedInput) {
    sharedInput.addEventListener('change', function() {
      const file = this.files && this.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        sharedPreview.src = url;
        sharedPreview.style.display = 'block';
        rmShared.style.display = 'flex';
      } else {
        if (sharedPreview.src) URL.revokeObjectURL(sharedPreview.src);
        sharedPreview.src = '';
        sharedPreview.style.display = 'none';
        rmShared.style.display = 'none';
      }
    });
  }

  // Expose removePhoto to global scope for inline handlers
  window.removePhoto = function(which) {
    if (which === 'shared') {
      if (!sharedInput) return;
      sharedInput.value = '';
      if (sharedPreview && sharedPreview.src) {
        try { URL.revokeObjectURL(sharedPreview.src); } catch (e) {}
        sharedPreview.src = '';
        sharedPreview.style.display = 'none';
      }
      if (rmShared) rmShared.style.display = 'none';
    }
  };

  // Wire remove button
  if (rmShared) rmShared.addEventListener('click', () => removePhoto('shared'));

  // ─── TRIBUTE FORM SUBMISSION (Netlify Forms) ───
  document.getElementById('tribute-form-el').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const txt = document.getElementById('submit-text');
    const form = this;
    
    btn.disabled = true;
    txt.textContent = 'Submitting…';

    try {
      // Collect form data (includes file inputs)
      const formData = new FormData(form);

      // Submit to Netlify Forms endpoint using multipart/form-data so files are sent
      const response = await fetch('/', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Success: hide form and show success message
        form.style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Tribute form submission error:', error);
      // Reset button on error
      btn.disabled = false;
      txt.textContent = 'Submit Tribute';
      alert('There was an error submitting your tribute. Please try again.');
    }
  });

  // ─── MUSIC TOGGLE ───
  let musicPlaying = false;
  const musicBtn = document.getElementById('music-btn');
  const bgAudio = new Audio('assets/audio/audiofile.mp3');
  bgAudio.loop = true;
  bgAudio.volume = 0.5;
  bgAudio.preload = 'auto';

  musicBtn.addEventListener('click', async () => {
    const icon = musicBtn.querySelector('.music-btn__icon');
    const tooltip = musicBtn.querySelector('.music-btn__tooltip');
    const nextState = !musicPlaying;

    if (nextState) {
      try {
        await bgAudio.play();
        musicPlaying = true;
      } catch (error) {
        console.warn('Unable to play audio:', error);
        return;
      }
    } else {
      bgAudio.pause();
      musicPlaying = false;
    }

    if (icon) icon.textContent = musicPlaying ? '🔇' : '🎵';
    if (tooltip) tooltip.textContent = musicPlaying ? 'Mute music' : 'Play ambient music';
    musicBtn.setAttribute('aria-pressed', String(musicPlaying));
    musicBtn.setAttribute('aria-label', musicPlaying ? 'Mute background music' : 'Play background music');
  });
