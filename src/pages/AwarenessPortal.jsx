import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, CheckCircle, XCircle, ChevronRight, ChevronDown,
  Sliders, Trophy, AlertCircle, BookOpen, Users, Target,
  Eye, Mic, Video, ShieldAlert, RotateCcw, ImageIcon,
  Lightbulb, Clock, CheckSquare
} from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionDivider from '../components/SectionDivider'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

// ── Quiz — 8 Fragen, werden bei jedem Start gemischt ─────────────────────────
const allQuestions = [
  {
    id: 1,
    category: 'Technologie',
    question: 'Welche Technologie wird am häufigsten für Video-Deepfakes verwendet?',
    options: [
      'Photoshop-Skripte',
      'Generative Adversarial Networks (GANs)',
      'Einfache Video-Filter',
      'CGI wie in Spielfilmen',
    ],
    correct: 1,
    explanation:
      'GANs (Generative Adversarial Networks) sind die Kerntechnologie hinter den meisten Video-Deepfakes. Ein Generator und ein Diskriminator trainieren gegeneinander, bis das Ergebnis täuschend echt wirkt.',
  },
  {
    id: 2,
    category: 'Voice Cloning',
    question: 'Wie viele Sekunden Audiomaterial benötigt ElevenLabs (Stand 2024) für ein überzeugendes Voice Clone?',
    options: ['Mindestens 30 Minuten', 'Ca. 10 Minuten', 'Nur 3–20 Sekunden', 'Mindestens 5 Stunden'],
    correct: 2,
    explanation:
      'Moderne Voice-Cloning-Tools wie ElevenLabs benötigen nur 3–20 Sekunden Audio-Sample. Mit diesem kurzen Clip kann bereits eine 85 % realistische Stimmkopie erstellt werden — öffentliche Videos reichen als Quelle.',
  },
  {
    id: 3,
    category: 'Erkennung',
    question: 'Welches ist ein typisches visuelles Erkennungsmerkmal für Video-Deepfakes?',
    options: [
      'Die Person spricht mit Akzent',
      'Unnatürliches Blinzeln, unscharfe Haarkanten, inkonsistente Beleuchtung',
      'Das Video ist in niedriger Auflösung',
      'Die Person sitzt ruhig ohne Bewegung',
    ],
    correct: 1,
    explanation:
      'Typische Artefakte: fehlendes oder unnatürliches Blinzeln, verschwommene Ränder um Gesicht und Haare, inkonsistente Beleuchtung zwischen Gesicht und Hintergrund, sowie Verzerrungen bei schnellen Kopfbewegungen.',
  },
  {
    id: 4,
    category: 'Betrug',
    question: 'Was ist CEO Fraud im Kontext von Deepfakes?',
    options: [
      'Ein CEO mit gefälschtem LinkedIn-Profil',
      'Geklonte Stimme/Video eines Vorgesetzten, um Mitarbeiter zu Überweisungen zu bewegen',
      'Betrug durch KI-generierte E-Mails ohne Audio/Video',
      'Hacking des E-Mail-Accounts eines CEOs',
    ],
    correct: 1,
    explanation:
      'CEO Fraud via Deepfake kombiniert Voice Cloning oder Video-Deepfakes mit Social Engineering. Im Februar 2024 verlor ein Unternehmen in Hongkong so $25 Mio. — alle Teilnehmer im Videocall außer dem Opfer waren KI-generiert.',
  },
  {
    id: 5,
    category: 'Statistik',
    question: 'Welcher Anteil aller Deepfake-Videos ist non-konsensuelles intimes Material (NCII)?',
    options: ['Etwa 10 %', 'Etwa 40 %', 'Etwa 70 %', 'Ca. 96 %'],
    correct: 3,
    explanation:
      'Studien von Sensity AI zeigen, dass ca. 96 % aller kursierenden Deepfake-Videos non-konsensuelles intimes Material (NCII) sind — davon zeigen 99 % Frauen. Das macht deutlich, wie stark Deepfakes als Werkzeug zur Belästigung eingesetzt werden.',
  },
  {
    id: 6,
    category: 'Erkennung',
    question: 'Welches ist ein typisches Audio-Merkmal eines Voice-Clone-Deepfakes?',
    options: [
      'Die Stimme klingt tiefer als gewohnt',
      'Unnatürliche Pausen, fehlende Atemgeräusche, gleichförmige Emotionen',
      'Starkes Rauschen im Hintergrund',
      'Die Stimme klingt zu laut',
    ],
    correct: 1,
    explanation:
      'KI-generierte Stimmen zeigen typischerweise unnatürliche Sprechpausen, fehlende oder künstliche Atemgeräusche, gleichförmige emotionale Betonung und minimale Hintergrundgeräusche. Menschen sprechen natürlich ungleichmäßiger.',
  },
  {
    id: 7,
    category: 'Regulierung',
    question: 'Was regelt der US-amerikanische TAKE IT DOWN Act (Mai 2025)?',
    options: [
      'Verbot aller KI-generierten Inhalte in sozialen Medien',
      'Plattformen müssen non-konsensuelles Deepfake-Material innerhalb von 48 Stunden entfernen',
      'KI-Modelle müssen staatlich zugelassen sein',
      'Deepfake-Erstellung wird mit bis zu 10 Jahren Haft bestraft',
    ],
    correct: 1,
    explanation:
      'Der TAKE IT DOWN Act ist das erste US-Bundesgesetz gegen Deepfakes. Es verpflichtet Online-Plattformen, non-konsensuelles intimes Material — echt oder KI-generiert — innerhalb von 48 Stunden nach Meldung zu entfernen.',
  },
  {
    id: 8,
    category: 'Schutz',
    question: 'Was ist die wirksamste Sofortmaßnahme wenn ein Mitarbeiter einen verdächtigen CEO-Anruf erhält?',
    options: [
      'Den Anruf sofort beenden und ignorieren',
      'Die Transaktion durchführen, da die Stimme echt klingt',
      'Über einen unabhängigen, verifizierten Kanal zurückrufen (Call-Back-Policy)',
      'Die IT-Abteilung nach 24 Stunden informieren',
    ],
    correct: 2,
    explanation:
      'Die Call-Back-Policy ist der wichtigste Schutz: Immer über eine bekannte, offizielle Nummer zurückrufen — nie über die im verdächtigen Anruf genannte. Damit lässt sich CEO-Fraud durch Voice Cloning zuverlässig verhindern.',
  },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const CATEGORY_COLORS = {
  'Technologie': 'bg-blue-50 text-blue-700',
  'Voice Cloning': 'bg-purple-50 text-purple-700',
  'Erkennung': 'bg-yellow-50 text-yellow-700',
  'Betrug': 'bg-red-50 text-red-700',
  'Statistik': 'bg-gray-100 text-gray-600',
  'Regulierung': 'bg-green-50 text-green-700',
  'Schutz': 'bg-teal-50 text-teal-700',
}

function Quiz() {
  const [questions, setQuestions] = useState(() => shuffle(allQuestions))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [history, setHistory] = useState([]) // {correct: bool}

  const q = questions[current]

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === q.correct
    if (correct) setScore((s) => s + 1)
    setHistory((h) => [...h, { correct }])
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  const reset = () => {
    setQuestions(shuffle(allQuestions))
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
    setHistory([])
  }

  const pct = Math.round((score / questions.length) * 100)

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          pct >= 80 ? 'bg-green-100' : pct >= 60 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <Trophy size={36} className={pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {score} / {questions.length} richtig
        </h3>
        <p className="text-gray-500 mb-1">{pct} % Trefferquote</p>
        <p className={`text-sm font-semibold mb-6 ${
          pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {pct >= 80
            ? '🎉 Ausgezeichnet! Du kennst dich mit Deepfakes aus.'
            : pct >= 60
            ? '👍 Gut! Mit etwas mehr Lektüre wirst du zum Experten.'
            : '📚 Empfehlung: Lies die anderen Seiten des Portals aufmerksam durch.'}
        </p>

        {/* Antwort-Verlauf */}
        <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
          {history.map((h, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                h.correct ? 'bg-green-500' : 'bg-red-400'
              }`}
            >
              {h.correct ? '✓' : '✗'}
            </div>
          ))}
        </div>

        <button onClick={reset} className="btn-primary">
          <RotateCcw size={15} />
          Neu starten (neue Reihenfolge)
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[q.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {q.category}
          </span>
          <span className="text-xs text-gray-400">
            Frage {current + 1} / {questions.length}
          </span>
        </div>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < current
                  ? history[i]?.correct ? 'bg-green-500 w-5' : 'bg-red-400 w-5'
                  : i === current ? 'bg-red-300 w-5' : 'bg-gray-200 w-3'
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
              let cls = 'border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
              if (answered) {
                if (idx === q.correct) cls = 'border-green-500 bg-green-50 text-green-800'
                else if (idx === selected) cls = 'border-red-500 bg-red-50 text-red-800'
                else cls = 'border-gray-200 text-gray-400'
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full flex items-center gap-3 p-3.5 border rounded-lg text-sm font-medium transition-all text-left ${cls}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    answered && idx === q.correct ? 'border-green-500 bg-green-500'
                    : answered && idx === selected ? 'border-red-500 bg-red-500'
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
              <p className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle size={13} />
                Erklärung
              </p>
              <p className="text-sm text-blue-700 leading-relaxed">{q.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {answered && (
        <button onClick={handleNext} className="btn-primary w-full justify-center">
          {current < questions.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen'}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

// ── Erkennungs-Guide ─────────────────────────────────────────────────────────
const detectionGuide = [
  {
    icon: Video,
    title: 'Video — visuell',
    color: 'blue',
    checks: [
      'Blinzeln unnatürlich häufig, selten oder gar nicht vorhanden',
      'Haarkanten und Gesichtsränder verschwommen oder flackernd',
      'Beleuchtung zwischen Gesicht und Hintergrund stimmt nicht überein',
      'Zähne, Ohren oder Finger wirken verwischt oder verformt',
      'Hals-/Schulterübergang weist Artefakte oder Farbabweichungen auf',
      'Bei schnellen Kopfbewegungen erscheinen kurze Verzerrungen',
    ],
  },
  {
    icon: Mic,
    title: 'Audio & Voice Clone',
    color: 'purple',
    checks: [
      'Sprechpausen wirken unnatürlich — zu gleichmäßig oder abrupt',
      'Keine hörbaren Atemgeräusche zwischen Sätzen',
      'Emotionale Betonung gleichförmig, ohne natürliche Schwankungen',
      'Hintergrundgeräusche fehlen komplett oder klingen synthetisch',
      'Aussprache bei seltenen Namen oder Fremdwörtern klingt steif',
      'Stimme klingt zu sauber — echte Stimmen haben minimale Unreinheiten',
    ],
  },
  {
    icon: Eye,
    title: 'Kontext & Verhalten',
    color: 'orange',
    checks: [
      'Inhalt erscheint auf nicht-verifizierten oder neuen Accounts',
      'Aussagen sind ungewöhnlich extrem oder untypisch für die Person',
      'Video erscheint kurz vor politischen Ereignissen oder Wahlen',
      'Dringlichkeit + Geheimhaltungsbitte bei Zahlungsanweisungen',
      'Kein offizieller Kanal bestätigt den Inhalt',
      'Reverse Image Search liefert keine anderen Quellen des Materials',
    ],
  },
  {
    icon: ShieldAlert,
    title: 'Technische Prüfung',
    color: 'green',
    checks: [
      'Hive Moderation oder TrueMedia.org für Bild/Video-Analyse nutzen',
      'InVID/WeVerify Browser-Plugin für Video-Faktencheck einsetzen',
      'Metadaten des Bildes/Videos auf Unstimmigkeiten prüfen (EXIF)',
      'Content Credentials (C2PA) Badge im Browser prüfen wenn vorhanden',
      'Reverse Image Search mit Google Lens oder TinEye durchführen',
      'Bei Verdacht: zweiten unabhängigen Kanal zur Verifikation nutzen',
    ],
  },
]

const colorMap = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   icon: 'bg-blue-100 text-blue-600',   dot: 'bg-blue-400',   title: 'text-blue-800' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600',dot: 'bg-purple-400', title: 'text-purple-800' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-100 text-orange-600',dot: 'bg-orange-400', title: 'text-orange-800' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  icon: 'bg-green-100 text-green-600',  dot: 'bg-green-500',  title: 'text-green-800' },
}

// ── Trainingsmodule ───────────────────────────────────────────────────────────
const trainingModules = [
  {
    id: 1,
    title: 'Modul 1: Deepfakes visuell erkennen',
    duration: '15 min',
    icon: Eye,
    content: [
      { label: 'Gesichtsränder & Haare', desc: 'Deepfakes zeigen oft unscharfe oder flackernde Übergänge am Haaransatz, an den Ohren und am Hals. Bei natürlichen Videos sind diese Bereiche scharf und konsistent.' },
      { label: 'Blinzeln & Mimik', desc: 'Frühe Deepfakes blinzelten gar nicht, neuere tun es aber unnatürlich häufig oder selten. Subtile Ausdrücke wie leichtes Lächeln fehlen oft vollständig.' },
      { label: 'Beleuchtung & Schatten', desc: 'Das Gesicht und der Hintergrund müssen dieselbe Lichtquelle zeigen. Inkonsistente Schatten an Nase oder Kinn sind ein starkes Warnsignal.' },
      { label: 'Artefakte bei Bewegung', desc: 'Schnelle Kopfbewegungen oder Drehungen erzeugen bei Deepfakes kurze Verzerrungen oder "Ghosting"-Effekte, die bei echten Videos nicht auftreten.' },
    ],
  },
  {
    id: 2,
    title: 'Modul 2: Voice Cloning erkennen & abwehren',
    duration: '10 min',
    icon: Mic,
    content: [
      { label: 'Sprachmuster analysieren', desc: 'Achte auf unnatürliche Pausen, fehlende Atemgeräusche zwischen Sätzen und gleichförmige emotionale Betonung — echte Stimmen variieren deutlich stärker.' },
      { label: 'Call-Back-Policy', desc: 'Niemals Anweisungen aus einem eingehenden Anruf befolgen. Immer über eine bekannte, offizielle Nummer zurückrufen — selbst wenn die Stimme absolut echt klingt.' },
      { label: 'Codewörter einrichten', desc: 'Familienmitglieder und enge Kollegen können vorher vereinbarte Codewörter oder Sicherheitsfragen etablieren, die in einem Notfall erfragt werden.' },
      { label: 'Technische Indikatoren', desc: 'KI-Stimmen klingen oft "zu sauber" — keine Mikrovariationen, keine Räusper, kein natürliches Rauschen. Tools wie AI Voice Detector können Audioclips analysieren.' },
    ],
  },
  {
    id: 3,
    title: 'Modul 3: Unternehmen schützen — Prozesse & Tools',
    duration: '20 min',
    icon: ShieldAlert,
    content: [
      { label: 'Vier-Augen-Prinzip', desc: 'Alle Zahlungen über einem definierten Schwellenwert (z.B. $5.000) müssen von zwei Personen über zwei unabhängige Kanäle bestätigt werden.' },
      { label: 'Deepfake-Detection-APIs', desc: 'Tools wie Reality Defender oder Hive Moderation lassen sich in Video-Conferencing-Systeme integrieren und analysieren Calls in Echtzeit auf Manipulationen.' },
      { label: 'Incident Response Plan', desc: 'Ein dokumentierter Plan für Deepfake-Vorfälle: Wer wird informiert? Welche Behörden? Wie wird Beweismaterial gesichert? Dieser Plan muss vor einem Angriff existieren.' },
      { label: 'Regelmäßige Simulationen', desc: 'Kontrollierte Deepfake-Phishing-Simulationen helfen Mitarbeitenden, die Warnsignale zu verinnerlichen — ähnlich wie klassische Phishing-Simulationen.' },
    ],
  },
  {
    id: 4,
    title: 'Modul 4: Rechtliche Grundlagen & Meldewege',
    duration: '15 min',
    icon: BookOpen,
    content: [
      { label: 'EU AI Act (Art. 50)', desc: 'KI-generierte Videos und Bilder müssen in der EU gekennzeichnet werden. Verstöße können mit bis zu 6 % des weltweiten Jahresumsatzes bestraft werden.' },
      { label: 'TAKE IT DOWN Act (USA, 2025)', desc: 'Plattformen müssen non-konsensuelles intimes Deepfake-Material innerhalb von 48 Stunden nach Meldung entfernen. Die FTC überwacht die Einhaltung.' },
      { label: 'Meldestellen in Deutschland', desc: 'Deepfake-Betrug: Polizei (110 / Online-Wache). NCII-Material: Bundeskriminalamt (BKA) oder jugendschutz.net. BSI für technische Vorfälle in Unternehmen.' },
      { label: 'Beweissicherung', desc: 'Screenshots mit Zeitstempel, URL-Dokumentation, Original-Dateien aufbewahren. Keine direkte Bearbeitung — forensische Integrität ist für strafrechtliche Verfolgung entscheidend.' },
    ],
  },
]

function TrainingAccordion() {
  const [open, setOpen] = useState(null)

  return (
    <div className="space-y-3">
      {trainingModules.map((mod) => {
        const Icon = mod.icon
        return (
          <div key={mod.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setOpen(open === mod.id ? null : mod.id)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                open === mod.id ? 'bg-red-600' : 'bg-red-50'
              }`}>
                <Icon size={17} className={open === mod.id ? 'text-white' : 'text-red-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{mod.title}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Clock size={10} />
                  {mod.duration} · {mod.content.length} Lerneinheiten
                </p>
              </div>
              <motion.div animate={{ rotate: open === mod.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
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
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
                    {mod.content.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={11} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// ── Comparison Slider Placeholder ────────────────────────────────────────────
function ComparisonPlaceholder() {
  return (
    <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <ImageIcon size={28} className="text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-1">Bildvergleich — in Vorbereitung</p>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            Hier erscheint ein interaktiver Schieberegler-Vergleich zwischen einem echten Foto und einem KI-generierten Deepfake, sobald die Bilder vorliegen.
          </p>
        </div>
        <div className="flex items-center gap-6 mt-2">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
            <span className="text-xs font-semibold text-gray-500 px-2 py-0.5 bg-gray-200 rounded">REAL</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <Sliders size={20} />
            <span className="text-xs">vs.</span>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-lg mb-2 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <span className="text-xs font-semibold text-red-600 px-2 py-0.5 bg-red-100 rounded">DEEPFAKE</span>
          </div>
        </div>
      </div>
      {/* Mindesthöhe */}
      <div className="h-64 md:h-72" />
    </div>
  )
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export default function AwarenessPortal() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHero
        badge="Awareness & Training"
        title="Awareness Portal"
        subtitle="Interaktives Lernportal: Erkennungs-Guide, Quiz, Trainingsmodule und Bildvergleich zum Erkennen von Deepfakes."
      />

      {/* ── KONZEPT ──────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Brain,  title: 'Wissen aufbauen',    desc: 'Strukturierter Erkennungs-Guide und Trainingsmodule — von visuellen Artefakten bis zu rechtlichen Grundlagen.' },
              { icon: Target, title: 'Erkennen trainieren', desc: 'Das interaktive Quiz mit 8 gemischten Fragen schärft den kritischen Blick für KI-Fälschungen.' },
              { icon: Users,  title: 'Unternehmen schützen', desc: 'Praxisnahe Module für IT-Teams, Führungskräfte und alle Mitarbeitenden — mit konkreten Handlungsempfehlungen.' },
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

      {/* ── ERKENNUNGS-GUIDE ─────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              <Lightbulb size={11} />
              Praxis-Guide
            </div>
            <h2 className="section-title">Deepfakes erkennen — Checkliste</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Vier Kategorien, 24 konkrete Prüfpunkte — von visuellen Artefakten bis zur technischen Verifikation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {detectionGuide.map((cat, i) => {
              const c = colorMap[cat.color]
              const Icon = cat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-xl border p-5 ${c.bg} ${c.border}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c.icon}`}>
                      <Icon size={18} />
                    </div>
                    <h3 className={`font-bold text-sm uppercase tracking-wider ${c.title}`}>{cat.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {cat.checks.map((check, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
                        {check}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <SectionDivider label="Quiz" />

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              <Brain size={11} />
              Interaktiv · 8 Fragen · Zufällige Reihenfolge
            </div>
            <h2 className="section-title">Erkennst du den Deepfake?</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              Teste dein Wissen über Deepfakes, Voice Cloning, Angriffsmuster und Schutzmaßnahmen.
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

      <SectionDivider label="Bildvergleich" />

      {/* ── COMPARISON SLIDER ────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Real vs. Deepfake — Visueller Vergleich</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              Schiebe den Regler, um typische Unterschiede zwischen einem echten Foto und einem KI-generierten Bild direkt nebeneinander zu sehen.
            </p>
          </div>

          <ComparisonPlaceholder />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-2">Echte Fotos zeigen:</p>
              <ul className="space-y-1">
                {['Natürliche Hautporen und Texturen', 'Gleichmäßige, konsistente Beleuchtung', 'Scharfe, natürliche Haartextur', 'Korrekte, symmetrische Ohrmuscheln'].map((i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <CheckCircle size={11} className="text-green-500 flex-shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm font-semibold text-red-800 mb-2">KI-Bilder zeigen oft:</p>
              <ul className="space-y-1">
                {['Glasige, zu glatte oder wächserne Haut', 'Unscharfe oder verschwommene Haarkanten', 'Artefakte bei Zähnen, Augen oder Ohren', 'Verwischter Übergang Gesicht/Hintergrund'].map((i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-red-600">
                    <XCircle size={11} className="text-red-500 flex-shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider label="Training" />

      {/* ── TRAININGSMODULE ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Trainingsmodule</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              Vier Module mit konkreten Lerninhalten — von der visuellen Erkennung bis zu rechtlichen Meldewegen.
            </p>
          </div>
          <TrainingAccordion />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-5 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen size={18} className="text-yellow-700" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Phishing-Simulation — Konzept</h3>
              <p className="text-sm text-yellow-800 leading-relaxed">
                Eine vollständige Enterprise-Lösung würde kontrollierte Deepfake-Angriffssimulationen beinhalten:
                Mitarbeitende erhalten unangemeldete Deepfake-Calls oder Voice-Clone-Nachrichten — im sicheren Rahmen,
                mit anschließendem Debrief und personalisierten Lernempfehlungen.
                <strong className="block mt-1.5">
                  Dies ist ein Konzept-Mockup. Im Produktivbetrieb würde dies eine eigene Backend-Infrastruktur erfordern.
                </strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}