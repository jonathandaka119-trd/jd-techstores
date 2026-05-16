import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWishlistStore } from '../store'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { EmptyState, Spinner } from '../components/ui'
import { Heart } from 'lucide-react'

export default function WishlistPage() {
  const { user } = useAuth()
  const { productIds } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || productIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    supabase
      .from('products_with_category')
      .select('*')
      .in('id', productIds)
      .eq('is_active', true)
      .then(({ data }) => {
        setProducts(data || [])
        setLoading(false)
      })
  }, [user, productIds])

  if (!user) {
    return (
      <div className="page-container py-20">
        <EmptyState
          icon={<Heart size={48} className="text-gray-300" />}
          title="Sign in to view your wishlist"
          description="Create an account or sign in to save your favourite products."
          action={<Link to="/login" className="btn-primary inline-flex">Sign In</Link>}
        />
      </div>
    )
  }

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Bebas Neue', cursive" }}>
          My Wishlist
        </h1>
        <p className="text-gray-600 mt-1">{productIds.length} saved items</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Heart size={48} className="text-gray-300" />}
          title="Your wishlist is empty"
          description="Save products you love by clicking the heart icon."
          action={<Link to="/products" className="btn-primary inline-flex">Browse Products</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  )
}
