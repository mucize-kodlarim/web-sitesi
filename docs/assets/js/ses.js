/* ============================================================
   MUCİZE KODLARIM — arka plan ses manzarası
   Ses dosyası YOK: dalga, kuş ve piyano sesleri tarayıcıda anlık üretilir
   (telif sorunu yok, site hafif kalır, her dinleyişte biraz farklı çalar).
   Varsayılan KAPALI. Ziyaretçi sol alttaki düğmeyle açar; tercih hatırlanır.
   Ses seviyesi: aşağıdaki SEVIYE (0–1). Sahne adları: SAHNELER.
   ============================================================ */
(function () {
  const SEVIYE = 0.55;
  const SAHNELER = {
    dalga:  { ad: 'Dalga',  kazanc: 1,   katman: ['dalga', 'piyanoSeyrek'] },
    kus:    { ad: 'Kuşlar', kazanc: 2.6, katman: ['ruzgar', 'kus', 'piyanoSeyrek'] },
    piyano: { ad: 'Piyano', kazanc: 1.9, katman: ['ped', 'piyano'] }
  };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const sec = a => a[Math.floor(Math.random() * a.length)];

  /* ---------- ortak parçalar ---------- */
  function gurultu(ctx) {
    const n = ctx.sampleRate * 4, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function yanki(ctx) {                       // 3,5 sn yumuşak oda yankısı
    const n = Math.floor(ctx.sampleRate * 3.5), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
    const k = ctx.createConvolver(); k.buffer = b; return k;
  }
  function kur(ctx, hedef) {
    const ana = ctx.createGain(); ana.gain.value = 0; ana.connect(hedef);
    const kuru = ctx.createGain(); kuru.gain.value = 1; kuru.connect(ana);
    const yk = yanki(ctx), islak = ctx.createGain(); islak.gain.value = .55; yk.connect(islak); islak.connect(ana);
    return { ctx, ana, kuru, yk, noise: gurultu(ctx), kaynaklar: [] };
  }
  function surekliGurultu(g, tStart) {
    const s = g.ctx.createBufferSource(); s.buffer = g.noise; s.loop = true; s.start(tStart); g.kaynaklar.push(s); return s;
  }

  /* ---------- katmanlar: her biri planla(t) ile t anına kadar olayları sıraya koyar ---------- */
  const KATMAN = {
    dalga(g, t0) {
      const ctx = g.ctx, src = surekliGurultu(g, t0);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500; lp.Q.value = .3;
      const v = ctx.createGain(); v.gain.value = .02;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2600;
      const kopuk = ctx.createGain(); kopuk.gain.value = 0;
      src.connect(lp); lp.connect(v); v.connect(g.kuru); v.connect(g.yk);
      src.connect(hp); hp.connect(kopuk); kopuk.connect(g.kuru);
      let t = t0 + .5;
      return { planla(son) {
        while (t < son) {
          const tepe = rnd(.32, .55), cik = rnd(2.8, 4), in_ = rnd(4, 6);
          v.gain.setValueAtTime(.03, t); v.gain.linearRampToValueAtTime(tepe, t + cik); v.gain.linearRampToValueAtTime(.03, t + cik + in_);
          lp.frequency.setValueAtTime(420, t); lp.frequency.linearRampToValueAtTime(rnd(950, 1300), t + cik); lp.frequency.linearRampToValueAtTime(420, t + cik + in_);
          kopuk.gain.setValueAtTime(0, t + cik * .7); kopuk.gain.linearRampToValueAtTime(tepe * .09, t + cik + .3); kopuk.gain.linearRampToValueAtTime(0, t + cik + 2.6);
          t += cik + in_ - rnd(.5, 1.5);
        }
      } };
    },
    ruzgar(g, t0) {
      const ctx = g.ctx, src = surekliGurultu(g, t0);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 360;
      const v = ctx.createGain(); v.gain.value = .06;
      const lfo = ctx.createOscillator(); lfo.frequency.value = .07; const lg = ctx.createGain(); lg.gain.value = .035;
      lfo.connect(lg); lg.connect(v.gain); lfo.start(t0); g.kaynaklar.push(lfo);
      src.connect(lp); lp.connect(v); v.connect(g.kuru);
      return { planla() {} };
    },
    kus(g, t0) {
      const ctx = g.ctx; let t = t0 + rnd(.8, 2);
      function cik(t, f0, f1, sure, ses, pan) {
        const o = ctx.createOscillator(), a = ctx.createGain(), p = ctx.createStereoPanner();
        o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + sure);
        a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(ses, t + .012); a.gain.exponentialRampToValueAtTime(.0001, t + sure);
        p.pan.value = pan; o.connect(a); a.connect(p); p.connect(g.kuru); p.connect(g.yk);
        o.start(t); o.stop(t + sure + .05);
      }
      return { planla(son) {
        while (t < son) {
          const pan = rnd(-.8, .8), ses = rnd(.035, .07);
          if (Math.random() < .6) {               // cıvıltı dizisi
            const n = Math.floor(rnd(3, 7)), f = rnd(2900, 4300);
            for (let i = 0; i < n; i++) { const tt = t + i * rnd(.09, .15); cik(tt, f * rnd(.95, 1.05), f * rnd(1.25, 1.45), rnd(.05, .09), ses, pan); }
          } else {                                 // ıslık gibi iki notalı ötüş
            const f = rnd(1900, 2600);
            cik(t, f, f * 1.18, .22, ses * 1.2, pan); cik(t + .3, f * 1.12, f * .96, .3, ses, pan);
          }
          t += rnd(2.2, 7.5);
        }
      } };
    },
    piyano(g, t0, seyrek) {
      const ctx = g.ctx;
      const NOTA = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99, 880];   // Re majör pentatonik + 7
      let t = t0 + rnd(.5, 1.5);
      function vur(t, f, ses) {
        [[1, 1], [2, .32], [3, .1], [4.02, .04]].forEach(([h, a], i) => {
          const o = ctx.createOscillator(), e = ctx.createGain();
          o.frequency.value = f * h; o.detune.value = rnd(-4, 4);
          e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(ses * a, t + .01);
          e.gain.exponentialRampToValueAtTime(.0001, t + 4.2 - i * .7);
          o.connect(e); e.connect(g.kuru); e.connect(g.yk);
          o.start(t); o.stop(t + 4.4);
        });
      }
      return { planla(son) {
        while (t < son) {
          const f = sec(NOTA), ses = seyrek ? .045 : .06;
          vur(t, f, ses);
          if (Math.random() < .35) vur(t + rnd(.12, .25), f * sec([1.25, 1.5, .75]), ses * .7);
          t += seyrek ? rnd(3.5, 8) : rnd(1.6, 4.2);
        }
      } };
    },
    piyanoSeyrek(g, t0) { return KATMAN.piyano(g, t0, true); },
    ped(g, t0) {
      const ctx = g.ctx;
      const AKOR = [[146.83, 220, 277.18, 329.63], [123.47, 185, 220, 293.66], [98, 146.83, 246.94, 293.66], [110, 164.81, 220, 277.18]];
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.connect(g.yk); lp.connect(g.kuru);
      let t = t0, i = 0;
      return { planla(son) {
        while (t < son) {
          AKOR[i % AKOR.length].forEach(f => {
            const o = ctx.createOscillator(), e = ctx.createGain();
            o.type = 'triangle'; o.frequency.value = f; o.detune.value = rnd(-6, 6);
            e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(.018, t + 4); e.gain.setValueAtTime(.018, t + 12); e.gain.linearRampToValueAtTime(0, t + 16);
            o.connect(e); e.connect(lp); o.start(t); o.stop(t + 16.2);
          });
          i++; t += 12;
        }
      } };
    }
  };

  function sahneKur(ctx, hedef, ad, t0) {
    const g = kur(ctx, hedef);
    const kat = SAHNELER[ad].katman.map(k => KATMAN[k](g, t0));
    return { g, kat, planla: son => kat.forEach(k => k.planla(son)) };
  }

  /* ---------- canlı çalma ---------- */
  let ctx = null, aktif = null, zaman = null, durum = 'kapali', sahne = 'dalga';
  try { sahne = localStorage.getItem('mk-sahne') || 'dalga'; } catch (e) {}
  if (!SAHNELER[sahne]) sahne = 'dalga';

  function yaz(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function sondur(s, sure) {
    if (!s) return; const t = ctx.currentTime;
    s.g.ana.gain.cancelScheduledValues(t); s.g.ana.gain.setValueAtTime(s.g.ana.gain.value, t); s.g.ana.gain.linearRampToValueAtTime(0, t + sure);
    setTimeout(() => { s.g.kaynaklar.forEach(k => { try { k.stop(); } catch (e) {} }); s.g.ana.disconnect(); }, sure * 1000 + 200);
  }
  function cal(ad) {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const eski = aktif;
    aktif = sahneKur(ctx, ctx.destination, ad, ctx.currentTime + .05);
    aktif.g.ana.gain.linearRampToValueAtTime(SEVIYE * SAHNELER[ad].kazanc, ctx.currentTime + 2.5);
    aktif.planla(ctx.currentTime + 8);
    if (eski) sondur(eski, 2);
    clearInterval(zaman); zaman = setInterval(() => aktif && aktif.planla(ctx.currentTime + 8), 1000);
    sahne = ad; durum = 'acik'; yaz('mk-sahne', ad); yaz('mk-ses', 'acik'); ciz();
  }
  function dur() {
    clearInterval(zaman); sondur(aktif, 1.2); aktif = null;
    durum = 'kapali'; yaz('mk-ses', 'kapali'); ciz();
  }

  /* ---------- düğme ---------- */
  const kutu = document.createElement('div');
  kutu.className = 'ses';
  kutu.innerHTML = `<button class="ses-btn" type="button" aria-pressed="false" aria-label="Arka plan sesini aç"><span class="bars"><i></i><i></i><i></i><i></i></span><span class="yazi">Müzik</span></button>
    <div class="ses-menu" role="group" aria-label="Ses sahnesi">${Object.entries(SAHNELER).map(([k, s]) => `<button type="button" data-s="${k}">${s.ad}</button>`).join('')}</div>`;
  document.body.appendChild(kutu);
  const btn = kutu.querySelector('.ses-btn');
  function ciz() {
    kutu.classList.toggle('acik', durum === 'acik');
    kutu.classList.toggle('bekliyor', durum === 'bekliyor');
    btn.setAttribute('aria-pressed', durum === 'acik');
    btn.setAttribute('aria-label', durum === 'acik' ? 'Arka plan sesini kapat' : 'Arka plan sesini aç');
    btn.title = durum === 'acik' ? 'Sesi kapat' : 'Huzurlu arka plan sesi';
    kutu.querySelectorAll('.ses-menu button').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === sahne));
  }
  btn.addEventListener('click', e => { e.stopPropagation(); durum === 'acik' ? dur() : cal(sahne); });
  kutu.querySelectorAll('.ses-menu button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); cal(b.dataset.s); }));

  /* Ses açık bırakılmışsa: yeni sayfada ilk dokunuşta devam et (tarayıcılar kendiliğinden çalmaya izin vermez) */
  let tercih = 'kapali'; try { tercih = localStorage.getItem('mk-ses') || 'kapali'; } catch (e) {}
  if (tercih === 'acik') {
    durum = 'bekliyor';
    const ilk = () => { removeEventListener('pointerdown', ilk, true); removeEventListener('keydown', ilk, true); if (durum === 'bekliyor') cal(sahne); };
    addEventListener('pointerdown', ilk, true); addEventListener('keydown', ilk, true);
  }
  ciz();

  /* Örnek kayıt için (geliştirici): MKSES.kaydet('dalga', 30) → WAV Blob */
  window.MKSES = {
    SAHNELER,
    async kaydet(ad, sn) {
      const sr = 44100, oc = new OfflineAudioContext(2, sr * sn, sr);
      const s = sahneKur(oc, oc.destination, ad, 0);
      const sv = SEVIYE * SAHNELER[ad].kazanc;
      s.g.ana.gain.setValueAtTime(0, 0); s.g.ana.gain.linearRampToValueAtTime(sv, 2.5);
      s.g.ana.gain.setValueAtTime(sv, sn - 3); s.g.ana.gain.linearRampToValueAtTime(0, sn);
      s.planla(sn);
      const b = await oc.startRendering(), L = b.getChannelData(0), R = b.getChannelData(1), n = L.length;
      const buf = new ArrayBuffer(44 + n * 4), v = new DataView(buf);
      const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
      w(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
      v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 4, true);
      for (let i = 0, o = 44; i < n; i++, o += 4) { v.setInt16(o, Math.max(-1, Math.min(1, L[i])) * 32767, true); v.setInt16(o + 2, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
      return new Blob([buf], { type: 'audio/wav' });
    }
  };
})();
