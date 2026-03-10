import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuthStore();

    return (
        <div className='p-4 space-y-8 max-w-[1920px] mx-auto bg-gray-50'>
            {/* Header */}
            <div className='flex flex-col gap-1'>
                <h1 className='md:text-4xl text-2xl font-semibold tracking-tight text-primary'>
                    Settings
                </h1>
                <p className='text-gray-500 text-sm'>
                    Manage your application settings and preferences
                </p>
            </div>

            {/* Settings Cards */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Profile Settings */}
                <Card className='border-0 shadow-lg'>
                    <CardHeader>
                        <h2 className='text-xl font-semibold text-gray-800'>
                            Profile Settings
                        </h2>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <label className='text-sm font-medium text-gray-700'>
                                Name
                            </label>
                            <p className='text-gray-600 mt-1'>
                                {user?.first_name} {user?.last_name}
                            </p>
                        </div>
                        <div>
                            <label className='text-sm font-medium text-gray-700'>
                                Email
                            </label>
                            <p className='text-gray-600 mt-1'>
                                {user?.email}
                            </p>
                        </div>
                        <div>
                            <label className='text-sm font-medium text-gray-700'>
                                Role
                            </label>
                            <p className='text-gray-600 mt-1 capitalize'>
                                {user?.role}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Application Settings */}
                <Card className='border-0 shadow-lg'>
                    <CardHeader>
                        <h2 className='text-xl font-semibold text-gray-800'>
                            Application Settings
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <div className='text-center py-8 text-gray-500'>
                            <SettingsIcon className='w-12 h-12 mx-auto mb-3 opacity-50' />
                            <p>Theme and preference settings</p>
                            <p className='text-sm mt-2'>Coming soon</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
