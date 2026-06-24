'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, ShoppingBag, Award, Calendar, Ban, UserCheck } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { formatPKR } from '@/lib/utils';
import type { AdminCustomer } from '@/types/admin';

interface CustomerDetailDrawerProps {
  customer: AdminCustomer | null;
  onClose: () => void;
  onToggleVip: (id: string) => void;
  onToggleBlock: (id: string) => void;
}

const statusVariantMap: Record<string, 'green' | 'purple' | 'blue' | 'red'> = {
  active: 'green',
  vip: 'purple',
  new: 'blue',
  blocked: 'red',
};

function CustomerDetailDrawer({ customer, onClose, onToggleVip, onToggleBlock }: CustomerDetailDrawerProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (customer) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [customer, handleEscape]);

  if (!customer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/30"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-full max-w-lg bg-white h-full shadow-xl overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="sticky top-0 bg-white border-b border-brand-border z-10 flex items-center justify-between px-6 py-4">
            <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">Customer Details</h3>
            <button onClick={onClose} className="p-1 text-brand-gray hover:text-brand-dark transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-light-gray flex items-center justify-center text-brand-dark font-bold text-lg">
                {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-dark">{customer.name}</h4>
                <AdminStatusBadge variant={statusVariantMap[customer.status]}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </AdminStatusBadge>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-brand-gray uppercase tracking-wider">Contact Information</h5>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-brand-gray" />
                  <a href={`mailto:${customer.email}`} className="text-brand-dark hover:text-brand-red transition-colors">{customer.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-brand-gray" />
                  <span className="text-brand-dark">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-brand-gray" />
                  <span className="text-brand-dark">{customer.city}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-light-gray rounded-sm p-4">
                <ShoppingBag className="w-4 h-4 text-brand-gray mb-1" />
                <p className="text-lg font-bold text-brand-dark">{customer.orders}</p>
                <p className="text-xs text-brand-gray">Total Orders</p>
              </div>
              <div className="bg-brand-light-gray rounded-sm p-4">
                <Award className="w-4 h-4 text-brand-gray mb-1" />
                <p className="text-lg font-bold text-brand-dark">{formatPKR(customer.totalSpent)}</p>
                <p className="text-xs text-brand-gray">Total Spent</p>
              </div>
            </div>

            {/* Joined */}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-brand-gray" />
              <span className="text-brand-dark">Customer since {customer.joined}</span>
            </div>

            {/* Newsletter */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-dark font-medium">Newsletter Subscriber</span>
              <span className={customer.newsletter ? 'text-brand-green' : 'text-brand-gray'}>
                {customer.newsletter ? 'Subscribed' : 'Not subscribed'}
              </span>
            </div>

            {/* Notes Placeholder */}
            {customer.notes && (
              <div>
                <h5 className="text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">Notes</h5>
                <p className="text-sm text-brand-dark bg-brand-light-gray rounded-sm p-3">{customer.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-brand-border pt-4 space-y-2">
              <h5 className="text-xs font-semibold text-brand-gray uppercase tracking-wider mb-3">Actions</h5>
              {customer.status !== 'vip' ? (
                <button
                  onClick={() => { onToggleVip(customer.id); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 border border-purple-200 rounded-sm hover:bg-purple-50 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  Mark as VIP
                </button>
              ) : (
                <button
                  onClick={() => { onToggleVip(customer.id); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-brand-gray border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  Remove VIP Status
                </button>
              )}
              {customer.status !== 'blocked' ? (
                <button
                  onClick={() => { onToggleBlock(customer.id); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-brand-red border border-brand-red/30 rounded-sm hover:bg-brand-red/5 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  Block Customer
                </button>
              ) : (
                <button
                  onClick={() => { onToggleBlock(customer.id); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-brand-green border border-brand-green/30 rounded-sm hover:bg-brand-green/5 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  Unblock Customer
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export { CustomerDetailDrawer };
