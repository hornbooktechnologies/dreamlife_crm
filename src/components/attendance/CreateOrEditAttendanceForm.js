import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

import { requestHandler } from '../../lib/utils/network-client';
import useToast from '../../hooks/useToast';

// Helper to format date for input (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

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

// Helper to format time for display (12-hour AM/PM)
const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours, 10);
    const m = minutes;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
};

// Validation schema
const attendanceSchema = z.object({
    employee_id: z.string().min(1, 'Please select an employee'),
    type: z.string().refine((val) => ['early', 'late', 'going_late', 'extra'].includes(val), {
        message: "Please select a type",
    }),
    date: z.string().min(1, 'Please select a date'),
    arrival_time: z.string().optional(),
    leave_time: z.string().optional(),
    duration_hours: z.string().min(1, 'Duration hours are required'),
    duration_minutes: z.string().optional(),
    remark: z.string().optional(),
}).superRefine((data, ctx) => {
    // Arrival Time validation (Late or Extra)
    if ((data.type === 'late' || data.type === 'extra') && !data.arrival_time) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: data.type === 'late' ? "Arrival time is required for Late Arrival" : "Arrival time is required",
            path: ["arrival_time"],
        });
    }

    // Leave Time validation (Early, Going Late/Overtime, or Extra)
    if ((data.type === 'early' || data.type === 'going_late' || data.type === 'extra') && !data.leave_time) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Leave time is required",
            path: ["leave_time"],
        });
    }
});

