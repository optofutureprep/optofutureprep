// Test Review View Component
// Displays past test attempts with question-by-question breakdown

(function () {
  'use strict';

  if (typeof window.TestReviewViewLoaded !== 'undefined') {
    return;
  }
  window.TestReviewViewLoaded = true;

  const { useState, useEffect } = React;

  window.TestReviewView = function ({ attemptId, subject, testIndex, onClose }) {
    const [attempt, setAttempt] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [highlights, setHighlights] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAllQuestions, setShowAllQuestions] = useState(false);

    // Load attempt data
    useEffect(() => {
      async function loadAttempt() {
        try {
          setLoading(true);

          // Load from localStorage
          const key = `completed-test-${subject}-${testIndex}`;
          const saved = localStorage.getItem(key);
          if (saved) {
            const attemptData = JSON.parse(saved);
            setAttempt(attemptData);

            // Load questions
            if (window.allTestData && window.allTestData[subject] && window.allTestData[subject][testIndex]) {
              setQuestions(window.allTestData[subject][testIndex]);
            }

            // Load highlights if available
            if (attemptData.highlights) {
              setHighlights(attemptData.highlights);
            }
          }
        } catch (error) {
          console.error('Error loading attempt:', error);
        } finally {
          setLoading(false);
        }
      }

      if (subject && testIndex !== undefined) {
        loadAttempt();
      }
    }, [attemptId, subject, testIndex]);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading review...</div>
        </div>
      );
    }

    if (!attempt || !questions.length) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No attempt data found.</p>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            )}
          </div>
        </div>
      );
    }

    const userAnswers = attempt.userAnswers || {};
    const markedQuestions = attempt.markedQuestions || {};
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];
    const correctAnswer = currentQuestion.a;
    const isCorrect = userAnswer === correctAnswer;

    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Test Review: {subject} - Test {testIndex + 1}</h2>
            <p className="text-sm text-gray-300">
              Score: {attempt.score}% ({attempt.correct}/{attempt.total} correct)
              {attempt.date && ` • ${new Date(attempt.date).toLocaleDateString()}`}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Close
            </button>
          )}
        </div>

        {/* Question Navigation */}
        <div className="bg-gray-100 p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-3 py-1 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-3 py-1 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <button
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showAllQuestions ? 'Hide' : 'Show'} All Questions
            </button>
          </div>

          {/* Question Grid */}
          {showAllQuestions && (
            <div className="grid grid-cols-10 gap-2 mt-4">
              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrectQ = userAns === q.a;
                const isMarked = markedQuestions[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`p-2 rounded text-sm font-medium ${idx === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : isCorrectQ
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      } ${isMarked ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Question Status */}
            <div className={`mb-4 p-3 rounded ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
              <div className="flex items-center space-x-2">
                {isCorrect ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-green-800">Correct</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-red-800">Incorrect</span>
                  </>
                )}
                {markedQuestions[currentQuestionIndex] && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Marked
                  </span>
                )}
              </div>
            </div>

            {/* Question Stem */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.stem}</h3>

              {/* Choices */}
              <div className="space-y-3">
                {currentQuestion.c.map((choice, idx) => {
                  const isUserChoice = userAnswer === idx;
                  const isCorrectChoice = correctAnswer === idx;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded border-2 ${isCorrectChoice
                          ? 'bg-green-50 border-green-300'
                          : isUserChoice && !isCorrect
                            ? 'bg-red-50 border-red-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className={`font-semibold ${isCorrectChoice ? 'text-green-700' : isUserChoice && !isCorrect ? 'text-red-700' : 'text-gray-700'
                          }`}>
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="flex-1">{choice}</span>
                        {isCorrectChoice && (
                          <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded font-medium">
                            Correct Answer
                          </span>
                        )}
                        {isUserChoice && !isCorrect && (
                          <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded font-medium">
                            Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Highlights (if available) */}
            {highlights[`${subject}-${testIndex}-${currentQuestionIndex}`] && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Your Highlights</h4>
                <div
                  className="text-yellow-900"
                  dangerouslySetInnerHTML={{
                    __html: JSON.parse(highlights[`${subject}-${testIndex}-${currentQuestionIndex}`]).map(h => h.outerHTML).join('')
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  console.log('✅ TestReviewView component loaded');
})();

