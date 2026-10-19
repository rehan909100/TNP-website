AGENTS.md --- MME TNP Placement Dashboard
1. Project context
Build a departmental Training and Placement (TNP) dashboard for the
Metallurgical and Materials Engineering (MME) department at NIT
Tiruchirappalli.

The website is for viewing and managing historical placement data from
the previous six years. It is not a college-wide placement portal and is
not a live recruitment-management system.

The dashboard must generate its charts, KPIs, filters, comparisons, and
reports dynamically from the stored historical data.

This file is the shared project context for every coding agent and every
developer working on the repository, including developers using
different laptops. Treat the committed version of this file and the
current repository code as the source of truth. Do not depend on private
chat history, local agent memory, or assumptions that are not documented
here.
2. Scope boundaries
There are two application roles:
- ADMIN: Can manage historical placement data and perform
  authorized administrative actions.
- PROFESSOR: Can access the dashboard. Default permission is
  read-only unless the project owner explicitly changes this rule.
The users table exists only for authentication and role-based access
control. It is not a student or placement-data table.

Do not add features or tables for: - Other departments or department
management. - Student or recruiter login accounts. - Job postings,
applications, shortlisting, interviews, or live recruitment workflows. -
A college-wide placement portal.

Do not expand the project beyond this scope without an explicit
requirement.
3. Current conceptual data model
The initial hand-drawn model contains these entities and attributes.
Preserve this intent when implementing the schema. Inspect the existing
repository and historical data before changing field names or adding new
entities.
Student
Current intended attributes: - roll_number - name -
placement_status - company / company reference

A student record represents a student in the MME historical placement
dataset. Use a stable primary key if appropriate and keep the roll
number unique when the source data supports that rule.
Company
Current intended attributes: - name - domain - profile -
pay_offered - contact, with contact details such as: - HR name -
email - phone number - P/F status, as labelled in the original sketch;
verify its exact meaning before encoding it

Company data should be reusable across student records. If the actual
historical data shows that pay differs by student, role, or offer, do
not incorrectly treat pay_offered as a universal company attribute.
Propose the smallest justified change and document it.
User
The users table is only for login and role-based access: - id -
name - email - password_hash or the equivalent required by the
chosen authentication provider - role (ADMIN or PROFESSOR)

Do not put student placement details in users. Do not create a
department table.
Historical data
The application must support six years of historical data in the same
schema. Represent the relevant batch/year as data, not as separate
tables or separate implementations for each year.

Before finalizing the schema, inspect the actual files and current code.
Determine whether each source row represents a student, a company
relationship, or an individual offer. Do not assume that one student can
have only one offer unless the data and departmental rules confirm it.
4. Shared engineering rules
1. Inspect before editing. Read the relevant existing files,
   package scripts, schema, migrations, and nearby code before making
   changes.
2. Follow the existing stack. Do not replace frameworks, libraries,
   authentication, styling systems, or database tooling without an
   explicit reason and approval.
3. Use the repository as shared memory. If a decision affects other
   agents, document it in this file or the relevant project
   documentation and commit it.
4. Do not invent requirements. If the sketch or source data is
   ambiguous, record the uncertainty and ask for a decision instead of
   silently choosing a business rule.
5. Keep changes focused. Implement only the task assigned to you.
   Do not rebuild unrelated modules or rewrite files owned by another
   workstream.
6. Preserve compatibility. Check existing imports, routes, API
   contracts, types, and database migrations before changing shared
   interfaces.
7. Protect data. Never commit real student records, passwords,
   tokens, .env files, or private credentials. Use fictional data in
   examples and tests.
8. Validate changes. Run relevant lint, type-check, tests, and
   build commands where available. Report commands that could not be
   run.
9. Avoid destructive changes. Do not drop tables, reset shared
   databases, rewrite migrations already used by teammates, or remove
   other agents' work without approval.
10. No duplicate implementations. Search for an existing component,
    query, utility, or service before creating another version.
5. Multi-agent collaboration protocol
Different agents may work from different laptops. The shared Git
repository is the coordination mechanism.
Before starting a task
- Pull or inspect the latest agreed branch state.
- Read this AGENTS.md and any module-specific instructions.
- Inspect the files relevant to the assigned task.
- Check whether another agent owns or is editing the same files.
- State the exact scope of the task before editing.
While working
- Own a clearly bounded module or set of files.
- Avoid simultaneous edits to shared files such as the root layout,
  global styles, database schema, authentication configuration,
  package manifest, and shared types.
- If a shared contract must change, coordinate the change first and
  document it.
- Do not implement another agent's module merely because it is
  referenced by your task. Use its agreed interface or a clearly
  marked temporary stub.
- Do not overwrite, revert, or reformat unrelated changes.
- Keep commits small and descriptive.
Before handing off
Report: - What was implemented. - Which files changed. - Any schema,
API, type, or component contracts introduced or changed. - Commands and
tests run, with results. - Known limitations or unresolved questions. -
Any work that another agent must do next.

Never claim a feature works unless it has been implemented and checked.
6. Suggested work boundaries
These are coordination boundaries, not instructions for every agent to
implement every module. Assign each task to one owner.
- Database and data-import owner: schema, migrations, constraints,
  historical CSV/Excel import, validation, and seed data.
- Authentication and access owner: login, session handling,
  ADMIN/PROFESSOR permissions, and route/API protection. This
  owner must not redesign placement records.
- Dashboard and analytics owner: KPI definitions, filtered
  aggregate queries, charts, and year-to-year comparisons using agreed
  data contracts.
- UI and integration owner: shared layout, navigation, filters,
  responsive presentation, and integration of existing modules.
One person or agent may own multiple areas if the team is small, but
each file and shared contract must have a clear owner. Do not ask every
agent to independently build the entire website.
7. Database and analytics rules
- Use the database engine already selected in the repository. If none
  is selected, propose PostgreSQL and confirm before committing to it.
- Keep historical years in shared tables.
- Use foreign keys and appropriate unique constraints.
- Store compensation as a numeric value with a documented unit, such
  as LPA, rather than free-form text when the source data permits
  reliable conversion.
- Preserve missing or uncertain source values as missing; do not
  fabricate them.
- Normalize company names carefully during imports and retain a way to
  review ambiguous matches.
- Define placement-rate denominators explicitly. Do not calculate a
  placement percentage unless the total eligible student count for
  that batch is known.
- Distinguish placed students from offers if the source data counts
  them differently.
- Compute dashboard statistics from the data, using SQL aggregation or
  an existing query layer. Do not store derived KPIs as manually
  maintained values.
- Apply server-side authorization to data-changing operations. Hiding
  a button in the UI is not access control.
- Keep student-level data restricted to authorized users; aggregate
  dashboard views should expose only the data needed for their
  purpose.
8. Definition of done
A task is complete only when: - It satisfies the assigned scope and this
project context. - It integrates with the current codebase and agreed
contracts. - It does not introduce unrelated features or duplicate
implementations. - Relevant validation commands have been run, or the
limitation is clearly reported. - Documentation is updated if a shared
assumption, contract, or workflow changed. - The handoff states exactly
what changed and what remains.
9. Open decisions
Do not silently resolve these without inspecting the data or asking the
project owner:
- Which database engine and ORM are already in use?
- Does one student have one final placement record or can the dataset
  contain multiple offers?
- Does pay_offered vary by company, role, or individual offer?
- What exactly does the P/F status label in the sketch mean?
- Does the historical dataset contain the total eligible student count
  for each batch?
- Can professors only view analytics, or must they also edit records?
When an answer becomes known, update this section or the relevant schema
documentation and commit the change so every laptop and agent receives
the same context.
