import React, { useState } from 'react';
import SalaryCalculator from './components/SalaryCalculator';
import HolidayCalendar from './components/HolidayCalendar';
import ContractDetails from './components/ContractDetails';
import PayslipReport from './components/PayslipReport';
import LegalAgent from './components/LegalAgent';
import OfficialTerms2026 from './components/OfficialTerms2026';
import { Calculator, Calendar, FileText, Printer, Bot, Sun, Moon, PiggyBank, HeartHandshake, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('officialTerms'); // Default to new April 2026 terms & reserve fund tab
  const [theme, setTheme] = useState('dark');
  
  // State for holiday selections
  const [holidaySelections, setHolidaySelections] = useState({});

  // Toggle holiday selection
  const handleToggleHolidaySelection = (id, type) => {
    setHolidaySelections((prev) => {
      const current = prev[id];
      if (current === type) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: type };
    });
  };

  const holidayWorkedCount = Object.values(holidaySelections).filter((val) => val === 'worked').length;

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Bar */}
      <header className="no-print" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-glow)' }}>
              <HeartHandshake size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                מערכת שכר וזכויות למטפלת | ביג'ילי ג'וזף
              </h1>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                מעסיקה: מור רויטל | הסכם אפריל 2026
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-amber" style={{ fontSize: '0.8rem' }}>
              <Award size={14} /> תנאים מעודכנים אפריל 2026
            </span>
            <button 
              className="btn-secondary" 
              onClick={toggleTheme}
              title="החלף ערכת נושא"
              style={{ padding: '8px 12px' }}
            >
              {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={18} />}
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <nav className="no-print" style={{ background: 'rgba(15,23,42,0.6)', borderBottom: '1px solid var(--border-color)', padding: '10px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          
          <button
            className={activeTab === 'officialTerms' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('officialTerms')}
            style={{ fontSize: '0.9rem', padding: '8px 16px', whiteSpace: 'nowrap', background: activeTab === 'officialTerms' ? 'var(--gradient-amber)' : 'transparent', border: activeTab === 'officialTerms' ? 'none' : '1px solid var(--accent-amber)' }}
          >
            <PiggyBank size={18} style={{ color: activeTab === 'officialTerms' ? '#fff' : 'var(--accent-amber)' }} /> 📑 תנאי העסקה 2026 & קופת עתודה
          </button>

          <button
            className={activeTab === 'calculator' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('calculator')}
            style={{ fontSize: '0.9rem', padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            <Calculator size={18} /> מחשבון שכר ועלויות
          </button>

          <button
            className={activeTab === 'calendar' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('calendar')}
            style={{ fontSize: '0.9rem', padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            <Calendar size={18} /> לוח חגי הודו 2026
            {holidayWorkedCount > 0 && (
              <span className="badge badge-emerald" style={{ marginRight: '6px', fontSize: '0.7rem' }}>
                +{holidayWorkedCount} עבודה
              </span>
            )}
          </button>

          <button
            className={activeTab === 'contract' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('contract')}
            style={{ fontSize: '0.9rem', padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            <FileText size={18} /> חוזה ופרטי העסקה
          </button>

          <button
            className={activeTab === 'legalAgent' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('legalAgent')}
            style={{ fontSize: '0.9rem', padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            <Bot size={18} style={{ color: 'var(--accent-purple)' }} /> סוכן עדכוני חוק
          </button>

          <button
            className={activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('report')}
            style={{ fontSize: '0.9rem', padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            <Printer size={18} /> תלוש/דוח להדפסה
          </button>

        </div>
      </nav>

      {/* Main App Content View Area */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>
        {activeTab === 'officialTerms' && <OfficialTerms2026 />}
        {activeTab === 'calculator' && <SalaryCalculator holidayWorkedCount={holidayWorkedCount} />}
        {activeTab === 'calendar' && (
          <HolidayCalendar 
            holidaySelections={holidaySelections} 
            onToggleHolidaySelection={handleToggleHolidaySelection} 
          />
        )}
        {activeTab === 'contract' && <ContractDetails />}
        {activeTab === 'legalAgent' && <LegalAgent />}
        {activeTab === 'report' && <PayslipReport holidayWorkedCount={holidayWorkedCount} />}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{ borderTop: '1px solid var(--border-color)', padding: '20px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        מערכת מותאמת אישית לפי מסמך תנאי העסקה אפריל 2026 - איתני מור © 2026
      </footer>

    </div>
  );
}
