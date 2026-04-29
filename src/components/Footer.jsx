import { Link } from 'react-router-dom'
import { Shield, Github, ExternalLink } from 'lucide-react'

const footerLinks = [
  {
    title: 'Portal',
    links: [
      { label: 'Was sind Deepfakes?', to: '/was-sind-deepfakes' },
      { label: 'Angriffsvektoren', to: '/angriffsvektoren' },
      { label: 'Awareness Portal', to: '/awareness-portal' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'Deepfake Scanner', to: '/deepfake-scanner' },
      { label: 'Schutzmaßnahmen', to: '/schutzmassnahmen' },
      { label: 'Template', to: '/template' },
    ],
  },
  {
    title: 'Ressourcen',
    links: [
      { label: 'Anthropic', href: 'https://anthropic.com', external: true },
      { label: 'MIT Media Lab', href: 'https://www.media.mit.edu', external: true },
      { label: 'BSI Bundesamt', href: 'https://www.bsi.bund.de', external: true },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-base">
                Deepfake<span className="text-red-400">Aware</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ein Awareness-Portal über Deepfakes & Voice Cloning — für Privatpersonen, Unternehmen und Organisationen.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {link.label}
                        <ExternalLink size={11} />
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} DeepfakeAware Portal — DHBW Projektarbeit. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-gray-600 text-center sm:text-right max-w-md">
            <strong className="text-gray-500">Disclaimer:</strong> Dieses Portal dient ausschließlich zu Aufklärungszwecken.
            Der Scanner nutzt KI-Analyse und ersetzt keine forensische Untersuchung.
          </p>
        </div>
      </div>
    </footer>
  )
}
