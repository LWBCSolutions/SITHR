-- SIT-HR News Articles - Full Library
-- Paste into Supabase SQL Editor and run
-- All articles based on England & Wales law as at April 2026

-- Article 2: January 2027 Qualifying Period
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'January 2027 - What Every Employer Must Do Before the Qualifying Period Changes',
'january-2027-qualifying-period-changes',
'legislation',
'From 1 January 2027, employees qualify for unfair dismissal protection after just 6 months. Compensation becomes uncapped on the same date. If your HR processes are not in order before then, the financial exposure is significant.',
E'## What Changes on 1 January 2027\n\nTwo changes under the Employment Rights Act 2025 take effect simultaneously on 1 January 2027. Together they represent the most significant shift in unfair dismissal law in decades.\n\n## Change 1 - The Qualifying Period Drops to 6 Months\n\nCurrently, employees need 2 years of continuous service before they can bring an ordinary unfair dismissal claim. From 1 January 2027, that threshold drops to 6 months.\n\nIn practical terms, this means:\n- Any employee who has worked for you for more than 6 months has unfair dismissal protection\n- Poor HR process on any dismissal after that date carries tribunal risk\n- Dismissals of employees in months 7-24 of employment - previously low risk - become high risk overnight\n\n## Change 2 - The Compensation Cap Is Abolished\n\nCurrently, the compensatory award in unfair dismissal claims is capped at the lower of 52 weeks pay or £123,543. From 1 January 2027, that cap is gone entirely.\n\nThe Acas 25% uplift for procedural failures also applies to the uncapped award.\n\n## What You Need to Do Before January 2027\n\n- Audit your dismissal processes now\n- Review your documentation standards\n- Check your probationary process\n- Review any ongoing performance or conduct concerns\n\n---\n\nThis article provides general guidance based on the law as at April 2026. Seek qualified legal advice for your specific situation.',
true, true, true
) ON CONFLICT (slug) DO NOTHING;

-- Article 3: Fair Work Agency
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'The Fair Work Agency - What It Means for Care Providers',
'fair-work-agency-care-providers',
'legislation',
'The Fair Work Agency launched on 7 April 2026 with powers to investigate employers proactively, without waiting for a complaint. Care providers with informal payroll practices are among the highest-risk employers.',
E'## What Is the Fair Work Agency\n\nThe Fair Work Agency (FWA) is a new single enforcement body that launched on 7 April 2026. It consolidates three previously separate enforcement functions:\n\n- HMRC National Minimum Wage enforcement\n- Employment Agency Standards Inspectorate\n- Gangmasters and Labour Abuse Authority\n\n## The Key Change - Proactive Investigation\n\nThe FWA can now open investigations without any complaint being made, target sectors based on its own intelligence, conduct spot checks, and investigate across multiple compliance areas in a single inspection.\n\n## What the FWA Can Do\n\n- Enter business premises to inspect records\n- Impose penalties of up to 200% of underpayments (maximum £20,000 per worker)\n- Investigate arrears going back 6 years\n- Pursue criminal prosecution for obstruction or false records\n\n## Annual Leave Records - A New Criminal Duty\n\nFrom 6 April 2026, all employers must keep records of annual leave and holiday pay for all workers. Records must be retained for 6 years. Failure is a criminal offence.\n\n---\n\nThis article provides general guidance based on the law as at April 2026. Seek qualified legal advice for your specific circumstances.',
true, false, true
) ON CONFLICT (slug) DO NOTHING;

-- Article 4: Bradford Factor
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'Bradford Factor - How to Implement It Correctly and Legally',
'bradford-factor-correct-implementation',
'guidance',
'The Bradford Factor is a useful absence management tool but using it incorrectly - or applying it without telling staff - creates more legal risk than it resolves.',
E'## What the Bradford Factor Is\n\nThe Bradford Factor is a formula used to measure the disruptive impact of short-term absence. Formula: B = S squared x D (S = number of separate absence spells, D = total days absent).\n\n## The Legal Requirements\n\n- The policy must be written and communicated\n- Return to work conversations are mandatory before scoring\n- Disability-related absences must be excluded or discounted\n- Pregnancy-related absences must be excluded entirely\n- Statutory family leave is excluded\n- Must be applied consistently across all staff\n\n---\n\nThis article provides general guidance based on the law as at April 2026.',
true, false, false
) ON CONFLICT (slug) DO NOTHING;

