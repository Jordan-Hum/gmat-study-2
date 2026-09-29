// Data Insights questions.
//   Data Sufficiency:        { q: "question\n(1) …\n(2) …", a: "A"–"E", e }
//   Table Analysis:          { s: set with a table, q, tf: [[statement, true/false], …], tfl: [label if true, label if false], e }
//   Graphics Interpretation: { s: set with a chart, q: "text with [1] and [2]", dd: [{ o: [choices], a: index }, …], e }
//   Two-Part Analysis:       { q, tpa: { cols: [col 1, col 2], rows: [choices], a: [row for col 1, row for col 2] }, e }
//   Multi-Source Reasoning:  { s: set with tabs, q, o: [correct, wrong…] } or a tf question, e }
window.QB = window.QB || {};
window.SETS = window.SETS || {};

// ---------- Data Sufficiency ----------
QB.ds = [
  { q: "What is the value of x?\n(1) 2x + 3y = 12\n(2) 4x + 6y = 24", a: "E",
    e: "Statement (2) is just statement (1) multiplied by 2, so together they are still one equation in two unknowns. x could be 6 (y = 0) or 3 (y = 2). E." },
  { q: "If n is an integer, is n even?\n(1) n² is even.\n(2) 3n is even.", a: "D",
    e: "(1) An odd number squared is odd, so n² even means n is even. Sufficient. (2) 3 is odd, so 3n is even only when n is even. Sufficient. D." },
  { q: "What is the value of the integer k?\n(1) 5 < k < 8\n(2) k is a prime number.", a: "C",
    e: "(1) k could be 6 or 7. (2) Many primes. Together: of 6 and 7, only 7 is prime. C." },
  { q: "Is x > y?\n(1) x − y > −2\n(2) x² > y²", a: "E",
    e: "Test cases that satisfy both: x = 3, y = 2 (x > y: yes) and x = −3, y = −2 (x − y = −1 > −2, and 9 > 4, but x > y: no). Different answers, so E." },
  { q: "What is the average (arithmetic mean) of a, b and c?\n(1) a + b = 10\n(2) c = 8", a: "C",
    e: "The average needs the sum a + b + c. Neither statement gives it alone; together the sum is 18 and the average is 6. C." },
  { q: "A store sold 120 shirts yesterday, and each shirt was either blue or not blue. How many blue shirts did it sell?\n(1) The ratio of blue shirts sold to shirts sold that were not blue was 1 : 3.\n(2) 90 of the shirts sold were not blue.", a: "D",
    e: "(1) Blue = 1/4 of 120 = 30. Sufficient. (2) Blue = 120 − 90 = 30. Sufficient. D." },
  { q: "Is the positive integer n divisible by 6?\n(1) n is divisible by 3.\n(2) n is divisible by 4.", a: "C",
    e: "(1) 3 (no) or 6 (yes). (2) 4 (no) or 12 (yes). Together n is divisible by 3 and by 4, so by 12, and therefore by 6. C." },
  { q: "What is the value of x + y?\n(1) 3x + 3y = 21\n(2) x − y = 3", a: "A",
    e: "(1) Divide by 3: x + y = 7. Sufficient, even though x and y themselves are unknown. (2) gives only the difference. A." },
  { q: "Is the positive integer p a prime number?\n(1) p > 2\n(2) p = 3q, where q is an integer greater than 1.", a: "B",
    e: "(1) 3 is prime, 4 isn't. (2) p has the factors 3 and q (both greater than 1), so p isn't prime: a definite \"no\", which is sufficient. B." },
  { q: "What percent of the employees at Company X are women?\n(1) There are 40 more men than women at Company X.\n(2) Company X has 200 employees.", a: "C",
    e: "(1) A difference without a total isn't enough. (2) A total without a split isn't enough. Together: w + (w + 40) = 200, so w = 80, which is 40%. C." },
  { q: "If x and y are positive, is x/y > 1?\n(1) x > y\n(2) x − y > 0", a: "D",
    e: "Since y is positive, x/y > 1 is the same as x > y. (1) says that directly; (2) is the same statement rearranged. D." },
  { q: "What is the remainder when the positive integer n is divided by 5?\n(1) When n is divided by 10, the remainder is 7.\n(2) When n is divided by 15, the remainder is 12.", a: "D",
    e: "(1) n = 10k + 7; 10k is a multiple of 5 and 7 leaves 2, so the remainder is 2. (2) n = 15k + 12; 15k is a multiple of 5 and 12 leaves 2. Both sufficient: D." },
  { q: "What is the value of the two-digit positive integer n?\n(1) The sum of the digits of n is 9.\n(2) The tens digit of n is twice its units digit.", a: "C",
    e: "(1) 18, 27, 36, … (2) 21, 42, 63, 84. Together only 63 has digits summing to 9. C." },
  { q: "Did Maria's salary increase by more than 10% from 2022 to 2023?\n(1) Maria's salary in 2023 was $5,000 higher than her salary in 2022.\n(2) Maria's salary in 2022 was $45,000.", a: "C",
    e: "A percent change needs both the change and the starting value. Together: 5,000/45,000 ≈ 11.1% > 10%, so yes. C." },
  { q: "Is x negative?\n(1) x³ < 0\n(2) x² > 0", a: "A",
    e: "(1) A cube keeps the sign, so x < 0. Sufficient. (2) only says x ≠ 0. A." },
  { q: "What is the value of a?\n(1) a² = 16\n(2) a³ = −64", a: "B",
    e: "(1) a = 4 or −4. (2) Only −4 cubed is −64. B." },
  { q: "What is the median of the five numbers 3, 8, x, 10 and 12?\n(1) x > 12\n(2) x < 3", a: "D",
    e: "(1) In order: 3, 8, 10, 12, x → median 10. (2) In order: x, 3, 8, 10, 12 → median 8. Each gives one value: D. (A statement is sufficient if it fixes the answer, even if the two statements give different answers.)" },
  { q: "In a class of 30 students, how many play both soccer and tennis?\n(1) 18 students play soccer and 15 play tennis.\n(2) 4 students play neither sport.", a: "C",
    e: "(1) Both could be anywhere from 3 to 15. (2) alone says nothing about the split. Together: 30 − 4 = 26 = 18 + 15 − both, so both = 7. C." },
  { q: "Is xy > 0?\n(1) x/y > 0\n(2) x + y > 0", a: "A",
    e: "(1) x/y > 0 means x and y have the same sign, so xy > 0. Sufficient. (2) x = 3, y = −1 (xy < 0) or x = y = 1 (xy > 0). A." },
  { q: "A car-rental company charges a fixed daily fee plus a charge for each kilometer driven. What is the charge per kilometer?\n(1) Driving 50 more kilometers on any rental adds $15 to the cost.\n(2) The daily fee is $40.", a: "A",
    e: "(1) 50 km cost $15, so $0.30 per km. Sufficient. (2) The daily fee tells you nothing about the per-km charge. A." },
  { q: "Is |x − 2| < 3?\n(1) −1 < x < 2\n(2) 1 < x < 5", a: "D",
    e: "|x − 2| < 3 means −1 < x < 5. Every x in (1) is in that range, and so is every x in (2). Both sufficient: D." },
  { q: "A jar contains only red and blue marbles. If one marble is drawn at random, what is the probability that it is red?\n(1) The jar contains 12 blue marbles.\n(2) The jar contains twice as many red marbles as blue marbles.", a: "B",
    e: "(2) Red : blue = 2 : 1, so P(red) = 2/3, whatever the total. Sufficient. (1) gives no information about red. B." },
  { q: "Is the integer n odd?\n(1) n + 3 is even.\n(2) n² + n is even.", a: "A",
    e: "(1) n + 3 even → n is odd. Sufficient. (2) n² + n = n(n + 1) is even for every integer, so it tells you nothing. A." },
  { q: "What is the value of x?\n(1) x² = 4x\n(2) 2x + 3 = 11", a: "B",
    e: "(1) x² − 4x = 0 → x = 0 or 4. Don't divide by x without knowing x ≠ 0! (2) x = 4. B." },
  { q: "Working together at their constant rates, Machines A and B fill an order in 6 hours. How many hours would Machine A take to fill the order alone?\n(1) Machine B alone would take 10 hours.\n(2) Machine A works 1.5 times as fast as Machine B.", a: "D",
    e: "(1) A's rate = 1/6 − 1/10 = 1/15, so 15 hours. (2) a + b = 1/6 with a = 1.5b → 2.5b = 1/6 → b = 1/15, a = 1/10: 10 hours. Each is sufficient: D." },
  { q: "Every person at a concert bought exactly one ticket. How many people attended?\n(1) Adult tickets cost $20, child tickets cost $10, and ticket revenue was $4,000.\n(2) Twice as many adults as children attended.", a: "C",
    e: "(1) 20a + 10c = 4,000 has many solutions. (2) a ratio only. Together: 40c + 10c = 4,000 → c = 80, a = 160, total 240. C." },
  { q: "Is x² > x?\n(1) x < 0\n(2) x > 1", a: "D",
    e: "x² > x is true when x < 0 or x > 1. (1) If x is negative, x² is positive, so yes. (2) yes. D." },
  { q: "Sam's average score on four tests was 85. What was his score on the fourth test?\n(1) His average on the first three tests was 82.\n(2) His fourth score was 15 points higher than his first.", a: "A",
    e: "(1) Total 340; first three 246; fourth 94. Sufficient. (2) relates two unknown scores. A." },
  { q: "What is the value of 3^x · 9^y?\n(1) x + 2y = 5\n(2) x = 1", a: "A",
    e: "3^x · 9^y = 3^x · 3^(2y) = 3^(x + 2y). (1) gives 3^5 = 243. Sufficient. (2) leaves y unknown. A." },
  { q: "Is a > b?\n(1) a + b = 10\n(2) a − b = 2", a: "B",
    e: "(2) a − b = 2 > 0 means a > b. Sufficient. (1) a = 6, b = 4 or a = 4, b = 6. B." },
  { q: "A company's profit is its revenue minus its costs. Did the company's profit increase from 2022 to 2023?\n(1) Its revenue increased by 10%.\n(2) Its costs increased by 10%.", a: "E",
    e: "Together, profit = 1.1R − 1.1C = 1.1 × (last year's profit). If last year's profit was positive, it rose; if the company had a loss, the loss grew (profit fell). E." },
  { q: "What is the value of the integer n?\n(1) 3 < n < 8\n(2) n is odd.", a: "E",
    e: "(1) n = 4, 5, 6 or 7. Together n could be 5 or 7. E." },
  { q: "In a group of 50 people, how many own both a car and a bike?\n(1) 30 own a car.\n(2) 25 own a bike.", a: "E",
    e: "Together: both = 30 + 25 − (number owning at least one). With no information about how many own neither, both could be anywhere from 5 to 25. E." },
  { q: "If a and b are integers, is ab even?\n(1) a is odd.\n(2) b is even.", a: "B",
    e: "(2) Any integer times an even number is even. Sufficient. (1) depends on b. B." },
  { q: "A shop sells pens only in packs of 3 and packs of 5. Ali bought exactly 23 pens. How many packs of 5 did he buy?\n(1) He bought more than 2 packs in total.\n(2) He bought exactly 1 pack of 3.", a: "B",
    e: "3a + 5b = 23 has two solutions in non-negative integers: 6 packs of 3 + 1 pack of 5, or 1 pack of 3 + 4 packs of 5. (1) Both have more than 2 packs. (2) picks the second: 4 packs of 5. B." },
  { q: "Did more than half of the members of a club vote for Proposal P?\n(1) More members voted for P than against it.\n(2) Each member voted for P, voted against it, or abstained, and 40% of members abstained.", a: "E",
    e: "Together, for + against = 60% and for > against, so \"for\" is more than 30%, but it could be 35% (no) or 55% (yes). E." },
  { q: "Did the train arrive in Lyon before noon?\n(1) The train left Paris at 9:15 a.m.\n(2) The train arrived in Lyon 20 minutes after another train that arrived there at 11:30 a.m.", a: "B",
    e: "(2) It arrived at 11:50 a.m., before noon. Sufficient. (1) The travel time is unknown. B." }
];

