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
| BUSINESS STAGE
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
      label: "Early Stage",
      description:
        "Bisnis masih berada pada tahap membangun traction dan memvalidasi sistem akuisisi yang konsisten.",
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
      label: "Traction Stage",
      description:
        "Bisnis sudah memiliki traction dan mulai membutuhkan sistem akuisisi yang lebih konsisten.",
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
      label: "Growth Stage",
      description:
        "Bisnis sudah memiliki basis revenue yang cukup untuk mengoptimalkan acquisition dan conversion secara lebih agresif.",
    };
  }

  if (revenue.includes("rp250jt")) {
    return {
      key: "scale",
      label: "Scale Stage",
      description:
        "Bisnis sudah berada pada level di mana fokus utama seharusnya adalah efficiency, predictability, dan scaling.",
    };
  }

  return {
    key: "early",
    label: "Early Stage",
    description:
      "Bisnis masih membutuhkan validasi dan pembangunan sistem growth yang lebih terstruktur.",
  };
}

/*
|--------------------------------------------------------------------------
| ACQUISITION STATUS
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
        "Bisnis belum memiliki acquisition engine berbayar yang sedang berjalan.",
    };
  }

  if (adsStatus === "pernah") {
    return {
      key: "testing",
      label: "Pernah Beriklan",
      description:
        "Bisnis sudah memiliki pengalaman menggunakan paid acquisition, tetapi sistemnya belum berjalan secara konsisten.",
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
        label: "Active Acquisition",
        description:
          "Bisnis sudah memiliki paid acquisition dan jalur conversion yang dapat dioptimalkan lebih lanjut.",
      };
    }

    return {
      key: "active",
      label: "Active Acquisition",
      description:
        "Paid acquisition sudah berjalan, tetapi conversion path masih memiliki ruang untuk diperkuat.",
    };
  }

  if (adsStatus === "ya") {
    return {
      key: "active",
      label: "Active Acquisition",
      description:
        "Bisnis sedang menjalankan acquisition, tetapi masih ada ruang untuk memperkuat sistem dan conversion flow.",
    };
  }

  return {
    key: "unknown",
    label: "Perlu Validasi",
    description:
      "Data acquisition belum cukup untuk menentukan kondisi secara spesifik.",
  };
}

/*
|--------------------------------------------------------------------------
| PRIMARY BOTTLENECK
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
      label: "Traffic & Lead Generation",
      description:
        "Volume calon customer belum cukup untuk menghasilkan pertumbuhan yang konsisten.",
      recommendation:
        "Fokus pertama adalah membangun acquisition system yang mampu menghasilkan traffic dan leads secara konsisten.",
    },

    "Kualitas leads": {
      key: "lead_quality",
      label: "Lead Quality",
      description:
        "Traffic mungkin sudah masuk, tetapi kualitas calon customer belum cukup sesuai dengan target bisnis.",
      recommendation:
        "Perbaiki targeting, positioning, offer, creative, dan qualification agar traffic yang masuk lebih relevan.",
    },

    "Conversion rate rendah": {
      key: "conversion",
      label: "Conversion",
      description:
        "Masalah utama kemungkinan berada setelah traffic masuk, bukan semata-mata pada jumlah traffic.",
      recommendation:
        "Audit funnel, offer, landing page, WhatsApp, dan sales process untuk menemukan titik drop-off.",
    },

    "Biaya mendapatkan customer terlalu tinggi": {
      key: "cac",
      label: "Customer Acquisition Cost",
      description:
        "Biaya mendapatkan customer perlu diturunkan agar acquisition dapat di-scale dengan economics yang sehat.",
      recommendation:
        "Audit CAC, conversion rate, average order value, creative, targeting, dan funnel sebelum meningkatkan budget.",
    },

    "Creative / materi iklan": {
      key: "creative",
      label: "Creative Performance",
      description:
        "Creative kemungkinan menjadi salah satu faktor utama yang membatasi volume dan efficiency acquisition.",
      recommendation:
        "Bangun creative testing system dengan beberapa angle, hook, format, dan offer.",
    },

    "Landing page / funnel": {
      key: "funnel",
      label: "Landing Page & Funnel",
      description:
        "Traffic yang masuk berpotensi belum dikonversikan secara maksimal karena friction di funnel.",
      recommendation:
        "Audit message match, trust, offer, CTA, social proof, dan conversion flow.",
    },

    "WhatsApp / proses sales": {
      key: "sales",
      label: "WhatsApp & Sales Process",
      description:
        "Potential customer sudah masuk, tetapi proses follow-up dan closing dapat menjadi bottleneck utama.",
      recommendation:
        "Bangun struktur qualification, follow-up, objection handling, dan closing yang lebih konsisten.",
    },

    "Belum punya cukup data": {
      key: "data",
      label: "Data & Measurement",
      description:
        "Bisnis belum memiliki cukup data untuk menentukan bottleneck secara akurat.",
      recommendation:
        "Bangun measurement system terlebih dahulu sebelum melakukan scaling.",
    },
  };

  return (
    mapping[bottleneck] ||
    getDefaultBottleneck()
  );
}

function getDefaultBottleneck() {
  return {
    key: "diagnostic",
    label: "Growth Diagnosis",
    description:
      "Diperlukan validasi lebih lanjut untuk menentukan bottleneck utama bisnis.",
    recommendation:
      "Mulai dari measurement dan acquisition data sebelum mengambil keputusan scaling.",
  };
}

/*
|--------------------------------------------------------------------------
| READINESS
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
   * Paid acquisition maturity
   */

  if (ads === "ya") {
    score += 25;
  } else if (ads === "pernah") {
    score += 15;
  }

  /*
   * Revenue maturity
   */

  if (
    revenue.includes("rp250jt")
  ) {
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
   * Existing ad spend
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
   * Investment readiness
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
        "Bisnis menunjukkan beberapa indikator yang cukup kuat untuk melakukan scaling secara lebih terstruktur.",
    };
  }

  if (score >= 55) {
    return {
      key: "growth",
      label: "Siap Untuk Growth",
      description:
        "Bisnis memiliki foundation yang cukup untuk meningkatkan acquisition, tetapi economics dan conversion tetap perlu diperhatikan.",
    };
  }

  if (score >= 35) {
    return {
      key: "validation",
      label: "Siap Untuk Validasi",
      description:
        "Ada potential untuk growth, tetapi beberapa bagian fundamental perlu diperkuat sebelum melakukan scaling agresif.",
    };
  }

  return {
    key: "foundation",
    label: "Perkuat Foundation",
    description:
      "Prioritas saat ini adalah membangun foundation acquisition dan conversion sebelum mengejar scale.",
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

  /*
   * Business stage
   */

  const stagePoints = {
    early: 10,
    traction: 20,
    growth: 30,
    scale: 40,
  };

  score += stagePoints[businessStage.key] || 10;

  /*
   * Acquisition maturity
   */

  const acquisitionPoints = {
    not_running: 5,
    testing: 12,
    active: 18,
    active_system: 25,
    unknown: 5,
  };

  score +=
    acquisitionPoints[acquisitionStatus.key] || 5;

  /*
   * Conversion method
   */

  if (form.conversionMethod) {
    score += 5;
  }

  /*
   * Bottleneck clarity
   */

  if (
    Array.isArray(form.biggestBottleneck) &&
    form.biggestBottleneck.length > 0
  ) {
    score += 5;
  }

  /*
   * Goal clarity
   */

  if (form.goal) {
    score += 5;
  }

  /*
   * Readiness
   */

  const readinessPoints = {
    foundation: 5,
    validation: 10,
    growth: 15,
    scale: 20,
  };

  score +=
    readinessPoints[readiness.key] || 5;

  /*
   * Investment clarity
   */

  if (form.investment) {
    score += 5;
  }

  /*
   * Final normalization
   */

  return clamp(score, 0, 100);
}

