import React, { useMemo, useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCheckCircle,
  faExclamationTriangle,
  faQuestionCircle,
  faThLarge,
  faFileAlt,
  faLightbulb,
  faBullseye,
  faSearch,
  faTasks,
  faChartLine,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';


const shuffleArray = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * (i - 1)) + 1; // never swap the first (placeholder)
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const ACRLevel = () => {
  const navigate = useNavigate();
  const { completeLevel } = useAppContext();
  const [activeSection, setActiveSection] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [expandedExample, setExpandedExample] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [closingScenario, setClosingScenario] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState({
    why1: [],
    why2: [],
    why3: [],
    correctiveAction: [],
    implementation: [],
    verification: []
  });

  // Generar estrellas animadas
  const stars = useMemo(() => {
    return [...Array(80)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      size: Math.random() * 3 + 1
    }));
  }, []);

  // Escenarios interactivos para los 5 Porqués
  const scenarios = [
    {
      id: 1,
      title: "Informe con datos incompletos",
      problema: "El informe técnico enviado al cliente X contenía datos incompletos",
      porques: [
        {
          pregunta: "¿Por qué el informe técnico tenía datos incompletos?",
          respuesta: "Porque el auxiliar no verificó toda la información antes del envío."
        },
        {
          pregunta: "¿Por qué no verificó la información?",
          respuesta: "Porque no contaba con un formato de revisión previo definido."
        },
        {
          pregunta: "¿Por qué no existe un formato de revisión previo?",
          respuesta: "Porque el proceso no exige formalmente una revisión o checklist para informes."
        },
        {
          pregunta: "¿Por qué el proceso no lo exige?",
          respuesta: "Porque no se identificó la necesidad de control documental en informes técnicos durante el diseño del procedimiento."
        },
        {
          pregunta: "¿Por qué no se identificó esa necesidad en el procedimiento?",
          respuesta: "Porque no hay un mecanismo formal que obligue la evaluación y actualización de los procedimientos y formatos utilizados."
        }
      ],
      causaRaiz: "Falta de un procedimiento estandarizado para revisión de informes antes del envío al cliente.",
      correccion: "Se retiró temporalmente el envío al cliente, se bloqueó la versión pendiente y se solicitó al técnico la actualización inmediata del informe.",
      accionCorrectiva: "Se elaborará y aprobará un procedimiento que defina la revisión anual de todos los formatos utilizados en los procesos técnicos, incluyendo responsables y registros de actualización."
    },
    {
      id: 2,
      title: "Retraso en entrega de factura",
      problema: "El cliente ABC S.A. reportó retraso en la entrega de la factura del servicio",
      porques: [
        {
          pregunta: "¿Por qué se retrasó la entrega de la factura?",
          respuesta: "Porque la factura no fue enviada en la fecha planeada."
        },
        {
          pregunta: "¿Por qué no fue enviada en la fecha planeada?",
          respuesta: "Porque no se recibió la aprobación interna necesaria dentro del cronograma."
        },
        {
          pregunta: "¿Por qué no se obtuvo la aprobación a tiempo?",
          respuesta: "Porque no se realizó seguimiento al cierre del servicio y sus aprobaciones."
        },
        {
          pregunta: "¿Por qué no se realizó seguimiento?",
          respuesta: "Porque no existe una matriz de control con responsables y fechas para el ciclo de facturación."
        },
        {
          pregunta: "¿Por qué no existe esa matriz de control?",
          respuesta: "Porque no se formalizó la planificación mensual con asignación de responsables para cada actividad del ciclo de facturación."
        }
      ],
      causaRaiz: "Planificación y control insuficientes en el proceso de facturación.",
      correccion: "Se emitió y remitió la factura de manera prioritaria al cliente el mismo día, se envió comunicación de disculpa y confirmación de entrega.",
      accionCorrectiva: "Implementar una matriz de control mensual con responsables y fechas definidas para cada actividad del ciclo de facturación."
    }
  ];

  // Función para verificar si el quiz está completo
  const isQuizComplete = () => {
    // Verificar Situación 1
    const situation1Complete = quizAnswers['s1-a'] && quizAnswers['s1-b'];

    // Verificar Situación 2 (orden de pasos)
    const situation2Complete = quizAnswers.stepOrder && quizAnswers.stepOrder.length === 5;

    // Verificar Situación 3 (5 porqués con dropdowns + acción correctiva + implementación + verificación)
    const situation3Complete = quizAnswers['why1'] && quizAnswers['why2'] && quizAnswers['why3'] &&
      quizAnswers['correctiveAction'] && quizAnswers['implementation'] && quizAnswers['verification'];

    return situation1Complete && situation2Complete && situation3Complete;
  };

  // Función para calcular el puntaje
  const calculateScore = () => {
    let score = 0;

    // Situación 1: Clasificación Correcta (1 punto)
    if (quizAnswers['s1-a'] === 'correccion') score += 0.5;
    if (quizAnswers['s1-b'] === 'correctiva') score += 0.5;

    // Situación 2: Orden del proceso (1 punto)
    if (quizAnswers.stepOrder) {
      const correctOrder = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'];
      const isCorrectOrder = quizAnswers.stepOrder.every((id, idx) => id === correctOrder[idx]);
      if (isCorrectOrder) score += 1;
    }

    // Situación 3: 5 Porqués + Acción Correctiva + Implementación + Verificación (1 punto total)
    // 5 Porqués correctos
    const why1Correct = quizAnswers['why1'] === 'Porque el sistema de notificaciones no alertó al equipo';
    const why2Correct = quizAnswers['why2'] === 'Porque no hay un procedimiento de escalamiento para tickets críticos';
    const why3Correct = quizAnswers['why3'] === 'Porque no se ha formalizado la planificación de procesos críticos con asignación de responsables';

    // Acción correctiva correcta
    const correctiveActionCorrect = quizAnswers['correctiveAction'] === 'Diseñar e implementar un procedimiento de escalamiento automático para tickets críticos, con notificaciones programadas y asignación de responsables según niveles de prioridad';

    // Implementación correcta
    const implementationCorrect = quizAnswers['implementation'] === 'Procedimiento de escalamiento implementado el 15 de noviembre. Se configuró el sistema de tickets con alertas automáticas cada 2 horas para tickets críticos. Se capacitó al equipo de soporte y se asignaron responsables por turno. Evidencia: Manual del procedimiento, capturas del sistema configurado, acta de capacitación';

    // Verificación correcta
    const verificationCorrect = quizAnswers['verification'] === 'A los dos meses, se revisaron 50 tickets críticos y todos fueron atendidos dentro del tiempo establecido (4 horas). No se recibieron quejas de clientes por demoras en respuestas. Acción correctiva eficaz';

    if (why1Correct && why2Correct && why3Correct && correctiveActionCorrect && implementationCorrect && verificationCorrect) {
      score += 1;
    }

    return Math.min(3, score);
  };

  const sections = [
    {
      id: 'objetivo',
      name: 'Objetivo',
      icon: faBullseye,
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      description: 'Fortalecer competencias para documentar correctamente las acciones correctivas...'
    },
    {
      id: 'conceptos',
      name: 'Conceptos Clave',
      icon: faLightbulb,
      color: 'bg-gradient-to-br from-blue-500 to-purple-500',
      description: 'No Conformidad, Corrección, Acción Correctiva, Causa Raíz...'
    },
    {
      id: 'etapas',
      name: 'Etapas del ACR',
      icon: faTasks,
      color: 'bg-gradient-to-br from-green-500 to-teal-500',
      description: '6 etapas para documentar correctamente las acciones correctivas...'
    },
    {
      id: 'cinco-porques',
      name: '5 Porqués',
      icon: faSearch,
      color: 'bg-gradient-to-br from-indigo-500 to-blue-700',
      description: 'Metodología para identificar la causa raíz de los problemas...'
    },
    {
      id: 'practico',
      name: 'Ejemplos de Aplicación',
      icon: faThLarge,
      color: 'bg-gradient-to-br from-red-500 to-pink-500',
      description: 'Ejemplos reales de aplicación de ACR en diferentes situaciones...'
    },
    {
      id: 'recomendaciones',
      name: 'Recomendaciones',
      icon: faShieldAlt,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-700',
      description: 'Mejores prácticas y consejos para documentación efectiva...'
    },
    {
      id: 'guia',
      name: 'Guía de diligenciamiento',
      icon: faFileAlt,
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-700',
      description: 'Guía paso a paso para diligenciar el registro de una ACR.'
    },
    {
      id: 'quiz',
      name: 'Evaluación',
      icon: faQuestionCircle,
      color: 'bg-gradient-to-br from-gray-600 to-gray-800',
      description: 'Test final para validar el aprendizaje sobre ACR...'
    }
  ];

  const getContent = (sectionId) => {
    const contentMap = {
      objetivo: {
        title: "Objetivo del Aprendizaje",
        text: "Fortalecer las competencias del personal para documentar correctamente las acciones correctivas, garantizando que eliminen la causa raíz de las no conformidades y eviten su recurrencia, aplicando la metodología de los 5 Porqués."
      },
      conceptos: {
        title: "Conceptos Clave",
        text: "No Conformidad: Incumplimiento de un requisito establecido. Corrección: Acción inmediata para controlar o eliminar el efecto detectado. Acción Correctiva: Acción tomada para eliminar la causa raíz de una no conformidad y evitar su repetición. Causa Raíz: Motivo fundamental que origina la no conformidad."
      },
      etapas: {
        title: "Etapas para Documentar una Acción Correctiva",
        text: "1. Identificación del Problema - 2. Corrección (Acción Inmediata) - 3. Análisis de Causas (5 Porqués) - 4. Definición de Acción Correctiva - 5. Implementación y Seguimiento - 6. Verificación de Eficacia"
      },
      'cinco-porques': {
        title: "Metodología de los 5 Porqués",
        text: "Consiste en preguntarse '¿Por qué?' cinco veces (o las veces necesarias) hasta llegar a la causa raíz fundamental del problema. No siempre son exactamente 5 preguntas, lo importante es llegar a la causa raíz."
      },
      practico: {
        title: "Ejemplos de Aplicación",
        text: "Casos reales donde se aplicó la metodología ACR completa, desde la identificación del problema hasta la verificación de eficacia."
      },
      recomendaciones: {
        title: "Recomendaciones Clave",
        text: "Evita frases como 'error humano' o 'falta de compromiso'. Documenta con evidencia, sé específico, busca causas sistémicas y asegura trazabilidad. Verifica la eficacia después de 1 a 3 meses."
      },
      quiz: {
        title: "Evaluación Final",
        text: "Test de conocimiento con preguntas sobre acciones correctivas, diferencias entre corrección y acción correctiva, metodología de los 5 Porqués y documentación efectiva."
      }
    };

    return contentMap[sectionId] || { title: '', text: '' };
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };


  // Opciones originales para los dropdowns de los 5 Porqués
  const whyOptions = {
    why1: [
      "Selecciona una opción...",
      "Porque el sistema de notificaciones no alertó al equipo",
      "Porque los empleados estaban de vacaciones",
      "Porque no había internet en la oficina",
      "Porque el cliente no envió la información a tiempo"
    ],
    why2: [
      "Selecciona una opción...",
      "Porque no hay un procedimiento de escalamiento para tickets críticos",
      "Porque los servidores estaban apagados",
      "Porque el equipo estaba en reunión",
      "Porque no había suficiente personal"
    ],
    why3: [
      "Selecciona una opción...",
      "Porque no se ha formalizado la planificación de procesos críticos con asignación de responsables",
      "Porque el gerente no lo aprobó",
      "Porque no había presupuesto",
      "Porque los empleados no querían implementarlo"
    ]
  };

  // Opciones originales para Acción Correctiva, Implementación y Verificación
  const actionOptions = {
    correctiveAction: [
      "Selecciona la acción correctiva...",
      "Diseñar e implementar un procedimiento de escalamiento automático para tickets críticos, con notificaciones programadas y asignación de responsables según niveles de prioridad",
      "Contratar más personal para el área de soporte técnico",
      "Capacitar al equipo en gestión del tiempo",
      "Implementar un sistema de notificaciones por SMS"
    ],
    implementation: [
      "Selecciona la implementación y seguimiento...",
      "Procedimiento de escalamiento implementado el 15 de noviembre. Se configuró el sistema de tickets con alertas automáticas cada 2 horas para tickets críticos. Se capacitó al equipo de soporte y se asignaron responsables por turno. Evidencia: Manual del procedimiento, capturas del sistema configurado, acta de capacitación",
      "Se contrató a 3 nuevos empleados en diciembre",
      "Se realizó una capacitación general el 20 de noviembre",
      "Se instaló un nuevo software de notificaciones"
    ],
    verification: [
      "Selecciona la verificación de eficacia...",
      "A los dos meses, se revisaron 50 tickets críticos y todos fueron atendidos dentro del tiempo establecido (4 horas). No se recibieron quejas de clientes por demoras en respuestas. Acción correctiva eficaz",
      "Se observó una mejora del 20% en los tiempos de respuesta",
      "El equipo reportó estar más motivado",
      "Se redujo el número de tickets en un 10%"
    ]
  };

  // Shuffle options when quiz starts or is reset
  useEffect(() => {
    if (!quizSubmitted && activeSection === 'quiz') {
      setShuffledOptions({
        why1: shuffleArray(whyOptions.why1),
        why2: shuffleArray(whyOptions.why2),
        why3: shuffleArray(whyOptions.why3),
        correctiveAction: shuffleArray(actionOptions.correctiveAction),
        implementation: shuffleArray(actionOptions.implementation),
        verification: shuffleArray(actionOptions.verification)
      });
    }
  }, [quizSubmitted, activeSection]);

  // Lista de pasos para ordenar (desordenada)
  const stepsToOrder = [
    { id: 'step-3', text: 'Analizar la causa raíz usando los 5 Porqués', correctOrder: 3 },
    { id: 'step-5', text: 'Verificar después de 1 mes que no hay reclamos similares', correctOrder: 5 },
    { id: 'step-1', text: 'Documentar la queja del cliente y verificar la no conformidad', correctOrder: 1 },
    { id: 'step-4', text: 'Implementar un control de calidad adicional en la línea de producción', correctOrder: 4 },
    { id: 'step-2', text: 'Reemplazar inmediatamente el producto defectuoso', correctOrder: 2 }
  ];

  // Función para manejar el drag & drop
  const handleDragStart = (e, stepId) => {
    setDraggedItem(stepId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStepId) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetStepId) return;

    // Intercambiar posiciones en el estado
    const currentOrder = quizAnswers.stepOrder || stepsToOrder.map(s => s.id);
    const draggedIndex = currentOrder.indexOf(draggedItem);
    const targetIndex = currentOrder.indexOf(targetStepId);

    const newOrder = [...currentOrder];
    newOrder[draggedIndex] = targetStepId;
    newOrder[targetIndex] = draggedItem;

    setQuizAnswers(prev => ({
      ...prev,
      stepOrder: newOrder
    }));

    setDraggedItem(null);
  };

  const handleBackToMap = () => {
    if (activeSection) {
      // Si estamos en una sección, volver al grid
      setActiveSection(null);
    } else {
      // Si estamos en el grid, volver al mapa
      navigate('/map');
    }
  };

  const renderGridLayout = () => (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo y estrellas */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-star-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Botón volver al mapa */}
      <motion.button
        onClick={handleBackToMap}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-yellow-300 transition-colors px-4 py-2 rounded-lg"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>{activeSection ? 'Volver al grid' : 'Volver al mapa'}</span>
      </motion.button>

      <div className="w-full min-h-screen p-4 md:p-8 pt-20">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3 pt-10"
          >
            <FontAwesomeIcon icon={faThLarge} />
            ACR: Acciones Correctivas
          </motion.h1>

          <AnimatePresence mode="wait">
            {!activeSection ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 pt-8"
              >
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{
                      scale: 1.07,
                      boxShadow: "0 0 32px 0 rgba(255,255,180,0.18)"
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveSection(section.id)}
                    className={`${section.color} rounded-xl p-8 text-white shadow-2xl transform min-h-[180px] flex flex-col items-center justify-center`}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                      type: "tween",
                      ease: "easeOut",
                      scale: { duration: 0.2, ease: "easeOut" },
                      boxShadow: { duration: 0.2, ease: "easeOut" }
                    }}
                  >
                    <FontAwesomeIcon icon={section.icon} className="text-5xl mb-4" />
                    <h3 className="text-xl font-bold text-center">{section.name}</h3>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="section"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[600px] pt-4"
              >
                {/* Header de la sección */}
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-yellow-300">
                    {getContent(activeSection).title}
                  </h2>
                </div>

                <div className="text-gray-100">
                  {activeSection === 'objetivo' && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-lg border border-white/10">
                        <p className="text-lg leading-relaxed">
                          Fortalecer las competencias del personal para <strong className="text-yellow-300">documentar correctamente las acciones correctivas</strong>,
                          garantizando que eliminen la causa raíz de las no conformidades y eviten su recurrencia, aplicando la metodología de los <strong className="text-purple-300">5 Porqués</strong>.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-400">
                          <FontAwesomeIcon icon={faBullseye} className="text-blue-400 text-2xl mb-2" />
                          <h4 className="font-bold text-lg mb-2">Meta Principal</h4>
                          <p>Eliminar causas raíz de no conformidades y prevenir su repetición sistemática.</p>
                        </div>
                        <div className="bg-green-900/30 p-4 rounded-lg border-l-4 border-green-400">
                          <FontAwesomeIcon icon={faChartLine} className="text-green-400 text-2xl mb-2" />
                          <h4 className="font-bold text-lg mb-2">Resultado Esperado</h4>
                          <p>Personal capacitado en análisis profundo y documentación efectiva de acciones correctivas.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'conceptos' && (
                    <div className="space-y-3">
                      <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                        <h4 className="font-bold text-xl text-red-300 mb-2">No Conformidad</h4>
                        <p className="text-gray-200">Incumplimiento de un requisito establecido (interno, del cliente o normativo).</p>
                      </div>

                      <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg">
                        <h4 className="font-bold text-xl text-yellow-300 mb-2">Corrección</h4>
                        <p className="text-gray-200">Acción <strong>inmediata</strong> para controlar o eliminar el efecto detectado. <span className="text-yellow-400 font-semibold">No elimina la causa.</span></p>
                        <div className="mt-2 p-2 bg-black/30 rounded text-sm">
                          <strong>Ejemplo:</strong> Retirar un documento erróneo y enviarlo corregido de inmediato.
                        </div>
                      </div>

                      <div className="bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                        <h4 className="font-bold text-xl text-green-300 mb-2">Acción Correctiva</h4>
                        <p className="text-gray-200">Acción tomada para <strong>eliminar la causa raíz</strong> de una no conformidad y <strong>evitar su repetición</strong>.</p>
                        <div className="mt-2 p-2 bg-black/30 rounded text-sm">
                          <strong>Ejemplo:</strong> Implementar un checklist de revisión obligatorio para todos los documentos.
                        </div>
                      </div>

                      <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg">
                        <h4 className="font-bold text-xl text-purple-300 mb-2">Causa Raíz</h4>
                        <p className="text-gray-200">Motivo <strong>fundamental</strong> que origina la no conformidad. Su eliminación evita la recurrencia.</p>
                        <div className="mt-2 p-2 bg-black/30 rounded text-sm">
                          <strong>Importante:</strong> No es "error humano" o "falta de compromiso". Hay que profundizar más.
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'etapas' && (
                    <div className="space-y-4">
                      {/* Mensaje instructivo */}
                      <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/50 mb-6">
                        <p className="text-sm text-blue-300 text-center">
                          <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                          💡 Haz clic en cada sección para más información
                        </p>
                      </div>

                      {[
                        {
                          num: 1,
                          titulo: "Identificación del Problema",
                          color: "red",
                          preguntas: ["¿Qué ocurrió?", "¿Dónde ocurrió?", "¿Cuándo ocurrió?", "¿Quién lo detectó?", "¿Qué evidencia existe?"],
                          tips: ["Describe el hecho con precisión", "Identifica el tipo de hallazgo (interno/externo)", "Incluye la fuente de evidencia", "No incluyas análisis de causas aún"]
                        },
                        {
                          num: 2,
                          titulo: "Corrección (Acción Inmediata)",
                          color: "yellow",
                          backgroundColor: "bg-yellow-900/30",
                          preguntas: ["¿Qué se hizo inmediatamente?", "¿Quién fue el responsable?", "¿Cuándo se ejecutó?"],
                          tips: ["Actúa rápido pero documenta todo", "Asigna responsables y tiempos claros", "Esta NO es la acción correctiva, solo medida temporal"]
                        },
                        {
                          num: 3,
                          titulo: "Análisis de Causas (5 Porqués)",
                          color: "blue",
                          preguntas: ["¿Por qué ocurrió?", "Pregunta '¿Por qué?' hasta 5 veces o más"],
                          tips: ["Evita respuestas superficiales", "Profundiza hasta la causa raíz", "Documenta con evidencia"]
                        },
                        {
                          num: 4,
                          titulo: "Definición de Acción Correctiva",
                          color: "green",
                          preguntas: ["¿Qué se va a hacer?", "¿Cómo?", "¿Quién?", "¿Cuándo?", "¿Qué recursos?"],
                          tips: ["Debe atacar la causa raíz", "Debe ser medible y verificable", "Incluye recursos necesarios"]
                        },
                        {
                          num: 5,
                          titulo: "Implementación y Seguimiento",
                          color: "purple",
                          preguntas: ["¿Se ejecutó según lo planeado?", "¿Qué evidencias existen?"],
                          tips: ["Documenta fechas de inicio y fin", "Adjunta evidencias de ejecución", "Registra resultados obtenidos"]
                        },
                        {
                          num: 6,
                          titulo: "Verificación de Eficacia",
                          color: "pink",
                          preguntas: ["¿Se eliminó la causa raíz?", "¿Ha vuelto a ocurrir?"],
                          tips: ["Revisa después de un periodo determinado", "Verifica si evitó la recurrencia", "Documenta la eficacia"]
                        }
                      ].map((etapa, idx) => (
                        <motion.div
                          key={idx}
                          layout
                          transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                          whileHover={{ scale: 1.02 }}
                          style={{ willChange: 'transform' }}
                          className={`${etapa.backgroundColor || `bg-${etapa.color}-900/20`} border-l-4 border-${etapa.color}-500 p-4 rounded-lg cursor-pointer`}
                          onClick={() => setExpandedExample(expandedExample === idx ? null : idx)}
                        >
                          <motion.div layout="position" className="flex items-start gap-3">
                            <div className={`bg-${etapa.color}-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0`}>
                              <span className="font-bold text-lg">{etapa.num}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-xl mb-2">{etapa.titulo}</h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-semibold text-gray-300 mb-1">Preguntas clave:</p>
                                  <ul className="text-sm space-y-1">
                                    {etapa.preguntas.map((p, i) => (
                                      <li key={i} className="text-gray-200">• {p}</li>
                                    ))}
                                  </ul>
                                </div>
                                {expandedExample === idx && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-3 p-3 bg-black/40 rounded"
                                  >
                                    <p className="text-sm font-semibold text-yellow-300 mb-2">💡 Tips importantes:</p>
                                    <ul className="text-sm space-y-1">
                                      {etapa.tips.map((tip, i) => (
                                        <li key={i} className="text-gray-200">✓ {tip}</li>
                                      ))}
                                    </ul>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeSection === 'cinco-porques' && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 rounded-lg border border-white/10 mb-6">
                        <h4 className="text-xl font-bold mb-3">¿Qué es?</h4>
                        <p className="mb-4">
                          Consiste en preguntarse <strong className="text-yellow-300">"¿Por qué?"</strong> cinco veces
                          (o las veces necesarias) hasta llegar a la <strong className="text-purple-300">causa raíz</strong>.
                        </p>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <p className="text-sm text-yellow-200">
                            <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                            <strong>Importante:</strong> No siempre son exactamente 5 preguntas. Pueden ser 3, 4, 6 o más.
                            Lo importante es llegar a la causa raíz fundamental.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xl font-bold text-white">Ejemplos Interactivos:</h4>
                        <AnimatePresence initial={false}>
                          {scenarios.map((scenario) => {
                            const isOpen = selectedScenario === scenario.id;
                            const isClosing = closingScenario === scenario.id;
                            if (!isOpen && !isClosing) {
                              return (
                                <motion.div
                                  key={scenario.id}
                                  layout
                                  transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
                                  whileHover={{ scale: 1.02, boxShadow: "0 4px 24px 0 rgba(80,80,180,0.10)" }}
                                  className="bg-white/5 border border-white/20 rounded-lg p-4 cursor-pointer"
                                  onClick={() => {
                                    setClosingScenario(selectedScenario);
                                    setSelectedScenario(scenario.id);
                                  }}
                                >
                                  <motion.div layout="position" className="flex justify-between items-center">
                                    <h5 className="font-bold text-lg">{scenario.title}</h5>
                                    <span className="text-2xl">+</span>
                                  </motion.div>
                                </motion.div>
                              );
                            }
                            return (
                              <motion.div
                                key={scenario.id}
                                layout
                                transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
                                whileHover={{ scale: 1.02, boxShadow: "0 4px 24px 0 rgba(80,80,180,0.10)" }}
                                className="bg-white/5 border border-white/20 rounded-lg p-4 cursor-pointer"
                                onClick={() => {
                                  if (isOpen) {
                                    setClosingScenario(scenario.id);
                                    setSelectedScenario(null);
                                  } else {
                                    setClosingScenario(selectedScenario);
                                    setSelectedScenario(scenario.id);
                                  }
                                }}
                                initial={isClosing ? false : { opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                              >
                                <motion.div layout="position" className="flex justify-between items-center">
                                  <h5 className="font-bold text-lg">{scenario.title}</h5>
                                  <span className="text-2xl">{isOpen ? '−' : '+'}</span>
                                </motion.div>
                                {(isOpen || isClosing) && (
                                  <motion.div
                                    key="expanded"
                                    layout
                                    initial={isClosing ? false : { opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="mt-4 space-y-3"
                                    onAnimationComplete={() => {
                                      if (isClosing) setClosingScenario(null);
                                    }}
                                  >
                                    <div className="bg-red-900/30 p-3 rounded border-l-4 border-red-500">
                                      <p className="text-sm font-semibold text-red-300">Problema:</p>
                                      <p>{scenario.problema}</p>
                                    </div>

                                    <div className="space-y-2">
                                      {scenario.porques.map((porque, idx) => (
                                        <motion.div
                                          key={idx}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -20 }}
                                          transition={{ delay: idx * 0.08, duration: 0.18 }}
                                          className="bg-blue-900/20 p-3 rounded-lg"
                                        >
                                          <p className="text-sm font-semibold text-blue-300">{idx + 1}. {porque.pregunta}</p>
                                          <p className="text-sm mt-1 ml-4">→ {porque.respuesta}</p>
                                        </motion.div>
                                      ))}
                                    </div>

                                    <div className="bg-green-900/30 p-4 rounded-lg border-l-4 border-green-500">
                                      <p className="text-sm font-semibold text-green-300 mb-2">🎯 Causa Raíz Identificada:</p>
                                      <p className="font-bold">{scenario.causaRaiz}</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3">
                                      <div className="bg-yellow-900/20 p-3 rounded-lg">
                                        <p className="text-sm font-semibold text-yellow-300 mb-1">Corrección (Inmediata):</p>
                                        <p className="text-sm">{scenario.correccion}</p>
                                      </div>
                                      <div className="bg-purple-900/20 p-3 rounded-lg">
                                        <p className="text-sm font-semibold text-purple-300 mb-1">Acción Correctiva:</p>
                                        <p className="text-sm">{scenario.accionCorrectiva}</p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {activeSection === 'practico' && (
                    <div className="space-y-4">
                      <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500 mb-4">
                        <p className="text-sm">
                          <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                          A continuación, dos ejemplos reales de aplicación completa de la metodología ACR, desde la identificación hasta la verificación de eficacia.
                        </p>
                      </div>

                      {/* Situación 1: Informe con datos incompletos */}
                      <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 p-6 rounded-lg border border-white/10">
                        <h4 className="text-xl font-bold mb-4 text-green-300">🟩 SITUACIÓN 1 — Informe técnico con datos incompletos</h4>

                        {/* Contexto inicial */}
                        <div className="bg-black/40 p-4 rounded-lg mb-4">
                          <p className="font-semibold mb-2 text-yellow-300">Situación detectada:</p>
                          <p className="text-sm">
                            El 10 de octubre, durante la revisión de documentos enviados al cliente X, se identificó que el informe técnico
                            contenía datos incompletos. La no conformidad fue detectada por el Líder del proceso responsable del cliente,
                            durante la verificación final.
                          </p>
                        </div>

                        {/* Etapa 1: Identificación */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-blue-300 mb-2">1. Identificación del Problema</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Qué:</strong> El informe técnico enviado al cliente X contenía datos incompletos.</p>
                            <p><strong>Dónde:</strong> En el proceso de elaboración y revisión de informes técnicos.</p>
                            <p><strong>Cuándo:</strong> 10 de octubre.</p>
                            <p><strong>Quién lo detectó:</strong> Líder del proceso responsable del cliente.</p>
                            <p><strong>Evidencia:</strong> Versión del informe con campos vacíos detectada durante la verificación final.</p>
                            <p><strong>Tipo:</strong> No conformidad interna (control de calidad interno).</p>
                          </div>
                        </div>

                        {/* Etapa 2: Corrección */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-yellow-300 mb-2">2. Corrección (Acción Inmediata)</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Qué se hizo:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Se retiró temporalmente el envío al cliente</li>
                              <li>• Se bloqueó la versión pendiente</li>
                              <li>• Se solicitó al técnico la actualización inmediata del informe</li>
                            </ul>
                            <p className="mt-2"><strong>Fecha:</strong> 10 de octubre (misma fecha de detección).</p>
                            <p><strong>Responsable:</strong> Líder del proceso.</p>
                            <p><strong>Evidencia:</strong> Correo interno solicitando corrección, versión corregida con registro de control de cambios.</p>
                            <p><strong>Observación:</strong> Mantener revisión 100% por el líder hasta implementar el procedimiento estandarizado.</p>
                          </div>
                        </div>

                        {/* Etapa 3: Análisis de causas */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-purple-300 mb-2">3. Análisis de Causas (5 Porqués)</p>
                          <div className="space-y-2 text-sm">
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué el informe tenía datos incompletos?</strong></p>
                              <p className="ml-3">→ Porque el auxiliar no verificó toda la información antes del envío.</p>
                            </div>
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué no verificó la información?</strong></p>
                              <p className="ml-3">→ Porque no contaba con un formato de revisión previo definido.</p>
                            </div>
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué no existe un formato de revisión previo?</strong></p>
                              <p className="ml-3">→ Porque el proceso no exige formalmente una revisión o checklist para informes.</p>
                            </div>
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué el proceso no lo exige?</strong></p>
                              <p className="ml-3">→ Porque no se identificó la necesidad de control documental en informes técnicos durante el diseño del procedimiento.</p>
                            </div>
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué no se identificó esa necesidad?</strong></p>
                              <p className="ml-3">→ Porque no hay un mecanismo formal que obligue la evaluación y actualización de procedimientos y formatos.</p>
                            </div>
                            <p className="mt-3 font-bold text-red-300">🎯 Causa Raíz: Falta de un procedimiento estandarizado para la revisión de informes antes del envío al cliente.</p>
                          </div>
                        </div>

                        {/* Etapa 4: Acción Correctiva */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-green-300 mb-2">4. Definición de la Acción Correctiva</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Qué:</strong> Elaborar y aprobar un procedimiento que defina la revisión anual de todos los formatos utilizados en los procesos técnicos.</p>
                            <p><strong>Cómo:</strong> A través del área de calidad, con revisión por la dirección y registro de actualización.</p>
                            <p><strong>Quién:</strong> Líder del proceso junto con el área de calidad.</p>
                            <p><strong>Cuándo:</strong> Implementación en octubre.</p>
                            <p><strong>Recursos:</strong> Tiempo del personal técnico y herramienta documental institucional.</p>
                          </div>
                        </div>

                        {/* Etapa 5: Implementación */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-indigo-300 mb-2">5. Implementación y Seguimiento</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Acción ejecutada:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Procedimiento elaborado y aprobado el 25 de octubre</li>
                              <li>• Se capacitó al personal técnico</li>
                              <li>• Se actualizó el formato en el sistema documental</li>
                            </ul>
                            <p className="mt-2"><strong>Evidencia:</strong> Acta de capacitación, control de cambios del documento.</p>
                            <p><strong>Seguimiento:</strong> Revisión mensual de cumplimiento por el líder.</p>
                          </div>
                        </div>

                        {/* Etapa 6: Verificación */}
                        <div className="bg-white/10 p-4 rounded-lg">
                          <p className="font-semibold text-pink-300 mb-2">6. Verificación de Eficacia</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Periodo:</strong> Dos meses después de la implementación.</p>
                            <p><strong>Resultado:</strong> Se revisaron 10 informes técnicos y todos fueron entregados completos y a tiempo.</p>
                            <p className="mt-2 font-bold text-green-400">✅ Acción correctiva eficaz.</p>
                          </div>
                        </div>
                      </div>

                      {/* Situación 2: Retraso en factura */}
                      <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 p-6 rounded-lg border border-white/10">
                        <h4 className="text-xl font-bold mb-4 text-blue-300">🟦 SITUACIÓN 2 — Retraso en entrega de factura al cliente ABC S.A.</h4>

                        {/* Contexto inicial */}
                        <div className="bg-black/40 p-4 rounded-lg mb-4">
                          <p className="font-semibold mb-2 text-yellow-300">Situación detectada:</p>
                          <p className="text-sm">
                            El 4 de octubre, el cliente "ABC S.A." reportó retraso en la entrega de la factura del servicio
                            correspondiente al mes de septiembre. La no conformidad fue detectada por el director de operaciones
                            al recibir la queja del cliente por correo.
                          </p>
                        </div>

                        {/* Etapa 1: Identificación */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-blue-300 mb-2">1. Identificación del Problema</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Qué:</strong> Retraso en la entrega de la factura del servicio correspondiente al mes de septiembre.</p>
                            <p><strong>Dónde:</strong> En el proceso de facturación.</p>
                            <p><strong>Cuándo:</strong> 4 de octubre.</p>
                            <p><strong>Quién lo detectó:</strong> Cliente "ABC S.A." (a través de una queja).</p>
                            <p><strong>Evidencia:</strong> Correo del cliente reportando el retraso.</p>
                            <p><strong>Tipo:</strong> No conformidad externa (reportada por el cliente).</p>
                            <p><strong>Fuente:</strong> Queja del cliente / Cronograma de facturación.</p>
                          </div>
                        </div>

                        {/* Etapa 2: Corrección */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-yellow-300 mb-2">2. Corrección (Acción Inmediata)</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Qué se hizo:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Se emitió y remitió la factura de manera prioritaria al cliente el mismo día</li>
                              <li>• Se envió comunicación de disculpa y confirmación de entrega</li>
                              <li>• Se ajustó manualmente el cronograma para enviar las facturas pendientes</li>
                            </ul>
                            <p className="mt-2"><strong>Fecha:</strong> 4 de octubre.</p>
                            <p><strong>Responsable:</strong> Director de Operaciones (en coordinación con Contabilidad).</p>
                            <p><strong>Alcance:</strong> Pagos/facturación del mes de septiembre para ABC S.A.</p>
                            <p><strong>Evidencia:</strong> Correo al cliente con factura adjunta, registro de envío, nota interna de ajuste de cronograma.</p>
                            <p><strong>Observación:</strong> Mantener seguimiento diario hasta implementar la matriz de control mensual.</p>
                          </div>
                        </div>

                        {/* Etapa 3: Análisis de causas */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-purple-300 mb-2">3. Análisis de Causas (5 Porqués)</p>
                          <div className="space-y-2 text-sm">
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué se retrasó la entrega de la factura?</strong></p>
                              <p className="ml-3">→ Porque la factura no fue enviada en la fecha planeada.</p>
                            </div>
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué no fue enviada en la fecha planeada?</strong></p>
                              <p className="ml-3">→ Porque no se recibió la aprobación interna necesaria dentro del cronograma.</p>
                            </div>
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué no se obtuvo la aprobación a tiempo?</strong></p>
                              <p className="ml-3">→ Porque no se realizó seguimiento al cierre del servicio y sus aprobaciones.</p>
                            </div>
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué no se realizó seguimiento?</strong></p>
                              <p className="ml-3">→ Porque no existe una matriz de control con responsables y fechas para el ciclo de facturación.</p>
                            </div>
                            <div className="bg-purple-900/20 p-2 rounded">
                              <p><strong>¿Por qué no existe esa matriz de control?</strong></p>
                              <p className="ml-3">→ Porque no se formalizó la planificación mensual con asignación de responsables para cada actividad del ciclo.</p>
                            </div>
                            <p className="mt-3 font-bold text-red-300">🎯 Causa Raíz: Falta de una matriz de control y planificación mensual formalizada para el ciclo de facturación.</p>
                          </div>
                        </div>

                        {/* Etapa 4: Acción Correctiva */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-green-300 mb-2">4. Definición de la Acción Correctiva</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Qué:</strong> Diseñar e implementar una matriz de control mensual con fechas, responsables y estado de cada factura.</p>
                            <p><strong>Cómo:</strong> En Excel o Power BI, integrada con los registros de servicios cerrados.</p>
                            <p><strong>Quién:</strong> Director de Operaciones junto con el área de contabilidad.</p>
                            <p><strong>Cuándo:</strong> Implementación durante la primera semana de noviembre.</p>
                            <p><strong>Recursos:</strong> Plantilla de control, capacitación corta y coordinación entre áreas.</p>
                          </div>
                        </div>

                        {/* Etapa 5: Implementación */}
                        <div className="bg-white/10 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-indigo-300 mb-2">5. Implementación y Seguimiento</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Acción ejecutada:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Matriz de control mensual implementada el 7 de noviembre</li>
                              <li>• Se definieron responsables y fechas de envío</li>
                              <li>• Se revisa el cumplimiento semanalmente</li>
                            </ul>
                            <p className="mt-2"><strong>Evidencia:</strong> Matriz de control actualizada, registros de revisión semanal.</p>
                            <p><strong>Seguimiento:</strong> Evaluación mensual del indicador de puntualidad de facturación.</p>
                          </div>
                        </div>

                        {/* Etapa 6: Verificación */}
                        <div className="bg-white/10 p-4 rounded-lg">
                          <p className="font-semibold text-pink-300 mb-2">6. Verificación de Eficacia</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Periodo:</strong> Dos meses después.</p>
                            <p><strong>Resultado:</strong> Todas las facturas de diciembre y enero fueron enviadas en las fechas previstas.</p>
                            <p className="mt-2 font-bold text-green-400">✅ Acción correctiva eficaz.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-500">
                        <p className="text-sm">
                          <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                          <strong>Observa:</strong> En ambos casos se aplicó la metodología completa de ACR, desde la identificación del problema
                          hasta la verificación de eficacia. La clave está en encontrar la causa raíz sistémica, no solo solucionar el síntoma.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'recomendaciones' && (
                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                          <h4 className="font-bold text-lg text-red-300 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            Evita estas frases
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>• "Falla humana" o "error humano"</li>
                            <li>• "Falta de compromiso"</li>
                            <li>• "Descuido del personal"</li>
                            <li>• "Falta de atención"</li>
                          </ul>
                          <p className="mt-3 text-sm text-gray-300">
                            <strong>¿Por qué?</strong> Estas no son causas raíz válidas. Hay que profundizar más para encontrar
                            el problema sistémico.
                          </p>
                        </div>

                        <div className="bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                          <h4 className="font-bold text-lg text-green-300 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Mejores prácticas
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>• <strong>Documenta con evidencia:</strong> Revisión de procedimientos, entrevistas, registros</li>
                            <li>• <strong>Sé específico:</strong> Incluye fechas, responsables y documentos de soporte</li>
                            <li>• <strong>Busca causas sistémicas:</strong> Falta de procedimientos, controles inexistentes, formatos sin actualizar</li>
                            <li>• <strong>Asegura trazabilidad:</strong> No conformidad → causa raíz → acción correctiva → verificación</li>
                          </ul>
                        </div>

                        <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
                          <h4 className="font-bold text-lg text-blue-300 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faFileAlt} />
                            Documentación efectiva
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="bg-black/30 p-3 rounded">
                              <p className="font-semibold mb-1">En cada etapa registra:</p>
                              <ul className="space-y-1 ml-4">
                                <li>→ Fechas específicas</li>
                                <li>→ Responsables asignados</li>
                                <li>→ Evidencias adjuntas</li>
                                <li>→ Acciones tomadas</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg">
                          <h4 className="font-bold text-lg text-purple-300 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faChartLine} />
                            Verificación de eficacia
                          </h4>
                          <p className="text-sm mb-3">
                            La acción correctiva debe verificarse después de un periodo razonable:
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li>• <strong>Plazo recomendado:</strong> 1 a 3 meses según la acción</li>
                            <li>• <strong>Método:</strong> Revisar si volvió a ocurrir la no conformidad</li>
                            <li>• <strong>Evidencia:</strong> Registros, indicadores, auditorías</li>
                            <li>• <strong>Conclusión:</strong> Declarar si fue eficaz o requiere ajuste</li>
                          </ul>
                        </div>

                        <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg">
                          <h4 className="font-bold text-lg text-yellow-300 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            Prevención vs Corrección
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="bg-black/30 p-3 rounded">
                              <p className="font-semibold text-yellow-200 mb-1">Corrección:</p>
                              <p>Solución rápida, temporal, elimina el efecto</p>
                            </div>
                            <div className="bg-black/30 p-3 rounded">
                              <p className="font-semibold text-green-200 mb-1">Acción Correctiva:</p>
                              <p>Solución permanente, elimina la causa raíz</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'guia' && (
                    <div className="space-y-6">
                      {/* Modal para imagen ampliada */}
                      <AnimatePresence>
                        {expandedImage && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setExpandedImage(null)}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 cursor-pointer"
                            style={{ margin: 0 }}
                          >
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ type: "spring", damping: 25, stiffness: 300 }}
                              onClick={(e) => e.stopPropagation()}
                              className="relative max-w-6xl max-h-[90vh] cursor-default"
                            >
                              <img
                                src={expandedImage}
                                alt="Vista ampliada"
                                className="rounded-lg shadow-2xl max-w-full max-h-[90vh] object-contain"
                              />
                              <button
                                onClick={() => setExpandedImage(null)}
                                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors"
                              >
                                ✕
                              </button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Header principal */}
                      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-8 rounded-xl border-2 border-yellow-500/30 shadow-2xl">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-yellow-500 rounded-full p-4">
                            <FontAwesomeIcon icon={faFileAlt} className="text-3xl text-white" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold text-yellow-300">Guía de Diligenciamiento ACR</h3>
                            <p className="text-gray-300 mt-1">Paso a paso para registrar una Acción Correctiva</p>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg mt-4">
                          <p className="text-sm text-yellow-200">
                            <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                            Sigue estos pasos para completar correctamente el registro de tu ACR en el sistema.
                          </p>
                        </div>
                      </div>

                      {/* Paso 1 - Ingreso al sistema */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 rounded-xl border border-blue-500/30 shadow-lg"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="font-bold text-xl">1</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-2xl text-blue-300 mb-2">Acceso al Sistema</h4>
                            <p className="text-gray-300">Ingresa al enlace del sistema ACR</p>
                          </div>
                        </div>

                        <div className="space-y-4 ml-16">
                          <div className="bg-blue-900/40 p-4 rounded-lg border-l-4 border-blue-400">
                            <p className="mb-3">
                              <span className="font-semibold text-blue-300">→</span> Accede al enlace:
                              <span className="text-yellow-300 font-semibold ml-2">[https://acr.solutionsandpayroll.com]</span>
                            </p>
                            <p className="text-sm text-gray-300">
                              Una vez dentro, encontrarás la sección <strong className="text-purple-300">"INFORMACIÓN GENERAL"</strong>
                            </p>
                          </div>

                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <img
                              src="/img/informacion_general.png"
                              alt="Sección Información General"
                              onClick={() => setExpandedImage("/img/informacion_general.png")}
                              className="rounded-lg border-2 border-blue-400/50 shadow-xl mx-auto max-w-[600px] w-full cursor-pointer hover:border-blue-400 transition-all hover:shadow-2xl"
                            />
                            <p className="text-center text-xs text-blue-300 mt-2">
                              <FontAwesomeIcon icon={faSearch} className="mr-1" />
                              Haz clic para ampliar
                            </p>
                          </div>

                          <div className="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
                            <p className="text-sm">
                              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-400 mr-2" />
                              <strong className="text-yellow-300">Importante:</strong> Algunos campos son de texto libre, otros son listas desplegables.
                              Haz clic en ellos para ver las opciones disponibles.
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="bg-black/30 p-3 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Campos obligatorios</p>
                              <ul className="text-sm space-y-1">
                                <li>• Proceso</li>
                                <li>• Tipo de acción</li>
                                <li>• Descripción detallada</li>
                                <li>• Fecha de detección</li>
                              </ul>
                            </div>
                            <div className="bg-black/30 p-3 rounded-lg">
                              <p className="text-xs text-gray-400 mb-1">Recuerda incluir</p>
                              <ul className="text-sm space-y-1">
                                <li>• Qué ocurrió</li>
                                <li>• Dónde y cuándo</li>
                                <li>• Quién lo detectó</li>
                                <li>• Evidencia disponible</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Paso 2 - Corrección */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-6 rounded-xl border border-green-500/30 shadow-lg"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="font-bold text-xl">2</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-2xl text-green-300 mb-2">Sección de Corrección</h4>
                            <p className="text-gray-300">Documenta las acciones inmediatas tomadas</p>
                          </div>
                        </div>

                        <div className="space-y-4 ml-16">
                          <div className="bg-green-900/40 p-4 rounded-lg border-l-4 border-green-400">
                            <p className="font-semibold text-green-300 mb-2">🔧 CORRECCIÓN (No aplica para riesgos)</p>
                            <p className="text-sm text-gray-300">
                              Registra las actividades de corrección inmediata que se realizaron para controlar el problema.
                            </p>
                          </div>

                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <img
                              src="/img/informacion_correccion.png"
                              alt="Sección de Corrección"
                              onClick={() => setExpandedImage("/img/informacion_correccion.png")}
                              className="rounded-lg border-2 border-green-400/50 shadow-xl mx-auto max-w-[600px] w-full cursor-pointer hover:border-green-400 transition-all hover:shadow-2xl"
                            />
                            <p className="text-center text-xs text-green-300 mt-2">
                              <FontAwesomeIcon icon={faSearch} className="mr-1" />
                              Haz clic para ampliar
                            </p>
                          </div>

                          <div className="bg-black/30 p-4 rounded-lg">
                            <p className="text-sm mb-3 font-semibold text-green-300">Para cada actividad de corrección, especifica:</p>
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Descripción de la acción tomada</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Responsable de ejecutarla</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Fecha de ejecución</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Evidencia documental</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                            <p className="text-sm text-green-300 font-semibold mb-2">
                              <FontAwesomeIcon icon={faTasks} className="mr-2" />
                              ¿Necesitas más actividades?
                            </p>
                            <p className="text-sm">
                              Haz clic en el botón <strong className="text-green-300">"Agregar Actividad de Corrección"</strong>
                              en la parte inferior de la sección.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Paso 3 - Análisis con IA */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-6 rounded-xl border border-purple-500/30 shadow-lg"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="font-bold text-xl">3</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-2xl text-purple-300 mb-2">Análisis de Causas con IA</h4>
                            <p className="text-gray-300">Identifica las causas raíz con asistencia inteligente</p>
                          </div>
                        </div>

                        <div className="space-y-4 ml-16">
                          <div className="bg-purple-900/40 p-4 rounded-lg border-l-4 border-purple-400">
                            <p className="font-semibold text-purple-300 mb-2">🔍 IDENTIFICACIÓN DE CAUSAS PRINCIPALES</p>
                            <p className="text-sm text-gray-300">
                              Utiliza la inteligencia artificial para generar un análisis inicial de las causas.
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-5 rounded-lg border-2 border-purple-400/50">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="bg-purple-500 rounded-lg p-2">
                                <FontAwesomeIcon icon={faLightbulb} className="text-xl" />
                              </div>
                              <p className="font-bold text-lg text-purple-200">Asistente de IA</p>
                            </div>
                            <p className="text-sm mb-3">
                              Haz clic en el botón <strong className="text-purple-300">"Generar con IA"</strong> para obtener:
                            </p>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">→</span>
                                <span>Causas inmediatas, básicas y gerenciales</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">→</span>
                                <span>Identificación de la causa raíz</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">→</span>
                                <span>Análisis automático de los 5 "por qué"</span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <img
                              src="/img/generar_ia.png"
                              alt="Generar con IA"
                              onClick={() => setExpandedImage("/img/generar_ia.png")}
                              className="rounded-lg border-2 border-purple-400/50 shadow-xl mx-auto max-w-[600px] w-full cursor-pointer hover:border-purple-400 transition-all hover:shadow-2xl"
                            />
                            <p className="text-center text-xs text-purple-300 mt-2">
                              <FontAwesomeIcon icon={faSearch} className="mr-1" />
                              Haz clic para ampliar
                            </p>
                          </div>

                          <div className="bg-yellow-900/30 p-5 rounded-lg border-2 border-yellow-500">
                            <div className="flex items-start gap-3">
                              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-2xl mt-1" />
                              <div>
                                <p className="font-bold text-yellow-300 mb-2">⚠️ Crucial para mejores resultados:</p>
                                <p className="text-sm leading-relaxed">
                                  La calidad del análisis de IA depende directamente de la <strong>descripción de la situación</strong>
                                  que registraste en el paso 1. Mientras más completa y detallada sea (incluyendo qué, cuándo, dónde y
                                  el incumplimiento específico), más precisos serán los resultados generados.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-black/30 p-4 rounded-lg">
                            <p className="text-sm mb-3 font-semibold text-purple-300">Una vez recibas la respuesta de la IA:</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">1.</span>
                                <span>Analiza cuidadosamente las causas propuestas</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">2.</span>
                                <span>Verifica que sean causas sistémicas, no solo síntomas</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">3.</span>
                                <span>Si estás de acuerdo, haz clic en <strong className="text-purple-300">"Usar este análisis"</strong></span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">4.</span>
                                <span>O copia y pega las causas en los campos correspondientes, ajustándolas si es necesario</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Paso 4 - Plan de Acción */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 p-6 rounded-xl border border-indigo-500/30 shadow-lg"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="font-bold text-xl">4</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-2xl text-indigo-300 mb-2">Plan de Acción</h4>
                            <p className="text-gray-300">Define las acciones para eliminar las causas raíz</p>
                          </div>
                        </div>

                        <div className="space-y-4 ml-16">
                          <div className="bg-indigo-900/40 p-4 rounded-lg border-l-4 border-indigo-400">
                            <p className="font-semibold text-indigo-300 mb-2">📋 PLAN DE ACCIÓN</p>
                            <p className="text-sm text-gray-300">
                              Define las causas asociadas y las actividades específicas para eliminarlas.
                            </p>
                          </div>

                          <div className="bg-black/30 p-4 rounded-lg">
                            <p className="text-sm mb-3 font-semibold text-indigo-300">Paso a paso:</p>
                            <div className="space-y-3">
                              <div className="bg-indigo-900/20 p-3 rounded-lg">
                                <p className="font-semibold text-indigo-200 mb-2">Paso 4.1 - Registra las causas</p>
                                <p className="text-sm text-gray-300">
                                  Comienza definiendo las causas que identificaste en el análisis anterior.
                                  Usa el botón <strong className="text-indigo-300">"Agregar Causa"</strong> si necesitas incluir más.
                                </p>
                              </div>

                              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <img
                                  src="/img/plan_accion.png"
                                  alt="Plan de Acción - Causas"
                                  onClick={() => setExpandedImage("/img/plan_accion.png")}
                                  className="rounded-lg border-2 border-indigo-400/50 shadow-xl mx-auto max-w-[600px] w-full cursor-pointer hover:border-indigo-400 transition-all hover:shadow-2xl"
                                />
                                <p className="text-center text-xs text-indigo-300 mt-2">
                                  <FontAwesomeIcon icon={faSearch} className="mr-1" />
                                  Haz clic para ampliar
                                </p>
                              </div>

                              <div className="bg-indigo-900/20 p-3 rounded-lg">
                                <p className="font-semibold text-indigo-200 mb-2">Paso 4.2 - Define las actividades</p>
                                <p className="text-sm text-gray-300 mb-3">
                                  Para cada causa, define las actividades específicas que se realizarán.
                                </p>
                                <div className="grid md:grid-cols-2 gap-2 text-sm">
                                  <div className="bg-black/30 p-2 rounded">
                                    <span className="text-indigo-300">•</span> ¿Qué se va a hacer?
                                  </div>
                                  <div className="bg-black/30 p-2 rounded">
                                    <span className="text-indigo-300">•</span> ¿Quién es el responsable?
                                  </div>
                                  <div className="bg-black/30 p-2 rounded">
                                    <span className="text-indigo-300">•</span> ¿Cuándo se ejecutará?
                                  </div>
                                  <div className="bg-black/30 p-2 rounded">
                                    <span className="text-indigo-300">•</span> ¿Qué recursos se necesitan?
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <img
                                  src="/img/causas_asociadas.png"
                                  alt="Causas Asociadas"
                                  onClick={() => setExpandedImage("/img/causas_asociadas.png")}
                                  className="rounded-lg border-2 border-indigo-400/50 shadow-xl mx-auto max-w-[600px] w-full cursor-pointer hover:border-indigo-400 transition-all hover:shadow-2xl"
                                />
                                <p className="text-center text-xs text-indigo-300 mt-2">
                                  <FontAwesomeIcon icon={faSearch} className="mr-1" />
                                  Haz clic para ampliar
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30">
                            <p className="text-sm">
                              <FontAwesomeIcon icon={faLightbulb} className="text-indigo-400 mr-2" />
                              En el campo <strong className="text-indigo-300">"Causas asociadas a esta actividad"</strong>,
                              selecciona las causas que esta actividad específica está diseñada para eliminar.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Paso 5 - Costos */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 p-6 rounded-xl border border-pink-500/30 shadow-lg"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-pink-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="font-bold text-xl">5</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-2xl text-pink-300 mb-2">Costos Asociados</h4>
                            <p className="text-gray-300">Registra la inversión necesaria para la ACR</p>
                          </div>
                        </div>

                        <div className="space-y-4 ml-16">
                          <div className="bg-pink-900/40 p-4 rounded-lg border-l-4 border-pink-400">
                            <p className="font-semibold text-pink-300 mb-2">💰 COSTOS ASOCIADOS A LA ACR</p>
                            <p className="text-sm text-gray-300">
                              Documenta todos los costos relacionados con la implementación de la acción correctiva.
                            </p>
                          </div>

                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <img
                              src="/img/costos_asociados.png"
                              alt="Costos Asociados"
                              onClick={() => setExpandedImage("/img/costos_asociados.png")}
                              className="rounded-lg border-2 border-pink-400/50 shadow-xl mx-auto max-w-[600px] w-full cursor-pointer hover:border-pink-400 transition-all hover:shadow-2xl"
                            />
                            <p className="text-center text-xs text-pink-300 mt-2">
                              <FontAwesomeIcon icon={faSearch} className="mr-1" />
                              Haz clic para ampliar
                            </p>
                          </div>

                          <div className="bg-black/30 p-4 rounded-lg">
                            <p className="text-sm mb-3 font-semibold text-pink-300">Completa los siguientes campos:</p>
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              <div className="bg-pink-900/20 p-3 rounded-lg">
                                <p className="font-semibold text-pink-200 mb-1">Personal</p>
                                <p className="text-xs text-gray-400">Horas-hombre dedicadas</p>
                              </div>
                              <div className="bg-pink-900/20 p-3 rounded-lg">
                                <p className="font-semibold text-pink-200 mb-1">Materiales</p>
                                <p className="text-xs text-gray-400">Insumos y recursos</p>
                              </div>
                              <div className="bg-pink-900/20 p-3 rounded-lg">
                                <p className="font-semibold text-pink-200 mb-1">Equipos</p>
                                <p className="text-xs text-gray-400">Herramientas necesarias</p>
                              </div>
                              <div className="bg-pink-900/20 p-3 rounded-lg">
                                <p className="font-semibold text-pink-200 mb-1">Otros</p>
                                <p className="text-xs text-gray-400">Costos adicionales</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
                            <p className="text-sm">
                              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-400 mr-2" />
                              Puedes ingresar valores personalizados directamente, no es necesario utilizar los botones "+" o "-".
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 p-5 rounded-lg border-2 border-green-500">
                            <p className="font-bold text-green-300 mb-3 text-lg">Finalización del proceso:</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">1.</span>
                                <span>Haz clic en <strong className="text-green-300">"Generar reporte Excel"</strong></span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">2.</span>
                                <span>Aparecerá un botón para descargar el archivo</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">3.</span>
                                <span>Descarga el reporte y envíalo al responsable correspondiente</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <img
                              src="/img/generar_reporte.png"
                              alt="Generar Reporte"
                              onClick={() => setExpandedImage("/img/generar_reporte.png")}
                              className="rounded-lg border-2 border-pink-400/50 shadow-xl mx-auto max-w-[600px] w-full cursor-pointer hover:border-pink-400 transition-all hover:shadow-2xl"
                            />
                            <p className="text-center text-xs text-pink-300 mt-2">
                              <FontAwesomeIcon icon={faSearch} className="mr-1" />
                              Haz clic para ampliar
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Mensaje final de éxito */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-green-600/30 to-teal-600/30 p-8 rounded-xl border-2 border-green-500 shadow-2xl text-center"
                      >
                        <div className="flex justify-center mb-4">
                          <div className="bg-green-500 rounded-full p-4">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-5xl text-white" />
                          </div>
                        </div>
                        <h4 className="text-3xl font-bold text-green-300 mb-3">
                          ¡Proceso Completado!
                        </h4>
                        <p className="text-xl text-gray-200 mb-4">
                          Has completado exitosamente el registro de una Acción Correctiva
                        </p>
                        <div className="bg-black/30 p-4 rounded-lg inline-block">
                          <p className="text-sm text-gray-300">
                            <FontAwesomeIcon icon={faShieldAlt} className="text-green-400 mr-2" />
                            Recuerda hacer seguimiento a la implementación y verificar su eficacia después de 1-3 meses
                          </p>
                        </div>
                      </motion.div>

                      {/* Tips adicionales */}
                      <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                        <h4 className="font-bold text-xl text-blue-300 mb-4 flex items-center gap-2">
                          <FontAwesomeIcon icon={faLightbulb} />
                          Consejos Finales
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-black/30 p-4 rounded-lg">
                            <p className="font-semibold text-blue-200 mb-2">✓ Durante el proceso</p>
                            <ul className="text-sm space-y-1 text-gray-300">
                              <li>• Guarda tu progreso frecuentemente</li>
                              <li>• Sé específico en las descripciones</li>
                              <li>• Adjunta evidencias cuando sea posible</li>
                              <li>• Consulta con tu líder si tienes dudas</li>
                            </ul>
                          </div>
                          <div className="bg-black/30 p-4 rounded-lg">
                            <p className="font-semibold text-green-200 mb-2">✓ Después del registro</p>
                            <ul className="text-sm space-y-1 text-gray-300">
                              <li>• Comunica el plan a los involucrados</li>
                              <li>• Haz seguimiento a las fechas</li>
                              <li>• Documenta la implementación</li>
                              <li>• Verifica la eficacia posteriormente</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'quiz' && (
                    <div className="space-y-6">
                      {!quizSubmitted ? (
                        <div className="space-y-6">
                          <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500">
                            <p className="text-sm">
                              <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                              Resuelve estas situaciones prácticas para validar tu comprensión sobre acciones correctivas.
                            </p>
                          </div>

                          {/* Situación 1: Clasificación Corrección vs Acción Correctiva */}
                          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h4 className="font-bold text-xl mb-4 text-yellow-300">1. Identifica y Clasifica</h4>

                            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                              <p className="font-semibold mb-3">Situación:</p>
                              <p className="text-sm leading-relaxed">
                                En una auditoría interna, se detectó que el 30% de los informes técnicos del último mes
                                contenían errores en los cálculos. El supervisor inmediatamente:
                              </p>
                            </div>

                            <div className="space-y-3 mb-4">
                              <div className="bg-red-900/20 p-3 rounded-lg border-l-4 border-red-500">
                                <p className="font-semibold text-red-300 mb-2">Acción A:</p>
                                <p className="text-sm">Revisó y corrigió manualmente todos los informes con errores</p>
                              </div>

                              <div className="bg-green-900/20 p-3 rounded-lg border-l-4 border-green-500">
                                <p className="font-semibold text-green-300 mb-2">Acción B:</p>
                                <p className="text-sm">Implementó una plantilla Excel con fórmulas predefinidas y capacitó al equipo</p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${quizAnswers['s1-a'] === 'correccion'
                                  ? 'border-yellow-500 bg-yellow-900/30'
                                  : 'border-gray-500 hover:border-yellow-400'
                                  }`}
                                onClick={() => handleAnswerSelect('s1-a', 'correccion')}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${quizAnswers['s1-a'] === 'correccion' ? 'bg-yellow-500 border-yellow-500' : 'border-gray-400'
                                    }`}>
                                    {quizAnswers['s1-a'] === 'correccion' && '✓'}
                                  </div>
                                  <div>
                                    <p className="font-semibold">Acción A es una</p>
                                    <p className="text-yellow-300">Corrección</p>
                                  </div>
                                </div>
                              </div>

                              <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${quizAnswers['s1-a'] === 'correctiva'
                                  ? 'border-yellow-500 bg-yellow-900/30'
                                  : 'border-gray-500 hover:border-yellow-400'
                                  }`}
                                onClick={() => handleAnswerSelect('s1-a', 'correctiva')}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${quizAnswers['s1-a'] === 'correctiva' ? 'bg-yellow-500 border-yellow-500' : 'border-gray-400'
                                    }`}>
                                    {quizAnswers['s1-a'] === 'correctiva' && '✓'}
                                  </div>
                                  <div>
                                    <p className="font-semibold">Acción A es una</p>
                                    <p className="text-green-300">Acción Correctiva</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                              <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${quizAnswers['s1-b'] === 'correccion'
                                  ? 'border-yellow-500 bg-yellow-900/30'
                                  : 'border-gray-500 hover:border-yellow-400'
                                  }`}
                                onClick={() => handleAnswerSelect('s1-b', 'correccion')}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${quizAnswers['s1-b'] === 'correccion' ? 'bg-yellow-500 border-yellow-500' : 'border-gray-400'
                                    }`}>
                                    {quizAnswers['s1-b'] === 'correccion' && '✓'}
                                  </div>
                                  <div>
                                    <p className="font-semibold">Acción B es una</p>
                                    <p className="text-yellow-300">Corrección</p>
                                  </div>
                                </div>
                              </div>

                              <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${quizAnswers['s1-b'] === 'correctiva'
                                  ? 'border-yellow-500 bg-yellow-900/30'
                                  : 'border-gray-500 hover:border-yellow-400'
                                  }`}
                                onClick={() => handleAnswerSelect('s1-b', 'correctiva')}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${quizAnswers['s1-b'] === 'correctiva' ? 'bg-yellow-500 border-yellow-500' : 'border-gray-400'
                                    }`}>
                                    {quizAnswers['s1-b'] === 'correctiva' && '✓'}
                                  </div>
                                  <div>
                                    <p className="font-semibold">Acción B es una</p>
                                    <p className="text-green-300">Acción Correctiva</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Situación 2: Ordena los Pasos */}
                          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h4 className="font-bold text-xl mb-4 text-yellow-300">2. Ordena el Proceso</h4>

                            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                              <p className="font-semibold mb-3">Situación:</p>
                              <p className="text-sm leading-relaxed">
                                Se recibió una queja de cliente porque el producto entregado no cumplía con las especificaciones técnicas.
                                Ordena las acciones en la secuencia correcta arrastrándolas:
                              </p>
                            </div>

                            <div className="space-y-3">
                              {(quizAnswers.stepOrder || stepsToOrder.map(s => s.id)).map((stepId, index) => {
                                const step = stepsToOrder.find(s => s.id === stepId);
                                return (
                                  <div
                                    key={step.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, step.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, step.id)}
                                    className={`p-3 rounded-lg border-2 bg-gray-700/50 cursor-move transition-all hover:bg-gray-600/50 ${draggedItem === step.id ? 'opacity-50 border-yellow-500' : 'border-gray-500'
                                      }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                                        {index + 1}
                                      </div>
                                      <p className="text-sm flex-1">{step.text}</p>
                                      <div className="text-gray-400 text-xl">⋮⋮</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
                              <p className="text-sm text-blue-300">
                                💡 <strong>Tip:</strong> Arrastra las tarjetas para ordenarlas correctamente. Recuerda: primero la corrección inmediata, luego el análisis de causas.
                              </p>
                            </div>
                          </div>

                          {/* Situación 3: Completa los 5 Porqués */}
                          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h4 className="font-bold text-xl mb-4 text-yellow-300">3. Completa el Análisis</h4>

                            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                              <p className="font-semibold mb-3">Situación:</p>
                              <p className="text-sm leading-relaxed">
                                El equipo de soporte técnico no respondió a 5 tickets críticos dentro del tiempo establecido (4 horas).
                                Completa la cadena de los 5 Porqués:
                              </p>
                            </div>

                            <div className="space-y-4">
                              <div className="bg-blue-900/20 p-3 rounded-lg">
                                <p className="font-semibold text-blue-300 mb-2">1. ¿Por qué no se respondieron los tickets críticos a tiempo?</p>
                                <div className="w-full">
                                  <CustomDropdown
                                    options={shuffledOptions.why1.length ? shuffledOptions.why1 : whyOptions.why1}
                                    value={quizAnswers['why1'] || ''}
                                    onChange={val => handleAnswerSelect('why1', val)}
                                    placeholder={whyOptions.why1[0]}
                                  />
                                </div>
                              </div>

                              {quizAnswers['why1'] && (
                                <div className="bg-blue-900/20 p-3 rounded-lg">
                                  <p className="font-semibold text-blue-300 mb-2">
                                    2. ¿{quizAnswers['why1'].charAt(0).toUpperCase() + quizAnswers['why1'].slice(1)}?
                                  </p>
                                  <div className="w-full">
                                    <CustomDropdown
                                      options={shuffledOptions.why2.length ? shuffledOptions.why2 : whyOptions.why2}
                                      value={quizAnswers['why2'] || ''}
                                      onChange={val => handleAnswerSelect('why2', val)}
                                      placeholder={whyOptions.why2[0]}
                                    />
                                  </div>
                                </div>
                              )}

                              {quizAnswers['why2'] && (
                                <div className="bg-blue-900/20 p-3 rounded-lg">
                                  <p className="font-semibold text-blue-300 mb-2">
                                    3. ¿{quizAnswers['why2'].charAt(0).toUpperCase() + quizAnswers['why2'].slice(1)}?
                                  </p>
                                  <div className="w-full">
                                    <CustomDropdown
                                      options={shuffledOptions.why3.length ? shuffledOptions.why3 : whyOptions.why3}
                                      value={quizAnswers['why3'] || ''}
                                      onChange={val => handleAnswerSelect('why3', val)}
                                      placeholder={whyOptions.why3[0]}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Acción Correctiva */}
                            {quizAnswers['why3'] && (
                              <div className="mt-6 space-y-4">
                                <div className="bg-green-900/20 p-3 rounded-lg border-l-4 border-green-500">
                                  <p className="font-semibold text-green-300 mb-2">4. Definición de la Acción Correctiva</p>
                                  <p className="text-xs text-gray-300 mb-3">
                                    Debe responder: ¿Qué se va a hacer? ¿Cómo? ¿Quién? ¿Dónde y cuándo? ¿Qué recursos?
                                  </p>
                                  <div className="w-full">
                                    <CustomDropdown
                                      options={shuffledOptions.correctiveAction.length ? shuffledOptions.correctiveAction : actionOptions.correctiveAction}
                                      value={quizAnswers['correctiveAction'] || ''}
                                      onChange={val => handleAnswerSelect('correctiveAction', val)}
                                      placeholder={actionOptions.correctiveAction[0]}
                                    />
                                  </div>
                                </div>

                                {/* Implementación y Seguimiento */}
                                {quizAnswers['correctiveAction'] && (
                                  <div className="bg-indigo-900/20 p-3 rounded-lg border-l-4 border-indigo-500">
                                    <p className="font-semibold text-indigo-300 mb-2">5. Implementación y Seguimiento</p>
                                    <p className="text-xs text-gray-300 mb-3">
                                      Incluye fechas de inicio y fin, responsables, resultados obtenidos y evidencias
                                    </p>
                                    <div className="w-full">
                                      <CustomDropdown
                                        options={shuffledOptions.implementation.length ? shuffledOptions.implementation : actionOptions.implementation}
                                        value={quizAnswers['implementation'] || ''}
                                        onChange={val => handleAnswerSelect('implementation', val)}
                                        placeholder={actionOptions.implementation[0]}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Verificación de Eficacia */}
                                {quizAnswers['implementation'] && (
                                  <div className="bg-pink-900/20 p-3 rounded-lg border-l-4 border-pink-500">
                                    <p className="font-semibold text-pink-300 mb-2">6. Verificación de Eficacia</p>
                                    <p className="text-xs text-gray-300 mb-3">
                                      Verifica si la acción eliminó la causa y evitó la recurrencia
                                    </p>
                                    <div className="w-full">
                                      <CustomDropdown
                                        options={shuffledOptions.verification.length ? shuffledOptions.verification : actionOptions.verification}
                                        value={quizAnswers['verification'] || ''}
                                        onChange={val => handleAnswerSelect('verification', val)}
                                        placeholder={actionOptions.verification[0]}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="mt-4 p-3 bg-purple-900/30 rounded-lg">
                              <p className="text-sm text-purple-300">
                                💡 <strong>Pista:</strong> Piensa en causas sistémicas, no en errores individuales.
                                ¿Falta de procedimientos? ¿Sistemas inadecuados? ¿Falta de capacitación?
                              </p>
                            </div>
                          </div>

                          {/* Botón de envío */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuizSubmitted(true)}
                            disabled={!isQuizComplete()}
                            className={`w-full font-bold py-3 px-6 rounded-lg transition-colors ${!isQuizComplete()
                              ? 'bg-gray-600 cursor-not-allowed'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                              }`}
                          >
                            {!isQuizComplete()
                              ? 'Completa todas las actividades para enviar'
                              : 'Enviar Evaluación'
                            }
                          </motion.button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-lg border border-white/10 text-center">
                            <h4 className="text-2xl font-bold mb-4">¡Evaluación Completada!</h4>
                            <div className="text-6xl font-bold text-yellow-300 mb-2">
                              {calculateScore()} / 3
                            </div>
                            <p className="text-xl mb-4">
                              {calculateScore() === 3
                                ? "🎉 ¡Excelente! Dominas completamente la aplicación práctica de ACR"
                                : calculateScore() >= 2
                                  ? "👍 ¡Muy bien! Tienes un buen entendimiento práctico"
                                  : "📚 Buen intento, revisa los conceptos y practica más"
                              }
                            </p>
                          </div>

                          {/* Retroalimentación detallada */}
                          <div className="space-y-4">
                            <h4 className="text-xl font-bold text-white">Retroalimentación:</h4>

                            {/* Retroalimentación Situación 1 */}
                            <div className={`p-4 rounded-lg border-l-4 ${quizAnswers['s1-a'] === 'correccion' && quizAnswers['s1-b'] === 'correctiva'
                              ? 'bg-green-900/20 border-green-500'
                              : 'bg-red-900/20 border-red-500'
                              }`}>
                              <h5 className="font-bold mb-2">Situación 1: Identificación Correcta</h5>
                              <p className="text-sm mb-2">
                                <strong>Acción A (Corrección):</strong> Revisar y corregir manualmente los informes - {quizAnswers['s1-a'] === 'correccion' ? '✅ CORRECTO' : '❌ INCORRECTO'}<br />
                                <strong>Acción B (Acción Correctiva):</strong> Implementar plantilla con fórmulas - {quizAnswers['s1-b'] === 'correctiva' ? '✅ CORRECTO' : '❌ INCORRECTO'}
                              </p>
                              <p className="text-sm text-gray-300">
                                La corrección elimina el efecto inmediato, mientras que la acción correctiva evita la recurrencia.
                              </p>
                            </div>

                            {/* Retroalimentación Situación 2 */}
                            <div className={`p-4 rounded-lg border-l-4 ${quizAnswers.stepOrder &&
                              quizAnswers.stepOrder.every((id, idx) => id === ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'][idx])
                              ? 'bg-green-900/20 border-green-500'
                              : 'bg-red-900/20 border-red-500'
                              }`}>
                              <h5 className="font-bold mb-2">Situación 2: Orden del Proceso</h5>
                              <p className="text-sm mb-2">
                                <strong>Secuencia correcta:</strong><br />
                                1. Documentar la queja del cliente y verificar la no conformidad<br />
                                2. Reemplazar inmediatamente el producto defectuoso<br />
                                3. Analizar la causa raíz usando los 5 Porqués<br />
                                4. Implementar un control de calidad adicional en la línea de producción<br />
                                5. Verificar después de 1 mes que no hay reclamos similares
                              </p>
                              {quizAnswers.stepOrder &&
                                quizAnswers.stepOrder.every((id, idx) => id === ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'][idx]) ? (
                                <p className="text-sm text-green-300 mt-2">✅ ¡Orden correcto!</p>
                              ) : (
                                <p className="text-sm text-red-300 mt-2">❌ El orden no es correcto. Revisa la secuencia.</p>
                              )}
                            </div>

                            {/* Retroalimentación Situación 3 */}
                            <div className="bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                              <h5 className="font-bold mb-2">Situación 3: Análisis Completo de ACR</h5>
                              <div className="space-y-3 text-sm">
                                {/* 5 Porqués */}
                                <div>
                                  <p className="font-semibold text-purple-300 mb-2">Análisis de Causas (5 Porqués):</p>
                                  <div className="space-y-2 ml-3">
                                    <div>
                                      <strong className="text-purple-300">1. ¿Por qué no se respondieron los tickets críticos a tiempo?</strong><br />
                                      {quizAnswers['why1'] === 'Porque el sistema de notificaciones no alertó al equipo' ? (
                                        <span className="text-green-300">✓ Correcto:</span>
                                      ) : (
                                        <span className="text-red-300">❌ Incorrecto:</span>
                                      )} {quizAnswers['why1'] || <span className="text-gray-400">Sin respuesta</span>}
                                      <br />
                                      <span className="text-gray-400 text-xs">Respuesta esperada: Porque el sistema de notificaciones no alertó al equipo</span>
                                    </div>
                                    <div>
                                      <strong className="text-purple-300">2. ¿Por qué el sistema de notificaciones no alertó al equipo?</strong><br />
                                      {quizAnswers['why2'] === 'Porque no hay un procedimiento de escalamiento para tickets críticos' ? (
                                        <span className="text-green-300">✓ Correcto:</span>
                                      ) : (
                                        <span className="text-red-300">❌ Incorrecto:</span>
                                      )} {quizAnswers['why2'] || <span className="text-gray-400">Sin respuesta</span>}
                                      <br />
                                      <span className="text-gray-400 text-xs">Respuesta esperada: Porque no hay un procedimiento de escalamiento para tickets críticos</span>
                                    </div>
                                    <div>
                                      <strong className="text-purple-300">3. ¿Por qué no hay un procedimiento de escalamiento para tickets críticos?</strong><br />
                                      {quizAnswers['why3'] === 'Porque no se ha formalizado la planificación de procesos críticos con asignación de responsables' ? (
                                        <span className="text-green-300">✓ Correcto:</span>
                                      ) : (
                                        <span className="text-red-300">❌ Incorrecto:</span>
                                      )} {quizAnswers['why3'] || <span className="text-gray-400">Sin respuesta</span>}
                                      <br />
                                      <span className="text-gray-400 text-xs">Respuesta esperada: Porque no se ha formalizado la planificación de procesos críticos con asignación de responsables</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Acción Correctiva */}
                                <div>
                                  <p className="font-semibold text-green-300 mb-2">Acción Correctiva:</p>
                                  {quizAnswers['correctiveAction'] === 'Diseñar e implementar un procedimiento de escalamiento automático para tickets críticos, con notificaciones programadas y asignación de responsables según niveles de prioridad' ? (
                                    <span className="text-green-300">✓ Correcto: {quizAnswers['correctiveAction']}</span>
                                  ) : (
                                    <>
                                      <span className="text-red-300">❌ Incorrecto: {quizAnswers['correctiveAction'] || 'Sin respuesta'}</span>
                                      <br />
                                      <span className="text-gray-400 text-xs">Respuesta esperada: Diseñar e implementar un procedimiento de escalamiento automático para tickets críticos, con notificaciones programadas y asignación de responsables según niveles de prioridad</span>
                                    </>
                                  )}
                                </div>

                                {/* Implementación */}
                                <div>
                                  <p className="font-semibold text-indigo-300 mb-2">Implementación y Seguimiento:</p>
                                  {quizAnswers['implementation'] === 'Procedimiento de escalamiento implementado el 15 de noviembre. Se configuró el sistema de tickets con alertas automáticas cada 2 horas para tickets críticos. Se capacitó al equipo de soporte y se asignaron responsables por turno. Evidencia: Manual del procedimiento, capturas del sistema configurado, acta de capacitación' ? (
                                    <span className="text-green-300">✓ Correcto: {quizAnswers['implementation']}</span>
                                  ) : (
                                    <>
                                      <span className="text-red-300">❌ Incorrecto: {quizAnswers['implementation'] || 'Sin respuesta'}</span>
                                      <br />
                                      <span className="text-gray-400 text-xs">Respuesta esperada: Procedimiento de escalamiento implementado el 15 de noviembre. Se configuró el sistema de tickets con alertas automáticas cada 2 horas para tickets críticos. Se capacitó al equipo de soporte y se asignaron responsables por turno. Evidencia: Manual del procedimiento, capturas del sistema configurado, acta de capacitación</span>
                                    </>
                                  )}
                                </div>

                                {/* Verificación */}
                                <div>
                                  <p className="font-semibold text-pink-300 mb-2">Verificación de Eficacia:</p>
                                  {quizAnswers['verification'] === 'A los dos meses, se revisaron 50 tickets críticos y todos fueron atendidos dentro del tiempo establecido (4 horas). No se recibieron quejas de clientes por demoras en respuestas. Acción correctiva eficaz' ? (
                                    <span className="text-green-300">✓ Correcto: {quizAnswers['verification']}</span>
                                  ) : (
                                    <>
                                      <span className="text-red-300">❌ Incorrecto: {quizAnswers['verification'] || 'Sin respuesta'}</span>
                                      <br />
                                      <span className="text-gray-400 text-xs">Respuesta esperada: A los dos meses, se revisaron 50 tickets críticos y todos fueron atendidos dentro del tiempo establecido (4 horas). No se recibieron quejas de clientes por demoras en respuestas. Acción correctiva eficaz</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-300 mt-3">
                                💡 <strong>Nota:</strong> El proceso completo de ACR debe seguir todas las etapas: desde el análisis de causas hasta la verificación de eficacia.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            {calculateScore() === 3 ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  completeLevel(9);
                                  navigate('/achievement/9');
                                }}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                              >
                                Reclamar Logro
                              </motion.button>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setQuizSubmitted(false);
                                  setQuizAnswers({});
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                              >
                                Reintentar Evaluación
                              </motion.button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de imagen expandida */}
      {expandedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setExpandedImage(null)}
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg z-[10000]"
            onClick={() => setExpandedImage(null)}
          >
            ×
          </motion.button>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            src={expandedImage}
            alt="Imagen expandida"
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}

      <style>{`
        @keyframes star-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-star-pulse {
          animation: star-pulse infinite ease-in-out;
        }
      `}</style>
    </div>
  );

  return renderGridLayout();
};

export default ACRLevel;