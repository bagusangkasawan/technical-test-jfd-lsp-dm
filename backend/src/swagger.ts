/**
 * Swagger/OpenAPI Documentation Configuration
 * Mendefinisikan API endpoints dan schemas untuk dokumentasi otomatis
 */

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory Management System API',
    version: '1.0.0',
    description: 'API untuk manajemen inventaris produk dan user dengan role-based access control'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development Server'
    }
  ],
  paths: {
    '/products': {
      get: {
        summary: 'Ambil Semua Produk',
        description: 'Retrieve daftar lengkap semua produk dengan detail stok dan harga',
        tags: ['Products'],
        responses: {
          '200': {
            description: 'List produk berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Product'
                  }
                }
              }
            }
          },
          '500': {
            description: 'Database error'
          }
        }
      },
      post: {
        summary: 'Tambah Produk Baru',
        description: 'Create produk baru di database dengan nama, harga, dan stok',
        tags: ['Products'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price', 'stock'],
                properties: {
                  name: { type: 'string', example: 'Laptop Gaming ASUS' },
                  price: { type: 'number', example: 15000000 },
                  stock: { type: 'number', example: 10 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Produk berhasil ditambahkan',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product'
                }
              }
            }
          },
          '500': {
            description: 'Gagal menambah produk'
          }
        }
      }
    },
    '/products/{id}/sell': {
      post: {
        summary: 'Jual Produk (Kurangi Stok)',
        description: 'Transaksi penjualan - kurangi stok produk sebanyak 1 unit dengan atomic transaction',
        tags: ['Products'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Product ID'
          }
        ],
        responses: {
          '200': {
            description: 'Stok berhasil dikurangi',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product'
                }
              }
            }
          },
          '400': {
            description: 'Stok habis - transaksi ditolak'
          },
          '404': {
            description: 'Produk tidak ditemukan'
          },
          '500': {
            description: 'Transaksi gagal'
          }
        }
      }
    },
    '/users': {
      get: {
        summary: 'Ambil Semua User',
        description: 'Retrieve daftar lengkap user dengan informasi role mereka',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'List user berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          },
          '500': {
            description: 'Database error'
          }
        }
      }
    },
    '/users/roles': {
      get: {
        summary: 'Ambil Semua Roles',
        description: 'Retrieve daftar semua roles yang tersedia di sistem',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'List roles berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Role'
                  }
                }
              }
            }
          },
          '500': {
            description: 'Database error'
          }
        }
      }
    },
    '/users/{id}/change-role': {
      put: {
        summary: 'Update Role User',
        description: 'Update role pengguna dengan validasi role ID',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'User ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role_id'],
                properties: {
                  role_id: { type: 'number', example: 2 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Role user berhasil diupdate',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          '400': {
            description: 'Role ID tidak valid'
          },
          '404': {
            description: 'User tidak ditemukan'
          },
          '500': {
            description: 'Gagal update role'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Laptop Gaming ASUS' },
          stock: { type: 'integer', example: 10 },
          price: { type: 'integer', example: 15000000 },
          created_at: { type: 'string', format: 'date-time', example: '2024-01-13T10:30:00Z' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Super Admin' },
          email: { type: 'string', example: 'admin@toko.com' },
          role_id: { type: 'integer', example: 1 },
          role_name: { type: 'string', example: 'Admin' }
        }
      },
      Role: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Admin' }
        }
      }
    }
  }
};

export default swaggerSpec;
