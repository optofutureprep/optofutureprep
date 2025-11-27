// OAT Quantitative Reasoning Practice Test 1 — React Exam Engine wrapper
(function () {
    "use strict";

    if (window.OATQuantitativeTest1Loaded) {
        return;
    }
    window.OATQuantitativeTest1Loaded = true;

    const QUESTIONS = [
        { stem: "Five years ago, a mother was 3 times older than her daughter. In ten years, the mother will be twice as old as her daughter. How old is the daughter now?", c: ["10", "15", "20", "25", "30"], a: 2 },
        { stem: "If 3x + 7 = 22, what is the value of x?", c: ["3", "4", "5", "6", "7"], a: 2 },
        { stem: "A rectangle has a length that is 3 times its width. If the perimeter is 48 cm, what is the area?", c: ["48 cm²", "72 cm²", "108 cm²", "144 cm²", "192 cm²"], a: 2 },
        { stem: "What is 25% of 320?", c: ["60", "70", "80", "90", "100"], a: 2 },
        { stem: "If a car travels 240 miles in 4 hours, what is its average speed in miles per hour?", c: ["50 mph", "55 mph", "60 mph", "65 mph", "70 mph"], a: 2 },
        { stem: "Solve for y: 2y - 5 = 13", c: ["7", "8", "9", "10", "11"], a: 2 },
        { stem: "A circle has a radius of 7 cm. What is its area? (Use π = 22/7)", c: ["154 cm²", "154.5 cm²", "155 cm²", "156 cm²", "157 cm²"], a: 0 },
        { stem: "If 4 workers can complete a job in 12 days, how many days will it take 6 workers to complete the same job?", c: ["6 days", "7 days", "8 days", "9 days", "10 days"], a: 2 },
        { stem: "What is the value of 5² + 3³?", c: ["34", "44", "52", "62", "72"], a: 2 },
        { stem: "A bag contains 5 red balls, 3 blue balls, and 2 green balls. What is the probability of drawing a red ball?", c: ["1/2", "1/3", "1/4", "1/5", "1/10"], a: 0 },
        { stem: "If x = 4 and y = 3, what is the value of x² - y²?", c: ["5", "7", "9", "11", "13"], a: 1 },
        { stem: "A triangle has sides of length 5, 12, and 13. What type of triangle is it?", c: ["Equilateral", "Isosceles", "Right", "Obtuse", "Acute"], a: 2 },
        { stem: "What is the mean of the numbers 8, 12, 15, 20, and 25?", c: ["14", "15", "16", "17", "18"], a: 2 },
        { stem: "If 2x + 3y = 18 and x = 3, what is the value of y?", c: ["2", "3", "4", "5", "6"], a: 2 },
        { stem: "A store offers a 20% discount on all items. If an item originally costs $50, what is the sale price?", c: ["$35", "$38", "$40", "$42", "$45"], a: 2 },
        { stem: "What is the square root of 144?", c: ["10", "11", "12", "13", "14"], a: 2 },
        { stem: "If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?", c: ["8", "9", "10", "11", "12"], a: 2 },
        { stem: "A train travels 180 km in 3 hours. How far will it travel in 5 hours at the same speed?", c: ["280 km", "290 km", "300 km", "310 km", "320 km"], a: 2 },
        { stem: "What is the value of (2 + 3) × 4 - 5?", c: ["10", "15", "20", "25", "30"], a: 1 },
        { stem: "If a number is increased by 25% and the result is 50, what was the original number?", c: ["35", "38", "40", "42", "45"], a: 2 },
        { stem: "A square has an area of 64 cm². What is the length of one side?", c: ["6 cm", "7 cm", "8 cm", "9 cm", "10 cm"], a: 2 },
        { stem: "What is the median of the numbers 5, 8, 12, 15, 20?", c: ["10", "11", "12", "13", "14"], a: 2 },
        { stem: "If 5x = 35, what is the value of x?", c: ["5", "6", "7", "8", "9"], a: 2 },
        { stem: "A recipe calls for 2 cups of flour for every 3 cups of sugar. If you use 9 cups of sugar, how many cups of flour do you need?", c: ["4 cups", "5 cups", "6 cups", "7 cups", "8 cups"], a: 2 },
        { stem: "What is 15% of 200?", c: ["25", "30", "35", "40", "45"], a: 1 },
        { stem: "If the sum of two numbers is 25 and their difference is 5, what is the larger number?", c: ["12", "13", "14", "15", "16"], a: 3 },
        { stem: "A cube has a volume of 125 cm³. What is the length of one edge?", c: ["4 cm", "5 cm", "6 cm", "7 cm", "8 cm"], a: 1 },
        { stem: "What is the value of 3⁴?", c: ["64", "72", "81", "90", "100"], a: 2 },
        { stem: "If a shirt costs $30 and is on sale for 15% off, what is the sale price?", c: ["$24.50", "$25.00", "$25.50", "$26.00", "$26.50"], a: 2 },
        { stem: "A right triangle has legs of length 6 and 8. What is the length of the hypotenuse?", c: ["9", "10", "11", "12", "13"], a: 1 }
    ];

    function registerExam() {
        if (!window.ExamRuntime) {
            console.error("ExamRuntime is not available for Quantitative Reasoning Test 1.");
            return;
        }

        try {
            const ExamEngine = window.ExamRuntime.resolve("ExamEngine");
            window.OATQuantitativeTest1 = function OATQuantitativeTest1() {
                return (
                    <ExamEngine
                        subject="Quantitative Reasoning"
                        title="Quantitative Reasoning Practice Test 1"
                        questions={QUESTIONS}
                        storageKey="oat_quantitative_test1_user_state_v1"
                        durationMinutes={45}
                        allowExhibit={false}
                        allowUploads={true}
                    />
                );
            };
        } catch (err) {
            console.error("Unable to initialize Quantitative Reasoning Test 1:", err);
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



