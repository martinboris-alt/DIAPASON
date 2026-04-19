export type BlockType = "h2" | "h3" | "p" | "ul" | "ol" | "quote" | "callout";

export interface Block {
  type: BlockType;
  text?: string;        // para h2, h3, p, quote, callout
  items?: string[];     // para ul, ol
}

export interface Article {
  slug:        string;
  title:       string;
  description: string;  // meta description para Google
  summary:     string;  // resumen para el índice
  category:    "Mantenimiento" | "Guía de compra" | "Historia" | "Técnica";
  keywords:    string[];
  readTime:    number;  // minutos estimados
  publishedAt: string;  // YYYY-MM-DD
  updatedAt?:  string;
  blocks:      Block[];
}

export const articles: Article[] = [
  {
    slug: "cada-cuanto-afinar-piano",
    title: "¿Cada cuánto se debe afinar un piano? Guía completa 2026",
    description: "Descubre la frecuencia ideal de afinación de tu piano según el uso, el clima y la edad del instrumento. Recomendaciones de un afinador profesional en Chile.",
    summary: "La frecuencia de afinación depende de factores que van más allá del calendario. Explicamos cuándo afinar, por qué y qué pasa si no lo haces.",
    category: "Mantenimiento",
    keywords: ["afinación piano", "cada cuanto afinar piano", "frecuencia afinación", "mantenimiento piano Chile"],
    readTime: 6,
    publishedAt: "2026-04-15",
    blocks: [
      { type: "p", text: "Una de las preguntas más frecuentes que recibo como afinador de pianos es también una de las más importantes: ¿con qué frecuencia debo afinar mi piano? La respuesta corta es una o dos veces al año, pero la respuesta larga depende de varios factores que todo propietario de un piano debería conocer." },

      { type: "h2", text: "La recomendación estándar" },
      { type: "p", text: "Los principales fabricantes —Steinway, Yamaha, Kawai— coinciden en su recomendación oficial: afinar el piano al menos dos veces al año. Esta frecuencia es la que mantiene el instrumento en condiciones óptimas para un uso doméstico habitual. Algunos fabricantes, como Steinway, llegan a recomendar hasta cuatro afinaciones anuales durante los primeros dos años de vida del instrumento, debido al asentamiento natural de las cuerdas nuevas." },

      { type: "h2", text: "Factores que alteran la frecuencia ideal" },
      { type: "p", text: "Aunque el calendario marque seis meses, hay condiciones reales que pueden exigir afinaciones más frecuentes:" },
      { type: "ul", items: [
        "Cambios bruscos de temperatura y humedad (Santiago tiene grandes oscilaciones térmicas entre estaciones).",
        "Uso intensivo: si practicas varias horas al día, las cuerdas se desafinan más rápido.",
        "Edad del piano: instrumentos nuevos o muy antiguos requieren más atención.",
        "Traslados recientes: después de mover un piano, siempre hay que esperar 2-3 semanas antes de afinarlo y luego hacerlo.",
        "Ambiente cerca de fuentes de calor, ventanas, aire acondicionado o calefacción directa.",
      ] },

      { type: "h2", text: "El clima chileno y tu piano" },
      { type: "p", text: "Chile presenta un desafío particular para los pianos. La zona central tiene una humedad relativa que fluctúa entre el 30% en verano y el 80% en invierno. El piano está construido en madera, y la madera respira con la humedad: se expande cuando hay humedad alta y se contrae cuando hay aire seco. Este movimiento altera la tensión de las cuerdas sobre la tabla armónica." },
      { type: "callout", text: "Regla práctica para Chile: una afinación al inicio del otoño (marzo–abril) y otra al inicio de la primavera (septiembre–octubre). Los dos momentos del año en los que el clima cambia más rápido." },

      { type: "h2", text: "¿Qué pasa si no afino mi piano?" },
      { type: "p", text: "Un piano puede estar sin afinar años sin 'romperse', pero las consecuencias son reales:" },
      { type: "ul", items: [
        "Pérdida de tono: las cuerdas bajan de tensión lentamente y el piano suena 'triste'.",
        "Daño al oído musical: un niño que aprende con un piano desafinado desarrolla un oído incorrecto.",
        "Reparación más costosa: un piano muy desafinado necesita 'subida gradual' (pitch raise), que puede requerir dos visitas del afinador.",
        "Estrés en el instrumento: el paso de una afinación A=435 Hz a A=440 Hz de golpe puede tensionar cuerdas viejas y causar roturas.",
      ] },

      { type: "h2", text: "Señales de que tu piano necesita afinación" },
      { type: "p", text: "Aunque no hayas pasado aún seis meses desde la última visita, hay señales claras de que tu piano necesita atención:" },
      { type: "ol", items: [
        "Escuchas batimientos o 'temblores' en las notas sostenidas.",
        "Los acordes suenan ásperos, no 'limpios'.",
        "Notas que antes sonaban bien ahora suenan 'raras'.",
        "El piano suena notablemente más grave o más agudo que otros instrumentos.",
        "Has trasladado el piano o ha habido un cambio climático fuerte.",
      ] },

      { type: "h2", text: "Mi recomendación profesional" },
      { type: "p", text: "Después de más de una década afinando pianos en Chile, mi consejo es claro: establece una rutina. Agenda tu afinación como agendas la revisión del auto. Dos visitas al año, separadas aproximadamente seis meses, es el punto óptimo entre cuidado del instrumento y coste. Un piano bien mantenido conserva su valor durante décadas y es un placer tocarlo cada día." },

      { type: "quote", text: "Un piano afinado no es un lujo, es la única manera de que el instrumento haga lo que fue diseñado para hacer: sonar." },
    ],
  },

  {
    slug: "cuanto-cuesta-afinar-piano-chile",
    title: "¿Cuánto cuesta afinar un piano en Chile? Guía de precios 2026",
    description: "Análisis de los precios de afinación de piano en Chile: qué incluye, qué factores lo afectan y cómo elegir un afinador profesional. Precios actualizados.",
    summary: "Los precios de afinación en Chile varían mucho. Te explico qué incluye un servicio profesional y qué hay que tener en cuenta para contratarlo.",
    category: "Guía de compra",
    keywords: ["precio afinación piano Chile", "cuánto cuesta afinar piano", "afinador piano Santiago", "tarifas afinación"],
    readTime: 5,
    publishedAt: "2026-03-22",
    blocks: [
      { type: "p", text: "Una consulta habitual al agendar el primer servicio es: ¿cuánto cuesta? En Chile, los precios de afinación varían considerablemente según el afinador, la zona y el estado del piano. Te explico lo que deberías esperar como cliente informado." },

      { type: "h2", text: "Rango de precios en Chile (2026)" },
      { type: "p", text: "Para una afinación estándar en vivienda particular, los precios suelen situarse entre los 50.000 y los 90.000 pesos chilenos, dependiendo de la región, el tipo de piano y el afinador." },
      { type: "ul", items: [
        "Afinación estándar piano vertical: $50.000 – $70.000 CLP",
        "Afinación piano de cola doméstico: $70.000 – $90.000 CLP",
        "Afinación pitch raise (cuando el piano lleva mucho sin afinarse): $90.000 – $150.000 CLP",
        "Afinación de piano de concierto: $100.000+ CLP",
      ] },

      { type: "h2", text: "¿Qué incluye un servicio profesional?" },
      { type: "p", text: "Un afinador profesional hace mucho más que apretar clavijas. Un servicio completo debería incluir:" },
      { type: "ol", items: [
        "Evaluación inicial del estado del instrumento (10-15 min).",
        "Medición del pitch actual vs A=440 Hz estándar.",
        "Afinación nota por nota con técnica igual temperamento.",
        "Revisión y ajuste suave del mecanismo si es necesario.",
        "Limpieza superficial del interior (polvo, etc.).",
        "Informe verbal del estado general y recomendaciones.",
      ] },

      { type: "h2", text: "Factores que modifican el precio" },
      { type: "p", text: "Si un presupuesto te parece especialmente bajo o alto, probablemente influye uno de estos factores:" },
      { type: "ul", items: [
        "Zona geográfica (desplazamiento a regiones puede sumar costo).",
        "Marca y tamaño del piano (un Steinway de cola requiere más tiempo y cuidado).",
        "Tiempo sin afinar (si el piano ha caído mucho de tono, requiere pitch raise).",
        "Estado del mecanismo (teclas que se pegan, pedales que no funcionan, etc.).",
        "Hora y día del servicio (algunos afinadores cobran extra por noches o fines de semana).",
      ] },

      { type: "h2", text: "Señales de alarma en un presupuesto" },
      { type: "p", text: "Cuidado con presupuestos extremadamente bajos. La afinación profesional es un trabajo artesanal que requiere años de formación y herramientas especializadas. Un precio de $25.000 o menos suele indicar:" },
      { type: "ul", items: [
        "Afinador sin formación técnica (puede dañar el piano).",
        "Servicio apresurado (una afinación correcta toma entre 1,5 y 2,5 horas).",
        "No incluye evaluación ni ajustes del mecanismo.",
        "Sin garantía profesional.",
      ] },

      { type: "h2", text: "¿Vale la pena el coste?" },
      { type: "p", text: "Un piano es una inversión que puede conservar o incluso aumentar su valor con el tiempo, pero solo si se mantiene bien. El coste anual de afinarlo dos veces (aproximadamente $120.000-$180.000 CLP) es insignificante comparado con el valor del instrumento (desde $1.5 millones para un vertical usado hasta decenas de millones para un piano de cola). Además, un piano desafinado pierde valor musical y sentimental de forma rápida." },

      { type: "callout", text: "Mi consejo: contrata a un afinador con formación técnica verificable, que te explique lo que hace y te deje un informe del estado del piano. No es el servicio más barato, es el que te ahorra problemas futuros." },
    ],
  },

  {
    slug: "comprar-piano-usado-guia",
    title: "Cómo comprar un piano usado sin equivocarte: guía completa",
    description: "Todo lo que necesitas saber antes de comprar un piano de segunda mano: qué revisar, qué marcas elegir, señales de alarma y cómo evaluar el precio.",
    summary: "Comprar un piano usado puede ser una gran decisión o un desastre económico. Te explico cómo evaluarlo como un profesional.",
    category: "Guía de compra",
    keywords: ["comprar piano usado Chile", "piano segunda mano", "guía compra piano", "evaluar piano usado"],
    readTime: 8,
    publishedAt: "2026-02-18",
    blocks: [
      { type: "p", text: "Comprar un piano usado puede ser una oportunidad extraordinaria: instrumentos que costaron millones nuevos se venden por una fracción de su precio años después. Pero también puede ser una trampa cara. Como afinador profesional, he evaluado cientos de pianos para compradores potenciales y estos son los puntos clave que debes revisar." },

      { type: "h2", text: "Antes de ir a ver el piano" },
      { type: "p", text: "Infórmate sobre la marca y el modelo. No es lo mismo un Yamaha de los años 80 (muy buenos) que uno de los años 2000 fabricado en China (variables). Un Bechstein alemán anterior a 1930 puede ser una joya o un proyecto de restauración costoso. La marca y el año son determinantes." },
      { type: "callout", text: "Regla general: un piano fabricado en Alemania, Japón o Estados Unidos entre 1960 y 2000 por una marca reconocida es, estadísticamente, una compra segura si está bien conservado." },

      { type: "h2", text: "Revisión externa" },
      { type: "p", text: "Fija tu atención en aspectos que revelan el cuidado previo:" },
      { type: "ul", items: [
        "Mueble: arañazos superficiales son normales, pero evita pianos con hinchazón de la madera, manchas de humedad o daños estructurales.",
        "Teclas: mira si están desgastadas de forma uniforme (uso normal) o hay teclas claramente más amarillas (puede indicar exposición al sol).",
        "Pedales: deben moverse con resistencia consistente, sin ruidos.",
        "Tapa armónica: abre el piano y revisa si hay grietas en la gran tabla de madera interior. Cualquier grieta es una alarma seria.",
      ] },

      { type: "h2", text: "Revisión del mecanismo" },
      { type: "p", text: "Aquí es donde se esconden los problemas caros. Toca TODAS las teclas, una por una, en diferentes dinámicas:" },
      { type: "ol", items: [
        "¿Todas las teclas suben después de presionarse? Teclas que se quedan abajo indican problemas de mecanismo.",
        "¿El sonido es uniforme en todo el registro? Notas que suenan 'muertas' indican cuerdas rotas o apagadores dañados.",
        "¿Hay notas dobles o 'quejidos'? Pueden indicar martillos desalineados.",
        "Presiona cada pedal: el derecho (sustain) debe levantar todos los apagadores, el izquierdo (una corda) debe desplazar el mecanismo, el central tiene función variable.",
      ] },

      { type: "h2", text: "El interior: lo que realmente importa" },
      { type: "p", text: "Pide permiso para abrir el piano completamente (quitar la tapa frontal). Revisa:" },
      { type: "ul", items: [
        "Cuerdas: no deben tener óxido visible. Algo de pátina es normal; óxido rojo intenso indica almacenamiento en lugar húmedo.",
        "Martillos: los fieltros deben tener forma ovalada definida. Si están muy aplastados o con surcos profundos, necesitarán ajuste o reemplazo.",
        "Marco de hierro (arpa): busca grietas en el metal. Una grieta en el arpa es una condena: el piano es irreparable.",
        "Clavijas: deben estar bien ajustadas. Si algunas bailan, el clavijero podría necesitar reemplazo (reparación muy costosa).",
      ] },

      { type: "h2", text: "La prueba definitiva: afinabilidad" },
      { type: "p", text: "Un piano que lleva años sin afinarse suena mal, pero eso no significa necesariamente que esté 'dañado'. La verdadera pregunta es: ¿puede afinarse? Aquí es donde contratar a un afinador para que lo evalúe antes de comprar vale cada peso." },
      { type: "callout", text: "Un servicio de evaluación pre-compra cuesta entre $50.000 y $80.000 CLP, pero puede ahorrarte pérdidas de millones en un piano irrecuperable." },

      { type: "h2", text: "Marcas recomendadas para segunda mano" },
      { type: "p", text: "Por experiencia, las marcas que mejor envejecen son:" },
      { type: "ul", items: [
        "Yamaha U-series (U1, U3): verticales japoneses, 30-40 años después siguen sonando excelentes.",
        "Kawai K-series: similar calidad a Yamaha con un sonido ligeramente más dulce.",
        "Steinway & Sons: cualquier modelo y cualquier época, con restauración adecuada.",
        "Bechstein, Blüthner, Bösendorfer: marcas europeas históricas, excelentes si están conservadas.",
        "Petrof (checo): buena relación calidad-precio, robustos.",
      ] },

      { type: "h2", text: "Qué evitar" },
      { type: "p", text: "Algunos pianos usados son casi seguro una mala compra:" },
      { type: "ul", items: [
        "Pianos chinos anónimos de los años 90-2000 (calidad muy variable).",
        "Pianos que han estado en garajes, bodegas o zonas húmedas.",
        "Pianos con cuerdas nuevas mezcladas con cuerdas originales (indica roturas repetidas).",
        "Pianos digitales vendidos como acústicos (algunos modelos híbridos confunden).",
      ] },

      { type: "h2", text: "Negociación del precio" },
      { type: "p", text: "Un piano usado debería costar entre el 30% y el 50% de su precio nuevo, dependiendo de la edad y el estado. Un Yamaha U1 nuevo cuesta aproximadamente 8 millones; uno de 20 años en buen estado vale entre 2.5 y 4 millones. Usa estas referencias como punto de partida." },
    ],
  },

  {
    slug: "piano-vertical-vs-piano-cola",
    title: "Piano vertical vs piano de cola: ¿cuál elegir?",
    description: "Análisis comparativo entre pianos verticales y pianos de cola: mecánica, sonido, espacio, precio y cuál se adapta mejor a tu caso.",
    summary: "La decisión entre un vertical y un cola va más allá del espacio disponible. Te explico las diferencias técnicas y cómo elegir.",
    category: "Guía de compra",
    keywords: ["piano vertical vs cola", "diferencias piano cola vertical", "que piano elegir", "piano de cola doméstico"],
    readTime: 5,
    publishedAt: "2026-02-02",
    blocks: [
      { type: "p", text: "Si estás considerando comprar un piano, una de las primeras decisiones es elegir entre un vertical (piano de pared) y un piano de cola. La respuesta depende de factores que van más allá del espacio disponible." },

      { type: "h2", text: "Diferencia mecánica fundamental" },
      { type: "p", text: "En un piano vertical, las cuerdas son verticales y el mecanismo golpea los martillos hacia adelante horizontalmente. Después del golpe, los martillos regresan a su posición por la acción de muelles. En un piano de cola, las cuerdas son horizontales y los martillos golpean hacia arriba. Después del golpe, regresan por gravedad." },
      { type: "p", text: "Esta diferencia tiene una consecuencia enorme: el piano de cola tiene repetición natural más rápida. Puedes tocar la misma nota más rápido porque el martillo vuelve antes. Para música virtuosa (Chopin, Liszt, Rachmaninoff) la diferencia es notable." },

      { type: "h2", text: "Calidad sonora" },
      { type: "p", text: "El piano de cola produce un sonido objetivamente superior por tres razones técnicas:" },
      { type: "ul", items: [
        "Cuerdas más largas (hasta 2.80m en un cola de concierto vs 1.20m en un vertical) producen un bajo más rico.",
        "Tabla armónica más grande amplifica con más profundidad.",
        "Proyección del sonido es horizontal (hacia el intérprete y la sala), no vertical hacia la pared.",
      ] },

      { type: "h2", text: "Espacio requerido" },
      { type: "p", text: "Esta es la limitación más obvia:" },
      { type: "ul", items: [
        "Piano vertical: 150 cm de ancho × 60 cm de fondo (+ espacio para el banquillo).",
        "Baby grand (1/4 de cola): 150 cm × 150 cm aproximadamente.",
        "Piano de cola de salón: 170-200 cm × 150 cm.",
        "Piano de cola de concierto: 270-308 cm × 160 cm.",
      ] },
      { type: "p", text: "Para un departamento urbano chileno, un vertical es casi siempre la opción práctica. Para una casa con sala amplia, un baby grand puede caber sin dificultad." },

      { type: "h2", text: "Precio" },
      { type: "p", text: "Rangos aproximados en Chile (2026) para instrumentos nuevos:" },
      { type: "ul", items: [
        "Vertical de estudio (Yamaha B, Kawai ST): $3-5 millones CLP.",
        "Vertical profesional (Yamaha U1/U3): $7-10 millones CLP.",
        "Baby grand japonés: $12-18 millones CLP.",
        "Piano de cola europeo de concierto: $30 millones+ CLP.",
      ] },

      { type: "h2", text: "¿Cuándo vale la pena un cola?" },
      { type: "p", text: "Un piano de cola tiene sentido si:" },
      { type: "ol", items: [
        "Tocas o estudias repertorio virtuoso (conservatorio, carrera musical).",
        "Tienes el espacio físico adecuado.",
        "Presupuesto que permita la compra inicial y el mantenimiento (un cola requiere más afinaciones).",
        "Te importa la estética (un piano de cola es una pieza visualmente imponente).",
      ] },

      { type: "h2", text: "¿Cuándo es mejor un vertical?" },
      { type: "ol", items: [
        "Para aprendizaje hasta nivel medio, un buen vertical cubre todas las necesidades.",
        "Espacio doméstico limitado.",
        "Presupuesto acotado.",
        "Uso principalmente como instrumento doméstico, no de concierto.",
      ] },

      { type: "callout", text: "Mi consejo: un Yamaha U1 vertical bien afinado supera a cualquier baby grand de marca desconocida. No sacrifiques marca por tamaño." },
    ],
  },

  {
    slug: "humedad-piano-chile",
    title: "Humedad y tu piano en Chile: guía de conservación",
    description: "Cómo afecta la humedad al piano en el clima chileno y qué medidas tomar para conservarlo en condiciones óptimas todo el año.",
    summary: "La madera del piano respira con el ambiente. Aprende a proteger tu instrumento de los cambios climáticos de Chile.",
    category: "Mantenimiento",
    keywords: ["humedad piano Chile", "clima piano", "cuidado piano", "conservación piano"],
    readTime: 4,
    publishedAt: "2026-01-10",
    blocks: [
      { type: "p", text: "El peor enemigo del piano no es el uso. Es la humedad. Un piano de $10 millones puede arruinarse en pocos años en una habitación con las condiciones equivocadas. Y Chile, con sus cambios estacionales y su geografía larga, presenta condiciones muy variables." },

      { type: "h2", text: "La humedad ideal: entre 40% y 60%" },
      { type: "p", text: "Los principales fabricantes recomiendan mantener el piano entre 40% y 60% de humedad relativa. Por debajo del 30%, la madera se seca y se contrae: el clavijero se afloja, las cuerdas pierden tensión, el mueble puede agrietarse. Por encima del 70%, la humedad hace que la madera se hinche: los martillos se 'atascan', el mecanismo se vuelve pesado, y el óxido ataca las cuerdas." },

      { type: "h2", text: "Chile: clima variable por zona" },
      { type: "p", text: "Las condiciones cambian mucho según dónde vivas:" },
      { type: "ul", items: [
        "Santiago y zona central: inviernos húmedos (60-80%) y veranos secos (30-40%). Los pianos sufren con las oscilaciones.",
        "Valparaíso y costa: humedad alta y constante, riesgo de oxidación en las cuerdas.",
        "Norte (Antofagasta, La Serena): muy seco. El riesgo es la contracción de la madera.",
        "Sur (Temuco, Puerto Montt): humedad alta casi todo el año. Óxido y hongos son las preocupaciones.",
      ] },

      { type: "h2", text: "Reglas de oro para proteger tu piano" },
      { type: "ol", items: [
        "Nunca lo coloques cerca de una ventana con sol directo (la luz solar seca y daña el barniz).",
        "Mantén mínimo un metro de distancia de estufas, radiadores o aire acondicionado.",
        "Evita paredes exteriores frías (condensación).",
        "No lo sitúes cerca de la cocina (vapor + grasa).",
        "En pisos con piso radiante, eleva el piano con tacos de madera o pies aislantes.",
      ] },

      { type: "h2", text: "Soluciones activas para controlar la humedad" },
      { type: "p", text: "Si la habitación tiene condiciones difíciles de controlar, hay dos caminos:" },
      { type: "ul", items: [
        "Humidificador / deshumidificador de ambiente: regula la habitación entera. Es la opción más saludable también para las personas.",
        "Sistema Dampp-Chaser: un dispositivo instalado dentro del piano que mantiene la humedad estable alrededor del instrumento. Cuesta entre $400.000 y $600.000 CLP instalado, pero duplica la vida útil del piano.",
      ] },

      { type: "callout", text: "Invertir en un higrómetro digital ($10.000-20.000 CLP) es la mejor compra pequeña que puedes hacer por tu piano. Así sabes exactamente las condiciones de tu sala." },

      { type: "h2", text: "Señales de que la humedad está afectando tu piano" },
      { type: "ul", items: [
        "Teclas que se quedan abajo o no retornan (humedad alta).",
        "Notas que 'desafinan' entre visitas del afinador aunque no hayas movido el piano.",
        "Ruidos metálicos o crujidos internos (madera trabajando).",
        "Óxido visible en las cuerdas (humedad persistente).",
        "Barniz del mueble que se opaca o se resquebraja (aire muy seco).",
      ] },
    ],
  },

  {
    slug: "historia-piano-chile",
    title: "Historia del piano en Chile: del Siglo XIX al presente",
    description: "Un recorrido por la historia del piano en Chile: las primeras importaciones, los grandes salones musicales y los pianistas que marcaron la tradición.",
    summary: "El piano llegó a Chile en el siglo XIX y se convirtió en el centro de la vida cultural. Esta es su historia.",
    category: "Historia",
    keywords: ["historia piano Chile", "música Chile", "pianistas chilenos", "Claudio Arrau"],
    readTime: 6,
    publishedAt: "2025-12-05",
    blocks: [
      { type: "p", text: "El piano llegó a Chile a mediados del siglo XIX, transportado desde Europa en barcos que tardaban meses en rodear el Cabo de Hornos. En pocas décadas se convirtió en el instrumento más importante de la vida musical chilena: toda casa acomodada tenía uno, y aprender a tocar era parte esencial de la educación de los jóvenes." },

      { type: "h2", text: "Las primeras importaciones" },
      { type: "p", text: "Los primeros pianos en llegar a Chile fueron instrumentos franceses —Pleyel, Érard— y británicos —Broadwood, Collard—. Hacia 1870, Santiago ya tenía varias tiendas de pianos importados y profesores europeos que venían a enseñar. Valparaíso, como puerto principal, era el epicentro comercial." },

      { type: "h2", text: "El Teatro Municipal y la élite musical" },
      { type: "p", text: "El Teatro Municipal de Santiago (1857) se convirtió en el epicentro de los conciertos de piano. Concertistas europeos famosos viajaban hasta Sudamérica para tocar en sus salones. En 1902, una joven pianista chilena de apenas nueve años dio un recital en este teatro y asombró a la crítica: su nombre era Rosita Renard." },

      { type: "h2", text: "Claudio Arrau: el gigante de Chillán" },
      { type: "p", text: "La figura más importante de la historia pianística chilena es Claudio Arrau (1903-1991), considerado uno de los más grandes pianistas del siglo XX. Nacido en Chillán, fue declarado prodigio a los cinco años. Su tío lo llevó a Alemania con una beca del gobierno, donde estudió con Martin Krause, último alumno directo de Franz Liszt. Arrau vivió entre Estados Unidos y Europa, pero siempre se identificó como chileno." },
      { type: "quote", text: "Mi patria es el piano. — Claudio Arrau" },

      { type: "h2", text: "Pianistas chilenas de referencia" },
      { type: "p", text: "Chile ha dado al mundo varias pianistas extraordinarias:" },
      { type: "ul", items: [
        "Rosita Renard (1894-1949): primera concertista chilena de fama internacional.",
        "Claudio Arrau (1903-1991): discípulo de Liszt por dos generaciones, leyenda mundial.",
        "Óscar Gacitúa (1925-2012): fundamental en la pedagogía pianística chilena.",
        "Alfredo Perl (1965-): concertista contemporáneo activo en Europa.",
      ] },

      { type: "h2", text: "La tradición actual" },
      { type: "p", text: "Hoy Chile tiene escuelas de piano de excelencia en la Universidad de Chile, el Conservatorio Nacional y varias universidades regionales. Los concursos internacionales reciben año tras año a participantes chilenos. La vida pianística del país sigue siendo intensa, aunque el instrumento ha perdido la centralidad doméstica que tuvo hace cien años." },

      { type: "h2", text: "El patrimonio de pianos en Chile" },
      { type: "p", text: "Muchas familias chilenas conservan pianos europeos de finales del siglo XIX o principios del XX. Son instrumentos que, con restauración adecuada, pueden volver a sonar extraordinariamente. Un Bechstein o un Steinway de 1920 bien conservado es un verdadero patrimonio histórico, además de un excelente instrumento musical." },

      { type: "callout", text: "Si tienes un piano antiguo en tu familia, no lo descartes. Pide una evaluación profesional: muchos pianos históricos chilenos son recuperables y tienen un valor sentimental y musical enorme." },
    ],
  },
];
