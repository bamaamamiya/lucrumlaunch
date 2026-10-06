"use client";

import { useState } from "react";

export default function GrowthAuditPDF({ audit }) {
  const [generating, setGenerating] = useState(false);

  const downloadPDF = async () => {
    if (generating || !audit) return;

    setGenerating(true);

    try {
      const { jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 17;
      const contentWidth = pageWidth - margin * 2;

      // =========================================================
      // COLORS
      // =========================================================

      const COLORS = {
        black: [13, 13, 13],
        surface: [27, 27, 30],
        surface2: [35, 35, 38],
        text: [255, 255, 255],
        muted: [160, 160, 165],
        subtle: [115, 115, 120],
        line: [55, 55, 59],
        soft: [190, 190, 195],
      };

      // =========================================================
      // SAFE DATA
      // =========================================================

      const businessStage = audit.businessStage || {};
      const acquisitionStatus = audit.acquisitionStatus || {};
      const bottleneck = audit.primaryBottleneck || {};
      const readiness = audit.readiness || {};

      const recommendations = Array.isArray(audit.recommendations)
        ? audit.recommendations
        : [];

      const text = (value, fallback = "-") => {
        return String(value ?? fallback);
      };

      const auditScore = text(audit.auditScore, "—");

      const brandName = text(
        audit.brandName,
        "Your Business",
      );

      // =========================================================
      // HELPERS
      // =========================================================

      const addPageBackground = () => {
        pdf.setFillColor(...COLORS.black);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");
      };

      const addHeader = ({
        label = "PERSONALIZED GROWTH DIAGNOSIS",
        pageLabel = "",
      } = {}) => {
        addPageBackground();

        pdf.setTextColor(...COLORS.text);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);

        pdf.text(
          "LUCRATUS AGENCY",
          margin,
          17,
        );

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6.5);
        pdf.setTextColor(...COLORS.subtle);

        pdf.text(
          label,
          margin,
          23,
        );

        if (pageLabel) {
          pdf.text(
            pageLabel,
            pageWidth - margin,
            17,
            {
              align: "right",
            },
          );
        }

        pdf.setDrawColor(...COLORS.line);
        pdf.setLineWidth(0.25);

        pdf.line(
          margin,
          29,
          pageWidth - margin,
          29,
        );
      };

      const addFooter = () => {
        pdf.setDrawColor(...COLORS.line);
        pdf.setLineWidth(0.2);

        pdf.line(
          margin,
          pageHeight - 15,
          pageWidth - margin,
          pageHeight - 15,
        );

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6.5);
        pdf.setTextColor(...COLORS.subtle);

        pdf.text(
          "Prepared by lucratusagency",
          margin,
          pageHeight - 8,
        );

        pdf.text(
          `Page ${pdf.internal.getNumberOfPages()}`,
          pageWidth - margin,
          pageHeight - 8,
          {
            align: "right",
          },
        );
      };

      const addSectionTitle = (title, y, subtitle = "") => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10.5);
        pdf.setTextColor(...COLORS.text);

        pdf.text(
          title.toUpperCase(),
          margin,
          y,
        );

        if (subtitle) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7);
          pdf.setTextColor(...COLORS.subtle);

          pdf.text(
            subtitle,
            pageWidth - margin,
            y,
            {
              align: "right",
            },
          );
        }

        pdf.setDrawColor(...COLORS.line);

        pdf.line(
          margin,
          y + 4,
          pageWidth - margin,
          y + 4,
        );

        return y + 13;
      };

      const drawSmallLabel = (label, x, y) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6.5);
        pdf.setTextColor(...COLORS.subtle);

        pdf.text(
          label.toUpperCase(),
          x,
          y,
        );
      };

      const drawMetricCard = (
        x,
        y,
        width,
        height,
        label,
        value,
      ) => {
        pdf.setFillColor(...COLORS.surface);

        pdf.roundedRect(
          x,
          y,
          width,
          height,
          3,
          3,
          "F",
        );

        drawSmallLabel(
          label,
          x + 6,
          y + 9,
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(
          value.length > 18 ? 8.5 : 11,
        );

        pdf.setTextColor(...COLORS.text);

        pdf.text(
          value,
          x + 6,
          y + 20,
        );
      };

      // =========================================================
      // PAGE 1
      // EXECUTIVE DIAGNOSIS
      // =========================================================

      addHeader({
        label: "PERSONALIZED GROWTH DIAGNOSIS",
        pageLabel: "01",
      });

      let y = 43;

      drawSmallLabel(
        "YOUR BUSINESS",
        margin,
        y,
      );

      y += 9;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(23);
      pdf.setTextColor(...COLORS.text);

      const brandLines = pdf.splitTextToSize(
        brandName,
        contentWidth,
      );

      pdf.text(
        brandLines,
        margin,
        y,
      );

      y += brandLines.length * 9 + 5;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(...COLORS.muted);

      pdf.text(
        "Personalized Growth Diagnosis",
        margin,
        y,
      );

      y += 16;

      // =========================================================
      // HERO SCORE
      // =========================================================

      pdf.setFillColor(...COLORS.surface2);

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        48,
        4,
        4,
        "F",
      );

      drawSmallLabel(
        "GROWTH READINESS",
        margin + 8,
        y + 11,
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(17);
      pdf.setTextColor(...COLORS.text);

      pdf.text(
        text(readiness.label, "Assessment"),
        margin + 8,
        y + 23,
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(...COLORS.muted);

      const readinessDescription =
        pdf.splitTextToSize(
          text(
            readiness.description,
            "Initial assessment based on the information provided.",
          ),
          105,
        );

      pdf.text(
        readinessDescription,
        margin + 8,
        y + 33,
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(27);
      pdf.setTextColor(...COLORS.text);

      pdf.text(
        auditScore,
        pageWidth - margin - 8,
        y + 28,
        {
          align: "right",
        },
      );

      y += 61;

      // =========================================================
      // CURRENT POSITION
      // =========================================================

      y = addSectionTitle(
        "Current Position",
        y,
        "Where your business stands today",
      );

      const metricGap = 4;
      const metricWidth =
        (contentWidth - metricGap * 2) / 3;

      drawMetricCard(
        margin,
        y,
        metricWidth,
        30,
        "Business Stage",
        text(businessStage.label),
      );

      drawMetricCard(
        margin + metricWidth + metricGap,
        y,
        metricWidth,
        30,
        "Acquisition",
        text(acquisitionStatus.label),
      );

      drawMetricCard(
        margin + (metricWidth + metricGap) * 2,
        y,
        metricWidth,
        30,
        "Primary Bottleneck",
        text(bottleneck.label),
      );

      y += 44;

      // =========================================================
      // PRIMARY DIAGNOSIS
      // =========================================================

      y = addSectionTitle(
        "Primary Diagnosis",
        y,
        "The biggest opportunity identified",
      );

      pdf.setFillColor(...COLORS.surface);

      const diagnosisStartY = y;

      const diagnosisLabel = text(
        bottleneck.label,
        "your growth system",
      );

      const diagnosisTitle =
        `Your biggest opportunity is ${diagnosisLabel.toLowerCase()}.`;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(...COLORS.text);

      const diagnosisTitleLines =
        pdf.splitTextToSize(
          diagnosisTitle,
          contentWidth - 16,
        );

      pdf.text(
        diagnosisTitleLines,
        margin + 8,
        y + 11,
      );

      y += diagnosisTitleLines.length * 6.5 + 17;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(...COLORS.muted);

      const diagnosisDescription =
        pdf.splitTextToSize(
          text(
            bottleneck.description,
            "This area represents the clearest opportunity based on the information submitted.",
          ),
          contentWidth - 16,
        );

      pdf.text(
        diagnosisDescription,
        margin + 8,
        y,
      );

      y += diagnosisDescription.length * 5 + 12;

      pdf.setDrawColor(...COLORS.line);

      pdf.line(
        margin + 8,
        y,
        pageWidth - margin - 8,
        y,
      );

      y += 10;

      drawSmallLabel(
        "RECOMMENDED FOCUS",
        margin + 8,
        y,
      );

      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(...COLORS.soft);

      const focusLines = pdf.splitTextToSize(
        text(
          bottleneck.recommendation,
          "Focus on strengthening this area before adding more complexity.",
        ),
        contentWidth - 16,
      );

      pdf.text(
        focusLines,
        margin + 8,
        y,
      );

      y = Math.max(
        y + focusLines.length * 5 + 8,
        diagnosisStartY + 66,
      );

      addFooter();

      // =========================================================
      // PAGE 2
      // RECOMMENDED DIRECTION
      // =========================================================

      pdf.addPage();

      addHeader({
        label: "RECOMMENDED GROWTH DIRECTION",
        pageLabel: "02",
      });

      y = 43;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(...COLORS.text);

      pdf.text(
        "What to focus on next.",
        margin,
        y,
      );

      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(...COLORS.muted);

      const directionIntro =
        pdf.splitTextToSize(
          "These recommendations are designed to help you address the primary constraint before adding more marketing complexity.",
          contentWidth,
        );

      pdf.text(
        directionIntro,
        margin,
        y,
      );

      y += directionIntro.length * 5 + 15;

      // =========================================================
      // RECOMMENDATIONS
      // =========================================================

      y = addSectionTitle(
        "Recommended Next Steps",
        y,
        `${recommendations.length} priorities`,
      );

      if (!recommendations.length) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(...COLORS.muted);

        pdf.text(
          "No specific recommendations were generated.",
          margin,
          y,
        );

        y += 15;
      }

      recommendations.forEach((item, index) => {
        const number = text(
          item.number,
          String(index + 1).padStart(2, "0"),
        );

        const title = text(
          item.title,
          "Recommended Action",
        );

        const description = text(
          item.description,
          "",
        );

        const estimatedHeight =
          27 +
          pdf.splitTextToSize(
            description,
            contentWidth - 28,
          ).length *
            5;

        if (
          y + estimatedHeight >
          pageHeight - 55
        ) {
          addFooter();

          pdf.addPage();

          addHeader({
            label: "RECOMMENDED GROWTH DIRECTION",
            pageLabel: "02",
          });

          y = 43;
        }

        // Number column

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.subtle);

        pdf.text(
          number,
          margin,
          y + 2,
        );

        // Recommendation content

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10.5);
        pdf.setTextColor(...COLORS.text);

        pdf.text(
          title,
          margin + 15,
          y + 2,
        );

        y += 9;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.muted);

        const descriptionLines =
          pdf.splitTextToSize(
            description,
            contentWidth - 15,
          );

        pdf.text(
          descriptionLines,
          margin + 15,
          y,
        );

        y += descriptionLines.length * 4.8 + 9;

        pdf.setDrawColor(...COLORS.line);

        pdf.line(
          margin,
          y,
          pageWidth - margin,
          y,
        );

        y += 10;
      });

      // =========================================================
      // 30 DAY FOCUS
      // =========================================================

      if (y > pageHeight - 105) {
        addFooter();

        pdf.addPage();

        addHeader({
          label: "RECOMMENDED GROWTH DIRECTION",
          pageLabel: "02",
        });

        y = 43;
      }

      y = addSectionTitle(
        "30-Day Focus",
        y,
        "Suggested operating direction",
      );

      const focus30 = [
        "Address the primary bottleneck before increasing marketing complexity.",
        "Track the metric that directly reflects the bottleneck.",
        "Improve the conversion system before aggressively increasing spend.",
        "Review the diagnosis again after meaningful changes have been implemented.",
      ];

      focus30.forEach((item, index) => {
        pdf.setFillColor(...COLORS.surface);

        pdf.roundedRect(
          margin,
          y,
          contentWidth,
          15,
          2.5,
          2.5,
          "F",
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        pdf.setTextColor(...COLORS.subtle);

        pdf.text(
          String(index + 1).padStart(2, "0"),
          margin + 6,
          y + 9,
        );

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.8);
        pdf.setTextColor(...COLORS.soft);

        const lines = pdf.splitTextToSize(
          item,
          contentWidth - 25,
        );

        pdf.text(
          lines,
          margin + 17,
          y + 8,
        );

        y += 19;
      });

      y += 7;

      // =========================================================
      // WHAT NOT TO DO
      // =========================================================

      y = addSectionTitle(
        "What Not To Do Yet",
        y,
      );

      pdf.setFillColor(...COLORS.surface2);

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        30,
        3,
        3,
        "F",
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.2);
      pdf.setTextColor(...COLORS.muted);

      const warningText =
        "Do not assume that increasing ad spend, adding more channels, or creating more content will automatically solve a structural growth problem. Strengthen the constraint first, then scale.";

      const warningLines =
        pdf.splitTextToSize(
          warningText,
          contentWidth - 16,
        );

      pdf.text(
        warningLines,
        margin + 8,
        y + 10,
      );

      addFooter();

      // =========================================================
      // PAGE 3
      // GROWTH FRAMEWORK
      // =========================================================

      pdf.addPage();

      addHeader({
        label: "GROWTH FRAMEWORK",
        pageLabel: "03",
      });

      y = 43;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(...COLORS.text);

      pdf.text(
        "Build the system before you scale.",
        margin,
        y,
      );

      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(...COLORS.muted);

      const frameworkIntro =
        pdf.splitTextToSize(
          "Growth rarely comes from one isolated tactic. The strongest opportunities usually come from improving the system connecting acquisition, conversion, economics, and measurement.",
          contentWidth,
        );

      pdf.text(
        frameworkIntro,
        margin,
        y,
      );

      y += frameworkIntro.length * 5 + 16;

      // =========================================================
      // FRAMEWORK CARDS
      // =========================================================

      const framework = [
        {
          number: "01",
          title: "Acquisition",
          description:
            "Can the business consistently attract enough of the right people?",
        },
        {
          number: "02",
          title: "Conversion",
          description:
            "Does the journey from interest to customer make sense and remove unnecessary friction?",
        },
        {
          number: "03",
          title: "Economics",
          description:
            "Do price, margin, acquisition cost, and customer value support sustainable growth?",
        },
        {
          number: "04",
          title: "Measurement",
          description:
            "Are you tracking the signals that allow you to make better growth decisions?",
        },
      ];

      framework.forEach((item) => {
        pdf.setFillColor(...COLORS.surface);

        pdf.roundedRect(
          margin,
          y,
          contentWidth,
          31,
          3,
          3,
          "F",
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.subtle);

        pdf.text(
          item.number,
          margin + 8,
          y + 10,
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(...COLORS.text);

        pdf.text(
          item.title,
          margin + 22,
          y + 10,
        );

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.muted);

        const lines = pdf.splitTextToSize(
          item.description,
          contentWidth - 30,
        );

        pdf.text(
          lines,
          margin + 22,
          y + 19,
        );

        y += 37;
      });

      y += 5;

      // =========================================================
      // FINAL INSIGHT
      // =========================================================

      y = addSectionTitle(
        "The Principle",
        y,
      );

      pdf.setFillColor(...COLORS.surface2);

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        43,
        4,
        4,
        "F",
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(...COLORS.text);

      const principleTitle =
        "Fix the constraint. Then scale.";

      pdf.text(
        principleTitle,
        margin + 8,
        y + 13,
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.2);
      pdf.setTextColor(...COLORS.muted);

      const principleText =
        "The purpose of this diagnosis is not to give you more tactics. It is to help you identify where attention is most valuable right now.";

      const principleLines =
        pdf.splitTextToSize(
          principleText,
          contentWidth - 16,
        );

      pdf.text(
        principleLines,
        margin + 8,
        y + 23,
      );

      y += 56;

      // =========================================================
      // CLOSING
      // =========================================================

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(...COLORS.text);

      pdf.text(
        "Prepared by lucratusagency",
        margin,
        y,
      );

      y += 7;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(...COLORS.subtle);

      const closingText =
        "Use this diagnosis as a starting point for deciding what deserves attention next.";

      pdf.text(
        pdf.splitTextToSize(
          closingText,
          contentWidth,
        ),
        margin,
        y,
      );

      y += 16;

      // =========================================================
      // DISCLAIMER
      // =========================================================

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6.5);
      pdf.setTextColor(85, 85, 90);

      const disclaimer =
        "This Growth Diagnosis is an educational assessment based on the information submitted. Recommendations should be evaluated against your actual business economics, operating conditions, and available data.";

      const disclaimerLines =
        pdf.splitTextToSize(
          disclaimer,
          contentWidth,
        );

      pdf.text(
        disclaimerLines,
        margin,
        y,
      );

      addFooter();

      // =========================================================
      // SAVE
      // =========================================================

      const date = new Date()
        .toISOString()
        .slice(0, 10);

      const safeBrandName = brandName
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase();

      pdf.save(
        `lucratus-growth-diagnosis-${safeBrandName}-${date}.pdf`,
      );
    } catch (error) {
      console.error(
        "Growth Diagnosis PDF error:",
        error,
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={downloadPDF}
      disabled={generating || !audit}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {generating
        ? "Preparing Your Playbook..."
        : "Download Your Growth Playbook"}
    </button>
  );
}