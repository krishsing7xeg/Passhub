// src/pages/admin/Dashboard.jsx - COMPLETE UPDATE
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Users, Activity, UserCog, BarChart3, UserPlus } from 'lucide-react';
import api from '../../utils/api';
import TabNavigation from '../../components/common/TabNavigation';
import AdminCard from '../../components/admin/AdminCard';
import InviteAdminModal from '../../components/admin/InviteAdminModal';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview' || activeTab === 'users') {
        const usersRes = await api.get('/admin/users');
        if (usersRes.data.success) {
          setUsers(usersRes.data.users);
        }
      }

      if (activeTab === 'admins' && user?.role === 'SUPER_ADMIN') {
        const adminsRes = await api.get('/admin/users?role=ADMIN');
        if (adminsRes.data.success) {
          setAdmins(adminsRes.data.users);
        }
      }

      if (activeTab === 'analytics') {
        const [peakRes, trafficRes] = await Promise.all([
          api.get('/analytics/admin/peak-activity'),
          api.get('/analytics/admin/traffic-by-place')
        ]);
        setAnalytics({
          peak: peakRes.data.data || [],
          traffic: trafficRes.data.data || []
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableAdmin = async (adminId, reason) => {
    try {
      const res = await api.post(`/admin/admins/${adminId}/disable`, { reason });
      if (res.data.success) {
        alert('Admin disabled successfully');
        fetchData();
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'All Users', icon: Users, count: users.length },
    ...(user?.role === 'SUPER_ADMIN' ? [
      { id: 'admins', label: 'Admins', icon: UserCog, count: admins.length },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 }
    ] : [])
  ];

  if (loading && activeTab !== 'overview') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'} Dashboard
          </h1>
          <p className="text-gray-600">Manage your platform and monitor activities</p>
        </div>

        {/* Stats Cards (Overview) */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <Users className="w-10 h-10 mb-3 opacity-80" />
              <p className="text-3xl font-bold mb-1">{users.length}</p>
              <p className="text-blue-100">Total Users</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <Activity className="w-10 h-10 mb-3 opacity-80" />
              <p className="text-3xl font-bold mb-1">
                {users.filter(u => u.isActive).length}
              </p>
              <p className="text-green-100">Active Users</p>
            </div>

            {user?.role === 'SUPER_ADMIN' && (
              <>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <UserCog className="w-10 h-10 mb-3 opacity-80" />
                  <p className="text-3xl font-bold mb-1">{admins.length}</p>
                  <p className="text-purple-100">Admins</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                  <BarChart3 className="w-10 h-10 mb-3 opacity-80" />
                  <p className="text-3xl font-bold mb-1">Live</p>
                  <p className="text-orange-100">Analytics</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Stats</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-2">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
                <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600 mb-2">Disabled Users</p>
                  <p className="text-3xl font-bold text-red-600">
                    {users.filter(u => !u.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800">{u.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            u.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {u.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Admins Tab (Super Admin Only) */}
          {activeTab === 'admins' && user?.role === 'SUPER_ADMIN' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Admin Management</h2>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg transform hover:scale-105"
                >
                  <UserPlus className="w-5 h-5" />
                  Invite Admin
                </button>
              </div>

              {admins.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {admins.map((admin) => (
                    <AdminCard 
                      key={admin._id} 
                      admin={admin} 
                      onDisable={handleDisableAdmin}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-500 text-lg mb-4">No admins yet. Invite your first admin!</p>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold"
                  >
                    Invite Admin
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Peak Activity Hours</h2>
                <div className="h-64 flex items-end justify-around gap-2">
                  {analytics.peak.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all hover:from-indigo-600 hover:to-purple-600"
                        style={{ height: `${(item.count / Math.max(...analytics.peak.map(a => a.count))) * 100}%` }}
                      ></div>
                      <p className="text-xs text-gray-600 mt-2">{item._id}:00</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Traffic by Place</h2>
                <div className="space-y-3">
                  {analytics.traffic.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{item.placeName}</p>
                        <p className="text-sm text-gray-600">{item.location}</p>
                      </div>
                      <span className="text-2xl font-bold text-indigo-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <InviteAdminModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default AdminDashboard;