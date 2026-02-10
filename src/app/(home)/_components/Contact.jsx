"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Consider moving this to app/globals.css for global use

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add a default subject as the frontend form doesn't have a subject field
      const dataToSend = {
        ...formData,
        subject: "Website Contact Form Submission", // Default subject
      };

      const response = await fetch("/api/public/mail/contact", {
        // Updated API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Something went wrong while sending the message.",
        );
      }

      const result = await response.json();
      console.log("Message sent successfully:", result);
      toast.success("Message sent successfully!");
      // Reset form after successful submission
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error.message);
      toast.error(`Failed to send message: ${error.message}`);
    }
  };

  return (
    <section
      className="relative z-10 overflow-hidden bg-white py-20 lg:py-[120px]"
      id="contact"
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap lg:justify-between -mx-4">
          {/* Contact Information */}
          <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
            <div className="mb-12 max-w-[570px] lg:mb-0">
              <span className="mb-4 block text-base font-semibold text-stone-600 poppins-text">
                Contact Me
              </span>
              <h2 className="mb-6 text-[32px] font-bold uppercase text-primary sm:text-[40px] lg:text-[36px] xl:text-[40px] poppins-text">
                GET IN TOUCH WITH ME
              </h2>
              <p className="mb-9 text-base leading-relaxed text-gray-600 nunito-text">
                Have questions about my content, want to collaborate, or need
                clarification on any topic? I'd love to hear from you. Reach out
                through any of the channels below or send me a message.
              </p>
              {/* Contact Info Items */}
              <div className="mb-8 flex w-full max-w-[370px]">
                <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded-lg bg-stone-100 text-stone-600 sm:h-[70px] sm:max-w-[70px]">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="w-full">
                  <h4 className="mb-1 text-xl font-bold text-secondary poppins-text">
                    Location
                  </h4>
                  <p className="text-base text-gray-600 nunito-text">
                    Based in Nepal
                  </p>
                </div>
              </div>
              {/* <div className="mb-8 flex w-full max-w-[370px]">
                <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded-lg bg-stone-100 text-stone-600 sm:h-[70px] sm:max-w-[70px]">
                  <Phone className="w-8 h-8" />
                </div>
                <div className="w-full">
                  <h4 className="mb-1 text-xl font-bold text-secondary poppins-text">
                    Phone
                  </h4>
                  <p className="text-base text-gray-600 nunito-text">
                    <a
                      href="tel:+977985-1033572"
                      className="hover:underline"
                      aria-label="Call us at +977 985-1033572"
                    >
                      +977 985-1033572
                    </a>
                  </p>
                </div>
              </div> */}
              <div className="mb-8 flex w-full max-w-[370px]">
                <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded-lg bg-stone-100 text-stone-600 sm:h-[70px] sm:max-w-[70px]">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="w-full">
                  <h4 className="mb-1 text-xl font-bold text-secondary poppins-text">
                    Business Inquiries
                  </h4>
                  <p className="text-base text-gray-600 nunito-text">
                    <a
                      href="mailto:careerdevelopment@gmail.com"
                      className="hover:underline"
                      aria-label="Email careerdevelopment@gmail.com"
                    >
                      careerdevelopment@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
            <div className="relative rounded-lg bg-white p-8 shadow-lg border border-stone-200 sm:p-12">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 text-base text-gray-700 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200 transition-all nunito-text"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    required
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 text-base text-gray-700 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200 transition-all nunito-text"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your Phone (Optional)"
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 text-base text-gray-700 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200 transition-all nunito-text"
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    rows={6}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message"
                    required
                    className="w-full resize-none rounded-lg border border-stone-300 px-4 py-3 text-base text-gray-700 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200 transition-all nunito-text"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary hover:bg-primary/80 p-3 text-white transition-colors flex items-center justify-center gap-2 poppins-text font-semibold"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </form>
              {/* Decorative Elements */}
              <div className="absolute -right-9 -top-10 z-[-1]">
                <div className="w-20 h-20 bg-stone-200 rounded-full opacity-50"></div>
              </div>
              <div className="absolute -bottom-7 -left-7 z-[-1]">
                <div className="w-16 h-16 bg-stone-300 rounded-full opacity-30"></div>
              </div>
              <div className="absolute top-20 -right-5 z-[-1]">
                <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
              </div>
              <div className="absolute bottom-20 -left-3 z-[-1]">
                <div className="w-2 h-2 bg-stone-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-stone-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-stone-200 rounded-full opacity-15"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-stone-300 rounded-full opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-stone-400 rounded-full opacity-25"></div>
      </div>
    </section>
  );
}
