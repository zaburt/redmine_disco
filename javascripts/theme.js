/* Disco v1.0.0 — easter eggs (logo clicks, Konami code, confetti, idle ball, Alt sparkle trail) */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CLICKS = 6, GAP = 1500, count = 0, timer = null, open = null;

  function close() {
    if (!open) { return; }
    open.classList.remove('disco-show');
    var el = open;
    open = null;
    el.stopBall = true;
    setTimeout(function () { el.remove(); }, 400);
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) { if (e.key === 'Escape') { close(); } }

  // Mirror ball made of many small square mirror tiles on a sphere
  function drawBall(canvas) {
    var box = canvas.parentNode, size = box.clientWidth, dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.height = Math.round(size * dpr);
    canvas.style.width = canvas.style.height = '100%';
    var ctx = canvas.getContext('2d'), R = canvas.width / 2 - 2, C = canvas.width / 2;
    var rows = size < 120 ? 12 : 22, tiles = [], PAL = ['#FF2BD6', '#27F0FF', '#FFC933', '#B6FF3B', '#2B6BFF', '#FFFFFF'];
    for (var r = 0; r < rows; r++) {
      var la0 = -Math.PI / 2 + Math.PI * r / rows, la1 = -Math.PI / 2 + Math.PI * (r + 1) / rows;
      var mid = (la0 + la1) / 2, cols = Math.max(4, Math.round(rows * 2 * Math.cos(mid)));
      for (var c = 0; c < cols; c++) {
        tiles.push({ la0: la0, la1: la1, lo0: 2 * Math.PI * c / cols, lo1: 2 * Math.PI * (c + 1) / cols,
                     phase: Math.random() * 6.28, speed: 1 + Math.random() * 2.5,
                     tint: PAL[Math.floor(Math.random() * PAL.length)], grey: 0.7 + Math.random() * 0.3 });
      }
    }
    function pt(la, lo, rot) {
      var l = lo + rot;
      return [Math.cos(la) * Math.sin(l), Math.sin(la), Math.cos(la) * Math.cos(l)];
    }
    function frame(ms) {
      if (!document.body.contains(canvas)) { return; }
      var tt = ms / 1000, rot = reduced ? 0.6 : tt * 0.7;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0B0414';
      ctx.beginPath(); ctx.arc(C, C, R, 0, 6.2832); ctx.fill();
      for (var i = 0; i < tiles.length; i++) {
        var k = tiles[i], g = 0.07;
        var dl = (k.la1 - k.la0) * g, dn = (k.lo1 - k.lo0) * g;
        var cen = pt((k.la0 + k.la1) / 2, (k.lo0 + k.lo1) / 2, rot);
        if (cen[2] <= 0.02) { continue; }
        var P = [pt(k.la0 + dl, k.lo0 + dn, rot), pt(k.la0 + dl, k.lo1 - dn, rot),
                 pt(k.la1 - dl, k.lo1 - dn, rot), pt(k.la1 - dl, k.lo0 + dn, rot)];
        var spec = Math.max(0, cen[0] * -0.4 + cen[1] * -0.5 + cen[2] * 0.77);
        var glint = reduced ? 0 : Math.pow(Math.max(0, Math.sin(tt * k.speed + k.phase)), 5);
        var shade = 0.4 + 0.6 * cen[2] + 0.6 * Math.pow(spec, 5);
        var v = Math.min(255, Math.round(255 * k.grey * shade));
        ctx.beginPath();
        for (var j = 0; j < 4; j++) {
          var x = C + P[j][0] * R, y = C - P[j][1] * R;
          if (j === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
        ctx.closePath();
        ctx.fillStyle = 'rgb(' + Math.round(v * 0.86) + ',' + Math.round(v * 0.84) + ',' + v + ')';
        ctx.fill();
        if (glint > 0.05) {
          ctx.globalAlpha = Math.min(1, glint) * (0.45 + 0.55 * cen[2]);
          ctx.fillStyle = k.tint;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      if (!box.parentNode.stopBall) { requestAnimationFrame(frame); }
    }
    requestAnimationFrame(frame);
  }

  function show() {
    if (open) { return; }
    var o = document.createElement('div');
    o.className = 'disco-party';
    o.innerHTML =
      '<div class="disco-rays"></div>' +
      '<div class="disco-spots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="disco-string"></div>' +
      '<div class="disco-ball"><canvas></canvas></div>' +
      '<div class="disco-note">Click anywhere or press Esc to stop the music</div>';
    o.addEventListener('click', close);
    document.body.appendChild(o);
    open = o;
    drawBall(o.querySelector('canvas'));
    requestAnimationFrame(function () { o.classList.add('disco-show'); });
    document.addEventListener('keydown', onKey);
  }

  document.addEventListener('click', function (e) {
    if (open || !e.target.closest || !e.target.closest('#header > h1')) { return; }
    count++;
    clearTimeout(timer);
    timer = setTimeout(function () { count = 0; }, GAP);
    if (count >= CLICKS) { count = 0; show(); }
  });
  var COLORS = ['#FF2BD6', '#27F0FF', '#FFC933', '#B6FF3B', '#2B6BFF'];

  // Konami code toggles party mode
  var KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'], kpos = 0;
  var typed = '', floorTimer = null;
  // Perspective dance floor of glowing tiles
  function floor() {
    var f = document.querySelector('.disco-floor');
    if (f) { f.remove(); clearTimeout(floorTimer); return; }
    f = document.createElement('canvas');
    f.className = 'disco-floor';
    document.body.appendChild(f);
    var ctx = f.getContext('2d');
    function size() { f.width = window.innerWidth; f.height = window.innerHeight; }
    size();
    window.addEventListener('resize', size);
    function frame(ms) {
      if (!document.body.contains(f)) { window.removeEventListener('resize', size); return; }
      var t = reduced ? 3 : ms / 1000, W = f.width, H = f.height, hy = H * 0.42, fl = W * 0.55, cam = 0.8;
      ctx.clearRect(0, 0, W, H);
      for (var k = 15; k >= 0; k--) {
        var z0 = 1 + k * 0.8, z1 = z0 + 0.8;
        var y0 = hy + cam * fl / z0, y1 = hy + cam * fl / z1;
        var fade = Math.max(0, 1 - k / 17);
        for (var i = -14; i < 14; i++) {
          var x00 = W / 2 + i * fl / z0, x01 = W / 2 + (i + 1) * fl / z0;
          var x10 = W / 2 + i * fl / z1, x11 = W / 2 + (i + 1) * fl / z1;
          if (x01 < 0 || x00 > W) { continue; }
          var wave = Math.sin(t * 2.2 + i * 0.7 + k * 0.9) + Math.sin(t * 1.3 - i * 0.4 + k * 0.5);
          var lit = Math.max(0, wave / 2);
          var hue = (i * 24 + k * 14 + t * 80 + 3600) % 360;
          ctx.beginPath();
          ctx.moveTo(x00, y0); ctx.lineTo(x01, y0); ctx.lineTo(x11, y1); ctx.lineTo(x10, y1);
          ctx.closePath();
          ctx.fillStyle = 'hsla(' + hue + ',100%,' + (45 + 25 * lit) + '%,' + (0.15 + 0.7 * lit) * fade + ')';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.18 * fade + 0.4 * lit * fade) + ')';
          ctx.stroke();
        }
      }
      if (!reduced) { requestAnimationFrame(frame); }
    }
    requestAnimationFrame(frame);
    floorTimer = setTimeout(function () { f.remove(); }, 60000);
  }

  // Typing "floor" or "ball" outside of form fields
  document.addEventListener('keydown', function (e) {
    var el = e.target, tag = el && el.tagName;
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1 ||
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) { return; }
    typed = (typed + e.key.toLowerCase()).slice(-5);
    if (typed.slice(-5) === 'floor') { typed = ''; floor(); }
    else if (typed.slice(-4) === 'ball') { typed = ''; document.body.classList.toggle('disco-ballcursor'); }
  });

  document.addEventListener('keydown', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kpos = (k === KONAMI[kpos]) ? kpos + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kpos === KONAMI.length) { kpos = 0; document.body.classList.toggle('disco-partymode'); }
  });

  // Confetti burst
  function confetti() {
    if (reduced) { return; }
    var box = document.createElement('div');
    box.className = 'disco-confetti';
    for (var i = 0; i < 90; i++) {
      var s = document.createElement('i');
      s.style.left = Math.random() * 100 + '%';
      s.style.background = COLORS[i % COLORS.length];
      s.style.animationDuration = (2 + Math.random() * 2) + 's';
      s.style.animationDelay = (Math.random() * .6) + 's';
      s.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 5000);
  }

  // Confetti after an issue update that left the issue closed
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'issue-form') { try { sessionStorage.setItem('disco-issue', '1'); } catch (x) {} }
  });
  document.addEventListener('DOMContentLoaded', function () {
    var flag = null;
    try { flag = sessionStorage.getItem('disco-issue'); sessionStorage.removeItem('disco-issue'); } catch (x) {}
    if (flag && document.querySelector('#flash_notice') && document.querySelector('div.issue.closed')) { confetti(); }
  });

  // Idle: a small ball slowly descends after 60 seconds without activity
  var idleTimer = null, idleBall = null;
  function idleReset() {
    if (idleBall) { idleBall.remove(); idleBall = null; }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      idleBall = document.createElement('div');
      idleBall.className = 'disco-idle';
      idleBall.innerHTML = '<div class="disco-idle-string"></div><div class="disco-idle-ball"><canvas></canvas></div>';
      document.body.appendChild(idleBall);
      drawBall(idleBall.querySelector('canvas'));
    }, 60000);
  }
  ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'].forEach(function (n) {
    document.addEventListener(n, idleReset, { passive: true });
  });
  idleReset();

  // Alt held: sparkle trail behind the mouse
  var lastTrail = 0;
  document.addEventListener('mousemove', function (e) {
    if (!e.altKey || reduced) { return; }
    var now = Date.now();
    if (now - lastTrail < 40) { return; }
    lastTrail = now;
    var s = document.createElement('span');
    s.className = 'disco-trail';
    s.textContent = '\u2726';
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    s.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 900);
  });
})();
