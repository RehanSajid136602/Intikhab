"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs.Root');
  }
  return context;
}

interface TabsRootProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Root Tabs component providing context for tab state.
 */
function TabsRoot({
  defaultValue,
  children,
  className,
  onValueChange,
}: TabsRootProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleSetTab = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      onValueChange?.(tab);
    },
    [onValueChange],
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

/**
 * Tab list container.
 */
function TabsList({ children, className }: TabsListProps) {
  return <div className={cn('flex justify-center gap-2 md:gap-4', className)}>{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

/**
 * Individual tab trigger button with active underline animation.
 */
function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-6 md:px-8 py-2.5 text-xs md:text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors',
        isActive
          ? 'border-brand-dark text-brand-dark'
          : 'border-transparent text-brand-gray hover:text-brand-dark',
        className,
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

/**
 * Tab content panel, only renders when its value matches the active tab.
 */
function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;

  return <div className={className}>{children}</div>;
}

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { Tabs };
export type { TabsRootProps, TabsListProps, TabsTriggerProps, TabsContentProps };
