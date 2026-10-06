/* Record Wall — dependency-free 3D cover gallery (sphere / cylinder / infinite wall).
   RecordWall.mount(element, options) */
(function () {
  if (window.RecordWall) return;
  var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/[^\/]*$/, '');
  var CSS = '\
.rw{transition:background-color .5s;position:relative;width:100%;height:100vh;min-height:480px;overflow:hidden;background:var(--rw-bg);color:var(--rw-fg);font-family:"Archivo",system-ui,sans-serif;-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}\
.rw,.rw[data-theme=dark]{--rw-bg:#000;--rw-fg:#f3f2f2;--rw-sub:#9b9795;--rw-rule:rgba(243,242,242,.2);--rw-ph:#141414;--rw-ph2:#1b1b1b;--rw-sh:rgba(0,0,0,.6);--rw-veil:rgba(0,0,0,.84);--rw-acc:#ec3013}\
.rw[data-theme=light]{--rw-bg:#fff;--rw-fg:#201e1d;--rw-sub:#6b6766;--rw-rule:rgba(32,30,29,.35);--rw-ph:#f0efef;--rw-ph2:#e6e5e5;--rw-sh:rgba(45,43,43,.22);--rw-veil:rgba(255,255,255,.86);--rw-acc:#ec3013}\
.rw *{box-sizing:border-box}\
.rw-stage{position:absolute;inset:0;perspective:1000px;cursor:grab;touch-action:none}\
.rw-stage.is-drag{cursor:grabbing}.rw-stage.is-drag .rw-tile{pointer-events:none}\
.rw-tilt,.rw-plane{position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d}\
.rw-plane{transition:opacity .35s}\
.rw-tile{position:absolute;transform-style:preserve-3d;cursor:pointer}\
.rw-face{position:absolute;inset:0;overflow:hidden;background:var(--rw-ph);transition:transform .55s cubic-bezier(.2,.8,.2,1),box-shadow .55s;backface-visibility:hidden;-webkit-backface-visibility:hidden}\
.rw-intro .rw-face{animation:rw-in 1.1s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:var(--d,0s)}\
.rw-tile:hover .rw-face{transform:translateZ(36px);box-shadow:0 30px 60px -20px var(--rw-sh)}\
@keyframes rw-in{from{opacity:0;transform:translateZ(-180px)}}\
.rw-face img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}\
.rw-ph{position:absolute;inset:0;background:repeating-linear-gradient(135deg,var(--rw-ph) 0 9px,var(--rw-ph2) 9px 18px)}\
.rw-ph span{position:absolute;left:10px;bottom:9px;font:500 10px/1 ui-monospace,Menlo,monospace;color:var(--rw-sub)}\
.rw-veil{position:absolute;inset:0;z-index:4;background:var(--rw-veil);-webkit-backdrop-filter:blur(24px) saturate(1.3);backdrop-filter:blur(24px) saturate(1.3);opacity:0;pointer-events:none;transition:opacity .5s ease}\
.rw.is-open .rw-veil{opacity:1;pointer-events:auto}\
.rw-card{position:absolute;z-index:5;transform-origin:0 0;overflow:hidden;display:none;box-shadow:0 40px 90px -30px var(--rw-sh);transition:transform .7s cubic-bezier(.22,.9,.12,1),opacity .3s}\
.rw-card .rw-face{animation:none!important}\
.rw-cap{position:absolute;z-index:5;opacity:0;transform:translateY(8px);transition:opacity .4s,transform .5s cubic-bezier(.2,.8,.2,1);pointer-events:none}\
.rw.is-open .rw-cap{opacity:1;transform:none;transition-delay:.25s;pointer-events:auto}\
.rw-title{font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1;text-wrap:balance}\
.rw-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));margin-top:14px;border-top:2px solid var(--rw-rule)}\
.rw-meta div{padding:10px 12px 0 0}\
.rw-meta dt{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--rw-sub);margin:0}\
.rw-meta dd{font-size:14px;font-weight:500;margin:4px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.rw-link{display:inline-block;margin-top:14px;font-size:13px;font-weight:600;color:var(--rw-fg);text-decoration:none;padding:9px 14px;border:2px solid var(--rw-rule)}\
.rw-link:hover{border-color:var(--rw-acc);color:var(--rw-acc)}\
.rw-ui{position:absolute;z-index:6;display:flex;gap:4px;align-items:center;transition:opacity .4s}\
.rw-open-ui{opacity:0;pointer-events:none}.rw.is-open .rw-open-ui{opacity:1;pointer-events:auto}\
.rw.is-open .rw-closed-ui{opacity:0;pointer-events:none}\
.rw-btn{appearance:none;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--rw-sub);font:600 13px/1 "Archivo",system-ui,sans-serif;padding:10px 12px 8px;cursor:pointer;min-height:40px;text-align:left;transition:color .2s,border-color .2s}\
.rw-btn:hover{color:var(--rw-fg)}\
.rw-btn.is-on{color:var(--rw-fg);border-bottom-color:var(--rw-acc)}\
.rw-btn:focus-visible{outline:2px solid var(--rw-acc);outline-offset:2px}\
.rw-open-ui .rw-btn{color:var(--rw-fg)}.rw-open-ui .rw-btn:hover{color:var(--rw-acc)}\
.rw-count{font:500 12px/1 ui-monospace,Menlo,monospace;color:var(--rw-sub);padding:0 8px;font-variant-numeric:tabular-nums}\
.rw-hint{position:absolute;z-index:3;left:26px;top:26px;font-size:12px;font-weight:500;color:var(--rw-sub);transition:opacity .8s;pointer-events:none}\
.rw.is-touched .rw-hint{opacity:0}\
@media (max-width:600px){.rw-hint{display:none}}';

  function injectCSS() {
    if (document.getElementById('rw-css')) return;
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;800&display=swap';
    document.head.appendChild(l);
    var s = document.createElement('style'); s.id = 'rw-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function mod(a, b) { return ((a % b) + b) % b; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function faceHTML(c, i) {
    return c.src ? '<img src="' + esc(c.src) + '" alt="' + esc(c.title) + '" decoding="async" draggable="false">'
      : '<div class="rw-ph"><span>cover ' + pad(i + 1) + '</span></div>';
  }
  var LAYOUTS = [['depth', 'Depth'], ['wall', 'Wall']];
  var DEF = { covers: [], layout: 'depth', theme: 'dark', tilt: 1, autorotate: true, switcher: true, themeSwitch: true, hint: 'Drag to explore' };

  function mount(root, opts) {
    if (root.__rw) root.__rw.destroy();
    var o = Object.assign({}, DEF, opts || {});
    injectCSS();
    var theme = o.theme === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : o.theme;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('rw'); root.setAttribute('data-theme', theme); root.style.background = '';
    root.innerHTML = '<div class="rw-stage"><div class="rw-tilt"><div class="rw-plane"></div></div></div>' +
      '<div class="rw-veil"></div><div class="rw-card"></div>' +
      '<div class="rw-cap"><div class="rw-title"></div><dl class="rw-meta"></dl><a class="rw-link" target="_blank" rel="noopener"></a></div>' +
      '<div class="rw-ui rw-open-ui" style="top:14px;left:14px"><button class="rw-btn rw-prev" type="button" aria-label="Previous">\u2190</button><span class="rw-count"></span><button class="rw-btn rw-next" type="button" aria-label="Next">\u2192</button></div>' +
      '<div class="rw-ui rw-open-ui" style="top:14px;right:14px"><button class="rw-btn rw-close" type="button">Close \u00d7</button></div>' +
      (o.switcher ? '<div class="rw-ui rw-closed-ui rw-switch" style="left:14px;bottom:18px">' + LAYOUTS.map(function (l) { return '<button class="rw-btn" type="button" data-l="' + l[0] + '">' + l[1] + '</button>'; }).join('') + '</div>' : '') +
      (o.themeSwitch ? '<div class="rw-ui rw-closed-ui rw-theme" style="right:14px;bottom:18px"><button class="rw-btn" type="button" data-t="light">Light</button><button class="rw-btn" type="button" data-t="dark">Dark</button></div>' : '') +
      (o.hint ? '<div class="rw-hint">' + esc(o.hint) + '</div>' : '');
    function q(s) { return root.querySelector(s); }
    var stage = q('.rw-stage'), tilt = q('.rw-tilt'), plane = q('.rw-plane'), card = q('.rw-card'), cap = q('.rw-cap');
    var covers = o.covers && o.covers.length ? o.covers : Array.apply(null, Array(24)).map(function (_, i) { return { title: 'Record ' + pad(i + 1) }; });
    var n = covers.length, mode = o.layout;

    var S, step, R, GZ, D, maxY, W, H, C0, R0, pool = [];
    var cur = { x: 0, y: 0, tx: 0, ty: 0 }, tgt = { x: 0, y: 0, tx: 0, ty: 0 }, vel = { x: 0, y: 0 };
    var raf = 0, drag = null, openI = -1, openEl = null, busy = false, hovering = false, visible = true, built = false;

    function addTile(i, extra) {
      var el = document.createElement('div'); el.className = 'rw-tile'; el.dataset.i = i;
      el.style.width = el.style.height = S + 'px'; el.style.left = el.style.top = (-S / 2) + 'px';
      var f = document.createElement('div'); f.className = 'rw-face'; f.innerHTML = faceHTML(covers[i], i);
      plane.appendChild(el); el.appendChild(f);
      var t = Object.assign({ el: el, face: f, i: i }, extra); pool.push(t); return t;
    }

    function build(intro) {
      var w = root.clientWidth, h = root.clientHeight, base = clamp(Math.min(w / 4.4, h / 3.4), 100, 230);
      plane.innerHTML = ''; pool = [];
      root.classList.toggle('rw-intro', !!intro);
      if (mode === 'depth') {
        S = Math.round(base * 0.6); GZ = 190;
        var M = Math.max(28, Math.min(44, n)); D = M * GZ;
        var rx = w / 2 - S * 0.2, ry = h / 2 - S * 0.25;
        for (var k = 0; k < M; k++) {
          var ang = k * 2.39996323, rad = 0.38 + 0.6 * ((k * 0.618034) % 1);
          var t = addTile(k % n, { k: k, bx: Math.cos(ang) * rad * rx, by: Math.sin(ang) * rad * ry, bz: k * GZ });
          t.i = -1; t.face.style.setProperty('--d', (0.1 + (M - k) * 0.02).toFixed(3) + 's');
        }
        maxY = Infinity;
      } else {
        S = Math.round(base); step = Math.round(S * 1.14);
        C0 = Math.max(2, Math.ceil(Math.sqrt(n * 2))); R0 = Math.ceil(n / C0);
        var PC = Math.max(C0, Math.ceil(w * 1.6 / step) + 2), PR = Math.max(R0, Math.ceil(h * 1.9 / step) + 2);
        W = PC * step; H = PR * step;
        for (var pr = 0; pr < PR; pr++) for (var pc = 0; pc < PC; pc++) {
          var t3 = addTile(0, { c: pc - Math.floor(PC / 2), r: pr - Math.floor(PR / 2) });
          t3.i = -1; t3.face.style.setProperty('--d', (0.1 + (Math.abs(t3.c) + Math.abs(t3.r)) * 0.05).toFixed(3) + 's');
        }
        maxY = Infinity;
      }
      built = true; render(); kick();
    }

    function coverAt(c, r) { var i = mod(r, R0) * C0 + mod(c + r * 2, C0); return i % n; }

    function render() {
      var t = o.tilt, bx = mode === 'wall' ? 10 : 0;
      tilt.style.transform = 'rotateX(' + (bx - cur.ty * 7 * t) + 'deg) rotateY(' + (cur.tx * 9 * t) + 'deg)';
      if (mode === 'wall') {
        plane.style.transform = '';
        for (var k = 0; k < pool.length; k++) {
          var p = pool[k];
          var x = mod(p.c * step + cur.x + W / 2, W) - W / 2, y = mod(p.r * step + cur.y + H / 2, H) - H / 2;
          var i = coverAt(Math.round((x - cur.x) / step), Math.round((y - cur.y) / step));
          if (i !== p.i) { p.i = i; p.el.dataset.i = i; p.face.innerHTML = faceHTML(covers[i], i); }
          p.x = x; p.y = y;
          p.el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
        }
        return;
      }
      plane.style.transform = '';
      var NEAR = 760, M = pool.length;
      for (var j = 0; j < M; j++) {
        var q2 = pool[j], zz = q2.bz + cur.y, cyc = Math.floor(zz / D), z = zz - cyc * D - D + NEAR;
        var ci = mod(q2.k + cyc * M, n);
        if (ci !== q2.i) { q2.i = ci; q2.el.dataset.i = ci; q2.face.innerHTML = faceHTML(covers[ci], ci); }
        var op = Math.min(clamp((z + D - NEAR) / (GZ * 6), 0, 1), clamp((NEAR + 40 - z) / 260, 0, 1));
        q2.el.style.transform = 'translate3d(' + (q2.bx + cur.x * 0.15) + 'px,' + q2.by + 'px,' + z + 'px)';
        q2.el.style.opacity = op.toFixed(3);
        q2.el.style.visibility = (op <= 0.01 || q2.el === openEl) ? 'hidden' : '';
        q2.el.style.pointerEvents = op < 0.5 ? 'none' : '';
        q2.z = z;
      }
    }

    function autoOn() { return o.autorotate && !reduce && !hovering && !drag && openI < 0; }
    function kick() { if (!raf && visible) raf = requestAnimationFrame(tick); }
    function tick() {
      raf = 0; if (!built) return;
      if (!drag) {
        tgt.x += vel.x; tgt.y += vel.y; vel.x *= 0.93; vel.y *= 0.93;
        if (autoOn()) { if (mode === 'wall') tgt.x += 0.25; else tgt.y += 0.9; }
        var cy = clamp(tgt.y, -maxY, maxY); tgt.y += (cy - tgt.y) * 0.2; if (cy !== tgt.y) vel.y *= 0.5;
      }
      var moving = false;
      ['x', 'y', 'tx', 'ty'].forEach(function (k) {
        var d = tgt[k] - cur[k]; if (Math.abs(d) > 0.01) { cur[k] += d * (k.length > 1 ? 0.07 : 0.14); moving = true; } else cur[k] = tgt[k];
      });
      if (Math.abs(vel.x) + Math.abs(vel.y) > 0.03) moving = true;
      render();
      if (moving || autoOn()) kick();
    }

    function touched() { root.classList.add('is-touched'); }
    function onDown(e) {
      if (openI > -1 || e.button > 0) return;
      var tile = e.target.closest && e.target.closest('.rw-tile');
      drag = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now(), moved: false, tile: tile, id: e.pointerId };
      vel.x = vel.y = 0;
    }
    function onMove(e) {
      if (e.pointerType === 'mouse' && openI < 0) {
        var r = root.getBoundingClientRect();
        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        hovering = inside && !!(e.target.closest && e.target.closest('.rw-tile'));
        if (inside) { tgt.tx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1); tgt.ty = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1); kick(); }
      }
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.lx, dy = e.clientY - drag.ly;
      if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) {
        drag.moved = true; stage.classList.add('is-drag'); touched();
        try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      }
      if (!drag.moved) return;
      if (mode === 'depth') tgt.y += (dy + dx * 0.5) * 3; else { tgt.x += dx; tgt.y += dy; }
      var now = performance.now(), dt = Math.max(1, now - drag.t);
      vel.x = mode === 'depth' ? 0 : dx / dt * 16; vel.y = (mode === 'depth' ? (dy + dx * 0.5) * 3 : dy) / dt * 16;
      drag.lx = e.clientX; drag.ly = e.clientY; drag.t = now;
      kick();
    }
    function onUp() {
      if (!drag) return;
      var d = drag; drag = null; stage.classList.remove('is-drag');
      if (performance.now() - d.t > 80) vel.x = vel.y = 0;
      if (!d.moved && d.tile) open(+d.tile.dataset.i, d.tile);
      kick();
    }
    function onLeave() { hovering = false; tgt.tx = tgt.ty = 0; kick(); }
    function onWheel(e) {
      if (openI > -1) return;
      var ny = mode === 'depth' ? tgt.y + (e.deltaY + e.deltaX) * 1.6 : clamp(tgt.y - e.deltaY, -maxY, maxY), nx = mode === 'depth' ? tgt.x : tgt.x - e.deltaX;
      if (Math.abs(e.deltaX) < 0.5 && Math.abs(ny - tgt.y) < 0.5) return;
      e.preventDefault(); touched(); vel.x = vel.y = 0; tgt.x = nx; tgt.y = ny; kick();
    }

    function fill(i) {
      var c = covers[i];
      card.innerHTML = '<div class="rw-face" style="position:absolute;inset:0">' + faceHTML(c, i) + '</div>';
      q('.rw-title').textContent = c.title || '';
      q('.rw-meta').innerHTML = [['Artist', c.artist], ['Year', c.year], ['Label', c.label], ['Client', c.client]]
        .filter(function (m) { return m[1]; }).map(function (m) { return '<div><dt>' + m[0] + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join('');
      var a = q('.rw-link'); if (c.link) { a.href = c.link; a.textContent = (c.linkText || 'Listen') + ' \u2197'; a.style.display = ''; } else a.style.display = 'none';
      q('.rw-count').textContent = pad(i + 1) + ' / ' + pad(n);
    }
    function frame() {
      var w = root.clientWidth, h = root.clientHeight, s = Math.round(Math.min(h - 250, w - 48, 540));
      s = Math.max(160, s);
      var left = Math.round((w - s) / 2), top = Math.max(64, Math.round((h - s - 130) / 2));
      card.style.cssText = 'display:block;left:' + left + 'px;top:' + top + 'px;width:' + s + 'px;height:' + s + 'px';
      cap.style.cssText = 'left:' + left + 'px;width:' + s + 'px;top:' + (top + s + 20) + 'px';
      return { left: left, top: top, s: s };
    }
    function fromEl(el, f) {
      var r = el.querySelector('.rw-face').getBoundingClientRect(), rr = root.getBoundingClientRect();
      return 'translate(' + (r.left - rr.left - f.left) + 'px,' + (r.top - rr.top - f.top) + 'px) scale(' + (r.width / f.s) + ',' + (r.height / f.s) + ')';
    }
    function findEl(i) {
      var best = null, bd = Infinity;
      pool.forEach(function (p) {
        if (p.i !== i || p.el.style.visibility === 'hidden') return;
        var d = mode === 'wall' ? Math.abs(p.x) + Math.abs(p.y) : Math.abs(p.z - 200);
        if (d < bd) { bd = d; best = p.el; }
      });
      return best;
    }
    function open(i, el) {
      if (busy) return; touched(); hovering = false;
      openI = i; openEl = el; fill(i); var f = frame();
      card.style.transition = 'none'; card.style.opacity = 1; card.style.transform = fromEl(el, f);
      card.offsetWidth; card.style.transition = ''; card.style.transform = 'none';
      el.style.visibility = 'hidden'; root.classList.add('is-open');
      tgt.tx = tgt.ty = 0; kick();
    }
    function close() {
      if (openI < 0 || busy) return;
      var el = openEl || findEl(openI), f = frame(); busy = true;
      root.classList.remove('is-open');
      if (el) card.style.transform = fromEl(el, f); else card.style.opacity = 0;
      setTimeout(function () { card.style.display = 'none'; openEl = null; openI = -1; busy = false; if (el) el.style.visibility = ''; kick(); }, 700);
    }
    function go(d) {
      if (openI < 0 || busy) return;
      if (openEl) openEl.style.visibility = '';
      openI = mod(openI + d, n); openEl = findEl(openI); if (openEl) openEl.style.visibility = 'hidden';
      card.style.opacity = 0;
      setTimeout(function () { fill(openI); card.style.opacity = 1; }, 180);
    }
    function onKey(e) {
      if (openI < 0) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
    }
    function setLayout(l) {
      if (l === mode && built) return;
      mode = l; cur.x = cur.y = tgt.x = tgt.y = vel.x = vel.y = 0;
      function setTheme(t) {
      theme = t; root.setAttribute('data-theme', t);
      root.querySelectorAll('.rw-theme .rw-btn').forEach(function (b) { b.classList.toggle('is-on', b.dataset.t === t); });
      if (o.onTheme) o.onTheme(t);
    }
    root.querySelectorAll('.rw-theme .rw-btn').forEach(function (b) { b.addEventListener('click', function () { setTheme(b.dataset.t); }); });
    setTheme(theme);
    root.querySelectorAll('.rw-switch .rw-btn').forEach(function (b) { b.classList.toggle('is-on', b.dataset.l === mode); });
      build(true);
    }

    ['click', 'mousedown', 'touchstart'].forEach(function (ev) { root.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    q('.rw-veil').addEventListener('click', close);
    q('.rw-close').addEventListener('click', close);
    q('.rw-prev').addEventListener('click', function () { go(-1); });
    q('.rw-next').addEventListener('click', function () { go(1); });
    root.querySelectorAll('.rw-switch .rw-btn').forEach(function (b) { b.addEventListener('click', function () { touched(); setLayout(b.dataset.l); }); });
    var lastW = 0, lastH = 0;
    var ro = new ResizeObserver(function () {
      var w = root.clientWidth, h = root.clientHeight;
      if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2) return;
      var first = !lastW; lastW = w; lastH = h;
      if (first) setLayout(mode); else { build(false); if (openI > -1) frame(); }
    });
    ro.observe(root);
    var io = window.IntersectionObserver ? new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }) : null;
    if (io) io.observe(root);
    function onVis() { visible = !document.hidden; if (visible) kick(); }
    document.addEventListener('visibilitychange', onVis);

    var api = {
      destroy: function () {
        cancelAnimationFrame(raf); built = false;
        window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp); window.removeEventListener('keydown', onKey);
        document.removeEventListener('visibilitychange', onVis);
        ro.disconnect(); if (io) io.disconnect();
        root.innerHTML = ''; root.classList.remove('rw', 'is-open', 'is-touched', 'rw-intro'); root.__rw = null;
      },
      setLayout: setLayout
    };
    root.__rw = api;
    return api;
  }
  function readCovers(el) {
    return Array.prototype.map.call(el.querySelectorAll('img'), function (img) {
      var d = img.dataset || {}, parts = (img.getAttribute('alt') || '').split('|').map(function (x) { return x.trim(); });
      return {
        src: d.src || img.getAttribute('src') || img.currentSrc,
        title: d.title || parts[0] || '', artist: d.artist || parts[1] || '', year: d.year || parts[2] || '',
        label: d.label || parts[3] || '', client: d.client || parts[4] || '', link: d.link || parts[5] || ''
      };
    }).filter(function (c) { return c.src; });
  }
  function readConfig(el) {
    var d = el.dataset, c = {};
    if (d.layout) c.layout = d.layout;
    if (d.theme) c.theme = d.theme;
    if (d.tilt) c.tilt = parseFloat(d.tilt);
    if (d.autorotate) c.autorotate = d.autorotate !== 'false';
    if (d.switcher) c.switcher = d.switcher !== 'false';
    if (d.themeSwitch) c.themeSwitch = d.themeSwitch !== 'false';
    return c;
  }
  var autoInst = null, autoEl = null, autoCovers = null, jsonCfg = null, jsonReq = null;
  function loadJSON(url) {
    if (!jsonReq) jsonReq = fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(function (j) {
      var list = Array.isArray(j) ? j : (j.covers || []);
      var base = url.replace(/[^\/]*$/, '');
      list.forEach(function (c) { if (c.src && !/^(https?:)?\/\//.test(c.src) && c.src.indexOf('data:') !== 0) c.src = base + c.src.replace(/^\.\//, ''); });
      jsonCfg = Array.isArray(j) ? {} : j; jsonCfg.covers = list; return jsonCfg;
    }).catch(function (e) { console.warn('[RecordWall] could not load covers list', url, e); jsonCfg = {}; return jsonCfg; });
    return jsonReq;
  }
  function auto(selector, cfg) {
    selector = selector || '#record-wall';
    function check() {
      var el = document.querySelector(selector);
      if (autoInst && (!autoEl || !autoEl.isConnected || autoEl !== el)) { try { autoInst.destroy(); } catch (_) {} autoInst = null; autoEl = null; }
      if (el && (!autoInst || !el.querySelector('.rw-stage') || !el.classList.contains('rw'))) {
        var found = readCovers(el); if (found.length) autoCovers = found;
        var src = el.getAttribute('data-covers') || (BASE ? BASE + 'covers.json' : '');
        if (!autoCovers && src && !jsonCfg) { loadJSON(src).then(schedule); return; }
        if (autoInst) { try { autoInst.destroy(); } catch (_) {} }
        autoEl = el;
        var j = jsonCfg || {};
        autoInst = mount(el, Object.assign({}, cfg || {}, j, readConfig(el), { covers: autoCovers || j.covers || [] }));
      }
    }
    var pending = 0;
    function schedule() { if (!pending) pending = requestAnimationFrame(function () { pending = 0; check(); }); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check); else check();
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('popstate', schedule);
  }
  window.RecordWall = { mount: mount, auto: auto };
  if (!window.RECORD_WALL_MANUAL) auto('#record-wall');

})();
