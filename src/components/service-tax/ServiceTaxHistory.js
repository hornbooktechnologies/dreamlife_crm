import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getServiceTaxHistory } from "../../services/serviceTaxService";
import { useAuthStore } from "../../context/AuthContext";
import { Loader2, History } from "lucide-react";

const ServiceTaxHistory = ({ className }) => {
  const { user } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      // Robustly resolve employee ID: check explicit employee_id first, then fallback to id if role is employee
      const employeeId =
        user?.employee_id || (user?.role === "employee" ? user?.id : null);

      if (!employeeId) {
        console.warn("Could not resolve employee ID for service tax history");
        setLoading(false);
        return;
      }

      try {
        const response = await getServiceTaxHistory(employeeId);
        setHistory(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Failed to fetch tax history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const monthNames = [
    "",
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

  return (
    <Card className={`border-0 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent">
          <History className="w-6 h-6 text-[#3a5f9e]" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent className='p-2 sm:p-6 sm:pt-0'>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 text-sm">Loading payment history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500 space-y-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <History className="w-12 h-12 text-gray-300" />
            <p className="font-medium">No payment history found</p>
            <p className="text-xs text-gray-400">
              Records will appear here once payments are processed.
            </p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">
                    Period
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Date Paid
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow
                    key={record.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-gray-900">
                          {monthNames[record.tax_month]} - {record.tax_year}
                        </span>

                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-gray-700">
                      ₹
                      {parseFloat(record.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {record.payment_date ? (
                        new Date(record.payment_date).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        {record.status || 'Paid'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceTaxHistory;
