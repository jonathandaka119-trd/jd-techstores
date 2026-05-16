import React from 'react'
import { Star, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react'
import hotToast from 'react-hot-toast'

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export function StarRating({ rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' }
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${sizes[size]} ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
      {count !== undefined && (
        <span className="text-gray-500 text-xs ml-1">({count})</span>
      )}
    </div>
  )
}

export function PriceDisplay({ price, originalPrice, size = 'md' }: {
  price: number; originalPrice?: number; size?: 'sm' | 'md' | 'lg'
}) {
  const fmt = (n: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n)
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`${sizes[size]} font-bold text-primary-500`}>{fmt(price)}</span>
      {originalPrice && originalPrice > price && (
        <>
          <span className="text-gray-400 line-through text-sm">{fmt(originalPrice)}</span>
          <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">-{discount}%</span>
        </>
      )}
    </div>
  )
}

type BadgeVariant = 'red' | 'green' | 'yellow' | 'blue' | 'gray' | 'purple'
const badgeStyles: Record<BadgeVariant, string> = {
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  blue: 'bg-blue-100 text-blue-700',
  gray: 'bg-gray-100 text-gray-700',
  purple: 'bg-purple-100 text-purple-700',
}

export function Badge({ children, variant, color, className = '' }: { children: React.ReactNode; variant?: BadgeVariant; color?: BadgeVariant; className?: string }) {
  const v = (variant || color || 'gray') as BadgeVariant
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyles[v]} ${className}`}>
      {children}
    </span>
  )
}

export function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    pending: { label: 'Pending', variant: 'yellow' },
    processing: { label: 'Processing', variant: 'blue' },
    shipped: { label: 'Shipped', variant: 'purple' },
    delivered: { label: 'Delivered', variant: 'green' },
    cancelled: { label: 'Cancelled', variant: 'red' },
  }
  const { label, variant } = map[status] || { label: status, variant: 'gray' }
  return <Badge variant={variant}>{label}</Badge>
}

export function StockIndicator({ quantity }: { quantity: number }) {
  if (quantity <= 0) return <span className="text-red-500 text-sm font-medium">Out of stock</span>
  if (quantity <= 5) return <span className="text-amber-500 text-sm font-medium">Only {quantity} left!</span>
  return <span className="text-green-600 text-sm font-medium">✓ In stock ({quantity} available)</span>
}

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${styles[type]} shadow-lg max-w-sm animate-fade-in`}>
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  info: (message: string) => hotToast(message),
}

export function ToastContainer() { return null }

export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}

export function ProductSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 rounded w-3/4" />
        <div className="skeleton h-3 rounded w-1/2" />
        <div className="skeleton h-6 rounded w-1/3" />
        <div className="skeleton h-10 rounded-lg w-full" />
      </div>
    </div>
  )
}

export function ConfirmModal({ title, message, onConfirm, onCancel, loading }: {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
        <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-lg leading-none"
      >−</button>
      <span className="px-4 py-2 text-dark font-semibold border-x border-gray-200 min-w-[2.5rem] text-center">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-lg leading-none"
      >+</button>
    </div>
  )
}

export function Pagination({ page, total, perPage, onChange, currentPage, totalPages, onPageChange }: {
  page?: number; total?: number; perPage?: number; onChange?: (p: number) => void;
  currentPage?: number; totalPages?: number; onPageChange?: (p: number) => void;
}) {
  const p  = currentPage ?? page ?? 1
  const tp = totalPages ?? (total && perPage ? Math.ceil(total / perPage) : 1)
  const go = onPageChange ?? onChange ?? (() => {})
  if (tp <= 1) return null

  const getRange = () => {
    const max = 7
    if (tp <= max) return Array.from({ length: tp }, (_, i) => i + 1)
    let start = Math.max(1, p - Math.floor(max / 2))
    let end   = start + max - 1
    if (end > tp) { end = tp; start = Math.max(1, end - max + 1) }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const btn = 'px-3 py-2 rounded-md border border-gray-200 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700'

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button onClick={() => go(p - 1)} disabled={p === 1} className={btn}>← Prev</button>

      {p > 4 && tp > 7 && (
        <>
          <button onClick={() => go(1)} className={btn}>1</button>
          <span className="px-1 text-gray-400 text-sm">…</span>
        </>
      )}

      {getRange().map(pg => (
        <button
          key={pg}
          onClick={() => go(pg)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pg === p
              ? 'bg-primary-500 text-white border border-primary-500'
              : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {pg}
        </button>
      ))}

      {p < tp - 3 && tp > 7 && (
        <>
          <span className="px-1 text-gray-400 text-sm">…</span>
          <button onClick={() => go(tp)} className={btn}>{tp}</button>
        </>
      )}

      <button onClick={() => go(p + 1)} disabled={p === tp} className={btn}>Next →</button>
    </div>
  )
}
