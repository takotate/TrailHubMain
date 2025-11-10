# TrailHub Backend

A modular monolith backend built with Node.js/Express + Socket.IO + PostgreSQL(+PostGIS) + Firebase Auth/Storage.

## 🏗️ Architecture

**Modular Monolith with MVC layering:**
- **Application Layer**: Server bootstrap, config, middleware, routing
- **Shared Layer**: Database pool, logging utilities  
- **Adapters Layer**: Firebase Auth/Storage, Payments, Maps integrations
- **Modules Layer**: 9 business modules with controllers, repositories, gateways

## 📁 Project Structure

```
src/
├── app/                      # Application layer (bootstrap, middleware, routing)
│   ├── index.js             # Server bootstrap & startup (express + socket wiring)
│   ├── config.js            # Environment configuration loader
│   ├── routes.js            # Main router mounting all module routers
│   ├── auth.middleware.js   # Firebase token verification -> attaches user to req
│   ├── roles.middleware.js  # Role-based access control (requireRole helper)
│   └── errors.js            # Centralized error definitions & helpers
├── shared/                   # Shared utilities used across modules
│   ├── db.js                # PostgreSQL pool management / query helpers
│   └── logger.js            # JSON console logger wrapper
├── adapters/                 # Adapters for external services (thin ports)
│   ├── firebase.auth.js     # Firebase Authentication adapter (verify tokens)
│   ├── firebase.storage.js  # Firebase Storage adapter (upload helpers)
│   ├── payments.adapter.js  # Payment provider adapter (stripe/payments stub)
│   └── maps.adapter.js      # Geocoding / maps adapter
├── gateway/                  # Real-time and DB gateways
│   ├── db.js                # Alternative DB gateway (if used by chat/socket)
│   └── socket.js            # Socket.IO server wiring
├── controllers/              # Small app-level controllers (health etc.)
│   └── healthController.js   # /healthz handler
├── middleware/               # Express middleware (request logging, error handler)
│   ├── requestLogger.js
│   └── errorHandler.js
├── repositories/             # Shared repository base classes
│   ├── baseRepository.js
│   └── userRepository.js
├── modules/                  # Business modules (each follows MVC internally)
│   ├── identity/             # Identity module (controllers + repository)
│   │   ├── controller/
│   │   └── repository/
│   ├── users/                # User accounts & profiles
│   │   ├── controller/
│   │   └── repository/
│   ├── guides/               # Guides domain (models, repo, controller)
│   │   ├── guide.model.js
│   │   ├── controller/
│   │   └── repository/
│   ├── hikes/                # Hike (trail) management
│   │   ├── controller/
│   │   └── repository/
│   ├── bookings/             # Reservation system
│   │   ├── controller/
│   │   └── repository/
│   ├── reviews/              # Ratings & feedback
│   │   ├── controller/
│   │   └── repository/
│   ├── chat/                 # Real-time messaging + gateway
│   │   ├── gateway/
│   │   └── repository/
│   ├── administration/       # Admin operations & reporting
│   │   ├── controller/
│   │   └── repository/
│   └── analytics/            # Read-only aggregates & reporting
│       ├── controller/
│       └── repository/
├── app.js                    # Legacy entrypoint / alternative bootstrap (keeps compat)
└── routes/                   # Route modules & v1 API composition
   ├── index.js
   └── health.js

other/
├── db/                       # Migrations and DB helpers
│   └── migrations/
│       └── README.md
├── docs/                      # Project documentation (architecture, routes, adapters)
│   ├── ARCHITECTURE.md
│   ├── Module-Map.md
│   ├── Routes-v1.md
│   ├── Adapters-Catalog.md
│   └── Chat-Gateway-Events.md
├── package.json               # npm metadata & scripts
└── README.md                  # Project README (this file)

```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL (optional for development)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd trailhub
   npm install
   ```

2. **Setup environment:**
   ```bash
   copy .env.example .env
   # Edit .env with your values (optional for development)
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

