// General Chemistry Exam Data
// This file contains all exam questions for General Chemistry
// Extracted from Practice Tests 1-10

(function() {
    window.GeneralChemistryExamData = [
        // Test 1
        [
            // 1. Stoichiometry: Fractions use the clearer "Fraction Slash" Unicode character
              { stem: "Nitric oxide, NO, rapidly reacts with O₂ to form NO₂. How many grams of NO are required to completely react with 1.75 g of O₂?", c: ["(1⁄32)(2⁄1)(30⁄1)", "1.75(1⁄32)(30⁄1)", "1.75(1⁄16)(2⁄1)(30⁄1)", "1.75(1⁄32)(2⁄1)(30⁄1)", "(1⁄16)(30⁄1)"], a: 3 },
              // 2. Gas laws
              { stem: "At constant volume, pressure is directly proportional to absolute temperature. Which gas law is this?", c: ["Boyle's Law", "Charles's Law", "Gay-Lussac's Law", "Avogadro's Law"], a: 2 },
              // 3. Acid-base: Fixed subscripts and scientific notation symbols
              { stem: "Which aqueous solution has the lowest pH at 25°C?", c: ["0.10 M NH₃ (Kᵇ = 1.8×10⁻⁵)", "0.10 M HCN (Kₐ = 6.2×10⁻¹⁰)", "0.10 M HCl", "0.10 M NaOAc (acetic acid Kₐ = 1.8×10⁻⁵)"], a: 2 },
              // 4. Thermo: Fixed LaTeX for Delta S (ΔS)
              { stem: "For an endothermic reaction with positive ΔS, the reaction is:", c: ["Spontaneous at all T", "Nonspontaneous at all T", "Spontaneous only at low T", "Spontaneous only at high T"], a: 3 },
              // 5. Periodic trends
              { stem: "Which atom has the largest first ionization energy?", c: ["Na", "Cl", "K", "S"], a: 1 },
              // 6. Solutions/colligative
              { stem: "Adding NaCl to water primarily changes which property?", c: ["Vapor pressure (decreases)", "Density (decreases)", "Boiling point (decreases)", "Freezing point (increases)"], a: 0 },
              // 7. Equilibrium: Fixed subscripts and double-headed arrow symbol
              { stem: "For the reaction N₂O₄(g) ⇌ 2 NO₂(g), which change shifts equilibrium to the right?", c: ["Decrease T (exo forward)", "Increase volume of container", "Add inert gas at constant V", "Remove NO₂"], a: 1 },
              // 8. Kinetics: Fixed LaTeX for ln[A]
              { stem: "A plot of ln[A] vs time is linear. The reaction order in A is:", c: ["Zero", "First", "Second", "Third"], a: 1 },
              // 9. Redox: Fixed LaTeX and subscript/superscript for chemical formulas
              { stem: "In the acidic half-reaction method, what is the coefficient of H₂O when balancing Cr₂O₇²⁻ → Cr³⁺?", c: ["7 on product side", "7 on reactant side", "14 on product side", "None"], a: 0 },
              // 10. Bonding/VSEPR: Fixed LaTeX and subscript for SF₄
              { stem: "What is the molecular geometry of SF₄?", c: ["Tetrahedral", "Trigonal bipyramidal", "Seesaw", "Square planar"], a: 2 },
              // 11. States/IMFs: Fixed all subscripts for hydrocarbons
              { stem: "Which has the highest normal boiling point?", c: ["CH₄", "C₂H₆", "C₃H₈", "C₄H₁₀"], a: 3 },
              // 12. Electrochemistry: Fixed LaTeX for arrow and standard cell potential (E°cell)
              { stem: "For a galvanic cell, which is true?", c: ["Electrons flow anode→cathode; E°cell > 0", "Electrons flow cathode→anode; E°cell < 0", "Oxidation at cathode", "Cations flow to anode through salt bridge"], a: 0 },
              // 13. Gases (real vs ideal)
              { stem: "Compared with ideal behavior, a real gas at high pressure shows:", c: ["Lower P due to attractions", "Higher P due to attractions", "Same P because b cancels a", "No dependence on a or b"], a: 0 },
              // 14. Buffers: Fixed LaTeX for subscripts and scientific notation
              { stem: "A buffer is made by mixing 0.20 mol HA (Kₐ=1.0×10⁻⁵) and 0.10 mol A⁻ in 1.0 L. pH is roughly:", c: ["4.70", "4.30", "5.00", "9.70"], a: 1 },
              // 15. Nuclear: Fixed LaTeX for Greek letters (alpha, beta, gamma)
              { stem: "Which radiation has the greatest penetrating power?", c: ["α", "β", "γ", "Positron"], a: 2 },
              // 16. Orbitals
              { stem: "How many orbitals are in a 4d subshell?", c: ["5", "7", "9", "10"], a: 0 },
              // 17. Titrations
              { stem: "At the equivalence point of a strong acid–strong base titration, the pH is:", c: ["< 7", "= 7", "> 7", "Cannot be determined"], a: 1 },

              // New Questions 18-30 (13 questions added)
              // 18. Quantum Numbers
              { stem: "Which set of quantum numbers (n, l, m₁, mₛ) is invalid?", c: ["(2, 1, -1, +½)", "(3, 2, 0, -½)", "(1, 0, 0, +½)", "(3, 3, 1, -½)"], a: 3 },
              // 19. Chemical Formulas
              { stem: "What is the formula for the ionic compound formed between aluminum and sulfate ions?", c: ["AlSO₄", "Al(SO₄)₂", "Al₂(SO₄)₃", "Al₃(SO₄)₂"], a: 2 },
              // 20. Density and Specific Gravity
              { stem: "If a liquid has a density of 1.25 g/mL, its specific gravity is:", c: ["1.25 kg/L", "0.80", "1.25", "2.50"], a: 2 },
              // 21. Phase Changes
              { stem: "The conversion of a liquid directly to a gas at the boiling point is characterized by:", c: ["ΔH < 0 and ΔS < 0", "ΔH > 0 and ΔS > 0", "ΔH < 0 and ΔS > 0", "ΔH > 0 and ΔS < 0"], a: 1 },
              // 22. Lewis Structures
              { stem: "How many lone pairs of electrons are on the central atom of H₂O?", c: ["0", "1", "2", "3"], a: 2 },
              // 23. Molarity/Dilution
              { stem: "What volume of 6.0 M HCl is needed to prepare 500 mL of 0.12 M HCl?", c: ["2.0 mL", "5.0 mL", "10.0 mL", "15.0 mL"], a: 2 },
              // 24. Intermolecular Forces (IMFs)
              { stem: "Which type of intermolecular force is present in all molecular substances?", c: ["Dipole-Dipole", "Hydrogen Bonding", "Ion-Dipole", "London Dispersion Forces"], a: 3 },
              // 25. Strong/Weak Electrolytes
              { stem: "Which compound is considered a weak electrolyte?", c: ["NaCl", "HCl", "CH₃COOH (Acetic Acid)", "NaOH"], a: 2 },
              // 26. Reaction Types (Combustion)
              { stem: "The reaction C₃H₈ + 5O₂ → 3CO₂ + 4H₂O is an example of:", c: ["Decomposition", "Single Replacement", "Combustion", "Acid-Base Neutralization"], a: 2 },
              // 27. Ideal Gas Law Application
              { stem: "In the Ideal Gas Law (PV = nRT), the variable 'V' represents:", c: ["Volume occupied by one mole of gas", "Volume of the container", "Total volume of gas particles", "Volume at STP"], a: 1 },
              // 28. Rate of Reaction
              { stem: "Increasing the temperature of a reaction typically increases the reaction rate because:", c: ["It decreases the activation energy", "It increases the frequency of collisions", "It lowers the energy of the products", "It shifts the equilibrium to the right"], a: 1 },
              // 29. Isomers
              { stem: "Compounds with the same molecular formula but different structural arrangements are called:", c: ["Polymers", "Allotropes", "Isotopes", "Isomers"], a: 3 },
              // 30. Significant Figures
              { stem: "How many significant figures are in the measurement 0.005080 grams?", c: ["3", "4", "5", "6"], a: 3 }
        ],
        // Test 2
        [
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
        ],
        // Test 3
        [
              { stem: "Which of the following in this isoelectronic series has the largest atomic radius: O²⁻, F⁻, Ne, Na⁺, Mg²⁺?", c: ["Mg²⁺", "Na⁺", "Ne", "F⁻", "O²⁻"], a: 4 },
              // 2. Atomic Structure
              { stem: "What is the correct number of unpaired electrons in a ground-state cobalt (Co) atom?", c: ["0", "1", "2", "3", "7"], a: 3 },
              // 3. Gases
              { stem: "A container holds a mixture of helium (He, 4 g/mol) and methane (CH₄, 16 g/mol). If there is a small hole, how many times faster will the helium effuse compared to the methane?", c: ["1.5x", "2x", "3x", "4x", "16x"], a: 1 },
              // 4. Electrochemistry
              { stem: "Based on the following reduction potentials, which of the following is the strongest oxidizing agent? (E°red values: A=-2.93 V, B=-1.37 V, C=+0.742 V, D=+1.07 V)", c: ["A", "B", "C", "D"], a: 3 },
              // 5. Thermochemistry
              { stem: "Which of the following best describes the signs of heat (q) and internal energy (ΔE) for a reaction where no work is done but heat is lost to the surroundings?", c: ["q > 0, ΔE > 0", "q < 0, ΔE < 0", "q > 0, ΔE < 0", "q = 0, ΔE < 0"], a: 1 },
              // 6. Kinetics
              { stem: "Given A+B → C. Using the data below, determine the rate law. (Trial 1: [A]=0.8, [B]=0.5, Rate=2.5x10⁻⁵) (Trial 2: [A]=1.6, [B]=0.5, Rate=1.0x10⁻⁴) (Trial 3: [A]=0.8, [B]=1.0, Rate=5.0x10⁻⁵)", c: ["Rate = k[A][B]", "Rate = k[A]²[B]", "Rate = k[A][B]²", "Rate = k[A]²[B]²"], a: 1 },
              // 7. Equilibrium
              { stem: "If the equilibrium constant for the given balanced reaction (A ⇌ B) is 5, what is the equilibrium constant for the reverse reaction (B ⇌ A)?", c: ["-5", "5", "0.2", "0.5"], a: 2 },
              // 8. Stoichiometry
              { stem: "How many atoms of oxygen are in a 68 g sample of H₂O₂? (Molar mass H₂O₂ = 34 g/mol; Avogadro's # ≈ 6.0 x 10²³)", c: ["6.0 x 10²³", "1.2 x 10²⁴", "1.8 x 10²⁴", "2.4 x 10²⁴"], a: 3 },
              // 9. Lab
              { stem: "Which of the following numbers possesses the *most* significant digits?", c: ["10.20", "0.000761", "1,000.0", "812.0", "0.905"], a: 2 },
              // 10. Nuclear Reactions
              { stem: "What is the decay constant (k) of a first-order reaction with a half-life of 5 minutes?", c: ["k = 0.693 / 5", "k = 5 / 0.693", "k = 0.693 / 300", "k = 300 / 0.693"], a: 2 },
              // 11. Liquids/Solids
              { stem: "What is the approximate osmotic pressure (Π) of a 1.5 M sucrose solution at 300 K? (R = 0.0821 L·atm/mol·K)", c: ["3.7 atm", "5.5 atm", "37 atm", "71 atm"], a: 2 },
              // 12. Periodic Trends
              { stem: "Which of the following elements is a metalloid?", c: ["Aluminum", "Titanium", "Antimony", "Tin"], a: 2 },
              // 13. Atomic Structure
              { stem: "Which of the following molecules has the shortest N-O bond length?", c: ["NO₃⁻", "NO₂⁻", "NO⁺", "H₂NOH"], a: 2 },
              // 14. Gases
              { stem: "A sample of an ideal gas at 25°C and 1.0 atm has a volume of 1.2 L. What will be the volume of the same sample at 0.5 atm and 25°C?", c: ["0.60 L", "1.2 L", "2.4 L", "4.8 L"], a: 2 },
              // 15. Electrochemistry
              { stem: "Given the following redox reaction, which of the following is the oxidizing agent? Cd + NiO₂ + 2H₂O → Cd(OH)₂ + Ni(OH)₂", c: ["Cd", "NiO₂", "H₂O", "Cd(OH)₂"], a: 1 },
              // 16. Thermochemistry
              { stem: "Which of the following enthalpy changes is correctly arranged from highest to lowest?", c: ["ΔH_vap > ΔH_sub > ΔH_fus", "ΔH_sub > ΔH_vap > ΔH_fus", "ΔH_fus > ΔH_vap > ΔH_sub", "ΔH_sub > ΔH_fus > ΔH_vap"], a: 1 },
              // 17. Kinetics
              { stem: "25% of a reactant remains during the process of a 1st order reaction in 20 minutes. What is the rate constant (k)?", c: ["k = -ln(0.25) / 20", "k = -ln(0.75) / 20", "k = ln(20) / 0.25", "k = -ln(0.25) * 20"], a: 0 },
              // 18. Equilibrium
              { stem: "For the reaction 2 NaCl(aq) + SF₂(g) ⇌ 2 NaF(s) + SCl₂(l), which of the following changes shifts the equilibrium to the right?", c: ["Adding H₂O(l)", "Adding a catalyst", "Increasing the pressure", "Removing NaCl(aq)"], a: 2 },
              // 19. Stoichiometry
              { stem: "In the combustion reaction of methane (CH₄ + 2O₂ → CO₂ + 2H₂O), how many moles of O₂ are required to produce 2 moles of H₂O?", c: ["1", "2", "3", "4"], a: 1 },
              // 20. Lab
              { stem: "What sequence of steps can be taken to separate a mixture of Substance 1 (Insoluble in cold water, Soluble in hot) and Substance 2 (Soluble in cold water, Soluble in hot)?", c: ["Add cold water, then filter", "Add hot water, then filter", "Add cold water, then add hot water", "Add hot water, then filter, then add cold water"], a: 0 },
              // 21. Nuclear Reactions
              { stem: "Sodium-21 has a binding energy of 7.77 MeV and sodium-23 has a binding energy of 8.11 MeV. Which statement is true about these two isotopes?", c: ["Sodium-21 is more stable.", "Sodium-21 has a greater mass defect.", "Sodium-23 has a greater mass defect.", "Both have the same mass defect."], a: 2 },
              // 22. Liquids/Solids
              { stem: "Which of the following compounds has the highest boiling point?", c: ["CCl₄", "HCl", "H₂O", "CH₃CH₂CH₂", "CH₄"], a: 2 },
              // 23. Periodic Trends
              { stem: "Which of the following best explains the phenomenon that chlorine has a greater first ionization energy than sulfur?", c: ["Larger atomic radius", "Weaker electrostatic interactions", "Lower electronegativity", "Higher effective nuclear charge"], a: 3 },
              // 24. Atomic Structure
              { stem: "Which of the following electron configurations obeys Hund's Rule?", c: ["1s(↑↓) 2s(↑↓) 2p(↑↓ ↑_ __)", "1s(↑↓) 2s(↑↓) 2p(↑ ↑ ↑)", "1s(↑↓) 2s(↑↓) 2p(↑↓ ↑↓ __)", "1s(↑↓) 2s(↑↓) 2p(↑ ↑↓ ↑)"], a: 1 },
              // 25. Gases
              { stem: "A 5 g block of dry ice (CO₂, 44 g/mol) is placed in an empty 4.00 L sealed container at 27°C (300K). What is the correct setup for the pressure in kPa? (R = 8.314 L·kPa/mol·K)", c: ["P = (5/44)(8.314)(27) / 4", "P = (44/5)(8.314)(300) / 4", "P = (5/44)(8.314)(300) / 4", "P = (5/44)(0.0821)(300) / 4"], a: 2 },
              // 26. Electrochemistry
              { stem: "What is the E°cell for a voltaic cell composed of the half-cells shown? (Br₂ + 2e⁻ → 2Br⁻, E°=+1.09 V) and (Ag⁺ + e⁻ → Ag, E°=+0.80 V)", c: ["-0.29 V", "+0.29 V", "+1.89 V", "-1.89 V"], a: 1 },
              // 27. Thermochemistry
              { stem: "A 200g sample of mercury at 25°C is heated to 75°C with the addition of 3kJ of energy. What is the correct setup to calculate the specific heat (c) in J/g°C?", c: ["c = (3000) / (200)(50)", "c = (3000) / (200)(75)", "c = (3) / (200)(50)", "c = (200)(50) / (3000)"], a: 0 },
              // 28. Kinetics
              { stem: "For a first-order reaction, the half-life is:", c: ["dependent on the initial concentration.", "constant and independent of concentration.", "proportional to the square of the concentration.", "linearly related to time."], a: 1 },
              // 29. Equilibrium
              { stem: "For an exothermic reaction (ΔH < 0), what happens to the value of the equilibrium constant (K_eq) if the temperature is increased?", c: ["K_eq increases", "K_eq decreases", "K_eq stays the same", "K_eq becomes 0"], a: 1 },
              // 30. Stoichiometry
              { stem: "A cube with side lengths of 2 cm was filled with 5 moles of oxygen gas (O₂). What is the resulting density? (Molar mass O₂ = 32 g/mol)", c: ["1.3 g/mL", "10 g/mL", "20 g/mL", "40 g/mL"], a: 2 }
        ],
        // Test 4
        [
              { stem: "Which type of glassware sits below the burette in an acid-base titration?", c: ["Beaker", "Volumetric flask", "Graduated cylinder", "Erlenmeyer flask"], a: 3 },
              { stem: "A student performs an experimental reaction and recovers 15 g of product. Based on the amount of reactant used, it was estimated that 20 g of product should have been obtained. What is the percent yield of the reaction?", c: ["(15⁄20)", "(20⁄15)", "(20-15)⁄20", "(15-20)⁄20"], a: 0 },
              { stem: "A single gram of a compound has 0.5 moles. What is the molar mass of the compound?", c: ["0.5 g/mol", "1.0 g/mol", "2.0 g/mol", "4.0 g/mol"], a: 2 },
              { stem: "What is the empirical formula of a molecule with 7 g of nitrogen and 16 g of oxygen? (Molar masses: N=14 g/mol, O=16 g/mol)", c: ["NO", "N₂O", "NO₂", "N₂O₄"], a: 2 },
              { stem: "Which element has the smallest first ionization energy?", c: ["N", "C", "B", "Be", "Li"], a: 4 },
              { stem: "Which one of the following properties applies to alkaline earth metals?", c: ["Form 2⁺ cations", "Have 7 valence electrons", "Are generally gases at room temp", "Form acidic oxides"], a: 0 },
              { stem: "Which of the following molecules possesses a non-zero dipole moment?", c: ["BF₃", "Si(CH₃)₄", "CO₂", "NH₃"], a: 3 },
              { stem: "What is the bond angle that exists within a molecule of SO₃?", c: ["90°", "104.5°", "109.5°", "120°"], a: 3 },
              { stem: "Which of the following is the correct electron configuration for the bromide ion, Br⁻?", c: ["[Ar] 4s²4p⁶", "[Ar] 4s²3d¹⁰4p⁵", "[Kr]", "[Ar] 4s²3d¹⁰4p⁶"], a: 3 },
              { stem: "If you halve the pressure of a gas at constant temperature, what happens to the volume?", c: ["Volume will be halved", "Volume will double", "Volume will be reduced to a fourth", "Volume does not change"], a: 1 },
              { stem: "Under which condition do real gases behave *least* ideally?", c: ["High temperature and high pressure", "High temperature and low pressure", "Low temperature and high pressure", "Low temperature and low pressure"], a: 2 },
              { stem: "If Compound 1 has 1⁄9 the molar mass of Compound 2, how many times faster is the rate of effusion for Compound 1 compared to Compound 2?", c: ["1⁄9", "1⁄3", "3", "9"], a: 2 },
              { stem: "The point above which a gas cannot be converted into a liquid, regardless of the pressure, is known as what?", c: ["Triple point", "Critical point", "Boiling point", "Equivalence point"], a: 1 },
              { stem: "75 g of MgCl₂ (molar mass ≈ 95 g/mol) is dissolved in 150 g of water. What is the approximate molality of this solution?", c: ["2.5 m", "3.3 m", "5.3 m", "0.5 m"], a: 2 },
              { stem: "When a non-volatile solute like salt is added to pure water, which of the following changes occurs?", c: ["The boiling point decreases", "The vapor pressure increases", "The freezing point decreases", "The viscosity is unchanged"], a: 2 },
              { stem: "The activation energy of a reaction can be decreased by:", c: ["Increasing the pressure", "Adding more reactant", "Increasing the temperature", "Adding a catalyst"], a: 3 },
              { stem: "Which of the following is true regarding a reaction intermediate?", c: ["It is consumed in a later step of the reaction.", "It speeds up the reaction.", "It appears in the final balanced reaction.", "It is a low-energy, stable species."], a: 0 },
              { stem: "Given a first-order reaction, what would be the ratio of the final concentration to its initial concentration after two half-lives?", c: ["0.5", "0.25", "0.125", "0.0"], a: 1 },
              { stem: "Which of the following phase transitions is an exothermic process?", c: ["Solid to liquid (melting)", "Liquid to gas (vaporization)", "Solid to gas (sublimation)", "Liquid to solid (freezing)"], a: 3 },
              { stem: "Which of the following is a state function?", c: ["Enthalpy", "Work", "Heat", "Power"], a: 0 },
              { stem: "A reaction has reactants at a potential energy of 50 kJ. The transition state is at 250 kJ. The products are at 100 kJ. What is the activation energy (Ea) for the forward reaction?", c: ["50 kJ", "150 kJ", "200 kJ", "250 kJ"], a: 2 },
              { stem: "For the endothermic reaction: 2 H₂O(g) + heat ⇌ 2 H₂(g) + O₂(g). Which of the following changes shifts the equilibrium to the right?", c: ["Decreasing temperature", "Adding a catalyst", "Removing H₂O(g)", "Decreasing pressure"], a: 3 },
              { stem: "For the exothermic reaction: 2 H₂(g) + O₂(g) ⇌ 2 H₂O(g) + heat. Which of the following changes shifts the equilibrium to the left?", c: ["Decreasing temperature", "Adding H₂(g)", "Increasing temperature", "Increasing pressure"], a: 2 },
              { stem: "What is the correct solubility product constant (Ksp) expression for magnesium hydroxide, Mg(OH)₂?", c: ["Ksp = [Mg²⁺][OH⁻]", "Ksp = [Mg²⁺][2OH⁻]", "Ksp = [Mg²⁺][OH⁻]²", "Ksp = [Mg²⁺][2OH⁻]²"], a: 2 },
              { stem: "Which of the following is a redox reaction?", c: ["NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l)", "2 Na(s) + Cl₂(g) → 2 NaCl(s)", "AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)", "AlCl₃(aq) + 3 H₂O(l) → Al(OH)₃(s) + 3 HCl(aq)"], a: 1 },
              { stem: "A reducing agent is a species that:", c: ["gains electrons from another species.", "oxidizes another species.", "becomes reduced during a reaction.", "loses electrons to another species."], a: 3 },
              { stem: "Given the reaction: 2Al₂O₃ + 3C → 4Al + 3CO₂. Which of the following statements is true?", c: ["Carbon is oxidized, aluminum is reduced.", "Carbon is reduced, aluminum is oxidized.", "Both are oxidized.", "Neither element changes oxidation state."], a: 0 },
              { stem: "The alpha decay of iridium-168 (¹⁶⁸Ir). What is the resulting daughter nucleus?", c: ["¹⁶⁴Dy", "¹⁶⁸Os", "¹⁶⁸Ir", "¹⁷²W"], a: 0 },
              { stem: "Which of the following particles has the greatest penetrating power?", c: ["Alpha particles", "Beta particles", "Gamma rays", "Neutrons"], a: 2 },
              { stem: "A radioactive sample has a half-life of 8 days. If you start with 64 grams, how much will remain after 24 days?", c: ["32 g", "16 g", "8 g", "4 g"], a: 2 }
        ],
        // Test 4
        [
            // 1. Atomic Structure
              { stem: "Which of the following elements exists as a diatomic gas in its standard state and contains a double covalent bond?", c: ["Krypton", "Oxygen", "Nitrogen", "Chlorine"], a: 1 },
              // 2. Thermochemistry
              { stem: "An endothermic reaction is accompanied by an increase in entropy. Under what condition is this reaction spontaneous?", c: ["Spontaneous at all temperatures", "Spontaneous at high temperatures", "Spontaneous at low temperatures", "Non-spontaneous at all temperatures"], a: 1 },
              // 3. Lab
              { stem: "Which of the following tools is correctly matched with its description?", c: ["Graduated cylinder – transfer of precise amounts", "Beaker – mix solutions", "Electronic balance – measure changes in heat", "Buret – vacuum filtration"], a: 1 },
              // 4. Kinetics
              { stem: "Which of the following best describes the function of a catalyst?", c: ["Shifts equilibrium towards the products", "Provides more energy to a reaction", "Decreases the rate constant", "Provides a more efficient reaction pathway"], a: 3 },
              // 5. Stoichiometry
              { stem: "How many moles of oxygen are formed during the decomposition of 4 moles of nitric oxide (NO)? (Reaction: 2 NO₂(g) → 2 NO(g) + O₂(g))", c: ["0.5 mol", "1 mol", "2 mol", "4 mol"], a: 2 },
              // 6. Equilibrium
              { stem: "Consider the reaction: A(g) ⇌ 2 B(g). At equilibrium, [A] = 3 M and [B] = 2 M. What is the value of the equilibrium constant (K)?", c: ["0.2", "1.3", "3.0", "4.5"], a: 1 },
              // 7. Periodic Trends
              { stem: "Which of the following elements has the lowest atomic radius?", c: ["Na", "Li", "Be", "B"], a: 3 },
              // 8. Nuclear Reactions
              { stem: "Which of the following best represents 'X' in the decay process shown below? ²³⁰₉₀Th → ⁰₋₁β + X", c: ["²³⁰₉₁Pa", "²³⁰₈₉Ac", "²²⁶₈₈Ra", "²³⁰₉₀Th"], a: 0 },
              // 9. Gases
              { stem: "A gas is contained at 2.5 atm. If the volume and temperature are both doubled, what is the new pressure?", c: ["1.25 atm", "2.5 atm", "5 atm", "10 atm"], a: 1 },
              // 10. Electrochemistry
              { stem: "Which of the following statements is true regarding a galvanic cell based on these potentials? (Ag⁺ + e⁻ → Ag, E°=+0.80 V) and (Tl⁺ + e⁻ → Tl, E°=-0.34 V)", c: ["Ag⁺ is oxidized", "Tl is oxidized", "Ag is oxidized", "Tl⁺ is reduced"], a: 1 },
              // 11. Liquids/Solids
              { stem: "What is the correct setup for the osmotic pressure (Π) of a 0.20 M solution of Na₃PO₄ at 30°C (303 K)? (R = 0.0821 L·atm/mol·K)", c: ["Π = (0.2)(0.0821)(303)", "Π = (2)(0.2)(0.0821)(303)", "Π = (3)(0.2)(0.0821)(303)", "Π = (4)(0.2)(0.0821)(303)"], a: 3 },
              // 12. Atomic Structure
              { stem: "How many equivalent resonance structures can be drawn for the carbonate ion, CO₃²⁻?", c: ["1", "2", "3", "4"], a: 2 },
              // 13. Thermochemistry
              { stem: "Which of the following statements is true regarding entropy?", c: ["The entropy of a system will increase as temperature increases.", "Spontaneous reactions require an increase in entropy.", "The entropy of a system increases as pressure increases.", "The entropy of a system decreases as volume increases."], a: 0 },
              // 14. Lab
              { stem: "Which of the following would cause a random error?", c: ["pH meter calibrated incorrectly", "Reading the meniscus at a different angle each time", "Spilling the product", "Electronic balance tarred incorrectly"], a: 1 },
              // 15. Kinetics
              { stem: "The decomposition of A into B and C is monitored, and a graph of ln[A] vs. time (s) is linear with the equation y = -0.0072x + 0.035. What is the rate constant (k)?", c: ["0.0072 s⁻¹", "0.0072 M⁻¹s⁻¹", "0.035 s⁻¹", "0.035 M⁻¹s⁻¹"], a: 0 },
              // 16. Stoichiometry
              { stem: "A 5 g block of dry ice (CO₂) is placed in an empty 4.00 L sealed container at a temperature of 27°C. What is the pressure in kPa? (R = 8.314 L·kPa·K⁻¹·mol⁻¹)", c: ["(5/44)(8.314)(300) / (4)", "(44/5)(8.314)(300) / (4)", "(5/44)(8.314)(27) / (4)", "(5/44)(0.0821)(300) / (4)"], a: 0 },
              // 17. Equilibrium
              { stem: "Which of the following indicates that a reaction is at equilibrium?", c: ["ΔG = 0", "ΔH = 0", "ΔS = 0", "[Reactants] = [Products]"], a: 0 },
              // 18. Periodic Trends
              { stem: "Which of the following elements has the lowest electron affinity?", c: ["Li", "B", "O", "F", "Ne"], a: 4 },
              // 19. Nuclear Reactions
              { stem: "After 220 million years, how much of a 100-gram sample of Uranium-235 would remain, assuming a half-life of 700 million years?", c: ["100 * (1/2)^(220/700)", "100 * (1/2)^(700/220)", "100 * (1/2) * (220/700)", "100 * (1/2) * (700/220)"], a: 0 },
              // 20. Gases
              { stem: "If the temperature of an ideal gas is quadrupled under isovolumetric (constant volume) conditions, what will occur to the pressure?", c: ["2x the original pressure", "1/2 of the original pressure", "1/4 of the original pressure", "4x the original pressure"], a: 3 },
              // 21. Electrochemistry
              { stem: "In the process of electroplating a silver object with gold, which reaction must occur at the cathode?", c: ["Ag⁺ + e⁻ → Ag", "Ag → Ag⁺ + e⁻", "Au³⁺ + 3e⁻ → Au", "Au → Au³⁺ + 3e⁻"], a: 2 },
              // 22. Liquids/Solids
              { stem: "Which physical property is described when the vapor pressure of a liquid equals the atmospheric pressure?", c: ["Melting point", "Triple point", "Critical point", "Boiling point"], a: 3 },
              // 23. Atomic Structure
              { stem: "Which of the following is the correct ground-state electron configuration for Mg²⁺?", c: ["1s²2s²2p⁴3s²", "[Ne] 3s²3p²", "1s²2s²2p⁶3s²", "1s²2s²2p⁶"], a: 3 },
              // 24. Thermochemistry
              { stem: "Which of the following must be true for a chemical reaction that has the same activation energy for the forward and reverse directions?", c: ["Enthalpy (ΔH) is zero", "Entropy (ΔS) is zero", "The reaction is endothermic", "The reaction is exothermic"], a: 0 },
              // 25. Lab
              { stem: "Which of the following values is needed to determine molar absorbance using the Beer-Lambert Law (A = εlc)?", c: ["Tolerance", "Molar Concentration", "Density", "Temperature"], a: 1 },
              // 26. Kinetics
              { stem: "Based on the graph of 1/[A] vs. time (t) which shows a straight line with a positive slope, which of the following is true?", c: ["This reaction is first-order", "The rate law for this reaction is rate = k[A]²", "The half-life of this reaction is constant", "There is a linear relationship between [A] and time"], a: 1 },
              // 27. Stoichiometry
              { stem: "A cube with side lengths of 2 cm was filled with 5 moles of oxygen gas. Which of the following would be the resulting density? (Molar mass O₂ = 32 g/mol)", c: ["0.1 g/mL", "10 g/mL", "20 g/mL", "40 g/mL"], a: 2 },
              // 28. Equilibrium
              { stem: "Which of the following statements indicates that a reaction is at equilibrium?", c: ["ΔH = 0", "ΔS = 0", "Q = K", "The forward rate is 0"], a: 2 },
              // 29. Periodic Trends
              { stem: "Which of the following correctly ranks the atomic radii in decreasing order?", c: ["K > Rb > Na", "Br > I > Cl", "Cl > Na > Mg", "K > Ca > Sc"], a: 3 },
              // 30. Nuclear Reactions
              { stem: "If 25% of a compound remains after 90 days, what is the half-life of the compound?", c: ["22.5 days", "45 days", "90 days", "180 days"], a: 1 }
        ],
        // Test 6
        [
            // 1. Lab
              { stem: "Which of the following would cause a *systematic* error?", c: ["Reading the meniscus at a different angle each time", "An uncalibrated electronic balance that always reads 0.5g high", "A one-time event like spilling product", "Miscalculating a single value"], a: 1 },
              // 2. Thermochemistry
              { stem: "Which of the following phase transitions *absorbs* heat (is endothermic)?", c: ["Condensation (gas to liquid)", "Freezing (liquid to solid)", "Deposition (gas to solid)", "Vaporization (liquid to gas)"], a: 3 },
              // 3. Atomic Structure
              { stem: "What is the geometry and bonding angle of a CH₃Cl molecule?", c: ["Bent, 120°", "Trigonal planar, 120°", "Tetrahedral, 109.5°", "Trigonal pyramidal, 107.8°"], a: 2 },
              // 4. Periodic Trends
              { stem: "Which of the following elements has the *highest* electron affinity (most exothermic)?", c: ["Na", "Al", "S", "Cl", "Ar"], a: 3 },
              // 5. Gases
              { stem: "A container with 1 mol of H₂ and 3 mol of He has a total pressure of 200 kPa. What is the partial pressure of H₂?", c: ["25 kPa", "50 kPa", "100 kPa", "150 kPa"], a: 1 },
              // 6. Stoichiometry
              { stem: "A molecule has a molar mass of 90 g/mol and an empirical formula of CH₂O (mass ≈ 30 g/mol). What is the molecular formula?", c: ["C₂H₄O₂", "C₃H₆O₃", "C₆H₁₂O₆", "CH₂O"], a: 1 },
              // 7. Equilibrium
              { stem: "For the reaction 2 H₂(g) + O₂(g) ⇌ 2 H₂O(g) + heat. Which change would shift the equilibrium to the *right* (favor products)?", c: ["Increasing the temperature", "Adding a catalyst", "Decreasing the pressure", "Decreasing the temperature"], a: 3 },
              // 8. Liquids/Solids
              { stem: "What is the molality (m) of a solution made by dissolving 10 g of NaOH (40 g/mol) in 500 g of water?", c: ["0.25 m", "0.5 m", "1.0 m", "2.0 m"], a: 1 },
              // 9. Kinetics
              { stem: "A reaction's rate is found to be independent of the concentration of reactant A. What is the reaction order with respect to A?", c: ["Zero-order", "First-order", "Second-order", "Cannot be determined"], a: 0 },
              // 10. Nuclear Reactions
              { stem: "A 32 g sample of an isotope remains after 5 weeks. The isotope's half-life is 7 days. What was the *original* mass?", c: ["1 g", "160 g", "640 g", "1024 g"], a: 3 },
              // 11. Electrochemistry
              { stem: "What is the oxidation number of chlorine in HClO₄?", c: ["+1", "+3", "+5", "+7"], a: 3 },
              // 12. Lab
              { stem: "A 1.00 M standard solution is measured three times: 0.81 M, 0.80 M, and 0.82 M. These measurements are:", c: ["Accurate but not precise", "Precise but not accurate", "Both accurate and precise", "Neither accurate nor precise"], a: 1 },
              // 13. Atomic Structure
              { stem: "Which of the following molecules is *nonpolar*?", c: ["H₂O", "NH₃", "CH₃Cl", "CCl₄"], a: 3 },
              // 14. Periodic Trends
              { stem: "Which of the following statements best explains why sodium (Na) is more reactive than magnesium (Mg)?", c: ["Sodium has a lower atomic radius", "Sodium has a lower first ionization energy", "Sodium is a non-metal", "Sodium has a higher electronegativity"], a: 1 },
              // 15. Gases
              { stem: "A 2 L container has a pressure of 5.0 atm. If the volume is expanded to 10 L at constant temperature, what is the new pressure?", c: ["1.0 atm", "2.0 atm", "5.0 atm", "25.0 atm"], a: 0 },
              // 16. Stoichiometry
              { stem: "During the decomposition of 2 moles of nitrogen dioxide (NO₂), 2 moles of nitric oxide (NO) are produced. How many moles of oxygen (O₂) are formed? (Reaction: 2 NO₂(g) → 2 NO(g) + O₂(g))", c: ["0.5 mol", "1 mol", "2 mol", "4 mol"], a: 1 },
              // 17. Thermochemistry
              { stem: "A chemical reaction that has a positive ΔH and a positive ΔS will be:", c: ["Spontaneous at all temperatures", "Non-spontaneous at all temperatures", "Spontaneous only at high temperatures", "Spontaneous only at low temperatures"], a: 2 },
              // 18. Liquids/Solids
              { stem: "Which of the following compounds would have the *highest* boiling point due to its intermolecular forces?", c: ["CH₄ (London)", "CH₃F (Dipole-dipole)", "CH₃OH (Hydrogen bonding)", "Ne (London)"], a: 2 },
              // 19. Kinetics
              { stem: "What is the overall reaction order for the rate law: rate = k[A]¹[B]²?", c: ["1", "2", "3", "4"], a: 2 },
              // 20. Electrochemistry
              { stem: "In an electrolytic cell, which of the following is true?", c: ["The reaction is spontaneous (E° > 0)", "The anode is positive and the cathode is negative", "Reduction occurs at the anode", "Electrons flow from cathode to anode"], a: 1 },
              // 21. Nuclear Reactions
              { stem: "What is the missing particle 'X' in the reaction: ¹⁴₆C → ¹⁴₇N + X?", c: ["Alpha particle (⁴₂He)", "Positron (⁰₊₁e)", "Electron (⁰₋₁e)", "Gamma ray (γ)"], a: 2 },
              // 22. Equilibrium
              { stem: "What is the equilibrium constant expression (K_c) for the reaction: 2 C₂H₆(g) + 7 O₂(g) ⇌ 4 CO₂(g) + 6 H₂O(l)?", c: ["[CO₂]⁴ / ([C₂H₆]²[O₂]⁷)", "[CO₂]⁴[H₂O]⁶ / ([C₂H₆]²[O₂]⁷)", "([C₂H₆]²[O₂]⁷) / [CO₂]⁴", "[CO₂]⁴ / [C₂H₆]²"], a: 0 },
              // 23. Atomic Structure
              { stem: "How many electrons can be held in the d-subshell?", c: ["2", "6", "10", "14"], a: 2 },
              // 24. Periodic Trends
              { stem: "Which of the following elements is an Actinide?", c: ["Lithium (Li)", "Scandium (Sc)", "Lanthanum (La)", "Uranium (U)"], a: 3 },
              // 25. Gases
              { stem: "A 10-mole sample of an ideal gas is at 25°C and 1.0 atm. If the temperature is changed to 50°C at constant pressure, what happens to the volume?", c: ["It is halved", "It is doubled", "It increases slightly", "It decreases slightly"], a: 2 },
              // 26. Thermochemistry
              { stem: "Given the bond enthalpies (Br-Br: 250, C-H: 400, C-Br: 300, H-Br: 450 kJ/mol), calculate ΔH_rxn for: CH₄ + Br₂ → CH₃Br + HBr.", c: ["-100 kJ/mol", "+100 kJ/mol", "-200 kJ/mol", "+200 kJ/mol"], a: 0 },
              // 27. Liquids/Solids
              { stem: "A solution is prepared by dissolving 0.92 g of toluene in 100 g of benzene. The freezing point is lowered by 0.50°C. What is the estimated molar mass of toluene? (Kf benzene = 5.0 °C·kg/mol; i=1)", c: ["78 g/mol", "85 g/mol", "92 g/mol", "100 g/mol"], a: 2 },
              // 28. Lab
              { stem: "What is the percentage of nitrogen by mass in C₅H₁₄N₂? (Molar masses: C=12, H=1, N=14)", c: ["13.7%", "27.4%", "58.8%", "1.9%"], a: 1 },
              // 29. Kinetics
              { stem: "A 40 g sample of a compound decomposes via first-order kinetics with a half-life of 2 hours. How much will be left after 6 hours?", c: ["20 g", "10 g", "5 g", "2.5 g"], a: 2 },
              // 30. Electrochemistry
              { stem: "In the reaction Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), which element is oxidized?", c: ["Zn", "Cu²⁺", "Zn²⁺", "Cu"], a: 0 }
        ],
        // Test 6
        [
            // 1. Lab
              { stem: "Which of the following would cause a *systematic* error?", c: ["Reading the meniscus at a different angle each time", "An uncalibrated electronic balance that always reads 0.5g high", "Spilling product", "Miscalculating a single value"], a: 1 },
              // 2. Thermochemistry
              { stem: "Which of the following phase transitions *absorbs* heat (is endothermic)?", c: ["Condensation (gas to liquid)", "Freezing (liquid to solid)", "Deposition (gas to solid)", "Vaporization (liquid to gas)"], a: 3 },
              // 3. Atomic Structure
              { stem: "What is the geometry and bonding angle of a CH₃Cl molecule?", c: ["Bent, 120°", "Trigonal planar, 120°", "Tetrahedral, 109.5°", "Trigonal pyramidal, 107.8°"], a: 2 },
              // 4. Periodic Trends
              { stem: "Which of the following elements has the *highest* electron affinity (most exothermic)?", c: ["Na", "Al", "S", "Cl", "Ar"], a: 3 },
              // 5. Gases
              { stem: "A gas is contained at 2.5 atm. If the volume is halved and the temperature is doubled, what is the new pressure?", c: ["1.25 atm", "2.5 atm", "5 atm", "10 atm"], a: 1 },
              // 6. Stoichiometry
              { stem: "A molecule has a molar mass of 90 g/mol and an empirical formula of CH₂O (mass ≈ 30 g/mol). What is the molecular formula?", c: ["C₂H₄O₂", "C₃H₆O₃", "C₆H₁₂O₆", "CH₂O"], a: 1 },
              // 7. Equilibrium
              { stem: "For the reaction 2 H₂(g) + O₂(g) ⇌ 2 H₂O(g) + heat. Which change would shift the equilibrium to the *right* (favor products)?", c: ["Increasing the temperature", "Adding a catalyst", "Decreasing the pressure", "Decreasing the temperature"], a: 3 },
              // 8. Liquids/Solids
              { stem: "What is the molality (m) of a solution made by dissolving 10 g of NaOH (40 g/mol) in 500 g of water?", c: ["0.25 m", "0.5 m", "1.0 m", "2.0 m"], a: 1 },
              // 9. Kinetics
              { stem: "A reaction's rate is found to be independent of the concentration of reactant A. What is the reaction order with respect to A?", c: ["Zero-order", "First-order", "Second-order", "Cannot be determined"], a: 0 },
              // 10. Nuclear Reactions
              { stem: "A 32 g sample of an isotope remains after 5 weeks. The isotope's half-life is 7 days. What was the *original* mass?", c: ["1 g", "160 g", "640 g", "1024 g"], a: 3 },
              // 11. Electrochemistry
              { stem: "What is the oxidation number of chlorine in HClO₄?", c: ["+1", "+3", "+5", "+7"], a: 3 },
              // 12. Lab
              { stem: "A 1.00 M standard solution is measured three times: 0.81 M, 0.80 M, and 0.82 M. These measurements are:", c: ["Accurate but not precise", "Precise but not accurate", "Both accurate and precise", "Neither accurate nor precise"], a: 1 },
              // 13. Atomic Structure
              { stem: "Which of the following molecules is *nonpolar*?", c: ["H₂O", "NH₃", "CH₃Cl", "CCl₄"], a: 3 },
              // 14. Periodic Trends
              { stem: "Which of the following statements best explains why sodium (Na) is more reactive than magnesium (Mg)?", c: ["Sodium has a lower atomic radius", "Sodium has a lower first ionization energy", "Sodium is a non-metal", "Sodium has a higher electronegativity"], a: 1 },
              // 15. Gases
              { stem: "A 2 L container has a pressure of 5.0 atm. If the volume is expanded to 10 L at constant temperature, what is the new pressure?", c: ["1.0 atm", "2.0 atm", "5.0 atm", "25.0 atm"], a: 0 },
              // 16. Stoichiometry
              { stem: "During the decomposition of 2 moles of nitrogen dioxide (NO₂), 2 moles of nitric oxide (NO) are produced. How many moles of oxygen (O₂) are formed? (Reaction: 2 NO₂(g) → 2 NO(g) + O₂(g))", c: ["0.5 mol", "1 mol", "2 mol", "4 mol"], a: 1 },
              // 17. Thermochemistry
              { stem: "A chemical reaction that has a positive ΔH and a positive ΔS will be:", c: ["Spontaneous at all temperatures", "Non-spontaneous at all temperatures", "Spontaneous only at high temperatures", "Spontaneous only at low temperatures"], a: 2 },
              // 18. Liquids/Solids
              { stem: "Which of the following compounds would have the *highest* boiling point due to its intermolecular forces?", c: ["CH₄ (London)", "CH₃F (Dipole-dipole)", "CH₃OH (Hydrogen bonding)", "Ne (London)"], a: 2 },
              // 19. Kinetics
              { stem: "What is the overall reaction order for the rate law: rate = k[X]¹[Y]²?", c: ["1", "2", "3", "4"], a: 2 },
              // 20. Electrochemistry
              { stem: "In an electrolytic cell, which of the following is true?", c: ["The reaction is spontaneous (E° > 0)", "The anode is positive and the cathode is negative", "Reduction occurs at the anode", "Electrons flow from cathode to anode"], a: 1 },
              // 21. Nuclear Reactions
              { stem: "What is the missing particle 'X' in the reaction: ¹⁴₆C → ¹⁴₇N + X?", c: ["Alpha particle (⁴₂He)", "Positron (⁰₊₁e)", "Electron (⁰₋₁e)", "Gamma ray (γ)"], a: 2 },
              // 22. Equilibrium
              { stem: "What is the equilibrium constant expression (K_c) for the reaction: 2 C₂H₆(g) + 7 O₂(g) ⇌ 4 CO₂(g) + 6 H₂O(l)?", c: ["[CO₂]⁴ / ([C₂H₆]²[O₂]⁷)", "[CO₂]⁴[H₂O]⁶ / ([C₂H₆]²[O₂]⁷)", "([C₂H₆]²[O₂]⁷) / [CO₂]⁴", "[CO₂]⁴ / [C₂H₆]²"], a: 0 },
              // 23. Atomic Structure
              { stem: "How many orbitals are in a 4d subshell?", c: ["5", "7", "9", "10"], a: 0 },
              // 24. Periodic Trends
              { stem: "Which of the following elements is an Actinide?", c: ["Lithium (Li)", "Scandium (Sc)", "Lanthanum (La)", "Uranium (U)"], a: 3 },
              // 25. Gases
              { stem: "If the temperature of an ideal gas is quadrupled under isovolumetric (constant volume) conditions, what will occur to the pressure?", c: ["2x the original pressure", "1/2 of the original pressure", "1/4 of the original pressure", "4x the original pressure"], a: 3 },
              // 26. Thermochemistry
              { stem: "Given the bond enthalpies (Br-Br: 250, C-H: 400, C-Br: 300, H-Br: 450 kJ/mol), calculate ΔH_rxn for: CH₄ + Br₂ → CH₃Br + HBr.", c: ["-100 kJ/mol", "+100 kJ/mol", "-200 kJ/mol", "+200 kJ/mol"], a: 0 },
              // 27. Liquids/Solids
              { stem: "A solution is prepared by dissolving 0.92 g of toluene in 100 g of benzene. The freezing point is lowered by 0.50°C. What is the estimated molar mass of toluene? (Kf benzene = 5.0 °C·kg/mol; i=1)", c: ["78 g/mol", "85 g/mol", "92 g/mol", "100 g/mol"], a: 2 },
              // 28. Lab
              { stem: "What is the percentage of nitrogen by mass in C₅H₁₄N₂? (Molar masses: C=12, H=1, N=14)", c: ["13.7%", "27.4%", "58.8%", "1.9%"], a: 1 },
              // 29. Kinetics
              { stem: "A 40 g sample of a compound decomposes via first-order kinetics with a half-life of 2 hours. How much will be left after 6 hours?", c: ["20 g", "10 g", "5 g", "2.5 g"], a: 2 },
              // 30. Electrochemistry
              { stem: "In the reaction Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), which element is oxidized?", c: ["Zn", "Cu²⁺", "Zn²⁺", "Cu"], a: 0 }
        ],
        // Test 9
        [
            // 1. Stoichiometry
              { stem: "According to the following reaction, how many grams of CO₂ (44 g/mol) are produced when 32 grams of O₂ (32 g/mol) reacts with excess ethane? (Reaction: 2 C₂H₆(g) + 7 O₂(g) → 4 CO₂(g) + 6 H₂O(l))", c: ["(4)(44) / 7", "(1)(7) / (4)(44)", "(1)(44) / 7", "(1)(4)(44) / 7"], a: 3 },
              // 2. Liquids/Solids
              { stem: "Compared to pure water, an aqueous solution of glucose would have which of the following changes in properties?", c: ["BP increases, VP increases, MP decreases", "BP decreases, VP decreases, MP increases", "BP increases, VP decreases, MP decreases", "BP decreases, VP increases, MP increases"], a: 2 },
              // 3. Periodic Trends
              { stem: "Which of the following elements has the *largest* atomic radius?", c: ["O", "S", "Se", "Te", "Po"], a: 4 },
              // 4. Atomic Structure
              { stem: "What is the correct molecular geometry of PCl₅?", c: ["Bent", "Trigonal planar", "Tetrahedral", "Trigonal bipyramidal", "Octahedral"], a: 3 },
              // 5. Lab
              { stem: "Which of the following would cause a random error in an experiment?", c: ["Using an uncalibrated pH meter", "Forgetting to tar the balance", "Fluctuations in room temperature affecting a measurement", "Using the wrong concentration of a titrant"], a: 2 },
              // 6. Gases
              { stem: "A container holds 32 g of O₂ (32 g/mol) and 28 g of N₂ (28 g/mol). The total pressure is 112 atm. What is the partial pressure of nitrogen (N₂)?", c: ["9 atm", "32 atm", "56 atm", "112 atm"], a: 2 },
              // 7. Thermochemistry
              { stem: "Given a reaction with ΔH = +50 kJ and ΔS = +25 J/K, at what temperature will the reaction become spontaneous?", c: ["Above 2,000 K", "Below 2,000 K", "Above 2,273 K", "At all temperatures"], a: 0 },
              // 8. Equilibrium
              { stem: "For the endothermic reaction: A(s) + 2B(g) ⇌ C(g). Which of the following changes will shift the equilibrium to the right?", c: ["Increasing the temperature", "Decreasing the temperature", "Increasing the pressure", "Adding more A(s)"], a: 0 },
              // 9. Kinetics
              { stem: "A 100 g sample of a radioactive isotope decays to 12.5 g in 30 minutes. What is the half-life of this isotope?", c: ["5 minutes", "10 minutes", "15 minutes", "30 minutes"], a: 1 },
              // 10. Electrochemistry
              { stem: "Given the reaction: 2Al₂O₃ + 3C → 4Al + 3CO₂. Which element is the *reducing agent*?", c: ["Al in Al₂O₃", "O in Al₂O₃", "C", "Al"], a: 2 },
              // 11. Nuclear Reactions
              { stem: "What is the nuclear binding energy for an isotope?", c: ["The energy released when the nucleus is formed from its constituent nucleons.", "The energy required to remove a valence electron.", "The energy holding the electrons in orbit.", "The energy released during beta decay."], a: 0 },
              // 12. Stoichiometry
              { stem: "How many grams of AlBr₃ (267 g/mol) are needed to react with K₂SO₄ to produce 0.191 kg of Al₂(SO₄)₃ (342 g/mol)? (Reaction: 2 AlBr₃ + 3 K₂SO₄ → Al₂(SO₄)₃ + 6 KBr)", c: ["(191)(2)(267) / (342)", "(0.191)(1)(267) / (342)", "(191)(342) / (267)(2)", "(191)(267) / (342)"], a: 0 },
              // 13. Periodic Trends
              { stem: "Which of the following atoms has the *lowest* first ionization energy?", c: ["O", "S", "Se", "Te", "Po"], a: 4 },
              // 14. Atomic Structure
              { stem: "Which of the following ions is diamagnetic in its ground state?", c: ["C²⁻", "N²⁻", "Li⁺", "S²⁺"], a: 2 },
              // 15. Lab
              { stem: "Which of the following is an *unsafe* lab practice?", c: ["Weighing calcium outside the fume hood", "Washing an Erlenmeyer flask in the sink", "Adding water to concentrated acid", "Pouring sodium bicarbonate on an acid spill"], a: 2 },
              // 16. Gases
              { stem: "If the temperature of a gas is doubled and the pressure is doubled, what happens to the volume?", c: ["It is quadrupled", "It is halved", "It stays the same", "It is doubled"], a: 2 },
              // 17. Thermochemistry
              { stem: "How much energy (in joules) is required to heat 15 grams of water from 35°C to 80°C? (c_water = 4.18 J/g°C)", c: ["(15)(4.18)(35)", "(15)(4.18)(45)", "(15)(4.18)(80)", "(0.015)(4.18)(45)"], a: 1 },
              // 18. Liquids/Solids
              { stem: "A liquid with *weak* intermolecular forces would be expected to have:", c: ["A high boiling point and high volatility", "A low boiling point and high volatility", "A high boiling point and low volatility", "A low boiling point and low volatility"], a: 1 },
              // 19. Kinetics
              { stem: "The half-life of a *second-order* reaction (rate = k[A]²) is:", c: ["Constant (t₁/₂ = 0.693/k)", "Dependent on initial concentration (t₁/₂ = 1 / k[A]₀)", "Dependent on initial concentration (t₁/₂ = [A]₀ / 2k)", "Independent of the rate constant (k)"], a: 1 },
              // 20. Electrochemistry
              { stem: "What is the E°cell for the reaction: Cl₂(g) + 2I⁻(aq) → 2Cl⁻(aq) + I₂(s)? (Given E°red: Cl₂/Cl⁻ = +1.36 V, I₂/I⁻ = +0.54 V)", c: ["+0.82 V", "-0.82 V", "+1.90 V", "-1.90 V"], a: 0 },
              // 21. Nuclear Reactions
              { stem: "Which of the following best describes an isotope?", c: ["Same protons, different electrons", "Same neutrons, different protons", "Same protons, different neutrons", "Same mass number, different protons"], a: 2 },
              // 22. Equilibrium
              { stem: "Which of the following changes will *always* shift the equilibrium of an exothermic gas-phase reaction to the left?", c: ["Increasing temperature", "Decreasing temperature", "Increasing pressure", "Removing product"], a: 0 },
              // 23. Atomic Structure
              { stem: "What is the ground-state electron configuration of a neutral Copper (Cu) atom?", c: ["[Ar] 4s²3d⁹", "[Ar] 4s¹3d¹⁰", "[Ar] 4s²3d¹⁰", "[Ar] 4s¹3d⁹"], a: 1 },
              // 24. Periodic Trends
              { stem: "Transition metals are characterized by having partially filled:", c: ["s-subshells", "p-subshells", "d-subshells", "f-subshells"], a: 2 },
              // 25. Gases
              { stem: "Which of the following gas laws states that two gases with equal volumes will have an equal number of molecules at the same T and P?", c: ["Boyle's Law", "Dalton's Law", "Charles's Law", "Avogadro's Law"], a: 3 },
              // 26. Thermochemistry
              { stem: "A 20g block of ice is at -10°C. What is the setup to find the energy needed to heat it to 0°C (but not melt)? (c_ice = 2.09 J/g°C)", c: ["(20)(2.09)(10)", "(20)(4.18)(10)", "(20)(334)", "(20)(2.09)(0)"], a: 0 },
              // 27. Liquids/Solids
              { stem: "Which of the following is a characteristic of covalent network solids (like diamond)?", c: ["Malleability and high conductivity", "Low melting point and soft", "High melting point and very hard", "Soluble in water"], a: 2 },
              // 28. Lab
              { stem: "What is the percentage of oxygen by mass in glucose, C₆H₁₂O₆? (Molar masses: C=12, H=1, O=16)", c: ["(16*6) / (12*6 + 1*12 + 16*6) * 100", "(16) / (12*6 + 1*12 + 16*6) * 100", "(12*6) / (180) * 100", "(1*12) / (180) * 100"], a: 0 },
              // 29. Kinetics
              { stem: "For the reaction 2A + B → C, the rate law is found to be Rate = k[A][B]. What is the overall reaction order?", c: ["3", "2", "1", "0"], a: 1 },
              // 30. Electrochemistry
              { stem: "Given the reaction: CH₄ + 2O₂ → CO₂ + 2H₂O. Which element is *reduced*?", c: ["C in CH₄", "H in CH₄", "O in O₂", "O in H₂O"], a: 2 }
        ],
        // Test 8
        [
              { stem: "If a chemist wants to measure 500µL of a solution, which laboratory equipment would be the *most* precise?", c: ["Micropipette","Buret","Erlenmeyer flask","Graduated cylinder"], a: 0 },
              { stem: "What is the percent yield if a reaction *theoretically* should produce 20 g of product, but the student only *actually* recovers 18 g?", c: ["90%","111%","10%","80%"], a: 0 },
              { stem: "Consider a vessel with an ideal gas at 3 atm. If the volume is halved and the internal temperature triples, what is the new pressure?", c: ["2 atm","4.5 atm","9 atm","18 atm"], a: 3 },
              { stem: "Which of the following elements has the *highest* second ionization energy?", c: ["Na","Mg","Al","Si"], a: 0 },
              { stem: "Which of the following molecules is *non-polar* (has a zero dipole moment)?", c: ["H₂O","NH₃","CH₃Cl","BF₃"], a: 3 },
              { stem: "Which of the following enthalpy changes is the *largest* (most endothermic) for a given substance?", c: ["ΔH_fusion","ΔH_vaporization","ΔH_sublimation","ΔH_freezing"], a: 2 },
              { stem: "What is the K_c expression for the reaction: N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)?", c: ["[NH₃]² / ([N₂][H₂]³)","([N₂][H₂]³) / [NH₃]²","[NH₃] / ([N₂][H₂])","[NH₃]² / ([N₂][H₂])"], a: 0 },
              { stem: "A plot of ln[A] vs. time (t) produces a straight line. What is the reaction order?", c: ["Zero-order","First-order","Second-order","Third-order"], a: 1 },
              { stem: "What is the correct setup to find the change in freezing point (ΔTf) for a 0.5 m solution of MgCl₂? (Kf = 1.86 °C/m)", c: ["ΔTf = (1)(1.86)(0.5)","ΔTf = (2)(1.86)(0.5)","ΔTf = (3)(1.86)(0.5)","ΔTf = (1.86)(0.5)"], a: 2 },
              { stem: "In a galvanic cell, the site of oxidation is the:", c: ["Anode, which is positive","Anode, which is negative","Cathode, which is positive","Cathode, which is negative"], a: 1 },
              { stem: "A 60 g sample of a radioactive isotope has a half-life of 10 days. How much of the sample remains after 30 days?", c: ["30 g","15 g","7.5 g","3.75 g"], a: 2 },
              { stem: "Which of the following is an example of a *systematic* error?", c: ["An incorrectly calibrated balance that always reads 0.2g low","Reading the meniscus differently each time","Forgetting to write down a measurement","A random fluctuation in room temperature"], a: 0 },
              { stem: "What is the empirical formula of a compound that is 75% carbon and 25% hydrogen by mass? (C=12 g/mol, H=1 g/mol)", c: ["CH","CH₂","CH₃","CH₄"], a: 3 },
              { stem: "At constant temperature, pressure is inversely proportional to volume. Which gas law is this?", c: ["Boyle's Law","Charles's Law","Gay-Lussac's Law","Avogadro's Law"], a: 0 },
              { stem: "Which of the following elements is a non-metal?", c: ["Sulfur (S)","Titanium (Ti)","Antimony (Sb)","Gallium (Ga)"], a: 0 },
              { stem: "What is the ground-state electron configuration of the Cr atom?", c: ["[Ar] 4s²3d⁴","[Ar] 4s¹3d⁵","[Ar] 4s²3d³","[Ar] 4s¹3d⁴"], a: 1 },
              { stem: "A chemical reaction that has a positive ΔH and a positive ΔS will be:", c: ["Spontaneous at all temperatures","Non-spontaneous at all temperatures","Spontaneous only at high temperatures","Spontaneous only at low temperatures"], a: 2 },
              { stem: "For the reaction: A(s) + B(g) ⇌ C(g). What is the equilibrium constant expression (K_c)?", c: ["[C] / [B]","[C] / ([A][B])","([A][B]) / [C]","[B] / [C]"], a: 0 },
              { stem: "The rate law for a reaction is Rate = k[X]²[Y]. What is the overall reaction order?", c: ["1","2","3","4"], a: 2 },
              { stem: "What is the molality (m) of a solution where 0.5 mol of solute is dissolved in 250 g of solvent?", c: ["0.25 m","0.5 m","1.0 m","2.0 m"], a: 3 },
              { stem: "Which of the following is true for a *voltaic* (galvanic) cell?", c: ["A non-spontaneous reaction occurs.","E°cell is negative.","The anode is the site of reduction.","The cathode is the positive electrode."], a: 3 },
              { stem: "A sample of a radioisotope has a half-life of 20 days. What fraction of the original sample will remain after 60 days?", c: ["1/2","1/4","1/6","1/8"], a: 3 },
              { stem: "Which piece of laboratory glassware sits below the burette in an acid-base titration?", c: ["Beaker","Volumetric flask","Graduated cylinder","Erlenmeyer flask"], a: 3 },
              { stem: "How many moles of H₂O are produced when 2 moles of methane (CH₄) are completely combusted? (CH₄ + 2O₂ → CO₂ + 2H₂O)", c: ["1 mole","2 moles","4 moles","8 moles"], a: 2 },
              { stem: "Which of the following bonds is the *most* polar?", c: ["C-H","N-H","O-H","F-F"], a: 2 },
              { stem: "Elements in Group 17 (F, Cl, Br) are known as:", c: ["Alkali metals","Alkaline earth metals","Halogens","Noble gases"], a: 2 },
              { stem: "A 2.0 L container holds 0.5 mol of an ideal gas at 300K. What is the pressure? (R = 0.0821 L·atm/mol·K)", c: ["P = (0.5)(0.0821)(300) / 2.0","P = (2.0)(0.0821)(300) / 0.5","P = (0.5)(0.0821) / (300)(2.0)","P = (0.5)(300) / (0.0821)(2.0)"], a: 0 },
              { stem: "What volume of 6.0 M HCl is needed to prepare 500 mL of 0.12 M HCl?", c: ["2.0 mL","5.0 mL","10.0 mL","15.0 mL"], a: 2 },
              { stem: "For the reaction N₂(g) + O₂(g) ⇌ 2NO(g), K_c1 = 1x10³⁰. For 2NO(g) + O₂(g) ⇌ 2NO₂(g), K_c2 = 6.9x10⁵. What is K_c3 for the combined reaction N₂(g) + 2O₂(g) ⇌ 2NO₂(g)?", c: ["K_c1 / K_c2","K_c1 + K_c2","K_c2 - K_c1","K_c1 * K_c2"], a: 3 },
              { stem: "A reaction has a rate law of Rate = k. What happens to the rate if the concentration of the reactant is doubled?", c: ["The rate doubles","The rate quadruples","The rate is halved","The rate does not change"], a: 3 }
        ],
        // Test 9
        [
            // 1. Gases
              { stem: "A gas is contained at 5.0 atm. If the volume is halved and the temperature is doubled, what is the new pressure?", c: ["2.5 atm","5.0 atm","10.0 atm","20.0 atm"], a: 3 },
            // 2. Thermochemistry
              { stem: "Which of the following processes is *exothermic*?", c: ["Sublimation (solid to gas)","Melting (solid to liquid)","Vaporization (liquid to gas)","Deposition (gas to solid)"], a: 3 },
            // 3. Lab
              { stem: "A student performs an experimental reaction and recovers 12 g of product. The theoretical yield was 15 g. What is the percent yield?", c: ["80%","125%","20%","75%"], a: 0 },
            // 4. Stoichiometry
              { stem: "How many grams of water (18 g/mol) are needed to react with 46 g of sodium (23 g/mol) to produce sodium hydroxide and hydrogen gas? (Reaction: 2 Na + 2 H₂O → 2 NaOH + H₂)", c: ["9 g","18 g","36 g","46 g"], a: 2 },
            // 5. Periodic Trends
              { stem: "Which of the following atoms has the *smallest* atomic radius?", c: ["Li","Be","B","C","N"], a: 4 },
            // 6. Atomic Structure
              { stem: "What is the molecular geometry of sulfur trioxide (SO₃)?", c: ["Bent","Trigonal planar","Trigonal pyramidal","Tetrahedral"], a: 1 },
            // 7. Equilibrium
              { stem: "For the reaction: 2A(g) + B(g) ⇌ 2C(g). Which change will shift the equilibrium to the right?", c: ["Increasing the volume","Removing C(g)","Removing B(g)","Adding a catalyst"], a: 1 },
            // 8. Kinetics
              { stem: "A 40 g sample of a compound decomposes. After 6 hours, 5 g remains. If the decay is first-order, what is the half-life?", c: ["1.5 hours","2 hours","3 hours","6 hours"], a: 1 },
            // 
              { stem: "How many liters of a 12.0 M stock solution are needed to prepare 2.0 L of a 3.0 M solution?", c: ["0.5 L","1.0 L","2.0 L","4.0 L"], a: 0 },
            // 
              { stem: "What is the oxidation number of Cr in the dichromate ion, Cr₂O₇²⁻?", c: ["+3","+4","+6","+7"], a: 2 },
            // 
              { stem: "The alpha decay of ²³⁸U (atomic number 92) produces what daughter nuclide?", c: ["²³⁴Th","²³⁸Np","²³⁴Pa","²³⁸Pu"], a: 0 },
            // 
              { stem: "Which of the following laboratory waste materials is *not* properly matched with its disposal?", c: ["Broken beaker: broken glass bin","Paper towels used to clean a base spill: trash bin","Water from a water bath: sink drain","Leftover 1M HCl solution: sink drain"], a: 3 },
            // 
              { stem: "What is the molar mass of a compound if 0.25 moles of it has a mass of 10 g?", c: ["2.5 g/mol","10 g/mol","25 g/mol","40 g/mol"], a: 3 },
            // 
              { stem: "A 5.0 L container holds 1.0 mol of O₂ and 4.0 mol of N₂ at a total pressure of 10 atm. What is the partial pressure of O₂?", c: ["1 atm","2 atm","5 atm","8 atm"], a: 1 },
            // 
              { stem: "Which of the following statements correctly explains why ionization energy generally increases from left to right across a period?", c: ["Atomic radius increases","Effective nuclear charge increases","Electron shielding increases","Metallic character increases"], a: 1 },
            // 
              { stem: "Which of the following is the correct electron configuration for a neutral Molybdenum (Mo) atom?", c: ["[Kr] 5s²4d⁴","[Kr] 5s¹4d⁵","[Ar] 5s²4d⁴","[Ar] 5s¹4d⁵"], a: 1 },
            // 
              { stem: "A reaction is spontaneous at all temperatures. Which of the following must be true?", c: ["ΔH > 0, ΔS > 0","ΔH > 0, ΔS < 0","ΔH < 0, ΔS > 0","ΔH < 0, ΔS < 0"], a: 2 },
            // 
              { stem: "For the reaction: A(s) + B(g) ⇌ C(g). What is the equilibrium constant expression (K_c)?", c: ["[C] / [B]","[C] / ([A][B])","([A][B]) / [C]","[B] / [C]"], a: 0 },
            // 
              { stem: "The rate law for a reaction is Rate = k[X]²[Y]. What is the overall reaction order?", c: ["1","2","3","4"], a: 2 },
            // 
              { stem: "What is the molality (m) of a solution where 0.5 mol of solute is dissolved in 250 g of solvent?", c: ["0.25 m","0.5 m","1.0 m","2.0 m"], a: 3 },
            // 
              { stem: "Which of the following is true for a *voltaic* (galvanic) cell?", c: ["A non-spontaneous reaction occurs.","E°cell is negative.","The anode is the site of reduction.","The cathode is the positive electrode."], a: 3 },
            // 
              { stem: "A sample of a radioisotope has a half-life of 20 days. What fraction of the original sample will remain after 60 days?", c: ["1/2","1/4","1/6","1/8"], a: 3 },
            // 
              { stem: "Which piece of laboratory glassware is designed to hold, heat, or mix solutions, but is *not* accurate for measuring volumes?", c: ["Buret","Pipette","Beaker","Volumetric flask"], a: 2 },
            // 
              { stem: "Given the balanced equation: 4 Al + 3 O₂ → 2 Al₂O₃. How many moles of Al₂O₃ are produced from 6 moles of O₂?", c: ["2 moles","3 moles","4 moles","6 moles"], a: 2 },
            // 
              { stem: "How many total valence electrons are in the nitrate ion, NO₃⁻?", c: ["22","23","24","25"], a: 2 },
            // 
              { stem: "Which of the following elements would have the shortest bond length when bonded to Carbon (C)?", c: ["Fluorine (F)","Chlorine (Cl)","Bromine (Br)","Iodine (I)"], a: 0 },
            // 
              { stem: "If the temperature of an ideal gas is doubled at constant volume, what happens to the pressure?", c: ["It is halved","It stays the same","It is doubled","It is quadrupled"], a: 2 },
            // 
              { stem: "What is the change in internal energy (ΔU) if a system absorbs 400 J of heat and does 150 J of work on the surroundings?", c: ["+250 J","-250 J","+550 J","-550 J"], a: 0 },
            // 
              { stem: "Given the Ksp of AgCl is 1.8 x 10⁻¹⁰. If the ion product (Qsp) is calculated to be 2.5 x 10⁻⁹, what will occur?", c: ["A precipitate will form.","No precipitate will form.","The solution is saturated.","The solution is at equilibrium."], a: 0 },
            // 
              { stem: "For a *zero-order* reaction, the half-life is:", c: ["Constant (t₁/₂ = 0.693/k)","Dependent on initial concentration (t₁/₂ = 1 / k[A]₀)","Dependent on initial concentration (t₁/₂ = [A]₀ / 2k)","Independent of concentration"], a: 2 }
        ]
    ];
    
    // Verify data loaded
    console.log('✅ GeneralChemistryExamData loaded:', window.GeneralChemistryExamData ? window.GeneralChemistryExamData.length : 0, 'tests');
    if (window.GeneralChemistryExamData && window.GeneralChemistryExamData.length > 0) {
        for (let i = 0; i < Math.min(window.GeneralChemistryExamData.length, 3); i++) {
            console.log(`✅ Test ${i + 1} has`, window.GeneralChemistryExamData[i] ? window.GeneralChemistryExamData[i].length : 0, 'questions');
        }
    }
})();
