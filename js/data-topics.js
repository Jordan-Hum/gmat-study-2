// Topics, and the GMAT Focus Edition section each one belongs to.
// kind = the default question type for the topic (see KIND_LABEL in app.js).
window.TOPICS = [
  { id: "num",  name: "Number Properties",               icon: "🔢", sec: "Q",  kind: "ps" },
  { id: "pct",  name: "Fractions, Percents & Ratios",     icon: "➗", sec: "Q",  kind: "ps" },
  { id: "alg",  name: "Algebra & Exponents",              icon: "🧩", sec: "Q",  kind: "ps" },
  { id: "ineq", name: "Inequalities & Absolute Value",    icon: "↔️", sec: "Q",  kind: "ps" },
  { id: "word", name: "Rates, Work & Word Problems",      icon: "🚆", sec: "Q",  kind: "ps" },
  { id: "stat", name: "Statistics & Sets",                icon: "📐", sec: "Q",  kind: "ps" },
  { id: "prob", name: "Counting & Probability",           icon: "🎲", sec: "Q",  kind: "ps" },
  { id: "cr",   name: "CR: Assumption, Strengthen & Weaken", icon: "🧠", sec: "V", kind: "cr" },
  { id: "cr2",  name: "CR: Inference, Evaluate, Boldface & Paradox", icon: "🔍", sec: "V", kind: "cr" },
  { id: "rc",   name: "Reading Comprehension",            icon: "📖", sec: "V",  kind: "rc" },
  { id: "ds",   name: "Data Sufficiency",                 icon: "✅", sec: "DI", kind: "ds" },
  { id: "ta",   name: "Table Analysis",                   icon: "📋", sec: "DI", kind: "ta" },
  { id: "gi",   name: "Graphics Interpretation",          icon: "📈", sec: "DI", kind: "gi" },
  { id: "tpa",  name: "Two-Part Analysis",                icon: "🔀", sec: "DI", kind: "tpa" },
  { id: "msr",  name: "Multi-Source Reasoning",           icon: "🗂️", sec: "DI", kind: "msr" }
];

// The GMAT Focus Edition: three 45-minute sections, taken in any order.
// mix = how many questions of each topic a full-length section draws (they add up to n).
window.GMAT = {
  name: "GMAT",
  full: "GMAT Focus Edition",
  questions: 64, minutes: 135,
  sections: [
    { id: "Q", name: "Quantitative Reasoning", short: "Quant", icon: "🔢", n: 21, minutes: 45,
      mix: { num: 4, pct: 3, alg: 4, ineq: 2, word: 4, stat: 2, prob: 2 },
      blurb: "Problem Solving only: arithmetic and algebra word problems. No geometry and no calculator." },
    { id: "V", name: "Verbal Reasoning", short: "Verbal", icon: "📖", n: 23, minutes: 45,
      mix: { cr: 6, cr2: 5, rc: 12 },
      blurb: "Reading Comprehension and Critical Reasoning. Sentence Correction is no longer tested." },
    { id: "DI", name: "Data Insights", short: "Data Insights", icon: "📊", n: 20, minutes: 45,
      mix: { ds: 7, ta: 3, gi: 3, tpa: 4, msr: 3 },
      blurb: "Data Sufficiency, Table Analysis, Graphics Interpretation, Two-Part Analysis and Multi-Source Reasoning. An on-screen calculator is allowed." }
  ]
};
