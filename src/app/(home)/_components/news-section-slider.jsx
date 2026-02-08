"use client";

import React from "react";
import Slider from "react-slick";
import BlogCard from "./BlogCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Custom arrow components
const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-primary rounded-full p-2 shadow-md hover:bg-primary hover:text-white text-white transition opacity-100 md:group-hover:opacity-100"
    onClick={onClick}
  >
    <ChevronRight size={16} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-primary rounded-full p-2 shadow-md hover:bg-primary hover:text-white transition opacity-100 md:group-hover:opacity-100"
    onClick={onClick}
  >
    <ChevronLeft size={16} />
  </div>
);

const BlogSlider = ({
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
          <h2 className="font-semibold max-w-max mx-auto mb-6 poppins-text text-3xl sm:text-4xl md:text-5xl text-gray-800 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-lg after:bg-gray-800 after:w-4">
            {heading}
          </h2>
        )}

        <>
          {/* Desktop */}
          <div className="hidden lg:block">
            {showSliderOnDesktop ? (
              <div className="relative group">
                <Slider {...settings} className={`slider-${sectionId}`}>
                  {blogs.map((blog, index) => (
                    <div key={index} className="px-2">
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.map((blog, index) => (
                  <div key={index}>
                    <BlogCard blog={blog} />
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
                  <BlogCard blog={blog} />
                </div>
              ))}
            </Slider>
          </div>
        </>
      </div>
    </section>
  );
};

export default BlogSlider;