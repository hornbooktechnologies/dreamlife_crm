import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Info, Download, RefreshCcw, UserPlus, Filter } from 'lucide-react';
import { useAuthStore } from '../../context/AuthContext';
import { requestHandler } from '../../lib/utils/network-client';
import useToast from '../../hooks/useToast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
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
import AttendanceTable from './AttendanceTable';
import CreateOrEditAttendanceForm from './CreateOrEditAttendanceForm';
import { exportCSV } from '../../lib/utils/exportCSV';

// Helper to format date (DD-MM-YYYY)
const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const AttendanceTrackingList = () => {
    const { user } = useAuthStore();
    const { showSuccessToast, showErrorToast } = useToast();
    const [attendanceList, setAttendanceList] = useState({
        records: [], // Updated to match likely API response structure or mapped correctly
        pagination: { current_page: 1, per_page: 10, total: 0, last_page: 1 },
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [recordToEdit, setRecordToEdit] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Filter states
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('all');
    const [employees, setEmployees] = useState([]);

    // Delete dialog state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [stats, setStats] = useState({
        total_late_minutes: 0,
        total_early_minutes: 0,
        total_extra_days: 0,
        net_balance: '0h 0m',
        avg_check_in: '--',
        avg_check_out: '--'
    });

    const isAdmin = user?.role === 'admin' || user?.role === 'hr';

    // Build filters object
    const buildFilters = useCallback(() => {
        const filters = {};
        if (selectedMonth && selectedMonth !== 'all') filters.month = selectedMonth;
        if (selectedYear) filters.year = selectedYear;
        if (typeFilter && typeFilter !== 'all') filters.type = typeFilter;
        if (isAdmin && selectedEmployeeId && selectedEmployeeId !== 'all') filters.employee_id = selectedEmployeeId;
        return filters;
    }, [selectedMonth, selectedYear, typeFilter, selectedEmployeeId, isAdmin]);

    const fetchAttendanceRecords = useCallback(
        async (page = 1, limit = 10, filters = {}) => {
            setIsLoading(true);
            try {
                // Ensure default filters are applied if not passed
                const activeFilters = Object.keys(filters).length ? filters : buildFilters();

                let url, method, params;

                // Common params for list and stats
                const commonParams = { ...activeFilters };

                if (isAdmin) {
                    url = '/attendance-tracking/all';
                    method = 'GET';
                    params = {
                        page,
                        limit,
                        ...commonParams,
                    };
                } else {
                    // Start of employee logic
                    url = `/attendance-tracking/employee/${user?.employee_id || user?.id}`;
                    method = 'GET';
                    params = {
                        page,
                        limit,
                        ...commonParams,
                    };
                }

                // Parallel fetch for stats if filters are changed or initial load
                // We'll calculate stats based on the same filters (month/year/emp)
                // Note: Stats endpoint also needs to respect the employee filter!
                // We updated backend to accept employee_id.

                const statsParams = {
                    month: commonParams.month,
                    year: commonParams.year,
                    employee_id: isAdmin ? commonParams.employee_id : (user?.employee_id || user?.id)
                };

                const [listResponse, statsResponse] = await Promise.all([
                    requestHandler(url, { method, params }),
                    requestHandler('/attendance-tracking/stats', { method: 'GET', params: statsParams })
                ]);

                if (listResponse.success) {
                    const responseData = listResponse.data || {};
                    const records = Array.isArray(responseData)
                        ? responseData
                        : responseData.records || responseData.data || [];

                    const paginationMeta = responseData.pagination || {
                        total: responseData.total || records.length,
                        page: responseData.page || page,
                        limit: limit,
                        totalPages: Math.ceil((responseData.total || records.length) / limit),
                    };

                    setAttendanceList({
                        records: records,
                        pagination: paginationMeta
                    });
                    setPagination({
                        current_page: paginationMeta.page,
                        per_page: paginationMeta.limit,
                        total: paginationMeta.total,
                        last_page: paginationMeta.totalPages,
                    });
                } else {
                    showErrorToast(listResponse.message || 'Failed to fetch attendance records');
                }

                if (statsResponse.success) {
                    let totalLate = 0;
                    let totalEarly = 0;
                    let totalExtraDays = 0;

                    if (Array.isArray(statsResponse.data)) {
                        totalLate = statsResponse.data.reduce((acc, curr) =>
                            acc + (parseInt(curr.total_late_minutes) || 0) + (parseInt(curr.total_overtime_minutes) || 0),
                            0);
                        totalEarly = statsResponse.data.reduce((acc, curr) => acc + (parseInt(curr.total_early_minutes) || 0), 0);

                        const extraDaysRecord = statsResponse.data.find(d => d.type === 'extra');
                        totalExtraDays = extraDaysRecord ? extraDaysRecord.count : 0;
                    }

                    const summary = statsResponse.summary || {};

                    setStats({
                        total_late_minutes: totalLate,
                        total_early_minutes: totalEarly,
                        total_extra_days: totalExtraDays,
                        net_balance: summary.netBalance || '0h 0m',
                        avg_check_in: summary.avgCheckIn || '--',
                        avg_check_out: summary.avgCheckOut || '--'
                    });
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                showErrorToast('Error loading attendance data');
            } finally {
                setIsLoading(false);
            }
        },
        [showErrorToast, buildFilters, isAdmin, user?.id, user?.employee_id],
    );

    // Fetch employees for admin filter
    useEffect(() => {
        const fetchEmployees = async () => {
            if (!isAdmin) return;
            try {
                const response = await requestHandler('/employees', {
                    method: 'GET',
                    params: { limit: 100 },
                });
                if (response.success) {
                    const employeeData = response.data?.data || response.data || [];
                    setEmployees(employeeData);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, [isAdmin]);

    // Initial fetch and fetch on filter change
    useEffect(() => {
        const filters = buildFilters();
        fetchAttendanceRecords(1, pagination.per_page, filters);
        // We only want to re-fetch when these specific values change
    }, [selectedMonth, selectedYear, typeFilter, selectedEmployeeId, pagination.per_page, fetchAttendanceRecords, buildFilters]);

    const handlePageChange = (newPage) => {
        const filters = buildFilters();
        fetchAttendanceRecords(newPage, pagination.per_page, filters);
    };

    const handlePerPageChange = (newPerPage) => {
        const filters = buildFilters();
        fetchAttendanceRecords(1, newPerPage, filters);
    };

    const confirmDelete = (id) => {
        setRecordToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const executeDelete = async () => {
        if (!recordToDelete) return;
        try {
            const response = await requestHandler(
                `/attendance-tracking/${recordToDelete}`,
                {
                    method: 'DELETE',
                },
            );

            if (response.success) {
                showSuccessToast('Attendance record deleted successfully');
                const filters = buildFilters();
                fetchAttendanceRecords(pagination.current_page, pagination.per_page, filters);
            } else {
                showErrorToast(response.message || 'Failed to delete record');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            showErrorToast('An error occurred while deleting the record');
        } finally {
            setIsDeleteDialogOpen(false);
            setRecordToDelete(null);
        }
    };


    const provideRecordForEdit = async (id) => {
        try {
            // Updated to fetch fresh data from backend on edit click
            setIsLoading(true);
            const response = await requestHandler(`/attendance-tracking/${id}`, {
                method: 'GET'
            });

            if (response.success) {
                setRecordToEdit(response.data);
                setFormMode('edit');
                setIsFormDialogOpen(true);
            } else {
                showErrorToast(response.message || 'Failed to fetch record details');
            }
        } catch (error) {
            console.error('Error fetching record for edit:', error);
            showErrorToast('Error loading record details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportCSV = () => {
        const recordsToExport = attendanceList.records || [];
        const data = recordsToExport.map((record) => {
            const getTypeLabel = (type) => {
                if (type === 'early') return 'Early Leave';
                if (type === 'late') return 'Late Arrival';
                if (type === 'going_late') return 'Overtime';
                if (type === 'extra') return 'Extra Day';
                return type || 'N/A';
            };

            return {
                Employee_Name: `${record.first_name || ''} ${record.last_name || ''}`.trim() || 'N/A',
                Email: record.email || 'N/A',
                Designation: record.designation || 'N/A',
                Type: typeLabel,
                Date: formatDateForDisplay(record.date) || 'N/A',
                Time: record.time || 'N/A',
                Remark: record.remark || 'N/A',
            };
        });

        exportCSV('attendance-records.csv', data);
        showSuccessToast('Attendance records exported successfully');
    };

    // Filtered records logic is handled by API/backend now since we pass filters
    // But if backend doesn't filter, we might need client side fallback?
    // Assuming backend handles it. we pass records directly.
    const filteredRecords = attendanceList.records;

    return (
        <>
            {/* Page Header */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-row items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent pb-2">
                            Attendance Tracking
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            Monitor entries for early leaving, late coming, etc.
                        </p>
                    </div>

                    {isAdmin && (
                        <Button
                            onClick={() => {
                                setRecordToEdit(null);
                                setFormMode('create');
                                setIsFormDialogOpen(true);
                            }}
                            className='h-10 px-4 sm:px-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc]
                            text-white font-semibold gap-2
                            shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                            hover:-translate-y-0.5 transition-all duration-200
                            active:scale-95'
                        >
                            <UserPlus size={18} />
                            <span className='hidden sm:inline'>Add Record</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Card */}
            <Card
                className="border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 ring-1 ring-black/5"
                style={{
                    boxShadow:
                        "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
            >
                {/* Filters Toolbar */}
                <div className="flex flex-row flex-wrap items-center justify-between p-4 pb-0 sm:p-6 sm:pb-0 gap-4">
                    {/* Left Side - Net Balance (shows for employee or admin with selected employee) */}
                    <div className="flex items-center gap-4">
                        {((isAdmin && selectedEmployeeId && selectedEmployeeId !== 'all') || !isAdmin) && stats.net_balance && stats.net_balance !== '0h 0m' && stats.net_balance !== '+ 0m' && stats.net_balance !== '- 0m' && (
                            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${stats.net_balance.startsWith('-') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                <span className={`text-sm font-bold ${stats.net_balance.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                                    {stats.net_balance.startsWith('-') ? 'Time Deficit:' : 'Time Credit:'}
                                </span>
                                <span className={`text-lg font-extrabold ${stats.net_balance.startsWith('-') ? 'text-red-700' : 'text-green-700'}`}>
                                    {stats.net_balance}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Filter Controls and Export Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">

                        {/* Group 1: Employee & Type */}
                        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 w-full sm:w-auto">
                            {isAdmin && (
                                <>
                                    <Select
                                        value={selectedEmployeeId}
                                        onValueChange={setSelectedEmployeeId}
                                    >
                                        <SelectTrigger className="w-full sm:w-[140px] px-2 gap-2 h-8 border-0 bg-transparent focus:ring-0 text-gray-700 font-semibold text-xs hover:bg-gray-50">
                                            <SelectValue placeholder="Unknown Employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="focus:bg-blue-50 focus:text-[#3a5f9e]">All Employees</SelectItem>
                                            {employees.map((emp) => (
                                                <SelectItem key={emp.id} value={emp.id.toString()} className="focus:bg-blue-50 focus:text-[#3a5f9e]">
                                                    {emp.first_name} {emp.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="w-px h-6 bg-gray-200"></div>
                                </>
                            )}

                            <Select
                                value={typeFilter}
                                onValueChange={setTypeFilter}
                            >
                                <SelectTrigger className="w-full sm:w-[110px] px-2 gap-2 h-8 border-0 bg-transparent focus:ring-0 text-gray-700 font-semibold text-xs hover:bg-gray-50">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="focus:bg-blue-50 focus:text-[#3a5f9e]">All Types</SelectItem>
                                    <SelectItem value="early" className="focus:bg-blue-50 focus:text-[#3a5f9e]">Early Leave</SelectItem>
                                    <SelectItem value="late" className="focus:bg-blue-50 focus:text-[#3a5f9e]">Late Arrival</SelectItem>
                                    <SelectItem value="going_late" className="focus:bg-blue-50 focus:text-[#3a5f9e]">Overtime</SelectItem>
                                    <SelectItem value="extra" className="focus:bg-blue-50 focus:text-[#3a5f9e]">Extra Day</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Group 2: Month & Year (and Download) */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 flex-1 sm:flex-none">
                                <Select
                                    value={selectedMonth.toString()}
                                    onValueChange={(val) => setSelectedMonth(val === 'all' ? 'all' : parseInt(val))}
                                >
                                    <SelectTrigger className="w-full sm:w-[100px] px-2 gap-2 h-8 border-0 bg-transparent focus:ring-0 text-gray-700 font-semibold text-xs hover:bg-gray-50">
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all" className="focus:bg-blue-50 focus:text-[#3a5f9e]">All Months</SelectItem>
                                        {[
                                            { v: 1, l: "January" }, { v: 2, l: "February" }, { v: 3, l: "March" },
                                            { v: 4, l: "April" }, { v: 5, l: "May" }, { v: 6, l: "June" },
                                            { v: 7, l: "July" }, { v: 8, l: "August" }, { v: 9, l: "September" },
                                            { v: 10, l: "October" }, { v: 11, l: "November" }, { v: 12, l: "December" }
                                        ].map((m) => (
                                            <SelectItem key={m.v} value={m.v.toString()} className="focus:bg-blue-50 focus:text-[#3a5f9e]">
                                                {m.l}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="w-px h-6 bg-gray-200"></div>

                                <Select
                                    value={selectedYear.toString()}
                                    onValueChange={(val) => setSelectedYear(parseInt(val))}
                                >
                                    <SelectTrigger className="w-full sm:w-[80px] px-2 gap-2 h-8 border-0 bg-transparent focus:ring-0 text-gray-700 font-semibold text-xs hover:bg-gray-50">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 5 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return (
                                                <SelectItem key={year} value={year.toString()} className="focus:bg-blue-50 focus:text-[#3a5f9e]">
                                                    {year}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={handleExportCSV}
                                            variant="outline"
                                            className="h-10 w-10 p-0 border-2 border-gray-200 bg-white hover:bg-blue-50 
                                                    text-gray-700 hover:text-[#5283c5] hover:border-[#5283c5]
                                                    transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center shrink-0"
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
                    </div>
                </div>

                {/* Table */}
                <div className='p-4 sm:p-6'>
                    <AttendanceTable
                        records={filteredRecords}
                        handlePageChange={handlePageChange}
                        handlePerPageChange={handlePerPageChange}
                        pagination={pagination}
                        loading={isLoading}
                        getRecordForEdit={provideRecordForEdit} // Changed from getRecordForEdit to provideRecordForEdit
                        onDeleteRecord={confirmDelete} // Changed from handleDeleteClick to confirmDelete
                        // resetSortTrigger={refreshTrigger} // resetSortTrigger not provided in original context
                        isAdmin={isAdmin}
                    />
                </div>
            </Card>

            <CreateOrEditAttendanceForm
                setIsOpen={setIsFormDialogOpen}
                isOpen={isFormDialogOpen}
                type={formMode}
                editableRecord={recordToEdit}
                fetchRecords={() => {
                    const filters = buildFilters();
                    fetchAttendanceRecords(pagination.current_page, pagination.per_page, filters);
                }}
            />

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent className="w-[90%] sm:max-w-lg rounded-xl">
                    <AlertDialogHeader className="!text-left mb-4">
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this attendance record? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="!flex-row !justify-end gap-3">
                        <AlertDialogCancel
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="!mt-0"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeDelete}
                            className='bg-red-600 hover:bg-red-700'
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AttendanceTrackingList;

