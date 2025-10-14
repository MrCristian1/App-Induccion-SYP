import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppContext } from '../context/AppContext';
import OptimizedImage from './OptimizedImage';
import { 
  faClipboardCheck, faSearch, faLightbulb, 
  faShieldAlt, faUsers, faComments, faHandshake, faStar, 
  faMedal, faIdCard, faBuilding, faArrowLeft, faUserTie,
  faCheckCircle, faTimesCircle, faTrophy, faRedo
} from '@fortawesome/free-solid-svg-icons';

const committees = [
  {
    id: 'COPASST',
    name: 'COPASST',
    period: '2024 – 2026',
    description: 'Comité Paritario de Seguridad y Salud en el Trabajo',
    color: 'purple',
    members: {
      workers: [
        { name: 'Tatiana Chavarro', img: '/img/Tatiana.png' },
        { name: 'Dayan Manjarres', img: '/img/Dayana.png' },
        { name: 'Germán Hincapié', img: '/img/German.png' },
      ],
      employer: [
        { name: 'Luisa Díaz', img: '/img/Luisa.png' },
        { name: 'Jennifer Cervantes', img: '/img/Jennifer.png' },
        { name: 'Ricardo Arámbulo', img: '/img/Ricardo.png' },
        { name: 'Eduard Forero', img: '/img/Eduard.png' },
      ],
    },
    functions: [
      { icon: faClipboardCheck, text: 'Hacer seguimiento al plan de trabajo anual.' },
      { icon: faSearch, text: 'Realizar la investigación y análisis de las causas de los accidentes de trabajo y enfermedades laborales.' },
      { icon: faLightbulb, text: 'Proponer y participar en actividades de capacitación en seguridad y salud en el trabajo.' },
      { icon: faShieldAlt, text: 'Proponer a la Dirección General la adopción de medidas y actividades para procurar, mantener y promover ambientes de trabajo seguros y saludables.' },
      { icon: faUsers, text: 'Realizar inspecciones periódicas en los lugares de trabajo.' },
    ],
  },
  {
    id: 'CCL',
    name: 'CCL',
    period: '2024 – 2026',
    description: 'Comité de Convivencia Laboral',
    color: 'blue',
    members: {
      workers: [
        { name: 'Giovanna Guio', img: '/img/Giovanna.png' },
        { name: 'Yuly Peña', img: '/img/Yuly.png' },
        { name: 'Fabián Morales', img: '/img/Fabian.png' },
        { name: 'Rocío Guacamene', img: '/img/Rocio.png' },
      ],
      employer: [
        { name: 'Luisa Díaz', img: '/img/Luisa.png' },
        { name: 'Ricardo Arámbulo', img: '/img/Ricardo.png' },
        { name: 'Alfonso Fonseca', img: '/img/Alfonso.png' },
      ],
    },
    functions: [
      { icon: faComments, text: 'Escuchar a las partes involucradas de manera individual sobre los hechos que dieron lugar a la queja.' },
      { icon: faHandshake, text: 'Adelantar reuniones para crear espacios de diálogo entre las partes, promoviendo compromisos mutuos y soluciones efectivas a las controversias.' },
      { icon: faSearch, text: 'Examinar de manera confidencial los casos en los que se formulen quejas o reclamos que pudieran tipificar conductas o circunstancias de acoso laboral dentro de la empresa.' },
      { icon: faClipboardCheck, text: 'Recibir y dar trámite a las quejas sobre situaciones que puedan constituir acoso laboral, así como a las pruebas que las soporten.' },
      { icon: faLightbulb, text: 'Formular un plan de mejora concertado entre las partes, con el fin de construir, renovar y promover la convivencia laboral, garantizando siempre el principio de confidencialidad.' },
    ],
  },
];

