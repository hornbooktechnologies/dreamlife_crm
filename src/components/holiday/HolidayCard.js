import React from 'react';
import { Trash2 } from 'lucide-react';
import { getHolidayTypeColor, formatHolidayDate } from './constants';

const HolidayCard = ({ holiday, onDelete }) => {
  // Use the timezone-aware utility function for correct date display
  const formattedDate = formatHolidayDate(holiday.date);

  return (
    <div
      className='p-4 rounded-xl bg-gray-50 border border-gray-100 
                       hover:shadow-md transition-all duration-200'
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <h4 className='font-semibold text-gray-800'>{holiday.name}</h4>
          <p className='text-sm text-gray-500 mt-1'>{formattedDate}</p>
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${getHolidayTypeColor(
              holiday.type,
            )}`}
          >
            {holiday.type?.charAt(0).toUpperCase() + holiday.type?.slice(1)}
          </span>
        </div>
        <button
          onClick={() => onDelete(holiday.id)}
          className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                             rounded-lg transition-all duration-200'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
};

export default HolidayCard;
