# Server User - API Pública de Usuarios

API RESTful para que usuarios finales consulten campos disponibles y gestionen sus reservas en la plataforma KinalSports.

## 📋 Descripción

Servicio backend público que permite a usuarios autenticados explorar campos deportivos disponibles, crear reservas, consultar su historial y cancelar reservas. Comparte la base de datos MongoDB con `server-admin`.

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+ (ESM)
- **Framework**: Express 5.x
- **Base de Datos**: MongoDB 6.0+ (compartida con server-admin)
- **ODM**: Mongoose 8.x
- **Autenticación**: JWT (validación contra auth-service)
- **Seguridad**: Helmet, CORS, Rate Limiting

## 🚀 Instalación

```bash
# Desde la raíz del monorepo
pnpm install

# O específicamente este servicio
pnpm --filter server-user install
```

## ⚙️ Variables de Entorno

Crear archivo `.env` en `server-user/`:

```env
# Server
NODE_ENV=development
PORT=3003

# MongoDB (comparte base de datos con server-admin)
URI_MONGODB=mongodb://localhost:27017/kinalsports

# JWT Configuration
JWT_SECRET=tu-secret-key-aqui
JWT_ISSUER=KinalSportsAuth
JWT_AUDIENCE=KinalSportsAPI
```

## 📂 Estructura

```
server-user/
├── configs/
│   ├── app.js                    # Configuración principal del servidor
│   ├── db.js                     # Conexión MongoDB
│   ├── cors-configuration.js     # Configuración CORS
│   └── helmet-configuration.js   # Headers de seguridad
├── helpers/
│   └── validation-helpers.js     # Helpers de validación
├── middlewares/
│   ├── validate-JWT.js           # Verificación de tokens JWT
│   ├── reservation-validators.js # Validadores de reservas
│   ├── reservation-conflict.js   # Validación de conflictos
│   └── handle-errors.js          # Manejo centralizado de errores
├── src/
│   ├── fields/
│   │   ├── field.controller.js   # Controladores de campos (solo lectura)
│   │   ├── field.model.js        # Modelo Field (compartido con admin)
│   │   └── field.routes.js       # Rutas de campos
│   ├── reservations/
│   │   ├── reservation.controller.js # Controladores de reservas
│   │   ├── reservation.model.js      # Modelo Reservation (compartido)
│   │   └── reservation.routes.js     # Rutas de reservas
│   ├── teams/                    # ⚠️ Carpeta vacía - no implementado
│   └── tournaments/              # ⚠️ Carpeta vacía - no implementado
├── utils/
│   └── validation-utils.js       # Utilidades de validación
└── index.js                      # Punto de entrada
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo con auto-reload
pnpm --filter server-user dev

# Producción
pnpm --filter server-user start

# Lint
pnpm --filter server-user lint
pnpm --filter server-user lint:fix
```

## 🔌 Endpoints Principales

**Base Path**: `/kinalSportsUser/v1`

### Campos Deportivos (Solo Lectura)

| Método | Endpoint                         | Descripción               | Auth |
| ------ | -------------------------------- | ------------------------- | ---- |
| GET    | `/kinalSportsUser/v1/fields`     | Listar campos disponibles | No   |
| GET    | `/kinalSportsUser/v1/fields/:id` | Ver detalles de un campo  | No   |

### Reservas

| Método | Endpoint                                           | Descripción                 | Auth |
| ------ | -------------------------------------------------- | --------------------------- | ---- |
| POST   | `/kinalSportsUser/v1/reservations`                 | Crear nueva reserva         | Sí   |
| GET    | `/kinalSportsUser/v1/reservations/:id`             | Ver detalles de una reserva | Sí   |
| DELETE | `/kinalSportsUser/v1/reservations/:id/cancel`      | Cancelar reserva            | Sí   |
| GET    | `/kinalSportsUser/v1/reservations/my-reservations` | Listar reservas del usuario | Sí   |

### Torneos

**Nota**: Los endpoints de torneos aún no están implementados (carpeta `tournaments/` vacía).

### Equipos

**Nota**: Los endpoints de equipos aún no están implementados (carpeta `teams/` vacía).

