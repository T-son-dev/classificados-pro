import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Ad, User, Category, Plan, AdSearchParams, Notification } from "./types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);

interface AdsState {
  ads: Ad[];
  featuredAds: Ad[];
  userAds: Ad[];
  currentAd: Ad | null;
  isLoading: boolean;
  setAds: (ads: Ad[]) => void;
  setFeaturedAds: (ads: Ad[]) => void;
  setUserAds: (ads: Ad[]) => void;
  setCurrentAd: (ad: Ad | null) => void;
  addAd: (ad: Ad) => void;
  updateAd: (id: string, data: Partial<Ad>) => void;
  deleteAd: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAdsStore = create<AdsState>((set) => ({
  ads: [],
  featuredAds: [],
  userAds: [],
  currentAd: null,
  isLoading: false,
  setAds: (ads) => set({ ads }),
  setFeaturedAds: (ads) => set({ featuredAds: ads }),
  setUserAds: (ads) => set({ userAds: ads }),
  setCurrentAd: (ad) => set({ currentAd: ad }),
  addAd: (ad) => set((state) => ({ ads: [ad, ...state.ads] })),
  updateAd: (id, data) =>
    set((state) => ({
      ads: state.ads.map((a) => (a.id === id ? { ...a, ...data } : a)),
      userAds: state.userAds.map((a) => (a.id === id ? { ...a, ...data } : a)),
      currentAd: state.currentAd?.id === id ? { ...state.currentAd, ...data } : state.currentAd,
    })),
  deleteAd: (id) =>
    set((state) => ({
      ads: state.ads.filter((a) => a.id !== id),
      userAds: state.userAds.filter((a) => a.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

interface SearchState {
  params: AdSearchParams;
  recentSearches: string[];
  setParams: (params: Partial<AdSearchParams>) => void;
  resetParams: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const defaultSearchParams: AdSearchParams = {
  sortBy: "relevance",
  page: 1,
  pageSize: 20,
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      params: defaultSearchParams,
      recentSearches: [],
      setParams: (params) =>
        set((state) => ({ params: { ...state.params, ...params } })),
      resetParams: () => set({ params: defaultSearchParams }),
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((q) => q !== query),
          ].slice(0, 10),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "search-storage",
    }
  )
);

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  setCategories: (categories: Category[]) => void;
  setCurrentCategory: (category: Category | null) => void;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  currentCategory: null,
  setCategories: (categories) => set({ categories }),
  setCurrentCategory: (category) => set({ currentCategory: category }),
}));

interface PlansState {
  plans: Plan[];
  currentPlan: Plan | null;
  setPlans: (plans: Plan[]) => void;
  setCurrentPlan: (plan: Plan | null) => void;
}

export const usePlansStore = create<PlansState>((set) => ({
  plans: [],
  currentPlan: null,
  setPlans: (plans) => set({ plans }),
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
}));

interface FavoritesState {
  favoriteIds: string[];
  addFavorite: (adId: string) => void;
  removeFavorite: (adId: string) => void;
  isFavorite: (adId: string) => boolean;
  toggleFavorite: (adId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (adId) =>
        set((state) => ({
          favoriteIds: [...state.favoriteIds, adId],
        })),
      removeFavorite: (adId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== adId),
        })),
      isFavorite: (adId) => get().favoriteIds.includes(adId),
      toggleFavorite: (adId) => {
        const state = get();
        if (state.favoriteIds.includes(adId)) {
          set({ favoriteIds: state.favoriteIds.filter((id) => id !== adId) });
        } else {
          set({ favoriteIds: [...state.favoriteIds, adId] });
        }
      },
    }),
    {
      name: "favorites-storage",
    }
  )
);

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchModalOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleSearchModal: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  searchModalOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  toggleSearchModal: () => set((state) => ({ searchModalOpen: !state.searchModalOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
