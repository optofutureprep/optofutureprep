// InstantDB database initialization and service layer
import { init } from '@instantdb/react';
import schema from './instant.schema';

// Initialize InstantDB with app ID
export const db = init({
    appId: '18a93a08-3f4f-4e5d-b92a-9663650d0961',
    schema,
});

// Export auth functions
export const { useAuth, Auth, useQuery } = db;

// Helper function to get current user ID
export function getCurrentUserId() {
    const auth = db.auth.getState();
    return auth?.user?.id || null;
}

// Helper function to check if user is authenticated
export function isAuthenticated() {
    const auth = db.auth.getState();
    return !!auth?.user?.id;
}

// User management functions
export async function getAllUsers() {
    try {
        const result = db.query({
            users: {
                $: {
                    order: { createdAt: 'desc' },
                },
            },
        });
        return result.users || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function getUserStats(email) {
    try {
        // Get user by email first
        const userResult = db.query({
            users: {
                $: {
                    where: { email: { $eq: email } },
                },
            },
        });

        if (!userResult.users || userResult.users.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.users[0];
        const userId = user.id;

        // Get user's test attempts
        const attemptsResult = db.query({
            testAttempts: {
                $: {
                    where: { userId: { $eq: userId } },
                    order: { date: 'desc' },
                },
            },
        });

        // Get user's test history
        const historyResult = db.query({
            testHistory: {
                $: {
                    where: { userId: { $eq: userId } },
                },
            },
        });

        // Get active/in-progress tests
        const stateResult = db.query({
            testState: {
                $: {
                    where: { userId: { $eq: userId } },
                },
            },
        });

        const attempts = attemptsResult.testAttempts || [];
        const history = historyResult.testHistory || [];
        const activeTests = stateResult.testState || [];

        // Calculate stats
        const totalAttempts = attempts.length;
        const avgScore = totalAttempts > 0
            ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts)
            : 0;

        return {
            user,
            attempts,
            activeTests,
            totalAttempts,
            avgScore,
            history,
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
}

export async function updateUserBanStatus(email, banned) {
    try {
        const userResult = db.query({
            users: {
                $: {
                    where: { email: { $eq: email } },
                },
            },
        });

        if (!userResult.users || userResult.users.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.users[0];

        db.transact([
            db.tx.users[user.id].update({ isBanned: banned }),
        ]);

        return true;
    } catch (error) {
        console.error('Error updating user ban status:', error);
        throw error;
    }
}

export async function deleteUser(email) {
    try {
        const userResult = db.query({
            users: {
                $: {
                    where: { email: { $eq: email } },
                },
            },
        });

        if (!userResult.users || userResult.users.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.users[0];
        const userId = user.id;

        // Delete all user data
        db.transact([
            // Delete test states
            ...db.query({
                testState: { $: { where: { userId: { $eq: userId } } } },
            }).testState?.map(state => db.tx.testState[state.id].delete()) || [],

            // Delete test attempts
            ...db.query({
                testAttempts: { $: { where: { userId: { $eq: userId } } } },
            }).testAttempts?.map(attempt => db.tx.testAttempts[attempt.id].delete()) || [],

            // Delete test history
            ...db.query({
                testHistory: { $: { where: { userId: { $eq: userId } } } },
            }).testHistory?.map(history => db.tx.testHistory[history.id].delete()) || [],

            // Delete user
            db.tx.users[user.id].delete(),
        ]);

        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export async function resetUserProgress(email) {
    try {
        const userResult = db.query({
            users: {
                $: {
                    where: { email: { $eq: email } },
                },
            },
        });

        if (!userResult.users || userResult.users.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.users[0];
        const userId = user.id;

        // Delete test data but keep user account
        db.transact([
            // Delete test states
            ...db.query({
                testState: { $: { where: { userId: { $eq: userId } } } },
            }).testState?.map(state => db.tx.testState[state.id].delete()) || [],

            // Delete test attempts
            ...db.query({
                testAttempts: { $: { where: { userId: { $eq: userId } } } },
            }).testAttempts?.map(attempt => db.tx.testAttempts[attempt.id].delete()) || [],

            // Delete test history
            ...db.query({
                testHistory: { $: { where: { userId: { $eq: userId } } } },
            }).testHistory?.map(history => db.tx.testHistory[history.id].delete()) || [],
        ]);

        return true;
    } catch (error) {
        console.error('Error resetting user progress:', error);
        throw error;
    }
}

export async function updateUserProfile(email, updates) {
    try {
        const userResult = db.query({
            users: {
                $: {
                    where: { email: { $eq: email } },
                },
            },
        });

        if (!userResult.users || userResult.users.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.users[0];

        db.transact([
            db.tx.users[user.id].update(updates),
        ]);

        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

export async function updateUserExamDate(email, examDate) {
    return updateUserProfile(email, { examDate });
}

// Support system functions
export async function getSupportMessages() {
    try {
        const result = db.query({
            supportMessages: {
                $: {
                    order: { createdAt: 'desc' },
                },
            },
            supportReplies: {
                $: {
                    order: { createdAt: 'asc' },
                },
            },
        });

        // Group replies by message
        const messages = (result.supportMessages || []).map(msg => ({
            ...msg,
            replies: (result.supportReplies || []).filter(reply => reply.messageId === msg.id),
        }));

        return messages;
    } catch (error) {
        console.error('Error fetching support messages:', error);
        return [];
    }
}

export async function addSupportMessage(messageData) {
    try {
        const messageId = db.id();
        db.transact([
            db.tx.supportMessages[messageId].update({
                email: messageData.email,
                subject: messageData.subject,
                message: messageData.message,
                createdAt: new Date().toISOString(),
            }),
        ]);

        return messageId;
    } catch (error) {
        console.error('Error adding support message:', error);
        throw error;
    }
}

export async function addSupportReply(messageId, replyData) {
    try {
        const replyId = db.id();
        db.transact([
            db.tx.supportReplies[replyId].update({
                messageId,
                message: replyData.message,
                from: replyData.from,
                createdAt: new Date().toISOString(),
            }),

            // Update message status if admin replied
            db.tx.supportMessages[messageId].update({
                status: replyData.from === 'admin' ? 'replied' : 'open',
            }),
        ]);

        return replyId;
    } catch (error) {
        console.error('Error adding support reply:', error);
        throw error;
    }
}

// Announcements functions
export async function getAnnouncements() {
    try {
        const result = db.query({
            announcements: {
                $: {
                    where: { active: { $eq: true } },
                    order: { createdAt: 'desc' },
                },
            },
        });

        return result.announcements || [];
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return [];
    }
}

export async function addAnnouncement(announcementData) {
    try {
        const announcementId = db.id();
        db.transact([
            db.tx.announcements[announcementId].update({
                title: announcementData.title,
                message: announcementData.message,
                createdAt: new Date().toISOString(),
                active: true,
            }),
        ]);

        return announcementId;
    } catch (error) {
        console.error('Error adding announcement:', error);
        throw error;
    }
}

// Platform analytics
export async function getPlatformAnalytics() {
    try {
        // Get all users
        const usersResult = db.query({ users: {} });
        const totalUsers = usersResult.users?.length || 0;

        // Get active users (logged in within last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const activeUsersResult = db.query({
            users: {
                $: {
                    where: { lastLoginAt: { $gte: thirtyDaysAgo } },
                },
            },
        });
        const activeUsers = activeUsersResult.users?.length || 0;

        // Get all test attempts
        const attemptsResult = db.query({ testAttempts: {} });
        const attempts = attemptsResult.testAttempts || [];
        const totalAttempts = attempts.length;

        // Calculate average score
        const avgScore = totalAttempts > 0
            ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts)
            : 0;

        // Find most attempted subject
        const subjectCounts = {};
        attempts.forEach(attempt => {
            subjectCounts[attempt.subject] = (subjectCounts[attempt.subject] || 0) + 1;
        });
        const mostAttemptedSubject = Object.keys(subjectCounts).reduce((a, b) =>
            subjectCounts[a] > subjectCounts[b] ? a : b, 'None');

        return {
            totalUsers,
            activeUsers,
            totalAttempts,
            avgScore,
            mostAttemptedSubject,
        };
    } catch (error) {
        console.error('Error fetching platform analytics:', error);
        return {
            totalUsers: 0,
            activeUsers: 0,
            totalAttempts: 0,
            avgScore: 0,
            mostAttemptedSubject: 'None',
        };
    }
}

export default db;
