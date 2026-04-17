# 🐔 Pipeline Full Auto @elpollo_apuestas

Pipeline end-to-end que convierte picks MLB generados por A Lo Profundo en contenido listo para publicar en TikTok, sin intervención manual.

## Arquitectura

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  A LO PROFUNDO (Next.js / Vercel)                                      │
│  ────────────────────────────────                                      │
│                                                                        │
│  Cron 13:00 UTC (8 AM Bogotá)  →  /api/cron/save-predictions           │
│        │                                                               │
│        └→ Modelo Pythagorean genera predicciones del día               │
│           Persiste en Vercel Blob (predictions-history.json)           │
│                                                                        │
│  Endpoint público:                                                     │
│  GET /api/picks-today  →  filtra a confidenceLevel in (high, medium)   │
│                        →  solo Preview (no empezados)                  │
│                        →  agrega colors primary/secondary por equipo   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │  HTTP GET
                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  n8n — Pollo Apuestas - Pipeline Full Auto (V4SdqkQnCwf15vWu)          │
│  ────────────────────────────────────────────────────────────          │
│                                                                        │
│  Cron 12:00 UTC (7 AM Bogotá) — 1h antes que el save                   │
│       ▼                                                                │
│  Fetch Picks Verdes  →  aloprofundomlb.com/api/picks-today             │
│       ▼                                                                │
│  Build Prompts per Pick                                                │
│    Para cada pick verde genera:                                        │
│    - imagePrompt: pollo vestido del equipo, acción MLB, composición    │
│    - scriptPrompt: script TikTok 30s con razones del análisis          │
│       │                                                                │
│       ├──────────────────────────┬──────────────────────────           │
│       ▼                          ▼                                     │
│  Gemini Nano Banana         GPT-5-mini Script                          │
│  (genera PNG 9:16)          (genera texto 30s)                         │
│       │                          │                                     │
│       └──────────────────────────┘                                     │
│                    ▼                                                   │
│            Merge by position                                           │
│                    ▼                                                   │
│         Format Final → items con JSON + binary.image                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │  Output → (conectas en UI: Gmail / Drive / Telegram)
                              ▼
                        Tu grabación + subida a TikTok
