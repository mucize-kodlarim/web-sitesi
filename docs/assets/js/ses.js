/* ============================================================
   MUCİZE KODLARIM — arka plan ses manzarası
   Ses dosyası YOK: frekans sesleri tarayıcıda anlık üretilir
   (telif sorunu yok, site hafif kalır, her dinleyişte biraz farklı çalar).
   Varsayılan KAPALI. Ziyaretçi sol alttaki düğmeyle açar; tercih hatırlanır.
   Ses seviyesi: aşağıdaki SEVIYE (0–1). Sahne adları: SAHNELER.
   ============================================================ */
(function () {
  const SEVIYE = 0.55;
  // Frekans sahneleri (Neziha 2026-10-15). Duygu adları gelenekseldir; sağlık iddiası yazılmaz.
  const SAHNELER = {
    bolluk:    { ad: 'Bolluk',     hz: '888 Hz',   kazanc: 3.4, katman: [['ton', 888]] },
    sevgi:     { ad: 'Sevgi',      hz: '528 Hz',   kazanc: 2.2, katman: [['ton', 528]] },
    mutluluk:  { ad: 'Mutluluk',   hz: '432 Hz',   kazanc: 2.2, katman: [['akor', 432]] },
    uyum:      { ad: 'Uyum',       hz: '639 Hz',   kazanc: 3.6, katman: [['ton', 639]] },
    guven:     { ad: 'Güven',      hz: '174 Hz',   kazanc: 2, katman: [['ton', 174]] },
    tazelenme: { ad: 'Tazelenme',  hz: '285 Hz',   kazanc: 2, katman: [['ton', 285]] },
    ifade:     { ad: 'İfade',      hz: '741 Hz',   kazanc: 3.4, katman: [['ton', 741]] },
    butunluk:  { ad: 'Bütünlük',   hz: '963 Hz',   kazanc: 3.8, katman: [['ton', 963]] },
    cakra:     { ad: 'Çakralar',   hz: '7 çakra',  kazanc: 2, katman: ['cakra'] },
    theta:     { ad: 'Theta',      hz: 'kulaklıkla', kazanc: 2.4, katman: [['binaural', 6], ['akor', 216, true]] },
    alfa:      { ad: 'Alfa',       hz: 'kulaklıkla', kazanc: 2.2, katman: [['binaural', 10], ['akor', 216, true]] }
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
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let y = 0; for (let i = 0; i < n; i++) { y += ((Math.random() * 2 - 1) - y) * .18; d[i] = y * Math.pow(1 - i / n, 2.6) * Math.min(1, i / (ctx.sampleRate * .03)) * 1.8; } }
    const k = ctx.createConvolver(); k.buffer = b; return k;
  }
  function kur(ctx, hedef) {
    const ana = ctx.createGain(); ana.gain.value = 0; ana.connect(hedef);
    const kuru = ctx.createGain(); kuru.gain.value = 1; kuru.connect(ana);
    const yk = yanki(ctx), islak = ctx.createGain(); islak.gain.value = .4; yk.connect(islak); islak.connect(ana);
    return { ctx, ana, kuru, yk, noise: gurultu(ctx), kaynaklar: [] };
  }
  function surekliGurultu(g, tStart) {
    const s = g.ctx.createBufferSource(); s.buffer = g.noise; s.loop = true; s.start(tStart); g.kaynaklar.push(s); return s;
  }

  /* ---------- katmanlar: her biri planla(t) ile t anına kadar olayları sıraya koyar ---------- */
  const KATMAN = {
    ton(g, t0, f) {                            // saf frekans + yumuşak alt ses + ara ara çan
      const ctx = g.ctx, kis = f > 600 ? .5 : f < 200 ? 1.3 : 1;
      const dal = ctx.createGain(); dal.gain.value = .75; dal.connect(g.kuru); dal.connect(g.yk);
      const lfo = ctx.createOscillator(); lfo.frequency.value = .07; const lg = ctx.createGain(); lg.gain.value = .22;
      lfo.connect(lg); lg.connect(dal.gain); lfo.start(t0); g.kaynaklar.push(lfo);
      [[f, .05, -.35], [f, .05, .35], [f / 2, .035, 0]].forEach(([fr, ses, pan]) => {
        const o = ctx.createOscillator(), e = ctx.createGain(), p = ctx.createStereoPanner();
        o.type = 'sine'; o.frequency.value = fr; e.gain.value = ses * kis; p.pan.value = pan;
        o.connect(e); e.connect(p); p.connect(dal); o.start(t0); g.kaynaklar.push(o);
      });
      let t = t0 + rnd(4, 7);
      return { planla(son) {
        while (t < son) {
          const o = ctx.createOscillator(), e = ctx.createGain();
          o.type = 'sine'; o.frequency.value = f * 2;
          e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(.016 * kis, t + .02); e.gain.exponentialRampToValueAtTime(.0001, t + 4);
          o.connect(e); e.connect(g.yk); e.connect(g.kuru); o.start(t); o.stop(t + 4.1);
          t += rnd(8, 13);
        }
      } };
    },
    binaural(g, t0, fark) {                    // sol 200 Hz, sağ 200+fark Hz (kulaklıkla)
      const ctx = g.ctx, m = ctx.createChannelMerger(2), e = ctx.createGain(); e.gain.value = .07;
      m.connect(e); e.connect(g.kuru);
      [[200, 0], [200 + fark, 1]].forEach(([fr, ch]) => { const o = ctx.createOscillator(); o.frequency.value = fr; o.connect(m, 0, ch); o.start(t0); g.kaynaklar.push(o); });
      return { planla() {} };
    },
    akor(g, t0, kok, hafif) {                  // aydınlık, yavaşça değişen majör akorlar
      const ctx = g.ctx, ORAN = [[1, 5 / 4, 3 / 2, 2], [4 / 3, 5 / 3, 2, 8 / 3], [3 / 2, 15 / 8, 9 / 4, 3], [1, 5 / 4, 3 / 2, 15 / 8]];
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.connect(g.yk); lp.connect(g.kuru);
      const ses = hafif ? .009 : .02; let t = t0, i = 0;
      return { planla(son) {
        while (t < son) {
          ORAN[i % ORAN.length].forEach(r => {
            const o = ctx.createOscillator(), e = ctx.createGain(), fr = kok * r / (r > 2 ? 2 : 1);
            o.type = 'triangle'; o.frequency.value = fr; o.detune.value = rnd(-5, 5);
            e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(ses, t + 4); e.gain.setValueAtTime(ses, t + 10); e.gain.linearRampToValueAtTime(0, t + 14);
            o.connect(e); e.connect(lp); o.start(t); o.stop(t + 14.2);
          });
          i++; t += 10;
        }
      } };
    },
    cakra(g, t0) {                             // kökten taca 7 çakra frekansı, her biri ~45 sn
      const ctx = g.ctx, FR = [396, 417, 528, 639, 741, 852, 963], SURE = 45;
      let t = t0, i = 0;
      return { planla(son) {
        while (t < son) {
          const f = FR[i % FR.length], kis = f > 600 ? .5 : 1;
          [[f, .06], [f / 2, .035]].forEach(([fr, ses]) => {
            const o = ctx.createOscillator(), e = ctx.createGain();
            o.type = 'sine'; o.frequency.value = fr;
            e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(ses * kis, t + 5); e.gain.setValueAtTime(ses * kis, t + SURE - 1); e.gain.linearRampToValueAtTime(0, t + SURE + 4);
            o.connect(e); e.connect(g.kuru); e.connect(g.yk); o.start(t); o.stop(t + SURE + 4.2);
          });
          i++; t += SURE;
        }
      } };
    },
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
    const kat = SAHNELER[ad].katman.map(k => Array.isArray(k) ? KATMAN[k[0]](g, t0, ...k.slice(1)) : KATMAN[k](g, t0));
    return { g, kat, planla: son => kat.forEach(k => k.planla(son)) };
  }

  /* ---------- canlı çalma ---------- */
  let ctx = null, aktif = null, zaman = null, durum = 'kapali', sahne = 'sevgi';
  try { sahne = localStorage.getItem('mk-sahne') || 'sevgi'; } catch (e) {}
  if (!SAHNELER[sahne]) sahne = 'sevgi';

  function yaz(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function sondur(s, sure) {
    if (!s) return; const t = ctx.currentTime;
    s.g.ana.gain.cancelScheduledValues(t); s.g.ana.gain.setValueAtTime(s.g.ana.gain.value, t); s.g.ana.gain.linearRampToValueAtTime(0, t + sure);
    setTimeout(() => { s.g.kaynaklar.forEach(k => { try { k.stop(); } catch (e) {} }); try { s.g.ana.disconnect(); } catch (e) {} }, sure * 1000 + 60);
  }
  function cal(ad) {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    if (aktif) { sondur(aktif, .25); aktif = null; }       // önceki ses hemen susar
    const t0 = ctx.currentTime + (zaman ? .3 : .05);
    aktif = sahneKur(ctx, ctx.destination, ad, t0);
    aktif.g.ana.gain.setValueAtTime(0, t0);                    // sıfırdan, çıtırtısız başla
    aktif.g.ana.gain.linearRampToValueAtTime(SEVIYE * SAHNELER[ad].kazanc, t0 + 2);
    aktif.planla(t0 + 8);
    clearInterval(zaman); zaman = setInterval(() => aktif && aktif.planla(ctx.currentTime + 8), 1000);
    sahne = ad; durum = 'acik'; yaz('mk-sahne', ad); yaz('mk-ses', 'acik'); yaz('mk-calan', kimlik + ':' + Date.now()); ciz();
  }
  function dur(sessiz) {
    clearInterval(zaman); zaman = null; sondur(aktif, .6); aktif = null;
    durum = 'kapali'; if (!sessiz) yaz('mk-ses', 'kapali'); ciz();
  }
  /* Sekmeler arası: aynı anda yalnız bir sekme çalar; bir sekmede kapatılınca hepsi susar */
  const kimlik = Math.random().toString(36).slice(2);
  addEventListener('storage', e => {
    if (e.key === 'mk-calan' && aktif && e.newValue && !e.newValue.startsWith(kimlik)) dur(true);
    if (e.key === 'mk-ses' && e.newValue === 'kapali' && (aktif || durum === 'bekliyor')) dur(true);
  });

  /* ---------- düğme ---------- */
  const kutu = document.createElement('div');
  kutu.className = 'ses';
  kutu.innerHTML = `<button class="ses-btn" type="button" aria-pressed="false" aria-label="Arka plan sesini aç"><span class="ses-rozet" aria-hidden="true"><img class="ses-foto" src="${(document.body.dataset.kok || './')}assets/img/muzik-rozet.jpg" alt=""><span class="yazi">Müzik</span></span></button>
    <div class="ses-menu" role="group" aria-label="Frekans seçimi"><b class="ses-baslik">Frekanslar</b>${Object.entries(SAHNELER).map(([k, s]) => `<button type="button" data-s="${k}">${s.ad}<small>${s.hz}</small></button>`).join('')}</div>`;
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
