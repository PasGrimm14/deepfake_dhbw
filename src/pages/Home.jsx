import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, AlertTriangle, Eye, Mic, Brain, ArrowRight,
  TrendingUp, Users, Globe, Zap, Play, Pause, Volume2
} from 'lucide-react'

// ─── Audio-Datei hier eintragen, sobald sie vorliegt ────────────────────────
// Datei in /public/audio/ ablegen, z.B. /public/audio/intro.mp3
// Dann diese Zeile ändern:
const INTRO_AUDIO_SRC = null // z.B. '/audio/intro.mp3'

function useAudioPlayer(src) {
  const audioRef = useRef(null)
  const [playing, setPlaying]     = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration]   = useState(0)
  const [ready, setReady]         = useState(false)

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audioRef.current = audio

    const onLoaded  = () => { setDuration(audio.duration); setReady(true) }
    const onTime    = () => setCurrentTime(audio.currentTime)
    const onEnded   = () => { setPlaying(false); setCurrentTime(0); audio.currentTime = 0 }

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [src])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const seek = (pct) => {
    if (!audioRef.current || !duration) return
    audioRef.current.currentTime = pct * duration
  }

  return { playing, currentTime, duration, ready, toggle, seek }
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

function IntroAudioPlayer() {
  const { playing, currentTime, duration, ready, toggle, seek } =
    useAudioPlayer(INTRO_AUDIO_SRC)
  const [expanded, setExpanded] = useState(false)

  const pct = duration > 0 ? currentTime / duration : 0

  const handleBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    seek((e.clientX - rect.left) / rect.width)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55 }}
      className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Play/Pause */}
      <button
        onClick={INTRO_AUDIO_SRC ? toggle : undefined}
        title={INTRO_AUDIO_SRC ? (playing ? 'Pause' : 'Intro abspielen') : 'Audio noch nicht verfügbar'}
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          INTRO_AUDIO_SRC
            ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {playing
          ? <Pause size={16} className="fill-white" />
          : <Play  size={16} className="fill-white ml-0.5" />
        }
      </button>

      {/* Label + Bar */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            {playing ? 'Intro läuft…' : 'Präsentations-Intro'}
          </span>
          {!INTRO_AUDIO_SRC && (
            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
              Audio folgt
            </span>
          )}
          {INTRO_AUDIO_SRC && playing && (
            <span className="flex gap-0.5 items-end h-3">
              {[0.4, 1, 0.6, 0.9, 0.5].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-0.5 bg-red-500 rounded-full"
                  animate={{ scaleY: [h, 1, h * 0.7, 1, h] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                  style={{ height: '100%', transformOrigin: 'bottom' }}
                />
              ))}
            </span>
          )}
        </div>

        {/* Fortschrittsbalken */}
        <div className="flex items-center gap-2">
          <div
            className={`relative h-1.5 rounded-full bg-gray-200 w-32 sm:w-48 ${INTRO_AUDIO_SRC ? 'cursor-pointer' : ''}`}
            onClick={INTRO_AUDIO_SRC ? handleBarClick : undefined}
          >
            <motion.div
              className="absolute left-0 top-0 h-full bg-red-500 rounded-full"
              style={{ width: `${pct * 100}%` }}
            />
            {INTRO_AUDIO_SRC && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-600 rounded-full shadow -ml-1"
                style={{ left: `${pct * 100}%` }}
              />
            )}
          </div>
          <span className="text-[10px] text-gray-400 font-mono tabular-nums whitespace-nowrap">
            {INTRO_AUDIO_SRC
              ? `${formatTime(currentTime)} / ${formatTime(duration)}`
              : '0:00 / –:––'
            }
          </span>
        </div>
      </div>

      <Volume2 size={14} className="text-gray-300 flex-shrink-0 hidden sm:block" />
    </motion.div>
  )
}
import InfoCard from '../components/InfoCard'
import AnimatedCounter from '../components/AnimatedCounter'
import SectionDivider from '../components/SectionDivider'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

