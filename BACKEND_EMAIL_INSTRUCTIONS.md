# Instrucciones para integrar emails (Resend) en el Backend de InvenStock

## Contexto

El frontend ya tiene implementado todo lo necesario para las preferencias de notificación:
- Dos toggles: **"Avisos por email"** y **"Reportes semanales"**
- Al guardar, el frontend hace `PUT /api/auth/preferencias` con body `{ email: boolean, reportes: boolean }`
- Al cargar la pantalla de configuración, el frontend hace `GET /api/auth/preferencias` y espera `{ email: boolean, reportes: boolean }`
- Las alertas de stock bajo ya se detectan en el frontend/backend y se emiten por Socket.IO — el email debe dispararse del mismo lado que el socket

El servicio de email a usar es **Resend** (ya lo tienen instalado para otras cosas).

---

## 1. Dependencias

```bash
npm install node-cron
# resend ya debería estar instalado; si no:
npm install resend
```

---

## 2. Variables de entorno (.env)

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=InvenStock <noreply@tudominio.com>
```

> El dominio en `EMAIL_FROM` debe estar verificado en el dashboard de Resend.

---

## 3. Modelo de Usuario — agregar campo `preferencias`

En el schema de Mongoose del modelo `User` (o como se llame), agregar:

```javascript
preferencias: {
  email:    { type: Boolean, default: true  },
  reportes: { type: Boolean, default: true  }
}
```

---

## 4. Nuevos endpoints en la ruta `/api/auth`

### GET /api/auth/preferencias
El frontend lo llama al cargar la pantalla de Configuración para sincronizar el estado real del servidor.

```javascript
// GET /api/auth/preferencias  (requiere JWT)
router.get('/preferencias', authMiddleware, async (req, res) => {
  try {
    const usuario = await User.findById(req.user._id).select('preferencias')
    res.json({
      email:    usuario.preferencias?.email    ?? true,
      reportes: usuario.preferencias?.reportes ?? true,
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener preferencias' })
  }
})
```

### PUT /api/auth/preferencias
El frontend ya lo llama cada vez que el usuario pulsa "Guardar Cambios" en Configuración.

- **Body recibido:** `{ email: boolean, reportes: boolean }`
- **Respuesta esperada:** `{ ok: true }` o cualquier 2xx

```javascript
// PUT /api/auth/preferencias  (requiere JWT)
router.put('/preferencias', authMiddleware, async (req, res) => {
  try {
    const { email, reportes } = req.body
    await User.findByIdAndUpdate(req.user._id, {
      'preferencias.email':    email,
      'preferencias.reportes': reportes,
    })
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar preferencias' })
  }
})
```

---

## 5. Servicio de email — `services/email.service.js`

Crear este archivo con las dos funciones que necesita el sistema:

```javascript
const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

// ── Alerta de stock bajo ──────────────────────────────────────────────────────
const sendStockAlertEmail = async (toEmail, nombreUsuario, productos) => {
  const filas = productos.map(p => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${p.nombre}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${p.sku || '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#dc2626;font-weight:700;">${p.stock}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${p.stockMinimo}</td>
    </tr>
  `).join('')

  await resend.emails.send({
    from:    process.env.EMAIL_FROM,
    to:      toEmail,
    subject: '⚠️ Alerta de Stock Bajo — InvenStock',
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f0f2f5;padding:24px;">
        <div style="background:#1e4e78;border-radius:12px 12px 0 0;padding:24px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">⚠️ Alerta de Stock Bajo</h1>
        </div>
        <div style="background:#fff;border-radius:0 0 12px 12px;padding:24px;">
          <p style="color:#334155;">Hola <strong>${nombreUsuario}</strong>, los siguientes productos han alcanzado el nivel mínimo de stock:</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;">Producto</th>
                <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;">SKU</th>
                <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;">Stock Actual</th>
                <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;">Mínimo</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
          <p style="margin-top:24px;color:#94a3b8;font-size:12px;">Aviso automático generado por InvenStock. Entra al sistema para reponer el stock.</p>
        </div>
      </div>
    `,
  })
}

// ── Reporte semanal ───────────────────────────────────────────────────────────
const sendWeeklyReportEmail = async (toEmail, nombreUsuario, { totalProductos, productosEnAlerta, movimientosRecientes }) => {
  const alertasHTML = productosEnAlerta.length > 0
    ? productosEnAlerta.map(p => `
        <li style="margin-bottom:6px;">
          <strong>${p.nombre}</strong>: ${p.stock} unidades
          <span style="color:#dc2626;">(mínimo ${p.stockMinimo})</span>
        </li>
      `).join('')
    : '<li style="color:#16a34a;">Todos los productos tienen stock adecuado ✅</li>'

  const movimientosHTML = movimientosRecientes.slice(0, 10).map(m => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${m.producto}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
        ${m.tipo === 'entrada'
          ? '<span style="color:#16a34a;font-weight:600;">▲ Entrada</span>'
          : '<span style="color:#dc2626;font-weight:600;">▼ Salida</span>'}
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${m.cantidad}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${new Date(m.fecha).toLocaleDateString('es-ES')}</td>
    </tr>
  `).join('')

  const semana = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  await resend.emails.send({
    from:    process.env.EMAIL_FROM,
    to:      toEmail,
    subject: `📊 Reporte Semanal de Inventario — ${semana}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f0f2f5;padding:24px;">
        <div style="background:#1e4e78;border-radius:12px 12px 0 0;padding:24px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">📊 Reporte Semanal</h1>
          <p style="color:#38bdf8;margin:4px 0 0;">${semana}</p>
        </div>
        <div style="background:#fff;border-radius:0 0 12px 12px;padding:24px;">
          <p style="color:#334155;">Hola <strong>${nombreUsuario}</strong>, aquí está el resumen de inventario de esta semana:</p>

          <div style="display:flex;gap:12px;margin:20px 0;">
            <div style="flex:1;background:#f0f9ff;border:1px solid #bae6fd;padding:16px;border-radius:10px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#1e4e78;">${totalProductos}</div>
              <div style="color:#64748b;font-size:13px;margin-top:4px;">Productos totales</div>
            </div>
            <div style="flex:1;background:#fef2f2;border:1px solid #fecaca;padding:16px;border-radius:10px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#dc2626;">${productosEnAlerta.length}</div>
              <div style="color:#64748b;font-size:13px;margin-top:4px;">Requieren reposición</div>
            </div>
          </div>

          <h3 style="color:#1e4e78;font-size:15px;">Productos por reponer:</h3>
          <ul style="padding-left:20px;color:#334155;">${alertasHTML}</ul>

          ${movimientosRecientes.length > 0 ? `
            <h3 style="color:#1e4e78;font-size:15px;margin-top:24px;">Últimos movimientos de la semana:</h3>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f1f5f9;">
                  <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;">Producto</th>
                  <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;">Tipo</th>
                  <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;">Cantidad</th>
                  <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;">Fecha</th>
                </tr>
              </thead>
              <tbody>${movimientosHTML}</tbody>
            </table>
          ` : ''}

          <p style="margin-top:24px;color:#94a3b8;font-size:12px;">Reporte generado automáticamente cada lunes por InvenStock.</p>
        </div>
      </div>
    `,
  })
}

module.exports = { sendStockAlertEmail, sendWeeklyReportEmail }
```

---

## 6. Conectar alertas de stock con el email

En el lugar donde ya se emite el evento de Socket.IO `nueva_notificacion` por stock bajo (controlador de movimientos o de productos), agregar el envío de email **al mismo tiempo**:

```javascript
const { sendStockAlertEmail } = require('../services/email.service')

// Dentro de la función que detecta stock bajo, después de emitir el socket:
// io.emit('nueva_notificacion', { ... })   ← ya existe

// ↓ NUEVO: enviar email a los usuarios que lo tengan habilitado
const usuariosConEmail = await User.find({ 'preferencias.email': true }).select('email nombre')

const productosParaEmail = productosEnAlerta.map(p => ({
  nombre:     p.nombre,
  sku:        p.sku || '',
  stock:      p.stock,
  stockMinimo: p.stockMinimo || stockMinimoGlobal,
}))

for (const usuario of usuariosConEmail) {
  try {
    await sendStockAlertEmail(usuario.email, usuario.nombre, productosParaEmail)
  } catch (err) {
    console.error(`Error enviando email a ${usuario.email}:`, err.message)
  }
}
```

> **Nota:** Para evitar spam, considera solo enviar el email cuando un producto **cruza el umbral por primera vez** (añadir un campo `alertaEmailEnviada: Boolean` al producto y resetearla cuando el stock sube de nuevo).

---

## 7. Cron job — Reportes semanales

Crear el archivo `jobs/weeklyReport.job.js`:

```javascript
const cron    = require('node-cron')
const User    = require('../models/User')        // ajustar ruta
const Producto = require('../models/Producto')   // ajustar ruta
const Movimiento = require('../models/Movimiento') // ajustar ruta
const { sendWeeklyReportEmail } = require('../services/email.service')

const iniciarReporteSemanal = () => {
  // Todos los lunes a las 8:00 AM (hora del servidor)
  cron.schedule('0 8 * * 1', async () => {
    console.log('[CRON] Generando y enviando reportes semanales...')

    try {
      const usuariosConReporte = await User.find({ 'preferencias.reportes': true }).select('email nombre')
      if (usuariosConReporte.length === 0) return

      const productos = await Producto.find()

      // Usar el mínimo de cada producto, o 15 como fallback global
      const productosEnAlerta = productos.filter(p =>
        p.stock <= (p.stockMinimo || 15)
      ).map(p => ({
        nombre:     p.nombre,
        stock:      p.stock,
        stockMinimo: p.stockMinimo || 15,
      }))

      // Movimientos de la última semana
      const hace7dias = new Date()
      hace7dias.setDate(hace7dias.getDate() - 7)

      const movimientos = await Movimiento.find({ fecha: { $gte: hace7dias } })
        .populate('producto', 'nombre')
        .sort({ fecha: -1 })
        .limit(20)

      const movimientosFormateados = movimientos.map(m => ({
        producto: m.producto?.nombre || 'Producto eliminado',
        tipo:     m.tipo,
        cantidad: m.cantidad,
        fecha:    m.fecha || m.createdAt,
      }))

      for (const usuario of usuariosConReporte) {
        try {
          await sendWeeklyReportEmail(usuario.email, usuario.nombre, {
            totalProductos:       productos.length,
            productosEnAlerta,
            movimientosRecientes: movimientosFormateados,
          })
        } catch (err) {
          console.error(`[CRON] Error enviando reporte a ${usuario.email}:`, err.message)
        }
      }

      console.log(`[CRON] Reportes semanales enviados a ${usuariosConReporte.length} usuario(s)`)
    } catch (error) {
      console.error('[CRON] Error general en reporte semanal:', error)
    }
  })
}

module.exports = { iniciarReporteSemanal }
```

En el archivo principal del servidor (`server.js` / `app.js` / `index.js`), registrar el cron al arrancar:

```javascript
const { iniciarReporteSemanal } = require('./jobs/weeklyReport.job')
iniciarReporteSemanal()
```

---

## 8. Incluir preferencias en la respuesta del login (opcional pero recomendado)

Para que el frontend muestre el estado correcto al hacer login sin necesitar un request extra, incluir `preferencias` en la respuesta de `POST /api/auth/login`:

```javascript
// En el controlador de login, donde se devuelve el objeto usuario:
res.json({
  token: nuevoToken,
  usuario: {
    nombre:    usuario.nombre,
    apellido:  usuario.apellido,
    email:     usuario.email,
    rol:       usuario.rol,
    permisos:  usuario.permisos,
    ubicacion: usuario.ubicacion,
    preferencias: {          // ← NUEVO
      email:    usuario.preferencias?.email    ?? true,
      reportes: usuario.preferencias?.reportes ?? true,
    }
  }
})
```

---

## Resumen de endpoints que el frontend usa

| Método | Ruta | Cuándo se llama | Body |
|--------|------|-----------------|------|
| `GET`  | `/api/auth/preferencias` | Al abrir Configuración | — |
| `PUT`  | `/api/auth/preferencias` | Al guardar cambios en Configuración | `{ email: bool, reportes: bool }` |

Ambos requieren el header `Authorization: Bearer <token>` (el frontend lo añade automáticamente mediante el interceptor de Axios).

---

## Checklist de implementación

- [ ] Instalar `node-cron` (`resend` ya está)
- [ ] Agregar `RESEND_API_KEY` y `EMAIL_FROM` al `.env`
- [ ] Agregar campo `preferencias` al modelo de Usuario y migrar datos existentes
- [ ] Crear `services/email.service.js` con las dos funciones
- [ ] Implementar `GET /api/auth/preferencias`
- [ ] Implementar `PUT /api/auth/preferencias`
- [ ] Conectar alertas de stock bajo con `sendStockAlertEmail`
- [ ] Crear `jobs/weeklyReport.job.js` e inicializarlo en el servidor
- [ ] (Opcional) Incluir `preferencias` en la respuesta del login
