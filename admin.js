const { useState, useEffect, useMemo } = React;

// Icons
const Icons = {
    Users: () => React.createElement('i', { 'data-lucide': 'users' }),
    Activity: () => React.createElement('i', { 'data-lucide': 'activity' }),
    MessageSquare: () => React.createElement('i', { 'data-lucide': 'message-square' }),
    Bell: () => React.createElement('i', { 'data-lucide': 'bell' }),
    Search: () => React.createElement('i', { 'data-lucide': 'search' }),
    Trash2: () => React.createElement('i', { 'data-lucide': 'trash-2' }),
    Ban: () => React.createElement('i', { 'data-lucide': 'ban' }),
    RefreshCw: () => React.createElement('i', { 'data-lucide': 'refresh-cw' }),
    Check: () => React.createElement('i', { 'data-lucide': 'check' }),
    X: () => React.createElement('i', { 'data-lucide': 'x' }),
    ChevronRight: () => React.createElement('i', { 'data-lucide': 'chevron-right' }),
    ArrowLeft: () => React.createElement('i', { 'data-lucide': 'arrow-left' }),
    Send: () => React.createElement('i', { 'data-lucide': 'send' })
};

// Sidebar Component
const Sidebar = ({ currentView, onViewChange }) => {
    const menuItems = [
        { id: 'users', label: 'User Management', icon: Icons.Users },
        { id: 'analytics', label: 'Analytics', icon: Icons.Activity },
        { id: 'support', label: 'Support Inbox', icon: Icons.MessageSquare },
        { id: 'announcements', label: 'Announcements', icon: Icons.Bell }
    ];

    return React.createElement('div', { className: 'sidebar' },
        React.createElement('div', { className: 'sidebar-header' },
            React.createElement('div', { className: 'sidebar-logo' },
                React.createElement('span', null, '🛡️'),
                React.createElement('span', null, 'Admin Panel')
            )
        ),
        React.createElement('div', { className: 'sidebar-nav' },
            menuItems.map(item =>
                React.createElement('div', {
                    key: item.id,
                    className: `nav-item ${currentView === item.id ? 'active' : ''}`,
                    onClick: () => onViewChange(item.id)
                },
                    React.createElement(item.icon),
                    React.createElement('span', null, item.label)
                )
            )
        ),
        React.createElement('div', { className: 'p-4 border-t border-slate-700' },
            React.createElement('button', {
                className: 'w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors',
                onClick: () => window.location.href = 'index.html'
            }, '← Back to App')
        )
    );
};

