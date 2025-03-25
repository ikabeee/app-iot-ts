import api from '../config/api';
import { User } from '../interfaces/User';

const getUsers = () => api.get('/user/all');
const getUserById = (id: number) => api.get(`/user/${id}`);
const createUser = (data: User) => api.post('/user/create', data);

const UserService = {
    getUsers,
    getUserById,
    createUser
};

export default UserService;
