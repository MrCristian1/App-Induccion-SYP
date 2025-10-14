// ...existing code...
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import OptimizedImage from './OptimizedImage';


const dragItems = [
  { id: 1, text: 'Levantar cajas pesadas', category: 'biomecanico' },
  { id: 2, text: 'Ruido de maquinaria', category: 'fisico' },
  { id: 3, text: 'Estrés por sobrecarga', category: 'psicosocial' },
  { id: 4, text: 'Exposición a virus', category: 'biologico' },
  { id: 5, text: 'Escaleras en mal estado', category: 'seguridad' },
  { id: 6, text: 'Trabajar encorvado', category: 'biomecanico' },
];
const dropZones = [
  { id: 'biomecanico', label: '🏋️ Riesgos Biomecánicos', color: 'from-blue-400/60 to-blue-600/60' },
  { id: 'fisico', label: '🌡️ Riesgos Físicos', color: 'from-purple-400/60 to-purple-600/60' },
  { id: 'psicosocial', label: '🧠 Riesgos Psicosociales', color: 'from-pink-400/60 to-pink-600/60' },
  { id: 'biologico', label: '🦠 Riesgos Biológicos', color: 'from-green-400/60 to-green-600/60' },
  { id: 'seguridad', label: '⚠️ Condiciones de Seguridad', color: 'from-yellow-400/60 to-yellow-600/60' },
];
const stepsData = [
  'Reportar inmediatamente al jefe o encargado SG-SST',
  'Ir al centro médico indicado por la ARL',
  'Dar detalles completos del accidente',
];

const initialState = {
  dragAnswers: {},
  slider: 7,
  orderSteps: [],
  fillText: ['', '', ''],
  analysisChoices: [],
  current: 0,
  score: 0,
  completed: false,
  stepClicks: [],
};

const totalQuestions = 5;

// Pasos desordenados para la sección 3
const shuffledSteps = [stepsData[2], stepsData[0], stepsData[1]];

