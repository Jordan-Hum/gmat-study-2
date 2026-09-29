# 🎯 GMAT Focus Prep

A static study site for the **GMAT Focus Edition**, built like the CIRO Exam Prep site. It has no build step and no server; it runs on GitHub Pages.

## Features
- **482 practice questions** across all three sections, each with a worked explanation:
  - **Quantitative Reasoning** (245): number properties, percents and ratios, algebra, inequalities, word problems, statistics, counting and probability.
  - **Verbal Reasoning** (111): Critical Reasoning (assumption, strengthen, weaken, inference, evaluate, boldface, paradox, flaw) and 11 Reading Comprehension passages.
  - **Data Insights** (126): Data Sufficiency, sortable **Table Analysis**, **Graphics Interpretation** charts with drop-downs, **Two-Part Analysis** grids and tabbed **Multi-Source Reasoning** sets.
  - Numeric choices are listed smallest first, like the real test. Verbal choices are shuffled, and answer lengths are balanced so the right answer can't be spotted by length.
- **Section-timed mock exams**: a full 64-question mock (2 h 15 min) in the section order you choose, a half-length mock, and single-section tests. Each section has its own 45-minute clock. You must answer to move on, can bookmark questions, and can change up to 3 answers per section on the review screen, as on the real test. Results show an estimated 205–805 score.
- **Stats & analytics** (`#/stats`): estimated score from recent practice, accuracy and pace by section, topic and question type, a ranked **"Practise next"** list, how accuracy changes when you run over time, daily activity, weekly accuracy trend and mock-score trend.
- **Practice mode** with instant explanations and a stopwatch against GMAT pace. "Smart mix" puts missed and unseen questions first.
- **Study notes** for all 15 topics, **103 flashcards** and a searchable glossary.
- **Automatic sync across devices**: progress (including timing and attempt history for Stats) saves to `progress.json` on the `progress` branch of this repo via the GitHub API. Set it up once on the "Save & sync" page: paste a fine-grained token (this repo only, Contents read/write) and pick a password. The token is stored in `sync.json` encrypted with that password (PBKDF2 + AES-GCM), so other devices just enter the password. Devices merge progress; the newest answer per question wins.
- **Manual backup & restore** as a file or copy-paste code.

## Hosting (GitHub Pages)
Settings → Pages → *Deploy from a branch* → `main` / `(root)`.

## Editing content
- Topics, sections and mock composition: `js/data-topics.js`
- Questions: `js/data-quant.js`, `js/data-verbal.js`, `js/data-di.js`, plus `js/data-more-*.js`. The correct answer is listed first (or given by `a` / index fields for DS and multi-part formats; see the comments at the top of `js/data-di.js`).
- Notes: `js/data-notes.js` · Flashcards / glossary: `js/data-glossary.js`

To run it locally, run `python3 -m http.server` and visit http://localhost:8000.

Study aid only, not affiliated with GMAC. Check the current test format on mba.com.
