import React, { useState, useEffect } from 'react';
// ...existing code...
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faArrowLeft, 
  faTimes, 
  faPlay, 
  faTrophy, 
  faRocket, 
  faUsers, 
  faGem,
  faChevronUp,
  faChevronDown,
  faHandPointer,
  faStar,
  faGamepad
} from '@fortawesome/free-solid-svg-icons';

const OnboardingTour = ({ onComplete, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(isVisible);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Guardar el paso anterior para detectar la transición de 0 a 1
  const [prevStep, setPrevStep] = useState(0);

  const tourSteps = [
    {
      id: 'welcome',
      title: '¡Bienvenido a tu Aventura Épica! 🎮',
      description: 'Estás a punto de embarcarte en un viaje interactivo de aprendizaje donde cada nivel completado te acerca más a convertirte en un experto.',
      position: 'center',
      spotlight: null,
      icon: faRocket,
      gradient: 'from-purple-500 to-pink-500',
      action: 'Comenzar Tour'
    },
    {
      id: 'sidebar',
    title: 'Tu Panel de Control 📊',
    description: 'Aquí puedes ver tu progreso, experiencia acumulada y todos los logros que has desbloqueado. ¡Cada nivel completado te da más experiencia!',
    position: 'center',
      spotlight: { x: '0px', y: '0px', width: '320px', height: '100vh' },
      icon: faTrophy,
      gradient: 'from-blue-500 to-cyan-500',
      action: 'Siguiente'
    },
    {
      id: 'achievements',
    title: 'Tus Insignias de Logros 🏆',
    description: 'Cada círculo representa un nivel. Los dorados están completados, los azules están disponibles, y los grises están bloqueados.',
    position: 'center',
    spotlight: { x: '24px', y: '380px', width: '272px', height: '200px' },
      icon: faGem,
      gradient: 'from-yellow-500 to-orange-500',
      action: 'Siguiente'
    },
    {
      id: 'levels',
      title: 'Tu Mapa de Niveles 🗺️',
      description: 'Navega entre diferentes estaciones usando las flechas o las teclas ← →. Cada nivel tiene contenido único y desafíos emocionantes.',
      position: 'left',
      spotlight: { x: '320px', y: '0px', width: 'calc(100vw - 320px)', height: '100vh' },
      icon: faGamepad,
      gradient: 'from-green-500 to-teal-500',
      action: 'Siguiente'
    },
    {
      id: 'progress',
      title: 'Sistema de Progreso 📈',
      description: 'Completa niveles para desbloquear nuevos. Gana experiencia, sube de rango y colecciona logros. ¡Cada aventura cuenta!',
      position: 'center',
      spotlight: null,
      icon: faStar,
      gradient: 'from-indigo-500 to-purple-500',
      action: 'Finalizar Tour'
    }
  ];

  const currentStepData = tourSteps[currentStep];

  // Animación de entrada solo cuando el spotlight aparece por primera vez
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightAnim, setSpotlightAnim] = useState(false);
  useEffect(() => {
    // Solo animar cuando pasamos del paso 0 (bienvenida) al paso 1 (panel de control)
    if (prevStep === 0 && currentStep === 1 && showTour) {
      setShowSpotlight(false);
      setSpotlightAnim(false);
      setTimeout(() => {
        setShowSpotlight(true);
        setSpotlightAnim(true);
        setTimeout(() => setSpotlightAnim(false), 500);
      }, 50);
    } else {
      setShowSpotlight(true);
      setSpotlightAnim(false);
    }
  }, [currentStep, showTour, prevStep]);

  // Actualizar prevStep después de cada cambio de currentStep
  useEffect(() => {
    setPrevStep(currentStep);
  }, [currentStep]);

  // Sincronizar el estado interno con las props
  useEffect(() => {
    console.log('🎮 isVisible cambió a:', isVisible);
    setShowTour(isVisible);
  }, [isVisible]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  };

  const handleComplete = () => {
    setShowTour(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleStepClick = (index) => {
    if (index !== currentStep) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(index);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  };

  const handleSkip = () => {
    setShowTour(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  if (!showTour) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Overlay que difumina TODO excepto el área del spotlight */}
      {currentStepData.spotlight ? (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ease-in-out"
          style={{
            clipPath: `polygon(
              0% 0%, 
              0% 100%, 
              ${currentStepData.spotlight.x} 100%, 
              ${currentStepData.spotlight.x} ${currentStepData.spotlight.y}, 
              calc(${currentStepData.spotlight.x} + ${currentStepData.spotlight.width}) ${currentStepData.spotlight.y}, 
              calc(${currentStepData.spotlight.x} + ${currentStepData.spotlight.width}) calc(${currentStepData.spotlight.y} + ${currentStepData.spotlight.height}), 
              ${currentStepData.spotlight.x} calc(${currentStepData.spotlight.y} + ${currentStepData.spotlight.height}), 
              ${currentStepData.spotlight.x} 100%, 
              100% 100%, 
              100% 0%
            )`
          }}
        />
      ) : (
        /* Sin spotlight - overlay general suave */
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 ease-in-out" />
      )}
      
      {/* Borde destacado alrededor del área clara */}
        {currentStepData.spotlight && showSpotlight && (
          <div
            className={`absolute border-4 border-yellow-400/90 rounded-lg pointer-events-none transition-all duration-500 ease-in-out${spotlightAnim ? ' animate-spotlight-in' : ''}`}
            style={{
              left: currentStepData.spotlight.x,
              top: currentStepData.spotlight.y,
              width: currentStepData.spotlight.width,
              height: currentStepData.spotlight.height,
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.5)',
              animation: 'pulse-border 3s ease-in-out infinite'
            }}
          />
        )}
      
      {/* Contenido del tour */}
      <div className="relative h-full flex items-center justify-center p-8 pointer-events-auto">
        <div
          key={currentStep}
          className={`max-w-lg bg-gradient-to-br ${currentStepData.gradient} p-1 rounded-3xl shadow-2xl transition-all duration-300 ease-in-out transform ${
            isTransitioning ? 'opacity-0 scale-75 translate-y-8' : 'opacity-100 scale-100 translate-y-0'
          } ${
            currentStepData.position === 'left' ? 'mr-auto ml-8' :
            currentStepData.position === 'right' ? 'ml-auto mr-8' :
            'mx-auto'
          }`}
        >
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              {/* Header con icono */}
              <div className="text-center mb-6">
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${currentStepData.gradient} flex items-center justify-center shadow-2xl animate-bounce`}
                  style={{ animationDuration: '2s' }}
                >
                  <FontAwesomeIcon 
                    icon={currentStepData.icon} 
                    className="text-3xl text-white drop-shadow-lg" 
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3 animate-fade-in-up">
                  {currentStepData.title}
                </h2>
                
                <p className="text-white/80 leading-relaxed text-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  {currentStepData.description}
                </p>
              </div>

              {/* Indicador de progreso */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Progreso del Tour</span>
                  <span className="text-white text-sm font-semibold">
                    {currentStep + 1} de {tourSteps.length}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${currentStepData.gradient} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${((currentStep + 1) / tourSteps.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105 active:scale-95"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      Anterior
                    </button>
                  )}
                  
                  <button
                    onClick={handleSkip}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm border border-red-400/30 hover:scale-105 active:scale-95"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Saltar
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentStepData.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95`}
                >
                  {currentStepData.action}
                  {currentStep < tourSteps.length - 1 && (
                    <FontAwesomeIcon icon={faArrowRight} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Indicadores de pasos (dots) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          {tourSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 active:scale-90 ${
                index === currentStep 
                  ? 'bg-yellow-400 scale-125 shadow-lg shadow-yellow-400/50' 
                  : index < currentStep
                  ? 'bg-green-400'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              style={{
                animation: `fade-in 0.5s ease-out ${0.6 + index * 0.1}s both`
              }}
            />
          ))}
        </div>

        {/* Añadir estilos CSS en el head */}
        <style>{`
          @keyframes pulse-border {
            0%, 100% { 
              border-color: rgba(251, 191, 36, 0.7);
              box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
            }
            50% { 
              border-color: rgba(251, 191, 36, 1);
              box-shadow: 0 0 40px rgba(251, 191, 36, 0.6);
            }
          }

              @keyframes spotlight-in {
                0% {
                  opacity: 0;
                  transform: scale(0.7);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              .animate-spotlight-in {
                animation: spotlight-in 0.5s cubic-bezier(0.4,0,0.2,1);
              }
  // Guardar el paso anterior para detectar la transición de null a spotlight
  const [prevStep, setPrevStep] = useState(0);
  useEffect(() => {
    setPrevStep(currentStep);
  }, [currentStep]);
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
  );
};

export default OnboardingTour;