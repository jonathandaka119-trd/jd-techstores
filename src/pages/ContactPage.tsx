import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { toast } from '../components/ui'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setLoading(false)
  }

  const hours = [
    { day: 'Monday – Friday', time: '9:00 AM – 8:00 PM' },
    { day: 'Saturday', time: '10:00 AM – 6:00 PM' },
    { day: 'Sunday', time: '11:00 AM – 5:00 PM' },
  ]

  return (
    <div className="page-container py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Bebas Neue', cursive" }}>Contact Us</h1>
        <p className="text-gray-600 max-w-xl mx-auto">Have a question or need help? We're here for you 24/7.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
          <div className="card p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={56} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-600 mb-6">We'll respond to your inquiry within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="btn-primary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input className="input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select className="input" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select subject...</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea className="input min-h-[140px] resize-none" required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>

                <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={18} className="text-primary" /> Visit Us</h3>
            <p className="text-gray-600 text-sm">Kirova Street<br />Kursk, Russia, 305000</p>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Phone size={18} className="text-primary" /> Call Us</h3>
            <p className="text-gray-600 text-sm">+7 (4712) 123-456<br />+7 (900) 123-4567</p>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Mail size={18} className="text-primary" /> Email Us</h3>
            <p className="text-gray-600 text-sm">support@jdtechstores.ru<br />sales@jdtechstores.ru</p>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-primary" /> Business Hours</h3>
            <div className="space-y-2">
              {hours.map(h => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span className="text-gray-700">{h.day}</span>
                  <span className="text-gray-600">{h.time}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 text-xs text-primary font-medium">Live Chat: 24/7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
