(() => {
  "use strict";

  const TABS = ["home", "profile", "gallery", "news", "guideline", "commission", "contact"];

  /* ---------------- News items (edit this list to add/remove news) ---------------- */
  const NEWS_CATEGORY_LABELS = { notice: "お知らせ", activity: "活動情報", event: "イベント情報" };
  const NEWS_ITEMS = [
    { date: "2026.07.05", category: "activity", title: "新モデル初配信" },
    { date: "2026.07.04", category: "activity", title: "新モデルとしてReデビュー" },
    { date: "2022.04.23", category: "notice", title: "VTuberデビュー" },
  ];

  const panels = document.querySelectorAll(".tab-panel");
  const tabLinks = document.querySelectorAll("[data-tab-link]");
  const tabNav = document.getElementById("tabNav");
  const tabIndicator = document.getElementById("tabIndicator");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");

  /* ---------------- Tab switching ---------------- */
  function currentTabFromHash() {
    const hash = location.hash.replace("#", "");
    return TABS.includes(hash) ? hash : "home";
  }

  function showTab(tabId, { scrollTop = true } = {}) {
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === tabId);
    });
    tabLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.tabLink === tabId);
    });
    moveIndicator(tabId);
    closeMobileNav();
    if (scrollTop) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    triggerFadeUps();
    if (tabId === "gallery") initGallery();
    if (tabId === "contact") loadFormEmbeds(tabId);
    document.title = tabId === "home"
      ? "きゃろってぃー Official Site | 喫茶Carrol"
      : `${document.querySelector(`[data-tab-link="${tabId}"] rt`)?.textContent.trim() || ""} | きゃろってぃー`;
  }

  function moveIndicator(tabId) {
    if (!tabIndicator || !tabNav) return;
    const activeLink = tabNav.querySelector(`a[data-tab-link="${tabId}"]`);
    if (!activeLink) { tabIndicator.style.width = "0"; return; }
    const navRect = tabNav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    tabIndicator.style.left = `${linkRect.left - navRect.left}px`;
    tabIndicator.style.width = `${linkRect.width}px`;
    tabIndicator.classList.remove("is-landing");
    void tabIndicator.offsetWidth;
    tabIndicator.classList.add("is-landing");
  }

  tabLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const tabId = link.dataset.tabLink;
      if (!tabId) return;
      e.preventDefault();
      if (location.hash !== `#${tabId}`) {
        history.pushState(null, "", `#${tabId}`);
      }
      showTab(tabId, { scrollTop: !link.dataset.scrollTarget });
      if (link.dataset.scrollTarget) {
        requestAnimationFrame(() => {
          document.getElementById(link.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    });
  });

  window.addEventListener("popstate", () => showTab(currentTabFromHash(), { scrollTop: false }));
  window.addEventListener("resize", () => moveIndicator(currentTabFromHash()));

  /* ---------------- Hamburger / mobile nav ---------------- */
  function openMobileNav() {
    mobileNav.classList.add("is-open");
    mobileNavOverlay.classList.add("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    hamburgerBtn.setAttribute("aria-label", "メニューを閉じる");
  }
  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    mobileNavOverlay.classList.remove("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    hamburgerBtn.setAttribute("aria-label", "メニューを開く");
  }
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = hamburgerBtn.getAttribute("aria-expanded") === "true";
    isOpen ? closeMobileNav() : openMobileNav();
  });
  mobileNavOverlay.addEventListener("click", closeMobileNav);

  /* ---------------- Scroll-in fade animation ---------------- */
  let fadeObserver;
  function initFadeObserver() {
    fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }
  function triggerFadeUps() {
    document.querySelectorAll(".tab-panel.is-active .fade-up:not(.is-visible)").forEach((el) => {
      fadeObserver.observe(el);
    });
  }

  /* ---------------- FA Gallery ----------------
   * 新しいFAを追加するときは、この配列の末尾に1件追加するだけでOK(コーディング不要)。
   * name: 表示名 / src: 画像パス(assets/galleryフォルダに配置) / twitter: Xのプロフィール URL(任意)
   * watermark: 省略時は黒ロゴ。背景が暗い画像などで白ロゴにしたい場合だけ "white" を指定する。
   * 同じnameが既に登録済みでtwitterを省略した場合、直近に登録されたそのnameのリンクを自動で引き継ぐ。
   * 並び順はこの配列の登録順(古い順)。初期表示は新しい順(配列の逆順)。
   */
  const FA_ITEMS_RAW = [
    { name: "Pameraさん", src: "assets/gallery/fa-001-pamera.png", twitter: "" },
    { name: "ばんさん", src: "assets/gallery/fa-002-ban.png", twitter: "https://x.com/bam_boolien" },
    { name: "コタさん", src: "assets/gallery/fa-003-kota.png", twitter: "https://x.com/harikoinukota" },
    { name: "ちーさん", src: "assets/gallery/fa-004-chii.png", twitter: "https://x.com/chii_san_dayo" },
    { name: "よりさん", src: "assets/gallery/fa-005-yori.jpg", twitter: "https://x.com/yamagawa_yori" },
    { name: "ぷくぷくさん", src: "assets/gallery/fa-006-pukupuku.jpg", twitter: "" },
    { name: "ばんさん", src: "assets/gallery/fa-007-ban.png", twitter: "" },
    { name: "すやさん", src: "assets/gallery/fa-008-suya.png", twitter: "https://x.com/Glyzinier" },
    { name: "紫音さん", src: "assets/gallery/fa-009-shion.png", twitter: "https://x.com/xion_797" },
    { name: "みたけさん", src: "assets/gallery/fa-010-mitake.jpg", twitter: "https://x.com/smile_summers" },
    { name: "", src: "assets/gallery/fa-011-unknown.jpg", twitter: "" },
    { name: "コタさん", src: "assets/gallery/fa-012-kota.png", twitter: "" },
    { name: "もちるさん", src: "assets/gallery/fa-013-mochiru.jpg", twitter: "https://x.com/mo_chiru8" },
    { name: "るぅくさん", src: "assets/gallery/fa-014-rooku.png", twitter: "https://bsky.app/profile/rookyamada.bsky.social" },
    { name: "はるばるさん", src: "assets/gallery/fa-015-harubaru.jpg", twitter: "https://x.com/hakomori_vtuber" },
    { name: "くーさん", src: "assets/gallery/fa-016-ku.jpg", twitter: "https://x.com/96usagi_oxo" },
    { name: "ちーさん", src: "assets/gallery/fa-017-chii.jpg", twitter: "" },
    { name: "くーさん", src: "assets/gallery/fa-018-ku.jpg", twitter: "" },
    { name: "ひかるさん", src: "assets/gallery/fa-019-hikaru.jpg", twitter: "https://x.com/HKR_VCVT" },
    { name: "テルさん", src: "assets/gallery/fa-020-teru.jpg", twitter: "https://x.com/Teru030_A" },
    { name: "ちーさん", src: "assets/gallery/fa-021-chii.jpg", twitter: "" },
    { name: "ちーさん", src: "assets/gallery/fa-022-chii.jpg", twitter: "" },
    { name: "くーさん", src: "assets/gallery/fa-023-ku.jpg", twitter: "" },
    { name: "くーさん", src: "assets/gallery/fa-024-ku.jpg", twitter: "" },
    { name: "くーさん", src: "assets/gallery/fa-025-ku.jpg", twitter: "" },
    { name: "アオイロさん", src: "assets/gallery/fa-026-aoiro.jpg", twitter: "https://x.com/h3kt5_WW" },
    { name: "ゆうきさん", src: "assets/gallery/fa-027-yuuki.jpg", twitter: "https://x.com/yuuki_yokozuki" },
    { name: "ぷん太郎さん", src: "assets/gallery/fa-028-puntarou.jpg", twitter: "https://x.com/wayawayawaya" },
    { name: "ちゃなさん", src: "assets/gallery/fa-029-chana.jpg", twitter: "https://x.com/oochan_25" },
    { name: "ひーさん", src: "assets/gallery/fa-030-hii.jpg", twitter: "" },
    { name: "ひーさん", src: "assets/gallery/fa-031-hii.jpg", twitter: "" },
    { name: "ほたるさん", src: "assets/gallery/fa-032-hotaru.png", twitter: "https://x.com/haruno_hotaru" },
    { name: "そらさめさん", src: "assets/gallery/fa-033-sorasame.jpg", twitter: "https://x.com/SkyShark1225" },
    { name: "もちるさん", src: "assets/gallery/fa-034-mochiru.png", twitter: "" },
    { name: "胡蝶さん", src: "assets/gallery/fa-035-kocho.png", twitter: "https://x.com/Kocho_orchid" },
    { name: "くーさん", src: "assets/gallery/fa-036-ku.png", twitter: "" },
    { name: "ちーさん", src: "assets/gallery/fa-037-chii.png", twitter: "" },
    { name: "迷い子さん", src: "assets/gallery/fa-038-mayoigo.jpg", twitter: "https://x.com/mayoigo_project" },
    { name: "カイリさん", src: "assets/gallery/fa-039-kairi.png", twitter: "https://x.com/Kairi_Vmermaid" },
    { name: "ひーさん", src: "assets/gallery/fa-040-hii.jpg", twitter: "" },
  ];
  const WATERMARK_WHITE = "assets/images/watermark-no-repost-white.png";
  const WATERMARK_BLACK = "assets/images/watermark-no-repost-black.png";
  const TWITTER_ICON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M23 4.9c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.8.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.9a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 19.6a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3Z"/></svg>';

  /** 同じnameで後から登録されたぶんも、直近のtwitterリンクを自動で引き継ぐ */
  function resolveFaItems(rawItems) {
    const knownTwitter = new Map();
    return rawItems.map((item, index) => {
      let twitter = item.twitter;
      if (twitter) {
        knownTwitter.set(item.name, twitter);
      } else if (knownTwitter.has(item.name)) {
        twitter = knownTwitter.get(item.name);
      }
      return { ...item, twitter: twitter || "", order: index };
    });
  }
  const FA_ITEMS = resolveFaItems(FA_ITEMS_RAW);

  function watermarkSrcFor(item) {
    return item.watermark === "white" ? WATERMARK_WHITE : WATERMARK_BLACK;
  }

  function buildTwitterLink(name, twitter, extraClass) {
    if (!twitter) return "";
    return `<a class="gallery-caption-twitter${extraClass ? ` ${extraClass}` : ""}" href="${twitter}" target="_blank" rel="noopener" aria-label="${name}のTwitterを開く">${TWITTER_ICON_SVG}</a>`;
  }

  let galleryInitialized = false;
  let gallerySort = "new"; // "new" | "old"
  let galleryAuthor = "";

  function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const query = galleryAuthor.trim().toLowerCase();
    let items = FA_ITEMS.filter((item) => !query || item.name.toLowerCase().includes(query));
    items = items.slice().sort((a, b) => gallerySort === "old" ? a.order - b.order : b.order - a.order);

    if (items.length === 0) {
      const status = document.createElement("p");
      status.className = "gallery-status";
      status.textContent = "該当するFAがありません。";
      grid.appendChild(status);
      return;
    }

    items.forEach((item) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item fade-up";
      figure.innerHTML = `
        <button type="button" class="gallery-item-img-btn" aria-label="拡大表示: ${item.name}のFA">
          <img src="${item.src}" alt="${item.name}のFA" loading="lazy">
          <img class="gallery-watermark" src="${watermarkSrcFor(item)}" alt="" aria-hidden="true">
        </button>
        <figcaption class="gallery-caption">
          <span class="gallery-caption-name">${item.name}</span>
          ${buildTwitterLink(item.name, item.twitter)}
        </figcaption>
      `;
      figure.querySelector(".gallery-item-img-btn").addEventListener("click", () => openLightbox(item));
      grid.appendChild(figure);
      fadeObserver.observe(figure);
    });
  }

  function initGallery() {
    if (galleryInitialized) return;
    galleryInitialized = true;

    const searchSelect = document.getElementById("gallerySearchSelect");
    const searchInput = document.getElementById("gallerySearchText");
    if (searchSelect) {
      const seen = new Set();
      FA_ITEMS.forEach((item) => {
        if (seen.has(item.name)) return;
        seen.add(item.name);
        const opt = document.createElement("option");
        opt.value = item.name;
        opt.textContent = item.name;
        searchSelect.appendChild(opt);
      });
      searchSelect.addEventListener("change", () => {
        galleryAuthor = searchSelect.value;
        if (searchInput) searchInput.value = searchSelect.value;
        renderGallery();
      });
    }
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        galleryAuthor = searchInput.value;
        if (searchSelect) searchSelect.value = "";
        renderGallery();
      });
    }

    document.querySelectorAll("[data-gallery-sort]").forEach((btn) => {
      btn.addEventListener("click", () => {
        gallerySort = btn.dataset.gallerySort;
        document.querySelectorAll("[data-gallery-sort]").forEach((b) => b.classList.toggle("is-active", b === btn));
        renderGallery();
      });
    });

    renderGallery();
  }

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxWatermark = document.getElementById("lightboxWatermark");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(item) {
    lightboxImg.src = item.src;
    lightboxImg.alt = `${item.name}のFA`;
    lightboxWatermark.src = watermarkSrcFor(item);
    lightboxCaption.innerHTML = `<span>${item.name}</span>${buildTwitterLink(item.name, item.twitter, "lightbox-twitter")}`;
    lightbox.hidden = false;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    lightboxCaption.innerHTML = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* ---------------- Contact/Commission form embed (desktop, loaded on tab open) ---------------- */
  function loadFormEmbeds(tabId) {
    if (!window.matchMedia("(min-width: 900px)").matches) return;
    const panel = document.querySelector(`.tab-panel[data-panel="${tabId}"]`);
    if (!panel) return;
    panel.querySelectorAll(".contact-form-embed-desktop[data-form-src]").forEach((el) => {
      const iframe = document.createElement("iframe");
      iframe.src = el.dataset.formSrc;
      iframe.width = "100%";
      iframe.height = "1050";
      iframe.frameBorder = "0";
      iframe.title = el.dataset.formTitle || "";
      el.appendChild(iframe);
      el.removeAttribute("data-form-src");
    });
  }

  document.querySelectorAll("[data-contact-form-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!window.matchMedia("(min-width: 900px)").matches) return;
      event.preventDefault();
      loadFormEmbeds("contact");
      requestAnimationFrame(() => {
        document.getElementById("contactFormEmbed")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  });

  /* ---------------- First-load intro ---------------- */
  const siteIntro = document.getElementById("siteIntro");

  if (siteIntro) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      siteIntro.remove();
    } else {
      const leftCurtain = siteIntro.querySelector(".intro-curtain-l");
      let introRemoved = false;

      function removeIntro() {
        if (introRemoved) return;

        introRemoved = true;
        siteIntro.remove();
      }

      leftCurtain?.addEventListener("animationend", (event) => {
        if (event.animationName === "introCurtainLeftTimeline") {
          removeIntro();
        }
      });

      /*
       * animationendが発火しなかった場合の保険。
       * 通常は約4.8秒でanimationendから削除される。
       */
      window.setTimeout(removeIntro, 5200);
    }
  }

  /* ---------------- Header shrink on scroll ---------------- */
  const header = document.getElementById("siteHeader");
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }, { passive: true });

  /* ---------------- Align hero buttons so "喫茶店をのぞく" centers under the heading ---------------- */
  const heroTitle = document.querySelector(".hero-title");
  const heroActions = document.querySelector(".hero-actions");
  function alignHeroActions() {
    if (!heroTitle || !heroActions) return;
    if (!window.matchMedia("(min-width: 800px)").matches) {
      heroActions.style.transform = "none";
      return;
    }
    const middleBtn = heroActions.children[1];
    if (!middleBtn) return;
    heroActions.style.transform = "none";
    const EXTRA_LEFT_SHIFT = 56; // nudge further left than dead-center under the heading
    const titleRect = heroTitle.getBoundingClientRect();
    const btnRect = middleBtn.getBoundingClientRect();
    const shift = (titleRect.left + titleRect.width / 2) - (btnRect.left + btnRect.width / 2) - EXTRA_LEFT_SHIFT;
    heroActions.style.transform = `translateX(${shift}px)`;
  }
  window.addEventListener("resize", alignHeroActions);
  window.addEventListener("load", alignHeroActions);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignHeroActions);
  }

  /* ---------------- News lists (home preview + full News tab) ---------------- */
  function renderNewsItem(item) {
    const li = document.createElement("li");
    const tagClass = item.category === "notice" ? "news-tag-notice"
      : item.category === "event" ? "news-tag-event"
      : "news-tag-activity";
    li.innerHTML = `
      <span class="news-tag ${tagClass}">${NEWS_CATEGORY_LABELS[item.category] || item.category}</span>
      <span class="news-date">${item.date}</span>
      <span class="news-title">${item.title}</span>
    `;
    return li;
  }
  function sortedNews(order) {
    const sorted = NEWS_ITEMS.slice().sort((a, b) => a.date.localeCompare(b.date));
    return order === "asc" ? sorted : sorted.reverse();
  }
  const newsPreviewList = document.getElementById("newsPreviewList");
  if (newsPreviewList) {
    sortedNews("desc").slice(0, 5).forEach((item) => newsPreviewList.appendChild(renderNewsItem(item)));
  }

  const newsFullList = document.getElementById("newsFullList");
  const newsFilter = document.getElementById("newsFilter");
  const newsSort = document.getElementById("newsSort");
  if (newsFullList) {
    let activeCategory = "all";
    function renderFullNews() {
      newsFullList.innerHTML = "";
      sortedNews(newsSort ? newsSort.value : "desc")
        .filter((item) => activeCategory === "all" || item.category === activeCategory)
        .forEach((item) => newsFullList.appendChild(renderNewsItem(item)));
    }
    if (newsFilter) {
      newsFilter.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-news-filter]");
        if (!btn) return;
        activeCategory = btn.dataset.newsFilter;
        newsFilter.querySelectorAll(".news-filter-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
        renderFullNews();
      });
    }
    if (newsSort) {
      newsSort.addEventListener("change", renderFullNews);
    }
    renderFullNews();
  }

  /* ---------------- Video marquee: steps one item to the left every 5s, looping seamlessly ---------------- */
  const marquee = document.getElementById("videoMarquee");
  const marqueeTrack = document.getElementById("videoMarqueeTrack");
  if (marquee && marqueeTrack) {
    const originalItems = Array.from(marqueeTrack.children);
    originalItems.forEach((item) => marqueeTrack.appendChild(item.cloneNode(true)));
    let step = 0;
    let timer = null;
    function stepMarquee() {
      step += 1;
      const item = marqueeTrack.children[0];
      const itemWidth = item.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(marqueeTrack).columnGap || getComputedStyle(marqueeTrack).gap || 0);
      marqueeTrack.style.transition = "transform .8s cubic-bezier(.45, 0, .2, 1)";
      marqueeTrack.style.transform = `translateX(-${step * (itemWidth + gap)}px)`;
      if (step === originalItems.length) {
        window.setTimeout(() => {
          marqueeTrack.style.transition = "none";
          marqueeTrack.style.transform = "translateX(0)";
          step = 0;
        }, 820);
      }
    }
    function startMarquee() {
      // Always clear first: repeated start calls (e.g. rapid arrow clicks) must never stack multiple intervals.
      window.clearInterval(timer);
      timer = window.setInterval(stepMarquee, 5000);
    }
    function stopMarquee() { window.clearInterval(timer); }
    startMarquee();
    marquee.addEventListener("mouseenter", stopMarquee);
    marquee.addEventListener("mouseleave", startMarquee);

    /* Drag (PC) / swipe (mobile) to move videos left-right; resumes the auto-scroll-left when released. */
    function currentTrackX() {
      const transform = getComputedStyle(marqueeTrack).transform;
      if (transform === "none") return 0;
      return new DOMMatrixReadOnly(transform).m41;
    }
    function itemUnit() {
      const item = marqueeTrack.children[0];
      const itemWidth = item.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(marqueeTrack).columnGap || getComputedStyle(marqueeTrack).gap || 0);
      return itemWidth + gap;
    }

    let dragging = false;
    let dragMoved = false;
    let dragStartX = 0;
    let dragStartTranslate = 0;

    function onPointerDown(e) {
      // Touch/pen only: swipe on mobile. PC mouse-drag was removed (felt broken); PC uses the arrow buttons instead.
      if (e.pointerType === "mouse") return;
      dragging = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartTranslate = currentTrackX();
      stopMarquee();
      marqueeTrack.style.transition = "none";
      marqueeTrack.classList.add("is-dragging");
      marqueeTrack.setPointerCapture?.(e.pointerId);
    }
    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 4) dragMoved = true;
      marqueeTrack.style.transform = `translateX(${dragStartTranslate + dx}px)`;
    }
    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      marqueeTrack.classList.remove("is-dragging");

      const unit = itemUnit();
      const total = originalItems.length;
      let nearestStep = Math.round(-currentTrackX() / unit);
      nearestStep = ((nearestStep % total) + total) % total;
      step = nearestStep;

      marqueeTrack.style.transition = "transform .35s ease";
      marqueeTrack.style.transform = `translateX(-${step * unit}px)`;
      window.setTimeout(startMarquee, 360);
    }

    marqueeTrack.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    marqueeTrack.addEventListener("click", (e) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    /* Left/right arrow buttons: manual step, wrapping seamlessly in both directions. */
    const prevBtn = document.getElementById("videoMarqueePrev");
    const nextBtn = document.getElementById("videoMarqueeNext");
    function arrowStep(delta) {
      const total = originalItems.length;
      const unit = itemUnit();
      stopMarquee();

      if (delta < 0 && step === 0) {
        // Jump to the visually-identical clone position with no transition, then animate back one step.
        marqueeTrack.style.transition = "none";
        step = total;
        marqueeTrack.style.transform = `translateX(-${step * unit}px)`;
        void marqueeTrack.offsetWidth; // force reflow so the jump applies before the animated step below
      }

      step += delta;
      marqueeTrack.style.transition = "transform .5s cubic-bezier(.45, 0, .2, 1)";
      marqueeTrack.style.transform = `translateX(-${step * unit}px)`;

      if (step >= total) {
        window.setTimeout(() => {
          marqueeTrack.style.transition = "none";
          step = step % total;
          marqueeTrack.style.transform = `translateX(-${step * unit}px)`;
        }, 520);
      }
      window.setTimeout(startMarquee, 550);
    }
    prevBtn?.addEventListener("click", () => arrowStep(-1));
    nextBtn?.addEventListener("click", () => arrowStep(1));
  }

  /* ---------------- Profile image switchers ---------------- */
  document.querySelectorAll("[data-image-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.imageTarget);
      const src = button.dataset.imageSrc;
      if (!target || !src) return;

      const useHeightFit = button.dataset.imageFit === "height";
      const useLogoFit = button.dataset.imageFit === "logo";
      const photoStage = target.closest(".profile-photo-stage");
      target.classList.toggle("is-height-fit", useHeightFit);
      target.classList.toggle("is-logo-fit", useLogoFit);
      photoStage?.classList.remove("is-square-photo");
      if (photoStage) {
        photoStage.style.background = button.dataset.imageBackground || "#fff";
        if (photoStage.matches("a")) photoStage.href = src;
      }

      if (target.getAttribute("src") !== src) {
        target.src = src;
        target.alt = button.dataset.imageAlt || "";
        target.classList.remove("profile-switch-image");
        void target.offsetWidth;
        target.classList.add("profile-switch-image");
      }

      const group = button.closest(".profile-thumbs");
      if (group) {
        group.querySelectorAll("[data-image-target]").forEach((item) => {
          const isActive = item === button;
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });
      }
    });
  });

  /* ---------------- Profile color copy buttons ---------------- */
  document.querySelectorAll("[data-copy-color]").forEach((button) => {
    button.addEventListener("click", async () => {
      const color = button.dataset.copyColor;
      if (!color) return;

      try {
        await navigator.clipboard.writeText(color);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = color;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      button.textContent = "コピーしました！";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.textContent = "コピー";
        button.classList.remove("is-copied");
      }, 1200);
    });
  });

  /* ---------------- Twitter share button ---------------- */
  const shareBtn = document.getElementById("shareTwitterBtn");
  if (shareBtn) {
    const shareText = "きゃろってぃー公式サイト";
    shareBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(location.origin + location.pathname)}&text=${encodeURIComponent(shareText)}`;
  }

  /* ---------------- Init ---------------- */
  initFadeObserver();
  showTab(currentTabFromHash(), { scrollTop: false });
  alignHeroActions();
})();
