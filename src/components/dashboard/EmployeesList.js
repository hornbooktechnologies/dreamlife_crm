import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/AuthContext';
import { RefreshCcw, Download, UserPlus, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import EmployeeTable from './EmployeeTableBody';
import { exportCSV } from '../../lib/utils/exportCSV';
import { requestHandler } from '../../lib/utils/network-client';
import ViewEmployeeDialog from './ViewEmployeeDialog';
import useToast from '../../hooks/useToast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const EmployeesList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [employeesList, setEmployeesList] = useState({
    employees: [],
    pagination: { current_page: 1, per_page: 10, total: 0, last_page: 1 },
  });
  const [pagination, setPagination] = useState(() => {
    const saved = sessionStorage.getItem('employees_pagination');
    return saved ? JSON.parse(saved) : {
      current_page: 1,
      per_page: 10,
      total: 0,
    };
  });
  const [sortedEmployees, setSortedEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [employeeToView, setEmployeeToView] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { showSuccessToast, showErrorToast } = useToast();

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );

  const fetchEmployees = useCallback(
    async (page = 1, limit = 10) => {
      setIsLoading(true);
      try {
        const response = await requestHandler('/employees', {
          method: 'GET',
          params: { page, limit, year: selectedYear },
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
          const newPagination = {
            current_page: paginationMeta.page,
            per_page: paginationMeta.limit,
            total: paginationMeta.total,
            last_page: paginationMeta.totalPages,
          };
          setPagination(newPagination);
          sessionStorage.setItem('employees_pagination', JSON.stringify(newPagination));
          setSortedEmployees(employees);
        } else {
          console.error('Failed to fetch employees:', response.message);
        }
      } catch (error) {
        console.error('Error in fetchEmployees:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedYear],
  );

  useEffect(() => {
    fetchEmployees(pagination.current_page, pagination.per_page);
  }, [fetchEmployees]);

  const handlePageChange = (page) => {
    fetchEmployees(page, pagination.per_page);
  };

  const handlePerPageChange = (newPerPage) => {
    fetchEmployees(1, newPerPage);
  };

  const provideEmployeeForEdit = (id) => {
    if (!id) return;
    navigate(`/employee/edit/${id}`);
  };

  const confirmDelete = (id) => {
    if (!id) return;
    setEmployeeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await requestHandler(`/employees/${employeeToDelete}`, {
        method: 'DELETE',
      });
      if (response.success) {
        showSuccessToast(response.message || 'Employee deleted successfully');
        fetchEmployees(pagination.current_page, pagination.per_page);
      } else {
        showErrorToast(response.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      showErrorToast('Something went wrong while deleting employee');
    } finally {
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleViewEmployee = (employee) => {
    setEmployeeToView(employee);
    setIsViewDialogOpen(true);
  };

  const handleExportCSV = () => {
    const exportData = (sortedEmployees || employeesList?.employees)?.map(
      (employee) => ({
        FirstName: employee.first_name,
        LastName: employee.last_name,
        Email: employee.email,
        Designation: employee.designation,
        JoiningDate: employee.joining_date,
        Address: employee.address,
        PhoneNumber: employee.phone_number || 'N/A',
        EmergencyContact: employee.emergency_contact || 'N/A',
        Relation: employee.emergency_contact_relation || 'N/A',
        Status: employee.status,
      }),
    );
    exportCSV('employees.csv', exportData || []);
    showSuccessToast('Employees exported successfully');
  };

  return (
    <>
      {/* Page Header - Outside Card */}
      <div className="flex flex-row items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent pb-2">
            Employee Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage employee information and records
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">


          <Button
            onClick={() => navigate('/employee/add')}
            className='h-10 px-4 sm:px-6 bg-primary hover:bg-primary-hover
                        text-white font-semibold gap-2
                        shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                        hover:-translate-y-0.5 transition-all duration-200
                        active:scale-95'
          >
            <UserPlus size={18} />
            <span className='hidden sm:inline'>Add Employee</span>
          </Button>
        </div>
      </div>

      {/* Table Card with Glass Effect */}
      <Card
        className="border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 ring-1 ring-black/5"
        style={{
          boxShadow:
            "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        {/* Card Header with Refresh and Export buttons */}
        <div className="flex items-center justify-end gap-2 p-4 pb-0 sm:p-6 sm:pb-0">
          <div className='flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 mr-2'>
            <div className='flex items-center gap-1.5'>
              <label
                htmlFor='leave-year-select'
                className='text-xs font-semibold text-blue-900 whitespace-nowrap'
              >
                Leave Year:
              </label>
              <div className='group relative'>
                <Info className='w-3 h-3 text-blue-600 cursor-help' />
                <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50'>
                  <div className='bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg'>
                    Filters "Used Leave" column
                    <div className='absolute top-full left-1/2 -translate-x-1/2 -mt-1'>
                      <div className='border-4 border-transparent border-t-gray-900'></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-[90px]'>
              <Select
                value={selectedYear}
                onValueChange={(value) => setSelectedYear(value)}
              >
                <SelectTrigger
                  id='leave-year-select'
                  className='h-7 border-2 border-blue-300 bg-white hover:bg-blue-50 text-blue-900 hover:border-blue-400 transition-all duration-200 font-semibold text-xs'
                >
                  <SelectValue placeholder='Year' />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    fetchEmployees(pagination.current_page, pagination.per_page);
                    setRefreshTrigger((prev) => prev + 1);
                  }}
                  className="h-10 w-10 p-0 border-2 border-gray-200 bg-white hover:bg-blue-50 
                            text-gray-700 hover:text-[#5283c5] hover:border-[#5283c5]
                            transition-all duration-200 shadow-sm hover:shadow-md group flex items-center justify-center"
                >
                  <RefreshCcw size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh employee data</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="h-10 w-10 p-0 border-2 border-gray-200 bg-white hover:bg-blue-50 
                            text-gray-700 hover:text-[#5283c5] hover:border-[#5283c5]
                            transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  <Download size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export CSV</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <CardContent className="p-2 sm:p-6 overflow-x-auto">
          <EmployeeTable
            employees={sortedEmployees || employeesList?.employees}
            getEmployeeForEdit={provideEmployeeForEdit}
            deleteEmployee={confirmDelete}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
            onRowClick={handleViewEmployee}
            pagination={pagination}
            loading={isLoading}
            onViewEmployee={handleViewEmployee}
            resetSortTrigger={refreshTrigger}
            selectedYear={selectedYear}
            userRole={user?.role}
          />
        </CardContent>
      </Card>

      <ViewEmployeeDialog
        isOpen={isViewDialogOpen}
        setIsOpen={setIsViewDialogOpen}
        employee={employeeToView}
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="w-[90%] sm:max-w-lg rounded-xl">
          <AlertDialogHeader className="!text-left mb-4">
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="!flex-row !justify-end gap-3">
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} className="!mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmployeesList;

