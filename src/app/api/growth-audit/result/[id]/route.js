import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing audit ID" },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    const snapshot = await db
      .collection("growthAudits")
      .doc(id)
      .get();

    if (!snapshot.exists) {
      return NextResponse.json(
        { error: "Audit not found" },
        { status: 404 }
      );
    }

    const data = snapshot.data();

    return NextResponse.json({
      id: snapshot.id,
      auditScore: data.auditScore,
      businessStage: data.businessStage,
      acquisitionStatus: data.acquisitionStatus,
      primaryBottleneck: data.primaryBottleneck,
      readiness: data.readiness,
      recommendations: data.recommendations,
    });
  } catch (error) {
    console.error("Growth audit result error:", error);

    return NextResponse.json(
      { error: "Failed to load audit" },
      { status: 500 }
    );
  }
}