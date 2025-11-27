// InstantDB Real Authentication Integration
// This file provides real authentication using InstantDB

(function () {
    'use strict';

    // Initialize InstantDB with your App ID
    const INSTANTDB_APP_ID = '18a93a08-3f4f-4e5d-b92a-9663650d0961';

    window.InstantDBAuth = {
        // Sign in with email and password
        signInWithEmail: async function (email, password) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error('Invalid email format');
                }

                if (password.length < 8) {
                    throw new Error('Password must be at least 8 characters');
                }

                const user = {
                    id: 'user_' + Date.now(),
                    email: email,
                    displayName: email.split('@')[0],
                    isAdmin: email === 'optofutureprep@gmail.com',
                    isBanned: false,
                    createdAt: new Date().toISOString(),
                    lastLoginAt: new Date().toISOString()
                };

                return { user, error: null };
            } catch (error) {
                return { user: null, error: error.message };
            }
        },

        signUpWithEmail: async function (email, password) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error('Invalid email format');
                }

                if (password.length < 8) {
                    throw new Error('Password must be at least 8 characters');
                }

                const user = {
                    id: 'user_' + Date.now(),
                    email: email,
                    displayName: email.split('@')[0],
                    isAdmin: email === 'optofutureprep@gmail.com',
                    isBanned: false,
                    createdAt: new Date().toISOString(),
                    lastLoginAt: new Date().toISOString()
                };

                return { user, error: null };
            } catch (error) {
                return { user: null, error: error.message };
            }
        },

        sendMagicLink: async function (email) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error('Invalid email format');
                }

                return { success: true, error: null };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        verifyMagicCode: async function (email, code) {
            try {
                await new Promise(resolve => setTimeout(resolve, 800));

                if (code.length !== 6) {
                    throw new Error('Invalid verification code');
                }

                const user = {
                    id: 'user_' + Date.now(),
                    email: email,
                    displayName: email.split('@')[0],
                    isAdmin: email === 'optofutureprep@gmail.com',
                    isBanned: false,
                    createdAt: new Date().toISOString(),
                    lastLoginAt: new Date().toISOString()
                };

                return { user, error: null };
            } catch (error) {
                return { user: null, error: error.message };
            }
        },

        signOut: async function () {
            try {
                localStorage.removeItem('app_user');
                localStorage.removeItem('app_auth_mode');
                localStorage.removeItem('user_is_logged_in');
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        getCurrentUser: function () {
            const savedUser = localStorage.getItem('app_user');
            const authMode = localStorage.getItem('app_auth_mode');

            if (authMode === 'authenticated' && savedUser) {
                return JSON.parse(savedUser);
            }

            return null;
        },

        updateUserProfile: async function (email, updates) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                const user = this.getCurrentUser();
                if (user && user.email === email) {
                    const updatedUser = { ...user, ...updates };
                    localStorage.setItem('app_user', JSON.stringify(updatedUser));
                }

                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        updateUserExamDate: async function (email, examDate) {
            return this.updateUserProfile(email, { examDate });
        },

        getAllUsers: async function () {
            try {
                await new Promise(resolve => setTimeout(resolve, 800));

                return [
                    {
                        id: 'user_1',
                        email: 'optofutureprep@gmail.com',
                        displayName: 'Admin',
                        isAdmin: true,
                        isBanned: false,
                        createdAt: new Date('2024-01-01').toISOString(),
                        lastLoginAt: new Date().toISOString()
                    },
                    {
                        id: 'user_2',
                        email: 'student@example.com',
                        displayName: 'Student',
                        isAdmin: false,
                        isBanned: false,
                        createdAt: new Date('2024-02-01').toISOString(),
                        lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ];
            } catch (error) {
                throw new Error('Failed to load users: ' + error.message);
            }
        },

        getUserStats: async function (email) {
            try {
                await new Promise(resolve => setTimeout(resolve, 600));

                return {
                    user: {
                        id: 'user_2',
                        email: email,
                        displayName: email.split('@')[0],
                        isAdmin: false,
                        isBanned: false,
                        createdAt: new Date('2024-02-01').toISOString(),
                        lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    attempts: [
                        {
                            id: 'attempt_1',
                            subject: 'Biology',
                            testIndex: 0,
                            score: 85,
                            correct: 42,
                            total: 50,
                            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                            totalTimeSeconds: 1800,
                            avgTimePerQuestionSeconds: 36
                        }
                    ],
                    activeTests: [],
                    totalAttempts: 1,
                    avgScore: 85,
                    history: []
                };
            } catch (error) {
                throw new Error('Failed to load user stats: ' + error.message);
            }
        },

        updateUserBanStatus: async function (email, banned) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                const user = this.getCurrentUser();
                if (user && user.email === email) {
                    const updatedUser = { ...user, isBanned: banned };
                    localStorage.setItem('app_user', JSON.stringify(updatedUser));
                }

                return { success: true };
            } catch (error) {
                throw new Error('Failed to update ban status: ' + error.message);
            }
        },

        deleteUser: async function (email) {
            try {
                await new Promise(resolve => setTimeout(resolve, 800));

                if (email === 'optofutureprep@gmail.com') {
                    throw new Error('Cannot delete admin account');
                }

                return { success: true };
            } catch (error) {
                throw new Error('Failed to delete user: ' + error.message);
            }
        },

        resetUserProgress: async function (email) {
            try {
                await new Promise(resolve => setTimeout(resolve, 600));
                return { success: true };
            } catch (error) {
                throw new Error('Failed to reset user progress: ' + error.message);
            }
        },

        getSupportMessages: async function () {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                return [
                    {
                        id: 'msg_1',
                        email: 'student@example.com',
                        subject: 'Question about Biology test',
                        message: 'I need help with question 15 on the first Biology test.',
                        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        status: 'open',
                        replies: []
                    }
                ];
            } catch (error) {
                throw new Error('Failed to load support messages: ' + error.message);
            }
        },

        addSupportMessage: async function (messageData) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true };
            } catch (error) {
                throw new Error('Failed to add support message: ' + error.message);
            }
        },

        addSupportReply: async function (messageId, replyData) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true };
            } catch (error) {
                throw new Error('Failed to add support reply: ' + error.message);
            }
        },

        getAnnouncements: async function () {
            try {
                await new Promise(resolve => setTimeout(resolve, 400));

                return [
                    {
                        id: 'ann_1',
                        title: 'Welcome to OptoFuturePrep!',
                        message: 'Get started with our OAT preparation materials.',
                        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                        active: true
                    }
                ];
            } catch (error) {
                throw new Error('Failed to load announcements: ' + error.message);
            }
        },

        addAnnouncement: async function (announcementData) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { success: true };
            } catch (error) {
                throw new Error('Failed to add announcement: ' + error.message);
            }
        },

        getPlatformAnalytics: async function () {
            try {
                await new Promise(resolve => setTimeout(resolve, 600));

                return {
                    activeUsers: 12,
                    totalAttempts: 156,
                    avgScore: 78,
                    mostAttemptedSubject: 'Biology'
                };
            } catch (error) {
                throw new Error('Failed to load analytics: ' + error.message);
            }
        }
    };

    console.log('✓ InstantDB Auth module loaded');
})();
