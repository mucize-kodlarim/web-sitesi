/* ============================================================
   MUCİZE KODLARIM — SİTE VERİSİ
   Tarih, ücret, kontenjan ve iletişim bilgisi YALNIZ bu dosyadan değişir.
   Neziha Hanım: Claude Code'a "ThetaHealing 1'e 7 Kasım tarihini ekle" demen yeterli.
   Kural: Melike Hanım'ın vermediği tarih ya da ücret buraya YAZILMAZ.
   ============================================================ */
window.MK = {
  whatsapp: "905067772520",            // başında + olmadan, ülke koduyla
  eposta: "bilgi@mucizekodlarim.com",
  instagram: "mucizekodlarim",
  konum: "İstanbul, Türkiye",

  /* Hizmetler: menü, form ve takvim bunları kullanır.
     ucret boşsa sitede "bilgi için sorun" yazar. Örnek: ucret: "12.500 TL" */
  hizmetler: [
    { kod: "theta-1", tur: "egitim", grup: "theta", ad: "ThetaHealing® Basic DNA", menuAd: "Basic DNA", menuNot: "1. modül · temel seminer", modul: "1. modül", yol: "services/thetahealing-basic-dna-1-modul/", ucret: "" },
    { kod: "theta-2", tur: "egitim", grup: "theta", ad: "ThetaHealing® Advanced DNA", menuAd: "Advanced DNA", menuNot: "2. modül · derinleşme", modul: "2. modül", yol: "services/thetahealing-advanced-dna-2-modul/", ucret: "" },
    { kod: "theta-3", tur: "egitim", grup: "theta", ad: "ThetaHealing® Derin Kazı", menuAd: "Derin Kazı", menuNot: "3. modül · kök çalışması", modul: "3. modül", yol: "services/thetahealing-derin-kazi-3-modul/", ucret: "" },
    { kod: "theta-4", tur: "egitim", grup: "theta", ad: "ThetaHealing® Sen ve Yaradan", menuAd: "Sen ve Yaradan", menuNot: "4. modül", modul: "4. modül", yol: "services/thetahealing-sen-ve-yaradan-4-modul/", ucret: "" },
    { kod: "jaas-egitim", tur: "egitim", grup: "diger", ad: "JAAS Uygulayıcılık Eğitimi", menuAd: "JAAS Uygulayıcılık", menuNot: "Jean Adrienne Arınma Sistemi", modul: "sertifikalı", yol: "services/jaas-jean-adrienne-arinma-sistemi-1-modul/", ucret: "" },
    { kod: "dowsing", tur: "egitim", grup: "diger", ad: "Spiritüel Dowsing Eğitimi", menuAd: "Spiritüel Dowsing", menuNot: "sarkaç ile arınma", modul: "sertifikalı", yol: "services/spirituel-dowsing-sarkac-ile-arinma-egitimi/", ucret: "" },
    { kod: "theta-danismanlik", tur: "danismanlik", grup: "dn", ad: "ThetaHealing® Danışmanlık", menuAd: "ThetaHealing® Danışmanlık", menuNot: "online · birebir", modul: "birebir", yol: "services/thetahealing-danismanlik/", ucret: "" },
    { kod: "jaas-danismanlik", tur: "danismanlik", grup: "dn", ad: "JAAS Danışmanlık", menuAd: "JAAS Danışmanlık", menuNot: "online · birebir", modul: "birebir", yol: "services/jaas-danismanlik/", ucret: "" }
  ],

  /* Eğitim takvimi. Boşsa sitede "Yeni dönem tarihleri yakında" yazar.
     Geçmiş tarihler kendiliğinden gizlenir. Örnek satır (başındaki // silinince görünür):
     { egitim: "theta-1", tarih: "2026-11-07", gunler: "Cum–Paz", saat: "19:00–24:00", yer: "Online · Zoom", not: "3 akşam", kontenjan: "kontenjan açık" },
     egitim kodları: theta-1, theta-2, theta-3, theta-4, jaas-egitim, dowsing */
  takvim: [
  ]
};
