import React, { useMemo } from 'react';
import ReusableDataTable from '../common/data-table/ReusableDataTable';
import { EllipsisVertical, UserRoundPen, Eye, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function EmployeeTable({
  employees,
  setFormMode,
  setIsCreateEditEmployeeDialogOpen,
  getEmployeeForEdit,
  handlePageChange,
  handlePerPageChange,
  onRowClick,
  pagination,
  loading,
  deleteEmployee,
  onViewEmployee,
  resetSortTrigger,
  selectedYear,
  userRole,
}) {
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            variant='secondary'
            className='capitalize bg-green-200 text-green-800'
          >
            {status}
          </Badge>
        );
      case 'inactive':
        return (
          <Badge
            variant='secondary'
            className='capitalize bg-red-200 text-red-800'
          >
            {status}
          </Badge>
        );
      default:
        return <span className='capitalize'>{status}</span>;
    }
  };

  const columns = useMemo(
    () => [
      // {
      //   field: 'index',
      //   headerName: 'Sr. No',
      //   width: '60px',
      //   sortable: false,
      //   renderCell: (params) => {
      //     const index = employees.findIndex((u) => u.id === params.row.id);
      //     return (
      //       (pagination?.current_page - 1) * (pagination?.per_page || 10) +
      //       index +
      //       1
      //     );
      //   },
      // },
      {
        field: 'employee_tag_id',
        headerName: 'Employee ID',
        width: '120px',
        renderCell: ({ value }) => (
          <span className='text-slate-600 font-medium'>{value || 'N/A'}</span>
        ),
      },
      {
        field: 'user_image',
        headerName: 'Profile',
        width: '80px',
        sortable: false,
        renderCell: ({ value }) =>
          value ? (
            <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-200'>
              <img
                src={value}
                alt='Profile'
                loading='eager'
                className='w-full h-full object-cover'
              />
            </div>
          ) : (
            <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center'>
              <UserRoundPen className='w-5 h-5 text-gray-400' />
            </div>
          ),
      },
      {
        field: 'first_name',
        headerName: 'Name',
        valueGetter: (value, row) => `${row.first_name} ${row.last_name}`,
        renderCell: (params) => (
          <span className='capitalize'>
            {params.row.first_name} {params.row.last_name}
          </span>
        ),
      },
      {
        field: 'email',
        headerName: 'Personal Email',
        renderCell: ({ value }) => (
          <span
            className='text-slate-600 font-semibold truncate max-w-[170px] block'
            title={value}
          >
            {value}
          </span>
        ),
      },

      {
        field: 'designation',
        headerName: 'Designation',
        renderCell: ({ value }) => (
          <span className='text-slate-600'>{value || 'N/A'}</span>
        ),
      },

      {
        field: 'phone_number',
        headerName: 'Phone Number',
        width: '150px',
        renderCell: ({ value }) => (
          <span className='text-slate-600'>{value || 'N/A'}</span>
        ),
      },

      {
        field: 'total_leave_used',
        headerName: 'Used Leave',
        width: '150px',
        renderCell: ({ value }) => (
          <span className='text-slate-600 font-medium'>{value ?? '0'}</span>
        ),
      },
      {
        field: 'role',
        headerName: 'Role',
        width: '120px',
        renderCell: ({ value }) => (
          <span className='capitalize font-medium text-slate-700'>
            {value === 'Bde' || value === 'bde' ? 'BDE' : value || 'N/A'}
          </span>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: '80px',
        sortable: true,
        renderCell: ({ value }) => renderStatusBadge(value),
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
        renderCell: ({ row }) => {
          const canEditDelete = userRole !== 'hr';

          return (
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
                  onClick={() => onViewEmployee(row)}
                >
                  <Eye className='w-4 h-4 text-green-500' />
                  <span className='font-medium'>View</span>
                </DropdownMenuItem>

                {canEditDelete && (
                  <>
                    <DropdownMenuItem
                      className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:bg-slate-100'
                      onClick={() => {
                        getEmployeeForEdit(row.id);
                      }}
                    >
                      <UserRoundPen className='w-4 h-4 text-blue-500' />
                      <span className='font-medium'>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='cursor-pointer flex items-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:bg-red-50'
                      onClick={() => deleteEmployee(row.id)}
                    >
                      <Trash2 className='w-4 h-4' />
                      <span className='font-medium'>Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [
      pagination,
      employees,
      setFormMode,
      setIsCreateEditEmployeeDialogOpen,
      getEmployeeForEdit,
    ],
  );

  return (
    <>
      <ReusableDataTable
        columns={columns}
        rows={employees || []}
        loading={loading}
        checkboxSelection={false}
        pageSize={10}
        handlePageChange={handlePageChange}
        handlePerPageChange={handlePerPageChange}
        emptyMessage='No employees available at the moment!'
        onRowClick={onRowClick}
        pagination={pagination}
        resetSortTrigger={resetSortTrigger}
      />
    </>
  );
}
