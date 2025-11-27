const STORAGE_KEY = "oat_rc_sample_exam_user_state_v1";

// PASSAGES is now loaded from Reading Comprehension/passages.js
// Use window.PASSAGES if available, otherwise fall back to ReadingComprehensionPassages or empty object
const PASSAGES = window.PASSAGES || window.ReadingComprehensionPassages || {};

function getPassageIndexFromId(passageId) {
    if (!passageId || typeof passageId !== 'string') {
        return null;
    }
    const match = passageId.match(/passage(\d+)/i);
    if (!match) {
        return null;
    }
    const number = parseInt(match[1], 10);
    if (!Number.isFinite(number)) {
        return null;
    }
    return Math.max(number - 1, 0);
}

let pendingExitCallback = null;
let pendingExitContext = 'test';
let isReviewModeActive = false;

// Define exit functions early so they're available when HTML onclick handlers are executed
function exitFromActiveTest() {
    console.log('🔴 exitFromActiveTest called');

    // Disable exit warning since user is explicitly exiting
    disableTestExitWarning();

    // Save current state before exiting (in case user wants to resume later)
    if (currentSubject && currentTestIndex !== null && currentTestIndex !== undefined && Object.keys(userAnswers).length > 0) {
        saveState();
        console.log('💾 Test state saved before exit (can be resumed later)');
    }

    // Save the subject name before clearing it
    const subjectToReturnTo = currentSubject;

    if (typeof testTimer !== 'undefined' && testTimer) {
        clearInterval(testTimer);
        testTimer = null;
    }
    if (typeof exitFullscreen === 'function') {
        exitFullscreen();
    }

    // Navigate back to subject page if we have a subject, otherwise go to dashboard
    if (subjectToReturnTo && typeof showSubject === 'function') {
        console.log('✅ Returning to subject page:', subjectToReturnTo);
        showSubject(subjectToReturnTo, null);

        // Refresh the React component to show updated test data
        if (typeof window.initializeSubjectPagesReact === 'function') {
            window.initializeSubjectPagesReact(subjectToReturnTo);
        }
    } else if (typeof showView === 'function') {
        console.log('⚠️ No subject to return to, going to dashboard');
        showView('dashboard-view', null, document.getElementById('nav-home'));
    }
}

function exitFromReview() {
    console.log('🔴 exitFromReview called');

    // Save the subject name before clearing it
    const subjectToReturnTo = currentSubject;

    // Navigate back to subject page if we have a subject, otherwise go to dashboard
    if (subjectToReturnTo && typeof showSubject === 'function') {
        console.log('✅ Returning to subject page from review:', subjectToReturnTo);
        showSubject(subjectToReturnTo, null);

        // Refresh the React component to show updated test data
        if (typeof window.initializeSubjectPagesReact === 'function') {
            window.initializeSubjectPagesReact(subjectToReturnTo);
        }
    } else if (typeof showView === 'function') {
        console.log('⚠️ No subject to return to, going to dashboard');
        showView('dashboard-view', null, document.getElementById('nav-home'));
    }
}

function showExitTestModal() {
    console.log('🔴 showExitTestModal called, isReviewModeActive:', isReviewModeActive);
    const context = isReviewModeActive ? 'review' : 'test';

    // Get modal element
    const modal = document.getElementById('exit-test-modal');
    if (!modal) {
        console.error('❌ Exit test modal not found!');
        return;
    }

    // Use requestExitConfirmation if available (defined later in file)
    // Otherwise, set up modal directly with inline configuration
    if (typeof requestExitConfirmation === 'function') {
        requestExitConfirmation(context);
        return;
    }

    // Fallback: Set up modal directly with configuration
    console.log('⚠️ requestExitConfirmation not yet available, setting up modal directly');
    const config = context === 'review' ? {
        title: 'Exit review session?',
        message: 'You are reviewing your results. Leaving now will close the review session.',
        confirmLabel: 'Leave Review',
        cancelLabel: 'Return to Review',
        onConfirm: exitFromReview
    } : {
        title: 'Would you like to exit the test?',
        message: 'Your test is in progress. If you exit now, your test results will NOT be saved.',
        confirmLabel: 'Exit Test',
        cancelLabel: 'Return to the Test',
        onConfirm: exitFromActiveTest
    };

    // Store callback
    pendingExitContext = context;
    pendingExitCallback = config.onConfirm;

    // Update modal content
    const titleEl = modal.querySelector('[data-exit-title]');
    const messageEl = modal.querySelector('[data-exit-message]');
    const confirmBtn = modal.querySelector('[data-exit-confirm]');
    const cancelBtn = modal.querySelector('[data-exit-cancel]');

    if (titleEl) titleEl.textContent = config.title;
    if (messageEl) messageEl.textContent = config.message;
    if (confirmBtn) confirmBtn.textContent = config.confirmLabel;
    if (cancelBtn) cancelBtn.textContent = config.cancelLabel;

    console.log('✅ Showing exit modal with context:', context);
    modal.style.display = 'flex';
    modal.style.zIndex = '10000';

    // Prevent ESC key from closing (block background interaction)
    document.body.style.overflow = 'hidden';

    // Prevent ESC key from closing modal
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    modal._escHandler = escHandler;
    document.addEventListener('keydown', escHandler, true);
}

function hideExitTestModal(resetCallback = true) {
    console.log('🔴 hideExitTestModal called');
    const modal = document.getElementById('exit-test-modal');
    if (modal) {
        modal.style.display = 'none';
        console.log('✅ Exit modal hidden');
        // Remove ESC key handler
        if (modal._escHandler) {
            document.removeEventListener('keydown', modal._escHandler, true);
            delete modal._escHandler;
        }
    }
    // Restore body overflow
    document.body.style.overflow = '';
    if (resetCallback && typeof pendingExitCallback !== 'undefined') {
        pendingExitCallback = null;
    }
    if (typeof pendingExitContext !== 'undefined') {
        pendingExitContext = 'test';
    }
}

// confirmExitTest is defined later in the file (around line 4406)

// Make showExitTestModal and exit functions globally accessible immediately
// hideExitTestModal and confirmExitTest are made globally accessible later in the file
if (typeof window !== 'undefined') {
    window.showExitTestModal = showExitTestModal;
    window.exitFromActiveTest = exitFromActiveTest;
    window.exitFromReview = exitFromReview;
}

function updateDashboardOffset() {
    // Dashboard hero content is now centered relative to viewport, no offset needed
    // Keeping function for compatibility but it no longer needs to calculate offset
    document.documentElement.style.setProperty('--dashboard-offset', '0px');
}

const QUESTIONS = [];

const pad = (n) => String(n).padStart(2, "0");
const fmtMMSS = (seconds) => `${pad(Math.max(0, Math.floor(seconds / 60)))}:${pad(Math.max(0, seconds % 60))}`;

const root = document.getElementById("rc-app");

let state = {
    current: 0,
    answers: {},
    marked: {},
    view: "intro",
    delayOn: true,
    accom: false,
    timeLeft: null
};

let delayHandles = [];
let timerHandle = null;

function cloneState(value) {
    return {
        ...value,
        answers: { ...value.answers },
        marked: { ...value.marked }
    };
}

function loadProgress() {
    try {
        // Load from localStorage
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return;
        }
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
            if (parsed.answers && typeof parsed.answers === "object") {
                state.answers = parsed.answers;
            }
            if (parsed.marked && typeof parsed.marked === "object") {
                state.marked = parsed.marked;
            }
        }
    } catch (error) {
        console.error("Failed to load saved progress", error);
    }
}

function saveProgress() {
    try {
        const payload = {
            answers: state.answers,
            marked: state.marked
        };

        // Save to localStorage
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.error("Failed to save progress", error);
    }
}

function clearDelays() {
    delayHandles.forEach((handle) => window.clearTimeout(handle));
    delayHandles = [];
}

function exitToSubjectPage() {
    clearDelays();
    if (timerHandle) {
        window.clearTimeout(timerHandle);
        timerHandle = null;
    }

    const { referrer } = document;
    if (referrer && referrer !== window.location.href) {
        window.location.href = referrer;
        return;
    }

    window.location.href = "/";
}

function scheduleAction(callback) {
    if (!state.delayOn) {
        callback();
        return;
    }
    const handle = window.setTimeout(() => {
        callback();
        delayHandles = delayHandles.filter((id) => id !== handle);
    }, 2000);
    delayHandles.push(handle);
}

function scheduleTick() {
    if (timerHandle) {
        window.clearTimeout(timerHandle);
        timerHandle = null;
    }

    if (state.view !== "test" || typeof state.timeLeft !== "number") {
        return;
    }

    if (state.timeLeft <= 0) {
        if (state.view !== "results") {
            updateState((prev) => {
                const next = cloneState(prev);
                next.timeLeft = 0;
                next.view = "results";
                return next;
            });
        }
        return;
    }

    timerHandle = window.setTimeout(() => {
        if (state.view !== "test") {
            return;
        }
        updateState((prev) => {
            const next = cloneState(prev);
            if (typeof next.timeLeft === "number") {
                next.timeLeft = Math.max(0, next.timeLeft - 1);
                if (next.timeLeft === 0) {
                    next.view = "results";
                }
            }
            return next;
        });
    }, 1000);
}

function updateState(updater) {
    const previous = state;
    const nextState =
        typeof updater === "function"
            ? updater(cloneState(state))
            : {
                ...cloneState(state),
                ...updater
            };

    if (!nextState) {
        return;
    }

    const answersChanged = previous.answers !== nextState.answers;
    const markedChanged = previous.marked !== nextState.marked;

    state = nextState;

    if (answersChanged || markedChanged) {
        saveProgress();
    }

    render();
    scheduleTick();
}

function calcScore() {
    let correct = 0;
    QUESTIONS.forEach((question, index) => {
        if (state.answers[index] === question.a) {
            correct += 1;
        }
    });
    return { correct, total: QUESTIONS.length };
}

function startExam() {
    clearDelays();
    const base = 60 * 10;
    const startingTime = state.accom ? Math.floor(base * 1.5) : base;
    updateState((prev) => {
        const next = cloneState(prev);
        next.current = 0;
        next.view = "test";
        next.timeLeft = startingTime;
        return next;
    });
}

function goToQuestion(targetIndex) {
    if (targetIndex < 0 || targetIndex >= QUESTIONS.length) {
        return;
    }
    clearDelays();
    scheduleAction(() => {
        updateState((prev) => {
            const next = cloneState(prev);
            next.current = targetIndex;
            next.view = "test";
            return next;
        });
    });
}

function go(delta) {
    const target = Math.max(0, Math.min(state.current + delta, QUESTIONS.length - 1));
    if (target === state.current) {
        return;
    }
    goToQuestion(target);
}

function openReview() {
    clearDelays();
    scheduleAction(() => {
        updateState((prev) => {
            const next = cloneState(prev);
            next.view = "review";
            return next;
        });
    });
}

function finishOrAdvance() {
    clearDelays();
    const isLastQuestion = state.current >= QUESTIONS.length - 1;
    scheduleAction(() => {
        if (isLastQuestion) {
            updateState((prev) => {
                const next = cloneState(prev);
                next.view = "results";
                next.timeLeft = typeof next.timeLeft === "number" ? next.timeLeft : 0;
                return next;
            });
            return;
        }
        updateState((prev) => {
            const next = cloneState(prev);
            next.current = Math.min(QUESTIONS.length - 1, next.current + 1);
            return next;
        });
    });
}

function toggleMark(index) {
    updateState((prev) => {
        const next = cloneState(prev);
        const currentlyMarked = !!next.marked[index];
        if (currentlyMarked) {
            delete next.marked[index];
        } else {
            next.marked[index] = true;
        }
        return next;
    });
}

function chooseAnswer(questionIndex, choiceIndex) {
    updateState((prev) => {
        const next = cloneState(prev);
        next.answers[questionIndex] = choiceIndex;
        return next;
    });
}

function resetToIntro() {
    clearDelays();
    if (timerHandle) {
        window.clearTimeout(timerHandle);
        timerHandle = null;
    }
    updateState((prev) => {
        const next = cloneState(prev);
        next.view = "intro";
        next.timeLeft = null;
        return next;
    });
}

function el(tag, props = {}, ...children) {
    const element = document.createElement(tag);
    const {
        className,
        text,
        html,
        attrs,
        dataset,
        onClick,
        onChange,
        onInput,
        ...rest
    } = props;

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    if (html !== undefined) {
        element.innerHTML = html;
    }

    if (attrs) {
        Object.entries(attrs).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    if (dataset) {
        Object.entries(dataset).forEach(([key, value]) => {
            element.dataset[key] = value;
        });
    }

    if (typeof onClick === "function") {
        element.addEventListener("click", onClick);
    }

    if (typeof onChange === "function") {
        element.addEventListener("change", onChange);
    }

    if (typeof onInput === "function") {
        element.addEventListener("input", onInput);
    }

    Object.entries(rest).forEach(([key, value]) => {
        if (key in element && value !== undefined) {
            element[key] = value;
        }
    });

    children.forEach((child) => {
        if (child === null || child === undefined) {
            return;
        }
        element.appendChild(
            typeof child === "string" ? document.createTextNode(child) : child
        );
    });

    return element;
}

function renderIntro() {
    const shell = el("div", { className: "rc-shell" });
    const topbar = el(
        "div",
        { className: "rc-topbar" },
        el(
            "button",
            {
                className: "rc-topbar__button",
                attrs: { "aria-label": "Close" },
                onClick: exitToSubjectPage
            },
            "×"
        ),
        el(
            "div",
            { className: "rc-topbar__title" },
            el("div", { className: "rc-topbar__title-main", text: "Bootcamp.com | OAT" }),
            el("div", { className: "rc-topbar__title-sub", text: "Reading Comprehension Test 1" })
        ),
        el("div", { className: "rc-topbar__time", html: "&nbsp;" })
    );

    const delayToggle = el(
        "button",
        {
            className: "rc-toggle",
            dataset: { active: state.delayOn ? "true" : "false" },
            attrs: { type: "button", "aria-pressed": String(state.delayOn) },
            onClick: () => {
                updateState({ delayOn: !state.delayOn });
            }
        },
        el("span", { className: "rc-toggle__thumb" })
    );

    const accomToggle = el(
        "button",
        {
            className: "rc-toggle",
            dataset: { active: state.accom ? "true" : "false" },
            attrs: { type: "button", "aria-pressed": String(state.accom) },
            onClick: () => {
                updateState({ accom: !state.accom });
            }
        },
        el("span", { className: "rc-toggle__thumb" })
    );

    const bodyInner = el(
        "div",
        { className: "rc-body__inner" },
        el(
            "div",
            { style: "width: 100%;" },
            el(
                "div",
                { className: "rc-intro-card" },
                el(
                    "h2",
                    { text: "This is Reading Comprehension Test 1. Read this before starting:" }
                ),
                el(
                    "ol",
                    {},
                    el("li", { text: `You have 10 minutes to finish ${QUESTIONS.length} questions.` }),
                    el("li", { text: "You can review questions before ending the section." }),
                    el("li", { text: "Your score analysis appears after finishing." })
                ),
                el("p", { text: "Click NEXT to continue." })
            ),
            el("h3", { className: "rc-section-heading", text: "Test Settings" }),
            el(
                "div",
                { className: "rc-settings-list" },
                el(
                    "div",
                    { className: "rc-setting" },
                    delayToggle,
                    el(
                        "div",
                        { html: '<span class="font-semibold">Prometric Delay:</span> Adds a ~2 second delay on navigation and review.' }
                    )
                ),
                el(
                    "div",
                    { className: "rc-setting" },
                    accomToggle,
                    el(
                        "div",
                        { html: '<span class="font-semibold">Time Accommodations:</span> 1.5x time if enabled.' }
                    )
                )
            )
        )
    );

    const body = el("div", { className: "rc-body" }, bodyInner);

    const footer = el(
        "div",
        { className: "rc-footer-bar" },
        el(
            "button",
            {
                className: "rc-button",
                attrs: { type: "button" },
                onClick: startExam
            },
            "NEXT"
        )
    );

    shell.append(topbar, body, footer);
    return shell;
}

function renderTest() {
    const question = QUESTIONS[state.current];
    const passage = question.passageId ? PASSAGES[question.passageId] : null;
    const shell = el("div", { className: "rc-shell" });

    const topbar = el(
        "div",
        { className: "rc-topbar" },
        el("div", { className: "rc-topbar__title-main", text: `Question ${state.current + 1} of ${QUESTIONS.length}` }),
        el("div", { className: "rc-topbar__title-sub", text: "Reading Comprehension — Sample" }),
        el("div", {
            className: "rc-topbar__time",
            text: `Time remaining: ${state.timeLeft !== null ? fmtMMSS(state.timeLeft) : "--:--"}`
        })
    );

    const choices = el("div", { className: "rc-choice-list" });

    question.c.forEach((choice, index) => {
        const label = el("label", { className: "rc-choice" });
        const input = el("input", {
            type: "radio",
            name: `question-${state.current}`,
            checked: state.answers[state.current] === index,
            onChange: () => chooseAnswer(state.current, index)
        });
        const span = el("span", { text: `${String.fromCharCode(65 + index)}. ${choice}` });
        label.append(input, span);
        choices.appendChild(label);
    });

    const questionCard = el(
        "div",
        { className: "rc-test-card" },
        state.marked[state.current]
            ? el("span", { className: "rc-marked-flag", text: "MARKED" })
            : null,
        el("div", { className: "rc-question-stem", text: question.stem }),
        choices,
        passage
            ? el(
                "div",
                { className: "rc-passage" },
                el("div", { className: "rc-passage__title", text: passage.title }),
                el(
                    "div",
                    { className: "rc-passage__content" },
                    ...passage.content.map((paragraph) => el("p", { text: paragraph }))
                )
            )
            : null,
        el("p", { className: "rc-instruction", text: "Click NEXT to continue." })
    );

    const body = el("div", { className: "rc-body rc-body--test" }, el("div", { className: "rc-test-area" }, questionCard));

    const previousButton = el(
        "button",
        {
            className: "rc-button rc-button--secondary",
            attrs: { type: "button" },
            disabled: state.current === 0,
            onClick: () => go(-1)
        },
        "PREVIOUS"
    );

    const nextButton = el(
        "button",
        {
            className: "rc-button",
            attrs: { type: "button" },
            onClick: finishOrAdvance
        },
        state.current < QUESTIONS.length - 1 ? "NEXT" : "END SECTION"
    );

    const markButton = el(
        "button",
        {
            className: state.marked[state.current]
                ? "rc-button rc-button--mark rc-button--marked"
                : "rc-button rc-button--mark",
            attrs: { type: "button" },
            onClick: () => toggleMark(state.current)
        },
        "MARK"
    );

    const reviewButton = el(
        "button",
        {
            className: "rc-button rc-button--secondary",
            attrs: { type: "button" },
            onClick: openReview
        },
        "REVIEW"
    );

    const bottomBar = el(
        "div",
        { className: "rc-bottom-bar" },
        el("div", { className: "rc-bottom-group" }, previousButton),
        el("div", {}, nextButton),
        el("div", { className: "rc-bottom-group" }, markButton, reviewButton)
    );

    shell.append(topbar, body, bottomBar);
    return shell;
}

function renderReview() {
    const shell = el("div", { className: "rc-shell" });
    const topbar = el(
        "div",
        { className: "rc-topbar" },
        el(
            "button",
            {
                className: "rc-topbar__button",
                attrs: { "aria-label": "Close" },
                onClick: exitToSubjectPage
            },
            "×"
        ),
        el(
            "div",
            { className: "rc-topbar__title" },
            el("div", { className: "rc-topbar__title-main", text: "Bootcamp.com | OAT" }),
            el("div", { className: "rc-topbar__title-sub", text: "Review Questions" })
        ),
        el("div", {
            className: "rc-topbar__time",
            text: `Time remaining: ${fmtMMSS(state.timeLeft ?? 0)}`
        })
    );

    const rows = QUESTIONS.map((_, index) => ({
        index,
        name: `Question ${index + 1}`,
        isMarked: !!state.marked[index],
        isDone: state.answers[index] !== undefined,
        isSkipped: state.answers[index] === undefined
    }));

    const reviewList = el("div", { className: "rc-review-list" });
    rows.forEach((row) => {
        const button = el(
            "button",
            { className: "rc-review-row", attrs: { type: "button" } },
            el(
                "div",
                { className: "rc-review-cell" },
                el(
                    "svg",
                    {
                        attrs: {
                            width: "14",
                            height: "14",
                            viewBox: "0 0 24 24",
                            "aria-hidden": "true"
                        }
                    },
                    el("path", {
                        attrs: {
                            fill: "currentColor",
                            d: "M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1v5h5"
                        }
                    })
                ),
                el("span", { text: row.name })
            ),
            el("div", { className: "rc-review-cell", text: row.isMarked ? "Yes" : "" }),
            el("div", { className: "rc-review-cell", text: row.isDone ? "Yes" : "" }),
            el("div", { className: "rc-review-cell", text: row.isSkipped ? "Yes" : "" })
        );
        button.addEventListener("click", () => goToQuestion(row.index));
        reviewList.appendChild(button);
    });

    const table = el(
        "div",
        { className: "rc-review-table" },
        el(
            "div",
            { className: "rc-review-header" },
            el("div", { text: "Name" }),
            el("div", { text: "Marked" }),
            el("div", { text: "Completed" }),
            el("div", { text: "Skipped" })
        ),
        reviewList
    );

    const body = el(
        "div",
        { className: "rc-body" },
        el("div", { className: "rc-review-container" }, table)
    );

    const findFirstIndex = (predicate) => {
        const match = rows.find(predicate);
        return match ? match.index : null;
    };

    const reviewMarked = el(
        "button",
        {
            className: "rc-button",
            attrs: { type: "button" },
            onClick: () => {
                const index = findFirstIndex((row) => row.isMarked);
                if (index !== null) {
                    goToQuestion(index);
                }
            }
        },
        "REVIEW MARKED"
    );

    const reviewAll = el(
        "button",
        {
            className: "rc-button",
            attrs: { type: "button" },
            onClick: () => goToQuestion(0)
        },
        "REVIEW ALL"
    );

    const reviewIncomplete = el(
        "button",
        {
            className: "rc-button",
            attrs: { type: "button" },
            onClick: () => {
                const index = findFirstIndex((row) => !row.isDone);
                if (index !== null) {
                    goToQuestion(index);
                }
            }
        },
        "REVIEW INCOMPLETE"
    );

    const endButton = el(
        "button",
        {
            className: "rc-button",
            attrs: { type: "button" },
            onClick: () => updateState({ view: "results" })
        },
        "END"
    );

    const footer = el(
        "div",
        { className: "rc-review-actions" },
        el("div", { className: "rc-review-buttons" }, reviewMarked, reviewAll, reviewIncomplete),
        endButton
    );

    shell.append(topbar, body, footer);
    return shell;
}

function renderResults() {
    const { correct, total } = calcScore();
    const container = el(
        "div",
        { className: "rc-results" },
        el("h1", { text: "Results" }),
        el("p", { text: `Score: ${correct} / ${total} (${Math.round((correct / total) * 100)}%).` })
    );

    QUESTIONS.forEach((question, index) => {
        const selected = state.answers[index];
        const correctAnswer = question.a;
        const isCorrect = selected === correctAnswer;

        const item = el(
            "div",
            {
                className: isCorrect ? "rc-result-item" : "rc-result-item rc-result-item--incorrect"
            },
            el("div", { className: "rc-result-stem", text: `${index + 1}. ${question.stem}` })
        );

        const list = el("ul", { className: "rc-result-choices" });
        question.c.forEach((choice, choiceIndex) => {
            let suffix = "";
            if (choiceIndex === correctAnswer) {
                suffix += " (correct)";
            }
            if (selected === choiceIndex && choiceIndex !== correctAnswer) {
                suffix += " (your answer)";
            }
            const listItem = el("li", {
                text: `${String.fromCharCode(65 + choiceIndex)}. ${choice}${suffix}`,
                className: choiceIndex === correctAnswer ? "font-semibold" : ""
            });
            list.appendChild(listItem);
        });

        item.appendChild(list);

        if (state.marked[index]) {
            item.appendChild(el("div", { className: "rc-mark-tag", text: "MARKED" }));
        }

        container.appendChild(item);
    });

    container.appendChild(
        el(
            "button",
            {
                className: "rc-button",
                attrs: { type: "button" },
                onClick: resetToIntro
            },
            "Back to Start"
        )
    );

    return container;
}

function render() {
    if (!root) {
        return;
    }
    root.innerHTML = "";

    let view;
    switch (state.view) {
        case "intro":
            view = renderIntro();
            break;
        case "test":
            view = renderTest();
            break;
        case "review":
            view = renderReview();
            break;
        case "results":
            view = renderResults();
            break;
        default:
            view = renderIntro();
    }

    root.appendChild(view);
}

function init() {
    loadProgress();
    render();
    scheduleTick();
    applyExamButtonTheme();
}

if (root) {
    init();
}
// All test data organized by subject
// Exam data is now loaded from separate files in each subject's folder
// Use a function to get current values, ensuring data is loaded
function getAllTestData() {
    return {
        "Biology": window.BiologyExamData || [],
        "General Chemistry": window.GeneralChemistryExamData || [],
        "Organic Chemistry": window.OrganicChemistryExamData || [],
        "Reading Comprehension": window.ReadingComprehensionExamData || [],
        "Physics": window.PhysicsExamData || [],
        "Quantitative Reasoning": window.QuantitativeReasoningExamData || []
    };
}

// Create allTestData object that always returns current values
const allTestData = new Proxy({}, {
    get: function (target, prop) {
        const data = getAllTestData();
        const value = data[prop];
        if (prop === 'General Chemistry') {
            console.log('🔍 Getting General Chemistry data:', value ? value.length : 0, 'tests');
            if (value && value.length > 0) {
                console.log('🔍 Test 1 has', value[0] ? value[0].length : 0, 'questions');
            }
        }
        return value;
    },
    has: function (target, prop) {
        const data = getAllTestData();
        return prop in data;
    },
    ownKeys: function (target) {
        const data = getAllTestData();
        return Object.keys(data);
    }
});

function resetTestCard(subjectName, testIndex) {
    const confirmed = window.confirm('Reset attempts for this practice test? This will clear saved scores and review data.');
    if (!confirmed) return;

    try {
        // Perform reset - this only clears localStorage and in-memory state
        // NO DOM manipulation - let React handle re-rendering based on state changes
        if (!performTestReset(subjectName, testIndex)) {
            alert('Unable to reset this test. Please try again.');
            return;
        }

        // Clear result record if it matches the reset test
        if (lastResultRecord && lastResultRecord.subject === subjectName && lastResultRecord.testIndex === testIndex) {
            lastResultRecord = null;
            lastAttemptList = [];
            lastQuestionCount = 0;
            updateResultsAttemptCard(null);
        }

        // DO NOT call initializeSubjectPagesReact or displayTestList here
        // React component will re-render automatically based on state changes
        // Manual DOM manipulation causes removeChild errors

        console.log('✅ Reset complete - React will handle re-rendering');
    } catch (error) {
        console.error('Error in resetTestCard:', error);
        alert('An error occurred while resetting. Please refresh the page and try again.');
    }
}

function promptAttemptSelection(attempts) {
    if (!Array.isArray(attempts) || attempts.length === 0) {
        return null;
    }

    const options = attempts
        .map((attempt, idx) => {
            const num = idx + 1;
            const scoreText = typeof attempt.score === 'number' ? `${attempt.score}%` : 'N/A';
            const dateText = attempt.date ? formatResultDate(attempt.date) : 'Unknown date';
            return `${num}. Attempt ${num} • Score: ${scoreText} • ${dateText}`;
        })
        .join('\n');

    const rawInput = window.prompt(
        `Select which attempt to review (1-${attempts.length}):\n\n${options}`,
        `${attempts.length}`
    );

    if (rawInput === null) {
        return null;
    }

    const parsed = parseInt(rawInput, 10);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > attempts.length) {
        alert('Invalid attempt number. Please try again.');
        return null;
    }

    return parsed;
}

function reviewTestFromSubject(subjectName, testIndex, attemptNumber) {
    const attempts = getTestAttempts(subjectName, testIndex);
    if (!attempts || attempts.length === 0) {
        alert('Review is available after you complete this test at least once.');
        return;
    }

    let resolvedAttemptNumber = attemptNumber;
    if ((resolvedAttemptNumber === undefined || resolvedAttemptNumber === null) && attempts.length > 1) {
        resolvedAttemptNumber = promptAttemptSelection(attempts);
        if (!resolvedAttemptNumber) {
            return;
        }
    }

    // Default to latest attempt if no specific attemptNumber is provided
    let targetIndex = attempts.length - 1;
    if (typeof resolvedAttemptNumber === 'number' && resolvedAttemptNumber >= 1 && resolvedAttemptNumber <= attempts.length) {
        targetIndex = resolvedAttemptNumber - 1;
    }
    const targetAttempt = attempts[targetIndex];
    if (!targetAttempt) {
        alert('Unable to load selected attempt for review.');
        return;
    }

    // Load the saved state for this specific attempt into memory for review
    try {
        userAnswers = targetAttempt.userAnswers || {};
        markedQuestions = targetAttempt.markedQuestions || {};
        highlights = targetAttempt.highlights || {};
        passageHighlights = targetAttempt.passageHighlights || {};
        questionTimeSpent = targetAttempt.questionTimeSpent || {};
        questionStartTime = {};
        currentQuestionIndex = 0;
    } catch (error) {
        console.error('Failed to apply attempt state for review:', error);
        alert('Unable to load saved review data. Please retake the test.');
        return;
    }

    currentSubject = subjectName;
    currentTestIndex = testIndex;
    lastAttemptList = attempts.slice();
    lastResultRecord = targetAttempt;
    lastQuestionCount = targetAttempt.total || lastQuestionCount || 0;
    detailedReviewQuestionIndex = 0;

    // Set view mode to 'review' for detailed review  
    currentViewMode = 'review';
    saveFullExamState();

    showDetailedReview();
}

let currentSubject = null;
let currentTestIndex = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let markedQuestions = {};
let testTimer = null;
let timeRemaining = 1800; // 30 minutes in seconds
let prometricDelay = false;
let timeAccommodations = false;
let questionStartTime = {}; // Track when each question was started
let questionTimeSpent = {}; // Track time spent on each question
let testStartTime = null; // Track when test started
let detailedReviewQuestionIndex = 0; // Current question in detailed review
let highlights = {}; // Store highlights: key = "subject-testIndex-questionIndex", value = array of highlight objects
let passageHighlights = {}; // Store passage HTML with highlights: key = "subject-testIndex-passage-N", value = HTML string
let highlightCounter = 0; // Unique ID counter for highlights
let showHighlightButton = false; // Track if highlight button should be shown
let highlightButtonPosition = { x: 0, y: 0 }; // Position for highlight button
let currentViewMode = null; // Track current view: 'intro' | 'test' | 'review' | 'results'
let examSubmitted = false; // Track whether the current exam attempt has been submitted

const REMOTE_EXAM_BUTTON_ENDPOINT = '/api/exam-button-config';
const SUPRAS_BUTTON_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAAeCAYAAADjPAqoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAvYSURBVGhD7Zt7jFxXecB/M7Mznt3Z9+zb3qy9a8sQQ14VjgM0BKhwCBRFBBIJUElbVbSq1FYgRaKp+lKbhEhUCuAggSoVEiFwahSQqHinouCYEBIMJtn4EcfYu+vd2ce87tznOad/3MfeuXPv7qyzqRrJP+nT3nvO933nnPvd87hnzqbe95lvKqkUUimEVEjpXl/l9YNSoJRAOTbCMhCmjmMZSMdGCcF5Bknd8ZlvKiEljpDYngipUEpBKN7+ZWo9KWCjPJ8kHRWTthXi/IZ9Rv1H78NslOezkW+fpPR28e238ldJgRJOEGhpe4GWksvZYVLvfeiYsoXEtAWGI7BsJwh2c7Eb4RcXR5L9RjZRtqL7aokrKy4tTAqQCe2kDftXjxtoG2mZSMsNtHIclJRUuydIHX7omLJtiW7ZaKaDYdtYjsSR8rWu21W2DXcEVo6Nsk2UraNsE+nYIBXW4CSpww8eU5Yt0Cybum6hWQ6WLXCkpGmqDr+UTeOGl5gCVOiNDvQVpFKttk14zlL+dBH1Ex4VwrohZ9HygzSvfMK+g8p7vqJtC+fj1T+U5rcnqIN3jacXbm/gs9lluInN1fF8hm0Il+PXL+xEgZIoYaNsC2UZKMft0SgJw7vdQJu2Q910A103HUzbaQ30Vf4fo0BKlLTBslC2F2jhgFRkRveQDl5a7wVSSrlJkSDnuvJ09nW3JfnuLjLZjmYHV3ntCa+fVXMMU4cfOKZMx+3RNd1CM2wMRyCEDPR6R4sUBnvXrdpEW6tSvbwSTb7KtuP1aG/oxjbcXi0cUG6PbivQ42/cA8Dh6cEm90lc1ixOLtbBC3ajXCOdTkfVWrANCyUlAKl0mmw+F1VpC2E7CNuJJtORzzXVQ0rZdG81jOC63fKllDiGFdxH7aJ12Wp+HOF6umxzoI//6Vub3CchhOB3a3U++q3fRrM2pb5cplGuUZwaf1XD/8qFhaYH0jM0QPdwf5NOFKthsHJhYcsjmLAdVi4skN2RY2BytCWv9PIcSkoy2Y7Ydq1dXMRsGAxOjpLryjflxSFsB221grZa9VI2CrQkMzq9tUC/8Kk7AJhdqvLiUs3Lbebg5CA7+zoRQnDnf/yEc2UdgOtHu6OqLfijgNUwyHXlKWQz7B3sjKq1cG5Np5DNMNbt9oSTi3WE7bB09iIAmWwHI3snIVSPc2s6dUu03OuVOp19btpMfyfdOzJeKfFcrlssahbCdlBC0pHPBXZ+Xnm+hF6pk+/pYmDXaNCuuik4V9YxahpKKjr7ut12FHKJ5fo2NL3MGwX6Cnq0H+gjx89w5OkzQeFh7jywiwduvw6AP/r6cZ6dKzNWyPHEh2+Mqrbw1LkSf/8/Lwf3t88Mcf/vzzTpxHH3sV8x0pnlC3ccAOBDTzzPomZRW16jXirTPzFMZ183h6cH+btb93FmVeNPvn2KFPCTe29GAfcc+xULNRPlDef/dOs0t+0ZIpUKfwe14gjB33x/lpOL9cD2kduv5YaxHh762Xn+68xSEOjOvm76J4aDdj1/ucpfffdFzIbOjq5OUsDX7nwTO/u6EstVSvHIifMce6mEtlqhurjaVqA3nzhfBSlv/stkMhSLRYrFIp999lKLfP30CsVikbfMTDTZ5/N5isUiJZnlkz86kygLNZOTS3XONaBYLPK3b5sGoDDQRzafC3roJw5OUywWefjEhaAMv17plFtXv87vf/NuhoaG+NKvF1vq64uR7WJkZIRrBnqabHt7eygWi+Ry8XNtp9eunt4+8EYcgLFCjjft3smyyrWU9dlnL/Gl3ywyNDTELdPu9BCdAjYiCHTo03tTZgY7OTw9mCgb8eSpuVgB6Mhmo+oAVA2HX1xcTRSf+7/7awDesX8X1492k86kGbxmHLyF5L6xIk/+9hKzCdNOmHw+jwJ+fHaxpa5PnprjW6fmmKs0SAE7ezefXtohk8mQyWSoGE5Leb58/OgJ/vnHswBI0U60XIJAt28Ct+0e4h/e+YZYuWX3CABzFZ2XlvzFwjqjhVyLzAxs/KBm+vPcd2iqSXxWLiywcmEBYTvMVXW++twr5HI5/uwmVyedSTNayPGJg9NkMhmOHI+fcjajurhKeb5Eeb7UsqLPZOLn0ytlb0x77zs0xV/cOMFbhrvo7HDDJhw7appIumkrLtSzN+KVqsVTl7RY+c7pEg8+9QL3Hj1B1Wz9xPnGB69rkQffvR+AmhFf8YFCnntumm4SH6thYDUMyvMl8NYPNcPh7XvHg9HlfftGgt48V9VbAtUORk1Dr9TRK3WEtXX7jRC2++PDXFXnmYsrse315Y8PzvBpb2rK9xSirhIJdsa2wo/OLnL/904mymPPvZL4QJ84W+GJsxXsHT2MjIzQ2TfA115cDl4OvIaHeXauzO89+lST+BSnxilOjZNOp7E0g5pp84WnT5PL5fjU2/YxM9DJx26c4nLdCnpzrbQW8t4e/RPDQVnZzvi5N4lCsY/i1Dg9wwPRLACyO3aQSruhuPfoz3nroz/kDx8/0SIfePwEhUKB/bvcUbOdvQl/rG7R3ErcbcOiUa63SK20FgypUY487a7Y7z16gtmlKoVshoNjXXz/pflgBDBqWtQskVxXnlxXnr6JYWrLbgAfe+4VZpeqTAwN8Pnbr2V0oDfozWZDR6+4n3FbwS8n15UPFl3tkt2RI9eVT1w8pTOuv+tHurnv0BRvHi4wX9VjhS1PFe4YHV9ymxg1jfpyOZockNQwgLmqzseP/pyv3H0zN0yO8MhhxV9/b5ZFzaIw6K5GfWb68/zbu/c1pYU58stLnCvrSCnRVisUBvt48L9f4Ct3H+KasWHmq0bwOViZX46ax1IzHHryHdx3aAohRDQbgL0DXShgtlRpSq+aDingrv3D3DrWuv7YM9zcPp83jPRyz03THBhf5a79jWh2gD/FSW8XsR1aXs125ujtQFutUDNtPvjYT/nO6UUOXDPOv7//AHftH46qMlDI865rpxJloLADvKGsvlxGSckvLq7yzMUV0uk0R54+DUCj7G6kbISwHRTw1efPUzMc3rF/V0t56+XmeebiarCKNzUdBXzx+BnmKjrX7RpqsXnXtVPsHStyqarz+HPnAYIt1J/9bo0LNYcbJkdabHypGg6Pei+tra9vvW5GWxsmY/unYocrfyMgiXQmzcjeyRZbf9eqe6g/cd66EpbOXkTYDoWBXnrHikG6FJJ0Jh3ks0mb+idaX7bNMGoalYVlhvbs3HAki+Jvnw7uGqVjkz3uMEpKSi/Pee3Zpg2TyuWVlp5gajpGLXl4wXvAtaW14IcKvAr6i6H6cplaqTnf12mUN//W9VFSUl1cr6O2VkVbXR9OUyma8olpk+9Dr9Qpz5cwtegPB/E4tk2ttEZ5fhkpJCsXFmiUay1tiqKkxNT04NNw9dIijXKt5TlHidq1S+o9D/ynsmyx3qPNUI9WijtvXP9m3SqzlyvMLiTP4VfZRoITJibYZkuPTr3nX76hDEegmY57wsSwMB3pDd2KMw9/JOqybT73g9/w+R+c8u7C6/nwSkBF9uX8IxDR1UKcXjiPGBufOL/hNGLy44jaE3PvE/UdJvosouVGy9n8WikBwnGPEtkmOGZzoP/gHx9XpiPQTJua4fZo05YI7yjRZHHzX52SqOgW1Ua7C4ZoY6+E7fDxesQ9M4Zw3AOCjgXCQgmx/jPlbZ/+srKE26M1w0azbCzbPQW6vWfGkoKQlB6mHZ04rtTuSvm/Ls9HueKd7caxQTpeoBWZsWlSb//k55TlCHTLQTNtNNM97ivUdgf6Kq8pyuvVUroBl25vRuEG+pa/fFjZQtCwHRqGTcNysPwD/OFIR6eG6F+f6DTik5SWpB8mqkdI18/b6Nonrg3hdD/PT4tex9lvJS3qzydc/mZEffppgMKLmZRe7NzTgpmxaVI3//m/KtsR6LZAMy10S3j/qXG1R7/+8CMe/psiMzZNWgqBlAIlBEqsd333rQiJ9CScFpVwftL1ZvdJ15ulxUlUL058vSS7aFqSXpyvpPy4+7BtNC18H9Vr0g/15kgv/V9xOvWO5GZ/XwAAAABJRU5ErkJggg==';
const REMOTE_EXAM_BUTTON_CACHE_KEY = 'cached_remote_exam_button_config';
const REMOTE_EXAM_BUTTON_CACHE_EXPIRY_KEY = 'cached_remote_exam_button_config_expiry';
const REMOTE_EXAM_BUTTON_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let remoteExamButtonFetchPromise = null;

