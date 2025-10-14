import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSitemap, 
  faGamepad, 
  faArrowRight,
  faStar,
  faCheck,
  faArrowLeft,
  faTimes,
  faSearchPlus
} from '@fortawesome/free-solid-svg-icons'
import OrganizationalChart from './OrganizationalChart'
import HierarchyDragDrop from './HierarchyDragDrop'

const HierarchyLevel = ({ onComplete }) => {
  const navigate = useNavigate()
  const [currentPhase, setCurrentPhase] = useState('official') // 'official', 'chart' o 'challenge'
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imgStart, setImgStart] = useState({ x: 0, y: 0 })

  // Modal zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5))
  const handleCloseModal = () => {
    setShowImageModal(false)
    setZoom(1)
    setImgOffset({ x: 0, y: 0 })
  }

  // Drag handlers for image
  const handleImgMouseDown = (e) => {
    if (zoom <= 1) return
    e.preventDefault()
    setDragging(true)
    setDragStart({
      x: e.type === 'touchstart' ? e.touches[0].clientX : e.clientX,
      y: e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
    })
    setImgStart(imgOffset)
  }
  const handleImgMouseMove = (e) => {
    if (!dragging) return
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
    setImgOffset({
      x: imgStart.x + (clientX - dragStart.x),
      y: imgStart.y + (clientY - dragStart.y)
    })
  }
  const handleImgMouseUp = () => {
    setDragging(false)
  }

  // Generar estrellas animadas para el fondo solo una vez
  const starsRef = useRef(null)
  if (!starsRef.current) {
    starsRef.current = Array.from({ length: 50 }, (_, i) => {
      const left = `${Math.random() * 100}%`
      const top = `${Math.random() * 100}%`
      const duration = 2 + Math.random() * 2
      const delay = Math.random() * 2
      return (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-70"
          style={{ left, top }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.5, 1, 0.5] }}
          transition={{ duration, repeat: Infinity, delay }}
        />
      )
    })
  }

  const handleChallengeComplete = () => {
    setChallengeCompleted(true)
    setTimeout(() => {
      onComplete && onComplete()
    }, 3000)
  }

  const handlePhaseChange = (phase) => {
    setCurrentPhase(phase)
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Estrellas animadas de fondo (persistentes) */}
      <div className="absolute inset-0 overflow-hidden">
        {starsRef.current}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                type="button"
                onClick={() => navigate('/map')}
                className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors px-4 py-2 rounded-lg"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Volver al mapa</span>
              </button>
            </motion.div>
            <div className="flex items-center justify-center space-x-4">
              <FontAwesomeIcon icon={faSitemap} className="text-4xl text-white" />
              <h1 className="text-4xl font-bold text-white">
                Jerarquía y Estructura Organizacional
              </h1>
            </div>
            <div className="w-24"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center mt-4">
            Explora nuestra estructura organizacional de forma interactiva y pon a prueba tus conocimientos
          </p>
        </motion.div>

        {/* Navegación de fases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}
        >
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-2 flex space-x-2">
            <button
              onClick={() => handlePhaseChange('official')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                currentPhase === 'official'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              <FontAwesomeIcon icon={faSitemap} />
              <span>Organigrama oficial</span>
            </button>
            <button
              onClick={() => handlePhaseChange('chart')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                currentPhase === 'chart'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              <FontAwesomeIcon icon={faSitemap} />
              <span>Organigrama Interactivo</span>
            </button>
            
            <button
              onClick={() => handlePhaseChange('challenge')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                currentPhase === 'challenge'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              <FontAwesomeIcon icon={faGamepad} />
              <span>Desafío Drag & Drop</span>
              {challengeCompleted && (
                <FontAwesomeIcon icon={faCheck} className="text-green-500" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Contenido de las fases */}
        <AnimatePresence mode="wait">
          {currentPhase === 'official' && (
            <motion.div
              key="official"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Organigrama oficial</h2>
                <motion.div 
                  className="relative inline-block group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{ maxHeight: '500px' }}
                >
                  <img
                    src="/img/Imagen2organigrama.jpg"
                    alt="Organigrama oficial de la empresa"
                    className="mx-auto rounded-2xl shadow-2xl max-w-full h-auto cursor-pointer border-4 border-white/20 group-hover:border-white/40 transition-all duration-300"
                    style={{ maxHeight: '500px' }}
                    onClick={() => setShowImageModal(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-purple-900 px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                    <FontAwesomeIcon icon={faSearchPlus} className="mr-2" />
                    Hacer zoom
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
      {/* Modal para imagen fullscreen y zoom */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          style={{ cursor: 'zoom-out' }}
          onClick={handleCloseModal}
          onMouseMove={handleImgMouseMove}
          onMouseUp={handleImgMouseUp}
          onMouseLeave={handleImgMouseUp}
          onTouchMove={handleImgMouseMove}
          onTouchEnd={handleImgMouseUp}
        >
          <div
            className="relative flex flex-col items-center justify-center"
            style={{ maxHeight: '90vh', maxWidth: '95vw' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Botones flotantes verticales en la esquina superior derecha */}
            <div className="fixed top-6 right-8 z-50 flex flex-col gap-3 bg-black/40 rounded-xl p-2 backdrop-blur-sm shadow-lg">
              <button
                onClick={handleZoomIn}
                className="bg-white/80 hover:bg-white text-purple-900 font-bold py-2 px-4 rounded-lg shadow"
                style={{ fontSize: '1.5rem' }}
                aria-label="Acercar"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-white/80 hover:bg-white text-purple-900 font-bold py-2 px-4 rounded-lg shadow"
                style={{ fontSize: '1.5rem' }}
                aria-label="Alejar"
              >
                -
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg shadow flex items-center justify-center"
                style={{ fontSize: '1.2rem' }}
                aria-label="Cerrar"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <img
              src="/img/Imagen2organigrama.jpg"
              alt="Organigrama oficial de la empresa"
              style={{
                transform: `scale(${zoom}) translate(${imgOffset.x / zoom}px, ${imgOffset.y / zoom}px)`,
                maxHeight: '80vh',
                maxWidth: '90vw',
                transition: dragging ? 'none' : 'transform 0.2s',
                borderRadius: '1rem',
                boxShadow: '0 0 32px 8px rgba(0,0,0,0.5)',
                cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
                userSelect: 'none',
              }}
              className="select-none"
              draggable={false}
              onMouseDown={handleImgMouseDown}
              onTouchStart={handleImgMouseDown}
            />
            <span className="text-white/70 text-xs mt-4">Haz clic fuera de la imagen o en "Cerrar" para salir</span>
          </div>
        </div>
      )}
          {currentPhase === 'chart' && (
            <motion.div
              key="chart"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <OrganizationalChart />
              </div>
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => handlePhaseChange('challenge')}
                    className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                    Continuar al Desafío
                  </button>
                </motion.button>
              </div>
            </motion.div>
          )}
          {currentPhase === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <HierarchyDragDrop onComplete={handleChallengeComplete} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de progreso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '1rem', padding: '1rem' }}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${currentPhase === 'official' ? 'bg-purple-400' : 'bg-gray-400'}`} />
            <div className={`w-3 h-3 rounded-full ${currentPhase === 'chart' ? 'bg-purple-400' : 'bg-gray-400'}`} />
            <div className={`w-3 h-3 rounded-full ${currentPhase === 'challenge' ? 'bg-purple-400' : challengeCompleted ? 'bg-green-400' : 'bg-gray-400'}`} />
          </div>
          <div className="text-white text-xs mt-2 text-center">
            {(currentPhase === 'chart' || currentPhase === 'official')
              ? 'Explorando'
              : challengeCompleted
                ? 'Completado'
                : 'Desafío'}
          </div>
        </motion.div>

        {/* Mensaje de finalización */}
        <AnimatePresence>
          {challengeCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                style={{ background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', width: '100%', margin: '0 1rem', textAlign: 'center' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ display: 'inline-block', marginBottom: '1rem' }}
                >
                  <FontAwesomeIcon icon={faStar} className="text-6xl text-yellow-500" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  ¡Nivel Completado!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Has dominado la estructura organizacional de Solutions & Payroll. 
                  ¡Excelente trabajo!
                </p>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg p-4">
                  <p className="font-semibold">
                    Preparándose para continuar...
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default HierarchyLevel