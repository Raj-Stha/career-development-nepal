import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Video, Globe } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-16 bg-white" id="about">
      <div className="mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="mx-auto text-center max-w-xl mb-12">
          <h1 className="relative font-semibold max-w-max mx-auto pb-2 poppins-text text-3xl sm:text-4xl md:text-5xl text-gray-800 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-lg after:bg-gray-800 after:w-4">
            About Me
          </h1>
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-14 gap-y-8 md:items-end">
          {/* Content Section */}
          <div className="space-y-4 md:space-y-6 md:col-span-2 lg:col-span-1 w-full max-w-3xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="poppins-text font-semibold text-2xl md:text-3xl text-gray-900">
              Content Creator & Educator based in Germany
            </h1>

            <div className="text-gray-700 space-y-3 mx-auto max-w-2xl lg:max-w-none nunito-text">
              <p>
                I love making videos and creating informative educational
                content that provides objective, concise explanations of complex
                issues across various subjects.
              </p>
              <p>
                My mission is to promote progressive values of democracy,
                freedom, rationalism, and critical thinking through accessible
                content for millions of viewers worldwide.
              </p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <Link
                href="/youtube"
                className="px-6 h-11 flex items-center  bg-red-600 hover:bg-red-700 text-white text-sm transition ease-linear poppins-text"
              >
                Watch Videos
              </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 w-full gap-4">
              <div className="text-center lg:text-left">
                <h2 className="text-xl md:text-2xl poppins-text font-semibold text-gray-800">
                  10M+
                </h2>
                <span className="text-gray-600 text-sm nunito-text">
                  Subscribers
                </span>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-xl md:text-2xl poppins-text font-semibold text-gray-800">
                  500+
                </h2>
                <span className="text-gray-600 text-sm nunito-text">
                  Videos
                </span>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-xl md:text-2xl poppins-text font-semibold text-gray-800">
                  1B+
                </h2>
                <span className="text-gray-600 text-sm nunito-text">Views</span>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex justify-center">
            <div className="max-w-full relative">
              <span className="absolute inset-x-0 top-16 bottom-0 rounded-lg scale-[1.04] bg-gradient-to-b from-stone-200 to-stone-300" />
              <span className="absolute inset-x-0 bottom-0 top-16 rounded-lg bg-stone-100" />
              <img
                src="/rajib_profile.png"
                alt="Rajib Khatry - Content Creator"
                className="relative w-full h-auto max-h-96 lg:max-h-[56rem] rounded-lg"
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-3 lg:space-y-6">
            <div className="flex items-start gap-x-2 p-2 md:p-3 lg:p-4 bg-stone-50 border border-stone-100/80 rounded-lg hover:shadow-md transition-shadow">
              <span className="min-w-max text-stone-600 p-2 md:p-3 rounded-lg bg-stone-200 border border-stone-100/70">
                <Video className="w-6 h-6" />
              </span>
              <div>
                <span className="font-semibold text-gray-800 text-lg poppins-text">
                  Educational Content
                </span>
                <p className="text-gray-700 nunito-text">
                  Creating informative videos that simplify complex political
                  and social issues for everyone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-x-2 p-2 md:p-3 lg:p-4 bg-stone-50 border border-stone-100/80 rounded-lg hover:shadow-md transition-shadow">
              <span className="min-w-max text-stone-600 p-2 md:p-3 rounded-lg bg-stone-200 border border-stone-100/70">
                <GraduationCap className="w-6 h-6" />
              </span>
              <div>
                <span className="font-semibold text-gray-800 text-lg poppins-text">
                  Academic Background
                </span>
                <p className="text-gray-700 nunito-text">
                  Masters in Renewable Energy Engineering, Bachelor's in
                  Economics and Political Science.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-x-2 p-2 md:p-3 lg:p-4 bg-stone-50 border border-stone-100/80 rounded-lg hover:shadow-md transition-shadow">
              <span className="min-w-max text-stone-600 p-2 md:p-3 rounded-lg bg-stone-200 border border-stone-100/70">
                <Globe className="w-6 h-6" />
              </span>
              <div>
                <span className="font-semibold text-gray-800 text-lg poppins-text">
                  Global Perspective
                </span>
                <p className="text-gray-700 nunito-text">
                  Passionate traveler bringing diverse perspectives and critical
                  thinking to every topic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
