import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ComposableMap, Geographies, Geography, Marker, ZoomableGroup
} from 'react-simple-maps'
import {
  Briefcase, Globe, CreditCard, Mic, Camera, ShoppingCart,
  DollarSign, AlertTriangle, TrendingUp, Users, ZoomIn, ZoomOut,
  CheckCircle, XCircle, AlertCircle
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
      'Angreifer klonen die Stimme oder das Video eines CEOs/CFOs und weisen Mitarbeiter an, dringende Überweisungen durchzuführen. Die Anfragen wirken authentisch — gleiche Stimme, gleicher Tonfall, gleiche Sprechmuster. CEO-Fraud zielt täglich auf mindestens 400 Unternehmen ab.',
    example: {
      title: 'Hongkong, Februar 2024',
      text: 'Ein Finanzmitarbeiter von Arup überwies $25 Mio. nach einem Deepfake-Videocall, bei dem vermeintlich CFO und andere Führungskräfte anwesend waren. Alle Teilnehmer im Call — außer dem Opfer — waren KI-generiert.',
      source: 'CNN / WEF, Feb 2024',
    },
    impact: 'Ø $500.000 Schaden pro Vorfall (2024); in Einzelfällen bis $25 Mio. Verlust.',
    indicators: [
      'Ungewöhnlich dringende Zahlungsanfragen mit strikter Deadline',
      'Ausdrückliche Bitte zur Geheimhaltung gegenüber Kollegen',
      'Neue Bankverbindungen, die kurz vor der Transaktion genannt werden',
    ],
  },
  {
    id: 'political',
    icon: Globe,
    title: 'Politische Manipulation',
    subtitle: 'Disinformation & Propaganda',
    risk: 'HIGH',
    description:
      'Deepfake-Videos von Politikern, die Aussagen machen, die sie nie getroffen haben — viral verbreitet um Wahlen zu beeinflussen, Unruhe zu stiften oder außenpolitische Krisen zu provozieren. 2026 wurden erstmals minutenlange, realistisch nachgebildete Kandidaten-Deepfakes im US-Wahlkampf eingesetzt.',
    example: {
      title: 'Ukraine, März 2022',
      text: 'Ein gefälschtes Video von Präsident Zelensky, in dem er angeblich ukrainische Soldaten zur Kapitulation auffordert, wurde auf sozialen Netzwerken verbreitet. Zelensky widerlegte das Video umgehend in einem Live-Video.',
      source: 'BBC, March 2022',
    },
    impact: 'Massenpanik, Wahlbeeinflussung, diplomatische Krisen, Vertrauensverlust in Medien.',
    indicators: [
      'Extreme oder untypische Aussagen ohne offizielle Bestätigung',
      'Kein verifizierter Kanal als Primärquelle',
      'Video erscheint kurz vor wichtigen politischen Ereignissen',
    ],
  },
  {
    id: 'identity',
    icon: CreditCard,
    title: 'Identitätsdiebstahl & KYC-Bypass',
    subtitle: 'Know-Your-Customer Umgehung',
    risk: 'HIGH',
    description:
      'Deepfake-Gesichter werden eingesetzt, um Video-KYC-Prozesse bei Banken und Finanzdienstleistern zu umgehen — mit dem Ziel, Konten unter falschen Identitäten zu eröffnen. Deepfakes tragen inzwischen zu 40 % aller biometrischen Betrugsversuche bei.',
    example: {
      title: 'Fintech-Betrug, Europa 2023–2024',
      text: 'Europäische Fintech-Unternehmen meldeten eine massive Zunahme von KYC-Angriffen mit synthetischen Gesichtern. Angreifer kombinierten KI-generierte Fotos mit gestohlenen Ausweisdokumenten für vollständige synthetische Identitäten.',
      source: 'Sumsub Identity Fraud Report 2024',
    },
    impact: 'Geldwäsche, Identitätsmissbrauch, regulatorische Strafen für betroffene Unternehmen.',
    indicators: [
      'Unnatürliche, zu gleichmäßige Gesichtszüge ohne Hautporen',
      'Inkonsistente Beleuchtung zwischen Gesicht und Hintergrund',
      'Fehlende Tiefenwirkung — Gesicht wirkt zweidimensional',
    ],
  },
  {
    id: 'voice-social',
    icon: Mic,
    title: 'Social Engineering via Voice Clone',
    subtitle: 'Telefonbetrug & Enkeltrickbetrug',
    risk: 'HIGH',
    description:
      'Geklonte Stimmen von Familienmitgliedern oder Vorgesetzten werden in Telefonbetrug eingesetzt. Moderne Tools benötigen nur 3–20 Sekunden Audiomaterial für einen 85 % realistischen Voice Clone. 77 % der Opfer eines Voice-Clone-Angriffs verloren Geld.',
    example: {
      title: 'Familie in Arizona, USA 2023',
      text: 'Eine Mutter erhielt einen Anruf mit der geklonten Stimme ihrer Tochter, die weinte und berichtete, sie sei in einen Autounfall verwickelt und brauche dringend Geld für einen Anwalt. Die Stimme war täuschend echt.',
      source: 'Washington Post, April 2023',
    },
    impact: 'Emotionaler Schaden, finanzielle Verluste; besonders ältere Personen betroffen.',
    indicators: [
      'Unerwarteter Anruf aus unbekannter oder unterdrückter Nummer',
      'Extremer emotionaler Druck und Zeitdringlichkeit',
      'Explizite Bitte um sofortige Überweisung oder Bargeldübergabe',
    ],
  },
  {
    id: 'ncii',
    icon: Camera,
    title: 'Non-Konsensuelles Material (NCII)',
    subtitle: 'Synthetischer Missbrauch & Rache',
    risk: 'CRITICAL',
    description:
      'KI-generierte intime Bilder und Videos von realen Personen werden ohne Einwilligung erstellt und verbreitet. 96 % aller Deepfake-Videos sind NCII, 99 % davon zeigen Frauen. Der US-TAKE IT DOWN Act (Mai 2025) verpflichtet Plattformen zur Entfernung innerhalb von 48 Stunden.',
    example: {
      title: 'High Schools, USA 2023',
      text: 'An mehreren High Schools in den USA erstellten Schüler Deepfake-Bilder von Mitschülerinnen. Inzwischen haben 46 US-Bundesstaaten spezifische Gesetze gegen NCII-Deepfakes erlassen.',
      source: 'NBC News, September 2023',
    },
    impact: '96 % aller Deepfake-Videos sind NCII. Massiver psychischer Schaden für Betroffene.',
    indicators: [
      'Quelle ist unbekannt, neu erstellt oder anonym',
      'Gesicht wirkt „aufgesetzt" — Übergänge am Haaransatz oder Hals sichtbar',
      'Keine anderen authentischen Bilder der Person in diesem Kontext auffindbar',
    ],
  },
  {
    id: 'daas',
    icon: ShoppingCart,
    title: 'Deepfake-as-a-Service (DaaS)',
    subtitle: 'Kriminelle Infrastruktur auf Abruf',
    risk: 'CRITICAL',
    description:
      'Seit 2025 bieten kriminelle Plattformen Deepfake-Tools als buchbare Services an — ohne technisches Know-how. Voice Cloning, Video-Faceswap und synthetische Identitäten sind im Darknet ab $20 verfügbar. DaaS war 2025 an über 30 % aller hochkarätigen CEO-Impersonationsangriffe beteiligt.',
    example: {
      title: 'Singapur, 2025',
      text: 'Angreifer nutzten eine DaaS-Plattform um Führungskräfte eines Unternehmens zu imitieren und Mitarbeiter zur Überweisung von Millionenbeträgen auf Fraudkonten zu bewegen — vollständig remote, ohne eigene technische Infrastruktur.',
      source: 'Cyble Executive Threat Report 2025',
    },
    impact: 'Demokratisierung von Cybercrime: Jeder kann hochwertige Deepfake-Angriffe kaufen.',
    indicators: [
      'Angriffe erscheinen professionell trotz unbekannter Tätergruppe',
      'Mehrere ähnliche Angriffsmuster gleichzeitig in verschiedenen Unternehmen',
      'Voice- und Video-Qualität übersteigt Fähigkeiten einzelner Akteure',
    ],
  },
]

