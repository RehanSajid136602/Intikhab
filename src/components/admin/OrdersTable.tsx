"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
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
} from "@tanstack/react-table";
import { Search, Download, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/stores/adminStore";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatPKR } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

const statusColors: Record<
  OrderStatus,
  "yellow" | "blue" | "purple" | "green"
> = {
  Pending: "yellow",
  Processing: "blue",
  Shipped: "purple",
  Delivered: "green",
};

const statusTabs = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

/**
 * Admin orders table with status filter tabs, date range filter,
 * export button, and order detail modal.
 * Fetches orders from Supabase via adminStore API wrapper.
 */
function OrdersTable() {
  const { orders, ordersLoading, fetchOrders, updateOrderStatus } =
    useAdminStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const hasFetchedRef = useRef(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(globalFilter), 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Fetch orders on mount — only once, prevent double-fire in StrictMode
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchOrders();
    }
  }, []);

  // Memoized filtering to prevent expensive recalculations on every render
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "All" && order.status !== statusFilter) return false;
      if (dateFrom && order.date < dateFrom) return false;
      if (dateTo && order.date > dateTo) return false;
      if (debouncedFilter) {
        const q = debouncedFilter.toLowerCase();
        const searchStr =
          `${order.id} ${order.customerName} ${order.customerEmail} ${order.items.map((i) => i.name).join(" ")}`.toLowerCase();
        if (!searchStr.includes(q)) return false;
      }
      return true;
    });
  }, [orders, statusFilter, dateFrom, dateTo, debouncedFilter]);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: (info) => `#${info.getValue() as string}`,
    },
    { accessorKey: "customerName", header: "Customer" },
    {
      accessorKey: "items",
      header: "Products",
      cell: (info) =>
        (info.getValue() as Order["items"])
          .map((item) => item.name.split("—")[0].trim())
          .join(", "),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: (info) => formatPKR(info.getValue() as number),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => (
        <Badge color={statusColors[info.getValue() as OrderStatus]}>
          {info.getValue() as string}
        </Badge>
      ),
    },
    { accessorKey: "date", header: "Date" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedOrder(row.original)}
          className="text-xs text-brand-dark hover:text-brand-red transition-colors font-medium"
        >
          View
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleExport = () => {
    toast.info("Export feature coming soon!");
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    await updateOrderStatus(orderId, newStatus);
    toast.success("Order status updated");
  };

  return (
    <div className="bg-white rounded-sm border border-brand-border p-6">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
              tab === statusFilter
                ? "bg-brand-dark text-white"
                : "text-brand-gray hover:bg-brand-light-gray"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search + Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search orders..."
            className="border border-brand-border pl-9 pr-4 py-2 text-sm outline-none focus:border-brand-dark w-full"
          />
          <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex items-center gap-3">
          <div>
            <label className="text-xs text-brand-gray block mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-brand-border px-3 py-1.5 text-sm outline-none focus:border-brand-dark"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray block mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-brand-border px-3 py-1.5 text-sm outline-none focus:border-brand-dark"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-brand-border px-4 py-2 text-xs font-medium text-brand-dark hover:bg-brand-light-gray transition-colors self-end"
          >
            <Download className="w-4 h-4" />
            EXPORT
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
                    {{ asc: " ↑", desc: " ↓" }[
                      header.column.getIsSorted() as string
                    ] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {ordersLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-sm text-brand-gray"
                >
                  Loading orders...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-sm text-brand-gray"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-brand-border hover:bg-brand-light-gray/50 cursor-pointer"
                  onClick={() => setSelectedOrder(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
          Showing {table.getRowModel().rows.length} of {filteredOrders.length}{" "}
          orders
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

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onStatusUpdate={(status) => {
              handleStatusUpdate(selectedOrder.id, status);
              setSelectedOrder({ ...selectedOrder, status });
            }}
          />
        )}
      </Modal>
    </div>
  );
}

interface OrderDetailModalProps {
  order: Order;
  onStatusUpdate: (status: OrderStatus) => void;
}

function OrderDetailModal({ order, onStatusUpdate }: OrderDetailModalProps) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch full order details including items when modal opens
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/orders/${order.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setOrderData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrderData(order);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [order.id]);

  const displayOrder = orderData || order;

  return (
    <div className="space-y-4">
      {/* Customer Info */}
      <div className="bg-brand-light-gray rounded-sm p-4">
        <h4 className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
          Customer Information
        </h4>
        <p className="text-sm text-brand-dark font-medium">
          {displayOrder.customerName}
        </p>
        <p className="text-xs text-brand-gray">{displayOrder.customerEmail}</p>
        <p className="text-xs text-brand-gray mt-1">
          {displayOrder.shippingAddress}
        </p>
      </div>

      {/* Items */}
      <div>
        <h4 className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
          Ordered Items
        </h4>
        {loading ? (
          <p className="text-xs text-brand-gray py-4">Loading items...</p>
        ) : displayOrder.items && displayOrder.items.length > 0 ? (
          <div className="space-y-2">
            {displayOrder.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-brand-border"
              >
                <div className="w-10 h-10 bg-brand-light-gray rounded-sm overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                    sizes="40px"
                    quality={80}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-brand-dark truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-brand-gray">
                    Size: {item.size} · Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-brand-dark">
                  {formatPKR(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-brand-gray py-4">
            No items found for this order.
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-3 border-t border-brand-border">
        <span className="text-sm font-semibold text-brand-dark">Total</span>
        <span className="text-lg font-bold text-brand-dark">
          {formatPKR(order.total)}
        </span>
      </div>

      {/* Status Update */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-brand-dark">
          Update Status:
        </label>
        <div className="relative">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
            className="border border-brand-border pl-3 pr-8 py-2 text-sm outline-none focus:border-brand-dark appearance-none bg-white"
          >
            {statusTabs
              .filter((s) => s !== "All")
              .map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
          </select>
          <ChevronDown className="w-4 h-4 text-brand-gray absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <button
          onClick={async () => {
            await onStatusUpdate(newStatus);
          }}
          className="px-4 py-2 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export { OrdersTable };
