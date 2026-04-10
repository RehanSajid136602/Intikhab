import { create } from 'zustand';

type TabGroup = 'gender';

interface UIState {
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  cartDrawerOpen: boolean;
  announcementVisible: boolean;
  activeTabs: Record<TabGroup, string>;

  toggleMobileMenu: () => void;
  setMobileMenu: (open: boolean) => void;
  toggleSearch: () => void;
  setSearch: (open: boolean) => void;
  toggleCartDrawer: () => void;
  setCartDrawer: (open: boolean) => void;
  dismissAnnouncement: () => void;
  setActiveTab: (group: TabGroup, tab: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  mobileMenuOpen: false,
  searchOpen: false,
  cartDrawerOpen: false,
  announcementVisible: true,
  activeTabs: {
    gender: 'men',
  },

  toggleMobileMenu: () => {
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
  },

  setMobileMenu: (open: boolean) => {
    set({ mobileMenuOpen: open });
  },

  toggleSearch: () => {
    set((state) => ({ searchOpen: !state.searchOpen }));
  },

  setSearch: (open: boolean) => {
    set({ searchOpen: open });
  },

  toggleCartDrawer: () => {
    set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen }));
  },

  setCartDrawer: (open: boolean) => {
    set({ cartDrawerOpen: open });
  },

  dismissAnnouncement: () => {
    set({ announcementVisible: false });
  },

  setActiveTab: (group: TabGroup, tab: string) => {
    set((state) => ({
      activeTabs: { ...state.activeTabs, [group]: tab },
    }));
  },
}));
