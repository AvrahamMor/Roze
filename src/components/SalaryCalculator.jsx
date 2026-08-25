import React, { useState, useEffect } from 'react';
import { LEGAL_RULES } from '../data/legalRules';
import { CONTRACT_DATA } from '../data/contractData';
import { saveSalaryRecord } from '../services/dbService';
import { 
  Calculator, 
  DollarSign, 
  Shield, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  Cloud, 
  CloudCheck, 
  Save, 
  Calendar, 
  FileText,
  TrendingUp,
  Wallet,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

export default function SalaryCalculator({ holidayWorkedCount = 0, loadedRecord = null, onSelectTab = null }) {
  // Calculation month/year identifier - default to current / relevant month
  const [monthYear, setMonthYear] = useState('2026-08');
  const [calculationNotes, setCalculationNotes] = useState('');

  // State variables for monthly calculation
  const [grossSalaryBase, setGrossSalaryBase] = useState(LEGAL_RULES.grossMonthlySalary); // 6,443.85 NIS
  const [saturdaysCount, setSaturdaysCount] = useState(CONTRACT_DATA.agreedRates.defaultSaturdaysPerMonth);
  const [saturdayRate, setSaturdayRate] = useState(LEGAL_RULES.saturdayExtraRate); // 440 NIS
  
  const [holidaysCount, setHolidaysCount] = useState(holidayWorkedCount);
  const [holidayRate, setHolidayRate] = useState(LEGAL_RULES.holidayExtraRate); // 440 NIS

  const [healthInsuranceTotal, setHealthInsuranceTotal] = useState(240); 
  const [healthInsuranceDeduction, setHealthInsuranceDeduction] = useState(LEGAL_RULES.maxDeductions.healthInsurance);
  
  const [housingDeduction, setHousingDeduction] = useState(300); 
  const [includeWorkerPensionDeduction, setIncludeWorkerPensionDeduction] = useState(true);

  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Month label helper (e.g. "אוגוסט 2026")
  const getMonthLabel = (my) => {
    try {
      const [year, month] = my.split('-');
      const d = new Date(parseInt(year), parseInt(month) - 1, 1);
      return d.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
    } catch (e) {
      return my;
    }
  };

  const currentMonthLabel = getMonthLabel(monthYear);

  // Load record into calculator if provided
  useEffect(() => {
    if (loadedRecord) {
      if (loadedRecord.monthYear) setMonthYear(loadedRecord.monthYear);
      if (loadedRecord.grossSalaryBase !== undefined) setGrossSalaryBase(loadedRecord.grossSalaryBase);
      if (loadedRecord.saturdaysCount !== undefined) setSaturdaysCount(loadedRecord.saturdaysCount);
      if (loadedRecord.saturdayRate !== undefined) setSaturdayRate(loadedRecord.saturdayRate);
      if (loadedRecord.holidaysCount !== undefined) setHolidaysCount(loadedRecord.holidaysCount);
      if (loadedRecord.holidayRate !== undefined) setHolidayRate(loadedRecord.holidayRate);
      if (loadedRecord.healthInsuranceTotal !== undefined) setHealthInsuranceTotal(loadedRecord.healthInsuranceTotal);
      if (loadedRecord.healthInsuranceDeduction !== undefined) setHealthInsuranceDeduction(loadedRecord.healthInsuranceDeduction);
      if (loadedRecord.housingDeduction !== undefined) setHousingDeduction(loadedRecord.housingDeduction);
      if (loadedRecord.includeWorkerPensionDeduction !== undefined) setIncludeWorkerPensionDeduction(loadedRecord.includeWorkerPensionDeduction);
      if (loadedRecord.notes !== undefined) setCalculationNotes(loadedRecord.notes);
      
      setSaveStatus({
        type: 'info',
        text: `נטענו נתוני חישוב של חודש ${loadedRecord.monthLabel || loadedRecord.monthYear}`
      });
    }
  }, [loadedRecord]);

  // Synchronize when holiday count updates from calendar tab (if not loaded from record)
  useEffect(() => {
    if (!loadedRecord && holidayWorkedCount !== undefined) {
      setHolidaysCount(holidayWorkedCount);
    }
  }, [holidayWorkedCount, loadedRecord]);

  // Calculations
  const saturdayExtraTotal = saturdaysCount * saturdayRate;
  const holidayExtraTotal = holidaysCount * holidayRate;
  
  // Total Gross salary (Base gross + extra Saturdays + extra Holidays)
  const totalGrossSalary = grossSalaryBase + saturdayExtraTotal + holidayExtraTotal;

  // Employer Contributions (עלויות מעסיק נוספות)
  const employerPension = LEGAL_RULES.minimumMonthlySalary * LEGAL_RULES.employerPensionRate; // 6.5% of min wage = 382.20 NIS
  const employerSeverance = grossSalaryBase * LEGAL_RULES.employerSeveranceRate; // 8.33% of gross = 536.77 NIS
  const employerSocialTotal = employerPension + employerSeverance; 
  
  const employerBituachLeumi = totalGrossSalary * LEGAL_RULES.employerBituachLeumiRate; // 3.6% of gross
  
  // Employer Health Insurance Net Cost
  const netEmployerHealthInsurance = Math.max(0, healthInsuranceTotal - healthInsuranceDeduction);

  // Total Employer Monthly Cost (עלות מעביד כוללת)
  const totalEmployerMonthlyCost = totalGrossSalary + employerSocialTotal + employerBituachLeumi + netEmployerHealthInsurance;

  // Worker Salary Deductions (ניכויים משכר העובדת)
  const workerPensionDeduction = includeWorkerPensionDeduction ? (LEGAL_RULES.minimumMonthlySalary * LEGAL_RULES.workerPensionDeductionRate) : 0;
  const totalWorkerDeductions = workerPensionDeduction + healthInsuranceDeduction + housingDeduction;

  // Net Cash Salary to Employee (שכר נטו לתשלום לעובדת)
  const netWorkerSalary = Math.max(0, totalGrossSalary - totalWorkerDeductions);

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    const recordData = {
      monthYear,
      monthLabel: currentMonthLabel,
      workerName: CONTRACT_DATA.caregiver.hebName,
      employerName: CONTRACT_DATA.employer.fullName,
      notes: calculationNotes,
      grossSalaryBase,
      saturdaysCount,
      saturdayRate,
      saturdayExtraTotal,
      holidaysCount,
      holidayRate,
      holidayExtraTotal,
      totalGrossSalary,
      employerPension,
      employerSeverance,
      employerSocialTotal,
      employerBituachLeumi,
      healthInsuranceTotal,
      healthInsuranceDeduction,
      netEmployerHealthInsurance,
      totalEmployerMonthlyCost,
      workerPensionDeduction,
      housingDeduction,
      totalWorkerDeductions,
      netWorkerSalary
    };

    try {
      const result = await saveSalaryRecord(recordData);
      if (result.mode === 'cloud') {
        setSaveStatus({
          type: 'success',
          text: `חישוב חודש ${recordData.monthLabel} נשמר וסונכרן בהצלחה בענן Firebase!`
        });
      } else {
        setSaveStatus({
          type: 'success',
          text: `חישוב חודש ${recordData.monthLabel} נשמר בזיכרון המקומי.`
        });
      }
    } catch (err) {
      setSaveStatus({
        type: 'error',
        text: 'שגיאה בשמירת החישוב: ' + err.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner - Luxury Glow Card */}
      <div className="glass-card" style={{ 
        padding: '24px 28px', 
        background: 'var(--gradient-glow)', 
        borderColor: 'rgba(99, 102, 241, 0.25)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 16px rgba(6, 182, 212, 0.35)' }}>
                <Calculator size={22} />
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0 }}>
                מחשבון שכר ועלות מעסיק – <span className="text-gradient-blue">{currentMonthLabel}</span>
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.92rem' }}>
              חישוב שכר ועלויות מלא עבור <strong>{currentMonthLabel}</strong> לפי תנאי ההסכם (ברוטו 6,443.85 ₪, שבת/חג 440 ₪, ביטוח לאומי 3.6%).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-indigo" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
              חודש פעיל: {currentMonthLabel}
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
              <CheckCircle2 size={14} /> ברוטו 6,443.85 ₪
            </span>
            <span className="badge badge-amber" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
              <Shield size={14} /> שבת/חג 440 ₪
            </span>
          </div>
        </div>
      </div>

      {/* Cloud Save & Month Selector Control Bar */}
      <div className="glass-card" style={{ 
        padding: '16px 22px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '16px', 
        background: 'var(--bg-subcard)', 
        border: '1px solid var(--border-color)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} style={{ color: 'var(--accent-blue)' }} />
            <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>בחר חודש לחישוב:</label>
            <input 
              type="month" 
              value={monthYear} 
              onChange={(e) => setMonthYear(e.target.value)}
              style={{ width: '150px', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="text" 
              placeholder={`הערה עבור ${currentMonthLabel} (למשל: מקדמה, בונוס, שבתות)...`}
              value={calculationNotes} 
              onChange={(e) => setCalculationNotes(e.target.value)}
              style={{ width: '280px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            type="button"
            onClick={handleSaveToCloud} 
            disabled={isSaving}
            className="btn-primary" 
            style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
          >
            {isSaving ? <RefreshCw size={16} className="spin-anim" /> : <Save size={16} />}
            {isSaving ? 'שומר בענן...' : `שמור חישוב ${currentMonthLabel} בענן`}
          </button>

          {onSelectTab && (
            <button 
              type="button" 
              onClick={() => onSelectTab('history')}
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              היסטוריית חודשים
            </button>
          )}
        </div>
      </div>

      {/* Save Status Alert */}
      {saveStatus && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.92rem',
          background: saveStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : saveStatus.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
          border: saveStatus.type === 'success' ? '1px solid var(--accent-emerald)' : saveStatus.type === 'error' ? '1px solid var(--accent-rose)' : '1px solid var(--accent-blue)',
          color: saveStatus.type === 'success' ? 'var(--accent-emerald)' : saveStatus.type === 'error' ? 'var(--accent-rose)' : 'var(--accent-blue)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}>
          {saveStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{saveStatus.text}</span>
        </div>
      )}

      {/* Main Grid: Inputs vs Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Calculation Parameters */}
        <div className="glass-card" style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={20} style={{ color: 'var(--accent-indigo)' }} />
            פרמטרים ונתוני שכר – {currentMonthLabel}
          </h3>

          {/* Base Gross Salary */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>
              שכר חודשי ברוטו (לפי הסכם העסקה)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="number" 
                value={grossSalaryBase} 
                onChange={(e) => setGrossSalaryBase(Number(e.target.value))} 
                step="10"
                style={{ fontWeight: 700, fontSize: '1.05rem' }}
              />
              <span style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '1.1rem' }}>₪</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              שכר יסוד מלא: 6,443.85 ₪ (כולל מקדמה שבועית 100 ₪)
            </span>
          </div>

          {/* Saturday Allowance Card */}
          <div style={{ background: 'rgba(245, 158, 11, 0.06)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--accent-amber)' }}>
                עבודת שבת (מנוחה שבועית - 25 שעות)
              </label>
              <span className="badge badge-amber">+440 ₪ לשבת</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>שבתות שעובדת ב-{currentMonthLabel}:</span>
                <input 
                  type="number" 
                  value={saturdaysCount} 
                  onChange={(e) => setSaturdaysCount(Number(e.target.value))} 
                  min="0" max="5"
                  style={{ textAlign: 'center', fontWeight: 700 }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>תעריף לשבת (₪):</span>
                <input 
                  type="number" 
                  value={saturdayRate} 
                  onChange={(e) => setSaturdayRate(Number(e.target.value))} 
                  style={{ textAlign: 'center', fontWeight: 700 }}
                />
              </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.88rem', fontWeight: 700, textAlign: 'left' }}>
              סך תוספת שבת: <span className="text-gradient-amber">+{saturdayExtraTotal.toLocaleString()} ₪</span>
            </div>
          </div>

          {/* Holidays Allowance Card */}
          <div style={{ background: 'rgba(168, 85, 247, 0.06)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--accent-purple)' }}>
                עבודה בחגים (תוספת חג)
              </label>
              <span className="badge badge-purple">+440 ₪ לחג</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>חגים שעובדת ב-{currentMonthLabel}:</span>
                <input 
                  type="number" 
                  value={holidaysCount} 
                  onChange={(e) => setHolidaysCount(Number(e.target.value))} 
                  min="0" max="10"
                  style={{ textAlign: 'center', fontWeight: 700 }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>תעריף לחג (₪):</span>
                <input 
                  type="number" 
                  value={holidayRate} 
                  onChange={(e) => setHolidayRate(Number(e.target.value))} 
                  style={{ textAlign: 'center', fontWeight: 700 }}
                />
              </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.88rem', fontWeight: 700, textAlign: 'left' }}>
              סך תוספת חגים: <span className="text-gradient-purple">+{holidayExtraTotal.toLocaleString()} ₪</span>
            </div>
          </div>

          {/* Health Insurance & Allowed Deductions */}
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-cyan)' }}>
              ביטוח בריאות וניכויים מותרים משכר העובדת
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>עלות כוללת פוליסת ביטוח בריאות פרטי:</span>
                <input 
                  type="number" 
                  value={healthInsuranceTotal} 
                  onChange={(e) => setHealthInsuranceTotal(Number(e.target.value))} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ניכוי ביטוח בריאות:</span>
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
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>מוסכם: 300 ₪ (תקרה 446.50 ₪)</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px' }}>
                <input 
                  type="checkbox" 
                  id="pensionCheck"
                  checked={includeWorkerPensionDeduction} 
                  onChange={(e) => setIncludeWorkerPensionDeduction(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-blue)' }}
                />
                <label htmlFor="pensionCheck" style={{ fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                  ניכוי חלק עובדת לפנסיה (6% משכר מינימום = { (LEGAL_RULES.minimumMonthlySalary * 0.06).toFixed(2) } ₪)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary & Breakdown Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* TOTAL COST HERO CARD FOR EMPLOYER (Fintech Luxury Style) */}
          <div className="glass-card" style={{ 
            padding: '26px', 
            background: 'var(--gradient-card-hero)', 
            border: '1.5px solid rgba(56, 189, 248, 0.4)', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                סיכום כולל חודשי ({currentMonthLabel})
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                מעודכן
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  סה"כ עלות חודשית כוללת למעסיק
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  (שכר ברוטו + פנסיה/פיצויים + ביטוח לאומי 3.6% + ביטוח בריאות)
                </span>
              </div>
              <div>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans', letterSpacing: '-1px' }} className="text-gradient-blue">
                  ₪{Math.round(totalEmployerMonthlyCost).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Direct Cash Payment to Employee Card */}
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.12)', 
              border: '1.5px solid rgba(16, 185, 129, 0.4)', 
              padding: '18px 20px', 
              borderRadius: 'var(--radius-lg)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
            }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wallet size={18} /> שכר נטו לתשלום בפועל לעובדת
                </h4>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  (תשלום חודשי עבור {currentMonthLabel} במזומן / העברה בנקאית)
                </span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.5px' }} className="text-gradient-emerald">
                ₪{Math.round(netWorkerSalary).toLocaleString()}
              </div>
            </div>
          </div>

          {/* EMPLOYER SOCIAL OBLIGATIONS BREAKDOWN */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: 'var(--accent-indigo)' }} />
              פירוט הפרשות סוציאליות וביטוחים (מעסיק)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span>פנסיה מעסיק (גמולים 6.5% משכר מינימום):</span>
                <span style={{ fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>₪{employerPension.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span>פיצויי פיטורין מעסיק (8.33% מהברוטו):</span>
                <span style={{ fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>₪{employerSeverance.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(99, 102, 241, 0.12)', borderRadius: 'var(--radius-sm)', borderRight: '3px solid var(--accent-indigo)', fontSize: '0.92rem', fontWeight: 700 }}>
                <span>סה"כ להפקדה חודשית לקופה/פקדון (פנסיה + פיצויים):</span>
                <span style={{ color: 'var(--accent-indigo)', fontFamily: 'Plus Jakarta Sans' }}>₪{employerSocialTotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span>ביטוח לאומי מעסיק (3.6% מהברוטו):</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'Plus Jakarta Sans' }}>₪{employerBituachLeumi.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span>עלות מעסיק נטו לביטוח בריאות פרטי:</span>
                <span style={{ fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>₪{netEmployerHealthInsurance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* DEDUCTIONS SUMMARY */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: 'var(--accent-amber)' }}>
              סיכום ניכויים מותרים משכר העובדת
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>ניכוי חלק עובדת לפנסיה (6%):</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans' }}>₪{workerPensionDeduction.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>ניכוי ביטוח בריאות:</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans' }}>₪{healthInsuranceDeduction.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>ניכוי מגורים וחשבונות (מים/חשמל):</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans' }}>₪{housingDeduction.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontWeight: 800, color: 'var(--accent-amber)' }}>
                <span>סה"כ ניכויים משכר ברוטו:</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans' }}>-₪{totalWorkerDeductions.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Visual Cost Distribution Bar */}
      <div className="glass-card" style={{ padding: '22px' }}>
        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '14px' }}>
          התפלגות עלות המעסיק לחודש {currentMonthLabel}
        </h4>
        <div style={{ width: '100%', height: '26px', background: 'rgba(255,255,255,0.05)', borderRadius: '13px', overflow: 'hidden', display: 'flex', padding: '2px', border: '1px solid var(--border-color)' }}>
          <div style={{ width: `${(netWorkerSalary / totalEmployerMonthlyCost) * 100}%`, background: 'var(--gradient-emerald)', borderRadius: '10px' }} title="נטו לעובדת" />
          <div style={{ width: `${(employerSocialTotal / totalEmployerMonthlyCost) * 100}%`, background: 'var(--gradient-brand)', borderRadius: '10px', marginRight: '2px' }} title="פנסיה ופיצויים" />
          <div style={{ width: `${(employerBituachLeumi / totalEmployerMonthlyCost) * 100}%`, background: 'var(--gradient-cyan)', borderRadius: '10px', marginRight: '2px' }} title="ביטוח לאומי" />
          <div style={{ width: `${(saturdayExtraTotal / totalEmployerMonthlyCost) * 100}%`, background: 'var(--gradient-amber)', borderRadius: '10px', marginRight: '2px' }} title="תוספת שבת" />
          <div style={{ width: `${(holidayExtraTotal / totalEmployerMonthlyCost) * 100}%`, background: 'var(--gradient-purple)', borderRadius: '10px', marginRight: '2px' }} title="תוספת חג" />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginTop: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
            נטו לעובדת: <strong style={{ color: 'var(--text-main)' }}>{Math.round((netWorkerSalary / totalEmployerMonthlyCost) * 100)}%</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-indigo)' }} />
            פנסיה/פיצויים (14%): <strong style={{ color: 'var(--text-main)' }}>{Math.round((employerSocialTotal / totalEmployerMonthlyCost) * 100)}%</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
            ביטוח לאומי (3.6%): <strong style={{ color: 'var(--text-main)' }}>{Math.round((employerBituachLeumi / totalEmployerMonthlyCost) * 100)}%</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
            תוספת שבת: <strong style={{ color: 'var(--text-main)' }}>{Math.round((saturdayExtraTotal / totalEmployerMonthlyCost) * 100)}%</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
