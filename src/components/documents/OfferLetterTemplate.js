import React, { forwardRef } from "react";
import logo from "../../../src/assets/icons/logo.svg";

const OfferLetterTemplate = forwardRef(({ data }, ref) => {
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
          src={logo}
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
            OFFER LETTER
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-6 text-justify">
          <p>
            <strong>Dear {data?.name || "[Candidate Name]"},</strong>
          </p>

          <p>
            We are pleased to offer you the position of{" "}
            <strong>{data?.designation || "[Designation]"}</strong> at{" "}
            <strong>Hornbook Technologies</strong>. We were impressed with your
            skills and experience and believe that you will be a valuable asset
            to our team.
          </p>

          <p>
            <strong>Compensation:</strong> Your total annual compensation will
            be <strong>{data?.salary || "[Salary Amount]"}</strong> per annum.
          </p>

          <p>
            <strong>Joining Date:</strong> You are requested to join us on or
            before <strong>{data?.joiningDate || "[Joining Date]"}</strong>.
          </p>

          <p>
            <strong>Probation Period:</strong> You will be on a probation period
            of <strong>{data?.probationPeriod || "6"} months</strong> from the
            date of joining.
          </p>

          <p>
            We look forward to welcoming you aboard and working together to
            achieve our goals.
          </p>

          <p>
            Please sign the duplicate copy of this letter as a token of your
            acceptance of the offer and return it to us on the date of your
            joining.
          </p>

          <p>Welcome to the team!</p>
        </div>

        {/* Footer */}
        <div className="mt-20">
          <p className="font-bold">For Hornbook Technologies,</p>
          <div className="h-16 mt-4 mb-2">{/* Signature Placeholder */}</div>
          <p className="font-semibold">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
});

OfferLetterTemplate.displayName = "OfferLetterTemplate";

export default OfferLetterTemplate;
