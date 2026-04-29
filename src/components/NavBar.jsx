import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Shield, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/was-sind-deepfakes', label: 'Was sind Deepfakes?' },
  { to: '/angriffsvektoren', label: 'Angriffsvektoren' },
  { to: '/awareness-portal', label: 'Awareness Portal' },
  { to: '/deepfake-scanner', label: 'Scanner' },
  { to: '/schutzmassnahmen', label: 'Schutzmaßnahmen' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150 ${
      isActive
        ? 'text-red-600 bg-red-50'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-700 transition-colors">
              <Shield className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-bold text-gray-900 text-base leading-tight">
              Deepfake<span className="text-red-600">Aware</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <NavLink
              to="/deepfake-scanner"
              className="btn-primary text-sm py-2 px-4"
            >
              <Shield size={15} />
              Scanner starten
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Navigation öffnen"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2 pb-1">
                <NavLink
                  to="/deepfake-scanner"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center text-sm"
                >
                  <Shield size={15} />
                  Scanner starten
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
