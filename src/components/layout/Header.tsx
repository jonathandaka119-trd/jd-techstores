import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, User, LogOut, Package, Settings, Cpu, Wifi, Printer, Gamepad2, Monitor, Cable } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const NAV_CATEGORIES = [
  { name: 'Gaming', slug: 'gaming', icon: Gamepad2 },
  { name: 'Processors & RAM', slug: 'processors', icon: Cpu },
  { name: 'Graphics Cards', slug: 'graphics', icon: Monitor },
  { name: 'Networking', slug: 'networking', icon: Wifi },
  { name: 'Office Equipment', slug: 'office', icon: Printer },
  { name: 'Accessories', slug: 'accessories', icon: Cable },
]

export default function Header() {
  const { user, setUser, cartCount, setCartOpen, searchQuery, setSearchQuery } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAccountOpen(false)
    toast.success('Logged out successfully')
    navigate('/')
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.account-menu')) setAccountOpen(false)
      if (!(e.target as Element).closest('.mega-menu')) setMegaMenuOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const count = cartCount()

  return (
    <header className="sticky top-0 z-50 bg-dark-800/95 backdrop-blur-md border-b border-gray-800">
            <div className="bg-primary-500 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>📍 Kirova Street, Kursk, Russia</span>
          <span>🚚 Free shipping on orders over ₽5,000</span>
          <span>📞 +7 (471) 000-00-00</span>
        </div>
      </div>
      
            <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-2xl text-white tracking-wider">JD</span>
              <span className="font-display text-2xl text-primary-500 tracking-wider">TECH</span>
              <div className="text-[9px] text-gray-400 leading-none -mt-1 tracking-widest">STORES</div>
            </div>
          </Link>

                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full bg-dark-700 border border-gray-700 focus:border-primary-500 text-white placeholder-gray-500 rounded-xl pl-4 pr-12 py-2.5 outline-none transition-colors text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link to="/wishlist" className="relative p-2 text-gray-400 hover:text-primary-500 transition-colors rounded-lg hover:bg-dark-700">
              <Heart className="w-5 h-5" />
            </Link>
            
                        <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-400 hover:text-primary-500 transition-colors rounded-lg hover:bg-dark-700">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

                        {user ? (
              <div className="relative account-menu">
                <button
                  onClick={(e) => { e.stopPropagation(); setAccountOpen(!accountOpen) }}
                  className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
                >
                  <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass rounded-xl overflow-hidden shadow-2xl animate-fade-in">
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-white font-semibold text-sm truncate">{user.full_name || 'User'}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link to="/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg text-sm transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/dashboard/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg text-sm transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      {(user.role === 'admin' || user.role === 'storekeeper') && (
                        <Link to={user.role === 'storekeeper' ? '/storekeeper' : '/admin'} onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-3 py-2 text-primary-400 hover:text-primary-300 hover:bg-dark-700 rounded-lg text-sm transition-colors">
                          <Settings className="w-4 h-4" /> {user.role === 'storekeeper' ? 'Storekeeper Panel' : 'Admin Panel'}
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-dark-700 rounded-lg text-sm transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">Sign In</Link>
            )}

                        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-dark-700">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

            <nav className="hidden lg:block border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1">
            <div className="relative mega-menu">
              <button
                onClick={(e) => { e.stopPropagation(); setMegaMenuOpen(!megaMenuOpen) }}
                className="flex items-center gap-1.5 px-4 py-3 text-gray-300 hover:text-white text-sm font-medium transition-colors hover:bg-dark-700 rounded-t-lg"
              >
                <Menu className="w-4 h-4" />
                All Categories
                <ChevronDown className={`w-3 h-3 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {megaMenuOpen && (
                <div className="absolute left-0 top-full bg-dark-800 border border-gray-700 rounded-xl shadow-2xl p-4 grid grid-cols-2 gap-2 w-72 animate-fade-in">
                  {NAV_CATEGORIES.map(cat => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setMegaMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg text-sm transition-colors"
                    >
                      <cat.icon className="w-4 h-4 text-primary-500" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {NAV_CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="px-4 py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors hover:bg-dark-700"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

            {menuOpen && (
        <div className="lg:hidden glass border-t border-gray-800 p-4 space-y-2 animate-slide-up">
          {NAV_CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg text-sm"
            >
              <cat.icon className="w-4 h-4 text-primary-500" />
              {cat.name}
            </Link>
          ))}
          {!user && (
            <div className="pt-2 flex gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-sm flex-1 text-center">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm flex-1 text-center">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
