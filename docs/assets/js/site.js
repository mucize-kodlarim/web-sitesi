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
  /* logo: Hilal Hanım 01 · MK monogramı (DENEME 2026-10-03; eski DNA sarmalı SVG git geçmişinde) */
  const logo = `<img class="logo-mk" src="${K}assets/img/logo-mk.png" alt="" aria-hidden="true">`;
  const mItem = h => `<a href="${L(h.yol)}" style="--c:${renk(h)}"><i></i><span>${h.menuAd}<small>${h.menuNot}</small></span></a>`;
  const theta = EG.filter(e => e.grup === 'theta'), diger = EG.filter(e => e.grup !== 'theta');
  const ust = document.getElementById('ust');
  /* menü simgeleri (Neziha 2026-10-15): renkli yuvarlak + ince çizgi simge */
  const IKS = {
    seminer: ['#e08cc4', '<path d="M8 3c0 4.5 8 4.5 8 9s-8 4.5-8 9M16 3c0 4.5-8 4.5-8 9s8 4.5 8 9"/><path d="M9 6h6M9 18h6" stroke-width="1.3"/>'],
    danis:   ['#a9c98a', '<path d="M12 19s-6.5-4-6.5-8.5A3.6 3.6 0 0 1 12 8.3a3.6 3.6 0 0 1 6.5 2.2C18.5 15 12 19 12 19z"/>'],
    hakkimda:['#f3d9a4', '<path d="M12 18c-3.5 0-6-2-6.5-4.5 2 .3 3.8 1.2 4.6 2.4M12 18c3.5 0 6-2 6.5-4.5-2 .3-3.8 1.2-4.6 2.4M12 18c-1.8-2-2.4-5.4 0-9 2.4 3.6 1.8 7 0 9z"/>'],
    blog:    ['#c9a6e8', '<path d="M18 5c-6 0-10 4.5-11 12M18 5c.5 5-3 9-8.5 9.5M8.5 13.5 6 19"/>'],
    iletisim:['#bfe0a6', '<path d="M5 6.5h14v9H10l-3.5 3v-3H5z"/><path d="M8.5 10.5h7M8.5 13h4.5"/>']
  };
  const ik = k => `<span class="nav-ik" style="--ik:${IKS[k][0]}" aria-hidden="true"><svg viewBox="0 0 24 24">${IKS[k][1]}</svg></span>`;  if (ust) ust.outerHTML = `
  <header class="wrap nav">
    <div class="bar">
      <a class="brand" href="${L('')}">${logo}Mucize Kodlarım</a>
      <nav class="links" aria-label="Ana menü">
        <div class="dd"><button type="button" aria-expanded="false">${ik('seminer')}Seminerler</button>
          <div class="mega">
            <div><h6>ThetaHealing® · modül yolu</h6>${theta.map(mItem).join('')}</div>
            <div><h6>Diğer seminerler</h6>${diger.map(mItem).join('')}
              <a href="${L('seminerler/')}#takvim" style="--c:var(--gold)"><i></i><span>Takvim<small>tarih · ücret · kontenjan</small></span></a>
              <a href="${L('seminerler/')}" style="--c:var(--muted)"><i></i><span>Tüm seminerler<small>hepsi tek sayfada</small></span></a></div>
          </div></div>
        <div class="dd"><button type="button" aria-expanded="false">${ik('danis')}Danışmanlık</button>
          <div class="mega sm"><div><h6>Birebir seanslar</h6>${DN.map(mItem).join('')}
            <a href="${L('danismanliklar/')}" style="--c:var(--muted)"><i></i><span>Tüm danışmanlıklar<small>karşılaştır</small></span></a></div></div></div>
        <a href="${L('hakkimda/')}" data-s="hakkimda">${ik('hakkimda')}Hakkımda</a>
        <a href="${L('blog-yazilari/')}" data-s="blog">${ik('blog')}Blog</a>
        <a href="${L('iletisim/')}" data-s="iletisim">${ik('iletisim')}İletişim</a>
      </nav>
      <a class="btn btn-main nav-cta" href="${L('iletisim/')}#basvuru">Ön Başvuru →</a>
      <button class="menu-t" type="button" aria-label="Menüyü aç">☰</button>
    </div>
  </header>
  <div class="mnav" id="mnav" aria-hidden="true">
    <div class="mtop"><span class="brand">Mucize Kodlarım</span><button class="x" type="button" aria-label="Menüyü kapat">✕</button></div>
    <h6>${ik('seminer')}ThetaHealing® seminerleri</h6>${theta.map(h => `<a class="l" href="${L(h.yol)}">${h.menuAd} <small>${h.modul}</small></a>`).join('')}
    <h6>${ik('seminer')}Diğer seminerler</h6>${diger.map(h => `<a class="l" href="${L(h.yol)}">${h.menuAd} <small>sertifikalı</small></a>`).join('')}
    <a class="l" href="${L('seminerler/')}#takvim">Takvim <small>tarih · ücret</small></a>
    <h6>${ik('danis')}Danışmanlık</h6>${DN.map(h => `<a class="l" href="${L(h.yol)}">${h.menuAd} <small>birebir</small></a>`).join('')}
    <h6>Keşfet</h6>
    <a class="l" href="${L('hakkimda/')}"><span class="l-ad">${ik('hakkimda')}Hakkımda</span> <small>Melike Kaan</small></a>
    <a class="l" href="${L('blog-yazilari/')}"><span class="l-ad">${ik('blog')}Blog</span> <small>yazılar</small></a>
    <a class="l" href="${L('iletisim/')}"><span class="l-ad">${ik('iletisim')}İletişim</span> <small>whatsapp · e-posta</small></a>
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
          <p class="f-ozet">ThetaHealing®, JAAS ve Spiritüel Dowsing seminerleri ve birebir danışmanlık · online</p></div>
        <div><h6>Keşfet</h6><ul>
          <li><a href="${L('seminerler/')}">Seminerler</a></li><li><a href="${L('danismanliklar/')}">Danışmanlık</a></li>
          <li><a href="${L('hakkimda/')}">Hakkımda</a></li>
          <li><a href="${L('blog-yazilari/')}">Blog</a></li></ul></div>
        <div><h6>İletişim</h6><ul>
          <li><a href="#" data-wa-sec>WhatsApp</a></li>
          <li><a href="mailto:${MK.eposta}">${MK.eposta}</a></li>
          <li><a href="https://instagram.com/${MK.instagram}" target="_blank" rel="noopener">Instagram · @${MK.instagram}</a></li>
          <li>${MK.konum || ''}</li></ul></div>
      </div>
      <p class="disc">Bu sitedeki teknikler tıbbi muayene, teşhis ve tedavinin yerine geçmez. Teşhis ve tedavi mutlaka bir hekim tarafından yapılmalıdır. Buradaki bilgiler bir uzmanla görüşmenin yerini tutmaz.</p>
      <p class="copy">© ${new Date().getFullYear()} Kerime Melike Kaan · Mucize Kodlarım · <a href="${L('kvkk-aydinlatma-metni/')}">KVKK Aydınlatma Metni</a> · <a href="${L('cerez-bilgilendirmesi/')}">Çerez Bilgilendirmesi</a> · <a href="${L('on-bilgilendirme-formu/')}">Ön Bilgilendirme Formu</a> · <a href="${L('mesafeli-hizmet-sozlesmesi/')}">Mesafeli Hizmet Sözleşmesi</a> · <a href="${L('cayma-iptal-kosullari/')}">Cayma, İptal ve Erteleme</a></p>
    </div>
  </footer>
  <div class="toast" id="toast" role="status"></div>`;

  /* ---------- iletişim bağlantıları ---------- */
  /* ---------- WhatsApp: her düğme kendi konusunu sorar, genel soru yok (Neziha 2026-10-15) ---------- */
  const WAIK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path fill="#fff" d="M17.3 14.6c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.4-.5.3-.5v-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3z"/></svg>';
  const konu = h => h.tur === 'egitim' ? (/semineri$/i.test(h.ad) ? h.ad : h.ad + ' semineri') : h.ad;
  const waMsg = kod => { const h = H.find(x => x.kod === kod); return h ? `Merhaba, ${konu(h)} hakkında bilgi almak istiyorum.` : 'Merhaba, hangi seminer ya da danışmanlığın bana uygun olduğu hakkında bilgi almak istiyorum.'; };
  const ikEkle = a => { if (!a.querySelector('.wa-ik')) a.insertAdjacentHTML('afterbegin', `<span class="wa-ik">${WAIK}</span>`); };
  document.querySelectorAll('[data-wa-kod]').forEach(a => { a.dataset.wa = waMsg(a.dataset.waKod); });
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
  /* konusu belli olmayan yerler: önce konu seçtirilir */
  let secKutu = null;
  const secAc = () => {
    if (!secKutu) {
      const sat = h => `<a href="${wa(waMsg(h.kod))}" target="_blank" rel="noopener">${h.ad}</a>`;
      secKutu = document.createElement('div'); secKutu.className = 'wa-sec';
      secKutu.innerHTML = `<div class="wa-sec-kutu" role="dialog" aria-modal="true" aria-label="WhatsApp konu seçimi"><button class="wa-sec-x" type="button" aria-label="Kapat">✕</button><h4><span class="wa-ik">${WAIK}</span>Hangi konuda yazmak istiyorsunuz?</h4><div class="wa-sec-liste"><small>Seminerler</small>${EG.map(sat).join('')}<small>Danışmanlık</small>${DN.map(sat).join('')}<small>Emin değilim</small><a href="${wa(waMsg('diger'))}" target="_blank" rel="noopener">Bana uygun olanı öğrenmek istiyorum</a></div></div>`;
      document.body.appendChild(secKutu);
      const kapat = () => { secKutu.classList.remove('acik'); B.classList.remove('wa-sec-acik'); };
      secKutu.addEventListener('click', e => { if (e.target === secKutu || e.target.closest('.wa-sec-x') || e.target.closest('.wa-sec-liste a')) kapat(); });
      addEventListener('keydown', e => { if (e.key === 'Escape') kapat(); });
    }
    secKutu.classList.add('acik'); B.classList.add('wa-sec-acik');
  };
  document.querySelectorAll('[data-wa-sec]').forEach(a => { a.href = '#'; a.addEventListener('click', e => { if (a.dataset.secili) return; e.preventDefault(); secAc(); }); });
  /* WhatsApp simgesi */
  document.querySelectorAll('[data-wa],[data-wa-sec]').forEach(a => {
    if (a.classList.contains('cc')) { const s = a.querySelector('svg'); if (s) s.outerHTML = `<span class="wa-ik buyuk">${WAIK}</span>`; }
    else if (a.classList.contains('wa')) { const s = [...a.querySelectorAll('span')].find(x => /💬/.test(x.textContent)); if (s) s.outerHTML = `<span class="wa-ik">${WAIK}</span>`; else ikEkle(a); }
    else ikEkle(a);
  });
  document.querySelectorAll('form.basvuru button[type="submit"]').forEach(ikEkle);
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
      box.innerHTML = `<div class="row bos"><div class="d">✦</div><div><h5>Yeni dönem tarihleri yakında</h5><p>Takvim açıklanınca burada görünecek.</p></div></div>`;
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
    const sel = f.querySelector('select[name="ilgi"]');
    sel.innerHTML = '<option value="">Seç…</option>' +
      '<optgroup label="Seminerler">' + EG.map(h => `<option value="${h.kod}">${h.ad}</option>`).join('') + '</optgroup>' +
      '<optgroup label="Danışmanlık">' + DN.map(h => `<option value="${h.kod}">${h.ad}</option>`).join('') + '</optgroup>' +
      '<option value="diger">Diğer / emin değilim</option>';
    sel.value = q || f.dataset.ilgi || '';
    /* "Hızlı soru" WhatsApp kutusu, İlgilendiğin kutusunda seçilen konuyu sorar */
    const kutu = f.closest('.apply') && f.closest('.apply').querySelector('a.wa');
    const esitle = () => {
      if (!kutu) return;
      if (sel.value) { kutu.dataset.secili = sel.value; kutu.href = wa(waMsg(sel.value)); kutu.target = '_blank'; kutu.rel = 'noopener'; }
      else { delete kutu.dataset.secili; if (kutu.hasAttribute('data-wa-sec')) { kutu.href = '#'; kutu.removeAttribute('target'); } else kutu.href = wa(kutu.dataset.wa); }
    };
    sel.addEventListener('change', esitle); esitle();
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      const v = n => ((f.querySelector(`[name="${n}"]`) || {}).value || '').trim();
      const ileti = f.querySelector('[name="ileti"]');
      const msg = `${waMsg(sel.value || 'diger')}\n\nÖn başvuru formu\nAd Soyad: ${v('ad')}\nTelefon: ${v('kod')} ${v('telefon').replace(/[^0-9]/g, '')}\nE-posta: ${v('eposta')}\nTicari ileti onayı: ${ileti && ileti.checked ? 'Evet' : 'Hayır'}`;
      window.open(wa(msg), '_blank', 'noopener');
      f.classList.add('gonderildi');
    });
  });


  /* ---------- arka plan sesi (assets/js/ses.js) ---------- */
  const sesJs = document.createElement('script'); sesJs.src = K + 'assets/js/ses.js'; document.body.appendChild(sesJs);

  /* ---------- chatbot (Mucize Asistan, Replit) ---------- */
  const bot = document.createElement('script'); bot.src = 'https://mucize-kodlarim-asistan.replit.app/widget.js'; bot.defer = true; document.body.appendChild(bot);
  /* DENEME (Neziha 2026-10-05): asistan düğmesinde fotoğraf yerine MK logosu — beğenilmezse bu bloğu sil */
  let botTur = 0; const botLogo = setInterval(() => {
    const av = document.getElementById('mucize-assistant-widget-host')?.shadowRoot?.querySelector('.mk-avatar');
    const im = av && av.querySelector('img');
    if (im) {
      im.src = K + 'assets/img/logo-mk.png';
      im.style.cssText = 'width:44px;height:30px;object-fit:cover;border-radius:0;filter:drop-shadow(0 0 6px rgba(243,217,164,.25))'; // menüdeki logoyla aynı
      av.style.background = '#0b2414'; av.style.borderColor = 'rgba(243,217,164,.85)';
      const st = document.createElement('style'); st.textContent = '.mk-launcher:focus,.mk-launcher:focus-visible{outline:none !important}' // Neziha: seçili çerçevesi olmasın
        + '.mk-launcher-label{background:linear-gradient(120deg,#e08cc4 0%,#f3d9a4 50%,#a9c98a 100%) !important;color:#1a0f22 !important;border:0 !important;font:500 12px/1.2 Sora,system-ui,sans-serif !important;padding:8px 14px !important;box-shadow:0 4px 14px rgba(0,0,0,.25) !important}'; // sitedeki düğmelerle aynı
      av.getRootNode().appendChild(st);
      // "Sorunuz mu var? Yazın" + yazıyor baloncuğu (Neziha 2026-10-12)
      st.textContent += '.mk-launcher-label{display:flex !important;flex-direction:column;align-items:center;gap:5px;border-radius:16px !important;padding:8px 14px 7px !important}'
        + '.mk-sor{display:flex;align-items:center;gap:6px;font:400 11px/1 Sora,system-ui,sans-serif;color:#3a2440;white-space:nowrap}'
        + '.mk-yaz{display:inline-flex;gap:3px;align-items:center;justify-content:center;height:23px;padding:0 6px;border-radius:12px 12px 12px 5px;background:rgba(255,255,255,.9);box-shadow:0 1px 4px rgba(0,0,0,.12)}'
        + '.mk-yaz i{width:5px;height:5px;border-radius:50%;background:#c97fb2;animation:mk-nokta 1.3s infinite ease-in-out}'
        + '.mk-yaz i:nth-child(2){animation-delay:.18s}.mk-yaz i:nth-child(3){animation-delay:.36s}'
        + '@keyframes mk-nokta{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-3px);opacity:1}}'
        // telefonda daha küçük (Neziha 2026-10-13)
        + '@media (max-width:640px){.mk-launcher{right:10px !important;bottom:10px !important;width:auto !important;gap:3px !important}.mk-avatar{width:42px !important;height:42px !important;flex-basis:42px !important}.mk-avatar img{width:32px !important;height:22px !important}.mk-launcher-label{font-size:10.5px !important;padding:5px 10px 5px !important;gap:3px !important;border-radius:12px !important}.mk-sor{font-size:9.5px !important;gap:4px !important}.mk-yaz{height:17px !important;padding:0 5px !important}.mk-yaz i{width:4px !important;height:4px !important}}';
      const lb = av.getRootNode().querySelector('.mk-launcher-label');
      if (lb && !av.getRootNode().querySelector('.mk-sor')) lb.insertAdjacentHTML('beforeend','<span class="mk-sor" aria-hidden="true">Sorunuz mu var? Yazın <span class="mk-yaz"><i></i><i></i><i></i></span></span>');
    }
    if (im || ++botTur > 40) clearInterval(botLogo);
  }, 250);

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
  const closeM = () => { if (!mn) return; mn.classList.remove('open'); mn.setAttribute('aria-hidden', 'true'); B.style.overflow = ''; B.classList.remove('menu-acik'); };
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeDD(); closeM(); } });
  const mt = document.querySelector('.menu-t');
  if (mt) mt.addEventListener('click', () => { mn.classList.add('open'); mn.setAttribute('aria-hidden', 'false'); B.style.overflow = 'hidden'; B.classList.add('menu-acik'); });
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
