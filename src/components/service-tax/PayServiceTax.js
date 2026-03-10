import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { requestHandler } from '../../lib/utils/network-client';
import { payServiceTax } from '../../services/serviceTaxService';
import { Loader2 } from 'lucide-react';
import useToast from '../../hooks/useToast';

const PayServiceTax = ({ isOpen, setIsOpen, onSuccess }) => {
  const { showSuccessToast, showErrorToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    employee_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: 200,
  });

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await requestHandler('/employees?limit=100', {
        method: 'GET',
      });
      if (response.success && response.data) {
        const empData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setEmployees(empData);
      }
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: 200,
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee_id) {
      setErrors({ employee_id: 'Please select an employee' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await payServiceTax(formData);

      // Check if payment was successful
      // Backend might return success:true or just the payment data
      // Be specific with message check to avoid false positives like "already paid"
      const isSuccess =
        response.success === true ||
        response.payment ||
        response.message?.includes('marked as paid');

      if (isSuccess) {
        showSuccessToast(response.message || 'Service Tax paid successfully!');
        // Close modal first for better UX
        setIsOpen(false);
        // Refresh data after a short delay and pass the month/year that was paid
        setTimeout(() => {
          if (onSuccess) {
            onSuccess({
              month: formData.month,
              year: formData.year,
            });
          }
        }, 500);
        // Reset form after callback
        resetForm();
      } else {
        // Show error message from backend
        showErrorToast(response.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Error paying service tax:', error);
      showErrorToast('An error occurred while processing payment');
    } finally {
      setSubmitting(false);
    }
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='w-[95vw] sm:max-w-[550px] max-h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl flex flex-col text-left [&>button]:!text-white [&>button]:top-5 [&>button]:right-5 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button]:transition-all [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button>svg]:stroke-[3]'>
        <DialogHeader className='p-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shrink-0 !text-left'>
          <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
            Pay Service Tax
          </DialogTitle>
          <p className='text-blue-50 text-sm mt-1 text-left'>
            Record a service tax payment for an employee.
          </p>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className='flex-1 flex flex-col min-h-0'
        >
          <div className='flex-1 overflow-y-auto p-6 space-y-5'>
            <div className='space-y-2'>
              <Label>Select Employee</Label>
              <Select
                onValueChange={(value) => {
                  setFormData({ ...formData, employee_id: value });
                  if (errors.employee_id) {
                    setErrors({ ...errors, employee_id: '' });
                  }
                }}
                value={formData.employee_id}
              >
                <SelectTrigger className='h-10 border-gray-300 focus:border-[#3a5f9e] focus:ring-0 text-gray-900'>
                  <SelectValue placeholder='Select an employee' />
                </SelectTrigger>
                <SelectContent className='max-h-[200px]'>
                  {loading ? (
                    <div className='p-2 text-center text-sm text-gray-500'>
                      Loading...
                    </div>
                  ) : (
                    employees.map((emp) => (
                      <SelectItem
                        key={emp.id}
                        value={emp.id}
                        className='focus:bg-blue-50 focus:text-[#3a5f9e]'
                      >
                        {emp.first_name} {emp.last_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.employee_id && (
                <p className='text-red-500 text-xs font-medium mt-1'>{errors.employee_id}</p>
              )}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5'>
              <div className='space-y-2'>
                <Label>Month</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, month: parseInt(value) })
                  }
                  value={formData.month.toString()}
                >
                  <SelectTrigger className='h-10 border-gray-300 focus:border-[#3a5f9e] focus:ring-0 text-gray-900'>
                    <SelectValue placeholder='Month' />
                  </SelectTrigger>
                  <SelectContent className='max-h-[200px]'>
                    {months.map((m) => (
                      <SelectItem
                        key={m.value}
                        value={m.value.toString()}
                        className='focus:bg-blue-50 focus:text-[#3a5f9e]'
                      >
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Year</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, year: parseInt(value) })
                  }
                  value={formData.year.toString()}
                >
                  <SelectTrigger className='h-10 border-gray-300 focus:border-[#3a5f9e] focus:ring-0 text-gray-900'>
                    <SelectValue placeholder='Year' />
                  </SelectTrigger>
                  <SelectContent className='max-h-[200px]'>
                    {years.map((y) => (
                      <SelectItem
                        key={y}
                        value={y.toString()}
                        className='focus:bg-blue-50 focus:text-[#3a5f9e]'
                      >
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Amount</Label>
              <Input
                type='number'
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) })
                }
                readOnly
                className='bg-gray-50 h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900'
              />
            </div>
          </div>

          <DialogFooter className='p-6 border-t bg-gray-50/50 mt-auto flex flex-col gap-3 sm:flex-row sm:gap-2 sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={submitting}
              className='bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white hover:opacity-90 transition-opacity'
            >
              {submitting ? (
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayServiceTax;
