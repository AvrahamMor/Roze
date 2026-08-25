import React, { useState, useEffect } from 'react';
import SalaryCalculator from './components/SalaryCalculator';
import HolidayCalendar from './components/HolidayCalendar';
import ContractDetails from './components/ContractDetails';
import PayslipReport from './components/PayslipReport';
import LegalAgent from './components/LegalAgent';
import OfficialTerms2026 from './components/OfficialTerms2026';
import SavedRecordsHistory from './components/SavedRecordsHistory';
import FirebaseSettingsModal from './components/FirebaseSettingsModal';
import DeviceConnectionModal from './components/DeviceConnectionModal';

import { getFirebaseConfig } from './firebase/config';
import { getHolidaySelections, saveHolidaySelections } from './services/dbService';

import { 
  Calculator, 
  Calendar, 
  FileText, 
  Printer, 
  Bot, 
  Sun, 
  Moon, 
  PiggyBank, 
  HeartHandshake, 
  Award,
  Database,
  Cloud,
  CloudOff,
  Settings,
  Smartphone,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('officialTerms');
  const [theme, setTheme] = useState('dark');
  
  // Modals state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState(getFirebaseConfig());

  // Record loaded from history into calculator/payslip
  const [loadedRecord, setLoadedRecord] = useState(null);

  // State for holiday selections
  const [holidaySelections, setHolidaySelections] = useState({});

  // Load initial holiday selections on mount
  useEffect(() => {
    async function initData() {
      try {
        const saved = await getHolidaySelections();
        if (saved && Object.keys(saved).length > 0) {
          setHolidaySelections(saved);
        }
      } catch (err) {
        console.warn('Failed to load initial holiday selections', err);
      }
    }
    initData();
  }, []);

  // Toggle holiday selection & sync to storage/cloud
  const handleToggleHolidaySelection = (id, type) => {
    setHolidaySelections((prev) => {
      const current = prev[id];
      let next = { ...prev };
      if (current === type) {
        delete next[id];
      } else {
        next[id] = type;
      }
      
      saveHolidaySelections(next);
      return next;
    });
  };

  const holidayWorkedCount = Object.values(holidaySelections).filter((val) => val === 'worked').length;

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleConfigUpdated = () => {
    setFirebaseConfig(getFirebaseConfig());
  };

  const handleLoadRecordToCalculator = (rec) => {
    setLoadedRecord(rec);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Ambient Background Light Mesh Orbs */}
      <div className="ambient-glow-wrapper">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Top Header Bar */}
      <header className="no-print" style={{ 
        background: 'var(--header-bg)', 
        borderBottom: '1px solid var(--border-color)', 
        backdropFilter: 'blur(24px)', 
        WebkitBackdropFilter: 'blur(24px)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Logo & Caregiver Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#fff', 
              boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)', 
              flexShrink: 0 
            }}>
              <HeartHandshake size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.3px', margin: 0 }}>
                  <span className="text-gradient-blue">מערכת שכר וזכויות למטפלת</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginRight: '8px', fontSize: '1rem' }}>| ביג'ילי ג'וזף</span>
                </h1>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                מעסיקה: מור רויטל • הסכם העסקה בתוקף (2026–2027)
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Mobile / Tablet Connection Button */}
            <button
              onClick={() => setIsDeviceModalOpen(true)}
              className="btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: 'rgba(99, 102, 241, 0.4)',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#818cf8',
                fontWeight: 700
              }}
              title="פתח באייפון / אייפד / טאבלט"
            >
              <Smartphone size={15} /> חיבור נייד / טאבלט
            </button>

            {/* Cloud / Firebase Status Badge & Settings Trigger */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: firebaseConfig ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
                background: firebaseConfig ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: firebaseConfig ? '#34d399' : '#fbbf24',
                fontWeight: 700
              }}
              title="הגדרות Firebase Firestore"
            >
              {firebaseConfig ? (
                <>
                  <Cloud size={15} /> ענן פעיל
                </>
              ) : (
                <>
                  <CloudOff size={15} /> הגדרת ענן
                </>
              )}
              <Settings size={13} style={{ opacity: 0.8 }} />
            </button>

            <span className="badge badge-amber" style={{ fontSize: '0.78rem' }}>
              <Award size={13} /> הסכם 2026
            </span>

            <button 
              className="btn-secondary" 
              onClick={toggleTheme}
              title="החלף ערכת נושא (כהה/בהיר)"
              style={{ padding: '6px 12px' }}
            >
              {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={16} />}
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Capsule Tabs Bar */}
      <nav className="no-print capsule-nav-container touch-scroll">
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', gap: '8px', whiteSpace: 'nowrap' }}>
          
          <button
            className={`capsule-tab ${activeTab === 'officialTerms' ? 'capsule-tab-active-amber' : ''}`}
            onClick={() => setActiveTab('officialTerms')}
          >
            <PiggyBank size={17} style={{ color: activeTab === 'officialTerms' ? 'var(--accent-amber)' : 'var(--text-muted)' }} /> 
            📑 תנאי 2026 & עתודה
          </button>

          <button
            className={`capsule-tab ${activeTab === 'calculator' ? 'capsule-tab-active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            <Calculator size={17} style={{ color: activeTab === 'calculator' ? 'var(--accent-blue)' : 'var(--text-muted)' }} /> 
            מחשבון שכר
          </button>

          <button
            className={`capsule-tab ${activeTab === 'history' ? 'capsule-tab-active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Database size={17} style={{ color: activeTab === 'history' ? 'var(--accent-emerald)' : 'var(--text-muted)' }} /> 
            💾 היסטוריית שכר
          </button>

          <button
            className={`capsule-tab ${activeTab === 'calendar' ? 'capsule-tab-active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={17} style={{ color: activeTab === 'calendar' ? 'var(--accent-purple)' : 'var(--text-muted)' }} /> 
            חגי הודו וחופשות
            {holidayWorkedCount > 0 && (
              <span className="badge badge-emerald" style={{ marginRight: '6px', fontSize: '0.7rem', padding: '2px 8px' }}>
                +{holidayWorkedCount}
              </span>
            )}
          </button>

          <button
            className={`capsule-tab ${activeTab === 'contract' ? 'capsule-tab-active' : ''}`}
            onClick={() => setActiveTab('contract')}
          >
            <FileText size={17} /> 
            פרטי חוזה
          </button>

          <button
            className={`capsule-tab ${activeTab === 'legalAgent' ? 'capsule-tab-active' : ''}`}
            onClick={() => setActiveTab('legalAgent')}
          >
            <Bot size={17} style={{ color: activeTab === 'legalAgent' ? 'var(--accent-purple)' : 'var(--text-muted)' }} /> 
            סוכן חוק
          </button>

          <button
            className={`capsule-tab ${activeTab === 'report' ? 'capsule-tab-active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <Printer size={17} /> 
            תלוש/דוח להדפסה
          </button>

        </div>
      </nav>

      {/* Main App Content View Area with smooth animated transition */}
      <main style={{ flex: 1, maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '24px 20px', position: 'relative', zIndex: 10 }}>
        <div key={activeTab} className="tab-content-enter">
          {activeTab === 'officialTerms' && <OfficialTerms2026 />}
          
          {activeTab === 'calculator' && (
            <SalaryCalculator 
              holidayWorkedCount={holidayWorkedCount} 
              loadedRecord={loadedRecord}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'history' && (
            <SavedRecordsHistory 
              onLoadRecordToCalculator={handleLoadRecordToCalculator}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'calendar' && (
            <HolidayCalendar 
              holidaySelections={holidaySelections} 
              onToggleHolidaySelection={handleToggleHolidaySelection} 
            />
          )}

          {activeTab === 'contract' && <ContractDetails />}
          {activeTab === 'legalAgent' && <LegalAgent />}
          
          {activeTab === 'report' && (
            <PayslipReport 
              holidayWorkedCount={holidayWorkedCount} 
              loadedRecord={loadedRecord}
            />
          )}
        </div>
      </main>

      {/* Mobile Floating Bottom Dock (for thumb-navigation on phones) */}
      <div className="mobile-bottom-dock">
        <button 
          className={`mobile-dock-btn ${activeTab === 'calculator' ? 'mobile-dock-btn-active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          <Calculator size={20} />
          <span>מחשבון</span>
        </button>

        <button 
          className={`mobile-dock-btn ${activeTab === 'calendar' ? 'mobile-dock-btn-active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={20} />
          <span>חגים וחופש</span>
        </button>

        <button 
          className={`mobile-dock-btn ${activeTab === 'officialTerms' ? 'mobile-dock-btn-active' : ''}`}
          onClick={() => setActiveTab('officialTerms')}
        >
          <PiggyBank size={20} />
          <span>עתודה 2026</span>
        </button>

        <button 
          className={`mobile-dock-btn ${activeTab === 'history' ? 'mobile-dock-btn-active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Database size={20} />
          <span>היסטוריה</span>
        </button>

        <button 
          className={`mobile-dock-btn ${activeTab === 'report' ? 'mobile-dock-btn-active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <Printer size={20} />
          <span>תלוש</span>
        </button>
      </div>

      {/* Firebase Settings Modal */}
      <FirebaseSettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onConfigUpdated={handleConfigUpdated}
      />

      {/* Mobile / Tablet Device Connection Modal */}
      <DeviceConnectionModal 
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />

      {/* Footer */}
      <footer className="no-print" style={{ borderTop: '1px solid var(--border-color)', padding: '20px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', position: 'relative', zIndex: 10 }}>
        מערכת מותאמת אישית לפי מסמך תנאי העסקה 2026 - איתני מור © 2026
      </footer>

    </div>
  );
}
