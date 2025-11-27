// Exam Modals React Component
// This component manages the Exit Test and End Test confirmation modals
// It integrates with the vanilla JS exam system via global state

// Prevent multiple declarations - wrap in IIFE to create isolated scope
(function() {
    'use strict';
    
    // Check if already loaded
    if (typeof window.ExamModalsManagerLoaded !== 'undefined') {
        return; // Already loaded, exit early
    }
    window.ExamModalsManagerLoaded = true;

// Exit Test Modal Component
const ExitTestModal = ({ onReturn, onExit }) => {
    React.useEffect(() => {
        // Prevent ESC key from closing
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        document.addEventListener('keydown', handleEsc, true);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleEsc, true);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]"
            onClick={(e) => e.stopPropagation()}
        >
            <div 
                className="bg-[#0a6ea0] text-white rounded-lg shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/20">
                    <h3 className="text-lg font-semibold">Would you like to exit the test?</h3>
                    <button 
                        onClick={onReturn}
                        className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-300/20 flex items-center justify-center flex-shrink-0">
                        <svg 
                            className="w-6 h-6 text-blue-300" 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                        </svg>
                    </div>
                    <p className="text-white leading-relaxed">
                        Your test is in progress. If you exit now, your test results will NOT be saved.
                    </p>
                </div>
                
                {/* Modal Footer */}
                <div className="flex justify-end gap-4 p-4 bg-black/20 rounded-b-lg">
                    <button 
                        onClick={onReturn}
                        className="px-6 py-2 text-white border border-white rounded hover:bg-white/10 transition-colors font-semibold"
                    >
                        Return to the Test
                    </button>
                    <button 
                        onClick={onExit}
                        className="px-6 py-2 text-white border border-white rounded hover:bg-white/10 transition-colors font-semibold"
                    >
                        Exit Test
                    </button>
                </div>
            </div>
        </div>
    );
};

// End Test Modal Component
const EndTestModal = ({ onReturn, onEnd }) => {
    React.useEffect(() => {
        // Prevent ESC key from closing
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        document.addEventListener('keydown', handleEsc, true);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleEsc, true);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]"
            onClick={(e) => e.stopPropagation()}
        >
            <div 
                className="bg-[#0a6ea0] text-white rounded-lg shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/20">
                    <h3 className="text-lg font-semibold">End test and show results?</h3>
                    <button 
                        onClick={onReturn}
                        className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-300/20 flex items-center justify-center flex-shrink-0">
                        <svg 
                            className="w-6 h-6 text-blue-300" 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                        </svg>
                    </div>
                    <p className="text-white leading-relaxed">
                        You'll be able to review your test results on the next page.
                    </p>
                </div>
                
                {/* Modal Footer */}
                <div className="flex justify-end gap-4 p-4 bg-black/20 rounded-b-lg">
                    <button 
                        onClick={onReturn}
                        className="px-6 py-2 text-white border border-white rounded hover:bg-white/10 transition-colors font-semibold"
                    >
                        Return to Test
                    </button>
                    <button 
                        onClick={onEnd}
                        className="px-6 py-2 text-white border border-white rounded hover:bg-white/10 transition-colors font-semibold"
                    >
                        End Test
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Exam Modals Manager Component
const ExamModalsManager = () => {
    const [showExitModal, setShowExitModal] = React.useState(false);
    const [showEndModal, setShowEndModal] = React.useState(false);

    // Handle exit test - clears state WITHOUT saving and returns to dashboard
    const handleExitTest = () => {
        console.log('🚪 Exit Test confirmed - clearing state WITHOUT saving and returning to dashboard');
        
        // Close modal first
        setShowExitModal(false);
        
        // Get subject and testIndex before clearing
        const subject = window.currentSubject;
        const testIndex = window.currentTestIndex;
        
        // Disable exit warning first
        if (typeof window.disableTestExitWarning === 'function') {
            window.disableTestExitWarning();
        }
        
        // Stop timer if running
        if (window.testTimer) {
            clearInterval(window.testTimer);
            window.testTimer = null;
        }
        
        // Clear saved attempt in localStorage for this exam (DO NOT SAVE)
        if (subject && testIndex !== null && testIndex !== undefined) {
            // Clear exam state
            if (typeof window.clearFullExamState === 'function') {
                window.clearFullExamState(subject, testIndex);
            }
            
            // Clear test state
            if (typeof window.clearTestState === 'function') {
                window.clearTestState(subject, testIndex);
            }
        }
        
        // Reset exam state variables (DO NOT SAVE)
        window.currentSubject = null;
        window.currentTestIndex = null;
        window.userAnswers = {};
        window.markedQuestions = {};
        window.timeRemaining = null;
        window.testStartTime = null;
        window.currentViewMode = null;
        
        // Exit fullscreen if active
        if (typeof window.exitFullscreen === 'function') {
            try {
                window.exitFullscreen();
            } catch (e) {
                console.warn('Error exiting fullscreen:', e);
            }
        }
        
        // Return to dashboard/home view
        if (typeof window.showView === 'function') {
            window.showView('dashboard-view', null, document.getElementById('nav-home'));
        }
    };

    // Handle end test - finalizes attempt and shows results
    const handleEndTest = () => {
        console.log('✅ End Test confirmed - finalizing attempt');
        
        // Close modal
        setShowEndModal(false);
        
        // Call the existing endTest function which handles saving and navigation
        if (typeof window.endTest === 'function') {
            window.endTest();
        } else {
            console.error('❌ endTest function not found');
        }
    };

    // Expose functions to global scope for vanilla JS to call
    React.useEffect(() => {
        window.showExitTestModalReact = () => {
            console.log('🔴 showExitTestModalReact called');
            setShowExitModal(true);
        };
        
        window.showEndTestModalReact = () => {
            console.log('📝 showEndTestModalReact called');
            setShowEndModal(true);
        };
        
        window.hideExitTestModalReact = () => {
            setShowExitModal(false);
        };
        
        window.hideEndTestModalReact = () => {
            setShowEndModal(false);
        };
        
        return () => {
            delete window.showExitTestModalReact;
            delete window.showEndTestModalReact;
            delete window.hideExitTestModalReact;
            delete window.hideEndTestModalReact;
        };
    }, []);

    return (
        <>
            {showExitModal && (
                <ExitTestModal
                    onReturn={() => setShowExitModal(false)}
                    onExit={handleExitTest}
                />
            )}
            
            {showEndModal && (
                <EndTestModal
                    onReturn={() => setShowEndModal(false)}
                    onEnd={handleEndTest}
                />
            )}
        </>
    );
};

// Export for use
window.ExamModalsManager = ExamModalsManager;

})(); // End of IIFE - creates isolated scope

