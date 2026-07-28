// Legal Rules & Updates Data for Foreign Caregiver Employment in Israel (2026)

export const LEGAL_RULES = {
  minimumMonthlySalary: 5880.02, // Israeli minimum monthly wage in NIS
  minimumHourlySalary: 32.30,   // Hourly rate
  employerPensionRate: 0.065,   // 6.5% pension contribution
  employerSeveranceRate: 0.06,  // 6.0% severance deposit (פיצויים)
  totalEmployerSocialRate: 0.125, // 12.5% total social contribution to Deposit Fund
  workerPensionDeductionRate: 0.06, // 6.0% deducted from worker salary
  employerBituachLeumiRate: 0.02, // 2.0% employer Bituach Leumi for foreign nursing worker
  
  // Maximum allowed legal deductions from salary (תקנות עובדים זרים)
  maxDeductions: {
    housingAndUtilities: 446.50, // Maximum allowed deduction for housing & utilities
    healthInsurance: 154.20,     // Maximum allowed deduction for private health insurance
    pocketMoneyAdvance: 433.33   // Weekly pocket money advance (100 NIS/week approx if advanced)
  },

  // Official Rights Summary
  rightsSummary: [
    { title: "שכר מינימום", detail: "חובה לשלם לפחות 5,880.02 ₪ לחודש (למשרה מלאה 182 שעות)." },
    { title: "הפרשות לפקדון / פנסיה", detail: "חובת מעסיק להפריש 12.5% (6.5% גמולים + 6% פיצויים) לחשבון פקדון עובדים זרים או קופת פנסיה." },
    { title: "דמי ביטוח לאומי", detail: "מעסיק בסיעוד משלם 2% לביטוח לאומי בגין העובד הזר." },
    { title: "מנוחה שבועית (שבת)", detail: "36 שעות רצופות בשבוע. אם העובד עובד בשבת, משולמת תוספת (בסיכום ביניכם: 400 ₪ לשבת)." },
    { title: "דמי חגים", detail: "העובד הזר זכאי ל-9 ימי חג בתשלום בשנה לפי דתו/בחירתו. עבודה בחג מקנה תוספת (400 ₪)." },
    { title: "ביטוח בריאות פרטי", detail: "חובת המעסיק לבטח את העובדת בביטוח בריאות פרטי יעודי לעובדים זרים (ניתן לנכות עד התקרה בחוק)." },
    { title: "חופשה שנתית ודמי הבראה", detail: "העובד זכאי לימי חופשה בתשלום ודמי הבראה החל מהשנה השנייה להעסקה." }
  ],

  // Legal Update Log (Simulated Live Regulatory Agent Feed)
  latestUpdates: [
    {
      id: "upd-2026-01",
      date: "2026-04-01",
      source: "רשות האוכלוסין וההגירה / משרד העבודה",
      title: "עדכון תקרת הניכויים המותרים עבור מגורים ונילווים לשנת 2026",
      summary: "עודכנו הסכומים המרביים שמותר למעסיק לנכות משכר עובד זר בסיעוד עבור מגורים, מים, חשמל וגז.",
      status: "בתוקף",
      type: "deductions"
    },
    {
      id: "upd-2026-02",
      date: "2026-01-01",
      source: "המוסד לביטוח לאומי",
      title: "הנחיות תשלום דמי ביטוח לאומי למעסיק פרטי בסיעוד",
      summary: "שיעור דמי הביטוח הלאומי לחלק המעסיק בעובד זר בסיעוד נותר 2.0% מכלל השכר המדווח.",
      status: "בתוקף",
      type: "bituach_leumi"
    },
    {
      id: "upd-2026-03",
      date: "2025-11-15",
      source: "משרד העבודה והרווחה",
      title: "חובת הפקדה לפקדון עובדים זרים בסיעוד (פנסיה ופיצויים)",
      summary: "תזכורת: אי הפקדה חודשית של 12.5% לפקדון עובדים זרים גוררת קנסות וביטול היתר ההעסקה.",
      status: "בתוקף",
      type: "pension"
    }
  ]
};