### Health Check

| Método | Endpoint                     | Descripción         |
| ------ | ---------------------------- | ------------------- |
| GET    | `/kinalSportsUser/v1/health` | Estado del servicio |

### Ejemplo de Requests

**Listar Campos Disponibles:**

```bash
GET http://localhost:3003/kinalSportsUser/v1/fields
```

**Crear Reserva:**

```bash
POST http://localhost:3003/kinalSportsUser/v1/reservations
Authorization: Bearer <user-jwt-token>
Content-Type: application/json

{
  "fieldId": "507f1f77bcf86cd799439011",
  "startTime": "2025-11-21T10:00:00.000Z",
  "endTime": "2025-11-21T12:00:00.000Z"
}
```

**Mis Reservas:**

```bash
GET http://localhost:3003/kinalSportsUser/v1/reservations/my-reservations
Authorization: Bearer <user-jwt-token>
```

**Cancelar Reserva:**

```bash
DELETE http://localhost:3003/kinalSportsUser/v1/reservations/507f1f77bcf86cd799439011/cancel
Authorization: Bearer <user-jwt-token>
```

## 🗄️ Modelos de Base de Datos

### Field (Campo Deportivo) - Compartido con server-admin

```javascript
{
  _id: ObjectId,
  fieldName: String (required, max 100),
  description: String (max 500),
  fieldType: String (enum: 'NATURAL', 'SINTETICA', 'CONCRETO'),
  capacity: String (enum: 'FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11'),
  pricePerHour: Number (required, min 0),
  photo: String (Cloudinary URL),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation (Reserva) - Compartido con server-admin

```javascript
{
  _id: ObjectId,
  userId: String (UUID del auth-service),
  fieldId: ObjectId (ref: Field),
  startTime: Date (required),
  endTime: Date (required),
  status: String (enum: 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'),
  confirmation: {
    confirmedAt: Date,
    confirmedBy: String
  },
  lastModifiedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Autenticación

Este servicio valida tokens JWT emitidos por `auth-service`:

1. **Middleware `validate-JWT.js`**: Verifica token en header `Authorization: Bearer <token>`
2. Decodifica el token y extrae información del usuario
3. Valida `JWT_SECRET`, `JWT_ISSUER`, y `JWT_AUDIENCE`

**Rutas públicas** (sin auth):

- GET `/kinalSportsUser/v1/fields`
- GET `/kinalSportsUser/v1/fields/:id`
- GET `/kinalSportsUser/v1/health`

**Rutas protegidas** (requieren JWT):

- POST `/kinalSportsUser/v1/reservations`
- GET `/kinalSportsUser/v1/reservations/:id`
- DELETE `/kinalSportsUser/v1/reservations/:id/cancel`
- GET `/kinalSportsUser/v1/reservations/my-reservations`

## 🔗 Dependencias con Otros Servicios

- **auth-node / auth-service**: Valida tokens JWT
- **server-admin**: Comparte modelos Field y Reservation en MongoDB
- **client-user** (futuro): Frontend móvil que consumirá estos endpoints

## 🛡️ Validaciones y Seguridad

- **Validación de conflictos**: No permite reservas superpuestas
- **Validación de horarios**: `startTime` < `endTime`
- **Validación de ownership**: Solo el dueño puede cancelar su reserva
- **Rate limiting**: Configurado en middlewares
- **CORS**: Configurado en `cors-configuration.js`

## 📝 Notas de Desarrollo

- El servidor escucha en puerto 3003 (configurable en `.env`)
- Base path: `/kinalSportsUser/v1`
- Comparte MongoDB con `server-admin`
- Los modelos Field y Reservation son los mismos que en server-admin
- Carpetas `teams/` y `tournaments/` están vacías (pendiente implementación)

## 🚀 Próximas Funcionalidades

- [ ] CRUD de equipos
- [ ] Consulta de torneos
- [ ] Sistema de notificaciones
- [ ] Historial de reservas con paginación
- [ ] Ratings y reviews de campos

## 👤 Autor

**Braulio Echeverria**

## 📄 Licencia

MIT
