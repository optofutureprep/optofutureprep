// OAT Reading Comprehension Practice Test — React Exam Engine wrapper
(function () {
    "use strict";

    if (window.OATReadingExamLoaded) {
        return;
    }
    window.OATReadingExamLoaded = true;

    // Load questions from global data
    let QUESTIONS = [];
    try {
        if (window.ReadingComprehensionExamData && window.ReadingComprehensionExamData[0]) {
            const rawQuestions = window.ReadingComprehensionExamData[0];
            const passages = window.ReadingComprehensionPassages || {};
            
            QUESTIONS = rawQuestions.map(q => {
                const passageData = passages[q.passageId];
                let passageText = null;
                if (passageData) {
                    passageText = (passageData.title ? passageData.title + "\n\n" : "") + passageData.text;
                }
                
                return {
                    stem: q.stem,
                    c: q.c,
                    a: q.a,
                    passage: passageText,
                    passageId: q.passageId
                };
            });
        } else {
            console.warn("ReadingComprehensionExamData not found or empty. Using placeholders.");
            QUESTIONS = [
                {
                    stem: "Data not loaded. Please check if exam-data.js is included.",
                    c: ["Option A", "Option B", "Option C", "Option D"],
                    a: 0
                }
            ];
        }
    } catch (e) {
        console.error("Error processing Reading Comprehension data:", e);
    }

    function registerExam() {
        if (!window.ExamRuntime) {
            console.error("ExamRuntime is not available for Reading Comprehension exam.");
            return;
        }

        try {
            const ExamEngine = window.ExamRuntime.resolve("ExamEngine");
            window.OATReadingExam = function OATReadingExam() {
                return (
                    <ExamEngine
                        subject="Reading Comprehension"
                        title="Reading Comprehension Practice Test"
                        questions={QUESTIONS}
                        storageKey="oat_reading_full_exam_user_state_v1"
                        durationMinutes={30}
                        allowExhibit={false}
                        allowUploads={false}
                    />
                );
            };
        } catch (err) {
            console.error("Unable to initialize Reading Comprehension Exam:", err);
        }
    }

    if (window.examEngineModulesReady) {
        registerExam();
    } else {
        window.addEventListener(
            "examEngineModulesReady",
            registerExam,
            { once: true }
        );
    }
})();

