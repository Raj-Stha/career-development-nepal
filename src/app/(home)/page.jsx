import HeroSection from "./_components/HeroSection";
import AboutSection from "./_components/AboutSection";
import MyWorkSection from "./_components/MyWork";
import ContactSection from "./_components/Contact";
import CollaborationsSection from "./_components/Collabration";
import BlogSlider from "./_components/news-section-slider";
import BlogSlider2 from "./_components/news-section-slider-2";
import TrendingBannerSection from "./_components/Trending-BannerSection";
import YouTubeSection from "./_components/YoutubeSection";

async function safeFetch(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json();
  } catch (error) {
    console.error(error);
    return null; // or return fallback like {} if you want
  }
}

export default async function Home() {
  const [
    latestdata,
    featuredData,
    newsData,
    youtubeData,
    contentData,
    volgsData,
  ] = await Promise.all([
    safeFetch(
      "https://career-development-nepal.vercel.app/api/public/blog?limit=12&sort=latest",
    ),
    safeFetch(
      "https://career-development-nepal.vercel.app/api/public/blog?featured=true&limit=12",
    ),
    safeFetch(
      "https://career-development-nepal.vercel.app/api/public/blog?category=news&limit=10",
    ),
    safeFetch("https://career-development-nepal.vercel.app/api/youtube"),
    safeFetch(
      "https://career-development-nepal.vercel.app/api/public/blog?category=content&limit=10",
    ),
    safeFetch(
      "https://career-development-nepal.vercel.app/api/public/blog?category=vlogs&limit=10",
    ),
  ]);

  return (
    <>
      <HeroSection />
      {/* <AboutSection /> */}
      {/* <MyWorkSection /> */}
      {latestdata?.posts && (
        <BlogSlider2
          blogs={latestdata.posts}
          heading="Latest News"
          sectionId="latest-slider"
        />
      )}
      {featuredData?.posts && (
        <TrendingBannerSection blogs={featuredData.posts} />
      )}

      {youtubeData && <YouTubeSection video={youtubeData} />}

      {/* Optional: Only render sliders if data exists */}
      {/* {newsData?.posts && (
        <BlogSlider
          blogs={newsData.posts}
          heading="News"
          sectionId="news-slider"
          className="bg-gray-50 "
        />
      )}
      {contentData?.posts && (
        <BlogSlider
          blogs={contentData.posts}
          heading="Content"
          sectionId="content-slider"
        />
      )}
      {volgsData?.posts && (
        <BlogSlider
          blogs={volgsData.posts}
          heading="Vlogs"
          sectionId="vlogs-slider"
          className="bg-gray-50 "
        />
      )} */}

      {/* <CollaborationsSection /> */}
      <ContactSection />
    </>
  );
}
