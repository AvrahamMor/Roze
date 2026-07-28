// Legal Rules & Official April 2026 Terms for Foreign Caregiver Employment

export const LEGAL_RULES = {
  // Official April 2026 Document Values
  grossMonthlySalary: 6443.85, // Official April 2026 gross monthly salary (includes 100 NIS/week advance)
  minimumMonthlySalary: 5880.02, // Base minimum wage
  
  // Daily & Rates Updated (April 2026)
  saturdayExtraRate: 440,      // 440 NIS for 25h weekly rest (Saturday)
  holidayExtraRate: 440,       // 440 NIS for working on a holiday
  vacationDayValue: 257.75,    // 257.75 NIS value per vacation day
  convalescenceDayValue: 418,  // 418 NIS value per convalescence day (דמי הבראה)

  // Social & Tax Obligations
  employerPensionRate: 0.065,   // 6.5% pension contribution
  employerSeveranceRate: 0.0833, // 8.33% severance deposit (or 6% for resignation)
  employerSeveranceResignationRate: 0.06,
  employerBituachLeumiRate: 0.036, // 3.6% Bituach Leumi employer rate (April 2026 document)
  
  workerPensionDeductionRate: 0.06, // 6.0% worker pension deduction

  // Maximum allowed legal deductions
  maxDeductions: {
    housingAndUtilities: 446.50, 
    healthInsurance: 154.20,     
    weeklyAdvance: 433.33        // 100 NIS/week = ~433.33 NIS/month included in gross
  },

  // Vacation entitlement days by seniority
  vacationEntitlement: [
    { seniorityYears: '1-5', daysPerYear: 14, monthlyAccrualValue: (14 * 257.75) / 12 }, // ~300.71 NIS/mo
    { seniorityYears: '6', daysPerYear: 16, monthlyAccrualValue: (16 * 257.75) / 12 },   // ~343.67 NIS/mo
    { seniorityYears: '7+', daysPerYear: 18, monthlyAccrualValue: (18 * 257.75) / 12 }   // ~386.63 NIS/mo
  ],

  // Convalescence entitlement days by seniority
  convalescenceEntitlement: [
    { seniorityYears: '1', daysPerYear: 5, totalYearValue: 5 * 418, monthlyValue: (5 * 418) / 12 },     // ~174.17 NIS/mo
    { seniorityYears: '2-3', daysPerYear: 6, totalYearValue: 6 * 418, monthlyValue: (6 * 418) / 12 },   // ~209.00 NIS/mo
    { seniorityYears: '4-10', daysPerYear: 7, totalYearValue: 7 * 418, monthlyValue: (7 * 418) / 12 }  // ~243.83 NIS/mo
  ],

  // Agency & State Fees (Page 2)
  agencyFees: {
    placementFee: 2000,          // 2000 NIS placement fee (one time)
    monthlyAgencyFee: 70,        // 70 NIS / month (840 NIS / year)
    permitIssuanceAnnualFee: 370 // 370 NIS annual permit fee
  },

  latestUpdates: [
    {
      id: "upd-2026-04-official",
      date: "2026-04-01",
      source: "איתני מור - תנאי העסקה מעודכנים אפריל 2026",
      title: "עדכון תנאי העסקה: ברוטו 6,443.85 ₪, שבת/חג 440 ₪, ביטוח לאומי 3.6%",
      summary: "עודכנו הסכומים הרשמיים: שכר ברוטו 6,443.85 ₪, יום שבת/חג 440 ₪, יום חופשה 257.75 ₪, יום הבראה 418 ₪ ושיעור ביטוח לאומי 3.6%.",
      status: "בתוקף רשמי",
      type: "official_terms"
    }
  ]
};
