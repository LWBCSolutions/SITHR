-- Seed calendar events for UK employers: 2026-2027
-- Categories: legislation, awareness, religious, cultural, economic

INSERT INTO calendar_events (title, description, action_points, category, start_date, end_date, all_day, source_url, pinned) VALUES

-- ======================================================================
-- LEGISLATION: Key dates for employment law changes
-- ======================================================================

('SSP payable from day one', 'Statutory Sick Pay is now payable from the first day of sickness absence. Waiting days have been abolished and the lower earnings limit has been removed. SSP is 80% of average weekly earnings, capped at 123.25 per week.', 'Update payroll systems to remove the 3 waiting day deduction. Update sickness absence policies to reflect day-one SSP entitlement. Brief managers on the change.', 'legislation', '2026-04-06', NULL, true, 'https://www.gov.uk/statutory-sick-pay', true),

('National Living Wage increases', 'NLW for workers aged 21 and over increases to 12.71 per hour. NMW for 18 to 20 year olds increases to 10.85 per hour. Under 18 rate is 8.00 per hour. Apprentice rate is 7.55 per hour.', 'Update all payroll rates from 6 April. Check no worker falls below the new minimum. Review any pay scales pegged to NLW.', 'legislation', '2026-04-06', NULL, true, 'https://www.gov.uk/national-minimum-wage-rates', true),

('Fair Work Agency launches', 'The Fair Work Agency becomes operational, consolidating enforcement of minimum wage, holiday pay, and statutory pay rights. The Agency can investigate proactively, impose civil penalties of up to 200% of arrears, and prosecute. Employers must keep annual leave and holiday pay records for 6 years.', 'Audit all pay records immediately. Ensure annual leave records go back at least 6 years. Check NMW compliance across all workers including salaried staff on long hours.', 'legislation', '2026-04-07', NULL, true, NULL, true),

('Paternity leave becomes day-one right', 'Paternity leave of 2 weeks is now available from the first day of employment. No qualifying period. Statutory Paternity Pay requires 26 weeks continuous service and minimum earnings.', 'Update paternity leave policies to remove any qualifying period for leave. Note the distinction between leave entitlement (day one) and pay entitlement (26 weeks).', 'legislation', '2026-04-06', NULL, true, NULL, false),

('Unpaid parental leave becomes day-one right', 'Unpaid parental leave of 18 weeks per child (up to age 18) is now available from the first day of employment. Previously required 1 year of service.', 'Update parental leave policies to remove the qualifying period. Ensure managers know this right exists from day one.', 'legislation', '2026-04-06', NULL, true, NULL, false),

('Whistleblowing covers sexual harassment', 'Qualifying disclosures under Part IVA of the Employment Rights Act 1996 now expressly include disclosures about sexual harassment. This means workers who report sexual harassment have full whistleblowing protection from day one with uncapped compensation.', 'Update whistleblowing policies to include sexual harassment as an example of a qualifying disclosure. Brief managers on the expanded protection.', 'legislation', '2026-04-06', NULL, true, NULL, false),

('6-year annual leave record keeping duty', 'Employers are now required by law to keep records of annual leave and holiday pay for all workers for a minimum of 6 years. The Fair Work Agency can request these records for inspection at any time.', 'Implement or audit your annual leave record-keeping system. Ensure records are retained for 6 years minimum. Check that records cover all worker types including casual, zero-hours, and agency staff.', 'legislation', '2026-04-06', NULL, true, NULL, true),

('Employment tribunal time limits extend to 6 months', 'The time limit for bringing most employment tribunal claims extends from 3 months less one day to 6 months less one day from the date of the act complained of. This applies to unfair dismissal, discrimination, whistleblowing, and most other ET claims.', 'Update settlement agreement timelines. Review any ongoing disputes where you assumed a 3-month deadline. Brief managers that former employees now have 6 months to bring claims.', 'legislation', '2026-10-01', NULL, true, NULL, true),

