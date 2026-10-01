/* ============================================================
   MUCİZE KODLARIM — ortak site betiği
   Menü, alt bilgi, arka plan animasyonları, takvim, form.
   Tarih / ücret / iletişim bilgisi BURADA DEĞİL: assets/js/veri.js
   ============================================================ */
(function () {
  const MK = window.MK || {};
  const B = document.body;
  const K = B.dataset.kok || './';
  const H = MK.hizmetler || [];
  const EG = H.filter(h => h.tur === 'egitim');
  const DN = H.filter(h => h.tur === 'danismanlik');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const L = p => K + p;
  const wa = t => 'https://wa.me/' + (MK.whatsapp || '') + (t ? '?text=' + encodeURIComponent(t) : '');
  const renk = h => h.tur === 'danismanlik' ? 'var(--sage)' : 'var(--orchid)';

  /* ---------- arka plan katmanları ---------- */
  B.insertAdjacentHTML('afterbegin',
    '<canvas id="net" aria-hidden="true"></canvas>' +
    '<div class="aurora" aria-hidden="true"><span></span><span></span><span></span></div>' +
    '<div id="glow" aria-hidden="true"></div>');

  /* ---------- üst menü ---------- */
  const logo = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e08cc4"/><stop offset=".5" stop-color="#f3d9a4"/><stop offset="1" stop-color="#a9c98a"/></linearGradient></defs><path d="M10 3c0 7 12 7 12 13S10 22 10 29M22 3c0 7-12 7-12 13s12 6 12 13" stroke="url(#lg)" stroke-width="2" stroke-linecap="round"/><path d="M12 8h8M11.5 16h9M12 24h8" stroke="url(#lg)" stroke-width="1.4" opacity=".6"/></svg>';
  const mItem = h => `<a href="${L(h.yol)}" style="--c:${renk(h)}"><i></i><span>${h.menuAd}<small>${h.menuNot}</small></span></a>`;
  const theta = EG.filter(e => e.grup === 'theta'), diger = EG.filter(e => e.grup !== 'theta');
  const ust = document.getElementById('ust');
  if (ust) ust.outerHTML = `
  <header class="wrap nav">
    <div class="bar">
      <a class="brand" href="${L('')}">${logo}Mucize Kodlarım</a>
      <nav class="links" aria-label="Ana menü">
        <div class="dd"><button type="button" aria-expanded="false">Eğitimler</button>
          <div class="mega">
            <div><h6>ThetaHealing® · modül yolu</h6>${theta.map(mItem).join('')}</div>
            <div><h6>Diğer eğitimler</h6>${diger.map(mItem).join('')}
              <a href="${L('seminerler/')}#takvim" style="--c:var(--gold)"><i></i><span>Eğitim takvimi<small>tarih · ücret · kontenjan</small></span></a>
              <a href="${L('seminerler/')}" style="--c:var(--muted)"><i></i><span>Tüm eğitimler<small>hepsi tek sayfada</small></span></a></div>
          </div></div>
        <div class="dd"><button type="button" aria-expanded="false">Danışmanlık</button>
          <div class="mega sm"><div><h6>Birebir seanslar</h6>${DN.map(mItem).join('')}
            <a href="${L('danismanliklar/')}" style="--c:var(--muted)"><i></i><span>Tüm danışmanlıklar<small>karşılaştır</small></span></a></div></div></div>
        <a href="${L('hakkimda/')}" data-s="hakkimda">Hakkımda</a>
        <a href="${L('blog-yazilari/')}" data-s="blog">Blog</a>
        <a href="${L('iletisim/')}" data-s="iletisim">İletişim</a>
      </nav>
      <a class="btn btn-main nav-cta" href="${L('iletisim/')}#basvuru">Ön Başvuru →</a>
      <button class="menu-t" type="button" aria-label="Menüyü aç">☰</button>
    </div>
  </header>
  <div class="mnav" id="mnav" aria-hidden="true">
    <div class="mtop"><span class="brand">Mucize Kodlarım</span><button class="x" type="button" aria-label="Menüyü kapat">✕</button></div>
    <h6>ThetaHealing® eğitimleri</h6>${theta.map(h => `<a class="l" href="${L(h.yol)}">${h.menuAd} <small>${h.modul}</small></a>`).join('')}
    <h6>Diğer eğitimler</h6>${diger.map(h => `<a class="l" href="${L(h.yol)}">${h.menuAd} <small>sertifikalı</small></a>`).join('')}
    <a class="l" href="${L('seminerler/')}#takvim">Eğitim takvimi <small>tarih · ücret</small></a>
    <h6>Danışmanlık</h6>${DN.map(h => `<a class="l" href="${L(h.yol)}">${h.menuAd} <small>birebir</small></a>`).join('')}
    <h6>Keşfet</h6>
    <a class="l" href="${L('hakkimda/')}">Hakkımda <small>Melike Kaan</small></a>
    <a class="l" href="${L('blog-yazilari/')}">Blog <small>yazılar</small></a>
    <a class="l" href="${L('iletisim/')}">İletişim <small>whatsapp · e-posta</small></a>
    <a class="btn btn-main" href="${L('iletisim/')}#basvuru">Ön Başvuru →</a>
  </div>`;
  const aktif = B.dataset.sayfa;
  document.querySelectorAll('.links [data-s]').forEach(a => { if (a.dataset.s === aktif) a.classList.add('aktif'); });

  /* ---------- alt bilgi ---------- */
  const alt = document.getElementById('alt');
  if (alt) alt.outerHTML = `
  <footer>
    <div class="wrap">
      <div class="fgrid">
        <div><a class="brand" href="${L('')}">Mucize Kodlarım</a>
          <p class="f-ozet">ThetaHealing®, JAAS ve Spiritüel Dowsing eğitimleri ve birebir danışmanlık · İstanbul &amp; online</p></div>
        <div><h6>Keşfet</h6><ul>
          <li><a href="${L('seminerler/')}">Eğitimler</a></li><li><a href="${L('danismanliklar/')}">Danışmanlık</a></li>
          <li><a href="${L('hakkimda/')}">Hakkımda</a></li>
          <li><a href="${L('blog-yazilari/')}">Blog</a></li></ul></div>
        <div><h6>İletişim</h6><ul>
          <li><a href="${wa('Merhaba, bilgi almak istiyorum.')}" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="mailto:${MK.eposta}">${MK.eposta}</a></li>
          <li><a href="https://instagram.com/${MK.instagram}" target="_blank" rel="noopener">Instagram · @${MK.instagram}</a></li>
          <li>${MK.konum || ''}</li></ul></div>
      </div>
      <p class="disc">Bu sitedeki teknikler tıbbi muayene, teşhis ve tedavinin yerine geçmez. Teşhis ve tedavi mutlaka bir hekim tarafından yapılmalıdır. Buradaki bilgiler bir uzmanla görüşmenin yerini tutmaz.</p>
      <p class="copy">© ${new Date().getFullYear()} Kerime Melike Kaan · Mucize Kodlarım · <a href="${L('kvkk-aydinlatma-metni/')}">KVKK Aydınlatma Metni</a></p>
    </div>
  </footer>
  <div class="toast" id="toast" role="status"></div>`;

  /* ---------- iletişim bağlantıları ---------- */
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
  document.querySelectorAll('[data-eposta]').forEach(a => { a.href = 'mailto:' + MK.eposta; });
  document.querySelectorAll('[data-insta]').forEach(a => { a.href = 'https://instagram.com/' + MK.instagram; a.target = '_blank'; a.rel = 'noopener'; });

  /* ---------- takvim, tarih ve ücret ---------- */
  const bugun = new Date(); bugun.setHours(0, 0, 0, 0);
  const T = (MK.takvim || []).filter(t => t && t.tarih && new Date(t.tarih + 'T00:00:00') >= bugun)
    .sort((a, b) => a.tarih.localeCompare(b.tarih));
  const tYaz = s => { const d = new Date(s + 'T00:00:00'); return { g: String(d.getDate()).padStart(2, '0'), a: d.toLocaleDateString('tr-TR', { month: 'short' }), gun: d.toLocaleDateString('tr-TR', { weekday: 'short' }) }; };
  document.querySelectorAll('[data-takvim]').forEach(box => {
    const tek = box.dataset.takvim;
    const list = tek ? T.filter(t => t.egitim === tek) : T;
    if (!list.length) {
      box.innerHTML = `<div class="row bos"><div class="d">✦</div><div><h5>Yeni dönem tarihleri yakında</h5><p>Takvim açıklanınca burada görünecek. Şimdiden yer ayırtmak için yazabilirsin.</p></div><a class="btn btn-ghost" href="${wa('Merhaba, eğitim tarihleri hakkında bilgi almak istiyorum.')}" target="_blank" rel="noopener">WhatsApp'tan sor</a></div>`;
      return;
    }
    box.innerHTML = list.map(t => {
      const h = H.find(x => x.kod === t.egitim) || { ad: t.egitim, yol: '', kod: t.egitim };
      const d = tYaz(t.tarih);
      const dolu = t.kontenjan && !/açık/i.test(t.kontenjan);
      return `<div class="row"><div class="d">${d.g} ${d.a}<small>${t.gunler || d.gun}</small></div><div><h5><a href="${L(h.yol)}">${h.ad}</a></h5><p>${[t.yer, t.saat, t.not].filter(Boolean).join(' · ')}</p></div><span class="pill ${dolu ? 'w' : ''}">${t.kontenjan || 'kontenjan açık'}</span><a class="btn btn-ghost" href="${L('iletisim/')}?ilgi=${h.kod}#basvuru">Başvur</a></div>`;
    }).join('');
  });
  document.querySelectorAll('[data-tarih]').forEach(el => {
    const t = T.find(x => x.egitim === el.dataset.tarih);
    if (t) { const d = tYaz(t.tarih); el.textContent = 'sıradaki · ' + d.g + ' ' + d.a; }
  });
  document.querySelectorAll('[data-ucret]').forEach(el => {
    const h = H.find(x => x.kod === el.dataset.ucret);
    el.textContent = (h && h.ucret) ? h.ucret : 'bilgi için sorun';
  });

  /* ---------- ön başvuru formu → WhatsApp ---------- */
  const q = new URLSearchParams(location.search).get('ilgi');
  document.querySelectorAll('form.basvuru').forEach(f => {
    const sel = f.querySelector('select');
    sel.innerHTML = '<option value="">Seç…</option>' +
      '<optgroup label="Eğitimler">' + EG.map(h => `<option value="${h.kod}">${h.ad}</option>`).join('') + '</optgroup>' +
      '<optgroup label="Danışmanlık">' + DN.map(h => `<option value="${h.kod}">${h.ad}</option>`).join('') + '</optgroup>' +
      '<option value="diger">Diğer / emin değilim</option>';
    sel.value = q || f.dataset.ilgi || '';
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      const v = n => f.querySelector(`[name="${n}"]`).value.trim();
      const secilen = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
      const msg = `Merhaba, siteden ön başvuru bırakıyorum.\nAd Soyad: ${v('ad')}\nİletişim: ${v('iletisim')}\nİlgilendiğim: ${secilen}`;
      window.open(wa(msg), '_blank', 'noopener');
      f.classList.add('gonderildi');
    });
  });


  /* ---------- arka plan sesi (assets/js/ses.js) ---------- */
  const sesJs = document.createElement('script'); sesJs.src = K + 'assets/js/ses.js'; document.body.appendChild(sesJs);

  /* ---------- nöral ağ arka planı ---------- */
  const cv = document.getElementById('net'), cx = cv.getContext('2d'); let W, Hh, P = [];
  function size() {
    const r = devicePixelRatio || 1;
    W = cv.width = innerWidth * r; Hh = cv.height = innerHeight * r;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    const n = Math.min(90, Math.floor(innerWidth / 16));
    P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * Hh, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, c: Math.random() < .5 ? '224,140,196' : (Math.random() < .5 ? '169,201,138' : '243,217,164') }));
  }
  function draw() {
    const r = devicePixelRatio || 1, d = 130 * r;
    cx.clearRect(0, 0, W, Hh);
    for (let i = 0; i < P.length; i++) {
      const a = P[i]; a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > Hh) a.vy *= -1;
      cx.fillStyle = `rgba(${a.c},.8)`; cx.beginPath(); cx.arc(a.x, a.y, 1.3 * r, 0, 7); cx.fill();
      for (let j = i + 1; j < P.length; j++) {
        const b = P[j], q = Math.hypot(a.x - b.x, a.y - b.y);
        if (q < d) { cx.strokeStyle = `rgba(${a.c},${.16 * (1 - q / d)})`; cx.lineWidth = r * .7; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); }
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  size(); draw(); addEventListener('resize', size);

  /* ---------- imleç ışığı ---------- */
  const gl = document.getElementById('glow');
  addEventListener('pointermove', e => { gl.style.left = e.clientX + 'px'; gl.style.top = e.clientY + 'px'; });

  /* ---------- terminal yazımı (yalnız ana sayfa) ---------- */
  const pre = document.getElementById('type');
  if (pre) {
    const lines = [['pk', '> bilinçaltı taranıyor…'], ['', '  kalıp bulundu: "yeterince iyi değilim"'], ['', '  kaynak: 0–7 yaş · durum: aktif'], ['gd', '> yeni kod hazırlanıyor…'], ['ok', '  ████████████████████ 100%'], ['ok', '✓ "Değerliyim ve yeterliyim" yüklendi']];
    const bekle = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
    (async function yaz() {
      for (;;) {
        pre.innerHTML = '';
        for (const [c, t] of lines) {
          const s = document.createElement('span'); if (c) s.className = c; pre.appendChild(s);
          for (const ch of t) { s.textContent += ch; await bekle(22); }
          pre.appendChild(document.createTextNode('\n')); await bekle(350);
        }
        const k = document.createElement('span'); k.className = 'caret'; pre.appendChild(k);
        if (reduce) return;
        await bekle(3800);
      }
    })();
  }

  /* ---------- görünür olunca belirme + sayaç ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(el => {
      const to = +el.dataset.count; let v = 0;
      const st = setInterval(() => { v += Math.ceil(to / 40); if (v >= to) { v = to; clearInterval(st); } el.textContent = v; }, 30);
    });
    io.unobserve(e.target);
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- kart çevirme ---------- */
  document.querySelectorAll('.card').forEach(c => {
    c.setAttribute('tabindex', '0'); c.setAttribute('role', 'button');
    const t = () => c.classList.toggle('flip');
    c.addEventListener('click', t); c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
  });

  /* ---------- açılır menüler ---------- */
  const dds = document.querySelectorAll('.dd');
  const closeDD = () => dds.forEach(d => { d.classList.remove('open'); d.querySelector('button').setAttribute('aria-expanded', 'false'); });
  dds.forEach(d => d.querySelector('button').addEventListener('click', e => {
    e.stopPropagation(); const o = d.classList.contains('open'); closeDD();
    if (!o) { d.classList.add('open'); e.currentTarget.setAttribute('aria-expanded', 'true'); }
  }));
  document.addEventListener('click', closeDD);
  const mn = document.getElementById('mnav');
  const closeM = () => { if (!mn) return; mn.classList.remove('open'); mn.setAttribute('aria-hidden', 'true'); B.style.overflow = ''; };
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeDD(); closeM(); } });
  const mt = document.querySelector('.menu-t');
  if (mt) mt.addEventListener('click', () => { mn.classList.add('open'); mn.setAttribute('aria-hidden', 'false'); B.style.overflow = 'hidden'; });
  if (mn) { mn.querySelector('.x').addEventListener('click', closeM); mn.querySelectorAll('a').forEach(a => a.addEventListener('click', closeM)); }

  /* ---------- aynı sayfadaki hedefe gidince parlama ---------- */
  document.querySelectorAll('a[href*="#"]').forEach(a => a.addEventListener('click', () => {
    const h = a.getAttribute('href'); const id = h.split('#')[1]; if (!id) return;
    const el = document.getElementById(id); if (!el) return;
    el.classList.add('in');
    setTimeout(() => { el.classList.remove('ping'); void el.offsetWidth; el.classList.add('ping'); }, 650);
  }));

  /* ---------- bilgisayarda dosyadan açınca (file://) klasör bağlantılarını düzelt ---------- */
  if (location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(a => {
      const h = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
      a.setAttribute('href', h.replace(/\/(?=[?#]|$)/, '/index.html').replace(/^(\.\/)?(?=[?#]|$)/, 'index.html'));
    });
  }
})();
