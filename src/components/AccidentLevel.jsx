import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDumbbell, faExclamationTriangle, faTemperatureHigh, 
  faBrain, faVirus, faUserShield, faChevronRight, 
  faCalendarDay, faArrowLeft, faPlayCircle, faClipboardList,
  faShieldAlt, faFirstAid, faClock, faCogs, faBookMedical
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AccidentQuiz from './AccidentQuiz';

const riskCards = [
  {
    title: 'Riesgos Biomecánicos',
    icon: faDumbbell,
    color: 'from-blue-500 to-blue-700',
    bgColor: 'bg-blue-500/20',
    description: 'Movimientos repetitivos, posturas forzadas, manipulación de cargas.',
    icon2: faCogs,
  description2: '<span class="font-bold text-white">Controles</span>: Programa de Vigilancia Epidemiológica Osteomuscular, Ejecución de inspecciones de puesto de trabajo, entrega de elementos ergonómicos, capacitación y sensibilizaciones.'
  },
  {
    title: 'Condiciones de Seguridad',
    icon: faExclamationTriangle,
    color: 'from-yellow-500 to-yellow-700',
    bgColor: 'bg-yellow-500/20',
    description: 'Herramientas, equipos, instalaciones y procedimientos inseguros.',
    icon2: faCogs,
  description2: '<span class="font-bold text-white mt-3" style="display:inline-block;margin-top:0.75rem;">Controles</span>: Capacitaciones y sensibilizaciones.'
  },
  {
    title: 'Riesgos Físicos',
    icon: faTemperatureHigh,
    color: 'from-red-500 to-red-700',
    bgColor: 'bg-red-500/20',
    description: 'Ruido, temperatura, radiación, vibración.',
    icon2: faCogs,
  description2: '<span class="font-bold text-white">Controles</span>: Recomendaciones para adecuación de puesto de trabajo en casa, capacitaciones y sensibilizaciones.'
  },
  {
    title: 'Riesgo Psicosocial',
    icon: faBrain,
    color: 'from-purple-500 to-purple-700',
    bgColor: 'bg-purple-500/20',
    description: 'Estrés, acoso laboral, carga mental.',
    icon2: faCogs,
  description2: '<span class="font-bold text-white">Controles</span>: Programa de Vigilancia Epidemiológica Psicosocial, aplicación de batería de riesgo psicosocial, encuesta de clima, actividades de intervención, capacitaciones y sensibilización.'
  },
  {
    title: 'Riesgos Biológicos',
    icon: faVirus,
    color: 'from-green-500 to-green-700',
    bgColor: 'bg-green-500/20',
    description: 'Virus, bacterias, hongos y otros agentes biológicos.',
    fullWidth: true,
    icon2: faCogs,
  description2: '<span class="font-bold text-white mt-3" style="display:inline-block;margin-top:0.75rem;">Controles</span>: Capacitaciones y sensibilizaciones.'
  },
];

const accidentSteps = [
  {
    step: 1,
    title: "Reportar al jefe inmediato",
    description: "Comunicar el incidente al supervisor o encargado del SG-SST",
    icon: faUserShield,
    color: "bg-blue-600"
  },
  {
    step: 2,
    title: "Dirigirse al centro médico",
    description: "Acudir al centro de atención más cercano o el indicado por la ARL",
    icon: faFirstAid,
    color: "bg-purple-600"
  },
  {
    step: 3,
    title: "Brindar todos los detalles",
    description: "Proporcionar información completa para el reporte del accidente",
    icon: faClipboardList,
    color: "bg-yellow-500"
  },
];

// Definiciones solicitadas
const definitions = [
  {
    term: "Accidente de trabajo",
    definition: "Suceso repentino que ocurre por causa o con ocasión del trabajo y que produce lesión, invalidez o muerte.",
    icon: faExclamationTriangle,
    color: "from-red-500 to-red-600"
  },
  {
    term: "Enfermedad laboral",
    definition: "Estado patológico contraído como resultado de la exposición a factores de riesgo inherentes a la actividad laboral.",
    icon: faVirus,
    color: "from-orange-500 to-orange-600"
  },
  {
    term: "Incidente de trabajo",
    definition: "Evento relacionado con el trabajo que pudo haber causado daño, pero no produjo lesión ni enfermedad.",
    icon: faShieldAlt,
    color: "from-green-500 to-green-600"
  }
];

