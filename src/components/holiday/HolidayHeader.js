import React from 'react';
import { Button } from '../ui/button';
import { Plus, List } from 'lucide-react';

const HolidayHeader = ({
  onAddClick,
  hasFullAccess = true,
}) => {
  return (
    <div className='flex flex-row items-center justify-between gap-3 mb-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent pb-2'>
          Holiday Management
        </h1>
        <p className='text-sm sm:text-base text-gray-500 mt-1'>
          Manage holiday packages and bookings
        </p>
      </div>

      <div className='flex items-center gap-2 sm:gap-3'>
        {/* Add Holiday Button - Hidden for User role, visible for Admin, Manager, HR */}
        {hasFullAccess && (
          <Button
            onClick={onAddClick}
            className='h-10 px-4 sm:px-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] 
                          text-white font-semibold gap-2
                          shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                          hover:-translate-y-0.5 transition-all duration-200
                          active:scale-95'
          >
            <Plus className='w-4 h-4 sm:w-5 sm:h-5' />
            <span className="hidden sm:inline">Add Holiday</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default HolidayHeader;
