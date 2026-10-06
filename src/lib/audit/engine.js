// src/lib/audit/engine.js

/*
|--------------------------------------------------------------------------
| GROWTH AUDIT ENGINE
|--------------------------------------------------------------------------
| Engine ini menghasilkan diagnosis berdasarkan jawaban Growth Audit.
|
| Output:
| - auditScore
| - leadScore
| - businessStage
| - acquisitionStatus
| - primaryBottleneck
| - readiness
| - recommendations
|--------------------------------------------------------------------------
*/

export function generateAudit(form) {
  const businessStage = getBusinessStage(form);
  const acquisitionStatus = getAcquisitionStatus(form);
  const primaryBottleneck = getPrimaryBottleneck(form);
  const readiness = getReadiness(form);

  const auditScore = calculateAuditScore({
    form,
    businessStage,
    acquisitionStatus,
    readiness,
  });

  const leadScore = calculateLeadScore({
    form,
    businessStage,
    acquisitionStatus,
    readiness,
  });

  const recommendations = generateRecommendations({
    form,
    businessStage,
    acquisitionStatus,
    primaryBottleneck,
    readiness,
  });

  return {
    auditScore,
    leadScore,
    businessStage,
    acquisitionStatus,
    primaryBottleneck,
    readiness,
    recommendations,
  };
}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function includesAny(value, keywords = []) {
  const normalized = normalize(value);

  return keywords.some((keyword) =>
    normalized.includes(normalize(keyword))
  );
}

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

/*
|--------------------------------------------------------------------------
| TAHAP BISNIS
|--------------------------------------------------------------------------
*/

function getBusinessStage({ monthlyRevenue }) {
  const revenue = normalize(monthlyRevenue);

  if (
    revenue.includes("< rp10jt") ||
    revenue.includes("tidak ingin")
  ) {
    return {
      key: "early",
      label: "Tahap Awal",
      description:
        "Bisnis masih berada pada tahap membangun traction, memvalidasi penawaran, dan menemukan sistem akuisisi yang dapat berjalan secara konsisten.",
    };
  }

  if (
    revenue.includes("rp10–25jt") ||
    revenue.includes("rp10-25jt") ||
    revenue.includes("rp25–50jt") ||
    revenue.includes("rp25-50jt")
  ) {
    return {
      key: "traction",
      label: "Tahap Traction",
      description:
        "Bisnis sudah mulai memiliki traction dan membutuhkan sistem akuisisi serta konversi yang lebih konsisten untuk menghasilkan pertumbuhan.",
    };
  }

  if (
    revenue.includes("rp50–100jt") ||
    revenue.includes("rp50-100jt") ||
    revenue.includes("rp100–250jt") ||
    revenue.includes("rp100-250jt")
  ) {
    return {
      key: "growth",
      label: "Tahap Pertumbuhan",
      description:
        "Bisnis sudah memiliki basis pendapatan yang cukup untuk mulai mengoptimalkan akuisisi, konversi, dan efisiensi pemasaran secara lebih agresif.",
    };
  }

  if (revenue.includes("rp250jt")) {
    return {
      key: "scale",
      label: "Tahap Scale",
      description:
        "Bisnis sudah berada pada level di mana fokus utama seharusnya bergeser ke efisiensi, prediktabilitas, dan peningkatan volume secara terkontrol.",
    };
  }

  return {
    key: "early",
    label: "Tahap Awal",
    description:
      "Bisnis masih membutuhkan validasi dan pembangunan sistem pertumbuhan yang lebih terstruktur sebelum melakukan scale.",
  };
}

/*
|--------------------------------------------------------------------------
| KONDISI AKUISISI
|--------------------------------------------------------------------------
*/

