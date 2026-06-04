# Guía de Integración Backend - Proyecto Invenstock

Este documento resume los requerimientos técnicos y lógicas de negocio necesarios para soportar las funcionalidades implementadas en el frontend.

---

## 1. Autenticación y Seguridad

### Requisitos de Contraseña

Para garantizar la seguridad, el backend **debe** validar las contraseñas en el registro y cambio de clave bajo estos criterios:

- **Longitud mínima:** 12 caracteres.
- **Complejidad:** Al menos una mayúscula (A-Z), un número (0-9) y un carácter especial (`!@#$%^&*`).

**Expresión Regular Sugerida:**

```regex
/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/
```

_Nota: Las contraseñas deben ser hasheadas (ej. BCrypt) antes de ser persistidas._

---

## 2. Lógica de Inventario (Sincronización y Movimientos)

El sistema ha pasado de un modelo de "stock plano" a un modelo basado en **Lotes**. El backend debe implementar la siguiente jerarquía:

### A. Cálculo de Stock

El stock total de un producto ya no es un campo estático editable. Debe ser el resultado de:
`Stock Total = Sumatoria(Cantidad de Lotes Activos asociados al producto)`

### B. Registro de Movimientos

1.  **Entradas (Ingresos):** Al registrar una entrada, el backend debe crear automáticamente un nuevo registro en la tabla de **Lotes** asociado al producto.
2.  **Salidas (Egresos):** El backend debe aplicar la lógica **FIFO (First-In, First-Out)**. Se deben descontar las unidades de los lotes más antiguos (basado en fecha de entrada) que tengan stock disponible hasta completar la cantidad solicitada.

---

## 3. Reportes y Alertas

Para alimentar la vista de **Reportes** y las tablas de alertas, el objeto `Producto` devuelto por la API debe incluir obligatoriamente:

| Campo         | Tipo | Descripción                                                    |
| :------------ | :--- | :------------------------------------------------------------- |
| `stock`       | Int  | Stock total calculado (suma de lotes).                         |
| `stockMinimo` | Int  | El umbral definido por el usuario para disparar alertas.       |
| `stockMax`    | Int  | Capacidad máxima (opcional para cálculos de reabastecimiento). |

**Endpoint Sugerido para Alertas:**
`GET /api/productos/alertas` -> Debería retornar productos donde `stock <= stockMinimo`.

---



### Lógica de generación (Backend):

Se recomienda que el servidor genere estas sugerencias automáticamente cuando ocurran eventos en el inventario:

- **Tipo Alerta:** Cuando un producto cruza el umbral de `stockMinimo`.
- **Tipo Recordatorio:** Cuando un lote está a menos de 15 días de su `fechaVencimiento`.
- **Tipo Sugerencia:** Basado en el análisis de la tabla de movimientos (ej. "Las ventas de [Categoría] subieron un X%").

---

## 5. Estructura de Respuesta API (CORS y Auth)

- **CORS:** Debe permitir peticiones desde el dominio del frontend (Vite por defecto usa el puerto 5173).
- **Headers:** El frontend enviará el token en el header `Authorization: Bearer <token>`.
- **Errores:** Favor de retornar códigos de estado HTTP estándar (400 para validaciones de password, 401 para expiración de token, 403 para falta de permisos).

---

## 6. Gestión de Usuarios y Permisos

La administración de permisos se realiza mediante búsqueda directa por identidad de usuario.

- **Identificación de Usuario:** El administrador proveerá el **email** del usuario para gestionar sus permisos.
- **Endpoint para Consulta:** `GET /api/admin/permissions?email={email}`. Debe retornar el nombre del usuario y su array de IDs de permisos actuales.
- **Endpoint para Actualización:** `PUT /api/admin/permissions` enviando el `email` y la nueva lista de permisos.

---

## 7. Configuración Global del Sistema

El backend debe persistir los ajustes de preferencia que afectan a toda la organización:

- **Endpoint:** `GET/PUT /api/settings/inventory`
- **Campos:**
  - `stockMinimoGlobal`: Valor por defecto para nuevos productos.
  - `unidadMedidaDefecto`: Unidad predeterminada (u, kg, lt, etc.).

---

_Documento generado para la sincronización del sistema Invenstock._
