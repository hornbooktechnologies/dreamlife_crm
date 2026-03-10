import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FolderPlus, RefreshCcw, Download, Filter } from "lucide-react";
import { exportCSV } from '../lib/utils/exportCSV';
import CreateOrEditProjectForm from '../components/projects/CreateOrEditProjectForm';
import ProjectsTableBody from '../components/projects/ProjectsTableBody';
import { requestHandler } from '../lib/utils/network-client';
import useToast from '../hooks/useToast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip";

const ProjectManagement = () => {
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [projectsList, setProjectsList] = useState({
        projects: [],
        pagination: { current_page: 1, per_page: 10, total: 0, last_page: 1 },
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Filter State
    const [companies, setCompanies] = useState([]);
    const [companyFilter, setCompanyFilter] = useState('all');

    const fetchProjects = useCallback(async (page = 1, limit = 10) => {
        setIsLoading(true);
        try {
            const params = { page, limit };
            if (companyFilter && companyFilter !== 'all') {
                params.company_name = companyFilter;
            }

            const response = await requestHandler('/projects', {
                method: 'GET',
                params: params
            });

            if (response.success || response.projects) {
                let projectsData = [];
                let paginationMeta = {};

                if (response.projects) {
                    projectsData = response.projects;
                    paginationMeta = {
                        total: response.total,
                        page: response.page,
                        limit: response.limit,
                        totalPages: response.totalPages
                    };
                } else {
                    const responseData = response.data || {};
                    projectsData = Array.isArray(responseData) ? responseData : (responseData.data || []);
                    paginationMeta = responseData.pagination || {
                        total: projectsData.length,
                        page: page,
                        limit: limit,
                        totalPages: Math.ceil(projectsData.length / limit),
                    };
                }

                setProjectsList({
                    projects: projectsData,
                    pagination: {
                        current_page: paginationMeta.page,
                        per_page: paginationMeta.limit,
                        total: paginationMeta.total,
                        last_page: paginationMeta.totalPages,
                    },
                });
                setPagination({
                    current_page: paginationMeta.page,
                    per_page: paginationMeta.limit,
                    total: paginationMeta.total,
                    last_page: paginationMeta.totalPages,
                });
            } else {
                console.error("Failed to fetch projects");
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsLoading(false);
        }
    }, [companyFilter]);

    useEffect(() => {
        fetchProjects(1, 10);
    }, [fetchProjects]);

    const handlePageChange = (page) => {
        fetchProjects(page, pagination.per_page);
    };

    const handlePerPageChange = (newPerPage) => {
        fetchProjects(1, newPerPage);
    };

    const getProjectForEdit = async (id) => {
        try {
            const response = await requestHandler(`/projects/${id}`, {
                method: 'GET'
            });

            console.log("Edit Project Response:", response);

            if (response.success || response.id || response.data) {
                const projectData = response.data || response.project || (response.id ? response : null);

                if (projectData) {
                    setProjectToEdit(projectData);
                    setFormMode('edit');
                    setIsCreateProjectOpen(true);
                } else {
                    console.error("Project data not found in response:", response);
                    showErrorToast("Project details not found.");
                }
            } else {
                showErrorToast(response.message || "Failed to fetch project details");
            }
        } catch (error) {
            console.error("Error fetching project details:", error);
            showErrorToast("Error fetching project details");
        }
    };

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const { showSuccessToast, showErrorToast } = useToast();

    const confirmDelete = (id) => {
        if (!id) return;
        setProjectToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    // Fetch Companies for Filter
    const fetchCompanies = useCallback(async () => {
        try {
            const response = await requestHandler('/projects/companies', { method: 'GET' });
            let fetchedCompanies = [];
            if (Array.isArray(response)) {
                fetchedCompanies = response;
            } else if (response && Array.isArray(response.data)) {
                fetchedCompanies = response.data;
            } else if (response && Array.isArray(response.companies)) {
                fetchedCompanies = response.companies;
            }
            setCompanies(fetchedCompanies.filter(Boolean));
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const executeDelete = async () => {
        if (!projectToDelete) return;

        try {
            const response = await requestHandler(`/projects/${projectToDelete}`, {
                method: 'DELETE',
            });

            if (response.success ||
                (response.message && response.message.toLowerCase().includes('success'))) {

                showSuccessToast(response.message || 'Project deleted successfully');
                fetchProjects(pagination.current_page, pagination.per_page);
                // Also refresh companies list in case the deleted project was the last one for a company
                fetchCompanies();
            } else {
                showErrorToast(response.message || 'Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            showErrorToast('Something went wrong while deleting project');
        } finally {
            setIsDeleteDialogOpen(false);
            setProjectToDelete(null);
        }
    };

    const handleExportCSV = () => {
        const dataToExport = projectsList.projects.map(project => ({
            'Project Name': project.project_name,
            'Company Name': project.company_name || 'N/A',
            'Start Date': project.start_date ? new Date(project.start_date).toLocaleDateString('en-GB') : 'N/A',
            'End Date': project.end_date ? new Date(project.end_date).toLocaleDateString('en-GB') : 'N/A',
            'Project Lead': project.project_lead_name || project.project_lead || 'N/A',
            'Developers': project.project_developer_name || project.project_developer || 'N/A',
            'Technology': project.project_technology || 'N/A',
            'Status': project.status || 'Active'
        }));

        exportCSV('projects_list.csv', dataToExport);
        showSuccessToast('Projects exported successfully');
    };

    return (
        <div>
            {/* Page Header - Outside Card */}
            <div className="flex flex-row items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent pb-2">
                        Project Management
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        Manage your projects here
                    </p>
                </div>

                {/* Add Project Button */}
                <Button
                    onClick={() => {
                        setFormMode('create');
                        setProjectToEdit(null);
                        setIsCreateProjectOpen(true);
                    }}
                    className="h-10 px-4 sm:px-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] 
                              text-white font-semibold gap-2
                              shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                              hover:-translate-y-0.5 transition-all duration-200
                              active:scale-95"
                >
                    <FolderPlus size={18} />
                    <span className="hidden sm:inline">Add Project</span>
                </Button>
            </div>

            {/* Table Card with Glass Effect */}
            <Card
                className="border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 ring-1 ring-black/5"
                style={{
                    boxShadow:
                        "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
            >
                {/* Toolbar: Actions on Right */}
                <div className="flex flex-row sm:flex-row items-start sm:items-center justify-end gap-2 p-4 pb-0 sm:p-6 sm:pb-0 flex-wrap">
                    {/* Company Filter Dropdown */}
                    <div className='flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1.5'>
                        <div className='flex items-center gap-1.5'>
                            <Filter className='w-4 h-4 text-blue-600' />
                        </div>
                        <div className='w-[140px] sm:w-[160px]'>
                            <Select
                                value={companyFilter}
                                onValueChange={(value) => setCompanyFilter(value)}
                            >
                                <SelectTrigger
                                    className='h-8 border-2 border-blue-300 bg-white hover:bg-blue-50 text-blue-900 hover:border-blue-400 transition-all duration-200 font-semibold text-xs sm:text-sm shadow-sm'
                                >
                                    <SelectValue placeholder='All Companies' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Companies</SelectItem>
                                    {companies.map((company) => (
                                        <SelectItem key={company} value={company}>
                                            {company}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Refresh and Export Buttons */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        fetchProjects(pagination.current_page, pagination.per_page);
                                        setRefreshTrigger((prev) => prev + 1);
                                    }}
                                    className="h-10 w-10 p-0 border-2 border-gray-200 bg-white hover:bg-blue-50 
                                              text-gray-700 hover:text-[#5283c5] hover:border-[#5283c5]
                                              transition-all duration-200 shadow-sm hover:shadow-md group flex items-center justify-center"
                                >
                                    <RefreshCcw size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Refresh project data</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleExportCSV}
                                    variant="outline"
                                    className="h-10 w-10 p-0 border-2 border-gray-200 bg-white hover:bg-blue-50 
                                              text-gray-700 hover:text-[#5283c5] hover:border-[#5283c5]
                                              transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                                >
                                    <Download size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Export CSV</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <CardContent className="p-2 sm:p-6 overflow-x-auto">
                    <ProjectsTableBody
                        projects={projectsList.projects}
                        loading={isLoading}
                        pagination={pagination}
                        handlePageChange={handlePageChange}
                        handlePerPageChange={handlePerPageChange}
                        setFormMode={setFormMode}
                        setIsCreateEditProjectDialogOpen={setIsCreateProjectOpen}
                        getProjectForEdit={getProjectForEdit}
                        deleteProject={confirmDelete}
                        resetSortTrigger={refreshTrigger}
                    />
                </CardContent>
            </Card>

            <CreateOrEditProjectForm
                isOpen={isCreateProjectOpen}
                setIsOpen={setIsCreateProjectOpen}
                type={formMode}
                editableProject={projectToEdit}
                fetchProjects={() => {
                    fetchProjects(pagination.current_page, pagination.per_page);
                    fetchCompanies(); // Refresh filter list after create/update
                }}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="w-[90%] sm:max-w-lg rounded-xl">
                    <AlertDialogHeader className="!text-left mb-4">
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this project? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="!flex-row !justify-end gap-3">
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} className="!mt-0">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeDelete}
                            className='bg-red-600 hover:bg-red-700'
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectManagement;
