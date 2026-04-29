import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Shield, AlertTriangle, CheckCircle, XCircle,
  Key, Eye, EyeOff, Info, Loader2, RotateCcw, ImageIcon
} from 'lucide-react'
import PageHero from '../components/PageHero'
import RiskBadge from '../components/RiskBadge'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

const SYSTEM_PROMPT = `Du bist ein Deepfake-Erkennungsspezialist. Analysiere das bereitgestellte Bild auf Anzeichen, dass es KI-generiert oder manipuliert (Deepfake) sein könnte.

Antworte NUR mit einem gültigen JSON-Objekt in exakt diesem Format:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "confidenceScore": <Zahl 0-100>,
  "isLikelyDeepfake": <boolean>,
  "detectedAnomalies": [<string auf Deutsch>, ...],
  "artifactDetails": [<string auf Deutsch>, ...],
  "recommendation": "<string auf Deutsch>",
  "summary": "<string auf Deutsch, 1-2 Sätze>"
}

Analyserichtlinien:
- Prüfe auf: unnatürliche Hauttextur (zu glatt/wächsern), inkonsistente Beleuchtung zwischen Gesicht und Hintergrund, unscharfe oder verschwommene Haarkanten, asymmetrische Gesichtszüge, unnatürliche Lichtreflexe in den Augen, Artefakte an Gesichtsrändern, übermäßig geglättete oder plastisch wirkende Haut
- riskLevel: LOW = natürliches Foto ohne KI-Anzeichen, MEDIUM = einige verdächtige Elemente, HIGH = eindeutige KI-Generierungsartefakte
- confidenceScore: Wie sicher bist du, dass es sich um ein Deepfake handelt (0 = definitiv echt, 100 = definitiv KI-generiert)
- detectedAnomalies: Liste konkrete Beobachtungen auf Deutsch (leeres Array wenn keine)
- artifactDetails: Technische Details zu erkannten Problemen auf Deutsch (leeres Array wenn keine)
- Sei spezifisch und technisch in deiner Analyse
- Falls das Bild kein Gesicht/keine Person zeigt, setze riskLevel auf LOW und weise darauf hin, dass keine Deepfake-Analyse möglich ist
- Alle Texte (summary, recommendation, detectedAnomalies, artifactDetails) MÜSSEN auf Deutsch sein`

async function analyzeImage(base64Image, mimeType, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: 'Analyze this image for deepfake indicators. Return only the JSON object.',
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Keine strukturierte Antwort erhalten')
  return JSON.parse(jsonMatch[0])
}

// Skeleton loader
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

// Result card
function AnalysisResult({ result, imageSrc }) {
  const riskColor = {
    LOW: 'text-green-700',
    MEDIUM: 'text-yellow-700',
    HIGH: 'text-red-700',
  }

  const scoreColor =
    result.confidenceScore >= 70
      ? 'bg-red-500'
      : result.confidenceScore >= 40
      ? 'bg-yellow-400'
      : 'bg-green-500'

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
              <RiskBadge level={result.riskLevel} size="lg" />
            </div>
            <p className={`text-sm font-semibold ${riskColor[result.riskLevel]}`}>
              {result.isLikelyDeepfake
                ? 'Verdächtig — mögliche KI-Manipulation erkannt'
                : 'Keine eindeutigen Deepfake-Merkmale erkannt'}
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mb-1">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
            <span>KI-Generierungs-Wahrscheinlichkeit</span>
            <span className="font-bold text-gray-900">{result.confidenceScore}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.confidenceScore}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-2.5 rounded-full ${scoreColor}`}
            />
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{result.summary}</p>
      </div>

      {/* Anomalies */}
      {result.detectedAnomalies?.length > 0 && (
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            Erkannte Anomalien
          </h4>
          <ul className="space-y-2">
            {result.detectedAnomalies.map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <XCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Artifact details */}
      {result.artifactDetails?.length > 0 && (
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Info size={16} className="text-blue-500" />
            Technische Details
          </h4>
          <ul className="space-y-2">
            {result.artifactDetails.map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {result.recommendation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-1.5">
            <CheckCircle size={14} />
            Empfehlung
          </p>
          <p className="text-sm text-blue-700">{result.recommendation}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-600">Disclaimer:</strong> Dies ist eine KI-gestützte Analyse und kein definitives forensisches Gutachten.
          Claude analysiert visuelle Muster — eine abschließende Beurteilung erfordert spezialisierte Forensik-Software und menschliche Expertise.
          Dieses Tool dient ausschließlich zur Aufklärung und ersten Einschätzung.
        </p>
      </div>
    </motion.div>
  )
}

export default function DeepfakeScanner() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('df_api_key') || import.meta.env.VITE_ANTHROPIC_API_KEY || '')
  const [showKey, setShowKey] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [imageData, setImageData] = useState(null) // { base64, mimeType, src }
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const saveKey = (val) => {
    setApiKey(val)
    if (val) localStorage.setItem('df_api_key', val)
    else localStorage.removeItem('df_api_key')
  }

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Bitte nur Bilddateien (JPG, PNG, WebP, GIF) hochladen.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Bild ist zu groß (max. 5 MB).')
      return
    }
    setError(null)
    setResult(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      const base64 = dataUrl.split(',')[1]
      setImageData({ base64, mimeType: file.type, src: dataUrl })
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(false)
      processFile(e.dataTransfer.files?.[0])
    },
    [processFile]
  )

  const handleAnalyze = async () => {
    if (!imageData) return
    if (!apiKey.trim()) {
      setError('Bitte API-Key eingeben.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await analyzeImage(imageData.base64, imageData.mimeType, apiKey.trim())
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
        subtitle="Lade ein Bild hoch — Claude analysiert es auf KI-generierte Artefakte und gibt eine strukturierte Einschätzung zurück."
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Upload + API Key */}
            <div className="space-y-5">
              {/* API Key */}
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Key size={16} className="text-gray-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">Anthropic API Key</h3>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => saveKey(e.target.value)}
                    placeholder="sk-ant-api..."
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 font-mono"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Wird nur in deinem Browser (localStorage) gespeichert — niemals an Dritte weitergegeben.
                  Nur Anfragen an api.anthropic.com werden gesendet.
                </p>
              </div>

              {/* Upload area */}
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
                  <p className="text-xs text-gray-400">JPG, PNG, WebP — max. 5 MB</p>
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
                      <p className="text-xs text-gray-400 mb-3">{imageData.mimeType}</p>
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

              {/* Error */}
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

              {/* Analyze button */}
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
                    Claude analysiert…
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Bild analysieren
                  </>
                )}
              </button>

              {/* How it works */}
              <div className="card bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Wie funktioniert es?</h4>
                <ol className="space-y-2">
                  {[
                    'Bild wird clientseitig in Base64 kodiert (verlässt deinen Browser nicht)',
                    'Claude (claude-sonnet-4-20250514) analysiert das Bild auf typische Deepfake-Artefakte',
                    'Strukturiertes JSON-Ergebnis: Risk Level, Confidence Score, Anomalien',
                    'Ergebnis wird im Browser angezeigt — keine Serverkomponente benötigt',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                      <span className="w-4 h-4 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right: Results */}
            <div>
              {loading && <AnalysisSkeleton />}

              {!loading && !result && !error && (
                <div className="card h-full flex flex-col items-center justify-center text-center py-16 bg-white">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Shield size={28} className="text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-600 mb-2">Bereit zur Analyse</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Lade ein Bild hoch und starte die Analyse. Das Ergebnis erscheint hier.
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
