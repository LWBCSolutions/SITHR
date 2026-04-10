import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageFooter from './PageFooter';
import { getAuthHeaders } from '../lib/api';

// ============================================================
// STATUTORY RATES - April 2026 (England & Wales)
// Update these annually when new rates are published
// ============================================================

const RATES = {
  // Effective from 6 April 2026
  SSP_WEEKLY_MAX: 123.25,
  SSP_PERCENTAGE: 0.80,
  SSP_QUALIFYING_DAYS: 0,
  REDUNDANCY_WEEKLY_CAP: 751.00,
  REDUNDANCY_MAX_YEARS: 20,
  STATUTORY_ANNUAL_LEAVE_WEEKS: 5.6,
  STATUTORY_ANNUAL_LEAVE_DAYS_FULL_TIME: 28,
  HOLIDAY_ACCRUAL_PERCENTAGE: 12.07,
  NLW_21_PLUS: 12.71,
  NLW_18_TO_20: 10.85,
  NLW_16_TO_17: 8.00,
  NOTICE_MAX_WEEKS: 12,
  // Acas early conciliation
  ACAS_EC_WEEKS: 12,
  ET_LIMITATION_MONTHS: 3,
};

// ============================================================
// TYPES & TOOL DEFINITIONS
// ============================================================

type Category = 'all' | 'calculations' | 'compliance';

type ToolId =
  | 'bradford'
  | 'holiday-1207'
  | 'annual-leave'
  | 'ssp'
  | 'notice'
  | 'redundancy'
  | 'sleep-in'
  | 'absence-cost'
  | 'acas-deadlines'
  | 'oncall-classifier'
  | 'phased-return'
  | 'policy-review';

interface ToolDefinition {
  id: ToolId;
  title: string;
  subtitle: string;
  category: 'calculations' | 'compliance';
  icon: string;
}

const TOOLS: ToolDefinition[] = [
  // -- Calculations --
  {
    id: 'bradford',
    title: 'Bradford Factor',
    subtitle: 'Absence pattern scoring',
    category: 'calculations',
    icon: 'chart',
  },
  {
    id: 'holiday-1207',
    title: '12.07% Holiday',
    subtitle: 'Irregular hours entitlement',
    category: 'calculations',
    icon: 'calendar',
  },
  {
    id: 'annual-leave',
    title: 'Annual Leave',
    subtitle: 'Hours/week x 5.6 with pro-rata',
    category: 'calculations',
    icon: 'calendar',
  },
  {
    id: 'ssp',
    title: 'Statutory Sick Pay',
    subtitle: 'Day-one entitlement, April 2026',
    category: 'calculations',
    icon: 'pound',
  },
  {
    id: 'notice',
    title: 'Notice Period',
    subtitle: 'ERA 1996 s.86 minimums',
    category: 'calculations',
    icon: 'clock',
  },
  {
    id: 'redundancy',
    title: 'Redundancy Pay',
    subtitle: 'Statutory entitlement by age band',
    category: 'calculations',
    icon: 'pound',
  },
  {
    id: 'sleep-in',
    title: 'Sleep-In Pay',
    subtitle: 'NMW compliance for sleep-in shifts',
    category: 'calculations',
    icon: 'pound',
  },
  {
    id: 'absence-cost',
    title: 'Absence Cost',
    subtitle: 'Total cost to the business',
    category: 'calculations',
    icon: 'chart',
  },
  // -- Compliance --
  {
    id: 'acas-deadlines',
    title: 'Acas / Tribunal Deadlines',
    subtitle: 'ET1 limitation and conciliation dates',
    category: 'compliance',
    icon: 'alert',
  },
  {
    id: 'oncall-classifier',
    title: 'On-Call vs Sleep-In',
    subtitle: 'Classify shift type and pay treatment',
    category: 'compliance',
    icon: 'check',
  },
  {
    id: 'phased-return',
    title: 'Phased Return Planner',
    subtitle: 'Week-by-week return-to-work schedule',
    category: 'compliance',
    icon: 'calendar',
  },
  {
    id: 'policy-review',
    title: 'Policy Review',
    subtitle: 'AI compliance review for any sector',
    category: 'compliance',
    icon: 'document',
  },
];

// ============================================================
// ICON COMPONENTS (inline SVGs, no external deps)
// ============================================================

