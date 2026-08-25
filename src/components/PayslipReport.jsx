import React, { useState, useEffect } from 'react';
import { LEGAL_RULES } from '../data/legalRules';
import { CONTRACT_DATA } from '../data/contractData';
import { getSalaryRecords, saveSalaryRecord } from '../services/dbService';
import { Printer, Download, CheckCircle, FileCheck, Save, RefreshCw, Calendar, Cloud } from 'lucide-react';

export default function PayslipReport({ holidayWorkedCount = 0, loadedRecord = null }) {
  const [selectedMonthYear, setSelectedMonthYear] = useState('2026-04');
  const [savedRecords, setSavedRecords] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Values initialized from loadedRecord or defaults
  const [grossBaseSalary, setGrossBaseSalary] = useState(LEGAL_RULES.grossMonthlySalary);
  const [saturdaysCount, setSaturdaysCount] = useState(1);
  const [saturdayRate, setSaturdayRate] = useState(440);
  const [holidaysCount, setHolidaysCount] = useState(holidayWorkedCount);
  const [holidayRate, setHolidayRate] = useState(440);
  
  const [healthDeduction, setHealthDeduction] = useState(LEGAL_RULES.maxDeductions.healthInsurance);
  const [housingDeduction, setHousingDeduction] = useState(300);
  const [workerPensionDeduction, setWorkerPensionDeduction] = useState(LEGAL_RULES.minimumMonthlySalary * LEGAL_RULES.workerPensionDeductionRate);

  // Load existing records from Firebase/LocalStorage for quick selector
  useEffect(() => {
    async function loadRecords() {
      try {
        const list = await getSalaryRecords();
        setSavedRecords(list || []);
      } catch (e) {
        console.warn('Failed to load records for payslip selector', e);
      }
    }
    loadRecords();
  }, []);

  // Update when loadedRecord changes
  useEffect(() => {
    if (loadedRecord) {
      if (loadedRecord.monthYear) setSelectedMonthYear(loadedRecord.monthYear);
      if (loadedRecord.grossSalaryBase !== undefined) setGrossBaseSalary(loadedRecord.grossSalaryBase);
      if (loadedRecord.saturdaysCount !== undefined) setSaturdaysCount(loadedRecord.saturdaysCount);
      if (loadedRecord.saturdayRate !== undefined) setSaturdayRate(loadedRecord.saturdayRate);
      if (loadedRecord.holidaysCount !== undefined) setHolidaysCount(loadedRecord.holidaysCount);
      if (loadedRecord.holidayRate !== undefined) setHolidayRate(loadedRecord.holidayRate);
      if (loadedRecord.healthInsuranceDeduction !== undefined) setHealthDeduction(loadedRecord.healthInsuranceDeduction);
      if (loadedRecord.housingDeduction !== undefined) setHousingDeduction(loadedRecord.housingDeduction);
      if (loadedRecord.workerPensionDeduction !== undefined) setWorkerPensionDeduction(loadedRecord.workerPensionDeduction);
    }
  }, [loadedRecord]);

  // Calculations
  const saturdayExtra = saturdaysCount * saturdayRate;
  const holidayExtra = holidaysCount * holidayRate;
  const totalGrossSalary = grossBaseSalary + saturdayExtra + holidayExtra;

  const employerPension = LEGAL_RULES.minimumMonthlySalary * LEGAL_RULES.employerPensionRate; // 382.20
  const employerSeverance = grossBaseSalary * LEGAL_RULES.employerSeveranceRate; // 536.77
  const employerBituachLeumi = totalGrossSalary * LEGAL_RULES.employerBituachLeumiRate; // 3.6%

  const totalDeductions = workerPensionDeduction + healthDeduction + housingDeduction;
  const netSalary = Math.max(0, totalGrossSalary - totalDeductions);

  const handlePrint = () => {
    window.print();
  };

  const handleSelectSavedMonth = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const match = savedRecords.find(r => r.id === selectedId);
    if (match) {
      if (match.monthYear) setSelectedMonthYear(match.monthYear);
      if (match.grossSalaryBase !== undefined) setGrossBaseSalary(match.grossSalaryBase);
      if (match.saturdaysCount !== undefined) setSaturdaysCount(match.saturdaysCount);
      if (match.saturdayRate !== undefined) setSaturdayRate(match.saturdayRate);
      if (match.holidaysCount !== undefined) setHolidaysCount(match.holidaysCount);
      if (match.holidayRate !== undefined) setHolidayRate(match.holidayRate);
      if (match.healthInsuranceDeduction !== undefined) setHealthDeduction(match.healthInsuranceDeduction);
      if (match.housingDeduction !== undefined) setHousingDeduction(match.housingDeduction);
      if (match.workerPensionDeduction !== undefined) setWorkerPensionDeduction(match.workerPensionDeduction);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Action Bar (Hidden on print) */}
      <div className="glass-card no-print" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck style={{ color: 'var(--accent-emerald)' }} size={24} />
            מחולל דוח תשלום חודשי ותלוש להדפסה (אפריל 2026)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
            אישור תשלום שכר מפורט ומודפס לפי תנאי העסקה מעודכנים ברוטו 6,443.85 ₪.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {savedRecords.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>טען מהענן:</span>
              <select 
                onChange={handleSelectSavedMonth}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: '#fff', fontSize: '0.85rem' }}
              >
                <option value="">-- בחר חודש שמור --</option>
                {savedRecords.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.monthLabel || r.monthYear} (נטו ₪{Number(r.netWorkerSalary || 0).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input 
              type="month" 
              value={selectedMonthYear} 
              onChange={(e) => setSelectedMonthYear(e.target.value)}
              style={{ padding: '8px 12px', width: 'auto', borderRadius: '8px' }}
            />
          </div>

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
        <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
              אישור תשלום שכר חודשי - עובדת זרה בסיעוד
            </h1>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              חודש: {selectedMonthYear} | לפי הסכם אפריל 2026
            </span>
          </div>
          <div style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div>תאריך הפקה: {new Date().toLocaleDateString('he-IL')}</div>
            <div>מעסיקה: מור רויטל</div>
          </div>
        </div>

        {/* Employer & Caregiver Details Block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px', color: 'var(--accent-cyan)' }}>
              פרטי המעסיק / מטופל
            </h3>
            <div style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
              <div><strong>שם המעסיק:</strong> {CONTRACT_DATA.employer.fullName}</div>
              <div><strong>תעודת זהות:</strong> {CONTRACT_DATA.employer.idNumber}</div>
              <div><strong>כתובת:</strong> {CONTRACT_DATA.employer.address}</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px', color: 'var(--accent-purple)' }}>
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
              <td style={{ padding: '10px' }}>משכורת חודשית ברוטו (אפריל 2026 כולל מקדמה 100₪/שבוע)</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>משרה מלאה</td>
              <td style={{ padding: '10px', textAlign: 'left', fontWeight: 700 }}>₪{grossBaseSalary.toLocaleString()}</td>
            </tr>
            {saturdaysCount > 0 && (
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px' }}>תוספת עבודת שבת (מנוחה שבועית - 25 שעות)</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{saturdaysCount} שבתות × ₪{saturdayRate}</td>
                <td style={{ padding: '10px', textAlign: 'left', fontWeight: 700 }}>₪{saturdayExtra.toLocaleString()}</td>
              </tr>
            )}
            {holidaysCount > 0 && (
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px' }}>תוספת עבודה בחגים</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{holidaysCount} חגים × ₪{holidayRate}</td>
                <td style={{ padding: '10px', textAlign: 'left', fontWeight: 700 }}>₪{holidayExtra.toLocaleString()}</td>
              </tr>
            )}
            <tr style={{ borderBottom: '2px solid var(--border-color)', fontWeight: 800, background: 'rgba(255,255,255,0.02)' }}>
              <td style={{ padding: '10px' }}>סה"כ שכר ברוטו:</td>
              <td style={{ padding: '10px' }}></td>
              <td style={{ padding: '10px', textAlign: 'left', color: 'var(--accent-blue)' }}>₪{totalGrossSalary.toLocaleString()}</td>
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
              <td style={{ padding: '8px' }}>ניכוי חלק עובדת לפנסיה (6% משכר מינימום)</td>
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
          <strong>הפרשות מעסיק לקופת פקדון / פנסיה וביטוח לאומי (לפי מסמך אפריל 2026):</strong>
          <ul style={{ paddingRight: '20px', marginTop: '4px' }}>
            <li>הפקדת פנסיה מעסיק (גמולים 6.5%): ₪{employerPension.toFixed(2)}</li>
            <li>הפקדת פיצויי פיטורין (8.33%): ₪{employerSeverance.toFixed(2)}</li>
            <li>תשלום דמי ביטוח לאומי מעסיק (3.6%): ₪{employerBituachLeumi.toFixed(2)}</li>
          </ul>
        </div>

        {/* Signatures Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', paddingTop: '20px', borderTop: '1px dashed var(--border-color)' }}>
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
