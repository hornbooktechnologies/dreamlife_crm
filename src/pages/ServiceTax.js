import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/AuthContext';
import ServiceTaxReport from '../components/service-tax/ServiceTaxReport';
import ServiceTaxStatus from '../components/service-tax/ServiceTaxStatus';
import ServiceTaxHistory from '../components/service-tax/ServiceTaxHistory';
import { Card, CardContent, CardHeader } from '../components/ui/card';

const ServiceTaxPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isEmployee = user?.role === 'employee' || user?.role === 'bde' || user?.role === 'Bde';

  // Redirect HR users away from this page
  React.useEffect(() => {
    if (user?.role === 'hr') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user?.role === 'hr') return null;

  return (
    <div>
      <div className="relative z-10">
        {!isEmployee ? (
          <div className='space-y-6'>
            <ServiceTaxReport />
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent'>
                  Service Tax Management
                </h1>
                <p className='text-sm text-gray-500 mt-1 font-medium'>
                  View your service tax payment status
                </p>
              </div>
            </div>

            {/* Content Content - Status & History */}
            <div className='grid gap-6'>
              {/* Status Section */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
                <ServiceTaxStatus />
              </div>

              {/* History Section */}
              <ServiceTaxHistory className='bg-white rounded-2xl shadow-xl ring-1 ring-black/5' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceTaxPage;
