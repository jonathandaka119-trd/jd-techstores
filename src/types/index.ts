export type UserRole = 'admin' | 'storekeeper' | 'user'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  category?: Category
  price: number
  original_price: number | null
  stock_quantity: number
  sku: string
  main_image_url: string | null
  images: string[]
  specifications: Record<string, string>
  tags: string[]
  rating: number
  review_count: number
  is_active: boolean
  created_at: string
  updated_at: string
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
  shipping_address: Record<string, string>
  payment_method: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  created_at: string
}

export interface CartItemLocal {
  product: Product
  quantity: number
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  profile?: Pick<Profile, 'full_name' | 'avatar_url'>
  rating: number
  title: string | null
  comment: string | null
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  discount_percentage: number
  valid_from: string
  valid_to: string
  usage_limit: number | null
  used_count: number
  min_order_value: number
  is_active: boolean
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  street: string
  city: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
}

export interface Supplier {
  id: string
  company_name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
