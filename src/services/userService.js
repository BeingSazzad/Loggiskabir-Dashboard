import { mockUsers } from '../data/mockData';

export const userService = {
  getUsers: () => Promise.resolve([...mockUsers]),

  updateUserStatus: (_id, _status) => Promise.resolve({ success: true }),

  inviteUser: (userData) => Promise.resolve({
    id: `LOG-${Math.floor(Math.random() * 900) + 100}`,
    ...userData,
    status: 'active',
    lastLogin: 'Never'
  })
};
