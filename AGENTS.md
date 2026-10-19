# Placement Portal: Project Context

This portal lets our department's placement representative (CICRep) record placement data for all 70 students, and lets professors view it as a live, interactive dashboard. This doc is the shared spec for everyone writing code, and it deliberately assumes no tech stack.

## Roles and access

There are two roles, and only the CICRep can change data. Professors only view.

| Area | Admin (CICRep) | Professor |
| --- | --- | --- |
| Dashboard | View | View |
| Data Entry | View and edit | No access |
| Calendar | View and edit | View only (working default, see Open questions) |

- Access is enforced by role on the server, not only by hiding tabs. A professor who calls an admin action directly must be refused.
- Roles belong to individual accounts and can be reassigned, so the next CICRep can take over without a code change.

## Dashboard

Both roles see the same dashboard. It should feel like a Power BI report: key numbers on top, interactive charts below, everything filterable. It shows the current academic year by default.

**Headline numbers**

- Placed, unplaced and placement % (placed out of 70)
- Placed : unplaced ratio
- Highest, lowest, mean, median and mode CTC for the selected year (definitions under Rules and calculations)

**Charts**

- Placed vs unplaced (donut)
- Placement type split: PPO, FTE, FTE + Intern
- Sector-wise placements (bar)
- Company-wise placements (bar), with a toggle to switch between company-wise and sector-wise views (our reading of the senior's "toggle bar company", to confirm)
- CTC distribution by salary band (histogram)
- Placements over time (cumulative line), with last year's line overlaid

**Interactions**

- Year selector, defaulting to the current year
- Click a chart segment to filter every other chart and card
- Hover tooltips with exact counts
- Date comparison: pick a date and compare the number placed so far this year with the number placed by the same date last year

**UX requirements**

- Loading skeletons, and a friendly empty state when there is no data yet
- Works on a phone and a laptop
- Chart colours that stay readable without relying on colour alone

## Data entry (admin only)

The CICRep maintains one row per student, 70 in total. The 70 names already exist and are loaded once, so the CICRep only fills in placement details.

| Column | Input | Rule |
| --- | --- | --- |
| Roll no | Read-only | Unique, loaded from the existing list |
| Name | Read-only | Loaded from the existing list |
| Company | Dropdown of known companies, with "add new" | Required unless type is NA |
| Sector | Dropdown | Auto-filled from the company; required unless type is NA |
| Placement type | Dropdown: PPO, FTE, FTE + Intern, NA | Required |
| Salary (CTC, LPA) | Number | Single value or range, see Open questions |
| Offer date | Date | Drives the over-time chart and last-year comparison (our addition) |

- Edit inline in a table, with search by name or roll no and a filter by placement type.
- Choosing NA clears company, sector and salary.
- Validate before saving, and make unsaved changes obvious.
- Support CSV import for bulk loading, including the initial 70 and past years.
- Keep edits recoverable (change history or soft delete), since this is the single source of truth.

## Calendar

The calendar shows the companies coming to campus, as a month view plus an upcoming-first list. The admin adds, edits and removes entries.

Each entry carries the fields from the senior's notes:

| Field | Notes |
| --- | --- |
| Company | Linked to the company record |
| Drive date | Date of the visit |
| HR | Name of the HR contact |
| Phone | HR phone number (the notes say "no", read as number) |
| Email | HR email address |
| Status | Proposed values: Upcoming, Confirmed, Completed, Cancelled (to confirm) |
| PVR | Meaning unknown, see Open questions |

Professors get a read-only view by the working default.

## Data model

Five entities. Field names are suggestions; keep the meaning.

| Entity | Fields | Notes |
| --- | --- | --- |
| User | id, email, name, role (admin or professor) | One account per CICRep and per professor |
| Student | roll\_no (unique), name | Seeded with the 70 existing names |
| Company | id, name, sector | Sector comes from a fixed list, so "TCS" and "tcs" never split a chart |
| Placement | id, roll\_no, company (empty if NA), type, ctc, offer\_date, academic\_year | Type is PPO, FTE, FTE\_INTERN or NA |
| Drive | id, company, date, hr\_name, hr\_phone, hr\_email, status, pvr | Powers the calendar |

A company has many placements and many drives. A student has one placement row, or more if multiple offers are allowed (see Open questions).

**Allowed values**

- Placement type: PPO, FTE, FTE + Intern (full-time offer with a 6-month internship), NA
- Sector: the list in the senior's photo, still to be typed out

## Rules and calculations

Everything on the dashboard is derived from the placement rows, and nothing is stored twice. These are working definitions: the senior did not specify them, so change them if he disagrees.

- **Placed** means the placement type is PPO, FTE or FTE + Intern. **Unplaced** means NA.
- **Placement %** is placed ÷ 70 × 100. The **ratio** is placed : unplaced.
- **CTC stats** (mean, median, highest, lowest) run over placed students who have a CTC, for the selected academic year only. Internship stipends are not CTC.
- **Mode** is the most common CTC value. If every CTC is different, which is likely with 70 students, show the most common salary band instead (for example 6 to 8 LPA) and label it as a band.
- **Current year** is the selected academic year, defaulting to the latest.
- **Last-year comparison**: for a chosen date, count students whose offer date falls on or before that day and month, for this year and for last year.
- Compute all stats in one shared, unit-tested function so every card and chart agrees.

## Open questions

Confirm these with the senior before building the parts they touch.

1. What does "PVR" mean in the calendar fields (Company, HR, no, email, status, PVR)?
2. "Streams - photo hai": the sector list exists only as a photo. Someone needs to type it out so it can become the sector dropdown.
3. Salary: is it one CTC per student, or a range per company ("range of salaries")? Mean, median and mode need one number per student.
4. Can professors see the calendar? The notes say yes, the first brief said dashboard only. Working default: a read-only calendar.
5. Should professors see individual student names and CTCs, or only aggregates? This is real students' data, so check what the department is comfortable with.
6. "Toggle bar company": we read it as a switch between company-wise and sector-wise views. Is that right?
7. Last year's data: does it exist, and who loads it? The comparison needs last year's placements with offer dates.
8. Multiple offers: can one student hold more than one? The dashboard must count each student once.
9. Do PPOs count in the CTC statistics?
10. How do users sign in? The method is undecided, but it must identify each person and map them to a role.

## Glossary

| Term | Meaning |
| --- | --- |
| CICRep | Our department's placement representative, and the only admin |
| PPO | Pre-placement offer: a job offer made to a student after an internship |
| FTE | Full-time employee offer |
| FTE + Intern | Full-time offer that starts with a 6-month internship ("fte+6month" in the notes) |
| NA | Not placed, no offer |
| CTC | Cost to company: the yearly salary package |
| LPA | Lakhs per annum |
| Sector / stream | The industry a company belongs to (the notes say "streams") |
| Drive | A company's recruiting visit to campus |

## Senior's original notes

Kept exactly as written, so nobody has to guess what the senior meant.

```text
median , mode , avg ctc for the current year
interactive data
ratio
placed/unplaced

70 people
Admin / profs

Admin
He can upload
70 people name (alr upload)
Company name
Streams - photo hai
Range of salaries
Ppo fte fte+6month

Prof
Should see the calender and dashboard

Put the date and compare with the last year's data ( no of people )
Toggle bar company

Calender in which next companies will be shown
Company  hr  no  email  status  pvr
```
