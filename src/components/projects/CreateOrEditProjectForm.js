import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { requestHandler } from '../../lib/utils/network-client';
import useToast from '../../hooks/useToast';
import { Calendar, ChevronDown, Check, Search } from 'lucide-react';

const getSchema = (type) =>
    z.object({
        company_name: z.string().min(1, 'Please enter company name'),
        project_name: z.string().min(1, 'Please enter project name'),
        start_date: z.string().min(1, 'Please select start date'),
        project_lead: z.string().min(1, 'Please select project lead'),
        project_developer: z.string().min(1, 'Please select a developer'),
        project_technology: z.string().min(1, 'Please enter project technology'),
        status: z.string().min(1, 'Please select status'),
        end_date: z.string().optional().or(z.literal('')),
    });

const CreateOrEditProjectForm = ({
    setIsOpen,
    isOpen,
    type,
    editableProject,
    fetchProjects,
}) => {
    const { showSuccessToast, showErrorToast } = useToast();
    const [users, setUsers] = useState([]);
    const [projectLeads, setProjectLeads] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [leadSearchQuery, setLeadSearchQuery] = useState('');

    // State for dynamic full-width dropdown
    const [menuWidth, setMenuWidth] = useState(null);
    const containerRef = useRef(null);
    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

    // Fetch users AND project leads for dropdowns
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                // Fetch Leads (for both leads and developers)
                const leadsResponse = await requestHandler('/projects/leads', {
                    method: 'GET'
                });

                let fetchedData = [];
                if (Array.isArray(leadsResponse)) {
                    fetchedData = leadsResponse;
                } else if (leadsResponse.success) {
                    const leadsData = leadsResponse.data || [];
                    fetchedData = Array.isArray(leadsData) ? leadsData : [];
                }
                setUsers(fetchedData);
                setProjectLeads(fetchedData);

                // Fetch Companies List
                // Fetch Companies List
                const companiesResponse = await requestHandler('/projects/companies', {
                    method: 'GET'
                });

                let fetchedCompanies = [];
                if (Array.isArray(companiesResponse)) {
                    fetchedCompanies = companiesResponse;
                } else if (companiesResponse && Array.isArray(companiesResponse.data)) {
                    fetchedCompanies = companiesResponse.data;
                } else if (companiesResponse && Array.isArray(companiesResponse.companies)) {
                    fetchedCompanies = companiesResponse.companies;
                }
                setCompanies(fetchedCompanies.filter(Boolean));

            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };
        if (isOpen) {
            fetchDropdownData();
        }
    }, [isOpen]);

    // Update menu width when modal opens or companies loaded
    useEffect(() => {
        if (containerRef.current) {
            setMenuWidth(containerRef.current.offsetWidth);
        }
    }, [isOpen, companies]);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(getSchema(type)),
        defaultValues: {
            company_name: '',
            project_name: '',
            start_date: '',
            project_lead: '',
            project_developer: '',
            project_technology: '',
            status: 'active',
            end_date: '',
        },
    });

    useEffect(() => {
        if (type === 'edit' && editableProject) {
            reset({
                company_name: editableProject.company_name || '',
                project_name: editableProject.project_name,
                start_date: editableProject.start_date,
                project_lead: editableProject.project_lead,
                project_developer: editableProject.project_developer || '',
                project_technology: editableProject.project_technology,
                status: editableProject.status || 'active',
                end_date: editableProject.end_date || '',
            });
        } else {
            reset({
                company_name: '',
                project_name: '',
                start_date: '',
                project_lead: '',
                project_developer: '',
                project_technology: '',
                status: 'active',
                end_date: '',
            });
        }
    }, [type, editableProject, reset, isOpen]);

    const onSubmit = async (data) => {
        try {
            const url = type === 'edit' ? `/projects/${editableProject.id}` : '/projects';
            const method = type === 'edit' ? 'PUT' : 'POST';
            const requestBody = { ...data };

            console.log("Submitting Project:", requestBody);

            const response = await requestHandler(url, {
                method: method,
                body: requestBody
            });

            console.log("Submit Response:", response);

            if (response.success ||
                (response.message && response.message.toLowerCase().includes('success')) ||
                response.id) {

                showSuccessToast(response.message || `Project ${type === 'edit' ? 'updated' : 'created'} successfully`);
                setIsOpen(false);
                if (fetchProjects) fetchProjects();
            } else {
                showErrorToast(response.message || 'Operation failed');
            }
        } catch (error) {
            console.error("Submit Error:", error);
            showErrorToast('Something went wrong');
        }
    };

    const selectedDeveloper = watch('project_developer') || '';

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[95vw] sm:max-w-[550px] max-h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl flex flex-col text-left [&>button]:!text-white [&>button]:top-5 [&>button]:right-5 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button]:transition-all [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button>svg]:stroke-[3]">
                {/* Header with Gradient */}
                <DialogHeader className="p-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shrink-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {type === 'edit' ? 'Edit Project' : 'Add New Project'}
                    </DialogTitle>
                    <p className="text-blue-50 text-sm mt-1 text-left">
                        {type === 'edit'
                            ? 'Update the information below to modify the project details.'
                            : 'Fill in the details below to create a new project.'}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                    {type === 'edit' && !editableProject ? (
                        <div className='flex-1 flex items-center justify-center p-12 min-h-[300px]'>
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name" className="text-gray-700 font-semibold">
                                        Company Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="company_name"
                                        render={({ field }) => (
                                            <div className="relative group" ref={containerRef}>
                                                <DropdownMenu open={isCompanyDropdownOpen} onOpenChange={setIsCompanyDropdownOpen} modal={false}>
                                                    <DropdownMenuTrigger asChild>
                                                        {/* Hidden trigger anchor, controlled via state */}
                                                        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-0" />
                                                    </DropdownMenuTrigger>

                                                    <Input
                                                        {...field}
                                                        id="company_name"
                                                        placeholder="Enter company name"
                                                        className="border-gray-300 focus:border-[#3a5f9e] pr-10 cursor-pointer relative z-10 bg-transparent"
                                                        autoComplete="off"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsCompanyDropdownOpen(true);
                                                        }}
                                                        onFocus={() => {
                                                            // Only calculate width, do NOT auto-open on focus to respect "I don't want to open" complaint
                                                            if (containerRef.current) setMenuWidth(containerRef.current.offsetWidth);
                                                        }}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            if (!isCompanyDropdownOpen) setIsCompanyDropdownOpen(true);
                                                        }}
                                                    />

                                                    <div className="absolute right-0 top-0 h-full flex items-center z-20">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            className="h-full px-3 hover:bg-transparent text-gray-400 hover:text-[#3a5f9e] focus:ring-0 active:scale-95 transition-transform"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
                                                                if (containerRef.current) setMenuWidth(containerRef.current.offsetWidth);
                                                            }}
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <DropdownMenuContent
                                                        align="start"
                                                        sideOffset={5}
                                                        style={{ width: menuWidth ? `${menuWidth}px` : 'auto' }}
                                                        className="max-h-60 overflow-y-auto bg-white p-1 shadow-lg border border-gray-100 z-50"
                                                        onOpenAutoFocus={(e) => e.preventDefault()} // Keeps focus on input when opening
                                                        onCloseAutoFocus={(e) => e.preventDefault()}
                                                    >
                                                        <DropdownMenuLabel className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Existing Companies
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="my-1 bg-gray-100" />
                                                        <div className="py-1">
                                                            {companies.length > 0 ? (
                                                                companies
                                                                    .filter(c => !field.value || c.toLowerCase().includes((field.value || '').toLowerCase()))
                                                                    .map((comp) => (
                                                                        <DropdownMenuItem
                                                                            key={comp}
                                                                            onClick={() => {
                                                                                field.onChange(comp);
                                                                                setIsCompanyDropdownOpen(false);
                                                                            }}
                                                                            className={`cursor-pointer text-sm py-2.5 px-3 rounded-md mx-1 my-0.5 transition-colors 
                                                                                hover:bg-gray-50 focus:bg-[#3a5f9e]/5 focus:text-[#3a5f9e]
                                                                                ${field.value === comp ? 'bg-[#3a5f9e]/10 text-[#3a5f9e]' : ''}`}
                                                                        >
                                                                            {comp}
                                                                            {field.value === comp && <Check className="ml-auto h-4 w-4 text-[#3a5f9e]" />}
                                                                        </DropdownMenuItem>
                                                                    ))
                                                            ) : (
                                                                <div className="p-3 text-sm text-gray-500 text-center italic">No companies available</div>
                                                            )}
                                                        </div>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        )}
                                    />
                                    {errors.company_name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="project_name" className="text-gray-700 font-semibold">
                                        Project Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="project_name"
                                        placeholder="Enter project name"
                                        {...register('project_name')}
                                        className="border-gray-300 focus:border-[#3a5f9e]"
                                    />
                                    {errors.project_name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.project_name.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-semibold">
                                            Start Date <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative group">
                                            <Input
                                                type="text"
                                                readOnly
                                                placeholder="DD-MM-YYYY"
                                                value={(() => {
                                                    const val = watch('start_date');
                                                    if (!val) return '';
                                                    const [y, m, d] = val.split('-');
                                                    return `${d}-${m}-${y}`;
                                                })()}
                                                className="h-10 pr-10 border-gray-300 text-gray-900 placeholder:text-gray-400 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none group-hover:text-[#3a5f9e] transition-colors" />
                                            <Input
                                                id="start_date"
                                                type="date"
                                                {...register('start_date')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                style={{ colorScheme: 'light' }}
                                                onClick={(e) => {
                                                    try {
                                                        if (e.target.showPicker) e.target.showPicker();
                                                    } catch (err) { }
                                                }}
                                            />
                                        </div>
                                        {errors.start_date && (
                                            <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-semibold">
                                            End Date <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
                                        </Label>
                                        <div className="relative group">
                                            <Input
                                                type="text"
                                                readOnly
                                                placeholder="DD-MM-YYYY"
                                                value={(() => {
                                                    const val = watch('end_date');
                                                    if (!val) return '';
                                                    const [y, m, d] = val.split('-');
                                                    return `${d}-${m}-${y}`;
                                                })()}
                                                className="h-10 pr-10 border-gray-300 text-gray-900 placeholder:text-gray-400 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none group-hover:text-[#3a5f9e] transition-colors" />
                                            <Input
                                                id="end_date"
                                                type="date"
                                                {...register('end_date')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                style={{ colorScheme: 'light' }}
                                                onClick={(e) => {
                                                    try {
                                                        if (e.target.showPicker) e.target.showPicker();
                                                    } catch (err) { }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div className="space-y-2">
                                        <Label htmlFor="project_lead" className="text-gray-700 font-semibold">
                                            Project Lead <span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name="project_lead"
                                            render={({ field }) => (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="w-full justify-between items-center font-normal border-gray-300 hover:bg-white focus:border-[#3a5f9e]">
                                                            {field.value ? field.value : "Select Lead"}
                                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-72 p-0 flex flex-col overflow-hidden">
                                                        <div className="p-2 bg-white z-10 border-b shrink-0">
                                                            <div className="relative">
                                                                <Input
                                                                    placeholder="Search lead..."
                                                                    value={leadSearchQuery}
                                                                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                                                                    className="h-8 text-sm pr-8"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onKeyDown={(e) => e.stopPropagation()}
                                                                />
                                                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                            </div>
                                                        </div>
                                                        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground shrink-0">
                                                            Leads List
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="shrink-0" />
                                                        <div className="overflow-y-auto flex-1 min-h-0">
                                                            {projectLeads
                                                                .filter(lead => {
                                                                    const fullName = `${lead.first_name} ${lead.last_name}`.toLowerCase();
                                                                    return fullName.includes(leadSearchQuery.toLowerCase());
                                                                })
                                                                .map(lead => {
                                                                    const leadName = `${lead.first_name} ${lead.last_name}`;
                                                                    return (
                                                                        <DropdownMenuCheckboxItem
                                                                            key={lead.id}
                                                                            checked={field.value === leadName}
                                                                            onCheckedChange={() => {
                                                                                field.onChange(leadName);
                                                                            }}
                                                                            className="cursor-pointer focus:bg-[#3a5f9e]/10 focus:text-[#3a5f9e] data-[state=checked]:bg-[#3a5f9e]/20 data-[state=checked]:text-[#3a5f9e]"
                                                                        >
                                                                            {leadName}
                                                                        </DropdownMenuCheckboxItem>
                                                                    );
                                                                })}
                                                            {projectLeads.filter(lead => `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(leadSearchQuery.toLowerCase())).length === 0 && (
                                                                <div className="p-2 text-sm text-gray-500 text-center">No leads found</div>
                                                            )}
                                                        </div>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        />
                                        {errors.project_lead && (
                                            <p className="text-red-500 text-xs mt-1">{errors.project_lead.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-semibold">
                                            Project Work In (Developer) <span className="text-red-500">*</span>
                                        </Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between items-center font-normal border-gray-300 hover:bg-white focus:border-[#3a5f9e]">
                                                    {selectedDeveloper ? selectedDeveloper : "Select Developer"}
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-72 p-0 flex flex-col overflow-hidden">
                                                <div className="p-2 bg-white z-10 border-b shrink-0">
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="Search developers..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="h-8 text-sm pr-8"
                                                            onClick={(e) => e.stopPropagation()}
                                                            onKeyDown={(e) => e.stopPropagation()} // Prevent closing on key press
                                                        />
                                                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground shrink-0">
                                                    Developers List
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator className="shrink-0" />
                                                <div className="overflow-y-auto flex-1 min-h-0">
                                                    {users
                                                        .filter(user => {
                                                            const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
                                                            return fullName.includes(searchQuery.toLowerCase());
                                                        })
                                                        .map((user) => {
                                                            const userName = `${user.first_name} ${user.last_name}`;
                                                            const isSelected = selectedDeveloper === userName;
                                                            return (
                                                                <DropdownMenuCheckboxItem
                                                                    key={user.id}
                                                                    checked={isSelected}
                                                                    onCheckedChange={() => {
                                                                        setValue('project_developer', userName, { shouldValidate: true });
                                                                    }}
                                                                    className="cursor-pointer focus:bg-[#3a5f9e]/10 focus:text-[#3a5f9e] data-[state=checked]:bg-[#3a5f9e]/20 data-[state=checked]:text-[#3a5f9e]"
                                                                >
                                                                    {userName}
                                                                </DropdownMenuCheckboxItem>
                                                            );
                                                        })}
                                                    {users.filter(user => `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                                        <div className="p-2 text-sm text-gray-500 text-center">No developers found</div>
                                                    )}
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        {errors.project_developer && (
                                            <p className="text-red-500 text-xs mt-1">{errors.project_developer.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="project_technology" className="text-gray-700 font-semibold">
                                            Project Technology <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="project_technology"
                                            placeholder="React, Node.js, etc."
                                            {...register('project_technology')}
                                            className="border-gray-300 focus:border-[#3a5f9e]"
                                        />
                                        {errors.project_technology && (
                                            <p className="text-red-500 text-xs mt-1">{errors.project_technology.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-gray-700 font-semibold">
                                            Status <span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name="status"
                                            render={({ field }) => (
                                                <Select
                                                    key={field.value}
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className="h-10 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-[#3a5f9e] text-gray-900">
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">
                                                            <span className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                                Active
                                                            </span>
                                                        </SelectItem>
                                                        <SelectItem value="inactive">
                                                            <span className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                                Inactive
                                                            </span>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.status && (
                                            <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="p-6 border-t bg-gray-50/50 mt-auto flex flex-col gap-3 sm:flex-row sm:gap-2 sm:justify-end">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white">
                                    {isSubmitting ? "Saving..." : type === 'edit' ? "Update Project" : "Create Project"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateOrEditProjectForm;
