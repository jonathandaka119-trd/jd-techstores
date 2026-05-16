import { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

const faqs = [
  {
    category: 'Orders',
    items: [
      { q: 'How do I track my order?', a: 'Log into your account and visit the "My Orders" section in your dashboard. You\'ll see real-time status updates for all your orders.' },
      { q: 'Can I modify or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. Contact our support team immediately if you need changes.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, bank transfers, and YooKassa payment system. All payments are processed securely.' },
    ]
  },
  {
    category: 'Shipping',
    items: [
      { q: 'How much does shipping cost?', a: 'Shipping is FREE on all orders over ₽5,000. For orders below this amount, a flat rate of ₽299 applies.' },
      { q: 'How long does delivery take?', a: 'Standard delivery: 3-5 business days. Express: 1-2 business days. Same-day delivery available in Kursk for orders placed before 12:00 PM.' },
      { q: 'Do you ship outside Kursk?', a: 'Yes! We ship throughout Russia. Delivery times vary by region. Remote areas may take 7-14 business days.' },
    ]
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 30-day return policy for all products in original, unused condition with original packaging.' },
      { q: 'How do I initiate a return?', a: 'Go to your dashboard, find the order, and click "Return Item". Our team will process your request within 24 hours.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 3-5 business days after we receive the returned item. The amount will appear in your account within 7-10 days.' },
    ]
  },
  {
    category: 'Products',
    items: [
      { q: 'Are all products genuine/original?', a: 'Absolutely! We source directly from authorized distributors and manufacturers. Every product comes with official warranty.' },
      { q: 'Do products come with warranty?', a: 'Yes, all products include the manufacturer\'s warranty. Warranty periods vary by brand and product type.' },
      { q: 'Can I compare products before buying?', a: 'Yes! Use the product comparison feature on any category page to compare specifications side-by-side.' },
    ]
  },
  {
    category: 'Account',
    items: [
      { q: 'How do I create an account?', a: 'Click "Sign Up" in the top navigation. You can register with email/password or sign in with Google.' },
      { q: 'I forgot my password. What do I do?', a: 'Click "Forgot Password" on the login page and enter your email. We\'ll send you a reset link within minutes.' },
      { q: 'Can I save items for later?', a: 'Yes! Use the heart icon on any product to add it to your Wishlist. Access your wishlist from your account dashboard.' },
    ]
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  function toggle(key: string) {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const filtered = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="page-container py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Bebas Neue', cursive" }}>Frequently Asked Questions</h1>
        <p className="text-gray-600">Can't find what you're looking for? <a href="/contact" className="text-primary hover:underline">Contact our support team</a>.</p>
      </div>

            <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          className="input pl-12 text-base"
          placeholder="Search frequently asked questions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

            <div className="space-y-8">
        {filtered.map(cat => (
          <div key={cat.category}>
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">{cat.category}</h2>
            <div className="space-y-2">
              {cat.items.map(item => {
                const key = `${cat.category}-${item.q}`
                const isOpen = openItems.has(key)
                return (
                  <div key={key} className="card overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{item.q}</span>
                      {isOpen ? <ChevronUp size={18} className="text-primary shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                        <div className="pt-4">{item.a}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