// ---------- Table Analysis ----------
const TA_TF = "For each of the following statements, select True if the statement is true based on the information in the table. Otherwise, select False.";
const TA_YN = "For each of the following statements, select Yes if the statement can be shown to be true based on the information in the table. Otherwise, select No.";

SETS["ta-regions"] = {
  text: "The table shows units sold, 2024 revenue and number of stores for a retailer's six sales regions.",
  table: { head: ["Region", "Units 2023", "Units 2024", "Revenue 2024 ($ thousands)", "Stores"], rows: [
    ["North", 1200, 1500, 900, 12], ["South", 1800, 1700, 1020, 15], ["East", 950, 1140, 684, 8],
    ["West", 1400, 1400, 910, 10], ["Central", 700, 910, 455, 7], ["Pacific", 1100, 990, 693, 9]] }
};
SETS["ta-training"] = {
  text: "The table shows data for seven departments at a company: number of employees, percent who completed a training program, average satisfaction score (1–10) and training budget per employee.",
  table: { head: ["Department", "Employees", "Completed training (%)", "Avg. satisfaction", "Budget per employee ($)"], rows: [
    ["Sales", 120, 75, 7.2, 400], ["Engineering", 200, 60, 8.1, 550], ["Finance", 40, 90, 6.8, 300],
    ["Marketing", 60, 85, 7.9, 450], ["Operations", 150, 50, 6.5, 250], ["HR", 25, 100, 8.4, 350], ["Legal", 20, 95, 7.0, 500]] }
};
SETS["ta-funds"] = {
  text: "The table shows eight investment funds: their return over the last year, their average annual return over five years, their expense ratio, and the assets they manage.",
  table: { head: ["Fund", "1-year return (%)", "5-year avg. return (%)", "Expense ratio (%)", "Assets ($ millions)"], rows: [
    ["Alpha", 12.4, 8.1, 0.45, 820], ["Beacon", 9.8, 9.3, 0.20, 1450], ["Cedar", 15.2, 6.7, 0.95, 310], ["Delta", -2.1, 7.4, 0.60, 540],
    ["Elm", 7.5, 10.2, 0.15, 2100], ["Falcon", 11.0, 8.8, 0.75, 460], ["Granite", 4.3, 5.9, 0.30, 990], ["Harbor", 13.1, 9.9, 0.50, 1200]] }
};
SETS["ta-warehouses"] = {
  text: "The table shows March results for a company's six warehouses.",
  table: { head: ["Warehouse", "Orders shipped", "On time (%)", "Avg. cost per order ($)", "Staff"], rows: [
    ["Atlanta", 12400, 96, 8.20, 62], ["Boston", 8900, 91, 9.10, 48], ["Chicago", 15600, 88, 7.40, 80],
    ["Dallas", 11200, 94, 6.90, 55], ["Denver", 6300, 97, 9.80, 35], ["Seattle", 9800, 89, 8.60, 49]] }
};
SETS["ta-cities"] = {
  text: "The table shows data for seven cities: population, median monthly rent, median annual household income, and unemployment rate.",
  table: { head: ["City", "Population (thousands)", "Median rent ($/month)", "Median income ($ thousands/year)", "Unemployment (%)"], rows: [
    ["Arden", 420, 1350, 58, 4.1], ["Bexley", 1150, 1900, 72, 3.6], ["Carlow", 260, 980, 45, 5.8], ["Dunmore", 780, 1600, 66, 4.4],
    ["Everton", 530, 1200, 51, 6.2], ["Fairview", 340, 1450, 69, 3.2], ["Glenroy", 910, 1750, 61, 5.0]] }
};

