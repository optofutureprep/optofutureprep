(function () {
    'use strict';

    // Configuration
    const STORAGE_KEYS = {
        NAME: 'user_profile_name',
        EXAM_DATE: 'user_exam_date',
        IS_ADMIN: 'user_is_admin'
    };

    // State
    let state = {
        isAuthenticated: false,
        name: localStorage.getItem(STORAGE_KEYS.NAME) || '',
        examDate: localStorage.getItem(STORAGE_KEYS.EXAM_DATE) || '',
        isAdmin: localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true'
    };

    // DOM Elements
    let fabContainer = null;
    let menuElement = null;
    let menuOverlay = null;

    // Initialize
    function init() {
        console.log('🚀 User Features Initializing...');

        // Restore auth state from localStorage
        const savedUser = localStorage.getItem('app_user');
        const authMode = localStorage.getItem('app_auth_mode');

        if (authMode === 'authenticated' && savedUser) {
            try {
                const user = JSON.parse(savedUser);
                if (window.APP_AUTH_STATE) {
                    window.APP_AUTH_STATE.isAuthenticated = true;
                    window.APP_AUTH_STATE.user = user;
                    window.APP_AUTH_STATE.mode = 'authenticated';
                }
                state.isAuthenticated = true;
                state.name = user.email;
                state.isAdmin = user.email === 'optofutureprep@gmail.com';
                console.log('✅ Restored session for:', user.email);
            } catch (e) {
                console.error('Failed to restore session:', e);
            }
        }

        createStyles();
        createFAB();
        createMenu();

        // Start Auth Polling
        checkAuth();
        setInterval(checkAuth, 500);

        // Listen for storage events
        window.addEventListener('storage', (e) => {
            if (e.key === 'app_auth_mode' || e.key === 'app_user') {
                checkAuth();
            }
        });

        // Listen for custom auth events
        window.addEventListener('authStateChanged', (e) => {
            console.log('🔄 Auth state changed:', e.detail);
            checkAuth();
        });
    }

    function checkAuth() {
        // Check global app state
        if (window.APP_AUTH_STATE && typeof window.APP_AUTH_STATE.isAuthenticated === 'boolean') {
            state.isAuthenticated = window.APP_AUTH_STATE.isAuthenticated;
            if (window.APP_AUTH_STATE.user) {
                state.name = window.APP_AUTH_STATE.user.email;
                // Check if user is admin
                state.isAdmin = window.APP_AUTH_STATE.user.email === 'optofutureprep@gmail.com';
            }
        }
        // Check InstantDB state
        else if (window.__instantDBAuthState && typeof window.__instantDBAuthState.isAuthenticated === 'boolean') {
            state.isAuthenticated = window.__instantDBAuthState.isAuthenticated;
        }
        // Fallback to localStorage
        else {
            const authMode = localStorage.getItem('app_auth_mode');
            state.isAuthenticated = (authMode === 'authenticated');
            // Check admin status from localStorage
            if (state.isAuthenticated) {
                const userData = localStorage.getItem('app_user');
                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        state.name = user.email;
                        state.isAdmin = user.email === 'optofutureprep@gmail.com';
                    } catch (e) {
                        console.error('Error parsing user data:', e);
                    }
                }
            }
        }

        updateVisibility();
        updateMenuState();
    }

    function updateVisibility() {
        if (fabContainer) {
            const authContainer = document.querySelector('.auth-floating-container');
            const fabBtn = document.getElementById('account-fab-btn');
            const fabText = fabBtn?.querySelector('.fab-text');
            const fabIcon = fabBtn?.querySelector('.fab-icon');

            // Always keep FAB visible, just change the content
            fabContainer.classList.remove('hidden');

            if (state.isAuthenticated) {
                // Show + icon for authenticated users
                if (fabText) fabText.style.display = 'none';
                if (fabIcon) fabIcon.style.display = 'block';
                if (fabBtn) fabBtn.classList.add('authenticated');
                console.log('✅ FAB switched to + icon (authenticated)');
            } else {
                // Show "Account" text for guests
                if (fabText) fabText.style.display = 'block';
                if (fabIcon) fabIcon.style.display = 'none';
                if (fabBtn) fabBtn.classList.remove('authenticated');
                console.log('✅ FAB switched to Account button (guest)');
            }

            // Hide the React auth container if it exists
            if (authContainer) {
                authContainer.style.display = 'none';
            }
        }
    }

    function updateMenuState() {
        if (!menuElement) return;

        const guestView = menuElement.querySelector('#guest-view');
        const authView = menuElement.querySelector('#auth-view');
        const adminToolsCard = menuElement.querySelector('#admin-tools-card');

        if (state.isAuthenticated) {
            if (guestView) guestView.style.display = 'none';
            if (authView) authView.style.display = 'block';
            if (adminToolsCard) {
                adminToolsCard.style.display = state.isAdmin ? 'flex' : 'none';
            }
        } else {
            if (guestView) guestView.style.display = 'block';
            if (authView) authView.style.display = 'none';
        }
    }

    function createFAB() {
        fabContainer = document.createElement('div');
        fabContainer.className = 'user-fab-container'; // Removed 'hidden' - show immediately

        const fabBtn = document.createElement('button');
        fabBtn.className = 'user-fab';
        fabBtn.id = 'account-fab-btn';
        fabBtn.innerHTML = '<span class="fab-text">Account</span><span class="fab-icon">+</span>';
        fabBtn.setAttribute('aria-label', 'User Menu');
        fabBtn.onclick = toggleMenu;

        fabContainer.appendChild(fabBtn);
        document.body.appendChild(fabContainer);

        console.log('✅ FAB button created and added to page');
    }

    function createMenu() {
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'user-menu-overlay';
        menuOverlay.onclick = closeMenu;
        document.body.appendChild(menuOverlay);

        menuElement = document.createElement('div');
        menuElement.className = 'user-menu';

        menuElement.innerHTML = `
            <div class="user-menu-header">
            </div>
            
            <div class="user-menu-content">
                <div id="guest-view" style="display: none;">
                    <div class="menu-section">
                        <!-- Header -->
                        <div class="auth-header-blue">
                            <h3 id="auth-view-title" class="auth-title" style="font-size: 1.5rem; letter-spacing: -0.5px; margin-bottom: 8px;">🚀 Your Journey to Success</h3>
                            <p id="auth-view-subtitle" class="auth-subtitle" style="font-size: 0.9rem;">Unlock your potential and achieve greatness</p>
                        </div>

                        <!-- Auth Form -->
                        <div class="auth-form-container">
                            <div class="input-group">
                                <div class="input-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="#94a3b8">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <input type="email" id="unified-auth-email" class="modern-input with-icon" placeholder="Email address" required>
                            </div>
                            
                            <div class="input-group">
                                <div class="input-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="#94a3b8">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                <input type="password" id="unified-auth-password" class="modern-input with-icon" placeholder="Password" required>
                                <button type="button" id="toggle-password-visibility" class="password-toggle">
                                    <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                            
                            <div id="unified-auth-error" class="auth-error"></div>
                            
                            <div class="remember-me-container">
                                <label class="remember-me-label">
                                    <input type="checkbox" id="remember-me" class="remember-me-checkbox">
                                    <span class="remember-me-checkmark"></span>
                                    Remember me
                                </label>
                            </div>
                            
                            <button id="unified-auth-btn" class="modern-btn primary large-btn">
                                Create Account
                            </button>
                        </div>

                        <!-- Footer Actions -->
                        <div class="auth-footer">
                            <p class="toggle-text">
                                <span id="auth-toggle-prompt">Already have an account?</span>
                                <a id="auth-toggle-link" href="#">Sign In</a>
                            </p>
                            
                            <div class="divider">
                                <span>or continue with</span>
                            </div>

                            <button onclick="window.UserFeatures.continueAsGuest()" class="modern-btn guest-btn">
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                </div>

                <div id="auth-view" style="display: none;">
                    <div class="dashboard-grid">
                        <div class="menu-card grid-card" onclick="window.UserFeatures.showSection('profile')">
                            <div class="menu-card-icon-simple">👤</div>
                            <div class="menu-card-title-simple">Profile</div>
                        </div>

                        <div class="menu-card grid-card" onclick="window.UserFeatures.showSection('calendar')">
                            <div class="menu-card-icon-simple">📅</div>
                            <div class="menu-card-title-simple">Exam Date</div>
                        </div>

                        <div class="menu-card grid-card admin-card" id="admin-tools-card" onclick="window.location.href='admin.html'">
                            <div class="menu-card-icon-simple">🛡️</div>
                            <div class="menu-card-title-simple">Admin & Tools</div>
                        </div>

                        <div class="menu-card grid-card" onclick="window.UserFeatures.triggerSupport()">
                            <div class="menu-card-icon-simple">💬</div>
                            <div class="menu-card-title-simple">Support</div>
                        </div>

                        <div class="menu-card grid-card" onclick="window.UserFeatures.showSection('announcements')">
                            <div class="menu-card-icon-simple">🔔</div>
                            <div class="menu-card-title-simple">News</div>
                        </div>
                    </div>

                    <div class="menu-section" style="margin-top: 20px;">
                        <button class="modern-btn logout-btn" onclick="window.UserFeatures.signOut()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div id="menu-content-profile" class="menu-content-area">
                <div class="content-header">
                    <button class="back-btn" onclick="window.UserFeatures.showMain()">← Back</button>
                    <h4>Edit Profile</h4>
                </div>
                <div class="profile-avatar-container">
                    <div class="profile-avatar">👤</div>
                    <div class="profile-email" id="profile-email-display">user@example.com</div>
                </div>
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; color: var(--text-main);">Display Name</label>
                    <input type="text" class="modern-input" id="menu-name-input" placeholder="Enter your name">
                </div>
                <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--bg-subtle); border-radius: 12px;">
                    <input type="checkbox" id="welcome-banner-toggle">
                    <label for="welcome-banner-toggle" style="font-size: 0.9rem; color: var(--text-main); cursor: pointer;">Disable Welcome Banner</label>
                </div>
                <button class="modern-btn primary large-btn" id="menu-save-profile">Save Changes</button>
            </div>

            <div id="menu-content-calendar" class="menu-content-area">
                <div class="content-header">
                    <button class="back-btn" onclick="window.UserFeatures.showMain()">← Back</button>
                    <h4>Exam Date</h4>
                </div>
                <div class="exam-date-container">
                    <div class="countdown-label">Time Until Exam</div>
                    <div id="menu-countdown-display" class="countdown-display">-- Days</div>
                    <div style="margin-bottom: 24px; color: var(--text-muted); font-size: 0.9rem;">Set your exam date to start the countdown.</div>
                    
                    <div class="input-group" style="text-align: left;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; color: var(--text-main);">Target Date</label>
                        <input type="date" class="modern-input" id="menu-date-input">
                    </div>
                    <button class="modern-btn primary large-btn" id="menu-save-date">Start Countdown</button>
                </div>
            </div>



            <div id="menu-content-announcements" class="menu-content-area">
                <div class="content-header">
                    <button class="back-btn" onclick="window.UserFeatures.showMain()">← Back</button>
                    <h4>Latest News</h4>
                </div>
                <div id="announcements-container" style="overflow-y: auto; padding-bottom: 20px;">
                    <!-- Content loaded dynamically -->
                </div>
            </div>

            <div id="menu-content-support" class="menu-content-area">
                <div class="content-header">
                    <button class="back-btn" onclick="window.UserFeatures.showMain()">← Back</button>
                    <h4>Contact Support</h4>
                </div>
                <div class="support-container">
                    <div class="input-group">
                        <input type="text" class="modern-input" id="menu-support-subject" placeholder="Subject">
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; margin-bottom: 20px;">
                        <textarea class="support-textarea" id="menu-support-message" placeholder="How can we help you? Describe your issue or question..."></textarea>
                    </div>
                    <button class="modern-btn primary large-btn" id="menu-support-send">
                        <span>Send Message</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                    <div id="menu-support-status" style="margin-top: 15px; text-align: center; font-size: 0.9rem; display: none; padding: 10px; border-radius: 8px;"></div>
                </div>
            </div>

            <div id="menu-content-signin" class="menu-content-area">
                <div class="content-header">
                    <button class="back-btn" onclick="window.UserFeatures.showMain()">← Back</button>
                    <h4>Sign In</h4>
                </div>
                <div style="padding: 0 4px;">
                    <input type="email" class="menu-input" id="menu-signin-email" placeholder="Email address" style="margin-bottom: 12px;">
                    <input type="password" class="menu-input" id="menu-signin-password" placeholder="Password" style="margin-bottom: 16px;">
                    <button class="menu-btn" id="menu-signin-btn">Sign In</button>
                    <div id="menu-signin-error" style="color: #ef4444; font-size: 0.9rem; margin-top: 10px; display: none;"></div>
                </div>
            </div>

            <div id="menu-content-signup" class="menu-content-area">
                <div class="content-header">
                    <button class="back-btn" onclick="window.UserFeatures.showMain()">← Back</button>
                    <h4>Create Account</h4>
                </div>
                <div style="padding: 0 4px;">
                    <input type="email" class="menu-input" id="menu-signup-email" placeholder="Email address" style="margin-bottom: 12px;">
                    <input type="password" class="menu-input" id="menu-signup-password" placeholder="Password (6+ chars)" style="margin-bottom: 16px;">
                    <button class="menu-btn" id="menu-signup-btn">Sign Up</button>
                    <div id="menu-signup-error" style="color: #ef4444; font-size: 0.9rem; margin-top: 10px; display: none;"></div>
                </div>
            </div>
        `;

        document.body.appendChild(menuElement);

        setupUnifiedAuthLogic();
        setupProfileLogic();
        setupCalendarLogic();
        setupSignInLogic();
        setupSignUpLogic();
        setupSupportLogic();
        updateMenuState();
    }

    function setupUnifiedAuthLogic() {
        const emailInput = document.getElementById('unified-auth-email');
        const passwordInput = document.getElementById('unified-auth-password');
        const authBtn = document.getElementById('unified-auth-btn');
        const errorDiv = document.getElementById('unified-auth-error');
        const toggleLink = document.getElementById('auth-toggle-link');
        const togglePrompt = document.getElementById('auth-toggle-prompt');
        const authTitle = document.getElementById('auth-view-title');
        const authSubtitle = document.getElementById('auth-view-subtitle');
        const togglePasswordBtn = document.getElementById('toggle-password-visibility');
        const rememberMeCheckbox = document.getElementById('remember-me');

        let isSignUpMode = true;

        // Load saved credentials if they exist
        const savedEmail = localStorage.getItem('remembered_email');
        const savedPassword = localStorage.getItem('remembered_password');
        const rememberMe = localStorage.getItem('remember_me') === 'true';

        if (savedEmail && savedPassword && rememberMe) {
            emailInput.value = savedEmail;
            passwordInput.value = savedPassword;
            rememberMeCheckbox.checked = true;
            // Auto-login if not signed up mode
            if (!isSignUpMode) {
                // We'll trigger auto-login after a short delay
                setTimeout(() => {
                    authBtn.click();
                }, 500);
            }
        }

        // Password visibility toggle
        if (togglePasswordBtn && passwordInput) {
            togglePasswordBtn.onclick = () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                togglePasswordBtn.style.color = type === 'text' ? '#0f172a' : '';
            };
        }

        // Toggle between sign up and sign in
        if (toggleLink) {
            toggleLink.onclick = (e) => {
                e.preventDefault();
                isSignUpMode = !isSignUpMode;

                // Animate content change
                const formContainer = document.querySelector('.auth-form-container');
                formContainer.style.opacity = '0';
                formContainer.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    if (isSignUpMode) {
                        authTitle.textContent = '🚀 Your Journey to Success';
                        authSubtitle.textContent = 'Unlock your potential and achieve greatness';
                        authBtn.textContent = 'Start Your Journey';
                        togglePrompt.textContent = 'Already have an account?';
                        toggleLink.textContent = 'Sign In';
                    } else {
                        authTitle.textContent = '✨ Welcome Back';
                        authSubtitle.textContent = 'Continue your path to excellence';
                        authBtn.textContent = 'Continue';
                        togglePrompt.textContent = 'New here?';
                        toggleLink.textContent = 'Start Your Journey';
                    }

                    // Clear fields and error
                    emailInput.value = '';
                    passwordInput.value = '';
                    errorDiv.style.display = 'none';

                    formContainer.style.opacity = '1';
                    formContainer.style.transform = 'translateY(0)';
                }, 200);
            };
        }

        // Handle auth button click
        if (authBtn) {
            authBtn.onclick = async () => {
                const email = emailInput.value.trim();
                const password = passwordInput.value;

                if (!email || !password) {
                    errorDiv.textContent = 'Please fill in all fields';
                    errorDiv.style.display = 'block';
                    return;
                }

                errorDiv.style.display = 'none';
                authBtn.disabled = true;
                const originalText = authBtn.textContent;
                authBtn.textContent = 'Please wait...';

                try {
                    if (!window.InstantDBAuth) {
                        throw new Error('Auth system not ready');
                    }

                    let result;
                    if (isSignUpMode) {
                        result = await window.InstantDBAuth.signUpWithEmail(email, password);
                    } else {
                        result = await window.InstantDBAuth.signInWithEmail(email, password);
                    }

                    if (result.error) {
                        throw new Error(result.error);
                    }

                    // Success
                    const user = result.user;

                    // Check if user is admin and save to state
                    state.isAdmin = user.email === 'optofutureprep@gmail.com';
                    if (state.isAdmin) {
                        localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
                        console.log('🔑 Admin user logged in:', user.email);
                    }

                    // Save credentials if remember me is checked
                    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                        localStorage.setItem('remembered_email', email);
                        localStorage.setItem('remembered_password', password);
                        localStorage.setItem('remember_me', 'true');
                    } else {
                        // Clear saved credentials if remember me is unchecked
                        localStorage.removeItem('remembered_email');
                        localStorage.removeItem('remembered_password');
                        localStorage.removeItem('remember_me');
                    }

                    // Update local storage
                    localStorage.setItem('app_user', JSON.stringify(user));
                    localStorage.setItem('app_auth_mode', 'authenticated');
                    localStorage.setItem('user_is_logged_in', 'true');

                    // Update global state
                    if (window.APP_AUTH_STATE) {
                        window.APP_AUTH_STATE.isAuthenticated = true;
                        window.APP_AUTH_STATE.user = user;
                    }

                    // Trigger events
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isAuthenticated: true, user } }));

                    // Show success state briefly
                    authBtn.textContent = 'Success!';
                    authBtn.style.background = '#10b981';

                    // Show Welcome Banner
                    showWelcomeBanner(state.name || user.email);

                    setTimeout(() => {
                        closeMenu();
                        // Reset button for next time
                        setTimeout(() => {
                            authBtn.disabled = false;
                            authBtn.style.background = '';
                            authBtn.textContent = originalText;
                        }, 500);
                    }, 1000);

                } catch (err) {
                    errorDiv.textContent = err.message;
                    errorDiv.style.display = 'block';
                    authBtn.disabled = false;
                    authBtn.textContent = originalText;
                }
            };
        }
    }

    function toggleMenu() {
        if (menuElement.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        menuElement.classList.add('active');
        menuOverlay.classList.add('active');
    }

    function closeMenu() {
        menuElement.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.querySelectorAll('.menu-content-area').forEach(el => el.classList.remove('active'));
    }

    function showWelcomeBanner(identifier) {
        // Check if user has disabled the welcome banner
        const disableWelcomeBanner = localStorage.getItem('disable_welcome_banner') === 'true';
        if (disableWelcomeBanner) {
            console.log('Welcome banner disabled by user preference');
            return;
        }

        // Remove existing banner if any
        const existing = document.getElementById('welcome-banner');
        if (existing) existing.remove();

        const banner = document.createElement('div');
        banner.id = 'welcome-banner';

        // Determine greeting name - priority order:
        // 1. Display name from profile (if set)
        // 2. Passed identifier (could be email or name)
        // 3. Extract name from email if identifier is an email
        let displayName = localStorage.getItem('user_profile_name') || identifier;

        // If displayName looks like an email, extract the part before @
        if (displayName && displayName.includes('@')) {
            displayName = displayName.split('@')[0];
        }

        banner.innerHTML = `
            <div class="emoji-background" id="emoji-bg"></div>
            <div class="welcome-content">
                <h1 class="welcome-title">Welcome, <br><span class="highlight-name">${displayName}</span>! 🎉</h1>
                <p class="welcome-subtitle">We're excited to have you on board.</p>
            </div>
        `;
        document.body.appendChild(banner);

        // Generate emojis
        const emojiBg = banner.querySelector('#emoji-bg');
        const emojis = ['🚀', '⭐', '✨', '🎉', '🔥', '💫', '🌟', '💪', '🎓', '📚'];

        for (let i = 0; i < 300; i++) {
            const span = document.createElement('span');
            span.className = 'floating-emoji';
            span.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const left = Math.random() * 100;
            const duration = 3 + Math.random() * 5; // 3-8s duration
            const delay = (Math.random() * duration) * -1; // Negative delay to pre-warm animation
            const size = 1 + Math.random() * 2;

            span.style.left = `${left}%`;
            span.style.bottom = '-50px'; // Start slightly below screen
            span.style.animationDelay = `${delay}s`;
            span.style.animationDuration = `${duration}s`;
            span.style.fontSize = `${size}rem`;

            emojiBg.appendChild(span);
        }

        // Activate
        requestAnimationFrame(() => {
            banner.classList.add('active');
        });

        // Auto dismiss
        setTimeout(() => {
            banner.classList.remove('active');
            setTimeout(() => banner.remove(), 500);
        }, 4000);

        // Click to dismiss
        banner.onclick = () => {
            banner.classList.remove('active');
            setTimeout(() => banner.remove(), 500);
        };
    }

    // Expose functions
    window.UserFeatures = {
        showMain: function () {
            document.querySelectorAll('.menu-content-area').forEach(el => el.classList.remove('active'));
        },

        showSection: function (sectionId) {
            document.querySelectorAll('.menu-content-area').forEach(el => el.classList.remove('active'));
            const target = document.getElementById(`menu-content-${sectionId}`);
            if (target) {
                target.classList.add('active');
                if (sectionId === 'announcements') {
                    loadAnnouncements();
                }
            }
        },

        triggerLogin: function () {
            window.UserFeatures.showSection('signin');
        },

        triggerSignUp: function () {
            window.UserFeatures.showSection('signup');
        },

        continueAsGuest: function () {
            closeMenu();
        },

        triggerSupport: function () {
            window.UserFeatures.showSection('support');
        },

        signOut: function () {
            if (confirm('Are you sure you want to sign out?')) {
                localStorage.removeItem('app_auth_mode');
                localStorage.removeItem('app_user');
                localStorage.removeItem('user_is_logged_in');
                sessionStorage.clear();
                location.reload();
            }
        },

    };

    function setupProfileLogic() {
        const nameInput = document.getElementById('menu-name-input');
        const welcomeBannerToggle = document.getElementById('welcome-banner-toggle');
        const saveBtn = document.getElementById('menu-save-profile');
        const emailDisplay = document.getElementById('profile-email-display');

        if (nameInput && welcomeBannerToggle && saveBtn) {
            if (state.name) {
                nameInput.value = state.name;
                if (emailDisplay) emailDisplay.textContent = state.name;
            }

            // Load welcome banner preference
            const disableWelcomeBanner = localStorage.getItem('disable_welcome_banner') === 'true';
            welcomeBannerToggle.checked = disableWelcomeBanner;

            saveBtn.onclick = async () => {
                const name = nameInput.value.trim();
                const disableWelcomeBanner = welcomeBannerToggle.checked;

                if (name) {
                    // Update state locally
                    state.name = name;
                    localStorage.setItem(STORAGE_KEYS.NAME, name);
                    localStorage.setItem('disable_welcome_banner', disableWelcomeBanner);

                    // Sync to InstantDB if authenticated
                    if (state.isAuthenticated && window.InstantDBAuth) {
                        try {
                            saveBtn.disabled = true;
                            saveBtn.textContent = 'Saving...';

                            // Get current email from state or localStorage
                            const user = JSON.parse(localStorage.getItem('app_user') || '{}');
                            if (user.email) {
                                await window.InstantDBAuth.updateUserProfile(user.email, {
                                    displayName: name
                                });
                            }

                            alert('Profile updated!');
                        } catch (err) {
                            console.error('Failed to sync profile:', err);
                            alert('Profile updated locally (sync failed)');
                        } finally {
                            saveBtn.disabled = false;
                            saveBtn.textContent = 'Save Changes';
                        }
                    } else {
                        alert('Profile updated locally!');
                    }

                    window.UserFeatures.showMain();
                    updateMenuState();
                }
            };
        }
    }

    function setupCalendarLogic() {
        const dateInput = document.getElementById('menu-date-input');
        const saveBtn = document.getElementById('menu-save-date');
        const display = document.getElementById('menu-countdown-display');

        if (dateInput && saveBtn && display) {
            if (state.examDate) {
                dateInput.value = state.examDate;
                updateCountdownDisplay();
            }

            saveBtn.onclick = async () => {
                const date = dateInput.value;
                if (date) {
                    state.examDate = date;
                    localStorage.setItem(STORAGE_KEYS.EXAM_DATE, date);
                    updateCountdownDisplay();

                    // Sync to InstantDB
                    if (state.isAuthenticated && window.InstantDBAuth) {
                        try {
                            saveBtn.disabled = true;
                            saveBtn.textContent = 'Saving...';
                            const user = JSON.parse(localStorage.getItem('app_user') || '{}');
                            if (user.email) {
                                await window.InstantDBAuth.updateUserExamDate(user.email, date);
                            }
                            alert('Countdown started and saved to account!');
                        } catch (err) {
                            console.error('Failed to sync exam date:', err);
                            alert('Countdown started (local only)!');
                        } finally {
                            saveBtn.disabled = false;
                            saveBtn.textContent = 'Start Countdown';
                        }
                    } else {
                        alert('Countdown started!');
                    }
                }
            };

            function updateCountdownDisplay() {
                if (!state.examDate) return;
                const target = new Date(state.examDate).getTime();
                const now = new Date().getTime();
                const diff = target - now;

                if (diff < 0) {
                    display.textContent = "Exam passed!";
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                display.textContent = `${days} Days Left`;
            }
        }
    }

    function setupSignInLogic() {
        const emailInput = document.getElementById('menu-signin-email');
        const passInput = document.getElementById('menu-signin-password');
        const btn = document.getElementById('menu-signin-btn');
        const errorDiv = document.getElementById('menu-signin-error');

        if (btn) {
            btn.onclick = async () => {
                const email = emailInput.value.trim();
                const password = passInput.value;

                errorDiv.style.display = 'none';
                btn.disabled = true;
                btn.textContent = 'Signing In...';

                try {
                    if (!window.InstantDBAuth) {
                        throw new Error('Auth system not ready');
                    }

                    const result = await window.InstantDBAuth.signInWithEmail(email, password);

                    if (result.error) {
                        throw new Error(result.error);
                    }

                    // Success
                    const user = result.user;

                    // Check if user is admin and save to state
                    state.isAdmin = user.email === 'optofutureprep@gmail.com';
                    if (state.isAdmin) {
                        localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
                        console.log('🔑 Admin user logged in:', user.email);
                    }

                    // Update local storage
                    localStorage.setItem('app_user', JSON.stringify(user));
                    localStorage.setItem('app_auth_mode', 'authenticated');
                    localStorage.setItem('user_is_logged_in', 'true');

                    // Update global state
                    if (window.APP_AUTH_STATE) {
                        window.APP_AUTH_STATE.isAuthenticated = true;
                        window.APP_AUTH_STATE.user = user;
                    }

                    // Trigger events
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isAuthenticated: true, user } }));

                    alert('Welcome back!');
                    closeMenu();

                } catch (err) {
                    errorDiv.textContent = err.message;
                    errorDiv.style.display = 'block';
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'Sign In';
                }
            };
        }
    }

    function setupSignUpLogic() {
        const emailInput = document.getElementById('menu-signup-email');
        const passInput = document.getElementById('menu-signup-password');
        const btn = document.getElementById('menu-signup-btn');
        const errorDiv = document.getElementById('menu-signup-error');

        if (btn) {
            btn.onclick = async () => {
                const email = emailInput.value.trim();
                const password = passInput.value;

                errorDiv.style.display = 'none';
                btn.disabled = true;
                btn.textContent = 'Creating Account...';

                try {
                    if (!window.InstantDBAuth) {
                        throw new Error('Auth system not ready');
                    }

                    const result = await window.InstantDBAuth.signUpWithEmail(email, password);

                    if (result.error) {
                        throw new Error(result.error);
                    }

                    // Success
                    const user = result.user;

                    // Check if user is admin and save to state
                    state.isAdmin = user.email === 'optofutureprep@gmail.com';
                    if (state.isAdmin) {
                        localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
                        console.log('🔑 Admin user logged in:', user.email);
                    }

                    // Update local storage
                    localStorage.setItem('app_user', JSON.stringify(user));
                    localStorage.setItem('app_auth_mode', 'authenticated');
                    localStorage.setItem('user_is_logged_in', 'true');

                    // Update global state
                    if (window.APP_AUTH_STATE) {
                        window.APP_AUTH_STATE.isAuthenticated = true;
                        window.APP_AUTH_STATE.user = user;
                    }

                    // Trigger events
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isAuthenticated: true, user } }));

                    alert('Account created successfully!');
                    closeMenu();

                } catch (err) {
                    errorDiv.textContent = err.message;
                    errorDiv.style.display = 'block';
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'Sign Up';
                }
            };
        }
    }

    function setupSupportLogic() {
        const subjectInput = document.getElementById('menu-support-subject');
        const messageInput = document.getElementById('menu-support-message');
        const sendBtn = document.getElementById('menu-support-send');
        const statusDiv = document.getElementById('menu-support-status');

        if (sendBtn) {
            sendBtn.onclick = async () => {
                const subject = subjectInput.value.trim();
                const message = messageInput.value.trim();

                if (!subject || !message) {
                    statusDiv.textContent = 'Please fill in all fields.';
                    statusDiv.style.color = '#ef4444';
                    statusDiv.style.display = 'block';
                    return;
                }

                if (!state.isAuthenticated) {
                    statusDiv.textContent = 'Please sign in to send a message.';
                    statusDiv.style.color = '#ef4444';
                    statusDiv.style.display = 'block';
                    return;
                }

                sendBtn.disabled = true;
                sendBtn.textContent = 'Sending...';
                statusDiv.style.display = 'none';

                try {
                    if (window.InstantDBAuth && window.InstantDBAuth.addSupportMessage) {
                        await window.InstantDBAuth.addSupportMessage({
                            email: state.name,
                            subject: subject,
                            message: message
                        });

                        statusDiv.textContent = 'Message sent! We will reply shortly.';
                        statusDiv.style.color = '#10b981';
                        statusDiv.style.display = 'block';

                        subjectInput.value = '';
                        messageInput.value = '';

                        setTimeout(() => {
                            window.UserFeatures.showMain();
                            statusDiv.style.display = 'none';
                        }, 2000);
                    } else {
                        throw new Error('Support system not ready');
                    }
                } catch (err) {
                    console.error('Support error:', err);
                    statusDiv.textContent = 'Failed to send message. Please try again.';
                    statusDiv.style.color = '#ef4444';
                    statusDiv.style.display = 'block';
                } finally {
                    sendBtn.disabled = false;
                    sendBtn.textContent = 'Send Message';
                }
            };
        }
    }

    function loadAnnouncements() {
        const container = document.getElementById('announcements-container');

        if (!container) return;

        // Show loading state
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">Loading updates...</div>';

        if (window.InstantDBAuth && window.InstantDBAuth.getAnnouncements) {
            window.InstantDBAuth.getAnnouncements().then(announcements => {
                if (announcements.length === 0) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                            <div style="font-size: 40px; margin-bottom: 16px;">📭</div>
                            <div>No announcements yet.</div>
                        </div>
                    `;
                    return;
                }

                // Sort by date desc
                announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                let html = '';
                announcements.forEach(a => {
                    const date = new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    html += `
                        <div class="news-card">
                            <div class="news-header">
                                <div class="news-title">${a.title}</div>
                                <div class="news-date">${date}</div>
                            </div>
                            <div class="news-content">${a.message}</div>
                        </div>
                    `;
                });
                container.innerHTML = html;
            }).catch(err => {
                console.error('Error loading announcements:', err);
                container.innerHTML = '<div style="text-align: center; padding: 20px; color: #ef4444;">Failed to load announcements.</div>';
            });
        } else {
            // Fallback if auth not ready
            container.innerHTML = `
                <div class="news-card">
                    <div class="news-header">
                        <div class="news-title">Welcome!</div>
                        <div class="news-date">Today</div>
                    </div>
                    <div class="news-content">
                        Welcome to the new OptofuturePrep dashboard. Check back here for the latest updates and news.
                    </div>
                </div>
            `;
        }
    }

    function createStyles() {
        // Styles handled by CSS file
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
