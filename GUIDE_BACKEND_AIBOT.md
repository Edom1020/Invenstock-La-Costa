# Documentación de API para Asistente IA (AIBot)

Este documento describe los endpoints necesarios para alimentar el componente de recomendaciones inteligentes en el frontend de Invenstock.

## 1. Modelo de Datos (Sugerencia)

| Campo         | Tipo     | Descripción                                                                |
| :------------ | :------- | :------------------------------------------------------------------------- |
| `id`          | UUID/Int | Identificador único.                                                       |
| `tipo`        | String   | Uno de: `alerta`, `sugerencia`, `recordatorio`, `oferta`, `mantenimiento`. |
| `icono`       | String   | Emoji o nombre de icono (ej: `⚠️`).                                        |
| `titulo`      | String   | Título corto de la recomendación.                                          |
| `descripcion` | String   | Detalle de la acción sugerida.                                             |
| `createdAt`   | DateTime | Fecha de creación (el frontend espera formato ISO o relativo).             |
| `leida`       | Boolean  | Estado de lectura para el usuario actual.                                  |

## 2. Endpoints Requeridos

### A. Obtener Sugerencias

`GET /api/ai/suggestions`

**Descripción:** Devuelve las sugerencias generadas para el usuario autenticado. Se recomienda que el motor de IA o las reglas de negocio generen estas entradas basándose en el stock actual y tendencias.

**Respuesta Exitosa (200 OK):**

```json
[
  {
    "id": 101,
    "tipo": "alerta",
    "icono": "⚠️",
    "titulo": "Stock Crítico",
    "descripcion": "El producto 'Taladro' está por debajo del mínimo.",
    "createdAt": "2023-11-20T10:00:00Z",
    "leida": false
  }
]
```

### B. Marcar como Leída

`PATCH /api/ai/suggestions/{id}/read`

**Descripción:** Cambia el estado `leida` de una sugerencia específica a `true`.

### C. Marcar Todo como Leído

`POST /api/ai/suggestions/read-all`

**Descripción:** Marca todas las sugerencias pendientes del usuario como leídas.

## 3. Lógica de Negocio Sugerida para el Backend

El backend debería generar sugerencias automáticamente cuando:

1. Un producto baja de su `stockMinimo` (**Alerta**).
2. Hay productos con fecha de vencimiento próxima (**Recordatorio**).
3. Se detecta un incremento inusual en la salida de una categoría (**Sugerencia**).
4. Han pasado más de X días sin un conteo físico (**Mantenimiento**).
