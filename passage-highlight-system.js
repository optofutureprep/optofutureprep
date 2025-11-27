/**
 * Passage-Specific Highlight Architecture for Reading Comprehension
 * 
 * This system is uniquely designed to treat entire passages as complete units rather than 
 * individual text selections. Unlike basic text highlighting, this system captures and preserves 
 * the entire HTML structure of passages with all highlights embedded within them.
 * 
 * Key Features:
 * - HTML State Preservation: Stores complete rendered HTML of passages with highlights
 * - Cross-Question Passage Sharing: Same passage shared across multiple questions maintains highlights
 * - Paragraph-Level Storage: Highlights stored as arrays of paragraph HTML
 * - Navigation-Aware: Highlights "follow" you through related questions
 * - Dual Storage: Maintains both raw and highlighted versions
 * - Memory-Efficient: Each passage highlighted state stored once, regardless of question count
 * - Real-Time Synchronization: Updates propagate instantly across all referencing questions
 */

(function () {
    'use strict';

    // ==========================================
    // PASSAGE HIGHLIGHT STATE MANAGEMENT
    // ==========================================

    // Storage for passage highlights
    // Key: passageId (e.g., 'pt1,passage1')
    // Value: { raw: originalHTML, highlighted: highlightedHTML, passages: [paragraphHTMLs] }
    const passageHighlightStore = {};

    // Track which questions use which passages
    // Key: questionKey (e.g., 'Reading Comprehension-0-5')
    // Value: passageId (e.g., 'pt1,passage1')
    const questionPassageMap = {};

    // Current active passage being displayed
    let currentPassageId = null;

    // Storage key prefix for localStorage
    const STORAGE_PREFIX = 'rc_passage_highlights_';

    // ==========================================
    // CORE PASSAGE HIGHLIGHT FUNCTIONS
    // ==========================================

    /**
     * Initialize passage highlighting for a specific passage
     * @param {string} passageId - Unique identifier for the passage
     * @param {string} passageHTML - Raw HTML content of the passage
     * @param {string} questionKey - Question identifier (subject-testIndex-questionIndex)
     */
    function initializePassageHighlight(passageId, passageHTML, questionKey) {
        if (!passageId || !passageHTML) {
            console.warn('[Passage Highlights] Missing passageId or HTML');
            return;
        }

        // Map this question to this passage
        questionPassageMap[questionKey] = passageId;

        // If passage not yet in store, initialize it
        if (!passageHighlightStore[passageId]) {
            // Create a temporary div to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = passageHTML;

            // Extract all paragraphs
            const paragraphs = Array.from(tempDiv.querySelectorAll('p'));
            const paragraphHTMLs = paragraphs.map(p => p.outerHTML);

            passageHighlightStore[passageId] = {
                raw: passageHTML,
                highlighted: passageHTML, // Initially same as raw
                paragraphs: paragraphHTMLs,
                lastModified: Date.now()
            };

            console.log(`[Passage Highlights] Initialized passage: ${passageId}`);
        }

        currentPassageId = passageId;

        // Try to load from localStorage
        loadPassageHighlightsFromStorage(passageId);
    }

    /**
     * Get the current highlighted HTML for a passage
     * @param {string} passageId - Unique identifier for the passage
     * @returns {string} - Highlighted HTML or empty string
     */
    function getPassageHighlightedHTML(passageId) {
        const passage = passageHighlightStore[passageId];
        return passage ? passage.highlighted : '';
    }

    /**
     * Get the raw (original) HTML for a passage
     * @param {string} passageId - Unique identifier for the passage
     * @returns {string} - Raw HTML or empty string
     */
    function getPassageRawHTML(passageId) {
        const passage = passageHighlightStore[passageId];
        return passage ? passage.raw : '';
    }

    /**
     * Apply highlights to a passage element in the DOM
     * @param {HTMLElement} passageElement - The passage container element
     * @param {string} passageId - Unique identifier for the passage
     */
    function applyPassageHighlights(passageElement, passageId) {
        if (!passageElement || !passageId) {
            console.warn('[Passage Highlights] Missing element or passageId');
            return;
        }

        const highlightedHTML = getPassageHighlightedHTML(passageId);
        if (highlightedHTML) {
            passageElement.innerHTML = highlightedHTML;
            console.log(`[Passage Highlights] Applied highlights to passage: ${passageId}`);

            // Reattach event listeners to highlight elements
            reattachHighlightListeners(passageElement);
        }
    }

    /**
     * Create a new highlight in the passage
     * @param {string} passageId - Unique identifier for the passage
     * @param {Range} range - The selected text range
     * @param {HTMLElement} passageElement - The passage container element
     */
    function createPassageHighlight(passageId, range, passageElement) {
        if (!passageId || !range || !passageElement) {
            console.warn('[Passage Highlights] Missing parameters for highlight creation');
            return;
        }

        try {
            // Create a mark element
            const mark = document.createElement('mark');
            mark.className = 'passage-highlight';
            mark.style.cssText = `
                background-color: #ffff66;
                color: inherit;
                padding: 0 2px;
                display: inline;
                cursor: pointer;
            `;
            mark.setAttribute('data-passage-highlight', 'true');

            // Extract and wrap selected content
            const contents = range.extractContents();
            mark.appendChild(contents);
            range.insertNode(mark);

            // Normalize to merge adjacent text nodes
            if (mark.parentNode) {
                mark.parentNode.normalize();
            }

            // Add double-click to remove
            mark.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removePassageHighlight(mark, passageId, passageElement);
            });

            // Add right-click for strikethrough
            mark.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Toggle strikethrough
                if (mark.style.textDecoration.includes('line-through')) {
                    mark.style.textDecoration = 'none';
                } else {
                    mark.style.textDecoration = 'line-through';
                }

                // Save updated state
                savePassageHighlightState(passageId, passageElement);
            });

            // Save the updated passage state
            savePassageHighlightState(passageId, passageElement);

            console.log(`[Passage Highlights] Created highlight in passage: ${passageId}`);

        } catch (err) {
            console.error('[Passage Highlights] Error creating highlight:', err);
        }
    }

    /**
     * Remove a highlight from the passage
     * @param {HTMLElement} markElement - The highlight element to remove
     * @param {string} passageId - Unique identifier for the passage
     * @param {HTMLElement} passageElement - The passage container element
     */
    function removePassageHighlight(markElement, passageId, passageElement) {
        if (!markElement || !markElement.parentNode) return;

        try {
            const parent = markElement.parentNode;
            const fragment = document.createDocumentFragment();

            // Move all child nodes from the mark to the fragment
            while (markElement.firstChild) {
                fragment.appendChild(markElement.firstChild);
            }

            // Replace the mark element with its text content
            parent.replaceChild(fragment, markElement);
            parent.normalize();

            // Save the updated passage state
            savePassageHighlightState(passageId, passageElement);

            console.log(`[Passage Highlights] Removed highlight from passage: ${passageId}`);

        } catch (err) {
            console.error('[Passage Highlights] Error removing highlight:', err);
        }
    }

    /**
     * Save the current state of a passage with all its highlights
     * @param {string} passageId - Unique identifier for the passage
     * @param {HTMLElement} passageElement - The passage container element
     */
    function savePassageHighlightState(passageId, passageElement) {
        if (!passageId || !passageElement) {
            console.warn('[Passage Highlights] Missing parameters for state save');
            return;
        }

        const passage = passageHighlightStore[passageId];
        if (!passage) {
            console.warn(`[Passage Highlights] Passage not found: ${passageId}`);
            return;
        }

        // Capture the current HTML with all highlights
        const highlightedHTML = passageElement.innerHTML;

        // Extract paragraphs
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedHTML;
        const paragraphs = Array.from(tempDiv.querySelectorAll('p'));
        const paragraphHTMLs = paragraphs.map(p => p.outerHTML);

        // Update store
        passage.highlighted = highlightedHTML;
        passage.paragraphs = paragraphHTMLs;
        passage.lastModified = Date.now();

        // REMOVED: savePassageHighlightsToStorage(passageId);
        // We only persist to storage when the test is submitted

        console.log(`[Passage Highlights] Updated memory state for passage: ${passageId}`);
    }

    /**
     * Clear all highlights from a passage
     * @param {string} passageId - Unique identifier for the passage
     * @param {HTMLElement} passageElement - The passage container element
     */
    function clearPassageHighlights(passageId, passageElement) {
        const passage = passageHighlightStore[passageId];
        if (!passage) {
            console.warn(`[Passage Highlights] Passage not found: ${passageId}`);
            return;
        }

        // Reset to raw HTML
        passage.highlighted = passage.raw;

        // Update DOM if element provided
        if (passageElement) {
            passageElement.innerHTML = passage.raw;
        }

        // REMOVED: savePassageHighlightsToStorage(passageId);

        console.log(`[Passage Highlights] Cleared highlights for passage: ${passageId}`);
    }

    /**
     * Reattach event listeners to all highlight elements
     * @param {HTMLElement} passageElement - The passage container element
     */
    function reattachHighlightListeners(passageElement) {
        const highlights = passageElement.querySelectorAll('mark.passage-highlight');
        const passageId = currentPassageId;

        highlights.forEach(mark => {
            // Remove existing listeners (if any) by cloning
            const newMark = mark.cloneNode(true);
            mark.parentNode.replaceChild(newMark, mark);

            // Add double-click to remove
            newMark.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removePassageHighlight(newMark, passageId, passageElement);
            });

            // Add right-click for strikethrough
            newMark.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Toggle strikethrough
                if (newMark.style.textDecoration.includes('line-through')) {
                    newMark.style.textDecoration = 'none';
                } else {
                    newMark.style.textDecoration = 'line-through';
                }

                // Save updated state
                savePassageHighlightState(passageId, passageElement);
            });
        });
    }

    // ==========================================
    // STORAGE PERSISTENCE
    // ==========================================

    /**
     * Save passage highlights to localStorage
     * @param {string} passageId - Unique identifier for the passage
     */
    function savePassageHighlightsToStorage(passageId) {
        const passage = passageHighlightStore[passageId];
        if (!passage) return;

        try {
            const storageKey = STORAGE_PREFIX + passageId;
            const data = {
                highlighted: passage.highlighted,
                paragraphs: passage.paragraphs,
                lastModified: passage.lastModified
            };

            localStorage.setItem(storageKey, JSON.stringify(data));
            console.log(`[Passage Highlights] Saved to storage: ${passageId}`);

        } catch (err) {
            console.error('[Passage Highlights] Error saving to storage:', err);
        }
    }

    /**
     * Load passage highlights from localStorage
     * @param {string} passageId - Unique identifier for the passage
     */
    function loadPassageHighlightsFromStorage(passageId) {
        try {
            const storageKey = STORAGE_PREFIX + passageId;
            const saved = localStorage.getItem(storageKey);

            if (saved) {
                const data = JSON.parse(saved);
                const passage = passageHighlightStore[passageId];

                if (passage) {
                    passage.highlighted = data.highlighted;
                    passage.paragraphs = data.paragraphs || [];
                    passage.lastModified = data.lastModified || Date.now();

                    console.log(`[Passage Highlights] Loaded from storage: ${passageId}`);
                }
            }

        } catch (err) {
            console.error('[Passage Highlights] Error loading from storage:', err);
        }
    }

    /**
     * Clear passage highlights from localStorage
     * @param {string} passageId - Unique identifier for the passage
     */
    function clearPassageHighlightsFromStorage(passageId) {
        try {
            const storageKey = STORAGE_PREFIX + passageId;
            localStorage.removeItem(storageKey);
            console.log(`[Passage Highlights] Cleared storage: ${passageId}`);

        } catch (err) {
            console.error('[Passage Highlights] Error clearing storage:', err);
        }
    }

    /**
     * Persist all current passage highlights to localStorage
     * Should be called ONLY when the test is submitted
     */
    function persistAllHighlightsToStorage() {
        Object.keys(passageHighlightStore).forEach(passageId => {
            savePassageHighlightsToStorage(passageId);
        });
        console.log('[Passage Highlights] Persisted all highlights to storage');
    }

    // ==========================================
    // SELECTION HANDLING (READING COMPREHENSION ONLY)
    // ==========================================

    let selectionHandler = null;
    let selectionRange = null;

    /**
     * Setup passage selection listeners
     * ONLY for Reading Comprehension passages
     */
    function setupPassageSelectionListeners() {
        // Remove existing listeners
        if (selectionHandler) {
            document.removeEventListener('mouseup', selectionHandler);
        }

        // Create new selection handler
        selectionHandler = function (e) {
            // Only handle if we're in Reading Comprehension
            if (!window.currentSubject || window.currentSubject !== 'Reading Comprehension') {
                return;
            }

            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) {
                return;
            }

            const range = selection.getRangeAt(0);
            const passageElement = document.querySelector('[data-passage-container="true"]');

            // Check if selection is within passage
            if (!passageElement || !passageElement.contains(range.commonAncestorContainer)) {
                return;
            }

            // Store range for highlighting
            selectionRange = range;

            // Show highlight button (reuse existing highlight button from main system)
            const rect = range.getBoundingClientRect();
            if (rect && (rect.width > 0 || rect.height > 0)) {
                showPassageHighlightButton(rect);
            }
        };

        // Attach listener
        document.addEventListener('mouseup', selectionHandler);

        console.log('[Passage Highlights] Selection listeners attached');
    }

    /**
     * Show highlight button for passage selection
     * @param {DOMRect} rect - Bounding rectangle of selection
     */
    function showPassageHighlightButton(rect) {
        // Remove existing button
        const existingBtn = document.getElementById('passage-highlight-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        // Create new button
        const button = document.createElement('button');
        button.id = 'passage-highlight-btn';
        button.style.cssText = `
            position: fixed;
            left: ${rect.right + 8}px;
            top: ${rect.top - 4}px;
            z-index: 10000;
            background: transparent;
            border: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            width: 20px;
            height: 20px;
        `;
        button.title = 'Highlight passage text';

        // Use custom image for the button
        const img = document.createElement('img');
        img.src = 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Highlight%20button%20.png';
        img.alt = 'Highlight';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.pointerEvents = 'none'; // Ensure clicks pass through to the button

        button.appendChild(img);

        button.onclick = () => {
            if (selectionRange && currentPassageId) {
                const passageElement = document.querySelector('[data-passage-container="true"]');
                if (passageElement) {
                    createPassageHighlight(currentPassageId, selectionRange, passageElement);

                    // Clear selection
                    window.getSelection().removeAllRanges();
                    selectionRange = null;

                    // Remove button
                    button.remove();
                }
            }
        };

        document.body.appendChild(button);

        // Auto-remove on click outside
        setTimeout(() => {
            const removeOnClick = (e) => {
                if (!button.contains(e.target)) {
                    button.remove();
                    document.removeEventListener('mousedown', removeOnClick);
                }
            };
            document.addEventListener('mousedown', removeOnClick);
        }, 100);
    }

    /**
     * Remove passage selection listeners
     */
    function removePassageSelectionListeners() {
        if (selectionHandler) {
            document.removeEventListener('mouseup', selectionHandler);
            selectionHandler = null;
        }

        const button = document.getElementById('passage-highlight-btn');
        if (button) {
            button.remove();
        }

        console.log('[Passage Highlights] Selection listeners removed');
    }

    /**
     * Reset the system state (clear memory)
     * Call this when starting a new test
     */
    function resetSystem() {
        for (const prop in passageHighlightStore) {
            delete passageHighlightStore[prop];
        }
        for (const prop in questionPassageMap) {
            delete questionPassageMap[prop];
        }
        currentPassageId = null;
        console.log('[Passage Highlights] System reset');
    }

    /**
     * Export all highlight data
     * @returns {object} The complete store
     */
    function exportAllHighlights() {
        return JSON.parse(JSON.stringify(passageHighlightStore));
    }

    /**
     * Import highlight data
     * @param {object} data - The store data to import
     */
    function importAllHighlights(data) {
        if (!data) return;

        // Update memory
        Object.assign(passageHighlightStore, data);

        // Update storage
        Object.keys(data).forEach(passageId => {
            savePassageHighlightsToStorage(passageId);
        });
        console.log('[Passage Highlights] Imported data');
    }

    /**
     * Clear all passage highlights from localStorage
     */
    function clearAllStorage() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        console.log('[Passage Highlights] Cleared all storage');
    }

    // ==========================================
    // PUBLIC API
    // ==========================================

    window.PassageHighlightSystem = {
        initialize: initializePassageHighlight,
        apply: applyPassageHighlights,
        getHighlighted: getPassageHighlightedHTML,
        getRaw: getPassageRawHTML,
        create: createPassageHighlight,
        remove: removePassageHighlight,
        clear: clearPassageHighlights,
        save: savePassageHighlightState,
        setupListeners: setupPassageSelectionListeners,
        removeListeners: removePassageSelectionListeners,
        reset: resetSystem,
        exportAll: exportAllHighlights,
        importAll: importAllHighlights,
        clearAllStorage: clearAllStorage,

        // Storage management
        saveToStorage: savePassageHighlightsToStorage,
        loadFromStorage: loadPassageHighlightsFromStorage,
        saveToStorage: savePassageHighlightsToStorage,
        loadFromStorage: loadPassageHighlightsFromStorage,
        clearFromStorage: clearPassageHighlightsFromStorage,
        persistAll: persistAllHighlightsToStorage,

        // Current state
        get currentPassageId() {
            return currentPassageId;
        },

        // Get passage for a question
        getPassageForQuestion(questionKey) {
            return questionPassageMap[questionKey];
        }
    };

    console.log('[Passage Highlights] System initialized');

})();
