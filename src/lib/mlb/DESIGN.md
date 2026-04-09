# Reglas de Diseno Mobile-First — A Lo Profundo

Aplica a todas las features nuevas (apuestas y futuras).

## Reglas obligatorias

1. **Mobile-first**: escribe estilos para 375px primero, escala con `md:`, `lg:`. Nunca al reves.
2. **Overflow**: contenedores de tablas usan `overflow-x-auto` + `min-w-[Npx]` en la tabla. Nunca desbordan la pagina.
3. **Touch targets**: botones, tabs, filtros -> minimo `min-h-[44px]` y padding generoso.
4. **Tipografia**: body `text-sm` (14px) minimo en movil, `md:text-base` en desktop. Numeros de stats pueden ser `text-xs` solo en tablas densas.
5. **Imagenes**: todas con `next/image`, `sizes` declarado, `priority` solo en hero above-the-fold.
6. **Navegacion**: rutas nuevas deben aparecer en el menu movil hamburguesa (Navbar.tsx `featureLinks`).
7. **Testing**: cada feature se verifica en 375px ANTES de marcarla como terminada.

## Patrones de tablas en movil

- Desktop: tabla clasica
- Movil: si >5 columnas, usar cards apiladas O tabla con scroll horizontal contenido
- Highlight visual de valores importantes con color (no depender de posicion en columna)

## Disclaimer legal

Todas las paginas de apuestas incluyen `<BettingDisclaimer />` visible.
