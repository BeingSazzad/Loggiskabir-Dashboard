import { mockUsers } from '../data/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  getUsers: async () => {
    await delay(600);
    return [...mockUsers];
  },
  
  updateUserStatus: async (id, status) => {
    await delay(400);
    return { success: true };
  },

  inviteUser: async (userData) => {
    await delay(800);
    return { 
      id: `LOG-${Math.floor(Math.random() * 900) + 100}`,
      ...userData,
      status: 'active',
      lastLogin: 'Never'
    };
  }
};