const EXAM_BUTTON_KEYS = [
    'previous',
    'next',
    'mark',
    'mark-active',
    'review',
    'exhibit',
    'end',
    'highlight',
    'review-marked',
    'review-all',
    'review-incomplete'
];

const DEFAULT_BUTTON_THEME = Object.freeze({
    image: null,
    useCustom: false,
    useImage: true,
    hidden: false
});

const createSuprasButtonTheme = (overrides = {}) => ({
    image: SUPRAS_BUTTON_IMAGE,
    useCustom: true,
    useImage: true,
    hidden: false,
    ...overrides,
});

const DEFAULT_EXAM_BUTTON_CONFIG = Object.freeze({
    previous: { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Prevoius.png', useCustom: true, useImage: true },
    next: { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Next.png', useCustom: true, useImage: true },
    mark: { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Mark.png', useCustom: true, useImage: true },
    'mark-active': { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Marked%20active%20.png', useCustom: true, useImage: true },
    review: { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Review.png', useCustom: true, useImage: true },
    exhibit: { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Exhibit.png', useCustom: true, useImage: true },
    end: { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/End.png', useCustom: true, useImage: true },
    highlight: { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Highlight%20button%20.png', useCustom: true, useImage: true },
    'review-marked': { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Review%20marked.png', useCustom: true, useImage: true },
    'review-all': { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Review%20all.png', useCustom: true, useImage: true },
    'review-incomplete': { image: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Review%20incomplete.png', useCustom: true, useImage: true },
});

function extractExamButtonConfigPayload(rawConfig) {
    if (!rawConfig || typeof rawConfig !== 'object') {
        return rawConfig;
    }

    if (rawConfig.buttons && typeof rawConfig.buttons === 'object') {
        return rawConfig.buttons;
    }

    if (rawConfig.config && typeof rawConfig.config === 'object') {
        return rawConfig.config;
    }

    if (rawConfig.theme && typeof rawConfig.theme === 'object') {
        return rawConfig.theme;
    }

    return rawConfig;
}

function normalizeExamButtonConfig(rawConfig) {
    const payload = extractExamButtonConfigPayload(rawConfig);
    const normalized = {};
    const input = payload && typeof payload === 'object' ? payload : {};

    EXAM_BUTTON_KEYS.forEach((key) => {
        const source = input[key] && typeof input[key] === 'object' ? input[key] : {};
        normalized[key] = {
            image: typeof source.image === 'string' ? source.image : null,
            useCustom: source.useCustom === true,
            useImage: source.useImage !== false,
            hidden: source.hidden === true
        };

        if (typeof source.label === 'string') {
            normalized[key].label = source.label;
        }
        if (typeof source.imageHeight === 'number') {
            normalized[key].imageHeight = source.imageHeight;
        }
    });

    // Preserve any additional keys the remote config may include
    Object.keys(input).forEach((key) => {
        if (!normalized[key] && typeof input[key] === 'object') {
            normalized[key] = { ...input[key] };
        }
    });

    return normalized;
}

function readCachedRemoteExamButtonConfig() {
    if (typeof window === 'undefined' || !window.localStorage) {
        return null;
    }

    const cached = window.localStorage.getItem(REMOTE_EXAM_BUTTON_CACHE_KEY);
    const expiry = window.localStorage.getItem(REMOTE_EXAM_BUTTON_CACHE_EXPIRY_KEY);

    if (!cached || !expiry || Date.now() >= parseInt(expiry, 10)) {
        return null;
    }

    try {
        return JSON.parse(cached);
    } catch (err) {
        console.warn('Failed to parse cached remote config', err);
        return null;
    }
}

function writeCachedRemoteExamButtonConfig(config) {
    if (typeof window === 'undefined' || !window.localStorage) {
        return;
    }

    try {
        window.localStorage.setItem(REMOTE_EXAM_BUTTON_CACHE_KEY, JSON.stringify(config));
        window.localStorage.setItem(
            REMOTE_EXAM_BUTTON_CACHE_EXPIRY_KEY,
            (Date.now() + REMOTE_EXAM_BUTTON_CACHE_DURATION).toString()
        );
    } catch (err) {
        console.warn('Failed to cache remote button config', err);
    }
}

function fetchRemoteExamButtonConfig(force = false) {
    if (remoteExamButtonFetchPromise && !force) {
        return remoteExamButtonFetchPromise;
    }

    if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
        return Promise.resolve(null);
    }

    remoteExamButtonFetchPromise = window
        .fetch(REMOTE_EXAM_BUTTON_ENDPOINT, { cache: 'no-store' })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load SUPRAS button config (${response.status})`);
            }
            return response.json();
        })
        .then((data) => {
            const normalized = normalizeExamButtonConfig(data);
            writeCachedRemoteExamButtonConfig(normalized);
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                window.dispatchEvent(new Event('buttonThemeUpdated'));
            }
            return normalized;
        })
        .catch((error) => {
            console.warn('Failed to fetch remote button config from SUPRAS', error);
            return null;
        })
        .finally(() => {
            remoteExamButtonFetchPromise = null;
        });

    return remoteExamButtonFetchPromise;
}

function getCachedRemoteExamButtonConfig(options = {}) {
    const { refresh = true, force = false } = options;
    const cached = readCachedRemoteExamButtonConfig();
    if (cached) {
        return normalizeExamButtonConfig(cached);
    }

    if (refresh) {
        fetchRemoteExamButtonConfig(force);
    }

    return null;
}

if (typeof window !== 'undefined') {
    // Kick off a fetch early so SUPRAS assets are applied ASAP
    getCachedRemoteExamButtonConfig();

    // Clear legacy button configs to ensure new defaults are applied
    try {
        const keysToClear = [
            'exam_button_theme',
            'oat_exam_button_theme',
            'exam_button_config',
            'test_button_theme',
            'button_theme_config'
        ];
        keysToClear.forEach(key => window.localStorage.removeItem(key));
    } catch (e) {
        // Ignore
    }

    window.addEventListener('buttonThemeUpdated', () => {
        try {
            applyExamButtonTheme();
        } catch (err) {
            console.warn('Failed to apply remote exam button theme', err);
        }
    });
}

function getStoredExamButtonConfig() {
    const remote = getCachedRemoteExamButtonConfig();
    if (remote) {
        return remote;
    }

    if (typeof window !== 'undefined' && window.localStorage) {
        const candidateKeys = [
            'exam_button_theme',
            'oat_exam_button_theme',
            'exam_button_config',
            'test_button_theme',
            'button_theme_config'
        ];

        for (const key of candidateKeys) {
            try {
                const raw = window.localStorage.getItem(key);
                if (!raw) continue;
                const parsed = JSON.parse(raw);
                return normalizeExamButtonConfig(parsed);
            } catch (err) {
                console.warn('Failed to parse button config for key', key, err);
            }
        }

        try {
            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (!key) continue;
                const raw = window.localStorage.getItem(key);
                if (!raw || !raw.includes('"previous"') || !raw.includes('"next"')) continue;
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed === 'object' && parsed.previous && parsed.next) {
                        return normalizeExamButtonConfig(parsed);
                    }
                } catch (err) {
                    // Ignore parse errors for unrelated keys
                }
            }
        } catch (err) {
            console.warn('Failed to scan localStorage for button config:', err);
        }
    }

    return normalizeExamButtonConfig(DEFAULT_EXAM_BUTTON_CONFIG);
}

function setExamButtonContent(buttonElement, buttonKey, label, config, options = {}) {
    if (!buttonElement) return;

    const buttonTheme = config && config[buttonKey];
    const keepLabel = options.keepLabel === true; // Default to false - never show labels with custom images
    const imageHeight = options.imageHeight || 28;

    if (buttonKey) {
        buttonElement.dataset.buttonKey = buttonKey;
    } else {
        delete buttonElement.dataset.buttonKey;
    }

    // Clear innerHTML - handlers will be set by caller (applyExamButtonTheme)
    buttonElement.innerHTML = '';

    const shouldShowLabel = keepLabel || !(buttonTheme && buttonTheme.useCustom && buttonTheme.image);

    if (buttonTheme && buttonTheme.useCustom && buttonTheme.image) {
        // Clearcoat button with custom image
        buttonElement.classList.remove('clearcoat-button-default');
        buttonElement.classList.add('clearcoat-button');
        buttonElement.innerHTML = '';

        const img = document.createElement('img');
        img.src = buttonTheme.image;
        img.alt = label || '';
        img.className = 'button-skin';
        const height = parseInt(buttonElement.dataset.buttonHeight, 10) || imageHeight;
        img.style.height = `${height}px`;

        buttonElement.appendChild(img);
    } else {
        // Clearcoat default button - no text, just glassy box
        buttonElement.classList.remove('clearcoat-button');
        buttonElement.classList.add('clearcoat-button-default');
        buttonElement.textContent = '';
        if (shouldShowLabel && label) {
            const span = document.createElement('span');
            span.className = 'exam-btn-label';
            span.textContent = label;
            buttonElement.appendChild(span);
        }
    }
}

function applyExamButtonTheme() {
    // ALWAYS read fresh config from localStorage - NO CACHING
    const config = getStoredExamButtonConfig();
    console.log('buttonConfig in exam layout (FRESH from localStorage)', config);

    // HELPER: Attach handler to button and its image - ENSURES FUNCTIONALITY IS TRANSFERRED
    function attachButtonHandler(button, handler) {
        if (!button || !handler) return;

        // Attach click handler - instant response
        button.onclick = function (e) {
            if (!button.disabled) {
                handler.call(this, e);
            }
        };

        // Ensure image never blocks clicks
        const img = button.querySelector('.button-skin');
        if (img) {
            img.style.pointerEvents = 'none';
            img.onclick = null;
        }
    }

    // Pre-test Begin button - keep original styling (no clearcoat)
    const preTestNextBtn = document.getElementById('pre-test-next-btn');
    if (preTestNextBtn) {
        preTestNextBtn.classList.remove('clearcoat-button', 'clearcoat-button-default');
        delete preTestNextBtn.dataset.buttonKey;
        preTestNextBtn.innerHTML = 'BEGIN';
        preTestNextBtn.style.pointerEvents = 'auto';
        preTestNextBtn.onclick = startTest;
    }

    // Previous button
    const prevBtn = document.getElementById('test-prev-btn');
    if (prevBtn) {
        const isFirst = typeof currentQuestionIndex === 'number' ? currentQuestionIndex === 0 : true;
        prevBtn.disabled = isFirst;
        setExamButtonContent(prevBtn, 'previous', 'PREVIOUS', config);
        attachButtonHandler(prevBtn, prevQuestion);
    }

    // Next button
    const nextBtn = document.getElementById('test-next-btn');
    if (nextBtn) {
        let label = 'NEXT';
        const subjectTests = currentSubject && currentTestIndex !== null ? allTestData[currentSubject] : null;
        const test = subjectTests ? subjectTests[currentTestIndex] : null;
        if (test && typeof currentQuestionIndex === 'number' && currentQuestionIndex >= test.length - 1) {
            label = 'END SECTION';
        }
        setExamButtonContent(nextBtn, 'next', label, config);
        attachButtonHandler(nextBtn, function () {
            const test = allTestData[currentSubject] && allTestData[currentSubject][currentTestIndex];
            if (test && currentQuestionIndex === test.length - 1) {
                if (typeof window.showEndTestModalReact === 'function') {
                    window.showEndTestModalReact();
                } else {
                    openSubmitConfirmation();
                }
            } else {
                nextQuestion();
            }
        });
    }

    // Review button
    const reviewBtn = document.getElementById('test-review-btn');
    if (reviewBtn) {
        setExamButtonContent(reviewBtn, 'review', 'REVIEW', config);
        attachButtonHandler(reviewBtn, function () {
            const act = () => {
                if (typeof showReviewView === 'function') {
                    showReviewView();
                } else {
                    showView('review-view');
                }
            };
            if (prometricDelay) setTimeout(act, 2000);
            else act();
        });
    }

    // Exhibit button
    const exhibitBtn = document.getElementById('test-exhibit-btn');
    if (exhibitBtn) {
        const footerBar = exhibitBtn.closest('.fixed-bottom-bar');
        if (currentSubject === 'General Chemistry' || currentSubject === 'Quantitative Reasoning') {
            exhibitBtn.style.display = 'flex';
            if (footerBar) footerBar.classList.add('has-exhibit-button');
            setExamButtonContent(exhibitBtn, 'exhibit', 'EXHIBIT', config);
            attachButtonHandler(exhibitBtn, showExhibit);
        } else {
            exhibitBtn.style.display = 'none';
            if (footerBar) footerBar.classList.remove('has-exhibit-button');
        }
    }

    // Hide/show Organic Chemistry floating buttons based on current subject
    const organicChemAuthorBtn = document.getElementById('organic-chem-author-btn');
    const ochemResetBtn = document.getElementById('ochem-reset-btn');
    if (organicChemAuthorBtn) {
        organicChemAuthorBtn.style.display = (currentSubject === 'Organic Chemistry') ? 'flex' : 'none';
    }
    if (ochemResetBtn) {
        ochemResetBtn.style.display = (currentSubject === 'Organic Chemistry') ? 'flex' : 'none';
    }

    // Mark button (handled by updateTestMarkButton)
    if (typeof currentQuestionIndex === 'number') {
        updateTestMarkButton(currentQuestionIndex, config);
    }

    // Review screen buttons
    const reviewMarkedBtn = document.getElementById('review-marked-btn');
    if (reviewMarkedBtn) {
        setExamButtonContent(reviewMarkedBtn, 'review-marked', 'REVIEW MARKED', config);
        attachButtonHandler(reviewMarkedBtn, () => jumpToQuestion('marked'));
    }

    const reviewAllBtn = document.getElementById('review-all-btn');
    if (reviewAllBtn) {
        setExamButtonContent(reviewAllBtn, 'review-all', 'REVIEW ALL', config);
        attachButtonHandler(reviewAllBtn, () => jumpToQuestion('all'));
    }

    const reviewIncompleteBtn = document.getElementById('review-incomplete-btn');
    if (reviewIncompleteBtn) {
        setExamButtonContent(reviewIncompleteBtn, 'review-incomplete', 'REVIEW INCOMPLETE', config);
        attachButtonHandler(reviewIncompleteBtn, () => jumpToQuestion('incomplete'));
    }

    // End button
    const reviewEndBtn = document.getElementById('review-end-btn');
    if (reviewEndBtn) {
        setExamButtonContent(reviewEndBtn, 'end', 'END', config);
        attachButtonHandler(reviewEndBtn, function () {
            if (typeof window.showEndTestModalReact === 'function') {
                window.showEndTestModalReact();
            } else {
                openSubmitConfirmation();
            }
        });
    }

    // Review mark button
    if (typeof detailedReviewQuestionIndex === 'number') {
        updateDetailedReviewMarkButton(detailedReviewQuestionIndex, config);
    } else {
        const reviewMarkBtn = document.getElementById('review-mark-btn');
        if (reviewMarkBtn) {
            setExamButtonContent(reviewMarkBtn, 'mark', 'MARK', config);
            attachButtonHandler(reviewMarkBtn, () => toggleMark(null, { context: 'detailed-review' }));
        }
    }
}

// Expose getStoredExamButtonConfig to window for React components
if (typeof window !== 'undefined') {
    window.getStoredExamButtonConfig = getStoredExamButtonConfig;

    // Helper function for React components to render button with custom image
    window.renderExamButton = function (buttonKey, defaultLabel, buttonElement, onClickHandler) {
        if (!buttonElement) return;

        const config = getStoredExamButtonConfig();
        const buttonTheme = config && config[buttonKey];

        // Store original onclick - prefer the explicit handler parameter
        const originalOnClick = onClickHandler || buttonElement.onclick;

        if (buttonKey) {
            buttonElement.dataset.buttonKey = buttonKey;
        } else {
            delete buttonElement.dataset.buttonKey;
        }

        if (buttonTheme && buttonTheme.useCustom && buttonTheme.image) {
            // Clearcoat button with custom image
            buttonElement.classList.remove('clearcoat-button-default');
            buttonElement.classList.add('clearcoat-button');
            buttonElement.innerHTML = '';

            // Create image
            const img = document.createElement('img');
            img.src = buttonTheme.image;
            img.alt = defaultLabel || '';
            img.className = 'button-skin';
            const height = parseInt(buttonElement.dataset.buttonHeight, 10) || 28;
            img.style.height = `${height}px`;

            // Wire up click handler DIRECTLY - instant response
            if (originalOnClick) {
                buttonElement.onclick = function (e) {
                    if (!buttonElement.disabled) {
                        originalOnClick.call(this, e);
                    }
                };
            }

            buttonElement.appendChild(img);
        } else {
            // Clearcoat default button - text visible
            buttonElement.classList.remove('clearcoat-button');
            buttonElement.classList.add('clearcoat-button-default');
            buttonElement.textContent = defaultLabel || '';

            // Restore onclick
            if (originalOnClick) {
                buttonElement.onclick = originalOnClick;
            }
        }
    };

    // Auto-apply button configs to React components when they mount
    // Use MutationObserver to detect when React components render buttons
    if (typeof MutationObserver !== 'undefined') {
        const buttonObserver = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            // Check if highlight buttons or other exam buttons were added/modified
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (node.id === 'test-highlight-toggle' ||
                                node.id === 'review-highlight-toggle' ||
                                (node.querySelector && (
                                    node.querySelector('#test-highlight-toggle') ||
                                    node.querySelector('#review-highlight-toggle')
                                ))) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });

            // Always apply button themes (in case buttons were re-rendered)
            if (shouldUpdate) {
                requestAnimationFrame(() => {
                    applyExamButtonTheme();
                });
            }
        });

        // Observe the document body for changes so that newly-added exam buttons
        // also receive the configured themes without touching legacy highlight
        // footer buttons.
        if (document.body) {
            buttonObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['id', 'class']
            });
        }
    }
}

// Expose to window for React modals
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'currentSubject', {
        get: () => currentSubject,
        set: (val) => { currentSubject = val; },
        configurable: true
    });
    Object.defineProperty(window, 'currentTestIndex', {
        get: () => currentTestIndex,
        set: (val) => { currentTestIndex = val; },
        configurable: true
    });
    Object.defineProperty(window, 'userAnswers', {
        get: () => userAnswers,
        set: (val) => { userAnswers = val; },
        configurable: true
    });
    Object.defineProperty(window, 'markedQuestions', {
        get: () => markedQuestions,
        set: (val) => { markedQuestions = val; },
        configurable: true
    });
    Object.defineProperty(window, 'timeRemaining', {
        get: () => timeRemaining,
        set: (val) => { timeRemaining = val; },
        configurable: true
    });
    Object.defineProperty(window, 'testStartTime', {
        get: () => testStartTime,
        set: (val) => { testStartTime = val; },
        configurable: true
    });
    Object.defineProperty(window, 'currentViewMode', {
        get: () => currentViewMode,
        set: (val) => { currentViewMode = val; },
        configurable: true
    });
    Object.defineProperty(window, 'testTimer', {
        get: () => testTimer,
        set: (val) => { testTimer = val; },
        configurable: true
    });

    window.addEventListener('buttonThemeUpdated', () => {
        applyExamButtonTheme();
    });

    window.refreshExamButtonTheme = () => {
        applyExamButtonTheme();
    };
}
const TEST_HISTORY_STORAGE_KEY_BASE = 'opto-test-history-v1';
let lastResultRecord = null;
let lastAttemptList = [];
let lastQuestionCount = 0;

function getStorageNamespace() {
    try {
        if (typeof window !== 'undefined' && window.__instantDBAuthState) {
            const authState = window.__instantDBAuthState;
            if (authState.isAuthenticated && authState.userId) {
                return `user-${authState.userId}`;
            }
        }
    } catch (e) {
        console.warn('Unable to determine auth namespace, defaulting to guest', e);
    }
    return 'guest';
}

function getNamespacedStorageKey(baseKey) {
    return `${baseKey}-${getStorageNamespace()}`;
}
let taggedReviewAllItems = [];
let taggedReviewFilteredItems = [];
let taggedReviewIndex = 0;
let taggedReviewFilter = 'all';
let taggedReviewSearch = '';
let taggedReviewActiveKey = null;
let taggedSubjectFilter = 'all'; // Track subject filter for tagged questions

// --- OAT Scoring Maps ---
// Initialize on window to avoid const redeclaration conflicts
// These will be shared between script.js and subject-pages-react.jsx
(function () {
    'use strict';

    // Only initialize if not already defined
    if (typeof window.TOTAL_QUESTIONS_BIOLOGY === 'undefined') {
        window.TOTAL_QUESTIONS_BIOLOGY = 40;
        window.TOTAL_QUESTIONS_CHEMISTRY = 30;
        window.TOTAL_QUESTIONS_READING = 50;
        window.TOTAL_QUESTIONS_PHYSICS = 40;
        window.TOTAL_QUESTIONS_QUANTITATIVE = 40;
    }

    if (typeof window.SCORE_MAP_40 === 'undefined') {
        window.SCORE_MAP_40 = {
            0: 200, 1: 200, 2: 200, 3: 200, 4: 200, 5: 200, 6: 210, 7: 220, 8: 230, 9: 240, 10: 250,
            11: 260, 12: 270, 13: 280, 14: 280, 15: 290, 16: 290, 17: 290, 18: 290, 19: 290, 20: 290,
            21: 290, 22: 300, 23: 300, 24: 310, 25: 310, 26: 320, 27: 320, 28: 330, 29: 330, 30: 340,
            31: 350, 32: 360, 33: 370, 34: 370, 35: 380, 36: 390, 37: 390, 38: 400, 39: 400, 40: 400
        };

        window.SCORE_MAP_30 = {
            0: 200, 1: 200, 2: 200, 3: 200, 4: 210, 5: 220, 6: 230, 7: 240, 8: 250, 9: 260, 10: 270,
            11: 280, 12: 290, 13: 290, 14: 290, 15: 290,
            16: 300, 17: 310, 18: 320, 19: 330, 20: 340, 21: 350, 22: 360, 23: 370, 24: 380, 25: 390,
            26: 400, 27: 400, 28: 400, 29: 400, 30: 400
        };

        window.SCORE_MAP_50 = {
            0: 200, 1: 200, 2: 200, 3: 200, 4: 200, 5: 200, 6: 200, 7: 200, 8: 200, 9: 200, 10: 200,
            11: 200, 12: 200, 13: 200, 14: 200, 15: 210, 16: 220, 17: 230, 18: 240, 19: 250, 20: 260,
            21: 270, 22: 280, 23: 290, 24: 290, 25: 290, 26: 290, 27: 300, 28: 300, 29: 310, 30: 310,
            31: 320, 32: 330, 33: 340, 34: 340, 35: 350, 36: 360, 37: 360, 38: 370, 39: 370,
            40: 380, 41: 380, 42: 380, 43: 390, 44: 390, 45: 400, 46: 400, 47: 400, 48: 400, 49: 400, 50: 400
        };
    }
})();

// Calculate OAT score from correct answers using proper scoring maps
function calculateOATScore(correct, totalQuestions, subject) {
    if (correct < 0) return 200;
    if (correct > totalQuestions) correct = totalQuestions;

    let scoreMap = window.SCORE_MAP_40; // Default for Biology, Physics, Quantitative Reasoning

    // Determine which score map to use based on subject or total questions
    const TOTAL_QUESTIONS_CHEMISTRY = window.TOTAL_QUESTIONS_CHEMISTRY || 30;
    const TOTAL_QUESTIONS_READING = window.TOTAL_QUESTIONS_READING || 50;

    if (subject === 'General Chemistry' || subject === 'Organic Chemistry' || totalQuestions === TOTAL_QUESTIONS_CHEMISTRY) {
        scoreMap = window.SCORE_MAP_30;
    } else if (subject === 'Reading Comprehension' || totalQuestions === TOTAL_QUESTIONS_READING) {
        scoreMap = window.SCORE_MAP_50;
    }

    return scoreMap[correct] || 200;
}

// ============================================================================
// COMPREHENSIVE STATE PERSISTENCE SYSTEM
// ============================================================================
// STORAGE_KEY: Unique key for each exam component
// Format: opto_exam_state_{subject}_test_{testIndex}
function getTestStateStorageKey(subject, testIndex) {
    if (!subject || testIndex === null || testIndex === undefined) {
        console.warn('Invalid parameters for getTestStateStorageKey:', { subject, testIndex });
        return null;
    }
    // Normalize subject name to handle spaces and special characters
    const normalizedSubject = String(subject).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    return `opto_exam_state_${normalizedSubject}_test_${testIndex}`;
}

// AUTO-SAVE: Saves complete exam state to localStorage
// This function is called automatically after every state change
// It saves ALL relevant state regardless of progress level
function saveFullExamState() {
    try {
        // Don't save if test is not active
        if (!currentSubject || currentTestIndex === null || currentTestIndex === undefined) {
            return;
        }

        const storageKey = getTestStateStorageKey(currentSubject, currentTestIndex);
        if (!storageKey) {
            console.warn('Cannot save: invalid storage key');
            return;
        }

        if (!examSubmitted) {
            // Ensure incomplete attempts never persist to storage
            localStorage.removeItem(storageKey);
            try {
                const legacyKey = getTestStateKey(currentSubject, currentTestIndex);
                if (legacyKey) {
                    localStorage.removeItem(legacyKey);
                }
            } catch (legacyErr) {
                // Ignore legacy key errors
            }
            return;
        }

        // Save ALL state - even if empty or partial
        // This ensures we can restore preview states, empty states, etc.
        const state = {
            // Core test state (always save, even if empty)
            currentQuestionIndex: currentQuestionIndex !== undefined ? currentQuestionIndex : 0,
            userAnswers: userAnswers ? { ...userAnswers } : {},
            markedQuestions: markedQuestions ? { ...markedQuestions } : {},

            // View mode tracking (save current view: 'intro', 'test', 'review', 'results', or null)
            viewMode: currentViewMode !== undefined ? currentViewMode : null,
            detailedReviewQuestionIndex: detailedReviewQuestionIndex !== undefined ? detailedReviewQuestionIndex : 0,

            // Time tracking (save even if null/undefined)
            timeRemaining: timeRemaining !== undefined ? timeRemaining : null,
            testStartTime: testStartTime !== undefined ? testStartTime : null,
            questionTimeSpent: questionTimeSpent ? { ...questionTimeSpent } : {},
            questionStartTime: questionStartTime ? { ...questionStartTime } : {},

            // Exam settings (save current settings)
            prometricDelay: prometricDelay !== undefined ? Boolean(prometricDelay) : false,
            timeAccommodations: timeAccommodations !== undefined ? Boolean(timeAccommodations) : false,

            // UI state (save highlights even if empty)
            highlights: highlights ? { ...highlights } : {},
            passageHighlights: passageHighlights ? { ...passageHighlights } : {},
            highlightCounter: highlightCounter !== undefined ? highlightCounter : 0,

            // Metadata
            timestamp: Date.now(),
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(storageKey, JSON.stringify(state));
        console.log('💾 Auto-saved exam state:', storageKey, {
            questionIndex: state.currentQuestionIndex,
            answers: Object.keys(state.userAnswers).length,
            marked: Object.keys(state.markedQuestions).length,
            timeRemaining: state.timeRemaining,
            viewMode: state.viewMode
        });
    } catch (e) {
        console.error('Failed to save full exam state:', e);
    }
}

// LOAD STATE ON MOUNT: Loads complete exam state from localStorage
// Returns null if no saved state exists (for fresh start)
// Returns state object if saved state exists (for resume)
// Handles partial, empty, or corrupted states gracefully
function loadFullExamState(subject, testIndex) {
    try {
        if (!subject || testIndex === null || testIndex === undefined) {
            return null;
        }

        const storageKey = getTestStateStorageKey(subject, testIndex);
        if (!storageKey) {
            return null;
        }

        const saved = localStorage.getItem(storageKey);

        if (!saved) {
            // No saved state - this is a fresh start
            console.log('📥 No saved state found for:', storageKey);
            return null;
        }

        // Parse saved state - handle corrupted JSON gracefully
        let state;
        try {
            state = JSON.parse(saved);
        } catch (parseError) {
            console.error('Failed to parse saved state (corrupted):', parseError);
            // Clear corrupted state
            localStorage.removeItem(storageKey);
            return null;
        }

        // Validate state structure - ensure it has at least basic structure
        if (typeof state !== 'object' || state === null) {
            console.warn('Invalid state structure, clearing:', storageKey);
            localStorage.removeItem(storageKey);
            return null;
        }

        // Normalize state - ensure all expected fields exist with defaults
        const normalizedState = {
            // Core test state (with defaults for missing fields)
            currentQuestionIndex: typeof state.currentQuestionIndex === 'number' ? state.currentQuestionIndex : 0,
            userAnswers: state.userAnswers && typeof state.userAnswers === 'object' ? state.userAnswers : {},
            markedQuestions: state.markedQuestions && typeof state.markedQuestions === 'object' ? state.markedQuestions : {},

            // View mode (can be null for intro)
            viewMode: state.viewMode !== undefined ? state.viewMode : null,
            detailedReviewQuestionIndex: typeof state.detailedReviewQuestionIndex === 'number' ? state.detailedReviewQuestionIndex : 0,

            // Time tracking (can be null)
            timeRemaining: state.timeRemaining !== undefined ? state.timeRemaining : null,
            testStartTime: state.testStartTime !== undefined ? state.testStartTime : null,
            questionTimeSpent: state.questionTimeSpent && typeof state.questionTimeSpent === 'object' ? state.questionTimeSpent : {},
            questionStartTime: state.questionStartTime && typeof state.questionStartTime === 'object' ? state.questionStartTime : {},

            // Exam settings (with defaults)
            prometricDelay: state.prometricDelay !== undefined ? Boolean(state.prometricDelay) : false,
            timeAccommodations: state.timeAccommodations !== undefined ? Boolean(state.timeAccommodations) : false,

            // UI state (with defaults)
            highlights: state.highlights && typeof state.highlights === 'object' ? state.highlights : {},
            passageHighlights: state.passageHighlights && typeof state.passageHighlights === 'object' ? state.passageHighlights : {},
            highlightCounter: typeof state.highlightCounter === 'number' ? state.highlightCounter : 0,

            // Metadata
            timestamp: state.timestamp || Date.now(),
            savedAt: state.savedAt || new Date().toISOString()
        };

        console.log('📥 Loaded exam state:', storageKey, {
            questionIndex: normalizedState.currentQuestionIndex,
            answers: Object.keys(normalizedState.userAnswers).length,
            marked: Object.keys(normalizedState.markedQuestions).length,
            timeRemaining: normalizedState.timeRemaining,
            viewMode: normalizedState.viewMode
        });

        return normalizedState;
    } catch (e) {
        console.error('Failed to load full exam state:', e);
        return null;
    }
}

// Applies loaded state to current variables
// Handles partial states - applies only what exists, uses defaults for missing fields
function applyLoadedExamState(loadedState) {
    if (!loadedState) return false;

    try {
        // Core test state (always apply, even if empty)
        currentQuestionIndex = typeof loadedState.currentQuestionIndex === 'number' ? loadedState.currentQuestionIndex : 0;
        userAnswers = loadedState.userAnswers && typeof loadedState.userAnswers === 'object' ? { ...loadedState.userAnswers } : {};
        markedQuestions = loadedState.markedQuestions && typeof loadedState.markedQuestions === 'object' ? { ...loadedState.markedQuestions } : {};

        // View mode (can be null for intro view)
        currentViewMode = loadedState.viewMode !== undefined ? loadedState.viewMode : null;
        detailedReviewQuestionIndex = typeof loadedState.detailedReviewQuestionIndex === 'number' ? loadedState.detailedReviewQuestionIndex : 0;

        // Time tracking (handle null/undefined gracefully)
        timeRemaining = loadedState.timeRemaining !== undefined && loadedState.timeRemaining !== null ? loadedState.timeRemaining : null;
        testStartTime = loadedState.testStartTime !== undefined && loadedState.testStartTime !== null ? loadedState.testStartTime : null;

        // Adjust time remaining if test was in progress
        if (testStartTime && timeRemaining !== null && loadedState.timestamp) {
            const savedTimestamp = loadedState.timestamp;
            const secondsElapsed = Math.floor((Date.now() - savedTimestamp) / 1000);
            timeRemaining = Math.max(0, timeRemaining - secondsElapsed);
        }

        questionTimeSpent = loadedState.questionTimeSpent && typeof loadedState.questionTimeSpent === 'object' ? { ...loadedState.questionTimeSpent } : {};
        questionStartTime = loadedState.questionStartTime && typeof loadedState.questionStartTime === 'object' ? { ...loadedState.questionStartTime } : {};

        // Exam settings (apply with defaults)
        prometricDelay = loadedState.prometricDelay !== undefined ? Boolean(loadedState.prometricDelay) : false;
        timeAccommodations = loadedState.timeAccommodations !== undefined ? Boolean(loadedState.timeAccommodations) : false;

        // UI state (apply with defaults)
        highlights = loadedState.highlights && typeof loadedState.highlights === 'object' ? { ...loadedState.highlights } : {};
        passageHighlights = loadedState.passageHighlights && typeof loadedState.passageHighlights === 'object' ? { ...loadedState.passageHighlights } : {};
        highlightCounter = typeof loadedState.highlightCounter === 'number' ? loadedState.highlightCounter : 0;

        console.log('✅ Exam state applied:', {
            questionIndex: currentQuestionIndex,
            answers: Object.keys(userAnswers).length,
            marked: Object.keys(markedQuestions).length,
            timeRemaining: timeRemaining,
            viewMode: currentViewMode
        });

        return true;
    } catch (e) {
        console.error('Failed to apply loaded exam state:', e);
        return false;
    }
}

// RESET: Clears all exam state from localStorage
// This is called by the reset button to clear saved state
function clearFullExamState(subject, testIndex) {
    try {
        if (!subject || testIndex === null || testIndex === undefined) {
            console.warn('Invalid parameters for clearFullExamState:', { subject, testIndex });
            return;
        }

        const storageKey = getTestStateStorageKey(subject, testIndex);
        if (storageKey) {
            localStorage.removeItem(storageKey);
            console.log('🗑️ Cleared exam state from localStorage:', storageKey);
        }

        // Also clear legacy state keys for backwards compatibility
        try {
            const legacyKey = getTestStateKey(subject, testIndex);
            if (legacyKey) {
                localStorage.removeItem(legacyKey);
            }
        } catch (e) {
            // Ignore legacy key errors
        }

        // Clear any highlight-related keys
        try {
            const highlightKeys = [
                `highlights-${subject}-${testIndex}`,
                `passageHighlights-${subject}-${testIndex}`
            ];
            highlightKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    // Ignore individual key errors
                }
            });
        } catch (e) {
            // Ignore highlight key errors
        }

    } catch (e) {
        console.error('Failed to clear full exam state:', e);
    }
}

function loadCompletedTestState(subject, index) {
    try {
        const key = `completed-test-${subject}-${index}`;
        const stored = localStorage.getItem(key);
        if (!stored) {
            return false;
        }
        const data = JSON.parse(stored);
        userAnswers = data.userAnswers || {};
        markedQuestions = data.markedQuestions || {};
        highlights = data.highlights || {};
        passageHighlights = data.passageHighlights || {};
        questionTimeSpent = data.questionTimeSpent || {};
        questionStartTime = {};
        currentQuestionIndex = 0;
        return true;
    } catch (error) {
        console.error('Failed to load completed test state:', error);
        return false;
    }
}

// Reset ALL exams for ALL subjects - clears all user state, preserves exam configuration
// This function clears:
// - All test attempts, scores, and progress
// - All saved answers and marked questions
// - All saved view modes and timers
// - All highlights and tagged questions
// - All in-progress exam state
// It preserves:
// - Exam settings (duration, max attempts, titles, scoring logic)
// - Dark mode preference
// - Other user preferences not related to test state
function resetAllExams() {
    const confirmed = window.confirm('⚠️ WARNING: This will reset ALL test attempts, scores, and progress for ALL subjects and ALL tests. This cannot be undone. Are you sure?');
    if (!confirmed) {
        return false;
    }

    try {
        console.log('🗑️ Starting full reset of all exam user state...');

        // Stop any active test timer
        if (testTimer) {
            try {
                clearInterval(testTimer);
                testTimer = null;
            } catch (timerError) {
                console.warn('Error clearing timer during reset:', timerError);
            }
        }

        // Reset all in-memory state variables to defaults
        currentSubject = null;
        currentTestIndex = null;
        currentQuestionIndex = 0;
        userAnswers = {};
        markedQuestions = {};
        timeRemaining = null;
        testStartTime = null;
        questionStartTime = {};
        questionTimeSpent = {};
        currentViewMode = null;
        detailedReviewQuestionIndex = 0;
        highlights = {};
        passageHighlights = {};
        highlightCounter = 0;
        lastResultRecord = null;
        lastAttemptList = [];
        lastQuestionCount = 0;
        prometricDelay = false;
        timeAccommodations = false;

        // Get all localStorage keys first (before any operations)
        let allKeys = [];
        try {
            allKeys = Object.keys(localStorage);
        } catch (e) {
            console.error('Error reading localStorage keys:', e);
            alert('Error accessing localStorage. Please refresh the page and try again.');
            return false;
        }

        // Define all prefixes that indicate test-related user state
        // IMPORTANT: Only clear user state, NOT exam configuration
        const userStatePrefixes = [
            'opto-test-history',           // Test attempt history
            'opto_exam_state_',            // In-progress exam state
            'test_',                       // Legacy test state
            'completed-test-',             // Completed test results
            'completed-tests-list',        // List of completed tests
            'highlights-',                 // User highlights
            'passageHighlights-',          // Passage highlights
            'tagged-',                     // Tagged questions (legacy format)
            'strikethrough-'               // Strikethrough markings
        ];

        // Also clear specific keys that don't use prefixes
        const specificKeysToClear = [
            'tagged_questions'             // Tagged questions (current format)
        ];

        let clearedCount = 0;

        // Clear all keys that match user state prefixes
        // This clears user data but preserves exam configuration
        for (const key of allKeys) {
            try {
                // Check if this key should be cleared (user state, not config)
                let shouldClear = false;

                // Check prefixes
                for (const prefix of userStatePrefixes) {
                    if (key.startsWith(prefix)) {
                        shouldClear = true;
                        break;
                    }
                }

                // Check specific keys
                if (!shouldClear) {
                    for (const specificKey of specificKeysToClear) {
                        if (key === specificKey) {
                            shouldClear = true;
                            break;
                        }
                    }
                }

                if (shouldClear) {
                    localStorage.removeItem(key);
                    clearedCount++;
                }
            } catch (e) {
                // Continue even if one key fails
                console.warn(`Could not remove key ${key}:`, e);
            }
        }

        console.log(`✅ Cleared ${clearedCount} user state entries from localStorage`);
        console.log('✅ All in-memory state reset to defaults');
        console.log('✅ Exam configuration preserved (max attempts, duration, etc.)');

        // Set a flag to prevent React initialization errors during reload
        try {
            sessionStorage.setItem('reset-in-progress', 'true');
        } catch (e) {
            // Ignore if sessionStorage is not available
        }

        // Reload immediately - don't wait, don't interact with React
        // After reload, all tests will show as "Not Started" because attempt history is cleared
        window.location.href = window.location.href;

        return true;
    } catch (error) {
        console.error('Error during reset:', error);
        // Try to reload anyway
        try {
            window.location.reload();
        } catch (reloadError) {
            alert('Reset completed but page could not reload automatically. Please refresh the page manually (F5).');
        }
        return false;
    }
}

// RESET BUTTON LOGIC: Performs a REAL reset
// IMPORTANT: This function ONLY clears localStorage and resets in-memory state
// It does NOT manipulate the DOM - React handles re-rendering based on state changes
// Steps:
// 1. Clears localStorage for that exam
// 2. Clears InstantDB state if available
// 3. Reinitializes all in-memory state to default values
// 4. Timer goes back to null/default
// 5. Returns to intro view (via showView, which is state-based navigation)
// 6. Saves empty state to prevent auto-restore after reload
// 7. Reset persists after page reload
function performTestReset(subject, index) {
    try {
        // Validate inputs
        if (!subject || index === null || index === undefined) {
            console.error('Invalid parameters for performTestReset:', { subject, index });
            return false;
        }

        console.log('🔄 Starting REAL reset for:', subject, 'Test', index);

        // Step 1: Stop any active test timer (no DOM manipulation, just clear interval)
        if (testTimer) {
            try {
                clearInterval(testTimer);
                testTimer = null;
            } catch (timerError) {
                console.warn('Error clearing timer during reset:', timerError);
            }
        }

        // Step 2: Clear localStorage for this exam (comprehensive)
        // NO DOM manipulation - just localStorage operations
        try {
            clearFullExamState(subject, index);
        } catch (e) {
            console.warn('Error clearing full exam state:', e);
        }

        // Clear legacy state keys
        try {
            clearTestState(subject, index);
        } catch (e) {
            console.warn('Error clearing legacy test state:', e);
        }

        // Clear completed test data
        try {
            const completedKey = `completed-test-${subject}-${index}`;
            localStorage.removeItem(completedKey);
            console.log('🗑️ Cleared completed test key:', completedKey);
        } catch (e) {
            console.warn('Error removing completed test key:', e);
        }

        // Clear test attempts
        try {
            resetTestAttempts(subject, index);
        } catch (e) {
            console.warn('Error in resetTestAttempts:', e);
        }

        // Clear completed tests list entry
        try {
            const listKey = 'completed-tests-list';
            const listRaw = localStorage.getItem(listKey);
            if (listRaw) {
                const parsed = JSON.parse(listRaw);
                if (Array.isArray(parsed)) {
                    const updated = parsed.filter(entry => !(entry.subject === subject && entry.testIndex === index));
                    localStorage.setItem(listKey, JSON.stringify(updated));
                    console.log('🗑️ Removed from completed tests list');
                }
            }
        } catch (e) {
            console.warn('Error updating completed tests list:', e);
        }

        // Clear InstantDB state if available (for authenticated users)
        try {
            if (window.InstantDB && typeof window.InstantDB.clearTestState === 'function') {
                window.InstantDB.clearTestState(subject, index);
                console.log('🗑️ Cleared InstantDB state');
            }
        } catch (e) {
            console.warn('Error clearing InstantDB state:', e);
        }

        // Clear any additional localStorage keys that might exist
        try {
            const additionalKeys = [
                `test_${subject}_${index}`, // Legacy format
                `highlights-${subject}-${index}`,
                `passageHighlights-${subject}-${index}`,
                `test_state_${subject}_${index}`, // Session storage key format
            ];
            additionalKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                } catch (e) {
                    // Ignore individual key errors
                }
            });
        } catch (e) {
            console.warn('Error clearing additional keys:', e);
        }

        // Step 3: Set reset flag so reload doesn't restore state
        // This flag persists in localStorage and is checked on next load
        try {
            const resetFlagKey = getNamespacedStorageKey(`exam-reset-flag-${subject}-${index}`);
            localStorage.setItem(resetFlagKey, 'true');
            console.log('🚩 Set reset flag to prevent state restoration after reload');
        } catch (e) {
            console.warn('Error setting reset flag:', e);
        }

        // Step 4: Reset in-memory state to defaults (ALWAYS, even if not current test)
        // This ensures state is clean if user switches to this test later
        // NO DOM manipulation - just state variable assignments
        if (currentSubject === subject && currentTestIndex === index) {
            // Reset ALL state variables to defaults
            currentQuestionIndex = 0;
            userAnswers = {};
            markedQuestions = {};
            timeRemaining = null; // Reset to null, not 1800 (will be set when test starts)
            testStartTime = null;
            questionStartTime = {};
            questionTimeSpent = {};
            currentViewMode = null; // Reset to null for intro view
            detailedReviewQuestionIndex = 0;
            highlights = {};
            passageHighlights = {};
            highlightCounter = 0;
            prometricDelay = false;
            timeAccommodations = false;

            console.log('✅ In-memory state reset to defaults');

            // Step 5: Ensure state is completely cleared (double-check)
            // This prevents any auto-save from restoring old state immediately
            try {
                const storageKey = getTestStateStorageKey(subject, index);
                if (storageKey) {
                    // Remove any remaining state to ensure clean reset
                    localStorage.removeItem(storageKey);
                }
            } catch (e) {
                console.warn('Error ensuring state is cleared:', e);
            }

            // Step 6: Return to intro view (state-based navigation, no DOM manipulation)
            // Only if this is the currently active test
            // showView just changes which view is displayed - it doesn't manipulate DOM nodes
            try {
                if (typeof showView === 'function') {
                    showView('pre-test-instructions-view');
                }
            } catch (e) {
                console.warn('Error navigating to intro view:', e);
            }
        } else {
            // Even if not current test, ensure state is completely cleared
            try {
                const storageKey = getTestStateStorageKey(subject, index);
                if (storageKey) {
                    // Remove any remaining state to ensure clean reset
                    localStorage.removeItem(storageKey);
                    console.log('🗑️ Ensured state cleared for non-active test');
                }
            } catch (e) {
                console.warn('Error ensuring state is cleared:', e);
            }
        }

        console.log('✅ REAL reset complete for:', subject, 'Test', index);
        console.log('✅ Reset will persist after page reload');
        return true;
    } catch (error) {
        console.error('Failed to reset test:', error);
        return false;
    }
}

// Global error handler to catch and suppress React removeChild errors
// This must be set up early, before React components are initialized
(function setupReactErrorSuppression() {
    // Handle synchronous errors
    window.addEventListener('error', function (event) {
        // Check if this is a NotFoundError related to removeChild
        // Match the exact error: "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
        const errorMsg = (event.error && event.error.message) || event.message || '';
        const errorName = (event.error && event.error.name) || '';

        const isNotFoundError = (
            errorName === 'NotFoundError' ||
            (event.error && event.error.constructor && event.error.constructor.name === 'NotFoundError') ||
            errorMsg.includes('NotFoundError')
        );

        // Check if this is a removeChild error - match various patterns
        const isRemoveChildError = (
            errorMsg.includes('removeChild') ||
            errorMsg.includes('Failed to execute \'removeChild\'') ||
            errorMsg.includes('Failed to execute "removeChild"') ||
            errorMsg.includes('not a child') ||
            errorMsg.includes('node to be removed is not a child')
        );

        // Suppress NotFoundError or removeChild errors - these are harmless React cleanup issues
        if (isNotFoundError || isRemoveChildError) {
            // Don't log to console at all - silently suppress
            event.preventDefault(); // Prevent error from being logged to console
            event.stopPropagation(); // Stop error from propagating
            event.stopImmediatePropagation(); // Stop all event handlers
            return true; // Indicate error was handled
        }

        return false; // Let other errors through
    }, true); // Use capture phase

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function (event) {
        if (event.reason) {
            const reason = event.reason;
            const isNotFoundError = (
                reason.name === 'NotFoundError' ||
                reason.constructor.name === 'NotFoundError' ||
                (reason.message && reason.message.includes('NotFoundError'))
            );
            const isRemoveChildError = reason.message && (
                reason.message.includes('removeChild') ||
                reason.message.includes('Failed to execute \'removeChild\'')
            );

            if (isNotFoundError || isRemoveChildError) {
                const errorMsg = reason.message || 'Unknown rejection';
                console.warn('Suppressed React cleanup promise rejection (harmless):', errorMsg);
                event.preventDefault(); // Prevent rejection from being logged
                return true;
            }
        }
        return false;
    });
})();

(function setupGlobalErrorReporter() {
    function ensureErrorBanner() {
        let banner = document.getElementById('app-error-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'app-error-banner';
            banner.style.position = 'fixed';
            banner.style.top = '0';
            banner.style.left = '0';
            banner.style.right = '0';
            banner.style.zIndex = '9999';
            banner.style.background = '#b91c1c';
            banner.style.color = '#fff';
            banner.style.padding = '12px 16px';
            banner.style.fontFamily = 'Arial, sans-serif';
            banner.style.fontSize = '14px';
            banner.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
            banner.style.display = 'none';

            const attach = () => {
                if (!document.body) {
                    setTimeout(attach, 50);
                    return;
                }
                if (!document.body.contains(banner)) {
                    document.body.appendChild(banner);
                }
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', attach);
            } else {
                attach();
            }
        }
        return banner;
    }

    function reportError(message) {
        const banner = ensureErrorBanner();
        const text = typeof message === 'string' ? message : (message && message.message) ? message.message : 'Unknown error';
        const timestamp = new Date().toLocaleTimeString();
        banner.textContent = `[${timestamp}] ${text}`;
        banner.style.display = 'block';
    }

    window.addEventListener('error', (event) => {
        const { message, error } = event;

        // Ignore generic "Script error" messages (cross-origin errors)
        if (message === 'Script error.' || message === 'Script error') {
            console.log('Ignoring cross-origin script error (harmless)');
            return;
        }

        if (error && error.stack) {
            console.error('Unhandled error:', error);
        }
        reportError(message || error || 'Unhandled error');
    });

    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason;
        if (reason && reason.stack) {
            console.error('Unhandled rejection:', reason);
        }
        reportError(reason || 'Unhandled promise rejection');
    });
})();

const SUBJECT_COLORS = {
    default: '#0e5c84'
};

const SUBJECT_ACCENT_MAP = {
    'Biology': '#4F46E5',
    'General Chemistry': '#2563EB',
    'Organic Chemistry': '#EA580C',
    'Reading Comprehension': '#1B4332',
    'Physics': '#9333EA',
    'Quantitative Reasoning': '#DC2626'
};

function setSubjectColor(color) {
    // Theme colors are fixed to Bootcamp blue; no-op retained for compatibility
    return color || SUBJECT_COLORS.default;
}

function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(51, 65, 85, ${alpha})`;
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) return `rgba(51, 65, 85, ${alpha})`;
    const bigint = parseInt(normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getSubjectAccent(subject) {
    return SUBJECT_ACCENT_MAP[subject] || '#334155';
}

function loadTestHistory() {
    try {
        const raw = localStorage.getItem(getNamespacedStorageKey(TEST_HISTORY_STORAGE_KEY_BASE));
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        console.error('Failed to load test history:', error);
        return {};
    }
}

function saveTestHistory(history) {
    try {
        localStorage.setItem(getNamespacedStorageKey(TEST_HISTORY_STORAGE_KEY_BASE), JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save test history:', error);
    }
}

function getTestHistoryKey(subject, index) {
    return `${subject || 'unknown'}::${index ?? '0'}`;
}

function getTestAttempts(subject, index) {
    const history = loadTestHistory();
    const key = getTestHistoryKey(subject, index);
    const attempts = history[key];
    return Array.isArray(attempts) ? attempts : [];
}

function recordTestAttempt(attempt) {
    const history = loadTestHistory();
    const key = getTestHistoryKey(attempt.subject, attempt.testIndex);
    const existing = Array.isArray(history[key]) ? history[key] : [];
    existing.push(attempt);
    history[key] = existing;
    saveTestHistory(history);
    return existing;
}

function resetTestAttempts(subject, index) {
    const history = loadTestHistory();
    const key = getTestHistoryKey(subject, index);
    if (history[key]) {
        delete history[key];
        saveTestHistory(history);
    }
}

function getScaledScore(scorePercent) {
    const percent = isNaN(scorePercent) ? 0 : Math.max(0, Math.min(100, scorePercent));
    return 200 + Math.round((percent / 100) * 200);
}

function formatResultDate(dateIso) {
    if (!dateIso) return '--';
    try {
        const date = new Date(dateIso);
        if (Number.isNaN(date.getTime())) return '--';
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    } catch (error) {
        console.warn('Unable to format result date:', error);
        return '--';
    }
}

function formatTimeDisplay(totalSeconds) {
    if (totalSeconds === undefined || totalSeconds === null || Number.isNaN(totalSeconds)) {
        return '--';
    }
    const seconds = Math.max(0, Math.round(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    if (minutes === 0) {
        return `${remaining}s`;
    }
    return `${minutes}m ${remaining}s`;
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get highlight key for current question
function getHighlightKey() {
    return `${currentSubject}-${currentTestIndex}-${currentQuestionIndex}`;
}

// Expose core exam helpers to window
if (typeof window !== 'undefined') {
    window.prevQuestion = prevQuestion;
    window.nextQuestion = nextQuestion;
    window.startTest = startTest;
    window.showReviewView = showReviewView;
    window.showExhibit = showExhibit;
    window.hideCalculator = hideCalculator;
    window.toggleMark = toggleMark;
    window.jumpToQuestion = jumpToQuestion;
    window.applyExamButtonTheme = applyExamButtonTheme;
}

// Setup highlighting listeners
function setupHighlightListeners() {
    const contentArea = document.getElementById('test-content-area');
    const passageText = document.getElementById('test-passage-text');
    const choiceLabels = document.querySelectorAll('.choice-label');

    // Remove existing listeners
    if (contentArea) {
        contentArea.removeEventListener('mouseup', handleTextSelection);
    }
    if (passageText) {
        passageText.removeEventListener('mouseup', handleTextSelection);
    }
    choiceLabels.forEach(label => {
        label.removeEventListener('mouseup', handleTextSelection);
    });
    document.removeEventListener('mousedown', handleClickOutside);

    // Add new listeners
    if (contentArea) {
        contentArea.addEventListener('mouseup', handleTextSelection);
    }
    if (passageText) {
        passageText.addEventListener('mouseup', handleTextSelection);
    }
    choiceLabels.forEach(label => {
        label.addEventListener('mouseup', handleTextSelection);
    });
    document.addEventListener('mousedown', handleClickOutside);
}

// Handle text selection: show floating highlight button next to selection
function handleTextSelection(e) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
        showHighlightButton = false;
        removeHighlightButton();
        return;
    }

    const range = selection.getRangeAt(0);
    const contentArea = document.getElementById('test-content-area');
    const passageText = document.getElementById('test-passage-text');
    const choiceLabels = document.querySelectorAll('.choice-label');

    // Check if selection is within content area, passage area, or choice labels
    const isInContent = contentArea && contentArea.contains(range.commonAncestorContainer);
    const isInPassage = passageText && passageText.contains(range.commonAncestorContainer);

    // If in passage and Reading Comprehension, ignore (let new system handle it)
    if (isInPassage && currentSubject === 'Reading Comprehension' && window.PassageHighlightSystem) {
        return;
    }
    let isInChoice = false;
    choiceLabels.forEach(label => {
        if (label.contains(range.commonAncestorContainer)) {
            isInChoice = true;
        }
    });

    if (!isInContent && !isInPassage && !isInChoice) {
        showHighlightButton = false;
        removeHighlightButton();
        return;
    }

    // Position floating highlight button to the right of the selection
    const rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) {
        showHighlightButton = false;
        removeHighlightButton();
        return;
    }

    const viewportPadding = 8;
    const buttonOffsetX = 8;
    const buttonOffsetY = -4;

    let x = rect.right + buttonOffsetX;
    let y = rect.top + buttonOffsetY;

    // Keep button inside viewport horizontally
    const maxX = (window.innerWidth || document.documentElement.clientWidth) - 36;
    if (x > maxX) x = maxX;
    if (x < viewportPadding) x = viewportPadding;

    // And vertically
    const maxY = (window.innerHeight || document.documentElement.clientHeight) - 36;
    if (y > maxY) y = maxY;
    if (y < viewportPadding) y = viewportPadding;

    highlightButtonPosition.x = x;
    highlightButtonPosition.y = y;
    showHighlightButton = true;
    showHighlightButtonUI();
}

// Show highlight button UI
function showHighlightButtonUI() {
    removeHighlightButton();

    const button = document.createElement('button');
    button.id = 'highlight-action-btn';
    // Transparent overlay wrapper positioned next to the selection.
    // No visible box, background, border, or padding – only the icon image.
    button.className = '';
    button.style.cssText = `
        position: fixed;
        left: ${highlightButtonPosition.x}px;
        top: ${highlightButtonPosition.y}px;
        z-index: 9999;
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        outline: none;
        box-shadow: none;
        display: block;
        cursor: pointer;
    `;
    button.title = 'Highlight selected text';

    // Use uploaded highlight icon as the skin if configured; otherwise fall back to default SVG
    try {
        const config = getStoredExamButtonConfig();
        const highlightConfig = (config && config.highlight) || {};

        if (highlightConfig.useCustom && highlightConfig.image && highlightConfig.useImage !== false) {
            const img = document.createElement('img');
            img.src = highlightConfig.image;
            img.alt = 'Highlight';
            img.style.maxWidth = '20px';
            img.style.maxHeight = '20px';
            img.style.objectFit = 'contain';
            img.draggable = false;
            img.addEventListener('dragstart', (ev) => ev.preventDefault());
            button.appendChild(img);
        } else {
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2" y="18" width="20" height="4" fill="#ffff66" stroke="#cccc00" stroke-width="1"/>
                    <path d="M14.5 2.8l6.7 6.7-9.9 9.9H5v-6.3l9.5-10.3z" fill="#ffd700" stroke="#cc9900" stroke-width="1"/>
                    <path d="M5 20h6.8" stroke="#999900" stroke-width="1.2"/>
                </svg>
            `;
        }
    } catch (err) {
        console.error('Failed to apply highlight icon theme:', err);
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="18" width="20" height="4" fill="#ffff66" stroke="#cccc00" stroke-width="1"/>
                <path d="M14.5 2.8l6.7 6.7-9.9 9.9H5v-6.3l9.5-10.3z" fill="#ffd700" stroke="#cc9900" stroke-width="1"/>
                <path d="M5 20h6.8" stroke="#999900" stroke-width="1.2"/>
            </svg>
        `;
    }

    button.onclick = (e) => {
        e.stopPropagation();
        createHighlight();
    };
    document.body.appendChild(button);
}

// Remove highlight button
function removeHighlightButton() {
    const existingBtn = document.getElementById('highlight-action-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
}

// Handle click outside
function handleClickOutside(e) {
    const contentArea = document.getElementById('test-content-area');
    const passageText = document.getElementById('test-passage-text');
    const highlightBtn = document.getElementById('highlight-action-btn');
    const toggleBtn = e.target.closest('.highlight-toggle-btn');

    if (contentArea && contentArea.contains(e.target)) {
        return; // Click is inside content area
    }

    if (passageText && passageText.contains(e.target)) {
        return; // Click is inside passage area
    }

    if (highlightBtn && highlightBtn.contains(e.target)) {
        return; // Click is on highlight button
    }

    // Click is outside, hide button and clear selection
    showHighlightButton = false;
    removeHighlightButton();
    window.getSelection().removeAllRanges();
}

// Create highlight
function createHighlight() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
        removeHighlightButton();
        return;
    }

    const range = selection.getRangeAt(0);
    const contentArea = document.getElementById('test-content-area');
    const passageText = document.getElementById('test-passage-text');
    const choiceLabels = document.querySelectorAll('.choice-label');

    const isInContent = contentArea && contentArea.contains(range.commonAncestorContainer);
    const isInPassage = passageText && passageText.contains(range.commonAncestorContainer);
    let isInChoice = false;
    choiceLabels.forEach(label => {
        if (label.contains(range.commonAncestorContainer)) {
            isInChoice = true;
        }
    });

    if (!isInContent && !isInPassage && !isInChoice) {
        removeHighlightButton();
        return;
    }

    // Create highlight element - directly in yellow
    const highlightId = `highlight-${highlightCounter++}`;
    const mark = document.createElement('mark');
    mark.id = highlightId;
    mark.className = 'text-highlight highlight-yellow';
    mark.style.cssText = `
        background-color: #ffff66;
        color: inherit;
        padding: 0 2px;
        display: inline;
    `;

    try {
        // Extract and wrap selected content
        const contents = range.extractContents();
        mark.appendChild(contents);
        range.insertNode(mark);

        // Normalize to merge adjacent text nodes
        if (mark.parentNode) {
            mark.parentNode.normalize();
        }

        // Add double-click to remove highlight
        mark.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeHighlight(mark, highlightId);
        });

        // Add right-click to cross out (strikethrough) functionality
        mark.setAttribute('data-strikethrough-enabled', 'true');
        mark.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Toggle strikethrough
            if (mark.style.textDecoration.includes('line-through')) {
                mark.style.textDecoration = 'none';
            } else {
                mark.style.textDecoration = 'line-through';
            }

            // Save updated highlight
            saveHighlight(highlightId, mark);

            // If highlight is in passage, save passage HTML
            const passageText = document.getElementById('test-passage-text');
            if (passageText && passageText.contains(mark)) {
                const passageIndex = Math.floor(currentQuestionIndex / 16);
                const passageKey = `${currentSubject}-${currentTestIndex}-passage-${passageIndex}`;
                passageHighlights[passageKey] = passageText.innerHTML;
            }
        });

        // Save highlight (no toggle button needed)
        saveHighlight(highlightId, mark);

        // If highlight is in passage, save passage HTML
        const passageText = document.getElementById('test-passage-text');
        if (passageText && passageText.contains(mark)) {
            const passageIndex = Math.floor(currentQuestionIndex / 16);
            const passageKey = `${currentSubject}-${currentTestIndex}-passage-${passageIndex}`;
            passageHighlights[passageKey] = passageText.innerHTML;
        }

        // Clear selection and hide button
        selection.removeAllRanges();
        removeHighlightButton();
    } catch (err) {
        console.error('Error creating highlight:', err);
    }
}

// Remove highlight properly
function removeHighlight(markElement, highlightId) {
    if (!markElement || !markElement.parentNode) return;

    try {
        // Get the parent node
        const parent = markElement.parentNode;

        // Create a document fragment to hold the text nodes
        const fragment = document.createDocumentFragment();

        // Move all child nodes (text nodes) from the mark to the fragment
        while (markElement.firstChild) {
            fragment.appendChild(markElement.firstChild);
        }

        // Replace the mark element with its text content
        parent.replaceChild(fragment, markElement);

        // Normalize the parent to merge adjacent text nodes
        parent.normalize();

        // Remove from highlights storage
        const key = getHighlightKey();
        if (highlights[key]) {
            highlights[key] = highlights[key].filter(h => h.id !== highlightId);
            if (highlights[key].length === 0) {
                delete highlights[key];
            }
        }

        // If highlight is in passage, save passage HTML
        const passageText = document.getElementById('test-passage-text');
        if (passageText && passageText.contains(parent)) {
            const passageIndex = Math.floor(currentQuestionIndex / 16);
            const passageKey = `${currentSubject}-${currentTestIndex}-passage-${passageIndex}`;
            passageHighlights[passageKey] = passageText.innerHTML;
        }
    } catch (err) {
        console.error('Error removing highlight:', err);
    }
}

// Toggle button functionality removed - highlights are now directly yellow

// Save highlight
function saveHighlight(highlightId, markElement) {
    const key = getHighlightKey();
    if (!highlights[key]) {
        highlights[key] = [];
    }

    // Get text content and position info
    const text = markElement.textContent;

    highlights[key].push({
        id: highlightId,
        text: text,
        color: 'yellow', // Always yellow now
        html: markElement.outerHTML
    });
}

// Clear all highlights and strikethroughs (when leaving exam without completing)
function clearHighlightsAndStrikethroughs() {
    // Clear in-memory highlights
    highlights = {};
    passageHighlights = {};
    highlightCounter = 0;

    // Clear localStorage strikethroughs for current test
    if (currentSubject && currentTestIndex !== null) {
        const test = allTestData[currentSubject] && allTestData[currentSubject][currentTestIndex];
        if (test) {
            test.forEach((q, i) => {
                q.c.forEach((choice, j) => {
                    const choiceKey = `${currentSubject}-${currentTestIndex}-${i}-${j}`;
                    localStorage.removeItem(`strikethrough-${choiceKey}`);
                });
            });
        }
    }

    // Clear localStorage highlights for current test (only if not completed)
    if (currentSubject && currentTestIndex !== null) {
        const test = allTestData[currentSubject] && allTestData[currentSubject][currentTestIndex];
        if (test) {
            test.forEach((q, i) => {
                const key = `${currentSubject}-${currentTestIndex}-${i}`;
                localStorage.removeItem(`highlights-${key}`);
                const passageIndex = Math.floor(i / 16);
                localStorage.removeItem(`passageHighlights-${currentSubject}-${currentTestIndex}-passage-${passageIndex}`);
            });
        }
    }
}

// Save highlights to localStorage (only when test is completed)
function saveHighlightsToLocalStorage() {
    if (!currentSubject || currentTestIndex === null) return;

    try {
        // Save highlights
        Object.keys(highlights).forEach(key => {
            localStorage.setItem(`highlights-${key}`, JSON.stringify(highlights[key]));
        });

        // Save passage highlights
        Object.keys(passageHighlights).forEach(key => {
            localStorage.setItem(`passageHighlights-${key}`, passageHighlights[key]);
        });
    } catch (e) {
        console.error('Failed to save highlights to localStorage:', e);
    }
}

// Load highlights from localStorage (only for completed tests)
function loadHighlightsFromLocalStorage() {
    if (!currentSubject || currentTestIndex === null) return;

    try {
        const test = allTestData[currentSubject] && allTestData[currentSubject][currentTestIndex];
        if (!test) return;

        // Load highlights
        test.forEach((q, i) => {
            const key = `${currentSubject}-${currentTestIndex}-${i}`;
            const saved = localStorage.getItem(`highlights-${key}`);
            if (saved) {
                highlights[key] = JSON.parse(saved);
            }
        });

        // Load passage highlights
        test.forEach((q, i) => {
            const passageIndex = Math.floor(i / 16);
            const passageKey = `${currentSubject}-${currentTestIndex}-passage-${passageIndex}`;
            const saved = localStorage.getItem(`passageHighlights-${passageKey}`);
            if (saved) {
                passageHighlights[passageKey] = saved;
            }
        });
    } catch (e) {
        console.error('Failed to load highlights from localStorage:', e);
    }
}

// Re-attach highlight toggle buttons - no longer needed, highlights are just yellow
// But we need to re-attach right-click strikethrough functionality
function reattachHighlightButtons(container) {
    if (!container) return;

    // Find all highlight marks in the container
    const marks = container.querySelectorAll('mark.text-highlight');
    marks.forEach(mark => {
        const highlightId = mark.id;
        if (!highlightId) return;

        // Only add listener if not already added (check data attribute)
        if (mark.getAttribute('data-strikethrough-enabled') !== 'true') {
            mark.setAttribute('data-strikethrough-enabled', 'true');

            // Add double-click to remove highlight
            mark.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeHighlight(mark, highlightId);
            });

            // Add right-click to cross out (strikethrough) functionality
            mark.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Toggle strikethrough
                if (mark.style.textDecoration.includes('line-through')) {
                    mark.style.textDecoration = 'none';
                } else {
                    mark.style.textDecoration = 'line-through';
                }

                // Save updated highlight
                saveHighlight(highlightId, mark);

                // If highlight is in passage, save passage HTML
                const passageText = document.getElementById('test-passage-text');
                if (passageText && passageText.contains(mark)) {
                    const passageIndex = Math.floor(currentQuestionIndex / 16);
                    const passageKey = `${currentSubject}-${currentTestIndex}-passage-${passageIndex}`;
                    passageHighlights[passageKey] = passageText.innerHTML;
                }
            });
        }
    });
}

// Restore highlights
function restoreHighlights() {
    const key = getHighlightKey();
    const questionHighlights = highlights[key] || [];

    if (questionHighlights.length === 0) {
        return;
    }

    // This is a simplified version - in a real implementation, you'd need to
    // match highlights to their original positions in the text
    // For now, we'll store the HTML and restore it
    // Note: This is a basic implementation. A full solution would require
    // storing range information or using a more sophisticated approach
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

// Also call applyExamButtonTheme on window load to ensure all buttons are properly themed
window.addEventListener('load', function () {
    if (typeof applyExamButtonTheme === 'function') {
        console.log('Window loaded - applying exam button theme');
        applyExamButtonTheme();
    }
});

function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    // Load saved state
    loadSavedState();

    // Ensure dashboard view is shown by default
    const dashboardView = document.getElementById('dashboard-view');
    if (dashboardView) {
        dashboardView.style.display = 'block';
    }

    // Hide Organic Chemistry floating buttons initially (will be shown if needed by applyExamButtonTheme)
    const organicChemAuthorBtn = document.getElementById('organic-chem-author-btn');
    const ochemResetBtn = document.getElementById('ochem-reset-btn');
    if (organicChemAuthorBtn) {
        organicChemAuthorBtn.style.display = 'none';
    }
    if (ochemResetBtn) {
        ochemResetBtn.style.display = 'none';
    }
}

function setupEventListeners() {
    // Navigation - exclude Home button and Subjects button from generic handler
    document.querySelectorAll('.sidebar-link').forEach(link => {
        // Skip Home and Subjects buttons as they have their own onclick handlers
        if (link.id === 'nav-home' || link.id === 'nav-subjects') {
            return;
        }
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const subject = this.textContent.trim();
            showSubject(subject, e);
        });
    });

    // Pre-test next button
    const preTestNextBtn = document.getElementById('pre-test-next-btn');
    if (preTestNextBtn) {
        preTestNextBtn.addEventListener('click', startTest);
    }

    // Test navigation buttons
    const testPrevBtn = document.getElementById('test-prev-btn');
    const testNextBtn = document.getElementById('test-next-btn');
    const testReviewBtn = document.getElementById('test-review-btn');

    if (testPrevBtn) testPrevBtn.addEventListener('click', prevQuestion);
    if (testNextBtn) {
        // Use event listener but check if it's the last question
        testNextBtn.addEventListener('click', function (e) {
            const test = allTestData[currentSubject] && allTestData[currentSubject][currentTestIndex];
            if (test && currentQuestionIndex === test.length - 1) {
                // Last question - show End Test modal
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.showEndTestModalReact === 'function') {
                    window.showEndTestModalReact();
                } else {
                    openSubmitConfirmation();
                }
            } else {
                // Not last question - proceed normally
                nextQuestion();
            }
        });
    }
    if (testReviewBtn) testReviewBtn.addEventListener('click', showReviewView);

    // Toggle switches
    const togglePrometric = document.getElementById('toggle-prometric-delay');
    const toggleTimeAccom = document.getElementById('toggle-time-accommodations');

    if (togglePrometric) {
        togglePrometric.addEventListener('change', function () {
            prometricDelay = this.checked;
            saveSettings();
        });
    }

    if (toggleTimeAccom) {
        toggleTimeAccom.addEventListener('change', function () {
            timeAccommodations = this.checked;
            saveSettings();
        });
    }

    // Exit button handlers - use event delegation as a fallback
    // The HTML onclick handlers should handle most cases, but this ensures
    // buttons without onclick handlers (e.g., dynamically created) still work
    document.addEventListener('click', function (e) {
        const exitBtn = e.target.closest('.exam-close-btn');
        if (exitBtn) {
            const hasOnclick = exitBtn.getAttribute('onclick');
            // Only handle if button doesn't have onclick - let onclick handle it otherwise
            if (!hasOnclick || !hasOnclick.includes('showExitTestModal')) {
                console.log('🔴 Exit button clicked (event delegation fallback)');
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.showExitTestModal === 'function') {
                    window.showExitTestModal();
                }
            }
        }
    });
}

