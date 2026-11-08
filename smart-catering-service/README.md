# Smart Food Catering Service & POS Backend

A production-grade Spring Boot 3 REST API for an **online-only food catering and event booking system**. It manages catering party trays, banquet orders, server-calculated billing with tax, digital PDF receipts via OpenPDF, kitchen preparation workflows (KDS), WhatsApp receipt delivery, and daily/monthly income analytics.

---

## 🚀 Key Features

1. **Role-Based Access Control (RBAC)**:
   - **ADMIN**: Complete system governance (user management, menu catalog, order lifecycle, daily income & monthly category analytics).
   - **STAFF**: Fast catering booking, order management, WhatsApp receipt sharing.
   - **KITCHEN**: Real-time kitchen display system (KDS) Kanban tickets with elapsed preparation timers and urgency levels (`NORMAL`, `WARNING`, `URGENT`).
   - **CUSTOMER**: Public catalog browsing, online event booking, multi-step order tracking, and receipt access.

2. **Tamper-Proof Financial Calculations**:
   - Client totals are never trusted. The server verifies each item price directly from the database, sums subtotals using high-precision `BigDecimal`, and automatically calculates tax (5%) and grand totals.

3. **Digital OpenPDF Branded Receipts**:
   - `GET /api/receipts/{orderId}/view`: Displays PDF inline in the browser viewer.
   - `GET /api/receipts/{orderId}/download`: Downloads the branded PDF as an attachment.
   - Secured by **signed, expiring cryptographic tokens** so customers can open their receipts directly from WhatsApp without logging in.

4. **Multi-Strategy WhatsApp Receipt Delivery**:
   - **Deep Link (`wa.me`)**: Generates prefilled WhatsApp messages with event details and a secure signed receipt link.
   - **WhatsApp Business Cloud API**: Automated direct document messaging via Meta Graph API.
   - Pluggable via the `WhatsAppService` interface and configurable via `app.whatsapp.default-provider`.

5. **Google Maps Distance & ETA Integration**:
   - Calculates delivery distance and estimated arrival time from the central catering kitchen to customer event venues.

6. **Interactive OpenAPI / Swagger UI**:
   - Fully interactive documentation available at `/swagger-ui.html` with Bearer token authentication.

---

## 🛠️ Architecture & Tech Stack

- **Language & Framework**: Java 17+, Spring Boot 3.3.5, Maven
- **Security**: Spring Security 6 (Stateless JWT with JJWT 0.12.6, BCrypt password hashing, method-level `@PreAuthorize`)
- **Persistence**: Spring Data JPA, Hibernate, MySQL, Flyway Migrations
- **PDF Generation**: OpenPDF 2.0.3 (LibrePDF)
- **Documentation**: SpringDoc OpenAPI 2.6.0 (Swagger UI)

### Strict Layered Architecture
```
src/main/java/com/cateringpos/
├── controller/         # REST Controllers only (Returns ResponseEntity<ApiResponse<T>>)
├── dto/                # Request & Response DTOs (Never expose JPA entities directly)
│   ├── request/
│   └── response/
├── service/            # Service INTERFACES (Polymorphism & decoupling)
├── service/impl/       # Implementations with @Transactional business logic
├── repository/         # Spring Data JPA Repositories
├── entity/             # JPA Entities (Audited with BaseEntity)
├── enums/              # Role, OrderStatus, OrderType, PaymentMethod, PaymentStatus
├── mapper/             # Clean entity <-> DTO mappers
├── security/           # JwtUtil, JwtAuthenticationFilter, CustomUserDetails, SecurityConfig
├── config/             # OpenAPI, WhatsApp, Google Maps, Catering properties, CORS
└── exception/          # Custom exceptions & @RestControllerAdvice GlobalExceptionHandler
```

---

## 👥 Seed Credentials (Pre-loaded via Flyway V2)

