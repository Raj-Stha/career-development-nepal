import Image from "next/image";
import Link from "next/link";

export default function CollaborationsSection() {
  const collaborations = [
    {
      id: 1,
      title: "DW TRAVEL",
      year: "2022",
      partner: "Deutsche Welle",
      logo: "/collab/dw-logo.png?height=80&width=200",
      description:
        "DW Travel series - Indian YouTuber Rajib Khatry and his girlfriend Juli will take you on a discovery tour through Germany and other European countries!",
      link: "#",
    },
    {
      id: 2,
      title: "DECODE WITH DHRUV",
      year: "2020",
      partner: "Netflix",
      logo: "/collab/netflix.png?height=80&width=200",
      description:
        "Series of deep dive videos into the pop culture and issues surrounding famous films and tv series",
      link: "#",
    },
    {
      id: 3,
      title: "ELECTION ANALYSIS WITH Rajib Khatry",
      year: "2019",
      partner: "NDTV",
      logo: "/collab/ndtv.png?height=80&width=200",
      description: "Series of videos to cover analysis of 2019 Elections",
      link: "#",
    },
    {
      id: 4,
      title: "BBC RIVER STORIES",
      year: "2019",
      partner: "BBC Hindi",
      logo: "/collab/bbc.png?height=80&width=200",
      description:
        "BBC Hindi series exploring the politics of rivers in India and their impact on communities and governance.",
      link: "#",
    },
    {
      id: 5,
      title: "EDUCATIONAL SERIES",
      year: "2021",
      partner: "DR Academy",
      logo: "/collab/brut.png?height=80&width=200",
      description:
        "Comprehensive educational content covering economics, politics, and current affairs for students and professionals.",
      link: "#",
    },
    {
      id: 6,
      title: "CLIMATE CHANGE DOCUMENTARY",
      year: "2023",
      partner: "Independent",
      logo: "/collab/spotify.png?height=80&width=200",
      description:
        "In-depth documentary series exploring climate change impacts across different regions and communities.",
      link: "#",
    },
  ];

  return (
    <section className="py-16 bg-stone-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4 poppins-text">
            COLLABORATIONS & FEATURED WORK
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto nunito-text">
            Partnerships with leading media organizations and platforms to
            create impactful educational content
          </p>
        </div>

        {/* Collaborations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collaborations.map((collab) => (
            <div
              key={collab.id}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-200"
            >
              {/* Logo/Partner */}
              <div className="mb-6 h-20 flex items-center justify-center bg-stone-100 rounded-lg">
                <Image
                  src={collab.logo || "/placeholder.svg"}
                  alt={`${collab.partner} logo`}
                  width={160}
                  height={60}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 poppins-text">
                    {collab.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-stone-600 mb-3">
                    <span className="font-semibold">{collab.partner}</span>
                    <span>•</span>
                    <span>{collab.year}</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed nunito-text text-sm">
                  {collab.description}
                </p>

                <Link
                  href={collab.link}
                  className="inline-flex items-center text-stone-700 hover:text-stone-900 font-semibold text-sm transition-colors poppins-text"
                >
                  Watch it here
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 poppins-text">
              Interested in Collaboration?
            </h3>
            <p className="text-gray-600 mb-6 nunito-text">
              I'm always open to meaningful partnerships that align with my
              values of education, transparency, and positive social impact.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-lg transition-colors poppins-text"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
