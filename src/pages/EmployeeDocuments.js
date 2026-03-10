import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/AuthContext";
import { RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { requestHandler } from "../lib/utils/network-client";
import DocumentEmployeeTable from "../components/documents/DocumentEmployeeTable";
import ExperienceLetterDialog from "../components/documents/ExperienceLetterDialog";
import PaySlipDialog from "../components/documents/PaySlipGenerationDialog";
import OfferLetterDialog from "../components/documents/OfferLetterDialog";
import ReleaseLetterDialog from "../components/documents/ReleaseLetterDialog";

const EmployeeDocuments = () => {
  const [employeesList, setEmployeesList] = useState({
    employees: [],
    pagination: { current_page: 1, per_page: 10, total: 0, last_page: 1 },
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Redirect HR users away from this page
  useEffect(() => {
    if (user?.role === 'hr') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const [isLoading, setIsLoading] = useState(false);

  if (user?.role === 'hr') return null;

  // Dialog State
  const [isLetterDialogOpen, setIsLetterDialogOpen] = useState(false);
  const [isPaySlipDialogOpen, setIsPaySlipDialogOpen] = useState(false);
  const [isOfferLetterDialogOpen, setIsOfferLetterDialogOpen] = useState(false);
  const [isReleaseLetterDialogOpen, setIsReleaseLetterDialogOpen] =
    useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const response = await requestHandler("/employees", {
        method: "GET",
        params: { page, limit },
      });

      if (response.success) {
        const responseData = response.data || {};
        const employees = Array.isArray(responseData)
          ? responseData
          : responseData.data || [];
        const paginationMeta = responseData.pagination || {
          total: employees.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(employees.length / limit),
        };

        setEmployeesList({
          employees: employees,
          pagination: {
            current_page: paginationMeta.page,
            per_page: paginationMeta.limit,
            total: paginationMeta.total,
            last_page: paginationMeta.totalPages,
          },
        });
        setPagination({
          current_page: paginationMeta.page,
          per_page: paginationMeta.limit,
          total: paginationMeta.total,
          last_page: paginationMeta.totalPages,
        });
      } else {
        console.error("Failed to fetch employees:", response.message);
      }
    } catch (error) {
      console.error("Error in fetchEmployees:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(1, 10);
  }, [fetchEmployees]);

  const handlePageChange = (page) => {
    fetchEmployees(page, pagination.per_page);
  };

  const handlePerPageChange = (newPerPage) => {
    fetchEmployees(1, newPerPage);
  };

  const handleGenerateLetter = (employee) => {
    setSelectedEmployee(employee);
    setIsLetterDialogOpen(true);
  };

  const handleGeneratePaySlip = (employee) => {
    setSelectedEmployee(employee);
    setIsPaySlipDialogOpen(true);
  };

  const handleGenerateOfferLetter = (employee) => {
    setSelectedEmployee(employee);
    setIsOfferLetterDialogOpen(true);
  };

  const handleGenerateReleaseLetter = (employee) => {
    setSelectedEmployee(employee);
    setIsReleaseLetterDialogOpen(true);
  };

  return (
    <div>
      {/* Page Header - Outside Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent pb-2">
            Employee Documents
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Generate documents like Experience Letters and Pay Slips
          </p>
        </div>
      </div>

      <Card
        className="border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 ring-1 ring-black/5"
        style={{
          boxShadow:
            "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        <CardHeader className="flex flex-row items-center justify-end pb-2 space-y-0">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    onClick={() => {
                      fetchEmployees(pagination.current_page, pagination.per_page);
                      setRefreshTrigger((prev) => prev + 1);
                    }}
                    className="h-10 w-10 p-0 border-2 border-gray-200 bg-white hover:bg-blue-50 
                              text-gray-700 hover:text-[#5283c5] hover:border-[#5283c5]
                              transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                  >
                    <RefreshCcw size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh Employee List</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 sm:pt-0 overflow-x-auto">
          <DocumentEmployeeTable
            employees={employeesList?.employees}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
            pagination={pagination}
            loading={isLoading}
            onGenerateLetter={handleGenerateLetter}
            onGeneratePaySlip={handleGeneratePaySlip}
            onGenerateOfferLetter={handleGenerateOfferLetter}
            onGenerateReleaseLetter={handleGenerateReleaseLetter}
            resetSortTrigger={refreshTrigger}
          />
        </CardContent>
      </Card>

      <ExperienceLetterDialog
        isOpen={isLetterDialogOpen}
        setIsOpen={setIsLetterDialogOpen}
        employee={selectedEmployee}
      />

      <PaySlipDialog
        isOpen={isPaySlipDialogOpen}
        setIsOpen={setIsPaySlipDialogOpen}
        employee={selectedEmployee}
      />

      <OfferLetterDialog
        isOpen={isOfferLetterDialogOpen}
        setIsOpen={setIsOfferLetterDialogOpen}
        employee={selectedEmployee}
      />

      <ReleaseLetterDialog
        isOpen={isReleaseLetterDialogOpen}
        setIsOpen={setIsReleaseLetterDialogOpen}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default EmployeeDocuments;
