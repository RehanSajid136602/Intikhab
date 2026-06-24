'use client';

import { useState, useEffect, useCallback } from 'react';
import { Image, Eye, Save } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSectionCard } from '@/components/admin/AdminSectionCard';
import { getOrCreateAppearance, updateAppearanceSettings } from '@/app/admin/actions';
import type { AppearanceSettings } from '@/types/admin';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer group">
      <span className="text-sm text-brand-dark">{label}</span>
      <div className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-brand-dark' : 'bg-gray-200'}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </div>
    </label>
  );
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-brand-dark min-w-[130px]">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-sm border border-brand-border cursor-pointer p-0.5 bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 border border-brand-border px-2 py-1.5 text-xs font-mono outline-none focus:border-brand-dark transition-colors"
        />
      </div>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  rows?: number;
}

function Field({ id, label, value, onChange, type = 'text', rows }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 2}
          className="w-full max-w-lg border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark resize-none transition-colors"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-md border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark transition-colors"
        />
      )}
    </div>
  );
}

export default function AdminAppearancePage() {
  const [appearance, setAppearance] = useState<AppearanceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    getOrCreateAppearance().then((data) => {
      setAppearance(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const updateField = useCallback(<K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => {
    if (!appearance) return;
    setAppearance({ ...appearance, [key]: value });
  }, [appearance]);

  const handleSave = async () => {
    if (!appearance) return;
    setSaveError('');
    const formData = new FormData();
    Object.entries(appearance).forEach(([key, value]) => {
      formData.append(key, value === null ? '' : String(value));
    });
    const result = await updateAppearanceSettings(formData);
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
        <AdminPageHeader title="Appearance" subtitle="Customize homepage visuals, brand colors, hero banners, and storefront sections." />
        <div className="text-sm text-brand-gray p-8">Loading appearance settings...</div>
      </div>
    );
  }

  if (!appearance) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Appearance" subtitle="Customize homepage visuals, brand colors, hero banners, and storefront sections." />
        <div className="text-sm text-brand-red p-8">Failed to load appearance settings. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Appearance" subtitle="Customize homepage visuals, brand colors, hero banners, and storefront sections." />

      <AdminSectionCard title="Brand Identity" description="Your store name and tagline.">
        <div className="space-y-4">
          <Field id="storeName" label="Store Name" value={appearance.storeName} onChange={(v) => updateField('storeName', v)} />
          <Field id="tagline" label="Tagline" value={appearance.tagline} onChange={(v) => updateField('tagline', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-1.5">Logo</label>
              <div className="border border-brand-border border-dashed rounded-sm p-4 flex items-center justify-center h-24 bg-brand-light-gray/50">
                <span className="flex flex-col items-center gap-1 text-brand-gray">
                  <Image className="w-5 h-5" />
                  <span className="text-xs">Configurable via Supabase Storage</span>
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-1.5">Favicon</label>
              <div className="border border-brand-border border-dashed rounded-sm p-4 flex items-center justify-center h-24 bg-brand-light-gray/50">
                <span className="flex flex-col items-center gap-1 text-brand-gray">
                  <Image className="w-5 h-5" />
                  <span className="text-xs">Configurable via Supabase Storage</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Theme Colors" description="Customize the brand color palette.">
        <div className="space-y-4">
          <ColorInput label="Primary Color" value={appearance.primaryColor} onChange={(v) => updateField('primaryColor', v)} />
          <ColorInput label="Accent Color" value={appearance.accentColor} onChange={(v) => updateField('accentColor', v)} />
          <ColorInput label="Background Color" value={appearance.backgroundColor} onChange={(v) => updateField('backgroundColor', v)} />
          <ColorInput label="Text Color" value={appearance.textColor} onChange={(v) => updateField('textColor', v)} />
          <div className="mt-4 p-4 rounded-sm border border-brand-border" style={{ backgroundColor: appearance.backgroundColor }}>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-semibold" style={{ color: appearance.textColor }}>Primary</span>
              <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: appearance.primaryColor }} />
              <span className="text-sm font-semibold" style={{ color: appearance.textColor }}>Accent</span>
              <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: appearance.accentColor }} />
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Homepage Hero" description="Configure the main hero banner on your storefront.">
        <div className="space-y-4">
          <Field id="heroTitle" label="Hero Title" value={appearance.heroTitle} onChange={(v) => updateField('heroTitle', v)} />
          <Field id="heroSubtitle" label="Hero Subtitle" value={appearance.heroSubtitle} onChange={(v) => updateField('heroSubtitle', v)} type="textarea" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="heroCtaLabel" label="CTA Label" value={appearance.heroCtaLabel} onChange={(v) => updateField('heroCtaLabel', v)} />
            <Field id="heroCtaLink" label="CTA Link" value={appearance.heroCtaLink} onChange={(v) => updateField('heroCtaLink', v)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-1.5">Hero Image</label>
            <div className="border border-brand-border border-dashed rounded-sm p-4 flex items-center justify-center h-32 bg-brand-light-gray/50 max-w-lg">
              <span className="flex flex-col items-center gap-1 text-brand-gray">
                <Image className="w-5 h-5" />
                <span className="text-xs">Configurable via Supabase Storage</span>
              </span>
            </div>
          </div>
          <Toggle label="Show Hero Section" checked={appearance.showHero} onChange={(v) => updateField('showHero', v)} />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Homepage Sections" description="Toggle which sections appear on your storefront.">
        <div className="divide-y divide-brand-border/50">
          <Toggle label="Show Category Cards" checked={appearance.showCategoryCards} onChange={(v) => updateField('showCategoryCards', v)} />
          <Toggle label="Show Instagram Feed" checked={appearance.showInstagramFeed} onChange={(v) => updateField('showInstagramFeed', v)} />
          <Toggle label="Show Testimonials" checked={appearance.showTestimonials} onChange={(v) => updateField('showTestimonials', v)} />
          <Toggle label="Show Newsletter Section" checked={appearance.showNewsletter} onChange={(v) => updateField('showNewsletter', v)} />
          <Toggle label="Show Trust Badges" checked={appearance.showTrustBadges} onChange={(v) => updateField('showTrustBadges', v)} />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Live Preview" description="A preview of how your storefront looks with current settings.">
        <div className="rounded-sm border p-6 max-w-lg" style={{ backgroundColor: appearance.backgroundColor, color: appearance.textColor }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold" style={{ color: appearance.primaryColor }}>{appearance.storeName}</h4>
              <p className="text-xs mt-0.5">{appearance.tagline}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: appearance.accentColor }}>
              <Eye className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="p-4 rounded-sm mb-3" style={{ backgroundColor: appearance.primaryColor }}>
            <h5 className="text-white text-base font-bold">{appearance.showHero ? appearance.heroTitle : 'Hero Hidden'}</h5>
            <p className="text-white/70 text-xs mt-1">{appearance.heroSubtitle.slice(0, 60)}...</p>
            <button className="mt-3 px-4 py-1.5 text-xs font-bold rounded-sm" style={{ backgroundColor: appearance.accentColor, color: '#fff' }}>
              {appearance.heroCtaLabel}
            </button>
          </div>
          <div className="flex gap-2 text-[10px]">
            <span className="px-2 py-1 rounded-sm bg-white/50">Categories {appearance.showCategoryCards ? '✓' : '✗'}</span>
            <span className="px-2 py-1 rounded-sm bg-white/50">Instagram {appearance.showInstagramFeed ? '✓' : '✗'}</span>
            <span className="px-2 py-1 rounded-sm bg-white/50">Newsletter {appearance.showNewsletter ? '✓' : '✗'}</span>
          </div>
        </div>
      </AdminSectionCard>

      <div className="flex items-center gap-3 justify-end">
        {saveError && <span className="text-xs text-brand-red font-medium">{saveError}</span>}
        {saved && <span className="text-xs text-brand-green font-medium">Appearance saved</span>}
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-sm hover:bg-black transition-colors">
          <Save className="w-4 h-4" />
          Save Appearance
        </button>
      </div>
    </div>
  );
}
