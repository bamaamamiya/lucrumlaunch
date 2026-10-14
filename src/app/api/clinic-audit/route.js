import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { sendMetaEvent, normalizeEmail, normalizePhone } from "@/lib/meta-capi";

export const runtime = "nodejs";

const qualifiedRevenueOptions = [
  "Rp3–5 miliar",
  "Rp5–10 miliar",
  "Di atas Rp10 miliar",
];

export async function POST(request) {
  try {
    const body = await request.json();
    const form = body?.form;

    if (!form || typeof form !== "object" || Array.isArray(form)) {
      return NextResponse.json(
        { error: "Data form tidak valid." },
        { status: 400 },
      );
    }

    const clinicName = String(form.clinicName || "").trim();
    const name = String(form.name || "").trim();
    const email = normalizeEmail(String(form.email || ""));
    const whatsapp = normalizePhone(String(form.whatsapp || ""));
    const isClinicOwner = form.isClinicOwner === "Ya";
    const annualRevenue = String(form.annualRevenue || "");
    const contactConsent = form.contactConsent === true;

    if (
      !clinicName ||
      !name ||
      !email ||
      !whatsapp ||
      !contactConsent ||
      !isClinicOwner ||
      !revenueOptionsIncludes(annualRevenue)
    ) {
      return NextResponse.json(
        { error: "Periksa kembali data form Anda." },
        { status: 400 },
      );
    }

    const qualified = qualifiedRevenueOptions.includes(annualRevenue);
    const db = getAdminDb();
    const auditRef = db.collection("clinicAudits").doc();
    const eventId = randomUUID();

    const fbp = typeof body.fbp === "string" ? body.fbp.slice(0, 200) : "";
    const fbc = typeof body.fbc === "string" ? body.fbc.slice(0, 200) : "";

    await auditRef.set({
      isClinicOwner: "Ya",
      annualRevenue,
      clinicName,
      name,
      email,
      emailLower: email,
      whatsapp,
      contactConsent,
      qualified,
      qualificationTier: qualified ? "qualified" : "nurture",
      qualificationReasons: [
        "Kontak menyatakan sebagai pemilik klinik",
        qualified
          ? "Omzet tahunan masuk kriteria awal Lucratus"
          : "Omzet tahunan di bawah ambang kualifikasi awal",
      ],
      salesStage: qualified ? "new" : "nurture",
      contactStatus: "not_contacted",
      nurtureStage: "not_started",
      bookingStatus: "not_booked",
      clientStatus: "lead",
      paymentStatus: "unpaid",
      source: "clinic-audit-website",
      formVersion: "clinic-v2-short",
      metaTracking: {
        leadEventId: eventId,
        fbp: fbp || null,
        fbc: fbc || null,
      },
      contactConsentAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    let metaLeadSent = false;
    let metaQualifiedLeadSent = false;

    const userAgent = request.headers.get("user-agent") || undefined;
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      undefined;

    try {
      await sendMetaEvent({
        eventName: "Lead",
        eventId,
        email,
        phone: whatsapp,
        fbp,
        fbc,
        externalId: auditRef.id,
        eventSourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/clinic-audit`,
        actionSource: "website",
        clientIp,
        userAgent,
        customData: {
          content_name: "Clinic Growth Assessment",
          content_category: "Clinic",
        },
      });

      metaLeadSent = true;
    } catch (error) {
      console.error("Meta Lead failed:", error);
    }

    if (qualified) {
      try {
        await sendMetaEvent({
          eventName: "QualifiedLead",
          eventId: `qualified_${auditRef.id}`,
          email,
          phone: whatsapp,
          fbp,
          fbc,
          externalId: auditRef.id,
          eventSourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/clinic-audit`,
          actionSource: "system_generated",
          clientIp,
          userAgent,
          customData: {
            lead_event_source: "Lucratus Clinic CRM",
          },
        });

        metaQualifiedLeadSent = true;
      } catch (error) {
        console.error("Meta QualifiedLead failed:", error);
      }
    }

    await auditRef.update({
      "metaTracking.leadSent": metaLeadSent,
      "metaTracking.qualifiedLeadSent": metaQualifiedLeadSent,
      "metaTracking.lastAttemptAt": FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      auditId: auditRef.id,
      eventId,
      qualified,
      qualifiedEventId: qualified ? `qualified_${auditRef.id}` : null,
    });
  } catch (error) {
    console.error("Clinic audit API failed:", error);

    return NextResponse.json(
      { error: "Form belum berhasil dikirim. Silakan coba kembali." },
      { status: 500 },
    );
  }
}

function revenueOptionsIncludes(value) {
  return [
    "Di bawah Rp500 juta",
    "Rp500 juta–Rp1 miliar",
    "Rp1–3 miliar",
    "Rp3–5 miliar",
    "Rp5–10 miliar",
    "Di atas Rp10 miliar",
    "Belum ingin menyebutkan",
  ].includes(value);
}
