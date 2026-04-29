import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, CheckCircle, XCircle, ChevronRight, ChevronDown,
  Sliders, Trophy, AlertCircle, BookOpen, Users, Target
} from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionDivider from '../components/SectionDivider'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

const quizQuestions = [
  {
    id: 1,
    question: 'Welche Technologie wird am häufigsten für Video-Deepfakes verwendet?',
    options: [
      'Photoshop-Skripte',
      'Generative Adversarial Networks (GANs)',
      'Einfache Video-Filter',
      'CGI wie in Spielfilmen',
    ],
    correct: 1,
    explanation:
      'GANs (Generative Adversarial Networks) sind die Kerntechnologie hinter den meisten Video-Deepfakes. Ein Generator und ein Diskriminator trainieren gegeneinander bis das Ergebnis täuschend echt wirkt.',
  },
  {
    id: 2,
    question: 'Wie viele Sekunden Audiomaterial benötigt ElevenLabs (State-of-the-Art 2024) für Voice Cloning?',
    options: ['Mindestens 30 Minuten', 'Ca. 10 Minuten', 'Nur 3–60 Sekunden', 'Mindestens 5 Stunden'],
    correct: 2,
    explanation:
      'Moderne Voice-Cloning-Tools wie ElevenLabs benötigen nur wenige Sekunden Audio-Sample für ein überzeugend klingendes Ergebnis. Das macht z.B. öffentlich verfügbare Videos gefährlich.',
  },
  {
    id: 3,
    question: 'Was ist ein sicheres Erkennungsmerkmal für Video-Deepfakes?',
    options: [
      'Die Person spricht mit Akzent',
      'Unnatürliches Blinzeln, unscharfe Ränder, inkonsistente Beleuchtung',
      'Das Video ist in schlechter Auflösung',
      'Die Person sitzt ruhig ohne Bewegung',
    ],
    correct: 1,
    explanation:
      'Typische Artefakte: unnatürliches oder fehlendes Blinzeln, unscharfe/verwischte Ränder um Gesicht und Haare, inkonsistente Beleuchtung zwischen Gesicht und Hintergrund, Artefakte bei schnellen Kopfbewegungen.',
  },
  {
    id: 4,
    question: 'Was ist CEO Fraud im Kontext von Deepfakes?',
    options: [
      'Ein CEO, der ein gefälschtes LinkedIn-Profil nutzt',
      'Verwendung geklonter Stimme/Video eines Chefs, um Mitarbeiter zu Überweisungen zu verleiten',
      'Betrug durch KI-generierte E-Mails ohne Audio/Video',
      'Hacking des E-Mail-Accounts eines CEOs',
    ],
    correct: 1,
    explanation:
      'CEO Fraud via Deepfake kombiniert Voice Cloning oder Video Deepfakes mit Social Engineering: Mitarbeiter werden von der "Stimme ihres Chefs" angewiesen, dringende Überweisungen durchzuführen.',
  },
  {
    id: 5,
    question: 'Welcher Anteil aller Deepfake-Videos ist non-konsensuelles Material (NCII)?',
    options: ['Etwa 10%', 'Etwa 40%', 'Etwa 70%', 'Ca. 96%'],
    correct: 3,
    explanation:
      'Studien zeigen, dass bis zu 96% aller im Umlauf befindlichen Deepfake-Videos non-konsensuelles intimes Material (NCII) sind — was die gesellschaftliche Gefährlichkeit dieser Technologie besonders deutlich macht.',
  },
]

