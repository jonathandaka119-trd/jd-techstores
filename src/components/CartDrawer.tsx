import { Link, useNavigate } from 'react-router-dom'
import { X, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store'
import { useCart } from '../hooks/useCart'
import { QuantitySelector, PriceDisplay, EmptyState } from './ui'

export default function CartDrawer() {
  const { isOpen, items, toggleCart } = useCartStore()
  const { removeFromCart, updateCartQuantity, getTotal, formatPrice } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    toggleCart()
    navigate('/checkout')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={toggleCart} />

            <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-up">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary-500" />
            <h2 className="font-bold text-dark text-lg">Shopping Cart</h2>
            {items.length > 0 && (
              <span className="bg-primary-100 text-primary-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart className="w-8 h-8" />}
              title="Your cart is empty"
              description="Add some products to get started"
              action={
                <button onClick={toggleCart}>
                  <Link to="/products" className="btn-primary text-sm py-2.5 px-5" onClick={toggleCart}>
                    Browse Products
                  </Link>
                </button>
              }
            />
          ) : (
            items.map(item => (
              <div key={item.product_id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                <img
                  src={item.product.main_image_url || 'https://via.placeholder.com/60'}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark line-clamp-2 mb-1">{item.product.name}</p>
                  <p className="text-primary-500 font-bold text-sm">{formatPrice(item.product.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(q) => updateCartQuantity(item.product_id, q)}
                      max={item.product.stock_quantity}
                    />
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

                {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-dark text-lg">{formatPrice(getTotal())}</span>
            </div>
            {getTotal() < 5000 && (
              <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                Add {formatPrice(5000 - getTotal())} more for free shipping!
              </p>
            )}
            <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/cart"
              onClick={toggleCart}
              className="block text-center text-sm text-gray-500 hover:text-primary-500 transition-colors"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
