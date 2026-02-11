import Link from "next/link";
import Image from "next/image";
import {
  Youtube,
  Twitter,
  Instagram,
  Mail,
  Facebook,
  Phone,
  Music2,
} from "lucide-react";

// External and internal links
const LINKS = {
  // facebook: "https://www.facebook.com/share/19bFm9hwn1/?mibextid=wwXIfr",
  youtube: "https://www.youtube.com/@officialcdnepal",
  // twitter: "https://x.com/rajibkhatry?s=21",
  // instagram:
  //   "https://www.instagram.com/khatryrajib/profilecard/?igsh=MTJxbmtkMmUwaTkwMA==",
  tiktok: "https://www.tiktok.com/@career.development?_r=1&_t=ZS-93ni1B3alUb",
  email: "mailto:careerdevelopmentn@gmail.com",
  // phone: "+9779851033572",
  quickLinks: [
    { href: "/youtube", label: "Youtube" },
    { href: "/post?category=vlogs", label: "Vlogs" },
  ],
};

export default function Footer() {
  const shortBio =
    "Career Development Nepal is built to inspire, guide, and empower individuals to take control of their careers. Through practical advice, motivation, and real-world insights, this platform helps turn confusion into clarity and potential into progress—without borders. Believe. Prepare. Succeed.";

  return (
    <footer className="bg-gray-100 text-gray-800 py-12 font-poppins">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          {/* About Me Section */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="relative  w-36  h-24 sm:h-full   ">
              <Image
                src="/logo/cdn-logo.png"
                alt="Rajib Khatry Avatar"
                fill
                sizes="118px"
              />
            </div>
            <h3 className="text-2xl  font-semibold mb-4 poppins-text  sm:text-center text-primary">
              Career Development Nepal
            </h3>
          </div>
          <div className="md:col-span-1">
            <h4 className="text-2xl md:text-3xl font-semibold mb-4 poppins-text text-primary">
              About Me
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed text-justify nunito-text">
              {shortBio}
            </p>
          </div>

          {/* Profile Section (Center) */}

          {/* Contact Section */}
          <div className="md:col-span-1">
            <h4 className="text-2xl md:text-3xl font-semibold mb-4 poppins-text text-primary">
              Contact
            </h4>
            <ul className="space-y-2 text-gray-600 text-sm nunito-text">
              {/* <li className="flex items-center gap-2 ">
                <Phone className="h-4 w-4 text-primary" />
                <span>{LINKS.phone}</span>
              </li> */}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href={LINKS.email}
                  target="_blank"
                  className="hover:underline"
                  rel="noreferrer"
                >
                  {LINKS.email.replace("mailto:", "")}
                </a>
              </li>
              <li>
                <h5 className="text-xl font-semibold my-4 poppins-text text-primary">
                  Social Media
                </h5>
                <div className="flex space-x-3">
                  {/* <a
                    href={LINKS.facebook}
                    target="_blank"
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label="Facebook"
                    rel="noreferrer"
                  >
                    <Facebook className="h-5 w-5" />
                  </a> */}
                  <a
                    href={LINKS.youtube}
                    target="_blank"
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label="Youtube"
                    rel="noreferrer"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                  {/* <a
                    href={LINKS.twitter}
                    target="_blank"
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label="Twitter"
                    rel="noreferrer"
                  >
                    <Twitter className="h-5 w-5" />
                  </a> */}
                  {/* <a
                    href={LINKS.instagram}
                    target="_blank"
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label="Instagram"
                    rel="noreferrer"
                  >
                    <Instagram className="h-5 w-5" />
                  </a> */}

                  <a
                    href={LINKS.tiktok}
                    target="_blank"
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label="TikTok"
                    rel="noreferrer"
                  >
                    <Music2 className="h-5 w-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-2xl md:text-3xl font-semibold mb-4 poppins-text text-primary">
              Quick Links
            </h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              {LINKS.quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-primary transition-colors nunito-text"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 mt-8 pt-8 text-center nunito-text text-xl">
          <p className="text-gray-700 text-sm">
            © 2025 Career Development Nepal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
