# Client Admin - Panel Administrativo Web

Frontend web para administradores de la plataforma KinalSports construido con React 19 y Vite.

## 📋 Descripción

Aplicación web SPA (Single Page Application) que permite a administradores gestionar campos deportivos, confirmar/rechazar reservas, administrar usuarios, torneos y equipos. Consume los servicios de autenticación y management API.

## 🛠️ Tech Stack

- **Framework**: React 19.2
- **Build Tool**: Vite 7.x
- **Routing**: React Router DOM 7.x
- **UI Components**: Material Tailwind React 2.x
- **Styling**: TailwindCSS 4.x
- **Icons**: Heroicons React 2.x
- **HTTP Client**: Axios 1.x
- **State Management**: Zustand 5.x
- **Formularios**: React Hook Form 7.x
- **Notificaciones**: React Hot Toast 2.x

## 🚀 Instalación

```bash
# Clonar e instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
pnpm dev
```

> **pnpm 11:** si `pnpm install` falla con `ERR_PNPM_IGNORED_BUILDS` (esbuild), asegúrate de que `pnpm-workspace.yaml` tenga `allowBuilds: esbuild: true`, o ejecuta `pnpm approve-builds esbuild`.

## ⚙️ Variables de Entorno

El proyecto usa variables de entorno con prefijo `VITE_`. Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `VITE_AUTH_URL` | Sí | URL base de la API de autenticación |
| `VITE_ADMIN_URL` | Sí | URL base de la API de administración |
| `VITE_CLOUDINARY_BASE_URL` | No | Base de Cloudinary para imágenes (tiene valor por defecto en el código) |

```env
VITE_AUTH_URL=http://localhost:5156/api/v1
VITE_ADMIN_URL=http://localhost:3009/kinalSportsAdmin/v1
VITE_CLOUDINARY_BASE_URL=https://res.cloudinary.com/dug3apxt3/image/upload/
```

> El archivo `.env` no debe versionarse. Mantén actualizado `.env.example` cuando agregues nuevas variables.

## Estructura

El proyecto sigue una organización por **features** (feature-based):

```
client-admin/
├── public/
│   └── img/
│       └── kinal_sports.png
├── src/
│   ├── app/                      # Bootstrap de la aplicación
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── layouts/              # DashboardPage y layouts
│   │   └── router/               # AppRoutes, ProtectedRoute, RoleGuard
│   ├── features/                 # Módulos de dominio
│   │   ├── auth/                 # login, registro, verificación, reset
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── store/            # authStore, uiStore (Zustand)
│   │   ├── fields/               # campos deportivos
│   │   ├── reservations/         # reservas
│   │   ├── teams/                # equipos
│   │   ├── tournaments/          # torneos
│   │   └── users/                # gestión de usuarios
│   ├── shared/                   # Código transversal
│   │   ├── api/                  # instancia axios y endpoints
│   │   ├── components/           # layout y UI reutilizable
│   │   └── utils/                # toast, formatters, helpers
│   └── styles/
│       └── index.css
├── .env.example
├── index.html
├── vite.config.js
└── package.json
```

## Scripts Disponibles

```bash
pnpm dev       # Desarrollo con HMR (http://localhost:5173)
pnpm build     # Build para producción → dist/
pnpm preview   # Vista previa del build
pnpm lint      # ESLint
```

## Páginas y Rutas

### Rutas públicas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | AuthPage | Login y registro |
| `/verify-email` | VerifyEmailPage | Verificación de correo |
| `/reset-password` | ResetPasswordPage | Restablecer contraseña |
| `/unauthorized` | UnauthorizedPage | Acceso denegado |

### Rutas protegidas (`ADMIN_ROLE`)

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/dashboard/fields` | Fields | Gestión de campos deportivos |
| `/dashboard/reservations` | Reservations | Reservas |
| `/dashboard/teams` | Teams | Equipos |
| `/dashboard/tournaments` | Tournaments | Torneos |
| `/dashboard/users` | Users | Gestión de usuarios |

Las rutas del dashboard están protegidas por `ProtectedRoute` y `RoleGuard` (solo `ADMIN_ROLE`).

## Autenticación

### Flujo

1. El usuario inicia sesión en `LoginForm`
2. POST a `{VITE_AUTH_URL}/auth/login`
3. La respuesta incluye el JWT
4. El token se persiste con **Zustand** (`authStore`, middleware `persist`)
5. Las peticiones a la API admin llevan el header `Authorization: Bearer <token>`

### Rutas protegidas

```jsx
<ProtectedRoute>
  <RoleGuard allowedRoles={["ADMIN_ROLE"]}>
    <DashboardPage />
  </RoleGuard>
</ProtectedRoute>
```

## UI Components

### Material Tailwind

Usa componentes pre-construidos de Material Tailwind:

```javascript
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
```

### Heroicons

```javascript
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
```

## Servicios API

Las llamadas HTTP están en `src/shared/api/`:

- **`api.js`** — instancias Axios (`authApi`, `adminApi`) con `baseURL` desde `VITE_AUTH_URL` y `VITE_ADMIN_URL`, interceptores para token y manejo de errores
- **`auth.js`** — login, registro, verificación de email, usuarios
- **`admin.js`** — campos, reservas, equipos, torneos

```javascript
// Ejemplo: login (src/shared/api/auth.js)
export const login = (credentials) =>
  authApi.post("/auth/login", credentials);
```

## Dependencias con Otros Servicios

- **auth-node / auth-service**: Login, registro, gestión de perfil
- **server-admin**: Gestión de campos, reservas, torneos
- Ambos servicios deben estar corriendo para funcionalidad completa

## Estilos

Tailwind CSS 4 se integra vía `@tailwindcss/vite` en `vite.config.js`. Los estilos globales están en `src/styles/index.css`.

## Build y Deployment

```bash
pnpm build    # Genera dist/
pnpm preview  # Sirve dist/ localmente
```

Configura en el hosting las mismas variables `VITE_*` que en `.env` (Vite las embebe en build time).

## Notas de Desarrollo

- Vite dev server corre en `http://localhost:5173` por defecto
- HMR (Hot Module Replacement) activado
- Fast Refresh para React
- Variables de entorno deben prefijarse con `VITE_`
- Assets en `public/` se sirven desde raíz
- ESLint configurado con reglas para React Hooks y React Refresh

## 👤 Autor

**Braulio Echeverria**

## 📄 Licencia

MIT
