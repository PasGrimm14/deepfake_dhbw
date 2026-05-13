import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Image, Mic, Cpu, Clock, Play, ChevronRight, Layers } from 'lucide-react'
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
      videoPlaceholder: 'Video Deepfake — Technologie Erklärt',
      videoId: 'HJMx9n5mFSM'
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
      videoPlaceholder: 'Wie KI Bilder generiert — Eine Einführung',
      videoId: 'sFztPP9qPRc'
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
      videoPlaceholder: 'Voice Cloning Demo & Risiken',
      videoId: 'egmetsfTm3c'
    },
  },
]

const timeline = [
  { year: '2017', event: 'Reddit-User "deepfakes" veröffentlicht erste Face-Swap-Videos — der Begriff entsteht.' },
  { year: '2018', event: 'DeepFaceLab und FaceSwap als Open-Source veröffentlicht. Erste politische Fakes.' },
  { year: '2019', event: 'Erste Voice-Cloning-Betrugsmasche: CEO-Stimme geklont, £220K erbeutet.' },
  { year: '2020', event: 'Realistische "Deepfake Presidents" auf sozialen Medien. TikTok-Deepfakes viral.' },
  { year: '2021', event: 'Tom Cruise DeepFake auf TikTok erschüttert Öffentlichkeit. Qualitätssprung durch neue Modelle.' },
  { year: '2022', event: 'Stable Diffusion open-source: Bild-Deepfakes für jeden zugänglich. Erste KYC-Bypässe.' },
  { year: '2023', event: 'ElevenLabs Voice Cloning mit 3s Audio. $25M CEO-Fraud-Fall in Hongkong.' },
  { year: '2024', event: 'Echtzeit-Face-Swap in Video Calls. Erste KI-Deepfake-Gesetze weltweit.' },
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

          {/* Tab buttons */}
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

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Info */}
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

                  {/* Process steps */}
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

                  {/* Tools */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Bekannte Tools
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {current.content.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Video placeholder */}
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-3">Timeline der Deepfake-Evolution</h2>
          <p className="section-subtitle text-center mb-12">2017 bis heute</p>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 sm:left-1/2 w-3 h-3 bg-red-600 rounded-full -translate-x-1/2 mt-1.5 border-2 border-white ring-2 ring-red-200" />

                  {/* Content */}
                  <div
                    className={`ml-10 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                      i % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'
                    }`}
                  >
                    <div className="card">
                      <span className="inline-block px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded mb-2">
                        {item.year}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.event}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