const statistics = [
  {
    icon: DollarSign,
    value: 200,
    prefix: '$',
    suffix: 'M+',
    label: 'Verluste durch Deepfake-Betrug — nur Q1 2025 in Nordamerika',
    source: 'Resemble AI / WEF 2025',
  },
  {
    icon: TrendingUp,
    value: 400,
    suffix: '+',
    label: 'Unternehmen täglich durch CEO-Fraud-Deepfakes angegriffen',
    source: 'Keepnet / Deepstrike 2025',
  },
  {
    icon: Users,
    value: 96,
    suffix: '%',
    label: 'Deepfakes sind non-konsensuelles intimes Material (NCII)',
    source: 'Sensity AI 2024',
  },
  {
    icon: AlertTriangle,
    value: 40,
    prefix: '$',
    suffix: 'Mrd.',
    label: 'Projizierter KI-Betrugsschaden in den USA bis 2027',
    source: 'Deloitte 2024',
  },
]

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const incidents = [
  { coordinates: [-95, 40],    label: 'USA',         count: '150+', size: 14, category: 'CEO Fraud & NCII' },
  { coordinates: [-47, -15],   label: 'Brasilien',   count: '30+',  size: 8,  category: 'Social Engineering' },
  { coordinates: [10, 51],     label: 'Deutschland', count: '45+',  size: 9,  category: 'CEO Fraud' },
  { coordinates: [2, 46],      label: 'Frankreich',  count: '35+',  size: 8,  category: 'Politique Manipulation' },
  { coordinates: [-0.1, 51.5], label: 'UK',          count: '55+',  size: 9,  category: 'BEC & Voice Fraud' },
  { coordinates: [37, 55],     label: 'Russland',    count: '60+',  size: 10, category: 'Pol. Manipulation' },
  { coordinates: [103, 1.3],   label: 'Singapur',    count: '40+',  size: 8,  category: 'KYC Bypass & DaaS' },
  { coordinates: [116, 39.9],  label: 'China',       count: '90+',  size: 12, category: 'Deepfake Fraud' },
  { coordinates: [139, 35.7],  label: 'Japan',       count: '50+',  size: 9,  category: 'BEC' },
  { coordinates: [114, 22.3],  label: 'Hongkong',    count: '25+',  size: 8,  category: '$25M CEO Fraud' },
  { coordinates: [72.8, 19],   label: 'Indien',      count: '70+',  size: 10, category: 'Voice Cloning' },
  { coordinates: [28, -26],    label: 'Südafrika',   count: '15+',  size: 7,  category: 'NCII' },
  { coordinates: [31, 30],     label: 'Ägypten',     count: '10+',  size: 6,  category: 'Political' },
  { coordinates: [-79, -1],    label: 'Ecuador',     count: '8+',   size: 6,  category: 'Political' },
  { coordinates: [151, -33.8], label: 'Australien',  count: '25+',  size: 7,  category: 'NCII' },
]

