import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Grid, List, Search, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { ProductSkeleton, Pagination, EmptyState } from '../components/ui'
import type { Product, Category } from '../lib/supabase'
import { CATEGORIES as MOCK_CATEGORIES } from '../lib/mockData'

const SORT_OPTIONS = [
  { value: 'review_count.desc', label: 'Most Popular' },
  { value: 'created_at.desc', label: 'Newest' },
  { value: 'price.asc', label: 'Price: Low to High' },
  { value: 'price.desc', label: 'Price: High to Low' },
  { value: 'rating.desc', label: 'Highest Rated' },
]

const PER_PAGE = 12

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'review_count.desc'
  const search = searchParams.get('q') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      setCategories(data?.length ? (data as Category[]) : (MOCK_CATEGORIES as unknown as Category[]))
    })
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [page, category, sort, search, minPrice, maxPrice])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const [col, dir] = sort.split('.')

      let categoryId: string | null = null
      if (category) {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single()
        categoryId = cat?.id ?? null
      }

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true)

      if (categoryId) query = query.eq('category_id', categoryId)
      if (search)    query = query.ilike('name', `%${search}%`)
      if (minPrice)  query = query.gte('price', parseFloat(minPrice))
      if (maxPrice)  query = query.lte('price', parseFloat(maxPrice))

      query = query
        .order(col, { ascending: dir === 'asc' })
        .range((page - 1) * PER_PAGE, page * PER_PAGE - 1)

      const { data, count, error } = await query
      if (error) throw error

      setProducts((data || []) as Product[])
      setTotal(count || 0)
    } catch (err) {
      console.error('Products fetch error:', err)
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== 'page') params.delete('page')
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams({ sort })
  }

  const hasFilters = category || search || minPrice || maxPrice

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-display text-4xl tracking-wide text-dark dark:text-white mb-2">
            {category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
          </h1>
          <p className="text-gray-500">{total} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium hover:border-primary-300 lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && <span className="bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">!</span>}
          </button>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2 flex-1 max-w-xs">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setParam('q', e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
            />
            {search && <button onClick={() => setParam('q', '')}><X className="w-3 h-3 text-gray-400" /></button>}
          </div>

                    <select
            value={sort}
            onChange={e => setParam('sort', e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white ml-auto">
            <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>

                    {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
              <X className="w-3 h-3" />Clear filters
            </button>
          )}
        </div>

        <div className="flex gap-6">
                    <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-dark mb-4">Filters</h3>

                            <div className="mb-6">
                <h4 className="font-semibold text-dark text-sm mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!category}
                      onChange={() => setParam('category', '')}
                      className="accent-primary-500"
                    />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat.slug}
                        checked={category === cat.slug}
                        onChange={() => setParam('category', cat.slug)}
                        className="accent-primary-500"
                      />
                      <span className="text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

                            <div className="mb-6">
                <h4 className="font-semibold text-dark text-sm mb-3">Price Range (₽)</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setParam('minPrice', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-primary-500"
                  />
                  <span className="text-gray-400">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setParam('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-primary-500"
                  />
                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                  {[['0', '5000', 'Under ₽5K'], ['5000', '20000', '₽5K–20K'], ['20000', '', 'Over ₽20K']].map(([min, max, label]) => (
                    <button
                      key={label}
                      onClick={() => { setParam('minPrice', min); setParam('maxPrice', max) }}
                      className="text-xs px-3 py-1 rounded-full border border-gray-200 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <button onClick={clearFilters} className="w-full btn-secondary py-2 text-sm">
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

                    <div className="flex-1">
            {loading ? (
              <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {Array(PER_PAGE).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100">
                <EmptyState
                  icon={<Search className="w-8 h-8" />}
                  title="No products found"
                  description="Try adjusting your filters or search query"
                  action={
                    <button onClick={clearFilters} className="btn-primary text-sm py-2.5">
                      Clear Filters
                    </button>
                  }
                />
              </div>
            ) : (
              <>
                <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map(p => <ProductCard key={p.id} product={p} view={view} />)}
                </div>
                <Pagination page={page} total={total} perPage={PER_PAGE} onChange={p => setParam('page', p.toString())} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