| Role | Username | Password | Email |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `password123` | `admin@stitchcatering.com` |
| **STAFF** | `staff` | `password123` | `staff@stitchcatering.com` |
| **KITCHEN** | `kitchen` | `password123` | `kitchen@stitchcatering.com` |
| **CUSTOMER**| `customer` | `password123` | `customer@example.com` |

---

## ⚙️ Configuration & Environment Variables

Configure application settings in `src/main/resources/application.yml` or override via environment variables:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `SERVER_PORT` | `8080` | Port the backend server listens on |
| `DB_URL` | `jdbc:mysql://localhost:3306/caterpos` | MySQL connection URL |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | `root` | Database password |
| `JWT_SECRET` | 256-bit development key | HMAC-SHA secret for access tokens |
| `RECEIPT_SECRET` | 256-bit development key | HMAC-SHA secret for signed receipt tokens |
| `WHATSAPP_PROVIDER`| `deeplink` | `deeplink` or `cloudapi` |
| `WHATSAPP_PHONE_NUMBER_ID`| *(optional)* | Meta WhatsApp Cloud API Phone Number ID |
| `WHATSAPP_ACCESS_TOKEN` | *(optional)* | Meta WhatsApp Cloud API Access Token |
| `GOOGLE_MAPS_API_KEY` | *(optional)* | Google Maps Distance Matrix API Key |
| `CORS_ALLOWED_ORIGINS`| `http://localhost:5173,http://localhost:3000` | Allowed frontend origins |

---

## 🏃 Running the Application

### 1. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS caterpos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Build and Run
Using the Maven wrapper included in the project:
```bash
# Compile and run all automated tests
./mvnw clean test

# Run the Spring Boot application
./mvnw spring-boot:run
```

### 3. Explore APIs via Swagger UI
Open your browser and navigate to:
```
http://localhost:8080/swagger-ui.html
```
Authenticate by calling `POST /api/auth/login`, copy the returned JWT `accessToken`, and click **Authorize** in Swagger UI.

---

## 📋 Key REST Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a customer account
- `POST /api/auth/login` - Authenticate with credentials and receive JWT tokens
- `POST /api/auth/refresh` - Exchange refresh token for a new access token
- `GET /api/auth/me` - Get profile of currently authenticated user

### Catering Categories & Menu (`/api/categories`, `/api/menu-items`)
- `GET /api/categories` - Public active categories
- `GET /api/menu-items?categoryId=&search=` - Public menu items search
- `POST /api/categories`, `POST /api/menu-items` - Admin CRUD operations
- `PATCH /api/menu-items/{id}/toggle-availability` - Admin/Staff inventory toggle

### Catering Orders & Booking (`/api/orders`)
- `POST /api/orders` - Place event booking / catering order
- `GET /api/orders` - Paginated orders list with date & status filters (Admin, Staff)
- `GET /api/orders/{id}` - Retrieve order details by ID
- `GET /api/orders/number/{orderNumber}` - Order status tracking
- `PATCH /api/orders/{id}/status` - Order lifecycle transition
- `POST /api/orders/{id}/send-receipt` - Generate signed receipt and WhatsApp delivery link

### Kitchen Display System (`/api/kitchen`)
- `GET /api/kitchen/tickets` - Active tickets (`PENDING`, `PREPARING`, `READY`) with elapsed timers
- `PATCH /api/kitchen/tickets/{id}/status` - Progress ticket to next station

### Reports & Analytics (`/api/reports`)
- `GET /api/reports/daily?date=YYYY-MM-DD` - Daily revenue, completed orders count, average order value
- `GET /api/reports/monthly?year=YYYY&month=MM` - Monthly income, category percentage share, top selling catering items

### Digital Receipts (`/api/receipts`)
- `GET /api/receipts/{orderId}/view?token={signedToken}` - View PDF inline in browser
- `GET /api/receipts/{orderId}/download?token={signedToken}` - Download PDF receipt

