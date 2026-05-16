import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Star, ChevronRight, Truck, Shield, RotateCcw, Share2, Loader2, Zap, CheckCircle2, Package } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { StarRating, PriceDisplay, StockIndicator, QuantitySelector, Spinner, toast } from '../components/ui'
import ProductCard from '../components/ProductCard'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useWishlistStore } from '../store'
import type { Product, ProductSpecification, Review } from '../lib/supabase'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const { addToCart, formatPrice } = useCart()
  const { hasId, addId, removeId } = useWishlistStore()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [specs, setSpecs] = useState<{ name: string; value: string }[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [related, setRelated] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [activeImg, setActiveImg] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [addingCart, setAddingCart] = useState(false)
  const [buyingNow, setBuyingNow] = useState(false)
  const [tab, setTab] = useState<'desc' | 'specs' | 'reviews'>('desc')

  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (slug) fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data: rawProd } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single()

      if (!rawProd) { setLoading(false); return }

      const prod = {
        ...rawProd,
        category_name: (rawProd as any).categories?.name,
        category_slug: (rawProd as any).categories?.slug,
      }

      setProduct(prod as Product)
      setActiveImg(prod.main_image_url || '')

      const jsonSpecs = (rawProd as any).specifications
      if (jsonSpecs && typeof jsonSpecs === 'object' && !Array.isArray(jsonSpecs)) {
        setSpecs(Object.entries(jsonSpecs).map(([name, value]) => ({ name, value: String(value) })))
      }

      const [{ data: reviewData }, { data: relData }] = await Promise.all([
        supabase.from('reviews').select('*, profiles(full_name, avatar_url)').eq('product_id', rawProd.id).eq('is_approved', true).order('created_at', { ascending: false }),
        supabase.from('products').select('*, categories(name,slug)').eq('is_active', true).eq('category_id', rawProd.category_id).neq('id', rawProd.id).limit(4),
      ])

      setReviews((reviewData as any[]) || [])
      setRelated(
        ((relData || []) as any[]).map(p => ({
          ...p,
          category_name: p.categories?.name,
          category_slug: p.categories?.slug,
        })) as Product[]
      )
    } catch (err) {
      console.error('ProductDetail error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    if (!user) { toast.info('Please sign in to add items to cart'); return }
    setAddingCart(true)
    try {
      const { error } = await addToCart(product, quantity)
      if (error) toast.error(typeof error === 'string' ? error : 'Error adding to cart')
      else toast.success('Added to cart!')
    } finally {
      setAddingCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    if (!user) { toast.info('Please sign in to continue'); return }
    setBuyingNow(true)
    try {
      const { error } = await addToCart(product, quantity)
      if (error) { toast.error(typeof error === 'string' ? error : 'Error'); return }
      navigate('/checkout')
    } finally {
      setBuyingNow(false)
    }
  }

  const handleWishlist = async () => {
    if (!product) return
    if (!user) { toast.info('Please sign in to use wishlist'); return }
    if (hasId(product.id)) {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id)
      removeId(product.id)
      toast.info('Removed from wishlist')
    } else {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: product.id })
      addId(product.id)
      toast.success('Added to wishlist!')
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !product) return
    setSubmittingReview(true)
    const { error } = await supabase.from('reviews').upsert({
      product_id: product.id,
      user_id: user.id,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
    })
    if (error) toast.error('Failed to submit review')
    else { toast.success('Review submitted!'); fetchProduct() }
    setSubmittingReview(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 text-lg mb-4">Product not found</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    </div>
  )

  const discount = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary-500">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary-500">Products</Link>
          {product.category_name && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/category/${product.category_slug}`} className="hover:text-primary-500">{product.category_name}</Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-10">

            <div>
              <div className="rounded-lg overflow-hidden bg-gray-50 mb-4 aspect-square border border-gray-100">
                <img src={activeImg || 'https://via.placeholder.com/600'} alt={product.name} className="w-full h-full object-contain p-4" />
              </div>
            </div>

            <div>
              {product.category_name && (
                <Link to={`/category/${product.category_slug}`} className="text-primary-500 text-xs font-bold uppercase tracking-widest hover:underline">
                  {product.category_name}
                </Link>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-dark mt-2 mb-2 leading-tight">{product.name}</h1>
              {product.sku && <p className="text-gray-400 text-xs mb-3">SKU: {product.sku}</p>}

              <div className="flex items-center gap-3 mb-5">
                <StarRating rating={product.rating} count={product.review_count} size="md" />
                <span className="text-gray-200">|</span>
                <StockIndicator quantity={product.stock_quantity} />
              </div>

              <div className="mb-5">
                <PriceDisplay price={product.price} originalPrice={product.original_price} size="lg" />
                {product.original_price && product.original_price > product.price && (
                  <p className="text-green-600 text-sm font-medium mt-1">
                    You save {formatPrice(product.original_price - product.price)}
                  </p>
                )}
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

              {/* ── Action buttons ─────────────────────────── */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock_quantity} />
                  <div className="flex gap-2 ml-auto">
                    <button onClick={handleWishlist} className="p-2.5 border border-gray-200 rounded-md hover:border-primary-400 hover:bg-primary-50 transition-colors" title="Add to wishlist">
                      <Heart className={`w-5 h-5 ${hasId(product.id) ? 'fill-primary-500 text-primary-500' : 'text-gray-400'}`} />
                    </button>
                    <button onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }) }} className="p-2.5 border border-gray-200 rounded-md hover:border-gray-300 transition-colors" title="Share">
                      <Share2 className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingCart || product.stock_quantity === 0}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-md font-bold text-base transition-colors border-2 border-primary-500 text-primary-500 hover:bg-primary-50 disabled:opacity-50"
                >
                  {addingCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={buyingNow || product.stock_quantity === 0}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-md font-bold text-base transition-colors bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50"
                >
                  {buyingNow ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Buy Now'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Truck className="w-4 h-4" />, text: 'Free shipping over ₽5K' },
                  { icon: <Shield className="w-4 h-4" />, text: '2-year warranty' },
                  { icon: <RotateCcw className="w-4 h-4" />, text: '30-day returns' },
                ].map((g, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-md">
                    <div className="text-primary-500 mb-1">{g.icon}</div>
                    <span className="text-xs text-gray-600">{g.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────── */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="flex border-b border-gray-100">
            {([
              ['desc',    'Description'],
              ['specs',   `Specifications${specs.length ? ` (${specs.length})` : ''}`],
              ['reviews', `Reviews (${reviews.length})`],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-6 py-4 text-sm font-semibold transition-colors ${tab === key ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500 hover:text-dark'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">

            {/* Description */}
            {tab === 'desc' && (
              <div className="max-w-3xl">
                <h3 className="text-lg font-bold text-dark mb-3">About this product</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

                {specs.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold text-dark mb-3">Key highlights</h3>
                    <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                      {specs.slice(0, 6).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                          <span><strong>{s.name}:</strong> {s.value}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="border border-gray-100 rounded-md p-4 bg-gray-50 flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-dark mb-1">What's in the box</p>
                    <p className="text-sm text-gray-500">{product.name} · User manual · Warranty card · Accessories as per specifications above</p>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications */}
            {tab === 'specs' && (
              <div className="max-w-3xl">
                {specs.length === 0 ? (
                  <p className="text-gray-500 text-sm">No specifications available for this product.</p>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-dark mb-4">Technical Specifications</h3>
                    <div className="overflow-hidden rounded-md border border-gray-200">
                      <table className="w-full text-sm">
                        <tbody>
                          {specs.map((spec, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="px-5 py-3.5 font-semibold text-dark w-2/5 border-r border-gray-100">{spec.name}</td>
                              <td className="px-5 py-3.5 text-gray-600">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Reviews */}
            {tab === 'reviews' && (
              <div>
                <div className="flex items-center gap-6 mb-8 p-5 bg-gray-50 rounded-md">
                  <div className="text-center min-w-[80px]">
                    <div className="text-5xl font-bold text-dark">{product.rating.toFixed(1)}</div>
                    <StarRating rating={product.rating} size="md" />
                    <p className="text-xs text-gray-500 mt-1">{product.review_count} reviews</p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-gray-500 w-3">{star}</span>
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {reviews.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-6">No reviews yet. Be the first to review this product!</p>
                )}

                <div className="space-y-4 mb-8">
                  {reviews.map(r => (
                    <div key={r.id} className="p-4 border border-gray-100 rounded-md">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                            {(r.profile as any)?.full_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-dark text-sm">{(r.profile as any)?.full_name || 'Customer'}</p>
                            <p className="text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString('ru-RU')}</p>
                          </div>
                        </div>
                        <StarRating rating={r.rating} size="sm" />
                      </div>
                      {r.title && <p className="font-semibold text-dark text-sm mb-1">{r.title}</p>}
                      {r.comment && <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>

                {user ? (
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-bold text-dark mb-4">Write a Review</h4>
                    <form onSubmit={handleSubmitReview} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <button key={s} type="button" onClick={() => setReviewRating(s)}>
                              <Star className={`w-7 h-7 transition-colors ${s <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                        <input type="text" placeholder="Summarise your experience" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Review</label>
                        <textarea placeholder="Tell other customers what you think..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={4} className="input resize-none" />
                      </div>
                      <button type="submit" disabled={submittingReview} className="btn-primary flex items-center gap-2">
                        {submittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                        Submit Review
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-600 mb-3 text-sm">Sign in to share your experience with this product</p>
                    <Link to="/login" className="btn-primary text-sm py-2.5">Sign In to Review</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-display text-3xl tracking-wide mb-6 text-dark">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
