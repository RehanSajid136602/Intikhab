'use client';

import { useState, useEffect, useMemo } from 'react';
import { Users, UserCheck, Mail, Award, Search, Eye, Ban, Trash2, MoreHorizontal } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { CustomerDetailDrawer } from '@/components/admin/CustomerDetailDrawer';
import { getCustomers, updateCustomerStatus, deleteCustomer } from '@/app/admin/actions';
import type { AdminCustomer, CustomerFilter } from '@/types/admin';

const statusVariantMap: Record<string, 'green' | 'purple' | 'red'> = {
  active: 'green',
  vip: 'purple',
  blocked: 'red',
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CustomerFilter>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    getCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => ({
    total: customers.length,
    returning: customers.filter((c) => c.orders >= 3).length,
    newsletter: customers.filter((c) => c.newsletter).length,
    vip: customers.filter((c) => c.status === 'vip').length,
  }), [customers]);

  const filteredCustomers = useMemo(() => {
    let result = customers;
    if (filter !== 'all') {
      result = result.filter((c) => c.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q),
      );
    }
    return result;
  }, [customers, filter, search]);

  const handleToggleVip = async (id: string) => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return;
    const newStatus = customer.status === 'vip' ? 'active' : 'vip';
    const result = await updateCustomerStatus(id, newStatus);
    if (result.success) {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus as AdminCustomer['status'] } : c)));
    }
  };

  const handleToggleBlock = async (id: string) => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return;
    const newStatus = customer.status === 'blocked' ? 'active' : 'blocked';
    const result = await updateCustomerStatus(id, newStatus);
    if (result.success) {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus as AdminCustomer['status'] } : c)));
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCustomer(id);
    if (result.success) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
    setConfirmDelete(null);
    setActionMenu(null);
  };

  const filters: { key: CustomerFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'vip', label: 'VIP' },
    { key: 'blocked', label: 'Blocked' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers"
        subtitle="Manage store customers, contact details, order history, and customer status."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard label="Total Customers" value={loading ? '...' : stats.total.toString()} icon={Users} iconBg="bg-blue-500" />
        <AdminStatCard label="Returning Customers" value={loading ? '...' : stats.returning.toString()} icon={UserCheck} iconBg="bg-green-500" />
        <AdminStatCard label="Newsletter Subscribers" value={loading ? '...' : stats.newsletter.toString()} icon={Mail} iconBg="bg-purple-500" />
        <AdminStatCard label="VIP Customers" value={loading ? '...' : stats.vip.toString()} icon={Award} iconBg="bg-orange-500" />
      </div>

      <div className="bg-white rounded-sm border border-brand-border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                  filter === f.key
                    ? 'bg-brand-dark text-white'
                    : 'text-brand-gray hover:text-brand-dark hover:bg-brand-light-gray'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full border border-brand-border pl-9 pr-4 py-1.5 text-sm outline-none focus:border-brand-dark transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-light-gray/50">
                <th className="text-left text-xs font-semibold text-brand-gray uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-brand-gray uppercase tracking-wider px-4 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-brand-gray uppercase tracking-wider px-4 py-3">Phone</th>
                <th className="text-left text-xs font-semibold text-brand-gray uppercase tracking-wider px-4 py-3">City</th>
                <th className="text-center text-xs font-semibold text-brand-gray uppercase tracking-wider px-4 py-3">Orders</th>
                <th className="text-right text-xs font-semibold text-brand-gray uppercase tracking-wider px-4 py-3">Total Spent</th>
                <th className="text-center text-xs font-semibold text-brand-gray uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-brand-gray uppercase tracking-wider px-4 py-3">Joined</th>
                <th className="text-center text-xs font-semibold text-brand-gray uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-brand-gray">Loading customers...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <AdminEmptyState
                      icon={Users}
                      title="No customers yet"
                      description="Customers will appear here when real users place orders or create accounts."
                    />
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-brand-border/50 hover:bg-brand-light-gray/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-light-gray flex items-center justify-center text-brand-dark font-bold text-xs">
                          {customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-brand-dark whitespace-nowrap">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-gray text-xs">{customer.email}</td>
                    <td className="px-4 py-3 text-brand-gray text-xs whitespace-nowrap">{customer.phone || '—'}</td>
                    <td className="px-4 py-3 text-brand-gray text-xs">{customer.city || '—'}</td>
                    <td className="px-4 py-3 text-center text-brand-dark font-medium">{customer.orders}</td>
                    <td className="px-4 py-3 text-right text-brand-dark font-medium whitespace-nowrap">
                      {customer.totalSpent > 0 ? `PKR ${customer.totalSpent.toLocaleString('en-PK')}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <AdminStatusBadge variant={statusVariantMap[customer.status]}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </AdminStatusBadge>
                    </td>
                    <td className="px-4 py-3 text-brand-gray text-xs whitespace-nowrap">{customer.joined || '—'}</td>
                    <td className="px-4 py-3 text-center relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === customer.id ? null : customer.id)}
                        className="p-1.5 text-brand-gray hover:text-brand-dark hover:bg-brand-light-gray rounded-sm transition-colors"
                        aria-label="Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {actionMenu === customer.id && (
                        <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white border border-brand-border rounded-sm shadow-lg">
                          <button
                            onClick={() => { setSelectedCustomer(customer); setActionMenu(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-brand-dark hover:bg-brand-light-gray transition-colors text-left"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                          {customer.status !== 'vip' ? (
                            <button
                              onClick={() => { handleToggleVip(customer.id); setActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-brand-dark hover:bg-brand-light-gray transition-colors text-left"
                            >
                              <Award className="w-3.5 h-3.5" />
                              Mark as VIP
                            </button>
                          ) : (
                            <button
                              onClick={() => { handleToggleVip(customer.id); setActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-brand-dark hover:bg-brand-light-gray transition-colors text-left"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Remove VIP
                            </button>
                          )}
                          {customer.status !== 'blocked' ? (
                            <button
                              onClick={() => { handleToggleBlock(customer.id); setActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-brand-red hover:bg-brand-light-gray transition-colors text-left"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Block Customer
                            </button>
                          ) : (
                            <button
                              onClick={() => { handleToggleBlock(customer.id); setActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-brand-green hover:bg-brand-light-gray transition-colors text-left"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Unblock
                            </button>
                          )}
                          <div className="border-t border-brand-border" />
                          <button
                            onClick={() => { setConfirmDelete(customer.id); setActionMenu(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-brand-red hover:bg-brand-red/5 transition-colors text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-sm shadow-xl max-w-sm w-full p-6">
            <h3 className="text-sm font-semibold text-brand-dark mb-2">Delete Customer?</h3>
            <p className="text-xs text-brand-gray mb-4">This action cannot be undone. Customer data will be permanently removed.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-xs font-semibold text-brand-gray border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 text-xs font-semibold text-white bg-brand-red rounded-sm hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      <CustomerDetailDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onToggleVip={handleToggleVip}
        onToggleBlock={handleToggleBlock}
      />
    </div>
  );
}
