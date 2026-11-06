import { AcademicDocument, HectorFoundations, HectorInteractiveQuizQuestion, HectorOralExamData } from '../types/academic';

export interface HectorThoughtResult {
  text: string;
  mode: 'general' | 'foundations' | 'quiz' | 'oral' | 'comparison' | 'mnemonic';
  foundations?: HectorFoundations;
  interactiveQuiz?: HectorInteractiveQuizQuestion[];
  oralExam?: HectorOralExamData;
  suggestedActions?: string[];
}

// Academic Foundational Repository for Argentine University Chairs
const FOUNDATIONS_DATABASE: Record<string, HectorFoundations> = {
  'anatomia-cardio': {
    primaryAuthor: 'Prof. Dr. Henri Rouvière & André Delmas',
    sourceWork: 'Anatomía Humana Descriptiva, Topográfica y Funcional (Tomo 2: Tronco)',
    keyRuleOrLaw: 'Configuración interna y sistema de conducción cardionector (Nódulo Sinusal de Keith y Flack - Nódulo AV de Aschoff y Tawara)',
    academicThesis: 'El corazón funciona como una doble bomba sincrónica separada por tabiques completos (interauricular e interventricular). El circuito derecho maneja volumen a bajas presiones (resistencia vascular pulmonar ~15-20 mmHg), mientras que el ventrículo izquierdo maneja presión (hasta 120 mmHg) con una pared miocárdica tres veces más gruesa.',
    doctrinalRationale: 'La Cátedra 1 (Prof. Rizzolo) evalúa minuciosamente el Triángulo de Koch en la aurícula derecha (delimitado por el tendón de Todaro, la valva septal de la tricúspide y el orificio del seno coronario), ya que en su vértice se asienta el nódulo auriculoventricular. En el ventrículo derecho destaca la cintilla arcuata (trabécula septomarginal) por donde transcurre la rama derecha del haz de His.',
    examPitfall: 'Confundir las ramas de la coronaria izquierda con la derecha: la descendente anterior y la circunfleja son tributarias de la coronaria izquierda; la arteria del nódulo sinusal nace en un 60% de los casos de la coronaria derecha.',
    keyTakeaway: 'Mnemotecnia de oro: TRIPUL-MITRAOR (Tricúspide y Pulmonar en corazón derecho carbooxigenado; Mitral y Aórtica en corazón izquierdo oxigenado).'
  },
  'icse-estado': {
    primaryAuthor: 'Dr. Oscar Oszlak',
    sourceWork: 'La formación del Estado Argentino: Orden, progreso y organización nacional (Ed. Planeta)',
    keyRuleOrLaw: 'Los 4 Atributos de Estatidad y la Ley 1029 de Federalización de Buenos Aires (1880)',
    academicThesis: 'El Estado no es una mera suma de instituciones ni un acto jurídico fundacional; es una relación social de dominación que surge de un proceso histórico donde el centro político adquiere la capacidad de ejercer el control territorial y social indiscutido.',
    doctrinalRationale: 'Para Oszlak, la consolidación estatal argentina requirió subordinar militarmente a las provincias (mitigar caudillismos mediante el ejército nacional), centralizar la renta aduanera mediante la Aduana de Buenos Aires y forjar un aparato burocrático profesional. La resolución definitiva aconteció en 1880 cuando se derrocan las últimas milicias porteñas de Carlos Tejedor.',
    examPitfall: 'Equiparar Estado con Gobierno: el Estado es la estructura permanente institucional con monopolio de la fuerza; el Gobierno es la administración temporal y transitoria de funcionarios que ejercen el poder estatal.',
    keyTakeaway: 'Los 4 atributos de Oszlak son la pregunta fija de parcial en Pedrosa: 1) Externalización, 2) Institucionalización, 3) Diferenciación del control y 4) Internalización de identidad colectiva.'
  },
  'ipc-popper-kuhn': {
    primaryAuthor: 'Karl R. Popper vs. Thomas S. Kuhn',
    sourceWork: 'La lógica de la investigación científica (Popper, 1934) / La estructura de las revoluciones científicas (Kuhn, 1962)',
    keyRuleOrLaw: 'Regla lógica de Modus Tollens [(H -> CO) ^ ~CO] -> ~H vs. Inconmensurabilidad de Paradigmas',
    academicThesis: 'Para Popper, la demarcación entre ciencia y pseudociencia reside en la falsabilidad lógica: ninguna cantidad de cisnes blancos verifica una hipótesis universal, pero un único contraejemplo la refuta inapelablemente. Para Kuhn, la ciencia real no progresa por falsaciones heroicas sino por acumulación de anomalías en etapas de Ciencia Normal que desembocan en Crisis y Cambio de Paradigma.',
    doctrinalRationale: 'La Cátedra Buacar exige justificar por qué la verificación empírica comete la falacia de afirmación del consecuente [(H -> CO) ^ CO -> H es falaz], mientras que el falsacionismo es lógicamente válido por Modus Tollens. Kuhn objeta que los científicos protegen el núcleo duro de su paradigma modificando hipótesis auxiliares.',
    examPitfall: 'Decir que una teoría refutada para Popper es "falsa para siempre en la basura": Popper dice que fue falsada y debe abandonarse por otra con mayor contenido empírico testable.',
    keyTakeaway: 'Regla mnemotécnica: "Popper poda teorías con lógica; Kuhn describe la sociología de las revoluciones científicas".'
  },
  'analisis-teoremas': {
    primaryAuthor: 'James Stewart & Michael Spivak',
    sourceWork: 'Cálculo de una variable: Trascendentes tempranas / Calculus (Ed. Reverté)',
    keyRuleOrLaw: 'Teorema del Valor Medio de Lagrange: f\'(c) = [f(b) - f(a)] / (b - a)',
    academicThesis: 'El Teorema de Lagrange establece que bajo las hipótesis de continuidad en el intervalo cerrado [a, b] y derivabilidad en el intervalo abierto (a, b), existe al menos un punto intermedio c en (a, b) donde la velocidad instantánea (pendiente tangente) coincide exactamente con la velocidad media (pendiente de la secante).',
    doctrinalRationale: 'En UTN y CBC Stewart, la justificación formal se apoya en construir la función auxiliar h(x) = f(x) - [f(a) + ((f(b)-f(a))/(b-a))*(x-a)], comprobar que cumple las hipótesis del Teorema de Rolle (h(a) = h(b) = 0) y aplicar que h\'(c) = 0, derivando directamente la igualdad de Lagrange.',
    examPitfall: 'Aplicar Lagrange o la Regla de L\'Hôpital sin verificar previamente las hipótesis: si la función tiene una discontinuidad o un punto anguloso en el intervalo, el teorema no es aplicable y el ejercicio se califica con 0 puntos.',
    keyTakeaway: 'Siempre escribir explícitamente: "Como f es polinómica/trigonométrica en su dominio, es continua en [a,b] y derivable en (a,b); por lo tanto rige el Teorema de Lagrange".'
  },
  'derecho-supremacia': {
    primaryAuthor: 'Dr. Daniel Sabsay & Germán Bidart Campos',
    sourceWork: 'Manual de la Constitución Argentina / Tratado de Derecho Constitucional',
    keyRuleOrLaw: 'Art. 31, Art. 75 inc. 22 y Art. 43 de la Constitución de la Nación Argentina (Reforma 1994)',
    academicThesis: 'La reforma constitucional de 1994 reconfiguró la pirámide jurídica kelseniana en Argentina. El bloque de constitucionalidad federal (Art. 75 inc. 22) otorga jerarquía constitucional a tratados internacionales de derechos humanos en las condiciones de su vigencia, compartiendo la cúspide con el texto de la Constitución Nacional por sobre las leyes del Congreso.',
    doctrinalRationale: 'Los fallos "Siri" (1957) y "Kot" (1958) crearon pretorianamente la acción expedita y rápida de Amparo sin necesidad de ley reglamentaria frente a actos de autoridad pública o particulares que lesionen derechos con arbitrariedad manifiesta. En 1994 el constituyente lo cristalizó en el Art. 43 CN junto con el Habeas Corpus y Habeas Data.',
    examPitfall: 'Decir que "todos los tratados tienen jerarquía constitucional": Falso. Solo los enumerados expresamente en el Art. 75 inc. 22 tienen jerarquía constitucional originaria; los demás tratados con potencias extranjeras tienen jerarquía supralegal pero infraconstitucional.',
    keyTakeaway: 'Cúspide de la pirámide: Constitución Nacional + Tratados Art. 75 inc. 22 > Tratados de integración y concordatos > Leyes de la Nación > Decretos > Resoluciones.'
  },
  'freud-topicas': {
    primaryAuthor: 'Sigmund Freud',
    sourceWork: 'La interpretación de los sueños (1900, Cap. VII) / El Yo y el Ello (1923, Obras Completas Amorrortu)',
    keyRuleOrLaw: 'Paso del Modelo Topográfico al Modelo Estructural y la Pulsión de Muerte (Más allá del principio del placer, 1920)',
    academicThesis: 'En la 1ra Tópica (1900), el aparato psíquico se concibe topográficamente como lugares o sistemas: Inconsciente (Icc), Preconsciente (Prcc) y Consciente (Cc), regidos por el principio de placer/realidad y el proceso primario/secundario. Hacia 1923, Freud descubre que las defensas y la culpa son inconscientes pero pertenecen al Yo, obligándolo a reformular la mente en instancias operativas: Ello, Yo y Superyó.',
    doctrinalRationale: 'La Cátedra Laznik exige señalar que el Superyó es el heredero directo del Complejo de Edipo y la introyección de las figuras parentales normativas. El Yo se debate entre tres amos crueles: el Ello pulsional desmedido, el Superyó castigador y la cruda realidad exterior.',
    examPitfall: 'Confundir el Yo con la Conciencia: el Yo no es solo la parte consciente del individuo; gran parte de los mecanismos de defensa del Yo (como la represión y la negación) son estrictamente inconscientes.',
    keyTakeaway: 'Ello = reservorio pulsional innato; Yo = polo defensivo y de síntesis; Superyó = instancia moral e ideal del yo.'
  },
  'macro-islm': {
    primaryAuthor: 'John Hicks, Alvin Hansen & Olivier Blanchard',
    sourceWork: 'Mr. Keynes and the "Classics": A Suggested Interpretation (Hicks, 1937) / Macroeconomía (Blanchard & Pérez Enrri)',
    keyRuleOrLaw: 'Curva IS: Y = C(Y - T) + I(Y, i) + G / Curva LM: M/P = L(Y, i)',
    academicThesis: 'El modelo IS-LM representa el equilibrio macroeconómico simultáneo en el mercado de bienes (curva IS con pendiente negativa) y en el mercado monetario/financiero (curva LM con pendiente positiva), determinando conjuntamente el nivel de ingreso Y y la tasa de interés i de equilibrio en el corto plazo.',
    doctrinalRationale: 'Una política fiscal expansiva (aumento del gasto público G o reducción de impuestos T) desplaza la IS a la derecha. Esto incrementa la producción Y, lo que eleva la demanda transaccional de dinero; ante una oferta monetaria fija, la tasa de interés i sube, desalentando la inversión privada: es el célebre "Efecto Expulsión" o Crowding Out.',
    examPitfall: 'Olvidar la trampa de la liquidez: a tasas de interés cercanas a cero, la curva LM se vuelve horizontal, por lo que la política monetaria pierde toda tracción sobre la economía real.',
    keyTakeaway: 'Shock Fiscal = mueve IS (derecha = expansivo). Shock Monetario = mueve LM (derecha/abajo = expansivo).'
  }
};