const AccidentLevel = () => {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const handleQuizButton = () => {
    setShowQuiz(!showQuiz);
  };

  const stars = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2
    }));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-gray-100">
      {/* Fondo con estrellas */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: '2px',
              height: '2px',
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Botón volver */}
      <div className="absolute top-6 left-6 z-20">
        <motion.button
          onClick={() => showQuiz ? setShowQuiz(false) : navigate('/map')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors px-4 py-2 rounded-lg"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>{showQuiz ? 'Volver' : 'Volver al mapa'}</span>
        </motion.button>
      </div>

      {/* Botón de quiz */}
      {!showQuiz && (
        <motion.div 
          className="fixed top-6 right-6 z-30"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleQuizButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-purple-500/30 border border-indigo-400/50 transition-all text-base group"
          >
            <FontAwesomeIcon icon={faPlayCircle} className="text-lg group-hover:scale-110 transition-transform" />
            <span>Iniciar Quiz</span>
          </motion.button>
        </motion.div>
      )}

      {/* Contenido principal o quiz */}
      <AnimatePresence mode="wait">
        {!showQuiz ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col items-center justify-start pt-12 pb-16 px-4"
          >
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl text-center mb-12"
            >
              <div className="inline-flex items-center justify-center p-2 mb-4 bg-blue-900/30 rounded-full">
                <FontAwesomeIcon icon={faShieldAlt} className="text-blue-400 text-xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">Guía de Seguridad Laboral</h1>
              <p className="text-xl md:text-2xl text-blue-300 max-w-2xl mx-auto">
                Identificación de riesgos y protocolos ante accidentes de trabajo
              </p>
            </motion.header>

            {/* Sección de Riesgos */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full max-w-6xl mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-0.5 w-10 bg-blue-500"></div>
                <h2 className="text-2xl font-bold text-white">Identificación de Riesgos Laborales</h2>
                <div className="h-0.5 flex-1 bg-blue-500"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {riskCards.map((card, idx) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className={`${card.fullWidth ? 'md:col-span-2' : ''} ${card.bgColor} backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-xl`}
                  >
                    <div className="flex items-start gap-5 p-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                        <FontAwesomeIcon icon={card.icon} className="text-2xl text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                        <p className="text-white/80 mb-4">{card.description}</p>
                        
                        {/* Nueva sección para controles */}
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-white/10">
                              <FontAwesomeIcon icon={card.icon2} className="text-sm text-white/80" />
                            </div>
                            <div>
                              <p className="text-white/70 text-sm" dangerouslySetInnerHTML={{__html: card.description2}}></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Sección de Definiciones Importantes - MOVIDA AQUÍ */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="w-full max-w-6xl mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-0.5 w-10 bg-indigo-500"></div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faBookMedical} className="text-indigo-400" />
                  Definiciones Importantes
                </h2>
                <div className="h-0.5 flex-1 bg-indigo-500"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {definitions.map((def, idx) => (
                  <motion.div
                    key={def.term}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${def.color} shadow-lg`}>
                          <FontAwesomeIcon icon={def.icon} className="text-xl text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">{def.term}</h3>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">{def.definition}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Sección de Procedimientos */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-6xl mb-24"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-0.5 w-10 bg-orange-500"></div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faFirstAid} className="text-orange-400" />
                  Procedimiento ante Accidentes de Trabajo
                </h2>
                <div className="h-0.5 flex-1 bg-orange-500"></div>
              </div>
              
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
                <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/20 rounded-xl p-8 mb-8">
                  <p className="text-lg text-white/90 text-center">
                    Lesión corporal que el trabajador sufre con ocasión o por consecuencia del trabajo que ejecuta
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Paso 1 */}
                  <motion.div
                    key={accidentSteps[0].step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0 }}
                    className={`bg-slate-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-orange-400/30 transition-colors cursor-pointer ${activeStep === 0 ? 'ring-2 ring-orange-500/50' : ''}`}
                    onClick={() => setActiveStep(activeStep === 0 ? null : 0)}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${accidentSteps[0].color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                        {accidentSteps[0].step}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                          <FontAwesomeIcon icon={accidentSteps[0].icon} className="text-orange-400" />
                          {accidentSteps[0].title}
                        </h4>
                        <p className="text-white/70 text-sm">{accidentSteps[0].description}</p>
                      </div>
                    </div>
                  </motion.div>
                  {/* Paso 2 */}
                  <motion.div
                    key={accidentSteps[1].step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className={`bg-slate-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-orange-400/30 transition-colors cursor-pointer ${activeStep === 1 ? 'ring-2 ring-orange-500/50' : ''}`}
                    onClick={() => setActiveStep(activeStep === 1 ? null : 1)}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${accidentSteps[1].color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                        {accidentSteps[1].step}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                          <FontAwesomeIcon icon={accidentSteps[1].icon} className="text-orange-400" />
                          {accidentSteps[1].title}
                        </h4>
                        <p className="text-white/70 text-sm">{accidentSteps[1].description}</p>
                      </div>
                    </div>
                  </motion.div>
                  {/* Paso 3 centrado en segunda fila */}
                  <div className="col-span-1 md:col-span-2 flex justify-center">
                    <motion.div
                      key={accidentSteps[2].step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className={`bg-slate-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-orange-400/30 transition-colors cursor-pointer w-full max-w-xl ${activeStep === 2 ? 'ring-2 ring-orange-500/50' : ''}`}
                      onClick={() => setActiveStep(activeStep === 2 ? null : 2)}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-start gap-4 justify-center">
                        <div className={`${accidentSteps[2].color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                          {accidentSteps[2].step}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                            <FontAwesomeIcon icon={accidentSteps[2].icon} className="text-orange-400" />
                            {accidentSteps[2].title}
                          </h4>
                          <p className="text-white/70 text-sm">{accidentSteps[2].description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Sección de Información Adicional */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-3xl -mt-12"
            >
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-2xl shadow-xl p-5 mb-8 border border-gray-200">
                  <img 
                    src={'/img/Axa.png'} 
                    alt="Axa Colpatria" 
                    className="w-100 max-w-full h-auto mx-auto object-contain" 
                  />
                </div>
                <div className="mb-8 p-4 bg-blue-900/40 backdrop-blur-sm rounded-2xl border border-blue-500/30 w-full">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faClock} className="text-yellow-400" />
                      Plazo Máximo para Reportar
                    </h3>
                    <p className="text-lg text-white/90 font-semibold">
                      2 DÍAS HÁBILES desde la ocurrencia del evento
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleQuizButton}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all flex items-center gap-3 mt-4"
                >
                  <FontAwesomeIcon icon={faPlayCircle} className="text-xl" />
                  <span>Evaluar mis conocimientos</span>
                </motion.button>
              </div>
            </motion.section>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="pt-20 px-4"
          >
            <AccidentQuiz onClose={() => setShowQuiz(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccidentLevel;