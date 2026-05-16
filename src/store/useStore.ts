import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Profile, CartItemLocal } from '../types'

interface StoreState {
  user: Profile | null
  setUser: (user: Profile | null) => void
  
  cartItems: CartItemLocal[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: () => number
  cartCount: () => number
  
  wishlistIds: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  appliedCoupon: { code: string; discount: number } | null
  setAppliedCoupon: (coupon: { code: string; discount: number } | null) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      
      cartItems: [],
      addToCart: (product, quantity = 1) => {
        const existing = get().cartItems.find(i => i.product.id === product.id)
        if (existing) {
          set({ cartItems: get().cartItems.map(i =>
            i.product.id === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock_quantity) }
              : i
          )})
        } else {
          set({ cartItems: [...get().cartItems, { product, quantity }] })
        }
      },
      removeFromCart: (productId) =>
        set({ cartItems: get().cartItems.filter(i => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }
        set({ cartItems: get().cartItems.map(i =>
          i.product.id === productId ? { ...i, quantity } : i
        )})
      },
      clearCart: () => set({ cartItems: [] }),
      cartTotal: () => get().cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      cartCount: () => get().cartItems.reduce((sum, i) => sum + i.quantity, 0),
      
      wishlistIds: [],
      toggleWishlist: (productId) => {
        const ids = get().wishlistIds
        if (ids.includes(productId)) {
          set({ wishlistIds: ids.filter(id => id !== productId) })
        } else {
          set({ wishlistIds: [...ids, productId] })
        }
      },
      isInWishlist: (productId) => get().wishlistIds.includes(productId),
      
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      appliedCoupon: null,
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
    }),
    {
      name: 'jd-techstores',
      partialize: (state) => ({
        cartItems: state.cartItems,
        wishlistIds: state.wishlistIds,
        user: state.user,
      }),
    }
  )
)
