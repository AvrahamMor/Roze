// Contract & Caregiver Information extracted from user documents (Updated April 2026)
export const CONTRACT_DATA = {
  caregiver: {
    fullName: "Bijili Joseph",
    hebName: "ביג'ילי ג'וזף",
    passportNumber: "AK578266",
    countryOfOrigin: "הודו (India)",
    dateOfBirth: "14/10/1988",
    placementDate: "20/07/2026",
    visaType: "עובד זר בסיעוד (ב-1)",
    workPermitValidUntil: "31/05/2030",
    permitNumber: "46137071"
  },
  employer: {
    fullName: "מור רויטל (Mor Rvital)",
    idNumber: "027922814",
    address: "השלושה 16, פתח תקווה",
    relationship: "מטופלת / מעסיקה"
  },
  agency: {
    name: "איתני מור מטפלים סיעודיים בע\"מ",
    licenseNumber: "8146",
    companyId: "513994640",
    address: "הירקון 76, תל אביב",
    phone: "073-2509000",
    fax: "03-5162107",
    placementFee: 2000, 
    annualRegistrationFee: 840, // 70 ILS / month
    agreementPeriod: "22/07/2026 עד 22/07/2027"
  },
  agreedRates: {
    grossBaseSalary: 6443.85,    // Official April 2026 Gross Salary
    saturdayExtraRate: 440,      // Official April 2026 Rate per Saturday (440 NIS)
    holidayExtraRate: 440,       // Official April 2026 Rate per Holiday (440 NIS)
    vacationDayRate: 257.75,     // 257.75 NIS / day
    convalescenceDayRate: 418,   // 418 NIS / day
    defaultSaturdaysPerMonth: 1, 
    legalHolidaysQuota: 9        
  }
};
