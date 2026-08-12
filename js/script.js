(() => {
  "use strict";

  const TABS = ["home", "profile", "gallery", "guideline", "commission", "contact"];
  const GALLERY_REPO = "Carroty-333/carroty_ninjin33";
  const GALLERY_PATH = "assets/gallery";

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
    if (tabId === "gallery") loadGallery();
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
  }

  tabLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const tabId = link.dataset.tabLink;
      if (!tabId) return;
      e.preventDefault();
      if (location.hash !== `#${tabId}`) {
        history.pushState(null, "", `#${tabId}`);
      }
      showTab(tabId);
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

  /* ---------------- FA Gallery (GitHub Contents API) ---------------- */
  let galleryLoaded = false;
  async function loadGallery() {
    if (galleryLoaded) return;
    const grid = document.getElementById("galleryGrid");
    const status = document.getElementById("galleryStatus");
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GALLERY_REPO}/contents/${GALLERY_PATH}`
      );
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const files = await res.json();
      const images = files.filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f.name));

      if (images.length === 0) {
        status.textContent = "只今準備中です。もうしばらくお待ちください…!";
        return;
      }

      galleryLoaded = true;
      status.remove();
      images.forEach((file) => {
        const { title, artist } = parseFileName(file.name);
        const item = document.createElement("button");
        item.type = "button";
        item.className = "gallery-item fade-up";
        item.innerHTML = `
          <img src="${file.download_url}" alt="${title}" loading="lazy">
          <span class="caption">${artist ? `by ${artist}` : title}</span>
        `;
        item.addEventListener("click", () => openLightbox(file.download_url, artist ? `${title} / by ${artist}` : title));
        grid.appendChild(item);
        fadeObserver.observe(item);
      });
    } catch (err) {
      status.textContent = "ギャラリーの読み込みに失敗しました。時間をおいて再度お試しください。";
      console.error(err);
    }
  }

  function parseFileName(filename) {
    const base = filename.replace(/\.[^.]+$/, "");
    const parts = base.split("-by-");
    if (parts.length === 2) {
      return { title: parts[0].replace(/-/g, " "), artist: parts[1].replace(/-/g, " ") };
    }
    return { title: base.replace(/-/g, " "), artist: "" };
  }

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
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

  /* ---------------- Header shrink on scroll ---------------- */
  const header = document.getElementById("siteHeader");
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }, { passive: true });

  /* ---------------- Init ---------------- */
  initFadeObserver();
  showTab(currentTabFromHash(), { scrollTop: false });
})();
