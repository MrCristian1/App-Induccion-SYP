import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGripVertical, 
  faCheckCircle, 
  faTimesCircle, 
  faTrophy, 
  faRedo,
  faUsers,
  faChartLine,
  faBullseye,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const challenges = [
  {
    id: 'organigrama',
    title: 'Organigrama Solutions & Payroll',
    director: {
      id: 'ceo',
      name: 'Junta de Socios',
      color: 'from-purple-600 to-purple-800'
    },
    positions: [
      { id: 'director-general', name: 'Director General', level: 2, correctParent: 'ceo' },
      { id: 'director-operaciones', name: 'Director de Operaciones', level: 2, correctParent: 'ceo' },
      { id: 'lider-gestion-humana', name: 'Líder de Gestión Humana', level: 4, correctParent: 'director-general' },
      { id: 'profesional-sgi', name: 'Profesional de Sistema de Gestión Integral', level: 5, correctParent: 'lider-gestion-humana' },
      { id: 'inhouse-arl', name: 'Inhouse ARL', level: 8, correctParent: 'profesional-sgi' },
      { id: 'analista-administrativo-financiero', name: 'Analista Administrativo y Financiero', level: 6, correctParent: 'director-general' },
      { id: 'asistente-administrativo-financiero', name: 'Asistente Administrativo y Financiero', level: 7, correctParent: 'director-general' },
      { id: 'outsourcing-contable', name: 'Outsourcing Contable', level: 8, correctParent: 'asistente-administrativo-financiero' },
      { id: 'asistente-comercial', name: 'Asistente Comercial', level: 7, correctParent: 'director-general' },
      { id: 'asistente-comunicacion-marketing', name: 'Asistente de Comunicación y Marketing', level: 7, correctParent: 'director-general' },
      { id: 'outsourcing-marketing', name: 'Outsourcing de Marketing', level: 8, correctParent: 'director-general' },
      { id: 'jefe-nomina', name: 'Jefe de Nómina', level: 3, correctParent: 'director-operaciones' },
      { id: 'profesional-nomina', name: 'Profesional de Nómina', level: 5, correctParent: 'jefe-nomina' },
      { id: 'analista-nomina', name: 'Analista de Nómina', level: 6, correctParent: 'jefe-nomina' },
      { id: 'asistente-nomina', name: 'Asistente de Nómina', level: 7, correctParent: 'jefe-nomina' },
      { id: 'auxiliar-nomina', name: 'Auxiliar de Nómina', level: 8, correctParent: 'jefe-nomina' },
      { id: 'lider-eor', name: 'Líder Employer of Record', level: 4, correctParent: 'director-operaciones' },
      { id: 'asistente-eor', name: 'Asistente de EOR', level: 7, correctParent: 'lider-eor' },
      { id: 'lider-administracion-personal', name: 'Líder de Administración de Personal', level: 4, correctParent: 'director-operaciones' },
      { id: 'analista-administracion-personal', name: 'Analista de Administración de Personal', level: 6, correctParent: 'lider-administracion-personal' },
      { id: 'asistente-administracion-personal', name: 'Asistente de Administración de Personal', level: 7, correctParent: 'lider-administracion-personal' },
      { id: 'outsourcing-legal', name: 'Outsourcing Legal', level: 8, correctParent: 'lider-administracion-personal' },
      { id: 'outsourcing-soporte-it', name: 'Outsourcing Soporte IT', level: 9, correctParent: 'lider-administracion-personal' },
      { id: 'lider-outsourcing-tesoreria', name: 'Líder de Outsourcing de Tesorería', level: 4, correctParent: 'director-operaciones' },
      { id: 'asistente-administrativo-financiero-op', name: 'Asistente Administrativo y Financiero', level: 7, correctParent: 'lider-outsourcing-tesoreria' }
    ],
    structure: {
      ceo: { name: 'Junta de Socios', children: ['director-general', 'director-operaciones'], level: 1 },
      'director-general': { name: 'Director General', children: ['lider-gestion-humana', 'analista-administrativo-financiero', 'asistente-administrativo-financiero', 'asistente-comercial', 'asistente-comunicacion-marketing', 'outsourcing-marketing'], level: 2 },
      'lider-gestion-humana': { name: 'Líder de Gestión Humana', children: ['profesional-sgi'], level: 4 },
      'profesional-sgi': { name: 'Profesional de Sistema de Gestión Integral', children: ['inhouse-arl'], level: 5 },
      'inhouse-arl': { name: 'Inhouse ARL', children: [], level: 8 },
      'analista-administrativo-financiero': { name: 'Analista Administrativo y Financiero', children: [], level: 6 },
      'asistente-administrativo-financiero': { name: 'Asistente Administrativo y Financiero', children: ['outsourcing-contable'], level: 7 },
      'outsourcing-contable': { name: 'Outsourcing Contable', children: [], level: 8 },
      'asistente-comercial': { name: 'Asistente Comercial', children: [], level: 7 },
      'asistente-comunicacion-marketing': { name: 'Asistente de Comunicación y Marketing', children: [], level: 7 },
      'outsourcing-marketing': { name: 'Outsourcing de Marketing', children: [], level: 8 },
      'director-operaciones': { name: 'Director de Operaciones', children: ['jefe-nomina', 'lider-eor', 'lider-administracion-personal', 'lider-outsourcing-tesoreria'], level: 2 },
      'jefe-nomina': { name: 'Jefe de Nómina', children: ['profesional-nomina', 'analista-nomina', 'asistente-nomina', 'auxiliar-nomina'], level: 3 },
      'profesional-nomina': { name: 'Profesional de Nómina', children: [], level: 5 },
      'analista-nomina': { name: 'Analista de Nómina', children: [], level: 6 },
      'asistente-nomina': { name: 'Asistente de Nómina', children: [], level: 7 },
      'auxiliar-nomina': { name: 'Auxiliar de Nómina', children: [], level: 8 },
      'lider-eor': { name: 'Líder Employer of Record', children: ['asistente-eor'], level: 4 },
      'asistente-eor': { name: 'Asistente de EOR', children: [], level: 7 },
      'lider-administracion-personal': { name: 'Líder de Administración de Personal', children: ['analista-administracion-personal', 'asistente-administracion-personal', 'outsourcing-legal', 'outsourcing-soporte-it'], level: 4 },
      'analista-administracion-personal': { name: 'Analista de Administración de Personal', children: [], level: 6 },
      'asistente-administracion-personal': { name: 'Asistente de Administración de Personal', children: [], level: 7 },
      'outsourcing-legal': { name: 'Outsourcing Legal', children: [], level: 8 },
      'outsourcing-soporte-it': { name: 'Outsourcing Soporte IT', children: [], level: 9 },
      'lider-outsourcing-tesoreria': { name: 'Líder de Outsourcing de Tesorería', children: ['asistente-administrativo-financiero-op'], level: 4 },
      'asistente-administrativo-financiero-op': { name: 'Asistente Administrativo y Financiero', children: [], level: 7 }
    }
  }
];

