import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video, Image, Mic, Cpu, Clock, Play, ChevronRight, Layers,
  DollarSign, Globe, ShieldAlert, Gavel, Zap
} from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionDivider from '../components/SectionDivider'
import InfoCard from '../components/InfoCard'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

const tabs = [
  {
    id: 'video',
    label: 'Video Deepfakes',
    icon: Video,
    content: {
      headline: 'Wie entstehen Video-Deepfakes?',
      description:
        'Video-Deepfakes nutzen GANs (Generative Adversarial Networks) oder neuere Diffusion Models, um Gesichter in Videos überzeugend auszutauschen. Ein Generator-Netz erzeugt das gefälschte Bild, ein Diskriminator-Netz bewertet die Überzeugungskraft — bis das Ergebnis kaum von Original zu unterscheiden ist.',
      steps: [
        { title: 'Datenbeschaffung', desc: 'Hunderte bis tausende Bilder/Videos der Zielperson werden gesammelt.' },
        { title: 'Training', desc: 'Das GAN-Modell trainiert auf den Eingabedaten — Stunden bis Tage.' },
        { title: 'Face Swap', desc: 'Das trainierte Modell überlagert das Zielgesicht Frame für Frame.' },
        { title: 'Post-Processing', desc: 'Beleuchtung, Farbanpassung und Übergänge werden geglättet.' },
      ],
      tools: ['DeepFaceLab', 'FaceSwap', 'Stable Diffusion', 'Runway Gen-2'],
      videoId: 'HJMx9n5mFSM',
    },
  },
  {
    id: 'image',
    label: 'Image Deepfakes',
    icon: Image,
    content: {
      headline: 'KI-generierte Bilder & Face Morphing',
      description:
        'Bild-Deepfakes reichen von vollständig generierten Personen ("This Person Does Not Exist") bis zu manipulierten echten Fotos. Diffusion Models wie Stable Diffusion oder DALL-E erzeugen in Sekunden fotorealistische Bilder aus Texteingaben.',
      steps: [
        { title: 'Text-to-Image', desc: 'Aus einer Textbeschreibung wird ein realistisches Bild generiert.' },
        { title: 'Inpainting', desc: 'Teile eines echten Fotos werden nahtlos durch KI-Inhalt ersetzt.' },
        { title: 'Face Morphing', desc: 'Zwei Gesichter werden interpoliert — gefährlich für ID-Dokumente.' },
        { title: 'Super Resolution', desc: 'Niedrig aufgelöste Outputs werden hochskaliert und geschärft.' },
      ],
      tools: ['Stable Diffusion', 'Midjourney', 'DALL-E 3', 'Adobe Firefly'],
      videoId: 'sFztPP9qPRc',
    },
  },
  {
    id: 'voice',
    label: 'Voice Cloning',
    icon: Mic,
    content: {
      headline: 'Synthetische Stimmen — Voice Cloning',
      description:
        'Voice Cloning kann mit wenigen Sekunden Audiomaterial eine überzeugende Kopie einer Stimme erstellen. TTS-Modelle (Text-to-Speech) wie ElevenLabs oder Microsoft VALL-E lernen die charakteristischen Merkmale einer Stimme und können sie für beliebige Texte rekonstruieren.',
      steps: [
        { title: 'Audio-Sampling', desc: 'Bereits 3–60 Sekunden Sprachmaterial reichen für einfaches Cloning.' },
        { title: 'Feature Extraction', desc: 'Tonhöhe, Rhythmus, Akzent und emotionale Muster werden extrahiert.' },
        { title: 'TTS-Synthese', desc: 'Beliebiger Text wird in der geklonten Stimme ausgegeben.' },
        { title: 'Real-Time Cloning', desc: 'Live-Konversionstools wandeln Stimmen in Echtzeit um.' },
      ],
      tools: ['ElevenLabs', 'Resemble AI', 'Microsoft VALL-E', 'Tortoise TTS'],
      videoId: 'egmetsfTm3c',
    },
  },
]

// Kategorie-Typen für die Timeline
const CATEGORY = {
  TECH:    { label: 'Technologie', icon: Cpu,        color: 'bg-blue-100 text-blue-700 border-blue-200' },
  FRAUD:   { label: 'Betrug',      icon: DollarSign, color: 'bg-red-100 text-red-700 border-red-200' },
  POLITICS:{ label: 'Politik',     icon: Globe,      color: 'bg-orange-100 text-orange-700 border-orange-200' },
  LAW:     { label: 'Gesetz',      icon: Gavel,      color: 'bg-green-100 text-green-700 border-green-200' },
  THREAT:  { label: 'Bedrohung',   icon: ShieldAlert,color: 'bg-purple-100 text-purple-700 border-purple-200' },
}