function getAcquisitionStatus({
  currentlyRunningAds,
  acquisitionChannel,
  conversionMethod,
}) {
  const adsStatus = normalize(currentlyRunningAds);
  const channel = normalize(acquisitionChannel);
  const conversion = normalize(conversionMethod);

  if (adsStatus === "tidak") {
    return {
      key: "not_running",
      label: "Belum Aktif Beriklan",
      description:
        "Bisnis belum memiliki sistem akuisisi berbayar yang sedang berjalan untuk menghasilkan traffic dan calon pelanggan secara konsisten.",
    };
  }

  if (adsStatus === "pernah") {
    return {
      key: "testing",
      label: "Pernah Beriklan",
      description:
        "Bisnis sudah memiliki pengalaman menggunakan iklan berbayar, tetapi sistem akuisisinya belum berjalan secara konsisten.",
    };
  }

  if (
    adsStatus === "ya" &&
    (channel.includes("meta") ||
      channel.includes("google") ||
      channel.includes("tiktok"))
  ) {
    if (
      conversion.includes("whatsapp") ||
      conversion.includes("landing") ||
      conversion.includes("website") ||
      conversion.includes("checkout") ||
      conversion.includes("sales")
    ) {
      return {
        key: "active_system",
        label: "Akuisisi Aktif",
        description:
          "Bisnis sudah memiliki iklan berbayar dan jalur konversi yang dapat dioptimalkan lebih lanjut untuk meningkatkan kualitas dan efisiensi hasil.",
      };
    }

    return {
      key: "active",
      label: "Akuisisi Aktif",
      description:
        "Iklan berbayar sudah berjalan, tetapi jalur konversi masih memiliki ruang yang cukup besar untuk diperkuat.",
    };
  }

  if (adsStatus === "ya") {
    return {
      key: "active",
      label: "Akuisisi Aktif",
      description:
        "Bisnis sedang menjalankan iklan, tetapi masih ada ruang untuk memperkuat sistem akuisisi dan proses konversinya.",
    };
  }

  return {
    key: "unknown",
    label: "Perlu Validasi",
    description:
      "Informasi mengenai sistem akuisisi belum cukup untuk menentukan kondisi bisnis secara lebih spesifik.",
  };
}

/*
|--------------------------------------------------------------------------
| BOTTLENECK UTAMA
|--------------------------------------------------------------------------
*/

function getPrimaryBottleneck({ biggestBottleneck = [] }) {
  if (!Array.isArray(biggestBottleneck)) {
    return getDefaultBottleneck();
  }

  if (biggestBottleneck.length === 0) {
    return getDefaultBottleneck();
  }

  const bottleneck = biggestBottleneck[0];

  const mapping = {
    "Traffic / leads masih kurang": {
      key: "traffic",
      label: "Traffic & Perolehan Lead",
      description:
        "Volume calon pelanggan yang masuk belum cukup untuk menghasilkan pertumbuhan yang konsisten.",
      recommendation:
        "Prioritas pertama adalah membangun sistem akuisisi yang mampu menghasilkan traffic dan lead secara konsisten dengan biaya yang dapat dikendalikan.",
    },

    "Kualitas leads": {
      key: "lead_quality",
      label: "Kualitas Lead",
      description:
        "Traffic mungkin sudah masuk, tetapi kualitas calon pelanggan belum cukup sesuai dengan target bisnis.",
      recommendation:
        "Perbaiki targeting, positioning, penawaran, materi iklan, dan proses kualifikasi agar traffic yang masuk lebih relevan dengan bisnis.",
    },

    "Conversion rate rendah": {
      key: "conversion",
      label: "Tingkat Konversi",
      description:
        "Masalah utama kemungkinan berada setelah traffic masuk, bukan semata-mata pada jumlah traffic yang dihasilkan.",
      recommendation:
        "Periksa funnel, penawaran, landing page, WhatsApp, dan proses penjualan untuk menemukan titik di mana calon pelanggan berhenti melanjutkan.",
    },

    "Biaya mendapatkan customer terlalu tinggi": {
      key: "cac",
      label: "Biaya Akuisisi Pelanggan",
      description:
        "Biaya untuk mendapatkan pelanggan masih terlalu tinggi sehingga ruang untuk melakukan scale menjadi lebih terbatas.",
      recommendation:
        "Evaluasi biaya akuisisi, tingkat konversi, nilai transaksi, materi iklan, targeting, dan funnel sebelum meningkatkan anggaran.",
    },

    "Creative / materi iklan": {
      key: "creative",
      label: "Performa Materi Iklan",
      description:
        "Materi iklan kemungkinan menjadi salah satu faktor utama yang membatasi volume dan efisiensi akuisisi.",
      recommendation:
        "Bangun sistem pengujian materi iklan dengan beberapa pendekatan, hook, format, pesan, dan penawaran untuk menemukan kombinasi yang paling efektif.",
    },

    "Landing page / funnel": {
      key: "funnel",
      label: "Landing Page & Funnel",
      description:
        "Traffic yang masuk berpotensi belum dikonversikan secara maksimal karena masih terdapat hambatan dalam alur funnel.",
      recommendation:
        "Periksa kesesuaian pesan, kepercayaan, penawaran, CTA, bukti sosial, dan hambatan lain yang dapat mengurangi kemungkinan calon pelanggan melakukan tindakan.",
    },

    "WhatsApp / proses sales": {
      key: "sales",
      label: "WhatsApp & Proses Penjualan",
      description:
        "Calon pelanggan sudah masuk, tetapi proses follow-up dan penjualan berpotensi menjadi hambatan utama dalam menghasilkan customer.",
      recommendation:
        "Bangun struktur kualifikasi, response, follow-up, penanganan keberatan, dan proses closing yang lebih konsisten.",
    },

    "Belum punya cukup data": {
      key: "data",
      label: "Data & Pengukuran",
      description:
        "Bisnis belum memiliki cukup data untuk menentukan bottleneck secara akurat.",
      recommendation:
        "Bangun sistem pengukuran terlebih dahulu agar traffic, lead, konversi, biaya akuisisi, dan pendapatan dapat dianalisis sebelum mengambil keputusan scale.",
    },
  };

  return mapping[bottleneck] || getDefaultBottleneck();
}

