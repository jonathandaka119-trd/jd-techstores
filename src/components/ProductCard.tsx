import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { StarRating, PriceDisplay } from './ui'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useWishlistStore } from '../store'
import { supabase } from '../lib/supabase'
import { toast } from './ui'
import type { Product } from '../lib/supabase'

interface ProductCardProps {
  product: Product
  view?: 'grid' | 'list'
}

export default function ProductCard({ product, view = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { hasId, addId, removeId } = useWishlistStore()
  const [adding, setAdding] = useState(false)
  const isWishlisted = hasId(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { toast.info('Please sign in to add items to cart'); return }
    setAdding(true)
    const { error } = await addToCart(product)
    if (error) toast.error(typeof error === 'string' ? error : 'Failed to add to cart')
    else toast.success('Added to cart!')
    setAdding(false)
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { toast.info('Please sign in to use wishlist'); return }
    if (isWishlisted) {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id)
      removeId(product.id)
      toast.info('Removed from wishlist')
    } else {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: product.id })
      addId(product.id)
      toast.success('Added to wishlist!')
    }
  }

  const discount = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100) : 0

  if (view === 'list') {
    return (
      <Link to={`/product/${product.slug}`} className="card flex gap-4 p-4 group">
        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
          <img
            src={product.main_image_url || 'https://via.placeholder.com/128'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        <div className="flex-1 py-1">
          <h3 className="font-semibold text-dark group-hover:text-primary-500 transition-colors mb-1">{product.name}</h3>
          <StarRating rating={product.rating} count={product.review_count} />
          <PriceDisplay price={product.price} originalPrice={product.original_price} size="md" />
          <p className="text-sm text-gray-500 mt-1">{product.stock_quantity > 0 ? `✓ ${product.stock_quantity} in stock` : '✗ Out of stock'}</p>
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <button onClick={handleWishlist} className="p-2 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary-500 text-primary-500' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock_quantity === 0}
            className="btn-primary py-2 px-3 text-sm flex items-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            {adding ? '...' : 'Add'}
          </button>
        </div>
      </Link>
    )
  }

  return (
    <div className="card overflow-hidden group relative">
            {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{discount}%
        </div>
      )}

            <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary-500 text-primary-500' : 'text-gray-500'}`} />
      </button>

            <Link to={`/product/${product.slug}`} className="block overflow-hidden h-52 bg-gray-50">
        <img
          src={product.main_image_url || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

            <div className="absolute bottom-[160px] left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/product/${product.slug}`}
          className="bg-dark text-white text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-primary-500 transition-colors"
        >
          <Eye className="w-3 h-3" />Quick View
        </Link>
      </div>

            <div className="p-4">
        <Link to={`/product/${product.slug}`} className="block">
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{product.category_name || 'Electronics'}</p>
          <h3 className="font-semibold text-dark hover:text-primary-500 transition-colors line-clamp-2 mb-2 text-sm leading-snug">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.rating} count={product.review_count} />

        <div className="mt-2 mb-3">
          <PriceDisplay price={product.price} originalPrice={product.original_price} size="sm" />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={adding || product.stock_quantity === 0}
          className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock_quantity === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