function ToolIcon({ type }: { type: string }) {
  const props = { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (type) {
    case 'chart':
      return <svg {...props}><rect x="2" y="10" width="3" height="8" rx="0.5" /><rect x="8.5" y="5" width="3" height="13" rx="0.5" /><rect x="15" y="2" width="3" height="16" rx="0.5" /></svg>;
    case 'calendar':
      return <svg {...props}><rect x="2" y="4" width="16" height="14" rx="2" /><line x1="2" y1="9" x2="18" y2="9" /><line x1="6" y1="2" x2="6" y2="6" /><line x1="14" y1="2" x2="14" y2="6" /></svg>;
    case 'pound':
      return <svg {...props}><text x="5" y="16" fontSize="16" fontWeight="600" fill="currentColor" stroke="none">&#163;</text></svg>;
    case 'clock':
      return <svg {...props}><circle cx="10" cy="10" r="8" /><polyline points="10,5 10,10 14,12" /></svg>;
    case 'alert':
      return <svg {...props}><path d="M10 2 L18 17 H2 Z" /><line x1="10" y1="8" x2="10" y2="12" /><circle cx="10" cy="15" r="0.5" fill="currentColor" /></svg>;
    case 'check':
      return <svg {...props}><rect x="2" y="2" width="16" height="16" rx="2" /><polyline points="6,10 9,13 14,7" /></svg>;
    case 'document':
      return <svg {...props}><path d="M4 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" /><polyline points="12,2 12,6 16,6" /><line x1="6" y1="10" x2="14" y2="10" /><line x1="6" y1="13" x2="14" y2="13" /><line x1="6" y1="16" x2="10" y2="16" /></svg>;
    default:
      return <svg {...props}><rect x="2" y="2" width="16" height="16" rx="2" /></svg>;
  }
}

// ============================================================
// CALCULATION FUNCTIONS (pure, no side effects)
// ============================================================

function calcBradfordFactor(spells: number, totalDays: number): number {
  return spells * spells * totalDays;
}

function getBradfordBand(score: number): { label: string; colour: string; action: string } {
  if (score === 0) return { label: 'No concern', colour: 'green', action: 'No action required.' };
  if (score <= 50) return { label: 'Low', colour: 'green', action: 'No formal action. Monitor informally.' };
  if (score <= 124) return { label: 'Moderate', colour: 'amber', action: 'Informal conversation recommended. Discuss patterns and offer support.' };
  if (score <= 399) return { label: 'Concern', colour: 'amber', action: 'Formal Stage 1 absence meeting. Issue first written warning if appropriate.' };
  if (score <= 649) return { label: 'Serious', colour: 'red', action: 'Formal Stage 2 absence review. Consider final written warning.' };
  return { label: 'Critical', colour: 'red', action: 'Stage 3 review. Dismissal may be appropriate if process has been followed.' };
}

function calcHoliday1207(hoursWorked: number, hourlyRate: number): {
  holidayHours: number;
  holidayPay: number;
} {
  const holidayHours = hoursWorked * (RATES.HOLIDAY_ACCRUAL_PERCENTAGE / 100);
  const holidayPay = holidayHours * hourlyRate;
  return {
    holidayHours: Math.round(holidayHours * 100) / 100,
    holidayPay: Math.round(holidayPay * 100) / 100,
  };
}

function calcAnnualLeave(
  hoursPerWeek: number,
  isPartYear: boolean,
  startDate: string,
  endDate: string,
  leaveYearStart: string,
  leaveYearEnd: string
): {
  totalEntitlement: number;
  proRataEntitlement: number;
  method: string;
} {
  // Full entitlement = hours per week x 5.6
  const fullEntitlement = Math.round(hoursPerWeek * RATES.STATUTORY_ANNUAL_LEAVE_WEEKS * 100) / 100;

  if (!isPartYear) {
    return {
      totalEntitlement: fullEntitlement,
      proRataEntitlement: fullEntitlement,
      method: `${hoursPerWeek} hrs/week x ${RATES.STATUTORY_ANNUAL_LEAVE_WEEKS} weeks = ${fullEntitlement} hours (full year)`,
    };
  }

  const yearStart = new Date(leaveYearStart);
  const yearEnd = new Date(leaveYearEnd);
  const empStart = new Date(startDate);
  const empEnd = new Date(endDate);

  const totalDaysInYear = Math.round((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
  const effectiveStart = empStart > yearStart ? empStart : yearStart;
  const effectiveEnd = empEnd < yearEnd ? empEnd : yearEnd;
  const workedDays = Math.max(0, Math.round((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)));

  const proRata = (workedDays / totalDaysInYear) * fullEntitlement;
  const rounded = Math.round(proRata * 100) / 100;

  return {
    totalEntitlement: fullEntitlement,
    proRataEntitlement: rounded,
    method: `${workedDays} of ${totalDaysInYear} calendar days = ${((workedDays / totalDaysInYear) * 100).toFixed(1)}% of ${fullEntitlement} hours = ${rounded} hours`,
  };
}

function calcSSP(
  weeklyEarnings: number,
  sickDays: number,
  qualifyingDaysPerWeek: number
): {
  dailyRate: number;
  weeklyRate: number;
  totalPayable: number;
  totalWeeks: number;
  method: string;
} {
  const maxWeeks = 28;
  const weeklyRate = Math.min(weeklyEarnings * RATES.SSP_PERCENTAGE, RATES.SSP_WEEKLY_MAX);
  const dailyRate = weeklyRate / qualifyingDaysPerWeek;
  const maxDays = maxWeeks * qualifyingDaysPerWeek;
  const payableDays = Math.min(sickDays, maxDays);
  const totalPayable = Math.round(dailyRate * payableDays * 100) / 100;
  const totalWeeks = Math.round((payableDays / qualifyingDaysPerWeek) * 100) / 100;

  return {
    dailyRate: Math.round(dailyRate * 100) / 100,
    weeklyRate: Math.round(weeklyRate * 100) / 100,
    totalPayable,
    totalWeeks,
    method: `80% of ${weeklyEarnings.toFixed(2)}/week = ${(weeklyEarnings * RATES.SSP_PERCENTAGE).toFixed(2)} (capped at ${RATES.SSP_WEEKLY_MAX.toFixed(2)}) = ${weeklyRate.toFixed(2)}/week. ${payableDays} qualifying days x ${dailyRate.toFixed(2)}/day = ${totalPayable.toFixed(2)}`,
  };
}

function calcNoticePeriod(yearsOfService: number): {
  weeks: number;
  method: string;
} {
  if (yearsOfService < 1 / 12) {
    return { weeks: 0, method: 'Under 1 month of service - no statutory notice required.' };
  }
  if (yearsOfService < 2) {
    return { weeks: 1, method: '1 month to under 2 years of service - 1 week statutory notice.' };
  }
  const fullYears = Math.floor(yearsOfService);
  const weeks = Math.min(fullYears, RATES.NOTICE_MAX_WEEKS);
  return {
    weeks,
    method: `${fullYears} full years of service - ${weeks} weeks statutory notice (capped at ${RATES.NOTICE_MAX_WEEKS}).`,
  };
}

function calcRedundancyPay(
  age: number,
  yearsOfService: number,
  weeklyPay: number
): {
  totalPay: number;
  weeksEntitlement: number;
  cappedWeeklyPay: number;
  breakdown: string[];
  method: string;
} {
  const cappedWeekly = Math.min(weeklyPay, RATES.REDUNDANCY_WEEKLY_CAP);
  const cappedYears = Math.min(Math.floor(yearsOfService), RATES.REDUNDANCY_MAX_YEARS);

  let totalWeeks = 0;
  const breakdown: string[] = [];

  for (let i = 0; i < cappedYears; i++) {
    const ageInYear = age - i;
    let multiplier: number;
    let label: string;

    if (ageInYear >= 41) {
      multiplier = 1.5;
      label = '1.5 weeks (age 41+)';
    } else if (ageInYear >= 22) {
      multiplier = 1.0;
      label = '1.0 week (age 22-40)';
    } else {
      multiplier = 0.5;
      label = '0.5 week (under 22)';
    }

    totalWeeks += multiplier;
    breakdown.push(`Year ${i + 1} (age ${ageInYear}): ${label}`);
  }

  const totalPay = Math.round(totalWeeks * cappedWeekly * 100) / 100;

  return {
    totalPay,
    weeksEntitlement: totalWeeks,
    cappedWeeklyPay: cappedWeekly,
    breakdown,
    method: `${totalWeeks} weeks x ${cappedWeekly.toFixed(2)}/week = ${totalPay.toFixed(2)}`,
  };
}

// ============================================================
// NEW CALCULATION FUNCTIONS (V2)
// ============================================================

function calcSleepInPay(
  totalShiftHours: number,
  hoursAwakeWorking: number,
  hourlyRate: number
): {
  totalPaid: number;
  nmwRequired: number;
  compliant: boolean;
  shortfall: number;
  method: string;
} {
  const nmwRequired = hoursAwakeWorking * RATES.NLW_21_PLUS;
  const totalPaid = totalShiftHours * hourlyRate;
  const actualPayForWaking = hoursAwakeWorking * hourlyRate;
  const compliant = actualPayForWaking >= nmwRequired;
  const shortfall = compliant ? 0 : Math.round((nmwRequired - actualPayForWaking) * 100) / 100;

  return {
    totalPaid: Math.round(totalPaid * 100) / 100,
    nmwRequired: Math.round(nmwRequired * 100) / 100,
    compliant,
    shortfall,
    method: compliant
      ? `${hoursAwakeWorking}h awake x ${hourlyRate.toFixed(2)}/hr = ${actualPayForWaking.toFixed(2)} (meets NMW of ${nmwRequired.toFixed(2)})`
      : `${hoursAwakeWorking}h awake x ${hourlyRate.toFixed(2)}/hr = ${actualPayForWaking.toFixed(2)} - BELOW NMW of ${nmwRequired.toFixed(2)}. Shortfall: ${shortfall.toFixed(2)}`,
  };
}

function calcAbsenceCost(
  dailySalary: number,
  daysAbsent: number,
  agencyDayRate: number,
  usedAgency: boolean
): {
  salaryCost: number;
  agencyCost: number;
  totalCost: number;
  method: string;
} {
  const salaryCost = Math.round(dailySalary * daysAbsent * 100) / 100;
  const agencyCost = usedAgency ? Math.round(agencyDayRate * daysAbsent * 100) / 100 : 0;
  const totalCost = Math.round((salaryCost + agencyCost) * 100) / 100;

  const method = usedAgency
    ? `Salary: ${daysAbsent} days x ${dailySalary.toFixed(2)} = ${salaryCost.toFixed(2)}. Agency: ${daysAbsent} days x ${agencyDayRate.toFixed(2)} = ${agencyCost.toFixed(2)}. Total: ${totalCost.toFixed(2)}`
    : `Salary: ${daysAbsent} days x ${dailySalary.toFixed(2)} = ${salaryCost.toFixed(2)}. No agency cover costed.`;

  return { salaryCost, agencyCost, totalCost, method };
}

function calcAcasDeadlines(incidentDate: string): {
  lastDayToContactAcas: string;
  ecEndDate: string;
  finalET1Deadline: string;
  method: string;
} | null {
  const incident = new Date(incidentDate);
  if (isNaN(incident.getTime())) return null;

  // 3 months minus 1 day
  const limitDate = new Date(incident);
  limitDate.setMonth(limitDate.getMonth() + 3);
  limitDate.setDate(limitDate.getDate() - 1);

  const lastDayAcas = new Date(limitDate);

  // EC can extend by up to 12 weeks
  const ecEnd = new Date(lastDayAcas);
  ecEnd.setDate(ecEnd.getDate() + (RATES.ACAS_EC_WEEKS * 7));

  const finalDeadline = new Date(ecEnd);
  finalDeadline.setDate(finalDeadline.getDate() + 1);

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  return {
    lastDayToContactAcas: fmt(lastDayAcas),
    ecEndDate: fmt(ecEnd),
    finalET1Deadline: fmt(finalDeadline),
    method: `Incident: ${fmt(incident)}. Limitation (3 months - 1 day): ${fmt(limitDate)}. If Acas contacted on last day, EC can run ${RATES.ACAS_EC_WEEKS} weeks to ${fmt(ecEnd)}. Absolute latest ET1: ${fmt(finalDeadline)}.`,
  };
}

type ShiftClassification = 'on-call-home' | 'on-call-onsite' | 'sleep-in';

function classifyOnCallType(
  requiredOnPremises: boolean,
  expectedToSleep: boolean,
  mostlyUndisturbed: boolean
): {
  classification: ShiftClassification;
  label: string;
  payTreatment: string;
  legalBasis: string;
} {
  if (!requiredOnPremises) {
    return {
      classification: 'on-call-home',
      label: 'On-call (at home)',
      payTreatment: 'Not working time for NMW unless actually called out. Only time spent responding to calls counts toward NMW.',
      legalBasis: 'Regulation 15(1A) NMW Regs 2015 - worker available at or near place of work vs at home.',
    };
  }

  if (expectedToSleep && mostlyUndisturbed) {
    return {
      classification: 'sleep-in',
      label: 'Sleep-in shift',
      payTreatment: 'Only hours spent awake for the purposes of working count toward NMW. Hours asleep do not count. Flat-rate allowances are common but must not result in NMW breach for waking hours.',
      legalBasis: 'Royal Mencap Society v Tomlinson-Blake [2021] UKSC 8. NMW Regs 2015 reg 32.',
    };
  }

  return {
    classification: 'on-call-onsite',
    label: 'On-call (on-site, awake)',
    payTreatment: 'All hours count as working time for NMW purposes. Must be paid at least NMW for every hour on duty.',
    legalBasis: 'NMW Regs 2015 reg 32 - worker required to be available at place of work and not sleeping.',
  };
}

function calcPhasedReturn(
  contractedHoursPerWeek: number,
  numberOfWeeks: number,
  startPercentage: number
): {
  schedule: { week: number; percentage: number; hours: number }[];
  method: string;
} {
  const schedule: { week: number; percentage: number; hours: number }[] = [];
  const increment = (100 - startPercentage) / (numberOfWeeks - 1 || 1);

  for (let i = 0; i < numberOfWeeks; i++) {
    const pct = Math.min(100, Math.round(startPercentage + increment * i));
    const hrs = Math.round((contractedHoursPerWeek * pct / 100) * 10) / 10;
    schedule.push({ week: i + 1, percentage: pct, hours: hrs });
  }

  // Ensure last week is always 100%
  if (schedule.length > 0) {
    schedule[schedule.length - 1].percentage = 100;
    schedule[schedule.length - 1].hours = contractedHoursPerWeek;
  }

  return {
    schedule,
    method: `Phased return from ${startPercentage}% to 100% over ${numberOfWeeks} weeks. Contracted hours: ${contractedHoursPerWeek}h/week.`,
  };
}

// ============================================================
// CALCULATOR UI COMPONENTS - Original 6
// ============================================================

function BradfordCalculator() {
  const [spells, setSpells] = useState('');
  const [days, setDays] = useState('');
  const [result, setResult] = useState<{ score: number; band: ReturnType<typeof getBradfordBand> } | null>(null);

  const calculate = () => {
    const s = parseInt(spells, 10);
    const d = parseInt(days, 10);
    if (isNaN(s) || isNaN(d) || s < 0 || d < 0) return;
    const score = calcBradfordFactor(s, d);
    setResult({ score, band: getBradfordBand(score) });
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="bf-spells">
            Number of separate absence spells (S)
          </label>
          <input
            id="bf-spells"
            className="tool-calc__input"
            type="number"
            min="0"
            step="1"
            value={spells}
            onChange={(e) => setSpells(e.target.value)}
            placeholder="e.g. 4"
          />
          <p className="tool-calc__help">Each separate occasion of absence in a rolling 12-month period</p>
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="bf-days">
            Total days absent (D)
          </label>
          <input
            id="bf-days"
            className="tool-calc__input"
            type="number"
            min="0"
            step="1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="e.g. 10"
          />
          <p className="tool-calc__help">Total calendar/working days absent across all spells</p>
        </div>
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!spells || !days}>
        Calculate
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className="tool-calc__score">
            <span className="tool-calc__score-label">Bradford Factor Score</span>
            <span className={`tool-calc__score-value tool-calc__score-value--${result.band.colour}`}>
              {result.score.toLocaleString()}
            </span>
          </div>
          <div className="tool-calc__formula">
            S x S x D = {spells} x {spells} x {days} = {result.score.toLocaleString()}
          </div>
          <div className={`tool-calc__band tool-calc__band--${result.band.colour}`}>
            <span className="tool-calc__band-label">{result.band.label}</span>
            <span className="tool-calc__band-action">{result.band.action}</span>
          </div>
          <div className="tool-calc__reference">
            <p className="tool-calc__ref-title">Typical trigger points</p>
            <div className="tool-calc__ref-grid">
              <span className="tool-calc__ref-score tool-calc__ref-score--green">0-50</span>
              <span>No action</span>
              <span className="tool-calc__ref-score tool-calc__ref-score--amber">51-124</span>
              <span>Informal conversation</span>
              <span className="tool-calc__ref-score tool-calc__ref-score--amber">125-399</span>
              <span>Stage 1 formal meeting</span>
              <span className="tool-calc__ref-score tool-calc__ref-score--red">400-649</span>
              <span>Stage 2 final warning</span>
              <span className="tool-calc__ref-score tool-calc__ref-score--red">650+</span>
              <span>Stage 3 dismissal review</span>
            </div>
            <p className="tool-calc__disclaimer">These are indicative thresholds only. Your organisation should set its own trigger points in its absence policy. Disability-related absences may require adjusted thresholds under the Equality Act 2010.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Holiday1207Calculator() {
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcHoliday1207> | null>(null);

  const calculate = () => {
    const h = parseFloat(hours);
    const r = parseFloat(rate);
    if (isNaN(h) || isNaN(r) || h < 0 || r < 0) return;
    setResult(calcHoliday1207(h, r));
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="h1207-hours">
            Total hours worked in pay period
          </label>
          <input
            id="h1207-hours"
            className="tool-calc__input"
            type="number"
            min="0"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 520"
          />
          <p className="tool-calc__help">Total hours actually worked (exclude holiday hours already taken)</p>
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="h1207-rate">
            Hourly rate (GBP)
          </label>
          <input
            id="h1207-rate"
            className="tool-calc__input"
            type="number"
            min="0"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 12.71"
          />
          <p className="tool-calc__help">Current hourly pay rate. NLW (21+) from April 2026: {RATES.NLW_21_PLUS.toFixed(2)}/hr</p>
        </div>
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!hours || !rate}>
        Calculate
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Holiday hours accrued</span>
            <span className="tool-calc__result-value">{result.holidayHours.toFixed(2)} hours</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Holiday pay value</span>
            <span className="tool-calc__result-value tool-calc__result-value--highlight">{result.holidayPay.toFixed(2)}</span>
          </div>
          <div className="tool-calc__formula">
            {hours} hours x 12.07% = {result.holidayHours.toFixed(2)} holiday hours x {parseFloat(rate).toFixed(2)}/hr = {result.holidayPay.toFixed(2)}
          </div>
          <p className="tool-calc__disclaimer">The 12.07% method is the statutory accrual method for irregular hours and part-year workers under the Working Time Regulations (as amended from January 2024). It applies to each pay period separately.</p>
        </div>
      )}
    </div>
  );
}

function AnnualLeaveCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState('37.5');
  const [isPartYear, setIsPartYear] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveYearStart, setLeaveYearStart] = useState('2026-04-01');
  const [leaveYearEnd, setLeaveYearEnd] = useState('2027-03-31');
  const [result, setResult] = useState<ReturnType<typeof calcAnnualLeave> | null>(null);

  const calculate = () => {
    const h = parseFloat(hoursPerWeek);
    if (isNaN(h) || h <= 0 || h > 168) return;
    if (isPartYear && (!startDate || !endDate)) return;
    setResult(calcAnnualLeave(
      h, isPartYear,
      isPartYear ? startDate : leaveYearStart,
      isPartYear ? endDate : leaveYearEnd,
      leaveYearStart, leaveYearEnd
    ));
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="al-hours">
            Hours worked per week
          </label>
          <input
            id="al-hours"
            className="tool-calc__input"
            type="number"
            min="0.5"
            max="168"
            step="0.5"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            placeholder="e.g. 37.5"
          />
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label tool-calc__label--checkbox">
            <input
              type="checkbox"
              checked={isPartYear}
              onChange={(e) => setIsPartYear(e.target.checked)}
            />
            Starter or leaver mid-year (pro-rata)
          </label>
        </div>
        {isPartYear && (
          <>
            <div className="tool-calc__field">
              <label className="tool-calc__label" htmlFor="al-start">
                Employment start date
              </label>
              <input id="al-start" className="tool-calc__input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="tool-calc__field">
              <label className="tool-calc__label" htmlFor="al-end">
                Employment end date
              </label>
              <input id="al-end" className="tool-calc__input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="tool-calc__field-row">
              <div className="tool-calc__field">
                <label className="tool-calc__label" htmlFor="al-ly-start">Leave year starts</label>
                <input id="al-ly-start" className="tool-calc__input" type="date" value={leaveYearStart} onChange={(e) => setLeaveYearStart(e.target.value)} />
              </div>
              <div className="tool-calc__field">
                <label className="tool-calc__label" htmlFor="al-ly-end">Leave year ends</label>
                <input id="al-ly-end" className="tool-calc__input" type="date" value={leaveYearEnd} onChange={(e) => setLeaveYearEnd(e.target.value)} />
              </div>
            </div>
          </>
        )}
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!hoursPerWeek || (isPartYear && (!startDate || !endDate))}>
        Calculate
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Full-year entitlement</span>
            <span className="tool-calc__result-value">{result.totalEntitlement} hours</span>
          </div>
          {isPartYear && (
            <div className="tool-calc__result-row">
              <span className="tool-calc__result-label">Pro-rata entitlement</span>
              <span className="tool-calc__result-value tool-calc__result-value--highlight">{result.proRataEntitlement} hours</span>
            </div>
          )}
          <div className="tool-calc__formula">{result.method}</div>
          <p className="tool-calc__disclaimer">Statutory minimum under the Working Time Regulations 1998. Entitlement = weekly hours x 5.6 weeks. Employers may offer more generous terms. Bank holidays can be included in the statutory minimum.</p>
        </div>
      )}
    </div>
  );
}