function getDefaultBottleneck() {
  return {
    key: "diagnostic",
    label: "Diagnosis Pertumbuhan",
    description:
      "Diperlukan validasi lebih lanjut untuk menentukan hambatan utama dalam pertumbuhan bisnis.",
    recommendation:
      "Mulai dengan membangun pengukuran dan mengumpulkan data akuisisi sebelum mengambil keputusan mengenai scale.",
  };
}

/*
|--------------------------------------------------------------------------
| KESIAPAN PERTUMBUHAN
|--------------------------------------------------------------------------
*/

function getReadiness({
  currentlyRunningAds,
  monthlyRevenue,
  monthlyAdSpend,
  investment,
}) {
  let score = 0;

  const ads = normalize(currentlyRunningAds);
  const revenue = normalize(monthlyRevenue);
  const spend = normalize(monthlyAdSpend);
  const invest = normalize(investment);

  /*
   * Kematangan akuisisi berbayar
   */

  if (ads === "ya") {
    score += 25;
  } else if (ads === "pernah") {
    score += 15;
  }

  /*
   * Kematangan pendapatan
   */

  if (revenue.includes("rp250jt")) {
    score += 25;
  } else if (
    revenue.includes("rp100–250jt") ||
    revenue.includes("rp100-250jt")
  ) {
    score += 22;
  } else if (
    revenue.includes("rp50–100jt") ||
    revenue.includes("rp50-100jt")
  ) {
    score += 18;
  } else if (
    revenue.includes("rp25–50jt") ||
    revenue.includes("rp25-50jt")
  ) {
    score += 14;
  } else if (
    revenue.includes("rp10–25jt") ||
    revenue.includes("rp10-25jt")
  ) {
    score += 10;
  }

  /*
   * Anggaran iklan yang sudah berjalan
   */

  if (spend.includes("rp50jt")) {
    score += 20;
  } else if (
    spend.includes("rp25–50jt") ||
    spend.includes("rp25-50jt")
  ) {
    score += 17;
  } else if (
    spend.includes("rp10–25jt") ||
    spend.includes("rp10-25jt")
  ) {
    score += 14;
  } else if (
    spend.includes("rp5–10jt") ||
    spend.includes("rp5-10jt")
  ) {
    score += 10;
  } else if (
    spend.includes("rp1–5jt") ||
    spend.includes("rp1-5jt")
  ) {
    score += 6;
  }

  /*
   * Kesiapan investasi
   */

  if (invest.includes("> rp10jt")) {
    score += 20;
  } else if (invest.includes("rp5–10jt")) {
    score += 16;
  } else if (invest.includes("rp3–5jt")) {
    score += 13;
  } else if (invest.includes("rp1–3jt")) {
    score += 8;
  } else if (invest.includes("< rp1jt")) {
    score += 3;
  }

  score = clamp(score, 0, 100);

  if (score >= 75) {
    return {
      key: "scale",
      label: "Siap Untuk Scale",
      description:
        "Bisnis menunjukkan beberapa indikator yang cukup kuat untuk meningkatkan volume secara lebih terstruktur dan terkontrol.",
    };
  }

  if (score >= 55) {
    return {
      key: "growth",
      label: "Siap Untuk Bertumbuh",
      description:
        "Bisnis memiliki fondasi yang cukup untuk meningkatkan akuisisi, tetapi ekonomi bisnis dan proses konversi tetap perlu diperhatikan.",
    };
  }

  if (score >= 35) {
    return {
      key: "validation",
      label: "Siap Untuk Validasi",
      description:
        "Bisnis memiliki potensi untuk berkembang, tetapi beberapa fondasi masih perlu diperkuat sebelum melakukan scale secara agresif.",
    };
  }

  return {
    key: "foundation",
    label: "Perkuat Fondasi",
    description:
      "Prioritas saat ini adalah membangun fondasi akuisisi dan konversi yang lebih kuat sebelum mengejar peningkatan volume.",
  };
}