('Fire and rehire restrictions take effect', 'New restrictions on dismissal and re-engagement (fire and rehire) come into force. Employers must follow a strengthened consultation process and dismissal for failing to accept new terms may be automatically unfair in certain circumstances.', 'Review any planned contract variation exercises. Ensure legal advice is obtained before any dismissal and re-engagement process. Update policies on contract changes.', 'legislation', '2026-10-01', NULL, true, NULL, false),

('Harassment prevention duty strengthened', 'The employer duty to prevent sexual harassment under the Worker Protection Act 2023 strengthens from "reasonable steps" to "all reasonable steps". This higher standard means employers must demonstrate comprehensive prevention measures.', 'Conduct a full risk assessment for sexual harassment across all work settings. Review and enhance prevention training. Check that reporting procedures are accessible and effective. Document all steps taken.', 'legislation', '2026-10-01', NULL, true, NULL, true),

('Unfair dismissal qualifying period reduces to 6 months', 'The qualifying period for ordinary unfair dismissal claims reduces from 2 years to 6 months of continuous service. The compensatory award cap is abolished entirely. This is the most significant change to unfair dismissal law in decades.', 'Review all dismissal procedures immediately. Every employee with 6 or more months of service will have full unfair dismissal rights. The removal of the compensation cap means unlimited financial exposure. Probationary periods must be managed with the same rigour as any other dismissal.', 'legislation', '2027-01-01', NULL, true, NULL, true),

-- ======================================================================
-- AWARENESS: Mental health, wellbeing, and workplace campaigns
-- ======================================================================

('Mental Health Awareness Week', 'Mental Health Foundation awareness week. This year focuses on community and connection. Employers should use this week to promote wellbeing support, review mental health policies, and encourage open conversations.', 'Share EAP details with all staff. Consider a wellbeing check-in or team activity. Review your mental health at work policy. Display awareness materials in communal areas.', 'awareness', '2026-05-11', '2026-05-17', true, 'https://www.mentalhealth.org.uk/mhaw', false),

('Carers Week', 'Annual awareness week highlighting the challenges faced by unpaid carers. Around 1 in 7 workers are juggling work and caring responsibilities. Many carers do not disclose their status to their employer.', 'Review your flexible working policy for carers. Publicise any carer support your organisation offers. Consider whether your absence and leave policies account for emergency caring responsibilities.', 'awareness', '2026-06-08', '2026-06-14', true, 'https://www.carersweek.org', false),

('National Inclusion Week', 'Annual campaign to raise awareness of inclusion in the workplace. Themes include belonging, equity, allyship, and accessible workplaces.', 'Review your EDI policies and training schedule. Consider running an inclusion audit or staff survey. Check that reasonable adjustments processes are accessible and effective.', 'awareness', '2026-09-28', '2026-10-04', true, NULL, false),

('World Mental Health Day', 'World Health Organization annual awareness day. An opportunity for employers to take stock of their mental health support provision and check in with their workforce.', 'Promote your EAP and wellbeing resources. Consider a manager briefing on mental health awareness. Review your stress risk assessment.', 'awareness', '2026-10-10', NULL, true, NULL, false),

('Anti-Bullying Week', 'Annual campaign focusing on bullying prevention. Relevant to workplace dignity and respect policies.', 'Review your dignity at work and anti-bullying policies. Consider refresher training for managers on recognising and addressing bullying. Share reporting channels with all staff.', 'awareness', '2026-11-16', '2026-11-20', true, NULL, false),

('Disability History Month', 'UK annual event celebrating disabled people and raising awareness of disability rights. Relevant to Equality Act 2010 obligations and reasonable adjustments.', 'Review your reasonable adjustments processes. Check that disability leave policies are fit for purpose. Consider disability awareness training for managers and teams.', 'awareness', '2026-11-18', '2026-12-18', true, NULL, false),

('Stress Awareness Month', 'Health and Safety Executive campaign highlighting workplace stress. Employers have a legal duty to assess and manage stress at work under the Management of Health and Safety at Work Regulations 1999.', 'Conduct or review workplace stress risk assessments. Promote your EAP and mental health first aiders. Check that workloads and staffing levels are reasonable.', 'awareness', '2027-04-01', '2027-04-30', true, NULL, false),

