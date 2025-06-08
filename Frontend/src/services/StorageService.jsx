import api from './api';

const StorageService = {
    checkStorageStatus: async () => {
        try {
            const lastClearTimestamp = localStorage.getItem('lastClearTimestamp');
            const response = await api.get('/check-storage-status', {
                headers: {
                    'X-Last-Clear-Timestamp': lastClearTimestamp
                }
            });

            if (response.data.should_clear) {
                // Clear localStorage items
                const localStorageItems = [
                    'activePage',
                    'authToken',
                    'instructorId',
                    'profileCompleted',
                    'role',
                    'savedEvaluations',
                    'selectedSemester',
                    'selectedYear',
                    'theme',
                    'user'
                ];

                // Clear sessionStorage items
                const sessionStorageItems = [
                    'evaluationHistory',
                    'evaluationResponses',
                    'savedEvaluations',
                    'selectedSemester',
                    'selectedYear',
                    'submissionInfo',
                    'user'
                ];

                // Clear localStorage items
                localStorageItems.forEach(item => {
                    localStorage.removeItem(item);
                });

                // Clear sessionStorage items
                sessionStorageItems.forEach(item => {
                    sessionStorage.removeItem(item);
                });

                // Update last clear timestamp
                if (response.data.clear_timestamp) {
                    localStorage.setItem('lastClearTimestamp', response.data.clear_timestamp);
                }
            }

            return response.data;
        } catch (error) {
            console.error('Error checking storage status:', error);
            return { should_clear: false };
        }
    }
};

export default StorageService; 