/*
|--------------------------------------------------------------------------
| AUDIT SCORE
|--------------------------------------------------------------------------
*/

function calculateAuditScore({
  form,
  businessStage,
  acquisitionStatus,
  readiness,
}) {
  let score = 0;

  const stagePoints = {
    early: 10,
    traction: 20,
    growth: 30,
    scale: 40,
  };

  score += stagePoints[businessStage.key] || 10;

  const acquisitionPoints = {
    not_running: 5,
    testing: 12,
    active: 18,
    active_system: 25,
    unknown: 5,
  };

  score += acquisitionPoints[acquisitionStatus.key] || 5;

  if (form.conversionMethod) {
    score += 5;
  }

  if (
    Array.isArray(form.biggestBottleneck) &&
    form.biggestBottleneck.length > 0
  ) {
    score += 5;
  }

  if (form.goal) {
    score += 5;
  }

  const readinessPoints = {
    foundation: 5,
    validation: 10,
    growth: 15,
    scale: 20,
  };

  score += readinessPoints[readiness.key] || 5;

  if (form.investment) {
    score += 5;
  }

  return clamp(score, 0, 100);
}

/*
|--------------------------------------------------------------------------
| LEAD SCORE
|--------------------------------------------------------------------------
|
| auditScore:
| Seberapa siap kondisi bisnis untuk bertumbuh.
|
| leadScore:
| Seberapa menarik lead tersebut untuk ditindaklanjuti
| secara internal/sales.
|--------------------------------------------------------------------------
*/

function calculateLeadScore({
  form,
  businessStage,
  acquisitionStatus,
  readiness,
}) {
  let score = 0;

  /*
   * Potensi pendapatan
   */

  const revenue = normalize(form.monthlyRevenue);

  if (revenue.includes("rp250jt")) {
    score += 30;
  } else if (
    revenue.includes("rp100–250jt") ||
    revenue.includes("rp100-250jt")
  ) {
    score += 27;
  } else if (
    revenue.includes("rp50–100jt") ||
    revenue.includes("rp50-100jt")
  ) {
    score += 23;
  } else if (
    revenue.includes("rp25–50jt") ||
    revenue.includes("rp25-50jt")
  ) {
    score += 18;
  } else if (
    revenue.includes("rp10–25jt") ||
    revenue.includes("rp10-25jt")
  ) {
    score += 12;
  } else {
    score += 5;
  }

  /*
   * Kesiapan investasi
   */

  const investment = normalize(form.investment);

  if (investment.includes("> rp10jt")) {
    score += 30;
  } else if (
    investment.includes("rp5–10jt") ||
    investment.includes("rp5-10jt")
  ) {
    score += 25;
  } else if (
    investment.includes("rp3–5jt") ||
    investment.includes("rp3-5jt")
  ) {
    score += 20;
  } else if (
    investment.includes("rp1–3jt") ||
    investment.includes("rp1-3jt")
  ) {
    score += 12;
  } else if (investment.includes("< rp1jt")) {
    score += 5;
  } else if (investment.includes("belum tahu")) {
    score += 8;
  }

  /*
   * Kematangan akuisisi
   */

  if (acquisitionStatus.key === "active_system") {
    score += 15;
  } else if (acquisitionStatus.key === "active") {
    score += 12;
  } else if (acquisitionStatus.key === "testing") {
    score += 8;
  } else {
    score += 3;
  }

  /*
   * Kematangan bisnis
   */

  if (businessStage.key === "scale") {
    score += 15;
  } else if (businessStage.key === "growth") {
    score += 12;
  } else if (businessStage.key === "traction") {
    score += 8;
  } else {
    score += 3;
  }

  /*
   * Kejelasan tujuan
   */

  if (form.goal) {
    score += 5;
  }

  /*
   * Bonus kesiapan
   */

  if (readiness.key === "scale") {
    score += 5;
  } else if (readiness.key === "growth") {
    score += 3;
  }

  return clamp(score, 0, 100);
}

