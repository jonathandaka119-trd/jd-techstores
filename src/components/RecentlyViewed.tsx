import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatPrice } from '../lib/mockData'

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const recentlyViewed = useStore(s => s.recentlyViewed)
  const items = excludeId ? recentlyViewed.filter(p => p.id !== excludeId) : recentlyViewed

  if (items.length === 0) return null

  return (
    <section className="py-10">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-5 h-5 text-primary-500" />
        <h2 className="text-white font-bold text-xl">Recently Viewed</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map(product => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="group bg-dark-800 border border-gray-800 hover:border-primary-500/40 rounded-xl overflow-hidden transition-colors"
          >
            <div className="aspect-square overflow-hidden bg-dark-700">
              <img
                src={product.main_image_url || ''}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-2">
              <p className="text-white text-xs font-medium line-clamp-2 group-hover:text-primary-400 transition-colors">
                {product.name}
              </p>
              <p className="text-primary-500 text-xs font-bold mt-1">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
