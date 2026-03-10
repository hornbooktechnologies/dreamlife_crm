import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestHandler } from '../../lib/utils/network-client';
import { useAuthStore } from '../../context/AuthContext';
import useToast from '../../hooks/useToast';
import HolidayHeader from './HolidayHeader';
import HolidayCalendar from './HolidayCalendar';
import AddHolidayDialog from './AddHolidayDialog';
import HolidayDetailModal from './HolidayDetailModal';
import { parseHolidayDate } from './constants';
import { Card, CardContent, CardHeader } from '../ui/card';

const Holiday = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  // Get user role from auth context
  const { user } = useAuthStore();
  const userRole = user?.role || 'employee'; // Default to 'User' (restricted access) if no role is found

  // Only 'employee' role has restricted access (view-only)
  const hasFullAccess = userRole !== 'employee' && userRole !== 'bde' && userRole !== 'Bde';

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  // Derived values
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Fetch holidays for the current year
  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestHandler(`/holidays?year=${currentYear}`, {
        method: 'GET',
      });
      if (response.success && response.data) {
        // Handle new API response structure: response.data.data contains the array
        const holidaysData = response.data.data || response.data;
        setHolidays(Array.isArray(holidaysData) ? holidaysData : []);
      } else {
        setHolidays([]);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }, [currentYear]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  // Get all holidays for a date (supports multiple holidays on same day)
  const getHolidaysForDate = (day, month, year) => {
    if (!Array.isArray(holidays)) return [];

    return holidays.filter((h) => {
      if (!h.date) return false;

      // Parse the UTC date to local timezone to get correct date
      const parsed = parseHolidayDate(h.date);

      // Compare (month is 0-indexed in both)
      return (
        parsed.year === year && parsed.month === month && parsed.day === day
      );
    });
  };

  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isWeekend: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();
      const dayHolidays = getHolidaysForDate(day, currentMonth, currentYear);
      days.push({
        day,
        isCurrentMonth: true,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isSunday: dayOfWeek === 0,
        isSaturday: dayOfWeek === 6,
        isToday: isToday(day),
        holidays: dayHolidays, // Array of holidays
        holiday: dayHolidays.length > 0 ? dayHolidays[0] : null, // First holiday for backward compatibility
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isWeekend: false,
      });
    }

    return days;
  };

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };



  // Handle Add Holiday submit
  const handleAddSubmit = async (data) => {
    setSubmitting(true);
    try {
      const year = new Date(data.date).getFullYear();
      const response = await requestHandler('/holidays', {
        method: 'POST',
        body: {
          date: data.date,
          name: data.name,
          type: data.type,
          year: year,
        },
      });

      if (response.success) {
        showSuccessToast('Holiday created successfully');
        setIsAddDialogOpen(false);
        fetchHolidays();
      } else {
        showErrorToast(response.message || 'Failed to create holiday');
      }
    } catch (error) {
      console.error('Error creating holiday:', error);
      showErrorToast('An error occurred while creating the holiday');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle holiday click from calendar (receives array of holidays for that date)
  const handleHolidayClick = (holidays) => {
    setSelectedHolidays(holidays);
    setIsEditing(false);
    setIsDetailModalOpen(true);
  };

  // Handle Edit Holiday
  const handleEditHoliday = async (holidayId, updatedData) => {
    setSubmitting(true);
    try {
      const year = new Date(updatedData.date).getFullYear();
      const response = await requestHandler(`/holidays/${holidayId}`, {
        method: 'PUT',
        body: {
          date: updatedData.date,
          name: updatedData.name,
          type: updatedData.type,
          year: year,
        },
      });

      if (response.success) {
        showSuccessToast('Holiday updated successfully');
        setIsDetailModalOpen(false);
        setIsEditing(false);
        setSelectedHolidays([]);
        fetchHolidays();
      } else {
        showErrorToast(response.message || 'Failed to update holiday');
      }
    } catch (error) {
      console.error('Error updating holiday:', error);
      showErrorToast('An error occurred while updating the holiday');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Holiday
  const handleDeleteHoliday = async (holidayId) => {
    try {
      const response = await requestHandler(`/holidays/${holidayId}`, {
        method: 'DELETE',
      });
      if (response.success) {
        showSuccessToast('Holiday deleted successfully');
        setIsDetailModalOpen(false);
        setSelectedHolidays([]);
        fetchHolidays();
      } else {
        showErrorToast(response.message || 'Failed to delete holiday');
      }
    } catch (error) {
      console.error('Error deleting holiday:', error);
      showErrorToast('An error occurred while deleting the holiday');
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <>
      {/* Header - Outside Card */}
      <HolidayHeader
        onAddClick={() => setIsAddDialogOpen(true)}
        hasFullAccess={hasFullAccess}
      />

      {/* Table Card with Glass Effect */}
      <Card
        className="border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 ring-1 ring-black/5 mt-6"
        style={{
          boxShadow:
            "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >

        <CardContent className='p-2 sm:p-6 sm:pt-0'>
          {/* Calendar - Full width now */}
          <HolidayCalendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            calendarDays={calendarDays}
            loading={loading}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onGoToCurrentMonth={goToCurrentMonth}
            onHolidayClick={handleHolidayClick}
            onViewAllClick={() => navigate('/holiday/all-holidays')}
            totalHolidays={holidays.length}
          />
        </CardContent>
      </Card>

      {/* Add Holiday Dialog */}
      <AddHolidayDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddSubmit}
        submitting={submitting}
      />

      {/* Holiday Detail Modal */}
      <HolidayDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        holidays={selectedHolidays}
        onEdit={handleEditHoliday}
        onDelete={handleDeleteHoliday}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        submitting={submitting}
        hasFullAccess={hasFullAccess}
      />
    </>
  );
};

export default Holiday;
