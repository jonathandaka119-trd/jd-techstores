import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Heart, User, Search, Menu, X, MapPin, Truck,
  ChevronDown, LogOut, Package, LayoutDashboard, Shield, UserPlus
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCartStore, useUIStore } from '../store'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'

const CATEGORIES = [
  { name: 'Computers',       href: '/category/processors-ram' },
  { name: 'Gaming',          href: '/category/gaming-peripherals' },
  { name: 'Graphics Cards',  href: '/category/graphics-cards' },
  { name: 'Networking',      href: '/category/networking' },
  { name: 'Office Equipment',href: '/category/office-equipment' },
  { name: 'Accessories',     href: '/category/accessories' },
]

export default function Header() {
  const { user, signOut } = useAuth()
  const { getItemCount, toggleCart } = useCartStore()
  const { isMobileMenuOpen, setMobileMenu } = useUIStore()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery]     = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showSearch, setShowSearch]       = useState(false)
  const [showUserMenu, setShowUserMenu]   = useState(false)
  const [showMegaMenu, setShowMegaMenu]   = useState(false)

  const searchRef   = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const itemCount = getItemCount()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
        setSearchResults([])
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (q: string) => {
    setSearchQuery(q)
    if (q.length < 2) { setSearchResults([]); return }
    const { data } = await supabase
      .from('products')
      .select('id, name, price, main_image_url, slug')
      .ilike('name', `%${q}%`)
      .eq('is_active', true)
      .limit(5)
    setSearchResults((data as Product[]) || [])
    setShowSearch(true)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
    }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n)

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/50 border-b border-transparent dark:border-gray-800">
            <div className="bg-dark text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-primary-400" />
              Kirova Street, Kursk, Russia
            </span>
            <span className="hidden sm:flex items-center gap-1 text-primary-400">
              <Truck className="w-3 h-3" />
              Free shipping on orders over ₽5,000
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Support: 24/7</span>
            <span className="font-medium">₽ RUB</span>
          </div>
        </div>
      </div>

            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
                <Link to="/" className="flex-shrink-0">
          <div className="flex items-baseline gap-0.5">
            <span className="font-display text-2xl text-primary-500 tracking-wider">JD</span>
            <span className="font-display text-2xl text-dark tracking-wider">TECH</span>
            <span className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest self-center">STORES</span>
          </div>
        </Link>

                <div className="flex-1 max-w-xl mx-auto hidden md:block relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2.5 gap-2 focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 text-gray-900 dark:text-gray-100"
              />
            </div>
          </form>

          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-50">
              {searchResults.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => { setShowSearch(false); setSearchQuery('') }}
                >
                  <img src={p.main_image_url || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                  <div>
                    <p className="text-sm font-medium text-dark">{p.name}</p>
                    <p className="text-xs text-primary-500 font-semibold">{fmt(p.price)}</p>
                  </div>
                </Link>
              ))}
              <button
                onClick={handleSearchSubmit as any}
                className="w-full px-4 py-2.5 text-center text-sm text-primary-500 font-medium hover:bg-primary-50 transition-colors border-t border-gray-100"
              >
                See all results for "{searchQuery}"
              </button>
            </div>
          )}
        </div>

                <div className="flex items-center gap-1 ml-auto">
                    <Link to="/wishlist" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>

                    <button onClick={toggleCart} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

                    {!user && (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </div>
          )}

                    {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-primary-600" />
                  )}
                </div>
                <ChevronDown className="w-3 h-3 text-gray-500 hidden md:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-dark text-sm">{user.full_name || 'User'}</p>
                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                    <span className="mt-1 inline-block bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full capitalize">{user.role}</span>
                  </div>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                    <LayoutDashboard className="w-4 h-4" />Dashboard
                  </Link>
                  <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                    <Package className="w-4 h-4" />My Orders
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                    <Heart className="w-4 h-4" />Wishlist
                  </Link>
                  {(user.role === 'admin' || user.role === 'storekeeper') && (
                    <Link to={user.role === 'storekeeper' ? '/storekeeper' : '/admin'} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100" onClick={() => setShowUserMenu(false)}>
                      <Shield className="w-4 h-4 text-primary-500" />{user.role === 'storekeeper' ? 'Storekeeper Panel' : 'Admin Panel'}
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={() => { signOut(); setShowUserMenu(false) }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

                    <button onClick={() => setMobileMenu(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

            <div className="border-t border-gray-100 dark:border-gray-800 hidden md:block relative" onMouseLeave={() => setShowMegaMenu(false)}>
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-1">
            <button
              onMouseEnter={() => setShowMegaMenu(true)}
              className="flex items-center gap-1 px-4 py-3 text-sm font-semibold text-gray-700 hover:text-primary-500 transition-colors"
            >
              <Menu className="w-4 h-4" />
              All Categories
              <ChevronDown className="w-3 h-3" />
            </button>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={cat.href} className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors whitespace-nowrap">
                {cat.name}
              </Link>
            ))}
            <Link to="/about"   className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-primary-500 ml-auto">About</Link>
            <Link to="/contact" className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-primary-500">Contact</Link>
          </nav>
        </div>

        {showMegaMenu && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-100 dark:border-gray-800 z-50 p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-6 gap-4">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.name}
                  to={cat.href}
                  onClick={() => setShowMegaMenu(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-center group"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors text-xl">
                    {cat.name === 'Computers' ? '💻' : cat.name === 'Gaming' ? '🎮' : cat.name === 'Graphics Cards' ? '🖥️' : cat.name === 'Networking' ? '🌐' : cat.name === 'Office Equipment' ? '🖨️' : '🔌'}
                  </div>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

            {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="p-4">
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2.5 gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none text-dark"
                />
              </div>
            </form>
            <nav className="space-y-1">
              {CATEGORIES.map(cat => (
                <Link key={cat.name} to={cat.href} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenu(false)}>
                  {cat.name}
                </Link>
              ))}
              <hr className="my-2" />
              {!user ? (
                <div className="flex gap-2 pt-1">
                  <Link to="/login"    className="flex-1 text-center py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:border-primary-500" onClick={() => setMobileMenu(false)}>Sign In</Link>
                  <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600"              onClick={() => setMobileMenu(false)}>Register</Link>
                </div>
              ) : (
                <button onClick={() => { signOut(); setMobileMenu(false) }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600">
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
