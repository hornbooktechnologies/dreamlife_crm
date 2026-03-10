import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
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
import { Pencil, Trash2, Loader2, Gift, ChevronLeft, Calendar } from 'lucide-react';
import {
  HOLIDAY_TYPES,
  getHolidayTypeColor,
  parseHolidayDate,
  formatHolidayDate,
} from './constants';

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const HolidayDetailModal = ({
  isOpen,
  onOpenChange,
  holidays, // Array of holidays for the selected date
  onEdit,
  onDelete,
  isEditing,
  setIsEditing,
  submitting,
  hasFullAccess = true, // Default to true for backward compatibility
}) => {
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    type: 'national',
  });

  // Reset selected holiday when modal opens with new holidays
  useEffect(() => {
    if (holidays && holidays.length > 0) {
      if (holidays.length === 1) {
        setSelectedHoliday(holidays[0]);
      } else {
        setSelectedHoliday(null);
      }
    } else {
      setSelectedHoliday(null);
    }
    setIsEditing(false);
  }, [holidays, setIsEditing]);

  // Update form data when selected holiday changes
  useEffect(() => {
    if (selectedHoliday) {
      // Use parseHolidayDate to get correct local date from UTC
      const parsed = parseHolidayDate(selectedHoliday.date);
      setFormData({
        date: parsed.dateString,
        name: selectedHoliday.name || '',
        type: selectedHoliday.type || 'national',
      });
    }
  }, [selectedHoliday]);

  // Parse date for display using local timezone
  const getFormattedDate = (holiday) => {
    return formatHolidayDate(holiday?.date);
  };

  // Get gradient color for holiday type
  const getTypeGradient = (type) => {
    switch (type) {
      case 'national':
        return 'bg-gradient-to-br from-green-400 to-emerald-500';
      case 'religious':
        return 'bg-gradient-to-br from-purple-400 to-violet-500';
      case 'company':
        return 'bg-gradient-to-br from-pink-500 to-rose-600';
      case 'optional':
        return 'bg-gradient-to-br from-amber-400 to-orange-500';
      default:
        return 'bg-gradient-to-br from-green-400 to-emerald-500';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.name || !formData.type) return;
    onEdit(selectedHoliday.id, formData);
  };

  const handleClose = () => {
    setIsEditing(false);
    setSelectedHoliday(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setSelectedHoliday(null);
    }
  };

  if (!holidays || holidays.length === 0) return null;

  // Multiple holidays - show list to select
  if (holidays.length > 1 && !selectedHoliday) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-md max-w-[90%] rounded-xl'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <div className='p-2 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 rounded-lg'>
                <Gift className='w-4 h-4 text-white' />
              </div>
              Multiple Holidays
            </DialogTitle>
            <DialogDescription className='text-gray-500'>
              {holidays.length} holidays on {getFormattedDate(holidays[0])}
            </DialogDescription>
          </DialogHeader>
          <div className='py-4 space-y-3'>
            {holidays.map((holiday) => (
              <div
                key={holiday.id}
                onClick={() => setSelectedHoliday(holiday)}
                className='p-4 rounded-xl bg-gray-50 border border-gray-100 
                                         hover:shadow-md transition-all duration-200 cursor-pointer
                                         hover:border-blue-300'
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`p-2 rounded-lg ${getTypeGradient(
                      holiday.type,
                    )}`}
                  >
                    <Gift className='w-4 h-4 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-800'>
                      {holiday.name}
                    </h4>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getHolidayTypeColor(
                        holiday.type,
                      )}`}
                    >
                      {holiday.type?.charAt(0).toUpperCase() +
                        holiday.type?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Single holiday or selected holiday - show details/edit
  const holiday = selectedHoliday || holidays[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md max-w-[90%] rounded-xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-800 flex items-center gap-2'>
            {(holidays.length > 1 || isEditing) && (
              <button
                onClick={handleBack}
                className='p-1 hover:bg-gray-100 rounded-lg transition-colors mr-1'
              >
                <ChevronLeft className='w-5 h-5 text-gray-500' />
              </button>
            )}
            <div className={`p-2 rounded-lg ${getTypeGradient(holiday?.type)}`}>
              <Gift className='w-4 h-4 text-white' />
            </div>
            {isEditing ? 'Edit Holiday' : 'Holiday Details'}
          </DialogTitle>
          {!isEditing && (
            <DialogDescription className='text-gray-500'>
              {hasFullAccess
                ? 'View and manage holiday information'
                : 'View holiday information'}
            </DialogDescription>
          )}
        </DialogHeader>

        {isEditing ? (
          // Edit Mode
          <form onSubmit={handleSubmit}>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-name' className='text-gray-700'>
                  Holiday Name
                </Label>
                <Input
                  id='edit-name'
                  name='name'
                  placeholder='e.g., New Year'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className='text-gray-700'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-gray-700'>
                  Date
                </Label>
                <div className='relative group'>
                  <Input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    value={formatDateForDisplay(formData.date)}
                    readOnly
                    className="h-10 pr-10 border-2 border-gray-300 focus:border-[#5283c5] transition-all bg-white font-medium text-gray-700 focus-visible:ring-0 focus-visible:border-[#5283c5] w-full"
                  />
                  <Input
                    id='edit-date'
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleInputChange}
                    className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10'
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  />
                  <Calendar
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-20'
                    size={18}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-type' className='text-gray-700'>
                  Holiday Type
                </Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className='text-gray-700'>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    {HOLIDAY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={submitting}
                className='h-10 px-4 sm:px-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] 
                          text-white font-semibold gap-2
                          shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                          hover:-translate-y-0.5 transition-all duration-200
                          active:scale-95'
              >
                {submitting ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          // View Mode
          <>
            <div className='py-4 space-y-4'>
              <div className='p-4 rounded-xl bg-gray-50 border border-gray-100'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  {holiday?.name}
                </h3>
                <p className='text-sm text-gray-500 mb-3'>
                  {getFormattedDate(holiday)}
                </p>
                <span
                  className={`inline-block px-3 py-1.5 text-xs font-medium rounded-full ${getHolidayTypeColor(
                    holiday?.type,
                  )}`}
                >
                  {holiday?.type?.charAt(0).toUpperCase() +
                    holiday?.type?.slice(1)}{' '}
                  Holiday
                </span>
              </div>
            </div>
            <DialogFooter className='gap-2 sm:gap-2'>
              {/* Only show Edit and Delete buttons for Admin, Manager, and HR - Hidden for User role */}
              {hasFullAccess && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type='button'
                        variant='outline'
                        className='text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700'
                      >
                        <Trash2 className='w-4 h-4 mr-2' />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[90%] sm:max-w-lg rounded-xl">
                      <AlertDialogHeader className="!text-left mb-4">
                        <AlertDialogTitle>Delete Holiday?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{holiday?.name}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="!flex-row !justify-end gap-3">
                        <AlertDialogCancel className="!mt-0">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(holiday?.id)}
                          className='bg-red-600 hover:bg-red-700'
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    type='button'
                    onClick={() => setIsEditing(true)}
                    className='h-10 px-4 sm:px-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] 
                          text-white font-semibold gap-2
                          shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                          hover:-translate-y-0.5 transition-all duration-200
                          active:scale-95'
                  >
                    <Pencil className='w-4 h-4 mr-2' />
                    Edit
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HolidayDetailModal;
