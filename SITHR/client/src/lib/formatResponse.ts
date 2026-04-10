/**
 * Formats system-generated response text for professional HR document context.
 * Runs on every response before rendering AND before storing to Supabase.
 */

const FILLER_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Opening filler phrases - strip entirely
  { pattern: /^[\s]*Certainly[.!,]*\s*/i, replacement: '' },
  { pattern: /^[\s]*Of course[.!,]*\s*/i, replacement: '' },
  { pattern: /^[\s]*Absolutely[.!,]*\s*/i, replacement: '' },
  { pattern: /^[\s]*Sure[.!,]*\s*/i, replacement: '' },
  { pattern: /^[\s]*Great question[.!,]*\s*/i, replacement: '' },
  { pattern: /^[\s]*Good question[.!,]*\s*/i, replacement: '' },
  { pattern: /^[\s]*That's a great question[.!,]*\s*/i, replacement: '' },
  { pattern: /^[\s]*I'd be happy to\s*/i, replacement: '' },
  { pattern: /^[\s]*I'd be glad to\s*/i, replacement: '' },
  { pattern: /^[\s]*I'll analyze\s*/i, replacement: '' },
  { pattern: /^[\s]*I'll examine\s*/i, replacement: '' },
  { pattern: /^[\s]*I'll provide\s*/i, replacement: '' },
  { pattern: /^[\s]*Let me analyze\s*/i, replacement: '' },
  { pattern: /^[\s]*Let me examine\s*/i, replacement: '' },
  { pattern: /^[\s]*Let me help you with\s*/i, replacement: '' },
  { pattern: /^[\s]*Let me break this down\s*/i, replacement: '' },
  { pattern: /^[\s]*This is a complex area[.!,]*\s*/i, replacement: '' },
  // Self-references
  { pattern: /\bAs an AI\b/gi, replacement: 'As a guidance tool' },
  { pattern: /\bAs an artificial intelligence\b/gi, replacement: 'As a guidance tool' },
  { pattern: /\bI'm an AI\b/gi, replacement: 'This is a guidance tool' },
  { pattern: /\bAs a language model\b/gi, replacement: 'As a guidance tool' },
  { pattern: /\bAs a large language model\b/gi, replacement: 'As a guidance tool' },
  { pattern: /\bAI-generated\b/gi, replacement: 'system-generated' },
  { pattern: /\bAI-powered\b/gi, replacement: 'system-powered' },
];

export function formatResponse(text: string): string {
  let result = text;

  // Replace emoji risk indicators with text badges
  result = result.replace(/\u{1F7E2}/gu, '[LOW]');
  result = result.replace(/\u{1F7E0}/gu, '[MEDIUM]');
  result = result.replace(/\u{1F534}\u{1F534}/gu, '[CRITICAL]');
  result = result.replace(/\u{1F534}/gu, '[HIGH]');
  result = result.replace(/\u26A0\uFE0F?/g, '[WARNING]');
  result = result.replace(/\u2705/g, '[YES]');
  result = result.replace(/\u274C/g, '[NO]');

  // Strip ALL remaining emoji and variation selectors
  result = result.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
  result = result.replace(/[\u{2600}-\u{26FF}]/gu, '');
  result = result.replace(/[\u{2700}-\u{27BF}]/gu, '');
  result = result.replace(/[\u{FE00}-\u{FE0F}]/gu, '');
  result = result.replace(/[\u{1F000}-\u{1FFFF}]/gu, '');

  // Replace em-dashes with hyphen-space
  result = result.replace(/\u2014/g, ' - ');

  // Replace en-dashes with hyphen-space
  result = result.replace(/\u2013/g, ' - ');

  // Replace smart/curly quotes with straight quotes
  result = result.replace(/[\u2018\u2019]/g, "'");
  result = result.replace(/[\u201C\u201D]/g, '"');

  // Replace horizontal ellipsis character with three dots
  result = result.replace(/\u2026/g, '...');

  // Strip filler phrases and self-references
  for (const { pattern, replacement } of FILLER_PATTERNS) {
    result = result.replace(pattern, replacement);
  }

  // Strip internal reasoning and process narration
  const internalPhrases = [
    /I need to load my .* skills?[^\n]*/gi,
    /Loading (employment law|HR psychology|my) (skill|knowledge)[^\n]*/gi,
    /Let me (load|check|consult|reference) (my |the )?(skills?|knowledge|framework)[^\n]*/gi,
    /I('ll| will) (analyze|analyse|assess|review) (this|the situation)[^\n]*/gi,
    /Drawing (on|from) (my |the )?(skills?|knowledge|framework)[^\n]*/gi,
    /Based on my (skills?|knowledge|framework|training)[^\n]*/gi,
    /I('ll| will| need to) (apply|use|consult|check) (my |the )?(employment law|HR psychology|skills?)[^\n]*/gi,
    /Let me (apply|address|look at|consider) this[^\n]*/gi,
    /Using (my |the )?(employment law|HR psychology) (skill|framework)[^\n]*/gi,
    /I('ll| will) now (provide|give|offer)[^\n]*/gi,
  ];

  for (const pattern of internalPhrases) {
    result = result.replace(pattern, '');
  }

  // Clean up triple+ blank lines from removals
  result = result.replace(/\n{3,}/g, '\n\n');

  // Clean up double spaces and leading whitespace
  result = result.replace(/  +/g, ' ');
  result = result.replace(/^\s+/, '');

  return result;
}
