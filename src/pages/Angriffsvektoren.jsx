import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ComposableMap, Geographies, Geography, Marker, ZoomableGroup
} from 'react-simple-maps'
import {
  Briefcase, Globe, CreditCard, Mic, Camera,
  DollarSign, AlertTriangle, TrendingUp, Users, ZoomIn, ZoomOut
} from 'lucide-react'
import PageHero from '../components/PageHero'
import RiskBadge from '../components/RiskBadge'
import AnimatedCounter from '../components/AnimatedCounter'
import SectionDivider from '../components/SectionDivider'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

const vectors = [
  {
    id: 'ceo-fraud',
    icon: Briefcase,
    title: 'CEO Fraud / BEC',
    subtitle: 'Business Email Compromise',
    risk: 'CRITICAL',
    description:
      'Angreifer klonen die Stimme oder das Video eines CEOs/CFOs und weisen Mitarbeiter an, dringende Überweisungen durchzuführen. Die Anfragen wirken authentisch — gleiche Stimme, gleicher Tonfall, gleiche Sprechmuster.',
    example: {
      title: 'Hongkong, 2024',
      text: 'Ein Finanzmitarbeiter einer multinationalen Firma überwies $25 Millionen nach einem Deepfake-Videocall, bei dem vermeintlich CFO und andere Führungskräfte anwesend waren. Alle Anwesenden im Call waren KI-generiert.',
      source: 'CNN, Feb 2024',
    },
    impact: 'Durchschnittlich $48.000 Schaden pro Vorfall; in Einzelfällen Millionenverluste.',
    indicators: [
      'Ungewöhnlich dringende Zahlungsanfragen',
      'Bitte zur Geheimhaltung',
      'Neue Bankverbindungen kurz vor Deadline',
    ],
  },
  {
    id: 'political',
    icon: Globe,
    title: 'Politische Manipulation',
    subtitle: 'Disinformation & Propaganda',
    risk: 'HIGH',
    description:
      'Deepfake-Videos von Politikern, die Aussagen machen, die sie nie getroffen haben — viral verbreitet um Wahlen zu beeinflussen, Unruhe zu stiften oder außenpolitische Krisen zu provozieren.',
    example: {
      title: 'Ukraine, 2022',
      text: 'Ein gefälschtes Video von Präsident Zelensky, in dem er angeblich ukrainische Soldaten zur Kapitulation auffordert, wurde auf sozialen Netzwerken verbreitet. Zelensky widerlegte das Video umgehend in einem Live-Video.',
      source: 'BBC, March 2022',
    },
    impact: 'Massenpanik, Wahlbeeinflussung, diplomatische Krisen, Vertrauensverlust in Medien.',
    indicators: [
      'Extreme oder untypische Aussagen',
      'Kein offizieller Kanal als Quelle',
      'Video wurde erst kurz vor wichtigen Ereignissen veröffentlicht',
    ],
  },
  {
    id: 'identity',
    icon: CreditCard,
    title: 'Identitätsdiebstahl & KYC-Bypass',
    subtitle: 'Know-Your-Customer Umgehung',
    risk: 'HIGH',
    description:
      'Deepfake-Gesichter werden eingesetzt, um Video-KYC-Prozesse bei Banken und Finanzdienstleistern zu umgehen — mit dem Ziel, Konten unter falschen Identitäten zu eröffnen für Geldwäsche oder Betrug.',
    example: {
      title: 'Finanzbetrug, Europa 2023',
      text: 'Europäische Fintech-Unternehmen meldeten eine Zunahme von KYC-Angriffen mit hochwertigen Deepfake-Videos. Angreifer verwendeten synthetische Gesichter kombiniert mit gestohlenen Ausweisdokumenten.',
      source: 'Sumsub Identity Fraud Report 2023',
    },
    impact: 'Geldwäsche, Identitätsmissbrauch, regulatorische Strafen für Unternehmen.',
    indicators: [
      'Unnatürliche Bewegungen im Gesichtsbereich',
      'Inkonsistente Beleuchtung',
      'Geringe Bewegungstiefe (2D statt 3D)',
    ],
  },
  {
    id: 'voice-social',
    icon: Mic,
    title: 'Social Engineering via Voice Clone',
    subtitle: 'Telefonbetrug & Enkeltrickbetrug',
    risk: 'HIGH',
    description:
      'Geklonte Stimmen von Familienmitgliedern oder Vorgesetzten werden in Telefonbetrug eingesetzt — besonders effektiv bei Notfallszenarien ("Ich stecke im Ausland fest, überweise bitte Geld").',
    example: {
      title: 'Familie in Arizona, 2023',
      text: 'Eine Mutter erhielt einen Anruf mit der geklonten Stimme ihrer Tochter, die weinte und berichtete, sie sei in einem Autounfall verwickelt und benötige dringend Geld für einen Anwalt. Die Stimme war täuschend echt.',
      source: 'Washington Post, April 2023',
    },
    impact: 'Emotionaler Schaden, finanzielle Verluste, besonders ältere Personen betroffen.',
    indicators: [
      'Unerwarteter Anruf aus fremder Nummer',
      'Extremer Zeitdruck und emotionaler Appell',
      'Bitte um sofortige Banküberweisung',
    ],
  },
  {
    id: 'ncii',
    icon: Camera,
    title: 'Non-Konsensuelles Material (NCII)',
    subtitle: 'Synthetischer Missbrauch & Rache',
    risk: 'CRITICAL',
    description:
      'KI-generierte intime Bilder und Videos von realen Personen werden ohne Einwilligung erstellt und verbreitet. Apps wie diese sind für wenige Dollar zugänglich und stellen eine massive Verletzung der Privatsphäre dar.',
    example: {
      title: 'Schulen in den USA, 2023',
      text: 'An mehreren High Schools in den USA erstellten Schüler Deepfake-Bilder von Mitschülerinnen. Über 30 Staaten haben inzwischen spezifische Gesetze gegen NCII-Deepfakes erlassen.',
      source: 'NBC News, September 2023',
    },
    impact: '96% aller Deepfake-Videos sind NCII. Massiver psychischer Schaden für Betroffene.',
    indicators: [
      'Quelle ist unbekannt oder neu',
      'Gesicht wirkt "aufgesetzt" auf dem Körper',
      'Keine anderen Bilder dieser Person in diesem Kontext auffindbar',
    ],
  },
]