export const findFoundationsForDoc = (doc?: AcademicDocument | null, query?: string): HectorFoundations => {
  const q = (query || '').toLowerCase();
  const docId = doc?.id || '';
  const subj = (doc?.subjectId || '').toLowerCase();

  if (subj.includes('cardio') || subj.includes('anat') || q.includes('corazon') || q.includes('arteria') || q.includes('tricuspide')) {
    return FOUNDATIONS_DATABASE['anatomia-cardio'];
  }
  if (subj.includes('icse') || q.includes('oszlak') || q.includes('estado') || q.includes('pedrosa')) {
    return FOUNDATIONS_DATABASE['icse-estado'];
  }
  if (subj.includes('ipc') || q.includes('popper') || q.includes('kuhn') || q.includes('buacar')) {
    return FOUNDATIONS_DATABASE['ipc-popper-kuhn'];
  }
  if (subj.includes('analisis') || q.includes('derivada') || q.includes('lagrange') || q.includes('hopital')) {
    return FOUNDATIONS_DATABASE['analisis-teoremas'];
  }
  if (subj.includes('constitu') || q.includes('derecho') || q.includes('amparo') || q.includes('sabsay')) {
    return FOUNDATIONS_DATABASE['derecho-supremacia'];
  }
  if (subj.includes('freud') || q.includes('topica') || q.includes('laznik') || q.includes('inconsciente')) {
    return FOUNDATIONS_DATABASE['freud-topicas'];
  }
  if (subj.includes('macro') || q.includes('islm') || q.includes('blanchard') || q.includes('inflacion')) {
    return FOUNDATIONS_DATABASE['macro-islm'];
  }

  // Fallback to first available or subject-adjusted
  return FOUNDATIONS_DATABASE['icse-estado'];
};

