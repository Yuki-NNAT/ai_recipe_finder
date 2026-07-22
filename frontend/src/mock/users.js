/** Mock users — current session user plus a directory for the admin table. */

export const currentUser = {
  id: 'u_001',
  name: 'Nhi Nguyễn',
  email: 'nhi@airecipe.app',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&fit=crop&crop=faces',
  role: 'user',
  joinedAt: '2025-11-02',
};

export const users = [
  currentUser,
  { id: 'u_002', name: 'Emma Wilson', email: 'emma@example.com', avatar: '', role: 'user', status: 'active', joinedAt: '2025-12-01' },
  { id: 'u_003', name: 'James Parker', email: 'james@example.com', avatar: '', role: 'user', status: 'active', joinedAt: '2025-12-10' },
  { id: 'u_004', name: 'Sara Ali', email: 'sara@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80', role: 'editor', status: 'active', joinedAt: '2025-12-18' },
  { id: 'u_005', name: 'David Chen', email: 'david@example.com', avatar: '', role: 'user', status: 'inactive', joinedAt: '2026-01-02' },
  { id: 'u_006', name: 'Linh Tran', email: 'linh@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80', role: 'user', status: 'active', joinedAt: '2026-01-05' },
  { id: 'u_007', name: 'Admin User', email: 'admin@airecipe.app', avatar: '', role: 'admin', status: 'active', joinedAt: '2025-10-01' },
];

export default users;
