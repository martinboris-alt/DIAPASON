export interface Hito {
  anio:   number | string;
  evento: string;
}

export interface Modelo {
  nombre:      string;
  tipo:        string;   // "Vertical" | "Cola" | "Concierto" | etc.
  descripcion: string;
  emblematico?: boolean;
}

export interface MarcaPiano {
  id:             string;
  nombre:         string;
  fundacion:      number;
  cese?:          number;
  pais:           string;
  ciudad:         string;
  fundador:       string;
  lema:           string;
  /** resumen breve para índices */
  resumen:        string;
  /** primer párrafo, introducción narrativa */
  historia:       string;
  /** párrafos adicionales con más detalle */
  historiaExtensa: string[];
  /** descripción del sonido característico */
  sonido:         string;
  /** proceso de fabricación */
  fabricacion:    string;
  innovaciones:   string[];
  hitos:          Hito[];
  modelos:        Modelo[];
  usuarios:       string[];
  curiosidades:   string[];
  /** rango aproximado de precio nuevo */
  precioRango?:   string;
  /** producción anual aproximada */
  produccionAnual?: string;
  webOficial?:    string;
  color:          string;
  acento:         string;
  emblema:        string;
  logo:           string;
}

export const marcas: MarcaPiano[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "steinway",
    nombre: "Steinway & Sons",
    fundacion: 1853,
    pais: "Estados Unidos / Alemania",
    ciudad: "Nueva York · Hamburgo",
    fundador: "Heinrich Engelhard Steinweg",
    lema: "The Instrument of the Immortals",
    resumen: "El fabricante de pianos más prestigioso del mundo. El 97% de los solistas que actúan con orquestas sinfónicas eligen un Steinway.",
    historia: "Fundada por el luthier alemán Heinrich Engelhard Steinweg en Nueva York en 1853, Steinway revolucionó la fabricación de pianos con más de 125 patentes técnicas registradas a lo largo de su historia. La casa es hoy el referente absoluto del piano de concierto mundial.",
    historiaExtensa: [
      "Steinweg emigró de Alemania a Estados Unidos en 1850 tras la revolución de 1848, buscando mejores condiciones económicas. Llegó a Nueva York con 56 años y, junto a cuatro de sus hijos, fundó Steinway & Sons en un pequeño taller de Manhattan. En apenas una década transformaron la industria.",
      "La innovación más decisiva llegó en 1859 con la patente del 'cruzado completo de cuerdas' (overstrung scale), que permitió crear pianos con cuerdas más largas en un mismo espacio, consiguiendo un sonido más rico y profundo. Esta técnica es hoy estándar en todos los pianos de cola del mundo.",
      "En 1880 abrieron una segunda fábrica en Hamburgo para servir al mercado europeo. Las dos fábricas —Queens en Nueva York y Hamburgo— siguen operativas hoy, cada una con su propia identidad sonora. Los pianistas experimentados distinguen fácilmente entre un 'New York Steinway' y un 'Hamburg Steinway'.",
      "Durante el siglo XX, Steinway se convirtió en sinónimo del piano de concierto. Cada sala importante del mundo —Carnegie Hall, Suntory Hall, Musikverein— tiene su Steinway D-274 listo para los grandes solistas. La lista de 'Steinway Artists' incluye a los nombres más importantes de la pianística mundial.",
    ],
    sonido: "El sonido Steinway combina potencia, claridad y una riqueza armónica inigualable. El modelo neoyorquino tiende a un timbre más brillante y directo; el hamburgués, a un sonido más redondo y europeo. Ambos tienen una proyección extraordinaria que los hace ideales para salas de concierto grandes.",
    fabricacion: "Cada Steinway se fabrica a mano durante aproximadamente 11 meses. El proceso incluye el curvado del arco (rim) con más de 17 capas de arce, el asentamiento de la tabla armónica durante meses y el ajuste nota a nota del mecanismo. Una fábrica produce alrededor de 1.500 pianos al año, muy por debajo de los ~100.000 de Yamaha.",
    innovaciones: [
      "Tabla armónica de abeto curvada con prensa hidráulica (1860)",
      "Cruzado completo de cuerdas (1859) — estándar mundial hoy",
      "Marco de hierro de una sola pieza",
      "Acción de repetición Capo d'Astro",
      "Sistema Spirio: piano de alta fidelidad con playback digital integrado (2015)",
    ],
    hitos: [
      { anio: 1853, evento: "Fundación en Nueva York por Heinrich Engelhard Steinweg" },
      { anio: 1859, evento: "Patente del cruzado completo de cuerdas" },
      { anio: 1880, evento: "Apertura de la fábrica de Hamburgo" },
      { anio: 1903, evento: "Entrega del piano número 100.000 a la Casa Blanca" },
      { anio: 1938, evento: "Entrega del piano 300.000 a Franklin D. Roosevelt" },
      { anio: 2015, evento: "Lanzamiento del sistema Spirio" },
      { anio: 2022, evento: "Entrega del piano 600.000" },
    ],
    modelos: [
      { nombre: "Model D-274", tipo: "Cola de concierto", descripcion: "El piano de concierto por excelencia. 274 cm de largo. Usado en prácticamente todas las grandes salas del mundo.", emblematico: true },
      { nombre: "Model B-211", tipo: "Cola de salón", descripcion: "Un compañero habitual para pianistas profesionales en casa. 211 cm.", emblematico: true },
      { nombre: "Model M-170", tipo: "Baby grand", descripcion: "El cola más pequeño de Steinway, popular para espacios domésticos amplios." },
      { nombre: "K-52", tipo: "Vertical profesional", descripcion: "El vertical de referencia de Steinway, usado en conservatorios." },
    ],
    usuarios: [
      "Arthur Rubinstein", "Vladimir Horowitz", "Glenn Gould", "Sergei Rachmaninoff",
      "Martha Argerich", "Krystian Zimerman", "Lang Lang", "Daniil Trifonov", "Yuja Wang",
    ],
    curiosidades: [
      "Steinway es el único fabricante cuyos pianos cuentan los golpes de martillo: cada tecla recibe aproximadamente 12.000 golpes antes de considerarse 'asentada'.",
      "La familia Steinway cambió su apellido de Steinweg a 'Steinway' al mudarse a Estados Unidos por razones comerciales.",
      "En 2013, la marca fue adquirida por el fondo de inversión Paulson & Co. por 512 millones de dólares.",
      "El pianista Krystian Zimerman viaja siempre con su propio Steinway adaptado a su técnica personal.",
    ],
    precioRango: "$80.000 – $200.000+ USD (cola)",
    produccionAnual: "~1.500 pianos/año",
    webOficial: "https://www.steinway.com",
    color: "#8B6914",
    acento: "#D4AF37",
    emblema: "/images/marcas/steinway.svg",
    logo: "/images/marcas/logos/steinway.svg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "bosendorfer",
    nombre: "Bösendorfer",
    fundacion: 1828,
    pais: "Austria",
    ciudad: "Viena",
    fundador: "Ignaz Bösendorfer",
    lema: "The Tone of Vienna",
    resumen: "La casa de pianos más antigua aún en actividad. Famosa por su Imperial Concert Grand de 97 teclas.",
    historia: "Bösendorfer es la más antigua de las grandes marcas de piano todavía en actividad, fundada en Viena en 1828 por Ignaz Bösendorfer. Su modelo Imperial Concert Grand es único en el mundo por sus 97 teclas —nueve más que el piano estándar—, una característica distintiva que lo convierte en un instrumento buscado por compositores y solistas.",
    historiaExtensa: [
      "La casa se hizo famosa gracias a Franz Liszt, el virtuoso que durante sus recitales destrozaba los pianos por su forma agresiva de tocar. En 1828, el joven Liszt usó un Bösendorfer durante un concierto especialmente exigente y el instrumento sobrevivió sin problemas. Desde ese día, Liszt se convirtió en embajador de la marca.",
      "En 1872 se inauguró la Bösendorfer-Saal en Viena, la sala de conciertos propia de la casa, que funcionó hasta 1913 y fue una de las más importantes de la vida musical vienesa.",
      "En 1909 Ludwig Bösendorfer, hijo del fundador, desarrolló junto al compositor Ferruccio Busoni el legendario Imperial Model 290 con 97 teclas, extendiendo el registro grave con nueve notas adicionales. Esta ampliación permite que las cuerdas resuenen por simpatía, creando una riqueza armónica única.",
      "La marca pasó a manos de la compañía Kimball (EE.UU.) en 1966, luego a BAWAG (Austria) y finalmente en 2008 a Yamaha Corporation, que mantiene la producción artesanal en Viena.",
    ],
    sonido: "Tono oscuro, cálido, con armónicos ricos en las notas graves gracias al registro extendido. Los músicos lo describen como 'más vocal' que el Steinway, ideal para música romántica y contemporánea.",
    fabricacion: "Cada Bösendorfer requiere aproximadamente 62 semanas de fabricación. La tabla armónica se construye con técnicas tradicionales vienesas —'jarig dried' de abeto durante al menos siete años— y cada unidad pasa por más de 1.700 procesos manuales.",
    innovaciones: [
      "Piano Imperial de 97 teclas (1909) — único en su categoría",
      "Tabla armónica construida como un instrumento tradicional vienés, no prensada",
      "Sistema Single-String de afinación exclusivo",
      "Enduro Tough Coat: recubrimiento moderno resistente al rayado",
    ],
    hitos: [
      { anio: 1828, evento: "Fundación por Ignaz Bösendorfer en Viena" },
      { anio: 1828, evento: "El Bösendorfer sobrevive a un concierto de Liszt → inicio de la fama" },
      { anio: 1830, evento: "Declarado proveedor oficial del emperador austriaco" },
      { anio: 1872, evento: "Inauguración de la sala de conciertos Bösendorfer-Saal" },
      { anio: 1909, evento: "Desarrollo del Imperial Model 290 con 97 teclas" },
      { anio: 2008, evento: "Adquisición por Yamaha Corporation" },
    ],
    modelos: [
      { nombre: "Imperial 290", tipo: "Cola de concierto", descripcion: "97 teclas, 290 cm. El piano con más registro grave del mundo.", emblematico: true },
      { nombre: "Grand 280VC", tipo: "Cola de concierto", descripcion: "Versión Vienna Concert de 88 teclas, tecnología actualizada." },
      { nombre: "Grand 200", tipo: "Cola de salón", descripcion: "Piano de cola doméstico premium con sonido característico vienés." },
      { nombre: "Piano 130", tipo: "Vertical", descripcion: "Vertical superior pensado para uso profesional." },
    ],
    usuarios: [
      "Franz Liszt", "Leonard Bernstein", "Oscar Peterson", "Friedrich Gulda",
      "András Schiff", "Tori Amos", "Paul Badura-Skoda",
    ],
    curiosidades: [
      "El Imperial Model 290 tiene las teclas extra en negro para evitar confundir al pianista.",
      "Beethoven conocía los primeros pianos de la casa (fundación un año después de su muerte), pero es Liszt quien popularizó la marca.",
      "Oscar Peterson eligió el Bösendorfer por su capacidad de resistir el golpeo intenso del jazz sin perder afinación.",
      "Se fabrican alrededor de 300 pianos al año, uno de los volúmenes más bajos de la industria.",
    ],
    precioRango: "$100.000 – $250.000+ USD (cola)",
    produccionAnual: "~300 pianos/año",
    webOficial: "https://www.boesendorfer.com",
    color: "#6B2C0B",
    acento: "#B8560C",
    emblema: "/images/marcas/bosendorfer.svg",
    logo: "/images/marcas/logos/bosendorfer.svg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "bechstein",
    nombre: "C. Bechstein",
    fundacion: 1853,
    pais: "Alemania",
    ciudad: "Berlín",
    fundador: "Carl Bechstein",
    lema: "Since 1853 · The sound of Europe",
    resumen: "Fundada el mismo año que Steinway, fue el piano favorito de Debussy y de la realeza europea.",
    historia: "Fundada en Berlín en 1853 por Carl Bechstein —el mismo año que Steinway en Nueva York—, Bechstein fue durante décadas el piano preferido de la realeza y aristocracia europea. Su sonido más cálido y lírico, con un ataque menos agresivo que el Steinway, lo convirtió en el favorito de Debussy y de la tradición pianística francesa y alemana.",
    historiaExtensa: [
      "Carl Bechstein fabricó su primer piano de cola en 1859 por encargo del pianista Hans von Bülow, quien lo usó para el estreno de la Sonata en Si menor de Franz Liszt. El éxito fue inmediato y Bechstein se convirtió en referencia europea.",
      "La 'Bechstein Saal' de Berlín, inaugurada en 1892, fue durante medio siglo el escenario más prestigioso de la capital alemana. Grandes pianistas como Rubinstein, Backhaus y Gieseking actuaron allí.",
      "Durante la Segunda Guerra Mundial, la fábrica de Berlín fue bombardeada y los nazis confiscaron gran parte de los instrumentos. Tras la guerra, la casa atravesó décadas difíciles hasta su recuperación bajo nuevos propietarios en los años 1990.",
      "Hoy la marca produce en Seifhennersdorf (Sajonia) y en República Checa, manteniendo el estándar artesanal alemán. Sus modelos superiores compiten al mismo nivel que Steinway en las principales salas europeas.",
    ],
    sonido: "Tono cálido, lírico, con un ataque suave y armónicos ricos en los medios. Debussy lo consideraba el instrumento ideal para su música. Los críticos lo describen como 'el sonido de la tradición alemana', contrapuesto al brillo más americano de Steinway.",
    fabricacion: "Las series C. Bechstein se fabrican completamente a mano en Alemania con aproximadamente 12.000 componentes por piano. El proceso de construcción dura 12 meses y cada instrumento es firmado por el maestro artesano responsable.",
    innovaciones: [
      "Primera acción moderna diseñada para repetición rápida (1866)",
      "Bechstein Concert Services con 100+ pianos de concierto en alquiler",
      "Tecnología Vario: piano de cola convertible a digital silencioso",
      "Bechstein Digital con sampling propio de sus pianos acústicos",
    ],
    hitos: [
      { anio: 1853, evento: "Fundación en Berlín por Carl Bechstein" },
      { anio: 1859, evento: "Primer piano de cola — encargo de Hans von Bülow" },
      { anio: 1892, evento: "Inauguración de la Bechstein Saal en Berlín" },
      { anio: 1901, evento: "Wigmore Hall de Londres: construido para Bechstein" },
      { anio: 1945, evento: "Fábrica de Berlín destruida en la guerra" },
      { anio: 1994, evento: "Refundación bajo propiedad de Karl Schulze" },
    ],
    modelos: [
      { nombre: "Concert D 282", tipo: "Cola de concierto", descripcion: "Cola de concierto de 282 cm, usado en salas europeas.", emblematico: true },
      { nombre: "Model B 212", tipo: "Cola de salón", descripcion: "Piano de cola profesional, 212 cm." },
      { nombre: "Model M/P 192", tipo: "Cola", descripcion: "Compacto pero con presencia de cola profesional." },
      { nombre: "Concert 8", tipo: "Vertical profesional", descripcion: "Vertical de alta gama, casi una 'cola en pared'." },
    ],
    usuarios: [
      "Claude Debussy", "Wilhelm Furtwängler", "Jorge Bolet", "Arthur Schnabel",
      "Wilhelm Kempff", "The Beatles (Abbey Road)",
    ],
    curiosidades: [
      "La reina Victoria de Inglaterra mantenía un Bechstein en el Palacio de Buckingham.",
      "Durante la era soviética, la Unión Soviética compraba grandes cantidades de Bechstein para sus conservatorios.",
      "La Bechstein Saal original de Londres, inaugurada en 1901, sigue activa hoy con el nombre de Wigmore Hall.",
      "Albert Einstein tocaba frecuentemente en un piano Bechstein vertical.",
    ],
    precioRango: "$50.000 – $180.000+ USD (cola)",
    produccionAnual: "~1.200 pianos/año",
    webOficial: "https://www.bechstein.com",
    color: "#2B3A55",
    acento: "#5D7AAD",
    emblema: "/images/marcas/bechstein.svg",
    logo: "/images/marcas/logos/bechstein.svg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "bluthner",
    nombre: "Blüthner",
    fundacion: 1853,
    pais: "Alemania",
    ciudad: "Leipzig",
    fundador: "Julius Blüthner",
    lema: "The Golden Tone",
    resumen: "Fabricante saxón célebre por su Aliquot Stringing —la cuarta cuerda simpática que crea el 'Golden Tone'.",
    historia: "Fundada en Leipzig en 1853 por Julius Blüthner, la casa saxona es célebre por su patente del Aliquot Stringing: una cuarta cuerda simpática que vibra por resonancia en el registro agudo, creando un timbre con armónicos extraordinariamente ricos conocido como el 'Golden Tone'. Fue el piano elegido por los Beatles para sus grabaciones de Abbey Road y por el Titanic para su salón de primera clase.",
    historiaExtensa: [
      "Leipzig era a mediados del siglo XIX uno de los centros musicales más importantes de Europa: ciudad de Bach, Mendelssohn y Schumann. En ese contexto cultural surge Blüthner.",
      "Julius Blüthner patentó en 1873 el sistema Aliquot: añadir una cuarta cuerda por nota en el registro agudo que no se golpea directamente pero vibra por resonancia. Este diseño simple pero ingenioso crea armónicos adicionales que enriquecen el timbre.",
      "En 1912, uno de los pianos de cola Blüthner más lujosos jamás construidos fue instalado en el RMS Titanic. Con la tragedia del barco, aquel instrumento descansa hoy en el fondo del Atlántico.",
      "La fábrica de Leipzig fue bombardeada durante la Segunda Guerra Mundial pero fue reconstruida. Bajo la RDA socialista, Blüthner siguió produciendo pianos de alta calidad que se exportaban por toda Europa oriental.",
      "Hoy Blüthner es una de las pocas fabricas europeas de pianos que continúa bajo la dirección familiar original —la quinta generación de Blüthners—, con producción completa en Leipzig.",
    ],
    sonido: "El característico 'Golden Tone' es cálido, con armónicos muy presentes que dan al sonido una cualidad casi vocal. Menos brillante que un Steinway pero con una profundidad emocional reconocible.",
    fabricacion: "Producción completamente artesanal en Leipzig. Cada Blüthner usa madera de abeto secada naturalmente entre 5 y 10 años antes de usarse. Los Aliquots se afinan una octava más alta que la nota principal para crear la resonancia.",
    innovaciones: [
      "Aliquot Stringing: cuarta cuerda simpática (1873) — exclusivo Blüthner",
      "Proceso de secado de maderas 5-10 años",
      "Piano vertical Lucid Hybrid con control digital integrado",
      "e-Klavier: línea de pianos digitales de alta gama",
    ],
    hitos: [
      { anio: 1853, evento: "Fundación en Leipzig por Julius Blüthner" },
      { anio: 1873, evento: "Patente del Aliquot Stringing" },
      { anio: 1900, evento: "Piano Blüthner para el Kaiser Wilhelm II" },
      { anio: 1912, evento: "Instalación del piano en el RMS Titanic" },
      { anio: 1943, evento: "Fábrica de Leipzig destruida en bombardeos" },
      { anio: 1948, evento: "Reconstrucción y reanudación bajo la RDA" },
      { anio: 1990, evento: "Regreso a la familia Blüthner tras la reunificación" },
    ],
    modelos: [
      { nombre: "Model 1", tipo: "Cola de concierto", descripcion: "Piano de cola de 280 cm, insignia actual de la casa.", emblematico: true },
      { nombre: "Model 4", tipo: "Cola de salón", descripcion: "Cola compacta de 185 cm, ideal para espacios domésticos grandes." },
      { nombre: "Model 11", tipo: "Vertical profesional", descripcion: "Vertical superior con Aliquot Stringing." },
      { nombre: "Lucid Hybrid", tipo: "Vertical híbrido", descripcion: "Primer vertical acústico con sonido digital integrado de fábrica." },
    ],
    usuarios: [
      "Béla Bartók", "The Beatles", "Elton John", "Arthur Rubinstein",
      "Sergei Rachmaninoff", "Claudio Arrau",
    ],
    curiosidades: [
      "El piano Blüthner del Titanic descansa en el fondo del océano desde 1912.",
      "Los Beatles usaron un Blüthner Model 11 vertical para 'Let It Be' y otras grabaciones de Abbey Road.",
      "En la URSS, Blüthner era considerado el piano de mayor prestigio occidental que se podía conseguir.",
      "La marca ha permanecido en manos de la familia Blüthner durante cinco generaciones —algo muy raro en la industria.",
    ],
    precioRango: "$45.000 – $160.000+ USD (cola)",
    produccionAnual: "~500 pianos/año",
    webOficial: "https://www.bluethner.com",
    color: "#7A5919",
    acento: "#C89B3B",
    emblema: "/images/marcas/bluthner.svg",
    logo: "/images/marcas/logos/bluthner.svg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fazioli",
    nombre: "Fazioli",
    fundacion: 1981,
    pais: "Italia",
    ciudad: "Sacile",
    fundador: "Paolo Fazioli",
    lema: "La perfección italiana",
    resumen: "La casa italiana más joven entre las grandes. Su F308 es el piano de cola más grande producido en serie del mundo.",
    historia: "Fundada en 1981 por el ingeniero y pianista Paolo Fazioli en la pequeña ciudad de Sacile, al norte de Italia, Fazioli es la casa más joven entre las grandes marcas de piano. Paolo Fazioli asumió el desafío explícito de crear 'el mejor piano de concierto del mundo', utilizando técnicas tradicionales combinadas con diseño moderno y materiales de altísima calidad.",
    historiaExtensa: [
      "Paolo Fazioli, ingeniero industrial y pianista formado en el Conservatorio de Pesaro, decidió en los años 70 que Italia debía tener una casa de pianos a la altura de su tradición musical. Durante seis años estudió cada aspecto técnico del piano antes de lanzar su primer instrumento.",
      "La elección de la madera fue crucial: Fazioli usa abeto del Val di Fiemme, el mismo bosque del que Antonio Stradivari eligió la madera para sus violines tres siglos antes. Los árboles se cortan en invierno, cuando la savia ha bajado, y se seca durante años antes de su uso.",
      "En 2007, Fazioli presentó el Model F308, un piano de cola de 308 cm —el más largo jamás producido en serie. Incluye un cuarto pedal único que modifica el mecanismo del 'una corda' con un ajuste más sutil.",
      "La producción de Fazioli es deliberadamente limitada: apenas 140-150 pianos al año, todos construidos a mano por un equipo reducido de artesanos. Cada instrumento pasa por un proceso de aprobación final del propio Paolo Fazioli.",
      "Hoy los Fazioli se encuentran en algunas de las salas más prestigiosas del mundo. Pianistas como Angela Hewitt han adoptado la marca de forma exclusiva y el reconocimiento crítico la sitúa al nivel de las grandes casas históricas.",
    ],
    sonido: "Sonido de gran presencia, claridad cristalina en el registro agudo y un bajo poderoso gracias a sus grandes dimensiones. Los pianistas lo describen como 'muy italiano': brillante, expresivo, con una proyección excepcional.",
    fabricacion: "Los 140 pianos anuales se fabrican en una fábrica-laboratorio en Sacile donde cada paso es controlado por artesanos especializados. La madera del Val di Fiemme, el marco diseñado por ingeniería industrial avanzada y el control de calidad obsesivo hacen de cada Fazioli un instrumento único.",
    innovaciones: [
      "Model F308: piano de cola de 308 cm, el más largo en serie del mundo",
      "Cuarto pedal que reduce el desplazamiento del martillo (una corda modulable)",
      "Madera de abeto del Val di Fiemme (la misma que Stradivari)",
      "Diseño asistido por computadora integrado con artesanía tradicional",
    ],
    hitos: [
      { anio: 1981, evento: "Fundación por Paolo Fazioli en Sacile" },
      { anio: 1988, evento: "Primer piano vendido a un artista internacional (Aldo Ciccolini)" },
      { anio: 2007, evento: "Lanzamiento del Model F308, el piano de cola más largo del mundo" },
      { anio: 2012, evento: "Inauguración del auditorio Fazioli en Sacile" },
      { anio: 2019, evento: "Angela Hewitt adopta Fazioli como su marca exclusiva" },
    ],
    modelos: [
      { nombre: "F308", tipo: "Cola de concierto extremo", descripcion: "308 cm, el piano de cola más grande producido en serie. Cuatro pedales.", emblematico: true },
      { nombre: "F278", tipo: "Cola de concierto", descripcion: "Versión de concierto estándar (278 cm) con tecnología Fazioli." },
      { nombre: "F212", tipo: "Cola profesional", descripcion: "Piano de cola de 212 cm, popular entre pianistas profesionales." },
      { nombre: "F156", tipo: "Baby grand", descripcion: "El más pequeño de Fazioli, 156 cm — aún con producción artesanal completa." },
    ],
    usuarios: [
      "Angela Hewitt", "Herbie Hancock", "Aldo Ciccolini", "Paul Lewis",
      "Louis Lortie", "Jean-Yves Thibaudet",
    ],
    curiosidades: [
      "El F308 incluye un cuarto pedal único: modifica la distancia del martillo a la cuerda sin cambiar el mecanismo.",
      "Cada Fazioli incluye un certificado firmado personalmente por Paolo Fazioli.",
      "El precio de un F308 ronda los $250.000 USD, uno de los más altos del mercado.",
      "Fazioli tiene un auditorio propio en su fábrica donde se celebran conciertos regulares con los modelos recién terminados.",
    ],
    precioRango: "$120.000 – $300.000+ USD (cola)",
    produccionAnual: "~140 pianos/año",
    webOficial: "https://www.fazioli.com",
    color: "#5B2A1E",
    acento: "#B85438",
    emblema: "/images/marcas/fazioli.svg",
    logo: "/images/marcas/logos/fazioli.svg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "yamaha",
    nombre: "Yamaha",
    fundacion: 1887,
    pais: "Japón",
    ciudad: "Hamamatsu",
    fundador: "Torakusu Yamaha",
    lema: "Artist Services · Made for Music",
    resumen: "El mayor fabricante de pianos del mundo. Democratizó el acceso al piano de calidad con precisión industrial japonesa.",
    historia: "Yamaha comenzó en 1887 cuando Torakusu Yamaha, un técnico japonés, reparó un armonio occidental y decidió construir uno propio. De aquella primera reparación nació la compañía más grande de pianos del mundo. Yamaha democratizó el acceso al piano de calidad con producción industrial de precisión japonesa.",
    historiaExtensa: [
      "Torakusu Yamaha observó cómo un armonio occidental se había averiado en una escuela local y, sin tener experiencia previa, logró repararlo. Esta fascinación lo llevó a fabricar su propio armonio en 1887, fundando Nippon Gakki Co. (Japan Musical Instruments).",
      "La compañía comenzó a fabricar pianos en 1900. Durante décadas fueron imitaciones de modelos europeos, pero la calidad mejoró rápidamente. En los años 1950-60, Yamaha desarrolló tecnologías propias y modelos originales.",
      "El punto de inflexión fue el lanzamiento del U1 en 1963: un piano vertical de 121 cm que ofrecía calidad profesional a precio accesible. El U1 se convirtió en el estándar mundial para conservatorios y se sigue fabricando con el mismo diseño básico.",
      "En 1986 Yamaha revolucionó el mercado con el Disklavier: un piano acústico con sistema MIDI integrado que permite grabar y reproducir interpretaciones. Esta tecnología es única en el mundo.",
      "La adquisición de Bösendorfer en 2008 sorprendió a la industria: el gigante industrial japonés absorbía a la casa artesanal europea más antigua. Yamaha mantiene ambas identidades separadas.",
    ],
    sonido: "Claridad, equilibrio, control. El sonido Yamaha es neutro y versátil, ideal para todo tipo de repertorio. En su serie CFX de concierto el sonido alcanza una sofisticación que compite con las marcas europeas tradicionales.",
    fabricacion: "Yamaha produce aproximadamente 100.000 pianos al año con una combinación de automatización industrial y ajuste artesanal final. Los modelos superiores (serie CF) se construyen en la misma fábrica de Hamamatsu con dedicación manual.",
    innovaciones: [
      "Serie U1/U3: estándar mundial de verticales de estudio",
      "Disklavier: piano acústico con reproducción MIDI (1986)",
      "Silent Piano: modo silencioso con auriculares",
      "Piano híbrido AvantGrand con mecánica acústica + sonido digital",
      "Serie CFX: piano de concierto premium, usado por ganadores del Concurso Chopin",
    ],
    hitos: [
      { anio: 1887, evento: "Fundación por Torakusu Yamaha" },
      { anio: 1900, evento: "Primer piano Yamaha" },
      { anio: 1963, evento: "Lanzamiento del U1, estándar mundial de verticales" },
      { anio: 1986, evento: "Disklavier: primer piano acústico con MIDI" },
      { anio: 2010, evento: "AvantGrand: piano híbrido con mecánica acústica" },
      { anio: 2008, evento: "Adquisición de Bösendorfer" },
      { anio: 2021, evento: "Bruce Liu gana el Concurso Chopin con un CFX" },
    ],
    modelos: [
      { nombre: "CFX", tipo: "Cola de concierto", descripcion: "Piano de cola de concierto premium, 275 cm. Ganador del Chopin 2021.", emblematico: true },
      { nombre: "U1", tipo: "Vertical profesional", descripcion: "Vertical de 121 cm. El piano más vendido del mundo en su categoría.", emblematico: true },
      { nombre: "C7X", tipo: "Cola profesional", descripcion: "Cola de conservatorio, 227 cm. Referencia en estudios profesionales." },
      { nombre: "AvantGrand N3X", tipo: "Híbrido", descripcion: "Piano híbrido con mecánica acústica completa y sonido digital muestreado." },
      { nombre: "Disklavier ENSPIRE", tipo: "Cola con MIDI", descripcion: "Piano acústico con reproducción y grabación MIDI integrada." },
    ],
    usuarios: [
      "Sviatoslav Richter", "Chick Corea", "Elton John", "Billy Joel",
      "Bruce Liu", "Seong-Jin Cho",
    ],
    curiosidades: [
      "El logo de Yamaha —tres diapasones cruzados— proviene de los orígenes de la empresa como fabricante de armonios.",
      "Yamaha también fabrica motocicletas, barcos, equipo de audio y chips de audio para videojuegos.",
      "En 2021, Bruce Liu ganó el Concurso Internacional Chopin con un Yamaha CFX, el primer ganador con un piano no-Steinway en muchos años.",
      "El U1 mantiene el mismo diseño básico desde 1963, con más de 500.000 unidades vendidas.",
    ],
    precioRango: "$3.000 – $150.000 USD",
    produccionAnual: "~100.000 pianos/año",
    webOficial: "https://www.yamaha.com",
    color: "#3D2A5A",
    acento: "#8064B8",
    emblema: "/images/marcas/yamaha.svg",
    logo: "/images/marcas/logos/yamaha.svg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "kawai",
    nombre: "Kawai",
    fundacion: 1927,
    pais: "Japón",
    ciudad: "Hamamatsu",
    fundador: "Koichi Kawai",
    lema: "The Future of the Piano",
    resumen: "Competidor directo de Yamaha desde Hamamatsu. Pionera en materiales compuestos para la acción del piano.",
    historia: "Fundada en 1927 por Koichi Kawai, un antiguo ingeniero de Yamaha que se independizó para diseñar pianos según su propia visión. Desde entonces, Kawai ha sido la eterna rival japonesa de Yamaha, con un sonido ligeramente más dulce y un enfoque pionero en el uso de nuevos materiales para el mecanismo del piano.",
    historiaExtensa: [
      "Koichi Kawai trabajó en Yamaha durante más de 20 años, llegando a ser jefe del departamento de investigación. En 1927 dejó la compañía para fundar Kawai Musical Instrument Research Laboratory en su Hamamatsu natal.",
      "Durante décadas, Kawai fue visto como 'el segundo Yamaha', pero con cada generación de liderazgo la casa fue desarrollando identidad propia. En los años 1980 Shigeru Kawai, segundo presidente, decidió innovar radicalmente.",
      "La revolución vino con los materiales compuestos ABS-Carbón: piezas del mecanismo que tradicionalmente se hacían en madera se comenzaron a fabricar en composites más estables y duraderos. Inicialmente criticado por los puristas, hoy es tecnología adoptada por varios fabricantes.",
      "En los años 2000, Kawai lanzó la serie Shigeru Kawai: pianos premium que compiten directamente con Steinway y Bösendorfer, ensamblados y revisados personalmente por 'maestros piano artesanos' (Master Piano Artisans) en Japón.",
      "Hoy Kawai es uno de los pocos fabricantes que produce completamente en Japón toda su línea, desde el vertical más básico hasta los pianos de concierto premium.",
    ],
    sonido: "Más dulce y redondo que Yamaha, con un ataque suave. Los pianos Shigeru Kawai SK rivalizan con las marcas europeas tradicionales en sofisticación tímbrica.",
    fabricacion: "Producción industrial precisa para la gama estándar; producción artesanal para la serie Shigeru Kawai. El uso de ABS-Carbón reduce el efecto de la humedad en el mecanismo, ventaja importante en climas cambiantes.",
    innovaciones: [
      "Materiales compuestos ABS-Carbón en la acción (1980s)",
      "Serie Shigeru Kawai con certificación Master Piano Artisan",
      "Sistema Millenium III de acción ultra-rápida",
      "Tabla armónica Duplex Scale extendida",
      "Aures: piano híbrido con altavoces en la caja armónica",
    ],
    hitos: [
      { anio: 1927, evento: "Fundación por Koichi Kawai" },
      { anio: 1955, evento: "Shigeru Kawai asume la presidencia de la compañía" },
      { anio: 1980, evento: "Introducción de materiales compuestos ABS-Carbón" },
      { anio: 2000, evento: "Lanzamiento de la serie Shigeru Kawai premium" },
      { anio: 2015, evento: "Shigeru Kawai SK-EX gana reconocimiento en concursos internacionales" },
    ],
    modelos: [
      { nombre: "Shigeru Kawai SK-EX", tipo: "Cola de concierto", descripcion: "Piano de cola premium ensamblado artesanalmente. 278 cm.", emblematico: true },
      { nombre: "K-800", tipo: "Vertical profesional", descripcion: "Vertical superior de Kawai, 134 cm con acción avanzada." },
      { nombre: "GX-2 BLAK", tipo: "Cola de salón", descripcion: "Piano de cola doméstico con mecánica Millennium III." },
      { nombre: "Novus NV10S", tipo: "Híbrido", descripcion: "Piano digital con mecánica acústica completa." },
    ],
    usuarios: [
      "Martha Argerich", "Shigeru Kawai", "Andre Watts",
      "Khatia Buniatishvili", "Leon McCawley",
    ],
    curiosidades: [
      "Cada Shigeru Kawai lleva el nombre personal del maestro artesano que lo ensambló.",
      "Los materiales compuestos ABS fueron inicialmente rechazados por puristas, pero los estudios muestran que son más estables que la madera.",
      "Kawai tiene su propia academia, Kawai Music School, con escuelas en todo Japón.",
      "El Shigeru Kawai de concierto ha sido elegido por el Festival de Piano de La Roque-d'Anthéron.",
    ],
    precioRango: "$3.000 – $180.000 USD",
    produccionAnual: "~70.000 pianos/año",
    webOficial: "https://www.kawai-global.com",
    color: "#1F3A5C",
    acento: "#4E82BA",
    emblema: "/images/marcas/kawai.svg",
    logo: "/images/marcas/logos/kawai.svg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "pleyel",
    nombre: "Pleyel",
    fundacion: 1807,
    cese: 2013,
    pais: "Francia",
    ciudad: "París",
    fundador: "Ignace Pleyel",
    lema: "Le piano de Chopin",
    resumen: "La casa favorita de Chopin. 200 años de historia con la música francesa romántica. Cese de producción acústica en 2013.",
    historia: "Fundada en 1807 por Ignace Pleyel —compositor austro-francés discípulo de Haydn—, la casa Pleyel fue durante el siglo XIX la gran rival de Érard en la escena parisina. Chopin era su devoto absoluto y la Salle Pleyel fue durante casi 200 años uno de los escenarios musicales más importantes del mundo.",
    historiaExtensa: [
      "Ignace Pleyel fue un compositor de renombre antes que industrial. Discípulo directo de Haydn, sus sinfonías y cuartetos eran interpretados por toda Europa. En 1807, a los 50 años, decidió fundar su propia casa de pianos en París.",
      "Su hijo Camille Pleyel tomó las riendas de la compañía y la convirtió en una de las más innovadoras de su tiempo. Fue amigo personal de Chopin y le proporcionó pianos exclusivos durante toda su carrera. Chopin eligió Pleyel para su último concierto público en la Salle Pleyel en 1848.",
      "La famosa cita de Chopin define el espíritu de la marca: cuando estaba indispuesto, tocaba un Érard —más fácil— pero cuando quería expresar su música con sutileza, solo un Pleyel le servía.",
      "En 1927 se inauguró la nueva Salle Pleyel en París, con capacidad para 2.400 personas. Sigue siendo una de las salas de concierto más importantes de Europa, aunque la casa Pleyel ya no la gestiona.",
      "La producción de pianos acústicos cesó definitivamente en 2013 tras 206 años de historia continua. La marca se reinventó como fabricante de pianos digitales de diseño y mantiene viva su herencia cultural.",
    ],
    sonido: "Ligero, íntimo, cantabile. El Pleyel del siglo XIX tenía una acción más ligera que el Érard y un sonido más 'vocal', menos brillante pero con una delicadeza perfecta para el repertorio romántico francés y polaco.",
    fabricacion: "Durante su era acústica, Pleyel fabricaba a mano en París con técnicas tradicionales francesas. El diseño mecánico enfatizaba la respuesta ligera y la sensibilidad del tacto por encima del volumen puro.",
    innovaciones: [
      "Primer piano vertical moderno en Europa (1826)",
      "Mecánica ligera ideal para el repertorio romántico",
      "Diseño art-déco en el siglo XX (modelos firmados por artistas)",
      "Piano Pleyel-Cushing con forma curva anatómica",
    ],
    hitos: [
      { anio: 1807, evento: "Fundación por Ignace Pleyel en París" },
      { anio: 1826, evento: "Primer piano vertical moderno" },
      { anio: 1848, evento: "Último concierto público de Chopin en la Salle Pleyel" },
      { anio: 1927, evento: "Inauguración de la nueva Salle Pleyel (2.400 asientos)" },
      { anio: 2013, evento: "Cese de la producción de pianos acústicos" },
      { anio: 2014, evento: "Relanzamiento como marca de pianos digitales de diseño" },
    ],
    modelos: [
      { nombre: "Pleyel P3 (histórico)", tipo: "Cola", descripcion: "Modelo similar a los usados por Chopin — hoy objeto de colección.", emblematico: true },
      { nombre: "Pleyel grand concert", tipo: "Cola de concierto", descripcion: "Pianos de concierto del siglo XX, hoy en museos y salas históricas." },
      { nombre: "Pleyel digital (actual)", tipo: "Digital", descripcion: "Línea actual de pianos digitales de diseño." },
    ],
    usuarios: [
      "Frédéric Chopin", "Camille Saint-Saëns", "Maurice Ravel",
      "Igor Stravinsky", "Alfred Cortot", "Édith Piaf",
    ],
    curiosidades: [
      "La Salle Pleyel de París fue el lugar del estreno del 'Concierto para la mano izquierda' de Ravel en 1931.",
      "Chopin escribió muchas de sus obras pensando específicamente en el tacto de los Pleyel.",
      "En los años 1920-30, Pleyel colaboró con artistas como Raoul Dufy para crear pianos de edición limitada con diseño vanguardista.",
      "El último Pleyel acústico (un vertical) salió de fábrica en 2013 antes del cierre definitivo.",
    ],
    precioRango: "Histórico (mercado de coleccionismo)",
    webOficial: "https://www.pleyel.fr",
    color: "#4A1B3D",
    acento: "#9B3F7C",
    emblema: "/images/marcas/pleyel.svg",
    logo: "/images/marcas/logos/pleyel.svg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "erard",
    nombre: "Érard",
    fundacion: 1780,
    cese: 1960,
    pais: "Francia",
    ciudad: "París",
    fundador: "Sébastien Érard",
    lema: "L'innovation française",
    resumen: "Inventor del mecanismo de doble escape en 1821. Base técnica de todos los pianos de cola modernos.",
    historia: "La casa más histórica de la pianística francesa. Sébastien Érard fue uno de los grandes inventores del piano moderno: en 1821 patentó el mecanismo de doble escape, que permite la repetición rápida de una misma nota. Esta tecnología sigue siendo la base de todos los pianos de cola fabricados hoy en el mundo.",
    historiaExtensa: [
      "Sébastien Érard nació en Estrasburgo en 1752 y se mudó a París en su juventud. Comenzó fabricando clavicémbalos y pronto se especializó en los nuevos pianofortes que llegaban de Inglaterra.",
      "El 29 de diciembre de 1821, Sébastien Érard registró la patente de la acción de doble escape (double échappement). El sistema permite que el martillo regrese a una posición intermedia —no totalmente abajo— tras tocar una nota, de modo que pueda volver a golpear inmediatamente. Esta es la base mecánica que permite los trinos rápidos, los tresillos virtuosos y toda la música pianística moderna.",
      "Franz Liszt adoptó Érard como marca preferida durante décadas. El virtuosismo extremo de Liszt solo era posible gracias al doble escape; con un piano anterior, sus pasajes más rápidos serían mecánicamente imposibles.",
      "Mendelssohn, Ravel, Fauré y todos los grandes compositores franceses del siglo XIX pensaron sus obras pianísticas en un Érard. El timbre brillante y la respuesta precisa marcaron la escuela francesa de composición pianística.",
      "La casa Érard produjo pianos hasta 1960. Tras su cierre, el archivo histórico y muchos instrumentos fueron preservados. Hoy los pianos Érard históricos son los más codiciados por los intérpretes de música romántica en instrumentos originales.",
    ],
    sonido: "Brillante, articulado, directo. El Érard es más 'instrumental' —menos vocal— que el Pleyel. Su respuesta precisa permite pasajes virtuosos con claridad absoluta.",
    fabricacion: "Fabricación artesanal en París durante dos siglos. Los Érard se construían con madera francesa de alta calidad y una precisión mecánica excepcional para la época.",
    innovaciones: [
      "Mecanismo de doble escape (1821) — base de todos los pianos modernos",
      "Primer piano de cola con marco de hierro completo (1825)",
      "Arpa moderna de doble acción (patente 1810)",
      "Técnicas de construcción imitadas por toda la industria mundial",
    ],
    hitos: [
      { anio: 1780, evento: "Fundación por Sébastien Érard en París" },
      { anio: 1810, evento: "Patente del arpa de doble acción" },
      { anio: 1821, evento: "Patente del mecanismo de doble escape" },
      { anio: 1825, evento: "Primer piano con marco de hierro completo" },
      { anio: 1831, evento: "Liszt adopta Érard como marca preferida" },
      { anio: 1960, evento: "Cierre de la fábrica tras 180 años de producción" },
    ],
    modelos: [
      { nombre: "Érard de concierto (c. 1830)", tipo: "Cola histórico", descripcion: "Los Érard del período 1830-1880 son los instrumentos más buscados para interpretación histórica.", emblematico: true },
      { nombre: "Érard modelo 1867", tipo: "Cola exposición", descripcion: "Modelo premiado en la Exposición Universal de París de 1867." },
      { nombre: "Érard Salon (c. 1900)", tipo: "Cola doméstico", descripcion: "Pianos de salón de principios del siglo XX, muy valorados por coleccionistas." },
    ],
    usuarios: [
      "Franz Liszt", "Felix Mendelssohn", "Maurice Ravel",
      "Gabriel Fauré", "Clara Schumann", "Camille Saint-Saëns",
    ],
    curiosidades: [
      "Sébastien Érard también fabricó arpas: su arpa de doble acción sigue siendo el estándar de las orquestas sinfónicas actuales.",
      "Napoleón Bonaparte regaló un piano Érard a la emperatriz Josefina.",
      "Liszt poseía simultáneamente varios Érard en diferentes países europeos para evitar tener que transportar pianos entre conciertos.",
      "El archivo histórico de la casa Érard se conserva en el Musée de la musique de París.",
    ],
    precioRango: "Histórico (mercado de coleccionismo)",
    color: "#3A2818",
    acento: "#8B6A45",
    emblema: "/images/marcas/erard.svg",
    logo: "/images/marcas/logos/erard.svg",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "baldwin",
    nombre: "Baldwin",
    fundacion: 1862,
    pais: "Estados Unidos",
    ciudad: "Cincinnati",
    fundador: "Dwight Hamilton Baldwin",
    lema: "America's Piano",
    resumen: "Gigante americano y piano oficial de la Casa Blanca durante décadas. Elegido por Liberace, Bernstein y jazz men.",
    historia: "Gigante americano fundado en Cincinnati en 1862 por Dwight Hamilton Baldwin. Tras años vendiendo pianos Steinway, Baldwin decidió crear los suyos propios en 1891. En el siglo XX se convirtió en el piano oficial de la Casa Blanca y fue elegido por pianistas como Leonard Bernstein y Liberace, junto a grandes nombres del jazz americano.",
    historiaExtensa: [
      "Dwight Hamilton Baldwin comenzó como profesor de música y vendedor de pianos en Cincinnati durante el boom industrial de finales del siglo XIX. En 1891 decidió fabricar su propia marca tras años de experiencia comercial.",
      "La empresa creció rápidamente y se convirtió en el mayor fabricante de pianos de Estados Unidos en los años 1920. En 1928 Baldwin compró a la compañía Wurlitzer, consolidando su posición en el mercado norteamericano.",
      "Durante el siglo XX, Baldwin fue el piano oficial de la Casa Blanca, dotando a presidentes como Franklin D. Roosevelt, Harry Truman, Dwight Eisenhower y John F. Kennedy. Leonard Bernstein tenía un Baldwin personal que hoy está en el Smithsonian.",
      "Liberace, el showman del piano, tocaba exclusivamente Baldwin, y la marca desarrolló modelos específicos para su espectáculo, decorados con candelabros y detalles ornamentales.",
      "Tras décadas de problemas financieros, Baldwin fue adquirida por Gibson Brands en 2001. La producción se trasladó parcialmente a China, aunque la marca sigue activa y los pianos Baldwin vintage americanos son muy valorados por coleccionistas.",
    ],
    sonido: "Robusto, con proyección generosa. El sonido Baldwin tradicional se asocia al 'American sound': menos refinado que el europeo pero con una presencia sonora grande, ideal para el jazz y la música popular.",
    fabricacion: "Tradicionalmente producción industrial americana con ajuste final artesanal. Desde 2001 la producción se reparte entre China y Estados Unidos, con los modelos premium aún siendo parcialmente fabricados en América.",
    innovaciones: [
      "Sistema de cuerdas paralelas Accu-just",
      "Piano oficial de la Casa Blanca durante varias décadas",
      "Serie Artist con diseño de concierto americano",
      "Integración vertical: todas las piezas fabricadas in-house en su época dorada",
    ],
    hitos: [
      { anio: 1862, evento: "Fundación como tienda de música por D.H. Baldwin en Cincinnati" },
      { anio: 1891, evento: "Inicio de la fabricación propia de pianos" },
      { anio: 1900, evento: "Premio a la excelencia en la Exposición Universal de París" },
      { anio: 1928, evento: "Adquisición de la compañía Wurlitzer" },
      { anio: 1960, evento: "Apogeo: piano oficial de la Casa Blanca durante la presidencia Kennedy" },
      { anio: 2001, evento: "Adquisición por Gibson Brands" },
    ],
    modelos: [
      { nombre: "Baldwin Model SF-10", tipo: "Cola de concierto", descripcion: "Cola de concierto americano de 9 pies (280 cm).", emblematico: true },
      { nombre: "Baldwin Hamilton", tipo: "Vertical de estudio", descripcion: "Vertical de 45 pulgadas, uno de los más vendidos en escuelas americanas." },
      { nombre: "Baldwin Artist Grand", tipo: "Cola de salón", descripcion: "Serie profesional que representó el sonido americano durante décadas." },
    ],
    usuarios: [
      "Leonard Bernstein", "Earl Wild", "Liberace", "Dave Brubeck",
      "Duke Ellington", "Marian McPartland",
    ],
    curiosidades: [
      "El Baldwin personal de Leonard Bernstein se conserva en el Smithsonian National Museum of American History.",
      "Liberace diseñó modelos personalizados con candelabros dorados incorporados al piano mismo.",
      "Dave Brubeck tocó Baldwin durante casi toda su carrera, incluido el álbum 'Time Out'.",
      "En su apogeo (años 1970), Baldwin producía más de 20.000 pianos al año.",
    ],
    precioRango: "$5.000 – $80.000 USD",
    produccionAnual: "~3.000 pianos/año (actualidad)",
    webOficial: "https://www.baldwinpiano.com",
    color: "#4B2C0B",
    acento: "#A0632E",
    emblema: "/images/marcas/baldwin.svg",
    logo: "/images/marcas/logos/baldwin.svg",
  },
];
