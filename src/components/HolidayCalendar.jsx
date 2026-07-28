import React, { useState } from 'react';
import { INDIAN_HOLIDAYS_2026 } from '../data/holidays2026';
import { Calendar, Search, Check, Sparkles, Filter, AlertCircle, DollarSign, CalendarCheck } from 'lucide-react';

const MONTH_NAMES_HEB = [
  'הכל', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

export default function HolidayCalendar({ holidaySelections, onToggleHolidaySelection }) {
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Filter holidays
  const filteredHolidays = INDIAN_HOLIDAYS_2026.filter((h) => {
    const month = parseInt(h.date.split('-')[1], 10);
    const matchesMonth = selectedMonth === 0 || month === selectedMonth;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.hebName.includes(searchQuery) ||
      h.date.includes(searchQuery);
    return matchesMonth && matchesSearch;
  });

  // Calculate statistics
  const dayOffCount = Object.values(holidaySelections).filter((val) => val === 'off').length;
  const workedCount = Object.values(holidaySelections).filter((val) => val === 'worked').length;
  const totalWorkedExtra = workedCount * 400;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner & Stats */}
      <div className="glass-card" style={{ padding: '24px', background: 'var(--gradient-glow)', borderColor: 'var(--border-accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar style={{ color: 'var(--accent-purple)' }} size={28} />
              לוח חגי הודו לשנת 2026 (ביג'ילי ג'וזף)
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              רשימת 46 החגים הלאומיים הכלולים במסמכי העובדת. סמן ימי חופש שנבחרו (עד 9 בחוק) או ימי עבודה בתוספת (+400 ₪).
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '10px 16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 700 }}>חגים שנבחרו כיום חופש</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{dayOffCount} / 9</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>חגים שעובדים בהם (+400₪)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {workedCount} ימים (+₪{totalWorkedExtra.toLocaleString()})
              </div>
            </div>
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

        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          {MONTH_NAMES_HEB.map((m, index) => (
            <button
              key={index}
              className={selectedMonth === index ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setSelectedMonth(index)}
              style={{ fontSize: '0.82rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className={viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('cards')}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            תצוגת כרטיסים
          </button>
          <button 
            className={viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('table')}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            תצוגת טבלה
          </button>
        </div>

      </div>

      {/* Holidays Count Indicator */}
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        מציג {filteredHolidays.length} מתוך {INDIAN_HOLIDAYS_2026.length} חגים
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredHolidays.map((h) => {
            const currentStatus = holidaySelections[h.id] || 'none'; // 'none' | 'off' | 'worked'
            
            // Format date readable
            const [year, month, day] = h.date.split('-');
            const formattedDate = `${day}/${month}/${year}`;

            return (
              <div 
                key={h.id} 
                className="glass-card glass-card-interactive" 
                style={{ 
                  padding: '18px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justify: 'space-between',
                  gap: '14px',
                  borderColor: currentStatus === 'worked' ? 'var(--accent-emerald)' : currentStatus === 'off' ? 'var(--accent-purple)' : 'var(--border-color)',
                  background: currentStatus === 'worked' ? 'rgba(16, 185, 129, 0.08)' : currentStatus === 'off' ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-card)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      📅 {formattedDate}
                    </span>
                    {currentStatus === 'worked' && (
                      <span className="badge badge-emerald">+400 ₪ עובדת</span>
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
                    💼 עובדת (+400₪)
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
                          💼 עובדת (+400₪)
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
