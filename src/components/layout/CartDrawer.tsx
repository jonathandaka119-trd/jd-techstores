import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { formatPrice } from '../../lib/mockData'

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useStore()
  const total = cartTotal()

  return (
    <>
            {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      )}
      
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-dark-800 border-l border-gray-800 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-500" />
            Shopping Cart
            {cartItems.length > 0 && (
              <span className="badge bg-primary-500/20 text-primary-400">{cartItems.length}</span>
            )}
          </h2>
          <button onClick={() => setCartOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-700 mb-4" />
              <p className="text-gray-400 font-medium">Your cart is empty</p>
              <p className="text-gray-600 text-sm mt-1">Add some products to get started</p>
              <Link to="/products" onClick={() => setCartOpen(false)} className="btn-primary mt-6 text-sm">
                Browse Products
              </Link>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 glass rounded-xl p-3">
                <img
                  src={product.main_image_url || ''}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="text-white text-sm font-medium line-clamp-2 hover:text-primary-400 transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-primary-500 font-bold text-sm mt-1">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-6 h-6 rounded-md bg-dark-700 border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:border-primary-500 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white text-sm w-6 text-center font-mono">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock_quantity}
                      className="w-6 h-6 rounded-md bg-dark-700 border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:border-primary-500 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeFromCart(product.id)} className="ml-auto text-gray-500 hover:text-red-400 transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

                {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-800 space-y-3">
            {total >= 5000 && (
              <div className="flex items-center gap-2 text-green-400 text-xs glass rounded-lg p-2.5">
                <span>✓</span> Free shipping applied!
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-bold text-lg">{formatPrice(total)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/cart"
              onClick={() => setCartOpen(false)}
              className="btn-secondary w-full text-center text-sm py-2.5"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
