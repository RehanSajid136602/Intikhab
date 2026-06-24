'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Download, Trash2, Shield, AlertTriangle, Key, RefreshCw } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSectionCard } from '@/components/admin/AdminSectionCard';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { getOrCreateSettings, updateStoreSettings } from '@/app/admin/actions';
import type { StoreSettings } from '@/types/admin';

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <span className="text-sm text-brand-dark">{label}</span>
        {description && <p className="text-xs text-brand-gray mt-0.5">{description}</p>}
      </div>
      <label className="relative inline-flex cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-10 h-5 rounded-full bg-gray-200 peer-checked:bg-brand-dark transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
      </label>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

function Field({ id, label, value, onChange, type = 'text', placeholder }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full max-w-lg border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark resize-none transition-colors"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full max-w-md border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark transition-colors"
        />
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    getOrCreateSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const updateField = useCallback(<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }, [settings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaveError('');
    const formData = new FormData();
    Object.entries(settings).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    const result = await updateStoreSettings(formData);
    if (result.error) {
      setSaveError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Settings" subtitle="Configure store details, payments, delivery, security, and admin preferences." />
        <div className="text-sm text-brand-gray p-8">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Settings" subtitle="Configure store details, payments, delivery, security, and admin preferences." />
        <div className="text-sm text-brand-red p-8">Failed to load settings. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Settings" subtitle="Configure store details, payments, delivery, security, and admin preferences." />

      <AdminSectionCard title="Store Profile" description="Basic information about your store.">
        <div className="space-y-4">
          <Field id="storeName" label="Store Name" value={settings.storeName} onChange={(v) => updateField('storeName', v)} />
          <Field id="publicEmail" label="Public Email" value={settings.publicEmail} onChange={(v) => updateField('publicEmail', v)} type="email" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="supportPhone" label="Support Phone" value={settings.supportPhone} onChange={(v) => updateField('supportPhone', v)} />
            <Field id="whatsappNumber" label="WhatsApp Number" value={settings.whatsappNumber} onChange={(v) => updateField('whatsappNumber', v)} />
          </div>
          <Field id="storeLocation" label="Store Location" value={settings.storeLocation} onChange={(v) => updateField('storeLocation', v)} />
          <Field id="businessHours" label="Business Hours" value={settings.businessHours} onChange={(v) => updateField('businessHours', v)} />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Payments" description="Configure available payment methods.">
        <div className="divide-y divide-brand-border/50">
          <Toggle label="Cash on Delivery (COD)" checked={settings.codEnabled} onChange={(v) => updateField('codEnabled', v)} />
          <Toggle label="JazzCash" checked={settings.jazzcashEnabled} onChange={(v) => updateField('jazzcashEnabled', v)} />
          <Toggle label="Easypaisa" checked={settings.easypaisaEnabled} onChange={(v) => updateField('easypaisaEnabled', v)} />
          <Toggle label="Card Payments (Visa / Mastercard)" description="Requires a payment gateway integration." checked={settings.cardEnabled} onChange={(v) => updateField('cardEnabled', v)} />
          <div className="pt-3">
            <Field id="freeDeliveryMinimum" label="Free Delivery Minimum Amount (PKR)" value={settings.freeDeliveryMinimum.toString()} onChange={(v) => updateField('freeDeliveryMinimum', Number(v) || 0)} type="number" />
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Shipping & Delivery" description="Manage delivery fees and timelines.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="standardDeliveryFee" label="Standard Delivery Fee (PKR)" value={settings.standardDeliveryFee.toString()} onChange={(v) => updateField('standardDeliveryFee', Number(v) || 0)} type="number" />
            <Field id="estimatedDeliveryDays" label="Estimated Delivery Days" value={settings.estimatedDeliveryDays.toString()} onChange={(v) => updateField('estimatedDeliveryDays', Number(v) || 0)} type="number" />
          </div>
          <Toggle label="Free Delivery Enabled" checked={settings.freeDeliveryEnabled} onChange={(v) => updateField('freeDeliveryEnabled', v)} />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Notifications" description="Control which email alerts are sent.">
        <div className="divide-y divide-brand-border/50">
          <Toggle label="New Order Email" description="Get notified when a new order is placed." checked={settings.newOrderEmailNotifications} onChange={(v) => updateField('newOrderEmailNotifications', v)} />
          <Toggle label="Low Stock Alert" description="Alert when product stock is running low." checked={settings.lowStockAlerts} onChange={(v) => updateField('lowStockAlerts', v)} />
          <Toggle label="Customer Message Alert" description="Get notified on new customer inquiries." checked={settings.customerMessageAlerts} onChange={(v) => updateField('customerMessageAlerts', v)} />
          <Toggle label="Newsletter Signup Alert" description="Alert when someone subscribes to the newsletter." checked={settings.newsletterSignupAlerts} onChange={(v) => updateField('newsletterSignupAlerts', v)} />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Security" description="Admin account security and access management.">
        <div className="space-y-5">
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm text-brand-dark font-medium">Admin Password</span>
              <p className="text-xs text-brand-gray mt-0.5">Change your admin account password via Supabase Auth.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-dark border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors">
              <Key className="w-3.5 h-3.5" />
              Change Password
            </button>
          </div>
          <div className="border-t border-brand-border/50" />
          <Toggle label="Two-Factor Authentication" description="Enable via Supabase Auth settings." checked={false} onChange={() => {}} />
          <div className="border-t border-brand-border/50" />
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm text-brand-dark font-medium">Active Sessions</span>
              <p className="text-xs text-brand-gray mt-0.5">Manage sessions via Supabase Auth dashboard.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-gray border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Manage Sessions
            </button>
          </div>
          <div className="border-t border-brand-border/50" />
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-brand-green" />
              <div>
                <span className="text-sm text-brand-dark font-medium">Admin Route Protection</span>
                <p className="text-xs text-brand-gray mt-0.5">All admin routes are protected by Supabase auth middleware and server-side checks.</p>
              </div>
            </div>
            <AdminStatusBadge variant="green">Active</AdminStatusBadge>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Danger Zone" description="Irreversible actions for store management." danger>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm text-brand-dark font-medium">Clear Demo Data</span>
              <p className="text-xs text-brand-gray mt-0.5">Remove all products and orders from the database.</p>
            </div>
            <button onClick={() => setConfirmClear(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-red border border-brand-red/30 rounded-sm hover:bg-brand-red/5 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Clear Data
            </button>
          </div>
          <div className="border-t border-brand-red/10" />
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm text-brand-dark font-medium">Export Data</span>
              <p className="text-xs text-brand-gray mt-0.5">Database export is handled via Supabase dashboard or pg_dump.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-dark border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
          <div className="border-t border-brand-red/10" />
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-brand-red" />
              <div>
                <span className="text-sm text-brand-dark font-medium">Delete Store</span>
                <p className="text-xs text-brand-gray mt-0.5">Permanently delete the entire database. Use Supabase dashboard for this operation.</p>
              </div>
            </div>
            <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-red rounded-sm hover:bg-red-600 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Delete Store
            </button>
          </div>
        </div>
      </AdminSectionCard>

      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmClear(false)} />
          <div className="relative bg-white rounded-sm shadow-xl max-w-sm w-full p-6">
            <h3 className="text-sm font-semibold text-brand-dark mb-2">Clear Data?</h3>
            <p className="text-xs text-brand-gray mb-4">This will remove all products and orders. Use Supabase dashboard or run the reset script.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmClear(false)} className="px-4 py-2 text-xs font-semibold text-brand-gray border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors">Cancel</button>
              <button onClick={() => setConfirmClear(false)} className="px-4 py-2 text-xs font-semibold text-white bg-brand-red rounded-sm hover:bg-red-600 transition-colors">Understood</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-white rounded-sm shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-brand-red" />
              </div>
              <h3 className="text-sm font-semibold text-brand-dark">Delete Store?</h3>
            </div>
            <p className="text-xs text-brand-gray mb-4">Use the Supabase dashboard to delete the database. This action cannot be performed from this panel.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 text-xs font-semibold text-brand-gray border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors">Cancel</button>
              <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 text-xs font-semibold text-white bg-brand-red rounded-sm hover:bg-red-600 transition-colors">Understood</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 justify-end">
        {saveError && <span className="text-xs text-brand-red font-medium">{saveError}</span>}
        {saved && <span className="text-xs text-brand-green font-medium">Settings saved</span>}
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-sm hover:bg-black transition-colors">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