-- Article 5: Reasonable Adjustments
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'Reasonable Adjustments - The Day One Duty Most Employers Miss',
'reasonable-adjustments-day-one-duty',
'guidance',
'The duty to make reasonable adjustments applies from the first day of employment and during recruitment. It does not require a formal diagnosis.',
E'## The Basic Duty\n\nUnder sections 20 and 21 of the Equality Act 2010, employers have a duty to make reasonable adjustments where a provision, criterion, or practice puts a disabled person at a substantial disadvantage.\n\nThe duty applies from day one of employment and during recruitment.\n\n## The Constructive Knowledge Test\n\nYou do not need to have been formally told about a disability to be liable. The test is whether you knew, or could reasonably have been expected to know.\n\n---\n\nThis article provides general guidance based on the law as at April 2026.',
true, false, false
) ON CONFLICT (slug) DO NOTHING;

-- Article 6: Disciplinary Mistakes
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'Disciplinary Process - The Five Mistakes That Lose Tribunals',
'disciplinary-five-mistakes-tribunals',
'tribunal',
'Most employers who lose unfair dismissal claims did not lose because their decision was wrong. They lost because their process was flawed.',
E'## Why Process Matters More Than Decision\n\nTribunals apply the range of reasonable responses test - would a reasonable employer have made the same decision?\n\n## The Five Mistakes\n\n1. The same person investigates and hears\n2. Inadequate investigation\n3. Evidence not provided in advance\n4. The decision was already made\n5. No right of appeal or appeal to the same person\n\n## The Cost\n\nAcas 25% uplift on compensatory award. From January 2027, that applies to an uncapped award.\n\n---\n\nThis article provides general guidance based on the law as at April 2026.',
true, false, false
) ON CONFLICT (slug) DO NOTHING;

-- Article 7: Grievance Handling
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'Grievance Handling - Why Procedure Matters More Than the Decision',
'grievance-handling-procedure',
'guidance',
'An employer who investigates properly and reaches a reasonable conclusion is protected - even if the grievance is not upheld.',
E'## The Purpose of a Grievance Procedure\n\nA grievance procedure gives employees a fair mechanism for raising concerns and gives employers a structured way to respond.\n\n## The Five Stages\n\n1. Receipt and acknowledgement\n2. Investigation\n3. Hearing\n4. Decision\n5. Appeal\n\n## High-Risk Scenarios\n\n- Protected disclosure elements\n- Discrimination or harassment allegations\n- Senior management implicated\n\n---\n\nThis article provides general guidance based on the law as at April 2026.',
true, false, false
) ON CONFLICT (slug) DO NOTHING;

-- Article 8: SSP Changes
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'SSP Changes April 2026 - Day One Entitlement Explained',
'ssp-changes-april-2026',
'legislation',
'SSP changed fundamentally on 6 April 2026. Waiting days abolished, lower earnings limit removed, payable from day one.',
E'## What Changed\n\n1. Waiting days abolished - SSP payable from day one\n2. Lower earnings limit removed - all employees qualify\n3. Rate: £123.25/week or 80% of average weekly earnings (lower)\n\n## What to Check\n\n- Payroll system updated\n- Sickness absence policy updated\n- Contracts updated\n\n---\n\nThis article provides general guidance based on the law as at April 2026.',
true, false, false
) ON CONFLICT (slug) DO NOTHING;

-- Article 9: Protected Disclosures in Care
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'Protected Disclosures in Care - When a Complaint Becomes a Whistleblowing Claim',
'protected-disclosures-care-sector',
'tribunal',
'In care settings, a support worker who raises safety concerns - even informally, even via WhatsApp - may have made a protected disclosure.',
E'## What Is a Protected Disclosure\n\nA communication that discloses information the worker reasonably believes tends to show a criminal offence, breach of legal obligation, danger to health and safety, or (from April 2026) sexual harassment.\n\n## Section 100 ERA 1996\n\nProtects employees who leave or refuse to work in circumstances of serious and imminent danger. Automatically unfair, no qualifying period, uncapped compensation.\n\n## The Critical Distinction\n\nDisciplinary must be framed around failure to follow procedure, not the decision to leave.\n\n---\n\nThis article provides general guidance based on the law as at April 2026.',
true, false, true
) ON CONFLICT (slug) DO NOTHING;

