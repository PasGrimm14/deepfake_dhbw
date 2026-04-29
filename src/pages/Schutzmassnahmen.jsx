import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Building2, Globe, CheckSquare, Square, ExternalLink,
  Share2, Twitter, Linkedin, Mail, ArrowRight, Shield, Lock, Eye
} from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionDivider from '../components/SectionDivider'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

const tabs = [
  { id: 'privat', label: 'Für Privatpersonen', icon: User },
  { id: 'unternehmen', label: 'Für Unternehmen', icon: Building2 },
  { id: 'org', label: 'Für Organisationen', icon: Globe },
]

const measures = {
  privat: [
    {
      category: 'Digitale Hygiene',
      items: [
        'Profilbilder auf sozialen Medien auf "nur Freunde" einschränken',
        'Menge der öffentlich verfügbaren Fotos und Videos minimieren',
        'Gesichtserkennungs-Features bei Apps deaktivieren',
        'Wasserzeichen auf öffentlich geteilten Bildern verwenden',
      ],
    },
    {
      category: 'Verhaltensregeln',
      items: [
        'Unerwartete Geldforderungen per Video oder Anruf nie ohne Rückruf bestätigen',
        'Vereinbarte "Codewörter" mit engen Familienmitgliedern für Notfälle einrichten',
        'Verdächtige Deepfake-Inhalte bei Plattformen und Behörden melden',
        'Quellen von Videonachrichten immer kritisch prüfen',
      ],
    },
    {
      category: 'Technische Tools',
      items: [
        'AI-Bild-Detektoren (z.B. Hive Moderation, Illuminarty) für verdächtige Bilder nutzen',
        'Reverse Image Search (Google, TinEye) bei verdächtigen Bildern durchführen',
        'Nachrichten-Authentizitäts-Tools wie InVID nutzen',
        'Zwei-Faktor-Authentifizierung für alle wichtigen Konten aktivieren',
      ],
    },
  ],
  unternehmen: [
    {
      category: 'Prozesse & Richtlinien',
      items: [
        'Call-Back-Policy: Zahlungsanweisungen über einen zweiten, verifizierten Kanal bestätigen',
        'Vier-Augen-Prinzip für alle Zahlungen über einen definierten Schwellenwert',
        'Klare Eskalationspfade bei verdächtigen Video-Calls oder Audioanrufen',
        'Regelmäßige Security Awareness Trainings mit Deepfake-Fokus',
      ],
    },
    {
      category: 'Technische Maßnahmen',
      items: [
        'Deepfake-Detection-APIs in Video-Conferencing-Infrastruktur integrieren',
        'KI-gestützte Monitoring-Lösungen für Videokonferenzen einsetzen',
        'Digitale Zertifikate und Signaturen für offizielle Kommunikation verwenden',
        'Mitarbeitende auf verdächtige Merkmale in Video-Calls schulen',
      ],
    },
    {
      category: 'Governance',
      items: [
        'Incident-Response-Plan für Deepfake-Vorfälle erstellen',
        'Regelmäßige Penetration Tests mit Deepfake-Szenarien durchführen',
        'Lieferanten und Partner über Deepfake-Risiken informieren',
        'Versicherungsschutz für Social-Engineering-Schäden prüfen',
      ],
    },
  ],
  org: [
    {
      category: 'Prävention',
      items: [
        'Medienkompetenz-Programme in Schulen und Weiterbildungseinrichtungen ausbauen',
        'Deepfake-Erkennungstools für Journalisten und Factchecker bereitstellen',
        'Öffentliches Bewusstsein für Deepfakes in Wahlkampfzeiten schärfen',
        'Forschungskooperationen mit Universitäten und Labs aufbauen',
      ],
    },
    {
      category: 'Regulierung & Recht',
      items: [
        'Kennzeichnungspflicht für KI-generierte Medien im öffentlichen Diskurs',
        'Stärkung der Strafverfolgung bei non-konsensuellem synthetischen Material',
        'EU AI Act Vorgaben zu Deepfake-Kennzeichnung (Art. 52) umsetzen',
        'Meldesysteme für Deepfake-Missbrauch bei Behörden einrichten',
      ],
    },
    {
      category: 'Technische Standards',
      items: [
        'Content Credentials / C2PA-Standard in Medienplattformen fördern',
        'Watermarking-Standards für KI-generierte Inhalte vorantreiben',
        'Interoperabilität von Deepfake-Detection-Tools fördern',
        'Offene Benchmark-Datensätze für Forscher bereitstellen',
      ],
    },
  ],
}

const tools = [
  { name: 'Hive Moderation', desc: 'KI-gestützte Bild- und Video-Authentizitätsprüfung', category: 'Detection', href: '#' },
  { name: 'Microsoft Video Authenticator', desc: 'Echtzeit-Deepfake-Analyse für Videos', category: 'Detection', href: '#' },
  { name: 'Reality Defender', desc: 'Enterprise-Lösung für Deepfake-Erkennung in Echtzeit', category: 'Enterprise', href: '#' },
  { name: 'Content Credentials (C2PA)', desc: 'Offener Standard für Medien-Provenance', category: 'Standard', href: '#' },
  { name: 'InVID / WeVerify', desc: 'Video-Faktencheck-Tool für Journalisten', category: 'Journalismus', href: '#' },
  { name: 'TrueMedia.org', desc: 'Non-profit Deepfake-Analyse für politische Inhalte', category: 'Non-Profit', href: '#' },
]

