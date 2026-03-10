import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Loader2,
  Sparkles,
  List,
  CalendarCheck,
} from 'lucide-react';
import CalendarDay from './CalendarDay';
import { MONTH_NAMES, DAY_NAMES } from './constants';
import { Button } from '../ui/button';

const HolidayCalendar = ({
  currentMonth,
  currentYear,
  calendarDays,
  loading,
  onPreviousMonth,
  onNextMonth,
  onGoToCurrentMonth,
  onHolidayClick,
  onViewAllClick,
  totalHolidays,
}) => {
  return (
    <Card className='overflow-hidden border-none shadow-none'>
      {/* Responsive Header */}
      <CardHeader className='pb-3 sm:pb-4 px-3 sm:px-6 bg-gray-100'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='relative p-2 sm:p-3 bg-gradient-to-br from-[#5283c5] to-[#6fa8dc] rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/30'>
              <CalendarIcon className='w-5 h-5 sm:w-7 sm:h-7 text-white' />
              <Sparkles className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 animate-pulse' />
            </div>
            <div className='flex-1'>
              <h2 className='text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                Holiday Calendar
              </h2>
              <p className='text-xs sm:text-sm text-gray-500 mt-0.5'>
                Plan your time off • View all holidays
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <Button
              onClick={onViewAllClick}
              variant="outline"
              className="h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm border-2 border-gray-200 bg-white hover:bg-blue-50 
                            text-gray-700 hover:text-[#5283c5] hover:border-[#5283c5]
                            transition-all duration-200 font-medium gap-2 shadow-sm hover:shadow-md"
            >
              <List className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
              <span className='hidden sm:inline'>View All</span>
              <span className='sm:hidden'>All</span>
              {totalHolidays > 0 && (
                <span className='ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-[#5283c5] text-white'>
                  {totalHolidays}
                </span>
              )}
            </Button>
            <Button
              onClick={onGoToCurrentMonth}
              className='h-8 sm:h-10 px-3 sm:px-6 text-xs sm:text-sm bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] 
                            text-white font-semibold gap-2
                            shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                            hover:-translate-y-0.5 transition-all duration-200
                            active:scale-95'
            >
              <CalendarCheck className='w-4 h-4 sm:w-5 sm:h-5' />
              <span>Today</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-4 sm:pt-6 px-3 sm:px-6 pb-6 sm:pb-8'>
        {/* Responsive Month Navigation */}
        <div className='flex items-center justify-between mb-6 sm:mb-8'>
          <button
            onClick={onPreviousMonth}
            className='p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white hover:bg-gray-50 
                     shadow-md hover:shadow-lg transition-all duration-200 group border border-gray-200
                     hover:scale-110 active:scale-95'
          >
            <ChevronLeft className='w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors' />
          </button>

          <div className='text-center'>
            <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent pb-2'>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <div className='h-0.5 sm:h-1 w-16 sm:w-24 mx-auto mt-1.5 sm:mt-2 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] rounded-full' />
          </div>

          <button
            onClick={onNextMonth}
            className='p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white hover:bg-gray-50 
                     shadow-md hover:shadow-lg transition-all duration-200 group border border-gray-200
                     hover:scale-110 active:scale-95'
          >
            <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors' />
          </button>
        </div>

        {/* Responsive Day Headers */}
        <div className='grid grid-cols-7 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4'>
          {DAY_NAMES.map((day, index) => (
            <div
              key={day}
              className={`text-center py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all duration-200
                ${index === 0
                  ? 'text-red-600 bg-red-50 border border-red-200'
                  : ''
                }
                ${index === 6
                  ? 'text-orange-600 bg-orange-50 border border-orange-200'
                  : ''
                }
                ${index !== 0 && index !== 6
                  ? 'text-gray-700 bg-gray-50 border border-gray-200'
                  : ''
                }
              `}
            >
              {/* Show short name on mobile, full name on desktop */}
              <span className='hidden sm:inline'>{day}</span>
              <span className='sm:hidden'>{day.substring(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Responsive Calendar Grid */}
        {loading ? (
          <div className='flex flex-col items-center justify-center py-20 sm:py-32'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3 sm:mb-4"></div>
            <p className='text-gray-500 text-xs sm:text-sm'>
              Loading holidays...
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-7 gap-2 sm:gap-3 md:gap-4'>
            {calendarDays.map((dayInfo, index) => (
              <CalendarDay
                key={index}
                dayInfo={dayInfo}
                index={index}
                onHolidayClick={onHolidayClick}
              />
            ))}
          </div>
        )}

        {/* Responsive Enhanced Legend */}
        <div className='mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-200'>
          <div className='flex items-center justify-center gap-2 mb-3 sm:mb-4'>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 sm:px-3'>
              Legend
            </p>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
          </div>
          <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4'>
            {/* Today */}
            <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-white shadow-sm border border-gray-200'>
              <div className='w-3 h-3 sm:w-4 sm:h-4 rounded-md sm:rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 ring-1 sm:ring-2 ring-sky-400/30' />
              <span className='text-[10px] sm:text-xs font-medium text-gray-700'>
                Today
              </span>
            </div>
            {/* National */}
            <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-white shadow-sm border border-gray-200'>
              <div className='w-3 h-3 sm:w-4 sm:h-4 rounded-md sm:rounded-lg bg-gradient-to-br from-green-500 to-emerald-600' />
              <span className='text-[10px] sm:text-xs font-medium text-gray-700'>
                National
              </span>
            </div>
            {/* Religious */}
            <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-white shadow-sm border border-gray-200'>
              <div className='w-3 h-3 sm:w-4 sm:h-4 rounded-md sm:rounded-lg bg-gradient-to-br from-violet-500 to-purple-600' />
              <span className='text-[10px] sm:text-xs font-medium text-gray-700'>
                Religious
              </span>
            </div>
            {/* Company */}
            <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-white shadow-sm border border-gray-200'>
              <div className='w-3 h-3 sm:w-4 sm:h-4 rounded-md sm:rounded-lg bg-gradient-to-br from-pink-500 to-rose-600' />
              <span className='text-[10px] sm:text-xs font-medium text-gray-700'>
                Company
              </span>
            </div>
            {/* Optional */}
            <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-white shadow-sm border border-gray-200'>
              <div className='w-3 h-3 sm:w-4 sm:h-4 rounded-md sm:rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600' />
              <span className='text-[10px] sm:text-xs font-medium text-gray-700'>
                Optional
              </span>
            </div>
            {/* Weekend */}
            <div className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-white shadow-sm border border-gray-200'>
              <div className='w-3 h-3 sm:w-4 sm:h-4 rounded-md sm:rounded-lg bg-red-200 border border-red-500' />
              <span className='text-[10px] sm:text-xs font-medium text-gray-700'>
                Weekend
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HolidayCalendar;
