# Master Prompt Nano Banana — @elpollo_apuestas

Documento reutilizable para generar posts visuales 100% consistentes con la estética de ElPolloApuestas en Gemini (Nano Banana Pro, modelo Thinking o Pro para texto mejor).

## Paso 1 — Establecer el "personaje" UNA VEZ por sesión

Pega esto como **primer mensaje** en la conversación de Gemini. Define las variables que nunca cambian:

```
Vamos a crear una serie de posts para TikTok de @elpollo_apuestas, canal de pronósticos deportivos diarios. Mantén consistencia absoluta en todos los posts. Define estas variables fijas:

MASCOTA = Un gallo/pollo antropomorfo caricaturesco. Rasgos fijos:
- Plumaje color rojizo-anaranjado con tonos marrón, cresta roja pequeña de 3 puntas, pico amarillo-naranja
- Lleva smoking negro formal de estilo 1920s, camisa blanca, corbatín rojo
- A veces sombrero de copa negro (opcional según post)
- Sonrisa traviesa mostrando los dientes, cejas expresivas, mirada cómplice hacia el espectador
- Postura dinámica: señalando con el ala hacia algo, brazos abiertos presentando, o gesto de "ven acá"
- Piernas delgadas tipo caricatura con zapatos brillantes

ESTILO_VISUAL = Ilustración cartoon vintage sports 2D plano:
- Líneas gruesas negras de contorno definido estilo comic vintage
- Colores saturados pero desgastados tipo impresión offset antigua
- Textura sutil de papel o lienzo en el fondo, muy leve grano
- SIN sombras realistas; usar sombreado plano con tramas o áreas de color
- Paleta inspirada en afiches de circo / carteles deportivos de los 40-60s
- NO realista, NO 3D render, NO foto. Cartoon plano estilo ilustración editorial deportiva

COMPOSICION_FIJA (formato vertical 9:16 TikTok):
- Tercio superior: bubble de speech blanco redondeado con borde negro grueso, texto dentro, y logo oficial de la liga pequeño al lado. El bubble tiene la cola apuntando hacia la mascota
- Tercio central-inferior: trofeo/copa dorado GIGANTE ocupando 1/3 del ancho a la izquierda o centro. Monedas doradas con alas pequeñas flotando alrededor, estrellas blancas de 5 puntas dispersas
- Tercio inferior derecho: MASCOTA en pose dinámica, señalando hacia la copa o el bubble con expresión entusiasta
- Esquina inferior derecha muy pequeña: watermark texto "{MES}" en amarillo dorado tipografía vintage 3 letras mayúsculas

ESPECIFICACIONES_TECNICAS:
- Formato 9:16 vertical (1080x1920)
- Alta resolución, bordes limpios
- Texto del bubble legible desde miniatura de TikTok
- No dejar espacios vacíos muertos; rellenar con detalles decorativos sutiles (estrellas, confeti, rayos de luz)

Confirma que entendiste la mascota y el estilo, y que estás listo para generar posts cambiando solo la LIGA, el COLOR_FONDO y el MES.
```

---

## Paso 2 — Generar posts cambiando solo variables

Una vez Gemini confirmó, usa este template para CADA post. Copia, reemplaza las 4 variables en `{}`, envía.

```
Genera ahora un post vertical 9:16 para TikTok @elpollo_apuestas siguiendo las variables MASCOTA, ESTILO_VISUAL y COMPOSICION_FIJA definidas antes. Solo cambian:

LIGA = {NOMBRE_LIGA}
LOGO_LIGA = {LOGO_OFICIAL} (ej: escudo Premier League, escudo Copa del Rey, escudo Libertadores)
TROFEO = {DESCRIPCION_TROFEO_ESPECIFICO} (ej: Copa Premier League alargada con base plateada)
COLOR_FONDO = {COLOR_HEX} degradado suave o plano, liga-específico
MES = "{MES_ABR_3_LETRAS}" (ej: "ABR", "MAY", "JUN")

Texto del bubble (exacto, entre comillas):
"¿Quieres ganar mañana con {LIGA}?"

El bubble incluye el logo de la liga al lado del texto (a la derecha dentro del bubble).

Mantén TODO lo demás idéntico a los posts anteriores de la serie: mismo pollo, mismo smoking, mismo estilo cartoon vintage plano, misma composición 9:16, mismas monedas doradas con alas, mismas estrellas, mismo watermark mes en amarillo abajo a la derecha.

Genera.
```

---

## Banco de variables listas por liga

Copia-pega directo:

### Fútbol Europa

**Premier League**
- LIGA = `Premier League`
- COLOR_FONDO = azul claro `#8FBCE6` degradado a celeste pastel
- TROFEO = copa Premier League dorada con asas grandes y base plateada

**La Liga (España)**
- LIGA = `La Liga`
- COLOR_FONDO = beige crema `#F5E6C8` con rayas diagonales rojas tipo bandera española
- TROFEO = trofeo LaLiga de plata con base dorada

**Copa del Rey**
- LIGA = `Copa del Rey`
- COLOR_FONDO = beige `#E8D5A8` con elementos arquitectónicos arcos de arena tipo plaza de toros al fondo muy sutiles
- TROFEO = Copa del Rey de plata alargada clásica con corona

**Bundesliga**
- LIGA = `Bundesliga`
- COLOR_FONDO = rojo granate `#BC1B1B` con elementos decorativos dorados sutiles
- TROFEO = plato Meisterschale dorado circular con bandas

