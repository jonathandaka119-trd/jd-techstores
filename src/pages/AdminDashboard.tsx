import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, BarChart2,
  Ticket, FileText, CreditCard, Plus, Trash2,
  TrendingUp, DollarSign, ShoppingCart, X, LogOut, Search, Package
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Order, Profile, Coupon } from '../lib/supabase'
import { toast, Spinner, Badge, OrderStatusBadge } from '../components/ui'

type BadgeVariant = 'red' | 'green' | 'yellow' | 'blue' | 'gray' | 'purple'

function AdminSidebar() {
  const loc = useLocation()
  const links = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/logs', label: 'Audit Logs', icon: FileText },
  ]

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="text-white font-bold text-lg" style={{ fontFamily: "'Bebas Neue', cursive" }}>
          JD TechStores
        </Link>
        <div className="text-xs text-gray-400 mt-1">Admin Panel</div>
      </div>
      <nav className="flex-1 py-4">
        {links.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? loc.pathname === to : loc.pathname.startsWith(to) && to !== '/admin'
            || (exact && loc.pathname === to)
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                active ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <LogOut size={16} /> Back to Store
        </Link>
      </div>
    </aside>
  )
}

function AdminOverview() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0, products: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('total_amount'),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    ]).then(([ordersData, ordersCount, customersCount, productsCount, recentData]) => {
      const revenue = (ordersData.data || []).reduce((sum: number, o: any) => sum + o.total_amount, 0)
      setStats({
        revenue,
        orders: ordersCount.count || 0,
        customers: customersCount.count || 0,
        products: productsCount.count || 0,
      })
      setRecentOrders(recentData.data || [])
      setLoading(false)
    })
  }, [])

  const fmt = (n: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n)

  const cards = [
    { icon: DollarSign, label: 'Total Revenue', value: fmt(stats.revenue), color: 'text-green-500', bg: 'bg-green-50' },
    { icon: ShoppingCart, label: 'Total Orders', value: stats.orders.toString(), color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Users, label: 'Customers', value: stats.customers.toString(), color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Package, label: 'Products', value: stats.products.toString(), color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className={`${bg} ${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <Icon size={22} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="pb-3 text-left text-gray-500 font-medium">Order #</th><th className="pb-3 text-left text-gray-500 font-medium">Amount</th><th className="pb-3 text-left text-gray-500 font-medium">Status</th><th className="pb-3 text-left text-gray-500 font-medium">Date</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td className="py-3 font-mono text-xs">{order.order_number}</td>
                  <td className="py-3">{fmt(order.total_amount)}</td>
                  <td className="py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    let q = supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    q.then(({ data }) => { setUsers(data || []); setLoading(false) })
  }, [search])

  async function updateRole(id: string, role: string) {
    await supabase.from('profiles').update({ role }).eq('id', id)
    toast.success('Role updated')
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: role as any } : u))
  }

  async function toggleActive(id: string, is_active: boolean) {
    await supabase.from('profiles').update({ is_active: !is_active }).eq('id', id)
    toast.success(is_active ? 'User deactivated' : 'User activated')
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !is_active } : u))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users ({users.length})</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input className="input pl-10" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="p-4 text-left font-medium text-gray-500">User</th>
              <th className="p-4 text-left font-medium text-gray-500">Role</th>
              <th className="p-4 text-left font-medium text-gray-500">Status</th>
              <th className="p-4 text-left font-medium text-gray-500">Joined</th>
              <th className="p-4 text-left font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{u.full_name || 'No name'}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white" value={u.role} onChange={e => updateRole(u.id, e.target.value)}>
                      <option value="user">User</option>
                      <option value="storekeeper">Storekeeper</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4"><Badge color={u.is_active ? 'green' : 'red'}>{u.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="p-4 text-gray-500">{new Date(u.created_at).toLocaleDateString('ru-RU')}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(u.id, u.is_active)} className={`text-xs px-2 py-1 rounded ${u.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
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

function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', discount_percentage: '', valid_from: '', valid_to: '', usage_limit: '', min_order_value: '' })

  useEffect(() => { supabase.from('coupons').select('*').order('created_at', { ascending: false }).then(({ data }) => setCoupons(data || [])) }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('coupons').insert({
      code: form.code.toUpperCase(), discount_percentage: parseFloat(form.discount_percentage),
      valid_from: form.valid_from || null, valid_to: form.valid_to || null,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
      min_order_value: form.min_order_value ? parseFloat(form.min_order_value) : 0,
    })
    if (error) { toast.error('Failed to create coupon'); return }
    toast.success('Coupon created!')
    setShowForm(false)
    supabase.from('coupons').select('*').order('created_at', { ascending: false }).then(({ data }) => setCoupons(data || []))
  }

  async function del(id: string) {
    if (!confirm('Delete this coupon?')) return
    await supabase.from('coupons').delete().eq('id', id)
    toast.success('Deleted')
    setCoupons(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupons ({coupons.length})</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Coupon</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Create Coupon</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div><label className="text-sm font-medium text-gray-700 block mb-1">Code *</label><input className="input uppercase" required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. SAVE20" /></div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1">Discount % *</label><input className="input" type="number" required min="1" max="100" value={form.discount_percentage} onChange={e => setForm(f => ({ ...f, discount_percentage: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Valid From</label><input className="input" type="date" value={form.valid_from} onChange={e => setForm(f => ({ ...f, valid_from: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Valid To</label><input className="input" type="date" value={form.valid_to} onChange={e => setForm(f => ({ ...f, valid_to: e.target.value }))} /></div>
              </div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1">Usage Limit</label><input className="input" type="number" min="1" value={form.usage_limit} onChange={e => setForm(f => ({ ...f, usage_limit: e.target.value }))} placeholder="Unlimited" /></div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1">Min Order Value (₽)</label><input className="input" type="number" min="0" value={form.min_order_value} onChange={e => setForm(f => ({ ...f, min_order_value: e.target.value }))} /></div>
              <div className="flex gap-3 justify-end"><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Create</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="p-4 text-left font-medium text-gray-500">Code</th>
            <th className="p-4 text-left font-medium text-gray-500">Discount</th>
            <th className="p-4 text-left font-medium text-gray-500">Usage</th>
            <th className="p-4 text-left font-medium text-gray-500">Valid Until</th>
            <th className="p-4 text-left font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody className="divide-y">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono font-bold text-primary">{c.code}</td>
                <td className="p-4">{c.discount_percentage}%</td>
                <td className="p-4 text-gray-600">{c.used_count}/{c.usage_limit ?? '∞'}</td>
                <td className="p-4 text-gray-500">{c.valid_to ? new Date(c.valid_to).toLocaleDateString('ru-RU') : 'No limit'}</td>
                <td className="p-4"><button onClick={() => del(c.id)} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminAnalytics() {
  const [statsLoading, setStatsLoading] = useState(true)
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})

  const [fromDate, setFromDate] = useState(() =>
    new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10))
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [reportType, setReportType] = useState<'sales' | 'orders' | 'products'>('sales')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    supabase.from('orders').select('status, total_amount').then(({ data }) => {
      const counts: Record<string, number> = {}
      data?.forEach((o: any) => { counts[o.status] = (counts[o.status] || 0) + 1 })
      setStatusCounts(counts)
      setStatsLoading(false)
    })
  }, [])

  const fmt = (n: number) => `₽${(n || 0).toLocaleString('ru-RU')}`
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0)

  const downloadCSV = (filename: string, rows: string[][]) => {
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const generateReport = async () => {
    setGenerating(true)
    const from = `${fromDate}T00:00:00`
    const to   = `${toDate}T23:59:59`

    try {
      if (reportType === 'sales' || reportType === 'orders') {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*, order_items(quantity, unit_price, product_id)')
          .gte('created_at', from).lte('created_at', to)
          .order('created_at', { ascending: false })

        if (error) throw error
        if (!orders?.length) { toast.error('No orders found in selected period'); setGenerating(false); return }

        if (reportType === 'sales') {
          const totalRev = orders.reduce((s, o) => s + o.total_amount, 0)
          const totalTax = orders.reduce((s, o) => s + (o.tax_amount || 0), 0)

          const rows = [
            ['JD TechStores — Sales Report'],
            [`Period: ${fromDate}  to  ${toDate}`],
            [`Generated: ${new Date().toLocaleString('ru-RU')}`],
            [],
            ['Summary'],
            ['Total Orders', String(orders.length)],
            ['Total Revenue', fmt(totalRev)],
            ['Total Tax Collected', fmt(totalTax)],
            ['Average Order Value', fmt(totalRev / orders.length)],
            [],
            ['Order Number', 'Date', 'Status', 'Subtotal (₽)', 'Tax (₽)', 'Shipping (₽)', 'Discount (₽)', 'Total (₽)', 'Payment Method'],
            ...orders.map(o => [
              o.order_number,
              new Date(o.created_at).toLocaleDateString('ru-RU'),
              o.status,
              String(o.total_amount - (o.tax_amount || 0) - (o.shipping_cost || 0) + (o.discount_amount || 0)),
              String(o.tax_amount || 0),
              String(o.shipping_cost || 0),
              String(o.discount_amount || 0),
              String(o.total_amount),
              o.payment_method,
            ])
          ]
          downloadCSV(`JD_Sales_${fromDate}_${toDate}.csv`, rows)

        } else {
          const rows = [
            ['Order Number', 'Date', 'Status', 'Items', 'Total (₽)', 'Shipping (₽)', 'Payment'],
            ...orders.map(o => [
              o.order_number,
              new Date(o.created_at).toLocaleDateString('ru-RU'),
              o.status,
              String((o.order_items as any[])?.reduce((s: number, i: any) => s + i.quantity, 0) || 0),
              String(o.total_amount),
              String(o.shipping_cost || 0),
              o.payment_method,
            ])
          ]
          downloadCSV(`JD_Orders_${fromDate}_${toDate}.csv`, rows)
        }
        toast.success(`Report downloaded — ${orders.length} orders`)

      } else {
        const { data: items, error } = await supabase
          .from('order_items')
          .select('product_id, quantity, unit_price, orders(created_at, status), products(name, sku)')
          .gte('orders.created_at', from).lte('orders.created_at', to)

        if (error) throw error
        if (!items?.length) { toast.error('No order items found'); setGenerating(false); return }

        const productMap: Record<string, { name: string; sku: string; qty: number; revenue: number }> = {}
        items.forEach((item: any) => {
          const id  = item.product_id
          const key = id
          if (!productMap[key]) productMap[key] = { name: item.products?.name || id, sku: item.products?.sku || '', qty: 0, revenue: 0 }
          productMap[key].qty     += item.quantity
          productMap[key].revenue += item.quantity * item.unit_price
        })

        const sorted = Object.values(productMap).sort((a, b) => b.revenue - a.revenue)
        const rows = [
          ['Product Name', 'SKU', 'Units Sold', 'Revenue (₽)'],
          ...sorted.map(p => [p.name, p.sku, String(p.qty), String(p.revenue)])
        ]
        downloadCSV(`JD_Products_${fromDate}_${toDate}.csv`, rows)
        toast.success(`Report downloaded — ${sorted.length} products`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Report generation failed')
    }
    setGenerating(false)
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Generate Report</h2>
            <p className="text-sm text-gray-500 mt-0.5">Download a CSV report for any date range</p>
          </div>
          <TrendingUp size={20} className="text-primary-500" />
        </div>
        <div className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Report Type</label>
              <select className="input" value={reportType} onChange={e => setReportType(e.target.value as any)}>
                <option value="sales">Sales Summary</option>
                <option value="orders">Order List</option>
                <option value="products">Product Performance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">From Date</label>
              <input type="date" className="input" value={fromDate} onChange={e => setFromDate(e.target.value)} max={toDate} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">To Date</label>
              <input type="date" className="input" value={toDate} onChange={e => setToDate(e.target.value)} min={fromDate} />
            </div>
            <button
              onClick={generateReport}
              disabled={generating}
              className="flex items-center justify-center gap-2 py-2.5 px-5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold text-sm rounded-md transition-colors"
            >
              {generating
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                : <><FileText size={15} />Download Report</>
              }
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              ['Last 7 days',  7],
              ['Last 30 days', 30],
              ['Last 90 days', 90],
              ['This year',    365],
            ].map(([label, days]) => (
              <button
                key={label}
                onClick={() => {
                  setFromDate(new Date(Date.now() - Number(days) * 86_400_000).toISOString().slice(0, 10))
                  setToDate(new Date().toISOString().slice(0, 10))
                }}
                className="text-xs px-3 py-1.5 border border-gray-200 rounded hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-5">Orders by Status</h2>
        {statsLoading ? <Spinner /> : (
          <div className="space-y-4">
            {statuses.map(s => {
              const count = statusCounts[s] || 0
              const pct   = total > 0 ? Math.round((count / total) * 100) : 0
              const colors: Record<string, string> = {
                pending: 'bg-yellow-400', processing: 'bg-blue-400',
                shipped: 'bg-purple-400', delivered: 'bg-green-500', cancelled: 'bg-red-400'
              }
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="capitalize font-medium text-gray-700">{s}</span>
                    <span className="text-gray-500">{count} orders · {pct}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-sm h-2">
                    <div className={`${colors[s]} h-2 rounded-sm transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('payments').select('*, orders(order_number, user_id, profiles(full_name))').order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { setPayments(data || []); setLoading(false) })
  }, [])

  const fmt = (n: number) => `₽${n.toLocaleString('ru-RU')}`
  const statusColors: Record<string, BadgeVariant> = { pending: 'yellow', completed: 'green', failed: 'red', refunded: 'blue' }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="p-4 text-left font-medium text-gray-500">Order</th>
              <th className="p-4 text-left font-medium text-gray-500">Customer</th>
              <th className="p-4 text-left font-medium text-gray-500">Amount</th>
              <th className="p-4 text-left font-medium text-gray-500">Method</th>
              <th className="p-4 text-left font-medium text-gray-500">Status</th>
              <th className="p-4 text-left font-medium text-gray-500">Date</th>
            </tr></thead>
            <tbody className="divide-y">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs">{p.orders?.order_number}</td>
                  <td className="p-4">{p.orders?.profiles?.full_name || '—'}</td>
                  <td className="p-4 font-medium">{fmt(p.amount)}</td>
                  <td className="p-4 text-gray-600 capitalize">{p.payment_method}</td>
                  <td className="p-4"><Badge color={statusColors[p.status] || 'gray'}>{p.status}</Badge></td>
                  <td className="p-4 text-gray-500">{new Date(p.created_at).toLocaleDateString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('audit_logs').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => { setLogs(data || []); setLoading(false) })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Logs</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="p-4 text-left font-medium text-gray-500">User</th>
              <th className="p-4 text-left font-medium text-gray-500">Action</th>
              <th className="p-4 text-left font-medium text-gray-500">Resource</th>
              <th className="p-4 text-left font-medium text-gray-500">Time</th>
            </tr></thead>
            <tbody className="divide-y">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-4 text-xs text-gray-600">{log.profiles?.full_name || log.profiles?.email || 'System'}</td>
                  <td className="p-4"><Badge color="blue">{log.action}</Badge></td>
                  <td className="p-4 text-gray-600">{log.resource_type} {log.resource_id ? `#${log.resource_id.slice(0, 8)}` : ''}</td>
                  <td className="p-4 text-gray-500 text-xs">{new Date(log.created_at).toLocaleString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  )
}
