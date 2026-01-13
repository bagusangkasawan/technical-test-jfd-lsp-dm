import { Request, Response } from 'express';
import pool from '@/config/database';

/**
 * GET /api/users
 * Ambil semua data user dengan role information
 * Response: Array of users {id, name, email, role_id, role_name}
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT users.id, users.name, users.email, users.role_id, roles.name as role_name 
      FROM users 
      JOIN roles ON users.role_id = roles.id 
      ORDER BY users.id ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error in getUsers:', err);
    res.status(500).json({ error: 'Database error', details: (err as any).message });
  }
};

/**
 * GET /api/users/roles
 * Ambil semua daftar roles yang tersedia
 * Response: Array of roles {id, name}
 */
export const getRoles = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM roles');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error in getRoles:', err);
    res.status(500).json({ error: 'Database error', details: (err as any).message });
  }
};

/**
 * PUT /api/users/:id/change-role
 * Update role user berdasarkan user ID
 * Body: {role_id: number}
 * Response: Updated user object
 */
export const changeUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role_id } = req.body;

  try {
    // Validasi role ID ada di database
    const roleCheck = await pool.query('SELECT id FROM roles WHERE id = $1', [role_id]);
    if (roleCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Role ID tidak valid' });
    }

    // Update user role
    const result = await pool.query(
      'UPDATE users SET role_id = $1 WHERE id = $2 RETURNING *',
      [role_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal update role' });
  }
};
