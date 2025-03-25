import api from '../config/api';

const getPlotsDeleted = () => api.get('/plot/deleted');

const getPlotById = (id:number) => api.get(`/plot/${id}`);

const getAllPlots = () => api.get('/plot');

const PlotService = {
    getPlotsDeleted,
    getPlotById,
    getAllPlots
};

export default PlotService;
