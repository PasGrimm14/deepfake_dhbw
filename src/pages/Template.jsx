/**
 * TEMPLATE PAGE — Blank Page Scaffold
 *
 * This file is a starting point for new pages in this project.
 * Each section is clearly marked with comments.
 * Duplicate this file, rename the component, add your route in App.jsx.
 *
 * Quick start:
 *   1. Copy this file to src/pages/MeineSeite.jsx
 *   2. Rename the export default function
 *   3. Add a <Route path="/meine-seite" element={<MeineSeite />} /> in App.jsx
 *   4. Add a link in NavBar navLinks array
 *   5. Replace placeholder content below
 */

import { motion } from 'framer-motion'
import { Star, Zap, Shield, ArrowRight, Image, LayoutGrid } from 'lucide-react'
import PageHero from '../components/PageHero'
import InfoCard from '../components/InfoCard'
import SectionDivider from '../components/SectionDivider'
import { Link } from 'react-router-dom'

// ─── Page-level animation (copy this to every new page) ─────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

// ─── Feature card data — replace with your content ──────────────────────────
const featureCards = [
  {
    icon: Star,
    title: 'Feature 1',
    description: 'Beschreibe hier das erste Feature deiner Seite. Was macht es besonders?',
  },
  {
    icon: Zap,
    title: 'Feature 2',
    description: 'Das zweite Kernfeature — kurz und prägnant, mit klarem Nutzen für den Leser.',
  },
  {
    icon: Shield,
    title: 'Feature 3',
    description: 'Das dritte Feature. Drei Karten bilden eine ausgewogene, symmetrische Darstellung.',
  },
]

export default function Template() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ─────────────────────────────────────────────────────────────────────
          TEMPLATE BANNER — sichtbarer Hinweis für Entwickler
          Entferne diesen Block, wenn die Seite fertig ist.
          ──────────────────────────────────────────────────────────────────── */}
      <div className="bg-yellow-400 border-b-2 border-yellow-500 py-3 px-4 text-center sticky top-16 z-40">
        <p className="text-sm font-bold text-yellow-900">
          🛠 Template Page — füge hier deine Inhalte ein. Datei: <code>src/pages/Template.jsx</code>
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 1: PAGE HERO
          Reusable hero component — edit title, subtitle and badge props.
          ──────────────────────────────────────────────────────────────────── */}
      <PageHero
        badge="Kategorie / Badge"
        title="Dein Seitentitel hier"
        subtitle="Ein prägnanter Untertitel, der erklärt was diese Seite bietet und warum sie relevant ist. Maximal 2 Sätze."
      >
        {/* Optional: CTA buttons inside the hero */}
        <div className="flex flex-wrap gap-3 mt-2">
          <Link to="/" className="btn-primary">
            Primärer CTA
            <ArrowRight size={16} />
          </Link>
          <Link to="/" className="btn-secondary">
            Sekundärer CTA
          </Link>
        </div>
      </PageHero>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 2: 3-COLUMN FEATURE CARD GRID
          InfoCard accepts: icon, title, description, accent (bool)
          ──────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="section-title">Abschnittstitel</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Kurze Beschreibung dieses Abschnitts — was erwartet den Leser hier?
            </p>
          </div>

          {/* Grid — change grid-cols count to adjust columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Remove the Link wrapper if you don't need clickable cards */}
                <InfoCard icon={card.icon} title={card.title} description={card.description} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual divider — optional between sections */}
      <SectionDivider />

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 3: FULL-WIDTH CONTENT — Left Image / Right Text
          Replace the placeholder div with an <img> or illustration.
          ──────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Image / Illustration placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-100 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center border border-gray-200"
            >
              <Image size={48} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-400 font-medium">Bild / Illustration</p>
              <p className="text-xs text-gray-300 mt-1">Ersetze diesen Block durch ein &lt;img&gt; Tag</p>
            </motion.div>

            {/* Right: Text content */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Optional badge above heading */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
                <LayoutGrid size={11} />
                Abschnitt-Label
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Überschrift dieses Inhaltsblocks
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Erster Absatz — Einleitung in das Thema. Erkläre den Kontext und warum dieser Inhalt relevant ist
                für den Leser. Halte es prägnant und fokussiert.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Zweiter Absatz — Vertiefung. Füge hier die Kernaussage hinzu, unterstützt durch
                konkrete Details, Daten oder Beispiele.
              </p>

              {/* Bullet list */}
              <ul className="space-y-2.5 mb-7">
                {[
                  'Erster wichtiger Punkt mit konkretem Nutzen',
                  'Zweiter Punkt — kurz und klar formuliert',
                  'Dritter Punkt — schließt die Liste sinnvoll ab',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link to="/" className="btn-primary">
                CTA Button
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 4: CTA BANNER
          Full-width call-to-action at the bottom of the page.
          Change the bg color class (bg-red-600, bg-gray-900, etc.) as needed.
          ──────────────────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            CTA-Überschrift — Was soll der Leser jetzt tun?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg mb-8 max-w-xl mx-auto"
          >
            Kurze Begründung, warum jetzt der richtige Moment ist zu handeln.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {/* Primary CTA */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg"
            >
              <Zap size={17} />
              Primärer CTA
            </Link>
            {/* Secondary CTA */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-700 transition-colors"
            >
              Sekundärer CTA
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

    </motion.div>
  )
}