```

## Activación (5 pasos, 10 min)

### 1. Desplegar el endpoint público a producción
En la carpeta `a-lo-profundo/` corres:
```bash
npm run build
vercel --prod
```
(o un push a `main` si tienes CI/CD activo). Verifica:
```bash
curl https://aloprofundomlb.com/api/picks-today | jq
```

### 2. Configurar credenciales n8n
Abre el workflow: **[Pollo Apuestas - Pipeline Full Auto](https://nicocuenk.app.n8n.cloud/workflow/V4SdqkQnCwf15vWu)**

Tienes 2 nodos HTTP que necesitan credencial:

**a) Nodo `Gemini Nano Banana`**
- En la UI del nodo → Credentials → Generic Credential Type: Query Auth
- Name/Value: no aplica. Mejor: usa variable de entorno.
- Alternativa más segura: en n8n Settings → Variables → crea `GEMINI_API_KEY` con tu key de Google AI Studio (https://aistudio.google.com/app/apikey)
- El nodo ya usa `{{ $env.GEMINI_API_KEY }}` en el query param `key`.

**b) Nodo `GPT Script`**
- Authentication: Predefined Credential Type → OpenAI API
- Selecciona la credencial `OpenAI` existente (la misma que usa tu Comunicador 24/7)

### 3. Conectar output deseado
Al final del workflow (después del nodo `Format Final`) agrega UNO o VARIOS de estos:

**Opción A — Email (recomendado para arrancar)**
- Agrega nodo Gmail → Send Message
- To: `nicocuenkbermeo@gmail.com`
- Subject: `🐔 Picks Pollo del día ({{ $json.abbr }})`
- Body: `Script:\n\n{{ $json.script }}\n\nEquipo: {{ $json.team }}\nConfianza: {{ ($json.confidence * 100).toFixed(1) }}%`
- Attach binary → `image`
→ Recibes un email POR CADA pick con imagen adjunta

**Opción B — Google Drive**
- Agrega nodo Google Drive → Upload
- Input Binary Field: `image`
- Folder: `Pollo Apuestas/Hoy`
- File Name: `={{ $json.abbr }}-{{ $now.toFormat("yyyyMMdd") }}.png`
- Agrega otro nodo Google Drive → Create File from Text para guardar el script como `.txt`

**Opción C — Telegram (más rápido para móvil)**
- Crea bot con @BotFather, añade credencial
- Agrega nodo Telegram → Send Photo
- Chat ID: tu chat personal
- Binary Field: `image`
- Caption: `{{ $json.script }}`

### 4. Test manual
1. Click `Execute workflow`
2. Revisa la ejecución — cada nodo debe mostrar verde
3. Si algún pick viene sin imagen: verifica la API key de Gemini
4. Si viene sin script: verifica credencial OpenAI

### 5. Activar producción
- Toggle `Active` en la esquina superior derecha
- El cron correrá todos los días 7 AM Bogotá automáticamente

## Cadencia de contenido que vas a generar

Típicamente A Lo Profundo detecta **3-6 picks verdes (high/medium confidence)** por día en temporada regular MLB. Entonces cada mañana recibes:

- **3-6 imágenes** con el pollo vestido del equipo del pick haciendo una acción MLB (rotan: bateando, pitcheando, deslizándose, atrapando, celebrando, en el dugout)
- **3-6 scripts** de 30s listos para leer en cámara
- Cada uno con su equipo, confianza %, rival, hora del juego

Con eso puedes:
- **Grabar 1-2 TikToks** seleccionando los de mayor confianza
- **Publicar carrusel** con las 3-6 imágenes de picks del día
- **Stories** con los picks que no alcanzaste a grabar

## Iteración y mejoras futuras

### v1 (actual)
- ✅ Picks verdes automáticos desde a-lo-profundo
- ✅ Imagen Nano Banana por pick con uniforme del equipo
- ✅ Script TikTok GPT-5 por pick
- ⚠️ Output manual: tú conectas Gmail/Drive/Telegram

### v2 (próximo sprint)
- Repurposer automático: al publicar TikTok → postea Reel IG + YT Short + tweet
- Tracking UTM por video para medir conversión a aloprofundomlb.com
- Dashboard semanal de ROI: views → clicks → registros

### v3 (futuro)
- Auto-post a TikTok via TikTok Content Posting API (requiere aprobación developer)
- Multi-deporte: extender a fútbol con picks del modelo para Copa del Rey, Libertadores, Premier
- Versiones animadas con Kling 3.0 (PNG estático → video 5s con el pollo moviéndose)

## Notas técnicas

**Nano Banana (Gemini 2.5 Flash Image)**
- Endpoint: `generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`
- Input: text prompt
- Output: `candidates[0].content.parts[].inlineData.data` (base64 PNG)
- Costo: incluido en tu plan Google AI Studio gratuito hasta cuota diaria, luego ~$0.03/img
- Consistencia del personaje: el prompt tiene la descripción detallada de la mascota. Para mayor consistencia usa referencia multi-imagen (requiere Gemini 3 Pro Image — pagado)

**Endpoint `/api/picks-today`**
- Revalidate: 15 min (cache-control header)
- Filtra: non-pending + Preview + confidenceLevel in (high, medium)
- Incluye colores primary/secondary del equipo para el prompt de imagen
- Seguro de exponer públicamente (solo lectura, sin secrets)

**Budget estimado mensual**
- Gemini Nano Banana: 5 picks/día × 30 días = 150 imgs → ~$4.50/mes (o gratis si dentro de cuota)
- GPT-5-mini scripts: 150 requests × ~500 tokens out = ~$0.30/mes
- n8n ejecuciones: 30/mes (1 al día) → caben en free tier
- **Total: <$5/mes** para contenido diario automático
