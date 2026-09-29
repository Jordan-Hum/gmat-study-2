// Study notes per topic (HTML). Keep "trap" callouts short: they flag common exam mistakes.
window.NOTES = {
num: `
<h3>Integers, odd and even</h3>
<ul>
  <li>Even ± even = even; odd ± odd = even; even ± odd = odd.</li>
  <li>A product is even if <b>any</b> factor is even; odd only if <b>every</b> factor is odd.</li>
  <li>n(n + 1) is always even. The product of k consecutive integers is divisible by k! (e.g., 3 consecutive → divisible by 6).</li>
  <li>Zero is even, and it's neither positive nor negative.</li>
</ul>

<h3>Primes and factors</h3>
<ul>
  <li>Primes under 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. <b>2 is the only even prime; 1 is not prime.</b></li>
  <li>Every prime greater than 3 is of the form 6k ± 1, so p² leaves remainder 1 when divided by 12 (and by 24).</li>
  <li>Prime-factorize everything: 360 = 2³ · 3² · 5.</li>
</ul>
<div class="formula">If n = p^a · q^b · r^c, the number of positive factors = (a + 1)(b + 1)(c + 1)</div>
<div class="formula">GCF × LCM = product of the two numbers</div>
<ul>
  <li>GCF: take the <b>lower</b> power of each shared prime. LCM: take the <b>higher</b> power of every prime.</li>
  <li>Odd factors: ignore the 2s. Perfect squares have an odd number of factors, and every prime exponent even.</li>
  <li>If n² is divisible by 72 = 2³ · 3², then n must contain 2² · 3 = 12 (halve the exponents, rounding up).</li>
</ul>

<h3>Divisibility shortcuts</h3>
<table>
  <tr><th>By</th><th>Rule</th></tr>
  <tr><td>3 / 9</td><td>Sum of digits divisible by 3 / 9</td></tr>
  <tr><td>4</td><td>Last two digits divisible by 4</td></tr>
  <tr><td>6</td><td>Divisible by 2 and 3</td></tr>
  <tr><td>8</td><td>Last three digits divisible by 8</td></tr>
  <tr><td>11</td><td>Alternating digit sum divisible by 11</td></tr>
</table>

<h3>Remainders</h3>
<div class="formula">n = divisor × quotient + remainder, with 0 ≤ remainder &lt; divisor</div>
<ul>
  <li>Write the number in that form (n = 6k + 4) and work with it. Or just test the smallest few numbers that fit (4, 10, 16…).</li>
  <li>Remainders add and multiply: the remainder of a·b equals the remainder of (rem a)·(rem b).</li>
  <li>If n leaves remainder 7 when divided by 10, it leaves 2 when divided by 5 (5 is a factor of 10).</li>
</ul>

<h3>Units digits and powers</h3>
<ul>
  <li>Units digits of powers cycle with length 4 (or less): 2 → 2, 4, 8, 6; 3 → 3, 9, 7, 1; 7 → 7, 9, 3, 1; 8 → 8, 4, 2, 6; 4 and 9 alternate; 0, 1, 5, 6 never change.</li>
  <li>Divide the exponent by 4 and use the remainder (remainder 0 → the 4th in the cycle).</li>
  <li>Trailing zeros of n!: count the 5s: ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋…</li>
  <li>A fraction in lowest terms is a terminating decimal only if its denominator has no primes other than 2 and 5.</li>
</ul>
<div class="trap">⚠️ "Must be true" questions: one counterexample kills an option. Test 0, 1, negatives and fractions when the problem allows them, but only integers when it says integers.</div>`,

pct: `
<h3>Percents</h3>
<div class="formula">Percent change = (new − old) ÷ old × 100</div>
<ul>
  <li>Use multipliers: +20% → × 1.2; −15% → × 0.85. Successive changes multiply: +20% then −20% = 1.2 × 0.8 = 0.96 (a 4% loss).</li>
  <li>"x is what percent of y" = x/y × 100. "Percent more than" divides by the <b>smaller</b> (original) value.</li>
  <li>To undo a change, divide: after a 25% markup, cost = price ÷ 1.25 (not price × 0.75).</li>
  <li><b>Percentage points</b> vs <b>percent</b>: 4% → 5% is up 1 point, but 25% in relative terms.</li>
  <li>Keep spending the same when price rises p%: cut quantity by p/(100 + p) (25% price rise → 20% cut).</li>
</ul>

<h3>Fractions and decimals</h3>
<ul>
  <li>Know these: 1/8 = 0.125, 1/6 ≈ 0.167, 1/3 ≈ 0.333, 3/8 = 0.375, 5/8 = 0.625, 2/3 ≈ 0.667, 7/8 = 0.875.</li>
  <li>To compare fractions, cross-multiply, convert to decimals, or compare how far each is from 1 (or from ½).</li>
  <li>Dividing by a fraction = multiplying by its reciprocal. Order of operations still applies.</li>
  <li>Multiplying top and bottom by different percents: (1.5a)/(0.75b) = 2 · (a/b).</li>
</ul>

<h3>Ratios</h3>
<ul>
  <li>A ratio a : b means the parts are ak and bk for some k, and the total is (a + b)k.</li>
  <li>Chain ratios through the shared term: a/b · b/c = a/c. If a : b = 2 : 3 and b : c = 4 : 5, scale b to 12 → 8 : 12 : 15.</li>
  <li>When something is added to one part only, set up (3k + 6)/(5k) = new ratio and solve for k.</li>
</ul>

<h3>Weighted averages</h3>
<div class="formula">Weighted average = (w₁·x₁ + w₂·x₂) ÷ (w₁ + w₂)</div>
<ul>
  <li>The result sits closer to the group with more weight. The distances from the average are in the inverse ratio of the weights.</li>
</ul>
<div class="trap">⚠️ A 20% increase followed by a 20% decrease is <b>not</b> zero change. And "after a discount, the price is $170" means you divide by 0.85.</div>`,

alg: `
<h3>Linear equations and systems</h3>
<ul>
  <li>Two unknowns need two <b>independent</b> equations. 2x + 3y = 12 and 4x + 6y = 24 are the same line.</li>
  <li>Often you only need a combination: 3x + 3y = 21 gives x + y = 7 without solving for either.</li>
  <li>Substitution for simple forms (a = b + 2); elimination when coefficients line up.</li>
</ul>

<h3>Quadratics</h3>
<div class="formula">(a + b)² = a² + 2ab + b² · (a − b)² = a² − 2ab + b² · a² − b² = (a + b)(a − b)</div>
<div class="formula">ax² + bx + c = 0 → x = [−b ± √(b² − 4ac)] / 2a · sum of roots = −b/a · product = c/a</div>
<ul>
  <li>Discriminant b² − 4ac: positive → 2 real roots, zero → 1 root, negative → none.</li>
  <li>Get everything on one side and factor. Never divide by a variable that could be 0 (x² = 4x → x = 0 or 4).</li>
  <li>Squaring both sides can create false solutions: always check roots of equations with square roots or absolute values.</li>
  <li>Use identities: if (x + y)² = 49 and xy = 6, then x² + y² = 49 − 12 = 37.</li>
</ul>

<h3>Exponents and roots</h3>
<table>
  <tr><th>Rule</th><th>Example</th></tr>
  <tr><td>a^m · a^n = a^(m+n)</td><td>x⁴ · x⁻² = x²</td></tr>
  <tr><td>(a^m)^n = a^(mn)</td><td>(x²)³ = x⁶</td></tr>
  <tr><td>a^−n = 1/a^n</td><td>(1/2)^−3 = 8</td></tr>
  <tr><td>a^(1/n) = ⁿ√a</td><td>(1/4)^(−1/2) = 2</td></tr>
  <tr><td>a⁰ = 1 (a ≠ 0)</td><td></td></tr>
</table>
<ul>
  <li>Rewrite with a common base: 32 = 2⁵, 9 = 3², 25 = 5². Then set exponents equal.</li>
  <li>Factor out the smallest power: 2²⁰ − 2¹⁸ = 2¹⁸(4 − 1).</li>
  <li>√(x²) = |x|. Rationalize: 1/(3 + 2√2) = (3 − 2√2)/(9 − 8).</li>
  <li>Decimals: √0.0009 = 0.03 (half as many decimal places).</li>
</ul>

<h3>Functions and variation</h3>
<ul>
  <li>f(a + 1): substitute (a + 1) everywhere x appears, in parentheses.</li>
  <li>Composition g(h(x)): apply h first, then g.</li>
  <li>Direct variation: y = kx (y/x constant). Inverse: y = k/x (xy constant). "Inversely with x²": y·x² constant.</li>
</ul>
<div class="trap">⚠️ Don't cancel a variable from both sides unless you know it isn't zero, and don't forget the negative root when you take a square root (x² = 9 → x = ±3).</div>`,

ineq: `
<h3>Inequality rules</h3>
<ul>
  <li>Add or subtract anything: the sign stays. Multiply or divide by a <b>negative</b>: the sign <b>flips</b>.</li>
  <li>Never multiply or divide by a variable unless you know its sign.</li>
  <li>You can add inequalities that point the same way, but never subtract them. For x − y, combine extremes: max = max x − min y.</li>
  <li>Squaring is only safe when both sides are non-negative.</li>
</ul>

<h3>Absolute value</h3>
<div class="formula">|x − c| &lt; d ⇔ c − d &lt; x &lt; c + d · |x − c| &gt; d ⇔ x &lt; c − d or x &gt; c + d</div>
<ul>
  <li>|x − c| is the distance from x to c on the number line.</li>
  <li>Solve |expr| = k by splitting into expr = k and expr = −k, then <b>check</b> each (the other side must be ≥ 0).</li>
  <li>√(x²) = |x|. If x &lt; 0, |x| = −x.</li>
</ul>

<h3>Quadratic inequalities</h3>
<ul>
  <li>Factor, find the roots, and test a point in each region. For (x − 4)(x + 3) &lt; 0 the answer is <b>between</b> the roots (−3 &lt; x &lt; 4); for &gt; 0 it's outside.</li>
  <li>x² &lt; 16 means −4 &lt; x &lt; 4, not just x &lt; 4.</li>
</ul>

<h3>Number-line reasoning</h3>
<ul>
  <li>For 0 &lt; x &lt; 1: x³ &lt; x² &lt; x &lt; √x &lt; 1 &lt; 1/x.</li>
  <li>xy &gt; 0 → same signs; xy &lt; 0 → opposite signs; x/y has the same sign as xy.</li>
  <li>To test "must be true", pick numbers from every region: negative, between 0 and 1, greater than 1.</li>
</ul>
<div class="trap">⚠️ Count integer solutions carefully: strict inequalities (&lt;) exclude the endpoints, and negatives and 0 count too.</div>`,

word: `
<h3>Rate × time = distance (or work)</h3>
<div class="formula">Distance = rate × time · Work = rate × time (job = 1)</div>
<ul>
  <li><b>Average speed = total distance ÷ total time</b>, never the average of the speeds. For equal distances at speeds a and b: 2ab/(a + b).</li>
  <li>Moving toward each other: rates add. Same direction (catching up): rates subtract. The head start ÷ the gap in speeds = catch-up time.</li>
  <li>Upstream/downstream: boat ± current. Half the difference of the two speeds = the current.</li>
</ul>

<h3>Work problems</h3>
<ul>
  <li>Convert times to rates: a job in 6 hours = 1/6 job per hour. Rates add; a drain subtracts.</li>
  <li>Together time for two: ab/(a + b). Three or more: add the fractions.</li>
  <li>Worker-days: 6 workers × 10 days = 60 worker-days, so 4 workers take 15 days.</li>
  <li>Partial jobs: find what's left, then divide by the combined rate.</li>
</ul>

<h3>Mixtures</h3>
<ul>
  <li>Track the pure substance: 30% of 20 L = 6 L of salt stays the same when you add water.</li>
  <li>Mixing two concentrations/prices: set up amount₁·p₁ + amount₂·p₂ = total·p, or use the distance ratio (the mix is closer to the larger amount).</li>
</ul>

<h3>Money</h3>
<div class="formula">Simple interest = P·r·t · Compound: P(1 + r)^t · Profit = revenue − cost</div>
<ul>
  <li>Break-even units = fixed costs ÷ (price − variable cost per unit).</li>
  <li>Markup is a percent of <b>cost</b>; margin is a percent of <b>price</b>.</li>
  <li>Commission "on sales above $2,000": subtract the threshold first, then add it back at the end.</li>
</ul>

<h3>Setting up</h3>
<ul>
  <li>Define one variable, write each sentence as an equation, and check the answer against the story.</li>
  <li>Ages: every person ages by the same number of years.</li>
  <li>Backsolving: plug in the middle answer choice, then go up or down. Answer choices are in increasing order.</li>
</ul>
<div class="trap">⚠️ Watch units: minutes vs hours, thousands vs millions. And read the last line: is it asking for the time, the rate, or the amount remaining?</div>`,

stat: `
<h3>Mean, median, mode, range</h3>
<div class="formula">Sum = mean × number of items</div>
<ul>
  <li>Work with sums: adding or removing a value changes the sum by that value.</li>
  <li><b>Median</b>: the middle value after sorting (average of the two middle values if the count is even).</li>
  <li>For evenly spaced sets (consecutive integers, multiples), mean = median = (first + last)/2.</li>
  <li><b>Range</b> = max − min. Mode = most frequent value.</li>
  <li>An outlier pulls the mean toward it but barely moves the median.</li>
</ul>

<h3>Standard deviation (concepts only)</h3>
<ul>
  <li>SD measures spread around the mean. All values equal → SD = 0.</li>
  <li>Adding a constant to every value: mean shifts, SD and range don't change.</li>
  <li>Multiplying every value by k: mean, SD and range are all multiplied by |k|.</li>
  <li>Adding a value equal to the mean <b>decreases</b> SD; adding a value far from the mean increases it.</li>
  <li>"How many SDs above the mean": (value − mean) ÷ SD.</li>
</ul>

<h3>Overlapping sets</h3>
<div class="formula">Total = A + B − Both + Neither</div>
<ul>
  <li>"Exactly one" = A + B − 2·Both. "At least one" = A + B − Both.</li>
  <li>For two groups with two categories each (e.g., men/women × tea/coffee), draw a 2 × 2 table with totals.</li>
  <li>Without "neither", Both has a range: from max(0, A + B − Total) to min(A, B).</li>
</ul>

<h3>Weighted averages</h3>
<ul>
  <li>(n₁·avg₁ + n₂·avg₂)/(n₁ + n₂). The larger group pulls the result toward its average.</li>
</ul>
<div class="trap">⚠️ Sort before finding a median, and remember that with an even count the median might not be one of the numbers.</div>`,

prob: `
<h3>Counting</h3>
<div class="formula">Permutations (order matters): n!/(n − r)! · Combinations (order doesn't): C(n, r) = n!/[r!(n − r)!]</div>
<ul>
  <li><b>Multiplication principle</b>: independent choices multiply (2 letters × 3 digits: 26² × 10³).</li>
  <li>Does order matter? President + VP → yes (10 × 9). A committee → no (C(8, 3) = 56).</li>
  <li>Handle restrictions first (the even last digit, the person who must be included).</li>
  <li>Repeated items: divide by the repeats' factorials (LEVEL: 5!/(2!·2!) = 30).</li>
  <li>Items that must be together: glue them into one block, then multiply by the arrangements inside the block. Not together = total − together.</li>
  <li>Circular arrangements of n: (n − 1)!</li>
  <li>Groups from separate pools multiply: 2 of 5 men and 2 of 4 women = C(5, 2) × C(4, 2).</li>
</ul>
<table>
  <tr><th>n</th><th>n!</th><th>Useful C(n, r)</th></tr>
  <tr><td>4</td><td>24</td><td>C(4,2) = 6</td></tr>
  <tr><td>5</td><td>120</td><td>C(5,2) = 10</td></tr>
  <tr><td>6</td><td>720</td><td>C(6,2) = 15, C(6,3) = 20</td></tr>
  <tr><td>7</td><td>5,040</td><td>C(7,3) = 35</td></tr>
  <tr><td>8</td><td>40,320</td><td>C(8,3) = 56</td></tr>
</table>

<h3>Probability</h3>
<div class="formula">P = favorable outcomes ÷ total equally likely outcomes</div>
<div class="formula">P(A or B) = P(A) + P(B) − P(A and B) · independent: P(A and B) = P(A)·P(B)</div>
<ul>
  <li><b>"At least one"</b>: use 1 − P(none).</li>
  <li>Without replacement, the second draw's numbers change: 4/10 × 3/9.</li>
  <li>"Exactly one of two": P(A)(1 − P(B)) + P(B)(1 − P(A)).</li>
  <li>Two dice: 36 outcomes; sum of 7 has the most ways (6).</li>
  <li>A standard deck: 52 cards, 4 suits of 13, 12 face cards.</li>
</ul>
<div class="trap">⚠️ Don't double-count overlaps ("king or heart": the king of hearts is in both groups), and don't use combinations when the positions are different roles.</div>`,

cr: `
<h3>How to read an argument</h3>
<ul>
  <li>Find the <b>conclusion</b> (often after "so", "therefore", "thus", or a recommendation like "should") and the <b>evidence</b>.</li>
  <li>Spot the <b>gap</b>: what does the author take for granted to get from evidence to conclusion? Most assumption, strengthen and weaken answers target that gap.</li>
  <li>Read the question stem first so you know what you're hunting for.</li>
</ul>

<h3>Common gaps</h3>
<table>
  <tr><th>Pattern</th><th>What to look for</th></tr>
  <tr><td>Correlation → causation</td><td>A third factor, reverse causation, or coincidence</td></tr>
  <tr><td>Plan → goal</td><td>Will it actually work? Side effects? Costs vs benefits?</td></tr>
  <tr><td>Sample → everyone</td><td>Is the sample representative? Self-selected?</td></tr>
  <tr><td>Numbers vs rates</td><td>More injuries but more workers too; percent vs count</td></tr>
  <tr><td>Analogy</td><td>Are the two cases alike in the ways that matter?</td></tr>
  <tr><td>Proxy</td><td>Fewer reported thefts ≠ fewer thefts</td></tr>
</table>

<h3>Assumption questions</h3>
<ul>
  <li>A necessary assumption must be true for the argument to work. Use the <b>negation test</b>: negate the answer. If the argument falls apart, it's the assumption.</li>
  <li>Right answers are often modest ("not", "at least some"). Beware extreme wording ("all", "only", "the most").</li>
</ul>

<h3>Strengthen and weaken</h3>
<ul>
  <li>Assume each answer is true. Does it make the conclusion more or less likely?</li>
  <li>Weaken a causal claim: show another cause, reverse causation, or the cause without the effect. Strengthen: rule those out.</li>
  <li>Weaken a plan: show it won't achieve its goal. Costs alone don't weaken a claim about whether it will <i>work</i>.</li>
  <li>A few exceptions don't weaken a claim about averages or trends.</li>
</ul>
<div class="trap">⚠️ The biggest trap is an answer that's relevant to the topic but doesn't touch the gap between evidence and conclusion. Ask "so what?" for each answer.</div>`,

cr2: `
<h3>Inference (must be true / most strongly supported)</h3>
<ul>
  <li>The answer must follow from the passage alone. No outside knowledge, no big leaps.</li>
  <li>Chain conditional statements: A → B and B → C gives A → C. The contrapositive (not C → not A) is also valid; the converse (C → A) is not.</li>
  <li>Numbers vs percents: fewer sold but more revenue → higher average price per unit. A rising share doesn't mean a rising count.</li>
  <li>Prefer cautious wording ("probably", "some", "can"). Reject "always", "most", "will soon" unless the passage says so.</li>
</ul>

<h3>Paradox (resolve / explain)</h3>
<ul>
  <li>Restate the two facts that seem to clash. The right answer lets both be true.</li>
  <li>Look for a change in another factor: more patients, more cars overall, more media coverage.</li>
  <li>A fact that was always true can't explain a change.</li>
</ul>

<h3>Evaluate</h3>
<ul>
  <li>Pick the question whose answer would matter either way: one answer strengthens, the other weakens.</li>
  <li>Usually it tests the gap: "Did the number of cyclists stay the same?", "Do the groups differ in other ways?"</li>
</ul>

<h3>Boldface and method of reasoning</h3>
<ul>
  <li>Label each sentence: main conclusion, intermediate conclusion, evidence, opposing view, or background.</li>
  <li>"Therefore/so" often marks a conclusion; "however/but" often marks a turn toward the author's view.</li>
  <li>Decide whether the author agrees or disagrees with each bolded portion, then match.</li>
</ul>

<h3>Flaw</h3>
<table>
  <tr><th>Flaw</th><th>Example</th></tr>
  <tr><td>Sufficient vs necessary (converse)</td><td>Course → promoted, so promoted → course</td></tr>
  <tr><td>Ad hominem</td><td>The critics make violent games too</td></tr>
  <tr><td>Percent vs number</td><td>+50% vs +10% says nothing about which is bigger</td></tr>
  <tr><td>Unrepresentative sample</td><td>Only current members were surveyed</td></tr>
  <tr><td>Correlation as causation</td><td>Apple eaters get fewer colds</td></tr>
</table>
<div class="trap">⚠️ In inference questions, the answer that sounds most important or interesting is usually a trap. The right answer is often dull and narrow.</div>`,

rc: `
<h3>How to read the passage</h3>
<ul>
  <li>Read for <b>structure</b>, not detail: what's each paragraph's job? (Background, a view, a challenge, evidence, the author's position.)</li>
  <li>Track <b>viewpoints</b>: who believes what, and where does the author stand?</li>
  <li>Notice pivot words: however, but, yet, although, moreover, in fact.</li>
  <li>Spend about 2–3 minutes on the passage, then about 1 minute per question. You can scroll back; don't memorize.</li>
</ul>

<h3>Question types</h3>
<table>
  <tr><th>Type</th><th>How to answer</th></tr>
  <tr><td>Main idea / primary purpose</td><td>Covers the whole passage, not one paragraph. Watch the verb: describe, argue, challenge, explain</td></tr>
  <tr><td>Detail ("according to the passage")</td><td>Find the line; the answer is usually a paraphrase</td></tr>
  <tr><td>Inference ("suggests", "implies")</td><td>A small step beyond the text, supported by specific lines</td></tr>
  <tr><td>Function ("in order to")</td><td>Why is this example or sentence there? Read the sentences around it</td></tr>
  <tr><td>Author's attitude</td><td>Usually moderate: "cautiously skeptical", "qualified support"</td></tr>
  <tr><td>Application / strengthen / weaken</td><td>Treat it like Critical Reasoning using the passage's argument</td></tr>
</table>

<h3>Wrong-answer patterns</h3>
<ul>
  <li><b>Too broad / too narrow</b> for a main-idea question.</li>
  <li><b>Extreme</b>: "no effect at all", "always", "proven entirely wrong".</li>
  <li><b>Distortion</b>: the right words, but a changed meaning (reverses who believes what).</li>
  <li><b>Out of scope</b>: true in the real world, but not in the passage.</li>
</ul>
<div class="trap">⚠️ Always go back to the passage to confirm. Many wrong answers use exact phrases from the passage in a wrong way.</div>`,

ds: `
<h3>The five answer choices (memorize them)</h3>
<table>
  <tr><th></th><th>Meaning</th></tr>
  <tr><td><b>A</b></td><td>Statement (1) alone is sufficient; (2) alone is not</td></tr>
  <tr><td><b>B</b></td><td>Statement (2) alone is sufficient; (1) alone is not</td></tr>
  <tr><td><b>C</b></td><td>Both together are sufficient; neither alone is</td></tr>
  <tr><td><b>D</b></td><td>Each alone is sufficient</td></tr>
  <tr><td><b>E</b></td><td>Even together, not sufficient</td></tr>
</table>
<div class="formula">Grid: (1) sufficient? → A or D. (1) not sufficient? → B, C or E. Then test (2) alone, then together if needed.</div>

<h3>Method</h3>
<ul>
  <li><b>Rephrase the question</b> first: "Is x/y &gt; 1?" with y &gt; 0 becomes "Is x &gt; y?".</li>
  <li><b>Sufficient</b> means exactly one answer. For a yes/no question, a definite <b>"no" is sufficient</b>.</li>
  <li>Evaluate each statement <b>alone</b> first. Forget statement (1) while you judge statement (2).</li>
  <li>You don't have to find the value, just know whether you could.</li>
  <li>Test cases: to prove insufficiency, find one case giving "yes" and one giving "no". Try 0, negatives, fractions, and big numbers.</li>
</ul>

<h3>Classic traps</h3>
<ul>
  <li>Two equations that are really the same (2x + 3y = 12 and 4x + 6y = 24) → not two equations.</li>
  <li>x² = 4x: x could be 0. a² = 16: a could be −4.</li>
  <li>Percent change needs both the change and the base.</li>
  <li>"C trap": the statements look like they belong together, but one alone is already enough.</li>
  <li>"E trap": together they feel like a lot of information but still allow two answers (profit vs loss, overlapping sets without "neither").</li>
  <li>Statements never contradict each other.</li>
</ul>
<div class="trap">⚠️ Don't carry information from statement (1) into your analysis of statement (2) alone. It's the most common DS mistake.</div>`,

ta: `
<h3>The format</h3>
<ul>
  <li>A sortable table (click a column heading) and three statements, each answered Yes/No or True/False. All three must be right to get credit.</li>
  <li>Read the table's title, column headings and units before the statements.</li>
</ul>

<h3>Strategy</h3>
<ul>
  <li><b>Sort</b> the relevant column for "highest", "lowest", "median", "rank" questions. It's faster than scanning.</li>
  <li>Median of 6 or 8 rows: average the two middle values after sorting.</li>
  <li>Compute rates when counts differ: orders per staff member, revenue per unit, on-time orders = rate × orders.</li>
  <li>"Every", "exactly" and "only" statements: look for one counterexample.</li>
  <li>Estimate first; only calculate precisely when it's close (like 67.6% vs two-thirds).</li>
  <li>Use the on-screen calculator for messy division, but don't use it for everything.</li>
</ul>
<div class="trap">⚠️ A higher percentage of a smaller base can be a smaller number: 97% of 6,300 is less than 91% of 8,900.</div>`,

gi: `
<h3>The format</h3>
<ul>
  <li>A chart (bar, line, scatter, pie…) and statements with drop-down menus. Choose the option that makes each statement accurate.</li>
  <li>Read the title, axes, units, scale and legend first. Does the axis start at zero? Are values in thousands?</li>
</ul>

<h3>Common tasks</h3>
<div class="formula">Percent change = (new − old) ÷ old · Share of total = part ÷ sum of all parts</div>
<ul>
  <li><b>Largest change</b> vs <b>largest percent change</b> can be different: the same increase is a bigger percent from a smaller base.</li>
  <li>Averages from a chart: add the bars/points and divide, or eyeball a level line and balance the differences.</li>
  <li>"Closest to" and "approximately": estimate, then pick the nearest option. Don't over-calculate.</li>
  <li>Count carefully: "increased in how many years" means year-to-year changes (one fewer than the points).</li>
  <li>Percentage points vs percent: a rate falling from 5.2% to 4.1% fell 1.1 points, about 21%.</li>
</ul>
<div class="trap">⚠️ Check each drop-down separately against the graph. They're scored together, so one careless reading costs the whole question.</div>`,

tpa: `
<h3>The format</h3>
<ul>
  <li>One scenario, a table of options, and two columns. Pick one option per column. Both must be right. The same option can sometimes be correct for both columns.</li>
  <li>Can be quantitative (solve for two values), verbal (strengthen/weaken, assumption/conclusion) or logic (scheduling).</li>
</ul>

<h3>Strategy</h3>
<ul>
  <li>Read the column headings carefully: they tell you exactly what each selection must satisfy.</li>
  <li>Quant: set up two equations. Often one value unlocks the other, so solve for the easier one first.</li>
  <li>Use the options: plug listed values into the conditions (e.g., which pair gives 1/a + 1/b = 1/4?). Check extra conditions like a &lt; b.</li>
  <li>Verbal: treat each column like its own Critical Reasoning question. Most options are distractors that do neither.</li>
  <li>Logic: list the fixed rules, place the most restricted item first, and test the few possible cases.</li>
</ul>
<div class="trap">⚠️ Several pairs might satisfy one condition. Check every condition in the prompt before you commit.</div>`,

msr: `
<h3>The format</h3>
<ul>
  <li>Two or three tabs of information (emails, tables, memos, charts) and usually 3 questions on the same sources. Questions can be multiple choice or Yes/No tables.</li>
  <li>The tabs stay with you for every question in the set, so skim them first rather than memorizing them.</li>
</ul>

<h3>Strategy</h3>
<ul>
  <li>First pass: note what each tab is for (rules, data, exceptions). The key twist is often in the last tab.</li>
  <li>Combine sources: the email gives the goal, the table gives the numbers, the policy gives the rules or discounts.</li>
  <li>Apply every rule: deadlines, capacity limits, discounts over a threshold, "only if" conditions.</li>
  <li>Watch for information that changes how you read the data (a setup error, a promotion shown to one group).</li>
  <li>For Yes/No tables, judge each row independently.</li>
</ul>
<div class="trap">⚠️ Budget this set as a unit: the first question takes longest (reading the tabs), and the later ones go faster.</div>`
};
