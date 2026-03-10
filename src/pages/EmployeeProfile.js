import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Calendar, Briefcase,
    Building2, CreditCard, ArrowLeft, ShieldCheck, Heart,
    FileText, Linkedin, Github, Users
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { getEmployeeById } from '../services/employeeService';
import useToast from '../hooks/useToast';
import { format } from 'date-fns';
import { useAuthStore } from '../context/AuthContext';

const EmployeeProfile = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { showErrorToast } = useToast();

    useEffect(() => {
        if (user?.employee_id || user?.id) {
            fetchEmployeeDetails();
        }
    }, [user?.employee_id, user?.id]);

    const fetchEmployeeDetails = async () => {
        setIsLoading(true);
        try {
            const response = await getEmployeeById(user.employee_id || user.id);
            if (response.success) {
                setEmployee(response.data);
            } else {
                showErrorToast(response.message || 'Failed to fetch employee details');
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
            showErrorToast('Error loading employee details');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-700 border border-green-200',
            inactive: 'bg-red-100 text-red-700 border border-red-200',
        };
        return (
            <Badge className={`capitalize px-3 py-1 font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {status || 'Active'}
            </Badge>
        );
    };

    const InfoCard = ({ icon: Icon, label, value, isLink = false, linkType = 'email', iconColor = 'text-blue-500' }) => (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
            <div className={`mt-0.5 ${iconColor}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                {isLink && value ? (
                    <a
                        href={linkType === 'external' ? value : `mailto:${value}`}
                        target={linkType === 'external' ? '_blank' : '_self'}
                        rel={linkType === 'external' ? 'noopener noreferrer' : undefined}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline break-all block"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="text-sm font-semibold text-gray-900 break-words">{value || 'N/A'}</p>
                )}
            </div>
        </div>
    );

    const DocumentCard = ({ src, alt, label }) => (
        <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-orange-500" />
                {label}
            </Label>
            {src ? (
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                    onClick={() => window.open(src, '_blank')}>
                    <div className="relative h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        {src.toLowerCase().endsWith('.pdf') ? (
                            <iframe
                                src={src}
                                title={label}
                                className="w-full h-full object-cover pointer-events-none border-0"
                            />
                        ) : (
                            <img
                                src={src}
                                alt={alt}
                                loading='eager'
                                className="max-h-full max-w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-xs font-medium text-gray-700">Click to view</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium">No Document</p>
                </div>
            )}
        </div>
    );

    if (isLoading && !employee) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md w-full border border-slate-100">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <User className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h3>
                    <p className="text-slate-500 mb-8 font-medium">We couldn't retrieve your employee profile information.</p>
                    <Button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white hover:bg-slate-800 h-11 rounded-xl">Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="max-w-[1200px] mx-auto flex items-center gap-2 mb-6 px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-gray-500 hover:text-[#3a5f9e] rounded-full hover:bg-blue-50 transition-all duration-200 group"
                    title="Go Back"
                >
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent pb-1">
                    Profile
                </h1>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
                        {/* Profile Image */}
                        <div className="relative shrink-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-100 to-purple-100 ring-4 ring-white">
                                {employee.user_image ? (
                                    <img src={employee.user_image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-600 bg-gradient-to-br from-blue-50 to-purple-50">
                                        {employee.first_name?.[0]}{employee.last_name?.[0]}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="text-center sm:text-left flex-1 pt-1">
                            <div className="mb-1.5">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 inline-flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                                    {employee.first_name} {employee.last_name}
                                    {employee.employee_tag_id && (
                                        <span className="text-lg font-medium text-gray-400">
                                            ({employee.employee_tag_id})
                                        </span>
                                    )}
                                </h1>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                                <Briefcase className="w-4 h-4 text-purple-600" />
                                <p className="text-lg font-medium text-purple-600">{employee.designation || 'No Designation'}</p>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                                {renderStatusBadge(employee.status || 'active')}
                                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {employee.joining_date ? new Date(employee.joining_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                            <h3 className="text-base font-bold text-blue-900 uppercase tracking-wide flex items-center gap-2">
                                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                                Personal Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-2">
                            <InfoCard icon={User} label="First Name" value={employee.first_name} iconColor="text-blue-500" />
                            <InfoCard icon={User} label="Last Name" value={employee.last_name} iconColor="text-blue-500" />
                            <InfoCard icon={Calendar} label="Date of Birth" value={employee.dob ? new Date(employee.dob).toLocaleDateString('en-GB') : 'N/A'} iconColor="text-pink-500" />
                            <InfoCard icon={Mail} label="Personal Email" value={employee.email} isLink={true} iconColor="text-green-500" />
                            <InfoCard icon={Phone} label="Phone Number" value={employee.phone_number} iconColor="text-purple-500" />
                            <InfoCard icon={MapPin} label="Address" value={employee.address} iconColor="text-red-500" />
                        </div>
                    </div>

                    {/* Employment Details Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                            <h3 className="text-base font-bold text-purple-900 uppercase tracking-wide flex items-center gap-2">
                                <div className="w-1 h-5 bg-purple-600 rounded-full"></div>
                                Employment Details
                            </h3>
                        </div>
                        <div className="p-6 space-y-2">
                            <InfoCard icon={Mail} label="Company Email" value={employee.company_email} isLink={true} iconColor="text-blue-500" />
                            <InfoCard icon={Calendar} label="Joining Date" value={employee.joining_date ? new Date(employee.joining_date).toLocaleDateString('en-GB') : 'N/A'} iconColor="text-green-500" />
                            <InfoCard icon={Phone} label="Emergency Contact" value={employee.emergency_contact} iconColor="text-red-500" />
                            <InfoCard icon={Users} label="Relation" value={employee.emergency_contact_relation} iconColor="text-orange-500" />
                            {(employee.linkedin || employee.linkedin_link || employee.linkedin_url) && (
                                <InfoCard
                                    icon={Linkedin}
                                    label="LinkedIn"
                                    value={employee.linkedin || employee.linkedin_link || employee.linkedin_url}
                                    isLink={true}
                                    linkType="external"
                                    iconColor="text-blue-700"
                                />
                            )}
                            {(employee.github || employee.github_link || employee.github_url) && (
                                <InfoCard
                                    icon={Github}
                                    label="GitHub"
                                    value={employee.github || employee.github_link || employee.github_url}
                                    isLink={true}
                                    linkType="external"
                                    iconColor="text-gray-900"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
                        <h3 className="text-base font-bold text-orange-900 uppercase tracking-wide flex items-center gap-2">
                            <div className="w-1 h-5 bg-orange-600 rounded-full"></div>
                            Documents
                        </h3>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DocumentCard src={employee.aadhar_card_image} alt="Aadhar Card" label="Aadhar Card" />
                            <DocumentCard src={employee.pan_card_image} alt="PAN Card" label="PAN Card" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;

