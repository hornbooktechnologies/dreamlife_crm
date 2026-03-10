import React, { useMemo } from "react";
import ReusableDataTable from "../common/data-table/ReusableDataTable";
import {
  FileText,
  UserRoundPen,
  Banknote,
  Briefcase,
  UserMinus,
  EllipsisVertical,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthStore } from "../../context/AuthContext";

export default function DocumentEmployeeTable({
  employees,
  handlePageChange,
  handlePerPageChange, // Added prop
  pagination,
  loading,
  onGenerateLetter,
  onGeneratePaySlip,
  onGenerateOfferLetter,
  onGenerateReleaseLetter,
  resetSortTrigger,
}) {
  const { user } = useAuthStore();
  const isAdminOrManager = ["admin", "manager"].includes(user?.role);

  const rowsWithFullName = useMemo(() => {
    return (employees || []).map((emp) => ({
      ...emp,
      fullName: `${emp.first_name || ""} ${emp.last_name || ""}`.trim(),
    }));
  }, [employees]);

  const renderStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 capitalize">
            {status}
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 capitalize">
            {status}
          </span>
        );
      default:
        return <span className="capitalize">{status}</span>;
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "user_image",
        headerName: "Profile",
        width: "80px",
        sortable: false,
        renderCell: ({ value }) =>
          value ? (
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <img
                src={value}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <UserRoundPen className="w-5 h-5 text-gray-400" />
            </div>
          ),
      },
      {
        field: "fullName",
        headerName: "Name",
        sortable: true,
        valueGetter: (value, row) => `${row.first_name} ${row.last_name}`,
        renderCell: (params) => (
          <span className="font-medium">
            {params.row.first_name} {params.row.last_name}
          </span>
        ),
      },
      {
        field: "designation",
        headerName: "Designation",
        renderCell: ({ value }) => (
          <span className="text-slate-600">{value || "N/A"}</span>
        ),
      },
      {
        field: "joining_date",
        headerName: "Joining Date",
        renderCell: ({ value }) => {
          const date = value ? new Date(value).toLocaleDateString('en-GB') : "N/A";
          return <span className="text-slate-600">{date}</span>;
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: "120px",
        sortable: true,
        renderCell: ({ value }) => renderStatusBadge(value),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: "80px",
        sortable: false,
        align: "center",
        sticky: "right",
        cellClassName: "bg-white",
        headerClassName: "bg-white",
        renderCell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 data-[state=open]:bg-gray-100">
                <span className="sr-only">Open menu</span>
                <EllipsisVertical className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onGenerateLetter(row)}
                className="cursor-pointer gap-2 hover:bg-gray-50 focus:bg-gray-50 text-gray-700 font-medium"
              >
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Experience Letter</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onGeneratePaySlip(row)}
                className="cursor-pointer gap-2 hover:bg-gray-50 focus:bg-gray-50 text-gray-700 font-medium"
              >
                <Banknote className="h-4 w-4 text-green-500" />
                <span>Pay Slip</span>
              </DropdownMenuItem>
              {isAdminOrManager && (
                <>
                  <DropdownMenuSeparator className="my-1 border-gray-100" />
                  <DropdownMenuItem
                    onClick={() => onGenerateOfferLetter(row)}
                    className="cursor-pointer gap-2 hover:bg-gray-50 focus:bg-gray-50 text-gray-700 font-medium"
                  >
                    <Briefcase className="h-4 w-4 text-purple-500" />
                    <span>Offer Letter</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onGenerateReleaseLetter(row)}
                    className="cursor-pointer gap-2 hover:bg-gray-50 focus:bg-gray-50 text-gray-700 font-medium"
                  >
                    <UserMinus className="h-4 w-4 text-red-500" />
                    <span>Release Letter</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [
      pagination,
      employees,
      onGenerateLetter,
      onGeneratePaySlip,
      onGenerateOfferLetter,
      onGenerateReleaseLetter,
      isAdminOrManager,
    ],
  );

  return (
    <ReusableDataTable
      columns={columns}
      rows={rowsWithFullName}
      loading={loading}
      checkboxSelection={false}
      pageSize={pagination?.per_page || 10}
      handlePageChange={handlePageChange}
      handlePerPageChange={handlePerPageChange}
      emptyMessage="No employees available at the moment!"
      pagination={pagination}
      resetSortTrigger={resetSortTrigger}
    />
  );
}