function showView(viewId, event, navElement) {
    console.log('showView called with viewId:', viewId);

    // Hide FAB in exam views
    const fabContainer = document.querySelector('.user-fab-container');
    if (fabContainer) {
        if (viewId === 'test-view' || viewId === 'pre-test-instructions-view' || viewId === 'pre-test-view') {
            fabContainer.style.display = 'none';
        } else {
            fabContainer.style.display = '';
        }
    }
    if (event) event.preventDefault();

    // Hide all views
    document.querySelectorAll('.app-view').forEach(view => {
        view.style.display = 'none';
    });

    const mainContent = document.getElementById('main-content');
    // Show/hide sidebar based on view
    const sidebar = document.getElementById('sidebar');
    const examViews = ['test-view', 'pre-test-instructions-view', 'review-view', 'results-view', 'detailed-review-view', 'tagged-questions-view'];
    const reviewViews = ['review-view', 'detailed-review-view', 'results-view', 'tagged-questions-view'];

    if (examViews.includes(viewId)) {
        // Hide sidebar for exam views only
        if (sidebar) sidebar.style.display = 'none';
        if (mainContent) {
            mainContent.classList.remove('ml-64');
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
        }
    } else if (viewId === 'subject-pages-view') {
        // Keep sidebar visible for subject pages (overlays, so no margin needed)
        if (sidebar) {
            sidebar.style.display = 'flex';
            // KEEP SIDEBAR ALWAYS BLACK - DO NOT CHANGE COLOR
            sidebar.style.backgroundColor = '#000000';
            sidebar.style.setProperty('background-color', '#000000', 'important');
            // Remove any existing subject color style
            const existingStyle = document.getElementById('sidebar-subject-color-style');
            if (existingStyle) {
                existingStyle.remove();
            }
        }
        // Sidebar overlays, so main-content is full width
        if (mainContent) {
            mainContent.style.display = 'flex';
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
            // Check dark mode preference and set background accordingly
            try {
                const isDarkMode = localStorage.getItem('subject-pages-dark-mode') === 'true';
                if (isDarkMode) {
                    mainContent.style.backgroundColor = '#111827';
                    mainContent.style.setProperty('background-color', '#111827', 'important');
                    document.body.classList.add('dark-mode');
                    document.body.style.backgroundColor = '#111827';
                    document.body.style.setProperty('background-color', '#111827', 'important');
                    const subjectPagesView = document.getElementById('subject-pages-view');
                    if (subjectPagesView) {
                        subjectPagesView.style.backgroundColor = '#111827';
                        subjectPagesView.style.setProperty('background-color', '#111827', 'important');
                    }
                } else {
                    mainContent.style.backgroundColor = '#f9fafb';
                    mainContent.style.setProperty('background-color', '#f9fafb', 'important');
                    document.body.classList.remove('dark-mode');
                    document.body.style.backgroundColor = '#f9fafb';
                    document.body.style.setProperty('background-color', '#f9fafb', 'important');
                    const subjectPagesView = document.getElementById('subject-pages-view');
                    if (subjectPagesView) {
                        subjectPagesView.style.backgroundColor = '#f9fafb';
                        subjectPagesView.style.setProperty('background-color', '#f9fafb', 'important');
                    }
                }
            } catch (e) {
                // Fallback to light mode if localStorage access fails
                mainContent.style.backgroundColor = '#f9fafb';
                document.body.classList.remove('dark-mode');
            }
        }
    } else {
        // Show sidebar for dashboard and other views (overlays, so no margin needed)
        if (sidebar) {
            sidebar.style.display = 'flex';
        }
        // Sidebar overlays, so main-content is full width
        if (mainContent) {
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
        }
    }

    // Show requested view
    const view = document.getElementById(viewId);
    if (view) {
        if (viewId === 'subject-pages-view') {
            // Subject pages view - React component handles its own layout
            view.style.display = 'block';
            view.style.width = '100%';
            view.style.height = '100%';
            view.style.position = 'relative';
        } else if (viewId === 'dashboard-view' || viewId === 'pre-test-view' || viewId === 'pre-test-instructions-view' || viewId === 'results-view') {
            view.style.display = 'block';
            if (viewId !== 'dashboard-view' && mainContent) {
                mainContent.style.display = 'flex';
            }
            // Apply button themes when showing pre-test-instructions-view
            if (viewId === 'pre-test-instructions-view') {
                setTimeout(() => {
                    if (typeof applyExamButtonTheme === 'function') {
                        applyExamButtonTheme();
                    }
                }, 100);
            }
        } else {
            view.style.display = 'flex';
        }
    }

    // Apply button themes for test and review views
    if (viewId === 'test-view' || viewId === 'review-view') {
        setTimeout(() => {
            if (typeof applyExamButtonTheme === 'function') {
                applyExamButtonTheme();
            }
        }, 100);
    }

    // Force hide/show logic for dashboard
    if (viewId === 'dashboard-view') {
        // Ensure dashboard is visible
        if (view) {
            view.style.display = 'block';
        }
        // Add class to body for dashboard styling
        document.body.classList.add('dashboard-active');
        document.body.style.backgroundColor = '#282a5c';
    } else if (viewId === 'subject-pages-view') {
        // Remove dashboard class when showing subject pages
        document.body.classList.remove('dashboard-active');
        // Check dark mode preference and set background accordingly
        try {
            const isDarkMode = localStorage.getItem('subject-pages-dark-mode') === 'true';
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                document.body.style.backgroundColor = '#111827';
                document.body.style.setProperty('background-color', '#111827', 'important');
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.backgroundColor = '#111827';
                    mainContent.style.setProperty('background-color', '#111827', 'important');
                }
                const subjectPagesView = document.getElementById('subject-pages-view');
                if (subjectPagesView) {
                    subjectPagesView.style.backgroundColor = '#111827';
                    subjectPagesView.style.setProperty('background-color', '#111827', 'important');
                }
            } else {
                document.body.classList.remove('dark-mode');
                document.body.style.backgroundColor = '#f9fafb';
                document.body.style.setProperty('background-color', '#f9fafb', 'important');
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.backgroundColor = '#f9fafb';
                    mainContent.style.setProperty('background-color', '#f9fafb', 'important');
                }
                const subjectPagesView = document.getElementById('subject-pages-view');
                if (subjectPagesView) {
                    subjectPagesView.style.backgroundColor = '#f9fafb';
                    subjectPagesView.style.setProperty('background-color', '#f9fafb', 'important');
                }
            }
        } catch (e) {
            // Fallback to light mode if localStorage access fails
            document.body.classList.remove('dark-mode');
            document.body.style.backgroundColor = '#f9fafb';
        }
    } else {
        // Remove dashboard class when not on dashboard
        document.body.classList.remove('dashboard-active');
        document.body.classList.remove('dark-mode');
        // Reset body background for other views
        document.body.style.backgroundColor = '#13547a';
    }

    // Update active nav
    if (navElement) {
        document.querySelectorAll('.sidebar-nav-item').forEach(link => {
            link.classList.remove('active');
        });
        navElement.classList.add('active');
    }

    // If showing dashboard, remove active from all subject links and set home as active
    if (viewId === 'dashboard-view') {
        document.querySelectorAll('.sidebar-nav-item').forEach(link => {
            link.classList.remove('active');
        });
        const homeNav = document.getElementById('nav-home');
        if (homeNav) homeNav.classList.add('active');

        // Ensure sidebar is always black on dashboard
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            // Remove any subject color style
            const existingStyle = document.getElementById('sidebar-subject-color-style');
            if (existingStyle) {
                existingStyle.remove();
            }
            // Always keep sidebar black
            sidebar.style.backgroundColor = '#000000';
            sidebar.style.setProperty('background-color', '#000000', 'important');
            document.documentElement.style.setProperty('--sidebar-bg-color', '#000000');
        }
    }

    isReviewModeActive = viewId === 'review-view' || viewId === 'detailed-review-view' || viewId === 'results-view';
    console.log('🔄 View changed to:', viewId, 'isReviewModeActive:', isReviewModeActive);
    updateDashboardOffset();
}

