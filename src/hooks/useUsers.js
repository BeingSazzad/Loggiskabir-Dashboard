import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const user = users.find(u => u.id === id);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await userService.updateUserStatus(id, newStatus);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch (err) {
      setError(err.message);
    }
  };

  const inviteUser = async (userData) => {
    try {
      const newUser = await userService.inviteUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { users, loading, error, toggleStatus, inviteUser };
};