QB.ta = [
  { s: "ta-regions", q: TA_TF, tfl: ["True", "False"],
    tf: [["The region with the greatest increase in units sold from 2023 to 2024 also had the greatest percent increase.", false],
         ["Exactly two regions sold fewer units in 2024 than in 2023.", true],
         ["In 2024, revenue per unit sold was highest in the West region.", false]],
    e: "1. Greatest increase: North (+300, which is +25%). Greatest percent increase: Central (+210 on 700 = +30%). False.\n2. South (−100) and Pacific (−110) fell; West was flat. True.\n3. Revenue per unit: North, South and East $0.60 thousand; West 0.65; Central 0.50; Pacific 693/990 = 0.70. Pacific is highest. False." },
  { s: "ta-regions", q: TA_YN, tfl: ["Yes", "No"],
    tf: [["The median number of stores per region is 9.5.", true],
         ["In 2024, the South region sold more units per store than any other region.", false],
         ["Total units sold across the six regions in 2024 was greater than 7,500.", true]],
    e: "1. Stores in order: 7, 8, 9, 10, 12, 15. Median = (9 + 10)/2 = 9.5. Yes.\n2. Units per store in 2024: North 125, South ≈ 113, East 142.5, West 140, Central 130, Pacific 110. East is highest. No.\n3. 1,500 + 1,700 + 1,140 + 1,400 + 910 + 990 = 7,640. Yes." },
  { s: "ta-training", q: TA_YN, tfl: ["Yes", "No"],
    tf: [["More Engineering employees completed the training than Sales and Marketing employees combined.", false],
         ["The department with the highest completion rate also has the highest average satisfaction score.", true],
         ["Every department in which at least 80% of employees completed the training has an average satisfaction score above 7.0.", false]],
    e: "1. Engineering: 60% of 200 = 120. Sales 75% of 120 = 90, plus Marketing 85% of 60 = 51: 141. No.\n2. HR has both the highest completion rate (100%) and the highest satisfaction (8.4). Yes.\n3. Departments at 80% or more: Finance (6.8), Marketing, HR, Legal (exactly 7.0). Finance and Legal aren't above 7.0. No." },
  { s: "ta-training", q: TA_TF, tfl: ["True", "False"],
    tf: [["Operations has the smallest total training budget of any department.", false],
         ["More than two-thirds of the employees in the seven departments completed the training.", true],
         ["The department with the largest budget per employee also has the most employees.", true]],
    e: "1. Total budgets: Operations 150 × 250 = $37,500, but HR is 25 × 350 = $8,750 (smallest). False.\n2. Completed: 90 + 120 + 36 + 51 + 75 + 25 + 19 = 416 of 615 employees ≈ 67.6%, just above 2/3 (66.7%). True.\n3. Engineering has both the largest budget per employee ($550) and the most employees (200). True." },
  { s: "ta-funds", q: TA_YN, tfl: ["Yes", "No"],
    tf: [["The fund with the highest 1-year return has the lowest 5-year average return.", false],
         ["Every fund with an expense ratio below 0.50% has a 5-year average return above 8%.", false],
         ["The median of the eight funds' assets is greater than $700 million.", true]],
    e: "1. Highest 1-year return: Cedar (15.2%). Lowest 5-year average: Granite (5.9%). No.\n2. Below 0.50%: Alpha (8.1), Beacon (9.3), Elm (10.2) and Granite (5.9). Granite fails. No.\n3. Assets in order: 310, 460, 540, 820, 990, 1,200, 1,450, 2,100. Median = (820 + 990)/2 = 905. Yes." },
  { s: "ta-funds", q: TA_TF, tfl: ["True", "False"],
    tf: [["Exactly three of the funds had a 1-year return higher than their 5-year average return.", false],
         ["The two funds with the most assets also have the two lowest expense ratios.", true],
         ["Harbor's 1-year return was more than 10 percentage points higher than Delta's.", true]],
    e: "1. Alpha, Beacon, Cedar, Falcon and Harbor all beat their 5-year averages: five funds. False.\n2. Most assets: Elm ($2,100M) and Beacon ($1,450M); lowest expense ratios: Elm (0.15%) and Beacon (0.20%). True.\n3. 13.1 − (−2.1) = 15.2 percentage points. True. (Sort the columns to check questions like these quickly.)" },
  { s: "ta-warehouses", q: TA_YN, tfl: ["Yes", "No"],
    tf: [["The warehouse that shipped the most orders had the lowest on-time percentage.", true],
         ["Dallas shipped more orders per staff member than Chicago did.", true],
         ["Denver shipped more orders on time than Boston did.", false]],
    e: "1. Chicago shipped the most (15,600) and had the lowest on-time rate (88%). Yes.\n2. Dallas: 11,200/55 ≈ 204 per staff member; Chicago: 15,600/80 = 195. Yes.\n3. Denver: 97% of 6,300 ≈ 6,111 on time; Boston: 91% of 8,900 ≈ 8,099. A higher rate on a smaller base loses. No." },
  { s: "ta-cities", q: TA_YN, tfl: ["Yes", "No"],
    tf: [["In every city, 12 months of median rent is less than 35% of median annual income.", true],
         ["The city with the highest unemployment rate also has the lowest median income.", false],
         ["The three most populous cities all have median rents above $1,500 a month.", true]],
    e: "1. Check the closest case, Glenroy: 12 × 1,750 = 21,000, and 21,000/61,000 ≈ 34.4%. Every other city is lower (Bexley ≈ 31.7%). Yes.\n2. Highest unemployment: Everton (6.2%). Lowest income: Carlow ($45K). No.\n3. Most populous: Bexley ($1,900), Glenroy ($1,750), Dunmore ($1,600). Yes." }
];

