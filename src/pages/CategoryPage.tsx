import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Product, Category } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { Spinner, EmptyState } from '../components/ui'
import { ChevronRight } from 'lucide-react'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (!slug) return
    fetchCategory()
  }, [slug])

  useEffect(() => {
    if (category) fetchProducts()
  }, [category, sortBy])

  async function fetchCategory() {
    const { data } = await supabase.from('categories').select('*').eq('slug', slug).single()
    setCategory(data)
  }

  async function fetchProducts() {
    if (!category) return
    setLoading(true)
    let query = supabase
      .from('products_with_category')
      .select('*')
      .eq('category_id', category.id)
      .eq('is_active', true)

    if (sortBy === 'price_asc') query = query.order('price', { ascending: true })
    else if (sortBy === 'price_desc') query = query.order('price', { ascending: false })
    else if (sortBy === 'popular') query = query.order('rating', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  if (!category && !loading) {
    return (
      <div className="page-container py-20">
        <EmptyState title="Category not found" description="This category doesn't exist." action={<a href="/products" className="btn-primary inline-flex">Browse All</a>} />
      </div>
    )
  }

  return (
    <div className="page-container py-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-primary">Products</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{category?.name}</span>
      </nav>

            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Bebas Neue', cursive" }}>
            {category?.name}
          </h1>
          {category?.description && <p className="text-gray-600 mt-1">{category.description}</p>}
          <p className="text-sm text-gray-500 mt-1">{products.length} products</p>
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="input w-48"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <EmptyState title="No products yet" description="Check back soon for new arrivals." action={<a href="/products" className="btn-primary inline-flex">Browse All</a>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  )
}
