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
  title: process.env.NEXT_PUBLIC_WEBSITE_NAME || "Career Development Nepal",
  description:
    "Career Development Nepal inspires and empowers individuals to take control of their careers through practical guidance, motivation, and real-world insights. Turn confusion into clarity and potential into progress—without borders.",

  keywords:
    process.env.NEXT_PUBLIC_WEBSITE_META_KEYWORDS_POSTS ||
    "career development Nepal, career guidance, job preparation, skill development, motivation, education Nepal",

  openGraph: {
    title: process.env.NEXT_PUBLIC_WEBSITE_NAME || "Career Development Nepal",
    description:
      "Career Development Nepal is a platform dedicated to inspiring, guiding, and empowering individuals to build meaningful careers through clarity, preparation, and progress—without borders.",
    images: [
      {
        url:
          process.env.NEXT_PUBLIC_WEBSITE_META_OG_IMAGE || "/logo/cdn-logo.png",
        width: 1200,
        height: 630,
        alt: "Career Development Nepal – Career Guidance & Growth",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_WEBSITE_NAME || "Career Development Nepal",
    description:
      "Practical career guidance, motivation, and real-world insights to help you believe, prepare, and succeed—no matter where you are.",
    images: [
      process.env.NEXT_PUBLIC_WEBSITE_META_OG_IMAGE || "/logo/cdn-logo.png",
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
