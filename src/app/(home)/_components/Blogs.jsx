"use client";
import { useRef } from "react";
import SectionHeading from "./SectionHeading";
import BlogCard from "./BlogCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Custom Next Arrow
function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-primary hover:bg-primary/80 text-white p-2 rounded-full shadow-lg"
      aria-label="Next"
    >
      <ChevronRight size={24} />
    </button>
  );
}

// Custom Prev Arrow
function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary cursor-pointer hover:bg-primary/80 text-white p-2 rounded-full shadow-lg"
      aria-label="Previous"
    >
      <ChevronLeft size={24} />
    </button>
  );
}

export default function BlogSection({
  title = "Latest Blog Posts",
  subtitle = "",
  center = false,
  className = "",
  subtitleClassName = "",
  blogs,
}) {
  const sliderRef = useRef(null);

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-8 lg:py-12 section-padding bg-muted relative">
      <div className="container max-w-7xl mx-auto container-padding">
        <SectionHeading
          title={title}
          subtitle={subtitle}
          className={className}
          subtitleClassName={subtitleClassName}
          center={center}
        />

        <div className="events-slider relative">
          {blogs.length > 1 ? (
            <Slider ref={sliderRef} {...sliderSettings}>
              {blogs.map((blog) => (
                <div key={blog.id} className="px-4 min-w-0">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </Slider>
          ) : blogs.length === 1 ? (
            <div className="px-4 max-w-md">
              <BlogCard blog={blogs[0]} />
            </div>
          ) : (
            <p className="text-muted-foreground">No blog posts found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
