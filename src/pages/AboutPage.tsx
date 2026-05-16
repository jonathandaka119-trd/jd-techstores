import { Link } from 'react-router-dom'
import { Shield, Truck, Headphones, Award, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function AboutPage() {
  const team = [
    { name: 'Jonathan Daka', role: 'Founder & CEO', bio: 'Passionate about making premium tech accessible to everyone.' },
    { name: 'Alex Petrov', role: 'Head of Operations', bio: 'Ensures every order reaches you perfectly.' },
    { name: 'Maria Sidorova', role: 'Customer Success', bio: '24/7 support specialist dedicated to your satisfaction.' },
    { name: 'Dmitry Volkov', role: 'Technical Expert', bio: 'Our in-house tech guru for product guidance.' },
  ]

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '5,000+', label: 'Products Available' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Customer Support' },
  ]

  return (
    <div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="page-container text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', cursive" }}>About JD TechStores</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Kursk's premier destination for premium electronics, computer hardware, and gaming peripherals.
          </p>
        </div>
      </div>

            <div className="bg-primary py-12">
        <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-4xl font-bold" style={{ fontFamily: "'Bebas Neue', cursive" }}>{s.value}</div>
              <div className="text-pink-100 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

            <div className="page-container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Founded in Kursk, Russia, JD TechStores was born from a simple belief: everyone deserves access to high-quality technology at fair prices. We curate the best computer hardware, gaming peripherals, and office equipment from trusted brands worldwide.
            </p>
            <p className="text-gray-600 mb-6">
              Our team of tech enthusiasts is passionate about helping you find the perfect products for your needs—whether you're building your dream gaming rig, upgrading your home office, or equipping your business.
            </p>
            <Link to="/products" className="btn-primary">Explore Our Products</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, title: 'Secure Shopping', desc: 'Your data and payments are always protected.' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over ₽5,000.' },
              { icon: Headphones, title: '24/7 Support', desc: 'Expert help whenever you need it.' },
              { icon: Award, title: 'Quality Guaranteed', desc: 'Only genuine, quality-verified products.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <Icon className="text-primary mb-3" size={28} />
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

            <div className="bg-gray-50 py-16">
        <div className="page-container">
          <h2 className="section-title text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="card p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.name[0]}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

            <div className="page-container py-16">
        <h2 className="section-title text-center mb-12">Find Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: MapPin, title: 'Address', lines: ['Kirova Street', 'Kursk, Russia, 305000'] },
            { icon: Phone, title: 'Phone', lines: ['+7 (4712) 123-456', '+7 (900) 123-4567'] },
            { icon: Mail, title: 'Email', lines: ['support@jdtechstores.ru', 'sales@jdtechstores.ru'] },
          ].map(({ icon: Icon, title, lines }) => (
            <div key={title} className="card p-6 text-center">
              <Icon className="text-primary mx-auto mb-3" size={28} />
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              {lines.map(l => <p key={l} className="text-gray-600 text-sm">{l}</p>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