// Users View
const UsersView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await window.InstantDBAuth.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = async (user) => {
        setSelectedUser(user);
        try {
            const stats = await window.InstantDBAuth.getUserStats(user.email);
            setUserStats(stats);
        } catch (error) {
            console.error('Failed to load user stats:', error);
        }
    };

    const handleBanUser = async (email, currentStatus) => {
        if (email === 'optofutureprep@gmail.com') {
            alert('You cannot ban the main admin account.');
            return;
        }
        if (confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this user?`)) {
            try {
                await window.InstantDBAuth.updateUserBanStatus(email, !currentStatus);
                loadUsers();
                if (selectedUser && selectedUser.email === email) {
                    setSelectedUser({ ...selectedUser, banned: !currentStatus });
                }
            } catch (error) {
                alert('Failed to update ban status: ' + error.message);
            }
        }
    };

    const handleDeleteUser = async (email) => {
        if (email === 'optofutureprep@gmail.com') {
            alert('You cannot delete the main admin account.');
            return;
        }
        if (confirm('Are you sure you want to DELETE this user? This action cannot be undone.')) {
            try {
                await window.InstantDBAuth.deleteUser(email);
                loadUsers();
                setSelectedUser(null);
            } catch (error) {
                alert('Failed to delete user: ' + error.message);
            }
        }
    };

    const handleResetProgress = async (email) => {
        if (confirm('Are you sure you want to RESET all progress for this user?')) {
            try {
                await window.InstantDBAuth.resetUserProgress(email);
                alert('User progress reset successfully.');
                if (selectedUser) handleUserClick(selectedUser); // Reload stats
            } catch (error) {
                alert('Failed to reset progress: ' + error.message);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.id && user.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (selectedUser) {
        return React.createElement('div', { className: 'animate-fade-in' },
            React.createElement('div', { className: 'mb-6' },
                React.createElement('button', {
                    className: 'btn btn-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-600',
                    onClick: () => { setSelectedUser(null); setUserStats(null); }
                },
                    React.createElement(Icons.ArrowLeft, { size: 16 }),
                    React.createElement('span', { className: 'ml-2' }, 'Back to Users')
                )
            ),
            React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
                // User Profile Card
                React.createElement('div', { className: 'card col-span-1' },
                    React.createElement('div', { className: 'flex items-center gap-4 mb-6' },
                        React.createElement('div', { className: 'w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl' }, '👤'),
                        React.createElement('div', null,
                            React.createElement('h3', { className: 'font-bold text-lg' }, selectedUser.email),
                            React.createElement('p', { className: 'text-sm text-slate-500' }, `ID: ${selectedUser.id}`)
                        )
                    ),
                    React.createElement('div', { className: 'space-y-4' },
                        React.createElement('div', { className: 'flex justify-between py-2 border-b border-slate-100' },
                            React.createElement('span', { className: 'text-slate-500' }, 'Status'),
                            React.createElement('span', { className: `status-badge ${selectedUser.banned ? 'status-banned' : 'status-active'}` },
                                selectedUser.banned ? 'Banned' : 'Active'
                            )
                        ),
                        React.createElement('div', { className: 'flex justify-between py-2 border-b border-slate-100' },
                            React.createElement('span', { className: 'text-slate-500' }, 'Joined'),
                            React.createElement('span', null, new Date(selectedUser.createdAt).toLocaleDateString())
                        ),
                        React.createElement('div', { className: 'flex justify-between py-2 border-b border-slate-100' },
                            React.createElement('span', { className: 'text-slate-500' }, 'Last Login'),
                            React.createElement('span', null, selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleDateString() : 'Never')
                        )
                    ),
                    React.createElement('div', { className: 'mt-8 space-y-3' },
                        React.createElement('button', {
                            className: 'w-full btn btn-danger justify-center',
                            onClick: () => handleBanUser(selectedUser.email, selectedUser.banned)
                        },
                            React.createElement(Icons.Ban, { size: 16 }),
                            selectedUser.banned ? 'Unban User' : 'Ban User'
                        ),
                        React.createElement('button', {
                            className: 'w-full btn bg-orange-50 text-orange-600 hover:bg-orange-100 justify-center',
                            onClick: () => handleResetProgress(selectedUser.email)
                        },
                            React.createElement(Icons.RefreshCw, { size: 16 }),
                            'Reset Progress'
                        ),
                        React.createElement('button', {
                            className: 'w-full btn bg-slate-100 text-slate-600 hover:bg-slate-200 justify-center',
                            onClick: () => handleDeleteUser(selectedUser.email)
                        },
                            React.createElement(Icons.Trash2, { size: 16 }),
                            'Delete Account'
                        )
                    )
                ),
                // Stats & Activity
                React.createElement('div', { className: 'col-span-1 lg:col-span-2 space-y-6' },
                    !userStats ? React.createElement('div', { className: 'card p-8 text-center text-slate-400' }, 'Loading stats...') :
                        React.createElement(React.Fragment, null,
                            React.createElement('div', { className: 'grid grid-cols-3 gap-4' },
                                React.createElement('div', { className: 'card p-4 text-center' },
                                    React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, userStats.attempts.length),
                                    React.createElement('div', { className: 'text-sm text-slate-500' }, 'Tests Taken')
                                ),
                                React.createElement('div', { className: 'card p-4 text-center' },
                                    React.createElement('div', { className: 'text-2xl font-bold text-green-600' },
                                        userStats.attempts.length > 0
                                            ? Math.round(userStats.attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / userStats.attempts.length)
                                            : 0
                                    ),
                                    React.createElement('div', { className: 'text-sm text-slate-500' }, 'Avg Score')
                                ),
                                React.createElement('div', { className: 'card p-4 text-center' },
                                    React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, userStats.activeTests.length),
                                    React.createElement('div', { className: 'text-sm text-slate-500' }, 'In Progress')
                                )
                            ),
                            React.createElement('div', { className: 'card' },
                                React.createElement('h3', { className: 'font-bold mb-4' }, 'Recent Activity'),
                                React.createElement('div', { className: 'space-y-4' },
                                    userStats.attempts.length === 0 ? React.createElement('p', { className: 'text-slate-400 text-center py-4' }, 'No activity yet') :
                                        userStats.attempts.slice(0, 5).map(attempt =>
                                            React.createElement('div', { key: attempt.id, className: 'flex items-center justify-between p-3 bg-slate-50 rounded-lg' },
                                                React.createElement('div', null,
                                                    React.createElement('div', { className: 'font-medium' }, attempt.subject),
                                                    React.createElement('div', { className: 'text-xs text-slate-500' }, new Date(attempt.date).toLocaleString())
                                                ),
                                                React.createElement('div', { className: 'font-bold' }, `Score: ${attempt.score}`)
                                            )
                                        )
                                )
                            )
                        )
                )
            )
        );
    }

    return React.createElement('div', { className: 'animate-fade-in' },
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', { className: 'page-title' }, 'User Management'),
            React.createElement('div', { className: 'relative' },
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Search users...',
                    className: 'pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-64 focus:outline-none focus:border-blue-500',
                    value: searchTerm,
                    onChange: (e) => setSearchTerm(e.target.value)
                }),
                React.createElement('div', { className: 'absolute left-3 top-2.5 text-slate-400' },
                    React.createElement(Icons.Search, { size: 18 })
                )
            )
        ),
        React.createElement('div', { className: 'card table-container' },
            React.createElement('table', { className: 'data-table' },
                React.createElement('thead', null,
                    React.createElement('tr', null,
                        React.createElement('th', null, 'User'),
                        React.createElement('th', null, 'Status'),
                        React.createElement('th', null, 'Joined'),
                        React.createElement('th', null, 'Actions')
                    )
                ),
                React.createElement('tbody', null,
                    loading ? React.createElement('tr', null, React.createElement('td', { colSpan: 4, className: 'text-center py-8' }, 'Loading...')) :
                        filteredUsers.length === 0 ? React.createElement('tr', null, React.createElement('td', { colSpan: 4, className: 'text-center py-8' }, 'No users found')) :
                            filteredUsers.map(user =>
                                React.createElement('tr', { key: user.id },
                                    React.createElement('td', null,
                                        React.createElement('div', { className: 'font-medium' }, user.email),
                                        React.createElement('div', { className: 'text-xs text-slate-500' }, user.id)
                                    ),
                                    React.createElement('td', null,
                                        React.createElement('span', { className: `status-badge ${user.banned ? 'status-banned' : 'status-active'}` },
                                            user.banned ? 'Banned' : 'Active'
                                        )
                                    ),
                                    React.createElement('td', null, new Date(user.createdAt).toLocaleDateString()),
                                    React.createElement('td', null,
                                        React.createElement('button', {
                                            className: 'btn btn-sm btn-primary',
                                            onClick: () => handleUserClick(user)
                                        }, 'View Profile')
                                    )
                                )
                            )
                )
            )
        )
    );
};

// Analytics View
const AnalyticsView = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            const data = await window.InstantDBAuth.getPlatformAnalytics();
            setStats(data);
        };
        loadStats();
    }, []);

    if (!stats) return React.createElement('div', { className: 'p-8 text-center' }, 'Loading analytics...');

    return React.createElement('div', { className: 'animate-fade-in' },
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', { className: 'page-title' }, 'Platform Analytics')
        ),
        React.createElement('div', { className: 'stats-grid' },
            React.createElement('div', { className: 'stat-card' },
                React.createElement('span', { className: 'stat-label' }, 'Active Users'),
                React.createElement('span', { className: 'stat-value text-blue-600' }, stats.activeUsers)
            ),
            React.createElement('div', { className: 'stat-card' },
                React.createElement('span', { className: 'stat-label' }, 'Total Attempts'),
                React.createElement('span', { className: 'stat-value text-green-600' }, stats.totalAttempts)
            ),
            React.createElement('div', { className: 'stat-card' },
                React.createElement('span', { className: 'stat-label' }, 'Avg Score'),
                React.createElement('span', { className: 'stat-value text-purple-600' }, stats.avgScore)
            ),
            React.createElement('div', { className: 'stat-card' },
                React.createElement('span', { className: 'stat-label' }, 'Top Subject'),
                React.createElement('span', { className: 'stat-value text-orange-600 text-xl' }, stats.mostAttemptedSubject)
            )
        ),
        React.createElement('div', { className: 'card' },
            React.createElement('h3', { className: 'font-bold mb-4' }, 'Question Health Checker'),
            React.createElement('p', { className: 'text-slate-500 mb-4' }, 'Automated analysis of question performance and potential issues.'),
            React.createElement('div', { className: 'p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800' },
                '⚠️ This feature requires more data to be effective. Once more students take exams, we will flag questions with < 20% correct rate here.'
            )
        )
    );
};

// Support View
const SupportView = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        const data = await window.InstantDBAuth.getSupportMessages();
        setMessages(data);
    };

    const handleReply = async () => {
        if (!replyText.trim() || !selectedMessage) return;

        try {
            await window.InstantDBAuth.addSupportReply(selectedMessage.id, {
                message: replyText,
                from: 'admin'
            });
            setReplyText('');
            loadMessages();
            // Update selected message locally
            const updatedMsg = {
                ...selectedMessage,
                replies: [...(selectedMessage.replies || []), { message: replyText, from: 'admin', createdAt: new Date().toISOString() }]
            };
            setSelectedMessage(updatedMsg);
        } catch (error) {
            alert('Failed to send reply');
        }
    };

    return React.createElement('div', { className: 'animate-fade-in h-[calc(100vh-100px)] flex flex-col' },
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', { className: 'page-title' }, 'Support Inbox')
        ),
        React.createElement('div', { className: 'chat-container flex-1' },
            React.createElement('div', { className: 'chat-list' },
                messages.length === 0 ? React.createElement('div', { className: 'p-4 text-slate-400 text-center' }, 'No messages') :
                    messages.map(msg =>
                        React.createElement('div', {
                            key: msg.id,
                            className: `chat-item ${selectedMessage?.id === msg.id ? 'active' : ''}`,
                            onClick: () => setSelectedMessage(msg)
                        },
                            React.createElement('div', { className: 'font-medium truncate' }, msg.subject || 'No Subject'),
                            React.createElement('div', { className: 'text-sm text-slate-500 truncate' }, msg.email),
                            React.createElement('div', { className: 'text-xs text-slate-400 mt-1' }, new Date(msg.createdAt).toLocaleDateString())
                        )
                    )
            ),
            React.createElement('div', { className: 'chat-main' },
                !selectedMessage ? React.createElement('div', { className: 'flex items-center justify-center h-full text-slate-400' }, 'Select a message to view') :
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { className: 'p-4 border-b border-slate-200' },
                            React.createElement('h3', { className: 'font-bold' }, selectedMessage.subject),
                            React.createElement('div', { className: 'text-sm text-slate-500' }, `From: ${selectedMessage.email}`)
                        ),
                        React.createElement('div', { className: 'chat-messages' },
                            React.createElement('div', { className: 'message user' },
                                React.createElement('div', { className: 'text-sm mb-1 font-medium' }, 'User'),
                                selectedMessage.message
                            ),
                            (selectedMessage.replies || []).map((reply, idx) =>
                                React.createElement('div', { key: idx, className: `message ${reply.from === 'admin' ? 'admin' : 'user'}` },
                                    React.createElement('div', { className: 'text-sm mb-1 font-medium' }, reply.from === 'admin' ? 'You' : 'User'),
                                    reply.message
                                )
                            )
                        ),
                        React.createElement('div', { className: 'chat-input' },
                            React.createElement('input', {
                                type: 'text',
                                placeholder: 'Type your reply...',
                                value: replyText,
                                onChange: (e) => setReplyText(e.target.value),
                                onKeyPress: (e) => e.key === 'Enter' && handleReply()
                            }),
                            React.createElement('button', {
                                className: 'btn btn-primary',
                                onClick: handleReply
                            }, React.createElement(Icons.Send, { size: 18 }))
                        )
                    )
            )
        )
    );
};

// Announcements View
const AnnouncementsView = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        const data = await window.InstantDBAuth.getAnnouncements();
        setAnnouncements(data);
    };

    const handlePost = async () => {
        if (!title || !message) return;
        try {
            await window.InstantDBAuth.addAnnouncement({ title, message });
            setTitle('');
            setMessage('');
            loadAnnouncements();
            alert('Announcement posted!');
        } catch (error) {
            alert('Failed to post announcement');
        }
    };

    return React.createElement('div', { className: 'animate-fade-in' },
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', { className: 'page-title' }, 'Announcements')
        ),
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' },
            React.createElement('div', { className: 'card' },
                React.createElement('h3', { className: 'font-bold mb-4' }, 'Create New Announcement'),
                React.createElement('div', { className: 'space-y-4' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-slate-700 mb-1' }, 'Title'),
                        React.createElement('input', {
                            type: 'text',
                            className: 'w-full p-2 border border-slate-300 rounded-lg',
                            value: title,
                            onChange: (e) => setTitle(e.target.value)
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-medium text-slate-700 mb-1' }, 'Message'),
                        React.createElement('textarea', {
                            className: 'w-full p-2 border border-slate-300 rounded-lg h-32',
                            value: message,
                            onChange: (e) => setMessage(e.target.value)
                        })
                    ),
                    React.createElement('button', {
                        className: 'btn btn-primary w-full justify-center',
                        onClick: handlePost
                    }, 'Post Announcement')
                )
            ),
            React.createElement('div', { className: 'space-y-4' },
                React.createElement('h3', { className: 'font-bold text-lg' }, 'Recent Announcements'),
                announcements.length === 0 ? React.createElement('p', { className: 'text-slate-500' }, 'No announcements yet.') :
                    announcements.map(a =>
                        React.createElement('div', { key: a.id, className: 'card p-4' },
                            React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                                React.createElement('h4', { className: 'font-bold' }, a.title),
                                React.createElement('span', { className: 'text-xs text-slate-500' }, new Date(a.createdAt).toLocaleDateString())
                            ),
                            React.createElement('p', { className: 'text-slate-600' }, a.message)
                        )
                    )
            )
        )
    );
};

// Main App Component
const App = () => {
    const [currentView, setCurrentView] = useState('users');
    const [isAdmin, setIsAdmin] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkAdmin();
        // Initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [currentView]); // Re-run icons on view change

    const checkAdmin = () => {
        const user = localStorage.getItem('app_user');
        if (user) {
            const userData = JSON.parse(user);
            if (userData.email === 'optofutureprep@gmail.com') {
                setIsAdmin(true);
            } else {
                window.location.href = 'index.html';
            }
        } else {
            window.location.href = 'index.html';
        }
        setChecking(false);
    };

    if (checking) return null;
    if (!isAdmin) return null;

    const renderView = () => {
        switch (currentView) {
            case 'users': return React.createElement(UsersView);
            case 'analytics': return React.createElement(AnalyticsView);
            case 'support': return React.createElement(SupportView);
            case 'announcements': return React.createElement(AnnouncementsView);
            default: return React.createElement(UsersView);
        }
    };

    return React.createElement('div', { className: 'dashboard-layout' },
        React.createElement(Sidebar, { currentView, onViewChange: setCurrentView }),
        React.createElement('main', { className: 'main-content' },
            renderView()
        )
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
