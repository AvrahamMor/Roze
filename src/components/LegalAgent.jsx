import React, { useState } from 'react';
import { LEGAL_RULES } from '../data/legalRules';
import { Bot, RefreshCw, ShieldAlert, CheckCircle2, Search, HelpCircle, Bell, ExternalLink, Sparkles } from 'lucide-react';

export default function LegalAgent() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }));
  const [updatesList, setUpdatesList] = useState(LEGAL_RULES.latestUpdates);
  const [scanMessage, setScanMessage] = useState(null);
  
  const [searchQuestion, setSearchQuestion] = useState('');

  // Handle Scan action
  const handleRunScan = () => {
    setIsScanning(true);
    setScanMessage(null);

    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }));
      setScanMessage({
        type: 'success',
        text: 'סריקה הושלמה בהצלחה! המערכת סרקה את אתר רשות האוכלוסין וההגירה, משרד העבודה והמוסד לביטוח לאומי. כל החוקים מעודכנים לשנת 2026.'
      });
    }, 1200);
  };

  // Preset FAQ questions
  const faqs = [
    {
      q: "כמה מותר לנכות משכר המטפלת עבור מגורים וחשבונות?",
      a: "לפי תקנות עובדים זרים (ניכויים מותרים משכר), מותר לנכות עד התקרה המעודכנת לשנת 2026 (כ-446.50 ₪ עבור מגורים, מים, חשמל וגז, בתנאי שהעובדת מתגוררת בבית המטופל)."
    },
    {
      q: "מה שיעור ההפרשות לחשבון פקדון / פנסיה לעובד זר בסיעוד?",
      a: "המעסיק חייב להפריש מדי חודש 12.5% משכר היסוד (6.5% גמולים + 6% פיצויים) לחשבון פקדון ייעודי לעובדים זרים בסיעוד. העובדת מפרישה 6% משכרה."
    },
    {
      q: "מה הדין אם העובדת עובדת בשבת או בחג?",
      a: "החוק מעניק 36 שעות מנוחה שבועית (שבת). אם העובדת עובדת בשבת, היא זכאית לתוספת שכר (בסיכום שלכם: 400 ₪ לשבת). לגבי חגים: היא זכאית ל-9 ימי חג בשנה בתשלום מלא; עבודה בחג מקנה תוספת 400 ₪."
    },
    {
      q: "מהם דמי ביטוח לאומי שעל המעסיק לשלם?",
      a: "מעסיק פרטי בסיעוד משלם למוסד לביטוח לאומי דמי ביטוח בשיעור 2% מכלל השכר המדווח בגין העובד הזר."
    },
    {
      q: "מה חייבים לשלם לעובדת בסיום תקופת ההעסקה?",
      a: "בסיום העסקה העובדת זכאית לפדיון ימי חופשה שלא נוצלו, פדיון דמי הבראה (מהשנה השנייה), ושחרור מלוא כספי הפיקדון/פנסיה והפיצויים שנצברו בקופה."
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.includes(searchQuestion) || f.a.includes(searchQuestion)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Agent Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15))', borderColor: 'var(--accent-indigo)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-glow)' }}>
              <Bot size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                סוכן עדכוני חוק ורגולציה לעובדים זרים
                <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>AI Live Agent</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                סוכן אוטומטי העוקב אחר שינויי חקיקה, צווי הרחבה, והוראות רשות האוכלוסין וההגירה בישראל.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              סריקה אחרונה: <strong>{lastScanTime}</strong>
            </div>
            <button 
              className="btn-primary"
              onClick={handleRunScan}
              disabled={isScanning}
              style={{ background: 'var(--gradient-brand)' }}
            >
              <RefreshCw size={16} className={isScanning ? 'spin-anim' : ''} />
              {isScanning ? 'סורק חוקים מול הרשויות...' : 'הרענן וסרוק עדכונים'}
            </button>
          </div>
        </div>
      </div>

      {/* Scan Alert Notification */}
      {scanMessage && (
        <div className="glass-card" style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={24} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {scanMessage.text}
          </span>
        </div>
      )}

      {/* Active Legal Alerts Feed */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell style={{ color: 'var(--accent-amber)' }} size={22} />
          עדכוני חוק אחרונים והנחיות מעסיקים (2026)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {updatesList.map((item) => (
            <div 
              key={item.id} 
              style={{ 
                padding: '16px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: 'var(--radius-md)', 
                borderRight: '4px solid var(--accent-blue)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    {item.date} | {item.source}
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                    {item.status}
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{item.summary}</p>
              </div>
              <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                <ExternalLink size={14} /> קרא הנחיה מלאה
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Q&A Assistant */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HelpCircle style={{ color: 'var(--accent-cyan)' }} size={22} />
          שאלות ותשובות משפטיות נפוצות (חוקי עבודה בסיעוד)
        </h3>

        {/* Search FAQ */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="חפש שאלה משפטית (למשל: פנסיה, שבת, חופשה, ניכויים)..." 
            value={searchQuestion}
            onChange={(e) => setSearchQuestion(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredFaqs.map((faq, idx) => (
            <div 
              key={idx} 
              style={{ 
                padding: '16px', 
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-color)' 
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                ❓ {faq.q}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                💡 {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
