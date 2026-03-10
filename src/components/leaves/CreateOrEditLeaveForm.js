import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { requestHandler } from '../../lib/utils/network-client';
import useToast from '../../hooks/useToast';
import { useAuthStore } from '../../context/AuthContext';

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

// Schema changes based on whether user can select employee
const getSchema = (canSelectEmployee) =>
  z.object({
    user_id: canSelectEmployee
      ? z.string().min(1, 'Employee is required')
      : z.string().optional(),
    leave_type: z.string().min(1, 'Leave type is required'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    reason: z.string().min(1, 'Reason is required'),
    duration: z.string().min(1, 'Duration is required'),
  });

const CreateOrEditLeaveForm = ({
  setIsOpen,
  isOpen,
  type,
  editableLeave,
  fetchLeaves,
}) => {
  const { showSuccessToast, showErrorToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const { user } = useAuthStore();

  // Admin and Manager can select any dates and approve leaves
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';
  // Admin, Manager, and HR can select employees for leave
  const canSelectEmployee =
    user?.role === 'admin' || user?.role === 'manager' || user?.role === 'hr';
  // Only employees are restricted from selecting past dates
  const canSelectPastDates = user?.role !== 'employee';

  // Get tomorrow's date in YYYY-MM-DD format for min attribute
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(getSchema(canSelectEmployee)),
    defaultValues: {
      user_id: '',
      leave_type: '',
      start_date: '',
      end_date: '',
      reason: '',
      duration: 'full_day',
    },
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');
  const duration = watch('duration');

  // Calculate days between dates, accounting for half-day selections
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const fullDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // If same day and half-day selected, return 0.5
      if (
        fullDays === 1 &&
        (duration === 'first_half' || duration === 'second_half')
      ) {
        return 0.5;
      }

      // If multiple days with half-day on start or end
      // first_half: half day on start date, full days rest
      // second_half: full days, half day on start date
      if (
        fullDays > 1 &&
        (duration === 'first_half' || duration === 'second_half')
      ) {
        return fullDays - 0.5;
      }

      return fullDays;
    }
    return 0;
  };

  // Format days for display
  const formatDays = (days) => {
    if (days === 0) return '0 Days';
    if (days === 0.5) return 'Half Day';
    if (days === 1) return '1 Day';
    if (days % 1 === 0.5) return `${days} Days`;
    return `${days} Days`;
  };

  // Fetch employees for dropdown (Only for Admin)
  useEffect(() => {
    const fetchEmployeesList = async () => {
      try {
        const response = await requestHandler('/employees', { method: 'GET' });
        if (response.success) {
          const data = response.data.data || response.data || [];
          setEmployees(data);
        }
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };

    if (isOpen && canSelectEmployee) {
      fetchEmployeesList();
    }
  }, [isOpen, canSelectEmployee]);

  useEffect(() => {
    if (type === 'edit' && editableLeave) {
      reset({
        user_id: editableLeave.user_id || editableLeave.employee_id || '',
        leave_type: editableLeave.leave_type,
        start_date: editableLeave.start_date
          ? editableLeave.start_date.split('T')[0]
          : '',
        end_date: editableLeave.end_date
          ? editableLeave.end_date.split('T')[0]
          : '',
        reason: editableLeave.reason,
        duration: editableLeave.duration_type || 'full_day',
      });
    } else {
      reset({
        user_id: '',
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: '',
        duration: 'full_day',
      });
    }
  }, [type, editableLeave, reset, isOpen, canSelectEmployee, user]);

  const [existingLeaves, setExistingLeaves] = useState([]);
  const selectedUserId = watch('user_id');

  // Fetch existing leaves to check for overlaps
  useEffect(() => {
    const fetchExistingLeaves = async () => {
      try {
        let response;
        if (canSelectEmployee && selectedUserId) {
          response = await requestHandler('/leaves/all', {
            method: 'GET',
            params: { limit: 1000 },
          });
          if (response.success) {
            const allLeaves =
              response.data.leaves || response.data.data || response.data || [];
            setExistingLeaves(
              allLeaves.filter((l) => l.user_id === selectedUserId),
            );
          }
        } else if (!canSelectEmployee) {
          response = await requestHandler('/leaves/my-leaves', {
            method: 'GET',
          });
          if (response.success) {
            const leaves =
              response.data.leaves || response.data.data || response.data || [];
            setExistingLeaves(Array.isArray(leaves) ? leaves : []);
          }
        }
      } catch (error) {
        console.error(
          'Failed to fetch existing leaves for overlap check',
          error,
        );
        setExistingLeaves([]);
      }
    };

    if (isOpen && (selectedUserId || !canSelectEmployee)) {
      fetchExistingLeaves();
    }
  }, [isOpen, canSelectEmployee, selectedUserId]);

  const onSubmit = async (data) => {
    try {
      const newStart = new Date(data.start_date);
      newStart.setHours(0, 0, 0, 0);
      const newEnd = new Date(data.end_date);
      newEnd.setHours(23, 59, 59, 999);

      const hasOverlap = existingLeaves.some((existing) => {
        if (type === 'edit' && existing.id === editableLeave?.id) return false;

        if (existing.status === 'cancelled' || existing.status === 'rejected') {
          return false;
        }

        const exStart = new Date(existing.start_date);
        exStart.setHours(0, 0, 0, 0);
        const exEnd = new Date(existing.end_date);
        exEnd.setHours(23, 59, 59, 999);

        return newStart <= exEnd && newEnd >= exStart;
      });

      if (hasOverlap) {
        showErrorToast(
          'You already have a leave request for these dates. Please choose different dates.',
        );
        return;
      }

      const days = calculateDays();

      let payload = {
        start_date: data.start_date,
        end_date: data.end_date,
        reason: data.reason,
        leave_type: data.leave_type,
        duration: data.duration,
      };

      if (canSelectEmployee && data.user_id) {
        payload.user_id = data.user_id;
      }

      const url =
        type === 'edit' ? `/leaves/${editableLeave.id}` : '/leaves/apply';
      const method = type === 'edit' ? 'PUT' : 'POST';

      const response = await requestHandler(url, {
        method,
        body: payload,
      });

      if (response.success) {
        showSuccessToast(
          response.message ||
          `Leave ${type === 'edit' ? 'updated' : 'created'} successfully`,
        );
        setIsOpen(false);
        fetchLeaves();
      } else {
        showErrorToast(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Something went wrong');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl flex flex-col text-left [&>button]:!text-white [&>button]:top-5 [&>button]:right-5 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button]:transition-all [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button>svg]:stroke-[3]'>
        {/* Header with Gradient */}
        <DialogHeader className='p-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shrink-0 !text-left'>
          <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
            {type === 'edit' ? 'Edit Leave Request' : 'New Leave Request'}
          </DialogTitle>
          <p className='text-blue-50 text-sm mt-1'>
            {type === 'edit'
              ? 'Update the information below to modify the leave request.'
              : 'Fill in the details below to submit a new leave request.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='flex-1 flex flex-col min-h-0'>
          {type === 'edit' && !editableLeave ? (
            <div className='flex-1 flex items-center justify-center p-12 min-h-[300px]'>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className='flex-1 overflow-y-auto p-6 space-y-5'>
                {/* Employee Dropdown - Only for Admin/Manager/HR when creating */}
                {canSelectEmployee && type === 'create' && (
                  <div className='space-y-2'>
                    <Label htmlFor='user_id' className='text-gray-700 font-semibold'>
                      Employee Name <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      control={control}
                      name='user_id'
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger className='h-10 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-[#3a5f9e] text-gray-900'>
                            <SelectValue placeholder='Select employee' />
                          </SelectTrigger>
                          <SelectContent maxHeight='200px'>
                            {employees.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.first_name} {emp.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.user_id && (
                      <p className='text-red-500 text-xs font-medium mt-1'>
                        {errors.user_id.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Leave Type */}
                <div className='space-y-2'>
                  <Label htmlFor='leave_type' className='text-gray-700 font-semibold'>
                    Leave Type <span className='text-red-500'>*</span>
                  </Label>
                  <Controller
                    control={control}
                    name='leave_type'
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger className='h-10 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-[#3a5f9e] text-gray-900'>
                          <SelectValue placeholder='Select leave type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='sick'>Sick Leave</SelectItem>
                          <SelectItem value='casual'>Casual Leave</SelectItem>
                          <SelectItem value='annual'>Annual Leave</SelectItem>
                          <SelectItem value='planned'>Planned Leave</SelectItem>
                          <SelectItem value='bereavement'>
                            Bereavement Leave
                          </SelectItem>
                          <SelectItem value='maternity'>Maternity Leave</SelectItem>
                          <SelectItem value='paternity'>Paternity Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.leave_type && (
                    <p className='text-red-500 text-xs font-medium mt-1'>
                      {errors.leave_type.message}
                    </p>
                  )}
                </div>

                {/* Date Fields in 2 columns */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='space-y-2'>
                    <Label
                      // htmlFor='start_date'
                      className='text-gray-700 font-semibold'
                    >
                      Start Date <span className='text-red-500'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        type="text"
                        placeholder="DD-MM-YYYY"
                        value={formatDateForDisplay(watch('start_date'))}
                        readOnly
                        className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                      />
                      <Input
                        id='start_date'
                        type='date'
                        {...register('start_date')}
                        min={canSelectPastDates ? undefined : tomorrow}
                        className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10'
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                      />
                      <Calendar
                        className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-20'
                      />
                    </div>
                    {errors.start_date && (
                      <p className='text-red-500 text-xs font-medium mt-1'>
                        {errors.start_date.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-gray-700 font-semibold'>
                      End Date <span className='text-red-500'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        type="text"
                        placeholder="DD-MM-YYYY"
                        value={formatDateForDisplay(watch('end_date'))}
                        readOnly
                        className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                      />
                      <Input
                        id='end_date'
                        type='date'
                        {...register('end_date')}
                        min={startDate || (canSelectPastDates ? undefined : tomorrow)}
                        className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10'
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                      />
                      <Calendar
                        className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-20'
                      />
                    </div>
                    {errors.end_date && (
                      <p className='text-red-500 text-xs font-medium mt-1'>
                        {errors.end_date.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className='space-y-2'>
                  <Label htmlFor='duration' className='text-gray-700 font-semibold'>
                    Duration <span className='text-red-500'>*</span>
                  </Label>
                  <Controller
                    control={control}
                    name='duration'
                    render={({ field }) => {
                      const isSingleDay =
                        startDate && endDate && startDate === endDate;
                      const isMultiDay =
                        startDate && endDate && startDate !== endDate;

                      return (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger className='h-10 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-[#3a5f9e] text-gray-900'>
                            <SelectValue placeholder='Select duration' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='full_day'>
                              Full Day{isMultiDay && ' (All selected days)'}
                            </SelectItem>
                            {(isSingleDay || isMultiDay) && (
                              <>
                                <SelectItem value='first_half'>
                                  First Half (Morning)
                                  {isMultiDay && ' - Half day on END date'}
                                </SelectItem>
                                <SelectItem value='second_half'>
                                  Second Half (Afternoon)
                                  {isMultiDay && ' - Half day on START date'}
                                </SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  {errors.duration && (
                    <p className='text-red-500 text-xs font-medium mt-1'>
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                {/* Leave Summary */}
                {startDate && endDate && (
                  <div className='p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200'>
                    <p className='text-sm text-blue-800 font-semibold mb-1'>
                      Total Leave:{' '}
                      <span className='text-blue-900'>
                        {formatDays(calculateDays())}
                      </span>
                    </p>
                    <p className='text-xs text-blue-700 font-medium'>
                      {duration === 'full_day'
                        ? startDate === endDate
                          ? '✓ Full day leave'
                          : `✓ Full day leave for all ${calculateDays()} days`
                        : duration === 'first_half' || duration === 'second_half'
                          ? startDate === endDate
                            ? duration === 'first_half'
                              ? `✓ First Half (Morning) on ${new Date(startDate).toLocaleDateString('en-GB')}`
                              : `✓ Second Half (Afternoon) on ${new Date(startDate).toLocaleDateString('en-GB')}`
                            : duration === 'first_half'
                              ? `✓ ${Math.floor(calculateDays())} full day${Math.floor(calculateDays()) > 1 ? 's' : ''} first, then morning half on END DATE ${new Date(endDate).toLocaleDateString('en-GB')}`
                              : `✓ Afternoon half on START DATE ${new Date(startDate).toLocaleDateString('en-GB')}, then ${Math.floor(calculateDays())} full day${Math.floor(calculateDays()) > 1 ? 's' : ''}`
                          : null}
                    </p>
                  </div>
                )}

                {/* Reason */}
                <div className='space-y-2'>
                  <Label htmlFor='reason' className='text-gray-700 font-semibold'>
                    Reason <span className='text-red-500'>*</span>
                  </Label>
                  <Textarea
                    id='reason'
                    placeholder='Please provide a reason for your leave request...'
                    rows={4}
                    className='border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400 resize-none'
                    {...register('reason')}
                  />
                  {errors.reason && (
                    <p className='text-red-500 text-xs font-medium mt-1'>
                      {errors.reason.message}
                    </p>
                  )}
                </div>


              </div>

              <DialogFooter className='p-6 border-t bg-gray-50/50 mt-auto gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white hover:opacity-90 transition-opacity'
                >
                  {isSubmitting
                    ? 'Processing...'
                    : type === 'edit'
                      ? 'Save Changes'
                      : 'Submit Request'}
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrEditLeaveForm;
