import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBookOpen, 
  faArrowLeft, 
  faArrowRight, 
  faCheckCircle, 
  faPlayCircle, 
  faEye,
  faClock,
  faUserTie,
  faShieldAlt,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import PoliciesQuiz from './PoliciesQuiz'
import { useAppContext } from '../context/AppContext'

const PoliciesLevel = ({ level, onStartQuiz }) => {
  const navigate = useNavigate()
  const { completeLevel, completedLevels } = useAppContext()
  const [currentPolicyIndex, setCurrentPolicyIndex] = useState(0)
  const [readPolicies, setReadPolicies] = useState(new Set())
  const [flippedCard, setFlippedCard] = useState(null)
  const [stars, setStars] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)

  // Generar estrellas solo una vez al montar el componente
  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
    setStars(generatedStars)
  }, [])

  // Funciones para manejar las políticas
  const handlePolicyRead = (policyId) => {
    setReadPolicies(prev => new Set([...prev, policyId]))
  }

  const handleFlipCard = (policyId) => {
    setFlippedCard(flippedCard === policyId ? null : policyId)
  }

  const handleNextPolicy = () => {
    if (currentPolicyIndex < level.policies.length - 1) {
      setCurrentPolicyIndex(currentPolicyIndex + 1)
      setFlippedCard(null)
    }
  }

  const handlePrevPolicy = () => {
    if (currentPolicyIndex > 0) {
      setCurrentPolicyIndex(currentPolicyIndex - 1)
      setFlippedCard(null)
    }
  }

  const getIconForPolicy = (iconName) => {
    const iconMap = {
      'clock': faClock,
      'user-tie': faUserTie,
      'shield-alt': faShieldAlt,
      'users': faUsers
    }
    return iconMap[iconName] || faBookOpen
  }

  const handleStartQuiz = () => {
    setShowQuiz(true)
  }

  const handleBackToPolicies = () => {
    setShowQuiz(false)
  }

  const handleQuizComplete = () => {
    // Completar el nivel 1 (políticas) cuando se termine el quiz
    completeLevel(1)
    
    // Navegar al Achievement después de un breve retraso, igual que en LevelContent
    setTimeout(() => {
      navigate('/achievement/1')
    }, 2000)
  }

  const handleNavigateToMap = () => {
    // Navegar directamente al mapa
    navigate('/map')
  }

  if (!level.policies) return null

  // Si se debe mostrar el quiz, renderizar el componente PoliciesQuiz
  if (showQuiz) {
    return (
      <PoliciesQuiz 
        level={level} 
        onComplete={handleQuizComplete}
        onBackToPolicies={handleBackToPolicies}
        onNavigateToMap={handleNavigateToMap}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Estrellas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Header de políticas */}
          <div className="text-center">
            <div className="flex items-center justify-between mb-6">
              <motion.button
                onClick={() => navigate('/map')}
                className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Volver al mapa</span>
              </motion.button>
              <div></div> {/* Spacer para centrar el título */}
            </div>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full shadow-2xl border border-white/20 mb-6"
            >
              <FontAwesomeIcon icon={faBookOpen} className="mr-3 text-2xl" />
              <span className="font-bold text-2xl">Políticas Empresariales</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 max-w-3xl mx-auto text-xl leading-relaxed"
            >
              Explora cada política de manera interactiva. Haz clic en las tarjetas para obtener más información y marca tu progreso.
            </motion.p>
          </div>

          {/* Indicador de progreso */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20">
              {level.policies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  className={`w-5 h-5 rounded-full transition-all duration-500 ${
                    readPolicies.has(policy.id) 
                      ? 'bg-green-400 shadow-lg shadow-green-400/50 ring-2 ring-green-300/50' 
                      : index === currentPolicyIndex 
                        ? 'bg-blue-400 shadow-lg shadow-blue-400/50 ring-2 ring-blue-300/50' 
                        : 'bg-white/30'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Carrusel de políticas */}
          <div className="relative max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPolicyIndex}
                initial={{ opacity: 0, x: 100, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: -15 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="perspective-1000"
              >
                {level.policies.map((policy, index) => {
                  if (index !== currentPolicyIndex) return null
                  
                  const isFlipped = flippedCard === policy.id
                  const isRead = readPolicies.has(policy.id)
                  
                  return (
                    <motion.div 
                      key={policy.id} 
                      className="relative"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Tarjeta principal con efecto 3D */}
                      <motion.div
                        className={`relative w-full h-[500px] cursor-pointer transform-style-preserve-3d transition-transform duration-700 ${
                          isFlipped ? 'rotate-y-180' : ''
                        }`}
                        onClick={() => handleFlipCard(policy.id)}
                        whileHover={{ scale: 1.02, y: -5 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Frente de la tarjeta */}
                        <div className={`absolute inset-0 w-full h-full backface-hidden rounded-3xl shadow-2xl bg-gradient-to-br ${policy.color} p-10 text-white border border-white/30`}>
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-8">
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 0.3, type: "spring" }}
                                >
                                  <FontAwesomeIcon 
                                    icon={getIconForPolicy(policy.icon)} 
                                    className="text-6xl opacity-90 drop-shadow-2xl" 
                                  />
                                </motion.div>
                                {/* Eliminado importance, solo icono */}
                              </div>
                              
                              <motion.h3 
                                className="text-4xl font-bold mb-8 drop-shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                              >
                                {policy.title}
                              </motion.h3>
                              <motion.p 
                                className="text-white/90 text-xl leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                              >
                                {policy.description}
                              </motion.p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {/* Eliminado el icono faEye */}
                              <motion.div
                                className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full font-bold border border-white/40"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                              >
                                {policy.badge}
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        {/* Reverso de la tarjeta */}
                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-md p-10 border border-white/30">
                          <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                              <h3 className="text-4xl font-bold text-white drop-shadow-lg">{policy.title}</h3>
                              <FontAwesomeIcon 
                                icon={getIconForPolicy(policy.icon)} 
                                className="text-5xl text-white/60" 
                              />
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="text-2xl font-semibold text-white/90 mb-8">Puntos Clave:</h4>
                              <ul className="space-y-5">
                                {policy.keyPoints.map((point, pointIndex) => (
                                  <motion.li
                                    key={pointIndex}
                                    className="flex items-start space-x-4"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: pointIndex * 0.15 }}
                                  >
                                    <FontAwesomeIcon 
                                      icon={faCheckCircle} 
                                      className="text-green-400 mt-1 flex-shrink-0 text-xl" 
                                    />
                                    <span className="text-white/90 text-lg leading-relaxed">{point}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="mt-10 pt-8 border-t border-white/20">
                              <motion.button
                                className={`w-full py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 ${
                                  isRead
                                    ? 'bg-green-500/80 backdrop-blur-md text-white cursor-default border border-green-400/50'
                                    : 'bg-blue-500/80 backdrop-blur-md hover:bg-blue-600/80 text-white hover:shadow-2xl border border-blue-400/50 btn-interactive'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (!isRead) handlePolicyRead(policy.id)
                                }}
                                whileHover={!isRead ? { scale: 1.02 } : {}}
                                whileTap={!isRead ? { scale: 0.98 } : {}}
                              >
                                {isRead ? (
                                  <div className="flex items-center justify-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-3 text-2xl" />
                                    Política Leída
                                  </div>
                                ) : (
                                  'He leído esta política'
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {/* Navegación del carrusel */}
            <motion.div 
              className="flex justify-between items-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className={`flex items-center space-x-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all ${
                  currentPolicyIndex > 0
                    ? 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 shadow-lg'
                    : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
                }`}
                onClick={handlePrevPolicy}
                disabled={currentPolicyIndex === 0}
                whileHover={currentPolicyIndex > 0 ? { scale: 1.05, x: -5 } : {}}
                whileTap={currentPolicyIndex > 0 ? { scale: 0.95 } : {}}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Anterior</span>
              </motion.button>

              <div className="text-center bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20">
                <span className="text-white font-bold text-xl">
                  {currentPolicyIndex + 1} de {level.policies.length}
                </span>
              </div>

              <motion.button
                className={`flex items-center space-x-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all ${
                  currentPolicyIndex < level.policies.length - 1
                    ? 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 shadow-lg'
                    : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
                }`}
                onClick={handleNextPolicy}
                disabled={currentPolicyIndex >= level.policies.length - 1}
                whileHover={currentPolicyIndex < level.policies.length - 1 ? { scale: 1.05, x: 5 } : {}}
                whileTap={currentPolicyIndex < level.policies.length - 1 ? { scale: 0.95 } : {}}
              >
                <span>Siguiente</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </motion.button>
            </motion.div>
          </div>

          {/* Botón para iniciar aventura */}
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="inline-flex items-center space-x-4 px-16 py-8 rounded-3xl font-bold text-2xl transition-all duration-300 bg-gradient-to-r from-green-500/80 to-emerald-600/80 backdrop-blur-md text-white shadow-2xl hover:shadow-green-500/25 border border-green-400/50 btn-interactive"
              onClick={handleStartQuiz}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faPlayCircle} className="text-3xl" />
              <span>Iniciar Aventura</span>
            </motion.button>
            
            <motion.p
              className="text-green-300 mt-6 font-bold text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              ¡Explora las políticas y continúa tu aventura cuando estés listo!
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PoliciesLevel