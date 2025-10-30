import { useState, useEffect } from 'react';
import { MapPin, Filter, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Complaint, Category, mockCategories, getComplaints } from '../data/mockData';

export const MapView = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    loadData();
  }, [filterCategory, filterStatus]);

  const loadData = () => {
    let allComplaints = getComplaints();

    if (filterCategory !== 'all') {
      allComplaints = allComplaints.filter(c => c.category_id === filterCategory);
    }

    if (filterStatus !== 'all') {
      allComplaints = allComplaints.filter(c => c.status === filterStatus);
    }

    setComplaints(allComplaints);
    setCategories(mockCategories);
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

  const clusteredComplaints = complaints.reduce((acc, complaint) => {
    if (!complaint.latitude || !complaint.longitude) return acc;

    const key = `${Math.floor(complaint.latitude * 100)}_${Math.floor(complaint.longitude * 100)}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(complaint);
    return acc;
  }, {} as Record<string, Complaint[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
      <div className="relative h-screen overflow-hidden">
        <div className="absolute top-6 left-6 z-20 space-y-4">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-purple-600" />
              Complaints Map
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {complaints.length} issues reported
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          {showFilters && (
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4 animate-slideDown">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
            className="p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-slate-700 dark:text-slate-300"
          >
            <ZoomIn className="w-6 h-6" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
            className="p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-slate-700 dark:text-slate-300"
          >
            <ZoomOut className="w-6 h-6" />
          </button>
        </div>

        <div
          className="absolute inset-0 bg-slate-200 dark:bg-slate-700 overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        >
          <div
            className="relative w-full h-full transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          >
            {Object.entries(clusteredComplaints).map(([key, clusterComplaints]) => {
              const complaint = clusterComplaints[0];
              if (!complaint.latitude || !complaint.longitude) return null;

              const x = (complaint.longitude + 180) * (window.innerWidth / 360);
              const y = (90 - complaint.latitude) * (window.innerHeight / 180);

              return (
                <div
                  key={key}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -100%)',
                  }}
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <div className="relative">
                    <MapPin
                      className={`w-10 h-10 ${
                        complaint.status === 'resolved'
                          ? 'text-green-500'
                          : complaint.status === 'in_progress'
                          ? 'text-blue-500'
                          : 'text-yellow-500'
                      } drop-shadow-lg group-hover:scale-125 transition-transform duration-300 animate-bounce`}
                      style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
                    />
                    {clusterComplaints.length > 1 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                        {clusterComplaints.length}
                      </div>
                    )}
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-1 truncate">
                      {complaint.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {complaint.categories?.name}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getStatusColor(complaint.status)}`}>
                      {getStatusText(complaint.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedComplaint && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    {selectedComplaint.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusText(selectedComplaint.status)}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedComplaint.categories?.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {selectedComplaint.image_url && (
                <img
                  src={selectedComplaint.image_url}
                  alt={selectedComplaint.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Reported by
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedComplaint.profiles?.full_name || 'Anonymous'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {new Date(selectedComplaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedComplaint.latitude && selectedComplaint.longitude && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Location
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {selectedComplaint.latitude.toFixed(6)}, {selectedComplaint.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