const CreateOrEditAttendanceForm = ({
    isOpen,
    setIsOpen,
    type,
    editableRecord,
    fetchRecords,
}) => {
    const { showSuccessToast, showErrorToast } = useToast();
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {
            employee_id: '',
            type: '',
            date: '',
            arrival_time: '',
            leave_time: '',
            duration_hours: '',
            duration_minutes: '',
            remark: '',
        },
    });

    // Fetch employees for dropdown
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoadingEmployees(true);
            try {
                const response = await requestHandler('/employees', {
                    method: 'GET',
                    params: { limit: 100 },
                });

                if (response.success) {
                    const employeeData = response.data?.data || response.data || [];
                    setEmployees(employeeData);
                } else {
                    showErrorToast('Failed to fetch employees');
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
                showErrorToast('Error loading employees');
            } finally {
                setLoadingEmployees(false);
            }
        };

        if (isOpen) {
            fetchEmployees();
        }
    }, [isOpen]);

    // Populate form when editing
    useEffect(() => {
        if (type === 'edit' && editableRecord) {
            let empIdValue = editableRecord.employee_id?.toString() || '';

            // Double-check if the employee_id in record matches a tag_id and find the UUID
            if (employees.length > 0 && empIdValue) {
                const found = employees.find(e =>
                    e.id.toString() === empIdValue ||
                    e.employee_tag_id?.toString() === empIdValue
                );
                if (found) {
                    empIdValue = found.id.toString();
                }
            }

            reset({
                employee_id: empIdValue,
                type: editableRecord.type || 'early',
                date: formatDateForInput(editableRecord.date) || '',
                arrival_time: editableRecord.arrival_time || '',
                leave_time: editableRecord.leave_time || '',
                duration_hours: editableRecord.duration ? Math.floor(editableRecord.duration / 60).toString() : '',
                duration_minutes: editableRecord.duration ? (editableRecord.duration % 60).toString() : '',
                remark: editableRecord.remark || '',
            });
        } else if (type === 'create') {
            reset({
                employee_id: '',
                type: '',
                date: '',
                arrival_time: '',
                leave_time: '',
                duration_hours: '',
                duration_minutes: '',
                remark: '',
            });
        }
    }, [type, editableRecord, reset, isOpen, employees]);

    // Watch type to conditionally hide time field
    const selectedType = watch('type');

    // Auto-fill time for 'extra' so validation passes if hidden, or handle in refine
    // Auto-fill time for 'extra' removed to allow manual input

    const onSubmit = async (data) => {
        // Calculate duration in minutes
        const hours = parseInt(data.duration_hours || '0', 10);
        const minutes = parseInt(data.duration_minutes || '0', 10);
        const totalDuration = (hours * 60) + minutes;

        // Prepare payload
        const payload = {
            ...data,
            duration: totalDuration > 0 ? totalDuration : 0,
        };
        // Remove temporary fields
        delete payload.duration_hours;
        delete payload.duration_minutes;

        try {
            let response;

            if (type === 'edit' && editableRecord?.id) {
                // Update existing record
                response = await requestHandler(
                    `/attendance-tracking/${editableRecord.id}`,
                    {
                        method: 'PUT',
                        body: payload,
                    },
                );
            } else {
                // Create new record
                response = await requestHandler('/attendance-tracking', {
                    method: 'POST',
                    body: payload,
                });
            }

            if (response.success) {
                showSuccessToast(
                    response.message ||
                    `Attendance record ${type === 'edit' ? 'updated' : 'created'} successfully`,
                );
                setIsOpen(false);
                fetchRecords();
            } else {
                showErrorToast(
                    response.message ||
                    `Failed to ${type === 'edit' ? 'update' : 'create'} attendance record`,
                );
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorToast('An error occurred while submitting the form');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl flex flex-col text-left [&>button]:!text-white [&>button]:top-5 [&>button]:right-5 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button]:transition-all [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button>svg]:stroke-[3]">
                {/* Header with Gradient */}
                <DialogHeader className="p-6 bg-gradient-to-r from-primary via-primary-hover to-primary text-white shrink-0 !text-left">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {type === 'edit' ? 'Edit Attendance Record' : 'New Attendance Record'}
                    </DialogTitle>
                    <p className="text-blue-50 text-sm mt-1">
                        {type === 'edit'
                            ? 'Update the information below to modify the attendance record.'
                            : 'Fill in the details below to create a new attendance record.'}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                    {type === 'edit' && !editableRecord ? (
                        <div className="flex-1 flex items-center justify-center p-12 min-h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                {/* Employee Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="employee_id" className="text-gray-700 font-semibold">
                                        Employee Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="employee_id"
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ""}
                                            >
                                                <SelectTrigger className="h-10 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-[#3a5f9e] text-gray-900">
                                                    <SelectValue placeholder={loadingEmployees ? "Loading..." : "Select employee"} />
                                                </SelectTrigger>
                                                <SelectContent maxHeight="200px">
                                                    {loadingEmployees ? (
                                                        <div className="p-3 text-sm text-gray-500 text-center">Loading employees...</div>
                                                    ) : employees.length > 0 ? (
                                                        employees.map((emp) => (
                                                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                                                {emp.first_name} {emp.last_name}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="p-3 text-sm text-gray-500 text-center">No employees found</div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.employee_id && (
                                        <p className="text-red-500 text-xs font-medium mt-1">
                                            {errors.employee_id.message}
                                        </p>
                                    )}
                                </div>

                                {/* Type Selection - Radio Buttons */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-semibold">
                                        Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="type"
                                        render={({ field }) => (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {[
                                                    { value: 'early', label: 'Early Leave' },
                                                    { value: 'late', label: 'Late Arrival' },
                                                    { value: 'going_late', label: 'Overtime' },
                                                    { value: 'extra', label: 'Extra Day' },
                                                ].map((option) => (
                                                    <label
                                                        key={option.value}
                                                        className={`flex items-center space-x-3 border p-3 rounded-lg cursor-pointer transition-all ${field.value === option.value
                                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                            : 'border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            value={option.value}
                                                            checked={field.value === option.value}
                                                            onChange={(e) => {
                                                                const newType = e.target.value;
                                                                field.onChange(newType);
                                                                clearErrors(['arrival_time', 'leave_time']);

                                                                // Auto-fill logic based on type
                                                                if (newType === 'early') {
                                                                    setValue('arrival_time', '10:00');
                                                                    setValue('leave_time', '');
                                                                } else if (newType === 'late') {
                                                                    setValue('arrival_time', '');
                                                                    setValue('leave_time', '19:00');
                                                                } else if (newType === 'going_late') {
                                                                    setValue('arrival_time', '10:00');
                                                                    setValue('leave_time', '');
                                                                } else if (newType === 'extra') {
                                                                    setValue('arrival_time', '');
                                                                    setValue('leave_time', '');
                                                                }
                                                            }}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <span className="font-medium text-gray-900">
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    />
                                    {errors.type && (
                                        <p className="text-red-500 text-xs font-medium mt-1">
                                            {errors.type.message}
                                        </p>
                                    )}
                                </div>

                                {/* Date and Time Fields */}
                                <div className="space-y-5">
                                    {/* Date Selection - Full Width */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-semibold">
                                            Date <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                placeholder="DD-MM-YYYY"
                                                value={formatDateForDisplay(watch('date'))}
                                                readOnly
                                                className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                                            />
                                            <Input
                                                id="date"
                                                type="date"
                                                {...register('date')}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                onClick={(e) => {
                                                    try {
                                                        if (e.target.showPicker) e.target.showPicker();
                                                    } catch (err) { }
                                                }}
                                            />
                                            <Calendar
                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-20"
                                            />
                                        </div>
                                        {errors.date && (
                                            <p className="text-red-500 text-xs font-medium mt-1">
                                                {errors.date.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Time Fields - Single Row on Desktop, Stacked on Mobile */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                        {/* Arrival Time */}
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-semibold">
                                                Arrival Time
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="HH:MM"
                                                    value={watch('arrival_time')}
                                                    readOnly
                                                    className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                                                />
                                                <Input
                                                    id="arrival_time"
                                                    type="time"
                                                    {...register('arrival_time')}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                    onClick={(e) => {
                                                        try {
                                                            if (e.target.showPicker) e.target.showPicker();
                                                        } catch (err) { }
                                                    }}
                                                />
                                                <Clock
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-20"
                                                />
                                            </div>
                                            {errors.arrival_time && (
                                                <p className="text-red-500 text-xs font-medium mt-1">
                                                    {errors.arrival_time.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Leave Time */}
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-semibold">
                                                Leave Time
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="HH:MM"
                                                    value={watch('leave_time')}
                                                    readOnly
                                                    className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                                                />
                                                <Input
                                                    id="leave_time"
                                                    type="time"
                                                    {...register('leave_time')}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                    onClick={(e) => {
                                                        try {
                                                            if (e.target.showPicker) e.target.showPicker();
                                                        } catch (err) { }
                                                    }}
                                                />
                                                <Clock
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-20"
                                                />
                                            </div>
                                            {errors.leave_time && (
                                                <p className="text-red-500 text-xs font-medium mt-1">
                                                    {errors.leave_time.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Manual Duration */}
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-semibold">
                                        Manual Duration <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="Hours"
                                                {...register('duration_hours')}
                                                className="h-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">h</span>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="59"
                                                placeholder="Minutes"
                                                {...register('duration_minutes')}
                                                className="h-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">m</span>
                                        </div>
                                    </div>
                                    {errors.duration_hours && (
                                        <p className="text-red-500 text-xs font-medium mt-1">
                                            {errors.duration_hours.message}
                                        </p>
                                    )}
                                </div>

                                {/* Remark */}
                                <div className="space-y-2">
                                    <Label htmlFor="remark" className="text-gray-700 font-semibold">
                                        Remark
                                    </Label>
                                    <Textarea
                                        id="remark"
                                        placeholder="Enter any additional remarks..."
                                        rows={4}
                                        className="border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400 resize-none"
                                        {...register('remark')}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="p-6 border-t bg-gray-50/50 mt-auto gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-primary via-primary-hover to-primary text-white hover:opacity-90 transition-opacity"
                                >
                                    {isSubmitting
                                        ? 'Processing...'
                                        : type === 'edit'
                                            ? 'Update'
                                            : 'Submit'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateOrEditAttendanceForm;