export const generateOralExamSession = (doc?: AcademicDocument | null): HectorOralExamData => {
  const subj = (doc?.subjectId || '').toLowerCase();

  if (subj.includes('cardio') || subj.includes('anat')) {
    return {
      questionNumber: 1,
      evaluatorPersona: 'Prof. Titular de Anatomía (Cátedra Rizzolo)',
      question: 'Alumno, ubíquese en la aurícula derecha. Describa detalladamente los límites anatómicos del Triángulo de Koch, qué elemento fundamental del sistema cardionector aloja en su vértice y cuál es su irrigación nutricia principal.',
      requiredConcepts: [
        'Tendón de Todaro',
        'Valva septal de la válvula tricúspide',
        'Orificio del seno coronario (con válvula de Tebesio)',
        'Nódulo auriculoventricular de Aschoff-Tawara',
        'Arteria del nódulo AV (rama de la coronaria derecha)'
      ]
    };
  }

  if (subj.includes('icse')) {
    return {
      questionNumber: 1,
      evaluatorPersona: 'Prof. Titular de Sociedad y Estado (Cátedra Pedrosa)',
      question: 'Explique con rigor teórico por qué para Oscar Oszlak la adquisición de los atributos de estatidad no es un acontecimiento instantáneo de 1810 o 1853, sino un proceso histórico que culmina recién en 1880 con la federalización.',
      requiredConcepts: [
        'Atributos de estatidad (externalización, monopolio violencia, burocracia, identidad)',
        'Subordinación de milicias provinciales al ejército nacional',
        'Centralización aduanera y fin de aduanas interiores',
        'Derrota de las rebeliones de Tejedor y Ley 1029 de 1880'
      ]
    };
  }

  if (subj.includes('ipc')) {
    return {
      questionNumber: 1,
      evaluatorPersona: 'Docente a Cargo de Pensamiento Científico (Cátedra Buacar)',
      question: 'Demuestre formalmente por qué la verificación inductiva comete una falacia formal y por qué la falsación popperiana es la única lógicamente válida mediante Modus Tollens. ¿Qué crítica le formula Thomas Kuhn a este esquema?',
      requiredConcepts: [
        'Falacia de afirmación del consecuente',
        'Asimetría de la contrastación',
        'Regla de Modus Tollens [(H -> CO) ^ ~CO] -> ~H',
        'Tesis kuhniana de la resistencia al cambio en Ciencia Normal y protección del núcleo'
      ]
    };
  }

  if (subj.includes('analisis')) {
    return {
      questionNumber: 1,
      evaluatorPersona: 'Jefe de Trabajos Prácticos de Análisis Matemático I (UTN / Stewart)',
      question: 'Enuncie con precisión el Teorema del Valor Medio de Lagrange. ¿Por qué es indispensable que la función sea continua en el intervalo cerrado y derivable en el abierto? Brinde un contraejemplo donde falle la derivabilidad.',
      requiredConcepts: [
        'Hipótesis: f continua en [a,b] y derivable en (a,b)',
        'Tesis: existe c en (a,b) tal que f\'(c) = (f(b)-f(a))/(b-a)',
        'Interpretación geométrica (recta tangente paralela a recta secante)',
        'Contraejemplo: función valor absoluto f(x)=|x| en [-1, 1] no tiene derivada en x=0'
      ]
    };
  }

  // Default fallback
  return {
    questionNumber: 1,
    evaluatorPersona: 'Tribunal Examinador Universitario',
    question: `Desarrolle la fundamentación teórica obligatoria del programa de ${doc?.subjectName || 'la materia'} según los autores de la cátedra.`,
    requiredConcepts: ['Precisión conceptual', 'Cita de bibliografía obligatoria', 'Justificación dogmática']
  };
};

