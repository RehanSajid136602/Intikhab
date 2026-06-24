'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Reusable breadcrumbs component with structured data.
 * Format: Home > Men > Running Shoes
 * Each segment is a link except the last (current page).
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://intikhab.pk${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className={cn('py-4', className)}>
        <ol className="flex items-center gap-2 text-sm text-brand-gray">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              {item.href && index !== items.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-brand-dark transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-brand-dark font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