/*
|--------------------------------------------------------------------------
| LEAD SCORE
|--------------------------------------------------------------------------
|
| Ini berbeda dengan auditScore.
|
| auditScore:
| Seberapa siap kondisi bisnis untuk growth.
|
| leadScore:
| Seberapa menarik lead tersebut untuk ditindaklanjuti
| secara sales/internal.
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
   * Revenue potential
   */

  const revenue = normalize(
    form.monthlyRevenue
  );

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
   * Investment
   */

  const investment = normalize(
    form.investment
  );

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
   * Acquisition maturity
   */

  if (acquisitionStatus.key === "active_system") {
    score += 15;
  } else if (
    acquisitionStatus.key === "active"
  ) {
    score += 12;
  } else if (
    acquisitionStatus.key === "testing"
  ) {
    score += 8;
  } else {
    score += 3;
  }

  /*
   * Business maturity
   */

  if (businessStage.key === "scale") {
    score += 15;
  } else if (
    businessStage.key === "growth"
  ) {
    score += 12;
  } else if (
    businessStage.key === "traction"
  ) {
    score += 8;
  } else {
    score += 3;
  }

  /*
   * Goal clarity
   */

  if (form.goal) {
    score += 5;
  }

  /*
   * Readiness bonus
   */

  if (readiness.key === "scale") {
    score += 5;
  } else if (
    readiness.key === "growth"
  ) {
    score += 3;
  }

  return clamp(score, 0, 100);
}

