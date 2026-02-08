"use client";

import React from "react";
import Slider from "react-slick";
import BlogCard2 from "./BlogCard2";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Custom arrow components
const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-primary rounded-full p-2 shadow-md hover:bg-primary hover:text-white text-white transition opacity-100 md:opacity-0 md:group-hover:opacity-100"
    onClick={onClick}
  >
    <ChevronRight size={16} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-primary rounded-full p-2 shadow-md hover:bg-primary hover:text-white transition opacity-100 md:opacity-0 md:group-hover:opacity-100"
    onClick={onClick}
  >
    <ChevronLeft size={16} />
  </div>
);

const BlogSlider2 = ({
  heading,
  blogs = [],
  sectionId = "blog-slider",
  className = "", // ✅ Accept optional className prop
}) => {
  if (!blogs || blogs.length === 0) return null;

  const showSliderOnDesktop = blogs.length > 3;

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(blogs.length, 2),
          arrows: blogs.length > 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: blogs.length > 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: blogs.length > 1,
        },
      },
    ],
  };

  return (
    <section id={sectionId} className={`py-8 ${className}`}>
      <div className="container max-w-7xl px-4 mx-auto py-4 md:py-8">
        {heading && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="poppins-text text-3xl sm:text-4xl md:text-5xl font-semibold text-primary">
                {heading}
              </h2>
              <div className="w-30 h-[3px] bg-secondary rounded-full mt-2"></div>
            </div>

            <Link
              href="/blogs"
              className="text-sm sm:text-base text-white px-4 py-2 bg-secondary hover:bg-secondary/80 font-medium  poppins-text"
            >
              View All
            </Link>
          </div>
        )}

        <>
          {/* Desktop */}
          <div className="hidden lg:block">
            {showSliderOnDesktop ? (
              <div className="relative group">
                <Slider {...settings} className={`slider-${sectionId}`}>
                  {blogs.map((blog, index) => (
                    <div key={index} className="px-2">
                      <BlogCard2 blog={blog} />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.map((blog, index) => (
                  <div key={index}>
                    <BlogCard2 blog={blog} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile/Tablet */}
          <div className="block lg:hidden group relative">
            <Slider {...settings} className={`slider-${sectionId}`}>
              {blogs.map((blog, index) => (
                <div key={index} className="px-2">
                  <BlogCard2 blog={blog} />
                </div>
              ))}
            </Slider>
          </div>
        </>
      </div>
    </section>
  );
};

export default BlogSlider2;
