import React, { useMemo } from 'react';
import ReusableDataTable from '../common/data-table/ReusableDataTable';
import { EllipsisVertical, FilePenLine, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function ProjectsTableBody({
    projects,
    setFormMode,
    setIsCreateEditProjectDialogOpen,
    getProjectForEdit,
    handlePageChange,
    handlePerPageChange,
    pagination,
    loading,
    resetSortTrigger,
    deleteProject,
}) {

    const columns = useMemo(
        () => [
            {
                field: 'company_name',
                headerName: 'Company Name',
                renderCell: ({ value }) => (
                    <span className='font-semibold text-slate-800'>{value || 'N/A'}</span>
                ),
            },
            {
                field: 'project_name',
                headerName: 'Project Name',
                renderCell: ({ value }) => (
                    <span className='font-medium text-slate-700'>{value}</span>
                ),
            },
            {
                field: 'start_date',
                headerName: 'Start Date',
                renderCell: ({ value }) => {
                    if (!value || value === '0000-00-00') return <span className='text-slate-600'>N/A</span>;
                    const date = new Date(value);
                    return (
                        <span className='text-slate-600'>
                            {isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-GB')}
                        </span>
                    );
                },
            },
            {
                field: 'end_date',
                headerName: 'End Date',
                renderCell: ({ value }) => {
                    if (!value || value === '0000-00-00') return <span className='text-slate-600'>N/A</span>;
                    const date = new Date(value);
                    return (
                        <span className='text-slate-600'>
                            {isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-GB')}
                        </span>
                    );
                },
            },
            {
                field: 'project_lead',
                headerName: 'Project Lead',
                renderCell: ({ value, row }) => (
                    <span className='text-slate-600'>
                        {row.project_lead_name || value || 'N/A'}
                    </span>
                ),
            },
            {
                field: 'project_developer',
                headerName: 'Developers',
                renderCell: ({ value, row }) => (
                    <span className='text-slate-600 truncate w-48 block' title={row.project_developer_name || value}>
                        {row.project_developer_name || value || 'N/A'}
                    </span>
                ),
            },
            {
                field: 'project_technology',
                headerName: 'Technology',
                renderCell: ({ value }) => (
                    <span className='text-slate-600'>{value || 'N/A'}</span>
                ),
            },
            {
                field: 'status',
                headerName: 'Status',
                renderCell: ({ value }) => {
                    const status = value?.toLowerCase() || 'active';
                    const isActive = status === 'active';
                    return (
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {isActive ? 'Active' : 'Inactive'}
                        </div>
                    );
                },
            },
            {
                field: 'actions',
                headerName: 'Actions',
                width: '80px',
                sortable: false,
                align: 'center',
                sticky: 'right',
                cellClassName: 'pl-6 bg-white',
                headerClassName: 'pl-6 bg-white',
                renderCell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size='icon'
                                variant='ghost'
                                className='data-[state=open]:bg-muted h-8 w-8 p-0 hover:bg-slate-100 rounded-full transition-colors'
                            >
                                <EllipsisVertical className='h-4 w-4 text-slate-500 hover:text-slate-900' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align='end'
                            className='w-fit min-w-auto p-2 space-y-1 bg-white border border-slate-200 shadow-lg rounded-xl'
                        >
                            <DropdownMenuItem
                                className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:bg-slate-100'
                                onClick={() => {
                                    setFormMode?.('edit');
                                    setIsCreateEditProjectDialogOpen?.(true);
                                    getProjectForEdit(row.id);
                                }}
                            >
                                <FilePenLine className='w-4 h-4 text-blue-500' />
                                <span className='font-medium'>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:bg-red-50'
                                onClick={() => deleteProject(row.id)}
                            >
                                <Trash2 className='w-4 h-4' />
                                <span className='font-medium'>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [
            setFormMode,
            setIsCreateEditProjectDialogOpen,
            getProjectForEdit,
        ],
    );

    return (
        <>
            <ReusableDataTable
                columns={columns}
                rows={projects || []}
                loading={loading}
                checkboxSelection={false}
                pageSize={10}
                handlePageChange={handlePageChange}
                handlePerPageChange={handlePerPageChange}
                emptyMessage='No projects available at the moment!'
                pagination={pagination}
                resetSortTrigger={resetSortTrigger}
            />
        </>
    );
}
