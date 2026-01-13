import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRedo, 
  faPrint, 
  faCertificate, 
  faAward, 
  faCalendarAlt,
  faUser,
  faDownload,
  faShare,
  faStar,
  faMedal,
  faTrophy,
  faHeart,
  faGem,
  faShield,
  faBookOpen,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../context/AppContext';

// Nuevo componente de confeti mejorado
const ImprovedConfetti = () => {
  const [confettiPieces, setConfettiPieces] = useState([]);
  
  // Colores basados en el tema de la vista
  const confettiColors = [
    '#FFD700', // Amarillo dorado
    '#FFA500', // Naranja
    '#9370DB', // Púrpura medio
    '#6A5ACD', // Slate blue
    '#8A2BE2', // Blue violet
    '#4B0082', // Índigo
    '#FFFFFF'  // Blanco
  ];
  
  // Formas de confeti
  const confettiShapes = ['circle', 'rectangle', 'star'];

  useEffect(() => {
    // Crear 150 piezas de confeti
    const newConfetti = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -10 - Math.random() * 20, // Empezar por encima de la vista
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: 5 + Math.random() * 10,
      shape: confettiShapes[Math.floor(Math.random() * confettiShapes.length)],
      rotation: Math.random() * 360,
      fallDuration: 5 + Math.random() * 10,
      swingDuration: 2 + Math.random() * 3,
      delay: Math.random() * 5
    }));
    
    setConfettiPieces(newConfetti);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.left}%`,
            top: `${piece.top}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'star' ? '0%' : '10%',
            transform: `rotate(${piece.rotation}deg)`,
            animation: `
              fall-${piece.id} ${piece.fallDuration}s ${piece.delay}s forwards,
              swing-${piece.id} ${piece.swingDuration}s ${piece.delay}s infinite alternate
            `
          }}
        >
          <style>
            {`
              @keyframes fall-${piece.id} {
                to { 
                  top: 110%; 
                  transform: rotate(${piece.rotation + 360}deg);
                }
              }
              @keyframes swing-${piece.id} {
                from { transform: translateX(-5px) rotate(${piece.rotation}deg); }
                to { transform: translateX(5px) rotate(${piece.rotation + 10}deg); }
              }
            `}
          </style>
        </div>
      ))}
    </div>
  );
};