const statistics = [
  { icon: DollarSign, value: 25, prefix: '$', suffix: 'M', label: 'Verlust in einem CEO-Fraud-Fall (HK 2024)' },
  { icon: TrendingUp, value: 3000, prefix: '+', suffix: '%', label: 'Deepfake-Wachstum 2022–2023' },
  { icon: Users, value: 96, suffix: '%', label: 'Deepfakes sind non-konsensuelles Material' },
  { icon: AlertTriangle, value: 47, prefix: '$', suffix: 'Mrd.', label: 'Prognostizierter Gesamtschaden bis 2027' },
]

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const incidents = [
  { coordinates: [-95, 40],   label: 'USA',          count: '150+', size: 14, category: 'CEO Fraud & NCII' },
  { coordinates: [-47, -15],  label: 'Brasilien',    count: '30+',  size: 8,  category: 'Social Engineering' },
  { coordinates: [10, 51],    label: 'Deutschland',  count: '45+',  size: 9,  category: 'CEO Fraud' },
  { coordinates: [2, 46],     label: 'Frankreich',   count: '35+',  size: 8,  category: 'Politique Manipulation' },
  { coordinates: [-0.1, 51.5],label: 'UK',           count: '55+',  size: 9,  category: 'BEC & Voice Fraud' },
  { coordinates: [37, 55],    label: 'Russland',     count: '60+',  size: 10, category: 'Pol. Manipulation' },
  { coordinates: [103, 1.3],  label: 'Singapur',     count: '40+',  size: 8,  category: 'KYC Bypass' },
  { coordinates: [116, 39.9], label: 'China',        count: '90+',  size: 12, category: 'Deepfake Fraud' },
  { coordinates: [139, 35.7], label: 'Japan',        count: '50+',  size: 9,  category: 'BEC' },
  { coordinates: [114, 22.3], label: 'Hongkong',     count: '25+',  size: 8,  category: '$25M CEO Fraud' },
  { coordinates: [72.8, 19],  label: 'Indien',       count: '70+',  size: 10, category: 'Voice Cloning' },
  { coordinates: [28, -26],   label: 'Südafrika',    count: '15+',  size: 7,  category: 'NCII' },
  { coordinates: [31, 30],    label: 'Ägypten',      count: '10+',  size: 6,  category: 'Political' },
  { coordinates: [-79, -1],   label: 'Ecuador',      count: '8+',   size: 6,  category: 'Political' },
  { coordinates: [151, -33.8],label: 'Australien',   count: '25+',  size: 7,  category: 'NCII' },
]