function updateHeaderColor(subjectName) {
    // Match colors with React component (subject-pages-react.jsx)
    const colorMap = {
        'Biology': '#4f72c2', // Blue from React component
        'General Chemistry': '#06B6D4', // Cyan from React component
        'Organic Chemistry': '#EA580C', // Orange from React component
        'Reading Comprehension': '#065F46', // Green from React component
        'Physics': '#7E22CE', // Purple from React component
        'Quantitative Reasoning': '#B91C1C' // Red from React component
    };

    // Default to dark blue if no color is found
    const color = colorMap[subjectName] || '#0e5c84';
    const defaultHeaderColor = '#0e5c84';

    // Set subject color for cards, buttons, etc.
    document.documentElement.style.setProperty('--subject-bg-color', color);

    // KEEP SIDEBAR ALWAYS BLACK - DO NOT CHANGE SIDEBAR BACKGROUND
    // Remove any existing subject color style that might change sidebar
    const existingStyle = document.getElementById('sidebar-subject-color-style');
    if (existingStyle) {
        existingStyle.remove();
    }

    // Ensure sidebar stays black
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.style.backgroundColor = '#000000';
        sidebar.style.setProperty('background-color', '#000000', 'important');
    }

    // Always use blue for exam headers/footers
    document.documentElement.style.setProperty('--header-color', defaultHeaderColor);

    // Remove existing themed classes from all views
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('subject-themed-page');
    });

    // Apply themed class ONLY to the pre-test view (subject selection page)
    // Do NOT apply to the actual test pages - they should be white
    const preTestView = document.getElementById('pre-test-view');
    if (preTestView) preTestView.classList.add('subject-themed-page');
}

// Toggle sidebar collapse/expand
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const subjectsList = document.getElementById('subjects-list');
    const subjectsToggle = document.getElementById('nav-subjects');
    const subjectsChevron = document.getElementById('subjects-chevron');

    if (sidebar) {
        sidebar.classList.toggle('sidebar-collapsed');
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        document.body.classList.toggle('sidebar-collapsed', isCollapsed);

        // Sidebar is now fixed/overlay, so main-content doesn't need margin adjustments
        // Keep main-content full width - hero content is centered relative to viewport
        if (mainContent) {
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
            updateDashboardOffset();
        }

        if (subjectsList && subjectsToggle && subjectsChevron) {
            if (isCollapsed) {
                subjectsList.classList.add('hidden');
                subjectsToggle.setAttribute('aria-expanded', 'false');
                subjectsList.setAttribute('aria-hidden', 'true');
                subjectsChevron.classList.add('rotated');
            } else {
                subjectsToggle.setAttribute('aria-expanded', subjectsList.classList.contains('hidden') ? 'false' : 'true');
                subjectsList.setAttribute('aria-hidden', subjectsList.classList.contains('hidden') ? 'true' : 'false');
            }
        }

        // Reinitialize Lucide icons after toggle
        setTimeout(() => {
            if (window.lucide) {
                lucide.createIcons();
            }
        }, 150);
    }
}

// Toggle subjects menu
function toggleSubjectsMenu(event) {
    if (event) event.preventDefault();

    const subjectsList = document.getElementById('subjects-list');
    const chevron = document.getElementById('subjects-chevron');
    const toggleLink = document.getElementById('nav-subjects');

    if (subjectsList && chevron && toggleLink) {
        subjectsList.classList.toggle('hidden');
        const isHidden = subjectsList.classList.contains('hidden');
        chevron.classList.toggle('rotated', isHidden);
        toggleLink.setAttribute('aria-expanded', String(!isHidden));
        subjectsList.setAttribute('aria-hidden', String(isHidden));
    }
}

function showSubject(subjectName, event) {
    console.log('showSubject called with:', subjectName, event);
    if (event) event.preventDefault();

    currentSubject = subjectName;

    // Update header color for this subject
    updateHeaderColor(subjectName);

    // Update sidebar navigation - remove active from all, add to current
    document.querySelectorAll('.sidebar-nav-item').forEach(link => {
        link.classList.remove('active');
    });

    // Remove active from home
    const homeNav = document.getElementById('nav-home');
    if (homeNav) homeNav.classList.remove('active');

    // Map subject names to their nav IDs
    const subjectNavMap = {
        'Biology': 'nav-biology',
        'General Chemistry': 'nav-general-chemistry',
        'Organic Chemistry': 'nav-organic-chemistry',
        'Reading Comprehension': 'nav-reading-comprehension',
        'Physics': 'nav-physics',
        'Quantitative Reasoning': 'nav-quantitative-reasoning'
    };

    const activeNavId = subjectNavMap[subjectName];
    if (activeNavId) {
        const activeNav = document.getElementById(activeNavId);
        if (activeNav) {
            activeNav.classList.add('active');
        }
    }

    // Update pre-test view header and title
    const preTestHeaderTitle = document.getElementById('pre-test-header-title');
    const preTestSubjectTitle = document.getElementById('pre-test-subject-title');
    if (preTestHeaderTitle) {
        preTestHeaderTitle.textContent = subjectName;
    }
    if (preTestSubjectTitle) {
        preTestSubjectTitle.textContent = subjectName;
    }

    // Show new React-based subject pages instead of old pre-test view
    console.log('🔄 Showing subject-pages-view for:', subjectName);
    showView('subject-pages-view', event);

    // Wait a bit for the view to be shown, then initialize React component
    // Use a longer delay to ensure DOM is stable and avoid React cleanup conflicts
    setTimeout(function () {
        // Double-check we're still on the subject pages view before initializing
        const subjectPagesView = document.getElementById('subject-pages-view');
        if (subjectPagesView && subjectPagesView.style.display !== 'none') {
            console.log('🔄 Initializing React component for:', subjectName);
            try {
                initializeSubjectPagesReact(subjectName);
            } catch (initError) {
                console.error('Error initializing React component:', initError);
                // Retry once after a delay if first attempt fails
                setTimeout(() => {
                    try {
                        const checkView = document.getElementById('subject-pages-view');
                        if (checkView && checkView.style.display !== 'none') {
                            initializeSubjectPagesReact(subjectName);
                        }
                    } catch (retryError) {
                        console.error('Retry also failed:', retryError);
                    }
                }, 500);
            }
        } else {
            console.warn('Subject pages view not visible, skipping React initialization');
        }
    }, 150);
}

function displayTestList(subjectName) {
    console.log('displayTestList called for:', subjectName);
    const tests = allTestData[subjectName] || [];
    console.log('tests found:', tests.length);
    const container = document.getElementById('test-list-container');
    const noTestsView = document.getElementById('no-tests-view');
    const testListView = document.getElementById('test-list-view');
    const metaSummary = document.getElementById('subject-tests-meta-summary');

    if (tests.length === 0) {
        console.log('No tests found, showing no-tests-view');
        noTestsView.style.display = 'block';
        testListView.style.display = 'none';
        if (metaSummary) metaSummary.textContent = 'No practice tests available yet';
        return;
    }

    console.log('Showing test list with', tests.length, 'tests');
    noTestsView.style.display = 'none';
    testListView.style.display = 'block';

    container.innerHTML = '';
    if (metaSummary) metaSummary.textContent = `${tests.length} practice ${tests.length === 1 ? 'test' : 'tests'} available`;

    tests.forEach((test, index) => {
        const testCard = document.createElement('div');
        testCard.className = 'subject-test-card';

        const isTrialMode = subjectName === 'Reading Comprehension' && index === 0 && test[0] && test[0].passageId;
        const testTitle = isTrialMode ? `${subjectName} Trial Mode` : `${subjectName} Test #${index + 1}`;

        // Pull latest attempt data if available
        const attempts = getTestAttempts(subjectName, index);
        const latestAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;
        const taggedQuestions = getTaggedQuestions();
        let taggedCount = 0;
        Object.values(taggedQuestions).forEach(tag => {
            if (tag.subject === subjectName && tag.testIndex === index) taggedCount++;
        });
        const correct = latestAttempt ? latestAttempt.correct : 0;
        const total = latestAttempt ? latestAttempt.total : test.length;
        const correctPercent = total > 0 ? Math.round((correct / total) * 100) : 0;
        const incorrectPercent = Math.max(0, 100 - correctPercent);
        const score = latestAttempt ? getScaledScore(latestAttempt.score) : '--';
        const attemptsCount = attempts.length;
        const dateLabel = latestAttempt ? formatResultDate(latestAttempt.date) : '--';

        testCard.innerHTML = `
            <div class="subject-test-index">${index + 1}</div>
            <div class="subject-test-info">
                <p class="subject-test-title">${testTitle}</p>
                <span class="subject-test-tagged">${taggedCount} of ${test.length} questions tagged</span>
                </div>
            <div class="subject-test-progress">
                <div class="subject-test-progress-bar">
                    <div class="subject-test-progress-correct" style="width: ${correctPercent}%;"></div>
                    <div class="subject-test-progress-incorrect" style="width: ${incorrectPercent}%;"></div>
                </div>
                <div class="subject-test-progress-text">${correct} / ${total} correct</div>
            </div>
            <div class="subject-test-meta">
                <div class="subject-test-meta-item">
                    <span>Date</span>
                    <span class="subject-test-meta-value">${dateLabel}</span>
                </div>
                <div class="subject-test-meta-item">
                    <span>Score</span>
                    <span class="subject-test-meta-value">${score}</span>
                </div>
                <div class="subject-test-meta-item">
                    <span>Attempts</span>
                    <span class="subject-test-meta-value">${attemptsCount}</span>
                </div>
            </div>
            <div class="subject-test-actions">
                <button class="btn-pill reset" onclick="resetTestCard('${subjectName}', ${index})">Reset</button>
                <button class="btn-pill review" onclick="reviewTestFromSubject('${subjectName}', ${index})">Review</button>
                <button class="btn-pill" style="background:#036666;color:#ffffff" onclick="startPreTest('${subjectName}', ${index})">Start</button>
            </div>
        `;
        container.appendChild(testCard);
    });
}

function startPreTest(subjectName, testIndex) {
    console.log('✅ startPreTest called:', subjectName, 'Test Index:', testIndex);

    currentSubject = subjectName;
    currentTestIndex = testIndex;

    // Check if this test was just reset
    const resetFlagKey = getNamespacedStorageKey(`exam-reset-flag-${subjectName}-${testIndex}`);
    const wasJustReset = localStorage.getItem(resetFlagKey);

    // Always start a completely fresh exam session.
    // Saved answers are ONLY used for post-submission review, never to resume.
    console.log('📥 Preparing fresh exam session (no restored answers or state)');
    currentQuestionIndex = 0;
    userAnswers = {};
    markedQuestions = {};
    timeRemaining = null;
    testStartTime = null;
    questionStartTime = {};
    questionTimeSpent = {};
    currentViewMode = null; // Start at intro view
    detailedReviewQuestionIndex = 0;
    highlights = {};
    passageHighlights = {};
    highlightCounter = 0;

    try {
        clearFullExamState(subjectName, testIndex);
    } catch (e) {
        console.warn('Error clearing saved exam state before fresh start:', e);
    }

    if (wasJustReset) {
        // Clear the reset flag so subsequent opens behave the same
        try {
            localStorage.removeItem(resetFlagKey);
        } catch (e) {
            console.warn('Error clearing reset flag:', e);
        }
    }

    // Update header color for this subject
    if (typeof updateHeaderColor === 'function') {
        updateHeaderColor(subjectName);
    }

    // Clear highlights and strikethroughs when starting a new test
    if (typeof clearHighlightsAndStrikethroughs === 'function') {
        clearHighlightsAndStrikethroughs();
    }

    // Get fresh test data
    const subjectTests = getAllTestData()[subjectName];
    const test = subjectTests && subjectTests[testIndex];

    if (!test) {
        console.error('❌ Test not found:', subjectName, testIndex);
        console.error('Available tests for', subjectName + ':', subjectTests ? subjectTests.length : 0);
        alert('Test not found. Please try again.');
        return;
    }

    console.log('✅ Test found:', test.length, 'questions');

    // Update pre-test instructions view
    const preTestInstructionsTitle = document.getElementById('pre-test-instructions-title');
    const preTestInstructionsInstruction1 = document.getElementById('pre-test-instructions-instruction-1');
    const preTestInstructionsHeaderTitle = document.getElementById('pre-test-instructions-header-title');

    if (preTestInstructionsTitle) {
        preTestInstructionsTitle.textContent = `This is ${subjectName} Test #${testIndex + 1}. Please read the following before starting:`;
    }

    // Check if this is the trial mode test
    const isTrialMode = subjectName === 'Reading Comprehension' && testIndex === 0 && test[0] && test[0].passageId;

    let timeMinutes = 30; // Default
    if (subjectName === 'Reading Comprehension') {
        timeMinutes = isTrialMode ? 10 : 60; // 10 minutes for trial, 60 for regular
    } else if (subjectName === 'Quantitative Reasoning') {
        timeMinutes = 45;
    } else if (subjectName === 'Physics') {
        timeMinutes = 50;
    }

    if (preTestInstructionsInstruction1) {
        preTestInstructionsInstruction1.textContent = `You have ${timeMinutes} minutes to finish ${test.length} questions.`;
    }

    if (preTestInstructionsHeaderTitle) {
        // Update title for trial mode
        if (isTrialMode) {
            preTestInstructionsHeaderTitle.textContent = `${subjectName} Trial Mode`;
        } else {
            preTestInstructionsHeaderTitle.textContent = `${subjectName} Test #${testIndex + 1}`;
        }
    }

    // Update instructions title for trial mode
    if (preTestInstructionsTitle) {
        if (isTrialMode) {
            preTestInstructionsTitle.textContent = `This is Reading Comprehension Trial Mode. Read this before starting:`;
        } else {
            preTestInstructionsTitle.textContent = `This is ${subjectName} Test #${testIndex + 1}. Read this before starting:`;
        }
    }

    // Load settings
    if (typeof loadSettings === 'function') {
        loadSettings();
    }

    // Initialize button management UI (will only initialize if container exists)
    if (typeof initializeButtonManagement === 'function') {
        setTimeout(() => {
            initializeButtonManagement();
        }, 100);
    }

    console.log('✅ Showing pre-test-instructions-view');

    // Set view mode to 'intro' if not already set (preserve loaded view mode if resuming)
    if (currentViewMode === null || currentViewMode === undefined) {
        currentViewMode = 'intro';
    }

    // Auto-save state (even if just previewing)
    saveFullExamState();

    showView('pre-test-instructions-view');

    // Apply button themes after view is shown
    setTimeout(() => {
        if (typeof applyExamButtonTheme === 'function') {
            applyExamButtonTheme();
        }
    }, 200);
}

// Expose functions to window for React component to use
// Functions exposed to window are now exported at the end of the file

function startTest() {
    // Get fresh test data
    const subjectTests = getAllTestData()[currentSubject];
    const test = subjectTests && subjectTests[currentTestIndex];

    if (!test) {
        console.error('❌ Test not found in startTest:', currentSubject, currentTestIndex);
        console.error('Available tests for', currentSubject + ':', subjectTests ? subjectTests.length : 0);
        alert('Test not found. Please try again.');
        return;
    }

    examSubmitted = false;
    if (currentSubject && currentTestIndex !== null && currentTestIndex !== undefined) {
        clearFullExamState(currentSubject, currentTestIndex);
    }

    console.log('✅ Starting test:', currentSubject, 'Test #' + (currentTestIndex + 1), 'with', test.length, 'questions');

    // Ensure answers are cleared when starting a fresh test attempt
    // Check if this is a fresh start (no testStartTime) or resuming
    const isFreshStart = !testStartTime || timeRemaining === null || timeRemaining === undefined;

    if (isFreshStart) {
        // Fresh start - clear all answers and state to ensure clean slate
        console.log('🔄 Fresh start - clearing previous answers and state');
        userAnswers = {};
        markedQuestions = {};
        currentQuestionIndex = 0;
        questionStartTime = {};
        questionTimeSpent = {};
        highlights = {};
        passageHighlights = {};
        if (window.PassageHighlightSystem) {
            window.PassageHighlightSystem.clearAllStorage();
            window.PassageHighlightSystem.reset();
        }
        highlightCounter = 0;
    }

    // State should already be loaded in startPreTest, but double-check
    // If timeRemaining is null, this is a fresh start
    if (timeRemaining === null || timeRemaining === undefined) {
        // Fresh start - initialize timer
        // Calculate time based on subject
        let timeMinutes = 30; // Default
        const isTrialMode = currentSubject === 'Reading Comprehension' && currentTestIndex === 0 && test[0] && test[0].passageId;
        if (currentSubject === 'Reading Comprehension') {
            timeMinutes = isTrialMode ? 10 : 60;
        } else if (currentSubject === 'Quantitative Reasoning') {
            timeMinutes = 45;
        } else if (currentSubject === 'Physics') {
            timeMinutes = 50;
        }
        timeRemaining = timeMinutes * 60;
        testStartTime = Date.now();
        console.log('⏱️ Starting fresh test with', timeMinutes, 'minutes');
    } else if (testStartTime && timeRemaining !== null) {
        // Resuming - time was already adjusted in applyLoadedExamState
        // Just log the current state
        console.log('⏱️ Resuming test with remaining time:', timeRemaining, 'seconds');
    }

    // Set view mode to 'test' and auto-save
    currentViewMode = 'test';
    saveFullExamState();

    // Enable beforeunload warning when test is active
    enableTestExitWarning();

    // Clear highlights and strikethroughs when starting test (in case user went back)
    if (typeof clearHighlightsAndStrikethroughs === 'function') {
        clearHighlightsAndStrikethroughs();
    }

    // Update test header title and subtitle
    const testHeaderSubtitle = document.getElementById('test-header-subtitle');
    if (testHeaderSubtitle) {
        if (currentSubject === 'Reading Comprehension') {
            testHeaderSubtitle.textContent = `Reading Comprehension Test #${currentTestIndex + 1}`;
        } else {
            testHeaderSubtitle.textContent = `${currentSubject} Test #${currentTestIndex + 1}`;
        }
    }

    // Adjust width for Reading Comprehension (less wide layout)
    const testContentWrapper = document.getElementById('test-content-wrapper');
    if (testContentWrapper) {
        if (currentSubject === 'Reading Comprehension') {
            testContentWrapper.className = 'w-[50%] min-w-[600px] bg-white border border-black/80 p-8 relative';
        } else {
            testContentWrapper.className = 'w-[62%] min-w-[740px] bg-white border border-black/80 p-8 relative';
        }
    }

    // Reset time tracking (unless resuming)
    // Check if we're resuming by checking if testStartTime was already set from loaded state
    if (!testStartTime) {
        questionStartTime = {};
        questionTimeSpent = {};
        testStartTime = Date.now();
    } else {
        // Restore time tracking if resuming (testStartTime was set from loaded state)
        // questionTimeSpent should already be restored from applyLoadedExamState in startPreTest
        if (!questionTimeSpent) {
            questionTimeSpent = {};
        }
    }

    // Calculate time - Reading Comprehension is 60 minutes, Quantitative Reasoning is 45 minutes, Physics is 50 minutes, others are 30 minutes
    // Trial mode test (index 0 with passageId questions) uses 10 minutes
    let baseTime = 1800; // Default 30 minutes
    if (currentSubject === 'Reading Comprehension') {
        // Check if this is the trial mode test (index 0 with passageId questions)
        const isTrialMode = currentTestIndex === 0 && test[0] && test[0].passageId;
        baseTime = isTrialMode ? 600 : 3600; // 10 minutes for trial, 60 for regular
    } else if (currentSubject === 'Quantitative Reasoning') {
        baseTime = 2700; // 45 minutes
    } else if (currentSubject === 'Physics') {
        baseTime = 3000; // 50 minutes
    }
    timeRemaining = timeAccommodations ? Math.floor(baseTime * 1.5) : baseTime;

    // Start timer
    if (typeof startTimer === 'function') {
        startTimer();
    }

    // Show first question
    if (typeof displayQuestion === 'function') {
        displayQuestion(0);
    }

    // Show test view
    showView('test-view');

    // Enter fullscreen mode
    if (typeof enterFullscreen === 'function') {
        enterFullscreen();
    }
}

// Fullscreen functions
function enterFullscreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else if (element.webkitRequestFullscreen) { // Safari
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    }
}

function exitFullscreen() {
    const handlePromise = (maybePromise) => {
        if (maybePromise && typeof maybePromise.catch === 'function') {
            maybePromise.catch(err => {
                console.debug('exitFullscreen rejected (ignored):', err);
            });
        }
    };

    if (document.exitFullscreen) {
        handlePromise(document.exitFullscreen());
    } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    }
}

function displayQuestion(index) {
    const test = allTestData[currentSubject][currentTestIndex];
    const question = test[index];

    if (!question) return;

    // Load highlights from localStorage if this is a completed test
    // Only load once when displaying first question
    if (index === 0 && Object.keys(highlights).length === 0) {
        loadHighlightsFromLocalStorage();
    }

    // Track time spent on previous question
    if (questionStartTime[currentQuestionIndex] !== undefined) {
        const timeSpent = Date.now() - questionStartTime[currentQuestionIndex];
        questionTimeSpent[currentQuestionIndex] = (questionTimeSpent[currentQuestionIndex] || 0) + timeSpent;
    }

    // Start timer for current question
    questionStartTime[index] = Date.now();

    currentQuestionIndex = index;
    // Save state after navigating to new question
    saveFullExamState();

    // Update header
    document.getElementById('test-q-number').textContent = index + 1;
    document.getElementById('test-q-total').textContent = test.length;

    // Update question stem - make it highlightable
    const stemElement = document.getElementById('test-q-stem');
    stemElement.innerHTML = escapeHtml(question.stem);
    stemElement.setAttribute('contenteditable', 'false');
    stemElement.style.userSelect = 'text';

    // Update choices - make them highlightable
    const choicesContainer = document.getElementById('test-q-choices');
    choicesContainer.innerHTML = '';

    question.c.forEach((choice, i) => {
        const choiceDiv = document.createElement('div');
        choiceDiv.className = 'flex items-start gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded';
        choiceDiv.style.userSelect = 'text';

        // Create label with highlightable text
        const label = document.createElement('label');
        label.setAttribute('for', `choice-${i}`);
        label.className = 'flex-1 cursor-pointer choice-label';
        label.style.userSelect = 'text';
        label.setAttribute('data-choice-index', i);
        label.setAttribute('data-question-index', index);

        // Check if this choice has strikethrough saved
        const choiceKey = `${currentSubject}-${currentTestIndex}-q${index}-choice${i}`;
        const savedStrikethrough = localStorage.getItem(`strikethrough-${choiceKey}`);
        const choiceText = `${String.fromCharCode(65 + i)}. ${escapeHtml(choice)}`;

        if (savedStrikethrough === 'true') {
            label.innerHTML = `<span style="text-decoration: line-through;">${choiceText}</span>`;
        } else {
            label.innerHTML = choiceText;
        }

        // Add right-click to toggle strikethrough
        label.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Check if we're right-clicking on highlighted text
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
                // User selected text, check if it's within a highlight
                const range = selection.getRangeAt(0);
                const mark = range.commonAncestorContainer.closest ?
                    range.commonAncestorContainer.closest('mark') :
                    (range.commonAncestorContainer.nodeType === 1 && range.commonAncestorContainer.tagName === 'MARK' ?
                        range.commonAncestorContainer :
                        range.commonAncestorContainer.parentElement?.closest('mark'));

                if (mark) {
                    // Toggle strikethrough on the highlight
                    if (mark.style.textDecoration.includes('line-through')) {
                        mark.style.textDecoration = 'none';
                    } else {
                        mark.style.textDecoration = 'line-through';
                    }
                    selection.removeAllRanges();
                    return;
                }
            }

            // Otherwise, toggle strikethrough on the entire choice
            const span = label.querySelector('span[style*="line-through"]');
            if (span) {
                // Remove strikethrough
                label.innerHTML = choiceText;
                localStorage.removeItem(`strikethrough-${choiceKey}`);
            } else {
                // Add strikethrough
                // Preserve any existing highlights
                const currentHTML = label.innerHTML;
                if (currentHTML.includes('<mark')) {
                    // Has highlights, wrap the whole thing
                    label.innerHTML = `<span style="text-decoration: line-through;">${currentHTML}</span>`;
                } else {
                    label.innerHTML = `<span style="text-decoration: line-through;">${choiceText}</span>`;
                }
                localStorage.setItem(`strikethrough-${choiceKey}`, 'true');
            }
        });

        // Make the label highlightable (add to highlightable areas)
        label.setAttribute('contenteditable', 'false');

        choiceDiv.innerHTML = `
            <input type="radio" name="answer" value="${i}" id="choice-${i}" ${userAnswers[index] === i ? 'checked' : ''} onchange="selectAnswer(${index}, ${i})">
        `;
        choiceDiv.appendChild(label);
        choicesContainer.appendChild(choiceDiv);
    });

    // Display passage for Reading Comprehension
    const passageContainer = document.getElementById('test-passage-container');
    const passageText = document.getElementById('test-passage-text');
    const passageTitle = document.getElementById('test-passage-title');

    if (currentSubject === 'Reading Comprehension' && passageContainer && passageText && passageTitle) {
        const testPassages = typeof readingComprehensionPassages !== 'undefined' ? readingComprehensionPassages[currentSubject]?.[currentTestIndex] : null;
        let passage = null;
        let passageKey = null;
        let passageIndex = null;

        // Check if question has passageId (new structure - like React code)
        if (question.passageId) {
            const derivedIndexFromId = getPassageIndexFromId(question.passageId);
            // First try to get passage from global PASSAGES object (new structure)
            if (typeof PASSAGES !== 'undefined' && PASSAGES[question.passageId]) {
                passage = PASSAGES[question.passageId];
                passageKey = `${currentSubject}-${currentTestIndex}-passage-${question.passageId}`;
                passageIndex = derivedIndexFromId !== null ? derivedIndexFromId : 0;
            } else if (testPassages) {
                // Fall back to readingComprehensionPassages if available
                // Check if testPassages is an object (trial mode structure) or array (old structure)
                if (testPassages && typeof testPassages === 'object' && !Array.isArray(testPassages) && testPassages !== null) {
                    // Trial mode: passages are stored as object keyed by ID (like React PASSAGES)
                    passage = testPassages[question.passageId];
                    if (passage) {
                        passageKey = `${currentSubject}-${currentTestIndex}-passage-${question.passageId}`;
                        passageIndex = derivedIndexFromId !== null ? derivedIndexFromId : 0; // Default to 0 if we can't derive
                    }
                } else if (Array.isArray(testPassages)) {
                    // Old structure: find passage by ID in array
                    passage = testPassages.find(p => p.id === question.passageId);
                    if (passage) {
                        passageKey = `${currentSubject}-${currentTestIndex}-passage-${question.passageId}`;
                        if (derivedIndexFromId !== null) {
                            passageIndex = derivedIndexFromId;
                        } else {
                            passageIndex = testPassages.indexOf(passage);
                        }
                    }
                }
            }
        } else {
            // Fall back to old structure: determine which passage this question belongs to (16 questions per passage for 50-question tests)
            if (Array.isArray(testPassages)) {
                passageIndex = Math.floor(index / 16); // 0, 1, or 2
                if (testPassages[passageIndex]) {
                    passage = testPassages[passageIndex];
                    passageKey = `${currentSubject}-${currentTestIndex}-passage-${passageIndex}`;
                }
            }
        }

        if (passage) {
            const passageNumber = (passageIndex !== null ? passageIndex : 0) + 1;
            passageTitle.textContent = `Passage ${passageNumber}`;

            // Mark container for the new system
            passageText.setAttribute('data-passage-container', 'true');

            // Construct raw HTML
            let rawHTML = '';

            if (passage.content && Array.isArray(passage.content)) {
                rawHTML = passage.content.map(para => `<p>${escapeHtml(para)}</p>`).join('');
            } else if (passage.text) {
                // Split text into paragraphs
                const lines = passage.text.split('\n');
                const paragraphs = [];
                let currentPara = '';

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    if (line.match(/^\(\d+\)/)) {
                        if (currentPara) paragraphs.push(currentPara.trim());
                        currentPara = line;
                    } else {
                        if (currentPara) currentPara += ' ' + line;
                        else currentPara = line;
                    }
                }
                if (currentPara) paragraphs.push(currentPara.trim());
                if (paragraphs.length <= 1) {
                    paragraphs = passage.text.split(/\n\n+/).filter(p => p.trim());
                }

                rawHTML = paragraphs.map(para => `<p style="margin-bottom: 1rem;">${escapeHtml(para)}</p>`).join('');
            }

            // Use new PassageHighlightSystem if available
            if (window.PassageHighlightSystem && currentSubject === 'Reading Comprehension') {
                // Use a consistent ID for the passage
                const uniquePassageId = passage.id || `passage-${passageIndex}`;
                const questionKey = `${currentSubject}-${currentTestIndex}-${index}`;

                // Initialize and apply highlights
                window.PassageHighlightSystem.initialize(uniquePassageId, rawHTML, questionKey);
                window.PassageHighlightSystem.apply(passageText, uniquePassageId);
                window.PassageHighlightSystem.setupListeners();
            } else {
                // Fallback to old system
                passageText.innerHTML = rawHTML;
                reattachHighlightButtons(passageText);
            }

            passageContainer.style.display = 'block';
            passageText.setAttribute('contenteditable', 'false');
            passageText.style.userSelect = 'text';
        } else {
            passageContainer.style.display = 'none';
        }
    } else if (passageContainer) {
        passageContainer.style.display = 'none';
    }

    // Restore highlights for this question
    restoreHighlights();

    // Re-attach toggle buttons for any existing highlights in content area
    const contentArea = document.getElementById('test-content-area');
    if (contentArea) {
        reattachHighlightButtons(contentArea);
    }

    // Setup highlighting listeners (includes passage area)
    setupHighlightListeners();

    applyExamButtonTheme();
}

