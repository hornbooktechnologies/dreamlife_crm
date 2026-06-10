import React from "react";
import { convertNumberToWords } from "../../lib/utils/numberToWords";

export const QuotationPdfTemplate = React.forwardRef(({ quotation }, ref) => {
  if (!quotation) return null;

  const {
    quotation_number,
    quotation_date,
    client_name,
    phone,
    email,
    project_name,
    gst_percentage = 0,
    note,
    items = [],
  } = quotation;

  const formattedDate = quotation_date
    ? quotation_date.split("-").reverse().join("/")
    : "";

  const qNumberStr = quotation_number ? `QTN-${String(quotation_number).padStart(3, "0")}` : "---";

  const civilWorkItems = items.filter((item) => item.section === "civil_work");
  const interiorItems = items.filter((item) => item.section === "interior");

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const gstAmount = subtotal * (parseFloat(gst_percentage) / 100);
  const totalAmount = subtotal + gstAmount;

  return (
    <div
      ref={ref}
      className="p-12 bg-white text-black font-sans print:p-8 relative overflow-hidden"
      style={{ width: "210mm", minHeight: "297mm", boxSizing: "border-box" }}
    >
      {/* Background Watermark */}
      <div 
        className="absolute pointer-events-none select-none z-0"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.05,
          width: "350px",
          height: "350px",
          backgroundImage: "url('/assets/icons/Logo-dark.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Top Left Golden Logo */}
          <div className="w-[120px] shrink-0">
            <img
              src="/assets/icons/Logo-dark.png"
              alt="Dreamlife Designs"
              className="w-full h-auto object-contain"
            />
          </div>
          
          <div className="text-right flex-1">
            <h1 className="text-3xl font-bold tracking-wide text-gray-900 mb-1" style={{ fontFamily: "serif" }}>
              DREAMLIFE DESIGNS
            </h1>
            <p className="text-[10px] text-gray-800 font-medium">
              Add:- 608, Rytham Plaza, Nr. Amar Javan Circle, Nikol, Ahmedabad – 382350.
            </p>
            <p className="text-[10px] text-gray-800 font-medium mt-0.5">
              Mobile No:- +91 88661 46297, +91 95370 88829, +91 99096 93298
            </p>
            <p className="text-[10px] text-gray-800 font-medium mt-0.5">
              Email:- <span className="text-blue-600 underline">dreamlifedesigns12@gmail.com</span>
              <span className="mx-2">|</span>
              Website:- www.dreamlifedesigns.com
            </p>
          </div>
        </div>

        <hr className="border-t-2 border-gray-900 mb-6" />

      {/* Info Rows */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-6">
        <div>
          <span className="font-bold">Quotation No:</span> {qNumberStr}
        </div>
        <div className="text-right">
          <span className="font-bold">Quotation Date:</span> {formattedDate}
        </div>
        <div className="col-span-2">
          <span className="font-bold">CLIENT NAME:-</span> {client_name?.toUpperCase()}
        </div>
        <div className="col-span-2">
          <span className="font-bold">Phone:-</span> {phone || "N/A"}
        </div>
        <div className="col-span-2">
          <span className="font-bold">Email:-</span> {email || "N/A"}
        </div>
        <div className="col-span-2">
          <span className="font-bold">PROJECT NAME:-</span> {project_name}
        </div>
      </div>

      {/* Main Table */}
      <table className="w-full border-collapse border border-slate-300 text-sm mb-6">
        <thead>
          <tr className="bg-[#B79352] text-white">
            <th className="border border-slate-300 py-2 px-3 text-left w-12">No.</th>
            <th className="border border-slate-300 py-2 px-3 text-left">Description</th>
            <th className="border border-slate-300 py-2 px-3 text-right w-28">Rate</th>
            <th className="border border-slate-300 py-2 px-3 text-right w-32">Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* Civil Work Section */}
          <tr className="bg-[#FDFBF7] font-bold text-center text-[#B79352]">
            <td colSpan={4} className="border border-slate-300 py-1.5 tracking-wider text-xs">
              CIVIL WORK
            </td>
          </tr>
          {civilWorkItems.map((item, idx) => (
            <tr key={item.id || idx}>
              <td className="border border-slate-300 py-2 px-3 valign-top text-center text-slate-600">{idx + 1}</td>
              <td className="border border-slate-300 py-2 px-3 text-slate-800">
                {item.description}
              </td>
              <td className="border border-slate-300 py-2 px-3 text-right text-slate-700">
                {parseFloat(item.rate) > 0 ? parseFloat(item.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
              </td>
              <td className="border border-slate-300 py-2 px-3 text-right text-slate-900 font-medium">
                {parseFloat(item.amount) > 0 ? parseFloat(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
              </td>
            </tr>
          ))}
          {civilWorkItems.length === 0 && (
            <tr>
              <td className="border border-slate-300 py-2 px-3 text-center">-</td>
              <td className="border border-slate-300 py-2 px-3 text-slate-400 italic">No Civil Work items listed</td>
              <td className="border border-slate-300 py-2 px-3 text-right">-</td>
              <td className="border border-slate-300 py-2 px-3 text-right">-</td>
            </tr>
          )}

          {/* Interior Section */}
          <tr className="bg-[#FDFBF7] font-bold text-center text-[#B79352]">
            <td colSpan={4} className="border border-slate-300 py-1.5 tracking-wider text-xs">
              INTERIOR
            </td>
          </tr>
          {interiorItems.map((item, idx) => (
            <tr key={item.id || idx}>
              <td className="border border-slate-300 py-2 px-3 valign-top text-center text-slate-600">{idx + 1}</td>
              <td className="border border-slate-300 py-2 px-3 text-slate-800">
                {item.description}
              </td>
              <td className="border border-slate-300 py-2 px-3 text-right text-slate-700">
                {parseFloat(item.rate) > 0 ? parseFloat(item.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
              </td>
              <td className="border border-slate-300 py-2 px-3 text-right text-slate-900 font-medium">
                {parseFloat(item.amount) > 0 ? parseFloat(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
              </td>
            </tr>
          ))}
          {interiorItems.length === 0 && (
            <tr>
              <td className="border border-slate-300 py-2 px-3 text-center">-</td>
              <td className="border border-slate-300 py-2 px-3 text-slate-400 italic">No Interior items listed</td>
              <td className="border border-slate-300 py-2 px-3 text-right">-</td>
              <td className="border border-slate-300 py-2 px-3 text-right">-</td>
            </tr>
          )}

          {/* Subtotal, GST, Grand Total */}
          <tr>
            <td colSpan={2} className="border-l border-b border-slate-300"></td>
            <td className="border border-slate-300 py-1.5 px-3 font-bold text-right bg-slate-50 text-slate-700">GST</td>
            <td className="border border-slate-300 py-1.5 px-3 text-right text-slate-800">
              <span className="text-xs text-slate-500 mr-2">({parseFloat(gst_percentage)}%)</span>
              {gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
          </tr>
          <tr className="bg-[#FDFBF7] font-bold">
            <td colSpan={2} className="border-l border-b border-slate-300"></td>
            <td className="border border-slate-300 py-2 px-3 text-right uppercase tracking-wider text-xs text-[#B79352]">Total Amount</td>
            <td className="border border-slate-300 py-2 px-3 text-right text-base text-[#B79352] font-extrabold">
              {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>
          </tr>

          {/* Words */}
          <tr>
            <td colSpan={4} className="border border-slate-300 py-2.5 px-3 text-slate-800">
              <span className="font-bold text-slate-900">Rupees In Words:-</span> {convertNumberToWords(totalAmount)}
            </td>
          </tr>

          {/* Notes */}
          {note && (
            <tr>
              <td colSpan={4} className="border border-slate-300 py-3.5 px-3 bg-slate-50/50">
                <div className="font-bold mb-1 text-slate-900 text-xs">NOTE:-</div>
                <div 
                  className="whitespace-pre-line text-xs leading-relaxed text-slate-700" 
                  dangerouslySetInnerHTML={{
                    __html: note.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Signature Section */}
      <div className="flex justify-between items-end mt-20 text-sm">
        <div className="text-center w-48">
          <div className="border-t border-black pt-2">Client Signature</div>
        </div>
        <div className="text-center w-64">
          <div className="font-bold underline mb-1">Authorized Signature/Directors</div>
          <div className="font-bold text-xs uppercase tracking-wide">DREAMLIFE DESIGNS</div>
        </div>
      </div>

      {/* Thank you note */}
      <div className="text-center mt-12 text-sm italic font-semibold text-gray-700">
        Thank you for the Bussiness!
      </div>
      </div>
    </div>
  );
});

QuotationPdfTemplate.displayName = "QuotationPdfTemplate";
