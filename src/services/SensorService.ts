
import api from '../config/api';

const getSensors = () => api.get('/sensor/all');

const SensorService = {
    getSensors
};

export default SensorService;
