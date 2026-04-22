(function () {
  // Theme toggle
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });

    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', function (e) {
      if (localStorage.getItem('theme')) return;
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
  }

  // Mobile nav toggle
  var navBtn = document.getElementById('nav-toggle');
  var header = document.getElementById('site-header');
  var nav = document.getElementById('site-nav');

  if (navBtn && header && nav) {
    var setOpen = function (open) {
      header.classList.toggle('is-open', open);
      navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      navBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    navBtn.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-open'));
    });

    // Close when a nav link is tapped.
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });

    // Close on Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) setOpen(false);
    });

    // Close if the viewport grows past the mobile breakpoint.
    window.matchMedia('(min-width: 641px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  // Post table of contents
  var toc = document.getElementById('post-toc');
  if (toc) {
    var tocNav = toc.querySelector('.post-toc-nav');
    var headings = document.querySelectorAll('.post-content h1[id], .post-content h2[id], .post-content h3[id]');
    if (headings.length > 0) {
      // Build a nested <ul> tree based on heading levels so only truly nested
      // headings (a sub-heading under a higher-level heading) end up inside an inner list.
      var root = document.createElement('ul');
      var stack = [{ list: root, level: 0 }];

      headings.forEach(function (h) {
        var level = parseInt(h.tagName.substring(1), 10);
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        stack[stack.length - 1].list.appendChild(li);

        var sub = document.createElement('ul');
        li.appendChild(sub);
        stack.push({ list: sub, level: level });
      });

      // Drop sub-lists that never got children (leaf headings).
      tocNav.appendChild(root);
      tocNav.querySelectorAll('ul').forEach(function (ul) {
        if (!ul.children.length) ul.remove();
      });
      toc.hidden = false;

      // Scrollspy — the current section is the last heading whose top has scrolled above a trigger line.
      // Using a scroll listener (not IntersectionObserver) so that the active state updates every
      // frame and never gets "stuck" on a heading that scrolled past without re-entering a band.
      var linksById = {};
      var allLinks = tocNav.querySelectorAll('a');
      allLinks.forEach(function (a) {
        linksById[a.getAttribute('href').slice(1)] = a;
      });

      var headingsArr = Array.prototype.slice.call(headings);
      var currentActiveId = null;

      function updateActiveToc() {
        var triggerY = 120;
        var active = null;
        for (var i = 0; i < headingsArr.length; i++) {
          if (headingsArr[i].getBoundingClientRect().top <= triggerY) {
            active = headingsArr[i];
          } else {
            break;
          }
        }
        var id = active ? active.id : null;
        if (id === currentActiveId) return;
        currentActiveId = id;

        allLinks.forEach(function (a) {
          a.classList.remove('is-active');
          if (a.parentElement) a.parentElement.classList.remove('is-active');
        });
        if (id && linksById[id]) {
          linksById[id].classList.add('is-active');
          if (linksById[id].parentElement) {
            linksById[id].parentElement.classList.add('is-active');
          }
        }
      }

      // Keep the fixed TOC from overflowing into the footer on long articles.
      // We set `bottom` on the outer box AND `max-height` on the inner nav, so
      // the scrollbar is guaranteed to engage regardless of flex quirks in how
      // the outer height propagates down.
      var footerEl = document.querySelector('.site-footer');
      var summaryEl = toc.querySelector('.post-toc-summary');
      function updateTocBounds() {
        var styles = window.getComputedStyle(toc);
        if (styles.display === 'none' || styles.position !== 'fixed') {
          toc.style.bottom = '';
          toc.style.maxHeight = '';
          tocNav.style.maxHeight = '';
          return;
        }
        var gap = 24;
        var viewportBottom = window.innerHeight;
        var footerTop = footerEl ? footerEl.getBoundingClientRect().top : Infinity;
        var tocTop = parseFloat(styles.top) || 0;
        var neededBottom = footerTop < viewportBottom
          ? (viewportBottom - footerTop + gap)
          : gap;
        toc.style.bottom = neededBottom + 'px';

        var tocHeight = viewportBottom - tocTop - neededBottom;
        var summaryHeight = summaryEl ? summaryEl.offsetHeight : 0;
        var navCap = Math.max(60, tocHeight - summaryHeight - 4);
        tocNav.style.maxHeight = navCap + 'px';
      }

      var tocTicking = false;
      function onTocScroll() {
        if (tocTicking) return;
        tocTicking = true;
        window.requestAnimationFrame(function () {
          updateActiveToc();
          updateTocBounds();
          tocTicking = false;
        });
      }

      window.addEventListener('scroll', onTocScroll, { passive: true });
      window.addEventListener('resize', onTocScroll);
      updateActiveToc();
      updateTocBounds();
    }
  }
})();
