import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, Heart, MapPin, Settings, LogOut, Edit2, Loader2, ShoppingBag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { OrderStatusBadge, EmptyState, toast, Spinner } from '../components/ui'
import type { Order, WishlistItem } from '../lib/supabase'

export default function DashboardPage() {
  const { user, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>('profile')
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)

  const [fullName, setFullName] = useState(user?.full_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (tab === 'orders') fetchOrders()
    if (tab === 'wishlist') fetchWishlist()
  }, [tab, user])

  const fetchOrders = async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setOrders((data as Order[]) || [])
    setLoading(false)
  }

  const fetchWishlist = async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('wishlist')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setWishlist((data as WishlistItem[]) || [])
    setLoading(false)
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    const { error } = await updateProfile({ full_name: fullName, phone })
    if (error) toast.error('Failed to update profile')
    else toast.success('Profile updated!')
    setSavingProfile(false)
  }

  const fmt = (n: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n)

  const TABS = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-display text-4xl tracking-wide mb-8">MY ACCOUNT</h1>

        <div className="grid lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit">
                        <div className="text-center mb-5 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2 text-primary-600 text-2xl font-bold">
                {user.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <p className="font-bold text-dark">{user.full_name || 'User'}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <span className="mt-1 inline-block bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full capitalize">
                {user.role}
              </span>
            </div>

            <nav className="space-y-1">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {t.icon}{t.label}
                </button>
              ))}

              <hr className="my-2" />

              {(user.role === 'admin' || user.role === 'storekeeper') && (
                <Link to={user.role === 'admin' ? '/admin' : '/storekeeper'} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors">
                  <Settings className="w-4 h-4" />{user.role === 'admin' ? 'Admin Panel' : 'Storekeeper Panel'}
                </Link>
              )}

              <button
                onClick={() => { signOut(); navigate('/') }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />Sign Out
              </button>
            </nav>
          </div>

                    <div className="lg:col-span-3">
                        {tab === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-dark text-lg mb-5 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-primary-500" />Edit Profile
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="+7 (999) 000-0000" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" value={user.email} disabled className="input bg-gray-50 cursor-not-allowed text-gray-500" />
                  </div>
                </div>
                <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-primary flex items-center gap-2">
                  {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            )}

                        {tab === 'orders' && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-dark text-lg">Order History</h2>
                </div>
                {loading ? (
                  <div className="flex justify-center py-12"><Spinner /></div>
                ) : orders.length === 0 ? (
                  <EmptyState
                    icon={<ShoppingBag className="w-8 h-8" />}
                    title="No orders yet"
                    description="When you place orders, they'll appear here."
                    action={<Link to="/products" className="btn-primary text-sm py-2.5">Start Shopping</Link>}
                  />
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <div key={order.id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-mono font-bold text-dark text-sm">{order.order_number}</p>
                            <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm text-gray-600">{(order as any).order_items?.length || 0} items</p>
                          <p className="font-bold text-dark">{fmt(order.total_amount)}</p>
                        </div>
                        {(order as any).estimated_delivery && (
                          <p className="text-xs text-gray-500 mt-1">
                            Est. delivery: {new Date((order as any).estimated_delivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

                        {tab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-dark text-lg">My Wishlist</h2>
                </div>
                {loading ? (
                  <div className="flex justify-center py-12"><Spinner /></div>
                ) : wishlist.length === 0 ? (
                  <EmptyState
                    icon={<Heart className="w-8 h-8" />}
                    title="Your wishlist is empty"
                    description="Save products you love by clicking the heart icon."
                    action={<Link to="/products" className="btn-primary text-sm py-2.5">Explore Products</Link>}
                  />
                ) : (
                  <div className="divide-y divide-gray-100">
                    {wishlist.map(item => (
                      <div key={item.id} className="p-5 flex gap-4 items-center">
                        <img
                          src={(item.product as any)?.main_image_url || ''}
                          alt=""
                          className="w-16 h-16 object-cover rounded-xl bg-gray-50"
                        />
                        <div className="flex-1">
                          <Link to={`/product/${(item.product as any)?.slug}`} className="font-semibold text-dark hover:text-primary-500 transition-colors text-sm">
                            {(item.product as any)?.name}
                          </Link>
                          <p className="text-primary-500 font-bold text-sm mt-1">
                            {fmt((item.product as any)?.price || 0)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/product/${(item.product as any)?.slug}`} className="btn-primary py-2 px-3 text-xs">
                            View
                          </Link>
                          <button
                            onClick={async () => {
                              await supabase.from('wishlist').delete().eq('id', item.id)
                              setWishlist(w => w.filter(i => i.id !== item.id))
                              toast.info('Removed from wishlist')
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

                        {tab === 'addresses' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-dark text-lg mb-5">Saved Addresses</h2>
                <p className="text-gray-500 text-sm">Manage your saved shipping addresses here.</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
                  <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No saved addresses yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Your addresses will be saved during checkout.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
