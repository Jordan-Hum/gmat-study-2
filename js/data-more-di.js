// More Data Insights questions (same formats as data-di.js).
(function () {
  const SETS = window.SETS;
  const TF = "For each of the following statements, select True if the statement is true based on the information in the table. Otherwise, select False.";
  const YN = "For each of the following statements, select Yes if the statement can be shown to be true based on the information in the table. Otherwise, select No.";
  const GI = "Use the drop-down menus to complete each statement so that it is accurate based on the information provided.\n\n";

  const DS = [
    { q: "Is x > 0?\n(1) x² > 0\n(2) x³ > x²", a: "B",
      e: "(1) only says x ≠ 0. (2) x³ − x² = x²(x − 1) > 0 requires x > 1, so yes. B." },
    { q: "What is the value of the integer n?\n(1) n is a prime number between 20 and 30.\n(2) n + 1 is divisible by 6.", a: "E",
      e: "(1) n = 23 or 29. Both 24 and 30 are divisible by 6, so together n is still 23 or 29. E." },
    { q: "How many employees does Firm X have?\n(1) If 10 employees left, Firm X would have 20% fewer employees.\n(2) Firm X has 30 more employees than Firm Y.", a: "A",
      e: "(1) 10 = 20% of N, so N = 50. (2) Firm Y's size is unknown. A." },
    { q: "Is the average (arithmetic mean) of a, b and c greater than b?\n(1) a + c > 2b\n(2) a > b", a: "A",
      e: "(a + b + c)/3 > b ⇔ a + b + c > 3b ⇔ a + c > 2b. (1) is exactly that: yes. (2) says nothing about c. A." },
    { q: "What is the ratio of x to y?\n(1) 3x = 4y\n(2) x + y = 14", a: "A",
      e: "(1) x/y = 4/3. Sufficient without knowing x or y. (2) has many solutions with different ratios. A." },
    { q: "What is the value of |x|?\n(1) x² = 36\n(2) x < 0", a: "A",
      e: "(1) x = ±6, and either way |x| = 6. Sufficient. (2) gives no value. A." },
    { q: "A store raised the price of a jacket by p%. What is p?\n(1) The price rose by $12.\n(2) The new price is $72.", a: "C",
      e: "A percent needs the change and the original. Together the original is $60, so p = 12/60 = 20%. C." },
    { q: "Is the integer n divisible by 15?\n(1) n is divisible by 5.\n(2) n is divisible by 45.", a: "B",
      e: "(2) 45 = 15 × 3, so yes. (1) 5 (no) or 15 (yes). B." },
    { q: "What is the value of x − y?\n(1) x² − y² = 24\n(2) 2x = 2y + 8", a: "B",
      e: "(2) x − y = 4. Sufficient. (1) (x + y)(x − y) = 24 has many possibilities. B." },
    { q: "Did Store P sell more than 500 units in May?\n(1) Store P sold 20% more units in May than in April.\n(2) Store P sold 450 units in April.", a: "C",
      e: "Together May = 1.2 × 450 = 540 > 500, so yes. Neither alone is enough. C." },
    { q: "Is x an integer?\n(1) 2x is an integer.\n(2) x² is an integer.", a: "C",
      e: "(1) x = 0.5 (no) or 1 (yes). (2) x = √2 (no) or 1 (yes). Together x = k/2, and x² = k²/4 is an integer only if k is even, so x is an integer. C." },
    { q: "What is the value of a + b?\n(1) 2a + 2b = 10\n(2) a = 5 − b", a: "D",
      e: "(1) a + b = 5. (2) a + b = 5. D." },
    { q: "Is y > 5?\n(1) y − 6 > 0\n(2) y/2 > 3", a: "D",
      e: "Both statements say y > 6, which answers yes. D." },
    { q: "Is xyz = 0?\n(1) x = 0\n(2) yz = 0", a: "D",
      e: "(1) makes the product 0. (2) makes yz = 0, so xyz = 0. Both yes: D." },
    { q: "What is the value of k?\n(1) k³ = 27\n(2) k² = 9", a: "A",
      e: "(1) k = 3. (2) k = 3 or −3. A." },
    { q: "Ana bought 5 books. What was the average price of the books?\n(1) She paid $80 in total for the 5 books.\n(2) The most expensive book cost $30.", a: "A",
      e: "(1) 80/5 = $16. (2) tells you nothing about the total. A." },
    { q: "How many students are in the club?\n(1) If 4 more students joined, the club would have 1/3 more students than it has now.\n(2) The club has 4 more girls than boys.", a: "A",
      e: "(1) 4 = N/3, so N = 12. (2) gives a difference, not a total. A." },
    { q: "Is 2^x > 100?\n(1) x > 6\n(2) x < 7", a: "E",
      e: "2⁶ = 64 and 2⁷ = 128. Together 6 < x < 7: x = 6.1 gives about 69 (no) and x = 6.9 gives about 119 (yes). E." },
    { q: "Working alone at its constant rate, how many hours does Machine A take to fill an order?\n(1) Machines A and B together take 4 hours.\n(2) Machine B alone takes 6 hours.", a: "C",
      e: "Together: A's rate = 1/4 − 1/6 = 1/12, so 12 hours. Each alone is missing a piece. C." },
    { q: "If m and n are integers, is m + n even?\n(1) m − n is even.\n(2) mn is odd.", a: "D",
      e: "(1) m and n have the same parity, so m + n is even. (2) both are odd, so the sum is even. D." },
    { q: "What is the median of a set S of 5 integers?\n(1) The mean of S is 10.\n(2) The range of S is 8.", a: "E",
      e: "{6, 10, 10, 10, 14} and {6, 8, 9, 13, 14} both have mean 10 and range 8, but medians 10 and 9. E." },
    { q: "Is r > s?\n(1) r² > s²\n(2) r − s = 3", a: "B",
      e: "(2) r − s > 0 means yes. (1) r = −5, s = 1 (no) or r = 5, s = 1 (yes). B." },
    { q: "What is the tens digit of the positive integer n?\n(1) n is a multiple of 5 less than 30.\n(2) n² = 400", a: "B",
      e: "(2) n = 20 (positive), tens digit 2. (1) n could be 5, 10, …, 25. B." },
    { q: "Did the population of Town T grow at a faster rate than the population of Town U last year?\n(1) Town T gained 2,000 residents last year.\n(2) Town U gained 1,500 residents last year.", a: "E",
      e: "Growth rates need each town's starting population. Neither is given. E." },
    { q: "What is the value of x?\n(1) 3x − 7 = 11\n(2) x/2 + 1 = 4", a: "D",
      e: "(1) x = 6. (2) x = 6. D." },
    { q: "What is the value of w?\n(1) w² = 16\n(2) w³ = 16w", a: "E",
      e: "(1) w = ±4. (2) w(w² − 16) = 0, so w = 0 or ±4. Together w = 4 or −4. E." },
    { q: "Kim is paid the same hourly wage for every hour she works. What is her hourly wage?\n(1) Kim earned $600 last week.\n(2) Kim worked 40 hours last week.", a: "C",
      e: "Together: 600/40 = $15 an hour. Each alone is missing a piece. C." }
  ];

  SETS["ta-routes"] = {
    text: "The table shows data for six airline routes. Load factor is the percent of seats filled with passengers, on average.",
    table: { head: ["Route", "Flights per week", "Load factor (%)", "Average fare ($)", "Seats per flight"], rows: [
      ["DEN–LAX", 28, 86, 145, 180], ["BOS–ORD", 35, 78, 160, 150], ["SEA–SFO", 42, 82, 120, 150],
      ["ATL–MIA", 21, 91, 110, 180], ["DFW–PHX", 14, 74, 135, 120], ["JFK–LAX", 49, 88, 310, 200]] }
  };
  SETS["ta-returns"] = {
    text: "The table shows sales and returns of six kitchen appliances last quarter, with average customer ratings (out of 5) and prices.",
    table: { head: ["Product", "Units sold", "Units returned", "Avg. rating", "Price ($)"], rows: [
      ["Blender", 2400, 96, 4.3, 89], ["Toaster", 3100, 62, 4.6, 45], ["Kettle", 1800, 90, 4.1, 39],
      ["Mixer", 950, 57, 3.9, 249], ["Juicer", 1200, 30, 4.4, 129], ["Coffee maker", 2600, 156, 3.8, 99]] }
  };
  const TA = [
    { s: "ta-routes", q: YN, tfl: ["Yes", "No"],
      tf: [["The route with the most flights per week also has the highest average fare.", true],
           ["Every route with a load factor above 85% has at least 180 seats per flight.", true],
           ["DEN–LAX carries more passengers per week than SEA–SFO does.", false]],
      e: "1. JFK–LAX has both the most flights (49) and the highest fare ($310). Yes.\n2. Above 85%: DEN–LAX (180 seats), ATL–MIA (180), JFK–LAX (200). Yes.\n3. Passengers = flights × seats × load factor: DEN–LAX 28 × 180 × 0.86 ≈ 4,334; SEA–SFO 42 × 150 × 0.82 ≈ 5,166. No." },
    { s: "ta-routes", q: TF, tfl: ["True", "False"],
      tf: [["The median number of flights per week across the six routes is 31.5.", true],
           ["ATL–MIA has both the lowest average fare and the highest load factor.", true],
           ["Exactly two routes have fewer than 30 flights per week.", false]],
      e: "1. Flights in order: 14, 21, 28, 35, 42, 49. Median = (28 + 35)/2 = 31.5. True.\n2. ATL–MIA: fare $110 (lowest) and load factor 91% (highest). True.\n3. DEN–LAX (28), ATL–MIA (21) and DFW–PHX (14): three routes. False." },
    { s: "ta-returns", q: YN, tfl: ["Yes", "No"],
      tf: [["The product with the most units returned also has the lowest average rating.", true],
           ["Every product with a return rate of 5% or more has an average rating below 4.0.", false],
           ["Revenue from Mixer sales (units sold × price) was greater than revenue from Blender sales.", true]],
      e: "1. Coffee maker: most returns (156) and lowest rating (3.8). Yes.\n2. Return rates: Kettle 90/1,800 = 5% but its rating is 4.1. No.\n3. Mixer 950 × 249 = $236,550; Blender 2,400 × 89 = $213,600. Yes." },
    { s: "ta-returns", q: TF, tfl: ["True", "False"],
      tf: [["The Juicer's return rate is less than half of the Kettle's return rate.", false],
           ["The median price of the six products is $94.", true],
           ["More than 500 units in total were returned across the six products.", false]],
      e: "1. Juicer 30/1,200 = 2.5%; Kettle 5%. Exactly half, not less. False.\n2. Prices in order: 39, 45, 89, 99, 129, 249. Median = (89 + 99)/2 = 94. True.\n3. 96 + 62 + 90 + 57 + 30 + 156 = 491. False." }
  ];

  SETS["gi-revenue"] = {
    text: "The graph shows Company Q's revenue in each quarter of 2023 and 2024.",
    chart: { type: "bar", title: "Quarterly revenue ($ millions)", x: ["Q1", "Q2", "Q3", "Q4"],
      series: [{ name: "2023", v: [10, 12, 16, 14] }, { name: "2024", v: [12, 15, 18, 15] }], labels: true, yLabel: "$ millions" }
  };
  SETS["gi-park"] = {
    text: "The graph shows the average number of daily visitors to a national park in each month from April to September.",
    chart: { type: "line", title: "Average daily visitors (thousands)", x: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      series: [{ name: "Visitors", v: [4, 7, 12, 15, 14, 8] }], labels: true, yLabel: "Thousands" }
  };
  const GIQ = [
    { s: "gi-revenue", q: GI + "Company Q's total revenue in 2024 was $[1] million, which was about [2] higher than its total revenue in 2023.",
      dd: [{ o: ["52", "58", "60", "64"], a: 2 }, { o: ["8%", "12%", "15%", "20%"], a: 2 }],
      e: "2024: 12 + 15 + 18 + 15 = 60. 2023: 10 + 12 + 16 + 14 = 52. Increase = 8/52 ≈ 15.4%, about 15%." },
    { s: "gi-revenue", q: GI + "The quarter with the greatest percent increase in revenue from 2023 to 2024 was [1].\n\nIn [2] of the four quarters, 2024 revenue was at least 20% higher than in the same quarter of 2023.",
      dd: [{ o: ["Q1", "Q2", "Q3", "Q4"], a: 1 }, { o: ["1", "2", "3", "4"], a: 1 }],
      e: "Q1 +2/10 = 20%, Q2 +3/12 = 25%, Q3 +2/16 = 12.5%, Q4 +1/14 ≈ 7%. Q2 is greatest. Q1 (exactly 20%) and Q2 qualify: 2 quarters." },
    { s: "gi-park", q: GI + "Average daily visitors in July were [1] times the number in April.\n\nThe largest month-to-month increase in average daily visitors occurred from [2].",
      dd: [{ o: ["2.5", "3", "3.75", "4.5"], a: 2 }, { o: ["April to May", "May to June", "June to July", "July to August"], a: 1 }],
      e: "15/4 = 3.75. Increases: Apr→May +3, May→Jun +5, Jun→Jul +3 (Jul→Aug is a decrease). May to June is largest." },
    { s: "gi-park", q: GI + "To the nearest percent, average daily visitors fell by [1]% from August to September.\n\nIn [2] of the six months, average daily visitors were above 10,000.",
      dd: [{ o: ["6", "38", "43", "75"], a: 2 }, { o: ["2", "3", "4", "5"], a: 1 }],
      e: "(14 − 8)/14 ≈ 42.9%, which rounds to 43%. (75% divides by September's value.) Above 10 thousand: June, July and August: 3 months." }
  ];

  const TPA = [
    { q: "A store sells notebooks for $4 each and pens for $1.50 each. Lee bought 8 items in total and spent $27.\n\nSelect the number of notebooks and the number of pens Lee bought. Make only two selections, one in each column.",
      tpa: { cols: ["Notebooks", "Pens"], rows: ["1", "2", "3", "4", "5", "6"], a: [5, 1] },
      e: "4n + 1.5(8 − n) = 27 → 2.5n + 12 = 27 → n = 6 notebooks, so 2 pens. Check: 24 + 3 = 27 ✓." },
    { q: "The sum of four consecutive integers is 58.\n\nSelect the smallest and the largest of the four integers. Make only two selections, one in each column.",
      tpa: { cols: ["Smallest", "Largest"], rows: ["12", "13", "14", "15", "16", "17"], a: [1, 4] },
      e: "The average is 58/4 = 14.5, halfway between the 2nd and 3rd integers (14 and 15). The integers are 13, 14, 15, 16." },
    { q: "Manager: \"Employees at our firm who work from home report higher job satisfaction than those who work in the office. So allowing more employees to work remotely will reduce our staff turnover.\"\n\nSelect the statement that is an assumption the argument requires and the statement that most weakens the argument. Make only two selections, one in each column.",
      tpa: { cols: ["Required assumption", "Weakens"], rows: [
        "Higher job satisfaction tends to make employees less likely to leave the firm.",
        "Employees who leave the firm mostly cite low pay, not their working conditions.",
        "Some of the firm's employees prefer working in the office to working from home.",
        "Allowing remote work would reduce the firm's spending on office space.",
        "The firm's staff turnover is higher than the average for its industry.",
        "Employees who work from home spend more time on video calls each week."], a: [0, 1] },
      e: "The argument links satisfaction to turnover, so it needs satisfaction to reduce leaving. If people leave over pay, more remote work may not change turnover much." },
    { q: "Cars X and Y leave the same point at the same time and drive in opposite directions at constant speeds. After 3 hours they are 390 km apart, and car X has traveled 30 km more than car Y.\n\nSelect the speed of car X and the speed of car Y, in km per hour. Make only two selections, one in each column.",
      tpa: { cols: ["Car X", "Car Y"], rows: ["50", "55", "60", "65", "70", "75"], a: [4, 2] },
      e: "Combined speed = 390/3 = 130. X gains 30 km in 3 hours, so X − Y = 10. X = 70, Y = 60." },
    { q: "Five runners (P, Q, R, S and T) finished a race with no ties. Q finished immediately after P. R finished before P. S finished last. T finished second.\n\nSelect the finishing position of Q and the finishing position of R. Make only two selections, one in each column.",
      tpa: { cols: ["Q", "R"], rows: ["1st", "2nd", "3rd", "4th", "5th"], a: [3, 0] },
      e: "S is 5th and T is 2nd, leaving 1st, 3rd and 4th for P, Q and R. Q is right after P, so P and Q are 3rd and 4th, and R is 1st." },
    { q: "A price p is increased by 25% to give a new price q. Then q is decreased by d% to return to the original price p. The original price p is $80.\n\nSelect the value of q (in dollars) and the value of d. Make only two selections, one in each column.",
      tpa: { cols: ["q", "d"], rows: ["16", "20", "25", "80", "100", "125"], a: [4, 1] },
      e: "q = 80 × 1.25 = $100. Going from 100 back to 80 is a decrease of 20/100 = 20%, not 25%." },
    { q: "A city plans to reduce litter in its parks by installing more trash bins.\n\nSelect the piece of information that would most support the plan and the piece that would most undermine it. Make only two selections, one in each column.",
      tpa: { cols: ["Supports the plan", "Undermines the plan"], rows: [
        "Surveys show that most litter is dropped at spots far from the nearest bin.",
        "The parks' existing bins are rarely more than half full when they're emptied.",
        "The city's parks are visited most heavily on weekends and holidays.",
        "Some of the parks already have separate bins for recycling.",
        "The parks department employs twelve full-time cleaners.",
        "Litter is one of the most common complaints in city surveys."], a: [0, 1] },
      e: "If litter is dropped far from bins, more bins should help. If existing bins are rarely half full, lack of capacity isn't the problem, so more bins may not help." },
    { q: "A vendor buys x kilograms of fruit at $2 per kilogram and sells all of it at $3.50 per kilogram, making a profit of $180.\n\nSelect the value of x and the vendor's total revenue, in dollars. Make only two selections, one in each column.",
      tpa: { cols: ["x", "Revenue"], rows: ["90", "120", "180", "240", "360", "420"], a: [1, 5] },
      e: "Profit per kg = $1.50, so x = 180/1.5 = 120 kg. Revenue = 120 × 3.50 = $420." }
  ];

  SETS["msr-office"] = { tabs: [
    { t: "Memo", text: [
      "From: Chief operating officer",
      "We're moving our 60 staff to a new office. The new space must have at least as many desks as we have staff, and total monthly cost (rent plus parking for 40 cars) must not exceed $40,000."] },
    { t: "Options", table: { head: ["Option", "Desks", "Rent per month ($)", "Parking per space per month ($)", "Avg. staff commute (min)"], rows: [
      ["Harbor Tower", 70, 32000, 80, 35], ["Midtown Plaza", 62, 36000, "Included", 28], ["Westgate Park", 90, 27000, "Free", 50]] } },
    { t: "Email", text: [
      "From: CEO",
      "In our staff survey, 70% said a commute of more than 45 minutes would make them consider leaving. Of the options that meet the memo's requirements, choose the one with the shortest average commute."] }
  ]};
  SETS["msr-email"] = { tabs: [
    { t: "Results", table: { head: ["Campaign", "Emails sent", "Opens", "Clicks", "Purchases"], rows: [
      ["Spring", 40000, 10000, 1200, 240], ["Summer", 50000, 11000, 1650, 264], ["Fall", 30000, 9000, 900, 225], ["Holiday", 60000, 18000, 2700, 405]] } },
    { t: "Definitions", text: [
      "Open rate = opens ÷ emails sent.",
      "Click rate = clicks ÷ opens.",
      "Conversion rate = purchases ÷ clicks."] },
    { t: "Manager's email", text: [
      "Next year we'll repeat only the campaigns that had an open rate of at least 25% and a conversion rate of at least 18%.",
      "For planning, assume the average purchase is $60 for every campaign."] }
  ]};
  const MSR = [
    { s: "msr-office", q: "Which option should the company choose?",
      o: ["Midtown Plaza", "Harbor Tower", "Westgate Park", "Either Harbor Tower or Westgate Park", "None of the options"],
      e: "All three have enough desks. Costs: Harbor 32,000 + 40 × 80 = $35,200; Midtown $36,000; Westgate $27,000, all within $40,000. Shortest commute among them: Midtown (28 min)." },
    { s: "msr-office", q: "For each option, select Yes if its total monthly cost (rent plus parking for 40 cars) is at or below $35,000. Otherwise, select No.",
      tf: [["Harbor Tower", false], ["Midtown Plaza", false], ["Westgate Park", true]], tfl: ["Yes", "No"],
      e: "Harbor Tower: $35,200 (just over). Midtown Plaza: $36,000. Westgate Park: $27,000." },
    { s: "msr-office", q: "If the company grew to 65 staff before the move, and all other requirements and the CEO's preference stayed the same, which option should it choose?",
      o: ["Harbor Tower", "Midtown Plaza", "Westgate Park", "Either Midtown Plaza or Westgate Park", "None of the options"],
      e: "Midtown Plaza has only 62 desks, so it no longer qualifies. Harbor Tower (35 min) has a shorter commute than Westgate Park (50 min)." },
    { s: "msr-email", q: "For each campaign, select Yes if it meets the manager's criteria for being repeated next year. Otherwise, select No.",
      tf: [["Spring", true], ["Summer", false], ["Holiday", false]], tfl: ["Yes", "No"],
      e: "Spring: open 25%, conversion 240/1,200 = 20%: meets both. Summer: open 22%: fails. Holiday: open 30% but conversion 405/2,700 = 15%: fails." },
    { s: "msr-email", q: "Among the campaigns that meet the manager's criteria, which had the highest click rate?",
      o: ["Spring", "Summer", "Fall", "Holiday", "None of the campaigns meets the criteria"],
      e: "Qualifying: Spring (open 25%, conversion 20%) and Fall (open 30%, conversion 25%). Click rates: Spring 1,200/10,000 = 12%; Fall 900/9,000 = 10%. Spring." },
    { s: "msr-email", q: "Based on the manager's planning assumption, how much revenue did the Holiday campaign generate?",
      o: ["$24,300", "$16,200", "$18,000", "$108,000", "$162,000"],
      e: "405 purchases × $60 = $24,300. ($162,000 uses clicks instead of purchases.)" }
  ];

  const add = (k, list) => { window.QB[k] = (window.QB[k] || []).concat(list); };
  add("ds", DS); add("ta", TA); add("gi", GIQ); add("tpa", TPA); add("msr", MSR);
})();
