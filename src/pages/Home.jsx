import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, AlertTriangle, Eye, Mic, Brain, ArrowRight,
  TrendingUp, Users, Globe, Zap
} from 'lucide-react'
import InfoCard from '../components/InfoCard'
import AnimatedCounter from '../components/AnimatedCounter'
import SectionDivider from '../components/SectionDivider'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

const stats = [
  { value: 3000, suffix: '%', label: 'Anstieg von Deepfake-Inhalten 2022–2023', prefix: '+' },
  { value: 25, suffix: 'M$', label: 'Verlust in einem einzelnen CEO-Fraud-Fall', prefix: '' },
  { value: 96, suffix: '%', label: 'Deepfakes sind non-konsensuelles Material', prefix: '' },
  { value: 500, suffix: 'M+', label: 'Generierte Deepfake-Videos im Umlauf (2024)', prefix: '' },
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
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-red-50/30" />
      {/* Animated orbs */}
      {[
        { size: 600, x: -100, y: -200, delay: 0 },
        { size: 400, x: '70%', y: -150, delay: 2 },
        { size: 300, x: '40%', y: '60%', delay: 4 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-red-600/5"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Grid lines */}
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
            DHBW Projekt — Aufklärungsportal 2024
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
            className="flex flex-wrap gap-3"
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
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
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
                Die Bedrohungslage 2024
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Deepfakes und Voice Cloning sind keine Science-Fiction mehr — sie werden täglich für Betrug,
                Desinformation und politische Manipulation eingesetzt. Die Technologie ist frei verfügbar,
                die Ergebnisse werden immer überzeugender.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'CEO Fraud mit geklonter Stimme: $25M Schaden in einem Fall',
                  'Gefälschte Nachrichten von Politikern verbreiten sich viral',
                  'KYC-Systeme werden mit Deepface-Angriffen umgangen',
                  'Privatpersonen werden Opfer non-konsensueller Fakes',
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

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: TrendingUp, label: 'Wachstum', value: '3.000%', sub: 'Deepfakes seit 2022' },
                { icon: AlertTriangle, label: 'Fälle', value: '500M+', sub: 'Videos im Umlauf' },
                { icon: Shield, label: 'Erkennungsrate', value: '~65%', sub: 'bei aktuellen KI-Tools' },
                { icon: Users, label: 'Betroffene', value: 'Millionen', sub: 'Privatpersonen weltweit' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="card text-center p-5"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <item.icon size={20} className="text-red-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-0.5">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.sub}</div>
                </div>
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
