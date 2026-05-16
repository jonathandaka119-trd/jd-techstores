import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Tag, ArrowRight, CreditCard, Truck, Loader2, CheckCircle } from 'lucide-react'
import { useCartStore } from '../store'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { QuantitySelector, EmptyState, toast } from '../components/ui'
import { supabase } from '../lib/supabase'

export function CartPage() {
  const { items } = useCartStore()
  const { removeFromCart, updateCartQuantity, getTotal, formatPrice, clearUserCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponId, setCouponId] = useState<string | null>(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  const subtotal = getTotal()
  const tax = subtotal * 0.18
  const shipping = subtotal >= 5000 ? 0 : 490
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal + tax + shipping - discountAmount

  const handleCoupon = async () => {
    if (!couponCode.trim()) return
    setValidatingCoupon(true)
    const { data, error } = await supabase.rpc('validate_coupon', {
      coupon_code: couponCode.toUpperCase(),
      order_value: subtotal
    })
    if (error || !data?.valid) {
      toast.error(data?.message || 'Invalid coupon code')
      setDiscount(0)
      setCouponId(null)
    } else {
      toast.success(`Coupon applied! ${data.discount_percentage}% off`)
      setDiscount(data.discount_percentage)
      setCouponId(data.coupon_id)
    }
    setValidatingCoupon(false)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          icon={<ShoppingCart className="w-10 h-10" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-display text-4xl tracking-wide mb-8">SHOPPING CART</h1>

        <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.product_id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
                <img
                  src={item.product.main_image_url || 'https://via.placeholder.com/80'}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-gray-50"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.slug}`} className="font-semibold text-dark hover:text-primary-500 transition-colors line-clamp-2 text-sm">
                    {item.product.name}
                  </Link>
                  <p className="text-primary-500 font-bold mt-1">{formatPrice(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(q) => updateCartQuantity(item.product_id, q)}
                    max={item.product.stock_quantity}
                  />
                  <p className="font-bold text-dark w-24 text-right hidden sm:block">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  <button onClick={() => removeFromCart(item.product_id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
            <h2 className="font-bold text-dark text-lg mb-5">Order Summary</h2>

                        <div className="flex gap-2 mb-5">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="input pl-9 text-sm py-2.5"
                />
              </div>
              <button
                onClick={handleCoupon}
                disabled={validatingCoupon}
                className="btn-primary py-2.5 px-4 text-sm flex-shrink-0"
              >
                {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
              </button>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (18%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  Add {formatPrice(5000 - subtotal)} more for free shipping
                </p>
              )}
            </div>

            <div className="flex justify-between font-bold text-dark text-lg border-t border-gray-100 pt-4 mt-3">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Link
              to="/checkout"
              state={{ discount, couponId, shipping, tax, total }}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-5"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-primary-500 mt-3">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const { clearUserCart, formatPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address')
  const [loading, setLoading] = useState(false)

  const [address, setAddress] = useState({
    full_name: user?.full_name || '',
    street: '',
    city: '',
    region: '',
    postal_code: '',
    country: 'Russia',
    phone: '',
  })

  const [delivery, setDelivery] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')

  const subtotal = getTotal()
  const shipping = delivery === 'express' ? 990 : delivery === 'overnight' ? 1990 : subtotal >= 5000 ? 0 : 490
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  const handleOrder = async () => {
    if (!user) return
    setLoading(true)
    try {
      // Fetch authoritative prices from the database to prevent client-side price tampering
      const productIds = items.map(i => i.product_id)
      const { data: dbProducts, error: priceErr } = await supabase
        .from('products')
        .select('id, price, stock_quantity, is_active')
        .in('id', productIds)

      if (priceErr || !dbProducts) throw new Error('Could not verify product prices. Please try again.')

      // Build a trusted price map keyed by product id
      const priceMap = Object.fromEntries(dbProducts.map(p => [p.id, p]))

      // Validate every item
      for (const item of items) {
        const trusted = priceMap[item.product_id]
        if (!trusted) throw new Error(`Product "${item.product.name}" is no longer available.`)
        if (!trusted.is_active) throw new Error(`Product "${item.product.name}" is no longer available.`)
        if (trusted.stock_quantity < item.quantity)
          throw new Error(`Insufficient stock for "${item.product.name}".`)
      }

      // Recalculate totals using DB prices
      const trustedSubtotal = items.reduce((sum, item) => sum + priceMap[item.product_id].price * item.quantity, 0)
      const trustedTax      = trustedSubtotal * 0.18
      const trustedShipping = delivery === 'express' ? 990 : delivery === 'overnight' ? 1990 : trustedSubtotal >= 5000 ? 0 : 490
      const trustedTotal    = trustedSubtotal + trustedShipping + trustedTax

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          subtotal: trustedSubtotal,
          tax_amount: trustedTax,
          shipping_cost: trustedShipping,
          discount_amount: 0,
          total_amount: trustedTotal,
          shipping_address: address,
          delivery_method: delivery,
          payment_method: paymentMethod,
          estimated_delivery: new Date(Date.now() + (delivery === 'overnight' ? 1 : delivery === 'express' ? 3 : 7) * 86400000).toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      await supabase.from('order_items').insert(
        items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product.name,
          product_image: item.product.main_image_url,
          quantity: item.quantity,
          unit_price: priceMap[item.product_id].price,
          subtotal: priceMap[item.product_id].price * item.quantity,
        }))
      )

      await clearUserCart()

      if (paymentMethod === 'yookassa') {
        const returnUrl = `${window.location.origin}/order-confirmation/${order.order_number}`
        const { data: fn, error: fnErr } = await supabase.functions.invoke('create-yookassa-payment', {
          body: { order_id: order.id, amount: total, return_url: returnUrl },
        })
        if (fnErr || !fn?.confirmation_url) throw new Error(fnErr?.message ?? 'Could not create YooKassa payment')
        window.location.href = fn.confirmation_url
        return
      }

      navigate(`/order-confirmation/${order.order_number}`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to place order. Please try again.')
    }
    setLoading(false)
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Please sign in to checkout</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-display text-4xl tracking-wide mb-2">CHECKOUT</h1>

                <div className="flex items-center gap-3 mb-8">
          {[['address', 'Shipping'], ['payment', 'Payment'], ['confirm', 'Review']].map(([s, label], i) => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => step !== s && i < ['address', 'payment', 'confirm'].indexOf(step) && setStep(s as any)}
                className={`flex items-center gap-2 text-sm font-medium ${step === s ? 'text-primary-500' : i < ['address', 'payment', 'confirm'].indexOf(step) ? 'text-green-600' : 'text-gray-400'}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? 'bg-primary-500 text-white' : i < ['address', 'payment', 'confirm'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i < ['address', 'payment', 'confirm'].indexOf(step) ? '✓' : i + 1}
                </span>
                {label}
              </button>
              {i < 2 && <div className="w-8 h-px bg-gray-300" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              {step === 'address' && (
                <div>
                  <h2 className="font-bold text-dark text-lg mb-5 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary-500" /> Shipping Address
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                      <input type="text" required value={address.full_name} onChange={e => setAddress(a => ({ ...a, full_name: e.target.value }))} className="input" placeholder="John Doe" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                      <input type="text" required value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} className="input" placeholder="Street, Building, Apartment" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                      <input type="text" required value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} className="input" placeholder="Moscow" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
                      <input type="text" value={address.region} onChange={e => setAddress(a => ({ ...a, region: e.target.value }))} className="input" placeholder="Moscow Oblast" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                      <input type="text" value={address.postal_code} onChange={e => setAddress(a => ({ ...a, postal_code: e.target.value }))} className="input" placeholder="123456" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      <input type="tel" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} className="input" placeholder="+7 (999) 000-0000" />
                    </div>
                  </div>

                  <h3 className="font-semibold text-dark mb-3">Delivery Method</h3>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'standard', label: 'Standard Delivery', time: '5-7 business days', price: subtotal >= 5000 ? 'FREE' : '₽490' },
                      { id: 'express', label: 'Express Delivery', time: '2-3 business days', price: '₽990' },
                      { id: 'overnight', label: 'Overnight Delivery', time: 'Next business day', price: '₽1,990' },
                    ].map(opt => (
                      <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${delivery === opt.id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input type="radio" name="delivery" value={opt.id} checked={delivery === opt.id} onChange={() => setDelivery(opt.id)} className="accent-primary-500" />
                        <div className="flex-1">
                          <p className="font-semibold text-dark text-sm">{opt.label}</p>
                          <p className="text-gray-500 text-xs">{opt.time}</p>
                        </div>
                        <span className={`font-bold ${opt.price === 'FREE' ? 'text-green-600' : 'text-dark'}`}>{opt.price}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => address.street && address.city ? setStep('payment') : toast.error('Please fill in all required fields')}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div>
                  <h2 className="font-bold text-dark text-lg mb-5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-500" /> Payment Method
                  </h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'yookassa', label: 'YooKassa', icon: '🏦', desc: 'Cards, e-wallets, SBP — all payment methods' },
                      { id: 'cash', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
                      { id: 'transfer', label: 'Bank Transfer', icon: '🏛️', desc: 'Direct bank transfer (manual processing)' },
                    ].map(opt => (
                      <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === opt.id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input type="radio" name="payment" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="accent-primary-500" />
                        <span className="text-2xl">{opt.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-dark text-sm">{opt.label}</p>
                          <p className="text-gray-500 text-xs">{opt.desc}</p>
                        </div>
                        {opt.id === 'yookassa' && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">Recommended</span>
                        )}
                      </label>
                    ))}
                  </div>
                  {paymentMethod === 'yookassa' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
                      You will be redirected to the secure YooKassa payment page to complete your order.
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setStep('address')} className="btn-secondary flex-1">← Back</button>
                    <button onClick={() => setStep('confirm')} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      Review Order <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 'confirm' && (
                <div>
                  <h2 className="font-bold text-dark text-lg mb-5">Review Your Order</h2>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipping to</p>
                    <p className="text-sm text-dark">{address.full_name} · {address.street}, {address.city}, {address.postal_code}</p>
                    <p className="text-xs text-gray-500 mt-1">Delivery: {delivery} · Payment: {paymentMethod}</p>
                  </div>

                  <div className="space-y-3 mb-5">
                    {items.map(item => (
                      <div key={item.product_id} className="flex gap-3 items-center">
                        <img src={item.product.main_image_url || ''} alt="" className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                        <div className="flex-1 text-sm">
                          <p className="font-medium text-dark line-clamp-1">{item.product.name}</p>
                          <p className="text-gray-500">× {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-dark text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('payment')} className="btn-secondary flex-1">← Back</button>
                    <button onClick={handleOrder} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Place Order · {formatPrice(total)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit sticky top-24">
            <h3 className="font-bold text-dark mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18%)</span><span>{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-dark border-t border-gray-100 pt-3">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrderConfirmationPage() {
  const { orderNumber } = { orderNumber: window.location.pathname.split('/').pop() }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center max-w-md w-full animate-slide-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-display text-3xl tracking-wide text-dark mb-2">ORDER PLACED!</h1>
        <p className="text-gray-500 mb-4">Thank you for your purchase.</p>
        <div className="bg-gray-50 rounded-xl px-6 py-4 mb-6">
          <p className="text-xs text-gray-500 mb-1">Order Number</p>
          <p className="font-mono font-bold text-dark text-lg">{orderNumber}</p>
        </div>
        <p className="text-sm text-gray-600 mb-8">
          A confirmation email has been sent. Your order will be processed within 1-2 business days.
        </p>

                <div className="text-left mb-8">
          {[
            { label: 'Order Confirmed', done: true },
            { label: 'Processing', done: false },
            { label: 'Shipped', done: false },
            { label: 'Delivered', done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {step.done ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${step.done ? 'font-semibold text-dark' : 'text-gray-400'}`}>{step.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/orders" className="btn-primary">Track Your Order</Link>
          <Link to="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
