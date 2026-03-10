import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  getServiceTaxReport,
  payServiceTax,
  updateServiceTax,
  deleteServiceTax,
} from "../../services/serviceTaxService";
import { Loader2, Plus } from "lucide-react";
import PayServiceTax from "./PayServiceTax";
import ReusableDataTable from "../common/data-table/ReusableDataTable";
import useToast from "../../hooks/useToast";

// ─── Inline Status Dropdown Cell ─────────────────────────────────────────────
const StatusDropdownCell = ({ row, filters, onStatusChange }) => {
  const [localStatus, setLocalStatus] = useState(row.status || "Pending");
  const [saving, setSaving] = useState(false);

  // Keep in sync if report refreshes
  useEffect(() => {
    setLocalStatus(row.status || "Pending");
  }, [row.status]);

  const handleChange = async (newStatus) => {
    if (newStatus === localStatus || saving) return;

    setSaving(true);
    try {
      await onStatusChange(row, newStatus);
      setLocalStatus(newStatus);
    } catch (_) {
      // revert handled inside onStatusChange
    } finally {
      setSaving(false);
    }
  };

  if (saving) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        Saving...
      </span>
    );
  }

  return (
    <Select value={localStatus} onValueChange={handleChange}>
      <SelectTrigger
        className={`h-8 w-[110px] text-xs font-semibold border rounded-full px-3 focus:ring-0 focus:ring-offset-0
          ${localStatus?.toLowerCase() === "paid"
            ? "bg-green-50 text-green-700 border-green-300"
            : "bg-red-50 text-red-600 border-red-300"
          }`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pending" className="text-xs focus:bg-red-50 focus:text-red-700">
          Pending
        </SelectItem>
        <SelectItem value="Paid" className="text-xs focus:bg-green-50 focus:text-green-700">
          Paid
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ServiceTaxReport = () => {
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });
  const [filters, setFilters] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const monthNames = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getServiceTaxReport({
        month: filters.month,
        year: filters.year,
        page: pagination.current_page,
        limit: pagination.per_page,
      });

      const isSuccess =
        response.success === true ||
        Array.isArray(response.report) ||
        Array.isArray(response.data) ||
        Array.isArray(response);

      if (isSuccess || response) {
        const data = response.data || response;
        let items = [];
        let meta = {};

        if (Array.isArray(data)) {
          items = data;
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.data)) items = data.data;
          else if (Array.isArray(data.rows)) items = data.rows;
          else if (Array.isArray(data.results)) items = data.results;
          else if (Array.isArray(data.items)) items = data.items;
          else if (Array.isArray(data.report)) items = data.report;
          else if (Array.isArray(data.service_tax_details))
            items = data.service_tax_details;

          if (data.total !== undefined) meta.total = data.total;
          if (data.totalPages !== undefined) meta.totalPages = data.totalPages;
          if (data.page !== undefined) meta.page = data.page;
          if (data.limit !== undefined) meta.limit = data.limit;
        }

        setReportData(items);
        setPagination((prev) => ({
          ...prev,
          total: meta.total || items.length,
          last_page:
            meta.totalPages ||
            (meta.total ? Math.ceil(meta.total / prev.per_page) : 1),
          current_page: meta.page || prev.current_page,
        }));
      } else {
        setReportData([]);
      }
    } catch (error) {
      console.error("Failed to fetch tax report", error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current_page, pagination.per_page]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // ─── Status Change Handler ──────────────────────────────────────────────────
  // row.payment_id → null means no record yet (Pending first time)
  // row.payment_id → UUID means record exists (Paid, use PUT)
  const handleStatusChange = useCallback(
    async (row, newStatus) => {
      try {
        if (newStatus === "Paid") {
          if (!row.payment_id) {
            // ── FIRST TIME: no record → POST to create ──
            const response = await payServiceTax({
              employee_id: row.id,
              month: filters.month,
              year: filters.year,
              amount: row.amount || 200,
            });

            const isSuccess =
              response.success === true ||
              response.payment ||
              response.message?.includes("marked as paid");

            if (isSuccess) {
              showSuccessToast(response.message || "Service tax marked as paid!");
              fetchReport();
            } else {
              showErrorToast(response.message || "Failed to mark as paid.");
              throw new Error("failed");
            }
          } else {
            // ── ALREADY PAID: record exists → PUT to update ──
            const response = await updateServiceTax(row.payment_id, {
              amount: row.amount || 200,
            });

            const isSuccess =
              response.success === true ||
              response.payment ||
              response.message?.includes("updated");

            if (isSuccess) {
              showSuccessToast(response.message || "Service tax payment updated!");
              fetchReport();
            } else {
              showErrorToast(response.message || "Failed to update payment.");
              throw new Error("failed");
            }
          }
        } else if (newStatus === "Pending") {
          // ── REVERT: Paid → Pending (admin mistake correction) → DELETE record ──
          if (!row.payment_id) {
            // Already pending — nothing to do
            return;
          }

          const response = await deleteServiceTax(row.payment_id);

          const isSuccess =
            response.success === true ||
            response.message?.includes("Pending") ||
            response.message?.includes("removed");

          if (isSuccess) {
            showSuccessToast(
              response.message || "Payment reverted. Status set to Pending."
            );
            fetchReport();
          } else {
            showErrorToast(response.message || "Failed to revert payment.");
            throw new Error("failed");
          }
        }
      } catch (err) {
        // Re-throw so the dropdown reverts in StatusDropdownCell
        throw err;
      }
    },
    [filters, fetchReport, showSuccessToast, showErrorToast]
  );

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };

  const handlePerPageChange = (newPerPage) => {
    setPagination((prev) => ({
      ...prev,
      per_page: newPerPage,
      current_page: 1,
    }));
  };

  const columns = useMemo(
    () => [
      {
        field: "first_name",
        headerName: "Employee",
        renderCell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.first_name} {row.last_name}
            </div>
            <div className="text-xs text-slate-500">{row.email}</div>
          </div>
        ),
      },
      {
        field: "month_year",
        headerName: "Month/Year",
        renderCell: () => (
          <span className="text-slate-600">
            {monthNames[filters.month - 1]?.label} {filters.year}
          </span>
        ),
      },
      {
        field: "amount",
        headerName: "Amount",
        renderCell: ({ value }) => (
          <span className="font-semibold text-slate-700">
            {value ? `₹${value}` : "₹200"}
          </span>
        ),
      },
      {
        field: "payment_date",
        headerName: "Paid On",
        renderCell: ({ value }) => (
          <span className="text-slate-600">
            {value ? new Date(value).toLocaleDateString("en-GB") : "—"}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        renderCell: ({ row }) => (
          <StatusDropdownCell
            row={row}
            filters={filters}
            onStatusChange={handleStatusChange}
          />
        ),
      },
    ],
    [filters, handleStatusChange]
  );

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent pb-2">
            Service Tax Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage employee service tax payments and view reports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsPayModalOpen(true)}
            className="h-10 px-4 sm:px-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc]
                      text-white font-semibold gap-2
                      shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                      hover:-translate-y-0.5 transition-all duration-200
                      active:scale-95"
          >
            <Plus className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline">Pay Service Tax</span>
          </Button>
        </div>
      </div>

      <Card
        className="border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 ring-1 ring-black/5"
        style={{
          boxShadow:
            "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        <CardHeader className="flex flex-row items-center justify-end pb-2">
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
            <Select
              value={filters.month.toString()}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  month: parseInt(val),
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-[130px] h-9 border-0 bg-transparent focus:ring-0 text-gray-700 font-medium text-sm focus:bg-gray-50">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {monthNames.map((m) => (
                  <SelectItem
                    key={m.value}
                    value={m.value.toString()}
                    className="focus:bg-blue-50 focus:text-[#3a5f9e]"
                  >
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-px h-6 bg-gray-200"></div>
            <Select
              value={filters.year.toString()}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  year: parseInt(val),
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-[80px] h-9 border-0 bg-transparent focus:ring-0 text-gray-700 font-medium text-sm focus:bg-gray-50">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem
                    key={y}
                    value={y.toString()}
                    className="focus:bg-blue-50 focus:text-[#3a5f9e]"
                  >
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 sm:pt-0 overflow-x-auto">
          <ReusableDataTable
            columns={columns}
            rows={reportData}
            loading={loading}
            checkboxSelection={false}
            pageSize={pagination.per_page}
            pagination={pagination}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
            emptyMessage="No records found for selected period."
          />
        </CardContent>
      </Card>

      {/* Pay Modal (top right button) */}
      <PayServiceTax
        isOpen={isPayModalOpen}
        setIsOpen={setIsPayModalOpen}
        onSuccess={(paidData) => {
          if (paidData?.month && paidData?.year) {
            setFilters({ month: paidData.month, year: paidData.year });
          } else {
            fetchReport();
          }
        }}
      />
    </>
  );
};

export default ServiceTaxReport;

