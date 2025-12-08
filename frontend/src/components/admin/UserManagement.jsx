import { Users, UserPlus } from 'lucide-react';
import { useState } from 'react';

export function UserManagement() {
  const initialUsers = [
    { id: 1, name: 'Demo Shipper', email: 'shipper@demo.com', role: 'Shipper', status: 'Active' },
    { id: 2, name: 'John Smith', email: 'broker@demo.com', role: 'Broker', status: 'Active' },
    { id: 3, name: 'Admin User', email: 'admin@demo.com', role: 'Admin', status: 'Active' }
  ];

  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', email: '', role: 'Shipper', status: 'Active' });

  const openAdd = () => {
    setForm({ id: null, name: '', email: '', role: 'Shipper', status: 'Active' });
    setShowForm(true);
  };

  const openEdit = (user) => {
    setForm({ ...user });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    if (form.id == null) {
      const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers((prev) => [...prev, { ...form, id: nextId }]);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === form.id ? { ...form } : u)));
    }

    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
      <div className="mb-8 flex items-center justify-between" style={{ maxWidth: '100%', marginBottom: 24 }}>
        <div>
          <h1 className="mb-2" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, color: '#2F1B17', fontSize: '1.5rem' }}>
            <Users className="w-6 h-6" style={{ color: '#3A2B28' }} />
            <span>User Management</span>
          </h1>
          <p style={{ color: '#7A5B52' }}>Manage shippers, brokers, and admins</p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-3 rounded-xl flex items-center gap-2"
          style={{ background: '#E6B800', color: '#2F1B17', border: '2px solid #2F1B17' }}
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200 max-w-2xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="px-4 py-2 rounded-lg border border-slate-200"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="px-4 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select name="role" value={form.role} onChange={handleChange} className="px-4 py-2 rounded-lg border border-slate-200">
                <option>Shipper</option>
                <option>Broker</option>
                <option>Admin</option>
              </select>
              <select name="status" value={form.status} onChange={handleChange} className="px-4 py-2 rounded-lg border border-slate-200">
                <option>Active</option>
                <option>Suspended</option>
                <option>Pending</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg border border-slate-200">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg" style={{ background: '#E6B800', color: '#2F1B17', border: '2px solid #2F1B17' }}>
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-4 px-6" style={{ color: '#7A5B52' }}>Name</th>
              <th className="text-left py-4 px-6" style={{ color: '#7A5B52' }}>Email</th>
              <th className="text-left py-4 px-6" style={{ color: '#7A5B52' }}>Role</th>
              <th className="text-left py-4 px-6" style={{ color: '#7A5B52' }}>Status</th>
              <th className="text-left py-4 px-6" style={{ color: '#7A5B52' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100">
                <td className="py-4 px-6 text-slate-900">{user.name}</td>
                <td className="py-4 px-6 text-slate-700">{user.email}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:underline text-sm" onClick={() => openEdit(user)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

