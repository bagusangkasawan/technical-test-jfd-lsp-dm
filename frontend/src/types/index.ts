export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role_name?: string;
}

export interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  created_at?: string;
}
