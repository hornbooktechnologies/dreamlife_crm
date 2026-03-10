import React, { forwardRef } from "react";
import { DOCUMENT_WATERMARK_LOGO } from "./documentBranding";

const ExperienceLetterTemplate = forwardRef(({ data }, ref) => {
  // Current date formatted
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      ref={ref}
      className="bg-white p-12 pt-40 max-w-[800px] mx-auto text-black font-serif leading-relaxed relative min-h-[1000px]"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <img
          src={DOCUMENT_WATERMARK_LOGO}
          alt="Watermark"
          style={{ opacity: 0.1 }}
          className="w-[500px]"
        />
      </div>


      <div className="relative z-10">
        {/* Header/Letterhead Placeholder */}
        {/* <div className="mb-12 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-center uppercase tracking-widest text-[#1a365d]">
            Hornbook Technologies
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Excellence in Technology Solutions
          </p>
        </div> */}

        {/* Date */}
        <div className="mb-8 text-right font-semibold">Date: {today}</div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold underline decoration-2 underline-offset-4">
            TO WHOM IT MAY CONCERN
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-6 text-justify">
          <p>
            This is to certify that{" "}
            <strong>{data?.name || "[Employee Name]"}</strong> was employed with
            <strong> Dreamlife Designs</strong> as a{" "}
            <strong>{data?.designation || "[Designation]"}</strong>.
          </p>

          <p>
            Their tenure of employment was from{" "}
            <strong>{data?.joiningDate || "[Joining Date]"}</strong> to{" "}
            <strong>{data?.relievingDate || today}</strong>.
          </p>

          <p>
            During their tenure with us, we found them to be sincere,
            hardworking, and dedicated to their duties. They carried out their
            responsibilities with professionalism and commitment.
          </p>

          <p>We wish them all the best in their future endeavors.</p>
        </div>

        {/* Footer */}
        <div className="mt-20">
          <p className="font-bold">For Dreamlife Designs,</p>
          <div className="h-16 mt-4 mb-2">{/* Signature Placeholder */}</div>
          <p className="font-semibold">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
});

ExperienceLetterTemplate.displayName = "ExperienceLetterTemplate";

export default ExperienceLetterTemplate;