// ---------- Graphics Interpretation ----------
const GI_Q = "Use the drop-down menus to complete each statement so that it is accurate based on the information provided.\n\n";
SETS["gi-visitors"] = {
  text: "The graph shows the number of visitors to a company's website each month for the first half of the year.",
  chart: { type: "bar", title: "Monthly website visitors (thousands)", x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    series: [{ name: "Visitors", v: [42, 48, 45, 60, 72, 66] }], labels: true, yLabel: "Thousands" }
};
SETS["gi-prices"] = {
  text: "The graph shows the average selling price per unit of two products, A and B, from 2019 to 2024.",
  chart: { type: "line", title: "Average price per unit ($)", x: ["2019", "2020", "2021", "2022", "2023", "2024"],
    series: [{ name: "Product A", v: [20, 22, 25, 24, 28, 30] }, { name: "Product B", v: [30, 29, 27, 26, 27, 25] }], labels: true, yLabel: "Dollars" }
};
SETS["gi-enrollment"] = {
  text: "The graph shows the number of students enrolled in five programs at a college in fall 2023 and fall 2024.",
  chart: { type: "bar", title: "Enrollment by program", x: ["Business", "Nursing", "Engineering", "Arts", "Education"],
    series: [{ name: "Fall 2023", v: [400, 250, 300, 150, 200] }, { name: "Fall 2024", v: [460, 300, 270, 150, 180] }], labels: true, yLabel: "Students" }
};
SETS["gi-unemployment"] = {
  text: "The graph shows a region's quarterly unemployment rate over two years.",
  chart: { type: "line", title: "Unemployment rate (%)", x: ["Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24"],
    series: [{ name: "Rate", v: [5.2, 5.0, 4.8, 4.9, 4.6, 4.4, 4.5, 4.1] }], labels: true, min: 3, max: 5.5, yLabel: "Percent" }
};
SETS["gi-survey"] = {
  text: "A survey asked 2,500 employees which work arrangement they prefer. Each respondent chose exactly one option. The graph shows the percent of respondents who chose each option.",
  chart: { type: "bar", title: "Preferred work arrangement (% of respondents)", x: ["Fully remote", "Hybrid", "Fully in office", "No preference"],
    series: [{ name: "Percent", v: [28, 47, 19, 6] }], labels: true, yLabel: "Percent" }
};

