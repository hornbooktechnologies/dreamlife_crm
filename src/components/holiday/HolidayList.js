import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Calendar as CalendarIcon, Gift } from 'lucide-react';
import HolidayCard from './HolidayCard';
import { MONTH_NAMES, parseHolidayDate } from './constants';

const HolidayList = ({
  holidays,
  currentMonth,
  currentYear,
  onDeleteHoliday,
}) => {
  // Get holidays for current month using timezone-aware parsing
  const currentMonthHolidays = holidays.filter((h) => {
    if (!h.date) return false;
    const parsed = parseHolidayDate(h.date);
    return parsed.month === currentMonth && parsed.year === currentYear;
  });

  return (
    <Card className='border-0 shadow-xl bg-white/80 backdrop-blur-sm'>
      <CardHeader className='pb-2'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg'>
            <Gift className='w-5 h-5 text-white' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-gray-800'>
              Holidays in {MONTH_NAMES[currentMonth]}
            </h2>
            <p className='text-xs text-gray-500'>
              {currentMonthHolidays.length} holiday(s) this month
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentMonthHolidays.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <CalendarIcon className='w-12 h-12 mx-auto mb-3 opacity-30' />
            <p className='text-sm'>No holidays this month</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {currentMonthHolidays.map((holiday, index) => (
              <HolidayCard
                key={holiday.id || index}
                holiday={holiday}
                onDelete={onDeleteHoliday}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HolidayList;
