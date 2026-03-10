import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const LeaveDetailModal = ({
  isOpen,
  onClose,
  leave,
  canApprove,
  onStatusChange,
  onCancelLeave,
  userRole,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [admin_remark, setAdminRemark] = useState('');

  // Sync selectedStatus with leave.status when modal opens or leave changes
  useEffect(() => {
    if (leave?.status) {
      setSelectedStatus(leave.status.toLowerCase());
      setAdminRemark('');
    }
  }, [leave?.status, leave?.id, isOpen]);

  if (!leave) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: 'bg-green-200 text-green-800',
      pending: 'bg-yellow-200 text-yellow-800',
      rejected: 'bg-red-200 text-red-800',
      cancelled: 'bg-gray-200 text-gray-800',
    };
    return (
      <Badge
        className={`capitalize ${statusConfig[status?.toLowerCase()] || 'bg-gray-200 text-gray-800'}`}
      >
        {status || 'N/A'}
      </Badge>
    );
  };

  const calculateDays = () => {
    // Use duration field from API if available
    if (leave.duration) {
      const days = parseFloat(leave.duration);

      // Show numeric value for all durations
      return days.toString();
    }
    return 'N/A';
  };

  // Get initials from name
  const getInitials = () => {
    const first = leave.first_name?.charAt(0) || '';
    const last = leave.last_name?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  const isPending = leave.status?.toLowerCase() === 'pending';
  const isCancelled = leave.status?.toLowerCase() === 'cancelled';
  const isEmployee = userRole === 'employee';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[550px] pt-10 [&>button]:p-2 sm:[&>button]:p-1'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <span>Leave Request Details</span>
            {getStatusBadge(leave.status)}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Employee Info Card */}
          {!isEmployee && (
            <div className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm'>
              {leave.user_image &&
                leave.user_image !== '0' &&
                leave.user_image !== 0 ? (
                <img
                  src={leave.user_image}
                  alt={`${leave.first_name} ${leave.last_name}`}
                  loading='eager'
                  className='w-16 h-16 rounded-full object-cover border-2 border-white shadow-md'
                />
              ) : (
                <div className='w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md'>
                  {getInitials()}
                </div>
              )}
              <div className='flex-1'>
                <h3 className='font-bold text-lg text-gray-900'>
                  {leave.first_name} {leave.last_name}
                </h3>
                <p className='text-sm text-gray-500 font-medium'>
                  {leave.email}
                </p>
                {/* <div className='flex items-center gap-2 mt-2'>
                  <span className='px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium border border-gray-200'>
                    Employee
                  </span>
                </div> */}
              </div>
            </div>
          )}

          {/* Request Activity Info */}
          <div className='flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm'>
            <div className='flex items-center gap-2 text-gray-600'>
              <Calendar className='w-4 h-4 text-blue-500' />
              <span>
                Requested on{' '}
                <span className='font-semibold text-gray-900'>
                  {formatDate(leave.created_at)}
                </span>
              </span>
            </div>
            {leave.approved_by_name && (
              <div className='flex items-center gap-2 text-gray-600'>
                <User className='w-4 h-4 text-purple-500' />
                <span>
                  {leave.status === 'approved' ? 'Approved' : 'Processed'} by{' '}
                  <span className='font-semibold text-gray-900 capitalize'>
                    {leave.approved_by_name}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Action Section for Admin/Manager */}
          {canApprove && !isCancelled && (
            <div className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl space-y-4'>
              <div className='flex items-center gap-2 pb-2 border-b border-blue-100'>
                <AlertCircle className='w-5 h-5 text-blue-600' />
                <span className='font-bold text-blue-900'>Admin Actions</span>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>
                  Status
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={(newStatus) => setSelectedStatus(newStatus)}
                >
                  <SelectTrigger
                    className={`w-full h-11 border-2 transition-all duration-200 ${selectedStatus === 'approved'
                      ? 'bg-white border-green-500 text-green-700 hover:border-green-600'
                      : selectedStatus === 'rejected'
                        ? 'bg-white border-red-500 text-red-700 hover:border-red-600'
                        : selectedStatus === 'pending'
                          ? 'bg-white border-yellow-500 text-yellow-700 hover:border-yellow-600'
                          : 'bg-white border-blue-200 hover:border-blue-400'
                      }`}
                  >
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    {isPending && (
                      <SelectItem
                        value='pending'
                        className='text-yellow-700 focus:bg-yellow-50 font-medium my-1'
                      >
                        <div className='flex items-center gap-2'>
                          <span className='w-2.5 h-2.5 rounded-full bg-yellow-500 ring-2 ring-yellow-100' />
                          Pending Review
                        </div>
                      </SelectItem>
                    )}
                    <SelectItem
                      value='approved'
                      className='text-green-700 focus:bg-green-50 font-medium my-1'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-100' />
                        Approve Request
                      </div>
                    </SelectItem>
                    <SelectItem
                      value='rejected'
                      className='text-red-700 focus:bg-red-50 font-medium my-1'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100' />
                        Reject Request
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>
                  Admin Remark
                </label>
                <Textarea
                  placeholder='Add a remark for your decision...'
                  value={admin_remark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  className='bg-white border-blue-200 focus:border-blue-400 min-h-[80px] text-sm'
                />
              </div>

              <Button
                onClick={() =>
                  onStatusChange?.(leave.id, selectedStatus, admin_remark)
                }
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 shadow-md hover:shadow-lg transition-all'

              >
                Update Status
              </Button>
            </div>
          )}

          {/* Leave Stats Grid */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors'>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5'>
                <Calendar className='w-3.5 h-3.5 text-blue-500' /> Start Date
              </p>
              <p className='text-gray-900 font-bold text-sm sm:text-base'>
                {formatDate(leave.start_date)}
              </p>
            </div>

            <div className='p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors'>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5'>
                <Calendar className='w-3.5 h-3.5 text-blue-500' /> End Date
              </p>
              <p className='text-gray-900 font-bold text-sm sm:text-base'>
                {formatDate(leave.end_date)}
              </p>
            </div>

            <div className='p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors'>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5'>
                <Clock className='w-3.5 h-3.5 text-purple-500' /> Duration
              </p>
              <p className='text-gray-900 font-bold text-sm sm:text-base'>
                {calculateDays()}
              </p>
            </div>

            <div className='p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors'>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5'>
                <FileText className='w-3.5 h-3.5 text-indigo-500' /> Leave Type
              </p>
              <p className='text-gray-900 font-bold text-sm sm:text-base capitalize'>
                {leave.leave_type || 'N/A'}
              </p>
            </div>
          </div>

          {/* Duration Detail explanation */}
          {(() => {
            const durationNum = parseFloat(leave.duration);
            const hasHalfDay = !isNaN(durationNum) && durationNum % 1 === 0.5;
            const isFullDay =
              !isNaN(durationNum) && durationNum % 1 === 0 && durationNum > 0;
            const isSingleDay =
              leave.start_date &&
              leave.end_date &&
              new Date(leave.start_date).toDateString() ===
              new Date(leave.end_date).toDateString();

            // Check for half-day type - could be in duration_type, half_day_type, or other field
            const halfDayType =
              leave.duration_type || leave.half_day_type || leave.duration;

            // Show message for both full-day and half-day leaves
            if (isFullDay || hasHalfDay) {
              return (
                <div className='p-3 bg-blue-50 rounded-xl border border-blue-100'>
                  <p className='text-xs text-blue-600 text-center font-medium'>
                    {isFullDay
                      ? // Full day leave message
                      isSingleDay
                        ? '✓ Full day leave'
                        : `✓ Full day leave for all ${durationNum} days`
                      : hasHalfDay
                        ? // Half day leave message
                        isSingleDay
                          ? // Single day - 0.5 days
                          halfDayType === 'first_half'
                            ? `✓ First Half (Morning) on ${formatDate(leave.start_date)}`
                            : halfDayType === 'second_half'
                              ? `✓ Second Half (Afternoon) on ${formatDate(leave.start_date)}`
                              : '✓ Half day leave'
                          : // Multi-day with half - 1.5, 2.5, etc.
                          halfDayType === 'first_half'
                            ? `✓ ${Math.floor(durationNum)} full day${Math.floor(durationNum) > 1 ? 's' : ''} first, then morning half on END DATE ${formatDate(leave.end_date)}`
                            : halfDayType === 'second_half'
                              ? `✓ Afternoon half on START DATE ${formatDate(leave.start_date)}, then ${Math.floor(durationNum)} full day${Math.floor(durationNum) > 1 ? 's' : ''}`
                              : `✓ ${Math.floor(durationNum)} full day${Math.floor(durationNum) > 1 ? 's' : ''} + half day (check with approver for which half)`
                        : null}
                  </p>
                </div>
              );
            }
            return null;
          })()}

          {/* Reason Section */}
          <div className='space-y-2'>
            <p className='text-sm font-semibold text-gray-900 flex items-center gap-2'>
              Reason for Leave
            </p>
            <div className='p-4 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm leading-relaxed shadow-sm'>
              {leave.reason || 'No specific reason provided for this request.'}
            </div>
          </div>

        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          {/* Show cancel for employee's own pending leaves */}
          {/* {isEmployee && isPending && onCancelLeave && (
            <Button
              variant='outline'
              className='text-red-600 border-red-200 hover:bg-red-50'
              onClick={() => {
                onCancelLeave(leave.id);
                onClose();
              }}
            >
              Cancel Request
            </Button>
          )} */}

          {/* Always show close button */}
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveDetailModal;
