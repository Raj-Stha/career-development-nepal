"use client";

import { InlineShareButtons } from "sharethis-reactjs";

export default function ShareThis({ url }) {
  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 poppins-text">
        Share This Book
      </h3>
      <InlineShareButtons
        config={{
          alignment: "center", // alignment of buttons (left, center, right)
          color: "social", // set the color of buttons (social, white)
          enabled: true, // show/hide buttons (true, false)
          font_size: 16, // font size for the buttons
          labels: "cta", // button labels (cta, counts, null)
          language: "en", // which language to use (see LANGUAGES)
          networks: [
            // which networks to include (see SHARING NETWORKS)
            "facebook",
            "whatsapp",
            "linkedin",
            "messenger",
            "twitter",
            "sharethis",
          ],
          padding: 12, // padding within buttons (INTEGER)
          radius: 4, // the corner radius on each button (INTEGER)
          show_total: true,
          size: 40, // the size of each button (INTEGER)
          url: url,
        }}
      />
    </div>
  );
}
