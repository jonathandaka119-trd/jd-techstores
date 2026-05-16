import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = (import.meta as any).env.VITE_SUPABASE_URL  as string
const supabaseKey  = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || supabaseUrl.includes('your-project')) {
  console.error('❌  VITE_SUPABASE_URL is not set. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'jd-supabase-session',
  },
})

export default supabase

export type UserRole   = 'user' | 'storekeeper' | 'admin'
export type OrderStatus  = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug?: string
  description?: string
  category_id?: string
  category_name?: string
  category_slug?: string
  price: number
  original_price?: number
  stock_quantity: number
  sku?: string
  main_image_url?: string
  is_active: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at?: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  display_order: number
}

export interface ProductSpecification {
  id: string
  product_id: string
  spec_name: string
  spec_value: string
}

export interface ProductVariant {
  id: string
  product_id: string
  color_name: string
  color_hex: string
  price: number
  original_price?: number
  stock_quantity: number
  sku?: string
  image_url?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Address {
  id: string
  user_id: string
  street: string
  city: string
  postal_code?: string
  country: string
  is_default: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: OrderStatus
  total_amount: number
  tax_amount: number
  shipping_cost: number
  discount_amount: number
  shipping_address?: any
  payment_method?: string
  coupon_code?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  created_at: string
  product?: Product
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title?: string
  comment?: string
  is_approved: boolean
  created_at: string
  profile?: Profile
}

export interface Coupon {
  id: string
  code: string
  discount_percentage: number
  valid_from?: string
  valid_to?: string
  usage_limit?: number
  used_count: number
  min_order_value: number
  created_at: string
}

export interface Supplier {
  id: string
  company_name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  terms?: string
  is_active: boolean
  created_at: string
}

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  resource_type: string
  resource_id?: string
  changes?: any
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  status: PaymentStatus
  payment_method?: string
  transaction_id?: string
  created_at: string
}
