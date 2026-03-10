import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Filter,
  RotateCcw,
  ArrowLeft,
  Pencil,
  Trash2,
} from 'lucide-react';
import useToast from '../../hooks/useToast';
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
import { requestHandler } from '../../lib/utils/network-client';
import { formatHolidayDate, getHolidayTypeColor } from './constants';
import { useAuthStore } from '../../context/AuthContext';
import HolidayDetailModal from './HolidayDetailModal';

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

const AllHolidays = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const { user } = useAuthStore();
  const userRole = user?.role || 'employee';
  const hasFullAccess = userRole !== 'employee' && userRole !== 'bde' && userRole !== 'Bde';

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  }, [currentYear]);

  // Fetch holidays
  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      // Add limit=1000 to fetch all holidays instead of paginated results
      const response = await requestHandler(
        `/holidays?year=${selectedYear}&limit=1000`,
        {
          method: 'GET',
        },
      );
      if (response.success && response.data) {
        // Handle new API response structure: response.data.data contains the array
        const holidaysData = response.data.data || response.data;
        setHolidays(Array.isArray(holidaysData) ? holidaysData : []);
      } else {
        setHolidays([]);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  // Filter holidays by date range
  const filteredHolidays = useMemo(() => {
    if (!Array.isArray(holidays) || holidays.length === 0) return [];
    if (!startDate && !endDate) return holidays;

    return holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return holidayDate >= start && holidayDate <= end;
      } else if (start) {
        return holidayDate >= start;
      } else if (end) {
        return holidayDate <= end;
      }
      return true;
    });
  }, [holidays, startDate, endDate]);

  // Group holidays by month
  const holidaysByMonth = useMemo(() => {
    if (!Array.isArray(filteredHolidays) || filteredHolidays.length === 0)
      return {};

    const grouped = {};
    filteredHolidays.forEach((holiday) => {
      const date = new Date(holiday.date);
      const monthYear = `${date.toLocaleString('en-US', {
        month: 'long',
      })} ${date.getFullYear()}`;
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(holiday);
    });

    // Sort holidays within each month by date
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return grouped;
  }, [filteredHolidays]);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleHolidayClick = (holiday) => {
    if (hasFullAccess) {
      setSelectedHolidays([holiday]);
      setIsEditing(false);
      setIsDetailModalOpen(true);
    }
  };

  // Handle Edit Holiday
  const handleEditHoliday = async (holidayId, updatedData) => {
    setSubmitting(true);
    try {
      const year = new Date(updatedData.date).getFullYear();
      const response = await requestHandler(`/holidays/${holidayId}`, {
        method: 'PUT',
        body: {
          date: updatedData.date,
          name: updatedData.name,
          type: updatedData.type,
          year: year,
        },
      });

      if (response.success) {
        showSuccessToast('Holiday updated successfully');
        setIsDetailModalOpen(false);
        setIsEditing(false);
        setSelectedHolidays([]);
        fetchHolidays();
      } else {
        showErrorToast(response.message || 'Failed to update holiday');
      }
    } catch (error) {
      console.error('Error updating holiday:', error);
      showErrorToast('An error occurred while updating the holiday');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Holiday
  const handleDeleteHoliday = async (holidayId) => {
    try {
      const response = await requestHandler(`/holidays/${holidayId}`, {
        method: 'DELETE',
      });
      if (response.success) {
        showSuccessToast('Holiday deleted successfully');
        setIsDetailModalOpen(false);
        setSelectedHolidays([]);
        fetchHolidays();
      } else {
        showErrorToast(response.message || 'Failed to delete holiday');
      }
    } catch (error) {
      console.error('Error deleting holiday:', error);
      showErrorToast('An error occurred while deleting the holiday');
    }
  };

  const isFiltered = startDate || endDate;

  return (
    <div className='p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 max-w-[1920px] mx-auto bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between gap-2 mb-2'>
        <div className='flex items-center gap-2 sm:gap-4 flex-1 min-w-0'>
          <Button
            onClick={() => navigate('/holiday')}
            variant='outline'
            className='p-1.5 sm:p-2 h-8 w-8 sm:h-10 sm:w-10'
          >
            <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
          </Button>
          <div className="min-w-0">
            <h1 className='text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent truncate'>
              All Holidays
            </h1>
            <p className='hidden sm:block text-sm sm:text-base text-gray-500 mt-1'>
              {isFiltered
                ? `${filteredHolidays.length} of ${holidays.length} holidays`
                : `${holidays.length} total holidays in ${selectedYear}`}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          {/* Year Selector */}
          <div className='flex items-center gap-2'>
            <Label className='hidden sm:inline text-sm font-semibold text-gray-700'>Year:</Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className='h-9 sm:h-10 px-2 sm:px-3'>
                <SelectValue>
                  {selectedYear}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                    {year === currentYear && ' (Current)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant='outline'
            className='h-9 sm:h-10 px-2 sm:px-3'
          >
            <Filter className='w-4 h-4 sm:mr-2' />
            <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Filter'}</span>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='h-px flex-1 bg-gray-200' />
            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Date Range Filter
            </span>
            <div className='h-px flex-1 bg-gray-200' />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='start-date' className='text-sm text-gray-700'>
                From Date
              </Label>
              <div className='relative'>
                <Input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={formatDateForDisplay(startDate)}
                  readOnly
                  className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-700 bg-white"
                />
                <Input
                  id='start-date'
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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
              <Label htmlFor='end-date' className='text-sm text-gray-700'>
                To Date
              </Label>
              <div className='relative'>
                <Input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={formatDateForDisplay(endDate)}
                  readOnly
                  className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-700 bg-white"
                />
                <Input
                  id='end-date'
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
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

          {isFiltered && (
            <div className='flex items-center justify-between pt-2'>
              <p className='text-sm text-gray-600'>
                Showing{' '}
                <span className='font-semibold text-blue-600'>
                  {filteredHolidays.length}
                </span>{' '}
                holidays
              </p>
              <Button
                onClick={handleClearFilters}
                variant='ghost'
                size='sm'
                className='text-gray-600 hover:text-red-600'
              >
                <RotateCcw className='w-3.5 h-3.5 mr-1.5' />
                Clear Filter
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Holidays List */}
      <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
        {loading ? (
          <div className='flex flex-col items-center justify-center py-16 text-gray-500'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className='text-lg font-medium'>Loading holidays...</p>
          </div>
        ) : filteredHolidays.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-gray-500'>
            <Calendar className='w-16 h-16 mb-4 opacity-30' />
            <p className='text-lg font-medium mb-1'>No holidays found</p>
            <p className='text-sm'>
              {isFiltered
                ? 'Try adjusting your date range filters'
                : `No holidays added for ${selectedYear}`}
            </p>
          </div>
        ) : (
          <div className='space-y-8'>
            {Object.entries(holidaysByMonth).map(
              ([monthYear, monthHolidays]) => (
                <div key={monthYear}>
                  <h3 className='text-xl font-bold bg-[#5283c5] bg-clip-text text-transparent mb-4 pb-3 border-b-2 border-blue-200'>
                    {monthYear}
                    <span className='ml-3 text-sm font-normal text-gray-500'>
                      ({monthHolidays.length}{' '}
                      {monthHolidays.length === 1 ? 'holiday' : 'holidays'})
                    </span>
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {monthHolidays.map((holiday) => {
                      const holidayDate = new Date(holiday.date);
                      const day = holidayDate.getDate();
                      const month = holidayDate.toLocaleString('en-US', {
                        month: 'short',
                      });

                      return (
                        <div
                          key={holiday.id}
                          className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 
                                     hover:shadow-2xl hover:scale-[1.03] hover:border-blue-300 transition-all duration-300 cursor-pointer'
                        >
                          {/* Decorative gradient overlay */}
                          <div
                            className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl 
                                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-16 -mt-16'
                          />

                          <div className='relative p-6 flex gap-4'>
                            {/* Date Badge */}
                            <div
                              className='flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 
                                           flex flex-col items-center justify-center text-white shadow-lg 
                                           group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300'
                            >
                              <span className='text-xs font-semibold uppercase tracking-wide'>
                                {month}
                              </span>
                              <span className='text-3xl font-bold leading-none mt-1'>
                                {day}
                              </span>
                            </div>

                            {/* Content */}
                            <div className='flex-1 min-w-0 space-y-3'>
                              {/* Title */}
                              <h4
                                className='font-bold text-lg text-gray-800 group-hover:text-blue-600 
                                             transition-colors duration-200 line-clamp-2 leading-tight'
                              >
                                {holiday.name}
                              </h4>

                              {/* Full Date */}
                              <p className='text-sm text-gray-600 font-medium'>
                                {formatHolidayDate(holiday.date)}
                              </p>

                              {/* Type Badge */}
                              <div className='flex items-center gap-2'>
                                <span
                                  className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full 
                                             shadow-sm ${getHolidayTypeColor(holiday.type)}`}
                                >
                                  <span className='w-1.5 h-1.5 rounded-full bg-current mr-1.5' />
                                  {holiday.type?.charAt(0).toUpperCase() +
                                    holiday.type?.slice(1)}{' '}
                                  Holiday
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons - Float on hover */}
                          {hasFullAccess && (
                            <div
                              className='absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 
                                           translate-y-2 group-hover:translate-y-0 transition-all duration-300'
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHolidayClick(holiday);
                                }}
                                className='p-2.5 bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-blue-600 hover:text-white 
                                          rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 
                                          hover:scale-110 border border-blue-200'
                                title='Edit Holiday'
                              >
                                <Pencil className='w-4 h-4' />
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    onClick={(e) => e.stopPropagation()}
                                    className='p-2.5 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-red-600 hover:text-white 
                                              rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 
                                              hover:scale-110 border border-red-200'
                                    title='Delete Holiday'
                                  >
                                    <Trash2 className='w-4 h-4' />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="w-[90%] sm:max-w-lg rounded-xl">
                                  <AlertDialogHeader className="!text-left mb-4">
                                    <AlertDialogTitle>
                                      Delete Holiday?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {holiday.name}"?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="!flex-row !justify-end gap-3">
                                    <AlertDialogCancel className="!mt-0">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteHoliday(holiday.id)
                                      }
                                      className='bg-red-600 hover:bg-red-700'
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}

                          {/* Bottom gradient accent */}
                          <div
                            className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                                         opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Holiday Detail Modal */}
      <HolidayDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        holidays={selectedHolidays}
        onEdit={handleEditHoliday}
        onDelete={handleDeleteHoliday}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        submitting={submitting}
        hasFullAccess={hasFullAccess}
      />
    </div>
  );
};

export default AllHolidays;
