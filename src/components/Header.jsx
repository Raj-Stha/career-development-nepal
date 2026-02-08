"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CurrentTime from "@/components/CurrentTime";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Update scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/post?category=vlogs", label: "Vlogs" },
    { href: "/post?category=news", label: "News" },
    { href: "/post?category=content", label: "Content" },
    { href: "/youtube", label: "Youtube" },
    { href: "/#contact", label: "Contact Me" },
  ];

  const isActiveLink = (href) => {
    if (href === "/#contact") return false;

    if (href.includes("category=")) {
      const category = new URL(href, "http://localhost").searchParams.get(
        "category",
      );
      if (typeof window !== "undefined") {
        return (
          pathname.includes("post") &&
          window.location.search.includes(`category=${category}`)
        );
      }
      return false;
    }

    return pathname === href;
  };

  return (
    <header
      className={`poppins-text fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHome
          ? isScrolled
            ? "bg-[#000] backdrop-blur-md shadow-lg border-b border-slate-200/50"
            : "bg-transparent"
          : "bg-[#000] backdrop-blur-md shadow-lg border-b border-slate-200/50"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "" : ""
          }`}
        >
          {/* Left: Name */}
          <Link href="/" className="flex-shrink-0 group">
            <div>
              <img
                src="/rajiv site-02.png"
                alt="Rajib Khatry"
                className="h-24 w-auto"
              />
            </div>
          </Link>

          {/* Right: Desktop Nav + Search + Time */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = isActiveLink(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm lg:text-base font-medium transition-all duration-300 rounded-lg group ${
                      isActive
                        ? "text-white bg-[#003366] shadow-md"
                        : "text-white hover:text-[#003366] hover:bg-slate-50"
                    }, 
                     ${isScrolled ? "py-3" : ""}
                    `}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {!isActive && (
                      <div className="absolute inset-0 bg-[#003366] rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-5"></div>
                    )}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[#003366] hover:bg-slate-50 transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button> */}

            <div className="h-6 w-px bg-slate-300"></div>

            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2 rounded-lg border border-slate-200">
              <CurrentTime />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden hover:bg-slate-100 transition-colors duration-200 ${
                  isScrolled ? "text-white" : "text-white"
                }`}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] bg-white border-l border-slate-200"
            >
              <div className="flex flex-col space-y-8 mt-8">
                <div className="text-center pb-6 border-b border-slate-200">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#003366] to-[#004080] bg-clip-text text-transparent tracking-wide">
                      Rajib Khatry
                    </h2>
                  </Link>
                </div>

                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const isActive = isActiveLink(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-base font-medium py-3 px-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "text-white bg-[#003366] shadow-lg"
                            : "text-slate-700 hover:text-[#003366] hover:bg-slate-50 active:bg-slate-100"
                        }`}
                      >
                        <span className="flex items-center">
                          {item.label}
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </span>
                      </Link>
                    );
                  })}

                  {/* <Button
                    variant="ghost"
                    className="text-slate-700 hover:text-[#003366] hover:bg-slate-50 justify-start px-4 py-3 h-auto rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="h-5 w-5 mr-3" />
                    Search
                  </Button> */}
                </nav>

                <div className="pt-6 border-t border-slate-200">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 rounded-xl border border-slate-200 text-center">
                    <CurrentTime />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
