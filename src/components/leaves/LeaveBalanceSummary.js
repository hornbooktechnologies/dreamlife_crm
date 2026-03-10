import React, { useEffect, useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { requestHandler } from '../../lib/utils/network-client';

const LeaveBalanceSummary = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [totalLeaveUsed, setTotalLeaveUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Generate year options (current year + 2 past years + 1 future year)
  const yearOptions = [];
  for (let i = currentYear + 1; i >= currentYear - 4; i--) {
    yearOptions.push(i.toString());
  }

  // Helper function to calculate days between two dates
  const calculateLeaveDays = (startDate, endDate, duration) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the number of days between start and end (inclusive)
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Adjust based on duration
    if (duration === 'full_day') {
      return daysDiff;
    } else if (duration === 'first_half') {
      if (daysDiff === 1) {
        return 0.5;
      }
      return 0.5 + (daysDiff - 1);
    } else if (duration === 'second_half') {
      if (daysDiff === 1) {
        return 0.5;
      }
      return daysDiff - 1 + 0.5;
    }

    return daysDiff;
  };

  // Fetch leave data and calculate total for selected year
  useEffect(() => {
    const fetchLeaveStats = async () => {
      setIsLoading(true);
      try {
        const response = await requestHandler('/leaves/my-leaves', {
          method: 'GET',
        });

        if (response.success && response.data) {
          const leaves = response.data;

          // Filter approved leaves for the selected year
          const approvedLeavesForYear = leaves.filter((leave) => {
            if (leave.status !== 'approved') return false;

            const leaveYear = new Date(leave.start_date).getFullYear();
            return leaveYear.toString() === selectedYear;
          });

          // Calculate total days for the selected year
          const totalUsed = approvedLeavesForYear.reduce((total, leave) => {
            const days = calculateLeaveDays(
              leave.start_date,
              leave.end_date,
              leave.duration,
            );
            return total + days;
          }, 0);

          setTotalLeaveUsed(totalUsed);
        }
      } catch (error) {
        console.error('Error fetching leave stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveStats();
  }, [selectedYear]);

  if (isLoading) {
    return (
      <div>
        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg animate-pulse'>
          <div className='h-24'></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl shadow-lg'>
        {/* Animated gradient background */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-80 group-hover:opacity-100 transition-opacity' />

        {/* Card content */}
        <div className='relative p-6'>
          <div className='flex items-center justify-between gap-4'>
            {/* Left side - Icon and stats */}
            <div className='flex items-center gap-4 flex-1'>
              {/* Icon */}
              <div className='flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300'>
                <CalendarCheck className='w-8 h-8 text-white' />
              </div>

              {/* Stats */}
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-600 mb-1'>
                  Total Leave Used
                </p>
                <div className='flex items-baseline gap-2'>
                  <p className='text-4xl font-bold text-gray-900'>
                    {Number(totalLeaveUsed).toFixed(1).replace(/\.0$/, '')}
                  </p>
                  <span className='text-lg text-gray-500 font-medium'>
                    {totalLeaveUsed === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Approved leaves in {selectedYear}
                </p>
              </div>
            </div>

            {/* Right side - Year selector */}
            <div className='flex-shrink-0'>
              <div className='flex flex-col items-end gap-1'>
                <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                  Year
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className='w-35 h-11 border-2 border-blue-200 bg-white hover:border-blue-400 focus:border-blue-500 transition-all shadow-sm font-semibold text-lg'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem
                        key={year}
                        value={year}
                        className='font-medium text-base'
                      >
                        {year}
                        {year === currentYear.toString() && (
                          <span className='ml-2 text-xs text-blue-600'>
                            (Current)
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 -mr-16 -mt-16' />
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-20 -ml-12 -mb-12' />
      </div>
    </div>
  );
};

export default LeaveBalanceSummary;