const trainingModules = [
  {
    id: 1,
    title: 'Modul 1: Deepfakes erkennen — Grundlagen',
    duration: '15 min',
    content: [
      'Visuelle Artefakte in Video-Deepfakes identifizieren',
      'Typische Fehler bei Gesichtsrändern, Mimik und Blinzeln',
      'Audio-Artefakte bei Voice Cloning erkennen',
      'Checkliste für den schnellen Faktencheck',
    ],
  },
  {
    id: 2,
    title: 'Modul 2: Verhaltensregeln im Verdachtsfall',
    duration: '10 min',
    content: [
      'Sofortmaßnahmen bei verdächtigen Video-Calls',
      'Rückruf-Verfahren für CEO-Anweisungen (Call-Back Policy)',
      'Eskalationspfade im Unternehmen',
      'Meldung und Dokumentation von Vorfällen',
    ],
  },
  {
    id: 3,
    title: 'Modul 3: Technische Schutzmaßnahmen',
    duration: '20 min',
    content: [
      'Deepfake-Detection-Tools im Überblick',
      'Watermarking und digitale Signaturen',
      'KI-gestützte Echtzeitüberprüfung in Video Calls',
      'Firmenpolitik für Zahlungsfreigaben mit Mehrfachverifizierung',
    ],
  },
  {
    id: 4,
    title: 'Modul 4: Rechtliche Grundlagen',
    duration: '15 min',
    content: [
      'Aktuelle Gesetzeslage zu Deepfakes in Deutschland/EU',
      'Strafrechtliche Konsequenzen für Ersteller',
      'Anzeigepflichten bei NCII',
      'Beweissicherung digitaler Fälschungen',
    ],
  },
]

