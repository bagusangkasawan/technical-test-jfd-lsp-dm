import { Request, Response } from 'express';
import pool from '@/config/database';

/**
 * GET /api/products
 * Ambil semua data produk dari database
 * Response: Array of products {id, name, stock, price, created_at}
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error in getProducts:', err);
    res.status(500).json({ error: 'Database error', details: (err as any).message });
  }
};

/**
 * POST /api/products
 * Tambah produk baru ke database
 * Body: {name: string, stock: number, price: number}
 * Response: Created product object
 */
export const addProduct = async (req: Request, res: Response) => {
  const { name, stock, price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, stock, price) VALUES ($1, $2, $3) RETURNING *',
      [name, stock, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah produk' });
  }
};

/**
 * POST /api/products/:id/sell
 * Kurangi stok produk (transaksi jual)
 * Menggunakan database transaction untuk mencegah race condition
 * Response: Updated product object
 */
export const sellProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    // Mulai transaction untuk atomicity
    await client.query('BEGIN');

    // Lock row untuk update (mencegah race condition)
    const checkRes = await client.query('SELECT stock FROM products WHERE id = $1 FOR UPDATE', [id]);

    if (checkRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    // Validasi stok harus > 0
    const currentStock = checkRes.rows[0].stock;
    if (currentStock <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Stok habis! Transaksi ditolak.' });
    }

    // Kurangi stok sebanyak 1
    const updateRes = await client.query(
      'UPDATE products SET stock = stock - 1 WHERE id = $1 RETURNING *',
      [id]
    );

    await client.query('COMMIT');
    res.json(updateRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Transaksi gagal' });
  } finally {
    client.release();
  }
};
