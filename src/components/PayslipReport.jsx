import React, { useState } from 'react';
import { LEGAL_RULES } from '../data/legalRules';
import { CONTRACT_DATA } from '../data/contractData';
import { Printer, Download, CheckCircle, FileCheck } from 'lucide-react';

export default function PayslipReport({ holidayWorkedCount = 0 }) {
  const [selectedMonthYear, setSelectedMonthYear] = useState('2026-07');
  
  // Salary state calculations
  const baseSalary = LEGAL_RULES.minimumMonthlySalary;
  const saturdayExtra = 400; // 1 saturday
  const holidayExtra = holidayWorkedCount * 400;
  
  const grossSalary = baseSalary + saturdayExtra + holidayExtra;

  const employerPension = baseSalary * LEGAL_RULES.employerPensionRate;
  const employerSeverance = baseSalary * LEGAL_RULES.employerSeveranceRate;
  const employerSocialTotal = baseSalary * LEGAL_RULES.totalEmployerSocialRate;
  const employerBituachLeumi = baseSalary * LEGAL_RULES.employerBituachLeumiRate;

  const workerPensionDeduction = baseSalary * LEGAL_RULES.workerPensionDeductionRate;
  const healthDeduction = LEGAL_RULES.maxDeductions.healthInsurance;
  const housingDeduction = 300;

  const totalDeductions = workerPensionDeduction + healthDeduction + housingDeduction;
  const netSalary = grossSalary - totalDeductions;
  const totalEmployerCost = grossSalary + employerSocialTotal + employerBituachLeumi + (240 - healthDeduction);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Action Bar (Hidden on print) */}
      <div className="glass-card no-print" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck style={{ color: 'var(--accent-emerald)' }} size={24} />
            מחולל דוח תשלום חודשי ותלוש להדפסה
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
            הפקת אישור תשלום שכר מפורט להעברה לעובדת ולתיעוד המעסיק.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="month" 
            value={selectedMonthYear} 
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            style={{ padding: '8px 12px', width: 'auto' }}
          />
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={18} /> הדפס דוח/תלוש חודשי
          </button>
        </div>
      </div>

      {/* Printable Payslip Card */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '36px', 
          background: 'var(--bg-card)', 
          color: 'var(--text-main)', 
          maxWidth: '850px', 
          margin: '0 auto', 
          width: '100%',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid var(--border-color)', pb: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
              אישור תשלום שכר חודשי - עובדת זרה בסיעוד
            </h1>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              חודש: {selectedMonthYear}
            </span>
          </div>
          <div style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div>תאריך הפקה: {new Date().toLocaleDateString('he-IL')}</div>
            <div>סוכנות השמה: איתני מור מטפלים סיעודיים בע"מ</div>
          </div>
        </div>

        {/* Employer & Caregiver Details Block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', pb: '6px', marginBottom: '8px', color: 'var(--accent-cyan)' }}>
              פרטי המעסיק / מטופל
            </h3>
            <div style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
              <div><strong>שם המעסיק:</strong> {CONTRACT_DATA.employer.fullName}</div>
              <div><strong>תעודת זהות:</strong> {CONTRACT_DATA.employer.idNumber}</div>
              <div><strong>כתובת:</strong> {CONTRACT_DATA.employer.address}</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', pb: '6px', marginBottom: '8px', color: 'var(--accent-purple)' }}>
              פרטי העובדת
            </h3>
            <div style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
              <div><strong>שם העובדת:</strong> {CONTRACT_DATA.caregiver.hebName} ({CONTRACT_DATA.caregiver.fullName})</div>
              <div><strong>מספר דרכון:</strong> {CONTRACT_DATA.caregiver.passportNumber}</div>
              <div><strong>ארץ מוצא:</strong> {CONTRACT_DATA.caregiver.countryOfOrigin}</div>
            </div>
          </div>
        </div>

        {/* Salary Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '10px', textAlign: 'right' }}>תיאור רכיב שכר</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>כמות / תעריף</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>סכום לתשלום (₪)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px' }}>שכר יסוד חודשי (שכר מינימום)</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>משרה מלאה</td>
              <td style={{ padding: '10px', textAlign: 'left', fontWeight: 700 }}>₪{baseSalary.toLocaleString()}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px' }}>תוספת עבודת שבת (מנוחה שבועית)</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>1 שבת × 400 ₪</td>
              <td style={{ padding: '10px', textAlign: 'left', fontWeight: 700 }}>₪{saturdayExtra}</td>
            </tr>
            {holidayWorkedCount > 0 && (
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px' }}>תוספת עבודה בחגים</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{holidayWorkedCount} חגים × 400 ₪</td>
                <td style={{ padding: '10px', textAlign: 'left', fontWeight: 700 }}>₪{holidayExtra}</td>
              </tr>
            )}
            <tr style={{ borderBottom: '2px solid var(--border-color)', fontWeight: 800, background: 'rgba(255,255,255,0.02)' }}>
              <td style={{ padding: '10px' }}>סה"כ שכר ברוטו:</td>
              <td style={{ padding: '10px' }}></td>
              <td style={{ padding: '10px', textAlign: 'left', color: 'var(--accent-blue)' }}>₪{grossSalary.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Deductions Table */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-amber)' }}>
          ניכויים מותרים משכר העובדת
        </h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.88rem' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '8px' }}>ניכוי חלק עובדת לפנסיה (6%)</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>-₪{workerPensionDeduction.toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '8px' }}>ניכוי ביטוח בריאות פרטי (עד תקרת חוק)</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>-₪{healthDeduction.toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '8px' }}>ניכוי מגורים וחשבונות (מים/חשמל)</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>-₪{housingDeduction.toFixed(2)}</td>
            </tr>
            <tr style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>
              <td style={{ padding: '8px' }}>סה"כ ניכויים משכר:</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>-₪{totalDeductions.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* NET PAYABLE BOX */}
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '2px solid var(--accent-emerald)', padding: '18px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              שכר נטו לתשלום בפועל לעובדת:
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              (משולם במזומן / העברה בנקאית)
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            ₪{Math.round(netSalary).toLocaleString()}
          </div>
        </div>

        {/* Employer Social Deposit Information */}
        <div style={{ background: 'rgba(99,102,241,0.08)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '36px', fontSize: '0.85rem', lineHeight: '1.5' }}>
          <strong>הפרשות מעסיק לקופת פקדון / פנסיה וביטוח לאומי (אינו מנוכה מהעובדת):</strong>
          <ul style={{ paddingRight: '20px', marginTop: '4px' }}>
            <li>הפקדה לפקדון עובדים זרים / פנסיה (12.5%): ₪{employerSocialTotal.toFixed(2)}</li>
            <li>תשלום דמי ביטוח לאומי מעסיק (2%): ₪{employerBituachLeumi.toFixed(2)}</li>
          </ul>
        </div>

        {/* Signatures Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', pt: '20px', borderTop: '1px dashed var(--border-color)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid var(--text-main)', height: '40px', marginBottom: '6px' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>חתימת המעסיקה (מור רויטל)</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid var(--text-main)', height: '40px', marginBottom: '6px' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>חתימת העובדת (Bijili Joseph)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