const takeaways = [
  'Deepfakes sind keine Zukunftstechnologie — sie werden heute täglich für Betrug und Desinformation eingesetzt.',
  'Voice Cloning benötigt nur Sekunden Audiomaterial und ist für jeden kostenlos zugänglich.',
  'CEO Fraud via Deepfake hat bereits Millionenschäden verursacht — klare Unternehmensprozesse sind entscheidend.',
  '96% aller Deepfake-Videos sind non-konsensuelles Material — die gesellschaftliche Dimension ist enorm.',
  'Kritisches Denken und Medienkompetenz sind die wichtigsten Schutzfaktoren überhaupt.',
  'KI-Gesetzgebung (EU AI Act) und technische Standards (C2PA) schaffen allmählich Gegenmaßnahmen.',
]

function ChecklistSection({ categoryData }) {
  const [checked, setChecked] = useState({})

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`
    setChecked((c) => ({ ...c, [key]: !c[key] }))
  }

  const total = categoryData.reduce((acc, cat) => acc + cat.items.length, 0)
  const done = Object.values(checked).filter(Boolean).length

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-medium text-gray-600">{done} / {total} Maßnahmen umgesetzt</p>
        <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(done / total) * 100}%` }}
            className="h-full bg-red-600 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-6">
        {categoryData.map((cat, catIdx) => (
          <div key={cat.category}>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              {cat.category}
            </h4>
            <div className="space-y-2">
              {cat.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`
                const isChecked = !!checked[key]
                return (
                  <button
                    key={itemIdx}
                    onClick={() => toggle(catIdx, itemIdx)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-150 border ${
                      isChecked
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Square size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${isChecked ? 'text-green-800 line-through opacity-60' : 'text-gray-700'}`}>
                      {item}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Schutzmassnahmen() {
  const [activeTab, setActiveTab] = useState('privat')

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHero
        badge="Schutzmaßnahmen"
        title="Schutzmaßnahmen & Fazit"
        subtitle="Konkrete Checklisten und Handlungsempfehlungen für Privatpersonen, Unternehmen und Organisationen."
      />

      {/* ── TABS + CHECKLISTS ─────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab buttons */}
          <div className="flex flex-col sm:flex-row gap-2 bg-white border border-gray-200 rounded-xl p-1.5 mb-8 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="card"
          >
            <ChecklistSection categoryData={measures[activeTab]} />
          </motion.div>
        </div>
      </section>

      <SectionDivider label="Tools" />

      {/* ── TOOL RECOMMENDATIONS ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-3">Empfohlene Tools</h2>
          <p className="section-subtitle text-center max-w-xl mx-auto mb-10">
            Ausgewählte Lösungen für Deepfake-Erkennung und Medienauthentizität.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card group hover:border-red-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 transition-colors">
                    <Shield size={18} className="text-gray-500 group-hover:text-red-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{tool.name}</h3>
                    <span className="text-xs text-gray-400">{tool.category}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{tool.desc}</p>
                <a
                  href={tool.href}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Tool besuchen
                  <ExternalLink size={11} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider label="Fazit" />

      {/* ── CONCLUSION ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Fazit & Key Takeaways</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Die wichtigsten Erkenntnisse aus diesem Portal auf einen Blick.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8"
          >
            <ul className="space-y-4">
              {takeaways.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3.5 text-white"
                >
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">{item}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* 3 principles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Eye, title: 'Erkennen', desc: 'Visuelle und auditive Artefakte aufmerksam wahrnehmen und hinterfragen.' },
              { icon: Shield, title: 'Schützen', desc: 'Prozesse, Tools und Richtlinien aktiv implementieren.' },
              { icon: Lock, title: 'Handeln', desc: 'Vorfälle melden, Standards fördern, Bewusstsein schärfen.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card text-center"
              >
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon size={22} className="text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Share CTA */}
          <div className="card bg-red-50 border-red-200 text-center">
            <Share2 size={24} className="text-red-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Teile dieses Portal</h3>
            <p className="text-sm text-gray-600 mb-5">
              Hilf anderen, die Risiken von Deepfakes zu verstehen — teile das Portal in deinem Netzwerk.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.origin)}
                className="btn-primary text-sm py-2"
              >
                <Share2 size={14} />
                Link kopieren
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=Deepfakes+%26+Voice+Cloning+verstehen+und+erkennen+%E2%80%94+Awareness-Portal&url=${encodeURIComponent(window.location.origin)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2"
              >
                <Twitter size={14} />
                Twitter / X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
              <a
                href={`mailto:?subject=Deepfake Awareness Portal&body=Schau dir dieses Aufklärungsportal zu Deepfakes an: ${window.location.origin}`}
                className="btn-secondary text-sm py-2"
              >
                <Mail size={14} />
                E-Mail
              </a>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
