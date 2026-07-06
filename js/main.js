// No Deposit Bonus Casino Australia — shared site behaviour (vanilla JS, no deps)

document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Copy bonus code buttons
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.getAttribute('data-code') || '';
      var restore = btn.textContent;
      var doneText = 'Copied';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          btn.textContent = doneText;
          setTimeout(function () { btn.textContent = restore; }, 1800);
        }).catch(function () {
          fallbackCopy(code);
          btn.textContent = doneText;
          setTimeout(function () { btn.textContent = restore; }, 1800);
        });
      } else {
        fallbackCopy(code);
        btn.textContent = doneText;
        setTimeout(function () { btn.textContent = restore; }, 1800);
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // Mark current nav link active (clean, extensionless URLs — compare full paths)
  var here = location.pathname.replace(/\/index\.html$/, '/').replace(/(.)\/$/, '$1') || '/';
  document.querySelectorAll('.main-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    var target = href.replace(/(.)\/$/, '$1') || '/';
    if (target === here) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // Sticky bottom claim bar — dismissible for the session
  var claimBar = document.querySelector('.claim-bar');
  if (claimBar) {
    var barId = claimBar.getAttribute('data-bar-id') || 'default';
    var dismissKey = 'claimBarDismissed:' + barId;
    try {
      if (sessionStorage.getItem(dismissKey)) { claimBar.classList.add('hidden'); }
    } catch (e) {}
    var closeBtn = claimBar.querySelector('.cb-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        claimBar.classList.add('hidden');
        try { sessionStorage.setItem(dismissKey, '1'); } catch (e) {}
      });
    }
  }

  // Scroll-spy for in-page subnav / jump-nav tabs
  var subnavLinks = document.querySelectorAll('.review-subnav a, .jump-nav a');
  if (subnavLinks.length && 'IntersectionObserver' in window) {
    var targets = [];
    subnavLinks.forEach(function (a) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      var el = id && document.getElementById(id);
      if (el) targets.push({ link: a, el: el });
    });
    var setActive = function (link) {
      subnavLinks.forEach(function (a) { a.classList.remove('active'); });
      if (link) link.classList.add('active');
    };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var match = targets.find(function (t) { return t.el === entry.target; });
          if (match) setActive(match.link);
        }
      });
    }, { rootMargin: '-140px 0px -70% 0px', threshold: 0 });
    targets.forEach(function (t) { observer.observe(t.el); });
  }
});