-- ======================================================================
-- RELIGIOUS: Key observances employers should be aware of
-- ======================================================================

('Ramadan begins (approximate)', 'The Islamic holy month of fasting from dawn to sunset. Muslim employees may be fasting during working hours, which can affect energy levels particularly in physically demanding roles. Flexible working, adjusted break times, and understanding are recommended.', 'Consider flexible start and finish times for fasting employees. Be mindful of scheduling meetings during iftar time. Avoid scheduling mandatory social events involving food during Ramadan. Ensure rest break facilities are available.', 'religious', '2026-02-18', '2026-03-19', true, NULL, false),

('Eid al-Fitr (approximate)', 'Marks the end of Ramadan. One of the most important celebrations in the Islamic calendar. Muslim employees may request leave.', 'Approve annual leave requests where operationally possible. Be aware that the exact date depends on moon sighting and may change at short notice.', 'religious', '2026-03-20', '2026-03-21', true, NULL, false),

('Passover (Pesach)', 'Major Jewish festival lasting 8 days. Jewish employees may request leave, particularly for the first and last two days.', 'Approve annual leave requests where possible. Be aware of dietary requirements if catering is provided at work events during this period.', 'religious', '2026-04-02', '2026-04-10', true, NULL, false),

('Easter (Good Friday and Easter Monday)', 'Christian holy days. Good Friday and Easter Monday are public holidays in England and Wales. Employees on standard contracts are entitled to these as paid days off unless their contract states otherwise.', 'Ensure bank holiday arrangements are communicated to all staff. Check that part-time and shift workers receive their pro-rata bank holiday entitlement.', 'religious', '2026-04-03', '2026-04-06', true, NULL, false),

('Vaisakhi', 'One of the most important dates in the Sikh calendar, marking the founding of the Khalsa. Sikh employees may request leave.', 'Approve annual leave requests where operationally possible.', 'religious', '2026-04-13', NULL, true, NULL, false),

('Eid al-Adha (approximate)', 'One of the two major Islamic festivals. Muslim employees may request leave. The date is determined by the Islamic lunar calendar.', 'Approve annual leave requests where operationally possible. Be aware that the exact date may change at short notice.', 'religious', '2026-05-27', '2026-05-28', true, NULL, false),

('Diwali', 'Hindu, Sikh, and Jain festival of lights. One of the most widely celebrated festivals in the UK. Employees may request leave.', 'Approve annual leave requests where operationally possible. Consider acknowledging the festival in workplace communications.', 'religious', '2026-11-08', NULL, true, NULL, false),

('Hanukkah', 'Jewish festival of lights lasting 8 days. Jewish employees may request leave, particularly for the first evening.', 'Approve annual leave requests where operationally possible.', 'religious', '2026-12-05', '2026-12-13', true, NULL, false),

('Christmas Day and Boxing Day', 'Christian celebrations and public holidays. Most employees are entitled to these as paid days off. Employers in care, hospitality, retail, and essential services should ensure fair rota arrangements.', 'Publish Christmas rota arrangements early. Ensure bank holiday pay is correct. Check that staff who work these days receive their entitlement (enhanced pay or time off in lieu as per contract).', 'religious', '2026-12-25', '2026-12-26', true, NULL, false),

-- ======================================================================
-- CULTURAL: Key dates and public holidays
-- ======================================================================

('May Day Bank Holiday', 'Public holiday in England and Wales.', 'Ensure bank holiday arrangements are communicated. Check part-time worker pro-rata entitlement.', 'cultural', '2026-05-04', NULL, true, NULL, false),

('Spring Bank Holiday', 'Public holiday in England and Wales.', 'Ensure bank holiday arrangements are communicated. Check part-time worker pro-rata entitlement.', 'cultural', '2026-05-25', NULL, true, NULL, false),