QB.gi = [
  { s: "gi-visitors", q: GI_Q + "The greatest percent increase in visitors from one month to the next occurred from [1].\n\nAverage monthly visitors over the six months were closest to [2] thousand.",
    dd: [{ o: ["January to February", "March to April", "April to May", "May to June"], a: 1 }, { o: ["50", "52", "56", "60"], a: 2 }],
    e: "Increases: Jan→Feb +6 (≈14%), Mar→Apr +15 (≈33%), Apr→May +12 (20%); Feb→Mar and May→Jun are decreases. Average = (42 + 48 + 45 + 60 + 72 + 66)/6 = 333/6 = 55.5, closest to 56." },
  { s: "gi-visitors", q: GI_Q + "To the nearest 5 percent, visitors in June were [1] percent higher than in January.\n\nThe number of months in which visitors were above the six-month average was [2].",
    dd: [{ o: ["45", "55", "60", "65"], a: 1 }, { o: ["2", "3", "4", "5"], a: 1 }],
    e: "(66 − 42)/42 = 24/42 ≈ 57%, which rounds to 55% to the nearest 5. The average is 55.5, and April (60), May (72) and June (66) are above it: 3 months." },
  { s: "gi-prices", q: GI_Q + "The first year in which Product A's price was higher than Product B's was [1].\n\nFrom 2019 to 2024, Product A's price increased by [2].",
    dd: [{ o: ["2021", "2022", "2023", "2024"], a: 2 }, { o: ["25%", "33%", "50%", "150%"], a: 2 }],
    e: "A first exceeds B in 2023 ($28 vs. $27). A went from $20 to $30: an increase of 10/20 = 50%. (150% is 30 as a percent of 20.)" },
  { s: "gi-prices", q: GI_Q + "The difference between the two products' prices was greatest in [1].\n\nProduct B's price fell in [2] of the five year-to-year changes shown.",
    dd: [{ o: ["2019", "2021", "2023", "2024"], a: 0 }, { o: ["2", "3", "4", "5"], a: 2 }],
    e: "Differences: 2019 $10, 2020 $7, 2021 $2, 2022 $2, 2023 $1, 2024 $5. Greatest in 2019. B fell in 2020, 2021, 2022 and 2024 and rose in 2023: 4 of 5." },
  { s: "gi-enrollment", q: GI_Q + "The program with the greatest percent increase in enrollment from 2023 to 2024 was [1].\n\nTotal enrollment in the five programs changed by approximately [2].",
    dd: [{ o: ["Business", "Nursing", "Engineering", "Education"], a: 1 }, { o: ["−5%", "+2%", "+5%", "+10%"], a: 2 }],
    e: "Business +60 (+15%), Nursing +50 (+20%), Engineering −10%, Arts 0%, Education −10%. Nursing has the greatest percent increase even though Business added more students. Totals: 1,300 → 1,360, a rise of 60/1,300 ≈ 4.6%, about +5%." },
  { s: "gi-enrollment", q: GI_Q + "In fall 2024, Business accounted for about [1] of total enrollment in the five programs.\n\nThe number of programs whose enrollment fell from 2023 to 2024 was [2].",
    dd: [{ o: ["25%", "30%", "34%", "40%"], a: 2 }, { o: ["1", "2", "3", "4"], a: 1 }],
    e: "460/1,360 ≈ 33.8%, about 34%. Enrollment fell in Engineering (300 → 270) and Education (200 → 180); Arts was unchanged. That's 2 programs." },
  { s: "gi-unemployment", q: GI_Q + "The largest quarter-to-quarter decrease in the unemployment rate occurred from [1].\n\nOver the eight quarters shown, the rate fell by about [2] of its starting value.",
    dd: [{ o: ["Q1 '23 to Q2 '23", "Q4 '23 to Q1 '24", "Q2 '24 to Q3 '24", "Q3 '24 to Q4 '24"], a: 3 }, { o: ["1.1%", "11%", "21%", "27%"], a: 2 }],
    e: "Decreases: 0.2, 0.2, (rise 0.1), 0.3, 0.2, (rise 0.1), 0.4. The largest is Q3 '24 → Q4 '24 (4.5 → 4.1). The rate fell 1.1 points from 5.2, and 1.1/5.2 ≈ 21% of its starting value. (1.1% confuses percentage points with percent.)" },
  { s: "gi-survey", q: GI_Q + "Of the 2,500 respondents, [1] preferred a hybrid arrangement.\n\nRespondents who preferred a hybrid arrangement outnumbered those who preferred to be fully in the office by a ratio of about [2].",
    dd: [{ o: ["470", "1,175", "1,250", "1,425"], a: 1 }, { o: ["2 to 1", "5 to 2", "3 to 1", "4 to 1"], a: 1 }],
    e: "47% of 2,500 = 1,175. Hybrid to fully in office = 47 : 19 ≈ 2.47 : 1, which is about 5 to 2." }
];

