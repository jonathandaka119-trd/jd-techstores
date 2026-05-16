import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, CartItem, Product } from '../lib/supabase'

interface AuthState {
  user: Profile | null
  setUser: (user: Profile | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'jd-auth-user', partialize: (s) => ({ user: s.user }) }
  )
)

interface CartState {
  items: (CartItem & { product: Product })[]
  isOpen: boolean
  setItems: (items: (CartItem & { product: Product })[]) => void
  addItem: (item: CartItem & { product: Product }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.product_id === item.product_id)
    if (existing) {
      return {
        items: state.items.map(i =>
          i.product_id === item.product_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
    }
    return { items: [...state.items, item] }
  }),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(i => i.product_id !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(i =>
      i.product_id === productId ? { ...i, quantity } : i
    )
  })),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  getTotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))

interface WishlistState {
  productIds: string[]
  setIds: (ids: string[]) => void
  addId: (id: string) => void
  removeId: (id: string) => void
  hasId: (id: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      setIds: (ids) => set({ productIds: ids }),
      addId: (id) => set((state) => ({ productIds: [...new Set([...state.productIds, id])] })),
      removeId: (id) => set((state) => ({ productIds: state.productIds.filter(i => i !== id) })),
      hasId: (id) => get().productIds.includes(id),
    }),
    { name: 'jd-wishlist' }
  )
)

interface UIState {
  isMobileMenuOpen: boolean
  searchQuery: string
  setMobileMenu: (open: boolean) => void
  setSearchQuery: (q: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  searchQuery: '',
  setMobileMenu: (open) => set({ isMobileMenuOpen: open }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
