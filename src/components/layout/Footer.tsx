import { Link } from 'react-router-dom'
import { Cpu, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success('Subscribed! Check your inbox.')
      setEmail('')
    }
  }

  return (
    <footer className="bg-dark-800 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display text-2xl text-white tracking-wider">JD</span>
                <span className="font-display text-2xl text-primary-500 tracking-wider">TECH</span>
                <div className="text-[9px] text-gray-400 leading-none -mt-1 tracking-widest">STORES</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xs">
              Your premier destination for high-end computer hardware, gaming peripherals, and office equipment in Kursk, Russia.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />Kirova Street, Kursk, Russia</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />+7 (471) 000-00-00</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />support@jdtechstores.ru</div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

                    <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2">
              {[['Home', '/'], ['Products', '/products'], ['About Us', '/about'], ['Contact', '/contact'], ['FAQ', '/faq']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-gray-400 hover:text-primary-500 text-sm transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

                    <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Support</h4>
            <ul className="space-y-2">
              {[['Shipping Policy', '/shipping'], ['Returns', '/returns'], ['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms'], ['Warranty', '/warranty']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-gray-400 hover:text-primary-500 text-sm transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

                    <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Get exclusive deals and tech news delivered to your inbox.</p>
            <form onSubmit={handleNewsletter}>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field text-sm py-2.5"
                  required
                />
                <button type="submit" className="btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© 2026 JD TechStores. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <span>🇷🇺 Kursk, Russia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