export const gradeOralAnswer = (
  examData: HectorOralExamData,
  userAnswer: string
): {
  grade: number;
  verdict: 'Aprobado con Distinción' | 'Aprobado' | 'A examen final' | 'Insuficiente / Reprobado';
  missingPoints: string[];
  feedback: string;
} => {
  const text = userAnswer.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  examData.requiredConcepts.forEach((concept) => {
    // Check key words from each concept
    const words = concept.toLowerCase().split(/[\s,()\-]+/).filter((w) => w.length > 4);
    const hit = words.some((w) => text.includes(w));
    if (hit) {
      matched.push(concept);
    } else {
      missing.push(concept);
    }
  });

  const ratio = matched.length / examData.requiredConcepts.length;
  let grade = 2;
  let verdict: 'Aprobado con Distinción' | 'Aprobado' | 'A examen final' | 'Insuficiente / Reprobado' = 'Insuficiente / Reprobado';
  let feedback = '';

  if (ratio >= 0.8 || text.length > 180) {
    grade = ratio >= 0.9 ? 10 : 9;
    verdict = 'Aprobado con Distinción';
    feedback = `¡Excelente exposición oral! Mencionaste con solvencia los puntos medulares: ${matched.slice(0, 3).join(', ')}. Tu argumentación tiene la rigurosidad exacta que premian los profesores titulares en mesa de examen.`;
  } else if (ratio >= 0.5 || text.length > 90) {
    grade = ratio >= 0.6 ? 7 : 5;
    verdict = grade >= 7 ? 'Aprobado' : 'A examen final';
    feedback = `Respuesta admisible. Desarrollaste la idea general, pero te faltó precisión en conceptos indispensables de cátedra. Revisá los puntos señalados abajo para asegurar la nota de promoción directa.`;
  } else {
    grade = 3;
    verdict = 'Insuficiente / Reprobado';
    feedback = `Respuesta incompleta para una instancia de examen oral. En mesa examinadora universitaria se exige citar con precisión los términos técnicos y autores. Mirá los conceptos que omitiste:`;
  }

  return {
    grade,
    verdict,
    missingPoints: missing,
    feedback
  };
};