// Quiz component
function Quiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = quizQuestions[current]

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === q.correct) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (current < quizQuestions.length - 1) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  const reset = () => {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
  }

  const pct = Math.round((score / quizQuestions.length) * 100)

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          pct >= 80 ? 'bg-green-100' : pct >= 60 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <Trophy size={36} className={pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {score} / {quizQuestions.length} richtig
        </h3>
        <p className="text-gray-600 mb-1">{pct}% Trefferquote</p>
        <p className={`text-sm font-semibold mb-6 ${
          pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {pct >= 80
            ? 'Ausgezeichnet! Du bist gut über Deepfakes informiert.'
            : pct >= 60
            ? 'Gut! Aber es gibt noch Lernpotenzial.'
            : 'Empfehlung: Lies die Infoseiten aufmerksam durch.'}
        </p>
        <button onClick={reset} className="btn-primary">
          Quiz wiederholen
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">
          Frage {current + 1} von {quizQuestions.length}
        </span>
        <div className="flex gap-1.5">
          {quizQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-6 h-1.5 rounded-full transition-colors ${
                i < current ? 'bg-red-600' : i === current ? 'bg-red-300' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-base font-semibold text-gray-900 mb-5">{q.question}</h3>

          <div className="space-y-2.5 mb-5">
            {q.options.map((opt, idx) => {
              let style = 'border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
              if (answered) {
                if (idx === q.correct) style = 'border-green-500 bg-green-50 text-green-800'
                else if (idx === selected) style = 'border-red-500 bg-red-50 text-red-800'
                else style = 'border-gray-200 text-gray-400'
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full flex items-center gap-3 p-3.5 border rounded-lg text-sm font-medium transition-all text-left ${style}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    answered && idx === q.correct
                      ? 'border-green-500 bg-green-500'
                      : answered && idx === selected
                      ? 'border-red-500 bg-red-500'
                      : 'border-current'
                  }`}>
                    {answered && idx === q.correct && <CheckCircle size={12} className="text-white" />}
                    {answered && idx === selected && idx !== q.correct && <XCircle size={12} className="text-white" />}
                  </div>
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-5"
            >
              <p className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-1.5">
                <AlertCircle size={14} />
                Erklärung
              </p>
              <p className="text-sm text-blue-700">{q.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {answered && (
        <button onClick={handleNext} className="btn-primary w-full justify-center">
          {current < quizQuestions.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen'}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

// Image comparison slider
function ComparisonSlider() {
  const [position, setPosition] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const updatePosition = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }

  return (
    <div
      ref={containerRef}
      className="relative h-64 md:h-80 rounded-xl overflow-hidden cursor-ew-resize select-none border border-gray-200"
      onMouseMove={(e) => dragging.current && updatePosition(e.clientX)}
      onMouseDown={(e) => { dragging.current = true; updatePosition(e.clientX) }}
      onMouseUp={() => { dragging.current = false }}
      onMouseLeave={() => { dragging.current = false }}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
      onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
    >
      {/* "Real" side */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl">👤</div>
          <p className="text-sm font-semibold text-gray-600">Echtes Foto</p>
          <p className="text-xs text-gray-400">Natürliche Haut, konsistente Beleuchtung</p>
        </div>
      </div>

      {/* "Deepfake" side — clipped */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <div className="text-center">
          <div className="w-24 h-24 bg-red-200 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl relative">
            👤
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-red-700">KI-generiert</p>
          <p className="text-xs text-red-400">Artefakte an Haaren, unscharfe Ränder</p>
        </div>
      </div>

      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl border border-gray-200 flex items-center justify-center">
          <Sliders size={14} className="text-gray-500" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 backdrop-blur-sm rounded text-xs font-semibold text-gray-700">
        REAL
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 bg-red-600/90 backdrop-blur-sm rounded text-xs font-semibold text-white">
        DEEPFAKE
      </div>
    </div>
  )
}

// Training accordion
function TrainingAccordion() {
  const [open, setOpen] = useState(null)

  return (
    <div className="space-y-3">
      {trainingModules.map((mod) => (
        <div key={mod.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === mod.id ? null : mod.id)}
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              open === mod.id ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'
            }`}>
              {mod.id}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{mod.title}</p>
              <p className="text-xs text-gray-500">{mod.duration}</p>
            </div>
            <motion.div
              animate={{ rotate: open === mod.id ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {open === mod.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ul className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                  {mod.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default function AwarenessPortal() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHero
        badge="Awareness & Training"
        title="Awareness Portal"
        subtitle="Interaktives Lernportal: Quiz, Trainingsmodule und Demo-Tools zum Erkennen von Deepfakes."
      />

      {/* ── CONCEPT ───────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Brain, title: 'Wissen aufbauen', desc: 'Interaktive Inhalte vermitteln Grundlagen und aktuelle Bedrohungen verständlich.' },
              { icon: Target, title: 'Erkennen trainieren', desc: 'Übungen und Quiz-Formate schärfen den kritischen Blick für KI-Fälschungen.' },
              { icon: Users, title: 'Unternehmen schützen', desc: 'Trainingsmodule für IT-Security-Teams, Führungskräfte und alle Mitarbeitenden.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card flex gap-4"
              >
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUIZ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              <Brain size={11} />
              Interaktiv
            </div>
            <h2 className="section-title">Erkennst du den Deepfake?</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              5 Fragen — teste dein Wissen über Deepfakes, Voice Cloning und Angriffsmethoden.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card"
          >
            <Quiz />
          </motion.div>
        </div>
      </section>

      <SectionDivider label="Demo" />

      {/* ── COMPARISON SLIDER ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Real vs. Deepfake — Vergleich</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              Schiebe den Regler, um typische Unterschiede zwischen einem echten Foto und einem KI-generierten Bild zu sehen.
            </p>
          </div>
          <ComparisonSlider />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-2">Echte Fotos zeigen:</p>
              <ul className="space-y-1">
                {['Natürliche Hautporen', 'Gleichmäßige Beleuchtung', 'Konsistente Haartextur', 'Korrekte Ohrmuscheln'].map((i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <CheckCircle size={11} className="text-green-500" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm font-semibold text-red-800 mb-2">KI-Bilder zeigen oft:</p>
              <ul className="space-y-1">
                {['Glasige, zu glatte Haut', 'Unscharfe Haarkanten', 'Artefakte bei Zähnen/Augen', 'Übergang Gesicht/Hintergrund'].map((i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-red-600">
                    <XCircle size={11} className="text-red-500" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider label="Training" />

      {/* ── TRAINING MODULES ──────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Trainingsmodule — Konzept</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              Wie ein Enterprise-Awareness-Programm strukturiert sein könnte — zum Ausklappen und Durchlesen.
            </p>
          </div>
          <TrainingAccordion />

          {/* Phishing simulation concept */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} className="text-yellow-700" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Phishing-Simulation — Konzept</h3>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  Eine vollständige Enterprise-Lösung würde kontrollierte Deepfake-Angriffssimulationen beinhalten:
                  Mitarbeitende erhalten unangemeldete Deepfake-Calls, Voice-Clone-Nachrichten oder manipulierte
                  Video-Meetings — im sicheren Rahmen, mit anschließendem Debrief und Lernempfehlung.
                  <strong className="block mt-2">
                    Dies ist ein Konzept-Mockup. Im Produktivbetrieb würde dies eine eigene Backend-Infrastruktur erfordern.
                  </strong>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
