import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, Headphones, Zap, Star, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { ProductSkeleton } from '../components/ui'
import type { Product, Category } from '../lib/supabase'
import { CATEGORIES as MOCK_CATEGORIES } from '../lib/mockData'

const CATEGORY_ICONS: Record<string, string> = {
  'gaming-peripherals': '🎮',
  'processors-ram': '⚡',
  'graphics-cards': '🖥️',
  'networking': '🌐',
  'office-equipment': '🖨️',
  'accessories': '🔌',
}

const VALUE_PROPS = [
  { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', desc: 'On orders over ₽5,000' },
  { icon: <Shield className="w-6 h-6" />, title: 'Secure Payment', desc: '100% protected transactions' },
  { icon: <Headphones className="w-6 h-6" />, title: '24/7 Support', desc: 'Expert help anytime' },
  { icon: <Zap className="w-6 h-6" />, title: 'Fast Delivery', desc: '1-3 business days' },
]

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES as unknown as Category[])
  const [featured, setFeatured] = useState<Product[]>([])
  const [trending, setTrending] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 10000)

    const run = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(8),
        ])

        if (catsRes.error) console.error('Categories error:', catsRes.error)
        if (prodsRes.error) console.error('Products error:', prodsRes.error)

        const cats  = catsRes.data  || []
        const prods = prodsRes.data || []

        if (cats.length)  setCategories(cats as Category[])
        if (prods.length) {
          setFeatured(prods as Product[])
          setTrending(prods.slice(0, 4) as Product[])
        }
      } catch (err) {
        console.error('HomePage fetch error:', err)
      } finally {
        clearTimeout(timeout)
        setLoading(false)
      }
    }
    run()

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div>
            <section className="relative overflow-hidden min-h-[600px] flex items-center">
                <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1920&q=85)' }}
        />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.92) 45%, rgba(10,10,10,0.55) 100%)' }} />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              <span className="text-primary-300 text-sm font-medium">New arrivals weekly</span>
            </div>
            <h1 className="font-display text-6xl md:text-7xl tracking-wide leading-none mb-4">
              NEXT-LEVEL
              <br />
              <span className="text-gradient">TECH GEAR</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg">
              Premium computer hardware, gaming peripherals, and office equipment. 
              Discover the latest technology at competitive prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/category/gaming-peripherals"
                className="text-base px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                style={{ border: '2px solid rgba(255,255,255,0.4)', color: '#fff', backgroundColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Gaming Gear
              </Link>
            </div>

                        <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
              {([['10k+', 'Happy Customers'], ['500+', 'Products'], ['5★', 'Avg. Rating']] as string[][]).map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-gray-400 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>

                    <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-primary-500/20 rounded-3xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600"
                alt="Gaming Setup"
                className="relative rounded-3xl w-full h-80 object-cover shadow-2xl"
              />
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-xl flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary-500 fill-primary-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer Rating</p>
                  <p className="font-bold text-dark">4.9 / 5.0</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-dark text-white rounded-2xl p-3 shadow-xl">
                <p className="text-xs text-gray-400">Today's Deal</p>
                <p className="font-bold text-primary-400">Up to 40% OFF</p>
              </div>
            </div>
          </div>
        </div>
      </section>

            <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUE_PROPS.map((v, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{v.title}</p>
                  <p className="text-gray-500 text-xs">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-1">Browse</p>
            <h2 className="font-display text-4xl tracking-wide text-dark">CATEGORIES</h2>
          </div>
          <Link to="/products" className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center text-center p-5 rounded-2xl border-2 border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
            >
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-primary-100 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-colors">
                {CATEGORY_ICONS[cat.slug] || '📦'}
              </div>
              <span className="text-sm font-semibold text-dark group-hover:text-primary-600 transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      </section>

            <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-1">Popular</p>
              <h2 className="font-display text-4xl tracking-wide text-dark">FEATURED PRODUCTS</h2>
            </div>
            <Link to="/products" className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

            <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-1">Top Rated</p>
            <h2 className="font-display text-4xl tracking-wide text-dark flex items-center gap-3">
              TRENDING NOW <TrendingUp className="w-8 h-8 text-primary-500" />
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
      </section>

            <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-4">
            BUILD YOUR DREAM SETUP
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            From processors to peripherals — everything you need to build the ultimate workstation or gaming rig.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="bg-white text-primary-500 font-bold px-8 py-3.5 rounded-lg hover:bg-primary-50 transition-colors">
              Shop All Products
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white text-white font-bold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors">
              Get Expert Advice
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