function SSPCalculator() {
  const [weeklyPay, setWeeklyPay] = useState('');
  const [sickDays, setSickDays] = useState('');
  const [qualDays, setQualDays] = useState('5');
  const [result, setResult] = useState<ReturnType<typeof calcSSP> | null>(null);

  const calculate = () => {
    const w = parseFloat(weeklyPay);
    const s = parseInt(sickDays, 10);
    const q = parseInt(qualDays, 10);
    if (isNaN(w) || isNaN(s) || isNaN(q) || w < 0 || s < 0 || q < 1 || q > 7) return;
    setResult(calcSSP(w, s, q));
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="ssp-pay">
            Average weekly earnings (GBP)
          </label>
          <input
            id="ssp-pay"
            className="tool-calc__input"
            type="number"
            min="0"
            step="0.01"
            value={weeklyPay}
            onChange={(e) => setWeeklyPay(e.target.value)}
            placeholder="e.g. 450.00"
          />
          <p className="tool-calc__help">Average over the 8-week reference period before the sickness started</p>
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="ssp-days">
            Total qualifying sick days
          </label>
          <input
            id="ssp-days"
            className="tool-calc__input"
            type="number"
            min="0"
            step="1"
            value={sickDays}
            onChange={(e) => setSickDays(e.target.value)}
            placeholder="e.g. 15"
          />
          <p className="tool-calc__help">Days the employee would normally work during the sickness period</p>
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="ssp-qual">
            Qualifying days per week
          </label>
          <select
            id="ssp-qual"
            className="tool-calc__select"
            value={qualDays}
            onChange={(e) => setQualDays(e.target.value)}
          >
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <option key={n} value={n}>{n} day{n !== 1 ? 's' : ''}/week</option>
            ))}
          </select>
        </div>
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!weeklyPay || !sickDays}>
        Calculate
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">SSP weekly rate</span>
            <span className="tool-calc__result-value">{result.weeklyRate.toFixed(2)}/week</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">SSP daily rate</span>
            <span className="tool-calc__result-value">{result.dailyRate.toFixed(2)}/day</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Total SSP payable</span>
            <span className="tool-calc__result-value tool-calc__result-value--highlight">{result.totalPayable.toFixed(2)}</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Duration</span>
            <span className="tool-calc__result-value">{result.totalWeeks} weeks</span>
          </div>
          <div className="tool-calc__formula">{result.method}</div>
          <p className="tool-calc__disclaimer">From 6 April 2026: SSP is 80% of average weekly earnings, capped at {RATES.SSP_WEEKLY_MAX.toFixed(2)}/week. Day-one entitlement (no waiting days). No lower earnings limit. Maximum 28 weeks per period of incapacity.</p>
        </div>
      )}
    </div>
  );
}

