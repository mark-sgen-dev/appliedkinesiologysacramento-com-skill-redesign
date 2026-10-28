(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!still && 'IntersectionObserver' in window) {
    root.setAttribute('data-ak-motion', 'on');
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.setAttribute('data-ak-in', '');
        io.unobserve(entries[i].target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

    var targets = doc.querySelectorAll('[data-ak-reveal]');
    for (var t = 0; t < targets.length; t++) io.observe(targets[t]);

    var groups = doc.querySelectorAll('[data-ak-stagger]');
    for (var g = 0; g < groups.length; g++) {
      var kids = groups[g].children;
      for (var k = 0; k < kids.length; k++) {
        kids[k].style.setProperty('--ak-delay', (Math.min(k, 9) * 70) + 'ms');
      }
    }
  }

  var head = doc.querySelector('[data-ak-head]');
  if (head) {
    var mark = function () {
      var y = window.pageYOffset || root.scrollTop || 0;
      head.setAttribute('data-ak-stuck', y > 24 ? 'yes' : 'no');
    };
    mark();
    window.addEventListener('scroll', function () {
      if (head.__sgq) return;
      head.__sgq = true;
      window.requestAnimationFrame(function () { head.__sgq = false; mark(); });
    }, { passive: true });
  }

  var burger = doc.querySelector('.ak-burger');
  var nav = doc.getElementById('ak-menu');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      nav.setAttribute('data-ak-open', open ? 'no' : 'yes');
    });
  }
  var subs = doc.querySelectorAll('.ak-sub-btn');
  for (var s = 0; s < subs.length; s++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        for (var o = 0; o < subs.length; o++) if (subs[o] !== btn) subs[o].setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          btn.setAttribute('aria-expanded', 'true');
          var first = btn.parentNode.querySelector('.ak-sub-menu a');
          if (first) first.focus();
        }
      });
    }(subs[s]));
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    for (var o = 0; o < subs.length; o++) subs[o].setAttribute('aria-expanded', 'false');
    if (burger && nav) { burger.setAttribute('aria-expanded', 'false'); nav.setAttribute('data-ak-open', 'no'); }
  });
}());