-- Article 10: Zero Hours
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'Zero Hours Contracts in 2026 - What the Employment Rights Act Changes',
'zero-hours-contracts-2026',
'legislation',
'The Employment Rights Act 2025 introduces new rights for zero hours and low hours workers. The guaranteed hours provisions are not yet in force.',
E'## The Current Position\n\nZero hours contracts are lawful. The main restriction is the prohibition on exclusivity clauses.\n\n## What Is Coming\n\nRight to guaranteed hours for eligible workers. Not yet in force - secondary legislation required.\n\n## What Is Already Required\n\n- Holiday pay calculated correctly\n- NMW for all hours worked\n- Annual leave records from April 2026\n- Written statement of particulars\n\n---\n\nThis article provides general guidance based on the law as at April 2026.',
true, false, false
) ON CONFLICT (slug) DO NOTHING;

-- Article 11: Constructive Dismissal
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'Constructive Dismissal - What It Is and How It Arises',
'constructive-dismissal-explained',
'tribunal',
'Constructive dismissal claims arise when an employer''s conduct forces an employee to resign. More common than many managers realise.',
E'## What Constructive Dismissal Is\n\nOccurs when an employee resigns in response to a fundamental breach of contract by the employer (ERA 1996 s.95(1)(c)).\n\n## The Legal Test (Western Excavating v Sharp [1978])\n\n1. Fundamental breach of contract by employer\n2. Employee resigned in response to that breach\n3. Employee did not affirm the breach by continuing to work\n\n## How It Arises in Practice\n\n- Sustained unreasonable management conduct\n- Unilateral changes to terms\n- Failure to address grievances\n- Failure to address harassment\n\n---\n\nThis article provides general guidance based on the law as at April 2026.',
true, false, false
) ON CONFLICT (slug) DO NOTHING;

-- Article 12: Documentation
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES (
'Supervision and Documentation - Why Your File Is Your Defence',
'supervision-documentation-defence',
'guidance',
'Gaps in supervision records, undocumented conversations, and inconsistent file notes are among the most common reasons employers lose tribunal cases they should have won.',
E'## The Documentation Problem in Care\n\nManagers are operationally focused. Supervision gets deprioritised. Informal concerns are raised verbally and never written down. By the time a formal process begins, the record is thin.\n\n## What Good Documentation Looks Like\n\n- Supervision records (monthly new starters, quarterly minimum)\n- Return to work conversations (every absence)\n- File notes (any significant conversation)\n- Incident records\n\n## The Consistency Requirement\n\nDocumentation must be applied consistently. Selective documentation undermines your case.\n\n---\n\nThis article provides general guidance based on the law as at April 2026.',
true, false, false
) ON CONFLICT (slug) DO NOTHING;

-- Notification: January 2027 reminder
INSERT INTO app_notifications (type, title, message, cta_text, cta_link, active, starts_at, expires_at, dismissible)
VALUES (
'alert',
'Action Required Before January 2027',
'From 1 January 2027, employees qualify for unfair dismissal protection after 6 months and compensation becomes uncapped. Your documentation and processes need to be in order before that date.',
'Read What You Need to Do',
'/news/january-2027-qualifying-period-changes',
true,
NOW(),
'2027-02-01 00:00:00+00',
true
) ON CONFLICT DO NOTHING;

-- Notification: Annual leave records banner
INSERT INTO app_notifications (type, title, message, cta_text, cta_link, active, starts_at, expires_at, dismissible)
VALUES (
'banner',
'Annual leave records - legal duty from 6 April 2026',
'Keeping annual leave records for all staff - including bank and zero hours workers - is now a legal requirement. Records must be retained for 6 years. Failure is a criminal offence.',
'Read More',
'/news/fair-work-agency-care-providers',
true,
NOW(),
'2026-12-31 23:59:59+00',
true
) ON CONFLICT DO NOTHING;