const AccidentQuiz = ({ onClose }) => {
  const [state, setState] = useState(initialState);
  const [showSliderError, setShowSliderError] = useState(false);
  const navigate = useNavigate();
  const [showRetryModal, setShowRetryModal] = useState(false);
  const [showOrderError, setShowOrderError] = useState(false);
  const [showFillError, setShowFillError] = useState(null);
  const correctOrder = stepsData;
  const { completeLevel } = useAppContext();

  // Estado y funciones para modal de imagen
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    src: '',
    alt: ''
  });
  const openImageModal = (src, alt) => {
    setImageModal({ isOpen: true, src, alt });
  };
  const closeImageModal = () => {
    setImageModal({ isOpen: false, src: '', alt: '' });
  };

  // Barra de progreso animada
  const progress = ((state.current + 1) / totalQuestions) * 100;

  // Drag & Drop handlers
  const [dragged, setDragged] = useState(null);
  const handleDragStart = (item) => setDragged(item);
  const handleDrop = (zoneId) => {
    if (dragged && !state.dragAnswers[dragged.id]) {
      setState(s => ({ ...s, dragAnswers: { ...s.dragAnswers, [dragged.id]: zoneId } }));
    }
    setDragged(null);
  };

  // Drag & drop para ordenar pasos en sección 3
  const [draggedStepIdx, setDraggedStepIdx] = useState(null);
  const handleStepDragStart = (idx) => setDraggedStepIdx(idx);
  const handleStepDrop = (idx) => {
    if (draggedStepIdx === null || draggedStepIdx === idx) return;
    const newOrder = [...state.stepClicks];
    const [removed] = newOrder.splice(draggedStepIdx, 1);
    newOrder.splice(idx, 0, removed);
    setState(s => ({ ...s, stepClicks: newOrder }));
    setDraggedStepIdx(null);
  };
  const handleStepDragOver = (e) => e.preventDefault();

  // Validación y puntuación
  const validateQuiz = () => {
    let score = 0;
    // Pregunta 1: Drag & Drop
    score += Object.keys(state.dragAnswers).length === dragItems.length ? 1 : 0;
    // Pregunta 2: Slider
    score += state.slider === 2 ? 1 : 0;
    // Pregunta 3: Secuencia
    const correctOrder = stepsData.join('|');
    score += state.stepClicks.join('|') === correctOrder ? 1 : 0;
    // Pregunta 4: Completar texto (solo acepta el orden exacto y palabras exactas)
    const correctFill = ['lesión', 'trabajador', 'trabajo'];
    const isFillCorrect =
      state.fillText.length === 3 &&
      state.fillText[0].trim().toLowerCase() === 'lesión' &&
      state.fillText[1].trim().toLowerCase() === 'trabajador' &&
      state.fillText[2].trim().toLowerCase() === 'trabajo';
    score += isFillCorrect ? 1 : 0;
    // Pregunta 5: Análisis textual
    const keywords = ['biomecánico', 'físico', 'psicosocial', 'biológico', 'seguridad', 'ruido', 'postura', 'cables', 'presión'];
    const found = keywords.filter(k => state.analysisText.toLowerCase().includes(k)).length;
    score += found >= 3 ? 1 : 0;
    setState(s => ({ ...s, score, completed: true }));
  };

  // Navegación
  const resetDragSection = () => {
    setState(s => ({
      ...s,
      dragAnswers: {},
    }));
    setShowRetryModal(false);
  };
  const changeQuestion = (dir) => {
    // Validación para sección de arrastrar
    if (state.current === 0 && dir === 1) {
      const allAnswered = Object.keys(state.dragAnswers).length === dragItems.length;
      const anyWrong = dragItems.some(item => state.dragAnswers[item.id] && state.dragAnswers[item.id] !== item.category);
      if (allAnswered && anyWrong) {
        setShowRetryModal(true);
        return;
      }
    }
    // Validación para slider
    if (state.current === 1 && dir === 1) {
      if (state.slider !== 2) {
        setShowSliderError(true);
        return;
      } else {
        setShowSliderError(false);
      }
    }
    setState(s => ({ ...s, current: Math.max(0, Math.min(totalQuestions - 1, s.current + dir)) }));
  };

  // Reinicio
  const restartQuiz = () => setState(initialState);

  // Glassmorphism styled slider
  const GlassSlider = styled(Slider)(({ theme }) => ({
    color: '#7c3aed',
    height: 8,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
      height: 28,
      width: 28,
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(8px)',
      border: '2px solid #7c3aed',
      boxShadow: '0 4px 16px rgba(124,58,237,0.2)',
    },
    '& .MuiSlider-track': {
      background: 'linear-gradient(90deg, #60a5fa88, #a78bfa88)',
      border: 'none',
      height: 8,
      borderRadius: 8,
    },
    '& .MuiSlider-rail': {
      background: 'rgba(255,255,255,0.2)',
      height: 8,
      borderRadius: 8,
    },
    '& .MuiSlider-valueLabel': {
      background: 'rgba(255,255,255,0.7)',
      color: '#7c3aed',
      borderRadius: 8,
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(124,58,237,0.1)',
    },
  }));

  // Renderizar preguntas
  const renderStep = () => {
    switch (state.current) {
      case 0:
        // Drag & Drop
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} {...{ className: "fade-in" }}>
            <h3 className="font-bold text-2xl mb-3 text-blue-200 drop-shadow bg-blue-500/20 backdrop-blur-md rounded-2xl py-3 px-6 border border-blue-300/30 inline-block text-center">
              Arrastra cada riesgo a su categoría correspondiente
            </h3>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
              {/* Draggables */}
              <div className="flex flex-col gap-4 w-80 md:w-80">
                {dragItems.map(item => {
                  // Feedback visual para draggables
                  const droppedZone = state.dragAnswers[item.id];
                  let feedbackColor = '';
                  if (droppedZone) {
                    if (droppedZone === item.category) {
                      feedbackColor = 'bg-green-500 border-green-400 text-white';
                    } else {
                      feedbackColor = 'bg-red-500 border-red-400 text-white';
                    }
                  }
                  return (
                    <div
                      key={item.id}
                      draggable={!state.dragAnswers[item.id]}
                      onDragStart={() => handleDragStart(item)}
                      className={`p-3 rounded-xl shadow-lg ${droppedZone ? '' : 'bg-white/30 backdrop-blur-md border-blue-200'} border font-semibold cursor-move transition-all duration-300 ${feedbackColor} ${state.dragAnswers[item.id] ? 'opacity-70' : 'hover:scale-105 hover:border-blue-400'}`}
                      style={{ opacity: state.dragAnswers[item.id] ? 0.7 : 1 }}
                    >
                      {item.text}
                    </div>
                  );
                })}
              </div>
              {/* Drop zones */}
              <div className="flex flex-col gap-4 w-80 md:w-80">
                {dropZones.map(zone => (
                  <div
                    key={zone.id}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(zone.id)}
                    className={`p-4 rounded-xl shadow-xl font-bold text-white text-lg flex items-center gap-2 transition-all duration-300 border-2 bg-gradient-to-r ${zone.color} ${dragged ? 'scale-105' : ''} backdrop-blur-md`}
                    style={{ minHeight: '56px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
                  >
                    {zone.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <button className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-blue-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 hover:bg-white/40" disabled>← Anterior</button>
              <button
                className={`bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-purple-200 hover:scale-105 ${Object.keys(state.dragAnswers).length !== dragItems.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => changeQuestion(1)}
                disabled={Object.keys(state.dragAnswers).length !== dragItems.length}
              >
                Siguiente
              </button>
            </div>
            <div className="mt-4 text-sm text-green-400 font-bold">{Object.keys(state.dragAnswers).length === dragItems.length && '¡Todos los riesgos ubicados correctamente!'}</div>
          </motion.div>
        );
      case 1:
        // Slider
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} {...{ className: "fade-in" }}>
            <div className="mb-6 bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg border border-purple-200 flex items-center justify-center">
              <h3 className="font-bold text-xl text-purple-900 drop-shadow text-center">Tiempo de Reporte de Accidentes</h3>
            </div>
            <p className="mb-4 text-blue-100 text-center">¿Cuál es el tiempo <span className="font-bold text-orange-400">MÁXIMO</span> para reportar un accidente de trabajo?</p>
            <div className="flex flex-col items-center gap-4">
              <div className="w-[450px] max-w-full mt-8">
                <GlassSlider
                  min={1}
                  max={10}
                  value={state.slider}
                  onChange={(_, val) => setState(s => ({ ...s, slider: Number(val) }))}
                  valueLabelDisplay="auto"
                  marks={[{ value: 1, label: '1 día' }, { value: 5, label: '5 días' }, { value: 10, label: '10 días' }]}
                  sx={{
                    '& .MuiSlider-markLabel': {
                      color: '#fff',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </div>
              <span className="text-2xl font-bold text-purple-400 mt-2 drop-shadow">{state.slider} días hábiles</span>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <button className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-purple-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1 hover:bg-white/40" onClick={() => changeQuestion(-1)}>← Anterior</button>
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-purple-200 hover:scale-105" onClick={() => {
                if (state.slider === 2) {
                  setShowSliderError(false);
                  changeQuestion(1);
                } else {
                  setShowSliderError(true);
                }
              }}>Siguiente</button>
            </div>
            {showSliderError && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white/30 backdrop-blur-lg border border-purple-200 rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
                  <h4 className="text-2xl font-bold text-white mb-4 drop-shadow">¡Respuesta incorrecta!</h4>
                  <p className="text-white mb-6 text-center font-semibold">El tiempo máximo para reportar un accidente de trabajo es <span className='text-purple-300 font-bold'>2 días hábiles</span>.</p>
                  <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-2 rounded-xl font-bold shadow-lg border border-purple-200 hover:scale-105 transition" onClick={() => setShowSliderError(false)}>Entendido</button>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 2:
        // Escenario interactivo
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} {...{ className: "fade-in" }}>
            <div className="mb-6 bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg border border-orange-200 flex items-center justify-center">
              <h3 className="font-bold text-xl text-orange-900 drop-shadow text-center">Escenario de Emergencia</h3>
            </div>
            <div className="mb-2">
              <span className="block text-white text-center text-lg font-semibold">Acabas de sufrir una caída en tu lugar de trabajo y sientes dolor en la espalda...</span>
            </div>
            <div className="flex justify-center mb-6">
              <OptimizedImage
                src="/img/caida.jpg"
                alt="Caída en el trabajo"
                type="illustration"
                className="w-64 h-auto rounded-xl shadow-lg border border-orange-200 bg-white/20"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="mb-4 text-center text-white font-semibold">Arrastra y ordena los pasos según el procedimiento correcto:</p>
              <div className="flex flex-row gap-6 justify-center items-center mb-6">
                {state.stepClicks.length === 0
                  ? shuffledSteps.map((step, idx) => (
                    <div
                      key={step}
                      draggable
                      onDragStart={() => {
                        setState(s => ({ ...s, stepClicks: shuffledSteps }));
                      }}
                      className="bg-white/30 backdrop-blur-md border border-orange-200 rounded-xl shadow-lg px-6 py-4 min-w-[180px] text-center font-semibold text-white cursor-move text-base hover:scale-105 transition-all duration-300"
                    >
                      {step}
                    </div>
                  ))
                  : state.stepClicks.map((step, idx) => (
                    <div
                      key={step}
                      draggable
                      onDragStart={() => handleStepDragStart(idx)}
                      onDrop={() => handleStepDrop(idx)}
                      onDragOver={handleStepDragOver}
                      className={`relative bg-white/30 backdrop-blur-md border border-orange-200 rounded-xl shadow-lg px-6 py-4 min-w-[180px] text-center font-semibold text-white cursor-move text-base hover:scale-105 transition-all duration-300 ${draggedStepIdx === idx ? 'ring-4 ring-orange-400' : ''}`}
                      style={{ zIndex: draggedStepIdx === idx ? 10 : 1 }}
                    >
                      <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-orange-400/80 text-white flex items-center justify-center font-bold shadow text-lg border-2 border-white">{idx + 1}</span>
                      {step}
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <button className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-orange-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-1 hover:bg-white/40" onClick={() => changeQuestion(-1)}>← Anterior</button>
              <button
                className={`bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-orange-200 ${(state.stepClicks.length !== stepsData.length || state.stepClicks.includes(undefined)) ? 'opacity-50' : 'hover:scale-105'}`}
                onClick={() => {
                  if (state.stepClicks.length === stepsData.length && state.stepClicks.every((step, idx) => step === correctOrder[idx])) {
                    changeQuestion(1);
                  } else {
                    setShowOrderError(true);
                  }
                }}
                disabled={state.stepClicks.length !== stepsData.length || state.stepClicks.includes(undefined)}
              >
                Siguiente
              </button>
            </div>
            {/* Modal de error de orden */}
            {showOrderError && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white/30 backdrop-blur-lg border border-orange-200 rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
                  <h4 className="text-2xl font-bold text-white mb-4 drop-shadow">¡Orden incorrecto!</h4>
                  <p className="text-white mb-6 text-center font-semibold">El orden de los pasos no es correcto.<br />Intenta de nuevo.</p>
                  <button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg border border-orange-200" onClick={() => setShowOrderError(false)}>Reintentar</button>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 3:
        // Completar texto
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} {...{ className: "fade-in" }}>
            <div className="mb-6 bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg border border-blue-200 flex items-center justify-center">
              <h3 className="font-bold text-xl text-blue-900 drop-shadow text-center">Completa la Definición</h3>
            </div>
            <div className="flex gap-2 items-center mb-4 bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg border border-blue-200">
              <input type="text" value={state.fillText[0]} onChange={e => setState(s => ({ ...s, fillText: [e.target.value, state.fillText[1], state.fillText[2]] }))} className="border border-blue-200 bg-white/40 backdrop-blur-md rounded-xl px-4 py-2 w-32 text-blue-900 font-bold shadow" placeholder="Escribe aquí..." />
              <span className="text-blue-100">generada sobre el</span>
              <input type="text" value={state.fillText[1]} onChange={e => setState(s => ({ ...s, fillText: [state.fillText[0], e.target.value, state.fillText[2]] }))} className="border border-blue-200 bg-white/40 backdrop-blur-md rounded-xl px-4 py-2 w-32 text-blue-900 font-bold shadow" placeholder="Escribe aquí..." />
              <span className="text-blue-100">por causa u ocasión del</span>
              <input type="text" value={state.fillText[2]} onChange={e => setState(s => ({ ...s, fillText: [state.fillText[0], state.fillText[1], e.target.value] }))} className="border border-blue-200 bg-white/40 backdrop-blur-md rounded-xl px-4 py-2 w-32 text-blue-900 font-bold shadow" placeholder="Escribe aquí..." />
            </div>
            <div className="bg-blue-100/30 backdrop-blur-md rounded-xl p-3 flex items-center gap-2 text-blue-700 mb-4 border border-blue-200 shadow"><span>💡</span>Recuerda: lesión, trabajador, trabajo</div>
            <div className="flex justify-center gap-6 mt-8">
              <button className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-blue-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 hover:bg-white/40" onClick={() => changeQuestion(-1)}>← Anterior</button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-blue-200 hover:scale-105" onClick={() => changeQuestion(1)}>Siguiente</button>
            </div>
          </motion.div>
        );
      case 4:
        // Análisis textual
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} {...{ className: "fade-in" }}>
            <h3 className="font-bold text-xl mb-4 text-blue-200 drop-shadow text-center">Identifica los Riesgos</h3>
            <div className="bg-blue-100/30 backdrop-blur-md rounded-xl p-4 mb-4 flex flex-col items-center gap-2 text-white border border-blue-200 shadow mx-auto max-w-md">
              <OptimizedImage
                src="/img/situacion-nivel6.png"
                alt="Situación nivel 6"
                type="illustration"
                className="w-32 h-auto mb-4 rounded-xl shadow"
              />
              <span>🏢</span>Oficina con empleados en computadoras 8 horas, sillas sin apoyo lumbar, pantallas brillantes, ruido de aires acondicionados, cables sueltos, presión por metas
            </div>
            <textarea value={state.analysisText} onChange={e => setState(s => ({ ...s, analysisText: e.target.value }))} className="w-full h-32 border border-blue-200 bg-white/40 backdrop-blur-md rounded-xl p-4 mb-4 text-blue-900 font-bold shadow" placeholder="Escribe tu análisis aquí..." />
            <div className="flex justify-center gap-6 mt-8">
              <button className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-blue-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 hover:bg-white/40" onClick={() => changeQuestion(-1)}>← Anterior</button>
              <button className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-green-200 hover:scale-105" onClick={() => {
                const wordCount = state.analysisText.trim().split(/\s+/).filter(Boolean).length;
                if (wordCount < 5) {
                  setShowFillError(true);
                } else if (wordCount >= 6) {
                  navigate('/achievement/4');
                } else {
                  validateQuiz();
                }
              }}>Finalizar</button>
            </div>
            {/* Modal de error de análisis corto */}
            {showFillError && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white/30 backdrop-blur-lg border border-blue-200 rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
                  <h4 className="text-2xl font-bold text-white mb-4 drop-shadow">¡Tú análisis es muy corto!</h4>
                  <p className="text-white mb-6 text-center font-semibold">Por favor escribe al menos 5 palabras en tu análisis.</p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-2 rounded-xl font-bold shadow-lg border border-blue-200 hover:scale-105 transition" onClick={() => setShowFillError(false)}>Reintentar</button>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-2 rounded-xl font-bold shadow-lg border border-blue-200" onClick={() => setShowFillError(false)}>Reintentar</button>
                </div>
              </div>
            )}
          </motion.div>
        );
      default:
        // Resultados
        return (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} {...{ className: "fade-in" }}>
            <h3 className="font-bold text-2xl mb-4 text-green-300 drop-shadow">¡Quiz completado!</h3>
            <p className="mb-6 text-blue-100">Tu puntaje: <span className="font-bold text-green-400">{state.score}/5</span> ({Math.round((state.score / totalQuestions) * 100)}%)</p>
            <button className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-green-200 hover:scale-105" onClick={restartQuiz}>Reiniciar Quiz</button>
            <button className="ml-4 bg-white/30 backdrop-blur-md text-blue-900 px-6 py-2 rounded-xl font-bold border border-blue-200 shadow" onClick={onClose}>Cerrar</button>
          </motion.div>
        );
    }
  };

  return (
    <>
      {/* Header y barra de progreso */}
      <div className="mb-8 mt-5">
        <h2 className="text-5xl font-bold text-white mb-8 text-center drop-shadow">Quiz Interactivo de Seguridad Laboral</h2>
        <p className="text-lg text-blue-100 text-center mb-4">Pon a prueba tus conocimientos con diferentes tipos de preguntas</p>
        <div className="mx-auto w-2/3 max-w-xl h-3 bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-blue-400/40 rounded-full mb-2 overflow-hidden">
          <div className="progress-container relative w-full h-5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)', height: '20px' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: '9999px',
                background: 'linear-gradient(270deg, #7f9cf5, #a78bfa, #f472b6, #34d399, #7f9cf5)',
                backgroundSize: '400% 400%',
                animation: 'gradientIdle 4s ease infinite, pulseGlow 3s ease-in-out infinite',
                position: 'relative',
                boxShadow: '0 0 10px rgba(167, 139, 250, 0.6)',
                transition: 'width 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
              }}
              className="progress-bar"
            >
              <div className="progress-shine" style={{ position: 'absolute', top: 0, bottom: 0, width: '20%', left: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', animation: 'shimmer 2.5s infinite' }}></div>
              <div className="progress-percentage" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-70%)', color: 'white', fontWeight: 'bold', fontSize: '12px', textShadow: '0 0 3px rgba(0,0,0,0.8)', zIndex: 20 }}>{Math.round(progress)}%</div>
            </motion.div>
            {/* Marcadores de progreso */}
            <div className="progress-mark" style={{ left: '25%' }}></div>
            <div className="progress-mark" style={{ left: '50%' }}></div>
            <div className="progress-mark" style={{ left: '75%' }}></div>
            {/* Partículas */}
            <div className="particle" style={{ width: '3px', height: '3px', left: '15%', top: '4px', animationDelay: '0.5s' }}></div>
            <div className="particle" style={{ width: '4px', height: '4px', left: '40%', top: '10px', animationDelay: '1.2s' }}></div>
            <div className="particle" style={{ width: '2px', height: '2px', left: '60%', top: '2px', animationDelay: '0.8s' }}></div>
            <div className="particle" style={{ width: '3px', height: '3px', left: '80%', top: '8px', animationDelay: '1.5s' }}></div>
            <style>{`
              @keyframes gradientIdle {
                0% {background-position:0% 50%}
                50% {background-position:100% 50%}
                100% {background-position:0% 50%}
              }
              @keyframes shimmer {
                0% {left: -100%}
                100% {left: 100%}
              }
              @keyframes float {
                0%, 100% {transform: translateY(0);}
                50% {transform: translateY(-2px);}
              }
              @keyframes pulseGlow {
                0%, 100% {box-shadow: 0 0 10px rgba(167, 139, 250, 0.6);}
                50% {box-shadow: 0 0 20px rgba(167, 139, 250, 0.8), 0 0 30px rgba(167, 139, 250, 0.4);}
              }
              .progress-bar {animation: gradientIdle 4s ease infinite, pulseGlow 3s ease-in-out infinite;}
              .progress-shine {animation: shimmer 2.5s infinite;}
              .particle {animation: float 3s infinite ease-in-out;}
              .progress-mark {
                position: absolute;
                width: 6px;
                height: 6px;
                background: white;
                border-radius: 50%;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10;
                box-shadow: 0 0 5px rgba(255,255,255,0.8);
                animation: pulseGlow 2s infinite;
              }
            `}</style>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <span className="text-sm text-blue-200 font-bold mt-2">{state.current + 1} / {totalQuestions}</span>
        </div>
      </div>
      {/* Pregunta actual */}
      <div className="space-y-6">
        {/* Modal de reintento */}
        {showRetryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-red-300/50 rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 relative overflow-hidden"
            >
              {/* Efecto de brillo animado */}

              {/* Icono de error animado */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-4xl">❌</span>
              </motion.div>

              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-4 drop-shadow-lg text-center"
              >
                ¡Ups! Hay errores
              </motion.h4>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white mb-6 text-center font-semibold leading-relaxed"
              >
                Algunos riesgos no están en la categoría correcta.<br />
                <span className="text-yellow-300">¿Quieres intentarlo de nuevo?</span>
              </motion.p>

              <button
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg border border-red-300/50 transition-all duration-300 hover:scale-105"
                onClick={resetDragSection}
              >
                🔄 Reintentar
              </button>
            </motion.div>
          </motion.div>
        )}
        {/* Drag & Drop */
          state.current === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} {...{ className: "fade-in" }}>
              <div className="flex justify-center w-full">
                <h3 className="font-bold text-2xl mb-3 text-blue-200 drop-shadow bg-blue-500/20 backdrop-blur-md rounded-2xl py-3 px-6 border border-blue-300/30 inline-block text-center mx-auto">
                  Arrastra cada riesgo a su categoría correspondiente
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
                {/* Draggables */}
                <div className="flex flex-col gap-4 w-80 md:w-80">
                  {dragItems.map(item => {
                    // Feedback visual para draggables
                    const droppedZone = state.dragAnswers[item.id];
                    let feedbackColor = '';
                    if (droppedZone) {
                      if (droppedZone === item.category) {
                        feedbackColor = 'bg-green-500 border-green-400 text-white';
                      } else {
                        feedbackColor = 'bg-red-500 border-red-400 text-white';
                      }
                    }
                    return (
                      <div
                        key={item.id}
                        draggable={!state.dragAnswers[item.id]}
                        onDragStart={() => handleDragStart(item)}
                        className={`p-3 rounded-xl shadow-lg ${droppedZone ? '' : 'bg-white/30 backdrop-blur-md border-blue-200'} border font-semibold cursor-move transition-all duration-300 ${feedbackColor} ${state.dragAnswers[item.id] ? 'opacity-70' : 'hover:scale-105 hover:border-blue-400'}`}
                        style={{ opacity: state.dragAnswers[item.id] ? 0.7 : 1 }}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                </div>
                {/* Drop zones */}
                <div className="flex flex-col gap-4 w-80 md:w-80">
                  {dropZones.map(zone => (
                    <div
                      key={zone.id}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => handleDrop(zone.id)}
                      className={`p-4 rounded-xl shadow-xl font-bold text-white text-lg flex items-center gap-2 transition-all duration-300 border-2 bg-gradient-to-r ${zone.color} ${dragged ? 'scale-105' : ''} backdrop-blur-md`}
                      style={{ minHeight: '56px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
                    >
                      {zone.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-8">
                <button className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-blue-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 hover:bg-white/40" disabled>← Anterior</button>
                <button className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-blue-200 ${Object.keys(state.dragAnswers).length !== dragItems.length ? 'opacity-50' : 'hover:scale-105'}`} onClick={() => changeQuestion(1)} disabled={Object.keys(state.dragAnswers).length !== dragItems.length}>Siguiente</button>
              </div>
              <div className="mt-4 text-sm text-green-400 font-bold">{Object.keys(state.dragAnswers).length === dragItems.length && '¡Todos los riesgos ubicados correctamente!'}</div>
            </motion.div>
          )}
        {/* Slider */}
        {state.current === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} {...{ className: "fade-in" }}>
            <div className="flex justify-center w-full">
              <h3 className="font-bold text-2xl mb-3 text-blue-200 drop-shadow bg-blue-500/20 backdrop-blur-md rounded-2xl py-3 px-6 border border-blue-300/30 inline-block text-center mx-auto">
                Tiempo de Reporte de Accidentes
              </h3>
            </div>
            <p className="mb-4 text-blue-100 text-center">¿Cuál es el tiempo <span className="font-bold text-orange-400">MÁXIMO</span> para reportar un accidente de trabajo?</p>
            <div className="flex flex-col items-center gap-4">
              <div className="w-[450px] max-w-full mt-8">
                <GlassSlider
                  min={1}
                  max={10}
                  value={state.slider}
                  onChange={(_, val) => setState(s => ({ ...s, slider: Number(val) }))}
                  valueLabelDisplay="auto"
                  marks={[{ value: 1, label: '1 día' }, { value: 5, label: '5 días' }, { value: 10, label: '10 días' }]}
                  sx={{
                    '& .MuiSlider-markLabel': {
                      color: '#fff',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </div>
              <span className="text-2xl font-bold text-purple-400 mt-20 drop-shadow">{state.slider} días hábiles</span>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <button className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-purple-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1 hover:bg-white/40" onClick={() => changeQuestion(-1)}>← Anterior</button>
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-purple-200 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1" onClick={() => changeQuestion(1)}>Siguiente</button>
            </div>
            {/* Modal de error para slider */}
            {showSliderError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.7, opacity: 0, rotateY: -90 }}
                  transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                  style={{ borderRadius: '1.5rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', padding: '2rem', maxWidth: '24rem', width: '100%', margin: '1rem auto', position: 'relative', overflow: 'hidden', border: '2px solid rgba(168,85,247,0.5)', background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.2))', backdropFilter: 'blur(8px)' }}
                >
                  {/* Partículas flotantes */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="absolute top-8 right-6 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping"></div>

                  {/* Icono de reloj animado */}
                  <motion.div
                    initial={{ scale: 0, rotate: -360 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                    style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', background: 'rgba(168,85,247,0.2)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span className="text-4xl">⏰</span>
                  </motion.div>

                  <motion.h4
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    style={{ marginBottom: '1rem' }}
                  >
                    <span className="text-2xl font-bold text-white mb-4 drop-shadow-lg text-center block">¡Respuesta incorrecta!</span>
                  </motion.h4>

                  <motion.p
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <span className="text-white mb-6 text-center font-semibold leading-relaxed block">El tiempo máximo para reportar un accidente de trabajo es <span className='text-purple-300 font-bold text-lg'>2 días hábiles</span>.</span>
                  </motion.p>

                  <button
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg border border-purple-300/50 transition-all duration-300"
                    onClick={() => setShowSliderError(false)}
                  >
                    ✅ Entendido
                  </button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
        {/* Escenario interactivo */}
        {state.current === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fade-in">
            <div className="flex justify-center w-full">
              <h3 className="font-bold text-2xl mb-3 text-orange-200 drop-shadow bg-orange-500/20 backdrop-blur-md rounded-2xl py-3 px-6 border border-orange-300/30 inline-block text-center mx-auto">
                Escenario de Emergencia
              </h3>
            </div>
            <div className="mb-2">
              <span className="block text-white text-center text-lg font-semibold">Acabas de sufrir una caída en tu lugar de trabajo y sientes dolor en la espalda...</span>
            </div>
            <div className="flex justify-center mb-6">
              <OptimizedImage
                src="/img/caida.jpg"
                alt="Caída en el trabajo"
                type="illustration"
                className="w-64 h-auto rounded-xl shadow-lg border border-orange-200 bg-white/20"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="mb-4 text-center text-white font-semibold">Arrastra y ordena los pasos según el procedimiento correcto:</p>
              <div className="flex flex-row gap-6 justify-center items-center mb-6">
                {state.stepClicks.length === 0
                  ? shuffledSteps.map((step, idx) => (
                    <div
                      key={step}
                      draggable
                      onDragStart={() => {
                        setState(s => ({ ...s, stepClicks: shuffledSteps }));
                      }}
                      className="bg-white/30 backdrop-blur-md border border-orange-200 rounded-xl shadow-lg px-6 py-4 min-w-[180px] text-center font-semibold text-white cursor-move text-base hover:scale-105 transition-all duration-300"
                    >
                      {step}
                    </div>
                  ))
                  : state.stepClicks.map((step, idx) => (
                    <div
                      key={step}
                      draggable
                      onDragStart={() => handleStepDragStart(idx)}
                      onDrop={() => handleStepDrop(idx)}
                      onDragOver={handleStepDragOver}
                      className={`relative bg-white/30 backdrop-blur-md border border-orange-200 rounded-xl shadow-lg px-6 py-4 min-w-[180px] text-center font-semibold text-white cursor-move text-base hover:scale-105 transition-all duration-300 ${draggedStepIdx === idx ? 'ring-4 ring-orange-400' : ''}`}
                      style={{ zIndex: draggedStepIdx === idx ? 10 : 1 }}
                    >
                      <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-orange-400/80 text-white flex items-center justify-center font-bold shadow text-lg border-2 border-white">{idx + 1}</span>
                      {step}
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <button className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-orange-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-1 hover:bg-white/40" onClick={() => changeQuestion(-1)}>← Anterior</button>
              <button
                className={`bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-orange-200 ${(state.stepClicks.length !== stepsData.length || state.stepClicks.includes(undefined)) ? 'opacity-50' : 'hover:scale-105'}`}
                onClick={() => {
                  if (state.stepClicks.length === stepsData.length && state.stepClicks.every((step, idx) => step === correctOrder[idx])) {
                    changeQuestion(1);
                  } else {
                    setShowOrderError(true);
                  }
                }}
                disabled={state.stepClicks.length !== stepsData.length || state.stepClicks.includes(undefined)}
              >
                Siguiente
              </button>
            </div>
            {/* Modal de error de orden */}
            {showOrderError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              >
                <motion.div
                  initial={{ scale: 0.3, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.3, opacity: 0, rotate: 180 }}
                  transition={{ type: "spring", duration: 0.7, bounce: 0.4 }}
                  style={{ borderRadius: '1.5rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', padding: '2rem', maxWidth: '24rem', width: '100%', margin: '1rem auto', position: 'relative', overflow: 'hidden', border: '2px solid rgba(251,146,60,0.5)', background: 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(239,68,68,0.2))', backdropFilter: 'blur(8px)' }}
                >
                  {/* Efectos de fondo */}
                  <div className="absolute top-2 right-2 w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-75"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-red-400 rounded-full animate-pulse delay-150"></div>
                  <div className="absolute top-1/2 right-4 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-300"></div>

                  {/* Icono de orden incorrecto */}
                  <motion.div
                    initial={{ scale: 0, rotateY: -180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                    style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', background: 'rgba(251,146,60,0.2)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                  >
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="text-4xl"
                    >
                      🔄
                    </motion.span>
                  </motion.div>

                  <motion.h4
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    style={{ marginBottom: '1rem' }}
                  >
                    <span className="text-2xl font-bold text-white mb-4 drop-shadow-lg text-center block">¡Orden incorrecto!</span>
                  </motion.h4>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <span className="text-white mb-6 text-center font-semibold leading-relaxed block">El orden de los pasos no es correcto.<br /><span className="text-orange-300 font-bold">¡Intenta de nuevo!</span></span>
                  </motion.p>

                  <button
                    className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg border border-orange-300/50 transition-all duration-300"
                    onClick={() => {
                      setShowOrderError(false);
                      setState(s => ({ ...s, stepClicks: [] }));
                    }}
                  >
                    🔄 Reintentar
                  </button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
        {/* Completar texto */}
        {state.current === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fade-in">
            <div className="flex flex-col items-center justify-center w-full">
              <h3 className="font-bold text-2xl mb-3 text-blue-200 drop-shadow bg-blue-500/20 backdrop-blur-md rounded-2xl py-3 px-6 border border-blue-300/30 inline-block text-center">
                Completa la Definición
              </h3>
              <div className="flex flex-col items-center w-full">
                <div>
                  <div className="flex flex-wrap justify-center gap-2 items-center w-full max-w-md mx-auto mt-8">
                    <span className="text-blue-100">Un accidente de trabajo es una</span>
                    <input type="text" value={state.fillText[0]} onChange={e => setState(s => ({ ...s, fillText: [e.target.value, state.fillText[1], state.fillText[2]] }))} className="border border-blue-200 bg-white/40 backdrop-blur-md rounded-xl px-4 py-2 w-32 text-white font-bold shadow text-center" placeholder="Escribe aquí..." />
                    <span className="text-blue-100">generada sobre el</span>
                    <input type="text" value={state.fillText[1]} onChange={e => setState(s => ({ ...s, fillText: [state.fillText[0], e.target.value, state.fillText[2]] }))} className="border border-blue-200 bg-white/40 backdrop-blur-md rounded-xl px-4 py-2 w-32 text-white font-bold shadow text-center" placeholder="Escribe aquí..." />
                    <span className="text-blue-100">por causa u ocasión del</span>
                    <input type="text" value={state.fillText[2]} onChange={e => setState(s => ({ ...s, fillText: [state.fillText[0], state.fillText[1], e.target.value] }))} className="border border-blue-200 bg-white/40 backdrop-blur-md rounded-xl px-4 py-2 w-32 text-white font-bold shadow text-center" placeholder="Escribe aquí..." />
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 mt-12 w-full justify-center">
                    {/* ...existing code... */}
                    <span>💡</span>
                    <span className="text-white font-semibold">Recuerda: lesión, trabajador, trabajo</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-8">
                <button className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-blue-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 hover:bg-white/40" onClick={() => changeQuestion(-1)}>← Anterior</button>
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-blue-200 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1"
                  onClick={() => {
                    const correctFill = ['lesión', 'trabajador', 'trabajo'];
                    const isFillCorrect =
                      state.fillText.length === 3 &&
                      state.fillText[0].trim().toLowerCase() === 'lesión' &&
                      state.fillText[1].trim().toLowerCase() === 'trabajador' &&
                      state.fillText[2].trim().toLowerCase() === 'trabajo';
                    if (isFillCorrect) {
                      changeQuestion(1);
                    } else {
                      setShowFillError(true);
                    }
                  }}
                >
                  Siguiente
                </button>
                {/* Modal de error de definición */}
                {showFillError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
                      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                      exit={{ scale: 0.5, opacity: 0, rotateX: -90 }}
                      transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                      className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border-2 border-blue-300/50 rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 relative overflow-hidden"
                    >
                      {/* Efectos de cristal */}
                      <div className="absolute top-3 left-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="absolute top-1/3 right-5 w-1 h-1 bg-indigo-400 rounded-full animate-ping"></div>

                      {/* Icono de texto incorrecto */}
                      <motion.div
                        initial={{ scale: 0, rotateZ: -90 }}
                        animate={{ scale: 1, rotateZ: 0 }}
                        transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                        className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center"
                      >
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          className="text-4xl"
                        >
                          📝
                        </motion.span>
                      </motion.div>

                      <motion.h4
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="text-2xl font-bold text-white mb-4 drop-shadow-lg text-center"
                      >
                        ¡Respuesta incorrecta!
                      </motion.h4>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="text-white mb-6 text-center font-semibold leading-relaxed"
                      >
                        La definición no es correcta.<br />
                        <span className="text-blue-300 font-bold">Verifica el orden y las palabras.</span>
                      </motion.p>

                      <button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg border border-blue-300/50 transition-all duration-300"
                        onClick={() => {
                          setShowFillError(false);
                          setState(s => ({ ...s, fillText: ['', '', ''] }));
                        }}
                      >
                        📖 Reintentar
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {/* Análisis textual */}
        {/* Análisis textual - Versión Mejorada */}
        {state.current === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fade-in w-full max-w-6xl mx-auto"
          >
            {/* Header de la pregunta */}
            <div className="text-center mb-8">
              <h3 className="font-bold text-2xl mb-3 text-blue-200 drop-shadow bg-blue-500/20 backdrop-blur-md rounded-2xl py-3 px-6 border border-blue-300/30 inline-block">
                Identifica los Riesgos en la Escena
              </h3>
              <p className="text-lg text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
                Observa detenidamente la imagen y selecciona <span className="text-yellow-300 font-bold">todos los riesgos laborales</span> que puedas identificar
              </p>
            </div>

            {/* Contenedor principal de imagen y opciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

              {/* Sección de la imagen */}
              <div className="flex flex-col items-center">
                <div 
                  className="relative group cursor-zoom-in"
                  onClick={() => openImageModal("/img/situacion-nivel6.png", "Situación de oficina con riesgos laborales - Identifica los riesgos")}
                >
                  <OptimizedImage
                    src="/img/situacion-nivel6.png"
                    alt="Situación de oficina con riesgos laborales"
                    type="illustration"
                    className="w-full max-w-md h-auto rounded-2xl shadow-2xl object-contain border-2 border-blue-300/50 bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400/70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl pointer-events-none"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    🔍 Haz clic para hacer zoom
                  </div>
                </div>
                <p className="text-white/80 text-sm mt-3 text-center italic max-w-md">
                  Oficina con empleados trabajando en computadoras 8 horas diarias
                </p>
              </div>
      {/* Modal para imagen ampliada */}
      {imageModal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={closeImageModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-4xl max-h-[90vh] mx-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              className="absolute -top-12 right-0 z-10 text-white text-3xl hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={closeImageModal}
            >
              ×
            </button>
            {/* Contenedor de la imagen con zoom */}
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <OptimizedImage
                src={imageModal.src}
                alt={imageModal.alt}
                type="illustration"
                className="w-full h-auto max-h-[80vh] object-contain cursor-zoom-out"
                onClick={closeImageModal}
              />
            </div>
            {/* Leyenda de la imagen */}
            <div className="mt-2 text-center text-white bg-black/50 rounded-lg p-2">
              {imageModal.alt}
            </div>
            {/* Indicador de zoom (tooltip) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Haz clic para hacer zoom • Esc para salir
            </div>
          </motion.div>
        </motion.div>
      )}

              {/* Sección de selección de riesgos */}
              <div className="space-y-6">
                {/* Instrucción mejorada */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🔍</span>
                    <h4 className="font-bold text-white text-lg">¿Qué riesgos puedes identificar?</h4>
                  </div>
                  <p className="text-white/90 text-sm">
                    Selecciona <span className="text-green-300 font-semibold">los riesgos</span> que observes en la imagen. Puedes seleccionar múltiples opciones.
                  </p>
                </div>

                {/* Grid de opciones de riesgos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { id: 6, text: 'Riesgos de soldadura', correct: false, icon: '🔥' },
                    { id: 1, text: 'Riesgos de salud visual', correct: true, icon: '👁️' },
                    { id: 9, text: 'Riesgos de contacto con sustancias químicas', correct: false, icon: '🧪' },
                    { id: 3, text: 'Riesgos de bienestar psicológico', correct: true, icon: '🧠' },
                    { id: 10, text: 'Riesgos de pinchazos con agujas', correct: false, icon: '💉' },
                    { id: 4, text: 'Riesgos de seguridad eléctrica', correct: true, icon: '⚡' },
                    { id: 7, text: 'Riesgos de manipulación de cargas pesadas', correct: false, icon: '🏋️' },
                    { id: 5, text: 'Riesgos de higiene y saneamiento', correct: true, icon: '🧼' },
                    { id: 2, text: 'Riesgos de salud postural y ergonómica', correct: true, icon: '💺' },
                    { id: 8, text: 'Riesgos por golpes de calor', correct: false, icon: '☀️' }
                  ].map(option => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl font-semibold shadow-lg border-2 cursor-pointer transition-all duration-200 select-none text-white text-left backdrop-blur-md ${state.analysisChoices.includes(option.text)
                          ? option.correct
                            ? 'bg-green-500/80 border-green-400 shadow-green-500/25'
                            : 'bg-red-500/80 border-red-400 shadow-red-500/25'
                          : 'bg-white/10 border-white/20 hover:bg-blue-400/30 hover:border-blue-300'
                        }`}
                      onClick={() => setState(s => ({
                        ...s,
                        analysisChoices: s.analysisChoices.includes(option.text)
                          ? s.analysisChoices.filter(o => o !== option.text)
                          : [...s.analysisChoices, option.text]
                      }))}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="text-sm leading-tight">{option.text}</span>
                        {state.analysisChoices.includes(option.text) && (
                          <span className="ml-auto text-lg">
                            {option.correct ? '✅' : '❌'}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Contador de selecciones */}
                <div className="flex justify-between items-center bg-black/20 rounded-lg p-3">
                  <span className="text-white/90 text-sm font-medium">
                    Seleccionados: <span className="text-blue-300 font-bold">{state.analysisChoices.length}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-white/10">
              <button
                className="bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold border border-blue-200 shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 hover:bg-white/40"
                onClick={() => changeQuestion(-1)}
              >
                ← Anterior
              </button>
              <button
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg border border-green-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  const correctOptions = [
                    'Riesgos de salud visual',
                    'Riesgos de salud postural y ergonómica',
                    'Riesgos de bienestar psicológico',
                    'Riesgos de seguridad eléctrica',
                    'Riesgos de higiene y saneamiento'
                  ];
                  const distractors = [
                    'Riesgos de soldadura',
                    'Riesgos de manipulación de cargas pesadas',
                    'Riesgos por golpes de calor',
                    'Riesgos de contacto con sustancias químicas',
                    'Riesgos de pinchazos con agujas'
                  ];
                  const selected = state.analysisChoices;
                  const selectedCorrect = correctOptions.filter(opt => selected.includes(opt));
                  const selectedDistractor = selected.some(opt => distractors.includes(opt));

                  if (selected.length < 3) {
                    setShowFillError({ type: 'min_selection', min: 3 });
                  } else if (selectedDistractor) {
                    setShowFillError({ type: 'distractor' });
                  } else if (selectedCorrect.length < 5) {
                    setShowFillError({ type: 'missing', missing: 5 - selectedCorrect.length });
                  } else {
                    if (typeof completeLevel === 'function') completeLevel(4);
                    navigate('/achievement/4');
                  }
                }}
                disabled={state.analysisChoices.length < 3}
              >
                🎯 Finalizar Análisis
              </button>
            </div>

            {/* Modal de error para selección */}
            {showFillError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border-2 border-blue-300/50 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">
                        {showFillError.type === 'min_selection' ? '📋' :
                          showFillError.type === 'distractor' ? '⚠️' : '🔍'}
                      </span>
                    </div>

                    <h4 className="text-2xl font-bold text-white mb-3">
                      {showFillError.type === 'min_selection' && 'Selección Insuficiente'}
                      {showFillError.type === 'distractor' && 'Riesgo Incorrecto'}
                      {showFillError.type === 'missing' && 'Faltan Riesgos por Identificar'}
                    </h4>

                    <p className="text-white/90 mb-6 leading-relaxed">
                      {showFillError.type === 'min_selection' &&
                        `Debes seleccionar al menos ${showFillError.min} riesgos. Has seleccionado ${state.analysisChoices.length}.`}
                      {showFillError.type === 'distractor' &&
                        'Has seleccionado un riesgo que no está presente en la imagen. Revisa tus opciones.'}
                      {showFillError.type === 'missing' &&
                        `Te faltan ${showFillError.missing} riesgo(s) correcto(s) por identificar. Observa la imagen con más atención.`}
                    </p>

                    <button
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg border border-blue-300/50 w-full transition-all duration-300 hover:scale-105"
                      onClick={() => setShowFillError(null)}
                    >
                      Entendido
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            <style>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.3);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.5);
      }
    `}</style>
          </motion.div>
        )}
        {/* Resultados */}
        {state.current === 5 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} {...{ className: "fade-in" }}>
            <h3 className="font-bold text-2xl mb-4 text-green-300 drop-shadow">¡Quiz completado!</h3>
            <p className="mb-6 text-blue-100">Tu puntaje: <span className="font-bold text-green-400">{state.score}/5</span> ({Math.round((state.score / totalQuestions) * 100)}%)</p>
            <button className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-2 rounded-xl font-bold shadow-lg border border-green-200 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-green-500/25 hover:-translate-y-1" onClick={restartQuiz}>Reiniciar Quiz</button>
            <button className="ml-4 bg-white/30 backdrop-blur-md text-blue-900 px-6 py-2 rounded-xl font-bold border border-blue-200 shadow transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 hover:bg-white/40" onClick={onClose}>Cerrar</button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AccidentQuiz;
