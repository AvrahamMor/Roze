import React from 'react';
import { CONTRACT_DATA } from '../data/contractData';
import { FileText, UserCheck, ShieldCheck, Phone, MapPin, Building, Calendar, Award } from 'lucide-react';

export default function ContractDetails() {
  const { caregiver, employer, agency, agreedRates } = CONTRACT_DATA;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'var(--gradient-glow)', borderColor: 'var(--border-accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText style={{ color: 'var(--accent-blue)' }} size={28} />
              פרטי הסכם העסקה ומכתב השמה
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              נתונים מלאים מתוך הסכם המסגרת ומכתב ההשמה הרשמי שנחתמו מול סוכנות "איתני מור".
            </p>
          </div>
          <span className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
            <ShieldCheck size={16} /> היתר בתוקף עד {caregiver.workPermitValidUntil}
          </span>
        </div>
      </div>

      {/* Grid: Caregiver Profile & Employer Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Caregiver Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--border-color)', pb: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              BJ
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{caregiver.hebName}</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{caregiver.fullName}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>מספר דרכון:</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{caregiver.passportNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>מדינת מוצא:</span>
              <span style={{ fontWeight: 700 }}>{caregiver.countryOfOrigin}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>תאריך לידה:</span>
              <span style={{ fontWeight: 700 }}>{caregiver.dateOfBirth}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>תאריך השמה בעבודה:</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{caregiver.placementDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>מספר היתר רשות האוכלוסין:</span>
              <span style={{ fontWeight: 700 }}>{caregiver.permitNumber}</span>
            </div>
          </div>
        </div>

        {/* Employer Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--border-color)', pb: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              MR
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{employer.fullName}</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>מעסיקה ומטופלת רשומה</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>תעודת זהות מעסיקה:</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{employer.idNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>כתובת מגורים:</span>
              <span style={{ fontWeight: 700 }}>{employer.address}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>סוג היתר העסקה:</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>סיעוד ביתי (ענף הסיעוד)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Agency Details & Agreement Conditions */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building style={{ color: 'var(--accent-purple)' }} size={22} />
          פרטי תאגיד / סוכנות ההשמה (איתני מור)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '0.9rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>שם התאגיד המורשה:</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{agency.name}</strong>
            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              ח.פ. {agency.companyId} | רישיון מס' {agency.licenseNumber}
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>תשלום עמלת תיווך ורישום:</span>
            <strong style={{ fontSize: '1rem', color: 'var(--accent-amber)' }}>
              ₪{agency.placementFee.toLocaleString()} (חד פעמי)
            </strong>
            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              + ₪70 לחודש דמי רישום שנתיים (₪840 לשנה)
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>תקופת הסכם המסגרת:</span>
            <strong style={{ fontSize: '1rem', color: 'var(--accent-cyan)' }}>{agency.agreementPeriod}</strong>
            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              טלפון הסוכנות: {agency.phone}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