function WorldMap() {
  const [tooltip, setTooltip] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState([0, 20])

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(z * 1.5, 8))}
          className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center border border-gray-600 transition-colors"
          title="Vergrößern"
        >
          <ZoomIn size={13} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}
          className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center border border-gray-600 transition-colors"
          title="Verkleinern"
        >
          <ZoomOut size={13} />
        </button>
        <button
          onClick={() => { setZoom(1); setCenter([0, 20]) }}
          className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center border border-gray-600 transition-colors text-xs font-bold"
          title="Zurücksetzen"
        >
          ⌂
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-2.5 border border-gray-700">
        <p className="text-xs text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">Fallanzahl</p>
        {[
          { size: 6, label: '< 20' },
          { size: 9, label: '20–50' },
          { size: 12, label: '50–100' },
          { size: 15, label: '100+' },
        ].map(({ size, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div
              className="bg-red-500/70 border border-red-400 rounded-full flex-shrink-0"
              style={{ width: size, height: size }}
            />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 bg-gray-800 border border-gray-600 text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-xl"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <p className="font-bold text-white">{tooltip.label}</p>
          <p className="text-red-400">{tooltip.count} dokumentierte Fälle</p>
          <p className="text-gray-400">{tooltip.category}</p>
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [0, 20] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ zoom: z, coordinates }) => {
            setZoom(z)
            setCenter(coordinates)
          }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1f2937"
                  stroke="#374151"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#374151', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {incidents.map((inc) => (
            <Marker
              key={inc.label}
              coordinates={inc.coordinates}
              onMouseEnter={(e) => {
                const rect = e.target.closest('svg')?.getBoundingClientRect()
                if (rect) {
                  setTooltip({
                    label: inc.label,
                    count: inc.count,
                    category: inc.category,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  })
                }
              }}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse ring */}
              <circle r={inc.size + 4} fill="none" stroke="#ef4444" strokeWidth={1} opacity={0.3}>
                <animate attributeName="r" values={`${inc.size + 4};${inc.size + 10};${inc.size + 4}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
              </circle>
              {/* Main dot */}
              <circle
                r={inc.size / zoom < 3 ? 3 : inc.size / zoom}
                fill="#ef4444"
                fillOpacity={0.8}
                stroke="#fca5a5"
                strokeWidth={0.8}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      <p className="text-center text-xs text-gray-600 pb-2">
        Klick + Drag zum Navigieren · Scroll oder ± zum Zoomen · Hover für Details
      </p>
    </div>
  )
}

export default function Angriffsvektoren() {
  const [expanded, setExpanded] = useState(null)

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHero
        badge="Bedrohungsanalyse"
        title="Reale Angriffsvektoren & Fallbeispiele"
        subtitle="Dokumentierte Deepfake-Angriffe, ihre Auswirkungen und erkennbare Muster — von CEO Fraud bis politischer Manipulation."
      />

      {/* ── STATISTICS ───────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card text-center py-6"
              >
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={20} className="text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-gray-500 leading-snug">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATTACK VECTOR CARDS ──────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-3">Angriffsvektoren im Detail</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto mb-10">
            Klicke auf eine Karte, um das Fallbeispiel und Erkennungsmerkmale zu sehen.
          </p>

          <div className="space-y-4">
            {vectors.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                  expanded === v.id ? 'border-red-300 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Header (always visible) */}
                <button
                  className="w-full flex items-center gap-4 p-5 text-left"
                  onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    expanded === v.id ? 'bg-red-600' : 'bg-red-50'
                  }`}>
                    <v.icon size={22} className={expanded === v.id ? 'text-white' : 'text-red-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-gray-900 text-base">{v.title}</h3>
                      <RiskBadge level={v.risk} />
                    </div>
                    <p className="text-sm text-gray-500">{v.subtitle}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expanded === v.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-gray-400"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 10.828L2.172 5 1 6.172l7 7 7-7L13.828 5z"/>
                    </svg>
                  </motion.div>
                </button>

                {/* Expanded content */}
                {expanded === v.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 px-5 pb-5 pt-4"
                  >
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">{v.description}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Example */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-4 bg-red-600 rounded-full" />
                          <p className="text-sm font-semibold text-red-800">
                            Fallbeispiel: {v.example.title}
                          </p>
                        </div>
                        <p className="text-sm text-red-700 leading-relaxed mb-2">{v.example.text}</p>
                        <p className="text-xs text-red-500 font-medium">Quelle: {v.example.source}</p>
                      </div>

                      {/* Indicators */}
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-2">Erkennungsmerkmale:</p>
                        <ul className="space-y-1.5">
                          {v.indicators.map((ind, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-gray-500 text-xs">!</span>
                              </div>
                              {ind}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-gray-600 mt-3">
                          <strong className="text-gray-800">Auswirkung: </strong>
                          {v.impact}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── WORLD MAP ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-3">Globale Vorfallsverteilung</h2>
          <p className="section-subtitle text-center max-w-xl mx-auto mb-8">
            Deepfake-Vorfälle sind weltweit dokumentiert — mit Schwerpunkten in Nordamerika, Europa und Ostasien.
          </p>
          <WorldMap />
          <p className="text-center text-xs text-gray-400 mt-4">
            Datenquelle: Sumsub Global Identity Fraud Report 2023 / MIT Media Lab / DeepFake Detection Challenge
          </p>
        </div>
      </section>
    </motion.div>
  )
}