('Summer Bank Holiday', 'Public holiday in England and Wales.', 'Ensure bank holiday arrangements are communicated. Check part-time worker pro-rata entitlement.', 'cultural', '2026-08-31', NULL, true, NULL, false),

('Black History Month', 'Annual observance in the UK during October, celebrating the contributions of Black people to British culture and society. An opportunity for employers to review their EDI commitments.', 'Review your EDI strategy and training programme. Consider hosting awareness events or sharing educational resources. Check that recruitment processes are genuinely inclusive.', 'cultural', '2026-10-01', '2026-10-31', true, NULL, false),

('LGBT+ History Month', 'UK awareness month celebrating the history and achievements of LGBT+ people. An opportunity for employers to review their inclusion policies.', 'Review your EDI policies for LGBT+ inclusion. Check that your anti-harassment policy explicitly covers sexual orientation and gender reassignment. Consider awareness activities.', 'cultural', '2027-02-01', '2027-02-28', true, NULL, false),

('International Women''s Day', 'Global day celebrating women''s social, economic, cultural, and political achievements. A prompt for employers to review gender pay gaps and equality measures.', 'Review your gender pay gap data. Check that maternity and pregnancy policies are up to date. Consider whether flexible working options support gender equality in your organisation.', 'cultural', '2027-03-08', NULL, true, NULL, false),

-- ======================================================================
-- ECONOMIC: Pay, tax, and business dates
-- ======================================================================

('New tax year begins', 'Start of the 2026-27 UK tax year. New NLW, NMW, SSP, SMP, and other statutory rates take effect. Income tax thresholds and National Insurance rates may change.', 'Ensure all payroll rates are updated. Issue new tax codes. Check employer NIC calculations. Update any pay scales linked to statutory rates.', 'economic', '2026-04-06', NULL, true, NULL, true),

('P60 deadline', 'Deadline to issue P60 end of year certificates to all employees who were employed on 5 April 2026. Penalty for late issue.', 'Issue P60s to all employees on the payroll as at 5 April 2026. Retain copies for your records.', 'economic', '2026-05-31', NULL, true, NULL, false),

('Employer NIC increase takes effect', 'Employer National Insurance contributions increase to 15% from 6 April 2025 (already in effect). The secondary threshold reduced to 5,000 per year. Employment Allowance increased to 10,500 per year.', 'Review the impact on your payroll costs. Check whether you qualify for the increased Employment Allowance. Consider the cost implications for new hires.', 'economic', '2026-04-06', NULL, true, NULL, false),

('Auto-enrolment duties review date', 'Review your workplace pension auto-enrolment compliance. Minimum contributions remain at 8% (3% employer, 5% employee). Check that all eligible workers are enrolled and contributions are calculated correctly.', 'Run an auto-enrolment audit. Check for any staff who may have been missed. Verify contribution percentages are correct. Check opt-out records are properly maintained.', 'economic', '2026-04-06', NULL, true, NULL, false),

('Q2 employer RTI deadline', 'Ensure all Real Time Information (RTI) submissions are up to date with HMRC for the first quarter of 2026-27.', 'Check that all FPS and EPS submissions are accurate and on time. Reconcile any discrepancies.', 'economic', '2026-07-05', NULL, true, NULL, false),

('October statutory changes take effect', 'ET time limits extend to 6 months. Fire and rehire restrictions commence. Harassment prevention duty strengthens to "all reasonable steps". Multiple employment law changes take effect simultaneously.', 'Brief all managers on the changes. Update relevant policies. Review any ongoing disputes or processes that may be affected by the extended ET time limits.', 'economic', '2026-10-01', NULL, true, NULL, true),

('New tax year 2027-28', 'Start of the 2027-28 UK tax year. Check for rate changes to NLW, NMW, SSP, SMP, and other statutory payments.', 'Update all payroll rates. Check HMRC guidance for any changes. Update pay scales and contracts where linked to statutory rates.', 'economic', '2027-04-06', NULL, true, NULL, false)

ON CONFLICT DO NOTHING;