const stats = [
  { value: 900,  suffix: '%',   label: 'Jährliches Wachstum an Deepfake-Videos', prefix: '+' },
  { value: 25,   suffix: 'M$',  label: 'Verlust in einem einzelnen CEO-Fraud-Fall', prefix: '' },
  { value: 96,   suffix: '%',   label: 'Deepfakes sind non-konsensuelles Material', prefix: '' },
  { value: 8,    suffix: 'Mio+',label: 'Deepfakes im Umlauf — Prognose 2025', prefix: '' },
]

const features = [
  {
    icon: Eye,
    title: 'Was sind Deepfakes?',
    description: 'Verstehe die Technologie hinter KI-generierten Fakes — von GANs bis Diffusion Models.',
    to: '/was-sind-deepfakes',
  },
  {
    icon: AlertTriangle,
    title: 'Reale Angriffsvektoren',
    description: 'Entdecke dokumentierte Fälle: CEO Fraud, politische Manipulation und Identitätsdiebstahl.',
    to: '/angriffsvektoren',
  },
  {
    icon: Brain,
    title: 'Awareness Portal',
    description: 'Teste dein Wissen im interaktiven Quiz und lerne Deepfakes zu erkennen.',
    to: '/awareness-portal',
  },
  {
    icon: Shield,
    title: 'Deepfake Scanner',
    description: 'Lade ein Bild hoch — Claude analysiert es auf KI-generierte Artefakte.',
    to: '/deepfake-scanner',
  },
  {
    icon: Users,
    title: 'Schutzmaßnahmen',
    description: 'Konkrete Checklisten für Privatpersonen, Unternehmen und Organisationen.',
    to: '/schutzmassnahmen',
  },
  {
    icon: Mic,
    title: 'Voice Cloning',
    description: 'Erfahre, wie synthetische Stimmen erzeugt werden und welche Risiken sie bergen.',
    to: '/was-sind-deepfakes',
  },
]

