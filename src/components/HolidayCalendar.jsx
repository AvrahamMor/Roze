import React, { useState, useEffect } from 'react';
import { INDIAN_HOLIDAYS_2026 } from '../data/holidays2026';
import { LEGAL_RULES } from '../data/legalRules';
import { CONTRACT_DATA } from '../data/contractData';
import { 
  Calendar, 
  Search, 
  Check, 
  Sparkles, 
  Filter, 
  AlertCircle, 
  DollarSign, 
  CalendarCheck, 
  HelpCircle, 
  Palmtree, 
  Clock, 
  Coins, 
  Info, 
  CheckCircle2, 
  Calculator,
  RotateCcw,
  Sparkle
} from 'lucide-react';

const MONTH_NAMES_HEB = [
  'הכל', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

// Helper to get today's date in YYYY-MM-DD format
function getTodayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function HolidayCalendar({ holidaySelections, onToggleHolidaySelection }) {
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [onlyAfterStart, setOnlyAfterStart] = useState(true); // Filter holidays from July 2026 onwards

  // Vacation Accrual Calculator State - AUTOMATICALLY DEFAULTS TO TODAY'S LIVE DATE
  const startDateStr = CONTRACT_DATA.caregiver.placementDate; // "20/07/2026"
  const todayIso = getTodayIso();
  const [calcDate, setCalcDate] = useState(todayIso);
  const [usedVacationDays, setUsedVacationDays] = useState(0);
  const [redeemDaysCount, setRedeemDaysCount] = useState(1);

  const holidayRate = LEGAL_RULES.holidayExtraRate; // 440 NIS
  const vacationDayValue = LEGAL_RULES.vacationDayValue; // 257.75 NIS
  const proRated2026Quota = CONTRACT_DATA.agreedRates.proRatedHolidays2026; // 4 holidays

  // Filter holidays
  const filteredHolidays = INDIAN_HOLIDAYS_2026.filter((h) => {
    const [year, monthStr, dayStr] = h.date.split('-');
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    // If onlyAfterStart is true, filter out holidays before July 20, 2026
    if (onlyAfterStart) {
      if (month < 7 || (month === 7 && day < 20)) {
        return false;
      }
    }

    const matchesMonth = selectedMonth === 0 || month === selectedMonth;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.hebName.includes(searchQuery) ||
      h.date.includes(searchQuery);
    return matchesMonth && matchesSearch;
  });

  // Calculate statistics for holidays
  const dayOffCount = Object.values(holidaySelections).filter((val) => val === 'off').length;
  const workedCount = Object.values(holidaySelections).filter((val) => val === 'worked').length;
  const totalWorkedExtra = workedCount * holidayRate;

  // --- AUTOMATIC LIVE VACATION ACCRUAL CALCULATION ---
  // Start date: 20 July 2026
  const startDate = new Date(2026, 6, 20); // 2026-07-20 (month index 6 = July)
  const currentCalcDate = new Date(calcDate);
  
  // Calculate difference in milliseconds & days
  const diffTime = Math.max(0, currentCalcDate - startDate);
  const totalDaysWorked = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const monthsWorked = (totalDaysWorked / 30.4375); // exact average month length

  // 14 vacation days per full year (1.1666 days per month = 14 / 365.25 * days)
  const accruedVacationDays = Math.max(0, parseFloat(((monthsWorked * 14) / 12).toFixed(2)));
  const remainingVacationDays = Math.max(0, parseFloat((accruedVacationDays - usedVacationDays).toFixed(2)));
  const totalAccruedValue = accruedVacationDays * vacationDayValue;
  const remainingVacationValue = remainingVacationDays * vacationDayValue;

  const isToday = calcDate === todayIso;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner & Stats */}
      <div className="glass-card" style={{ padding: '24px', background: 'var(--gradient-glow)', borderColor: 'var(--border-accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar style={{ color: 'var(--accent-purple)' }} size={28} />
                לוח חגים וחופשות שנתיות | ביג'ילי ג'וזף
              </h2>
              <span className="badge badge-amber" style={{ fontSize: '0.8rem' }}>
                תאריך כניסה: {startDateStr}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.9rem' }}>
              מכסת חגים יחסית לשנת 2026: <strong>{proRated2026Quota} ימי חג</strong> (מיולי עד דצמבר) | צבירת חופשה: <strong>1.16 ימים בחודש</strong> בשווי 257.75 ₪ ליום.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '10px 16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 700 }}>חגים שנבחרו לשנת 2026</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{dayOffCount} / {proRated2026Quota}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(יחסי מתוך {proRated2026Quota} לחצי שנה)</span>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>חגים שעובדים בהם (+{holidayRate} ₪)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {workedCount} ימים (+₪{totalWorkedExtra.toLocaleString()})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VACATION ACCRUAL & REDEMPTION CALCULATOR (מחשבון צבירת ימי חופשה אוטומטי בזמן אמת) */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))', border: '1.5px solid var(--accent-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Palmtree size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: 0 }}>
                  מחשבון צבירת ימי חופשה אוטומטי בזמן אמת
                </h3>
                {isToday ? (
                  <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                    <Sparkles size={13} /> מחושב אוטומטית להיום
                  </span>
                ) : (
                  <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                    תאריך מותאם אישית
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                חישוב אוטומטי מהיום הראשון לעבודה (<strong>{startDateStr}</strong>) לפי 14 ימי חופשה בשנה (1.16 ימים/חודש) בשווי <strong>₪{vacationDayValue}</strong> ליום.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>חישוב נכון ל:</span>
            <input 
              type="date" 
              value={calcDate} 
              onChange={(e) => setCalcDate(e.target.value)}
              style={{ width: '150px', padding: '6px 10px', borderRadius: '8px', fontSize: '0.85rem' }}
            />
            {!isToday && (
              <button 
                type="button" 
                onClick={() => setCalcDate(todayIso)} 
                className="btn-secondary" 
                style={{ padding: '6px 10px', fontSize: '0.8rem', minHeight: '34px' }}
                title="אפס לתאריך היום הנוכחי"
              >
                <RotateCcw size={14} /> חזור להיום
              </button>
            )}
          </div>
        </div>

        {/* Accrual Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div className="stat-card" style={{ background: 'var(--bg-subcard)' }}>
            <span className="stat-label">ותק נצבר מ-20/07/2026</span>
            <span className="stat-value" style={{ color: 'var(--accent-blue)', fontSize: '1.2rem' }}>
              {monthsWorked.toFixed(1)} חודשים ({totalDaysWorked} ימים)
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>מחושב בדיוק לפי ימי עבודה</span>
          </div>

          <div className="stat-card" style={{ background: 'var(--bg-subcard)' }}>
            <span className="stat-label">ימי חופשה שנצברו</span>
            <span className="stat-value" style={{ color: 'var(--accent-cyan)', fontSize: '1.3rem' }}>
              {accruedVacationDays} ימים
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>שווי מצטבר: ₪{totalAccruedValue.toFixed(2)}</span>
          </div>

          <div className="stat-card" style={{ background: 'var(--bg-subcard)' }}>
            <span className="stat-label">ימי חופשה שנוצלו / שולמו</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <input 
                type="number" 
                min="0" 
                max={accruedVacationDays} 
                step="0.5" 
                value={usedVacationDays} 
                onChange={(e) => setUsedVacationDays(Math.max(0, Number(e.target.value)))}
                style={{ width: '80px', padding: '4px 8px', height: '32px', fontSize: '0.9rem', textAlign: 'center' }}
              />
              <span style={{ fontSize: '0.85rem' }}>ימים</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>עדכן אם יצאה לחופש</span>
          </div>

          <div className="stat-card" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1.5px solid var(--accent-emerald)' }}>
            <span className="stat-label" style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>יתרת ימי חופשה לפדיון / ניצול</span>
            <span className="stat-value" style={{ color: 'var(--accent-emerald)', fontSize: '1.35rem' }}>
              {remainingVacationDays} ימים
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              שווי כספי: ₪{remainingVacationValue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* PAY / REDEEM VACATION DAYS TOOL (פדיון/תשלום ימי חופשה בפועל) */}
        <div style={{ background: 'var(--bg-subcard)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Coins size={16} /> תשלום / פדיון ימי חופשה (למשל: יום חופש בחג או פדיון כספי):
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              אם המטפלת לוקחת יום חופש מיוחד או רוצה פדיון יום חופשה בכסף, התעריף החוקי ליום הוא <strong>₪{vacationDayValue}</strong>.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.85rem' }}>כמות ימים:</span>
              <input 
                type="number" 
                min="0.5" 
                max="30" 
                step="0.5" 
                value={redeemDaysCount} 
                onChange={(e) => setRedeemDaysCount(Math.max(0.5, Number(e.target.value)))}
                style={{ width: '70px', padding: '6px 8px', height: '36px', textAlign: 'center' }}
              />
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', display: 'block' }}>סכום לתשלום לעובדת:</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                ₪{(redeemDaysCount * vacationDayValue).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED EXPLANATION BOX (כללי החוק לחגים וחופשות) */}
      <div className="glass-card" style={{ padding: '20px', background: 'var(--gradient-glow)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--accent-indigo)', fontSize: '1rem', marginBottom: '10px' }}>
          <HelpCircle size={20} /> תמצית חוקי החגים והחופשות בישראל (עובדים זרים בסיעוד):
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          
          <div style={{ background: 'var(--bg-subcard)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--accent-purple)', display: 'block', marginBottom: '4px' }}>
              🇮🇳 1. למה מגיעים לה רק 4 ימי חג בשנת 2026?
            </strong>
            מכסת החגים בחוק היא 9 ימים עבור <strong>שנה מלאה</strong> (12 חודשים). 
            מכיוון שביג'ילי התחילה לעבוד ב-<strong>20/07/2026</strong> (כ-5.3 חודשים עד סוף השנה), החישוב היחסי הוא: <code>(5.3 / 12) × 9 = 4 ימי חג</code>. החל משנת 2027 מגיעים לה 9 ימים מלאים.
          </div>

          <div style={{ background: 'var(--bg-subcard)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--accent-emerald)', display: 'block', marginBottom: '4px' }}>
              💼 2. חג שעובדים בו מול חג שיוצאים לחופש:
            </strong>
            • <strong>יצאה לחופש:</strong> מקבלת שכר חודשי מלא כרגיל (יום חופש בתשלום, ללא תוספת כספית).<br />
            • <strong>נשארה לעבוד:</strong> מקבלת שכר רגיל <strong>+ תוספת מיוחדת של {holidayRate} ₪</strong> לאותו יום.
          </div>

          <div style={{ background: 'var(--bg-subcard)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--accent-cyan)', display: 'block', marginBottom: '4px' }}>
              🏖️ 3. ימי חופשה שנתית (14 ימים בשנה):
            </strong>
            העובדת צוברת <strong>1.166 ימי חופשה בחודש</strong>. שווי כל יום חופשה לפי שכר ברוטו הוא <strong>257.75 ₪</strong>. המחשבון למעלה מחשב את הצבירה בזמן אמת באופן אוטומטי!
          </div>

        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 250px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="חפש חג לפי שם או תאריך..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Filter Toggle (Only after start date) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="afterStartCheck" 
            checked={onlyAfterStart} 
            onChange={(e) => setOnlyAfterStart(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="afterStartCheck" style={{ fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
            הצג חגים רק החל מיום תחילת העבודה ({startDateStr})
          </label>
        </div>

        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          {MONTH_NAMES_HEB.map((m, index) => (
            <button
              key={index}
              className={selectedMonth === index ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setSelectedMonth(index)}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                whiteSpace: 'nowrap'
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('cards')}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            כרטיסים
          </button>
          <button
            className={viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('table')}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            טבלה
          </button>
        </div>

      </div>

      {/* Holidays Grid / List */}
      {viewMode === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredHolidays.map((h) => {
            const currentStatus = holidaySelections[h.id] || 'none';
            const [year, month, day] = h.date.split('-');
            const formattedDate = `${day}/${month}/${year}`;

            let cardBorder = 'var(--border-color)';
            if (currentStatus === 'worked') cardBorder = 'var(--accent-emerald)';
            if (currentStatus === 'off') cardBorder = 'var(--accent-purple)';

            return (
              <div 
                key={h.id} 
                className="glass-card" 
                style={{ 
                  padding: '16px', 
                  borderColor: cardBorder,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      📅 {formattedDate}
                    </span>
                    {currentStatus === 'worked' && (
                      <span className="badge badge-emerald">+{holidayRate} ₪ עובדת</span>
                    )}
                    {currentStatus === 'off' && (
                      <span className="badge badge-purple">יום חופש (חג)</span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {h.hebName}
                  </h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    {h.name}
                  </span>
                </div>

                {/* Status Toggle Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => onToggleHolidaySelection(h.id, 'off')}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: currentStatus === 'off' ? 'var(--accent-purple)' : 'var(--border-color)',
                      background: currentStatus === 'off' ? 'var(--accent-purple)' : 'transparent',
                      color: currentStatus === 'off' ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    🏖️ חופש (חג)
                  </button>
                  <button
                    onClick={() => onToggleHolidaySelection(h.id, 'worked')}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: currentStatus === 'worked' ? 'var(--accent-emerald)' : 'var(--border-color)',
                      background: currentStatus === 'worked' ? 'var(--accent-emerald)' : 'transparent',
                      color: currentStatus === 'worked' ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    💼 עובדת (+{holidayRate} ₪)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table List View */
        <div className="glass-card" style={{ overflowX: 'auto', padding: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>תאריך</th>
                <th style={{ padding: '12px' }}>שם החג בעברית</th>
                <th style={{ padding: '12px' }}>שם החג באנגלית</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>סטאטוס עבודה בחג</th>
              </tr>
            </thead>
            <tbody>
              {filteredHolidays.map((h) => {
                const currentStatus = holidaySelections[h.id] || 'none';
                const [year, month, day] = h.date.split('-');
                const formattedDate = `${day}/${month}/${year}`;

                return (
                  <tr key={h.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {formattedDate}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{h.hebName}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{h.name}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => onToggleHolidaySelection(h.id, 'off')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: currentStatus === 'off' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)',
                            color: currentStatus === 'off' ? '#fff' : 'var(--text-muted)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          🏖️ יום חופש
                        </button>
                        <button
                          onClick={() => onToggleHolidaySelection(h.id, 'worked')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: currentStatus === 'worked' ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.05)',
                            color: currentStatus === 'worked' ? '#fff' : 'var(--text-muted)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          💼 עובדת (+{holidayRate} ₪)
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
