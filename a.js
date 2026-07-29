(function(){
  // ---- আপনার ৩টি বিজ্ঞাপন লিংক এখানে বসান ----
  var ADS = [
    { icon: "📺", name: "বিজ্ঞাপন ১", url: "https://example.com/ad1" },
    { icon: "📱", name: "বিজ্ঞাপন ২", url: "https://example.com/ad2" },
    { icon: "🎬", name: "বিজ্ঞাপন ৩", url: "https://example.com/ad3" }
  ];

  var state = { viewed: {} };
  var viewedCount = 0;

  var roots = document.querySelectorAll('.uvp-wrap');
  var root  = roots[roots.length - 1]; // এই উইজেটের নিজস্ব কন্টেইনার (একাধিক ইনস্ট্যান্স থাকলেও কনফ্লিক্ট হবে না)

  var adListEl          = root.querySelector('#uvp-adList');
  var popupBackdrop      = root.querySelector('#uvp-popupBackdrop');
  var unlockBtn          = root.querySelector('#uvp-unlockBtn');
  var popupClose         = root.querySelector('#uvp-popupClose');
  var progressFill       = root.querySelector('#uvp-progressFill');
  var popupProgressLabel = root.querySelector('#uvp-popupProgressLabel');
  var footerProgress     = root.querySelector('#uvp-footerProgress');
  var statusBadge        = root.querySelector('#uvp-statusBadge');
  var lockOverlay        = root.querySelector('#uvp-lockOverlay');
  var videoBox           = root.querySelector('#uvp-videoBox');
  var allDoneMsg          = root.querySelector('#uvp-allDoneMsg');

  function renderAdList(){
    adListEl.innerHTML = "";
    ADS.forEach(function(ad, i){
      var done = !!state.viewed[i];
      var item = document.createElement('div');
      item.className = 'uvp-ad-item' + (done ? ' uvp-done' : '');
      item.innerHTML =
        '<div class="uvp-ad-info">' +
          '<div class="uvp-ad-num">' + (done ? '✓' : (i+1)) + '</div>' +
          '<div class="uvp-ad-text">' +
            '<div class="uvp-name">' + ad.icon + ' ' + ad.name + '</div>' +
            '<div class="uvp-url">' + ad.url + '</div>' +
          '</div>' +
        '</div>' +
        '<button class="uvp-ad-view-btn' + (done ? ' uvp-done' : '') + '" data-idx="' + i + '" ' + (done ? 'disabled' : '') + '>' +
          (done
            ? '✓ দেখা হয়েছে'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg> দেখুন'
          ) +
        '</button>';
      adListEl.appendChild(item);
    });

    var btns = adListEl.querySelectorAll('.uvp-ad-view-btn:not([disabled])');
    for(var i=0;i<btns.length;i++){
      btns[i].addEventListener('click', function(e){
        handleAdClick(parseInt(e.currentTarget.getAttribute('data-idx'), 10));
      });
    }
  }

  function updateProgressUI(){
    var count = viewedCount;
    var pct = (count / ADS.length) * 100;
    progressFill.style.width = pct + '%';
    popupProgressLabel.textContent = count + ' / ' + ADS.length;
    footerProgress.innerHTML = '<b>' + count + '</b> / ' + ADS.length + ' বিজ্ঞাপন দেখা হয়েছে';
  }

  function handleAdClick(idx){
    window.open(ADS[idx].url, '_blank', 'noopener');
    if(!state.viewed[idx]){
      state.viewed[idx] = true;
      viewedCount++;
    }
    renderAdList();
    updateProgressUI();

    if(viewedCount === ADS.length){
      allDoneMsg.style.display = 'block';
      setTimeout(function(){
        closePopup();
        unlockVideo();
      }, 900);
    }
  }

  function openPopup(){ popupBackdrop.classList.add('uvp-show'); }
  function closePopup(){ popupBackdrop.classList.remove('uvp-show'); }

  function unlockVideo(){
    lockOverlay.style.opacity = '0';
    setTimeout(function(){ lockOverlay.style.display = 'none'; }, 350);
    videoBox.classList.add('uvp-unlocked');
    statusBadge.classList.remove('uvp-locked');
    statusBadge.classList.add('uvp-unlocked-badge');
    statusBadge.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.4-2"/>' +
      '</svg> আনলক করা';
  }

  unlockBtn.addEventListener('click', openPopup);
  popupClose.addEventListener('click', closePopup);
  popupBackdrop.addEventListener('click', function(e){
    if(e.target === popupBackdrop) closePopup();
  });

  renderAdList();
  updateProgressUI();
})();
