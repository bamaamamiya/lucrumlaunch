import "./globals.css";
import Script from "next/script";
import { Poppins, Montserrat } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"], // lebih tebal buat logo
});

export const metadata = {
  title: "Lucratus Agency",
  description: "Facebook & Instagram Ads Agency",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/lucrum.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/lucrum-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Program coaching dropship 1-on-1, bantu kamu pecah telur dalam 7 hari lewat Meta Ads. Termasuk SOP riset produk, winning ads, retargeting, dan pendampingan langsung. Mulai dari Rp400.000 saja."
        />
				<Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yt3l95hrfj");
          `}
        </Script>
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}

export { montserrat };
