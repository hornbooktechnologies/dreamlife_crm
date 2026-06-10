import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ReusableDataTable from "../components/common/data-table/ReusableDataTable";
import { requestHandler } from "../lib/utils/network-client";
import useToast from "../hooks/useToast";
import { FileText, Plus, Printer, Edit, Trash2, Search } from "lucide-react";
import { QuotationPdfTemplate } from "../components/quotation/QuotationPdfTemplate";

export default function QuotationPage() {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [activePrintQuotation, setActivePrintQuotation] = useState(null);
  
  const printRef = useRef(null);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const res = await requestHandler("/quotations", {
        method: "GET",
        params: {
          page,
          limit,
          search,
        },
      });

      if (res.success) {
        setQuotations(res.quotations || []);
        setTotal(res.total || 0);
      } else {
        showErrorToast(res.message || "Failed to load quotations");
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
      showErrorToast("Error loading quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [page, limit, search]);

  const handlePrintTrigger = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Quotation_${activePrintQuotation?.client_name || "Client"}`,
  });

  const handlePrint = async (id) => {
    try {
      const res = await requestHandler(`/quotations/${id}`);
      if (res.success && res.data) {
        setActivePrintQuotation(res.data);
        // Wait a small moment to ensure react-to-print references the updated DOM template
        setTimeout(() => {
          handlePrintTrigger();
        }, 300);
      } else {
        showErrorToast("Failed to fetch quotation details for printing");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error loading quotation for printing");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      try {
        const res = await requestHandler(`/quotations/${id}`, {
          method: "DELETE",
        });
        if (res.success) {
          showSuccessToast("Quotation deleted successfully");
          fetchQuotations();
        } else {
          showErrorToast(res.message || "Failed to delete quotation");
        }
      } catch (error) {
        console.error(error);
        showErrorToast("Error deleting quotation");
      }
    }
  };

  const columns = [
    {
      field: "quotation_number",
      headerName: "Quotation No",
      renderCell: ({ row }) => {
        const num = row.quotation_number;
        return <span className="font-bold text-slate-800">QTN-{String(num).padStart(3, "0")}</span>;
      },
    },
    {
      field: "client_name",
      headerName: "Client Name",
      renderCell: ({ row }) => <span className="font-semibold">{row.client_name}</span>,
    },
    {
      field: "project_name",
      headerName: "Project Name",
      renderCell: ({ row }) => <span className="text-slate-500 max-w-[200px] truncate block">{row.project_name || "N/A"}</span>,
    },
    {
      field: "quotation_date",
      headerName: "Quotation Date",
      renderCell: ({ row }) => {
        const date = row.quotation_date;
        return date ? date.split("-").reverse().join("/") : "N/A";
      },
    },
    {
      field: "subtotal",
      headerName: "Total Amount",
      renderCell: ({ row }) => {
        const sub = parseFloat(row.subtotal || 0);
        const gst = parseFloat(row.gst_percentage || 0);
        const total = sub + (sub * (gst / 100));
        return <span className="font-bold text-primary">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: ({ row }) => {
        const status = row.status;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
            status === "final" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}>
            {status}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: ({ row }) => {
        const id = row.id;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePrint(id)}
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
              title="Print / PDF"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/quotation/edit/${id}`)}
              className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(id)}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Quotation Management
          </h1>
          <p className="text-slate-500 text-sm">
            View, edit, delete, and print client estimate quotes and project rates.
          </p>
        </div>

        <Button
          onClick={() => navigate("/quotation/create")}
          className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Create Quotation
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by client or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-gray-200 focus:border-primary focus:ring-0"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <ReusableDataTable
          columns={columns}
          rows={quotations}
          loading={loading}
          totalCount={total}
          page={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
        />
      </div>

      {/* Hidden container for print renderer */}
      <div className="hidden">
        <div ref={printRef}>
          {activePrintQuotation && <QuotationPdfTemplate quotation={activePrintQuotation} />}
        </div>
      </div>
    </div>
  );
}
