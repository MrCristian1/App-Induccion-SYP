/**
 * Estructura de datos para la plataforma de inducción
 * Contiene la información de cada nivel, preguntas y respuestas
 */

// Configuración general de la empresa
export const companyConfig = {
  companyName: "Solutions & Payroll",
  totalLevels: 8,
  requiredCorrectAnswers: 3, // Mínimo de respuestas correctas para pasar un nivel
}

// Datos de los niveles
export const levelsData = [
  {
    id: 1,
    title: "Políticas de la empresa",
    icon: "scroll",
      policies: [
        {
          id: 1,
          title: "POLÍTICA DE GESTIÓN INTEGRAL",
          icon: "building",
          color: "from-blue-500 to-blue-700",
            description: "Solutions & Payroll S.A.S. ofrece servicios de administración de nómina, Employer of Record, outsourcing de tesorería y gestión de personal. La empresa busca la satisfacción de las partes interesadas mediante un enfoque en servicio, rentabilidad y crecimiento. Reconoce la importancia del capital humano y se compromete a mejorar continuamente su Sistema de Gestión Integral, prevenir riesgos laborales, promover el autocuidado y bienestar de los trabajadores, cumplir la normativa vigente y mantener entornos laborales seguros y saludables.",
          keyPoints: [
            "Mejora continua del Sistema de Gestión Integral",
            "Cumplimiento de requisitos legales",
            "Identificación y gestión de riesgos",
            "Participación de todos los empleados"
          ],
          badge: "Gestión Integral",
            // ...existing code...
        },
        {
          id: 2,
          title: "POLÍTICA PREVENCIÓN CONSUMO SUSTANCIAS PSICOACTIVAS",
          icon: "ban",
          color: "from-red-500 to-red-700",
          description: "El consumo de alcohol, sustancias psicoactivas y tabaco, está prohibido durante la jornada laboral y dentro de los centros de trabajo a los que se dirija o esté en misión. Está prohibido la venta y posesión de alcohol y sustancias.",
          keyPoints: [
            "Prohibido consumo de alcohol, sustancias psicoactivas y tabaco",
            "Prohibida la venta y posesión de alcohol y sustancias",
            "Aplica en jornada laboral y centros de trabajo"
          ],
          badge: "Prevención",
            // ...existing code...
        },
        {
          id: 3,
          title: "POLÍTICA DE DESCONEXIÓN LABORAL",
          icon: "power-off",
          color: "from-yellow-500 to-yellow-700",
          description: "Solutions & Payroll S.A.S. promueve el equilibro entre la jornada laboral y los espacios personales para mejorar la calidad de vida de sus colaboradores, por lo tanto, se compromete: Respetar los horarios de trabajo. Acudir al colaborador fuera de la jornada laboral únicamente cuando haya un requerimiento urgente. Entre otras.",
          keyPoints: [
            "Respeto por los horarios de trabajo",
            "Contactar fuera de horario solo por urgencias",
            "Promoción del equilibrio vida-trabajo"
          ],
          badge: "Desconexión",
            // ...existing code...
        },
        {
          id: 4,
          title: "POLÍTICA DE SERVICIO",
          icon: "handshake",
          color: "from-green-500 to-green-700",
          description: "En S&P, reconocemos que nuestros clientes son centro de nuestro hacer, comprendemos sus necesidades y nos comprometemos a satisfacerlas de manera efectiva. Comprensión de las necesidades del cliente. Soluciones oportunas y prácticas. Recursividad y accesibilidad. Experiencias satisfactorias. Relaciones valiosas y duraderas.",
          keyPoints: [
            "Comprensión de las necesidades del cliente",
            "Soluciones oportunas y prácticas",
            "Recursividad y accesibilidad",
            "Relaciones valiosas y duraderas"
          ],
          badge: "Servicio",
            // ...existing code...
        },
        {
          id: 5,
          title: "POLÍTICA DE TELETRABAJO",
          icon: "laptop-house",
          color: "from-teal-500 to-teal-700",
          description: "Solutions & Payroll S.A.S. tiene implementado un acuerdo de teletrabajo que busca mejorar la calidad de vida de sus colaboradores. Adicionalmente, está comprometido con la protección del medio ambiente, buscando reducir su huella de carbono y promoviendo un entorno más sostenible. Cumplimiento de políticas y RIT. Seguridad informática. Conectividad. Accidente de trabajo: avisar al jefe inmediato.",
          keyPoints: [
            "Mejora de calidad de vida",
            "Protección del medio ambiente",
            "Seguridad informática y conectividad",
            "Avisar accidentes al jefe inmediato"
          ],
          badge: "Teletrabajo",
            // ...existing code...
        },
        {
          id: 6,
          title: "POLÍTICA DE PROTECCIÓN DE DATOS",
          icon: "database",
          color: "from-indigo-500 to-indigo-700",
          description: "Solutions & Payroll está comprometida con la salvaguarda de la privacidad y la protección de los datos personales y empresariales. Esta Política de Protección y Privacidad de Datos describe nuestras obligaciones y procedimientos para gestionar los datos personales y empresariales en cumplimiento con las leyes colombianas de protección de datos (Ley 1581 de 2012, Decreto 1377 de 2013) y con los estándares internacionales aplicables, como el Reglamento General de Protección de Datos (GDPR).",
          keyPoints: [
            "Protección de datos personales y empresariales",
            "Cumplimiento de leyes colombianas y GDPR",
            "Obligaciones y procedimientos claros"
          ],
          badge: "Protección de Datos",
            // ...existing code...
        },
        {
          id: 7,
          title: "POLÍTICA DE MANEJO DE LA TIC Y SEGURIDAD DE INFORMACIÓN",
          icon: "lock",
          color: "from-gray-500 to-gray-700",
          description: "Buscamos el cuidado de la información en cualquiera de sus formas (entiéndase medio magnético o físico) tanto propia como de nuestros clientes; información que puede estar presente en escritorios, estaciones de trabajo, computadores portátiles, medios magnéticos removibles, documentos en papel, entre otros, y que es necesaria para el apoyo y el desarrollo de las actividades laborales.",
          keyPoints: [
            "Cuidado de la información propia y de clientes",
            "Protección en medios físicos y digitales",
            "Apoyo y desarrollo de actividades laborales"
          ],
          badge: "Seguridad de Información",
            // ...existing code...
        }
      ],
    content: [
      {
        type: "heading",
        text: "Políticas de Solutions & Payroll"
      },
      {
        type: "paragraph",
        text: "En Solutions & Payroll, nuestras políticas están diseñadas para crear un ambiente de trabajo productivo, seguro y respetuoso para todos los colaboradores."
      }
    ],
    quiz: [
      {
        question: "¿Cuál es el compromiso principal de la Política de la Organización?",
        options: [
          "Mejorar continuamente el Sistema de Gestión Integral",
          "Reducir costos operativos",
          "Aumentar la producción",
          "Contratar más empleados"
        ],
        correctAnswer: 0
      },
      {
        question: "Según la Política de Prevención de Consumo de Sustancias Psicoactivas, ¿qué está prohibido durante la jornada laboral?",
        options: [
          "Uso de dispositivos electrónicos",
          "Consumo de alcohol, sustancias psicoactivas y tabaco",
          "Comer en el puesto de trabajo",
          "Vestimenta informal"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Qué promueve la Política de Desconexión Laboral?",
        options: [
          "Trabajar horas extras sin límite",
          "Equilibrio entre jornada laboral y espacios personales",
          "Uso obligatorio de correo electrónico fuera de horario",
          "Reuniones fuera de horario laboral"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Cuál es el enfoque principal de la Política de Servicio?",
        options: [
          "Satisfacer las necesidades del cliente de manera efectiva",
          "Reducir el tiempo de atención",
          "Evitar contacto con clientes",
          "Limitar soluciones a lo mínimo necesario"
        ],
        correctAnswer: 0
      },
      {
        question: "¿Qué busca la Política de Teletrabajo además de mejorar la calidad de vida?",
        options: [
          "Aumentar la presencialidad",
          "Reducir la huella de carbono y promover sostenibilidad",
          "Eliminar el trabajo remoto",
          "Limitar el acceso a internet"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Qué leyes menciona la Política de Protección de Datos?",
        options: [
          "Ley 1581 de 2012 y Decreto 1377 de 2013",
          "Ley de Propiedad Intelectual",
          "Ley de Seguridad Social",
          "Ley de Contratación Pública"
        ],
        correctAnswer: 0
      },
      {
        question: "¿Qué protege la Política de Manejo de la TIC y Seguridad de Información?",
        options: [
          "Información en medios físicos y digitales",
          "Solo documentos en papel",
          "Solo correos electrónicos",
          "Solo información de clientes"
        ],
        correctAnswer: 0
      }
    ],
    achievement: {
      name: "Experto en Políticas",
      icon: "scroll",
      description: "¡Has demostrado conocer las políticas fundamentales de Solutions & Payroll!"
    }
  },
  {
    id: 2,
  title: "ADN de la empresa",
    icon: "dna",
    content: [
      {
  type: "heading",
  text: "ADN de Solutions & Payroll"
      },
      {
        type: "paragraph",
        text: "Solutions & Payroll se especializa en brindar soluciones integrales de gestión de nómina y recursos humanos para empresas de todos los tamaños."
      },
      {
        type: "subheading",
        text: "Gestión de Nómina"
      },
      {
        type: "paragraph",
        text: "Ofrecemos servicios completos de procesamiento de nómina, incluyendo cálculo de salarios, deducciones, impuestos y generación de reportes para cumplimiento legal."
      },
      {
        type: "subheading",
        text: "Administración de Recursos Humanos"
      },
      {
        type: "paragraph",
        text: "Brindamos soporte en reclutamiento, selección, onboarding, evaluación de desempeño y desarrollo de talento para optimizar el capital humano de nuestros clientes."
      },
      {
        type: "subheading",
        text: "Consultoría Laboral"
      },
      {
        type: "paragraph",
        text: "Asesoramos a las empresas en materia de legislación laboral, contratos, prestaciones y obligaciones patronales para garantizar el cumplimiento normativo."
      },
      {
        type: "subheading",
        text: "Tecnología HR"
      },
      {
        type: "paragraph",
        text: "Implementamos soluciones tecnológicas que automatizan y optimizan los procesos de recursos humanos, mejorando la eficiencia operativa de nuestros clientes."
      }
    ],
    quiz: [
      {
        question: "¿Cuál es una de las principales funciones de Solutions & Payroll?",
        options: [
          "Desarrollo de software para videojuegos",
          "Gestión de nómina y recursos humanos",
          "Servicios de marketing digital",
          "Consultoría financiera para inversiones"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Qué incluye el servicio de procesamiento de nómina?",
        options: [
          "Solo el cálculo de salarios básicos",
          "Únicamente la generación de reportes",
          "Cálculo de salarios, deducciones, impuestos y reportes",
          "Exclusivamente el pago de impuestos"
        ],
        correctAnswer: 2
      },
      {
        question: "¿En qué área brinda soporte la Administración de Recursos Humanos?",
        options: [
          "Solo en reclutamiento",
          "Únicamente en evaluación de desempeño",
          "En reclutamiento, selección, onboarding, evaluación y desarrollo",
          "Exclusivamente en compensaciones"
        ],
        correctAnswer: 2
      },
      {
        question: "¿Qué tipo de consultoría ofrece la empresa?",
        options: [
          "Consultoría de marketing",
          "Consultoría laboral",
          "Consultoría financiera",
          "Consultoría de operaciones"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Cuál es el propósito de implementar soluciones tecnológicas HR?",
        options: [
          "Reemplazar al personal de recursos humanos",
          "Complicar los procesos administrativos",
          "Automatizar y optimizar procesos para mejorar la eficiencia",
          "Únicamente cumplir con requisitos legales"
        ],
        correctAnswer: 2
      }
    ],
    achievement: {
  name: "Conocedor de ADN",
  icon: "dna",
  description: "¡Te apropiaste del ADN empresarial de Solutions & Payroll en el mercado!"
    }
  },
  {
    id: 3,
    title: "Fundamentos del SG-SST",
  icon: "clipboard-list",
    type: "interactive-game", // Nuevo tipo para identificar que usa el componente de juego
    content: [
      {
        type: "heading",
        text: "Juego Interactivo: Valores, Misión y Visión"
      },
      {
        type: "paragraph",
        text: "Aprende los conceptos básicos del SG-SST de manera divertida. Identifica sus objetivos, principios y componentes a través de quizzes y actividades interactivas."
      }
    ],
    achievement: {
      name: "Experto en SG-SST",
  icon: "clipboard-list",
      description: "¡Has demostrado tu comprensión de los fundamentos del Sistema de Gestión de Seguridad y Salud en el Trabajo!"
    }
  },
  {
    id: 4,
    title: "Gestión de riesgos y Accidentalidad",
    icon: "exclamation-triangle",
    type: "accident-level",
    content: [
      {
        type: "heading",
        text: "Accidentalidad en Solutions & Payroll"
      },
      {
        type: "paragraph",
        text: "Próximamente aprenderás sobre la prevención y gestión de accidentes laborales en Solutions & Payroll."
      }
    ],
    achievement: {
      name: "Conocedor de Accidentalidad",
      icon: "exclamation-triangle",
      description: "¡Has aprendido los conceptos clave sobre accidentalidad laboral!"
    }
  },
  {
    id: 5,
    title: "Comités internos",
    icon: "users",
    content: [
      {
        type: "heading",
        text: "Comités Internos en Solutions & Payroll"
      },
      {
        type: "paragraph",
        text: "En Solutions & Payroll, los comités internos son fundamentales para fomentar la comunicación, la colaboración y el bienestar de todos los colaboradores."
      },
      {
        type: "subheading",
        text: "Comité de Bienestar"
      },
      {
        type: "paragraph",
        text: "Se encarga de promover actividades y programas que contribuyan al bienestar físico, mental y emocional de los empleados."
      },
      {
        type: "subheading",
        text: "Comité de Seguridad y Salud en el Trabajo"
      },
      {
        type: "paragraph",
        text: "Su objetivo es velar por el cumplimiento de las normas de seguridad y salud, previniendo riesgos y promoviendo un ambiente laboral seguro."
      },
      {
        type: "subheading",
        text: "Comité de Calidad"
      },
      {
        type: "paragraph",
        text: "Busca garantizar la calidad en todos los procesos y servicios de la empresa, implementando mejoras continuas."
      },
      {
        type: "subheading",
        text: "Comité de Innovación"
      },
      {
        type: "paragraph",
        text: "Fomenta la creatividad y la innovación entre los colaboradores, impulsando el desarrollo de nuevas ideas y proyectos."
      }
    ],
    quiz: [
      {
        question: "¿Cuál es la función del Comité de Bienestar?",
        options: [
          "Aumentar la carga laboral",
          "Promover actividades para el bienestar de los empleados",
          "Reducir el salario de los empleados",
          "Limitar la comunicación entre áreas"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Qué busca el Comité de Seguridad y Salud en el Trabajo?",
        options: [
          "Incrementar los riesgos laborales",
          "Velar por el cumplimiento de normas de seguridad y salud",
          "Eliminar el descanso de los empleados",
          "Prohibir el uso de elementos de protección"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Cuál es el objetivo del Comité de Calidad?",
        options: [
          "Garantizar la calidad en procesos y servicios",
          "Reducir la calidad para disminuir costos",
          "Aumentar el tiempo de entrega",
          "Limitar la capacitación en calidad"
        ],
        correctAnswer: 0
      },
      {
        question: "¿Qué fomenta el Comité de Innovación?",
        options: [
          "La rutina y el estancamiento",
          "La creatividad y el desarrollo de nuevas ideas",
          "La competencia desleal entre empleados",
          "El incumplimiento de procesos"
        ],
        correctAnswer: 1
      }
    ],
    achievement: {
      name: "Colaborador Activo",
      icon: "users",
      description: "¡Has aprendido sobre la importancia de los comités internos en Solutions & Payroll!"
    }
  },
  {
    id: 6,
    title: "Jerarquía y estructura organizacional",
    icon: "sitemap",
    content: [
      {
        type: "heading",
        text: "Jerarquía y Estructura Organizacional de Solutions & Payroll"
      },
      {
        type: "paragraph",
        text: "Nuestra estructura está diseñada para facilitar la comunicación, la toma de decisiones y el desarrollo profesional de todos los colaboradores."
      },
      {
        type: "subheading",
        text: "Dirección General"
      },
      {
        type: "paragraph",
        text: "Liderada por el CEO y el equipo directivo, establece la visión estratégica y los objetivos a largo plazo de la organización."
      },
      {
        type: "subheading",
        text: "Gerencias de Área"
      },
      {
        type: "paragraph",
        text: "Incluyen las gerencias de Operaciones, Comercial, Recursos Humanos, Finanzas y Tecnología, cada una responsable de sus respectivos departamentos y procesos."
      },
      {
        type: "subheading",
        text: "Coordinaciones"
      },
      {
        type: "paragraph",
        text: "Nivel intermedio que supervisa equipos específicos dentro de cada área, asegurando la implementación efectiva de procesos y proyectos."
      },
      {
        type: "subheading",
        text: "Especialistas y Analistas"
      },
      {
        type: "paragraph",
        text: "Profesionales con conocimientos técnicos específicos que ejecutan las operaciones diarias y brindan soporte especializado a clientes internos y externos."
      },
      {
        type: "subheading",
        text: "Asistentes y Auxiliares"
      },
      {
        type: "paragraph",
        text: "Brindan apoyo operativo y administrativo a los diferentes niveles de la organización, contribuyendo al funcionamiento eficiente de los procesos."
      }
    ],
    quiz: [
      {
        question: "¿Quién lidera la Dirección General de la empresa?",
        options: [
          "Los gerentes de área",
          "El CEO y el equipo directivo",
          "Los coordinadores",
          "Los especialistas"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Qué gerencias se mencionan en la estructura organizacional?",
        options: [
          "Solo Recursos Humanos y Finanzas",
          "Únicamente Operaciones y Comercial",
          "Operaciones, Comercial, Recursos Humanos, Finanzas y Tecnología",
          "Marketing, Ventas y Producción"
        ],
        correctAnswer: 2
      },
      {
        question: "¿Cuál es la función de las Coordinaciones en la estructura?",
        options: [
          "Establecer la visión estratégica",
          "Supervisar equipos específicos y asegurar implementación de procesos",
          "Brindar apoyo operativo únicamente",
          "Definir el presupuesto anual"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Qué rol desempeñan los Especialistas y Analistas?",
        options: [
          "Lideran la organización",
          "Supervisan a los gerentes",
          "Ejecutan operaciones diarias y brindan soporte especializado",
          "Solo tareas administrativas básicas"
        ],
        correctAnswer: 2
      },
      {
        question: "¿Cuál es la contribución de los Asistentes y Auxiliares?",
        options: [
          "Establecen la estrategia de la empresa",
          "Supervisan a los especialistas",
          "Brindan apoyo operativo y administrativo",
          "Definen los procesos técnicos"
        ],
        correctAnswer: 2
      }
    ],
    achievement: {
      name: "Maestro Organizacional",
      icon: "sitemap",
      description: "¡Has comprendido la estructura que sostiene y hace funcionar a Solutions & Payroll!"
    }
  },
  {
    id: 7,
    title: "Sistema de gestión de calidad",
    icon: "star",
    color: "from-purple-900 via-purple-700 to-slate-900",
    achievement: {
      name: "Gestión de Calidad",
      description: "Has explorado el sistema de gestión de calidad de la empresa y conoces sus fundamentos.",
      icon: "star"
    },
    content: [
      { type: "heading", text: "Sistema de gestión de calidad" },
      { type: "paragraph", text: "El sistema de gestión de calidad es el conjunto de procesos, procedimientos y recursos que aseguran que los productos y servicios de la empresa cumplen con los estándares requeridos y las expectativas de los clientes." },
      { type: "paragraph", text: "Incluye la mejora continua, auditorías internas, capacitación y el compromiso de todos los colaboradores." }
    ],
    quiz: [] // Puedes agregar preguntas aquí más adelante
  },
  {
    id: 8,
    title: "Mapa de Procesos",
    icon: "cog",
    color: "from-indigo-900 via-indigo-700 to-slate-900",
    achievement: {
      name: "Experto en Procesos",
      description: "Has comprendido el mapa de procesos de Solutions & Payroll y su importancia en la organización.",
      icon: "cog"
    },
    content: [
      { type: "heading", text: "Mapa de Procesos" },
      { type: "paragraph", text: "El mapa de procesos es una representación gráfica que muestra los procesos de una organización y sus interrelaciones. Permite visualizar cómo se crean valor y se entregan resultados a los clientes." },
      { type: "paragraph", text: "En Solutions & Payroll, nuestros procesos están diseñados para garantizar la excelencia operacional y la satisfacción del cliente." }
    ],
    quiz: []
  },
  {
    id: 9,
    title: "Fundamentos ACR",
    icon: "award",
    color: "from-blue-900 via-blue-700 to-slate-900",
    achievement: {
      name: "Fundamentos ACR",
      description: "Has explorado los fundamentos ACR.",
      icon: "award"
    },
    content: [
      { type: "heading", text: "Fundamentos ACR" },
      { type: "paragraph", text: "Bienvenido al nivel de Fundamentos ACR. Aquí aprenderás los conceptos esenciales relacionados con ACR." }
    ],
    quiz: []
  }
]

// Logro final al completar todos los niveles
export const finalAchievement = {
  name: "Inducción Completada",
  icon: "award",
  description: "¡Felicidades! Has completado exitosamente tu proceso de inducción en Solutions & Payroll. Ahora estás listo para formar parte de nuestro equipo con todos los conocimientos necesarios."
}