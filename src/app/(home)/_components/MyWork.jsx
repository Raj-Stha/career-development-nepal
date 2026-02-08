import Image from "next/image";
import Link from "next/link";

const WORK_DATA = [
  {
    title: "YOUTUBE (MAIN)",
    image: "/dhruv-cover.jpg?height=400&width=350",
    alt: "Rajib Khatry Main Channel",
    subscribers: "~26.8 M",
    since: "2016",
    genre: "Current affairs, Education",
    href: "/youtube-main",
    gradient: "bg-gradient-to-br from-red-500 to-red-600",
  },
  {
    title: "YOUTUBE (VLOGS)",
    image: "/dr-vlogs.jpg?height=400&width=350",
    alt: "Rajib Khatry Vlogs",
    subscribers: "~3.2 M",
    since: "2020",
    genre: "Travel, Vlogging",
    href: "/youtube-vlogs",
    gradient: "bg-gradient-to-br from-green-400 to-blue-500",
  },
  {
    title: "SPOTIFY PODCAST",
    image: "/dr-spotify.jpg?height=400&width=350",
    alt: "Maha Bharat Podcast",
    href: "/podcast",
    gradient: "bg-gradient-to-br from-green-500 to-green-600",
    isPodcast: true,
    description:
      "Spotify Studios presents Maha Bharat with Rajib Khatry, a podcast that delves deep into how things in India actually work.",
  },
];

export default function MyWorkSection() {
  return (
    <section className="py-16 bg-stone-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-700 mb-4 poppins-text tracking-wide">
            MY WORK
          </h2>
        </div>

        {/* Work Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {WORK_DATA.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center poppins-text">
                  {item.title}
                </h3>

                <div
                  className={`aspect-video mb-6 rounded-lg overflow-hidden ${item.gradient} relative`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={400}
                    height={500}
                    className="w-full h-full object-cover"
                  />

                  {/* Podcast specific overlay */}
                  {item.isPodcast && (
                    <>
                      {/* Spotify Logo */}
                      <div className="absolute top-4 left-4 bg-green-500 rounded-full p-2">
                        <svg
                          className="w-6 h-6 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                      </div>
                      {/* Text Overlay */}
                      <div className="absolute bottom-4 right-4 text-white">
                        <div className="text-2xl font-bold">MAHA</div>
                        <div className="text-lg">BHARAT</div>
                        <div className="text-xs opacity-80">
                          WITH Rajib Khatry
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-6 nunito-text text-gray-700 space-y-2">
                  {item.isPodcast ? (
                    <p>{item.description}</p>
                  ) : (
                    <>
                      <p>
                        <span className="font-semibold">Subscribers:</span>{" "}
                        {item.subscribers}
                      </p>
                      <p>
                        <span className="font-semibold">Active since:</span>{" "}
                        {item.since}
                      </p>
                      <p>
                        <span className="font-semibold">Genre:</span>{" "}
                        {item.genre}
                      </p>
                    </>
                  )}
                </div>

                <Link
                  href={item.href}
                  className="block w-full text-center py-3 px-6 border-2 border-stone-600 text-stone-600 font-semibold hover:bg-stone-600 hover:text-white transition-colors poppins-text"
                >
                  FIND OUT MORE
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