// ---------- Two-Part Analysis ----------
QB.tpa = [
  { q: "A bakery sells muffins for $3 each and cookies for $2 each. On Monday it sold 40 items in total for $110.\n\nSelect the number of muffins sold and the number of cookies sold. Make only two selections, one in each column.",
    tpa: { cols: ["Muffins", "Cookies"], rows: ["10", "15", "20", "25", "30", "35"], a: [4, 0] },
    e: "m + c = 40 and 3m + 2c = 110. Substituting c = 40 − m: 3m + 80 − 2m = 110 → m = 30, c = 10. Check: 90 + 20 = 110 ✓." },
  { q: "The numbers x and y satisfy x + y = 11 and xy = 24, and x > y.\n\nSelect the value of x and the value of y. Make only two selections, one in each column.",
    tpa: { cols: ["x", "y"], rows: ["2", "3", "4", "6", "8", "12"], a: [4, 1] },
    e: "Two numbers with sum 11 and product 24 are the roots of t² − 11t + 24 = 0 → (t − 8)(t − 3) = 0. Since x > y, x = 8 and y = 3." },
  { q: "City official: \"Visits to our public library fell by 20% after the city cut the library's weekend hours. To bring visits back up, the city should restore the weekend hours.\"\n\nSelect the statement that would most strengthen the official's argument and the statement that would most weaken it. Make only two selections, one in each column.",
    tpa: { cols: ["Strengthen", "Weaken"], rows: [
      "Most people who stopped visiting said weekends were the only time they could come.",
      "Library visits fell by a similar amount in nearby cities that did not cut their hours.",
      "The library recently added a number of new computers for public use.",
      "Weekend staff cost the library more per hour than weekday staff do.",
      "The library's collection of books has grown each year for a decade.",
      "Many regular visitors come to the library on weekday evenings."], a: [0, 1] },
    e: "Strengthen: if lost visitors could only come on weekends, the cut explains the drop and restoring hours should bring them back. Weaken: if visits fell just as much in cities that kept their hours, something else likely caused the drop." },
  { q: "Working alone at their constant rates, pipe A fills a tank in a hours and pipe B fills it in b hours, where a < b. Working together, they fill the tank in 4 hours.\n\nSelect a value for a and a value for b that are consistent with this information. Make only two selections, one in each column.",
    tpa: { cols: ["a", "b"], rows: ["5", "6", "8", "10", "12", "16"], a: [1, 4] },
    e: "1/a + 1/b = 1/4. Try pairs: 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4 ✓. (8 and 8 also works but breaks a < b; 5 would need b = 20, which isn't listed.)" },
  { q: "A company sells a product at price p and pays c to make each unit. Its profit margin, (p − c)/p, is 40%, and its profit per unit, p − c, is $12.\n\nSelect the price p and the unit cost c, in dollars. Make only two selections, one in each column.",
    tpa: { cols: ["Price p", "Unit cost c"], rows: ["12", "18", "20", "24", "30", "36"], a: [4, 1] },
    e: "12/p = 0.40 → p = 30. Then c = 30 − 12 = 18. Check: 12/30 = 40% ✓." },
  { q: "Manager: \"Last year, Tarn Co.'s remote employees took fewer sick days than its office employees. So letting all employees work remotely would make our workforce healthier.\"\n\nSelect the statement that is an assumption the argument requires and the statement that most weakens the argument. Make only two selections, one in each column.",
    tpa: { cols: ["Required assumption", "Weakens"], rows: [
      "Working remotely, rather than some other difference between the groups, explains the difference in sick days.",
      "Remote employees at Tarn Co. often keep working while ill instead of taking a sick day.",
      "Tarn Co. currently has more office employees than it has remote employees.",
      "Some of Tarn Co.'s office employees would prefer to work remotely.",
      "Tarn Co.'s office building was renovated two years ago.",
      "Tarn Co. pays its remote and office employees the same salaries."], a: [0, 1] },
    e: "The argument needs remote work itself to be the cause (negate it and the argument collapses). If remote workers work through illness, fewer sick days doesn't mean better health, which weakens the conclusion." },
  { q: "A chemist wants to make 100 liters of a 40% acid solution by mixing a 25% acid solution with a 50% acid solution.\n\nSelect the number of liters of the 25% solution and of the 50% solution she should use. Make only two selections, one in each column.",
    tpa: { cols: ["25% solution", "50% solution"], rows: ["20", "30", "40", "50", "60", "70"], a: [2, 4] },
    e: "0.25x + 0.50(100 − x) = 40 → 50 − 0.25x = 40 → x = 40 liters of 25%, so 60 liters of 50%. (The mix is closer to 50%, so more of the 50% solution is needed.)" },
  { q: "A café owner is deciding whether to add a drive-through window.\n\nSelect the piece of information that would most support adding the window and the piece that would most support not adding it. Make only two selections, one in each column.",
    tpa: { cols: ["Supports adding", "Supports not adding"], rows: [
      "Most of the café's potential customers pass by in cars during the morning commute.",
      "Building the window would remove half of the café's parking spaces, which are usually full.",
      "The café's coffee is priced about the same as coffee at nearby competitors.",
      "The café's owner has run the business for more than ten years.",
      "The café sells both hot and cold drinks throughout the year.",
      "Several customers have praised the café's pastries in online reviews."], a: [0, 1] },
    e: "Drivers passing by are exactly the customers a drive-through would capture. Losing half of a busy parking lot would cost existing customers. The other statements don't bear on the decision." },
  { q: "The average of two numbers, m and n, is 15, and m is 6 more than twice n.\n\nSelect the value of m and the value of n. Make only two selections, one in each column.",
    tpa: { cols: ["m", "n"], rows: ["6", "8", "12", "18", "22", "24"], a: [4, 1] },
    e: "m + n = 30 and m = 2n + 6 → 3n + 6 = 30 → n = 8, m = 22." },
  { q: "A loan charges simple interest, and nothing is repaid until the end. Two years after it was taken out, the total owed was $5,500; five years after, it was $6,250.\n\nSelect the original amount borrowed and the interest charged each year, in dollars. Make only two selections, one in each column.",
    tpa: { cols: ["Amount borrowed", "Interest per year"], rows: ["200", "250", "4,500", "5,000", "5,250", "5,500"], a: [3, 1] },
    e: "Three years of interest = 6,250 − 5,500 = 750, so $250 a year. Two years of interest = 500, so the amount borrowed = 5,500 − 500 = $5,000." },
  { q: "Four talks (Finance, Law, Math and Physics) are scheduled in four consecutive time slots, numbered 1 to 4. Law is immediately after Finance. Math is in neither slot 1 nor slot 4. Physics is earlier than Math.\n\nSelect the slot for Law and the slot for Physics. Make only two selections, one in each column.",
    tpa: { cols: ["Law", "Physics"], rows: ["Slot 1", "Slot 2", "Slot 3", "Slot 4"], a: [3, 0] },
    e: "Math is in slot 2 or 3. If Math is in 3, Physics is in 1 or 2, leaving slots that aren't consecutive for Finance → Law. So Math is in slot 2, Physics in slot 1, Finance in 3 and Law in 4." },
  { q: "A product's price was increased by x% and the new price was then decreased by y%. The final price was 8% higher than the original price.\n\nSelect values of x and y that are consistent with this information. Make only two selections, one in each column.",
    tpa: { cols: ["x", "y"], rows: ["10", "15", "20", "25", "30", "40"], a: [2, 0] },
    e: "(1 + x/100)(1 − y/100) = 1.08. Try x = 20: 1.2 × (1 − y/100) = 1.08 → 1 − y/100 = 0.9 → y = 10 ✓. No other listed x gives a listed y (e.g., x = 40 needs y ≈ 22.9)." }
];