const quizQuestions = [
  {
    id: 1,
    type: 'case',
    question: 'Acorde con la siguiente situación, indique a comité le corresponde el tratamiento: Un trabajador ha reportado que está siendo objeto de burlas y comentarios despectivos por parte de sus compañeros de trabajo de manera constante.',

    options: [
      { committee: 'COPASST', text: 'Comité Paritario de Seguridad y Salud en el Trabajo' },
      { committee: 'CCL', text: 'Comité de Convivencia Laboral' }
    ],
    answer: 'CCL',
    explanation: 'Este es un caso que debe ser manejado por el CCL, ya que involucra una situación que podría constituir acoso laboral. El CCL es el encargado de examinar confidencialmente los casos relacionados con la convivencia y el acoso laboral.'
  },
  {
    id: 2,
    type: 'case',
    question: 'Se ha presentado un incidente en el área de producción donde un equipo ha presentado fallas que podrían poner en riesgo la seguridad de los trabajadores.',
    options: [
      { committee: 'COPASST', text: 'Comité Paritario de Seguridad y Salud en el Trabajo' },
      { committee: 'CCL', text: 'Comité de Convivencia Laboral' }
    ],
    answer: 'COPASST',
    explanation: 'Este caso corresponde al COPASST, ya que está relacionado con la seguridad en el trabajo y la prevención de accidentes. El COPASST debe investigar y proponer medidas para mantener ambientes de trabajo seguros.'
  },
  {
    id: 3,
    type: 'dragdrop',
    question: 'Arrastra cada integrante al comité al que pertenece',
    members: [
      { name: 'Tatiana Chavarro', committee: 'COPASST', img: '/img/Tatiana.png' },
      { name: 'Giovanna Guio', committee: 'CCL', img: '/img/Giovanna.png' },
      { name: 'Dayan Manjarres', committee: 'COPASST', img: '/img/Dayana.png' },
      { name: 'Yuly Peña', committee: 'CCL', img: '/img/Yuly.png' },
      { name: 'Germán Hincapié', committee: 'COPASST', img: '/img/German.png' },
      { name: 'Fabián Morales', committee: 'CCL', img: '/img/Fabian.png' }
    ],
    committees: ['COPASST', 'CCL']
  }
];

const sectionTabs = [
  { key: 'members', label: 'Miembros', icon: faIdCard },
  { key: 'functions', label: 'Funciones', icon: faBuilding },
  { key: 'quiz', label: 'Quiz', icon: faStar }
];

