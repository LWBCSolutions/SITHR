import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  addDays, addWeeks, addMonths, subWeeks, subMonths,
  format, isSameDay, isSameMonth, isToday, parseISO,
  eachDayOfInterval, getDay,
} from 'date-fns';
import PageFooter from './PageFooter';

// ============================================================
// Types
// ============================================================

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  action_points: string | null;
  category: string;
  start_date: string;
  end_date: string | null;
  all_day: boolean;
  source_url: string | null;
  local_authority_code: string | null;
  pinned: boolean;
}

type ViewMode = 'week' | 'month';

const CATEGORY_COLOURS: Record<string, { bg: string; text: string; label: string }> = {
  legislation: { bg: '#E3F2FD', text: '#1565C0', label: 'Legislation' },
  awareness: { bg: '#F3E5F5', text: '#7B1FA2', label: 'Awareness' },
  religious: { bg: '#FFF3E0', text: '#E65100', label: 'Religious' },
  cultural: { bg: '#E8F5E9', text: '#2E7D32', label: 'Cultural' },
  economic: { bg: '#FFF8E1', text: '#F57F17', label: 'Economic' },
  local: { bg: '#ECEFF1', text: '#37474F', label: 'Local' },
};

// ============================================================
// Helpers
// ============================================================

function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const dayStr = format(day, 'yyyy-MM-dd');
  return events.filter(ev => {
    const start = ev.start_date;
    const end = ev.end_date || start;
    return dayStr >= start && dayStr <= end;
  });
}

function getCategoryStyle(category: string) {
  return CATEGORY_COLOURS[category] || CATEGORY_COLOURS.awareness;
}

// ============================================================
// Event Card
// ============================================================

