export interface TemplateSection {
  heading?: string;
  paragraphs: string[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: 'Absence' | 'Disciplinary' | 'Grievance' | 'Capability' | 'General' | 'General HR';
  description: string;
  filename: string;
  fields: string[];
  sections: TemplateSection[];
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  // ============================================================
  // ABSENCE (5)
  // ============================================================
  {
    id: 'return-to-work-form',
    name: 'Return to Work Interview Form',
    category: 'Absence',
    description: 'Structured form for conducting return to work interviews following a period of sickness absence. Covers absence details, wellbeing, support needs, and agreed actions.',
    filename: 'return-to-work-interview-form.docx',
    fields: [
      'Employee name',
      'Manager name',
      'Date of interview',
      'Date absence began',
      'Date returned to work',
      'Reason for absence',
      'Is absence disability-related',
      'Fit note received',
      'Actions agreed',
      'Next review date',
    ],
    sections: [
      {
        heading: 'Return to Work Interview Form',
        paragraphs: [
          'This form should be completed by the line manager following every period of sickness absence, in accordance with the organisation\'s Sickness Absence Policy. The interview should take place on the employee\'s first day back at work, or as soon as reasonably practicable thereafter.',
          'The purpose of this meeting is to welcome the employee back to the workplace, confirm the reason for absence, discuss any support needs, and agree any actions to assist the employee\'s return.',
        ],
      },
      {
        heading: 'Employee Details',
        paragraphs: [
          'Employee Name: [INSERT: Employee name]',
          'Manager Name: [INSERT: Manager name]',
          'Date of Interview: [INSERT: Date of interview]',
        ],
      },
      {
        heading: 'Absence Details',
        paragraphs: [
          'Date Absence Began: [INSERT: Date absence began]',
          'Date Returned to Work: [INSERT: Date returned to work]',
          'Total Working Days Lost: This should be calculated from the first day of absence to the last day of absence, excluding any non-working days.',
          'Reason for Absence: [INSERT: Reason for absence]',
          'Was this absence related to a disability or long-term health condition as defined under the Equality Act 2010? [INSERT: Is absence disability-related]',
          'If yes, the manager should consider whether any reasonable adjustments are required and should consult with HR and, where appropriate, Occupational Health before taking any further action under the Sickness Absence Policy.',
          'Was a fit note (Statement of Fitness for Work) provided? [INSERT: Fit note received]',
          'If a fit note was provided, please confirm whether it recommended any adjustments such as a phased return to work, altered hours, amended duties, or workplace adaptations.',
        ],
      },
      {
        heading: 'SSP and Record Keeping',
        paragraphs: [
          'From 6 April 2026, Statutory Sick Pay is payable from the first day of sickness absence. Waiting days have been abolished and the lower earnings limit has been removed. The manager should confirm that the employee is aware of this change.',
          'Employers are required by law to keep annual leave and holiday pay records for all workers for six years. This form should be retained as part of the employee absence record. The Fair Work Agency, launched 7 April 2026, has the power to investigate records retrospectively.',
        ],
      },
      {
        heading: 'Discussion Points',
        paragraphs: [
          'The manager should discuss the following points with the employee during the return to work interview. Notes should be kept of the discussion.',
          'What was the reason for the absence and is the employee now fully fit to carry out their duties?',
          'Has the employee consulted a GP or other medical professional in connection with this absence?',
          'Is the absence related to any workplace factors, including workload, relationships with colleagues, or working conditions?',
          'Does the employee consider the absence to be related to a disability or long-term health condition? If so, would the employee benefit from a referral to Occupational Health?',
          'Are there any reasonable adjustments or additional support measures that would help the employee in their return to work?',
          'The manager should also ensure the employee is aware of any updates, changes, or developments that occurred during their absence.',
        ],
      },
      {
        heading: 'Wellbeing Check',
        paragraphs: [
          'The manager should take this opportunity to check on the general wellbeing of the employee. This includes asking whether the employee feels ready to return to their full duties and whether there are any personal or professional concerns that may affect their attendance going forward.',
          'The employee should be reminded of the Employee Assistance Programme and any other wellbeing support available through the organisation.',
          'If the employee raises any concerns about their mental health or wellbeing, the manager should handle these sensitively and consider whether a referral to Occupational Health or other specialist support is appropriate.',
        ],
      },
      {
        heading: 'Actions Agreed',
        paragraphs: [
          'Actions Agreed: [INSERT: Actions agreed]',
          'Next Review Date (if applicable): [INSERT: Next review date]',
          'The manager should record all agreed actions clearly and provide a copy of this form to the employee. Actions may include a phased return to work, referral to Occupational Health, adjustments to working arrangements, or a follow-up meeting.',
          'If the employee\'s absence record has reached a trigger point under the Sickness Absence Policy, the manager should advise the employee of this and explain the next steps in the process.',
        ],
      },
      {
        heading: 'Signatures',
        paragraphs: [
          'Employee Signature: _____________________________ Date: ______________',
          'Manager Signature: _____________________________ Date: ______________',
          'A copy of this completed form should be placed on the employee\'s personnel file and a copy provided to the employee.',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'absence-notification',
    name: 'Sickness Absence Notification Form',
    category: 'Absence',
    description: 'Form to record and process the initial notification of sickness absence from an employee, including the method of notification and manager actions required.',
    filename: 'sickness-absence-notification.docx',
    fields: [
      'Employee name',
      'Date of notification',
      'Method of notification',
      'Date absence began',
      'Expected return date',
      'Reason for absence',
      'Manager receiving notification',
    ],
    sections: [
      {
        heading: 'Sickness Absence Notification Form',
        paragraphs: [
          'This form should be completed when an employee notifies the organisation of their sickness absence. It is the responsibility of the line manager or designated person receiving the notification to record the information accurately and to take the necessary steps outlined below.',
          'Employees are required to notify their line manager of their absence in accordance with the organisation\'s Sickness Absence Policy. Notification should be made by telephone at the earliest opportunity, and no later than the start of the employee\'s normal working hours on the first day of absence, unless exceptional circumstances prevent this.',
        ],
      },
      {
        heading: 'Employee Details',
        paragraphs: [
          'Employee Name: [INSERT: Employee name]',
          'Job Title and Department: To be completed by the manager receiving the notification.',
        ],
      },
      {
        heading: 'Notification Details',
        paragraphs: [
          'Date of Notification: [INSERT: Date of notification]',
          'Time of Notification: To be recorded by the manager at the time of receiving the call or message.',
          'Method of Notification: [INSERT: Method of notification]',
          'Notification Received By: [INSERT: Manager receiving notification]',
          'Where an employee has notified their absence by text message or email rather than by telephone, the manager should follow up with a telephone call where practicable to obtain further information and to check on the employee\'s welfare.',
        ],
      },
      {
        heading: 'Absence Details',
        paragraphs: [
          'Date Absence Began: [INSERT: Date absence began]',
          'Expected Return Date: [INSERT: Expected return date]',
          'Reason for Absence: [INSERT: Reason for absence]',
          'For absences of seven calendar days or fewer, the employee will be required to complete a self-certification form upon their return to work. For absences exceeding seven calendar days, the employee must provide a fit note (Statement of Fitness for Work) from their GP.',
          'The employee should be asked to maintain regular contact with their manager during the period of absence, at intervals agreed between the employee and manager.',
        ],
      },
      {
        heading: 'Manager Actions',
        paragraphs: [
          'The manager should take the following actions upon receiving the sickness absence notification:',
          '1. Record the notification details on this form and on the organisation\'s absence management system.',
          '2. Arrange cover for the employee\'s duties as necessary.',
          '3. Notify HR if the absence is expected to exceed seven calendar days, or if there are any concerns about the nature of the absence.',
          '4. Notify HR immediately if the absence may be work-related, as this may need to be reported under the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 (RIDDOR).',
          '5. Agree the next point of contact with the employee.',
          '6. Ensure a return to work interview is conducted promptly upon the employee\'s return.',
          'Manager Signature: _____________________________ Date: ______________',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'absence-stage1-warning',
    name: 'Stage 1 Absence Warning Letter',
    category: 'Absence',
    description: 'Formal letter issuing a Stage 1 warning under the sickness absence management procedure, including details of the absence record, warning duration, and right of appeal.',
    filename: 'absence-stage1-warning.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Manager name',
      'Absence dates and reasons',
      'Bradford Factor score',
      'Meeting date',
      'Warning duration',
      'Review date',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Stage 1 Absence Warning Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Stage 1 Warning - Sickness Absence',
        paragraphs: [
          'I am writing to confirm the outcome of the Stage 1 Sickness Absence Review Meeting held on [INSERT: Meeting date]. The meeting was conducted in accordance with the organisation\'s Sickness Absence Policy and with regard to the Acas Code of Practice on Disciplinary and Grievance Procedures.',
          'At the meeting, we discussed your sickness absence record over the relevant review period. Your record is set out below:',
          '[INSERT: Absence dates and reasons]',
          'Your current Bradford Factor score is [INSERT: Bradford Factor score]. This score has exceeded the trigger point set out in the Sickness Absence Policy, which has necessitated this formal review.',
          'During the meeting, we discussed the reasons for your absences and I gave you the opportunity to provide any explanation or mitigating circumstances. We also discussed whether your absences are related to a disability or long-term health condition as defined by the Equality Act 2010, and whether any reasonable adjustments, workplace modifications, or referral to Occupational Health might be appropriate.',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'Having considered all of the information available to me, including the explanations you provided at the meeting, I have decided to issue you with a Stage 1 Absence Warning. This warning will remain on your personnel file for a period of [INSERT: Warning duration] from the date of this letter.',
          'During the period of this warning, your attendance will be monitored closely. Should your attendance fail to improve, or should there be further concerns about your sickness absence, you may be required to attend a Stage 2 Absence Review Meeting, which could result in a further warning or other action under the Sickness Absence Policy.',
          'Note: From 6 April 2026, SSP is payable from the first day of absence with no waiting days. The lower earnings limit has been removed. Ensure the absence management process and any trigger points account for this change.',
        ],
      },
      {
        heading: 'Support and Review',
        paragraphs: [
          'The organisation is committed to supporting you in improving your attendance. The following support measures have been discussed and agreed:',
          'A review meeting will be scheduled for [INSERT: Review date] to assess your attendance and to discuss any further support that may be required.',
          'You are reminded of the Employee Assistance Programme, which provides confidential support and guidance on a range of personal and work-related matters.',
          'If at any time during the review period you believe that additional support would help you to maintain your attendance, please do not hesitate to speak with your line manager or HR.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'You have the right to appeal against this decision. If you wish to appeal, you must submit your grounds of appeal in writing to [INSERT: Manager name] within [INSERT: Appeal deadline] of receiving this letter. Your appeal will be heard by a manager who has not previously been involved in this matter.',
          'This letter is issued in accordance with the organisation\'s Sickness Absence Policy. Nothing in this letter is intended to derogate from your statutory rights under the Employment Rights Act 1996 or any other applicable legislation.',
          'Yours sincerely,',
          '[INSERT: Manager name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'absence-stage2-warning',
    name: 'Stage 2 Absence Warning Letter',
    category: 'Absence',
    description: 'Formal letter issuing a Stage 2 warning under the sickness absence management procedure, referencing the previous Stage 1 warning and escalated concern.',
    filename: 'absence-stage2-warning.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Manager name',
      'Previous warning date',
      'Further absence dates',
      'Bradford Factor score',
      'Meeting date',
      'Warning duration',
      'Review date',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Stage 2 Absence Warning Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Stage 2 Warning - Sickness Absence',
        paragraphs: [
          'I am writing to confirm the outcome of the Stage 2 Sickness Absence Review Meeting held on [INSERT: Meeting date]. The meeting was conducted in accordance with the organisation\'s Sickness Absence Policy and with regard to the Acas Code of Practice on Disciplinary and Grievance Procedures.',
          'You were previously issued with a Stage 1 Absence Warning on [INSERT: Previous warning date]. Despite this warning and the support measures that were put in place, your sickness absence has continued to give cause for concern.',
          'Since the Stage 1 warning was issued, the following further absences have been recorded:',
          '[INSERT: Further absence dates]',
          'Your current Bradford Factor score is [INSERT: Bradford Factor score]. This represents a significant level of absence and has triggered the Stage 2 review under the Sickness Absence Policy.',
          'At the meeting, you were given a full opportunity to explain the reasons for your continued absence and to raise any mitigating circumstances. We discussed whether your absences are connected to a disability or long-term health condition under the Equality Act 2010, and I have taken into account all of the information you provided.',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'Having carefully considered all of the circumstances, including the support already offered and the explanations you provided, I have decided to issue you with a Stage 2 Absence Warning. This is an escalation from the previous Stage 1 warning and reflects the continued concern regarding your attendance.',
          'This warning will remain on your personnel file for a period of [INSERT: Warning duration] from the date of this letter.',
          'I must make you aware that, should your attendance not improve to an acceptable level during the period of this warning, you may be required to attend a Stage 3 Final Absence Review. At Stage 3, the possible outcomes include a final written warning or, in the most serious cases, dismissal on grounds of capability due to persistent absence. It is therefore essential that you take all reasonable steps to improve your attendance.',
          'Note: From 6 April 2026, SSP is payable from the first day of absence with no waiting days. The lower earnings limit has been removed. Ensure the absence management process and any trigger points account for this change.',
        ],
      },
      {
        heading: 'Support and Review',
        paragraphs: [
          'The organisation remains committed to supporting you and will continue to explore all reasonable options to assist you in improving your attendance. The following support measures have been discussed and agreed at this meeting.',
          'A review meeting will be arranged for [INSERT: Review date] to monitor your attendance during the review period.',
          'You are encouraged to make full use of the Employee Assistance Programme and any Occupational Health support that has been offered.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'You have the right to appeal against this decision. If you wish to appeal, you must submit your grounds of appeal in writing to [INSERT: Manager name] within [INSERT: Appeal deadline] of receiving this letter. The appeal will be heard by a manager who has not previously been involved in this matter.',
          'This letter is issued under the organisation\'s Sickness Absence Policy and in accordance with the principles set out in the Acas Code of Practice. Your statutory rights under the Employment Rights Act 1996 are not affected.',
          'Yours sincerely,',
          '[INSERT: Manager name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'absence-stage3-final',
    name: 'Stage 3 Final Absence Review / Dismissal Letter',
    category: 'Absence',
    description: 'Formal letter confirming the outcome of the Stage 3 final absence review, covering the full absence history, previous warnings, support offered, and the final decision including potential dismissal on capability grounds.',
    filename: 'absence-stage3-final.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Panel chair name',
      'Previous warnings summary',
      'Total absence record',
      'Meeting date',
      'Decision',
      'Notice period',
      'Last working day',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Stage 3 Final Absence Review / Dismissal Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Stage 3 Final Absence Review - Outcome',
        paragraphs: [
          'I am writing to confirm the outcome of the Stage 3 Final Sickness Absence Review Meeting held on [INSERT: Meeting date]. This meeting was chaired by [INSERT: Panel chair name] and was conducted in accordance with the organisation\'s Sickness Absence Policy and with due regard to the Acas Code of Practice on Disciplinary and Grievance Procedures.',
          'This meeting was convened because your sickness absence has remained at an unacceptable level despite previous formal warnings and the support measures that have been offered to you throughout this process.',
        ],
      },
      {
        heading: 'Previous Warnings and Absence Record',
        paragraphs: [
          'The following warnings have previously been issued under the Sickness Absence Policy:',
          '[INSERT: Previous warnings summary]',
          'Your total absence record over the relevant review period is as follows:',
          '[INSERT: Total absence record]',
          'At each stage of the process, the organisation has sought to support you in improving your attendance. The support measures offered have included those discussed at previous review meetings, including any Occupational Health referrals, adjustments to your working arrangements, and access to the Employee Assistance Programme.',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'At the Stage 3 meeting, you were given a full opportunity to present any information, explanation, or mitigating circumstances that you wished the panel to consider. The panel carefully considered all of the evidence before it, including your full absence record, the warnings previously issued, the support that has been offered, any medical information provided, and the representations you made at the meeting.',
          'Having considered all of the above, the panel has reached the following decision:',
          '[INSERT: Decision]',
          'If the decision is dismissal: The panel has concluded that, despite the warnings and support provided, your level of sickness absence remains such that the organisation can no longer sustain it. The panel has therefore taken the decision to terminate your employment on the grounds of capability due to persistent sickness absence. This decision has been taken with considerable regret and only after all other reasonable options have been exhausted.',
          'Your notice period is [INSERT: Notice period]. Your last working day will be [INSERT: Last working day]. You will receive payment in lieu of any accrued but untaken annual leave, and your final pay will be calculated and issued in accordance with your contract of employment.',
          'If the decision is a final written warning: The panel has decided to issue you with a final written warning. Should your attendance fail to improve during the period of this warning, the matter will be referred for a further review at which dismissal will be a possible outcome.',
          'Note: From 6 April 2026, SSP is payable from the first day of absence with no waiting days. The lower earnings limit has been removed. Ensure the absence management process and any trigger points account for this change.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'You have the right to appeal against this decision. If you wish to appeal, you must submit your grounds of appeal in writing within [INSERT: Appeal deadline] of receiving this letter. Your appeal should be addressed to the Head of HR or another senior manager as directed. The appeal will be heard by a panel that has had no prior involvement in this matter.',
          'The appeal hearing will be conducted in accordance with the organisation\'s appeal procedure. You will have the right to be accompanied at the appeal hearing by a trade union representative or a work colleague.',
          'This decision has been made in accordance with the organisation\'s Sickness Absence Policy, the Acas Code of Practice, and with due regard to the Employment Rights Act 1996 and the Equality Act 2010.',
          'Yours sincerely,',
          '[INSERT: Panel chair name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },

  // ============================================================
  // DISCIPLINARY (5)
  // ============================================================
  {
    id: 'investigation-invite',
    name: 'Invitation to Investigation Meeting',
    category: 'Disciplinary',
    description: 'Formal letter inviting an employee to attend an investigation meeting as part of a fact-finding process. Clarifies this is not a disciplinary hearing and sets out the employee\'s rights.',
    filename: 'investigation-meeting-invite.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Investigating officer name',
      'Allegation summary',
      'Meeting date and time',
      'Meeting location',
      'Right to be accompanied note',
    ],
    sections: [
      {
        heading: 'Invitation to Investigation Meeting',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Investigation Meeting',
        paragraphs: [
          'I am writing to invite you to attend an investigation meeting in connection with a matter that has been brought to the organisation\'s attention. The purpose of this meeting is to establish the facts of the matter and I wish to emphasise that this is a fact-finding meeting and not a disciplinary hearing. No decision regarding disciplinary action will be made at this meeting.',
          'The matter under investigation relates to the following:',
          '[INSERT: Allegation summary]',
          'The meeting has been arranged for [INSERT: Meeting date and time] at [INSERT: Meeting location]. The meeting will be conducted by [INSERT: Investigating officer name].',
        ],
      },
      {
        heading: 'Your Rights',
        paragraphs: [
          '[INSERT: Right to be accompanied note]',
          'Although there is no statutory right to be accompanied at an investigation meeting under section 10 of the Employment Relations Act 1999, the organisation recognises that investigations can be a source of concern for employees. Accordingly, you may, if you wish, be accompanied by a trade union representative or a work colleague. The role of the companion at an investigation meeting is to provide support. They may not answer questions on your behalf.',
          'You are not required to attend the meeting, but I would strongly encourage you to do so. The investigation will assist in establishing the facts and your account of events is an important part of that process. If you are unable to attend at the time specified, please contact me as soon as possible so that an alternative time can be arranged.',
        ],
      },
      {
        heading: 'Confidentiality',
        paragraphs: [
          'This matter is being treated in the strictest confidence and you are asked not to discuss the details of the investigation with colleagues, other than your chosen companion, as this could compromise the integrity of the process.',
          'A note-taker may be present at the meeting to produce a written record. You will be given the opportunity to review the notes and confirm their accuracy.',
          'If you have any questions about this letter or the investigation process, please do not hesitate to contact me.',
          'Yours sincerely,',
          '[INSERT: Investigating officer name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
      {
        heading: 'Separation of Roles',
        paragraphs: [
          'The investigating officer conducting this meeting has had no involvement in the events under investigation and holds no decision-making authority regarding any disciplinary outcome. The investigation is a fact-finding exercise only. Any decision on whether disciplinary action is appropriate will be made by a separate manager following receipt of the investigation report.',
        ],
      },
    ],
  },
  {
    id: 'investigation-record',
    name: 'Investigation Meeting Record',
    category: 'Disciplinary',
    description: 'Structured template for recording the proceedings of an investigation meeting, including attendees, allegations, questions, responses, documents reviewed, and preliminary findings.',
    filename: 'investigation-meeting-record.docx',
    fields: [
      'Employee name',
      'Investigating officer name',
      'Date of meeting',
      'Note taker name',
      'Allegation summary',
      'Questions and responses',
      'Documents reviewed',
      'Findings summary',
    ],
    sections: [
      {
        heading: 'Investigation Meeting Record',
        paragraphs: [
          'This document provides a record of the investigation meeting conducted as part of the organisation\'s disciplinary procedure. This record should be completed during or immediately after the meeting and should be retained securely on the case file.',
        ],
      },
      {
        heading: 'Meeting Details',
        paragraphs: [
          'Date of Meeting: [INSERT: Date of meeting]',
          'Employee Name: [INSERT: Employee name]',
          'Investigating Officer: [INSERT: Investigating officer name]',
          'Note Taker: [INSERT: Note taker name]',
          'The employee was informed at the outset of the meeting that this is a fact-finding investigation and not a disciplinary hearing. The employee was advised that the purpose of the meeting is to gather information and establish the facts in relation to the matter under investigation.',
        ],
      },
      {
        heading: 'Allegation or Matter Under Investigation',
        paragraphs: [
          'The following allegation or matter was explained to the employee:',
          '[INSERT: Allegation summary]',
          'The investigating officer confirmed that the employee understood the nature of the allegation and the purpose of the meeting before proceeding with the questions.',
        ],
      },
      {
        heading: 'Questions and Responses',
        paragraphs: [
          'The following questions were put to the employee during the meeting. The employee\'s responses are recorded below each question. Where the employee declined to answer a question, this has been noted.',
          '[INSERT: Questions and responses]',
          'The employee was given the opportunity at the end of the meeting to add any further information or context that they considered relevant to the investigation.',
        ],
      },
      {
        heading: 'Documents Reviewed',
        paragraphs: [
          'The following documents were reviewed or referred to during the meeting:',
          '[INSERT: Documents reviewed]',
          'Copies of any documents shown to the employee during the meeting should be attached to this record.',
        ],
      },
      {
        heading: 'Preliminary Findings and Next Steps',
        paragraphs: [
          'Summary of Findings: [INSERT: Findings summary]',
          'The investigating officer should note any further enquiries or interviews that are required before the investigation can be concluded. The employee was informed of the likely next steps and timescales.',
          'The employee was reminded that the matter is confidential and that they should not discuss the details of the investigation with colleagues other than their representative.',
        ],
      },
      {
        heading: 'Verification',
        paragraphs: [
          'This record has been prepared by the note taker and reviewed by the investigating officer for accuracy.',
          'Investigating Officer Signature: _____________________________ Date: ______________',
          'Note Taker Signature: _____________________________ Date: ______________',
          'Employee Signature (to confirm accuracy of record): _____________________________ Date: ______________',
          'If the employee declines to sign the record, this should be noted here with the reason given, if any.',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'disciplinary-invite',
    name: 'Invitation to Disciplinary Hearing',
    category: 'Disciplinary',
    description: 'Formal letter inviting an employee to a disciplinary hearing, setting out the specific allegations, possible outcomes including dismissal where applicable, the right to be accompanied, and enclosed documents.',
    filename: 'disciplinary-hearing-invite.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Hearing chair name',
      'Allegation details',
      'Hearing date and time',
      'Hearing location',
      'Possible outcomes',
      'Right to be accompanied',
      'Documents enclosed list',
    ],
    sections: [
      {
        heading: 'Invitation to Disciplinary Hearing',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Disciplinary Hearing',
        paragraphs: [
          'Following the investigation into the matter previously notified to you, I am writing to inform you that there is sufficient evidence to proceed to a formal disciplinary hearing. This hearing is being convened in accordance with the organisation\'s Disciplinary Policy and Procedure and with regard to the Acas Code of Practice on Disciplinary and Grievance Procedures.',
          'The hearing has been arranged as follows:',
          'Date and Time: [INSERT: Hearing date and time]',
          'Location: [INSERT: Hearing location]',
          'Hearing Chair: [INSERT: Hearing chair name]',
        ],
      },
      {
        heading: 'Allegations',
        paragraphs: [
          'The specific allegation or allegations that you are required to answer are as follows:',
          '[INSERT: Allegation details]',
          'These allegations, if substantiated, may constitute misconduct (or gross misconduct, as applicable) under the organisation\'s Disciplinary Policy.',
        ],
      },
      {
        heading: 'Possible Outcomes',
        paragraphs: [
          'You should be aware that the possible outcomes of this hearing include, but are not limited to:',
          '[INSERT: Possible outcomes]',
          'The range of sanctions available at a disciplinary hearing includes no further action, a first written warning, a final written warning, and dismissal with or without notice. The sanction applied, if any, will depend on the nature and seriousness of the allegation, any mitigating factors, and your previous disciplinary record.',
          'IMPORTANT: From 1 January 2027, the qualifying period for unfair dismissal protection reduces to six months of continuous service and the compensation cap is abolished. If the employee has six or more months of continuous service at the date of any dismissal, full unfair dismissal rights will apply.',
        ],
      },
      {
        heading: 'Right to Be Accompanied',
        paragraphs: [
          '[INSERT: Right to be accompanied]',
          'In accordance with section 10 of the Employment Relations Act 1999, you have the statutory right to be accompanied at this hearing by a trade union representative or a work colleague of your choice. Your companion may address the hearing, put your case, sum up, and respond on your behalf. They may also confer with you during the hearing. However, your companion may not answer questions on your behalf.',
          'If your chosen companion is unavailable on the date of the hearing, you may propose an alternative date, which must be within five working days of the original date. Please inform us of the name of your companion in advance of the hearing.',
        ],
      },
      {
        heading: 'Enclosed Documents',
        paragraphs: [
          'Please find enclosed copies of the documents that will be referred to at the hearing. These are provided to you in advance so that you have a full and fair opportunity to prepare your response:',
          '[INSERT: Documents enclosed list]',
          'If you wish to submit any documents or written statements in support of your case, please provide these to the hearing chair at least two working days before the hearing date.',
          'If you are unable to attend the hearing on the date specified, you should contact me as soon as possible. If you fail to attend without good reason, the hearing may proceed in your absence and a decision may be taken based on the evidence available.',
          'Yours sincerely,',
          '[INSERT: Hearing chair name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
      {
        heading: 'Protected Disclosure Check',
        paragraphs: [
          'If the matters under investigation relate to or arise from a disclosure the employee has made about wrongdoing in the workplace, the employee may have protection under the whistleblowing provisions of the Employment Rights Act 1996 (Part IVA). From April 2026, disclosures about sexual harassment are expressly covered as qualifying disclosures. This must be considered before proceeding.',
        ],
      },
    ],
  },
  {
    id: 'disciplinary-warning',
    name: 'Disciplinary Outcome - Written Warning',
    category: 'Disciplinary',
    description: 'Formal letter confirming the outcome of a disciplinary hearing where the decision is to issue a written warning, including the finding, sanction, improvement required, and right of appeal.',
    filename: 'disciplinary-outcome-warning.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Hearing chair name',
      'Hearing date',
      'Allegation',
      'Finding',
      'Sanction',
      'Warning duration',
      'Improvement required',
      'Review date',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Disciplinary Outcome - Written Warning',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Outcome of Disciplinary Hearing',
        paragraphs: [
          'I am writing to confirm the outcome of the disciplinary hearing held on [INSERT: Hearing date]. The hearing was chaired by [INSERT: Hearing chair name] and was conducted in accordance with the organisation\'s Disciplinary Policy and Procedure and the Acas Code of Practice on Disciplinary and Grievance Procedures.',
          'The allegation considered at the hearing was as follows:',
          '[INSERT: Allegation]',
          'At the hearing, you were given a full opportunity to state your case, present evidence, call witnesses, and respond to the evidence against you. Your representative, if present, was also given the opportunity to address the hearing on your behalf.',
        ],
      },
      {
        heading: 'Finding',
        paragraphs: [
          'Having carefully considered all of the evidence presented at the hearing, including your response and any mitigating factors you raised, the hearing panel has reached the following finding:',
          '[INSERT: Finding]',
        ],
      },
      {
        heading: 'Sanction',
        paragraphs: [
          'In light of the above finding, and having taken into account the seriousness of the matter, any mitigating circumstances, and your previous disciplinary record, the decision is to issue the following sanction:',
          '[INSERT: Sanction]',
          'This warning will remain active on your personnel file for a period of [INSERT: Warning duration] from the date of this letter. After this period, the warning will be considered spent, although a record of it will be retained on your file in accordance with the organisation\'s data retention policy.',
        ],
      },
      {
        heading: 'Improvement Required',
        paragraphs: [
          'You are expected to demonstrate the following improvements in your conduct:',
          '[INSERT: Improvement required]',
          'A review will take place on [INSERT: Review date] to assess whether the required improvements have been sustained. You should be aware that, should there be any further misconduct during the active period of this warning, you may face further disciplinary action, which could result in a more serious sanction up to and including dismissal.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'You have the right to appeal against this decision. If you wish to appeal, you must submit your grounds of appeal in writing within [INSERT: Appeal deadline] of receiving this letter. Your appeal should be addressed to a senior manager as directed by HR. The appeal hearing will be conducted by a person who has had no prior involvement in this matter, and you will have the right to be accompanied.',
          'An appeal may be raised on the following grounds: that the disciplinary procedure was not followed correctly, that the finding was not supported by the evidence, that the sanction imposed was disproportionate, or that new evidence has come to light that was not available at the time of the hearing.',
          'Yours sincerely,',
          '[INSERT: Hearing chair name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
      {
        heading: 'Safeguarding Check',
        paragraphs: [
          'If this matter involves contact with children or vulnerable adults, the organisation must consider whether a referral to the Disclosure and Barring Service or to the relevant local authority designated officer is required, regardless of the outcome of the disciplinary process. This obligation exists independently of the employment process.',
        ],
      },
    ],
  },
  {
    id: 'disciplinary-final-dismissal',
    name: 'Disciplinary Outcome - Final Warning or Dismissal',
    category: 'Disciplinary',
    description: 'Formal outcome letter for a disciplinary hearing where the decision is either a final written warning or dismissal, including full reasoning, reference to previous warnings, notice details, and right of appeal.',
    filename: 'disciplinary-outcome-final.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Hearing chair name',
      'Hearing date',
      'Allegation',
      'Finding',
      'Decision',
      'Reason for decision',
      'Notice period',
      'Last working day',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Disciplinary Outcome - Final Warning or Dismissal',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Outcome of Disciplinary Hearing',
        paragraphs: [
          'I am writing to confirm the outcome of the disciplinary hearing held on [INSERT: Hearing date]. The hearing was chaired by [INSERT: Hearing chair name] and was conducted in accordance with the organisation\'s Disciplinary Policy and Procedure and the Acas Code of Practice on Disciplinary and Grievance Procedures.',
          'The allegation considered at the hearing was as follows:',
          '[INSERT: Allegation]',
          'At the hearing, you were afforded a full and fair opportunity to hear the evidence against you, to state your case, to present any evidence in your defence, to call witnesses, and to have your representative address the hearing on your behalf.',
        ],
      },
      {
        heading: 'Finding',
        paragraphs: [
          'Having carefully considered all of the evidence presented at the hearing, including the investigation report, witness statements, documentary evidence, your response, and any mitigating factors raised, the hearing panel has reached the following finding:',
          '[INSERT: Finding]',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'The panel has given careful consideration to the appropriate sanction, taking into account the seriousness of the matter, any mitigating circumstances, your length of service, your previous disciplinary record, and any relevant previous warnings. The panel\'s decision is as follows:',
          '[INSERT: Decision]',
          'The reason for this decision is:',
          '[INSERT: Reason for decision]',
        ],
      },
      {
        heading: 'If Final Written Warning',
        paragraphs: [
          'If the decision is a final written warning, this warning will remain active on your personnel file for a period of 12 months from the date of this letter, unless otherwise specified. You must be aware that any further misconduct during the active period of this warning is likely to result in your dismissal.',
          'You are expected to demonstrate a sustained improvement in your conduct with immediate effect. Any repetition of the conduct that led to this hearing, or any other misconduct, may lead to your dismissal from the organisation.',
        ],
      },
      {
        heading: 'If Dismissal',
        paragraphs: [
          'If the decision is dismissal, the panel has concluded that the misconduct is of such a serious nature that the employment relationship can no longer be sustained. Your employment with the organisation will be terminated.',
          'Your notice period is [INSERT: Notice period]. Your last working day will be [INSERT: Last working day]. You will receive payment for your notice period and any accrued but untaken annual leave in your final pay. Your P45 will be issued in due course.',
          'In cases of gross misconduct, dismissal will be without notice or payment in lieu of notice. The panel\'s letter will specify whether the dismissal is summary (without notice) or with notice.',
          'You are required to return all organisation property, including identification badges, keys, equipment, and documents, on or before your last working day.',
          'IMPORTANT: From 1 January 2027, the qualifying period for unfair dismissal reduces to six months and the compensation cap is abolished. Before confirming any dismissal, verify: (1) the Acas Code has been followed at every stage, (2) separation of roles has been maintained, (3) the employee was given a genuine opportunity to state their case, (4) all mitigating factors have been considered, and (5) the decision falls within the range of reasonable responses.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'You have the right to appeal against this decision. If you wish to appeal, you must submit your full grounds of appeal in writing within [INSERT: Appeal deadline] of receiving this letter. Your appeal should be addressed to a senior manager as directed by HR.',
          'The appeal will be heard by a panel of appropriate seniority that has had no prior involvement in this matter. You will have the right to be accompanied at the appeal hearing by a trade union representative or a work colleague, in accordance with section 10 of the Employment Relations Act 1999.',
          'You should be aware that an appeal hearing is a review of the original decision and may result in the original decision being upheld, overturned, or substituted with a different sanction. The decision of the appeal panel will be final.',
          'This letter is issued in accordance with the organisation\'s Disciplinary Policy and with due regard to the Employment Rights Act 1996, the Acas Code of Practice on Disciplinary and Grievance Procedures, and all other applicable legislation.',
          'Yours sincerely,',
          '[INSERT: Hearing chair name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },

  // ============================================================
  // GRIEVANCE (5)
  // ============================================================
  {
    id: 'grievance-form',
    name: 'Grievance Submission Form',
    category: 'Grievance',
    description: 'Employee-facing form for formally submitting a grievance, including space for the details of the complaint, the outcome sought, and any previous attempts to resolve the matter informally.',
    filename: 'grievance-submission-form.docx',
    fields: [
      'Employee name',
      'Date submitted',
      'Grievance details',
      'Outcome sought',
      'Previous attempts to resolve',
    ],
    sections: [
      {
        heading: 'Grievance Submission Form',
        paragraphs: [
          'This form should be used by any employee who wishes to raise a formal grievance in accordance with the organisation\'s Grievance Policy and Procedure. The Acas Code of Practice on Disciplinary and Grievance Procedures recommends that employees should raise grievances formally in writing where informal resolution has not been possible.',
          'Completed forms should be submitted to your line manager. If your grievance relates to your line manager, the form should be submitted to their manager or to HR.',
        ],
      },
      {
        heading: 'Employee Details',
        paragraphs: [
          'Employee Name: [INSERT: Employee name]',
          'Date Submitted: [INSERT: Date submitted]',
          'Job Title and Department: To be completed by the employee.',
        ],
      },
      {
        heading: 'Details of Grievance',
        paragraphs: [
          'Please set out the details of your grievance as fully as possible. You should include the following information: what happened, when it happened, where it happened, who was involved, and the names of any witnesses.',
          '[INSERT: Grievance details]',
          'You should attach any supporting documents, correspondence, or evidence that you wish to be considered as part of the grievance process.',
        ],
      },
      {
        heading: 'Outcome Sought',
        paragraphs: [
          'Please describe the outcome or resolution that you are seeking. This will help the person hearing your grievance to understand what you hope to achieve through this process.',
          '[INSERT: Outcome sought]',
        ],
      },
      {
        heading: 'Previous Attempts to Resolve',
        paragraphs: [
          'The organisation encourages employees to attempt to resolve concerns informally in the first instance, where it is appropriate to do so. Please provide details of any steps you have already taken to try to resolve this matter.',
          '[INSERT: Previous attempts to resolve]',
          'If you have not attempted to resolve the matter informally, please explain why you consider it appropriate to proceed directly to a formal grievance.',
        ],
      },
      {
        heading: 'Declaration and Signature',
        paragraphs: [
          'I confirm that the information provided in this form is true and accurate to the best of my knowledge. I understand that the organisation will investigate my grievance in accordance with the Grievance Policy and that I will be invited to a grievance meeting to discuss my concerns.',
          'Employee Signature: _____________________________ Date: ______________',
          'For Office Use Only: Date Received by Manager/HR: ______________ Acknowledged on: ______________',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'grievance-acknowledgement',
    name: 'Acknowledgement of Grievance Letter',
    category: 'Grievance',
    description: 'Letter confirming receipt of a formal grievance, outlining the next steps in the process, and providing details of the grievance meeting.',
    filename: 'grievance-acknowledgement.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'HR contact name',
      'Date grievance received',
      'Grievance summary',
      'Meeting date and time',
      'Right to be accompanied',
    ],
    sections: [
      {
        heading: 'Acknowledgement of Grievance',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Acknowledgement of Your Grievance',
        paragraphs: [
          'I am writing to acknowledge receipt of your formal grievance, which was received on [INSERT: Date grievance received]. Thank you for setting out your concerns in writing. The organisation takes all grievances seriously and your complaint will be dealt with in accordance with the Grievance Policy and Procedure and with regard to the Acas Code of Practice on Disciplinary and Grievance Procedures.',
          'I understand that the nature of your grievance relates to the following:',
          '[INSERT: Grievance summary]',
          'Please note that this summary is based on my initial understanding of your grievance submission. You will have the opportunity to provide further details and clarification at the grievance meeting.',
        ],
      },
      {
        heading: 'Next Steps',
        paragraphs: [
          'In accordance with the Grievance Policy, a grievance meeting will be arranged so that you can explain your complaint in full and so that the hearing officer can ask any questions necessary to understand the issues raised. The meeting has been provisionally arranged as follows:',
          'Meeting Date and Time: [INSERT: Meeting date and time]',
          '[INSERT: Right to be accompanied]',
          'In accordance with section 10 of the Employment Relations Act 1999, you have the right to be accompanied at the grievance meeting by a trade union representative or a work colleague of your choice. If you wish to be accompanied, please let us know the name of your companion before the meeting.',
          'If you are unable to attend at the time and date specified above, please contact me as soon as possible so that an alternative time can be arranged.',
        ],
      },
      {
        heading: 'Confidentiality',
        paragraphs: [
          'Your grievance will be handled confidentially. Information will only be shared with those who need to be involved in investigating and resolving your complaint. You are also asked to maintain confidentiality regarding the details of your grievance during the process.',
          'If you have any questions about the grievance process or if there is anything you wish to discuss before the meeting, please do not hesitate to contact me.',
          'Yours sincerely,',
          '[INSERT: HR contact name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
      {
        heading: 'Protected Disclosure Check',
        paragraphs: [
          'If any part of this grievance concerns wrongdoing in the workplace, including health and safety failures, criminal conduct, breach of legal obligations, or concealment of any of these, the complaint may amount to a protected disclosure under Part IVA of the Employment Rights Act 1996. From April 2026, sexual harassment disclosures are also expressly covered. Additional protections apply in such cases.',
        ],
      },
    ],
  },
  {
    id: 'grievance-invite',
    name: 'Invitation to Grievance Meeting',
    category: 'Grievance',
    description: 'Formal invitation to a grievance hearing, setting out the grievance summary, meeting details, and the employee\'s right to be accompanied.',
    filename: 'grievance-meeting-invite.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Hearing officer name',
      'Grievance summary',
      'Meeting date and time',
      'Meeting location',
      'Right to be accompanied',
    ],
    sections: [
      {
        heading: 'Invitation to Grievance Meeting',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Invitation to Grievance Meeting',
        paragraphs: [
          'I am writing to invite you to a formal grievance meeting to discuss the grievance you submitted on the date previously acknowledged. This meeting is being arranged in accordance with the organisation\'s Grievance Policy and Procedure and with regard to the Acas Code of Practice on Disciplinary and Grievance Procedures.',
          'The meeting has been arranged as follows:',
          'Date and Time: [INSERT: Meeting date and time]',
          'Location: [INSERT: Meeting location]',
          'Hearing Officer: [INSERT: Hearing officer name]',
        ],
      },
      {
        heading: 'Grievance Summary',
        paragraphs: [
          'Based on your written submission, the grievance relates to the following:',
          '[INSERT: Grievance summary]',
          'At the meeting, you will be given a full opportunity to explain your grievance in detail, to provide any additional information or evidence, and to identify the outcome you are seeking. The hearing officer may also ask you questions in order to understand the issues fully.',
        ],
      },
      {
        heading: 'Right to Be Accompanied',
        paragraphs: [
          '[INSERT: Right to be accompanied]',
          'You have the statutory right to be accompanied at this meeting by a trade union representative or a work colleague of your choice, in accordance with section 10 of the Employment Relations Act 1999. Your companion may address the meeting on your behalf, put forward your case, and confer with you during the meeting, but they may not answer questions on your behalf.',
          'If your chosen companion is unavailable on the date proposed, you may suggest an alternative date within five working days of the original date.',
        ],
      },
      {
        heading: 'Preparation',
        paragraphs: [
          'If you have any additional documents or evidence that you wish to present at the meeting, please provide copies to the hearing officer at least two working days before the meeting date so that they can be reviewed in advance.',
          'If you are unable to attend the meeting on the date and time specified, please contact me as soon as possible to arrange an alternative date.',
          'Yours sincerely,',
          '[INSERT: Hearing officer name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'grievance-outcome',
    name: 'Grievance Outcome Letter',
    category: 'Grievance',
    description: 'Formal letter setting out the findings and decision following a grievance hearing, including actions to be taken and the right of appeal.',
    filename: 'grievance-outcome.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Hearing officer name',
      'Meeting date',
      'Grievance summary',
      'Findings',
      'Decision',
      'Actions to be taken',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Grievance Outcome Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Outcome of Grievance Meeting',
        paragraphs: [
          'I am writing to confirm the outcome of the grievance meeting held on [INSERT: Meeting date]. The meeting was conducted by [INSERT: Hearing officer name] in accordance with the organisation\'s Grievance Policy and Procedure and with regard to the Acas Code of Practice on Disciplinary and Grievance Procedures.',
          'Your grievance, as set out in your written submission and as discussed at the meeting, related to the following:',
          '[INSERT: Grievance summary]',
          'At the meeting, you were given a full and fair opportunity to explain your grievance, to present supporting evidence, and to describe the outcome you were seeking. The hearing officer asked questions to ensure that all relevant aspects of your complaint were explored.',
        ],
      },
      {
        heading: 'Investigation and Findings',
        paragraphs: [
          'Following the grievance meeting, the hearing officer conducted further enquiries as necessary, which may have included speaking with relevant witnesses, reviewing documentation, and considering any other evidence relevant to the complaint. The findings in respect of each element of your grievance are set out below:',
          '[INSERT: Findings]',
          'The hearing officer has considered all of the available evidence, including the information you provided, the responses of any other parties, and any relevant policies or procedures.',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'Having considered all of the evidence and the findings set out above, the hearing officer has reached the following decision:',
          '[INSERT: Decision]',
          'Where the grievance has been upheld in whole or in part, the following actions will be taken to address the matters raised:',
          '[INSERT: Actions to be taken]',
          'Where the grievance has not been upheld, the hearing officer has provided reasons for this decision in the findings section above.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'If you are not satisfied with the outcome of your grievance, you have the right to appeal. If you wish to appeal, you must set out your grounds of appeal in writing and submit them within [INSERT: Appeal deadline] of receiving this letter.',
          'Your appeal should clearly state the grounds on which you are appealing. These may include that the grievance procedure was not followed correctly, that the decision was not supported by the evidence, that relevant evidence was not considered, or that new evidence has come to light.',
          'The appeal will be heard by a manager of appropriate seniority who has not been previously involved in your grievance. You will have the right to be accompanied at the appeal hearing by a trade union representative or a work colleague.',
          'Yours sincerely,',
          '[INSERT: Hearing officer name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
      {
        heading: 'Protected Disclosure Check',
        paragraphs: [
          'If any part of this grievance concerns wrongdoing in the workplace, including health and safety failures, criminal conduct, breach of legal obligations, or concealment of any of these, the complaint may amount to a protected disclosure under Part IVA of the Employment Rights Act 1996. From April 2026, sexual harassment disclosures are also expressly covered. Additional protections apply in such cases.',
        ],
      },
    ],
  },
  {
    id: 'grievance-appeal-outcome',
    name: 'Grievance Appeal Outcome Letter',
    category: 'Grievance',
    description: 'Formal letter confirming the outcome of a grievance appeal, including the original grievance, appeal grounds, findings on appeal, and final decision.',
    filename: 'grievance-appeal-outcome.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Appeal chair name',
      'Appeal hearing date',
      'Original grievance summary',
      'Appeal grounds',
      'Appeal findings',
      'Appeal decision',
      'Further recourse',
    ],
    sections: [
      {
        heading: 'Grievance Appeal Outcome Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Outcome of Grievance Appeal Hearing',
        paragraphs: [
          'I am writing to confirm the outcome of the grievance appeal hearing held on [INSERT: Appeal hearing date]. The appeal was heard by [INSERT: Appeal chair name], who had no prior involvement in the original grievance process. The hearing was conducted in accordance with the organisation\'s Grievance Policy and Procedure and with regard to the Acas Code of Practice on Disciplinary and Grievance Procedures.',
        ],
      },
      {
        heading: 'Background',
        paragraphs: [
          'You submitted a formal grievance which was heard at a grievance meeting. The original grievance related to the following:',
          '[INSERT: Original grievance summary]',
          'You were notified of the outcome of your grievance by letter and you subsequently exercised your right to appeal against that decision. Your grounds of appeal were as follows:',
          '[INSERT: Appeal grounds]',
        ],
      },
      {
        heading: 'Appeal Hearing',
        paragraphs: [
          'At the appeal hearing, you were given a full opportunity to present your grounds of appeal, to provide any additional evidence or information, and to explain why you believe the original decision was incorrect. The appeal chair also reviewed the documentation from the original grievance process, including the investigation findings, witness statements, and the original outcome letter.',
          'The appeal chair considered all of the evidence afresh, including any new evidence presented at the appeal hearing.',
        ],
      },
      {
        heading: 'Appeal Findings',
        paragraphs: [
          'The appeal chair\'s findings in relation to each ground of appeal are as follows:',
          '[INSERT: Appeal findings]',
        ],
      },
      {
        heading: 'Appeal Decision',
        paragraphs: [
          'Having carefully considered all of the evidence and your grounds of appeal, the appeal chair has reached the following decision:',
          '[INSERT: Appeal decision]',
          'This decision may uphold the original grievance outcome, overturn it in whole or in part, or substitute it with a different outcome. Where the appeal has resulted in a change to the original decision, the reasons for this are set out in the findings above.',
        ],
      },
      {
        heading: 'Further Recourse',
        paragraphs: [
          '[INSERT: Further recourse]',
          'This is the final stage of the organisation\'s internal grievance process. The decision of the appeal chair is final and there is no further right of internal appeal.',
          'You should be aware that this does not affect any statutory rights you may have. If you believe that you have been treated unlawfully, you may wish to seek independent legal advice or contact the Advisory, Conciliation and Arbitration Service (Acas) for further guidance. Under the Employment Rights Act 1996 and the Equality Act 2010, employees may in certain circumstances have the right to bring a claim to an employment tribunal.',
          'Yours sincerely,',
          '[INSERT: Appeal chair name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },

  // ============================================================
  // CAPABILITY (5)
  // ============================================================
  {
    id: 'performance-improvement-plan',
    name: 'Performance Improvement Plan',
    category: 'Capability',
    description: 'Structured performance improvement plan setting out performance concerns, expected standards, SMART objectives, support measures, review schedule, and consequences of failure to improve.',
    filename: 'performance-improvement-plan.docx',
    fields: [
      'Employee name',
      'Manager name',
      'Date',
      'Role',
      'Performance concerns',
      'Expected standards',
      'Support measures',
      'Review dates',
      'Review period duration',
      'Consequences of no improvement',
    ],
    sections: [
      {
        heading: 'Performance Improvement Plan',
        paragraphs: [
          'This Performance Improvement Plan (PIP) is being issued in accordance with the organisation\'s Capability Policy and Procedure. The purpose of this plan is to set out clearly the areas where your performance is not meeting the required standard, to define the improvements that are expected, and to provide you with the support necessary to achieve those improvements.',
        ],
      },
      {
        heading: 'Employee Details',
        paragraphs: [
          'Employee Name: [INSERT: Employee name]',
          'Role: [INSERT: Role]',
          'Manager: [INSERT: Manager name]',
          'Date PIP Issued: [INSERT: Date]',
          'Review Period: [INSERT: Review period duration]',
        ],
      },
      {
        heading: 'Performance Concerns',
        paragraphs: [
          'The following areas of concern have been identified in relation to your performance. These concerns have been discussed with you and you have been made aware of the standards that are expected:',
          '[INSERT: Performance concerns]',
          'These concerns are based on evidence gathered through normal management oversight, including performance reviews, feedback from colleagues or clients, quality assessments, and observations of your work.',
        ],
      },
      {
        heading: 'Expected Standards and Objectives',
        paragraphs: [
          'In order to demonstrate the required improvement, you are expected to meet the following standards and objectives. These objectives are intended to be Specific, Measurable, Achievable, Relevant, and Time-bound (SMART):',
          '[INSERT: Expected standards]',
          'These objectives have been discussed with you and you have been given the opportunity to comment on them. They are considered to be reasonable and achievable within the review period, with the support measures outlined below.',
        ],
      },
      {
        heading: 'Support Measures',
        paragraphs: [
          'The organisation is committed to supporting you in meeting the required standards. The following support measures will be provided during the review period:',
          '[INSERT: Support measures]',
          'Support may include additional training, coaching, mentoring, regular one-to-one meetings with your manager, adjustments to your workload, or any other reasonable measures that would assist you in improving your performance.',
          'If at any time during the review period you feel that additional support would be beneficial, you should discuss this with your manager.',
        ],
      },
      {
        heading: 'Review Schedule',
        paragraphs: [
          'Your performance against the objectives set out in this plan will be reviewed at regular intervals during the review period. Review meetings have been scheduled as follows:',
          '[INSERT: Review dates]',
          'At each review meeting, your progress towards the objectives will be assessed and documented. You will be given feedback on your performance and the opportunity to raise any concerns or difficulties you are experiencing.',
          'If your performance has improved to the required standard by the end of the review period, this will be confirmed in writing and no further action will be taken under the Capability Policy at this time.',
        ],
      },
      {
        heading: 'Consequences of Failure to Improve',
        paragraphs: [
          '[INSERT: Consequences of no improvement]',
          'You should be aware that, if your performance does not improve to the required standard during the review period, or if improvement is not sustained, the matter may be progressed to the next stage of the Capability Policy. This may include a formal capability meeting at which the possible outcomes could include a formal capability warning, a further performance improvement plan, redeployment to a suitable alternative role (where one is available), or, in the most serious cases, dismissal on the grounds of capability.',
          'This Performance Improvement Plan is issued with the genuine intention of helping you to improve your performance and to succeed in your role. The organisation wishes to see you reach the required standard and will provide reasonable support to help you achieve this.',
        ],
      },
      {
        heading: 'Signatures',
        paragraphs: [
          'Employee Signature: _____________________________ Date: ______________',
          'Manager Signature: _____________________________ Date: ______________',
          'By signing this document, the employee acknowledges receipt of the Performance Improvement Plan and confirms that its contents have been discussed and explained. Signing does not imply agreement with the concerns raised.',
          'A copy of this plan will be retained on the employee\'s personnel file.',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'capability-invite',
    name: 'Invitation to Capability Meeting',
    category: 'Capability',
    description: 'Formal invitation to a capability meeting, setting out the performance concerns, meeting details, possible outcomes, and the right to be accompanied.',
    filename: 'capability-meeting-invite.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Meeting chair name',
      'Performance concerns summary',
      'Meeting date and time',
      'Meeting location',
      'Right to be accompanied',
      'Possible outcomes',
    ],
    sections: [
      {
        heading: 'Invitation to Capability Meeting',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Invitation to Formal Capability Meeting',
        paragraphs: [
          'I am writing to invite you to a formal capability meeting to discuss concerns about your performance in your role. This meeting is being arranged in accordance with the organisation\'s Capability Policy and Procedure and with regard to the Acas Code of Practice.',
          'The meeting has been arranged as follows:',
          'Date and Time: [INSERT: Meeting date and time]',
          'Location: [INSERT: Meeting location]',
          'Meeting Chair: [INSERT: Meeting chair name]',
        ],
      },
      {
        heading: 'Performance Concerns',
        paragraphs: [
          'The performance concerns that will be discussed at this meeting are summarised below:',
          '[INSERT: Performance concerns summary]',
          'At the meeting, you will be given a full opportunity to respond to these concerns, to provide any explanation or mitigating factors, and to put forward any information you wish to be taken into account. The meeting chair may also ask you questions to ensure that the concerns are fully explored and understood.',
        ],
      },
      {
        heading: 'Possible Outcomes',
        paragraphs: [
          'You should be aware that the possible outcomes of this meeting include:',
          '[INSERT: Possible outcomes]',
          'The range of possible outcomes may include no further action, the issuing of a capability warning, the implementation or revision of a Performance Improvement Plan, redeployment to a suitable alternative role, or, in the most serious cases, dismissal on the grounds of capability. The outcome will depend on the evidence considered and the representations made at the meeting.',
        ],
      },
      {
        heading: 'Right to Be Accompanied',
        paragraphs: [
          '[INSERT: Right to be accompanied]',
          'In accordance with section 10 of the Employment Relations Act 1999, you have the statutory right to be accompanied at this meeting by a trade union representative or a work colleague of your choice. Your companion may address the meeting, put your case, and confer with you during the meeting, but may not answer questions on your behalf.',
          'If your chosen companion is unavailable on the proposed date, you may suggest an alternative date within five working days of the original date.',
        ],
      },
      {
        heading: 'Preparation',
        paragraphs: [
          'Enclosed with this letter you will find copies of relevant documents, including any performance review records, the Performance Improvement Plan (if applicable), and any other evidence that will be referred to at the meeting. Please review these documents before the meeting.',
          'If you have any documents or evidence that you wish to present at the meeting, please provide copies to the meeting chair at least two working days in advance.',
          'If you are unable to attend the meeting on the date specified, please contact me as soon as possible to arrange an alternative date. If you fail to attend without good reason, the meeting may proceed in your absence.',
          'Yours sincerely,',
          '[INSERT: Meeting chair name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'capability-stage1-warning',
    name: 'Stage 1 Capability Warning Letter',
    category: 'Capability',
    description: 'Outcome letter following a Stage 1 capability meeting, setting out the performance shortfalls identified, expected improvements, support offered, review period, and right of appeal.',
    filename: 'capability-stage1-warning.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Meeting chair name',
      'Meeting date',
      'Performance concerns',
      'Expected improvements',
      'Support offered',
      'Review period',
      'Review date',
      'Warning duration',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Stage 1 Capability Warning Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Stage 1 Capability Warning',
        paragraphs: [
          'I am writing to confirm the outcome of the formal capability meeting held on [INSERT: Meeting date]. The meeting was chaired by [INSERT: Meeting chair name] and was conducted in accordance with the organisation\'s Capability Policy and Procedure and with due regard to the Acas Code of Practice.',
          'At the meeting, the following performance concerns were discussed:',
          '[INSERT: Performance concerns]',
          'You were given a full opportunity to respond to these concerns, to offer any explanation, and to present any mitigating factors. The meeting chair considered all of the information presented, including your representations, before reaching a decision.',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'Having considered all of the evidence, the meeting chair has decided to issue you with a Stage 1 Capability Warning. This warning reflects the fact that your performance has not met the required standard despite the informal support and guidance that has been provided to date.',
          'This warning will remain active on your personnel file for a period of [INSERT: Warning duration] from the date of this letter.',
        ],
      },
      {
        heading: 'Expected Improvements',
        paragraphs: [
          'During the period of this warning, you are expected to demonstrate the following improvements:',
          '[INSERT: Expected improvements]',
          'These improvements are considered to be reasonable and achievable and have been discussed with you at the capability meeting.',
        ],
      },
      {
        heading: 'Support',
        paragraphs: [
          'The organisation is committed to helping you achieve the required standard. The following support measures have been agreed:',
          '[INSERT: Support offered]',
          'Your performance will be reviewed at regular intervals during the review period. The next review meeting is scheduled for [INSERT: Review date]. The review period will last for [INSERT: Review period].',
          'If your performance improves to the required standard and is sustained throughout the review period, this will be confirmed and no further action will be taken at this time.',
          'However, if your performance does not improve, or if improvement is not sustained, you may be required to attend a Stage 2 Capability Meeting. You should be aware that the possible outcomes at Stage 2 include a final capability warning, which, if followed by continued underperformance, could lead to your dismissal on the grounds of capability.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'You have the right to appeal against this decision. If you wish to appeal, you must submit your grounds of appeal in writing within [INSERT: Appeal deadline] of receiving this letter. The appeal will be heard by a manager who has not previously been involved in this matter, and you will have the right to be accompanied.',
          'Yours sincerely,',
          '[INSERT: Meeting chair name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'capability-stage2-final',
    name: 'Stage 2 Capability Final Warning Letter',
    category: 'Capability',
    description: 'Escalated capability warning letter referencing the previous Stage 1 warning, ongoing performance concerns, and a clear statement that dismissal may follow if performance does not improve.',
    filename: 'capability-stage2-final.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Meeting chair name',
      'Meeting date',
      'Previous warning date',
      'Ongoing performance concerns',
      'Expected improvements',
      'Support offered',
      'Review period',
      'Warning duration',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Stage 2 Capability Final Warning Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Stage 2 Final Capability Warning',
        paragraphs: [
          'I am writing to confirm the outcome of the Stage 2 Capability Meeting held on [INSERT: Meeting date]. The meeting was chaired by [INSERT: Meeting chair name] and was conducted in accordance with the organisation\'s Capability Policy and Procedure and with due regard to the Acas Code of Practice.',
          'You were issued with a Stage 1 Capability Warning on [INSERT: Previous warning date]. Since that warning was issued, your performance has been monitored during the review period and further support has been provided in accordance with the measures agreed at Stage 1.',
          'Despite the warning and the support offered, the following performance concerns remain:',
          '[INSERT: Ongoing performance concerns]',
          'At the meeting, you were given a full opportunity to respond to these concerns, to explain any difficulties you have experienced, and to put forward any mitigating factors. The meeting chair carefully considered all of the information presented.',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'Having considered all of the evidence, including the support that has been provided, your representations at the meeting, and the fact that sufficient improvement has not been achieved despite the Stage 1 Warning, the meeting chair has decided to issue you with a Stage 2 Final Capability Warning.',
          'This is the final stage of the formal capability warning process. This warning will remain active on your personnel file for a period of [INSERT: Warning duration] from the date of this letter.',
        ],
      },
      {
        heading: 'Expected Improvements and Support',
        paragraphs: [
          'You are expected to demonstrate the following improvements during the review period:',
          '[INSERT: Expected improvements]',
          'The following support measures will continue to be provided:',
          '[INSERT: Support offered]',
          'Your performance will be closely monitored during the review period of [INSERT: Review period].',
        ],
      },
      {
        heading: 'Consequences',
        paragraphs: [
          'You must understand that this is a final warning. If your performance does not improve to the required standard during the review period, or if any improvement is not sustained, you will be required to attend a final capability review meeting at which dismissal on the grounds of capability will be a possible outcome.',
          'The organisation genuinely wishes to see your performance improve and will continue to provide reasonable support to help you achieve the required standard. However, it is essential that you recognise the seriousness of this situation and take all necessary steps to address the concerns that have been raised.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'You have the right to appeal against this decision. If you wish to appeal, you must submit your grounds of appeal in writing within [INSERT: Appeal deadline] of receiving this letter. The appeal will be heard by a manager of appropriate seniority who has not previously been involved in this matter. You will have the right to be accompanied at the appeal hearing.',
          'Yours sincerely,',
          '[INSERT: Meeting chair name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'capability-dismissal',
    name: 'Capability Dismissal Letter',
    category: 'Capability',
    description: 'Formal dismissal letter on the grounds of capability, setting out the full performance history, previous warnings issued, support offered, the decision and rationale, notice arrangements, and the right of appeal.',
    filename: 'capability-dismissal.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Panel chair name',
      'Meeting date',
      'Performance history',
      'Previous warnings',
      'Decision',
      'Reason',
      'Notice period',
      'Last working day',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Capability Dismissal Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Outcome of Final Capability Review Meeting',
        paragraphs: [
          'I am writing to confirm the outcome of the final capability review meeting held on [INSERT: Meeting date]. The meeting was chaired by [INSERT: Panel chair name] and was conducted in accordance with the organisation\'s Capability Policy and Procedure, with due regard to the Acas Code of Practice on Disciplinary and Grievance Procedures, and in compliance with the Employment Rights Act 1996.',
        ],
      },
      {
        heading: 'Performance History',
        paragraphs: [
          'The panel reviewed your full performance history in reaching its decision. The key points are summarised below:',
          '[INSERT: Performance history]',
          'The following formal warnings have been issued during the capability process:',
          '[INSERT: Previous warnings]',
          'At each stage of the process, the organisation has provided support to assist you in improving your performance. This support has been documented and was reviewed at the meeting. Despite the warnings issued and the support provided, your performance has not improved to the required standard.',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'At the meeting, you were given a full opportunity to present any information, explanation, or mitigating circumstances. The panel carefully considered all of the evidence before it, including your full performance record, the previous warnings, the support provided, any medical or personal factors raised, and the representations you and your companion made at the meeting.',
          'Having considered all of the above, the panel has reached the following decision:',
          '[INSERT: Decision]',
          'The reason for this decision is as follows:',
          '[INSERT: Reason]',
          'The panel has concluded that, despite the extensive support provided and the formal warnings issued at each stage of the capability process, your performance has not reached and is unlikely to reach the standard required for your role. All reasonable alternatives have been considered, including redeployment, and the panel has determined that dismissal is the appropriate and proportionate outcome in the circumstances.',
        ],
      },
      {
        heading: 'Notice and Termination',
        paragraphs: [
          'Your employment will be terminated with effect from [INSERT: Last working day]. You are entitled to a notice period of [INSERT: Notice period] in accordance with your contract of employment and the statutory minimum notice provisions set out in section 86 of the Employment Rights Act 1996.',
          'You will receive payment for your notice period and any accrued but untaken annual leave in your final pay. Your P45 will be issued to you following your termination date.',
          'You are required to return all organisation property, including identification badges, keys, equipment, and documents, on or before your last working day.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'You have the right to appeal against this decision. If you wish to appeal, you must submit your grounds of appeal in writing within [INSERT: Appeal deadline] of receiving this letter. Your appeal should be addressed to the Head of HR or another senior manager as directed.',
          'The appeal will be heard by a panel of appropriate seniority that has had no prior involvement in this matter. You will have the right to be accompanied at the appeal hearing by a trade union representative or a work colleague in accordance with section 10 of the Employment Relations Act 1999.',
          'The appeal hearing may result in the original decision being upheld, overturned, or substituted with a different outcome. The decision of the appeal panel will be final.',
          'Yours sincerely,',
          '[INSERT: Panel chair name]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },

  // ============================================================
  // GENERAL (5)
  // ============================================================
  {
    id: 'contract-variation',
    name: 'Contract Variation Letter',
    category: 'General',
    description: 'Formal letter proposing a variation to the employee\'s terms and conditions of employment, setting out the current terms, proposed changes, reason, effective date, and the requirement for the employee\'s response.',
    filename: 'contract-variation.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Current terms',
      'Proposed new terms',
      'Reason for variation',
      'Effective date',
      'Response deadline',
      'Consultation notes',
    ],
    sections: [
      {
        heading: 'Contract Variation Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Proposed Variation to Your Terms and Conditions of Employment',
        paragraphs: [
          'I am writing to inform you of a proposed variation to your terms and conditions of employment. Under section 4 of the Employment Rights Act 1996, the organisation is required to notify you in writing of any changes to the particulars of your employment. This letter sets out the proposed changes and invites your agreement.',
        ],
      },
      {
        heading: 'Current Terms',
        paragraphs: [
          'Your current terms and conditions in respect of the matter subject to this proposed variation are as follows:',
          '[INSERT: Current terms]',
        ],
      },
      {
        heading: 'Proposed New Terms',
        paragraphs: [
          'It is proposed that your terms and conditions be varied as follows:',
          '[INSERT: Proposed new terms]',
          'The reason for this proposed variation is:',
          '[INSERT: Reason for variation]',
        ],
      },
      {
        heading: 'Consultation',
        paragraphs: [
          '[INSERT: Consultation notes]',
          'The organisation has sought to consult with you regarding this proposed change. Consultation is an important part of the process and the organisation values your input. If you have any questions, concerns, or alternative proposals, you are encouraged to raise these before the response deadline.',
          'If the proposed variation relates to a change that affects 20 or more employees, the organisation will ensure compliance with its collective consultation obligations under the Trade Union and Labour Relations (Consolidation) Act 1992.',
        ],
      },
      {
        heading: 'Effective Date and Response',
        paragraphs: [
          'It is proposed that the variation will take effect from [INSERT: Effective date], subject to your agreement.',
          'Please confirm whether you agree to this variation by [INSERT: Response deadline]. You may indicate your agreement by signing and returning the enclosed copy of this letter, or by confirming your agreement in writing by email to HR.',
          'If you do not agree to the proposed variation, please contact me to discuss the matter further. The organisation will seek to reach agreement through continued dialogue and consultation. You should be aware that, in certain circumstances, the organisation may need to implement the change following a reasonable period of consultation, even where agreement cannot be reached. In such cases, the organisation will act in accordance with its legal obligations and will have due regard to the impact on affected employees.',
          'All other terms and conditions of your employment remain unchanged.',
          'Yours sincerely,',
          'Authorised Signatory',
          'I agree to the proposed variation to my terms and conditions of employment as set out in this letter.',
          'Employee Signature: _____________________________ Date: ______________',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'settlement-heads',
    name: 'Settlement Agreement - Heads of Terms',
    category: 'General',
    description: 'Heads of terms template for a settlement agreement, setting out the key commercial terms. This is not a legally binding agreement and is subject to the execution of a formal settlement agreement with independent legal advice.',
    filename: 'settlement-heads-of-terms.docx',
    fields: [
      'Employee name',
      'Employer name',
      'Date',
      'Termination date',
      'Settlement sum',
      'Ex-gratia payment',
      'Notice pay',
      'Holiday pay accrued',
      'Reference terms',
      'Confidentiality terms',
      'Legal advice contribution',
      'Claims waived',
    ],
    sections: [
      {
        heading: 'Settlement Agreement - Heads of Terms',
        paragraphs: [
          'PRIVATE AND CONFIDENTIAL',
          'WITHOUT PREJUDICE AND SUBJECT TO CONTRACT',
          'These heads of terms are provided on a without prejudice basis and are not intended to create legally binding obligations. They are subject to the execution of a formal settlement agreement in accordance with section 203 of the Employment Rights Act 1996 and section 147 of the Equality Act 2010.',
        ],
      },
      {
        heading: 'Parties',
        paragraphs: [
          'Employer: [INSERT: Employer name]',
          'Employee: [INSERT: Employee name]',
          'Date: [INSERT: Date]',
        ],
      },
      {
        heading: 'Proposed Terms',
        paragraphs: [
          '1. Termination Date: The employee\'s employment will terminate on [INSERT: Termination date]. The employee will continue to receive their normal salary and benefits up to and including the termination date.',
          '2. Notice: The employee will receive payment in lieu of their contractual notice period in the sum of [INSERT: Notice pay] (less deductions for income tax and national insurance contributions).',
          '3. Accrued Holiday Pay: The employee will receive payment for accrued but untaken annual leave in the amount of [INSERT: Holiday pay accrued] (less statutory deductions).',
          '4. Settlement Sum: In consideration of the employee entering into the settlement agreement and waiving the claims set out below, the employer will pay to the employee a total settlement sum of [INSERT: Settlement sum].',
          '5. Ex-gratia Payment: The settlement sum includes an ex-gratia payment of [INSERT: Ex-gratia payment]. The first GBP 30,000 of this payment will be paid free of income tax and national insurance contributions in accordance with section 401 of the Income Tax (Earnings and Pensions) Act 2003, to the extent that this exemption applies. Any amount in excess of GBP 30,000 will be subject to deductions for income tax. The employer makes no warranty as to the tax treatment of any payment and the employee will be responsible for any additional tax liability arising.',
        ],
      },
      {
        heading: 'Reference and Announcements',
        paragraphs: [
          '6. Reference: The employer will provide a reference in the terms set out below when requested by prospective employers:',
          '[INSERT: Reference terms]',
          '7. The parties will agree a mutually acceptable form of words regarding the employee\'s departure for use with colleagues, clients, and other third parties.',
        ],
      },
      {
        heading: 'Confidentiality and Claims',
        paragraphs: [
          '8. Confidentiality: [INSERT: Confidentiality terms]',
          'Both parties agree to keep the existence and terms of the settlement agreement confidential, save where disclosure is required by law, for the purposes of obtaining professional advice, or to immediate family members who agree to observe the same confidence.',
          '9. Claims Waived: The employee agrees to waive the following claims in consideration of the payments set out above:',
          '[INSERT: Claims waived]',
          'The waiver will include, but is not limited to, claims for unfair dismissal under the Employment Rights Act 1996, claims for discrimination under the Equality Act 2010, claims for breach of contract, claims for unlawful deductions from wages, and claims under the Working Time Regulations 1998. The waiver will not extend to claims in respect of personal injury of which the employee is not aware at the date of the agreement, accrued pension rights, or the right to enforce the terms of the settlement agreement itself.',
        ],
      },
      {
        heading: 'Legal Advice',
        paragraphs: [
          '10. Legal Advice Contribution: The employer will contribute [INSERT: Legal advice contribution] (plus VAT) towards the employee\'s costs of obtaining independent legal advice from a qualified solicitor or other relevant independent adviser on the terms and effect of the settlement agreement, as required by section 203(3) of the Employment Rights Act 1996.',
          '11. The employee\'s legal adviser will be required to sign the adviser\'s certificate confirming that the requirements of section 203 of the Employment Rights Act 1996 have been satisfied.',
        ],
      },
      {
        heading: 'General',
        paragraphs: [
          '12. These heads of terms are subject to contract and are not intended to be legally binding. A formal settlement agreement will be drafted by the employer\'s legal advisers and provided to the employee for review by their independent legal adviser.',
          '13. The employee acknowledges that they have not issued any proceedings in an employment tribunal or court in connection with their employment or its termination, and agree not to do so in respect of any claim waived under the settlement agreement.',
          '14. The settlement agreement will be governed by the laws of England and Wales and subject to the exclusive jurisdiction of the courts of England and Wales.',
          'Signed for and on behalf of the employer:',
          'Name: _____________________________ Signature: _____________________________ Date: ______________',
          'Signed by the employee:',
          'Name: _____________________________ Signature: _____________________________ Date: ______________',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'redundancy-at-risk',
    name: 'Redundancy At Risk Letter',
    category: 'General',
    description: 'Formal letter placing an employee at risk of redundancy, setting out the business reason, the pool of affected employees, the selection criteria, the consultation process, and the right to be accompanied.',
    filename: 'redundancy-at-risk.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Reason for redundancy',
      'Pool description',
      'Selection criteria',
      'Consultation meeting date',
      'Right to be accompanied',
      'Alternative employment note',
    ],
    sections: [
      {
        heading: 'Redundancy At Risk Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Notification of Risk of Redundancy',
        paragraphs: [
          'I regret to inform you that, due to circumstances affecting the organisation, your role has been identified as being at risk of redundancy. I understand that this will be a concerning and unsettling time for you, and I want to assure you that the organisation will handle this process fairly, transparently, and in full compliance with its legal obligations.',
          'This letter is intended to notify you of the situation and to explain the process that will be followed. No decision has been made at this stage and this letter does not confirm that your role will be made redundant.',
        ],
      },
      {
        heading: 'Reason for Proposed Redundancy',
        paragraphs: [
          'The reason for the proposed redundancy is as follows:',
          '[INSERT: Reason for redundancy]',
          'Under section 139 of the Employment Rights Act 1996, a redundancy situation arises where the employer has ceased or intends to cease carrying on the business, where the business has moved or intends to move to a different location, or where the requirements of the business for employees to carry out work of a particular kind have ceased or diminished or are expected to do so.',
        ],
      },
      {
        heading: 'Selection Pool and Criteria',
        paragraphs: [
          'The following pool of employees has been identified as being at risk:',
          '[INSERT: Pool description]',
          'Where the number of employees at risk exceeds the number of redundancies proposed, a selection process will be applied. The selection criteria that will be used are:',
          '[INSERT: Selection criteria]',
          'The selection criteria have been chosen to be objective, fair, and non-discriminatory. The criteria will be applied consistently to all employees within the pool.',
        ],
      },
      {
        heading: 'Consultation Process',
        paragraphs: [
          'The organisation is committed to meaningful consultation with affected employees. An individual consultation meeting has been arranged as follows:',
          'Consultation Meeting Date: [INSERT: Consultation meeting date]',
          '[INSERT: Right to be accompanied]',
          'You have the right to be accompanied at consultation meetings by a trade union representative or a work colleague. During consultation, you will have the opportunity to ask questions, make suggestions for avoiding or reducing redundancies, and discuss any alternative proposals.',
          'The organisation has a duty to consider all reasonable alternatives to redundancy, and your input during the consultation process is valued and important.',
        ],
      },
      {
        heading: 'Alternative Employment',
        paragraphs: [
          '[INSERT: Alternative employment note]',
          'The organisation will make every reasonable effort to identify suitable alternative employment for employees who are selected for redundancy. If a suitable alternative role is identified, you will be offered a trial period of not less than four weeks in accordance with section 138 of the Employment Rights Act 1996.',
          'You are also encouraged to check the organisation\'s internal vacancy listings and to apply for any roles that you consider to be suitable.',
          'If you become aware of any vacancies within the organisation that may be suitable, please raise this with your manager or HR.',
        ],
      },
      {
        heading: 'Support',
        paragraphs: [
          'The organisation recognises that this is a difficult time. You are reminded of the Employee Assistance Programme, which provides confidential counselling and support. The organisation may also be able to provide support with job searching, CV preparation, and interview skills during the consultation period.',
          'If you have any questions about the information in this letter or the process that will be followed, please do not hesitate to contact HR.',
          'Yours sincerely,',
          'Authorised Signatory',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'redundancy-confirmation',
    name: 'Redundancy Selection Confirmation Letter',
    category: 'General',
    description: 'Formal letter confirming the employee\'s selection for redundancy, setting out the redundancy payment calculation, notice period, last working day, and right of appeal.',
    filename: 'redundancy-confirmation.docx',
    fields: [
      'Employee name',
      'Employee address',
      'Date',
      'Selection outcome',
      'Redundancy payment calculation',
      'Notice period',
      'Last working day',
      'Holiday pay',
      'Right of appeal',
      'Appeal deadline',
    ],
    sections: [
      {
        heading: 'Redundancy Selection Confirmation Letter',
        paragraphs: [
          '[INSERT: Date]',
          '[INSERT: Employee name]',
          '[INSERT: Employee address]',
          'Dear [INSERT: Employee name],',
        ],
      },
      {
        heading: 'Confirmation of Redundancy',
        paragraphs: [
          'Following the consultation process that has taken place over recent weeks, I am writing to confirm, with regret, that your role has been selected for redundancy. This decision has been reached after careful consideration of all of the information discussed during consultation, including any representations and alternative proposals you put forward.',
          '[INSERT: Selection outcome]',
          'I appreciate that this is very disappointing news and I want to assure you that this decision has not been taken lightly. The organisation has explored all reasonable alternatives to redundancy, including redeployment to suitable alternative roles, and has been unable to identify a viable alternative in your case.',
        ],
      },
      {
        heading: 'Redundancy Payment',
        paragraphs: [
          'You are entitled to a statutory redundancy payment, calculated in accordance with sections 135 and 162 of the Employment Rights Act 1996. Your redundancy payment has been calculated as follows:',
          '[INSERT: Redundancy payment calculation]',
          'The statutory redundancy payment is calculated based on your age, length of continuous service, and weekly pay (subject to the statutory cap). The organisation may also make an enhanced redundancy payment in accordance with its redundancy policy, where applicable.',
          'Statutory redundancy pay is currently exempt from income tax up to GBP 30,000.',
        ],
      },
      {
        heading: 'Notice Period and Termination',
        paragraphs: [
          'Your contractual notice period is [INSERT: Notice period]. Your last working day will be [INSERT: Last working day].',
          'During your notice period, you will be entitled to reasonable time off to look for new employment or to make arrangements for training, in accordance with section 52 of the Employment Rights Act 1996.',
          'You will receive payment for any accrued but untaken annual leave: [INSERT: Holiday pay].',
          'Your final pay, including any outstanding salary, notice pay, holiday pay, and redundancy payment, will be processed and paid on the next available payroll date following your termination.',
          'Your P45 will be issued to you following your last day of employment. You are required to return all organisation property on or before your last working day.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          '[INSERT: Right of appeal]',
          'You have the right to appeal against the decision to select you for redundancy. If you wish to appeal, you must set out your grounds of appeal in writing and submit them within [INSERT: Appeal deadline] of receiving this letter.',
          'Your appeal should state clearly the grounds on which you are appealing. These may include that the selection criteria were unfairly applied, that the consultation process was inadequate, that suitable alternative employment was available but not offered, or that the decision was reached on discriminatory grounds.',
          'The appeal will be heard by a senior manager who has not been involved in the selection process. You will have the right to be accompanied at the appeal hearing by a trade union representative or a work colleague.',
        ],
      },
      {
        heading: 'Support',
        paragraphs: [
          'The organisation will continue to support you during the remainder of your notice period. You are reminded of the Employee Assistance Programme, which is available to you until your last day of service.',
          'If you have any questions about the information in this letter, your redundancy payment, or any other aspect of the process, please contact HR.',
          'I would like to take this opportunity to thank you for your service and contribution to the organisation, and to wish you well for the future.',
          'Yours sincerely,',
          'Authorised Signatory',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'file-note',
    name: 'File Note / Contemporaneous Record',
    category: 'General',
    description: 'Simple structured template for recording conversations, observations, or decisions as a contemporaneous file note for the employee\'s personnel record.',
    filename: 'file-note.docx',
    fields: [
      'Author name',
      'Date',
      'Time',
      'Persons present',
      'Location',
      'Subject',
      'Summary of discussion',
      'Actions agreed',
      'Signed by',
    ],
    sections: [
      {
        heading: 'File Note - Contemporaneous Record',
        paragraphs: [
          'This file note is a contemporaneous record of a conversation, observation, or decision. It should be completed as soon as possible after the event to which it relates, while the details are fresh in the author\'s memory. The note should be factual, objective, and free from opinion or speculation.',
          'File notes form part of the employee\'s personnel record and may be referred to in any future management action, including disciplinary, grievance, capability, or other formal proceedings.',
        ],
      },
      {
        heading: 'Details',
        paragraphs: [
          'Author: [INSERT: Author name]',
          'Date: [INSERT: Date]',
          'Time: [INSERT: Time]',
          'Location: [INSERT: Location]',
          'Persons Present: [INSERT: Persons present]',
        ],
      },
      {
        heading: 'Subject',
        paragraphs: [
          '[INSERT: Subject]',
        ],
      },
      {
        heading: 'Summary of Discussion or Observation',
        paragraphs: [
          'The following is a summary of the discussion, observation, or decision that took place:',
          '[INSERT: Summary of discussion]',
          'This note is intended to be a fair and accurate record of the matters described above. Where the note records a conversation, it reflects the substance of what was said rather than a verbatim transcript, unless direct quotations are indicated.',
        ],
      },
      {
        heading: 'Actions Agreed',
        paragraphs: [
          'The following actions were agreed or identified as a result of this discussion or observation:',
          '[INSERT: Actions agreed]',
          'Where actions have been assigned to specific individuals, this should be recorded above along with any agreed timescales for completion.',
        ],
      },
      {
        heading: 'Signature',
        paragraphs: [
          'Signed: [INSERT: Signed by]',
          'Date: ______________',
          'This file note should be stored securely on the relevant personnel file in accordance with the organisation\'s data protection policy and retained in accordance with the data retention schedule. Access should be restricted to those with a legitimate need to see it.',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },

  // ============================================================
  // NEW TEMPLATES (5)
  // ============================================================
  {
    id: 'suspension-notification',
    name: 'Suspension Notification',
    category: 'Disciplinary',
    description: 'Formal letter notifying an employee of their suspension from work on full pay pending investigation. Sets out the terms of suspension, review arrangements, and available support.',
    filename: 'suspension-notification.docx',
    fields: [
      'employeeName',
      'jobTitle',
      'suspensionDate',
      'matterDescription',
      'reviewFrequency',
      'eapProvider',
      'eapNumber',
      'managerName',
      'managerTitle',
      'orgName',
      'managerContact',
    ],
    sections: [
      {
        heading: 'Introduction',
        paragraphs: [
          'Dear [INSERT: employeeName],',
          'I am writing to confirm that you are being suspended from your duties with effect from [INSERT: suspensionDate]. This suspension is a neutral act and does not imply that any decision has been made regarding disciplinary action. Suspension is not a disciplinary sanction.',
          'The reason for your suspension is to allow the organisation to carry out an investigation into the following matter:',
          '[INSERT: matterDescription]',
          'This decision has been taken because it is considered necessary to preserve the integrity of the investigation and to protect the interests of all parties involved.',
        ],
      },
      {
        heading: 'Terms of Suspension',
        paragraphs: [
          'During the period of your suspension, the following terms apply:',
          '1. You will continue to receive your full pay and contractual benefits throughout the suspension period.',
          '2. You must not attend the workplace unless specifically requested to do so by management.',
          '3. You must not contact colleagues, clients, or other individuals connected with the matter under investigation, except through your trade union representative or companion.',
          '4. You must remain available during your normal working hours and be contactable should the organisation need to reach you in connection with the investigation.',
          '5. You must not access the organisation\'s IT systems, email, or other resources unless specifically authorised to do so.',
        ],
      },
      {
        heading: 'Review',
        paragraphs: [
          'The organisation recognises that suspension should be kept as brief as possible. Your suspension will be reviewed at intervals of [INSERT: reviewFrequency] to determine whether it remains necessary. You will be kept informed of the progress of the investigation and the likely timescales involved.',
          'If at any point during the investigation it is determined that suspension is no longer necessary, you will be notified and arrangements will be made for your return to work.',
        ],
      },
      {
        heading: 'Support',
        paragraphs: [
          'The organisation understands that suspension can be a difficult and stressful experience. You are encouraged to make use of the Employee Assistance Programme provided by [INSERT: eapProvider], which can be contacted on [INSERT: eapNumber]. This service is confidential and available to you at no cost.',
          'If you have any questions about the suspension or the investigation process, please contact [INSERT: managerName] ([INSERT: managerTitle]) at [INSERT: managerContact].',
          'Yours sincerely,',
          '[INSERT: managerName]',
          '[INSERT: managerTitle]',
          '[INSERT: orgName]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'appeal-hearing-invite',
    name: 'Appeal Hearing Invitation',
    category: 'Disciplinary',
    description: 'Formal letter inviting an employee to an appeal hearing following a disciplinary or other formal decision, setting out the grounds of appeal, hearing arrangements, and possible outcomes.',
    filename: 'appeal-hearing-invitation.docx',
    fields: [
      'employeeName',
      'originalDecision',
      'appealDate',
      'appealGroundsDate',
      'hearingDate',
      'hearingTime',
      'hearingLocation',
      'appealChairName',
      'appealChairTitle',
      'appealGroundsSummary',
      'companionNotice',
      'documentDeadline',
      'orgName',
    ],
    sections: [
      {
        heading: 'Introduction',
        paragraphs: [
          'Dear [INSERT: employeeName],',
          'I am writing to confirm that your appeal against the decision of [INSERT: originalDecision], which was communicated to you on [INSERT: appealDate], has been received. Your grounds of appeal were submitted on [INSERT: appealGroundsDate] and an appeal hearing has been arranged.',
          'The hearing will take place as follows:',
          'Date: [INSERT: hearingDate]',
          'Time: [INSERT: hearingTime]',
          'Location: [INSERT: hearingLocation]',
          'Appeal Chair: [INSERT: appealChairName] ([INSERT: appealChairTitle])',
        ],
      },
      {
        heading: 'Your Grounds of Appeal',
        paragraphs: [
          'The grounds of appeal as set out in your written submission are summarised as follows:',
          '[INSERT: appealGroundsSummary]',
          'At the hearing, you will be given a full opportunity to explain your grounds of appeal and to present any supporting evidence or arguments.',
        ],
      },
      {
        heading: 'The Hearing',
        paragraphs: [
          'The appeal hearing will be conducted by [INSERT: appealChairName], who has had no prior involvement in the original decision. The hearing will consider your grounds of appeal and review the evidence and process from the original proceedings.',
          'You may present new evidence at the appeal hearing if it is relevant to your grounds of appeal. Please provide any new documentary evidence in advance (see below).',
        ],
      },
      {
        heading: 'Right to Be Accompanied',
        paragraphs: [
          'In accordance with section 10 of the Employment Relations Act 1999, you have the statutory right to be accompanied at this hearing by a trade union representative or a work colleague of your choice. Your companion may address the hearing, put your case, and confer with you during proceedings, but may not answer questions on your behalf.',
          '[INSERT: companionNotice]',
        ],
      },
      {
        heading: 'Additional Evidence',
        paragraphs: [
          'If you wish to submit any additional documents or written evidence in support of your appeal, these must be provided to the appeal chair by [INSERT: documentDeadline] so that they can be reviewed in advance of the hearing.',
        ],
      },
      {
        heading: 'Possible Outcomes',
        paragraphs: [
          'The possible outcomes of the appeal hearing are as follows: the original decision may be upheld; the original decision may be overturned in whole or in part; or a different sanction may be substituted.',
          'The decision of the appeal panel will be final and there is no further right of internal appeal.',
        ],
      },
      {
        heading: 'Inability to Attend',
        paragraphs: [
          'If you are unable to attend the hearing on the date specified, you must notify us as soon as possible. You may propose one alternative date, which must fall within five working days of the original hearing date. If you fail to attend without providing a reasonable explanation, the appeal may be determined in your absence based on the written submissions.',
          'Yours sincerely,',
          '[INSERT: appealChairName]',
          '[INSERT: appealChairTitle]',
          '[INSERT: orgName]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'probation-review',
    name: 'Probation Review Meeting',
    category: 'General HR',
    description: 'Letter inviting an employee to a probation review meeting, setting out the areas for discussion, possible outcomes, and relevant information about the revised qualifying period for unfair dismissal.',
    filename: 'probation-review-meeting.docx',
    fields: [
      'employeeName',
      'reviewStage',
      'meetingDate',
      'meetingTime',
      'meetingLocation',
      'managerName',
      'managerTitle',
      'orgName',
    ],
    sections: [
      {
        heading: 'Introduction',
        paragraphs: [
          'Dear [INSERT: employeeName],',
          'I am writing to invite you to a [INSERT: reviewStage] probation review meeting. This meeting is part of the organisation\'s standard probationary process and is intended to review your progress, performance, and suitability for the role.',
          'The meeting has been arranged as follows:',
          'Date: [INSERT: meetingDate]',
          'Time: [INSERT: meetingTime]',
          'Location: [INSERT: meetingLocation]',
        ],
      },
      {
        heading: 'Discussion Areas',
        paragraphs: [
          'The following areas will be discussed at the meeting:',
          '1. Your overall performance against the objectives and expectations set out at the start of your employment or at the previous review.',
          '2. Your attendance, timekeeping, and reliability during the probationary period.',
          '3. Your conduct and how you have integrated with the team and the organisation.',
          '4. Any training or development needs that have been identified.',
          '5. Any concerns you may have about your role, working environment, or the support available to you.',
        ],
      },
      {
        heading: 'Possible Outcomes',
        paragraphs: [
          'The possible outcomes of this review meeting are as follows:',
          '1. Confirmation of your appointment and successful completion of the probationary period.',
          '2. Extension of the probationary period for a further specified duration, with clear objectives for the extended period.',
          '3. Identification of additional support, training, or adjustments to assist you in meeting the required standards.',
          '4. In cases where performance, conduct, or attendance has been significantly below the required standard, termination of employment during or at the end of the probationary period, with the appropriate notice as set out in your contract of employment.',
        ],
      },
      {
        heading: 'January 2027 Note',
        paragraphs: [
          'From 1 January 2027, the qualifying period for unfair dismissal protection reduces to six months of continuous service. If you have completed six or more months of continuous service at the date of any decision to terminate your employment, full unfair dismissal rights will apply. The organisation will ensure that any decision is fair, reasonable, and procedurally sound regardless of length of service.',
          'Yours sincerely,',
          '[INSERT: managerName]',
          '[INSERT: managerTitle]',
          '[INSERT: orgName]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'flexible-working-response',
    name: 'Flexible Working Request Response',
    category: 'General HR',
    description: 'Formal response to a statutory flexible working request, covering approval, partial approval, or refusal with statutory grounds, and the right of appeal.',
    filename: 'flexible-working-response.docx',
    fields: [
      'employeeName',
      'requestDate',
      'requestSummary',
      'proposedStartDate',
      'decisionOption',
      'newPattern',
      'newHours',
      'otherChanges',
      'trialPeriod',
      'alternativeDetails',
      'refusalGrounds',
      'refusalReasons',
      'appealRecipient',
      'appealDeadline',
      'managerName',
      'managerTitle',
      'orgName',
    ],
    sections: [
      {
        heading: 'Your Request',
        paragraphs: [
          'Dear [INSERT: employeeName],',
          'Thank you for your flexible working request submitted on [INSERT: requestDate]. Your request has been considered in accordance with the organisation\'s Flexible Working Policy and the statutory framework set out in Part 8A of the Employment Rights Act 1996, as amended by the Employment Relations (Flexible Working) Act 2023.',
          'You requested the following change to your working arrangements:',
          '[INSERT: requestSummary]',
          'You proposed that this change take effect from [INSERT: proposedStartDate].',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          '[INSERT: decisionOption]',
          'If your request has been approved: Your flexible working request has been approved. Your new working arrangements will be as follows: Working Pattern: [INSERT: newPattern]. Hours: [INSERT: newHours]. Other Changes: [INSERT: otherChanges]. These changes will take effect from [INSERT: proposedStartDate]. Please note that this is a permanent change to your terms and conditions of employment unless otherwise agreed. A trial period of [INSERT: trialPeriod] may apply, during which the new arrangements will be reviewed.',
          'If your request has been partially approved: Your request has been approved in part. The organisation is able to offer the following alternative arrangement: [INSERT: alternativeDetails]. If you wish to accept this alternative, please confirm in writing. If you do not wish to accept the alternative, your current working arrangements will remain unchanged.',
          'If your request has been refused: After careful consideration, the organisation is unable to approve your request. The statutory ground or grounds for refusal are as follows: [INSERT: refusalGrounds]. The specific reasons are: [INSERT: refusalReasons]. The eight statutory grounds on which an employer may refuse a flexible working request are: (1) the burden of additional costs, (2) detrimental effect on ability to meet customer demand, (3) inability to reorganise work among existing staff, (4) inability to recruit additional staff, (5) detrimental impact on quality, (6) detrimental impact on performance, (7) insufficiency of work during the periods the employee proposes to work, and (8) planned structural changes.',
        ],
      },
      {
        heading: 'Right of Appeal',
        paragraphs: [
          'If your request has been refused or only partially approved, you have the right to appeal against this decision. If you wish to appeal, please submit your grounds of appeal in writing to [INSERT: appealRecipient] by [INSERT: appealDeadline].',
          'Your appeal will be heard by a manager who was not involved in the original decision.',
          'Yours sincerely,',
          '[INSERT: managerName]',
          '[INSERT: managerTitle]',
          '[INSERT: orgName]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
  {
    id: 'right-to-work-followup',
    name: 'Right to Work Follow-Up',
    category: 'General HR',
    description: 'Letter to an employee whose right to work documentation is approaching expiry, requesting updated evidence and explaining the consequences of failing to provide it.',
    filename: 'right-to-work-followup.docx',
    fields: [
      'employeeName',
      'expiryDate',
      'deadlineDate',
      'managerName',
      'managerTitle',
      'orgName',
      'managerContact',
    ],
    sections: [
      {
        heading: 'Introduction',
        paragraphs: [
          'Dear [INSERT: employeeName],',
          'Our records indicate that your current right to work documentation is due to expire on [INSERT: expiryDate]. Under the Immigration, Asylum and Nationality Act 2006, the organisation is required to verify that all employees have an ongoing right to work in the United Kingdom. Failure to hold a valid right to work document may mean the organisation loses its statutory excuse against a civil penalty.',
          'Please provide updated right to work evidence by [INSERT: deadlineDate]. If you are unable to provide documentation by this date, please contact [INSERT: managerName] at [INSERT: managerContact] as soon as possible so that we can discuss your circumstances.',
        ],
      },
      {
        heading: 'Acceptable Documents',
        paragraphs: [
          'The following types of document are acceptable as evidence of your right to work:',
          '1. A current passport showing that you are a British citizen or have an indefinite right to remain in the United Kingdom.',
          '2. A current Biometric Residence Permit issued by the Home Office confirming your right to work.',
          '3. A valid share code obtained from the Home Office online right to work checking service, which your employer can verify online.',
          '4. A current Certificate of Application or Positive Verification Letter issued by the Home Office in connection with an outstanding immigration application.',
        ],
      },
      {
        heading: 'Pending Applications',
        paragraphs: [
          'If you have submitted an application to the Home Office to extend or vary your leave to remain, and that application was made before your current leave expired, you may have a statutory right to continue working under section 3C of the Immigration Act 1971. In this case, please provide evidence of the pending application, such as a Home Office acknowledgement letter or proof of postage, together with a copy of the application form.',
          'The organisation will use the Home Office Employer Checking Service to verify your right to work where a share code or physical document is not available.',
        ],
      },
      {
        heading: 'Reassurance',
        paragraphs: [
          'This letter is sent as a routine administrative step to ensure that the organisation remains compliant with its legal obligations. It does not reflect any concern about your employment status or performance.',
          'If you have any questions or require assistance in obtaining the relevant documentation, please do not hesitate to contact [INSERT: managerName] at [INSERT: managerContact].',
          'Yours sincerely,',
          '[INSERT: managerName]',
          '[INSERT: managerTitle]',
          '[INSERT: orgName]',
          'Document generated by SIT-HR - Review before use - Not legal advice',
        ],
      },
    ],
  },
];

export function getTemplateById(id: string): DocumentTemplate | undefined {
  return DOCUMENT_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): DocumentTemplate[] {
  return DOCUMENT_TEMPLATES.filter(t => t.category === category);
}
