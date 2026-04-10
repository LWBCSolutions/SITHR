/**
 * Renders document template content as a professional HR form.
 * Parses raw template text and applies structured styling.
 */

interface DocumentContentRendererProps {
  content: string;
  filledFields?: Record<string, string>;
}

interface ParsedLine {
  type: 'title' | 'section' | 'field-row' | 'yes-no' | 'textarea' | 'signature' | 'text' | 'spacer' | 'footer' | 'header-field';
  label?: string;
  value?: string;
  raw: string;
  options?: string[];
}

function parseDocumentContent(content: string, filledFields?: Record<string, string>): ParsedLine[] {
  const raw = content.trim();
  const lines = raw.split('\n');
  const parsed: ParsedLine[] = [];
  let foundTitle = false;
  let inHeaderBlock = true;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Apply filled fields
    if (filledFields) {
      for (const [field, value] of Object.entries(filledFields)) {
        line = line.split(`[INSERT: ${field}]`).join(value);
      }
    }

    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === '') {
      if (inHeaderBlock && foundTitle) inHeaderBlock = false;
      parsed.push({ type: 'spacer', raw: line });
      continue;
    }

    // Footer line
    if (trimmed === 'HR guidance document - review before use - not legal advice') {
      parsed.push({ type: 'footer', raw: trimmed });
      continue;
    }

    // Horizontal rule (dashes)
    if (trimmed.match(/^-{3,}$/)) {
      parsed.push({ type: 'spacer', raw: line });
      continue;
    }

    // Signature lines (underscores)
    if (trimmed.match(/_{5,}/)) {
      const labelBefore = trimmed.replace(/_{5,}/, '').replace(/:/g, '').trim();
      parsed.push({ type: 'signature', label: labelBefore || 'Signature', raw: line });
      continue;
    }

    // Document title - first ALL CAPS line that's not a label:value pattern
    if (!foundTitle && trimmed.length > 5 && trimmed === trimmed.toUpperCase() && !trimmed.includes(':') && !trimmed.startsWith('[')) {
      foundTitle = true;
      parsed.push({ type: 'title', raw: trimmed });
      continue;
    }

    // Section headers - ALL CAPS lines after the title
    if (foundTitle && trimmed.length > 3 && trimmed === trimmed.toUpperCase() && !trimmed.includes('[INSERT') && !trimmed.includes(':') && trimmed.length < 80) {
      inHeaderBlock = false;
      parsed.push({ type: 'section', raw: trimmed });
      continue;
    }

    // Yes / No fields
    if (trimmed.match(/Yes\s*\/\s*No(\s*\/\s*(Not applicable|N\/A))?$/i)) {
      const parts = trimmed.split(/\s*Yes\s*\/\s*No/i);
      const label = parts[0].replace(/:?\s*$/, '').trim();
      const hasNA = /Not applicable|N\/A/i.test(trimmed);
      parsed.push({
        type: 'yes-no',
        label: label || trimmed,
        options: hasNA ? ['Yes', 'No', 'N/A'] : ['Yes', 'No'],
        raw: line,
      });
      continue;
    }

    // Field rows - "Label: [INSERT: ...]" or "Label: value"
    const fieldMatch = trimmed.match(/^(.+?):\s*(\[INSERT:[^\]]+\].*|.+)$/);
    if (fieldMatch && fieldMatch[1].length < 60) {
      const label = fieldMatch[1].trim();
      const value = fieldMatch[2].trim();

      // Check if value is a long INSERT field (textarea)
      if (value.match(/\[INSERT:/) && (value.includes('details') || value.includes('description') || value.includes('summary') || value.includes('comments') || value.includes('Summary') || value.includes('account'))) {
        parsed.push({ type: 'textarea', label, value, raw: line });
        continue;
      }

      // Header fields (Organisation, Case Reference, Date at the top)
      if (inHeaderBlock && (label.toLowerCase().includes('organisation') || label.toLowerCase().includes('case reference') || label.toLowerCase().includes('date') || label.toLowerCase().includes('employee') || label.toLowerCase().includes('job title'))) {
        parsed.push({ type: 'header-field', label, value, raw: line });
        continue;
      }

      parsed.push({ type: 'field-row', label, value, raw: line });
      continue;
    }

    // Regular text
    parsed.push({ type: 'text', raw: trimmed });
  }

  return parsed;
}

function renderInsertFields(text: string) {
  const parts = text.split(/(\[INSERT:[^\]]+\])/g);
  return parts.map((part, idx) => {
    if (part.match(/^\[INSERT:/)) {
      return <span key={idx} className="dpr-field-pill">{part}</span>;
    }
    return <span key={idx}>{part}</span>;
  });
}

export default function DocumentContentRenderer({ content, filledFields }: DocumentContentRendererProps) {
  const lines = parseDocumentContent(content, filledFields);

  // Group header fields
  const headerFields = lines.filter(l => l.type === 'header-field');
  const bodyLines = lines.filter(l => l.type !== 'header-field');

  return (
    <div className="dpr">
      {/* Document header block */}
      {headerFields.length > 0 && (
        <div className="dpr-header-block">
          {headerFields.map((line, i) => (
            <div key={i} className="dpr-header-row">
              <span className="dpr-header-label">{line.label}:</span>
              <span className="dpr-header-value">{renderInsertFields(line.value || '')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Document body */}
      {bodyLines.map((line, i) => {
        switch (line.type) {
          case 'title':
            return <h2 key={i} className="dpr-title">{line.raw}</h2>;

          case 'section':
            return <h3 key={i} className="dpr-section">{line.raw}</h3>;

          case 'field-row':
            return (
              <div key={i} className="dpr-field-row">
                <span className="dpr-field-label">{line.label}</span>
                <span className="dpr-field-value">{renderInsertFields(line.value || '')}</span>
              </div>
            );

          case 'yes-no':
            return (
              <div key={i} className="dpr-field-row">
                <span className="dpr-field-label">{line.label}</span>
                <span className="dpr-yesno-pills">
                  {line.options?.map((opt, oi) => (
                    <span key={oi} className="dpr-yesno-pill">{opt}</span>
                  ))}
                </span>
              </div>
            );

          case 'textarea':
            return (
              <div key={i} className="dpr-textarea-block">
                <span className="dpr-textarea-label">{line.label}</span>
                <div className="dpr-textarea-placeholder">
                  {line.value?.match(/\[INSERT:/) ? 'Complete this field before use' : line.value}
                </div>
              </div>
            );

          case 'signature':
            return (
              <div key={i} className="dpr-signature">
                <div className="dpr-signature-line" />
                <span className="dpr-signature-label">{line.label}</span>
              </div>
            );

          case 'footer':
            return (
              <div key={i} className="dpr-footer">
                {line.raw}
              </div>
            );

          case 'spacer':
            return <div key={i} className="dpr-spacer" />;

          case 'text':
            return <p key={i} className="dpr-text">{renderInsertFields(line.raw)}</p>;

          default:
            return null;
        }
      })}
    </div>
  );
}