function selectAnswer(questionIndex, answerIndex) {
    userAnswers[questionIndex] = answerIndex;
    saveFullExamState(); // Use comprehensive save
}

function nextQuestion() {
    const test = allTestData[currentSubject][currentTestIndex];
    if (currentQuestionIndex < test.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        if (prometricDelay) {
            setTimeout(() => displayQuestion(nextIndex), 2000);
        } else {
            displayQuestion(nextIndex);
        }
    } else {
        // Show confirmation modal before ending test
        openSubmitConfirmation();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        const prevIndex = currentQuestionIndex - 1;
        if (prometricDelay) {
            setTimeout(() => displayQuestion(prevIndex), 2000);
        } else {
            displayQuestion(prevIndex);
        }
    }
}

function updateTestMarkButton(index, config) {
    const markBtn = document.getElementById('test-mark-btn');
    if (!markBtn) return;
    const isMarked = !!markedQuestions[index];
    const buttonConfig = config || getStoredExamButtonConfig();
    const key = isMarked ? 'mark-active' : 'mark';
    setExamButtonContent(markBtn, key, isMarked ? 'MARKED' : 'MARK', buttonConfig);
    markBtn.classList.toggle('is-marked', isMarked);

    // Wire up click handler - instant response
    markBtn.onclick = function (e) {
        if (!markBtn.disabled) {
            toggleMark(index);
        }
    };

    // Ensure image never blocks clicks - no delays
    const img = markBtn.querySelector('.button-skin');
    if (img) {
        img.style.pointerEvents = 'none';
        img.onclick = null;
    }
}

function updateDetailedReviewMarkButton(index, config) {
    const reviewMarkBtn = document.getElementById('review-mark-btn');
    if (!reviewMarkBtn) return;
    const isMarked = !!markedQuestions[index];
    const buttonConfig = config || getStoredExamButtonConfig();
    const key = isMarked ? 'mark-active' : 'mark';
    setExamButtonContent(reviewMarkBtn, key, isMarked ? 'MARKED' : 'MARK', buttonConfig);
    reviewMarkBtn.classList.toggle('is-marked', isMarked);

    // Wire up click handler - instant response
    reviewMarkBtn.onclick = function (e) {
        if (!reviewMarkBtn.disabled) {
            toggleMark(index, { context: 'detailed-review' });
        }
    };

    // Ensure image never blocks clicks - no delays
    const img = reviewMarkBtn.querySelector('.button-skin');
    if (img) {
        img.style.pointerEvents = 'none';
        img.onclick = null;
    }
}

function toggleMark(indexOverride, options = {}) {
    if (indexOverride instanceof Event) {
        indexOverride.preventDefault();
        indexOverride = undefined;
    }

    let targetIndex;
    let context = options.context;

    if (typeof indexOverride === 'number') {
        targetIndex = indexOverride;
    } else {
        targetIndex = currentQuestionIndex;
        if (indexOverride && typeof indexOverride === 'object' && indexOverride.context) {
            context = indexOverride.context;
        }
    }

    if (targetIndex === null || targetIndex === undefined) return;

    if (markedQuestions[targetIndex]) {
        delete markedQuestions[targetIndex];
    } else {
        markedQuestions[targetIndex] = true;
    }
    saveFullExamState(); // Use comprehensive save

    // Immediately update the mark button appearance
    const config = getStoredExamButtonConfig();
    if (context === 'detailed-review') {
        updateDetailedReviewMarkButton(targetIndex, config);
        updateDetailedReview();
        displayReviewGrid();
    } else {
        updateTestMarkButton(targetIndex, config);
        displayQuestion(targetIndex);
    }
}

function showReviewView() {
    // Set view mode to 'review' and save state
    currentViewMode = 'review';
    saveFullExamState();

    // Apply current dark mode preference to the review views
    applyTestReviewDarkModeFromPreference();

    // Update review header title
    const reviewHeaderTitle = document.getElementById('review-header-title');
    if (reviewHeaderTitle && currentSubject && currentTestIndex !== null) {
        reviewHeaderTitle.textContent = `${currentSubject} Test #${currentTestIndex + 1}`;
    }

    if (prometricDelay) {
        setTimeout(() => {
            showView('review-view');
            displayReviewGrid();
            updateReviewTimer();
            applyExamButtonTheme();
        }, 2000);
    } else {
        showView('review-view');
        displayReviewGrid();
        updateReviewTimer();
        applyExamButtonTheme();
    }
}

function applyTestReviewDarkModeFromPreference() {
    try {
        const isDarkMode = localStorage.getItem('subject-pages-dark-mode') === 'true';
        applyTestReviewDarkMode(isDarkMode);
    } catch (e) {
        console.warn('Failed to apply review dark mode from preference:', e);
    }
}

function applyTestReviewDarkMode(isDarkMode) {
    // Toggle body dark-mode class
    try {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    } catch (e) {
        console.warn('Failed to toggle body dark mode for review:', e);
    }

    // Update dark mode toggle icons in all exam/review headers
    try {
        const buttonIds = [
            'test-dark-mode-toggle',
            'review-dark-mode-toggle',
            'detailed-review-dark-mode-toggle',
            'tagged-questions-dark-mode-toggle',
            'previous-tests-dark-mode-toggle'
        ];
        buttonIds.forEach((id) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const icon = btn.querySelector('i[data-lucide]');
            if (!icon) return;
            icon.setAttribute('data-lucide', isDarkMode ? 'sun' : 'moon');
        });

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    } catch (e) {
        console.warn('Failed to update review dark mode icons:', e);
    }
}

function toggleTestReviewDarkMode() {
    let current = false;
    try {
        current = localStorage.getItem('subject-pages-dark-mode') === 'true';
    } catch (e) {
        console.warn('Failed to read dark mode preference:', e);
    }
    const next = !current;
    try {
        localStorage.setItem('subject-pages-dark-mode', next.toString());
    } catch (e) {
        console.warn('Failed to save dark mode preference:', e);
    }
    applyTestReviewDarkMode(next);
}

function updateReviewTimer() {
    const reviewTimer = document.getElementById('review-timer');
    if (!reviewTimer) return;

    // Format time remaining as MM:SS
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    reviewTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function jumpToQuestion(type, index) {
    const test = allTestData[currentSubject][currentTestIndex];
    let targetIndex = 0;

    if (typeof type === 'number') {
        // Direct index
        targetIndex = type;
    } else if (type === 'marked') {
        // Find first marked question
        for (let i = 0; i < test.length; i++) {
            if (markedQuestions[i]) {
                targetIndex = i;
                break;
            }
        }
    } else if (type === 'incomplete') {
        // Find first incomplete question
        for (let i = 0; i < test.length; i++) {
            if (userAnswers[i] === undefined) {
                targetIndex = i;
                break;
            }
        }
    } else if (type === 'all') {
        // Start from beginning
        targetIndex = 0;
    }

    currentQuestionIndex = targetIndex;
    showView('test-view');
    displayQuestion(targetIndex);
}

function showResultsView() {
    if ((!lastAttemptList || lastAttemptList.length === 0) && currentSubject && currentTestIndex !== null && currentTestIndex !== undefined) {
        const storedAttempts = getTestAttempts(currentSubject, currentTestIndex);
        if (storedAttempts.length > 0) {
            lastAttemptList = storedAttempts.slice();
            lastResultRecord = storedAttempts[storedAttempts.length - 1];
            if (lastResultRecord && lastResultRecord.total) {
                lastQuestionCount = lastResultRecord.total;
            }
        }
    }
    showView('results-view');
    refreshResultsSummaryUI(lastAttemptList, lastResultRecord);
    updateResultsAttemptCard(lastResultRecord, lastAttemptList);
}

function refreshResultsSummaryUI(attempts = [], record = null, options = {}) {
    const attemptList = Array.isArray(attempts) ? attempts : [];
    const attemptCount = attemptList.length;
    const shouldReset = !!options.reset;
    const fallbackRecord = attemptCount > 0 ? attemptList[attemptCount - 1] : null;
    const displayRecord = shouldReset ? null : (record || fallbackRecord);

    const subject = displayRecord && displayRecord.subject ? displayRecord.subject : currentSubject;
    const inferredIndex = displayRecord && typeof displayRecord.testIndex === 'number'
        ? displayRecord.testIndex
        : (typeof currentTestIndex === 'number' ? currentTestIndex : null);
    const testNumberLabel = inferredIndex !== null ? inferredIndex + 1 : '--';
    const scorePercent = displayRecord ? displayRecord.score : 0;
    const scaledScore = displayRecord ? getScaledScore(scorePercent) : 200;
    const averageEl = document.getElementById('result-average-score');
    const scoreRing = document.getElementById('result-score-ring');
    const scoreValueEl = document.getElementById('result-score-value');
    const dateChip = document.getElementById('result-date-chip');
    const attemptChip = document.getElementById('result-attempt-chip');
    const questionCountEl = document.getElementById('result-question-count');
    const titleEl = document.getElementById('result-test-title');
    const breadcrumbEl = document.getElementById('result-breadcrumb');
    const rawScoreEl = document.getElementById('results-raw-score');
    const correctTotalEl = document.getElementById('results-correct-total');
    const timePerQuestionEl = document.getElementById('results-time-per-question');
    const totalTimeEl = document.getElementById('results-total-time');

    if (scoreRing) {
        const degrees = Math.max(0, Math.min(360, scorePercent * 3.6));
        scoreRing.style.setProperty('--score-deg', `${degrees}deg`);
    }
    if (scoreValueEl) {
        scoreValueEl.textContent = displayRecord ? scaledScore : '--';
    }
    if (averageEl) {
        if (attemptCount > 0 && !shouldReset) {
            const totalScaled = attemptList.reduce((sum, attempt) => sum + getScaledScore(attempt.score), 0);
            const averageScaled = Math.round(totalScaled / attemptCount);
            averageEl.textContent = `Average: ${averageScaled}`;
        } else {
            averageEl.textContent = 'Average: --';
        }
    }
    if (dateChip) {
        dateChip.textContent = displayRecord ? formatResultDate(displayRecord.date) : '--';
    }
    if (attemptChip) {
        attemptChip.textContent = attemptCount > 0 && !shouldReset ? `Attempt ${attemptCount}` : 'No attempts yet';
    }
    if (questionCountEl) {
        const qCount = displayRecord ? displayRecord.total : lastQuestionCount;
        questionCountEl.textContent = qCount ? `${qCount} Questions` : '0 Questions';
    }
    if (titleEl) {
        titleEl.textContent = subject ? `${subject} Test #${testNumberLabel}` : 'Test Results';
    }
    if (breadcrumbEl) {
        breadcrumbEl.textContent = subject ? `${subject} ▸ Practice Test` : 'Practice Test';
    }
    if (rawScoreEl) {
        rawScoreEl.textContent = displayRecord ? `${displayRecord.score}%` : '--';
    }
    if (correctTotalEl) {
        correctTotalEl.textContent = displayRecord ? `${displayRecord.correct} / ${displayRecord.total}` : '--';
    }
    if (timePerQuestionEl) {
        timePerQuestionEl.textContent = displayRecord ? formatTimeDisplay(record && record.avgTimePerQuestionSeconds) : '--';
    }
    if (totalTimeEl) {
        totalTimeEl.textContent = displayRecord ? formatTimeDisplay(record && record.totalTimeSeconds) : '--';
    }
}

function updateResultsAttemptCard(record, attempts = []) {
    const card = document.getElementById('results-attempt-card');
    if (!card) return;

    if (!record) {
        card.style.display = 'none';
        return;
    }

    const subject = record.subject || currentSubject;
    const testIndex = typeof record.testIndex === 'number' ? record.testIndex : currentTestIndex;
    const total = record.total || 0;
    const correct = record.correct || 0;
    let correctPercent = total > 0 ? Math.round((correct / total) * 100) : 0;
    let incorrectPercent = Math.max(0, 100 - correctPercent);
    const taggedQuestions = getTaggedQuestions();
    let taggedCount = 0;
    if (taggedQuestions && typeof taggedQuestions === 'object') {
        Object.values(taggedQuestions).forEach(tag => {
            if (tag && tag.subject === subject && tag.testIndex === testIndex) {
                taggedCount++;
            }
        });
    }

    const attemptIndexEl = document.getElementById('results-attempt-index');
    const titleEl = document.getElementById('results-attempt-title');
    const taggedInfoEl = document.getElementById('results-tagged-info');
    const progressCorrectEl = document.getElementById('results-progress-correct');
    const progressIncorrectEl = document.getElementById('results-progress-incorrect');
    const progressTextEl = document.getElementById('results-progress-text');
    const dateEl = document.getElementById('results-meta-date');
    const scoreEl = document.getElementById('results-meta-score');
    const correctEl = document.getElementById('results-meta-correct');
    const attemptsEl = document.getElementById('results-meta-attempts');

    if (attemptIndexEl) {
        attemptIndexEl.textContent = attempts.length;
    }
    if (titleEl) {
        const testNumber = testIndex !== null && testIndex !== undefined ? `Test #${testIndex + 1}` : 'Test';
        titleEl.textContent = `${subject || 'Subject'} ${testNumber}`;
    }
    if (taggedInfoEl) {
        taggedInfoEl.textContent = `${taggedCount} of ${total} questions tagged`;
    }

    if (progressCorrectEl) {
        progressCorrectEl.style.width = `${correctPercent}%`;
    }
    if (progressIncorrectEl) {
        progressIncorrectEl.style.width = `${incorrectPercent}%`;
    }
    if (progressTextEl) {
        progressTextEl.textContent = `${correct} of ${total} correct`;
    }

    if (dateEl) {
        dateEl.textContent = formatResultDate(record.date);
    }
    if (scoreEl) {
        scoreEl.textContent = getScaledScore(record.score);
    }
    if (correctEl) {
        correctEl.textContent = `${correct} / ${total}`;
    }
    if (attemptsEl) {
        attemptsEl.textContent = attempts.length;
    }

    card.style.display = 'flex';
}

function updateResultsAttemptModal(record, attempts = []) {
    const backdrop = document.getElementById('results-modal-backdrop');
    const card = document.getElementById('results-modal-card');
    if (!backdrop || !card) return;

    if (!record) {
        backdrop.style.display = 'none';
        return;
    }

    const subject = record.subject || currentSubject;
    const testIndex = typeof record.testIndex === 'number' ? record.testIndex : currentTestIndex;
    const total = record.total || 0;
    const correct = record.correct || 0;
    const correctPercent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const incorrectPercent = Math.max(0, 100 - correctPercent);
    const taggedQuestions = getTaggedQuestions();
    let taggedCount = 0;
    Object.values(taggedQuestions).forEach(tag => {
        if (tag.subject === subject && tag.testIndex === testIndex) taggedCount++;
    });

    const attemptsCount = Array.isArray(attempts) ? attempts.length : 1;
    const scaledScore = getScaledScore(record.score || 0);

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    setText('results-modal-test-title', `${subject} Test #${(testIndex ?? -1) + 1}`);
    setText('results-modal-tagged', `${taggedCount} of ${total} questions tagged`);
    setText('results-modal-progress-text', `${correct} of ${total} correct`);
    setText('results-modal-date', formatResultDate(record.date));
    setText('results-modal-score', scaledScore);
    setText('results-modal-correct', `${correct} / ${total}`);
    setText('results-modal-attempts', attemptsCount);
    const indexEl = document.getElementById('results-modal-index');
    if (indexEl) indexEl.textContent = attemptsCount;

    const progressCorrect = document.getElementById('results-modal-progress-correct');
    const progressIncorrect = document.getElementById('results-modal-progress-incorrect');
    if (progressCorrect) progressCorrect.style.width = `${correctPercent}%`;
    if (progressIncorrect) progressIncorrect.style.width = `${incorrectPercent}%`;

    backdrop.style.display = 'flex';
}

function handleResetCurrentTest() {
    const subject = currentSubject || (lastResultRecord && lastResultRecord.subject);
    const index = currentTestIndex !== null && currentTestIndex !== undefined
        ? currentTestIndex
        : (lastResultRecord && typeof lastResultRecord.testIndex === 'number' ? lastResultRecord.testIndex : null);

    if (!subject || index === null) {
        alert('No test attempt found to reset.');
        return;
    }

    if (!window.confirm('Reset attempt history for this test? This will clear all saved scores and progress.')) {
        return;
    }

    if (!performTestReset(subject, index)) {
        alert('Unable to reset this test. Please try again.');
        return;
    }

    lastAttemptList = [];
    lastResultRecord = null;
    lastQuestionCount = 0;
    refreshResultsSummaryUI([], null, { reset: true });
    updateResultsAttemptCard(null);
    closeResultsModal();
    if (subject === currentSubject) {
        displayTestList(subject);
    }
}

function openSubmitConfirmation() {
    console.log('📝 openSubmitConfirmation called');
    const modal = document.getElementById('confirm-submit-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.zIndex = '10000';
        console.log('✅ Submit confirmation modal shown');
        // Prevent ESC key from closing (block background interaction)
        document.body.style.overflow = 'hidden';

        // Prevent ESC key from closing modal
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        modal._escHandler = escHandler;
        document.addEventListener('keydown', escHandler, true);
    } else {
        console.error('❌ Submit confirmation modal not found!');
    }
}

function closeSubmitConfirmation() {
    console.log('📝 closeSubmitConfirmation called');
    const modal = document.getElementById('confirm-submit-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        console.log('✅ Submit confirmation modal hidden');
        // Remove ESC key handler
        if (modal._escHandler) {
            document.removeEventListener('keydown', modal._escHandler, true);
            delete modal._escHandler;
        }
    }
    // Restore body overflow
    document.body.style.overflow = '';
}

function confirmSubmitTest() {
    closeSubmitConfirmation();
    endTest();
}

function displayReviewGrid() {
    const test = allTestData[currentSubject][currentTestIndex];
    const container = document.getElementById('review-grid-container');

    if (!container) return;

    container.innerHTML = '';

    // Create table rows
    test.forEach((q, i) => {
        const row = document.createElement('div');
        row.className = 'review-row grid grid-cols-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer';
        row.onclick = () => {
            currentQuestionIndex = i;
            showView('test-view');
            displayQuestion(i);
        };

        // Name column with document icon and green checkmark
        const nameCell = document.createElement('div');
        nameCell.className = 'px-3 py-2 flex items-center space-x-2';
        nameCell.style.fontSize = '14px';
        nameCell.style.fontWeight = 'normal';
        nameCell.style.fontFamily = 'Arial, sans-serif';
        nameCell.innerHTML = `
            <div class="relative" style="width: 16px; height: 16px; flex-shrink: 0;">
                <svg style="width: 16px; height: 16px; color: #4b5563;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
                <svg style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; color: #16a34a;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
            </div>
            <span style="font-size: 14px; font-weight: normal; color: #374151; font-family: Arial, sans-serif;">Question ${i + 1}</span>
        `;

        // Marked column
        const markedCell = document.createElement('div');
        markedCell.className = 'px-3 py-2';
        markedCell.style.fontSize = '14px';
        markedCell.style.fontWeight = 'normal';
        markedCell.style.color = '#374151';
        markedCell.style.fontFamily = 'Arial, sans-serif';
        markedCell.textContent = markedQuestions[i] ? 'Yes' : '';

        // Completed column
        const completedCell = document.createElement('div');
        completedCell.className = 'px-3 py-2';
        completedCell.style.fontSize = '14px';
        completedCell.style.fontWeight = 'normal';
        completedCell.style.color = '#374151';
        completedCell.style.fontFamily = 'Arial, sans-serif';
        completedCell.textContent = userAnswers[i] !== undefined ? 'Yes' : '';

        // Skipped column
        const skippedCell = document.createElement('div');
        skippedCell.className = 'px-3 py-2';
        skippedCell.style.fontSize = '14px';
        skippedCell.style.fontWeight = 'normal';
        skippedCell.style.color = '#374151';
        skippedCell.style.fontFamily = 'Arial, sans-serif';
        skippedCell.textContent = userAnswers[i] === undefined ? 'Yes' : '';

        row.appendChild(nameCell);
        row.appendChild(markedCell);
        row.appendChild(completedCell);
        row.appendChild(skippedCell);

        container.appendChild(row);
    });
}

function startTimer() {
    if (testTimer) clearInterval(testTimer);

    testTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        // Auto-save state every 10 seconds (to preserve time remaining and progress)
        if (timeRemaining % 10 === 0) {
            saveFullExamState();
        }

        if (timeRemaining <= 0) {
            clearInterval(testTimer);
            endTest();
        }
    }, 1000);

    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const timerElement = document.getElementById('test-timer');
    if (timerElement) {
        timerElement.textContent = timeString;
    }

    // Also update review timer if review view is visible
    updateReviewTimer();
}

function saveCompletedTest(testResult) {
    try {
        // Save to InstantDB if available and user is authenticated
        if (window.InstantDB && window.InstantDB.isAuthenticated && window.InstantDB.isAuthenticated()) {
            if (window.InstantDB.saveTestAttempt) {
                window.InstantDB.saveTestAttempt({
                    subject: testResult.subject,
                    testIndex: testResult.testIndex,
                    score: testResult.score,
                    correct: testResult.correct,
                    total: testResult.total,
                    date: testResult.date || new Date().toISOString(),
                    userAnswers: testResult.userAnswers || {},
                    markedQuestions: testResult.markedQuestions || {},
                    totalTimeSeconds: testResult.totalTimeSeconds || 0,
                    avgTimePerQuestionSeconds: testResult.avgTimePerQuestionSeconds || 0,
                    highlights: testResult.highlights || {},
                    passageHighlights: testResult.passageHighlights || {},
                    passageHighlightsData: testResult.passageHighlightsData || {}
                });
            }
        } else {
            console.log('Anonymous user - test result not saved to database');
        }

        // Keep localStorage as fallback for now (will be removed later)
        const key = `completed-test-${testResult.subject}-${testResult.testIndex}`;
        localStorage.setItem(key, JSON.stringify(testResult));

        // Also save to a list of all completed tests
        const completedTestsKey = 'completed-tests-list';
        let completedTests = JSON.parse(localStorage.getItem(completedTestsKey) || '[]');

        // Check if this test already exists and remove it
        completedTests = completedTests.filter(t =>
            !(t.subject === testResult.subject && t.testIndex === testResult.testIndex)
        );

        // Add the new result
        completedTests.push({
            subject: testResult.subject,
            testIndex: testResult.testIndex,
            date: testResult.date,
            score: testResult.score
        });

        localStorage.setItem(completedTestsKey, JSON.stringify(completedTests));
    } catch (e) {
        console.error('Error saving completed test:', e);
    }
}

function endTest() {
    examSubmitted = true;
    console.log('endTest called', { currentSubject, currentTestIndex, userAnswers: Object.keys(userAnswers).length });
    closeSubmitConfirmation();

    // Stop the timer
    if (testTimer) {
        clearInterval(testTimer);
        testTimer = null;
    }

    // Disable exit warning since test is being submitted
    disableTestExitWarning();

    // Exit fullscreen
    try {
        exitFullscreen();
    } catch (e) {
        console.warn('Error exiting fullscreen:', e);
    }

    // Show results and save attempt BEFORE clearing state
    showResults();

    // Clear saved test state AFTER saving the attempt
    if (currentSubject && currentTestIndex !== null && currentTestIndex !== undefined) {
        clearTestState(currentSubject, currentTestIndex);
        console.log('🗑️ Test state cleared after submission');
    }
}

function showResults() {
    // Check if we have valid test data
    if (!currentSubject || currentTestIndex === null || currentTestIndex === undefined) {
        console.error('Cannot show results: missing test data', { currentSubject, currentTestIndex });
        alert('Error: Test data not found. Please try again.');
        return;
    }

    const test = allTestData[currentSubject] && allTestData[currentSubject][currentTestIndex];
    if (!test) {
        console.error('Cannot show results: test not found', { currentSubject, currentTestIndex });
        alert('Error: Test not found. Please try again.');
        return;
    }

    console.log('📊 Calculating results:', {
        testLength: test.length,
        userAnswersCount: Object.keys(userAnswers).length,
        userAnswers: userAnswers
    });

    // Track time on current question before ending
    if (currentQuestionIndex !== undefined && questionStartTime[currentQuestionIndex] !== undefined) {
        const timeSpent = Date.now() - questionStartTime[currentQuestionIndex];
        questionTimeSpent[currentQuestionIndex] = (questionTimeSpent[currentQuestionIndex] || 0) + timeSpent;
    }

    let correct = 0;
    test.forEach((q, i) => {
        if (userAnswers[i] !== undefined && userAnswers[i] === q.a) {
            correct++;
        }
    });

    // Use proper OAT scoring system (200-400 scale) instead of percentage
    const score = calculateOATScore(correct, test.length, currentSubject);

    console.log('📊 Score calculation:', {
        correct,
        total: test.length,
        score,
        subject: currentSubject,
        userAnswers: userAnswers
    });

    // Calculate total time
    const totalTimeMs = testStartTime ? Date.now() - testStartTime : 0;
    const totalTimeSeconds = Math.max(0, Math.round(totalTimeMs / 1000));

    // Calculate average time per question (seconds)
    const totalQuestionTime = Object.values(questionTimeSpent).reduce((sum, time) => sum + time, 0);
    const avgTimePerQuestion = test.length > 0 ? Math.round(totalQuestionTime / test.length / 1000) : 0;

    const attemptDate = new Date();
    const attemptRecord = {
        subject: currentSubject,
        testIndex: currentTestIndex,
        score,
        correct,
        total: test.length,
        totalTimeSeconds,
        avgTimePerQuestionSeconds: avgTimePerQuestion,
        date: attemptDate.toISOString(),
        // Store full state so individual attempts can be reviewed later
        userAnswers: { ...userAnswers },
        markedQuestions: { ...markedQuestions },
        highlights: JSON.parse(JSON.stringify(highlights)),
        passageHighlights: JSON.parse(JSON.stringify(passageHighlights)),
        passageHighlightsData: window.PassageHighlightSystem ? window.PassageHighlightSystem.exportAll() : {},
        questionTimeSpent: { ...questionTimeSpent }
    };
    lastQuestionCount = test.length;

    console.log('💾 Saving attempt record:', attemptRecord);

    // Save highlights and strikethroughs to localStorage only when test is completed
    try {
        saveHighlightsToLocalStorage();
        if (window.PassageHighlightSystem && typeof window.PassageHighlightSystem.persistAll === 'function') {
            window.PassageHighlightSystem.persistAll();
        }
    } catch (e) {
        console.error('Error saving highlights:', e);
    }

    // Save completed test result
    try {
        saveCompletedTest({
            subject: currentSubject,
            testIndex: currentTestIndex,
            score: score,
            correct: correct,
            total: test.length,
            totalTime: totalTimeMs,
            avgTimePerQuestion: avgTimePerQuestion,
            date: attemptRecord.date,
            userAnswers: { ...userAnswers },
            markedQuestions: { ...markedQuestions },
            highlights: JSON.parse(JSON.stringify(highlights)),
            passageHighlights: JSON.parse(JSON.stringify(passageHighlights)),
            passageHighlightsData: window.PassageHighlightSystem ? window.PassageHighlightSystem.exportAll() : {}
        });
        console.log('✅ Completed test saved to localStorage');
    } catch (e) {
        console.error('Error saving completed test:', e);
    }

    // Record the attempt in test history
    try {
        const attempts = recordTestAttempt(attemptRecord);
        console.log('✅ Attempt recorded. Total attempts:', attempts.length);
        lastResultRecord = attemptRecord;
        lastAttemptList = attempts.slice();
    } catch (e) {
        console.error('❌ Error recording test attempt:', e);
        alert('Error saving test attempt. Please check the console for details.');
    }

    // Return to the subject dashboard (single review surface) instead of showing the legacy results view
    const subjectToReturnTo = currentSubject;
    if (subjectToReturnTo) {
        try {
            const syncKey = 'test-completion-sync';
            localStorage.setItem(syncKey, Date.now().toString());
            localStorage.getItem(syncKey);
        } catch (e) {
            console.warn('localStorage sync check failed:', e);
        }

        showSubject(subjectToReturnTo, null);

        try {
            const testCompletedEvent = new CustomEvent('test-completed', {
                detail: {
                    subject: subjectToReturnTo,
                    testIndex: currentTestIndex,
                    score: score,
                    correct: correct
                }
            });
            window.dispatchEvent(testCompletedEvent);
            console.log('📢 Dispatched test-completed event');
        } catch (e) {
            console.warn('Failed to dispatch test-completed event:', e);
        }

        let refreshAttempts = 0;
        const refreshComponent = () => {
            if (typeof window.initializeSubjectPagesReact === 'function') {
                try {
                    window.initializeSubjectPagesReact(subjectToReturnTo);
                    if (refreshAttempts === 0) {
                        setTimeout(() => {
                            try {
                                const testCompletedEvent = new CustomEvent('test-completed', {
                                    detail: {
                                        subject: subjectToReturnTo,
                                        testIndex: currentTestIndex,
                                        score: score,
                                        correct: correct
                                    }
                                });
                                window.dispatchEvent(testCompletedEvent);
                            } catch (e) {
                                console.warn('Failed to dispatch test-completed event (retry):', e);
                            }
                        }, 100);
                    }
                    if (refreshAttempts < 2) {
                        refreshAttempts++;
                        setTimeout(refreshComponent, 200);
                    }
                } catch (refreshError) {
                    console.error('Error refreshing React component:', refreshError);
                    if (refreshAttempts < 5) {
                        refreshAttempts++;
                        setTimeout(refreshComponent, 100);
                    }
                }
            } else if (refreshAttempts < 10) {
                refreshAttempts++;
                setTimeout(refreshComponent, 50);
            }
        };

        setTimeout(refreshComponent, 50);
        setTimeout(refreshComponent, 200);
        setTimeout(refreshComponent, 400);
    } else {
        console.log('⚠️ No subject to return to, going to dashboard');
        showView('dashboard-view', null, document.getElementById('nav-home'));
    }
}

// Show detailed review page
function showDetailedReview() {
    detailedReviewQuestionIndex = 0;

    // ... rest of the code remains the same ...
    // Set view mode to 'review' for detailed review
    currentViewMode = 'review';
    saveFullExamState();

    showView('detailed-review-view');
    applyReviewFilters();
    applyExamButtonTheme();
}