export const generateInteractiveQuizForDoc = (doc?: AcademicDocument | null): HectorInteractiveQuizQuestion[] => {
  const subj = (doc?.subjectId || '').toLowerCase();

  if (subj.includes('cardio') || subj.includes('anat')) {
    return [
      {
        id: 'hq-1',
        statement: '¿Cuál de las siguientes estructuras anatómicas forma el límite posterior del Triángulo de Koch?',
        options: [
          { id: 'a', text: 'Tendón de Todaro (cordón fibroso subendocárdico)', isCorrect: true, explanation: 'Correcto. El tendón de Todaro forma el límite superior/posterior del triángulo de Koch.' },
          { id: 'b', text: 'Cúspide anterior de la válvula mitral', isCorrect: false, explanation: 'Incorrecto. La válvula mitral pertenece a las cavidades izquierdas del corazón.' },
          { id: 'c', text: 'Cresta terminal de His', isCorrect: false, explanation: 'Incorrecto. La cresta terminal separa el seno de las venas cavas de la aurícula propiamente dicha.' },
        ]
      },
      {
        id: 'hq-2',
        statement: '¿De qué arteria nace con mayor frecuencia (aprox. 60% de los casos) la arteria del nódulo sinusal?',
        options: [
          { id: 'a', text: 'Arteria Coronaria Derecha', isCorrect: true, explanation: 'Correcto. En la mayoría de la población la dominancia derecha origina la irrigación del marcapasos natural cardíaco.' },
          { id: 'b', text: 'Arteria Circunfleja Izquierda', isCorrect: false, explanation: 'Incorrecto. Nace de la circunfleja solo en el 40% de los casos con dominancia izquierda.' },
          { id: 'c', text: 'Arteria Mamaria Interna', isCorrect: false, explanation: 'Incorrecto. Es una rama de la subclavia, no pertenece a la circulación coronaria intrínseca.' },
        ]
      },
      {
        id: 'hq-3',
        statement: '¿Dónde desemboca fisiológicamente el seno coronario venoso?',
        options: [
          { id: 'a', text: 'Aurícula Derecha, custodiado por la válvula de Tebesio', isCorrect: true, explanation: 'Correcto. Recoge la mayor parte del retorno venoso miocárdico y drena en la pared posteroinferior de la aurícula derecha.' },
          { id: 'b', text: 'Ventrículo Izquierdo directamente', isCorrect: false, explanation: 'Incorrecto. Mezclaría sangre venosa con sangre oxigenada arterial.' },
          { id: 'c', text: 'Tronco de la arteria pulmonar', isCorrect: false, explanation: 'Incorrecto. El tronco pulmonar transporta sangre eyectada desde el ventrículo derecho.' },
        ]
      }
    ];
  }

  // Default ICSE/General
  return [
    {
      id: 'hq-1',
      statement: 'Según Oscar Oszlak, ¿cuál es el atributo que define la capacidad de extraer recursos de la sociedad civil de manera burocrática y legítima?',
      options: [
        { id: 'a', text: 'Diferenciación del control institucional y aparato recaudatorio', isCorrect: true, explanation: 'Correcto. Implica la creación de organismos estatales profesionalizados para percibir tributos y regular la vida social.' },
        { id: 'b', text: 'Externalización del poder internacional', isCorrect: false, explanation: 'Incorrecto. La externalización atañe al reconocimiento de soberanía por parte de otros Estados.' },
        { id: 'c', text: 'Internalización de una identidad colectiva', isCorrect: false, explanation: 'Incorrecto. La internalización se vincula a símbolos y sentidos de pertenencia cultural.' },
      ]
    },
    {
      id: 'hq-2',
      statement: '¿Qué distingue conceptualmente a un "Régimen Político" de un "Gobierno" según la teoría politológica?',
      options: [
        { id: 'a', text: 'El régimen son las reglas de acceso y ejercicio del poder; el gobierno son los funcionarios temporales.', isCorrect: true, explanation: 'Exacto. Un gobierno puede cambiar democráticamente sin que cambie el régimen, mientras que un golpe de Estado derroca el régimen mismo.' },
        { id: 'b', text: 'Son sinónimos intercambiables en todos los exámenes.', isCorrect: false, explanation: 'Error grave. Es la trampa típica donde los ayudantes de cátedra descuentan puntos de examen.' },
        { id: 'c', text: 'El gobierno es permanente y el régimen dura 4 años.', isCorrect: false, explanation: 'Al revés. El Estado es permanente, el régimen tiene estabilidad normativa y el gobierno es transitorio.' },
      ]
    },
    {
      id: 'hq-3',
      statement: '¿Qué característica define a la "Poliarquía" en la obra clásica de Robert Dahl?',
      options: [
        { id: 'a', text: 'Combinación simultánea de debate público abierto y alta inclusividad ciudadana.', isCorrect: true, explanation: 'Brillante. Para Dahl, la poliarquía es la aproximación real factible a la democracia ideal.' },
        { id: 'b', text: 'El gobierno exclusivo de los militares con aval corporativo.', isCorrect: false, explanation: 'Incorrecto. Eso define un régimen autoritario burocrático-autoritario.' },
        { id: 'c', text: 'Un sistema con voto cantado y proscripciones políticas.', isCorrect: false, explanation: 'Incorrecto. Si hay proscripción, Dahl lo clasifica como Oligarquía Competitiva.' },
      ]
    }
  ];
};
