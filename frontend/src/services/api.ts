import axios from 'axios';
import type { Product, User, Role } from '../types';

// Inisialisasi axios client dengan base URL dari env atau localhost
const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service untuk Product (CRUD operations)
export const ProductService = {
  // Ambil semua produk
  getAll: async () => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  // Tambah produk baru
  add: async (data: Omit<Product, 'id'>) => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  // Kurangi stok produk (jual)
  sell: async (id: number) => {
    const response = await apiClient.post<Product>(
      `/products/${id}/sell`
    );
    return response.data;
  },
};

// API service untuk User (CRUD dan role management)
export const UserService = {
  // Ambil semua user dengan role info
  getAll: async () => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  // Ambil list semua role yang tersedia
  getRoles: async () => {
    const response = await apiClient.get<Role[]>('/users/roles');
    return response.data;
  },

  // Update role user
  updateRole: async (userId: number, roleId: number) => {
    const response = await apiClient.put<User>(
      `/users/${userId}/change-role`,
      { role_id: roleId }
    );
    return response.data;
  },
};