✅ The server should print “TrailHub ready” and be available at [http://localhost:3000](http://localhost:3000)


## 🔗 API Endpoints

### Health Check
- `GET /healthz` - System health status

### Identity
- `GET /api/identity/me` - Current user info (visitor, hiker, guide, admin)

### Guides  
- `GET /api/guides/:id` - Get guide profile (visitor+)
- `PATCH /api/guides/me` - Update own profile (guide)

### Hikes
- `GET /api/hikes` - List hikes (visitor+)
- `GET /api/hikes/:id` - Get hike details (visitor+)
- `POST /api/hikes` - Create hike (guide)

### Bookings
- `POST /api/bookings` - Create booking (hiker)
- `DELETE /api/bookings/:id` - Cancel booking (hiker owner)

### Reviews
- `POST /api/reviews` - Create review (hiker)
- `GET /api/guides/:id/reviews` - List guide reviews (visitor+)

### Administration
- `GET /api/admin/overview` - Admin dashboard (admin)
- `GET /api/admin/analytics` - System analytics (admin)

## 👥 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **visitor** | Anonymous user | View hikes, guides, reviews |
| **hiker** | Registered user | Book hikes, leave reviews |
| **guide** | Trail guide | Create hikes, manage bookings |
| **admin** | System admin | Full system access |

## 🔌 Socket.IO Events

### Chat Gateway (`/chat` namespace)
- **Room Pattern**: `chat:hike:{hikeId}`
- **Client Events**: `joinRoom`, `leaveRoom`, `sendMessage`, `sendPhoto`
- **Server Events**: `message`, `photo`, `systemNotice`

## 📊 Database Schema

### Module Ownership
- **users**: `users`, `user_profiles`, `user_roles`
- **guides**: `guides`, `guide_profiles`, `guide_verifications`
- **hikes**: `hikes`, `hike_media`, `routes`
- **bookings**: `bookings`, `participants`, `payment_intents`
- **chat**: `messages`, `attachments`
- **reviews**: `reviews`
- **administration**: `reports`, `moderation_actions`
- **analytics**: Read-only views/aggregates

## 🧪 Testing the Setup

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/healthz
   # Expected: {"status":"ok"}
   ```

3. **Test API endpoints:**
   ```bash
   curl http://localhost:3000/api/hikes
   # Expected: {"todo":"list hikes"}
   
   curl http://localhost:3000/api/guides/123
   # Expected: {"todo":"get guide by id"}
   ```

4. **Check server logs:**
   - Should see "TrailHub ready" message
   - Should see request logs for each API call
   - Database connection warning is expected without PostgreSQL

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Routes](docs/Routes-v1.md)
- [Permissions Matrix](docs/Permissions-Matrix.md)
- [Module Map](docs/Module-Map.md)
- [Adapters Catalog](docs/Adapters-Catalog.md)
- [Chat Gateway Events](docs/Chat-Gateway-Events.md)
- [Startup Sequence](docs/MainClass-Startup.md)
- [Guide Data Model](docs/Guide-Class.md)

## 🔧 Development Status

**Current Implementation:**
- ✅ Complete modular architecture
- ✅ All API endpoints with role guards
- ✅ Socket.IO chat gateway
- ✅ Firebase adapters (stubs)
- ✅ PostgreSQL integration (resilient)
- ✅ Comprehensive documentation

**Next Phase:**
- 🔄 Database schema implementation
- 🔄 Firebase real integration
- 🔄 Business logic implementation
- 🔄 Frontend React application
- 🔄 Testing suite
- 🔄 Production deployment

## 🛠️ Environment Variables

```bash
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/trailhub
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
STORAGE_BUCKET=
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🤝 Contributing

1. Follow the modular monolith architecture
2. Add role guards to new endpoints
3. Update documentation for new features
4. Use JSDoc for type hints
5. Keep business logic in repositories
6. Add TODOs for future implementation

---

🧱 Frontend Integration (Current Dev Slice)

TrailHub includes a frontend prototype built with React + Vite, implementing the Hiker actor’s flow end-to-end:

Explore all hikes (GET /api/hikes)

View hike details (GET /api/hikes/:id)

Join or leave hikes (POST/DELETE /api/hikes/:id/join)

Mock authentication using the x-dev-user request header

Frontend is located in /frontend and connects to the backend at http://localhost:3000.

Run frontend locally:

cd frontend
npm install
npm run dev
# Visit http://localhost:5173

🧪 Dev Authentication (Mock Mode)

During early development, TrailHub uses a mock user header instead of Firebase Authentication:

x-dev-user: {"id":"u_hiker_1","role":"hiker","email":"hiker@example.com"}


This enables testing of user roles without authentication setup.

Role	Example Header
Hiker	{"id":"u_hiker_1","role":"hiker"}
Guide	{"id":"g1","role":"guide"}
Admin	{"id":"a1","role":"admin"}

All endpoints requiring authentication depend on this header when running in development mode.

🧭 Development Workflow

Branch structure:

main → stable branch (demo-ready)

dev → active feature development

feature/* → short-lived branches for specific features

Typical workflow:

git checkout dev
git checkout -b feature/guide-create-hike
# ... make changes ...
git push origin feature/guide-create-hike


Use pull requests to merge into dev → then into main when stable.