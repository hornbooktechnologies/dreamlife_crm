import React, { useMemo } from 'react';
import ReusableDataTable from '../common/data-table/ReusableDataTable';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EllipsisVertical, Edit, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

// Helper to format date for display (DD-MM-YYYY)
const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

// Helper to format time (HH:MM)
// Helper to format time (HH:MM 12-hour format with AM/PM)
// Helper to format time (HH:MM 12-hour format with AM/PM)
const formatTime = (timeString) => {
    if (!timeString) return '-';

    // Check if it matches HH:MM or HH:MM:SS
    const parts = timeString.split(':');
    if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1];

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        return `${hours}:${minutes} ${ampm}`;
    }
    return timeString;
};

// Helper for type badges
const getTypeBadgeClass = (type) => {
    if (type === 'early') return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200';
    if (type === 'late') return 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200';
    if (type === 'going_late') return 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200';
    if (type === 'extra') return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
    return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
};

const getTypeLabel = (type) => {
    if (type === 'early') return 'Early Leave';
    if (type === 'late') return 'Late Arrival';
    if (type === 'going_late') return 'Overtime';
    if (type === 'extra') return 'Extra Day';
    return type || 'Regular';
};

// Helper to calculate duration (Late/Early)
const calculateDuration = (row) => {
    const { type, arrival_time, leave_time, duration } = row;

    // Prioritize manual duration if available
    if (duration > 0) {
        const h = Math.floor(duration / 60);
        const m = duration % 60;
        const timeStr = `${h > 0 ? h + 'h ' : ''}${m}m`;

        if (type === 'late') return `${timeStr} Late`;
        if (type === 'early') return `${timeStr} Early`;
        if (type === 'going_late') return `${timeStr} Overtime`;
        if (type === 'extra') return `${timeStr} Worked`;
        return timeStr;
    }

    // Fixed office hours
    const OFFICE_START = new Date();
    OFFICE_START.setHours(10, 0, 0, 0); // 10:00 AM

    const OFFICE_END = new Date();
    OFFICE_END.setHours(19, 0, 0, 0); // 7:00 PM

    const date = new Date();

    if (type === 'late' && arrival_time) {
        const [hours, minutes] = arrival_time.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);

        // Late Arrival: Arrival Time - 10:00
        const diffMs = date - OFFICE_START;
        if (diffMs > 0) {
            const diffMins = Math.floor(diffMs / 60000);
            const h = Math.floor(diffMins / 60);
            const m = diffMins % 60;
            return `${h > 0 ? h + 'h ' : ''}${m}m Late`;
        }
    } else if (type === 'early' && leave_time) {
        const [hours, minutes] = leave_time.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);

        // Early Departure: 19:00 - Leave Time
        const diffMs = OFFICE_END - date;
        if (diffMs > 0) {
            const diffMins = Math.floor(diffMs / 60000);
            const h = Math.floor(diffMins / 60);
            const m = diffMins % 60;
            return `${h > 0 ? h + 'h ' : ''}${m}m Early`;
        }
    } else if (type === 'going_late' && leave_time) {
        const [hours, minutes] = leave_time.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);

        // Overtime: Leave Time - 19:00
        const diffMs = date - OFFICE_END;
        if (diffMs > 0) {
            const diffMins = Math.floor(diffMs / 60000);
            const h = Math.floor(diffMins / 60);
            const m = diffMins % 60;
            return `${h > 0 ? h + 'h ' : ''}${m}m Late`;
        }
    } else if (type === 'extra' && arrival_time && leave_time) {
        // Calculate total hours worked
        const [h1, m1] = arrival_time.split(':').map(Number);
        const [h2, m2] = leave_time.split(':').map(Number);

        const start = new Date(date);
        start.setHours(h1, m1, 0, 0);

        const end = new Date(date);
        end.setHours(h2, m2, 0, 0);

        let diffMs = end - start;
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // Handle overnight

        const diffMins = Math.floor(diffMs / 60000);
        const h = Math.floor(diffMins / 60);
        const m = diffMins % 60;

        return `${h}h ${m}m Worked`;
    }
    return '-';
};

