// OAT Quantitative Reasoning Practice Test — React Exam Engine wrapper
(function () {
    "use strict";

    if (window.OATQuantitativeExamLoaded) {
        return;
    }
    window.OATQuantitativeExamLoaded = true;

    const QUESTIONS = [
        {
            stem: "This is a placeholder question for Quantitative Reasoning Practice Test. The exam interface is fully functional.",
            c: ["Option A", "Option B", "Option C", "Option D"],
            a: 0
        },
        {
            stem: "This is another placeholder question for Quantitative Reasoning. All exam features work including timer and navigation.",
            c: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
            a: 1
        }
    ];

    function registerExam() {
        if (!window.ExamRuntime) {
            console.error("ExamRuntime is not available for Quantitative Reasoning exam.");
            return;
        }

        try {
            const ExamEngine = window.ExamRuntime.resolve("ExamEngine");
            window.OATQuantitativeExam = function OATQuantitativeExam() {
                return (
                    <ExamEngine
                        subject="Quantitative Reasoning"
                        title="Quantitative Reasoning Practice Test"
                        questions={QUESTIONS}
                        storageKey="oat_quantitative_full_exam_user_state_v1"
                        durationMinutes={30}
                        allowExhibit={false}
                        allowUploads={true}
                    />
                );
            };
        } catch (err) {
            console.error("Unable to initialize Quantitative Reasoning Exam:", err);
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

