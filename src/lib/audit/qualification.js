
const CORE_BUSINESS_TYPES = [
  "E-commerce",
  "Bisnis Lokal",
  "Klinik / Healthcare",
  "Jasa Profesional",
  "Edukasi / Kursus",
  "B2B",
  "SaaS / Teknologi",
];

const REVENUE_SCORES = {
  "< Rp10jt": 0,
  "Rp10–25jt": 1,
  "Rp25–50jt": 2,
  "Rp50–100jt": 3,
  "Rp100–250jt": 3,
  "Rp250jt+": 3,
  "Tidak ingin menyebutkan": 0,
};

const FEE_SCORES = {
  "< Rp1jt": 0,
  "Rp1–3jt": 1,
  "Rp3–5jt": 2,
  "Rp5–10jt": 3,
  "Di atas Rp10jt": 3,
  "Belum tahu, ingin memahami rekomendasinya terlebih dahulu": 0,
};

const MEDIA_SCORES = {
  "Belum ada budget iklan": 0,
  "Di bawah Rp1jt": 0,
  "Rp1–5jt": 1,
  "Rp5–10jt": 2,
  "Rp10–25jt": 3,
  "Di atas Rp25jt": 3,
};

export function calculateQualification(form) {
  let businessFitScore = 0;
  let salesReadinessScore = 0;
  let nurturePotentialScore = 0;

  const reasons = [];

  // BUSINESS FIT
  if (CORE_BUSINESS_TYPES.includes(form.businessType)) {
    businessFitScore += 2;
  }

  if (
    ["1–2 tahun", "3–5 tahun", "Lebih dari 5 tahun"].includes(
      form.businessAge,
    )
  ) {
    businessFitScore += 1;
  }

  if (form.salesConsistency === "Ya, rutin") {
    businessFitScore += 2;
  } else if (form.salesConsistency === "Kadang-kadang") {
    businessFitScore += 1;
    reasons.push("Penjualan belum konsisten");
  } else if (form.salesConsistency === "Belum ada penjualan") {
    reasons.push("Bisnis belum tervalidasi melalui penjualan");
  }

  if (
    ["Rp25–50jt", "Rp50–100jt", "Rp100–250jt", "Rp250jt+"].includes(
      form.monthlyRevenue,
    )
  ) {
    businessFitScore += 1;
  }

  // SALES READINESS
  salesReadinessScore += REVENUE_SCORES[form.monthlyRevenue] ?? 0;
  salesReadinessScore += FEE_SCORES[form.agencyFeeBudget] ?? 0;
  salesReadinessScore += MEDIA_SCORES[form.mediaBudget] ?? 0;

  if (form.currentlyRunningAds === "Ya") {
    salesReadinessScore += 1;
  }

  if (form.decisionAuthority === "Saya pengambil keputusan") {
    salesReadinessScore += 2;
  } else if (
    form.decisionAuthority ===
    "Saya berbagi keputusan dengan partner/tim"
  ) {
    salesReadinessScore += 1;
  } else if (form.decisionAuthority) {
    reasons.push("Perlu melibatkan pengambil keputusan");
  }

  if (form.startTimeline === "Dalam 30 hari") {
    salesReadinessScore += 3;
  } else if (form.startTimeline === "Dalam 31–90 hari") {
    salesReadinessScore += 2;
  } else if (form.startTimeline === "Lebih dari 90 hari") {
    salesReadinessScore += 1;
  }

  if (form.urgency === "Sangat mendesak") {
    salesReadinessScore += 2;
  } else if (form.urgency === "Cukup mendesak") {
    salesReadinessScore += 1;
  }

  // NURTURE POTENTIAL
  if (form.goal?.trim()) {
    nurturePotentialScore += 1;
  }

  if (
    ["Sangat mendesak", "Cukup mendesak"].includes(form.urgency)
  ) {
    nurturePotentialScore += 2;
  }

  if (form.currentlyRunningAds === "Pernah") {
    nurturePotentialScore += 1;
  }

  if (form.agencyFeeBudget?.startsWith("Belum tahu")) {
    nurturePotentialScore += 1;
    reasons.push("Perlu edukasi tentang fee dan model kerja sama");
  }

  if (form.startTimeline === "Dalam 31–90 hari") {
    nurturePotentialScore += 2;
  } else if (
    ["Lebih dari 90 hari", "Belum memiliki rencana"].includes(
      form.startTimeline,
    )
  ) {
    nurturePotentialScore += 1;
  }

  if (form.revenueTrend === "Menurun") {
    nurturePotentialScore += 1;
    reasons.push("Omzet sedang menurun");
  }

  if (form.leadConversionRate === "Belum tahu") {
    nurturePotentialScore += 1;
    reasons.push("Perlu mengukur konversi leads");
  }

  // FIT GATES
  const validBusiness =
    Boolean(form.businessType) &&
    form.salesConsistency !== "Belum ada penjualan";

  const hasContact =
    Boolean(form.name?.trim()) &&
    Boolean(form.whatsapp?.trim()) &&
    Boolean(form.email?.trim());

  const feeCanFit = [
    "Rp3–5jt",
    "Rp5–10jt",
    "Di atas Rp10jt",
  ].includes(form.agencyFeeBudget);

  const feeNeedsEducation =
    form.agencyFeeBudget?.startsWith("Belum tahu");

  const decisionReady = [
    "Saya pengambil keputusan",
    "Saya berbagi keputusan dengan partner/tim",
  ].includes(form.decisionAuthority);

  const timelineReady = form.startTimeline === "Dalam 30 hari";

  const hasMediaBudget = [
    "Rp1–5jt",
    "Rp5–10jt",
    "Rp10–25jt",
    "Di atas Rp25jt",
  ].includes(form.mediaBudget);

  const salesReady =
    validBusiness &&
    hasContact &&
    feeCanFit &&
    hasMediaBudget &&
    decisionReady &&
    timelineReady &&
    salesReadinessScore >= 9;

  let qualificationTier;

  if (!validBusiness || !hasContact) {
    qualificationTier = "not_fit";
  } else if (salesReady) {
    qualificationTier = "sales_ready";
  } else if (
    businessFitScore >= 3 &&
    (
      nurturePotentialScore >= 3 ||
      feeNeedsEducation ||
      form.startTimeline === "Dalam 31–90 hari"
    )
  ) {
    qualificationTier = "high_potential_nurture";
  } else {
    qualificationTier = "long_term_nurture";
  }

  if (form.agencyFeeBudget === "< Rp1jt") {
    reasons.push("Budget fee belum sesuai target layanan agency");
  } else if (form.agencyFeeBudget === "Rp1–3jt") {
    reasons.push("Perlu menilai kecocokan scope dengan budget fee");
  }

  if (
    ["Belum ada budget iklan", "Di bawah Rp1jt"].includes(
      form.mediaBudget,
    )
  ) {
    reasons.push("Media spend masih terbatas atau belum dialokasikan");
  }

  if (form.startTimeline === "Lebih dari 90 hari") {
    reasons.push("Rencana implementasi masih jangka panjang");
  }

  if (form.decisionAuthority === "Saya perlu meminta persetujuan orang lain") {
    reasons.push("Persetujuan pengambil keputusan masih diperlukan");
  }

  const nextAction = {
    sales_ready: "contact_within_1_business_day",
    high_potential_nurture: "personal_follow_up_and_case_study",
    long_term_nurture: "educational_nurture_and_reassess",
    not_fit: "provide_self_serve_resources",
  }[qualificationTier];

  return {
    businessFitScore,
    salesReadinessScore,
    nurturePotentialScore,
    qualificationTier,
    qualified: qualificationTier === "sales_ready",
    qualificationReasons: [...new Set(reasons)],
    nextAction,
  };
}
