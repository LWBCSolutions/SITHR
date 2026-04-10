import { Link } from 'react-router-dom';
import PageFooter from './PageFooter';

const LEGAL_FOOTER = 'LWBC Solutions Ltd - Company No. 16771338 - 3rd Floor, 86-90 Paul Street, London, England, EC2A 4NE';

interface LegalPageProps {
  page: 'privacy' | 'terms' | 'acceptable-use';
}

export default function LegalPage({ page }: LegalPageProps) {
  return (
    <div className="legal-page">
      <Link to="/" className="legal-back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="14" y1="8" x2="2" y2="8" />
          <polyline points="8,2 2,8 8,14" />
        </svg>
        Back to SIT-HR
      </Link>
      <div className="legal-content">
        {page === 'privacy' && <PrivacyContent />}
        {page === 'terms' && <TermsContent />}
        {page === 'acceptable-use' && <AcceptableUseContent />}
      </div>
      <div className="legal-footer">{LEGAL_FOOTER}</div>
      <PageFooter />
    </div>
  );
}

function PrivacyContent() {
  return (
    <>
      <h1>SIT-HR Privacy Notice</h1>
      <p><em>Version 2.0 - April 2026</em></p>

      <h2>1. Who We Are</h2>
      <p>
        SIT-HR is operated by LWBC Solutions Ltd (Company No. 16771338), registered at
        3rd Floor, 86-90 Paul Street, London, England, EC2A 4NE.
      </p>
      <p>
        For the purposes of UK data protection law, LWBC Solutions Ltd is the data controller
        for personal data processed through the SIT-HR platform.
      </p>
      <p>
        Contact: <strong>solutions@lwbc.ltd</strong>
      </p>

      <h2>2. What Data We Collect</h2>

      <h3>Account Data</h3>
      <p>
        When you create an account, we collect your email address and a hashed password.
        This is the minimum information required to provide you with a secure, personalised service.
      </p>
      <p><em>Legal basis: contract performance.</em></p>

      <h3>Conversation Data</h3>
      <p>
        We store the queries you submit and the system-generated responses. Conversations are
        linked to your account so you can access your history. Conversations are retained for
        30 days and then permanently deleted.
      </p>
      <p><em>Legal basis: contract performance.</em></p>

      <h3>Usage Data</h3>
      <p>
        We record token counts, model identifier, estimated cost, and timestamp for each
        interaction. This data contains no conversation content.
      </p>
      <p><em>Legal basis: legitimate interests (service monitoring and cost management).</em></p>

      <h3>Audit Log</h3>
      <p>
        We log login events, exports, and policy uploads together with a timestamp and IP
        address. This supports security monitoring and accountability.
      </p>
      <p><em>Legal basis: legitimate interests (security and compliance).</em></p>

      <h3>Policy Documents</h3>
      <p>
        Policy documents you upload are processed in-session only to provide contextual
        guidance. They are not stored and are discarded when the session ends.
      </p>

      <h2>3. Anonymised Content Review</h2>
      <p>
        We may review anonymised metadata to improve the service. This metadata includes
        situation type, risk rating, policy gap flag, and export flag only. It contains
        no conversation content and no personal identifiers.
      </p>
      <p><em>Legal basis: legitimate interests (service improvement).</em></p>

      <h2>4. Data Retention</h2>
      <table className="legal-table">
        <thead>
          <tr>
            <th>Data Type</th>
            <th>Retention Period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Conversations</td>
            <td>30 days, then hard deleted</td>
          </tr>
          <tr>
            <td>Account data</td>
            <td>Account duration + 12 months</td>
          </tr>
          <tr>
            <td>Usage logs</td>
            <td>12 months</td>
          </tr>
          <tr>
            <td>Audit log</td>
            <td>12 months</td>
          </tr>
          <tr>
            <td>Technical logs</td>
            <td>90 days</td>
          </tr>
          <tr>
            <td>Policy documents</td>
            <td>Session only</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Third-Party Processors</h2>
      <ul>
        <li><strong>Supabase</strong> - database and authentication hosting (EU West region). Data is encrypted at rest and in transit.</li>
        <li><strong>Anthropic</strong> - language model provider. Processing is governed by a Data Processing Agreement. Anthropic does not use API data for model training.</li>
        <li><strong>Resend</strong> - transactional email delivery.</li>
      </ul>

      <h2>6. Your Rights</h2>
      <p>Under UK GDPR, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Rectify inaccurate personal data</li>
        <li>Erase your personal data (right to be forgotten)</li>
        <li>Restrict processing of your personal data</li>
        <li>Data portability - receive your data in a structured format</li>
        <li>Object to processing of your personal data</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at <strong>solutions@lwbc.ltd</strong>.
      </p>
      <p>
        If you are not satisfied with our response, you have the right to lodge a complaint
        with the Information Commissioner's Office (ICO).
      </p>

      <h2>7. Cookies</h2>
      <p>
        SIT-HR uses essential session cookies only for authentication and session management.
        We do not use tracking cookies, analytics cookies, or third-party advertising cookies.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this privacy notice or how we handle your data, contact us at:
      </p>
      <p>
        Email: solutions@lwbc.ltd<br />
        LWBC Solutions Ltd<br />
        3rd Floor, 86-90 Paul Street<br />
        London, England, EC2A 4NE
      </p>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <h1>SIT-HR Terms of Use</h1>
      <p><em>Version 2.0 - April 2026</em></p>

      <h2>1. About These Terms</h2>
      <p>
        These terms govern your use of SIT-HR, a system-generated employment law guidance
        tool operated by LWBC Solutions Ltd (Company No. 16771338). By creating an account
        or using the service, you agree to these terms. Version 2.0, effective April 2026.
      </p>

      <h2>2. What SIT-HR Is</h2>
      <p>
        SIT-HR is a management support tool that provides system-generated guidance on
        employment law and workplace management. It is designed to help managers and HR
        professionals think through workplace issues, understand relevant legislation, and
        draft supporting documents.
      </p>
      <p>
        All system-generated outputs require professional review before any action is taken.
      </p>

      <h2>3. What SIT-HR Is Not</h2>
      <ul>
        <li>SIT-HR does not provide legal advice.</li>
        <li>SIT-HR is not a regulated legal service.</li>
        <li>SIT-HR is not a clinical or counselling tool.</li>
        <li>SIT-HR does not guarantee the accuracy, completeness, or currency of any output.</li>
      </ul>
      <p>
        You must not rely on SIT-HR output as your sole basis for making employment decisions.
        The guidance system may produce errors, omissions, or outdated information. Always
        seek qualified professional advice for complex or high-risk matters.
      </p>

      <h2>4. Data Retention - 30-Day Limit</h2>
      <div className="legal-notice-box">
        <p>
          <strong>All conversations are hard deleted after 30 days.</strong> This deletion is
          permanent and irreversible. There is no recovery mechanism. It is your responsibility
          to export any guidance you wish to retain before the 30-day period expires. Use the
          export pack feature to save important conversations to your own records.
        </p>
      </div>

      <h2>5. Usage Logging</h2>
      <p>
        Each interaction generates a usage log entry containing token counts, model identifier,
        estimated cost, and timestamp. These logs contain no conversation content. Usage logs
        are retained for 12 months.
      </p>

      <h2>6. Anonymised Content Review</h2>
      <p>
        We may review anonymised metadata to improve the service. This includes situation type,
        risk rating, policy gap flag, and export flag only. It contains no conversation content
        and no personal identifiers.
      </p>

      <h2>7. Policy Document Upload</h2>
      <p>
        You may upload workplace policy documents to provide context for guidance. By uploading
        a document, you warrant that you have the authority to share it and that it does not
        contain personally identifiable information.
      </p>
      <p>
        Policy documents are processed in-session only and are not stored. They are discarded
        when the session ends. Any observations the guidance system makes about uploaded
        policies are indicative only and do not constitute a formal policy review.
      </p>

      <h2>8. Export Pack</h2>
      <p>
        The export pack feature generates a structured summary of the current conversation.
        Export packs are system-generated and require professional review before use. Any
        fields marked INSERT must be completed by the user before the document is actioned.
      </p>

      <h2>9. Acceptable Use</h2>
      <ul>
        <li>Do not enter personal identifiers (names, NI numbers, dates of birth, addresses) into SIT-HR.</li>
        <li>Do not use SIT-HR for any discriminatory purpose or to target any protected characteristic.</li>
        <li>Do not share your account credentials with other individuals.</li>
      </ul>
      <p>
        A full acceptable use policy is available separately. Breach of these rules may result
        in account suspension or termination.
      </p>

      <h2>10. Rate Limiting</h2>
      <p>
        Usage limits apply to all accounts. These limits may vary and are subject to change
        without notice. No service level agreement (SLA) is provided. We do not guarantee
        uninterrupted access to the service.
      </p>

      <h2>11. Session Timeout</h2>
      <p>
        Sessions will automatically time out after 4 hours of inactivity. You will need to
        log in again to continue using the service. Unsaved work may be lost on timeout.
      </p>

      <h2>12. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, LWBC Solutions Ltd excludes all liability for
        any direct, indirect, incidental, special, or consequential damages arising from your
        use of SIT-HR. This includes, without limitation, any losses arising from employment
        decisions made based on system-generated guidance.
      </p>
      <p>
        SIT-HR is provided "as is" without warranties of any kind, whether express or implied,
        including but not limited to implied warranties of merchantability, fitness for a
        particular purpose, or accuracy.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These terms are governed by and construed in accordance with the laws of England and
        Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of
        England and Wales.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. We will notify registered users of material
        changes by email or through the platform. Continued use of the service after changes
        constitutes acceptance of the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about these terms, contact us at:
      </p>
      <p>
        Email: solutions@lwbc.ltd<br />
        LWBC Solutions Ltd<br />
        3rd Floor, 86-90 Paul Street<br />
        London, England, EC2A 4NE
      </p>
    </>
  );
}

