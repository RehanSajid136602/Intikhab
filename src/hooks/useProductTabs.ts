import { useState, useCallback } from 'react';

/**
 * Hook managing product tab state with initial tab default.
 */
interface UseProductTabsReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function useProductTabs(defaultTab: string = 'men'): UseProductTabsReturn {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSetTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return { activeTab, setActiveTab: handleSetTab };
}