// Update detailed review display
function updateDetailedReview() {
    const test = allTestData[currentSubject][currentTestIndex];
    const question = test[detailedReviewQuestionIndex];

    if (!question) return;

    // Update header
    const reviewTitle = document.getElementById('review-test-title');
    if (reviewTitle) {
        reviewTitle.textContent = `${currentSubject} Test #${currentTestIndex + 1}`;
    }
    const progressCount = document.getElementById('review-progress-count');
    if (progressCount) {
        progressCount.textContent = `${detailedReviewQuestionIndex + 1} / ${test.length}`;
    }
    document.getElementById('review-q-number').textContent = detailedReviewQuestionIndex + 1;
    document.getElementById('review-q-total').textContent = test.length;

    // Update question stem
    document.getElementById('review-q-stem').textContent = question.stem;

    // Update answer choices
    const choicesContainer = document.getElementById('review-q-choices');
    choicesContainer.innerHTML = '';

    const userAnswer = userAnswers[detailedReviewQuestionIndex];
    const correctAnswer = question.a;
    const isCorrect = userAnswer === correctAnswer;

    question.c.forEach((choice, i) => {
        const choiceDiv = document.createElement('div');
        choiceDiv.className = 'review-choice';
        if (i === correctAnswer) {
            choiceDiv.classList.add('correct');
        }
        if (i === userAnswer && !isCorrect) {
            choiceDiv.classList.add('incorrect');
        }
        choiceDiv.innerHTML = `
            <label>
                <span class="choice-letter">${String.fromCharCode(65 + i)}</span>
                <span>${choice}</span>
            </label>
            ${i === correctAnswer
                ? '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
                : (i === userAnswer && !isCorrect
                    ? '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>'
                    : '')
            }
        `;
        choicesContainer.appendChild(choiceDiv);
    });

    // Update meta chips
    const statusChip = document.getElementById('review-status-chip');
    const feedbackStatus = document.getElementById('review-feedback-status');
    const correctAnswerText = document.getElementById('review-correct-answer');
    const userAnswerText = document.getElementById('review-user-answer');
    const timeSpentText = document.getElementById('review-time-spent');

    if (statusChip && feedbackStatus) {
        statusChip.classList.remove('success', 'error');
        statusChip.classList.add(isCorrect ? 'success' : 'error');
        feedbackStatus.textContent = isCorrect ? 'Correct' : 'Incorrect';
    }

    if (correctAnswerText) {
        correctAnswerText.textContent = `Correct Answer: ${String.fromCharCode(65 + correctAnswer)}`;
    }
    if (userAnswerText) {
        userAnswerText.textContent = `Your Answer: ${userAnswer !== undefined ? String.fromCharCode(65 + userAnswer) : 'Not answered'}`;
    }

    const timeSpent = questionTimeSpent[detailedReviewQuestionIndex] || 0;
    const minutes = Math.floor(timeSpent / 60000);
    const seconds = Math.floor((timeSpent % 60000) / 1000);
    if (timeSpentText) {
        timeSpentText.textContent = `Time Spent: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    updateReviewCounters();
    updateReviewQuestionList();
    updateTagButton();

    applyExamButtonTheme();
}

// Toggle subjects list visibility
function toggleSubjects(event) {
    if (event) event.preventDefault();
    const subjectsList = document.getElementById('subjects-list');
    const chevron = document.getElementById('subjects-chevron');

    if (!subjectsList || !chevron) return;

    // Toggle visibility
    const isHidden = subjectsList.style.display === 'none' || subjectsList.style.display === '';
    if (isHidden) {
        subjectsList.style.display = 'block';
        chevron.style.transform = 'rotate(90deg)';
    } else {
        subjectsList.style.display = 'none';
        chevron.style.transform = 'rotate(0deg)';
    }
}

// Toggle tag for current question in review
function toggleTagQuestion() {
    if (!currentSubject || currentTestIndex === null || detailedReviewQuestionIndex === undefined) return;

    const tagKey = `${currentSubject}-${currentTestIndex}-${detailedReviewQuestionIndex}`;
    let taggedQuestions = getTaggedQuestions();
    const wasTagged = !!taggedQuestions[tagKey];

    if (wasTagged) {
        // Untag
        delete taggedQuestions[tagKey];
    } else {
        // Tag
        const test = allTestData[currentSubject][currentTestIndex];
        const question = test[detailedReviewQuestionIndex];
        if (!question) return;

        taggedQuestions[tagKey] = {
            subject: currentSubject,
            testIndex: currentTestIndex,
            questionIndex: detailedReviewQuestionIndex,
            question: question.stem,
            correctAnswer: question.a,
            choices: question.c,
            userAnswer: userAnswers[detailedReviewQuestionIndex],
            date: new Date().toISOString()
        };
    }

    saveTaggedQuestions(taggedQuestions);
    updateTagButton();
    updateReviewQuestionList();

    // Update tagged questions list if the view is open
    if (document.getElementById('tagged-questions-view') &&
        document.getElementById('tagged-questions-view').style.display !== 'none') {
        const allTagged = getTaggedQuestions();
        taggedReviewAllItems = Object.values(allTagged);
        taggedReviewAllItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        filterTaggedQuestions(taggedReviewFilter);
    }
}

// Update tag button appearance
function updateTagButton() {
    if (!currentSubject || currentTestIndex === null || detailedReviewQuestionIndex === undefined) return;

    const tagKey = `${currentSubject}-${currentTestIndex}-${detailedReviewQuestionIndex}`;
    const taggedQuestions = getTaggedQuestions();
    const isTagged = !!taggedQuestions[tagKey];

    const tagBtn = document.getElementById('review-tag-btn');
    const tagIcon = document.getElementById('review-tag-icon');
    const tagText = document.getElementById('review-tag-text');

    if (!tagBtn || !tagIcon || !tagText) return;

    if (isTagged) {
        tagBtn.className = 'px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2';
        tagIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>';
        tagText.textContent = 'Tagged';
    } else {
        tagBtn.className = 'px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 flex items-center gap-2';
        tagIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>';
        tagText.textContent = 'Tag Question';
    }
}

// Get tagged questions from localStorage
function getTaggedQuestions() {
    try {
        return JSON.parse(localStorage.getItem('tagged_questions') || '{}');
    } catch (e) {
        console.error('Failed to load tagged questions:', e);
        return {};
    }
}

// Save tagged questions to localStorage
function saveTaggedQuestions(taggedQuestions) {
    try {
        localStorage.setItem('tagged_questions', JSON.stringify(taggedQuestions));
    } catch (e) {
        console.error('Failed to save tagged questions:', e);
    }
}

// Toggle subject filters visibility in tagged questions view
function toggleTaggedSubjectFilters() {
    const filtersList = document.getElementById('tagged-subject-filters-list');
    const chevron = document.getElementById('tagged-subject-chevron');

    if (!filtersList || !chevron) return;

    const isHidden = filtersList.style.display === 'none';

    if (isHidden) {
        filtersList.style.display = 'flex';
        chevron.style.transform = 'rotate(0deg)';
    } else {
        filtersList.style.display = 'none';
        chevron.style.transform = 'rotate(-90deg)';
    }
}

// Update tagged question counts (respects current filters)
function updateTaggedQuestionCounts() {
    const counts = { correct: 0, incorrect: 0, unanswered: 0 };

    // Count based on filtered items that match the subject filter
    const taggedQuestions = getTaggedQuestions();
    let itemsToCount = Object.values(taggedQuestions);

    // Apply subject filter to counts
    if (taggedSubjectFilter !== 'all') {
        itemsToCount = itemsToCount.filter(item => item.subject === taggedSubjectFilter);
    }

    itemsToCount.forEach(item => {
        if (item.userAnswer === undefined) {
            counts.unanswered++;
        } else if (item.userAnswer === item.correctAnswer) {
            counts.correct++;
        } else {
            counts.incorrect++;
        }
    });

    const correctEl = document.getElementById('tagged-correct-count');
    const incorrectEl = document.getElementById('tagged-incorrect-count');
    const unansweredEl = document.getElementById('tagged-unanswered-count');

    if (correctEl) correctEl.textContent = counts.correct;
    if (incorrectEl) incorrectEl.textContent = counts.incorrect;
    if (unansweredEl) unansweredEl.textContent = counts.unanswered;
}

// Filter tagged questions by subject
function filterTaggedBySubject(subject) {
    taggedSubjectFilter = subject;

    // Map subject names to button IDs
    const subjectIdMap = {
        'all': 'tagged-subject-all',
        'Biology': 'tagged-subject-biology',
        'General Chemistry': 'tagged-subject-genchem',
        'Organic Chemistry': 'tagged-subject-ochem',
        'Reading Comprehension': 'tagged-subject-reading',
        'Physics': 'tagged-subject-physics',
        'Quantitative Reasoning': 'tagged-subject-quant'
    };

    // Update active button
    document.querySelectorAll('#tagged-questions-view .review-sidebar-filters:first-of-type .review-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const buttonId = subjectIdMap[subject];
    if (buttonId) {
        document.getElementById(buttonId)?.classList.add('active');
    }

    // Update title to show selected subject
    const titleEl = document.getElementById('tagged-test-title');
    if (titleEl) {
        titleEl.textContent = subject === 'all' ? 'All Tagged Questions' : `${subject} - Tagged Questions`;
    }

    // Apply filters
    applyTaggedFilters();
}

// Apply all tagged question filters (subject + status + search)
function applyTaggedFilters() {
    const taggedQuestions = getTaggedQuestions();
    let allItems = Object.values(taggedQuestions);

    // Sort by date (newest first)
    allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter by subject
    if (taggedSubjectFilter !== 'all') {
        allItems = allItems.filter(item => item.subject === taggedSubjectFilter);
    }

    taggedReviewAllItems = allItems;

    // Filter by status
    taggedReviewFilteredItems = allItems.filter(item => {
        const isCorrect = item.userAnswer === item.correctAnswer;
        const isAnswered = item.userAnswer !== undefined;

        if (taggedReviewFilter === 'all') return true;
        if (taggedReviewFilter === 'correct') return isCorrect;
        if (taggedReviewFilter === 'incorrect') return !isCorrect && isAnswered;
        if (taggedReviewFilter === 'unanswered') return !isAnswered;
        return true;
    });

    // Apply search if any
    const searchTerm = taggedReviewSearch.toLowerCase();
    if (searchTerm) {
        taggedReviewFilteredItems = taggedReviewFilteredItems.filter(item =>
            item.question.toLowerCase().includes(searchTerm)
        );
    }

    // Update counts based on filtered subject
    updateTaggedQuestionCounts();

    // Adjust index if needed
    if (taggedReviewIndex >= taggedReviewFilteredItems.length) {
        taggedReviewIndex = Math.max(0, taggedReviewFilteredItems.length - 1);
    }

    if (taggedReviewFilteredItems.length > 0) {
        updateTaggedReview();
    }
    updateTaggedQuestionList();
}

// Show tagged questions view
function showTaggedQuestions(event) {
    if (event) event.preventDefault();

    const taggedQuestions = getTaggedQuestions();
    taggedReviewAllItems = Object.values(taggedQuestions);

    if (taggedReviewAllItems.length === 0) {
        alert('No tagged questions yet. Tag questions during review to see them here.');
        return;
    }

    // Sort by date (newest first)
    taggedReviewAllItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    taggedReviewFilteredItems = taggedReviewAllItems.slice();
    taggedReviewIndex = 0;
    taggedReviewFilter = 'all';
    taggedSubjectFilter = 'all';
    taggedReviewSearch = '';

    // Reset filter buttons
    document.querySelectorAll('#tagged-questions-view .review-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('tagged-subject-all')?.classList.add('active');
    document.getElementById('tagged-filter-all')?.classList.add('active');

    // Update counts
    updateTaggedQuestionCounts();

    showView('tagged-questions-view');

    // Update dark mode toggle icon
    if (window.lucide) {
        setTimeout(() => {
            lucide.createIcons();
        }, 100);
    }

    if (taggedReviewFilteredItems.length > 0) {
        updateTaggedReview();
    }
    updateTaggedQuestionList();
}

// Filter tagged questions by status
function filterTaggedQuestions(filter) {
    taggedReviewFilter = filter;

    // Update active button
    document.querySelectorAll('#tagged-questions-view .review-sidebar-filters:last-of-type .review-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`tagged-filter-${filter}`)?.classList.add('active');

    // Apply all filters
    applyTaggedFilters();
}

// Handle tagged search
function handleTaggedSearch() {
    const searchInput = document.getElementById('tagged-search-input');
    taggedReviewSearch = searchInput ? searchInput.value : '';
    applyTaggedFilters();
}

// Update tagged question list in sidebar
function updateTaggedQuestionList() {
    const listContainer = document.getElementById('tagged-question-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (taggedReviewFilteredItems.length === 0) {
        listContainer.innerHTML = '<div class="p-4 text-center text-sm opacity-60">No questions match filter</div>';
        return;
    }

    taggedReviewFilteredItems.forEach((item, index) => {
        const isCorrect = item.userAnswer === item.correctAnswer;
        const isAnswered = item.userAnswer !== undefined;
        const isActive = index === taggedReviewIndex;

        let statusClass = 'unanswered';
        if (isAnswered) {
            statusClass = isCorrect ? 'correct' : 'incorrect';
        }

        const listItem = document.createElement('div');
        listItem.className = 'review-question-item';
        if (isActive) listItem.classList.add('active');
        listItem.classList.add(statusClass);
        listItem.onclick = () => {
            taggedReviewIndex = index;
            updateTaggedReview();
            updateTaggedQuestionList();
        };

        listItem.innerHTML = `
            <span class="status-dot"></span>
            <span class="flex-1 text-sm">Question ${item.questionIndex + 1}</span>
            <span class="tag-indicator">★</span>
        `;
        listContainer.appendChild(listItem);
    });
}

// Update tagged question display
function updateTaggedReview() {
    if (taggedReviewFilteredItems.length === 0) return;

    const currentItem = taggedReviewFilteredItems[taggedReviewIndex];
    if (!currentItem) return;

    // Load the question data
    const test = allTestData[currentItem.subject]?.[currentItem.testIndex];
    if (!test) return;

    const question = test[currentItem.questionIndex];
    if (!question) return;

    const isAnswered = currentItem.userAnswer !== undefined;
    const isCorrect = isAnswered && currentItem.userAnswer === question.a;
    const userAnswerLetter = isAnswered ? String.fromCharCode(65 + currentItem.userAnswer) : '--';
    const correctAnswerLetter = String.fromCharCode(65 + question.a);

    // Update header
    document.getElementById('tagged-q-number').textContent = taggedReviewIndex + 1;
    document.getElementById('tagged-q-total').textContent = taggedReviewFilteredItems.length;
    document.getElementById('tagged-q-stem').textContent = question.stem;

    // Update status chips
    const statusChip = document.getElementById('tagged-status-chip');
    const feedbackStatus = document.getElementById('tagged-feedback-status');
    if (!isAnswered) {
        statusChip.className = 'review-meta-chip';
        feedbackStatus.textContent = 'Unanswered';
    } else if (isCorrect) {
        statusChip.className = 'review-meta-chip success';
        feedbackStatus.textContent = 'Correct';
    } else {
        statusChip.className = 'review-meta-chip error';
        feedbackStatus.textContent = 'Incorrect';
    }

    document.getElementById('tagged-correct-answer').textContent = `Correct Answer: ${correctAnswerLetter}`;
    document.getElementById('tagged-user-answer').textContent = `Your Answer: ${userAnswerLetter}`;
    const subjectInfoEl = document.getElementById('tagged-subject-info');
    if (subjectInfoEl) {
        subjectInfoEl.textContent = `${currentItem.subject} Test #${currentItem.testIndex + 1}`;
    }

    // Update choices
    const choicesContainer = document.getElementById('tagged-q-choices');
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
        question.c.forEach((choice, index) => {
            const choiceDiv = document.createElement('div');
            choiceDiv.className = 'review-choice';

            const isUserAnswer = currentItem.userAnswer === index;
            const isCorrectAnswer = question.a === index;

            if (isCorrectAnswer) {
                choiceDiv.classList.add('correct');
            } else if (isUserAnswer) {
                choiceDiv.classList.add('incorrect');
            }

            const letter = String.fromCharCode(65 + index);
            choiceDiv.innerHTML = `
                <label>
                    <span class="choice-letter">${letter}</span>
                    <span>${escapeHtml(choice)}</span>
                </label>
                ${isCorrectAnswer ? '<svg width="18" height="18" fill="#22c55e" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' : ''}
                ${(isUserAnswer && !isCorrectAnswer) ? '<svg width="18" height="18" fill="#ef4444" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>' : ''}
            `;
            choicesContainer.appendChild(choiceDiv);
        });
    }

    // Update explanation
    const explanationEl = document.getElementById('tagged-explanation');
    if (explanationEl) {
        explanationEl.innerHTML = `<p>${escapeHtml(question.explanation || 'No explanation available.')}</p>`;
    }

    // Update progress
    document.getElementById('tagged-progress-count').textContent = `${taggedReviewIndex + 1} / ${taggedReviewFilteredItems.length}`;
}

// Navigate tagged questions
function taggedPrevQuestion() {
    if (taggedReviewIndex > 0) {
        taggedReviewIndex--;
        updateTaggedReview();
        updateTaggedQuestionList();
    }
}

function taggedNextQuestion() {
    if (taggedReviewIndex < taggedReviewFilteredItems.length - 1) {
        taggedReviewIndex++;
        updateTaggedReview();
        updateTaggedQuestionList();
    }
}

// Toggle tag from tagged questions view
function toggleTagQuestionFromTagged() {
    if (taggedReviewFilteredItems.length === 0) return;

    const currentItem = taggedReviewFilteredItems[taggedReviewIndex];
    const tagKey = `${currentItem.subject}-${currentItem.testIndex}-${currentItem.questionIndex}`;

    // Remove the tag
    const taggedQuestions = getTaggedQuestions();
    delete taggedQuestions[tagKey];
    saveTaggedQuestions(taggedQuestions);

    // Remove from filtered items
    taggedReviewFilteredItems.splice(taggedReviewIndex, 1);
    taggedReviewAllItems = taggedReviewAllItems.filter(item =>
        `${item.subject}-${item.testIndex}-${item.questionIndex}` !== tagKey
    );

    // Adjust index if needed
    if (taggedReviewIndex >= taggedReviewFilteredItems.length) {
        taggedReviewIndex = Math.max(0, taggedReviewFilteredItems.length - 1);
    }

    // Update display
    if (taggedReviewFilteredItems.length === 0) {
        showView('dashboard-view');
        alert('No more tagged questions.');
    } else {
        updateTaggedReview();
        updateTaggedQuestionList();
    }
}

// Display tagged questions list
function displayTaggedQuestions() {
    const container = document.getElementById('tagged-questions-list');
    if (!container) return;

    const taggedQuestions = getTaggedQuestions();
    const taggedArray = Object.values(taggedQuestions);

    if (taggedArray.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No tagged questions</h3>
                <p class="mt-1 text-sm text-gray-500">Tag questions during review to see them here.</p>
            </div>
        `;
        return;
    }

    // Sort by date (newest first)
    taggedArray.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = '';

    taggedArray.forEach((tagged, index) => {
        const tagDate = new Date(tagged.date);
        const dateStr = tagDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const isCorrect = tagged.userAnswer === tagged.correctAnswer;

        const questionDiv = document.createElement('div');
        questionDiv.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer';
        questionDiv.onclick = () => viewTaggedQuestion(tagged);
        questionDiv.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">${tagged.subject} - Test #${tagged.testIndex + 1}, Question ${tagged.questionIndex + 1}</h3>
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }">
                            ${isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                    </div>
                    <p class="text-sm text-gray-700 mb-3 line-clamp-2">${tagged.question}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                        <span><strong>Your Answer:</strong> ${tagged.userAnswer !== undefined ? String.fromCharCode(65 + tagged.userAnswer) : 'Not answered'}</span>
                        <span><strong>Correct Answer:</strong> ${String.fromCharCode(65 + tagged.correctAnswer)}</span>
                        <span>${dateStr}</span>
                    </div>
                </div>
                <svg class="h-5 w-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        `;
        container.appendChild(questionDiv);
    });
}

// View a tagged question
function viewTaggedQuestion(tagged) {
    // Set current test context
    currentSubject = tagged.subject;
    currentTestIndex = tagged.testIndex;
    detailedReviewQuestionIndex = tagged.questionIndex;
    userAnswers = {};
    userAnswers[tagged.questionIndex] = tagged.userAnswer;

    // Show detailed review
    showDetailedReview();
}

// Update question list in sidebar
function updateReviewQuestionList() {
    const test = allTestData[currentSubject][currentTestIndex];
    const listContainer = document.getElementById('review-question-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const filter = (window.currentReviewFilter || 'all');
    const searchTerm = (window.currentReviewSearch || '').toLowerCase();

    test.forEach((q, i) => {
        const isCorrect = userAnswers[i] === q.a;
        const isAnswered = userAnswers[i] !== undefined;
        const tagKey = `${currentSubject}-${currentTestIndex}-${i}`;
        const taggedQuestions = getTaggedQuestions();
        const isTagged = !!taggedQuestions[tagKey];

        if (filter === 'correct' && !isCorrect) return;
        if (filter === 'incorrect' && (isCorrect || !isAnswered)) return;
        if (filter === 'unanswered' && isAnswered) return;
        if (filter === 'tagged' && !isTagged) return;
        if (searchTerm && !q.stem.toLowerCase().includes(searchTerm)) return;

        const listItem = document.createElement('div');
        listItem.className = 'review-question-item';
        listItem.classList.toggle('active', i === detailedReviewQuestionIndex);
        listItem.classList.add(isCorrect ? 'correct' : (isAnswered ? 'incorrect' : 'unanswered'));
        listItem.onclick = () => {
            detailedReviewQuestionIndex = i;
            updateDetailedReview();
        };

        listItem.innerHTML = `
            <span class="status-dot"></span>
            <span class="flex-1 text-sm">Question ${i + 1}</span>
            ${isTagged ? '<span class="tag-indicator">★</span>' : ''}
        `;
        listContainer.appendChild(listItem);
    });
}

function updateReviewCounters() {
    const test = allTestData[currentSubject][currentTestIndex];
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    test.forEach((q, i) => {
        if (userAnswers[i] === q.a) {
            correct++;
        } else if (userAnswers[i] === undefined) {
            unanswered++;
        } else {
            incorrect++;
        }
    });

    const correctEl = document.getElementById('review-correct-count');
    const incorrectEl = document.getElementById('review-incorrect-count');
    const unansweredEl = document.getElementById('review-unanswered-count');

    if (correctEl) correctEl.textContent = correct;
    if (incorrectEl) incorrectEl.textContent = incorrect;
    if (unansweredEl) unansweredEl.textContent = unanswered;
}

function applyReviewFilters(filter) {
    if (filter) {
        window.currentReviewFilter = filter;
    } else if (!window.currentReviewFilter) {
        window.currentReviewFilter = 'all';
    }

    const filterButtons = document.querySelectorAll('.review-filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`review-filter-${window.currentReviewFilter}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    updateReviewQuestionList();
    updateDetailedReview();
}

function filterReviewQuestions(type) {
    applyReviewFilters(type);
}

function handleReviewSearch() {
    const searchInput = document.getElementById('review-search-input');
    window.currentReviewSearch = searchInput ? searchInput.value : '';
    updateReviewQuestionList();
}

// Navigation functions for detailed review
function reviewPrevQuestion() {
    const test = allTestData[currentSubject][currentTestIndex];
    if (detailedReviewQuestionIndex > 0) {
        detailedReviewQuestionIndex--;
        updateDetailedReview();
    }
}

function reviewNextQuestion() {
    const test = allTestData[currentSubject][currentTestIndex];
    if (detailedReviewQuestionIndex < test.length - 1) {
        detailedReviewQuestionIndex++;
        updateDetailedReview();
    }
}

// Filter review questions (placeholder)
function filterReviewQuestions(type) {
    applyReviewFilters(type);
}

function launchTaggedReview(taggedKey) {
    const taggedQuestions = getTaggedQuestions();
    if (!taggedQuestions || !taggedQuestions[taggedKey]) {
        alert('Tagged question not found.');
        return;
    }

    taggedReviewActiveKey = taggedKey;
    taggedReviewAllItems = Object.values(taggedQuestions)
        .filter(item => item.subject === taggedQuestions[taggedKey].subject && item.testIndex === taggedQuestions[taggedKey].testIndex)
        .map(item => ({
            key: `${item.subject}-${item.testIndex}-${item.questionIndex}`,
            ...item
        }));

    if (taggedReviewAllItems.length === 0) {
        alert('No tagged questions available for review.');
        return;
    }

    taggedReviewFilter = 'all';
    taggedReviewSearch = '';
    document.querySelectorAll('#tagged-review-filter-all, #tagged-review-filter-correct, #tagged-review-filter-incorrect, #tagged-review-filter-unanswered').forEach(btn => btn.classList.remove('active'));
    const allBtn = document.getElementById('tagged-review-filter-all');
    if (allBtn) allBtn.classList.add('active');
    const searchInput = document.getElementById('tagged-review-search');
    if (searchInput) searchInput.value = '';

    applyTaggedReviewFilters();
    showView('tagged-review-view');
}

function applyTaggedReviewFilters() {
    const taggedQuestions = taggedReviewAllItems.slice();
    taggedReviewFilteredItems = taggedQuestions.filter(item => {
        if (taggedReviewFilter === 'correct' && item.userAnswer !== item.correctAnswer) return false;
        if (taggedReviewFilter === 'incorrect' && (item.userAnswer === item.correctAnswer || item.userAnswer === undefined)) return false;
        if (taggedReviewFilter === 'unanswered' && item.userAnswer !== undefined) return false;
        if (taggedReviewSearch && !item.question.toLowerCase().includes(taggedReviewSearch.toLowerCase())) return false;
        return true;
    });

    if (taggedReviewFilteredItems.length === 0) {
        taggedReviewIndex = 0;
    } else {
        const currentKey = taggedReviewFilteredItems[taggedReviewIndex]?.key;
        taggedReviewIndex = Math.max(0, Math.min(taggedReviewFilteredItems.length - 1,
            currentKey ? taggedReviewFilteredItems.findIndex(item => item.key === currentKey) : 0));
        if (taggedReviewIndex === -1) taggedReviewIndex = 0;
    }

    updateTaggedReviewSidebar();
    updateTaggedReviewContent();
}

function filterTaggedReview(type) {
    taggedReviewFilter = type;
    document.querySelectorAll('#tagged-review-filter-all, #tagged-review-filter-correct, #tagged-review-filter-incorrect, #tagged-review-filter-unanswered').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`tagged-review-filter-${type}`);
    if (activeBtn) activeBtn.classList.add('active');
    applyTaggedReviewFilters();
}

function handleTaggedReviewSearch() {
    const input = document.getElementById('tagged-review-search');
    taggedReviewSearch = input ? input.value : '';
    applyTaggedReviewFilters();
}

function updateTaggedReviewSidebar() {
    const list = document.getElementById('tagged-review-question-list');
    if (!list) return;
    list.innerHTML = '';

    const counts = { correct: 0, incorrect: 0, unanswered: 0 };
    taggedReviewAllItems.forEach(item => {
        if (item.userAnswer === undefined) {
            counts.unanswered++;
        } else if (item.userAnswer === item.correctAnswer) {
            counts.correct++;
        } else {
            counts.incorrect++;
        }
    });

    const correctEl = document.getElementById('tagged-review-correct-count');
    const incorrectEl = document.getElementById('tagged-review-incorrect-count');
    const unansweredEl = document.getElementById('tagged-review-unanswered-count');
    if (correctEl) correctEl.textContent = counts.correct;
    if (incorrectEl) incorrectEl.textContent = counts.incorrect;
    if (unansweredEl) unansweredEl.textContent = counts.unanswered;

    taggedReviewFilteredItems.forEach((item, idx) => {
        const listItem = document.createElement('div');
        listItem.className = 'review-question-item';
        const isCorrect = item.userAnswer === item.correctAnswer;
        const isAnswered = item.userAnswer !== undefined;
        listItem.classList.add(isCorrect ? 'correct' : (isAnswered ? 'incorrect' : 'unanswered'));
        listItem.classList.toggle('active', idx === taggedReviewIndex);
        listItem.onclick = () => {
            taggedReviewIndex = idx;
            updateTaggedReviewContent();
            updateTaggedReviewSidebar();
        };

        listItem.innerHTML = `
            <span class="status-dot"></span>
            <span class="flex-1 text-sm">Question ${item.questionIndex + 1}</span>
            <span class="tag-indicator">★</span>
        `;
        list.appendChild(listItem);
    });
}

function updateTaggedReviewContent() {
    if (!taggedReviewFilteredItems || taggedReviewFilteredItems.length === 0) {
        const content = document.getElementById('tagged-review-q-stem');
        if (content) content.textContent = 'No tagged questions match the current filters.';
        return;
    }

    if (taggedReviewIndex < 0) taggedReviewIndex = 0;
    if (taggedReviewIndex >= taggedReviewFilteredItems.length) taggedReviewIndex = taggedReviewFilteredItems.length - 1;

    const item = taggedReviewFilteredItems[taggedReviewIndex];
    const test = allTestData[item.subject] && allTestData[item.subject][item.testIndex];
    const question = test ? test[item.questionIndex] : null;
    const questionStem = question ? question.stem : item.question;

    const headerTitle = document.getElementById('tagged-review-header-title');
    if (headerTitle) {
        headerTitle.textContent = `${item.subject} Test #${item.testIndex + 1}`;
    }

    const qNumberEl = document.getElementById('tagged-review-q-number');
    const qTotalEl = document.getElementById('tagged-review-q-total');
    if (qNumberEl) qNumberEl.textContent = taggedReviewIndex + 1;
    if (qTotalEl) qTotalEl.textContent = taggedReviewFilteredItems.length;

    const stemEl = document.getElementById('tagged-review-q-stem');
    if (stemEl) stemEl.textContent = questionStem || 'Question text unavailable';

    const statusChip = document.getElementById('tagged-review-status-chip');
    const statusText = document.getElementById('tagged-review-status-text');
    const userAnswerChip = document.getElementById('tagged-review-user-answer');
    const correctAnswerChip = document.getElementById('tagged-review-correct-answer');
    const sourceChip = document.getElementById('tagged-review-source');
    if (statusChip && statusText) {
        statusChip.classList.remove('success', 'error', 'neutral');
        if (item.userAnswer === undefined) {
            statusChip.classList.add('neutral');
            statusText.textContent = 'Unanswered';
        } else if (item.userAnswer === item.correctAnswer) {
            statusChip.classList.add('success');
            statusText.textContent = 'Correct';
        } else {
            statusChip.classList.add('error');
            statusText.textContent = 'Incorrect';
        }
    }
    if (userAnswerChip) {
        userAnswerChip.textContent = `Your Answer: ${item.userAnswer !== undefined ? String.fromCharCode(65 + item.userAnswer) : 'Not answered'}`;
    }
    if (correctAnswerChip) {
        correctAnswerChip.textContent = `Correct Answer: ${String.fromCharCode(65 + item.correctAnswer)}`;
    }
    if (sourceChip) {
        sourceChip.textContent = `Source: ${item.subject} Test #${item.testIndex + 1}`;
    }

    const choicesContainer = document.getElementById('tagged-review-choices');
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
        if (question && Array.isArray(question.c)) {
            question.c.forEach((choice, idx) => {
                const choiceDiv = document.createElement('div');
                choiceDiv.className = 'review-choice';
                if (idx === item.correctAnswer) {
                    choiceDiv.classList.add('correct');
                }
                if (item.userAnswer === idx && item.userAnswer !== item.correctAnswer) {
                    choiceDiv.classList.add('incorrect');
                }
                choiceDiv.innerHTML = `
                    <label>
                        <span class="choice-letter">${String.fromCharCode(65 + idx)}</span>
                        <span>${choice}</span>
                    </label>
                    ${idx === item.correctAnswer
                        ? '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
                        : (item.userAnswer === idx && item.userAnswer !== item.correctAnswer
                            ? '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>'
                            : '')
                    }
                `;
                choicesContainer.appendChild(choiceDiv);
            });
        }
    }

    const explanationEl = document.getElementById('tagged-review-explanation');
    if (explanationEl) {
        const explanation = question && question.explanation ? question.explanation : 'No explanation available for this tagged question.';
        explanationEl.innerHTML = `<p>${explanation}</p>`;
    }

    const progressEl = document.getElementById('tagged-review-progress');
    if (progressEl) {
        progressEl.textContent = `${taggedReviewIndex + 1} / ${taggedReviewFilteredItems.length}`;
    }
}

function taggedReviewPrev() {
    if (taggedReviewIndex > 0) {
        taggedReviewIndex--;
        updateTaggedReviewContent();
        updateTaggedReviewSidebar();
    }
}

function taggedReviewNext() {
    if (taggedReviewIndex < taggedReviewFilteredItems.length - 1) {
        taggedReviewIndex++;
        updateTaggedReviewContent();
        updateTaggedReviewSidebar();
    }
}

function removeTagFromTaggedReview() {
    if (!taggedReviewFilteredItems[taggedReviewIndex]) return;
    const item = taggedReviewFilteredItems[taggedReviewIndex];
    const tagKey = `${item.subject}-${item.testIndex}-${item.questionIndex}`;
    let taggedQuestions = getTaggedQuestions();
    if (taggedQuestions[tagKey]) {
        delete taggedQuestions[tagKey];
        saveTaggedQuestions(taggedQuestions);
    }

    taggedReviewAllItems = taggedReviewAllItems.filter(entry => !(entry.subject === item.subject && entry.testIndex === item.testIndex && entry.questionIndex === item.questionIndex));
    applyTaggedReviewFilters();
    displayTaggedQuestions();

    if (taggedReviewAllItems.length === 0) {
        showTaggedQuestions();
        alert('No more tagged questions for this test.');
    }
}

// EXIT_MODAL_COPY and DEFAULT_EXIT_CONTEXT are defined below
// The exit functions are already defined at the top of the file (lines 25-40)
const DEFAULT_EXIT_CONTEXT = 'test';

const EXIT_MODAL_COPY = {
    test: {
        title: 'Would you like to exit the test?',
        message: 'Your test is in progress. If you exit now, your test results will NOT be saved.',
        confirmLabel: 'Exit Test',
        cancelLabel: 'Return to the Test',
        onConfirm: exitFromActiveTest // Function defined at top of file
    },
    review: {
        title: 'Exit review session?',
        message: 'You are reviewing your results. Leaving now will close the review session.',
        confirmLabel: 'Leave Review',
        cancelLabel: 'Return to Review',
        onConfirm: exitFromReview // Function defined at top of file
    }
};

function requestExitConfirmation(context = 'test', onConfirmOverride) {
    console.log('🔴 requestExitConfirmation called with context:', context);
    const modal = document.getElementById('exit-test-modal');
    if (!modal) {
        console.error('❌ Exit test modal not found!');
        return;
    }

    const normalizedContext = EXIT_MODAL_COPY[context] ? context : DEFAULT_EXIT_CONTEXT;
    const config = EXIT_MODAL_COPY[normalizedContext];

    if (!config) {
        console.error('❌ No config found for context:', normalizedContext);
        return;
    }

    pendingExitContext = normalizedContext;
    pendingExitCallback = typeof onConfirmOverride === 'function' ? onConfirmOverride : config.onConfirm;

    const titleEl = modal.querySelector('[data-exit-title]');
    const messageEl = modal.querySelector('[data-exit-message]');
    const confirmBtn = modal.querySelector('[data-exit-confirm]');
    const cancelBtn = modal.querySelector('[data-exit-cancel]');

    if (titleEl) titleEl.textContent = config.title;
    if (messageEl) messageEl.textContent = config.message;
    if (confirmBtn) confirmBtn.textContent = config.confirmLabel;
    if (cancelBtn) cancelBtn.textContent = config.cancelLabel;

    console.log('✅ Showing exit modal');
    modal.style.display = 'flex';
    modal.style.zIndex = '9999';
}

function handleExitAttempt(context = 'test') {
    console.log('🔴 handleExitAttempt called with context:', context);
    requestExitConfirmation(EXIT_MODAL_COPY[context] ? context : DEFAULT_EXIT_CONTEXT);
}

function hideExitTestModal(resetCallback = true) {
    console.log('🔴 hideExitTestModal called');
    const modal = document.getElementById('exit-test-modal');
    if (modal) {
        modal.style.display = 'none';
        console.log('✅ Exit modal hidden');
    }
    if (resetCallback) {
        pendingExitCallback = null;
    }
    pendingExitContext = DEFAULT_EXIT_CONTEXT;
}

// Make function globally accessible
window.hideExitTestModal = hideExitTestModal;
// exitFromActiveTest and exitFromReview are already defined above

function goBackToSubject() {
    // Go back to dashboard from pre-test view
    showView('dashboard-view', null, document.getElementById('nav-home'));
}

function confirmExitTest() {
    console.log('🔴 confirmExitTest called, pendingExitContext:', pendingExitContext);
    const fallback = EXIT_MODAL_COPY[pendingExitContext]?.onConfirm || EXIT_MODAL_COPY[DEFAULT_EXIT_CONTEXT].onConfirm;
    const callback = pendingExitCallback || fallback;
    pendingExitCallback = null;
    hideExitTestModal(false);
    pendingExitContext = DEFAULT_EXIT_CONTEXT;
    if (typeof callback === 'function') {
        console.log('✅ Executing exit callback');
        callback();
    } else {
        console.error('❌ No exit callback function found');
    }
}

// Make function globally accessible
window.confirmExitTest = confirmExitTest;

// Periodic Table Functions
function showExhibit() {
    // For Quantitative Reasoning, show calculator and hide periodic table
    if (currentSubject === 'Quantitative Reasoning') {
        // Hide periodic table modal if it's open
        const periodicTableModal = document.getElementById('periodic-table-modal');
        if (periodicTableModal) {
            periodicTableModal.style.display = 'none';
        }
        showCalculator();
        return;
    }

    // For General Chemistry and other subjects, show periodic table
    const modal = document.getElementById('periodic-table-modal');
    if (modal) {
        modal.style.display = 'flex';
        const container = document.getElementById('periodic-table-content');

        // Generate the complete periodic table HTML
        container.innerHTML = generatePeriodicTable();
    }
}

