# API REST de Propiedades

Backend para un sistema de gestion de propiedades inmobiliarias. Incluye Express, PostgreSQL, Prisma, JWT, validaciones con Zod, filtros, paginacion y versionamiento `/api/v1`.

## Tecnologias

- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT
- Zod
- Helmet, CORS y Morgan

## Instalacion

```bash
npm install
```

Copia `.env.example` a `.env` y configura la conexion de PostgreSQL:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="cambia_este_secreto"
PORT=3000
```

Crear tablas y generar Prisma Client:

```bash
npm run prisma:migrate
npm run seed
```

Ejecutar en desarrollo:

```bash
npm run dev
```

La API queda disponible en:

```text
http://localhost:3000/api/v1
```

## Autenticacion

Endpoint:

```http
POST /api/v1/auth/login
```

Body:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "token": "JWT_TOKEN"
}
```

Usar el token en rutas protegidas:

```http
Authorization: Bearer JWT_TOKEN
```

## Endpoints

```http
GET /api/v1/health
```

```http
GET /api/v1/properties
GET /api/v1/properties/:id
POST /api/v1/properties
PUT /api/v1/properties/:id
DELETE /api/v1/properties/:id
```

Las rutas `POST`, `PUT` y `DELETE` requieren JWT.

## Filtros y paginacion

```http
GET /api/v1/properties?location=Medellin&minPrice=100000000&maxPrice=500000000&page=1&limit=5
```

Respuesta:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 5
}
```

## Ejemplo de creacion

```http
POST /api/v1/properties
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

```json
{
  "title": "Apartamento en Medellin",
  "price": 350000000,
  "location": "El Poblado",
  "available": true
}
```

## Validaciones

Se usa Zod para validar:

- Body: `title`, `price`, `location`, `available`
- Params: `id` numerico positivo
- Query params: `location`, `minPrice`, `maxPrice`, `page`, `limit`

Los errores invalidos responden `400`, rutas sin token responden `401`, registros inexistentes responden `404` y errores inesperados responden `500`.

## Arquitectura

```text
src/
  domain/
  application/
  infrastructure/
  interfaces/
```

Flujo de ejemplo `GET /api/v1/properties`:

1. La ruta recibe la solicitud.
2. El middleware valida los query params con Zod.
3. El controlador llama al servicio.
4. El servicio construye filtros, pagina y consulta PostgreSQL con Prisma.
5. El controlador responde con `data`, `total`, `page` y `limit`.

## Decisiones tecnicas

- Prisma permite trabajar PostgreSQL con modelos claros y migraciones.
- Zod centraliza las validaciones y evita datos invalidos antes de llegar al servicio.
- JWT protege solo las operaciones que modifican datos.
- `/api/v1` permite versionar la API sin romper clientes futuros.