const StarField = () => {
  const stars = useMemo(() => 
    Array(50).fill().map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 3 + 1,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const CommitteeCard = ({ committee, section }) => {
  const colorMap = {
    purple: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-300',
      border: 'border-purple-500/30',
      icon: 'bg-purple-500/30'
    },
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-300',
      border: 'border-blue-500/30',
      icon: 'bg-blue-500/30'
    }
  };

  const colors = colorMap[committee.color] || colorMap.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex-1 rounded-2xl p-6 shadow-xl backdrop-blur-lg border ${colors.border} ${colors.bg}`}
    >
      <h2 className="text-2xl font-bold mb-2">
        <span className={colors.text}>{committee.name}</span>
        <span className="text-white/60 text-base ml-2">{committee.period}</span>
      </h2>
      <p className="text-white/80 mb-6">{committee.description}</p>
      
      {section === 'members' && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUserTie} className={colors.text} />
              <span className={colors.text}>Representantes de los trabajadores</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {committee.members.workers.map((m, idx) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                    <OptimizedImage 
                      src={m.img} 
                      alt={m.name}
                      type="profile"
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-white/90 text-sm text-center">{m.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className={colors.text} />
              <span className={colors.text}>Representantes del empleador</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {committee.members.employer.map((m, idx) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                    <OptimizedImage 
                      src={m.img} 
                      alt={m.name}
                      type="profile"
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-white/90 text-sm text-center">{m.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {section === 'functions' && (
        <div className="flex flex-col gap-4">
          {committee.functions.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${colors.text} ${colors.icon}`}>
                <FontAwesomeIcon icon={f.icon} size="sm" />
              </div>
              <p className="text-white/90 text-sm leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const QuizQuestion = ({ 
  question, 
  onAnswer, 
  onNext, 
  currentIndex, 
  totalQuestions,
  score,
  streak,
  onDragDropComplete
}) => {
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (index) => {
    if (isAnswered) return;
    
    setSelected(index);
    setIsAnswered(true);
    onAnswer(index);
  };

  const handleNext = () => {
    setSelected(null);
    setIsAnswered(false);
    onNext();
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70 text-sm">
            Pregunta {currentIndex + 1} de {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} size="xs" /> Racha: {streak}
              </span>
            )}
            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
              Puntos: {score}
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-300">
            {currentIndex + 1}
          </span>
          {question.question}
        </h3>
        
        {question.type === 'case' ? (
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const isCorrect = opt.committee === question.answer;
              const isSelectedOption = selected === idx;
              
              let buttonClass = "w-full text-left p-4 rounded-lg transition-all duration-200 ";
              
              if (isAnswered) {
                if (isSelectedOption) {
                  buttonClass += isCorrect 
                    ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                    : "bg-red-500/20 text-red-300 border border-red-500/30";
                } else if (isCorrect) {
                  buttonClass += "bg-green-500/10 text-green-300 border border-green-500/20";
                } else {
                  buttonClass += "bg-white/5 text-white/50";
                }
              } else {
                buttonClass += "bg-white/10 text-white/80 hover:bg-purple-500/20 hover:text-purple-300";
              }
              
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  className={buttonClass}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{opt.committee}</span>
                      <span className="text-sm opacity-80 mt-1">{opt.text}</span>
                    </div>
                    {isAnswered && isSelectedOption && (
                      <FontAwesomeIcon 
                        icon={isCorrect ? faCheckCircle : faTimesCircle} 
                        className={isCorrect ? "text-green-400" : "text-red-400"} 
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <DragDropQuestion 
            question={question} 
            onComplete={handleNext}
            onDragDropComplete={onDragDropComplete}
            isAnswered={isAnswered}
          />
        )}
      </div>

      {isAnswered && question.type === 'case' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10"
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0 mt-1">
              <FontAwesomeIcon icon={faLightbulb} size="xs" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Explicación</h4>
              <p className="text-white/80 text-sm">{question.explanation}</p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium"
              onClick={handleNext}
            >
              {currentIndex < totalQuestions - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const DragDropQuestion = ({ question, onComplete, isAnswered, onDragDropComplete }) => {
  const [droppedMembers, setDroppedMembers] = useState({
    COPASST: [],
    CCL: []
  });

  const handleDrop = (e, committee) => {
    e.preventDefault();
    const member = JSON.parse(e.dataTransfer.getData('member'));
    
    // Evitar duplicados
    if (droppedMembers[committee].some(m => m.name === member.name)) return;
    
    setDroppedMembers(prev => ({
      ...prev,
      [committee]: [...prev[committee], member]
    }));
  };

  const handleDragStart = (e, member) => {
    e.dataTransfer.setData('member', JSON.stringify(member));
  };

  const handleRemove = (memberName, committee) => {
    setDroppedMembers(prev => ({
      ...prev,
      [committee]: prev[committee].filter(m => m.name !== memberName)
    }));
  };

  const remainingMembers = question.members.filter(member => 
    !Object.values(droppedMembers).flat().some(m => m.name === member.name)
  );

  const isComplete = remainingMembers.length === 0;

  const handleContinue = () => {
    // Calcular puntos antes de continuar
    if (onDragDropComplete) {
      onDragDropComplete(droppedMembers);
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.committees.map(committee => {
          const committeeData = committees.find(c => c.id === committee);
          const colorMap = {
            COPASST: 'purple',
            CCL: 'blue'
          };
          const colors = colorMap[committee] || 'purple';
          
          return (
            <div 
              key={committee}
              className={`bg-white/5 rounded-lg p-4 border border-${colors}-500/20`}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, committee)}
            >
              <h4 className={`font-semibold text-${colors}-300 mb-3 flex items-center gap-2`}>
                <FontAwesomeIcon icon={faBuilding} />
                {committeeData.name}
              </h4>
              
              <div className="min-h-[120px] space-y-2">
                {droppedMembers[committee].map(member => (
                  <div
                    key={member.name}
                    className={`flex items-center gap-2 p-2 rounded bg-${colors}-500/20 text-white text-sm`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <OptimizedImage 
                        src={member.img} 
                        alt={member.name}
                        type="profile"
                        className="w-full h-full"
                      />
                    </div>
                    <span className="flex-1">{member.name}</span>
                    <button 
                      onClick={() => handleRemove(member.name, committee)}
                      className="text-white/50 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div>
        <h4 className="text-white/80 text-sm mb-2">Arrastra los miembros disponibles:</h4>
        <div className="flex flex-wrap gap-2">
          {remainingMembers.map(member => (
            <div
              key={member.name}
              draggable
              onDragStart={e => handleDragStart(e, member)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded text-white text-sm cursor-move hover:bg-white/20"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <OptimizedImage 
                  src={member.img} 
                  alt={member.name}
                  type="profile"
                  className="w-full h-full"
                />
              </div>
              {member.name}
            </div>
          ))}
        </div>
      </div>
      
      {isComplete && !isAnswered && (
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium"
            onClick={handleContinue}
          >
            Continuar
          </motion.button>
        </div>
      )}
    </div>
  );
};

const ResultsScreen = ({ score, onRetry, onComplete }) => {
  const medalLevel = score >= 400 ? 'gold' : score >= 300 ? 'silver' : 'bronze';
  const medalConfig = {
    gold: { color: 'text-yellow-300', icon: faTrophy, label: 'Oro' },
    silver: { color: 'text-gray-300', icon: faMedal, label: 'Plata' },
    bronze: { color: 'text-amber-700', icon: faMedal, label: 'Bronce' }
  };
  const { color, icon, label } = medalConfig[medalLevel];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={`text-5xl mb-4 ${color}`}
      >
        <FontAwesomeIcon icon={icon} />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-white mb-2">¡Quiz Completado!</h2>
      <p className="text-white/80 mb-6">Tu puntuación final</p>
      
      <div className="text-4xl font-bold text-purple-300 mb-6">{score} puntos</div>
      
      <p className="text-white/70 mb-2">
        {medalLevel === 'gold' 
          ? '¡Excelente! Dominas completamente los comités.' 
          : medalLevel === 'silver' 
          ? '¡Buen trabajo! Has pasado el quiz satisfactoriamente.'
          : 'Sigue practicando para mejorar tu conocimiento.'
        }
      </p>
      
      <p className="text-white/60 text-sm mb-6">
        Puntuación mínima requerida: <span className="text-purple-300">300 puntos</span>
      </p>
      
      <div className="flex flex-col gap-3">
        {score >= 300 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold shadow-md"
            onClick={onComplete}
          >
            Completar Nivel
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
            onClick={onRetry}
          >
            <FontAwesomeIcon icon={faRedo} />
            Intentar de nuevo
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const CommitteeLevel = ({ onComplete }) => {
  const navigate = useNavigate();
  const { completeLevel } = useAppContext();
  const [activeSection, setActiveSection] = useState('members');
  const [quizState, setQuizState] = useState({
    index: 0,
    score: 0,
    streak: 0,
    showResults: false
  });

  const handleAnswer = (answerIndex) => {
    const currentQuestion = quizQuestions[quizState.index];
    if (currentQuestion.type !== 'case') return;
    
    const isCorrect = currentQuestion.options[answerIndex].committee === currentQuestion.answer;
    
    setQuizState(prev => ({
      ...prev,
      score: prev.score + (isCorrect ? (100 + (prev.streak * 20)) : 0),
      streak: isCorrect ? prev.streak + 1 : 0
    }));
  };

  const handleDragDropComplete = (droppedMembers) => {
    const currentQuestion = quizQuestions[quizState.index];
    if (currentQuestion.type !== 'dragdrop') return;
    
    // Verificar si todos los miembros están en los comités correctos
    let correctPlacements = 0;
    let totalMembers = currentQuestion.members.length;
    
    currentQuestion.members.forEach(member => {
      const correctCommittee = member.committee;
      const isCorrectlyPlaced = droppedMembers[correctCommittee] && 
        droppedMembers[correctCommittee].some(m => m.name === member.name);
      
      if (isCorrectlyPlaced) {
        correctPlacements++;
      }
    });
    
    // Calcular puntos basado en el porcentaje de aciertos
    const accuracy = correctPlacements / totalMembers;
    const basePoints = Math.floor(accuracy * 150); // Hasta 150 puntos base
    const bonusPoints = accuracy === 1 ? (quizState.streak * 20) : 0; // Bonus por perfección
    const totalPoints = basePoints + bonusPoints;
    
    setQuizState(prev => ({
      ...prev,
      score: prev.score + totalPoints,
      streak: accuracy === 1 ? prev.streak + 1 : 0
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.index < quizQuestions.length - 1) {
      setQuizState(prev => ({ ...prev, index: prev.index + 1 }));
    } else {
      setQuizState(prev => ({ ...prev, showResults: true }));
    }
  };

  const handleRetryQuiz = () => {
    setQuizState({
      index: 0,
      score: 0,
      streak: 0,
      showResults: false
    });
  };

  const handleCompleteLevel = () => {
    completeLevel(5);
    setTimeout(() => {
      onComplete();
      navigate('/achievement/5');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <StarField />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" />
      </div>
      
      <div className="relative z-10 container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <motion.button
                  type="button"
                  onClick={() => navigate('/map')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors px-4 py-2 rounded-lg"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Volver al mapa</span>
                </motion.button>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <FontAwesomeIcon icon={faUsers} className="text-4xl text-white" />
                <h1 className="text-4xl font-bold text-white">
                  Comités de Trabajo
                </h1>
              </div>
              <div className="w-24"></div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {sectionTabs.map((tab, idx) => (
            <motion.div
              key={tab.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                type="button"
                onClick={() => setActiveSection(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-md border ${
                  activeSection === tab.key 
                    ? 'bg-purple-500/30 text-purple-300 border-purple-500/50' 
                    : 'bg-white/10 text-white/70 border-white/20 hover:bg-purple-500/20'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.label}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="mb-10">
          <AnimatePresence mode="wait">
            {activeSection === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {committees.map(committee => (
                    <CommitteeCard 
                      key={committee.id} 
                      committee={committee} 
                      section="members" 
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeSection === 'functions' && (
              <motion.div
                key="functions"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {committees.map(committee => (
                    <CommitteeCard 
                      key={committee.id} 
                      committee={committee} 
                      section="functions" 
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeSection === 'quiz' && !quizState.showResults && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="max-w-4xl mx-auto">
                  <QuizQuestion 
                    question={quizQuestions[quizState.index]} 
                    onAnswer={handleAnswer}
                    onNext={handleNextQuestion}
                    onDragDropComplete={handleDragDropComplete}
                    currentIndex={quizState.index}
                    totalQuestions={quizQuestions.length}
                    score={quizState.score}
                    streak={quizState.streak}
                  />
                </div>
              </motion.div>
            )}
            
            {activeSection === 'quiz' && quizState.showResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <ResultsScreen 
                  score={quizState.score} 
                  onRetry={handleRetryQuiz}
                  onComplete={handleCompleteLevel}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CommitteeLevel;