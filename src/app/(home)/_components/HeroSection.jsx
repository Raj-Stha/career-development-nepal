import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen top-0 flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner/banner-5.jpg"
          alt="Misty Forest Background"
          fill
          // className="object-cover blur-sm scale-110"
          priority
        />
        {/* Overlay for better text readability */}

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-black/30 to-slate-900/70 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid items-center grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Content Section */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <div className="w-1/2 h-1 bg-white my-4 md:my-8 mx-auto md:mx-0"></div>
            <div className="inline-block bg-primary shadow-2xl rounded-sm py-1 px-4 mb-3 text-xl sm:text-2xl text-white font-bold poppins-text">
              Career Development Nepal
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl  font-bold text-white poppins-text drop-shadow-lg leading-tight">
              Because Every Career Deserves the Right Start.
            </h1>

            <p className="max-w-md italic  text-slate-100 mt-3 text-base sm:text-lg lg:text-xl drop-shadow-md mx-auto md:mx-0">
              Where Thoughts Meets Expectation
            </p>

            <div className="w-1/2 h-1 bg-white my-4 md:my-8 mx-auto md:mx-0"></div>
          </div>

          {/* Image Section */}
          <div className="relative order-1 md:order-2 flex items-end justify-center  h-full min-h-[500px] md:min-h-[800px]">
            <div className="relative w-full max-w-md mx-auto xl:max-w-lg">
              {/* Profile Image Container */}
              <div className="relative group">
                {/* Image */}
                <div className="relative  overflow-hidden ">
                  <img
                    className="h-[380px] md:h-[650px] w-auto object-cover object-bottom "
                    src="/banner/person.png"
                    alt="Rajib Khatry"
                  />
                </div>
              </div>

              {/* Floating accent elements around image */}
              <div className="absolute top-10 -left-4 w-3 h-3 bg-emerald-400/60 rounded-full animate-pulse blur-sm"></div>
              <div className="absolute top-1/3 -right-6 w-2 h-2 bg-teal-400/50 rounded-full animate-pulse delay-700 blur-sm"></div>
              <div className="absolute bottom-20 -left-8 w-4 h-4 bg-cyan-400/40 rounded-full animate-pulse delay-1000 blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-3/4 right-20 w-1 h-1 bg-teal-300 rounded-full animate-ping opacity-40 delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-50 delay-500"></div>
    </section>
  );
}