function hideExhibit() {
    const modal = document.getElementById('periodic-table-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function generatePeriodicTable() {
    // Main periodic table elements
    const elements = [
        // Period 1
        [{ num: 1, sym: 'H', mass: '1.01' }, { num: 2, sym: 'He', mass: '4.00' }],
        // Period 2
        [{ num: 3, sym: 'Li', mass: '6.94' }, { num: 4, sym: 'Be', mass: '9.01' }, { num: 5, sym: 'B', mass: '10.81' }, { num: 6, sym: 'C', mass: '12.01' }, { num: 7, sym: 'N', mass: '14.01' }, { num: 8, sym: 'O', mass: '16.00' }, { num: 9, sym: 'F', mass: '19.00' }, { num: 10, sym: 'Ne', mass: '20.18' }],
        // Period 3
        [{ num: 11, sym: 'Na', mass: '22.99' }, { num: 12, sym: 'Mg', mass: '24.31' }, { num: 13, sym: 'Al', mass: '26.98' }, { num: 14, sym: 'Si', mass: '28.09' }, { num: 15, sym: 'P', mass: '30.97' }, { num: 16, sym: 'S', mass: '32.06' }, { num: 17, sym: 'Cl', mass: '35.45' }, { num: 18, sym: 'Ar', mass: '39.95' }],
        // Period 4
        [{ num: 19, sym: 'K', mass: '39.10' }, { num: 20, sym: 'Ca', mass: '40.08' }, { num: 21, sym: 'Sc', mass: '44.96' }, { num: 22, sym: 'Ti', mass: '47.90' }, { num: 23, sym: 'V', mass: '50.94' }, { num: 24, sym: 'Cr', mass: '52.00' }, { num: 25, sym: 'Mn', mass: '54.94' }, { num: 26, sym: 'Fe', mass: '55.85' }, { num: 27, sym: 'Co', mass: '58.93' }, { num: 28, sym: 'Ni', mass: '58.71' }, { num: 29, sym: 'Cu', mass: '63.55' }, { num: 30, sym: 'Zn', mass: '65.37' }, { num: 31, sym: 'Ga', mass: '69.72' }, { num: 32, sym: 'Ge', mass: '72.59' }, { num: 33, sym: 'As', mass: '74.92' }, { num: 34, sym: 'Se', mass: '78.96' }, { num: 35, sym: 'Br', mass: '79.90' }, { num: 36, sym: 'Kr', mass: '83.80' }],
        // Period 5
        [{ num: 37, sym: 'Rb', mass: '85.47' }, { num: 38, sym: 'Sr', mass: '87.62' }, { num: 39, sym: 'Y', mass: '88.91' }, { num: 40, sym: 'Zr', mass: '91.22' }, { num: 41, sym: 'Nb', mass: '92.91' }, { num: 42, sym: 'Mo', mass: '95.94' }, { num: 43, sym: 'Tc', mass: '(97)' }, { num: 44, sym: 'Ru', mass: '101.07' }, { num: 45, sym: 'Rh', mass: '102.91' }, { num: 46, sym: 'Pd', mass: '106.40' }, { num: 47, sym: 'Ag', mass: '107.87' }, { num: 48, sym: 'Cd', mass: '112.40' }, { num: 49, sym: 'In', mass: '114.82' }, { num: 50, sym: 'Sn', mass: '118.69' }, { num: 51, sym: 'Sb', mass: '121.75' }, { num: 52, sym: 'Te', mass: '127.60' }, { num: 53, sym: 'I', mass: '126.90' }, { num: 54, sym: 'Xe', mass: '131.30' }],
        // Period 6
        [{ num: 55, sym: 'Cs', mass: '132.91' }, { num: 56, sym: 'Ba', mass: '137.34' }, { num: 57, sym: 'La', mass: '138.91' }, { num: 72, sym: 'Hf', mass: '178.49' }, { num: 73, sym: 'Ta', mass: '180.95' }, { num: 74, sym: 'W', mass: '183.85' }, { num: 75, sym: 'Re', mass: '186.20' }, { num: 76, sym: 'Os', mass: '190.20' }, { num: 77, sym: 'Ir', mass: '192.20' }, { num: 78, sym: 'Pt', mass: '195.08' }, { num: 79, sym: 'Au', mass: '196.97' }, { num: 80, sym: 'Hg', mass: '200.59' }, { num: 81, sym: 'Tl', mass: '204.37' }, { num: 82, sym: 'Pb', mass: '207.19' }, { num: 83, sym: 'Bi', mass: '208.98' }, { num: 84, sym: 'Po', mass: '210.00' }, { num: 85, sym: 'At', mass: '210.00' }, { num: 86, sym: 'Rn', mass: '222.00' }],
        // Period 7
        [{ num: 87, sym: 'Fr', mass: '215.00' }, { num: 88, sym: 'Ra', mass: '226.03' }, { num: 89, sym: 'Ac', mass: '227.03' }, { num: 104, sym: 'Rf', mass: '(261)' }, { num: 105, sym: 'Db', mass: '(262)' }, { num: 106, sym: 'Sg', mass: '(266)' }, { num: 107, sym: 'Bh', mass: '(264)' }, { num: 108, sym: 'Hs', mass: '(269)' }, { num: 109, sym: 'Mt', mass: '(268)' }, { num: 110, sym: 'Ds', mass: '(271)' }, { num: 111, sym: 'Rg', mass: '(272)' }, { num: 112, sym: 'Cn', mass: '(277)' }, { num: 113, sym: 'Nh', mass: '(286)' }, { num: 114, sym: 'Fl', mass: '(289)' }, { num: 115, sym: 'Mc', mass: '(290)' }, { num: 116, sym: 'Lv', mass: '(293)' }, { num: 117, sym: 'Ts', mass: '(294)' }, { num: 118, sym: 'Og', mass: '(294)' }]
    ];

    // Lanthanides (58-71)
    const lanthanides = [
        { num: 58, sym: 'Ce', mass: '140.12' }, { num: 59, sym: 'Pr', mass: '140.91' }, { num: 60, sym: 'Nd', mass: '144.24' }, { num: 61, sym: 'Pm', mass: '145.00' }, { num: 62, sym: 'Sm', mass: '150.35' }, { num: 63, sym: 'Eu', mass: '151.96' }, { num: 64, sym: 'Gd', mass: '157.25' }, { num: 65, sym: 'Tb', mass: '158.92' }, { num: 66, sym: 'Dy', mass: '162.50' }, { num: 67, sym: 'Ho', mass: '164.93' }, { num: 68, sym: 'Er', mass: '167.26' }, { num: 69, sym: 'Tm', mass: '168.93' }, { num: 70, sym: 'Yb', mass: '173.04' }, { num: 71, sym: 'Lu', mass: '174.97' }
    ];

    // Actinides (90-103)
    const actinides = [
        { num: 90, sym: 'Th', mass: '232.04' }, { num: 91, sym: 'Pa', mass: '231.00' }, { num: 92, sym: 'U', mass: '238.03' }, { num: 93, sym: 'Np', mass: '237.05' }, { num: 94, sym: 'Pu', mass: '239.05' }, { num: 95, sym: 'Am', mass: '241.06' }, { num: 96, sym: 'Cm', mass: '244.06' }, { num: 97, sym: 'Bk', mass: '249.08' }, { num: 98, sym: 'Cf', mass: '252.08' }, { num: 99, sym: 'Es', mass: '252.08' }, { num: 100, sym: 'Fm', mass: '257.10' }, { num: 101, sym: 'Md', mass: '258.10' }, { num: 102, sym: 'No', mass: '259.10' }, { num: 103, sym: 'Lr', mass: '262.11' }
    ];

    // Patched function to allow for custom styles (e.g., f-block highlighting)
    function createElementCell(el) {
        // Handle a typo in the user's data for Phosphorus
        if (el.num === 15 && !el.sym) el.sym = 'P';

        return `
            <div style="border: 1px solid #000; padding: 3px; text-align: center; min-width: 50px; min-height: 50px; display: flex; flex-direction: column; justify-content: space-between; font-size: 11px; background: white;">
                <div style="font-size: 8px; text-align: left; padding-left: 2px; line-height: 1;">${el.num}</div>
                <div style="font-size: 16px; font-weight: bold; margin: 1px 0; line-height: 1.2;">${el.sym}</div>
                <div style="font-size: 8px; line-height: 1;">${el.mass}</div>
            </div>
        `;
    }

    let html = `
        <div style="font-family: Arial, sans-serif; color: #000; background: white; padding: 20px; max-width: 1200px; margin: auto; overflow-x: auto;">
            <h1 style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 20px;">PERIODIC TABLE OF THE ELEMENTS</h1>
            
            <!-- Group numbers -->
            <div style="display: grid; grid-template-columns: 0px repeat(18, 1fr); gap: 1px; margin-bottom: 3px; min-width: 900px;">
                <div style="border: 1px solid #000; background: white; border-width: 0;"></div>
                ${Array.from({ length: 18 }, (_, i) => `<div style="text-align: center; font-size: 11px; font-weight: bold; border: 1px solid #000; background: white; padding: 2px;">${i + 1}</div>`).join('')}
            </div>
            
            <!-- Main table -->
            ${elements.map((period, periodIdx) => {
        const periodNum = periodIdx + 1;
        let row = `<div style="display: grid; grid-template-columns: 0px repeat(18, 1fr); gap: 1px; margin-bottom: 1px; min-width: 900px;">`;
        row += `<div style="text-align: center; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; border: 1px solid #000; background: white; border-width: 0;"></div>`;

        // Fill in elements based on period
        if (periodNum === 1) {
            // Period 1: H in column 1, He in column 18
            row += createElementCell(period[0]);
            for (let i = 0; i < 16; i++) row += `<div style="min-height: 50px;"></div>`;
            row += createElementCell(period[1]);
        } else if (periodNum === 2 || periodNum === 3) {
            // Periods 2-3: elements in columns 1-2, then 10 empty, then 13-18
            row += createElementCell(period[0]); // Col 1 (e.g., Li)
            row += createElementCell(period[1]); // Col 2 (e.g., Be)

            // Add 10 empty spacer cells for groups 3-12
            for (let i = 0; i < 10; i++) {
                row += `<div style="min-height: 50px;"></div>`;
            }

            // Add remaining 6 elements (groups 13-18)
            for (let i = 2; i < period.length; i++) {
                row += createElementCell(period[i]);
            }
        } else if (periodNum === 4 || periodNum === 5) {
            // Periods 4-5: all 18 elements
            period.forEach(el => row += createElementCell(el));
        } else if (periodNum === 6) {
            // Period 6: Data array has [55, 56, 57, 72...86] which is 18 elements.
            row += createElementCell(period[0]); // Cs
            row += createElementCell(period[1]); // Ba
            row += createElementCell(period[2]); // La
            // Add the rest of the d-block and p-block
            for (let i = 3; i < period.length; i++) {
                row += createElementCell(period[i]);
            }
        } else if (periodNum === 7) {
            // Period 7: Data array now has [87...118], all 18 elements.
            // Render them sequentially.
            row += createElementCell(period[0]); // Fr
            row += createElementCell(period[1]); // Ra
            row += createElementCell(period[2]); // Ac
            // Add the rest of the d-block and p-block
            for (let i = 3; i < period.length; i++) {
                row += createElementCell(period[i]);
            }
        }

        row += `</div>`;
        return row;
    }).join('')}
            
            <!-- Lanthanides -->
            <div style="margin-top: 15px; min-width: 900px;">
                <div style="display: grid; grid-template-columns: 0px repeat(18, 1fr); gap: 1px; margin-bottom: 1px; min-width: 900px;">
                    <div></div>
                    <div style="min-height: 50px;"></div>
                    <div style="min-height: 50px;"></div>
                    ${lanthanides.map(createElementCell).join('')}
                    <div style="min-height: 50px;"></div>
                    <div style="min-height: 50px;"></div>
                </div>
            </div>
            
            <!-- Actinides -->
            <div style="margin-top: 3px; min-width: 900px;">
                <div style="display: grid; grid-template-columns: 0px repeat(18, 1fr); gap: 1px; margin-bottom: 1px; min-width: 900px;">
                    <div></div>
                    <div style="min-height: 50px;"></div>
                    <div style="min-height: 50px;"></div>
                    ${actinides.map(createElementCell).join('')}
                    <div style="min-height: 50px;"></div>
                    <div style="min-height: 50px;"></div>
                </div>
            </div>
            
            <!-- Physical Constants -->
            <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 11px; min-width: 900px; align-items: start;">
                <!-- Left Column -->
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 15px; align-items: center;">
                    <span>Avogadro's number</span>
                    <span><b>N<sub>A</sub></b> = 6.02 x 10<sup>23</sup>/mol</span>
                    
                    <span>Faraday constant</span>
                    <span><b>F</b> = 96,500 C/mol</span>
                    
                    <span>Planck's constant</span>
                    <span><b>h</b> = 6.63 x 10<sup>-34</sup> J·s</span>
                </div>
    
                <!-- Right Column -->
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 15px; align-items: start;">
                    <span>speed of light in a vacuum</span>
                    <span><b>c</b> = 3.00 x 10<sup>8</sup> m/s</span>
                    
                    <span>universal gas constant</span>
                <div>
                        <div><b>R</b> = 8.314 J/(mol·K)</div>
                        <div style="padding-left: 20px;">= 0.08206 (atm·L)/(mol·K)</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}

function showCalculator() {
    const modal = document.getElementById('calculator-modal');
    if (!modal) {
        // Create calculator modal if it doesn't exist
        const newModal = document.createElement('div');
        newModal.id = 'calculator-modal';
        newModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        newModal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 20px; max-width: 400px; width: 90%; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    <h2 style="margin: 0; font-size: 18px; font-weight: bold; color: #111827;">Calculator</h2>
                    <button onclick="hideCalculator()" style="background: #f3f4f6; border: none; border-radius: 4px; width: 24px; height: 24px; cursor: pointer; font-size: 16px; color: #6b7280; display: flex; align-items: center; justify-content: center;">×</button>
                </div>
                <div id="calculator-content" style="text-align: center; color: #6b7280;">
                    <p>Calculator functionality would be implemented here.</p>
                    <p style="font-size: 14px; margin-top: 10px;">For now, this serves as a placeholder for the Quantitative Reasoning calculator exhibit.</p>
                </div>
            </div>
        `;
        document.body.appendChild(newModal);
    }
    modal.style.display = 'flex';
}

function hideCalculator() {
    const modal = document.getElementById('calculator-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Calculator Functions
// Calculator state
let calcAcc = null;
let calcOp = null;
let calcOverwrite = true;
let calcMemory = 0;

const displayEl = () => document.getElementById('calc-display');
const memEl = () => document.getElementById('calc-mem');

function showCalculator() {
    // Hide periodic table modal if it's open
    const periodicTableModal = document.getElementById('periodic-table-modal');
    if (periodicTableModal) {
        periodicTableModal.style.display = 'none';
    }

    // Hide Organic Chemistry floating buttons when calculator is shown
    const organicChemAuthorBtn = document.getElementById('organic-chem-author-btn');
    const ochemResetBtn = document.getElementById('ochem-reset-btn');
    if (organicChemAuthorBtn) {
        organicChemAuthorBtn.style.display = 'none';
    }
    if (ochemResetBtn) {
        ochemResetBtn.style.display = 'none';
    }

    const modal = document.getElementById('calculator-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Reset calculator state
        calcAcc = null;
        calcOp = null;
        calcOverwrite = true;
        calcMemory = 0;
        const display = displayEl();
        const memDisplay = memEl();
        if (display) display.value = '0';
        if (memDisplay) memDisplay.value = '';

        // Wire calculator if not already wired
        setTimeout(() => {
            wireCalculator();
        }, 0);
    }
}

function hideCalculator() {
    const modal = document.getElementById('calculator-modal');
    if (modal) {
        modal.style.display = 'none';
    }

    // Restore Organic Chemistry floating buttons if we're in an Organic Chemistry test
    if (currentSubject === 'Organic Chemistry') {
        const organicChemAuthorBtn = document.getElementById('organic-chem-author-btn');
        const ochemResetBtn = document.getElementById('ochem-reset-btn');
        if (organicChemAuthorBtn) {
            organicChemAuthorBtn.style.display = 'flex';
        }
        if (ochemResetBtn) {
            ochemResetBtn.style.display = 'flex';
        }
    }
}

function setDisplay(val) {
    const display = displayEl();
    if (!display) return;
    display.value = formatNumber(val);
}

function getDisplayNumber() {
    const display = displayEl();
    if (!display) return 0;
    const v = parseFloat(display.value.replace(/,/g, ''));
    return Number.isFinite(v) ? v : 0;
}

function formatNumber(n) {
    if (!Number.isFinite(n)) return 'Error';
    if (Math.abs(n) >= 1e12 || (Math.abs(n) > 0 && Math.abs(n) < 1e-9)) return n.toExponential(8);
    const s = n.toString();
    if (s.includes('e') || s.includes('E')) return s;
    const parts = s.split('.');
    const i = parts[0];
    const d = parts[1];
    const iFmt = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return d ? iFmt + '.' + d : iFmt;
}

function applyPending(nextVal) {
    if (calcOp === '+') calcAcc = (calcAcc ?? 0) + nextVal;
    else if (calcOp === '-') calcAcc = (calcAcc ?? 0) - nextVal;
    else if (calcOp === '*') calcAcc = (calcAcc ?? 0) * nextVal;
    else if (calcOp === '/') calcAcc = (calcAcc ?? 0) / nextVal;
    else calcAcc = nextVal;
}

function handlePercent() {
    const x = getDisplayNumber();
    if (calcAcc !== null && calcOp) return (calcAcc * x) / 100;
    return x / 100;
}

function press(key) {
    const display = displayEl();
    if (!display) return;

    const d = getDisplayNumber();
    if (/^\d$/.test(key)) {
        if (calcOverwrite || display.value === '0') setDisplay(Number(key));
        else {
            const raw = display.value.replace(/,/g, '') + key;
            setDisplay(parseFloat(raw));
        }
        calcOverwrite = false;
        return;
    }
    switch (key) {
        case '.': {
            const raw = display.value.replace(/,/g, '');
            if (!raw.includes('.')) { display.value = raw + '.'; calcOverwrite = false; }
            break;
        }
        case '+/-': setDisplay(-d); break;
        case 'Backspace': {
            if (!calcOverwrite) {
                const raw = display.value.replace(/,/g, '');
                const next = raw.length <= 1 ? '0' : raw.slice(0, -1);
                display.value = next;
            }
            break;
        }
        case 'CE': setDisplay(0); calcOverwrite = true; break;
        case 'CA': calcAcc = null; calcOp = null; calcOverwrite = true; setDisplay(0); break;
        case '+': case '-': case '*': case '/': {
            applyPending(d); calcOp = key; calcOverwrite = true; setDisplay(calcAcc); break;
        }
        case '=': {
            if (calcOp !== null) { applyPending(d); calcOp = null; setDisplay(calcAcc); calcOverwrite = true; }
            break;
        }
        case 'sqrt': setDisplay(Math.sqrt(d)); calcOverwrite = true; break;
        case '1/x': setDisplay(1 / d); calcOverwrite = true; break;
        case '%': { const val = handlePercent(); setDisplay(val); calcOverwrite = true; break; }
        case 'MC': calcMemory = 0; memEl().value = ''; break;
        case 'MR': setDisplay(calcMemory); calcOverwrite = true; break;
        case 'MS': calcMemory = d; memEl().value = 'M'; break;
        case 'M+': calcMemory += d; memEl().value = calcMemory ? 'M' : ''; break;
    }
}

function wireCalculator() {
    const buttons = document.querySelectorAll('.calc-btn');
    if (buttons.length === 0) return;

    buttons.forEach(btn => {
        if (!btn.hasAttribute('data-wired')) {
            btn.addEventListener('click', () => press(btn.getAttribute('data-key')));
            btn.setAttribute('data-wired', 'true');
        }
    });

    // Only add keyboard listener once
    if (!window.calcKeyboardWired) {
        window.addEventListener('keydown', e => {
            const modal = document.getElementById('calculator-modal');
            if (!modal || modal.style.display === 'none') return;

            const k = e.key;
            if (/^[0-9]$/.test(k)) { e.preventDefault(); return press(k); }
            if (['+', '-', '*', '/'].includes(k)) { e.preventDefault(); return press(k); }
            if (k === 'Enter' || k === '=') { e.preventDefault(); return press('='); }
            if (k === 'Backspace') { e.preventDefault(); return press('Backspace'); }
            if (k === 'Delete') { e.preventDefault(); return press('CE'); }
            if (k === '.') { e.preventDefault(); return press('.'); }
        });
        window.calcKeyboardWired = true;
    }
}

function initializeCalculator() {
    // Reset calculator state
    calcState = {
        acc: null,
        op: null,
        overwrite: true,
        mem: 0
    };

    const display = document.getElementById('calc-display');
    const memDisplay = document.getElementById('calc-mem');
    const buttonsContainer = document.getElementById('calc-buttons');

    if (!display || !buttonsContainer) return;

    display.value = '0';
    memDisplay.value = '';

    // Clear container
    buttonsContainer.innerHTML = '';

    // Set up grid: 6 columns, 4 rows (each row is 34px + 3px gap = 37px total per row)
    buttonsContainer.style.cssText = 'display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(4, 34px); gap: 3px; position: relative;';

    // Button definitions - Row 1 (top row of main grid)
    // Colors: Memory=orange, Numbers=black, Operators=red, Special=blue
    const row1 = [
        { label: 'MC', key: 'MC', color: '#d46b00', col: 1 },
        { label: '7', key: '7', color: '#1a1a1a', col: 2 },
        { label: '8', key: '8', color: '#1a1a1a', col: 3 },
        { label: '9', key: '9', color: '#1a1a1a', col: 4 },
        { label: '/', key: '/', color: '#b80000', col: 5 },
        { label: 'sqrt', key: 'sqrt', color: '#0047ff', col: 6 }
    ];

    // Row 2
    const row2 = [
        { label: 'MR', key: 'MR', color: '#d46b00', col: 1 },
        { label: '4', key: '4', color: '#1a1a1a', col: 2 },
        { label: '5', key: '5', color: '#1a1a1a', col: 3 },
        { label: '6', key: '6', color: '#1a1a1a', col: 4 },
        { label: '*', key: '*', color: '#b80000', col: 5 },
        { label: '%', key: '%', color: '#0047ff', col: 6 }
    ];

    // Row 3
    const row3 = [
        { label: 'MS', key: 'MS', color: '#d46b00', col: 1 },
        { label: '1', key: '1', color: '#1a1a1a', col: 2 },
        { label: '2', key: '2', color: '#1a1a1a', col: 3 },
        { label: '3', key: '3', color: '#1a1a1a', col: 4 },
        { label: '-', key: '-', color: '#b80000', col: 5 }
        // Column 6 is reserved for 1/x and = (handled separately)
    ];

    // Row 4
    const row4 = [
        { label: 'M+', key: 'M+', color: '#d46b00', col: 1 },
        { label: '0', key: '0', color: '#1a1a1a', col: 2 },
        { label: '+/-', key: '+/-', color: '#0047ff', col: 3 },
        { label: '.', key: '.', color: '#1a1a1a', col: 4 },
        { label: '+', key: '+', color: '#b80000', col: 5 }
        // Column 6 is reserved for = (handled separately)
    ];

    // Helper function to create a standard button
    function createButton(btn, row) {
        const button = document.createElement('button');
        button.className = 'calc-btn';
        button.setAttribute('data-key', btn.key);
        button.textContent = btn.label;
        button.style.cssText = `
            grid-row: ${row};
            grid-column: ${btn.col};
            height: 34px;
            border-radius: 6px;
            border: 1px solid #bdbdbd;
            background: linear-gradient(#f3f3f3, #d8d8d8);
            box-shadow: inset 0 1px 0 #fff, 0 1px 2px rgba(0,0,0,0.2);
            cursor: pointer;
            font-size: 14px;
            color: ${btn.color};
            font-weight: ${btn.color === '#b80000' || btn.color === '#d46b00' || btn.color === '#1a1a1a' ? '700' : '600'};
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        `;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            handleCalculatorButton(btn.key);
        });
        return button;
    }

    // Add all standard buttons
    row1.forEach(btn => buttonsContainer.appendChild(createButton(btn, 1)));
    row2.forEach(btn => buttonsContainer.appendChild(createButton(btn, 2)));
    row3.forEach(btn => buttonsContainer.appendChild(createButton(btn, 3)));
    row4.forEach(btn => buttonsContainer.appendChild(createButton(btn, 4)));

    // Create container for column 6 (rows 3-4) to hold both 1/x and =
    const col6Container = document.createElement('div');
    col6Container.style.cssText = `
        grid-row: 3 / span 2;
        grid-column: 6;
        position: relative;
        height: 71px;
    `;

    // Add = button (tall, spans rows 3-4) - should be blue, not red
    const equalsBtn = document.createElement('button');
    equalsBtn.className = 'calc-btn';
    equalsBtn.setAttribute('data-key', '=');
    equalsBtn.textContent = '=';
    equalsBtn.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 71px;
        border-radius: 6px;
        border: 1px solid #bdbdbd;
        background: linear-gradient(#f3f3f3, #d8d8d8);
        box-shadow: inset 0 1px 0 #fff, 0 1px 2px rgba(0,0,0,0.2);
        cursor: pointer;
        font-size: 14px;
        color: #0047ff;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        z-index: 1;
    `;
    equalsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleCalculatorButton('=');
    });
    col6Container.appendChild(equalsBtn);

    // Add 1/x button (small, on top of = button in row 3)
    const invBtn = document.createElement('button');
    invBtn.className = 'calc-btn';
    invBtn.setAttribute('data-key', '1/x');
    invBtn.textContent = '1/x';
    invBtn.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 34px;
        border-radius: 6px;
        border: 1px solid #bdbdbd;
        background: linear-gradient(#f3f3f3, #d8d8d8);
        box-shadow: inset 0 1px 0 #fff, 0 1px 2px rgba(0,0,0,0.2);
        cursor: pointer;
        font-size: 11px;
        color: #0047ff;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        z-index: 10;
    `;
    invBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleCalculatorButton('1/x');
    });
    col6Container.appendChild(invBtn);

    buttonsContainer.appendChild(col6Container);
}

function handleCalculatorButton(key) {
    const display = document.getElementById('calc-display');
    const memDisplay = document.getElementById('calc-mem');
    if (!display) return;

    const MAX_CHARS = 16;

    const toNumber = (s) => {
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
    };

    const setDisplay = (v) => {
        if (!Number.isFinite(v)) {
            display.value = 'Error';
            calcState.acc = null;
            calcState.op = null;
            calcState.overwrite = true;
            return;
        }
        let s = String(v);
        if (/\.\d{10,}/.test(s)) s = Number(v.toFixed(10)).toString();
        if (s.length > MAX_CHARS) s = Number(v).toExponential(8);
        s = s.replace(/\.0+$/, '').replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
        display.value = s;
    };

    const pushDigit = (d) => {
        if (display.value === 'Error') setDisplay(0);
        if (calcState.overwrite) {
            display.value = d;
            calcState.overwrite = false;
            return;
        }
        if (display.value.length < MAX_CHARS) display.value += d;
    };

    const pushDot = () => {
        if (calcState.overwrite) {
            display.value = '0.';
            calcState.overwrite = false;
            return;
        }
        if (!display.value.includes('.')) display.value += '.';
    };

    const clearEntry = () => {
        setDisplay(0);
        calcState.overwrite = true;
    };

    const clearAll = () => {
        calcState.acc = null;
        calcState.op = null;
        setDisplay(0);
        calcState.overwrite = true;
    };

    const backspace = () => {
        if (!calcState.overwrite) {
            const raw = display.value;
            const next = raw.length <= 1 ? '0' : raw.slice(0, -1);
            display.value = next;
        }
    };

    const compute = (a, b, sym) => {
        switch (sym) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b === 0 ? NaN : a / b;
            default: return b;
        }
    };

    const commitPending = (nextOp) => {
        const current = toNumber(display.value);
        if (calcState.acc === null) {
            calcState.acc = current;
        } else if (calcState.op) {
            calcState.acc = compute(calcState.acc, current, calcState.op);
            setDisplay(calcState.acc);
        }
        calcState.op = nextOp;
        calcState.overwrite = true;
    };

    const equals = () => {
        if (calcState.op === null) return;
        const current = toNumber(display.value);
        const out = compute(calcState.acc, current, calcState.op);
        setDisplay(out);
        calcState.acc = null;
        calcState.op = null;
        calcState.overwrite = true;
    };

    const percent = () => {
        const base = calcState.acc === null ? 0 : calcState.acc;
        const x = toNumber(display.value);
        const result = base ? base * (x / 100) : (x / 100);
        setDisplay(result);
        calcState.overwrite = true;
    };

    const invert = () => {
        const x = toNumber(display.value);
        setDisplay(x === 0 ? NaN : 1 / x);
        calcState.overwrite = true;
    };

    const sqrt = () => {
        const x = toNumber(display.value);
        setDisplay(x < 0 ? NaN : Math.sqrt(x));
        calcState.overwrite = true;
    };

    const negate = () => {
        if (display.value === '0' || display.value === 'Error') return;
        display.value = display.value.startsWith('-')
            ? display.value.slice(1)
            : '-' + display.value;
    };

    const memory = (opcode) => {
        const x = toNumber(display.value);
        switch (opcode) {
            case 'MC':
                calcState.mem = 0;
                if (memDisplay) memDisplay.value = '';
                break;
            case 'MR':
                setDisplay(calcState.mem);
                calcState.overwrite = true;
                break;
            case 'MS':
                calcState.mem = x;
                if (memDisplay) memDisplay.value = 'M';
                break;
            case 'M+':
                calcState.mem += x;
                if (memDisplay) memDisplay.value = 'M';
                break;
        }
    };

    // Handle button press
    if (/^\d$/.test(key)) {
        pushDigit(key);
    } else if (key === '.') {
        pushDot();
    } else if (key === 'CE') {
        clearEntry();
    } else if (key === 'CA') {
        clearAll();
    } else if (key === 'Backspace') {
        backspace();
    } else if (['+', '-', '*', '/'].includes(key)) {
        commitPending(key);
    } else if (key === '=') {
        equals();
    } else if (key === '%') {
        percent();
    } else if (key === '1/x') {
        invert();
    } else if (key === 'sqrt') {
        sqrt();
    } else if (key === '+/-') {
        negate();
    } else if (['MC', 'MR', 'MS', 'M+'].includes(key)) {
        memory(key);
    }
}

// Save/Load state
// Legacy function - now calls comprehensive save function
function saveState() {
    saveFullExamState();
}

function getTestStateKey(subject, testIndex) {
    return `test_${subject}_${testIndex}`;
}

function loadTestState(subject, testIndex) {
    // Try loading comprehensive state first
    const fullState = loadFullExamState(subject, testIndex);
    if (fullState) {
        // Convert to legacy format for backwards compatibility
        return {
            answers: fullState.userAnswers || fullState.answers || {},
            marked: fullState.markedQuestions || fullState.marked || {},
            questionIndex: fullState.currentQuestionIndex !== undefined ? fullState.currentQuestionIndex : fullState.questionIndex,
            testStartTime: fullState.testStartTime,
            questionTimeSpent: fullState.questionTimeSpent || {},
            timeRemaining: fullState.timeRemaining,
            viewMode: fullState.viewMode,
            prometricDelay: fullState.prometricDelay,
            timeAccommodations: fullState.timeAccommodations
        };
    }

    // Fallback to legacy format
    try {
        if (!subject || testIndex === null || testIndex === undefined) {
            return null;
        }
        const key = getTestStateKey(subject, testIndex);
        const saved = localStorage.getItem(key);
        if (!saved) {
            return null;
        }
        const state = JSON.parse(saved);
        console.log('📥 Loaded legacy test state:', key, Object.keys(state.answers || {}).length, 'answers');
        return state;
    } catch (e) {
        console.error('Failed to load test state:', e);
        return null;
    }
}

function clearTestState(subject, testIndex) {
    clearFullExamState(subject, testIndex);
}

// Enable browser warning when leaving page with unsaved test data
let testExitWarningEnabled = false;
function enableTestExitWarning() {
    if (testExitWarningEnabled) return;
    testExitWarningEnabled = true;

    window.addEventListener('beforeunload', handleBeforeUnload);
    console.log('⚠️ Test exit warning enabled');
}

function disableTestExitWarning() {
    if (!testExitWarningEnabled) return;
    testExitWarningEnabled = false;

    window.removeEventListener('beforeunload', handleBeforeUnload);
    console.log('✅ Test exit warning disabled');
}

function handleBeforeUnload(event) {
    if (!examSubmitted && currentSubject && currentTestIndex !== null && currentTestIndex !== undefined) {
        clearFullExamState(currentSubject, currentTestIndex);
    }
    // Only warn if there are unsaved answers
    if (currentSubject && currentTestIndex !== null && currentTestIndex !== undefined && Object.keys(userAnswers).length > 0) {
        event.preventDefault();
        event.returnValue = ''; // Chrome requires returnValue to be set
        return ''; // Some browsers require a return value
    }
}

function loadSavedState() {
    // Load settings
    loadSettings();
}

