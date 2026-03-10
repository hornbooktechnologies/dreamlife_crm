import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshCcw,
  Download,
  CalendarPlus,
  Calendar,
  Filter,
  Search,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import LeavesTable from './LeavesTable';
import LeaveDetailModal from './LeaveDetailModal';
import LeaveBalanceSummary from './LeaveBalanceSummary';
import { exportCSV } from '../../lib/utils/exportCSV';
import { requestHandler } from '../../lib/utils/network-client';
import CreateOrEditLeaveForm from './CreateOrEditLeaveForm';
import { useAuthStore } from '../../context/AuthContext';
import useToast from '../../hooks/useToast';

// Helper to format date for display (DD-MM-YYYY)
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const LeavesList = () => {
  const { user } = useAuthStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';
  const canApprove = user?.role === 'admin' || user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  const [statusFilter, setStatusFilter] = useState('all');
  // Renamed from selectedEmployee to employeeSearch for text search
  const [employeeSearch, setEmployeeSearch] = useState('');
  // Removed employees state as we are searching within the table data now
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [leavesList, setLeavesList] = useState({
    leaves: [],
    pagination: { current_page: 1, per_page: 10, total: 0, last_page: 1 },
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [sortedLeaves, setSortedLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateEditLeaveDialogOpen, setIsCreateEditLeaveDialogOpen] =
    useState(false);
  const [formMode, setFormMode] = useState('create');
  const [leaveToEdit, setLeaveToEdit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State for leave detail modal
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const fetchLeaves = useCallback(
    async (page = 1, limit = 10, filters = {}) => {
      setIsLoading(true);
      try {
        let response;
        if (isAdmin) {
          // Admin: Fetch all leaves with pagination and filters
          const params = {
            page,
            limit,
            status: filters.status || '',
            from_date: filters.from_date || '',
            to_date: filters.to_date || '',
            year: filters.year || '',
            search: filters.search || '',
            employee: filters.employee || '',
          };

          response = await requestHandler('/leaves/all', {
            method: 'GET',
            params,
          });
        } else {
          // Employee: Fetch own leaves with pagination and filters (no search/employee filters)
          const params = {
            page,
            limit,
            status: filters.status || '',
            from_date: filters.from_date || '',
            to_date: filters.to_date || '',
            year: filters.year || '',
          };

          response = await requestHandler('/leaves/my-leaves', {
            method: 'GET',
            params,
          });
        }

        if (response.success) {
          const responseData = response.data || {};

          // Extract leaves array - handle both nested (data.leaves) and direct array
          const leaves =
            responseData.leaves ||
            responseData.data ||
            (Array.isArray(responseData) ? responseData : []);

          // Extract pagination - check multiple possible locations
          const paginationMeta = {
            page: responseData.page || responseData.pagination?.page || page,
            limit:
              responseData.limit || responseData.pagination?.limit || limit,
            total:
              responseData.total ||
              responseData.pagination?.total ||
              leaves.length,
            totalPages:
              responseData.totalPages ||
              responseData.pagination?.totalPages ||
              Math.ceil((responseData.total || leaves.length) / limit),
          };

          setLeavesList({
            leaves: leaves,
            pagination: {
              current_page: paginationMeta.page,
              per_page: paginationMeta.limit,
              total: paginationMeta.total,
              last_page: paginationMeta.totalPages,
            },
          });
          setSortedLeaves(leaves);
          setPagination({
            current_page: paginationMeta.page,
            per_page: paginationMeta.limit,
            total: paginationMeta.total,
            last_page: paginationMeta.totalPages,
          });
        } else {
          console.error('Failed to fetch leaves:', response.message);
        }
      } catch (error) {
        console.error('Error in fetchLeaves:', error);
        setLeavesList({
          leaves: [],
          pagination: { current_page: 1, per_page: 10, total: 0, last_page: 1 },
        });
        setSortedLeaves([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isAdmin],
  );

  // Helper function to build filter parameters
  const buildFilters = useCallback(() => {
    return {
      status: statusFilter !== 'all' ? statusFilter : '',
      from_date: fromDate,
      to_date: toDate,
      search: employeeSearch,
      employee: '', // Can be extended if you add employee dropdown
      year: '', // Can be extended if you add year filter
    };
  }, [statusFilter, fromDate, toDate, employeeSearch]);

  // Fetch leaves when filters change
  useEffect(() => {
    const filters = buildFilters();
    fetchLeaves(1, 10, filters);
  }, [
    statusFilter,
    fromDate,
    toDate,
    employeeSearch,
    buildFilters,
    fetchLeaves,
  ]);

  const handlePageChange = (page) => {
    const filters = buildFilters();
    fetchLeaves(page, pagination.per_page, filters);
  };

  const handlePerPageChange = (newPerPage) => {
    const filters = buildFilters();
    fetchLeaves(1, newPerPage, filters);
  };

  // Update leave status API: PUT /leaves/:id/status
  const handleStatusChange = async (id, newStatus, admin_remark) => {
    try {
      const response = await requestHandler(`/leaves/${id}/status`, {
        method: 'PUT',
        body: { status: newStatus, admin_remark },
      });

      if (response.success) {
        showSuccessToast(
          response.message ||
          `Leave status updated to ${newStatus} successfully`,
        );
        const filters = buildFilters();
        fetchLeaves(pagination.current_page, pagination.per_page, filters);
      } else {
        showErrorToast(response.message || 'Failed to update leave status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showErrorToast('An error occurred while updating leave status');
    }
  };

  // Cancel leave API: PUT /leaves/{leave_id}/cancel
  const handleCancelLeave = async (id) => {
    if (!id) return;

    try {
      const response = await requestHandler(`/leaves/${id}/cancel`, {
        method: 'PUT',
      });

      if (response.success) {
        showSuccessToast(
          response.message || 'Leave request cancelled successfully',
        );
        const filters = buildFilters();
        fetchLeaves(pagination.current_page, pagination.per_page, filters);
      } else {
        showErrorToast(response.message || 'Failed to cancel leave request');
      }
    } catch (error) {
      console.error('Error canceling leave:', error);
      showErrorToast('An error occurred while cancelling leave request');
    }
  };

  // Delete leave API: DELETE /leaves/:id
  const handleDeleteLeave = async (id) => {
    if (!id) return;

    try {
      const response = await requestHandler(`/leaves/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        showSuccessToast(
          response.message || 'Leave request deleted successfully',
        );
        const filters = buildFilters();
        fetchLeaves(pagination.current_page, pagination.per_page, filters);
      } else {
        showErrorToast(response.message || 'Failed to delete leave request');
      }
    } catch (error) {
      console.error('Error deleting leave:', error);
      showErrorToast('An error occurred while deleting leave request');
    }
  };

  const provideLeaveForEdit = (id) => {
    if (!id) return;
    setFormMode('edit');
    const leave = leavesList?.leaves.find((l) => l.id === id);
    if (leave) setLeaveToEdit(leave);
  };

  const handleExportCSV = () => {
    try {
      const exportData = (sortedLeaves || leavesList?.leaves)?.map((leave) => ({
        First_name: leave.first_name || 'N/A',
        Last_name: leave.last_name || 'N/A',
        LeaveType: leave.leave_type || 'N/A',
        StartDate: leave.start_date || 'N/A',
        EndDate: leave.end_date || 'N/A',
        Days: leave.duration || 'N/A',
        Status: leave.status || 'N/A',
        RequestedOn: leave.created_at || 'N/A',
        Reason: leave.reason || 'N/A',
      }));
      exportCSV('leaves.csv', exportData || []);
      showSuccessToast('Leave data exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showErrorToast('Failed to export leave data');
    }
  };

  // Handle row click to open detail modal
  const handleRowClick = (row) => {
    setSelectedLeave(row);
    setIsDetailModalOpen(true);
  };

  // Since filtering is now done server-side, we just use the leaves directly
  const filteredLeaves = sortedLeaves || leavesList?.leaves || [];

  return (
    <>
      {/* Page Header - Outside Card */}
      <div className="flex flex-row items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent pb-2">
            Leave Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage employee leave requests and approvals
          </p>
        </div>
        {user?.role !== 'hr' && (
          <Button
            onClick={() => {
              setFormMode('create');
              setLeaveToEdit(undefined);
              setIsCreateEditLeaveDialogOpen((prev) => !prev);
            }}
            className='h-10 px-4 sm:px-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] 
                      text-white font-semibold gap-2
                      shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                      hover:-translate-y-0.5 transition-all duration-200
                      active:scale-95'
          >
            <CalendarPlus size={18} />
            <span className='hidden sm:inline'>Add Leave</span>
          </Button>
        )}
      </div>

      {/* Table Card with Glass Effect */}
      <Card
        className="border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 ring-1 ring-black/5"
        style={{
          boxShadow:
            "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        <div className='flex items-center justify-end gap-2 p-4 pb-0 sm:p-6 sm:pb-0'>
          {/* Toolbar */}
          <div className="flex items-center justify-end gap-2">
            <TooltipProvider>
              {/* Filter Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    variant='outline'
                    className={`h-10 w-10 p-0 border-2 ${isFiltersOpen ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-700'} 
                              hover:bg-blue-50 hover:text-[#5283c5] hover:border-[#5283c5]
                              transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center`}
                  >
                    <Filter size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Filters</p>
                </TooltipContent>
              </Tooltip>

              {/* Refresh Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      const filters = buildFilters();
                      fetchLeaves(
                        pagination.current_page,
                        pagination.per_page,
                        filters,
                      );
                      setRefreshTrigger((prev) => prev + 1);
                    }}
                    variant='outline'
                    className="h-10 w-10 p-0 border-2 border-gray-200 bg-white hover:bg-blue-50 
                              text-gray-700 hover:text-[#5283c5] hover:border-[#5283c5]
                              transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                  >
                    <RefreshCcw size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh leave data</p>
                </TooltipContent>
              </Tooltip>

              {/* Export Button */}
              {!isEmployee && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      onClick={handleExportCSV}
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
              )}
            </TooltipProvider>
          </div>

          {/* Filters Section */}
          {isFiltersOpen && (
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-3 animate-in fade-in slide-in-from-top-2 duration-200 bg-white rounded-lg shadow-lg border border-gray-200 p-2'>
              {/* Employee Dropdown - Only for Admin/Manager */}
              {!isEmployee && (
                <div className='lg:col-span-3'>
                  <label className='text-xs font-bold uppercase tracking-wider mb-1 block pl-1'>
                    Search Employee
                  </label>
                  <div className='relative'>
                    <Search
                      className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                      size={18}
                    />
                    <Input
                      placeholder='Search by name...'
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      className='pl-10 h-10 border-2 transition-all bg-white font-medium text-gray-700 focus:ring-2 focus-visible:ring-blue-50 focus:border-[#5283c5]'
                    />
                  </div>
                </div>
              )}

              {/* Status Filter */}
              <div className='lg:col-span-3'>
                <label className='text-xs font-bold uppercase tracking-wider mb-1 block pl-1'>
                  Status
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className='h-10 border-2 border-gray-300 transition-all bg-white font-medium text-gray-700 focus:ring-0 focus:border-[#5283c5]'>
                    <SelectValue placeholder='All Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='approved'>Approved</SelectItem>
                    <SelectItem value='rejected'>Rejected</SelectItem>
                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* From Date */}
              <div
                className={`${isEmployee ? 'lg:col-span-4' : 'lg:col-span-3'}`}
              >
                <label className='text-xs font-bold uppercase tracking-wider mb-1 block pl-1'>
                  Start Date
                </label>
                <div className='relative group'>
                  <Input
                    type="text"
                    placeholder="Start Date"
                    value={formatDateForDisplay(fromDate)}
                    readOnly
                    className="h-10 pr-10 border-2 border-gray-300 focus:border-[#5283c5] transition-all bg-white font-medium text-gray-700 focus-visible:ring-0 focus-visible:border-[#5283c5] w-full"
                  />
                  <Input
                    type='date'
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10'
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  />
                  <Calendar
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-20'
                    size={18}
                  />
                </div>
              </div>

              {/* To Date */}
              <div
                className={`${isEmployee ? 'lg:col-span-4' : 'lg:col-span-3'}`}
              >
                <label className='text-xs font-bold uppercase tracking-wider mb-1 block pl-1'>
                  End Date
                </label>
                <div className='relative group'>
                  <Input
                    type="text"
                    placeholder="End Date"
                    value={formatDateForDisplay(toDate)}
                    readOnly
                    className="h-10 pr-10 border-2 border-gray-300 focus:border-[#5283c5] transition-all bg-white font-medium text-gray-700 focus-visible:ring-0 focus-visible:border-[#5283c5] w-full"
                  />
                  <Input
                    type='date'
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10'
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  />
                  <Calendar
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-20'
                    size={18}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(employeeSearch || fromDate || toDate || statusFilter !== 'all') && (
            <div className='flex flex-wrap items-center gap-2 text-sm mt-2'>
              <span className='text-gray-500 font-medium'>Active filters:</span>
              {statusFilter !== 'all' && (
                <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full'>
                  Status: {statusFilter}
                </span>
              )}
              {employeeSearch && !isEmployee && (
                <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full'>
                  Search: "{employeeSearch}"
                </span>
              )}
              {fromDate && (
                <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full'>
                  From: {new Date(fromDate).toLocaleDateString('en-GB')}
                </span>
              )}
              {toDate && (
                <span className='px-3 py-1 bg-orange-100 text-orange-700 rounded-full'>
                  To: {new Date(toDate).toLocaleDateString('en-GB')}
                </span>
              )}
              <button
                onClick={() => {
                  setEmployeeSearch('');
                  setFromDate('');
                  setToDate('');
                  setStatusFilter('all');
                }}
                className='ml-2 text-red-600 hover:text-red-700 hover:underline'
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <CardContent className="p-2 sm:p-6 sm:pt-4 overflow-x-auto">
          <LeavesTable
            leaves={filteredLeaves}
            setFormMode={setFormMode}
            setIsCreateEditLeaveDialogOpen={setIsCreateEditLeaveDialogOpen}
            getLeaveForEdit={provideLeaveForEdit}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
            onRowClick={handleRowClick}
            pagination={pagination}
            loading={isLoading}
            onStatusChange={handleStatusChange}
            onCancelLeave={handleCancelLeave}
            onDeleteLeave={handleDeleteLeave}
            isAdmin={isAdmin}
            userRole={user?.role}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            resetSortTrigger={refreshTrigger}
          />
        </CardContent>
      </Card>

      <CreateOrEditLeaveForm
        setIsOpen={setIsCreateEditLeaveDialogOpen}
        isOpen={isCreateEditLeaveDialogOpen}
        type={formMode}
        editableLeave={leaveToEdit}
        fetchLeaves={() => {
          const filters = buildFilters();
          fetchLeaves(pagination.current_page, pagination.per_page, filters);
        }}
      />

      {/* Leave Detail Modal for viewing and approving leaves */}
      <LeaveDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLeave(null);
        }}
        leave={selectedLeave}
        canApprove={canApprove}
        onStatusChange={(id, status, admin_remark) => {
          handleStatusChange(id, status, admin_remark);
          setIsDetailModalOpen(false);
          setSelectedLeave(null);
        }}
        onCancelLeave={(id) => {
          handleCancelLeave(id);
          setIsDetailModalOpen(false);
          setSelectedLeave(null);
        }}
        userRole={user?.role}
      />
    </>
  );
};

export default LeavesList;