// Animated particle/orb background
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-red-50/30" />
      {[
        { size: 600, x: -100, y: -200, delay: 0 },
        { size: 400, x: '70%', y: -150, delay: 2 },
        { size: 300, x: '40%', y: '60%', delay: 4 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-red-600/5"
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #111 1px, transparent 1px),
            linear-gradient(to bottom, #111 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  )
}

// Stat card für die Bedrohungslage-Sektion
const threatCards = [
  {
    icon: TrendingUp,
    label: 'Jährliches Wachstum',
    value: 900,
    suffix: '%',
    sub: 'mehr Deepfake-Videos pro Jahr',
    trend: '+900 % p.a.',
    src: 'Deloitte / Sumsub 2024',
    accent: true,
  },
  {
    icon: AlertTriangle,
    label: 'Schadensprognose USA',
    value: 40,
    prefix: '$',
    suffix: 'Mrd.',
    sub: 'KI-Betrugsschäden bis 2027',
    trend: '+32 % p.a.',
    src: 'Deloitte 2024',
    accent: false,
  },
  {
    icon: Shield,
    label: 'Ø Unternehmensschaden',
    value: 500,
    prefix: '$',
    suffix: 'K',
    sub: 'pro Deepfake-Vorfall 2024',
    trend: 'bis $680K',
    src: 'Medius / Eftsure 2024',
    accent: false,
  },
  {
    icon: Users,
    label: 'Betroffene Firmen',
    value: 50,
    suffix: '%',
    sub: 'US/UK-Firmen mit Deepfake-Angriffen',
    trend: '43 % erfolgreich',
    src: 'Medius 2024',
    accent: false,
  },
]

export default function Home() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <HeroBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-6"
          >
            <Zap size={11} className="fill-red-600" />
            DHBW Projekt - Aufklärungsportal 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-[1.08] mb-6 max-w-3xl"
          >
            <span className="block">Deepfakes &</span>
            <span className="block text-red-600">Voice Cloning</span>
            <span className="block text-gray-400 font-light text-3xl sm:text-4xl md:text-5xl mt-2">
              Erkennen. Verstehen. Schützen.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed mb-8"
          >
            KI-generierte Fälschungen sind zur größten Bedrohung der digitalen Informationslandschaft geworden.
            Dieses Portal klärt auf — mit interaktiven Tools, realen Fallbeispielen und konkreten Schutzmaßnahmen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            <Link to="/was-sind-deepfakes" className="btn-primary">
              Jetzt informieren
              <ArrowRight size={16} />
            </Link>
            <Link to="/deepfake-scanner" className="btn-secondary">
              <Shield size={16} />
              Scanner testen
            </Link>
            <Link to="/awareness-portal" className="btn-secondary">
              <Brain size={16} />
              Quiz starten
            </Link>
          </motion.div>

          <IntroAudioPlayer />

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-gray-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-red-400 mb-2">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <p className="text-xs sm:text-sm text-gray-400 leading-snug">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              Was dich erwartet
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="section-subtitle max-w-xl mx-auto"
            >
              Sechs Module — von der technischen Erklärung bis zum KI-gestützten Scanner.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={f.to} className="block h-full group">
                  <InfoCard
                    icon={f.icon}
                    title={f.title}
                    description={f.description}
                    className="h-full group-hover:border-red-200 group-hover:shadow-md"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREAT LANDSCAPE ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
                <Globe size={11} />
                Globale Bedrohung
              </div>
              <h2 className="section-title">
                Die Bedrohungslage 2025
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Deepfakes und Voice Cloning sind keine Science-Fiction mehr — sie werden täglich
                für Betrug, Desinformation und politische Manipulation eingesetzt. Allein in
                Nordamerika stiegen Deepfake-Betrugsschäden 2025 auf über $200 Mio. im ersten
                Quartal.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'CEO Fraud mit geklonter Stimme: $25M Schaden in einem einzigen Fall',
                  '400 Unternehmen pro Tag werden mit Deepfake-CEO-Betrug angegriffen',
                  'KYC-Systeme werden mit synthetischen Gesichtern systematisch umgangen',
                  'Privatpersonen werden Opfer non-konsensueller KI-Fakes',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/angriffsvektoren" className="btn-primary">
                Alle Angriffsvektoren
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Right: Stat cards */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {threatCards.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative rounded-2xl border p-5 overflow-hidden flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                    item.accent
                      ? 'bg-red-600 border-red-600'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Icon + Trend-Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.accent ? 'bg-white/20' : 'bg-red-50'
                    }`}>
                      <item.icon size={18} className={item.accent ? 'text-white' : 'text-red-600'} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      item.accent
                        ? 'bg-white/20 text-white'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {item.trend}
                    </span>
                  </div>

                  {/* Value */}
                  <div>
                    <div className={`text-2xl font-bold leading-none mb-1 ${
                      item.accent ? 'text-white' : 'text-gray-900'
                    }`}>
                      <AnimatedCounter
                        value={item.value}
                        prefix={item.prefix ?? ''}
                        suffix={item.suffix ?? ''}
                      />
                    </div>
                    <p className={`text-xs leading-snug ${
                      item.accent ? 'text-red-100' : 'text-gray-500'
                    }`}>
                      {item.sub}
                    </p>
                  </div>

                  {/* Label + Quelle */}
                  <div className={`mt-auto pt-3 border-t flex items-end justify-between gap-2 ${
                    item.accent ? 'border-white/20' : 'border-gray-100'
                  }`}>
                    <span className={`text-xs font-semibold leading-tight ${
                      item.accent ? 'text-red-100' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </span>
                    <span className={`text-[10px] leading-tight text-right shrink-0 ${
                      item.accent ? 'text-white/50' : 'text-gray-300'
                    }`}>
                      {item.src}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="bg-red-600 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Teste jetzt den KI-Scanner
          </motion.h2>
          <p className="text-red-100 text-lg mb-8 max-w-xl mx-auto">
            Lade ein Bild hoch und lass Claude analysieren, ob es sich um ein Deepfake handeln könnte.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/deepfake-scanner"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors shadow-lg"
            >
              <Shield size={18} />
              Scanner öffnen
            </Link>
            <Link
              to="/schutzmassnahmen"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors"
            >
              Schutzmaßnahmen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </motion.div>
  )
}