const timeline = [
  {
    year: '2017',
    category: CATEGORY.TECH,
    title: 'Der Begriff entsteht',
    event: 'Reddit-User „deepfakes" veröffentlicht erste Face-Swap-Videos. Die Technologie basiert auf GANs — der Begriff „Deepfake" ist geboren.',
    milestone: false,
  },
  {
    year: '2018',
    category: CATEGORY.TECH,
    title: 'Open-Source-Welle',
    event: 'DeepFaceLab und FaceSwap werden als Open-Source veröffentlicht. Erste politische Fakes kursieren, die Einstiegshürde sinkt drastisch.',
    milestone: false,
  },
  {
    year: '2019',
    category: CATEGORY.FRAUD,
    title: 'Erster Voice-Cloning-Betrug',
    event: 'Weltweit erster dokumentierter CEO-Fraud per Voice Cloning: Angreifer klonen die Stimme eines Konzernchefs und erbeuten £220.000 von einem britischen Energieunternehmen.',
    milestone: true,
  },
  {
    year: '2020',
    category: CATEGORY.POLITICS,
    title: 'Deepfakes werden mainstream',
    event: 'Realistische „Deepfake Presidents" verbreiten sich viral auf TikTok und Twitter. Erste Warnungen von Nachrichtendiensten über Wahlbeeinflussung.',
    milestone: false,
  },
  {
    year: '2021',
    category: CATEGORY.TECH,
    title: 'Tom Cruise erschüttert die Öffentlichkeit',
    event: 'Ein täuschend echter Tom-Cruise-Deepfake auf TikTok wird millionenfach geteilt — und zeigt erstmals einer breiten Öffentlichkeit, wie weit die Technologie schon fortgeschritten ist.',
    milestone: true,
  },
  {
    year: '2022',
    category: CATEGORY.THREAT,
    title: 'Stable Diffusion & Kriegspropaganda',
    event: 'Stable Diffusion wird open-source veröffentlicht: Bild-Deepfakes für jeden zugänglich. Parallel dazu: Ein gefälschtes Zelensky-Video fordert ukrainische Soldaten zur Kapitulation auf.',
    milestone: true,
  },
  {
    year: '2023',
    category: CATEGORY.FRAUD,
    title: 'Voice Cloning mit 3 Sekunden Audio',
    event: 'ElevenLabs ermöglicht überzeugenden Voice Clone aus nur 3 Sekunden Audiomaterial. Deepfake-Vorfälle steigen um 3.000 % im Jahresvergleich (Sumsub).',
    milestone: false,
  },
  {
    year: '2024',
    category: CATEGORY.FRAUD,
    title: '$25 Mio. Verlust in einem Anruf',
    event: 'In Hongkong überweist ein Finanzmitarbeiter $25 Mio. nach einem Deepfake-Videocall mit dem vermeintlichen CFO. Alle Teilnehmer im Call waren KI-generiert. Ø Unternehmensschaden pro Vorfall: $500.000.',
    milestone: true,
  },
  {
    year: '2025',
    category: CATEGORY.LAW,
    title: 'Erstes US-Bundesgesetz',
    event: 'Der TAKE IT DOWN Act wird am 19. Mai 2025 in Kraft gesetzt — das erste US-Bundesgesetz gegen Deepfakes. Plattformen müssen non-konsensuelles Material innerhalb von 48h entfernen. Deepfake-as-a-Service boomt.',
    milestone: true,
  },
  {
    year: '2026',
    category: CATEGORY.POLITICS,
    title: 'Politische Deepfakes im Wahlkampf',
    event: 'Erstmals wird ein politischer Kandidat in einem minutenlangen Deepfake-Video realistisch nachgebildet — produziert vom NRSC für die US-Midterms. 46 US-Bundesstaaten haben inzwischen Deepfake-Gesetze erlassen.',
    milestone: true,
  },
]

const techCards = [
  {
    icon: Cpu,
    title: 'GAN — Generative Adversarial Network',
    description:
      'Zwei neuronale Netze (Generator & Diskriminator) konkurrieren: Der Generator versucht, überzeugende Fälschungen zu erzeugen, der Diskriminator versucht, sie zu entlarven. Das Training verbessert beide Seiten iterativ.',
  },
  {
    icon: Layers,
    title: 'Diffusion Models',
    description:
      'Modernere Architektur: Das Modell lernt, Rauschen schrittweise zu einem kohärenten Bild umzuwandeln. Grundlage von Stable Diffusion, DALL-E und Midjourney. Qualitativ überlegen gegenüber GANs.',
  },
  {
    icon: Mic,
    title: 'Text-to-Speech (TTS)',
    description:
      'Neuronale TTS-Modelle lernen die Stimmeigenschaften einer Person aus Audiodaten und können beliebige Texte in dieser Stimme ausgeben. VALL-E (Microsoft) benötigt nur 3 Sekunden Trainings-Audio.',
  },
]

