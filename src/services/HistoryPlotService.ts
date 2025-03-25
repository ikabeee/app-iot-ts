import api from '../config/api';

const getAllHistoryPlot = () => api.get('/history-plot/all');

const getHistoryByPlotId = (plotId: number) => api.get(`/history-plot/${plotId}`);

const HistoryPlotService = {
    getAllHistoryPlot,
    getHistoryByPlotId
}

export default HistoryPlotService;
