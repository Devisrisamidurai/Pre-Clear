import { Users, UserPlus } from 'lucide-react';

export function UserManagement() {
  const users = [
    { id: 1, name: 'Demo Shipper', email: 'shipper@demo.com', role: 'Shipper', status: 'Active' },
    { id: 2, name: 'John Smith', email: 'broker@demo.com', role: 'Broker', status: 'Active' },
    { id: 3, name: 'Admin User', email: 'admin@demo.com', role: 'Admin', status: 'Active' }
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">User Management</h1>
          <p className="text-slate-600">Manage shippers, brokers, and admins</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-4 px-6 text-slate-700">Name</th>
              <th className="text-left py-4 px-6 text-slate-700">Email</th>
              <th className="text-left py-4 px-6 text-slate-700">Role</th>
              <th className="text-left py-4 px-6 text-slate-700">Status</th>
              <th className="text-left py-4 px-6 text-slate-700">Actions</th>
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
                  <button className="text-blue-600 hover:underline text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