function NoticeCalculator() {
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('0');
  const [result, setResult] = useState<ReturnType<typeof calcNoticePeriod> | null>(null);

  const calculate = () => {
    const y = parseInt(years, 10) || 0;
    const m = parseInt(months, 10) || 0;
    const totalYears = y + m / 12;
    if (totalYears < 0) return;
    setResult(calcNoticePeriod(totalYears));
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field-row">
          <div className="tool-calc__field">
            <label className="tool-calc__label" htmlFor="np-years">
              Complete years of service
            </label>
            <input
              id="np-years"
              className="tool-calc__input"
              type="number"
              min="0"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>
          <div className="tool-calc__field">
            <label className="tool-calc__label" htmlFor="np-months">
              Additional months
            </label>
            <select
              id="np-months"
              className="tool-calc__select"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{i} month{i !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!years && months === '0'}>
        Calculate
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Statutory minimum notice</span>
            <span className="tool-calc__result-value tool-calc__result-value--highlight">
              {result.weeks} week{result.weeks !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="tool-calc__formula">{result.method}</div>
          <p className="tool-calc__disclaimer">ERA 1996 s.86. This is the statutory minimum. The contract of employment may specify a longer notice period which takes precedence. The employee's statutory minimum notice to the employer is always 1 week (after 1 month of service).</p>
        </div>
      )}
    </div>
  );
}

