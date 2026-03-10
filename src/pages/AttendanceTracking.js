import React from 'react';
import AttendanceTrackingList from '../components/attendance/AttendanceTrackingList';

const AttendanceTracking = () => {
    return (
        <div>
            <div className="relative z-10">
                <AttendanceTrackingList />
            </div>
        </div>
    );
};

export default AttendanceTracking;
