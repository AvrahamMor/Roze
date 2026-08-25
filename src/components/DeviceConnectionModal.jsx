import React, { useState } from 'react';
import { Smartphone, Tablet, Wifi, Share2, PlusSquare, Globe, X, Copy, CheckCircle2, QrCode, Monitor } from 'lucide-react';

export default function DeviceConnectionModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Local Wi-Fi URL (detected from current window host or local IP)
  const currentHost = window.location.hostname;
  const currentPort = window.location.port || '5173';
  
  // If running on localhost, suggest the local Wi-Fi IP
  const wifiUrl = currentHost === 'localhost' || currentHost === '127.0.0.1' 
    ? `http://192.168.1.29:${currentPort}` 
    : window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(wifiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // QR Code generator URL via standard API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(wifiUrl)}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div className="glass-card modal-container" style={{
        width: '100%',
        maxWidth: '620px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Smartphone size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>חיבור והפעלה בטלפון / אייפד / טאבלט</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>מותאם אישית לכל גדלי המסכים וכולל תמיכה באפליקציה מלאה (PWA)</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Option 1: Direct Wi-Fi Access via QR Code or Link */}
        <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-blue)', fontWeight: 700 }}>
            <Wifi size={18} /> 1. פתיחה מיידית באייפון / אייפד (באותה רשת Wi-Fi):
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* QR Code */}
            <div style={{ background: '#fff', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={qrCodeUrl} alt="QR Code" style={{ width: '120px', height: '120px', display: 'block' }} />
            </div>

            {/* URL Box */}
            <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                סרוק במצלמת הנייד או הקלד את הכתובת ב-Safari / Chrome:
              </span>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={wifiUrl} 
                  style={{ direction: 'ltr', textAlign: 'left', fontFamily: 'monospace', fontSize: '0.85rem', padding: '8px 12px' }}
                />
                <button 
                  onClick={handleCopy} 
                  className="btn-secondary" 
                  style={{ padding: '8px 12px', minHeight: 'auto', whiteSpace: 'nowrap' }}
                  title="העתק כתובת"
                >
                  {copied ? <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={16} />}
                </button>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
                💡 ודא שהטלפון/טאבלט מחוברים לאותה רשת Wi-Fi של המחשב.
              </span>
            </div>
          </div>
        </div>

        {/* Option 2: How to install as a Home Screen App on iPhone/iPad */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)' }}>
            <Tablet size={18} /> איך להפוך לאייקון אפליקציה במסך הבית (כמו אפליקציה מחנות)?
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {/* iOS / iPhone / iPad */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                🍏 ב-iPhone וב-iPad (ב-Safari):
              </strong>
              <ol style={{ paddingRight: '16px', fontSize: '0.8rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                <li>פתח את הקישור בדפדפן <strong>Safari</strong>.</li>
                <li>לחץ על כפתור <strong>השיתוף</strong> בתחתית (סמל מרובע עם חץ למעלה ⎋).</li>
                <li>גלול ולחץ על <strong>"הוסף למסך הבית"</strong> (Add to Home Screen ➕).</li>
                <li>כעת האפליקציה תפתח במסך מלא ללא שורת כתובת!</li>
              </ol>
            </div>

            {/* Android / Tablets */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-emerald)', marginBottom: '6px' }}>
                🤖 ב-Android / טאבלטים (ב-Chrome):
              </strong>
              <ol style={{ paddingRight: '16px', fontSize: '0.8rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                <li>פתח את הקישור בדפדפן <strong>Chrome</strong>.</li>
                <li>לחץ על <strong>3 הנקודות ⋮</strong> למעלה.</li>
                <li>בחר <strong>"התקן אפליקציה"</strong> או <strong>"הוסף למסך הבית"</strong>.</li>
                <li>יווצר אייקון ייעודי במסך הבית שלך.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Option 3: Cloud URL Deployment (Free) */}
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '14px', fontSize: '0.82rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Globe size={16} /> רוצה קישור אינטרנטי ציבורי שיעבוד גם מחוץ לבית (ללא Wi-Fi)?
          </div>
          <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            ניתן להעלות את האפליקציה בחינם ל-<strong>Firebase Hosting</strong> (הפרויקט `rose-23001` שלך) ותקבל כתובת קבועה ומאובטחת (למשל: <code>https://rose-23001.web.app</code>) שפועלת מכל מקום בעולם!
          </p>
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 24px' }}>
            הבנתי, סגור
          </button>
        </div>

      </div>
    </div>
  );
}
