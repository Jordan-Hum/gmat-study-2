// Glossary / flashcards: [term, definition, topic id]
window.GLOSSARY = [
  // Number properties
  ["Number of factors", "If n = p^a · q^b · r^c (prime factorization), n has (a+1)(b+1)(c+1) positive factors. 360 = 2³·3²·5 → 4·3·2 = 24.", "num"],
  ["GCF × LCM", "For two positive integers, GCF × LCM = the product of the numbers. GCF: lower power of shared primes; LCM: higher power of every prime.", "num"],
  ["Prime numbers", "Integers greater than 1 with exactly two factors. 2 is the only even prime; 1 is not prime. Primes under 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.", "num"],
  ["Remainder form", "n = divisor × quotient + remainder, with 0 ≤ remainder < divisor. \"Remainder 4 when divided by 6\" → n = 6k + 4 → 4, 10, 16, …", "num"],
  ["Units-digit cycles", "Powers repeat their units digits every 4 (or fewer): 2: 2,4,8,6 · 3: 3,9,7,1 · 7: 7,9,3,1 · 8: 8,4,2,6. Use the exponent's remainder when divided by 4.", "num"],
  ["Trailing zeros of n!", "Count factors of 5: ⌊n/5⌋ + ⌊n/25⌋ + … 50! has 10 + 2 = 12 trailing zeros.", "num"],
  ["Odd × even rules", "Product is even if any factor is even. Sum of two odds is even. n(n+1) is always even.", "num"],
  ["Consecutive integers", "Product of k consecutive integers is divisible by k!. The sum of an odd number of consecutive integers = count × middle term.", "num"],
  ["Terminating decimals", "A fraction in lowest terms terminates only if its denominator's prime factors are just 2s and 5s.", "num"],
  ["Perfect squares", "All prime exponents are even; they have an odd number of factors. To make 180k a square: 180 = 2²·3²·5 → k = 5.", "num"],
  ["Divisibility by 3 and 9", "A number is divisible by 3 (or 9) if the sum of its digits is.", "num"],
  ["Divisibility by 4 and 8", "Divisible by 4 if the last two digits are; by 8 if the last three digits are.", "num"],
  ["Primes greater than 3", "Every prime p > 3 is 6k ± 1, so p² leaves remainder 1 when divided by 12 (and by 24).", "num"],

  // Percents, ratios
  ["Percent change", "(new − old) ÷ old. Always divide by the original value.", "pct"],
  ["Successive percent changes", "Multiply the factors: +20% then −20% = 1.2 × 0.8 = 0.96, a 4% loss overall.", "pct"],
  ["Reverse a percent change", "Divide by the multiplier: price after a 15% discount is $170 → original = 170 ÷ 0.85 = $200.", "pct"],
  ["Percentage points vs percent", "4% → 5% is +1 percentage point but a 25% increase.", "pct"],
  ["Markup vs margin", "Markup is profit as a percent of cost; margin is profit as a percent of price.", "pct"],
  ["Ratio parts", "a : b means the amounts are ak and bk; the total is (a + b)k. Find k from one fact.", "pct"],
  ["Chaining ratios", "a/c = (a/b)(b/c). To combine a:b and b:c, scale both so the b terms match.", "pct"],
  ["Common fraction–decimal pairs", "1/8 = .125 · 1/6 ≈ .167 · 3/8 = .375 · 5/8 = .625 · 2/3 ≈ .667 · 7/8 = .875", "pct"],
  ["Same spending after a price rise", "If price rises p%, quantity must fall by p/(100 + p). A 25% rise needs a 20% cut.", "pct"],

  // Algebra
  ["Special products", "(a+b)² = a² + 2ab + b² · (a−b)² = a² − 2ab + b² · a² − b² = (a+b)(a−b)", "alg"],
  ["Quadratic formula", "x = [−b ± √(b² − 4ac)] / 2a. Sum of roots = −b/a, product = c/a.", "alg"],
  ["Discriminant", "b² − 4ac: > 0 two real roots, = 0 one root, < 0 no real roots.", "alg"],
  ["Exponent rules", "a^m·a^n = a^(m+n) · (a^m)^n = a^(mn) · a^−n = 1/a^n · a^(1/n) = ⁿ√a · a⁰ = 1", "alg"],
  ["Common bases", "Rewrite to a shared base and set exponents equal: 32 = 2⁵, 8 = 2³, 27 = 3³, 125 = 5³.", "alg"],
  ["Factor out the smallest power", "2²⁰ − 2¹⁸ = 2¹⁸(2² − 1) = 3·2¹⁸.", "alg"],
  ["√(x²)", "√(x²) = |x|, not x. If x < 0, it equals −x.", "alg"],
  ["Extraneous roots", "Squaring both sides or solving absolute values can create false solutions. Always plug roots back in.", "alg"],
  ["Don't divide by a variable", "x² = 4x → x² − 4x = 0 → x = 0 or 4. Dividing by x loses x = 0.", "alg"],
  ["Inverse variation", "y varies inversely with x: xy is constant. \"Inversely with x²\": y·x² is constant.", "alg"],
  ["Function composition", "g(h(x)): apply h first, then g. f(a + 1): replace every x with (a + 1).", "alg"],

  // Inequalities
  ["Flip the inequality", "Multiplying or dividing by a negative reverses the sign: −2x ≥ 8 → x ≤ −4.", "ineq"],
  ["Absolute value as distance", "|x − c| is the distance from x to c. |x − 3| < 5 → −2 < x < 8.", "ineq"],
  ["|x − c| > d", "x < c − d or x > c + d (outside the interval).", "ineq"],
  ["Combining ranges", "For x − y, use max x − min y and min x − max y. Never subtract inequalities directly.", "ineq"],
  ["Quadratic inequality", "(x − a)(x − b) < 0 → between the roots; > 0 → outside the roots.", "ineq"],
  ["Numbers between 0 and 1", "x³ < x² < x < √x < 1 < 1/x.", "ineq"],
  ["Sign of xy and x/y", "Same signs → positive; opposite signs → negative. x/y and xy always have the same sign.", "ineq"],

  // Word problems
  ["Average speed", "Total distance ÷ total time. For equal distances at a and b: 2ab/(a + b), not (a + b)/2.", "word"],
  ["Combined work", "Add rates: 1/a + 1/b = 1/t. Two workers: t = ab/(a + b). A drain subtracts its rate.", "word"],
  ["Relative speed", "Toward each other: add speeds. Same direction: subtract. Catch-up time = head start ÷ speed difference.", "word"],
  ["Worker-days", "Total work = workers × days. 6 workers × 10 days = 60 worker-days → 4 workers need 15 days.", "word"],
  ["Mixture problems", "Track the pure substance: amount × concentration. Adding water doesn't change the amount of salt.", "word"],
  ["Simple vs compound interest", "Simple: P·r·t. Compound: P(1 + r)^t. $10,000 at 10% for 2 years: $12,000 simple, $12,100 compound.", "word"],
  ["Break-even point", "Units = fixed costs ÷ (price − variable cost per unit).", "word"],
  ["Upstream / downstream", "Downstream = boat + current; upstream = boat − current. Current = half the difference.", "word"],
  ["Backsolving", "Plug answer choices into the problem, starting with the middle value; choices are in increasing order.", "word"],

  // Statistics
  ["Mean and sum", "Sum = mean × count. Adding a value: new sum = old sum + value.", "stat"],
  ["Median", "The middle value after sorting; the average of the two middle values when the count is even.", "stat"],
  ["Evenly spaced sets", "Mean = median = (first + last)/2. Count of integers from a to b = b − a + 1.", "stat"],
  ["Standard deviation", "Measures spread around the mean. All values equal → SD 0. Unaffected by adding a constant; multiplied by k when every value is multiplied by k.", "stat"],
  ["Overlapping sets", "Total = A + B − Both + Neither. Exactly one = A + B − 2·Both.", "stat"],
  ["Weighted average", "(n₁·a₁ + n₂·a₂)/(n₁ + n₂). The result is closer to the bigger group's average.", "stat"],
  ["Range", "Maximum − minimum. Only the extreme values matter.", "stat"],

  // Counting & probability
  ["Permutations", "Order matters: n!/(n − r)!. President and VP from 10: 10 × 9 = 90.", "prob"],
  ["Combinations", "Order doesn't matter: C(n, r) = n!/[r!(n − r)!]. C(8, 3) = 56.", "prob"],
  ["Arrangements with repeats", "n!/(a!·b!…) for letters repeated a, b… times. LEVEL: 5!/(2!·2!) = 30.", "prob"],
  ["Must be together", "Glue the items into one block, arrange the blocks, then multiply by arrangements inside the block.", "prob"],
  ["Circular arrangements", "n people around a table: (n − 1)!", "prob"],
  ["At least one", "P(at least one) = 1 − P(none). Three coin tosses: 1 − 1/8 = 7/8.", "prob"],
  ["P(A or B)", "P(A) + P(B) − P(A and B). If A and B are independent, P(A and B) = P(A)·P(B).", "prob"],
  ["Without replacement", "Each draw changes the counts: two reds from 4 red, 6 blue: 4/10 × 3/9 = 2/15.", "prob"],

  // Critical reasoning
  ["Conclusion indicators", "Therefore, thus, so, hence, consequently, clearly, should (recommendations). Evidence indicators: because, since, given that.", "cr"],
  ["Assumption question", "The unstated premise the argument needs. Use the negation test: if negating an answer destroys the argument, it's the assumption.", "cr"],
  ["Strengthen question", "Choose the answer that, if true, makes the conclusion more likely, usually by closing the gap or ruling out another explanation.", "cr"],
  ["Weaken question", "Choose the answer that, if true, makes the conclusion less likely: an alternative cause, reverse causation, or a reason the plan will fail.", "cr"],
  ["Correlation vs causation", "Two things occurring together doesn't prove one causes the other. Look for a third factor or reverse causation.", "cr"],
  ["Plan / goal arguments", "Ask: will the plan achieve its stated goal? Costs matter only if the goal is about profit or cost.", "cr"],
  ["Unrepresentative sample", "A survey of current members, volunteers or respondents may not reflect the whole population.", "cr"],
  ["Rates vs counts", "More injuries may just reflect more workers. Compare rates (per worker, per hour) instead of raw numbers.", "cr"],
  ["Argument by analogy", "Strengthened by showing the two cases are similar in relevant ways; weakened by a relevant difference.", "cr"],
  ["Out-of-scope answers", "Answers about the topic that don't affect the link between evidence and conclusion. Ask \"so what?\"", "cr"],

  ["Inference question", "The answer must be supported by the passage alone. Prefer modest, narrow statements; reject extreme or outside claims.", "cr2"],
  ["Contrapositive", "If A → B, then not B → not A is also true. The converse (B → A) is not.", "cr2"],
  ["Sufficient vs necessary", "\"All who took the course were promoted\" (course is sufficient) doesn't mean the course was necessary for promotion.", "cr2"],
  ["Paradox question", "Find the answer that lets both surprising facts be true, usually a change in some other factor.", "cr2"],
  ["Evaluate question", "Pick the question whose answer would strengthen the argument one way and weaken it the other.", "cr2"],
  ["Boldface question", "Label each bolded part: main conclusion, evidence, opposing view, or an intermediate conclusion. Check whether the author agrees with it.", "cr2"],
  ["Ad hominem", "Attacking the person making a claim instead of the claim itself.", "cr2"],
  ["Percent vs number flaw", "A bigger percent increase doesn't mean a bigger number; the bases may differ.", "cr2"],

  // Reading comprehension
  ["Primary purpose", "Covers the whole passage. Match the verb: describe, explain, argue, challenge, compare.", "rc"],
  ["Detail question", "\"According to the passage\": find the line. The answer is a close paraphrase.", "rc"],
  ["Inference question (RC)", "\"Suggests\", \"implies\", \"most likely agree\": a small step from specific lines, never a big leap.", "rc"],
  ["Function question", "\"In order to\": why does the author include this example or sentence? Read the sentences around it.", "rc"],
  ["Author's tone", "GMAT authors are usually moderate: \"qualified\", \"cautious\", \"measured skepticism\". Rarely \"scathing\" or \"unreserved\".", "rc"],
  ["Distortion trap", "Uses words from the passage but changes their meaning, e.g., reverses who holds a view.", "rc"],
  ["Pivot words", "However, but, yet, although, nevertheless: the author's view often follows them.", "rc"],

  // Data Insights
  ["DS answer A", "Statement (1) alone is sufficient; statement (2) alone is not.", "ds"],
  ["DS answer B", "Statement (2) alone is sufficient; statement (1) alone is not.", "ds"],
  ["DS answer C", "Both statements together are sufficient; neither alone is.", "ds"],
  ["DS answer D", "Each statement alone is sufficient.", "ds"],
  ["DS answer E", "Even together, the statements are not sufficient.", "ds"],
  ["Sufficient (DS)", "The information leads to exactly one answer. For a yes/no question, a definite \"no\" is sufficient.", "ds"],
  ["Rephrase the question (DS)", "Simplify first: \"Is x/y > 1?\" with y > 0 means \"Is x > y?\". Often you need a combination, not each variable.", "ds"],
  ["Test cases (DS)", "To prove a statement insufficient, find one case that answers yes and one that answers no.", "ds"],
  ["DS trap: same equation twice", "2x + 3y = 12 and 4x + 6y = 24 are the same equation, so they can't be solved together.", "ds"],

  ["Table Analysis", "A sortable table with three Yes/No or True/False statements. All three must be correct. Sort columns for rankings and medians.", "ta"],
  ["Graphics Interpretation", "A chart with drop-down statements. Read axes, units and scale first; watch percent vs percentage points.", "gi"],
  ["Percent change vs absolute change", "The largest increase isn't always the largest percent increase: a smaller base gives a bigger percent.", "gi"],
  ["Two-Part Analysis", "Two columns, one selection each, both must be right. Set up two conditions and check every constraint.", "tpa"],
  ["Multi-Source Reasoning", "2–3 tabs of emails, tables and memos, with usually 3 questions. Combine the sources and apply every rule.", "msr"]
];
