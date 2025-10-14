import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faStar, 
  faCheck, 
  faTimes,
  faBook,
  faUserShield,
  faClipboardCheck,
  faHardHat,
  faShield,
  faBuilding,
  faPlay,
  faTrophy,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const ValuesGameLevel = () => {
  const navigate = useNavigate();
  const { completeLevel } = useAppContext();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const sectionData = [
    {
      title: 'Normatividad de SST',
      icon: faBook,
      items: [
        'DECRETO 1072 DE 2015 - Unifica en un solo cuerpo normativo la reglamentación laboral en Colombia. En materia de SG-SST, establece la obligación para todos los empleadores de implementar el sistema como requisito legal.',
        'RESOLUCIÓN 0312 DE 2019 - Fija los requisitos básicos que deben cumplir las empresas en Seguridad y Salud en el Trabajo, de acuerdo con su tamaño y nivel de riesgo, para evaluar y garantizar la implementación del SG-SST. '
      ]
    },
    {
      title: 'Objetivos del SG-SST',
      icon: faShield,
      items: [
        'Identificar los peligros, evaluar, valorar y controlar los riesgos',
        'Proteger la seguridad y salud de todos los trabajadores mediante mejora continua',
        'Cumplir la normatividad nacional vigente en materia de riesgos laborales'
      ]
    },
    {
      title: 'Responsabilidades de la Dirección',
      icon: faBuilding,
      items: [
        'Disponer de recursos humanos, técnicos y financieros necesarios',
        'Participar en revisiones periódicas y establecimiento de objetivos',
        'Elaboración e implementación de Política y Objetivos de SST',
        'Cumplir requisitos legales y contractuales en SST',
        'Designar a los responsables del SG-SST',
        'Solicitar que se presenten informes sobre desempeño del SG-SST para su revisión',
        'Participar en auditorias internas al SG-SST',
        'Definir y hacer seguimiento a objetivos y metas del SST'
      ]
    },
    {
      title: 'Responsabilidades de los Trabajadores',
      icon: faUserShield,
      items: [
        'Procurar el cuidado integral de su salud',
        'Suministrar información clara y veraz sobre su estado de salud',
        'Cumplir normas, reglamentos e instrucciones de SGSST',
        'Informar sobre peligros y riesgos en el trabajo',
        'Participar en capacitaciones de seguridad y salud',
        'Contribuir al cumplimiento de objetivos del SG-SST',
        'Informar accidentes y participar en investigaciones'
      ]
    }
  ];

  const quizQuestions = [
    {
      question: "Uno de los objetivos principales del SG-SST es ________",
      options: [
        "Mejorar la seguridad y salud de los trabajadores",
        "Reducir costos de producción",
        "Aumentar la productividad",
        "Minimizar el personal requerido"
      ],
      correctAnswer: 0,
      explanation: "El SG-SST tiene como objetivo principal proteger la seguridad y salud de todos los trabajadores mediante la mejora continua."
    },
    {
      question: "Es una responsabilidad de la dirección en el SG-SST:",
      options: [
        "Informar sobre accidentes menores",
        "Disponer de recursos necesarios para implementar el sistema",
        "Participar en capacitaciones básicas",
        "Mantener limpio el espacio de trabajo"
      ],
      correctAnswer: 1,
      explanation: "La dirección debe disponer oportunamente de los recursos humanos, técnicos y financieros necesarios para la implementación efectiva del sistema."
    },
    {
      question: "Los trabajadores deben ________ en el SG-SST:",
      options: [
        "Solo asistir a las capacitaciones",
        "Únicamente reportar accidentes graves",
        "Procurar el cuidado integral de su salud",
        "Evitar participar en las investigaciones"
      ],
      correctAnswer: 2,
      explanation: "Es responsabilidad fundamental de los trabajadores procurar el cuidado integral de su salud."
    },
    {
      question: "La normatividad principal del SG-SST incluye:",
      options: [
        "Ley 100 de 1993",
        "Decreto 1072 de 2015",
        "Ley 50 de 1990",
        "Decreto 2020 de 2019"
      ],
      correctAnswer: 1,
      explanation: "El Decreto 1072 de 2015 es el Decreto Único Reglamentario del Sector Trabajo y es fundamental para el SG-SST."
    },
    {
      question: "Una responsabilidad clave de los trabajadores es:",
      options: [
        "Elaborar políticas de SST",
        "Asignar recursos financieros",
        "Informar sobre peligros y riesgos",
        "Definir estándares mínimos"
      ],
      correctAnswer: 2,
      explanation: "Los trabajadores deben informar oportunamente sobre los peligros y riesgos latentes en su sitio de trabajo."
    }
  ];

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setGameCompleted(false);
    setShowCelebration(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === quizQuestions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 20);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      
      if (!isCorrect) {
        // Si la respuesta es incorrecta, volver a la primera pregunta
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
      } else if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setGameCompleted(true);
        setShowCelebration(true);
        if (score >= 60) {
          completeLevel(3);
          setShowLoading(true);
          setTimeout(() => {
            setShowLoading(false);
            navigate('/achievement/3');
          }, 2000);
        }
      }
    }, 2000);
  };

  // Memoizar las estrellas del fondo
  const stars = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2
    }));
  }, []);

  // Variants para animaciones escalonadas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } },
  };

  return (
  <React.Fragment>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 fixed inset-0 overflow-hidden -z-10">
        {/* Estrellas animadas - fondo fijo */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-star-twinkle"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <motion.button
                onClick={() => showQuiz ? setShowQuiz(false) : navigate('/map')}
                className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors px-4 py-2 rounded-lg"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>{showQuiz ? 'Volver a información' : 'Volver al mapa'}</span>
              </motion.button>

              <div className="flex items-center gap-4">
                {showQuiz && (
                  <>
                    <motion.div
                      className="text-white text-lg bg-white/10 px-4 py-2 rounded-lg"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.1 }}
                    >
                      Puntuación: <span className="font-bold text-yellow-400">{score}</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2 text-white/80"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.25 }}
                    >
                      <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
                      <span>Nivel: {score >= 60 ? 'Aprobado' : 'En progreso'}</span>
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            <motion.h1 
              className="text-4xl font-bold text-center text-white mb-4"
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.3 
              }}
            >
              SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO
            </motion.h1>

            <motion.p
              className="text-center text-purple-200 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.5 }}
            >
              Conoce los aspectos fundamentales del SG-SST, sus normativas, objetivos y responsabilidades tanto de la dirección como de los trabajadores.
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {!showQuiz ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Pestañas para información del SG-SST */}
                <motion.div 
                  className="mb-8"
                  variants={sectionVariants}
                >
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {sectionData.map((section, index) => (
                      <motion.button
                        key={section.title}
                        onClick={() => setActiveTab(index)}
                        className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          activeTab === index 
                            ? 'bg-purple-600 text-white shadow-lg' 
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variants={sectionVariants}
                        transition={{ delay: index * 0.1 }}
                      >
                        <FontAwesomeIcon icon={section.icon} className="text-sm" />
                        <span>{section.title}</span>
                      </motion.button>
                    ))}
                  </div>
                  {/* Contenido de la pestaña activa */}
                  <motion.div
                    key={activeTab}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
                    variants={sectionVariants}
                  >
                    <div className="flex items-center mb-4">
                      <FontAwesomeIcon icon={sectionData[activeTab].icon} className="text-2xl text-yellow-400 mr-3" />
                      <h3 className="text-xl font-bold text-white">{sectionData[activeTab].title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {sectionData[activeTab].items.map((item, i) => (
                        <motion.li 
                          key={i} 
                          className="text-white/90 flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          variants={sectionVariants}
                          transition={{ delay: i * 0.1 }}
                        >
                          <span className="text-yellow-400 mt-1 flex-shrink-0">
                            <FontAwesomeIcon icon={faCheck} className="text-sm" />
                          </span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>

                {/* Botón Iniciar Prueba */}
                <motion.div
                  className="text-center"
                  variants={sectionVariants}
                >
                  <motion.button
                    onClick={() => setShowQuiz(true)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-xl 
                      font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 
                      transition-all duration-300 flex items-center gap-3 mx-auto group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon 
                      icon={faGraduationCap} 
                      className="group-hover:animate-bounce" 
                    />
                    <span>Iniciar Prueba de Conocimiento</span>
                    <FontAwesomeIcon 
                      icon={faPlay} 
                      className="text-sm" 
                    />
                  </motion.button>
                  
                  <p className="text-white/60 mt-4 max-w-2xl mx-auto">
                    La prueba consta de {quizQuestions.length} preguntas. Deberás obtener al menos 60 puntos para aprobar. 
                    <span className="block mt-1 text-yellow-300">¡Si fallas una pregunta, tendrás que comenzar de nuevo!</span>
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              /* Contenido del Quiz */
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="max-w-4xl mx-auto"
              >
                {/* Encabezado del quiz */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold">Prueba de Conocimiento SG-SST</h3>
                    <p className="text-purple-200">Pregunta {currentQuestionIndex + 1} de {quizQuestions.length}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{score}</span>
                    </div>
                    <span className="text-white">Puntos</span>
                  </div>
                </div>
                
                {/* Barra de progreso */}
                <div className="w-full bg-white/20 rounded-full h-3 mb-6 relative">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                    {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}% completado
                  </div>
                </div>

                {/* Pregunta actual */}
                <motion.div 
                  className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      {currentQuestionIndex + 1}
                    </span>
                    {quizQuestions[currentQuestionIndex].question}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.button
                          onClick={() => handleAnswerSelect(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex items-start gap-3 ${
                            selectedAnswer === null 
                              ? 'bg-white/10 hover:bg-white/20 text-white' 
                              : selectedAnswer === index
                                ? index === quizQuestions[currentQuestionIndex].correctAnswer
                                  ? 'bg-green-500/20 border-2 border-green-500 text-green-300'
                                  : 'bg-red-500/20 border-2 border-red-500 text-red-300'
                                : 'bg-white/5 text-white/50'
                          }`}
                          whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                          whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        >
                          <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-lg">{option}</span>
                          {selectedAnswer === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="ml-auto"
                            >
                              <FontAwesomeIcon 
                                icon={index === quizQuestions[currentQuestionIndex].correctAnswer ? faCheck : faTimes}
                                className={
                                  index === quizQuestions[currentQuestionIndex].correctAnswer 
                                    ? 'text-green-400' 
                                    : 'text-red-400'
                                }
                              />
                            </motion.div>
                          )}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal de retroalimentación */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeedback(false)}
            >
              <motion.div
                className={`bg-slate-900/90 backdrop-blur-md shadow-xl rounded-xl p-8 max-w-md w-full mx-4 text-center ${
                  selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer
                    ? 'ring-4 ring-green-400/50'
                    : 'ring-4 ring-red-400/50'
                }`}
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: -50 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 ${
                  selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer
                    ? 'bg-green-500/20'
                    : 'bg-red-500/20'
                }`}>
                  <FontAwesomeIcon 
                    icon={selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer ? faCheck : faTimes}
                    className={`text-4xl ${
                      selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer
                        ? 'text-green-500/90'
                        : 'text-red-500/90'
                    }`}
                  />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer
                    ? '¡Respuesta Correcta! +20 puntos'
                    : '¡Respuesta Incorrecta!'}
                </h3>
                <p className="text-white/80 mb-6">
                  {quizQuestions[currentQuestionIndex].explanation}
                </p>
                <motion.button
                  onClick={() => setShowFeedback(false)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer ? 'Continuar' : 'Reintentar'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

  {/* Confetti eliminado por solicitud */}
        
        {/* Animación de carga visual al finalizar el quiz */}
        <AnimatePresence>
          {showLoading && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-slate-900/80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="flex flex-col items-center gap-4 bg-slate-800/90 backdrop-blur-md p-8 rounded-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div className="relative">
                  <svg className="animate-spin h-16 w-16 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <FontAwesomeIcon icon={faTrophy} className="text-2xl text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <span className="text-white text-xl font-bold text-center">
                  ¡Felicidades!<br />
                  <span className="text-yellow-400">Logro desbloqueado</span>
                </span>
                <span className="text-white/70">Redirigiendo...</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  {/* Fin del contenido principal */}
  {/* El fondo ahora está fuera del motion.div principal */}
  </React.Fragment>
  );
}

export default ValuesGameLevel;