function AcceptableUseContent() {
  return (
    <>
      <h1>SIT-HR Acceptable Use Policy</h1>
      <p><em>Version 2.0 - April 2026</em></p>

      <h2>Purpose</h2>
      <p>
        This policy sets out the rules for using SIT-HR responsibly. SIT-HR is designed to
        support managers and HR professionals with system-generated guidance on workplace
        issues. This policy exists to protect employees, your organisation, and the integrity
        of the service.
      </p>

      <h2>The Golden Rule</h2>
      <p>
        <strong>Do not enter personally identifiable information into SIT-HR.</strong> This
        means no real names, no initials, no NI numbers, no dates of birth, no addresses, and
        no medical details. Use anonymous case reference numbers instead. This protects
        employee privacy, ensures compliance with data protection law, and means conversations
        can be safely retained and deleted without risk.
      </p>

      <h2>What You Must Not Enter</h2>
      <ul>
        <li>Real employee names or initials</li>
        <li>National Insurance numbers</li>
        <li>Dates of birth</li>
        <li>Home addresses or contact details</li>
        <li>Medical information or health conditions</li>
        <li>Any information that could identify a specific individual</li>
        <li>Confidential business information unrelated to the HR query</li>
      </ul>

      <h2>What SIT-HR Is For</h2>
      <ul>
        <li>Getting guidance on HR procedures and best practice</li>
        <li>Understanding employment law principles</li>
        <li>Drafting template letters, policies, and documents</li>
        <li>Thinking through workplace scenarios and options</li>
        <li>Preparing for difficult conversations</li>
        <li>Understanding ACAS codes of practice</li>
      </ul>

      <h2>What SIT-HR Is Not For</h2>
      <ul>
        <li>Making final employment decisions without human review</li>
        <li>Replacing qualified legal advice on complex matters</li>
        <li>Processing employee grievances or disciplinary cases autonomously</li>
        <li>Storing employee records or personal files</li>
        <li>Any purpose unrelated to workplace management</li>
      </ul>

      <h2>Guidance System Limitations</h2>
      <p>
        SIT-HR uses a language model to generate responses. The guidance system can make
        mistakes, produce outdated information, or misunderstand context. You must always
        review system-generated output critically and verify important points independently.
        Employment law is complex and fact-specific - what applies in one situation may not
        apply in another.
      </p>

      <h2>Policy Document Upload</h2>
      <p>
        When uploading workplace policy documents for contextual guidance, you must ensure:
      </p>
      <ul>
        <li>You have the authority to share the document</li>
        <li>The document does not contain personally identifiable information</li>
        <li>You understand the document is processed in-session only and not stored</li>
        <li>Any observations about the policy are indicative, not a formal review</li>
      </ul>

      <h2>Rate Limiting</h2>
      <p>
        Usage limits are in place to ensure fair access for all users. If you reach a rate
        limit, wait before submitting further queries. Do not attempt to circumvent rate
        limits through automated tools or multiple accounts.
      </p>

      <h2>Session Timeout</h2>
      <p>
        Your session will automatically end after 4 hours of inactivity. Save or export any
        important guidance before leaving the platform unattended for extended periods.
      </p>

      <h2>Account Security</h2>
      <p>
        Do not share your account credentials with anyone. You are responsible for all
        activity that occurs under your account. If you suspect unauthorised access, contact
        us immediately at solutions@lwbc.ltd.
      </p>

      <h2>Record Keeping</h2>
      <p>
        Conversations are retained for 30 days and then permanently deleted. SIT-HR should
        not be treated as an official HR records system. If you use system-generated guidance
        to inform a workplace decision, document your reasoning separately in your
        organisation's records. Use the export pack feature to capture relevant guidance
        before the 30-day retention period expires.
      </p>

      <h2>Reporting Concerns</h2>
      <p>
        If you believe the guidance system has generated inaccurate, harmful, or inappropriate
        content, please report it to us at solutions@lwbc.ltd. We take all reports seriously
        and will investigate promptly.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this policy, contact us at:
      </p>
      <p>
        Email: solutions@lwbc.ltd<br />
        LWBC Solutions Ltd<br />
        3rd Floor, 86-90 Paul Street<br />
        London, England, EC2A 4NE
      </p>
    </>
  );
}
