import React, { forwardRef } from "react";
import { DOCUMENT_WATERMARK_LOGO } from "./documentBranding";

const ReleaseLetterTemplate = forwardRef(({ data }, ref) => {
  // Current date formatted if not provided
  const date = data?.date
    ? new Date(data.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <div
      ref={ref}
      className="bg-white p-12 max-w-[800px] mx-auto text-black font-serif leading-relaxed relative min-h-[1000px]"
    >
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <img
          src={DOCUMENT_WATERMARK_LOGO}
          alt="Watermark"
          style={{ opacity: 0.1 }}
          className="w-[500px]"
        />
      </div>

      <div className="relative z-10">
        {/* Date */}
        <div className="mb-8 text-right font-semibold">Date: {date}</div>

        {/* Title */}
        <div className="mb-8 text-center pt-8">
          <h2 className="text-2xl font-bold underline decoration-2 underline-offset-4">
            RELIEVING LETTER
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-6 text-justify">
          <p>
            This is to certify that{" "}
            <strong>{data?.name || "[Employee Name]"}</strong> was employed with{" "}
            <strong>Dreamlife Designs</strong> as a{" "}
            <strong>{data?.designation || "[Designation]"}</strong> from{" "}
            <strong>{data?.joiningDate || "[Joining Date]"}</strong> to{" "}
            <strong>{data?.relievingDate || "[Relieving Date]"}</strong>.
          </p>

          <p>
            We would like to inform you that his/her resignation has been
            accepted and he/she has been relieved from his/her duties with
            effect from the closing hours of{" "}
            <strong>{data?.relievingDate || "today"}</strong>.
          </p>

          <p>
            During their tenure with us, we found them to be sincere,
            hardworking, and professional. We appreciate their contributions to
            the organization.
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

ReleaseLetterTemplate.displayName = "ReleaseLetterTemplate";

export default ReleaseLetterTemplate;
