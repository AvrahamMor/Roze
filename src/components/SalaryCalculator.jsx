import React, { useState } from 'react';
import { LEGAL_RULES } from '../data/legalRules';
import { CONTRACT_DATA } from '../data/contractData';
import { Calculator, DollarSign, Shield, Info, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function SalaryCalculator({ holidayWorkedCount = 0 }) {
  // State variables for monthly calculation - April 2026 document defaults
  const [grossSalaryBase, setGrossSalaryBase] = useState(LEGAL_RULES.grossMonthlySalary); // 6,443.85 NIS
  const [saturdaysCount, setSaturdaysCount] = useState(CONTRACT_DATA.agreedRates.defaultSaturdaysPerMonth);
  const [saturdayRate, setSaturdayRate] = useState(LEGAL_RULES.saturdayExtraRate); // 440 NIS
  
  const [holidaysCount, setHolidaysCount] = useState(holidayWorkedCount);
  const [holidayRate, setHolidayRate] = useState(LEGAL_RULES.holidayExtraRate); // 440 NIS

  const [healthInsuranceTotal, setHealthInsuranceTotal] = useState(240); 
  const [healthInsuranceDeduction, setHealthInsuranceDeduction] = useState(LEGAL_RULES.maxDeductions.healthInsurance);
  
  const [housingDeduction, setHousingDeduction] = useState(300); 
  const [includeWorkerPensionDeduction, setIncludeWorkerPensionDeduction] = useState(true);

  // Synchronize when holiday count updates from calendar tab
  React.useEffect(() => {
    if (holidayWorkedCount !== undefined) {
      setHolidaysCount(holidayWorkedCount);
    }
  }, [holidayWorkedCount]);

  // Calculations
  const saturdayExtraTotal = saturdaysCount * saturdayRate;
  const holidayExtraTotal = holidaysCount * holidayRate;
  
  // Total Gross salary (Base gross + extra Saturdays + extra Holidays)
  const totalGrossSalary = grossSalaryBase + saturdayExtraTotal + holidayExtraTotal;

  // Employer Contributions (עלויות מעסיק נוספות לפי מסמך אפריל 2026)
  const employerPension = LEGAL_RULES.minimumMonthlySalary * LEGAL_RULES.employerPensionRate; // 6.5% of min wage = 382.20 NIS
  const employerSeverance = grossSalaryBase * LEGAL_RULES.employerSeveranceRate; // 8.33% of gross = 536.77 NIS
  const employerSocialTotal = employerPension + employerSeverance; 
  
  const employerBituachLeumi = totalGrossSalary * LEGAL_RULES.employerBituachLeumiRate; // 3.6% of gross (April 2026 doc)
  
  // Employer Health Insurance Net Cost
  const netEmployerHealthInsurance = Math.max(0, healthInsuranceTotal - healthInsuranceDeduction);

  // Total Employer Monthly Cost (עלות מעביד כוללת)
  const totalEmployerMonthlyCost = totalGrossSalary + employerSocialTotal + employerBituachLeumi + netEmployerHealthInsurance;

  // Worker Salary Deductions (ניכויים משכר העובדת)
  const workerPensionDeduction = includeWorkerPensionDeduction ? (LEGAL_RULES.minimumMonthlySalary * LEGAL_RULES.workerPensionDeductionRate) : 0;
  const totalWorkerDeductions = workerPensionDeduction + healthInsuranceDeduction + housingDeduction;

  // Net Cash Salary to Employee (שכר נטו לתשלום לעובדת)
  const netWorkerSalary = Math.max(0, totalGrossSalary - totalWorkerDeductions);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'var(--gradient-glow)', borderColor: 'var(--border-accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calculator style={{ color: 'var(--accent-blue)' }} size={28} />
              מחשבון שכר ועלות מעסיק חודשית (מעודכן אפריל 2026)
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              חישוב מבוסס על מסמך "תנאי העסקה אפריל 2026": ברוטו 6,443.85 ₪, שבת/חג 440 ₪, ביטוח לאומי 3.6%.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="badge badge-emerald">
              <CheckCircle2 size={14} /> ברוטו 6,443.85 ₪
            </span>
            <span className="badge badge-amber">
              <Shield size={14} /> שבת/חג 440 ₪
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Calculation Parameters */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', pb: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} style={{ color: 'var(--accent-indigo)' }} />
            פרמטרים ונתוני שכר (אפריל 2026)
          </h3>

          {/* Base Gross Salary */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>
              שכר חודשי ברוטו (לפי מסמך תנאי העסקה)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="number" 
                value={grossSalaryBase} 
                onChange={(e) => setGrossSalaryBase(Number(e.target.value))} 
                step="10"
              />
              <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>₪</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              מבוסס על מסמך אפריל 2026: 6,443.85 ₪ (כולל מקדמה שבועית 100 ₪)
            </span>
          </div>

          {/* Saturday Allowance */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--accent-amber)' }}>
                עבודת שבת (מנוחה שבועית - 25 שעות)
              </label>
              <span className="badge badge-amber">+440 ₪ לשבת</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>מספר שבתות בחודש:</span>
                <input 
                  type="number" 
                  value={saturdaysCount} 
                  onChange={(e) => setSaturdaysCount(Number(e.target.value))} 
                  min="0" max="5"
                />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>תעריף לשבת (₪):</span>
                <input 
                  type="number" 
                  value={saturdayRate} 
                  onChange={(e) => setSaturdayRate(Number(e.target.value))} 
                />
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', textAlign: 'left' }}>
              סך תוספת שבת: <span style={{ color: 'var(--accent-amber)' }}>+{saturdayExtraTotal.toLocaleString()} ₪</span>
            </div>
          </div>

          {/* Holidays Allowance */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--accent-purple)' }}>
                עבודה בחגים (תוספת חג)
              </label>
              <span className="badge badge-purple">+440 ₪ לחג</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ימי חג שעובדים בחודש:</span>
                <input 
                  type="number" 
                  value={holidaysCount} 
                  onChange={(e) => setHolidaysCount(Number(e.target.value))} 
                  min="0" max="10"
                />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>תעריף לחג (₪):</span>
                <input 
                  type="number" 
                  value={holidayRate} 
                  onChange={(e) => setHolidayRate(Number(e.target.value))} 
                />
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', textAlign: 'left' }}>
              סך תוספת חגים: <span style={{ color: 'var(--accent-purple)' }}>+{holidayExtraTotal.toLocaleString()} ₪</span>
            </div>
          </div>

          {/* Health Insurance & Allowed Deductions */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: 'var(--accent-cyan)' }}>
              ביטוח בריאות וניכויים מותרים משכר העובדת
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>עלות כוללת פוליסת ביטוח בריאות פרטי:</span>
                <input 
                  type="number" 
                  value={healthInsuranceTotal} 
                  onChange={(e) => setHealthInsuranceTotal(Number(e.target.value))} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ניכוי ביטוח בריאות מעובדת:</span>
                  <input 
                    type="number" 
                    value={healthInsuranceDeduction} 
                    onChange={(e) => setHealthInsuranceDeduction(Number(e.target.value))} 
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>מקסימום בחוק: 154.20 ₪</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ניכוי מגורים ונילווים:</span>
                  <input 
                    type="number" 
                    value={housingDeduction} 
                    onChange={(e) => setHousingDeduction(Number(e.target.value))} 
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>מקסימום בחוק: ~446.50 ₪</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input 
                  type="checkbox" 
                  id="pensionCheck"
                  checked={includeWorkerPensionDeduction} 
                  onChange={(e) => setIncludeWorkerPensionDeduction(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="pensionCheck" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  ניכוי חלק עובדת לפנסיה (6% משכר מינימום = { (LEGAL_RULES.minimumMonthlySalary * 0.06).toFixed(2) } ₪)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary & Breakdown Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* TOTAL COST CARD FOR EMPLOYER */}
          <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))', border: '1.5px solid var(--accent-blue)', boxShadow: 'var(--shadow-glow)' }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
              סיכום כולל חודשי (אפריל 2026)
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  סה"כ עלות חודשית כוללת למעסיק
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  (שכר ברוטו + פנסיה/פיצויים + ביטוח לאומי 3.6% + ביטוח בריאות)
                </span>
              </div>
              <div style={{ textBaseline: 'bottom' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8' }}>
                  ₪{Math.round(totalEmployerMonthlyCost).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Direct Cash Payment to Employee */}
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  שכר נטו לתשלום בפועל לעובדת
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  (תשלום חודשי במזומן / העברה בנקאית)
                </span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                ₪{Math.round(netWorkerSalary).toLocaleString()}
              </div>
            </div>
          </div>

          {/* EMPLOYER SOCIAL OBLIGATIONS BREAKDOWN */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: 'var(--accent-indigo)' }} />
              פירוט הפרשות סוציאליות וביטוחים (מעסיק)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Pension 6.5% */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span>פנסיה מעסיק (גמולים 6.5% משכר מינימום):</span>
                <span style={{ fontWeight: 700 }}>₪{employerPension.toFixed(2)}</span>
              </div>

              {/* Severance 8.33% */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span>פיצויי פיטורין מעסיק (8.33% מהברוטו):</span>
                <span style={{ fontWeight: 700 }}>₪{employerSeverance.toFixed(2)}</span>
              </div>

              {/* Total Social Deposit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', borderRight: '3px solid var(--accent-indigo)', fontSize: '0.92rem', fontWeight: 700 }}>
                <span>סה"כ להפקדה חודשית לקופה/פקדון (פנסיה + פיצויים):</span>
                <span style={{ color: 'var(--accent-indigo)' }}>₪{employerSocialTotal.toFixed(2)}</span>
              </div>

              {/* Bituach Leumi 3.6% */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span>ביטוח לאומי מעסיק (3.6% מהברוטו לפי מסמך אפריל 2026):</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>₪{employerBituachLeumi.toFixed(2)}</span>
              </div>

              {/* Employer Health Insurance portion */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span>עלות מעסיק נטו לביטוח בריאות פרטי:</span>
                <span style={{ fontWeight: 700 }}>₪{netEmployerHealthInsurance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* DEDUCTIONS SUMMARY */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: 'var(--accent-amber)' }}>
              סיכום ניכויים מותרים משכר העובדת
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>ניכוי חלק עובדת לפנסיה (6%):</span>
                <span>₪{workerPensionDeduction.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>ניכוי ביטוח בריאות:</span>
                <span>₪{healthInsuranceDeduction.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>ניכוי מגורים וחשבונות (מים/חשמל):</span>
                <span>₪{housingDeduction.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', pt: '8px', fontWeight: 700, color: 'var(--accent-amber)' }}>
                <span>סה"כ ניכויים משכר ברוטו:</span>
                <span>-₪{totalWorkerDeductions.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Visual Cost Distribution Bar */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
          התפלגות ויזואלית של עלות המעסיק החודשית (אפריל 2026)
        </h4>
        <div style={{ width: '100%', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${(netWorkerSalary / totalEmployerMonthlyCost) * 100}%`, background: 'var(--accent-emerald)' }} />
          <div style={{ width: `${(employerSocialTotal / totalEmployerMonthlyCost) * 100}%`, background: 'var(--accent-indigo)' }} />
          <div style={{ width: `${(employerBituachLeumi / totalEmployerMonthlyCost) * 100}%`, background: 'var(--accent-blue)' }} />
          <div style={{ width: `${(saturdayExtraTotal / totalEmployerMonthlyCost) * 100}%`, background: 'var(--accent-amber)' }} />
          <div style={{ width: `${(holidayExtraTotal / totalEmployerMonthlyCost) * 100}%`, background: 'var(--accent-purple)' }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
            נטו לעובדת: {Math.round((netWorkerSalary / totalEmployerMonthlyCost) * 100)}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-indigo)' }} />
            פנסיה/פיצויים (14%): {Math.round((employerSocialTotal / totalEmployerMonthlyCost) * 100)}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
            ביטוח לאומי (3.6%): {Math.round((employerBituachLeumi / totalEmployerMonthlyCost) * 100)}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
            תוספת שבת: {Math.round((saturdayExtraTotal / totalEmployerMonthlyCost) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
