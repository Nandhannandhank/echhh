import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, CheckCircle, Clock, AlertCircle, LogOut, MapPin, FileText, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Complaint, getComplaints, updateComplaintStatus as updateStatus } from '../data/mockData';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    setLoading(true);

    const data = profile?.role === 'admin'
      ? getComplaints()
      : getComplaints(user!.id);

    setComplaints(data);
    setStats({
      total: data.length,
      pending: data.filter((c) => c.status === 'pending').length,
      inProgress: data.filter((c) => c.status === 'in_progress').length,
      resolved: data.filter((c) => c.status === 'resolved').length,
    });

    setLoading(false);
  };

  const updateComplaintStatus = (complaintId: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    updateStatus(complaintId, newStatus);
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
      <div className="flex h-screen">
        <aside className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
              EchoCity
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {profile?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
            </p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Home className="w-5 h-5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('complaints')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'complaints'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              Complaints
            </button>

            <button
              onClick={() => navigate('/map')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
            >
              <MapPin className="w-5 h-5" />
              Map View
            </button>

            <button
              onClick={() => navigate('/report')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
            >
              <AlertCircle className="w-5 h-5" />
              Report Issue
            </button>
          </nav>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {profile?.full_name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {profile?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  Welcome back, {profile?.full_name}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Here's an overview of {profile?.role === 'admin' ? 'all complaints' : 'your reports'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">
                      {stats.total}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Total Reports
                  </h3>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">
                      {stats.pending}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Pending
                  </h3>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">
                      {stats.inProgress}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    In Progress
                  </h3>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">
                      {stats.resolved}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Resolved
                  </h3>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  Status Distribution
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-700 dark:text-slate-300">Pending</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-700 dark:text-slate-300">In Progress</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-700 dark:text-slate-300">Resolved</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                All Complaints
              </h1>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Date
                        </th>
                        {profile?.role === 'admin' && (
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {complaints.map((complaint) => (
                        <tr
                          key={complaint.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-slate-800 dark:text-white font-medium">
                            {complaint.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            {complaint.profiles?.full_name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            {complaint.categories?.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs text-white ${getStatusColor(complaint.status)}`}>
                              {getStatusText(complaint.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            {new Date(complaint.created_at).toLocaleDateString()}
                          </td>
                          {profile?.role === 'admin' && (
                            <td className="px-6 py-4">
                              <select
                                value={complaint.status}
                                onChange={(e) => updateComplaintStatus(complaint.id, e.target.value)}
                                className="px-3 py-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white"
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                              </select>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
