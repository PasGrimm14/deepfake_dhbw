import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import WasSindDeepfakes from './pages/WasSindDeepfakes'
import Angriffsvektoren from './pages/Angriffsvektoren'
import AwarenessPortal from './pages/AwarenessPortal'
import DeepfakeScanner from './pages/DeepfakeScanner'
import Schutzmassnahmen from './pages/Schutzmassnahmen'
import Praesentation from './pages/Praesentation'
import Template from './pages/Template'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/was-sind-deepfakes" element={<WasSindDeepfakes />} />
        <Route path="/angriffsvektoren" element={<Angriffsvektoren />} />
        <Route path="/awareness-portal" element={<AwarenessPortal />} />
        <Route path="/deepfake-scanner" element={<DeepfakeScanner />} />
        <Route path="/schutzmassnahmen" element={<Schutzmassnahmen />} />
        <Route path="/praesentation" element={<Praesentation />} />
        <Route path="/template" element={<Template />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
