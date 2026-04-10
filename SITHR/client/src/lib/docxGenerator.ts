/**
 * Professional HR document DOCX generator.
 * Used by both Document Library downloads and Export Pack generation.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  Footer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  TabStopType,
  PageNumber,
} from 'docx';
import { saveAs } from 'file-saver';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GenerateDocxOptions {
  content: string;
  title: string;
  tier: 1 | 2;
  category?: string;
  reviewNotice?: string;
  caseRef?: string;
  organisationName?: string;
  filledFields?: Record<string, string>;
  filename?: string;
}

// ---------------------------------------------------------------------------
// Content parser
// ---------------------------------------------------------------------------

interface ParsedBlock {
  type: 'title' | 'section' | 'field-row' | 'yes-no' | 'textarea' | 'signature' | 'body' | 'spacer' | 'divider' | 'footer-text';
  label?: string;
  value?: string;
  raw: string;
  options?: string[];
}

function parseTemplateContent(content: string, filledFields?: Record<string, string>): ParsedBlock[] {
  let text = content.trim();

  // Apply filled fields
  if (filledFields) {
    for (const [field, val] of Object.entries(filledFields)) {
      text = text.split(`[INSERT: ${field}]`).join(val);
    }
  }

  const lines = text.split('\n');
  const blocks: ParsedBlock[] = [];
  let foundTitle = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      blocks.push({ type: 'spacer', raw: '' });
      continue;
    }

    if (trimmed === 'HR guidance document - review before use - not legal advice') {
      blocks.push({ type: 'footer-text', raw: trimmed });
      continue;
    }

    if (trimmed.match(/^-{3,}$/) || trimmed.match(/^={3,}$/)) {
      blocks.push({ type: 'divider', raw: trimmed });
      continue;
    }

    if (trimmed.match(/_{5,}/)) {
      const label = trimmed.replace(/_{5,}/g, '').replace(/:/g, '').trim();
      blocks.push({ type: 'signature', label: label || 'Signature', raw: line });
      continue;
    }

    // Document title - first ALL CAPS line not a field
    if (!foundTitle && trimmed.length > 5 && trimmed === trimmed.toUpperCase() &&
        !trimmed.includes(':') && !trimmed.startsWith('[') && !trimmed.startsWith('OPTION') &&
        !trimmed.startsWith('REVIEW') && !trimmed.startsWith('IMPORTANT')) {
      foundTitle = true;
      blocks.push({ type: 'title', raw: trimmed });
      continue;
    }

    // Section headers - ALL CAPS after title, no colon, not too long
    if (foundTitle && trimmed.length > 3 && trimmed.length < 80 &&
        trimmed === trimmed.toUpperCase() && !trimmed.includes('[INSERT') &&
        !trimmed.includes(':') && !trimmed.startsWith('OPTION') &&
        !trimmed.startsWith('THIS IS NOT') && !trimmed.startsWith('NOTE:')) {
      blocks.push({ type: 'section', raw: trimmed });
      continue;
    }

    // Yes / No fields
    if (trimmed.match(/Yes\s*\/\s*No(\s*\/\s*(Not applicable|N\/A))?$/i)) {
      const parts = trimmed.split(/\s*Yes\s*\/\s*No/i);
      const label = parts[0].replace(/:?\s*$/, '').trim();
      const hasNA = /Not applicable|N\/A/i.test(trimmed);
      blocks.push({
        type: 'yes-no',
        label: label || trimmed,
        options: hasNA ? ['Yes', 'No', 'N/A'] : ['Yes', 'No'],
        raw: line,
      });
      continue;
    }

    // Field rows - "Label: value" or "Label: [INSERT: ...]"
    const fieldMatch = trimmed.match(/^(.+?):\s*(\[INSERT:[^\]]+\].*|.+)$/);
    if (fieldMatch && fieldMatch[1].length < 60 && !trimmed.startsWith('[')) {
      const label = fieldMatch[1].trim();
      const value = fieldMatch[2].trim();

      // Long INSERT fields become textareas
      if (value.match(/\[INSERT:/) && value.length > 30 &&
          (value.toLowerCase().includes('detail') || value.toLowerCase().includes('description') ||
           value.toLowerCase().includes('summary') || value.toLowerCase().includes('comment') ||
           value.toLowerCase().includes('account') || value.toLowerCase().includes('reason'))) {
        blocks.push({ type: 'textarea', label, value, raw: line });
        continue;
      }

      blocks.push({ type: 'field-row', label, value, raw: line });
      continue;
    }

    // Regular body text
    blocks.push({ type: 'body', raw: trimmed });
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// DOCX element builders
// ---------------------------------------------------------------------------

function createInsertRun(text: string): TextRun {
  if (text.match(/^\[INSERT:/)) {
    return new TextRun({ text, font: 'Arial', size: 20, bold: true, color: '185FA5', italics: true });
  }
  return new TextRun({ text, font: 'Arial', size: 20, color: '1C1C1E' });
}

function createTextWithInserts(text: string): TextRun[] {
  const parts = text.split(/(\[INSERT:[^\]]+\])/g);
  return parts.filter(p => p).map(part => createInsertRun(part));
}

function buildFieldTable(rows: ParsedBlock[]): Table {
  const tableRows = rows.map(row => {
    const isYesNo = row.type === 'yes-no';
    const valueCellChildren = isYesNo
      ? [new Paragraph({
          children: (row.options || ['Yes', 'No']).map((opt, i) => new TextRun({
            text: (i > 0 ? '   ' : '') + opt,
            font: 'Arial', size: 20, color: '666666',
          })),
        })]
      : [new Paragraph({ children: createTextWithInserts(row.value || '') })];

    return new TableRow({
      children: [
        new TableCell({
          width: { size: 3610, type: WidthType.DXA },
          shading: { fill: 'F5F5F5', type: ShadingType.CLEAR, color: 'auto' },
          margins: { top: 80, bottom: 80, left: 160, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({
              text: row.label || '', font: 'Arial', size: 20, bold: true, color: '555555',
            })],
          })],
        }),
        new TableCell({
          width: { size: 5416, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 160, right: 120 },
          children: valueCellChildren,
        }),
      ],
    });
  });

  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [3610, 5416],
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'E0E0E0' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    rows: tableRows,
  });
}

// ---------------------------------------------------------------------------
// Main document builder
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Email letter builder (category === 'email')
// ---------------------------------------------------------------------------

function buildEmailDocument(options: GenerateDocxOptions): Document {
  const { content, caseRef, organisationName, filledFields } = options;
  const exportDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  let text = content.trim();
  if (filledFields) {
    for (const [field, val] of Object.entries(filledFields)) {
      text = text.split(`[INSERT: ${field}]`).join(val);
    }
  }

  const lines = text.split('\n');
  const children: Paragraph[] = [];

  // Letter header - right aligned
  children.push(new Paragraph({
    children: [new TextRun({ text: organisationName || '[INSERT: Organisation Name]', font: 'Arial', size: 20, color: '666666' })],
    alignment: AlignmentType.RIGHT,
    spacing: { before: 0, after: 0 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: exportDate, font: 'Arial', size: 20, color: '666666' })],
    alignment: AlignmentType.RIGHT,
    spacing: { before: 0, after: 0 },
  }));
  if (caseRef) {
    children.push(new Paragraph({
      children: [new TextRun({ text: `Ref: ${caseRef}`, font: 'Arial', size: 20, color: '666666' })],
      alignment: AlignmentType.RIGHT,
      spacing: { before: 0, after: 360 },
    }));
  } else {
    children.push(new Paragraph({ spacing: { before: 0, after: 360 } }));
  }

  // Parse email content lines
  let foundSubject = false;
  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '' || trimmed === 'HR guidance document - review before use - not legal advice') {
      if (trimmed === 'HR guidance document - review before use - not legal advice') continue;
      children.push(new Paragraph({ spacing: { before: 80, after: 80 } }));
      continue;
    }

    if (trimmed.match(/^-{3,}$/)) continue;

    // Subject line
    if (trimmed.startsWith('Subject:') && !foundSubject) {
      foundSubject = true;
      const subjectText = trimmed.replace('Subject:', '').trim();
      children.push(new Paragraph({
        children: [new TextRun({ text: `RE: ${subjectText}`, font: 'Arial', size: 22, bold: true, underline: {} })],
        spacing: { before: 0, after: 240 },
      }));
      continue;
    }

    // IMPORTANT NOTE blocks
    if (trimmed.startsWith('IMPORTANT NOTE') || trimmed.startsWith('REVIEW NOTICE')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: trimmed, font: 'Arial', size: 18, color: 'A32D2D', italics: true })],
        shading: { fill: 'FCEBEB', type: ShadingType.CLEAR, color: 'auto' },
        spacing: { before: 240, after: 120 },
        border: { left: { style: BorderStyle.THICK, size: 12, color: 'A32D2D', space: 4 } },
        indent: { left: 240, right: 240 },
      }));
      continue;
    }

    // Body paragraphs with [INSERT:] highlighting
    const parts = trimmed.split(/(\[INSERT:[^\]]+\])/g);
    const runs = parts.filter(p => p).map(part => {
      if (part.match(/^\[INSERT:/)) {
        return new TextRun({ text: part, font: 'Arial', size: 22, bold: true, color: '185FA5' });
      }
      return new TextRun({ text: part, font: 'Arial', size: 22, color: '333333' });
    });

    children.push(new Paragraph({
      children: runs,
      spacing: { before: 0, after: 160, line: 276 },
    }));
  }

  return new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [
              new TextRun({ text: 'HR ADVISORY DOCUMENT', font: 'Arial', size: 16, color: '999999', allCaps: true }),
              new TextRun({ text: '\t', font: 'Arial' }),
              new TextRun({ text: caseRef || '', font: 'Arial', size: 16, color: '2D7DD2' }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: 8626 }],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0', space: 4 } },
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [
              new TextRun({ text: 'HR guidance document - review before use - not legal advice', font: 'Arial', size: 16, color: '999999', italics: true }),
              new TextRun({ text: '\t', font: 'Arial' }),
              new TextRun({ text: 'Page ', font: 'Arial', size: 16, color: '999999' }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: '999999' }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: 8626 }],
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0', space: 4 } },
          })],
        }),
      },
      children,
    }],
  });
}

// ---------------------------------------------------------------------------
// HR form document builder
// ---------------------------------------------------------------------------

function buildDocument(options: GenerateDocxOptions): Document {
  const { content, title, tier, reviewNotice, caseRef, organisationName, filledFields } = options;
  const blocks = parseTemplateContent(content, filledFields);
  const exportDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Build body children
  const children: (Paragraph | Table)[] = [];

  // Blue top bar
  children.push(new Paragraph({
    border: { top: { style: BorderStyle.THICK, size: 24, color: '2D7DD2', space: 0 } },
    spacing: { before: 0, after: 0 },
  }));

  // Cover block
  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'Organisation: ', font: 'Arial', size: 20, color: '666666' }),
      new TextRun({ text: organisationName || '[INSERT: Organisation Name]', font: 'Arial', size: 20, bold: true, color: '185FA5' }),
    ],
    shading: { fill: 'F5F5F5', type: ShadingType.CLEAR, color: 'auto' },
    spacing: { before: 160, after: 0 },
    indent: { left: 240, right: 240 },
  }));

  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'Case Reference: ', font: 'Arial', size: 20, color: '666666' }),
      new TextRun({ text: caseRef || '[INSERT: Case Reference]', font: 'Arial', size: 20, bold: true, color: '185FA5' }),
    ],
    shading: { fill: 'F5F5F5', type: ShadingType.CLEAR, color: 'auto' },
    spacing: { before: 0, after: 0 },
    indent: { left: 240, right: 240 },
  }));

  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'Date: ', font: 'Arial', size: 20, color: '666666' }),
      new TextRun({ text: exportDate, font: 'Arial', size: 20, bold: true, color: '1C1C1E' }),
    ],
    shading: { fill: 'F5F5F5', type: ShadingType.CLEAR, color: 'auto' },
    spacing: { before: 0, after: 160 },
    indent: { left: 240, right: 240 },
  }));

  // Tier 2 review notice
  if (tier === 2 && reviewNotice) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: 'REVIEW REQUIRED: ', font: 'Arial', size: 18, bold: true, color: 'A32D2D' }),
        new TextRun({ text: reviewNotice, font: 'Arial', size: 18, color: 'A32D2D', italics: true }),
      ],
      shading: { fill: 'FCEBEB', type: ShadingType.CLEAR, color: 'auto' },
      spacing: { before: 240, after: 240 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'A32D2D', space: 4 },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'A32D2D', space: 4 },
        left: { style: BorderStyle.THICK, size: 12, color: 'A32D2D', space: 4 },
        right: { style: BorderStyle.SINGLE, size: 4, color: 'A32D2D', space: 4 },
      },
      indent: { left: 240, right: 240 },
    }));
  }

  // Process content blocks
  let fieldBuffer: ParsedBlock[] = [];

  function flushFieldBuffer() {
    if (fieldBuffer.length > 0) {
      children.push(buildFieldTable(fieldBuffer));
      fieldBuffer = [];
    }
  }

  for (const block of blocks) {
    if (block.type === 'field-row' || block.type === 'yes-no') {
      fieldBuffer.push(block);
      continue;
    }

    // Flush any accumulated field rows before non-field content
    flushFieldBuffer();

    switch (block.type) {
      case 'title':
        children.push(new Paragraph({
          children: [new TextRun({ text: block.raw, font: 'Arial', size: 28, bold: true, color: '1C1C1E' })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 240 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '2D7DD2', space: 4 } },
        }));
        break;

      case 'section':
        children.push(new Paragraph({
          children: [new TextRun({ text: block.raw, font: 'Arial', size: 20, bold: true, color: '2D7DD2', allCaps: true })],
          spacing: { before: 240, after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0', space: 2 } },
        }));
        break;

      case 'textarea':
        children.push(new Paragraph({
          children: [new TextRun({ text: block.label || '', font: 'Arial', size: 20, bold: true, color: '444444' })],
          spacing: { before: 120, after: 60 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({
            text: block.value?.match(/\[INSERT:/) ? 'Complete this field before use' : (block.value || ''),
            font: 'Arial', size: 18, color: '2D7DD2', italics: true,
          })],
          shading: { fill: 'F0F7FF', type: ShadingType.CLEAR, color: 'auto' },
          border: {
            top: { style: BorderStyle.DASH_DOT_STROKED, size: 4, color: '2D7DD2', space: 4 },
            bottom: { style: BorderStyle.DASH_DOT_STROKED, size: 4, color: '2D7DD2', space: 4 },
            left: { style: BorderStyle.DASH_DOT_STROKED, size: 4, color: '2D7DD2', space: 4 },
            right: { style: BorderStyle.DASH_DOT_STROKED, size: 4, color: '2D7DD2', space: 4 },
          },
          spacing: { before: 60, after: 120 },
          indent: { left: 240, right: 240 },
        }));
        break;

      case 'signature':
        children.push(new Paragraph({
          spacing: { before: 240, after: 0 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1C1C1E', space: 0 } },
          indent: { right: 5026 }, // Limit width to ~40%
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: block.label || 'Signature', font: 'Arial', size: 16, color: '999999' })],
          spacing: { before: 40, after: 120 },
        }));
        break;

      case 'divider':
        children.push(new Paragraph({
          spacing: { before: 120, after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0', space: 4 } },
        }));
        break;

      case 'footer-text':
        children.push(new Paragraph({
          children: [new TextRun({ text: block.raw, font: 'Arial', size: 16, color: '999999', italics: true })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 0 },
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0', space: 4 } },
        }));
        break;

      case 'body':
        children.push(new Paragraph({
          children: createTextWithInserts(block.raw),
          spacing: { before: 0, after: 160, line: 276 },
        }));
        break;

      case 'spacer':
        children.push(new Paragraph({ spacing: { before: 60, after: 60 } }));
        break;
    }
  }

  flushFieldBuffer();

  return new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'HR ADVISORY DOCUMENT', font: 'Arial', size: 16, color: '999999', allCaps: true }),
                new TextRun({ text: '\t', font: 'Arial' }),
                new TextRun({ text: 'Case Reference: ', font: 'Arial', size: 16, color: '999999' }),
                new TextRun({ text: caseRef || '[No Case Reference]', font: 'Arial', size: 16, color: '2D7DD2' }),
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: 8626 }],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0', space: 4 } },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'HR guidance document - review before use - not legal advice', font: 'Arial', size: 16, color: '999999', italics: true }),
                new TextRun({ text: '\t', font: 'Arial' }),
                new TextRun({ text: 'Page ', font: 'Arial', size: 16, color: '999999' }),
                new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: '999999' }),
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: 8626 }],
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E0E0E0', space: 4 } },
            }),
          ],
        }),
      },
      children,
    }],
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function buildDoc(options: GenerateDocxOptions): Document {
  if (options.category === 'email') {
    return buildEmailDocument(options);
  }
  return buildDocument(options);
}

export async function generateAndDownloadDocx(options: GenerateDocxOptions): Promise<void> {
  const doc = buildDoc(options);
  const blob = await Packer.toBlob(doc);
  const filename = options.filename || `${options.title.toLowerCase().replace(/\s+/g, '-')}-template.docx`;
  saveAs(blob, filename);
}

export async function generateDocxBlob(options: GenerateDocxOptions): Promise<Blob> {
  const doc = buildDoc(options);
  return Packer.toBlob(doc);
}
