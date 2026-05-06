import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-black text-neutral-400 pt-14 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-neutral-800">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-extrabold text-white">WebShop</span>
            <p className="text-sm leading-relaxed">
              Vaš pouzdani online prodavac. Brza dostava, sigurno plaćanje i vrhunski proizvodi.
            </p>
            <div className="flex items-center gap-4 mt-1">
              <a href="#" className="hover:text-white transition-colors"><FiInstagram size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><FiFacebook size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><FiTwitter size={18} /></a>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-1">Navigacija</h4>
            {[
              { label: 'Početna', to: '/' },
              { label: 'Korpa', to: '/cart' },
              { label: 'Lista želja', to: '/wishlist' },
              { label: 'Profil', to: '/profile' },
              { label: 'Prijavi se', to: '/auth' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-1">Informacije</h4>
            {[
              'Uslovi korišćenja',
              'Politika privatnosti',
              'Povrat robe',
              'Načini plaćanja',
              'Česta pitanja',
            ].map(item => (
              <span key={item} className="text-sm hover:text-white transition-colors cursor-pointer">
                {item}
              </span>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-1">Kontakt</h4>
            <div className="flex items-center gap-3 text-sm">
              <FiMail size={15} className="shrink-0" />
              <span>podrska@webshop.rs</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiPhone size={15} className="shrink-0" />
              <span>+381 11 123 4567</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <FiMapPin size={15} className="shrink-0 mt-0.5" />
              <span>Knez Mihailova 10, 11000 Beograd</span>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neutral-600">
          <span>© {new Date().getFullYear()} WebShop. Sva prava zadržana.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Visa</span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Mastercard</span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
