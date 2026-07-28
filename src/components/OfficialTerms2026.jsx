import React, { useState } from 'react';
import { LEGAL_RULES } from '../data/legalRules';
import { PiggyBank, FileText, ShieldAlert, Award, Clock, Coins, CheckCircle, Calculator, Info } from 'lucide-react';

export default function OfficialTerms2026() {
  const [seniorityYears, setSeniorityYears] = useState(1); // Default Year 1
  const [severanceType, setSeveranceType] = useState('dismissal'); // 'dismissal' (8.33%) | 'resignation' (6%)

  // Calculation parameters based on April 2026 document
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
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(99,102,241,0.15))', borderColor: 'var(--accent-amber)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText style={{ color: 'var(--accent-amber)' }} size={28} />
              תנאי העסקה מעודכנים - אפריל 2026 (מסמך רשמי)
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              פירוט מלא של כל הסכומים, ערכי הימים, דמי הבראה, חופשות, וחישוב מדויק של <strong>כמה כסף לשים בצד מדי חודש</strong>.
            </p>
          </div>

          <span className="badge badge-amber" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
            <Award size={18} /> מסמך תנאים אפריל 2026
          </span>
        </div>
      </div>

      {/* RESERVE FUND CALCULATOR (כמה לשים בצד מדי חודש) */}
      <div className="glass-card" style={{ padding: '24px', border: '1.5px solid var(--accent-amber)', background: 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))', boxShadow: 'var(--shadow-glow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', pb: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PiggyBank size={30} style={{ color: 'var(--accent-amber)' }} />
              קופת עתודה: כמה כסף המעסיק צריך לשים בצד מדי חודש?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
              חישוב ההפרשות, הזכויות הסוציאליות, והתשלומים התקופתיים כדי למנוע הפתעות וחובות בסיום ההעסקה.
            </p>
          </div>

          {/* Controls: Seniority & Severance type */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>וותק העובדת:</span>
              <select 
                value={seniorityYears} 
                onChange={(e) => setSeniorityYears(Number(e.target.value))}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <option value={1}>שנה 1 (14 ימי חופשה, 5 ימי הבראה)</option>
                <option value={2}>שנים 2-3 (14 ימי חופשה, 6 ימי הבראה)</option>
                <option value={4}>שנים 4-5 (14 ימי חופשה, 7 ימי הבראה)</option>
                <option value={6}>שנה 6 (16 ימי חופשה, 7 ימי הבראה)</option>
                <option value={7}>שנה 7+ (18 ימי חופשה, 7 ימי הבראה)</option>
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>שיעור פיצויים:</span>
              <select 
                value={severanceType} 
                onChange={(e) => setSeveranceType(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <option value="dismissal">פיטורין (8.33% מתוך 6,443.85 ₪)</option>
                <option value="resignation">התפטרות (6.0% מתוך 6,443.85 ₪)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Big Summary Badge */}
        <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
              סה"כ כסף מומלץ לשים בצד מדי חודש (קופת עתודה סוציאלית)
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              כולל פיצויים, פנסיה, דמי הבראה, פדיון חופשה, ביטוח לאומי ותשלומים תקופתיים
            </div>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            ₪{Math.round(totalMonthlyReserveNeeded).toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ חודש</span>
          </div>
        </div>

        {/* Detailed Table Breakdown of Reserve Fund */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px', textAlign: 'right' }}>רכיב עתודה / הפרשה</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>בסיס חישוב / נוסחה בחוק</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>סכום חודשי לשים בצד (₪)</th>
              </tr>
            </thead>
            <tbody>
              {/* Severance */}
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>
                  <strong>פיצויי פיטורין / התפטרות</strong>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {severanceType === 'dismissal' ? '8.33%' : '6.0%'} מתוך ברוטו 6,443.85 ₪
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  ₪{monthlySeveranceReserve.toFixed(2)}
                </td>
              </tr>

              {/* Pension */}
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>
                  <strong>פנסיה מעסיק (גמולים)</strong>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  6.5% מתוך שכר מינימום 5,880.02 ₪
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: 'var(--accent-indigo)' }}>
                  ₪{monthlyPensionReserve.toFixed(2)}
                </td>
              </tr>

              {/* Convalescence */}
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>
                  <strong>דמי הבראה (צבירה חודשית)</strong>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {convalescenceDays} ימים בשנה × 418 ₪ = ₪{annualConvalescenceCost} לשנה
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  ₪{monthlyConvalescenceReserve.toFixed(2)}
                </td>
              </tr>

              {/* Vacation Accrual */}
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>
                  <strong>פדיון ימי חופשה שנתית (צבירה)</strong>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {vacationDays} ימים בשנה × 257.75 ₪ = ₪{annualVacationCost} לשנה
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: 'var(--accent-purple)' }}>
                  ₪{monthlyVacationReserve.toFixed(2)}
                </td>
              </tr>

              {/* Bituach Leumi */}
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>
                  <strong>דמי ביטוח לאומי מעסיק</strong>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  3.6% מתוך ברוטו 6,443.85 ₪ (לפי מסמך אפריל 2026)
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: 'var(--accent-blue)' }}>
                  ₪{monthlyBituachLeumi.toFixed(2)}
                </td>
              </tr>

              {/* Agency monthly fee */}
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>
                  <strong>דמי ליווי תאגיד חודשיים (איתני מור)</strong>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  70 ₪ לחודש (840 ₪ לשנה)
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>
                  ₪{monthlyAgencyFee.toFixed(2)}
                </td>
              </tr>

              {/* Annual Permit Fee */}
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>
                  <strong>אגרת היתר העסקה שנתית (חלק חודשי)</strong>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  370 ₪ לשנה ÷ 12 חודשים
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>
                  ₪{monthlyPermitFee.toFixed(2)}
                </td>
              </tr>

              {/* TOTAL */}
              <tr style={{ fontWeight: 800, background: 'rgba(255,255,255,0.05)', fontSize: '1rem' }}>
                <td style={{ padding: '14px' }}>סה"כ עתודה חודשית כוללת למעסיק:</td>
                <td style={{ padding: '14px' }}></td>
                <td style={{ padding: '14px', textAlign: 'left', color: 'var(--accent-amber)' }}>
                  ₪{totalMonthlyReserveNeeded.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL CLAUSES BREAKDOWN FROM APRIL 2026 DOCUMENT */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={22} />
          עיקרי התנאים המלאים מתוך קובץ "אפריל 2026"
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', fontSize: '0.9rem' }}>
          
          {/* Box 1: Rates */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', borderRight: '3px solid var(--accent-amber)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '8px' }}>
              💰 תעריפי שבת, חגים וחופשה (מעודכן)
            </h4>
            <ul style={{ paddingRight: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-main)' }}>
              <li><strong>משכורת חודשית ברוטו:</strong> 6,443.85 ₪ (כולל מקדמה שבועית 100 ₪).</li>
              <li><strong>יום חופשה שבועית (שבת - 25 שעות):</strong> 440 ₪.</li>
              <li><strong>יום חג (מתוך 9 חגים בשנה):</strong> 440 ₪.</li>
              <li><strong>ערך יום חופשה שנתית:</strong> 257.75 ₪ / יום.</li>
              <li><strong>ערך יום הבראה:</strong> 418 ₪ / יום.</li>
            </ul>
          </div>

          {/* Box 2: Sick Leave */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', borderRight: '3px solid var(--accent-rose)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '8px' }}>
              🏥 דמי מחלה וצבירה
            </h4>
            <ul style={{ paddingRight: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-main)' }}>
              <li><strong>צבירת ימי מחלה:</strong> 1.5 ימים לכל חודש עבודה (עד מקסימום 90 יום).</li>
              <li><strong>יום מחלה 1:</strong> ללא תשלום.</li>
              <li><strong>ימים 2 ו-3:</strong> 50% משכר העבודה היומי.</li>
              <li><strong>יום 4 ואילך:</strong> 100% משכר העבודה היומי.</li>
            </ul>
          </div>

          {/* Box 3: Advance Notice */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', borderRight: '3px solid var(--accent-cyan)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              ⏱️ הודעה מוקדמת לפיטורין / התפטרות
            </h4>
            <ul style={{ paddingRight: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-main)' }}>
              <li><strong>עד 6 חודשי עבודה:</strong> יום הודעה מראש בגין כל חודש.</li>
              <li><strong>מהחודש ה-7 עד שנה:</strong> 2.5 ימים לכל חודש.</li>
              <li><strong>שנה ומעלה:</strong> חודש ימים מראש.</li>
              <li>במקרה של התפטרות העובדת עליה לתת הודעה מוקדמת מראש בכתב עם העתק לתאגיד.</li>
            </ul>
          </div>

          {/* Box 4: Taxes & Agency Fees */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', borderRight: '3px solid var(--accent-purple)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '8px' }}>
              🏛️ תשלומי חובה ואגרות (Page 2)
            </h4>
            <ul style={{ paddingRight: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-main)' }}>
              <li><strong>ביטוח לאומי (מעסיק):</strong> 3.6% מהברוטו לחודש.</li>
              <li><strong>אגרת הנפקת/חידוש היתר העסקה:</strong> 370 ₪.</li>
              <li><strong>אגרת ויזה בהזמנה מחו"ל:</strong> 205 ₪ (הארכת ויזה 205 ₪ ע"ח העובד).</li>
              <li><strong>דמי השמה לתאגיד:</strong> 2,000 ₪ כולל מע"מ (חד פעמי).</li>
              <li><strong>דמי תאגיד לשנה:</strong> 840 ₪ (70 ₪ / חודש).</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
