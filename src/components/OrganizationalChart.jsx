import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronDown, 
  faChevronRight, 
  faUser, 
  faUsers,
  faCrown,
  faBuilding,
  faClipboardList,
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

const OrganizationalChart = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['ceo']))
  const [selectedNode, setSelectedNode] = useState(null)

  // Estructura organizacional completa
  const orgStructure = {
    ceo: {
      id: 'ceo',
      title: 'Junta de Socios',
      name: 'Junta de Socios',
      description: 'Órgano máximo de decisión y supervisión de la empresa.',
      reportsTo: null,
      supervises: ['director-general', 'director-operaciones'],
      level: 1,
      color: 'from-purple-600 to-purple-800'
    },
    'director-general': {
      id: 'director-general',
      title: 'Director General',
      name: 'Director General',
      description: 'Responsable de la gestión administrativa y estratégica.',
      reportsTo: 'Junta de Socios',
      supervises: ['lider-gestion-humana', 'analista-administrativo-financiero', 'asistente-administrativo-financiero', 'asistente-comercial', 'asistente-comunicacion-marketing', 'outsourcing-marketing'],
      level: 2,
      color: 'from-blue-500 to-blue-700'
    },
    'lider-gestion-humana': {
      id: 'lider-gestion-humana',
      title: 'Líder de Gestión Humana',
      name: 'Líder de Gestión Humana',
      description: 'Encargado de la gestión del talento humano.',
      reportsTo: 'director-general',
      supervises: ['profesional-sgi'],
      level: 4,
      color: 'from-green-500 to-green-700'
    },
    'profesional-sgi': {
      id: 'profesional-sgi',
      title: 'Profesional de Sistema de Gestión Integral',
      name: 'Profesional de Sistema de Gestión Integral',
      description: 'Responsable de la gestión integral de sistemas.',
      reportsTo: 'lider-gestion-humana',
      supervises: ['inhouse-arl'],
      level: 5,
      color: 'from-teal-400 to-teal-600'
    },
    'inhouse-arl': {
      id: 'inhouse-arl',
      title: 'Inhouse ARL',
      name: 'Inhouse ARL',
      description: 'Gestión de riesgos laborales en la empresa.',
      reportsTo: 'profesional-sgi',
      supervises: [],
      level: 8,
      color: 'from-teal-400 to-teal-600'
    },
    'analista-administrativo-financiero': {
      id: 'analista-administrativo-financiero',
      title: 'Analista Administrativo y Financiero',
      name: 'Analista Administrativo y Financiero',
      description: 'Gestión administrativa y financiera.',
      reportsTo: 'director-general',
      supervises: [],
      level: 6,
      color: 'from-green-500 to-green-700'
    },
    'asistente-administrativo-financiero': {
      id: 'asistente-administrativo-financiero',
      title: 'Asistente Administrativo y Financiero',
      name: 'Asistente Administrativo y Financiero',
      description: 'Apoyo en tareas administrativas y financieras.',
      reportsTo: 'analista-administrativo-financiero',
      supervises: ['outsourcing-contable'],
      level: 7,
      color: 'from-teal-400 to-teal-600'
    },
    'outsourcing-contable': {
      id: 'outsourcing-contable',
      title: 'Outsourcing Contable',
      name: 'Outsourcing Contable',
      description: 'Servicios contables externos.',
      reportsTo: 'asistente-administrativo-financiero',
      supervises: [],
      level: 8,
      color: 'from-teal-400 to-teal-600'
    },
    'asistente-comercial': {
      id: 'asistente-comercial',
      title: 'Asistente Comercial',
      name: 'Asistente Comercial',
      description: 'Apoyo en gestión comercial.',
      reportsTo: 'director-general',
      supervises: [],
      level: 7,
      color: 'from-orange-500 to-orange-700'
    },
    'asistente-comunicacion-marketing': {
      id: 'asistente-comunicacion-marketing',
      title: 'Asistente de Comunicación y Marketing',
      name: 'Asistente de Comunicación y Marketing',
      description: 'Apoyo en comunicación y marketing.',
      reportsTo: 'director-general',
      supervises: [],
      level: 7,
      color: 'from-red-500 to-red-700'
    },
    'outsourcing-marketing': {
      id: 'outsourcing-marketing',
      title: 'Outsourcing de Marketing',
      name: 'Outsourcing de Marketing',
      description: 'Servicios de marketing externos.',
      reportsTo: 'director-general',
      supervises: [],
      level: 8,
      color: 'from-red-500 to-red-700'
    },
    'director-operaciones': {
      id: 'director-operaciones',
      title: 'Director de Operaciones',
      name: 'Director de Operaciones',
      description: 'Responsable de la gestión operativa de la empresa.',
      reportsTo: 'Junta de Socios',
      supervises: [
        'jefe-nomina',
        'lider-eor',
        'lider-administracion-personal',
        'lider-outsourcing-tesoreria'
      ],
      level: 2,
      color: 'from-indigo-500 to-indigo-700'
    },
    'jefe-nomina': {
      id: 'jefe-nomina',
      title: 'Jefe de Nómina',
      name: 'Jefe de Nómina',
      description: 'Encargado de la gestión de nómina.',
      reportsTo: 'director-operaciones',
      supervises: ['profesional-nomina', 'analista-nomina', 'asistente-nomina', 'auxiliar-nomina'],
      level: 3,
      color: 'from-blue-500 to-blue-700'
    },
    'profesional-nomina': {
      id: 'profesional-nomina',
      title: 'Profesional de Nómina',
      name: 'Profesional de Nómina',
      description: 'Responsable de procesos de nómina.',
      reportsTo: 'jefe-nomina',
      supervises: [],
      level: 5,
      color: 'from-green-500 to-green-700'
    },
    'analista-nomina': {
      id: 'analista-nomina',
      title: 'Analista de Nómina',
      name: 'Analista de Nómina',
      description: 'Analiza y procesa nómina.',
      reportsTo: 'jefe-nomina',
      supervises: [],
      level: 6,
      color: 'from-teal-400 to-teal-600'
    },
    'asistente-nomina': {
      id: 'asistente-nomina',
      title: 'Asistente de Nómina',
      name: 'Asistente de Nómina',
      description: 'Apoya en tareas de nómina.',
      reportsTo: 'jefe-nomina',
      supervises: [],
      level: 7,
      color: 'from-orange-500 to-orange-700'
    },
    'auxiliar-nomina': {
      id: 'auxiliar-nomina',
      title: 'Auxiliar de Nómina',
      name: 'Auxiliar de Nómina',
      description: 'Auxiliar en procesos de nómina.',
      reportsTo: 'jefe-nomina',
      supervises: [],
      level: 8,
      color: 'from-orange-500 to-orange-700'
    },
    'lider-eor': {
      id: 'lider-eor',
      title: 'Líder Employer of Record',
      name: 'Líder Employer of Record',
      description: 'Encargado de la gestión EOR.',
      reportsTo: 'director-operaciones',
      supervises: ['asistente-eor'],
      level: 4,
      color: 'from-green-500 to-green-700'
    },
    'asistente-eor': {
      id: 'asistente-eor',
      title: 'Asistente de EOR',
      name: 'Asistente de EOR',
      description: 'Apoyo en gestión EOR.',
      reportsTo: 'lider-eor',
      supervises: [],
      level: 7,
      color: 'from-orange-500 to-orange-700'
    },
    'lider-administracion-personal': {
      id: 'lider-administracion-personal',
      title: 'Líder de Administración de Personal',
      name: 'Líder de Administración de Personal',
      description: 'Encargado de la administración de personal.',
      reportsTo: 'director-operaciones',
      supervises: [
        'analista-administracion-personal',
        'asistente-administracion-personal',
        'outsourcing-legal',
        'outsourcing-soporte-it'
      ],
      level: 4,
      color: 'from-green-500 to-green-700'
    },
    'analista-administracion-personal': {
      id: 'analista-administracion-personal',
      title: 'Analista de Administración de Personal',
      name: 'Analista de Administración de Personal',
      description: 'Analiza procesos de administración de personal.',
      reportsTo: 'lider-administracion-personal',
      supervises: [],
      level: 6,
      color: 'from-teal-400 to-teal-600'
    },
    'asistente-administracion-personal': {
      id: 'asistente-administracion-personal',
      title: 'Asistente de Administración de Personal',
      name: 'Asistente de Administración de Personal',
      description: 'Apoya en administración de personal.',
      reportsTo: 'lider-administracion-personal',
      supervises: [],
      level: 7,
      color: 'from-orange-500 to-orange-700'
    },
    'outsourcing-legal': {
      id: 'outsourcing-legal',
      title: 'Outsourcing Legal',
      name: 'Outsourcing Legal',
      description: 'Servicios legales externos.',
      reportsTo: 'lider-administracion-personal',
      supervises: [],
      level: 8,
      color: 'from-red-500 to-red-700'
    },
    'outsourcing-soporte-it': {
      id: 'outsourcing-soporte-it',
      title: 'Outsourcing Soporte IT',
      name: 'Outsourcing Soporte IT',
      description: 'Servicios de soporte IT externos.',
      reportsTo: 'lider-administracion-personal',
      supervises: [],
      level: 9,
      color: 'from-red-500 to-red-700'
    },
    'lider-outsourcing-tesoreria': {
      id: 'lider-outsourcing-tesoreria',
      title: 'Líder de Outsourcing de Tesorería',
      name: 'Líder de Outsourcing de Tesorería',
      description: 'Encargado de la gestión de tesorería.',
      reportsTo: 'director-operaciones',
      supervises: ['asistente-administrativo-financiero-op'],
      level: 4,
      color: 'from-green-500 to-green-700'
    },
    'asistente-administrativo-financiero-op': {
      id: 'asistente-administrativo-financiero-op',
      title: 'Asistente Administrativo y Financiero',
      name: 'Asistente Administrativo y Financiero',
      description: 'Apoyo en tareas administrativas y financieras de tesorería.',
      reportsTo: 'lider-outsourcing-tesoreria',
      supervises: [],
      level: 7,
      color: 'from-orange-500 to-orange-700'
    }
  }

  // Colores por nivel
  const getLevelColor = (level) => {
    const colors = {
      1: 'from-purple-600 to-purple-800', // CEO
      2: 'from-blue-500 to-blue-700',     // Directores
      3: 'from-green-500 to-green-700',   // Gerentes
      4: 'from-orange-500 to-orange-700'  // Analistas
    }
    return colors[level] || 'from-gray-600 to-gray-800'
  }

  const getIconByLevel = (level) => {
    const icons = {
      1: faCrown,
      2: faBuilding,
      3: faUsers,
      4: faUser
    }
    return icons[level] || faUser
  }

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const selectNode = (node) => {
    setSelectedNode(node)
  }

  const renderNode = (nodeId, depth = 0) => {
    const node = orgStructure[nodeId]
    if (!node) return null

    const isExpanded = expandedNodes.has(nodeId)
    const hasChildren = node.supervises.length > 0
    
    // Calcular indentación progresiva basada en el nivel usando clases predefinidas
    const getIndentationClass = (depth) => {
      console.log(`Depth: ${depth}, Node: ${nodeId}, Level: ${node.level}`) // Debug
      switch(depth) {
        case 0: return 'ml-0'        // CEO (nivel 1)
        case 1: return 'ml-8'        // Directores (nivel 2)
        case 2: return 'ml-16'       // Gerentes (nivel 3)
        case 3: return 'ml-24'       // Analistas/Coordinadores (nivel 4)
        case 4: return 'ml-32'       // Niveles adicionales
        default: return 'ml-32'
      }
    }

    return (
      <div key={nodeId} className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: depth * 0.1 }}
          className={`mb-4 ${getIndentationClass(depth)}`}
        >
          <div
            className={`relative bg-gradient-to-r ${node.color} text-white rounded-lg p-4 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-102`}
            onClick={() => selectNode(node)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon 
                  icon={getIconByLevel(node.level)} 
                  className="text-lg" 
                />
                <div>
                  <h4 className="font-bold text-sm">{node.name}</h4>
                  <p className="text-xs opacity-90">Nivel {node.level}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon 
                  icon={faInfoCircle} 
                  className="text-sm opacity-75 hover:opacity-100 transition-opacity" 
                />
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleNode(nodeId)
                    }}
                    className="p-2 rounded-full hover:bg-white hover:bg-opacity-25 transition-all duration-200 flex items-center justify-center min-w-[32px] min-h-[32px] group"
                  >
                    <FontAwesomeIcon 
                      icon={isExpanded ? faChevronDown : faChevronRight}
                      className="text-sm transition-all duration-200 group-hover:scale-110 drop-shadow-sm"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Líneas de conexión mejoradas */}
          {depth > 0 && (
            <div className="absolute -left-6 top-6 w-6 h-px bg-gray-400 opacity-60"></div>
          )}
          {hasChildren && isExpanded && (
            <div className="absolute left-6 top-16 w-px bg-gray-400 opacity-60" style={{ height: `${node.supervises.length * 120}px` }}></div>
          )}
        </motion.div>

        {/* Nodos hijos */}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {node.supervises.map(childId => renderNode(childId, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Organigrama */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 overflow-x-auto">
        <div className="min-w-[800px] max-w-full">
          {renderNode('ceo')}
        </div>
      </div>

      {/* Panel lateral con información detallada */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Información del Cargo</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
              </div>

              <div className={`bg-gradient-to-r ${getLevelColor(selectedNode.level)} text-white rounded-lg p-4 mb-6`}>
                <div className="flex items-center space-x-3 mb-3">
                  <FontAwesomeIcon 
                    icon={getIconByLevel(selectedNode.level)} 
                    className="text-2xl" 
                  />
                  <div>
                    <h4 className="font-bold text-lg">{selectedNode.title}</h4>
                    <p className="text-sm opacity-90">Nivel {selectedNode.level}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Función Principal:</h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>

                {selectedNode.reportsTo && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Reporta a:</h5>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700">
                        {selectedNode.reportsTo}
                      </p>
                    </div>
                  </div>
                )}

                {selectedNode.supervises.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Supervisa a:</h5>
                    <div className="space-y-2">
                      {selectedNode.supervises.map((supervisedRole, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700">
                            {supervisedRole}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar el panel */}
      {selectedNode && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}

export default OrganizationalChart