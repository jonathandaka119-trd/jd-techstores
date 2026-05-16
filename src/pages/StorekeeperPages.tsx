import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product, Category } from '../lib/supabase'
import { toast, Spinner, Badge, OrderStatusBadge, Pagination } from '../components/ui'
import { LayoutDashboard, Package, Users, ShoppingBag, AlertTriangle, Plus, Edit2, X, LogOut, Tag, Search, Trash2 } from 'lucide-react'

function StorekeeperSidebar() {
  const loc = useLocation()
  const links = [
    { to: '/storekeeper', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/storekeeper/products', label: 'Products', icon: Package },
    { to: '/storekeeper/categories', label: 'Categories', icon: Tag },
    { to: '/storekeeper/inventory', label: 'Inventory', icon: Package },
    { to: '/storekeeper/suppliers', label: 'Suppliers', icon: Users },
    { to: '/storekeeper/orders', label: 'Orders', icon: ShoppingBag },
  ]
  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="text-white font-bold text-lg" style={{ fontFamily: "'Bebas Neue', cursive" }}>JD TechStores</Link>
        <div className="text-xs text-gray-400 mt-1">Storekeeper Panel</div>
      </div>
      <nav className="flex-1 py-4">
        {links.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? loc.pathname === to : loc.pathname.startsWith(to) && to !== '/storekeeper' || (exact && loc.pathname === to)
          return (
            <Link key={to} to={to} className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${active ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <Icon size={16} />{label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"><LogOut size={16} /> Back to Store</Link>
      </div>
    </aside>
  )
}

function StorekeeperOverview() {
  const [lowStock, setLowStock] = useState<any[]>([])
  const [stats, setStats] = useState({ totalProducts: 0, lowStockCount: 0, pendingOrders: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('products').select('id, name, stock_quantity').lt('stock_quantity', 10).eq('is_active', true).order('stock_quantity'),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]).then(([total, low, pending]) => {
      setLowStock(low.data || [])
      setStats({ totalProducts: total.count || 0, lowStockCount: low.data?.length || 0, pendingOrders: pending.count || 0 })
    })
  }, [])

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Storekeeper Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Total Products', value: stats.totalProducts, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Low Stock Items', value: stats.lowStockCount, color: 'text-orange-500', bg: 'bg-orange-50', alert: stats.lowStockCount > 0 },
          { label: 'Pending Orders', value: stats.pendingOrders, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(({ label, value, color, bg, alert }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className={`${bg} ${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              {alert ? <AlertTriangle size={22} /> : <Package size={22} />}
            </div>
            <div className={`text-2xl font-bold ${alert ? 'text-orange-600' : 'text-gray-900'}`}>{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h2 className="font-bold text-orange-800 mb-3 flex items-center gap-2"><AlertTriangle size={18} /> Low Stock Alerts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {lowStock.map((p: any) => (
              <div key={p.id} className="bg-white rounded-lg p-3 border border-orange-100">
                <div className="font-medium text-gray-900 text-sm truncate">{p.name}</div>
                <div className="text-orange-600 font-bold text-sm">{p.stock_quantity} left</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Inventory() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [newStock, setNewStock] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase.from('products').select('id, name, sku, stock_quantity, price, categories(name)').eq('is_active', true).order('name')
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  async function updateStock(id: string) {
    const qty = parseInt(newStock[id] || '0')
    if (isNaN(qty) || qty < 0) { toast.error('Invalid quantity'); return }
    setUpdating(id)
    const { error } = await supabase.from('products').update({ stock_quantity: qty }).eq('id', id)
    if (error) { toast.error('Failed to update'); setUpdating(null); return }
    toast.success('Stock updated!')
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_quantity: qty } : p))
    setNewStock(prev => { const n = { ...prev }; delete n[id]; return n })
    setUpdating(null)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventory Management</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="p-4 text-left font-medium text-gray-500">Product</th>
              <th className="p-4 text-left font-medium text-gray-500">SKU</th>
              <th className="p-4 text-left font-medium text-gray-500">Current Stock</th>
              <th className="p-4 text-left font-medium text-gray-500">Update Stock</th>
            </tr></thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.categories?.name}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-500">{p.sku || '—'}</td>
                  <td className="p-4">
                    <span className={`font-bold ${p.stock_quantity < 5 ? 'text-red-600' : p.stock_quantity < 20 ? 'text-orange-500' : 'text-green-600'}`}>
                      {p.stock_quantity}
                    </span>
                    {p.stock_quantity < 5 && <span className="ml-2 text-xs text-red-500">⚠ Low</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input type="number" min="0" placeholder={String(p.stock_quantity)} className="input w-24 text-sm"
                        value={newStock[p.id] || ''} onChange={e => setNewStock(prev => ({ ...prev, [p.id]: e.target.value }))} />
                      <button onClick={() => updateStock(p.id)} disabled={!newStock[p.id] || updating === p.id} className="btn-primary text-xs px-3 py-2 disabled:opacity-50">
                        {updating === p.id ? '...' : 'Update'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Suppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ company_name: '', contact_person: '', email: '', phone: '', address: '', terms: '', is_active: true })

  useEffect(() => { fetch() }, [])
  async function fetch() {
    const { data } = await supabase.from('suppliers').select('*').order('company_name')
    setSuppliers(data || [])
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editing
      ? await supabase.from('suppliers').update(form).eq('id', editing.id)
      : await supabase.from('suppliers').insert(form)
    if (error) { toast.error('Failed to save'); return }
    toast.success(editing ? 'Supplier updated!' : 'Supplier added!')
    setShowForm(false); setEditing(null)
    setForm({ company_name: '', contact_person: '', email: '', phone: '', address: '', terms: '', is_active: true })
    fetch()
  }

  async function del(id: string) {
    if (!confirm('Delete this supplier?')) return
    await supabase.from('suppliers').update({ is_active: false }).eq('id', id)
    toast.success('Supplier deactivated'); fetch()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers ({suppliers.length})</h1>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Supplier</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{editing ? 'Edit Supplier' : 'Add Supplier'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-sm font-medium text-gray-700 block mb-1">Company Name *</label><input className="input" required value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Contact Person</label><input className="input" value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Phone</label><input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div className="col-span-2"><label className="text-sm font-medium text-gray-700 block mb-1">Email</label><input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div className="col-span-2"><label className="text-sm font-medium text-gray-700 block mb-1">Address</label><input className="input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                <div className="col-span-2"><label className="text-sm font-medium text-gray-700 block mb-1">Terms</label><textarea className="input resize-none" value={form.terms} onChange={e => setForm(f => ({ ...f, terms: e.target.value }))} /></div>
              </div>
              <div className="flex gap-3 justify-end"><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Save</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className={`bg-white rounded-xl border p-5 ${s.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-gray-900">{s.company_name}</h3>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(s); setForm({ company_name: s.company_name, contact_person: s.contact_person || '', email: s.email || '', phone: s.phone || '', address: s.address || '', terms: s.terms || '', is_active: s.is_active }); setShowForm(true) }} className="text-blue-600 p-1 rounded hover:bg-blue-50"><Edit2 size={14} /></button>
                <button onClick={() => del(s.id)} className="text-red-500 p-1 rounded hover:bg-red-50"><X size={14} /></button>
              </div>
            </div>
            {s.contact_person && <div className="text-sm text-gray-600">👤 {s.contact_person}</div>}
            {s.email && <div className="text-sm text-gray-600">✉ {s.email}</div>}
            {s.phone && <div className="text-sm text-gray-600">📞 {s.phone}</div>}
            <Badge color={s.is_active ? 'green' : 'gray'} className="mt-2">{s.is_active ? 'Active' : 'Inactive'}</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

function StorekeeperProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', description: '', category_id: '', price: '', original_price: '', stock_quantity: '', sku: '', main_image_url: '' })
  const perPage = 15

  useEffect(() => { supabase.from('categories').select('*').then(({ data }) => setCategories(data || [])) }, [])
  useEffect(() => { fetchProducts() }, [page, search])

  async function fetchProducts() {
    setLoading(true)
    let q = supabase.from('products').select('*, categories(name)', { count: 'exact' })
    if (search) q = q.ilike('name', `%${search}%`)
    const { data, count } = await q.order('created_at', { ascending: false }).range((page - 1) * perPage, page * perPage - 1)
    setProducts(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  function startEdit(p: Product) {
    setEditing(p)
    setForm({ name: p.name, description: p.description || '', category_id: p.category_id || '', price: String(p.price), original_price: String(p.original_price || ''), stock_quantity: String(p.stock_quantity), sku: p.sku || '', main_image_url: p.main_image_url || '' })
    setShowForm(true)
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault()
    const payload = { name: form.name, description: form.description, category_id: form.category_id || null, price: parseFloat(form.price), original_price: form.original_price ? parseFloat(form.original_price) : null, stock_quantity: parseInt(form.stock_quantity), sku: form.sku || null, main_image_url: form.main_image_url || null }
    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert({ ...payload, is_active: true })
    if (error) { toast.error('Failed to save product'); return }
    toast.success(editing ? 'Product updated!' : 'Product created!')
    setShowForm(false); setEditing(null)
    setForm({ name: '', description: '', category_id: '', price: '', original_price: '', stock_quantity: '', sku: '', main_image_url: '' })
    fetchProducts()
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').update({ is_active: false }).eq('id', id)
    toast.success('Product deleted'); fetchProducts()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products ({total})</h1>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Product</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input className="input pl-10" placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={saveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-sm font-medium text-gray-700 block mb-1">Product Name *</label><input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                  <select className="input" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">No category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">SKU</label><input className="input" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. PRD-001" /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Price (₽) *</label><input className="input" type="number" required min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Original Price (₽)</label><input className="input" type="number" min="0" step="0.01" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Stock *</label><input className="input" type="number" required min="0" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Image URL</label><input className="input" value={form.main_image_url} onChange={e => setForm(f => ({ ...f, main_image_url: e.target.value }))} placeholder="https://..." /></div>
                <div className="col-span-2"><label className="text-sm font-medium text-gray-700 block mb-1">Description</label><textarea className="input min-h-[80px] resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="p-4 text-left font-medium text-gray-500">Product</th>
              <th className="p-4 text-left font-medium text-gray-500">Price</th>
              <th className="p-4 text-left font-medium text-gray-500">Stock</th>
              <th className="p-4 text-left font-medium text-gray-500">Status</th>
              <th className="p-4 text-left font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.main_image_url && <img src={p.main_image_url} alt="" className="w-10 h-10 object-cover rounded" />}
                      <div>
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">{(p as any).categories?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">₽{p.price.toLocaleString('ru-RU')}</td>
                  <td className="p-4"><span className={`font-medium ${p.stock_quantity < 5 ? 'text-red-600' : 'text-gray-900'}`}>{p.stock_quantity}</span></td>
                  <td className="p-4"><Badge color={p.is_active ? 'green' : 'red'}>{p.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(p)} className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"><Edit2 size={15} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4"><Pagination currentPage={page} totalPages={Math.ceil(total / perPage)} onPageChange={setPage} /></div>
    </div>
  )
}

function StorekeeperCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '' })

  useEffect(() => { fetchCategories() }, [])
  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
  }

  function slugify(str: string) { return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const payload = { name: form.name, slug: form.slug || slugify(form.name), description: form.description || null, image_url: form.image_url || null }
    const { error } = editing
      ? await supabase.from('categories').update(payload).eq('id', editing.id)
      : await supabase.from('categories').insert(payload)
    if (error) { toast.error('Failed to save'); return }
    toast.success(editing ? 'Category updated!' : 'Category created!')
    setShowForm(false); setEditing(null); setForm({ name: '', slug: '', description: '', image_url: '' })
    fetchCategories()
  }

  async function del(id: string) {
    if (!confirm('Delete this category?')) return
    await supabase.from('categories').delete().eq('id', id)
    toast.success('Deleted'); fetchCategories()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Category</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div><label className="text-sm font-medium text-gray-700 block mb-1">Name *</label><input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} /></div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1">Slug *</label><input className="input" required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} /></div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1">Description</label><textarea className="input resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1">Image URL</label><input className="input" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." /></div>
              <div className="flex gap-3 justify-end"><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Save</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            {cat.image_url && <img src={cat.image_url} alt="" className="w-12 h-12 object-cover rounded-lg" />}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{cat.name}</div>
              <div className="text-xs text-gray-500">/category/{cat.slug}</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(cat); setForm({ name: cat.name, slug: cat.slug || '', description: cat.description || '', image_url: cat.image_url || '' }); setShowForm(true) }} className="text-blue-600 p-1.5 rounded hover:bg-blue-50"><Edit2 size={14} /></button>
              <button onClick={() => del(cat.id)} className="text-red-500 p-1.5 rounded hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StorekeeperOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const perPage = 20

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  async function fetchOrders() {
    setLoading(true)
    let q = supabase.from('orders').select('*, profiles(full_name, email)', { count: 'exact' })
    if (statusFilter) q = q.eq('status', statusFilter)
    const { data, count } = await q.order('created_at', { ascending: false }).range((page - 1) * perPage, page * perPage - 1)
    setOrders(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) { toast.error('Failed to update'); return }
    toast.success('Status updated!')
    fetchOrders()
  }

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const fmt = (n: number) => `₽${n.toLocaleString('ru-RU')}`

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders ({total})</h1>
        <select className="input w-48" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="p-4 text-left font-medium text-gray-500">Order</th>
              <th className="p-4 text-left font-medium text-gray-500">Customer</th>
              <th className="p-4 text-left font-medium text-gray-500">Total</th>
              <th className="p-4 text-left font-medium text-gray-500">Status</th>
              <th className="p-4 text-left font-medium text-gray-500">Date</th>
              <th className="p-4 text-left font-medium text-gray-500">Update</th>
            </tr></thead>
            <tbody className="divide-y">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs">{order.order_number}</td>
                  <td className="p-4">
                    <div className="font-medium">{order.profiles?.full_name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{order.profiles?.email}</div>
                  </td>
                  <td className="p-4 font-medium">{fmt(order.total_amount)}</td>
                  <td className="p-4"><OrderStatusBadge status={order.status} /></td>
                  <td className="p-4 text-gray-500">{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                  <td className="p-4">
                    <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white" value={order.status} onChange={e => updateStatus(order.id, e.target.value)}>
                      {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4"><Pagination currentPage={page} totalPages={Math.ceil(total / perPage)} onPageChange={setPage} /></div>
    </div>
  )
}

export function StorekeeperDashboard() {
  return (
    <div className="flex">
      <StorekeeperSidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<StorekeeperOverview />} />
          <Route path="products" element={<StorekeeperProducts />} />
          <Route path="categories" element={<StorekeeperCategories />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<StorekeeperOrders />} />
          <Route path="*" element={<Navigate to="/storekeeper" replace />} />
        </Routes>
      </div>
    </div>
  )
}