function WorldMap() {
  const [tooltip, setTooltip] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState([0, 20])
  const [mapError, setMapError] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
      {/* Mobile-Hinweis */}
      <div className="sm:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700 text-xs text-gray-400">
        <span>👆</span>
        <span>Tippen &amp; Ziehen zum Navigieren · Zwei Finger zum Zoomen</span>
      </div>

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

      {/* Legende */}
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

      {/* Fehler-State */}
      {mapError && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-3">
          <AlertTriangle size={28} className="text-gray-600" />
          <p className="text-sm">Karte konnte nicht geladen werden.</p>
          <p className="text-xs text-gray-600">Bitte Internetverbindung prüfen.</p>
        </div>
      )}

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

      {!mapError && (
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
            <Geographies
              geography={GEO_URL}
              onError={() => setMapError(true)}
            >
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
                <circle r={inc.size + 4} fill="none" stroke="#ef4444" strokeWidth={1} opacity={0.3}>
                  <animate attributeName="r" values={`${inc.size + 4};${inc.size + 10};${inc.size + 4}`} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                </circle>
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
      )}

      <p className="text-center text-xs text-gray-600 pb-2 hidden sm:block">
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
        subtitle="Dokumentierte Deepfake-Angriffe, ihre Auswirkungen und erkennbare Muster — von CEO Fraud bis Deepfake-as-a-Service."
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
                className="card text-center py-6 flex flex-col gap-2"
              >
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mx-auto">
                  <stat.icon size={20} className="text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-gray-500 leading-snug">{stat.label}</p>
                <p className="text-[10px] text-gray-300 font-medium">{stat.source}</p>
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

          <div className="space-y-3">
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
                {/* Header */}
                <button
                  className="w-full flex items-center gap-4 p-5 text-left"
                  onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    expanded === v.id ? 'bg-red-600' : 'bg-red-50'
                  }`}>
                    <v.icon size={22} className={expanded === v.id ? 'text-white' : 'text-red-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-gray-900 text-base">{v.title}</h3>
                      <RiskBadge level={v.risk} />
                      {v.id === 'daas' && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                          Neu 2025
                        </span>
                      )}
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
                      {/* Fallbeispiel */}
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-5 bg-red-600 rounded-full" />
                          <p className="text-sm font-bold text-red-800">
                            Fallbeispiel: {v.example.title}
                          </p>
                        </div>
                        <p className="text-sm text-red-700 leading-relaxed mb-3">{v.example.text}</p>
                        <div className="flex items-center gap-1.5 pt-2 border-t border-red-200">
                          <AlertCircle size={11} className="text-red-400 flex-shrink-0" />
                          <p className="text-xs text-red-400 font-medium">Quelle: {v.example.source}</p>
                        </div>
                      </div>

                      {/* Erkennungsmerkmale + Impact */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <XCircle size={13} className="text-red-500" />
                            Erkennungsmerkmale
                          </p>
                          <ul className="space-y-2">
                            {v.indicators.map((ind, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                                {ind}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                          <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={13} className="text-orange-500" />
                            Auswirkung
                          </p>
                          <p className="text-sm text-orange-800 leading-relaxed">{v.impact}</p>
                        </div>
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
            Datenquelle: Sumsub Global Identity Fraud Report 2024 · Resemble AI Q1 2025 · Keepnet Labs 2025
          </p>
        </div>
      </section>
    </motion.div>
  )
}