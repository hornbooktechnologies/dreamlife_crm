import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Plus, Loader2, Calendar } from 'lucide-react';
import { HOLIDAY_TYPES } from './constants';

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formSchema = z.object({
  name: z.string().min(1, 'Please enter holiday name'),
  date: z.string().min(1, 'Please select a date'),
  type: z.string().min(1, 'Please select holiday type'),
});

const AddHolidayDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  submitting,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      date: '',
      type: 'national',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        date: '',
        type: 'national',
      });
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] sm:max-w-md max-h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl flex flex-col text-left [&>button]:!text-white [&>button]:top-5 [&>button]:right-5 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button]:transition-all [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button>svg]:stroke-[3]'>
        <DialogHeader className='p-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shrink-0 !text-left'>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            Add New Holiday
          </DialogTitle>
          <DialogDescription className='text-blue-50'>
            Fill in the details to add a new holiday to the calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex-1 flex flex-col min-h-0'>
          <div className='flex-1 overflow-y-auto p-6 space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-gray-700 font-semibold'>
                Holiday Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                placeholder='e.g., New Year'
                {...register('name')}
                className='h-10 border-gray-300 focus:border-[#3a5f9e] focus:ring-0 text-gray-900'
              />
              {errors.name && (
                <p className='text-red-500 text-xs font-medium mt-1'>{errors.name.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label className='text-gray-700 font-semibold'>
                Date <span className='text-red-500'>*</span>
              </Label>
              <div className='relative group'>
                <Input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={formatDateForDisplay(watch('date'))}
                  readOnly
                  className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                />
                <Input
                  type='date'
                  id='date'
                  {...register('date')}
                  className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10'
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
                <Calendar
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-20'
                  size={18}
                />
              </div>
              {errors.date && (
                <p className='text-red-500 text-xs font-medium mt-1'>{errors.date.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='type' className='text-gray-700 font-semibold'>
                Holiday Type
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <SelectTrigger className='h-10 border-gray-300 focus:border-[#3a5f9e] focus:ring-0 text-gray-900'>
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
                )}
              />
              {errors.type && (
                <p className='text-red-500 text-xs font-medium mt-1'>{errors.type.message}</p>
              )}
            </div>
          </div>
          <DialogFooter className='p-6 border-t bg-gray-50/50 mt-auto gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={submitting}
              className='bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] 
                          text-white font-semibold hover:opacity-90 transition-opacity'
            >
              {submitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Holiday
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHolidayDialog;