/*
|--------------------------------------------------------------------------
| REKOMENDASI
|--------------------------------------------------------------------------
*/

function generateRecommendations({
  form,
  businessStage,
  acquisitionStatus,
  primaryBottleneck,
  readiness,
}) {
  const recommendations = [];

  /*
   * Rekomendasi #1
   * Selalu mulai dari bottleneck utama.
   */

  recommendations.push({
    number: 1,
    title: `Prioritaskan ${primaryBottleneck.label}`,
    description:
      primaryBottleneck.recommendation,
  });

  /*
   * Rekomendasi #2
   * Pengukuran
   */

  recommendations.push({
    number: 2,
    title: "Bangun pengukuran yang jelas",
    description:
      "Pastikan traffic, lead, konversi, biaya akuisisi pelanggan, dan pendapatan dapat dilacak dengan jelas agar keputusan pertumbuhan dibuat berdasarkan data, bukan asumsi.",
  });

  /*
   * Rekomendasi #3
   * Berdasarkan kondisi akuisisi.
   */

  if (acquisitionStatus.key === "not_running") {
    recommendations.push({
      number: 3,
      title: "Validasi channel akuisisi",
      description:
        "Mulai dengan pengujian yang terkontrol untuk menemukan channel, target audiens, materi iklan, dan penawaran yang mampu menghasilkan permintaan secara konsisten.",
    });
  } else if (acquisitionStatus.key === "testing") {
    recommendations.push({
      number: 3,
      title: "Kembali ke pengujian yang terstruktur",
      description:
        "Jangan langsung meningkatkan anggaran. Identifikasi terlebih dahulu materi iklan, audiens, penawaran, dan alur konversi yang menunjukkan potensi terbaik.",
    });
  } else {
    recommendations.push({
      number: 3,
      title: "Optimalkan sebelum meningkatkan anggaran",
      description:
        "Cari kombinasi audiens, materi iklan, penawaran, dan alur konversi yang menghasilkan ekonomi bisnis terbaik sebelum meningkatkan anggaran secara signifikan.",
    });
  }

  /*
   * Rekomendasi #4
   * Berdasarkan metode konversi.
   */

  if (
    normalize(form.conversionMethod).includes("whatsapp")
  ) {
    recommendations.push({
      number: 4,
      title: "Perkuat proses WhatsApp",
      description:
        "Pastikan setiap lead mendapatkan respons yang cepat, proses kualifikasi yang jelas, follow-up yang konsisten, serta alur penjualan yang membantu mengubah percakapan menjadi pelanggan.",
    });
  } else if (
    normalize(form.conversionMethod).includes("landing") ||
    normalize(form.conversionMethod).includes("website")
  ) {
    recommendations.push({
      number: 4,
      title: "Optimalkan funnel konversi",
      description:
        "Periksa kesesuaian pesan, kepercayaan, penawaran, CTA, bukti sosial, dan hambatan lain pada landing page sebelum menambah traffic.",
    });
  } else {
    recommendations.push({
      number: 4,
      title: "Perjelas sistem konversi",
      description:
        "Pastikan terdapat proses yang konsisten untuk mengubah ketertarikan menjadi lead yang memenuhi kriteria dan kemudian menjadi pelanggan.",
    });
  }

  /*
   * Rekomendasi #5
   * Batasan untuk scaling.
   */

  if (readiness.key === "scale") {
    recommendations.push({
      number: 5,
      title: "Tingkatkan volume dengan menjaga economics",
      description:
        "Bisnis sudah menunjukkan kesiapan yang cukup kuat. Fokus berikutnya adalah meningkatkan volume tanpa membiarkan biaya akuisisi meningkat terlalu tinggi atau efisiensi konversi menurun.",
    });
  } else {
    recommendations.push({
      number: 5,
      title: "Jangan melakukan scale terlalu cepat",
      description:
        "Validasi funnel dan ekonomi bisnis terlebih dahulu. Meningkatkan traffic pada funnel yang belum stabil hanya akan memperbesar masalah yang sudah ada.",
    });
  }

  return recommendations;
}