**Serie A**
- LIGA = `Serie A`
- COLOR_FONDO = azul oscuro italiano `#0C5499` con acentos verde-blanco-rojo sutiles
- TROFEO = Coppa Campioni d'Italia dorada tipo ánfora

**Ligue 1**
- LIGA = `Ligue 1`
- COLOR_FONDO = azul eléctrico `#1A2E9E` con acentos rosa-magenta `#E8247A` (marca oficial Ligue 1)
- TROFEO = trofeo Ligue 1 hexagonal moderno dorado

**Europa League**
- LIGA = `Europa League`
- COLOR_FONDO = naranja `#FF6900` a amarillo degradado con líneas radiales
- TROFEO = copa UEFA Europa League con base multi-nivel dorada

**Champions League / Clasificatorias UEFA**
- LIGA = `Clasificatorias UEFA`
- COLOR_FONDO = mapa estilizado de Europa en azul turquesa `#2D8B9A` con líneas doradas conectando países
- TROFEO = la orejona Champions dorada alta con asas grandes

### Fútbol Sudamérica

**Copa Libertadores**
- LIGA = `Copa Libertadores`
- COLOR_FONDO = rojo crimson `#A0241F` con rayos de luz dorados desde el centro
- TROFEO = Copa Libertadores bronceada alta con figuras aladas en la base

**Copa Sudamericana**
- LIGA = `Copa Sudamericana`
- COLOR_FONDO = azul profundo `#0B3D6F` con estrellas blancas
- TROFEO = trofeo Copa Sudamericana plateado con base dorada

**Brasileirão / Copa de Brasil**
- LIGA = `Copa de Brasil`
- COLOR_FONDO = verde-amarillo `#0A8C3F` degradado con acentos dorados, aves tropicales muy sutiles al fondo
- TROFEO = trofeo Copa do Brasil dorado con base cuadrada

**Liga Betplay Dimayor (Colombia)**
- LIGA = `LIGA BETPLAY DIMAYOR`
- COLOR_FONDO = morado oscuro `#3D1B6B` con corona dorada decorativa al fondo
- TROFEO = trofeo Liga Betplay dorado con cinta colombiana (amarillo-azul-rojo) en la base

**Copa Betplay**
- LIGA = `COPA BETPLAY`
- COLOR_FONDO = verde neón `#00C851` degradado a verde oscuro
- TROFEO = Copa Betplay dorada con base moderna

### Otras

**MLB (béisbol)**
- LIGA = `MLB`
- COLOR_FONDO = navy `#0D2240` con diamante de béisbol sutil como textura
- TROFEO = Commissioner's Trophy plateado con 30 banderines dorados (uno por equipo)

---

## Tips de iteración (ahorra tokens)

En lugar de regenerar desde cero cuando algo no queda bien, pide cambios puntuales:

- "Hazle el smoking más brillante, agrégale satén"
- "La copa está muy pequeña, súbele al 40% del ancho"
- "El pollo está mirando hacia el lado equivocado, que mire hacia el bubble"
- "Agrega más monedas doradas flotando a la derecha"
- "El texto del bubble no se lee, haz la fuente más gruesa y negra"
- "Suaviza el color del fondo, está muy saturado"

---

## Errores comunes y fix

| Problema | Fix |
|---|---|
| El pollo cambia de cara entre posts | Pega la MASCOTA como referencia de imagen + repite "mismo personaje que el post anterior" |
| Texto del bubble sale con errores | Usa Nano Banana **Pro (Thinking)**, no Fast — Pro escribe mejor |
| Fondo muy plano / aburrido | Agrega "líneas radiales de luz desde el centro" o "estrellas blancas de 5 puntas dispersas" |
| Trofeo se ve genérico / no es el real de la liga | Sube una foto de referencia del trofeo real + "reemplaza el trofeo por este exacto" |
| Colores cambian de post a post | Repite siempre `COLOR_FONDO = #HEX exacto` + "mantener saturación constante con posts anteriores" |
| La composición se mueve | Haz referencia a un post anterior: "misma composición que el post de Copa del Rey que generamos" |

---

## Pipeline rápido: 5 posts en 10 minutos

1. Abre Gemini, selecciona **Nano Banana Pro (Thinking)** o **Pro**
2. Pega el **Paso 1** completo (una sola vez por sesión)
3. Espera confirmación de Gemini
4. Pega el template del **Paso 2** con variables de tu primera liga
5. Genera
6. Cambia solo LIGA, LOGO_LIGA, COLOR_FONDO, MES, TROFEO y repite para las otras 4 ligas

Tiempo total: ~10 min para 5 posts consistentes.

---

## Próximo nivel (cuando domines esto)

- **Multi-referencia**: sube una foto del trofeo REAL + logo oficial de la liga + 1-2 posts previos del pollo como referencia de consistencia → Nano Banana Pro acepta hasta 14 imágenes
- **Serie temática semanal**: "Lunes: Premier", "Martes: La Liga", "Miércoles: Libertadores" → genera los 7 de golpe cada domingo, programas con CapCut/TikTok scheduler
- **Videos con Kling 3.0**: toma el PNG generado y animalo (pollo salta, copa brilla, monedas giran) con Kling image-to-video — 5s loop perfecto para TikTok carrusel
