import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheck, 
  faTimes, 
  faArrowLeft,
  faClock,
  faUserTie,
  faShieldAlt,
  faUsers,
  faScroll,
  faRedo,
  faBuilding,
  faBan,
  faPowerOff,
  faHandshake,
  faLaptopHouse,
  faDatabase,
  faLock,
  faRobot
} from '@fortawesome/free-solid-svg-icons'

const PoliciesQuiz = ({ level, onComplete, onBackToPolicies, onNavigateToMap }) => {
  // Función para revolver arrays
  function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  const [selectedDefinition, setSelectedDefinition] = useState(null)
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState(new Set())
  const [flippedCards, setFlippedCards] = useState(new Set())
  const [showFeedback, setShowFeedback] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [stars, setStars] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [hasCompletedLevel, setHasCompletedLevel] = useState(false)

  // Completar el nivel cuando se termine el quiz exitosamente (solo una vez)
  useEffect(() => {
    if (isCompleted && onComplete && !hasCompletedLevel) {
      onComplete()
      setHasCompletedLevel(true)
    }
  }, [isCompleted, onComplete, hasCompletedLevel])

  // Generar estrellas de fondo
  useEffect(() => {
    const generatedStars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
    setStars(generatedStars)
  }, [])

  // Datos para el quiz de emparejamiento
  const quizDataOriginal = [
    {
      id: 1,
      policyName: "POLÍTICA DE LA ORGANIZACIÓN",
      definition: "Mejora continua, cumplimiento legal y gestión de riesgos con participación de todos los empleados.",
      icon: faBuilding,
      color: "from-blue-500 to-blue-700"
    },
    {
      id: 2,
      policyName: "POLÍTICA PREVENCIÓN CONSUMO SUSTANCIAS PSICOACTIVAS",
      definition: "Prohíbe el consumo, venta y posesión de alcohol y sustancias psicoactivas en el trabajo.",
      icon: faBan,
      color: "from-red-500 to-red-700"
    },
    {
      id: 3,
      policyName: "POLÍTICA DE DESCONEXIÓN LABORAL",
      definition: "Promueve el equilibrio vida-trabajo y respeta los horarios laborales, solo urgencias fuera de horario.",
      icon: faPowerOff,
      color: "from-yellow-500 to-yellow-700"
    },
    {
      id: 4,
      policyName: "POLÍTICA DE SERVICIO",
      definition: "Compromiso con la satisfacción del cliente, soluciones prácticas y relaciones duraderas.",
      icon: faHandshake,
      color: "from-green-500 to-green-700"
    },
    {
      id: 5,
      policyName: "POLÍTICA DE TELETRABAJO",
      definition: "Fomenta teletrabajo, calidad de vida y sostenibilidad ambiental, con seguridad y conectividad.",
      icon: faLaptopHouse,
      color: "from-teal-500 to-teal-700"
    },
    {
      id: 6,
      policyName: "POLÍTICA DE PROTECCIÓN DE DATOS",
      definition: "Protección de datos personales y empresariales según leyes colombianas y estándares internacionales.",
      icon: faDatabase,
      color: "from-indigo-500 to-indigo-700"
    },
    {
      id: 7,
      policyName: "POLÍTICA DE MANEJO DE LA TIC Y SEGURIDAD DE INFORMACIÓN",
      definition: "Cuida la información propia y de clientes en medios físicos y digitales para apoyar el trabajo.",
      icon: faLock,
      color: "from-gray-500 to-gray-700"
    },
    {
      id: 8,
      policyName: "POLÍTICA DE USO RESPONSABLE DE INTELIGENCIA ARTIFICIAL (IA)",
      definition: "Uso responsable de IA, sin ingresar información confidencial en plataformas no autorizadas.",
      icon: faRobot,
      color: "from-cyan-500 to-blue-700"
    }
  ]
  // Revolver definiciones y nombres de políticas al iniciar el quiz
  const [shuffledDefinitions, setShuffledDefinitions] = useState([]);
  const [shuffledPolicies, setShuffledPolicies] = useState([]);

  useEffect(() => {
    setShuffledDefinitions(shuffleArray(quizDataOriginal));
    setShuffledPolicies(shuffleArray(quizDataOriginal));
  }, []);

  const handleDefinitionClick = (definitionId) => {
    if (matchedPairs.has(definitionId)) return
    if (showFeedback) return
    if (selectedDefinition !== null) return
    setSelectedDefinition(definitionId)
    setFlippedCards(prev => new Set(Array.from(prev).concat(`def-${definitionId}`)))
    if (selectedPolicy !== null) {
      checkMatch(definitionId, selectedPolicy)
    }
  }

  const handlePolicyClick = (policyId) => {
    if (matchedPairs.has(policyId)) return
    // Bloquear si hay feedback mostrándose
    if (showFeedback) return
    // Si ya hay una política seleccionada, no permitir seleccionar otra
    if (selectedPolicy !== null) return
    setSelectedPolicy(policyId)
    setFlippedCards(prev => new Set(Array.from(prev).concat(`pol-${policyId}`)))
    if (selectedDefinition !== null) {
      checkMatch(selectedDefinition, policyId)
    }
  }

  const checkMatch = (definitionId, policyId) => {
    setAttempts(prev => prev + 1)
    setTimeout(() => {
      if (definitionId === policyId) {
        setMatchedPairs(prev => {
          const newSet = new Set(Array.from(prev).concat(definitionId))
          if (newSet.size === quizDataOriginal.length) {
            setTimeout(() => {
              setIsCompleted(true)
            }, 1000)
          }
          return newSet
        })
        setShowFeedback({ type: 'success', message: '¡Correcto! Excelente emparejamiento.' })
      } else {
        setShowFeedback({ type: 'error', message: 'Incorrecto. Las cartas se voltearán de nuevo.' })
        setTimeout(() => {
          setFlippedCards(prev => {
            const newSet = new Set(Array.from(prev))
            newSet.delete(`def-${definitionId}`)
            newSet.delete(`pol-${policyId}`)
            return newSet
          })
        }, 1500)
      }
      setTimeout(() => {
        setSelectedDefinition(null)
        setSelectedPolicy(null)
        setShowFeedback(null)
      }, 2000)
    }, 100)
  }

  const resetQuiz = () => {
    setSelectedDefinition(null)
    setSelectedPolicy(null)
    setMatchedPairs(new Set())
    setFlippedCards(new Set())
    setShowFeedback(null)
    setAttempts(0)
    setIsCompleted(false)
    setHasCompletedLevel(false) // Resetear también este estado
  }

  const renderCard = (item, type, isFlipped, isMatched, onClick) => {
    const cardId = `${type}-${item.id}`
    const isSelected = type === 'def' ? selectedDefinition === item.id : selectedPolicy === item.id
    
    return (
      <div key={cardId} className="relative h-48 cursor-pointer" onClick={() => !isMatched && onClick(item.id)}>
        <div className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          {/* Parte trasera (oculta) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 border-2 border-white/20 flex items-center justify-center">
            <span className="text-white text-6xl opacity-50">?</span>
          </div>
          {/* Parte frontal (visible cuando se voltea) */}
          <div 
            className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl bg-gradient-to-br ${item.color} p-4 text-white border-2 ${
              isMatched ? 'border-green-400 shadow-lg shadow-green-400/50' : 
              isSelected ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : 
              'border-white/30'
            } flex flex-col justify-center items-center text-center`}
          >
            {isMatched && (
              <span className="absolute top-2 right-2 text-green-400 text-2xl">
                <FontAwesomeIcon icon={faCheck} />
              </span>
            )}
            <FontAwesomeIcon icon={item.icon} className="text-3xl mb-3 opacity-90" />
            <p className="font-bold text-sm leading-tight">
              {type === 'def' ? item.definition : item.policyName}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    // Mostrar mensaje de éxito y botón para volver al mapa o políticas
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Estrellas de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              style={{ left: `${star.left}%`, top: `${star.top}%` }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="text-center z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-8xl text-green-400 mb-6">
                <FontAwesomeIcon icon={faCheck} />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">¡Quiz Completado!</h2>
            <p className="text-xl text-white/80 mb-2">¡Has emparejado todas las políticas correctamente!</p>
            <p className="text-lg text-green-400">Intentos realizados: {attempts}</p>
            <button
              className="mt-6 bg-green-500 text-white px-6 py-3 rounded-xl font-bold border border-green-400 hover:bg-green-600"
              onClick={onBackToPolicies}
            >
              Volver a Políticas
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{ left: `${star.left}%`, top: `${star.top}%` }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-4xl font-bold text-white mb-4">Quiz de Políticas</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white/80 text-lg mb-6">Empareja cada definición con su política correspondiente</span>
          </motion.p>
          {/* Progreso */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 inline-block border border-white/20 text-white font-bold">
              Emparejadas: {matchedPairs.size} / {quizDataOriginal.length} | Intentos: {attempts}
            </span>
          </motion.div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              style={{ position: 'fixed', top: '32px', right: '32px', zIndex: 50 }}
            >
              <div className={`px-6 py-4 rounded-xl font-bold text-white shadow-2xl ${
                showFeedback.type === 'success' 
                  ? 'bg-green-500 border border-green-400' 
                  : 'bg-red-500 border border-red-400'
              }`}>
                <FontAwesomeIcon 
                  icon={showFeedback.type === 'success' ? faCheck : faTimes} 
                  className="mr-2" 
                />
                {showFeedback.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid de cartas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Columna de definiciones */}
          <div>
            <motion.h3 
              className="text-2xl font-bold text-white mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >Definiciones</motion.h3>
            <div className="space-y-4">
              {shuffledDefinitions.map((item, index) => (
                <motion.div
                  key={`def-${item.id}`}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                >
                  {renderCard(
                    item,
                    'def',
                    flippedCards.has(`def-${item.id}`),
                    matchedPairs.has(item.id),
                    handleDefinitionClick
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Columna de nombres de políticas */}
          <div>
            <motion.h3 
              className="text-2xl font-bold text-white mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >Nombres de Políticas</motion.h3>
            <div className="space-y-4">
              {shuffledPolicies.map((item, index) => (
                <motion.div
                  key={`pol-${item.id}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                >
                  {renderCard(
                    item,
                    'pol',
                    flippedCards.has(`pol-${item.id}`),
                    matchedPairs.has(item.id),
                    handlePolicyClick
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Botón de regreso */}
        <div className="text-center mt-12">
          <button
            className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold border border-white/20 hover:bg-white/20"
            onClick={onBackToPolicies}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver a Políticas
          </button>
        </div>
      </div>
    </div>
  )
}

export default PoliciesQuiz