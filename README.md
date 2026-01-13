# Inventory Management System

Sistem manajemen inventaris produk dan user dengan role-based access control. Built with React, Express.js, dan PostgreSQL.

---

## 🚀 Instalasi

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** v12+ ([Download](https://www.postgresql.org/download/))
- **pnpm** (recommended) atau npm/yarn
  ```bash
  npm install -g pnpm
  ```

### Step 1: Clone/Extract Project

```bash
git clone https://github.com/bagusangkasawan/technical-test-jfd-lsp-dm.git
cd technical-test-jfd-lsp-dm
```

### Step 2: Install Backend Dependencies

```bash
cd backend
pnpm install
# atau npm install jika menggunakan npm
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
pnpm install
# atau npm install jika menggunakan npm
```

---

## 🗄️ Setup Database

### Step 1: Buat Database PostgreSQL

```bash
# Buka PostgreSQL terminal (psql)
psql -U postgres

# Buat database baru
CREATE DATABASE inventory_db;

# Exit dari psql
\q
```

### Step 2: Konfigurasi Environment Variables

#### Backend (.env)

Buka `backend/.env` dan sesuaikan dengan konfigurasi PostgreSQL lokal:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=inventory_db
DB_PASSWORD=your_password_here
DB_PORT=5432

# Server Configuration
PORT=3000
```

**Note:** Ganti `your_password_here` dengan password PostgreSQL Anda.

#### Frontend (.env)

Buka `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 3: Inisialisasi Database

```bash
cd backend
pnpm run init-db
# atau npm run init-db
```

Script ini akan:
- ✅ Membuat table roles, users, dan products
- ✅ Seed data initial (1 Admin + 5 Sellers + 5 Customers + 10 Products)
- ✅ Setup foreign keys dan constraints

**Output yang diharapkan:**
```
🔄 Memulai inisialisasi database...
🗑️  Menghapus tabel lama jika ada...
🏗️  Membuat struktur tabel...
🌱 Mengisi data awal...
✅ Inisialisasi database selesai! Data berhasil dibuat.
```

---

## ▶️ Menjalankan Project

### Terminal 1: Backend Server

```bash
cd backend
pnpm run dev
# atau npm run dev
```

Expected output:
```
🚀 Server berjalan di http://localhost:3000
📚 API Documentation: http://localhost:3000/api-docs
```

### Terminal 2: Frontend Development Server

```bash
cd frontend
pnpm run dev
# atau npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Akses Aplikasi

- **Frontend**: http://localhost:5173/
- **API Documentation**: http://localhost:3000/api-docs
- **API Base**: http://localhost:3000/api

---

## ✨ Fitur yang Sudah Selesai

### Frontend (React + TypeScript + Tailwind CSS)

#### ✅ Responsive Design
- Mobile-first approach dengan breakpoints sm:, md:, lg:
- Adapti layout untuk semua ukuran layar (mobile, tablet, desktop)
- Custom select dropdown styling dengan icon yang proper

#### ✅ Halaman Manajemen Inventaris
- **Daftar Produk**: Table view dengan sorting dan pagination
- **Tambah Produk**: Form untuk input nama, harga (dengan auto-formatter), dan stok
- **Jual Produk**: Kurangi stok dengan atomic transaction di backend
- **Format Harga Pintar**: 
  - Desktop: `Rp 15.000.000` (full format dengan titik separator)
  - Mobile: `Rp 15jt` (compact format: rb, jt, m, t)

#### ✅ Halaman Manajemen User
- **Daftar User**: Table view (desktop) & Card view (mobile) dengan user info
- **Role Badges**: Color-coded badge (Admin=red, Seller=blue, Pelanggan=purple)
- **Update Role**: Dropdown untuk ubah role user dengan validasi
- **Responsive Form**: Menyesuaikan layout untuk berbagai ukuran layar

#### ✅ Notification System
- Toast notification dengan auto-dismiss (4 detik)
- Success (green) dan Error (red) variants
- Proper z-index layering (z-[9999])
- Smooth slide-in animation dari kanan

#### ✅ Professional Dark Theme
- Glassmorphism effect dengan backdrop blur
- Slate-900 gradient background
- Indigo accent colors (#4f46e5)
- Custom scrollbar styling
- Smooth transitions dan hover effects

#### ✅ Code Documentation
- JSDoc comments untuk setiap component dan function
- Inline comments menjelaskan logic yang kompleks
- README frontend dengan struktur project

### Backend (Express.js + TypeScript + PostgreSQL)

#### ✅ API Endpoints

**Products:**
- `GET /api/products` - Ambil semua produk
- `POST /api/products` - Tambah produk baru
- `POST /api/products/:id/sell` - Kurangi stok (atomic transaction)

**Users:**
- `GET /api/users` - Ambil semua user dengan role info
- `GET /api/users/roles` - Ambil daftar roles
- `PUT /api/users/:id/change-role` - Update role user

#### ✅ Database Design
- **Roles Table**: id, name (Admin, Seller, Pelanggan)
- **Users Table**: id, name, email, password, role_id (FK), created_at
- **Products Table**: id, name, stock, price, created_at
- Proper foreign key constraints dan ON DELETE behavior

#### ✅ Advanced Features
- **Database Transactions**: Atomic operations untuk sell product dengan row locking
- **Stock Validation**: Cek stok > 0 sebelum transaksi jual
- **Role Validation**: Validasi role_id sebelum update user
- **Error Handling**: Comprehensive error messages dengan status codes

#### ✅ API Documentation
- **Swagger UI** di `/api-docs`
- OpenAPI 3.0 specification lengkap
- Interactive API testing di browser
- Request/response examples untuk setiap endpoint
- Schema definitions untuk Product, User, Role

#### ✅ Code Quality
- TypeScript untuk type safety
- Proper error logging dengan prefix emoji
- Indentation dan formatting konsisten
- JSDoc comments untuk setiap function
- Environment variables configuration

#### ✅ Database Seeding
- Initial data setup otomatis via `init-db` script
- 1 Admin + 5 Sellers + 5 Pelanggan
- 10 produk dengan harga dan stok realistis
- Atomic transaction dengan rollback support

---

## 📁 Struktur Project

```
technical-test-jfd-lsp-dm/
├── README.md                    # Project documentation
├── backend/                     # Express.js + PostgreSQL
│   ├── .env                    # Environment variables (local)
│   ├── .env.example            # Template env variables
│   ├── package.json            # Dependencies & scripts
│   ├── tsconfig.json           # TypeScript config
│   └── src/
│       ├── server.ts           # Express app setup
│       ├── swagger.ts          # Swagger/OpenAPI spec
│       ├── config/
│       │   └── database.ts     # PostgreSQL pool config
│       ├── controllers/
│       │   ├── productController.ts
│       │   └── userController.ts
│       ├── routes/
│       │   ├── productRoutes.ts
│       │   └── userRoutes.ts
│       └── database/
│           └── initDb.ts       # Database initialization
│
└── frontend/                    # React + TypeScript + Vite
    ├── .env                    # Environment variables (local)
    ├── .env.example            # Template env variables
    ├── package.json            # Dependencies & scripts
    ├── vite.config.ts          # Vite config
    ├── tsconfig.json           # TypeScript config
    └── src/
        ├── main.tsx            # Entry point
        ├── App.tsx             # Root component
        ├── index.css           # Global styles & animations
        ├── components/
        │   └── Notification.tsx
        ├── layouts/
        │   └── MainLayout.tsx  # Navbar + Sidebar + Footer
        ├── pages/
        │   ├── InventoryPage.tsx
        │   └── UserManagementPage.tsx
        ├── services/
        │   └── api.ts          # Axios API client
        └── types/
            └── index.ts        # TypeScript interfaces
```

---

## 📚 API Documentation

### Swagger UI

Akses dokumentasi interaktif di: **http://localhost:3000/api-docs**

Fitur:
- Lihat semua endpoints dengan deskripsi lengkap
- Test API langsung dari browser
- Contoh request dan response
- Schema validation

### Health Check

```bash
curl http://localhost:3000/
```

Response:
```json
{
  "message": "API Inventory System Ready",
  "version": "1.0.0",
  "documentation": "http://localhost:3000/api-docs",
  "endpoints": {
    "products": "GET /api/products",
    "addProduct": "POST /api/products",
    "sellProduct": "POST /api/products/:id/sell",
    "users": "GET /api/users",
    "roles": "GET /api/users/roles",
    "changeRole": "PUT /api/users/:id/change-role"
  }
}
```

## 🛠️ Development Commands

### Backend

```bash
cd backend

# Install dependencies
pnpm install

# Initialize database
pnpm run init-db

# Start development server (with hot reload)
pnpm run dev

# Build TypeScript
pnpm run build

# Start production server
pnpm run start
```

### Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

---

## 🐛 Troubleshooting

### Database Connection Error

**Error:** `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`

**Solution:**
1. Cek `.env` file - pastikan `DB_PASSWORD` ada dan benar
2. Verify PostgreSQL running: `psql -U postgres`
3. Cek database exists: `\l` dalam psql

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill process di port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Frontend Can't Connect to API

**Error:** `Network Error: Failed to connect to backend`

**Solution:**
1. Cek backend running di port 3000
2. Verify `VITE_API_BASE_URL` di `.env` frontend
3. Check CORS enabled di backend (default enabled)

---

## 📝 Notes

- Default port untuk backend: **3000**
- Default port untuk frontend: **5173**
- Database: **PostgreSQL** di localhost:5432
- ORM: **None** (raw SQL queries dengan pg library)

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Bagus Angkasawan Sumantri Putra - Sistem Manajemen Inventaris (Technical Test)

---
