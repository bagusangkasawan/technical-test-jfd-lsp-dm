import { Router } from 'express';
import * as productController from '@/controllers/productController';

const router = Router();

/**
 * Product Routes
 * Menangani semua operasi CRUD untuk produk
 */

// GET semua produk
router.get('/', productController.getProducts);

// POST tambah produk baru
router.post('/', productController.addProduct);

// POST jual/kurangi stok produk
router.post('/:id/sell', productController.sellProduct);

export default router;
