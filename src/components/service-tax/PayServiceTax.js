import React, { useState, useEffect, useRef } from 'react';
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
} from '../ui/dialog';
import { requestHandler } from '../../lib/utils/network-client';
import { payServiceTaxBulk } from '../../services/serviceTaxService';
import { Check, ChevronDown, Loader2, Search, Users, X } from 'lucide-react';
import useToast from '../../hooks/useToast';

// ─── Multi-Select Employee Picker ─────────────────────────────────────────────
const EmployeeMultiSelect = ({ employees, loading, selectedIds, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = employees.filter((emp) => {
    const name = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const toggleEmployee = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectAll = () => onChange(filtered.map((e) => e.id));
  const clearAll = () => onChange([]);

  const selectedNames = employees
    .filter((e) => selectedIds.includes(e.id))
    .map((e) => `${e.first_name} ${e.last_name}`);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-10 flex items-center justify-between px-3 rounded-md border text-sm text-left
          transition-colors focus:outline-none
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-[#3a5f9e]'}
          ${open ? 'border-[#3a5f9e] ring-1 ring-[#3a5f9e]/30' : ''}`}
      >
        <span className="flex-1 truncate text-gray-700">
          {selectedIds.length === 0 ? (
            <span className="text-gray-400">Select employees…</span>
          ) : selectedIds.length === 1 ? (
            selectedNames[0]
          ) : (
            <span className="text-[#3a5f9e] font-medium">
              {selectedIds.length} employees selected
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-2 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Selected chips */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedNames.map((name, i) => (
            <span
              key={selectedIds[i]}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-700 font-medium"
            >
              {name}
              <button
                type="button"
                onClick={() => toggleEmployee(selectedIds[i])}
                className="hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees…"
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#3a5f9e] focus:ring-1 focus:ring-[#3a5f9e]/30"
                autoFocus
              />
            </div>
          </div>

          {/* Select All / Clear */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-100">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs text-[#3a5f9e] font-medium hover:underline"
            >
              Select All ({filtered.length})
            </button>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-red-500 font-medium hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[200px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-4 text-sm text-gray-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading employees…
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-sm text-center text-gray-400">
                No employees found
              </div>
            ) : (
              filtered.map((emp) => {
                const isSelected = selectedIds.includes(emp.id);
                return (
                  <button
                    type="button"
                    key={emp.id}
                    onClick={() => toggleEmployee(emp.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors
                      ${isSelected
                        ? 'bg-blue-50 text-[#3a5f9e] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                        ${isSelected
                          ? 'bg-[#3a5f9e] border-[#3a5f9e]'
                          : 'border-gray-300 bg-white'
                        }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </span>
                    <span className="flex-1 truncate">
                      {emp.first_name} {emp.last_name}
                    </span>
                    {emp.designation && (
                      <span className="text-xs text-gray-400 shrink-0">{emp.designation}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PayServiceTax = ({ isOpen, setIsOpen, onSuccess }) => {
  const { showSuccessToast, showErrorToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return {
      employee_ids: [],
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      amount: 200,
    };
  });

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await requestHandler('/employees?limit=200', { method: 'GET' });
      if (response.success && response.data) {
        const empData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setEmployees(empData);
      }
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const resetForm = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    setFormData({
      employee_ids: [],
      month: date.getMonth() + 1,
      year: date.getFullYear(),
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

    if (!formData.employee_ids || formData.employee_ids.length === 0) {
      setErrors({ employee_ids: 'Please select at least one employee' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await payServiceTaxBulk({
        employee_ids: formData.employee_ids,
        month: formData.month,
        year: formData.year,
        amount: formData.amount,
      });

      const isSuccess =
        response.status === 201 ||
        response.added_count > 0 ||
        response.payments?.length > 0 ||
        response.message?.includes('marked as paid');

      if (isSuccess || response.message) {
        showSuccessToast(response.message || 'Service Tax paid successfully!');
        setIsOpen(false);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess({ month: formData.month, year: formData.year });
          }
        }, 300);
        resetForm();
      } else {
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
      <DialogContent className="w-[95vw] sm:max-w-[560px] max-h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl flex flex-col text-left [&>button]:!text-white [&>button]:top-5 [&>button]:right-5 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button]:transition-all [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button>svg]:stroke-[3]">
        {/* Header */}
        <DialogHeader className="p-6 bg-gradient-to-r from-primary via-primary-hover to-primary text-white shrink-0 !text-left">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Pay Service Tax
          </DialogTitle>
          <p className="text-blue-100 text-sm mt-1">
            Select one or multiple employees and record their service tax payment.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* Multi-Select Employees */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                Select Employees
                <span className="text-red-500 font-bold">*</span>
                {formData.employee_ids.length > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#3a5f9e] text-white text-[10px] font-bold">
                    {formData.employee_ids.length}
                  </span>
                )}
              </Label>
              <EmployeeMultiSelect
                employees={employees}
                loading={loadingEmployees}
                selectedIds={formData.employee_ids}
                onChange={(ids) => {
                  setFormData((prev) => ({ ...prev, employee_ids: ids }));
                  if (errors.employee_ids) setErrors({});
                }}
                error={!!errors.employee_ids}
              />
              {errors.employee_ids && (
                <p className="text-red-500 text-xs font-medium mt-1">{errors.employee_ids}</p>
              )}
            </div>

            {/* Month & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, month: parseInt(value) }))
                  }
                  value={formData.month.toString()}
                >
                  <SelectTrigger className="h-10 border-gray-300 focus:border-[#3a5f9e] focus:ring-0 text-gray-900">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {months.map((m) => (
                      <SelectItem
                        key={m.value}
                        value={m.value.toString()}
                        className="focus:bg-blue-50 focus:text-[#3a5f9e]"
                      >
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, year: parseInt(value) }))
                  }
                  value={formData.year.toString()}
                >
                  <SelectTrigger className="h-10 border-gray-300 focus:border-[#3a5f9e] focus:ring-0 text-gray-900">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {years.map((y) => (
                      <SelectItem
                        key={y}
                        value={y.toString()}
                        className="focus:bg-blue-50 focus:text-[#3a5f9e]"
                      >
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: parseFloat(e.target.value) }))
                }
                className="bg-gray-50 h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900"
              />
            </div>

            {/* Summary */}
            {formData.employee_ids.length > 0 && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
                <span className="font-semibold">{formData.employee_ids.length}</span> employee
                {formData.employee_ids.length > 1 ? 's' : ''} will be charged{' '}
                <span className="font-semibold">₹{formData.amount}</span> each for{' '}
                <span className="font-semibold">
                  {months[formData.month - 1]?.label} {formData.year}
                </span>
                . Already-paid employees will be skipped automatically.
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 border-t bg-gray-50/50 mt-auto flex flex-col gap-3 sm:flex-row sm:gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-primary via-primary-hover to-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing…
                </>
              ) : (
                `Confirm Payment${formData.employee_ids.length > 1 ? ` (${formData.employee_ids.length})` : ''}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayServiceTax;

