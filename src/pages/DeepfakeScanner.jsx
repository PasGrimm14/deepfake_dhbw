import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Shield, AlertTriangle, CheckCircle, XCircle,
  Loader2, RotateCcw, ImageIcon, Info, ScanLine,
  Eye, Zap, FileImage
} from 'lucide-react'
import PageHero from '../components/PageHero'
import RiskBadge from '../components/RiskBadge'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

const API_BASE = import.meta.env.VITE_SCANNER_API_URL || 'http://localhost:8000'

// ── API Call ────────────────────────────────────────────────────────────────

async function analyzeImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/api/scan/image`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `API Fehler ${res.status}`)
  }

  return res.json()
}

// ── Mapping API → RiskBadge ──────────────────────────────────────────────────

function toRiskLevel(fakeProb) {
  if (fakeProb >= 0.7) return 'HIGH'
  if (fakeProb >= 0.4) return 'MEDIUM'
  return 'LOW'
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function AnalysisSkeleton() {
  return (
    <div className="card animate-pulse space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        <div>
          <div className="w-40 h-4 bg-gray-200 rounded mb-1.5" />
          <div className="w-24 h-3 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-4/5" />
      <div className="h-3 bg-gray-100 rounded w-3/5" />
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// ── Result ───────────────────────────────────────────────────────────────────

function AnalysisResult({ result, imageSrc }) {
  const riskLevel = toRiskLevel(result.fake_probability)
  const scorePercent = Math.round(result.fake_probability * 100)

  const scoreColor =
    scorePercent >= 70 ? 'bg-red-500'
    : scorePercent >= 40 ? 'bg-yellow-400'
    : 'bg-green-500'

  const riskColor = {
    LOW: 'text-green-700',
    MEDIUM: 'text-yellow-700',
    HIGH: 'text-red-700',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="card">
        <div className="flex items-start gap-4 mb-4">
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Analysiertes Bild"
              className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">Analyseergebnis</h3>
              <RiskBadge level={riskLevel} size="lg" />
            </div>
            <p className={`text-sm font-semibold ${riskColor[riskLevel]}`}>
              {result.verdict === 'FAKE'
                ? 'Verdächtig — mögliche KI-Manipulation erkannt'
                : 'Keine eindeutigen Deepfake-Merkmale erkannt'}
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mb-1">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
            <span>KI-Generierungs-Wahrscheinlichkeit</span>
            <span className="font-bold text-gray-900">{scorePercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePercent}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-2.5 rounded-full ${scoreColor}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">
            Konfidenz: {Math.round(result.confidence * 100)}% · {result.processing_time_ms}ms
          </p>
          {result.verdict === 'FAKE'
            ? <XCircle size={16} className="text-red-500" />
            : <CheckCircle size={16} className="text-green-500" />
          }
        </div>
      </div>

      {/* Heatmap – Herzstück: woran hat das Modell erkannt */}
      {result.details?.heatmap_base64 && (
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Eye size={16} className="text-red-500" />
            Worauf das Modell reagiert hat
          </h4>
          <p className="text-xs text-gray-500 mb-3">
            Rot markierte Bereiche haben die Entscheidung am stärksten beeinflusst.
          </p>
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            <img
              src={`data:image/png;base64,${result.details.heatmap_base64}`}
              alt="Heatmap"
              className="w-full object-contain max-h-72"
            />
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 py-1.5 bg-gradient-to-t from-black/60 to-transparent text-xs text-white">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
                unauffällig
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                verdächtig
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Verdächtige Regionen */}
      {result.details?.suspicious_regions?.length > 0 && (
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            Auffällige Gesichtsbereiche
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.details.suspicious_regions.map((region) => (
              <span
                key={region}
                className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"
              >
                {region}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technische Details */}
      <div className="card bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Info size={14} className="text-gray-400" />
          Technische Details
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Modell', value: 'EfficientNet-B4' },
            { label: 'Trainiert auf', value: 'Celeb-DF v2' },
            { label: 'Fake-Prob.', value: `${(result.fake_probability * 100).toFixed(1)}%` },
            { label: 'Verarbeitungszeit', value: `${result.processing_time_ms}ms` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Hauptkomponente ──────────────────────────────────────────────────────────

export default function DeepfakeScanner() {
  const [imageData, setImageData] = useState(null)   // { file, src }
  const [dragging, setDragging]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState(null)
  const fileRef = useRef(null)

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Bitte nur Bilddateien hochladen (JPG, PNG, WebP).')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Datei zu groß. Maximum: 50 MB.')
      return
    }
    const src = URL.createObjectURL(file)
    setImageData({ file, src })
    setResult(null)
    setError(null)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files?.[0])
  }, [processFile])

  const handleAnalyze = async () => {
    if (!imageData) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await analyzeImage(imageData.file)
      setResult(res)
    } catch (err) {
      setError(`Fehler bei der Analyse: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setImageData(null)
    setResult(null)
    setError(null)
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHero
        badge="KI-Tool"
        title="Deepfake Scanner"
        subtitle="Lade ein Bild hoch — unser trainiertes Modell analysiert es auf KI-generierte Artefakte und zeigt dir genau, welche Bereiche verdächtig sind."
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ── Links: Upload ── */}
            <div className="space-y-5">

              {/* Upload-Zone */}
              {!imageData ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
                    dragging
                      ? 'border-red-400 bg-red-50 scale-[1.01]'
                      : 'border-gray-300 bg-white hover:border-red-300 hover:bg-red-50/30'
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => processFile(e.target.files?.[0])}
                  />
                  <Upload
                    size={36}
                    className={`mx-auto mb-3 ${dragging ? 'text-red-500' : 'text-gray-400'}`}
                  />
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Bild hier ablegen oder klicken
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG, WebP — max. 50 MB</p>
                </div>
              ) : (
                <div className="card">
                  <div className="flex items-start gap-4">
                    <img
                      src={imageData.src}
                      alt="Vorschau"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <ImageIcon size={14} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Bild geladen</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{imageData.file.name}</p>
                      <button
                        onClick={reset}
                        className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw size={11} />
                        Anderes Bild wählen
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Fehler */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {/* Analyse-Button */}
              <button
                onClick={handleAnalyze}
                disabled={!imageData || loading}
                className={`btn-primary w-full justify-center text-base py-3.5 ${
                  !imageData || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Modell analysiert…
                  </>
                ) : (
                  <>
                    <ScanLine size={18} />
                    Bild analysieren
                  </>
                )}
              </button>

              {/* Wie funktioniert es */}
              <div className="card bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Wie funktioniert es?</h4>
                <ol className="space-y-2">
                  {[
                    { icon: FileImage, text: 'Bild wird sicher an unseren Server übertragen' },
                    { icon: Zap,       text: 'EfficientNet-B4 Modell analysiert Gesichtsartefakte (trainiert auf Celeb-DF v2)' },
                    { icon: Eye,       text: 'Occlusion-Heatmap zeigt welche Regionen die Entscheidung beeinflusst haben' },
                    { icon: Shield,    text: 'Ergebnis: Fake-Wahrscheinlichkeit, Risk Level, verdächtige Bereiche' },
                  ].map(({ icon: Icon, text }, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                      <span className="w-4 h-4 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {text}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Hinweis */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-xs text-yellow-800 flex items-start gap-2">
                  <Info size={13} className="flex-shrink-0 mt-0.5" />
                  Dieses Tool dient zur Aufklärung. Kein automatisches System erkennt Deepfakes mit 100% Sicherheit — nutze das Ergebnis als Hinweis, nicht als Beweis.
                </p>
              </div>
            </div>

            {/* ── Rechts: Ergebnis ── */}
            <div>
              {loading && <AnalysisSkeleton />}

              {!loading && !result && !error && (
                <div className="card h-full flex flex-col items-center justify-center text-center py-16 bg-white">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Shield size={28} className="text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-600 mb-2">Bereit zur Analyse</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Lade ein Bild hoch und starte die Analyse. Das Ergebnis mit Heatmap erscheint hier.
                  </p>
                </div>
              )}

              <AnimatePresence>
                {result && !loading && (
                  <AnalysisResult result={result} imageSrc={imageData?.src} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
