import { Router } from 'express';
import * as userController from '@/controllers/userController';

const router = Router();

/**
 * User & Role Routes
 * Menangani semua operasi terkait user dan role management
 */

// GET semua user dengan role information
router.get('/', userController.getUsers);

// GET semua roles
router.get('/roles', userController.getRoles);

// PUT update role user
router.put('/:id/change-role', userController.changeUserRole);

export default router;
