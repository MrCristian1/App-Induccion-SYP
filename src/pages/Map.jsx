import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { faDna } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faTasks, faHeart, faUsers, faSitemap, faLock, faCheck, faArrowRight, faTrophy, faStar, faGem, faRocket, faBriefcase, faUsersCog, faAward, faExclamationTriangle, faCog } from '@fortawesome/free-solid-svg-icons'
import { faScroll } from '@fortawesome/free-solid-svg-icons'
import { useRef, useEffect, useState, useCallback } from 'react'
import OnboardingTour from '../components/OnboardingTour'

const Map = () => {
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [stars, setStars] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [showTour, setShowTour] = useState(true) // TEMPORAL: inicializar en true para testing
  const [showFinalModal, setShowFinalModal] = useState(false)

  // Generar estrellas una sola vez
  const [backgroundStars] = useState(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4
    }))
  )

  // Estado para meteoritos
  const [meteorites, setMeteorites] = useState([])

  // Generar meteoritos cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const newMeteorite = {
        id: Date.now(),
        startX: Math.random() * 100,
        startY: -10,
        endX: Math.random() * 100,
        endY: 110,
        duration: Math.random() * 2 + 3, // 3-5 segundos
        size: Math.random() * 5 + 4 // 4-9px (más grandes)
      }

      setMeteorites(prev => [...prev, newMeteorite])

      // Remover meteorito después de la animación
      setTimeout(() => {
        setMeteorites(prev => prev.filter(m => m.id !== newMeteorite.id))
      }, (newMeteorite.duration + 1) * 1000)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Mapeo de iconos de string a FontAwesome icons
  const iconMap = {
  'star': faStar,
  'trophy': faTrophy,
  'award': faAward,
  'heart': faHeart,
  'gem': faGem,
  'exclamation-triangle': faExclamationTriangle,
  'book-open': faBookOpen,
  'scroll': faScroll,
  'tasks': faTasks,
  'dna': faDna,
  'clipboard-list': faClipboardList,
  'users': faUsers,
  'sitemap': faSitemap,
  'lock': faLock,
  'rocket': faRocket,
  'briefcase': faBriefcase,
  'users-cog': faUsersCog,
  'cog': faCog
  }
  const {
    levelsData,
    completedLevels,
    setCurrentLevel,
    allLevelsCompleted,
    userName
  } = useAppContext()
  // Mostrar modal de certificado cuando se completan los 8 niveles
  useEffect(() => {
    if (levelsData && levelsData.length > 0) {
      const todosCompletados = completedLevels.length >= levelsData.length

      console.log('🔍 Verificación:', {
        niveles: levelsData.length,
        completados: completedLevels.length,
        todosCompletados: todosCompletados
      })

      if (todosCompletados) {
        console.log('🎉 Mostrando modal final')
        setShowFinalModal(true)
      }
    }
  }, [completedLevels, levelsData])

  const containerRef = useRef(null)
  const gameLoopRef = useRef(null)
  const keysRef = useRef({})

  const progressPercentage = (completedLevels.length / levelsData.length) * 100

  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) return true
    return completedLevels.includes(levelId - 1)
  }

  // Verificar si mostrar el tour al cargar la página
  useEffect(() => {
    // Verificar si el usuario ya ha completado algún nivel o ha visto el tour
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour')
    const hasStartedAnyLevel = completedLevels.length > 0

    if (!hasSeenTour && !hasStartedAnyLevel) {
      console.log('🎮 Iniciando tour de onboarding')
      setShowTour(true)
    } else {
      setShowTour(false)
    }
  }, [completedLevels]) // Dependencia de completedLevels para reaccionar a cambios

  const handleTourComplete = () => {
    console.log('🎮 Tour completado')
    localStorage.setItem('hasSeenOnboardingTour', 'true')
    setShowTour(false)
  }

  // World coordinates system (infinite world)
  const [worldPosition, setWorldPosition] = useState({ x: 0, y: 0 })
  const [camera, setCamera] = useState({ x: 0, y: 0 })

  // Spaceship state with world coordinates
  const [spaceship, setSpaceship] = useState({
    worldX: 0, // world coordinates
    worldY: 0,
    rotation: 0,
    velocityX: 0,
    velocityY: 0,
    thrust: false
  })

  // Navigation stations in world coordinates (procedurally distributed)
  const navigationStations = [
    { id: 1, worldX: -1500, worldY: -1000, level: levelsData[0] },
    { id: 2, worldX: 2000, worldY: -800, level: levelsData[1] },
    { id: 3, worldX: -1200, worldY: 1800, level: levelsData[2] },
    { id: 4, worldX: 1800, worldY: 1400, level: levelsData[3] }, // Accidentalidad
    { id: 5, worldX: 0, worldY: 0, level: levelsData[4] },
    { id: 6, worldX: -2200, worldY: 800, level: levelsData[5] }, // Jerarquía
    { id: 7, worldX: 1500, worldY: -1800, level: levelsData[6] }, // Sistema de gestión de calidad
    { id: 8, worldX: -1800, worldY: -2200, level: levelsData[7] }, // Mapa de Procesos
    { id: 9, worldX: 2200, worldY: 2200, level: levelsData[8] }, // Fundamentos ACR
    { id: 'final', worldX: 0, worldY: -2500, level: { id: 'final', title: 'Logro Final', icon: 'trophy' } }
  ]

  // Parallax layers
  const [parallaxStars, setParallaxStars] = useState([])
  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 })

  // Refs for game loop and input handling

  // Remove old progress bar effect - not needed in space game

  // Generate parallax stars for infinite world
  useEffect(() => {
    const generateParallaxStars = () => {
      const layers = []

      // Far stars (slow parallax)
      for (let i = 0; i < 100; i++) {
        layers.push({
          id: `far-${i}`,
          worldX: (Math.random() - 0.5) * 20000,
          worldY: (Math.random() - 0.5) * 20000,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          parallaxFactor: 0.1,
          twinkleDelay: Math.random() * 8
        })
      }

      // Mid stars (medium parallax)
      for (let i = 0; i < 80; i++) {
        layers.push({
          id: `mid-${i}`,
          worldX: (Math.random() - 0.5) * 15000,
          worldY: (Math.random() - 0.5) * 15000,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.3,
          parallaxFactor: 0.3,
          twinkleDelay: Math.random() * 6
        })
      }

      // Near stars (fast parallax)
      for (let i = 0; i < 60; i++) {
        layers.push({
          id: `near-${i}`,
          worldX: (Math.random() - 0.5) * 10000,
          worldY: (Math.random() - 0.5) * 10000,
          size: Math.random() * 4 + 1.5,
          opacity: Math.random() * 1 + 0.4,
          parallaxFactor: 0.6,
          twinkleDelay: Math.random() * 4
        })
      }

      setParallaxStars(layers)
    }
    generateParallaxStars()
  }, [])

  // Physics constants for infinite world
  const PHYSICS = {
    acceleration: 2.0,    // Mayor aceleración para respuesta más rápida
    friction: 0.99,       // Menos fricción para deslizamiento más suave
    maxSpeed: 18,         // Mayor velocidad máxima
    rotationSpeed: 4.5,    // Rotación más rápida
    interactionDistance: 300
  }

  // Navegación entre planetas estilo Mario Bros
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(e.key)) {
        e.preventDefault()
      }

      // Navegación entre planetas - circular navigation con throttle
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !isNavigating) {
        setIsNavigating(true)

        if (e.key === 'ArrowRight') {
          setCurrentPlanetIndex(prev => (prev + 1) % navigationStations.length)
        }

        if (e.key === 'ArrowLeft') {
          setCurrentPlanetIndex(prev => (prev - 1 + navigationStations.length) % navigationStations.length)
        }

        // Throttle de 500ms
        setTimeout(() => {
          setIsNavigating(false)
        }, 500)
      }

      // Handle Enter key for station interaction
      if (e.key === 'Enter') {
        const currentStation = navigationStations[currentPlanetIndex]
        if (currentStation) {
          const isUnlocked = currentStation.id === 'final' ? allLevelsCompleted : isLevelUnlocked(currentStation.level.id)
          if (isUnlocked) {
            if (currentStation.id === 'final') {
              handleFinalAchievement()
            } else {
              setSelectedLevel(currentStation.level)
              setShowModal(true)
            }
          }
        }
      }

      if (e.key === 'Escape') {
        setShowModal(false)
        setSelectedLevel(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentPlanetIndex, navigationStations, allLevelsCompleted, isLevelUnlocked, isNavigating])

  // Update camera to follow spaceship
  useEffect(() => {
    setCamera({
      x: spaceship.worldX,
      y: spaceship.worldY
    })

    // Update grid offset for parallax
    setGridOffset({
      x: spaceship.worldX * 0.1,
      y: spaceship.worldY * 0.1
    })
  }, [spaceship.worldX, spaceship.worldY])

  // Check proximity to navigation stations in world coordinates
  const getProximityToStation = useCallback((stationWorldX, stationWorldY) => {
    const dx = spaceship.worldX - stationWorldX
    const dy = spaceship.worldY - stationWorldY
    const distance = Math.sqrt(dx * dx + dy * dy)
    return Math.max(0, PHYSICS.interactionDistance - distance) / PHYSICS.interactionDistance // Normalize to 0-1
  }, [spaceship.worldX, spaceship.worldY])

  // Handle Enter key press
  const handleEnterPress = useCallback(() => {
    const nearbyStation = navigationStations.find(station => {
      const proximity = getProximityToStation(station.worldX, station.worldY)
      return proximity > 0.3 // Threshold for interaction
    })

    if (nearbyStation) {
      if (nearbyStation.id === 'final') {
        if (allLevelsCompleted) {
          handleFinalAchievement()
        }
      } else {
        const level = nearbyStation.level
        if (isLevelUnlocked(level.id)) {
          setSelectedLevel(level)
          setShowModal(true)
        }
      }
    }
  }, [spaceship, navigationStations, allLevelsCompleted])

  // Game loop for physics - IMPLEMENTACIÓN MEJORADA SEGÚN REFERENCIA
  useEffect(() => {
    const gameLoop = () => {
      setSpaceship(prev => {
        const newState = { ...prev }

        // Detectar input de teclas - Separar rotación y aceleración
        let rotateLeft = keysRef.current['ArrowLeft']
        let rotateRight = keysRef.current['ArrowRight']
        let thrust = keysRef.current['ArrowUp']
        let brake = keysRef.current['ArrowDown']

        // Calcular rotación - Rotación directa con teclas izquierda/derecha
        if (rotateLeft) {
          newState.rotation -= PHYSICS.rotationSpeed
        }
        if (rotateRight) {
          newState.rotation += PHYSICS.rotationSpeed
        }

        // Aplicar aceleración en la dirección de la nave cuando se presiona "arriba"
        if (thrust) {
          // Convertir rotación a radianes
          const radians = newState.rotation * (Math.PI / 180)

          // Aplicar aceleración en la dirección de la nave
          newState.velocityX += Math.sin(radians) * PHYSICS.acceleration
          newState.velocityY += -Math.cos(radians) * PHYSICS.acceleration

          // Marcar thrust como activo para efectos visuales
          newState.thrust = true
        } else {
          newState.thrust = false
        }

        // Freno cuando se presiona "abajo"
        if (brake) {
          newState.velocityX *= 0.95 // Freno más fuerte que la fricción normal
          newState.velocityY *= 0.95
        }

        // Aplicar fricción - más suave para un deslizamiento espacial realista
        newState.velocityX *= PHYSICS.friction
        newState.velocityY *= PHYSICS.friction

        // Limitar velocidad máxima
        const currentSpeed = Math.sqrt(newState.velocityX * newState.velocityX + newState.velocityY * newState.velocityY)
        if (currentSpeed > PHYSICS.maxSpeed) {
          const speedRatio = PHYSICS.maxSpeed / currentSpeed
          newState.velocityX *= speedRatio
          newState.velocityY *= speedRatio
        }

        // Actualizar posición mundial
        newState.worldX += newState.velocityX
        newState.worldY += newState.velocityY

        return newState
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, []);

  const getIcon = (type) => {
    return iconMap[type] || faBookOpen
  }

  const handleLevelClick = (levelId) => {
    if (isLevelUnlocked(levelId)) {
      // Si es el primer nivel, desactivar el tour permanentemente
      if (levelId === 1) {
        localStorage.setItem('hasSeenOnboardingTour', 'true')
        setShowTour(false)
      }

      setCurrentLevel(levelId)
      navigate(`/level/${levelId}`)
    }
  }

  const handleFinalAchievement = () => {
    navigate('/final-achievement')
  }

  const getExperiencePoints = (levelId) => {
    const baseXP = 100
    return baseXP + (levelId - 1) * 50
  }

  const getTotalStars = () => {
    return completedLevels.length
  }

  const getPlayerLevel = () => {
    const totalCompleted = completedLevels.length
    if (totalCompleted === 0) return 1
    if (totalCompleted <= 2) return 2
    if (totalCompleted <= 4) return 3
    return 4
  }

  const getPlayerTitle = () => {
    const level = getPlayerLevel()
    const titles = {
      1: "Novato",
      2: "Aprendiz",
      3: "Aventurero",
      4: "Maestro"
    }
    return titles[level] || "Novato"
  }

  const levelThemes = [
    { name: "Bosque Inicial", color: "from-green-400 to-emerald-600", bgColor: "bg-green-50", textColor: "text-green-800" },
    { name: "Sendero Verde", color: "from-blue-400 to-cyan-600", bgColor: "bg-blue-50", textColor: "text-blue-800" },
    { name: "Guardián del Bosque", color: "from-purple-400 to-violet-600", bgColor: "bg-purple-50", textColor: "text-purple-800" },
    { name: "Dunas Doradas", color: "from-yellow-400 to-orange-600", bgColor: "bg-yellow-50", textColor: "text-yellow-800" },
    { name: "Oasis Perdido", color: "from-pink-400 to-rose-600", bgColor: "bg-pink-50", textColor: "text-pink-800" }
  ]

  // Spaceship SVG Component - Diseño mejorado
  const SpaceshipSVG = ({ thrust, className }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" className={className}>
      {/* Thruster glow - mejorado */}
      {thrust && (
        <g>
          <ellipse cx="20" cy="35" rx="10" ry="15" fill="url(#thrusterGlowOuter)" opacity="0.6" />
          <ellipse cx="20" cy="33" rx="6" ry="10" fill="url(#thrusterGlowInner)" opacity="0.8" />
          <ellipse cx="20" cy="31" rx="3" ry="6" fill="#ff9955" opacity="0.9" />
        </g>
      )}

      {/* Main body - diseño más aerodinámico */}
      <path d="M20 5 L28 28 L20 24 L12 28 Z" fill="url(#shipGradient)" stroke="#ffffff" strokeWidth="1" />

      {/* Alas laterales */}
      <path d="M20 15 L30 25 L28 28 L20 24 Z" fill="url(#wingGradient)" stroke="#ffffff" strokeWidth="0.5" />
      <path d="M20 15 L10 25 L12 28 L20 24 Z" fill="url(#wingGradient)" stroke="#ffffff" strokeWidth="0.5" />

      {/* Cockpit - más brillante */}
      <circle cx="20" cy="14" r="4" fill="url(#cockpitGradient)" stroke="#00ffff" strokeWidth="1" />
      <circle cx="20" cy="14" r="2" fill="#ffffff" opacity="0.8" />

      {/* Detalles de la nave */}
      <path d="M18 18 L22 18 L20 22 Z" fill="#4a90e2" opacity="0.9" />

      {/* Luces de navegación */}
      <circle cx="28" cy="25" r="1" fill="#ff3333" opacity={thrust ? "0.9" : "0.5"}>
        {thrust && <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.5s" repeatCount="indefinite" />}
      </circle>
      <circle cx="12" cy="25" r="1" fill="#33ff33" opacity={thrust ? "0.9" : "0.5"}>
        {thrust && <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.5s" repeatCount="indefinite" />}
      </circle>

      <defs>
        <linearGradient id="shipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#b3d9ff" />
          <stop offset="100%" stopColor="#4a90e2" />
        </linearGradient>
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a90e2" />
          <stop offset="70%" stopColor="#2a70c2" />
          <stop offset="100%" stopColor="#1a60b2" />
        </linearGradient>
        <radialGradient id="cockpitGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="70%" stopColor="#0080ff" />
          <stop offset="100%" stopColor="#004080" />
        </radialGradient>
        <radialGradient id="thrusterGlowOuter" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#ffaa66" />
          <stop offset="50%" stopColor="#ff7744" />
          <stop offset="100%" stopColor="#ff4400" />
        </radialGradient>
        <radialGradient id="thrusterGlowInner" cx="50%" cy="10%" r="90%">
          <stop offset="0%" stopColor="#ffdd66" />
          <stop offset="50%" stopColor="#ffaa44" />
          <stop offset="100%" stopColor="#ff7700" />
        </radialGradient>
      </defs>
    </svg>
  )

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Fondo espacial con nebulosas y estrellas */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Nebulosas eliminadas, solo estrellas y meteoritos */}

        {/* Estrellas animadas */}
        {backgroundStars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              left: star.left + '%',
              top: star.top + '%',
              animation: `twinkle ${star.duration}s infinite`,
              animationDelay: star.delay + 's'
            }}
          />
        ))}

        {/* Meteoritos */}
        {meteorites.map((meteorite) => (
          <div
            key={meteorite.id}
            className="absolute bg-gradient-to-r from-yellow-300 to-orange-500 rounded-full opacity-80"
            style={{
              width: meteorite.size + 'px',
              height: meteorite.size + 'px',
              left: meteorite.startX + '%',
              top: meteorite.startY + '%',
              animation: `meteorite-fall ${meteorite.duration}s linear forwards`,
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 15px rgba(255, 215, 0, 0.6)'
            }}
          />
        ))}
      </div>

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes nebula-drift {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -30px) scale(1.1); }
          50% { transform: translate(-30px, 50px) scale(0.9); }
          75% { transform: translate(-50px, -20px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes meteorite-fall {
          0% {
            transform: translate(0, 0) rotate(-45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(100vw, 100vh) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Sidebar with Player Stats */}
      <motion.div
        className="w-80 min-h-screen bg-slate-800/50 backdrop-blur-md border-r border-white/10 p-6 flex flex-col"
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            className="relative mb-4"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
            <img
              src="/img/syp.png"
              alt="Logo"
              className="w-20 h-20 relative z-10 drop-shadow-lg"
            />
          </motion.div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">Aventura Épica</h1>
            <p className="text-white/80 text-base">Mapa Interactivo Gamificado</p>
          </div>
        </div>

        {/* Player Stats Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 flex-1"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-1">{userName || `Nivel ${getPlayerLevel()}`}</h3>
            <p className="text-yellow-300 font-semibold">{getPlayerTitle()}</p>
          </div>

          <div className="text-center mb-6">
            <div className="text-white/80 text-sm mb-1">Experiencia Total</div>
            <div className="text-3xl font-bold text-yellow-300">
              {completedLevels.reduce((total, levelId) => total + getExperiencePoints(levelId), 0)} XP
            </div>
          </div>

          {/* Logros de Niveles */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 text-center">Logros de Niveles</h4>
            <div className="grid grid-cols-5 gap-2">
              {levelsData.map((level) => {
                const isCompleted = completedLevels.includes(level.id);
                const isUnlocked = isLevelUnlocked(level.id);

                return (
                  <motion.div
                    key={level.id}
                    className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isCompleted
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-lg shadow-yellow-400/30'
                      : isUnlocked
                        ? 'bg-white/10 border-white/30 hover:bg-white/20'
                        : 'bg-gray-600/30 border-gray-500/50'
                      }`}
                    whileHover={isUnlocked ? { scale: 1.1 } : {}}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: level.id * 0.1 }}
                  >
                    {/* Icono del nivel */}
                    <FontAwesomeIcon
                      icon={iconMap[level.icon] || faRocket}
                      className={`text-lg ${isCompleted
                        ? 'text-white drop-shadow-lg'
                        : isUnlocked
                          ? 'text-white/80'
                          : 'text-gray-400/50'
                        }`}
                    />

                    {/* Efecto de brillo para niveles completados */}
                    {isCompleted && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/30 to-transparent"
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    )}

                    {/* Indicador de nivel bloqueado */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <FontAwesomeIcon icon={faLock} className="text-gray-400 text-xs" />
                      </div>
                    )}

                    {/* Número del nivel */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center ${isCompleted
                      ? 'bg-green-500 text-white'
                      : isUnlocked
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-500 text-gray-300'
                      }`}>
                      {level.id}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Estadísticas resumidas */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Completados:</span>
                <span className="text-green-400 font-semibold">{completedLevels.length}/{levelsData.length}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-white/70">Progreso:</span>
                <span className="text-blue-400 font-semibold">{Math.round((completedLevels.length / levelsData.length) * 100)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mapa Estelar Estilo Mario Bros 2D */}
      <div className="flex-1 relative z-10 p-6">
        <div className="h-full">
          {/* Fondo espacial minimalista */}
          {/* Estrellas de fondo */}
          {parallaxStars.slice(0, 30).map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${(star.worldX % 100)}%`,
                top: `${(star.worldY % 100)}%`,
                width: `${Math.min(star.size, 2)}px`,
                height: `${Math.min(star.size, 2)}px`,
                opacity: star.opacity * 0.4
              }}
              animate={{
                opacity: [star.opacity * 0.2, star.opacity * 0.6, star.opacity * 0.2]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 4
              }}
            />
          ))}

          {/* Carrusel Circular de Cards de Niveles */}
          <div className="relative z-20 flex items-center justify-center min-h-[600px] px-8">
            {/* Controles de navegación */}
            <button
              onClick={() => {
                if (!isNavigating) {
                  setIsNavigating(true);
                  setCurrentPlanetIndex((prev) => (prev - 1 + navigationStations.length) % navigationStations.length);
                  setTimeout(() => setIsNavigating(false), 500);
                }
              }}
              className={`absolute left-4 z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-300 ${isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 hover:scale-110'
                }`}
              disabled={isNavigating}
            >
              <FontAwesomeIcon icon={faArrowRight} className="rotate-180" />
            </button>

            <button
              onClick={() => {
                if (!isNavigating) {
                  setIsNavigating(true);
                  setCurrentPlanetIndex((prev) => (prev + 1) % navigationStations.length);
                  setTimeout(() => setIsNavigating(false), 500);
                }
              }}
              className={`absolute right-4 z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-300 ${isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 hover:scale-110'
                }`}
              disabled={isNavigating}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>

            {/* Contenedor del carrusel circular */}
            <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center">
              {navigationStations.map((station, index) => {
                const isCompleted = station.id !== 'final' ? completedLevels.includes(station.level.id) : false;
                const isUnlocked = station.id === 'final' ? allLevelsCompleted : isLevelUnlocked(station.level.id);
                const isCurrent = index === currentPlanetIndex;
                const level = station.level;

                // Calcular posición circular
                const totalCards = navigationStations.length;
                const angle = (index - currentPlanetIndex) * (360 / totalCards);
                const radius = 200;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const z = Math.sin((angle * Math.PI) / 180) * radius;

                // Determinar escala y opacidad basado en la posición
                const distance = Math.abs(index - currentPlanetIndex);
                const normalizedDistance = Math.min(distance, totalCards - distance);
                const scale = isCurrent ? 1.1 : Math.max(0.6, 1 - normalizedDistance * 0.2);
                const opacity = isCurrent ? 1 : normalizedDistance > 2 ? 0 : Math.max(0.3, 1 - normalizedDistance * 0.35);
                const zIndex = isCurrent ? 50 : Math.max(1, 30 - normalizedDistance * 5);

                // Ocultar cards que están muy lejos para evitar superposiciones
                const shouldShow = normalizedDistance <= 2;

                return shouldShow ? (
                  <motion.div
                    key={station.id}
                    className={`absolute w-72 h-80 rounded-2xl backdrop-blur-md border-2 cursor-pointer ${isCompleted
                      ? 'bg-gradient-to-br from-green-500/30 to-emerald-600/40 border-green-400/60 shadow-green-400/40'
                      : isUnlocked
                        ? 'bg-gradient-to-br from-blue-500/30 to-cyan-600/40 border-cyan-400/60 shadow-cyan-400/40'
                        : 'bg-gradient-to-br from-gray-500/30 to-slate-600/40 border-gray-400/40 opacity-60 cursor-not-allowed'
                      } ${isCurrent ? 'ring-4 ring-yellow-400/60 shadow-2xl' : ''
                      }`}
                    style={{
                      transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: isCurrent ? 'auto' : 'none'
                    }}
                    animate={{
                      transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
                      opacity: opacity
                    }}
                    transition={{
                      duration: 0.4,
                      ease: 'easeOut',
                      opacity: { duration: 0.3 }
                    }}
                    whileHover={{
                      scale: isUnlocked && isCurrent ? scale * 1.05 : scale,
                      y: isUnlocked && isCurrent ? -5 : 0
                    }}
                    onClick={() => {
                      if (isUnlocked && isCurrent) {
                        if (station.id === 'final') {
                          handleFinalAchievement()
                        } else {
                          setSelectedLevel(station.level)
                          setShowModal(true)
                        }
                      }
                    }}
                  >
                    <div className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ${isCompleted ? 'bg-gradient-to-br from-green-400/10 to-emerald-600/20' :
                      isUnlocked ? 'bg-gradient-to-br from-cyan-400/10 to-blue-600/20' :
                        'bg-gradient-to-br from-gray-400/5 to-slate-600/10'
                      } hover:opacity-100`} />

                    {/* Header de la card */}
                    <div className="relative p-6 text-center">
                      {/* Icono principal */}
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${isCompleted ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-400/50' :
                        isUnlocked ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-400/50' :
                          'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-400/30'
                        } shadow-2xl border-2 border-white/30`}>
                        <FontAwesomeIcon
                          icon={station.id === 'final' ? faTrophy : iconMap[level?.icon] || faBookOpen}
                          className={`text-3xl ${isCompleted ? 'text-white' :
                            isUnlocked ? 'text-white' :
                              'text-gray-300'
                            }`}
                        />
                      </div>

                      {/* Indicador de completado */}
                      {isCompleted && (
                        <motion.div
                          className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <FontAwesomeIcon icon={faCheck} className="text-white text-sm" />
                        </motion.div>
                      )}

                      {/* Indicador de bloqueado */}
                      {!isUnlocked && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center border-2 border-white/50">
                          <FontAwesomeIcon icon={faLock} className="text-white text-sm" />
                        </div>
                      )}
                    </div>

                    {/* Contenido de la card */}
                    <div className="px-6 pb-6 flex-1 flex flex-col">
                      <h3 className={`text-xl font-bold mb-3 text-center ${isCompleted ? 'text-green-300' :
                        isUnlocked ? 'text-cyan-300' :
                          'text-gray-400'
                        }`}>
                        {level?.title || station.name}
                      </h3>

                      {level?.description && (
                        <p className={`text-sm mb-4 text-center flex-1 ${isCompleted ? 'text-green-200/80' :
                          isUnlocked ? 'text-cyan-200/80' :
                            'text-gray-400/60'
                          }`}>
                          {level.description}
                        </p>
                      )}

                      {/* Barra de progreso */}
                      <div className="mt-auto">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs font-medium ${isCompleted ? 'text-green-300' :
                            isUnlocked ? 'text-cyan-300' :
                              'text-gray-400'
                            }`}>
                            Progreso
                          </span>
                          <span className={`text-xs ${isCompleted ? 'text-green-300' :
                            isUnlocked ? 'text-cyan-300' :
                              'text-gray-400'
                            }`}>
                            {isCompleted ? '100%' : isUnlocked ? (level?.progress || 0) + '%' : '0%'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${isCompleted ? 'bg-gradient-to-r from-green-400 to-green-500' :
                              isUnlocked ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                                'bg-gray-500'
                              }`}
                            initial={{ width: 0 }}
                            animate={{
                              width: isCompleted ? '100%' : isUnlocked ? `${level?.progress || 0}%` : '0%'
                            }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </div>

                      {/* Estado de la card */}
                      <div className={`mt-4 text-center py-2 px-4 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-500/30 text-green-300 border border-green-400/30' :
                        isUnlocked ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/30' :
                          'bg-gray-500/30 text-gray-400 border border-gray-400/30'
                        }`}>
                        {isCompleted ? '✓ Completado' : isUnlocked ? '🚀 Disponible' : '🔒 Bloqueado'}
                      </div>
                    </div>

                    {/* Indicador de selección actual */}
                    {isCurrent && isUnlocked && (
                      <motion.div
                        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <div className="bg-yellow-500/90 text-black text-xs px-3 py-1 rounded-full backdrop-blur-sm font-bold">
                          Presiona ENTER
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : null
              })}
            </div>

            {/* Indicadores de navegación (dots) */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
              {navigationStations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isNavigating && index !== currentPlanetIndex) {
                      setIsNavigating(true);
                      setCurrentPlanetIndex(index);
                      setTimeout(() => setIsNavigating(false), 500);
                    }
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentPlanetIndex
                    ? 'bg-yellow-400 scale-125 shadow-lg shadow-yellow-400/50'
                    : 'bg-white/40 hover:bg-white/60'
                    } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  disabled={isNavigating}
                />
              ))}
            </div>

            {/* Información de navegación */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-30">
              <div className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm">
                {currentPlanetIndex + 1} de {navigationStations.length}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MODAL FINAL - MOVIDO AL FINAL DEL COMPONENTE Y CORREGIDO */}
      <AnimatePresence>
        {showFinalModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFinalModal(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full mx-4 text-center"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg">
                <FontAwesomeIcon icon={faTrophy} className="text-4xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">¡Felicidades {userName}!</h2>
              <p className="text-white/80 mb-4">Has completado todos los niveles del entrenamiento.</p>
              <p className="text-yellow-300 font-semibold mb-6">Es hora de reclamar tu certificado de finalización.</p>

              <div className="flex flex-col space-y-3">
                <motion.button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg text-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowFinalModal(false);
                    navigate('/final-achievement');
                  }}
                >
                  🎓 Ir a certificado
                </motion.button>

                <motion.button
                  className="w-full bg-white/10 text-white py-3 px-6 rounded-xl font-semibold border border-white/20"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowFinalModal(false)}
                >
                  Seguir explorando
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Level Modal */}
      <AnimatePresence>
        {showModal && selectedLevel && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={getIcon(selectedLevel.icon)} className="text-3xl text-white" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">{selectedLevel.title}</h2>

                <p className="text-white/80 mb-6 leading-relaxed">
                  {selectedLevel.id === 2
                    ? "Descubre el ADN de Solutions & Payroll: nuestra esencia, valores y el motor que impulsa todo lo que hacemos."
                    : selectedLevel.content?.[1]?.text || "Prepárate para una nueva aventura de aprendizaje."}
                </p>

                <div className="flex items-center justify-center mb-6 space-x-4">
                  <div className="flex items-center text-yellow-400">
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <span className="font-semibold">{getExperiencePoints(selectedLevel.id)} XP</span>
                  </div>

                  <div className="flex items-center text-emerald-400">
                    <FontAwesomeIcon icon={faGem} className="mr-1" />
                    <span className="font-semibold">Nivel {selectedLevel.id}</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLevelClick(selectedLevel.id)}
                  >
                    🚀 Explorar Nivel
                  </motion.button>

                  <motion.button
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Tour */}
      <OnboardingTour
        isVisible={showTour}
        onComplete={handleTourComplete}
      />



    </motion.div>
  )

}

export default Map