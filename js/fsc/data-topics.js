// Salesforce Financial Services Cloud (FSC) accreditation: topics and the exam domain each belongs to.
// fsc = the exam domain id (see EXAMS.fsc.elements).
window.TOPICS = [
  { id: "disc",     name: "Discovery & Business Requirements",            icon: "🔎", fsc: "1" },
  { id: "ind",      name: "FSC Industry Solutions & Use Cases",          icon: "🏦", fsc: "1" },
  { id: "model",    name: "Clients, Households & Relationships",         icon: "👨‍👩‍👧", fsc: "2" },
  { id: "finacct",  name: "Financial Accounts, Holdings & Rollups",       icon: "💰", fsc: "2" },
  { id: "security", name: "Security, Compliant Data Sharing & Compliance", icon: "🔐", fsc: "2" },
  { id: "design",   name: "Org Design & Data Migration",                 icon: "🗺️", fsc: "2" },
  { id: "config",   name: "Setup, Licenses & Lightning UI",              icon: "⚙️", fsc: "3" },
  { id: "process",  name: "Action Plans, Referrals & Automation",        icon: "⚡", fsc: "3" },
  { id: "insight",  name: "Integration, Reporting & Analytics",          icon: "📊", fsc: "3" },
  { id: "deploy",   name: "Testing, Deployment & Adoption",              icon: "🚀", fsc: "3" }
];

// Exam format and domain weightings, from published prep guides (confirm in the official exam guide;
// question counts per domain are the weightings scaled to the exam length).
window.EXAMS = {
  fsc: {
    name: "FSC",
    full: "Agentforce Financial Services Accredited Professional (Financial Services Cloud, AP-208)",
    questions: 55, minutes: 75, pass: 0.56,
    blurb: "A Salesforce partner accreditation for consultants who discover, design and deliver Financial Services Cloud solutions for wealth management, banking and insurance.",
    elements: [
      { id: "1", name: "Discovery", pct: 12, n: 7 },
      { id: "2", name: "Define/Design", pct: 42, n: 23 },
      { id: "3", name: "Delivery", pct: 46, n: 25 }
    ]
  }
};