/*
|--------------------------------------------------------------------------
| RECOMMENDATIONS
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
   * Recommendation #1
   * Always address the primary bottleneck.
   */

  recommendations.push({
    number: 1,
    title: `Prioritaskan ${primaryBottleneck.label}`,
    description:
      primaryBottleneck.recommendation,
  });

  /*
   * Recommendation #2
   * Measurement
   */

  recommendations.push({
    number: 2,
    title: "Bangun measurement yang jelas",
    description:
      "Pastikan traffic, leads, conversion, customer acquisition cost, dan revenue dapat dilacak agar keputusan growth dibuat berdasarkan data.",
  });

  /*
   * Recommendation #3
   * Depends on acquisition status.
   */

  if (
    acquisitionStatus.key === "not_running"
  ) {
    recommendations.push({
      number: 3,
      title: "Validasi acquisition channel",
      description:
        "Mulai dengan controlled test untuk menemukan channel, audience, creative, dan offer yang mampu menghasilkan demand secara konsisten.",
    });
  } else if (
    acquisitionStatus.key === "testing"
  ) {
    recommendations.push({
      number: 3,
      title: "Kembali ke testing terstruktur",
      description:
        "Jangan langsung meningkatkan budget. Identifikasi creative, audience, offer, dan conversion flow yang paling menjanjikan terlebih dahulu.",
    });
  } else {
    recommendations.push({
      number: 3,
      title: "Optimalkan sebelum scale",
      description:
        "Cari kombinasi audience, creative, offer, dan conversion flow yang menghasilkan economics terbaik sebelum meningkatkan budget.",
    });
  }

  /*
   * Recommendation #4
   * Conversion
   */

  if (
    normalize(form.conversionMethod).includes(
      "whatsapp"
    )
  ) {
    recommendations.push({
      number: 4,
      title: "Perkuat proses WhatsApp",
      description:
        "Pastikan setiap lead mendapatkan response cepat, qualification yang jelas, follow-up, dan sales flow yang terstruktur.",
    });
  } else if (
    normalize(form.conversionMethod).includes(
      "landing"
    ) ||
    normalize(form.conversionMethod).includes(
      "website"
    )
  ) {
    recommendations.push({
      number: 4,
      title: "Optimalkan conversion funnel",
      description:
        "Audit message match, trust, offer, CTA, social proof, dan friction pada landing page sebelum menambah traffic.",
    });
  } else {
    recommendations.push({
      number: 4,
      title: "Perjelas conversion system",
      description:
        "Pastikan ada proses yang konsisten untuk mengubah interest menjadi qualified lead dan akhirnya menjadi customer.",
    });
  }

  /*
   * Recommendation #5
   * Scaling guardrail
   */

  if (
    readiness.key === "scale"
  ) {
    recommendations.push({
      number: 5,
      title: "Scale dengan kontrol economics",
      description:
        "Bisnis sudah menunjukkan readiness yang cukup kuat. Fokus berikutnya adalah meningkatkan volume tanpa membiarkan CAC dan conversion efficiency memburuk.",
    });
  } else {
    recommendations.push({
      number: 5,
      title: "Jangan scale terlalu cepat",
      description:
        "Validasi funnel dan unit economics terlebih dahulu. Scaling traffic ke funnel yang belum stabil hanya akan memperbesar bottleneck.",
    });
  }

  return recommendations;
}