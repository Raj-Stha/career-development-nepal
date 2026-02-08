"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function HomeLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <Header />
      <div className={isHome ? "" : "pt-12 md:pt-20"}>
        {children}
        <Footer />
      </div>
    </>
  );
}