const HierarchyDragDrop = ({ onComplete }) => {
  const directorGeneralId = 'director-general';
  const directorOperacionesId = 'director-operaciones';
  const ceoId = 'ceo';

  const cargosDirectorGeneral = challenges[0].structure[directorGeneralId].children.map(
    id => challenges[0].positions.find(pos => pos.id === id)
  ).filter(Boolean);
  
  const cargosDirectorOperaciones = challenges[0].structure[directorOperacionesId].children.map(
    id => challenges[0].positions.find(pos => pos.id === id)
  ).filter(Boolean);

  const [stateDG, setStateDG] = useState({
    availablePositions: cargosDirectorGeneral,
    placedPositions: {}
  });
  
  const [stateDO, setStateDO] = useState({
    availablePositions: cargosDirectorOperaciones,
    placedPositions: {}
  });

  const [selectingSub, setSelectingSub] = useState(null);
  const [selectedSub, setSelectedSub] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();
  const { completeLevel } = useAppContext();

  const getDGCorrectCount = () => {
    let count = 0;
    // Contar cargos principales colocados correctamente
    Object.entries(stateDG.placedPositions).forEach(([nodeId, arr]) => {
      arr.forEach((pos, idx) => {
        const correctOrder = challenges[0].structure[nodeId]?.children?.[idx] === pos.id;
        if (pos.correctParent === nodeId && correctOrder) count++;
      });
    });
    
    // Contar subordinados seleccionados correctamente
    Object.entries(selectedSub).forEach(([positionId, subordinate]) => {
      if (subordinate && subordinate.isCorrect) {
        count++;
      }
    });
    
    return count;
  };

  const getDOCorrectCount = () => {
    let count = 0;
    // Contar cargos principales colocados correctamente
    Object.entries(stateDO.placedPositions).forEach(([nodeId, arr]) => {
      arr.forEach((pos, idx) => {
        const correctOrder = challenges[0].structure[nodeId]?.children?.[idx] === pos.id;
        if (pos.correctParent === nodeId && correctOrder) count++;
      });
    });
    
    // Contar subordinados seleccionados correctamente (los subordinados están relacionados con cargos de ambas secciones)
    // Por ahora no agregamos aquí porque selectedSub es global y ya se cuenta en getDGCorrectCount
    
    return count;
  };

  // Calcular total de elementos que se deben colocar/seleccionar correctamente
  const totalDG = cargosDirectorGeneral.length;
  const totalDO = cargosDirectorOperaciones.length;
  
  // Contar cuántos cargos tienen subordinados que se deben seleccionar
  const cargosConSubordinados = [];
  [...cargosDirectorGeneral, ...cargosDirectorOperaciones].forEach(cargo => {
    if (challenges[0].structure[cargo.id]?.children?.length > 0) {
      cargosConSubordinados.push(cargo.id);
    }
  });
  
  const aciertos = getDGCorrectCount() + getDOCorrectCount();
  const totalAciertos = totalDG + totalDO + cargosConSubordinados.length;
  const progress = totalAciertos > 0 ? (aciertos / totalAciertos) * 100 : 0;

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, position, state, setState) => {
    e.dataTransfer.setData('positionId', position.id);
    setDraggedItem(position);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (e, nodeId, state, setState) => {
    e.preventDefault();
    const positionId = e.dataTransfer.getData('positionId');
    if (!positionId) return;
    
    if (state.placedPositions[nodeId]?.some(pos => pos.id === positionId)) return;
    
    const position = state.availablePositions.find(pos => pos.id === positionId);
    if (!position) return;
    
    setState({
      availablePositions: state.availablePositions.filter(pos => pos.id !== positionId),
      placedPositions: {
        ...state.placedPositions,
        [nodeId]: [...(state.placedPositions[nodeId] || []), position]
      }
    });
    setDraggedItem(null);
  };

  const handleRemovePosition = (positionId, nodeId, state, setState) => {
    const position = state.placedPositions[nodeId].find(pos => pos.id === positionId);
    setState({
      availablePositions: [...state.availablePositions, position],
      placedPositions: {
        ...state.placedPositions,
        [nodeId]: state.placedPositions[nodeId].filter(pos => pos.id !== positionId)
      }
    });
  };

  const resetChallenge = () => {
    setStateDG({
      availablePositions: cargosDirectorGeneral,
      placedPositions: {}
    });
    setStateDO({
      availablePositions: cargosDirectorOperaciones,
      placedPositions: {}
    });
    setSelectedSub({});
  };

  const renderDropZoneSinTitulo = (nodeId, state, setState, level = 1) => {
    const hijosJefeNominaIds = challenges[0].structure['jefe-nomina'].children;
    const hijosLiderAdministracionPersonalIds = challenges[0].structure['lider-administracion-personal'].children;
    const node = challenges[0].structure[nodeId];
    if (!node) return null;
    
    const placedHere = state.placedPositions[nodeId] || [];
    const isDirector = level === 1 || level === 2;

    const hijosLiderGestionHumana = challenges[0].structure['lider-gestion-humana'].children.map(id => challenges[0].positions.find(pos => pos.id === id)).filter(Boolean);
    const hijosAsistenteAdministrativoFinanciero = challenges[0].structure['asistente-administrativo-financiero'].children.map(id => challenges[0].positions.find(pos => pos.id === id)).filter(Boolean);
    const hijosJefeNomina = challenges[0].structure['jefe-nomina'].children.map(id => challenges[0].positions.find(pos => pos.id === id)).filter(Boolean);
    const hijosLiderEOR = challenges[0].structure['lider-eor'].children.map(id => challenges[0].positions.find(pos => pos.id === id)).filter(Boolean);
    const hijosLiderAdministracionPersonal = challenges[0].structure['lider-administracion-personal'].children.map(id => challenges[0].positions.find(pos => pos.id === id)).filter(Boolean);
    const hijosLiderOutsourcingTesoreria = challenges[0].structure['lider-outsourcing-tesoreria'].children.map(id => challenges[0].positions.find(pos => pos.id === id)).filter(Boolean);
    
    const todasOpciones = [
      ...hijosLiderGestionHumana,
      ...hijosAsistenteAdministrativoFinanciero,
      {
        id: 'nomina-group',
        name: 'Cargos relacionados a nómina',
        level: '',
        correctParent: 'jefe-nomina',
        isGroup: true,
        children: hijosJefeNominaIds
      },
      ...hijosLiderEOR,
      {
        id: 'admin-personal-group',
        name: 'Cargos relacionados a administración de personal',
        level: '',
        correctParent: 'lider-administracion-personal',
        isGroup: true,
        children: hijosLiderAdministracionPersonalIds
      },
      ...hijosLiderOutsourcingTesoreria
    ];
    
    const isCeo = nodeId === 'ceo';
    
    return (
      <motion.div 
        key={nodeId} 
        className={`mb-6 ${level > 1 ? 'ml-8' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`relative overflow-hidden ${
            isDirector 
              ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white shadow-xl' 
              : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100'
          } rounded-2xl p-6 min-h-[100px] transition-all duration-500 ${
            isCeo ? 'opacity-90' : ''
          } ${draggedItem ? 'transform hover:scale-[1.02]' : ''}`}
          onDragOver={!isCeo ? handleDragOver : undefined}
          onDrop={!isCeo ? (e) => handleDrop(e, nodeId, state, setState) : undefined}
        >
          {/* Decorative elements for director cards */}
          {isDirector && (
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -ml-12 -mb-12"></div>
            </>
          )}
          
          {isDirector && (
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">{node.name}</h4>
                  <p className="text-purple-100 text-sm">Nivel {node.level}</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                FIJO
              </div>
            </div>
          )}
          
          <div className="space-y-3 relative z-10">
            <AnimatePresence>
              {placedHere.map((position, idx) => {
                const correctOrder = challenges[0].structure[nodeId]?.children?.[idx] === position.id;
                const isCorrect = position.correctParent === nodeId && correctOrder;
                const hasSubordinates = challenges[0].structure[position.id]?.children?.length > 0;
                
                return (
                  <motion.div
                    key={position.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white rounded-xl p-4 shadow-lg border-l-4 ${
                      isCorrect ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100' : 'border-red-500 bg-gradient-to-r from-red-50 to-red-100'
                    } cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          <FontAwesomeIcon 
                            icon={isCorrect ? faCheckCircle : faTimesCircle}
                            className="text-white"
                          />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-800">
                            {position.name}
                          </span>
                          <p className="text-xs text-gray-500">Nivel {position.level}</p>
                        </div>
                      </div>
                      <button 
                        className="px-3 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium" 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleRemovePosition(position.id, nodeId, state, setState);
                        }}
                      >
                        Quitar
                      </button>
                    </div>
                    
                    {hasSubordinates && (
                      <div className="mt-6 ml-6">
                        {!selectedSub[position.id] ? (
                          <motion.div 
                            className="bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-dashed border-gray-400 rounded-xl p-4 cursor-pointer text-gray-600 text-sm font-medium hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 transition-all duration-300" 
                            onClick={(e) => {e.stopPropagation(); setSelectingSub(position.id);}}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <FontAwesomeIcon icon={faLightbulb} className="text-purple-500" />
                              <span>Clic para escoger subordinado</span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            className={`bg-white rounded-xl p-4 shadow-lg border-l-4 ${
                              selectedSub[position.id].isCorrect ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100' : 'border-red-500 bg-gradient-to-r from-red-50 to-red-100'
                            } flex items-center justify-between cursor-pointer hover:shadow-xl transition-all duration-300`} 
                            onClick={(e) => {e.stopPropagation(); setSelectingSub(position.id);}}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                selectedSub[position.id].isCorrect ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                <FontAwesomeIcon 
                                  icon={selectedSub[position.id].isCorrect ? faCheckCircle : faTimesCircle}
                                  className="text-white text-sm"
                                />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">
                                  {selectedSub[position.id].name}
                                </span>
                                <p className="text-xs text-gray-500">Nivel {selectedSub[position.id].level}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <AnimatePresence>
                          {selectingSub === position.id && (
                            <motion.div 
                              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <motion.div 
                                className="bg-white border rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
                                initial={{ scale: 0.8, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 50 }}
                                transition={{ type: "spring", damping: 20 }}
                              >
                                <div className="text-center mb-6">
                                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FontAwesomeIcon icon={faBullseye} className="text-purple-600 text-2xl" />
                                  </div>
                                  <h4 className="text-2xl font-bold text-gray-800">Escoge el subordinado</h4>
                                  <p className="text-gray-600 mt-2">Selecciona la posición correcta</p>
                                </div>
                                
                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                  {todasOpciones.map(child => (
                                    <motion.div 
                                      key={child.id} 
                                      className="cursor-pointer hover:bg-purple-50 p-4 rounded-xl text-gray-700 border border-gray-200 hover:border-purple-300 transition-all duration-200" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        let isCorrect;
                                        if (child.isGroup) {
                                          isCorrect = child.correctParent === position.id;
                                        } else {
                                          isCorrect = child.correctParent === position.id;
                                        }
                                        setSelectedSub(prev => ({
                                          ...prev,
                                          [position.id]: {
                                            ...child,
                                            isCorrect
                                          }
                                        }));
                                        setSelectingSub(null);
                                      }}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="font-medium">{child.name}</div>
                                      {child.level && (
                                        <div className="text-sm text-gray-500 mt-1">Nivel {child.level}</div>
                                      )}
                                    </motion.div>
                                  ))}
                                </div>
                                
                                <button 
                                  className="mt-6 w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200" 
                                  onClick={() => setSelectingSub(null)}
                                >
                                  Cancelar
                                </button>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {placedHere.length === 0 && isDirector && (nodeId === 'director-general' || nodeId === 'director-operaciones') && (
              <motion.div 
                className="text-center text-purple-200 text-lg py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <FontAwesomeIcon icon={faChartLine} className="text-4xl mb-4" />
                <div className="font-medium">Arrastra y organiza los cargos subordinados</div>
                <div className="text-sm mt-2">en el orden correcto de jerarquía</div>
              </motion.div>
            )}
            
            {placedHere.length === 0 && (!isDirector || (nodeId !== 'director-general' && nodeId !== 'director-operaciones')) && (
              <div className="text-center text-gray-400 text-sm py-6">
                {/* Zona de drop vacía */}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 rounded-3xl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header and Progress Section */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {challenges[0].title}
                </h3>
                <p className="text-gray-600 mt-1">Organiza la estructura jerárquica correctamente</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-2">Progreso de Aciertos</div>
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 h-4 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            <motion.button
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              onClick={resetChallenge}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faRedo} />
              <span>Reiniciar Desafío</span>
            </motion.button>
            
            <motion.button
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                progress === 100 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={progress !== 100}
              onClick={() => {
                if (progress === 100) {
                  completeLevel(6);
                  setShowResults(false);
                  navigate('/achievement/6');
                }
              }}
              whileHover={progress === 100 ? { scale: 1.05 } : {}}
              whileTap={progress === 100 ? { scale: 0.95 } : {}}
            >
              <FontAwesomeIcon icon={faTrophy} />
              <span>Reclamar Insignia</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Director General Section */}
        <motion.div 
          className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faGripVertical} className="text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800">Cargos Disponibles</h4>
                <p className="text-gray-600">Director General ({stateDG.availablePositions.length})</p>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              <AnimatePresence>
                {stateDG.availablePositions.map((position, index) => (
                  <motion.div
                    key={position.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, position, stateDG, setStateDG)}
                    onDragEnd={handleDragEnd}
                    className={`bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-4 cursor-move hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                      draggedItem?.id === position.id ? 'opacity-50 scale-95' : 'hover:scale-105'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileDrag={{ scale: 1.05, zIndex: 1000 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faGripVertical} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{position.name}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                          <span>Nivel {position.level}</span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="text-purple-600 font-medium">Arrastra para colocar</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {stateDG.availablePositions.length === 0 && (
                <motion.div 
                  className="text-center py-12 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="text-6xl mb-4 text-green-400" />
                  <p className="text-lg font-medium">¡Todos los cargos han sido colocados!</p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800">Estructura Organizacional</h4>
                <p className="text-gray-600">Director General</p>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {renderDropZoneSinTitulo(ceoId, stateDG, setStateDG)}
              {renderDropZoneSinTitulo(directorGeneralId, stateDG, setStateDG, 2)}
            </div>
          </div>
        </motion.div>

        {/* Director de Operaciones Section */}
        <motion.div 
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faGripVertical} className="text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800">Cargos Disponibles</h4>
                <p className="text-gray-600">Director de Operaciones ({stateDO.availablePositions.length})</p>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              <AnimatePresence>
                {stateDO.availablePositions.map((position, index) => (
                  <motion.div
                    key={position.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, position, stateDO, setStateDO)}
                    onDragEnd={handleDragEnd}
                    className={`bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-4 cursor-move hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                      draggedItem?.id === position.id ? 'opacity-50 scale-95' : 'hover:scale-105'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileDrag={{ scale: 1.05, zIndex: 1000 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faGripVertical} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{position.name}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                          <span>Nivel {position.level}</span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="text-blue-600 font-medium">Arrastra para colocar</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {stateDO.availablePositions.length === 0 && (
                <motion.div 
                  className="text-center py-12 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="text-6xl mb-4 text-green-400" />
                  <p className="text-lg font-medium">¡Todos los cargos han sido colocados!</p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800">Estructura Organizacional</h4>
                <p className="text-gray-600">Director de Operaciones</p>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {renderDropZoneSinTitulo(ceoId, stateDO, setStateDO)}
              {renderDropZoneSinTitulo(directorOperacionesId, stateDO, setStateDO, 2)}
            </div>
          </div>
        </motion.div>

        {/* Results Modal */}
        <AnimatePresence>
          {showResults && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-3xl p-10 max-w-md w-full mx-4 text-center"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                >
                  <FontAwesomeIcon icon={faTrophy} className="text-8xl text-yellow-500 mb-6" />
                </motion.div>
                <h3 className="text-3xl font-bold text-green-600 mb-4">¡Excelente!</h3>
                <p className="text-gray-600 mb-6 text-lg">¡Bien hecho! Has completado todos los desafíos de organización jerárquica</p>
                <div className="text-4xl font-bold text-green-600 mb-8">{Math.round(progress)}%</div>
                <motion.button
                  onClick={() => {
                    completeLevel(6);
                    setShowResults(false);
                    setTimeout(() => {
                      navigate('/achievement/6');
                    }, 300);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reclamar Insignia
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">Estadísticas del Desafío</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-2xl" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{aciertos}</div>
              <div className="text-sm text-gray-600">Aciertos Totales</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faBullseye} className="text-white text-2xl" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalAciertos}</div>
              <div className="text-sm text-gray-600">Total Posiciones</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUsers} className="text-white text-2xl" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{getDGCorrectCount()}</div>
              <div className="text-sm text-gray-600">Aciertos Dir. General</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-white text-2xl" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{getDOCorrectCount()}</div>
              <div className="text-sm text-gray-600">Aciertos Dir. Operaciones</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HierarchyDragDrop;