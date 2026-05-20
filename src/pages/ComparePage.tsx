import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, X, GitCompare, ArrowLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatPrice, getDiscount } from '../lib/mockData'
import toast from 'react-hot-toast'

export default function ComparePage() {
  const { compareList, toggleCompare, clearCompare, addToCart, toggleWishlist, isInWishlist, setCartOpen } = useStore()

  if (compareList.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <GitCompare className="w-16 h-16 text-gray-600" />
        <h2 className="text-white text-2xl font-bold">No products to compare</h2>
        <p className="text-gray-400">Add up to 3 products using the Compare button on any product card.</p>
        <Link to="/products" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  const handleAddToCart = (product: any) => {
    if (product.stock_quantity === 0) { toast.error('Out of stock'); return }
    addToCart(product)
    toast.success('Added to cart!')
    setCartOpen(true)
  }

  const rows: { label: string; key: string; resolve?: (product: any) => string }[] = [
    { label: 'Price', key: 'price', resolve: (p) => formatPrice(p.price) },
    { label: 'Original Price', key: 'original_price', resolve: (p) => p.original_price ? formatPrice(p.original_price) : '—' },
    { label: 'Discount', key: 'discount', resolve: (p) => p.original_price && getDiscount(p.price, p.original_price) > 0 ? `-${getDiscount(p.price, p.original_price)}%` : '—' },
    { label: 'Stock', key: 'stock_quantity', resolve: (p) => p.stock_quantity === 0 ? 'Out of stock' : `${p.stock_quantity} units` },
    { label: 'Category', key: 'category_name', resolve: (p) => p.category_name || p.categories?.name || '—' },
    { label: 'Rating', key: 'rating', resolve: (p) => p.rating ? `${Number(p.rating).toFixed(1)} / 5` : '—' },
    { label: 'Reviews', key: 'review_count', resolve: (p) => p.review_count ? `${p.review_count} reviews` : '0 reviews' },
    { label: 'SKU', key: 'sku', resolve: (p) => p.sku || '—' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-white text-2xl font-bold flex items-center gap-2">
                <GitCompare className="w-6 h-6 text-primary-500" /> Product Comparison
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">Comparing {compareList.length} product{compareList.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={clearCompare} className="text-gray-400 hover:text-red-400 text-sm flex items-center gap-1.5 transition-colors">
            <X className="w-4 h-4" /> Clear All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Product images & names */}
            <thead>
              <tr>
                <th className="w-40 text-left pb-6 pr-4 text-gray-500 text-sm font-medium align-bottom">Product</th>
                {compareList.map(product => (
                  <th key={product.id} className="pb-6 px-4 text-left align-top">
                    <div className="bg-dark-800 border border-gray-800 rounded-2xl overflow-hidden">
                      <div className="relative aspect-square bg-dark-700">
                        <img
                          src={product.main_image_url || ''}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => toggleCompare(product)}
                          className="absolute top-2 right-2 w-7 h-7 bg-dark-800/80 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="p-4">
                        <Link to={`/product/${product.slug}`} className="text-white font-semibold text-sm hover:text-primary-400 transition-colors line-clamp-2">
                          {product.name}
                        </Link>
                        <p className="text-primary-500 font-bold text-lg mt-2">{formatPrice(product.price)}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock_quantity === 0}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                          </button>
                          <button
                            onClick={() => { toggleWishlist(product.id); toast.success(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist') }}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${isInWishlist(product.id) ? 'border-primary-500 text-primary-500' : 'border-gray-700 text-gray-400 hover:border-primary-500 hover:text-primary-500'}`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody>
              {rows.map(({ label, resolve }, i) => (
                <tr key={label} className={i % 2 === 0 ? 'bg-dark-800/40' : ''}>
                  <td className="py-3 pr-4 text-gray-500 text-sm font-medium rounded-l-lg pl-3">{label}</td>
                  {compareList.map(product => {
                    const value = resolve ? resolve(product) : '—'
                    const isHighlight = label === 'Price' && compareList.every(p => p.price >= product.price)
                    return (
                      <td key={product.id} className={`py-3 px-4 text-sm font-medium ${isHighlight ? 'text-green-400' : 'text-white'}`}>
                        {value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
