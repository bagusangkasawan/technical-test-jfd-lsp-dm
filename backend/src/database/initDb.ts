import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const initDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('🔄 Memulai inisialisasi database...');

    await client.query('BEGIN');

    // 1. DROP Tables jika sudah ada (Urutan penting karena Foreign Key)
    console.log('🗑️  Menghapus tabel lama jika ada...');
    await client.query(`DROP TABLE IF EXISTS products CASCADE`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE`);
    await client.query(`DROP TABLE IF EXISTS roles CASCADE`);

    // 2. CREATE Tables
    console.log('🏗️  Membuat struktur tabel...');

    // Tabel Roles
    await client.query(`
      CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );
    `);

    // Tabel Users
    // Sesuai requirement: name, email, dll, role_id (FK)
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL, 
        role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabel Products
    // UPDATE: Menambahkan created_at sesuai requirement
    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        price INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. INSERT Data (Seeding)
    console.log('🌱 Mengisi data awal...');

    // Insert Roles
    const roleAdminRes = await client.query("INSERT INTO roles (name) VALUES ('Admin') RETURNING id");
    const roleSellerRes = await client.query("INSERT INTO roles (name) VALUES ('Seller') RETURNING id");
    const roleCustomerRes = await client.query("INSERT INTO roles (name) VALUES ('Pelanggan') RETURNING id");

    const adminRoleId = roleAdminRes.rows[0].id;
    const sellerRoleId = roleSellerRes.rows[0].id;
    const customerRoleId = roleCustomerRes.rows[0].id;

    // Insert Users
    // 1 Admin
    await client.query(`
      INSERT INTO users (name, email, password, role_id) 
      VALUES ($1, $2, $3, $4)
    `, ['Super Admin', 'admin@toko.com', 'password123', adminRoleId]);

    // 5 Sellers
    for (let i = 1; i <= 5; i++) {
      await client.query(`
        INSERT INTO users (name, email, password, role_id) 
        VALUES ($1, $2, $3, $4)
      `, [`Seller ${i}`, `seller${i}@toko.com`, 'password123', sellerRoleId]);
    }

    // 5 Pelanggan
    for (let i = 1; i <= 5; i++) {
      await client.query(`
        INSERT INTO users (name, email, password, role_id) 
        VALUES ($1, $2, $3, $4)
      `, [`Pelanggan ${i}`, `user${i}@toko.com`, 'password123', customerRoleId]);
    }

    // Insert Products (10 Items)
    // created_at akan otomatis terisi oleh default value
    const products = [
      { name: 'Laptop Gaming ASUS', stock: 10, price: 15000000 },
      { name: 'Mouse Logitech Wireless', stock: 50, price: 250000 },
      { name: 'Keyboard Mechanical RGB', stock: 30, price: 750000 },
      { name: 'Monitor LG 24 Inch', stock: 15, price: 2100000 },
      { name: 'Headset HyperX', stock: 20, price: 1200000 },
      { name: 'Webcam 1080p HD', stock: 25, price: 500000 },
      { name: 'Mousepad Extended', stock: 100, price: 150000 },
      { name: 'USB Hub 3.0', stock: 40, price: 100000 },
      { name: 'External HDD 1TB', stock: 10, price: 850000 },
      { name: 'Kursi Gaming Ergonomis', stock: 5, price: 2500000 },
    ];

    for (const product of products) {
      await client.query(`
        INSERT INTO products (name, stock, price) 
        VALUES ($1, $2, $3)
      `, [product.name, product.stock, product.price]);
    }

    await client.query('COMMIT');
    console.log('✅ Inisialisasi database selesai! Data berhasil dibuat.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Terjadi kesalahan saat inisialisasi:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

initDatabase();
