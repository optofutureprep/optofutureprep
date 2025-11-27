// OAT General Chemistry Practice Test 2 — React Exam Engine wrapper
(function () {
    "use strict";

    if (window.OATGenChemTest2Loaded) {
        return;
    }
    window.OATGenChemTest2Loaded = true;

    const QUESTIONS = [
// 1. Lab
              { stem: "A student measures the mass of a liquid three times, obtaining 15.2 g, 15.3 g, and 15.1 g. The actual mass of the liquid is 17.5 g. Which of the following best describes these measurements?", c: ["Accurate but not precise", "Precise but not accurate", "Both accurate and precise", "Neither accurate nor precise"], a: 1 },
              // 2. Lab
              { stem: "Using an incorrectly calibrated pipette (e.g., it always dispenses 0.95 mL when it should dispense 1.00 mL) will result in what type of error?", c: ["Random error", "Systematic error", "Gross error", "Personal error"], a: 1 },
              // 3. Stoichiometry: Fixed subscripts
              { stem: "A molecule has a molar mass of 180.15 g/mol and an empirical formula of CH₂O. What is the molecular formula?", c: ["CH₂O", "C₃H₆O₃", "C₆H₁₂O₆", "C₇H₁₄O₇"], a: 2 },
              // 4. Stoichiometry: Fixed subscripts
              { stem: "How many grams of magnesium chloride (95.3 g/mol) are produced when 1.0 mol of chlorine (Cl₂) reacts with 0.5 moles of magnesium (Mg)? The reaction is: Mg(s) + Cl₂(g) → MgCl₂(s)", c: ["47.7 g", "95.3 g", "190.6 g", "24.1 g"], a: 0 },
              // 5. Periodic Trends
              { stem: "Which of the following elements has the highest first ionization energy?", c: ["Na", "Si", "S", "Ar"], a: 3 },
              // 6. Periodic Trends
              { stem: "Rank the following in order of *decreasing* atomic radius: K, Ca, Sc.", c: ["K > Ca > Sc", "Sc > Ca > K", "Ca > K > Sc", "K > Sc > Ca"], a: 0 },
              // 7. Atomic Structure: Fixed subscript
              { stem: "What is the correct molecular geometry of NH₃?", c: ["Tetrahedral", "Trigonal planar", "Bent", "Trigonal pyramidal"], a: 3 },
              // 8. Atomic Structure: Fixed superscripts and subscripts
              { stem: "Which of the following is an isoelectronic series?", c: ["Na⁺, K⁺, Rb⁺", "K⁺, Ca²⁺, Ar, S²⁻", "Na⁺, Mg²⁺, S²⁻, Cl⁻", "Li, Be, B, C"], a: 1 },
              // 9. Atomic Structure: Fixed subscript
              { stem: "A triple bond, such as in N₂, contains:", c: ["Three sigma bonds", "Two sigma bonds and one pi bond", "One sigma bond and two pi bonds", "Three pi bonds"], a: 2 },
              // 10. Gases
              { stem: "If the temperature of a gas is halved at constant pressure, the volume...", c: ["will be halved.", "will double.", "will be reduced to a third.", "will not change."], a: 0 },
              // 11. Gases: Fixed superscript
              { stem: "A container holds 4.0L of gas at 3.5 atm and 27°C. If the pressure is reduced to 0.8 atm without a change in temperature, what would be the volume of the gas?", c: ["11.0 L", "14.0 L", "15.0 L", "17.5 L"], a: 3 },
              // 12. Gases: Fixed subscripts
              { stem: "A mixture of O₂, N₂, and F₂ has a total pressure of 2.0 atm. The mole fractions are 0.3, 0.5, and 0.2, respectively. What is the partial pressure of the gaseous element present in the greatest mass? (Molar masses: O₂=32, N₂=28, F₂=38 g/mol)", c: ["0.4 atm (F₂)", "0.6 atm (O₂)", "1.0 atm (N₂)", "0.8 atm (F₂)"], a: 2 },
              // 13. Liquids/Solids: Fixed subscripts and superscripts
              { stem: "Which of the following is expected to be insoluble in water?", c: ["AgNO₃", "CsOH", "Mg(ClO₄)₂", "HgCO₃"], a: 3 },
              // 14. Liquids/Solids
              { stem: "A solution that cannot dissolve any more solute at room temperature is said to be...", c: ["Unsaturated", "Saturated", "Supersaturated", "Dilute"], a: 1 },
              // 15. Liquids/Solids
              { stem: "How many liters of a 10 M NaOH stock solution are needed to prepare 4 L of a 2 M NaOH solution?", c: ["0.8 L", "1.2 L", "2.0 L", "0.5 L"], a: 0 },
              // 16. Kinetics
              { stem: "A chemical compound X decomposes with a half-life of 3 hours. If there are 20 grams of X in a container, how long will it take for only 5 grams of X to be left?", c: ["1.5 hours", "3 hours", "6 hours", "9 hours"], a: 2 },
              // 17. Kinetics: Fixed superscript
              { stem: "What is the overall reaction order for the following rate law? rate = k[O₂]²[H₂]⁰·⁵", c: ["2", "0.5", "2.5", "1"], a: 2 },
              // 18. Kinetics
              { stem: "A plot of 1/[A] versus time (t) produces a straight line. What is the rate law for this reaction?", c: ["rate = k", "rate = k[A]", "rate = k[A]²", "rate = k[A]³"], a: 2 },
              // 19. Thermochemistry: Fixed Delta H (ΔH)
              { stem: "Which of the following statements is true regarding an endothermic reaction?", c: ["Heat is released into the surroundings.", "The surroundings decrease in temperature.", "The reaction has a negative ΔH value.", "Heat energy moves out of the system."], a: 1 },
              // 20. Thermochemistry: Fixed subscripts and Delta H (ΔH)
              { stem: "Given the reaction CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g), what is the setup for the standard enthalpy of reaction (ΔH°rxn)? (Given ΔH°f: CH₄=-75, CO₂=-393.5, H₂O=-285.8 kJ/mol)", c: ["[-393.5 + 2(-285.8)] - [-75]", "[-393.5 + (-285.8)] - [-75]", "[-75] - [-393.5 + 2(-285.8)]", "[-393.5 + 2(-285.8)] - [-75 + 2(0)]"], a: 3 },
              // 21. Thermochemistry: Fixed Delta G (ΔG)
              { stem: "Which of the following is true for a reaction that has a small negative ΔG value?", c: ["Products will be favored at equilibrium.", "Reactants will be favored at equilibrium.", "No reaction would occur.", "The reaction is non-spontaneous."], a: 0 },
              // 22. Equilibrium: Fixed subscripts, double-headed arrow, and K_eq
              { stem: "Consider the following reaction: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + heat. Which change would *decrease* the K_eq?", c: ["Increasing the temperature", "Decreasing the temperature", "Increasing the pressure", "Adding a catalyst"], a: 0 },
              // 23. Equilibrium
              { stem: "Which of the following indicates that a reaction is at equilibrium?", c: ["ΔH = 0", "[Reactants] = [Products]", "Q = K", "Forward rate = 0"], a: 2 },
              // 24. Equilibrium: Fixed subscripts, double-headed arrow, and K_c
              { stem: "What is the equilibrium constant expression (K_c) for the reaction: MgCO₃(s) ⇌ MgO(s) + CO₂(g)?", c: ["K_c = [CO₂]", "K_c = [MgO][CO₂] / [MgCO₃]", "K_c = [MgCO₃] / ([MgO][CO₂])", "K_c = 1 / [CO₂]"], a: 0 },
              // 25. Electrochemistry
              { stem: "In a galvanic cell, which of the following is true?", c: ["Oxidation occurs at the cathode.", "The cathode is positive and the anode is negative.", "It is a non-spontaneous reaction.", "Electrons flow from the cathode to the anode."], a: 1 },
              // 26. Electrochemistry: Fixed superscripts
              { stem: "To electroplate a piece of copper metal with zinc, what reaction must occur at the cathode?", c: ["Cu²⁺ + 2e⁻ → Cu", "Zn²⁺ + 2e⁻ → Zn", "Cu → Cu²⁺ + 2e⁻", "Zn → Zn²⁺ + 2e⁻"], a: 1 },
              // 27. Electrochemistry: Fixed subscripts and superscripts
              { stem: "What is the oxidation number of manganese in the complex ion [Mn(CN)₆]³⁻?", c: ["-3", "0", "+3", "+6"], a: 2 },
              // 28. Nuclear Reactions
              { stem: "The half-life of strontium-90 is 28 years. If you start with a 100 g sample, how much will remain after 84 years?", c: ["50 g", "25 g", "12.5 g", "6.25 g"], a: 2 },
              // 29. Nuclear Reactions: Fixed superscripts and subscripts for the decay equation
              { stem: "What is the missing product 'X' in the decay process shown below? ²³⁰₉₀Th → ⁰₋₁β + X", c: ["²³⁰₉₁Pa", "²³⁰₈₉Ac", "²²⁶₈₈Ra", "²³⁰₉₀Th"], a: 0 },
              // 30. Nuclear Reactions
              { stem: "Which of the following best describes nuclear binding energy?", c: ["The energy needed to hold electrons and protons together.", "The energy released during nuclear fusion.", "The energy required to remove an electron from an atom.", "The energy required to disassemble the nucleus of an atom into its components."], a: 3 }
    ];

    const PERIODIC_TABLE_SRC =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA78AAAK4CAYAAAC8b7EwAAABaElEQVR4nO3RAQ0AAAgDIN8/9K3hYwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    function registerExam() {
        if (!window.ExamRuntime) {
            console.error("ExamRuntime is not available for General Chemistry Test 2.");
            return;
        }

        try {
            const ExamEngine = window.ExamRuntime.resolve("ExamEngine");
            window.OATGenChemTest2 = function OATGenChemTest2() {
                return (
                    <ExamEngine
                        subject="General Chemistry"
                        title="General Chemistry Practice Test 2"
                        questions={QUESTIONS}
                        storageKey="oat_genchem_test2_user_state_v1"
                        durationMinutes={30}
                        allowExhibit={true}
                        exhibitContent={
                            <img
                                src={PERIODIC_TABLE_SRC}
                                alt="Periodic Table"
                                className="w-full h-auto"
                            />
                        }
                        allowUploads={true}
                    />
                );
            };
        } catch (err) {
            console.error("Unable to initialize General Chemistry Test 2:", err);
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
