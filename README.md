# API REST de Propiedades

Backend para un sistema de gestión de propiedades inmobiliarias construido con Node.js, Express, PostgreSQL y Prisma. Incluye autenticación con JWT, validación de datos con Zod, filtros avanzados y paginación.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js |
| Framework | Express 5 |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Autenticación | JWT (jsonwebtoken) |
| Validación | Zod |
| Seguridad | Helmet, bcryptjs |

## Arquitectura

El proyecto sigue Clean Architecture con cuatro capas bien separadas:

```
src/
  domain/          # Errores de dominio (HttpError)
  application/     # Servicios con lógica de negocio
  infrastructure/  # Prisma Client, config, servidor Express
  interfaces/      # Controllers, routes, middlewares, schemas
```

Flujo de una petición:

```
Request → Route → Middleware (validate/auth) → Controller → Service → Prisma → DB
```

## Instalación y configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="tu_secreto_jwt_seguro"
PORT=3000
```

### 3. Crear tablas y generar Prisma Client

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 4. Poblar datos iniciales

```bash
npm run seed
```

Esto crea el usuario administrador (`admin@test.com` / `123456`) y 7 propiedades de ejemplo.

### 5. Iniciar el servidor

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

La API queda disponible en:

```
http://localhost:3000/api/v1
```

## Endpoints

### Públicos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/properties` | Listar propiedades (filtros + paginación) |
| GET | `/api/v1/properties/:id` | Obtener propiedad por ID |
| POST | `/api/v1/auth/register` | Registrar nuevo usuario |
| POST | `/api/v1/auth/login` | Obtener token JWT |

### Protegidos (requieren `Authorization: Bearer TOKEN`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/properties` | Crear propiedad |
| PUT | `/api/v1/properties/:id` | Actualizar propiedad |
| DELETE | `/api/v1/properties/:id` | Eliminar propiedad |

## Autenticación

### Registrar usuario

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "nuevo@ejemplo.com", "password": "mipassword"}'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "123456"}'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

El token tiene una validez de **2 horas**. Úsalo en rutas protegidas:

```http
Authorization: Bearer <TOKEN>
```

## Propiedades

### Listar con filtros y paginación

```bash
GET /api/v1/properties?location=Medellin&minPrice=200000000&maxPrice=600000000&available=true&page=1&limit=5
```

**Query params disponibles:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `location` | string | Filtro parcial por ubicación (case-insensitive) |
| `minPrice` | number | Precio mínimo |
| `maxPrice` | number | Precio máximo |
| `available` | boolean | `true` o `false` |
| `page` | number | Página (default: 1) |
| `limit` | number | Resultados por página, máx. 100 (default: 10) |

**Respuesta:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Apartamento moderno en El Poblado",
      "price": 350000000,
      "location": "El Poblado, Medellin",
      "available": true,
      "createdAt": "2026-04-28T12:00:00.000Z",
      "updatedAt": "2026-04-28T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 5,
  "totalPages": 1
}
```

### Obtener por ID

```bash
curl http://localhost:3000/api/v1/properties/1
```

### Crear propiedad

```bash
curl -X POST http://localhost:3000/api/v1/properties \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Apartamento en Sabaneta",
    "price": 280000000,
    "location": "Sabaneta",
    "available": true
  }'
```

Respuesta `201 Created`:

```json
{
  "id": 8,
  "title": "Apartamento en Sabaneta",
  "price": 280000000,
  "location": "Sabaneta",
  "available": true,
  "createdAt": "2026-04-28T12:00:00.000Z",
  "updatedAt": "2026-04-28T12:00:00.000Z"
}
```

### Actualizar propiedad

```bash
curl -X PUT http://localhost:3000/api/v1/properties/1 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Apartamento actualizado",
    "price": 400000000,
    "location": "El Poblado, Medellin",
    "available": false
  }'
```

### Eliminar propiedad

```bash
curl -X DELETE http://localhost:3000/api/v1/properties/1 \
  -H "Authorization: Bearer <TOKEN>"
```

Respuesta `204 No Content`.

## Validaciones

Se usa **Zod** para validar todos los datos entrantes antes de que lleguen al servicio.

| Origen | Campo | Regla |
|--------|-------|-------|
| Body | `title` | string, requerido |
| Body | `price` | número positivo |
| Body | `location` | string, requerido |
| Body | `available` | boolean |
| Params | `id` | entero positivo |
| Query | `location` | string opcional |
| Query | `minPrice` / `maxPrice` | número no negativo, minPrice ≤ maxPrice |
| Query | `available` | `"true"` o `"false"` |
| Query | `page` / `limit` | entero positivo, limit máx. 100 |

## Manejo de errores

| Código | Motivo |
|--------|--------|
| 400 | Datos de entrada inválidos |
| 401 | Token ausente, inválido o expirado; credenciales incorrectas |
| 404 | Recurso o ruta no encontrado |
| 409 | El email ya está registrado |
| 500 | Error interno del servidor |

Formato de respuesta de error:

```json
{
  "error": "Mensaje descriptivo",
  "details": [{ "field": "price", "message": "El precio debe ser mayor que cero" }]
}
```

## Scripts NPM

```bash
npm run dev              # Servidor con nodemon
npm start                # Servidor producción
npm run prisma:generate  # Regenerar Prisma Client
npm run prisma:migrate   # Aplicar migraciones
npm run prisma:studio    # Interfaz gráfica de la BD
npm run seed             # Poblar datos iniciales
```

## Decisiones técnicas

- **Prisma** permite definir el modelo de datos en un único schema, genera un cliente con tipos seguros y gestiona las migraciones sin escribir SQL manual.
- **Zod** centraliza todas las validaciones. El middleware `validate` parsea y reemplaza `req.body/query/params` con los datos ya transformados y validados, de modo que el controlador nunca recibe datos crudos.
- **JWT** protege únicamente las operaciones de escritura (`POST`, `PUT`, `DELETE`). Las lecturas son públicas para facilitar la integración con clientes sin autenticación.
- **`/api/v1`** en todos los endpoints permite agregar versiones futuras (`/api/v2`) sin romper clientes existentes.
- **Arquitectura en capas** garantiza que cada capa solo depende de la capa inmediatamente inferior, lo que facilita las pruebas unitarias y el reemplazo de implementaciones (p. ej. cambiar Prisma por Sequelize sin tocar controladores).
