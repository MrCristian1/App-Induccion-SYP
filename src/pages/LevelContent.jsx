import React, { useState, useEffect, useContext } from 'react';
import CommitteeLevel from '../components/CommitteeLevel';
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faArrowRight, 
  faCheckCircle, 
  faTimesCircle, 
  faTrophy, 
  faBookOpen, 
  faPlayCircle, 
  faLock, 
  faEye,
  faClock,
  faUserTie,
  faShieldAlt,
  faUsers,
  faStar,
  faChevronDown,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '../context/AppContext'
import Confetti from '../components/Confetti'
import PoliciesLevel from '../components/PoliciesLevel'
import CompanyServicesLevel from '../components/CompanyServicesLevel'
import ValuesGameLevel from '../components/ValuesGameLevel'
import HierarchyLevel from '../components/HierarchyLevel'
import AccidentLevel from '../components/AccidentLevel'
import QualityLevel from '../components/QualityLevel'
import ProcessMapLevel from '../components/ProcessMapLevel'
import ACRLevel from '../components/ACRLevel'

const LevelContent = () => {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const { 
    levelsData, 
    isLevelUnlocked,
    quizAnswers,
    selectQuizAnswer,
    checkQuizAnswers,
    resetQuizAnswers,
    completeLevel
  } = useAppContext()
  
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizResults, setQuizResults] = useState(null)
  
  const levelIdNum = parseInt(levelId)
  const level = levelsData.find(l => l.id === levelIdNum)
  
  useEffect(() => {
    // Verificar si el nivel existe y está desbloqueado
    // if (!level || !isLevelUnlocked(levelIdNum)) {
    //   navigate('/map')
    //   return
    // }
    // Resetear las respuestas del quiz al cargar un nuevo nivel
    resetQuizAnswers()
    setShowQuiz(false)
    setQuizResults(null)
    // Eliminamos resetQuizAnswers de las dependencias para evitar el bucle infinito
  }, [levelId, level, isLevelUnlocked, navigate, levelIdNum])
  
  const handleBackToMap = () => {
    navigate('/map')
  }
  
  const handleShowQuiz = () => {
    setShowQuiz(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleSelectAnswer = (questionIndex, optionIndex) => {
    if (quizResults) return // No permitir cambios después de verificar
    selectQuizAnswer(questionIndex, optionIndex)
  }
  
  const handleCheckAnswers = () => {
    const results = checkQuizAnswers(levelIdNum)
    setQuizResults(results)
    
    // Si aprobó, mostrar pantalla de logro después de un breve retraso
    if (results.passed) {
      // Verificar si es el penúltimo nivel
      const isPenultimateLevel = levelIdNum === levelsData.length - 1
      
      setTimeout(() => {
        // Si es el penúltimo nivel, asegurarse de que la navegación funcione correctamente
        if (isPenultimateLevel) {
          // Primero completamos el nivel en el contexto
          completeLevel(levelIdNum)
          // Luego navegamos a la pantalla de logro
          navigate(`/achievement/${levelIdNum}`)
        } else {
          navigate(`/achievement/${levelIdNum}`)
        }
      }, 2000)
    }
  }
  
  if (!level) return null
  // if (levelIdNum === 5) {
  //   return <CommitteeLevel />;
  // }
  
  // Estado para controlar la animación del contenido
  const [activeSection, setActiveSection] = useState(0);
  const [expandedSections, setExpandedSections] = useState([0]);

  // Función para alternar la expansión de una sección
  const toggleSection = (index) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter(i => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
    setActiveSection(index);
  };

  // Renderizar el contenido del nivel de forma interactiva
  const renderContent = () => {
    // Para otros niveles, mostrar el contenido tradicional
    // Agrupar el contenido por secciones
    const sections = [];
    let currentSection = { title: '', items: [] };
    
    level.content.forEach((item, index) => {
      if (item.type === 'heading') {
        // Si ya tenemos una sección con contenido, la guardamos
        if (currentSection.items.length > 0) {
          sections.push({...currentSection});
        }
        // Iniciamos una nueva sección
        currentSection = { title: item.text, items: [] };
      } else {
        // Añadimos el item a la sección actual
        currentSection.items.push(item);
      }
      
      // Si es el último item, guardamos la sección actual
      if (index === level.content.length - 1 && currentSection.items.length > 0) {
        sections.push({...currentSection});
      }
    });
    
    // Si no hay secciones definidas, creamos una con todo el contenido
    if (sections.length === 0 && level.content.length > 0) {
      sections.push({
        title: level.title,
        items: level.content
      });
    }
    
    return (
      <div className="space-y-6">
        {sections.map((section, sIndex) => {
          const isExpanded = expandedSections.includes(sIndex);
          const isActive = activeSection === sIndex;
          
          return (
            <motion.div 
              key={sIndex} 
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${isActive ? 'ring-2 ring-primary' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIndex * 0.1, duration: 0.3 }}
            >
              <motion.div 
                className={`p-4 cursor-pointer bg-gradient-to-r ${isActive ? 'from-primary-light to-secondary-light' : 'from-gray-50 to-gray-100'} flex justify-between items-center`}
                onClick={() => toggleSection(sIndex)}
                whileHover={{ backgroundColor: '#f3f4f6' }}
              >
                <h4 className={`font-bold text-lg ${isActive ? 'text-primary-dark' : 'text-gray-700'}`}>
                  {section.title}
                </h4>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-sm ${isActive ? 'text-primary' : 'text-gray-500'}`} 
                  />
                </motion.div>
              </motion.div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    className="p-6 bg-white"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="prose max-w-none">
                      {section.items.map((item, iIndex) => {
                        switch (item.type) {
                          case 'subheading':
                            return <h4 key={iIndex} className="text-xl font-semibold text-accent mt-6 mb-2">{item.text}</h4>
                          case 'paragraph':
                            return (
                              <motion.p 
                                key={iIndex} 
                                className="text-gray-700 mb-4 leading-relaxed"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: iIndex * 0.1, duration: 0.3 }}
                              >
                                {item.text}
                              </motion.p>
                            )
                          default:
                            return null
                        }
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    )
  }
  
  // Estado para controlar la pregunta actual del quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Si es el nivel de políticas (nivel 1), usar el componente especializado
  if (level && level.policies) {
    return <PoliciesLevel level={level} onStartQuiz={() => setShowQuiz(true)} />
  }
  // Si es el nivel de accidentalidad (nivel 4), usar el componente especializado
  if (level && level.id === 4) {
    return <AccidentLevel />
  }

  // Si es el nivel de funciones de la empresa (nivel 2), usar el componente especializado
  if (level && level.id === 2) {
    return <CompanyServicesLevel level={level} onStartQuiz={() => setShowQuiz(true)} />
  }

  // Si es el nivel de valores, misión y visión (nivel 3), usar el componente de juego interactivo
  if (level && level.type === 'interactive-game') {
    return <ValuesGameLevel />
  }

  // Si es el nivel de jerarquía y estructura organizacional (nivel 6), usar el componente especializado
  if (level && level.id === 6) {
    return <HierarchyLevel onComplete={() => navigate(`/achievement/${levelIdNum}`)} />
  }

  // Si es el nivel de comités (nivel 5), usar el componente especializado
  if (level && level.id === 5) {
    return <CommitteeLevel onComplete={() => navigate(`/achievement/${levelIdNum}`)} />
  }


  // Si es el nivel de gestión de calidad (nivel 7), usar el componente especializado
  if (level && level.id === 7) {
    return <QualityLevel />
  }

  // Si es el nivel de mapa de procesos (nivel 8), usar el componente especializado
  if (level && level.id === 8) {
    return <ProcessMapLevel />
  }

  // Si es el nivel de Fundamentos ACR (nivel 9), usar el componente especializado
  if (level && level.id === 9) {
    return <ACRLevel />
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < level.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Función para navegar a la pregunta anterior
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Función para navegar a una pregunta específica
  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  // Renderizar el quiz
  const renderQuiz = () => {
    const question = level.quiz[currentQuestionIndex]
    const isAnswered = quizAnswers[currentQuestionIndex] !== undefined
    
    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-secondary">Pon a prueba tus conocimientos</h3>
          <div className="text-sm text-primary-dark">
            Pregunta {currentQuestionIndex + 1} de {level.quiz.length}
          </div>
        </div>
        
        {/* Navegación de preguntas */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {level.quiz.map((_, index) => {
              const isActive = index === currentQuestionIndex
              const isAnsweredQuestion = quizAnswers[index] !== undefined
              
              return (
                <motion.div
                  key={index}
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                    ${isActive ? 'bg-primary text-white' : isAnsweredQuestion ? 'bg-primary-light text-primary-dark' : 'bg-gray-100 text-gray-500'}
                    ${isAnsweredQuestion ? 'border-2 border-primary' : ''}`}
                  onClick={() => handleGoToQuestion(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {index + 1}
                </motion.div>
              )
            })}
          </div>
        </div>
        
        {/* Pregunta actual */}
        <motion.div 
          key={currentQuestionIndex}
          className="bg-white p-8 rounded-xl shadow-lg mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-medium text-lg mb-6 text-primary-dark">{currentQuestionIndex + 1}. {question.question}</p>
          
          <div className="space-y-3">
            {question.options.map((option, oIndex) => {
              const isSelected = quizAnswers[currentQuestionIndex] === oIndex
              const isCorrect = quizResults && question.correctAnswer === oIndex
              const isIncorrect = quizResults && isSelected && !isCorrect
              
              return (
                <motion.div 
                  key={oIndex} 
                  className={`p-4 border-2 rounded-xl cursor-pointer flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300
                    ${isSelected ? 'border-primary bg-primary-light' : 'border-gray-200 bg-white'}
                    ${isCorrect && quizResults ? 'border-success bg-success-light' : ''}
                    ${isIncorrect ? 'border-secondary bg-secondary-light' : ''}
                  `}
                  onClick={() => handleSelectAnswer(currentQuestionIndex, oIndex)}
                  whileHover={quizResults ? {} : { scale: 1.02 }}
                  whileTap={quizResults ? {} : { scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3
                      ${isSelected ? 'border-primary text-primary' : 'border-gray-300 text-gray-300'}
                      ${isCorrect && quizResults ? 'border-success text-success' : ''}
                      ${isIncorrect ? 'border-secondary text-secondary' : ''}
                    `}>
                      {isSelected && (
                        <FontAwesomeIcon 
                          icon={isIncorrect ? faTimes : faCheck} 
                          size="xs" 
                        />
                      )}
                    </div>
                    <span className={`font-medium
                      ${isSelected ? 'text-primary-dark' : 'text-gray-700'}
                      ${isCorrect && quizResults ? 'text-success-dark' : ''}
                      ${isIncorrect ? 'text-secondary-dark' : ''}
                    `}>
                      {option}
                    </span>
                  </div>
                  
                  {isCorrect && quizResults && (
                    <motion.div 
                      className="bg-success text-white text-xs px-2 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      Correcto
                    </motion.div>
                  )}
                  
                  {isIncorrect && (
                    <motion.div 
                      className="bg-secondary text-white text-xs px-2 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      Incorrecto
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
        
        {/* Navegación entre preguntas */}
        <div className="flex justify-between mt-6">
          <motion.button
            className={`px-4 py-2 rounded-lg flex items-center ${currentQuestionIndex > 0 ? 'bg-primary-light text-primary' : 'bg-gray-100 text-gray-400'}`}
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            whileHover={currentQuestionIndex > 0 ? { scale: 1.05 } : {}}
            whileTap={currentQuestionIndex > 0 ? { scale: 0.95 } : {}}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Anterior
          </motion.button>
          
          {currentQuestionIndex < level.quiz.length - 1 ? (
            <motion.button
              className={`px-4 py-2 rounded-lg flex items-center ${isAnswered ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              whileHover={isAnswered ? { scale: 1.05 } : {}}
              whileTap={isAnswered ? { scale: 0.95 } : {}}
            >
              Siguiente
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </motion.button>
          ) : (
            quizResults ? (
              <div className="mt-6 p-4 rounded-lg text-center">
                <p className="text-lg">
                  Has acertado <span className="font-bold">{quizResults.correct}</span> de <span className="font-bold">{quizResults.total}</span> preguntas.
                </p>
                
                {quizResults.passed ? (
                  <p className="text-success font-medium mt-2">¡Felicidades! Has aprobado este nivel.</p>
                ) : (
                  <div>
                    <p className="text-secondary font-medium mt-2">No has alcanzado el mínimo requerido. Intenta nuevamente.</p>
                    <motion.button 
                      className="bg-primary text-white px-6 py-2 rounded-lg mt-4 flex items-center justify-center"
                      onClick={() => {
                        resetQuizAnswers()
                        setQuizResults(null)
                        setCurrentQuestionIndex(0)
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                      Reintentar
                    </motion.button>
                  </div>
                )}
              </div>
            ) : (
              <motion.button 
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center"
                onClick={handleCheckAnswers}
                disabled={Object.keys(quizAnswers).length < level.quiz.length}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Verificar Respuestas
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </motion.button>
            )
          )}
        </div>
      </div>
    )
  }
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-light to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <motion.button 
              onClick={handleBackToMap}
              className="mr-6 text-secondary hover:text-primary transition-colors bg-white p-3 rounded-full shadow-md"
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </motion.button>
            <div>
              <h2 className="text-3xl font-bold text-secondary">{level.title}</h2>
              <div className="text-accent mt-1 flex items-center">
                <span className="mr-2">Nivel {levelIdNum} de {levelsData.length}</span>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(levelIdNum / levelsData.length) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <motion.div 
              className="inline-block bg-white p-3 rounded-xl shadow-md"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-medium text-secondary">{level.title}</span>
            </motion.div>
          </div>
        </div>
        
        {/* Content */}
        <div className="mb-8">
          {!showQuiz ? (
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Content Navigation */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-secondary">Contenido</h3>
                <div className="text-sm text-accent">
                  Desplázate para leer todo el contenido
                </div>
              </div>
              
              <div className="prose max-w-none prose-headings:text-secondary prose-a:text-primary">
                {renderContent()}
              </div>
              
              {!level.policies && (
                <motion.div 
                  className="mt-10 flex justify-center items-center bg-gray-50 p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center mb-4">
                    <h4 className="font-bold text-xl text-secondary">¿Listo para poner a prueba tus conocimientos?</h4>
                    <p className="text-sm text-gray-600 mt-2">Completa el quiz para avanzar al siguiente nivel</p>
                  </div>
                  
                  <motion.button
                    onClick={handleShowQuiz}
                    className="bg-gradient-to-r from-primary to-primary-dark text-white py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center mx-auto mt-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Tomar el Quiz <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
            >
              {/* Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary"></div>
                <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-secondary"></div>
              </div>
              
              <div className="relative z-10">
                {renderQuiz()}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default LevelContent