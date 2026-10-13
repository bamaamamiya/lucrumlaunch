
"use client";

import Script from "next/script";

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function trackMetaEvent(eventName, eventId, params = {}) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    console.warn(`Meta Pixel belum siap: ${eventName}`);
    return false;
  }

  const standardEvents = [
    "PageView",
    "Lead",
    "Schedule",
    "Purchase",
    "CompleteRegistration",
  ];

  const options = eventId ? { eventID: eventId } : undefined;

  if (standardEvents.includes(eventName)) {
    window.fbq("track", eventName, params, options);
  } else {
    window.fbq("trackCustom", eventName, params, options);
  }

  return true;
}

export default function MetaPixel() {
  if (!pixelId) {
    console.warn("Meta Pixel ID belum dikonfigurasi.");
    return null;
  }

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s){
            if(f.fbq)return;
            n=f.fbq=function(){
              n.callMethod ?
                n.callMethod.apply(n,arguments) :
                n.queue.push(arguments)
            };
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=true;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=true;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          }(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '${pixelId.replace(/[^0-9]/g, "")}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}