function RedundancyCalculator() {
  const [age, setAge] = useState('');
  const [years, setYears] = useState('');
  const [weeklyPay, setWeeklyPay] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calcRedundancyPay> | null>(null);

  const calculate = () => {
    const a = parseInt(age, 10);
    const y = parseInt(years, 10);
    const w = parseFloat(weeklyPay);
    if (isNaN(a) || isNaN(y) || isNaN(w) || a < 16 || y < 2 || w < 0) return;
    setResult(calcRedundancyPay(a, y, w));
    setShowBreakdown(false);
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="rp-age">
            Employee's age at redundancy date
          </label>
          <input
            id="rp-age"
            className="tool-calc__input"
            type="number"
            min="16"
            max="100"
            step="1"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 45"
          />
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="rp-years">
            Complete years of continuous service
          </label>
          <input
            id="rp-years"
            className="tool-calc__input"
            type="number"
            min="2"
            max="50"
            step="1"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="e.g. 8"
          />
          <p className="tool-calc__help">Minimum 2 years continuous service required</p>
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="rp-pay">
            Gross weekly pay (GBP)
          </label>
          <input
            id="rp-pay"
            className="tool-calc__input"
            type="number"
            min="0"
            step="0.01"
            value={weeklyPay}
            onChange={(e) => setWeeklyPay(e.target.value)}
            placeholder="e.g. 600.00"
          />
          <p className="tool-calc__help">
            Capped at {RATES.REDUNDANCY_WEEKLY_CAP.toFixed(2)}/week from April 2026.
            {weeklyPay && parseFloat(weeklyPay) > RATES.REDUNDANCY_WEEKLY_CAP
              ? ` Your figure will be capped to ${RATES.REDUNDANCY_WEEKLY_CAP.toFixed(2)}.`
              : ''}
          </p>
        </div>
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!age || !years || !weeklyPay || parseInt(years, 10) < 2}>
        Calculate
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Statutory redundancy pay</span>
            <span className="tool-calc__result-value tool-calc__result-value--highlight">{result.totalPay.toFixed(2)}</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Weeks' pay entitlement</span>
            <span className="tool-calc__result-value">{result.weeksEntitlement} weeks</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Capped weekly pay used</span>
            <span className="tool-calc__result-value">{result.cappedWeeklyPay.toFixed(2)}/week</span>
          </div>
          <div className="tool-calc__formula">{result.method}</div>
          <button
            className="tool-calc__toggle-btn"
            onClick={() => setShowBreakdown(!showBreakdown)}
          >
            {showBreakdown ? 'Hide' : 'Show'} year-by-year breakdown
          </button>
          {showBreakdown && (
            <div className="tool-calc__breakdown">
              {result.breakdown.map((line, i) => (
                <div key={i} className="tool-calc__breakdown-row">{line}</div>
              ))}
            </div>
          )}
          <p className="tool-calc__disclaimer">ERA 1996 ss.135-165. Statutory redundancy pay is tax-free up to 30,000. Maximum 20 years of service counted. Weekly pay cap from 6 April 2026: {RATES.REDUNDANCY_WEEKLY_CAP.toFixed(2)}.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CALCULATOR UI COMPONENTS - New 5
// ============================================================

function SleepInCalculator() {
  const [totalHours, setTotalHours] = useState('');
  const [awakeHours, setAwakeHours] = useState('');
  const [rate, setRate] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcSleepInPay> | null>(null);

  const calculate = () => {
    const t = parseFloat(totalHours);
    const a = parseFloat(awakeHours);
    const r = parseFloat(rate);
    if (isNaN(t) || isNaN(a) || isNaN(r) || t < 0 || a < 0 || r < 0 || a > t) return;
    setResult(calcSleepInPay(t, a, r));
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="si-total">
            Total shift hours
          </label>
          <input
            id="si-total"
            className="tool-calc__input"
            type="number"
            min="0"
            step="0.5"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            placeholder="e.g. 9"
          />
          <p className="tool-calc__help">Full duration of the sleep-in shift (e.g. 10pm to 7am = 9 hours)</p>
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="si-awake">
            Hours spent awake and working
          </label>
          <input
            id="si-awake"
            className="tool-calc__input"
            type="number"
            min="0"
            step="0.5"
            value={awakeHours}
            onChange={(e) => setAwakeHours(e.target.value)}
            placeholder="e.g. 2"
          />
          <p className="tool-calc__help">Time actually awake for the purposes of working (responding to calls, incidents, etc.)</p>
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="si-rate">
            Hourly rate paid (GBP)
          </label>
          <input
            id="si-rate"
            className="tool-calc__input"
            type="number"
            min="0"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 11.50"
          />
          <p className="tool-calc__help">Actual hourly rate for this shift. NLW (21+): {RATES.NLW_21_PLUS.toFixed(2)}/hr</p>
        </div>
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!totalHours || !awakeHours || !rate}>
        Calculate
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className={`tool-calc__band tool-calc__band--${result.compliant ? 'green' : 'red'}`}>
            <span className="tool-calc__band-label">
              {result.compliant ? 'NMW Compliant' : 'NMW Breach - Shortfall Detected'}
            </span>
            <span className="tool-calc__band-action">
              {result.compliant
                ? 'Pay for waking hours meets or exceeds the National Minimum Wage.'
                : `The worker is being underpaid by ${result.shortfall.toFixed(2)} for their waking hours. Immediate action required.`}
            </span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Total shift pay</span>
            <span className="tool-calc__result-value">{result.totalPaid.toFixed(2)}</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">NMW required for waking hours</span>
            <span className="tool-calc__result-value">{result.nmwRequired.toFixed(2)}</span>
          </div>
          {!result.compliant && (
            <div className="tool-calc__result-row">
              <span className="tool-calc__result-label">Shortfall</span>
              <span className="tool-calc__result-value tool-calc__result-value--highlight" style={{ color: '#A32D2D' }}>{result.shortfall.toFixed(2)}</span>
            </div>
          )}
          <div className="tool-calc__formula">{result.method}</div>
          <p className="tool-calc__disclaimer">Based on Royal Mencap Society v Tomlinson-Blake [2021] UKSC 8. Only hours spent awake for the purposes of working count toward NMW during a sleep-in shift. Flat-rate allowances are lawful provided NMW is met for all waking work hours.</p>
        </div>
      )}
    </div>
  );
}

