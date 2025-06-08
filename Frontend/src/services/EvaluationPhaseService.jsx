import api from '../services/api';

const EvaluationPhaseService = {
  getCurrentPhase: async () => {
    try {
      const response = await api.get('/evaluation-phase');
      return response.data.phase;
    } catch (error) {
      console.error('Error getting current phase:', error);
      throw error;
    }
  },

  switchPhase: async (newPhase) => {
    try {
      const response = await api.post('/evaluation-phase', {
        phase: newPhase,
      });
      return response.data;
    } catch (error) {
      console.error('Error switching phase:', error);
      throw error;
    }
  },

  checkEvaluationPeriod: async () => {
    try {
      const response = await api.get('/evaluation-phase');
      const currentPhase = response.data.phase;
      if (currentPhase !== 'Phase 1') {
        throw new Error(`Evaluations are only accepted during Phase 1. Current phase: ${currentPhase}`);
      }
      return true;
    } catch (error) {
      console.error('Error checking evaluation period:', error);
      throw error;
    }
  }
};

export default EvaluationPhaseService;
