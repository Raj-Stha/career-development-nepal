import type { Metadata } from "next";
import { Poppins, Solway, Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./(home)/_components/Providers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const solway = Solway({
  variable: "--font-solway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_WEBSITE_NAME || "Rajib Khatry",
  description:
    "Explore videos, insights, and educational content by Rajib Khatry on politics, science, fact-checking, and global issues.",
  keywords:
    process.env.NEXT_PUBLIC_WEBSITE_META_KEYWORDS_POSTS ||
    "Rajib Khatry, politics, analysis, science, fact check, Indian news, environment",
  openGraph: {
    title: process.env.NEXT_PUBLIC_WEBSITE_NAME || "Rajib Khatry",
    description:
      "Official platform of Rajib Khatry – Educator, Political Analyst & Content Creator. Explore thought-provoking content on science, democracy, and rationalism.",
    images: [
      {
        url:
          process.env.NEXT_PUBLIC_WEBSITE_META_OG_IMAGE ||
          "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rajib Khatry - Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_WEBSITE_NAME || "Rajib Khatry",
    description:
      "Content that inspires critical thinking, rationalism, and democratic values. Follow Rajib Khatry for high-quality educational insights.",
    images: [
      process.env.NEXT_PUBLIC_WEBSITE_META_OG_IMAGE ||
        "https://yourdomain.com/og-image.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${poppins.variable}  ${solway.variable}   ${nunito.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