function AbsenceCostCalculator() {
  const [dailySalary, setDailySalary] = useState('');
  const [daysAbsent, setDaysAbsent] = useState('');
  const [usedAgency, setUsedAgency] = useState(false);
  const [agencyRate, setAgencyRate] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcAbsenceCost> | null>(null);

  const calculate = () => {
    const ds = parseFloat(dailySalary);
    const da = parseInt(daysAbsent, 10);
    const ar = usedAgency ? parseFloat(agencyRate) : 0;
    if (isNaN(ds) || isNaN(da) || ds < 0 || da < 0) return;
    if (usedAgency && (isNaN(ar) || ar < 0)) return;
    setResult(calcAbsenceCost(ds, da, ar, usedAgency));
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="ac-salary">
            Employee daily salary cost (GBP)
          </label>
          <input
            id="ac-salary"
            className="tool-calc__input"
            type="number"
            min="0"
            step="0.01"
            value={dailySalary}
            onChange={(e) => setDailySalary(e.target.value)}
            placeholder="e.g. 95.00"
          />
          <p className="tool-calc__help">Gross daily pay (annual salary / 260 working days, or hourly rate x hours)</p>
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="ac-days">
            Days absent
          </label>
          <input
            id="ac-days"
            className="tool-calc__input"
            type="number"
            min="0"
            step="1"
            value={daysAbsent}
            onChange={(e) => setDaysAbsent(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="tool-calc__field">
          <label className="tool-calc__label tool-calc__label--checkbox">
            <input
              type="checkbox"
              checked={usedAgency}
              onChange={(e) => setUsedAgency(e.target.checked)}
            />
            Agency/overtime cover was used
          </label>
        </div>
        {usedAgency && (
          <div className="tool-calc__field">
            <label className="tool-calc__label" htmlFor="ac-agency">
              Agency/overtime day rate (GBP)
            </label>
            <input
              id="ac-agency"
              className="tool-calc__input"
              type="number"
              min="0"
              step="0.01"
              value={agencyRate}
              onChange={(e) => setAgencyRate(e.target.value)}
              placeholder="e.g. 180.00"
            />
          </div>
        )}
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!dailySalary || !daysAbsent}>
        Calculate
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Salary cost (paid during absence)</span>
            <span className="tool-calc__result-value">{result.salaryCost.toFixed(2)}</span>
          </div>
          {usedAgency && (
            <div className="tool-calc__result-row">
              <span className="tool-calc__result-label">Agency/cover cost</span>
              <span className="tool-calc__result-value">{result.agencyCost.toFixed(2)}</span>
            </div>
          )}
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Total cost to business</span>
            <span className="tool-calc__result-value tool-calc__result-value--highlight">{result.totalCost.toFixed(2)}</span>
          </div>
          <div className="tool-calc__formula">{result.method}</div>
          <p className="tool-calc__disclaimer">This is a simplified cost model covering direct salary and cover costs. It does not include indirect costs such as reduced team productivity, management time, recruitment, or training. CIPD estimates the true cost of absence at 1.5-2x the direct figure.</p>
        </div>
      )}
    </div>
  );
}

function AcasDeadlineCalculator() {
  const [incidentDate, setIncidentDate] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcAcasDeadlines>>(null);

  const calculate = () => {
    if (!incidentDate) return;
    setResult(calcAcasDeadlines(incidentDate));
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="acas-date">
            Date of act complained of
          </label>
          <input
            id="acas-date"
            className="tool-calc__input"
            type="date"
            value={incidentDate}
            onChange={(e) => setIncidentDate(e.target.value)}
          />
          <p className="tool-calc__help">The date the event happened (dismissal, last act of discrimination, deduction from wages, etc.)</p>
        </div>
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!incidentDate}>
        Calculate
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className={`tool-calc__band tool-calc__band--amber`}>
            <span className="tool-calc__band-label">Key Deadlines</span>
            <span className="tool-calc__band-action">These are the latest possible dates. Claimants should act as early as possible.</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Last day to contact Acas</span>
            <span className="tool-calc__result-value">{result.lastDayToContactAcas}</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">EC period ends (if full 12 weeks)</span>
            <span className="tool-calc__result-value">{result.ecEndDate}</span>
          </div>
          <div className="tool-calc__result-row">
            <span className="tool-calc__result-label">Absolute latest ET1 deadline</span>
            <span className="tool-calc__result-value tool-calc__result-value--highlight">{result.finalET1Deadline}</span>
          </div>
          <div className="tool-calc__formula">{result.method}</div>
          <p className="tool-calc__disclaimer">Limitation period: 3 months minus 1 day from the act complained of (ERA 1996, Equality Act 2010). Early conciliation pauses the clock for up to 12 weeks (extended from 6 weeks, December 2025). This calculator shows the maximum extension scenario. Actual deadlines depend on when Acas is contacted and when the EC certificate is issued. Always seek legal advice for specific cases.</p>
        </div>
      )}
    </div>
  );
}

function OnCallClassifier() {
  const [onPremises, setOnPremises] = useState<boolean | null>(null);
  const [expectedSleep, setExpectedSleep] = useState<boolean | null>(null);
  const [undisturbed, setUndisturbed] = useState<boolean | null>(null);
  const [result, setResult] = useState<ReturnType<typeof classifyOnCallType> | null>(null);

  const calculate = () => {
    if (onPremises === null) return;
    if (onPremises && expectedSleep === null) return;
    if (onPremises && expectedSleep && undisturbed === null) return;
    setResult(classifyOnCallType(onPremises, expectedSleep ?? false, undisturbed ?? false));
  };

  const reset = () => {
    setOnPremises(null);
    setExpectedSleep(null);
    setUndisturbed(null);
    setResult(null);
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <p className="tool-calc__label">Is the worker required to be on the employer's premises?</p>
          <div className="tool-calc__radio-row">
            <label className="tool-calc__radio-label">
              <input type="radio" name="oc-premises" checked={onPremises === true} onChange={() => { setOnPremises(true); setResult(null); }} /> Yes
            </label>
            <label className="tool-calc__radio-label">
              <input type="radio" name="oc-premises" checked={onPremises === false} onChange={() => { setOnPremises(false); setExpectedSleep(null); setUndisturbed(null); setResult(null); }} /> No (at home)
            </label>
          </div>
        </div>
        {onPremises && (
          <div className="tool-calc__field">
            <p className="tool-calc__label">Is the worker expected to sleep during the shift?</p>
            <div className="tool-calc__radio-row">
              <label className="tool-calc__radio-label">
                <input type="radio" name="oc-sleep" checked={expectedSleep === true} onChange={() => { setExpectedSleep(true); setResult(null); }} /> Yes
              </label>
              <label className="tool-calc__radio-label">
                <input type="radio" name="oc-sleep" checked={expectedSleep === false} onChange={() => { setExpectedSleep(false); setUndisturbed(null); setResult(null); }} /> No (awake throughout)
              </label>
            </div>
          </div>
        )}
        {onPremises && expectedSleep && (
          <div className="tool-calc__field">
            <p className="tool-calc__label">Is the worker mostly undisturbed during the night?</p>
            <div className="tool-calc__radio-row">
              <label className="tool-calc__radio-label">
                <input type="radio" name="oc-undisturbed" checked={undisturbed === true} onChange={() => { setUndisturbed(true); setResult(null); }} /> Yes
              </label>
              <label className="tool-calc__radio-label">
                <input type="radio" name="oc-undisturbed" checked={undisturbed === false} onChange={() => { setUndisturbed(false); setResult(null); }} /> No (frequently disturbed)
              </label>
            </div>
          </div>
        )}
      </div>
      <div className="tool-calc__btn-row">
        <button className="tool-calc__btn" onClick={calculate} disabled={onPremises === null || !!(onPremises && expectedSleep === null) || !!(onPremises && expectedSleep && undisturbed === null)}>
          Classify
        </button>
        <button className="tool-calc__btn tool-calc__btn--secondary" onClick={reset}>
          Reset
        </button>
      </div>
      {result && (
        <div className="tool-calc__result">
          <div className={`tool-calc__band tool-calc__band--${result.classification === 'on-call-home' ? 'green' : result.classification === 'sleep-in' ? 'amber' : 'red'}`}>
            <span className="tool-calc__band-label">{result.label}</span>
          </div>
          <div className="tool-calc__classification-detail">
            <p className="tool-calc__classification-heading">Pay treatment</p>
            <p className="tool-calc__classification-text">{result.payTreatment}</p>
            <p className="tool-calc__classification-heading">Legal basis</p>
            <p className="tool-calc__classification-text">{result.legalBasis}</p>
          </div>
          <p className="tool-calc__disclaimer">This is a general classification tool. The actual determination depends on the specific facts of each case. Where shift patterns are ambiguous, seek legal advice. Misclassification can lead to back-pay claims under the NMW Regulations 2015.</p>
        </div>
      )}
    </div>
  );
}

