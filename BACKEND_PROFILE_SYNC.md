# 📋 Especificaciones para el Backend: Perfil de Usuario y Validación de Email

Este documento detalla los requerimientos necesarios en el backend para soportar las nuevas funcionalidades de persistencia de perfil y seguridad en el cambio de correo electrónico implementadas en el frontend.

## 1. Gestión del Perfil de Usuario
Actualmente, el frontend utiliza `localStorage` para persistir el perfil. Es necesario migrar esto a una base de datos.

### Endpoints Requeridos:
- **`GET /api/usuario/perfil`**: Retorna la información actual del usuario autenticado.
  - **Respuesta esperada**:
    ```json
    {
      "nombre": "Ricardo Alcaraz",
      "correo": "r.alcaraz@invenstock.com",
      "cargo": "Administrador de Inventario",
      "ubicacion": "Sede La Costa",
      "fotoPerfil": "url_de_la_imagen"
    }
    ```
- **`PUT /api/usuario/perfil`**: Actualiza la información del perfil.
  - **Cuerpo**: `{ nombre, cargo, ubicacion, fotoPerfil }`
  - **Nota**: El `correo` no debe actualizarse a través de este endpoint general por razones de seguridad (ver sección de validación).

---

## 2. Flujo de Cambio de Correo Electrónico (Seguridad)
Para evitar que un usuario cambie su correo sin autorización, se requiere un flujo de validación.

### Flujo Propuesto:
1. **Solicitud de Cambio**: El usuario envía el nuevo correo al backend.
   - **Endpoint**: `POST /api/usuario/cambiar-correo`
   - **Cuerpo**: `{ "nuevoCorreo": "nuevo@email.com" }`
   - **Acción Backend**: 
     - Generar un token de verificación único.
     - Enviar un correo electrónico a la **dirección original** notificando el intento de cambio y proporcionando el token o un enlace de confirmación.
     - Guardar el `nuevoCorreo` en un estado temporal (`pending_email`).

2. **Verificación**: El usuario confirma el cambio desde el correo original.
   - **Endpoint**: `POST /api/usuario/confirmar-correo`
   - **Cuerpo**: `{ "token": "token_recibido" }`
   - **Acción Backend**: 
     - Validar el token.
     - Si es válido, actualizar permanentemente el `correo` en la tabla de usuarios.
     - Eliminar el token y el correo temporal.

---

## 3. Notificaciones de Stock (Real-time)
El frontend ya tiene la lógica de sonidos (`normal`, `critico`, `muy_critico`). Para que esto sea eficiente, el backend debe disparar eventos vía Socket.io.

### Eventos de Socket Sugeridos:
El backend debe emitir un evento cuando un movimiento de inventario haga que el stock caiga por debajo de los umbrales:
- **Evento**: `stock_alert`
- **Payload**: 
  ```json
  {
    "productoId": 123,
    "nombre": "Producto X",
    "stockActual": 5,
    "nivel": "muy_critico" // 'normal', 'critico', 'muy_critico'
  }
  ```
- **Lógica de Disparo**:
  - Stock $\le$ 5 $\rightarrow$ `muy_critico`
  - Stock $\le$ 15 $\rightarrow$ `critico`
  - Stock $\le$ 30 $\rightarrow$ `normal`

---

## Resumen de Tareas para Backend:
- [ ] Crear tabla/campos de perfil de usuario en la DB.
- [ ] Implementar CRUD básico de perfil.
- [ ] Implementar sistema de envío de correos (Nodemailer o similar).
- [ ] Crear lógica de tokens para validación de cambio de email.
- [ ] Integrar disparadores de alertas de stock en la lógica de movimientos de inventario.
