import type { Category } from '../types'

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Gaming Peripherals', slug: 'gaming-peripherals', description: 'Headsets, mice, keyboards and controllers', image_url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=80', created_at: '', updated_at: '' },
  { id: '2', name: 'Processors & RAM',   slug: 'processors-ram',      description: 'CPUs and memory modules',                  image_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80', created_at: '', updated_at: '' },
  { id: '3', name: 'Graphics Cards',     slug: 'graphics-cards',      description: 'GPUs for gaming and workstations',         image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80', created_at: '', updated_at: '' },
  { id: '4', name: 'Networking',         slug: 'networking',           description: 'Routers, switches, and accessories',       image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80', created_at: '', updated_at: '' },
  { id: '5', name: 'Office Equipment',   slug: 'office-equipment',    description: 'Printers, monitors, and peripherals',      image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', created_at: '', updated_at: '' },
  { id: '6', name: 'Accessories',        slug: 'accessories',          description: 'Cables, adapters, and more',               image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80', created_at: '', updated_at: '' },
]

export const PRODUCTS: any[] = []

export const MOCK_REVIEWS: any[] = []

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)

export const getDiscount = (price: number, originalPrice: number) =>
  Math.round(((originalPrice - price) / originalPrice) * 100)
