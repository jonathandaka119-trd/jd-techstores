import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star, GitCompare } from 'lucide-react'
import { Product } from '../../types'
import { useStore } from '../../store/useStore'
import { formatPrice, getDiscount } from '../../lib/mockData'
import toast from 'react-hot-toast'

interface Props {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: Props) {
  const { addToCart, toggleWishlist, isInWishlist, setCartOpen, toggleCompare, isInCompare, compareList } = useStore()
  const inWishlist = isInWishlist(product.id)
  const inCompare = isInCompare(product.id)
  const compareFull = compareList.length >= 3 && !inCompare
  const discount = product.original_price ? getDiscount(product.price, product.original_price) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock_quantity === 0) { toast.error('Out of stock'); return }
    addToCart(product)
    toast.success(`Added to cart!`)
    setCartOpen(true)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist(product.id)
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    if (compareFull) { toast.error('Max 3 products to compare'); return }
    toggleCompare(product)
    toast.success(inCompare ? 'Removed from comparison' : 'Added to comparison')
  }

  return (
    <Link to={`/product/${product.slug}`} className={`block group card-hover bg-dark-800 border border-gray-800 hover:border-primary-500/40 rounded-2xl overflow-hidden ${className}`}>
      <div className="relative aspect-square overflow-hidden bg-dark-700">
        <img src={product.main_image_url || ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && <span className="badge bg-primary-500 text-white">-{discount}%</span>}
          {product.stock_quantity === 0 && <span className="badge bg-gray-700 text-gray-300">Out of Stock</span>}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && <span className="badge bg-orange-500/20 text-orange-400">Low Stock</span>}
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleWishlist} className={`w-8 h-8 rounded-lg glass flex items-center justify-center ${inWishlist ? 'text-primary-500' : 'text-gray-300 hover:text-primary-500'}`}>
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button onClick={handleCompare} disabled={compareFull} className={`w-8 h-8 rounded-lg glass flex items-center justify-center transition-colors ${inCompare ? 'text-primary-500' : 'text-gray-300 hover:text-primary-500'} disabled:opacity-40 disabled:cursor-not-allowed`}>
            <GitCompare className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-500 text-xs mb-1">{product.category?.name}</p>
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary-400 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />)}</div>
          <span className="text-gray-500 text-xs">({product.review_count})</span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="text-white font-bold text-lg">{formatPrice(product.price)}</span>
            {product.original_price && <span className="text-gray-500 text-xs line-through ml-2">{formatPrice(product.original_price)}</span>}
          </div>
          <button onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
            <ShoppingCart className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </Link>
  )
}
