import { useSearchParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { Spinner, EmptyState } from '../components/ui'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim()) {
      setLoading(true)
      supabase
        .from('products_with_category')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category_name.ilike.%${query}%`)
        .order('rating', { ascending: false })
        .limit(48)
        .then(({ data }) => {
          setProducts(data || [])
          setLoading(false)
        })
    } else {
      setProducts([])
    }
  }, [query])

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Bebas Neue', cursive" }}>
          Search Results
        </h1>
        {query && (
          <p className="text-gray-600">
            {loading ? 'Searching...' : `${products.length} results for `}
            {!loading && <span className="font-semibold text-gray-900">"{query}"</span>}
          </p>
        )}
      </div>

      {!query ? (
        <EmptyState
          icon={<Search size={48} className="text-gray-300" />}
          title="Enter a search term"
          description="Use the search bar above to find products."
          action={<a href="/products" className="btn-primary inline-flex">Browse All Products</a>}
        />
      ) : loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <EmptyState
          title={`No results for "${query}"`}
          description="Try different keywords or browse our categories."
          action={<a href="/products" className="btn-primary inline-flex">Browse All Products</a>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  )
}
