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
      // First get current phase to ensure we're in sync
      const currentPhaseResponse = await api.get('/evaluation-phase');
      const currentPhase = currentPhaseResponse.data.phase;

      // If already in the requested phase, return success
      if (currentPhase === newPhase) {
        return { message: `Already in ${newPhase}`, previous_phase: currentPhase, new_phase: newPhase };
      }

      // Attempt to switch phase
      const response = await api.post('/evaluation-phase', {
        phase: newPhase,
      });

      // If successful, verify the phase was actually changed
      const verifyResponse = await api.get('/evaluation-phase');
      if (verifyResponse.data.phase !== newPhase) {
        throw new Error('Phase switch verification failed');
      }

      return response.data;
    } catch (error) {
      console.error('Error switching phase:', error.response || error);
      // If we get a transaction error, try one more time
      if (error.response?.data?.error === 'There is no active transaction') {
        try {
          const retryResponse = await api.post('/evaluation-phase', {
            phase: newPhase,
          });
          return retryResponse.data;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          throw retryError;
        }
      }
      throw error;
    }
  },

  checkEvaluationPeriod: async () => {
    try {
      const response = await api.get('/evaluation-phase');
      console.log('Phase response:', response);
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
