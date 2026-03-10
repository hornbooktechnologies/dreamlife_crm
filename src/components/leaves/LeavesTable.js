import React, { useMemo } from 'react';
import ReusableDataTable from '../common/data-table/ReusableDataTable';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EllipsisVertical, Eye, Edit, XCircle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import emptyStateImage from '../../assets/images/leave_empty_state.png';

export default function LeavesTable({
  leaves,
  setFormMode,
  setIsCreateEditLeaveDialogOpen,
  getLeaveForEdit,
  handlePageChange,
  handlePerPageChange,
  onRowClick,
  pagination,
  loading,
  onStatusChange,
  onCancelLeave,
  onDeleteLeave,
  isAdmin,
  userRole,
  statusFilter,
  setStatusFilter,
  resetSortTrigger,
}) {
  // Check if current user is an employee (hide employee name column)
  const isEmployee = userRole === 'employee' || userRole === 'bde' || userRole === 'Bde' || userRole === 'BDE';
  // Only Admin and Manager can approve/reject leaves
  const canApprove = userRole === 'admin' || userRole === 'manager';

  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <Badge
            variant='secondary'
            className='capitalize bg-green-200 text-green-800'
          >
            {status}
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant='secondary'
            className='capitalize bg-yellow-200 text-yellow-800'
          >
            {status}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant='secondary'
            className='capitalize bg-red-200 text-red-800'
          >
            {status}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge
            variant='secondary'
            className='capitalize bg-gray-200 text-gray-800'
          >
            {status}
          </Badge>
        );
      default:
        return <span className='capitalize'>{status || 'N/A'}</span>;
    }
  };

  const columns = useMemo(
    () => [
      // {
      //   field: 'index',
      //   headerName: 'Sr. No',
      //   width: '60px',
      //   sortable: false,
      //   renderCell: (params) => {
      //     const index = leaves.findIndex((l) => l.id === params.row.id);
      //     return (
      //       (pagination?.current_page - 1) * (pagination?.per_page || 10) +
      //       index +
      //       1
      //     );
      //   },
      // },
      // Only show Employee Name column if user is not an employee
      ...(!isEmployee
        ? [
          {
            field: 'first_name',
            headerName: 'Employee Name',
            width: '180px',
            sortable: true,
            renderCell: ({ row }) => (
              <div className='flex flex-col'>
                <span className='font-medium capitalize'>
                  {row.first_name} {row.last_name}
                </span>
              </div>
            ),
          },
        ]
        : []),
      {
        field: 'status',
        headerName: 'Status',
        width: '110px',
        sortable: true,
        renderCell: ({ value }) => renderStatusBadge(value),
      },
      //   {
      //     field: 'email',
      //     headerName: 'Email',
      //     width: '220px',
      //     renderCell: ({ value }) => (
      //       <span className='text-slate-600'>{value || 'N/A'}</span>
      //     ),
      //   },
      {
        field: 'start_date',
        headerName: 'Start Date',
        width: '120px',
        renderCell: ({ value }) => (
          <span className='text-slate-600'>
            {value ? new Date(value).toLocaleDateString('en-GB') : 'N/A'}
          </span>
        ),
      },
      {
        field: 'end_date',
        headerName: 'End Date',
        width: '120px',
        renderCell: ({ value }) => (
          <span className='text-slate-600'>
            {value ? new Date(value).toLocaleDateString('en-GB') : 'N/A'}
          </span>
        ),
      },
      {
        field: 'duration',
        headerName: 'Days',
        width: '100px',
        sortable: true,
        renderCell: ({ row }) => {
          // Use duration field from API if available
          if (row.duration) {
            const days = parseFloat(row.duration);

            // Show numeric value for all durations
            const displayText = days.toString();

            return (
              <span className='text-slate-900 font-semibold'>
                {displayText}
              </span>
            );
          }
          return <span className='text-slate-400'>N/A</span>;
        },
      },
      {
        field: 'created_at',
        headerName: 'Requested Date',
        width: '130px',
        renderCell: ({ value }) => (
          <span className='text-slate-600'>
            {value ? new Date(value).toLocaleDateString('en-GB') : 'N/A'}
          </span>
        ),
      },
      {
        field: 'reason',
        headerName: 'Reason',
        width: '250px',
        renderCell: ({ value }) => (
          <span
            title={value}
            className='text-slate-600 truncate block max-w-xs'
          >
            {value || 'N/A'}
          </span>
        ),
      },

      // Actions column with 3-dots dropdown - Fixed/Sticky on right
      // ...(!isEmployee
      //   ? [
      {
        field: 'actions',
        headerName: 'Actions',
        width: '80px',
        sortable: false,
        align: 'center',
        sticky: 'right',
        cellClassName: 'pl-6 bg-white',
        headerClassName: 'pl-6 bg-white',
        renderCell: ({ row }) => {
          const isPending = row.status?.toLowerCase() === 'pending';
          const isCancelled = row.status?.toLowerCase() === 'cancelled';
          const isApproved = row.status?.toLowerCase() === 'approved';

          // Check if leave end date has passed (entire leave period is over)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const leaveEndDate = row.end_date ? new Date(row.end_date) : null;
          // Leave is expired if end date has passed (leave period is completely over)
          const isLeaveExpired = leaveEndDate && leaveEndDate < today;

          // Check if leave start date is at least 36 hours from now (for employees)
          const leaveStartDate = row.start_date
            ? new Date(row.start_date)
            : null;
          const now = new Date();
          const hours36 = 36 * 60 * 60 * 1000;
          const is36HoursBefore =
            leaveStartDate && leaveStartDate - now >= hours36;

          const isHr = userRole === 'hr';

          // Employees can only edit pending leaves 36 hours before start date
          // Admin/Manager can edit any non-cancelled leave
          // HR cannot edit
          const canEdit =
            !isHr &&
            (canApprove
              ? !isCancelled
              : isPending && is36HoursBefore);

          // Employees can only cancel pending leaves 36 hours before start date
          // HR cannot cancel
          const canCancel =
            !isHr && isPending && (canApprove || is36HoursBefore);

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size='icon'
                  variant='ghost'
                  className='data-[state=open]:bg-muted h-8 w-8 p-0 hover:bg-slate-100 rounded-full transition-colors'
                  onClick={(e) => e.stopPropagation()}
                >
                  <EllipsisVertical className='h-4 w-4 text-slate-500 hover:text-slate-900' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-fit min-w-auto p-2 space-y-1 bg-white border border-slate-200 shadow-lg rounded-xl'
              >
                {/* View Option - Always visible */}
                <DropdownMenuItem
                  className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:bg-slate-100'
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick?.(row);
                  }}
                >
                  <Eye className='w-4 h-4 text-green-500' />
                  <span className='font-medium'>View</span>
                </DropdownMenuItem>

                {/* Edit Option - Visible for pending (employee) or non-cancelled (admin/manager) */}
                {canEdit && (
                  <DropdownMenuItem
                    className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:bg-slate-100'
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormMode?.('edit');
                      setIsCreateEditLeaveDialogOpen?.(true);
                      getLeaveForEdit?.(row.id);
                    }}
                  >
                    <Edit className='w-4 h-4 text-blue-500' />
                    <span className='font-medium'>Edit</span>
                  </DropdownMenuItem>
                )}

                {/* Cancel Option - Only for pending leaves */}
                {canCancel && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:bg-red-50'
                        onSelect={(e) => e.preventDefault()}
                      >
                        <XCircle className='w-4 h-4' />
                        <span className='font-medium'>Cancel</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='w-[90%] sm:max-w-lg rounded-xl'>
                      <AlertDialogHeader className='!text-left mb-4'>
                        <AlertDialogTitle>
                          Cancel Leave Request?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this leave request?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className='!flex-row !justify-end gap-3'>
                        <AlertDialogCancel className='!mt-0'>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (onCancelLeave) {
                              onCancelLeave(row.id);
                            }
                          }}
                          className='bg-red-600 hover:bg-red-700'
                        >
                          Confirm Cancellation
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* Delete Option - Only for Admin and Manager */}
                {canApprove && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:bg-red-50'
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash2 className='w-4 h-4' />
                        <span className='font-medium'>Delete</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='w-[90%] sm:max-w-lg rounded-xl'>
                      <AlertDialogHeader className='!text-left mb-4'>
                        <AlertDialogTitle>
                          Delete Leave Request?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this leave request?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className='!flex-row !justify-end gap-3'>
                        <AlertDialogCancel className='!mt-0'>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (onDeleteLeave) {
                              onDeleteLeave(row.id);
                            }
                          }}
                          className='bg-red-600 hover:bg-red-700'
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [
      pagination,
      leaves,
      isEmployee,
      canApprove,
      onCancelLeave,
      onDeleteLeave,
      onRowClick,
      setFormMode,
      setIsCreateEditLeaveDialogOpen,
      getLeaveForEdit,
      statusFilter,
      setStatusFilter,
    ],
  );

  return (
    <>
      <ReusableDataTable
        columns={columns}
        rows={leaves || []}
        loading={loading}
        checkboxSelection={false}
        pageSize={10}
        handlePageChange={handlePageChange}
        handlePerPageChange={handlePerPageChange}
        emptyMessage={
          <div className='flex flex-col items-center justify-center py-12 px-4'>
            <img
              src={emptyStateImage}
              alt='No leaves found'
              loading='eager'
              draggable={false}
              className='w-64 h-64 object-contain mb-4'
            />
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No Leave Records Found
            </h3>
            <p className='text-gray-500 text-center max-w-md'>
              {leaves?.length === 0
                ? "You haven't requested any leaves yet. Click 'Add Leave' to create your first request!"
                : 'Try adjusting your filters to see more results'}
            </p>
          </div>
        }
        onRowClick={onRowClick}
        pagination={pagination}
        resetSortTrigger={resetSortTrigger}
      />
    </>
  );
}
