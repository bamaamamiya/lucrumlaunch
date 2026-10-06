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
  title: "Lucratus Agency | Digital Marketing & Meta Ads Agency",
  description:
    "Lucratus Agency membantu bisnis mendapatkan lebih banyak leads, customers, dan revenue melalui strategi digital marketing dan Meta Ads.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/lucrum.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/lucrum-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Lucratus Agency membantu bisnis mendapatkan lebih banyak leads, customers, dan revenue melalui strategi digital marketing dan Meta Ads."
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
