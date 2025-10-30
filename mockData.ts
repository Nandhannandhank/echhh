export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'citizen' | 'admin';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
  profiles?: Profile;
  categories?: Category;
}

export const mockCategories: Category[] = [
  { id: '1', name: 'Roads & Infrastructure', icon: 'construction', color: '#ef4444' },
  { id: '2', name: 'Water Supply', icon: 'droplet', color: '#3b82f6' },
  { id: '3', name: 'Electricity', icon: 'zap', color: '#eab308' },
  { id: '4', name: 'Waste Management', icon: 'trash-2', color: '#22c55e' },
  { id: '5', name: 'Public Safety', icon: 'shield-alert', color: '#f97316' },
  { id: '6', name: 'Street Lights', icon: 'lightbulb', color: '#a855f7' },
  { id: '7', name: 'Parks & Recreation', icon: 'trees', color: '#10b981' },
  { id: '8', name: 'Traffic & Parking', icon: 'traffic-cone', color: '#ec4899' },
];

export const mockProfiles: Profile[] = [
  { id: '1', email: 'admin@echocity.com', full_name: 'Admin User', role: 'admin' },
  { id: '2', email: 'john@example.com', full_name: 'John Doe', role: 'citizen' },
  { id: '3', email: 'jane@example.com', full_name: 'Jane Smith', role: 'citizen' },
  { id: '4', email: 'bob@example.com', full_name: 'Bob Johnson', role: 'citizen' },
];

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    user_id: '2',
    category_id: '1',
    title: 'Large pothole on Main Street',
    description: 'There is a dangerous pothole near the intersection of Main St and 5th Avenue that needs immediate attention.',
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'pending',
    created_at: '2025-10-20T10:30:00Z',
    profiles: mockProfiles[1],
    categories: mockCategories[0],
  },
  {
    id: '2',
    user_id: '3',
    category_id: '6',
    title: 'Street light not working',
    description: 'The street light outside 123 Oak Avenue has been out for three days.',
    latitude: 40.7580,
    longitude: -73.9855,
    status: 'in_progress',
    created_at: '2025-10-19T14:20:00Z',
    profiles: mockProfiles[2],
    categories: mockCategories[5],
  },
  {
    id: '3',
    user_id: '4',
    category_id: '4',
    title: 'Overflowing trash bins',
    description: 'Multiple trash bins at Central Park entrance are overflowing and attracting pests.',
    latitude: 40.7829,
    longitude: -73.9654,
    status: 'resolved',
    created_at: '2025-10-18T09:15:00Z',
    profiles: mockProfiles[3],
    categories: mockCategories[3],
  },
  {
    id: '4',
    user_id: '2',
    category_id: '2',
    title: 'Water leak on Elm Street',
    description: 'Continuous water leak from underground pipe causing street flooding.',
    latitude: 40.7489,
    longitude: -73.9680,
    status: 'in_progress',
    created_at: '2025-10-21T11:45:00Z',
    profiles: mockProfiles[1],
    categories: mockCategories[1],
  },
  {
    id: '5',
    user_id: '3',
    category_id: '3',
    title: 'Power outage in residential area',
    description: 'Frequent power outages in the downtown residential district affecting 20+ homes.',
    latitude: 40.7614,
    longitude: -73.9776,
    status: 'pending',
    created_at: '2025-10-22T08:00:00Z',
    profiles: mockProfiles[2],
    categories: mockCategories[2],
  },
  {
    id: '6',
    user_id: '4',
    category_id: '8',
    title: 'Broken traffic signal',
    description: 'Traffic signal at Broadway and 42nd is stuck on red, causing major delays.',
    latitude: 40.7590,
    longitude: -73.9845,
    status: 'pending',
    created_at: '2025-10-22T13:30:00Z',
    profiles: mockProfiles[3],
    categories: mockCategories[7],
  },
];

export const getCurrentUser = (): Profile | null => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: Profile | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const login = (email: string, password: string): Profile | null => {
  const user = mockProfiles.find(p => p.email === email);
  if (user && password.length >= 6) {
    setCurrentUser(user);
    return user;
  }
  return null;
};

export const register = (email: string, password: string, fullName: string): Profile => {
  const newUser: Profile = {
    id: String(Date.now()),
    email,
    full_name: fullName,
    role: 'citizen',
  };
  mockProfiles.push(newUser);
  setCurrentUser(newUser);
  return newUser;
};

export const logout = () => {
  setCurrentUser(null);
};

export const getComplaints = (userId?: string): Complaint[] => {
  const complaintsJson = localStorage.getItem('complaints');
  const complaints = complaintsJson ? JSON.parse(complaintsJson) : [...mockComplaints];

  if (userId) {
    return complaints.filter((c: Complaint) => c.user_id === userId);
  }
  return complaints;
};

export const addComplaint = (complaint: Omit<Complaint, 'id' | 'created_at'>): Complaint => {
  const complaints = getComplaints();
  const newComplaint: Complaint = {
    ...complaint,
    id: String(Date.now()),
    created_at: new Date().toISOString(),
  };

  const user = mockProfiles.find(p => p.id === complaint.user_id);
  const category = mockCategories.find(c => c.id === complaint.category_id);

  newComplaint.profiles = user;
  newComplaint.categories = category;

  complaints.push(newComplaint);
  localStorage.setItem('complaints', JSON.stringify(complaints));
  return newComplaint;
};

export const updateComplaintStatus = (complaintId: string, status: 'pending' | 'in_progress' | 'resolved'): void => {
  const complaints = getComplaints();
  const complaint = complaints.find(c => c.id === complaintId);
  if (complaint) {
    complaint.status = status;
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }
};
