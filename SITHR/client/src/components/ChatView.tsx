import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  sendMessage,
  createConversation,
  createMessage,
  LimitError,
  type LimitName,
  getAuthHeaders,
  type Conversation,
  type Message,
} from '../lib/api';
import { formatResponse } from '../lib/formatResponse';
import { getTemplateById, DOCUMENT_TEMPLATES } from '../lib/documentLibrary';
import PolicyFlag from './PolicyFlag';
import IntakeForm, { type IntakeData } from './IntakeForm';
import IntakeSummary from './IntakeSummary';
import DocumentContentRenderer from './DocumentContentRenderer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RecommendedDoc {
  templateId: string;
  title: string;
  filledFields: Record<string, string>;
}

interface DocCardData {
  templateId: string;
  title: string;
  description: string;
  category: string;
  tier: 1 | 2;
  filledFields: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractActionSteps(content: string): string[] {
  const steps: string[] = [];
  const lines = content.split('\n');
  let inRecommendedAction = false;
  let inNextSteps = false;

  for (const line of lines) {
    const upper = line.toUpperCase().trim();
    if (upper.includes('RECOMMENDED ACTION') || upper.includes('RECOMMENDED NEXT STEPS')) {
      inRecommendedAction = true;
      inNextSteps = false;
      continue;
    }
    if (upper.includes('WHAT NOT TO DO') || upper.includes('PROTECTED DISCLOSURE') ||
        upper.includes('JANUARY 2027') || (upper.startsWith('**') && !inNextSteps && inRecommendedAction && steps.length > 0)) {
      if (inRecommendedAction && steps.length > 0) break;
    }

    if (inRecommendedAction) {
      const numbered = line.match(/^\s*(\d+)\.\s+(.+)/);
      if (numbered) {
        steps.push(numbered[2].replace(/\*\*/g, '').trim());
        inNextSteps = true;
      } else if (inNextSteps && line.trim().startsWith('-')) {
        steps.push(line.trim().replace(/^-\s*/, '').replace(/\*\*/g, '').trim());
      } else if (inNextSteps && line.trim() === '') {
        // Empty line after steps might end the section
      } else if (inNextSteps && !line.match(/^\s/) && line.trim().length > 0 && !line.startsWith('-')) {
        break;
      }
    }
  }
  return steps;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ActionChecklist({ steps }: { steps: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (steps.length === 0) return null;

  const toggle = (idx: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="action-checklist">
      <div className="action-checklist-divider" />
      <h4 className="action-checklist-heading">Your Action Checklist</h4>
      {steps.map((step, i) => (
        <label key={i} className={`action-checklist-item ${checked.has(i) ? 'action-checklist-item--checked' : ''}`}>
          <input
            type="checkbox"
            checked={checked.has(i)}
            onChange={() => toggle(i)}
            className="action-checklist-checkbox"
          />
          <span className="action-checklist-text">{step}</span>
        </label>
      ))}
    </div>
  );
}

function DocumentCards({
  docs,
  onPreview,
  selectedDocs,
  onToggleDoc,
}: {
  docs: DocCardData[];
  onPreview: (doc: DocCardData) => void;
  selectedDocs: Set<string>;
  onToggleDoc: (templateId: string, e: React.MouseEvent) => void;
}) {
  if (docs.length === 0) return null;

  return (
    <div className="doc-cards">
      <div className="action-checklist-divider" />
      <h4 className="action-checklist-heading">Recommended Documents</h4>
      {docs.map((doc) => {
        const isAdded = selectedDocs.has(doc.templateId);
        return (
          <div key={doc.templateId} className="doc-card">
            <div className="doc-card-icon">
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1H3C1.9 1 1 1.9 1 3v18c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8l-7-7z" stroke="#2D7DD2" strokeWidth="1.5" fill="none"/>
                <path d="M12 1v7h7" stroke="#2D7DD2" strokeWidth="1.5" fill="none"/>
                <line x1="5" y1="13" x2="15" y2="13" stroke="#2D7DD2" strokeWidth="1" opacity="0.4"/>
                <line x1="5" y1="16" x2="12" y2="16" stroke="#2D7DD2" strokeWidth="1" opacity="0.4"/>
                <line x1="5" y1="19" x2="13" y2="19" stroke="#2D7DD2" strokeWidth="1" opacity="0.4"/>
              </svg>
            </div>
            <div className="doc-card-content">
              <div className="doc-card-title">{doc.title}</div>
              <div className="doc-card-meta">
                <span className={`doc-card-category doc-card-category--${doc.category}`}>{doc.category}</span>
                <span className={`doc-card-tier doc-card-tier--${doc.tier}`}>
                  {doc.tier === 1 ? 'Administrative' : 'Requires Review'}
                </span>
              </div>
              <div className="doc-card-description">{doc.description}</div>
            </div>
            <div className="doc-card-actions">
              <button className="doc-card-preview-btn" onClick={() => onPreview(doc)}>
                Preview
              </button>
              <button
                className={`doc-card-add-btn ${isAdded ? 'doc-card-add-btn--added' : ''}`}
                onClick={(e) => onToggleDoc(doc.templateId, e)}
              >
                {isAdded ? 'Added' : 'Add to Pack'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="doc-cards">
      <div className="action-checklist-divider" />
      <h4 className="action-checklist-heading">Recommended Documents</h4>
      {[1, 2, 3].map(i => (
        <div key={i} className="doc-card doc-card--skeleton">
          <div className="skeleton-icon" />
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--desc" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentPreviewModal({
  doc,
  onClose,
  isAdded,
  onToggle,
}: {
  doc: DocCardData;
  onClose: () => void;
  isAdded: boolean;
  onToggle: () => void;
}) {
  const template = getTemplateById(doc.templateId);

  return (
    <div className="doc-preview-overlay" onClick={onClose}>
      <div className="doc-preview-modal" onClick={e => e.stopPropagation()}>
        <div className="doc-preview-header">
          <h3 className="doc-preview-title">{doc.title}</h3>
          <button className="doc-preview-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
            </svg>
          </button>
        </div>
        <div className="doc-preview-body">
          {doc.tier === 2 ? (
            <div className="doc-preview-tier-notice doc-preview-tier-notice--formal">
              This is a formal process document (Tier 2). It must be reviewed by a
              qualified HR professional or employment solicitor before use in any
              formal process.
            </div>
          ) : (
            <div className="doc-preview-tier-notice doc-preview-tier-notice--admin">
              This document should be reviewed before use to ensure it reflects your
              organisation's specific policies and circumstances.
            </div>
          )}
          {template ? (
            <DocumentContentRenderer
              content={template.sections.map(s =>
                (s.heading ? s.heading.toUpperCase() + '\n\n' : '') + s.paragraphs.join('\n')
              ).join('\n\n')}
              filledFields={doc.filledFields}
            />
          ) : (
            <p className="doc-preview-para">Template preview not available.</p>
          )}
        </div>
        <div className="doc-preview-footer">
          <button
            className={`doc-card-add-btn ${isAdded ? 'doc-card-add-btn--added' : ''}`}
            onClick={onToggle}
          >
            {isAdded ? 'Added to Pack' : 'Add to Pack'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface ChatViewProps {
  userId: string;
  conversationId: string | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  loadingMessages: boolean;
  onConversationCreated: (conversation: Conversation) => void;
  caseRef: string;
  setCaseRef: (value: string) => void;
  onStreamingChange?: (streaming: boolean) => void;
  onSelectedDocsChange?: (count: number) => void;
  sessionPolicies?: Array<{ filename: string; content: string }>;
  sessionAttachments?: Array<{ filename: string; content: string; mimetype: string }>;
  intakeSituationType?: string;
  intakeServiceLength?: string;
  intakePreviousAction?: string;
  intakeCompleted?: boolean;
  onIntakeSubmit?: (data: IntakeData) => void;
  onEditIntake?: () => void;
  onLimitReached?: (limit: LimitName, message: string) => void;
}

export default function ChatView({
  userId,
  conversationId,
  messages,
  setMessages,
  loadingMessages,
  onConversationCreated,
  caseRef,
  setCaseRef,
  onStreamingChange,
  onSelectedDocsChange,
  sessionPolicies = [],
  sessionAttachments = [],
  intakeSituationType = '',
  intakeServiceLength = '',
  intakePreviousAction = '',
  intakeCompleted = false,
  onIntakeSubmit,
  onEditIntake,
  onLimitReached,
}: ChatViewProps) {
  const [input, setInput] = useState('');
  const intakeContextSentRef = useRef(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [streamingDisplay, setStreamingDisplay] = useState('');
  const streamingContentRef = useRef('');
  const [caseRefLocked, setCaseRefLocked] = useState(false);
  const [docCards, setDocCards] = useState<Map<string, DocCardData[]>>(new Map());
  const [docCardsLoading, setDocCardsLoading] = useState<Set<string>>(new Set());
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [previewDoc, setPreviewDoc] = useState<DocCardData | null>(null);
  const [flyingDoc, setFlyingDoc] = useState<{ startX: number; startY: number; endX: number; endY: number; id: string } | null>(null);
  const [policyAnalysis, setPolicyAnalysis] = useState<Map<string, {
    filename: string;
    overall: string;
    observations: string[];
    disclaimer: string;
  }>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const conversationIdRef = useRef<string | null>(conversationId);
  const userScrolledUp = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    onStreamingChange?.(isStreaming);
  }, [isStreaming, onStreamingChange]);

  useEffect(() => {
    onSelectedDocsChange?.(selectedDocs.size);
  }, [selectedDocs, onSelectedDocsChange]);

  useEffect(() => {
    if (conversationId === null) {
      setCaseRefLocked(false);
    } else {
      setCaseRefLocked(true);
    }
  }, [conversationId]);

  // Smart scroll - auto-scroll unless user scrolled up
  const scrollToBottom = useCallback(() => {
    if (!userScrolledUp.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingDisplay, scrollToBottom]);

  // Detect user scroll up
  const handleMessagesScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 60;
    userScrolledUp.current = !isNearBottom;
  }, []);

  // Reset scroll tracking when streaming starts
  useEffect(() => {
    if (isStreaming) {
      userScrolledUp.current = false;
    }
  }, [isStreaming]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    const maxHeight = 24 * 4;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  // Fetch document recommendations after AI response completes
  const fetchDocCards = useCallback(async (msgId: string, conversationMessages: Message[]) => {
    setDocCardsLoading(prev => new Set(prev).add(msgId));
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          documentGeneration: true,
          conversationHistory: conversationMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      if (!response.ok) return;
      const result = await response.json();
      if (result.type !== 'document_pack') return;

      let cleaned = result.content.trim();
      const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) cleaned = fenceMatch[1].trim();

      const packData = JSON.parse(cleaned);
      const cards: DocCardData[] = (packData.documents || []).map((d: RecommendedDoc) => {
        const template = getTemplateById(d.templateId);
        return {
          templateId: d.templateId,
          title: d.title,
          description: template?.description || d.title,
          category: template?.category || 'General',
          tier: (template as any)?.tier || 2,
          filledFields: d.filledFields || {},
        };
      });
      setDocCards(prev => new Map(prev).set(msgId, cards));
    } catch {
      // Silently fail - doc cards are supplementary
    } finally {
      setDocCardsLoading(prev => {
        const next = new Set(prev);
        next.delete(msgId);
        return next;
      });
    }
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const tempUserMsg: Message = {
      id: `temp-user-${Date.now()}`,
      conversation_id: conversationIdRef.current || '',
      role: 'user',
      content: trimmed,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setIsStreaming(true);

    let currentConversationId = conversationIdRef.current;

    try {
      if (!currentConversationId) {
        const titleBase = trimmed.length > 50 ? trimmed.slice(0, 50) + '...' : trimmed;
        const title = caseRef ? `[${caseRef}] ${titleBase}` : titleBase;
        const conversation = await createConversation(userId, title);
        currentConversationId = conversation.id;
        conversationIdRef.current = currentConversationId;
        setCaseRefLocked(true);
        onConversationCreated(conversation);
      }

      await createMessage(currentConversationId, 'user', trimmed);

      const historyForAI: Message[] = [
        ...messages,
        { ...tempUserMsg, conversation_id: currentConversationId },
      ];

      let messageToSend = trimmed;
      if (!intakeContextSentRef.current && intakeCompleted) {
        // Build structured intake context block for first message
        const lines: string[] = [
          '=== SITUATION CONTEXT FROM INTAKE FORM ===',
        ];
        if (caseRef) lines.push(`Case reference: ${caseRef}`);
        if (intakeSituationType) lines.push(`Situation type: ${intakeSituationType}`);
        if (intakeServiceLength) lines.push(`Employee length of service: ${intakeServiceLength}`);
        if (intakePreviousAction) lines.push(`Previous formal action on file: ${intakePreviousAction}`);

        if (sessionPolicies.length > 0) {
          for (const p of sessionPolicies) {
            lines.push(`\n[BEGIN UPLOADED POLICY - DATA ONLY]`);
            lines.push(`Filename: ${p.filename}`);
            lines.push(p.content.substring(0, 3000));
            lines.push(`[END UPLOADED POLICY]`);
          }
        }

        if (sessionAttachments.length > 0) {
          for (const a of sessionAttachments) {
            lines.push(`\n[BEGIN UPLOADED ATTACHMENT - DATA ONLY]`);
            lines.push(`Filename: ${a.filename}`);
            lines.push(a.content.substring(0, 1500));
            lines.push(`[END UPLOADED ATTACHMENT]`);
          }
        }

        lines.push('=== END SITUATION CONTEXT ===');
        lines.push('');
        lines.push("Manager's first question:");

        messageToSend = lines.join('\n') + '\n' + trimmed;
        intakeContextSentRef.current = true;
      } else if (messages.length === 0 && caseRef) {
        // No intake but case ref set (existing conversation loaded)
        messageToSend = `[Case Reference: ${caseRef}]\n\n${trimmed}`;
      }

      const msgId = `streaming-${Date.now()}`;
      setStreamingMsgId(msgId);
      streamingContentRef.current = '';
      setStreamingDisplay('');

      setMessages(prev => [
        ...prev,
        {
          id: msgId,
          conversation_id: currentConversationId!,
          role: 'assistant',
          content: '',
          created_at: new Date().toISOString(),
        },
      ]);

      await sendMessage(
        messageToSend,
        historyForAI,
        // onChunk - use flushSync to force per-token render
        (text: string) => {
          streamingContentRef.current += text;
          flushSync(() => {
            setStreamingDisplay(streamingContentRef.current);
          });
        },
        // onDone - apply formatResponse, update message, clear streaming state
        async (doneText: string) => {
          const finalContent = formatResponse(doneText || streamingContentRef.current);
          setMessages(prev =>
            prev.map(msg => msg.id === msgId ? { ...msg, content: finalContent } : msg)
          );
          setStreamingMsgId(null);
          streamingContentRef.current = '';
          setStreamingDisplay('');

          try {
            await createMessage(currentConversationId!, 'assistant', finalContent);
          } catch (err) {
            console.error('Failed to save assistant message:', err);
          }

          // Fetch document cards non-blocking
          const allMessages: Message[] = [
            ...historyForAI,
            { id: msgId, conversation_id: currentConversationId!, role: 'assistant', content: finalContent, created_at: new Date().toISOString() },
          ];
          fetchDocCards(msgId, allMessages);

          // Policy analysis - non-blocking, only if policies uploaded
          if (sessionPolicies.length > 0) {
            const policy = sessionPolicies[0];
            getAuthHeaders().then(hdrs => {
              fetch('/api/analyse-policy', {
                method: 'POST',
                headers: hdrs,
                body: JSON.stringify({
                  policyFilename: policy.filename,
                  policyContent: policy.content.substring(0, 3000),
                  situationType: intakeSituationType || 'General HR',
                }),
              })
                .then(r => r.json())
                .then(data => {
                  if (!data.error && data.observations && data.observations.length > 0) {
                    setPolicyAnalysis(prev => new Map(prev).set(msgId, {
                      filename: policy.filename,
                      overall: data.overall || 'some observations',
                      observations: data.observations,
                      disclaimer: data.disclaimer || 'These observations are not a policy audit.',
                    }));
                  }
                })
                .catch(() => {}); // silent fail
            });
          }
        },
        // onError
        (errorMsg: string) => {
          setStreamingMsgId(null);
          streamingContentRef.current = '';
          setStreamingDisplay('');
          const isRetryable = errorMsg.includes('temporarily busy') || errorMsg.includes('service_busy');
          setMessages(prev => {
            const filtered = prev.filter(msg => msg.id !== msgId);
            return [
              ...filtered,
              {
                id: `error-${Date.now()}`,
                conversation_id: currentConversationId || '',
                role: 'assistant',
                content: isRetryable
                  ? `__RETRYABLE__${trimmed}`
                  : `**Error:** ${errorMsg}`,
                created_at: new Date().toISOString(),
              },
            ];
          });
        },
        // onLimitReached - drop the optimistic user bubble and bubble up to ChatLayout
        (limit, limitMessage) => {
          setStreamingMsgId(null);
          streamingContentRef.current = '';
          setStreamingDisplay('');
          setMessages(prev => prev.filter(msg => msg.id !== tempUserMsg.id && msg.id !== msgId));
          onLimitReached?.(limit, limitMessage);
        }
      );
    } catch (err) {
      setStreamingMsgId(null);
      streamingContentRef.current = '';
      setStreamingDisplay('');
      if (err instanceof LimitError) {
        // Drop the optimistic user bubble and surface to ChatLayout
        setMessages(prev => prev.filter(msg => msg.id !== tempUserMsg.id));
        onLimitReached?.(err.limit, err.message);
      } else {
        const errorContent = err instanceof Error ? err.message : 'An unexpected error occurred';
        setMessages(prev => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            conversation_id: currentConversationId || '',
            role: 'assistant',
            content: `**Error:** ${errorContent}`,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleDoc = (templateId: string, e?: React.MouseEvent) => {
    const isAdding = !selectedDocs.has(templateId);

    setSelectedDocs(prev => {
      const next = new Set(prev);
      if (next.has(templateId)) next.delete(templateId);
      else next.add(templateId);
      return next;
    });

    // Flying animation on add (not remove)
    if (isAdding && e && !flyingDoc) {
      const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      // Find the export pack button in the header
      const exportBtn = document.querySelector('.export-pack-btn');
      const endRect = exportBtn?.getBoundingClientRect();
      if (endRect) {
        setFlyingDoc({
          startX: btnRect.left + btnRect.width / 2,
          startY: btnRect.top + btnRect.height / 2,
          endX: endRect.left + endRect.width / 2,
          endY: endRect.top + endRect.height / 2,
          id: templateId,
        });
      }
    }
  };

  // New conversation: show intake form until submitted
  if (!conversationId && messages.length === 0 && !loadingMessages && !intakeCompleted) {
    return (
      <div className="chat-view">
        <div className="messages-container">
          <div className="messages-content">
            <IntakeForm onSubmit={(data) => onIntakeSubmit?.(data)} />
          </div>
        </div>
      </div>
    );
  }

  // After intake submitted but before first message: show chat input with context placeholder
  if (!conversationId && messages.length === 0 && !loadingMessages && intakeCompleted) {
    return (
      <div className="chat-view">
        <div className="welcome-screen">
          <div className="welcome-logo">
            <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="6" width="28" height="6" rx="2.5" fill="#2D7DD2"/>
              <rect x="4" y="16" width="20" height="6" rx="2.5" fill="#2D7DD2" opacity="0.6"/>
              <rect x="4" y="26" width="24" height="6" rx="2.5" fill="#2D7DD2" opacity="0.35"/>
            </svg>
          </div>
          <h2 className="welcome-title">SIT-HR Advisory</h2>
          <p className="welcome-description">
            Context received. Ask your first question about this situation.
          </p>
        </div>
        <div className="chat-input-area">
          <div className="chat-input-content">
            <div className="chat-input-wrapper">
              <textarea ref={textareaRef} className="chat-input" value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Ask your first question about this situation..." rows={1} disabled={isStreaming} />
              <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isStreaming} title="Send message">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="9" y1="16" x2="9" y2="2"/><polyline points="3,8 9,2 15,8"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-view">
      {intakeCompleted && (
        <IntakeSummary
          caseRef={caseRef}
          situationType={intakeSituationType}
          serviceLength={intakeServiceLength}
          previousAction={intakePreviousAction}
          policies={sessionPolicies}
          attachments={sessionAttachments}
          locked={intakeContextSentRef.current || messages.length > 0}
          onEdit={onEditIntake}
        />
      )}
      <div className="messages-container" ref={messagesContainerRef} onScroll={handleMessagesScroll}>
        <div className="messages-content">
          {loadingMessages && (
            <div className="messages-loading">
              <div className="loading-dots"><span /><span /><span /></div>
            </div>
          )}

          {messages.map((msg) => {
            const isCurrentlyStreaming = msg.id === streamingMsgId;
            const actionSteps = (!isCurrentlyStreaming && msg.role === 'assistant' && msg.content) ? extractActionSteps(msg.content) : [];
            const msgDocCards = docCards.get(msg.id) || [];
            const isLoadingDocs = docCardsLoading.has(msg.id);

            return (
              <div key={msg.id} className={`message message--${msg.role}`}>
                {msg.role === 'user' ? (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="message-bubble message-bubble--user"
                  >
                    <div className="message-text">{msg.content}</div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="message-content--assistant"
                  >
                    {isCurrentlyStreaming ? (
                      // During streaming: raw text from ref + blinking cursor
                      <div className="streaming-text">
                        {streamingDisplay}
                        <span className="typing-cursor" />
                      </div>
                    ) : msg.content?.startsWith('__RETRYABLE__') ? (
                      // Retryable error - show retry UI
                      <div className="retry-message">
                        <p className="retry-message__text">
                          The guidance service is temporarily busy. Please try again in a moment.
                        </p>
                        <button
                          className="retry-message__btn"
                          onClick={() => {
                            const originalMsg = msg.content.replace('__RETRYABLE__', '');
                            setMessages(prev => prev.filter(m => m.id !== msg.id));
                            setInput(originalMsg);
                          }}
                        >
                          Try again
                        </button>
                      </div>
                    ) : msg.content ? (
                      // Completed: full markdown render
                      <>
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                        <ActionChecklist steps={actionSteps} />
                        {policyAnalysis.has(msg.id) && (
                          <PolicyFlag
                            filename={policyAnalysis.get(msg.id)!.filename}
                            overall={policyAnalysis.get(msg.id)!.overall}
                            observations={policyAnalysis.get(msg.id)!.observations}
                            disclaimer={policyAnalysis.get(msg.id)!.disclaimer}
                          />
                        )}
                        {isLoadingDocs && <SkeletonCards />}
                        {msgDocCards.length > 0 && (
                          <DocumentCards
                            docs={msgDocCards}
                            onPreview={setPreviewDoc}
                            selectedDocs={selectedDocs}
                            onToggleDoc={toggleDoc}
                          />
                        )}
                      </>
                    ) : (
                      // Empty content, waiting for first token
                      <div className="streaming-text">
                        <span className="typing-cursor" />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-area">
        <div className="chat-input-content">
          <div className="chat-input-wrapper">
            <textarea ref={textareaRef} className="chat-input" value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Ask an HR question..." rows={1} disabled={isStreaming} />
            <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isStreaming} title="Send message">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="9" y1="16" x2="9" y2="2"/><polyline points="3,8 9,2 15,8"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {previewDoc && (
        <DocumentPreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
          isAdded={selectedDocs.has(previewDoc.templateId)}
          onToggle={() => toggleDoc(previewDoc.templateId)}
        />
      )}

      {/* Flying document animation */}
      <AnimatePresence>
        {flyingDoc && (
          <motion.div
            key={flyingDoc.id + '-fly'}
            initial={{
              position: 'fixed',
              left: flyingDoc.startX,
              top: flyingDoc.startY,
              x: '-50%',
              y: '-50%',
              opacity: 1,
              scale: 1,
              zIndex: 9999,
              pointerEvents: 'none' as const,
            }}
            animate={{
              left: flyingDoc.endX,
              top: flyingDoc.endY,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{
              duration: 0.45,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onAnimationComplete={() => setFlyingDoc(null)}
            style={{
              width: 24,
              height: 28,
              background: '#2D7DD2',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <rect x="1" y="1" width="10" height="12" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="3" y="4" width="6" height="1" rx="0.5" fill="#2D7DD2"/>
              <rect x="3" y="6.5" width="6" height="1" rx="0.5" fill="#2D7DD2"/>
              <rect x="3" y="9" width="4" height="1" rx="0.5" fill="#2D7DD2"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
