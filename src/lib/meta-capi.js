
import "server-only";
import { createHash } from "node:crypto";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeEmail(value) {
  return (value || "").trim().toLowerCase();
}

export function normalizePhone(value) {
  let phone = (value || "").replace(/\D/g, "");

  // Normalize common Indonesian phone formats to country code 62.
  if (phone.startsWith("0")) {
    phone = `62${phone.slice(1)}`;
  } else if (phone.startsWith("8")) {
    phone = `62${phone}`;
  }

  return phone;
}

export async function sendMetaEvent(input) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const apiVersion = process.env.META_GRAPH_API_VERSION;

  if (!pixelId || !accessToken || !apiVersion) {
    throw new Error("Meta CAPI environment variables are missing.");
  }

  const userData = {};

  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);

  if (email) userData.em = [sha256(email)];
  if (phone) userData.ph = [sha256(phone)];

  if (input.externalId) {
    userData.external_id = [sha256(input.externalId)];
  }

  // fbp and fbc are sent in their original form.
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;

  if (!Object.keys(userData).length) {
    throw new Error("Meta CAPI requires usable user matching data.");
  }

  const event = {
    event_name: input.eventName,
    event_time: input.eventTime || Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    action_source: input.actionSource || "website",
    event_source_url:
      input.eventSourceUrl ||
      `${process.env.NEXT_PUBLIC_SITE_URL}/clinic-audit`,
    user_data: userData,
    ...(input.customData ? { custom_data: input.customData } : {}),
  };

  const body = {
    data: [event],
  };

  if (process.env.META_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Meta CAPI error: ${JSON.stringify(result)}`);
  }

  return result;
}
