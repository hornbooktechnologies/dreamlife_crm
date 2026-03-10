import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { getServiceTaxStatus } from "../../services/serviceTaxService";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const ServiceTaxStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getServiceTaxStatus(currentMonth, currentYear);
        console.log(response, "responsedwqfwef");
        setStatus(response); // Expecting { isPaid: true/false, ... }
      } catch (error) {
        console.error("Failed to fetch service tax status", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [currentMonth, currentYear]);

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Checking tax status...</span>
        </CardContent>
      </Card>
    );
  }

  const isPaid = status?.isPaid || status?.status === "Paid" || false;
  // Adjust based on actual API response structure.
  // If exact response unknown, assuming 'isPaid' boolean or 'status' string.

  return (
    <Card className="border-0 shadow-lg overflow-hidden relative">
      <div
        className={`absolute inset-0 opacity-10 ${isPaid ? "bg-green-500" : "bg-red-500"}`}
      />
      <CardContent className="p-6 relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent">
            {monthNames[currentMonth - 1]} {currentYear}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monthly deduction:{" "}
            <span className="font-medium text-gray-700">₹200</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPaid ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-100 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">PAID</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600 bg-red-100 px-4 py-2 rounded-full">
              <XCircle className="w-5 h-5" />
              <span className="font-bold">PENDING</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceTaxStatus;