function FinalCertificate() {
  const navigate = useNavigate();
  const { finalAchievement, resetProgress, completedLevels, userName } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [fallingIcons, setFallingIcons] = useState([]);
  const [certificateId] = useState(`SYP-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);

  // Redirigir a Welcome si no hay nombre de usuario
  useEffect(() => {
    if (!userName || userName.trim() === '') {
      navigate('/')
    }
  }, [userName, navigate])

  // Array de iconos para la animación de fondo
  const backgroundIcons = [faStar, faMedal, faTrophy, faHeart, faGem, faShield, faBookOpen, faUsers, faAward, faCertificate];

  // Generar iconos cayendo
  useEffect(() => {
    const generateIcon = () => {
      const icon = backgroundIcons[Math.floor(Math.random() * backgroundIcons.length)];
      const newIcon = {
        id: Math.random(),
        icon: icon,
        left: Math.random() * 100,
        animationDuration: 6 + Math.random() * 8, // Más lento: 6-14 segundos
        size: 1.5 + Math.random() * 1, // Más grande: 1.5-2.5rem
        opacity: 0.15 + Math.random() * 0.25 // Más visible: 0.15-0.4
      };
      
      setFallingIcons(prev => [...prev, newIcon]);
      
      // Remover el icono después de la animación
      setTimeout(() => {
        setFallingIcons(prev => prev.filter(item => item.id !== newIcon.id));
      }, newIcon.animationDuration * 1000);
    };

    const interval = setInterval(generateIcon, 800); // Menos frecuente para iconos más grandes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('Completed levels:', completedLevels);
    // Animación de entrada suave
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, [completedLevels]);

  const handleBackToMap = () => navigate('/map');
  const handleRestart = () => {
    resetProgress();
    navigate('/');
  };

  const handlePrint = () => window.print();
  const handleDownload = () => {
    // Implementar descarga como PDF
    window.print(); // Por ahora usa print, pero se puede integrar con jsPDF
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Certificado de Finalización - Solutions & Payroll',
        text: 'He completado exitosamente el programa de inducción',
      });
    } else {
      // Fallback para navegadores sin Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500" />
        
        {/* Iconos cayendo */}
        {fallingIcons.map((iconData) => (
          <div
            key={iconData.id}
            className="absolute text-white/20"
            style={{
              left: `${iconData.left}%`,
              fontSize: `${iconData.size}rem`,
              opacity: iconData.opacity,
              animation: `fall ${iconData.animationDuration}s linear forwards`
            }}
          >
            <FontAwesomeIcon icon={iconData.icon} />
          </div>
        ))}
      </div>

      {/* Confeti mejorado - ahora cubre toda la pantalla */}
      <ImprovedConfetti />

      {/* Contenedor principal del certificado */}
      <motion.div
        className="w-full max-w-5xl mx-auto relative z-10"
        initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        {/* Header con acciones rápidas */}
        <motion.div
          className="flex justify-end gap-2 mb-6 print:hidden"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 backdrop-blur-md border border-white/10 text-white/90 text-sm hover:bg-white/12 hover:scale-105 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faShare} className="text-xs" />
            Compartir
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 backdrop-blur-md border border-white/10 text-white/90 text-sm hover:bg-white/12 hover:scale-105 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faDownload} className="text-xs" />
            Descargar
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 backdrop-blur-md border border-white/10 text-white/90 text-sm hover:bg-white/12 hover:scale-105 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPrint} className="text-xs" />
            Imprimir
          </button>
        </motion.div>

        {/* Certificado principal */}
        <motion.div
          className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/12 to-white/6 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Patrón decorativo de fondo */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 text-6xl text-white">
              <FontAwesomeIcon icon={faCertificate} />
            </div>
            <div className="absolute bottom-8 right-8 text-6xl text-white rotate-12">
              <FontAwesomeIcon icon={faAward} />
            </div>
          </div>

          {/* Header del certificado */}
          <div className="relative z-10 text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-4 mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-500/30 backdrop-blur-sm p-3 border-2 border-yellow-300/30">
                  <img src="/img/syp.png" alt="Solutions & Payroll" className="w-full h-full object-contain filter drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faCertificate} className="text-white text-xs" />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white tracking-wide">Solutions & Payroll</h3>
                <p className="text-white/80 text-sm">Programa de Inducción Corporativa</p>
                <p className="text-white/60 text-xs">Certificación Oficial de Finalización</p>
              </div>
            </motion.div>

            {/* Título principal */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 leading-tight mb-4">
                Certificado de Finalización
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full" />
            </motion.div>
          </div>

          {/* Contenido principal */}
          <div className="relative z-10 text-center space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <p className="text-white/90 text-lg mb-4">
                Se certifica que <span className="font-bold text-yellow-300">{userName || 'Nombre'}</span> ha completado satisfactoriamente el Programa de Inducción Corporativa.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="space-y-4"
            >
              {/* Título del logro */}
              <div className="text-center mb-6 flex items-center justify-center gap-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 leading-tight">
                  Inducción Completada
                </h2>
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mt-2" />
              
              {/* Detalles del logro */}
              <div className="max-w-2xl mx-auto bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-white/70 mb-4">
                  {finalAchievement?.description || 'Has completado con éxito todos los módulos del programa de inducción, demostrando tu compromiso y dedicación al proceso de integración.'}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                    <span className="text-white/70">Niveles completados:</span>
                    <span className="text-yellow-300 font-semibold">
                      {'9'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                    <span className="text-white/70">Progreso:</span>
                    <span className="text-green-400 font-semibold">100%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Información adicional */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            >
              {/* Fecha */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-300" />
                  <div className="text-left">
                    <p className="text-white/60 text-xs">Fecha de emisión</p>
                    <p className="text-white font-semibold text-sm">{currentDate}</p>
                  </div>
                </div>
              </div>

              {/* ID del certificado */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                  <FontAwesomeIcon icon={faCertificate} className="text-purple-300" />
                  <div className="text-left">
                    <p className="text-white/60 text-xs">Certificado No.</p>
                    <p className="text-white font-semibold text-sm">{certificateId}</p>
                  </div>
                </div>
              </div>

              {/* Validez */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                  <FontAwesomeIcon icon={faAward} className="text-green-300" />
                  <div className="text-left">
                    <p className="text-white/60 text-xs">Estado</p>
                    <p className="text-green-400 font-semibold text-sm">Válido</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer con acciones */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
            className="relative z-10 mt-8 pt-6 border-t border-white/10 print:hidden"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-white/50 text-sm">
                © {new Date().getFullYear()} Solutions & Payroll • Todos los derechos reservados
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToMap}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm border border-white/20 text-white font-medium hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Volver al Mapa
                </button>

                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600/80 to-red-600/80 backdrop-blur-sm border border-white/20 text-white font-medium hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faRedo} />
                  Nueva Inducción
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Estilos para impresión mejorados */}
      <style>{`
        @media print {
          body { 
            background: white !important; 
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .print\\:hidden { 
            display: none !important; 
          }
          
          /* Asegurar que los gradientes y efectos se impriman */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }

        /* Animación de caída para iconos */
        @keyframes fall {
          0% { 
            transform: translateY(-100vh) rotate(0deg); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          90% { 
            opacity: 1; 
          }
          100% { 
            transform: translateY(100vh) rotate(360deg); 
            opacity: 0; 
          }
        }

        /* Animaciones adicionales */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>
    </motion.div>
  );
}

export default FinalCertificate;