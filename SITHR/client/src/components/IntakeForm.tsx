import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IntakeData {
  caseRef: string;
  situationType: string;
  serviceLength: string;
  previousAction: string;
  policies: Array<{ filename: string; content: string }>;
  attachments: Array<{ filename: string; content: string; mimetype: string }>;
}

interface IntakeFormProps {
  onSubmit: (data: IntakeData) => void;
}

interface PolicyFile {
  filename: string;
  content: string;
  extracting: boolean;
  charCount: number | null;
}

interface AttachmentFile {
  filename: string;
  content: string;
  mimetype: string;
  extracting: boolean;
  charCount: number | null;
  previewUrl: string | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SITUATION_OPTIONS = [
  '',
  'Absence / Sickness',
  'Disciplinary / Conduct',
  'Grievance',
  'Capability / Performance',
  'Redundancy',
  'Settlement',
  'Contract / Terms',
  'General HR Query',
];

const SERVICE_LENGTH_OPTIONS = [
  '',
  'Under 6 months',
  '6-12 months',
  '1-2 years',
  '2-5 years',
  '5-10 years',
  'Over 10 years',
  'Not applicable',
];

const PREVIOUS_ACTION_OPTIONS = [
  '',
  'None - this is a new issue',
  'Informal conversation held',
  'First written warning issued',
  'Final written warning issued',
  'Suspension in place',
  'Grievance received',
  'Other',
];

const POLICY_ACCEPT = '.pdf,.docx';
const ATTACHMENT_ACCEPT = '.pdf,.docx,.jpg,.jpeg,.png,.txt';
const MAX_POLICIES = 3;
const MAX_ATTACHMENTS = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateCaseRef(): string {
  const year = new Date().getFullYear();
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `CASE-${year}-${digits}`;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function extractDocument(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const headers = await getAuthHeaders();
  const res = await fetch('/api/extract-document', {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Extraction failed: ${res.statusText}`);
  }
  const json = await res.json();
  return json.content ?? '';
}

function formatCharCount(count: number): string {
  return count.toLocaleString();
}

function fileTypeBadge(filename: string): string {
  const ext = filename.split('.').pop()?.toUpperCase() ?? '';
  return ext;
}

function isImageFile(mimetype: string): boolean {
  return mimetype.startsWith('image/');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function IntakeForm({ onSubmit }: IntakeFormProps) {
  // Field state
  const [caseRef, setCaseRef] = useState('');
  const [situationType, setSituationType] = useState('');
  const [serviceLength, setServiceLength] = useState('');
  const [previousAction, setPreviousAction] = useState('');
  const [policies, setPolicies] = useState<PolicyFile[]>([]);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [gdprTooltipVisible, setGdprTooltipVisible] = useState(false);

  // Refs for hidden file inputs
  const policyInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    situationType !== '' &&
    serviceLength !== '' &&
    previousAction !== '' &&
    !policies.some((p) => p.extracting) &&
    !attachments.some((a) => a.extracting);

  // ---------------------------
  // Policy upload
  // ---------------------------

  const handlePolicyUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_POLICIES - policies.length;
    const toProcess = Array.from(files).slice(0, remaining);

    for (const file of toProcess) {
      const entry: PolicyFile = {
        filename: file.name,
        content: '',
        extracting: true,
        charCount: null,
      };

      setPolicies((prev) => [...prev, entry]);

      extractDocument(file)
        .then((content) => {
          setPolicies((prev) =>
            prev.map((p) =>
              p.filename === file.name && p.extracting
                ? { ...p, content, extracting: false, charCount: content.length }
                : p,
            ),
          );
        })
        .catch(() => {
          setPolicies((prev) =>
            prev.map((p) =>
              p.filename === file.name && p.extracting
                ? { ...p, content: '', extracting: false, charCount: 0 }
                : p,
            ),
          );
        });
    }

    // Reset the input so the same file can be re-selected
    e.target.value = '';
  };

  const removePolicy = (filename: string) => {
    setPolicies((prev) => prev.filter((p) => p.filename !== filename));
  };

  // ---------------------------
  // Attachment upload
  // ---------------------------

  const handleAttachmentUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_ATTACHMENTS - attachments.length;
    const toProcess = Array.from(files).slice(0, remaining);

    for (const file of toProcess) {
      const previewUrl = isImageFile(file.type)
        ? URL.createObjectURL(file)
        : null;

      const entry: AttachmentFile = {
        filename: file.name,
        content: '',
        mimetype: file.type,
        extracting: true,
        charCount: null,
        previewUrl,
      };

      setAttachments((prev) => [...prev, entry]);

      extractDocument(file)
        .then((content) => {
          setAttachments((prev) =>
            prev.map((a) =>
              a.filename === file.name && a.extracting
                ? { ...a, content, extracting: false, charCount: content.length }
                : a,
            ),
          );
        })
        .catch(() => {
          setAttachments((prev) =>
            prev.map((a) =>
              a.filename === file.name && a.extracting
                ? { ...a, content: '', extracting: false, charCount: 0 }
                : a,
            ),
          );
        });
    }

    e.target.value = '';
  };

  const removeAttachment = (filename: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.filename === filename);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((a) => a.filename !== filename);
    });
  };

  // ---------------------------
  // Submit
  // ---------------------------

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const finalCaseRef = caseRef.trim() || generateCaseRef();

    onSubmit({
      caseRef: finalCaseRef,
      situationType,
      serviceLength,
      previousAction,
      policies: policies.map((p) => ({ filename: p.filename, content: p.content })),
      attachments: attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
        mimetype: a.mimetype,
      })),
    });
  };

  // ---------------------------
  // Animation helpers
  // ---------------------------

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' as const },
    }),
  };

  // ---------------------------
  // Render
  // ---------------------------

  return (
    <form className="intake-form" onSubmit={handleSubmit}>
      <motion.h2
        className="intake-form__title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        New Conversation
      </motion.h2>

      <motion.p
        className="intake-form__subtitle"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.3 }}
      >
        Provide some context so SIT-HR can give you the most relevant advice.
      </motion.p>

      {/* 1. Case Reference */}
      <motion.div
        className="intake-form__field"
        custom={0}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
      >
        <label className="intake-form__label" htmlFor="intake-case-ref">
          Case Reference
        </label>
        <input
          id="intake-case-ref"
          className="intake-form__input"
          type="text"
          placeholder="Leave blank to auto-generate (e.g. CASE-2026-001)"
          value={caseRef}
          onChange={(e) => setCaseRef(e.target.value)}
        />
        <p className="intake-form__help">
          Use a case reference instead of any employee name or identifier
        </p>
      </motion.div>

      {/* 2. Situation Type */}
      <motion.div
        className="intake-form__field"
        custom={1}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
      >
        <label className="intake-form__label" htmlFor="intake-situation">
          What type of situation is this?
        </label>
        <select
          id="intake-situation"
          className="intake-form__select"
          value={situationType}
          onChange={(e) => setSituationType(e.target.value)}
          required
        >
          {SITUATION_OPTIONS.map((opt) => (
            <option key={opt} value={opt} disabled={opt === ''}>
              {opt === '' ? 'Select a situation type' : opt}
            </option>
          ))}
        </select>
      </motion.div>

      {/* 3. Length of Service */}
      <motion.div
        className="intake-form__field"
        custom={2}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
      >
        <label className="intake-form__label" htmlFor="intake-service">
          Employee length of service
        </label>
        <select
          id="intake-service"
          className="intake-form__select"
          value={serviceLength}
          onChange={(e) => setServiceLength(e.target.value)}
          required
        >
          {SERVICE_LENGTH_OPTIONS.map((opt) => (
            <option key={opt} value={opt} disabled={opt === ''}>
              {opt === '' ? 'Select length of service' : opt}
            </option>
          ))}
        </select>
      </motion.div>

      {/* 4. Previous Action */}
      <motion.div
        className="intake-form__field"
        custom={3}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
      >
        <label className="intake-form__label" htmlFor="intake-action">
          What action has been taken so far?
        </label>
        <select
          id="intake-action"
          className="intake-form__select"
          value={previousAction}
          onChange={(e) => setPreviousAction(e.target.value)}
          required
        >
          {PREVIOUS_ACTION_OPTIONS.map((opt) => (
            <option key={opt} value={opt} disabled={opt === ''}>
              {opt === '' ? 'Select previous action' : opt}
            </option>
          ))}
        </select>
      </motion.div>

      {/* 5. Policy Upload */}
      <motion.div
        className="intake-form__field"
        custom={4}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
      >
        <label className="intake-form__label">
          Upload relevant policies (optional)
        </label>
        <p className="intake-form__help">
          Upload your sickness absence, disciplinary, grievance, or other relevant
          policy. PDF or DOCX only. Max 3 files.
        </p>

        <input
          ref={policyInputRef}
          type="file"
          accept={POLICY_ACCEPT}
          multiple
          style={{ display: 'none' }}
          onChange={handlePolicyUpload}
        />

        {policies.length < MAX_POLICIES && (
          <div
            className="intake-form__upload-zone"
            role="button"
            tabIndex={0}
            onClick={() => policyInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                policyInputRef.current?.click();
              }
            }}
          >
            Click to upload policy documents
          </div>
        )}

        {policies.length > 0 && (
          <ul className="intake-form__file-list">
            {policies.map((p) => (
              <li key={p.filename} className="intake-form__file-item">
                <span className="intake-form__file-badge">
                  {fileTypeBadge(p.filename)}
                </span>
                <span>{p.filename}</span>
                {p.extracting && <span className="intake-form__spinner" />}
                {p.charCount !== null && (
                  <span className="intake-form__char-count">
                    Extracted {formatCharCount(p.charCount)} characters
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${p.filename}`}
                  onClick={() => removePolicy(p.filename)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* 6. Supporting Documents */}
      <motion.div
        className="intake-form__field"
        custom={5}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
      >
        <label className="intake-form__label">
          Attach supporting documents (optional)
          <span
            className="intake-form__gdpr-note"
            style={{ position: 'relative', display: 'inline-block', marginLeft: 6 }}
            onMouseEnter={() => setGdprTooltipVisible(true)}
            onMouseLeave={() => setGdprTooltipVisible(false)}
            onFocus={() => setGdprTooltipVisible(true)}
            onBlur={() => setGdprTooltipVisible(false)}
            tabIndex={0}
            role="note"
            aria-label="GDPR information"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              style={{ verticalAlign: 'middle', cursor: 'pointer' }}
            >
              <circle cx="8" cy="8" r="7.5" stroke="#999" />
              <text
                x="8"
                y="12"
                textAnchor="middle"
                fontSize="11"
                fill="#999"
                fontFamily="DM Sans, sans-serif"
              >
                i
              </text>
            </svg>
            {gdprTooltipVisible && (
              <span
                role="tooltip"
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: 6,
                  padding: '8px 12px',
                  background: '#1C1C1E',
                  color: '#fff',
                  fontSize: 12,
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                Do not attach documents containing employee names or personal
                identifiers. Use case references only.
              </span>
            )}
          </span>
        </label>

        <input
          ref={attachmentInputRef}
          type="file"
          accept={ATTACHMENT_ACCEPT}
          multiple
          style={{ display: 'none' }}
          onChange={handleAttachmentUpload}
        />

        {attachments.length < MAX_ATTACHMENTS && (
          <div
            className="intake-form__upload-zone"
            role="button"
            tabIndex={0}
            onClick={() => attachmentInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                attachmentInputRef.current?.click();
              }
            }}
          >
            Click to upload supporting documents
          </div>
        )}

        <p className="intake-form__help">
          Supporting documents (fit notes, letters, correspondence). For policy
          documents, use the policy upload above.
        </p>

        {attachments.length > 0 && (
          <ul className="intake-form__file-list">
            {attachments.map((a) => (
              <li key={a.filename} className="intake-form__file-item">
                {a.previewUrl && (
                  <img
                    src={a.previewUrl}
                    alt={`Preview of ${a.filename}`}
                    style={{
                      width: 36,
                      height: 36,
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                )}
                <span className="intake-form__file-badge">
                  {fileTypeBadge(a.filename)}
                </span>
                <span>{a.filename}</span>
                {a.extracting && <span className="intake-form__spinner" />}
                {a.charCount !== null && (
                  <span className="intake-form__char-count">
                    Extracted {formatCharCount(a.charCount)} characters
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${a.filename}`}
                  onClick={() => removeAttachment(a.filename)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* 7. Submit */}
      <motion.div
        className="intake-form__field"
        custom={6}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
      >
        <button
          type="submit"
          className="intake-form__submit"
          disabled={!canSubmit}
        >
          Start Conversation
        </button>
      </motion.div>
    </form>
  );
}