// ---------- Multi-Source Reasoning ----------
SETS["msr-venue"] = { tabs: [
  { t: "Email", text: [
    "From: Operations manager\nTo: Events team",
    "We're holding our two-day sales conference next spring for 150 attendees. The venue must hold at least 150 people and be no more than 10 km from the airport. Please keep the total cost of the venue, catering and any AV equipment within $30,000. Among the venues that qualify, choose the one with the lowest total cost."] },
  { t: "Venues", text: "Daily rental rates for venues under consideration:",
    table: { head: ["Venue", "Capacity", "Rental per day ($)", "Distance to airport (km)", "AV included?"], rows: [
      ["Lakeview Hall", 180, 6000, 8, "Yes"], ["Riverside Center", 140, 4500, 5, "Yes"], ["Summit Hotel", 220, 9500, 3, "No"],
      ["Oak Pavilion", 160, 5200, 14, "Yes"], ["Grand Plaza", 300, 11000, 6, "Yes"]] } },
  { t: "Costs", text: [
    "Catering costs $45 per attendee per day at every venue.",
    "Where AV equipment isn't included, it can be rented for $1,200 per day.",
    "The conference runs for 2 days."] }
]};
SETS["msr-abtest"] = { tabs: [
  { t: "Memo", text: [
    "For four weeks, visitors to our online store were randomly shown either the current design (A) or a new design (B). Conversion rate = purchases ÷ visitors.",
    "We will adopt design B only if (1) its conversion rate over the test is at least 10% higher than design A's (for example, 3.3% vs. 3.0%), and (2) its average order value is no more than $5 lower than design A's."] },
  { t: "Results", table: { head: ["Week", "Visitors A", "Purchases A", "Visitors B", "Purchases B"], rows: [
    ["1", 5000, 150, 5000, 170], ["2", 4800, 144, 5200, 182], ["3", 5200, 156, 4900, 147], ["4", 5000, 150, 4900, 196]] } },
  { t: "Analyst email", text: [
    "Average order value over the four weeks was $62 for design A and $58 for design B.",
    "One thing to flag: week 4 coincided with a discount banner that, because of a setup error, was shown only to visitors who saw design B."] }
]};
SETS["msr-freight"] = { tabs: [
  { t: "Rates", text: "Freight carriers' rates. Cost = base fee + (rate per kg × weight).",
    table: { head: ["Carrier", "Base fee ($)", "Rate per kg ($)", "Max weight (kg)", "Delivery time (days)"], rows: [
      ["FastFreight", 40, 1.20, 500, 2], ["ValueShip", 25, 0.90, 1000, 5], ["AirPlus", 80, 1.50, 300, 1]] } },
  { t: "Email", text: [
    "From: Logistics manager",
    "This week we need to send a 250 kg shipment to a client who must receive it within 3 days. Next week we'll send a 700 kg shipment with no deadline."] },
  { t: "Policy", text: [
    "Use the cheapest carrier that can meet the shipment's deadline and weight.",
    "All carriers take 10% off the total cost of any shipment heavier than 400 kg."] }
]};
SETS["msr-sleep"] = { tabs: [
  { t: "Article", text: [
    "Researchers asked 400 university students to record their sleep over a semester. Students who averaged at least 7 hours of sleep a night scored higher on final exams, on average, than students who averaged less.",
    "The researchers recommend that universities start morning classes later so that students can sleep more."] },
  { t: "Data", table: { head: ["Average sleep per night", "Students", "Avg. exam score", "With part-time job (%)"], rows: [
    ["Under 6 hours", 80, 68, 55], ["6 to 7 hours", 140, 72, 40], ["7 to 8 hours", 130, 77, 25], ["Over 8 hours", 50, 75, 20]] } },
  { t: "Critic's letter", text: [
    "The study shows only an association. Students with part-time jobs may both sleep less and have less time to study, which could explain their lower scores.",
    "Also, the researchers never tested whether starting classes later would actually lead students to sleep more."] }
]};

