import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from './ui'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success('Thanks for subscribing!')
      setEmail('')
    }
  }

  return (
    <footer className="bg-dark text-gray-300 mt-20">
            <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-display text-2xl tracking-wide">STAY UPDATED</h3>
            <p className="text-primary-100 text-sm">Get the latest deals and tech news delivered to your inbox.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-sm">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white text-sm"
              required
            />
            <button type="submit" className="bg-white text-primary-500 font-bold px-4 py-2.5 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-1">
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </form>
        </div>
      </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
          <div className="flex items-baseline gap-0.5 mb-4">
            <span className="font-display text-2xl text-primary-400 tracking-wider">JD</span>
            <span className="font-display text-2xl text-white tracking-wider">TECH</span>
            <span className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-widest self-center">STORES</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Premium electronics and computer hardware for tech enthusiasts and professionals in Russia.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-400">Kirova Street, Kursk, Russia</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary-400" />
              <span className="text-gray-400">+7 (471) 200-3456</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-400" />
              <span className="text-gray-400">support@jdtechstores.ru</span>
            </div>
          </div>
        </div>

                <div>
          <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/products', 'All Products'], ['/about', 'About Us'], ['/contact', 'Contact'], ['/faq', 'FAQ']].map(([href, label]) => (
              <li key={href}>
                <Link to={href} className="text-gray-400 hover:text-primary-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

                <div>
          <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            {[['/shipping', 'Shipping Policy'], ['/returns', 'Returns & Refunds'], ['/privacy', 'Privacy Policy'], ['/terms', 'Terms & Conditions']].map(([href, label]) => (
              <li key={href}>
                <Link to={href} className="text-gray-400 hover:text-primary-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">24/7 Support</p>
            <p className="text-white font-semibold text-sm">Live Chat Available</p>
          </div>
        </div>

                <div>
          <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Follow Us</h4>
          <div className="flex gap-3 mb-6">
            {[
              { icon: <Facebook className="w-4 h-4" />, href: '#' },
              { icon: <Instagram className="w-4 h-4" />, href: '#' },
              { icon: <Twitter className="w-4 h-4" />, href: '#' },
              { icon: <Linkedin className="w-4 h-4" />, href: '#' },
            ].map((s, i) => (
              <a key={i} href={s.href} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors">
                {s.icon}
              </a>
            ))}
          </div>

          <h4 className="font-semibold text-white mb-3 uppercase tracking-wider text-sm">Business Hours</h4>
          <div className="space-y-1 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Mon – Fri</span><span className="text-white">9:00 – 20:00</span>
            </div>
            <div className="flex justify-between">
              <span>Sat – Sun</span><span className="text-white">10:00 – 18:00</span>
            </div>
          </div>
        </div>
      </div>

            <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-sm">© 2026 JD TechStores. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Secure payments • Free returns • 2-year warranty</p>
        </div>
      </div>
    </footer>
  )
}
