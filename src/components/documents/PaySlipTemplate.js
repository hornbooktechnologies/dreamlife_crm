import React, { forwardRef } from "react";
import { DOCUMENT_WATERMARK_LOGO } from "./documentBranding";

const PaySlipTemplate = forwardRef(({ data }, ref) => {

  console.log("dat454a", data);
  // Current date formatted
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalEarnings = Object.values(data?.earnings || {}).reduce(
    (a, b) => Number(a) + Number(b),
    0
  );
  const totalDeductions = Object.values(data?.deductions || {}).reduce(
    (a, b) => Number(a) + Number(b),
    0
  );
  const netSalary = totalEarnings - totalDeductions;

  // Helper function to format labels
  const formatLabel = (key) => {
    const formatted = key.replace(/([A-Z])/g, " $1").trim();
    // Convert HRA and PF to uppercase
    if (formatted.toLowerCase() === 'hra' || formatted.toLowerCase() === 'h r a') {
      return 'HRA';
    }
    if (formatted.toLowerCase() === 'pf' || formatted.toLowerCase() === 'p f') {
      return 'PF';
    }
    return formatted;
  };

  return (
    <div
      ref={ref}
      className="bg-white p-8 max-w-[800px] mx-auto text-black font-sans leading-relaxed relative min-h-[1000px]"
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
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-[#1a365d]">
            Dreamlife Designs
          </h1>
          {/* <p className="text-sm font-medium text-gray-600">
            Excellence in Technology Solutions
          </p> */}
          <h2 className="text-xl font-bold mt-4 underline">PAY SLIP</h2>
          {/* <p className="text-sm mt-1">
            For the month of{" "}
            <strong>
              {data?.month} {data?.year}
            </strong>
          </p> */}
        </div>

        {/* Employee Details */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold w-1/4">
                  Employee Name
                </td>
                <td className="border border-gray-300 p-2 w-1/4">
                  {data?.name}
                </td>
                <td className="border border-gray-300 p-2 font-semibold w-1/4">
                  Designation
                </td>
                <td className="border border-gray-300 p-2 w-1/4">
                  {data?.designation}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Employee ID
                </td>
                <td className="border border-gray-300 p-2">
                  {data?.employee_tag_id || "N/A"}
                </td>
                <td className="border border-gray-300 p-2 font-semibold">
                  Month
                </td>
                <td className="border border-gray-300 p-2">
                  {data?.month} {data?.year}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Salary Details */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left w-1/2">
                  Earnings
                </th>
                <th className="border border-gray-300 p-2 text-right w-1/2">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data?.earnings || {}).map(([key, value]) => (
                <tr key={key}>
                  <td className="border border-gray-300 p-2 capitalize">
                    {formatLabel(key)}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {Number(value).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border border-gray-300 p-2">Total Earnings</td>
                <td className="border border-gray-300 p-2 text-right">
                  {totalEarnings.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left w-1/2">
                  Deductions
                </th>
                <th className="border border-gray-300 p-2 text-right w-1/2">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data?.deductions || {}).map(([key, value]) => (
                <tr key={key}>
                  <td className="border border-gray-300 p-2 capitalize">
                    {formatLabel(key)}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {Number(value).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border border-gray-300 p-2">Total Deductions</td>
                <td className="border border-gray-300 p-2 text-right">
                  {totalDeductions.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Net Pay */}
        <div className="mb-12 border border-gray-800 p-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Net Salary Payable:</span>
            <span>₹ {netSalary.toFixed(2)}</span>
          </div>
        </div>

        {/* Signatures */}
        {/* <div className="flex justify-between mt-20 pt-8">
          <div className="text-center">
            <div className="h-10 border-b border-gray-400 w-48 mb-2"></div>
            <p className="font-semibold text-sm">Employee Signature</p>
          </div>
          <div className="text-center">
            <div className="h-10 border-b border-gray-400 w-48 mb-2"></div>
            <p className="font-semibold text-sm">Director Signature</p>
          </div>
        </div> */}
        <div className="text-center text-xs text-gray-400 mt-8">
          This is a computer-generated document not requiring a signature.
        </div>
      </div>
    </div>
  );
});

// Helper for number to words (Simplified)
function convertNumberToWords(amount) {
  // Basic placeholder. For production, use a library or full function.
  return "Rupees ...";
}

PaySlipTemplate.displayName = "PaySlipTemplate";

export default PaySlipTemplate;
