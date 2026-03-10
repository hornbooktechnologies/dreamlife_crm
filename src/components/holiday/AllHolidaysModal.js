// import React, { useMemo, useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
// import { Calendar, Filter, RotateCcw } from 'lucide-react';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { formatHolidayDate, getHolidayTypeColor } from './constants';

// const AllHolidaysModal = ({
//   isOpen,
//   onOpenChange,
//   holidays,
//   onHolidayClick,
// }) => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [showFilters, setShowFilters] = useState(false);

//   // Filter holidays by date range
//   const filteredHolidays = useMemo(() => {
//     if (!startDate && !endDate) return holidays;

//     return holidays.filter((holiday) => {
//       const holidayDate = new Date(holiday.date);
//       const start = startDate ? new Date(startDate) : null;
//       const end = endDate ? new Date(endDate) : null;

//       if (start && end) {
//         return holidayDate >= start && holidayDate <= end;
//       } else if (start) {
//         return holidayDate >= start;
//       } else if (end) {
//         return holidayDate <= end;
//       }
//       return true;
//     });
//   }, [holidays, startDate, endDate]);

//   // Group holidays by month
//   const holidaysByMonth = useMemo(() => {
//     const grouped = {};
//     filteredHolidays.forEach((holiday) => {
//       const date = new Date(holiday.date);
//       const monthYear = `${date.toLocaleString('en-US', {
//         month: 'long',
//       })} ${date.getFullYear()}`;
//       if (!grouped[monthYear]) {
//         grouped[monthYear] = [];
//       }
//       grouped[monthYear].push(holiday);
//     });

//     // Sort holidays within each month by date
//     Object.keys(grouped).forEach((key) => {
//       grouped[key].sort((a, b) => new Date(a.date) - new Date(b.date));
//     });

//     return grouped;
//   }, [filteredHolidays]);

//   const handleHolidayClick = (holiday) => {
//     onHolidayClick([holiday]);
//     onOpenChange(false);
//   };

//   const handleClearFilters = () => {
//     setStartDate('');
//     setEndDate('');
//   };

//   const isFiltered = startDate || endDate;

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className='sm:max-w-2xl max-h-[85vh] flex flex-col'>
//         <DialogHeader>
//           <DialogTitle className='text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3'>
//             <div className='p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl'>
//               <Calendar className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
//             </div>
//             <div>
//               <div>All Holidays</div>
//               <p className='text-sm font-normal text-gray-500 mt-0.5'>
//                 {isFiltered
//                   ? `${filteredHolidays.length} of ${holidays.length} holidays`
//                   : `${holidays.length} total holidays this year`}
//               </p>
//             </div>
//             <Button
//               onClick={() => setShowFilters(!showFilters)}
//               variant='outline'
//               size='sm'
//               className={`ml-[5px] ${
//                 showFilters
//                   ? 'bg-blue-50 border-blue-300 hover:bg-blue-600 hover:text-white'
//                   : ''
//               }`}
//             >
//               <Filter className='w-4 h-4 mr-1.5' />
//               {showFilters ? 'Hide' : 'Filter'}
//             </Button>
//           </DialogTitle>
//         </DialogHeader>

//         {/* Filter Section */}
//         {showFilters && (
//           <div className='border-b border-gray-200 pb-4 space-y-3'>
//             <div className='flex items-center gap-2 mb-2'>
//               <div className='h-px flex-1 bg-gray-200' />
//               <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
//                 Date Range Filter
//               </span>
//               <div className='h-px flex-1 bg-gray-200' />
//             </div>

//             <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//               <div className='space-y-1.5'>
//                 <Label htmlFor='start-date' className='text-sm text-gray-700'>
//                   From Date
//                 </Label>
//                 <Input
//                   id='start-date'
//                   type='date'
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className='text-gray-700'
//                 />
//               </div>

//               <div className='space-y-1.5'>
//                 <Label htmlFor='end-date' className='text-sm text-gray-700'>
//                   To Date
//                 </Label>
//                 <Input
//                   id='end-date'
//                   type='date'
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   min={startDate}
//                   className='text-gray-700'
//                 />
//               </div>
//             </div>

//             {isFiltered && (
//               <div className='flex items-center justify-between pt-2'>
//                 <p className='text-sm text-gray-600'>
//                   Showing{' '}
//                   <span className='font-semibold text-blue-600'>
//                     {filteredHolidays.length}
//                   </span>{' '}
//                   holidays
//                 </p>
//                 <Button
//                   onClick={handleClearFilters}
//                   variant='ghost'
//                   size='sm'
//                   className='text-gray-600 hover:text-red-600'
//                 >
//                   <RotateCcw className='w-3.5 h-3.5 mr-1.5' />
//                   Clear Filter
//                 </Button>
//               </div>
//             )}
//           </div>
//         )}

//         <div className='overflow-y-auto flex-1 pr-2 -mr-2'>
//           {filteredHolidays.length === 0 ? (
//             <div className='flex flex-col items-center justify-center py-16 text-gray-500'>
//               <Calendar className='w-16 h-16 mb-4 opacity-30' />
//               <p className='text-lg font-medium mb-1'>No holidays found</p>
//               <p className='text-sm'>
//                 {isFiltered
//                   ? 'Try adjusting your date range filters'
//                   : 'No holidays added yet'}
//               </p>
//             </div>
//           ) : (
//             <div className='space-y-6'>
//               {Object.entries(holidaysByMonth).map(
//                 ([monthYear, monthHolidays]) => (
//                   <div key={monthYear}>
//                     <h3 className='text-lg font-bold text-gray-700 mb-3 sticky top-0 bg-white py-2 z-10 border-b-2 border-blue-200'>
//                       {monthYear}
//                       <span className='ml-2 text-sm font-normal text-gray-500'>
//                         ({monthHolidays.length}{' '}
//                         {monthHolidays.length === 1 ? 'holiday' : 'holidays'})
//                       </span>
//                     </h3>
//                     <div className='space-y-2 p-4'>
//                       {monthHolidays.map((holiday) => (
//                         <div
//                           key={holiday.id}
//                           onClick={() => handleHolidayClick(holiday)}
//                           className='p-4 rounded-xl bg-gray-50 border border-gray-200 
//                                  hover:shadow-lg hover:scale-[1.02] transition-all 
//                                  duration-200 cursor-pointer hover:border-blue-300
//                                  group'
//                         >
//                           <div className='flex items-start justify-between gap-3'>
//                             <div className='flex-1 min-w-0'>
//                               <h4
//                                 className='font-semibold text-gray-800 mb-1 
//                                          group-hover:text-blue-600 transition-colors'
//                               >
//                                 {holiday.name}
//                               </h4>
//                               <p className='text-sm text-gray-600 mb-2'>
//                                 {formatHolidayDate(holiday.date)}
//                               </p>
//                               <span
//                                 className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getHolidayTypeColor(
//                                   holiday.type,
//                                 )}`}
//                               >
//                                 {holiday.type?.charAt(0).toUpperCase() +
//                                   holiday.type?.slice(1)}{' '}
//                                 Holiday
//                               </span>
//                             </div>
//                             <div className='text-gray-400 group-hover:text-blue-600 transition-colors'>
//                               <svg
//                                 className='w-5 h-5'
//                                 fill='none'
//                                 stroke='currentColor'
//                                 viewBox='0 0 24 24'
//                               >
//                                 <path
//                                   strokeLinecap='round'
//                                   strokeLinejoin='round'
//                                   strokeWidth={2}
//                                   d='M9 5l7 7-7 7'
//                                 />
//                               </svg>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ),
//               )}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AllHolidaysModal;
