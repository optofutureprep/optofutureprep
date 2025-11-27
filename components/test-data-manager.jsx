// React component to handle InstantDB operations for test system
import React, { useEffect, useState } from 'react';
import { useAuth, db } from '../database/db';

const TestDataManager = () => {
    const { user, isLoading } = useAuth();
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        userId: null
    });

    // Update auth state when user changes
    useEffect(() => {
        const isAuth = !!user?.id;
        setAuthState({
            isAuthenticated: isAuth,
            userId: user?.id || null
        });

        // Make auth state available globally
        window.__instantDBAuthState = {
            isAuthenticated: isAuth,
            userId: user?.id || null,
            email: user?.email || null
        };

        console.log('🔐 Auth state updated:', { isAuth, userId: user?.id, email: user?.email });
    }, [user]);

    // Function to save test attempt to InstantDB
    const saveTestAttemptToDB = async (attemptData) => {
        try {
            if (!user?.id) {
                console.warn('❌ Cannot save test attempt - user not authenticated');
                return null;
            }

            console.log('💾 Saving test attempt to InstantDB:', attemptData);

            const attemptId = db.id();
            
            // Save the main test attempt
            await db.transact([
                db.tx.testAttempts[attemptId].update({
                    userId: user.id,
                    subject: attemptData.subject,
                    testIndex: attemptData.testIndex,
                    score: attemptData.score,
                    correct: attemptData.correct,
                    total: attemptData.total,
                    date: attemptData.date || new Date().toISOString(),
                    userAnswers: JSON.stringify(attemptData.userAnswers || {}),
                    markedQuestions: JSON.stringify(attemptData.markedQuestions || {}),
                    totalTimeSeconds: attemptData.totalTimeSeconds || 0,
                    avgTimePerQuestionSeconds: attemptData.avgTimePerQuestionSeconds || 0,
                }),
            ]);

            // Save highlights if they exist
            if (attemptData.highlights && Object.keys(attemptData.highlights).length > 0) {
                const highlightId = db.id();
                await db.transact([
                    db.tx.testHighlights[highlightId].update({
                        attemptId: attemptId,
                        questionIndex: 0, // Store all highlights together
                        highlightData: JSON.stringify(attemptData.highlights),
                        passageHighlights: JSON.stringify(attemptData.passageHighlights || {}),
                    }),
                ]);
            }

            // Update test history
            await updateTestHistory(user.id, attemptData.subject, attemptData.testIndex, attemptData.score);

            console.log('✅ Test attempt saved to InstantDB successfully:', { attemptId, subject: attemptData.subject });
            return attemptId;
        } catch (error) {
            console.error('❌ Error saving test attempt to InstantDB:', error);
            throw error;
        }
    };

    // Function to update test history
    const updateTestHistory = async (userId, subject, testIndex, score) => {
        try {
            // Check if history entry exists
            const existingHistory = await db.query({
                testHistory: {
                    $: {
                        where: {
                            userId: { $eq: userId },
                            subject: { $eq: subject },
                            testIndex: { $eq: testIndex },
                        },
                    },
                },
            });

            const history = existingHistory.testHistory?.[0];
            
            if (history) {
                // Update existing history
                const newBestScore = Math.max(history.bestScore, score);
                const newAttemptCount = history.attemptCount + 1;
                
                await db.transact([
                    db.tx.testHistory[history.id].update({
                        lastAttemptDate: new Date().toISOString(),
                        bestScore: newBestScore,
                        attemptCount: newAttemptCount,
                    }),
                ]);
            } else {
                // Create new history entry
                const historyId = db.id();
                await db.transact([
                    db.tx.testHistory[historyId].update({
                        userId: userId,
                        subject: subject,
                        testIndex: testIndex,
                        lastAttemptDate: new Date().toISOString(),
                        bestScore: score,
                        attemptCount: 1,
                    }),
                ]);
            }
        } catch (error) {
            console.error('Error updating test history:', error);
            throw error;
        }
    };

    // Function to save test state
    const saveTestStateToDB = async (subject, testIndex, stateData) => {
        try {
            if (!user?.id) {
                console.warn('❌ Cannot save test state - user not authenticated');
                return;
            }

            // Check if state already exists
            const existingState = await db.query({
                testState: {
                    $: {
                        where: {
                            userId: { $eq: user.id },
                            subject: { $eq: subject },
                            testIndex: { $eq: testIndex },
                        },
                    },
                },
            });

            const state = existingState.testState?.[0];
            
            if (state) {
                // Update existing state
                await db.transact([
                    db.tx.testState[state.id].update({
                        currentQuestionIndex: stateData.currentQuestionIndex || 0,
                        answers: JSON.stringify(stateData.answers || {}),
                        marked: JSON.stringify(stateData.marked || {}),
                        timeLeft: stateData.timeLeft || 1800,
                        startedAt: stateData.startedAt || new Date().toISOString(),
                    }),
                ]);
            } else {
                // Create new state entry
                const stateId = db.id();
                await db.transact([
                    db.tx.testState[stateId].update({
                        userId: user.id,
                        subject: subject,
                        testIndex: testIndex,
                        currentQuestionIndex: stateData.currentQuestionIndex || 0,
                        answers: JSON.stringify(stateData.answers || {}),
                        marked: JSON.stringify(stateData.marked || {}),
                        timeLeft: stateData.timeLeft || 1800,
                        startedAt: stateData.startedAt || new Date().toISOString(),
                    }),
                ]);
            }

            console.log('✅ Test state saved to InstantDB');
        } catch (error) {
            console.error('Error saving test state:', error);
            throw error;
        }
    };

    // Function to clear test state
    const clearTestStateFromDB = async (subject, testIndex) => {
        try {
            if (!user?.id) {
                console.warn('❌ Cannot clear test state - user not authenticated');
                return;
            }

            const existingState = await db.query({
                testState: {
                    $: {
                        where: {
                            userId: { $eq: user.id },
                            subject: { $eq: subject },
                            testIndex: { $eq: testIndex },
                        },
                    },
                },
            });

            if (existingState.testState?.length > 0) {
                await db.transact([
                    ...existingState.testState.map(state => db.tx.testState[state.id].delete()),
                ]);
            }

            console.log('✅ Test state cleared from InstantDB');
        } catch (error) {
            console.error('Error clearing test state:', error);
            throw error;
        }
    };

    // Make functions available globally for vanilla JS
    useEffect(() => {
        window.__saveTestAttemptToDB = saveTestAttemptToDB;
        window.__saveTestStateToDB = saveTestStateToDB;
        window.__clearTestStateFromDB = clearTestStateFromDB;

        console.log('🔧 InstantDB test functions exposed globally');

        return () => {
            delete window.__saveTestAttemptToDB;
            delete window.__saveTestStateToDB;
            delete window.__clearTestStateFromDB;
        };
    }, [user]);

    // This component doesn't render anything visible
    return null;
};

export default TestDataManager;

// Also make it available globally for the exam-modals component
window.TestDataManager = TestDataManager;
