/* ==========================================================================
   Salvor Logistics — interactions
   Header · mobile nav · hero load · scroll reveal · parallax · count-up · form
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------- Mobile navigation */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) closeMenu(); });
  }

  /* ---------------------------------------------------- Header state */
  var header = document.getElementById("siteHeader");
  var onHeader = function () { if (header) header.classList.toggle("is-stuck", window.scrollY > 40); };
  onHeader();
  window.addEventListener("scroll", onHeader, { passive: true });

  /* ---------------------------------------------------- Theme toggle (dark / light)
     The saved theme is applied pre-paint by a tiny inline <head> script; here we
     just inject the toggle button and wire clicks + persistence. */
  (function () {
    var root = document.documentElement;
    var meta = document.querySelector('meta[name="theme-color"]');
    var THEME_KEY = "salvor-theme";
    var META_COLOR = { dark: "#0e1216", light: "#f3f5f9" };

    var current = function () { return root.getAttribute("data-theme") === "light" ? "light" : "dark"; };

    var btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.id = "themeToggle";
    btn.type = "button";
    btn.innerHTML =
      '<svg class="theme-toggle__icon theme-toggle__sun" aria-hidden="true"><use href="/assets/icons.svg#i-sun"></use></svg>' +
      '<svg class="theme-toggle__icon theme-toggle__moon" aria-hidden="true"><use href="/assets/icons.svg#i-moon"></use></svg>';

    var apply = function (theme, persist) {
      if (theme === "light") root.setAttribute("data-theme", "light");
      else root.removeAttribute("data-theme");
      if (meta) meta.setAttribute("content", META_COLOR[theme]);
      if (persist) { try { localStorage.setItem(THEME_KEY, theme); } catch (e) {} }
      var next = theme === "light" ? "dark" : "light";
      btn.setAttribute("aria-label", "Switch to " + next + " theme");
      btn.setAttribute("title", "Switch to " + next + " theme");
      btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    };

    var navBar = document.querySelector(".site-header .nav");
    var hamburger = document.getElementById("navToggle");
    if (navBar) {
      if (hamburger) navBar.insertBefore(btn, hamburger);
      else navBar.appendChild(btn);
    }

    apply(current(), false); // sync the button label to whatever the head script set
    btn.addEventListener("click", function () {
      apply(current() === "light" ? "dark" : "light", true);
    });
  })();

  /* ---------------------------------------------------- Scroll progress + back-to-top */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  var toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------------------------------------------------- WhatsApp click-to-chat (FAB) */
  var wa = document.createElement("a");
  wa.className = "wa-fab";
  wa.href = "https://wa.me/905364839084?text=Hello%20Salvor%20Project%2C%20I%27d%20like%20a%20quote";
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("aria-label", "Chat on WhatsApp");
  wa.innerHTML = '<svg aria-hidden="true" width="30" height="30"><use href="/assets/icons.svg#i-whatsapp"></use></svg>';
  document.body.appendChild(wa);

  var onProgress = function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? (window.scrollY / max) : 0).toFixed(4) + ")";
    toTop.classList.toggle("is-show", window.scrollY > 620);
  };
  onProgress();
  window.addEventListener("scroll", onProgress, { passive: true });

  /* ---------------------------------------------------- Hero load reveal */
  var hero = document.querySelector(".hero");
  if (hero) { requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add("is-ready"); }); }); }

  /* ---------------------------------------------------- Scroll reveal (reveal / stagger / img-reveal) */
  var revealEls = document.querySelectorAll(".reveal, .stagger, .img-reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------------------------------------------------- Parallax (data-parallax="0.15") */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !reduceMotion) {
    var ticking = false;
    var applyParallax = function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      ticking = false;
    };
    var onScrollP = function () { if (!ticking) { ticking = true; requestAnimationFrame(applyParallax); } };
    window.addEventListener("scroll", onScrollP, { passive: true });
    window.addEventListener("resize", applyParallax);
    applyParallax();
  }

  /* ---------------------------------------------------- Marquee (duplicate group for seamless loop) */
  document.querySelectorAll(".marquee__track").forEach(function (track) {
    var group = track.querySelector(".marquee__group");
    if (group) track.appendChild(group.cloneNode(true));
  });

  /* ---------------------------------------------------- Stat count-up */
  var counters = document.querySelectorAll("[data-count]");
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dur = 1600, start = null;
    var fmt = function (v) { return Math.round(v).toLocaleString("en-US"); };
    if (reduceMotion) { el.textContent = fmt(target); return; }
    var tick = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if (!("IntersectionObserver" in window)) { counters.forEach(animateCount); }
    else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* ---------------------------------------------------- Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------- Contact form */
  var form = document.getElementById("contactForm");
  if (form) {
    /* --- EmailJS config — paste these in from your EmailJS dashboard --- */
    var EMAILJS_PUBLIC_KEY    = ""; // Account → General → Public Key
    var EMAILJS_SERVICE_ID    = ""; // Email Services → your service → Service ID
    var EMAILJS_TEMPLATE_TEAM = ""; // Template that notifies your team (To: info@salvorproject.com)
    var EMAILJS_TEMPLATE_USER = ""; // Template that confirms to the customer (To: {{email}}) — optional

    var status = document.getElementById("formStatus");
    var setStatus = function (msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status is-show " + (ok ? "is-ok" : "is-err");
    };

    var emailjsReady = EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_TEAM && (typeof emailjs !== "undefined");
    if (emailjsReady) { try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (err) { emailjsReady = false; } }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var btn = form.querySelector("[type=submit]");

      var params = {
        name:     (data.get("name")    || "").toString().trim(),
        company:  (data.get("company") || "").toString().trim(),
        email:    (data.get("email")   || "").toString().trim(),
        phone:    (data.get("phone")   || "—").toString().trim(),
        service:  (data.get("service") || "").toString().trim(),
        message:  (data.get("message") || "").toString().trim()
      };
      params.reply_to = params.email; // so "Reply" in the team's inbox goes to the customer

      var buildMailto = function () {
        var subject = "Quote request — " + (params.company || params.name || "Website enquiry");
        var lines = [
          "Name: " + params.name, "Company: " + params.company,
          "Email: " + params.email, "Phone: " + params.phone,
          "Service needed: " + params.service, "", params.message
        ];
        return "mailto:info@salvorproject.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      };

      /* No EmailJS configured yet → fall back to the visitor's mail client */
      if (!emailjsReady) {
        window.location.href = buildMailto();
        setStatus("Opening your email client to send the request to info@salvorproject.com…", true);
        return;
      }

      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }

      /* 1) Notify the Salvor team (the lead — this is the one that must succeed).
         2) Best-effort confirmation to the customer (never blocks the lead).      */
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_TEAM, params)
        .then(function () {
          if (EMAILJS_TEMPLATE_USER) {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_USER, params).catch(function () {});
          }
          form.reset();
          setStatus("Thank you — your request has been received. Our team will respond within one business day.", true);
        })
        .catch(function () {
          setStatus("Something went wrong sending your request. Please email info@salvorproject.com directly.", false);
        })
        .finally(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Send request"; } });
    });
  }
})();
