export interface DocumentTemplate {
  id: string;
  title: string;
  category: 'absence' | 'disciplinary' | 'grievance' | 'capability' | 'general' | 'email';
  tier: 1 | 2;
  description: string;
  triggers: string[];
  content: string;
  reviewNotice: string;
}

export const documentLibrary: DocumentTemplate[] = [
  {
    id: 'return_to_work_record',
    title: 'Return to Work Interview Record',
    category: 'absence',
    tier: 1,
    description: 'Structured record of the return to work conversation following any absence. Required before Bradford Factor can be operated.',
    triggers: ['return to work', 'returning from absence', 'back to work', 'first day back'],
    reviewNotice: 'This document should be reviewed before use to ensure it reflects your organisation specific policies and circumstances.',
    content: `RETURN TO WORK INTERVIEW RECORD

Organisation: [INSERT: Organisation name]
Case Reference: [INSERT: Case reference number]

SECTION 1 - EMPLOYEE DETAILS

Employee Name: [INSERT: Employee full name]
Job Title: [INSERT: Job title]
Department: [INSERT: Department]
Line Manager: [INSERT: Line manager name]
Date of Interview: [INSERT: Date of return to work interview]
Location of Interview: [INSERT: Location or meeting room]

SECTION 2 - ABSENCE DETAILS

First Day of Absence: [INSERT: First day of absence]
Last Day of Absence: [INSERT: Last day of absence]
Total Working Days Lost: [INSERT: Number of working days lost]
Self-Certification Provided: Yes / No
Fit Note Provided: Yes / No
Fit Note Dates Covered: [INSERT: Fit note date range if applicable]
Was absence notified in accordance with reporting procedure: Yes / No
If no, detail the discrepancy: [INSERT: Details of reporting failure if applicable]

SECTION 3 - REASON FOR ABSENCE

Please record the reason for absence in the employee's own words. Do not press for clinical detail beyond what is voluntarily offered.

[INSERT: Reason for absence as described by the employee]

Is this absence related to a previously recorded absence: Yes / No
If yes, provide details: [INSERT: Previous related absence details]

SECTION 4 - HEALTH AND DISABILITY

The purpose of this section is to understand functional impact only - not to obtain a diagnosis.

Does the employee report any ongoing functional limitations affecting their work: Yes / No
If yes, describe the functional impact: [INSERT: Description of functional limitations affecting work tasks]

Does the employee consider themselves to have a disability as defined by the Equality Act 2010: Yes / No / Prefer not to say
If yes or possibly, has a reasonable adjustments discussion taken place: Yes / No
Details of any adjustments discussed: [INSERT: Adjustments discussed or agreed]

SECTION 5 - PREGNANCY CHECK

Is the absence pregnancy-related: Yes / No
Note: Pregnancy-related absence must be recorded separately and must not be counted in Bradford Factor calculations or used in any absence management procedure.

SECTION 6 - ACTION AND SUPPORT

Occupational Health Referral Recommended: Yes / No
If yes, reason for referral: [INSERT: Reason for OH referral]
Employee consent obtained for OH referral: Yes / No

Workplace Adjustments Required: Yes / No
If yes, describe adjustments: [INSERT: Workplace adjustments to be implemented]

Employee Assistance Programme (EAP) Information Provided: Yes / No
Other support discussed: [INSERT: Any other support discussed or agreed]

SECTION 7 - BRADFORD FACTOR

Current Bradford Factor Score: [INSERT: Current Bradford Factor score]
Threshold Stage Reached: None / Stage 1 / Stage 2 / Stage 3
Has the employee been informed of their current Bradford Factor score: Yes / No
Has the relevant threshold procedure been explained: Yes / No

SECTION 8 - REPORTING PROCEDURE

Employee has been reminded of the absence reporting procedure: Yes / No
Expected contact person: [INSERT: Name or role for absence reporting]
Expected contact time: [INSERT: Time by which absence must be reported]
Expected method of contact: [INSERT: Phone, email, or other method]

SECTION 9 - EMPLOYEE COMMENTS

[INSERT: Any comments the employee wishes to make]

SECTION 10 - MANAGER SUMMARY

[INSERT: Manager summary of the return to work conversation including any agreed actions and follow-up dates]

SIGNATURES

Employee Signature: _______________________ Date: [INSERT: Date]
Manager Signature: _______________________ Date: [INSERT: Date]

Copy provided to employee: Yes / No
Copy placed on personnel file: Yes / No

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'absence_review_invitation',
    title: 'Invitation to Absence Review Meeting',
    category: 'absence',
    tier: 2,
    description: 'Formal invitation to absence review meeting. Use when Bradford Factor threshold is reached or long-term absence review is required.',
    triggers: ['absence review', 'Bradford Factor trigger', 'formal absence meeting', 'stage 1 absence'],
    reviewNotice: 'This is a formal process document. It must be reviewed by a qualified HR professional before use in any formal process.',
    content: `INVITATION TO ABSENCE REVIEW MEETING

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

Invitation to Absence Review Meeting

I am writing to invite you to an absence review meeting. The reason for this meeting is as follows:

[DELETE OPTIONS THAT DO NOT APPLY]

OPTION A - BRADFORD FACTOR TRIGGER
Your absence record has reached the threshold for a formal absence review. Your current Bradford Factor score is [INSERT: Bradford Factor score], which has triggered a Stage [INSERT: Stage number] review under the absence management procedure.

OPTION B - LONG-TERM ABSENCE
You have been continuously absent from work since [INSERT: First day of absence]. We would like to meet with you to discuss your current health, any support we can provide, and to review the position going forward.

OPTION C - PATTERN OF ABSENCE
A pattern has been identified in your absence record which the organisation wishes to discuss with you. The pattern identified is: [INSERT: Description of pattern identified].

[END OF OPTIONS]

The meeting details are as follows:

Date: [INSERT: Meeting date]
Time: [INSERT: Meeting time]
Location: [INSERT: Meeting location or video call link]
Chair: [INSERT: Name and job title of chair]
Note Taker: [INSERT: Name and job title of note taker]
HR Representative: [INSERT: Name of HR representative if attending]

THIS IS NOT A DISCIPLINARY MEETING

This meeting is held under the absence management procedure. Its purpose is to understand your absence, explore whether any support can be provided, and where necessary to set expectations regarding future attendance. It is not a disciplinary hearing and no disciplinary sanction will be issued at this meeting.

RIGHT TO BE ACCOMPANIED

You have the right to be accompanied at this meeting by a trade union representative or a work colleague. If you wish to be accompanied, please confirm the name of your companion in advance of the meeting.

WHAT TO BRING

Please bring any relevant medical evidence, fit notes, or other documentation that you would like to be considered at the meeting. If you have any documents from your GP or specialist that you wish to share, please bring copies.

NEXT STEPS

If you are unable to attend the meeting on the date specified above, please contact [INSERT: Contact name] on [INSERT: Contact phone number or email] as soon as possible to arrange an alternative date. Please note that if you fail to attend without reasonable explanation, the meeting may proceed in your absence.

If you have any questions about this letter or the meeting, please do not hesitate to contact me.

Yours sincerely,

[INSERT: Manager full name]
[INSERT: Manager job title]
[INSERT: Manager contact details]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'long_term_absence_welfare',
    title: 'Long Term Absence Welfare Letter (4 Week)',
    category: 'absence',
    tier: 1,
    description: 'Welfare check letter at 4 weeks of continuous absence. Introduces occupational health referral possibility.',
    triggers: ['long term absence', '4 weeks absent', 'welfare check', 'occupational health referral'],
    reviewNotice: 'This document should be reviewed before use to ensure it reflects your organisation specific policies and circumstances.',
    content: `WELFARE CHECK LETTER - 4 WEEKS CONTINUOUS ABSENCE

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

I am writing to you because you have now been absent from work for four weeks, having been absent since [INSERT: First day of absence]. I wanted to make contact to see how you are and to let you know about the support available to you.

First, I want to reassure you that there is no pressure on you to return to work before you are well enough to do so. Your health and recovery are the priority. The purpose of this letter is simply to keep in touch, to make sure you know what support is available, and to check whether there is anything we can do to help.

KEEPING IN TOUCH

It is helpful for both of us to stay in regular contact during your absence. I would like to suggest that we arrange a telephone call at a time that suits you, so we can have a brief and informal conversation about how you are getting on. This is not a formal meeting and you are under no obligation to discuss medical details beyond what you are comfortable sharing.

Please let me know a convenient day and time for a call, or if you would prefer to communicate in a different way. You can contact me at [INSERT: Manager phone number] or [INSERT: Manager email address].

OCCUPATIONAL HEALTH REFERRAL

Where an employee has been absent for an extended period, the organisation may offer a referral to our occupational health provider. The purpose of an occupational health assessment is to obtain professional advice about any support or adjustments that could help you return to work when you are ready.

An occupational health referral is not compulsory and would only be made with your consent. If you would like to discuss this further, I am happy to explain the process in more detail during our next conversation.

SUPPORT AVAILABLE

I would like to remind you of the following support that is available to you:

Employee Assistance Programme (EAP): Confidential support is available through [INSERT: EAP provider name] on [INSERT: EAP contact number]. This service is free and available 24 hours a day, 7 days a week.

Occupational Health: As mentioned above, we can arrange an occupational health referral with your consent.

Workplace Adjustments: If there are any adjustments to your role or working arrangements that might support your return when you are ready, we are happy to discuss these with you.

Other Support: [INSERT: Any other support available such as phased return, flexible working, or specific organisational support schemes]

KEEPING YOUR ROLE OPEN

I want to confirm that your role remains open and we look forward to welcoming you back when you are well enough to return. There is no time pressure on this letter and no action is required from you other than to stay in touch as you are able.

If there is anything at all that I or the organisation can do to support you during this time, please do not hesitate to let me know.

I wish you well in your recovery.

Yours sincerely,

[INSERT: Manager full name]
[INSERT: Manager job title]
[INSERT: Department]
[INSERT: Manager contact details]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'investigation_meeting_invitation',
    title: 'Invitation to Investigation Meeting',
    category: 'disciplinary',
    tier: 2,
    description: 'Invitation to fact-finding investigation meeting. Not a disciplinary hearing - purpose is to gather information.',
    triggers: ['investigation meeting', 'investigate', 'fact-finding', 'investigation invite'],
    reviewNotice: 'This letter must be reviewed by a qualified HR professional before use. Ensure the description of the matter is factual and does not prejudge the outcome.',
    content: `INVITATION TO INVESTIGATION MEETING

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

Invitation to Investigation Meeting

I am writing to inform you that an investigation is being carried out into the following matter:

[INSERT: Brief factual description of the concern or allegation under investigation. State what is being investigated without making findings or assumptions about the outcome.]

I would like to invite you to attend an investigation meeting so that I can gather information and hear your account. The details are as follows:

Date: [INSERT: Meeting date]
Time: [INSERT: Meeting time]
Location: [INSERT: Meeting location or video call link]
Investigating Officer: [INSERT: Name and job title of investigating officer]
Note Taker: [INSERT: Name and job title of note taker]

THIS IS NOT A DISCIPLINARY HEARING

I want to make clear that this is a fact-finding investigation meeting only. It is not a disciplinary hearing. No decision has been made about whether disciplinary action is appropriate. The purpose of this meeting is to gather information to establish the facts of the matter.

RIGHT TO BE ACCOMPANIED

Although this is not a formal hearing, you have the right to be accompanied at this meeting by a trade union representative or a work colleague. If you wish to be accompanied, please let me know the name of your companion in advance.

WHAT TO EXPECT

During the meeting, I will explain the matter being investigated and ask you questions. You will have the opportunity to give your account, provide any relevant information, and identify any witnesses or evidence you would like to be considered.

Notes will be taken during the meeting. You will be given a copy of the notes and asked to confirm their accuracy.

Following the investigation, I will prepare a report with my findings. If it is determined that there is a case to answer, you will be notified in writing of any further action. If there is no case to answer, you will be informed and the matter will be closed.

[DELETE IF NOT APPLICABLE]
SUSPENSION

You are currently suspended from duty on full pay while this investigation takes place. This suspension is a neutral act and does not imply guilt or that any disciplinary action will follow. During your suspension, the conditions set out in the suspension letter dated [INSERT: Date of suspension letter] continue to apply.
[END DELETE]

If you are unable to attend the meeting on the date above, please contact me as soon as possible on [INSERT: Contact phone number or email] to arrange an alternative date. If you fail to attend without reasonable explanation, the investigation may proceed without your input.

Yours sincerely,

[INSERT: Investigating officer full name]
[INSERT: Investigating officer job title]
[INSERT: Contact details]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'disciplinary_hearing_invitation',
    title: 'Invitation to Disciplinary Hearing',
    category: 'disciplinary',
    tier: 2,
    description: 'Formal invitation to disciplinary hearing. Must include all allegations and all evidence to be relied upon.',
    triggers: ['disciplinary hearing', 'formal hearing', 'disciplinary invite'],
    reviewNotice: 'This letter must be reviewed by a qualified HR professional or employment solicitor before issue. Ensure all allegations are clearly stated and all evidence is enclosed.',
    content: `INVITATION TO DISCIPLINARY HEARING

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

Invitation to Disciplinary Hearing

Following the investigation into the matter referred to in the case reference above, I am writing to inform you that there is a case to answer in respect of the following allegation(s):

Allegation 1: [INSERT: First allegation stated clearly and specifically, including date, location, and nature of the alleged conduct]

Allegation 2: [INSERT: Second allegation if applicable, stated clearly and specifically]

Allegation 3: [INSERT: Third allegation if applicable, stated clearly and specifically]

[INSERT: Additional allegations as required. Each allegation must be numbered and stated separately.]

These allegations are considered to amount to [INSERT: misconduct / gross misconduct] under the organisation's disciplinary procedure.

You are invited to attend a disciplinary hearing as follows:

Date: [INSERT: Hearing date]
Time: [INSERT: Hearing time]
Location: [INSERT: Hearing location]
Hearing Chair: [INSERT: Name and job title of hearing chair]
Note Taker: [INSERT: Name and job title of note taker]
HR Representative: [INSERT: Name of HR representative]
Management Presenting Officer: [INSERT: Name of person presenting the management case]

Please note that the hearing chair was not involved in the investigation and has no prior involvement in this matter.

ENCLOSED EVIDENCE

The following evidence will be relied upon at the hearing and is enclosed with this letter:

1. [INSERT: Investigation report]
2. [INSERT: Statement of witness 1]
3. [INSERT: Statement of witness 2]
4. [INSERT: Documentary evidence description]
[INSERT: Additional evidence items as required]

You must be provided with all evidence that will be relied upon at the hearing. If any additional evidence comes to light after the date of this letter, it will be provided to you in advance of the hearing.

RIGHT TO BE ACCOMPANIED

You have the statutory right to be accompanied at this hearing by a trade union representative or a work colleague. If you wish to be accompanied, please confirm the name of your companion to [INSERT: Contact name] at least [INSERT: Number] working days before the hearing.

EXISTING WARNINGS

[DELETE IF NOT APPLICABLE]
For the avoidance of doubt, you currently have a [INSERT: first written warning / final written warning] on your record, issued on [INSERT: Date of existing warning], which remains live until [INSERT: Expiry date of warning].
[END DELETE]

POSSIBLE OUTCOMES

The possible outcomes of this hearing include:

- No case to answer and the matter is closed
- A management instruction or action short of formal disciplinary action
- A first written warning
- A final written warning
[INSERT IF GROSS MISCONDUCT: - Dismissal with notice]
[INSERT IF GROSS MISCONDUCT: - Summary dismissal without notice]

PREPARATION

You are entitled to present your case at the hearing. You may call witnesses, submit documents, and make representations on your own behalf or through your companion. If you intend to call witnesses or submit documents, please notify [INSERT: Contact name] at least [INSERT: Number] working days before the hearing so that arrangements can be made.

POSTPONEMENT

If you or your companion are unable to attend on the date specified, you may request a postponement. You must do so as soon as possible and propose an alternative date within five working days of the original hearing date. The organisation is not obliged to agree to more than one postponement.

If you fail to attend the hearing without reasonable explanation, the hearing may proceed in your absence and a decision may be made based on the evidence available.

If you have any questions about this letter, please contact [INSERT: Contact name] on [INSERT: Contact details].

Yours sincerely,

[INSERT: Name of person issuing the letter]
[INSERT: Job title]
[INSERT: Contact details]

Enc: [INSERT: List of enclosures]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'first_written_warning',
    title: 'First Written Warning Letter',
    category: 'disciplinary',
    tier: 2,
    description: 'First written warning outcome letter. States finding, improvement required, review period, and right of appeal.',
    triggers: ['first written warning', 'written warning outcome', 'stage 1 warning'],
    reviewNotice: 'This letter must be reviewed by a qualified HR professional before issue. Ensure the improvement required is specific and measurable.',
    content: `FIRST WRITTEN WARNING

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

First Written Warning - Outcome of Disciplinary Hearing

I am writing to confirm the outcome of the disciplinary hearing held on [INSERT: Date of hearing] at which you were present. Also present were [INSERT: Names and roles of all attendees including companion if applicable].

ALLEGATIONS

The following allegation(s) were considered at the hearing:

1. [INSERT: First allegation]
2. [INSERT: Second allegation if applicable]
[INSERT: Additional allegations as required]

FINDING

Having considered the evidence presented by management, your response, and the representations made on your behalf, I have found the following:

Allegation 1: [INSERT: Proven / Not proven - with brief reasoning]
Allegation 2: [INSERT: Proven / Not proven - with brief reasoning if applicable]
[INSERT: Additional findings as required]

REASONING

In reaching my decision, I took into account the following matters:

[INSERT: Summary of the key evidence and reasoning that led to the finding, including any mitigating factors raised by the employee and how they were considered]

SANCTION

I have decided that the appropriate sanction is a first written warning. This warning will remain on your personnel file for a period of [INSERT: Duration - typically 6 or 12 months] from the date of this letter, after which it will be disregarded for disciplinary purposes.

IMPROVEMENT REQUIRED

You are required to meet the following standards going forward:

[INSERT: Specific and measurable improvement required, stated clearly so the employee knows exactly what is expected]

REVIEW

Your conduct will be reviewed on [INSERT: Review date]. At this review, we will assess whether the required improvement has been achieved and sustained.

CONSEQUENCES OF FURTHER MISCONDUCT

You should be aware that if there is further misconduct during the period of this warning, or if the required improvement is not achieved, further disciplinary action may be taken which could result in a final written warning.

RIGHT OF APPEAL

You have the right to appeal against this decision. If you wish to appeal, you must do so in writing, setting out the grounds of your appeal, to [INSERT: Name and job title of appeal recipient] within [INSERT: Number - typically 5 or 10] working days of receipt of this letter.

The appeal will be heard by a manager who was not involved in the original hearing.

If you have any questions about this letter, please contact [INSERT: Contact name] on [INSERT: Contact details].

Yours sincerely,

[INSERT: Hearing chair full name]
[INSERT: Hearing chair job title]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'final_written_warning',
    title: 'Final Written Warning Letter',
    category: 'disciplinary',
    tier: 2,
    description: 'Final written warning outcome letter. Last formal warning before potential dismissal.',
    triggers: ['final written warning', 'final warning outcome', 'stage 2 warning'],
    reviewNotice: 'A final written warning is a significant sanction. This letter must be reviewed by a qualified HR professional or employment solicitor before issue.',
    content: `FINAL WRITTEN WARNING

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

Final Written Warning - Outcome of Disciplinary Hearing

I am writing to confirm the outcome of the disciplinary hearing held on [INSERT: Date of hearing] at which you were present. Also present were [INSERT: Names and roles of all attendees including companion if applicable].

ALLEGATIONS

The following allegation(s) were considered at the hearing:

1. [INSERT: First allegation]
2. [INSERT: Second allegation if applicable]
[INSERT: Additional allegations as required]

FINDING

Having considered the evidence presented by management, your response, and the representations made on your behalf, I have found the following:

Allegation 1: [INSERT: Proven / Not proven - with brief reasoning]
Allegation 2: [INSERT: Proven / Not proven - with brief reasoning if applicable]
[INSERT: Additional findings as required]

REASONING

In reaching my decision, I took into account the following matters:

[INSERT: Summary of the key evidence and reasoning that led to the finding, including any mitigating factors raised by the employee and how they were considered]

[INSERT IF APPLICABLE: I also noted that you are currently subject to a first written warning issued on [INSERT: Date of first warning] for [INSERT: Brief description of previous matter].]

SANCTION

I have decided that the appropriate sanction is a final written warning. This is the most serious warning that can be issued before dismissal.

This warning will remain on your personnel file for a period of [INSERT: Duration - typically 12 or 18 months] from the date of this letter, after which it will be disregarded for disciplinary purposes.

IMPROVEMENT REQUIRED

You are required to meet the following standards going forward:

[INSERT: Specific and measurable improvement required, stated clearly so the employee knows exactly what is expected]

REVIEW

Your conduct will be reviewed on [INSERT: Review date]. At this review, we will assess whether the required improvement has been achieved and sustained.

CONSEQUENCES OF FURTHER MISCONDUCT

You must understand that this is the final stage of the formal disciplinary procedure before dismissal. If there is any further misconduct during the period of this warning, or if the required improvement is not achieved, you may be dismissed from your employment. This applies to misconduct of a similar nature and to any other misconduct that would warrant disciplinary action.

RIGHT OF APPEAL

You have the right to appeal against this decision. If you wish to appeal, you must do so in writing, setting out the grounds of your appeal, to [INSERT: Name and job title of appeal recipient] within [INSERT: Number - typically 5 or 10] working days of receipt of this letter.

The appeal will be heard by a manager who was not involved in the original hearing.

If you have any questions about this letter, please contact [INSERT: Contact name] on [INSERT: Contact details].

Yours sincerely,

[INSERT: Hearing chair full name]
[INSERT: Hearing chair job title]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'dismissal_with_notice',
    title: 'Dismissal Letter (With Notice)',
    category: 'disciplinary',
    tier: 2,
    description: 'Dismissal with contractual notice. States finding, reasoning, notice period, final pay, and right of appeal.',
    triggers: ['dismissal with notice', 'dismiss with notice', 'terminate employment', 'dismissal outcome'],
    reviewNotice: 'DISMISSAL IS IRREVERSIBLE. This letter must be reviewed by a qualified HR professional or employment solicitor before issue without exception.',
    content: `DISMISSAL WITH NOTICE

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

Dismissal with Notice - Outcome of Disciplinary Hearing

I am writing to confirm the outcome of the disciplinary hearing held on [INSERT: Date of hearing] at which you were present. Also present were [INSERT: Names and roles of all attendees including companion if applicable].

ALLEGATIONS

The following allegation(s) were considered at the hearing:

1. [INSERT: First allegation]
2. [INSERT: Second allegation if applicable]
[INSERT: Additional allegations as required]

FINDING

Having considered the evidence presented by management, your response, and the representations made on your behalf, I have found the following:

Allegation 1: [INSERT: Proven / Not proven - with brief reasoning]
Allegation 2: [INSERT: Proven / Not proven - with brief reasoning if applicable]
[INSERT: Additional findings as required]

REASONING

In reaching my decision, I took into account the following:

[INSERT: Detailed reasoning for the finding, including evidence relied upon, mitigating factors considered, and why the decision was reached]

I also considered whether a sanction short of dismissal would be appropriate. I concluded that dismissal is the appropriate sanction because:

[INSERT: Clear reasoning for why dismissal is proportionate and why a lesser sanction was not appropriate]

DECISION TO DISMISS

I have decided that you are dismissed from your employment with [INSERT: Organisation name]. Your employment will terminate on [INSERT: Termination date], following the expiry of your contractual notice period.

NOTICE PERIOD

Your contractual notice period is [INSERT: Notice period duration]. Your notice period will [DELETE AS APPLICABLE]:

OPTION A - WORKING NOTICE
run from the date of this letter. You are required to attend work as normal during your notice period unless otherwise instructed.

OPTION B - PAYMENT IN LIEU OF NOTICE (PILON)
be paid in lieu. You will receive a payment equivalent to [INSERT: Number of weeks] weeks' pay in lieu of notice. Your employment will therefore end on the date of this letter.

OPTION C - GARDEN LEAVE
be served on garden leave. You are not required to attend the workplace during your notice period but remain employed and bound by your contractual obligations until the termination date.

[END DELETE]

FINAL PAY

Your final pay will include:

- Salary due up to and including [INSERT: Last date of pay]
- Notice pay: [INSERT: Details of notice pay or PILON]
- Accrued but untaken holiday: [INSERT: Number of days] days at [INSERT: Daily rate] per day
- Less any overpayment of holiday: [INSERT: Details if applicable]
- Less statutory deductions (income tax, National Insurance, pension contributions)

Your P45 will be issued separately.

RETURN OF PROPERTY

You are required to return all property belonging to the organisation, including but not limited to: [INSERT: List of items such as laptop, phone, access card, keys, uniform, documents]. Please arrange to return these items by [INSERT: Date for return of property].

CONFIDENTIALITY

You are reminded that your obligations of confidentiality survive the termination of your employment. You must not disclose or make use of any confidential information belonging to the organisation.

RIGHT OF APPEAL

You have the right to appeal against this decision. If you wish to appeal, you must do so in writing, setting out the grounds of your appeal, to [INSERT: Name and job title of appeal recipient] within [INSERT: Number - typically 5 or 10] working days of receipt of this letter.

The appeal will be heard by a manager who was not involved in the original hearing or investigation.

Yours sincerely,

[INSERT: Hearing chair full name]
[INSERT: Hearing chair job title]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'summary_dismissal',
    title: 'Summary Dismissal Letter (Gross Misconduct)',
    category: 'disciplinary',
    tier: 2,
    description: 'Dismissal without notice for gross misconduct. Highest risk document - requires specialist legal review.',
    triggers: ['gross misconduct', 'summary dismissal', 'dismissal without notice', 'gross misconduct outcome'],
    reviewNotice: 'SUMMARY DISMISSAL CARRIES THE HIGHEST LEGAL RISK OF ANY HR ACTION. This letter must be reviewed by a qualified HR professional or employment solicitor before issue without exception.',
    content: `SUMMARY DISMISSAL - GROSS MISCONDUCT

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

Summary Dismissal for Gross Misconduct - Outcome of Disciplinary Hearing

I am writing to confirm the outcome of the disciplinary hearing held on [INSERT: Date of hearing] at which you were present. Also present were [INSERT: Names and roles of all attendees including companion if applicable].

ALLEGATIONS

The following allegation(s) of gross misconduct were considered at the hearing:

1. [INSERT: First allegation of gross misconduct stated clearly and specifically]
2. [INSERT: Second allegation if applicable]
[INSERT: Additional allegations as required]

FINDING

Having considered the evidence presented by management, your response, and the representations made on your behalf, I have found the following:

Allegation 1: [INSERT: Proven / Not proven - with brief reasoning]
Allegation 2: [INSERT: Proven / Not proven - with brief reasoning if applicable]
[INSERT: Additional findings as required]

REASONING - WHY GROSS MISCONDUCT

In reaching my decision, I took into account the following:

[INSERT: Detailed reasoning for the finding, including evidence relied upon]

I have determined that your conduct amounts to gross misconduct because:

[INSERT: Specific reasoning as to why the conduct meets the threshold of gross misconduct rather than ordinary misconduct. Reference the organisation's definition of gross misconduct and explain how the conduct falls within it.]

WHY NO LESSER SANCTION IS APPROPRIATE

I considered whether a sanction short of dismissal could be appropriate. I have concluded that no lesser sanction is appropriate because:

[INSERT: Clear and specific reasoning as to why a final written warning or other lesser sanction would not be sufficient. Consider the seriousness of the conduct, the impact on the organisation, breach of trust, and any mitigating factors.]

The mitigating factors you raised were:

[INSERT: List of mitigating factors raised by the employee]

I considered these mitigating factors but concluded that they do not reduce the seriousness of the misconduct sufficiently to warrant a lesser sanction because:

[INSERT: Reasoning for why mitigating factors do not change the outcome]

DECISION TO DISMISS

I have decided that you are summarily dismissed from your employment with [INSERT: Organisation name] for gross misconduct. Your employment is terminated with immediate effect from the date of this letter. You are not entitled to any notice or payment in lieu of notice.

Your effective date of termination is: [INSERT: Date of termination]

FINAL PAY

Your final pay will include:

- Salary due up to and including [INSERT: Last date worked or date of dismissal]
- Accrued but untaken holiday: [INSERT: Number of days] days at [INSERT: Daily rate] per day
- Less any overpayment of holiday: [INSERT: Details if applicable]
- Less statutory deductions (income tax, National Insurance, pension contributions)

You are not entitled to notice pay as you have been summarily dismissed for gross misconduct.

Your P45 will be issued separately.

RETURN OF PROPERTY

You are required to return all property belonging to the organisation, including but not limited to: [INSERT: List of items such as laptop, phone, access card, keys, uniform, documents]. Please arrange to return these items by [INSERT: Date for return of property].

RIGHT OF APPEAL

You have the right to appeal against this decision. If you wish to appeal, you must do so in writing, setting out the grounds of your appeal, to [INSERT: Name and job title of appeal recipient] within [INSERT: Number - typically 5 or 10] working days of receipt of this letter.

The appeal will be heard by a manager who was not involved in the original hearing or investigation.

Yours sincerely,

[INSERT: Hearing chair full name]
[INSERT: Hearing chair job title]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'grievance_acknowledgement',
    title: 'Grievance Acknowledgement Letter',
    category: 'grievance',
    tier: 1,
    description: 'Acknowledges receipt of formal grievance and confirms next steps.',
    triggers: ['grievance received', 'acknowledge grievance', 'grievance acknowledgement'],
    reviewNotice: 'This document should be reviewed before use to ensure it reflects your organisation specific policies and circumstances.',
    content: `GRIEVANCE ACKNOWLEDGEMENT

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

Acknowledgement of Formal Grievance

Thank you for your letter/email dated [INSERT: Date of grievance] in which you raised a formal grievance. I am writing to acknowledge receipt of your grievance and to confirm the next steps.

SUMMARY OF YOUR GRIEVANCE

I understand your grievance to relate to the following matters:

[INSERT: Brief summary of the grievance points as raised by the employee. Number each point separately.]

1. [INSERT: Grievance point 1]
2. [INSERT: Grievance point 2]
[INSERT: Additional points as required]

If this summary does not accurately reflect your concerns, please let me know as soon as possible so that the record can be corrected before the investigation begins.

ASSIGNED INVESTIGATOR

Your grievance will be investigated by [INSERT: Name and job title of assigned investigator]. This person has no prior involvement in the matters you have raised and will conduct an impartial investigation.

The investigator may need to speak with you to clarify certain points, and will also interview any witnesses or individuals named in your grievance.

TIMELINE

I will aim to arrange a grievance hearing within [INSERT: Number - typically 5 to 10] working days of the date of this letter. You will receive a separate letter inviting you to the hearing with full details of the date, time, location, and your rights.

Please be aware that where a grievance involves multiple parties or complex matters, it may take longer to complete the investigation. If there is likely to be a delay, you will be kept informed.

RIGHT TO BE ACCOMPANIED

You will have the right to be accompanied at the grievance hearing by a trade union representative or a work colleague. Further details will be provided in the hearing invitation letter.

SAFETY CONCERNS

If any element of your grievance relates to a concern about your personal safety or wellbeing, or if you feel at risk in the workplace, please raise this with me immediately so that appropriate interim measures can be put in place. The safety and wellbeing of all employees is a priority and any such concern will be addressed without delay.

CONFIDENTIALITY

Your grievance will be treated confidentially. Information will only be shared with those who need to know in order to investigate and resolve your complaint. I ask that you also treat this matter as confidential and do not discuss the details of your grievance with colleagues other than your chosen companion.

NEXT STEPS

You do not need to take any action at this stage. You will receive a formal invitation to a grievance hearing in due course. In the meantime, if you have any questions or concerns, please contact me on [INSERT: Contact phone number or email].

Yours sincerely,

[INSERT: Manager or HR representative full name]
[INSERT: Job title]
[INSERT: Contact details]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'grievance_hearing_invitation',
    title: 'Invitation to Grievance Hearing',
    category: 'grievance',
    tier: 2,
    description: 'Formal invitation to grievance hearing with right to be accompanied.',
    triggers: ['grievance hearing', 'grievance meeting invite'],
    reviewNotice: 'This letter must be reviewed before use. Ensure the hearing chair was not involved in the events being grieved.',
    content: `INVITATION TO GRIEVANCE HEARING

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

Invitation to Grievance Hearing

Further to my letter dated [INSERT: Date of acknowledgement letter] in which I acknowledged receipt of your formal grievance, I am writing to invite you to a grievance hearing.

HEARING DETAILS

Date: [INSERT: Hearing date]
Time: [INSERT: Hearing time]
Location: [INSERT: Hearing location or video call link]
Hearing Chair: [INSERT: Name and job title of hearing chair]
Note Taker: [INSERT: Name and job title of note taker]

The hearing chair has no prior involvement in the matters raised in your grievance and will conduct the hearing impartially.

RIGHT TO BE ACCOMPANIED

You have the right to be accompanied at this hearing by a trade union representative or a work colleague. Your companion may address the hearing, put your case on your behalf, ask questions, and confer with you during the hearing. However, your companion may not answer questions on your behalf.

If you wish to be accompanied, please confirm the name of your companion to [INSERT: Contact name] at least [INSERT: Number] working days before the hearing.

PREPARATION

At the hearing, you will be asked to explain your grievance and the outcome you are seeking. You may find it helpful to prepare by considering the following:

- The specific issues you wish to raise
- The dates and details of any incidents
- The names of any witnesses who can support your account
- Any documents you wish to rely upon
- The resolution or outcome you are seeking

If you wish to submit any documents or call any witnesses at the hearing, please provide details to [INSERT: Contact name] at least [INSERT: Number] working days in advance so that arrangements can be made.

WHAT HAPPENS AT THE HEARING

The hearing will follow this general structure:

1. The hearing chair will explain the purpose and format of the hearing
2. You will be invited to set out your grievance
3. The hearing chair will ask questions to understand the issues
4. You or your companion may make representations
5. The hearing chair will summarise the key points
6. You will be asked if there is anything else you wish to add

Notes will be taken during the hearing and you will be provided with a copy for review.

WHAT HAPPENS NEXT

Following the hearing, the hearing chair may need to carry out further investigation, including interviewing witnesses or reviewing documents. You will be kept informed of progress.

Once the investigation is complete, you will receive a written outcome letter setting out the findings on each point of your grievance and any actions to be taken. You will have a right of appeal against the outcome.

I will aim to provide the written outcome within [INSERT: Number - typically 5 to 10] working days of the hearing, though more complex matters may take longer. You will be notified if there is a delay.

POSTPONEMENT

If you are unable to attend the hearing on the date specified, please contact [INSERT: Contact name] as soon as possible to arrange an alternative date. Please propose an alternative date within five working days of the original hearing date.

If you have any questions about this letter or the hearing process, please do not hesitate to contact me.

Yours sincerely,

[INSERT: Manager or HR representative full name]
[INSERT: Job title]
[INSERT: Contact details]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'grievance_outcome',
    title: 'Grievance Outcome Letter',
    category: 'grievance',
    tier: 2,
    description: 'Grievance outcome with findings on each point, reasoning, actions, and right of appeal.',
    triggers: ['grievance outcome', 'grievance finding', 'grievance result', 'grievance decision'],
    reviewNotice: 'Grievance outcome letters can be relied upon in subsequent tribunal proceedings including constructive dismissal claims. This letter must be reviewed by a qualified HR professional before issue.',
    content: `GRIEVANCE OUTCOME

PRIVATE AND CONFIDENTIAL

[INSERT: Employee full name]
[INSERT: Employee address line 1]
[INSERT: Employee address line 2]
[INSERT: Employee address line 3]
[INSERT: Postcode]

[INSERT: Date of letter]

Dear [INSERT: Employee first name],

Case Reference: [INSERT: Case reference number]

Grievance Outcome

I am writing to confirm the outcome of the grievance hearing held on [INSERT: Date of hearing]. Also present at the hearing were [INSERT: Names and roles of all attendees including companion if applicable].

YOUR GRIEVANCE

You raised a formal grievance on [INSERT: Date of original grievance] in which you set out the following concerns:

1. [INSERT: Grievance point 1 as originally stated]
2. [INSERT: Grievance point 2 as originally stated]
[INSERT: Additional points as required]

INVESTIGATION STEPS

Following the hearing, I carried out the following investigation steps:

[INSERT: Summary of investigation steps taken, for example:]
- Interviewed [INSERT: Name] on [INSERT: Date]
- Interviewed [INSERT: Name] on [INSERT: Date]
- Reviewed [INSERT: Description of documents reviewed]
- Considered [INSERT: Any policies, procedures, or other materials reviewed]
[INSERT: Additional investigation steps as required]

FINDINGS

I have considered all the evidence gathered and set out my findings on each point of your grievance below.

Grievance Point 1: [INSERT: Restate grievance point 1]

Finding: [INSERT: Upheld / Partially Upheld / Not Upheld]

Reasoning: [INSERT: Detailed reasoning for the finding on this point, including what evidence was considered, what was established, and how the conclusion was reached]

Grievance Point 2: [INSERT: Restate grievance point 2]

Finding: [INSERT: Upheld / Partially Upheld / Not Upheld]

Reasoning: [INSERT: Detailed reasoning for the finding on this point]

[INSERT: Additional grievance points and findings as required]

ACTIONS TO BE TAKEN

In light of the above findings, the following actions will be taken:

1. [INSERT: Action 1 with responsible person and target date]
2. [INSERT: Action 2 with responsible person and target date]
[INSERT: Additional actions as required]

[INSERT IF NO ACTIONS: Having considered your grievance fully, I have not identified any actions that are required at this time. The reasons for this are set out in my findings above.]

MOVING FORWARD

[INSERT: Statement about the working relationship going forward, any support to be provided, any mediation offered, and any monitoring arrangements. Address the practical steps for resuming normal working relationships.]

I recognise that the grievance process can be difficult regardless of the outcome. If you would like to access the Employee Assistance Programme for confidential support, you can contact [INSERT: EAP provider name] on [INSERT: EAP contact number].

RIGHT OF APPEAL

You have the right to appeal against this outcome. If you wish to appeal, you must do so in writing, setting out the grounds of your appeal, to [INSERT: Name and job title of appeal recipient] within [INSERT: Number - typically 5 or 10] working days of receipt of this letter.

The appeal will be heard by a manager who was not involved in the original hearing or investigation. At the appeal, you may raise concerns about the process followed, the findings reached, or any new evidence that has become available.

If you have any questions about this letter or the findings, please do not hesitate to contact me.

Yours sincerely,

[INSERT: Hearing chair full name]
[INSERT: Hearing chair job title]
[INSERT: Contact details]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'performance_improvement_plan',
    title: 'Performance Improvement Plan',
    category: 'capability',
    tier: 2,
    description: 'Structured PIP with specific standards, measurement criteria, support to be provided, and review process.',
    triggers: ['performance improvement plan', 'PIP', 'capability plan', 'performance management'],
    reviewNotice: 'A Performance Improvement Plan must be reviewed by a qualified HR professional before use. Ensure standards are achievable and support is genuine.',
    content: `PERFORMANCE IMPROVEMENT PLAN

PRIVATE AND CONFIDENTIAL

Organisation: [INSERT: Organisation name]
Case Reference: [INSERT: Case reference number]

Employee Name: [INSERT: Employee full name]
Job Title: [INSERT: Job title]
Department: [INSERT: Department]
Line Manager: [INSERT: Line manager name]
HR Representative: [INSERT: HR representative name if applicable]
Date of Issue: [INSERT: Date PIP is issued]
Review Period: [INSERT: Start date] to [INSERT: End date]

PURPOSE

This Performance Improvement Plan (PIP) has been put in place because your performance has not met the required standard in the areas set out below. The purpose of this plan is to support you in reaching the required standard by setting out clearly what is expected, how your performance will be measured, and what support will be provided.

This is a capability process, not a disciplinary process. The aim is to help you improve, not to punish you. However, you should be aware that if the required improvement is not achieved during the review period, further action may be taken under the capability procedure, which could ultimately result in dismissal.

BACKGROUND

[INSERT: Brief factual summary of the performance concerns, including when they were first raised, any informal discussions or support already provided, and why a formal PIP is now considered necessary]

REQUIRED STANDARDS

The following standards must be achieved and sustained throughout the review period:

Standard 1: [INSERT: Specific performance standard required - state what good looks like]
Current Performance: [INSERT: Description of current performance against this standard]
Required Improvement: [INSERT: Specific measurable improvement required]

Standard 2: [INSERT: Specific performance standard required]
Current Performance: [INSERT: Description of current performance against this standard]
Required Improvement: [INSERT: Specific measurable improvement required]

Standard 3: [INSERT: Specific performance standard required]
Current Performance: [INSERT: Description of current performance against this standard]
Required Improvement: [INSERT: Specific measurable improvement required]

[INSERT: Additional standards as required]

MEASUREMENT

Your performance will be measured using the following methods:

[INSERT: Specific measurement criteria for each standard, for example:]
- [INSERT: Quality checks, output targets, observation, feedback from others, completion of tasks by deadline, accuracy rates, customer feedback scores, or other measurable criteria]

SUPPORT TO BE PROVIDED

The following support will be provided to help you achieve the required standards:

1. Regular 1:1 Meetings: You will meet with your line manager on [INSERT: Frequency - for example weekly] to review progress, discuss any difficulties, and provide feedback. These meetings will be held on [INSERT: Day/time].

2. Training: [INSERT: Specific training to be provided, including dates and provider if known]

3. Shadowing/Mentoring: [INSERT: Shadowing or mentoring arrangements if applicable]

4. Additional Support: [INSERT: Any other support such as adjusted workload, additional resources, coaching, or other assistance]

If you identify any additional support that would help you achieve the required standards, please raise this with your line manager at any time.

REVIEW MEETINGS

Formal review meetings will be held at the following points:

Interim Review 1: [INSERT: Date] - to assess early progress and address any concerns
Interim Review 2: [INSERT: Date] - to assess ongoing progress
Final Review: [INSERT: Date] - to assess whether the required standards have been met

At each review meeting, you will be told whether you are on track to meet the required standards and whether any changes to the plan are needed.

POSSIBLE OUTCOMES

At the final review, the possible outcomes are:

- Standards met: The PIP will end and you will return to normal performance management. Your progress will continue to be monitored through regular supervision.
- Significant progress but not yet met: The PIP may be extended for a further defined period.
- Standards not met: Further action may be taken under the capability procedure. This could include a formal capability hearing at which dismissal is a possible outcome.

DISABILITY AND REASONABLE ADJUSTMENTS

If you have a disability or health condition that you believe is affecting your ability to meet the required standards, please let your line manager or HR know as soon as possible. The organisation has a duty to consider reasonable adjustments under the Equality Act 2010 and will do so where appropriate.

If reasonable adjustments are already in place, these are: [INSERT: Current adjustments if applicable]

EMPLOYEE ACKNOWLEDGEMENT

I confirm that I have received and read this Performance Improvement Plan. I understand the standards required, the support to be provided, and the possible outcomes. I understand that I may contact HR or my trade union representative if I have any questions.

Employee Signature: _______________________ Date: [INSERT: Date]
Manager Signature: _______________________ Date: [INSERT: Date]
HR Signature: _______________________ Date: [INSERT: Date]

Copy provided to employee: Yes / No

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'file_note_general',
    title: 'File Note Template',
    category: 'general',
    tier: 1,
    description: 'General purpose file note for recording any significant conversation, instruction, or concern.',
    triggers: ['file note', 'record of conversation', 'document the conversation', 'note to file'],
    reviewNotice: 'This document should be reviewed before use to ensure it reflects your organisation specific policies and circumstances.',
    content: `FILE NOTE

PRIVATE AND CONFIDENTIAL

Organisation: [INSERT: Organisation name]
Case Reference: [INSERT: Case reference number if applicable]

Date: [INSERT: Date of conversation or event]
Time: [INSERT: Time of conversation or event]
Location: [INSERT: Location - office, meeting room, telephone, video call]

Completed By: [INSERT: Name and job title of person completing this note]

Persons Present:
1. [INSERT: Name and role]
2. [INSERT: Name and role]
[INSERT: Additional persons as required]

PURPOSE OF NOTE

Please indicate the purpose of this file note:

[ ] Record of informal conversation
[ ] Record of formal instruction or direction
[ ] Record of welfare concern
[ ] Record of performance concern
[ ] Record of incident or event
[ ] Record of absence notification
[ ] Record of request (flexible working, leave, adjustments)
[ ] Other: [INSERT: Purpose if not listed above]

SUMMARY OF DISCUSSION

[INSERT: Factual summary of the discussion, instruction, or event. Record what was said by each party. Be specific about dates, times, and details. Record facts rather than opinions. If recording a conversation, note who said what.]

KEY POINTS

1. [INSERT: Key point 1]
2. [INSERT: Key point 2]
3. [INSERT: Key point 3]
[INSERT: Additional key points as required]

ACTIONS AGREED

Action 1: [INSERT: Action description]
Responsible: [INSERT: Person responsible]
Deadline: [INSERT: Deadline date]

Action 2: [INSERT: Action description]
Responsible: [INSERT: Person responsible]
Deadline: [INSERT: Deadline date]

[INSERT: Additional actions as required]

NEXT STEPS

[INSERT: Any follow-up required, next meeting date, or review arrangements]

EMPLOYEE ACKNOWLEDGEMENT

The employee was given the opportunity to read this note and add their own comments.

Employee Comments: [INSERT: Employee comments or state "No comments" or "Employee declined to comment"]

Employee Signature: _______________________ Date: [INSERT: Date]
Manager Signature: _______________________ Date: [INSERT: Date]

Note: If the employee declines to sign, record this and the reason given. The note remains a valid management record whether or not the employee signs.

Copy provided to employee: Yes / No
Copy placed on personnel file: Yes / No

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'reasonable_adjustments_agreement',
    title: 'Reasonable Adjustments Agreement',
    category: 'general',
    tier: 2,
    description: 'Records agreed reasonable adjustments under Equality Act 2010 ss.20-21. Records functional impact and adjustments only - not diagnosis.',
    triggers: ['reasonable adjustments', 'adjustment agreement', 'disability adjustments'],
    reviewNotice: 'This agreement should be reviewed by a qualified HR professional, particularly where adjustments are complex or costly.',
    content: `REASONABLE ADJUSTMENTS AGREEMENT

PRIVATE AND CONFIDENTIAL

Organisation: [INSERT: Organisation name]
Case Reference: [INSERT: Case reference number]

Employee Name: [INSERT: Employee full name]
Job Title: [INSERT: Job title]
Department: [INSERT: Department]
Line Manager: [INSERT: Line manager name]
HR Representative: [INSERT: HR representative name if applicable]
Date of Agreement: [INSERT: Date]

BACKGROUND

This agreement records reasonable adjustments agreed under sections 20 and 21 of the Equality Act 2010.

This document records functional impact on work activities only. It does not record diagnosis, medical history, or clinical details. The employee is not required to disclose their diagnosis and this agreement should not be shared with anyone who does not need to know for the purpose of implementing the adjustments.

FUNCTIONAL IMPACT

The employee reports the following functional impacts on their work activities:

[INSERT: Description of how the condition affects the employee's ability to carry out work tasks. Focus on functional limitations such as difficulty with prolonged sitting, fatigue affecting concentration after a certain period, difficulty with manual handling, or other work-related functional impacts. Do not record diagnosis.]

OCCUPATIONAL HEALTH INPUT

Occupational health advice was obtained: Yes / No
Date of occupational health report: [INSERT: Date if applicable]
The adjustments below are consistent with occupational health recommendations: Yes / No / Not applicable

ADJUSTMENTS AGREED

The following reasonable adjustments have been agreed:

Adjustment 1: [INSERT: Specific adjustment - for example, ergonomic chair with lumbar support]
Implementation Date: [INSERT: Date adjustment will be in place]
Responsible Person: [INSERT: Person responsible for implementing]

Adjustment 2: [INSERT: Specific adjustment - for example, flexible start time between 9:00 and 10:30]
Implementation Date: [INSERT: Date]
Responsible Person: [INSERT: Person responsible]

Adjustment 3: [INSERT: Specific adjustment - for example, regular rest breaks of 10 minutes every 2 hours]
Implementation Date: [INSERT: Date]
Responsible Person: [INSERT: Person responsible]

Adjustment 4: [INSERT: Specific adjustment - for example, working from home 2 days per week]
Implementation Date: [INSERT: Date]
Responsible Person: [INSERT: Person responsible]

[INSERT: Additional adjustments as required. Each adjustment must be specific and practical.]

FUNDING AND RESOURCES

The adjustments above will be funded as follows:

[INSERT: Details of funding - for example, funded from departmental budget, Access to Work application submitted, equipment ordered through procurement. Include any cost approvals obtained and reference numbers.]

Access to Work Reference: [INSERT: Reference number if applicable]
Estimated Cost: [INSERT: Estimated cost if known]
Budget Approval Obtained: Yes / No / Not applicable
Approved By: [INSERT: Name and role of budget approver if applicable]

REVIEW

This agreement will be reviewed on: [INSERT: Review date - typically 3 to 6 months]

The review will assess whether the adjustments are working effectively, whether any changes are needed, and whether any additional adjustments should be considered.

This agreement will also be reviewed early if any of the following triggers occur:

- The employee reports that the adjustments are not effective
- There is a change in the employee's role, duties, or working location
- There is a change in the employee's condition that affects their functional capacity
- The line manager changes
- An occupational health review recommends changes

FURTHER ADJUSTMENTS

If additional adjustments are needed in the future, or if the employee's functional needs change, a new discussion should be arranged. The employee should feel able to raise the need for additional adjustments at any time without concern. The duty to make reasonable adjustments is ongoing.

CONFIDENTIALITY

This agreement will be stored securely on the employee's personnel file. It will only be shared with those who need to know for the purpose of implementing the agreed adjustments. If the employee moves to a new role or manager within the organisation, the agreement will be shared with the new manager with the employee's knowledge.

SIGNATURES

Employee Signature: _______________________ Date: [INSERT: Date]

I confirm that I have been consulted about these adjustments and that they reflect what was agreed.

Manager Signature: _______________________ Date: [INSERT: Date]

I confirm that I will ensure these adjustments are implemented and maintained.

HR Signature: _______________________ Date: [INSERT: Date]

Copy provided to employee: Yes / No
Copy placed on personnel file: Yes / No
Next review date recorded: Yes / No

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'without_prejudice_heads_of_terms',
    title: 'Without Prejudice Heads of Terms',
    category: 'general',
    tier: 2,
    description: 'Records heads of terms from without prejudice discussion only. NOT a settlement agreement. Requires solicitor involvement.',
    triggers: ['without prejudice', 'settlement discussion', 'heads of terms', 'settlement agreement'],
    reviewNotice: 'WITHOUT PREJUDICE DISCUSSIONS AND SETTLEMENT AGREEMENTS REQUIRE SPECIALIST LEGAL ADVICE. This document must be reviewed by an employment solicitor before use.',
    content: `WITHOUT PREJUDICE AND SUBJECT TO CONTRACT

HEADS OF TERMS

This document is marked WITHOUT PREJUDICE AND SUBJECT TO CONTRACT. It is not a binding agreement and is not intended to create legal relations. It records the heads of terms discussed between the parties for the purpose of instructing solicitors to prepare a formal settlement agreement.

IMPORTANT NOTICES

1. Without Prejudice Protection - Limits: This document is produced in the context of without prejudice discussions. Without prejudice protection means that these discussions and this document cannot generally be referred to in any subsequent tribunal or court proceedings. However, you should be aware that without prejudice protection has limits and may not apply in all circumstances. It is essential that you take independent legal advice.

2. Not Protected for Discrimination or Whistleblowing: Without prejudice protection does not apply to claims of discrimination, harassment, victimisation, or whistleblowing detriment in all circumstances. If your situation involves any of these matters, you should take specialist legal advice before agreeing to any terms.

3. Solicitor Required for Binding Agreement: These heads of terms cannot become a binding settlement agreement unless and until they are incorporated into a formal settlement agreement prepared by a solicitor and signed by both parties, with the employee having received independent legal advice from a relevant independent adviser as required by section 203 of the Employment Rights Act 1996 and corresponding provisions in equality and other legislation.

PARTIES

Employer: [INSERT: Organisation name]
Represented by: [INSERT: Name and role of employer representative]

Employee: [INSERT: Employee full name]
Job Title: [INSERT: Job title]
Start Date: [INSERT: Employment start date]
Companion or Representative (if any): [INSERT: Name and role of companion]

Date of Discussion: [INSERT: Date of without prejudice discussion]
Location: [INSERT: Location of discussion]

MATTERS DISCUSSED

The following matters were discussed in the without prejudice meeting:

[INSERT: Brief summary of the background and context for the discussion, without attributing fault or liability]

HEADS OF TERMS

The following heads of terms were discussed. These are subject to contract and to the employee receiving independent legal advice.

1. Termination Date
The proposed termination date is [INSERT: Proposed termination date]. The employee's employment would continue on its current terms until this date.

2. Settlement Payment
A settlement payment of [INSERT: Proposed settlement amount] has been discussed. This payment would be made [INSERT: Tax treatment - for example, the first GBP30,000 paid free of income tax under section 401 ITEPA 2003, with any excess subject to tax and National Insurance]. The employer makes no warranty as to the tax treatment of this payment and the employee is advised to take independent tax advice.

3. Notice
The employee would receive [INSERT: Notice arrangements - for example, payment in lieu of notice of X weeks, subject to deductions for tax and National Insurance in the usual way].

4. Reference
The employer would provide a reference in the agreed form, a draft of which would be annexed to the settlement agreement. The proposed reference is: [INSERT: Summary of proposed reference or state "to be agreed"].

5. Restrictive Covenants
[INSERT: Details of any restrictive covenants that would continue to apply, or any proposal to vary or release restrictive covenants]

6. Outstanding Claims
The settlement agreement would contain a waiver of all claims arising from the employment and its termination, with the exception of [INSERT: Any claims excluded from the waiver, such as accrued pension rights, personal injury claims of which the employee is not yet aware].

7. Other Terms
[INSERT: Any other terms discussed, such as return of property, announcement, gardening leave, outplacement support, agreed statement, confidentiality]

NEXT STEPS

The following next steps were agreed:

1. The employee will have until [INSERT: Date] to consider these heads of terms.

2. If the employee wishes to proceed, the employer will instruct [INSERT: Employer solicitor name if known] to prepare a draft settlement agreement.

3. The employee will need to obtain independent legal advice from a relevant independent adviser. The employer will contribute [INSERT: Amount - typically GBP250 to GBP500 plus VAT] towards the employee's legal fees for this advice.

4. Neither party is bound by these heads of terms unless and until a formal settlement agreement is signed.

5. If agreement is not reached, the without prejudice protection of these discussions will apply and neither party will refer to these discussions in any subsequent proceedings (subject to the limits noted above).

SIGNATURES

These signatures confirm that this document accurately records the matters discussed. They do not create a binding agreement.

For the Employer: _______________________ Date: [INSERT: Date]
Name: [INSERT: Employer representative name]
Role: [INSERT: Employer representative role]

Employee: _______________________ Date: [INSERT: Date]
Name: [INSERT: Employee name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_absence_first_day',
    title: 'First Day Absence Acknowledgement',
    category: 'email',
    tier: 1,
    description: 'Acknowledge absence notification on first day. Confirm reporting procedure and check-in schedule.',
    triggers: ['absence notification', 'called in sick', 'first day absent'],
    reviewNotice: 'Review before use to ensure it reflects your organisation specific procedures.',
    content: `Subject: Acknowledgement of Your Absence - [INSERT: Date of absence]

Dear [INSERT: Employee first name],

Thank you for letting me know that you are unwell and unable to attend work today. I hope you feel better soon.

I wanted to confirm that your absence has been recorded from today, [INSERT: Date of absence]. There is no need to provide any clinical detail at this stage. Your wellbeing is what matters.

As a reminder, our reporting procedure asks that you make contact by [INSERT: Reporting time, e.g. 9:00am] on each day of absence, unless we agree a different arrangement. Please contact [INSERT: Contact name or role] by [INSERT: Method of contact, e.g. phone or email] to report your continued absence if you are not well enough to return tomorrow.

If your absence continues for seven calendar days or fewer, you will need to complete a self-certification form on your return. If your absence extends beyond seven calendar days, you will need to obtain a fit note from your GP.

I will check in with you on [INSERT: Date of next check-in] unless you return before then. If there is anything we can do to support you in the meantime, please do not hesitate to let me know.

Take care and I hope to see you back soon.

Kind regards,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_return_to_work_invitation',
    title: 'Return to Work Meeting Invitation',
    category: 'email',
    tier: 1,
    description: 'Invite employee to return to work meeting on first day back. Confirms welfare conversation not disciplinary.',
    triggers: ['return to work', 'back to work meeting', 'first day back'],
    reviewNotice: 'Review before use to ensure it reflects your organisation specific procedures.',
    content: `Subject: Return to Work Meeting - [INSERT: Date of meeting]

Dear [INSERT: Employee first name],

Welcome back. I hope you are feeling better.

Now that you have returned to work, I would like to invite you to a brief return to work meeting. This is a routine welfare conversation and not a disciplinary meeting. Its purpose is simply to check how you are, to see if there is any support we can offer, and to update you on anything you may have missed.

The meeting details are as follows:

Date: [INSERT: Meeting date]
Time: [INSERT: Meeting time]
Location: [INSERT: Meeting location or room]
Duration: Approximately 15-20 minutes

You do not need to prepare anything for this meeting. If there is anything you would like to raise or discuss, you are welcome to do so, but there is no obligation.

If the proposed time does not work for you, please let me know and we can find an alternative slot. I would like to hold the meeting on your first day back if possible.

I am glad to have you back on the team.

Kind regards,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_welfare_check_4_week',
    title: 'Long Term Absence Welfare Check (4 Week)',
    category: 'email',
    tier: 1,
    description: 'Welfare check at 4 weeks of continuous absence. Warm tone. Introduces occupational health possibility.',
    triggers: ['welfare check', 'long term absence', '4 weeks'],
    reviewNotice: 'Review before use to ensure it reflects your organisation specific procedures.',
    content: `Subject: Thinking of You - Welfare Check

Dear [INSERT: Employee first name],

I wanted to get in touch as you have now been away from work for four weeks, having been absent since [INSERT: First day of absence]. I hope you are doing as well as can be expected, and I want you to know that there is no pressure on you to return before you are ready.

The purpose of this email is simply to check in, to let you know we are thinking of you, and to make sure you are aware of the support available.

I would welcome the chance to have a brief telephone call with you at a time that suits you. This would be an informal and private conversation, and you would not need to share anything beyond what you are comfortable with. If you would prefer to communicate by email or letter instead, that is absolutely fine.

You can reach me at [INSERT: Manager phone number] or [INSERT: Manager email address]. Please let me know what works best for you.

I also wanted to let you know about the possibility of an occupational health referral. This is entirely optional and would only happen with your consent. Occupational health is an independent service that can provide advice on any support or workplace adjustments that might help when you are ready to return. There is no obligation to agree to a referral, and we can discuss it further if you are interested.

As a reminder, our Employee Assistance Programme is available to you on a confidential basis through [INSERT: EAP provider name] on [INSERT: EAP contact number]. This service is free and available at any time.

Your role remains open and the team looks forward to welcoming you back when the time is right. In the meantime, please do not hesitate to reach out if there is anything at all we can do.

Wishing you well,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_investigation_invitation',
    title: 'Investigation Meeting Invitation',
    category: 'email',
    tier: 2,
    description: 'Invite to investigation meeting. Clarifies this is fact-finding only, not disciplinary.',
    triggers: ['investigation meeting', 'fact-finding', 'investigate'],
    reviewNotice: 'This is a formal process email. Review before sending. Ensure description is factual and does not prejudge outcome.',
    content: `Subject: Invitation to Investigation Meeting - Case Reference [INSERT: Case reference number]

Dear [INSERT: Employee first name],

I am writing to invite you to an investigation meeting in connection with the following matter:

[INSERT: Brief factual description of the concern or allegation under investigation. State what is being investigated without making findings or assumptions about the outcome.]

I want to be clear that this is a fact-finding meeting only. It is not a disciplinary hearing. No decision has been made about whether any further action is appropriate. The sole purpose of this meeting is to gather information and to hear your account.

The meeting details are as follows:

Date: [INSERT: Meeting date]
Time: [INSERT: Meeting time]
Location: [INSERT: Meeting location or video call link]
Investigating Officer: [INSERT: Name and job title of investigating officer]
Note Taker: [INSERT: Name and job title of note taker]

You have the right to be accompanied at this meeting by a trade union representative or a work colleague. If you wish to be accompanied, please let me know the name of your companion in advance.

During the meeting, I will explain the matter in more detail and ask you questions. You will have the opportunity to give your account, provide any information you consider relevant, and identify any witnesses or evidence you would like to be considered. Notes will be taken and you will receive a copy for review.

If you are unable to attend on the date above, please contact me as soon as possible at [INSERT: Contact email or phone number] so that an alternative date can be arranged.

Yours sincerely,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_disciplinary_hearing_invitation',
    title: 'Disciplinary Hearing Invitation',
    category: 'email',
    tier: 2,
    description: 'Formal disciplinary hearing invitation. States allegation, evidence enclosed, right to be accompanied, possible outcomes.',
    triggers: ['disciplinary hearing', 'formal hearing invitation'],
    reviewNotice: 'This is a formal process email. Must be reviewed by a qualified HR professional before sending.',
    content: `Subject: Invitation to Disciplinary Hearing - Case Reference [INSERT: Case reference number]

Dear [INSERT: Employee first name],

Following the investigation into the matter referred to above, I am writing to inform you that there is a case to answer in respect of the following allegation(s):

Allegation 1: [INSERT: First allegation stated clearly and specifically, including date, location, and nature of the alleged conduct]
Allegation 2: [INSERT: Second allegation if applicable]
[INSERT: Additional allegations as required]

These allegations are considered to amount to [INSERT: misconduct / gross misconduct] under the organisation's disciplinary procedure.

You are invited to attend a disciplinary hearing as follows:

Date: [INSERT: Hearing date]
Time: [INSERT: Hearing time]
Location: [INSERT: Hearing location]
Hearing Chair: [INSERT: Name and job title of hearing chair]
HR Representative: [INSERT: Name of HR representative]

Please note that the hearing chair was not involved in the investigation and has no prior involvement in this matter.

The following evidence will be relied upon at the hearing and is enclosed with this email:

1. [INSERT: Investigation report]
2. [INSERT: Witness statement(s)]
3. [INSERT: Documentary evidence]
[INSERT: Additional evidence items as required]

You have the statutory right to be accompanied at this hearing by a trade union representative or a work colleague. If you wish to be accompanied, please confirm the name of your companion at least [INSERT: Number] working days before the hearing.

If you wish to submit any documents or call any witnesses, please notify [INSERT: Contact name] at least [INSERT: Number] working days before the hearing.

The possible outcomes of this hearing include:

- No case to answer and the matter is closed
- A management instruction or action short of formal disciplinary action
- A first written warning
- A final written warning
[INSERT IF GROSS MISCONDUCT: - Dismissal with notice
- Summary dismissal without notice]

If you are unable to attend on the date above, please contact me as soon as possible to arrange an alternative date within five working days of the original date. If you fail to attend without reasonable explanation, the hearing may proceed in your absence.

Yours sincerely,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_disciplinary_outcome_warning',
    title: 'Disciplinary Outcome - Warning',
    category: 'email',
    tier: 2,
    description: 'Confirm disciplinary outcome where result is a written warning. States finding, improvement required, appeal right.',
    triggers: ['disciplinary outcome', 'warning outcome', 'written warning confirmation'],
    reviewNotice: 'This is a formal process email. Must be reviewed by a qualified HR professional before sending.',
    content: `Subject: Disciplinary Hearing Outcome - Case Reference [INSERT: Case reference number]

Dear [INSERT: Employee first name],

I am writing to confirm the outcome of the disciplinary hearing held on [INSERT: Date of hearing]. Also present at the hearing were [INSERT: Names and roles of all attendees including companion if applicable].

ALLEGATIONS CONSIDERED

The following allegation(s) were considered:

1. [INSERT: First allegation]
2. [INSERT: Second allegation if applicable]
[INSERT: Additional allegations as required]

FINDING

Having considered the evidence presented by management, your response, and the representations made on your behalf, I have found the following:

Allegation 1: [INSERT: Proven / Not proven - with brief reasoning]
Allegation 2: [INSERT: Proven / Not proven - with brief reasoning if applicable]
[INSERT: Additional findings as required]

In reaching my decision, I took into account the following: [INSERT: Summary of key evidence and reasoning, including mitigating factors raised and how they were considered]

OUTCOME

I have decided that the appropriate outcome is a [INSERT: first written warning / final written warning]. This warning will remain on your personnel file for a period of [INSERT: Duration, e.g. 6 or 12 months] from the date of this email, after which it will be disregarded for disciplinary purposes.

IMPROVEMENT REQUIRED

You are required to meet the following standards going forward:

[INSERT: Specific and measurable improvement required, stated clearly so you know exactly what is expected]

Your conduct will be reviewed on [INSERT: Review date]. If there is further misconduct during the period of this warning, or if the required improvement is not achieved, further disciplinary action may be taken.

RIGHT OF APPEAL

You have the right to appeal against this decision. If you wish to appeal, you must do so in writing, setting out the grounds of your appeal, to [INSERT: Name and job title of appeal recipient] within [INSERT: Number, typically 5 or 10] working days of receipt of this email. The appeal will be heard by a manager who was not involved in the original hearing.

If you have any questions about this email, please do not hesitate to contact me.

Yours sincerely,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_grievance_acknowledgement',
    title: 'Grievance Acknowledgement',
    category: 'email',
    tier: 1,
    description: 'Acknowledge receipt of formal grievance. Confirm next steps and timeline.',
    triggers: ['grievance acknowledgement', 'grievance received'],
    reviewNotice: 'Review before use to ensure it reflects your organisation specific procedures.',
    content: `Subject: Acknowledgement of Your Formal Grievance

Dear [INSERT: Employee first name],

Thank you for your [INSERT: letter / email] dated [INSERT: Date of grievance] in which you raised a formal grievance. I am writing to acknowledge receipt and to confirm the next steps.

I understand your grievance to relate to the following matters:

1. [INSERT: Grievance point 1]
2. [INSERT: Grievance point 2]
[INSERT: Additional points as required]

If this summary does not accurately reflect your concerns, please let me know as soon as possible so that the record can be corrected before the investigation begins.

Your grievance has been assigned to [INSERT: Name and job title of assigned investigator], who has no prior involvement in the matters you have raised and will conduct an impartial investigation.

I will aim to arrange a grievance hearing within [INSERT: Number, typically 5 to 10] working days of today. You will receive a separate invitation with full details of the date, time, location, and your rights.

You will have the right to be accompanied at the grievance hearing by a trade union representative or a work colleague. Further details will be provided in the hearing invitation.

Your grievance will be treated confidentially. Information will only be shared with those who need to know in order to investigate and resolve your complaint.

In the meantime, if you have any questions or concerns, please contact me at [INSERT: Contact phone number or email].

Yours sincerely,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_grievance_outcome',
    title: 'Grievance Outcome',
    category: 'email',
    tier: 2,
    description: 'Confirm grievance outcome with findings, reasoning, any actions, and right of appeal.',
    triggers: ['grievance outcome', 'grievance result', 'grievance decision'],
    reviewNotice: 'Grievance outcome communications can be relied upon in tribunal proceedings. This must be reviewed by a qualified HR professional before sending.',
    content: `Subject: Grievance Outcome - Case Reference [INSERT: Case reference number]

Dear [INSERT: Employee first name],

I am writing to confirm the outcome of the grievance hearing held on [INSERT: Date of hearing]. Also present at the hearing were [INSERT: Names and roles of all attendees including companion if applicable].

YOUR GRIEVANCE

You raised a formal grievance on [INSERT: Date of original grievance] concerning the following matters:

1. [INSERT: Grievance point 1 as originally stated]
2. [INSERT: Grievance point 2 as originally stated]
[INSERT: Additional points as required]

INVESTIGATION

Following the hearing, the following investigation steps were carried out:

[INSERT: Summary of investigation steps, e.g. interviews conducted, documents reviewed, policies considered]

FINDINGS

Grievance Point 1: [INSERT: Restate grievance point 1]
Finding: [INSERT: Upheld / Partially Upheld / Not Upheld]
Reasoning: [INSERT: Detailed reasoning for the finding on this point, including what evidence was considered and how the conclusion was reached]

Grievance Point 2: [INSERT: Restate grievance point 2]
Finding: [INSERT: Upheld / Partially Upheld / Not Upheld]
Reasoning: [INSERT: Detailed reasoning for the finding on this point]

[INSERT: Additional grievance points and findings as required]

ACTIONS

In light of the above findings, the following actions will be taken:

1. [INSERT: Action 1 with responsible person and target date]
2. [INSERT: Action 2 with responsible person and target date]
[INSERT: Additional actions as required, or state "Having considered your grievance fully, I have not identified any actions that are required at this time. The reasons for this are set out in the findings above."]

RIGHT OF APPEAL

You have the right to appeal against this outcome. If you wish to appeal, you must do so in writing, setting out the grounds of your appeal, to [INSERT: Name and job title of appeal recipient] within [INSERT: Number, typically 5 or 10] working days of receipt of this email.

The appeal will be heard by a manager who was not involved in the original hearing or investigation.

I recognise that the grievance process can be difficult regardless of the outcome. If you would like to access the Employee Assistance Programme for confidential support, you can contact [INSERT: EAP provider name] on [INSERT: EAP contact number].

If you have any questions about this outcome, please do not hesitate to contact me.

Yours sincerely,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_occupational_health_referral',
    title: 'Occupational Health Referral Notification',
    category: 'email',
    tier: 1,
    description: 'Notify employee of OH referral. Explains purpose, confirms consent required.',
    triggers: ['occupational health referral', 'OH referral'],
    reviewNotice: 'Review before use to ensure it reflects your organisation specific procedures.',
    content: `Subject: Occupational Health Referral

Dear [INSERT: Employee first name],

I am writing to let you know that I would like to make a referral to our occupational health provider on your behalf. I wanted to explain the purpose of this referral and to confirm that it will only proceed with your consent.

PURPOSE OF THE REFERRAL

The reason for the referral is: [INSERT: Brief factual reason for referral, e.g. to obtain advice on any support or adjustments that could help with your return to work following your current absence / to understand whether any workplace adjustments would be beneficial given the difficulties you have described]

Occupational health is an independent, professional service. Its purpose is to provide impartial advice to both you and the organisation about how your health may affect your work, and what support or adjustments might be helpful. The occupational health practitioner is not acting on behalf of management. Their role is to provide objective, professional guidance.

YOUR CONSENT

An occupational health referral requires your consent. You are under no obligation to agree, and there will be no negative consequences if you choose not to proceed.

If you do consent, the following will apply:

- I will send a referral form to the occupational health provider with some background information about your role and the reason for the referral.
- The occupational health practitioner will arrange an appointment with you, which may be in person, by telephone, or by video call.
- Following the assessment, the occupational health practitioner will prepare a report with their advice and recommendations.
- You will have the opportunity to see the report before it is shared with the organisation. If there is anything in the report you wish to discuss or dispute, you can raise this with the practitioner before the report is released.
- The report will focus on functional capacity and workplace recommendations. It will not disclose your diagnosis or detailed medical history to the organisation unless you give specific consent for this.

NEXT STEPS

If you are happy to proceed with the referral, please confirm by replying to this email or by contacting me at [INSERT: Manager phone number or email]. If you have any questions about the process, I am happy to discuss them with you before you decide.

If you would prefer not to proceed, please let me know and I will note your decision. We can revisit the possibility at any time in the future if your circumstances change.

Kind regards,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_reasonable_adjustments_acknowledgement',
    title: 'Reasonable Adjustments Acknowledgement',
    category: 'email',
    tier: 1,
    description: 'Acknowledge reasonable adjustments request. Confirms being treated seriously with timeline.',
    triggers: ['reasonable adjustments request', 'adjustment request received'],
    reviewNotice: 'Review before use to ensure it reflects your organisation specific procedures.',
    content: `Subject: Acknowledgement of Your Reasonable Adjustments Request

Dear [INSERT: Employee first name],

Thank you for letting me know about the adjustments you feel would help you in your role. I want to confirm that your request has been received and is being taken seriously.

I understand you have requested the following adjustments:

[INSERT: Brief summary of the adjustments requested by the employee]

I would like to arrange a meeting with you to discuss your request in more detail, to understand the functional impact on your work, and to explore what adjustments can be put in place. I will aim to arrange this meeting within [INSERT: Number, typically 5 to 10] working days.

In the meantime, if there are any interim measures that would help you straight away, please let me know and I will do my best to put them in place while we work through the fuller discussion. Your comfort and ability to carry out your role safely are important, and I do not want you to wait longer than necessary for support.

If you have any supporting evidence you would like to share, such as a letter from your GP, a specialist report, or an occupational health recommendation, you are welcome to provide this ahead of our meeting. This is not a requirement, and the absence of medical evidence will not prevent us from discussing and agreeing adjustments.

You are welcome to be accompanied at the meeting by a trade union representative or a work colleague if you would find that helpful.

If you have any questions or concerns before our meeting, please do not hesitate to contact me at [INSERT: Manager phone number or email].

Kind regards,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_without_prejudice_opener',
    title: 'Without Prejudice Meeting Request',
    category: 'email',
    tier: 2,
    description: 'Request without prejudice conversation. For use only where s.111A ERA 1996 applies.',
    triggers: ['without prejudice', 'protected conversation', 'settlement discussion'],
    reviewNotice: 'WITHOUT PREJUDICE PROTECTION IS LIMITED. This email must be reviewed by an employment solicitor before sending. Protection does not apply to discrimination or whistleblowing claims.',
    content: `Subject: Without Prejudice and Subject to Contract

Dear [INSERT: Employee first name],

This letter is marked WITHOUT PREJUDICE AND SUBJECT TO CONTRACT. This means that the contents of this letter, and any discussions that follow from it, cannot be referred to in any subsequent employment tribunal or court proceedings in most circumstances. I explain the limitations of this protection below.

I am writing to propose a confidential, without prejudice conversation about your employment. The purpose of this conversation would be to explore whether there is a basis on which we might reach a mutually acceptable agreement regarding [INSERT: Brief neutral description of the subject matter, e.g. the future of your employment / the current situation].

I want to be open with you about what this means. A without prejudice conversation is one in which both parties can speak freely about possible ways forward, including the possibility of an agreed departure from the organisation, without anything said being used against either party later. It is a chance to have an honest and constructive discussion.

I would like to propose a meeting as follows:

Date: [INSERT: Meeting date]
Time: [INSERT: Meeting time]
Location: [INSERT: Meeting location]

You are welcome to bring a trade union representative or a work colleague to this meeting if you wish.

The meeting would be held on a without prejudice and subject to contract basis. This means that nothing discussed or agreed in principle would be binding unless and until it is set out in a formal settlement agreement signed by both parties, with you having received independent legal advice.

IMPORTANT NOTE ABOUT THE LIMITS OF WITHOUT PREJUDICE PROTECTION

You should be aware that the protection provided by section 111A of the Employment Rights Act 1996 has limitations. In particular:

- Without prejudice protection does not apply to claims of discrimination, harassment, or victimisation under the Equality Act 2010 in all circumstances.
- Without prejudice protection does not apply to whistleblowing detriment or dismissal claims.
- The protection may be lost if there is improper behaviour by either party during the discussion.

I strongly recommend that you take independent legal advice before attending the meeting. You are not obliged to attend, and your decision either way will not affect how you are treated at work.

If you have any questions about this letter, or if you would like to suggest an alternative date, please contact me at [INSERT: Manager phone number or email].

Yours sincerely,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  },

  {
    id: 'email_reference_response',
    title: 'Reference Request Response',
    category: 'email',
    tier: 1,
    description: 'Neutral factual reference response. Confirms dates and job title only.',
    triggers: ['reference request', 'employment reference', 'reference response'],
    reviewNotice: 'Review before use to ensure it reflects your organisation specific procedures.',
    content: `Subject: Employment Reference - [INSERT: Employee full name]

Dear [INSERT: Name of person requesting the reference],

Thank you for your reference request dated [INSERT: Date of request] in respect of the above-named individual.

I can confirm the following details:

Employee Name: [INSERT: Employee full name]
Dates of Employment: [INSERT: Start date] to [INSERT: End date or "present" if still employed]
Job Title: [INSERT: Job title held]
Contract Type: [INSERT: Permanent / Fixed-term / Part-time / Full-time]

This reference is provided in confidence and on the basis that it is factual only. It is given in good faith for the purpose of assisting you in making an employment decision. It should not be disclosed to the individual concerned or to any third party without the prior consent of this organisation.

This organisation's policy is to provide factual references confirming dates of employment and job title only. No further information or opinion is provided as a matter of policy. This should not be interpreted as reflecting negatively on the individual.

If you require any clarification, please do not hesitate to contact me.

Yours sincerely,

[INSERT: Manager Name]
[INSERT: Job Title]
[INSERT: Organisation Name]

HR guidance document - review before use - not legal advice`
  }
];

export function getDocumentById(id: string): DocumentTemplate | undefined {
  return documentLibrary.find(d => d.id === id);
}

export function getDocumentsByCategory(category: string): DocumentTemplate[] {
  return documentLibrary.filter(d => d.category === category);
}

export function matchDocumentsByTrigger(text: string): DocumentTemplate[] {
  const lower = text.toLowerCase();
  return documentLibrary.filter(d => d.triggers.some(t => lower.includes(t.toLowerCase())));
}
