// ---- Configure your 3 ad links here ----
  const ADS = [
    { icon: "📺", name: "বিজ্ঞাপন ১", url: "https://example.com/ad1" },
    { icon: "📱", name: "বিজ্ঞাপন ২", url: "https://example.com/ad2" },
    { icon: "🎬", name: "বিজ্ঞাপন ৩", url: "https://example.com/ad3" },
  ];

  const state = { viewed: new Set() };

  const adListEl       = document.getElementById('adList');
  const popupBackdrop   = document.getElementById('popupBackdrop');
  const unlockBtn       = document.getElementById('unlockBtn');
  const popupClose      = document.getElementById('popupClose');
  const progressFill    = document.getElementById('progressFill');
  const popupProgressLabel = document.getElementById('popupProgressLabel');
  const footerProgress  = document.getElementById('footerProgress');
  const statusBadge     = document.getElementById('statusBadge');
  const lockOverlay     = document.getElementById('lockOverlay');
  const videoBox        = document.getElementById('videoBox');
  const videoIframe     = document.getElementById('videoIframe');
  const allDoneMsg      = document.getElementById('allDoneMsg');

  function renderAdList(){
    adListEl.innerHTML = "";
    ADS.forEach((ad, i) => {
      const done = state.viewed.has(i);
      const item = document.createElement('div');
      item.className = 'ad-item' + (done ? ' done' : '');
      item.innerHTML = `
        <div class="ad-info">
          <div class="ad-num">${done ? '✓' : (i+1)}</div>
          <div class="ad-text">
            <div class="name">${ad.icon} ${ad.name}</div>
            <div class="url">${ad.url}</div>
          </div>
        </div>
        <button class="ad-view-btn ${done ? 'done' : ''}" data-idx="${i}" ${done ? 'disabled' : ''}>
          ${done
            ? '✓ দেখা হয়েছে'
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>
               </svg> দেখুন`
          }
        </button>`;
      adListEl.appendChild(item);
    });

    adListEl.querySelectorAll('.ad-view-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => handleAdClick(parseInt(btn.dataset.idx)));
    });
  }

  function updateProgressUI(){
    const count = state.viewed.size;
    const pct = (count / ADS.length) * 100;
    progressFill.style.width = pct + '%';
    popupProgressLabel.textContent = `${count} / ${ADS.length}`;
    footerProgress.innerHTML = `<b>${count}</b> / ${ADS.length} বিজ্ঞাপন দেখা হয়েছে`;
  }

  function handleAdClick(idx){
    window.open(ADS[idx].url, '_blank', 'noopener');
    state.viewed.add(idx);
    renderAdList();
    updateProgressUI();

    if(state.viewed.size === ADS.length){
      allDoneMsg.style.display = 'block';
      setTimeout(() => {
        closePopup();
        unlockVideo();
      }, 900);
    }
  }

  function openPopup(){
    popupBackdrop.classList.add('show');
  }
  function closePopup(){
    popupBackdrop.classList.remove('show');
  }

  function unlockVideo(){
    lockOverlay.style.opacity = '0';
    setTimeout(() => { lockOverlay.style.display = 'none'; }, 350);
    videoBox.classList.add('unlocked');
    statusBadge.classList.remove('locked');
    statusBadge.classList.add('unlocked');
    statusBadge.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.4-2"/>
      </svg>
      আনলক করা`;
  }

  unlockBtn.addEventListener('click', openPopup);
  popupClose.addEventListener('click', closePopup);
  popupBackdrop.addEventListener('click', (e) => {
    if(e.target === popupBackdrop) closePopup();
  });

  renderAdList();
  updateProgressUI();
