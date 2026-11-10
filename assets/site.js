(function () {
  var root = document.documentElement;

  // Theme toggle (remembered per visitor)
  var themeBtn = document.querySelector("[data-theme-toggle]");
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function paintIcon() {
    if (!themeBtn) return;
    var dark = currentTheme() === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeBtn.innerHTML = dark
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  }
  if (themeBtn) {
    paintIcon();
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("pk-theme", next); } catch (e) {}
      paintIcon();
    });
  }

  // Mobile menu
  var nav = document.querySelector(".nav");
  var menuBtn = document.querySelector("[data-menu-toggle]");
  if (nav && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Hero: multilayer MXene delaminates once on load
  var layers = document.querySelectorAll(".flake-fig .layer");
  if (layers.length) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var spread = [-34, 0, 34];
    var apply = function () {
      layers.forEach(function (l, i) { l.style.transform = "translateY(" + spread[i] + "px)"; });
    };
    if (reduce) { apply(); } else { setTimeout(apply, 350); }
  }

  // Publication filters
  var filterBar = document.querySelector("[data-filters]");
  if (filterBar) {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-tags]"));
    var groups = document.querySelectorAll(".year-group");
    var count = document.querySelector("[data-count]");
    var total = items.length;
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      var f = btn.getAttribute("data-filter");
      filterBar.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      var shown = 0;
      items.forEach(function (it) {
        var ok = f === "all" || it.getAttribute("data-tags").split(" ").indexOf(f) !== -1;
        it.hidden = !ok;
        if (ok) shown++;
      });
      groups.forEach(function (g) {
        g.hidden = !g.querySelector("[data-tags]:not([hidden])");
      });
      if (count) count.textContent = f === "all"
        ? "Showing all " + total + " journal articles."
        : "Showing " + shown + " of " + total + " journal articles.";
    });
  }
})();
