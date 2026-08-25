import React, { useState } from 'react';
import { LEGAL_RULES } from '../data/legalRules';
import { PiggyBank, FileText, ShieldAlert, Award, Clock, Coins, CheckCircle, Calculator, Info, Sparkles, TrendingUp } from 'lucide-react';

export default function OfficialTerms2026() {
  const [seniorityYears, setSeniorityYears] = useState(1); // Default Year 1
  const [severanceType, setSeveranceType] = useState('dismissal'); // 'dismissal' (8.33%) | 'resignation' (6%)

  // Calculation parameters based on official 2026 terms
  const grossSalary = LEGAL_RULES.grossMonthlySalary; // 6,443.85
  const baseMinimumWage = LEGAL_RULES.minimumMonthlySalary; // 5,880.02

  // 1. Severance Reserve (פיצויים)
  const severanceRate = severanceType === 'dismissal' ? 0.0833 : 0.06;
  const monthlySeveranceReserve = grossSalary * severanceRate; // 536.77 NIS / mo for 8.33%

  // 2. Pension Reserve (פנסיה גמולים 6.5%)
  const monthlyPensionReserve = baseMinimumWage * LEGAL_RULES.employerPensionRate; // 382.20 NIS / mo

  // 3. Convalescence Reserve (דמי הבראה)
  let convalescenceDays = 5;
  if (seniorityYears >= 2 && seniorityYears <= 3) convalescenceDays = 6;
  if (seniorityYears >= 4) convalescenceDays = 7;
  const annualConvalescenceCost = convalescenceDays * LEGAL_RULES.convalescenceDayValue; // 5 * 418 = 2090 NIS
  const monthlyConvalescenceReserve = annualConvalescenceCost / 12; // 174.17 NIS / mo

  // 4. Annual Vacation Reserve (חופשה שנתית - ערך יום 257.75 ₪)
  let vacationDays = 14;
  if (seniorityYears === 6) vacationDays = 16;
  if (seniorityYears >= 7) vacationDays = 18;
  const annualVacationCost = vacationDays * LEGAL_RULES.vacationDayValue; // 14 * 257.75 = 3608.50 NIS
  const monthlyVacationReserve = annualVacationCost / 12; // 300.71 NIS / mo

  // 5. Bituach Leumi Employer (3.6% מהברוטו)
  const monthlyBituachLeumi = grossSalary * LEGAL_RULES.employerBituachLeumiRate; // 231.98 NIS / mo

  // 6. Agency & State Permits Monthly Provisions
  const monthlyAgencyFee = LEGAL_RULES.agencyFees.monthlyAgencyFee; // 70 NIS / mo
  const monthlyPermitFee = LEGAL_RULES.agencyFees.permitIssuanceAnnualFee / 12; // 370 / 12 = 30.83 NIS / mo

  // TOTAL MONTHLY MONEY TO SET ASIDE (קופת עתודה)
  const totalMonthlyReserveNeeded = 
    monthlySeveranceReserve + 
    monthlyPensionReserve + 
    monthlyConvalescenceReserve + 
    monthlyVacationReserve + 
    monthlyBituachLeumi + 
    monthlyAgencyFee + 
    monthlyPermitFee;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ 
        padding: '24px 28px', 
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(99, 102, 241, 0.12))', 
        borderColor: 'rgba(245, 158, 11, 0.35)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <FileText style={{ color: 'var(--accent-amber)' }} size={28} />
              תנאי העסקה מעודכנים – הסכם 2026 (מסמך רשמי)
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.92rem' }}>
              פירוט מלא של כל הסכומים, ערכי הימים, דמי הבראה, חופשות, וחישוב מדויק של <strong>כמה כסף לשים בצד מדי חודש</strong>.
            </p>
          </div>

          <span className="badge badge-amber" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
            <Award size={16} /> תנאים בתוקף 2026
          </span>
        </div>
      </div>

      {/* RESERVE FUND CALCULATOR (כמה לשים בצד מדי חודש) */}
      <div className="glass-card" style={{ 
        padding: '26px', 
        border: '1.5px solid rgba(245, 158, 11, 0.4)', 
        background: 'var(--gradient-card-hero)', 
        boxShadow: 'var(--shadow-md)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <PiggyBank size={28} style={{ color: 'var(--accent-amber)' }} />
              קופת עתודה: כמה כסף המעסיק צריך לשים בצד מדי חודש?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              חישוב ההפרשות, הזכויות הסוציאליות, והתשלומים התקופתיים כדי למנוע הפתעות וחובות בסיום ההעסקה.
            </p>
          </div>

          {/* Controls: Seniority & Severance type */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>וותק העובדת:</span>
              <select 
                value={seniorityYears} 
                onChange={(e) => setSeniorityYears(Number(e.target.value))}
                style={{ padding: '6px 14px', fontSize: '0.85rem', minHeight: '38px' }}
              >
                <option value={1}>שנה 1 (14 ימי חופשה, 5 ימי הבראה)</option>
                <option value={2}>שנים 2-3 (14 ימי חופשה, 6 ימי הבראה)</option>
                <option value={4}>שנים 4-5 (14 ימי חופשה, 7 ימי הבראה)</option>
                <option value={6}>שנה 6 (16 ימי חופשה, 7 ימי הבראה)</option>
                <option value={7}>שנה 7+ (18 ימי חופשה, 7 ימי הבראה)</option>
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>שיעור פיצויים:</span>
              <select 
                value={severanceType} 
                onChange={(e) => setSeveranceType(e.target.value)}
                style={{ padding: '6px 14px', fontSize: '0.85rem', minHeight: '38px' }}
              >
                <option value="dismissal">פיטורין (8.33% מתוך 6,443.85 ₪)</option>
                <option value="resignation">התפטרות (6.0% מתוך 6,443.85 ₪)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Big Summary Badge */}
        <div style={{ 
          background: 'rgba(245, 158, 11, 0.12)', 
          border: '1.5px solid rgba(245, 158, 11, 0.4)', 
          padding: '20px 24px', 
          borderRadius: 'var(--radius-lg)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(245, 158, 11, 0.12)'
        }}>
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              סה"כ כסף מומלץ לשים בצד מדי חודש (קופת עתודה סוציאלית)
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              כולל פיצויים, פנסיה, דמי הבראה, פדיון חופשה, ביטוח לאומי ותשלומים תקופתיים
            </div>
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.5px' }} className="text-gradient-amber">
            ₪{Math.round(totalMonthlyReserveNeeded).toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ חודש</span>
          </div>
        </div>

        {/* Detailed Table Breakdown of Reserve Fund */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px', textAlign: 'right' }}>רכיב עתודה / הפרשה</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>בסיס חישוב / נוסחה בחוק</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>סכום חודשי לשים בצד (₪)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>
                  1. פיצויי פיטורין ({severanceType === 'dismissal' ? '8.33%' : '6.0%'})
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {severanceType === 'dismissal' ? '8.33% × 6,443.85 ₪' : '6.0% × 6,443.85 ₪'}
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  ₪{monthlySeveranceReserve.toFixed(2)}
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>
                  2. פנסיה מעסיק (גמולים 6.5%)
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  6.5% × 5,880.02 ₪ (שכר מינימום)
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: 'var(--accent-indigo)' }}>
                  ₪{monthlyPensionReserve.toFixed(2)}
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>
                  3. דמי הבראה ({convalescenceDays} ימים בשנה)
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  ({convalescenceDays} ימים × 418 ₪) ÷ 12 חודשים
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>
                  ₪{monthlyConvalescenceReserve.toFixed(2)}
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>
                  4. צבירת חופשה שנתית ({vacationDays} ימים)
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  ({vacationDays} ימים × 257.75 ₪) ÷ 12 חודשים
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>
                  ₪{monthlyVacationReserve.toFixed(2)}
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>
                  5. ביטוח לאומי מעסיק (3.6%)
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  3.6% × 6,443.85 ₪
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: 'var(--accent-blue)' }}>
                  ₪{monthlyBituachLeumi.toFixed(2)}
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>
                  6. דמי טיפול חודשיים לתאגיד/לשכה
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  70 ₪ בחודש (איתני מור)
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>
                  ₪{monthlyAgencyFee.toFixed(2)}
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>
                  7. אגרת אשרת עבודה שנתית (ויזה)
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  370 ₪ לשנה ÷ 12 חודשים
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>
                  ₪{monthlyPermitFee.toFixed(2)}
                </td>
              </tr>

              <tr style={{ background: 'rgba(245, 158, 11, 0.1)', fontWeight: 800, fontSize: '1.05rem' }}>
                <td style={{ padding: '14px', color: 'var(--accent-amber)' }}>
                  סה"כ קופת עתודה חודשית לשים בצד:
                </td>
                <td style={{ padding: '14px', textAlign: 'center' }}>
                  (ללא תשלום השכר השוטף)
                </td>
                <td style={{ padding: '14px', textAlign: 'left', color: 'var(--accent-amber)', fontSize: '1.2rem', fontFamily: 'Plus Jakarta Sans' }}>
                  ₪{totalMonthlyReserveNeeded.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ALL VALUES MASTER REFERENCE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Salary & Overtime Rates Card */}
        <div className="glass-card" style={{ padding: '22px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coins size={20} /> תעריפי שכר ושעות נוספות (2026)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>שכר חודשי ברוטו מלא:</span>
              <strong style={{ fontFamily: 'Plus Jakarta Sans' }}>6,443.85 ₪</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>שכר מינימום בסיס:</span>
              <strong style={{ fontFamily: 'Plus Jakarta Sans' }}>5,880.02 ₪</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>ערך יום עבודה (חופשה):</span>
              <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'Plus Jakarta Sans' }}>257.75 ₪</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>תעריף שבת (25 שעות):</span>
              <strong style={{ color: 'var(--accent-amber)', fontFamily: 'Plus Jakarta Sans' }}>440.00 ₪</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>תעריף עבודה בחג:</span>
              <strong style={{ color: 'var(--accent-purple)', fontFamily: 'Plus Jakarta Sans' }}>440.00 ₪</strong>
            </div>
          </div>
        </div>

        {/* Annual Entitlements (הבראה וחופשה) */}
        <div className="glass-card" style={{ padding: '22px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} /> דמי הבראה וחופשה שנתית
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>ערך יום הבראה:</span>
              <strong style={{ color: 'var(--accent-emerald)', fontFamily: 'Plus Jakarta Sans' }}>418.00 ₪</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>הבראה שנה 1 (5 ימים):</span>
              <strong style={{ fontFamily: 'Plus Jakarta Sans' }}>2,090.00 ₪</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>הבראה שנים 2-3 (6 ימים):</span>
              <strong style={{ fontFamily: 'Plus Jakarta Sans' }}>2,508.00 ₪</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>חופשה שנתית (שנים 1-5):</span>
              <strong style={{ fontFamily: 'Plus Jakarta Sans' }}>14 ימים (1.16/חודש)</strong>
            </div>
          </div>
        </div>

        {/* Agency & Permits Costs */}
        <div className="glass-card" style={{ padding: '22px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-purple)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} /> אגרות ותשלומי תאגיד
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>דמי טיפול לשכה חודשיים:</span>
              <strong style={{ fontFamily: 'Plus Jakarta Sans' }}>70.00 ₪ / חודש</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>אגרת היתר העסקה שנתית:</span>
              <strong style={{ fontFamily: 'Plus Jakarta Sans' }}>370.00 ₪ / שנה</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>דמי השמה חד פעמיים:</span>
              <strong style={{ fontFamily: 'Plus Jakarta Sans' }}>2,000.00 ₪</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>ביטוח לאומי מעסיק:</span>
              <strong style={{ color: 'var(--accent-blue)', fontFamily: 'Plus Jakarta Sans' }}>3.6% מהברוטו</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
