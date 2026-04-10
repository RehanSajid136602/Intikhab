'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatPKR } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types/order';

const statusColors: Record<OrderStatus, 'yellow' | 'blue' | 'purple' | 'green'> = {
  Pending: 'yellow',
  Processing: 'blue',
  Shipped: 'purple',
  Delivered: 'green',
};

interface RecentOrdersProps {
  orders: Order[];
}

/**
 * Recent orders table with TanStack Table v8: sorting, search, pagination, status badges.
 */
function RecentOrders({ orders }: RecentOrdersProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Order>[] = [
    { accessorKey: 'id', header: 'Order ID', cell: (info) => `#${info.getValue()}` },
    { accessorKey: 'customerName', header: 'Customer' },
    {
      accessorKey: 'items',
      header: 'Products',
      cell: (info) =>
        (info.getValue() as Order['items'])
          .map((item) => item.name.split('—')[0].trim())
          .join(', '),
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: (info) => formatPKR(info.getValue() as number),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => (
        <Badge color={statusColors[info.getValue() as OrderStatus]}>
          {info.getValue() as string}
        </Badge>
      ),
    },
    { accessorKey: 'date', header: 'Date' },
  ];

  const table = useReactTable({
    data: orders.slice(0, 10),
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white rounded-sm border border-brand-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">
          Recent Orders
        </h3>
        <div className="relative">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search orders..."
            className="border border-brand-border pl-9 pr-4 py-2 text-sm outline-none focus:border-brand-dark w-56"
          />
          <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-brand-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-3 px-4 font-semibold text-brand-dark cursor-pointer hover:bg-brand-light-gray"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{ asc: ' ↑', desc: ' ↓' }[
                      header.column.getIsSorted() as string
                    ] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-brand-border hover:bg-brand-light-gray/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-brand-gray">
          Showing {table.getRowModel().rows.length} of {orders.slice(0, 10).length} orders
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-xs border border-brand-border disabled:opacity-50 hover:bg-brand-light-gray transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-xs border border-brand-border disabled:opacity-50 hover:bg-brand-light-gray transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export { RecentOrders };
export type { RecentOrdersProps };
