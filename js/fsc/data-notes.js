// Study notes per FSC topic (HTML). "trap" callouts flag common exam mistakes.
window.NOTES = {
disc: `
<h3>What discovery covers (12% of the exam)</h3>
<ul>
  <li>Document the customer's <b>business needs, value and vision</b>: goals, pain points, KPIs, regulatory constraints.</li>
  <li>Understand the <b>current state</b>: processes (as-is maps), systems of record, data owners, integrations, volumes.</li>
  <li>Identify <b>personas</b>: advisor, relationship manager, banker, contact-center agent, branch manager, insurance agent, underwriter, compliance.</li>
  <li>Run a <b>fit-gap</b>: map requirements to out-of-the-box FSC, configuration or customization.</li>
  <li>Define <b>success metrics and baselines</b> before building (AUM, wallet share, retention, advisor time saved, case handle time).</li>
</ul>
<h3>Techniques</h3>
<table>
  <tr><th>Technique</th><th>Use it for</th></tr>
  <tr><td>Stakeholder interviews / workshops</td><td>Goals, pain points, priorities</td></tr>
  <tr><td>Journey & process mapping (swimlanes)</td><td>Hand-offs across teams and systems</td></tr>
  <tr><td>Current-state architecture review</td><td>Systems of record, integrations, data volumes</td></tr>
  <tr><td>Prioritization (MoSCoW, value vs. effort)</td><td>Agreeing on an achievable first release</td></tr>
</table>
<h3>Signals to flag for the design team</h3>
<ul>
  <li>Information barriers / ethical walls → <b>Compliant Data Sharing</b>.</li>
  <li>Families and shared finances → <b>households and relationship groups</b>.</li>
  <li>Multiple countries → <b>multi-currency, Translation Workbench, territories</b>.</li>
  <li>High-volume transactions in a core system → <b>integration / virtualization</b>, not bulk copying.</li>
</ul>
<div class="trap">⚠️ Focus on business outcomes, not on copying legacy screens. The "best" answer usually favors standard FSC features and a phased roadmap.</div>`,

ind: `
<h3>Lines of business and the FSC features they use</h3>
<table>
  <tr><th>Line of business</th><th>Typical FSC capabilities</th></tr>
  <tr><td>Wealth management</td><td>Households, relationship map, financial accounts & holdings, assets & liabilities, financial goals, life events, action plans, Next Best Action</td></tr>
  <tr><td>Retail banking</td><td>Service console with client & account context, referrals, branch processes, account opening (OmniStudio), Agentforce for service</td></tr>
  <tr><td>Commercial banking</td><td>Business accounts, Account-Account relationships, Actionable Relationship Center, deal management, interaction summaries, business milestones, Compliant Data Sharing</td></tr>
  <tr><td>Insurance</td><td>Insurance policies, participants, coverages, claims, producers; household view of policies</td></tr>
  <tr><td>Mortgage</td><td>Residential loan applications, applicants, income, assets & liabilities; guided application flows</td></tr>
</table>
<h3>Key features in one line each</h3>
<ul>
  <li><b>Financial Goals</b>: target amount, target date and progress for a client or household.</li>
  <li><b>Life Events</b> (individuals) and <b>Business Milestones</b> (companies): timeline of key moments that create planning opportunities.</li>
  <li><b>Referrals</b> (intelligent need-based referrals): capture expressed interest, route to specialists, score referrers.</li>
  <li><b>Interactions & Interaction Summaries</b>: meetings and notes, with confidentiality controls.</li>
  <li><b>Assets and Liabilities</b>: held-away items (home, car, outside loans) for net worth.</li>
  <li><b>Agentforce for Financial Services</b>: AI agents with industry topics and actions, escalating to people.</li>
</ul>
<div class="trap">⚠️ FSC is a system of engagement on top of core systems. It doesn't replace a core banking ledger or policy administration system.</div>`,

model: `
<h3>Individuals, businesses and groups</h3>
<ul>
  <li><b>Person Accounts</b> are the recommended model for individuals. Enabling them is <b>permanent</b>, and Contact OWD must be <b>Controlled by Parent</b>.</li>
  <li><b>Business accounts</b> represent companies, with contacts and relationships.</li>
  <li><b>Households</b> (and other relationship groups) are accounts with a group record type. Members are linked by <b>Account-Contact Relationships (ACRs)</b>.</li>
</ul>
<h3>Account-Contact Relationship settings for group members</h3>
<ul>
  <li><b>Primary group</b>: each person has exactly one; their financial data rolls up there.</li>
  <li><b>Primary member</b>: the group's main contact.</li>
  <li><b>Rollups</b>: which of the member's records are included in the group's totals.</li>
  <li>A person can be a member of several groups (e.g., a child in both divorced parents' households).</li>
</ul>
<h3>Relationship types</h3>
<table>
  <tr><th>Relationship</th><th>Connects</th><th>Example</th></tr>
  <tr><td>Contact-Contact (CCR)</td><td>Person ↔ person</td><td>Spouse, sibling, parent/child, attorney</td></tr>
  <tr><td>Account-Contact (ACR)</td><td>Person ↔ account</td><td>Household member, CEO of a business client</td></tr>
  <tr><td>Account-Account (AAR)</td><td>Account ↔ account</td><td>Company ↔ law firm, parent ↔ subsidiary</td></tr>
</table>
<p><b>Reciprocal roles</b> define each role and its inverse (Parent ↔ Child), so relationships read correctly from both sides.</p>
<h3>Relationship tools</h3>
<ul>
  <li><b>Group Builder</b>: create/edit groups and members, set primary member and roles.</li>
  <li><b>Relationship Map</b>: visual of a household's members and their groups.</li>
  <li><b>Actionable Relationship Center (ARC)</b>: configurable relationship graphs across accounts and contacts, with actions from the graph. Great for commercial clients.</li>
</ul>
<div class="trap">⚠️ A person has many group memberships but only one primary group. Wrong household totals usually mean the wrong primary group or rollup setting.</div>`,

finacct: `
<h3>Core financial objects</h3>
<table>
  <tr><th>Object</th><th>Holds</th></tr>
  <tr><td>Financial Account</td><td>Accounts held at the firm: bank, investment, loan, credit card…</td></tr>
  <tr><td>Financial Account Role</td><td>People linked to an account: primary owner, joint owner, beneficiary, trustee…</td></tr>
  <tr><td>Financial Holding</td><td>Positions inside an investment account (quantity, market value)</td></tr>
  <tr><td>Securities</td><td>Reference data for instruments (name, symbol, price) that holdings point to</td></tr>
  <tr><td>Assets and Liabilities</td><td>Held-away items: real estate, vehicles, outside mortgages and loans</td></tr>
  <tr><td>Financial Goal</td><td>Target amount and date, with current progress</td></tr>
  <tr><td>Insurance Policy (insurance model)</td><td>Policies, with participants, coverages and claims</td></tr>
</table>
<h3>Rollups</h3>
<ul>
  <li>FSC aggregates balances to the <b>client</b> and the client's <b>primary group</b> (household), and business accounts get totals of the accounts they own.</li>
  <li><b>Record rollups</b> keep group totals current as records change.</li>
  <li><b>Rollup by Lookup (RBL)</b> rules define configurable, filtered aggregates and run on the <b>Data Processing Engine</b>.</li>
  <li>After bulk loads (often with triggers disabled), <b>run the rollup recalculation jobs</b>.</li>
</ul>
<h3>Design choices</h3>
<ul>
  <li>Keep millions of transactions in the core system; show them on demand (Salesforce Connect) or as summaries.</li>
  <li>Update prices once on Securities rather than on every holding.</li>
</ul>
<div class="trap">⚠️ Held-away items go in Assets and Liabilities, not Financial Accounts. Accounts held at the firm, including credit cards and loans, are Financial Accounts.</div>`,

security: `
<h3>Platform security recap (you know this from Admin)</h3>
<ul>
  <li><b>OWD</b> sets the baseline; open access with <b>role hierarchy</b>, <b>sharing rules</b>, teams and manual sharing.</li>
  <li><b>Field-level security</b> hides fields; it doesn't control record access.</li>
  <li>Design for <b>least privilege</b>: restrictive OWDs, then open deliberately.</li>
</ul>
<h3>Compliant Data Sharing (CDS)</h3>
<ul>
  <li>Grants access to specific records because a user is a <b>participant</b> with a <b>participant role</b> that sets the access level.</li>
  <li>Supports <b>ethical walls</b>: access isn't automatically opened through the hierarchy.</li>
  <li>Requires the object's OWD to be <b>Private</b>. Used for objects like accounts, opportunities, financial deals and interactions/interaction summaries.</li>
  <li><b>Participant groups</b> let you add a whole team as a participant.</li>
</ul>
<h3>Shield and compliance</h3>
<table>
  <tr><th>Need</th><th>Feature</th></tr>
  <tr><td>Encrypt sensitive fields at rest</td><td>Shield Platform Encryption</td></tr>
  <tr><td>Keep field history up to 10 years</td><td>Field Audit Trail</td></tr>
  <tr><td>Monitor exports, logins, API use</td><td>Event Monitoring</td></tr>
  <tr><td>Track communication consent</td><td>Consent data model (Individual, contact point consent)</td></tr>
  <tr><td>Anonymize sandbox data</td><td>Data Mask</td></tr>
</table>
<div class="trap">⚠️ If the scenario mentions information barriers or "only the deal team", the answer is usually Compliant Data Sharing, not sharing rules or the role hierarchy.</div>`,

design: `
<h3>Define/Design (42% of the exam)</h3>
<ul>
  <li>Design the <b>data model</b> (person accounts, households, relationships, financial objects) using standard FSC objects first.</li>
  <li>Design <b>security</b> (OWDs, hierarchy, CDS, Shield needs).</li>
  <li>Set up <b>territories</b> (Enterprise Territory Management), <b>currencies</b> (multi-currency is irreversible) and <b>languages</b> (Translation Workbench).</li>
  <li>Design <b>future-state processes</b>: simplify and use standard features before customizing.</li>
  <li><b>Prioritize the backlog</b> (MoSCoW, value vs. effort) and plan releases.</li>
</ul>
<h3>Data migration strategy</h3>
<ol>
  <li>Profile and cleanse source data; deduplicate and agree matching rules.</li>
  <li>Map legacy structures to FSC: one person per person account, households via ACRs, joint holders via Financial Account Roles.</li>
  <li>Use <b>external IDs</b> and <b>upsert</b>; use the <b>Bulk API</b> for large volumes.</li>
  <li>Load parents before children: <b>accounts → relationships → financial accounts → roles → holdings</b>.</li>
  <li>Temporarily disable FSC triggers/rollups for big loads, then re-enable and <b>recalculate rollups</b>.</li>
  <li>Rehearse in a <b>Full sandbox</b>, then reconcile counts and totals.</li>
</ol>
<div class="trap">⚠️ Couples stored as one legacy record should become two person accounts in a household, linked as spouses.</div>`,

config: `
<h3>Access and setup</h3>
<ul>
  <li>Users need the <b>FSC permission set license</b> and <b>FSC permission sets</b>, plus record sharing.</li>
  <li>FSC runs in <b>Lightning Experience</b> only.</li>
  <li>Default record types (e.g., person account record type) are set per profile, with access through permission sets.</li>
</ul>
<h3>Building the experience</h3>
<ul>
  <li>Use <b>Lightning App Builder</b> to place FSC components (financial summary, relationship map, life events, goals, ARC) on record pages.</li>
  <li>Assign pages by <b>app, record type and profile</b> to tailor each persona.</li>
  <li><b>Dynamic Forms</b> and component visibility rules show the right fields at the right time.</li>
  <li><b>Console apps</b> with a utility bar suit contact-center and high-volume users.</li>
  <li>Keep pages fast: use tabs and conditional visibility instead of stacking every component.</li>
</ul>
<h3>Configuring relationship features</h3>
<ul>
  <li><b>Reciprocal roles</b> define relationship labels from both sides.</li>
  <li><b>ARC</b>: define relationship graphs, then add the component.</li>
  <li><b>Life event types</b> are picklist values, with display configured in the Life Events component.</li>
</ul>
<div class="trap">⚠️ "User can log in but can't see FSC objects" → check the FSC permission set license and permission sets before anything else.</div>`,

process: `
<h3>Action Plans</h3>
<ul>
  <li>Templates of <b>tasks</b> and <b>document checklist items</b> for repeatable processes (onboarding, account opening, reviews).</li>
  <li>Due dates are <b>days after the plan's start date</b>.</li>
  <li>Published templates are read-only: make a <b>new version</b> to change them.</li>
</ul>
<h3>Referrals (intelligent need-based referrals)</h3>
<ul>
  <li>Built on <b>Lead</b> with a referral record type; capture the client's <b>expressed interest</b> and the referrer.</li>
  <li>Route with <b>assignment rules and queues</b>; track the <b>referrer score</b> (quality of past referrals).</li>
</ul>
<h3>Automation and guided processes</h3>
<table>
  <tr><th>Need</th><th>Use</th></tr>
  <tr><td>Do something when a record changes</td><td>Record-triggered flow</td></tr>
  <tr><td>Recurring work on a schedule</td><td>Scheduled flow</td></tr>
  <tr><td>Guided multi-step processes with external data</td><td>OmniStudio: OmniScripts, Integration Procedures, FlexCards</td></tr>
  <tr><td>Eligibility and lookup-table decisions</td><td>Business Rules Engine (decision matrices, expression sets)</td></tr>
  <tr><td>Large batch aggregations</td><td>Data Processing Engine</td></tr>
  <tr><td>Approvals</td><td>Approval processes / flow approvals</td></tr>
  <tr><td>Recommendations on the client page</td><td>Einstein Next Best Action</td></tr>
  <tr><td>AI agents for clients or employees</td><td>Agentforce: topics, instructions, actions, guardrails</td></tr>
</table>
<div class="trap">⚠️ Prefer declarative tools (flows, OmniStudio, BRE) over Apex in "best solution" questions unless the scenario needs code.</div>`,

insight: `
<h3>Integration patterns</h3>
<ul>
  <li>Core systems usually stay <b>systems of record</b>; FSC is the <b>system of engagement</b>.</li>
  <li><b>Scheduled sync</b> (ETL / MuleSoft) for balances and accounts; <b>Bulk API</b> + external IDs for large volumes.</li>
  <li><b>Salesforce Connect</b> (external objects) to view data in real time without copying it.</li>
  <li><b>Change Data Capture</b> / platform events to notify other systems of changes.</li>
  <li><b>MuleSoft Accelerators</b> for financial services provide prebuilt integration templates.</li>
  <li><b>Data Cloud</b> unifies profiles from many sources with identity resolution.</li>
</ul>
<h3>Reporting and analytics</h3>
<ul>
  <li>Households are accounts: report on them with rollup fields (e.g., total assets).</li>
  <li>Household members need a report type that includes <b>Account-Contact Relationships</b>.</li>
  <li><b>Reporting snapshots</b> store values over time for trends (e.g., monthly AUM).</li>
  <li><b>CRM Analytics</b> offers financial-services templates for deeper analysis.</li>
</ul>
<div class="trap">⚠️ Don't copy millions of transactions into FSC "just in case". Virtualize or summarize them.</div>`,

deploy: `
<h3>Delivery and go-live</h3>
<ul>
  <li><b>Environments</b>: Developer sandboxes to build, Partial/Full Copy for UAT and migration rehearsal, preview sandboxes for release testing.</li>
  <li><b>Data Mask</b> to anonymize production data in sandboxes.</li>
  <li><b>Deployments</b>: DevOps Center or Salesforce CLI with version control; Apex needs ≥ 75% test coverage with passing tests.</li>
  <li><b>UAT</b>: business users test real scenarios against requirements.</li>
  <li><b>Cutover plan</b>: ordered steps, owners, timing, validation and rollback.</li>
  <li><b>Rollout</b>: pilot, then phased waves; <b>hypercare</b> right after go-live.</li>
</ul>
<h3>Adoption</h3>
<ul>
  <li>Champions, role-based training using real scenarios, and clear "what's in it for me".</li>
  <li>Measure usage (logins, updates, features used) and business KPIs against the discovery baseline.</li>
  <li>Review release notes and regression-test before each of the three yearly releases.</li>
</ul>
<div class="trap">⚠️ Validating a migration means reconciling counts and totals against the source, not just checking that the load tool reported no errors.</div>`
};
