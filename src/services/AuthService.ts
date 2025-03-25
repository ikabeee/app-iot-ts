import { Register } from 'react-router-dom';
import api from '../config/api'
import { Login } from '../interfaces/Login';
import { Otp } from '../interfaces/Otp';

const login = (data: Login) => api.post('/login', data, { withCredentials: true });

const register = (data: Register) => api.post('/register', data, { withCredentials: true });

const verifyOTP = (data: Otp) => api.post('/verify-otp', data, { withCredentials: true });

const logout = () => api.post('/logout');

const AuthService = {
    login,
    register,
    verifyOTP,
    logout,
}

export default AuthService;
