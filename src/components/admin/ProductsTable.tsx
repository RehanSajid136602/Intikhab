'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Search, Plus, Trash2, Edit, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminStore } from '@/stores/adminStore';
import { formatPKR } from '@/lib/utils';
import type { Product } from '@/types/product';

interface ProductsTableProps {
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
}

/**
 * Products management table with TanStack Table v8: image thumbnails,
 * category filter, search, sorting, status toggle, row selection, bulk delete.
 * Fetches products from Supabase via adminStore API wrapper.
 */
function ProductsTable({ onAddProduct, onEditProduct }: ProductsTableProps) {
  const { products, productsLoading, fetchProducts, updateProduct, deleteProduct } = useAdminStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const columns: ColumnDef<Product>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className="w-4 h-4"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className="w-4 h-4"
        />
      ),
    },
    {
      accessorKey: 'images',
      header: 'Image',
      cell: (info) => {
        const images = info.getValue() as string[];
        return (
          <div className="w-10 h-10 bg-brand-light-gray rounded-sm overflow-hidden flex-shrink-0">
            <Image
              src={images[0]}
              alt=""
              width={40}
              height={40}
              className="w-full h-full object-contain"
              sizes="40px"
              quality={80}
            />
          </div>
        );
      },
    },
    { accessorKey: 'name', header: 'Product Name' },
    { accessorKey: 'sku', header: 'SKU' },
    {
      accessorKey: 'category',
      header: 'Category',
      filterFn: (row, _columnId, filterValue: string) => {
        if (!filterValue) return true;
        return (row.getValue('category') as string) === filterValue;
      },
      cell: (info) => (
        <span className="capitalize">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: (info) => formatPKR(info.getValue() as number),
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: (info) => {
        const stock = info.getValue() as number;
        return (
          <span className={stock < 5 ? 'text-brand-red font-semibold' : ''}>
            {stock}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as string;
        const product = info.row.original;

        return (
          <button
            onClick={async () => {
              const newStatus = status === 'active' ? 'draft' : 'active';
              await updateProduct(product.id, { status: newStatus as 'active' | 'draft' });
              toast.success(`Product ${newStatus === 'active' ? 'activated' : 'set to draft'}`);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-sm uppercase transition-colors ${
              status === 'active'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditProduct(product)}
              className="p-1 text-brand-gray hover:text-brand-dark transition-colors"
              aria-label="Edit product"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={async () => {
                if (confirm(`Delete "${product.name}"?`)) {
                  await deleteProduct(product.id);
                  toast.success('Product deleted');
                }
              }}
              className="p-1 text-brand-gray hover:text-brand-red transition-colors"
              aria-label="Delete product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, columnFilters, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const handleBulkDelete = async () => {
    if (selectedCount === 0) return;
    if (!confirm(`Delete ${selectedCount} selected products?`)) return;

    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((r) => r.original.id);
    for (const id of selectedIds) {
      await deleteProduct(id);
    }
    setRowSelection({});
    toast.success(`${selectedCount} products deleted`);
  };

  return (
    <div className="bg-white rounded-sm border border-brand-border p-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-brand-dark">
            Products
          </h2>
          <p className="text-xs text-brand-gray">
            {products.length} total
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search products..."
              className="border border-brand-border pl-9 pr-4 py-2 text-sm outline-none focus:border-brand-dark w-full sm:w-56"
            />
            <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={
                (columnFilters.find((f) => f.id === 'category')
                  ?.value as string) || ''
              }
              onChange={(e) => {
                const existing = columnFilters.find((f) => f.id === 'category');
                if (existing) {
                  setColumnFilters(
                    columnFilters.map((f) =>
                      f.id === 'category' ? { ...f, value: e.target.value } : f,
                    ),
                  );
                } else {
                  setColumnFilters([
                    ...columnFilters,
                    { id: 'category', value: e.target.value },
                  ]);
                }
              }}
              className="border border-brand-border pl-3 pr-8 py-2 text-sm outline-none focus:border-brand-dark appearance-none bg-white"
            >
              <option value="">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
            <ChevronDown className="w-4 h-4 text-brand-gray absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Bulk Delete */}
          {selectedCount > 0 && (
            <button
              onClick={handleBulkDelete}
              className="p-2 text-brand-red hover:bg-red-50 rounded-sm transition-colors"
              aria-label="Bulk delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Add Product */}
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            ADD PRODUCT
          </button>
        </div>
      </div>

      {/* Table */}
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
            {productsLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-sm text-brand-gray">
                  Loading products...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-sm text-brand-gray">
                  No products found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-brand-border hover:bg-brand-light-gray/50 ${
                  row.getIsSelected() ? 'bg-brand-light-gray' : ''
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-brand-gray">
          Showing {table.getRowModel().rows.length} of {products.length} products
          {selectedCount > 0 && ` | ${selectedCount} selected`}
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

export { ProductsTable };
export type { ProductsTableProps };
