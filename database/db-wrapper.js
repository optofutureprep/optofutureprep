// Wrapper to make InstantDB available globally for non-module scripts
(function () {
    'use strict';

    window.InstantDB = {
        // Check if user is authenticated
        isAuthenticated: function () {
            return window.__instantDBAuthState?.isAuthenticated || false;
        },

        // Get current user ID
        getCurrentUserId: function () {
            return window.__instantDBAuthState?.userId || null;
        },

        // Save test state
        saveTestState: function (subject, testIndex, state) {
            try {
                if (!this.isAuthenticated()) {
                    // Guest users - use sessionStorage
                    const key = `test_state_${subject}_${testIndex}`;
                    sessionStorage.setItem(key, JSON.stringify(state));
                    return;
                }

                // For authenticated users, also save to sessionStorage as backup
                const key = `test_state_${subject}_${testIndex}`;
                sessionStorage.setItem(key, JSON.stringify(state));

                // Trigger save to InstantDB via React component if available
                if (window.__saveTestStateToDB) {
                    window.__saveTestStateToDB(subject, testIndex, state);
                }
            } catch (error) {
                console.error('Error in saveTestState:', error);
            }
        },

        // Load test state
        loadTestState: function (subject, testIndex) {
            try {
                const key = `test_state_${subject}_${testIndex}`;
                const saved = sessionStorage.getItem(key);
                if (saved) {
                    return JSON.parse(saved);
                }
                return null;
            } catch (error) {
                console.error('Error in loadTestState:', error);
                return null;
            }
        },

        // Save completed test attempt
        saveTestAttempt: function (attemptData) {
            try {
                if (!this.isAuthenticated()) {
                    console.log('Guest user - test attempt not saved');
                    return null;
                }

                // Save to InstantDB via React component
                if (window.__saveTestAttemptToDB) {
                    return window.__saveTestAttemptToDB(attemptData);
                }

                return null;
            } catch (error) {
                console.error('Error in saveTestAttempt:', error);
                return null;
            }
        },

        // Clear test state
        clearTestState: function (subject, testIndex) {
            const key = `test_state_${subject}_${testIndex}`;
            sessionStorage.removeItem(key);

            if (this.isAuthenticated() && window.__clearTestStateFromDB) {
                window.__clearTestStateFromDB(subject, testIndex);
            }
        }
    };

    console.log('✅ InstantDB wrapper initialized');
})();
