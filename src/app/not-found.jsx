import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function NotFound() {
  return (
    <>
      <Header />
      <div className="hidden lg:block absolute top-0 left-0 right-0 h-28 backdrop-blur-md bg-black/80 z-10 opacity-80" />

      <div className="flex flex-col items-center justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <Image
          src="/not-found.jpg"
          alt="404 - Page Not Found"
          width={404}
          height={404}
          className="mb-6"
        />
      </div>
      <Footer />
    </>
  );
}
