import OptimizedImage from './OptimizedImage';
import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faSpinner, faRocket, faUsers, faCog,
  faCheck, faTimes, faChartLine, faBuilding, faHandshake,
  faTrophy, faStar, faMedal, faLightbulb, faInfoCircle,
  faChevronDown, faChevronUp, faExpand
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';


// Componente ProcessCard separado para manejar su propio estado
const ProcessCard = ({ process, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = useMemo(() => ({
    strategic: {
      name: 'Procesos Estratégicos',
      icon: faRocket,
      color: 'from-blue-800 to-blue-900',
      bgColor: 'bg-blue-800/20',
      borderColor: 'border-blue-700/50',
      emoji: '🎯',
      description: 'Definen el rumbo y objetivos a largo plazo de la organización'
    },
    support: {
      name: 'Procesos de Apoyo',
      icon: faUsers,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/50',
      emoji: '🤝',
      description: 'Brindan soporte para el funcionamiento de otros procesos'
    },
    operational: {
      name: 'Procesos Misionales',
      icon: faCog,
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/50',
      emoji: '⚙️',
      description: 'Generan el valor principal para los clientes y stakeholders'
    }
  }), []);

  const toggleProcess = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-4"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-gradient-to-r ${categories[process.category].color} backdrop-blur-md rounded-xl p-4 border-2 ${categories[process.category].borderColor} shadow-lg cursor-pointer`}
        onClick={toggleProcess}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={process.icon} className="text-white text-xl" />
            <span className="text-white font-semibold text-sm">{process.name}</span>
          </div>
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className="text-white"
          />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 overflow-hidden"
            >
              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <p className="text-white text-xs leading-relaxed">{process.description}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-white/80 text-xs bg-black/20 px-2 py-1 rounded">
                    {categories[process.category].name}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const ProcessMapLevel = () => {
  const navigate = useNavigate();
  const { completeLevel } = useAppContext();

  // Estados del juego
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [usedProcesses, setUsedProcesses] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showNewInfo, setShowNewInfo] = useState(false);

  // NUEVA INFORMACIÓN - Datos actualizados con las descripciones completas
  const newProcessInfo = useMemo(() => ({
    'Direccionamiento estratégico': 'Definir los lineamientos estratégicos en la compañía para lograr el crecimiento y posicionamiento en el mercado de la pequeña y mediana empresa en Colombia.',
    'Gestión del talento humano': 'Planear, organizar, ejecutar y controlar las acciones que promuevan la provisión y desarrollo del talento humano, bienestar y mejoramiento de las competencias laborales, la seguridad y salud en el trabajo, asi como la gestión de situaciones administrativas que se generen en el ingreso, permanencia o retiro del personal de la Entidad.',
    'Gestión administrativa y Financiera': 'Gestionar eficientemente la relación con proveedores, garantizar un proceso de facturación preciso y oportuno, y administrar la información financiera mediante el análisis de indicadores clave, con el fin de apoyar la toma de decisiones estratégicas y contribuir al cumplimiento de los objetivos organizacionales.',
    'Gestión Integral': 'Administrar el sistema de gestión integral para verificar el cumplimiento y mejora en los procesos de la organización.',
    'Servicio al cliente': 'Garantizar el cumplimiento de los niveles de servicios contratados para lograr la satisfacción del cliente.',
    'Gestión comercial y mercadeo': 'Conseguir nuevos clientes para lograr el cumpliento del plan de Marketing.',
    'Administración de nomina': 'Gestionar novedades para calcular las compensaciones de los trabajadores de acuerdo a la legislación laboral aplicable, permitiendo a nuestros clientes enfocarse en su actividad principal.',
    'Outsourcing de tesorería': 'Asegurar la correcta administración y control de los recursos económicos, así como la gestión adecuada de los procesos, cumpliendo con los plazos y obligaciones establecidas por las partes interesadas evitando sanciones por incumplimiento.',
    'Administración de personal': 'Gestionar los procesos de vinculación y retiro de los trabajadores solicitados por el cliente de acuerdo a la legislación laboral aplicable, permitiendo a nuestros clientes enfocarse en su actividad principal.',
    'Selección de personal': 'Realizar la selección de cargos operativos, administrativos y de alta Gerencia que soliciten los clientes externos, teniendo en cuenta las exigencias requeridas por el cargo, el tipo de cliente y su cultura organizacional.',
    'Employer of record': 'Gestionar integralmente los procesos de Employer of Record para clientes trasnacionales e internacionales, canalizando actividades de nómina y administración de personal, para asegurar que los pagos a empleados se alineen con la facturación mensual y cumplan los acuerdos establecidos.'
  }), []);

  // Datos de los procesos y categorías
  const processes = useMemo(() => [
    {
      name: 'Direccionamiento estratégico',
      category: 'strategic',
      icon: faRocket,
      description: newProcessInfo['Direccionamiento estratégico']
    },
    {
      name: 'Gestión del talento humano',
      category: 'support',
      icon: faUsers,
      description: newProcessInfo['Gestión del talento humano']
    },
    {
      name: 'Gestión administrativa y Financiera',
      category: 'support',
      icon: faBuilding,
      description: newProcessInfo['Gestión administrativa y Financiera']
    },
    {
      name: 'Gestión Integral',
      category: 'support',
      icon: faCog,
      description: newProcessInfo['Gestión Integral']
    },
    {
      name: 'Servicio al cliente',
      category: 'operational',
      icon: faHandshake,
      description: newProcessInfo['Servicio al cliente']
    },
    {
      name: 'Gestión comercial y mercadeo',
      category: 'operational',
      icon: faChartLine,
      description: newProcessInfo['Gestión comercial y mercadeo']
    },
    {
      name: 'Administración de nomina',
      category: 'operational',
      icon: faUsers,
      description: newProcessInfo['Administración de nomina']
    },
    {
      name: 'Outsourcing de tesorería',
      category: 'operational',
      icon: faBuilding,
      description: newProcessInfo['Outsourcing de tesorería']
    },
    {
      name: 'Administración de personal',
      category: 'operational',
      icon: faUsers,
      description: newProcessInfo['Administración de personal']
    },
    {
      name: 'Selección de personal',
      category: 'operational',
      icon: faUsers,
      description: newProcessInfo['Selección de personal']
    },
    {
      name: 'Employer of record',
      category: 'operational',
      icon: faHandshake,
      description: newProcessInfo['Employer of record']
    }
  ], [newProcessInfo]);

  // Categorías (para usar en otros lugares del componente)
  const categories = useMemo(() => ({
    strategic: {
      name: 'Procesos Estratégicos',
      icon: faRocket,
      color: 'from-blue-800 to-blue-900',
      bgColor: 'bg-blue-800/20',
      borderColor: 'border-blue-700/50',
      emoji: '🎯',
      description: 'Definen el rumbo y objetivos a largo plazo de la organización'
    },
    support: {
      name: 'Procesos de Apoyo',
      icon: faUsers,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/50',
      emoji: '🤝',
      description: 'Brindan soporte para el funcionamiento de otros procesos'
    },
    operational: {
      name: 'Procesos Misionales',
      icon: faCog,
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/50',
      emoji: '⚙️',
      description: 'Generan el valor principal para los clientes y stakeholders'
    }
  }), []);

  // Animación de estrellas de fondo
  const stars = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      size: Math.random() * 3 + 1
    }));
  }, []);

  const handleBackToMap = () => {
    navigate('/map');
  };

  const handleBackToLevel = () => {
    // Resetear todos los estados del quiz y volver al estado inicial
    setShowQuiz(false);
    setShowImage(true);
    setGameCompleted(false);
    setShowCelebration(false);
    setUsedProcesses([]);
    setCurrentProcess(null);
    setSelectedCategory(null);
    setShowFeedback(false);
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setIsSpinning(false);
    setShowNewInfo(false);
    setShowTutorial(false);
  };

  // MODIFICADO: Función para iniciar el desafío
  const handleStartChallenge = () => {
    setShowTutorial(true);
    setShowImage(false);
  };

  const toggleNewInfo = () => {
    setShowNewInfo(!showNewInfo);
  };

  // MODIFICADO: Función para cerrar el tutorial e iniciar el quiz
  const closeTutorial = () => {
    setShowTutorial(false);
    setShowQuiz(true);
    localStorage.setItem('processMapTutorialSeen', 'true');
  };

  const spinRoulette = () => {
    if (isSpinning) return;

    const availableProcesses = processes.filter(process =>
      !usedProcesses.includes(process.name)
    );

    if (availableProcesses.length === 0) {
      setGameCompleted(true);
      setShowCelebration(true);
      if (score >= 7) {
        completeLevel(8);
      }
      return;
    }

    setIsSpinning(true);
    setSelectedCategory(null);
    setShowFeedback(false);

    const spinDuration = 2000;
    const startTime = Date.now();

    const spinInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= spinDuration) {
        clearInterval(spinInterval);
        const randomIndex = Math.floor(Math.random() * availableProcesses.length);
        const selectedProcess = availableProcesses[randomIndex];
        setCurrentProcess(selectedProcess);
        setUsedProcesses(prev => [...prev, selectedProcess.name]);
        setIsSpinning(false);
      }
    }, 100);
  };

  const handleCategorySelect = (categoryKey) => {
    if (!currentProcess || selectedCategory) return;

    setSelectedCategory(categoryKey);
    setTotalQuestions(prev => prev + 1);

    setTimeout(() => {
      const isCorrect = currentProcess.category === categoryKey;
      if (isCorrect) {
        setScore(prev => prev + 1);
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
      setShowFeedback(true);

      if (usedProcesses.length >= processes.length - 1) {
        setTimeout(() => {
          setGameCompleted(true);
          setShowCelebration(true);
          if ((isCorrect ? score + 1 : score) >= 7) {
            completeLevel(8);
          }
        }, 2000);
      }
    }, 500);
  };

  const nextRound = () => {
    setCurrentProcess(null);
    setSelectedCategory(null);
    setShowFeedback(false);
  };

  const finishGame = () => {
    if (score >= 7) {
      navigate('/achievement/8');
    } else {
      handleBackToLevel();
    }
  };

  const handleCompleteLevel = () => {
    completeLevel(8);
    setTimeout(() => {
      navigate('/achievement/8');
    }, 500);
  };

  return (
    <>
      {/* Modal de pantalla completa mejorado */}
      <AnimatePresence>
        {isImageFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
            onClick={() => setIsImageFullscreen(false)}
          >
            {/* Contenedor principal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full max-w-7xl max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header con título y botón cerrar */}
              <div className="flex justify-between items-center mb-4 bg-black/50 p-4 rounded-t-xl backdrop-blur-sm">
                <h3 className="text-white text-xl font-bold">Mapa de Procesos - Vista Completa</h3>
                <button
                  onClick={() => setIsImageFullscreen(false)}
                  className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              {/* Contenedor de imagen con scroll si es necesario */}
              <div className="flex-1 overflow-auto bg-black/30 rounded-b-xl p-4">
                <div className="flex items-center justify-center min-h-full">
                  <OptimizedImage
                    src="/img/mapa-procesos.png"
                    alt="Mapa de Procesos de Solutions & Payroll - Vista Completa"
                    type="illustration"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                </div>
              </div>
              
              {/* Footer con instrucciones */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white/90 px-6 py-3 rounded-full text-sm backdrop-blur-sm border border-white/20"
              >
                <span className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faTimes} className="text-red-400" />
                  <span>Haz clic fuera de la imagen o presiona ESC para cerrar</span>
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Estrellas de fondo mejoradas */}
        <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full opacity-60 bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`
            }}
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

      {/* Partículas de fondo adicionales */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Botón volver al mapa / volver */}
      {!isImageFullscreen && (
        <motion.button
          onClick={showQuiz || showTutorial ? handleBackToLevel : handleBackToMap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-yellow-300 transition-colors px-4 py-2 rounded-lg`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>{showQuiz || showTutorial ? 'Volver' : 'Volver al mapa'}</span>
        </motion.button>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-20 px-4 min-h-screen">
        {/* Header - Siempre visible */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
            Mapa de Procesos
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-blue-300 mb-6">
            Conoce los procesos que impulsan a Solutions & Payroll
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mx-auto"></div>
        </motion.header>

        {/* TUTORIAL - NUEVA SECCIÓN */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4" // Cambiado: bg-black/80 por bg-black/20 y añadido backdrop-blur-sm
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-3xl p-6 max-w-2xl w-full border-2 border-purple-500/30 shadow-2xl" // Cambiado: max-w-4xl por max-w-2xl y p-8 por p-6
              >
                <div className="text-center mb-6"> {/* Cambiado: mb-8 por mb-6 */}
                  <div className="text-5xl mb-3">🎯</div> {/* Cambiado: text-6xl por text-5xl, mb-4 por mb-3 */}
                  <h2 className="text-2xl font-bold text-white mb-3">Tutorial del Desafío</h2> {/* Cambiado: text-3xl por text-2xl, mb-4 por mb-3 */}
                  <p className="text-blue-200 text-base">Aprende cómo funciona el juego de clasificación de procesos</p> {/* Cambiado: text-lg por text-base */}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6"> {/* Cambiado: gap-6 por gap-4, mb-8 por mb-6 */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20"> {/* Cambiado: p-6 por p-4 */}
                    <div className="text-3xl mb-2">🎡</div> {/* Cambiado: text-4xl por text-3xl, mb-3 por mb-2 */}
                    <h3 className="text-lg font-bold text-white mb-1">Paso 1: Girar la Ruleta</h3> {/* Cambiado: text-xl por text-lg, mb-2 por mb-1 */}
                    <p className="text-blue-200 text-sm">La ruleta seleccionará aleatoriamente un proceso de la empresa para que lo clasifiques.</p> {/* Añadido: text-sm */}
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="text-lg font-bold text-white mb-1">Paso 2: Clasificar</h3>
                    <p className="text-blue-200 text-sm">Selecciona la categoría correcta entre: Estratégicos, de Apoyo o Misionales.</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-3xl mb-2">⭐</div>
                    <h3 className="text-lg font-bold text-white mb-1">Paso 3: Puntuación</h3>
                    <p className="text-blue-200 text-sm">Necesitas al menos 7/11 respuestas correctas para aprobar el desafío.</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-3xl mb-2">🏆</div>
                    <h3 className="text-lg font-bold text-white mb-1">Paso 4: Logro</h3>
                    <p className="text-blue-200 text-sm">Al aprobar, desbloquearás un nuevo logro y podrás continuar tu aprendizaje.</p>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={closeTutorial}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-base hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg" // Cambiado: px-8 py-3 por px-6 py-2, text-lg por text-base
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Comenzar Desafío</span>
                      <FontAwesomeIcon icon={faRocket} />
                    </span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENIDO PRINCIPAL - Solo se muestra cuando NO hay tutorial y NO hay quiz */}
        {!showTutorial && !showQuiz && (
          <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
            {/* Columna izquierda - Imagen reducida */}
            <div className="lg:w-2/5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full mb-4" // Cambiado mb-8 por mb-4 para reducir espacio
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl pointer-events-none"></div>

                  <OptimizedImage
                    src="/img/mapa-procesos.png"
                    alt="Mapa de Procesos de Solutions & Payroll"
                    type="illustration"
                    className="w-full h-auto rounded-xl shadow-lg"
                    id="mapaProcesosImg"
                  />
                </div>
              </motion.div>

              {/* Botón de pantalla completa */}
              {showImage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center mb-4"
                >
                  <button
                    onClick={() => setIsImageFullscreen(true)}
                    className="group relative bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-purple-500/25 border border-purple-400/50 overflow-hidden w-full"
                  >
                    <div className="absolute inset-0 bg-white/20 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <FontAwesomeIcon icon={faExpand} />
                      <span>Ver en pantalla completa</span>
                    </span>
                  </button>
                </motion.div>
              )}

              {/* Botón de iniciar desafío */}
              {showImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col items-center"
                >
                  <button
                    onClick={handleStartChallenge}
                    className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 border border-blue-400/50 mb-4 overflow-hidden w-full"
                  >
                    <div className="absolute inset-0 bg-white/20 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Iniciar Desafío</span>
                      <FontAwesomeIcon icon={faRocket} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Columna derecha - Grid de procesos */}
            <div className="lg:w-3/5">
              {/* Grid de procesos en 2 columnas */}
              {showImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {processes.map((process, index) => (
                    <ProcessCard key={process.name} process={process} index={index} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        )}
        {/* Quiz de la ruleta */}
        <AnimatePresence>
          {showQuiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl mb-12"
            >
              {!gameCompleted ? (
                <>
                  {/* Descripción del juego */}
                  <motion.div
                    className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-300/30 shadow-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0 }}
                  >
                    <div className="text-center text-white">
                      <h4 className="text-xl font-bold mb-4 text-blue-200 flex items-center justify-center">
                        <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                        ¿Cómo funciona el juego?
                      </h4>
                      <div className="text-sm text-white/90 space-y-2 max-w-3xl mx-auto">
                        <p>• <span className="font-semibold text-yellow-300">Gira la ruleta</span> para seleccionar un proceso aleatorio de la empresa</p>
                        <p>• <span className="font-semibold text-green-300">Clasifica el proceso</span> en una de las tres categorías disponibles</p>
                        <p>• <span className="font-semibold text-purple-300">Cada proceso aparece solo una vez</span> durante el desafío</p>
                        <p>• <span className="font-semibold text-orange-300">Puntuación mínima:</span> 7/11 respuestas correctas (64%) para aprobar</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Puntuación y estadísticas */}
                  <motion.div
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="flex justify-between items-center text-white">
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-blue-300">{score}/{totalQuestions}</div>
                        <div className="text-sm text-white/80">Puntuación</div>
                      </div>

                      <div className="h-10 w-px bg-white/20 mx-2"></div>

                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center">
                          {streak > 0 && <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />}
                          {streak}
                        </div>
                        <div className="text-sm text-white/80">Racha</div>
                      </div>

                      <div className="h-10 w-px bg-white/20 mx-2"></div>

                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-green-400">{Math.round((score / Math.max(totalQuestions, 1)) * 100)}%</div>
                        <div className="text-sm text-white/80">Precisión</div>
                      </div>

                      <div className="h-10 w-px bg-white/20 mx-2"></div>

                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-purple-400">{processes.length - usedProcesses.length}</div>
                        <div className="text-sm text-white/80">Restantes</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Ruleta */}
                  <motion.div
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <motion.h3
                      className="text-2xl font-bold text-white text-center mb-6 flex items-center justify-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faCog} className="mr-2 text-blue-400 animate-spin-slow" />
                      Ruleta de Procesos
                    </motion.h3>

                    {/* Círculo de la ruleta */}
                    <motion.div
                      className="relative w-64 h-64 mx-auto mb-8"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-4 border-white/30 ${isSpinning ? 'animate-spin' : ''} shadow-xl`}></div>

                      <div className="absolute inset-4 bg-slate-800/90 rounded-full flex items-center justify-center border border-white/10">
                        {isSpinning ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-white" />
                          </motion.div>
                        ) : currentProcess ? (
                          <div className="text-center text-white p-4">
                            <FontAwesomeIcon icon={currentProcess.icon} className="text-4xl mb-2 text-blue-300" />
                            <div className="text-sm font-bold px-4 text-center leading-tight">
                              {currentProcess.name}
                            </div>
                          </div>
                        ) : (
                          <div className="text-white text-center">
                            <div className="text-4xl mb-2">🎯</div>
                            <div className="text-sm font-bold">¡Gira la ruleta!</div>
                          </div>
                        )}
                      </div>

                      {/* Flecha indicadora */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-yellow-400"></div>
                      </div>

                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-white/5 to-transparent"></div>
                    </motion.div>

                    {/* Botón de girar */}
                    <motion.div
                      className="text-center mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <button
                        onClick={spinRoulette}
                        disabled={isSpinning || (currentProcess && !showFeedback)}
                        className={`relative px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden group ${isSpinning || (currentProcess && !showFeedback)
                          ? 'bg-gray-500 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg'
                          }`}
                      >
                        {/* Efecto de brillo al pasar el mouse */}
                        <div className="absolute inset-0 bg-white/20 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>

                        <span className="relative z-10 flex items-center justify-center space-x-2">
                          {isSpinning ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <FontAwesomeIcon icon={faSpinner} />
                              </motion.span>
                              <span>Girando...</span>
                            </>
                          ) : currentProcess && !showFeedback ? (
                            <span>Selecciona una categoría</span>
                          ) : (
                            <>
                              <span>Girar Ruleta</span>
                              <FontAwesomeIcon icon={faCog} className="group-hover:rotate-90 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>
                    </motion.div>

                    {/* Opciones de categorías */}
                    {currentProcess && !showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                      >
                        {Object.entries(categories).map(([key, category]) => (
                          <motion.button
                            key={key}
                            onClick={() => handleCategorySelect(key)}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-white ${categories[key].borderColor} ${categories[key].bgColor}`}
                          >
                            <div className="text-center">
                              <FontAwesomeIcon icon={category.icon} className="text-2xl mb-2" />
                              <div className="font-semibold text-sm mb-1">{category.name}</div>
                              <div className="text-xs opacity-80">{category.description}</div>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                    {/* Feedback */}
                    {showFeedback && currentProcess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-6 rounded-2xl mb-6 backdrop-blur-md ${currentProcess.category === selectedCategory
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : 'bg-red-500/20 border-2 border-red-400'
                          }`}
                      >
                        <div className="text-center text-white">
                          <div className="text-5xl mb-3">
                            {currentProcess.category === selectedCategory ? '✅' : '❌'}
                          </div>
                          <div className="text-xl font-bold mb-2">
                            {currentProcess.category === selectedCategory ? '¡Correcto!' : '¡Incorrecto!'}
                          </div>
                          <div className="text-lg mb-3">
                            <span className="font-semibold">"{currentProcess.name}"</span> pertenece a{' '}
                            <span className={`font-bold ${currentProcess.category === selectedCategory ? 'text-green-300' : 'text-yellow-300'}`}>
                              {categories[currentProcess.category].name}
                            </span>
                          </div>

                          <div className="mb-4 p-3 bg-black/20 rounded-lg">
                            <div className="text-sm text-blue-200 leading-relaxed">{currentProcess.description}</div>
                          </div>

                          {usedProcesses.length < processes.length && (
                            <button
                              onClick={nextRound}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                            >
                              Siguiente Ronda
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </>
              ) : (
                /* Pantalla de resultados finales */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg text-center text-white"
                >
                  <div className="text-6xl mb-4">{score >= 7 ? '🎉' : '😞'}</div>
                  <h2 className="text-3xl font-bold mb-4">
                    {score >= 7 ? '¡Desafío Aprobado!' : '¡Desafío Completado!'}
                  </h2>

                  <div className="flex justify-center items-center mb-6">
                    <div className={`text-5xl font-bold ${score >= 7 ? 'text-green-400' : 'text-red-400'}`}>
                      {score}/{processes.length}
                    </div>
                  </div>

                  <div className="text-lg mb-6">
                    Precisión: <span className={`font-bold ${score >= 7 ? 'text-green-400' : 'text-red-400'}`}>
                      {Math.round((score / processes.length) * 100)}%
                    </span>
                  </div>

                  <div className="text-lg mb-6 bg-black/20 p-4 rounded-xl">
                    {score >= 7 ? (
                      <span className="text-green-300 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        ¡Has superado la puntuación mínima de 7/11!
                      </span>
                    ) : (
                      <span className="text-red-300 flex items-center justify-center">
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Necesitas al menos 7/11 respuestas correctas para aprobar
                      </span>
                    )}
                  </div>

                  {score >= 7 && (
                    <div className="mb-6 p-4 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
                      <div className="flex items-center justify-center text-yellow-300">
                        <FontAwesomeIcon icon={faTrophy} className="mr-2 text-xl" />
                        <span>¡Felicidades! Has desbloqueado un nuevo logro</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={finishGame}
                    className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${score >= 7
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                      }`}
                  >
                    {score >= 7 ? (
                      <span className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faTrophy} />
                        <span>Ver Logro</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faMedal} />
                        <span>Intentar de Nuevo</span>
                      </span>
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </>
  );
};

export default ProcessMapLevel;