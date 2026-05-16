import { useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../store'
import { useAuth } from './useAuth'
import type { Product } from '../lib/supabase'

const isUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

export function useCart() {
  const { user } = useAuth()
  const { items, setItems, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore()

  useEffect(() => {
    if (user) syncCartFromDB()
    else clearCart()
  }, [user?.id])

  const syncCartFromDB = async () => {
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user!.id)
    if (data) setItems(data.map(item => ({ ...item, product: item.product as Product })))
  }

  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    if (!user) return { error: 'Please sign in to add items to cart' }

    if (!isUUID(product.id)) {
      const existing = items.find(i => i.product_id === product.id)
      if (existing) {
        updateQuantity(product.id, existing.quantity + quantity)
      } else {
        addItem({
          id: `local-${product.id}-${Date.now()}`,
          user_id: user.id,
          product_id: product.id,
          quantity,
          created_at: new Date().toISOString(),
          product,
        })
      }
      return { error: null }
    }

    const existing = items.find(i => i.product_id === product.id)
    if (existing) {
      const newQty = existing.quantity + quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQty, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('product_id', product.id)
      if (!error) updateQuantity(product.id, newQty)
      return { error: error?.message || null }
    } else {
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id: product.id, quantity })
        .select()
        .single()
      if (!error && data) addItem({ ...data, product })
      return { error: error?.message || null }
    }
  }, [user, items])

  const removeFromCart = useCallback(async (productId: string) => {
    if (!user) return
    if (isUUID(productId)) {
      await supabase.from('cart_items').delete()
        .eq('user_id', user.id).eq('product_id', productId)
    }
    removeItem(productId)
  }, [user])

  const updateCartQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!user) return
    if (quantity <= 0) { await removeFromCart(productId); return }
    if (isUUID(productId)) {
      await supabase.from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('user_id', user.id).eq('product_id', productId)
    }
    updateQuantity(productId, quantity)
  }, [user])

  const clearUserCart = useCallback(async () => {
    if (!user) return
    await supabase.from('cart_items').delete().eq('user_id', user.id)
    clearCart()
  }, [user])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)

  return { items, addToCart, removeFromCart, updateCartQuantity, clearUserCart, getTotal, getItemCount, formatPrice }
}