function EventCard({ event, expanded, onToggle }: {
  event: CalendarEvent;
  expanded: boolean;
  onToggle: () => void;
}) {
  const style = getCategoryStyle(event.category);

  return (
    <div className="cal-event" style={{ borderLeftColor: style.text }}>
      <button className="cal-event__header" onClick={onToggle}>
        <span className="cal-event__badge" style={{ background: style.bg, color: style.text }}>
          {style.label}
        </span>
        <span className="cal-event__title">{event.title}</span>
        <svg
          className={`cal-event__chevron ${expanded ? 'cal-event__chevron--open' : ''}`}
          width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <polyline points="4,5 7,8 10,5" />
        </svg>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="cal-event__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <p className="cal-event__desc">{event.description}</p>
            {event.action_points && (
              <div className="cal-event__actions">
                <strong>What to do:</strong> {event.action_points}
              </div>
            )}
            {event.source_url && (
              <a className="cal-event__link" href={event.source_url} target="_blank" rel="noopener noreferrer">
                More information
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Week View
// ============================================================

function WeekView({ events, currentDate, expandedId, onToggle }: {
  events: CalendarEvent[];
  currentDate: Date;
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

  return (
    <div className="cal-week">
      {days.map(day => {
        const dayEvents = getEventsForDay(events, day);
        const today = isToday(day);
        return (
          <div key={day.toISOString()} className={`cal-week__day ${today ? 'cal-week__day--today' : ''}`}>
            <div className="cal-week__day-header">
              <span className="cal-week__day-name">{format(day, 'EEE')}</span>
              <span className={`cal-week__day-num ${today ? 'cal-week__day-num--today' : ''}`}>
                {format(day, 'd')}
              </span>
              <span className="cal-week__day-month">{format(day, 'MMM')}</span>
            </div>
            <div className="cal-week__day-events">
              {dayEvents.length === 0 && (
                <span className="cal-week__empty">No events</span>
              )}
              {dayEvents.map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  expanded={expandedId === ev.id}
                  onToggle={() => onToggle(ev.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Month View
// ============================================================

function MonthView({ events, currentDate, selectedDay, onSelectDay, expandedId, onToggle }: {
  events: CalendarEvent[];
  currentDate: Date;
  selectedDay: Date | null;
  onSelectDay: (day: Date) => void;
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedDayEvents = selectedDay ? getEventsForDay(events, selectedDay) : [];

  return (
    <div className="cal-month">
      <div className="cal-month__grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="cal-month__header-cell">{d}</div>
        ))}
        {allDays.map(day => {
          const dayEvents = getEventsForDay(events, day);
          const today = isToday(day);
          const inMonth = isSameMonth(day, currentDate);
          const selected = selectedDay && isSameDay(day, selectedDay);
          const categories = [...new Set(dayEvents.map(e => e.category))];

          return (
            <button
              key={day.toISOString()}
              className={`cal-month__cell ${!inMonth ? 'cal-month__cell--outside' : ''} ${today ? 'cal-month__cell--today' : ''} ${selected ? 'cal-month__cell--selected' : ''}`}
              onClick={() => onSelectDay(day)}
            >
              <span className="cal-month__cell-num">{format(day, 'd')}</span>
              {categories.length > 0 && (
                <div className="cal-month__dots">
                  {categories.slice(0, 4).map(cat => (
                    <span key={cat} className="cal-month__dot" style={{ background: getCategoryStyle(cat).text }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDay && (
          <motion.div
            className="cal-month__detail"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <h3 className="cal-month__detail-title">
              {format(selectedDay, 'EEEE d MMMM yyyy')}
            </h3>
            {selectedDayEvents.length === 0 ? (
              <p className="cal-month__detail-empty">No events on this day.</p>
            ) : (
              selectedDayEvents.map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  expanded={expandedId === ev.id}
                  onToggle={() => onToggle(ev.id)}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(Object.keys(CATEGORY_COLOURS))
  );

  const toggleCategory = (cat: string) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      let start: string, end: string;
      if (view === 'week') {
        const ws = startOfWeek(currentDate, { weekStartsOn: 1 });
        start = format(ws, 'yyyy-MM-dd');
        end = format(addDays(ws, 6), 'yyyy-MM-dd');
      } else {
        const ms = startOfMonth(currentDate);
        const me = endOfMonth(currentDate);
        const cs = startOfWeek(ms, { weekStartsOn: 1 });
        const ce = endOfWeek(me, { weekStartsOn: 1 });
        start = format(cs, 'yyyy-MM-dd');
        end = format(ce, 'yyyy-MM-dd');
      }

      const res = await fetch(`/api/calendar?start=${start}&end=${end}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Failed to load calendar events:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate, view]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const goToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  const goPrev = () => {
    if (view === 'week') setCurrentDate(d => subWeeks(d, 1));
    else setCurrentDate(d => subMonths(d, 1));
    setSelectedDay(null);
  };

  const goNext = () => {
    if (view === 'week') setCurrentDate(d => addWeeks(d, 1));
    else setCurrentDate(d => addMonths(d, 1));
    setSelectedDay(null);
  };

  const filteredEvents = events.filter(e => activeCategories.has(e.category));

  const headerLabel = view === 'week'
    ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM')} - ${format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), 'd MMM yyyy')}`
    : format(currentDate, 'MMMM yyyy');

  return (
    <div className="calendar-page">
      <Link to="/" className="legal-back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="10,2 4,8 10,14" />
        </svg>
        Back to SIT-HR
      </Link>

      <Helmet>
        <title>Compliance Calendar</title>
        <meta name="description" content="Key dates for UK employers: legislative deadlines, awareness weeks, religious observances, and local authority news." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="calendar-page__title">Compliance Calendar</h1>
        <p className="calendar-page__subtitle">Key dates for employers</p>
        <div className="calendar-page__divider" />

        {/* Controls */}
        <div className="cal-controls">
          <div className="cal-controls__nav">
            <button className="cal-controls__arrow" onClick={goPrev} aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="10,2 4,8 10,14" />
              </svg>
            </button>
            <span className="cal-controls__label">{headerLabel}</span>
            <button className="cal-controls__arrow" onClick={goNext} aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="6,2 12,8 6,14" />
              </svg>
            </button>
            <button className="cal-controls__today" onClick={goToday}>Today</button>
          </div>
          <div className="cal-controls__view">
            <button className={`cal-controls__view-btn ${view === 'week' ? 'cal-controls__view-btn--active' : ''}`} onClick={() => setView('week')}>Week</button>
            <button className={`cal-controls__view-btn ${view === 'month' ? 'cal-controls__view-btn--active' : ''}`} onClick={() => setView('month')}>Month</button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="cal-filters">
          {Object.entries(CATEGORY_COLOURS).map(([key, val]) => (
            <button
              key={key}
              className={`cal-filters__chip ${activeCategories.has(key) ? '' : 'cal-filters__chip--off'}`}
              style={activeCategories.has(key) ? { background: val.bg, color: val.text, borderColor: val.text } : {}}
              onClick={() => toggleCategory(key)}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Calendar Body */}
        {loading ? (
          <div className="cal-loading">Loading events...</div>
        ) : view === 'week' ? (
          <WeekView
            events={filteredEvents}
            currentDate={currentDate}
            expandedId={expandedId}
            onToggle={toggleExpanded}
          />
        ) : (
          <MonthView
            events={filteredEvents}
            currentDate={currentDate}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            expandedId={expandedId}
            onToggle={toggleExpanded}
          />
        )}
      </motion.div>

      <PageFooter />
    </div>
  );
}