function PhasedReturnCalculator() {
  const [hours, setHours] = useState('');
  const [weeks, setWeeks] = useState('4');
  const [startPct, setStartPct] = useState('50');
  const [result, setResult] = useState<ReturnType<typeof calcPhasedReturn> | null>(null);

  const calculate = () => {
    const h = parseFloat(hours);
    const w = parseInt(weeks, 10);
    const s = parseInt(startPct, 10);
    if (isNaN(h) || isNaN(w) || isNaN(s) || h <= 0 || w < 2 || w > 12 || s < 10 || s > 90) return;
    setResult(calcPhasedReturn(h, w, s));
  };

  return (
    <div className="tool-calculator">
      <div className="tool-calc__fields">
        <div className="tool-calc__field">
          <label className="tool-calc__label" htmlFor="pr-hours">
            Contracted hours per week
          </label>
          <input
            id="pr-hours"
            className="tool-calc__input"
            type="number"
            min="1"
            max="60"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 37.5"
          />
        </div>
        <div className="tool-calc__field-row">
          <div className="tool-calc__field">
            <label className="tool-calc__label" htmlFor="pr-weeks">
              Number of return weeks
            </label>
            <select
              id="pr-weeks"
              className="tool-calc__select"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
            >
              {[2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                <option key={n} value={n}>{n} weeks</option>
              ))}
            </select>
          </div>
          <div className="tool-calc__field">
            <label className="tool-calc__label" htmlFor="pr-start">
              Starting percentage
            </label>
            <select
              id="pr-start"
              className="tool-calc__select"
              value={startPct}
              onChange={(e) => setStartPct(e.target.value)}
            >
              {[25, 30, 40, 50, 60, 70, 75].map(n => (
                <option key={n} value={n}>{n}%</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button className="tool-calc__btn" onClick={calculate} disabled={!hours}>
        Generate Schedule
      </button>
      {result && (
        <div className="tool-calc__result">
          <div className="tool-calc__schedule">
            <div className="tool-calc__schedule-header">
              <span>Week</span>
              <span>Percentage</span>
              <span>Hours</span>
            </div>
            {result.schedule.map((row) => (
              <div key={row.week} className="tool-calc__schedule-row">
                <span>Week {row.week}</span>
                <span>{row.percentage}%</span>
                <span>{row.hours}h</span>
              </div>
            ))}
          </div>
          <div className="tool-calc__formula">{result.method}</div>
          <p className="tool-calc__disclaimer">A phased return should be agreed in line with the fit note and occupational health recommendations. The schedule above is a starting point - adjust based on the employee's role, restrictions, and progress. There is no statutory right to a phased return, but the duty to make reasonable adjustments under the Equality Act 2010 may require one for disabled employees.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// POLICY REVIEW TOOL (AI-powered, requires backend)
// ============================================================

function PolicyReviewTool() {
  const [file, setFile] = useState<File | null>(null);
  const [orgType, setOrgType] = useState('sme-general');
  const [staffCount, setStaffCount] = useState('');
  const [concerns, setConcerns] = useState('');
  const [agreedWays, setAgreedWays] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const reviewRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }

    setFile(selected);
    setError('');
    setReview('');
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setExtracting(true);
    setError('');
    setReview('');

    try {
      // Step 1: Extract text from the uploaded document
      const formData = new FormData();
      formData.append('file', file);

      const extractRes = await fetch('/api/extract-document', {
        method: 'POST',
        body: formData,
      });

      if (!extractRes.ok) {
        throw new Error('Failed to extract document text. Please try a different file.');
      }

      const { text: documentText } = await extractRes.json();
      setExtracting(false);

      if (!documentText || documentText.trim().length < 50) {
        throw new Error('Could not extract enough text from the document. Please check the file is not empty or image-only.');
      }

      // Step 2: Send to policy review API (streaming)
      const headers = await getAuthHeaders();
      const response = await fetch('/api/policy-review', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentText,
          fileName: file.name,
          context: {
            orgType,
            staffCount: staffCount || 'Not specified',
            concerns: concerns || 'None specified',
            agreedWays: agreedWays || 'None specified',
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Policy review failed. Please try again.');
      }

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response stream.');

      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content') {
                fullText += parsed.text;
                setReview(fullText);
              } else if (parsed.type === 'error') {
                throw new Error(parsed.message || 'Review failed.');
              }
            } catch (parseErr) {
              // Skip non-JSON lines
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
      setExtracting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setReview('');
    setError('');
    setLoading(false);
    setExtracting(false);
  };

  return (
    <div className="tool-calculator">
      {!review ? (
        <>
          <div className="tool-calc__fields">
            <div className="tool-calc__field">
              <label className="tool-calc__label" htmlFor="pr-file">
                Upload your policy document
              </label>
              <div className="policy-upload-zone">
                <input
                  id="pr-file"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="policy-upload-input"
                />
                <div className="policy-upload-content">
                  {file ? (
                    <div className="policy-upload-selected">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" />
                        <polyline points="12,2 12,6 16,6" />
                      </svg>
                      <span className="policy-upload-filename">{file.name}</span>
                      <span className="policy-upload-size">({(file.size / 1024).toFixed(0)}KB)</span>
                    </div>
                  ) : (
                    <div className="policy-upload-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>Drop a PDF or DOCX here, or click to browse</span>
                      <span className="policy-upload-hint">Max 10MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              className="policy-context-toggle"
              onClick={() => setShowContext(!showContext)}
              type="button"
            >
              <span>{showContext ? 'Hide' : 'Add'} organisation context</span>
              <span className="policy-context-optional">(optional - improves review accuracy)</span>
              <svg
                className={`tool-card__chevron ${showContext ? 'tool-card__chevron--open' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="6,8 10,12 14,8" />
              </svg>
            </button>

            {showContext && (
              <div className="policy-context-fields">
                <div className="tool-calc__field">
                  <label className="tool-calc__label" htmlFor="pr-org">Organisation type</label>
                  <select
                    id="pr-org"
                    className="tool-calc__select"
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value)}
                  >
                    <optgroup label="General">
                      <option value="sme-general">SME (general)</option>
                      <option value="startup">Startup / early stage</option>
                      <option value="charity">Charity / not-for-profit</option>
                    </optgroup>
                    <optgroup label="Care and support">
                      <option value="care-home">Care home (residential)</option>
                      <option value="domiciliary">Domiciliary care</option>
                      <option value="supported-living">Supported living</option>
                      <option value="day-services">Day services</option>
                      <option value="nursing-home">Nursing home</option>
                    </optgroup>
                    <optgroup label="Hospitality and retail">
                      <option value="hospitality">Hospitality / restaurant / hotel</option>
                      <option value="retail">Retail</option>
                      <option value="leisure">Leisure / gym / events</option>
                    </optgroup>
                    <optgroup label="Construction and trades">
                      <option value="construction">Construction / building</option>
                      <option value="trades">Trades / plumbing / electrical</option>
                      <option value="manufacturing">Manufacturing / warehouse</option>
                    </optgroup>
                    <optgroup label="Professional services">
                      <option value="office">Office / professional services</option>
                      <option value="tech">Technology / software</option>
                      <option value="finance">Finance / accounting</option>
                      <option value="legal">Legal</option>
                    </optgroup>
                    <optgroup label="Education and childcare">
                      <option value="education">Education / school / college</option>
                      <option value="childcare">Childcare / nursery</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value="transport">Transport / logistics</option>
                      <option value="agriculture">Agriculture / farming</option>
                      <option value="other">Other</option>
                    </optgroup>
                  </select>
                </div>
                <div className="tool-calc__field">
                  <label className="tool-calc__label" htmlFor="pr-staff">Approximate staff count</label>
                  <input
                    id="pr-staff"
                    className="tool-calc__input"
                    type="number"
                    min="1"
                    max="10000"
                    value={staffCount}
                    onChange={(e) => setStaffCount(e.target.value)}
                    placeholder="e.g. 25"
                  />
                </div>
                <div className="tool-calc__field">
                  <label className="tool-calc__label" htmlFor="pr-concerns">Any specific concerns about this policy?</label>
                  <textarea
                    id="pr-concerns"
                    className="tool-calc__textarea"
                    value={concerns}
                    onChange={(e) => setConcerns(e.target.value)}
                    placeholder="e.g. We had a tribunal claim recently and want to make sure this is up to date"
                    rows={2}
                  />
                </div>
                <div className="tool-calc__field">
                  <label className="tool-calc__label" htmlFor="pr-agreed">Agreed ways of working that might differ from textbook?</label>
                  <textarea
                    id="pr-agreed"
                    className="tool-calc__textarea"
                    value={agreedWays}
                    onChange={(e) => setAgreedWays(e.target.value)}
                    placeholder="e.g. We use a combined disciplinary/capability process because we only have one manager"
                    rows={2}
                  />
                  <p className="tool-calc__help">
                    We will not automatically flag your agreed ways of working as non-compliant.
                    If they are lawful and consistently applied, we will note them positively.
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="tool-calc__band tool-calc__band--red">
              <span className="tool-calc__band-label">{error}</span>
            </div>
          )}

          <button
            className="tool-calc__btn"
            onClick={handleSubmit}
            disabled={!file || loading}
          >
            {extracting ? 'Extracting text...' : loading ? 'Reviewing policy...' : 'Review Policy'}
          </button>
        </>
      ) : (
        <div className="policy-review-result" ref={reviewRef}>
          <div className="policy-review-header">
            <div className="policy-review-file-info">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" />
              </svg>
              <span>{file?.name}</span>
            </div>
            <button className="tool-calc__btn tool-calc__btn--secondary" onClick={reset}>
              Review another policy
            </button>
          </div>
          <div className="policy-review-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{review}</ReactMarkdown>
          </div>
          {loading && (
            <div className="policy-review-streaming">
              <div className="policy-review-dot-pulse" />
              <span>Analysing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TOOL CARD MAP
// ============================================================

const TOOL_COMPONENTS: Record<ToolId, React.FC> = {
  'bradford': BradfordCalculator,
  'holiday-1207': Holiday1207Calculator,
  'annual-leave': AnnualLeaveCalculator,
  'ssp': SSPCalculator,
  'notice': NoticeCalculator,
  'redundancy': RedundancyCalculator,
  'sleep-in': SleepInCalculator,
  'absence-cost': AbsenceCostCalculator,
  'acas-deadlines': AcasDeadlineCalculator,
  'oncall-classifier': OnCallClassifier,
  'phased-return': PhasedReturnCalculator,
  'policy-review': PolicyReviewTool,
};

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [openTool, setOpenTool] = useState<ToolId | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const filteredTools = activeCategory === 'all'
    ? TOOLS
    : TOOLS.filter(t => t.category === activeCategory);

  const counts = {
    all: TOOLS.length,
    calculations: TOOLS.filter(t => t.category === 'calculations').length,
    compliance: TOOLS.filter(t => t.category === 'compliance').length,
  };

  const toggleTool = (id: ToolId) => {
    setOpenTool(prev => (prev === id ? null : id));
  };

  // Scroll expanded panel into view
  useEffect(() => {
    if (openTool && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [openTool]);

  const activeTool = TOOLS.find(t => t.id === openTool);
  const ActiveComponent = openTool ? TOOL_COMPONENTS[openTool] : null;

  return (
    <div className="tools-page">
      <Link to="/" className="legal-back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="10,2 4,8 10,14" />
        </svg>
        Back to SIT-HR
      </Link>

      <Helmet>
        <title>HR Tools - Calculators and Compliance</title>
        <meta name="description" content="Free HR calculators for adult social care: Bradford Factor, holiday entitlement, SSP, redundancy pay, sleep-in pay compliance, Acas deadlines. April 2026 statutory rates." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="tools-page__title">HR Tools</h1>
        <p className="tools-page__subtitle">Fast, accurate calculators - April 2026 statutory rates</p>
        <div className="tools-page__divider" />

        {/* Category Pills */}
        <div className="tools-page__pills">
          {([
            { key: 'all', label: 'All' },
            { key: 'calculations', label: 'Calculations' },
            { key: 'compliance', label: 'Compliance' },
          ] as const).map(cat => (
            <button
              key={cat.key}
              className={`tools-page__pill ${activeCategory === cat.key ? 'tools-page__pill--active' : ''}`}
              onClick={() => { setActiveCategory(cat.key); setOpenTool(null); }}
            >
              {cat.label}
              <span className="tools-page__pill-count">{counts[cat.key]}</span>
            </button>
          ))}
        </div>

        {/* Card Grid */}
        <div className="tools-page__grid">
          {filteredTools.map((tool, i) => (
            <motion.button
              key={tool.id}
              className={`tool-card-v2 ${openTool === tool.id ? 'tool-card-v2--active' : ''}`}
              onClick={() => toggleTool(tool.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <div className="tool-card-v2__icon">
                <ToolIcon type={tool.icon} />
              </div>
              <div className="tool-card-v2__text">
                <h3 className="tool-card-v2__title">{tool.title}</h3>
                <p className="tool-card-v2__subtitle">{tool.subtitle}</p>
              </div>
              <span className={`tool-card-v2__badge tool-card-v2__badge--${tool.category}`}>
                {tool.category}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Expanded Calculator Panel */}
        <AnimatePresence mode="wait">
          {openTool && activeTool && ActiveComponent && (
            <motion.div
              ref={panelRef}
              key={openTool}
              className="tools-page__panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="tools-page__panel-header">
                <div>
                  <h2 className="tools-page__panel-title">{activeTool.title}</h2>
                  <p className="tools-page__panel-subtitle">{activeTool.subtitle}</p>
                </div>
                <button className="tools-page__panel-close" onClick={() => setOpenTool(null)} aria-label="Close calculator">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="5" y1="5" x2="15" y2="15" />
                    <line x1="15" y1="5" x2="5" y2="15" />
                  </svg>
                </button>
              </div>
              <div className="tools-page__panel-body">
                <ActiveComponent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rates Footer */}
        <div className="tools-page__rates-notice">
          <p>Statutory rates effective from 6 April 2026. SSP: {RATES.SSP_WEEKLY_MAX.toFixed(2)}/week (80% of AWE). Redundancy weekly cap: {RATES.REDUNDANCY_WEEKLY_CAP.toFixed(2)}. NLW (21+): {RATES.NLW_21_PLUS.toFixed(2)}/hr. Holiday accrual: {RATES.HOLIDAY_ACCRUAL_PERCENTAGE}%. These calculators provide statutory minimums only. They do not constitute legal advice. Always check the employee's contract for enhanced terms.</p>
        </div>
      </motion.div>

      <PageFooter />
    </div>
  );
}
