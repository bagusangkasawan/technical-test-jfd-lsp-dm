import React, { useState, useEffect } from 'react';
import { Plus, Save, ShoppingCart } from 'lucide-react';
import { ProductService } from '../services/api';
import type { Product } from '../types';

interface Props {
  notify: (msg: string, type: 'success' | 'error') => void;
}

// Halaman manajemen inventaris produk dengan form tambah dan tabel daftar
const InventoryPage: React.FC<Props> = ({ notify }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });

  // Format harga dengan pemisah ribuan (titik)
  const formatCurrency = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Format harga ringkas untuk mobile (15000000 jadi 15jt)
  const formatCompactCurrency = (value: number) => {
    if (value >= 1e12) {
      return (value / 1e12).toFixed(0) + 't';
    } else if (value >= 1e9) {
      return (value / 1e9).toFixed(0) + 'm';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(0) + 'jt';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(0) + 'rb';
    } else {
      return value.toString();
    }
  };

  // Handle perubahan input harga dengan auto-format separator
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setForm({ ...form, price: formatted });
  };

  // Fetch semua data produk dari backend API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (e) {
      notify('Gagal memuat produk. Cek koneksi backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load produk saat component pertama kali mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Submit form untuk tambah produk baru
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) return;

    try {
      const priceNumeric = Number(form.price.replace(/\D/g, ''));
      await ProductService.add({
        name: form.name,
        price: priceNumeric,
        stock: Number(form.stock),
      });
      notify('Produk berhasil ditambahkan!', 'success');
      setForm({ name: '', price: '', stock: '' });
      fetchProducts();
    } catch (e) {
      notify('Gagal tambah produk', 'error');
    }
  };

  // Kurangi stok produk (transaksi jual)
  const handleSell = async (id: number) => {
    try {
      await ProductService.sell(id);
      notify('Stok berhasil dikurangi', 'success');
      fetchProducts();
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Gagal transaksi';
      notify(msg, 'error');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Manajemen Inventaris</h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1">Kelola stok produk dengan mudah dan cepat</p>
        </div>
      </div>

      {/* Form Tambah Produk */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Plus size={20} className="text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Tambah Produk Baru</h2>
        </div>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Nama Produk"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm sm:text-base"
          />

          <div className="relative">
            <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium text-sm sm:text-base">Rp</span>
            <input
              type="text"
              placeholder="0"
              value={form.price}
              onChange={handlePriceChange}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 text-white placeholder-slate-400 w-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm sm:text-base"
            />
          </div>

          <input
            type="number"
            placeholder="Jumlah Stok"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm sm:text-base"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 font-semibold flex justify-center items-center gap-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            <Save size={16} />
            Tambah
          </button>
        </form>
      </div>

      {/* Tabel Produk */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="text-base sm:text-lg font-bold text-white">Daftar Produk</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Total: {products.length} produk</p>
        </div>

        {loading ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-slate-400 mt-4 text-sm sm:text-base">Memuat data...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-slate-400 text-base sm:text-lg">Belum ada data produk</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Produk</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Harga</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Stok</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-700/30 transition-colors duration-200"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white text-sm sm:text-base">{p.name}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-300 text-sm sm:text-base">
                      <span className="sm:hidden">
                        Rp {formatCompactCurrency(Number(p.price))}
                      </span>
                      <span className="hidden sm:inline">
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          p.stock > 0
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {p.stock}<span className="hidden sm:inline"> pcs</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <button
                        onClick={() => handleSell(p.id)}
                        className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1 sm:gap-2 ml-auto bg-green-600 hover:bg-green-500 text-white hover:shadow-lg hover:shadow-green-500/50"
                      >
                        <ShoppingCart size={14} />
                        <span className="hidden sm:inline">Jual</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