QB.msr = [
  { s: "msr-venue", q: "Which venue should the events team choose?",
    o: ["Lakeview Hall", "Riverside Center", "Summit Hotel", "Oak Pavilion", "Grand Plaza"],
    e: "Qualifying venues (capacity ≥ 150, ≤ 10 km): Lakeview, Summit, Grand Plaza. Riverside is too small and Oak Pavilion too far. Catering = 150 × $45 × 2 = $13,500. Totals: Lakeview 12,000 + 13,500 = $25,500; Summit 19,000 + 2,400 AV + 13,500 = $34,900; Grand Plaza 22,000 + 13,500 = $35,500. Lakeview is cheapest (and within budget)." },
  { s: "msr-venue", q: "For each venue, select Yes if the total two-day cost (rental, catering for 150 attendees, and AV rental if needed) would be within the $30,000 budget. Otherwise, select No.",
    tf: [["Riverside Center", true], ["Summit Hotel", false], ["Oak Pavilion", true]], tfl: ["Yes", "No"],
    e: "Catering is $13,500 for every venue. Riverside: 9,000 + 13,500 = $22,500 (within budget, though it's too small). Summit: 19,000 + 2,400 + 13,500 = $34,900 (over). Oak Pavilion: 10,400 + 13,500 = $23,900 (within budget, though it's too far)." },
  { s: "msr-venue", q: "If attendance were expected to be 200 instead of 150, and the distance requirement stayed the same, how many of the venues would meet both the capacity and distance requirements?",
    o: ["2", "0", "1", "3", "4"],
    e: "Capacity ≥ 200 and ≤ 10 km from the airport: Summit Hotel (220, 3 km) and Grand Plaza (300, 6 km). Lakeview (180) is too small; Oak Pavilion is too far." },
  { s: "msr-abtest", q: "For each statement, select Yes if it is true based on the information provided. Otherwise, select No.",
    tf: [["Over the four weeks, design B's conversion rate was at least 10% higher than design A's.", true],
         ["Design B's conversion rate was higher than design A's in every week of the test.", false],
         ["The difference in average order value meets the memo's second requirement.", true]], tfl: ["Yes", "No"],
    e: "1. A: 600/20,000 = 3.0%. B: 695/20,000 = 3.475%, which is about 15.8% higher. Yes.\n2. Week 3: A 156/5,200 = 3.0%, B 147/4,900 = 3.0%, a tie. No.\n3. $62 − $58 = $4, which is no more than $5. Yes." },
  { s: "msr-abtest", q: "If week 4 is excluded because of the discount banner, design B's conversion rate over weeks 1–3 is approximately how much higher than design A's, relative to A's rate?",
    o: ["10%", "0%", "5%", "16%", "20%"],
    e: "Weeks 1–3: A = 450/15,000 = 3.0%. B = (170 + 182 + 147)/(5,000 + 5,200 + 4,900) = 499/15,100 ≈ 3.30%. 3.30/3.0 ≈ 1.10, about 10% higher. That's right at the memo's threshold, so the case for B is much weaker without week 4." },
  { s: "msr-abtest", q: "Which of the following conclusions is best supported by the information in the three sources?",
    o: ["The four-week results probably overstate B's advantage, because only B's visitors saw the banner.",
        "Design A should be kept, because its average order value over the test was more than $5 higher than design B's.",
        "Design B's average order value over the four weeks was higher than design A's average order value.",
        "Visitors were not assigned to the two designs at random during the four-week test.",
        "Design B was shown to fewer visitors in total than design A over the four weeks."],
    e: "The banner boosted B's week-4 purchases (196 vs. about 147–182 in other weeks), inflating B's overall rate. The order-value gap is $4, B's order value is lower, assignment was random, and each design had 20,000 visitors." },
  { s: "msr-freight", q: "Under the policy, which carrier should be used for this week's 250 kg shipment, and what will it cost?",
    o: ["FastFreight, $340", "FastFreight, $300", "ValueShip, $250", "AirPlus, $375", "AirPlus, $455"],
    e: "It must arrive within 3 days, which rules out ValueShip (5 days). FastFreight: 40 + 1.20 × 250 = $340. AirPlus: 80 + 1.50 × 250 = $455. FastFreight is cheaper. No discount applies under 400 kg." },
  { s: "msr-freight", q: "Under the policy, what will next week's 700 kg shipment cost?",
    o: ["$589.50", "$567.00", "$630.00", "$655.00", "$864.00"],
    e: "Only ValueShip can carry 700 kg (FastFreight's max is 500 and AirPlus's is 300). Cost = 25 + 0.90 × 700 = $655, less 10% for being over 400 kg: $589.50." },
  { s: "msr-freight", q: "For each carrier, select Yes if it could be used for a 350 kg shipment that must arrive within 2 days. Otherwise, select No.",
    tf: [["FastFreight", true], ["AirPlus", false], ["ValueShip", false]], tfl: ["Yes", "No"],
    e: "FastFreight: up to 500 kg in 2 days: Yes. AirPlus is fast enough but its max is 300 kg: No. ValueShip can carry the weight but takes 5 days: No." },
  { s: "msr-sleep", q: "For each statement, select Yes if it is true based on the information provided. Otherwise, select No.",
    tf: [["More than half of the 400 students averaged at least 7 hours of sleep a night.", false],
         ["The average exam score of all 400 students was above 72.", true],
         ["The group with the highest average exam score was also the group that slept the most.", false]], tfl: ["Yes", "No"],
    e: "1. At least 7 hours: 130 + 50 = 180 of 400 = 45%. No.\n2. Weighted average = (80×68 + 140×72 + 130×77 + 50×75)/400 = 29,280/400 = 73.2. Yes.\n3. The highest average score (77) belongs to the 7–8 hour group, not the over-8 group (75). No." },
  { s: "msr-sleep", q: "Which information in the data table best supports the critic's first objection?",
    o: ["The percent of students with part-time jobs falls steadily as the groups' average sleep rises.",
        "Students who slept 7 to 8 hours had a higher average score than those who slept more.",
        "The largest single group of students averaged 6 to 7 hours of sleep a night.",
        "Fewer students slept more than 8 hours than slept less than 6 hours a night.",
        "Every group's average exam score was above 65 on the final exams."],
    e: "The critic suggests part-time jobs could cause both less sleep and lower scores. The table shows job-holding is most common in the low-sleep, low-score groups (55% → 20%), consistent with that alternative explanation." },
  { s: "msr-sleep", q: "Which of the following, if true, would most directly answer the critic's second objection?",
    o: ["Where universities moved morning classes later, students' average sleep rose by about 40 minutes a night.",
        "Students who slept at least 7 hours a night also reported feeling less stressed during exams.",
        "Most students in the study said they would like morning classes to start later in the day.",
        "The researchers repeated the study the next year and found the same link between sleep and scores.",
        "Students with part-time jobs slept about as much as students without them in a later study."],
    e: "The second objection is that later start times might not increase sleep. Evidence that later starts did increase sleep elsewhere answers it directly. The last option addresses the first objection instead." }
];
