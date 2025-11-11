import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'

const Welcome = () => {
  const navigate = useNavigate()
  const { companyConfig, setUserName } = useAppContext()
  
  // Estados para controlar las animaciones secuenciales
  const [animationStep, setAnimationStep] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)
  const [userName, setUserNameLocal] = useState('')
  const [particles, setParticles] = useState([])
  
  // Función para generar partículas con efecto hyperspace desde el centro
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 80; i++) {
        // Generar ángulo aleatorio para distribución radial uniforme
        const angle = (Math.PI * 2 * i) / 80 + Math.random() * 0.3
        
        newParticles.push({
          id: i,
          // Dirección basada en ángulo para movimiento radial
          angle: angle,
          // Tamaños variados
          size: Math.random() * 1.5 + 0.5,
          // Velocidad variada
          speed: 4 + Math.random() * 3,
          // Delays escalonados que inician cuando aparece el texto
          delay: (i * 0.05) % 3
        })
      }
      setParticles(newParticles)
    }
    
    generateParticles()
  }, [])
  

  
  // Avanzar a la siguiente animación después de un tiempo
  useEffect(() => {
    if (animationStep < 3) {
      const timer = setTimeout(() => {
        setAnimationStep(animationStep + 1)
      }, 2500) // Tiempo entre animaciones
      
      return () => clearTimeout(timer)
    } else if (animationStep === 3) {
      // Mostrar el botón después de todas las animaciones
      const timer = setTimeout(() => {
        setShowButton(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [animationStep])
  
  const handleStart = () => {
    if (userName.trim().length > 0) {
      // Guardar el nombre del usuario en el contexto
      if (setUserName) {
        setUserName(userName.trim())
      }
      // Transición al mapa
      navigate('/map')
    }
  }

  const handleBeginJourney = () => {
    setShowVideo(true)
  }

  const handleContinueAfterVideo = () => {
    setShowVideo(false)
    setShowNameInput(true)
  }
  
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-secondary-dark overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Efecto hyperspace desde el centro - inicia inmediatamente */}
           <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-0">
              {particles.map((particle) => {
                // Calcular dirección basada en el ángulo
                const directionX = Math.cos(particle.angle)
                const directionY = Math.sin(particle.angle)
                // Distancia para salir completamente de la pantalla
                const finalDistance = 1000
                
                return (
                  <motion.div
                    key={particle.id}
                    className="absolute bg-white rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: '1.5px',
                      height: '1.5px'
                    }}
                    animate={{
                      // Movimiento radial desde el centro
                      x: directionX * finalDistance,
                      y: directionY * finalDistance,
                      // Escala que crece durante el movimiento
                      scale: [0, particle.size * 3],
                      // Opacidad que aparece y desaparece
                      opacity: [0, 0.8, 0.6, 0]
                    }}
                    transition={{
                      duration: particle.speed,
                      repeat: Infinity,
                      repeatType: "restart",
                      ease: "linear",
                      delay: particle.delay + 1, // Delay adicional para sincronizar con el texto
                      repeatDelay: 0
                    }}
                  />
                )
              })}
             </div>
      
      <div className="w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Primera frase */}
          {animationStep === 0 && (
            <motion.h1 
              key="first-phrase"
              className="text-5xl md:text-7xl font-bold text-center text-white mb-8 px-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              ¡Bienvenido a tu recorrido por {companyConfig.companyName}!
            </motion.h1>
          )}
          
          {/* Segunda frase */}
          {animationStep === 1 && (
            <motion.p 
              key="second-phrase"
              className="text-3xl md:text-4xl text-center text-white mb-8 px-4 max-w-4xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              Prepárate para conocer todo sobre nuestra empresa de manera interactiva
            </motion.p>
          )}
          
          {/* Logo */}
          {animationStep === 2 && (
            <motion.div 
              key="logo"
              className="w-64 h-64 mb-8"
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                duration: 1.2 
              }}
            >
              <img src="/img/syp.png" alt={`${companyConfig.companyName} Logo`} className="w-full h-full" />
            </motion.div>
          )}
          
          {/* Transición final */}
          {animationStep === 3 && !showVideo && !showNameInput && (
            <motion.div
              key="transition"
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                className="w-48 h-48 mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1,
                  opacity: 1,
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  scale: { duration: 0.5, ease: "easeOut" },
                  opacity: { duration: 0.5, ease: "easeOut" },
                  rotate: { 
                    repeat: Infinity, 
                    duration: 6,
                    ease: "easeInOut" 
                  }
                }}
              >
                <img src="/img/syp.png" alt={`${companyConfig.companyName} Logo`} className="w-full h-full" />
              </motion.div>
              
              {showButton && (
                <motion.button
                  className="bg-white text-primary text-xl font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                  onClick={handleBeginJourney}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Comenzar Recorrido <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Video de YouTube */}
          {showVideo && (
            <motion.div
              key="video"
              className="flex flex-col items-center justify-center w-full max-w-4xl px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl w-full"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25
                }}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Video de Bienvenida
                  </h3>
                  <p className="text-white/80 mb-6">
                    A continuación, te presentamos un video introductorio donde conocerás nuestra empresa y 
                    nuestra historia. ¡Disfrútalo!
                  </p>
                  
                  {/* Reproductor de YouTube */}
                  <div
                    className="relative mb-6 rounded-xl overflow-hidden"
                    style={{ paddingBottom: '56.25%', height: 0 }} // Aspect ratio 16:9
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/tihpkwn53r0?autoplay=1&rel=0&modestbranding=1&showinfo=0"
                      title="Video de Bienvenida"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <motion.button
                    onClick={handleContinueAfterVideo}
                    className="px-8 py-3 rounded-xl font-bold text-lg bg-white text-primary hover:bg-white/90 hover:scale-105 shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continuar <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* Contenedor de entrada de nombre */}
          {animationStep === 3 && showNameInput && (
            <motion.div
              key="name-input"
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                className="w-48 h-48 mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1,
                  opacity: 1,
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  scale: { duration: 0.5, ease: "easeOut" },
                  opacity: { duration: 0.5, ease: "easeOut" },
                  rotate: { 
                    repeat: Infinity, 
                    duration: 6,
                    ease: "easeInOut" 
                  }
                }}
              >
                <img src="/img/syp.png" alt={`${companyConfig.companyName} Logo`} className="w-full h-full" />
              </motion.div>

              <motion.div
                className="mt-8 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    ¡Perfecto! Ahora cuéntanos tu nombre
                  </h3>
                  <p className="text-white/80 mb-6">
                    Máximo 40 caracteres para personalizar tu experiencia
                  </p>
                  
                  <motion.div
                    className="relative mb-6"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => {
                        if (e.target.value.length <= 40) {
                          setUserNameLocal(e.target.value)
                        }
                      }}
                      placeholder="Tu nombre aquí..."
                      className="w-full px-6 py-4 text-xl text-center bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all duration-300"
                      maxLength={40}
                      autoFocus
                    />
                    <div className="absolute -bottom-6 right-0 text-white/60 text-sm">
                      {userName.length}/40
                    </div>
                  </motion.div>
                  
                  <motion.button
                    onClick={handleStart}
                    disabled={userName.trim().length === 0}
                    className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                      userName.trim().length > 0
                        ? 'bg-white text-primary hover:bg-white/90 hover:scale-105 shadow-lg'
                        : 'bg-white/30 text-white/50 cursor-not-allowed'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={userName.trim().length > 0 ? { scale: 1.05 } : {}}
                    whileTap={userName.trim().length > 0 ? { scale: 0.95 } : {}}
                  >
                    ¡Empezar Aventura! <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Welcome