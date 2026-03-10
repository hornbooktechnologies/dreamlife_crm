import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Printer } from 'lucide-react';
import PaySlipTemplate from './PaySlipTemplate';

const PaySlipDialog = ({ isOpen, setIsOpen, employee }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    id: '',
    joiningDate: '',
    employee_tag_id: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    earnings: {
      basicSalary: 0,
      hra: 0,
      specialAllowance: 0,
    },
    deductions: {
      pf: 0,
      tax: 0,
    },
  });

  const printRef = useRef();

  useEffect(() => {
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        name: `${employee.first_name} ${employee.last_name}`,
        designation: employee.designation || '',
        id: employee.id,
        joiningDate: employee.joining_date
          ? new Date(employee.joining_date).toLocaleDateString()
          : '',
        employee_tag_id: employee.employee_tag_id || '',
      }));
    }
  }, [employee, isOpen]);

  const handleEarningsChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        [key]: value,
      },
    }));
  };

  const handleDeductionsChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        [key]: value,
      },
    }));
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Pay_Slip_${formData.name?.replace(/\s+/g, '_')}_${formData.month}`,
  });

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='max-w-4xl w-[95vw] h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl flex flex-col text-left [&>button]:!text-white [&>button]:top-5 [&>button]:right-5 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button]:transition-all [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button>svg]:stroke-[3]'>
        <DialogHeader className='p-6 bg-gradient-to-r from-primary via-primary-hover to-primary text-white shrink-0 !text-left'>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span className="hidden sm:inline">Generate </span> Pay Slip
          </DialogTitle>
          <p className="text-blue-50 text-sm mt-1 text-left">
            Enter salary details for <b>{formData.name}</b>.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto w-full">
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-6'>
            {/* Editor Form */}
            <div className='space-y-6 border p-6 rounded-xl bg-gray-50/50 shadow-sm h-fit text-sm sm:text-base'>
              <h3 className='font-semibold text-lg border-b pb-2 text-gray-800'>
                Salary Details
              </h3>

              <div className='grid grid-cols-2 gap-5'>
                <div className='space-y-2'>
                  <Label htmlFor='month' className='text-gray-700 font-medium'>Month</Label>
                  <Input
                    id='month'
                    value={formData.month}
                    onChange={(e) =>
                      setFormData({ ...formData, month: e.target.value })
                    }
                    className='h-10 border-gray-300 focus:border-[#5283c5] bg-white'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='year' className='text-gray-700 font-medium'>Year</Label>
                  <Input
                    id='year'
                    type='number'
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className='h-10 border-gray-300 focus:border-[#5283c5] bg-white'
                  />
                </div>
              </div>

              <div className="space-y-2 bg-green-50/50 p-4 rounded-lg -mx-2 sm:mx-0">
                <h4 className='font-semibold text-green-700 flex items-center gap-2'>
                  Earnings
                </h4>
                <div className='space-y-2'>
                  {[
                    { id: 'basic', label: 'Basic Salary', key: 'basicSalary' },
                    { id: 'hra', label: 'HRA', key: 'hra' },
                    { id: 'special', label: 'Special Allow.', key: 'specialAllowance' }
                  ].map((item) => (
                    <div key={item.id} className='grid grid-cols-1 sm:grid-cols-3 items-center gap-1 sm:gap-2'>
                      <Label htmlFor={item.id} className='sm:col-span-1 sm:text-right text-gray-600 font-medium'>
                        {item.label}
                      </Label>
                      <Input
                        id={item.id}
                        type='number'
                        className='sm:col-span-2 h-10 border-gray-300 focus:border-[#5283c5] bg-white'
                        value={formData.earnings[item.key]}
                        onChange={(e) =>
                          handleEarningsChange(item.key, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 bg-red-50/50 p-4 rounded-lg -mx-2 sm:mx-0">
                <h4 className='font-semibold text-red-700 flex items-center gap-2'>
                  Deductions
                </h4>
                <div className='space-y-2'>
                  {[
                    { id: 'pf', label: 'PF', key: 'pf' },
                    { id: 'tax', label: 'Tax', key: 'tax' }
                  ].map((item) => (
                    <div key={item.id} className='grid grid-cols-1 sm:grid-cols-3 items-center gap-1 sm:gap-2'>
                      <Label htmlFor={item.id} className='sm:col-span-1 sm:text-right text-gray-600 font-medium'>
                        {item.label}
                      </Label>
                      <Input
                        id={item.id}
                        type='number'
                        className='sm:col-span-2 h-10 border-gray-300 focus:border-[#5283c5] bg-white'
                        value={formData.deductions[item.key]}
                        onChange={(e) =>
                          handleDeductionsChange(item.key, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className='pt-4 flex gap-3'>
                <Button
                  className='w-full bg-gradient-to-r from-primary via-primary-hover to-primary text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-95 font-semibold px-4 py-2 h-11'
                  onClick={handlePrint}
                >
                  <Printer className='mr-2 h-5 w-5' /> Print / Save as PDF
                </Button>
              </div>
            </div>

            {/* Live Preview */}
            {/* Live Preview */}
            <div className='border shadow-sm rounded-xl overflow-hidden bg-gray-100/50 flex items-center justify-center p-4'>
              <div className='relative w-full h-[320px] sm:h-[360px] flex justify-center'>
                <div className='absolute top-0 scale-[0.4] sm:scale-[0.45] origin-top transform-gpu h-[800px] w-[800px] overflow-hidden bg-white shadow-2xl ring-1 ring-gray-200 rounded-sm'>
                  <div className='pointer-events-none select-none'>
                    <PaySlipTemplate data={formData} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Printable Component */}
          <div className='hidden'>
            <PaySlipTemplate ref={printRef} data={formData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaySlipDialog;

