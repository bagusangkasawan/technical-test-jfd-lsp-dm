import React, { useState, useEffect } from 'react';
import { Save, Users as UsersIcon } from 'lucide-react';
import { UserService } from '../services/api';
import type { User, Role } from '../types';

interface Props {
  notify: (msg: string, type: 'success' | 'error') => void;
}

// Halaman manajemen user dan role assignment
const UserManagementPage: React.FC<Props> = ({ notify }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [pending, setPending] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  // Fetch data user dan role dengan parallel requests
  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([
        UserService.getAll(),
        UserService.getRoles(),
      ]);
      setUsers(u);
      setRoles(r);
    } catch (e) {
      notify('Gagal memuat data user/role.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load data saat component pertama kali mount
  useEffect(() => {
    fetchData();
  }, []);

  // Submit perubahan role ke backend API
  const handleSave = async (userId: number) => {
    const roleId = pending[userId];
    if (!roleId) return;

    try {
      await UserService.updateRole(userId, roleId);
      notify('Role user berhasil diupdate', 'success');
      const newPending = { ...pending };
      delete newPending[userId];
      setPending(newPending);
      fetchData();
    } catch (e) {
      notify('Gagal update role', 'error');
    }
  };

  // Tentukan warna badge berdasarkan nama role
  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Seller':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Pelanggan':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Manajemen User</h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1">Kelola user dan role dengan aman</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <UsersIcon size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Daftar User</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Total: {users.length} user</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-slate-400 mt-4 text-sm sm:text-base">Memuat data...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-slate-400 text-base sm:text-lg">Belum ada data user</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      Role Saat Ini
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      Ubah Role
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.map((u) => {
                    const currentRole = u.role_name || 'Unknown';
                    const selectedRole = pending[u.id] || u.role_id;
                    const hasPending = !!pending[u.id];

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-700/30 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-slate-400 text-sm mt-1">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                              currentRole
                            )}`}
                          >
                            {currentRole}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={selectedRole}
                            onChange={(e) =>
                              setPending({
                                ...pending,
                                [u.id]: Number(e.target.value),
                              })
                            }
                            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 w-[140px]">
                          <div className="flex items-center justify-end">
                            {hasPending ? (
                              <button
                                onClick={() => handleSave(u.id)}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/50 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all duration-300"
                              >
                                <Save size={16} />
                                Simpan
                              </button>
                            ) : (
                              <span className="text-slate-500 text-sm">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-slate-700">
              {users.map((u) => {
                const currentRole = u.role_name || 'Unknown';
                const selectedRole = pending[u.id] || u.role_id;
                const hasPending = !!pending[u.id];

                return (
                  <div key={u.id} className="p-4 hover:bg-slate-700/20 transition-colors duration-200">
                    {/* User Info */}
                    <div className="mb-4">
                      <div className="font-semibold text-white text-base">{u.name}</div>
                      <div className="text-slate-400 text-xs mt-1">{u.email}</div>
                    </div>

                    {/* Current Role */}
                    <div className="mb-4">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Role Saat Ini</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border inline-block ${getRoleBadgeColor(
                          currentRole
                        )}`}
                      >
                        {currentRole}
                      </span>
                    </div>

                    {/* Role Selector */}
                    <div className="mb-4">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Ubah Role</p>
                      <select
                        value={selectedRole}
                        onChange={(e) =>
                          setPending({
                            ...pending,
                            [u.id]: Number(e.target.value),
                          })
                        }
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all w-full"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action Button */}
                    {hasPending ? (
                      <button
                        onClick={() => handleSave(u.id)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/50 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <Save size={16} />
                        Simpan Perubahan
                      </button>
                    ) : (
                      <div className="text-slate-500 text-sm text-center">Tidak ada perubahan</div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