function saveSettings() {
    try {
        const settings = {
            prometricDelay,
            timeAccommodations
        };
        localStorage.setItem('test_settings', JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save settings:', e);
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('test_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            prometricDelay = settings.prometricDelay || false;
            timeAccommodations = settings.timeAccommodations || false;

            const togglePrometric = document.getElementById('toggle-prometric-delay');
            const toggleTimeAccom = document.getElementById('toggle-time-accommodations');

            if (togglePrometric) togglePrometric.checked = prometricDelay;
            if (toggleTimeAccom) toggleTimeAccom.checked = timeAccommodations;
        }

        // Initialize button management UI
        initializeButtonManagement();
    } catch (e) {
        console.error('Failed to load settings:', e);
    }
}

// Save exam button configuration
function saveExamButtonConfig(config) {
    try {
        localStorage.setItem('exam_button_config', JSON.stringify(config));
        // Apply changes immediately
        applyExamButtonTheme();
        // Trigger React component updates via custom event
        window.dispatchEvent(new Event('buttonThemeUpdated'));
        // Also trigger React component updates if needed
        if (typeof window.updateReactExamButtons === 'function') {
            window.updateReactExamButtons();
        }

        // Highlight button is now always available during exams (handled by React ExamEngine)
    } catch (e) {
        console.error('Failed to save button config:', e);
    }
}

// Initialize Button Management UI
function initializeButtonManagement() {
    const container = document.getElementById('button-management-container');
    if (!container) return;

    const buttons = [
        { key: 'previous', label: 'Previous' },
        { key: 'next', label: 'Next' },
        { key: 'mark', label: 'Mark' },
        { key: 'mark-active', label: 'Mark (Active State)' },
        { key: 'review', label: 'Review' },
        { key: 'exhibit', label: 'Exhibit' },
        { key: 'end', label: 'End' },
        { key: 'highlight', label: 'Highlight Icon' },
        { key: 'review-marked', label: 'Review Marked' },
        { key: 'review-all', label: 'Review All' },
        { key: 'review-incomplete', label: 'Review Incomplete' }
    ];

    const config = getStoredExamButtonConfig();
    container.innerHTML = '';

    buttons.forEach(button => {
        const buttonConfig = config[button.key] || { image: null, useCustom: false, hidden: false };
        const buttonDiv = createButtonManagementItem(button.key, button.label, buttonConfig);
        container.appendChild(buttonDiv);
    });
}

// Create a button management item
function createButtonManagementItem(key, label, config) {
    const div = document.createElement('div');
    div.className = 'bg-slate-50 border border-slate-200 rounded p-4';
    div.id = `button-mgmt-${key}`;

    const previewId = `preview-${key}`;
    const uploadId = `upload-${key}`;
    const toggleId = `toggle-${key}`;
    const applyId = `apply-${key}`;
    const resetId = `reset-${key}`;

    div.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <h4 class="font-semibold text-black" style="font-family: Arial, sans-serif; font-size: 16px;">${label}</h4>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Arial, sans-serif;">Preview</label>
                <div id="${previewId}" class="border border-slate-300 rounded p-3 bg-white flex items-center justify-center min-h-[60px]">
                    <span class="text-gray-400 text-sm">No preview</span>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Arial, sans-serif;">Upload Image</label>
                <input type="file" id="${uploadId}" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3" style="font-family: Arial, sans-serif;">
                <div class="flex items-center gap-3 mb-3">
                    <label class="toggle-switch flex-shrink-0">
                        <input type="checkbox" id="${toggleId}" ${config.useCustom ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span class="text-sm text-gray-700" style="font-family: Arial, sans-serif; font-size: 14px;">Use custom image</span>
                </div>
                <div class="flex gap-2">
                    <button id="${applyId}" class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700" style="font-family: Arial, sans-serif;">Apply</button>
                    <button id="${resetId}" class="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700" style="font-family: Arial, sans-serif;">Reset</button>
                </div>
            </div>
        </div>
    `;

    // Set up event listeners
    const uploadInput = div.querySelector(`#${uploadId}`);
    const toggle = div.querySelector(`#${toggleId}`);
    const applyBtn = div.querySelector(`#${applyId}`);
    const resetBtn = div.querySelector(`#${resetId}`);
    const preview = div.querySelector(`#${previewId}`);

    // Load current preview
    updateButtonPreview(preview, config.image, config.useCustom, label);

    // Handle file upload
    uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                // Auto-enable toggle when image is uploaded
                if (!toggle.checked) {
                    toggle.checked = true;
                }
                updateButtonPreview(preview, imageData, true, label);
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle toggle
    toggle.addEventListener('change', () => {
        const file = uploadInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                updateButtonPreview(preview, imageData, toggle.checked, label);
            };
            reader.readAsDataURL(file);
        } else if (config.image) {
            updateButtonPreview(preview, config.image, toggle.checked, label);
        } else {
            updateButtonPreview(preview, null, false, label);
        }
    });

    // Handle apply
    applyBtn.addEventListener('click', () => {
        const file = uploadInput.files[0];
        const useCustom = toggle.checked;

        if (useCustom && file) {
            // New image uploaded
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                const currentConfig = getStoredExamButtonConfig();
                currentConfig[key] = {
                    image: imageData,
                    useCustom: true
                };
                saveExamButtonConfig(currentConfig);
                // Update local config for preview
                config.image = imageData;
                config.useCustom = true;
                updateButtonPreview(preview, imageData, true, label);

                // CRITICAL: Force immediate update of all exam buttons
                console.log('Force refreshing all exam buttons after upload');
                applyExamButtonTheme();
                // Trigger React component updates
                window.dispatchEvent(new Event('buttonThemeUpdated'));

                alert(`${label} button updated successfully!`);
            };
            reader.readAsDataURL(file);
        } else if (useCustom && config.image) {
            // Use existing saved image
            const currentConfig = getStoredExamButtonConfig();
            currentConfig[key] = {
                image: config.image,
                useCustom: true
            };
            saveExamButtonConfig(currentConfig);
            updateButtonPreview(preview, config.image, true, label);

            // CRITICAL: Force immediate update of all exam buttons
            console.log('Force refreshing all exam buttons after enabling');
            applyExamButtonTheme();
            // Trigger React component updates
            window.dispatchEvent(new Event('buttonThemeUpdated'));

            alert(`${label} button updated successfully!`);
        } else if (!useCustom) {
            // Disable custom image
            const currentConfig = getStoredExamButtonConfig();
            currentConfig[key] = {
                image: config.image || null,
                useCustom: false
            };
            saveExamButtonConfig(currentConfig);
            config.useCustom = false;
            updateButtonPreview(preview, config.image, false, label);

            // CRITICAL: Force immediate update of all exam buttons
            console.log('Force refreshing all exam buttons after disabling');
            applyExamButtonTheme();
            // Trigger React component updates
            window.dispatchEvent(new Event('buttonThemeUpdated'));

            alert(`${label} button reset to default!`);
        } else {
            alert('Please upload an image first.');
        }
    });

    // Handle reset
    resetBtn.addEventListener('click', () => {
        const currentConfig = getStoredExamButtonConfig();
        currentConfig[key] = {
            image: null,
            useCustom: false
        };
        saveExamButtonConfig(currentConfig);
        toggle.checked = false;
        uploadInput.value = '';
        updateButtonPreview(preview, null, false, label);

        // CRITICAL: Force immediate update of all exam buttons
        console.log('Force refreshing all exam buttons after reset');
        applyExamButtonTheme();
        // Trigger React component updates
        window.dispatchEvent(new Event('buttonThemeUpdated'));

        alert(`${label} button reset to default!`);
    });

    return div;
}

// Create a special highlight button management item with image/text toggle and remove option
function createHighlightButtonManagementItem(key, label, config) {
    const div = document.createElement('div');
    div.className = 'bg-slate-50 border border-slate-200 rounded p-4';
    div.id = `button-mgmt-${key}`;

    const previewId = `preview-${key}`;
    const uploadId = `upload-${key}`;
    const toggleId = `toggle-${key}`;
    const modeToggleId = `mode-toggle-${key}`;
    const applyId = `apply-${key}`;
    const removeId = `remove-${key}`;
    const resetId = `reset-${key}`;

    // Ensure config has all properties
    if (config.hidden === undefined) config.hidden = false;
    if (config.useImage === undefined) config.useImage = true;

    const isHidden = config.hidden === true;
    const useCustom = config.useCustom === true;
    const useImage = config.useImage !== false;

    div.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <h4 class="font-semibold text-black" style="font-family: Arial, sans-serif; font-size: 16px;">${label}</h4>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Arial, sans-serif;">Preview</label>
                <div id="${previewId}" class="border border-slate-300 rounded p-3 bg-white flex items-center justify-center min-h-[60px]">
                    <span class="text-gray-400 text-sm">${isHidden ? 'Hidden' : useCustom && config.image ? 'Image' : 'Text Button'}</span>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Arial, sans-serif;">Upload Image</label>
                <input type="file" id="${uploadId}" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3" style="font-family: Arial, sans-serif;" ${isHidden ? 'disabled' : ''}>
                <div class="flex items-center gap-3 mb-3">
                    <label class="toggle-switch flex-shrink-0">
                        <input type="checkbox" id="${toggleId}" ${useCustom ? 'checked' : ''} ${isHidden ? 'disabled' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span class="text-sm text-gray-700" style="font-family: Arial, sans-serif; font-size: 14px;">Use custom image</span>
                </div>
                <div class="flex items-center gap-3 mb-3">
                    <label class="toggle-switch flex-shrink-0">
                        <input type="checkbox" id="${modeToggleId}" ${useImage ? 'checked' : ''} ${isHidden || !useCustom ? 'disabled' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span class="text-sm text-gray-700" style="font-family: Arial, sans-serif; font-size: 14px;">Image mode (uncheck for text)</span>
                </div>
                <div class="flex gap-2 mb-2">
                    <button id="${applyId}" class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700" style="font-family: Arial, sans-serif;" ${isHidden ? 'disabled' : ''}>Apply</button>
                    <button id="${removeId}" class="px-4 py-2 ${isHidden ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white text-sm rounded" style="font-family: Arial, sans-serif;">${isHidden ? 'Show' : 'Remove'}</button>
                    <button id="${resetId}" class="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700" style="font-family: Arial, sans-serif;">Reset</button>
                </div>
            </div>
        </div>
    `;

    const uploadInput = div.querySelector(`#${uploadId}`);
    const toggle = div.querySelector(`#${toggleId}`);
    const modeToggle = div.querySelector(`#${modeToggleId}`);
    const applyBtn = div.querySelector(`#${applyId}`);
    const removeBtn = div.querySelector(`#${removeId}`);
    const resetBtn = div.querySelector(`#${resetId}`);
    const preview = div.querySelector(`#${previewId}`);

    const updateHighlightPreview = () => {
        if (config.hidden === true) {
            preview.innerHTML = '<span class="text-gray-400 text-sm">Hidden</span>';
            return;
        }
        if (config.useCustom && config.image && config.useImage !== false) {
            const img = document.createElement('img');
            img.src = config.image;
            img.alt = label;
            img.style.maxHeight = '50px';
            img.style.maxWidth = '100%';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
            img.style.margin = '0 auto';
            preview.innerHTML = '';
            preview.appendChild(img);
        } else {
            preview.innerHTML = '<span class="text-gray-600 text-sm font-semibold">HIGHLIGHT</span>';
        }
    };

    updateHighlightPreview();

    uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                config.image = event.target.result;
                if (!toggle.checked) toggle.checked = true;
                if (!modeToggle.checked) modeToggle.checked = true;
                modeToggle.disabled = false;
                updateHighlightPreview();
            };
            reader.readAsDataURL(file);
        }
    });

    toggle.addEventListener('change', () => {
        if (toggle.checked && config.image) {
            modeToggle.disabled = false;
        } else {
            modeToggle.disabled = true;
            modeToggle.checked = false;
        }
        updateHighlightPreview();
    });

    modeToggle.addEventListener('change', () => {
        config.useImage = modeToggle.checked;
        updateHighlightPreview();
    });

    applyBtn.addEventListener('click', () => {
        const file = uploadInput.files[0];
        const useCustom = toggle.checked;
        const useImage = modeToggle.checked;

        if (file && useCustom) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                const currentConfig = getStoredExamButtonConfig();
                currentConfig[key] = {
                    image: imageData,
                    useCustom: useCustom,
                    useImage: useImage,
                    hidden: false
                };
                config.image = imageData;
                config.useCustom = useCustom;
                config.useImage = useImage;
                config.hidden = false;
                saveExamButtonConfig(currentConfig);
                updateHighlightPreview();
                window.dispatchEvent(new Event('buttonThemeUpdated'));
                alert('Highlight button updated successfully!');
            };
            reader.readAsDataURL(file);
        } else {
            const currentConfig = getStoredExamButtonConfig();
            currentConfig[key] = {
                image: config.image || null,
                useCustom: useCustom,
                useImage: useCustom ? useImage : true,
                hidden: false
            };
            config.useCustom = useCustom;
            config.useImage = useCustom ? useImage : true;
            config.hidden = false;
            saveExamButtonConfig(currentConfig);
            updateHighlightPreview();
            window.dispatchEvent(new Event('buttonThemeUpdated'));
            alert('Highlight button updated successfully!');
        }
    });

    removeBtn.addEventListener('click', () => {
        const currentConfig = getStoredExamButtonConfig();
        const newHiddenState = !config.hidden;

        currentConfig[key] = {
            ...config,
            hidden: newHiddenState
        };

        config.hidden = newHiddenState;
        saveExamButtonConfig(currentConfig);

        uploadInput.disabled = newHiddenState;
        toggle.disabled = newHiddenState;
        modeToggle.disabled = newHiddenState || !toggle.checked;
        applyBtn.disabled = newHiddenState;
        removeBtn.textContent = newHiddenState ? 'Show' : 'Remove';
        removeBtn.className = `px-4 py-2 ${newHiddenState ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white text-sm rounded`;

        updateHighlightPreview();
        window.dispatchEvent(new Event('buttonThemeUpdated'));
        alert(`Highlight button ${newHiddenState ? 'removed' : 'shown'} successfully!`);
    });

    resetBtn.addEventListener('click', () => {
        const currentConfig = getStoredExamButtonConfig();
        currentConfig[key] = {
            image: null,
            useCustom: false,
            useImage: true,
            hidden: false
        };
        saveExamButtonConfig(currentConfig);

        config.image = null;
        config.useCustom = false;
        config.useImage = true;
        config.hidden = false;

        toggle.checked = false;
        modeToggle.checked = true;
        modeToggle.disabled = true;
        uploadInput.value = '';
        uploadInput.disabled = false;
        toggle.disabled = false;
        applyBtn.disabled = false;
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded';

        updateHighlightPreview();
        window.dispatchEvent(new Event('buttonThemeUpdated'));
        alert('Highlight button reset to default!');
    });

    return div;
}

// Update button preview
function updateButtonPreview(previewElement, imageData, useCustom, label) {
    if (!previewElement) return;

    previewElement.innerHTML = '';

    if (useCustom && imageData) {
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = label;
        img.style.maxHeight = '50px';
        img.style.maxWidth = '100%';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        previewElement.appendChild(img);
    } else {
        const span = document.createElement('span');
        span.className = 'text-gray-400 text-sm';
        span.textContent = 'Default button';
        previewElement.appendChild(span);
    }
}

function renderPreviousTests() {
    const tableBody = document.getElementById('previous-tests-table-body');
    const emptyState = document.getElementById('previous-tests-empty');
    const metaEl = document.getElementById('previous-tests-card-meta');
    if (!tableBody || !emptyState) {
        console.warn('Previous tests DOM elements missing');
        return;
    }

    const history = loadTestHistory();
    const allAttempts = [];
    Object.values(history || {}).forEach((attempts = []) => {
        if (Array.isArray(attempts)) {
            attempts.forEach((attempt, idx) => {
                allAttempts.push({
                    ...attempt,
                    __attemptNumber: idx + 1
                });
            });
        }
    });

    allAttempts.sort((a, b) => {
        const dateA = a && a.date ? new Date(a.date).getTime() : 0;
        const dateB = b && b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    });

    tableBody.innerHTML = '';

    if (allAttempts.length === 0) {
        emptyState.style.display = 'flex';
        if (metaEl) metaEl.textContent = 'Complete a practice exam to see it listed here.';
        return;
    }

    emptyState.style.display = 'none';
    if (metaEl) {
        const latestDate = allAttempts[0] && allAttempts[0].date ? formatResultDate(allAttempts[0].date) : '--';
        metaEl.textContent = `Most recent attempt: ${latestDate}`;
    }

    allAttempts.forEach((attempt, idx) => {
        const subject = attempt.subject || 'Subject';
        const testIndex = typeof attempt.testIndex === 'number' ? attempt.testIndex : 0;
        const testName = attempt.testName || `${subject} Test #${testIndex + 1}`;
        const rawScore = typeof attempt.score === 'number' && !Number.isNaN(attempt.score) ? Math.round(attempt.score) : '—';
        const dateText = attempt.date ? formatResultDate(attempt.date) : '—';
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = testName;

        const subjectCell = document.createElement('td');
        const subjectPill = document.createElement('span');
        const accentColor = getSubjectAccent(subject);
        subjectPill.textContent = subject;
        subjectPill.style.background = accentColor;
        subjectPill.style.color = '#ffffff';
        subjectPill.style.padding = '4px 10px';
        subjectPill.style.borderRadius = '999px';
        subjectPill.style.fontSize = '12px';
        subjectPill.style.fontWeight = '600';
        subjectCell.appendChild(subjectPill);

        const scoreCell = document.createElement('td');
        scoreCell.textContent = rawScore;

        const dateCell = document.createElement('td');
        dateCell.textContent = dateText;

        const actionCell = document.createElement('td');
        const reviewBtn = document.createElement('button');
        reviewBtn.textContent = 'Review';
        reviewBtn.className = 'btn btn-secondary';
        reviewBtn.style.padding = '6px 16px';
        reviewBtn.style.borderRadius = '999px';
        reviewBtn.style.fontWeight = '600';
        reviewBtn.style.background = '#0e5c84';
        reviewBtn.style.color = '#ffffff';
        reviewBtn.style.border = 'none';
        reviewBtn.style.cursor = 'pointer';
        reviewBtn.onclick = () => {
            reviewTestFromSubject(subject, testIndex, attempt.__attemptNumber);
        };
        actionCell.appendChild(reviewBtn);

        row.appendChild(nameCell);
        row.appendChild(subjectCell);
        row.appendChild(scoreCell);
        row.appendChild(dateCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

function showPreviousTestsView(event) {
    if (event) event.preventDefault();
    const navLink = document.getElementById('nav-previous-tests');
    showView('previous-tests-view', null, navLink);
    renderPreviousTests();
}

function showPreviousTests(event) {
    showPreviousTestsView(event);
}

// --- React Dashboard Component ---
const subjects = [
    { name: 'Biology', icon: 'Dna', description: '', duration: '30 minutes per test', color: 'text-blue-800', bgColor: 'bg-blue-100' },
    { name: 'General Chemistry', icon: 'FlaskConical', description: '', duration: '30 minutes per test', color: 'text-cyan-500', bgColor: 'bg-cyan-100' },
    { name: 'Organic Chemistry', icon: 'Atom', description: '', duration: '30 minutes per test', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { name: 'Reading Comprehension', icon: 'BookOpen', description: '', duration: '60 minutes per test', color: 'text-green-800', bgColor: 'bg-green-100' },
    { name: 'Physics', icon: 'Rocket', description: '', duration: '50 minutes per test', color: 'text-purple-700', bgColor: 'bg-purple-100' },
    { name: 'Quantitative Reasoning', icon: 'Calculator', description: '', duration: '45 minutes per test', color: 'text-red-700', bgColor: 'bg-red-100' }
];

// Lucide icon helper - returns a React element that Lucide will upgrade
const createLucideIcon = (iconName, props = {}) =>
    React.createElement('i', Object.assign({}, props, {
        'data-lucide': iconName,
        'aria-hidden': 'true'
    }));

const lucideIconNameMap = {
    Dna: 'dna',
    FlaskConical: 'flask-conical',
    Atom: 'atom',
    BookOpen: 'book-open',
    Rocket: 'rocket',
    Calculator: 'calculator',
    ArrowRight: 'arrow-right',
    CheckCircle: 'check-circle',
    Home: 'home',
    Clock: 'clock',
    Tag: 'tag',
    ChevronLeft: 'chevron-left',
    ChevronDown: 'chevron-down',
    GraduationCap: 'graduation-cap',
    ClipboardList: 'clipboard-list',
    Eye: 'eye'
};

const getLucideIcon = (iconKey, props) => {
    const lucideName = lucideIconNameMap[iconKey];
    return lucideName ? createLucideIcon(lucideName, props) : null;
};

const SubjectCard = ({ subject }) => {
    // Map Tailwind color classes to actual border colors for hover effect
    const getBorderColor = (colorClass) => {
        const colorMap = {
            'text-blue-800': 'border-blue-800',
            'text-cyan-500': 'border-cyan-500',
            'text-orange-600': 'border-orange-600',
            'text-green-800': 'border-green-800',
            'text-purple-700': 'border-purple-700',
            'text-red-700': 'border-red-700'
        };
        return colorMap[colorClass] || 'border-gray-900';
    };

    return React.createElement('div', {
        className: `relative p-6 md:p-8 rounded-3xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl hover:scale-[1.02] cursor-pointer bg-white group h-full flex flex-col justify-between`,
        style: { border: '4px solid #111827' },
        role: 'link',
        'aria-label': `Start ${subject.name} practice`,
        onClick: () => showSubject(subject.name)
    }, [
        React.createElement('div', null, [
            React.createElement('div', { className: 'flex items-start justify-between mb-4' }, [
                React.createElement('div', { className: `p-3 rounded-full ${subject.bgColor}` },
                    getLucideIcon(subject.icon, { className: `${subject.color} w-8 h-8` })
                ),
                getLucideIcon('ArrowRight', { className: 'w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors' })
            ]),
            React.createElement('h3', { className: `text-xl md:text-2xl font-extrabold mb-2 leading-tight ${subject.color}` }, subject.name),
            React.createElement('p', { className: 'text-sm text-gray-600 mb-4' }, subject.description)
        ]),
        React.createElement('div', { className: 'flex items-center text-sm font-medium text-gray-500 mt-4 pt-4 border-t border-gray-200' }, [
            getLucideIcon('CheckCircle', { className: 'w-4 h-4 mr-2 text-gray-400' }),
            React.createElement('span', null, subject.duration)
        ]),
        React.createElement('div', {
            className: `absolute inset-0 rounded-3xl border-4 border-transparent group-hover:border-4 ${getBorderColor(subject.color)} transition-all duration-300 pointer-events-none`
        })
    ]);
};

const App = () => {
    const bubblyPattern = "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23514a84' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E";

    return React.createElement('div', {
        className: 'min-h-screen',
        style: {
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#282a5c'
        }
    }, [
        // Full-width header banner - independent of sidebar, always 100vw
        React.createElement('div', {
            className: 'dashboard-hero text-center py-10 md:py-16 relative',
            style: {
                position: 'relative',
                width: '100vw',
                left: '0',
                right: '0',
                backgroundColor: '#282a5c',
                backgroundImage: `url("${bubblyPattern}")`,
                backgroundSize: '40px 40px',
                '--hero-pattern': `url("${bubblyPattern}")`,
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)'
            }
        }, [
            // Centered content inside full-width banner
            React.createElement('div', {
                className: 'max-w-6xl mx-auto px-4',
                style: {
                    position: 'relative',
                    zIndex: 1
                }
            }, [
                React.createElement('h1', {
                    className: 'text-5xl sm:text-6xl md:text-7xl font-black leading-none drop-shadow-lg mb-4'
                }, [
                    React.createElement('span', { style: { color: '#60A5FA' } }, 'Opto'),
                    React.createElement('span', { style: { color: '#ffffff' } }, 'future'),
                    React.createElement('span', { style: { color: '#60A5FA' } }, 'prep')
                ]),
                React.createElement('p', {
                    className: 'text-lg sm:text-xl font-medium flex items-center justify-center space-x-2',
                    style: { color: '#60A5FA' }
                }, [
                    React.createElement('span', { className: 'text-2xl' }, '🚀'),
                    React.createElement('span', null, 'Comprehensive OAT Exams.'),
                    React.createElement('span', { className: 'text-2xl' }, '🎯')
                ])
            ])
        ]),

        // Centered Subject Grid Container - below header banner
        React.createElement('div', {
            className: 'flex-1 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-16',
            style: {
                width: '100%'
            }
        }, [
            React.createElement('div', {
                className: 'bg-white rounded-3xl border-4 border-gray-900 p-6 md:p-10 shadow-2xl max-w-7xl mx-auto',
                style: {
                    border: '4px solid #111827'
                }
            }, [
                React.createElement('h2', {
                    className: 'text-2xl font-bold text-gray-900 mb-8 text-center'
                }, 'Choose Your Subject Practice Area'),

                React.createElement('main', {
                    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'
                }, subjects.map((subject) =>
                    React.createElement(SubjectCard, { key: `subject-card-${subject.name}`, subject: subject })
                ))
            ])
        ])
    ]);
};

// Initialize React when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('dashboard-react-root');
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(React.createElement(App));

        // Set dashboard-active class on body if dashboard is visible by default
        const dashboardView = document.getElementById('dashboard-view');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');

        if (dashboardView) {
            const isVisible = dashboardView.style.display !== 'none' &&
                window.getComputedStyle(dashboardView).display !== 'none';

            if (isVisible) {
                document.body.classList.add('dashboard-active');
                // Show sidebar for dashboard (not hidden like before)
                if (sidebar) {
                    sidebar.style.display = 'flex';
                }
                if (mainContent) {
                    // Sidebar overlays, so main-content is full width
                    mainContent.style.marginLeft = '0';
                    mainContent.style.width = '100%';
                }

                updateDashboardOffset();
            }
        }

        // Initialize Lucide icons for sidebar and React content
        setTimeout(() => {
            if (window.lucide) {
                lucide.createIcons();
            }
        }, 100);

        // Also initialize icons after a longer delay to ensure everything is rendered
        setTimeout(() => {
            if (window.lucide) {
                lucide.createIcons();
            }
        }, 500);
    }
});

window.addEventListener('resize', updateDashboardOffset);

// Initialize React component for subject pages
let isInitializingReact = false; // Prevent multiple simultaneous initializations

function initializeSubjectPagesReact(subjectName) {
    // Prevent multiple simultaneous initializations
    if (isInitializingReact) {
        console.warn('React initialization already in progress, skipping duplicate call');
        return;
    }

    // Check if reset is in progress - skip initialization if so
    try {
        if (sessionStorage.getItem('reset-in-progress') === 'true') {
            sessionStorage.removeItem('reset-in-progress');
            return; // Skip initialization during reset
        }
    } catch (e) {
        // Ignore if sessionStorage not available
    }

    const rootElement = document.getElementById('subject-pages-react-root');
    if (!rootElement) {
        console.error('subject-pages-react-root element not found');
        return;
    }

    // Verify element is still in DOM
    if (!rootElement.parentNode || !rootElement.isConnected) {
        console.warn('Root element is not in DOM, skipping initialization');
        return;
    }

    // Set flag to prevent concurrent initializations
    isInitializingReact = true;

    // Wait for SubjectPagesApp to be available (Babel might still be transpiling)
    const tryInitialize = (attempts = 0) => {
        // Check if React and ReactDOM are available
        if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
            if (attempts < 50) {
                setTimeout(() => tryInitialize(attempts + 1), 100);
                return;
            } else {
                console.error('React or ReactDOM not available after waiting');
                isInitializingReact = false;
                return;
            }
        }

        if (window.SubjectPagesApp && typeof window.SubjectPagesApp === 'function') {
            try {
                // Verify element is still in DOM before proceeding
                if (!rootElement.parentNode || !rootElement.isConnected) {
                    console.warn('Root element removed from DOM during initialization');
                    isInitializingReact = false;
                    return;
                }

                // Handle existing React root - try to reuse it first
                // Don't clear the reference yet - we'll check if we can reuse it

                // Proceed with render - the proceedWithRender function will handle root reuse
                proceedWithRender();

                function proceedWithRender() {
                    // Double-check element is still in DOM before rendering
                    if (!rootElement.parentNode || !rootElement.isConnected) {
                        console.warn('Root element removed during cleanup, aborting render');
                        return;
                    }

                    try {
                        // Try to reuse existing root first (safest approach)
                        let root = rootElement._reactRoot;

                        // Also check for React's internal root markers
                        const hasReactRoot = Object.keys(rootElement).some(key =>
                            key.startsWith('__reactFiber') || key.startsWith('__reactContainer')
                        );

                        // Check if existing root is valid and can be reused
                        if (root && typeof root.render === 'function') {
                            try {
                                // Try to render with existing root - this is the safest
                                // Wrap in try-catch to suppress removeChild errors during React's internal cleanup
                                root.render(React.createElement(window.SubjectPagesApp, { activeSubject: subjectName }));
                                // Success - exit early
                                isInitializingReact = false;
                                return;
                            } catch (renderError) {
                                // Check if this is a NotFoundError or removeChild error
                                const isRemoveChildError = renderError.message && (
                                    renderError.message.includes('removeChild') ||
                                    renderError.message.includes('Failed to execute \'removeChild\'') ||
                                    renderError.message.includes('not a child') ||
                                    renderError.name === 'NotFoundError'
                                ) || renderError.name === 'NotFoundError';

                                if (isRemoveChildError) {
                                    // Suppress removeChild errors - these are harmless React cleanup issues
                                    console.warn('React cleanup error (harmless, suppressed):', renderError.message || renderError);
                                    // Try to unmount the root safely and create a new one
                                    try {
                                        if (root && typeof root.unmount === 'function') {
                                            // Unmount in a try-catch to avoid errors during unmounting
                                            try {
                                                root.unmount();
                                            } catch (unmountError) {
                                                // Ignore unmount errors - they're usually harmless
                                                console.warn('Unmount error (ignored):', unmountError.message);
                                            }
                                        }
                                    } catch (unmountError) {
                                        // Ignore
                                    }
                                    // Clear reference and create new root
                                    root = null;
                                    rootElement._reactRoot = null;
                                    // Continue to create new root below
                                } else {
                                    // If render fails for other reasons, root might be invalid - create new one
                                    console.warn('Existing root render failed:', renderError.message);
                                    root = null; // Force creation of new root
                                    rootElement._reactRoot = null; // Clear reference
                                }
                            }
                        } else if (hasReactRoot && !root) {
                            // React has a root but we don't have a reference
                            // Try to just render directly if React component is available
                            // This avoids creating a duplicate root
                            try {
                                // Check if we can access React's internal root
                                // If not, skip initialization to avoid removeChild errors
                                console.warn('React root detected but no reference, attempting to render directly');
                                // Don't create a new root - this causes removeChild errors
                                isInitializingReact = false;
                                return; // Exit - don't create a new root
                            } catch (e) {
                                console.warn('Cannot access React root, skipping to avoid removeChild error');
                                isInitializingReact = false;
                                return;
                            }
                        }

                        // Create new root only if we don't have a valid one
                        if (!root) {
                            // Check if React has already created a root for this element
                            // React 18 stores root internally, so we need to check differently
                            const reactInternalKey = Object.keys(rootElement).find(key =>
                                key.startsWith('__reactFiber') || key.startsWith('__reactContainer')
                            );

                            // If React already has a root, try to use it instead of creating a new one
                            if (reactInternalKey) {
                                console.warn('React root already exists on element, attempting to render directly');
                                try {
                                    // Try to render directly - React 18 should handle this
                                    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
                                        // Create a new root - React 18 will handle the existing one
                                        root = ReactDOM.createRoot(rootElement);
                                        rootElement._reactRoot = root;
                                        root.render(React.createElement(window.SubjectPagesApp, { activeSubject: subjectName }));
                                        isInitializingReact = false;
                                        return;
                                    }
                                } catch (e) {
                                    console.warn('Failed to render with existing root, will try to create new one:', e.message);
                                }
                            }

                            // No React root exists - safe to create one
                            try {
                                // Double-check element is still in DOM before creating root
                                if (!rootElement.parentNode || !rootElement.isConnected) {
                                    console.warn('Root element not in DOM, cannot create root');
                                    isInitializingReact = false;
                                    return;
                                }

                                // Verify ReactDOM is available
                                if (typeof ReactDOM === 'undefined' || !ReactDOM.createRoot) {
                                    console.error('ReactDOM.createRoot is not available');
                                    isInitializingReact = false;
                                    return;
                                }

                                // Clear the old root reference
                                rootElement._reactRoot = null;

                                // Before creating root, clear any existing content safely
                                // This prevents React from trying to remove non-existent nodes
                                try {
                                    // Only clear if element has children to avoid issues
                                    if (rootElement.children.length > 0) {
                                        // Use a safe method to clear children
                                        while (rootElement.firstChild) {
                                            try {
                                                rootElement.removeChild(rootElement.firstChild);
                                            } catch (removeError) {
                                                // If removeChild fails, the node might not be a child
                                                // Just remove it using a different method
                                                if (rootElement.firstChild && rootElement.firstChild.parentNode === rootElement) {
                                                    rootElement.removeChild(rootElement.firstChild);
                                                } else {
                                                    // Node is not a child, remove it differently
                                                    if (rootElement.firstChild) {
                                                        rootElement.firstChild.remove();
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } catch (clearError) {
                                    // Ignore errors during clearing - React will handle it
                                    console.warn('Error clearing root element (ignored):', clearError.message);
                                }

                                // Create new root - React 18 will handle cleanup automatically
                                root = ReactDOM.createRoot(rootElement);
                                rootElement._reactRoot = root;

                                try {
                                    root.render(React.createElement(window.SubjectPagesApp, { activeSubject: subjectName }));
                                    isInitializingReact = false;
                                } catch (renderError) {
                                    // Check for NotFoundError or removeChild errors
                                    const isRemoveChildError = (
                                        renderError.message && (
                                            renderError.message.includes('removeChild') ||
                                            renderError.message.includes('Failed to execute \'removeChild\'') ||
                                            renderError.message.includes('not a child')
                                        )
                                    ) || renderError.name === 'NotFoundError';

                                    if (isRemoveChildError) {
                                        // Suppress removeChild errors during initial render
                                        console.warn('React cleanup error during initial render (harmless, suppressed):', renderError.message || renderError);
                                        // Continue - React will handle it
                                        isInitializingReact = false;
                                    } else {
                                        console.error('Error rendering component:', renderError);
                                        isInitializingReact = false;
                                        throw renderError;
                                    }
                                }
                            } catch (createError) {
                                // Check if this is a "already has a root" error or NotFoundError
                                const isAlreadyHasRoot = createError.message && (
                                    createError.message.includes('already has a root') ||
                                    createError.message.includes('root already exists')
                                );
                                const isNotFoundError = createError.name === 'NotFoundError' ||
                                    (createError.message && createError.message.includes('NotFoundError'));

                                if (isAlreadyHasRoot || isNotFoundError) {
                                    // Element already has a root or there's a DOM issue
                                    console.warn('Cannot create React root (already exists or DOM issue), attempting direct render');
                                    // Try to render directly without creating a new root
                                    try {
                                        if (window.SubjectPagesApp) {
                                            // Use ReactDOM.render as fallback for React 18 compatibility
                                            if (ReactDOM.render) {
                                                ReactDOM.render(React.createElement(window.SubjectPagesApp, { activeSubject: subjectName }), rootElement);
                                            } else {
                                                // Last resort - try to find and reuse existing root
                                                const existingRoot = rootElement._reactRoot;
                                                if (existingRoot && typeof existingRoot.render === 'function') {
                                                    existingRoot.render(React.createElement(window.SubjectPagesApp, { activeSubject: subjectName }));
                                                }
                                            }
                                        }
                                    } catch (fallbackError) {
                                        console.error('Fallback render also failed:', fallbackError);
                                    }
                                    isInitializingReact = false;
                                    return;
                                } else {
                                    console.error('Error creating React root:', createError);
                                    isInitializingReact = false;
                                    // Don't throw - just log the error and continue
                                }
                            }
                        }

                        // Initialize Lucide icons after render - wait for React to render
                        setTimeout(() => {
                            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                                try {
                                    window.lucide.createIcons();
                                } catch (iconError) {
                                    console.warn('Error initializing icons:', iconError.message);
                                }
                            }
                        }, 300);

                        // Also initialize after React has fully rendered
                        setTimeout(() => {
                            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                                try {
                                    window.lucide.createIcons();
                                } catch (iconError) {
                                    console.warn('Error initializing icons (delayed):', iconError.message);
                                }
                            }
                        }, 600);

                        console.log('SubjectPagesApp initialized for:', subjectName);
                    } catch (renderError) {
                        // Check for NotFoundError or removeChild errors
                        const isRemoveChildError = (
                            renderError.message && (
                                renderError.message.includes('removeChild') ||
                                renderError.message.includes('Failed to execute \'removeChild\'') ||
                                renderError.message.includes('not a child')
                            )
                        ) || renderError.name === 'NotFoundError';

                        if (isRemoveChildError) {
                            // Suppress removeChild errors - these are harmless React cleanup issues
                            console.warn('React cleanup error during render (harmless, suppressed):', renderError.message || renderError);
                        } else {
                            console.error('Error rendering SubjectPagesApp:', renderError);
                        }
                    } finally {
                        // Always clear the initialization flag
                        isInitializingReact = false;
                    }
                }
            } catch (error) {
                console.error('Error initializing SubjectPagesApp:', error);
                // Clear flag on error
                isInitializingReact = false;
            }
        } else if (attempts < 20) {
            // Wait up to 2 seconds for Babel to transpile (20 attempts * 100ms)
            setTimeout(() => tryInitialize(attempts + 1), 100);
        } else {
            console.error('SubjectPagesApp not available after waiting');
            // Clear flag if we give up
            isInitializingReact = false;
        }
    };

    // Start initialization
    tryInitialize();
}

// Expose functions to window for React component to use
if (typeof window !== 'undefined') {
    window.startPreTest = startPreTest;
    window.allTestData = allTestData;

    // Verify General Chemistry data is loaded
    console.log(' Script.js: Checking GeneralChemistryExamData:', typeof window.GeneralChemistryExamData !== 'undefined' ? 'LOADED' : 'NOT LOADED');
    if (typeof window.GeneralChemistryExamData !== 'undefined') {
        console.log(' Script.js: GeneralChemistryExamData has', window.GeneralChemistryExamData.length, 'tests');
        for (let i = 0; i < Math.min(window.GeneralChemistryExamData.length, 3); i++) {
            if (window.GeneralChemistryExamData[i]) {
                console.log(` Script.js: Test ${i + 1} has`, window.GeneralChemistryExamData[i].length, 'questions');
            }
        }
    }
    window.reviewTestFromSubject = reviewTestFromSubject;
    window.initializeSubjectPagesReact = initializeSubjectPagesReact;
    window.performTestReset = performTestReset;
    window.resetAllExams = resetAllExams;
    window.getTestAttempts = getTestAttempts;
    window.getTaggedQuestions = getTaggedQuestions;
    window.clearFullExamState = clearFullExamState;
    window.clearTestState = clearTestState;
    window.endTest = endTest;
    window.showView = showView;
    window.showSubject = showSubject;
    window.exitFromActiveTest = exitFromActiveTest;
    window.exitFromReview = exitFromReview;
    window.disableTestExitWarning = disableTestExitWarning;
    window.hideExhibit = hideExhibit;
}