export default function WasSindDeepfakes() {
  const [activeTab, setActiveTab] = useState('video')
  const current = tabs.find((t) => t.id === activeTab)

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHero
        badge="Grundlagen"
        title="Was sind Deepfakes & Voice Cloning?"
        subtitle="Von harmlosen Filtern zu täuschend echten KI-Fälschungen — wie die Technologie funktioniert und warum sie gefährlich ist."
      />

      {/* ── TECH OVERVIEW ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-3">Die zugrundeliegenden Technologien</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Drei KI-Ansätze machen Deepfakes möglich — alle sind frei verfügbar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            {techCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <InfoCard icon={card.icon} title={card.title} description={card.description} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── INTERACTIVE TABS ──────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-2">Deepfake-Typen im Detail</h2>
          <p className="section-subtitle text-center max-w-xl mx-auto mb-8">
            Wähle eine Kategorie und erkunde die technischen Details.
          </p>

          <div className="flex flex-wrap justify-center gap-1 mb-10 bg-white border border-gray-200 rounded-xl p-1.5 max-w-lg mx-auto shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id === 'voice' ? 'Voice' : tab.id === 'video' ? 'Video' : 'Bild'}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <current.icon size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{current.content.headline}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {current.content.description}
                  </p>
                  <div className="space-y-3">
                    {current.content.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600">{i + 1}</span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{step.title}: </span>
                          <span className="text-sm text-gray-600">{step.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bekannte Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {current.content.tools.map((tool) => (
                        <span key={tool} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card flex flex-col">
                  <div className="flex-1 rounded-lg overflow-hidden min-h-[220px]">
                    <iframe
                      className="w-full h-full min-h-[220px]"
                      src={`https://www.youtube.com/embed/${current.content.videoId}`}
                      title={current.content.headline}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">Erkennungsmerkmale</p>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {activeTab === 'video' && [
                        'Unnatürliches Blinzeln oder fehlende Mimik',
                        'Unscharfe Ränder um Gesicht und Haare',
                        'Inkonsistente Beleuchtung zwischen Gesicht und Hintergrund',
                        'Artefakte bei schnellen Kopfbewegungen',
                      ].map((h, i) => <li key={i} className="flex items-start gap-1"><ChevronRight size={11} className="mt-0.5 flex-shrink-0" />{h}</li>)}
                      {activeTab === 'image' && [
                        'Unnatürliche Finger, Zähne oder Ohren',
                        'Inkonsistente Schatten und Reflexionen',
                        'Verschwommener oder sich wiederholender Hintergrund',
                        'Asymmetrien bei Gesichtszügen',
                      ].map((h, i) => <li key={i} className="flex items-start gap-1"><ChevronRight size={11} className="mt-0.5 flex-shrink-0" />{h}</li>)}
                      {activeTab === 'voice' && [
                        'Unnatürliche Pausen oder Atemgeräusche',
                        'Gleichförmige Emotionen ohne Betonung',
                        'Hintergrundgeräusche fehlen oder sind unnatürlich',
                        'Leichte Aussprache-Artefakte bei seltenen Wörtern',
                      ].map((h, i) => <li key={i} className="flex items-start gap-1"><ChevronRight size={11} className="mt-0.5 flex-shrink-0" />{h}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-2">Timeline der Deepfake-Evolution</h2>
          <p className="section-subtitle text-center mb-4">2017 bis heute</p>

          {/* Legende */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {Object.values(CATEGORY).map((cat) => (
              <span
                key={cat.label}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.color}`}
              >
                <cat.icon size={11} />
                {cat.label}
              </span>
            ))}
          </div>

          {/* Timeline-Items */}
          <div className="relative">
            {/* Vertikale Linie */}
            <div className="absolute left-[28px] top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-100" />

            <div className="space-y-4">
              {timeline.map((item, i) => {
                const CatIcon = item.category.icon
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.06 }}
                    className="relative flex gap-5"
                  >
                    {/* Dot + Icon */}
                    <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 56 }}>
                      <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center z-10 shadow-sm ${
                        item.milestone
                          ? 'bg-red-600 border-red-600'
                          : 'bg-white border-gray-200'
                      }`}>
                        <CatIcon
                          size={item.milestone ? 22 : 18}
                          className={item.milestone ? 'text-white' : 'text-gray-400'}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 mb-2 rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md ${
                      item.milestone
                        ? 'border-red-200 bg-red-50/40'
                        : 'border-gray-200 bg-white'
                    }`}>
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          item.milestone
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.year}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${item.category.color}`}>
                          <CatIcon size={10} />
                          {item.category.label}
                        </span>
                        {item.milestone && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                            <Zap size={10} className="fill-red-600" />
                            Meilenstein
                          </span>
                        )}
                      </div>

                      <h3 className={`font-bold mb-1 ${
                        item.milestone ? 'text-gray-900 text-base' : 'text-gray-800 text-sm'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.event}</p>
                    </div>
                  </motion.div>
                )
              })}

              {/* "Jetzt" Marker am Ende */}
              <div className="relative flex gap-5 items-center">
                <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 56 }}>
                  <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-900 flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Jetzt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </motion.div>
  )
}