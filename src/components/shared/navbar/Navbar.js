import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../context/AuthContext';
import useToast from '../../../hooks/useToast';
import { useLayout } from '../../../context/LayoutContext';
import { getEmployeeById } from '../../../services/employeeService';

const Navbar = () => {
    const { toggleSidebar } = useLayout();
    const { user } = useAuthStore();
    const location = useLocation();

    const navigate = useNavigate();
    const { showErrorToast } = useToast();
    const [employeeData, setEmployeeData] = useState(null);
    const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);

    // Fetch employee data when component mounts (only for employees)
    useEffect(() => {
        const fetchEmployeeData = async () => {
            if ((user?.role === 'employee' || user?.role === 'bde' || user?.role === 'Bde') && (user?.employee_id || user?.id)) {
                setIsLoadingEmployee(true);
                try {
                    const response = await getEmployeeById(user.employee_id || user.id);
                    if (response.success) {
                        setEmployeeData(response.data);
                    } else {
                        showErrorToast(response.message || 'Failed to fetch employee data');
                    }
                } catch (error) {
                    console.error('Error fetching employee data:', error);
                    showErrorToast('Error loading employee data');
                } finally {
                    setIsLoadingEmployee(false);
                }
            }
        };

        fetchEmployeeData();
    }, [user?.role, user?.employee_id, user?.id]);

    const handleProfileClick = () => {
        // Only employees (and BDEs) can click to view profile
        if (user?.role === 'employee' || user?.role === 'bde' || user?.role === 'Bde') {
            navigate('/profile');
        }
    };

    // Get initials for profile photo
    const getInitials = () => {
        const firstInitial = user?.first_name?.[0] || '';
        const lastInitial = user?.last_name?.[0] || '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    };

    // Check if user is employee
    const isEmployee = user?.role === 'employee' || user?.role === 'bde' || user?.role === 'Bde';

    // Get profile image - prefer employee data, fallback to user data
    const profileImage = employeeData?.user_image || user?.user_image;

    // Get page title based on path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/' || path === '/dashboard') return 'Dashboard';
        if (path.startsWith('/users')) return 'User Management';
        if (path.startsWith('/employee')) return 'Employees';
        if (path.startsWith('/leave')) return 'Leave Management';
        if (path.startsWith('/holiday')) return 'Holidays';
        if (path.startsWith('/service-tax')) return 'Service Tax';
        if (path.startsWith('/documents')) return 'Documents';
        if (path.startsWith('/project-management')) return 'Projects';
        if (path.startsWith('/resume-builder')) return 'Resume Builder';
        if (path.startsWith('/activity-logs')) return 'Activity Logs';
        if (path.startsWith('/profile')) return 'My Profile';
        if (path.startsWith('/settings')) return 'Settings';
        return 'Overview';
    };

    return (
        <>
            <div className='flex justify-between items-center h-[72px] px-4 z-20 mt-4 mr-4 ml-4 md:mt-0 md:mr-0 md:ml-0 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl'>
                <div className="flex items-center gap-3">
                    {/* Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className='p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 active:bg-gray-200'
                    >
                        <Menu className='w-6 h-6' />
                    </button>

                    {/* Mobile Greeting */}
                    <div className="flex flex-col md:hidden">
                        <h1 className="text-lg font-bold text-slate-700 tracking-tight flex items-center gap-2">
                            Hi, <span className="capitalize">{user?.first_name?.toLowerCase()}</span> <span className="animate-wave origin-[70%_70%]">👋</span>
                        </h1>
                    </div>
                </div>

                {/* Right Side Icons */}
                <div className='flex items-center gap-2 sm:gap-4'>
                    {/* User Info */}
                    <div className='flex items-center gap-3'>
                        <div className='text-right hidden sm:block'>
                            <p className='text-sm font-bold text-slate-700 leading-none mb-1 capitalize'>
                                {user?.first_name?.toLowerCase()} {user?.last_name?.toLowerCase()}
                            </p>
                            <p className='text-xs text-primary font-semibold capitalize bg-primary/10 px-2 py-0.5 rounded-full inline-block'>
                                {user?.role === 'bde' || user?.role === 'Bde' ? 'BDE' : user?.role || 'User'}
                            </p>
                        </div>

                        {/* Profile Photo - Clickable only for employees */}
                        {isEmployee ? (
                            <button
                                onClick={handleProfileClick}
                                className='relative group'
                                title='View Profile'
                                disabled={isLoadingEmployee}
                            >
                                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary-hover to-primary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 ring-2 ring-white'>
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={`${user.first_name} ${user.last_name}`}
                                            className='w-full h-full rounded-full object-cover'
                                        />
                                    ) : (
                                        <span>{getInitials()}</span>
                                    )}
                                </div>
                            </button>
                        ) : (
                            // Non-clickable profile photo for admin
                            <div className='relative'>
                                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary-hover to-primary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20 ring-2 ring-white'>
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={`${user.first_name} ${user.last_name}`}
                                            className='w-full h-full rounded-full object-cover'
                                        />
                                    ) : (
                                        <span>{getInitials()}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
