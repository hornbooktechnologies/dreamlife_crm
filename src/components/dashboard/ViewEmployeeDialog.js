import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Mail, Phone, MapPin, Calendar, Users, FileText, Briefcase, User, Linkedin, Github, Copy } from 'lucide-react';
import useToast from '../../hooks/useToast';

const ViewEmployeeDialog = ({ isOpen, setIsOpen, employee }) => {
    if (!employee) return null;

    const renderStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-700 border border-green-200',
            inactive: 'bg-red-100 text-red-700 border border-red-200',
        };
        return (
            <Badge className={`capitalize px-3 py-1 font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {status}
            </Badge>
        );
    };

    const InfoCard = ({ icon: Icon, label, value, isLink = false, linkType = 'email', iconColor = 'text-blue-500', showCopy = false }) => {
        const { showSuccessToast } = useToast();

        const handleCopy = async (text) => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                    showSuccessToast(`${label} copied to clipboard`);
                } else {
                    // Fallback for non-secure contexts or older browsers
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-9999px";
                    textArea.style.top = "0";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        showSuccessToast(`${label} copied to clipboard`);
                    } catch (err) {
                        console.error('Fallback copy failed', err);
                    }
                    document.body.removeChild(textArea);
                }
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        };

        return (
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group relative">
                <div className={`mt-0.5 ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
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
                {value && showCopy && (
                    <button
                        onClick={() => handleCopy(value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                        title={`Copy ${label}`}
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        );
    };

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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0 border-0 shadow-2xl [&>button]:!text-white [&>button]:top-5 [&>button]:right-5 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button]:transition-all [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button>svg]:stroke-[3]">
                {/* Gradient Header */}
                <DialogHeader className="bg-gradient-to-r from-primary via-primary-hover to-primary text-white p-6 pb-8 !text-left !items-start">
                    <DialogTitle className="text-2xl font-bold">Employee Details</DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 pb-6">
                    {/* Profile Section */}
                    <div className="relative mb-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Profile Image */}
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-100 to-purple-100 ring-4 ring-blue-50">
                                        {employee.user_image ? (
                                            <img src={employee.user_image} alt="Profile" loading='eager' className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-600 bg-gradient-to-br from-blue-50 to-purple-50">
                                                {employee.first_name?.[0]}{employee.last_name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md border-2 border-blue-100">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="text-center sm:text-left flex-1">
                                    <div className="mb-2">
                                        <h2 className="text-3xl font-bold text-gray-900 inline-flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                                            {employee.first_name} {employee.last_name}
                                            {employee.employee_tag_id && (
                                                <span className="text-lg font-medium text-gray-500">
                                                    ({employee.employee_tag_id})
                                                </span>
                                            )}
                                        </h2>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                                        <Briefcase className="w-4 h-4 text-purple-600" />
                                        <p className="text-lg font-semibold text-purple-600">{employee.designation || 'No Designation'}</p>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        {renderStatusBadge(employee.status)}
                                        {employee.joining_date && (
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>Joined {new Date(employee.joining_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-3 border-b border-blue-200">
                                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide flex items-center gap-2">
                                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                                    Personal Information
                                </h3>
                            </div>
                            <div className="p-4 space-y-1">
                                <InfoCard icon={User} label="First Name" value={employee.first_name} iconColor="text-blue-500" />
                                <InfoCard icon={User} label="Last Name" value={employee.last_name} iconColor="text-blue-500" />
                                <InfoCard icon={Calendar} label="Date of Birth" value={employee.dob ? new Date(employee.dob).toLocaleDateString('en-GB') : 'N/A'} iconColor="text-pink-500" />
                                <InfoCard icon={Mail} label="Personal Email" value={employee.email} isLink={true} iconColor="text-green-500" showCopy={true} />
                                <InfoCard icon={Phone} label="Phone Number" value={employee.phone_number} iconColor="text-purple-500" showCopy={true} />
                                <InfoCard icon={MapPin} label="Address" value={employee.address} iconColor="text-red-500" />
                            </div>
                        </div>

                        {/* Employment Details Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-5 py-3 border-b border-purple-200">
                                <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide flex items-center gap-2">
                                    <div className="w-1 h-5 bg-purple-600 rounded-full"></div>
                                    Employment Details
                                </h3>
                            </div>
                            <div className="p-4 space-y-1">
                                <InfoCard icon={Mail} label="Company Email" value={employee.company_email} isLink={true} iconColor="text-blue-500" showCopy={true} />
                                <InfoCard icon={Calendar} label="Joining Date" value={employee.joining_date ? new Date(employee.joining_date).toLocaleDateString('en-GB') : 'N/A'} iconColor="text-green-500" />
                                <InfoCard icon={Phone} label="Emergency Contact" value={employee.emergency_contact} iconColor="text-red-500" showCopy={true} />
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
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-5 py-3 border-b border-orange-200">
                            <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wide flex items-center gap-2">
                                <div className="w-1 h-5 bg-orange-600 rounded-full"></div>
                                Documents
                            </h3>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DocumentCard src={employee.aadhar_card_image} alt="Aadhar Card" label="Aadhar Card" />
                                <DocumentCard src={employee.pan_card_image} alt="PAN Card" label="PAN Card" />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewEmployeeDialog;

