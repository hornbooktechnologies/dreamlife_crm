import React from 'react';

// Get holiday gradient color based on type - more distinct colors
const getHolidayGradient = (type) => {
  switch (type) {
    case 'national':
      return 'from-green-500 to-emerald-600';
    case 'religious':
      return 'from-violet-500 to-purple-600';
    case 'company':
      return 'from-pink-500 to-rose-600';
    case 'optional':
      return 'from-yellow-500 to-amber-600';
    default:
      return 'from-green-500 to-emerald-600';
  }
};

const CalendarDay = ({ dayInfo, index, onHolidayClick }) => {
  const holidays = dayInfo.holidays || [];
  const hasMultipleHolidays = holidays.length > 1;
  const firstHoliday = dayInfo.holiday;

  const getDayClassName = () => {
    let baseClasses =
      'relative group rounded-2xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center';

    if (!dayInfo.isCurrentMonth) {
      return `${baseClasses} text-gray-300 bg-gray-50/30`;
    }

    if (holidays.length > 0) {
      const gradient = hasMultipleHolidays
        ? 'from-fuchsia-500 via-purple-500 to-indigo-600'
        : getHolidayGradient(firstHoliday?.type);
      return `${baseClasses} bg-gradient-to-br ${gradient} text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-100`;
    }

    if (dayInfo.isToday) {
      return `${baseClasses} bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold shadow-2xl shadow-blue-500/50 scale-105 ring-4 ring-sky-400/40 border-2 border-white/20`;
    }

    if (dayInfo.isSunday) {
      return `${baseClasses} text-red-600 bg-red-50/80 hover:bg-red-100 hover:shadow-lg hover:scale-105 font-medium border-2 border-red-200/50`;
    }

    if (dayInfo.isSaturday) {
      return `${baseClasses} text-orange-600 bg-orange-50/80 hover:bg-orange-100 hover:shadow-lg hover:scale-105 font-medium border-2 border-orange-200/50`;
    }

    return `${baseClasses} text-gray-800 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 border-2 border-gray-100`;
  };

  const handleClick = () => {
    if (holidays.length > 0 && dayInfo.isCurrentMonth && onHolidayClick) {
      onHolidayClick(holidays);
    }
  };

  // Build tooltip text
  const getTooltipText = () => {
    if (holidays.length === 0) return '';
    if (holidays.length === 1) {
      return `${firstHoliday.name} - Click to view`;
    }
    return `${holidays.length} holidays - Click to view`;
  };

  return (
    <div
      onClick={handleClick}
      className={`${getDayClassName()} aspect-square sm:aspect-[2/1] w-full h-full`}
      title={getTooltipText()}
    >
      {/* Top section - Day number - Responsive */}
      <div className='text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-0.5'>
        {dayInfo.day}
      </div>

      {/* Today label - clear and prominent - Responsive */}
      {dayInfo.isToday && (
        <div className='absolute top-0.5 right-0.5 sm:top-1 sm:right-1 hidden sm:block'>
          <span className='text-[6px] xs:text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wider px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full bg-white/30 text-white backdrop-blur-sm border border-white/20'>
            TODAY
          </span>
        </div>
      )}

      {/* Holiday indicators */}
      {holidays.length > 0 && dayInfo.isCurrentMonth && (
        <div className='flex flex-col items-center gap-0.5 sm:gap-1 w-full px-1 sm:px-2'>
          {hasMultipleHolidays ? (
            <>
              <div className='flex gap-0.5 sm:gap-1'>
                {holidays.slice(0, 3).map((h, i) => (
                  <div
                    key={i}
                    className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/90 shadow-sm animate-pulse hidden sm:block'
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <span className='text-[7px] xs:text-[8px] sm:text-[10px] font-bold uppercase tracking-wider opacity-95'>
                {holidays.length} Events
              </span>
            </>
          ) : (
            <>
              {/* <div className='w-2 h-2 rounded-full bg-white/90 shadow-sm' /> */}
              <span className='text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide opacity-90 truncate w-full text-center px-0.5 sm:px-1 leading-tight'>
                {firstHoliday?.name}
              </span>
            </>
          )}
        </div>
      )}

      {/* Today indicator dot (when no holiday) */}
      {dayInfo.isToday && holidays.length === 0 && (
        <div className='absolute bottom-2'>
          <div className='w-1.5 h-1.5 bg-white rounded-full shadow-lg animate-pulse' />
        </div>
      )}

      {/* Weekend OFF label removed */}

      {/* Hover overlay effect */}
      {dayInfo.isCurrentMonth && holidays.length === 0 && !dayInfo.isToday && (
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none' />
      )}
    </div>
  );
};

export default CalendarDay;