export default function AttendanceTable({
    records,
    handlePageChange,
    handlePerPageChange,
    pagination,
    loading,
    getRecordForEdit,
    onDeleteRecord,

    resetSortTrigger,
    isAdmin,
}) {
    const columns = useMemo(
        () => {
            const cols = [
                ...(isAdmin ? [{
                    field: 'first_name',
                    headerName: 'Employee',
                    width: '150px',
                    renderCell: (params) => (
                        <span className='font-medium text-slate-700'>
                            {params.row.first_name} {params.row.last_name}
                        </span>
                    ),
                }] : []),


                {
                    field: 'type',
                    headerName: 'Type',
                    width: '150px',
                    renderCell: ({ value }) => (
                        <Badge
                            variant="secondary"
                            className={`capitalize border shadow-none font-semibold ${getTypeBadgeClass(value)}`}
                        >
                            {getTypeLabel(value)}
                        </Badge>
                    ),
                },
                {
                    field: 'date',
                    headerName: 'Date',
                    width: '150px',
                    renderCell: ({ value }) => (
                        <span className='text-slate-600'>{formatDateForDisplay(value)}</span>
                    ),
                },
                {
                    field: 'arrival_time',
                    headerName: 'Arrival Time',
                    width: '120px',
                    renderCell: ({ row }) => {
                        return <span className='font-mono text-slate-600'>{formatTime(row.arrival_time)}</span>;
                    },
                },
                {
                    field: 'leave_time',
                    headerName: 'Leave Time',
                    width: '120px',
                    renderCell: ({ row }) => {
                        return <span className='font-mono text-slate-600'>{formatTime(row.leave_time)}</span>;
                    },
                },
                {
                    field: 'duration',
                    headerName: 'Duration',
                    width: '140px',
                    renderCell: ({ row }) => {
                        const duration = calculateDuration(row);
                        let colorClass = 'text-slate-600';
                        // Green for credits (Extra Work, Overtime)
                        if (row.type === 'extra' || row.type === 'going_late') {
                            colorClass = 'text-green-700 font-bold';
                        }
                        // Red for debits (Early Leave, Late Arrival)
                        else if (row.type === 'early' || row.type === 'late') {
                            colorClass = 'text-red-700 font-bold';
                        }

                        return (
                            <span className={`font-medium text-xs ${colorClass}`}>
                                {duration}
                            </span>
                        );
                    },
                },
                {
                    field: 'remark',
                    headerName: 'Remark',
                    renderCell: ({ value }) => (
                        <span className="text-slate-600 max-w-xs truncate block" title={value}>
                            {value || '-'}
                        </span>
                    ),
                },
                {
                    field: 'actions',
                    headerName: 'Actions',
                    width: '80px',
                    align: 'center',
                    sticky: 'right',
                    sortable: false,
                    cellClassName: 'pl-6 bg-white',
                    headerClassName: 'pl-6 bg-white',
                    renderCell: ({ row }) => {
                        return (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size='icon'
                                        variant='ghost'
                                        className='data-[state=open]:bg-muted h-8 w-8 p-0 hover:bg-slate-100 rounded-full transition-colors'
                                    >
                                        <EllipsisVertical className='h-4 w-4 text-slate-500 hover:text-slate-900' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align='end'
                                    className='w-fit min-w-auto p-2 space-y-1 bg-white border border-slate-200 shadow-lg rounded-xl'
                                >
                                    <DropdownMenuItem
                                        className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:bg-slate-100'
                                        onClick={() => getRecordForEdit(row.id)}
                                    >
                                        <Edit className='w-4 h-4 text-blue-500' />
                                        <span className='font-medium'>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:bg-red-50'
                                        onClick={() => onDeleteRecord(row.id)}
                                    >
                                        <Trash2 className='w-4 h-4' />
                                        <span className='font-medium'>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        );
                    },
                },
            ];

            // Filter out actions column if not admin
            return isAdmin ? cols : cols.filter(col => col.field !== 'actions');
        },
        [getRecordForEdit, onDeleteRecord, isAdmin]
    );

    return (
        <ReusableDataTable
            columns={columns}
            rows={records || []}
            loading={loading}
            checkboxSelection={false}
            pageSize={pagination?.per_page || 10}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
            emptyMessage='No attendance records found'
            pagination={pagination}
            resetSortTrigger={resetSortTrigger}
        />
    );
}
